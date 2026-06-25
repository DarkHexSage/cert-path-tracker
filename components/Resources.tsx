import { CHANNELS, VIDEOS, SUGGESTED } from "@/lib/resources";

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 5v14l11-7z" fill="currentColor" />
    </svg>
  );
}

export default function Resources() {
  return (
    <section id="resources">
      <div className="mb-8 flex items-baseline justify-between">
        <h2 className="font-display text-2xl font-semibold text-bone">Your free university</h2>
        <span className="font-mono text-xs text-muted">YouTube · $0</span>
      </div>

      {/* Channels */}
      <div className="grid gap-2 sm:grid-cols-2">
        {CHANNELS.map((c) => (
          <a
            key={c.name}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-3 rounded-lg border border-line bg-slate/40 px-4 py-3 transition-colors hover:border-gold/50"
          >
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gold/15 text-gold transition-colors group-hover:bg-gold group-hover:text-ink">
              <PlayIcon />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-[15px] font-semibold text-bone">{c.name}</span>
              <span className="block text-[13px] leading-snug text-muted">{c.focus}</span>
              <span className="mt-0.5 block font-mono text-[11px] text-muted/80">{c.bestFor}</span>
            </span>
          </a>
        ))}
      </div>

      {/* Hand-picked videos + suggested playlists */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-line bg-slate/40 p-5">
          <p className="eyebrow mb-3">Hand-picked videos</p>
          <ul className="space-y-2.5">
            {VIDEOS.map((v) => (
              <li key={v.url}>
                <a
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-[14px] text-bone/90 transition-colors hover:text-gold"
                >
                  <span className="mt-1 shrink-0 text-gold">
                    <PlayIcon />
                  </span>
                  <span>
                    {v.title}
                    {v.month && (
                      <span className="ml-2 font-mono text-[11px] text-muted">
                        Month {v.month}
                      </span>
                    )}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-line bg-slate/40 p-5">
          <p className="eyebrow mb-3">Watch this, by month</p>
          <ul className="space-y-2.5">
            {SUGGESTED.map((s) => (
              <li key={s.months} className="flex items-start gap-3 text-[14px] text-bone/90">
                <span className="mt-0.5 shrink-0 rounded border border-line px-1.5 py-0.5 font-mono text-[11px] text-gold">
                  {s.months}
                </span>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
