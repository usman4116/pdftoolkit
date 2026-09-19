import { PDFDocument } from "pdf-lib";
import { getPdfJs, loadPdfDocument } from "./pdfjs-init";
import { readFileAsArrayBuffer } from "../utils";

export interface CompressionOptions {
  mode: "preset" | "custom";
  preset?: "extreme" | "high" | "medium" | "low";
  targetSizeValue?: number;
  targetSizeUnit?: "MB" | "KB";
  quality?: number; // 0.1 - 1.0
  dpi?: number; // 72, 96, 120, 150, 200, 300
  grayscale?: boolean;
  removeMetadata?: boolean;
  downsampleImages?: boolean;
}

export interface CompressionResult {
  originalBytes: number;
  compressedBytes: number;
  reductionPercentage: number;
  pageCount: number;
  targetAchieved?: boolean;
  targetBytes?: number;
  warning?: string;
  pdfBytes: Uint8Array;
}

/**
 * Strips metadata and repacks object streams losslessly via pdf-lib
 */
export async function compressPdfStructure(buffer: ArrayBuffer): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  pdfDoc.setTitle("");
  pdfDoc.setAuthor("");
  pdfDoc.setSubject("");
  pdfDoc.setKeywords([]);
  pdfDoc.setProducer("");
  pdfDoc.setCreator("");
  return await pdfDoc.save({ useObjectStreams: true });
}

/**
 * Re-encodes pages through HTML5 canvas with controlled scale, quality, and grayscale
 */
async function rasterCompressPdf(
  buffer: ArrayBuffer,
  scale: number,
  quality: number,
  grayscale: boolean,
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  const pdfjsDoc = await loadPdfDocument(buffer);
  const pageCount = pdfjsDoc.numPages;
  const newPdfDoc = await PDFDocument.create();

  for (let i = 1; i <= pageCount; i++) {
    const page = await pdfjsDoc.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));
    const ctx = canvas.getContext("2d", { willReadFrequently: grayscale });

    if (!ctx) throw new Error("Could not initialize 2D canvas context");

    await page.render({ canvasContext: ctx, viewport }).promise;

    if (grayscale) {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      for (let p = 0; p < data.length; p += 4) {
        const gray = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];
        data[p] = gray;
        data[p + 1] = gray;
        data[p + 2] = gray;
      }
      ctx.putImageData(imgData, 0, 0);
    }

    const jpegBlob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b || new Blob()), "image/jpeg", quality);
    });

    const imgBuffer = await jpegBlob.arrayBuffer();
    const embeddedImg = await newPdfDoc.embedJpg(imgBuffer);

    // Get original unscaled page dimensions
    const origViewport = page.getViewport({ scale: 1.0 });
    const newPage = newPdfDoc.addPage([origViewport.width, origViewport.height]);
    newPage.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: origViewport.width,
      height: origViewport.height,
    });

    if (onProgress) {
      onProgress(Math.round((i / pageCount) * 100));
    }
  }

  return await newPdfDoc.save({ useObjectStreams: true });
}

/**
 * Intelligent Target Size and Preset Compression Algorithm
 */
