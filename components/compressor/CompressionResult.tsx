"use client";

import React, { useEffect } from "react";
import { Download, CheckCircle2, AlertTriangle, ArrowDownRight, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";
import { CompressionResult } from "@/lib/pdf/compression";
import { formatBytes, downloadBlob } from "@/lib/utils";

interface CompressionResultProps {
  result: CompressionResult;
  filename: string;
  onReset: () => void;
}

export function CompressionResultCard({
  result,
  filename,
  onReset,
}: CompressionResultProps) {
  useEffect(() => {
    // Launch celebratory confetti when compression finishes successfully
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
  }, []);

  const handleDownload = () => {
    const baseName = filename.replace(/\.pdf$/i, "");
    downloadBlob(result.pdfBytes, `${baseName}_compressed.pdf`);
  };

  return (
    <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-xl shadow-emerald-500/5 dark:border-emerald-900/40 dark:bg-slate-900 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            PDF Successfully Compressed!
          </h3>
          <p className="text-xs text-slate-500">
            Processed {result.pageCount} page{result.pageCount > 1 ? "s" : ""} in memory
          </p>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
          <span className="text-[11px] font-semibold text-slate-400">Original Size</span>
          <p className="mt-1 text-base font-bold text-slate-800 dark:text-slate-200">
            {formatBytes(result.originalBytes)}
          </p>
        </div>

        {result.targetBytes && (
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <span className="text-[11px] font-semibold text-slate-400">Target Ceiling</span>
            <p className="mt-1 text-base font-bold text-slate-800 dark:text-slate-200">
              {formatBytes(result.targetBytes)}
            </p>
          </div>
        )}

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/30">
          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Output Result</span>
          <p className="mt-1 text-base font-extrabold text-emerald-600 dark:text-emerald-300">
            {formatBytes(result.compressedBytes)}
          </p>
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-900/30 dark:bg-indigo-950/30">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-700 dark:text-indigo-400">
            <span>Reduced By</span>
            <ArrowDownRight className="h-3.5 w-3.5" />
          </div>
          <p className="mt-1 text-base font-extrabold text-indigo-600 dark:text-indigo-300">
            {result.reductionPercentage}%
          </p>
        </div>
      </div>

      {/* Warning Callout if Target Unattainable */}
      {result.warning && (
        <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <span className="font-bold">Notice: </span>
            {result.warning} The closest achievable high-quality file has been prepared for you.
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700"
        >
          <Download className="h-4 w-4" />
          <span>Download Compressed PDF</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Compress Another</span>
        </button>
      </div>
    </div>
  );
}
