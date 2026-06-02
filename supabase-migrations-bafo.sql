-- Execute no Supabase Dashboard → SQL Editor

-- Tabela de partidas de bafo
create table if not exists bafo_matches (
  id uuid primary key default gen_random_uuid(),
  class_name text not null,
  challenger_id uuid not null references auth.users(id) on delete cascade,
  challenged_id uuid not null references auth.users(id) on delete cascade,
  challenger_name text not null default '',
  challenged_name text not null default '',
  challenger_cards jsonb not null default '[]',
  challenged_cards jsonb not null default '[]',
  challenger_power integer,
  challenged_power integer,
  winner_id uuid references auth.users(id),
  winner_name text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tabela de ranking do bafo por turma
create table if not exists bafo_rankings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  class_name text not null,
  player_name text not null default '',
  wins integer not null default 0,
  losses integer not null default 0,
  cards_won integer not null default 0,
  cards_lost integer not null default 0,
  streak integer not null default 0,
  best_streak integer not null default 0,
  total_matches integer not null default 0,
  updated_at timestamptz not null default now()
);

-- RLS
alter table bafo_matches enable row level security;
create policy "Leitura de partidas da turma" on bafo_matches for select using (true);
create policy "Aluno cria desafio" on bafo_matches for insert with check (auth.uid() = challenger_id);
create policy "Participante atualiza partida" on bafo_matches for update using (
  auth.uid() = challenger_id or auth.uid() = challenged_id
);

alter table bafo_rankings enable row level security;
create policy "Leitura pública do ranking" on bafo_rankings for select using (true);
create policy "Aluno gerencia seu ranking" on bafo_rankings for all using (auth.uid() = user_id);

-- Trigger para atualizar updated_at em bafo_matches
create or replace function update_bafo_match_timestamp()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger bafo_match_updated_at before update on bafo_matches
  for each row execute procedure update_bafo_match_timestamp();
