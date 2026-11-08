-- ReachRadar · 0002 · tracks + private audio bucket (plan 1, task 10)

create type public.track_status as enum ('draft', 'published');
create type public.release_status as enum ('released', 'upcoming', 'demo');

create table public.tracks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  status public.track_status not null default 'draft',
  title text check (char_length(title) <= 100),
  featuring text check (char_length(featuring) <= 100),
  release_status public.release_status,
  release_date date,
  private_link text check (char_length(private_link) <= 500),
  explicit boolean not null default false,
  genre_primary text,
  genre_secondary text,
  moods text[] not null default '{}' check (cardinality(moods) <= 3),
  bpm int check (bpm between 40 and 250),
  musical_key text check (char_length(musical_key) <= 12),
  vocals text check (char_length(vocals) <= 40),
  duration_seconds int check (duration_seconds >= 0),
  isrc text check (isrc ~ '^[A-Z]{2}[A-Z0-9]{3}[0-9]{7}$'),
  rights_confirmed boolean not null default false,
  audio_path text,
  audio_format text check (audio_format in ('mp3', 'flac', 'wav')),
  audio_size_bytes bigint check (audio_size_bytes between 0 and 52428800),
  cover_path text,
  waveform jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  constraint published_requires_fields check (
    status = 'draft' or (
      audio_path is not null
      and cover_path is not null
      and title is not null
      and release_status is not null
      and genre_primary is not null
      and bpm is not null
      and rights_confirmed
    )
  )
);

create index tracks_owner_idx on public.tracks (owner_id, updated_at desc);

create or replace function public.tracks_touch()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.owner_id is distinct from old.owner_id then
    raise exception 'tracks.owner_id cannot change' using errcode = '42501';
  end if;
  new.updated_at := now();
  if new.status = 'published' and old.status = 'draft' then
    new.published_at := now();
  end if;
  return new;
end;
$$;

create trigger tracks_touch
  before update on public.tracks
  for each row execute function public.tracks_touch();

create or replace function public.tracks_set_published_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'published' then
    new.published_at := now();
  end if;
  return new;
end;
$$;

create trigger tracks_set_published_at
  before insert on public.tracks
  for each row execute function public.tracks_set_published_at();

-- ---------- RLS ----------
alter table public.tracks enable row level security;

create policy "owners see their tracks, everyone signed in sees published ones"
  on public.tracks for select
  to authenticated
  using (owner_id = (select auth.uid()) or status = 'published');

create policy "artists create their own tracks"
  on public.tracks for insert
  to authenticated
  with check (
    owner_id = (select auth.uid())
    and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'artist')
  );

create policy "owners update their tracks"
  on public.tracks for update
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "owners delete their tracks"
  on public.tracks for delete
  to authenticated
  using (owner_id = (select auth.uid()));

-- ---------- storage: private audio bucket ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'tracks',
  'tracks',
  false,
  52428800,
  array['audio/mpeg', 'audio/mp3', 'audio/flac', 'audio/x-flac', 'audio/wav', 'audio/x-wav', 'audio/wave', 'audio/vnd.wave']
)
on conflict (id) do nothing;

create policy "artists upload audio into their own folder"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'tracks' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "artists read their own audio"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'tracks' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "artists update their own audio"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'tracks' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "artists delete their own audio"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'tracks' and (storage.foldername(name))[1] = (select auth.uid())::text);
