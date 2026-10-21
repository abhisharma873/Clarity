import Anthropic from "@anthropic-ai/sdk";

export function getAnthropicClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("Missing ANTHROPIC_API_KEY.");
  }
  return new Anthropic();
}

export function getClaudeModel(): string {
  const model = process.env.CLAUDE_MODEL;
  if (!model) {
    throw new Error("Missing CLAUDE_MODEL.");
  }
  return model;
}
