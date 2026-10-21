"use client";

import { useState } from "react";
import { submitFeedback } from "@/app/plan/actions";
import type { Feedback } from "@/lib/plans/types";

const OPTIONS: { value: Feedback; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "somewhat", label: "Somewhat" },
  { value: "no", label: "No" },
];

export function FeedbackForm({ planId }: { planId: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleClick(value: Feedback) {
    if (isSubmitting || submitted) return;
    setIsSubmitting(true);
    await submitFeedback(planId, value);
    setIsSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="text-center text-sm text-stone-500 dark:text-stone-400">
        Thanks for letting us know.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
        Did this help you decide?
      </p>
      <div className="flex gap-2">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleClick(option.value)}
            disabled={isSubmitting}
            className="rounded-full border border-stone-300 px-5 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-amber-500 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-stone-700 dark:text-stone-200"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
