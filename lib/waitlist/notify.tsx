import { WAITLIST_NOTIFICATION_SUBJECT, WaitlistNotificationEmail } from "@/lib/email/WaitlistNotificationEmail";
import { getFromAddress, getResendClient } from "@/lib/email/resend";

/**
 * Fails soft: a missing/misconfigured Resend setup, or the send itself
 * failing, should never break the waitlist signup the visitor is waiting on.
 */
export async function notifyWaitlistSignup(email: string, decisionType: string | null): Promise<void> {
  const to = process.env.ADMIN_EMAIL;
  if (!to) {
    return;
  }

  try {
    const resend = getResendClient();
    await resend.emails.send({
      from: getFromAddress(),
      to,
      subject: WAITLIST_NOTIFICATION_SUBJECT,
      react: <WaitlistNotificationEmail email={email} decisionType={decisionType} />,
    });
  } catch (err) {
    console.error("Failed to send waitlist notification email:", err);
  }
}
