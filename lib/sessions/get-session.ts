import { getServiceRoleClient } from "@/lib/supabase/server";
import { readAnonToken } from "./anon-token";
import type { SessionRow } from "./types";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Loads a session only if it exists and belongs to this browser's anon
 * token. Returns null for "doesn't exist" and "belongs to someone else"
 * identically — same don't-leak-existence posture as the rest of the app.
 */
export async function getOwnedSession(sessionId: string | null | undefined): Promise<SessionRow | null> {
  if (!sessionId || !UUID_PATTERN.test(sessionId)) {
    return null;
  }

  const token = await readAnonToken();
  if (!token) {
    return null;
  }

  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("anon_token", token)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as SessionRow;
}
