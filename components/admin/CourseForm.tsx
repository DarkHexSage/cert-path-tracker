"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Save, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slug";
import { SUGGESTED_CATEGORIES, SUGGESTED_PROVIDERS } from "@/lib/categories";
import { LEVELS, type Course, type CourseCardData, type Level } from "@/lib/types";
import { CourseCardGrid } from "../CourseCard";
import ImageUpload from "./ImageUpload";

type FormState = {
  title: string;
  slug: string;
  provider: string;
  category: string;
  level: Level;
  language: string;
  duration_hours: string;
  is_free: boolean;
  course_url: string;
  short_description: string;
  description: string;
  outcomes: string;
  badge_name: string;
  badge_image_url: string;
  cover_url: string;
  is_published: boolean;
  is_featured: boolean;
  sort_order: string;
};

function toForm(c?: Course): FormState {
  return {
    title: c?.title ?? "",
    slug: c?.slug ?? "",
    provider: c?.provider ?? "",
    category: c?.category ?? "",
    level: c?.level ?? "Beginner",
    language: c?.language ?? "English",
    duration_hours: c?.duration_hours != null ? String(c.duration_hours) : "",
    is_free: c?.is_free ?? true,
    course_url: c?.course_url ?? "",
    short_description: c?.short_description ?? "",
    description: c?.description ?? "",
    outcomes: (c?.outcomes ?? []).join("\n"),
    badge_name: c?.badge_name ?? "",
    badge_image_url: c?.badge_image_url ?? "",
    cover_url: c?.cover_url ?? "",
    is_published: c?.is_published ?? true,
    is_featured: c?.is_featured ?? false,
    sort_order: String(c?.sort_order ?? 100),
  };
}

