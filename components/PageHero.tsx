import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function PageHero({
  title,
  subtitle,
  crumbs = [],
  children,
}: {
  title: string;
  subtitle?: string;
  crumbs?: { href?: string; label: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="hero-band relative overflow-hidden text-white">
      <HeroArt />
      <div className="container-x relative py-12 sm:py-14">
        <nav className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-white/85" aria-label="Breadcrumb">
          <Link href="/" className="inline-flex items-center gap-1.5 hover:text-white">
            <Home size={15} /> Home
          </Link>
          {crumbs.map((c) => (
            <span key={c.label} className="inline-flex items-center gap-1.5">
              <ChevronRight size={14} className="opacity-70" />
              {c.href ? (
                <Link href={c.href} className="hover:text-white">
                  {c.label}
                </Link>
              ) : (
                <span className="text-white">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-base text-white/85 sm:text-lg">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}

/** Decorative stack of hex badges on the right of the band. */
function HeroArt() {
  return (
    <svg
      className="pointer-events-none absolute -right-6 top-1/2 hidden h-[240px] w-[340px] -translate-y-1/2 md:block"
      viewBox="0 0 340 240"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hx1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FDE68A" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id="hx2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#E9E3FF" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <g opacity="0.25">
        <circle cx="300" cy="30" r="40" fill="white" />
        <circle cx="40" cy="210" r="22" fill="white" />
      </g>
      <g transform="translate(140 40) rotate(-12)">
        <path d="M60 0 L112 30 L112 90 L60 120 L8 90 L8 30 Z" fill="url(#hx2)" />
        <path d="M60 22 L92 40 L92 80 L60 98 L28 80 L28 40 Z" fill="#7350F2" opacity="0.85" />
        <path d="M44 60 L56 72 L78 48" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(232 110) rotate(14)">
        <path d="M40 0 L75 20 L75 60 L40 80 L5 60 L5 20 Z" fill="url(#hx1)" />
        <path d="M40 22 l5 11 12 2 -9 8 2 12 -10 -6 -10 6 2 -12 -9 -8 12 -2z" fill="white" />
      </g>
      <g transform="translate(90 140) rotate(8)">
        <path d="M30 0 L56 15 L56 45 L30 60 L4 45 L4 15 Z" fill="white" opacity="0.55" />
      </g>
      <circle cx="120" cy="40" r="5" fill="#FDE68A" />
      <circle cx="320" cy="200" r="4" fill="white" />
      <circle cx="210" cy="20" r="3" fill="white" />
    </svg>
  );
}
