import {
  BookSourceError,
  ensureSourceSize,
  ensureTextLength,
  type BookSourceSection,
  type ParsedBookSource,
} from "../bookSourceTypes";
import { normalizePlainText } from "../textNormalization";

type PdfTextItem = {
  str?: string;
  hasEOL?: boolean;
};

function isPasswordError(error: unknown) {
  if (!(error instanceof Error)) return false;
  return /password/i.test(error.name) || /password/i.test(error.message);
}

export async function parsePdfSource(file: File): Promise<ParsedBookSource> {
  ensureSourceSize(file.size);
  const [pdfjs, bytes] = await Promise.all([
    import("pdfjs-dist"),
    file.arrayBuffer(),
  ]);
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url,
  ).toString();

  let documentTask: ReturnType<typeof pdfjs.getDocument>;
  try {
    documentTask = pdfjs.getDocument({
      data: new Uint8Array(bytes),
      useWorkerFetch: false,
      isEvalSupported: false,
    });
  } catch {
    throw new BookSourceError("This PDF could not be opened.");
  }

  try {
    const pdf = await documentTask.promise;
    const warnings = [
      "PDF extraction is best effort. EPUB or TXT usually produces cleaner Morse source text.",
    ];
    const metadata = await pdf.getMetadata().catch(() => null);
    const info = metadata?.info as
      | { Title?: string; Author?: string }
      | undefined;
    const outline = await pdf.getOutline().catch(() => null);
    if (outline && outline.length > 0) {
      warnings.push(
        `Detected ${outline.length.toLocaleString()} PDF outline/bookmark item${
          outline.length === 1 ? "" : "s"
        }.`,
      );
    }

    const pages: BookSourceSection[] = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const items = content.items as PdfTextItem[];
      const pageText = items
        .map((item) => item.str ?? "")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      if (pageText) {
        pages.push({
          title: `Page ${pageNumber}`,
          rawText: pageText,
          sourceLabel: `PDF page ${pageNumber}`,
        });
      }
    }

    let cursor = 0;
    const pageTexts: string[] = [];
    const rangedPages = pages.map((page) => {
      const startOffset = cursor;
      pageTexts.push(page.rawText);
      cursor += page.rawText.length;
      const endOffset = cursor;
      cursor += 2;
      return { ...page, startOffset, endOffset };
    });

    const rawText = normalizePlainText(pageTexts.join("\n\n"));
    ensureTextLength(rawText);
    if (!rawText || rawText.length < Math.max(24, pdf.numPages * 8)) {
      throw new BookSourceError(
        "This PDF does not contain enough extractable text. It may be scanned or image-only; OCR is not part of this tool.",
      );
    }

    return {
      sourceType: "pdf",
      filename: file.name,
      title: info?.Title?.trim() || undefined,
      author: info?.Author?.trim() || undefined,
      pageCount: pdf.numPages,
      sectionCount: rangedPages.length,
      rawText,
      sections: rangedPages,
      warnings,
    };
  } catch (error) {
    if (isPasswordError(error)) {
      throw new BookSourceError(
        "This PDF appears to be password protected, so MorseWords cannot extract it in the browser.",
      );
    }
    if (error instanceof BookSourceError) throw error;
    throw new BookSourceError("This PDF could not be parsed as text.");
  } finally {
    documentTask.destroy();
  }
}
