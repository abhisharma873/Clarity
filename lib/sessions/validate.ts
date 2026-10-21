import type { SessionLens } from "./types";

export { isValidDecisionType } from "@/lib/decision-types";

export function isValidDecisionText(text: string): boolean {
  const trimmed = text.trim();
  return trimmed.length > 0 && trimmed.length <= 200;
}

export function isValidLens(value: string): value is SessionLens {
  return value === "reflection" || value === "numerology";
}
