export type CheckInNoteState = {
  status: "idle" | "saved" | "error";
  message: string;
};

export const INITIAL_CHECK_IN_NOTE_STATE: CheckInNoteState = {
  status: "idle",
  message: "",
};
