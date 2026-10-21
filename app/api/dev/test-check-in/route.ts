import { NextResponse, type NextRequest } from "next/server";
import { sendCheckInEmail } from "@/lib/check-ins/send";
import type { PlanRow } from "@/lib/plans/types";
import { getServiceRoleClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/user";

/** Dev-only: sends a real check-in email (real token, real buttons) for your own most recent plan. */
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const user = await getCurrentUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Sign in first, then reload this route." }, { status: 401 });
  }

  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json(
      { error: "You don't have any saved plans yet — create and save one first." },
      { status: 404 },
    );
  }

  try {
    await sendCheckInEmail(data as PlanRow, user.email, request.nextUrl.origin);
  } catch (err) {
    console.error("Failed to send test check-in email:", err);
    return NextResponse.json(
      { error: "Failed to send. Check RESEND_API_KEY and RESEND_FROM_EMAIL." },
      { status: 500 },
    );
  }

  return NextResponse.json({ sent: true, to: user.email, planId: data.id });
}
