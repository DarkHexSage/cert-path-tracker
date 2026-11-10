import { ExternalLink, PlayCircle, Youtube } from "lucide-react";
import { CHANNELS, VIDEOS, SUGGESTED } from "@/lib/resources";

export default function Resources() {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-display text-2xl font-bold text-ink">YouTube channels worth subscribing to</h2>
        <p className="mt-1 text-sm text-body">Your free university — pair these with any course on the platform.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map((c) => (
            <a
              key={c.name}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group card flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-colors group-hover:bg-red-600 group-hover:text-white">
                <Youtube size={22} />
              </span>
              <span className="mt-4 font-display text-base font-bold text-ink">{c.name}</span>
              <span className="mt-1 text-sm text-body">{c.focus}</span>
              <span className="mt-auto pt-4 text-xs font-semibold text-brand-700">{c.bestFor}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <h3 className="font-display text-lg font-bold text-ink">Hand-picked videos</h3>
          <ul className="mt-4 space-y-2">
            {VIDEOS.map((v) => (
              <li key={v.url}>
                <a
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 rounded-xl p-2.5 text-sm text-ink transition-colors hover:bg-brand-50"
                >
                  <PlayCircle size={18} className="mt-0.5 shrink-0 text-brand-600" />
                  <span className="flex-1">{v.title}</span>
                  <ExternalLink size={14} className="mt-1 shrink-0 text-body" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-6">
          <h3 className="font-display text-lg font-bold text-ink">Watch this, by month</h3>
          <ul className="mt-4 space-y-3">
            {SUGGESTED.map((s) => (
              <li key={s.months} className="flex items-start gap-3 text-sm text-ink">
                <span className="chip shrink-0 bg-brand-50 text-brand-700">Month {s.months}</span>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
