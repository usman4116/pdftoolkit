import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import { readFileAsArrayBuffer } from "../utils";

export interface WatermarkOptions {
  type: "text" | "image";
  text?: string;
  imageFile?: File;
  opacity: number; // 0.1 to 1.0
  rotation: number; // in degrees, e.g. -45
  fontSize: number;
  color: string; // hex string e.g. #ff0000
  position: "center" | "diagonal" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  pageScope: "all" | "odd" | "even";
}

function hexToRgb(hex: string) {
  const cleanHex = hex.replace("#", "");
  const num = parseInt(cleanHex, 16);
  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255,
  };
}

export async function addWatermarkToPdf(
  file: File,
  options: WatermarkOptions
): Promise<Uint8Array> {
  const buffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let embeddedImage = null;
  if (options.type === "image" && options.imageFile) {
    const imgBuffer = await readFileAsArrayBuffer(options.imageFile);
    const isPng = options.imageFile.type.includes("png") || options.imageFile.name.toLowerCase().endsWith(".png");
    embeddedImage = isPng ? await pdfDoc.embedPng(imgBuffer) : await pdfDoc.embedJpg(imgBuffer);
  }

  const { r, g, b } = hexToRgb(options.color || "#6b7280");
  const textColor = rgb(r, g, b);

  pages.forEach((page, index) => {
    const pageNum = index + 1;
    if (options.pageScope === "odd" && pageNum % 2 === 0) return;
    if (options.pageScope === "even" && pageNum % 2 !== 0) return;

    const { width, height } = page.getSize();

    if (options.type === "text" && options.text) {
      const text = options.text;
      const textWidth = font.widthOfTextAtSize(text, options.fontSize);
      const textHeight = font.heightAtSize(options.fontSize);

      let x = (width - textWidth) / 2;
      let y = (height - textHeight) / 2;
      let rot = options.rotation;

      if (options.position === "diagonal") {
        rot = -45;
        x = width / 2 - textWidth / 2;
        y = height / 2;
      } else if (options.position === "top-left") {
        x = 50;
        y = height - 50;
      } else if (options.position === "top-right") {
        x = width - textWidth - 50;
        y = height - 50;
      } else if (options.position === "bottom-left") {
        x = 50;
        y = 50;
      } else if (options.position === "bottom-right") {
        x = width - textWidth - 50;
        y = 50;
      }

      page.drawText(text, {
        x,
        y,
        size: options.fontSize,
        font,
        color: textColor,
        opacity: options.opacity,
        rotate: degrees(rot),
      });
    } else if (options.type === "image" && embeddedImage) {
      const imgW = 200;
      const imgH = (embeddedImage.height / embeddedImage.width) * imgW;
      const x = (width - imgW) / 2;
      const y = (height - imgH) / 2;

      page.drawImage(embeddedImage, {
        x,
        y,
        width: imgW,
        height: imgH,
        opacity: options.opacity,
        rotate: degrees(options.rotation),
      });
    }
  });

  return await pdfDoc.save({ useObjectStreams: true });
}
