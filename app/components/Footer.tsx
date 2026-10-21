import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 py-8 text-center text-sm text-stone-500 dark:border-stone-800 dark:text-stone-500">
      <p>
        &copy; 2026 Clarity &middot;{" "}
        <Link href="/privacy" className="underline hover:text-stone-700 dark:hover:text-stone-300">
          Privacy
        </Link>{" "}
        &middot;{" "}
        <Link href="/terms" className="underline hover:text-stone-700 dark:hover:text-stone-300">
          Terms
        </Link>
      </p>
    </footer>
  );
}
