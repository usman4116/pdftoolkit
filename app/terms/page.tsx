import React from "react";
import { FileCheck, ShieldAlert } from "lucide-react";
import { generateToolMetadata } from "@/lib/seo/metadata";
import { AdSlot } from "@/components/layout/AdSlot";

export const metadata = generateToolMetadata(
  "Terms of Service — PDFToolkit",
  "Review the terms and conditions for using PDFToolkit's free browser-based PDF utilities.",
  "/terms",
  ["terms of service", "user agreement", "pdftoolkit terms"]
);

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <AdSlot slotId="terms-top-banner" format="horizontal" />

      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <FileCheck className="h-3.5 w-3.5" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Terms of Service
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Please read these terms carefully before utilizing our online PDF utilities.
        </p>
      </div>

      <div className="mt-10 space-y-8 text-xs leading-relaxed text-slate-700 dark:text-slate-300 sm:text-sm">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
          <p className="mt-3">
            By accessing or using PDFToolkit (&quot;we&quot;, &quot;our&quot;, or &quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please discontinue use of the website immediately.
          </p>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Ownership of Your Documents</h2>
          <p className="mt-3">
            You retain 100% intellectual property ownership, copyright, and legal rights to all files and documents that you process through PDFToolkit. We claim no ownership, licenses, or rights over your files.
          </p>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Permitted & Acceptable Use</h2>
          <p className="mt-3">
            You agree to use PDFToolkit exclusively for lawful personal and commercial purposes. You may not:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Attempt to reverse engineer, disrupt, or overload the platform infrastructure.</li>
            <li>Use the platform to distribute malware, trojans, or illegal materials.</li>
            <li>Attempt to bypass security controls on documents for which you do not possess legal rights or authorized access.</li>
          </ul>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <ShieldAlert className="h-5 w-5 text-amber-600" />
            <h2>4. Electronic Signature & Legal Notice</h2>
          </div>
          <p className="mt-3">
            Our electronic signature tool stamps visual signatures onto document pages. Users are solely responsible for ensuring that an electronic visual signature meets the specific evidentiary and legal requirements of their governing jurisdiction. For transactions requiring cryptographic certification (such as qualified trust service provider certificates), dedicated hardware tokens or PKI providers should be used.
          </p>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">5. Disclaimer of Warranties & Limitation of Liability</h2>
          <p className="mt-3">
            PDFToolkit is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied. In no event shall PDFToolkit or its creators be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the service or any document loss.
          </p>
        </section>
      </div>
    </div>
  );
}
