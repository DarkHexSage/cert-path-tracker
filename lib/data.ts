import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Course, CourseCardData, Profile } from "./types";

export interface Viewer {
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
}

export async function getViewer(supabase: SupabaseClient): Promise<Viewer> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null, isAdmin: false };
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, email, role")
    .eq("id", user.id)
    .maybeSingle();
  return {
    user,
    profile: (profile as Profile) ?? null,
    isAdmin: profile?.role === "admin",
  };
}

type CourseRow = Course & { course_tasks: { count: number }[] };

/** All visible courses, with task counts, learner counts and the viewer's progress. */
export async function getCourseCards(
  supabase: SupabaseClient,
  userId: string | null
): Promise<CourseCardData[]> {
  const [coursesRes, countsRes, enrollRes, progressRes] = await Promise.all([
    supabase
      .from("courses")
      .select("*, course_tasks(count)")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase.rpc("course_learner_counts"),
    userId
      ? supabase.from("enrollments").select("course_id").eq("user_id", userId)
      : Promise.resolve({ data: [] as { course_id: string }[] }),
    userId
      ? supabase.from("task_progress").select("course_id").eq("user_id", userId)
      : Promise.resolve({ data: [] as { course_id: string }[] }),
  ]);

  const learners = new Map<string, number>();
  for (const r of (countsRes.data ?? []) as { course_id: string; learners: number }[]) {
    learners.set(r.course_id, Number(r.learners));
  }
  const enrolled = new Set(((enrollRes.data ?? []) as { course_id: string }[]).map((e) => e.course_id));
  const done = new Map<string, number>();
  for (const p of (progressRes.data ?? []) as { course_id: string }[]) {
    done.set(p.course_id, (done.get(p.course_id) ?? 0) + 1);
  }

  return ((coursesRes.data ?? []) as CourseRow[]).map(({ course_tasks, ...c }) => ({
    ...c,
    outcomes: c.outcomes ?? [],
    task_count: course_tasks?.[0]?.count ?? 0,
    learners: learners.get(c.id) ?? 0,
    done: done.get(c.id) ?? 0,
    enrolled: enrolled.has(c.id) || (done.get(c.id) ?? 0) > 0,
  }));
}
