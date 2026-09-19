"use client";

import React, { useState } from "react";
import { FileText, Download, CheckCircle2, RefreshCw, Sparkles } from "lucide-react";
import { FileUploader } from "@/components/uploader/FileUploader";
import { PdfPreview } from "@/components/preview/PdfPreview";
import { pdfToWordDocx } from "@/lib/word/docx-handler";
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

const tool = getToolByHref("/pdf-to-word")!;

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [docxBlob, setDocxBlob] = useState<Blob | null>(null);

  const handleConvert = async () => {
    if (!file) return;

    setIsConverting(true);
    setProgress(20);

    try {
      const blob = await pdfToWordDocx(file, (cur, tot) => {
        setProgress(Math.round((cur / tot) * 100));
      });
      setDocxBlob(blob);
      confetti({ particleCount: 50, spread: 65 });
    } catch (err: any) {
      alert(`Conversion error: ${err.message || "Failed to convert PDF to Word"}`);
    } finally {
      setIsConverting(false);
    }
  };

  const downloadWord = () => {
    if (!docxBlob) return;
    const baseName = file?.name.replace(/\.pdf$/i, "") || "document";
    downloadBlob(docxBlob, `${baseName}.docx`);
  };

  const resetAll = () => {
    setFile(null);
    setDocxBlob(null);
    setProgress(0);
  };

  const appSchema = generateWebApplicationJsonLd(tool.name, tool.seoDescription, tool.href);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "PDF to Word", item: "/pdf-to-word" },
  ]);

  const relatedTools = TOOLS.filter((t) =>
    ["word-to-pdf", "pdf-ocr", "pdf-compressor"].includes(t.id)
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

      <AdSlot slotId="pdf-to-word-top-banner" format="horizontal" />

      {/* Title */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <FileText className="h-3.5 w-3.5" />
          <span>Vector Text to DOCX</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Convert PDF to Word Online (.docx)
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Extract text and layout from PDF files directly into fully editable Microsoft Word (.docx) documents.
        </p>
      </div>

      {/* Two-Column Grid */}
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-6">
          <FileUploader
            accept=".pdf,application/pdf"
            maxSizeMB={tool.maxFileSizeMB}
            onFilesSelected={(files) => {
              setFile(files[0] || null);
              setDocxBlob(null);
            }}
            isProcessing={isConverting}
            processingProgress={progress}
            processingStatusText="Extracting paragraphs & formatting..."
            title="Upload PDF to convert to Word"
            subtitle="Converts to editable DOCX • Private browser processing"
          />

          {file && !docxBlob && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Conversion Options
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Your PDF document will be parsed into structured paragraphs and headings compatible with Microsoft Word and Google Docs.
              </p>

              <button
                type="button"
                onClick={handleConvert}
                disabled={isConverting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isConverting ? "Converting to Word..." : "Convert to Word (.docx)"}</span>
              </button>
            </div>
          )}

          {docxBlob && (
            <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-xl dark:border-emerald-950 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Word Document Ready!
                  </h3>
                  <p className="text-xs text-slate-500">
                    Fully editable Microsoft Word (.docx) file generated
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={downloadWord}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Word File</span>
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
              Source PDF Preview
            </h2>
            <PdfPreview file={file} showThumbnails={true} />
          </div>
        </div>
      </div>

      <AdSlot slotId="pdf-to-word-below-tool" format="horizontal" />
      <SeoContent tool={tool} relatedTools={relatedTools} />
      <FaqSection faqs={tool.faqs} />
    </div>
  );
}
