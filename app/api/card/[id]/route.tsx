import { ImageResponse } from "next/og";
import { getCardData } from "@/lib/plans/repository";
import { buildCardElement } from "./render";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  const url = new URL(request.url);
  const includeDecision = url.searchParams.get("includeDecision") === "1";

  try {
    const card = await getCardData(id);
    if (!card) {
      return new Response("Not found.", { status: 404 });
    }

    return new ImageResponse(
      buildCardElement({
        lens: card.lens,
        lifePathValue: card.lifePathValue,
        reflectionLine: card.reflectionLine,
        decisionText: includeDecision ? card.decisionText : null,
        host: url.host,
      }),
      { width: 1080, height: 1920 },
    );
  } catch (err) {
    console.error("Failed to render share card:", err);
    return new Response("Something went wrong generating this card.", { status: 500 });
  }
}
