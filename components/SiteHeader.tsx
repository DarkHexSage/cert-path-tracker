import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/data";
import HeaderNav from "./HeaderNav";

export default async function SiteHeader() {
  let username: string | null = null;
  let isAdmin = false;
  try {
    const supabase = await createClient();
    const viewer = await getViewer(supabase);
    if (viewer.user) username = viewer.profile?.username ?? viewer.user.email?.split("@")[0] ?? "learner";
    isAdmin = viewer.isAdmin;
  } catch {
    // Supabase not configured yet — render a signed-out header.
  }
  return <HeaderNav username={username} isAdmin={isAdmin} />;
}
