import { createRateLimiter } from "@/lib/rate-limit";

const limiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 });

export function isSignInRateLimited(ip: string, now?: number): boolean {
  return limiter.isRateLimited(ip, now);
}
