let pdfjsLibInstance: any = null;

export async function getPdfJs() {
  if (typeof window === "undefined") {
    return null;
  }
  if (!pdfjsLibInstance) {
    const pdfjs = await import("pdfjs-dist");
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      // Use locally served worker file in /public/pdf.worker.min.mjs
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    }
    pdfjsLibInstance = pdfjs;
  }
  return pdfjsLibInstance;
}

export async function loadPdfDocument(data: ArrayBuffer | Uint8Array) {
  const pdfjs = await getPdfJs();
  if (!pdfjs) throw new Error("PDF.js can only run in the browser environment");
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(data),
    cMapUrl: "https://unpkg.com/pdfjs-dist@4.10.38/cmaps/",
    cMapPacked: true,
    standardFontDataUrl: "https://unpkg.com/pdfjs-dist@4.10.38/standard_fonts/",
  });
  return await loadingTask.promise;
}
