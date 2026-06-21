import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  BookSectionKind,
  GeneratedBookManifest,
  GeneratedBookSectionJson,
  GeneratedLibraryManifest,
} from "./bookManifestTypes.ts";

const TARGET_RUNTIME_SECONDS = 3_600;
const PREVIEW_BASE_PATH = "/book-previews";

type BookPreviewAsset = {
  version: 1;
  slug: string;
  contentVersion: string;
  contentHash: string;
  defaultSectionId: string;
  defaultSectionKind: BookSectionKind;
  defaultSectionLabel: string;
  defaultSectionTitle: string | null;
  previewText: string;
  estimatedRuntimeSeconds: number;
  wordCount: number;
  characterCount: number;
  estimatedTypingMinutes: number;
  estimatedListeningMinutes: number;
  morseCharacterEstimate: number;
  textPreview: string;
  truncated: boolean;
};

type BookPreviewManifest = {
  version: 1;
  assetBasePath: string;
  targetRuntimeSeconds: number;
  books: Array<{
    slug: string;
    path: string;
    contentVersion: string;
    contentHash: string;
    defaultSectionId: string;
    previewBytes: number;
    previewCharacterCount: number;
    estimatedRuntimeSeconds: number;
    truncated: boolean;
  }>;
  missing: Array<{
    slug: string;
    reason: string;
  }>;
};

type PreviewRecommendation =
  | "valid"
  | "preview asset needs regeneration from generated readable sections"
  | "generated book needs processing correction later"
  | "blocked/manual review";

type AuditBookResult = {
  slug: string;
  title: string;
  generatedOutputExists: boolean;
  previewAssetExists: boolean;
  previewContainsSosHelp: boolean;
  previewStartsFromRealReadableBookContent: boolean;
  previewMatchesGeneratedContentHash: boolean;
  firstDefaultGeneratedSection: {
    id: string | null;
    title: string | null;
    label: string | null;
    type: BookSectionKind | null;
    wordCount: number | null;
    includeByDefault: boolean | null;
    snippet: string | null;
  };
  firstDefaultSectionLooksLikeRealContent: boolean;
  firstDefaultSectionLooksLikeNonMainMaterial: boolean;
  chapterPartOrFirstStoryMissingOrMisclassified: boolean;
  chapterPartOrFirstStoryNotes: string[];
  allMainReadableSectionsIncludedByDefault: boolean;
  defaultSectionCount: number;
  mainReadableSectionCount: number;
  startupPreviewValid: boolean;
  recommendation: PreviewRecommendation;
  previewRepairApplied: boolean;
  warnings: string[];
  snippets: {
    generatedStart: string | null;
    previewStart: string | null;
  };
};

type AuditReport = {
  generatedAt: string;
  generatedBookCount: number;
  previewAssetCount: number;
  validStartupPreviewCount: number;
  previewAssetsUpdated: string[];
  booksWithInvalidOrMissingPreviews: string[];
  booksWithSuspiciousFirstDefaultSections: string[];
  booksWithMissingOrMisclassifiedFirstContent: string[];
  recommendations: Record<PreviewRecommendation, string[]>;
  protectedPaths: {
    rawSourceInput: string;
    generatedBooks: string;
    cloudflareExport: string;
    previewAssets: string;
  };
  books: AuditBookResult[];
};

type BookSectionSummary = GeneratedBookManifest["sections"][number];

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const generatedRoot = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "generated",
);
const previewRoot = path.join(repoRoot, "public", "book-previews");
const reportRoot = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "book-startup-preview-audit-1",
);
const libraryManifestPath = path.join(generatedRoot, "library-manifest.json");
const previewManifestPath = path.join(previewRoot, "manifest.json");

const defaultReadableExcludedSectionKinds = new Set<BookSectionKind>([
  "title-page",
  "dedication",
  "epigraph",
  "preface",
  "introduction",
  "epilogue",
  "appendix",
  "notes",
  "glossary",
  "index",
  "transcriber-note",
  "source-license",
  "advertisement",
]);

const nonMainMaterialPattern =
  /\b(table of contents|list of illustrations|illustrations?|title page|copyright|license|source note|publisher|preface|introduction|footnotes?|notes?|appendix|bibliography|index|end matter|project gutenberg|gutenberg|transcriber|produced by|production note|distributed proofreading|pgdp\.net|release date|ebook|reference file does not include body text|book route is available|missing source content|generic placeholder|placeholder)\b/i;

