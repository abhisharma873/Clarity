import type { User } from "@supabase/supabase-js";
import { getUserClient } from "./server";

/**
 * Uses auth.getUser(), not auth.getSession() — getUser() revalidates the
 * JWT against the Supabase Auth server instead of trusting a potentially
 * stale local cookie. Returns null if no one is signed in, and — since
 * this is called from the root layout's Header on every page, including
 * ones that would otherwise be statically prerenderable — also returns
 * null rather than throwing if Supabase itself is unreachable or
 * unconfigured, so a transient auth problem can never take down the
 * whole app's rendering.
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await getUserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    console.error("Failed to resolve the current user:", err);
    return null;
  }
}
