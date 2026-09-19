export interface ToolItem {
  id: string;
  name: string;
  href: string;
  category: "Compress" | "Convert" | "Edit" | "Organize" | "OCR" | "Security" | "Images";
  description: string;
  tagline: string;
  iconName: string;
  popular?: boolean;
  acceptedTypes: string[];
  maxFileSizeMB: number;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  faqs: { question: string; answer: string }[];
  howToSteps: string[];
}

export const TOOLS: ToolItem[] = [
  {
    id: "pdf-compressor",
    name: "PDF Compressor",
    href: "/pdf-compressor",
    category: "Compress",
    description: "Compress PDF files online to exact target sizes (e.g. 2MB, 500KB) with quality controls.",
    tagline: "Reduce PDF file size without sacrificing clarity.",
    iconName: "FileDown",
    popular: true,
    acceptedTypes: [".pdf", "application/pdf"],
    maxFileSizeMB: 100,
    seoTitle: "Free PDF Compressor Online – Target Size & Presets",
    seoDescription: "Compress PDF files online for free. Set a custom target file size (e.g. 2 MB or 500 KB), adjust image quality and DPI, preview before downloading, and reduce size safely in your browser.",
    keywords: ["compress pdf", "reduce pdf size", "target size pdf compressor", "pdf compressor 2mb", "free pdf reducer", "online pdf compression"],
    howToSteps: [
      "Upload your PDF file from your device or drag and drop it into the upload box.",
      "Select a compression preset or enter your custom Target File Size (e.g., 2.0 MB or 500 KB).",
      "Optionally configure advanced image DPI, quality, and grayscale settings.",
      "Click 'Compress PDF' to run our intelligent multi-pass compression algorithm.",
      "Preview the compressed output and download your optimized PDF instantly."
    ],
    faqs: [
      {
        question: "How does the Target Size compression work?",
        answer: "Our intelligent multi-pass algorithm analyzes your PDF's embedded imagery and vector streams, calculating calibrated DPI and JPEG compression factors to land as close as technically possible to your desired target size."
      },
      {
        question: "Are my files uploaded to an external server?",
        answer: "No. All core compression algorithms execute entirely in your browser using Web Workers and HTML5 Canvas processing. Your sensitive documents never leave your machine."
      },
      {
        question: "Will compression reduce text sharpness?",
        answer: "PDFToolkit preserves all native vector text and typography. Image-heavy elements are intelligently downsampled, keeping text razor-sharp for reading and printing."
      }
    ]
  },
  {
    id: "pdf-merge",
    name: "Merge PDF",
    href: "/pdf-merge",
    category: "Organize",
    description: "Combine multiple PDF documents into a single unified file in seconds.",
    tagline: "Combine PDF files in the exact order you want.",
    iconName: "Merge",
    popular: true,
    acceptedTypes: [".pdf", "application/pdf"],
    maxFileSizeMB: 100,
    seoTitle: "Merge PDF Files Online – Free PDF Combiner",
    seoDescription: "Combine multiple PDF documents into one single PDF online. Drag and drop to reorder pages, preview thumbnails, and merge files quickly and securely in your browser.",
    keywords: ["merge pdf", "combine pdf files", "pdf joiner", "combine pdfs into one", "free pdf merge"],
    howToSteps: [
      "Select or drag multiple PDF files into the merger dropzone.",
      "Drag and drop or use arrow buttons to arrange documents in your desired sequence.",
      "Click 'Merge PDFs' to combine all pages into one document.",
      "Download your combined PDF file instantly."
    ],
    faqs: [
      {
        question: "Is there a limit to how many PDFs I can merge?",
        answer: "You can merge dozens of files simultaneously depending on your device's memory. All processing takes place locally on your computer."
      },
      {
        question: "Can I reorder individual pages between documents?",
        answer: "Yes! You can reorder files in the merge tool, or use our dedicated PDF Pages organizer to freely move individual pages across documents."
      }
    ]
  },
  {
    id: "pdf-split",
    name: "Split PDF",
    href: "/pdf-split",
    category: "Organize",
    description: "Extract specific pages or page ranges, or split into separate documents.",
    tagline: "Separate PDF pages or save custom page ranges.",
    iconName: "Split",
    popular: true,
    acceptedTypes: [".pdf", "application/pdf"],
    maxFileSizeMB: 100,
    seoTitle: "Split PDF Online – Extract Pages or Separate Ranges",
    seoDescription: "Split PDF pages or extract custom page ranges (e.g. 1-3, 5, 8-10) for free. Download extracted pages as individual PDFs or bundled in a clean ZIP archive.",
    keywords: ["split pdf", "extract pdf pages", "separate pdf", "pdf page extractor", "split pdf free"],
    howToSteps: [
      "Upload the PDF document you want to split.",
      "Choose a split mode: Extract Selected Pages, Split Every N Pages, or Custom Range (e.g., 1-3, 5).",
      "Preview the pages and verify your selection.",
      "Click 'Split PDF' and download your individual documents or convenient ZIP archive."
    ],
    faqs: [
      {
        question: "How do custom page ranges work?",
        answer: "You can enter standard page ranges separated by commas or hyphens, such as '1-5, 8, 11-14'. Only the requested pages will be extracted."
      },
      {
        question: "Can I download all pages as separate files?",
        answer: "Yes, select 'Split into Individual Pages' to generate an individual PDF for each page, packed neatly into a downloadable ZIP archive."
      }
    ]
  },
  {
    id: "pdf-editor",
    name: "PDF Editor",
    href: "/pdf-editor",
    category: "Edit",
    description: "Add text, annotations, shapes, drawings, images, and signatures directly in your browser.",
    tagline: "Edit and annotate PDFs directly in your browser without software installs.",
    iconName: "PenTool",
    popular: true,
    acceptedTypes: [".pdf", "application/pdf"],
    maxFileSizeMB: 80,
    seoTitle: "Free PDF Editor Online – Annotate, Draw, Sign & Add Text",
    seoDescription: "Edit PDF files directly in your web browser. Add text, highlights, shapes (rectangles, circles, arrows), freehand drawings, signatures, and images with real-time preview and instant download.",
    keywords: ["pdf editor online", "edit pdf free", "annotate pdf", "draw on pdf", "add text to pdf", "browser pdf editor"],
    howToSteps: [
      "Upload your PDF document to the editor.",
      "Select a tool from the top toolbar: Text, Draw, Highlight, Shape, Image, or Signature.",
      "Click or drag on the PDF preview canvas to insert annotations, adjust styles, colors, and font sizes.",
      "Navigate across pages using the left thumbnail sidebar.",
      "Click 'Export & Download' to burn all annotations into a high-quality downloadable PDF."
    ],
    faqs: [
      {
        question: "Are annotations permanently embedded into the PDF?",
        answer: "Yes! When you click export, PDFToolkit burns your vector text, drawings, shapes, and stamps directly into the PDF object stream so they appear identically in any PDF reader."
      },
      {
        question: "Does the editor support signatures?",
        answer: "Yes, you can draw a signature with your mouse/touchscreen, type your name in cursive, or upload an image of your signature."
      }
    ]
  },
  {
    id: "pdf-ocr",
    name: "PDF OCR",
    href: "/pdf-ocr",
    category: "OCR",
    description: "Extract text from scanned PDFs and images with multi-language recognition.",
    tagline: "Recognize and extract text from scanned documents in 6+ languages.",
    iconName: "ScanText",
    popular: true,
    acceptedTypes: [".pdf", ".png", ".jpg", ".jpeg", "application/pdf", "image/png", "image/jpeg"],
    maxFileSizeMB: 50,
    seoTitle: "Free PDF OCR Online – Optical Character Recognition",
    seoDescription: "Convert scanned PDFs and images into editable text using browser-based OCR. Supports English, Urdu, Arabic, Spanish, French, and German. Export to TXT, Word (.docx), or searchable PDF.",
    keywords: ["pdf ocr online", "extract text from scanned pdf", "optical character recognition", "scanned pdf to text", "ocr arabic urdu english"],
    howToSteps: [
      "Upload a scanned PDF or document image.",
      "Choose the recognition language (English, Urdu, Arabic, Spanish, French, German).",
      "Click 'Run OCR' and track real-time character recognition progress.",
      "Edit or copy the recognized text, or download as TXT, Word (.docx), or Searchable PDF."
    ],
    faqs: [
      {
        question: "Does OCR run in my browser?",
        answer: "Yes, our OCR engine is powered by client-side WebAssembly (Tesseract.js). The recognition models run locally on your CPU/GPU without transmitting your confidential documents to external servers."
      },
      {
        question: "Which languages are supported?",
        answer: "PDFToolkit currently supports English, Urdu, Arabic, Spanish, French, German, and Chinese."
      }
    ]
  },
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    href: "/pdf-to-jpg",
    category: "Images",
    description: "Convert every page of your PDF into high-resolution JPG or PNG images.",
    tagline: "Extract PDF pages into crisp, high-resolution image files.",
    iconName: "Image",
    popular: true,
    acceptedTypes: [".pdf", "application/pdf"],
    maxFileSizeMB: 80,
    seoTitle: "Convert PDF to JPG Online – High Resolution Image Converter",
    seoDescription: "Convert PDF pages to high-quality JPG or PNG images online for free. Choose resolution DPI (150/300 DPI) and download single images or all pages in a convenient ZIP file.",
    keywords: ["pdf to jpg", "convert pdf to image", "pdf to png", "extract images from pdf", "pdf to jpeg"],
    howToSteps: [
      "Upload your PDF document.",
      "Select your preferred output format (JPG or PNG) and image quality / DPI.",
      "Preview rendered page thumbnails in real-time.",
      "Download individual page images or click 'Download All (ZIP)' to get all pages at once."
    ],
    faqs: [
      {
        question: "What resolution are the extracted JPG images?",
        answer: "You can choose between Standard (150 DPI) for fast web sharing or High Definition (300 DPI) for crisp print-quality reproductions."
      }
    ]
  },
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    href: "/jpg-to-pdf",
    category: "Images",
    description: "Convert JPG, PNG, and WEBP images into an organized, high-quality PDF.",
    tagline: "Turn multiple photos and images into a single PDF document.",
    iconName: "FileImage",
    popular: true,
    acceptedTypes: [".jpg", ".jpeg", ".png", ".webp", "image/jpeg", "image/png", "image/webp"],
    maxFileSizeMB: 80,
    seoTitle: "Convert JPG to PDF Online – Combine Images to PDF",
    seoDescription: "Convert JPG, PNG, and WEBP images into a clean PDF document online. Adjust page orientation, margins, and image ordering before downloading your new PDF.",
    keywords: ["jpg to pdf", "convert images to pdf", "png to pdf", "combine pictures into pdf", "photo to pdf"],
    howToSteps: [
      "Upload one or multiple JPG, PNG, or WEBP images.",
      "Reorder images by dragging them into the desired sequence.",
      "Select page layout: Page size (A4 / US Letter / Fit to Image) and margin settings.",
      "Click 'Create PDF' and download your new document immediately."
    ],
    faqs: [
      {
        question: "Can I combine multiple pictures into one PDF?",
        answer: "Yes! You can upload dozens of photos at once, reorder them as you like, and compile them into a multi-page PDF."
      }
    ]
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    href: "/pdf-to-word",
    category: "Convert",
    description: "Convert PDF documents into editable Word (.docx) files with preserved text.",
    tagline: "Turn non-editable PDFs into editable Microsoft Word documents.",
    iconName: "FileText",
    popular: true,
    acceptedTypes: [".pdf", "application/pdf"],
    maxFileSizeMB: 80,
    seoTitle: "Convert PDF to Word Online – Free PDF to DOCX Converter",
    seoDescription: "Convert PDF documents to editable Microsoft Word (.docx) files for free. Fast text extraction with layout preservation, OCR fallback for scanned docs, and instant browser downloads.",
    keywords: ["pdf to word", "pdf to docx", "convert pdf to editable word", "free pdf to docx converter"],
    howToSteps: [
      "Upload your PDF document.",
      "Review the document preview and select conversion mode (Standard Text or Scanned OCR).",
      "Click 'Convert to Word'.",
      "Download your editable Microsoft Word (.docx) file."
    ],
    faqs: [
      {
        question: "Will the generated Word document be fully editable?",
        answer: "Yes! Text paragraphs, headings, and tables are structured cleanly into genuine Word (.docx) elements compatible with Microsoft Word, Google Docs, and LibreOffice."
      }
    ]
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    href: "/word-to-pdf",
    category: "Convert",
    description: "Convert Word documents (.docx) into standardized, universal PDF files.",
    tagline: "Easily convert DOCX files into beautiful, print-ready PDFs.",
    iconName: "FileType",
    popular: true,
    acceptedTypes: [".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    maxFileSizeMB: 50,
    seoTitle: "Convert Word to PDF Online – Free DOCX to PDF",
    seoDescription: "Convert Microsoft Word documents (.docx) into universal PDF files online. Preserves headings, styling, typography, and page structure directly in your browser.",
    keywords: ["word to pdf", "convert docx to pdf", "word document to pdf", "free word to pdf"],
    howToSteps: [
      "Upload your Microsoft Word (.docx) file.",
      "Preview the rendered document layout.",
      "Click 'Convert to PDF'.",
      "Download your standardized PDF ready for printing or sharing."
    ],
    faqs: [
      {
        question: "Does this require Microsoft Office to be installed?",
        answer: "No. The document is parsed and rendered directly using modern browser document engines with zero external software needed."
      }
    ]
  },
  {
    id: "pdf-converter",
    name: "PDF Converter Hub",
    href: "/pdf-converter",
    category: "Convert",
    description: "All-in-one conversion center between PDF, Word, Images, and Text.",
    tagline: "Convert to and from PDF in any format with one click.",
    iconName: "ArrowLeftRight",
    popular: false,
    acceptedTypes: [".pdf", ".docx", ".jpg", ".jpeg", ".png"],
    maxFileSizeMB: 80,
    seoTitle: "All-in-One Online PDF Converter – Convert Anything to PDF",
    seoDescription: "The ultimate PDF conversion hub. Convert PDF to Word, JPG, PNG, Text, or convert Word and images to PDF with high fidelity and zero software required.",
    keywords: ["pdf converter", "convert to pdf", "pdf to image", "pdf to docx hub"],
    howToSteps: [
      "Select the conversion mode you need (e.g., PDF to Word, JPG to PDF).",
      "Upload your source files.",
      "Customize formatting and resolution options.",
      "Download your converted files instantly."
    ],
    faqs: [
      {
        question: "Are all conversion tools free?",
        answer: "Yes, every tool on PDFToolkit is completely free with no registration or email address required."
      }
    ]
  },
  {
    id: "pdf-rotate",
    name: "Rotate PDF",
    href: "/pdf-rotate",
    category: "Organize",
    description: "Rotate specific pages or entire PDF files 90, 180, or 270 degrees.",
    tagline: "Fix upside-down or sideways pages in seconds.",
    iconName: "RotateCw",
    popular: false,
    acceptedTypes: [".pdf", "application/pdf"],
    maxFileSizeMB: 80,
    seoTitle: "Rotate PDF Pages Online – Free PDF Rotator",
    seoDescription: "Rotate PDF pages clockwise or counter-clockwise online. Rotate all pages or select specific pages to permanently correct document orientation.",
    keywords: ["rotate pdf", "turn pdf pages", "rotate pdf online", "fix upside down pdf"],
    howToSteps: [
      "Upload your PDF document.",
      "Choose to rotate all pages or click individual page cards to rotate them.",
      "Click 90° Clockwise, 90° Counter-Clockwise, or 180°.",
      "Click 'Apply & Download' to save the rotated PDF."
    ],
    faqs: [
      {
        question: "Will the rotation stay permanently when opened on other computers?",
        answer: "Yes, PDFToolkit modifies the official `/Rotate` metadata dictionary and page viewport matrix in the PDF format so all PDF viewers display the new orientation."
      }
    ]
  },
  {
    id: "pdf-watermark",
    name: "Watermark PDF",
    href: "/pdf-watermark",
    category: "Security",
    description: "Stamp customized text or image watermarks with full opacity and angle controls.",
    tagline: "Protect your documents with custom text or image watermarks.",
    iconName: "Stamp",
    popular: false,
    acceptedTypes: [".pdf", "application/pdf"],
    maxFileSizeMB: 80,
    seoTitle: "Add Watermark to PDF Online – Text & Image Watermarks",
    seoDescription: "Add custom text or image watermarks to your PDF online. Control watermark position, transparency, font size, color, and rotation angle before downloading.",
    keywords: ["watermark pdf", "add watermark to pdf", "stamp pdf", "confidential watermark"],
    howToSteps: [
      "Upload your PDF file.",
      "Enter your custom watermark text (e.g. 'CONFIDENTIAL', 'DRAFT') or upload a logo image.",
      "Configure font size, color, opacity (transparency), and rotation angle.",
      "Choose position (Center, Diagonal, or Corners) and page scope (All Pages, Odd, Even).",
      "Preview the watermarked result and download."
    ],
    faqs: [
      {
        question: "Can the watermark be easily removed by others?",
        answer: "PDFToolkit embeds the watermark directly into the content stream of the page, ensuring it appears behind or over the text exactly as specified."
      }
    ]
  },
  {
    id: "pdf-pages",
    name: "Organize PDF Pages",
    href: "/pdf-pages",
    category: "Organize",
    description: "Visual grid to reorder, delete, duplicate, rotate, and extract PDF pages.",
    tagline: "Rearrange, delete, and manage pages visually with drag and drop.",
    iconName: "Layers",
    popular: false,
    acceptedTypes: [".pdf", "application/pdf"],
    maxFileSizeMB: 80,
    seoTitle: "Organize PDF Pages Online – Reorder, Delete & Rotate",
    seoDescription: "Visually organize PDF pages in a responsive card grid. Drag and drop to reorder, delete unwanted pages, duplicate pages, or extract selections into a new PDF.",
    keywords: ["organize pdf pages", "reorder pdf", "delete pages from pdf", "duplicate pdf page"],
    howToSteps: [
      "Upload your PDF to view all pages in a visual thumbnail grid.",
      "Drag and drop thumbnails to reorder pages.",
      "Hover over any page to delete, duplicate, or rotate it.",
      "Click 'Save New PDF' to download your reorganized document."
    ],
    faqs: [
      {
        question: "Can I delete multiple pages at once?",
        answer: "Yes, you can click the trash icon on any page card to mark it for removal before saving."
      }
    ]
  },
  {
    id: "pdf-sign",
    name: "Sign PDF",
    href: "/pdf-sign",
    category: "Security",
    description: "Draw, type, or upload your electronic signature and place it onto any page.",
    tagline: "Electronically sign PDF documents with ease.",
    iconName: "FileSignature",
    popular: false,
    acceptedTypes: [".pdf", "application/pdf"],
    maxFileSizeMB: 80,
    seoTitle: "Sign PDF Online – Free Electronic Signature Tool",
    seoDescription: "Sign PDF documents online for free. Draw your handwritten signature, type with signature fonts, or upload a signature image, position it on any page, and download.",
    keywords: ["sign pdf", "electronic signature pdf", "fill and sign pdf", "free pdf signer"],
    howToSteps: [
      "Upload the PDF you need to sign.",
      "Create your signature: draw with a mouse/touch, type your name, or upload an image.",
      "Drag and place the signature onto the desired page and position.",
      "Resize to fit the signature box.",
      "Click 'Download Signed PDF' to export."
    ],
    faqs: [
      {
        question: "Is this a digital or electronic signature?",
        answer: "This provides an electronic visual signature suitable for standard agreements, receipts, and everyday forms. For cryptographic PKI digital signatures requiring government certificates, dedicated PKI hardware is typically required."
      }
    ]
  },
  {
    id: "pdf-unlock",
    name: "Unlock PDF",
    href: "/pdf-unlock",
    category: "Security",
    description: "Remove passwords and security restrictions from authorized PDF files.",
    tagline: "Remove passwords from your protected documents.",
    iconName: "Unlock",
    popular: false,
    acceptedTypes: [".pdf", "application/pdf"],
    maxFileSizeMB: 80,
    seoTitle: "Unlock PDF Online – Remove Password Protection",
    seoDescription: "Remove password protection and printing/editing restrictions from authorized PDF files online. Enter your owner password once to produce an unencumbered PDF.",
    keywords: ["unlock pdf", "remove password from pdf", "pdf decrypter", "unprotect pdf"],
    howToSteps: [
      "Upload your password-protected PDF document.",
      "Enter the document password when prompted.",
      "PDFToolkit decrypts the file and removes the password restrictions.",
      "Download your unencrypted, open PDF."
    ],
    faqs: [
      {
        question: "Can this tool crack passwords I do not know?",
        answer: "No. In accordance with security standards and ethics, you must provide the valid password or authorization for the document to remove future password prompts."
      }
    ]
  },
  {
    id: "pdf-protect",
    name: "Protect PDF",
    href: "/pdf-protect",
    category: "Security",
    description: "Encrypt your PDF with password protection and customize viewing permissions.",
    tagline: "Encrypt sensitive PDF documents with secure passwords.",
    iconName: "Lock",
    popular: false,
    acceptedTypes: [".pdf", "application/pdf"],
    maxFileSizeMB: 80,
    seoTitle: "Protect PDF Online – Encrypt & Add Password to PDF",
    seoDescription: "Secure your PDF with strong password encryption online for free. Restrict unauthorized opening, copying, or printing directly within your browser.",
    keywords: ["protect pdf", "password protect pdf", "encrypt pdf online", "secure pdf file"],
    howToSteps: [
      "Upload the PDF document you want to secure.",
      "Enter and confirm a strong password.",
      "Choose permissions (optional: disable printing or copying).",
      "Click 'Protect PDF' and download your encrypted document."
    ],
    faqs: [
      {
        question: "What encryption standard is applied?",
        answer: "Standard PDF encryption is applied to lock the document stream so standard PDF viewers will require the password before viewing content."
      }
    ]
  },
  {
    id: "pdf-repair",
    name: "Repair PDF",
    href: "/pdf-repair",
    category: "Organize",
    description: "Analyze and reconstruct corrupted or malformed PDF documents.",
    tagline: "Recover readable pages and rebuild damaged PDF structures.",
    iconName: "Wrench",
    popular: false,
    acceptedTypes: [".pdf", "application/pdf"],
    maxFileSizeMB: 80,
    seoTitle: "Repair PDF Online – Fix Corrupted & Damaged PDF Files",
    seoDescription: "Attempt to repair damaged, unreadable, or malformed PDF documents. Our structural recovery parser rebuilds xref tables and salvages readable pages.",
    keywords: ["repair pdf", "fix damaged pdf", "recover corrupted pdf", "pdf doctor online"],
    howToSteps: [
      "Upload your damaged or corrupted PDF file.",
      "Our structural diagnostics tool analyzes the header, xref tables, and object streams.",
      "PDFToolkit salvages intact pages and re-serializes a healthy PDF.",
      "Download your recovered PDF document."
    ],
    faqs: [
      {
        question: "Can every broken PDF be repaired?",
        answer: "If the underlying data stream is completely wiped or truncated to zero bytes, reconstruction is impossible. However, if structural cross-reference tables or headers are damaged while page content remains, PDFToolkit will successfully recover the document."
      }
    ]
  },
  {
    id: "pdf-crop",
    name: "Crop PDF",
    href: "/pdf-crop",
    category: "Edit",
    description: "Visually define margins and crop unwanted white borders from PDF pages.",
    tagline: "Trim page margins and adjust visible canvas boundaries.",
    iconName: "Crop",
    popular: false,
    acceptedTypes: [".pdf", "application/pdf"],
    maxFileSizeMB: 80,
    seoTitle: "Crop PDF Online – Trim White Margins & Adjust Viewport",
    seoDescription: "Crop PDF pages online with an interactive visual bounding box. Trim excess margins from all pages or selected pages to optimize documents for reading on e-readers and mobile devices.",
    keywords: ["crop pdf", "trim pdf margins", "cut pdf pages", "crop pdf online"],
    howToSteps: [
      "Upload your PDF to the crop tool.",
      "Drag the interactive crop bounding box on the preview canvas to frame your content.",
      "Select whether to apply the crop box to all pages, the current page, or a range.",
      "Click 'Crop & Download' to export the trimmed PDF."
    ],
    faqs: [
      {
        question: "Does cropping delete the underlying text?",
        answer: "PDFToolkit modifies the official PDF `CropBox` and `MediaBox` parameters, neatly hiding unwanted margins without corrupting the underlying vector content."
      }
    ]
  },
  {
    id: "pdf-extract-text",
    name: "Extract Text from PDF",
    href: "/pdf-extract-text",
    category: "Convert",
    description: "Extract raw, unformatted text streams from any PDF instantly.",
    tagline: "Extract text from any PDF document page by page in one click.",
    iconName: "FileCode",
    popular: false,
    acceptedTypes: [".pdf", "application/pdf"],
    maxFileSizeMB: 80,
    seoTitle: "Extract Text from PDF Online – Free Text Extractor",
    seoDescription: "Instantly extract all readable text from any PDF document online. Copy text with one click or export to a clean TXT file directly in your browser.",
    keywords: ["extract text from pdf", "pdf text extractor", "copy text from pdf", "pdf to txt"],
    howToSteps: [
      "Upload your PDF document.",
      "PDFToolkit instantly parses the text streams across all pages.",
      "View the extracted text in the searchable text editor.",
      "Click 'Copy Text' or 'Download as TXT' to save."
    ],
    faqs: [
      {
        question: "What if my PDF contains photos of text instead of selectable text?",
        answer: "If your PDF is a scanned image or photocopy, use our PDF OCR tool which uses optical character recognition to read text from pictures."
      }
    ]
  }
];

export const TOOL_CATEGORIES = [
  "All",
  "Compress",
  "Convert",
  "Edit",
  "Organize",
  "OCR",
  "Security",
  "Images"
] as const;

export function getToolByHref(href: string): ToolItem | undefined {
  return TOOLS.find((t) => t.href === href || t.href === `/${href}`);
}
