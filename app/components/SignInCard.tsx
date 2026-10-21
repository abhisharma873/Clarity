"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signInWithEmail, signInWithGoogle } from "@/app/auth/actions";
import { INITIAL_EMAIL_SIGNIN_STATE } from "@/app/auth/form-state";

export function SignInCard({
  redirectTo,
  title = "Save your plan and get a 30-day check-in",
}: {
  redirectTo: string;
  title?: string;
}) {
  const [state, formAction, isPending] = useActionState(
    signInWithEmail,
    INITIAL_EMAIL_SIGNIN_STATE,
  );

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
      <h2 className="text-center text-lg font-semibold text-stone-900 dark:text-stone-50">
        {title}
      </h2>

      <form action={signInWithGoogle}>
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <button
          type="submit"
          className="w-full rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-amber-500 dark:border-stone-700 dark:text-stone-200"
        >
          Continue with Google
        </button>
      </form>

      <div className="flex items-center gap-3 text-xs text-stone-400">
        <span className="h-px flex-1 bg-stone-200 dark:bg-stone-700" />
        or
        <span className="h-px flex-1 bg-stone-200 dark:bg-stone-700" />
      </div>

      {state.status === "sent" ? (
        <p className="text-center text-sm text-amber-700 dark:text-amber-400">{state.message}</p>
      ) : (
        <form action={formAction} className="flex flex-col gap-2">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
          />
          {state.status === "error" && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {state.message}
            </p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full bg-amber-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Sending..." : "Email me a sign-in link"}
          </button>
        </form>
      )}

      <p className="text-center text-xs text-stone-400">
        By continuing, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-stone-600 dark:hover:text-stone-300">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-stone-600 dark:hover:text-stone-300">
          Privacy
        </Link>{" "}
        policy.
      </p>
    </section>
  );
}
