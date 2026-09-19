import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  GLOBAL_PDF_KEYWORDS,
  ADSENSE_CLIENT,
  generateSiteNavigationJsonLd,
} from "@/lib/seo/metadata";

// Inter for UI/body, Bricolage Grotesque for display headlines — a deliberate
// pairing rather than a single default sans, so headings carry personality.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Free, fast, and 100% private online PDF tools. Compress, convert, edit, merge, split, OCR, and sign PDF documents directly in your web browser with zero server uploads.",
  keywords: GLOBAL_PDF_KEYWORDS,
  authors: [{ name: "PDFToolkit Team" }],
  creator: "PDFToolkit",
  publisher: "PDFToolkit",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "Powerful, private PDF suite in your browser. Compress to target size, convert, annotate, OCR, and sign PDFs securely.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "Free online PDF suite. 100% private, client-side browser processing.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClient = ADSENSE_CLIENT;

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    description:
      "PDFToolkit offers free, private, browser-based PDF tools to compress, convert, edit, merge, split, OCR, and sign PDF documents.",
  };

  // Primary navigation targets — the pool Google draws Sitelinks from.
  const siteNavigationSchema = generateSiteNavigationJsonLd([
    { name: "PDF Compressor", path: "/pdf-compressor" },
    { name: "PDF Editor", path: "/pdf-editor" },
    { name: "PDF Converter", path: "/pdf-converter" },
    { name: "Merge PDF", path: "/pdf-merge" },
    { name: "Split PDF", path: "/pdf-split" },
    { name: "PDF OCR", path: "/pdf-ocr" },
    { name: "PDF to Word", path: "/pdf-to-word" },
    { name: "Sign PDF", path: "/pdf-sign" },
    { name: "Blog", path: "/blog" },
    { name: "About", path: "/about" },
  ]);

  return (
    <html
      lang="en"
      className={`scroll-smooth ${inter.variable} ${bricolage.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* No-flash theme boot: applies the saved (or OS-preferred) theme
            before first paint so there is no flash of the wrong theme. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`,
          }}
        />
        {/* AdSense Script (Injected when client ID is configured) */}
        {adsenseClient && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema) }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased selection:bg-red-600 selection:text-white dark:bg-slate-950 dark:text-slate-100">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
