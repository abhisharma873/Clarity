export const MAX_MESSAGE_LENGTH = 1000;
export const MAX_USER_MESSAGES = 10;

export function isValidMessageText(text: string): boolean {
  const trimmed = text.trim();
  return trimmed.length > 0 && trimmed.length <= MAX_MESSAGE_LENGTH;
}

export function hasReachedMessageLimit(userMessageCount: number): boolean {
  return userMessageCount >= MAX_USER_MESSAGES;
}
