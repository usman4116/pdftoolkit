"use client";

import React, { useState } from "react";
import { Merge, ArrowUp, ArrowDown, Trash2, Download, RefreshCw, CheckCircle2 } from "lucide-react";
import { FileUploader } from "@/components/uploader/FileUploader";
import { PdfPreview } from "@/components/preview/PdfPreview";
import { mergePdfFiles } from "@/lib/pdf/merge-split";
import { formatBytes, downloadBlob } from "@/lib/utils";
import { AdSlot } from "@/components/layout/AdSlot";
import { FaqSection } from "@/components/common/FaqSection";
import { SeoContent } from "@/components/common/SeoContent";
import { getToolByHref, TOOLS } from "@/lib/tools-data";
import confetti from "canvas-confetti";
import {
  generateWebApplicationJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo/metadata";

const tool = getToolByHref("/pdf-merge")!;

export default function PdfMergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState<boolean>(false);
  const [mergedPdfBytes, setMergedPdfBytes] = useState<Uint8Array | null>(null);

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles(newFiles);
    setMergedPdfBytes(null);
  };

  const moveUp = (idx: number) => {
    if (idx <= 0) return;
    const copy = [...files];
    const temp = copy[idx - 1];
    copy[idx - 1] = copy[idx];
    copy[idx] = temp;
    setFiles(copy);
  };

  const moveDown = (idx: number) => {
    if (idx >= files.length - 1) return;
    const copy = [...files];
    const temp = copy[idx + 1];
    copy[idx + 1] = copy[idx];
    copy[idx] = temp;
    setFiles(copy);
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      alert("Please upload at least 2 PDF files to merge.");
      return;
    }

    setIsMerging(true);
    try {
      const bytes = await mergePdfFiles(files);
      setMergedPdfBytes(bytes);
      confetti({ particleCount: 50, spread: 70 });
    } catch (err: any) {
      alert(`Merge error: ${err.message || "Failed to merge PDF files"}`);
    } finally {
      setIsMerging(false);
    }
  };

  const downloadMerged = () => {
    if (!mergedPdfBytes) return;
    downloadBlob(mergedPdfBytes, "merged_document.pdf");
  };

  const resetAll = () => {
    setFiles([]);
    setMergedPdfBytes(null);
  };

  const appSchema = generateWebApplicationJsonLd(tool.name, tool.seoDescription, tool.href);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Merge PDF", item: "/pdf-merge" },
  ]);

  const relatedTools = TOOLS.filter((t) =>
    ["pdf-split", "pdf-pages", "pdf-compressor"].includes(t.id)
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

      <AdSlot slotId="merge-top-banner" format="horizontal" />

      {/* Title */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
          <Merge className="h-3.5 w-3.5" />
          <span>Multi-File Combiner</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Merge PDF Files Online
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Combine multiple PDF documents into a single organized file in your desired order with zero cloud uploads.
        </p>
      </div>

      {/* Main Tool Grid */}
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Files & Reorder */}
        <div className="space-y-6 lg:col-span-6">
          <FileUploader
            accept=".pdf,application/pdf"
            multiple={true}
            maxSizeMB={tool.maxFileSizeMB}
            onFilesSelected={handleFilesSelected}
            isProcessing={isMerging}
            title="Drop multiple PDFs here or click to browse"
            subtitle="Upload 2 or more files to combine • Up to 100 MB each"
          />

          {files.length > 0 && !mergedPdfBytes && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Arrange Document Sequence
                </span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {files.length} document{files.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {files.map((f, idx) => (
                  <div
                    key={`${f.name}-${idx}`}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-red-100 text-xs font-bold text-red-700 dark:bg-red-950 dark:text-red-300">
                        {idx + 1}
                      </span>
                      <div className="overflow-hidden">
                        <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {f.name}
                        </p>
                        <p className="text-[11px] text-slate-400">{formatBytes(f.size)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveUp(idx)}
                        disabled={idx === 0}
                        className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30 dark:hover:bg-slate-700"
                        title="Move Up"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveDown(idx)}
                        disabled={idx === files.length - 1}
                        className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30 dark:hover:bg-slate-700"
                        title="Move Down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="rounded p-1 text-rose-500 hover:bg-rose-50"
                        title="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleMerge}
                disabled={files.length < 2 || isMerging}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 disabled:opacity-50"
              >
                <Merge className="h-4 w-4" />
                <span>{isMerging ? "Merging Documents..." : `Merge ${files.length} PDFs`}</span>
              </button>
            </div>
          )}

          {mergedPdfBytes && (
            <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-xl dark:border-emerald-950 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    PDFs Successfully Merged!
                  </h3>
                  <p className="text-xs text-slate-500">
                    Combined {files.length} documents ({formatBytes(mergedPdfBytes.byteLength)})
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={downloadMerged}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-red-700"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Merged PDF</span>
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 px-4 py-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Merge More</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-6">
          <div className="sticky top-24">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              {mergedPdfBytes ? "Merged Output Preview" : "Document Preview"}
            </h2>
            <PdfPreview
              file={mergedPdfBytes || files[0] || null}
              showThumbnails={true}
            />
          </div>
        </div>
      </div>

      <AdSlot slotId="merge-below-tool" format="horizontal" />
      <SeoContent tool={tool} relatedTools={relatedTools} />
      <FaqSection faqs={tool.faqs} />
    </div>
  );
}
