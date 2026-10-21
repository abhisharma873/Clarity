import type Anthropic from "@anthropic-ai/sdk";
import { captureServerEvent } from "@/lib/analytics/server";
import { getServerDistinctId } from "@/lib/analytics/distinct-id";
import { getAnthropicClient, getClaudeModel } from "@/lib/ai/client";
import { CAPACITY_MESSAGE, hasReachedDailyAiCallLimit } from "@/lib/ai/daily-limit";
import { parsePlanJson } from "@/lib/ai/parsePlan";
import { buildPlanSystemPrompt } from "@/lib/ai/planPrompt";
import { formatTranscript } from "@/lib/ai/transcript";
import { getMessagesForSession, insertUsage } from "@/lib/messages/repository";
import { createPlan, getPlanBySessionId } from "@/lib/plans/repository";
import { isPlanGenerationRateLimited } from "@/lib/plans/rate-limit";
import { getOwnedSession } from "@/lib/sessions/get-session";
import { getServiceRoleClient } from "@/lib/supabase/server";

const GENERIC_ERROR_MESSAGE = "Something went wrong on our end. Please try again.";

function jsonError(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}

type ClaudeTurn = { role: "user" | "assistant"; content: string };

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;

  try {
    const session = await getOwnedSession(id);
    if (!session) {
      return jsonError("Session not found.", 404);
    }
    if (!session.lens) {
      return jsonError("This session hasn't chosen a lens yet.", 400);
    }

    // A session should only ever get one plan — short-circuits a direct
    // repeated POST (bypassing the UI's client-side disabled-button guard)
    // into returning the existing plan instead of paying for another.
    const existingPlan = await getPlanBySessionId(session.id);
    if (existingPlan) {
      return Response.json({ planId: existingPlan.id });
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isPlanGenerationRateLimited(ip)) {
      return jsonError("Too many requests. Please try again in a while.", 429);
    }

    if (await hasReachedDailyAiCallLimit()) {
      return jsonError(CAPACITY_MESSAGE, 503);
    }

    const messages = await getMessagesForSession(session.id);
    if (messages.length === 0) {
      return jsonError("Start the conversation before writing a plan.", 400);
    }

    const chart =
      session.lens === "numerology" && session.chart
        ? session.chart[session.numerology_system ?? "pythagorean"]
        : null;

    const systemPrompt = buildPlanSystemPrompt({
      lens: session.lens,
      decisionType: session.decision_type,
      decisionText: session.decision_text,
      chart,
    });

    const transcript = formatTranscript(messages);
    const client = getAnthropicClient();
    const model = getClaudeModel();

    const callClaude = async (turns: ClaudeTurn[]): Promise<string> => {
      const response = await client.messages.create({
        model,
        max_tokens: 1000,
        system: systemPrompt,
        messages: turns,
      });
      await insertUsage(session.id, response.usage.input_tokens, response.usage.output_tokens);
      return response.content
        .filter((block): block is Anthropic.TextBlock => block.type === "text")
        .map((block) => block.text)
        .join("");
    };

    const firstTurns: ClaudeTurn[] = [{ role: "user", content: transcript }];
    const firstReply = await callClaude(firstTurns);
    let plan = parsePlanJson(firstReply);

    if (!plan) {
      const retryTurns: ClaudeTurn[] = [
        ...firstTurns,
        { role: "assistant", content: firstReply },
        {
          role: "user",
          content:
            "That wasn't valid JSON. Reply with ONLY the JSON object — no prose, no code fences.",
        },
      ];
      const retryReply = await callClaude(retryTurns);
      plan = parsePlanJson(retryReply);
    }

    if (!plan) {
      console.error("Failed to parse plan JSON after one retry.");
      return jsonError(GENERIC_ERROR_MESSAGE, 500);
    }

    const planRow = await createPlan(session.id, plan);

    const supabase = getServiceRoleClient();
    await supabase.from("sessions").update({ status: "completed" }).eq("id", session.id);

    await captureServerEvent("plan_generated", await getServerDistinctId());

    return Response.json({ planId: planRow.id });
  } catch (err) {
    console.error("Failed to generate plan:", err);
    return jsonError(GENERIC_ERROR_MESSAGE, 500);
  }
}
