import { redirect } from "next/navigation";
import { SessionShell } from "@/app/session/components/SessionShell";
import { getMessagesForSession } from "@/lib/messages/repository";
import { getOwnedSession } from "@/lib/sessions/get-session";
import { ConversationView } from "./ConversationView";

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

  const messages = await getMessagesForSession(session.id);

  return (
    <SessionShell lens={session.lens} currentStep="conversation" sessionId={session.id}>
      <ConversationView
        sessionId={session.id}
        initialMessages={messages.map((m) => ({ role: m.role, content: m.content }))}
      />
    </SessionShell>
  );
}
