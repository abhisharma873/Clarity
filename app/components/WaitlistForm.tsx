"use client";

import { useActionState } from "react";
import { joinWaitlist } from "@/app/actions";
import { INITIAL_WAITLIST_STATE } from "@/lib/waitlist/action-state";
import { DECISION_TYPES } from "@/lib/waitlist/validate";

export function WaitlistForm() {
  const [state, formAction, isPending] = useActionState(
    joinWaitlist,
    INITIAL_WAITLIST_STATE,
  );

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-900/40 dark:bg-amber-950/20">
        <p className="text-base font-medium text-amber-900 dark:text-amber-200">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div
        className="absolute h-0 w-0 overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-sm font-medium text-stone-700 dark:text-stone-300"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="decisionType"
          className="text-sm font-medium text-stone-700 dark:text-stone-300"
        >
          What decision are you facing?{" "}
          <span className="text-stone-400">(optional)</span>
        </label>
        <select
          id="decisionType"
          name="decisionType"
          defaultValue=""
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
        >
          <option value="">Prefer not to say</option>
          {DECISION_TYPES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {state.status === "error" && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 w-full rounded-full bg-amber-700 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Joining..." : "Join the waitlist"}
      </button>
    </form>
  );
}
