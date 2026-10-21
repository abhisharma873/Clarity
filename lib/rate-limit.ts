type RateLimiterOptions = {
  windowMs: number;
  max: number;
};

// In-memory only: resets on cold start and isn't shared across serverless
// instances. Good enough as a basic deterrent at this scale; swap for a
// shared store (e.g. Upstash Redis) if abuse becomes a real problem.
export function createRateLimiter({ windowMs, max }: RateLimiterOptions) {
  const hits = new Map<string, { count: number; windowStart: number }>();

  function isRateLimited(key: string, now: number = Date.now()): boolean {
    const entry = hits.get(key);

    if (!entry || now - entry.windowStart >= windowMs) {
      hits.set(key, { count: 1, windowStart: now });
      return false;
    }

    if (entry.count >= max) {
      return true;
    }

    entry.count += 1;
    return false;
  }

  return { isRateLimited };
}
