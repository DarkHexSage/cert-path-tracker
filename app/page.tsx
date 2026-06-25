import Link from "next/link";
import Stats from "@/components/Stats";
import RoadmapTimeline from "@/components/RoadmapTimeline";
import { TOTAL_BADGES } from "@/lib/roadmap";

const EMPTY = new Set<string>();

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-24">
      {/* Nav */}
      <nav className="flex items-center justify-between py-6">
        <Link href="/" className="font-mono text-sm font-bold tracking-tight text-bone">
          <span className="text-gold">/</span>the-path
        </Link>
        <div className="flex items-center gap-5">
          <Link
            href="/login"
            className="font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-bone"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-gold px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-ink transition-transform hover:scale-[1.03]"
          >
            Start free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="animate-fade-up pt-10 sm:pt-16">
        <p className="eyebrow">Free · 6 months · no degree · no money</p>
        <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-bone sm:text-6xl">
          Zero to junior IT support
          <br />
          <span className="text-gold">in six months.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          A no-excuses roadmap that turns 2–3 focused hours a day into{" "}
          <span className="text-bone">{TOTAL_BADGES} verifiable badges</span> recruiters can
          actually find. You bring the discipline and an internet connection. The path does the
          rest.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="rounded-md bg-gold px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-ink transition-transform hover:scale-[1.03]"
          >
            Start the path today
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-line px-6 py-3 font-mono text-sm uppercase tracking-wider text-bone transition-colors hover:border-gold/60"
          >
            I already started
          </Link>
        </div>
      </header>

      {/* Live stats — the social proof */}
      <section className="mt-14">
        <Stats countVisit />
        <p className="mt-3 text-center font-mono text-xs text-muted">
          Live count · every badge below is one someone earned for free
        </p>
      </section>

      {/* The path */}
      <section className="mt-20">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-semibold text-bone">The path</h2>
          <span className="font-mono text-xs text-muted">6 months · 30+ steps</span>
        </div>
        <RoadmapTimeline completed={EMPTY} readOnly />
      </section>

      {/* Closing CTA */}
      <section className="mt-16 rounded-xl border border-gold/30 bg-gold/[0.05] p-8 text-center">
        <h2 className="font-display text-2xl font-semibold text-bone sm:text-3xl">
          Start today. Not Monday. Today.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Create a free account, check off your first task, and let the counter above tick up
          because of you. In six months you&apos;ll be glad you started now.
        </p>
        <Link
          href="/signup"
          className="mt-6 inline-block rounded-md bg-gold px-7 py-3 font-mono text-sm font-bold uppercase tracking-wider text-ink transition-transform hover:scale-[1.03]"
        >
          Create your free account
        </Link>
      </section>

      <footer className="mt-20 border-t border-line pt-6 text-center font-mono text-xs text-muted">
        Built to help people change their lives · track your run, earn your proof
      </footer>
    </main>
  );
}
