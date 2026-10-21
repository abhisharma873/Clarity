"use server";

import { headers } from "next/headers";
import { captureServerEvent } from "@/lib/analytics/server";
import { getServerDistinctId } from "@/lib/analytics/distinct-id";
import { getServiceRoleClient } from "@/lib/supabase/server";
import { isValidDecisionType, validateEmail } from "@/lib/waitlist/validate";
import { isRateLimited } from "@/lib/waitlist/rate-limit";
import type { WaitlistActionState } from "@/lib/waitlist/action-state";

const SUCCESS_MESSAGE =
  "You're on the list. We'll email you when your first free session is ready.";

const ALREADY_JOINED_MESSAGE =
  "You're already on the list. We'll email you when your first free session is ready.";

export async function joinWaitlist(
  _prevState: WaitlistActionState,
  formData: FormData,
): Promise<WaitlistActionState> {
  const honeypot = String(formData.get("company") ?? "").trim();
  if (honeypot !== "") {
    // A real user never fills this hidden field. Pretend it worked so we
    // don't tip off whatever filled it in.
    return { status: "success", message: SUCCESS_MESSAGE };
  }

  const email = String(formData.get("email") ?? "").trim();
  const decisionType = String(formData.get("decisionType") ?? "").trim();

  if (!validateEmail(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  if (decisionType && !isValidDecisionType(decisionType)) {
    return { status: "error", message: "Please choose a valid option." };
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return {
      status: "error",
      message: "Too many attempts. Please try again in a few minutes.",
    };
  }

  const GENERIC_ERROR_STATE: WaitlistActionState = {
    status: "error",
    message: "Something went wrong on our end. Please try again shortly.",
  };

  try {
    const supabase = getServiceRoleClient();
    const { error } = await supabase.from("waitlist").insert({
      email,
      decision_type: decisionType || null,
    });

    if (error) {
      if (error.code === "23505") {
        return { status: "success", message: ALREADY_JOINED_MESSAGE };
      }

      console.error("Failed to insert waitlist row:", error);
      return GENERIC_ERROR_STATE;
    }

    await captureServerEvent("waitlist_joined", await getServerDistinctId());
    return { status: "success", message: SUCCESS_MESSAGE };
  } catch (err) {
    console.error("Unexpected error joining waitlist:", err);
    return GENERIC_ERROR_STATE;
  }
}
