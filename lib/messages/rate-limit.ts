import { createRateLimiter } from "@/lib/rate-limit";

const limiter = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 30 });

export function isMessageRateLimited(ip: string, now?: number): boolean {
  return limiter.isRateLimited(ip, now);
}
