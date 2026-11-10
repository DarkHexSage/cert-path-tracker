import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CourseCatalog from "@/components/CourseCatalog";
import { createClient } from "@/lib/supabase/server";
import { getCourseCards, getViewer } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Courses" };

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const supabase = await createClient();
  const viewer = await getViewer(supabase);
  const all = await getCourseCards(supabase, viewer.user?.id ?? null);
  const courses = all.filter((c) => c.is_published);

  return (
    <main>
      <PageHero
        title="Courses"
        subtitle="Hand-picked courses from the original creators. Open one to see the badge you'll earn, the tasks to finish, and the link to start."
        crumbs={[{ label: "Courses" }]}
      />
      <div className="container-x py-10">
        <CourseCatalog
          courses={courses}
          signedIn={!!viewer.user}
          initialCategory={searchParams.category ?? "all"}
          initialQuery={searchParams.q ?? ""}
        />
      </div>
    </main>
  );
}
