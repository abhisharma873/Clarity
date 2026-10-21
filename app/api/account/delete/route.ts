import { getServiceRoleClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/user";

function jsonError(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}

const GENERIC_ERROR_MESSAGE = "Something went wrong on our end. Please try again.";

export async function POST(): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) {
    return jsonError("Not signed in.", 401);
  }

  try {
    const supabase = getServiceRoleClient();
    const userId = user.id;

    const { data: sessions } = await supabase.from("sessions").select("id").eq("user_id", userId);
    const sessionIds = (sessions ?? []).map((row) => row.id);

    if (sessionIds.length > 0) {
      await supabase.from("messages").delete().in("session_id", sessionIds);
      await supabase.from("usage").delete().in("session_id", sessionIds);
    }

    await supabase.from("plans").delete().eq("user_id", userId);
    await supabase.from("sessions").delete().eq("user_id", userId);
    await supabase.from("profiles").delete().eq("id", userId);

    const { error: deleteUserError } = await supabase.auth.admin.deleteUser(userId);
    if (deleteUserError) {
      console.error("Failed to delete auth user:", deleteUserError);
      return jsonError(GENERIC_ERROR_MESSAGE, 500);
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Failed to delete account:", err);
    return jsonError(GENERIC_ERROR_MESSAGE, 500);
  }
}
