
ALTER TABLE public.chat_messages
  ADD COLUMN IF NOT EXISTS reply_to_name      TEXT,
  ADD COLUMN IF NOT EXISTS reply_to_body      TEXT,
  ADD COLUMN IF NOT EXISTS profile_photo_url  TEXT;

CREATE TABLE IF NOT EXISTS public.chat_reactions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id  UUID NOT NULL,
  user_id     UUID NOT NULL,
  author_name TEXT NOT NULL DEFAULT '',
  class_name  TEXT NOT NULL DEFAULT '',
  emoji       TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

GRANT SELECT, INSERT, DELETE ON public.chat_reactions TO authenticated;
GRANT SELECT ON public.chat_reactions TO anon;
GRANT ALL ON public.chat_reactions TO service_role;

ALTER TABLE public.chat_reactions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='chat_reactions' AND policyname='chat_reactions_select') THEN
    CREATE POLICY "chat_reactions_select" ON public.chat_reactions FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='chat_reactions' AND policyname='chat_reactions_insert') THEN
    CREATE POLICY "chat_reactions_insert" ON public.chat_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='chat_reactions' AND policyname='chat_reactions_delete') THEN
    CREATE POLICY "chat_reactions_delete" ON public.chat_reactions FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_reactions;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_photo_url TEXT;

INSERT INTO storage.buckets (id, name, public)
  VALUES ('avatars', 'avatars', true)
  ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='avatars_public_read') THEN
    CREATE POLICY "avatars_public_read" ON storage.objects
      FOR SELECT USING (bucket_id = 'avatars');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='avatars_user_upload') THEN
    CREATE POLICY "avatars_user_upload" ON storage.objects
      FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='avatars_user_delete') THEN
    CREATE POLICY "avatars_user_delete" ON storage.objects
      FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;
