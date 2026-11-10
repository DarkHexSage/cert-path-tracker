"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Plus, Route, Save, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slug";
import type { LearningPath, PathCourse } from "@/lib/types";

type MiniCourse = { id: string; title: string; provider: string };

export default function PathManager({
  initialPaths,
  initialLinks,
  courses,
}: {
  initialPaths: LearningPath[];
  initialLinks: PathCourse[];
  courses: MiniCourse[];
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [paths, setPaths] = useState(initialPaths);
  const [links, setLinks] = useState(initialLinks);
  const [selected, setSelected] = useState<string | null>(initialPaths[0]?.id ?? null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [addCourse, setAddCourse] = useState("");
  const [addStage, setAddStage] = useState("");

  const path = paths.find((p) => p.id === selected) ?? null;
  const courseById = new Map(courses.map((c) => [c.id, c]));
  const mine = links.filter((l) => l.path_id === selected).sort((a, b) => a.sort_order - b.sort_order);
  const available = courses.filter((c) => !mine.some((m) => m.course_id === c.id));
  const stages = [...new Set(mine.map((m) => m.stage).filter(Boolean))] as string[];

  function patch(p: Partial<LearningPath>) {
    setSaved(false);
    setPaths((ps) => ps.map((x) => (x.id === selected ? { ...x, ...p } : x)));
  }

  async function createPath() {
    setBusy(true);
    setError(null);
    const title = "New learning path";
    const { data, error } = await supabase
      .from("paths")
      .insert({ title, slug: `${slugify(title)}-${Date.now().toString(36)}`, is_published: false, sort_order: paths.length * 10 })
      .select("*")
      .single();
    setBusy(false);
    if (error) return setError(error.message);
    setPaths((ps) => [...ps, data as LearningPath]);
    setSelected((data as LearningPath).id);
  }

  async function savePath() {
    if (!path) return;
    setBusy(true);
    setError(null);
    const { error } = await supabase
      .from("paths")
      .update({
        title: path.title.trim(),
        slug: slugify(path.slug || path.title),
        subtitle: path.subtitle?.trim() || null,
        description: path.description?.trim() || null,
        is_published: path.is_published,
        sort_order: path.sort_order,
      })
      .eq("id", path.id);
    setBusy(false);
    if (error) return setError(error.code === "23505" ? "That slug is already used by another path." : error.message);
    setSaved(true);
    router.refresh();
  }

  async function deletePath() {
    if (!path) return;
    setBusy(true);
    const { error } = await supabase.from("paths").delete().eq("id", path.id);
    setBusy(false);
    if (error) return setError(error.message);
    const rest = paths.filter((p) => p.id !== path.id);
    setPaths(rest);
    setLinks((ls) => ls.filter((l) => l.path_id !== path.id));
    setSelected(rest[0]?.id ?? null);
    setConfirmDelete(false);
  }

  async function addLink() {
    if (!path || !addCourse) return;
    const row = {
      path_id: path.id,
      course_id: addCourse,
      stage: addStage.trim() || null,
      sort_order: mine.length ? Math.max(...mine.map((m) => m.sort_order)) + 10 : 0,
    };
    const { error } = await supabase.from("path_courses").insert(row);
    if (error) return setError(error.message);
    setLinks((ls) => [...ls, row]);
    setAddCourse("");
  }

  async function updateLink(courseId: string, p: Partial<PathCourse>) {
    if (!path) return;
    setLinks((ls) => ls.map((l) => (l.path_id === path.id && l.course_id === courseId ? { ...l, ...p } : l)));
    const { error } = await supabase.from("path_courses").update(p).eq("path_id", path.id).eq("course_id", courseId);
    if (error) setError(error.message);
  }

  async function removeLink(courseId: string) {
    if (!path) return;
    const { error } = await supabase.from("path_courses").delete().eq("path_id", path.id).eq("course_id", courseId);
    if (error) return setError(error.message);
    setLinks((ls) => ls.filter((l) => !(l.path_id === path.id && l.course_id === courseId)));
  }

  async function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= mine.length) return;
    const a = mine[i];
    const b = mine[j];
    await Promise.all([updateLink(a.course_id, { sort_order: b.sort_order }), updateLink(b.course_id, { sort_order: a.sort_order })]);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="card h-fit p-3">
        <ul className="space-y-1">
          {paths.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => {
                  setSelected(p.id);
                  setSaved(false);
                  setConfirmDelete(false);
                }}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm ${
                  p.id === selected ? "bg-brand-50 font-semibold text-brand-700" : "text-ink hover:bg-canvas"
                }`}
              >
                <Route size={16} className="shrink-0" />
                <span className="flex-1 truncate">{p.title}</span>
                {!p.is_published && <span className="chip bg-amber-50 py-0.5 text-amber-700">Draft</span>}
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={createPath} disabled={busy} className="btn-soft mt-2 w-full">
          <Plus size={16} /> New path
        </button>
      </aside>

      {path ? (
        <div className="space-y-6">
          <section className="card space-y-4 p-6">
            <h2 className="font-display text-lg font-bold text-ink">Path details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="label">Title</span>
                <input className="input" value={path.title} onChange={(e) => patch({ title: e.target.value })} />
              </label>
              <label className="block">
                <span className="label">Subtitle</span>
                <input className="input" value={path.subtitle ?? ""} onChange={(e) => patch({ subtitle: e.target.value })} placeholder="6 months · beginner friendly" />
              </label>
            </div>
            <label className="block">
              <span className="label">Description</span>
              <textarea className="input" rows={3} value={path.description ?? ""} onChange={(e) => patch({ description: e.target.value })} />
            </label>
            <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
              <label className="block">
                <span className="label">URL slug</span>
                <input className="input" value={path.slug} onChange={(e) => patch({ slug: e.target.value })} />
              </label>
              <label className="block">
                <span className="label">Sort order</span>
                <input className="input" type="number" value={path.sort_order} onChange={(e) => patch({ sort_order: Number(e.target.value) || 0 })} />
              </label>
            </div>
            <label className="inline-flex items-center gap-2.5 text-sm font-medium text-ink">
              <input type="checkbox" className="h-4 w-4 accent-brand-600" checked={path.is_published} onChange={(e) => patch({ is_published: e.target.checked })} />
              Published
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={savePath} disabled={busy} className="btn-primary">
                <Save size={16} /> Save path
              </button>
              {saved && <span className="text-sm font-semibold text-success">Saved</span>}
              <div className="ml-auto">
                {confirmDelete ? (
                  <span className="flex items-center gap-2 text-sm">
                    Delete this path?
                    <button type="button" onClick={deletePath} className="btn-danger py-2">
                      Delete
                    </button>
                    <button type="button" onClick={() => setConfirmDelete(false)} className="btn-ghost py-2">
                      Cancel
                    </button>
                  </span>
                ) : (
                  <button type="button" onClick={() => setConfirmDelete(true)} className="btn-danger">
                    <Trash2 size={15} /> Delete
                  </button>
                )}
              </div>
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-display text-lg font-bold text-ink">Courses in this path</h2>
            <p className="text-sm text-body">Courses with the same stage label are grouped together (e.g. “Month 1 · Foundations”). Changes save instantly.</p>
            <datalist id="stages">
              {stages.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
            <ol className="mt-4 space-y-2">
              {mine.map((m, i) => {
                const c = courseById.get(m.course_id);
                return (
                  <li key={m.course_id} className="flex flex-wrap items-center gap-3 rounded-xl border border-line p-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-700">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-ink">{c?.title ?? "Unknown course"}</p>
                      <p className="text-xs text-body">{c?.provider}</p>
                    </div>
                    <input
                      list="stages"
                      defaultValue={m.stage ?? ""}
                      onBlur={(e) => e.target.value !== (m.stage ?? "") && updateLink(m.course_id, { stage: e.target.value.trim() || null })}
                      className="input w-56 py-2"
                      placeholder="Stage label"
                      aria-label="Stage"
                    />
                    <div className="flex gap-0.5">
                      <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="flex h-8 w-8 items-center justify-center rounded-lg text-body hover:bg-brand-50 disabled:opacity-25" aria-label="Move up">
                        <ArrowUp size={15} />
                      </button>
                      <button type="button" onClick={() => move(i, 1)} disabled={i === mine.length - 1} className="flex h-8 w-8 items-center justify-center rounded-lg text-body hover:bg-brand-50 disabled:opacity-25" aria-label="Move down">
                        <ArrowDown size={15} />
                      </button>
                      <button type="button" onClick={() => removeLink(m.course_id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-body hover:bg-red-50 hover:text-red-600" aria-label="Remove from path">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </li>
                );
              })}
              {mine.length === 0 && <li className="rounded-xl bg-canvas px-4 py-3 text-sm text-body">No courses in this path yet.</li>}
            </ol>
            <div className="mt-4 grid gap-2 rounded-xl border border-dashed border-line p-4 sm:grid-cols-[1fr_220px_auto]">
              <select className="input" value={addCourse} onChange={(e) => setAddCourse(e.target.value)} aria-label="Course to add">
                <option value="">Choose a course to add…</option>
                {available.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} — {c.provider}
                  </option>
                ))}
              </select>
              <input list="stages" className="input" value={addStage} onChange={(e) => setAddStage(e.target.value)} placeholder="Stage (optional)" />
              <button type="button" onClick={addLink} disabled={!addCourse} className="btn-primary">
                <Plus size={16} /> Add
              </button>
            </div>
          </section>
          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
        </div>
      ) : (
        <div className="card p-10 text-center text-body">Create your first learning path to group courses in order.</div>
      )}
    </div>
  );
}
