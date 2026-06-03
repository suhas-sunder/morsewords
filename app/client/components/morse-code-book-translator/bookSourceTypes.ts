export type BookSourceType = "pasted" | "txt" | "md" | "epub" | "pdf";

export type CleanupOptions = {
  normalizeSmartPunctuation: boolean;
  stripZeroWidthAndSoftHyphen: boolean;
  stripGutenbergHeaderFooter: boolean;
  simplifyPunctuation: boolean;
};

export type CustomCleanupRule = {
  id: string;
  enabled: boolean;
  find: string;
  replacement: string;
  caseSensitive: boolean;
  wholeWord: boolean;
};

export type CustomCleanupRuleMatch = {
  id: string;
  count: number;
  active: boolean;
};

export type SourceMetadata = {
  sourceType: BookSourceType;
  filename?: string;
  title?: string;
  author?: string;
  pageCount?: number;
  sectionCount?: number;
};

export type BookSourceSection = {
  title?: string;
  rawText: string;
  sourceLabel?: string;
  startOffset?: number;
  endOffset?: number;
};

export type ParsedBookSource = SourceMetadata & {
  rawText: string;
  sections?: BookSourceSection[];
  warnings: string[];
};

export type UnsupportedCharacterSummary = {
  character: string;
  count: number;
};

export type PreflightSummary = SourceMetadata & {
  cleanedText: string;
  cleanedPreview: string;
  morsePreview: string;
  wordCount: number;
  characterCount: number;
  unsupportedCount: number;
  unsupportedCharacters: UnsupportedCharacterSummary[];
  extractionWarnings: string[];
  cleanupWarnings: string[];
  customRuleMatches: CustomCleanupRuleMatch[];
};

export class BookSourceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BookSourceError";
  }
}

export const DEFAULT_CLEANUP_OPTIONS: CleanupOptions = {
  normalizeSmartPunctuation: true,
  stripZeroWidthAndSoftHyphen: true,
  stripGutenbergHeaderFooter: false,
  simplifyPunctuation: false,
};

export const MAX_SOURCE_BYTES = 15 * 1024 * 1024;
export const MAX_SOURCE_CHARACTERS = 1_200_000;
export const CLEANED_PREVIEW_LIMIT = 1_600;
export const MORSE_PREVIEW_INPUT_LIMIT = 360;

export function sourceTypeLabel(sourceType: BookSourceType) {
  switch (sourceType) {
    case "pasted":
      return "Pasted text";
    case "txt":
      return "TXT";
    case "md":
      return "MD";
    case "epub":
      return "EPUB";
    case "pdf":
      return "PDF";
  }
}

export function ensureSourceSize(size: number) {
  if (size > MAX_SOURCE_BYTES) {
    throw new BookSourceError(
      `This file is too large for browser preflight. Keep source files under ${Math.round(
        MAX_SOURCE_BYTES / (1024 * 1024),
      )} MB for now.`,
    );
  }
}

export function ensureTextLength(text: string) {
  if (text.length > MAX_SOURCE_CHARACTERS) {
    throw new BookSourceError(
      `This source has ${text.length.toLocaleString()} characters. Trim it below ${MAX_SOURCE_CHARACTERS.toLocaleString()} characters before preflight.`,
    );
  }
}

export function detectFileSourceType(
  file: File,
): Exclude<BookSourceType, "pasted"> {
  const filename = file.name.toLowerCase();
  if (filename.endsWith(".txt")) return "txt";
  if (filename.endsWith(".md") || filename.endsWith(".markdown")) return "md";
  if (filename.endsWith(".epub")) return "epub";
  if (filename.endsWith(".pdf")) return "pdf";
  throw new BookSourceError(
    "Unsupported file type. Use TXT, MD, unprotected EPUB, or text-based PDF.",
  );
}
