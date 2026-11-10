import Link from "next/link";
import PageHero from "../PageHero";

const TABS = [
  { href: "/admin", label: "Courses & learners", key: "courses" },
  { href: "/admin/courses/new", label: "New course", key: "new" },
  { href: "/admin/paths", label: "Learning paths", key: "paths" },
];

export default function AdminShell({
  title,
  subtitle,
  active,
  crumbs = [],
  children,
}: {
  title: string;
  subtitle?: string;
  active: "courses" | "new" | "paths" | "edit";
  crumbs?: { href?: string; label: string }[];
  children: React.ReactNode;
}) {
  return (
    <main>
      <PageHero title={title} subtitle={subtitle} crumbs={[{ href: "/admin", label: "Admin" }, ...crumbs]} />
      <div className="border-b border-line bg-white">
        <div className="container-x flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={t.href}
              className={`whitespace-nowrap border-b-2 px-4 py-3.5 text-sm font-semibold transition-colors ${
                active === t.key ? "border-brand-600 text-brand-700" : "border-transparent text-body hover:text-ink"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="container-x py-10">{children}</div>
    </main>
  );
}
