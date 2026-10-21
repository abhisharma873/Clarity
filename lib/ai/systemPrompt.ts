import type { NumerologyChart } from "@/lib/numerology";
import type { DecisionType } from "@/lib/decision-types";
import type { SessionLens } from "@/lib/sessions/types";
import { READY_PHRASE } from "./readiness";

export type BuildSystemPromptParams = {
  lens: SessionLens;
  decisionType: DecisionType | null;
  decisionText: string | null;
  /** The currently-selected system's chart. Only used when lens === "numerology". */
  chart: NumerologyChart | null;
};

const QUESTION_BANK = `
=== QUESTION_BANK (placeholder) ===
No example questions have been added yet. Ask natural, relevant reflective
questions based on the user's stated decision above and, for numerology
users, the numbers above. Paste your own example questions into this
section to steer the style and phrasing Claude uses.
=== END QUESTION_BANK ===
`.trim();

export function buildSystemPrompt({
  lens,
  decisionType,
  decisionText,
  chart,
}: BuildSystemPromptParams): string {
  const sections: string[] = [];

  sections.push(
    "You are a calm, warm clarity guide, not a fortune teller.",
  );

  sections.push(
    "Your goal: help the user reach a clear decision on their stated question " +
      "in 5 to 7 questions, asked one at a time. Keep every reply short — " +
      "under 80 words.",
  );

  sections.push(
    `The user's decision (category: ${decisionType ?? "unspecified"}): "${decisionText ?? ""}"`,
  );

  if (lens === "numerology" && chart) {
    sections.push(
      `Numerology context (${chart.system} system):\n` +
        `- Life Path ${chart.lifePath.value}\n` +
        `- Birthday Number ${chart.birthdayNumber.value}\n` +
        `- Destiny ${chart.destiny.value}\n` +
        `- Soul Urge ${chart.soulUrge.value}\n` +
        `- Personality ${chart.personality.value}\n\n` +
        "Use these numbers only as a starting point for reflection, never as " +
        'prediction. For example: "Your life path 5 is often linked with ' +
        'change; how does change feel to you right now?" Never present a ' +
        "number as foretelling an outcome.",
    );
  } else {
    sections.push(
      "This user chose the Reflection lens: ask simple guided questions " +
        "with no numbers involved.",
    );
  }

  sections.push(
    "Hard rules:\n" +
      "- Never predict the future, never suggest remedies, gemstones, rituals, or purchases, never use fear.\n" +
      "- Never quote scripture or speak for any religion.\n" +
      "- Never give medical, legal, or financial advice.\n" +
      "- If the user mentions self-harm, crisis, or danger, stop the question " +
      "flow immediately, respond with care, and encourage them to contact " +
      "local emergency services or a crisis line. Do not continue with " +
      "reflective questions in that reply.\n" +
      "- When you judge that enough is clear to move forward, say so plainly " +
      `— include the exact phrase "${READY_PHRASE}" in your reply so the ` +
      "user knows their clarity plan is next.",
  );

  sections.push(QUESTION_BANK);

  return sections.join("\n\n");
}