const nonMainMaterialAtStartPattern =
  /^(?:table of contents|contents|list of illustrations|illustrations?|title page|copyright|license|source note|publisher|preface|introduction|footnotes?|notes?|appendix|bibliography|index|end matter|project gutenberg|gutenberg|transcriber|produced by|production note|distributed proofreading|pgdp\.net|release date|ebook|reference file does not include body text|book route is available|missing source content|generic placeholder|placeholder)\b/i;

const sourceBoilerplateAnywherePattern =
  /\b(project gutenberg|gutenberg license|distributed proofreading|pgdp\.net|release date|generic placeholder|placeholder)\b/i;

const earlyEmbeddedFrontMatterPattern =
  /\b(table of contents|list of illustrations|frontispiece|illustrations?|title page|copyright|published|all rights reserved|preface)\b/i;

const frontMatterPublishedContextPattern =
  /\b(first published|published by|published for|published at|published in (?:london|new york|\d{4})|publisher|publication date)\b/i;

const earlyShortMatterPattern =
  /\b(cover|frontispiece|by\s+[a-z]|published|copyright|all rights reserved|contents|table of contents)\b/i;

const dedicationStartPattern = /\b(to the memory of|i dedicate)\b/i;

const sosHelpPattern = /\bSOS\s+Help!?\b/i;

function looksLikeContentsListing(text: string) {
  const normalized = normalizedSectionText(text);
  const match = /\bcontents\b/i.exec(normalized);
  if (!match) return false;
  const wordsBeforeContents = countWords(normalized.slice(0, match.index));
  const listingSample = normalized.slice(match.index + match[0].length, match.index + match[0].length + 180);
  return (
    wordsBeforeContents <= 24 &&
    /\b(?:chapter|story|search|incident|case|letter|narrative|statement|book|part|volume|preface|contents)\b/i.test(
      listingSample,
    )
  );
}

function readJson<T>(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeTextIfChanged(filePath: string, next: string) {
  const current = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf8")
    : null;
  if (current === next) return false;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, next);
  return true;
}

