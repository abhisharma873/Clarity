import { ImageResponse } from "next/og";

export const alt = "Clarity — A clarity session, not a prediction";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "32px",
          background: "linear-gradient(180deg, #FDF6EC 0%, #F3D9B9 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="96" height="96" viewBox="0 0 280 280">
            <circle cx="140" cy="140" r="120" fill="none" stroke="#7C2D12" strokeWidth="10" />
            <circle cx="140" cy="140" r="40" fill="#C2410C" />
          </svg>
        </div>
        <div style={{ display: "flex", fontSize: "72px", fontWeight: 700, color: "#1c1917" }}>
          Clarity
        </div>
        <div style={{ display: "flex", fontSize: "32px", color: "#78716c" }}>
          A clarity session, not a prediction
        </div>
      </div>
    ),
    { ...size },
  );
}
