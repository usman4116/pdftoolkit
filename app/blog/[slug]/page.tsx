import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Calendar, Clock, ArrowLeft, ArrowRight, Sparkles, User } from "lucide-react";
import { BLOG_POSTS, getBlogPostBySlug } from "@/lib/blog-data";
import { SITE_NAME, SITE_URL } from "@/lib/seo/metadata";
import { AdSlot } from "@/components/layout/AdSlot";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  const url = `${SITE_URL}/blog/${slug}`;

  return {
    title: `${post.title} | ${SITE_NAME}`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
  };

  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Top Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-red-600">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-red-600">Blog</Link>
        <span>/</span>
        <span className="truncate text-slate-400">{post.category}</span>
      </div>

      <AdSlot slotId="blog-post-top-banner" format="horizontal" />

      {/* Article Header */}
      <header className="border-b border-slate-200 pb-8 dark:border-slate-800">
        <span className="rounded-lg bg-red-50 px-3 py-1 text-xs font-bold text-red-600 dark:bg-red-950 dark:text-red-300">
          {post.category}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
          {post.title}
        </h1>
        <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {post.author}</span>
          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {post.publishedAt}</span>
          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {post.readTime}</span>
        </div>
      </header>

      {/* Related Tool CTA banner if post is linked to a tool */}
      {post.relatedToolHref && post.relatedToolName && (
        <div className="my-8 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50/70 p-4 dark:border-red-900/60 dark:bg-red-950/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Try the Free Tool Mentioned in this Guide
              </p>
              <p className="text-[11px] text-slate-500">
                100% private, client-side browser utility
              </p>
            </div>
          </div>
          <Link
            href={post.relatedToolHref}
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-red-700"
          >
            <span>Open {post.relatedToolName}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Article Content Rendered */}
      <div className="prose prose-slate mt-8 max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-red-600 prose-code:text-red-600">
        {post.content.split("\n\n").map((paragraph, idx) => {
          if (paragraph.startsWith("## ")) {
            return (
              <h2 key={idx} className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">
                {paragraph.replace("## ", "")}
              </h2>
            );
          }
          if (paragraph.startsWith("### ")) {
            return (
              <h3 key={idx} className="mt-6 text-xl font-bold text-slate-800 dark:text-slate-100">
                {paragraph.replace("### ", "")}
              </h3>
            );
          }
          if (paragraph.startsWith("> ")) {
            return (
              <blockquote key={idx} className="my-4 border-l-4 border-red-600 bg-slate-50 p-4 text-xs italic text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                {paragraph.replace("> ", "")}
              </blockquote>
            );
          }
          return (
            <p key={idx} className="my-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* In-Article AdSlot */}
      <AdSlot slotId="blog-post-content-banner" format="horizontal" />

      {/* Bottom Back Button & Related Guides */}
      <div className="mt-14 border-t border-slate-200 pt-8 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-red-600 dark:text-slate-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Guides</span>
          </Link>
          <span className="text-xs text-slate-400">Share this guide</span>
        </div>

        {/* More Articles */}
        <div className="mt-8">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            More Helpful PDF Guides
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {otherPosts.map((other) => (
              <Link
                key={other.slug}
                href={`/blog/${other.slug}`}
                className="rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-red-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="text-[10px] font-bold text-red-600 uppercase">
                  {other.category}
                </span>
                <h4 className="mt-1 line-clamp-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  {other.title}
                </h4>
                <p className="mt-1 line-clamp-2 text-[11px] text-slate-400">
                  {other.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
