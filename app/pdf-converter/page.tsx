"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  FileText,
  FileType,
  Image as ImageIcon,
  FileImage,
  FileCode,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { AdSlot } from "@/components/layout/AdSlot";
import { FaqSection } from "@/components/common/FaqSection";
import { SeoContent } from "@/components/common/SeoContent";
import { getToolByHref, TOOLS } from "@/lib/tools-data";
import {
  generateWebApplicationJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo/metadata";

const tool = getToolByHref("/pdf-converter")!;

export default function PdfConverterHubPage() {
  const conversionPairs = [
    {
      title: "PDF to Word (.docx)",
      description: "Extract text and structured paragraphs into editable Microsoft Word documents.",
      href: "/pdf-to-word",
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      from: "PDF",
      to: "DOCX",
    },
    {
      title: "Word to PDF",
      description: "Convert DOCX files into standardized, universal PDF documents.",
      href: "/word-to-pdf",
      icon: <FileType className="h-6 w-6 text-teal-600" />,
      from: "DOCX",
      to: "PDF",
    },
    {
      title: "PDF to JPG",
      description: "Render PDF pages into crisp, high-resolution JPG image files.",
      href: "/pdf-to-jpg",
      icon: <ImageIcon className="h-6 w-6 text-pink-600" />,
      from: "PDF",
      to: "JPG",
    },
    {
      title: "JPG to PDF",
      description: "Combine multiple JPG, PNG, and WEBP photos into a clean PDF file.",
      href: "/jpg-to-pdf",
      icon: <FileImage className="h-6 w-6 text-rose-600" />,
      from: "JPG",
      to: "PDF",
    },
    {
      title: "PDF to Text",
      description: "Extract raw, selectable text streams from any PDF instantly.",
      href: "/pdf-extract-text",
      icon: <FileCode className="h-6 w-6 text-sky-600" />,
      from: "PDF",
      to: "TXT",
    },
    {
      title: "Scanned PDF to Text (OCR)",
      description: "Optical character recognition for scanned image-only PDFs in 6+ languages.",
      href: "/pdf-ocr",
      icon: <Sparkles className="h-6 w-6 text-amber-600" />,
      from: "SCAN",
      to: "TEXT",
    },
  ];

  const appSchema = generateWebApplicationJsonLd(tool.name, tool.seoDescription, tool.href);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "PDF Converter Hub", item: "/pdf-converter" },
  ]);

  const relatedTools = TOOLS.filter((t) =>
    ["pdf-compressor", "pdf-merge", "pdf-editor"].includes(t.id)
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

      <AdSlot slotId="converter-top-banner" format="horizontal" />

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
          <ArrowLeftRight className="h-3.5 w-3.5" />
          <span>All-In-One Document Hub</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          PDF Converter Hub
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Convert to and from PDF format with zero file size limits, watermark-free downloads, and 100% private browser processing.
        </p>
      </div>

      {/* Conversion Cards Grid */}
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {conversionPairs.map((pair) => (
          <Link
            key={pair.href}
            href={pair.href}
            className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-red-400 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 transition-colors group-hover:bg-red-50 dark:bg-slate-800 dark:group-hover:bg-red-950/60">
                  {pair.icon}
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <span>{pair.from}</span>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                  <span className="text-red-600 dark:text-red-400">{pair.to}</span>
                </div>
              </div>

              <h3 className="mt-5 text-base font-bold text-slate-900 group-hover:text-red-600 dark:text-white dark:group-hover:text-red-400">
                {pair.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {pair.description}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
              <span>Start Conversion</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>

      <AdSlot slotId="converter-below-tool" format="horizontal" />
      <SeoContent tool={tool} relatedTools={relatedTools} />
      <FaqSection faqs={tool.faqs} />
    </div>
  );
}
