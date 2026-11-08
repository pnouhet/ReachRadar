-- ReachRadar · admin role (2/2) · grant/revoke, role guard, admin rows hidden from regular users.
-- Spec: docs/superpowers/specs/2026-11-08-reachradar-admin-role-design.md

-- ---------- previous role (restored by revoke_admin) ----------
alter table public.profiles add column previous_role public.user_role;
alter table public.profiles
  add constraint profiles_previous_role_not_admin check (previous_role is null or previous_role <> 'admin');

-- ---------- is_admin: used by policies (security definer avoids RLS recursion on profiles) ----------
create or replace function public.is_admin(p_uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.profiles p where p.id = p_uid and p.role = 'admin');
$$;

revoke execute on function public.is_admin(uuid) from public, anon;
grant execute on function public.is_admin(uuid) to authenticated, service_role;

-- ---------- role guard: role / previous_role only change through grant_admin / revoke_admin ----------
create or replace function public.profiles_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.id is distinct from old.id then
    raise exception 'profiles.id cannot change' using errcode = '42501';
  end if;
  if (new.role is distinct from old.role or new.previous_role is distinct from old.previous_role)
     and coalesce(current_setting('rr.role_change', true), '') <> 'on' then
    raise exception 'profiles.role cannot change' using errcode = '42501';
  end if;
  if new.slug is distinct from old.slug then
    raise exception 'profiles.slug cannot change' using errcode = '42501';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

-- ---------- grant / revoke (service role only: run by `npm run admin:grant|admin:revoke`) ----------
create or replace function public.grant_admin(p_email text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_role public.user_role;
begin
  select u.id into v_id
    from auth.users u
   where lower(u.email) = lower(trim(p_email)) and u.email_confirmed_at is not null;
  if v_id is null then
    raise exception 'no confirmed account for %', p_email using errcode = 'P0002';
  end if;

  select p.role into v_role from public.profiles p where p.id = v_id;
  if v_role is null then
    raise exception 'no confirmed account for % (no profile)', p_email using errcode = 'P0002';
  end if;
  if v_role = 'admin' then
    return;
  end if;

  perform set_config('rr.role_change', 'on', true);
  update public.profiles set previous_role = v_role, role = 'admin' where id = v_id;
  perform set_config('rr.role_change', 'off', true);

  update auth.users
     set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'admin')
   where id = v_id;
end;
$$;

create or replace function public.revoke_admin(p_email text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_role public.user_role;
  v_previous public.user_role;
begin
  select u.id into v_id from auth.users u where lower(u.email) = lower(trim(p_email));
  if v_id is not null then
    select p.role, p.previous_role into v_role, v_previous from public.profiles p where p.id = v_id;
  end if;
  if v_id is null or v_role is distinct from 'admin' then
    raise exception '% is not an admin', p_email using errcode = 'P0001';
  end if;
  v_previous := coalesce(v_previous, 'artist');

  perform set_config('rr.role_change', 'on', true);
  update public.profiles set role = v_previous, previous_role = null where id = v_id;
  perform set_config('rr.role_change', 'off', true);

  update auth.users
     set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', v_previous::text)
   where id = v_id;

  -- Sign them out everywhere: their refresh tokens stop working (access tokens expire within the hour).
  delete from auth.sessions where user_id = v_id;
end;
$$;

revoke execute on function public.grant_admin(text) from public, anon, authenticated;
revoke execute on function public.revoke_admin(text) from public, anon, authenticated;
grant execute on function public.grant_admin(text) to service_role;
grant execute on function public.revoke_admin(text) to service_role;

-- ---------- policies: admin rows are invisible to regular users ----------
drop policy "profiles are readable by signed-in users" on public.profiles;
create policy "profiles are readable by signed-in users, admins only by admins"
  on public.profiles for select
  to authenticated
  using (role <> 'admin' or id = (select auth.uid()) or public.is_admin());

drop policy "owners see their tracks, everyone signed in sees published ones" on public.tracks;
create policy "owners see their tracks, signed-in users see published ones except admins'"
  on public.tracks for select
  to authenticated
  using (
    owner_id = (select auth.uid())
    or (status = 'published' and (not public.is_admin(owner_id) or public.is_admin()))
  );

drop policy "artists create their own tracks" on public.tracks;
create policy "artists and admins create their own tracks"
  on public.tracks for insert
  to authenticated
  with check (
    owner_id = (select auth.uid())
    and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role in ('artist', 'admin'))
  );
