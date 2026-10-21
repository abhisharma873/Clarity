import { getServiceRoleClient } from "@/lib/supabase/server";

export const CAPACITY_MESSAGE =
  "We're at capacity today — join the waitlist and we'll let you know when more sessions open up.";

export function startOfTodayUtcIso(now: Date = new Date()): string {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
}

/**
 * Pure threshold check, separated from the DB fetch below so it's testable
 * without mocking Supabase — same "only unit-test pure logic" convention as
 * every other lib/*\/validate.ts in this repo. An unset/invalid limit means
 * no cap, consistent with how every other optional env var here degrades.
 */
export function isOverDailyLimit(count: number, limitEnvValue: string | undefined): boolean {
  const limit = Number(limitEnvValue);
  if (!limitEnvValue || !Number.isFinite(limit) || limit <= 0) {
    return false;
  }
  return count >= limit;
}

export async function hasReachedDailyAiCallLimit(): Promise<boolean> {
  const limitEnvValue = process.env.DAILY_AI_CALL_LIMIT;
  if (!limitEnvValue) {
    return false;
  }

  const supabase = getServiceRoleClient();
  const { count, error } = await supabase
    .from("usage")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startOfTodayUtcIso());

  if (error) {
    console.error("Failed to check the daily AI call limit:", error);
    return false;
  }

  return isOverDailyLimit(count ?? 0, limitEnvValue);
}
