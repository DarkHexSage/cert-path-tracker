-- =============================================================
--  Upgrade from the old "cert-path-tracker" (v1) to Path Academy.
--  Run AFTER schema.sql and seed.sql. Safe to re-run.
--
--  v1 stored one row per completed roadmap item in public.progress.
--  Every old item id now maps to a course task (course_tasks.legacy_key),
--  so learners keep everything they already ticked off.
-- =============================================================

do $$
begin
  if to_regclass('public.progress') is null then
    raise notice 'No v1 progress table found — nothing to migrate.';
    return;
  end if;

  -- 1) Old ticks -> task progress
  insert into public.task_progress (user_id, task_id, course_id, completed_at)
  select p.user_id, t.id, t.course_id, p.created_at
  from public.progress p
  join public.course_tasks t on t.legacy_key = p.item_id
  on conflict (user_id, task_id) do nothing;

  -- 2) A v1 badge meant the whole course was finished -> tick every task of it
  insert into public.task_progress (user_id, task_id, course_id, completed_at)
  select p.user_id, t.id, t.course_id, p.created_at
  from public.progress p
  join public.courses c on c.slug = p.item_id
  join public.course_tasks t on t.course_id = c.id
  where p.item_type = 'badge'
  on conflict (user_id, task_id) do nothing;

  -- 3) Enroll learners in every course they have progress in
  insert into public.enrollments (user_id, course_id, enrolled_at)
  select user_id, course_id, min(completed_at)
  from public.task_progress
  group by user_id, course_id
  on conflict (user_id, course_id) do nothing;
end $$;

-- The old table is left in place. Once you've checked the new dashboard:
--   drop table public.progress;
