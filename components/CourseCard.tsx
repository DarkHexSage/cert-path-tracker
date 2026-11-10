import Link from "next/link";
import { Award, CheckCircle2, Clock, Globe, ListChecks, Users } from "lucide-react";
import CourseCover from "./CourseCover";
import { ProgressBar } from "./Progress";
import { formatHours, isComplete, pct, type CourseCardData } from "@/lib/types";

const LEVEL_CHIP: Record<string, string> = {
  Beginner: "bg-emerald-50 text-emerald-700",
  Intermediate: "bg-amber-50 text-amber-700",
  Advanced: "bg-rose-50 text-rose-700",
};

function CoverChips({ c }: { c: CourseCardData }) {
  const complete = isComplete(c);
  return (
    <>
      <span className="chip absolute left-3 top-3 bg-white/95 text-ink shadow-sm">{c.provider}</span>
      {complete ? (
        <span className="chip absolute right-3 top-3 bg-success text-white shadow-sm">
          <CheckCircle2 size={12} /> {c.badge_name ? "Badge earned" : "Completed"}
        </span>
      ) : c.enrolled ? (
        <span className="chip absolute right-3 top-3 bg-brand-600 text-white shadow-sm">Enrolled</span>
      ) : null}
      <span className={`chip absolute bottom-3 right-3 shadow-sm ${LEVEL_CHIP[c.level] ?? "bg-white text-ink"}`}>
        {c.level}
      </span>
    </>
  );
}

function Meta({ c }: { c: CourseCardData }) {
  const hours = formatHours(c.duration_hours);
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-body">
      <span className="inline-flex items-center gap-1">
        <ListChecks size={14} className="text-brand-500" /> {c.task_count} tasks
      </span>
      {hours && (
        <span className="inline-flex items-center gap-1">
          <Clock size={14} className="text-brand-500" /> {hours}
        </span>
      )}
      <span className="inline-flex items-center gap-1">
        <Users size={14} className="text-brand-500" /> {c.learners.toLocaleString()} learners
      </span>
    </div>
  );
}

function Price({ free }: { free: boolean }) {
  return free ? (
    <span className="text-sm font-bold text-success">Free</span>
  ) : (
    <span className="text-sm font-bold text-ink">Paid</span>
  );
}

function YourProgress({ c }: { c: CourseCardData }) {
  if (!c.enrolled) return null;
  const p = pct(c.done, c.task_count);
  return (
    <div className="mt-3">
      <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
        <span className="text-body">
          {c.done}/{c.task_count} tasks
        </span>
        <span className={p === 100 ? "text-success" : "text-brand-700"}>{p}%</span>
      </div>
      <ProgressBar value={p} tone={p === 100 ? "success" : "brand"} />
    </div>
  );
}

export function CourseCardGrid({ c }: { c: CourseCardData }) {
  return (
    <Link
      href={`/courses/${c.slug}`}
      className="group card flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lift"
    >
      <CourseCover cover={c.cover_url} badge={c.badge_image_url} category={c.category} title={c.title} className="aspect-[16/10]">
        <CoverChips c={c} />
      </CourseCover>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-brand-600">{c.category}</p>
        <h3 className="mt-1 font-display text-[17px] font-bold leading-snug text-ink transition-colors group-hover:text-brand-700">
          {c.title}
        </h3>
        {c.short_description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-body">{c.short_description}</p>
        )}
        <div className="mt-auto pt-4">
          <YourProgress c={c} />
          <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
            <Meta c={c} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export function CourseCardList({ c }: { c: CourseCardData }) {
  return (
    <Link
      href={`/courses/${c.slug}`}
      className="group card flex flex-col overflow-hidden transition-all hover:shadow-lift sm:flex-row"
    >
      <CourseCover
        cover={c.cover_url}
        badge={c.badge_image_url}
        category={c.category}
        title={c.title}
        className="aspect-[16/10] sm:aspect-auto sm:w-64 sm:shrink-0"
        badgeSize={88}
      >
        <CoverChips c={c} />
      </CourseCover>
      <div className="flex min-w-0 flex-1 flex-col p-5">
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg font-bold leading-snug text-ink transition-colors group-hover:text-brand-700">
              {c.title}
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-body">
              <span className="font-semibold text-brand-700">{c.provider}</span>
              <span className="inline-flex items-center gap-1">
                <Globe size={13} /> {c.language}
              </span>
              <span>{c.category}</span>
              {c.badge_name && (
                <span className="inline-flex items-center gap-1 text-amber-700">
                  <Award size={13} /> Badge
                </span>
              )}
            </div>
          </div>
          <span className="btn-soft hidden shrink-0 px-3 py-1.5 text-xs sm:inline-flex">View course</span>
        </div>
        {c.short_description && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-body">{c.short_description}</p>
        )}
        <div className="mt-auto">
          <YourProgress c={c} />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
            <Price free={c.is_free} />
            <Meta c={c} />
          </div>
        </div>
      </div>
    </Link>
  );
}
