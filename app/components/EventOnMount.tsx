"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

/** Fires a named PostHog event once when this mounts — for page views from Server Component pages. */
export function EventOnMount({ event }: { event: string }) {
  useEffect(() => {
    posthog.capture(event);
  }, [event]);

  return null;
}
