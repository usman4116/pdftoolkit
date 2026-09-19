"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  LayoutGrid,
  Loader2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { loadPdfDocument } from "@/lib/pdf/pdfjs-init";
import { readFileAsArrayBuffer } from "@/lib/utils";

interface PdfPreviewProps {
  file: File | Uint8Array | null;
  className?: string;
  currentPageNumber?: number;
  onPageChange?: (page: number) => void;
  showThumbnails?: boolean;
}

export function PdfPreview({
  file,
  className = "",
  currentPageNumber,
  onPageChange,
  showThumbnails = true,
}: PdfPreviewProps) {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [activePage, setActivePage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [thumbnails, setThumbnails] = useState<{ pageNum: number; dataUrl: string }[]>([]);
  const [showSidebar, setShowSidebar] = useState<boolean>(showThumbnails);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);

  // Sync external active page if provided
  useEffect(() => {
    if (currentPageNumber && currentPageNumber !== activePage) {
      setActivePage(currentPageNumber);
    }
  }, [currentPageNumber, activePage]);

  // Load PDF document
  useEffect(() => {
    let isCancelled = false;

    async function loadPdf() {
      if (!file) {
        setPdfDoc(null);
        setTotalPages(0);
        setThumbnails([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        let buffer: ArrayBuffer;
        if (file instanceof Uint8Array) {
          buffer = file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength) as ArrayBuffer;
        } else {
          buffer = await readFileAsArrayBuffer(file);
        }

        const doc = await loadPdfDocument(buffer);
        if (isCancelled) return;

        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setActivePage(1);
        if (onPageChange) onPageChange(1);

        // Generate thumbnails progressively
        generateThumbnails(doc);
      } catch (err: any) {
        if (!isCancelled) {
          setError(err.message || "Failed to render PDF preview");
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [file, onPageChange]);

  // Progressive thumbnail generator
  const generateThumbnails = async (doc: any) => {
    const thumbs: { pageNum: number; dataUrl: string }[] = [];
    // Load up to first 25 pages to avoid memory pressure on large books
    const maxThumbs = Math.min(doc.numPages, 25);

    for (let i = 1; i <= maxThumbs; i++) {
      try {
        const page = await doc.getPage(i);
        const viewport = page.getViewport({ scale: 0.2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;
          thumbs.push({ pageNum: i, dataUrl: canvas.toDataURL("image/jpeg", 0.7) });
          setThumbnails([...thumbs]);
        }
      } catch {
        break;
      }
    }
  };

  // Render current page onto canvas
  const renderCurrentPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;

    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
    }

    try {
      const page = await pdfDoc.getPage(activePage);
      const viewport = page.getViewport({ scale, rotation });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      const renderContext = {
        canvasContext: ctx,
        viewport,
      };

      const renderTask = page.render(renderContext);
      renderTaskRef.current = renderTask;
      await renderTask.promise;
    } catch (err: any) {
      if (err.name !== "RenderingCancelledException") {
        console.error("PDF render error:", err);
      }
    }
  }, [pdfDoc, activePage, scale, rotation]);

  useEffect(() => {
    renderCurrentPage();
  }, [renderCurrentPage]);

  // Page Controls
  const goToPage = (num: number) => {
    const p = Math.max(1, Math.min(num, totalPages));
    setActivePage(p);
    if (onPageChange) onPageChange(p);
  };

  const zoomIn = () => setScale((s) => Math.min(s + 0.25, 3.0));
  const zoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5));
  const rotateClockwise = () => setRotation((r) => (r + 90) % 360);

  const fitToWidth = () => {
    if (!containerRef.current || !pdfDoc) return;
    pdfDoc.getPage(activePage).then((page: any) => {
      const unscaledViewport = page.getViewport({ scale: 1.0, rotation });
      const containerWidth = containerRef.current?.clientWidth || 600;
      const newScale = (containerWidth - 64) / unscaledViewport.width;
      setScale(Math.max(0.4, Math.min(newScale, 2.5)));
    });
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!file) {
    return (
      <div className={`flex min-h-[380px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-slate-50/50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/30 ${className}`}>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200/70 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
          <FileText className="h-6 w-6" />
        </div>
        <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400">
          No PDF file selected for preview
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Upload a document above to inspect pages and thumbnails
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-950 ${className}`}
    >
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
        {/* Left: Thumbnail toggle & Page indicator */}
        <div className="flex items-center gap-2">
          {showThumbnails && (
            <button
              type="button"
              onClick={() => setShowSidebar(!showSidebar)}
              className={`rounded-lg p-1.5 text-xs font-medium transition ${
                showSidebar
                  ? "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
              title="Toggle Thumbnails"
              aria-label="Toggle page thumbnails"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          )}

          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <button
              type="button"
              onClick={() => goToPage(activePage - 1)}
              disabled={activePage <= 1}
              className="rounded p-0.5 hover:bg-slate-200 disabled:opacity-40 dark:hover:bg-slate-700"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="font-semibold">{activePage}</span>
            <span className="text-slate-400">/</span>
            <span>{totalPages || 1}</span>
            <button
              type="button"
              onClick={() => goToPage(activePage + 1)}
              disabled={activePage >= totalPages}
              className="rounded p-0.5 hover:bg-slate-200 disabled:opacity-40 dark:hover:bg-slate-700"
              aria-label="Next page"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Center: Zoom and Fit */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={zoomOut}
            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="min-w-[44px] text-center text-xs font-semibold text-slate-600 dark:text-slate-300">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={zoomIn}
            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={fitToWidth}
            className="hidden rounded-lg px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100 sm:inline dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Fit Width
          </button>
        </div>

        {/* Right: Rotate & Fullscreen */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={rotateClockwise}
            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Rotate Preview"
            aria-label="Rotate preview"
          >
            <RotateCw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Fullscreen"
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Main Preview Area with Optional Thumbnails Sidebar */}
      <div className="relative flex h-[520px] w-full overflow-hidden">
        {/* Thumbnails Sidebar */}
        {showSidebar && thumbnails.length > 0 && (
          <aside className="h-full w-28 shrink-0 overflow-y-auto border-r border-slate-200 bg-white/70 p-2 space-y-2 dark:border-slate-800 dark:bg-slate-900/70 sm:w-36">
            {thumbnails.map((t) => (
              <button
                key={t.pageNum}
                type="button"
                onClick={() => goToPage(t.pageNum)}
                className={`relative w-full rounded-lg border-2 p-1 transition-all ${
                  t.pageNum === activePage
                    ? "border-red-600 shadow-md ring-2 ring-red-500/20"
                    : "border-slate-200 opacity-75 hover:opacity-100 dark:border-slate-800"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.dataUrl}
                  alt={`Page ${t.pageNum}`}
                  className="w-full rounded bg-white shadow-xs"
                />
                <span className="mt-1 block text-center text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                  {t.pageNum}
                </span>
              </button>
            ))}
          </aside>
        )}

        {/* Canvas Display Viewport */}
        <div className="relative flex flex-1 items-center justify-center overflow-auto p-4">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/70 backdrop-blur-xs dark:bg-slate-950/70">
              <Loader2 className="h-8 w-8 animate-spin text-red-600" />
              <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                Rendering PDF page...
              </p>
            </div>
          )}

          {error && (
            <div className="flex max-w-sm flex-col items-center justify-center rounded-2xl border border-rose-200 bg-white p-6 text-center shadow-lg dark:border-rose-900 dark:bg-slate-900">
              <AlertCircle className="h-8 w-8 text-rose-500" />
              <h4 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">Preview Error</h4>
              <p className="mt-1 text-xs text-slate-500">{error}</p>
            </div>
          )}

          <div className="overflow-visible rounded-lg bg-white shadow-xl dark:bg-slate-900">
            <canvas ref={canvasRef} className="block max-w-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
