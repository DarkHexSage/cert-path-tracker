import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Stats from "@/components/Stats";
import ProgressTracker from "@/components/ProgressTracker";
import Resources from "@/components/Resources";
import SignOutButton from "@/components/SignOutButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: progress }, { data: profile }] = await Promise.all([
    supabase.from("progress").select("item_id").eq("user_id", user.id),
    supabase.from("profiles").select("username").eq("id", user.id).single(),
  ]);

  const completed = (progress ?? []).map((p) => p.item_id as string);
  const username = profile?.username ?? user.email?.split("@")[0] ?? "learner";

  return (
    <main className="mx-auto max-w-5xl px-5 pb-24">
      <nav className="flex items-center justify-between py-6">
        <Link href="/" className="font-mono text-sm font-bold tracking-tight text-bone">
          <span className="text-gold">/</span>the-path
        </Link>
        <div className="flex items-center gap-5">
          <span className="font-mono text-xs text-muted">
            <span className="text-bone">{username}</span>
          </span>
          <SignOutButton />
        </div>
      </nav>

      <header className="animate-fade-up py-6">
        <p className="eyebrow">Mission log</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-bone">
          Welcome back, {username}.
        </h1>
      </header>

      <section className="mb-10">
        <Stats />
      </section>

      <ProgressTracker userId={user.id} initialCompleted={completed} />

      <div className="mt-16">
        <Resources />
      </div>
    </main>
  );
}
