"use server";

import { getPlanById, updatePlanFeedback } from "@/lib/plans/repository";
import { isValidFeedback } from "@/lib/plans/validate";
import { getOwnedSession } from "@/lib/sessions/get-session";

export async function submitFeedback(planId: string, feedback: string): Promise<{ ok: boolean }> {
  if (!isValidFeedback(feedback)) {
    return { ok: false };
  }

  const plan = await getPlanById(planId);
  if (!plan) {
    return { ok: false };
  }

  const session = await getOwnedSession(plan.session_id);
  if (!session) {
    return { ok: false };
  }

  try {
    await updatePlanFeedback(planId, feedback);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
