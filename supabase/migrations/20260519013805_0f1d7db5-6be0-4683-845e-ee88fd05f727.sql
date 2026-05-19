
-- Profiles: avatar 3D + theme
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_3d_url text,
  ADD COLUMN IF NOT EXISTS theme_palette text NOT NULL DEFAULT 'violet';

-- Chat messages per turma
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  author_name text NOT NULL,
  school text,
  class_name text NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_chat_class ON public.chat_messages (class_name, created_at DESC);
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's class
CREATE OR REPLACE FUNCTION public.current_user_class()
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT class_name FROM public.profiles WHERE user_id = auth.uid() LIMIT 1
$$;

DROP POLICY IF EXISTS "Members of class can read messages" ON public.chat_messages;
CREATE POLICY "Members of class can read messages"
  ON public.chat_messages FOR SELECT
  USING (
    class_name = public.current_user_class()
    OR public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "Members can post in own class" ON public.chat_messages;
CREATE POLICY "Members can post in own class"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND (class_name = public.current_user_class() OR public.has_role(auth.uid(), 'admin'))
  );

DROP POLICY IF EXISTS "Author or admin can delete" ON public.chat_messages;
CREATE POLICY "Author or admin can delete"
  ON public.chat_messages FOR DELETE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;

-- Class photos
CREATE TABLE IF NOT EXISTS public.class_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  author_name text NOT NULL,
  school text,
  class_name text NOT NULL,
  storage_path text NOT NULL,
  caption text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_photos_class ON public.class_photos (class_name, created_at DESC);
ALTER TABLE public.class_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Class members see photos" ON public.class_photos;
CREATE POLICY "Class members see photos"
  ON public.class_photos FOR SELECT
  USING (class_name = public.current_user_class() OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users insert own photos" ON public.class_photos;
CREATE POLICY "Users insert own photos"
  ON public.class_photos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Author or admin delete photo" ON public.class_photos;
CREATE POLICY "Author or admin delete photo"
  ON public.class_photos FOR DELETE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('class-photos', 'class-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: avatars (any auth user can read; user manages own folder)
DROP POLICY IF EXISTS "Avatars public read" ON storage.objects;
CREATE POLICY "Avatars public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users upload own avatar" ON storage.objects;
CREATE POLICY "Users upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users update own avatar" ON storage.objects;
CREATE POLICY "Users update own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users delete own avatar" ON storage.objects;
CREATE POLICY "Users delete own avatar"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage: class-photos
DROP POLICY IF EXISTS "Class photos public read" ON storage.objects;
CREATE POLICY "Class photos public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'class-photos');

DROP POLICY IF EXISTS "Users upload class photo" ON storage.objects;
CREATE POLICY "Users upload class photo"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'class-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users delete own class photo" ON storage.objects;
CREATE POLICY "Users delete own class photo"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'class-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
