-- =============================================================
--  Certification Path Tracker — Supabase schema
--  Run this once in: Supabase Dashboard -> SQL Editor -> New query
-- =============================================================

-- ---------- PROFILES ----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  username    text not null,
  email       text,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- A user can read and update only their own profile row.
drop policy if exists "own profile read"   on public.profiles;
drop policy if exists "own profile update" on public.profiles;
create policy "own profile read"   on public.profiles for select using (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

-- Auto-create a profile whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- PROGRESS ----------
-- Presence of a row = that item is completed for that user.
create table if not exists public.progress (
  user_id    uuid not null references auth.users (id) on delete cascade,
  item_id    text not null,
  item_type  text not null check (item_type in ('badge', 'task')),
  created_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

alter table public.progress enable row level security;

drop policy if exists "own progress read"   on public.progress;
drop policy if exists "own progress insert" on public.progress;
drop policy if exists "own progress delete" on public.progress;
create policy "own progress read"   on public.progress for select using (auth.uid() = user_id);
create policy "own progress insert" on public.progress for insert with check (auth.uid() = user_id);
create policy "own progress delete" on public.progress for delete using (auth.uid() = user_id);

-- ---------- COUNTERS (site-wide visit counter) ----------
create table if not exists public.counters (
  name  text primary key,
  value bigint not null default 0
);

insert into public.counters (name, value)
values ('site_visits', 0)
on conflict (name) do nothing;

alter table public.counters enable row level security;
-- No direct policies: counters are only touched through the security-definer RPCs below.

-- ---------- PUBLIC RPCs ----------
-- Atomically record a visit and return the new total.
create or replace function public.increment_visits()
returns bigint
language plpgsql
security definer set search_path = public
as $$
declare
  new_value bigint;
begin
  update public.counters
     set value = value + 1
   where name = 'site_visits'
  returning value into new_value;
  return new_value;
end;
$$;

-- Aggregate public stats: learners, badges earned collectively, visits.
create or replace function public.get_public_stats()
returns json
language sql
security definer set search_path = public
stable
as $$
  select json_build_object(
    'users',  (select count(*) from public.profiles),
    'badges', (select count(*) from public.progress where item_type = 'badge'),
    'visits', (select coalesce(value, 0) from public.counters where name = 'site_visits')
  );
$$;

-- Allow anonymous + logged-in visitors to call the two public RPCs.
grant execute on function public.increment_visits()  to anon, authenticated;
grant execute on function public.get_public_stats()  to anon, authenticated;
