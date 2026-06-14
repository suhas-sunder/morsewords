import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { detectBookSections } from "./detect-book-sections.ts";
import type {
  BookMetadata,
  BookRightsReport,
  BookSectionKind,
  CleanedBookJson,
  DetectedBookSection,
  GeneratedBookManifest,
  GeneratedBookSectionJson,
  GeneratedLibraryManifest,
  ProcessedBookJson,
} from "./bookManifestTypes.ts";
import {
  countBookWords,
  estimateMorseCharacters,
  normalizeBookText,
  splitParagraphs,
  summarizeUnsupportedCharacters,
  textPreview,
  trimBookText,
} from "./bookTextNormalization.ts";

type DryRunBook = {
  slug: string;
  sourceFilename: string;
  sourcePath: string;
  pass2RiskLevel: "low" | "medium" | "high" | "blocked";
  existingGeneratedOutputExists: boolean;
  candidateTitle: string;
  candidateAuthor: string[];
  rawWordCount: number;
  candidateStartLine: number;
  candidateEndLine: number;
  finalDryRunRecommendation: string;
  comparisonAgainstExistingGeneratedOutput: string;
  firstHourPreviewCandidate?: {
    sectionsUsed?: string[];
    approximateWordCount?: number;
    startsAtRealReadableContent?: boolean;
    confidence?: string;
  };
};

type PilotBoundary = {
  startLine: number;
  endLine: number;
  includeKinds: BookSectionKind[];
  startReason: string;
  endReason: string;
};

type CleanupSummary = {
  imagePlaceholderLinesRemoved: number;
  numberedReferencesRemoved: number;
  decorativeLinesRemoved: number;
  standaloneFinisLinesRemoved: number;
  unicodeNormalized: boolean;
  dashesNormalized: boolean;
};

type WrittenBookReport = {
  slug: string;
  status: "written" | "skipped";
  reasonIfSkipped: string | null;
  sourceFileUsed: string;
  generatedOutputFilesChanged: string[];
  previewAssetFileChanged: string | null;
  candidateTitle: string;
  candidateAuthor: string[];
  pass2RiskLevel: string;
  startBoundaryUsed: {
    line: number;
    reason: string;
    snippet: string;
    linesBefore: string[];
  };
  endBoundaryUsed: {
    line: number;
    reason: string;
    snippet: string;
    linesAfter: string[];
  };
  removedFrontMatterSummary: {
    wordCountEstimate: number;
    lineRange: string;
  };
  removedEndMatterSummary: {
    wordCountEstimate: number;
    lineRange: string;
  };
  sectionCount: number;
  firstFiveSections: Array<{
    id: string;
    label: string;
    title: string | null;
    wordCount: number;
  }>;
  lastFiveSections: Array<{
    id: string;
    label: string;
    title: string | null;
    wordCount: number;
  }>;
  suspiciouslyShortSections: Array<{
    id: string;
    label: string;
    title: string | null;
    wordCount: number;
  }>;
  suspiciouslyLongSections: Array<{
    id: string;
    label: string;
    title: string | null;
    wordCount: number;
  }>;
  cleanupActionsApplied: CleanupSummary;
  remainingWarnings: string[];
  firstHourPreviewSourceSections: string[];
  comparisonAgainstPriorGeneratedOutput: string;
  finalRecommendation:
    | "accepted for review"
    | "needs manual review before scaling"
    | "skipped";
};

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "..", "..");
const tempBooksRoot = path.join(repoRoot, "app", "client", "assets", "temp-books");
const generatedRoot = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "generated",
);
const cloudflareRoot = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "cloudflare-export",
);
const reportRoot = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "pilot-write-1",
);
const previewRoot = path.join(repoRoot, "public", "book-previews");
const dryRunReportPath = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "pilot-dry-run-1",
  "pilot-dry-run-1.json",
);
const pass1ReportPath = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "book-processing-audit-pass-1.json",
);
const pass2ReportPath = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "book-processing-audit-pass-2.json",
);
const libraryManifestPath = path.join(generatedRoot, "library-manifest.json");
const previewManifestPath = path.join(previewRoot, "manifest.json");

const approvedPilotSlugs = [
  "almayer-s-folly-a-story-of-an-eastern-river",
  "the-house-without-a-key",
  "the-lerouge-case",
  "a-dream-of-armageddon",
  "a-journey-to-the-centre-of-the-earth",
  "a-journal-of-the-plague-year",
  "dracula",
] as const;

const individualReviewSlugs = new Set([
  "a-christmas-carol",
  "dr-jekyll-and-mr-hyde",
  "a-catastrophe",
]);

const boundaryOverrides: Record<(typeof approvedPilotSlugs)[number], PilotBoundary> = {
  "almayer-s-folly-a-story-of-an-eastern-river": {
    startLine: 63,
    endLine: 6320,
    includeKinds: ["chapter"],
    startReason: "Starts at CHAPTER I after title, printing history, and dedication.",
    endReason: "Ends immediately before the Project Gutenberg end marker.",
  },
  "the-house-without-a-key": {
    startLine: 66,
    endLine: 11071,
    includeKinds: ["chapter"],
    startReason: "Starts at CHAPTER I after title page and dedication.",
    endReason: "Ends immediately before the Project Gutenberg end marker.",
  },
  "the-lerouge-case": {
    startLine: 35,
    endLine: 14329,
    includeKinds: ["chapter"],
    startReason: "Starts at CHAPTER I after Gutenberg header, title, and author lines.",
    endReason: "Ends immediately before the Project Gutenberg end marker.",
  },
  "a-dream-of-armageddon": {
    startLine: 34,
    endLine: 540,
    includeKinds: ["part"],
    startReason: "Starts at the story title and skips the Gutenberg URL/source note.",
    endReason: "Source file ends with the story text and has no separate license footer.",
  },
  "a-journey-to-the-centre-of-the-earth": {
    startLine: 153,
    endLine: 10970,
    includeKinds: ["chapter"],
    startReason: "Starts at CHAPTER 1 after the table of contents and source notes.",
    endReason: "Ends immediately before the Project Gutenberg end marker.",
  },
  "a-journal-of-the-plague-year": {
    startLine: 51,
    endLine: 9525,
    includeKinds: ["part"],
    startReason:
      "Starts at the first narrative paragraph after title page, subtitle, byline, and illustration placeholder.",
    endReason: "Ends immediately before the Project Gutenberg end marker.",
  },
  dracula: {
    startLine: 116,
    endLine: 15436,
    includeKinds: ["chapter"],
    startReason:
      "Starts at CHAPTER I after title-page, dedication, table of contents, and opening editorial note.",
    endReason: "Ends at the novel's own THE END and excludes the publisher catalog.",
  },
};

