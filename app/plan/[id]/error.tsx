"use client";

import Link from "next/link";

export default function PlanError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center font-sans">
      <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">
        Something went wrong
      </h1>
      <p className="max-w-sm text-sm text-stone-600 dark:text-stone-400">
        We couldn&apos;t load this plan right now. Please try again shortly.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700 dark:border-stone-700 dark:text-stone-200"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full bg-amber-700 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-800"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
