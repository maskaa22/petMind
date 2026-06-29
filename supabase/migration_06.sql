-- ============================================================
-- Migration 06 — run in Supabase SQL Editor
-- Store the pet's subspecies (e.g. Hamster / Snake). For cat/dog/rabbit
-- it simply duplicates the type.
-- ============================================================

alter table public.pets add column if not exists subspecies text;
