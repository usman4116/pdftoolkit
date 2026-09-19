import React from "react";
import Link from "next/link";
import { ShieldCheck, Cpu, Heart, Lock, ArrowRight } from "lucide-react";
import { generateToolMetadata } from "@/lib/seo/metadata";
import { AdSlot } from "@/components/layout/AdSlot";

export const metadata = generateToolMetadata(
  "About PDFToolkit — The Privacy-First PDF Suite",
  "Learn about PDFToolkit's mission to make PDF processing free, lightning fast, and 100% private through browser-side WebAssembly technology.",
  "/about",
  ["about pdftoolkit", "private pdf tools", "client side pdf processing"]
);

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <AdSlot slotId="about-top-banner" format="horizontal" />

      <div className="text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Our Mission
        </span>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
          PDF Tools Built for Privacy & Speed
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-300">
          PDFToolkit was born out of a simple frustration: why should converting or compressing a 2-page document require uploading private contracts and medical records to remote cloud servers?
        </p>
      </div>

      <div className="mt-12 space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            The Client-Side Revolution
          </h2>
          <p className="mt-3">
            Traditional online PDF converters upload your files to server farms, queue them behind thousands of other users, and temporarily store them on third-party hard drives. This creates serious data leakage risks, slow turnaround times, and file size restrictions.
          </p>
          <p className="mt-3">
            At PDFToolkit, we took a radically different architectural path. By compiling battle-tested PDF engines directly into **WebAssembly** and executing tasks via **Web Workers** and **HTML5 Canvas**, your documents are processed locally inside your web browser.
          </p>
        </section>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">100% Private</h3>
            <p className="mt-1 text-xs text-slate-500">
              Zero cloud uploads. Your documents never touch external databases or remote storage.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">Client Hardware</h3>
            <p className="mt-1 text-xs text-slate-500">
              Leverages your computer&apos;s multi-core CPU for blazing-fast local processing.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <Heart className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">100% Free</h3>
            <p className="mt-1 text-xs text-slate-500">
              No subscriptions, hidden credit card prompts, or daily trial limits.
            </p>
          </div>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Ethical Monetization
          </h2>
          <p className="mt-3">
            We believe productivity software should be accessible to everyone worldwide. PDFToolkit is supported through non-intrusive Google AdSense advertising placed in clearly labeled, non-obstructive zones. We never lock features behind paywalls or sell user data.
          </p>
          <div className="mt-6">
            <Link
              href="/pdf-compressor"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700"
            >
              <span>Explore Our Free Tools</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
