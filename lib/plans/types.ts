import type { DecisionType } from "@/lib/decision-types";
import type { NumerologySystem } from "@/lib/numerology";

export type ClarityPlan = {
  decision: string;
  why_it_fits: string[];
  first_step: string;
  watch_out_for: string;
  reflection_line: string;
};

export type Feedback = "yes" | "somewhat" | "no";

export type PlanRow = {
  id: string;
  session_id: string;
  user_id: string | null;
  plan: ClarityPlan;
  feedback: Feedback | null;
  check_in_date: string;
  created_at: string;
};

/** The minimal, intentionally-public data the share card needs. */
export type CardData = {
  planId: string;
  lens: "reflection" | "numerology";
  numerologySystem: NumerologySystem | null;
  lifePathValue: number | null;
  decisionType: DecisionType | null;
  decisionText: string | null;
  reflectionLine: string;
};
