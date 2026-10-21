export type EmailSignInState = {
  status: "idle" | "sent" | "error";
  message: string;
};

export const INITIAL_EMAIL_SIGNIN_STATE: EmailSignInState = {
  status: "idle",
  message: "",
};
