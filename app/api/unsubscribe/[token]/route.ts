import { NextResponse, type NextRequest } from "next/server";
import { verifyCheckInToken } from "@/lib/check-ins/token";
import { getPlanById } from "@/lib/plans/repository";
import { updateCheckInEmails } from "@/lib/profiles/repository";

export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const planId = verifyCheckInToken(token);
  const plan = planId ? await getPlanById(planId) : null;

  if (plan?.user_id) {
    try {
      await updateCheckInEmails(plan.user_id, false);
    } catch (err) {
      console.error("Failed to unsubscribe from check-in emails:", err);
    }
  }

  return NextResponse.redirect(new URL("/unsubscribed", request.url));
}
