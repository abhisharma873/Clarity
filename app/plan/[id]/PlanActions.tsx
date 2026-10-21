"use client";

import posthog from "posthog-js";
import { useState } from "react";

export function PlanActions({
  planId,
  reflectionLine,
}: {
  planId: string;
  reflectionLine: string;
}) {
  const [includeDecision, setIncludeDecision] = useState(false);
  const [copied, setCopied] = useState(false);

  const cardUrl = `/api/card/${planId}?includeDecision=${includeDecision ? "1" : "0"}`;

  function handleDownload() {
    // Fire-and-forget: records the first-download timestamp for the admin
    // funnel and fires card_downloaded server-side. Never blocks the
    // browser's own download of the <a download> link.
    fetch(`/api/plan/${planId}/card-downloaded`, { method: "POST" }).catch(() => {});
  }

  async function handleShare() {
    const url = window.location.href;
    posthog.capture("card_shared");

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "My clarity plan", text: reflectionLine, url });
        return;
      } catch {
        // User cancelled or share failed — fall through to the clipboard fallback.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Nothing more we can do here.
    }
  }

  return (
    <div className="flex flex-col gap-4 print:hidden">
      <label className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
        <input
          type="checkbox"
          checked={includeDecision}
          onChange={(e) => setIncludeDecision(e.target.checked)}
          className="h-4 w-4 rounded border-stone-300"
        />
        Include my decision on the card
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700 transition-colors hover:border-amber-500 dark:border-stone-700 dark:text-stone-200"
        >
          Download PDF
        </button>

        <a
          href={cardUrl}
          download="clarity-card.png"
          onClick={handleDownload}
          className="rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700 transition-colors hover:border-amber-500 dark:border-stone-700 dark:text-stone-200"
        >
          Download card
        </a>

        <button
          type="button"
          onClick={handleShare}
          className="rounded-full bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
        >
          {copied ? "Link copied!" : "Share"}
        </button>
      </div>
    </div>
  );
}
