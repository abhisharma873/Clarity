import { describe, expect, it } from "vitest";
import { isValidDecisionText, isValidLens } from "./validate";

describe("isValidDecisionText", () => {
  it("accepts a normal one-line description", () => {
    expect(isValidDecisionText("Should I take the new job offer?")).toBe(true);
  });

  it("accepts text right at the 200-char limit", () => {
    expect(isValidDecisionText("a".repeat(200))).toBe(true);
  });

  it("rejects text over the 200-char limit", () => {
    expect(isValidDecisionText("a".repeat(201))).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(isValidDecisionText("")).toBe(false);
  });

  it("rejects a whitespace-only string", () => {
    expect(isValidDecisionText("    ")).toBe(false);
  });

  it("trims before checking the length boundary", () => {
    expect(isValidDecisionText(`  ${"a".repeat(200)}  `)).toBe(true);
  });
});

describe("isValidLens", () => {
  it("accepts the two valid lenses", () => {
    expect(isValidLens("reflection")).toBe(true);
    expect(isValidLens("numerology")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isValidLens("")).toBe(false);
    expect(isValidLens("astrology")).toBe(false);
    expect(isValidLens("Reflection")).toBe(false);
  });
});
