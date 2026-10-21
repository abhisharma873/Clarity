import { NextResponse } from "next/server";
import { captureServerEvent } from "@/lib/analytics/server";
import { getServerDistinctId } from "@/lib/analytics/distinct-id";
import { getPlanById } from "@/lib/plans/repository";
import { getOwnedSession } from "@/lib/sessions/get-session";
import { getServiceRoleClient } from "@/lib/supabase/server";

/** Idempotent first-touch: records when a card was first downloaded, for the admin funnel and the card_downloaded event. */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;

  const plan = await getPlanById(id);
  if (!plan) {
    return NextResponse.json({ error: "Plan not found." }, { status: 404 });
  }

  const session = await getOwnedSession(plan.session_id);
  if (!session) {
    return NextResponse.json({ error: "Plan not found." }, { status: 404 });
  }

  if (!plan.card_downloaded_at) {
    const supabase = getServiceRoleClient();
    await supabase.from("plans").update({ card_downloaded_at: new Date().toISOString() }).eq("id", id);
  }

  await captureServerEvent("card_downloaded", await getServerDistinctId());

  return NextResponse.json({ ok: true });
}
