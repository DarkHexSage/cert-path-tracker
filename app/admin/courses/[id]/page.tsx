import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye, PartyPopper } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import CourseForm from "@/components/admin/CourseForm";
import TaskManager from "@/components/admin/TaskManager";
import { requireAdmin } from "@/lib/admin";
import type { Course, CourseTask } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit course" };

export default async function EditCoursePage({ params, searchParams }: { params: { id: string }; searchParams: { created?: string } }) {
  const { supabase } = await requireAdmin();
  const [{ data: course }, { data: tasks }] = await Promise.all([
    supabase.from("courses").select("*").eq("id", params.id).maybeSingle(),
    supabase.from("course_tasks").select("*").eq("course_id", params.id).order("sort_order").order("created_at"),
  ]);
  if (!course) notFound();
  const c = course as Course;
  const t = (tasks ?? []) as CourseTask[];

  return (
    <AdminShell title={c.title} subtitle={`${c.provider} · ${c.category}`} active="edit" crumbs={[{ label: "Edit course" }]}>
      {searchParams.created && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <PartyPopper size={18} /> Course created! Now add the tasks learners will tick off.
        </div>
      )}
      <div className="mb-6 flex justify-end">
        <Link href={`/courses/${c.slug}`} className="btn-ghost">
          <Eye size={16} /> View as learner
        </Link>
      </div>
      <div className="space-y-8">
        <TaskManager courseId={c.id} initial={t} />
        <CourseForm course={c} taskCount={t.length} />
      </div>
    </AdminShell>
  );
}
