import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.theaethersync.com";
export const SITE_NAME = "PDFToolkit";
export const SITE_TAGLINE = "Free, Fast & Secure Online PDF Tools";

// Broad PDF keyword base appended to every page for organic reach.
// Covers the standalone "pdf" term plus the most-searched PDF task queries.
export const GLOBAL_PDF_KEYWORDS = [
  "pdf",
  "pdf tools",
  "free pdf tools",
  "online pdf tools",
  "pdf editor",
  "pdf converter",
  "pdf compressor",
  "compress pdf",
  "merge pdf",
  "split pdf",
  "edit pdf",
  "convert pdf",
  "pdf to word",
  "word to pdf",
  "pdf to jpg",
  "jpg to pdf",
  "pdf ocr",
  "rotate pdf",
  "crop pdf",
  "sign pdf",
  "unlock pdf",
  "protect pdf",
  "watermark pdf",
  "repair pdf",
  "extract text from pdf",
  "organize pdf pages",
  "browser pdf editor",
  "pdf toolkit",
  "pdftoolkit",
];

export function generateToolMetadata(
  title: string,
  description: string,
  path: string,
  keywords: string[] = []
): Metadata {
  const url = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    keywords: Array.from(new Set([...keywords, ...GLOBAL_PDF_KEYWORDS])),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generateWebApplicationJsonLd(
  name: string,
  description: string,
  path: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${name} — ${SITE_NAME}`,
    description,
    url: `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "All (Browser-based)",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    browserRequirements: "Requires modern web browser with HTML5 and WebAssembly support",
  };
}

export function generateFaqJsonLd(faqs: { question: string; answer: string }[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbJsonLd(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.item.startsWith("/") ? crumb.item : `/${crumb.item}`}`,
    })),
  };
}

/**
 * SiteNavigationElement schema — signals the primary navigation targets to
 * Google. This is one of the structured-data signals that improves the chance
 * of Google generating Sitelinks under the brand result. Sitelinks remain
 * fully algorithmic; this markup helps Google understand the site hierarchy
 * but does not guarantee them.
 */
export function generateSiteNavigationJsonLd(
  links: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_NAME} Navigation`,
    itemListElement: links.map((link, idx) => ({
      "@type": "SiteNavigationElement",
      position: idx + 1,
      name: link.name,
      url: `${SITE_URL}${link.path.startsWith("/") ? link.path : `/${link.path}`}`,
    })),
  };
}
