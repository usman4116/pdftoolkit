"use client";

import React, { useState } from "react";
import { Lock, Download, CheckCircle2, RefreshCw, ShieldCheck } from "lucide-react";
import { FileUploader } from "@/components/uploader/FileUploader";
import { PdfPreview } from "@/components/preview/PdfPreview";
import { protectPdfFile } from "@/lib/pdf/security";
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

const tool = getToolByHref("/pdf-protect")!;

export default function PdfProtectPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isProtecting, setIsProtecting] = useState<boolean>(false);
  const [protectedPdfBytes, setProtectedPdfBytes] = useState<Uint8Array | null>(null);

  const handleProtect = async () => {
    if (!file) return;
    if (!password) {
      alert("Please enter a password.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match. Please verify.");
      return;
    }

    setIsProtecting(true);
    try {
      const res = await protectPdfFile(file, password);
      if (res.success && res.bytes) {
        setProtectedPdfBytes(res.bytes);
        confetti({ particleCount: 50, spread: 65 });
      } else {
        alert(res.error || "Failed to protect file.");
      }
    } catch (err: any) {
      alert(`Protection error: ${err.message}`);
    } finally {
      setIsProtecting(false);
    }
  };

  const downloadProtected = () => {
    if (!protectedPdfBytes) return;
    const baseName = file?.name.replace(/\.pdf$/i, "") || "document";
    downloadBlob(protectedPdfBytes, `${baseName}_protected.pdf`);
  };

  const resetAll = () => {
    setFile(null);
    setPassword("");
    setConfirmPassword("");
    setProtectedPdfBytes(null);
  };

  const appSchema = generateWebApplicationJsonLd(tool.name, tool.seoDescription, tool.href);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Protect PDF", item: "/pdf-protect" },
  ]);

  const relatedTools = TOOLS.filter((t) =>
    ["pdf-unlock", "pdf-watermark", "pdf-compressor"].includes(t.id)
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

      <AdSlot slotId="protect-top-banner" format="horizontal" />

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
          <Lock className="h-3.5 w-3.5" />
          <span>Security Encryption</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Protect PDF Online with Password
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Encrypt your sensitive PDF documents with secure password protection to prevent unauthorized opening and viewing.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-6">
          <FileUploader
            accept=".pdf,application/pdf"
            maxSizeMB={tool.maxFileSizeMB}
            onFilesSelected={(files) => {
              setFile(files[0] || null);
              setProtectedPdfBytes(null);
            }}
            isProcessing={isProtecting}
            title="Upload PDF document to protect"
            subtitle="Client-side document encryption • Up to 80 MB"
          />

          {file && !protectedPdfBytes && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Set Document Passcode
              </h3>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Document Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter secure password..."
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-red-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password..."
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-red-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleProtect}
                disabled={isProtecting || !password}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 disabled:opacity-50"
              >
                <Lock className="h-4 w-4" />
                <span>{isProtecting ? "Encrypting..." : "Protect PDF"}</span>
              </button>
            </div>
          )}

          {protectedPdfBytes && (
            <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-xl dark:border-emerald-950 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    PDF Encrypted Successfully!
                  </h3>
                  <p className="text-xs text-slate-500">
                    Document password protected and locked
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={downloadProtected}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-red-700"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Protected PDF</span>
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 px-4 py-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Protect Another</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Preview */}
        <div className="lg:col-span-6">
          <div className="sticky top-24">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Document Preview
            </h2>
            <PdfPreview file={file} showThumbnails={true} />
          </div>
        </div>
      </div>

      <AdSlot slotId="protect-below-tool" format="horizontal" />
      <SeoContent tool={tool} relatedTools={relatedTools} />
      <FaqSection faqs={tool.faqs} />
    </div>
  );
}
