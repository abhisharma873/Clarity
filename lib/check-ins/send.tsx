import type { PlanRow } from "@/lib/plans/types";
import { CHECK_IN_EMAIL_SUBJECT, CheckInEmail } from "@/lib/email/CheckInEmail";
import { getFromAddress, getResendClient } from "@/lib/email/resend";
import { signCheckInToken } from "./token";

/** Builds a fresh signed token and sends the check-in email. Does not mark anything as sent — callers decide that. */
export async function sendCheckInEmail(plan: PlanRow, toEmail: string, baseUrl: string): Promise<void> {
  const token = signCheckInToken(plan.id);
  const answerBaseUrl = `${baseUrl}/api/check-in/${token}`;

  const resend = getResendClient();
  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: toEmail,
    subject: CHECK_IN_EMAIL_SUBJECT,
    react: (
      <CheckInEmail
        decision={plan.plan.decision}
        firstStep={plan.plan.first_step}
        yesUrl={`${answerBaseUrl}?answer=yes`}
        partlyUrl={`${answerBaseUrl}?answer=partly`}
        noUrl={`${answerBaseUrl}?answer=no`}
        newSessionUrl={`${baseUrl}/session/start`}
        unsubscribeUrl={`${baseUrl}/api/unsubscribe/${token}`}
      />
    ),
  });

  if (error) {
    throw new Error(`Failed to send check-in email: ${error.message}`);
  }
}
