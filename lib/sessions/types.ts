import type { NumerologyChart, NumerologySystem } from "@/lib/numerology";
import type { DecisionType } from "@/lib/decision-types";

export type SessionLens = "reflection" | "numerology";

export type SessionStatus =
  | "started"
  | "lens_selected"
  | "chart_ready"
  | "in_conversation"
  | "completed";

export type StoredChart = {
  pythagorean: NumerologyChart;
  chaldean: NumerologyChart;
};

export type SessionRow = {
  id: string;
  decision_type: DecisionType | null;
  decision_text: string | null;
  lens: SessionLens | null;
  numerology_system: NumerologySystem | null;
  chart: StoredChart | null;
  status: SessionStatus;
  user_id: string | null;
  anon_token: string;
  created_at: string;
};

export type SessionStep = "start" | "lens" | "details" | "chart" | "conversation";
