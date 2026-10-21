import { getServiceRoleClient } from "@/lib/supabase/server";
import type { MessageRow } from "./types";

export async function getMessagesForSession(sessionId: string): Promise<MessageRow[]> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data as MessageRow[];
}

export async function insertTurn(
  sessionId: string,
  userText: string,
  assistantText: string,
): Promise<void> {
  const supabase = getServiceRoleClient();
  const { error } = await supabase.from("messages").insert([
    { session_id: sessionId, role: "user", content: userText },
    { session_id: sessionId, role: "assistant", content: assistantText },
  ]);

  if (error) {
    throw new Error("Failed to save the conversation turn.");
  }
}

export async function insertKickoffReply(sessionId: string, assistantText: string): Promise<void> {
  const supabase = getServiceRoleClient();
  const { error } = await supabase
    .from("messages")
    .insert({ session_id: sessionId, role: "assistant", content: assistantText });

  if (error) {
    throw new Error("Failed to save the opening message.");
  }
}

export async function insertUsage(
  sessionId: string,
  inputTokens: number,
  outputTokens: number,
): Promise<void> {
  const supabase = getServiceRoleClient();
  const { error } = await supabase.from("usage").insert({
    session_id: sessionId,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
  });

  if (error) {
    // Non-fatal: the reply already succeeded and was shown to the user.
    console.error("Failed to log usage:", error);
  }
}
