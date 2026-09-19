"use client";

import React, { useState } from "react";
import { FileType, Download, CheckCircle2, RefreshCw, Sparkles } from "lucide-react";
import { FileUploader } from "@/components/uploader/FileUploader";
import { PdfPreview } from "@/components/preview/PdfPreview";
import { wordToPdfDoc } from "@/lib/word/docx-handler";
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

const tool = getToolByHref("/word-to-pdf")!;

export default function WordToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);

  const handleConvert = async () => {
    if (!file) return;

    setIsConverting(true);
    try {
      const bytes = await wordToPdfDoc(file);
      setPdfBytes(bytes);
      confetti({ particleCount: 50, spread: 65 });
    } catch (err: any) {
      alert(`Conversion error: ${err.message || "Failed to convert Word document to PDF"}`);
    } finally {
      setIsConverting(false);
    }
  };

  const downloadPdf = () => {
    if (!pdfBytes) return;
    const baseName = file?.name.replace(/\.docx$/i, "") || "document";
    downloadBlob(pdfBytes, `${baseName}.pdf`);
  };

  const resetAll = () => {
    setFile(null);
    setPdfBytes(null);
  };

  const appSchema = generateWebApplicationJsonLd(tool.name, tool.seoDescription, tool.href);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Word to PDF", item: "/word-to-pdf" },
  ]);

  const relatedTools = TOOLS.filter((t) =>
    ["pdf-to-word", "pdf-compressor", "pdf-editor"].includes(t.id)
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

      <AdSlot slotId="word-to-pdf-top-banner" format="horizontal" />

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
          <FileType className="h-3.5 w-3.5" />
          <span>DOCX to PDF Converter</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Convert Word to PDF Online (.docx)
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Convert Microsoft Word (.docx) files into clean, universal, standardized PDF documents with zero external software required.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-6">
          <FileUploader
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            maxSizeMB={tool.maxFileSizeMB}
            onFilesSelected={(files) => {
              setFile(files[0] || null);
              setPdfBytes(null);
            }}
            isProcessing={isConverting}
            title="Upload Word (.docx) file"
            subtitle="Standard DOCX format • In-browser rendering"
          />

          {file && !pdfBytes && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Ready to Convert
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Document will be formatted into standard A4 pages with crisp vector typography.
              </p>

              <button
                type="button"
                onClick={handleConvert}
                disabled={isConverting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isConverting ? "Converting..." : "Convert to PDF"}</span>
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
                    PDF Created Successfully!
                  </h3>
                  <p className="text-xs text-slate-500">
                    Standardized PDF ready for print or sharing
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
                  <span>Download PDF Document</span>
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 px-4 py-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Convert Another</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Preview */}
        <div className="lg:col-span-6">
          <div className="sticky top-24">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Generated PDF Preview
            </h2>
            <PdfPreview file={pdfBytes} showThumbnails={true} />
          </div>
        </div>
      </div>

      <AdSlot slotId="word-to-pdf-below-tool" format="horizontal" />
      <SeoContent tool={tool} relatedTools={relatedTools} />
      <FaqSection faqs={tool.faqs} />
    </div>
  );
}
