"use client";

import React, { useState } from "react";
import { Crop, Download, CheckCircle2, RefreshCw, Sparkles } from "lucide-react";
import { FileUploader } from "@/components/uploader/FileUploader";
import { PdfPreview } from "@/components/preview/PdfPreview";
import { cropPdfByInsets } from "@/lib/pdf/merge-split";
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

const tool = getToolByHref("/pdf-crop")!;

export default function PdfCropPage() {
  const [file, setFile] = useState<File | null>(null);
  const [cropInset, setCropInset] = useState<{ top: number; bottom: number; left: number; right: number }>({
    top: 40,
    bottom: 40,
    left: 40,
    right: 40,
  });
  const [pageScope, setPageScope] = useState<"all" | "custom">("all");
  const [customPages, setCustomPages] = useState<string>("1");
  const [isCropping, setIsCropping] = useState<boolean>(false);
  const [croppedBytes, setCroppedBytes] = useState<Uint8Array | null>(null);

  const handleCrop = async () => {
    if (!file) return;

    setIsCropping(true);
    try {
      let targetPages: number[] | undefined = undefined;
      if (pageScope === "custom" && customPages) {
        targetPages = customPages
          .split(",")
          .map((s) => parseInt(s.trim(), 10))
          .filter((n) => !isNaN(n));
      }

      const bytes = await cropPdfByInsets(file, cropInset, targetPages);
      setCroppedBytes(bytes);
      confetti({ particleCount: 50, spread: 65 });
    } catch (err: any) {
      alert(`Crop error: ${err.message || "Failed to crop PDF"}`);
    } finally {
      setIsCropping(false);
    }
  };

  const downloadCropped = () => {
    if (!croppedBytes) return;
    const baseName = file?.name.replace(/\.pdf$/i, "") || "document";
    downloadBlob(croppedBytes, `${baseName}_cropped.pdf`);
  };

  const resetAll = () => {
    setFile(null);
    setCroppedBytes(null);
  };

  const appSchema = generateWebApplicationJsonLd(tool.name, tool.seoDescription, tool.href);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Crop PDF", item: "/pdf-crop" },
  ]);

  const relatedTools = TOOLS.filter((t) =>
    ["pdf-pages", "pdf-compressor", "pdf-editor"].includes(t.id)
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

      <AdSlot slotId="crop-top-banner" format="horizontal" />

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          <Crop className="h-3.5 w-3.5" />
          <span>Margin Trimming & Crop Box</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Crop PDF Online — Trim Margins
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Trim excess white margins or crop unwanted header/footer regions from all pages or custom page selections.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-6">
          <FileUploader
            accept=".pdf,application/pdf"
            maxSizeMB={tool.maxFileSizeMB}
            onFilesSelected={(files) => {
              setFile(files[0] || null);
              setCroppedBytes(null);
            }}
            isProcessing={isCropping}
            title="Upload PDF document to crop"
            subtitle="Trim margins accurately • Up to 80 MB"
          />

          {file && !croppedBytes && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Margin Trimming Controls (points)
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Top Margin Trim
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={cropInset.top}
                    onChange={(e) =>
                      setCropInset({ ...cropInset, top: parseInt(e.target.value, 10) || 0 })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-red-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Bottom Margin Trim
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={cropInset.bottom}
                    onChange={(e) =>
                      setCropInset({ ...cropInset, bottom: parseInt(e.target.value, 10) || 0 })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-red-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Left Margin Trim
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={cropInset.left}
                    onChange={(e) =>
                      setCropInset({ ...cropInset, left: parseInt(e.target.value, 10) || 0 })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-red-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Right Margin Trim
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={cropInset.right}
                    onChange={(e) =>
                      setCropInset({ ...cropInset, right: parseInt(e.target.value, 10) || 0 })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-red-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Page Scope */}
              <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Pages to Crop
                </label>
                <div className="mt-2 flex gap-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={pageScope === "all"}
                      onChange={() => setPageScope("all")}
                      className="text-red-600"
                    />
                    <span>All Pages</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={pageScope === "custom"}
                      onChange={() => setPageScope("custom")}
                      className="text-red-600"
                    />
                    <span>Specific Pages</span>
                  </label>
                </div>

                {pageScope === "custom" && (
                  <input
                    type="text"
                    value={customPages}
                    onChange={(e) => setCustomPages(e.target.value)}
                    placeholder="e.g. 1, 3, 5"
                    className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-red-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                )}
              </div>

              <button
                type="button"
                onClick={handleCrop}
                disabled={isCropping}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 disabled:opacity-50"
              >
                <Crop className="h-4 w-4" />
                <span>{isCropping ? "Cropping..." : "Crop PDF Document"}</span>
              </button>
            </div>
          )}

          {croppedBytes && (
            <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-xl dark:border-emerald-950 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    PDF Margins Cropped!
                  </h3>
                  <p className="text-xs text-slate-500">
                    Viewport boundaries adjusted successfully
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={downloadCropped}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-red-700"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Cropped PDF</span>
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 px-4 py-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Crop Another</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Preview */}
        <div className="lg:col-span-6">
          <div className="sticky top-24">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              {croppedBytes ? "Cropped Output Preview" : "Document Preview"}
            </h2>
            <PdfPreview file={croppedBytes || file} showThumbnails={true} />
          </div>
        </div>
      </div>

      <AdSlot slotId="crop-below-tool" format="horizontal" />
      <SeoContent tool={tool} relatedTools={relatedTools} />
      <FaqSection faqs={tool.faqs} />
    </div>
  );
}
