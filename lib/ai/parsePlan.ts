import type { ClarityPlan } from "@/lib/plans/types";

const FENCE_PATTERN = /^```(?:json)?\s*\n?([\s\S]*?)\n?```$/i;

export function stripCodeFences(text: string): string {
  const trimmed = text.trim();
  const match = trimmed.match(FENCE_PATTERN);
  return match ? match[1].trim() : trimmed;
}

function isClarityPlanShape(value: unknown): value is ClarityPlan {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const v = value as Record<string, unknown>;
  return (
    typeof v.decision === "string" &&
    Array.isArray(v.why_it_fits) &&
    v.why_it_fits.every((item) => typeof item === "string") &&
    typeof v.first_step === "string" &&
    typeof v.watch_out_for === "string" &&
    typeof v.reflection_line === "string"
  );
}

export function parsePlanJson(text: string): ClarityPlan | null {
  const stripped = stripCodeFences(text);

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripped);
  } catch {
    return null;
  }

  return isClarityPlanShape(parsed) ? parsed : null;
}
