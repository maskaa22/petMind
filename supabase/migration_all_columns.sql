-- ============================================================
-- Run this once in Supabase → SQL Editor.
-- Adds every column the app expects (safe to run multiple times).
-- ============================================================

-- pets
alter table public.pets add column if not exists next_vaccination date;
alter table public.pets add column if not exists last_vaccination date;
alter table public.pets add column if not exists subspecies text;
alter table public.pets add column if not exists quiz jsonb;

-- journal entries
alter table public.journal_entries add column if not exists weight numeric;

-- Tell PostgREST to refresh its schema cache immediately.
notify pgrst, 'reload schema';
