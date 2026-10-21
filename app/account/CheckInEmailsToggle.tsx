"use client";

import { useState, useTransition } from "react";
import { updateCheckInEmails } from "./actions";

export function CheckInEmailsToggle({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isPending, startTransition] = useTransition();

  function handleChange(next: boolean) {
    setEnabled(next);
    startTransition(() => {
      void updateCheckInEmails(next);
    });
  }

  return (
    <label className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
        30-day check-in emails
      </span>
      <input
        type="checkbox"
        checked={enabled}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.checked)}
        className="h-5 w-5 rounded border-stone-300"
      />
    </label>
  );
}
