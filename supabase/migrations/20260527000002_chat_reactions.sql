-- ─── Chat: reply + reactions ─────────────────────────────────────────────────

-- Add reply + profile photo columns to chat_messages
ALTER TABLE chat_messages
  ADD COLUMN IF NOT EXISTS reply_to_id        UUID,
  ADD COLUMN IF NOT EXISTS reply_to_name      TEXT,
  ADD COLUMN IF NOT EXISTS reply_to_body      TEXT,
  ADD COLUMN IF NOT EXISTS profile_photo_url  TEXT;

-- Emoji reactions table
CREATE TABLE IF NOT EXISTS chat_reactions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id  UUID NOT NULL,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL DEFAULT '',
  class_name  TEXT NOT NULL DEFAULT '',
  emoji       TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

ALTER TABLE chat_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chat_reactions_select" ON chat_reactions FOR SELECT USING (true);
CREATE POLICY "chat_reactions_insert" ON chat_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "chat_reactions_delete" ON chat_reactions FOR DELETE USING (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE chat_reactions;

-- ─── Profile: avatar photo ────────────────────────────────────────────────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_photo_url TEXT;

-- ─── Storage bucket for profile avatars ──────────────────────────────────────
-- Run this in the Supabase Dashboard > Storage > New Bucket:
--   Name: avatars
--   Public: true
-- OR via SQL:
INSERT INTO storage.buckets (id, name, public)
  VALUES ('avatars', 'avatars', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "avatars_user_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "avatars_user_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
