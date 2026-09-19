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

  // pdf.js transfers the backing ArrayBuffer to its worker, which DETACHES it.
  // If the caller reuses the same buffer afterwards (e.g. the iterative
  // target-size compressor runs multiple passes over one file), the second
  // read throws "Cannot perform Construct on a detached ArrayBuffer".
  // Always hand pdf.js a private copy so the caller's buffer stays intact.
  const source = data instanceof Uint8Array ? data : new Uint8Array(data);
  const copy = source.slice();

  const loadingTask = pdfjs.getDocument({
    data: copy,
    cMapUrl: "https://unpkg.com/pdfjs-dist@4.10.38/cmaps/",
    cMapPacked: true,
    standardFontDataUrl: "https://unpkg.com/pdfjs-dist@4.10.38/standard_fonts/",
  });
  return await loadingTask.promise;
}
