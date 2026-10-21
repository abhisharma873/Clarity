import { redirect } from "next/navigation";
import { SessionShell } from "@/app/session/components/SessionShell";
import { getOwnedSession } from "@/lib/sessions/get-session";
import { DetailsForm } from "./DetailsForm";

export const instant = false;

export default async function DetailsPage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string }>;
}) {
  const { s } = await searchParams;
  const session = await getOwnedSession(s);
  if (!session || session.lens !== "numerology") {
    redirect(session ? `/session/lens?s=${session.id}` : "/session/start");
  }

  return (
    <SessionShell lens={session.lens} currentStep="details" sessionId={session.id}>
      <DetailsForm sessionId={session.id} />
    </SessionShell>
  );
}
