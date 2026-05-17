
CREATE TABLE public.code_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Meu site',
  html TEXT NOT NULL DEFAULT '',
  css TEXT NOT NULL DEFAULT '',
  js TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.code_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own projects" ON public.code_projects
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own projects" ON public.code_projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own projects" ON public.code_projects
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own projects" ON public.code_projects
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins view all projects" ON public.code_projects
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_code_projects_updated
BEFORE UPDATE ON public.code_projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.code_challenge_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  challenge_id TEXT NOT NULL,
  stars INTEGER NOT NULL DEFAULT 1,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, challenge_id)
);

ALTER TABLE public.code_challenge_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own challenge progress" ON public.code_challenge_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own challenge progress" ON public.code_challenge_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all challenge progress" ON public.code_challenge_progress
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_xp_on_code_challenge
AFTER INSERT ON public.code_challenge_progress
FOR EACH ROW EXECUTE FUNCTION public.recalc_user_xp();
