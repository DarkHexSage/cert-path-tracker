import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import CourseForm from "@/components/admin/CourseForm";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "New course" };

export default async function NewCoursePage() {
  await requireAdmin();
  return (
    <AdminShell
      title="Add a course"
      subtitle="Link a course from its original creator. After saving you'll add the checklist tasks."
      active="new"
      crumbs={[{ label: "New course" }]}
    >
      <CourseForm />
    </AdminShell>
  );
}
