export { DECISION_TYPES, isValidDecisionType } from "@/lib/decision-types";
export type { DecisionType } from "@/lib/decision-types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}
