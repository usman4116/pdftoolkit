"use client";

import React, { useState } from "react";
import { FileImage, Download, ArrowUp, ArrowDown, Trash2, CheckCircle2, RefreshCw, Sparkles } from "lucide-react";
import { FileUploader } from "@/components/uploader/FileUploader";
import { PdfPreview } from "@/components/preview/PdfPreview";
import { imagesToPdf } from "@/lib/pdf/converter";
import { downloadBlob } from "@/lib/utils";
import { AdSlot } from "@/components/layout/AdSlot";
import { FaqSection } from "@/components/common/FaqSection";
import { SeoContent } from "@/components/common/SeoContent";
import { getToolByHref, TOOLS } from "@/lib/tools-data";
import confetti from "canvas-confetti";
import {
  generateWebApplicationJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo/metadata";

const tool = getToolByHref("/jpg-to-pdf")!;

export default function JpgToPdfPage() {
  const [images, setImages] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<"fit" | "a4" | "letter">("a4");
  const [margin, setMargin] = useState<number>(20);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);

  const moveUp = (idx: number) => {
    if (idx <= 0) return;
    const copy = [...images];
    const temp = copy[idx - 1];
    copy[idx - 1] = copy[idx];
    copy[idx] = temp;
    setImages(copy);
  };

  const moveDown = (idx: number) => {
    if (idx >= images.length - 1) return;
    const copy = [...images];
    const temp = copy[idx + 1];
    copy[idx + 1] = copy[idx];
    copy[idx] = temp;
    setImages(copy);
  };

  const removeImg = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCreatePdf = async () => {
    if (images.length === 0) return;

    setIsConverting(true);
    try {
      const bytes = await imagesToPdf(images, pageSize, margin);
      setPdfBytes(bytes);
      confetti({ particleCount: 50, spread: 65 });
    } catch (err: any) {
      alert(`Conversion error: ${err.message || "Failed to generate PDF"}`);
    } finally {
      setIsConverting(false);
    }
  };

  const downloadPdf = () => {
    if (!pdfBytes) return;
    downloadBlob(pdfBytes, "images_document.pdf");
  };

  const resetAll = () => {
    setImages([]);
    setPdfBytes(null);
  };

  const appSchema = generateWebApplicationJsonLd(tool.name, tool.seoDescription, tool.href);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "JPG to PDF", item: "/jpg-to-pdf" },
  ]);

  const relatedTools = TOOLS.filter((t) =>
    ["pdf-to-jpg", "pdf-compressor", "pdf-merge"].includes(t.id)
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

      <AdSlot slotId="jpg-to-pdf-top-banner" format="horizontal" />

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
          <FileImage className="h-3.5 w-3.5" />
          <span>Photos to Document</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Convert JPG to PDF Online
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Combine photos, receipts, and images into a single standardized PDF with customizable page sizes and margins.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Controls & Uploader */}
        <div className="space-y-6 lg:col-span-6">
          <FileUploader
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            multiple={true}
            maxSizeMB={tool.maxFileSizeMB}
            onFilesSelected={(files) => {
              setImages(files);
              setPdfBytes(null);
            }}
            isProcessing={isConverting}
            title="Upload JPG, PNG, or WEBP photos"
            subtitle="Upload multiple images to combine into one PDF"
          />

          {images.length > 0 && !pdfBytes && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                PDF Layout Settings
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Page Size
                  </label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value as any)}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="a4">A4 (Standard Paper)</option>
                    <option value="letter">US Letter</option>
                    <option value="fit">Fit to Image Dimensions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Margin
                  </label>
                  <select
                    value={margin}
                    onChange={(e) => setMargin(parseInt(e.target.value, 10))}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="0">No Margin (Full Bleed)</option>
                    <option value="20">Small (20 pt)</option>
                    <option value="40">Standard (40 pt)</option>
                  </select>
                </div>
              </div>

              {/* Arrange Images List */}
              <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Image Sequence ({images.length} photos)
                </span>
                <div className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-1">
                  {images.map((img, idx) => (
                    <div
                      key={`${img.name}-${idx}`}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-800/40"
                    >
                      <span className="truncate text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {idx + 1}. {img.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveUp(idx)}
                          disabled={idx === 0}
                          className="rounded p-1 text-slate-400 hover:bg-slate-200 disabled:opacity-30"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveDown(idx)}
                          disabled={idx === images.length - 1}
                          className="rounded p-1 text-slate-400 hover:bg-slate-200 disabled:opacity-30"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImg(idx)}
                          className="rounded p-1 text-rose-500 hover:bg-rose-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCreatePdf}
                disabled={isConverting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isConverting ? "Generating PDF..." : "Create PDF Document"}</span>
              </button>
            </div>
          )}

          {pdfBytes && (
            <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-xl dark:border-emerald-950 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    PDF Ready for Download!
                  </h3>
                  <p className="text-xs text-slate-500">
                    Compiled {images.length} photos into a clean document
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={downloadPdf}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Created PDF</span>
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 px-4 py-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Create Another</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Preview of Output */}
        <div className="lg:col-span-6">
          <div className="sticky top-24">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              {pdfBytes ? "Generated PDF Preview" : "PDF Preview Panel"}
            </h2>
            <PdfPreview file={pdfBytes} showThumbnails={true} />
          </div>
        </div>
      </div>

      <AdSlot slotId="jpg-to-pdf-below-tool" format="horizontal" />
      <SeoContent tool={tool} relatedTools={relatedTools} />
      <FaqSection faqs={tool.faqs} />
    </div>
  );
}
