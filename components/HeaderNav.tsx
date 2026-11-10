"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BookOpen, ChevronDown, LayoutDashboard, LogOut, Menu, Search, Shield, X } from "lucide-react";
import Logo from "./Logo";
import { NAV } from "@/lib/site";
import { createClient } from "@/lib/supabase/client";

export default function HeaderNav({ username, isAdmin }: { username: string | null; isAdmin: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function signOut() {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  const links = [
    ...NAV,
    ...(username ? [{ href: "/dashboard", label: "My learning" }] : []),
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="container-x flex h-16 items-center gap-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                isActive(l.href) ? "bg-brand-50 text-brand-700" : "text-ink/80 hover:text-brand-700"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/courses"
            aria-label="Search courses"
            className="hidden h-10 w-10 items-center justify-center rounded-lg text-ink/70 hover:bg-brand-50 hover:text-brand-700 sm:flex"
          >
            <Search size={18} />
          </Link>

          {username ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenu((m) => !m)}
                className="flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 text-sm font-semibold text-ink hover:border-brand-300"
                aria-expanded={menu}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-xs font-bold uppercase text-white">
                  {username.slice(0, 2)}
                </span>
                <span className="hidden max-w-[120px] truncate sm:inline">{username}</span>
                <ChevronDown size={14} className="text-body" />
              </button>
              {menu && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-white p-1.5 shadow-lift">
                  <MenuLink href="/dashboard" icon={<LayoutDashboard size={16} />} label="My learning" />
                  <MenuLink href="/courses" icon={<BookOpen size={16} />} label="Browse courses" />
                  {isAdmin && <MenuLink href="/admin" icon={<Shield size={16} />} label="Admin panel" />}
                  <button
                    type="button"
                    onClick={signOut}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="hidden px-3 py-2 text-sm font-semibold text-ink hover:text-brand-700 sm:block">
                Log in
              </Link>
              <Link href="/signup" className="btn-primary">
                Join free
              </Link>
            </>
          )}

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-white px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`block rounded-lg px-3 py-2.5 text-sm font-semibold ${
                isActive(l.href) ? "bg-brand-50 text-brand-700" : "text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {!username && (
            <Link href="/login" className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-ink">
              Log in
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}

function MenuLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink hover:bg-brand-50 hover:text-brand-700">
      {icon} {label}
    </Link>
  );
}
