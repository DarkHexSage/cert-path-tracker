import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, CheckCircle2, Clock, ListChecks } from "lucide-react";
import PageHero from "@/components/PageHero";
import CourseCover from "@/components/CourseCover";
import { ProgressBar, ProgressRing } from "@/components/Progress";
import { createClient } from "@/lib/supabase/server";
import { getCourseCards, getViewer } from "@/lib/data";
import { formatHours, isComplete, pct, type CourseCardData, type LearningPath, type PathCourse } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = await createClient();
  const { data } = await supabase.from("paths").select("title").eq("slug", params.slug).maybeSingle();
  return { title: data?.title ?? "Learning path" };
}

export default async function PathPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const viewer = await getViewer(supabase);
  const { data: pathRow } = await supabase.from("paths").select("*").eq("slug", params.slug).maybeSingle();
  if (!pathRow) notFound();
  const path = pathRow as LearningPath;

  const [cards, pcRes] = await Promise.all([
    getCourseCards(supabase, viewer.user?.id ?? null),
    supabase.from("path_courses").select("*").eq("path_id", path.id).order("sort_order"),
  ]);
  const byId = new Map(cards.filter((c) => c.is_published).map((c) => [c.id, c]));
  const items = ((pcRes.data ?? []) as PathCourse[])
    .map((pc) => ({ stage: pc.stage ?? "Courses", course: byId.get(pc.course_id) }))
    .filter((x): x is { stage: string; course: CourseCardData } => !!x.course);

  const stages: { stage: string; courses: CourseCardData[] }[] = [];
  for (const it of items) {
    const last = stages[stages.length - 1];
    if (last && last.stage === it.stage) last.courses.push(it.course);
    else stages.push({ stage: it.stage, courses: [it.course] });
  }

  const all = items.map((i) => i.course);
  const done = all.filter(isComplete).length;
  const tasksDone = all.reduce((s, c) => s + c.done, 0);
  const tasksTotal = all.reduce((s, c) => s + c.task_count, 0);
  const hours = all.reduce((s, c) => s + (c.duration_hours ?? 0), 0);
  const next = all.find((c) => !isComplete(c));

  return (
    <main>
      <PageHero title={path.title} subtitle={path.subtitle ?? undefined} crumbs={[{ href: "/paths", label: "Learning paths" }, { label: path.title }]}>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
          <span className="inline-flex items-center gap-1.5">
            <BookOpen size={16} /> {all.length} courses
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ListChecks size={16} /> {tasksTotal} tasks
          </span>
          {hours > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Clock size={16} /> ~{Math.round(hours)} hours
            </span>
          )}
        </div>
      </PageHero>

      <div className="container-x grid gap-8 py-10 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          {path.description && <p className="card mb-8 p-6 text-[15px] leading-relaxed text-body">{path.description}</p>}

          <ol className="relative space-y-10 border-l-2 border-dashed border-brand-200 pl-6 sm:pl-8">
            {stages.map((s, si) => {
              const stageDone = s.courses.filter(isComplete).length === s.courses.length;
              return (
                <li key={s.stage + si} className="relative">
                  <span
                    className={`absolute -left-[39px] top-0 flex h-8 w-8 items-center justify-center rounded-full border-4 border-canvas text-xs font-extrabold sm:-left-[47px] ${
                      stageDone ? "bg-success text-white" : "bg-brand-600 text-white"
                    }`}
                  >
                    {stageDone ? <CheckCircle2 size={16} /> : si + 1}
                  </span>
                  <h2 className="font-display text-lg font-bold text-ink">{s.stage}</h2>
                  <div className="mt-4 space-y-3">
                    {s.courses.map((c) => {
                      const v = pct(c.done, c.task_count);
                      const ok = isComplete(c);
                      return (
                        <Link
                          key={c.id}
                          href={`/courses/${c.slug}`}
                          className={`group card flex items-center gap-4 overflow-hidden p-3 pr-5 transition-all hover:shadow-lift ${ok ? "ring-2 ring-emerald-200" : ""}`}
                        >
                          <CourseCover cover={c.cover_url} badge={c.badge_image_url} category={c.category} title={c.title} badgeSize={54} className="h-20 w-28 shrink-0 rounded-xl" />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-brand-600">{c.provider}</p>
                            <p className="truncate font-display font-bold text-ink group-hover:text-brand-700">{c.title}</p>
                            <p className="text-xs text-body">
                              {c.task_count} tasks{formatHours(c.duration_hours) ? ` · ${formatHours(c.duration_hours)}` : ""} · {c.level}
                            </p>
                            {c.enrolled && <ProgressBar value={v} tone={ok ? "success" : "brand"} className="mt-2 max-w-xs" />}
                          </div>
                          {ok ? (
                            <CheckCircle2 className="shrink-0 text-success" />
                          ) : c.enrolled ? (
                            <span className="shrink-0 text-sm font-bold text-brand-700">{v}%</span>
                          ) : (
                            <ArrowRight size={18} className="shrink-0 text-body group-hover:text-brand-700" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6 text-center">
            <p className="text-[11px] font-bold uppercase tracking-widest text-brand-600">Path progress</p>
            <div className="mt-4 flex justify-center">
              <ProgressRing value={pct(tasksDone, tasksTotal)} size={140} stroke={12} label="TASKS" />
            </div>
            <p className="mt-4 text-sm text-body">
              <b className="text-ink">{done}</b> of {all.length} courses complete
            </p>
            {next && (
              <Link href={viewer.user ? `/courses/${next.slug}#tasks` : "/signup"} className="btn-primary mt-5 w-full py-3">
                {viewer.user ? (next.enrolled ? "Continue path" : "Start next course") : "Join free to start"}
              </Link>
            )}
            {next && <p className="mt-2 text-xs text-body">Next up: {next.title}</p>}
          </div>
        </aside>
      </div>
    </main>
  );
}
