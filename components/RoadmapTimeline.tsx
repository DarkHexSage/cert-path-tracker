"use client";

import { ROADMAP, type RoadmapItem } from "@/lib/roadmap";
import BadgeMedia from "./BadgeMedia";

function ExternalIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TaskBox({ done }: { done: boolean }) {
  return (
    <span
      className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[5px] border-2 transition-colors ${
        done ? "border-green bg-green/15" : "border-line bg-transparent"
      }`}
    >
      {done && (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 13l4 4L19 7"
            stroke="#3FB950"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}

function ItemRow({
  item,
  done,
  readOnly,
  onToggle,
}: {
  item: RoadmapItem;
  done: boolean;
  readOnly: boolean;
  onToggle?: (item: RoadmapItem) => void;
}) {
  const isBadge = item.type === "badge";

  const content = (
    <div className="flex items-start gap-3">
      {isBadge ? (
        <span className="shrink-0">
          <BadgeMedia id={item.id} earned={done} src={item.image} size={38} />
        </span>
      ) : (
        <TaskBox done={done} />
      )}
      <span className="min-w-0 flex-1">
        <span
          className={`block text-[15px] leading-snug transition-colors ${
            done ? "text-bone" : "text-bone/85"
          }`}
        >
          {item.label}
          {item.optional && (
            <span className="ml-2 rounded border border-line px-1.5 py-0.5 align-middle text-[10px] uppercase tracking-wider text-muted">
              optional
            </span>
          )}
        </span>
        {item.meta && (
          <span className="mt-0.5 block font-mono text-[11px] text-muted">{item.meta}</span>
        )}
      </span>
      {item.link && (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-0.5 shrink-0 text-muted transition-colors hover:text-gold"
          aria-label={`Open ${item.label} in a new tab`}
        >
          <ExternalIcon />
        </a>
      )}
    </div>
  );

  if (readOnly || !onToggle) {
    return <div className="rounded-lg border border-line/70 bg-slate/40 px-4 py-3">{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={() => onToggle(item)}
      aria-pressed={done}
      className={`w-full rounded-lg border px-4 py-3 text-left transition-all hover:border-gold/50 ${
        done ? "border-gold/30 bg-gold/[0.06]" : "border-line bg-slate/40"
      }`}
    >
      {content}
    </button>
  );
}

export default function RoadmapTimeline({
  completed,
  onToggle,
  readOnly = false,
}: {
  completed: Set<string>;
  onToggle?: (item: RoadmapItem) => void;
  readOnly?: boolean;
}) {
  return (
    <ol className="space-y-10">
      {ROADMAP.map((month) => {
        const items = [...month.badges, ...month.tasks];
        const doneCount = items.filter((i) => completed.has(i.id)).length;
        return (
          <li key={month.n} className="relative">
            <div className="mb-4 flex items-baseline gap-4">
              <span className="font-mono text-2xl font-bold text-gold">
                {String(month.n).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-xl font-semibold leading-tight text-bone">
                  {month.title}
                </h3>
                <p className="mt-1 text-sm text-muted">{month.goal}</p>
              </div>
              <span className="ml-auto whitespace-nowrap font-mono text-xs text-muted">
                {doneCount}/{items.length}
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {items.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  done={completed.has(item.id)}
                  readOnly={readOnly}
                  onToggle={onToggle}
                />
              ))}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
