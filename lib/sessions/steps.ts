import type { SessionLens, SessionStep } from "./types";

const NUMEROLOGY_STEPS: SessionStep[] = ["start", "lens", "details", "chart", "conversation"];
const REFLECTION_STEPS: SessionStep[] = ["start", "lens", "conversation"];

/** Reflection sessions skip details/chart. Lens unknown (null) shows the full track. */
export function getStepsForLens(lens: SessionLens | null): SessionStep[] {
  return lens === "reflection" ? REFLECTION_STEPS : NUMEROLOGY_STEPS;
}

export function getStepIndex(steps: SessionStep[], current: SessionStep): number {
  const index = steps.indexOf(current);
  if (index === -1) {
    throw new Error(`Step "${current}" is not part of the given steps.`);
  }
  return index;
}

export function getStepHref(step: SessionStep, sessionId: string): string {
  if (step === "start") {
    return "/session/start";
  }
  return `/session/${step}?s=${sessionId}`;
}

/** The first step's "back" goes to the marketing home page. */
export function getPreviousStepHref(
  steps: SessionStep[],
  current: SessionStep,
  sessionId: string,
): string {
  const index = getStepIndex(steps, current);
  if (index === 0) {
    return "/";
  }
  return getStepHref(steps[index - 1], sessionId);
}
