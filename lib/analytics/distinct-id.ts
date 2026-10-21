import { readAnonToken } from "@/lib/sessions/anon-token";
import { getCurrentUser } from "@/lib/supabase/user";

/** Signed-in user if there is one, else the anonymous session's token — same identity getOwnedSession keys off. */
export async function getServerDistinctId(): Promise<string> {
  const user = await getCurrentUser();
  if (user) {
    return `user:${user.id}`;
  }

  const token = await readAnonToken();
  if (token) {
    return `anon:${token}`;
  }

  return "anonymous";
}
