"use client";

import { useActionState } from "react";
import { submitDetails } from "@/app/session/actions";
import { INITIAL_SESSION_FORM_STATE } from "@/lib/sessions/form-state";

export function DetailsForm({ sessionId }: { sessionId: string }) {
  const [state, formAction, isPending] = useActionState(
    submitDetails,
    INITIAL_SESSION_FORM_STATE,
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">
          A couple of details
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          We only use this to calculate your numbers — your name and birth date are never
          stored.
        </p>
      </div>

      <input type="hidden" name="sessionId" value={sessionId} />

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="fullName"
          className="text-sm font-medium text-stone-700 dark:text-stone-300"
        >
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          required
          placeholder="Your full name at birth"
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="dateOfBirth"
          className="text-sm font-medium text-stone-700 dark:text-stone-300"
        >
          Date of birth
        </label>
        <input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          required
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
        />
      </div>

      {state.status === "error" && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-amber-600 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Calculating..." : "Continue"}
      </button>
    </form>
  );
}
