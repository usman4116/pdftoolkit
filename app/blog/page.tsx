"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Calendar, Clock, ArrowRight, Search, Sparkles } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog-data";
import { AdSlot } from "@/components/layout/AdSlot";

export default function BlogIndexPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", "Compress", "Convert", "Edit", "Organize", "OCR", "Images"];

  const filtered = BLOG_POSTS.filter((post) => {
    const matchesCat = category === "All" || post.category === category;
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      post.content.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const featured = BLOG_POSTS[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <AdSlot slotId="blog-top-banner" format="horizontal" />

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Knowledge Base & Technical Guides</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
          PDF Tutorials, Tips & Insights
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          In-depth guides on PDF compression algorithms, document conversions, OCR technology, browser-based editing, and document security.
        </p>
      </div>

      {/* Search & Categories */}
      <div className="mt-10 flex flex-col items-center justify-between gap-4 md:flex-row">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                category === cat
                  ? "bg-red-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs text-slate-900 focus:border-red-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Featured Article Card */}
      {featured && category === "All" && !search && (
        <div className="mt-8">
          <Link
            href={`/blog/${featured.slug}`}
            className="group relative block overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-red-400 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-10"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400">
              <Sparkles className="h-4 w-4" />
              <span>FEATURED GUIDE</span>
            </div>
            <h2 className="mt-4 text-2xl font-extrabold text-slate-900 group-hover:text-red-600 sm:text-3xl dark:text-white dark:group-hover:text-red-400">
              {featured.title}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {featured.excerpt}
            </p>
            <div className="mt-6 flex items-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {featured.publishedAt}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {featured.readTime}</span>
              <span className="ml-auto inline-flex items-center gap-1 font-bold text-red-600 group-hover:underline dark:text-red-400">
                Read Article <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* Articles Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-red-400 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="rounded-lg bg-red-50 px-2.5 py-1 font-bold text-red-600 dark:bg-red-950 dark:text-red-300">
                  {post.category}
                </span>
                <span className="text-slate-400">{post.readTime}</span>
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-red-600 dark:text-white dark:group-hover:text-red-400">
                {post.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {post.excerpt}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500 dark:border-slate-800">
              <span>{post.publishedAt}</span>
              <span className="flex items-center gap-1 text-red-600 group-hover:underline dark:text-red-400">
                Read &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>

      <AdSlot slotId="blog-bottom-banner" format="horizontal" />
    </div>
  );
}