const originalPublicationYears: Record<string, number> = {
  "almayer-s-folly-a-story-of-an-eastern-river": 1895,
  "the-house-without-a-key": 1925,
  "the-lerouge-case": 1866,
  "a-dream-of-armageddon": 1901,
  "a-journey-to-the-centre-of-the-earth": 1864,
  "a-journal-of-the-plague-year": 1722,
  dracula: 1897,
};

const authorDeathYears: Record<string, number> = {
  "almayer-s-folly-a-story-of-an-eastern-river": 1924,
  "the-house-without-a-key": 1933,
  "the-lerouge-case": 1873,
  "a-dream-of-armageddon": 1946,
  "a-journey-to-the-centre-of-the-earth": 1905,
  "a-journal-of-the-plague-year": 1731,
  dracula: 1912,
};

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function writeText(filePath: string, value: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value, "utf8");
}

function assertInside(parent: string, target: string) {
  const relative = path.relative(path.resolve(parent), path.resolve(target));
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to write outside ${parent}: ${target}`);
  }
}

function ensureApprovedSlug(slug: string): asserts slug is (typeof approvedPilotSlugs)[number] {
  if (!approvedPilotSlugs.includes(slug as (typeof approvedPilotSlugs)[number])) {
    throw new Error(`Refusing to process non-approved pilot slug: ${slug}`);
  }
  if (individualReviewSlugs.has(slug)) {
    throw new Error(`Refusing to process individual-review slug: ${slug}`);
  }
}

function sha256Json(value: unknown) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function estimateTypingMinutes(wordCount: number) {
  return Math.max(1, Math.ceil(wordCount / 40));
}

function estimateListeningMinutes(morseCharacterEstimate: number) {
  return Math.max(1, Math.ceil(morseCharacterEstimate / 900));
}

function safeSourcePath(sourcePath: string) {
  const resolved = path.resolve(repoRoot, sourcePath);
  assertInside(tempBooksRoot, resolved);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Missing pilot source file: ${sourcePath}`);
  }
  return resolved;
}

function lineContext(
  lines: string[],
  line: number,
  before: number,
  after: number,
): string[] {
  const start = Math.max(1, line - before);
  const end = Math.min(lines.length, line + after);
  const result: string[] = [];
  for (let index = start; index <= end; index += 1) {
    result.push(`L${index}: ${lines[index - 1] ?? ""}`);
  }
  return result;
}

function snippetFromLine(lines: string[], line: number) {
  const chunk = lines.slice(Math.max(0, line - 1), Math.min(lines.length, line + 6));
  return textPreview(chunk.join(" "), 240);
}

function extractBodyByLines(rawText: string, boundary: PilotBoundary) {
  const normalized = rawText.replace(/^\uFEFF/, "").replace(/\r\n|\r/g, "\n");
  const lines = normalized.split("\n");
  if (boundary.startLine < 1 || boundary.endLine > lines.length) {
    throw new Error(
      `Boundary ${boundary.startLine}-${boundary.endLine} is outside ${lines.length} source lines.`,
    );
  }
  if (boundary.endLine < boundary.startLine) {
    throw new Error(`End boundary is before start boundary.`);
  }

  const frontMatterText = lines.slice(0, boundary.startLine - 1).join("\n");
  const endMatterText = lines.slice(boundary.endLine).join("\n");
  const bodyText = lines.slice(boundary.startLine - 1, boundary.endLine).join("\n");

  return {
    lines,
    bodyText,
    frontMatterText,
    endMatterText,
  };
}

function cleanPilotBody(input: string): { text: string; summary: CleanupSummary } {
  const summary: CleanupSummary = {
    imagePlaceholderLinesRemoved: 0,
    numberedReferencesRemoved: 0,
    decorativeLinesRemoved: 0,
    standaloneFinisLinesRemoved: 0,
    unicodeNormalized: /[\u00a0\u2018\u2019\u201c\u201d\u2026\uFB00-\uFB06]/.test(input),
    dashesNormalized: /[\u2010-\u2015]/.test(input),
  };

  let text = normalizeBookText(input)
    .replace(/\u00a0/g, " ")
    .replace(/\uFEFF/g, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[‐‑‒–—―]/g, "-")
    .replace(/…/g, "...")
    .replace(/ﬀ/g, "ff")
    .replace(/ﬁ/g, "fi")
    .replace(/ﬂ/g, "fl")
    .replace(/ﬃ/g, "ffi")
    .replace(/ﬄ/g, "ffl")
    .replace(/ﬅ/g, "ft")
    .replace(/ﬆ/g, "st");

  text = text.replace(/\[(?:[1-9][0-9]?|100)\]/g, () => {
    summary.numberedReferencesRemoved += 1;
    return "";
  });

  const keptLines: string[] = [];
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (/^\[(?:Illustration|Illustrations|Plate|Image|Map|Music|Facsimile|Portrait)[^\]]*\]$/i.test(trimmed)) {
      summary.imagePlaceholderLinesRemoved += 1;
      continue;
    }
    if (/^(?:\*[\s*]*){3,}$/.test(trimmed) || /^(?:[-_=~]\s*){4,}$/.test(trimmed)) {
      summary.decorativeLinesRemoved += 1;
      continue;
    }
    if (/^FINIS\.?$/i.test(trimmed)) {
      summary.standaloneFinisLinesRemoved += 1;
      continue;
    }
    if (/^[^\p{L}\p{N}]+$/u.test(trimmed) && trimmed.length >= 6) {
      summary.decorativeLinesRemoved += 1;
      continue;
    }
    keptLines.push(line);
  }

  return {
    text: trimBookText(keptLines.join("\n")).replace(/[ \t]{2,}/g, " "),
    summary,
  };
}

