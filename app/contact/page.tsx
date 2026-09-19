"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, CheckCircle2, Send, HelpCircle } from "lucide-react";
import { AdSlot } from "@/components/layout/AdSlot";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Feedback",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <AdSlot slotId="contact-top-banner" format="horizontal" />

      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
          <Mail className="h-3.5 w-3.5" />
          <span>Get in Touch</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
          Contact & Support
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Have a question about browser PDF processing, feature suggestion, or bug report? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Quick Answers
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Before submitting a message, check out our frequently asked questions on our individual tool pages or browse our comprehensive blog guides.
            </p>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <HelpCircle className="h-4 w-4 text-red-600" />
                <span>Files are processed locally in your browser</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <HelpCircle className="h-4 w-4 text-red-600" />
                <span>No daily upload caps or limits</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <HelpCircle className="h-4 w-4 text-red-600" />
                <span>100% free with no registration</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Direct Contact
            </h3>
            <p className="mt-2 text-xs text-slate-500">
              Email support: <a href="mailto:support@theaethersync.com" className="font-semibold text-red-600 hover:underline">support@theaethersync.com</a>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Response time: Within 24–48 business hours.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                  Message Sent!
                </h3>
                <p className="mt-1 max-w-sm text-xs text-slate-500">
                  Thank you for contacting PDFToolkit. We have received your inquiry and will review your message shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", subject: "Feedback", message: "" });
                  }}
                  className="mt-6 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-red-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Your Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-red-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Subject / Topic
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-red-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Feedback">General Feedback</option>
                    <option value="Bug">Report a Bug / File Issue</option>
                    <option value="Feature">Feature Suggestion</option>
                    <option value="Partnership">Advertising & Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what's on your mind..."
                    className="mt-1.5 w-full resize-none rounded-xl border border-slate-300 bg-white p-3 text-xs font-medium text-slate-900 focus:border-red-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-xs font-bold text-white shadow-md shadow-red-500/25 hover:bg-red-700"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
