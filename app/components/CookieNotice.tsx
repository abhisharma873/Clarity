"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

const DISMISSED_KEY = "clarity_cookie_notice_dismissed";
const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function getSnapshot(): boolean {
  return localStorage.getItem(DISMISSED_KEY) === "1";
}

// Unknown on the server — assume dismissed so there's no SSR/hydration flash.
function getServerSnapshot(): boolean {
  return true;
}

export function CookieNotice() {
  const dismissed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    listeners.forEach((listener) => listener());
  }

  if (dismissed) {
    return null;
  }

  return (
    // pointer-events-none on the bar + pointer-events-auto on just the link
    // and button: on short mobile viewports this fixed bar can end up
    // overlapping page content above it (e.g. the conversation view's Send
    // button once the chat grows) — without this, the bar's own empty
    // space/text would block clicks on whatever it's covering, even though
    // nothing there is actually interactive.
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-3 border-t border-stone-200 bg-white p-4 text-sm text-stone-600 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 sm:flex-row sm:justify-center">
      <p>
        We use a small number of analytics cookies to understand how Clarity is used. See our{" "}
        <Link
          href="/privacy"
          className="pointer-events-auto underline hover:text-stone-900 dark:hover:text-stone-50"
        >
          Privacy
        </Link>{" "}
        page for details.
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="pointer-events-auto shrink-0 rounded-full bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-800"
      >
        Got it
      </button>
    </div>
  );
}
