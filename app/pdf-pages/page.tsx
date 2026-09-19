"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  RotateCw,
  Copy,
  Trash2,
  Download,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { FileUploader } from "@/components/uploader/FileUploader";
import { loadPdfDocument } from "@/lib/pdf/pdfjs-init";
import { organizePdfPages, PageOrganizeAction } from "@/lib/pdf/merge-split";
import { readFileAsArrayBuffer, downloadBlob } from "@/lib/utils";
import { AdSlot } from "@/components/layout/AdSlot";
import { FaqSection } from "@/components/common/FaqSection";
import { SeoContent } from "@/components/common/SeoContent";
import { getToolByHref, TOOLS } from "@/lib/tools-data";
import confetti from "canvas-confetti";
import {
  generateWebApplicationJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo/metadata";

const tool = getToolByHref("/pdf-pages")!;

interface PageCardItem {
  id: string;
  originalIndex: number; // 0-indexed
  dataUrl: string;
  rotation: number; // 0, 90, 180, 270
}

export default function PdfPagesOrganizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageCardItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedBytes, setSavedBytes] = useState<Uint8Array | null>(null);

  useEffect(() => {
    async function loadPages() {
      if (!file) {
        setPages([]);
        setSavedBytes(null);
        return;
      }

      setIsLoading(true);
      try {
        const buffer = await readFileAsArrayBuffer(file);
        const doc = await loadPdfDocument(buffer);
        const loaded: PageCardItem[] = [];

        for (let i = 1; i <= doc.numPages; i++) {
          const page = await doc.getPage(i);
          const viewport = page.getViewport({ scale: 0.3 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            await page.render({ canvasContext: ctx, viewport }).promise;
            loaded.push({
              id: `p-${i}-${Date.now()}`,
              originalIndex: i - 1,
              dataUrl: canvas.toDataURL("image/jpeg", 0.7),
              rotation: 0,
            });
          }
        }
        setPages(loaded);
      } catch (err: any) {
        alert(`Error loading PDF pages: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    }

    loadPages();
  }, [file]);

  const moveLeft = (idx: number) => {
    if (idx <= 0) return;
    const copy = [...pages];
    const temp = copy[idx - 1];
    copy[idx - 1] = copy[idx];
    copy[idx] = temp;
    setPages(copy);
  };

  const moveRight = (idx: number) => {
    if (idx >= pages.length - 1) return;
    const copy = [...pages];
    const temp = copy[idx + 1];
    copy[idx + 1] = copy[idx];
    copy[idx] = temp;
    setPages(copy);
  };

  const rotatePage = (idx: number) => {
    setPages((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, rotation: (item.rotation + 90) % 360 } : item
      )
    );
  };

  const duplicatePage = (idx: number) => {
    const target = pages[idx];
    const copy = [...pages];
    copy.splice(idx + 1, 0, {
      ...target,
      id: `p-dup-${Date.now()}-${Math.random()}`,
    });
    setPages(copy);
  };

  const deletePage = (idx: number) => {
    if (pages.length <= 1) {
      alert("You must keep at least one page in the document.");
      return;
    }
    setPages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!file || pages.length === 0) return;

    setIsSaving(true);
    try {
      const pageActions: PageOrganizeAction[] = pages.map((p) => ({
        originalIndex: p.originalIndex,
        rotation: p.rotation,
      }));

      const bytes = await organizePdfPages(file, pageActions);
      setSavedBytes(bytes);
      confetti({ particleCount: 50, spread: 65 });
    } catch (err: any) {
      alert(`Save error: ${err.message || "Could not save reorganized pages"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const downloadNewPdf = () => {
    if (!savedBytes) return;
    const baseName = file?.name.replace(/\.pdf$/i, "") || "organized";
    downloadBlob(savedBytes, `${baseName}_organized.pdf`);
  };

  const resetAll = () => {
    setFile(null);
    setPages([]);
    setSavedBytes(null);
  };

  const appSchema = generateWebApplicationJsonLd(tool.name, tool.seoDescription, tool.href);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Organize PDF Pages", item: "/pdf-pages" },
  ]);

  const relatedTools = TOOLS.filter((t) =>
    ["pdf-rotate", "pdf-split", "pdf-merge"].includes(t.id)
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

      <AdSlot slotId="pages-top-banner" format="horizontal" />

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
          <Layers className="h-3.5 w-3.5" />
          <span>Visual Page Management</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Organize PDF Pages Online
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Reorder, duplicate, rotate, and delete pages visually in a responsive card grid.
        </p>
      </div>

      {!file ? (
        <div className="mx-auto mt-10 max-w-2xl">
          <FileUploader
            accept=".pdf,application/pdf"
            maxSizeMB={tool.maxFileSizeMB}
            onFilesSelected={(files) => setFile(files[0] || null)}
            title="Upload PDF to organize pages"
            subtitle="Visual thumbnail organizer • 100% private in-browser"
          />
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {pages.length} Page{pages.length > 1 ? "s" : ""}
              </span>
              <p className="text-[11px] text-slate-400">
                Reorder using arrows or click rotate/duplicate/delete
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetAll}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || isLoading}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-50"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{isSaving ? "Saving..." : "Save New PDF"}</span>
              </button>
            </div>
          </div>

          {/* Success Save Banner */}
          {savedBytes && (
            <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-950 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>PDF updated! New document with {pages.length} pages generated.</span>
              </div>
              <button
                type="button"
                onClick={downloadNewPdf}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Organized PDF</span>
              </button>
            </div>
          )}

          {/* Pages Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {pages.map((p, idx) => (
              <div
                key={p.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-3 shadow-xs transition dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="relative overflow-hidden rounded-xl bg-slate-50 p-1 dark:bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.dataUrl}
                    alt={`Page ${idx + 1}`}
                    style={{ transform: `rotate(${p.rotation}deg)` }}
                    className="mx-auto h-40 w-auto rounded object-contain transition-transform"
                  />
                  <span className="absolute bottom-2 left-2 rounded-md bg-slate-900/80 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {idx + 1}
                  </span>
                </div>

                {/* Card Controls */}
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-slate-500 dark:border-slate-800">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveLeft(idx)}
                      disabled={idx === 0}
                      className="rounded p-1 hover:bg-slate-100 disabled:opacity-25"
                      title="Move Left"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveRight(idx)}
                      disabled={idx === pages.length - 1}
                      className="rounded p-1 hover:bg-slate-100 disabled:opacity-25"
                      title="Move Right"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => rotatePage(idx)}
                      className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Rotate 90°"
                    >
                      <RotateCw className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicatePage(idx)}
                      className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Duplicate"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePage(idx)}
                      className="rounded p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AdSlot slotId="pages-below-tool" format="horizontal" />
      <SeoContent tool={tool} relatedTools={relatedTools} />
      <FaqSection faqs={tool.faqs} />
    </div>
  );
}
