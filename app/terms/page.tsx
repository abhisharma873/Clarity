// The root layout's Header reads the visitor's auth cookie on every page
// (Phase 6), so this can no longer be statically prerendered.
export const instant = false;

export default function TermsPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center px-6 py-12 font-sans">
      <div className="flex w-full max-w-xl flex-col gap-6">
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          <strong>Draft — not yet reviewed.</strong> This page is a starting point written for
          Phase 8 and has not been reviewed by a lawyer or by Clarity&apos;s founder. Don&apos;t rely
          on it as final until that review happens.
        </div>

        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">Terms</h1>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
            Entertainment and self-reflection only
          </h2>
          <p className="text-sm text-stone-700 dark:text-stone-200">
            Clarity is a tool for entertainment and self-reflection. It helps you think through a
            decision using guided questions and, if you choose, numerology as a starting point for
            reflection. It is not a prediction service and makes no claims about future events.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
            Not professional advice
          </h2>
          <p className="text-sm text-stone-700 dark:text-stone-200">
            Nothing in Clarity is medical, legal, financial, or psychological advice. Clarity
            plans are written by an AI model and reflect patterns in what you tell it, not
            professional judgment. For decisions that affect your health, finances, legal
            standing, or wellbeing, talk to a qualified professional.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
            Age requirement
          </h2>
          <p className="text-sm text-stone-700 dark:text-stone-200">
            You must be 18 years or older to use Clarity.
          </p>
        </section>
      </div>
    </div>
  );
}
