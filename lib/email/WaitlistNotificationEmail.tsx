import { Body, Container, Head, Html, Preview, Text } from "@react-email/components";

export const WAITLIST_NOTIFICATION_SUBJECT = "New waitlist signup";

type WaitlistNotificationEmailProps = {
  email: string;
  decisionType: string | null;
};

export function WaitlistNotificationEmail({ email, decisionType }: WaitlistNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New waitlist signup: {email}</Preview>
      <Body style={{ backgroundColor: "#fdf6ec", fontFamily: "sans-serif", padding: "24px 0" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "24px",
            padding: "32px",
            maxWidth: "480px",
          }}
        >
          <Text style={{ fontSize: "13px", fontWeight: 600, textTransform: "uppercase", color: "#b45309" }}>
            Clarity
          </Text>
          <Text style={{ fontSize: "20px", fontWeight: 600, color: "#1c1917" }}>
            Someone joined the waitlist
          </Text>
          <Text style={{ fontSize: "15px", color: "#292524" }}>{email}</Text>
          {decisionType && (
            <Text style={{ fontSize: "13px", color: "#78716c" }}>
              Decision: {decisionType}
            </Text>
          )}
        </Container>
      </Body>
    </Html>
  );
}
