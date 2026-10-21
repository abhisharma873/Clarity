import { redirect } from "next/navigation";
import { SessionShell } from "@/app/session/components/SessionShell";
import { getOwnedSession } from "@/lib/sessions/get-session";

export const instant = false;

export default async function ConversationPage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string }>;
}) {
  const { s } = await searchParams;
  const session = await getOwnedSession(s);
  if (!session) {
    redirect("/session/start");
  }
  if (!session.lens) {
    redirect(`/session/lens?s=${session.id}`);
  }
  if (session.lens === "numerology" && !session.chart) {
    redirect(`/session/details?s=${session.id}`);
  }

  return (
    <SessionShell lens={session.lens} currentStep="conversation" sessionId={session.id}>
      <div className="flex flex-col gap-6 text-center">
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">
          Your clarity session
        </h1>

        <div className="rounded-3xl border border-stone-200 bg-white p-6 text-left dark:border-stone-800 dark:bg-stone-900">
          <dl className="flex flex-col gap-3 text-sm">
            <div>
              <dt className="font-medium text-stone-500 dark:text-stone-400">Decision</dt>
              <dd className="mt-0.5 text-stone-900 dark:text-stone-100">
                {session.decision_type} — {session.decision_text}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-stone-500 dark:text-stone-400">Lens</dt>
              <dd className="mt-0.5 capitalize text-stone-900 dark:text-stone-100">
                {session.lens}
                {session.lens === "numerology" && session.numerology_system
                  ? ` (${session.numerology_system})`
                  : ""}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl bg-amber-50 p-6 text-sm text-amber-900 dark:bg-amber-950/20 dark:text-amber-200">
          The guided conversation lives here next — this placeholder will become a real
          back-and-forth with reflective questions and a written clarity plan.
        </div>
      </div>
    </SessionShell>
  );
}
