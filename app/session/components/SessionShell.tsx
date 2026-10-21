import type { ReactNode } from "react";
import { BackLink } from "./BackLink";
import { ProgressDots } from "./ProgressDots";
import { getPreviousStepHref, getStepIndex, getStepsForLens } from "@/lib/sessions/steps";
import type { SessionLens, SessionStep } from "@/lib/sessions/types";

export function SessionShell({
  lens,
  currentStep,
  sessionId,
  children,
}: {
  lens: SessionLens | null;
  currentStep: SessionStep;
  sessionId: string | null;
  children: ReactNode;
}) {
  const steps = getStepsForLens(lens);
  const currentIndex = getStepIndex(steps, currentStep);
  const backHref = getPreviousStepHref(steps, currentStep, sessionId ?? "");

  return (
    <div className="flex min-h-dvh flex-col font-sans">
      <header className="flex flex-col gap-4 px-6 pt-6">
        <BackLink href={backHref} />
        <ProgressDots total={steps.length} currentIndex={currentIndex} />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
