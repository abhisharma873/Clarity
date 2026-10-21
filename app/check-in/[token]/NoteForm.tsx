"use client";

import { useActionState } from "react";
import { addCheckInNote } from "./actions";
import { INITIAL_CHECK_IN_NOTE_STATE } from "./form-state";

export function NoteForm({ checkInId }: { checkInId: string }) {
  const [state, formAction, isPending] = useActionState(addCheckInNote, INITIAL_CHECK_IN_NOTE_STATE);

  if (state.status === "saved") {
    return <p className="text-center text-sm text-stone-500 dark:text-stone-400">{state.message}</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="checkInId" value={checkInId} />
      <label htmlFor="note" className="text-sm font-medium text-stone-700 dark:text-stone-300">
        Want to add a line? (optional)
      </label>
      <textarea
        id="note"
        name="note"
        rows={2}
        maxLength={500}
        placeholder="What happened?"
        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-50"
      />
      {state.status === "error" && <p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-full bg-amber-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Save
      </button>
    </form>
  );
}
