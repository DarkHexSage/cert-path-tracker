import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import PageHero from "@/components/PageHero";
import BadgeImage from "@/components/BadgeImage";
import { ProgressBar } from "@/components/Progress";
import { createClient } from "@/lib/supabase/server";
import { getCourseCards, getViewer } from "@/lib/data";
import { isComplete, pct, type LearningPath, type PathCourse } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Learning paths" };

export default async function PathsPage() {
  const supabase = await createClient();
  const viewer = await getViewer(supabase);
  const [cards, pathsRes, pcRes] = await Promise.all([
    getCourseCards(supabase, viewer.user?.id ?? null),
    supabase.from("paths").select("*").eq("is_published", true).order("sort_order"),
    supabase.from("path_courses").select("*").order("sort_order"),
  ]);
  const byId = new Map(cards.filter((c) => c.is_published).map((c) => [c.id, c]));
  const paths = (pathsRes.data ?? []) as LearningPath[];
  const pcs = (pcRes.data ?? []) as PathCourse[];

  return (
    <main>
      <PageHero
        title="Learning paths"
        subtitle="Not sure where to start? Follow a path — a curated order of courses that builds from zero to job-ready."
        crumbs={[{ label: "Learning paths" }]}
      />
      <div className="container-x py-10">
        {paths.length === 0 ? (
          <p className="card p-10 text-center text-body">No learning paths published yet.</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {paths.map((p) => {
              const list = pcs.filter((pc) => pc.path_id === p.id).map((pc) => byId.get(pc.course_id)!).filter(Boolean);
              const done = list.filter(isComplete).length;
              const hours = list.reduce((s, c) => s + (c.duration_hours ?? 0), 0);
              const v = pct(done, list.length);
              return (
                <Link key={p.id} href={`/paths/${p.slug}`} className="group card overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lift">
                  <div className="hero-band relative flex h-40 items-center overflow-hidden px-6">
                    <div className="flex -space-x-6">
                      {list
                        .filter((c) => c.badge_image_url)
                        .slice(0, 6)
                        .map((c, i) => (
                          <div key={c.id} className="rounded-full bg-white/10 p-1 backdrop-blur-sm transition-transform group-hover:-translate-y-1" style={{ transitionDelay: `${i * 30}ms` }}>
                            <BadgeImage src={c.badge_image_url} size={76} />
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="p-6">
                    {p.subtitle && <p className="text-xs font-bold uppercase tracking-wider text-brand-600">{p.subtitle}</p>}
                    <h2 className="mt-1 font-display text-2xl font-bold text-ink group-hover:text-brand-700">{p.title}</h2>
                    {p.description && <p className="mt-2 line-clamp-2 text-sm text-body">{p.description}</p>}
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-body">
                      <span className="inline-flex items-center gap-1.5">
                        <BookOpen size={15} className="text-brand-500" /> {list.length} courses
                      </span>
                      {hours > 0 && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={15} className="text-brand-500" /> ~{Math.round(hours)} hours
                        </span>
                      )}
                    </div>
                    {viewer.user && (
                      <div className="mt-4">
                        <div className="mb-1.5 flex justify-between text-xs font-semibold">
                          <span className="text-body">
                            {done}/{list.length} courses complete
                          </span>
                          <span className="text-brand-700">{v}%</span>
                        </div>
                        <ProgressBar value={v} />
                      </div>
                    )}
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                      View path <ArrowRight size={15} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
