import { describe, expect, it } from "vitest";
import { estimateCostUsd, getModelRate } from "./pricing";

describe("estimateCostUsd", () => {
  it("computes cost for a known model", () => {
    // claude-sonnet-5: $3/1M input, $15/1M output
    const cost = estimateCostUsd(1_000_000, 1_000_000, "claude-sonnet-5");
    expect(cost).toBeCloseTo(18, 5);
  });

  it("computes cost for partial-million token counts", () => {
    // claude-haiku-4-5: $1/1M input, $5/1M output
    const cost = estimateCostUsd(500_000, 100_000, "claude-haiku-4-5");
    expect(cost).toBeCloseTo(0.5 + 0.5, 5);
  });

  it("falls back to the default rate for an unknown model", () => {
    const known = estimateCostUsd(1_000_000, 1_000_000, "claude-sonnet-5");
    const unknown = estimateCostUsd(1_000_000, 1_000_000, "some-future-model");
    expect(unknown).toBeCloseTo(known, 5);
  });

  it("falls back to the default rate when model is undefined", () => {
    const known = estimateCostUsd(1_000_000, 1_000_000, "claude-sonnet-5");
    const unset = estimateCostUsd(1_000_000, 1_000_000, undefined);
    expect(unset).toBeCloseTo(known, 5);
  });

  it("returns zero cost for zero tokens", () => {
    expect(estimateCostUsd(0, 0, "claude-opus-4-8")).toBe(0);
  });
});

describe("getModelRate", () => {
  it("returns the known rate for an exact model id", () => {
    expect(getModelRate("claude-opus-4-8")).toEqual({ inputPer1M: 5, outputPer1M: 25 });
  });

  it("returns the default rate for an unrecognized model id", () => {
    expect(getModelRate("gpt-5")).toEqual(getModelRate("claude-sonnet-5"));
  });
});
