import { NextResponse } from "next/server";
import { captureServerEvent } from "@/lib/analytics/server";
import { getServerDistinctId } from "@/lib/analytics/distinct-id";
import { getServiceRoleClient } from "@/lib/supabase/server";

/** Idempotent first-touch: records when a card was first downloaded, for the admin funnel and the card_downloaded event. */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;

  const supabase = getServiceRoleClient();
  const { data } = await supabase
    .from("plans")
    .select("card_downloaded_at")
    .eq("id", id)
    .maybeSingle();

  if (data && !data.card_downloaded_at) {
    await supabase.from("plans").update({ card_downloaded_at: new Date().toISOString() }).eq("id", id);
  }

  await captureServerEvent("card_downloaded", await getServerDistinctId());

  return NextResponse.json({ ok: true });
}
