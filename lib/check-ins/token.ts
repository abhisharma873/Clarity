import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_TTL_MS = 90 * 24 * 60 * 60 * 1000;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getSecret(): string {
  const secret = process.env.CHECK_IN_TOKEN_SECRET;
  if (!secret) {
    throw new Error("Missing CHECK_IN_TOKEN_SECRET.");
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

/**
 * One token is issued per plan at send time and reused across all three
 * answer links in that email — not a separate token per answer. Stateless
 * (no DB column): the plan id and issue time are embedded and HMAC-signed,
 * so verifying only needs the secret, not a lookup.
 */
export function signCheckInToken(planId: string): string {
  const payload = `${planId}.${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

/**
 * Returns the plan id if the token is correctly signed and not expired, else
 * null. Called during page render (the check-in and unsubscribe routes), so
 * — like getCurrentUser() — it must never throw: a misconfigured secret
 * should degrade to "this link is invalid," not a 500.
 */
export function verifyCheckInToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }
  const [planId, issuedAtStr, signature] = parts;

  if (!UUID_PATTERN.test(planId)) {
    return null;
  }

  const issuedAt = Number(issuedAtStr);
  if (!Number.isFinite(issuedAt) || Date.now() - issuedAt > TOKEN_TTL_MS) {
    return null;
  }

  try {
    const expected = sign(`${planId}.${issuedAtStr}`);
    const expectedBuf = Buffer.from(expected, "hex");
    const actualBuf = Buffer.from(signature, "hex");
    if (expectedBuf.length !== actualBuf.length || !timingSafeEqual(expectedBuf, actualBuf)) {
      return null;
    }
  } catch (err) {
    console.error("Failed to verify check-in token:", err);
    return null;
  }

  return planId;
}
