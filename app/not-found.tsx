import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center font-sans">
      <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">Page not found</h1>
      <p className="max-w-sm text-sm text-stone-600 dark:text-stone-400">
        We couldn&apos;t find what you were looking for. It may have moved, or the link might be
        off.
      </p>
      <Link
        href="/"
        className="rounded-full bg-amber-700 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-800"
      >
        Go home
      </Link>
    </div>
  );
}
