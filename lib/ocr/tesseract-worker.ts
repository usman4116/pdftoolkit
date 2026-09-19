import { createWorker } from "tesseract.js";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { pdfToImages } from "../pdf/converter";
import { readFileAsDataURL } from "../utils";

export interface OcrProgressStatus {
  page: number;
  totalPages: number;
  progress: number; // 0 to 100
  statusText: string;
}

export interface OcrResult {
  fullText: string;
  pages: { pageNum: number; text: string }[];
}

export const SUPPORTED_OCR_LANGUAGES = [
  { code: "eng", name: "English" },
  { code: "urd", name: "Urdu (اردو)" },
  { code: "ara", name: "Arabic (العربية)" },
  { code: "spa", name: "Spanish (Español)" },
  { code: "fra", name: "French (Français)" },
  { code: "deu", name: "German (Deutsch)" },
  { code: "chi_sim", name: "Chinese Simplified (简体中文)" },
];

/**
 * Run OCR on a PDF or image file with real-time progress callbacks
 */
export async function runDocumentOcr(
  file: File,
  languageCode = "eng",
  onProgress?: (status: OcrProgressStatus) => void
): Promise<OcrResult> {
  const isPdf = file.type.includes("pdf") || file.name.toLowerCase().endsWith(".pdf");

  // Get image sources to process
  let imageSources: { pageNum: number; dataUrl: string }[] = [];

  if (isPdf) {
    if (onProgress) {
      onProgress({ page: 0, totalPages: 1, progress: 5, statusText: "Rendering PDF pages for OCR..." });
    }
    const renderedPages = await pdfToImages(file, "image/jpeg", 150);
    imageSources = renderedPages.map((r) => ({ pageNum: r.pageNum, dataUrl: r.dataUrl }));
  } else {
    const dataUrl = await readFileAsDataURL(file);
    imageSources = [{ pageNum: 1, dataUrl }];
  }

  const totalPages = imageSources.length;
  const pages: { pageNum: number; text: string }[] = [];

  // Initialize Tesseract worker
  const worker = await createWorker(languageCode);

  for (let i = 0; i < totalPages; i++) {
    const pageItem = imageSources[i];
    if (onProgress) {
      onProgress({
        page: pageItem.pageNum,
        totalPages,
        progress: Math.round(((i) / totalPages) * 100),
        statusText: `Recognizing text on page ${pageItem.pageNum} of ${totalPages}...`,
      });
    }

    const { data } = await worker.recognize(pageItem.dataUrl);
    pages.push({
      pageNum: pageItem.pageNum,
      text: data.text.trim(),
    });
  }

  await worker.terminate();

  if (onProgress) {
    onProgress({ page: totalPages, totalPages, progress: 100, statusText: "OCR processing complete!" });
  }

  const fullText = pages.map((p) => `--- PAGE ${p.pageNum} ---\n${p.text}`).join("\n\n");

  return {
    fullText,
    pages,
  };
}

/**
 * Generate a Searchable PDF where the original pages are backed by an invisible text layer
 */
export async function createSearchablePdf(
  file: File,
  ocrResult: OcrResult
): Promise<Uint8Array> {
  const isPdf = file.type.includes("pdf") || file.name.toLowerCase().endsWith(".pdf");
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let imagePages: { dataUrl: string; pageNum: number }[] = [];
  if (isPdf) {
    const rendered = await pdfToImages(file, "image/jpeg", 150);
    imagePages = rendered.map((r) => ({ dataUrl: r.dataUrl, pageNum: r.pageNum }));
  } else {
    const url = await readFileAsDataURL(file);
    imagePages = [{ dataUrl: url, pageNum: 1 }];
  }

  for (let i = 0; i < imagePages.length; i++) {
    const imgItem = imagePages[i];
    const base64Data = imgItem.dataUrl.split(",")[1];
    const imgBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
    // PDF-rendered pages are JPEG, but a directly uploaded image may be PNG.
    const isPng = imgItem.dataUrl.startsWith("data:image/png");
    const embeddedImg = isPng
      ? await pdfDoc.embedPng(imgBytes)
      : await pdfDoc.embedJpg(imgBytes);

    const { width, height } = embeddedImg;
    const page = pdfDoc.addPage([width, height]);

    // Draw visual image
    page.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width,
      height,
    });

    // Draw text overlay with low opacity (0.01) so it is invisible visually but selectable and searchable!
    const pageText = ocrResult.pages[i]?.text || "";
    if (pageText) {
      const lines = pageText.split("\n").slice(0, 40); // safety cap per page
      let currentY = height - 40;
      for (const line of lines) {
        if (line.trim() && currentY > 40) {
          try {
            // sanitize text for win-ansi font
            const cleanLine = line.replace(/[^\x00-\x7F]/g, " ").substring(0, 100);
            page.drawText(cleanLine, {
              x: 40,
              y: currentY,
              size: 10,
              font,
              color: rgb(0, 0, 0),
              opacity: 0.01,
            });
          } catch {
            // ignore glyph issues gracefully
          }
          currentY -= 15;
        }
      }
    }
  }

  return await pdfDoc.save({ useObjectStreams: true });
}
