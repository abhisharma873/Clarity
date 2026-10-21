import { Resend } from "resend";

export function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY.");
  }
  return new Resend(apiKey);
}

/**
 * Must be a sender address on a domain verified in the Resend dashboard —
 * not something this codebase can know on its own, so it's configured via
 * env var rather than hardcoded.
 */
export function getCheckInFromAddress(): string {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) {
    throw new Error("Missing RESEND_FROM_EMAIL.");
  }
  return from;
}
