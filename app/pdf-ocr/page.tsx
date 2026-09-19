"use client";

import React, { useState } from "react";
import {
  ScanText,
  Copy,
  Download,
  FileText,
  Check,
  Languages,
  FileSearch,
  Sparkles,
} from "lucide-react";
import { FileUploader } from "@/components/uploader/FileUploader";
import {
  runDocumentOcr,
  createSearchablePdf,
  SUPPORTED_OCR_LANGUAGES,
  OcrResult,
  OcrProgressStatus,
} from "@/lib/ocr/tesseract-worker";
import { Document, Paragraph, TextRun, Packer } from "docx";
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

const tool = getToolByHref("/pdf-ocr")!;

export default function PdfOcrPage() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<string>("eng");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>("Initializing OCR engine...");

  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [editableText, setEditableText] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const handleStartOcr = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(5);
    setStatusText("Loading neural language model...");

    try {
      const res = await runDocumentOcr(file, language, (status: OcrProgressStatus) => {
        setProgress(status.progress);
        setStatusText(status.statusText);
      });

      setOcrResult(res);
      setEditableText(res.fullText);
      confetti({ particleCount: 40, spread: 60 });
    } catch (err: any) {
      alert(`OCR Error: ${err.message || "Could not complete OCR text recognition."}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(editableText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    const blob = new Blob([editableText], { type: "text/plain;charset=utf-8" });
    const baseName = file?.name.replace(/\.[^/.]+$/, "") || "ocr_document";
    downloadBlob(blob, `${baseName}_extracted.txt`);
  };

  const downloadDocx = async () => {
    const lines = editableText.split("\n");
    const children = lines.map(
      (line) =>
        new Paragraph({
          children: [new TextRun({ text: line, size: 22 })],
          spacing: { after: 120 },
        })
    );

    const doc = new Document({
      sections: [{ children }],
    });

    const docxBlob = await Packer.toBlob(doc);
    const baseName = file?.name.replace(/\.[^/.]+$/, "") || "ocr_document";
    downloadBlob(docxBlob, `${baseName}_ocr.docx`);
  };

  const downloadSearchablePdf = async () => {
    if (!file || !ocrResult) return;

    try {
      const pdfBytes = await createSearchablePdf(file, ocrResult);
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      downloadBlob(pdfBytes, `${baseName}_searchable.pdf`);
    } catch (err: any) {
      alert(`Could not create searchable PDF: ${err.message}`);
    }
  };

  const resetAll = () => {
    setFile(null);
    setOcrResult(null);
    setEditableText("");
    setProgress(0);
  };

  const appSchema = generateWebApplicationJsonLd(tool.name, tool.seoDescription, tool.href);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "PDF OCR", item: "/pdf-ocr" },
  ]);

  const relatedTools = TOOLS.filter((t) =>
    ["pdf-to-word", "pdf-compressor", "pdf-extract-text"].includes(t.id)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <AdSlot slotId="ocr-top-banner" format="horizontal" />

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <ScanText className="h-3.5 w-3.5" />
          <span>Client-Side Optical Character Recognition</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Free PDF OCR — Extract Text from Scans
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Recognize and extract text from scanned PDFs and photos in English, Urdu, Arabic, Spanish, French, and German with client-side WebAssembly models.
        </p>
      </div>

      {/* Main Tool Area */}
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Upload and Language Selector */}
        <div className="space-y-6 lg:col-span-5">
          <FileUploader
            accept=".pdf,application/pdf,.jpg,.jpeg,.png,image/jpeg,image/png"
            maxSizeMB={tool.maxFileSizeMB}
            onFilesSelected={(files) => setFile(files[0] || null)}
            isProcessing={isProcessing}
            processingProgress={progress}
            processingStatusText={statusText}
            title="Upload scanned PDF or Image"
            subtitle="Supports PDF, JPG, PNG • 100% in-browser OCR"
          />

          {file && !ocrResult && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                <Languages className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Recognition Language
                </h3>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-bold text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {SUPPORTED_OCR_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleStartOcr}
                disabled={isProcessing}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isProcessing ? "Recognizing Text..." : "Run OCR"}</span>
              </button>
            </div>
          )}

          {ocrResult && (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 dark:border-emerald-950 dark:bg-emerald-950/20">
              <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                OCR Processing Complete!
              </h3>
              <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
                Extracted text from {ocrResult.pages.length} page{ocrResult.pages.length > 1 ? "s" : ""}.
              </p>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={downloadSearchablePdf}
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700"
                >
                  <FileSearch className="h-4 w-4" />
                  <span>Create Searchable PDF</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={downloadDocx}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <FileText className="h-3.5 w-3.5 text-blue-600" />
                    <span>Word (.docx)</span>
                  </button>
                  <button
                    type="button"
                    onClick={downloadTxt}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <Download className="h-3.5 w-3.5 text-slate-600" />
                    <span>Text (.txt)</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={resetAll}
                  className="mt-2 text-center text-xs font-semibold text-slate-500 hover:underline"
                >
                  Scan Another Document
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Extracted Editable Text Box */}
        <div className="lg:col-span-7">
          <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Extracted Text Editor
              </span>
              {editableText && (
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Copied to clipboard!" : "Copy Text"}</span>
                </button>
              )}
            </div>

            <textarea
              value={editableText}
              onChange={(e) => setEditableText(e.target.value)}
              placeholder="Extracted text will appear here. You can inspect, edit, or copy text directly..."
              className="mt-4 min-h-[380px] flex-1 resize-y rounded-2xl border border-slate-100 bg-slate-50/50 p-4 font-mono text-xs leading-relaxed text-slate-800 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200"
            />
          </div>
        </div>
      </div>

      <AdSlot slotId="ocr-below-tool" format="horizontal" />
      <SeoContent tool={tool} relatedTools={relatedTools} />
      <FaqSection faqs={tool.faqs} />
    </div>
  );
}
