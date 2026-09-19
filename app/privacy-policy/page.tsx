import React from "react";
import { ShieldCheck, Lock, EyeOff, Server } from "lucide-react";
import { generateToolMetadata } from "@/lib/seo/metadata";
import { AdSlot } from "@/components/layout/AdSlot";

export const metadata = generateToolMetadata(
  "Privacy Policy — How We Protect Your Documents",
  "Learn how PDFToolkit protects your personal documents through client-side WebAssembly processing. We never store, log, or sell your files.",
  "/privacy-policy",
  ["privacy policy", "pdf privacy", "secure pdf processing"]
);

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <AdSlot slotId="privacy-top-banner" format="horizontal" />

      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Commitment to Security</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Privacy Policy
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Last Updated: March 2026. Your privacy is not an afterthought; it is the core design principle of PDFToolkit.
        </p>
      </div>

      <div className="mt-10 space-y-8 text-xs leading-relaxed text-slate-700 dark:text-slate-300 sm:text-sm">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <Lock className="h-5 w-5 text-emerald-600" />
            <h2>1. Document Handling: Zero Cloud Storage</h2>
          </div>
          <p className="mt-3">
            The fundamental distinction between PDFToolkit and traditional file converters is our browser-first execution model:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong>Client-Side Processing:</strong> All core PDF operations (compressing, editing, merging, splitting, OCR text recognition, watermarking, signing, rotating, cropping, page reorganizing, and image conversions) execute directly inside your device&apos;s browser using WebAssembly (Wasm) and HTML5 Canvas APIs.
            </li>
            <li>
              <strong>No Cloud Storage:</strong> Because files are processed in your device&apos;s local random-access memory (RAM), your files are not uploaded to, saved on, or retained by our servers.
            </li>
            <li>
              <strong>Immediate Memory Release:</strong> When you close your browser tab or click &quot;Reset&quot;, all document data is instantaneously purged from your device&apos;s volatile RAM.
            </li>
          </ul>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <EyeOff className="h-5 w-5 text-indigo-600" />
            <h2>2. Information We Do NOT Collect</h2>
          </div>
          <p className="mt-3">
            We do not collect:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>The contents, text, images, or metadata of your uploaded PDF documents.</li>
            <li>Names, addresses, phone numbers, or credit card details (our service is 100% free with no registration).</li>
            <li>Account credentials or personal identities.</li>
          </ul>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <Server className="h-5 w-5 text-amber-600" />
            <h2>3. Third-Party Advertising & Cookies (Google AdSense)</h2>
          </div>
          <p className="mt-3">
            PDFToolkit is funded through advertising served by Google AdSense:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites.
            </li>
            <li>
              Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to your sites and/or other sites on the Internet.
            </li>
            <li>
              Users may opt out of personalized advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-indigo-600 underline"
              >
                Google Ads Settings
              </a>.
            </li>
          </ul>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Compliance with GDPR and International Regulations
          </h2>
          <p className="mt-3">
            Because we do not store, process on cloud servers, or catalog your files, PDFToolkit inherently adheres to data minimization principles under the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).
          </p>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            5. Contact Us Regarding Privacy
          </h2>
          <p className="mt-3">
            If you have questions about this privacy statement, please contact us at:{" "}
            <a href="mailto:privacy@theaethersync.com" className="font-semibold text-indigo-600 underline">
              privacy@theaethersync.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
