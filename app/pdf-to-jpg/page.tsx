"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Download, Archive, CheckCircle2, RefreshCw, Sparkles } from "lucide-react";
import { FileUploader } from "@/components/uploader/FileUploader";
import { pdfToImages, createZipOfImages, PageImageResult } from "@/lib/pdf/converter";
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

const tool = getToolByHref("/pdf-to-jpg")!;

export default function PdfToJpgPage() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<"image/jpeg" | "image/png">("image/jpeg");
  const [dpi, setDpi] = useState<number>(150);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>("Rendering pages to images...");
  const [images, setImages] = useState<PageImageResult[]>([]);

  const handleConvert = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(5);
    setStatusText("Initializing canvas renderer...");

    try {
      const results = await pdfToImages(file, format, dpi, (cur, total) => {
        setProgress(Math.round((cur / total) * 100));
        setStatusText(`Rendering page ${cur} of ${total}...`);
      });

      setImages(results);
      confetti({ particleCount: 50, spread: 65 });
    } catch (err: any) {
      alert(`Conversion error: ${err.message || "Failed to convert PDF pages"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSingle = (img: PageImageResult) => {
    const ext = format === "image/jpeg" ? "jpg" : "png";
    const baseName = file?.name.replace(/\.pdf$/i, "") || "page";
    downloadBlob(img.blob, `${baseName}_page_${img.pageNum}.${ext}`);
  };

  const downloadZip = async () => {
    if (images.length === 0) return;
    const ext = format === "image/jpeg" ? "jpg" : "png";
    const baseName = file?.name.replace(/\.pdf$/i, "") || "pdf_images";
    const zipBlob = await createZipOfImages(images, baseName, ext);
    downloadBlob(zipBlob, `${baseName}_all_pages.zip`);
  };

  const resetAll = () => {
    setFile(null);
    setImages([]);
    setProgress(0);
  };

  const appSchema = generateWebApplicationJsonLd(tool.name, tool.seoDescription, tool.href);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "PDF to JPG", item: "/pdf-to-jpg" },
  ]);

  const relatedTools = TOOLS.filter((t) =>
    ["jpg-to-pdf", "pdf-compressor", "pdf-converter"].includes(t.id)
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

      <AdSlot slotId="pdf-to-jpg-top-banner" format="horizontal" />

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700 dark:bg-pink-950 dark:text-pink-300">
          <ImageIcon className="h-3.5 w-3.5" />
          <span>High-Res Rasterization</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Convert PDF to JPG Online
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Transform every page of your PDF document into crystal-clear JPG or PNG images. Download individually or as a single ZIP.
        </p>
      </div>

      {/* Tool Container */}
      <div className="mx-auto mt-10 max-w-4xl space-y-6">
        <FileUploader
          accept=".pdf,application/pdf"
          maxSizeMB={tool.maxFileSizeMB}
          onFilesSelected={(files) => {
            setFile(files[0] || null);
            setImages([]);
          }}
          isProcessing={isProcessing}
          processingProgress={progress}
          processingStatusText={statusText}
          title="Upload PDF to convert to images"
          subtitle="Supports multi-page PDFs • 150 & 300 DPI"
        />

        {file && images.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Image Extraction Settings
            </h3>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Image Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-red-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="image/jpeg">JPG (Standard Photo Format)</option>
                  <option value="image/png">PNG (Lossless Graphics)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Resolution / DPI
                </label>
                <select
                  value={dpi}
                  onChange={(e) => setDpi(parseInt(e.target.value, 10))}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-red-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="150">150 DPI (Balanced Web Quality)</option>
                  <option value="300">300 DPI (High Resolution Print)</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConvert}
              disabled={isProcessing}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isProcessing ? "Converting Pages..." : "Convert to Images"}</span>
            </button>
          </div>
        )}

        {/* Rendered Images Grid */}
        {images.length > 0 && (
          <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-xl dark:border-emerald-950 dark:bg-slate-900">
            <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Rendered {images.length} Image{images.length > 1 ? "s" : ""}
                  </h3>
                  <p className="text-xs text-slate-500">Ready for instant download</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={downloadZip}
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-red-700"
                >
                  <Archive className="h-4 w-4" />
                  <span>Download All (ZIP)</span>
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Thumbnail Preview Grid */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {images.map((img) => (
                <div
                  key={img.pageNum}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.dataUrl}
                    alt={`Page ${img.pageNum}`}
                    className="w-full rounded-xl bg-white shadow-xs"
                  />
                  <div className="mt-2 flex items-center justify-between px-1">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Page {img.pageNum}
                    </span>
                    <button
                      type="button"
                      onClick={() => downloadSingle(img)}
                      className="rounded-lg p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/60"
                      title="Download image"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AdSlot slotId="pdf-to-jpg-below-tool" format="horizontal" />
      <SeoContent tool={tool} relatedTools={relatedTools} />
      <FaqSection faqs={tool.faqs} />
    </div>
  );
}