export default function CourseForm({ course, taskCount = 0 }: { course?: Course; taskCount?: number }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [f, setF] = useState<FormState>(() => toForm(course));
  const [slugTouched, setSlugTouched] = useState(!!course);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setSaved(false);
    setF((prev) => {
      const next = { ...prev, [k]: v };
      if (k === "title" && !slugTouched) next.slug = slugify(String(v));
      return next;
    });
  };

  function payload() {
    const url = f.course_url.trim();
    return {
      title: f.title.trim(),
      slug: slugify(f.slug || f.title),
      provider: f.provider.trim(),
      category: f.category.trim() || "General",
      level: f.level,
      language: f.language.trim() || "English",
      duration_hours: f.duration_hours ? Number(f.duration_hours) : null,
      is_free: f.is_free,
      course_url: url ? (/^https?:\/\//.test(url) ? url : `https://${url}`) : null,
      short_description: f.short_description.trim() || null,
      description: f.description.trim() || null,
      outcomes: f.outcomes.split("\n").map((s) => s.trim()).filter(Boolean),
      badge_name: f.badge_name.trim() || null,
      badge_image_url: f.badge_image_url.trim() || null,
      cover_url: f.cover_url.trim() || null,
      is_published: f.is_published,
      is_featured: f.is_featured,
      sort_order: Number(f.sort_order) || 0,
    };
  }

  async function save() {
    setError(null);
    const p = payload();
    if (!p.title) return setError("Give the course a title.");
    if (!p.provider) return setError("Who created this course? Add the provider.");
    if (!p.slug) return setError("The URL slug can't be empty.");
    setBusy(true);
    if (course) {
      const { error } = await supabase.from("courses").update(p).eq("id", course.id);
      setBusy(false);
      if (error) return setError(error.code === "23505" ? "Another course already uses that URL slug." : error.message);
      setSaved(true);
      router.refresh();
    } else {
      const { data, error } = await supabase.from("courses").insert(p).select("id").single();
      setBusy(false);
      if (error) return setError(error.code === "23505" ? "Another course already uses that URL slug." : error.message);
      router.push(`/admin/courses/${data.id}?created=1`);
      router.refresh();
    }
  }

  async function remove() {
    if (!course) return;
    setBusy(true);
    const { error } = await supabase.from("courses").delete().eq("id", course.id);
    setBusy(false);
    if (error) return setError(error.message);
    router.push("/admin");
    router.refresh();
  }

  const preview: CourseCardData = {
    id: course?.id ?? "preview",
    created_at: course?.created_at ?? new Date().toISOString(),
    ...payload(),
    title: f.title || "Your course title",
    provider: f.provider || "Provider",
    short_description: f.short_description || "A short, punchy summary of the course shows here.",
    task_count: taskCount,
    learners: 0,
    done: 0,
    enrolled: false,
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <Section title="Basics" desc="What is the course and who made it?">
          <Text label="Course title *" value={f.title} onChange={(v) => set("title", v)} placeholder="e.g. Introduction to Linux (LFS101)" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Text label="Provider / original creator *" value={f.provider} onChange={(v) => set("provider", v)} placeholder="Linux Foundation" list="providers" />
            <Text label="Category" value={f.category} onChange={(v) => set("category", v)} placeholder="Linux & OS" list="categories" />
          </div>
          <Text
            label="Link to the original course"
            value={f.course_url}
            onChange={(v) => set("course_url", v)}
            placeholder="https://training.linuxfoundation.org/…"
          />
          <div className="grid gap-4 sm:grid-cols-4">
            <label className="block">
              <span className="label">Level</span>
              <select value={f.level} onChange={(e) => set("level", e.target.value as Level)} className="input">
                {LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </label>
            <Text label="Language" value={f.language} onChange={(v) => set("language", v)} />
            <Text label="Hours (approx.)" type="number" value={f.duration_hours} onChange={(v) => set("duration_hours", v)} placeholder="20" />
            <label className="block">
              <span className="label">Price</span>
              <select value={f.is_free ? "free" : "paid"} onChange={(e) => set("is_free", e.target.value === "free")} className="input">
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </label>
          </div>
          <datalist id="providers">
            {SUGGESTED_PROVIDERS.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
          <datalist id="categories">
            {SUGGESTED_CATEGORIES.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </Section>

        <Section title="Pictures" desc="The cover shows on course cards. Leave it empty and we'll draw a colourful cover with the badge.">
          <ImageUpload label="Course picture (cover)" hint="Landscape works best, e.g. 1600×900." value={f.cover_url} onChange={(v) => set("cover_url", v)} folder="covers" />
          <ImageUpload label="Badge image" hint="Square PNG with transparent background, e.g. from Credly." value={f.badge_image_url} onChange={(v) => set("badge_image_url", v)} folder="badges" square />
          <Text
            label="Badge name"
            value={f.badge_name}
            onChange={(v) => set("badge_name", v)}
            placeholder="Leave empty if this course has no badge"
          />
        </Section>

        <Section title="Details page" desc="What learners read when they open the course.">
          <Text label="Short description" value={f.short_description} onChange={(v) => set("short_description", v)} placeholder="One sentence for cards and search results" />
          <Area label="Full description" value={f.description} onChange={(v) => set("description", v)} rows={6} placeholder="Blank lines start a new paragraph." />
          <Area label="What you'll learn (one per line)" value={f.outcomes} onChange={(v) => set("outcomes", v)} rows={4} placeholder={"Navigate the Linux filesystem\nManage users and permissions"} />
        </Section>

        <Section title="Visibility" desc="">
          <div className="flex flex-wrap gap-6">
            <Check label="Published (visible to learners)" checked={f.is_published} onChange={(v) => set("is_published", v)} />
            <Check label="Featured on the home page" checked={f.is_featured} onChange={(v) => set("is_featured", v)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Text label="URL slug" value={f.slug} onChange={(v) => { setSlugTouched(true); set("slug", v); }} placeholder="introduction-to-linux" />
            <Text label="Sort order (lower shows first)" type="number" value={f.sort_order} onChange={(v) => set("sort_order", v)} />
          </div>
        </Section>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={save} disabled={busy} className="btn-primary px-6 py-3">
            <Save size={16} /> {busy ? "Saving…" : course ? "Save changes" : "Create course & add tasks"}
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-success">
              <CheckCircle2 size={16} /> Saved
            </span>
          )}
          {course && (
            <div className="ml-auto">
              {confirmDelete ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-body">Delete course, its tasks and all learner progress?</span>
                  <button type="button" onClick={remove} disabled={busy} className="btn-danger py-2">
                    Delete
                  </button>
                  <button type="button" onClick={() => setConfirmDelete(false)} className="btn-ghost py-2">
                    Cancel
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirmDelete(true)} className="btn-danger">
                  <Trash2 size={15} /> Delete course
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <aside className="xl:sticky xl:top-24 xl:self-start">
        <p className="label">Live preview</p>
        <div className="pointer-events-none">
          <CourseCardGrid c={preview} />
        </div>
      </aside>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <section className="card space-y-4 p-6">
      <div>
        <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
        {desc && <p className="text-sm text-body">{desc}</p>}
      </div>
      {children}
    </section>
  );
}

function Text({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  list,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  list?: string;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <input type={type} value={value} list={list} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input" />
    </label>
  );
}

function Area({ label, value, onChange, rows, placeholder }: { label: string; value: string; onChange: (v: string) => void; rows: number; placeholder?: string }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <textarea value={value} rows={rows} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input resize-y leading-relaxed" />
    </label>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-ink">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded accent-brand-600" />
      {label}
    </label>
  );
}
