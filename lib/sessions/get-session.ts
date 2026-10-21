import { getServiceRoleClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/user";
import { readAnonToken } from "./anon-token";
import type { SessionRow } from "./types";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Loads a session only if the current visitor owns it — either as the
 * authenticated user it's claimed to (checked first, since the anon_token
 * cookie gets cleared on sign-in), or via a matching anon_token cookie.
 * Returns null for "doesn't exist" and "belongs to someone else"
 * identically — same don't-leak-existence posture as the rest of the app.
 */
export async function getOwnedSession(sessionId: string | null | undefined): Promise<SessionRow | null> {
  if (!sessionId || !UUID_PATTERN.test(sessionId)) {
    return null;
  }

  const supabase = getServiceRoleClient();

  const user = await getCurrentUser();
  if (user) {
    const { data } = await supabase
      .from("sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) {
      return data as SessionRow;
    }
  }

  const token = await readAnonToken();
  if (token) {
    const { data } = await supabase
      .from("sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("anon_token", token)
      .maybeSingle();
    if (data) {
      return data as SessionRow;
    }
  }

  return null;
}
