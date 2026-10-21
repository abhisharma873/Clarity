import { redirect } from "next/navigation";
import { chooseLens } from "@/app/session/actions";
import { SessionShell } from "@/app/session/components/SessionShell";
import { getOwnedSession } from "@/lib/sessions/get-session";

export const instant = false;

const LENS_OPTIONS = [
  {
    value: "reflection" as const,
    title: "Reflection",
    description: "Simple guided questions. No numbers.",
  },
  {
    value: "numerology" as const,
    title: "Numerology",
    description: "Start from your numbers, then reflect.",
  },
];

export default async function LensPage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string }>;
}) {
  const { s } = await searchParams;
  const session = await getOwnedSession(s);
  if (!session) {
    redirect("/session/start");
  }

  return (
    <SessionShell lens={session.lens} currentStep="lens" sessionId={session.id}>
      <div className="flex flex-col gap-6">
        <h1 className="text-center text-2xl font-semibold text-stone-900 dark:text-stone-50">
          Choose how you&apos;d like to start
        </h1>

        <div className="flex flex-col gap-4">
          {LENS_OPTIONS.map((option) => (
            <form key={option.value} action={chooseLens}>
              <input type="hidden" name="sessionId" value={session.id} />
              <input type="hidden" name="lens" value={option.value} />
              <button
                type="submit"
                className="w-full rounded-3xl border border-stone-300 bg-white p-6 text-left transition-colors hover:border-amber-400 hover:bg-amber-50 dark:border-stone-700 dark:bg-stone-900 dark:hover:bg-amber-950/20"
              >
                <span className="block text-lg font-semibold text-stone-900 dark:text-stone-50">
                  {option.title}
                </span>
                <span className="mt-1 block text-sm text-stone-600 dark:text-stone-400">
                  {option.description}
                </span>
              </button>
            </form>
          ))}
        </div>
      </div>
    </SessionShell>
  );
}
