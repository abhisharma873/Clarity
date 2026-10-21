import { notFound } from "next/navigation";
import { SignInCard } from "@/app/components/SignInCard";
import { getPlanById } from "@/lib/plans/repository";
import { getOwnedSession } from "@/lib/sessions/get-session";
import { FeedbackForm } from "./FeedbackForm";
import { PlanActions } from "./PlanActions";

export const instant = false;

const CHART_LABELS = [
  { key: "lifePath" as const, label: "Life Path" },
  { key: "birthdayNumber" as const, label: "Birthday Number" },
  { key: "destiny" as const, label: "Destiny" },
  { key: "soulUrge" as const, label: "Soul Urge" },
  { key: "personality" as const, label: "Personality" },
];

export default async function PlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const planRow = await getPlanById(id);
  if (!planRow) {
    notFound();
  }

  const session = await getOwnedSession(planRow.session_id);
  if (!session) {
    notFound();
  }

  const plan = planRow.plan;
  const chart =
    session.lens === "numerology" && session.chart
      ? session.chart[session.numerology_system ?? "pythagorean"]
      : null;

  const checkInDate = new Date(planRow.check_in_date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex min-h-dvh flex-col items-center px-6 py-12 font-sans print:bg-white print:text-black">
      <div className="flex w-full max-w-xl flex-col gap-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400 print:text-black">
            Your clarity plan
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-stone-900 dark:text-stone-50 print:text-black">
            {plan.decision}
          </h1>
        </div>

        <section className="rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 print:border-stone-300">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400 print:text-black">
            Why this fits
          </h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-stone-700 dark:text-stone-200 print:text-black">
            {plan.why_it_fits.map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-amber-600">&bull;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl bg-amber-50 p-6 dark:bg-amber-950/20 print:border print:border-stone-300 print:bg-white">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400 print:text-black">
            First step (within 7 days)
          </h2>
          <p className="mt-2 text-base text-stone-800 dark:text-stone-100 print:text-black">
            {plan.first_step}
          </p>
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 print:border-stone-300">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400 print:text-black">
            Watch out for
          </h2>
          <p className="mt-2 text-sm text-stone-700 dark:text-stone-200 print:text-black">
            {plan.watch_out_for}
          </p>
        </section>

        <p className="text-center text-base italic text-stone-600 dark:text-stone-300 print:text-black">
          {plan.reflection_line}
        </p>

        {chart && (
          <section className="flex flex-col gap-3">
            <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400 print:text-black">
              Your numbers ({session.numerology_system})
            </h2>
            {CHART_LABELS.map(({ key, label }) => {
              const entry = chart[key];
              return (
                <div
                  key={key}
                  className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900 print:border-stone-300"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400 print:text-black">
                      {label}
                    </span>
                    <span className="text-2xl font-semibold text-stone-900 dark:text-stone-50 print:text-black">
                      {entry.value}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 print:text-black">
                    {entry.meaning.strengths} {entry.meaning.growthAreas}
                  </p>
                </div>
              );
            })}
          </section>
        )}

        <p className="text-center text-xs text-stone-400 print:text-black">
          We&apos;ll check in with you around {checkInDate}.
        </p>

        <PlanActions planId={planRow.id} reflectionLine={plan.reflection_line} />

        {!session.user_id && (
          <div className="print:hidden">
            <SignInCard redirectTo={`/plan/${planRow.id}`} />
          </div>
        )}

        <div className="print:hidden">
          <FeedbackForm planId={planRow.id} />
        </div>
      </div>
    </div>
  );
}
