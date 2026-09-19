"use client";

import React, { useState } from "react";
import { FileCode, Download, Copy, Check, CheckCircle2, RefreshCw, Sparkles } from "lucide-react";
import { FileUploader } from "@/components/uploader/FileUploader";
import { PdfPreview } from "@/components/preview/PdfPreview";
import { extractTextFromPdf } from "@/lib/pdf/converter";
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

const tool = getToolByHref("/pdf-extract-text")!;

export default function PdfExtractTextPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractedPages, setExtractedPages] = useState<{ pageNum: number; text: string }[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  const handleExtract = async () => {
    if (!file) return;

    setIsExtracting(true);
    try {
      const results = await extractTextFromPdf(file);
      setExtractedPages(results);
      confetti({ particleCount: 40, spread: 60 });
    } catch (err: any) {
      alert(`Extraction error: ${err.message || "Failed to extract text"}`);
    } finally {
      setIsExtracting(false);
    }
  };

  const fullText = extractedPages
    .map((p) => `--- PAGE ${p.pageNum} ---\n${p.text}`)
    .join("\n\n");

  const copyAll = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
    const baseName = file?.name.replace(/\.pdf$/i, "") || "document";
    downloadBlob(blob, `${baseName}_extracted_text.txt`);
  };

  const resetAll = () => {
    setFile(null);
    setExtractedPages([]);
  };

  const appSchema = generateWebApplicationJsonLd(tool.name, tool.seoDescription, tool.href);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Extract Text from PDF", item: "/pdf-extract-text" },
  ]);

  const relatedTools = TOOLS.filter((t) =>
    ["pdf-ocr", "pdf-to-word", "pdf-compressor"].includes(t.id)
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

      <AdSlot slotId="extract-text-top-banner" format="horizontal" />

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
          <FileCode className="h-3.5 w-3.5" />
          <span>Instant Vector Parser</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Extract Text from PDF Online
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Extract all readable text streams from your PDF in seconds. Copy to clipboard or export to a clean TXT file.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-6">
          <FileUploader
            accept=".pdf,application/pdf"
            maxSizeMB={tool.maxFileSizeMB}
            onFilesSelected={(files) => {
              setFile(files[0] || null);
              setExtractedPages([]);
            }}
            isProcessing={isExtracting}
            title="Upload PDF to extract text"
            subtitle="Parses native text streams • Up to 80 MB"
          />

          {file && extractedPages.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Ready to Extract
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Instantly parses vector text across all pages directly in your browser.
              </p>

              <button
                type="button"
                onClick={handleExtract}
                disabled={isExtracting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isExtracting ? "Extracting..." : "Extract Text"}</span>
              </button>
            </div>
          )}

          {extractedPages.length > 0 && (
            <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-xl dark:border-emerald-950 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Parsed {extractedPages.length} Pages
                  </span>
                </div>
                <button
                  type="button"
                  onClick={copyAll}
                  className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:underline dark:text-red-400"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Text"}</span>
                </button>
              </div>

              <textarea
                value={fullText}
                readOnly
                className="mt-4 h-64 w-full resize-none rounded-2xl border border-slate-100 bg-slate-50 p-4 font-mono text-xs text-slate-800 focus:outline-none dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200"
              />

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={downloadTxt}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-red-700"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Text (.txt)</span>
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 px-4 py-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Extract Another</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Preview */}
        <div className="lg:col-span-6">
          <div className="sticky top-24">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Source PDF Preview
            </h2>
            <PdfPreview file={file} showThumbnails={true} />
          </div>
        </div>
      </div>

      <AdSlot slotId="extract-text-below-tool" format="horizontal" />
      <SeoContent tool={tool} relatedTools={relatedTools} />
      <FaqSection faqs={tool.faqs} />
    </div>
  );
}
