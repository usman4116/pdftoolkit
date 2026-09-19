# DocuPulse — The Modern, Privacy-First Browser PDF Suite

**DocuPulse** is a production-ready, SEO-optimized PDF utility web application built with **Next.js 15+ (App Router)**, **TypeScript**, **Tailwind CSS**, **pdf-lib**, **PDF.js**, and **Tesseract.js**.

Designed for deployment on **Vercel** with monetization through **Google AdSense**, DocuPulse performs heavy document manipulation directly inside the user's browser via WebAssembly and Web Workers.

---

## Key Features

- **Intelligent Target-Size PDF Compressor**: Iterative multi-pass optimization targeting exact output file sizes (e.g. 2 MB, 500 KB) with DPI scaling, JPEG matrix compression, and grayscale options.
- **Universal PDF Preview (`PdfPreview`)**: Powered by PDF.js with progressive page rendering, zoom controls (50%–300%), fit-to-width, thumbnail sidebar navigation, and mobile touch support.
- **Full Browser PDF Editor**: Add text, freehand draw, highlight, vector shapes (rectangles, circles, arrows), custom image insertion, and visual signature pad (draw/type/upload).
- **Multi-Language Optical Character Recognition (OCR)**: Client-side neural recognition in English, Urdu, Arabic, Spanish, French, and German using Tesseract.js. Export to TXT, Word (.docx), or dual-layer searchable PDF.
- **Document Conversions**: PDF to Word (.docx), Word to PDF, PDF to JPG/PNG (with ZIP download), JPG/PNG to PDF, and plain text extraction.
- **Organization & Security**: Merge multiple PDFs with drag-and-drop ordering, split by page ranges, organize pages grid (reorder, duplicate, rotate, delete), password protect & unlock, structural diagnostics/repair, and margin cropping.
- **Monetization & AdSense Ready**: Policy-compliant `AdSlot` components placed strictly away from interactive controls and buttons. Controlled via `NEXT_PUBLIC_ADSENSE_CLIENT`.
- **Comprehensive SEO & Blog System**: Dynamic `sitemap.xml`, `robots.txt`, rich JSON-LD schemas (`WebApplication`, `FAQPage`, `BreadcrumbList`, `BlogPosting`), and 9 in-depth technical guides.

---

## Quick Start & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` to set your site URL and AdSense client ID:
```env
NEXT_PUBLIC_SITE_URL=https://docupulse.com
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 4. Build for Production
```bash
npm run build
```

### 5. Start Production Server
```bash
npm run start
```

---

## Vercel Deployment

DocuPulse is engineered to run seamlessly within Vercel's serverless runtime environment:

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Import the project in the [Vercel Dashboard](https://vercel.com/new).
3. Under **Environment Variables**, configure:
   - `NEXT_PUBLIC_SITE_URL`: Your custom production domain (e.g. `https://your-domain.com`).
   - `NEXT_PUBLIC_ADSENSE_CLIENT`: Your Google AdSense publisher ID.
4. Click **Deploy**. Vercel will build and serve the application across its edge network with zero server maintenance.

---

## Architecture Overview

```
docupulse/
├── app/                  # Next.js 15 App Router pages, layouts, and API routes
│   ├── layout.tsx        # Global shell with Navbar, Footer, JSON-LD, AdSense
│   ├── page.tsx          # Premium landing page with tool directory and FAQs
│   ├── sitemap.ts        # Dynamic XML sitemap generator
│   ├── robots.ts         # Search engine crawler directives
│   ├── pdf-compressor/   # Intelligent target-size compression tool
│   ├── pdf-editor/       # Interactive browser PDF editor
│   ├── pdf-ocr/          # Multi-language OCR and searchable PDF maker
│   ├── pdf-merge/        # Multi-file PDF merger
│   ├── pdf-split/        # Page extractor and range splitter
│   ├── pdf-to-word/      # PDF to editable DOCX converter
│   ├── word-to-pdf/      # Word DOCX to PDF converter
│   ├── pdf-to-jpg/       # PDF to high-res JPG/PNG with ZIP download
│   ├── jpg-to-pdf/       # Images to unified PDF document
│   ├── pdf-pages/        # Visual card grid page organizer
│   ├── pdf-watermark/    # Text & image watermarker
│   ├── pdf-rotate/       # Permanent page rotator
│   ├── pdf-sign/         # Electronic signature pad
│   ├── pdf-protect/      # Document encryption
│   ├── pdf-unlock/       # Permission & password unlocker
│   ├── pdf-repair/       # Corrupted PDF recovery & reconstruction
│   ├── pdf-crop/         # Visual margin trimmer
│   ├── pdf-extract-text/ # Plain text stream parser
│   ├── blog/             # 9 in-depth SEO guides & dynamic article template
│   └── api/convert/      # Serverless route handler fallback
├── components/           # Reusable UI, Uploader, Preview, Editor, and AdSlot components
├── lib/                  # Core client-side processing engines
│   ├── pdf/              # pdf-lib, pdfjs-dist initialization and manipulation
│   ├── ocr/              # Tesseract.js neural OCR worker
│   ├── word/             # Mammoth & docx parsing and formatting
│   ├── processor/        # PdfProcessor abstraction layer
│   └── seo/              # Structured data and metadata generators
└── public/               # Static assets & pdf.worker.min.mjs
```

---

## License & Privacy

DocuPulse processes documents directly in browser memory. Documents are never stored or logged on remote servers. Released under the MIT License.
