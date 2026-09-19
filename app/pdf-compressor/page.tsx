"use client";

import React, { useState } from "react";
import { Sparkles, FileDown, ShieldCheck } from "lucide-react";
import { FileUploader } from "@/components/uploader/FileUploader";
import { PdfPreview } from "@/components/preview/PdfPreview";
import { TargetSizeInput } from "@/components/compressor/TargetSizeInput";
import { CompressionResultCard } from "@/components/compressor/CompressionResult";
import { AdSlot } from "@/components/layout/AdSlot";
import { FaqSection } from "@/components/common/FaqSection";
import { SeoContent } from "@/components/common/SeoContent";
import { compressPdf, CompressionOptions, CompressionResult } from "@/lib/pdf/compression";
import { getToolByHref, TOOLS } from "@/lib/tools-data";
import {
  generateWebApplicationJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo/metadata";

const tool = getToolByHref("/pdf-compressor")!;

export default function PdfCompressorPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStatus, setProgressStatus] = useState("Preparing compression...");
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);

  const [options, setOptions] = useState<CompressionOptions>({
    mode: "custom",
    preset: "high",
    targetSizeValue: 2.0,
    targetSizeUnit: "MB",
    quality: 0.7,
    dpi: 150,
    grayscale: false,
    removeMetadata: true,
    downsampleImages: true,
  });

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
      setCompressionResult(null);
    } else {
      setSelectedFile(null);
      setCompressionResult(null);
    }
  };

  const handleCompress = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgressPercent(10);
    setProgressStatus("Analyzing document structure...");

    try {
      const result = await compressPdf(selectedFile, options, (pct, status) => {
        setProgressPercent(pct);
        setProgressStatus(status);
      });
      setCompressionResult(result);
    } catch (err: any) {
      alert(`Compression error: ${err.message || "An unexpected error occurred."}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setSelectedFile(null);
    setCompressionResult(null);
    setProgressPercent(0);
  };

  const appSchema = generateWebApplicationJsonLd(tool.name, tool.seoDescription, tool.href);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "PDF Compressor", item: "/pdf-compressor" },
  ]);

  const relatedTools = TOOLS.filter((t) =>
    ["pdf-merge", "pdf-split", "pdf-editor"].includes(t.id)
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

      {/* Header Banner AdSlot */}
      <AdSlot slotId="compressor-top-banner" format="horizontal" />

      {/* Header Title Section */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Intelligent Target Size Compression</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Free Online PDF Compressor
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Specify your desired file size (e.g. 2 MB or 500 KB) or choose a preset.
          Our client-side engine iteratively optimizes imagery and metadata right in your browser.
        </p>
      </div>

      {/* Main Two-Column Tool Interface */}
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Controls & Uploader */}
        <div className="space-y-6 lg:col-span-6">
          <FileUploader
            accept=".pdf,application/pdf"
            maxSizeMB={tool.maxFileSizeMB}
            onFilesSelected={handleFilesSelected}
            isProcessing={isProcessing}
            processingProgress={progressPercent}
            processingStatusText={progressStatus}
            title="Choose a PDF file to compress"
            subtitle="Local browser processing • Target size optimization"
          />

          {selectedFile && !compressionResult && (
            <TargetSizeInput
              options={options}
              onChange={setOptions}
              onCompress={handleCompress}
              isProcessing={isProcessing}
            />
          )}

          {compressionResult && selectedFile && (
            <CompressionResultCard
              result={compressionResult}
              filename={selectedFile.name}
              onReset={resetAll}
            />
          )}

          {/* Privacy Note */}
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/40">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Files are compressed locally on your computer with Web Workers. Zero remote uploads.</span>
          </div>
        </div>

        {/* Right Column: PDF Preview */}
        <div className="lg:col-span-6">
          <div className="sticky top-24">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Live PDF Preview
            </h2>
            <PdfPreview
              file={compressionResult ? compressionResult.pdfBytes : selectedFile}
              showThumbnails={true}
            />
          </div>
        </div>
      </div>

      {/* Mid Tool AdSlot */}
      <AdSlot slotId="compressor-below-tool" format="horizontal" />

      {/* SEO Explanatory Content */}
      <SeoContent tool={tool} relatedTools={relatedTools} />

      {/* FAQs */}
      <FaqSection faqs={tool.faqs} />
    </div>
  );
}
