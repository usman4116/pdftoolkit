import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { loadPdfDocument } from "./pdfjs-init";
import { readFileAsArrayBuffer } from "../utils";

export interface PageImageResult {
  pageNum: number;
  blob: Blob;
  dataUrl: string;
}

/**
 * Render PDF pages to high-res JPG or PNG images
 */
export async function pdfToImages(
  file: File,
  format: "image/jpeg" | "image/png" = "image/jpeg",
  dpi = 150,
  onProgress?: (current: number, total: number) => void
): Promise<PageImageResult[]> {
  const buffer = await readFileAsArrayBuffer(file);
  const pdfjsDoc = await loadPdfDocument(buffer);
  const total = pdfjsDoc.numPages;
  const results: PageImageResult[] = [];
  const scale = dpi / 72;

  for (let i = 1; i <= total; i++) {
    const page = await pdfjsDoc.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Could not initialize 2D canvas");

    await page.render({ canvasContext: ctx, viewport }).promise;

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b || new Blob()), format, format === "image/jpeg" ? 0.92 : undefined);
    });

    const dataUrl = canvas.toDataURL(format, 0.92);

    results.push({
      pageNum: i,
      blob,
      dataUrl,
    });

    if (onProgress) onProgress(i, total);
  }

  return results;
}

/**
 * Zip an array of page images for batch download
 */
export async function createZipOfImages(
  images: PageImageResult[],
  baseName: string,
  ext: "jpg" | "png" = "jpg"
): Promise<Blob> {
  const zip = new JSZip();
  images.forEach((img) => {
    zip.file(`${baseName}_page_${img.pageNum}.${ext}`, img.blob);
  });
  return await zip.generateAsync({ type: "blob" });
}

/**
 * Decode any browser-supported image (e.g. WEBP) to JPEG bytes via canvas.
 * Used when the source format cannot be embedded directly by pdf-lib.
 */
async function transcodeImageToJpeg(file: File): Promise<ArrayBuffer> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not decode image "${file.name}"`));
    image.src = dataUrl;
  });

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not initialize 2D canvas for image conversion");
  // Flatten transparency onto white so JPEG output looks correct.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b || new Blob()), "image/jpeg", 0.92);
  });
  return await blob.arrayBuffer();
}

/**
 * Convert multiple image files into a single standardized PDF
 */
export async function imagesToPdf(
  images: File[],
  pageSize: "fit" | "a4" | "letter" = "fit",
  margin = 20,
  onProgress?: (current: number, total: number) => void
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < images.length; i++) {
    const imgFile = images[i];
    const name = imgFile.name.toLowerCase();
    const isPng = imgFile.type.includes("png") || name.endsWith(".png");
    const isJpeg =
      imgFile.type.includes("jpeg") ||
      imgFile.type.includes("jpg") ||
      name.endsWith(".jpg") ||
      name.endsWith(".jpeg");

    let embeddedImage;
    if (isPng) {
      embeddedImage = await pdfDoc.embedPng(await readFileAsArrayBuffer(imgFile));
    } else if (isJpeg) {
      embeddedImage = await pdfDoc.embedJpg(await readFileAsArrayBuffer(imgFile));
    } else {
      // WEBP or any other browser-decodable format → transcode to JPEG first.
      embeddedImage = await pdfDoc.embedJpg(await transcodeImageToJpeg(imgFile));
    }

    const { width: imgW, height: imgH } = embeddedImage;

    if (pageSize === "fit") {
      const page = pdfDoc.addPage([imgW + margin * 2, imgH + margin * 2]);
      page.drawImage(embeddedImage, {
        x: margin,
        y: margin,
        width: imgW,
        height: imgH,
      });
    } else {
      // Standard paper dimensions: A4 = [595.28, 841.89], US Letter = [612, 792]
      const [pageW, pageH] = pageSize === "a4" ? [595.28, 841.89] : [612, 792];
      const page = pdfDoc.addPage([pageW, pageH]);

      const availW = pageW - margin * 2;
      const availH = pageH - margin * 2;
      const ratio = Math.min(availW / imgW, availH / imgH);

      const drawW = imgW * ratio;
      const drawH = imgH * ratio;
      const posX = margin + (availW - drawW) / 2;
      const posY = margin + (availH - drawH) / 2;

      page.drawImage(embeddedImage, {
        x: posX,
        y: posY,
        width: drawW,
        height: drawH,
      });
    }

    if (onProgress) onProgress(i + 1, images.length);
  }

  return await pdfDoc.save({ useObjectStreams: true });
}

/**
 * Extract all selectable text from a PDF
 */
export async function extractTextFromPdf(
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<{ pageNum: number; text: string }[]> {
  const buffer = await readFileAsArrayBuffer(file);
  const pdfjsDoc = await loadPdfDocument(buffer);
  const total = pdfjsDoc.numPages;
  const pages: { pageNum: number; text: string }[] = [];

  for (let i = 1; i <= total; i++) {
    const page = await pdfjsDoc.getPage(i);
    const textContent = await page.getTextContent();
    const strings = textContent.items
      .map((item: any) => ("str" in item ? item.str : ""))
      .filter(Boolean);
    pages.push({
      pageNum: i,
      text: strings.join(" "),
    });
    if (onProgress) onProgress(i, total);
  }

  return pages;
}
