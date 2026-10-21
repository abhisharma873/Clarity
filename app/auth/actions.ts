"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { validateEmail } from "@/lib/waitlist/validate";
import { getUserClient } from "@/lib/supabase/server";
import type { EmailSignInState } from "./form-state";

async function getCallbackUrl(next: string): Promise<string> {
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${protocol}://${host}/auth/callback?next=${encodeURIComponent(next)}`;
}

export async function signInWithGoogle(formData: FormData): Promise<void> {
  const next = String(formData.get("redirectTo") ?? "/account");
  const supabase = await getUserClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: await getCallbackUrl(next) },
  });

  if (error || !data.url) {
    console.error("Failed to start Google sign-in:", error);
    redirect(next);
  }

  redirect(data.url);
}

export async function signInWithEmail(
  _prevState: EmailSignInState,
  formData: FormData,
): Promise<EmailSignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const next = String(formData.get("redirectTo") ?? "/account");

  if (!validateEmail(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const supabase = await getUserClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: await getCallbackUrl(next) },
  });

  if (error) {
    console.error("Failed to send magic link:", error);
    return { status: "error", message: "Something went wrong on our end. Please try again." };
  }

  return { status: "sent", message: "Check your email for a sign-in link." };
}

export async function signOut(): Promise<void> {
  const supabase = await getUserClient();
  await supabase.auth.signOut();
  redirect("/");
}
