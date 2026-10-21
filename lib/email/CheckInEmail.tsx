import { Body, Button, Container, Head, Hr, Html, Link, Preview, Text } from "@react-email/components";

export const CHECK_IN_EMAIL_SUBJECT = "30 days ago you decided something";

type CheckInEmailProps = {
  decision: string;
  firstStep: string;
  yesUrl: string;
  partlyUrl: string;
  noUrl: string;
  newSessionUrl: string;
  unsubscribeUrl: string;
};

const buttonStyle = {
  display: "inline-block",
  margin: "4px 8px 4px 0",
  padding: "10px 20px",
  borderRadius: "999px",
  border: "1px solid #d6d3d1",
  color: "#44403c",
  fontSize: "14px",
  fontWeight: 600,
  textDecoration: "none",
};

export function CheckInEmail({
  decision,
  firstStep,
  yesUrl,
  partlyUrl,
  noUrl,
  newSessionUrl,
  unsubscribeUrl,
}: CheckInEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>30 days ago you decided: {decision}</Preview>
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
            30 days ago, you decided:
          </Text>
          <Text style={{ fontSize: "17px", color: "#292524" }}>&ldquo;{decision}&rdquo;</Text>

          <Text style={{ fontSize: "13px", fontWeight: 600, textTransform: "uppercase", color: "#78716c" }}>
            Your first step was
          </Text>
          <Text style={{ fontSize: "15px", color: "#44403c" }}>{firstStep}</Text>

          <Hr style={{ borderColor: "#e7e5e4", margin: "24px 0" }} />

          <Text style={{ fontSize: "16px", fontWeight: 600, color: "#1c1917" }}>Did you act on it?</Text>
          <div>
            <Button href={yesUrl} style={buttonStyle}>
              Yes
            </Button>
            <Button href={partlyUrl} style={buttonStyle}>
              Partly
            </Button>
            <Button href={noUrl} style={buttonStyle}>
              Not yet
            </Button>
          </div>

          <Hr style={{ borderColor: "#e7e5e4", margin: "24px 0" }} />

          <Text style={{ fontSize: "13px", color: "#78716c" }}>
            Facing something new?{" "}
            <Link href={newSessionUrl} style={{ color: "#b45309" }}>
              Start a new clarity session
            </Link>
          </Text>
          <Text style={{ fontSize: "12px", color: "#a8a29e" }}>
            <Link href={unsubscribeUrl} style={{ color: "#a8a29e" }}>
              Unsubscribe from check-in emails
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
