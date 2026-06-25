"use client";

import Link from "next/link";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-12">
      <Link href="/" className="mb-8 font-mono text-sm font-bold tracking-tight text-bone">
        <span className="text-gold">/</span>the-path
      </Link>
      <div className="rounded-xl border border-line bg-slate/60 p-7">
        <h1 className="font-display text-2xl font-semibold text-bone">{title}</h1>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
        <div className="mt-6 space-y-4">{children}</div>
      </div>
    </main>
  );
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  onEnter,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  onEnter?: () => void;
}) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onEnter) onEnter();
        }}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-md border border-line bg-ink px-3 py-2.5 text-bone placeholder:text-muted/60 focus:border-gold"
      />
    </label>
  );
}
