import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";

describe("createRateLimiter", () => {
  it("allows requests up to the configured max", () => {
    const limiter = createRateLimiter({ windowMs: 1000, max: 3 });
    const now = 1_000_000;
    expect(limiter.isRateLimited("a", now)).toBe(false);
    expect(limiter.isRateLimited("a", now)).toBe(false);
    expect(limiter.isRateLimited("a", now)).toBe(false);
  });

  it("blocks once a key exceeds the configured max", () => {
    const limiter = createRateLimiter({ windowMs: 1000, max: 3 });
    const now = 2_000_000;
    limiter.isRateLimited("a", now);
    limiter.isRateLimited("a", now);
    limiter.isRateLimited("a", now);
    expect(limiter.isRateLimited("a", now)).toBe(true);
  });

  it("tracks keys independently", () => {
    const limiter = createRateLimiter({ windowMs: 1000, max: 1 });
    const now = 3_000_000;
    expect(limiter.isRateLimited("a", now)).toBe(false);
    expect(limiter.isRateLimited("a", now)).toBe(true);
    expect(limiter.isRateLimited("b", now)).toBe(false);
  });

  it("resets after the configured window expires", () => {
    const limiter = createRateLimiter({ windowMs: 1000, max: 1 });
    const start = 4_000_000;
    expect(limiter.isRateLimited("a", start)).toBe(false);
    expect(limiter.isRateLimited("a", start)).toBe(true);
    expect(limiter.isRateLimited("a", start + 1001)).toBe(false);
  });

  it("two independent limiters don't share state", () => {
    const limiterA = createRateLimiter({ windowMs: 1000, max: 1 });
    const limiterB = createRateLimiter({ windowMs: 1000, max: 1 });
    const now = 5_000_000;
    expect(limiterA.isRateLimited("same-key", now)).toBe(false);
    expect(limiterB.isRateLimited("same-key", now)).toBe(false);
  });
});
