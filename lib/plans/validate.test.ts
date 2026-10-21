import { describe, expect, it } from "vitest";
import { isValidFeedback } from "./validate";

describe("isValidFeedback", () => {
  it("accepts the three valid values", () => {
    expect(isValidFeedback("yes")).toBe(true);
    expect(isValidFeedback("somewhat")).toBe(true);
    expect(isValidFeedback("no")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isValidFeedback("")).toBe(false);
    expect(isValidFeedback("Yes")).toBe(false);
    expect(isValidFeedback("maybe")).toBe(false);
  });
});
