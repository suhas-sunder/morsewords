import type {
  MorseBookLibrarySummary,
  MorseBookManifest,
  MorseBookPreviewAsset,
  MorseBookSectionJson,
  MorseBookSectionSummary,
} from "./morseBookTypes";
import { isDefaultReadableMorseBookSection } from "./morseBookSectionDefaults";

export const MORSE_BOOK_PREVIEW_BASE_PATH = "/book-previews";

export type MorseBookPreviewRuntimeContent = {
  book: MorseBookManifest;
  initialSection: MorseBookSectionJson;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isMorseBookPreviewAsset(value: unknown): value is MorseBookPreviewAsset {
  if (!isPlainObject(value)) return false;
  return (
    value.version === 1 &&
    typeof value.slug === "string" &&
    typeof value.contentVersion === "string" &&
    typeof value.contentHash === "string" &&
    typeof value.defaultSectionId === "string" &&
    typeof value.defaultSectionKind === "string" &&
    typeof value.defaultSectionLabel === "string" &&
    (typeof value.defaultSectionTitle === "string" ||
      value.defaultSectionTitle === null) &&
    typeof value.previewText === "string" &&
    typeof value.estimatedRuntimeSeconds === "number" &&
    Number.isFinite(value.estimatedRuntimeSeconds) &&
    typeof value.wordCount === "number" &&
    Number.isFinite(value.wordCount) &&
    typeof value.characterCount === "number" &&
    Number.isFinite(value.characterCount) &&
    typeof value.estimatedTypingMinutes === "number" &&
    Number.isFinite(value.estimatedTypingMinutes) &&
    typeof value.estimatedListeningMinutes === "number" &&
    Number.isFinite(value.estimatedListeningMinutes) &&
    typeof value.morseCharacterEstimate === "number" &&
    Number.isFinite(value.morseCharacterEstimate) &&
    typeof value.textPreview === "string" &&
    typeof value.truncated === "boolean"
  );
}

export function getMorseBookPreviewAssetUrl(slug: string) {
  return `${MORSE_BOOK_PREVIEW_BASE_PATH}/${encodeURIComponent(slug)}.preview.json`;
}

function previewParagraphs(previewText: string) {
  return previewText
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

const genericBookPreviewPlaceholderPattern = /\bSOS\s+Help!?\b/i;

const nonBookStartupPreviewPattern =
  /\b(table of contents|contents|list of illustrations|title page|copyright|license|source note|project gutenberg|gutenberg|transcriber|produced by|production note|distributed proofreading|pgdp\.net|release date|ebook|reference file does not include body text|book route is available|missing source content|generic placeholder|placeholder)\b/i;

function isValidBookStartupPreview(
  preview: MorseBookPreviewAsset,
  sectionSummary: MorseBookSectionSummary,
) {
  const previewText = preview.previewText.trim();
  if (!previewText) return false;
  if (genericBookPreviewPlaceholderPattern.test(previewText)) return false;
  const previewStart = previewText.replace(/\s+/g, " ").trim().slice(0, 360);
  if (nonBookStartupPreviewPattern.test(previewStart)) return false;
  return isDefaultReadableMorseBookSection(sectionSummary);
}

function createPreviewSectionSummary(
  preview: MorseBookPreviewAsset,
): MorseBookSectionSummary {
  return {
    id: preview.defaultSectionId,
    kind: preview.defaultSectionKind,
    label: preview.defaultSectionLabel,
    title: preview.defaultSectionTitle,
    order: 1,
    includeByDefault: true,
    sectionJsonPath: "",
    characterCount: preview.characterCount,
    wordCount: preview.wordCount,
    estimatedTypingMinutes: preview.estimatedTypingMinutes,
    estimatedListeningMinutes: preview.estimatedListeningMinutes,
    morseCharacterEstimate: preview.morseCharacterEstimate,
    textPreview: preview.textPreview,
  };
}

function createPreviewSection(preview: MorseBookPreviewAsset): MorseBookSectionJson {
  const previewText = preview.previewText.trim();
  return {
    schemaVersion: 1,
    bookSlug: preview.slug,
    sectionId: preview.defaultSectionId,
    kind: preview.defaultSectionKind,
    label: preview.defaultSectionLabel,
    title: preview.defaultSectionTitle,
    order: 1,
    includeByDefault: true,
    displayText: previewText,
    morseSourceText: previewText,
    paragraphs: previewParagraphs(previewText),
    wordCount: preview.wordCount,
    characterCount: preview.characterCount,
    estimatedTypingMinutes: preview.estimatedTypingMinutes,
    estimatedListeningMinutes: preview.estimatedListeningMinutes,
    morseCharacterEstimate: preview.morseCharacterEstimate,
    unsupportedCharacterSummary: {},
    textPreview: preview.textPreview,
    sourceOffsets: {
      start: 0,
      end: previewText.length,
    },
  };
}

export function createMorseBookPreviewRuntimeContent(
  summary: MorseBookLibrarySummary,
  preview: MorseBookPreviewAsset,
): MorseBookPreviewRuntimeContent | null {
  if (preview.slug !== summary.slug || !preview.previewText.trim()) {
    return null;
  }

  const sectionSummary = createPreviewSectionSummary(preview);
  if (!isValidBookStartupPreview(preview, sectionSummary)) return null;

  const section = createPreviewSection(preview);
  const manifest: MorseBookManifest = {
    schemaVersion: 1,
    slug: summary.slug,
    title: summary.title,
    author: summary.author,
    contentVersion: summary.contentVersion,
    contentHash: summary.contentHash,
    language: summary.language,
    description: summary.description,
    subjects: summary.subjects,
    source: summary.source,
    cover: summary.cover,
    stats: summary.stats,
    defaults: summary.defaults,
    sections: [sectionSummary],
    cleaning: {
      originalCharacterCount: summary.stats.originalCharacterCount,
      cleanedCharacterCount: summary.stats.cleanedCharacterCount,
      headerStripped: false,
      footerStripped: false,
      confidence: "medium",
      warnings: [],
    },
    warnings: [],
  };

  return {
    book: manifest,
    initialSection: section,
  };
}

export async function getMorseBookPreviewRuntimeContent(
  summary: MorseBookLibrarySummary,
) {
  try {
    const response = await fetch(getMorseBookPreviewAssetUrl(summary.slug), {
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) return null;
    const preview: unknown = await response.json();
    if (!isMorseBookPreviewAsset(preview)) return null;
    return createMorseBookPreviewRuntimeContent(summary, preview);
  } catch {
    return null;
  }
}
