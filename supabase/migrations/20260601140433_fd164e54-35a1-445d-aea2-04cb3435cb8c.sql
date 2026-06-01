-- ── Tabela: student_cards ───────────────────────────────
CREATE TABLE public.student_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  class_name TEXT NOT NULL DEFAULT '',
  school TEXT,
  player_name TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Brasil',
  country_flag TEXT NOT NULL DEFAULT '🇧🇷',
  club TEXT NOT NULL DEFAULT '',
  position TEXT NOT NULL DEFAULT 'ATA',
  jersey_number INTEGER NOT NULL DEFAULT 10,
  foot TEXT NOT NULL DEFAULT 'Direito',
  jersey_color TEXT NOT NULL DEFAULT '#1E9B5F',
  jersey_style TEXT NOT NULL DEFAULT 'solid',
  frame TEXT NOT NULL DEFAULT 'gold',
  photo_url TEXT NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_cards TO authenticated;
GRANT ALL ON public.student_cards TO service_role;

ALTER TABLE public.student_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cards_select_class" ON public.student_cards
  FOR SELECT USING (
    (class_name = current_user_class())
    OR auth.uid() = user_id
    OR has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "cards_insert_own" ON public.student_cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cards_update_own" ON public.student_cards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "cards_delete_own" ON public.student_cards
  FOR DELETE USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_student_cards_updated
  BEFORE UPDATE ON public.student_cards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_student_cards_class ON public.student_cards(class_name);

-- ── Tabela: student_card_likes ──────────────────────────
CREATE TABLE public.student_card_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id UUID NOT NULL REFERENCES public.student_cards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  reaction TEXT NOT NULL DEFAULT 'like', -- 'like' | 'fire' | 'star'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(card_id, user_id, reaction)
);

GRANT SELECT, INSERT, DELETE ON public.student_card_likes TO authenticated;
GRANT ALL ON public.student_card_likes TO service_role;

ALTER TABLE public.student_card_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "card_likes_select_class" ON public.student_card_likes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.student_cards c
      WHERE c.id = student_card_likes.card_id
        AND (c.class_name = current_user_class() OR has_role(auth.uid(), 'admin'::app_role))
    )
  );

CREATE POLICY "card_likes_insert_own" ON public.student_card_likes
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.student_cards c
      WHERE c.id = student_card_likes.card_id
        AND c.class_name = current_user_class()
    )
  );

CREATE POLICY "card_likes_delete_own" ON public.student_card_likes
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_card_likes_card ON public.student_card_likes(card_id);

-- ── Storage bucket público ──────────────────────────────
INSERT INTO storage.buckets (id, name, public)
  VALUES ('student-cards', 'student-cards', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "student_cards_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'student-cards');

CREATE POLICY "student_cards_user_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'student-cards'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "student_cards_user_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'student-cards'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "student_cards_user_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'student-cards'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );