"use client";

import React, { useState } from "react";
import { Split, Download, Archive, CheckCircle2, RefreshCw } from "lucide-react";
import { FileUploader } from "@/components/uploader/FileUploader";
import { PdfPreview } from "@/components/preview/PdfPreview";
import { splitPdf, SplitFileResult } from "@/lib/pdf/merge-split";
import JSZip from "jszip";
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

const tool = getToolByHref("/pdf-split")!;

export default function PdfSplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"ranges" | "everyN" | "all">("ranges");
  const [rangeStr, setRangeStr] = useState<string>("1-2");
  const [everyNValue, setEveryNValue] = useState<number>(1);
  const [isSplitting, setIsSplitting] = useState<boolean>(false);
  const [splitResults, setSplitResults] = useState<SplitFileResult[]>([]);

  const handleSplit = async () => {
    if (!file) return;

    setIsSplitting(true);
    try {
      const results = await splitPdf(file, mode, {
        rangeStr,
        n: everyNValue,
      });
      setSplitResults(results);
      confetti({ particleCount: 50, spread: 65 });
    } catch (err: any) {
      alert(`Split error: ${err.message || "Failed to split document"}`);
    } finally {
      setIsSplitting(false);
    }
  };

  const downloadSingleFile = (res: SplitFileResult) => {
    downloadBlob(res.bytes, res.name);
  };

  const downloadZipArchive = async () => {
    if (splitResults.length === 0) return;
    const zip = new JSZip();
    splitResults.forEach((r) => {
      zip.file(r.name, r.bytes);
    });
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const baseName = file?.name.replace(/\.pdf$/i, "") || "split_documents";
    downloadBlob(zipBlob, `${baseName}_split.zip`);
  };

  const resetAll = () => {
    setFile(null);
    setSplitResults([]);
  };

  const appSchema = generateWebApplicationJsonLd(tool.name, tool.seoDescription, tool.href);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Split PDF", item: "/pdf-split" },
  ]);

  const relatedTools = TOOLS.filter((t) =>
    ["pdf-merge", "pdf-pages", "pdf-compressor"].includes(t.id)
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

      <AdSlot slotId="split-top-banner" format="horizontal" />

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          <Split className="h-3.5 w-3.5" />
          <span>Page Extractor & Splitter</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Split PDF Pages Online
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Extract selected pages, custom ranges (e.g. 1-3, 5), or split every N pages into single files or a ZIP archive.
        </p>
      </div>

      {/* Tool Grid */}
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Controls */}
        <div className="space-y-6 lg:col-span-6">
          <FileUploader
            accept=".pdf,application/pdf"
            maxSizeMB={tool.maxFileSizeMB}
            onFilesSelected={(files) => {
              setFile(files[0] || null);
              setSplitResults([]);
            }}
            isProcessing={isSplitting}
            title="Upload PDF document to split"
            subtitle="Secure client-side page splitting • Up to 100 MB"
          />

          {file && splitResults.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Choose Split Method
              </h3>

              {/* Mode Selection */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMode("ranges")}
                  className={`rounded-2xl p-3 text-center transition ${
                    mode === "ranges"
                      ? "border-2 border-red-600 bg-red-50/50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span className="block text-xs font-bold">Custom Range</span>
                  <span className="mt-0.5 block text-[10px] text-slate-400">e.g. 1-3, 5</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("everyN")}
                  className={`rounded-2xl p-3 text-center transition ${
                    mode === "everyN"
                      ? "border-2 border-red-600 bg-red-50/50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span className="block text-xs font-bold">Every N Pages</span>
                  <span className="mt-0.5 block text-[10px] text-slate-400">Equal chunks</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("all")}
                  className={`rounded-2xl p-3 text-center transition ${
                    mode === "all"
                      ? "border-2 border-red-600 bg-red-50/50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span className="block text-xs font-bold">All Pages</span>
                  <span className="mt-0.5 block text-[10px] text-slate-400">Individual files</span>
                </button>
              </div>

              {/* Mode specific input */}
              {mode === "ranges" && (
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Page Ranges to Extract
                  </label>
                  <input
                    type="text"
                    value={rangeStr}
                    onChange={(e) => setRangeStr(e.target.value)}
                    placeholder="e.g. 1-3, 5, 8-10"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-red-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Separate pages or ranges with commas. Example: <code className="text-red-600">1-4, 6, 8-10</code>
                  </p>
                </div>
              )}

              {mode === "everyN" && (
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Split Every N Pages
                  </label>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-xs text-slate-500">Split into chunks of</span>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={everyNValue}
                      onChange={(e) => setEveryNValue(parseInt(e.target.value, 10) || 1)}
                      className="w-20 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 focus:border-red-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <span className="text-xs text-slate-500">pages</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleSplit}
                disabled={isSplitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 disabled:opacity-50"
              >
                <Split className="h-4 w-4" />
                <span>{isSplitting ? "Splitting PDF..." : "Split PDF"}</span>
              </button>
            </div>
          )}

          {/* Results List */}
          {splitResults.length > 0 && (
            <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-xl dark:border-emerald-950 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    PDF Successfully Split!
                  </h3>
                  <p className="text-xs text-slate-500">
                    Generated {splitResults.length} document{splitResults.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="mt-4 max-h-48 space-y-2 overflow-y-auto pr-1">
                {splitResults.map((res, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    <span className="truncate text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {res.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => downloadSingleFile(res)}
                      className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-red-600 shadow-xs hover:bg-red-50 dark:bg-slate-800 dark:text-red-400"
                    >
                      <Download className="h-3 w-3" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {splitResults.length > 1 && (
                  <button
                    type="button"
                    onClick={downloadZipArchive}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-red-700"
                  >
                    <Archive className="h-4 w-4" />
                    <span>Download All (ZIP)</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={resetAll}
                  className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 px-4 py-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Split Another</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-6">
          <div className="sticky top-24">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              PDF Page Preview
            </h2>
            <PdfPreview file={file} showThumbnails={true} />
          </div>
        </div>
      </div>

      <AdSlot slotId="split-below-tool" format="horizontal" />
      <SeoContent tool={tool} relatedTools={relatedTools} />
      <FaqSection faqs={tool.faqs} />
    </div>
  );
}
