"use client";

import { useActionState, useState } from "react";
import { startSession } from "@/app/session/actions";
import { INITIAL_SESSION_FORM_STATE } from "@/lib/sessions/form-state";
import { DECISION_TYPES } from "@/lib/decision-types";

const MAX_LENGTH = 200;

export function StartForm() {
  const [state, formAction, isPending] = useActionState(
    startSession,
    INITIAL_SESSION_FORM_STATE,
  );
  const [category, setCategory] = useState<string | null>(null);
  const [text, setText] = useState("");

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 text-center">
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">
          What decision are you facing?
        </h1>
      </div>

      <input type="hidden" name="decisionType" value={category ?? ""} />

      <div className="grid grid-cols-2 gap-3">
        {DECISION_TYPES.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setCategory(option)}
            className={`rounded-2xl border px-4 py-4 text-sm font-medium transition-colors ${
              category === option
                ? "border-amber-600 bg-amber-50 text-amber-900 dark:border-amber-500 dark:bg-amber-950/30 dark:text-amber-200"
                : "border-stone-300 bg-white text-stone-700 hover:border-amber-400 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="decisionText"
          className="text-sm font-medium text-stone-700 dark:text-stone-300"
        >
          In your own words, one line
        </label>
        <input
          id="decisionText"
          name="decisionText"
          type="text"
          required
          maxLength={MAX_LENGTH}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Should I take the new job offer?"
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
        />
        <span className="text-right text-xs text-stone-400">
          {text.length}/{MAX_LENGTH}
        </span>
      </div>

      {state.status === "error" && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-amber-700 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Starting..." : "Continue"}
      </button>
    </form>
  );
}
