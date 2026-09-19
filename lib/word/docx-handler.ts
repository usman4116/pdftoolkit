import mammoth from "mammoth";
import { Document, Paragraph, TextRun, Packer, HeadingLevel } from "docx";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { extractTextFromPdf } from "../pdf/converter";
import { readFileAsArrayBuffer } from "../utils";

/**
 * Convert PDF pages to a genuine Microsoft Word (.docx) file
 */
export async function pdfToWordDocx(
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  const pages = await extractTextFromPdf(file, onProgress);

  const docChildren: Paragraph[] = [];

  // Title
  docChildren.push(
    new Paragraph({
      text: file.name.replace(/\.[^/.]+$/, ""),
      heading: HeadingLevel.TITLE,
      spacing: { after: 300 },
    })
  );

  pages.forEach((page) => {
    // Add page indicator
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `--- Page ${page.pageNum} ---`,
            bold: true,
            color: "6366F1",
            size: 20,
          }),
        ],
        spacing: { before: 200, after: 100 },
      })
    );

    // Split text into lines/paragraphs
    const lines = page.text.split("\n").filter((l) => l.trim().length > 0);
    if (lines.length === 0 && page.text.trim()) {
      docChildren.push(
        new Paragraph({
          children: [new TextRun({ text: page.text.trim(), size: 22 })],
          spacing: { after: 150 },
        })
      );
    } else {
      lines.forEach((line) => {
        docChildren.push(
          new Paragraph({
            children: [new TextRun({ text: line.trim(), size: 22 })],
            spacing: { after: 120 },
          })
        );
      });
    }
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docChildren,
      },
    ],
  });

  return await Packer.toBlob(doc);
}

/**
 * Convert Microsoft Word (.docx) to PDF using mammoth extraction and pdf-lib
 */
export async function wordToPdfDoc(
  file: File,
  _onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const result = await mammoth.extractRawText({ arrayBuffer });
  const rawText = result.value || "Empty Document";

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 595.28; // A4
  const pageHeight = 841.89;
  const margin = 50;
  const usableWidth = pageWidth - margin * 2;
  const usableHeight = pageHeight - margin * 2;
  const fontSize = 11;
  const lineHeight = 16;
  const maxLinesPerPage = Math.floor(usableHeight / lineHeight);

  // Split text into words and wrap to fit width
  const rawParagraphs = rawText.split("\n");
  const wrappedLines: string[] = [];

  for (const para of rawParagraphs) {
    if (!para.trim()) {
      wrappedLines.push("");
      continue;
    }

    const words = para.split(/\s+/);
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, fontSize);
      if (width > usableWidth && currentLine) {
        wrappedLines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      wrappedLines.push(currentLine);
    }
  }

  // Create pages
  const totalLines = wrappedLines.length;
  let lineIdx = 0;

  while (lineIdx < totalLines) {
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    let currentY = pageHeight - margin;

    // Header title on page 1
    if (lineIdx === 0) {
      const docTitle = file.name.replace(/\.docx$/i, "");
      page.drawText(docTitle.substring(0, 60), {
        x: margin,
        y: currentY,
        size: 16,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.1),
      });
      currentY -= 28;
    }

    let linesInCurrentPage = 0;
    while (lineIdx < totalLines && linesInCurrentPage < maxLinesPerPage) {
      const line = wrappedLines[lineIdx];
      if (line) {
        try {
          // Clean non-ascii to avoid font crash
          const safeText = line.replace(/[^\x00-\x7F]/g, " ");
          page.drawText(safeText, {
            x: margin,
            y: currentY,
            size: fontSize,
            font,
            color: rgb(0.15, 0.15, 0.15),
          });
        } catch {
          // graceful fallback
        }
      }
      currentY -= lineHeight;
      lineIdx++;
      linesInCurrentPage++;
    }
  }

  if (pdfDoc.getPageCount() === 0) {
    pdfDoc.addPage([pageWidth, pageHeight]);
  }

  return await pdfDoc.save({ useObjectStreams: true });
}
