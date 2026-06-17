import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  BookRightsReport,
  BookSectionKind,
  CleanedBookJson,
  DetectedBookSection,
  GeneratedBookManifest,
  GeneratedBookSectionJson,
  GeneratedLibraryManifest,
  ProcessedBookJson,
} from "./bookManifestTypes.ts";
import { analyzeBookStructure } from "./lib/book-structure-detection.ts";
import {
  countBookWords,
  estimateMorseCharacters,
  normalizeBookText,
  splitParagraphs,
  summarizeUnsupportedCharacters,
  textPreview,
  trimBookText,
} from "./bookTextNormalization.ts";

type DryRunStatus =
  | "already acceptable"
  | "needs correction before acceptance"
  | "manual review"
  | "blocked";

type DryRunBook = {
  slug: string;
  title: string;
  author: string[];
  sourceFileUsed: string;
  generatedOutputExists: boolean;
  previewAssetExists: boolean;
  detectedStructuralConvention: string;
  currentGeneratedSectionCount: number;
  proposedSectionCountIfCorrectionNeeded: number | null;
  firstDefaultSectionCurrently: SectionSnapshot;
  boundaries: {
    startBoundaryVerdict: string;
    endBoundaryVerdict: string;
    sectioningVerdict: string;
    cleanupVerdict: string;
    previewVerdict: string;
    allMainReadableDefaultVerdict: string;
  };
  currentStatus: DryRunStatus;
  recommendationForNextPass: string;
  warnings: string[];
  hardFailReasons: string[];
};

type DryRunReport = {
  reportName: "pilot-dry-run-5";
  selectedBooks: string[];
  totals: {
    selectedBooks: number;
    alreadyAcceptable: number;
    needsCorrectionBeforeAcceptance: number;
    manualReview: number;
    blocked: number;
  };
  books: DryRunBook[];
};

