/**
 * The usage table only stores token counts, not which model priced them —
 * this converts the currently configured CLAUDE_MODEL's published rate to
 * an estimate. If CLAUDE_MODEL changes or isn't in this table, the rates
 * below (Sonnet 5, non-intro) are used as a reasonable default; the admin
 * page discloses this is an estimate.
 */
export type ModelRate = { inputPer1M: number; outputPer1M: number };

export const MODEL_RATES: Record<string, ModelRate> = {
  "claude-fable-5": { inputPer1M: 10, outputPer1M: 50 },
  "claude-mythos-5": { inputPer1M: 10, outputPer1M: 50 },
  "claude-opus-4-8": { inputPer1M: 5, outputPer1M: 25 },
  "claude-opus-4-7": { inputPer1M: 5, outputPer1M: 25 },
  "claude-opus-4-6": { inputPer1M: 5, outputPer1M: 25 },
  "claude-sonnet-5": { inputPer1M: 3, outputPer1M: 15 },
  "claude-sonnet-4-6": { inputPer1M: 3, outputPer1M: 15 },
  "claude-haiku-4-5": { inputPer1M: 1, outputPer1M: 5 },
};

export const DEFAULT_RATE: ModelRate = MODEL_RATES["claude-sonnet-5"];

export function getModelRate(model: string | undefined): ModelRate {
  if (model && model in MODEL_RATES) {
    return MODEL_RATES[model];
  }
  return DEFAULT_RATE;
}

export function estimateCostUsd(
  inputTokens: number,
  outputTokens: number,
  model: string | undefined,
): number {
  const rate = getModelRate(model);
  return (inputTokens / 1_000_000) * rate.inputPer1M + (outputTokens / 1_000_000) * rate.outputPer1M;
}
