import type { NumerologyChart } from "@/lib/numerology";
import type { DecisionType } from "@/lib/decision-types";
import type { SessionLens } from "@/lib/sessions/types";
import { formatChartForPrompt } from "./chartContext";

export type BuildPlanPromptParams = {
  lens: SessionLens;
  decisionType: DecisionType | null;
  decisionText: string | null;
  chart: NumerologyChart | null;
};

export function buildPlanSystemPrompt({
  lens,
  decisionType,
  decisionText,
  chart,
}: BuildPlanPromptParams): string {
  const sections: string[] = [];

  sections.push(
    "You are a calm, warm clarity guide writing a short written plan after a " +
      "reflective conversation. You are not a fortune teller.",
  );

  sections.push(
    `The user's decision (category: ${decisionType ?? "unspecified"}): "${decisionText ?? ""}"`,
  );

  if (lens === "numerology" && chart) {
    sections.push(
      `${formatChartForPrompt(chart)}\n\n` +
        "These numbers were used only as a starting point for reflection during " +
        "the conversation, never as prediction. Do not treat them as prediction here either.",
    );
  }

  sections.push(
    "Below is the full conversation. Base the plan entirely on what the user " +
      "actually said — especially why_it_fits, which must be drawn from their " +
      "own words, not generic advice.",
  );

  sections.push(
    "Hard rules:\n" +
      "- Never predict the future, never suggest remedies, gemstones, rituals, or purchases, never use fear.\n" +
      "- Never quote scripture or speak for any religion.\n" +
      "- Never give medical, legal, or financial advice.\n" +
      "- Keep every field honest and grounded — no vague positivity.",
  );

  sections.push(
    "Reply with ONLY a JSON object — no prose before or after it, no markdown " +
      "code fences — with exactly these fields:\n" +
      "{\n" +
      '  "decision": "one sentence naming the decision",\n' +
      '  "why_it_fits": ["short bullet 1", "short bullet 2", "short bullet 3"],\n' +
      '  "first_step": "one concrete action the user can take within 7 days",\n' +
      '  "watch_out_for": "one honest risk or blind spot",\n' +
      '  "reflection_line": "one short, encouraging line"\n' +
      "}",
  );

  return sections.join("\n\n");
}
