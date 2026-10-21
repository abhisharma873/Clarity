// Never persisted. Claude requires the first message in a request to be
// "user", but the AI should open the conversation on its own — the user
// already stated their decision at /session/start. This fixed turn is
// prepended to the Claude-bound message array on every call so history
// always starts with a valid user turn, without ever being stored or
// counted toward the 10-message cap.
export const KICKOFF_USER_TEXT = "I'm ready to begin.";
