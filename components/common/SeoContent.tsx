import React from "react";
import Link from "next/link";
import { CheckCircle, ShieldCheck, Zap, Laptop, ArrowRight } from "lucide-react";
import { ToolItem } from "@/lib/tools-data";

interface SeoContentProps {
  tool: ToolItem;
  relatedTools?: ToolItem[];
}

export function SeoContent({ tool, relatedTools = [] }: SeoContentProps) {
  return (
    <article className="my-14 border-t border-slate-200/80 pt-14 dark:border-slate-800/80">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Step by step guide */}
        <section>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
              1
            </span>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              How to Use {tool.name} Online
            </h2>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Follow these simple steps to process your document with maximum privacy and speed:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {tool.howToSteps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-red-50 text-xs font-bold text-red-600 dark:bg-red-950 dark:text-red-400">
                  {idx + 1}
                </div>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Feature highlight grid */}
        <section className="rounded-3xl border border-slate-200/80 bg-slate-50/50 p-6 sm:p-8 dark:border-slate-800/80 dark:bg-slate-900/30">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Why Use PDFToolkit for {tool.name}?
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                100% Privacy Guarantee
              </h3>
              <p className="text-xs leading-relaxed text-slate-500">
                Your file is never uploaded to remote servers. The algorithm runs locally in your browser memory via WebAssembly.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Instant Processing
              </h3>
              <p className="text-xs leading-relaxed text-slate-500">
                Skip long server queues and network bottlenecks. Documents are rendered and transformed at client-side hardware speeds.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                <Laptop className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Universal Compatibility
              </h3>
              <p className="text-xs leading-relaxed text-slate-500">
                Works seamlessly on Google Chrome, Apple Safari, Firefox, and Microsoft Edge across Windows, macOS, Linux, and iOS.
              </p>
            </div>
          </div>
        </section>

        {/* Related tools */}
        {relatedTools.length > 0 && (
          <section>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Related PDF Utilities
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {relatedTools.map((rel) => (
                <Link
                  key={rel.id}
                  href={rel.href}
                  className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-red-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-red-600 dark:text-slate-200 dark:group-hover:text-red-400">
                    {rel.name}
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-red-600" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
