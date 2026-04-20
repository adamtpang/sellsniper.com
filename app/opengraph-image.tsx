import { ImageResponse } from "next/og";

export const alt = "SellSniper — stop shouting into the void";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#000000",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          position: "relative",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        {/* top red bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 6,
            background: "#ef4444",
            display: "flex",
          }}
        />

        {/* wordmark */}
        <div
          style={{
            display: "flex",
            fontSize: 40,
            fontWeight: 700,
            color: "#ef4444",
            letterSpacing: 2,
            marginBottom: 36,
          }}
        >
          SELLSNIPER
        </div>

        {/* headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 92,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.05,
            marginBottom: 28,
          }}
        >
          <div style={{ display: "flex" }}>Stop shouting</div>
          <div style={{ display: "flex" }}>
            into the
            <span style={{ color: "#ef4444", marginLeft: 20 }}>void.</span>
          </div>
        </div>

        {/* subheadline */}
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#a1a1aa",
            marginBottom: 40,
          }}
        >
          Paste any link. Find the humans who&apos;d love it.
        </div>

        {/* url */}
        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 500,
            color: "#52525b",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          }}
        >
          sellsniper.com
        </div>
      </div>
    ),
    { ...size },
  );
}
