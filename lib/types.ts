export type Level = "Beginner" | "Intermediate" | "Advanced";
export const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced"];

export interface Course {
  id: string;
  slug: string;
  title: string;
  provider: string;
  category: string;
  level: Level;
  language: string;
  duration_hours: number | null;
  is_free: boolean;
  short_description: string | null;
  description: string | null;
  outcomes: string[];
  cover_url: string | null;
  badge_name: string | null;
  badge_image_url: string | null;
  course_url: string | null;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface CourseTask {
  id: string;
  course_id: string;
  title: string;
  details: string | null;
  resource_url: string | null;
  sort_order: number;
}

/** A course plus counts and (if signed in) the viewer's progress. */
export interface CourseCardData extends Course {
  task_count: number;
  learners: number;
  done: number;
  enrolled: boolean;
}

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  cover_url: string | null;
  is_published: boolean;
  sort_order: number;
}

export interface PathCourse {
  path_id: string;
  course_id: string;
  stage: string | null;
  sort_order: number;
}

export interface Profile {
  id: string;
  username: string;
  email: string | null;
  role: "student" | "admin";
}

export function pct(done: number, total: number) {
  if (!total) return 0;
  return Math.round((done / total) * 100);
}

export function isComplete(c: { done: number; task_count: number }) {
  return c.task_count > 0 && c.done >= c.task_count;
}

export function formatHours(h: number | null) {
  if (h == null) return null;
  return h === 1 ? "1 hour" : `${h} hours`;
}
