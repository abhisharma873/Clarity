import { headers } from "next/headers";
import { PostHog } from "posthog-node";

/**
 * Separate from captureServerEvent so callers inside a ReadableStream (e.g.
 * the streaming message route) can resolve DNT before the stream starts —
 * cookies()/headers() need the request's AsyncLocalStorage context, which a
 * stream's start() callback, invoked by the Streams API's own machinery, is
 * not guaranteed to preserve.
 */
export async function isDoNotTrack(): Promise<boolean> {
  const headerList = await headers();
  return headerList.get("dnt") === "1" || headerList.get("sec-gpc") === "1";
}

/**
 * A fresh client per call, not a flushed-on-a-timer singleton: serverless
 * functions don't get background time after the response, so flushAt: 1
 * sends immediately instead of relying on a later flush that may never run.
 */
function getClient(): PostHog | null {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  if (!key || !host) {
    return null;
  }
  return new PostHog(key, { host, flushAt: 1, flushInterval: 0 });
}

/**
 * Low-level send — does not call cookies()/headers(), so it's safe from
 * contexts (like inside a ReadableStream) where request-scoped dynamic APIs
 * may not be available. Callers must resolve DNT themselves via
 * isDoNotTrack() beforehand and skip calling this if it's true.
 */
export async function sendServerEvent(
  event: string,
  distinctId: string,
  properties?: Record<string, unknown>,
): Promise<void> {
  try {
    const client = getClient();
    if (!client) {
      return;
    }

    client.capture({ distinctId, event, properties });
    await client.shutdown();
  } catch (err) {
    console.error(`Failed to capture analytics event "${event}":`, err);
  }
}

/** Convenience wrapper for ordinary (non-streaming) Server Actions and Route Handlers. */
export async function captureServerEvent(
  event: string,
  distinctId: string,
  properties?: Record<string, unknown>,
): Promise<void> {
  try {
    if (await isDoNotTrack()) {
      return;
    }
  } catch (err) {
    console.error(`Failed to check Do Not Track for "${event}":`, err);
    return;
  }

  await sendServerEvent(event, distinctId, properties);
}
