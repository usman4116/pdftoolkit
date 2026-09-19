"use client";

import React, { useState } from "react";
import { Unlock, Download, CheckCircle2, RefreshCw, AlertCircle, ShieldAlert } from "lucide-react";
import { FileUploader } from "@/components/uploader/FileUploader";
import { PdfPreview } from "@/components/preview/PdfPreview";
import { unlockPdfFile } from "@/lib/pdf/security";
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

const tool = getToolByHref("/pdf-unlock")!;

export default function PdfUnlockPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState<string>("");
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
  const [unlockedBytes, setUnlockedBytes] = useState<Uint8Array | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUnlock = async () => {
    if (!file) return;

    setIsUnlocking(true);
    setErrorMessage(null);

    try {
      const res = await unlockPdfFile(file, password);
      if (res.success && res.bytes) {
        setUnlockedBytes(res.bytes);
        confetti({ particleCount: 50, spread: 65 });
      } else {
        setErrorMessage(res.error || "Unable to decrypt PDF. Please check the password.");
      }
    } catch (err: any) {
      setErrorMessage(`Decryption error: ${err.message}`);
    } finally {
      setIsUnlocking(false);
    }
  };

  const downloadUnlocked = () => {
    if (!unlockedBytes) return;
    const baseName = file?.name.replace(/\.pdf$/i, "") || "document";
    downloadBlob(unlockedBytes, `${baseName}_unlocked.pdf`);
  };

  const resetAll = () => {
    setFile(null);
    setPassword("");
    setUnlockedBytes(null);
    setErrorMessage(null);
  };

  const appSchema = generateWebApplicationJsonLd(tool.name, tool.seoDescription, tool.href);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Unlock PDF", item: "/pdf-unlock" },
  ]);

  const relatedTools = TOOLS.filter((t) =>
    ["pdf-protect", "pdf-repair", "pdf-compressor"].includes(t.id)
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

      <AdSlot slotId="unlock-top-banner" format="horizontal" />

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <Unlock className="h-3.5 w-3.5" />
          <span>Remove Restrictions</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Unlock PDF Online — Remove Password
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Remove password security and editing/printing restrictions from authorized PDF documents directly in your browser.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-6">
          <FileUploader
            accept=".pdf,application/pdf"
            maxSizeMB={tool.maxFileSizeMB}
            onFilesSelected={(files) => {
              setFile(files[0] || null);
              setUnlockedBytes(null);
              setErrorMessage(null);
            }}
            isProcessing={isUnlocking}
            title="Upload protected PDF document"
            subtitle="Secure browser-based decryption • Up to 80 MB"
          />

          {file && !unlockedBytes && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Enter Password
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                If the PDF has an open password, enter it below to permanently unlock future prompts.
              </p>

              <div className="mt-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter document password (if required)..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Security Policy Notice */}
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                <ShieldAlert className="h-4 w-4 shrink-0 text-slate-500" />
                <span>
                  Notice: PDFToolkit adheres to ethical security standards. This tool removes passwords from authorized documents where the password or permissions allow. It does not bypass encrypted enterprise vaults without credentials.
                </span>
              </div>

              {errorMessage && (
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleUnlock}
                disabled={isUnlocking}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 disabled:opacity-50"
              >
                <Unlock className="h-4 w-4" />
                <span>{isUnlocking ? "Unlocking..." : "Unlock Document"}</span>
              </button>
            </div>
          )}

          {unlockedBytes && (
            <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-xl dark:border-emerald-950 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Document Successfully Unlocked!
                  </h3>
                  <p className="text-xs text-slate-500">
                    All restrictions and passwords have been removed
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={downloadUnlocked}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Unlocked PDF</span>
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 px-4 py-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Unlock Another</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Preview */}
        <div className="lg:col-span-6">
          <div className="sticky top-24">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              {unlockedBytes ? "Unlocked Output Preview" : "Document Preview"}
            </h2>
            <PdfPreview file={unlockedBytes || file} showThumbnails={true} />
          </div>
        </div>
      </div>

      <AdSlot slotId="unlock-below-tool" format="horizontal" />
      <SeoContent tool={tool} relatedTools={relatedTools} />
      <FaqSection faqs={tool.faqs} />
    </div>
  );
}
