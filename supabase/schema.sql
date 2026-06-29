-- ============================================================
-- PetMind — database schema
-- Run this in Supabase → SQL Editor → New query → Run.
-- ============================================================

-- ── profiles: one row per user (extra fields for auth.users) ──
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  name       text,
  prem       boolean not null default false,   -- true = premium account
  created_at timestamptz not null default now()
);

-- ── pets: a user can have many pets ──
create table if not exists public.pets (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  name       text not null,
  age              numeric,           -- years (add more fields anytime)
  weight           numeric,           -- kg
  last_vaccination date,              -- date the last vaccination was done
  next_vaccination date,              -- date of the next due vaccination
  subspecies       text,              -- e.g. Hamster / Snake (duplicates type for cat/dog/rabbit)
  quiz             jsonb,             -- full quiz answers (for the report)
  created_at       timestamptz not null default now()
);

-- ── journal_entries: daily wellbeing log per pet ──
create table if not exists public.journal_entries (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  pet_id     uuid references public.pets (id) on delete cascade,
  mood       text,
  energy     int,
  appetite   int,
  sleep      int,
  weight     numeric,
  notes      text,
  created_at timestamptz not null default now()
);

create index if not exists journal_user_id_idx on public.journal_entries (user_id);

create index if not exists pets_user_id_idx on public.pets (user_id);

-- ── Row Level Security: users only touch their own rows ──
alter table public.profiles enable row level security;
alter table public.pets enable row level security;
alter table public.journal_entries enable row level security;

-- profiles policies
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- pets policies
create policy "pets_select_own" on public.pets
  for select using (auth.uid() = user_id);
create policy "pets_insert_own" on public.pets
  for insert with check (auth.uid() = user_id);
create policy "pets_update_own" on public.pets
  for update using (auth.uid() = user_id);
create policy "pets_delete_own" on public.pets
  for delete using (auth.uid() = user_id);

-- journal policies
create policy "journal_select_own" on public.journal_entries
  for select using (auth.uid() = user_id);
create policy "journal_insert_own" on public.journal_entries
  for insert with check (auth.uid() = user_id);
create policy "journal_delete_own" on public.journal_entries
  for delete using (auth.uid() = user_id);

-- ── Auto-create a profile row whenever a user signs up ──
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data ->> 'name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Let a user delete their own account (cascades to all their data) ──
create or replace function public.delete_account()
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_account() from public;
grant execute on function public.delete_account() to authenticated;
