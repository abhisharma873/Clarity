export type SessionFormState = {
  status: "idle" | "error";
  message: string;
};

export const INITIAL_SESSION_FORM_STATE: SessionFormState = {
  status: "idle",
  message: "",
};
