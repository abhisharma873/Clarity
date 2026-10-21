import { describe, expect, it } from "vitest";
import { MAX_CHECK_IN_NOTE_LENGTH, validateCheckInNote } from "./validate";

describe("validateCheckInNote", () => {
  it("accepts an empty note", () => {
    expect(validateCheckInNote("")).toEqual({ valid: true, trimmed: "" });
  });

  it("trims whitespace", () => {
    expect(validateCheckInNote("  I did it!  ")).toEqual({ valid: true, trimmed: "I did it!" });
  });

  it("accepts a note right at the max length", () => {
    const note = "a".repeat(MAX_CHECK_IN_NOTE_LENGTH);
    expect(validateCheckInNote(note)).toEqual({ valid: true, trimmed: note });
  });

  it("rejects a note over the max length", () => {
    const note = "a".repeat(MAX_CHECK_IN_NOTE_LENGTH + 1);
    expect(validateCheckInNote(note).valid).toBe(false);
  });
});
