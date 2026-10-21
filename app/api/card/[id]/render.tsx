export type CardElementData = {
  lens: "reflection" | "numerology";
  lifePathValue: number | null;
  reflectionLine: string;
  decisionText: string | null;
  host: string;
};

function Symbol() {
  return (
    <svg width="280" height="280" viewBox="0 0 280 280">
      <circle cx="140" cy="140" r="120" fill="none" stroke="#7C2D12" strokeWidth="6" />
      <circle cx="140" cy="140" r="36" fill="#C2410C" />
    </svg>
  );
}

export function buildCardElement(data: CardElementData) {
  const { lens, lifePathValue, reflectionLine, decisionText, host } = data;

  return (
    <div
      style={{
        width: "1080px",
        height: "1920px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(180deg, #FDF6EC 0%, #F3D9B9 55%, #D97706 100%)",
        padding: "100px 90px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: "34px",
          letterSpacing: "6px",
          color: "#7C2D12",
          fontWeight: 700,
        }}
      >
        YOUR CLARITY MOMENT
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "48px",
        }}
      >
        {lens === "numerology" && lifePathValue !== null ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                fontSize: "420px",
                fontWeight: 800,
                color: "#7C2D12",
                lineHeight: 1,
              }}
            >
              {lifePathValue}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "32px",
                letterSpacing: "4px",
                color: "#9A3412",
                marginTop: "12px",
              }}
            >
              LIFE PATH
            </div>
          </div>
        ) : (
          <Symbol />
        )}

        <div
          style={{
            display: "flex",
            fontSize: "58px",
            lineHeight: 1.4,
            color: "#431407",
            textAlign: "center",
            maxWidth: "820px",
          }}
        >
          {reflectionLine}
        </div>

        {decisionText && (
          <div
            style={{
              display: "flex",
              fontSize: "34px",
              color: "#7C2D12",
              textAlign: "center",
              maxWidth: "760px",
              backgroundColor: "rgba(255,255,255,0.45)",
              borderRadius: "28px",
              padding: "32px 44px",
              lineHeight: 1.4,
            }}
          >
            {decisionText}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: "30px",
          color: "#7C2D12",
          opacity: 0.85,
        }}
      >
        <span style={{ display: "flex", fontWeight: 700 }}>Clarity</span>
        <span style={{ display: "flex", margin: "0 14px" }}>·</span>
        <span style={{ display: "flex" }}>{host}</span>
      </div>
    </div>
  );
}