export async function compressPdf(
  file: File,
  options: CompressionOptions,
  onProgress?: (percent: number, status: string) => void
): Promise<CompressionResult> {
  const originalBytes = file.size;
  const buffer = await readFileAsArrayBuffer(file);

  const initialDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const pageCount = initialDoc.getPageCount();

  let targetBytes: number | undefined;
  if (options.mode === "custom" && options.targetSizeValue && options.targetSizeValue > 0) {
    targetBytes = options.targetSizeUnit === "KB"
      ? options.targetSizeValue * 1024
      : options.targetSizeValue * 1024 * 1024;
  }

  // 1. First attempt: Structural optimization
  if (onProgress) onProgress(15, "Optimizing PDF structure and metadata...");
  const structuralResult = await compressPdfStructure(buffer);

  if (targetBytes && structuralResult.byteLength <= targetBytes) {
    const reduction = Math.max(0, ((originalBytes - structuralResult.byteLength) / originalBytes) * 100);
    return {
      originalBytes,
      compressedBytes: structuralResult.byteLength,
      reductionPercentage: parseFloat(reduction.toFixed(1)),
      pageCount,
      targetAchieved: true,
      targetBytes,
      pdfBytes: structuralResult,
    };
  }

  // Preset configuration map
  let scale = 1.25;
  let quality = 0.65;
  let grayscale = !!options.grayscale;

  if (options.mode === "preset") {
    switch (options.preset) {
      case "extreme":
        scale = 0.8;
        quality = 0.35;
        grayscale = options.grayscale ?? false;
        break;
      case "high":
        scale = 1.0;
        quality = 0.50;
        break;
      case "medium":
        scale = 1.25;
        quality = 0.70;
        break;
      case "low":
        scale = 1.5;
        quality = 0.85;
        break;
      default:
        scale = 1.25;
        quality = 0.70;
    }

    if (onProgress) onProgress(40, "Compressing document pages...");
    const compressed = await rasterCompressPdf(buffer, scale, quality, grayscale, (p) => {
      if (onProgress) onProgress(40 + Math.round(p * 0.55), `Processing page raster ${p}%`);
    });

    const finalBytes = compressed.byteLength < originalBytes ? compressed : structuralResult;
    const reduction = Math.max(0, ((originalBytes - finalBytes.byteLength) / originalBytes) * 100);

    return {
      originalBytes,
      compressedBytes: finalBytes.byteLength,
      reductionPercentage: parseFloat(reduction.toFixed(1)),
      pageCount,
      pdfBytes: finalBytes,
    };
  }

  // CUSTOM TARGET SIZE: Iterative search
  if (targetBytes) {
    if (onProgress) onProgress(30, `Calculating parameters for target ${options.targetSizeValue} ${options.targetSizeUnit}...`);

    // Seed the search from the user's chosen quality/DPI/grayscale so those
    // controls actually influence the output, then progressively compress
    // harder on later passes until the target is met.
    const userQuality = Math.min(1, Math.max(0.1, options.quality ?? 0.7));
    const userScale = options.dpi ? options.dpi / 96 : 1.25;
    const userGray = !!options.grayscale;
    // When downsampling is disabled, keep the user's resolution on every pass
    // and only trade quality; otherwise allow the scale to drop.
    const allowDownsample = options.downsampleImages ?? true;
    const scaleAt = (factor: number) => (allowDownsample ? userScale * factor : userScale);

    const candidateConfigs = [
      { scale: scaleAt(1.0), quality: userQuality, gray: userGray },
      { scale: scaleAt(0.85), quality: Math.max(0.15, userQuality * 0.8), gray: userGray },
      { scale: scaleAt(0.7), quality: Math.max(0.12, userQuality * 0.6), gray: userGray },
      { scale: scaleAt(0.55), quality: Math.max(0.1, userQuality * 0.4), gray: userGray },
      { scale: scaleAt(0.45), quality: 0.2, gray: true }, // Ultimate compression fallback
    ];

    let bestResult: Uint8Array = structuralResult;
    let closestDiff = Math.abs(structuralResult.byteLength - targetBytes);
    let targetAchieved = structuralResult.byteLength <= targetBytes;

    for (let idx = 0; idx < candidateConfigs.length; idx++) {
      const cfg = candidateConfigs[idx];
      const progressBase = 30 + Math.floor((idx / candidateConfigs.length) * 60);
      if (onProgress) onProgress(progressBase, `Attempting compression pass ${idx + 1} of ${candidateConfigs.length}...`);

      const trial = await rasterCompressPdf(buffer, cfg.scale, cfg.quality, cfg.gray);
      const trialLen = trial.byteLength;

      if (trialLen <= targetBytes) {
        // We found a version that meets the user's ceiling!
        bestResult = trial;
        targetAchieved = true;
        break;
      }

      // Track closest match
      const diff = Math.abs(trialLen - targetBytes);
      if (diff < closestDiff || bestResult === structuralResult) {
        closestDiff = diff;
        bestResult = trial;
      }
    }

    const reduction = Math.max(0, ((originalBytes - bestResult.byteLength) / originalBytes) * 100);
    const warning = !targetAchieved
      ? "Your PDF could not be reduced to the requested size without significant quality loss."
      : undefined;

    return {
      originalBytes,
      compressedBytes: bestResult.byteLength,
      reductionPercentage: parseFloat(reduction.toFixed(1)),
      pageCount,
      targetAchieved,
      targetBytes,
      warning,
      pdfBytes: bestResult,
    };
  }

  // Custom with specific manual sliders
  const manualQuality = options.quality ?? 0.7;
  const manualScale = options.dpi ? options.dpi / 96 : 1.2;
  const manualResult = await rasterCompressPdf(buffer, manualScale, manualQuality, !!options.grayscale, (p) => {
    if (onProgress) onProgress(30 + Math.round(p * 0.65), `Processing page raster ${p}%`);
  });

  const finalOutput = manualResult.byteLength < originalBytes ? manualResult : structuralResult;
  const reduction = Math.max(0, ((originalBytes - finalOutput.byteLength) / originalBytes) * 100);

  return {
    originalBytes,
    compressedBytes: finalOutput.byteLength,
    reductionPercentage: parseFloat(reduction.toFixed(1)),
    pageCount,
    pdfBytes: finalOutput,
  };
}
