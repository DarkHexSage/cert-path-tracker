import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Clock, Globe, Home, Pencil, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/data";
import CourseCover from "@/components/CourseCover";
import CourseWorkspace from "@/components/CourseWorkspace";
import { formatHours, type Course, type CourseTask } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = await createClient();
  const { data } = await supabase.from("courses").select("title, short_description").eq("slug", params.slug).maybeSingle();
  return { title: data?.title ?? "Course", description: data?.short_description ?? undefined };
}

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const viewer = await getViewer(supabase);

  const { data: courseRow } = await supabase.from("courses").select("*").eq("slug", params.slug).maybeSingle();
  if (!courseRow) notFound();
  const course = { ...(courseRow as Course), outcomes: (courseRow as Course).outcomes ?? [] };

  const userId = viewer.user?.id ?? null;
  const [tasksRes, progressRes, enrollRes, countsRes, pathsRes] = await Promise.all([
    supabase.from("course_tasks").select("*").eq("course_id", course.id).order("sort_order").order("created_at"),
    userId
      ? supabase.from("task_progress").select("task_id").eq("user_id", userId).eq("course_id", course.id)
      : Promise.resolve({ data: [] as { task_id: string }[] }),
    userId
      ? supabase.from("enrollments").select("course_id").eq("user_id", userId).eq("course_id", course.id).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase.rpc("course_learner_counts"),
    supabase.from("path_courses").select("stage, paths(slug, title, is_published)").eq("course_id", course.id),
  ]);

  const tasks = (tasksRes.data ?? []) as CourseTask[];
  const done = ((progressRes.data ?? []) as { task_id: string }[]).map((p) => p.task_id);
  const learners = Number(
    ((countsRes.data ?? []) as { course_id: string; learners: number }[]).find((r) => r.course_id === course.id)?.learners ?? 0
  );
  type PathJoin = { stage: string | null; paths: { slug: string; title: string; is_published: boolean } | null };
  const paths = ((pathsRes.data ?? []) as unknown as PathJoin[])
    .filter((p) => p.paths && p.paths.is_published)
    .map((p) => ({ slug: p.paths!.slug, title: p.paths!.title, stage: p.stage }));

  const hours = formatHours(course.duration_hours);

  return (
    <main>
      <section className="hero-band text-white">
        <div className="container-x py-10 sm:py-12">
          <nav className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-white/85" aria-label="Breadcrumb">
            <Link href="/" className="inline-flex items-center gap-1.5 hover:text-white">
              <Home size={15} /> Home
            </Link>
            <ChevronRight size={14} className="opacity-70" />
            <Link href="/courses" className="hover:text-white">
              Courses
            </Link>
            <ChevronRight size={14} className="opacity-70" />
            <Link href={`/courses?category=${encodeURIComponent(course.category)}`} className="hover:text-white">
              {course.category}
            </Link>
          </nav>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="chip bg-white/15 text-white">{course.provider}</span>
            <span className="chip bg-white/15 text-white">{course.level}</span>
            {course.is_free && <span className="chip bg-emerald-400/90 text-emerald-950">Free</span>}
            {!course.is_published && <span className="chip bg-amber-300 text-amber-950">Draft — only admins can see this</span>}
          </div>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-[42px]">
            {course.title}
          </h1>
          {course.short_description && <p className="mt-3 max-w-2xl text-base text-white/85 sm:text-lg">{course.short_description}</p>}
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/85">
            {hours && (
              <span className="inline-flex items-center gap-1.5">
                <Clock size={16} /> ~{hours}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Globe size={16} /> {course.language}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users size={16} /> {learners.toLocaleString()} learners
            </span>
            {viewer.isAdmin && (
              <Link href={`/admin/courses/${course.id}`} className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 font-semibold text-white hover:bg-white/25">
                <Pencil size={14} /> Edit course
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="container-x py-10">
        <CourseWorkspace
          course={course}
          tasks={tasks}
          initialDone={done}
          initialEnrolled={!!enrollRes.data}
          userId={userId}
          learners={learners}
          paths={paths}
        >
          <CourseCover
            cover={course.cover_url}
            badge={course.badge_image_url}
            category={course.category}
            title={course.title}
            badgeSize={170}
            className="aspect-[16/8] rounded-2xl shadow-card"
          />

          <section className="card p-6 sm:p-7">
            <h2 className="font-display text-xl font-bold text-ink">About this course</h2>
            <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-body">
              {(course.description || course.short_description || "No description yet.")
                .split(/\n{2,}/)
                .map((para, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {para}
                  </p>
                ))}
            </div>

            {course.outcomes.length > 0 && (
              <>
                <h3 className="mt-7 font-display text-lg font-bold text-ink">What you&apos;ll learn</h3>
                <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                  {course.outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-2.5 text-sm text-ink">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-success" />
                      {o}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        </CourseWorkspace>
      </div>
    </main>
  );
}
