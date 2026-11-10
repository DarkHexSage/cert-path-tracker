import Link from "next/link";
import { SITE } from "@/lib/site";

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <linearGradient id="lg-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9474FB" />
          <stop offset="1" stopColor="#4F2BC2" />
        </linearGradient>
      </defs>
      <path d="M20 2 L36 11 L36 29 L20 38 L4 29 L4 11 Z" fill="url(#lg-mark)" />
      <path
        d="M13 26 L20 12 L27 26 M16 21 H24"
        fill="none"
        stroke="white"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={`${SITE.name} home`}>
      <LogoMark />
      <span
        className={`font-display text-xl font-extrabold tracking-tight ${light ? "text-white" : "text-ink"}`}
      >
        {SITE.short} <span className={light ? "text-brand-200" : "text-brand-600"}>Academy</span>
      </span>
    </Link>
  );
}
