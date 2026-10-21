export type TranscriptMessage = {
  role: "user" | "assistant";
  content: string;
};

export function formatTranscript(messages: TranscriptMessage[]): string {
  return messages
    .map((message) => `${message.role === "user" ? "User" : "Claude"}: ${message.content}`)
    .join("\n\n");
}
