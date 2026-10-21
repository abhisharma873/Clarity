"use server";

import { redirect } from "next/navigation";
import { captureServerEvent } from "@/lib/analytics/server";
import { getServerDistinctId } from "@/lib/analytics/distinct-id";
import { getServiceRoleClient } from "@/lib/supabase/server";
import { getOrCreateAnonToken } from "@/lib/sessions/anon-token";
import { getOwnedSession } from "@/lib/sessions/get-session";
import { getStepHref } from "@/lib/sessions/steps";
import { isValidDecisionText, isValidDecisionType, isValidLens } from "@/lib/sessions/validate";
import type { SessionFormState } from "@/lib/sessions/form-state";
import type { SessionStatus } from "@/lib/sessions/types";
import { getChart, type NumerologySystem } from "@/lib/numerology";
import { getCurrentUser } from "@/lib/supabase/user";

const GENERIC_ERROR: SessionFormState = {
  status: "error",
  message: "Something went wrong on our end. Please try again shortly.",
};

export async function startSession(
  _prevState: SessionFormState,
  formData: FormData,
): Promise<SessionFormState> {
  const decisionType = String(formData.get("decisionType") ?? "").trim();
  const decisionText = String(formData.get("decisionText") ?? "").trim();

  if (!isValidDecisionType(decisionType)) {
    return { status: "error", message: "Please choose what decision you're facing." };
  }
  if (!isValidDecisionText(decisionText)) {
    return {
      status: "error",
      message: "Please describe your decision in 200 characters or less.",
    };
  }

  let sessionId: string;
  try {
    const token = await getOrCreateAnonToken();
    const user = await getCurrentUser();
    const supabase = getServiceRoleClient();
    const { data, error } = await supabase
      .from("sessions")
      .insert({
        decision_type: decisionType,
        decision_text: decisionText,
        status: "started",
        anon_token: token,
        user_id: user?.id ?? null,
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("Failed to create session:", error);
      return GENERIC_ERROR;
    }
    sessionId = data.id;
  } catch (err) {
    console.error("Unexpected error creating session:", err);
    return GENERIC_ERROR;
  }

  await captureServerEvent("session_started", await getServerDistinctId());
  redirect(getStepHref("lens", sessionId));
}

export async function chooseLens(formData: FormData): Promise<void> {
  const sessionId = String(formData.get("sessionId") ?? "");
  const lens = String(formData.get("lens") ?? "");

  if (!isValidLens(lens)) {
    throw new Error(`Invalid lens "${lens}".`);
  }

  const session = await getOwnedSession(sessionId);
  if (!session) {
    redirect("/session/start");
  }

  const status: SessionStatus = lens === "reflection" ? "in_conversation" : "lens_selected";
  const supabase = getServiceRoleClient();
  const { error } = await supabase.from("sessions").update({ lens, status }).eq("id", sessionId);

  if (error) {
    throw new Error("Failed to update session lens.");
  }

  await captureServerEvent("lens_chosen", await getServerDistinctId(), { lens });

  const nextStep = lens === "reflection" ? "conversation" : "details";
  redirect(getStepHref(nextStep, sessionId));
}

export async function submitDetails(
  _prevState: SessionFormState,
  formData: FormData,
): Promise<SessionFormState> {
  const sessionId = String(formData.get("sessionId") ?? "");
  const fullName = String(formData.get("fullName") ?? "");
  const dateOfBirth = String(formData.get("dateOfBirth") ?? "");

  const session = await getOwnedSession(sessionId);
  if (!session || session.lens !== "numerology") {
    redirect("/session/start");
  }

  let pythagorean;
  let chaldean;
  try {
    pythagorean = getChart(fullName, dateOfBirth, "pythagorean");
    chaldean = getChart(fullName, dateOfBirth, "chaldean");
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Please check your name and date of birth.";
    return { status: "error", message };
  }
  // fullName and dateOfBirth go out of scope here: only the computed
  // chart numbers below are ever written to the database.

  try {
    const supabase = getServiceRoleClient();
    const { error } = await supabase
      .from("sessions")
      .update({
        chart: { pythagorean, chaldean },
        numerology_system: "pythagorean",
        status: "chart_ready",
      })
      .eq("id", sessionId);

    if (error) {
      console.error("Failed to store chart:", error);
      return GENERIC_ERROR;
    }
  } catch (err) {
    console.error("Unexpected error storing chart:", err);
    return GENERIC_ERROR;
  }

  redirect(getStepHref("chart", sessionId));
}

export async function setNumerologySystem(
  sessionId: string,
  system: NumerologySystem,
): Promise<void> {
  const session = await getOwnedSession(sessionId);
  if (!session) {
    return;
  }

  const supabase = getServiceRoleClient();
  await supabase.from("sessions").update({ numerology_system: system }).eq("id", sessionId);
}

export async function startConversation(formData: FormData): Promise<void> {
  const sessionId = String(formData.get("sessionId") ?? "");
  const session = await getOwnedSession(sessionId);
  if (!session) {
    redirect("/session/start");
  }

  const supabase = getServiceRoleClient();
  const { error } = await supabase
    .from("sessions")
    .update({ status: "in_conversation" })
    .eq("id", sessionId);

  if (error) {
    throw new Error("Failed to start the conversation.");
  }

  redirect(getStepHref("conversation", sessionId));
}
