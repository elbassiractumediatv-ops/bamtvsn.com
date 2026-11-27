create table if not exists public.advertisements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 120),
  media_url text not null,
  media_path text not null unique,
  media_type text not null check (media_type in ('image', 'video')),
  mime_type text not null,
  duration_seconds integer not null default 8 check (duration_seconds between 5 and 60),
  position integer not null default 0 check (position >= 0),
  is_active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists advertisements_public_playlist_idx
  on public.advertisements (is_active, position, created_at);

alter table public.advertisements enable row level security;

drop policy if exists "advertisements : lecture publique active" on public.advertisements;
create policy "advertisements : lecture publique active"
  on public.advertisements for select
  to anon, authenticated
  using (is_active or (select private.is_admin()));

drop policy if exists "advertisements : ajout admin" on public.advertisements;
create policy "advertisements : ajout admin"
  on public.advertisements for insert
  to authenticated
  with check ((select private.is_admin()));

drop policy if exists "advertisements : modification admin" on public.advertisements;
create policy "advertisements : modification admin"
  on public.advertisements for update
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

drop policy if exists "advertisements : suppression admin" on public.advertisements;
create policy "advertisements : suppression admin"
  on public.advertisements for delete
  to authenticated
  using ((select private.is_admin()));

revoke all on table public.advertisements from anon, authenticated;
grant select on table public.advertisements to anon, authenticated;
grant insert, update, delete on table public.advertisements to authenticated;
