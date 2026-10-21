import { redirect } from "next/navigation";
import { SessionShell } from "@/app/session/components/SessionShell";
import { getOwnedSession } from "@/lib/sessions/get-session";
import { ChartView } from "./ChartView";

export const instant = false;

export default async function ChartPage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string }>;
}) {
  const { s } = await searchParams;
  const session = await getOwnedSession(s);
  if (!session || session.lens !== "numerology") {
    redirect(session ? `/session/lens?s=${session.id}` : "/session/start");
  }
  if (!session.chart) {
    redirect(`/session/details?s=${session.id}`);
  }

  return (
    <SessionShell lens={session.lens} currentStep="chart" sessionId={session.id}>
      <ChartView
        sessionId={session.id}
        chart={session.chart}
        initialSystem={session.numerology_system ?? "pythagorean"}
      />
    </SessionShell>
  );
}
