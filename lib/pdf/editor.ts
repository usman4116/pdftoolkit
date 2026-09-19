import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import { readFileAsArrayBuffer } from "../utils";

export interface EditorAnnotation {
  id: string;
  type: "text" | "draw" | "highlight" | "rectangle" | "circle" | "arrow" | "image" | "signature";
  pageNum: number; // 1-indexed
  // Coordinates relative to displayed page [0..width, 0..height]
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string; // hex
  strokeWidth?: number;
  opacity?: number;
  // For text
  text?: string;
  fontSize?: number;
  // For freehand drawing
  points?: { x: number; y: number }[];
  // For images / signatures
  imageDataUrl?: string;
}

function hexToRgb(hex: string) {
  const cleanHex = hex ? hex.replace("#", "") : "000000";
  const num = parseInt(cleanHex.length === 3 ? cleanHex.split("").map((c) => c + c).join("") : cleanHex, 16);
  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255,
  };
}

/**
 * Burn annotations into the PDF pages using pdf-lib
 */
export async function exportEditedPdf(
  file: File,
  annotations: EditorAnnotation[],
  deletedPages: number[] = [],
  rotatedPages: { [pageNum: number]: number } = {},
  // Scale at which annotation coordinates were captured on screen.
  // The editor renders/records clicks at 1.25×; callers that already work in
  // PDF points (e.g. the signature tool) should pass 1.
  displayScale = 1
): Promise<Uint8Array> {
  const buffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const totalPages = pdfDoc.getPageCount();
  const s = displayScale > 0 ? displayScale : 1;

  // Cache embedded images so we don't re-embed duplicates
  const embeddedImagesMap = new Map<string, any>();

  for (let i = 0; i < totalPages; i++) {
    const pageNum = i + 1;
    if (deletedPages.includes(pageNum)) continue;

    const page = pdfDoc.getPage(i);
    const { height: pageHeight } = page.getSize();

    const pageAnnotations = annotations.filter((a) => a.pageNum === pageNum);

    for (const ann of pageAnnotations) {
      const { r, g, b } = hexToRgb(ann.color || "#000000");
      const colorRgb = rgb(r, g, b);
      const opacity = ann.opacity ?? 1.0;

      // Convert captured (scaled) canvas coordinates back to PDF points.
      const ax = ann.x / s;
      const ay = ann.y / s;
      const aw = (ann.width || 0) / s;
      const ah = (ann.height || 0) / s;

      // In PDF coordinate space, y=0 is at the bottom of the page!
      // In web canvas coordinates, y=0 is at the top of the page.
      // So pdfY = pageHeight - y - height
      const pdfY = pageHeight - ay - ah;

      switch (ann.type) {
        case "text":
          if (ann.text) {
            const fontSize = (ann.fontSize || 16) / s;
            page.drawText(ann.text, {
              x: ax,
              y: pageHeight - ay - fontSize,
              size: fontSize,
              font,
              color: colorRgb,
              opacity,
            });
          }
          break;

        case "highlight":
          page.drawRectangle({
            x: ax,
            y: pdfY,
            width: aw || 100,
            height: ah || 20,
            color: rgb(1, 1, 0), // yellow
            opacity: 0.35,
          });
          break;

        case "rectangle":
          page.drawRectangle({
            x: ax,
            y: pdfY,
            width: aw || 80,
            height: ah || 50,
            borderColor: colorRgb,
            borderWidth: ann.strokeWidth || 2,
            opacity,
          });
          break;

        case "circle": {
          const radX = (aw || 60) / 2;
          const radY = (ah || 60) / 2;
          page.drawEllipse({
            x: ax + radX,
            y: pdfY + radY,
            xScale: radX,
            yScale: radY,
            borderColor: colorRgb,
            borderWidth: ann.strokeWidth || 2,
            opacity,
          });
          break;
        }

        case "draw":
          if (ann.points && ann.points.length > 1) {
            for (let p = 0; p < ann.points.length - 1; p++) {
              const pt1 = ann.points[p];
              const pt2 = ann.points[p + 1];
              page.drawLine({
                start: { x: pt1.x / s, y: pageHeight - pt1.y / s },
                end: { x: pt2.x / s, y: pageHeight - pt2.y / s },
                thickness: ann.strokeWidth || 2,
                color: colorRgb,
                opacity,
              });
            }
          }
          break;

        case "arrow": {
          const startX = ax;
          const startY = pageHeight - ay;
          const endX = ax + (aw || 80);
          const endY = pageHeight - (ay + (ah || 80));

          page.drawLine({
            start: { x: startX, y: startY },
            end: { x: endX, y: endY },
            thickness: ann.strokeWidth || 2,
            color: colorRgb,
            opacity,
          });

          // Draw an arrowhead at the end point so the arrow reads as an arrow.
          const angle = Math.atan2(endY - startY, endX - startX);
          const headLen = Math.max(8, (ann.strokeWidth || 2) * 4);
          for (const offset of [Math.PI - 0.4, Math.PI + 0.4]) {
            page.drawLine({
              start: { x: endX, y: endY },
              end: {
                x: endX + headLen * Math.cos(angle + offset),
                y: endY + headLen * Math.sin(angle + offset),
              },
              thickness: ann.strokeWidth || 2,
              color: colorRgb,
              opacity,
            });
          }
          break;
        }

        case "image":
        case "signature":
          if (ann.imageDataUrl) {
            let embedded = embeddedImagesMap.get(ann.imageDataUrl);
            if (!embedded) {
              const base64Data = ann.imageDataUrl.split(",")[1];
              const imgBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
              if (ann.imageDataUrl.includes("image/png")) {
                embedded = await pdfDoc.embedPng(imgBytes);
              } else {
                embedded = await pdfDoc.embedJpg(imgBytes);
              }
              embeddedImagesMap.set(ann.imageDataUrl, embedded);
            }

            page.drawImage(embedded, {
              x: ax,
              y: pdfY,
              width: aw || 120,
              height: ah || 60,
              opacity,
            });
          }
          break;
      }
    }

    // Apply any user rotation for this page (additive to existing rotation).
    if (rotatedPages[pageNum]) {
      const current = page.getRotation().angle;
      page.setRotation(degrees((current + rotatedPages[pageNum]) % 360));
    }
  }

  // Handle page deletion if any
  if (deletedPages.length > 0) {
    // pdfDoc.removePage accepts 0-indexed indices
    // Must delete from highest to lowest index
    const sortedDesc = [...deletedPages].map((p) => p - 1).sort((a, b) => b - a);
    sortedDesc.forEach((idx) => {
      if (idx >= 0 && idx < pdfDoc.getPageCount()) {
        pdfDoc.removePage(idx);
      }
    });
  }

  return await pdfDoc.save({ useObjectStreams: true });
}
