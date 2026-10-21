import { getServiceRoleClient } from "@/lib/supabase/server";
import type { PlanRow } from "@/lib/plans/types";
import type { CheckInAnswer, CheckInRow } from "./types";

export async function getCheckInByPlanId(planId: string): Promise<CheckInRow | null> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("check_ins")
    .select("*")
    .eq("plan_id", planId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as CheckInRow;
}

/** No-ops (returns the existing row) if this plan has already been answered — enforces single-use. */
export async function createCheckIn(planId: string, answer: CheckInAnswer): Promise<CheckInRow> {
  const existing = await getCheckInByPlanId(planId);
  if (existing) {
    return existing;
  }

  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("check_ins")
    .insert({ plan_id: planId, answer })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error("Failed to save the check-in answer.");
  }

  return data as CheckInRow;
}

export async function addCheckInNote(checkInId: string, note: string): Promise<void> {
  const supabase = getServiceRoleClient();
  const { error } = await supabase
    .from("check_ins")
    .update({ note: note.length > 0 ? note : null })
    .eq("id", checkInId);

  if (error) {
    throw new Error("Failed to save the note.");
  }
}

export async function markCheckInEmailSent(planId: string): Promise<void> {
  const supabase = getServiceRoleClient();
  const { error } = await supabase
    .from("plans")
    .update({ check_in_sent_at: new Date().toISOString() })
    .eq("id", planId);

  if (error) {
    throw new Error("Failed to mark the check-in email as sent.");
  }
}

/** Plans due for a check-in email: due date has passed, claimed by a user, not yet sent. */
export async function findDuePlans(): Promise<PlanRow[]> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .lte("check_in_date", new Date().toISOString())
    .not("user_id", "is", null)
    .is("check_in_sent_at", null);

  if (error || !data) {
    return [];
  }

  return data as PlanRow[];
}
