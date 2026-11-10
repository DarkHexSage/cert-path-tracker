# Path Academy

A free learning academy that organizes courses from their original creators (Cisco Networking
Academy, Linux Foundation, IBM SkillsBuild, AWS, …) and lets learners track their progress task
by task until they earn each badge.

**Stack:** Next.js 14 (App Router) · Supabase (auth, Postgres, storage) · Tailwind CSS · Vercel.

---

## Features

**For learners**
- **Course catalog** (`/courses`): list/grid view, search, sorting, pagination, and filters for
  category, provider, level, price and "my progress".
- **Course page** (`/courses/[slug]`): cover picture, description, "what you'll learn", the
  **badge you'll earn**, a **Go to course** button that links to the original creator, and a
  checklist. Each task you tick raises the course's progress %, and the badge lights up at 100%.
- **My learning dashboard** (`/dashboard`): overall progress ring, stats, continue-learning cards,
  a **badge wall**, learning-path progress, completed courses and recommendations.
- **Learning paths** (`/paths`): courses in a guided order, grouped by stage (e.g. *Month 1*).
- **Free resources** (`/resources`): YouTube channels and playlists.

**For you (admin)** at `/admin`
- Add or edit courses: title, provider, link, category, level, hours, language, price,
  description, outcomes, published/featured.
- Upload a **course picture** and a **badge image**, or paste their URLs. A course with no cover
  gets a colourful generated cover with its badge in the middle.
- Build each course's **to-do checklist**: add tasks one at a time, or paste a whole list at
  once. You can edit, reorder and delete tasks, and add an optional link to each.
- Build **learning paths** and order their courses by stage.
- See learner, enrollment and task-completion counts, plus your newest learners.

## Data model

| Table | What it holds |
|---|---|
| `profiles` | one row per user; `role` is `student` or `admin` |
| `courses` | the catalog, with each course linked to its original creator through `course_url` |
| `course_tasks` | the checklist items for each course |
| `enrollments` | the courses in each learner's "my learning" list |
| `task_progress` | one row per completed task per learner |
| `paths`, `path_courses` | learning paths and their ordered courses |

Progress for a course = completed tasks ÷ total tasks. A badge counts as earned when every task of
its course is done. All access is protected by row-level security: learners only see their own
progress, and only admins can write to courses, tasks or paths, or upload media.

---

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run these files in order:
   1. [`supabase/schema.sql`](./supabase/schema.sql) creates the tables, security rules, functions
      and the `course-media` storage bucket.
   2. [`supabase/seed.sql`](./supabase/seed.sql) adds the starter catalog: 20 courses, 115 tasks
      and the "Zero to Junior IT Support" path. It's optional, and safe to re-run.
   3. [`supabase/migrate-from-v1.sql`](./supabase/migrate-from-v1.sql) is **only needed if you're
      upgrading the old cert-path-tracker**. It converts every learner's old ticks into the new
      task progress and enrollments.
3. Optional: under **Authentication → Providers → Email**, turn off "Confirm email" so new users
   get in straight away.
4. Copy the **Project URL** and **anon key** from **Project Settings → API**.

## 2. Run locally

```bash
npm install
cp .env.local.example .env.local   # fill in the two values
npm run dev
```

## 3. Make yourself admin

Sign up in the app, then run this in the SQL Editor:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

Reload the page. **Admin** now appears in the navigation. Learners can't give themselves this role,
because the database only lets them update their own `username`.

## 4. Deploy to Vercel

Import the repo into Vercel and add `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY`. Then, in Supabase under **Authentication → URL Configuration**,
set the Site URL and Redirect URLs to your Vercel domain.

---

## Customizing

- **Name and copy:** `lib/site.ts`
- **Colours:** `tailwind.config.ts` (`brand` scale) and `app/globals.css`
- **Category cover colours:** `lib/categories.ts`. A category you invent gets a colour
  automatically.
- **Fonts:** self-hosted through `@fontsource-variable`, so they need no network access at build
  time.
- **Starter badge images:** `public/badges/*.png`
