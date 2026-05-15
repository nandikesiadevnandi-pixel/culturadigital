-- ============================================
-- FUNDAÇÃO: Roles, Profiles, XP
-- ============================================

-- 1. Enum de roles
CREATE TYPE public.app_role AS ENUM ('admin', 'student');

-- 2. Tabela de roles (separada do perfil — segurança)
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Função security definer pra checar role sem recursão
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4. Policies user_roles
CREATE POLICY "Users view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. Tabela de perfis
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  school TEXT,
  class_name TEXT,
  grade_year INTEGER CHECK (grade_year BETWEEN 1 AND 12),
  avatar_url TEXT,
  total_xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 6. Policies profiles
CREATE POLICY "Users view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 7. Trigger updated_at em profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Trigger: ao criar usuário, criar perfil + atribuir role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _is_admin BOOLEAN;
BEGIN
  -- Cria perfil com metadados do cadastro
  INSERT INTO public.profiles (user_id, full_name, school, class_name, grade_year)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'school',
    NEW.raw_user_meta_data->>'class_name',
    NULLIF(NEW.raw_user_meta_data->>'grade_year', '')::INTEGER
  );

  -- Email admin pré-cadastrado
  _is_admin := NEW.email IN ('nandidev.suporte@gmail.com');

  IF _is_admin THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student');
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 9. Histórico de XP
CREATE TABLE public.xp_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  source TEXT NOT NULL, -- 'lesson' | 'quiz' | 'game' | 'manual' | 'badge'
  source_id TEXT,
  reason TEXT,
  awarded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_xp_events_user ON public.xp_events(user_id, created_at DESC);

CREATE POLICY "Users view their own xp"
  ON public.xp_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins view all xp"
  ON public.xp_events FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users insert their own xp"
  ON public.xp_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins insert any xp"
  ON public.xp_events FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 10. Função pra somar XP no perfil automaticamente
CREATE OR REPLACE FUNCTION public.recalc_user_xp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _total INTEGER;
  _level INTEGER;
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO _total
  FROM public.xp_events WHERE user_id = NEW.user_id;

  -- Nível: cada 100 XP sobe 1 nível (mínimo 1)
  _level := GREATEST(1, (_total / 100) + 1);

  UPDATE public.profiles
  SET total_xp = _total, level = _level
  WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER recalc_xp_on_event
  AFTER INSERT ON public.xp_events
  FOR EACH ROW
  EXECUTE FUNCTION public.recalc_user_xp();