"use client";

import React, { useState, useRef, useEffect, MouseEvent } from "react";
import {
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Plus,
  PenTool,
  Upload,
} from "lucide-react";
import { FileUploader } from "@/components/uploader/FileUploader";
import { EditorToolbar, EditorToolMode } from "@/components/editor/EditorToolbar";
import { EditorAnnotation, exportEditedPdf } from "@/lib/pdf/editor";
import { loadPdfDocument } from "@/lib/pdf/pdfjs-init";
import { readFileAsArrayBuffer, downloadBlob } from "@/lib/utils";
import { AdSlot } from "@/components/layout/AdSlot";
import { FaqSection } from "@/components/common/FaqSection";
import { SeoContent } from "@/components/common/SeoContent";
import { getToolByHref, TOOLS } from "@/lib/tools-data";
import confetti from "canvas-confetti";
import {
  generateWebApplicationJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo/metadata";

const tool = getToolByHref("/pdf-editor")!;

// Scale at which pages are rendered and annotation coordinates are captured.
// Must be passed to exportEditedPdf so burned-in annotations line up.
const RENDER_SCALE = 1.25;

export default function PdfEditorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [activePage, setActivePage] = useState<number>(1);
  const [mode, setMode] = useState<EditorToolMode>("select");
  const [color, setColor] = useState<string>("#4f46e5");
  const [fontSize, setFontSize] = useState<number>(16);

  const [annotations, setAnnotations] = useState<EditorAnnotation[]>([]);
  const [deletedPages, setDeletedPages] = useState<number[]>([]);
  const [rotatedPages, setRotatedPages] = useState<{ [p: number]: number }>({});
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Freehand drawing state
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([]);

  // Signature Modal
  const [showSignatureModal, setShowSignatureModal] = useState<boolean>(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isSigning, setIsSigning] = useState<boolean>(false);

  // Hidden image input
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Canvas refs
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [pageViewport, setPageViewport] = useState<any>(null);

  // Load PDF when file is selected
  useEffect(() => {
    async function loadPdf() {
      if (!file) {
        setPdfDoc(null);
        setTotalPages(0);
        return;
      }

      const buffer = await readFileAsArrayBuffer(file);
      const doc = await loadPdfDocument(buffer);
      setPdfDoc(doc);
      setTotalPages(doc.numPages);
      setActivePage(1);
      setAnnotations([]);
      setDeletedPages([]);
      setRotatedPages({});
    }

    loadPdf();
  }, [file]);

  // Render current PDF page
  useEffect(() => {
    async function renderPage() {
      if (!pdfDoc || !pdfCanvasRef.current) return;

      const page = await pdfDoc.getPage(activePage);
      // pdf.js pages expose intrinsic rotation as the numeric `.rotate` property
      // (not a getRotation() method — that's pdf-lib's API).
      const currentRot = ((page.rotate as number) || 0) + (rotatedPages[activePage] || 0);
      const viewport = page.getViewport({ scale: RENDER_SCALE, rotation: currentRot });
      setPageViewport(viewport);

      const canvas = pdfCanvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      await page.render({ canvasContext: ctx, viewport }).promise;

      // Also resize overlay canvas
      if (overlayCanvasRef.current) {
        overlayCanvasRef.current.width = canvas.width;
        overlayCanvasRef.current.height = canvas.height;
        drawOverlayAnnotations();
      }
    }

    renderPage();
  }, [pdfDoc, activePage, rotatedPages]);

  // Redraw annotations on overlay canvas
  const drawOverlayAnnotations = () => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const pageAnns = annotations.filter((a) => a.pageNum === activePage);

    pageAnns.forEach((ann) => {
      ctx.strokeStyle = ann.color || "#000000";
      ctx.fillStyle = ann.color || "#000000";
      ctx.lineWidth = ann.strokeWidth || 2;
      ctx.globalAlpha = ann.opacity ?? 1.0;

      if (ann.type === "text" && ann.text) {
        ctx.font = `${ann.fontSize || 16}px system-ui, sans-serif`;
        ctx.fillText(ann.text, ann.x, ann.y);
      } else if (ann.type === "highlight") {
        ctx.fillStyle = "rgba(254, 240, 138, 0.4)";
        ctx.fillRect(ann.x, ann.y, ann.width || 80, ann.height || 24);
      } else if (ann.type === "rectangle") {
        ctx.strokeRect(ann.x, ann.y, ann.width || 80, ann.height || 50);
      } else if (ann.type === "circle") {
        ctx.beginPath();
        const rx = (ann.width || 60) / 2;
        const ry = (ann.height || 60) / 2;
        ctx.ellipse(ann.x + rx, ann.y + ry, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (ann.type === "arrow") {
        ctx.beginPath();
        ctx.moveTo(ann.x, ann.y);
        ctx.lineTo(ann.x + (ann.width || 80), ann.y + (ann.height || 60));
        ctx.stroke();
      } else if (ann.type === "draw" && ann.points && ann.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(ann.points[0].x, ann.points[0].y);
        for (let i = 1; i < ann.points.length; i++) {
          ctx.lineTo(ann.points[i].x, ann.points[i].y);
        }
        ctx.stroke();
      } else if ((ann.type === "signature" || ann.type === "image") && ann.imageDataUrl) {
        const img = new Image();
        img.src = ann.imageDataUrl;
        if (img.complete) {
          ctx.drawImage(img, ann.x, ann.y, ann.width || 120, ann.height || 60);
        } else {
          img.onload = () => {
            ctx.drawImage(img, ann.x, ann.y, ann.width || 120, ann.height || 60);
          };
        }
      }
    });

    ctx.globalAlpha = 1.0;
  };

  useEffect(() => {
    drawOverlayAnnotations();
  }, [annotations, activePage]);

  // Handle Canvas Clicking / Interacting
  const handleOverlayMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!overlayCanvasRef.current) return;
    const rect = overlayCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (mode === "text") {
      const text = prompt("Enter text to insert:");
      if (text) {
        const newAnn: EditorAnnotation = {
          id: `ann-${Date.now()}`,
          type: "text",
          pageNum: activePage,
          x,
          y,
          text,
          fontSize,
          color,
        };
        setAnnotations((prev) => [...prev, newAnn]);
      }
    } else if (mode === "draw") {
      setIsDrawing(true);
      setCurrentStroke([{ x, y }]);
    } else if (mode === "highlight") {
      const newAnn: EditorAnnotation = {
        id: `ann-${Date.now()}`,
        type: "highlight",
        pageNum: activePage,
        x,
        y,
        width: 120,
        height: 24,
      };
      setAnnotations((prev) => [...prev, newAnn]);
    } else if (mode === "rectangle") {
      const newAnn: EditorAnnotation = {
        id: `ann-${Date.now()}`,
        type: "rectangle",
        pageNum: activePage,
        x,
        y,
        width: 100,
        height: 60,
        color,
        strokeWidth: 2,
      };
      setAnnotations((prev) => [...prev, newAnn]);
    } else if (mode === "circle") {
      const newAnn: EditorAnnotation = {
        id: `ann-${Date.now()}`,
        type: "circle",
        pageNum: activePage,
        x,
        y,
        width: 80,
        height: 80,
        color,
        strokeWidth: 2,
      };
      setAnnotations((prev) => [...prev, newAnn]);
    } else if (mode === "arrow") {
      const newAnn: EditorAnnotation = {
        id: `ann-${Date.now()}`,
        type: "arrow",
        pageNum: activePage,
        x,
        y,
        width: 80,
        height: 50,
        color,
        strokeWidth: 2,
      };
      setAnnotations((prev) => [...prev, newAnn]);
    } else if (mode === "signature") {
      if (signatureDataUrl) {
        const newAnn: EditorAnnotation = {
          id: `ann-${Date.now()}`,
          type: "signature",
          pageNum: activePage,
          x,
          y,
          width: 120,
          height: 60,
          imageDataUrl: signatureDataUrl,
        };
        setAnnotations((prev) => [...prev, newAnn]);
      } else {
        setShowSignatureModal(true);
      }
    } else if (mode === "image") {
      imageInputRef.current?.click();
    }
  };

  const handleOverlayMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || mode !== "draw" || !overlayCanvasRef.current) return;
    const rect = overlayCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentStroke((prev) => [...prev, { x, y }]);

    // Draw live stroke
    const canvas = overlayCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (currentStroke.length > 0) {
      const last = currentStroke[currentStroke.length - 1];
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleOverlayMouseUp = () => {
    if (isDrawing && mode === "draw" && currentStroke.length > 1) {
      const newAnn: EditorAnnotation = {
        id: `ann-${Date.now()}`,
        type: "draw",
        pageNum: activePage,
        x: 0,
        y: 0,
        points: currentStroke,
        color,
        strokeWidth: 3,
      };
      setAnnotations((prev) => [...prev, newAnn]);
    }
    setIsDrawing(false);
    setCurrentStroke([]);
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.[0];
    if (!imgFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const newAnn: EditorAnnotation = {
        id: `ann-${Date.now()}`,
        type: "image",
        pageNum: activePage,
        x: 100,
        y: 100,
        width: 140,
        height: 90,
        imageDataUrl: dataUrl,
      };
      setAnnotations((prev) => [...prev, newAnn]);
    };
    reader.readAsDataURL(imgFile);
  };

  // Signature Pad Canvas Logic
  const handleSigMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    setIsSigning(true);
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleSigMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isSigning || !sigCanvasRef.current) return;
    const canvas = sigCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handleSigMouseUp = () => {
    setIsSigning(false);
  };

  const clearSignaturePad = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    setSignatureDataUrl(url);
    setShowSignatureModal(false);

    // Place signature onto center of current page
    const newAnn: EditorAnnotation = {
      id: `ann-${Date.now()}`,
      type: "signature",
      pageNum: activePage,
      x: 100,
      y: 200,
      width: 140,
      height: 60,
      imageDataUrl: url,
    };
    setAnnotations((prev) => [...prev, newAnn]);
  };

  // Undo annotation
  const undoLastAnnotation = () => {
    setAnnotations((prev) => prev.slice(0, prev.length - 1));
  };

  // Rotate current page
  const rotatePage = () => {
    setRotatedPages((prev) => ({
      ...prev,
      [activePage]: ((prev[activePage] || 0) + 90) % 360,
    }));
  };

  // Delete current page
  const deletePage = () => {
    if (totalPages <= 1) {
      alert("Cannot delete the only page in the document.");
      return;
    }
    if (confirm(`Delete page ${activePage}?`)) {
      setDeletedPages((prev) => [...prev, activePage]);
      setActivePage((prev) => (prev > 1 ? prev - 1 : 1));
    }
  };

  // Export Edited PDF
  const handleExport = async () => {
    if (!file) return;

    setIsExporting(true);
    try {
      const pdfBytes = await exportEditedPdf(
        file,
        annotations,
        deletedPages,
        rotatedPages,
        RENDER_SCALE
      );
      const baseName = file.name.replace(/\.pdf$/i, "");
      downloadBlob(pdfBytes, `${baseName}_edited.pdf`);
      confetti({ particleCount: 50, spread: 60 });
    } catch (err: any) {
      alert(`Export error: ${err.message || "Failed to generate PDF"}`);
    } finally {
      setIsExporting(false);
    }
  };

  const appSchema = generateWebApplicationJsonLd(tool.name, tool.seoDescription, tool.href);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "PDF Editor", item: "/pdf-editor" },
  ]);

  const relatedTools = TOOLS.filter((t) =>
    ["pdf-compressor", "pdf-sign", "pdf-pages"].includes(t.id)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <AdSlot slotId="editor-top-banner" format="horizontal" />

      {/* Page Title */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950 dark:text-violet-300">
          <PenTool className="h-3.5 w-3.5" />
          <span>Full Browser PDF Annotator</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Free Online PDF Editor
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Add text, highlight passages, draw shapes, insert images, and sign documents directly in your browser.
        </p>
      </div>

      {/* Hidden image input for inserting images */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg"
        onChange={handleImageUpload}
        className="hidden"
      />

      {!file ? (
        /* Upload Area when no PDF loaded */
        <div className="mx-auto mt-10 max-w-2xl">
          <FileUploader
            accept=".pdf,application/pdf"
            maxSizeMB={tool.maxFileSizeMB}
            onFilesSelected={(files) => setFile(files[0] || null)}
            title="Upload PDF to start editing"
            subtitle="Secure client-side document editor • Up to 80 MB"
          />
        </div>
      ) : (
        /* PDF Editor Workspace */
        <div className="mt-8 flex flex-col gap-4">
          {/* Top Toolbar */}
          <EditorToolbar
            currentMode={mode}
            onSelectMode={setMode}
            currentColor={color}
            onColorChange={setColor}
            currentFontSize={fontSize}
            onFontSizeChange={setFontSize}
            onUndo={undoLastAnnotation}
            canUndo={annotations.length > 0}
            onRotatePage={rotatePage}
            onDeletePage={deletePage}
            onExport={handleExport}
            isExporting={isExporting}
          />

          {/* Main Work Area */}
          <div className="flex h-[680px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
            {/* Left Page Thumbnails Sidebar */}
            <aside className="w-28 shrink-0 overflow-y-auto border-r border-slate-200 bg-white/70 p-2 space-y-2 dark:border-slate-800 dark:bg-slate-900/70 sm:w-36">
              <div className="flex items-center justify-between px-1 pb-1 text-[11px] font-bold text-slate-400 uppercase">
                <span>Pages</span>
                <span>{totalPages}</span>
              </div>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => !deletedPages.includes(p))
                .map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setActivePage(p)}
                    className={`relative w-full rounded-xl border-2 p-2 text-center transition ${
                      p === activePage
                        ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40"
                        : "border-slate-200 bg-white opacity-80 hover:opacity-100 dark:border-slate-800 dark:bg-slate-900"
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Page {p}
                    </span>
                    {rotatedPages[p] ? (
                      <span className="mt-0.5 block text-[9px] text-indigo-500">
                        ({rotatedPages[p]}°)
                      </span>
                    ) : null}
                  </button>
                ))}
            </aside>

            {/* Center Canvas Area */}
            <div className="relative flex flex-1 items-center justify-center overflow-auto p-6">
              <div className="relative rounded-lg bg-white shadow-2xl dark:bg-slate-900">
                {/* PDF base layer */}
                <canvas ref={pdfCanvasRef} className="block" />

                {/* Interactive drawing and annotation layer */}
                <canvas
                  ref={overlayCanvasRef}
                  onMouseDown={handleOverlayMouseDown}
                  onMouseMove={handleOverlayMouseMove}
                  onMouseUp={handleOverlayMouseUp}
                  className={`absolute inset-0 z-10 ${
                    mode === "text"
                      ? "cursor-text"
                      : mode === "draw" || mode === "highlight"
                      ? "cursor-crosshair"
                      : mode === "select"
                      ? "cursor-default"
                      : "cursor-pointer"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Navigation & Status Footer */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActivePage((p) => Math.max(1, p - 1))}
                disabled={activePage <= 1}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 font-semibold hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-3 w-3" /> Prev
              </button>
              <span>
                Page {activePage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setActivePage((p) => Math.min(totalPages, p + 1))}
                disabled={activePage >= totalPages}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 font-semibold hover:bg-slate-50 disabled:opacity-40"
              >
                Next <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFile(null)}
                className="font-semibold text-slate-500 hover:text-rose-600"
              >
                Close File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signature Creation Modal */}
      {showSignatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Create Your Signature
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Draw your signature in the box below using your mouse or finger
            </p>

            <div className="mt-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
              <canvas
                ref={sigCanvasRef}
                width={380}
                height={160}
                onMouseDown={handleSigMouseDown}
                onMouseMove={handleSigMouseMove}
                onMouseUp={handleSigMouseUp}
                className="cursor-crosshair w-full rounded-2xl"
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={clearSignaturePad}
                className="text-xs font-semibold text-slate-500 hover:text-rose-600"
              >
                Clear Pad
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSignatureModal(false)}
                  className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveSignature}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                >
                  Use Signature
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Safe AdSlot below editor (never overlapping) */}
      <AdSlot slotId="editor-below-tool" format="horizontal" />

      {/* SEO Explanatory Content & FAQs */}
      <SeoContent tool={tool} relatedTools={relatedTools} />
      <FaqSection faqs={tool.faqs} />
    </div>
  );
}
