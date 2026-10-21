// The root layout's Header reads the visitor's auth cookie on every page
// (Phase 6), so this can no longer be statically prerendered.
export const instant = false;

export default function PrivacyPage() {
  const contactEmail = process.env.ADMIN_EMAIL ?? "[founder email — set ADMIN_EMAIL]";

  return (
    <div className="flex min-h-dvh flex-col items-center px-6 py-12 font-sans">
      <div className="flex w-full max-w-xl flex-col gap-6">
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          <strong>Draft — not yet reviewed.</strong> This page is a starting point written for
          Phase 8 and has not been reviewed by a lawyer or by Clarity&apos;s founder. Don&apos;t rely
          on it as final until that review happens.
        </div>

        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">Privacy</h1>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
            What we collect
          </h2>
          <ul className="list-disc pl-5 text-sm text-stone-700 dark:text-stone-200">
            <li>The decision category and the one-line description you type</li>
            <li>Chart numbers, if you choose the numerology lens (see below for what we don&apos;t store)</li>
            <li>The conversation you have during a session</li>
            <li>Your email address, only if you sign up to save a plan</li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
            What we never collect
          </h2>
          <p className="text-sm text-stone-700 dark:text-stone-200">
            We do not store your full name or date of birth. If you use the numerology lens, your
            name and birth date are used only in memory to calculate your chart numbers, then
            discarded — only the resulting numbers are saved.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
            We never sell your data
          </h2>
          <p className="text-sm text-stone-700 dark:text-stone-200">
            We don&apos;t sell or rent your data to anyone, for any reason.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
            How your data is used
          </h2>
          <p className="text-sm text-stone-700 dark:text-stone-200">
            Your decision, chart numbers (if any), and conversation are sent to our AI provider
            (Anthropic) to run your session and write your plan. If you sign up, we use your email
            to save your plan and to send an optional 30-day check-in — you can turn that off
            anytime from your account. We use a small set of anonymous, named analytics events (for
            example, that a session was started) to understand how Clarity is used; we never
            include your name, birth date, or message text in those events.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
            Deleting your data
          </h2>
          <p className="text-sm text-stone-700 dark:text-stone-200">
            If you&apos;ve signed up, go to your account page and choose &ldquo;Delete all my
            data.&rdquo; This removes your sessions, conversations, plans, and account in one step.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">Contact</h2>
          <p className="text-sm text-stone-700 dark:text-stone-200">
            Questions about your data? Email{" "}
            <a href={`mailto:${contactEmail}`} className="underline hover:text-stone-900 dark:hover:text-stone-50">
              {contactEmail}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
