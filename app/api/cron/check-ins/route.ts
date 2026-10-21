import { NextResponse, type NextRequest } from "next/server";
import { findDuePlans, markCheckInEmailSent } from "@/lib/check-ins/repository";
import { sendCheckInEmail } from "@/lib/check-ins/send";
import { getProfile } from "@/lib/profiles/repository";
import { getServiceRoleClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const baseUrl = request.nextUrl.origin;
  const duePlans = await findDuePlans();

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const plan of duePlans) {
    if (!plan.user_id) {
      skipped += 1;
      continue;
    }

    try {
      const profile = await getProfile(plan.user_id);
      if (!profile?.check_in_emails) {
        skipped += 1;
        continue;
      }

      const supabase = getServiceRoleClient();
      const { data, error } = await supabase.auth.admin.getUserById(plan.user_id);
      const email = data?.user?.email;
      if (error || !email) {
        console.error(`No email found for user ${plan.user_id}:`, error);
        failed += 1;
        continue;
      }

      await sendCheckInEmail(plan, email, baseUrl);
      await markCheckInEmailSent(plan.id);
      sent += 1;
    } catch (err) {
      console.error(`Failed to send check-in email for plan ${plan.id}:`, err);
      failed += 1;
    }
  }

  return NextResponse.json({ sent, skipped, failed });
}
