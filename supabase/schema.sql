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
  age        numeric,                 -- years (add more fields anytime)
  weight     numeric,                 -- kg
  created_at timestamptz not null default now()
);

create index if not exists pets_user_id_idx on public.pets (user_id);

-- ── Row Level Security: users only touch their own rows ──
alter table public.profiles enable row level security;
alter table public.pets enable row level security;

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
