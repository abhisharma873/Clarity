"use client";

import Link from "next/link";

// global-error replaces the root layout entirely when it fires (an error in
// the layout itself), so it doesn't inherit globals.css, next/font, or the
// app's theme — kept deliberately simple with inline styles rather than
// depending on a pipeline that may be what's broken.
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          display: "flex",
          minHeight: "100dvh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          padding: "0 1.5rem",
          textAlign: "center",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          backgroundColor: "#fdf6ec",
          color: "#1c1917",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>Something went wrong</h1>
        <p style={{ maxWidth: "24rem", fontSize: "0.875rem", color: "#57534e", margin: 0 }}>
          We hit a snag on our end. Please try again shortly.
        </p>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              borderRadius: "9999px",
              border: "1px solid #d6d3d1",
              padding: "0.75rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#44403c",
              backgroundColor: "transparent",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          <Link
            href="/"
            style={{
              borderRadius: "9999px",
              backgroundColor: "#d97706",
              padding: "0.75rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#ffffff",
              textDecoration: "none",
            }}
          >
            Go home
          </Link>
        </div>
      </body>
    </html>
  );
}
