import { ImageResponse } from "next/og";

// Favicon: red "PDF" badge matching the PDFToolkit brand mark.
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
          background: "linear-gradient(135deg,#f43f5e,#dc2626)",
          borderRadius: 7,
          color: "white",
          fontSize: 12,
          fontWeight: 900,
          letterSpacing: "-0.5px",
        }}
      >
        PDF
      </div>
    ),
    { ...size }
  );
}
