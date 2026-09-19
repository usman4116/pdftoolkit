"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileDown,
  Merge,
  Split,
  PenTool,
  ScanText,
  Image,
  ArrowLeftRight,
  Shield,
  ChevronDown,
  Menu,
  X,
  FileText,
  Lock,
  Stamp,
  RotateCw,
  Layers,
  Crop,
  Wrench,
} from "lucide-react";
import { TOOLS } from "@/lib/tools-data";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function Navbar() {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getToolIcon = (name: string) => {
    switch (name) {
      case "FileDown": return <FileDown className="w-4 h-4 text-emerald-600" />;
      case "Merge": return <Merge className="w-4 h-4 text-indigo-600" />;
      case "Split": return <Split className="w-4 h-4 text-amber-600" />;
      case "PenTool": return <PenTool className="w-4 h-4 text-violet-600" />;
      case "ScanText": return <ScanText className="w-4 h-4 text-blue-600" />;
      case "Image": return <Image className="w-4 h-4 text-pink-600" />;
      case "Lock": return <Lock className="w-4 h-4 text-rose-600" />;
      case "Stamp": return <Stamp className="w-4 h-4 text-purple-600" />;
      case "RotateCw": return <RotateCw className="w-4 h-4 text-cyan-600" />;
      case "Layers": return <Layers className="w-4 h-4 text-teal-600" />;
      case "Crop": return <Crop className="w-4 h-4 text-orange-600" />;
      case "Wrench": return <Wrench className="w-4 h-4 text-slate-600" />;
      default: return <FileText className="w-4 h-4 text-primary-600" />;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-red-600 shadow-md shadow-red-500/25">
            <span className="text-[11px] font-black tracking-tight text-white">PDF</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              PDF<span className="text-red-600 dark:text-red-500">Toolkit</span>
            </span>
            <span className="-mt-1 text-[10px] font-medium tracking-wide text-slate-500">
              FREE PDF SUITE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {/* Tools Mega Menu Trigger */}
          <div
            className="relative"
            onMouseEnter={() => setIsToolsOpen(true)}
            onMouseLeave={() => setIsToolsOpen(false)}
          >
            <button
              onClick={() => setIsToolsOpen(!isToolsOpen)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <span>All PDF Tools</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isToolsOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {isToolsOpen && (
              <div className="absolute left-0 top-full pt-1.5 w-[600px] shadow-2xl">
                <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                  <div className="col-span-2 mb-1 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Popular Utilities
                    </span>
                    <Link
                      href="/pdf-converter"
                      className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                      onClick={() => setIsToolsOpen(false)}
                    >
                      Converter Hub &rarr;
                    </Link>
                  </div>
                  {TOOLS.slice(0, 10).map((tool) => (
                    <Link
                      key={tool.id}
                      href={tool.href}
                      onClick={() => setIsToolsOpen(false)}
                      className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    >
                      <div className="mt-0.5 rounded-lg bg-slate-100 p-1.5 dark:bg-slate-800">
                        {getToolIcon(tool.iconName)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
                          {tool.name}
                        </div>
                        <p className="line-clamp-1 text-xs text-slate-500">
                          {tool.tagline}
                        </p>
                      </div>
                    </Link>
                  ))}
                  <div className="col-span-2 border-t border-slate-100 pt-2 text-center dark:border-slate-800">
                    <Link
                      href="/#all-tools"
                      onClick={() => setIsToolsOpen(false)}
                      className="text-xs font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300"
                    >
                      View all 18+ tools &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/pdf-compressor"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Compress
          </Link>
          <Link
            href="/pdf-converter"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Convert
          </Link>
          <Link
            href="/pdf-editor"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Edit
          </Link>
          <Link
            href="/pdf-ocr"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            OCR
          </Link>
          <Link
            href="/blog"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Blog
          </Link>
        </nav>

        {/* Right CTA / Privacy Badge */}
        <div className="hidden items-center gap-3 md:flex">
          <div className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 lg:flex dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Shield className="h-3.5 w-3.5 text-emerald-600" />
            <span>100% Client-Side & Private</span>
          </div>
          <ThemeToggle />
          <Link
            href="/pdf-compressor"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Compress PDF
          </Link>
        </div>

        {/* Mobile: Theme Toggle + Hamburger */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Open menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-900 md:hidden">
          <div className="flex flex-col gap-1 pb-3">
            <Link
              href="/pdf-compressor"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200"
            >
              PDF Compressor
            </Link>
            <Link
              href="/pdf-editor"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200"
            >
              PDF Editor
            </Link>
            <Link
              href="/pdf-converter"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200"
            >
              Converter Hub
            </Link>
            <Link
              href="/pdf-ocr"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200"
            >
              PDF OCR
            </Link>
            <Link
              href="/pdf-merge"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200"
            >
              Merge PDF
            </Link>
            <Link
              href="/pdf-split"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200"
            >
              Split PDF
            </Link>
            <Link
              href="/blog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200"
            >
              Guides & Blog
            </Link>
          </div>
          <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
            <Link
              href="/pdf-compressor"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full rounded-xl bg-indigo-600 py-2.5 text-center text-sm font-semibold text-white shadow-sm"
            >
              Compress PDF Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
