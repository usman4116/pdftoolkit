"use client";

import React, { useState } from "react";
import { Wrench, Download, CheckCircle2, RefreshCw, AlertCircle, Sparkles } from "lucide-react";
import { FileUploader } from "@/components/uploader/FileUploader";
import { PdfPreview } from "@/components/preview/PdfPreview";
import { repairPdfFile } from "@/lib/pdf/security";
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

const tool = getToolByHref("/pdf-repair")!;

export default function PdfRepairPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isRepairing, setIsRepairing] = useState<boolean>(false);
  const [repairResult, setRepairResult] = useState<{
    success: boolean;
    message: string;
    recoveredPages: number;
    pdfBytes?: Uint8Array;
  } | null>(null);

  const handleRepair = async () => {
    if (!file) return;

    setIsRepairing(true);
    setRepairResult(null);

    try {
      const res = await repairPdfFile(file);
      setRepairResult(res);
      if (res.success) {
        confetti({ particleCount: 50, spread: 65 });
      }
    } catch (err: any) {
      setRepairResult({
        success: false,
        message: `Analysis failed: ${err.message}`,
        recoveredPages: 0,
      });
    } finally {
      setIsRepairing(false);
    }
  };

  const downloadRepaired = () => {
    if (!repairResult?.pdfBytes) return;
    const baseName = file?.name.replace(/\.pdf$/i, "") || "document";
    downloadBlob(repairResult.pdfBytes, `${baseName}_repaired.pdf`);
  };

  const resetAll = () => {
    setFile(null);
    setRepairResult(null);
  };

  const appSchema = generateWebApplicationJsonLd(tool.name, tool.seoDescription, tool.href);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Repair PDF", item: "/pdf-repair" },
  ]);

  const relatedTools = TOOLS.filter((t) =>
    ["pdf-compressor", "pdf-unlock", "pdf-pages"].includes(t.id)
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

      <AdSlot slotId="repair-top-banner" format="horizontal" />

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <Wrench className="h-3.5 w-3.5" />
          <span>Structural Diagnostics & Recovery</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Repair PDF Online — Fix Damaged Files
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Analyze corrupted cross-reference tables, salvage intact page streams, and rebuild damaged PDF containers.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-6">
          <FileUploader
            accept=".pdf,application/pdf"
            maxSizeMB={tool.maxFileSizeMB}
            onFilesSelected={(files) => {
              setFile(files[0] || null);
              setRepairResult(null);
            }}
            isProcessing={isRepairing}
            title="Upload damaged or corrupted PDF"
            subtitle="Structural reconstruction • Up to 80 MB"
          />

          {file && !repairResult && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Start Diagnostics
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Our parser will inspect header markers, trailer dictionaries, and re-serialize valid stream objects into a new document.
              </p>

              <button
                type="button"
                onClick={handleRepair}
                disabled={isRepairing}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isRepairing ? "Reconstructing..." : "Analyze & Repair PDF"}</span>
              </button>
            </div>
          )}

          {repairResult && (
            <div
              className={`rounded-3xl border p-6 shadow-xl ${
                repairResult.success
                  ? "border-emerald-200 bg-white dark:border-emerald-950 dark:bg-slate-900"
                  : "border-rose-200 bg-rose-50/70 dark:border-rose-950 dark:bg-rose-950/20"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                    repairResult.success
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                      : "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
                  }`}
                >
                  {repairResult.success ? <CheckCircle2 className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {repairResult.success ? "PDF Successfully Recovered!" : "PDF Could Not Be Repaired"}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                    {repairResult.message}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {repairResult.success && repairResult.pdfBytes && (
                  <button
                    type="button"
                    onClick={downloadRepaired}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-red-700"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Repaired PDF</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={resetAll}
                  className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 px-4 py-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Try Another File</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Preview */}
        <div className="lg:col-span-6">
          <div className="sticky top-24">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Recovered Document Preview
            </h2>
            <PdfPreview file={repairResult?.pdfBytes || file} showThumbnails={true} />
          </div>
        </div>
      </div>

      <AdSlot slotId="repair-below-tool" format="horizontal" />
      <SeoContent tool={tool} relatedTools={relatedTools} />
      <FaqSection faqs={tool.faqs} />
    </div>
  );
}
