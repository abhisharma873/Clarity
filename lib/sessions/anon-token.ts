import { cookies } from "next/headers";

export const ANON_TOKEN_COOKIE = "clarity_anon_token";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/** Read-only — safe to call from Server Components. */
export async function readAnonToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ANON_TOKEN_COOKIE)?.value ?? null;
}

/** Writes the cookie if missing — Server Actions / Route Handlers only. */
export async function getOrCreateAnonToken(): Promise<string> {
  const store = await cookies();
  const existing = store.get(ANON_TOKEN_COOKIE)?.value;
  if (existing) {
    return existing;
  }

  const token = crypto.randomUUID();
  store.set(ANON_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
  });
  return token;
}
