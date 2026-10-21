export const MAX_CHECK_IN_NOTE_LENGTH = 500;

/** The note is optional — an empty string is valid, it just means "no note". */
export function validateCheckInNote(note: string): { valid: boolean; trimmed: string } {
  const trimmed = note.trim();
  return { valid: trimmed.length <= MAX_CHECK_IN_NOTE_LENGTH, trimmed };
}
