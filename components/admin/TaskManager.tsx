"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Check, ExternalLink, ListPlus, Pencil, Plus, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { CourseTask } from "@/lib/types";

/** Add, edit, reorder and delete the to-do tasks that drive a course's progress %. */
export default function TaskManager({ courseId, initial }: { courseId: string; initial: CourseTask[] }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [tasks, setTasks] = useState<CourseTask[]>(initial);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [url, setUrl] = useState("");
  const [bulk, setBulk] = useState("");
  const [showBulk, setShowBulk] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ title: string; details: string; resource_url: string }>({ title: "", details: "", resource_url: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextOrder = () => (tasks.length ? Math.max(...tasks.map((t) => t.sort_order)) + 10 : 0);
  const fixUrl = (u: string) => (u.trim() ? (/^https?:\/\//.test(u.trim()) ? u.trim() : `https://${u.trim()}`) : null);

  async function addMany(rows: { title: string; details?: string | null; resource_url?: string | null }[]) {
    if (!rows.length) return;
    setBusy(true);
    setError(null);
    const base = nextOrder();
    const { data, error } = await supabase
      .from("course_tasks")
      .insert(rows.map((r, i) => ({ course_id: courseId, title: r.title, details: r.details ?? null, resource_url: r.resource_url ?? null, sort_order: base + i * 10 })))
      .select("*");
    setBusy(false);
    if (error) return setError(error.message);
    setTasks((t) => [...t, ...((data ?? []) as CourseTask[])]);
    router.refresh();
  }

  async function addOne() {
    if (!title.trim()) return;
    await addMany([{ title: title.trim(), details: details.trim() || null, resource_url: fixUrl(url) }]);
    setTitle("");
    setDetails("");
    setUrl("");
  }

  async function addBulk() {
    const rows = bulk
      .split("\n")
      .map((l) => l.replace(/^\s*(?:[-*•]|\d+[.)]|\[\s?\])\s*/, "").trim())
      .filter(Boolean)
      .map((t) => ({ title: t }));
    await addMany(rows);
    setBulk("");
    setShowBulk(false);
  }

  async function saveEdit(id: string) {
    if (!draft.title.trim()) return;
    setBusy(true);
    const patch = { title: draft.title.trim(), details: draft.details.trim() || null, resource_url: fixUrl(draft.resource_url) };
    const { error } = await supabase.from("course_tasks").update(patch).eq("id", id);
    setBusy(false);
    if (error) return setError(error.message);
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    setEditing(null);
  }

  async function remove(id: string) {
    setBusy(true);
    const { error } = await supabase.from("course_tasks").delete().eq("id", id);
    setBusy(false);
    if (error) return setError(error.message);
    setTasks((ts) => ts.filter((t) => t.id !== id));
    router.refresh();
  }

  async function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= tasks.length) return;
    const reordered = [...tasks];
    [reordered[i], reordered[j]] = [reordered[j], reordered[i]];
    const withOrder = reordered.map((t, idx) => ({ ...t, sort_order: idx * 10 }));
    setTasks(withOrder);
    const changed = [withOrder[i], withOrder[j]];
    const results = await Promise.all(changed.map((t) => supabase.from("course_tasks").update({ sort_order: t.sort_order }).eq("id", t.id)));
    const err = results.find((r) => r.error)?.error;
    if (err) setError(err.message);
  }

  return (
    <section className="card p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-ink">Course checklist</h2>
          <p className="text-sm text-body">
            Learners tick these off. Progress = tasks done ÷ {tasks.length || "total"} tasks. Finishing all of them earns the badge.
          </p>
        </div>
        <button type="button" onClick={() => setShowBulk((s) => !s)} className="btn-soft">
          <ListPlus size={16} /> Paste a list
        </button>
      </div>

      {showBulk && (
        <div className="mt-4 rounded-xl border border-brand-200 bg-brand-50/50 p-4">
          <label className="label">One task per line (bullets and numbers are removed)</label>
          <textarea
            value={bulk}
            onChange={(e) => setBulk(e.target.value)}
            rows={6}
            className="input"
            placeholder={"Enroll in the course\nComplete module 1\nComplete module 2\nPass the final exam\nClaim your badge on Credly"}
          />
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={addBulk} disabled={busy || !bulk.trim()} className="btn-primary">
              Add {bulk.split("\n").filter((l) => l.trim()).length || ""} tasks
            </button>
            <button type="button" onClick={() => setShowBulk(false)} className="btn-ghost">
              Cancel
            </button>
          </div>
        </div>
      )}

      <ol className="mt-5 space-y-2">
        {tasks.map((t, i) => (
          <li key={t.id} className="rounded-xl border border-line bg-white p-3">
            {editing === t.id ? (
              <div className="space-y-2">
                <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="input" placeholder="Task title" autoFocus />
                <input value={draft.details} onChange={(e) => setDraft({ ...draft, details: e.target.value })} className="input" placeholder="Details (optional)" />
                <input value={draft.resource_url} onChange={(e) => setDraft({ ...draft, resource_url: e.target.value })} className="input" placeholder="Helpful link (optional)" />
                <div className="flex gap-2">
                  <button type="button" onClick={() => saveEdit(t.id)} disabled={busy} className="btn-primary py-2">
                    <Check size={15} /> Save
                  </button>
                  <button type="button" onClick={() => setEditing(null)} className="btn-ghost py-2">
                    <X size={15} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-700">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink">{t.title}</p>
                  {t.details && <p className="text-sm text-body">{t.details}</p>}
                  {t.resource_url && (
                    <a href={t.resource_url} target="_blank" rel="noopener noreferrer" className="mt-0.5 inline-flex items-center gap-1 text-xs text-brand-700 hover:underline">
                      <ExternalLink size={12} /> {t.resource_url}
                    </a>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  <IconBtn label="Move up" onClick={() => move(i, -1)} disabled={i === 0}>
                    <ArrowUp size={15} />
                  </IconBtn>
                  <IconBtn label="Move down" onClick={() => move(i, 1)} disabled={i === tasks.length - 1}>
                    <ArrowDown size={15} />
                  </IconBtn>
                  <IconBtn
                    label="Edit"
                    onClick={() => {
                      setEditing(t.id);
                      setDraft({ title: t.title, details: t.details ?? "", resource_url: t.resource_url ?? "" });
                    }}
                  >
                    <Pencil size={15} />
                  </IconBtn>
                  <IconBtn label="Delete" onClick={() => remove(t.id)} danger>
                    <Trash2 size={15} />
                  </IconBtn>
                </div>
              </div>
            )}
          </li>
        ))}
        {tasks.length === 0 && (
          <li className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            No tasks yet — learners can&apos;t track progress until you add at least one.
          </li>
        )}
      </ol>

      <div className="mt-5 rounded-xl border border-dashed border-line p-4">
        <p className="label">Add a task</p>
        <div className="grid gap-2 md:grid-cols-[1.4fr_1fr_1fr_auto]">
          <input value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addOne()} className="input" placeholder="e.g. Complete module 3: Networking" />
          <input value={details} onChange={(e) => setDetails(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addOne()} className="input" placeholder="Details (optional)" />
          <input value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addOne()} className="input" placeholder="Link (optional)" />
          <button type="button" onClick={addOne} disabled={busy || !title.trim()} className="btn-primary">
            <Plus size={16} /> Add
          </button>
        </div>
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </section>
  );
}

function IconBtn({ label, onClick, disabled, danger, children }: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-8 w-8 items-center justify-center rounded-lg text-body transition-colors disabled:opacity-25 ${
        danger ? "hover:bg-red-50 hover:text-red-600" : "hover:bg-brand-50 hover:text-brand-700"
      }`}
    >
      {children}
    </button>
  );
}
