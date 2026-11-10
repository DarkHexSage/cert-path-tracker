import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-x flex flex-col items-center py-24 text-center">
      <p className="font-display text-7xl font-extrabold text-brand-200">404</p>
      <h1 className="mt-2 font-display text-2xl font-bold text-ink">We couldn&apos;t find that page</h1>
      <p className="mt-2 text-body">The course or path may have been moved or unpublished.</p>
      <Link href="/courses" className="btn-primary mt-6">
        Browse courses
      </Link>
    </main>
  );
}
