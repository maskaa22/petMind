-- ============================================================
-- Migration 05 — run in Supabase SQL Editor
-- Store weight per journal entry so we can chart weight over time.
-- ============================================================

alter table public.journal_entries add column if not exists weight numeric;
