"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, List, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { CourseCardGrid, CourseCardList } from "./CourseCard";
import { LEVELS, isComplete, type CourseCardData } from "@/lib/types";

const PAGE_SIZE = 9;

type Sort = "recommended" | "newest" | "popular" | "shortest" | "az";
const SORTS: { v: Sort; label: string }[] = [
  { v: "recommended", label: "Recommended" },
  { v: "newest", label: "Newly published" },
  { v: "popular", label: "Most learners" },
  { v: "shortest", label: "Shortest first" },
  { v: "az", label: "A – Z" },
];

type Status = "all" | "enrolled" | "completed" | "new";

function RadioGroup({
  title,
  value,
  onChange,
  options,
}: {
  title: string;
  value: string;
  onChange: (v: string) => void;
  options: { v: string; label: string; count?: number }[];
}) {
  return (
    <fieldset className="border-b border-line pb-5 last:border-0">
      <legend className="mb-3 font-display text-[15px] font-bold text-ink">
        {title}
        <span className="mt-1.5 block h-0.5 w-8 rounded bg-brand-500" />
      </legend>
      <div className="space-y-1">
        {options.map((o) => {
          const active = value === o.v;
          return (
            <label
              key={o.v}
              className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors ${
                active ? "bg-brand-50 font-semibold text-brand-700" : "text-ink/80 hover:bg-canvas"
              }`}
            >
              <input
                type="radio"
                className="sr-only"
                name={title}
                checked={active}
                onChange={() => onChange(o.v)}
              />
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                  active ? "border-brand-600" : "border-line bg-white"
                }`}
              >
                {active && <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />}
              </span>
              <span className="flex-1 truncate">{o.label}</span>
              {o.count !== undefined && <span className="text-xs text-body">({o.count})</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function CourseCatalog({
  courses,
  signedIn,
  initialCategory = "all",
  initialQuery = "",
}: {
  courses: CourseCardData[];
  signedIn: boolean;
  initialCategory?: string;
  initialQuery?: string;
}) {
  const [view, setView] = useState<"list" | "grid">("list");
  const [q, setQ] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [provider, setProvider] = useState("all");
  const [level, setLevel] = useState("all");
  const [price, setPrice] = useState("all");
  const [status, setStatus] = useState<Status>("all");
  const [sort, setSort] = useState<Sort>("recommended");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem("catalog_view");
      if (v === "grid" || v === "list") setView(v);
    } catch {}
  }, []);
  function changeView(v: "list" | "grid") {
    setView(v);
    try {
      localStorage.setItem("catalog_view", v);
    } catch {}
  }

  const count = (fn: (c: CourseCardData) => boolean) => courses.filter(fn).length;
  const categories = useMemo(() => [...new Set(courses.map((c) => c.category))].sort(), [courses]);
  const providers = useMemo(() => [...new Set(courses.map((c) => c.provider))].sort(), [courses]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = courses.filter((c) => {
      if (category !== "all" && c.category !== category) return false;
      if (provider !== "all" && c.provider !== provider) return false;
      if (level !== "all" && c.level !== level) return false;
      if (price === "free" && !c.is_free) return false;
      if (price === "paid" && c.is_free) return false;
      if (status === "enrolled" && !(c.enrolled && !isComplete(c))) return false;
      if (status === "completed" && !isComplete(c)) return false;
      if (status === "new" && c.enrolled) return false;
      if (term) {
        const hay = `${c.title} ${c.provider} ${c.category} ${c.short_description ?? ""} ${c.badge_name ?? ""}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
    list = [...list];
    if (sort === "newest") list.sort((a, b) => b.created_at.localeCompare(a.created_at));
    if (sort === "popular") list.sort((a, b) => b.learners - a.learners);
    if (sort === "shortest") list.sort((a, b) => (a.duration_hours ?? 999) - (b.duration_hours ?? 999));
    if (sort === "az") list.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "recommended") list.sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || a.sort_order - b.sort_order);
    return list;
  }, [courses, q, category, provider, level, price, status, sort]);

  useEffect(() => setPage(1), [q, category, provider, level, price, status, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function reset() {
    setQ("");
    setCategory("all");
    setProvider("all");
    setLevel("all");
    setPrice("all");
    setStatus("all");
    setSort("recommended");
  }

  const sidebar = (
    <div className="card space-y-5 p-5">
      <RadioGroup
        title="Categories"
        value={category}
        onChange={setCategory}
        options={[
          { v: "all", label: "All categories", count: courses.length },
          ...categories.map((cat) => ({ v: cat, label: cat, count: count((c) => c.category === cat) })),
        ]}
      />
      <RadioGroup
        title="Provider"
        value={provider}
        onChange={setProvider}
        options={[
          { v: "all", label: "All providers" },
          ...providers.map((p) => ({ v: p, label: p, count: count((c) => c.provider === p) })),
        ]}
      />
      <RadioGroup
        title="Level"
        value={level}
        onChange={setLevel}
        options={[{ v: "all", label: "All" }, ...LEVELS.map((l) => ({ v: l, label: l, count: count((c) => c.level === l) }))]}
      />
      <RadioGroup
        title="Price"
        value={price}
        onChange={setPrice}
        options={[
          { v: "all", label: "All" },
          { v: "free", label: "Free", count: count((c) => c.is_free) },
          { v: "paid", label: "Paid", count: count((c) => !c.is_free) },
        ]}
      />
      {signedIn && (
        <RadioGroup
          title="My progress"
          value={status}
          onChange={(v) => setStatus(v as Status)}
          options={[
            { v: "all", label: "Any" },
            { v: "enrolled", label: "In progress", count: count((c) => c.enrolled && !isComplete(c)) },
            { v: "completed", label: "Completed", count: count((c) => isComplete(c)) },
            { v: "new", label: "Not started", count: count((c) => !c.enrolled) },
          ]}
        />
      )}
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[270px_1fr]">
      <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>{sidebar}</aside>

      <div className="min-w-0">
        <div className="card mb-6 flex flex-wrap items-center gap-3 p-3">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => changeView("list")}
              aria-label="List view"
              aria-pressed={view === "list"}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                view === "list" ? "border-brand-600 bg-brand-600 text-white" : "border-line text-body hover:text-brand-700"
              }`}
            >
              <List size={18} />
            </button>
            <button
              type="button"
              onClick={() => changeView("grid")}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                view === "grid" ? "border-brand-600 bg-brand-600 text-white" : "border-line text-body hover:text-brand-700"
              }`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              type="button"
              onClick={reset}
              aria-label="Reset filters"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-body hover:text-brand-700"
            >
              <RotateCcw size={16} />
            </button>
            <button
              type="button"
              onClick={() => setShowFilters((s) => !s)}
              className="flex h-10 items-center gap-1.5 rounded-lg border border-line px-3 text-sm font-semibold text-ink lg:hidden"
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>

          <p className="text-sm text-body">
            Showing <b className="text-ink">{shown.length}</b> of <b className="text-ink">{filtered.length}</b> results
          </p>

          <div className="ml-auto flex w-full flex-wrap gap-2 sm:w-auto">
            <label className="relative flex-1 sm:w-64 sm:flex-none">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-body" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search courses, providers…"
                className="input pl-9"
                aria-label="Search courses"
              />
            </label>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="input w-auto pr-8" aria-label="Sort">
              {SORTS.map((s) => (
                <option key={s.v} value={s.v}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {shown.length === 0 ? (
          <div className="card flex flex-col items-center px-6 py-16 text-center">
            <p className="font-display text-lg font-bold text-ink">No courses match those filters</p>
            <p className="mt-1 text-sm text-body">Try another category or clear your search.</p>
            <button type="button" onClick={reset} className="btn-soft mt-5">
              Reset filters
            </button>
          </div>
        ) : view === "list" ? (
          <div className="space-y-5">
            {shown.map((c) => (
              <CourseCardList key={c.id} c={c} />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {shown.map((c) => (
              <CourseCardGrid key={c.id} c={c} />
            ))}
          </div>
        )}

        {pages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-brand-50 disabled:opacity-30"
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setPage(n);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`h-10 w-10 rounded-lg text-sm font-bold ${
                  n === page ? "bg-brand-600 text-white shadow-sm" : "text-ink hover:bg-brand-50"
                }`}
                aria-current={n === page ? "page" : undefined}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              disabled={page === pages}
              onClick={() => setPage((p) => p + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-brand-50 disabled:opacity-30"
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
