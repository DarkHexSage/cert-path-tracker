"use client";

import { useEffect, useState } from "react";
import { Award, BookOpen, CheckCheck, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import CountUp from "./CountUp";

type StatsData = { users: number; courses: number; badges: number; tasks: number; visits: number };

const FIGURES: { key: keyof StatsData; label: string; icon: React.ReactNode }[] = [
  { key: "users", label: "Learners", icon: <Users size={20} /> },
  { key: "courses", label: "Courses", icon: <BookOpen size={20} /> },
  { key: "tasks", label: "Tasks completed", icon: <CheckCheck size={20} /> },
  { key: "badges", label: "Badges earned", icon: <Award size={20} /> },
];

/** Live public counters. Also records one visit per browser session when `countVisit` is set. */
export default function Stats({ countVisit = false }: { countVisit?: boolean }) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let active = true;
    (async () => {
      try {
        if (countVisit && !sessionStorage.getItem("pa_visited")) {
          sessionStorage.setItem("pa_visited", "1");
          await supabase.rpc("increment_visits");
        }
        const { data, error } = await supabase.rpc("get_public_stats");
        if (error) throw error;
        if (active && data) setStats(data as StatsData);
      } catch {
        if (active) setFailed(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [countVisit]);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {FIGURES.map(({ key, label, icon }) => (
        <div key={key} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-white/75">
            {icon}
            <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
          </div>
          <div className="mt-1.5 font-display text-3xl font-extrabold tabular-nums text-white">
            {failed ? "—" : stats ? <CountUp value={Number(stats[key] ?? 0)} /> : "0"}
          </div>
        </div>
      ))}
    </div>
  );
}
