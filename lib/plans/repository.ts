import { getServiceRoleClient } from "@/lib/supabase/server";
import type { CardData, ClarityPlan, Feedback, PlanRow } from "./types";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Plain lookup, no ownership check. Callers decide whether to gate access. */
export async function getPlanById(planId: string | null | undefined): Promise<PlanRow | null> {
  if (!planId || !UUID_PATTERN.test(planId)) {
    return null;
  }

  const supabase = getServiceRoleClient();
  const { data, error } = await supabase.from("plans").select("*").eq("id", planId).maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as PlanRow;
}

/** Used to make plan generation idempotent — a session should only ever get one plan. */
export async function getPlanBySessionId(sessionId: string): Promise<PlanRow | null> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as PlanRow;
}

export async function createPlan(sessionId: string, plan: ClarityPlan): Promise<PlanRow> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("plans")
    .insert({ session_id: sessionId, plan })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error("Failed to save the clarity plan.");
  }

  return data as PlanRow;
}

export async function updatePlanFeedback(planId: string, feedback: Feedback): Promise<void> {
  const supabase = getServiceRoleClient();
  const { error } = await supabase.from("plans").update({ feedback }).eq("id", planId);

  if (error) {
    throw new Error("Failed to save feedback.");
  }
}

/**
 * Intentionally unauthenticated: the share card route serves this to
 * external platforms (Instagram, etc.) that never carry our cookies.
 * Only the fields the card actually renders are returned.
 */
export async function getCardData(planId: string): Promise<CardData | null> {
  const plan = await getPlanById(planId);
  if (!plan) {
    return null;
  }

  const supabase = getServiceRoleClient();
  const { data: session, error } = await supabase
    .from("sessions")
    .select("lens, numerology_system, chart, decision_type, decision_text")
    .eq("id", plan.session_id)
    .maybeSingle();

  if (error || !session || !session.lens) {
    return null;
  }

  const lifePathValue =
    session.lens === "numerology" && session.chart && session.numerology_system
      ? session.chart[session.numerology_system].lifePath.value
      : null;

  return {
    planId: plan.id,
    lens: session.lens,
    numerologySystem: session.numerology_system,
    lifePathValue,
    decisionType: session.decision_type,
    decisionText: session.decision_text,
    reflectionLine: plan.plan.reflection_line,
  };
}
