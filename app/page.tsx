import { EventOnMount } from "@/app/components/EventOnMount";
import { Footer } from "@/app/components/Footer";
import { WaitlistForm } from "@/app/components/WaitlistForm";

// The root layout's Header reads the visitor's auth cookie on every page
// (Phase 6), so this can no longer be statically prerendered.
export const instant = false;

const BENEFITS = [
  "Clarity on one decision.",
  "A written plan you keep.",
  "No fear, no remedies, no per-minute charges.",
];

const STEPS = [
  { step: "1", title: "Choose a lens", body: "Reflection, or start from your numerology numbers." },
  { step: "2", title: "Answer a few questions", body: "A short, guided conversation about your decision." },
  { step: "3", title: "Get your clarity plan", body: "A written plan you can keep and revisit." },
];

const PROMISES = [
  "No predictions.",
  "No remedies or gemstones.",
  "We never sell your data.",
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400"
      aria-hidden="true"
    >
      <path
        d="M4 10.5l4 4 8-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col font-sans">
      <EventOnMount event="landing_viewed" />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-16 px-6 py-16 sm:gap-20 sm:py-24">
        {/* Hero */}
        <section className="flex flex-col items-center gap-5 text-center">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Facing a big decision? Get clarity in 10 minutes.
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-stone-600 dark:text-stone-300">
            A guided clarity session, not a prediction. Use simple
            reflection, or start from your numerology numbers.
          </p>
        </section>

        {/* Benefits */}
        <section>
          <ul className="flex flex-col gap-3">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-base text-stone-700 dark:text-stone-200">
                <CheckIcon />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* How it works */}
        <section className="rounded-3xl bg-amber-50 p-6 dark:bg-amber-950/20 sm:p-8">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
            How it works
          </h2>
          <ol className="mt-6 flex flex-col gap-6 sm:flex-row sm:gap-4">
            {STEPS.map(({ step, title, body }) => (
              <li key={step} className="flex flex-1 flex-col gap-1.5 text-center">
                <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-sm font-semibold text-white">
                  {step}
                </span>
                <span className="font-medium text-stone-800 dark:text-stone-100">{title}</span>
                <span className="text-sm text-stone-600 dark:text-stone-400">{body}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Our promise */}
        <section className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
            Our promise
          </h2>
          <ul className="flex flex-col gap-2">
            {PROMISES.map((promise) => (
              <li key={promise} className="text-base text-stone-700 dark:text-stone-200">
                {promise}
              </li>
            ))}
          </ul>
        </section>

        {/* Waitlist */}
        <section className="flex flex-col gap-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Join the waitlist</h2>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
              Be first to know when sessions open up.
            </p>
          </div>
          <WaitlistForm />
        </section>
      </main>

      <Footer />
    </div>
  );
}
