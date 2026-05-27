-- ─────────────────────────────────────────────────────────
--  ÁLBUM DA COPA — schema completo
-- ─────────────────────────────────────────────────────────

-- Estatísticas do usuário no álbum (moedas, pacotes disponíveis)
CREATE TABLE IF NOT EXISTS album_user_stats (
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  coins        INTEGER NOT NULL DEFAULT 100,
  packs_avail  INTEGER NOT NULL DEFAULT 3,
  total_packs  INTEGER NOT NULL DEFAULT 0,
  legendaries  INTEGER NOT NULL DEFAULT 0,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inventário individual de figurinhas
CREATE TABLE IF NOT EXISTS album_inventory (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  card_id         TEXT NOT NULL,
  quantity        INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  acquired_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, card_id)
);

-- Propostas de troca
CREATE TABLE IF NOT EXISTS album_trades (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  to_user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  from_name       TEXT NOT NULL DEFAULT '',
  to_name         TEXT NOT NULL DEFAULT '',
  from_class      TEXT NOT NULL DEFAULT '',
  offered_cards   TEXT[] NOT NULL DEFAULT '{}',
  requested_cards TEXT[] NOT NULL DEFAULT '{}',
  message         TEXT,
  status          TEXT NOT NULL DEFAULT 'open'
                  CHECK (status IN ('open','pending','accepted','declined','cancelled')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Feed de atividades em tempo real (por turma/escola)
CREATE TABLE IF NOT EXISTS album_feed (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name   TEXT NOT NULL DEFAULT '',
  class_name  TEXT NOT NULL DEFAULT '',
  school      TEXT NOT NULL DEFAULT '',
  event_type  TEXT NOT NULL,
  payload     JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Chat da turma (para negociar trocas)
CREATE TABLE IF NOT EXISTS album_chat (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name   TEXT NOT NULL DEFAULT '',
  class_name  TEXT NOT NULL DEFAULT '',
  school      TEXT NOT NULL DEFAULT '',
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Desafios concluídos (evita duplicar recompensas)
CREATE TABLE IF NOT EXISTS album_challenge_done (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenge_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- ─── Row Level Security ───────────────────────────────────

ALTER TABLE album_user_stats     ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_inventory      ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_trades         ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_feed           ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_chat           ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_challenge_done ENABLE ROW LEVEL SECURITY;

-- album_user_stats: cada um vê/edita o próprio
CREATE POLICY "album_stats_self" ON album_user_stats
  FOR ALL USING (auth.uid() = user_id);

-- album_inventory: cada um vê/edita o próprio
CREATE POLICY "album_inv_self" ON album_inventory
  FOR ALL USING (auth.uid() = user_id);

-- album_inventory: leitura pública (para ver o inventário de colegas na troca)
CREATE POLICY "album_inv_read_all" ON album_inventory
  FOR SELECT USING (true);

-- album_trades: leitura pública dentro da mesma escola (filtragem no app)
CREATE POLICY "album_trades_read" ON album_trades
  FOR SELECT USING (true);

CREATE POLICY "album_trades_insert" ON album_trades
  FOR INSERT WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "album_trades_update" ON album_trades
  FOR UPDATE USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- album_feed: leitura pública
CREATE POLICY "album_feed_read" ON album_feed
  FOR SELECT USING (true);

CREATE POLICY "album_feed_insert" ON album_feed
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- album_chat: leitura pública
CREATE POLICY "album_chat_read" ON album_chat
  FOR SELECT USING (true);

CREATE POLICY "album_chat_insert" ON album_chat
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- album_challenge_done: cada um vê/edita o próprio
CREATE POLICY "album_challenge_self" ON album_challenge_done
  FOR ALL USING (auth.uid() = user_id);

-- ─── Realtime ─────────────────────────────────────────────
-- Habilitar Realtime nas tabelas de feed/chat/trades
ALTER PUBLICATION supabase_realtime ADD TABLE album_feed;
ALTER PUBLICATION supabase_realtime ADD TABLE album_chat;
ALTER PUBLICATION supabase_realtime ADD TABLE album_trades;
ALTER PUBLICATION supabase_realtime ADD TABLE album_inventory;
