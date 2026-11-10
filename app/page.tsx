import Link from "next/link";
import { ArrowRight, Award, CheckCircle2, ListChecks, MousePointerClick, Route, Search } from "lucide-react";
import Stats from "@/components/Stats";
import { CourseCardGrid } from "@/components/CourseCard";
import BadgeImage from "@/components/BadgeImage";
import { ProgressBar } from "@/components/Progress";
import { createClient } from "@/lib/supabase/server";
import { getCourseCards, getViewer } from "@/lib/data";
import { categoryStyle } from "@/lib/categories";
import { SITE } from "@/lib/site";
import type { CourseCardData, LearningPath } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  let courses: CourseCardData[] = [];
  let signedIn = false;
  let path: LearningPath | null = null;
  try {
    const supabase = await createClient();
    const viewer = await getViewer(supabase);
    signedIn = !!viewer.user;
    courses = (await getCourseCards(supabase, viewer.user?.id ?? null)).filter((c) => c.is_published);
    const { data } = await supabase.from("paths").select("*").eq("is_published", true).order("sort_order").limit(1);
    path = (data?.[0] as LearningPath) ?? null;
  } catch {
    // Supabase not configured — the page still renders.
  }

  const featured = [...courses]
    .sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || a.sort_order - b.sort_order)
    .slice(0, 6);
  const providers = [...new Set(courses.map((c) => c.provider))];
  const categories = [...new Set(courses.map((c) => c.category))].map((cat) => ({
    name: cat,
    count: courses.filter((c) => c.category === cat).length,
    badge: courses.find((c) => c.category === cat && c.badge_image_url)?.badge_image_url ?? null,
  }));
  const showcase = featured.filter((c) => c.badge_image_url).slice(0, 3);

  return (
    <main>
      {/* Hero */}
      <section className="hero-band relative overflow-hidden text-white">
        <div className="container-x grid items-center gap-12 py-16 lg:grid-cols-[1.15fr_1fr] lg:py-20">
          <div className="animate-fade-up">
            <span className="chip bg-white/15 text-white">
              <Award size={13} /> Free courses · real badges · one tracker
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Learn from the best.
              <br />
              <span className="text-brand-100">Track every step.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">{SITE.description}</p>

            <form action="/courses" className="mt-8 flex max-w-xl items-center gap-2 rounded-2xl bg-white p-2 shadow-lift">
              <Search size={20} className="ml-2 shrink-0 text-body" />
              <input
                name="q"
                placeholder="What do you want to learn? Linux, networking, cloud…"
                className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-ink placeholder:text-body/70 focus:outline-none"
                aria-label="Search courses"
              />
              <button className="btn-primary shrink-0">Search</button>
            </form>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={signedIn ? "/dashboard" : "/signup"} className="btn bg-white text-brand-700 hover:bg-brand-50">
                {signedIn ? "Go to my learning" : "Start learning free"} <ArrowRight size={16} />
              </Link>
              <Link href="/paths" className="btn border border-white/30 text-white hover:bg-white/10">
                Explore learning paths
              </Link>
            </div>
          </div>

          {/* Showcase collage */}
          <div className="relative hidden h-[420px] lg:block" aria-hidden="true">
            {showcase.map((c, i) => {
              const pos = [
                "left-6 top-2 rotate-[-5deg]",
                "right-0 top-28 rotate-[4deg]",
                "left-16 bottom-0 rotate-[-2deg]",
              ][i];
              const fake = [72, 40, 100][i];
              return (
                <div key={c.id} className={`absolute w-[290px] rounded-2xl bg-white p-4 text-ink shadow-[0_30px_60px_-20px_rgba(20,10,60,0.55)] ${pos}`}>
                  <div className="flex items-center gap-3">
                    <BadgeImage src={c.badge_image_url} size={58} />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-brand-600">{c.provider}</p>
                      <p className="line-clamp-2 text-sm font-bold leading-snug">{c.title}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-body">
                    <span>{fake === 100 ? "Badge earned" : `${Math.round((fake / 100) * c.task_count)}/${c.task_count} tasks`}</span>
                    <span className={fake === 100 ? "text-success" : "text-brand-700"}>{fake}%</span>
                  </div>
                  <ProgressBar value={fake} tone={fake === 100 ? "success" : "brand"} className="mt-1.5" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="container-x pb-12">
          <Stats countVisit />
        </div>
      </section>

      {/* Providers */}
      {providers.length > 0 && (
        <section className="border-b border-line bg-white">
          <div className="container-x flex flex-wrap items-center gap-x-8 gap-y-3 py-6">
            <span className="text-xs font-bold uppercase tracking-widest text-body">Courses from</span>
            {providers.map((p) => (
              <span key={p} className="font-display text-base font-bold text-ink/55">
                {p}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      <section className="container-x py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-brand-600">Start here</p>
            <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-ink">Popular courses</h2>
          </div>
          <Link href="/courses" className="btn-ghost">
            View all courses <ArrowRight size={16} />
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="card p-10 text-center text-body">
            No courses yet. Run <code className="rounded bg-canvas px-1.5">supabase/seed.sql</code> or add one from the admin panel.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <CourseCardGrid key={c.id} c={c} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="bg-white py-16">
          <div className="container-x">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink">Browse by category</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((cat) => {
                const s = categoryStyle(cat.name);
                return (
                  <Link
                    key={cat.name}
                    href={`/courses?category=${encodeURIComponent(cat.name)}`}
                    className="group flex items-center gap-4 rounded-2xl border border-line p-4 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card"
                  >
                    <span
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: `linear-gradient(135deg, ${s.from}, ${s.to})` }}
                    >
                      <BadgeImage src={cat.badge} size={40} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display font-bold text-ink group-hover:text-brand-700">{cat.name}</span>
                      <span className="text-sm text-body">
                        {cat.count} course{cat.count === 1 ? "" : "s"}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="container-x py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-brand-600">How it works</p>
          <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-ink">Your whole learning journey, in one place</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: <MousePointerClick size={22} />,
              t: "Pick a course",
              d: "Browse free courses from Cisco, the Linux Foundation, IBM, AWS and more. Each one links straight to its original creator.",
            },
            {
              icon: <ListChecks size={22} />,
              t: "Tick off tasks",
              d: "Every course comes with a step-by-step checklist. Your progress bar grows with each task you complete.",
            },
            {
              icon: <Award size={22} />,
              t: "Collect your badges",
              d: "Finish every task to light up the badge on your wall — then share it on Credly and LinkedIn.",
            },
          ].map((s, i) => (
            <div key={s.t} className="card relative p-7">
              <span className="absolute right-6 top-5 font-display text-5xl font-extrabold text-brand-50">0{i + 1}</span>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lift">{s.icon}</span>
              <h3 className="mt-5 font-display text-lg font-bold text-ink">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Path promo */}
      {path && (
        <section className="container-x">
          <div className="hero-band relative overflow-hidden rounded-3xl p-8 text-white sm:p-12">
            <div className="grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
              <div>
                <span className="chip bg-white/15 text-white">
                  <Route size={13} /> Learning path
                </span>
                <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{path.title}</h2>
                {path.subtitle && <p className="mt-1 font-semibold text-brand-100">{path.subtitle}</p>}
                {path.description && <p className="mt-4 max-w-xl text-white/85">{path.description}</p>}
                <Link href={`/paths/${path.slug}`} className="btn mt-6 bg-white text-brand-700 hover:bg-brand-50">
                  See the full path <ArrowRight size={16} />
                </Link>
              </div>
              <ul className="space-y-3">
                {["Month-by-month plan", "Every course and task in order", "Track your path progress live"].map((x) => (
                  <li key={x} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold backdrop-blur-sm">
                    <CheckCircle2 size={18} className="text-emerald-300" /> {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {!signedIn && (
        <section className="container-x pt-16">
          <div className="card flex flex-col items-center px-6 py-14 text-center">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink">Start today. Not Monday. Today.</h2>
            <p className="mt-3 max-w-xl text-body">
              Create a free account, add your first course and tick off your first task. Future you will be glad you started now.
            </p>
            <Link href="/signup" className="btn-primary mt-6 px-7 py-3">
              Create your free account
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
