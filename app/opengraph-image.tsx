import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/seo/metadata";

// Default social share card for PDFToolkit (used by OpenGraph + Twitter).
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 96,
              height: 96,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg,#f43f5e,#dc2626)",
              borderRadius: 20,
              fontSize: 34,
              fontWeight: 900,
            }}
          >
            PDF
          </div>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, letterSpacing: "-2px" }}>
            <span>PDF</span>
            <span style={{ color: "#f87171" }}>Toolkit</span>
          </div>
        </div>
        <div style={{ marginTop: 32, fontSize: 34, color: "#cbd5e1", fontWeight: 500 }}>
          {SITE_TAGLINE}
        </div>
        <div style={{ marginTop: 16, fontSize: 24, color: "#818cf8" }}>
          Compress · Convert · Edit · Merge · Split · OCR · Sign
        </div>
      </div>
    ),
    { ...size }
  );
}
