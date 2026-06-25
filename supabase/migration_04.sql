-- ============================================================
-- Migration 04 — run in Supabase SQL Editor
-- Pet care: next vaccination date (weight column already exists).
-- ============================================================

alter table public.pets add column if not exists next_vaccination date;
