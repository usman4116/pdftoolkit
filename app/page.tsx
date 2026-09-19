"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Search,
  CornerDownLeft,
} from "lucide-react";
import { TOOLS, TOOL_CATEGORIES } from "@/lib/tools-data";
import { ToolCard } from "@/components/common/ToolCard";
import { FaqSection } from "@/components/common/FaqSection";
import { AdSlot } from "@/components/layout/AdSlot";

export default function HomePage() {
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

      {/* Hero — the search is the primary action: find a tool and go. */}
      <section className="relative overflow-hidden">
        {/* Warm paper wash + a single soft red accent, top-right */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60rem_40rem_at_85%_-10%,rgba(220,38,38,0.08),transparent)] dark:bg-[radial-gradient(60rem_40rem_at_85%_-10%,rgba(220,38,38,0.14),transparent)]" />

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-24 lg:px-8">
          {/* Left: editorial headline + functional search */}
          <div className="animate-fade-in-up">
            <p className="text-sm font-semibold text-red-600 dark:text-red-500">
              Every PDF task, done in your browser
            </p>
            <h1 className="mt-3 font-display text-5xl font-extrabold leading-[1.03] tracking-tight text-slate-900 sm:text-6xl dark:text-white">
              18 PDF tools.
              <br />
              <span className="text-red-600 dark:text-red-500">Zero uploads.</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Compress, convert, edit, sign and 14 more. Files are processed on
              your device and never uploaded, so private documents stay private.
            </p>

            {/* Primary action: search that drives the directory below */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                document.getElementById("all-tools")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group mt-8 flex max-w-md items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 shadow-sm transition-colors focus-within:border-red-500 dark:border-slate-800 dark:bg-slate-900"
            >
              <Search className="h-5 w-5 shrink-0 text-slate-400 group-focus-within:text-red-500" />
              <input
                type="text"
                autoComplete="off"
                placeholder="What do you need to do? e.g. compress, merge, OCR"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search PDF tools"
                className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
              />
              <kbd className="hidden shrink-0 items-center gap-1 rounded-md border border-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:flex dark:border-slate-700">
                <CornerDownLeft className="h-3 w-3" />
              </kbd>
            </form>

            {/* Popular tools as quick entry points, not a separate section */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400">Popular:</span>
              {popularTools.slice(0, 5).map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-red-300 hover:text-red-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-800 dark:hover:text-red-400"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: a plain-spoken privacy proof panel, not a decorative dropzone */}
          <div className="animate-fade-in-up lg:justify-self-end" style={{ animationDelay: "80ms" }}>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-white">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Nothing leaves this tab
                  </p>
                  <p className="text-xs text-slate-500">Verified client-side processing</p>
                </div>
              </div>

              <dl className="mt-6 space-y-4">
                {[
                  ["Files uploaded to our servers", "Zero"],
                  ["Account or email required", "None"],
                  ["Tools available, free", "18+"],
                  ["Cost, now and later", "$0"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800">
                    <dt className="text-xs text-slate-500">{label}</dt>
                    <dd className="font-display text-lg font-bold text-slate-900 dark:text-white">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Mid-Page Ad Placement */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdSlot slotId="home-middle-banner" format="horizontal" />
      </div>

      {/* Unified Tools Directory — driven by the hero search + category pills */}
      <section id="all-tools" className="scroll-mt-20 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {searchQuery ? `Results for “${searchQuery}”` : "All PDF tools"}
            </h2>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {TOOL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tools Grid */}
          {filteredTools.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-200 py-16 text-center dark:border-slate-800">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                No tools match “{searchQuery}”.
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                className="mt-3 text-xs font-semibold text-red-600 hover:underline dark:text-red-400"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* How It Works — a genuine sequence, shown as a connected flow */}
      <section className="border-t border-slate-200/80 bg-slate-50/60 py-16 dark:border-slate-800/80 dark:bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Three steps, no waiting
          </h2>
          <p className="mt-2 max-w-lg text-sm text-slate-500">
            There is no upload queue because there is no upload. Pick a tool and
            the work happens where your file already is.
          </p>

          <ol className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              {
                n: "1",
                t: "Open a tool",
                d: "Choose from compression, conversion, editing, OCR and more. Your file loads straight into the page.",
              },
              {
                n: "2",
                t: "Set what you want",
                d: "A target size, a page range, an OCR language, a signature. The controls match the task, nothing more.",
              },
              {
                n: "3",
                t: "Download the result",
                d: "Processing runs on your device in seconds. The finished file saves locally, and then it is gone from memory.",
              },
            ].map((step, i) => (
              <li key={step.n} className="relative">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-4xl font-extrabold text-red-600 dark:text-red-500">
                    {step.n}
                  </span>
                  {i < 2 && (
                    <span className="hidden h-px flex-1 translate-y-[-6px] bg-slate-200 sm:block dark:bg-slate-800" />
                  )}
                </div>
                <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">{step.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{step.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Privacy — the core differentiator, stated plainly */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 rounded-3xl bg-slate-900 p-8 text-white sm:p-12 lg:grid-cols-[1fr_0.8fr] dark:bg-slate-800/60">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Your files never leave your device
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-300">
                Most online PDF services send your tax records, contracts and
                scans to a remote server, where copies can linger. PDFToolkit
                runs entirely in your browser with WebAssembly, so a document
                you compress here is never transmitted anywhere.
              </p>
            </div>
            <ul className="space-y-3">
              {[
                "No files stored on any server",
                "No account, email or sign-up",
                "Safe for confidential and regulated documents",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-2xl bg-white/5 px-4 py-3 text-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                  <span className="text-slate-100">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SEO Explanatory Content Section */}
      <section className="border-t border-slate-200/80 bg-white py-16 dark:border-slate-800/80 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              The complete online PDF solution
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
