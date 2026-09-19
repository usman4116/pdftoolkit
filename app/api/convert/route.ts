import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Serverless fallback endpoint for PDF operations on Vercel
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const action = formData.get("action") as string;
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No document file was provided in the request." },
        { status: 400 }
      );
    }

    // File size check for Vercel Serverless payload limits (4.5MB limit on hobby, 10MB on pro)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: "File size exceeds serverless threshold. Please use our client-side browser processor.",
        },
        { status: 413 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();

    if (action === "compress") {
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      pdfDoc.setTitle("");
      pdfDoc.setAuthor("");
      pdfDoc.setCreator("");
      pdfDoc.setProducer("");
      const optimizedBytes = await pdfDoc.save({ useObjectStreams: true });

      return new NextResponse(optimizedBytes as any, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${file.name.replace(/\.pdf$/i, "")}_optimized.pdf"`,
        },
      });
    }

    return NextResponse.json(
      { error: `Unsupported server action: ${action}` },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: `Server processing failed: ${err.message}` },
      { status: 500 }
    );
  }
}
