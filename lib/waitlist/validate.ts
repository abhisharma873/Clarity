export const DECISION_TYPES = [
  "Career",
  "Job offer",
  "Moving abroad",
  "Studies",
  "Relationship",
  "Other",
] as const;

export type DecisionType = (typeof DECISION_TYPES)[number];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export function isValidDecisionType(value: string): value is DecisionType {
  return (DECISION_TYPES as readonly string[]).includes(value);
}
