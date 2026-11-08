-- ReachRadar · admin role (3/3) · is_admin() only answers for the caller.
-- is_admin(uuid) was exposed through the Data API and let any signed-in user ask whether an account is an admin.
-- Tracks now rely on profiles RLS (which already hides admin rows from non-admins) instead of a per-owner lookup.

drop policy "profiles are readable by signed-in users, admins only by admins" on public.profiles;
drop policy "owners see their tracks, signed-in users see published ones except admins'" on public.tracks;
drop function public.is_admin(uuid);

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin');
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated, service_role;

create policy "profiles are readable by signed-in users, admins only by admins"
  on public.profiles for select
  to authenticated
  using (role <> 'admin' or id = (select auth.uid()) or (select public.is_admin()));

create policy "owners see their tracks, signed-in users see published ones except admins'"
  on public.tracks for select
  to authenticated
  using (
    owner_id = (select auth.uid())
    -- the owner's profile row is invisible to non-admins when the owner is an admin
    or (status = 'published' and exists (select 1 from public.profiles p where p.id = tracks.owner_id))
  );
