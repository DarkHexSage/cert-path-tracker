# The Path — Certification Tracker

A free, deploy-ready web app built from the "Zero to Junior IT Support in 6 Months" roadmap.
Visitors see a live, public count of learners, badges earned, and site visits (social proof to
pull people in). Anyone can sign up with a username + email + password and check off every badge
and task as they go — progress is saved to their account.

**Stack:** Next.js 14 (App Router) · Supabase (auth + Postgres) · Tailwind CSS · deploys to Vercel.

---

## What you get

- **Landing page** — hero with live collective stats and the full 6-month roadmap.
- **Auth** — email/password sign up + log in (Supabase).
- **Dashboard** — personal progress ring, badge/task checklist, auto-saved per user.
- **Public counters** — learners, collective badges earned, and visit count, shown to everyone.

---

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**. Pick a name and a strong DB
   password. Wait for it to provision.
2. Open **SQL Editor → New query**, paste the entire contents of [`supabase/schema.sql`](./supabase/schema.sql),
   and click **Run**. This creates the tables, security rules, the auto-profile trigger, and the
   two public functions (`get_public_stats`, `increment_visits`).
3. **Recommended for a smooth signup:** go to **Authentication → Providers → Email** and turn
   **OFF** "Confirm email." New users then get access instantly. (Leave it on if you prefer email
   confirmation — the app handles both; the `/auth/callback` route completes the confirmation link.)
4. Grab your keys from **Project Settings → API**: the **Project URL** and the **anon public** key.

## 2. Run locally

```bash
npm install
cp .env.local.example .env.local      # then fill in the two values from step 1.4
npm run dev
```

Open http://localhost:3000.

`.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

Both are safe to expose in the browser — row-level security protects the data.

## 3. Deploy to Vercel

1. Push this folder to a GitHub repo.
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
3. Under **Environment Variables**, add the same two keys:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Deploy.**
5. In Supabase → **Authentication → URL Configuration**, set **Site URL** to your Vercel domain
   (e.g. `https://your-app.vercel.app`) and add it under **Redirect URLs** too. This makes
   email-confirmation links (if enabled) point back to your live site.

That's it — every push to `main` redeploys automatically.

---

## How progress & counts work

- **Progress** lives in the `progress` table, one row per completed item, locked to each user by
  row-level security. The dashboard reads/writes it directly from the browser.
- **User count** = rows in `profiles` (auto-created by a trigger on signup).
- **Badges earned together** = all `progress` rows of type `badge`, summed across everyone.
- **Visits** = a single `counters` row, bumped once per browser session via the
  `increment_visits` function (so a reload doesn't inflate it).

The roadmap content is in [`lib/roadmap.ts`](./lib/roadmap.ts). Edit labels, links, or items there.
**Don't change existing item `id`s** once people have progress — ids are how completions are stored.

## Notes

- No secret keys are shipped to the browser; only the anon key, which is designed to be public.
- If the stat figures show `—`, the env vars aren't set or the SQL hasn't been run yet.
- Tailwind, fonts, and the dossier/gold theme live in `tailwind.config.ts`, `app/globals.css`,
  and `app/layout.tsx`.
