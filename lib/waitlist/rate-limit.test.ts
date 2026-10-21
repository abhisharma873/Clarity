import { describe, expect, it } from "vitest";
import { isRateLimited } from "./rate-limit";

describe("isRateLimited", () => {
  it("allows the first few requests within the limit", () => {
    const ip = "198.51.100.1";
    const now = 1_000_000;
    for (let i = 0; i < 5; i += 1) {
      expect(isRateLimited(ip, now)).toBe(false);
    }
  });

  it("blocks once a single IP exceeds the limit within the window", () => {
    const ip = "198.51.100.2";
    const now = 2_000_000;
    for (let i = 0; i < 5; i += 1) {
      isRateLimited(ip, now);
    }
    expect(isRateLimited(ip, now)).toBe(true);
  });

  it("tracks IPs independently", () => {
    const now = 3_000_000;
    for (let i = 0; i < 5; i += 1) {
      isRateLimited("198.51.100.3", now);
    }
    expect(isRateLimited("198.51.100.3", now)).toBe(true);
    expect(isRateLimited("198.51.100.4", now)).toBe(false);
  });

  it("resets after the window expires", () => {
    const ip = "198.51.100.5";
    const start = 4_000_000;
    for (let i = 0; i < 5; i += 1) {
      isRateLimited(ip, start);
    }
    expect(isRateLimited(ip, start)).toBe(true);

    const afterWindow = start + 10 * 60 * 1000 + 1;
    expect(isRateLimited(ip, afterWindow)).toBe(false);
  });
});
