-- ============================================================
-- Migration 07 — run in Supabase SQL Editor
-- Track the last (done) vaccination date too (next_vaccination already exists).
-- ============================================================

alter table public.pets add column if not exists last_vaccination date;
