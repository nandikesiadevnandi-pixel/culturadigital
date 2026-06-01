-- Execute este SQL no Supabase Dashboard → SQL Editor

-- Tabela de times dos alunos
create table if not exists student_squads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  class_name text not null,
  owner_name text not null default '',
  team_name text not null,
  shield_config jsonb not null default '{}',
  jersey_color text not null default '#1E9B5F',
  jersey_style text not null default 'solid',
  formation text not null default '4-3-3',
  strategy text not null default 'ofensiva',
  lineup jsonb not null default '[]',
  power_score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tabela de partidas
create table if not exists student_squad_matches (
  id uuid primary key default gen_random_uuid(),
  class_name text not null,
  home_squad_id uuid not null references student_squads(id) on delete cascade,
  away_squad_id uuid not null references student_squads(id) on delete cascade,
  home_score integer not null default 0,
  away_score integer not null default 0,
  home_goals jsonb not null default '[]',
  away_goals jsonb not null default '[]',
  played_at timestamptz not null default now()
);

-- Tabela de comentários nas figurinhas
create table if not exists student_card_comments (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references student_cards(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null,
  body text not null check (char_length(body) <= 100),
  created_at timestamptz not null default now()
);

-- RLS: leitura pública (turma), escrita autenticada
alter table student_squads enable row level security;
create policy "Leitura pública de squads" on student_squads for select using (true);
create policy "Aluno gerencia próprio squad" on student_squads for all using (auth.uid() = user_id);

alter table student_squad_matches enable row level security;
create policy "Leitura pública de partidas" on student_squad_matches for select using (true);
create policy "Aluno insere partidas" on student_squad_matches for insert with check (
  exists (select 1 from student_squads where id = home_squad_id and user_id = auth.uid())
);

alter table student_card_comments enable row level security;
create policy "Leitura pública de comentários" on student_card_comments for select using (true);
create policy "Aluno comenta" on student_card_comments for insert with check (auth.uid() = user_id);
create policy "Aluno apaga próprio comentário" on student_card_comments for delete using (auth.uid() = user_id);
