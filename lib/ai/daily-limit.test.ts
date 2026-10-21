import { describe, expect, it } from "vitest";
import { isOverDailyLimit, startOfTodayUtcIso } from "./daily-limit";

describe("isOverDailyLimit", () => {
  it("is not over the limit when unset", () => {
    expect(isOverDailyLimit(1_000_000, undefined)).toBe(false);
  });

  it("is not over the limit when the env value is empty", () => {
    expect(isOverDailyLimit(1_000_000, "")).toBe(false);
  });

  it("is not over the limit when the env value isn't a number", () => {
    expect(isOverDailyLimit(1_000_000, "not-a-number")).toBe(false);
  });

  it("is not over the limit when the env value is zero or negative", () => {
    expect(isOverDailyLimit(1_000_000, "0")).toBe(false);
    expect(isOverDailyLimit(1_000_000, "-5")).toBe(false);
  });

  it("is not over the limit when count is below it", () => {
    expect(isOverDailyLimit(9, "10")).toBe(false);
  });

  it("is over the limit once count reaches it", () => {
    expect(isOverDailyLimit(10, "10")).toBe(true);
  });

  it("is over the limit once count exceeds it", () => {
    expect(isOverDailyLimit(11, "10")).toBe(true);
  });
});

describe("startOfTodayUtcIso", () => {
  it("returns midnight UTC for the given date", () => {
    const result = startOfTodayUtcIso(new Date("2026-03-15T18:42:07.123Z"));
    expect(result).toBe("2026-03-15T00:00:00.000Z");
  });
});
