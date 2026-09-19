"use client";

import React, { useState } from "react";
import { RotateCw, RotateCcw, Download, CheckCircle2, RefreshCw } from "lucide-react";
import { FileUploader } from "@/components/uploader/FileUploader";
import { PdfPreview } from "@/components/preview/PdfPreview";
import { rotatePdfPages } from "@/lib/pdf/merge-split";
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

const tool = getToolByHref("/pdf-rotate")!;

export default function PdfRotatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [rotationAngle, setRotationAngle] = useState<90 | 180 | 270>(90);
  const [pageScope, setPageScope] = useState<"all" | "custom">("all");
  const [customPages, setCustomPages] = useState<string>("1");
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [rotatedPdfBytes, setRotatedPdfBytes] = useState<Uint8Array | null>(null);

  const handleRotate = async () => {
    if (!file) return;

    setIsRotating(true);
    try {
      let targetPages: number[] | undefined = undefined;
      if (pageScope === "custom" && customPages) {
        targetPages = customPages
          .split(",")
          .map((s) => parseInt(s.trim(), 10))
          .filter((n) => !isNaN(n));
      }

      const bytes = await rotatePdfPages(file, rotationAngle, targetPages);
      setRotatedPdfBytes(bytes);
      confetti({ particleCount: 50, spread: 65 });
    } catch (err: any) {
      alert(`Rotate error: ${err.message || "Failed to rotate pages"}`);
    } finally {
      setIsRotating(false);
    }
  };

  const downloadRotated = () => {
    if (!rotatedPdfBytes) return;
    const baseName = file?.name.replace(/\.pdf$/i, "") || "document";
    downloadBlob(rotatedPdfBytes, `${baseName}_rotated.pdf`);
  };

  const resetAll = () => {
    setFile(null);
    setRotatedPdfBytes(null);
  };

  const appSchema = generateWebApplicationJsonLd(tool.name, tool.seoDescription, tool.href);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Rotate PDF", item: "/pdf-rotate" },
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

      <AdSlot slotId="rotate-top-banner" format="horizontal" />

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
          <RotateCw className="h-3.5 w-3.5" />
          <span>Permanent Orientation Correction</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Rotate PDF Pages Online
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Rotate upside-down or sideways pages clockwise or counter-clockwise permanently in your browser.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-6">
          <FileUploader
            accept=".pdf,application/pdf"
            maxSizeMB={tool.maxFileSizeMB}
            onFilesSelected={(files) => {
              setFile(files[0] || null);
              setRotatedPdfBytes(null);
            }}
            isProcessing={isRotating}
            title="Upload PDF to rotate pages"
            subtitle="Rotates all or selected pages • Up to 80 MB"
          />

          {file && !rotatedPdfBytes && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Rotation Settings
              </h3>

              {/* Angle Options */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRotationAngle(90)}
                  className={`flex flex-col items-center justify-center rounded-2xl p-3 transition ${
                    rotationAngle === 90
                      ? "border-2 border-indigo-600 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                      : "border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                  }`}
                >
                  <RotateCw className="h-5 w-5" />
                  <span className="mt-1 text-xs font-bold">90° Right</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRotationAngle(270)}
                  className={`flex flex-col items-center justify-center rounded-2xl p-3 transition ${
                    rotationAngle === 270
                      ? "border-2 border-indigo-600 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                      : "border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                  }`}
                >
                  <RotateCcw className="h-5 w-5" />
                  <span className="mt-1 text-xs font-bold">90° Left</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRotationAngle(180)}
                  className={`flex flex-col items-center justify-center rounded-2xl p-3 transition ${
                    rotationAngle === 180
                      ? "border-2 border-indigo-600 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                      : "border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                  }`}
                >
                  <RotateCw className="h-5 w-5 rotate-90" />
                  <span className="mt-1 text-xs font-bold">180° Flip</span>
                </button>
              </div>

              {/* Page Selection Scope */}
              <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Pages to Rotate
                </label>
                <div className="mt-2 flex gap-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="pageScope"
                      checked={pageScope === "all"}
                      onChange={() => setPageScope("all")}
                      className="text-indigo-600"
                    />
                    <span>All Pages</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="pageScope"
                      checked={pageScope === "custom"}
                      onChange={() => setPageScope("custom")}
                      className="text-indigo-600"
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
                    className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                )}
              </div>

              <button
                type="button"
                onClick={handleRotate}
                disabled={isRotating}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 disabled:opacity-50"
              >
                <RotateCw className="h-4 w-4" />
                <span>{isRotating ? "Rotating Pages..." : "Apply Rotation"}</span>
              </button>
            </div>
          )}

          {rotatedPdfBytes && (
            <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-xl dark:border-emerald-950 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Rotation Applied!
                  </h3>
                  <p className="text-xs text-slate-500">
                    PDF document saved with permanent rotation angle
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={downloadRotated}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Rotated PDF</span>
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 px-4 py-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Rotate Another</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Preview */}
        <div className="lg:col-span-6">
          <div className="sticky top-24">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              {rotatedPdfBytes ? "Rotated PDF Preview" : "Document Preview"}
            </h2>
            <PdfPreview file={rotatedPdfBytes || file} showThumbnails={true} />
          </div>
        </div>
      </div>

      <AdSlot slotId="rotate-below-tool" format="horizontal" />
      <SeoContent tool={tool} relatedTools={relatedTools} />
      <FaqSection faqs={tool.faqs} />
    </div>
  );
}
