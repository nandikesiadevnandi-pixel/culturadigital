-- Tabela de partidas de bafo
create table if not exists public.bafo_matches (
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
create table if not exists public.bafo_rankings (
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

-- Permissões para a API do banco
grant select, insert, update on public.bafo_matches to authenticated;
grant all on public.bafo_matches to service_role;

grant select, insert, update, delete on public.bafo_rankings to authenticated;
grant all on public.bafo_rankings to service_role;

-- RLS
alter table public.bafo_matches enable row level security;
create policy "Leitura de partidas da turma" on public.bafo_matches for select using (true);
create policy "Aluno cria desafio" on public.bafo_matches for insert with check (auth.uid() = challenger_id);
create policy "Participante atualiza partida" on public.bafo_matches for update using (
  auth.uid() = challenger_id or auth.uid() = challenged_id
);

alter table public.bafo_rankings enable row level security;
create policy "Leitura pública do ranking" on public.bafo_rankings for select using (true);
create policy "Aluno gerencia seu ranking" on public.bafo_rankings for all using (auth.uid() = user_id);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.update_bafo_match_timestamp()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
begin new.updated_at = now(); return new; end;
$$;

create trigger bafo_match_updated_at
  before update on public.bafo_matches
  for each row execute procedure public.update_bafo_match_timestamp();
