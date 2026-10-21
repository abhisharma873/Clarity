import type Anthropic from "@anthropic-ai/sdk";
import { getAnthropicClient, getClaudeModel } from "@/lib/ai/client";
import { KICKOFF_USER_TEXT } from "@/lib/ai/kickoff";
import { isReadyForPlan } from "@/lib/ai/readiness";
import { buildSystemPrompt } from "@/lib/ai/systemPrompt";
import {
  getMessagesForSession,
  insertKickoffReply,
  insertTurn,
  insertUsage,
} from "@/lib/messages/repository";
import { isMessageRateLimited } from "@/lib/messages/rate-limit";
import { hasReachedMessageLimit, isValidMessageText } from "@/lib/messages/validate";
import { getOwnedSession } from "@/lib/sessions/get-session";

const GENERIC_ERROR_MESSAGE = "Something went wrong on our end. Please try again.";

function jsonError(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}

type ClaudeTurn = { role: "user" | "assistant"; content: string };

type PreparedRequest = {
  sessionId: string;
  isKickoff: boolean;
  userText: string;
  userMessageCount: number;
  claudeHistory: ClaudeTurn[];
  systemPrompt: string;
};

type PrepareResult = { ok: true; data: PreparedRequest } | { ok: false; response: Response };

async function prepareRequest(request: Request, sessionId: string): Promise<PrepareResult> {
  const session = await getOwnedSession(sessionId);
  if (!session) {
    return { ok: false, response: jsonError("Session not found.", 404) };
  }
  if (!session.lens) {
    return { ok: false, response: jsonError("This session hasn't chosen a lens yet.", 400) };
  }
  if (session.lens === "numerology" && !session.chart) {
    return {
      ok: false,
      response: jsonError("Please finish the numerology details step first.", 400),
    };
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isMessageRateLimited(ip)) {
    return { ok: false, response: jsonError("Too many requests. Please try again in a while.", 429) };
  }

  let body: { message?: string };
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const priorMessages = await getMessagesForSession(session.id);
  const userMessageCount = priorMessages.filter((m) => m.role === "user").length;
  const isKickoff = priorMessages.length === 0 && !body.message;

  let userText = "";
  if (!isKickoff) {
    userText = (body.message ?? "").trim();
    if (!isValidMessageText(userText)) {
      return {
        ok: false,
        response: jsonError("Please enter a message of up to 1,000 characters.", 400),
      };
    }
    if (hasReachedMessageLimit(userMessageCount)) {
      return {
        ok: false,
        response: jsonError(
          "You've reached the message limit for this session. Use \"Write my plan\" to continue.",
          400,
        ),
      };
    }
  }

  const claudeHistory: ClaudeTurn[] = [
    { role: "user", content: KICKOFF_USER_TEXT },
    ...priorMessages.map((m) => ({ role: m.role, content: m.content })),
  ];
  if (!isKickoff) {
    claudeHistory.push({ role: "user", content: userText });
  }

  const selectedChart =
    session.lens === "numerology" && session.chart
      ? session.chart[session.numerology_system ?? "pythagorean"]
      : null;

  const systemPrompt = buildSystemPrompt({
    lens: session.lens,
    decisionType: session.decision_type,
    decisionText: session.decision_text,
    chart: selectedChart,
  });

  return {
    ok: true,
    data: {
      sessionId: session.id,
      isKickoff,
      userText,
      userMessageCount,
      claudeHistory,
      systemPrompt,
    },
  };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;

  let prepared: PrepareResult;
  try {
    prepared = await prepareRequest(request, id);
  } catch (err) {
    console.error("Failed to prepare message request:", err);
    return jsonError(GENERIC_ERROR_MESSAGE, 500);
  }

  if (!prepared.ok) {
    return prepared.response;
  }

  const { sessionId, isKickoff, userText, userMessageCount, claudeHistory, systemPrompt } =
    prepared.data;

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      function enqueue(event: Record<string, unknown>) {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      }

      try {
        const client = getAnthropicClient();
        const model = getClaudeModel();

        const stream = client.messages.stream({
          model,
          max_tokens: 400,
          system: systemPrompt,
          messages: claudeHistory,
        });

        stream.on("text", (text) => {
          enqueue({ type: "delta", text });
        });

        const finalMessage = await stream.finalMessage();
        const replyText = finalMessage.content
          .filter((block): block is Anthropic.TextBlock => block.type === "text")
          .map((block) => block.text)
          .join("");

        if (isKickoff) {
          await insertKickoffReply(sessionId, replyText);
        } else {
          await insertTurn(sessionId, userText, replyText);
        }
        await insertUsage(sessionId, finalMessage.usage.input_tokens, finalMessage.usage.output_tokens);

        const newUserMessageCount = isKickoff ? userMessageCount : userMessageCount + 1;
        enqueue({
          type: "done",
          userMessageCount: newUserMessageCount,
          readyForPlan: isReadyForPlan(replyText),
        });
      } catch (err) {
        console.error("Failed to generate assistant reply:", err);
        enqueue({ type: "error", message: GENERIC_ERROR_MESSAGE });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "application/x-ndjson" },
  });
}
