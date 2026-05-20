
-- 1) Add columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS nickname text,
  ADD COLUMN IF NOT EXISTS chat_photo_url text,
  ADD COLUMN IF NOT EXISTS chat_wallpaper text NOT NULL DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS is_blocked boolean NOT NULL DEFAULT false;

-- 2) Student credentials table (admin-only)
CREATE TABLE IF NOT EXISTS public.student_credentials (
  user_id uuid PRIMARY KEY,
  login_email text NOT NULL,
  plain_password text NOT NULL,
  full_name text NOT NULL,
  school text,
  class_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.student_credentials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read credentials" ON public.student_credentials;
CREATE POLICY "Admins read credentials" ON public.student_credentials
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage credentials" ON public.student_credentials;
CREATE POLICY "Admins manage credentials" ON public.student_credentials
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_student_credentials_updated_at
BEFORE UPDATE ON public.student_credentials
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Class settings (admin-only writes, everyone reads)
CREATE TABLE IF NOT EXISTS public.class_settings (
  class_name text PRIMARY KEY,
  chat_enabled boolean NOT NULL DEFAULT true,
  photos_enabled boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.class_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone read class settings" ON public.class_settings;
CREATE POLICY "Anyone read class settings" ON public.class_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage class settings" ON public.class_settings;
CREATE POLICY "Admins manage class settings" ON public.class_settings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_class_settings_updated_at
BEFORE UPDATE ON public.class_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4) Chat reply support
ALTER TABLE public.chat_messages
  ADD COLUMN IF NOT EXISTS reply_to_id uuid;

-- 5) Helper functions
CREATE OR REPLACE FUNCTION public.class_chat_enabled(_class text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE((SELECT chat_enabled FROM public.class_settings WHERE class_name = _class), true)
$$;

CREATE OR REPLACE FUNCTION public.class_photos_enabled(_class text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE((SELECT photos_enabled FROM public.class_settings WHERE class_name = _class), true)
$$;

CREATE OR REPLACE FUNCTION public.user_is_blocked(_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE((SELECT is_blocked FROM public.profiles WHERE user_id = _uid), false)
$$;

-- 6) Update chat_messages INSERT policy: respect class toggle + block flag
DROP POLICY IF EXISTS "Members can post in own class" ON public.chat_messages;
CREATE POLICY "Members can post in own class" ON public.chat_messages
  FOR INSERT
  WITH CHECK (
    (auth.uid() = user_id)
    AND NOT public.user_is_blocked(auth.uid())
    AND (
      (class_name = public.current_user_class() AND public.class_chat_enabled(class_name))
      OR public.has_role(auth.uid(), 'admin')
    )
  );

-- 7) Update class_photos INSERT policy: respect toggle + block flag
DROP POLICY IF EXISTS "Users insert own photos" ON public.class_photos;
CREATE POLICY "Users insert own photos" ON public.class_photos
  FOR INSERT
  WITH CHECK (
    (auth.uid() = user_id)
    AND NOT public.user_is_blocked(auth.uid())
    AND (
      public.class_photos_enabled(class_name)
      OR public.has_role(auth.uid(), 'admin')
    )
  );

-- 8) Extend handle_new_user to save plain_password into student_credentials
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  _is_admin BOOLEAN;
  _plain TEXT;
BEGIN
  INSERT INTO public.profiles (user_id, full_name, school, class_name, grade_year)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'school',
    NEW.raw_user_meta_data->>'class_name',
    NULLIF(NEW.raw_user_meta_data->>'grade_year', '')::INTEGER
  );

  _is_admin := NEW.email IN ('nandikesiadevnandi@gmail.com');

  IF _is_admin THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student');
  END IF;

  _plain := NEW.raw_user_meta_data->>'plain_password';
  IF _plain IS NOT NULL AND NOT _is_admin THEN
    INSERT INTO public.student_credentials (user_id, login_email, plain_password, full_name, school, class_name)
    VALUES (
      NEW.id,
      NEW.email,
      _plain,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      NEW.raw_user_meta_data->>'school',
      NEW.raw_user_meta_data->>'class_name'
    )
    ON CONFLICT (user_id) DO UPDATE
      SET plain_password = EXCLUDED.plain_password,
          login_email = EXCLUDED.login_email,
          full_name = EXCLUDED.full_name,
          school = EXCLUDED.school,
          class_name = EXCLUDED.class_name,
          updated_at = now();
  END IF;

  RETURN NEW;
END;
$function$;
