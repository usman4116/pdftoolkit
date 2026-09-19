import React from "react";
import Link from "next/link";
import { ShieldCheck, Cpu, Zap, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      {/* Privacy & Guarantee Bar */}
      <div className="border-b border-slate-200/80 bg-white/50 px-4 py-8 dark:border-slate-800/80 dark:bg-slate-900/40">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Zero Cloud Uploads</h4>
              <p className="text-xs text-slate-500">Core tools process locally in your browser.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Total Privacy</h4>
              <p className="text-xs text-slate-500">Your documents never touch an external database.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Blazing Fast Speed</h4>
              <p className="text-xs text-slate-500">Instant client-side WebAssembly execution.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">100% Free Forever</h4>
              <p className="text-xs text-slate-500">No subscriptions, limits, or hidden fees.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Links Directory */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-red-600 shadow-md">
                <span className="text-[9px] font-black text-white">PDF</span>
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                PDF<span className="text-red-600 dark:text-red-500">Toolkit</span>
              </span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              The modern, privacy-first PDF utility suite designed for speed, security, and simplicity. Manipulate, compress, convert, and sign PDF documents directly on your device.
            </p>
          </div>

          {/* Popular Tools */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Popular Tools
            </h3>
            <ul className="mt-4 space-y-2 text-xs">
              <li><Link href="/pdf-compressor" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">PDF Compressor</Link></li>
              <li><Link href="/pdf-editor" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">PDF Editor</Link></li>
              <li><Link href="/pdf-ocr" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">PDF OCR</Link></li>
              <li><Link href="/pdf-merge" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">Merge PDF</Link></li>
              <li><Link href="/pdf-split" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">Split PDF</Link></li>
            </ul>
          </div>

          {/* Conversions */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Conversions
            </h3>
            <ul className="mt-4 space-y-2 text-xs">
              <li><Link href="/pdf-to-word" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">PDF to Word</Link></li>
              <li><Link href="/word-to-pdf" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">Word to PDF</Link></li>
              <li><Link href="/pdf-to-jpg" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">PDF to JPG</Link></li>
              <li><Link href="/jpg-to-pdf" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">JPG to PDF</Link></li>
              <li><Link href="/pdf-converter" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">Converter Hub</Link></li>
            </ul>
          </div>

          {/* Organize & Security */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Manage & Security
            </h3>
            <ul className="mt-4 space-y-2 text-xs">
              <li><Link href="/pdf-pages" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">Organize Pages</Link></li>
              <li><Link href="/pdf-rotate" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">Rotate PDF</Link></li>
              <li><Link href="/pdf-watermark" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">Watermark PDF</Link></li>
              <li><Link href="/pdf-sign" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">Sign PDF</Link></li>
              <li><Link href="/pdf-protect" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">Protect PDF</Link></li>
              <li><Link href="/pdf-unlock" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">Unlock PDF</Link></li>
              <li><Link href="/pdf-repair" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">Repair PDF</Link></li>
              <li><Link href="/pdf-crop" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">Crop PDF</Link></li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Company & Legal
            </h3>
            <ul className="mt-4 space-y-2 text-xs">
              <li><Link href="/about" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">About PDFToolkit</Link></li>
              <li><Link href="/contact" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">Contact & Support</Link></li>
              <li><Link href="/privacy-policy" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">Terms of Service</Link></li>
              <li><Link href="/blog" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">Guides & Articles</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row dark:border-slate-800">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} PDFToolkit. All rights reserved. Free online PDF utility platform.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <Link href="/privacy-policy" className="hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/contact" className="hover:underline">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
