const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

// In-memory only: resets on cold start and isn't shared across serverless
// instances. Good enough as a basic deterrent for Phase 1; swap for a
// shared store (e.g. Upstash Redis) if abuse becomes a real problem.
const hits = new Map<string, { count: number; windowStart: number }>();

export function isRateLimited(ip: string, now: number = Date.now()): boolean {
  const entry = hits.get(ip);

  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    hits.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  entry.count += 1;
  return false;
}
