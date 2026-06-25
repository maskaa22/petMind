-- ============================================================
-- Migration 03 — run in Supabase SQL Editor
-- Lets a logged-in user delete their own account.
-- Deleting the auth.users row cascades to profiles, pets and
-- journal_entries (all reference auth.users ON DELETE CASCADE).
-- ============================================================

create or replace function public.delete_account()
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$;

-- Only logged-in users may call it (and it only deletes *their own* row).
revoke all on function public.delete_account() from public;
grant execute on function public.delete_account() to authenticated;
