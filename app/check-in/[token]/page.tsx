import { getCheckInByPlanId } from "@/lib/check-ins/repository";
import { verifyCheckInToken } from "@/lib/check-ins/token";
import { getPlanById } from "@/lib/plans/repository";
import { NoteForm } from "./NoteForm";

export const instant = false;

const ANSWER_LABELS = {
  yes: "Yes",
  partly: "Partly",
  no: "Not yet",
} as const;

export default async function CheckInPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const planId = verifyCheckInToken(token);
  const plan = planId ? await getPlanById(planId) : null;

  if (!planId || !plan) {
    return (
      <Shell>
        <p className="text-center text-stone-700 dark:text-stone-200">
          This link is invalid or has expired.
        </p>
      </Shell>
    );
  }

  const checkIn = await getCheckInByPlanId(planId);

  if (!checkIn) {
    return (
      <Shell>
        <p className="text-center text-lg font-semibold text-stone-900 dark:text-stone-50">
          Did you act on it?
        </p>
        <p className="text-center text-sm text-stone-600 dark:text-stone-300">
          &ldquo;{plan.plan.decision}&rdquo;
        </p>
        <div className="flex justify-center gap-2">
          {(Object.keys(ANSWER_LABELS) as Array<keyof typeof ANSWER_LABELS>).map((answer) => (
            <a
              key={answer}
              href={`/api/check-in/${token}?answer=${answer}`}
              className="rounded-full border border-stone-300 px-5 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-amber-500 hover:text-amber-700 dark:border-stone-700 dark:text-stone-200"
            >
              {ANSWER_LABELS[answer]}
            </a>
          ))}
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <p className="text-center text-lg font-semibold text-stone-900 dark:text-stone-50">
        Thanks for checking in.
      </p>
      <p className="text-center text-sm text-stone-600 dark:text-stone-300">
        You said: {ANSWER_LABELS[checkIn.answer]}
      </p>
      {checkIn.note ? (
        <p className="text-center text-sm text-stone-500 dark:text-stone-400">Noted: &ldquo;{checkIn.note}&rdquo;</p>
      ) : (
        <NoteForm checkInId={checkIn.id} />
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12 font-sans">
      <div className="flex w-full max-w-sm flex-col gap-5 rounded-3xl border border-stone-200 bg-white p-8 dark:border-stone-800 dark:bg-stone-900">
        {children}
      </div>
    </div>
  );
}
