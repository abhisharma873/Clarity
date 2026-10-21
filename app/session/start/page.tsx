import { SessionShell } from "@/app/session/components/SessionShell";
import { StartForm } from "./StartForm";

// The root layout's Header reads the visitor's auth cookie on every page
// (Phase 6), so this can no longer be statically prerendered.
export const instant = false;

export default function StartPage() {
  return (
    <SessionShell lens={null} currentStep="start" sessionId={null}>
      <StartForm />
    </SessionShell>
  );
}
