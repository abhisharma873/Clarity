import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FDF6EC",
          borderRadius: "6px",
        }}
      >
        <svg width="26" height="26" viewBox="0 0 280 280">
          <circle cx="140" cy="140" r="120" fill="none" stroke="#7C2D12" strokeWidth="18" />
          <circle cx="140" cy="140" r="42" fill="#C2410C" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
