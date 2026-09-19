import { compressPdf, CompressionOptions, CompressionResult } from "../pdf/compression";
import { mergePdfFiles, splitPdf, SplitFileResult, rotatePdfPages, cropPdfPages } from "../pdf/merge-split";
import { pdfToImages, imagesToPdf, PageImageResult } from "../pdf/converter";
import { addWatermarkToPdf, WatermarkOptions } from "../pdf/watermark";
import { protectPdfFile, unlockPdfFile, repairPdfFile } from "../pdf/security";
import { runDocumentOcr, OcrResult } from "../ocr/tesseract-worker";
import { pdfToWordDocx, wordToPdfDoc } from "../word/docx-handler";

export interface IPdfProcessor {
  compress(file: File, options: CompressionOptions, onProgress?: (percent: number, status: string) => void): Promise<CompressionResult>;
  merge(files: File[], onProgress?: (cur: number, tot: number) => void): Promise<Uint8Array>;
  split(file: File, mode: "ranges" | "everyN" | "all", options?: { rangeStr?: string; n?: number }): Promise<SplitFileResult[]>;
  rotate(file: File, angle: 90 | 180 | 270, targetPages?: number[]): Promise<Uint8Array>;
  crop(file: File, box: { x: number; y: number; width: number; height: number }, pages?: number[]): Promise<Uint8Array>;
  pdfToImages(file: File, format?: "image/jpeg" | "image/png", dpi?: number, onProgress?: (cur: number, tot: number) => void): Promise<PageImageResult[]>;
  imagesToPdf(images: File[], pageSize?: "fit" | "a4" | "letter", margin?: number): Promise<Uint8Array>;
  watermark(file: File, options: WatermarkOptions): Promise<Uint8Array>;
  protect(file: File, password: string): Promise<{ success: boolean; bytes?: Uint8Array; error?: string }>;
  unlock(file: File, password?: string): Promise<{ success: boolean; bytes?: Uint8Array; error?: string }>;
  repair(file: File): Promise<{ success: boolean; message: string; recoveredPages: number; pdfBytes?: Uint8Array }>;
  ocr(file: File, lang?: string, onProgress?: (s: any) => void): Promise<OcrResult>;
  pdfToWord(file: File, onProgress?: (cur: number, tot: number) => void): Promise<Blob>;
  wordToPdf(file: File): Promise<Uint8Array>;
}

export class BrowserProcessor implements IPdfProcessor {
  async compress(file: File, options: CompressionOptions, onProgress?: (p: number, s: string) => void) {
    return await compressPdf(file, options, onProgress);
  }
  async merge(files: File[], onProgress?: (c: number, t: number) => void) {
    return await mergePdfFiles(files, onProgress);
  }
  async split(file: File, mode: "ranges" | "everyN" | "all", options?: { rangeStr?: string; n?: number }) {
    return await splitPdf(file, mode, options);
  }
  async rotate(file: File, angle: 90 | 180 | 270, targetPages?: number[]) {
    return await rotatePdfPages(file, angle, targetPages);
  }
  async crop(file: File, box: { x: number; y: number; width: number; height: number }, pages?: number[]) {
    return await cropPdfPages(file, box, pages);
  }
  async pdfToImages(file: File, format: "image/jpeg" | "image/png" = "image/jpeg", dpi = 150, onProgress?: (c: number, t: number) => void) {
    return await pdfToImages(file, format, dpi, onProgress);
  }
  async imagesToPdf(images: File[], pageSize: "fit" | "a4" | "letter" = "fit", margin = 20) {
    return await imagesToPdf(images, pageSize, margin);
  }
  async watermark(file: File, options: WatermarkOptions) {
    return await addWatermarkToPdf(file, options);
  }
  async protect(file: File, password: string) {
    return await protectPdfFile(file, password);
  }
  async unlock(file: File, password?: string) {
    return await unlockPdfFile(file, password);
  }
  async repair(file: File) {
    return await repairPdfFile(file);
  }
  async ocr(file: File, lang = "eng", onProgress?: (s: any) => void) {
    return await runDocumentOcr(file, lang, onProgress);
  }
  async pdfToWord(file: File, onProgress?: (c: number, t: number) => void) {
    return await pdfToWordDocx(file, onProgress);
  }
  async wordToPdf(file: File) {
    return await wordToPdfDoc(file);
  }
}

/**
 * Serverless / External Worker Processor (stub prepared for remote scaling if desired)
 */
export class VercelProcessor extends BrowserProcessor {
  // Inherits browser processing, with modular endpoint hooks where serverless is preferred
}

export const defaultPdfProcessor: IPdfProcessor = new BrowserProcessor();
