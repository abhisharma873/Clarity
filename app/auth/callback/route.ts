import { NextResponse } from "next/server";
import { ANON_TOKEN_COOKIE, readAnonToken } from "@/lib/sessions/anon-token";
import { upsertProfile } from "@/lib/profiles/repository";
import { getServiceRoleClient, getUserClient } from "@/lib/supabase/server";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/account";
  const redirectTarget = new URL(next, url.origin);

  if (!code) {
    return NextResponse.redirect(redirectTarget);
  }

  try {
    const supabase = await getUserClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.user) {
      console.error("Failed to exchange auth code:", error);
      return NextResponse.redirect(redirectTarget);
    }

    const userId = data.user.id;
    const token = await readAnonToken();

    if (token) {
      const serviceClient = getServiceRoleClient();

      const { data: claimedSessions } = await serviceClient
        .from("sessions")
        .update({ user_id: userId })
        .eq("anon_token", token)
        .is("user_id", null)
        .select("id");

      const sessionIds = (claimedSessions ?? []).map((session) => session.id);
      if (sessionIds.length > 0) {
        await serviceClient
          .from("plans")
          .update({ user_id: userId })
          .in("session_id", sessionIds)
          .is("user_id", null);
      }
    }

    await upsertProfile(userId);

    const response = NextResponse.redirect(redirectTarget);
    response.cookies.delete(ANON_TOKEN_COOKIE);
    return response;
  } catch (err) {
    console.error("Unexpected error in auth callback:", err);
    return NextResponse.redirect(redirectTarget);
  }
}
