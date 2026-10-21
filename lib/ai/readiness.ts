export const READY_PHRASE = "I'm ready to write your plan.";

export function isReadyForPlan(text: string): boolean {
  return text.includes(READY_PHRASE);
}
