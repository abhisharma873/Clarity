// The root layout's Header reads the visitor's auth cookie on every page
// (Phase 6), so this can no longer be statically prerendered.
export const instant = false;

export default function UnsubscribedPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12 font-sans">
      <div className="flex w-full max-w-sm flex-col gap-3 rounded-3xl border border-stone-200 bg-white p-8 text-center dark:border-stone-800 dark:bg-stone-900">
        <p className="text-lg font-semibold text-stone-900 dark:text-stone-50">
          You&apos;re unsubscribed.
        </p>
        <p className="text-sm text-stone-600 dark:text-stone-300">
          We won&apos;t send any more check-in emails. You can still see your saved plans any time
          in your account.
        </p>
      </div>
    </div>
  );
}
