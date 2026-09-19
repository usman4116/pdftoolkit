"use client";

import React, { useState } from "react";
import { Stamp, Download, CheckCircle2, RefreshCw, Sparkles } from "lucide-react";
import { FileUploader } from "@/components/uploader/FileUploader";
import { PdfPreview } from "@/components/preview/PdfPreview";
import { addWatermarkToPdf, WatermarkOptions } from "@/lib/pdf/watermark";
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

const tool = getToolByHref("/pdf-watermark")!;

export default function PdfWatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [watermarkedBytes, setWatermarkedBytes] = useState<Uint8Array | null>(null);

  const [options, setOptions] = useState<WatermarkOptions>({
    type: "text",
    text: "CONFIDENTIAL",
    opacity: 0.3,
    rotation: -45,
    fontSize: 50,
    color: "#ef4444",
    position: "diagonal",
    pageScope: "all",
  });

  const handleApplyWatermark = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const bytes = await addWatermarkToPdf(file, options);
      setWatermarkedBytes(bytes);
      confetti({ particleCount: 50, spread: 65 });
    } catch (err: any) {
      alert(`Watermark error: ${err.message || "Failed to stamp watermark"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadWatermarked = () => {
    if (!watermarkedBytes) return;
    const baseName = file?.name.replace(/\.pdf$/i, "") || "document";
    downloadBlob(watermarkedBytes, `${baseName}_watermarked.pdf`);
  };

  const resetAll = () => {
    setFile(null);
    setWatermarkedBytes(null);
  };

  const appSchema = generateWebApplicationJsonLd(tool.name, tool.seoDescription, tool.href);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Watermark PDF", item: "/pdf-watermark" },
  ]);

  const relatedTools = TOOLS.filter((t) =>
    ["pdf-editor", "pdf-protect", "pdf-sign"].includes(t.id)
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

      <AdSlot slotId="watermark-top-banner" format="horizontal" />

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
          <Stamp className="h-3.5 w-3.5" />
          <span>Security & Copyright Stamping</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Add Watermark to PDF Online
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Stamp custom text or image watermarks with precise controls over transparency, rotation, position, and page scope.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-6">
          <FileUploader
            accept=".pdf,application/pdf"
            maxSizeMB={tool.maxFileSizeMB}
            onFilesSelected={(files) => {
              setFile(files[0] || null);
              setWatermarkedBytes(null);
            }}
            isProcessing={isProcessing}
            title="Upload PDF document to watermark"
            subtitle="Text or logo watermarking • 100% private in-browser"
          />

          {file && !watermarkedBytes && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Watermark Customization
              </h3>

              <div className="mt-4 space-y-4">
                {/* Text String */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={options.text}
                    onChange={(e) => setOptions({ ...options, text: e.target.value })}
                    placeholder="e.g. CONFIDENTIAL, DRAFT, DO NOT COPY"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* Preset Text Chips */}
                <div className="flex flex-wrap gap-2">
                  {["CONFIDENTIAL", "DRAFT", "SAMPLE", "COPYRIGHT", "PRIVATE"].map((str) => (
                    <button
                      key={str}
                      type="button"
                      onClick={() => setOptions({ ...options, text: str })}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {str}
                    </button>
                  ))}
                </div>

                {/* Opacity & Font Size */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>Opacity</span>
                      <span>{Math.round(options.opacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="1.0"
                      step="0.05"
                      value={options.opacity}
                      onChange={(e) =>
                        setOptions({ ...options, opacity: parseFloat(e.target.value) })
                      }
                      className="mt-2 h-2 w-full cursor-pointer rounded-lg bg-slate-200 accent-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Font Size
                    </label>
                    <input
                      type="number"
                      min="12"
                      max="120"
                      value={options.fontSize}
                      onChange={(e) =>
                        setOptions({
                          ...options,
                          fontSize: parseInt(e.target.value, 10) || 40,
                        })
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* Color & Position */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Stamp Color
                    </label>
                    <div className="mt-1.5 flex items-center gap-2">
                      <input
                        type="color"
                        value={options.color}
                        onChange={(e) => setOptions({ ...options, color: e.target.value })}
                        className="h-8 w-12 cursor-pointer rounded-lg border-0 p-0"
                      />
                      <span className="text-xs font-mono text-slate-500">{options.color}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Position
                    </label>
                    <select
                      value={options.position}
                      onChange={(e) => setOptions({ ...options, position: e.target.value as any })}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="diagonal">Diagonal Center (-45°)</option>
                      <option value="center">Center Horizontal</option>
                      <option value="top-left">Top Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="bottom-right">Bottom Right</option>
                    </select>
                  </div>
                </div>

                {/* Page Scope */}
                <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Apply to Pages
                  </label>
                  <div className="mt-2 flex gap-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={options.pageScope === "all"}
                        onChange={() => setOptions({ ...options, pageScope: "all" })}
                        className="text-indigo-600"
                      />
                      <span>All Pages</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={options.pageScope === "odd"}
                        onChange={() => setOptions({ ...options, pageScope: "odd" })}
                        className="text-indigo-600"
                      />
                      <span>Odd Pages Only</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={options.pageScope === "even"}
                        onChange={() => setOptions({ ...options, pageScope: "even" })}
                        className="text-indigo-600"
                      />
                      <span>Even Pages Only</span>
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleApplyWatermark}
                disabled={isProcessing}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isProcessing ? "Stamping Watermark..." : "Stamp Watermark"}</span>
              </button>
            </div>
          )}

          {watermarkedBytes && (
            <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-xl dark:border-emerald-950 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Watermark Applied!
                  </h3>
                  <p className="text-xs text-slate-500">
                    Embedded into PDF content stream
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={downloadWatermarked}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Watermarked PDF</span>
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 px-4 py-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Watermark Another</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Preview */}
        <div className="lg:col-span-6">
          <div className="sticky top-24">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              {watermarkedBytes ? "Watermarked Output Preview" : "Document Preview"}
            </h2>
            <PdfPreview file={watermarkedBytes || file} showThumbnails={true} />
          </div>
        </div>
      </div>

      <AdSlot slotId="watermark-below-tool" format="horizontal" />
      <SeoContent tool={tool} relatedTools={relatedTools} />
      <FaqSection faqs={tool.faqs} />
    </div>
  );
}
