export type WaitlistActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const INITIAL_WAITLIST_STATE: WaitlistActionState = {
  status: "idle",
  message: "",
};
