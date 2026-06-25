"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  ALL_BADGES,
  TOTAL_BADGES,
  TOTAL_ITEMS,
  type RoadmapItem,
} from "@/lib/roadmap";
import RoadmapTimeline from "./RoadmapTimeline";

function Ring({ pct }: { pct: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <svg width="128" height="128" viewBox="0 0 128 128" className="shrink-0">
      <circle cx="64" cy="64" r={r} fill="none" stroke="#232A33" strokeWidth="10" />
      <circle
        cx="64"
        cy="64"
        r={r}
        fill="none"
        stroke="#E0A82E"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform="rotate(-90 64 64)"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text
        x="64"
        y="60"
        textAnchor="middle"
        className="fill-bone font-mono"
        style={{ fontSize: "26px", fontWeight: 700 }}
      >
        {pct}%
      </text>
      <text
        x="64"
        y="80"
        textAnchor="middle"
        className="fill-muted font-mono"
        style={{ fontSize: "10px", letterSpacing: "0.15em" }}
      >
        BADGES
      </text>
    </svg>
  );
}

export default function ProgressTracker({
  userId,
  initialCompleted,
}: {
  userId: string;
  initialCompleted: string[];
}) {
  const [completed, setCompleted] = useState<Set<string>>(
    () => new Set(initialCompleted)
  );
  const [saving, setSaving] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  const badgeIds = useMemo(() => new Set(ALL_BADGES.map((b) => b.id)), []);
  const badgesDone = useMemo(
    () => [...completed].filter((id) => badgeIds.has(id)).length,
    [completed, badgeIds]
  );
  const itemsDone = completed.size;
  const badgePct = Math.round((badgesDone / TOTAL_BADGES) * 100);

  async function toggle(item: RoadmapItem) {
    const isDone = completed.has(item.id);

    // Optimistic update
    setCompleted((prev) => {
      const next = new Set(prev);
      if (isDone) next.delete(item.id);
      else next.add(item.id);
      return next;
    });
    setSaving(true);

    try {
      if (isDone) {
        await supabase
          .from("progress")
          .delete()
          .eq("user_id", userId)
          .eq("item_id", item.id);
      } else {
        await supabase.from("progress").upsert(
          { user_id: userId, item_id: item.id, item_type: item.type },
          { onConflict: "user_id,item_id" }
        );
      }
    } catch {
      // Revert on failure
      setCompleted((prev) => {
        const next = new Set(prev);
        if (isDone) next.add(item.id);
        else next.delete(item.id);
        return next;
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-10">
      <section className="flex flex-col items-center gap-6 rounded-xl border border-line bg-slate/60 p-6 sm:flex-row sm:gap-10 sm:p-8">
        <Ring pct={badgePct} />
        <div className="flex-1">
          <p className="eyebrow">Your run</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-bone">
            {badgesDone === TOTAL_BADGES
              ? "Every badge earned. Go get hired."
              : badgesDone === 0
              ? "Earn your first badge today."
              : "Keep stacking proof."}
          </h2>
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <div className="font-mono text-2xl font-bold text-gold">
                {badgesDone}
                <span className="text-muted">/{TOTAL_BADGES}</span>
              </div>
              <div className="eyebrow mt-1">Badges</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-bold text-bone">
                {itemsDone}
                <span className="text-muted">/{TOTAL_ITEMS}</span>
              </div>
              <div className="eyebrow mt-1">Total steps</div>
            </div>
            <div className="flex items-end">
              <span className="font-mono text-xs text-muted">
                {saving ? "saving…" : "saved"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <RoadmapTimeline completed={completed} onToggle={toggle} />
    </div>
  );
}
