import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-4 text-center">
      <h1 className="font-[var(--font-cinzel)] text-8xl font-bold text-[#f48b29] md:text-9xl">
        404
      </h1>
      <p className="font-[var(--font-inter)] mt-4 max-w-md text-lg text-white/60">
        This page has wandered off the trail. The path you&apos;re looking for
        doesn&apos;t exist on this map.
      </p>
      <Link
        href="/"
        className="font-[var(--font-cinzel)] mt-8 inline-block rounded-md bg-[#f48b29] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#0a0a0a] transition-colors hover:bg-[#d97722]"
      >
        Return Home
      </Link>
    </main>
  );
}
