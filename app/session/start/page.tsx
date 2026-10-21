import { SessionShell } from "@/app/session/components/SessionShell";
import { StartForm } from "./StartForm";

export default function StartPage() {
  return (
    <SessionShell lens={null} currentStep="start" sessionId={null}>
      <StartForm />
    </SessionShell>
  );
}
