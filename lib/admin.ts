import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { getViewer } from "./data";

/** Use at the top of every /admin page. Non-admins are sent away. */
export async function requireAdmin() {
  const supabase = await createClient();
  const viewer = await getViewer(supabase);
  if (!viewer.user) redirect("/login?next=/admin");
  if (!viewer.isAdmin) redirect("/dashboard");
  return { supabase, viewer };
}
