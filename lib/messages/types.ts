export type MessageRole = "user" | "assistant";

export type MessageRow = {
  id: string;
  session_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
};