function writeJsonIfChanged(filePath: string, data: unknown) {
  return writeTextIfChanged(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function assertSafeOutputPaths() {
  const resolvedReportRoot = path.resolve(reportRoot);
  const expectedReportRoot = path.join(
    repoRoot,
    "app",
    "client",
    "assets",
    "books",
    "audit-reports",
    "book-startup-preview-audit-1",
  );
  if (resolvedReportRoot !== expectedReportRoot) {
    throw new Error(`Unsafe report output directory: ${resolvedReportRoot}`);
  }

  const resolvedPreviewRoot = path.resolve(previewRoot);
  const expectedPreviewRoot = path.join(repoRoot, "public", "book-previews");
  if (resolvedPreviewRoot !== expectedPreviewRoot) {
    throw new Error(`Unsafe preview output directory: ${resolvedPreviewRoot}`);
  }
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function compactText(text: string, maxLength = 220) {
  const compact = text.replace(/\s+/g, " ").trim();
  if (compact.length <= maxLength) return compact;
  return `${compact.slice(0, maxLength - 3)}...`;
}

function normalizeForCompare(text: string) {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

function textFromSection(section: GeneratedBookSectionJson | null) {
  return (section?.morseSourceText || section?.displayText || "").trim();
}

function normalizedSectionText(
  ...parts: Array<string | null | undefined>
) {
  return parts
    .filter((part): part is string => Boolean(part))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function hasEarlyEmbeddedFrontMatter(text: string) {
  const match = earlyEmbeddedFrontMatterPattern.exec(text);
  if (!match) return false;
  if (match[0].toLowerCase() === "published") {
    const context = text.slice(Math.max(0, match.index - 40), match.index + 120);
    if (!frontMatterPublishedContextPattern.test(context)) return false;
  }
  return countWords(text.slice(0, match.index)) <= 80;
}

function sectionEvidenceText(section: BookSectionSummary) {
  return normalizedSectionText(
    section.label,
    section.title,
    section.textPreview,
  );
}

function sectionNameText(section: BookSectionSummary) {
  return normalizedSectionText(section.label, section.title);
}

function looksLikeNonMainMaterial(section: BookSectionSummary) {
  const nameText = sectionNameText(section);
  const previewText = normalizedSectionText(section.textPreview);
  if (defaultReadableExcludedSectionKinds.has(section.kind)) return true;
  if (nonMainMaterialPattern.test(nameText)) return true;
  if (sourceBoilerplateAnywherePattern.test(previewText)) return true;
  if (nonMainMaterialAtStartPattern.test(previewText)) return true;
  if (section.order <= 4 && hasEarlyEmbeddedFrontMatter(previewText)) return true;
  if (looksLikeContentsListing(nameText) || looksLikeContentsListing(previewText)) return true;
  if (section.order <= 4 && dedicationStartPattern.test(previewText)) return true;
  if (section.order <= 4 && section.wordCount < 90) {
    return earlyShortMatterPattern.test(`${nameText} ${previewText}`);
  }
  return false;
}

function isDefaultReadableBookSection(section: BookSectionSummary) {
  if (looksLikeNonMainMaterial(section)) return false;
  if (section.order <= 4 && section.wordCount < 35) return false;
  return section.wordCount > 0;
}

function getDefaultSectionIds(book: GeneratedBookManifest) {
  const included = book.sections
    .filter((section) => section.includeByDefault)
    .map((section) => section.id);
  if (included.length > 0) return included;

  const readable = book.sections
    .filter((section) => isDefaultReadableBookSection(section))
    .map((section) => section.id);
  return readable.length > 0 ? readable : book.sections[0]?.id ? [book.sections[0].id] : [];
}

function getMainReadableSectionIds(book: GeneratedBookManifest) {
  return book.sections
    .filter((section) => isDefaultReadableBookSection(section))
    .map((section) => section.id);
}

function readSection(bookSlug: string, section: BookSectionSummary) {
  const sectionPath = path.join(generatedRoot, bookSlug, section.sectionJsonPath);
  if (!fs.existsSync(sectionPath)) return null;
  const sectionJson = readJson<GeneratedBookSectionJson>(sectionPath);
  if (sectionJson.bookSlug !== bookSlug || sectionJson.sectionId !== section.id) {
    return null;
  }
  return sectionJson;
}

function isPreviewAsset(value: unknown): value is BookPreviewAsset {
  const candidate = value as Partial<BookPreviewAsset>;
  return (
    Boolean(candidate) &&
    typeof candidate === "object" &&
    candidate.version === 1 &&
    typeof candidate.slug === "string" &&
    typeof candidate.contentVersion === "string" &&
    typeof candidate.contentHash === "string" &&
    typeof candidate.defaultSectionId === "string" &&
    typeof candidate.defaultSectionKind === "string" &&
    typeof candidate.defaultSectionLabel === "string" &&
    (typeof candidate.defaultSectionTitle === "string" ||
      candidate.defaultSectionTitle === null) &&
    typeof candidate.previewText === "string" &&
    typeof candidate.estimatedRuntimeSeconds === "number" &&
    typeof candidate.wordCount === "number" &&
    typeof candidate.characterCount === "number" &&
    typeof candidate.estimatedTypingMinutes === "number" &&
    typeof candidate.estimatedListeningMinutes === "number" &&
    typeof candidate.morseCharacterEstimate === "number" &&
    typeof candidate.textPreview === "string" &&
    typeof candidate.truncated === "boolean"
  );
}

function readPreviewAsset(slug: string) {
  const previewPath = path.join(previewRoot, `${slug}.preview.json`);
  if (!fs.existsSync(previewPath)) return null;
  const value: unknown = readJson<unknown>(previewPath);
  return isPreviewAsset(value) ? value : null;
}

function clampBoundary(text: string, targetLength: number) {
  if (text.length <= targetLength) return text.trim();

  const minBoundary = Math.max(0, Math.floor(targetLength * 0.72));
  const maxBoundary = Math.min(text.length, Math.floor(targetLength * 1.08));
  const searchWindow = text.slice(minBoundary, maxBoundary);
  const paragraphBreak = searchWindow.lastIndexOf("\n\n");
  if (paragraphBreak > 0) {
    return text.slice(0, minBoundary + paragraphBreak).trim();
  }

  const sentenceMatch = [...searchWindow.matchAll(/[.!?]["')\]]?\s+/g)].at(-1);
  if (sentenceMatch?.index !== undefined) {
    return text
      .slice(0, minBoundary + sentenceMatch.index + sentenceMatch[0].length)
      .trim();
  }

  const whitespace = text.lastIndexOf(" ", targetLength);
  if (whitespace > minBoundary) return text.slice(0, whitespace).trim();

  return text.slice(0, targetLength).trim();
}

function previewTextForSection(section: GeneratedBookSectionJson) {
  const text = textFromSection(section);
  if (!text) return "";

  const estimatedRuntimeSeconds = Math.max(
    1,
    Math.round(section.estimatedListeningMinutes * 60),
  );
  if (estimatedRuntimeSeconds <= TARGET_RUNTIME_SECONDS) return text;

  const ratio = TARGET_RUNTIME_SECONDS / estimatedRuntimeSeconds;
  const targetLength = Math.max(1, Math.floor(text.length * ratio));
  return clampBoundary(text, targetLength);
}

function buildPreviewAsset(
  book: GeneratedBookManifest,
  sectionSummary: BookSectionSummary,
  section: GeneratedBookSectionJson,
): BookPreviewAsset | null {
  const previewText = previewTextForSection(section);
  if (!previewText) return null;

  const sectionTextLength = Math.max(1, textFromSection(section).length);
  const ratio = Math.min(1, Math.max(0, previewText.length / sectionTextLength));
  const estimatedRuntimeSeconds = Math.max(
    1,
    Math.round(section.estimatedListeningMinutes * 60 * ratio),
  );
  const wordCount = countWords(previewText);

  return {
    version: 1,
    slug: book.slug,
    contentVersion: book.contentVersion,
    contentHash: book.contentHash,
    defaultSectionId: sectionSummary.id,
    defaultSectionKind: sectionSummary.kind,
    defaultSectionLabel: sectionSummary.label,
    defaultSectionTitle: sectionSummary.title,
    previewText,
    estimatedRuntimeSeconds,
    wordCount,
    characterCount: previewText.length,
    estimatedTypingMinutes: Math.max(1, Math.ceil(wordCount / 40)),
    estimatedListeningMinutes: Math.max(1, Math.ceil(estimatedRuntimeSeconds / 60)),
    morseCharacterEstimate: Math.max(
      1,
      Math.round(section.morseCharacterEstimate * ratio),
    ),
    textPreview: compactText(previewText, 180),
    truncated: previewText.length < textFromSection(section).length,
  };
}

function previewStartsWithSection(
  preview: BookPreviewAsset | null,
  section: GeneratedBookSectionJson | null,
) {
  if (!preview || !section) return false;
  const previewStart = normalizeForCompare(preview.previewText).slice(0, 140);
  const sectionStart = normalizeForCompare(textFromSection(section)).slice(0, 140);
  return Boolean(previewStart) && sectionStart.startsWith(previewStart.slice(0, 80));
}

function hasGenericOrBoilerplateStart(text: string) {
  const start = compactText(text, 280);
  return (
    sosHelpPattern.test(start) ||
    sourceBoilerplateAnywherePattern.test(start) ||
    nonMainMaterialAtStartPattern.test(start) ||
    looksLikeContentsListing(start)
  );
}

function detectFirstContentIssue(
  book: GeneratedBookManifest,
  defaultIds: string[],
  mainReadableIds: string[],
  firstDefaultSummary: BookSectionSummary | null,
) {
  const notes: string[] = [];
  const chapterIds = book.sections
    .filter((section) => /^chapter-\d+$/i.test(section.id))
    .map((section) => section.id)
    .sort();
  const partIds = book.sections
    .filter((section) => /^part-\d+$/i.test(section.id))
    .map((section) => section.id)
    .sort();
  const storyLikeIds = book.sections
    .filter(
      (section) =>
        section.kind === "chapter" &&
        section.title &&
        !/^chapter\b/i.test(section.label),
    )
    .map((section) => section.id);

  if (chapterIds.length > 1 && !chapterIds.includes("chapter-001")) {
    notes.push("Later chapter sections exist, but chapter-001 is missing.");
  }
  if (
    chapterIds.includes("chapter-001") &&
    mainReadableIds.includes("chapter-001") &&
    !defaultIds.includes("chapter-001")
  ) {
    notes.push("chapter-001 looks main-readable but is not selected by default.");
  }
  if (
    partIds.length > 1 &&
    partIds.includes("part-001") &&
    mainReadableIds.includes("part-001") &&
    !defaultIds.includes("part-001")
  ) {
    notes.push("part-001 looks main-readable but is not selected by default.");
  }
  if (storyLikeIds.length > 1 && mainReadableIds.length > 0) {
    const firstStoryId = storyLikeIds[0];
    if (mainReadableIds.includes(firstStoryId) && !defaultIds.includes(firstStoryId)) {
      notes.push(
        `${firstStoryId} looks like a first story section but is not selected by default.`,
      );
    }
  }
  if (firstDefaultSummary) {
    const idChapterMatch = /^chapter-(\d+)$/i.exec(firstDefaultSummary.id);
    const labelChapterMatch = /^chapter\s+(\d+)\b/i.exec(
      firstDefaultSummary.label,
    );
    if (idChapterMatch && labelChapterMatch) {
      const idChapterNumber = Number.parseInt(idChapterMatch[1], 10);
      const labelChapterNumber = Number.parseInt(labelChapterMatch[1], 10);
      if (idChapterNumber !== labelChapterNumber) {
        notes.push(
          `${firstDefaultSummary.id} is labeled ${firstDefaultSummary.label}, which suggests chapter order damage.`,
        );
      }
    }
    if (
      firstDefaultSummary.wordCount < 35 &&
      book.sections.some((section) => section.wordCount >= 120)
    ) {
      notes.push(
        `${firstDefaultSummary.id} is suspiciously tiny for the first default section.`,
      );
    }
  }

  return notes;
}

function auditBook(summary: GeneratedLibraryManifest["books"][number]) {
  const manifestPath = path.join(generatedRoot, summary.manifestPath);
  const generatedOutputExists = fs.existsSync(manifestPath);
  const warnings: string[] = [];
  if (!generatedOutputExists) {
    return {
      result: {
        slug: summary.slug,
        title: summary.title,
        generatedOutputExists: false,
        previewAssetExists: fs.existsSync(
          path.join(previewRoot, `${summary.slug}.preview.json`),
        ),
        previewContainsSosHelp: false,
        previewStartsFromRealReadableBookContent: false,
        previewMatchesGeneratedContentHash: false,
        firstDefaultGeneratedSection: {
          id: null,
          title: null,
          label: null,
          type: null,
          wordCount: null,
          includeByDefault: null,
          snippet: null,
        },
        firstDefaultSectionLooksLikeRealContent: false,
        firstDefaultSectionLooksLikeNonMainMaterial: false,
        chapterPartOrFirstStoryMissingOrMisclassified: true,
        chapterPartOrFirstStoryNotes: ["Generated manifest is missing."],
        allMainReadableSectionsIncludedByDefault: false,
        defaultSectionCount: 0,
        mainReadableSectionCount: 0,
        startupPreviewValid: false,
        recommendation: "blocked/manual review" as const,
        previewRepairApplied: false,
        warnings: ["Generated output manifest is missing."],
        snippets: { generatedStart: null, previewStart: null },
      },
      previewAsset: null as BookPreviewAsset | null,
    };
  }

  const book = readJson<GeneratedBookManifest>(manifestPath);
  const preview = readPreviewAsset(book.slug);
  const previewAssetExists = fs.existsSync(
    path.join(previewRoot, `${book.slug}.preview.json`),
  );
  const defaultIds = getDefaultSectionIds(book);
  const mainReadableIds = getMainReadableSectionIds(book);
  const defaultIdSet = new Set(defaultIds);
  const allMainReadableSectionsIncludedByDefault =
    mainReadableIds.length > 0 &&
    mainReadableIds.every((sectionId) => defaultIdSet.has(sectionId));

  const firstDefaultSummary =
    book.sections.find((section) => section.id === defaultIds[0]) ?? null;
  const firstDefaultSection = firstDefaultSummary
    ? readSection(book.slug, firstDefaultSummary)
    : null;
  const firstDefaultSnippet = firstDefaultSection
    ? compactText(textFromSection(firstDefaultSection))
    : null;
  const firstDefaultSectionLooksLikeNonMainMaterial = firstDefaultSummary
    ? looksLikeNonMainMaterial(firstDefaultSummary) ||
      hasGenericOrBoilerplateStart(firstDefaultSnippet ?? "")
    : true;
  const firstDefaultSectionLooksLikeRealContent =
    Boolean(firstDefaultSummary) &&
    Boolean(firstDefaultSection) &&
    isDefaultReadableBookSection(firstDefaultSummary!) &&
    !firstDefaultSectionLooksLikeNonMainMaterial;

  const previewContainsSosHelp = preview ? sosHelpPattern.test(preview.previewText) : false;
  const previewMatchesGeneratedContentHash =
    Boolean(preview) &&
    preview!.slug === book.slug &&
    preview!.contentVersion === book.contentVersion &&
    preview!.contentHash === book.contentHash;
  const previewMatchesSection =
    preview?.defaultSectionId === firstDefaultSummary?.id &&
    previewStartsWithSection(preview, firstDefaultSection);
  const previewStartsFromRealReadableBookContent =
    Boolean(preview) &&
    previewMatchesGeneratedContentHash &&
    !previewContainsSosHelp &&
    !hasGenericOrBoilerplateStart(preview!.previewText) &&
    firstDefaultSectionLooksLikeRealContent &&
    previewMatchesSection;

  const firstContentNotes = detectFirstContentIssue(
    book,
    defaultIds,
    mainReadableIds,
    firstDefaultSummary,
  );
  if (!previewAssetExists) warnings.push("Preview asset is missing.");
  if (previewAssetExists && !preview) warnings.push("Preview asset schema is invalid.");
  if (preview && !previewMatchesGeneratedContentHash) {
    warnings.push("Preview asset content hash/version is stale.");
  }
  if (previewContainsSosHelp) warnings.push("Preview asset contains SOS Help.");
  if (preview && hasGenericOrBoilerplateStart(preview.previewText)) {
    warnings.push("Preview asset starts with generic or non-main material.");
  }
  if (!firstDefaultSectionLooksLikeRealContent) {
    warnings.push("First default generated section does not look like real main content.");
  }
  if (!allMainReadableSectionsIncludedByDefault) {
    warnings.push("Not all detected main-readable sections are selected by default.");
  }
  warnings.push(...firstContentNotes);

  const generatedNeedsCorrection =
    !firstDefaultSummary ||
    !firstDefaultSection ||
    !firstDefaultSectionLooksLikeRealContent ||
    firstDefaultSectionLooksLikeNonMainMaterial ||
    firstContentNotes.length > 0;
  const previewNeedsRegeneration =
    !previewAssetExists ||
    !preview ||
    !previewMatchesGeneratedContentHash ||
    previewContainsSosHelp ||
    (preview ? hasGenericOrBoilerplateStart(preview.previewText) : true) ||
    !previewMatchesSection;

  let recommendation: PreviewRecommendation = "valid";
  if (generatedNeedsCorrection) {
    recommendation = "generated book needs processing correction later";
  } else if (previewNeedsRegeneration) {
    recommendation = "preview asset needs regeneration from generated readable sections";
  } else if (!allMainReadableSectionsIncludedByDefault) {
    recommendation = "blocked/manual review";
  }

  let previewRepairApplied = false;
  let nextPreview = preview;
  if (
    recommendation ===
      "preview asset needs regeneration from generated readable sections" &&
    firstDefaultSummary &&
    firstDefaultSection &&
    firstDefaultSectionLooksLikeRealContent
  ) {
    nextPreview = buildPreviewAsset(book, firstDefaultSummary, firstDefaultSection);
    if (nextPreview) {
      const previewPath = path.join(previewRoot, `${book.slug}.preview.json`);
      previewRepairApplied = writeJsonIfChanged(previewPath, nextPreview);
      if (previewRepairApplied) {
        warnings.push("Preview asset regenerated from generated readable section.");
      }
    } else {
      recommendation = "blocked/manual review";
      warnings.push("Preview asset could not be rebuilt safely.");
    }
  }

  const startupPreviewValid =
    !generatedNeedsCorrection &&
    Boolean(nextPreview) &&
    nextPreview!.slug === book.slug &&
    nextPreview!.contentVersion === book.contentVersion &&
    nextPreview!.contentHash === book.contentHash &&
    !sosHelpPattern.test(nextPreview!.previewText) &&
    !hasGenericOrBoilerplateStart(nextPreview!.previewText) &&
    firstDefaultSectionLooksLikeRealContent &&
    previewStartsWithSection(nextPreview, firstDefaultSection);

  if (startupPreviewValid && recommendation !== "valid") {
    recommendation = previewRepairApplied ? "valid" : recommendation;
  }

  return {
    result: {
      slug: book.slug,
      title: book.title,
      generatedOutputExists,
      previewAssetExists,
      previewContainsSosHelp,
      previewStartsFromRealReadableBookContent: startupPreviewValid,
      previewMatchesGeneratedContentHash:
        Boolean(nextPreview) &&
        nextPreview!.contentVersion === book.contentVersion &&
        nextPreview!.contentHash === book.contentHash,
      firstDefaultGeneratedSection: {
        id: firstDefaultSummary?.id ?? null,
        title: firstDefaultSummary?.title ?? null,
        label: firstDefaultSummary?.label ?? null,
        type: firstDefaultSummary?.kind ?? null,
        wordCount: firstDefaultSummary?.wordCount ?? null,
        includeByDefault: firstDefaultSummary?.includeByDefault ?? null,
        snippet: firstDefaultSnippet,
      },
      firstDefaultSectionLooksLikeRealContent,
      firstDefaultSectionLooksLikeNonMainMaterial,
      chapterPartOrFirstStoryMissingOrMisclassified: firstContentNotes.length > 0,
      chapterPartOrFirstStoryNotes: firstContentNotes,
      allMainReadableSectionsIncludedByDefault,
      defaultSectionCount: defaultIds.length,
      mainReadableSectionCount: mainReadableIds.length,
      startupPreviewValid,
      recommendation,
      previewRepairApplied,
      warnings,
      snippets: {
        generatedStart: firstDefaultSnippet,
        previewStart: nextPreview ? compactText(nextPreview.previewText) : null,
      },
    },
    previewAsset: nextPreview,
  };
}

function rebuildPreviewManifest(results: Array<ReturnType<typeof auditBook>>) {
  const manifestEntries: BookPreviewManifest["books"] = [];
  const missing: BookPreviewManifest["missing"] = [];

  for (const { result, previewAsset } of results) {
    if (!previewAsset || !result.startupPreviewValid) {
      missing.push({
        slug: result.slug,
        reason: result.warnings[0] ?? "No valid startup preview.",
      });
      continue;
    }

    const previewPath = path.join(previewRoot, `${result.slug}.preview.json`);
    manifestEntries.push({
      slug: result.slug,
      path: `${PREVIEW_BASE_PATH}/${result.slug}.preview.json`,
      contentVersion: previewAsset.contentVersion,
      contentHash: previewAsset.contentHash,
      defaultSectionId: previewAsset.defaultSectionId,
      previewBytes: fs.existsSync(previewPath) ? fs.statSync(previewPath).size : 0,
      previewCharacterCount: previewAsset.characterCount,
      estimatedRuntimeSeconds: previewAsset.estimatedRuntimeSeconds,
      truncated: previewAsset.truncated,
    });
  }

  return {
    version: 1,
    assetBasePath: PREVIEW_BASE_PATH,
    targetRuntimeSeconds: TARGET_RUNTIME_SECONDS,
    books: manifestEntries,
    missing,
  } satisfies BookPreviewManifest;
}

function buildMarkdownReport(report: AuditReport) {
  const lines: string[] = [];
  lines.push("# Book Startup Preview Audit 1");
  lines.push("");
  lines.push(`Generated at: ${report.generatedAt}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Generated books checked: ${report.generatedBookCount}`);
  lines.push(`- Preview assets found: ${report.previewAssetCount}`);
  lines.push(`- Valid startup previews: ${report.validStartupPreviewCount}`);
  lines.push(
    `- Preview assets updated by this audit run: ${
      report.previewAssetsUpdated.length > 0
        ? report.previewAssetsUpdated.join(", ")
        : "none"
    }`,
  );
  lines.push(
    `- Invalid or missing previews: ${
      report.booksWithInvalidOrMissingPreviews.length > 0
        ? report.booksWithInvalidOrMissingPreviews.join(", ")
        : "none"
    }`,
  );
  lines.push(
    `- Suspicious first default sections: ${
      report.booksWithSuspiciousFirstDefaultSections.length > 0
        ? report.booksWithSuspiciousFirstDefaultSections.join(", ")
        : "none"
    }`,
  );
  lines.push("");
  lines.push("## Recommendations");
  lines.push("");
  lines.push("| Recommendation | Books |");
  lines.push("| --- | ---: |");
  for (const [recommendation, slugs] of Object.entries(report.recommendations)) {
    lines.push(`| ${recommendation} | ${slugs.length} |`);
  }
  lines.push("");
  lines.push("## Book Results");
  lines.push("");
  lines.push(
    "| Slug | Startup preview | First default section | Defaults | Recommendation | Warnings |",
  );
  lines.push("| --- | --- | --- | --- | --- | --- |");
  for (const book of report.books) {
    const firstDefault = book.firstDefaultGeneratedSection.id
      ? `${book.firstDefaultGeneratedSection.id} (${book.firstDefaultGeneratedSection.type})`
      : "missing";
    const defaults = `${book.defaultSectionCount}/${book.mainReadableSectionCount}`;
    const warnings =
      book.warnings.length > 0 ? book.warnings.map((warning) => warning.replace(/\|/g, "\\|")).join("; ") : "none";
    lines.push(
      `| ${book.slug} | ${book.startupPreviewValid ? "valid" : "invalid"} | ${firstDefault} | ${defaults} | ${book.recommendation} | ${warnings} |`,
    );
  }
  lines.push("");
  lines.push("## Protected Paths");
  lines.push("");
  lines.push(`- Raw/source input: ${report.protectedPaths.rawSourceInput}`);
  lines.push(`- Generated books: ${report.protectedPaths.generatedBooks}`);
  lines.push(`- Cloudflare export: ${report.protectedPaths.cloudflareExport}`);
  lines.push(`- Preview assets: ${report.protectedPaths.previewAssets}`);
  lines.push("");
  lines.push(
    "No raw source books, Cloudflare exports, or generated book content are modified by this audit command.",
  );
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function main() {
  assertSafeOutputPaths();
  const libraryManifest = readJson<GeneratedLibraryManifest>(libraryManifestPath);
  const results = libraryManifest.books.map((book) => auditBook(book));
  const previewAssetsUpdated = results
    .filter(({ result }) => result.previewRepairApplied)
    .map(({ result }) => result.slug);

  if (previewAssetsUpdated.length > 0) {
    const nextPreviewManifest = rebuildPreviewManifest(results);
    writeJsonIfChanged(previewManifestPath, nextPreviewManifest);
  }

  const books = results.map(({ result }) => result);
  const recommendationKeys: PreviewRecommendation[] = [
    "valid",
    "preview asset needs regeneration from generated readable sections",
    "generated book needs processing correction later",
    "blocked/manual review",
  ];
  const recommendations = Object.fromEntries(
    recommendationKeys.map((recommendation) => [
      recommendation,
      books
        .filter((book) => book.recommendation === recommendation)
        .map((book) => book.slug),
    ]),
  ) as Record<PreviewRecommendation, string[]>;

  const report: AuditReport = {
    generatedAt: new Date().toISOString(),
    generatedBookCount: books.length,
    previewAssetCount: fs
      .readdirSync(previewRoot)
      .filter((fileName) => fileName.endsWith(".preview.json")).length,
    validStartupPreviewCount: books.filter((book) => book.startupPreviewValid)
      .length,
    previewAssetsUpdated,
    booksWithInvalidOrMissingPreviews: books
      .filter((book) => !book.startupPreviewValid)
      .map((book) => book.slug),
    booksWithSuspiciousFirstDefaultSections: books
      .filter((book) => book.firstDefaultSectionLooksLikeNonMainMaterial)
      .map((book) => book.slug),
    booksWithMissingOrMisclassifiedFirstContent: books
      .filter((book) => book.chapterPartOrFirstStoryMissingOrMisclassified)
      .map((book) => book.slug),
    recommendations,
    protectedPaths: {
      rawSourceInput: "app/client/assets/temp-books",
      generatedBooks: "app/client/assets/books/generated",
      cloudflareExport: "app/client/assets/books/cloudflare-export",
      previewAssets: "public/book-previews",
    },
    books,
  };

  const jsonPath = path.join(reportRoot, "book-startup-preview-audit-1.json");
  const markdownPath = path.join(reportRoot, "book-startup-preview-audit-1.md");
  writeJsonIfChanged(jsonPath, report);
  writeTextIfChanged(markdownPath, buildMarkdownReport(report));

  const digest = crypto
    .createHash("sha256")
    .update(JSON.stringify(books.map((book) => [book.slug, book.startupPreviewValid])))
    .digest("hex")
    .slice(0, 12);
  console.log(
    `Audited ${books.length} generated book startup previews (${report.validStartupPreviewCount} valid, ${previewAssetsUpdated.length} preview updates, ${digest}).`,
  );
  if (report.booksWithInvalidOrMissingPreviews.length > 0) {
    console.log("Invalid or missing startup previews:");
    report.booksWithInvalidOrMissingPreviews.forEach((slug) => {
      const book = books.find((entry) => entry.slug === slug);
      console.log(`- ${slug}: ${book?.recommendation ?? "unknown"}`);
    });
  }
}

main();
