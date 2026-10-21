import { beforeEach, describe, expect, it, vi } from "vitest";
import { signCheckInToken, verifyCheckInToken } from "./token";

const PLAN_ID = "11111111-2222-3333-4444-555555555555";

beforeEach(() => {
  process.env.CHECK_IN_TOKEN_SECRET = "test-secret";
});

describe("signCheckInToken / verifyCheckInToken", () => {
  it("round-trips a freshly signed token", () => {
    const token = signCheckInToken(PLAN_ID);
    expect(verifyCheckInToken(token)).toBe(PLAN_ID);
  });

  it("rejects a tampered plan id", () => {
    const token = signCheckInToken(PLAN_ID);
    const [, issuedAt, signature] = token.split(".");
    const tampered = `99999999-8888-7777-6666-555555555555.${issuedAt}.${signature}`;
    expect(verifyCheckInToken(tampered)).toBeNull();
  });

  it("rejects a tampered signature", () => {
    const token = signCheckInToken(PLAN_ID);
    const [planId, issuedAt] = token.split(".");
    expect(verifyCheckInToken(`${planId}.${issuedAt}.deadbeef`)).toBeNull();
  });

  it("rejects an expired token", () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const token = signCheckInToken(PLAN_ID);

    vi.setSystemTime(91 * 24 * 60 * 60 * 1000);
    expect(verifyCheckInToken(token)).toBeNull();
    vi.useRealTimers();
  });

  it("accepts a token right at issue time and well before expiry", () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const token = signCheckInToken(PLAN_ID);

    vi.setSystemTime(10 * 24 * 60 * 60 * 1000);
    expect(verifyCheckInToken(token)).toBe(PLAN_ID);
    vi.useRealTimers();
  });

  it("rejects malformed tokens", () => {
    expect(verifyCheckInToken("not-a-token")).toBeNull();
    expect(verifyCheckInToken("")).toBeNull();
    expect(verifyCheckInToken(`${PLAN_ID}.notanumber.abc`)).toBeNull();
  });

  it("rejects a token signed with a different secret", () => {
    const token = signCheckInToken(PLAN_ID);
    process.env.CHECK_IN_TOKEN_SECRET = "a-different-secret";
    expect(verifyCheckInToken(token)).toBeNull();
  });

  it("fails soft (returns null, does not throw) when the secret is unset", () => {
    const token = signCheckInToken(PLAN_ID);
    delete process.env.CHECK_IN_TOKEN_SECRET;
    expect(() => verifyCheckInToken(token)).not.toThrow();
    expect(verifyCheckInToken(token)).toBeNull();
  });
});
