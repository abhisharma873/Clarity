import { getServiceRoleClient } from "@/lib/supabase/server";
import type { ProfileRow } from "./types";

export async function getProfile(userId: string): Promise<ProfileRow | null> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as ProfileRow;
}

/** Creates the profile row the first time a user is seen; no-op otherwise. */
export async function upsertProfile(userId: string): Promise<void> {
  const supabase = getServiceRoleClient();
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: userId }, { onConflict: "id", ignoreDuplicates: true });

  if (error) {
    console.error("Failed to upsert profile:", error);
  }
}

export async function updateCheckInEmails(userId: string, enabled: boolean): Promise<void> {
  const supabase = getServiceRoleClient();
  const { error } = await supabase
    .from("profiles")
    .update({ check_in_emails: enabled })
    .eq("id", userId);

  if (error) {
    throw new Error("Failed to update your email preference.");
  }
}
