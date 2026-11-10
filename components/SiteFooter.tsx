import Link from "next/link";
import Logo from "./Logo";
import { SITE } from "@/lib/site";

const COLS = [
  {
    title: "Learn",
    links: [
      { href: "/courses", label: "All courses" },
      { href: "/paths", label: "Learning paths" },
      { href: "/resources", label: "Free resources" },
    ],
  },
  {
    title: "Top categories",
    links: [
      { href: "/courses?category=Networking", label: "Networking" },
      { href: "/courses?category=Cybersecurity", label: "Cybersecurity" },
      { href: "/courses?category=Linux%20%26%20OS", label: "Linux & OS" },
      { href: "/courses?category=Cloud", label: "Cloud" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/dashboard", label: "My learning" },
      { href: "/signup", label: "Create account" },
      { href: "/login", label: "Log in" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-white/70">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">{SITE.tagline}</p>
          <p className="mt-4 max-w-sm text-xs leading-relaxed text-white/45">
            Courses are hosted and certified by their original creators. {SITE.name} helps you
            organize them, track your progress and keep going.
          </p>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <h3 className="font-display text-base font-bold text-white">{c.title}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-x py-5 text-xs text-white/40">
          © {new Date().getFullYear()} {SITE.name} · Built to make the path easier.
        </div>
      </div>
    </footer>
  );
}
