"use client";

import { Award, CheckCircle2, ListChecks } from "lucide-react";
import { LogoMark } from "./Logo";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <main className="container-x grid min-h-[calc(100vh-4rem)] items-center gap-10 py-12 lg:grid-cols-2">
      <div className="hero-band hidden h-full min-h-[520px] flex-col justify-between rounded-3xl p-10 text-white lg:flex">
        <LogoMark size={44} />
        <div>
          <h2 className="font-display text-3xl font-extrabold leading-tight">Every course. Every task. Every badge — in one place.</h2>
          <ul className="mt-6 space-y-3 text-white/90">
            <li className="flex items-center gap-3">
              <ListChecks size={18} /> Step-by-step checklists for each course
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 size={18} /> Progress that grows with every task
            </li>
            <li className="flex items-center gap-3">
              <Award size={18} /> A badge wall to show what you&apos;ve earned
            </li>
          </ul>
        </div>
        <p className="text-sm text-white/60">Free forever. Courses hosted by their original creators.</p>
      </div>
      <div className="mx-auto w-full max-w-md">
        <div className="card p-8">
          <h1 className="font-display text-2xl font-extrabold text-ink">{title}</h1>
          <p className="mt-1 text-sm text-body">{subtitle}</p>
          <div className="mt-6 space-y-4">{children}</div>
        </div>
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
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  onEnter?: () => void;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onEnter) onEnter();
        }}
        placeholder={placeholder}
        className="input py-3"
      />
    </label>
  );
}
