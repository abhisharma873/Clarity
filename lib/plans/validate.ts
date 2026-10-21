import type { Feedback } from "./types";

const VALID_FEEDBACK: readonly Feedback[] = ["yes", "somewhat", "no"];

export function isValidFeedback(value: string): value is Feedback {
  return (VALID_FEEDBACK as readonly string[]).includes(value);
}
