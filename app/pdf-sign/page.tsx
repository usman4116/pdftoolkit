"use client";

import React, { useState, useRef, MouseEvent } from "react";
import {
  FileSignature,
  Download,
  Pen,
  Type,
  Upload,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { FileUploader } from "@/components/uploader/FileUploader";
import { PdfPreview } from "@/components/preview/PdfPreview";
import { exportEditedPdf } from "@/lib/pdf/editor";
import { downloadBlob, readFileAsArrayBuffer } from "@/lib/utils";
import { AdSlot } from "@/components/layout/AdSlot";
import { FaqSection } from "@/components/common/FaqSection";
import { SeoContent } from "@/components/common/SeoContent";
import { getToolByHref, TOOLS } from "@/lib/tools-data";
import confetti from "canvas-confetti";
import {
  generateWebApplicationJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo/metadata";

const tool = getToolByHref("/pdf-sign")!;

export default function PdfSignPage() {
  const [file, setFile] = useState<File | null>(null);
  const [signMethod, setSignMethod] = useState<"draw" | "type" | "upload">("draw");
  const [typedName, setTypedName] = useState<string>("");
  const [targetPage, setTargetPage] = useState<number>(1);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [signedPdfBytes, setSignedPdfBytes] = useState<Uint8Array | null>(null);

  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageUploadRef = useRef<HTMLInputElement>(null);

  // Draw signature pad handlers
  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    setIsSigning(true);
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isSigning || !sigCanvasRef.current) return;
    const canvas = sigCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handleMouseUp = () => {
    setIsSigning(false);
    if (sigCanvasRef.current) {
      setSignatureDataUrl(sigCanvasRef.current.toDataURL("image/png"));
    }
  };

  const clearPad = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDataUrl(null);
  };

  // Type signature generator
  const generateTypedSignature = (text: string) => {
    setTypedName(text);
    if (!text.trim()) {
      setSignatureDataUrl(null);
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 120;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.font = "italic 42px 'Brush Script MT', 'Segoe Script', cursive, sans-serif";
      ctx.fillStyle = "#1e293b";
      ctx.fillText(text, 20, 75);
      setSignatureDataUrl(canvas.toDataURL("image/png"));
    }
  };

  // Upload signature image
  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (!img) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSignatureDataUrl(reader.result as string);
    };
    reader.readAsDataURL(img);
  };

  // Stamp and export
  const handleSignPdf = async () => {
    if (!file || !signatureDataUrl) {
      alert("Please create or upload your signature first.");
      return;
    }

    setIsExporting(true);
    try {
      // Clamp the requested page to the document range and size/position the
      // signature relative to the real page height so it never lands off-page.
      const buffer = await readFileAsArrayBuffer(file);
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pageCount = doc.getPageCount();
      const clampedPage = Math.min(Math.max(1, targetPage), pageCount);
      const { width, height } = doc.getPage(clampedPage - 1).getSize();

      const sigWidth = Math.min(160, width * 0.35);
      const sigHeight = sigWidth * 0.44;
      // exportEditedPdf treats y as a top-origin canvas coordinate, so place
      // the signature near the bottom of the page.
      const annotations = [
        {
          id: `sig-${Date.now()}`,
          type: "signature" as const,
          pageNum: clampedPage,
          x: Math.max(40, width * 0.1),
          y: height - sigHeight - Math.max(40, height * 0.08),
          width: sigWidth,
          height: sigHeight,
          imageDataUrl: signatureDataUrl,
        },
      ];

      if (clampedPage !== targetPage) setTargetPage(clampedPage);

      const bytes = await exportEditedPdf(file, annotations);
      setSignedPdfBytes(bytes);
      confetti({ particleCount: 50, spread: 65 });
    } catch (err: any) {
      alert(`Signing error: ${err.message || "Failed to stamp signature"}`);
    } finally {
      setIsExporting(false);
    }
  };

  const downloadSigned = () => {
    if (!signedPdfBytes) return;
    const baseName = file?.name.replace(/\.pdf$/i, "") || "document";
    downloadBlob(signedPdfBytes, `${baseName}_signed.pdf`);
  };

  const resetAll = () => {
    setFile(null);
    setSignedPdfBytes(null);
    setSignatureDataUrl(null);
  };

  const appSchema = generateWebApplicationJsonLd(tool.name, tool.seoDescription, tool.href);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Sign PDF", item: "/pdf-sign" },
  ]);

  const relatedTools = TOOLS.filter((t) =>
    ["pdf-editor", "pdf-protect", "pdf-watermark"].includes(t.id)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <AdSlot slotId="sign-top-banner" format="horizontal" />

      {/* Title */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          <FileSignature className="h-3.5 w-3.5" />
          <span>Electronic Document Signing</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Sign PDF Online for Free
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Draw, type, or upload your signature and stamp it onto contracts, receipts, and everyday PDF forms.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-6">
          <FileUploader
            accept=".pdf,application/pdf"
            maxSizeMB={tool.maxFileSizeMB}
            onFilesSelected={(files) => {
              setFile(files[0] || null);
              setSignedPdfBytes(null);
            }}
            isProcessing={isExporting}
            title="Upload PDF document to sign"
            subtitle="Draw, type, or upload signature • 100% private in-browser"
          />

          {file && !signedPdfBytes && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Create Your Signature
              </h3>

              {/* Methods Tabs */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSignMethod("draw")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl p-2.5 text-xs font-bold transition ${
                    signMethod === "draw"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                  }`}
                >
                  <Pen className="h-3.5 w-3.5" />
                  <span>Draw</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSignMethod("type")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl p-2.5 text-xs font-bold transition ${
                    signMethod === "type"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                  }`}
                >
                  <Type className="h-3.5 w-3.5" />
                  <span>Type</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSignMethod("upload")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl p-2.5 text-xs font-bold transition ${
                    signMethod === "upload"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                  }`}
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload</span>
                </button>
              </div>

              {/* Method Content */}
              <div className="mt-4">
                {signMethod === "draw" && (
                  <div>
                    <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                      <canvas
                        ref={sigCanvasRef}
                        width={380}
                        height={140}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        className="w-full cursor-crosshair rounded-2xl"
                      />
                    </div>
                    <div className="mt-2 text-right">
                      <button
                        type="button"
                        onClick={clearPad}
                        className="text-xs font-semibold text-slate-500 hover:text-rose-600"
                      >
                        Clear Pad
                      </button>
                    </div>
                  </div>
                )}

                {signMethod === "type" && (
                  <div>
                    <input
                      type="text"
                      value={typedName}
                      onChange={(e) => generateTypedSignature(e.target.value)}
                      placeholder="Type your full name..."
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    {signatureDataUrl && (
                      <div className="mt-3 flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={signatureDataUrl} alt="Signature Preview" className="h-16 object-contain" />
                      </div>
                    )}
                  </div>
                )}

                {signMethod === "upload" && (
                  <div>
                    <input
                      ref={imageUploadRef}
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={handleUploadImage}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => imageUploadRef.current?.click()}
                      className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-6 hover:border-indigo-500 dark:border-slate-700"
                    >
                      <Upload className="h-6 w-6 text-slate-400" />
                      <span className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                        Select Signature Image (PNG/JPG)
                      </span>
                    </button>
                    {signatureDataUrl && (
                      <div className="mt-3 flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={signatureDataUrl} alt="Uploaded Signature" className="h-16 object-contain" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Target Page Select */}
              <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Place Signature on Page
                </label>
                <input
                  type="number"
                  min="1"
                  value={targetPage}
                  onChange={(e) => setTargetPage(parseInt(e.target.value, 10) || 1)}
                  className="mt-1.5 w-28 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Legal Disclaimer Box */}
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                <span>
                  Notice: This tool provides standard electronic visual signatures for agreements and forms. It does not replace cryptographically certified digital signatures (eIDAS/PKI hardware tokens).
                </span>
              </div>

              <button
                type="button"
                onClick={handleSignPdf}
                disabled={!signatureDataUrl || isExporting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isExporting ? "Stamping..." : "Sign Document"}</span>
              </button>
            </div>
          )}

          {signedPdfBytes && (
            <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-xl dark:border-emerald-950 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Document Signed!
                  </h3>
                  <p className="text-xs text-slate-500">
                    Signature stamped onto page {targetPage}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={downloadSigned}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Signed PDF</span>
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 px-4 py-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Sign Another</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Preview */}
        <div className="lg:col-span-6">
          <div className="sticky top-24">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              {signedPdfBytes ? "Signed PDF Preview" : "Document Preview"}
            </h2>
            <PdfPreview file={signedPdfBytes || file} showThumbnails={true} />
          </div>
        </div>
      </div>

      <AdSlot slotId="sign-below-tool" format="horizontal" />
      <SeoContent tool={tool} relatedTools={relatedTools} />
      <FaqSection faqs={tool.faqs} />
    </div>
  );
}
