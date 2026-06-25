"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import CountUp from "./CountUp";

type Stats = { users: number; badges: number; visits: number };

const FIGURES: { key: keyof Stats; label: string }[] = [
  { key: "users", label: "Learners on the path" },
  { key: "badges", label: "Badges earned together" },
  { key: "visits", label: "Visits" },
];

export default function Stats({ countVisit = false }: { countVisit?: boolean }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    (async () => {
      try {
        if (
          countVisit &&
          typeof window !== "undefined" &&
          !sessionStorage.getItem("cpt_visited")
        ) {
          sessionStorage.setItem("cpt_visited", "1");
          await supabase.rpc("increment_visits");
        }
        const { data, error } = await supabase.rpc("get_public_stats");
        if (error) throw error;
        if (active && data) setStats(data as Stats);
      } catch {
        if (active) setFailed(true);
      }
    })();

    return () => {
      active = false;
    };
  }, [countVisit]);

  return (
    <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-line bg-line">
      {FIGURES.map(({ key, label }) => (
        <div key={key} className="bg-slate px-4 py-5 text-center sm:px-6 sm:py-7">
          <div className="font-mono text-3xl font-bold tabular-nums text-gold sm:text-4xl md:text-5xl">
            {failed ? "—" : stats ? <CountUp value={stats[key]} /> : "0"}
          </div>
          <div className="eyebrow mt-2">{label}</div>
        </div>
      ))}
    </div>
  );
}
