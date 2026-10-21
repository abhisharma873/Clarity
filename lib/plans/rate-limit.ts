import { createRateLimiter } from "@/lib/rate-limit";

const limiter = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 10 });

export function isPlanGenerationRateLimited(ip: string, now?: number): boolean {
  return limiter.isRateLimited(ip, now);
}
