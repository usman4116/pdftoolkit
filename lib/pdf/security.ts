import { PDFDocument } from "pdf-lib";
// @cantoo/pdf-lib is a drop-in pdf-lib fork that adds real AES encryption and
// password-based decryption, which upstream pdf-lib does not support.
import { PDFDocument as SecurePDFDocument } from "@cantoo/pdf-lib";
import { readFileAsArrayBuffer } from "../utils";

/**
 * Validate and attempt structural repair of a damaged PDF
 */
export async function repairPdfFile(file: File): Promise<{
  success: boolean;
  message: string;
  recoveredPages: number;
  pdfBytes?: Uint8Array;
}> {
  try {
    const buffer = await readFileAsArrayBuffer(file);
    const bytes = new Uint8Array(buffer);

    // 1. Check for standard PDF magic header
    const headerStr = String.fromCharCode(...bytes.slice(0, 8));
    const hasHeader = headerStr.includes("%PDF-");

    let workBuffer: ArrayBuffer = buffer;

    // If header is truncated or offset, attempt to locate %PDF- in the first 2048 bytes
    if (!hasHeader) {
      const textChunk = new TextDecoder("latin1").decode(bytes.slice(0, 2048));
      const headerIdx = textChunk.indexOf("%PDF-");
      if (headerIdx !== -1) {
        workBuffer = buffer.slice(headerIdx);
      } else {
        return {
          success: false,
          message: "The uploaded file has no valid PDF header markers. The file appears critically corrupted or is not a valid PDF document.",
          recoveredPages: 0,
        };
      }
    }

    // 2. Load with permissive parser
    const pdfDoc = await PDFDocument.load(workBuffer, {
      ignoreEncryption: true,
      updateMetadata: false,
    });

    const pageCount = pdfDoc.getPageCount();
    if (pageCount === 0) {
      return {
        success: false,
        message: "The document structure was parsed, but contains 0 valid pages to recover.",
        recoveredPages: 0,
      };
    }

    // 3. Reconstruct into a brand new clean document container
    const cleanDoc = await PDFDocument.create();
    const copiedPages = await cleanDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((p) => cleanDoc.addPage(p));

    const repairedBytes = await cleanDoc.save({ useObjectStreams: true });

    return {
      success: true,
      message: `Successfully reconstructed cross-reference tables and salvaged ${pageCount} intact pages.`,
      recoveredPages: pageCount,
      pdfBytes: repairedBytes,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `PDF repair could not recover the file structure: ${err.message || "Corrupted stream contents"}`,
      recoveredPages: 0,
    };
  }
}

/**
 * Remove password protection from a PDF by supplying its open password and
 * re-saving without encryption.
 */
export async function unlockPdfFile(
  file: File,
  password?: string
): Promise<{ success: boolean; bytes?: Uint8Array; error?: string }> {
  const buffer = await readFileAsArrayBuffer(file);

  try {
    // Decrypt using the supplied password (empty string handles owner-only
    // restrictions where no open password is required).
    const doc = await SecurePDFDocument.load(buffer, {
      password: password || "",
      // Load even if the document only carries permission restrictions.
      ignoreEncryption: false,
    });
    // Saving a decrypted document produces plain, unencrypted bytes.
    const unlockedBytes = await doc.save({ useObjectStreams: true });
    return { success: true, bytes: unlockedBytes };
  } catch (err: any) {
    // Fall back to stripping owner-only restrictions (no open password set).
    try {
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const unlockedBytes = await doc.save({ useObjectStreams: true });
      return { success: true, bytes: unlockedBytes };
    } catch {
      const msg = /password/i.test(err?.message || "")
        ? "Incorrect password. Please enter the document's open password and try again."
        : "Unable to unlock this document. Verify the password is correct or that the file is not corrupted.";
      return { success: false, error: msg };
    }
  }
}

/**
 * Encrypt a PDF with a real AES-256 password using @cantoo/pdf-lib.
 */
export async function protectPdfFile(
  file: File,
  password: string,
  options: { allowPrinting?: boolean; allowCopying?: boolean } = {}
): Promise<{ success: boolean; bytes?: Uint8Array; error?: string }> {
  try {
    if (!password) {
      return { success: false, error: "A password is required to protect the document." };
    }

    const buffer = await readFileAsArrayBuffer(file);
    const pdfDoc = await SecurePDFDocument.load(buffer, { ignoreEncryption: true });

    // Apply genuine AES-256 encryption. The same password opens the document
    // (userPassword) and grants full owner access (ownerPassword).
    pdfDoc.encrypt({
      userPassword: password,
      ownerPassword: password,
      permissions: {
        printing: options.allowPrinting === false ? undefined : "highResolution",
        copying: options.allowCopying ?? true,
        modifying: false,
      },
    });

    const protectedBytes = await pdfDoc.save({ useObjectStreams: false });

    return { success: true, bytes: protectedBytes };
  } catch (err: any) {
    return {
      success: false,
      error: `Could not apply document protection: ${err?.message || "Unknown error"}`,
    };
  }
}
