import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Award, BookOpen, CheckCircle2, ListChecks, Route, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCourseCards, getViewer } from "@/lib/data";
import { CourseCardGrid } from "@/components/CourseCard";
import BadgeImage from "@/components/BadgeImage";
import StatTile from "@/components/StatTile";
import { ProgressBar, ProgressRing } from "@/components/Progress";
import { isComplete, pct, type LearningPath, type PathCourse } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My learning" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const viewer = await getViewer(supabase);
  if (!viewer.user) redirect("/login?next=/dashboard");

  const [cards, pathsRes, pcRes] = await Promise.all([
    getCourseCards(supabase, viewer.user.id),
    supabase.from("paths").select("*").eq("is_published", true).order("sort_order"),
    supabase.from("path_courses").select("*"),
  ]);
  const courses = cards.filter((c) => c.is_published);
  const byId = new Map(courses.map((c) => [c.id, c]));

  const mine = courses.filter((c) => c.enrolled);
  const completed = mine.filter(isComplete);
  const inProgress = mine.filter((c) => !isComplete(c)).sort((a, b) => pct(b.done, b.task_count) - pct(a.done, a.task_count));
  const badges = mine.filter((c) => c.badge_name);
  const earned = badges.filter(isComplete);
  const tasksDone = mine.reduce((s, c) => s + c.done, 0);
  const tasksTotal = mine.reduce((s, c) => s + c.task_count, 0);
  const overall = pct(tasksDone, tasksTotal);
  const recommended = courses
    .filter((c) => !c.enrolled)
    .sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || a.sort_order - b.sort_order)
    .slice(0, 3);

  const paths = (pathsRes.data ?? []) as LearningPath[];
  const pathCourses = (pcRes.data ?? []) as PathCourse[];
  const pathStats = paths
    .map((p) => {
      const list = pathCourses.filter((pc) => pc.path_id === p.id).map((pc) => byId.get(pc.course_id)).filter(Boolean);
      const doneCourses = list.filter((c) => c && isComplete(c)).length;
      const started = list.some((c) => c?.enrolled);
      return { ...p, total: list.length, doneCourses, started };
    })
    .filter((p) => p.total > 0);

  const name = viewer.profile?.username ?? viewer.user.email?.split("@")[0] ?? "learner";
  const focus = inProgress[0];

  return (
    <main>
      <section className="hero-band text-white">
        <div className="container-x flex flex-col gap-8 py-10 sm:py-12 md:flex-row md:items-center">
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-widest text-white/70">My learning</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Welcome back, {name} 👋</h1>
            <p className="mt-2 max-w-xl text-white/85">
              {mine.length === 0
                ? "Pick your first course and tick off your first task today. Small steps, every day."
                : completed.length === mine.length
                ? "Every course you started is complete. Time to pick the next one!"
                : `You've finished ${tasksDone} of ${tasksTotal} tasks across ${mine.length} course${mine.length === 1 ? "" : "s"}. Keep the momentum going.`}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {focus ? (
                <Link href={`/courses/${focus.slug}#tasks`} className="btn bg-white text-brand-700 hover:bg-brand-50">
                  Continue “{focus.title.length > 34 ? focus.title.slice(0, 34) + "…" : focus.title}” <ArrowRight size={16} />
                </Link>
              ) : (
                <Link href="/courses" className="btn bg-white text-brand-700 hover:bg-brand-50">
                  Browse courses <ArrowRight size={16} />
                </Link>
              )}
              <Link href="/paths" className="btn border border-white/30 text-white hover:bg-white/10">
                Follow a learning path
              </Link>
            </div>
          </div>
          {mine.length > 0 && (
            <div className="flex items-center gap-5 rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
              <ProgressRing value={overall} size={120} stroke={11} label="OVERALL" light />
              <div className="text-sm">
                <p className="font-display text-lg font-bold">Overall progress</p>
                <p className="text-white/80">
                  {tasksDone}/{tasksTotal} tasks
                </p>
                <p className="text-white/80">
                  {earned.length} badge{earned.length === 1 ? "" : "s"} earned
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="container-x -mt-px space-y-12 py-10">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile icon={<BookOpen size={22} />} label="Courses enrolled" value={mine.length} />
          <StatTile icon={<Sparkles size={22} />} label="In progress" value={inProgress.length} tone="sky" />
          <StatTile icon={<CheckCircle2 size={22} />} label="Completed" value={completed.length} tone="green" />
          <StatTile
            icon={<Award size={22} />}
            label="Badges earned"
            value={
              <>
                {earned.length}
                <span className="text-base font-bold text-body">/{badges.length || 0}</span>
              </>
            }
            tone="amber"
          />
        </section>

        {mine.length === 0 && (
          <section className="card flex flex-col items-center px-6 py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <ListChecks size={26} />
            </span>
            <h2 className="mt-4 font-display text-2xl font-bold text-ink">Your learning list is empty</h2>
            <p className="mt-2 max-w-md text-body">
              Open any course and tap <b>Add to my learning</b>, or just tick its first task — it&apos;ll show up here with your progress.
            </p>
            <Link href="/courses" className="btn-primary mt-6">
              Explore the catalog
            </Link>
          </section>
        )}

        {inProgress.length > 0 && (
          <section>
            <SectionHead title="Continue learning" href="/courses" link="Find more courses" />
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {inProgress.map((c) => (
                <CourseCardGrid key={c.id} c={c} />
              ))}
            </div>
          </section>
        )}

        {badges.length > 0 && (
          <section>
            <SectionHead title="Badge wall" subtitle="Badges light up when you finish every task of their course." />
            <div className="card grid grid-cols-2 gap-6 p-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {badges.map((c) => {
                const ok = isComplete(c);
                return (
                  <Link key={c.id} href={`/courses/${c.slug}`} className="group flex flex-col items-center text-center">
                    <div className="relative">
                      <BadgeImage src={c.badge_image_url} earned={ok} size={104} className="transition-transform group-hover:scale-105" />
                      {ok && (
                        <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-success text-white shadow">
                          <CheckCircle2 size={16} />
                        </span>
                      )}
                    </div>
                    <p className="mt-3 line-clamp-2 text-xs font-semibold text-ink">{c.badge_name}</p>
                    <p className={`mt-1 text-[11px] font-bold ${ok ? "text-success" : "text-brand-600"}`}>
                      {ok ? "Earned" : `${pct(c.done, c.task_count)}%`}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {pathStats.length > 0 && (
          <section>
            <SectionHead title="Learning paths" href="/paths" link="All paths" />
            <div className="grid gap-4 md:grid-cols-2">
              {pathStats.map((p) => {
                const v = pct(p.doneCourses, p.total);
                return (
                  <Link key={p.id} href={`/paths/${p.slug}`} className="card flex items-center gap-5 p-5 transition-shadow hover:shadow-lift">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Route size={22} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display font-bold text-ink">{p.title}</p>
                      <p className="text-xs text-body">
                        {p.doneCourses}/{p.total} courses complete{!p.started && " · not started"}
                      </p>
                      <ProgressBar value={v} className="mt-2.5" tone={v === 100 ? "success" : "brand"} />
                    </div>
                    <span className="text-sm font-bold text-brand-700">{v}%</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {completed.length > 0 && (
          <section>
            <SectionHead title="Completed" />
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {completed.map((c) => (
                <CourseCardGrid key={c.id} c={c} />
              ))}
            </div>
          </section>
        )}

        {recommended.length > 0 && (
          <section>
            <SectionHead title="Recommended next" href="/courses" link="See all" />
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {recommended.map((c) => (
                <CourseCardGrid key={c.id} c={c} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function SectionHead({ title, subtitle, href, link }: { title: string; subtitle?: string; href?: string; link?: string }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-body">{subtitle}</p>}
      </div>
      {href && link && (
        <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
          {link} <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}
