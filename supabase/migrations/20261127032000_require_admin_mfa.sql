-- The admins SELECT policy still allows users to see their own membership for enrollment.
-- Existing admin-only policies (including Storage) use this helper for privileged access.
create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select auth.jwt()->>'aal') = 'aal2', false)
    and exists (
      select 1 from public.admins where user_id = (select auth.uid())
    );
$$;
