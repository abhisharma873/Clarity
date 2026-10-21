import { describe, expect, it } from "vitest";
import { hasReachedMessageLimit, isValidMessageText, MAX_MESSAGE_LENGTH } from "./validate";

describe("isValidMessageText", () => {
  it("accepts a normal message", () => {
    expect(isValidMessageText("Should I take the job?")).toBe(true);
  });

  it("rejects an empty string", () => {
    expect(isValidMessageText("")).toBe(false);
  });

  it("rejects a whitespace-only string", () => {
    expect(isValidMessageText("   ")).toBe(false);
  });

  it("accepts text exactly at the limit", () => {
    expect(isValidMessageText("a".repeat(MAX_MESSAGE_LENGTH))).toBe(true);
  });

  it("rejects text one character over the limit", () => {
    expect(isValidMessageText("a".repeat(MAX_MESSAGE_LENGTH + 1))).toBe(false);
  });

  it("trims before checking the length boundary", () => {
    expect(isValidMessageText(`  ${"a".repeat(MAX_MESSAGE_LENGTH)}  `)).toBe(true);
  });
});

describe("hasReachedMessageLimit", () => {
  it("is false below the limit", () => {
    expect(hasReachedMessageLimit(9)).toBe(false);
  });

  it("is true at the limit", () => {
    expect(hasReachedMessageLimit(10)).toBe(true);
  });

  it("is true above the limit", () => {
    expect(hasReachedMessageLimit(11)).toBe(true);
  });

  it("is false at zero", () => {
    expect(hasReachedMessageLimit(0)).toBe(false);
  });
});
