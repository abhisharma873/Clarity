"use server";

import { addCheckInNote as saveCheckInNote } from "@/lib/check-ins/repository";
import { validateCheckInNote } from "@/lib/check-ins/validate";
import type { CheckInNoteState } from "./form-state";

export async function addCheckInNote(
  _prevState: CheckInNoteState,
  formData: FormData,
): Promise<CheckInNoteState> {
  const checkInId = String(formData.get("checkInId") ?? "");
  const note = String(formData.get("note") ?? "");

  const { valid, trimmed } = validateCheckInNote(note);
  if (!checkInId || !valid) {
    return { status: "error", message: "That note is too long — please keep it to one line." };
  }

  try {
    await saveCheckInNote(checkInId, trimmed);
  } catch (err) {
    console.error("Failed to save check-in note:", err);
    return { status: "error", message: "Something went wrong on our end. Please try again." };
  }

  return { status: "saved", message: "Saved. Thanks for sharing." };
}