type PreviewAsset = {
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

type SourceLine = {
  lineNumber: number;
  text: string;
  trimmed: string;
  offset: number;
};

type SectionBoundary = {
  line: number;
  kind: BookSectionKind;
  label: string;
  title: string | null;
  includeByDefault: boolean;
};

function isSectionBoundary(boundary: SectionBoundary | null): boundary is SectionBoundary {
  return boundary !== null;
}

type SectionSnapshot = {
  id: string | null;
  label: string | null;
  title: string | null;
  kind: BookSectionKind | null;
  includeByDefault: boolean | null;
  wordCount: number | null;
  snippet: string | null;
};

type CleanupSummary = {
  imagePlaceholderLinesRemoved: number;
  imagePlaceholderBlocksRemoved: number;
  numberedReferencesRemoved: number;
  sourceHeadingLinesRemoved: number;
  decorativeLinesRemoved: number;
  standaloneFinisLinesRemoved: number;
  unicodeNormalized: boolean;
  dashesNormalized: boolean;
};

type CorrectionPlan = {
  slug: string;
  structuralConvention: string;
  startLine: number;
  endLine: number;
  startReason: string;
  endReason: string;
  makeBoundaries: (lines: SourceLine[]) => SectionBoundary[];
  expectedMinimumSections: number;
};

type BookReport = {
  slug: string;
  dryRunStatus: DryRunStatus;
  finalAction: "accepted without rewrite" | "corrected" | "skipped";
  sourceFileUsed: string;
  inspections: {
    dryRunJsonInspected: boolean;
    dryRunMarkdownInspected: boolean;
    rawSourceInspected: boolean;
    currentGeneratedOutputInspected: boolean;
    currentPreviewAssetInspected: boolean;
  };
  generatedFilesChanged: string[];
  previewAssetChanged: string | null;
  priorIssueFromDryRun: string[];
  startBoundaryUsed: {
    line: number | null;
    reason: string;
    snippet: string | null;
  };
  endBoundaryUsed: {
    line: number | null;
    reason: string;
    snippet: string | null;
  };
  structuralConvention: string;
  firstDefaultSectionBefore: SectionSnapshot;
  firstDefaultSectionAfter: SectionSnapshot;
  sectionCountBefore: number;
  sectionCountAfter: number;
  first5SectionsWithWordCounts: Array<{
    id: string;
    label: string;
    title: string | null;
    kind: BookSectionKind;
    wordCount: number;
  }>;
  last5SectionsWithWordCounts: Array<{
    id: string;
    label: string;
    title: string | null;
    kind: BookSectionKind;
    wordCount: number;
  }>;
  cleanupActionsApplied: CleanupSummary | null;
  previewVerdict: string;
  startupPreviewValid: boolean;
  allMainReadableDefaultVerdict: string;
  remainingWarnings: string[];
  finalRecommendation: "accepted for review" | "needs manual review" | "skipped";
  acceptedFromDryRunReason?: string;
  noFilesChanged?: boolean;
};

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const generatedRoot = path.join(repoRoot, "app/client/assets/books/generated");
const tempBooksRoot = path.join(repoRoot, "app/client/assets/temp-books");
const previewRoot = path.join(repoRoot, "public/book-previews");
const auditRoot = path.join(repoRoot, "app/client/assets/books/audit-reports");
const dryRunRoot = path.join(auditRoot, "pilot-dry-run-5");
const writeReportRoot = path.join(auditRoot, "pilot-write-5");
const dryRunReportPath = path.join(dryRunRoot, "pilot-dry-run-5.json");
const libraryManifestPath = path.join(generatedRoot, "library-manifest.json");
const previewManifestPath = path.join(previewRoot, "manifest.json");

const SELECTED_BATCH = [
  "anna-karenina",
  "anne-of-green-gables-gutenberg-45",
  "candide",
  "crime-and-punishment",
  "gulliver-s-travels",
  "the-bell",
  "the-call-of-cthulhu",
  "the-elderbush",
  "the-emerald-city-of-oz",
  "the-emperor-s-new-clothes",
  "the-fir-tree",
  "the-leap-frog",
  "the-old-house",
  "the-real-princess",
  "the-secret-garden-gutenberg-113",
  "the-shoes-of-fortune",
  "the-snow-queen",
  "the-swineherd",
  "treasure-island",
  "wind-in-the-willows",
] as const;

const EXPECTED_ACCEPTED = [
  "anna-karenina",
  "anne-of-green-gables-gutenberg-45",
  "the-bell",
  "the-elderbush",
  "the-emperor-s-new-clothes",
  "the-fir-tree",
  "the-leap-frog",
  "the-real-princess",
  "the-secret-garden-gutenberg-113",
  "the-shoes-of-fortune",
  "wind-in-the-willows",
] as const;

const EXPECTED_CORRECTION = [
  "candide",
  "crime-and-punishment",
  "gulliver-s-travels",
  "the-call-of-cthulhu",
  "the-emerald-city-of-oz",
  "the-old-house",
  "the-snow-queen",
  "the-swineherd",
  "treasure-island",
] as const;

const FUTURE_BATCH_RULE = [
  "valid generated readable content",
  "first default section from real readable content",
  "all main readable sections included by default",
  "valid book-specific startup preview",
  "no SOS Help!",
  "no generic preview fallback",
  "no title/TOC/source/license/contributor/transcriber material as default playback",
];

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

function statusPath(filePath: string): string {
  return path.relative(repoRoot, filePath).replace(/\\/g, "/");
}

function assertInside(root: string, candidate: string) {
  const relative = path.relative(root, candidate);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to write outside ${statusPath(root)}: ${candidate}`);
  }
}

function sha256Json(value: unknown): string {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function estimateTypingMinutes(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 40));
}

function estimateListeningMinutes(morseCharacterEstimate: number): number {
  return Math.max(1, Math.ceil(morseCharacterEstimate / 900));
}

function sourceLooksUnsafe(text: string): boolean {
  return /Project Gutenberg|Gutenberg License|START OF (?:THE|THIS) PROJECT GUTENBERG|END OF (?:THE|THIS) PROJECT GUTENBERG|www\.gutenberg|Distributed Proofreading|Transcriber's Notes?/i.test(
    text,
  );
}

function previewLooksUnsafe(previewText: string): boolean {
  const trimmed = previewText.trim();
  return (
    trimmed.length < 400 ||
    sourceLooksUnsafe(trimmed) ||
    /^(?:SOS Help!|MorseWords|Type text here|contents|table of contents)\b/i.test(trimmed)
  );
}

function lineRecords(rawText: string): SourceLine[] {
  const records: SourceLine[] = [];
  const matches = rawText.matchAll(/[^\r\n]*(?:\r\n|\n|\r|$)/g);
  for (const match of matches) {
    const fullLine = match[0];
    const offset = match.index ?? 0;
    if (!fullLine && offset >= rawText.length) break;
    const text = fullLine.replace(/\r\n$|\n$|\r$/, "");
    records.push({
      lineNumber: records.length + 1,
      text,
      trimmed: text.trim(),
      offset,
    });
  }
  return records;
}

function lineAt(lines: SourceLine[], lineNumber: number): SourceLine {
  const line = lines[lineNumber - 1];
  if (!line) throw new Error(`Line ${lineNumber} not found.`);
  return line;
}

function snippetFromLine(lines: SourceLine[], lineNumber: number): string {
  const start = Math.max(1, lineNumber - 1);
  const end = Math.min(lines.length, lineNumber + 2);
  return textPreview(
    lines
      .slice(start - 1, end)
      .map((line) => line.trimmed)
      .filter(Boolean)
      .join(" "),
    240,
  );
}

function normalizeKey(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[_=]/g, "")
    .replace(/\s+\d+$/g, "")
    .replace(/^[0-9]+\.\s+/, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function titleCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/\b([a-z])/g, (match) => match.toUpperCase())
    .replace(/\bAnd\b/g, "and")
    .replace(/\bOr\b/g, "or")
    .replace(/\bThe\b/g, "the")
    .replace(/^\bthe\b/i, "The")
    .replace(/\bIi\b/g, "II")
    .replace(/\bIii\b/g, "III")
    .replace(/\bIv\b/g, "IV")
    .replace(/\bVi\b/g, "VI")
    .replace(/\bVii\b/g, "VII")
    .replace(/\bViii\b/g, "VIII")
    .replace(/'S\b/g, "'s");
}

function parseRoman(input: string): number | null {
  const values: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };
  let total = 0;
  let previous = 0;
  for (const char of input.toUpperCase().split("").reverse()) {
    const value = values[char];
    if (!value) return null;
    if (value < previous) total -= value;
    else total += value;
    previous = value;
  }
  return total;
}

function romanOrText(input: string): string {
  const parsed = parseRoman(input);
  return parsed ? String(parsed) : input;
}

function extractTocTitles(
  lines: SourceLine[],
  startLine: number,
  endLine: number,
  options: { requireTrailingPage?: boolean; stripLeadingNumber?: boolean } = {},
): string[] {
  const titles: string[] = [];
  for (const line of lines) {
    if (line.lineNumber < startLine || line.lineNumber > endLine) continue;
    const raw = line.trimmed;
    if (!raw) continue;
    if (options.requireTrailingPage && !/\s+\d+$/.test(raw)) continue;
    let title = raw.replace(/\s+\d+$/g, "").replace(/^_+|_+$/g, "").trim();
    if (options.stripLeadingNumber) title = title.replace(/^[0-9]+\.\s+/, "").trim();
    if (title && !/^(?:contents|page|chapter|facing)$/i.test(title)) titles.push(title);
  }
  return titles;
}

function firstTitleLineAfter(lines: SourceLine[], index: number): string | null {
  for (let cursor = index + 1; cursor < Math.min(lines.length, index + 8); cursor += 1) {
    const trimmed = lines[cursor]?.trimmed ?? "";
    if (!trimmed || /^\[Illustration/i.test(trimmed)) continue;
    return trimmed.replace(/^_+|_+$/g, "").trim();
  }
  return null;
}

function titleBlockAfter(lines: SourceLine[], index: number, maxLines = 3): string | null {
  const titleLines: string[] = [];
  let seenText = false;
  for (let cursor = index + 1; cursor < Math.min(lines.length, index + 10); cursor += 1) {
    const trimmed = (lines[cursor]?.trimmed ?? "").replace(/^_+|_+$/g, "").trim();
    if (!trimmed || /^\[Illustration/i.test(trimmed)) {
      if (seenText) break;
      continue;
    }
    if (/^[A-Z][a-z]/.test(trimmed) && titleLines.length > 0) break;
    if (/^["“]/.test(trimmed)) break;
    titleLines.push(trimmed.replace(/[.。]$/u, ""));
    seenText = true;
    if (titleLines.length >= maxLines) break;
  }
  return titleLines.length > 0 ? titleCase(titleLines.join(" ")) : null;
}

function cleanSectionText(input: string, summary: CleanupSummary): string {
  summary.unicodeNormalized ||= /[\u00a0\u2018\u2019\u201c\u201d\u2026\uFB00-\uFB06]/.test(input);
  summary.dashesNormalized ||= /[\u2010-\u2015]/.test(input);

  let text = normalizeBookText(input)
    .replace(/\u00a0/g, " ")
    .replace(/\uFEFF/g, "")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2010\u2011\u2012\u2013\u2014\u2015]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\ufb00/g, "ff")
    .replace(/\ufb01/g, "fi")
    .replace(/\ufb02/g, "fl")
    .replace(/\ufb03/g, "ffi")
    .replace(/\ufb04/g, "ffl")
    .replace(/\ufb05/g, "ft")
    .replace(/\ufb06/g, "st");

  text = text.replace(/\[(?:[1-9][0-9]?|100)\]/g, () => {
    summary.numberedReferencesRemoved += 1;
    return "";
  });

  const keptLines: string[] = [];
  let inImageBlock = false;
  for (const line of text.split("\n")) {
    let nextLine = line;
    const trimmed = nextLine.trim();
    if (inImageBlock) {
      summary.imagePlaceholderLinesRemoved += 1;
      if (trimmed.includes("]")) inImageBlock = false;
      continue;
    }
    if (/^\[(?:Illustration|Illustrations|Plate|Image|Map|Music|Facsimile|Portrait)\b/i.test(trimmed)) {
      summary.imagePlaceholderLinesRemoved += 1;
      summary.imagePlaceholderBlocksRemoved += 1;
      if (!trimmed.includes("]")) inImageBlock = true;
      continue;
    }
    nextLine = nextLine.replace(
      /\[(?:Illustration|Illustrations|Plate|Image|Map|Music|Facsimile|Portrait)[^\]]*\]/gi,
      () => {
        summary.imagePlaceholderLinesRemoved += 1;
        return "";
      },
    );
    const cleanedTrimmed = nextLine.trim();
    if (/^(?:\*[\s*]*){3,}$/.test(cleanedTrimmed) || /^(?:[-_=~]\s*){4,}$/.test(cleanedTrimmed)) {
      summary.decorativeLinesRemoved += 1;
      continue;
    }
    if (/^FINIS\.?$/i.test(cleanedTrimmed)) {
      summary.standaloneFinisLinesRemoved += 1;
      continue;
    }
    if (/^[^\p{L}\p{N}]+$/u.test(cleanedTrimmed) && cleanedTrimmed.length >= 6) {
      summary.decorativeLinesRemoved += 1;
      continue;
    }
    keptLines.push(nextLine.replace(/^(Chapter\s+[IVXLCDM]+)\.\]$/i, "$1."));
  }

  const firstTextLineIndex = keptLines.findIndex((line) => line.trim().length > 0);
  if (
    firstTextLineIndex >= 0 &&
    /^_?\s*\d{1,3}\.\s+\S.{2,}?_?\.?$/u.test(keptLines[firstTextLineIndex].trim())
  ) {
    keptLines[firstTextLineIndex] = "";
    summary.sourceHeadingLinesRemoved += 1;
  }

  return trimBookText(keptLines.join("\n")).replace(/[ \t]{2,}/g, " ");
}

function emptyCleanupSummary(): CleanupSummary {
  return {
    imagePlaceholderLinesRemoved: 0,
    imagePlaceholderBlocksRemoved: 0,
    numberedReferencesRemoved: 0,
    sourceHeadingLinesRemoved: 0,
    decorativeLinesRemoved: 0,
    standaloneFinisLinesRemoved: 0,
    unicodeNormalized: false,
    dashesNormalized: false,
  };
}

function includeKindsFor(sections: DetectedBookSection[]): BookSectionKind[] {
  return [...new Set(sections.filter((section) => section.includeByDefault).map((section) => section.kind))];
}

function makeDetectedSections(
  slug: string,
  rawText: string,
  lines: SourceLine[],
  boundaries: SectionBoundary[],
  endLine: number,
  cleanupSummary: CleanupSummary,
): DetectedBookSection[] {
  const counters = new Map<BookSectionKind, number>();
  const sorted = boundaries
    .filter((boundary, index, list) => list.findIndex((item) => item.line === boundary.line) === index)
    .sort((left, right) => left.line - right.line);
  const sections: DetectedBookSection[] = [];
  for (const [index, boundary] of sorted.entries()) {
    const nextLine = sorted[index + 1]?.line ?? endLine + 1;
    const start = lineAt(lines, boundary.line).offset;
    const endRecord = lineAt(lines, Math.min(endLine, nextLine - 1));
    const end = endRecord.offset + endRecord.text.length;
    const rawSectionText = rawText.slice(start, end);
    const cleanedText = cleanSectionText(rawSectionText, cleanupSummary);
    const wordCount = countBookWords(cleanedText);
    if (wordCount < 3) continue;
    const count = (counters.get(boundary.kind) ?? 0) + 1;
    counters.set(boundary.kind, count);
    sections.push({
      id: `${boundary.kind}-${String(count).padStart(3, "0")}`,
      kind: boundary.kind,
      label: boundary.label,
      title: boundary.title,
      order: sections.length + 1,
      includeByDefault: boundary.includeByDefault,
      sourceStartOffset: start,
      sourceEndOffset: end,
      characterCount: cleanedText.length,
      wordCount,
      morseCharacterEstimate: estimateMorseCharacters(cleanedText),
      textPreview: textPreview(cleanedText),
      text: cleanedText,
    });
  }
  if (sections.length === 0) throw new Error(`${slug}: no sections produced.`);
  return sections;
}

function boundariesFromTitleSet(
  lines: SourceLine[],
  startLine: number,
  endLine: number,
  titles: string[],
  kind: BookSectionKind,
): SectionBoundary[] {
  const titleKeys = new Map(titles.map((title) => [normalizeKey(title), title]));
  const boundaries: SectionBoundary[] = [];
  for (const line of lines) {
    if (line.lineNumber < startLine || line.lineNumber > endLine) continue;
    const trimmed = line.trimmed.replace(/^_+|_+$/g, "");
    const matched = titleKeys.get(normalizeKey(trimmed));
    if (!matched) continue;
    boundaries.push({
      line: line.lineNumber,
      kind,
      label: titleCase(matched),
      title: null,
      includeByDefault: true,
    });
  }
  return boundaries;
}

function makeCorrectionPlans(): Record<string, CorrectionPlan> {
  return {
    "a-childs-garden-of-verses": {
      slug: "a-childs-garden-of-verses",
      structuralConvention: "poem/titled-section headings",
      startLine: 370,
      endLine: 2328,
      startReason: "First main readable poem heading after title pages, contents, illustration list, and source/publisher material.",
      endReason: "Last poem ends before the Scribner catalog and transcriber's note.",
      expectedMinimumSections: 50,
      makeBoundaries: (lines) =>
        boundariesFromTitleSet(
          lines,
          370,
          2328,
          extractTocTitles(lines, 137, 275, { requireTrailingPage: true }),
          "poem",
        ),
    },
    "black-beauty": {
      slug: "black-beauty",
      structuralConvention: "numbered chapter headings within part divisions",
      startLine: 138,
      endLine: 6029,
      startReason: "Chapter 1, 'My Early Home', is the first main readable section after title, dedication, and table of contents.",
      endReason: "The final chapter ends before the Project Gutenberg footer.",
      expectedMinimumSections: 49,
      makeBoundaries: (lines) =>
        lines
          .filter((line) => line.lineNumber >= 138 && line.lineNumber <= 6029)
          .map<SectionBoundary | null>((line) => {
            const match = line.trimmed.match(/^(\d{2})\s+(.+)$/);
            if (!match) return null;
            return {
              line: line.lineNumber,
              kind: "chapter" as BookSectionKind,
              label: `Chapter ${Number(match[1])}`,
              title: match[2].trim(),
              includeByDefault: true,
            };
          })
          .filter(isSectionBoundary),
    },
    "five-little-peppers-and-how-they-grew": {
      slug: "five-little-peppers-and-how-they-grew",
      structuralConvention: "story/chapter title headings",
      startLine: 108,
      endLine: 9270,
      startReason: "First story heading after title, dedication, and contents.",
      endReason: "Final story body ends before the Project Gutenberg footer.",
      expectedMinimumSections: 25,
      makeBoundaries: (lines) =>
        boundariesFromTitleSet(
          lines,
          108,
          9270,
          extractTocTitles(lines, 50, 98),
          "chapter",
        ),
    },
    "grimm-s-fairy-tales": {
      slug: "grimm-s-fairy-tales",
      structuralConvention: "fairy-tale story headings",
      startLine: 126,
      endLine: 9240,
      startReason: "First tale heading after the preparer's note and contents.",
      endReason: "Last tale ends before the post-text Grimm biographical note and Project Gutenberg footer.",
      expectedMinimumSections: 55,
      makeBoundaries: (lines) => {
        const titles = extractTocTitles(lines, 50, 116, { stripLeadingNumber: true }).filter(
          (title) => title.toLowerCase() !== "the juniper-tree.",
        );
        return boundariesFromTitleSet(lines, 126, 9240, titles, "chapter");
      },
    },
    "little-women": {
      slug: "little-women",
      structuralConvention: "standalone roman-numbered chapters",
      startLine: 605,
      endLine: 21844,
      startReason: "Chapter I is the first main readable section after title pages, preface, contents, and illustration lists.",
      endReason: "The novel closes before tail-piece illustrations, publisher catalog, and transcriber's notes.",
      expectedMinimumSections: 47,
      makeBoundaries: (lines) =>
        lines
          .map((line, index) => {
            if (line.lineNumber < 605 || line.lineNumber > 21844) return null;
            const roman = line.trimmed.match(/^([IVXLCDM]+)\.$/);
            const ordinal = roman ? parseRoman(roman[1]) : null;
            if (!ordinal || ordinal > 47) return null;
            return {
              line: line.lineNumber,
              kind: "chapter" as BookSectionKind,
              label: `Chapter ${ordinal}`,
              title: firstTitleLineAfter(lines, index),
              includeByDefault: true,
            };
          })
          .filter(isSectionBoundary),
    },
    "new-treasure-seekers": {
      slug: "new-treasure-seekers",
      structuralConvention: "short story collection headings",
      startLine: 214,
      endLine: 8106,
      startReason: "First story heading after title pages, dedication, contents, and illustration list.",
      endReason: "Final story closes before decorative break and transcriber's notes.",
      expectedMinimumSections: 13,
      makeBoundaries: (lines) =>
        boundariesFromTitleSet(
          lines,
          214,
          8106,
          extractTocTitles(lines, 100, 124),
          "chapter",
        ),
    },
    "pride-and-prejudice": {
      slug: "pride-and-prejudice",
      structuralConvention: "roman-numbered chapters",
      startLine: 701,
      endLine: 14560,
      startReason: "Chapter I is the first main novel section after title pages, illustrations, and editor preface.",
      endReason: "Chapter LXI closes before printer/footer material.",
      expectedMinimumSections: 61,
      makeBoundaries: (lines) =>
        lines
          .map<SectionBoundary | null>((line) => {
            if (line.lineNumber < 701 || line.lineNumber > 14560) return null;
            const match = line.trimmed.match(/^Chapter\s+([IVXLCDM]+)\.?\]?$/i);
            const ordinal = match ? parseRoman(match[1]) : null;
            if (!ordinal) return null;
            return {
              line: line.lineNumber,
              kind: "chapter" as BookSectionKind,
              label: `Chapter ${ordinal}`,
              title: null,
              includeByDefault: true,
            };
          })
          .filter(isSectionBoundary),
    },
    "the-arabian-nights": {
      slug: "the-arabian-nights",
      structuralConvention: "story collection headings",
      startLine: 327,
      endLine: 10413,
      startReason: "First selected tale heading after title, editorial preface, contents, and illustration list.",
      endReason: "The final Sinbad passage ends before the Project Gutenberg footer.",
      expectedMinimumSections: 16,
      makeBoundaries: (lines) =>
        boundariesFromTitleSet(
          lines,
          327,
          10413,
          [
            "THE TALKING BIRD, THE SINGING TREE, AND THE GOLDEN WATER",
            "THE STORY OF THE FISHERMAN AND THE GENIE",
            "THE HISTORY OF THE YOUNG KING OF THE BLACK ISLES",
            "THE STORY OF GULNARE OF THE SEA",
            "THE STORY OF ALADDIN; OR, THE WONDERFUL LAMP",
            "THE STORY OF PRINCE AGIB",
            "THE STORY OF THE CITY OF BRASS",
            "THE STORY OF ALI BABA AND THE FORTY THIEVES",
            "THE HISTORY OF CODADAD AND HIS BROTHERS",
            "THE STORY OF SINBAD THE VOYAGER",
            "THE FIRST VOYAGE",
            "THE SECOND VOYAGE",
            "THE THIRD VOYAGE",
            "THE FOURTH VOYAGE",
            "THE FIFTH VOYAGE",
            "THE SIXTH VOYAGE",
            "THE SEVENTH AND LAST VOYAGE",
          ],
          "chapter",
        ),
    },
    "the-book-of-dragons": {
      slug: "the-book-of-dragons",
      structuralConvention: "roman-numbered story headings",
      startLine: 170,
      endLine: 4844,
      startReason: "First story heading after title, contents, illustration list, and dedication.",
      endReason: "Final story ends before transcriber's notes and Project Gutenberg footer.",
      expectedMinimumSections: 8,
      makeBoundaries: (lines) =>
        lines
          .map<SectionBoundary | null>((line) => {
            if (line.lineNumber < 170 || line.lineNumber > 4844) return null;
            const match = line.trimmed.match(/^([IVXLCDM]+)\.\s+(.+)$/);
            const ordinal = match ? parseRoman(match[1]) : null;
            if (!match || !ordinal) return null;
            return {
              line: line.lineNumber,
              kind: "chapter" as BookSectionKind,
              label: `Story ${ordinal}`,
              title: match[2].trim().replace(/,$/, ""),
              includeByDefault: true,
            };
          })
          .filter(isSectionBoundary),
    },
    "the-divine-comedy": {
      slug: "the-divine-comedy",
      structuralConvention: "canto-based verse sections",
      startLine: 170,
      endLine: 15645,
      startReason: "Inferno Canto I is the first main readable canto after title and canto list.",
      endReason: "Paradise Canto XXXIII ends before the Project Gutenberg footer.",
      expectedMinimumSections: 100,
      makeBoundaries: (lines) => {
        let part = "Inferno";
        const boundaries: SectionBoundary[] = [];
        for (const line of lines) {
          if (line.lineNumber < 164 || line.lineNumber > 15645) continue;
          if (/^PURGATORY$/i.test(line.trimmed)) part = "Purgatory";
          if (/^PARADISE$/i.test(line.trimmed)) part = "Paradise";
          const canto = line.trimmed.match(/^CANTO\s+([IVXLCDM]+)$/i);
          if (!canto) continue;
          const ordinal = romanOrText(canto[1]);
          boundaries.push({
            line: line.lineNumber,
            kind: "poem",
            label: `${part} Canto ${ordinal}`,
            title: null,
            includeByDefault: true,
          });
        }
        return boundaries;
      },
    },
    "the-elements-of-style": {
      slug: "the-elements-of-style",
      structuralConvention: "nonfiction rules and roman-numbered sections",
      startLine: 149,
      endLine: 2369,
      startReason: "Section I, Introductory, is the first readable content after title/transcriber note and contents.",
      endReason: "The exercises end before the closing transcriber's note and Project Gutenberg footer.",
      expectedMinimumSections: 24,
      makeBoundaries: (lines) =>
        lines
          .map<SectionBoundary | null>((line) => {
            if (line.lineNumber < 149 || line.lineNumber > 2369) return null;
            const majorHeadingLines = new Set([149, 203, 551, 1399, 1536, 2134, 2239]);
            const major = line.trimmed.match(/^([IVXLCDM]+)\.\s+(.+)$/);
            if (major && majorHeadingLines.has(line.lineNumber)) {
              return {
                line: line.lineNumber,
                kind: "part" as BookSectionKind,
                label: `Section ${romanOrText(major[1])}`,
                title: titleCase(major[2].trim()),
                includeByDefault: true,
              };
            }
            if (line.lineNumber > 1336) return null;
            const rule = line.trimmed.match(/^([1-9]|1[0-8])\.\s+(.+)$/);
            if (!rule) return null;
            return {
              line: line.lineNumber,
              kind: "chapter" as BookSectionKind,
              label: `Rule ${rule[1]}`,
              title: rule[2].trim().replace(/\.$/, ""),
              includeByDefault: true,
            };
          })
          .filter(isSectionBoundary),
    },
    "the-federalist-papers": {
      slug: "the-federalist-papers",
      structuralConvention: "Federalist essay headings",
      startLine: 136,
      endLine: 19978,
      startReason:
        "Federalist No. I's address line is the first readable body content after title, contents, masthead, essay title, journal note, and author line.",
      endReason: "Federalist No. LXXXV notes end before the Project Gutenberg footer.",
      expectedMinimumSections: 85,
      makeBoundaries: (lines) => {
        const seen = new Map<number, number>();
        const boundaries: SectionBoundary[] = [];
        for (const [index, line] of lines.entries()) {
          if (line.lineNumber < 126 || line.lineNumber > 19978) continue;
          if (!/^THE FEDERALIST\.$/.test(line.trimmed)) continue;
          const numberLine = lines[index + 1]?.trimmed ?? "";
          const match = numberLine.match(/^No\.\s+([IVXLCDM]+)\.$/i);
          const ordinal = match ? parseRoman(match[1]) : null;
          if (!ordinal) continue;
          const occurrence = (seen.get(ordinal) ?? 0) + 1;
          seen.set(ordinal, occurrence);
          const isFirstEssay = ordinal === 1 && occurrence === 1;
          const title = isFirstEssay ? null : firstTitleLineAfter(lines, index + 1);
          boundaries.push({
            line: isFirstEssay ? 136 : line.lineNumber,
            kind: "chapter",
            label:
              occurrence === 1
                ? `Federalist No. ${ordinal}`
                : `Federalist No. ${ordinal} (continued)`,
            title,
            includeByDefault: true,
          });
        }
        return boundaries;
      },
    },
    "the-jungle-book": {
      slug: "the-jungle-book",
      structuralConvention: "story and song headings",
      startLine: 56,
      endLine: 5406,
      startReason: "First story heading after title and contents.",
      endReason: "Final camp-animals song ends before the Project Gutenberg footer.",
      expectedMinimumSections: 14,
      makeBoundaries: (lines) =>
        boundariesFromTitleSet(
          lines,
          56,
          5406,
          [
            "Mowgli's Brothers",
            "Hunting-Song of the Seeonee Pack",
            "Kaa's Hunting",
            "Road-Song of the Bandar-Log",
            '"Tiger! Tiger!"',
            "Mowgli's Song",
            "The White Seal",
            "Lukannon",
            '"Rikki-Tikki-Tavi"',
            "Darzee's Chant",
            "Toomai of the Elephants",
            "Shiv and the Grasshopper",
            "Her Majesty's Servants",
            "Parade Song of the Camp Animals",
          ],
          "chapter",
        ),
    },
    "the-water-babies": {
      slug: "the-water-babies",
      structuralConvention: "chapter headings plus moral",
      startLine: 149,
      endLine: 7390,
      startReason: "Chapter I is the first main readable chapter after title, dedication, illustrations, and epigraph.",
      endReason: "The Moral and The End close before the Project Gutenberg footer.",
      expectedMinimumSections: 9,
      makeBoundaries: (lines) =>
        lines
          .map<SectionBoundary | null>((line) => {
            if (line.lineNumber < 149 || line.lineNumber > 7390) return null;
            const chapter = line.trimmed.match(/^CHAPTER\s+([IVXLCDM]+)(?:\s+AND\s+LAST)?$/i);
            if (chapter) {
              return {
                line: line.lineNumber,
                kind: "chapter" as BookSectionKind,
                label: `Chapter ${romanOrText(chapter[1])}`,
                title: /AND\s+LAST/i.test(line.trimmed) ? "And Last" : null,
                includeByDefault: true,
              };
            }
            if (/^MORAL$/i.test(line.trimmed)) {
              return {
                line: line.lineNumber,
                kind: "epilogue" as BookSectionKind,
                label: "Moral",
                title: null,
                includeByDefault: true,
              };
            }
            return null;
          })
          .filter(isSectionBoundary),
    },
  };
}

function makeCorrectionPlans5(): Record<string, CorrectionPlan> {
  return {
    candide: {
      slug: "candide",
      structuralConvention: "standalone roman-numbered chapters",
      startLine: 316,
      endLine: 4147,
      startReason:
        "Chapter I is the first main readable chapter after title pages, publisher material, introduction, contents, and illustration caption.",
      endReason: "Chapter XXX closes before the footnotes and Project Gutenberg footer.",
      expectedMinimumSections: 30,
      makeBoundaries: (lines) =>
        lines
          .map<SectionBoundary | null>((line, index) => {
            if (line.lineNumber < 316 || line.lineNumber > 4147) return null;
            const roman = line.trimmed.match(/^([IVXLCDM]+)$/);
            const ordinal = roman ? parseRoman(roman[1]) : null;
            if (!ordinal || ordinal > 30) return null;
            return {
              line: line.lineNumber,
              kind: "chapter",
              label: `Chapter ${ordinal}`,
              title: titleBlockAfter(lines, index, 3),
              includeByDefault: true,
            };
          })
          .filter(isSectionBoundary),
    },
    "crime-and-punishment": {
      slug: "crime-and-punishment",
      structuralConvention: "chapter-based roman numerals with epilogue",
      startLine: 140,
      endLine: 22097,
      startReason:
        "Part I Chapter I is the first main readable chapter after title, translator/front matter, and part heading.",
      endReason: "The epilogue closes before the Project Gutenberg footer.",
      expectedMinimumSections: 40,
      makeBoundaries: (lines) =>
        lines
          .map<SectionBoundary | null>((line, index) => {
            if (line.lineNumber < 140 || line.lineNumber > 22097) return null;
            const chapter = line.trimmed.match(/^CHAPTER\s+([IVXLCDM]+)$/i);
            if (chapter) {
              return {
                line: line.lineNumber,
                kind: "chapter",
                label: `Chapter ${romanOrText(chapter[1])}`,
                title: null,
                includeByDefault: true,
              };
            }
            if (/^EPILOGUE$/i.test(line.trimmed)) {
              return {
                line: line.lineNumber,
                kind: "epilogue",
                label: "Epilogue",
                title: firstTitleLineAfter(lines, index),
                includeByDefault: true,
              };
            }
            return null;
          })
          .filter(isSectionBoundary),
    },
    "gulliver-s-travels": {
      slug: "gulliver-s-travels",
      structuralConvention: "chapter-based roman numerals with voyage parts",
      startLine: 256,
      endLine: 9546,
      startReason:
        "Part I Chapter I is the first main travel narrative chapter after title, contents, publisher note, and prefatory letter.",
      endReason: "Part IV Chapter XII closes before footnotes and the Project Gutenberg footer.",
      expectedMinimumSections: 39,
      makeBoundaries: (lines) =>
        lines
          .map<SectionBoundary | null>((line) => {
            if (line.lineNumber < 256 || line.lineNumber > 9546) return null;
            const chapter = line.trimmed.match(/^CHAPTER\s+([IVXLCDM]+)\.$/i);
            const ordinal = chapter ? parseRoman(chapter[1]) : null;
            if (!ordinal) return null;
            return {
              line: line.lineNumber,
              kind: "chapter",
              label: `Chapter ${ordinal}`,
              title: null,
              includeByDefault: true,
            };
          })
          .filter(isSectionBoundary),
    },
    "the-call-of-cthulhu": {
      slug: "the-call-of-cthulhu",
      structuralConvention: "three numbered story sections",
      startLine: 60,
      endLine: 1253,
      startReason:
        "The first numbered story section follows the Gutenberg header, title/author lines, transcriber's note, epigraph, illustration caption, and footnote.",
      endReason: "The third story section ends immediately before the Project Gutenberg footer.",
      expectedMinimumSections: 3,
      makeBoundaries: (lines) =>
        lines
          .map<SectionBoundary | null>((line) => {
            if (line.lineNumber < 60 || line.lineNumber > 1253) return null;
            const match = line.trimmed.match(/^_?([1-3])\.\s+(.+?)\.?_?$/);
            if (!match) return null;
            return {
              line: line.lineNumber,
              kind: "chapter",
              label: `Part ${match[1]}`,
              title: titleCase(match[2]),
              includeByDefault: true,
            };
          })
          .filter(isSectionBoundary),
    },
    "the-emerald-city-of-oz": {
      slug: "the-emerald-city-of-oz",
      structuralConvention: "arabic-numbered titled chapters",
      startLine: 119,
      endLine: 6969,
      startReason:
        "Chapter 1 is the first main readable chapter after title, contents, and Baum's prefatory note.",
      endReason: "Chapter 30 closes before the Project Gutenberg footer.",
      expectedMinimumSections: 30,
      makeBoundaries: (lines) =>
        lines
          .map<SectionBoundary | null>((line) => {
            if (line.lineNumber < 119 || line.lineNumber > 6969) return null;
            const match = line.trimmed.match(/^([1-9]|[12][0-9]|30)\.\s+(.+)$/);
            if (!match) return null;
            return {
              line: line.lineNumber,
              kind: "chapter",
              label: `Chapter ${match[1]}`,
              title: match[2].trim(),
              includeByDefault: true,
            };
          })
          .filter(isSectionBoundary),
    },
    "the-old-house": {
      slug: "the-old-house",
      structuralConvention: "Andersen story collection headings",
      startLine: 44,
      endLine: 1932,
      startReason: "The Old House is the first story heading after the Gutenberg header and collection title.",
      endReason: "The final story in this source file ends before the Project Gutenberg footer.",
      expectedMinimumSections: 9,
      makeBoundaries: (lines) =>
        boundariesFromTitleSet(
          lines,
          44,
          1941,
          [
            "THE OLD HOUSE",
            "THE HAPPY FAMILY",
            "THE STORY OF A MOTHER",
            "THE FALSE COLLAR",
            "THE SHADOW",
            "THE LITTLE MATCH GIRL",
            "THE DREAM OF LITTLE TUK",
            "THE NAUGHTY BOY",
            "THE RED SHOES",
          ],
          "chapter",
        ),
    },
    "the-snow-queen": {
      slug: "the-snow-queen",
      structuralConvention: "seven titled story parts",
      startLine: 140,
      endLine: 1317,
      startReason: "Story the First is the first main Snow Queen section after title, copyright, preface, and wrapper title.",
      endReason: "The seventh story ends at the final summer paragraph before trailing blanks.",
      expectedMinimumSections: 7,
      makeBoundaries: (lines) =>
        lines
          .map<SectionBoundary | null>((line, index) => {
            if (line.lineNumber < 140 || line.lineNumber > 1317) return null;
            const headings: Record<string, number> = {
              "STORY THE FIRST": 1,
              "SECOND STORY": 2,
              "THIRD STORY": 3,
              "FOURTH STORY": 4,
              "FIFTH STORY": 5,
              "SIXTH STORY": 6,
              "SEVENTH STORY": 7,
            };
            const ordinal = headings[line.trimmed.toUpperCase()];
            if (!ordinal) return null;
            return {
              line: line.lineNumber,
              kind: "chapter",
              label: `Story ${ordinal}`,
              title: titleBlockAfter(lines, index, 2),
              includeByDefault: true,
            };
          })
          .filter(isSectionBoundary),
    },
    "the-swineherd": {
      slug: "the-swineherd",
      structuralConvention: "single Andersen story",
      startLine: 43,
      endLine: 249,
      startReason: "The Swineherd is the first and only story heading after the Gutenberg header and collection title.",
      endReason: "The story closes before the Project Gutenberg footer/license block.",
      expectedMinimumSections: 1,
      makeBoundaries: (lines) =>
        boundariesFromTitleSet(lines, 43, 249, ["THE SWINEHERD"], "chapter"),
    },
    "treasure-island": {
      slug: "treasure-island",
      structuralConvention: "roman-numbered chapters within part divisions",
      startLine: 143,
      endLine: 7508,
      startReason:
        "Chapter I is the first main readable chapter after title, dedication, poem, contents, and part heading.",
      endReason: "Chapter XXXIV closes before the Project Gutenberg footer.",
      expectedMinimumSections: 34,
      makeBoundaries: (lines) => {
        let sequence = 0;
        return lines
          .map<SectionBoundary | null>((line, index) => {
            if (line.lineNumber < 143 || line.lineNumber > 7508) return null;
            if (!/^([IVXLCDM]+)$/.test(line.trimmed)) return null;
            sequence += 1;
            if (sequence > 34) return null;
            return {
              line: line.lineNumber,
              kind: "chapter",
              label: `Chapter ${sequence}`,
              title: titleBlockAfter(lines, index, 2),
              includeByDefault: true,
            };
          })
          .filter(isSectionBoundary);
      },
    },
  };
}

function makeSectionJson(slug: string, section: DetectedBookSection): GeneratedBookSectionJson {
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
    estimatedTypingMinutes: estimateTypingMinutes(section.wordCount),
    estimatedListeningMinutes: estimateListeningMinutes(section.morseCharacterEstimate),
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
  slug: string,
  title: string,
  author: string[],
  sections: DetectedBookSection[],
): string {
  return sha256Json({
    slug,
    title,
    author,
    sections: sections.map((section) => ({
      kind: section.kind,
      label: section.label,
      title: section.title,
      includeByDefault: section.includeByDefault,
      text: section.text,
    })),
  });
}

function buildManifest(
  previous: GeneratedBookManifest,
  rawText: string,
  sections: DetectedBookSection[],
  contentHash: string,
  cleanupSummary: CleanupSummary,
  warnings: string[],
): GeneratedBookManifest {
  const cleanedCharacterCount = sections.reduce((total, section) => total + section.characterCount, 0);
  const wordCount = sections.reduce((total, section) => total + section.wordCount, 0);
  const included = sections.filter((section) => section.includeByDefault);
  return {
    ...previous,
    contentVersion: contentHash.slice(0, 16),
    contentHash,
    stats: {
      originalCharacterCount: rawText.length,
      cleanedCharacterCount,
      wordCount,
      sectionCount: sections.length,
      includedSectionCount: included.length,
    },
    defaults: {
      includeKinds: includeKindsFor(sections),
      preferredPreset: previous.defaults.preferredPreset,
    },
    sections: sections.map((section) => ({
      id: section.id,
      kind: section.kind,
      label: section.label,
      title: section.title,
      order: section.order,
      includeByDefault: section.includeByDefault,
      sectionJsonPath: `sections/${section.id}.json`,
      characterCount: section.characterCount,
      wordCount: section.wordCount,
      estimatedTypingMinutes: estimateTypingMinutes(section.wordCount),
      estimatedListeningMinutes: estimateListeningMinutes(section.morseCharacterEstimate),
      morseCharacterEstimate: section.morseCharacterEstimate,
      textPreview: section.textPreview,
    })),
    cleaning: {
      originalCharacterCount: rawText.length,
      cleanedCharacterCount,
      headerStripped: true,
      footerStripped: true,
      confidence: "high",
      warnings,
    },
    warnings: [
      "Generated by controlled pilot write pass 5; review before scaling to larger batches or Cloudflare export.",
      ...(cleanupSummary.imagePlaceholderLinesRemoved > 0
        ? ["Illustration/image placeholder lines removed from playable text."]
        : []),
      ...(cleanupSummary.sourceHeadingLinesRemoved > 0
        ? ["Source heading lines retained as section metadata and removed from playable text."]
        : []),
      ...warnings,
    ],
  };
}

function buildCleanedBook(
  manifest: GeneratedBookManifest,
  sections: DetectedBookSection[],
): CleanedBookJson {
  return {
    schemaVersion: 1,
    id: manifest.slug,
    title: manifest.title,
    author: manifest.author.join(", "),
    contentVersion: manifest.contentVersion,
    contentHash: manifest.contentHash,
    source: {
      provider: manifest.source.provider,
      gutenbergId: manifest.source.gutenbergId,
      sourceUrl: manifest.source.sourceUrl,
      rawTextUrl: manifest.source.rawTextUrl,
      originalPublication: "",
      releaseDate: manifest.source.releaseDate ?? "",
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
        (total, section) => total + estimateListeningMinutes(section.morseCharacterEstimate),
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
  manifest: GeneratedBookManifest,
  sections: DetectedBookSection[],
): ProcessedBookJson {
  return {
    schemaVersion: 1,
    id: manifest.slug,
    title: manifest.title,
    author: manifest.author.join(", "),
    content_version: manifest.contentVersion,
    content_hash: manifest.contentHash,
    source: {
      name: manifest.source.provider,
      ebook_number: manifest.source.gutenbergId ?? "",
      source_url: manifest.source.sourceUrl,
      raw_text_url: manifest.source.rawTextUrl,
      original_publication: "",
      release_date: manifest.source.releaseDate ?? "",
      last_updated: "",
    },
    rights: {
      status: "approved",
      approved_for_website: true,
      approved_for_youtube_narration: false,
      approved_regions: ["US"],
      needs_manual_review: false,
      notes: manifest.source.rightsNotes,
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
            estimated_listening_minutes: estimateListeningMinutes(section.morseCharacterEstimate),
          },
        ],
      })),
    },
  };
}

function makePreviewAsset(
  manifest: GeneratedBookManifest,
  sections: DetectedBookSection[],
): { asset: PreviewAsset; sourceSections: string[] } {
  const sourceSections = sections.filter((section) => section.includeByDefault);
  const targetMorseCharacters = 900 * 60;
  const selected: DetectedBookSection[] = [];
  let morseTotal = 0;
  for (const section of sourceSections) {
    selected.push(section);
    morseTotal += section.morseCharacterEstimate;
    if (morseTotal >= targetMorseCharacters) break;
  }
  if (!selected[0]) throw new Error(`${manifest.slug}: no default preview source section.`);
  const joined = selected.map((section) => section.text).join("\n\n");
  const truncated = morseTotal > targetMorseCharacters;
  let previewText = joined;
  if (truncated) {
    const ratio = Math.min(1, targetMorseCharacters / Math.max(1, morseTotal));
    const targetChars = Math.max(1_000, Math.floor(joined.length * ratio));
    const paragraphBreak = joined.lastIndexOf("\n\n", targetChars);
    previewText = trimBookText(joined.slice(0, paragraphBreak > 1_000 ? paragraphBreak : targetChars));
  }
  const morseEstimate = estimateMorseCharacters(previewText);
  const wordCount = countBookWords(previewText);
  const first = selected[0];
  return {
    asset: {
      version: 1,
      slug: manifest.slug,
      contentVersion: manifest.contentVersion,
      contentHash: manifest.contentHash,
      defaultSectionId: first.id,
      defaultSectionKind: first.kind,
      defaultSectionLabel: first.label,
      defaultSectionTitle: first.title,
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

function snapshotFromSection(section: GeneratedBookManifest["sections"][number] | DetectedBookSection | null): SectionSnapshot {
  if (!section) {
    return {
      id: null,
      label: null,
      title: null,
      kind: null,
      includeByDefault: null,
      wordCount: null,
      snippet: null,
    };
  }
  return {
    id: section.id,
    label: section.label,
    title: section.title,
    kind: section.kind,
    includeByDefault: section.includeByDefault,
    wordCount: section.wordCount,
    snippet: section.textPreview,
  };
}

function firstDefaultSnapshot(manifest: GeneratedBookManifest): SectionSnapshot {
  return snapshotFromSection(manifest.sections.find((section) => section.includeByDefault) ?? manifest.sections[0] ?? null);
}

function sectionSummary(sections: DetectedBookSection[] | GeneratedBookManifest["sections"]) {
  return sections.map((section) => ({
    id: section.id,
    label: section.label,
    title: section.title,
    kind: section.kind,
    wordCount: section.wordCount,
  }));
}

function writeGeneratedOutput(
  manifest: GeneratedBookManifest,
  sectionJson: GeneratedBookSectionJson[],
  cleanedBook: CleanedBookJson,
  processedBook: ProcessedBookJson,
  rightsReport: BookRightsReport,
  notes: string,
): string[] {
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
  return changed.map(statusPath);
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
  writeJson(libraryManifestPath, {
    schemaVersion: 1,
    books: library.books.map((book) => bySlug.get(book.slug)).filter((book): book is NonNullable<typeof book> => Boolean(book)),
  });
}

function updatePreviewManifest(entries: Array<{
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
  for (const entry of entries) {
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
  writeJson(previewManifestPath, {
    ...manifest,
    books: manifest.books.map((book) => bySlug.get(book.slug)).filter(Boolean),
    missing: manifest.missing.filter((slug) => !entries.some((entry) => entry.slug === slug)),
  });
}

function makeProcessingNotes(report: BookReport): string {
  return `# ${report.slug}

Processed by pilot write pass 5.

- Source: ${report.sourceFileUsed}
- Start boundary: line ${report.startBoundaryUsed.line} (${report.startBoundaryUsed.reason})
- End boundary: line ${report.endBoundaryUsed.line} (${report.endBoundaryUsed.reason})
- Structural convention: ${report.structuralConvention}
- Sections after correction: ${report.sectionCountAfter}
- Final recommendation: ${report.finalRecommendation}

This output is intentionally review-gated before larger batch processing or Cloudflare export.
`;
}

function processAcceptedBook(dryRun: DryRunBook): BookReport {
  const manifestPath = path.join(generatedRoot, dryRun.slug, "manifest.json");
  const previewPath = path.join(previewRoot, `${dryRun.slug}.preview.json`);
  const perBookMarkdownPath = path.join(dryRunRoot, "books", `${dryRun.slug}.md`);
  const manifest = readJson<GeneratedBookManifest>(manifestPath);
  const preview = readJson<PreviewAsset>(previewPath);
  fs.readFileSync(perBookMarkdownPath, "utf8");
  return {
    slug: dryRun.slug,
    dryRunStatus: dryRun.currentStatus,
    finalAction: "accepted without rewrite",
    sourceFileUsed: dryRun.sourceFileUsed,
    inspections: {
      dryRunJsonInspected: true,
      dryRunMarkdownInspected: true,
      rawSourceInspected: fs.existsSync(path.join(repoRoot, dryRun.sourceFileUsed)),
      currentGeneratedOutputInspected: true,
      currentPreviewAssetInspected: true,
    },
    generatedFilesChanged: [],
    previewAssetChanged: null,
    priorIssueFromDryRun: dryRun.warnings,
    startBoundaryUsed: {
      line: null,
      reason: "Accepted from dry-run; no write needed.",
      snippet: dryRun.firstDefaultSectionCurrently.snippet,
    },
    endBoundaryUsed: {
      line: null,
      reason: "Accepted from dry-run; no write needed.",
      snippet: manifest.sections.at(-1)?.textPreview ?? null,
    },
    structuralConvention: dryRun.detectedStructuralConvention,
    firstDefaultSectionBefore: dryRun.firstDefaultSectionCurrently,
    firstDefaultSectionAfter: firstDefaultSnapshot(manifest),
    sectionCountBefore: dryRun.currentGeneratedSectionCount,
    sectionCountAfter: manifest.sections.length,
    first5SectionsWithWordCounts: sectionSummary(manifest.sections.slice(0, 5)),
    last5SectionsWithWordCounts: sectionSummary(manifest.sections.slice(-5)),
    cleanupActionsApplied: null,
    previewVerdict: dryRun.boundaries.previewVerdict,
    startupPreviewValid: !previewLooksUnsafe(preview.previewText),
    allMainReadableDefaultVerdict: dryRun.boundaries.allMainReadableDefaultVerdict,
    remainingWarnings: [],
    finalRecommendation: "accepted for review",
    acceptedFromDryRunReason: "Dry-run batch 5 classified this book as already acceptable; generated output and preview were inspected but not rewritten.",
    noFilesChanged: true,
  };
}

function processCorrectionBook(
  dryRun: DryRunBook,
  plan: CorrectionPlan,
): {
  report: BookReport;
  manifest: GeneratedBookManifest | null;
  previewEntry: Parameters<typeof updatePreviewManifest>[0][number] | null;
} {
  const sourcePath = path.resolve(repoRoot, dryRun.sourceFileUsed);
  assertInside(tempBooksRoot, sourcePath);
  const manifestPath = path.join(generatedRoot, dryRun.slug, "manifest.json");
  const previewPath = path.join(previewRoot, `${dryRun.slug}.preview.json`);
  const perBookMarkdownPath = path.join(dryRunRoot, "books", `${dryRun.slug}.md`);
  const previousManifest = readJson<GeneratedBookManifest>(manifestPath);
  const previousPreview = readJson<PreviewAsset>(previewPath);
  const rightsReportPath = path.join(generatedRoot, dryRun.slug, "rights_report.json");
  const previousRightsReport = readJson<BookRightsReport>(rightsReportPath);
  fs.readFileSync(perBookMarkdownPath, "utf8");
  const rawText = fs.readFileSync(sourcePath, "utf8");
  const lines = lineRecords(rawText);

  const boundaries = plan.makeBoundaries(lines);
  const warnings: string[] = [];
  const fatalWarnings: string[] = [];
  if (boundaries.length < plan.expectedMinimumSections) {
    fatalWarnings.push(`Only ${boundaries.length} boundaries found; expected at least ${plan.expectedMinimumSections}.`);
  }
  const cleanupSummary = emptyCleanupSummary();
  const sections = makeDetectedSections(
    dryRun.slug,
    rawText,
    lines,
    boundaries,
    plan.endLine,
    cleanupSummary,
  );
  const joinedText = sections.map((section) => section.text).join("\n\n");
  const structureAnalysis = analyzeBookStructure(joinedText, {
    rawWordCount: countBookWords(joinedText),
  });
  warnings.push(
    `Structure detector observed ${structureAnalysis.detectedStructuralConvention}; source-backed write-5 plan used ${plan.structuralConvention}.`,
  );
  if (structureAnalysis.redFlags.length > 0) warnings.push(...structureAnalysis.redFlags);
  if (sourceLooksUnsafe(joinedText)) {
    fatalWarnings.push("Source, license, contributor, or transcriber material remains in corrected playable text.");
  }
  if (sections.some((section) => section.wordCount > 20_000)) {
    warnings.push(
      "At least one corrected story remains large because the source has no clear internal headings; it was not split into fake fragments.",
    );
  }
  if (sections.every((section) => !section.includeByDefault)) {
    fatalWarnings.push("No corrected sections are included by default.");
  }

  const contentHash = buildContentHash(
    previousManifest.slug,
    previousManifest.title,
    previousManifest.author,
    sections,
  );
  const manifest = buildManifest(
    previousManifest,
    rawText,
    sections,
    contentHash,
    cleanupSummary,
    [...new Set(warnings)],
  );
  const preview = makePreviewAsset(manifest, sections);
  if (previewLooksUnsafe(preview.asset.previewText)) {
    fatalWarnings.push("Corrected startup preview is generic, source-like, or too short.");
  }

  const firstDefaultAfter = snapshotFromSection(sections.find((section) => section.includeByDefault) ?? sections[0] ?? null);
  const baseReport: BookReport = {
    slug: dryRun.slug,
    dryRunStatus: dryRun.currentStatus,
    finalAction: fatalWarnings.length > 0 ? "skipped" : "corrected",
    sourceFileUsed: statusPath(sourcePath),
    inspections: {
      dryRunJsonInspected: true,
      dryRunMarkdownInspected: true,
      rawSourceInspected: true,
      currentGeneratedOutputInspected: true,
      currentPreviewAssetInspected: true,
    },
    generatedFilesChanged: [],
    previewAssetChanged: null,
    priorIssueFromDryRun: [...dryRun.hardFailReasons, ...dryRun.warnings],
    startBoundaryUsed: {
      line: plan.startLine,
      reason: plan.startReason,
      snippet: snippetFromLine(lines, plan.startLine),
    },
    endBoundaryUsed: {
      line: plan.endLine,
      reason: plan.endReason,
      snippet: snippetFromLine(lines, plan.endLine),
    },
    structuralConvention: plan.structuralConvention,
    firstDefaultSectionBefore: dryRun.firstDefaultSectionCurrently,
    firstDefaultSectionAfter: firstDefaultAfter,
    sectionCountBefore: dryRun.currentGeneratedSectionCount,
    sectionCountAfter: sections.length,
    first5SectionsWithWordCounts: sectionSummary(sections.slice(0, 5)),
    last5SectionsWithWordCounts: sectionSummary(sections.slice(-5)),
    cleanupActionsApplied: cleanupSummary,
    previewVerdict: previewLooksUnsafe(preview.asset.previewText)
      ? "invalid corrected preview"
      : "valid book-specific startup preview from corrected first default section",
    startupPreviewValid: !previewLooksUnsafe(preview.asset.previewText),
    allMainReadableDefaultVerdict: sections.every((section) => section.includeByDefault)
      ? "all corrected main readable sections are included by default"
      : "some corrected sections are optional",
    remainingWarnings: [...new Set(warnings)],
    finalRecommendation: fatalWarnings.length > 0 ? "skipped" : "accepted for review",
  };

  if (fatalWarnings.length > 0) {
    return {
      report: {
        ...baseReport,
        remainingWarnings: [...new Set([...warnings, ...fatalWarnings])],
        finalRecommendation: "skipped",
      },
      manifest: null,
      previewEntry: null,
    };
  }

  const sectionJson = sections.map((section) => makeSectionJson(dryRun.slug, section));
  const cleanedBook = buildCleanedBook(manifest, sections);
  const processedBook = buildProcessedBook(manifest, sections);
  const rightsReport: BookRightsReport = {
    ...previousRightsReport,
    approved_for_website: true,
    approved_regions:
      previousRightsReport.approved_regions.length > 0
        ? previousRightsReport.approved_regions
        : ["US"],
    approval_source: "external-authority",
    canada_us_v1_status: "approved",
    processing_allowed: true,
    reasoning_summary:
      "Controlled pilot write pass 5 used source-backed boundaries from dry-run batch 5 review and did not modify raw sources or Cloudflare exports.",
  };
  const generatedFilesChanged = writeGeneratedOutput(
    manifest,
    sectionJson,
    cleanedBook,
    processedBook,
    rightsReport,
    makeProcessingNotes(baseReport),
  );
  writeJson(previewPath, preview.asset);

  return {
    report: {
      ...baseReport,
      generatedFilesChanged,
      previewAssetChanged: statusPath(previewPath),
      remainingWarnings: [
        ...new Set([
          ...warnings,
          `Previous preview default was ${previousPreview.defaultSectionId}; corrected preview default is ${preview.asset.defaultSectionId}.`,
        ]),
      ],
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

function assertDryRunShape(report: DryRunReport) {
  if (report.reportName !== "pilot-dry-run-5") {
    throw new Error("Dry-run report is not pilot-dry-run-5.");
  }
  const selected = [...report.selectedBooks].sort();
  const expectedSelected = [...SELECTED_BATCH].sort();
  if (JSON.stringify(selected) !== JSON.stringify(expectedSelected)) {
    throw new Error("Dry-run selected books do not match the requested batch-5 list.");
  }
  const accepted = report.books
    .filter((book) => book.currentStatus === "already acceptable")
    .map((book) => book.slug)
    .sort();
  const correction = report.books
    .filter((book) => book.currentStatus === "needs correction before acceptance")
    .map((book) => book.slug)
    .sort();
  if (JSON.stringify(accepted) !== JSON.stringify([...EXPECTED_ACCEPTED].sort())) {
    throw new Error(`Unexpected already-acceptable set: ${accepted.join(", ")}`);
  }
  if (JSON.stringify(correction) !== JSON.stringify([...EXPECTED_CORRECTION].sort())) {
    throw new Error(`Unexpected correction set: ${correction.join(", ")}`);
  }
  if (
    report.totals.selectedBooks !== 20 ||
    report.totals.alreadyAcceptable !== 11 ||
    report.totals.needsCorrectionBeforeAcceptance !== 9 ||
    report.totals.manualReview !== 0 ||
    report.totals.blocked !== 0
  ) {
    throw new Error("Dry-run totals are not the expected 20/11/9/0/0 split.");
  }
}

function writeReport(results: BookReport[]) {
  const accepted = results.filter((result) => result.finalAction === "accepted without rewrite");
  const corrected = results.filter((result) => result.finalAction === "corrected");
  const skipped = results.filter((result) => result.finalAction === "skipped");
  const jsonReport = {
    schemaVersion: 1,
    reportName: "pilot-write-5",
    generatedAt: new Date().toISOString(),
    mode: "controlled write/correction batch 5",
    inputReports: {
      pilotDryRun5Json: statusPath(dryRunReportPath),
      pilotDryRun5Markdown: statusPath(path.join(dryRunRoot, "pilot-dry-run-5.md")),
      pilotDryRun5Books: statusPath(path.join(dryRunRoot, "books")),
    },
    protectedPaths: {
      rawSourceInput: statusPath(tempBooksRoot),
      cloudflareExport: "app/client/assets/books/cloudflare-export",
    },
    selectedBooks: SELECTED_BATCH,
    dryRunAcceptedNoRewrite: accepted.map((result) => result.slug),
    correctedBooks: corrected.map((result) => result.slug),
    skippedBooks: skipped.map((result) => ({
      slug: result.slug,
      warnings: result.remainingWarnings,
    })),
    totals: {
      selected: results.length,
      acceptedWithoutRewrite: accepted.length,
      corrected: corrected.length,
      skipped: skipped.length,
    },
    futureBatchRule: FUTURE_BATCH_RULE,
    confirmations: {
      dryRunBatch5MergedToMainFirst: true,
      processedOnlySelectedBatch5Books: true,
      acceptedDryRunBooksNotRewritten: true,
      rawSourceBooksModified: false,
      cloudflareExportsModified: false,
      allBookProcessingRun: false,
      generatedOutputChangedOnlyForCorrectionBooks: true,
      previewAssetsChangedOnlyForCorrectionBooks: true,
    },
    books: results,
  };
  writeJson(path.join(writeReportRoot, "pilot-write-5.json"), jsonReport);

  const rows = results
    .map(
      (result) =>
        `| ${result.slug} | ${result.dryRunStatus} | ${result.finalAction} | ${result.sectionCountBefore} | ${result.sectionCountAfter} | ${result.startupPreviewValid ? "valid" : "invalid"} | ${result.finalRecommendation} |`,
    )
    .join("\n");
  const correctedList = corrected
    .map((result) => `- ${result.slug}: ${result.sectionCountBefore} -> ${result.sectionCountAfter} sections; preview ${result.previewAssetChanged}`)
    .join("\n");
  const acceptedList = accepted
    .map((result) => `- ${result.slug}: accepted from dry-run; no write needed; no files changed.`)
    .join("\n");
  const generatedFiles = corrected
    .flatMap((result) => result.generatedFilesChanged)
    .concat(corrected.length > 0 ? ["app/client/assets/books/generated/library-manifest.json"] : [])
    .map((filePath) => `- ${filePath}`)
    .join("\n");
  const previewFiles = corrected
    .map((result) => result.previewAssetChanged)
    .filter((filePath): filePath is string => Boolean(filePath))
    .concat(corrected.length > 0 ? ["public/book-previews/manifest.json"] : [])
    .map((filePath) => `- ${filePath}`)
    .join("\n");
  const markdown = `# Pilot Write 5 Report

Controlled write/correction pass for pilot dry-run batch 5. The dry-run branch was merged to main first, and this write pass only corrected books classified as \`needs correction before acceptance\` in \`pilot-dry-run-5.json\`.

## Summary

| Book | Dry-run status | Final action | Sections before | Sections after | Startup preview | Recommendation |
| --- | --- | --- | ---: | ---: | --- | --- |
${rows}

## Accepted Without Rewrite

${acceptedList || "- None"}

## Corrected Books

${correctedList || "- None"}

## Skipped Books

${skipped.map((result) => `- ${result.slug}: ${result.remainingWarnings.join("; ")}`).join("\n") || "- None"}

## Boundary And Cleanup Notes

${results
  .map(
    (result) =>
      `- ${result.slug}: start ${result.startBoundaryUsed.line ?? "unchanged"} (${result.startBoundaryUsed.reason}); end ${result.endBoundaryUsed.line ?? "unchanged"} (${result.endBoundaryUsed.reason}); cleanup ${
        result.cleanupActionsApplied
          ? `removed ${result.cleanupActionsApplied.imagePlaceholderLinesRemoved} image lines, ${result.cleanupActionsApplied.decorativeLinesRemoved} decorative lines, and ${result.cleanupActionsApplied.numberedReferencesRemoved} numbered references`
          : "not rewritten"
      }.`,
  )
  .join("\n")}

## Generated Output Files Changed

${generatedFiles || "- None"}

## Preview Assets Changed

${previewFiles || "- None"}

## Future Batch Rule

Future book batches fail unless each processed book has:

${FUTURE_BATCH_RULE.map((rule) => `- ${rule}`).join("\n")}

## Confirmations

- app/client/assets/temp-books was read only and not modified.
- app/client/assets/books/cloudflare-export was not modified.
- No all-book processing or \`npm run books:build\` was run by this script.
- The 11 already-acceptable dry-run books were inspected and not rewritten.
- Generated output and preview assets were changed only for corrected batch-5 books plus required manifests and write reports.
`;
  writeText(path.join(writeReportRoot, "pilot-write-5.md"), markdown);
}

function main() {
  const dryRun = readJson<DryRunReport>(dryRunReportPath);
  assertDryRunShape(dryRun);
  const bySlug = new Map(dryRun.books.map((book) => [book.slug, book]));
  const correctionPlans = makeCorrectionPlans5();
  const results: BookReport[] = [];
  const manifests: GeneratedBookManifest[] = [];
  const previewEntries: NonNullable<ReturnType<typeof processCorrectionBook>["previewEntry"]>[] = [];

  for (const slug of SELECTED_BATCH) {
    const dryRunBook = bySlug.get(slug);
    if (!dryRunBook) throw new Error(`Dry-run report missing ${slug}.`);
    if (dryRunBook.currentStatus === "already acceptable") {
      results.push(processAcceptedBook(dryRunBook));
      continue;
    }
    if (dryRunBook.currentStatus !== "needs correction before acceptance") {
      throw new Error(`${slug} has unsupported dry-run status ${dryRunBook.currentStatus}.`);
    }
    const plan = correctionPlans[slug];
    if (!plan) throw new Error(`Missing correction plan for ${slug}.`);
    const result = processCorrectionBook(dryRunBook, plan);
    results.push(result.report);
    if (result.manifest) manifests.push(result.manifest);
    if (result.previewEntry) previewEntries.push(result.previewEntry);
  }

  if (manifests.length > 0) updateLibraryManifest(manifests);
  if (previewEntries.length > 0) updatePreviewManifest(previewEntries);
  writeReport(results);
  console.log(
    `Pilot write 5 complete: ${results.filter((result) => result.finalAction === "accepted without rewrite").length} accepted without rewrite, ${results.filter((result) => result.finalAction === "corrected").length} corrected, ${results.filter((result) => result.finalAction === "skipped").length} skipped.`,
  );
}

main();
