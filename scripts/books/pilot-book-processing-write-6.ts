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
  | "needs first-time controlled processing"
  | "manual review"
  | "blocked";

type SectionSnapshot = {
  id: string | null;
  label: string | null;
  title: string | null;
  kind: BookSectionKind | null;
  includeByDefault: boolean | null;
  wordCount: number | null;
  snippet: string | null;
};

type DryRunBook = {
  slug: string;
  title: string;
  author: string[];
  candidateType: "generated-but-unaccepted" | "raw-only";
  sourceFileUsed: string;
  generatedOutputExists: boolean;
  previewAssetExists: boolean;
  detectedStructuralConvention: string;
  currentGeneratedSectionCount: number;
  proposedSectionCountIfCorrectionNeeded: number | null;
  firstDefaultSectionCurrently: SectionSnapshot;
  expectedFirstReadableSection: {
    sourceLine: number | null;
    snippet: string | null;
  };
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
  reportName: "pilot-dry-run-6";
  selectedBooks: string[];
  unresolvedSourceGeneratedBooks: Array<{
    slug: string;
    title: string;
    reason: string;
  }>;
  totals: {
    selectedBooks: number;
    needsFirstTimeControlledProcessing: number;
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

type ProcessingPlan = {
  slug: string;
  displayTitle?: string;
  structuralConvention: string;
  startLine: number;
  endLine: number;
  startReason: string;
  endReason: string;
  expectedMinimumSections: number;
  makeBoundaries: (lines: SourceLine[]) => SectionBoundary[];
};

type BookReport = {
  slug: string;
  dryRunStatus: DryRunStatus;
  finalAction: "first-time processed" | "skipped";
  sourceFileUsed: string;
  inspections: {
    dryRunJsonInspected: boolean;
    dryRunMarkdownInspected: boolean;
    rawSourceInspected: boolean;
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
  firstDefaultSectionAfterProcessing: SectionSnapshot;
  sectionCount: number;
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
};

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const generatedRoot = path.join(repoRoot, "app/client/assets/books/generated");
const tempBooksRoot = path.join(repoRoot, "app/client/assets/temp-books");
const previewRoot = path.join(repoRoot, "public/book-previews");
const auditRoot = path.join(repoRoot, "app/client/assets/books/audit-reports");
const dryRunRoot = path.join(auditRoot, "pilot-dry-run-6");
const writeReportRoot = path.join(auditRoot, "pilot-write-6");
const dryRunReportPath = path.join(dryRunRoot, "pilot-dry-run-6.json");
const libraryManifestPath = path.join(generatedRoot, "library-manifest.json");
const previewManifestPath = path.join(previewRoot, "manifest.json");

const SELECTED_BATCH = [
  "a-midsummer-night-s-dream",
  "a-room-with-a-view",
  "agamemnon-of-aeschylus",
  "an-ideal-husband",
  "catriona",
  "for-the-duration-of-the-war",
  "romeo-and-juliet",
  "spoon-river-anthology",
  "the-adventures-of-ferdinand-count-fathom",
  "the-adventures-of-roderick-random",
  "the-expedition-of-humphry-clinker",
  "the-importance-of-being-earnest-a-trivial-comedy-for-serious-people",
  "the-man-who-was-thursday-a-nightmare",
  "the-money-box",
  "the-mystery-of-edwin-drood",
  "the-shunned-house",
  "the-story-of-the-inexperienced-ghost",
  "the-winning-of-olwen",
  "twenty-thousand-leagues-under-the-sea",
  "with-fire-and-sword",
] as const;

const UNRESOLVED_SOURCE_GENERATED_BOOKS = [
  "a-princess-of-mars",
  "doctor-dolittle",
  "heidi",
  "jabberwocky",
  "nights-with-uncle-remus",
  "peter-pan",
  "tarzan-of-the-apes",
  "the-great-gatsby",
  "the-picture-of-dorian-gray",
  "the-thirty-nine-steps",
  "wood-folk-at-school",
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

const LATER_PHASE_REQUIREMENTS = [
  "after all books are processed, run an independent second-pass audit using a different strategy",
  "after books and second-pass audit, add original non-spoiler 300-500+ word SEO summaries for each accepted book page",
  "after summaries, perform full site SEO/meta review using GSC data and route-level intent",
  "final cleanup should remove temporary audit scripts/reports and code bloat only after everything is stable",
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

function firstTitleLineAfter(lines: SourceLine[], index: number): string | null {
  for (let cursor = index + 1; cursor < Math.min(lines.length, index + 8); cursor += 1) {
    const trimmed = lines[cursor]?.trimmed ?? "";
    if (!trimmed || /^\[Illustration/i.test(trimmed)) continue;
    if (/^(?:CHAPTER|ACT|SCENE|PART)\b/i.test(trimmed)) return null;
    return trimmed.replace(/^_+|_+$/g, "").replace(/\.$/, "").trim();
  }
  return null;
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
    if (/^(?:FINIS|THE END)\.?$/i.test(cleanedTrimmed)) {
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

function isSectionBoundary(boundary: SectionBoundary | null): boundary is SectionBoundary {
  return boundary !== null;
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

function chapterRomanBoundaries(
  lines: SourceLine[],
  startLine: number,
  endLine: number,
): SectionBoundary[] {
  return lines
    .map<SectionBoundary | null>((line, index) => {
      if (line.lineNumber < startLine || line.lineNumber > endLine) return null;
      const match = line.trimmed.match(/^CHAPTER\s+([IVXLCDM]+)\.?$/i);
      const ordinal = match ? parseRoman(match[1]) : null;
      if (!ordinal) return null;
      return {
        line: line.lineNumber,
        kind: "chapter",
        label: `Chapter ${ordinal}`,
        title: firstTitleLineAfter(lines, index),
        includeByDefault: true,
      };
    })
    .filter(isSectionBoundary);
}

function wordActBoundaries(
  lines: SourceLine[],
  startLine: number,
  endLine: number,
): SectionBoundary[] {
  const ordinals: Record<string, number> = {
    FIRST: 1,
    SECOND: 2,
    THIRD: 3,
    FOURTH: 4,
    FIFTH: 5,
  };
  return lines
    .map<SectionBoundary | null>((line) => {
      if (line.lineNumber < startLine || line.lineNumber > endLine) return null;
      const match = line.trimmed.match(/^(FIRST|SECOND|THIRD|FOURTH|FIFTH) ACT$/);
      if (!match) return null;
      return {
        line: line.lineNumber,
        kind: "scene",
        label: `Act ${ordinals[match[1]]}`,
        title: null,
        includeByDefault: true,
      };
    })
    .filter(isSectionBoundary);
}

function romanActBoundaries(
  lines: SourceLine[],
  startLine: number,
  endLine: number,
): SectionBoundary[] {
  return lines
    .map<SectionBoundary | null>((line) => {
      if (line.lineNumber < startLine || line.lineNumber > endLine) return null;
      const match = line.trimmed.match(/^ACT\s+([IVXLCDM]+)$/);
      const ordinal = match ? parseRoman(match[1]) : null;
      if (!ordinal) return null;
      return {
        line: line.lineNumber,
        kind: "scene",
        label: `Act ${ordinal}`,
        title: null,
        includeByDefault: true,
      };
    })
    .filter(isSectionBoundary);
}

function fathomChapterBoundaries(
  lines: SourceLine[],
  startLine: number,
  endLine: number,
): SectionBoundary[] {
  let count = 0;
  return lines
    .map<SectionBoundary | null>((line, index) => {
      if (line.lineNumber < startLine || line.lineNumber > endLine) return null;
      if (!/^CHAPTER\s+[A-Z -]+$/.test(line.trimmed)) return null;
      count += 1;
      return {
        line: line.lineNumber,
        kind: "chapter",
        label: `Chapter ${count}`,
        title: firstTitleLineAfter(lines, index),
        includeByDefault: true,
      };
    })
    .filter(isSectionBoundary);
}

function humphryLetterBoundaries(
  lines: SourceLine[],
  startLine: number,
  endLine: number,
): SectionBoundary[] {
  let count = 0;
  return lines
    .map<SectionBoundary | null>((line) => {
      if (line.lineNumber < startLine || line.lineNumber > endLine) return null;
      const previous = lines[line.lineNumber - 2]?.trimmed ?? "";
      const trimmed = line.trimmed;
      if (previous || !/^(?:To|TO)\s+/.test(trimmed) || trimmed.length > 125) return null;
      count += 1;
      return {
        line: line.lineNumber,
        kind: "letter",
        label: `Letter ${count}`,
        title: trimmed.replace(/\s+/g, " "),
        includeByDefault: true,
      };
    })
    .filter(isSectionBoundary);
}

function spoonRiverPoemBoundaries(
  lines: SourceLine[],
  startLine: number,
  endLine: number,
): SectionBoundary[] {
  return lines
    .map<SectionBoundary | null>((line) => {
      if (line.lineNumber < startLine || line.lineNumber > endLine) return null;
      const previous = lines[line.lineNumber - 2]?.trimmed ?? "";
      const next = lines[line.lineNumber]?.trimmed ?? "";
      const next2 = lines[line.lineNumber + 1]?.trimmed ?? "";
      const next3 = lines[line.lineNumber + 2]?.trimmed ?? "";
      const title = line.trimmed;
      if (previous || next || (!next2 && !next3 && line.lineNumber !== endLine)) return null;
      if (!title || title.length > 80 || /^[_[({]/.test(title) || /[.!?;:]$/.test(title)) return null;
      if (!/[A-Za-z]/.test(title) || /^\d/.test(title)) return null;
      return {
        line: line.lineNumber,
        kind: "poem",
        label: title,
        title: null,
        includeByDefault: true,
      };
    })
    .filter(isSectionBoundary);
}

function singleSection(
  line: number,
  kind: BookSectionKind,
  label: string,
  includeByDefault = true,
): SectionBoundary[] {
  return [
    {
      line,
      kind,
      label,
      title: null,
      includeByDefault,
    },
  ];
}

function makeProcessingPlans(): Record<string, ProcessingPlan> {
  return {
    "a-midsummer-night-s-dream": {
      slug: "a-midsummer-night-s-dream",
      structuralConvention: "play acts",
      startLine: 110,
      endLine: 3518,
      startReason: "Body ACT I after dramatis personae and contents.",
      endReason: "Final epilogue ends before the Project Gutenberg end marker.",
      expectedMinimumSections: 5,
      makeBoundaries: (lines) => romanActBoundaries(lines, 110, 3518),
    },
    "a-room-with-a-view": {
      slug: "a-room-with-a-view",
      structuralConvention: "novel chapters with part wrappers",
      startLine: 76,
      endLine: 8754,
      startReason: "Chapter I, The Bertolini, after the contents and part wrapper.",
      endReason: "Final chapter ends before the Project Gutenberg end marker.",
      expectedMinimumSections: 20,
      makeBoundaries: (lines) => chapterRomanBoundaries(lines, 76, 8754),
    },
    "agamemnon-of-aeschylus": {
      slug: "agamemnon-of-aeschylus",
      structuralConvention: "single continuous translated play",
      startLine: 315,
      endLine: 2803,
      startReason: "The play text starts at THE AGAMEMNON after preface and character material.",
      endReason: "The play closes before NOTES TO THE AGAMEMNON.",
      expectedMinimumSections: 1,
      makeBoundaries: () => singleSection(315, "scene", "The Agamemnon"),
    },
    "an-ideal-husband": {
      slug: "an-ideal-husband",
      structuralConvention: "play acts",
      startLine: 145,
      endLine: 4495,
      startReason: "FIRST ACT after cast, scenes, and production credits.",
      endReason: "Fourth act closes before printer and Project Gutenberg material.",
      expectedMinimumSections: 4,
      makeBoundaries: (lines) => wordActBoundaries(lines, 145, 4495),
    },
    catriona: {
      slug: "catriona",
      structuralConvention: "novel chapters with part wrappers",
      startLine: 128,
      endLine: 10580,
      startReason: "Chapter I after title, dedication, and part wrapper.",
      endReason: "Narrative closes before the footnotes and Project Gutenberg footer.",
      expectedMinimumSections: 30,
      makeBoundaries: (lines) => chapterRomanBoundaries(lines, 128, 10580),
    },
    "for-the-duration-of-the-war": {
      slug: "for-the-duration-of-the-war",
      displayTitle: "For the Duration of the War",
      structuralConvention: "single short story excerpt",
      startLine: 66,
      endLine: 251,
      startReason: "Story body begins after collection title, dedication, note, and story title.",
      endReason: "Story closes before the Project Gutenberg end marker and license.",
      expectedMinimumSections: 1,
      makeBoundaries: () => singleSection(66, "chapter", "For the Duration of the War"),
    },
    "romeo-and-juliet": {
      slug: "romeo-and-juliet",
      structuralConvention: "play prologue plus acts",
      startLine: 121,
      endLine: 5300,
      startReason: "The real readable play text begins at THE PROLOGUE after dramatis personae.",
      endReason: "Final couplet and exit end before the Project Gutenberg end marker.",
      expectedMinimumSections: 6,
      makeBoundaries: (lines) => [
        ...singleSection(121, "prologue", "The Prologue"),
        ...romanActBoundaries(lines, 147, 5300),
      ],
    },
    "spoon-river-anthology": {
      slug: "spoon-river-anthology",
      structuralConvention: "poem title headings",
      startLine: 359,
      endLine: 7608,
      startReason: "The Hill is the first poem after the alphabetical contents/index.",
      endReason: "Final poem closes before the Project Gutenberg end marker.",
      expectedMinimumSections: 200,
      makeBoundaries: (lines) => spoonRiverPoemBoundaries(lines, 359, 7608),
    },
    "the-adventures-of-ferdinand-count-fathom": {
      slug: "the-adventures-of-ferdinand-count-fathom",
      structuralConvention: "word-numbered chapters",
      startLine: 502,
      endLine: 15926,
      startReason: "CHAPTER ONE after title pages, dedication, and author address.",
      endReason: "Final chapter ends before the Project Gutenberg end marker; standalone THE END is removed from playback.",
      expectedMinimumSections: 67,
      makeBoundaries: (lines) => fathomChapterBoundaries(lines, 502, 15926),
    },
    "the-adventures-of-roderick-random": {
      slug: "the-adventures-of-roderick-random",
      structuralConvention: "roman-numbered chapters",
      startLine: 297,
      endLine: 17245,
      startReason: "Chapter I after the prefatory address and title.",
      endReason: "Final chapter closes before the Project Gutenberg end marker.",
      expectedMinimumSections: 69,
      makeBoundaries: (lines) => chapterRomanBoundaries(lines, 297, 17245),
    },
    "the-expedition-of-humphry-clinker": {
      slug: "the-expedition-of-humphry-clinker",
      structuralConvention: "epistolary letter headings",
      startLine: 39,
      endLine: 13720,
      startReason: "The first letter/address line is the opening readable framing letter.",
      endReason: "Final letter closes before standalone FINIS and Project Gutenberg material.",
      expectedMinimumSections: 75,
      makeBoundaries: (lines) => humphryLetterBoundaries(lines, 39, 13720),
    },
    "the-importance-of-being-earnest-a-trivial-comedy-for-serious-people": {
      slug: "the-importance-of-being-earnest-a-trivial-comedy-for-serious-people",
      structuralConvention: "play acts",
      startLine: 78,
      endLine: 3914,
      startReason: "FIRST ACT after cast and scene list.",
      endReason: "Third act closes at tableau before the Project Gutenberg end marker.",
      expectedMinimumSections: 3,
      makeBoundaries: (lines) => wordActBoundaries(lines, 78, 3914),
    },
    "the-man-who-was-thursday-a-nightmare": {
      slug: "the-man-who-was-thursday-a-nightmare",
      structuralConvention: "roman-numbered chapters",
      startLine: 144,
      endLine: 6627,
      startReason: "Chapter I after dedication verse.",
      endReason: "Final chapter closes before the Project Gutenberg end marker.",
      expectedMinimumSections: 15,
      makeBoundaries: (lines) => chapterRomanBoundaries(lines, 144, 6627),
    },
    "the-money-box": {
      slug: "the-money-box",
      structuralConvention: "single fairy tale excerpt",
      startLine: 140,
      endLine: 234,
      startReason: "Story prose begins after the collection preface and story title.",
      endReason: "Story closes at the source file ending.",
      expectedMinimumSections: 1,
      makeBoundaries: () => singleSection(140, "chapter", "The Money Box"),
    },
    "the-mystery-of-edwin-drood": {
      slug: "the-mystery-of-edwin-drood",
      structuralConvention: "roman-numbered chapters",
      startLine: 71,
      endLine: 11691,
      startReason: "Chapter I after title and illustration marker.",
      endReason: "Final chapter text ends before the Project Gutenberg end marker.",
      expectedMinimumSections: 23,
      makeBoundaries: (lines) => chapterRomanBoundaries(lines, 71, 11691),
    },
    "the-shunned-house": {
      slug: "the-shunned-house",
      structuralConvention: "single weird fiction story",
      startLine: 53,
      endLine: 1083,
      startReason: "Story prose begins after title, byline, and editorial blurb.",
      endReason: "Story closes before illustration placeholder and transcriber's note.",
      expectedMinimumSections: 1,
      makeBoundaries: () => singleSection(53, "chapter", "The Shunned House"),
    },
    "the-story-of-the-inexperienced-ghost": {
      slug: "the-story-of-the-inexperienced-ghost",
      displayTitle: "The Story of the Inexperienced Ghost",
      structuralConvention: "single short story excerpt",
      startLine: 35,
      endLine: 297,
      startReason: "Story prose begins after Gutenberg header URL and story title.",
      endReason: "Story closes at the source file ending.",
      expectedMinimumSections: 1,
      makeBoundaries: () => singleSection(35, "chapter", "The Story of the Inexperienced Ghost"),
    },
    "the-winning-of-olwen": {
      slug: "the-winning-of-olwen",
      structuralConvention: "single fairy tale excerpt",
      startLine: 49,
      endLine: 605,
      startReason: "Story prose begins after source collection title and story title.",
      endReason: "Story closes at the source file ending.",
      expectedMinimumSections: 1,
      makeBoundaries: () => singleSection(49, "chapter", "The Winning of Olwen"),
    },
    "twenty-thousand-leagues-under-the-sea": {
      slug: "twenty-thousand-leagues-under-the-sea",
      structuralConvention: "novel chapters with part wrappers",
      startLine: 117,
      endLine: 12453,
      startReason: "Body Chapter I after contents, illustration list, and PART ONE wrapper.",
      endReason: "Final chapter closes before the Project Gutenberg end marker.",
      expectedMinimumSections: 46,
      makeBoundaries: (lines) => chapterRomanBoundaries(lines, 117, 12453),
    },
    "with-fire-and-sword": {
      slug: "with-fire-and-sword",
      structuralConvention: "historical introduction plus roman-numbered chapters",
      startLine: 224,
      endLine: 35561,
      startReason: "Readable historical introduction begins after title and translator/source material; Chapter I remains the first default section.",
      endReason: "Narrative closes before pronunciation notes, footnotes, and Project Gutenberg footer.",
      expectedMinimumSections: 64,
      makeBoundaries: (lines) => [
        ...singleSection(224, "introduction", "Opening historical context", false),
        ...chapterRomanBoundaries(lines, 728, 35561),
      ],
    },
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

function buildManifest(
  dryRun: DryRunBook,
  rawText: string,
  sections: DetectedBookSection[],
  contentHash: string,
  cleanupSummary: CleanupSummary,
  warnings: string[],
): GeneratedBookManifest {
  const cleanedCharacterCount = sections.reduce((total, section) => total + section.characterCount, 0);
  const wordCount = sections.reduce((total, section) => total + section.wordCount, 0);
  const included = sections.filter((section) => section.includeByDefault);
  const gutenbergId = extractGutenbergId(rawText);
  const releaseDateRaw = extractHeaderValue(rawText, "Release date");
  const releaseDate = releaseDateRaw?.replace(/\s*\[.*$/, "").trim() ?? null;
  return {
    schemaVersion: 1,
    slug: dryRun.slug,
    title: dryRun.title,
    author: dryRun.author.length > 0 ? dryRun.author : ["Unknown"],
    contentVersion: contentHash.slice(0, 16),
    contentHash,
    language: "en",
    description: "",
    subjects: [],
    source: {
      provider: "Project Gutenberg",
      gutenbergId,
      releaseDate,
      sourceUrl: sourceUrlFor(gutenbergId),
      rawTextUrl: null,
      rightsBasis: "public-domain-us",
      rightsReviewed: true,
      publishReady: true,
      rightsStatus: "approved",
      processingAllowed: true,
      approvalSource: "external-authority",
      duplicateResolutionSource: "not-needed",
      rightsReportPath: "rights_report.json",
      processedBookPath: "processed_book.json",
      cleanedBookPath: "cleaned_book.json",
      rightsNotes:
        "Pilot write pass 6 processed this source from the audited Project Gutenberg text. Review generated output before any Cloudflare export.",
    },
    cover: {
      src: null,
      placeholder: true,
      alt: `Placeholder cover for ${dryRun.title}`,
    },
    stats: {
      originalCharacterCount: rawText.length,
      cleanedCharacterCount,
      wordCount,
      sectionCount: sections.length,
      includedSectionCount: included.length,
    },
    defaults: {
      includeKinds: includeKindsFor(sections),
      preferredPreset: "main-narrative",
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
      "Generated by controlled pilot write pass 6; review before scaling to larger batches or Cloudflare export.",
      ...(cleanupSummary.imagePlaceholderLinesRemoved > 0
        ? ["Illustration/image placeholder lines removed from playable text."]
        : []),
      ...(cleanupSummary.sourceHeadingLinesRemoved > 0
        ? ["Source heading lines retained as section metadata and removed from playable text."]
        : []),
      ...(cleanupSummary.standaloneFinisLinesRemoved > 0
        ? ["Standalone end marker removed from playable text."]
        : []),
      ...warnings,
    ],
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
      estimatedTypingMinutes: sections.reduce((total, section) => total + estimateTypingMinutes(section.wordCount), 0),
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

function buildRightsReport(
  manifest: GeneratedBookManifest,
  rawText: string,
): BookRightsReport {
  const author = manifest.author.join(", ");
  const gutenbergId = manifest.source.gutenbergId ?? "";
  return {
    schemaVersion: 1,
    title: manifest.title,
    author,
    author_death_year: null,
    language: "English",
    original_publication: "",
    release_date: manifest.source.releaseDate ?? "",
    last_updated: "",
    source: manifest.source.provider,
    gutenberg_ebook_number: gutenbergId,
    source_url: manifest.source.sourceUrl,
    raw_text_url: manifest.source.rawTextUrl,
    gutenberg_header_present: /Project Gutenberg/i.test(rawText),
    project_gutenberg_license_present: /PROJECT GUTENBERG(?:\u2122|TM)? LICENSE/i.test(rawText),
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
    contains_illustrations_or_image_references: /\[(?:Illustration|Image|Plate)/i.test(rawText),
    contains_later_copyright_notice: /copyright/i.test(rawText),
    contains_creative_commons_license: /creative commons/i.test(rawText),
    contains_permission_based_language: /permission/i.test(rawText),
    is_translation: false,
    translation_risk: "low",
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
      "Controlled pilot write pass 6 used audited Project Gutenberg public-domain source text after dry-run review. Generated output remains review-gated before any Cloudflare export.",
    evidence_snippets: [
      manifest.source.sourceUrl
        ? `Project Gutenberg source URL: ${manifest.source.sourceUrl}`
        : "Project Gutenberg source URL was not detected in the source header.",
      "No unresolved-source generated book was processed in this pass.",
    ],
    processing_allowed: true,
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

function snapshotFromSection(section: DetectedBookSection | null): SectionSnapshot {
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

function firstDefaultSnapshot(sections: DetectedBookSection[]): SectionSnapshot {
  return snapshotFromSection(sections.find((section) => section.includeByDefault) ?? sections[0] ?? null);
}

function sectionSummary(sections: DetectedBookSection[]) {
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
  const existingOrder = library.books.map((book) => book.slug);
  const appended = manifests.map((manifest) => manifest.slug).filter((slug) => !existingOrder.includes(slug));
  const orderedSlugs = [...existingOrder, ...appended];
  writeJson(libraryManifestPath, {
    schemaVersion: 1,
    books: orderedSlugs.map((slug) => bySlug.get(slug)).filter(Boolean),
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
    missing: Array<string | { slug: string; reason: string }>;
  }>(previewManifestPath);
  const bySlug = new Map(manifest.books.map((book) => [book.slug, book]));
  const existingOrder = manifest.books.map((book) => book.slug);
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
  const appended = entries.map((entry) => entry.slug).filter((slug) => !existingOrder.includes(slug));
  const orderedSlugs = [...existingOrder, ...appended];
  const entrySlugSet = new Set(entries.map((entry) => entry.slug));
  writeJson(previewManifestPath, {
    ...manifest,
    books: orderedSlugs.map((slug) => bySlug.get(slug)).filter(Boolean),
    missing: manifest.missing.filter((item) => {
      const slug = typeof item === "string" ? item : item.slug;
      return !entrySlugSet.has(slug);
    }),
  });
}

function makeProcessingNotes(report: BookReport): string {
  return `# ${report.slug}

Processed by pilot write pass 6.

- Source: ${report.sourceFileUsed}
- Start boundary: line ${report.startBoundaryUsed.line} (${report.startBoundaryUsed.reason})
- End boundary: line ${report.endBoundaryUsed.line} (${report.endBoundaryUsed.reason})
- Structural convention: ${report.structuralConvention}
- Sections after processing: ${report.sectionCount}
- Final recommendation: ${report.finalRecommendation}

This output is intentionally review-gated before larger batch processing or Cloudflare export.
`;
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

function processSelectedBook(dryRun: DryRunBook, plan: ProcessingPlan): {
  report: BookReport;
  manifest: GeneratedBookManifest | null;
  previewEntry: {
    slug: string;
    contentVersion: string;
    contentHash: string;
    defaultSectionId: string;
    previewBytes: number;
    previewCharacterCount: number;
    estimatedRuntimeSeconds: number;
    truncated: boolean;
  } | null;
} {
  const sourcePath = path.resolve(repoRoot, dryRun.sourceFileUsed);
  assertInside(tempBooksRoot, sourcePath);
  const perBookMarkdownPath = path.join(dryRunRoot, "books", `${dryRun.slug}.md`);
  if (!fs.existsSync(perBookMarkdownPath)) {
    throw new Error(`${dryRun.slug}: per-book dry-run report missing.`);
  }
  fs.readFileSync(perBookMarkdownPath, "utf8");
  const rawText = fs.readFileSync(sourcePath, "utf8");
  const lines = lineRecords(rawText);
  const cleanupSummary = emptyCleanupSummary();
  const warnings = [...dryRun.warnings];

  if (dryRun.currentStatus !== "needs first-time controlled processing" || dryRun.candidateType !== "raw-only") {
    return {
      report: makeSkippedReport(dryRun, plan, "Dry-run entry is not a raw-only first-time processing candidate."),
      manifest: null,
      previewEntry: null,
    };
  }

  const boundaries = plan.makeBoundaries(lines);
  if (boundaries.length < plan.expectedMinimumSections) {
    return {
      report: makeSkippedReport(
        dryRun,
        plan,
        `Only ${boundaries.length} boundaries were detected; expected at least ${plan.expectedMinimumSections}.`,
      ),
      manifest: null,
      previewEntry: null,
    };
  }

  const sections = makeDetectedSections(dryRun.slug, rawText, lines, boundaries, plan.endLine, cleanupSummary);
  const defaultSections = sections.filter((section) => section.includeByDefault);
  const firstDefault = defaultSections[0];
  if (!firstDefault || previewLooksUnsafe(firstDefault.text)) {
    return {
      report: makeSkippedReport(dryRun, plan, "First default section did not pass readable-content safety checks."),
      manifest: null,
      previewEntry: null,
    };
  }

  if (sections.some((section) => section.includeByDefault && sourceLooksUnsafe(section.text))) {
    return {
      report: makeSkippedReport(dryRun, plan, "Default playable sections still include Gutenberg/source/transcriber material."),
      manifest: null,
      previewEntry: null,
    };
  }

  if (cleanupSummary.numberedReferencesRemoved > 0) warnings.push("Inline bracketed footnote references were removed from playable text.");
  if (cleanupSummary.imagePlaceholderLinesRemoved > 0) warnings.push("Illustration/image placeholders were removed from playable text.");
  if (cleanupSummary.standaloneFinisLinesRemoved > 0) warnings.push("Standalone terminal end marker was removed from playable text.");

  const displayTitle = plan.displayTitle ?? dryRun.title;
  const displayDryRun =
    displayTitle === dryRun.title ? dryRun : { ...dryRun, title: displayTitle };
  const contentHash = buildContentHash(
    displayDryRun.slug,
    displayDryRun.title,
    displayDryRun.author,
    sections,
  );
  const manifest = buildManifest(
    displayDryRun,
    rawText,
    sections,
    contentHash,
    cleanupSummary,
    warnings,
  );
  const sectionJson = sections.map((section) => makeSectionJson(manifest.slug, section));
  const cleanedBook = buildCleanedBook(manifest, sections);
  const processedBook = buildProcessedBook(manifest, sections);
  const rightsReport = buildRightsReport(manifest, rawText);
  const preview = makePreviewAsset(manifest, sections);
  if (previewLooksUnsafe(preview.asset.previewText)) {
    return {
      report: makeSkippedReport(dryRun, plan, "Generated preview did not pass readable-content safety checks."),
      manifest: null,
      previewEntry: null,
    };
  }

  const report: BookReport = {
    slug: dryRun.slug,
    dryRunStatus: dryRun.currentStatus,
    finalAction: "first-time processed",
    sourceFileUsed: dryRun.sourceFileUsed,
    inspections: {
      dryRunJsonInspected: true,
      dryRunMarkdownInspected: true,
      rawSourceInspected: true,
    },
    generatedFilesChanged: [],
    previewAssetChanged: null,
    priorIssueFromDryRun: dryRun.warnings,
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
    firstDefaultSectionAfterProcessing: firstDefaultSnapshot(sections),
    sectionCount: sections.length,
    first5SectionsWithWordCounts: sectionSummary(sections).slice(0, 5),
    last5SectionsWithWordCounts: sectionSummary(sections).slice(-5),
    cleanupActionsApplied: cleanupSummary,
    previewVerdict: `valid book-specific preview from ${preview.sourceSections.join(", ")}`,
    startupPreviewValid: true,
    allMainReadableDefaultVerdict:
      defaultSections.length > 0 && defaultSections.every((section) => section.includeByDefault)
        ? "all main readable body sections included by default"
        : "default section selection requires review",
    remainingWarnings: warnings,
    finalRecommendation: "accepted for review",
  };

  const generatedFilesChanged = writeGeneratedOutput(
    manifest,
    sectionJson,
    cleanedBook,
    processedBook,
    rightsReport,
    makeProcessingNotes(report),
  );
  const previewPath = path.join(previewRoot, `${manifest.slug}.preview.json`);
  writeJson(previewPath, preview.asset);
  report.generatedFilesChanged = generatedFilesChanged;
  report.previewAssetChanged = statusPath(previewPath);

  return {
    report,
    manifest,
    previewEntry: {
      slug: manifest.slug,
      contentVersion: manifest.contentVersion,
      contentHash: manifest.contentHash,
      defaultSectionId: preview.asset.defaultSectionId,
      previewBytes: Buffer.byteLength(`${JSON.stringify(preview.asset, null, 2)}\n`, "utf8"),
      previewCharacterCount: preview.asset.characterCount,
      estimatedRuntimeSeconds: preview.asset.estimatedRuntimeSeconds,
      truncated: preview.asset.truncated,
    },
  };
}

function makeSkippedReport(dryRun: DryRunBook, plan: ProcessingPlan, reason: string): BookReport {
  return {
    slug: dryRun.slug,
    dryRunStatus: dryRun.currentStatus,
    finalAction: "skipped",
    sourceFileUsed: dryRun.sourceFileUsed,
    inspections: {
      dryRunJsonInspected: true,
      dryRunMarkdownInspected: fs.existsSync(path.join(dryRunRoot, "books", `${dryRun.slug}.md`)),
      rawSourceInspected: fs.existsSync(path.resolve(repoRoot, dryRun.sourceFileUsed)),
    },
    generatedFilesChanged: [],
    previewAssetChanged: null,
    priorIssueFromDryRun: dryRun.warnings,
    startBoundaryUsed: {
      line: plan.startLine,
      reason: plan.startReason,
      snippet: null,
    },
    endBoundaryUsed: {
      line: plan.endLine,
      reason: plan.endReason,
      snippet: null,
    },
    structuralConvention: plan.structuralConvention,
    firstDefaultSectionAfterProcessing: {
      id: null,
      label: null,
      title: null,
      kind: null,
      includeByDefault: null,
      wordCount: null,
      snippet: null,
    },
    sectionCount: 0,
    first5SectionsWithWordCounts: [],
    last5SectionsWithWordCounts: [],
    cleanupActionsApplied: null,
    previewVerdict: "not generated",
    startupPreviewValid: false,
    allMainReadableDefaultVerdict: "not generated",
    remainingWarnings: [...dryRun.warnings, reason],
    finalRecommendation: "skipped",
  };
}

function writeMarkdownReport(report: {
  generatedAt: string;
  totals: Record<string, number>;
  selectedBooks: string[];
  unresolvedSourceGeneratedBooks: DryRunReport["unresolvedSourceGeneratedBooks"];
  books: BookReport[];
}) {
  const lines = [
    "# Pilot write batch 6",
    "",
    "Controlled first-time processing pass for the exact raw-only books selected by pilot dry-run batch 6.",
    "",
    "## Totals",
    "",
    `- Selected: ${report.totals.selected}`,
    `- First-time processed: ${report.totals.firstTimeProcessed}`,
    `- Skipped: ${report.totals.skipped}`,
    "",
    "## Unresolved-source generated books left untouched",
    "",
    ...report.unresolvedSourceGeneratedBooks.map((book) => `- ${book.slug}: ${book.reason}`),
    "",
    "## Books",
    "",
    ...report.books.flatMap((book) => [
      `### ${book.slug}`,
      "",
      `- Dry-run status: ${book.dryRunStatus}`,
      `- Final action: ${book.finalAction}`,
      `- Source: ${book.sourceFileUsed}`,
      `- Structure: ${book.structuralConvention}`,
      `- Start boundary: line ${book.startBoundaryUsed.line ?? "n/a"} - ${book.startBoundaryUsed.reason}`,
      `- End boundary: line ${book.endBoundaryUsed.line ?? "n/a"} - ${book.endBoundaryUsed.reason}`,
      `- First default section after: ${book.firstDefaultSectionAfterProcessing.label ?? "n/a"} (${book.firstDefaultSectionAfterProcessing.wordCount ?? "n/a"} words)`,
      `- Section count: ${book.sectionCount}`,
      `- Preview verdict: ${book.previewVerdict}`,
      `- Startup preview valid: ${book.startupPreviewValid ? "yes" : "no"}`,
      `- All-main-readable-default verdict: ${book.allMainReadableDefaultVerdict}`,
      `- Final recommendation: ${book.finalRecommendation}`,
      book.remainingWarnings.length > 0
        ? `- Remaining warnings: ${book.remainingWarnings.join("; ")}`
        : "- Remaining warnings: none",
      "",
      "First 5 sections:",
      "",
      ...book.first5SectionsWithWordCounts.map(
        (section) => `- ${section.id}: ${section.label}${section.title ? ` - ${section.title}` : ""} (${section.wordCount} words)`,
      ),
      "",
      "Last 5 sections:",
      "",
      ...book.last5SectionsWithWordCounts.map(
        (section) => `- ${section.id}: ${section.label}${section.title ? ` - ${section.title}` : ""} (${section.wordCount} words)`,
      ),
      "",
      "Supporting snippets:",
      "",
      `- Start: ${book.startBoundaryUsed.snippet ?? "n/a"}`,
      `- End: ${book.endBoundaryUsed.snippet ?? "n/a"}`,
      "",
    ]),
    "## Future-batch rule",
    "",
    ...FUTURE_BATCH_RULE.map((rule) => `- ${rule}`),
    "",
    "## Later-phase requirements",
    "",
    ...LATER_PHASE_REQUIREMENTS.map((rule) => `- ${rule}`),
    "",
  ];
  writeText(path.join(writeReportRoot, "pilot-write-6.md"), `${lines.join("\n").trimEnd()}\n`);
}

function main() {
  const dryRun = readJson<DryRunReport>(dryRunReportPath);
  const selectedFromReport = dryRun.books
    .filter(
      (book) =>
        book.candidateType === "raw-only" &&
        book.currentStatus === "needs first-time controlled processing",
    )
    .map((book) => book.slug);
  if (JSON.stringify(selectedFromReport) !== JSON.stringify([...SELECTED_BATCH])) {
    throw new Error(`Dry-run selected list mismatch: ${selectedFromReport.join(", ")}`);
  }
  for (const slug of UNRESOLVED_SOURCE_GENERATED_BOOKS) {
    if (!dryRun.unresolvedSourceGeneratedBooks.some((book) => book.slug === slug)) {
      throw new Error(`Dry-run unresolved-source list is missing ${slug}.`);
    }
  }

  const plans = makeProcessingPlans();
  const reports: BookReport[] = [];
  const manifests: GeneratedBookManifest[] = [];
  const previewEntries: NonNullable<ReturnType<typeof processSelectedBook>["previewEntry"]>[] = [];

  for (const slug of SELECTED_BATCH) {
    const dryRunBook = dryRun.books.find((book) => book.slug === slug);
    const plan = plans[slug];
    if (!dryRunBook || !plan) throw new Error(`${slug}: dry-run book or processing plan missing.`);
    const result = processSelectedBook(dryRunBook, plan);
    reports.push(result.report);
    if (result.manifest) manifests.push(result.manifest);
    if (result.previewEntry) previewEntries.push(result.previewEntry);
  }

  if (manifests.length > 0) updateLibraryManifest(manifests);
  if (previewEntries.length > 0) updatePreviewManifest(previewEntries);

  const processed = reports.filter((book) => book.finalAction === "first-time processed");
  const skipped = reports.filter((book) => book.finalAction === "skipped");
  const generatedAt = new Date().toISOString();
  const jsonReport = {
    schemaVersion: 1,
    reportName: "pilot-write-6",
    generatedAt,
    branch: "morsewords-book-processing-pilot-write-6-jun-2026",
    mode: "controlled first-time processing",
    selectedBooks: [...SELECTED_BATCH],
    totals: {
      selected: SELECTED_BATCH.length,
      firstTimeProcessed: processed.length,
      skipped: skipped.length,
      unresolvedSourceGeneratedBooksLeftUntouched: dryRun.unresolvedSourceGeneratedBooks.length,
    },
    unresolvedSourceGeneratedBooksLeftUntouched: dryRun.unresolvedSourceGeneratedBooks,
    futureBatchRule: FUTURE_BATCH_RULE,
    laterPhaseRequirements: LATER_PHASE_REQUIREMENTS,
    books: reports,
  };

  writeJson(path.join(writeReportRoot, "pilot-write-6.json"), jsonReport);
  writeMarkdownReport({
    generatedAt,
    totals: jsonReport.totals,
    selectedBooks: [...SELECTED_BATCH],
    unresolvedSourceGeneratedBooks: dryRun.unresolvedSourceGeneratedBooks,
    books: reports,
  });

  console.log(
    `Pilot write 6 complete: ${processed.length} first-time processed, ${skipped.length} skipped, ${dryRun.unresolvedSourceGeneratedBooks.length} unresolved-source generated books untouched.`,
  );
}

main();
