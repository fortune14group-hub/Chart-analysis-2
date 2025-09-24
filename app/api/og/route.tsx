import { ImageResponse } from "next/og";
import { sv } from "@/lib/i18n/sv";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontFamily: "sans-serif",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          width: "100%",
          height: "100%",
          padding: "80px",
          background: "linear-gradient(135deg, #020617, #0f172a)",
          color: "#e2e8f0",
        }}
      >
        <div style={{ fontSize: 24, color: "#38bdf8", letterSpacing: "0.3em" }}>BETSPREAD</div>
        <div style={{ fontSize: 60, fontWeight: 700, marginTop: 16 }}>{sv.brand}</div>
        <div style={{ fontSize: 28, maxWidth: 600, marginTop: 24 }}>{sv.tagline}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