function extractHeaderValue(rawText: string, label: string) {
  const match = rawText.match(new RegExp(`^${label}:\\s*(.+)$`, "im"));
  return match?.[1]?.trim() ?? null;
}

function extractGutenbergId(rawText: string) {
  const release = extractHeaderValue(rawText, "Release date") ?? "";
  const idMatch = release.match(/eBook\s*#?(\d+)/i) ?? rawText.match(/ebooks\/(\d+)/i);
  return idMatch?.[1] ?? null;
}

function sourceUrlFor(gutenbergId: string | null) {
  return gutenbergId ? `https://www.gutenberg.org/ebooks/${gutenbergId}` : null;
}

function makeMetadata(
  dryRun: DryRunBook,
  rawText: string,
  boundary: PilotBoundary,
): BookMetadata {
  const author = dryRun.candidateAuthor.length > 0 ? dryRun.candidateAuthor : ["Unknown"];
  const gutenbergId = extractGutenbergId(rawText);
  const releaseDateRaw = extractHeaderValue(rawText, "Release date");
  const releaseDate = releaseDateRaw?.replace(/\s*\[.*$/, "").trim() ?? null;
  return {
    schemaVersion: 1,
    slug: dryRun.slug,
    metadataStatus: "reviewed",
    manualReviewRequired: dryRun.pass2RiskLevel !== "low",
    title: dryRun.candidateTitle,
    author,
    language: "en",
    source: {
      provider: "Project Gutenberg",
      gutenbergId,
      sourceUrl: sourceUrlFor(gutenbergId),
      rawTextFile: dryRun.sourceFilename,
      releaseDate,
      rawTextUrl: null,
      rightsBasis: "public-domain-us",
      rightsReviewed: true,
      rightsNotes:
        "Pilot write pass 1 processed this source from the audited Project Gutenberg text. Review generated output before scaling the processor.",
    },
    cover: {
      src: null,
      placeholder: true,
      alt: `Placeholder cover for ${dryRun.candidateTitle}`,
    },
    description: "",
    subjects: [],
    originalPublicationYear: originalPublicationYears[dryRun.slug] ?? null,
    defaults: {
      includeKinds: boundary.includeKinds,
      excludeKinds: [
        "title-page",
        "dedication",
        "epigraph",
        "preface",
        "introduction",
        "prologue",
        "notes",
        "transcriber-note",
        "source-license",
        "advertisement",
        "index",
        "glossary",
      ],
      preferredPreset: "main-narrative",
    },
    sectionOverrides: [],
    cleanupRules: [],
  };
}

function inferSectionTitle(section: DetectedBookSection) {
  if (section.title || section.kind !== "chapter") return section.title;
  const lines = section.text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const candidate = lines[1];
  if (!candidate || candidate.length > 96) return null;
  const hasLowercase = /[a-z]/.test(candidate);
  const words = candidate.split(/\s+/).length;
  if (!hasLowercase && words <= 10) return candidate.replace(/\s+/g, " ");
  if (/^(?:[A-Z][A-Za-z'.-]+(?:\s+[A-Z][A-Za-z'.-]+){0,5})$/.test(candidate)) {
    return candidate.replace(/\s+/g, " ");
  }
  return null;
}

function enrichSections(sections: DetectedBookSection[]): DetectedBookSection[] {
  return sections.map((section, index) => ({
    ...section,
    title: inferSectionTitle(section),
    order: index + 1,
  }));
}

function mergeTinyTerminalFallbackPart(
  sections: DetectedBookSection[],
): DetectedBookSection[] {
  if (sections.length < 2) return sections;
  const last = sections[sections.length - 1];
  const previous = sections[sections.length - 2];
  if (last.kind !== "part" || previous.kind !== "part" || last.wordCount >= 50) {
    return sections;
  }

  const mergedText = trimBookText(`${previous.text}\n\n${last.text}`);
  const merged: DetectedBookSection = {
    ...previous,
    sourceEndOffset: last.sourceEndOffset,
    characterCount: mergedText.length,
    wordCount: countBookWords(mergedText),
    morseCharacterEstimate: estimateMorseCharacters(mergedText),
    textPreview: textPreview(mergedText),
    text: mergedText,
  };

  return [...sections.slice(0, -2), merged].map((section, index) => ({
    ...section,
    order: index + 1,
  }));
}

function sectionJsonPath(section: DetectedBookSection) {
  return `sections/${section.id}.json`;
}

function makeSectionJson(
  slug: string,
  section: DetectedBookSection,
): GeneratedBookSectionJson {
  const estimatedTyping = estimateTypingMinutes(section.wordCount);
  const estimatedListening = estimateListeningMinutes(section.morseCharacterEstimate);
  return {
    schemaVersion: 1,
    bookSlug: slug,
    sectionId: section.id,
    kind: section.kind,
    label: section.label,
    title: section.title,
    order: section.order,
    includeByDefault: section.includeByDefault,
    displayText: section.text,
    morseSourceText: section.text,
    paragraphs: splitParagraphs(section.text),
    wordCount: section.wordCount,
    characterCount: section.characterCount,
    estimatedTypingMinutes: estimatedTyping,
    estimatedListeningMinutes: estimatedListening,
    morseCharacterEstimate: section.morseCharacterEstimate,
    unsupportedCharacterSummary: summarizeUnsupportedCharacters(section.text),
    textPreview: section.textPreview,
    sourceOffsets: {
      start: section.sourceStartOffset,
      end: section.sourceEndOffset,
    },
  };
}

function buildContentHash(
  metadata: BookMetadata,
  cleanedText: string,
  sections: DetectedBookSection[],
) {
  return sha256Json({
    slug: metadata.slug,
    title: metadata.title,
    author: metadata.author,
    cleanedText,
    sections: sections.map((section) => ({
      id: section.id,
      kind: section.kind,
      label: section.label,
      title: section.title,
      includeByDefault: section.includeByDefault,
      text: section.text,
    })),
  });
}

function buildManifest(
  metadata: BookMetadata,
  rawText: string,
  cleanedText: string,
  sections: DetectedBookSection[],
  contentHash: string,
  cleaningWarnings: string[],
  cleanupSummary: CleanupSummary,
): GeneratedBookManifest {
  const included = sections.filter((section) => section.includeByDefault);
  return {
    schemaVersion: 1,
    slug: metadata.slug,
    title: metadata.title,
    author: metadata.author,
    contentVersion: contentHash.slice(0, 16),
    contentHash,
    language: metadata.language,
    description: metadata.description,
    subjects: metadata.subjects,
    source: {
      provider: metadata.source.provider,
      gutenbergId: metadata.source.gutenbergId,
      releaseDate: metadata.source.releaseDate,
      sourceUrl: metadata.source.sourceUrl ?? null,
      rawTextUrl: metadata.source.rawTextUrl ?? null,
      rightsBasis: metadata.source.rightsBasis,
      rightsReviewed: metadata.source.rightsReviewed,
      publishReady: true,
      rightsStatus: "approved",
      processingAllowed: true,
      approvalSource: "external-authority",
      duplicateResolutionSource: "not-needed",
      rightsReportPath: "rights_report.json",
      processedBookPath: "processed_book.json",
      cleanedBookPath: "cleaned_book.json",
      rightsNotes: metadata.source.rightsNotes,
    },
    cover: metadata.cover,
    stats: {
      originalCharacterCount: rawText.length,
      cleanedCharacterCount: cleanedText.length,
      wordCount: countBookWords(cleanedText),
      sectionCount: sections.length,
      includedSectionCount: included.length,
    },
    defaults: {
      includeKinds: metadata.defaults.includeKinds,
      preferredPreset: metadata.defaults.preferredPreset,
    },
    sections: sections.map((section) => ({
      id: section.id,
      kind: section.kind,
      label: section.label,
      title: section.title,
      order: section.order,
      includeByDefault: section.includeByDefault,
      sectionJsonPath: sectionJsonPath(section),
      characterCount: section.characterCount,
      wordCount: section.wordCount,
      estimatedTypingMinutes: estimateTypingMinutes(section.wordCount),
      estimatedListeningMinutes: estimateListeningMinutes(section.morseCharacterEstimate),
      morseCharacterEstimate: section.morseCharacterEstimate,
      textPreview: section.textPreview,
    })),
    cleaning: {
      originalCharacterCount: rawText.length,
      cleanedCharacterCount: cleanedText.length,
      headerStripped: true,
      footerStripped: true,
      confidence: metadata.manualReviewRequired ? "medium" : "high",
      warnings: cleaningWarnings,
    },
    warnings: [
      "Generated by controlled pilot write pass 1; review before scaling to larger batches.",
      ...(cleanupSummary.standaloneFinisLinesRemoved > 0
        ? ["Standalone FINIS marker removed from playable text."]
        : []),
      ...cleaningWarnings,
    ],
  };
}

function buildCleanedBook(
  metadata: BookMetadata,
  manifest: GeneratedBookManifest,
  sections: DetectedBookSection[],
): CleanedBookJson {
  return {
    schemaVersion: 1,
    id: metadata.slug,
    title: metadata.title,
    author: metadata.author.join(", "),
    contentVersion: manifest.contentVersion,
    contentHash: manifest.contentHash,
    source: {
      provider: metadata.source.provider,
      gutenbergId: metadata.source.gutenbergId,
      sourceUrl: metadata.source.sourceUrl ?? null,
      rawTextUrl: metadata.source.rawTextUrl ?? null,
      originalPublication: String(metadata.originalPublicationYear ?? ""),
      releaseDate: metadata.source.releaseDate ?? "",
      lastUpdated: "",
    },
    stats: {
      wordCount: manifest.stats.wordCount,
      characterCount: manifest.stats.cleanedCharacterCount,
      sectionCount: sections.length,
      estimatedTypingMinutes: sections.reduce(
        (total, section) => total + estimateTypingMinutes(section.wordCount),
        0,
      ),
      estimatedListeningMinutes: sections.reduce(
        (total, section) =>
          total + estimateListeningMinutes(section.morseCharacterEstimate),
        0,
      ),
    },
    sections: sections.map((section) => ({
      id: section.id,
      kind: section.kind,
      label: section.label,
      title: section.title,
      order: section.order,
      includeByDefault: section.includeByDefault,
      text: section.text,
      paragraphs: splitParagraphs(section.text),
      wordCount: section.wordCount,
      characterCount: section.characterCount,
      estimatedTypingMinutes: estimateTypingMinutes(section.wordCount),
      estimatedListeningMinutes: estimateListeningMinutes(section.morseCharacterEstimate),
    })),
  };
}

function buildProcessedBook(
  metadata: BookMetadata,
  manifest: GeneratedBookManifest,
  sections: DetectedBookSection[],
): ProcessedBookJson {
  return {
    schemaVersion: 1,
    id: metadata.slug,
    title: metadata.title,
    author: metadata.author.join(", "),
    content_version: manifest.contentVersion,
    content_hash: manifest.contentHash,
    source: {
      name: metadata.source.provider,
      ebook_number: metadata.source.gutenbergId ?? "",
      source_url: metadata.source.sourceUrl ?? null,
      raw_text_url: metadata.source.rawTextUrl ?? null,
      original_publication: String(metadata.originalPublicationYear ?? ""),
      release_date: metadata.source.releaseDate ?? "",
      last_updated: "",
    },
    rights: {
      status: "approved",
      approved_for_website: true,
      approved_for_youtube_narration: false,
      approved_regions: ["US"],
      needs_manual_review: metadata.manualReviewRequired ?? false,
      notes: metadata.source.rightsNotes,
    },
    content: {
      chapters: sections.map((section, index) => ({
        chapter_number: index + 1,
        title: section.title ? `${section.label}: ${section.title}` : section.label,
        sections: [
          {
            section_number: 1,
            text: section.text,
            word_count: section.wordCount,
            character_count: section.characterCount,
            estimated_typing_minutes: estimateTypingMinutes(section.wordCount),
            estimated_listening_minutes: estimateListeningMinutes(
              section.morseCharacterEstimate,
            ),
          },
        ],
      })),
    },
  };
}

function buildRightsReport(
  metadata: BookMetadata,
  rawText: string,
): BookRightsReport {
  const author = metadata.author.join(", ");
  const gutenbergId = metadata.source.gutenbergId ?? "";
  return {
    schemaVersion: 1,
    title: metadata.title,
    author,
    author_death_year: authorDeathYears[metadata.slug] ?? null,
    language: "English",
    original_publication: String(metadata.originalPublicationYear ?? ""),
    release_date: metadata.source.releaseDate ?? "",
    last_updated: "",
    source: metadata.source.provider,
    gutenberg_ebook_number: gutenbergId,
    source_url: metadata.source.sourceUrl ?? null,
    raw_text_url: metadata.source.rawTextUrl ?? null,
    gutenberg_header_present: /Project Gutenberg/i.test(rawText),
    project_gutenberg_license_present: /PROJECT GUTENBERG(?:™|TM)? LICENSE/i.test(
      rawText,
    ),
    us_reuse_language_found: /United States/i.test(rawText),
    non_us_warning_found: /not located in the United States/i.test(rawText),
    credits: extractHeaderValue(rawText, "Credits") ?? "",
    translator: "",
    translator_death_year: null,
    illustrator: "",
    editor: "",
    introduction_author: "",
    contains_modern_intro_or_notes: false,
    contains_transcriber_notes: /transcriber/i.test(rawText),
    contains_illustrations_or_image_references: /\[(?:Illustration|Image|Plate)/i.test(
      rawText,
    ),
    contains_later_copyright_notice: /copyright/i.test(rawText),
    contains_creative_commons_license: /creative commons/i.test(rawText),
    contains_permission_based_language: /permission/i.test(rawText),
    is_translation: metadata.slug === "the-lerouge-case",
    translation_risk: metadata.slug === "the-lerouge-case" ? "low" : "none",
    edition_risk: "low",
    trademark_or_character_brand_risk: "none",
    content_brand_safety_risk: "none",
    owner_reviewed_approval_present: false,
    approved_for_website: true,
    approved_for_youtube_narration: false,
    approved_regions: ["US"],
    approval_source: "external-authority",
    duplicate_resolution_source: "not-needed",
    canada_us_v1_status: "approved",
    reasoning_summary:
      "Controlled pilot write pass 1 used Project Gutenberg public-domain source text after audit review. Generated output remains review-gated before any Cloudflare export.",
    evidence_snippets: [
      metadata.source.sourceUrl
        ? `Project Gutenberg source URL: ${metadata.source.sourceUrl}`
        : "Project Gutenberg source URL was not detected in the source header.",
      `Author death year used for audit context: ${
        authorDeathYears[metadata.slug] ?? "unknown"
      }`,
    ],
    processing_allowed: true,
  };
}

function makePreviewAsset(
  manifest: GeneratedBookManifest,
  sections: DetectedBookSection[],
) {
  const defaultSections = sections.filter((section) => section.includeByDefault);
  const sourceSections = defaultSections.length > 0 ? defaultSections : sections;
  const targetMorseCharacters = 900 * 60;
  const selected: DetectedBookSection[] = [];
  let morseTotal = 0;
  for (const section of sourceSections) {
    selected.push(section);
    morseTotal += section.morseCharacterEstimate;
    if (morseTotal >= targetMorseCharacters) break;
  }
  const joined = selected.map((section) => section.text).join("\n\n");
  const truncated = morseTotal > targetMorseCharacters;
  let previewText = joined;
  if (truncated) {
    const ratio = Math.min(1, targetMorseCharacters / Math.max(1, morseTotal));
    const targetChars = Math.max(1_000, Math.floor(joined.length * ratio));
    const paragraphBreak = joined.lastIndexOf("\n\n", targetChars);
    previewText = trimBookText(
      joined.slice(0, paragraphBreak > 1_000 ? paragraphBreak : targetChars),
    );
  }
  const defaultSection = selected[0];
  const morseEstimate = estimateMorseCharacters(previewText);
  const wordCount = countBookWords(previewText);
  return {
    asset: {
      version: 1,
      slug: manifest.slug,
      contentVersion: manifest.contentVersion,
      contentHash: manifest.contentHash,
      defaultSectionId: defaultSection.id,
      defaultSectionKind: defaultSection.kind,
      defaultSectionLabel: defaultSection.label,
      defaultSectionTitle: defaultSection.title,
      previewText,
      estimatedRuntimeSeconds: Math.ceil((morseEstimate / 900) * 60),
      wordCount,
      characterCount: previewText.length,
      estimatedTypingMinutes: estimateTypingMinutes(wordCount),
      estimatedListeningMinutes: estimateListeningMinutes(morseEstimate),
      morseCharacterEstimate: morseEstimate,
      textPreview: textPreview(previewText),
      truncated,
    },
    sourceSections: selected.map((section) => section.id),
  };
}

function writeGeneratedOutput(
  manifest: GeneratedBookManifest,
  sectionJson: GeneratedBookSectionJson[],
  cleanedBook: CleanedBookJson,
  processedBook: ProcessedBookJson,
  rightsReport: BookRightsReport,
  notes: string,
) {
  const bookDir = path.join(generatedRoot, manifest.slug);
  const sectionsDir = path.join(bookDir, "sections");
  assertInside(generatedRoot, bookDir);
  assertInside(bookDir, sectionsDir);

  fs.mkdirSync(bookDir, { recursive: true });
  fs.rmSync(sectionsDir, { recursive: true, force: true });
  fs.mkdirSync(sectionsDir, { recursive: true });

  const changed = [
    path.join(bookDir, "manifest.json"),
    path.join(bookDir, "cleaned_book.json"),
    path.join(bookDir, "processed_book.json"),
    path.join(bookDir, "rights_report.json"),
    path.join(bookDir, "processing_notes.md"),
  ];

  writeJson(path.join(bookDir, "manifest.json"), manifest);
  writeJson(path.join(bookDir, "cleaned_book.json"), cleanedBook);
  writeJson(path.join(bookDir, "processed_book.json"), processedBook);
  writeJson(path.join(bookDir, "rights_report.json"), rightsReport);
  writeText(path.join(bookDir, "processing_notes.md"), notes);

  for (const section of sectionJson) {
    const sectionPath = path.join(sectionsDir, `${section.sectionId}.json`);
    writeJson(sectionPath, section);
    changed.push(sectionPath);
  }

  return changed;
}

function updateLibraryManifest(manifests: GeneratedBookManifest[]) {
  const library = readJson<GeneratedLibraryManifest>(libraryManifestPath);
  const bySlug = new Map(library.books.map((book) => [book.slug, book]));
  for (const manifest of manifests) {
    bySlug.set(manifest.slug, {
      slug: manifest.slug,
      title: manifest.title,
      author: manifest.author,
      contentVersion: manifest.contentVersion,
      contentHash: manifest.contentHash,
      language: manifest.language,
      description: manifest.description,
      subjects: manifest.subjects,
      source: manifest.source,
      cover: manifest.cover,
      stats: manifest.stats,
      defaults: manifest.defaults,
      manifestPath: `${manifest.slug}/manifest.json`,
    });
  }
  const existingOrder = library.books.map((book) => book.slug);
  const appended = manifests
    .map((manifest) => manifest.slug)
    .filter((slug) => !existingOrder.includes(slug));
  const orderedSlugs = [...existingOrder, ...appended];
  writeJson(libraryManifestPath, {
    schemaVersion: 1,
    books: orderedSlugs.map((slug) => bySlug.get(slug)).filter(Boolean),
  });
}

function updatePreviewManifest(previewEntries: Array<{
  slug: string;
  contentVersion: string;
  contentHash: string;
  defaultSectionId: string;
  previewBytes: number;
  previewCharacterCount: number;
  estimatedRuntimeSeconds: number;
  truncated: boolean;
}>) {
  const manifest = readJson<{
    version: number;
    assetBasePath: string;
    targetRuntimeSeconds: number;
    books: Array<Record<string, unknown> & { slug: string }>;
    missing: string[];
  }>(previewManifestPath);
  const bySlug = new Map(manifest.books.map((book) => [book.slug, book]));
  const existingOrder = manifest.books.map((book) => book.slug);
  for (const entry of previewEntries) {
    bySlug.set(entry.slug, {
      slug: entry.slug,
      path: `/book-previews/${entry.slug}.preview.json`,
      contentVersion: entry.contentVersion,
      contentHash: entry.contentHash,
      defaultSectionId: entry.defaultSectionId,
      previewBytes: entry.previewBytes,
      previewCharacterCount: entry.previewCharacterCount,
      estimatedRuntimeSeconds: entry.estimatedRuntimeSeconds,
      truncated: entry.truncated,
    });
  }
  const appended = previewEntries
    .map((entry) => entry.slug)
    .filter((slug) => !existingOrder.includes(slug));
  const orderedSlugs = [...existingOrder, ...appended];
  writeJson(previewManifestPath, {
    ...manifest,
    books: orderedSlugs.map((slug) => bySlug.get(slug)).filter(Boolean),
    missing: manifest.missing.filter(
      (slug) => !previewEntries.some((entry) => entry.slug === slug),
    ),
  });
}

function makeProcessingNotes(report: WrittenBookReport) {
  return `# ${report.candidateTitle}

Processed by pilot write pass 1.

- Source: ${report.sourceFileUsed}
- Start boundary: line ${report.startBoundaryUsed.line} (${report.startBoundaryUsed.reason})
- End boundary: line ${report.endBoundaryUsed.line} (${report.endBoundaryUsed.reason})
- Sections: ${report.sectionCount}
- Recommendation: ${report.finalRecommendation}

This output is intentionally review-gated before larger batch processing or Cloudflare export.
`;
}

function statusPath(filePath: string) {
  return path.relative(repoRoot, filePath).replace(/\\/g, "/");
}

function processPilotBook(dryRun: DryRunBook): {
  report: WrittenBookReport;
  manifest: GeneratedBookManifest | null;
  previewEntry: Parameters<typeof updatePreviewManifest>[0][number] | null;
} {
  ensureApprovedSlug(dryRun.slug);
  const boundary = boundaryOverrides[dryRun.slug];
  const sourcePath = safeSourcePath(dryRun.sourcePath);
  const rawText = fs.readFileSync(sourcePath, "utf8");
  const { lines, bodyText, frontMatterText, endMatterText } = extractBodyByLines(
    rawText,
    boundary,
  );
  const metadata = makeMetadata(dryRun, rawText, boundary);
  const cleaned = cleanPilotBody(bodyText);
  const cleanedText = cleaned.text;

  const remainingWarnings: string[] = [];
  if (/Project Gutenberg|Gutenberg License/i.test(cleanedText)) {
    remainingWarnings.push("Gutenberg/source text remains inside candidate body.");
  }
  if (countBookWords(cleanedText) < 100) {
    remainingWarnings.push("Candidate body is suspiciously short.");
  }

  const detected = detectBookSections(cleanedText, metadata);
  const sections = mergeTinyTerminalFallbackPart(
    enrichSections(detected.sections).filter((section) => section.wordCount > 0),
  );
  if (sections.length === 0) {
    remainingWarnings.push("No sections were produced.");
  }
  if (detected.warnings.length > 0) {
    remainingWarnings.push(...detected.warnings);
  }

  const sectionCount = sections.length;
  const firstFive = sections.slice(0, 5).map((section) => ({
    id: section.id,
    label: section.label,
    title: section.title,
    wordCount: section.wordCount,
  }));
  const lastFive = sections.slice(-5).map((section) => ({
    id: section.id,
    label: section.label,
    title: section.title,
    wordCount: section.wordCount,
  }));
  const suspiciouslyShort = sections
    .filter((section) => section.wordCount < 25)
    .map((section) => ({
      id: section.id,
      label: section.label,
      title: section.title,
      wordCount: section.wordCount,
    }));
  const suspiciouslyLong = sections
    .filter((section) => section.wordCount > 12_000)
    .map((section) => ({
      id: section.id,
      label: section.label,
      title: section.title,
      wordCount: section.wordCount,
    }));

  const startSnippet = snippetFromLine(lines, boundary.startLine);
  const endSnippet = snippetFromLine(lines, boundary.endLine);
  const reportBase: WrittenBookReport = {
    slug: dryRun.slug,
    status: remainingWarnings.some((warning) =>
      /Gutenberg\/source text remains|No sections|suspiciously short/.test(warning),
    )
      ? "skipped"
      : "written",
    reasonIfSkipped: null,
    sourceFileUsed: statusPath(sourcePath),
    generatedOutputFilesChanged: [],
    previewAssetFileChanged: null,
    candidateTitle: dryRun.candidateTitle,
    candidateAuthor: metadata.author,
    pass2RiskLevel: dryRun.pass2RiskLevel,
    startBoundaryUsed: {
      line: boundary.startLine,
      reason: boundary.startReason,
      snippet: startSnippet,
      linesBefore: lineContext(lines, boundary.startLine, 12, 0),
    },
    endBoundaryUsed: {
      line: boundary.endLine,
      reason: boundary.endReason,
      snippet: endSnippet,
      linesAfter: lineContext(lines, boundary.endLine, 0, 12),
    },
    removedFrontMatterSummary: {
      wordCountEstimate: countBookWords(frontMatterText),
      lineRange:
        boundary.startLine > 1 ? `1-${boundary.startLine - 1}` : "none",
    },
    removedEndMatterSummary: {
      wordCountEstimate: countBookWords(endMatterText),
      lineRange:
        boundary.endLine < lines.length ? `${boundary.endLine + 1}-${lines.length}` : "none",
    },
    sectionCount,
    firstFiveSections: firstFive,
    lastFiveSections: lastFive,
    suspiciouslyShortSections: suspiciouslyShort,
    suspiciouslyLongSections: suspiciouslyLong,
    cleanupActionsApplied: cleaned.summary,
    remainingWarnings,
    firstHourPreviewSourceSections: [],
    comparisonAgainstPriorGeneratedOutput: dryRun.existingGeneratedOutputExists
      ? dryRun.comparisonAgainstExistingGeneratedOutput ||
        "Existing generated output was present; this pass rewrote only the approved slug."
      : "No existing generated output was present.",
    finalRecommendation:
      dryRun.pass2RiskLevel === "low"
        ? "accepted for review"
        : "needs manual review before scaling",
  };

  if (reportBase.status === "skipped") {
    return {
      report: {
        ...reportBase,
        reasonIfSkipped: remainingWarnings.join(" "),
        finalRecommendation: "skipped",
      },
      manifest: null,
      previewEntry: null,
    };
  }

  const contentHash = buildContentHash(metadata, cleanedText, sections);
  const manifest = buildManifest(
    metadata,
    rawText,
    cleanedText,
    sections,
    contentHash,
    detected.warnings,
    cleaned.summary,
  );
  const sectionJson = sections.map((section) => makeSectionJson(dryRun.slug, section));
  const cleanedBook = buildCleanedBook(metadata, manifest, sections);
  const processedBook = buildProcessedBook(metadata, manifest, sections);
  const rightsReport = buildRightsReport(metadata, rawText);

  const preview = makePreviewAsset(manifest, sections);
  const previewPath = path.join(previewRoot, `${dryRun.slug}.preview.json`);
  assertInside(previewRoot, previewPath);

  const finalReport: WrittenBookReport = {
    ...reportBase,
    generatedOutputFilesChanged: [],
    previewAssetFileChanged: statusPath(previewPath),
    firstHourPreviewSourceSections: preview.sourceSections,
    comparisonAgainstPriorGeneratedOutput:
      dryRun.slug === "dracula"
        ? "Prior Dracula output included title-page/contents material and mojibake in readable sections; pilot write 1 regenerates from UTF-8 source, starts at CHAPTER I, excludes the publisher catalog, and keeps the final note outside default playback."
        : reportBase.comparisonAgainstPriorGeneratedOutput,
  };

  const changedGenerated = writeGeneratedOutput(
    manifest,
    sectionJson,
    cleanedBook,
    processedBook,
    rightsReport,
    makeProcessingNotes(finalReport),
  );
  writeJson(previewPath, preview.asset);

  return {
    report: {
      ...finalReport,
      generatedOutputFilesChanged: changedGenerated.map(statusPath),
    },
    manifest,
    previewEntry: {
      slug: manifest.slug,
      contentVersion: manifest.contentVersion,
      contentHash: manifest.contentHash,
      defaultSectionId: preview.asset.defaultSectionId,
      previewBytes: Buffer.byteLength(JSON.stringify(preview.asset), "utf8"),
      previewCharacterCount: preview.asset.characterCount,
      estimatedRuntimeSeconds: preview.asset.estimatedRuntimeSeconds,
      truncated: preview.asset.truncated,
    },
  };
}

function writeReport(results: WrittenBookReport[]) {
  const written = results.filter((result) => result.status === "written");
  const skipped = results.filter((result) => result.status === "skipped");
  const jsonReport = {
    schemaVersion: 1,
    reportName: "pilot-write-1",
    generatedAt: new Date().toISOString(),
    inputReports: {
      pass1: statusPath(pass1ReportPath),
      pass2: statusPath(pass2ReportPath),
      pilotDryRun1: statusPath(dryRunReportPath),
    },
    paths: {
      tempBooksRoot: statusPath(tempBooksRoot),
      generatedRoot: statusPath(generatedRoot),
      cloudflareRoot: statusPath(cloudflareRoot),
      previewRoot: statusPath(previewRoot),
    },
    approvedPilotSlugs,
    individualReviewSlugs: Array.from(individualReviewSlugs),
    totals: {
      considered: results.length,
      written: written.length,
      skipped: skipped.length,
    },
    books: results,
    confirmations: {
      tempBooksModified: false,
      cloudflareExportModified: false,
      processedOnlyApprovedPilotBooks: true,
      allBookBuildRun: false,
    },
  };

  const table = results
    .map(
      (result) =>
        `| ${result.slug} | ${result.status} | ${result.pass2RiskLevel} | ${result.sectionCount} | ${result.finalRecommendation} |`,
    )
    .join("\n");
  const safe = written
    .filter((result) => result.pass2RiskLevel === "low")
    .map((result) => `- ${result.slug}`)
    .join("\n");
  const warnings = written
    .filter((result) => result.pass2RiskLevel !== "low")
    .map((result) => `- ${result.slug}: ${result.remainingWarnings.join("; ") || "review before scaling"}`)
    .join("\n");
  const damaged = results
    .filter((result) => /Prior Dracula output/.test(result.comparisonAgainstPriorGeneratedOutput))
    .map((result) => `- ${result.slug}: ${result.comparisonAgainstPriorGeneratedOutput}`)
    .join("\n");

  const markdown = `# Pilot Write 1 Report

Controlled real pilot write pass for the approved seven-book subset from pilot dry-run 1.

## Summary

| Book | Status | Pass-2 risk | Sections | Recommendation |
| --- | --- | --- | ---: | --- |
${table}

## Written Books

${written.map((result) => `- ${result.slug}`).join("\n") || "- None"}

## Skipped Books

${skipped.map((result) => `- ${result.slug}: ${result.reasonIfSkipped}`).join("\n") || "- None"}

## Safe For Review

${safe || "- None"}

## Needs Warnings Before Scaling

${warnings || "- None"}

## Boundary Decisions

${results
  .map(
    (result) =>
      `- ${result.slug}: start line ${result.startBoundaryUsed.line} (${result.startBoundaryUsed.reason}); end line ${result.endBoundaryUsed.line} (${result.endBoundaryUsed.reason}).`,
  )
  .join("\n")}

## Cleanup Applied

${results
  .map(
    (result) =>
      `- ${result.slug}: removed ${result.cleanupActionsApplied.imagePlaceholderLinesRemoved} image placeholder lines, ${result.cleanupActionsApplied.numberedReferencesRemoved} numbered references, ${result.cleanupActionsApplied.decorativeLinesRemoved} decorative lines, ${result.cleanupActionsApplied.standaloneFinisLinesRemoved} standalone FINIS markers; Unicode normalized: ${result.cleanupActionsApplied.unicodeNormalized}; dashes normalized: ${result.cleanupActionsApplied.dashesNormalized}.`,
  )
  .join("\n")}

## Existing Generated Output Damage

${damaged || "- No prior generated-output damage was found among the newly written books except the known Dracula issue, which was addressed when Dracula was regenerated."}

## Preview Assets

${written
  .map(
    (result) =>
      `- ${result.slug}: ${result.previewAssetFileChanged}; preview sections ${result.firstHourPreviewSourceSections.join(", ")}.`,
  )
  .join("\n")}

## Confirmations

- app/client/assets/temp-books was read only and not modified.
- app/client/assets/books/cloudflare-export was not modified.
- app/client/assets/books/generated was modified only for the written approved pilot books and the generated library manifest.
- public/book-previews was modified only for the written approved pilot books and the preview manifest.
- The individual-review books were not processed.
- npm run books:build was not run.

## Recommended Next Step

Review the seven generated book pages, section lists, and preview assets. If accepted, proceed to a small reviewed batch of five books using the same guarded writer pattern before any Cloudflare export.
`;

  writeJson(path.join(reportRoot, "pilot-write-1.json"), jsonReport);
  writeText(path.join(reportRoot, "pilot-write-1.md"), markdown);
}

function main() {
  const dryRun = readJson<{ books: DryRunBook[] }>(dryRunReportPath);
  if (!fs.existsSync(pass1ReportPath) || !fs.existsSync(pass2ReportPath)) {
    throw new Error("Missing pass-1 or pass-2 audit input report.");
  }
  const dryRunBySlug = new Map(dryRun.books.map((book) => [book.slug, book]));
  const results: WrittenBookReport[] = [];
  const manifests: GeneratedBookManifest[] = [];
  const previewEntries: NonNullable<
    ReturnType<typeof processPilotBook>["previewEntry"]
  >[] = [];

  for (const slug of approvedPilotSlugs) {
    const dryRunBook = dryRunBySlug.get(slug);
    if (!dryRunBook) throw new Error(`Dry-run report missing ${slug}.`);
    const perBookMarkdownPath = path.join(
      repoRoot,
      "app",
      "client",
      "assets",
      "books",
      "audit-reports",
      "pilot-dry-run-1",
      "books",
      `${slug}.md`,
    );
    if (!fs.existsSync(perBookMarkdownPath)) {
      throw new Error(`Missing per-book dry-run markdown for ${slug}.`);
    }

    const result = processPilotBook(dryRunBook);
    results.push(result.report);
    if (result.manifest) manifests.push(result.manifest);
    if (result.previewEntry) previewEntries.push(result.previewEntry);
  }

  if (manifests.length > 0) updateLibraryManifest(manifests);
  if (previewEntries.length > 0) updatePreviewManifest(previewEntries);
  writeReport(results);

  console.log(
    `Pilot write 1 completed: ${results.filter((result) => result.status === "written").length} written, ${results.filter((result) => result.status === "skipped").length} skipped.`,
  );
  for (const result of results) {
    console.log(
      `${result.status.toUpperCase()} ${result.slug}: ${result.sectionCount} sections, ${result.finalRecommendation}`,
    );
  }
}

main();
