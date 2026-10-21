import { describe, expect, it } from "vitest";
import { getPreviousStepHref, getStepHref, getStepIndex, getStepsForLens } from "./steps";

describe("getStepsForLens", () => {
  it("returns the full 5-step track for numerology", () => {
    expect(getStepsForLens("numerology")).toEqual([
      "start",
      "lens",
      "details",
      "chart",
      "conversation",
    ]);
  });

  it("returns the shortened 3-step track for reflection", () => {
    expect(getStepsForLens("reflection")).toEqual(["start", "lens", "conversation"]);
  });

  it("defaults to the full track when lens is not yet chosen", () => {
    expect(getStepsForLens(null)).toEqual(["start", "lens", "details", "chart", "conversation"]);
  });
});

describe("getStepIndex", () => {
  it("finds the index of a step within a track", () => {
    const steps = getStepsForLens("numerology");
    expect(getStepIndex(steps, "chart")).toBe(3);
  });

  it("throws for a step not in the track", () => {
    const steps = getStepsForLens("reflection");
    expect(() => getStepIndex(steps, "chart")).toThrow();
  });
});

describe("getStepHref", () => {
  it("links start to the no-param route", () => {
    expect(getStepHref("start", "abc-123")).toBe("/session/start");
  });

  it("links other steps with the session id as a query param", () => {
    expect(getStepHref("lens", "abc-123")).toBe("/session/lens?s=abc-123");
    expect(getStepHref("conversation", "abc-123")).toBe("/session/conversation?s=abc-123");
  });
});

describe("getPreviousStepHref", () => {
  it("sends the first step back to the marketing home page", () => {
    const steps = getStepsForLens("numerology");
    expect(getPreviousStepHref(steps, "start", "abc-123")).toBe("/");
  });

  it("sends later steps back to the prior step in the track", () => {
    const steps = getStepsForLens("numerology");
    expect(getPreviousStepHref(steps, "chart", "abc-123")).toBe("/session/details?s=abc-123");
  });

  it("respects the shortened reflection track", () => {
    const steps = getStepsForLens("reflection");
    expect(getPreviousStepHref(steps, "conversation", "abc-123")).toBe(
      "/session/lens?s=abc-123",
    );
  });
});
