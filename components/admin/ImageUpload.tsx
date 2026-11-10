"use client";

import { useRef, useState } from "react";
import { ImagePlus, Link2, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/** Upload to the `course-media` bucket, or paste any public image URL. */
export default function ImageUpload({
  label,
  hint,
  value,
  onChange,
  folder,
  square = false,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
  square?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) return setError("Please choose an image file.");
    if (file.size > 5 * 1024 * 1024) return setError("Images must be under 5 MB.");
    setBusy(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("course-media").upload(path, file, { upsert: false, contentType: file.type });
    setBusy(false);
    if (error) return setError(error.message);
    onChange(supabase.storage.from("course-media").getPublicUrl(path).data.publicUrl);
  }

  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => input.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) upload(f);
          }}
          className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-line bg-canvas text-body transition-colors hover:border-brand-300 hover:text-brand-700 ${
            square ? "h-28 w-28" : "h-28 w-44"
          }`}
          aria-label={`Upload ${label}`}
        >
          {busy ? (
            <Loader2 className="animate-spin" />
          ) : value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className={`h-full w-full ${square ? "object-contain p-2" : "object-cover"}`} />
          ) : (
            <span className="flex flex-col items-center gap-1 text-xs font-semibold">
              <ImagePlus size={22} /> Upload
            </span>
          )}
        </button>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="relative">
            <Link2 size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-body" />
            <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="…or paste an image URL" className="input pl-9" />
          </div>
          {hint && <p className="text-xs text-body">{hint}</p>}
          {value && (
            <button type="button" onClick={() => onChange("")} className="inline-flex items-center gap-1 text-xs font-semibold text-body hover:text-red-600">
              <X size={13} /> Remove image
            </button>
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
