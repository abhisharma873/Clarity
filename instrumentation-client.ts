import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

// Fails soft when unconfigured (e.g. local dev with no PostHog project) —
// posthog.capture() calls elsewhere just no-op instead of throwing.
if (key && host) {
  posthog.init(key, {
    api_host: host,
    person_profiles: "identified_only",
    respect_dnt: true,
    // We track a fixed, named event allow-list only — autocapture and
    // pageview tracking would record every click and route (including
    // token-bearing URLs like /check-in/[token]) well outside that list.
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
  });
}
