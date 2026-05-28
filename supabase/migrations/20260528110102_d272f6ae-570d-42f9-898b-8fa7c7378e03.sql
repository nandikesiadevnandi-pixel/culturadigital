
-- ALBUM USER STATS
CREATE TABLE IF NOT EXISTS public.album_user_stats (
  user_id      UUID PRIMARY KEY,
  coins        INTEGER NOT NULL DEFAULT 100,
  packs_avail  INTEGER NOT NULL DEFAULT 3,
  total_packs  INTEGER NOT NULL DEFAULT 0,
  legendaries  INTEGER NOT NULL DEFAULT 0,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.album_user_stats TO authenticated;
GRANT ALL ON public.album_user_stats TO service_role;
ALTER TABLE public.album_user_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stats_select_own_or_admin" ON public.album_user_stats FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(),'admin'));
CREATE POLICY "stats_insert_own"          ON public.album_user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "stats_update_own"          ON public.album_user_stats FOR UPDATE USING (auth.uid() = user_id);

-- ALBUM INVENTORY
CREATE TABLE IF NOT EXISTS public.album_inventory (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL,
  card_id    TEXT NOT NULL,
  quantity   INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, card_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.album_inventory TO authenticated;
GRANT ALL ON public.album_inventory TO service_role;
ALTER TABLE public.album_inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inv_select_class" ON public.album_inventory FOR SELECT USING (
  auth.uid() = user_id
  OR has_role(auth.uid(),'admin')
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = album_inventory.user_id AND p.class_name = current_user_class())
);
CREATE POLICY "inv_insert_own" ON public.album_inventory FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "inv_update_own" ON public.album_inventory FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "inv_delete_own" ON public.album_inventory FOR DELETE USING (auth.uid() = user_id);

-- ALBUM TRADES
CREATE TABLE IF NOT EXISTS public.album_trades (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id    UUID NOT NULL,
  to_user_id      UUID,
  from_name       TEXT NOT NULL DEFAULT '',
  to_name         TEXT NOT NULL DEFAULT '',
  from_class      TEXT NOT NULL DEFAULT '',
  offered_cards   JSONB NOT NULL DEFAULT '[]'::jsonb,
  requested_cards JSONB NOT NULL DEFAULT '[]'::jsonb,
  message         TEXT,
  status          TEXT NOT NULL DEFAULT 'open',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.album_trades TO authenticated;
GRANT ALL ON public.album_trades TO service_role;
ALTER TABLE public.album_trades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "trades_select_class" ON public.album_trades FOR SELECT USING (
  from_class = current_user_class()
  OR auth.uid() = from_user_id
  OR auth.uid() = to_user_id
  OR has_role(auth.uid(),'admin')
);
CREATE POLICY "trades_insert_self" ON public.album_trades FOR INSERT WITH CHECK (auth.uid() = from_user_id);
CREATE POLICY "trades_update_participant" ON public.album_trades FOR UPDATE USING (
  auth.uid() = from_user_id OR auth.uid() = to_user_id
);

-- ALBUM FEED
CREATE TABLE IF NOT EXISTS public.album_feed (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL,
  user_name  TEXT NOT NULL DEFAULT '',
  class_name TEXT NOT NULL DEFAULT '',
  school     TEXT,
  event_type TEXT NOT NULL,
  payload    JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.album_feed TO authenticated;
GRANT ALL ON public.album_feed TO service_role;
ALTER TABLE public.album_feed ENABLE ROW LEVEL SECURITY;
CREATE POLICY "feed_select_all" ON public.album_feed FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "feed_insert_own" ON public.album_feed FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ALBUM CHAT
CREATE TABLE IF NOT EXISTS public.album_chat (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL,
  user_name  TEXT NOT NULL DEFAULT '',
  class_name TEXT NOT NULL DEFAULT '',
  school     TEXT,
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.album_chat TO authenticated;
GRANT ALL ON public.album_chat TO service_role;
ALTER TABLE public.album_chat ENABLE ROW LEVEL SECURITY;
CREATE POLICY "achat_select_class" ON public.album_chat FOR SELECT USING (
  class_name = current_user_class() OR has_role(auth.uid(),'admin')
);
CREATE POLICY "achat_insert_self" ON public.album_chat FOR INSERT WITH CHECK (
  auth.uid() = user_id AND (class_name = current_user_class() OR has_role(auth.uid(),'admin'))
);

-- ALBUM CHALLENGES DONE
CREATE TABLE IF NOT EXISTS public.album_challenge_done (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL,
  challenge_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);
GRANT SELECT, INSERT ON public.album_challenge_done TO authenticated;
GRANT ALL ON public.album_challenge_done TO service_role;
ALTER TABLE public.album_challenge_done ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chal_select_own" ON public.album_challenge_done FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(),'admin'));
CREATE POLICY "chal_insert_own" ON public.album_challenge_done FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Realtime
DO $$ BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.album_chat;        EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.album_feed;        EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.album_trades;      EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.album_inventory;   EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;
