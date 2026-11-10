"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  BarChart3,
  Check,
  Clock,
  ExternalLink,
  Globe,
  ListChecks,
  Lock,
  PartyPopper,
  Route,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import BadgeImage from "./BadgeImage";
import { ProgressBar, ProgressRing } from "./Progress";
import { formatHours, pct, type Course, type CourseTask } from "@/lib/types";

export default function CourseWorkspace({
  course,
  tasks,
  initialDone,
  initialEnrolled,
  userId,
  learners,
  paths,
  children,
}: {
  course: Course;
  tasks: CourseTask[];
  initialDone: string[];
  initialEnrolled: boolean;
  userId: string | null;
  learners: number;
  paths: { slug: string; title: string; stage: string | null }[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [done, setDone] = useState<Set<string>>(() => new Set(initialDone));
  const [enrolled, setEnrolled] = useState(initialEnrolled || initialDone.length > 0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmLeave, setConfirmLeave] = useState(false);

  const total = tasks.length;
  const progress = pct(done.size, total);
  const complete = total > 0 && done.size >= total;
  const nextTask = tasks.find((t) => !done.has(t.id));
  const loginHref = `/login?next=/courses/${course.slug}`;

  async function ensureEnrolled() {
    if (enrolled || !userId) return true;
    const { error } = await supabase
      .from("enrollments")
      .upsert({ user_id: userId, course_id: course.id }, { onConflict: "user_id,course_id" });
    if (error) {
      setError(error.message);
      return false;
    }
    setEnrolled(true);
    return true;
  }

  async function enroll() {
    if (!userId) return router.push(loginHref);
    setBusy(true);
    setError(null);
    await ensureEnrolled();
    setBusy(false);
    router.refresh();
  }

  async function leave() {
    if (!userId) return;
    setBusy(true);
    setError(null);
    const a = await supabase.from("task_progress").delete().eq("user_id", userId).eq("course_id", course.id);
    const b = await supabase.from("enrollments").delete().eq("user_id", userId).eq("course_id", course.id);
    setBusy(false);
    if (a.error || b.error) return setError((a.error ?? b.error)!.message);
    setDone(new Set());
    setEnrolled(false);
    setConfirmLeave(false);
    router.refresh();
  }

  async function toggle(task: CourseTask) {
    if (!userId) return router.push(loginHref);
    setError(null);
    const was = done.has(task.id);
    const flip = (on: boolean) =>
      setDone((prev) => {
        const next = new Set(prev);
        if (on) next.add(task.id);
        else next.delete(task.id);
        return next;
      });
    flip(!was);
    if (!(await ensureEnrolled())) return flip(was);
    const { error } = was
      ? await supabase.from("task_progress").delete().eq("user_id", userId).eq("task_id", task.id)
      : await supabase
          .from("task_progress")
          .upsert({ user_id: userId, task_id: task.id, course_id: course.id }, { onConflict: "user_id,task_id" });
    if (error) {
      flip(was);
      setError(error.message);
    }
  }

  const hours = formatHours(course.duration_hours);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* Left column */}
      <div className="min-w-0 space-y-8">
        {children}

        <section className="card p-6 sm:p-7" id="tasks">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold text-ink">Your course checklist</h2>
              <p className="mt-1 text-sm text-body">
                Tick each task as you finish it on {course.provider}. Your progress updates instantly.
              </p>
            </div>
            <span className="text-sm font-bold text-brand-700">
              {done.size}/{total} done
            </span>
          </div>
          <ProgressBar value={progress} tone={complete ? "success" : "brand"} className="mt-4" />

          {complete && (
            <div className="mt-5 flex items-center gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 animate-fade-up">
              <PartyPopper className="shrink-0 text-success" />
              <div className="text-sm">
                <p className="font-bold text-emerald-800">
                  {course.badge_name ? "Badge unlocked — congratulations!" : "Course completed — great work!"}
                </p>
                <p className="text-emerald-700">
                  {course.badge_name
                    ? `Don't forget to share "${course.badge_name}" on LinkedIn.`
                    : "Pick your next course and keep the streak going."}
                </p>
              </div>
            </div>
          )}

          {total === 0 ? (
            <p className="mt-6 rounded-xl bg-canvas p-5 text-sm text-body">No tasks have been added to this course yet.</p>
          ) : (
            <ol className="mt-6 space-y-2.5">
              {tasks.map((t, i) => {
                const isDone = done.has(t.id);
                const isNext = nextTask?.id === t.id && enrolled;
                return (
                  <li key={t.id}>
                    <div
                      className={`flex items-start gap-3.5 rounded-xl border p-3.5 transition-all ${
                        isDone
                          ? "border-emerald-200 bg-emerald-50/60"
                          : isNext
                          ? "border-brand-300 bg-brand-50/60 ring-4 ring-brand-50"
                          : "border-line bg-white hover:border-brand-200"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggle(t)}
                        aria-pressed={isDone}
                        aria-label={isDone ? `Mark "${t.title}" as not done` : `Mark "${t.title}" as done`}
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                          isDone ? "border-success bg-success text-white" : "border-line bg-white hover:border-brand-400"
                        }`}
                      >
                        {isDone ? (
                          <Check size={15} strokeWidth={3} className="animate-pop-in" />
                        ) : !userId ? (
                          <Lock size={11} className="text-body/60" />
                        ) : null}
                      </button>
                      <button type="button" onClick={() => toggle(t)} className="min-w-0 flex-1 text-left">
                        <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-body/70">
                          Step {i + 1}
                          {isNext && <span className="chip bg-brand-600 py-0.5 text-white">Up next</span>}
                        </span>
                        <span className={`mt-0.5 block text-[15px] font-semibold leading-snug ${isDone ? "text-ink/60 line-through decoration-emerald-400" : "text-ink"}`}>
                          {t.title}
                        </span>
                        {t.details && <span className="mt-1 block text-sm text-body">{t.details}</span>}
                      </button>
                      {t.resource_url && (
                        <a
                          href={t.resource_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-body hover:bg-brand-50 hover:text-brand-700"
                          aria-label={`Open resource for ${t.title}`}
                        >
                          <ExternalLink size={15} />
                        </a>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          {!userId && total > 0 && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-brand-50 p-4 text-sm">
              <span className="font-medium text-brand-800">Create a free account to track your progress on this course.</span>
              <Link href={loginHref} className="btn-primary">
                Sign in to track
              </Link>
            </div>
          )}
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </section>
      </div>

      {/* Right column */}
      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <div className="card overflow-hidden">
          <div className="relative flex flex-col items-center bg-gradient-to-b from-brand-50 to-white px-6 pb-5 pt-7 text-center">
            <p className="text-[11px] font-bold uppercase tracking-widest text-brand-600">
              {course.badge_name ? "Badge you'll earn" : "Completion"}
            </p>
            <div className={`mt-4 ${complete ? "animate-pop-in" : ""}`}>
              <BadgeImage src={course.badge_image_url} earned={complete} size={150} />
            </div>
            <p className="mt-4 font-display text-base font-bold leading-snug text-ink">
              {course.badge_name ?? course.title}
            </p>
            <p className="mt-1 text-xs text-body">
              {complete ? "Earned 🎉" : course.badge_name ? `Issued by ${course.provider}` : "Finish every task to complete"}
            </p>
          </div>

          <div className="border-t border-line p-6">
            {enrolled ? (
              <div className="flex items-center gap-4">
                <ProgressRing value={progress} size={84} stroke={8} />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink">{complete ? "All tasks complete" : "Your progress"}</p>
                  <p className="text-xs text-body">
                    {done.size} of {total} tasks done
                  </p>
                  {nextTask && <p className="mt-1.5 line-clamp-2 text-xs text-brand-700">Next: {nextTask.title}</p>}
                </div>
              </div>
            ) : (
              <button type="button" onClick={enroll} disabled={busy} className="btn-primary w-full py-3">
                {busy ? "Adding…" : userId ? "Add to my learning" : "Sign in to start tracking"}
              </button>
            )}

            {course.course_url && (
              <a
                href={course.course_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${enrolled ? "btn-primary" : "btn-ghost"} mt-4 w-full py-3`}
              >
                Go to course on {course.provider} <ExternalLink size={15} />
              </a>
            )}
            <p className="mt-2 text-center text-[11px] text-body">
              Hosted and certified by {course.provider}. Opens in a new tab.
            </p>
          </div>

          <dl className="space-y-3 border-t border-line p-6 text-sm">
            <Detail icon={<BarChart3 size={16} />} label="Level" value={course.level} />
            {hours && <Detail icon={<Clock size={16} />} label="Duration" value={`~${hours}`} />}
            <Detail icon={<ListChecks size={16} />} label="Tasks" value={String(total)} />
            <Detail icon={<Globe size={16} />} label="Language" value={course.language} />
            <Detail icon={<Users size={16} />} label="Learners" value={learners.toLocaleString()} />
            <Detail icon={<Award size={16} />} label="Price" value={course.is_free ? "Free" : "Paid"} />
          </dl>

          {enrolled && (
            <div className="border-t border-line px-6 py-4 text-center">
              {confirmLeave ? (
                <div className="flex items-center justify-center gap-2 text-xs">
                  <span className="text-body">Remove course and reset progress?</span>
                  <button type="button" onClick={leave} disabled={busy} className="font-bold text-red-600 hover:underline">
                    Yes, remove
                  </button>
                  <button type="button" onClick={() => setConfirmLeave(false)} className="font-semibold text-body hover:underline">
                    Cancel
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirmLeave(true)} className="text-xs font-semibold text-body hover:text-red-600">
                  Remove from my learning
                </button>
              )}
            </div>
          )}
        </div>

        {paths.length > 0 && (
          <div className="card p-5">
            <p className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
              <Route size={16} className="text-brand-600" /> Part of a learning path
            </p>
            <ul className="space-y-2">
              {paths.map((p) => (
                <li key={p.slug}>
                  <Link href={`/paths/${p.slug}`} className="block rounded-lg bg-canvas px-3 py-2 text-sm hover:bg-brand-50">
                    <span className="font-semibold text-ink">{p.title}</span>
                    {p.stage && <span className="block text-xs text-body">{p.stage}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex items-center gap-2 text-body">
        <span className="text-brand-500">{icon}</span>
        {label}
      </dt>
      <dd className="font-semibold text-ink">{value}</dd>
    </div>
  );
}
