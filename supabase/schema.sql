-- =============================================================
--  Path Academy — Supabase schema (v2: courses, tasks, paths)
--  Run once in: Supabase Dashboard -> SQL Editor -> New query
--  Safe to re-run: every statement is idempotent.
--  Then run seed.sql (starter catalog) and, if you are upgrading
--  from the old tracker, migrate-from-v1.sql.
-- =============================================================

-- ---------- PROFILES ----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  username    text not null,
  email       text,
  created_at  timestamptz not null default now()
);

alter table public.profiles add column if not exists role text not null default 'student';
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('student', 'admin'));

alter table public.profiles enable row level security;

-- Is the current user an admin? Used by every write policy below.
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "own profile read"   on public.profiles;
drop policy if exists "own profile update" on public.profiles;
drop policy if exists "admin profile read" on public.profiles;
create policy "own profile read"   on public.profiles for select using (auth.uid() = id);
create policy "admin profile read" on public.profiles for select using (public.is_admin());
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

-- Learners may only change their username — never their role.
revoke update on public.profiles from anon, authenticated;
grant update (username) on public.profiles to authenticated;

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

-- ---------- COURSES ----------
-- A course always links out to its original creator (Cisco NetAcad,
-- Linux Foundation, IBM SkillsBuild, AWS...). We track progress here.
create table if not exists public.courses (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  title             text not null,
  provider          text not null,
  category          text not null default 'General',
  level             text not null default 'Beginner'
                    check (level in ('Beginner', 'Intermediate', 'Advanced')),
  language          text not null default 'English',
  duration_hours    numeric,
  is_free           boolean not null default true,
  short_description text,
  description       text,
  outcomes          text[] not null default '{}',
  cover_url         text,
  badge_name        text,
  badge_image_url   text,
  course_url        text,
  is_published      boolean not null default true,
  is_featured       boolean not null default false,
  sort_order        int not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.courses enable row level security;

drop policy if exists "courses read"  on public.courses;
drop policy if exists "courses write" on public.courses;
create policy "courses read"  on public.courses for select using (is_published or public.is_admin());
create policy "courses write" on public.courses for all using (public.is_admin()) with check (public.is_admin());

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists courses_touch on public.courses;
create trigger courses_touch before update on public.courses
  for each row execute function public.touch_updated_at();

-- ---------- COURSE TASKS ----------
-- The to-do list that drives a course's progress %.
create table if not exists public.course_tasks (
  id           uuid primary key default gen_random_uuid(),
  course_id    uuid not null references public.courses (id) on delete cascade,
  title        text not null,
  details      text,
  resource_url text,
  sort_order   int not null default 0,
  legacy_key   text unique,           -- maps old tracker item ids (v1 migration)
  created_at   timestamptz not null default now()
);
create index if not exists course_tasks_course_idx on public.course_tasks (course_id, sort_order);

alter table public.course_tasks enable row level security;

drop policy if exists "tasks read"  on public.course_tasks;
drop policy if exists "tasks write" on public.course_tasks;
create policy "tasks read" on public.course_tasks for select using (
  public.is_admin() or exists (
    select 1 from public.courses c where c.id = course_id and c.is_published
  )
);
create policy "tasks write" on public.course_tasks for all using (public.is_admin()) with check (public.is_admin());

-- ---------- ENROLLMENTS ("My courses") ----------
create table if not exists public.enrollments (
  user_id     uuid not null references auth.users (id) on delete cascade,
  course_id   uuid not null references public.courses (id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  primary key (user_id, course_id)
);

alter table public.enrollments enable row level security;

drop policy if exists "own enrollments read"   on public.enrollments;
drop policy if exists "own enrollments insert" on public.enrollments;
drop policy if exists "own enrollments delete" on public.enrollments;
drop policy if exists "admin enrollments read" on public.enrollments;
create policy "own enrollments read"   on public.enrollments for select using (auth.uid() = user_id);
create policy "own enrollments insert" on public.enrollments for insert with check (auth.uid() = user_id);
create policy "own enrollments delete" on public.enrollments for delete using (auth.uid() = user_id);
create policy "admin enrollments read" on public.enrollments for select using (public.is_admin());

-- ---------- TASK PROGRESS ----------
-- Presence of a row = that task is done for that user.
create table if not exists public.task_progress (
  user_id      uuid not null references auth.users (id) on delete cascade,
  task_id      uuid not null references public.course_tasks (id) on delete cascade,
  course_id    uuid not null references public.courses (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, task_id)
);
create index if not exists task_progress_user_course_idx on public.task_progress (user_id, course_id);

alter table public.task_progress enable row level security;

drop policy if exists "own task progress read"   on public.task_progress;
drop policy if exists "own task progress insert" on public.task_progress;
drop policy if exists "own task progress delete" on public.task_progress;
drop policy if exists "admin task progress read" on public.task_progress;
create policy "own task progress read"   on public.task_progress for select using (auth.uid() = user_id);
create policy "own task progress insert" on public.task_progress for insert with check (auth.uid() = user_id);
create policy "own task progress delete" on public.task_progress for delete using (auth.uid() = user_id);
create policy "admin task progress read" on public.task_progress for select using (public.is_admin());

-- ---------- LEARNING PATHS ----------
create table if not exists public.paths (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  subtitle     text,
  description  text,
  cover_url    text,
  is_published boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);

create table if not exists public.path_courses (
  path_id    uuid not null references public.paths (id) on delete cascade,
  course_id  uuid not null references public.courses (id) on delete cascade,
  stage      text,               -- e.g. "Month 1", "Step 2"
  sort_order int not null default 0,
  primary key (path_id, course_id)
);

alter table public.paths enable row level security;
alter table public.path_courses enable row level security;

drop policy if exists "paths read"        on public.paths;
drop policy if exists "paths write"       on public.paths;
drop policy if exists "path courses read" on public.path_courses;
drop policy if exists "path courses write" on public.path_courses;
create policy "paths read"  on public.paths for select using (is_published or public.is_admin());
create policy "paths write" on public.paths for all using (public.is_admin()) with check (public.is_admin());
create policy "path courses read"  on public.path_courses for select using (true);
create policy "path courses write" on public.path_courses for all using (public.is_admin()) with check (public.is_admin());

-- ---------- COUNTERS (site-wide visit counter) ----------
create table if not exists public.counters (
  name  text primary key,
  value bigint not null default 0
);
insert into public.counters (name, value) values ('site_visits', 0) on conflict (name) do nothing;
alter table public.counters enable row level security;

-- ---------- PUBLIC RPCs ----------
create or replace function public.increment_visits()
returns bigint
language plpgsql
security definer set search_path = public
as $$
declare new_value bigint;
begin
  update public.counters set value = value + 1 where name = 'site_visits'
  returning value into new_value;
  return new_value;
end;
$$;

-- (user, course) pairs where every task is done.
create or replace function public.completed_enrollments()
returns table (user_id uuid, course_id uuid)
language sql
security definer set search_path = public
stable
as $$
  select e.user_id, e.course_id
  from public.enrollments e
  where exists (select 1 from public.course_tasks t where t.course_id = e.course_id)
    and not exists (
      select 1 from public.course_tasks t
      where t.course_id = e.course_id
        and not exists (
          select 1 from public.task_progress p where p.task_id = t.id and p.user_id = e.user_id
        )
    );
$$;
revoke execute on function public.completed_enrollments() from public, anon, authenticated;

create or replace function public.get_public_stats()
returns json
language sql
security definer set search_path = public
stable
as $$
  select json_build_object(
    'users',   (select count(*) from public.profiles),
    'courses', (select count(*) from public.courses where is_published),
    'badges',  (select count(*) from public.completed_enrollments() ce
                  join public.courses c on c.id = ce.course_id
                 where c.badge_name is not null),
    'tasks',   (select count(*) from public.task_progress),
    'visits',  (select coalesce(value, 0) from public.counters where name = 'site_visits')
  );
$$;

-- Learner counts per course (social proof on course cards).
create or replace function public.course_learner_counts()
returns table (course_id uuid, learners bigint)
language sql
security definer set search_path = public
stable
as $$
  select course_id, count(*) from public.enrollments group by course_id;
$$;

grant execute on function public.increment_visits()      to anon, authenticated;
grant execute on function public.get_public_stats()      to anon, authenticated;
grant execute on function public.course_learner_counts() to anon, authenticated;

-- ---------- STORAGE (course covers + badge images) ----------
insert into storage.buckets (id, name, public)
values ('course-media', 'course-media', true)
on conflict (id) do nothing;

drop policy if exists "course media public read"  on storage.objects;
drop policy if exists "course media admin insert" on storage.objects;
drop policy if exists "course media admin update" on storage.objects;
drop policy if exists "course media admin delete" on storage.objects;
create policy "course media public read"  on storage.objects for select using (bucket_id = 'course-media');
create policy "course media admin insert" on storage.objects for insert with check (bucket_id = 'course-media' and public.is_admin());
create policy "course media admin update" on storage.objects for update using (bucket_id = 'course-media' and public.is_admin());
create policy "course media admin delete" on storage.objects for delete using (bucket_id = 'course-media' and public.is_admin());

-- =============================================================
--  Make yourself admin (run after you sign up in the app):
--    update public.profiles set role = 'admin' where email = 'you@example.com';
-- =============================================================
