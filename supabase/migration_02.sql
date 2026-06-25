-- ============================================================
-- Migration 02 — run in Supabase SQL Editor (after schema.sql)
-- Adds pets.quiz column + journal_entries table.
-- ============================================================

-- Store the full quiz answers on each pet (for the report).
alter table public.pets add column if not exists quiz jsonb;

-- Daily wellbeing log.
create table if not exists public.journal_entries (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  pet_id     uuid references public.pets (id) on delete cascade,
  mood       text,
  energy     int,
  appetite   int,
  sleep      int,
  notes      text,
  created_at timestamptz not null default now()
);

create index if not exists journal_user_id_idx on public.journal_entries (user_id);

alter table public.journal_entries enable row level security;

create policy "journal_select_own" on public.journal_entries
  for select using (auth.uid() = user_id);
create policy "journal_insert_own" on public.journal_entries
  for insert with check (auth.uid() = user_id);
create policy "journal_delete_own" on public.journal_entries
  for delete using (auth.uid() = user_id);
