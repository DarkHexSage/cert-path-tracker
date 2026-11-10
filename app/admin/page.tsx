import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, CheckCheck, Eye, Pencil, Plus, Star, UserPlus, Users } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import StatTile from "@/components/StatTile";
import CourseCover from "@/components/CourseCover";
import { requireAdmin } from "@/lib/admin";
import { getCourseCards } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin" };

export default async function AdminPage() {
  const { supabase, viewer } = await requireAdmin();

  const [courses, profilesRes, enrollCount, taskCount, recentRes] = await Promise.all([
    getCourseCards(supabase, viewer.user!.id),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("enrollments").select("user_id", { count: "exact", head: true }),
    supabase.from("task_progress").select("user_id", { count: "exact", head: true }),
    supabase.from("profiles").select("id, username, email, role, created_at").order("created_at", { ascending: false }).limit(12),
  ]);

  const recent = (recentRes.data ?? []) as { id: string; username: string; email: string | null; role: string; created_at: string }[];
  const ids = recent.map((r) => r.id);
  const [recentEnroll, recentTasks] = ids.length
    ? await Promise.all([
        supabase.from("enrollments").select("user_id").in("user_id", ids),
        supabase.from("task_progress").select("user_id").in("user_id", ids),
      ])
    : [{ data: [] }, { data: [] }];
  const tally = (rows: { user_id: string }[] | null) => {
    const m = new Map<string, number>();
    for (const r of rows ?? []) m.set(r.user_id, (m.get(r.user_id) ?? 0) + 1);
    return m;
  };
  const enrollBy = tally(recentEnroll.data as { user_id: string }[]);
  const tasksBy = tally(recentTasks.data as { user_id: string }[]);

  return (
    <AdminShell title="Admin panel" subtitle="Add courses, build checklists and see how your learners are doing." active="courses">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile icon={<BookOpen size={22} />} label="Courses" value={courses.length} hint={`${courses.filter((c) => c.is_published).length} published`} />
        <StatTile icon={<Users size={22} />} label="Learners" value={profilesRes.count ?? 0} tone="sky" />
        <StatTile icon={<UserPlus size={22} />} label="Enrollments" value={enrollCount.count ?? 0} tone="amber" />
        <StatTile icon={<CheckCheck size={22} />} label="Tasks completed" value={taskCount.count ?? 0} tone="green" />
      </section>

      <section className="mt-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-bold text-ink">Courses</h2>
          <Link href="/admin/courses/new" className="btn-primary">
            <Plus size={16} /> Add course
          </Link>
        </div>
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-line bg-canvas text-xs font-bold uppercase tracking-wider text-body">
              <tr>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-center">Tasks</th>
                <th className="px-4 py-3 text-center">Learners</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-canvas/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <CourseCover cover={c.cover_url} badge={c.badge_image_url} category={c.category} title={c.title} badgeSize={34} className="h-12 w-[72px] shrink-0 rounded-lg" />
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 font-semibold text-ink">
                          {c.title}
                          {c.is_featured && <Star size={13} className="fill-amber-400 text-amber-400" />}
                        </p>
                        <p className="text-xs text-body">{c.provider}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-body">{c.category}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={c.task_count === 0 ? "font-bold text-amber-600" : "text-ink"}>{c.task_count}</span>
                  </td>
                  <td className="px-4 py-3 text-center text-ink">{c.learners}</td>
                  <td className="px-4 py-3">
                    {c.is_published ? (
                      <span className="chip bg-emerald-50 text-emerald-700">Published</span>
                    ) : (
                      <span className="chip bg-amber-50 text-amber-700">Draft</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <Link href={`/courses/${c.slug}`} className="flex h-9 w-9 items-center justify-center rounded-lg text-body hover:bg-brand-50 hover:text-brand-700" aria-label={`View ${c.title}`}>
                        <Eye size={16} />
                      </Link>
                      <Link href={`/admin/courses/${c.id}`} className="btn-soft px-3 py-1.5 text-xs">
                        <Pencil size={13} /> Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-body">
                    No courses yet — add your first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-2xl font-bold text-ink">Newest learners</h2>
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="border-b border-line bg-canvas text-xs font-bold uppercase tracking-wider text-body">
              <tr>
                <th className="px-4 py-3">Learner</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-center">Courses</th>
                <th className="px-4 py-3 text-center">Tasks done</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {recent.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold uppercase text-brand-700">
                        {p.username.slice(0, 2)}
                      </span>
                      <div>
                        <p className="font-semibold text-ink">
                          {p.username} {p.role === "admin" && <span className="chip ml-1 bg-brand-50 py-0.5 text-brand-700">admin</span>}
                        </p>
                        <p className="text-xs text-body">{p.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-body">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-center text-ink">{enrollBy.get(p.id) ?? 0}</td>
                  <td className="px-4 py-3 text-center text-ink">{tasksBy.get(p.id) ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
