import { NextResponse, type NextRequest } from "next/server";
import { createCheckIn } from "@/lib/check-ins/repository";
import type { CheckInAnswer } from "@/lib/check-ins/types";
import { verifyCheckInToken } from "@/lib/check-ins/token";

const VALID_ANSWERS: CheckInAnswer[] = ["yes", "partly", "no"];

export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const answer = request.nextUrl.searchParams.get("answer");
  const redirectUrl = new URL(`/check-in/${token}`, request.url);

  const planId = verifyCheckInToken(token);
  if (planId && answer && VALID_ANSWERS.includes(answer as CheckInAnswer)) {
    try {
      await createCheckIn(planId, answer as CheckInAnswer);
    } catch (err) {
      console.error("Failed to record check-in answer:", err);
    }
  }

  return NextResponse.redirect(redirectUrl);
}
