import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import PathManager from "@/components/admin/PathManager";
import { requireAdmin } from "@/lib/admin";
import type { LearningPath, PathCourse } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Learning paths · Admin" };

export default async function AdminPathsPage() {
  const { supabase } = await requireAdmin();
  const [paths, links, courses] = await Promise.all([
    supabase.from("paths").select("*").order("sort_order"),
    supabase.from("path_courses").select("*"),
    supabase.from("courses").select("id, title, provider").order("sort_order").order("title"),
  ]);
  return (
    <AdminShell title="Learning paths" subtitle="Bundle courses into a guided order, grouped by stage." active="paths" crumbs={[{ label: "Learning paths" }]}>
      <PathManager
        initialPaths={(paths.data ?? []) as LearningPath[]}
        initialLinks={(links.data ?? []) as PathCourse[]}
        courses={(courses.data ?? []) as { id: string; title: string; provider: string }[]}
      />
    </AdminShell>
  );
}
