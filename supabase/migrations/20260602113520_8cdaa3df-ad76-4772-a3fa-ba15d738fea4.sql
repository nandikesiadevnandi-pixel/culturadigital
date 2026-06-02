-- Tabela de times dos alunos
CREATE TABLE IF NOT EXISTS public.student_squads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  class_name text NOT NULL,
  owner_name text NOT NULL DEFAULT '',
  team_name text NOT NULL,
  shield_config jsonb NOT NULL DEFAULT '{}',
  jersey_color text NOT NULL DEFAULT '#1E9B5F',
  jersey_style text NOT NULL DEFAULT 'solid',
  formation text NOT NULL DEFAULT '4-3-3',
  strategy text NOT NULL DEFAULT 'ofensiva',
  lineup jsonb NOT NULL DEFAULT '[]',
  power_score integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_squads TO authenticated;
GRANT ALL ON public.student_squads TO service_role;

ALTER TABLE public.student_squads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "squads_select_all" ON public.student_squads
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "squads_insert_own" ON public.student_squads
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "squads_update_own" ON public.student_squads
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "squads_delete_own" ON public.student_squads
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Tabela de partidas
CREATE TABLE IF NOT EXISTS public.student_squad_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_name text NOT NULL,
  home_squad_id uuid NOT NULL REFERENCES public.student_squads(id) ON DELETE CASCADE,
  away_squad_id uuid NOT NULL REFERENCES public.student_squads(id) ON DELETE CASCADE,
  home_score integer NOT NULL DEFAULT 0,
  away_score integer NOT NULL DEFAULT 0,
  home_goals jsonb NOT NULL DEFAULT '[]',
  away_goals jsonb NOT NULL DEFAULT '[]',
  played_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.student_squad_matches TO authenticated;
GRANT ALL ON public.student_squad_matches TO service_role;

ALTER TABLE public.student_squad_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "matches_select_all" ON public.student_squad_matches
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "matches_insert_home_owner" ON public.student_squad_matches
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.student_squads WHERE id = home_squad_id AND user_id = auth.uid())
  );

-- Tabela de comentários nas figurinhas
CREATE TABLE IF NOT EXISTS public.student_card_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL REFERENCES public.student_cards(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  body text NOT NULL CHECK (char_length(body) <= 100),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, DELETE ON public.student_card_comments TO authenticated;
GRANT ALL ON public.student_card_comments TO service_role;

ALTER TABLE public.student_card_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "card_comments_select_all" ON public.student_card_comments
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "card_comments_insert_own" ON public.student_card_comments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "card_comments_delete_own" ON public.student_card_comments
  FOR DELETE TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));