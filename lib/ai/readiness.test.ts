import { describe, expect, it } from "vitest";
import { isReadyForPlan, READY_PHRASE } from "./readiness";

describe("isReadyForPlan", () => {
  it("matches when the phrase is the whole reply", () => {
    expect(isReadyForPlan(READY_PHRASE)).toBe(true);
  });

  it("matches when the phrase is embedded mid-sentence", () => {
    expect(
      isReadyForPlan(`Thank you for sharing all that. ${READY_PHRASE} Give me a moment.`),
    ).toBe(true);
  });

  it("does not match on a near-miss phrase", () => {
    expect(isReadyForPlan("I think I'm ready to write something.")).toBe(false);
  });

  it("does not match on an empty string", () => {
    expect(isReadyForPlan("")).toBe(false);
  });

  it("does not match a normal reflective question", () => {
    expect(isReadyForPlan("What does that change feel like for you?")).toBe(false);
  });
});
