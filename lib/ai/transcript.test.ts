import { describe, expect, it } from "vitest";
import { formatTranscript } from "./transcript";

describe("formatTranscript", () => {
  it("returns an empty string for no messages", () => {
    expect(formatTranscript([])).toBe("");
  });

  it("labels user and assistant turns and keeps order", () => {
    const result = formatTranscript([
      { role: "assistant", content: "What decision are you weighing?" },
      { role: "user", content: "Whether to take the job." },
      { role: "assistant", content: "What draws you to it?" },
    ]);

    expect(result).toBe(
      "Claude: What decision are you weighing?\n\n" +
        "User: Whether to take the job.\n\n" +
        "Claude: What draws you to it?",
    );
  });
});
