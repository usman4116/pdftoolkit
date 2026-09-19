import { PDFDocument, degrees } from "pdf-lib";
import { readFileAsArrayBuffer } from "../utils";

/**
 * Merge multiple PDF files into one combined PDF
 */
export async function mergePdfFiles(
  files: (File | { file: File; name: string })[],
  onProgress?: (current: number, total: number) => void
): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const item = files[i];
    const file = "file" in item ? item.file : item;
    const buffer = await readFileAsArrayBuffer(file);
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));

    if (onProgress) onProgress(i + 1, files.length);
  }

  return await mergedPdf.save({ useObjectStreams: true });
}

/**
 * Parse page range string like "1-3, 5, 8-11" into zero-indexed page numbers
 */
export function parsePageRangeString(rangeStr: string, totalPages: number): number[] {
  const indices = new Set<number>();
  const parts = rangeStr.split(/[\s,]+/);

  for (const part of parts) {
    if (!part) continue;
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-");
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const min = Math.max(1, Math.min(start, end));
        const max = Math.min(totalPages, Math.max(start, end));
        for (let p = min; p <= max; p++) {
          indices.add(p - 1);
        }
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        indices.add(pageNum - 1);
      }
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}

export interface SplitFileResult {
  name: string;
  bytes: Uint8Array;
}

/**
 * Split a PDF according to mode (ranges, everyN, or individual)
 */
export async function splitPdf(
  file: File,
  mode: "ranges" | "everyN" | "all",
  options: { rangeStr?: string; n?: number; baseName?: string } = {}
): Promise<SplitFileResult[]> {
  const buffer = await readFileAsArrayBuffer(file);
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();
  const baseName = options.baseName || file.name.replace(/\.pdf$/i, "");
  const results: SplitFileResult[] = [];

  if (mode === "ranges" && options.rangeStr) {
    const pageIndices = parsePageRangeString(options.rangeStr, totalPages);
    if (pageIndices.length === 0) throw new Error("No valid pages found in the specified range");

    const newDoc = await PDFDocument.create();
    const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
    copiedPages.forEach((p) => newDoc.addPage(p));

    const bytes = await newDoc.save({ useObjectStreams: true });
    results.push({
      name: `${baseName}_extracted_pages.pdf`,
      bytes,
    });
    return results;
  }

  if (mode === "everyN") {
    const n = Math.max(1, options.n || 1);
    let chunkIndex = 1;

    for (let start = 0; start < totalPages; start += n) {
      const end = Math.min(start + n, totalPages);
      const chunkDoc = await PDFDocument.create();
      const indices = [];
      for (let p = start; p < end; p++) indices.push(p);

      const copied = await chunkDoc.copyPages(srcDoc, indices);
      copied.forEach((p) => chunkDoc.addPage(p));
      const bytes = await chunkDoc.save({ useObjectStreams: true });

      results.push({
        name: `${baseName}_part_${chunkIndex}.pdf`,
        bytes,
      });
      chunkIndex++;
    }

    return results;
  }

  // mode === "all" (individual pages)
  for (let p = 0; p < totalPages; p++) {
    const singleDoc = await PDFDocument.create();
    const [page] = await singleDoc.copyPages(srcDoc, [p]);
    singleDoc.addPage(page);
    const bytes = await singleDoc.save({ useObjectStreams: true });

    results.push({
      name: `${baseName}_page_${p + 1}.pdf`,
      bytes,
    });
  }

  return results;
}

/**
 * Rotate PDF pages
 */
export async function rotatePdfPages(
  file: File,
  rotationAngle: 90 | 180 | 270,
  targetPageNumbers?: number[] // 1-indexed, if empty rotates all
): Promise<Uint8Array> {
  const buffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  pages.forEach((page, idx) => {
    const pageNum = idx + 1;
    if (!targetPageNumbers || targetPageNumbers.length === 0 || targetPageNumbers.includes(pageNum)) {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + rotationAngle) % 360));
    }
  });

  return await pdfDoc.save({ useObjectStreams: true });
}

/**
 * Reorder, delete, and organize pages
 */
export interface PageOrganizeAction {
  originalIndex: number; // 0-indexed
  rotation: number; // 0, 90, 180, 270
}

export async function organizePdfPages(
  file: File,
  pageOrder: PageOrganizeAction[]
): Promise<Uint8Array> {
  const buffer = await readFileAsArrayBuffer(file);
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const newDoc = await PDFDocument.create();

  for (const item of pageOrder) {
    const [copiedPage] = await newDoc.copyPages(srcDoc, [item.originalIndex]);
    if (item.rotation) {
      const current = copiedPage.getRotation().angle;
      copiedPage.setRotation(degrees((current + item.rotation) % 360));
    }
    newDoc.addPage(copiedPage);
  }

  return await newDoc.save({ useObjectStreams: true });
}

/**
 * Apply an absolute Crop Box to pages
 */
export async function cropPdfPages(
  file: File,
  cropBox: { x: number; y: number; width: number; height: number },
  targetPages?: number[] // 1-indexed
): Promise<Uint8Array> {
  const buffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  pages.forEach((page, idx) => {
    const pageNum = idx + 1;
    if (!targetPages || targetPages.length === 0 || targetPages.includes(pageNum)) {
      page.setCropBox(cropBox.x, cropBox.y, cropBox.width, cropBox.height);
    }
  });

  return await pdfDoc.save({ useObjectStreams: true });
}

/**
 * Trim margins from pages by inset, computed against each page's real size so
 * it works for any page dimensions (A4, Letter, landscape, scanned sizes).
 */
export async function cropPdfByInsets(
  file: File,
  insets: { top: number; bottom: number; left: number; right: number },
  targetPages?: number[] // 1-indexed
): Promise<Uint8Array> {
  const buffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  pages.forEach((page, idx) => {
    const pageNum = idx + 1;
    if (targetPages && targetPages.length > 0 && !targetPages.includes(pageNum)) return;

    const { width, height } = page.getSize();
    // The crop box origin is relative to the page's existing media box origin.
    const mediaBox = page.getMediaBox();
    const left = Math.max(0, insets.left);
    const right = Math.max(0, insets.right);
    const top = Math.max(0, insets.top);
    const bottom = Math.max(0, insets.bottom);

    // Clamp so the remaining region is at least 10pt in each dimension.
    const cropWidth = Math.max(10, width - left - right);
    const cropHeight = Math.max(10, height - top - bottom);
    const x = mediaBox.x + Math.min(left, Math.max(0, width - 10));
    const y = mediaBox.y + Math.min(bottom, Math.max(0, height - 10));

    page.setCropBox(x, y, Math.min(cropWidth, width), Math.min(cropHeight, height));
  });

  return await pdfDoc.save({ useObjectStreams: true });
}
