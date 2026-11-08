-- ReachRadar · 0001 · profiles, roles, slugs, image buckets (plan 1, task 3)

create extension if not exists unaccent with schema extensions;

create type public.user_role as enum ('artist', 'curator');
create type public.curator_type as enum ('playlist', 'label', 'radio', 'blog');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null,
  display_name text not null check (char_length(display_name) between 2 and 60),
  slug text not null unique,
  bio text check (char_length(bio) <= 300),
  location text check (char_length(location) <= 80),
  genres text[] not null default '{}' check (cardinality(genres) <= 5),
  links jsonb not null default '{}'::jsonb,
  avatar_path text,
  banner_path text,
  curator_type public.curator_type,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'One row per auth user. role is fixed at sign-up and mirrored into auth.users.raw_app_meta_data.role.';

-- ---------- slug ----------
create or replace function public.slugify_unique(name text)
returns text
language plpgsql
set search_path = ''
as $$
declare
  base text;
  candidate text;
  n int := 1;
begin
  base := lower(extensions.unaccent(coalesce(name, '')));
  base := regexp_replace(base, '[^a-z0-9]+', '-', 'g');
  base := regexp_replace(base, '(^-+|-+$)', '', 'g');
  if base = '' then
    base := 'user';
  end if;
  candidate := base;
  while exists (select 1 from public.profiles p where p.slug = candidate) loop
    n := n + 1;
    candidate := base || '-' || n;
  end loop;
  return candidate;
end;
$$;

-- ---------- profile creation on sign-up ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  v_role public.user_role;
  v_name text := btrim(coalesce(meta ->> 'display_name', ''));
  v_links jsonb := '{}'::jsonb;
begin
  if (meta ->> 'role') is null or (meta ->> 'role') not in ('artist', 'curator') then
    raise exception 'invalid or missing role in sign-up metadata' using errcode = '22023';
  end if;
  v_role := (meta ->> 'role')::public.user_role;

  if char_length(v_name) < 2 then
    v_name := split_part(coalesce(new.email, 'user'), '@', 1);
  end if;
  v_name := left(v_name, 60);

  if (meta ->> 'playlist_link') is not null then
    v_links := jsonb_build_object('playlist', meta ->> 'playlist_link');
  end if;

  insert into public.profiles (id, role, display_name, slug, curator_type, links)
  values (
    new.id,
    v_role,
    v_name,
    public.slugify_unique(v_name),
    case when v_role = 'curator' and (meta ->> 'curator_type') in ('playlist', 'label', 'radio', 'blog')
      then (meta ->> 'curator_type')::public.curator_type end,
    v_links
  );

  update auth.users
     set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', v_role::text)
   where id = new.id;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- immutable columns + updated_at ----------
create or replace function public.profiles_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.id is distinct from old.id then
    raise exception 'profiles.id cannot change' using errcode = '42501';
  end if;
  if new.role is distinct from old.role then
    raise exception 'profiles.role cannot change' using errcode = '42501';
  end if;
  if new.slug is distinct from old.slug then
    raise exception 'profiles.slug cannot change' using errcode = '42501';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_guard
  before update on public.profiles
  for each row execute function public.profiles_guard();

-- ---------- RLS ----------
alter table public.profiles enable row level security;

create policy "profiles are readable by signed-in users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "users update their own profile"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

revoke insert, delete on public.profiles from anon, authenticated;

-- ---------- storage: public image buckets ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('banners', 'banners', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('covers', 'covers', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "users upload images into their own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('avatars', 'banners', 'covers')
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "users update images in their own folder"
  on storage.objects for update
  to authenticated
  using (
    bucket_id in ('avatars', 'banners', 'covers')
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "users delete images in their own folder"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id in ('avatars', 'banners', 'covers')
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- Owners can list their own image files (public buckets serve reads by URL without a policy).
create policy "users read their own images"
  on storage.objects for select
  to authenticated
  using (
    bucket_id in ('avatars', 'banners', 'covers')
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
