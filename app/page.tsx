"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileDown,
  Sparkles,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  FileCheck,
  Search,
} from "lucide-react";
import { TOOLS, TOOL_CATEGORIES } from "@/lib/tools-data";
import { ToolCard } from "@/components/common/ToolCard";
import { FaqSection } from "@/components/common/FaqSection";
import { AdSlot } from "@/components/layout/AdSlot";

export default function HomePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCat =
      selectedCategory === "All" || tool.category === selectedCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const popularTools = TOOLS.filter((t) => t.popular);

  const homeFaqs = [
    {
      question: "Is PDFToolkit really free to use?",
      answer: "Yes, 100% free with no hidden fees, page limits, or account registrations required. All our compression, editing, and conversion features are available at no charge.",
    },
    {
      question: "Are my files uploaded to a remote cloud server?",
      answer: "No. Unlike traditional PDF converters, PDFToolkit utilizes cutting-edge browser technologies (HTML5 Canvas, WebAssembly, and Web Workers) to process documents directly in your browser's private memory. Your confidential financial, legal, and personal files remain safely on your computer.",
    },
    {
      question: "How does the Target Size PDF Compressor work?",
      answer: "PDFToolkit features an intelligent iterative compression engine. You specify your target limit (such as 2 MB or 500 KB), and our system dynamically adjusts raster DPI, subsampling, and JPEG matrices to match your target without manual guesswork.",
    },
    {
      question: "Can I use PDFToolkit on mobile devices?",
      answer: "Yes. The PDFToolkit web app is fully responsive and optimized for touchscreens on iPhones, iPads, Android smartphones, and tablets.",
    },
    {
      question: "What languages does the PDF OCR support?",
      answer: "Our optical character recognition engine supports English, Urdu, Arabic, Spanish, French, German, and Chinese Simplified.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Top Banner AdSlot */}
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <AdSlot slotId="home-top-banner" format="horizontal" />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        {/* Glow backdrop */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 animate-float-slow rounded-full bg-gradient-to-tr from-red-500/15 via-rose-500/10 to-transparent blur-3xl dark:from-red-900/25 dark:via-rose-900/15" />

        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex animate-fade-in-up items-center gap-2 rounded-full border border-red-200/70 bg-red-50/80 px-4 py-1.5 text-xs font-semibold text-red-700 backdrop-blur-xs dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            <Sparkles className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
            <span>Next-Gen WebAssembly PDF Utility</span>
          </div>

          <h1 className="mt-6 animate-fade-in-up text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl dark:text-white" style={{ animationDelay: "60ms" }}>
            Free PDF Tools —{" "}
            <span className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 bg-clip-text text-transparent dark:from-red-400 dark:via-rose-400 dark:to-red-300">
              Convert, Compress, Edit
            </span>{" "}
            & More
          </h1>

          <p className="mx-auto mt-4 max-w-2xl animate-fade-in-up text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300" style={{ animationDelay: "120ms" }}>
            Powerful online PDF tools that work directly in your browser. Zero cloud uploads, infinite privacy, and instant downloads.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex animate-fade-in-up flex-wrap items-center justify-center gap-4" style={{ animationDelay: "180ms" }}>
            <a
              href="#all-tools"
              className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/25 transition-all hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-xl hover:shadow-red-500/30"
            >
              <span>Explore PDF Tools</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/pdf-compressor"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 shadow-xs transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <FileDown className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span>Compress a PDF</span>
            </Link>
          </div>

          {/* Trust stats row */}
          <div className="mt-8 flex animate-fade-in-up flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium text-slate-500 dark:text-slate-400" style={{ animationDelay: "240ms" }}>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> 100% private</span>
            <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-500" /> Instant processing</span>
            <span className="flex items-center gap-1.5"><Lock className="h-4 w-4 text-red-500" /> No uploads</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-rose-500" /> 18+ free tools</span>
          </div>

          {/* Quick Dropzone Box */}
          <div className="mx-auto mt-12 max-w-2xl">
            <div
              onClick={() => router.push("/pdf-compressor")}
              className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-red-200 bg-white/70 p-8 shadow-md backdrop-blur-xs transition-all hover:border-red-500 hover:bg-white dark:border-red-900/60 dark:bg-slate-900/70"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 transition-transform group-hover:scale-110 dark:bg-red-950 dark:text-red-400">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-100">
                Drop your PDF here to get started
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Click to compress, or browse our tools below
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools Row */}
      <section className="border-t border-slate-200/80 bg-slate-50/50 py-12 dark:border-slate-800/80 dark:bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Most Popular Tools
              </h2>
              <p className="text-xs text-slate-500">Frequently used utilities for daily workflows</p>
            </div>
            <Link
              href="/pdf-converter"
              className="text-xs font-semibold text-red-600 hover:underline dark:text-red-400"
            >
              View all &rarr;
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Mid-Page Ad Placement */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdSlot slotId="home-middle-banner" format="horizontal" />
      </div>

      {/* All Tools Directory with Category Filters */}
      <section id="all-tools" className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                All 18+ PDF Tools
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Filter by category or search for specific features
              </p>
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tools (e.g. compress, ocr, split)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-red-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Categories Pill Bar */}
          <div className="mt-6 flex flex-wrap gap-2 overflow-x-auto pb-2">
            {TOOL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-red-600 text-white shadow-md shadow-red-500/20"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Tools Grid */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-slate-200/80 bg-slate-50/70 py-16 dark:border-slate-800/80 dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              Simple & Fast
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              How PDFToolkit Works
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Four streamlined steps to complete any PDF task in seconds
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-base font-black text-red-600 dark:bg-red-950 dark:text-red-400">
                1
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">Upload Your File</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Drag and drop your PDF or document directly from your desktop or mobile device.
              </p>
            </div>

            <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-base font-black text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                2
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">Choose Your Options</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Configure your target compression size, visual annotations, OCR language, or page ordering.
              </p>
            </div>

            <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-base font-black text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                3
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">Process Your File</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Client-side WebAssembly processes your file instantly inside your browser tab.
              </p>
            </div>

            <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-base font-black text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                4
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">Download Instantly</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Preview your output and download your optimized, pristine document immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Privacy Feature Highlight */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl rounded-3xl border border-red-100 bg-gradient-to-b from-red-50/50 to-transparent p-8 sm:p-12 dark:border-red-950 dark:from-red-950/20">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md shadow-red-500/20">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              Privacy by Design: Your Files Never Leave Your Device
            </h2>
            <p className="mt-3 max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
              Most online PDF services upload your sensitive tax documents, contracts, and resumes to remote servers where they may sit for hours. PDFToolkit runs cutting-edge WebAssembly code right inside your web browser. Everything is processed purely in your computer&apos;s memory.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Zero Server Storage</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> No Registration Required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> GDPR & HIPAA Friendly</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Explanatory Content Section */}
      <section className="border-t border-slate-200/80 bg-white py-16 dark:border-slate-800/80 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              The Complete Online PDF Solution
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              The Portable Document Format (PDF) is the worldwide standard for exchanging business contracts, official government forms, and scholarly publications. However, managing PDFs frequently involves frustrating barriers: files too large to email, non-searchable scanned images, and expensive software subscriptions.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              PDFToolkit was engineered from the ground up to solve these challenges. By combining high-performance browser compilation with intuitive SaaS ergonomics, PDFToolkit delivers high-grade compression, conversion, page reorganization, and optical character recognition directly within any modern web browser.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/50">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Intelligent PDF Compression</h3>
              <p className="mt-1 text-xs text-slate-500">
                Unlike simple linear compressors, our target-size algorithm iteratively recalculates DPI and JPEG sampling to achieve strict file caps like 1 MB or 500 KB without destroying text sharpness.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/50">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Multi-Language OCR Recognition</h3>
              <p className="mt-1 text-xs text-slate-500">
                Turn non-selectable scans into searchable text across English, Urdu, Arabic, Spanish, French, and German with client-side neural network models.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Homepage FAQ Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FaqSection faqs={homeFaqs} />
      </div>

      {/* Pre-Footer AdSlot */}
      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <AdSlot slotId="home-bottom-banner" format="horizontal" />
      </div>
    </div>
  );
}
