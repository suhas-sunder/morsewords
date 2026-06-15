import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
  analyzeBookStructure,
  buildDetectedSectionsFromStructure,
  type BookStructureAnalysis,
} from "./lib/book-structure-detection.ts";
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
  finalDryRunRecommendation: string;
  comparisonAgainstExistingGeneratedOutput: ExistingGeneratedComparison;
  firstHourPreviewCandidate?: {
    sectionsUsed?: string[];
    approximateWordCount?: number;
    startsAtRealReadableContent?: boolean;
    confidence?: string;
  };
  candidateStartLine: number;
  candidateEndLine: number;
  candidateStartIndex: number;
  candidateEndIndex: number;
  candidateStartHeadingOrSnippet: string;
  candidateEndHeadingOrSnippet: string;
  structureDetection: {
    detectedStructuralConvention: string;
    selectedHeadingStrategy: { patternId: string; bodyLikeCount: number } | null;
    bodyHeadingsDetected: boolean;
    tocEntriesDetected: boolean;
    fallbackUsed: boolean;
    status: "pass" | "warn" | "fail";
    warnings: string[];
  };
};

type PilotBoundary = {
  startLine: number;
  endLine: number;
  segments?: LineSegment[];
  includeKinds: BookSectionKind[];
  startReason: string;
  endReason: string;
};

type LineSegment = {
  startLine: number;
  endLine: number;
  reason: string;
};

type BoundaryOverride = {
  startLine?: number;
  endLine?: number;
  segments?: LineSegment[];
  includeKinds?: BookSectionKind[];
  startReason?: string;
  endReason?: string;
};

type ExistingGeneratedComparison = {
  exists: boolean;
  manifestPath: string | null;
  sectionCount: number;
  includedSectionCount: number;
  firstSectionPreview: string | null;
  lastSectionPreview: string | null;
  suspiciousShortSections: Array<{ id: string; label: string; wordCount: number }>;
  suspiciousLongSections: Array<{ id: string; label: string; wordCount: number }>;
  apparentDamage: string[];
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
  comparisonAgainstPriorGeneratedOutput: ExistingGeneratedComparison;
  selectedStructuralConvention: string;
  structureDetectionStatus: string;
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
  "pilot-write-3",
);
const previewRoot = path.join(repoRoot, "public", "book-previews");
const dryRunReportPath = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "pilot-dry-run-3",
  "pilot-dry-run-3.json",
);
const structureAuditReportPath = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "book-structure-audit-1",
  "book-structure-audit-1.json",
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
  "frankenstein",
  "the-three-musketeers",
  "a-tale-of-two-cities",
  "around-the-world-in-eighty-days",
  "cranford",
  "little-fuzzy",
  "macbeth",
  "persuasion",
  "pygmalion",
  "sense-and-sensibility",
  "the-adventures-of-tom-sawyer",
  "the-door-in-the-wall",
  "the-hound-of-the-baskervilles",
  "the-king-in-yellow",
  "the-life-and-adventures-of-robinson-crusoe",
  "the-maltese-falcon",
  "the-tempest",
  "the-turn-of-the-screw",
  "the-war-of-the-worlds",
  "the-wendigo",
  "wuthering-heights",
  "anne-of-avonlea",
  "five-weeks-in-a-balloon",
  "moby-dick",
  "tales-of-war",
] as const;

const individualReviewSlugs = new Set([
  "a-christmas-carol",
  "dr-jekyll-and-mr-hyde",
  "a-catastrophe",
  "new-text-document",
  "screenshot-2026-06-13-014010",
]);

const extraReviewSlugs = new Set([
  "frankenstein",
  "the-three-musketeers",
  "around-the-world-in-eighty-days",
  "sense-and-sensibility",
  "macbeth",
  "pygmalion",
  "the-tempest",
  "the-king-in-yellow",
  "the-door-in-the-wall",
  "tales-of-war",
  "moby-dick",
  "the-life-and-adventures-of-robinson-crusoe",
  "wuthering-heights",
  "the-maltese-falcon",
  "the-turn-of-the-screw",
  "the-wendigo",
]);

const originalPublicationYears: Record<string, number> = {
  frankenstein: 1818,
  "the-three-musketeers": 1844,
  "a-tale-of-two-cities": 1859,
  "around-the-world-in-eighty-days": 1872,
  cranford: 1853,
  "little-fuzzy": 1962,
  macbeth: 1623,
  persuasion: 1817,
  pygmalion: 1912,
  "sense-and-sensibility": 1811,
  "the-adventures-of-tom-sawyer": 1876,
  "the-door-in-the-wall": 1911,
  "the-hound-of-the-baskervilles": 1902,
  "the-king-in-yellow": 1895,
  "the-life-and-adventures-of-robinson-crusoe": 1719,
  "the-maltese-falcon": 1930,
  "the-tempest": 1623,
  "the-turn-of-the-screw": 1898,
  "the-war-of-the-worlds": 1898,
  "the-wendigo": 1910,
  "wuthering-heights": 1847,
  "anne-of-avonlea": 1909,
  "five-weeks-in-a-balloon": 1869,
  "moby-dick": 1851,
  "tales-of-war": 1918,
};

const authorDeathYears: Record<string, number> = {
  frankenstein: 1851,
  "the-three-musketeers": 1870,
  "a-tale-of-two-cities": 1870,
  "around-the-world-in-eighty-days": 1905,
  cranford: 1865,
  "little-fuzzy": 1964,
  macbeth: 1616,
  persuasion: 1817,
  pygmalion: 1950,
  "sense-and-sensibility": 1817,
  "the-adventures-of-tom-sawyer": 1910,
  "the-door-in-the-wall": 1946,
  "the-hound-of-the-baskervilles": 1930,
  "the-king-in-yellow": 1933,
  "the-life-and-adventures-of-robinson-crusoe": 1731,
  "the-maltese-falcon": 1961,
  "the-tempest": 1616,
  "the-turn-of-the-screw": 1916,
  "the-war-of-the-worlds": 1946,
  "the-wendigo": 1951,
  "wuthering-heights": 1848,
  "anne-of-avonlea": 1942,
  "five-weeks-in-a-balloon": 1905,
  "moby-dick": 1891,
  "tales-of-war": 1957,
};

const titleOverrides: Record<string, string> = {
  frankenstein: "Frankenstein; or, the Modern Prometheus",
  "the-three-musketeers": "The Three Musketeers",
  "a-tale-of-two-cities": "A Tale of Two Cities",
  "around-the-world-in-eighty-days": "Around the World in Eighty Days",
  cranford: "Cranford",
  "little-fuzzy": "Little Fuzzy",
  macbeth: "Macbeth",
  persuasion: "Persuasion",
  pygmalion: "Pygmalion",
  "sense-and-sensibility": "Sense and Sensibility",
  "the-adventures-of-tom-sawyer": "The Adventures of Tom Sawyer",
  "the-door-in-the-wall": "The Door in the Wall",
  "the-hound-of-the-baskervilles": "The Hound of the Baskervilles",
  "the-king-in-yellow": "The King in Yellow",
  "the-life-and-adventures-of-robinson-crusoe": "The Life and Adventures of Robinson Crusoe",
  "the-maltese-falcon": "The Maltese Falcon",
  "the-tempest": "The Tempest",
  "the-turn-of-the-screw": "The Turn of the Screw",
  "the-war-of-the-worlds": "The War of the Worlds",
  "the-wendigo": "The Wendigo",
  "wuthering-heights": "Wuthering Heights",
  "anne-of-avonlea": "Anne of Avonlea",
  "five-weeks-in-a-balloon": "Five Weeks in a Balloon",
  "moby-dick": "Moby-Dick; or, The Whale",
  "tales-of-war": "Tales of War",
};

const priorGeneratedWarningSlugs = new Set([
  "frankenstein",
  "the-three-musketeers",
  "around-the-world-in-eighty-days",
  "sense-and-sensibility",
]);

const boundaryOverrides: Record<string, BoundaryOverride> = {
  frankenstein: {
    startLine: 71,
    includeKinds: ["letter", "chapter"],
    startReason:
      "Batch-3 pre-write review moved the start from Chapter 1 to Letter 1 so the real framing letters remain default readable content.",
  },
  "the-three-musketeers": {
    startLine: 112,
    startReason:
      "Batch-3 pre-write review preserved the real Author's Preface while still excluding the preceding table of contents.",
  },
  "a-tale-of-two-cities": {
    startLine: 100,
    startReason:
      "Batch-3 pre-write review moved the start out of the table of contents to the first real book division.",
  },
  "little-fuzzy": {
    startLine: 47,
    endLine: 6925,
    startReason:
      "Batch-3 pre-write review restored the standalone Roman I heading so section 1 is selected by default.",
    endReason:
      "Batch-3 pre-write review stopped before decorative separator and transcriber's note.",
  },
  macbeth: {
    startLine: 86,
    startReason:
      "Batch-3 pre-write review skipped the contents scene list and preserved Dramatis Personae as non-default opening matter before Act I.",
  },
  "the-adventures-of-tom-sawyer": {
    startLine: 465,
    startReason:
      "Batch-3 pre-write review preserved Mark Twain's real preface while excluding illustration/contents material.",
  },
  "the-door-in-the-wall": {
    startLine: 18,
    startReason:
      "Batch-3 pre-write review restored the standalone Roman I heading before the opening prose.",
  },
  "the-hound-of-the-baskervilles": {
    segments: [
      {
        startLine: 42,
        endLine: 58,
        reason: "preserve Conan Doyle's dedication note",
      },
      {
        startLine: 84,
        endLine: 7379,
        reason: "main body chapters after contents",
      },
    ],
    startReason:
      "Batch-3 pre-write review preserved the dedication note and omitted the table of contents before Chapter 1.",
  },
  "the-king-in-yellow": {
    segments: [
      {
        startLine: 42,
        endLine: 45,
        reason: "preserve dedication",
      },
      {
        startLine: 76,
        endLine: 8823,
        reason: "collection epigraph and story bodies after contents",
      },
    ],
    includeKinds: ["chapter"],
    startReason:
      "Batch-3 pre-write review preserved the dedication and collection epigraph while omitting contents.",
  },
  "the-maltese-falcon": {
    startLine: 66,
    endLine: 8831,
    includeKinds: ["chapter"],
    startReason:
      "Batch-3 pre-write review skipped cover, copyright, and publisher matter while preserving the dedication before section 1.",
    endReason:
      "Batch-3 pre-write review stopped at THE END and excluded transcriber notes.",
  },
  "the-tempest": {
    startLine: 90,
    endLine: 3841,
    startReason:
      "Batch-3 pre-write review preserved Dramatis Personae as non-default opening matter and started before Act I.",
    endReason:
      "Batch-3 pre-write review stopped after Prospero's epilogue and excluded editorial notes/endnotes.",
  },
  "the-turn-of-the-screw": {
    startLine: 70,
    startReason:
      "Batch-3 pre-write review restored the real narrative prologue before the Roman-numbered chapters.",
  },
  "the-wendigo": {
    startLine: 39,
    startReason:
      "Batch-3 pre-write review restored the standalone Roman I heading before the opening prose.",
  },
  "anne-of-avonlea": {
    segments: [
      {
        startLine: 40,
        endLine: 53,
        reason: "preserve dedication and opening Whittier epigraph",
      },
      {
        startLine: 92,
        endLine: 9780,
        reason: "main Roman-numbered chapters after contents",
      },
    ],
    startReason:
      "Batch-3 pre-write review preserved dedication/epigraph while omitting the table of contents.",
  },
  "five-weeks-in-a-balloon": {
    segments: [
      {
        startLine: 105,
        endLine: 121,
        reason: "preserve publisher's note",
      },
      {
        startLine: 417,
        endLine: 12185,
        reason: "main body after detailed contents",
      },
    ],
    startReason:
      "Batch-3 pre-write review preserved the publisher's note and omitted the detailed contents block.",
  },
  "moby-dick": {
    startLine: 336,
    startReason:
      "Batch-3 pre-write review preserved Etymology and Extracts while omitting the large table of contents.",
  },
  "tales-of-war": {
    startLine: 49,
    endLine: 2820,
    startReason:
      "Batch-3 pre-write review restored the first story title before the opening prose.",
  },
  cranford: {
    endLine: 6718,
    endReason:
      "Batch-3 pre-write review stopped before decorative printer imprint.",
  },
};

const customSectioningSlugs = new Set([
  "frankenstein",
  "the-king-in-yellow",
  "the-maltese-falcon",
  "the-turn-of-the-screw",
  "the-tempest",
  "anne-of-avonlea",
  "five-weeks-in-a-balloon",
]);

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
    const text = lines[index - 1] ?? "";
    result.push(text ? `L${index}: ${textPreview(text, 180)}` : `L${index}: [blank]`);
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
  const segments = boundary.segments ?? [
    {
      startLine: boundary.startLine,
      endLine: boundary.endLine,
      reason: "contiguous dry-run boundary",
    },
  ];
  if (boundary.startLine < 1 || boundary.endLine > lines.length) {
    throw new Error(
      `Boundary ${boundary.startLine}-${boundary.endLine} is outside ${lines.length} source lines.`,
    );
  }
  if (boundary.endLine < boundary.startLine) {
    throw new Error(`End boundary is before start boundary.`);
  }
  for (const segment of segments) {
    if (segment.startLine < 1 || segment.endLine > lines.length || segment.endLine < segment.startLine) {
      throw new Error(
        `Segment ${segment.startLine}-${segment.endLine} is outside ${lines.length} source lines.`,
      );
    }
  }

  const sortedSegments = [...segments].sort((left, right) => left.startLine - right.startLine);
  for (let index = 1; index < sortedSegments.length; index += 1) {
    if (sortedSegments[index]!.startLine <= sortedSegments[index - 1]!.endLine) {
      throw new Error("Pilot write segments must be non-overlapping and ordered.");
    }
  }

  const removedBeforeAndBetween: string[] = [];
  let cursor = 1;
  for (const segment of sortedSegments) {
    if (segment.startLine > cursor) {
      removedBeforeAndBetween.push(lines.slice(cursor - 1, segment.startLine - 1).join("\n"));
    }
    cursor = segment.endLine + 1;
  }

  const frontMatterText = removedBeforeAndBetween.join("\n");
  const endMatterText = lines.slice(boundary.endLine).join("\n");
  const bodyText = sortedSegments
    .map((segment) => lines.slice(segment.startLine - 1, segment.endLine).join("\n"))
    .join("\n\n");

  return {
    lines,
    bodyText,
    frontMatterText,
    endMatterText,
  };
}

function sortedBoundarySegments(boundary: PilotBoundary): LineSegment[] {
  return [
    ...(boundary.segments ?? [
      {
        startLine: boundary.startLine,
        endLine: boundary.endLine,
        reason: "contiguous selected body range",
      },
    ]),
  ].sort((left, right) => left.startLine - right.startLine);
}

function formatLineRange(startLine: number, endLine: number): string {
  return startLine === endLine ? `${startLine}` : `${startLine}-${endLine}`;
}

function keptLineRangeSummary(boundary: PilotBoundary): string {
  return sortedBoundarySegments(boundary)
    .map((segment) => `${formatLineRange(segment.startLine, segment.endLine)} (${segment.reason})`)
    .join("; ");
}

function removedFrontLineRangeSummary(boundary: PilotBoundary): string {
  const ranges: string[] = [];
  let cursor = 1;
  for (const segment of sortedBoundarySegments(boundary)) {
    if (segment.startLine > cursor) {
      ranges.push(formatLineRange(cursor, segment.startLine - 1));
    }
    cursor = segment.endLine + 1;
  }
  return ranges.length > 0 ? ranges.join(", ") : "none";
}

function removedEndLineRangeSummary(boundary: PilotBoundary, totalLines: number): string {
  return boundary.endLine < totalLines ? formatLineRange(boundary.endLine + 1, totalLines) : "none";
}

function boundaryFromDryRun(dryRun: DryRunBook): PilotBoundary {
  const override = boundaryOverrides[dryRun.slug];
  const startLine = override?.startLine ?? override?.segments?.[0]?.startLine ?? dryRun.candidateStartLine;
  const endLine =
    override?.endLine ??
    override?.segments?.[override.segments.length - 1]?.endLine ??
    dryRun.candidateEndLine;
  return {
    startLine,
    endLine,
    segments: override?.segments,
    includeKinds:
      override?.includeKinds ??
      includeKindsForStructure(dryRun.structureDetection.detectedStructuralConvention),
    startReason:
      override?.startReason ??
      `Dry-run 3 selected this as the first real readable line: ${dryRun.candidateStartHeadingOrSnippet}`,
    endReason:
      override?.endReason ??
      `Dry-run 3 selected this as the final real readable line before end/source matter: ${dryRun.candidateEndHeadingOrSnippet}`,
  };
}

function includeKindsForStructure(convention: string): BookSectionKind[] {
  if (/play acts|scene/i.test(convention)) return ["part", "scene"];
  if (/stave|canto|verse|poem/i.test(convention)) return ["poem", "chapter"];
  if (/letter|diary|journal|dated/i.test(convention)) return ["letter", "chapter"];
  if (/book divisions|part divisions|volume divisions/i.test(convention) && !/chapter/i.test(convention)) {
    return ["book", "part"];
  }
  return ["chapter"];
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
  const title = titleOverrides[dryRun.slug] ?? dryRun.candidateTitle;
  const gutenbergId = extractGutenbergId(rawText);
  const releaseDateRaw = extractHeaderValue(rawText, "Release date");
  const releaseDate = releaseDateRaw?.replace(/\s*\[.*$/, "").trim() ?? null;
  return {
    schemaVersion: 1,
    slug: dryRun.slug,
    metadataStatus: "reviewed",
    manualReviewRequired: dryRun.pass2RiskLevel !== "low",
    title,
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
        "Pilot write pass 3 processed this source from the audited Project Gutenberg text using the shared structure detector. Review generated output before scaling the processor.",
    },
    cover: {
      src: null,
      placeholder: true,
      alt: `Placeholder cover for ${title}`,
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

function polishSectionDisplayText(input: string): string {
  return input.replace(/'S\b/g, "'s");
}

function enrichSections(sections: DetectedBookSection[]): DetectedBookSection[] {
  return sections.map((section, index) => {
    const title = inferSectionTitle(section);
    return {
      ...section,
      label: polishSectionDisplayText(section.label),
      title: title ? polishSectionDisplayText(title) : title,
      order: index + 1,
    };
  });
}

function mergeSectionText(
  base: DetectedBookSection,
  extra: DetectedBookSection,
  direction: "append" | "prepend",
): DetectedBookSection {
  const mergedText = trimBookText(
    direction === "append"
      ? `${base.text}\n\n${extra.text}`
      : `${extra.text}\n\n${base.text}`,
  );
  return {
    ...base,
    sourceStartOffset: Math.min(base.sourceStartOffset, extra.sourceStartOffset),
    sourceEndOffset: Math.max(base.sourceEndOffset, extra.sourceEndOffset),
    characterCount: mergedText.length,
    wordCount: countBookWords(mergedText),
    morseCharacterEstimate: estimateMorseCharacters(mergedText),
    textPreview: textPreview(mergedText),
    text: mergedText,
  };
}

function mergeTinyStructuralFragments(
  sections: DetectedBookSection[],
): DetectedBookSection[] {
  const merged: DetectedBookSection[] = [];
  for (let index = 0; index < sections.length; index += 1) {
    const section = sections[index];
    const next = sections[index + 1];
    const previous = merged[merged.length - 1];
    if (!section) continue;

    const isTiny = section.wordCount > 0 && section.wordCount < 25;
    const isShortOpening = false;

    if ((isTiny || isShortOpening) && next) {
      merged.push(mergeSectionText(next, section, "prepend"));
      index += 1;
      continue;
    }
    if (isTiny && previous) {
      merged[merged.length - 1] = mergeSectionText(previous, section, "append");
      continue;
    }
    merged.push(section);
  }

  return renumberSections(
    merged.map((section, index) => ({
      ...section,
      order: index + 1,
    })),
  );
}

type ManualBoundary = {
  offset: number;
  kind: BookSectionKind;
  label: string;
  title: string | null;
};

function includeSectionByDefault(kind: BookSectionKind, metadata: BookMetadata): boolean {
  if (metadata.defaults.excludeKinds.includes(kind)) return false;
  if (metadata.defaults.includeKinds.length === 0) return true;
  return metadata.defaults.includeKinds.includes(kind);
}

function lineOffsetsFor(text: string): Array<{ offset: number; text: string; trimmed: string }> {
  const result: Array<{ offset: number; text: string; trimmed: string }> = [];
  let offset = 0;
  for (const line of text.split("\n")) {
    result.push({ offset, text: line, trimmed: line.trim() });
    offset += line.length + 1;
  }
  return result;
}

function nextMeaningfulLine(
  lines: Array<{ offset: number; text: string; trimmed: string }>,
  startIndex: number,
): string | null {
  for (let index = startIndex + 1; index < Math.min(lines.length, startIndex + 8); index += 1) {
    const trimmed = lines[index]?.trimmed ?? "";
    if (trimmed) return trimmed;
  }
  return null;
}

function titleCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
    .replace(/'S\b/g, "'s");
}

function uppercaseRatio(input: string): number {
  const letters = input.match(/[A-Za-z]/g) ?? [];
  if (letters.length === 0) return 0;
  return letters.filter((letter) => letter === letter.toUpperCase()).length / letters.length;
}

function parseRomanOrdinal(input: string): number | null {
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
  for (const character of input.toUpperCase().split("").reverse()) {
    const value = values[character];
    if (!value) return null;
    if (value < previous) total -= value;
    else total += value;
    previous = value;
  }
  return total > 0 ? total : null;
}

function parseWordOrdinal(input: string): number | null {
  const normalized = input
    .trim()
    .toUpperCase()
    .replace(/\.$/, "")
    .replace(/\s+/g, "-");
  const direct: Record<string, number> = {
    FIRST: 1,
    SECOND: 2,
    THIRD: 3,
    FOURTH: 4,
    FIFTH: 5,
    SIXTH: 6,
    SEVENTH: 7,
    EIGHTH: 8,
    NINTH: 9,
    TENTH: 10,
    ELEVENTH: 11,
    TWELFTH: 12,
    THIRTEENTH: 13,
    FOURTEENTH: 14,
    FIFTEENTH: 15,
    SIXTEENTH: 16,
    SEVENTEENTH: 17,
    EIGHTEENTH: 18,
    NINETEENTH: 19,
    TWENTIETH: 20,
    THIRTIETH: 30,
    FORTIETH: 40,
  };
  const whole = direct[normalized];
  if (whole) return whole;
  const parts = normalized.split("-");
  if (parts.length !== 2) return null;
  const tens: Record<string, number> = {
    TWENTY: 20,
    THIRTY: 30,
    FORTY: 40,
  };
  const unit = direct[parts[1]!];
  const ten = tens[parts[0]!];
  return ten && unit && unit < 10 ? ten + unit : null;
}

function normalizeHeadingKey(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u2018\u2019']/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function makeManualSection(
  text: string,
  boundary: ManualBoundary,
  endOffset: number,
  order: number,
  counters: Map<BookSectionKind, number>,
  metadata: BookMetadata,
): DetectedBookSection | null {
  const sectionText = trimBookText(text.slice(boundary.offset, endOffset));
  if (!sectionText) return null;
  const nextCount = (counters.get(boundary.kind) ?? 0) + 1;
  counters.set(boundary.kind, nextCount);
  return {
    id: `${boundary.kind}-${String(nextCount).padStart(3, "0")}`,
    kind: boundary.kind,
    label: boundary.label,
    title: boundary.title,
    order,
    includeByDefault: includeSectionByDefault(boundary.kind, metadata),
    sourceStartOffset: boundary.offset,
    sourceEndOffset: endOffset,
    characterCount: sectionText.length,
    wordCount: countBookWords(sectionText),
    morseCharacterEstimate: estimateMorseCharacters(sectionText),
    textPreview: textPreview(sectionText),
    text: sectionText,
  };
}

function sectionsFromManualBoundaries(
  text: string,
  boundaries: ManualBoundary[],
  metadata: BookMetadata,
): DetectedBookSection[] {
  const counters = new Map<BookSectionKind, number>();
  const sorted = boundaries
    .filter((boundary, index, list) => list.findIndex((item) => item.offset === boundary.offset) === index)
    .sort((left, right) => left.offset - right.offset);
  const sections: DetectedBookSection[] = [];
  sorted.forEach((boundary, index) => {
    const endOffset = sorted[index + 1]?.offset ?? text.length;
    const section = makeManualSection(
      text,
      boundary,
      endOffset,
      sections.length + 1,
      counters,
      metadata,
    );
    if (section) sections.push(section);
  });
  return sections;
}

function customSectionsForBook(
  slug: string,
  cleanedText: string,
  metadata: BookMetadata,
): DetectedBookSection[] | null {
  if (!customSectioningSlugs.has(slug)) return null;

  const lines = lineOffsetsFor(cleanedText);
  const boundaries: ManualBoundary[] = [];

  if (slug === "frankenstein") {
    for (const [index, line] of lines.entries()) {
      const letter = line.trimmed.match(/^Letter\s+(\d{1,3})\.?$/i);
      if (letter) {
        boundaries.push({
          offset: line.offset,
          kind: "letter",
          label: `Letter ${letter[1]}`,
          title: nextMeaningfulLine(lines, index),
        });
        continue;
      }
      const chapter = line.trimmed.match(/^Chapter\s+(\d{1,3})\.?$/i);
      if (chapter) {
        boundaries.push({
          offset: line.offset,
          kind: "chapter",
          label: `Chapter ${chapter[1]}`,
          title: null,
        });
      }
    }
  }

  if (slug === "the-king-in-yellow") {
    const storyTitles = new Map(
      [
        "THE REPAIRER OF REPUTATIONS",
        "THE MASK",
        "IN THE COURT OF THE DRAGON",
        "THE YELLOW SIGN",
        "THE DEMOISELLE D'YS",
        "THE PROPHETS' PARADISE",
        "THE STREET OF THE FOUR WINDS",
        "THE STREET OF THE FIRST SHELL",
        "THE STREET OF OUR LADY OF THE FIELDS",
        "RUE BARREE",
      ].map((title) => [title, titleCase(title)]),
    );
    boundaries.push({
      offset: 0,
      kind: "title-page",
      label: "Opening epigraph",
      title: null,
    });
    for (const line of lines) {
      const title = storyTitles.get(normalizeHeadingKey(line.trimmed));
      if (title) {
        boundaries.push({
          offset: line.offset,
          kind: "chapter",
          label: title,
          title: null,
        });
      }
    }
  }

  if (slug === "the-maltese-falcon") {
    for (const [index, line] of lines.entries()) {
      if (/^TO\s+_?JOSE_?$/i.test(line.trimmed)) {
        boundaries.push({
          offset: line.offset,
          kind: "dedication",
          label: "Dedication",
          title: null,
        });
        continue;
      }
      const numbered = line.trimmed.match(/^(\d{1,3})$/);
      if (numbered) {
        const possibleTitle = nextMeaningfulLine(lines, index);
        boundaries.push({
          offset: line.offset,
          kind: "chapter",
          label: `Section ${numbered[1]}`,
          title:
            possibleTitle && possibleTitle.length <= 80 && uppercaseRatio(possibleTitle) > 0.72
              ? titleCase(possibleTitle)
              : null,
        });
      }
    }
  }

  if (slug === "the-tempest") {
    boundaries.push({
      offset: 0,
      kind: "title-page",
      label: "Dramatis Personae",
      title: null,
    });
    for (const line of lines) {
      const act = line.trimmed.match(/^ACT\s+([IVXLCDM]+)\.?$/i);
      if (act) {
        boundaries.push({
          offset: line.offset,
          kind: "part",
          label: `Act ${parseRomanOrdinal(act[1]) ?? act[1]}`,
          title: null,
        });
      }
    }
  }

  if (slug === "the-turn-of-the-screw") {
    boundaries.push({
      offset: 0,
      kind: "chapter",
      label: "Prologue",
      title: null,
    });
    for (const line of lines) {
      const roman = line.trimmed.match(/^([IVXLCDM]+)\.?$/i);
      if (roman) {
        boundaries.push({
          offset: line.offset,
          kind: "chapter",
          label: `Chapter ${parseRomanOrdinal(roman[1]) ?? roman[1]}`,
          title: null,
        });
      }
    }
  }

  if (slug === "anne-of-avonlea") {
    boundaries.push({
      offset: 0,
      kind: "dedication",
      label: "Dedication and epigraph",
      title: null,
    });
    for (const [index, line] of lines.entries()) {
      const roman = line.trimmed.match(/^([IVXLCDM]+)\.?$/i);
      const ordinal = roman ? parseRomanOrdinal(roman[1]) : null;
      if (ordinal && ordinal >= 1 && ordinal <= 30) {
        boundaries.push({
          offset: line.offset,
          kind: "chapter",
          label: `Chapter ${ordinal}`,
          title: nextMeaningfulLine(lines, index),
        });
      }
    }
  }

  if (slug === "five-weeks-in-a-balloon") {
    boundaries.push({
      offset: 0,
      kind: "preface",
      label: "Publisher's Note",
      title: null,
    });
    for (const [index, line] of lines.entries()) {
      const chapter = line.trimmed.match(/^CHAPTER\s+([A-Z]+(?:-[A-Z]+)?)\.?$/i);
      const ordinal = chapter ? parseWordOrdinal(chapter[1]) : null;
      if (ordinal) {
        boundaries.push({
          offset: line.offset,
          kind: "chapter",
          label: `Chapter ${ordinal}`,
          title: nextMeaningfulLine(lines, index),
        });
      }
    }
  }

  const sections = sectionsFromManualBoundaries(cleanedText, boundaries, metadata).filter(
    (section) => section.wordCount > 0,
  );
  return sections.length > 0 ? renumberSections(sections) : null;
}

function renumberSections(sections: DetectedBookSection[]): DetectedBookSection[] {
  const counters = new Map<BookSectionKind, number>();
  return sections.map((section, index) => {
    const nextCount = (counters.get(section.kind) ?? 0) + 1;
    counters.set(section.kind, nextCount);
    return {
      ...section,
      id: `${section.kind}-${String(nextCount).padStart(3, "0")}`,
      order: index + 1,
    };
  });
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
      "Generated by controlled pilot write pass 3; review before scaling to larger batches or Cloudflare export.",
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
    project_gutenberg_license_present: /PROJECT GUTENBERG(?:\u2122|TM)? LICENSE/i.test(
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
      "Controlled pilot write pass 3 used Project Gutenberg public-domain source text after audit review and shared structure detection. Generated output remains review-gated before any Cloudflare export.",
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

Processed by pilot write pass 3.

- Source: ${report.sourceFileUsed}
- Start boundary: line ${report.startBoundaryUsed.line} (${report.startBoundaryUsed.reason})
- End boundary: line ${report.endBoundaryUsed.line} (${report.endBoundaryUsed.reason})
- Selected structure: ${report.selectedStructuralConvention}
- Sections: ${report.sectionCount}
- Recommendation: ${report.finalRecommendation}

This output is intentionally review-gated before larger batch processing or Cloudflare export.
`;
}

function statusPath(filePath: string) {
  return path.relative(repoRoot, filePath).replace(/\\/g, "/");
}

function sourceLikeTextRemains(text: string): boolean {
  return /Project Gutenberg|Gutenberg License|START OF (?:THE|THIS) PROJECT GUTENBERG|END OF (?:THE|THIS) PROJECT GUTENBERG|www\.gutenberg/i.test(
    text,
  );
}

function previewLooksUnsafe(previewText: string): boolean {
  return (
    previewText.trim().length < 500 ||
    sourceLikeTextRemains(previewText) ||
    /^(?:SOS Help!|MorseWords|Type text here)/i.test(previewText.trim()) ||
    /^(?:contents|table of contents)\b/i.test(previewText.trim())
  );
}

function reviewStructureForWrite(
  dryRun: DryRunBook,
  analysis: BookStructureAnalysis,
  sections: DetectedBookSection[],
  keptWordCount: number,
  customSectioningUsed: boolean,
): { warnings: string[]; fatalWarnings: string[] } {
  const warnings = [...analysis.redFlags];
  const fatalWarnings: string[] = [];
  const selected = analysis.selectedHeadingStrategy;

  if (analysis.fallbackRequired) {
    const message = `Structure fallback would be used: ${analysis.fallbackReason ?? "no selected strategy"}.`;
    if (customSectioningUsed) warnings.push(message);
    else fatalWarnings.push(message);
  }
  if (!analysis.likelyBodyHeadingsDetected) {
    const message = "No body headings were detected in the cleaned candidate text.";
    if (customSectioningUsed) warnings.push(message);
    else fatalWarnings.push(message);
  }
  if (analysis.confidenceLevel === "blocked") {
    fatalWarnings.push("Structure detector confidence is blocked.");
  }
  if (sections.length === 0) {
    fatalWarnings.push("No sections were produced.");
  }
  if (sections.length <= 2 && keptWordCount > 30_000) {
    fatalWarnings.push(
      `Only ${sections.length} section(s) were produced for ${keptWordCount} kept words.`,
    );
  }

  if (extraReviewSlugs.has(dryRun.slug)) {
    if (!customSectioningUsed && (!selected || selected.bodyLikeCount === 0)) {
      fatalWarnings.push("Extra review failed: selected strategy has no body-heading support.");
    }
    if (!customSectioningUsed && selected && selected.tocLikeCount > selected.bodyLikeCount) {
      fatalWarnings.push("Extra review failed: selected strategy is more TOC-like than body-like.");
    }
    if (
      !customSectioningUsed &&
      (dryRun.structureDetection.fallbackUsed || dryRun.structureDetection.status === "fail")
    ) {
      fatalWarnings.push("Extra review failed: dry-run structure status was not safe enough.");
    }
    if (analysis.selectedHeadingStrategy?.patternId !== dryRun.structureDetection.selectedHeadingStrategy?.patternId) {
      warnings.push(
        `Structure strategy changed after detector repair from ${dryRun.structureDetection.selectedHeadingStrategy?.patternId ?? "none"} to ${analysis.selectedHeadingStrategy?.patternId ?? "none"}.`,
      );
    }
  }

  return {
    warnings: [...new Set(warnings)],
    fatalWarnings: [...new Set(fatalWarnings)],
  };
}

function processPilotBook(dryRun: DryRunBook): {
  report: WrittenBookReport;
  manifest: GeneratedBookManifest | null;
  previewEntry: Parameters<typeof updatePreviewManifest>[0][number] | null;
} {
  ensureApprovedSlug(dryRun.slug);
  const boundary = boundaryFromDryRun(dryRun);
  const sourcePath = safeSourcePath(dryRun.sourcePath);
  const rawText = fs.readFileSync(sourcePath, "utf8");
  const { lines, bodyText, frontMatterText, endMatterText } = extractBodyByLines(
    rawText,
    boundary,
  );
  const metadata = makeMetadata(dryRun, rawText, boundary);
  const cleaned = cleanPilotBody(bodyText);
  const cleanedText = cleaned.text;
  const keptWordCount = countBookWords(cleanedText);

  const remainingWarnings: string[] = [];
  const fatalWarnings: string[] = [];
  if (sourceLikeTextRemains(cleanedText)) {
    remainingWarnings.push("Gutenberg/source text remains inside candidate body.");
    fatalWarnings.push("Gutenberg/source text remains inside candidate body.");
  }
  if (keptWordCount < 100) {
    remainingWarnings.push("Candidate body is suspiciously short.");
    fatalWarnings.push("Candidate body is suspiciously short.");
  }

  const structure = analyzeBookStructure(cleanedText, { rawWordCount: keptWordCount });
  const detected = buildDetectedSectionsFromStructure(cleanedText, structure, metadata);
  const customSections = customSectionsForBook(dryRun.slug, cleanedText, metadata);
  const sections =
    customSections ??
    mergeTinyStructuralFragments(
      enrichSections(detected.sections).filter((section) => section.wordCount > 0),
    );
  if (customSections) {
    remainingWarnings.push(
      "Batch-3 custom source-backed sectioning applied to preserve real openings or story boundaries.",
    );
  }
  const structureReview = reviewStructureForWrite(
    dryRun,
    structure,
    sections,
    keptWordCount,
    Boolean(customSections),
  );
  remainingWarnings.push(...structureReview.warnings);
  fatalWarnings.push(...structureReview.fatalWarnings);
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
    candidateTitle: metadata.title,
    candidateAuthor: metadata.author,
    pass2RiskLevel: dryRun.pass2RiskLevel,
    startBoundaryUsed: {
      line: boundary.startLine,
      reason: boundary.segments
        ? `${boundary.startReason} Kept source spans: ${keptLineRangeSummary(boundary)}.`
        : boundary.startReason,
      snippet: startSnippet,
      linesBefore: lineContext(lines, boundary.startLine, 12, 0),
    },
    endBoundaryUsed: {
      line: boundary.endLine,
      reason: boundary.segments
        ? `${boundary.endReason} Kept source spans: ${keptLineRangeSummary(boundary)}.`
        : boundary.endReason,
      snippet: endSnippet,
      linesAfter: lineContext(lines, boundary.endLine, 0, 12),
    },
    removedFrontMatterSummary: {
      wordCountEstimate: countBookWords(frontMatterText),
      lineRange: removedFrontLineRangeSummary(boundary),
    },
    removedEndMatterSummary: {
      wordCountEstimate: countBookWords(endMatterText),
      lineRange: removedEndLineRangeSummary(boundary, lines.length),
    },
    sectionCount,
    firstFiveSections: firstFive,
    lastFiveSections: lastFive,
    suspiciouslyShortSections: suspiciouslyShort,
    suspiciouslyLongSections: suspiciouslyLong,
    cleanupActionsApplied: cleaned.summary,
    remainingWarnings: [...new Set(remainingWarnings)],
    firstHourPreviewSourceSections: [],
    comparisonAgainstPriorGeneratedOutput: dryRun.comparisonAgainstExistingGeneratedOutput,
    selectedStructuralConvention: customSections
      ? `${structure.detectedStructuralConvention}; custom source-backed sectioning`
      : structure.detectedStructuralConvention,
    structureDetectionStatus: structure.confidenceLevel,
    finalRecommendation:
      dryRun.pass2RiskLevel === "low"
        ? "accepted for review"
        : "needs manual review before scaling",
  };

  if (fatalWarnings.length > 0) {
    return {
      report: {
        ...reportBase,
        status: "skipped",
        reasonIfSkipped: [...new Set(fatalWarnings)].join(" "),
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
    [...new Set([...detected.warnings, ...remainingWarnings])],
    cleaned.summary,
  );
  const sectionJson = sections.map((section) => makeSectionJson(dryRun.slug, section));
  const cleanedBook = buildCleanedBook(metadata, manifest, sections);
  const processedBook = buildProcessedBook(metadata, manifest, sections);
  const rightsReport = buildRightsReport(metadata, rawText);

  const preview = makePreviewAsset(manifest, sections);
  const previewPath = path.join(previewRoot, `${dryRun.slug}.preview.json`);
  assertInside(previewRoot, previewPath);
  if (previewLooksUnsafe(preview.asset.previewText)) {
    return {
      report: {
        ...reportBase,
        status: "skipped",
        reasonIfSkipped: "First-hour preview did not start at confident readable content.",
        finalRecommendation: "skipped",
      },
      manifest: null,
      previewEntry: null,
    };
  }

  const finalReport: WrittenBookReport = {
    ...reportBase,
    generatedOutputFilesChanged: [],
    previewAssetFileChanged: statusPath(previewPath),
    firstHourPreviewSourceSections: preview.sourceSections,
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

function priorWarningCorrectionSummary(result: WrittenBookReport): string {
  if (result.slug === "frankenstein") {
    return "Restored the real Letter 1 through Letter 4 opening as default readable content, then preserved Chapters 1-24 as body sections while excluding title/contents/source matter.";
  }
  if (result.slug === "the-three-musketeers") {
    return "Preserved the real Author's Preface before Chapter 1 and rewrote the body from source-backed chapter headings rather than carrying forward suspicious short generated sections.";
  }
  if (result.slug === "around-the-world-in-eighty-days") {
    return "Rewrote from the real Chapter I through Chapter XXXVII body after contents, correcting prior suspicious short generated sections.";
  }
  if (result.slug === "sense-and-sensibility") {
    return "Rewrote from the real Chapter 1 through Chapter 50 body after contents, correcting prior suspicious short generated sections.";
  }
  return "No prior generated-output warning was registered for this book.";
}

function writeReport(results: WrittenBookReport[]) {
  const written = results.filter((result) => result.status === "written");
  const skipped = results.filter((result) => result.status === "skipped");
  const priorWarningResults = results.filter((result) => priorGeneratedWarningSlugs.has(result.slug));
  const priorGeneratedOutputWarningSummary = priorWarningResults.map((result) => ({
    slug: result.slug,
    status: result.status,
    priorDamage: result.comparisonAgainstPriorGeneratedOutput.apparentDamage,
    correction: priorWarningCorrectionSummary(result),
    finalRecommendation: result.finalRecommendation,
  }));
  const jsonReport = {
    schemaVersion: 1,
    reportName: "pilot-write-3",
    generatedAt: new Date().toISOString(),
    inputReports: {
      pass1: statusPath(pass1ReportPath),
      pass2: statusPath(pass2ReportPath),
      structureAudit1: statusPath(structureAuditReportPath),
      pilotDryRun3: statusPath(dryRunReportPath),
    },
    paths: {
      tempBooksRoot: statusPath(tempBooksRoot),
      generatedRoot: statusPath(generatedRoot),
      cloudflareRoot: statusPath(cloudflareRoot),
      previewRoot: statusPath(previewRoot),
    },
    approvedPilotSlugs,
    individualReviewSlugs: Array.from(individualReviewSlugs),
    priorGeneratedOutputWarningSummary,
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
      previewAssetsOnlyForWrittenPilotBooks: true,
    },
  };

  const table = results
    .map(
      (result) =>
        `| ${result.slug} | ${result.status} | ${result.selectedStructuralConvention} | ${result.structureDetectionStatus} | ${result.sectionCount} | ${result.finalRecommendation} |`,
    )
    .join("\n");
  const warnings = written
    .map((result) => `- ${result.slug}: ${result.remainingWarnings.join("; ") || "review before scaling"}`)
    .join("\n");
  const damaged = results
    .filter((result) => result.comparisonAgainstPriorGeneratedOutput.apparentDamage.length > 0)
    .map(
      (result) =>
        `- ${result.slug}: ${result.comparisonAgainstPriorGeneratedOutput.apparentDamage.join("; ")}`,
    )
    .join("\n");
  const priorWarningMarkdown = priorWarningResults
    .map((result) => {
      const priorDamage = result.comparisonAgainstPriorGeneratedOutput.apparentDamage.join("; ") || "no remaining damage markers";
      return `- ${result.slug}: ${priorWarningCorrectionSummary(result)} Prior generated warning evidence: ${priorDamage}.`;
    })
    .join("\n");
  const generatedFiles = written
    .flatMap((result) => result.generatedOutputFilesChanged)
    .map((filePath) => `- ${filePath}`)
    .join("\n");
  const previewFiles = written
    .map((result) => result.previewAssetFileChanged)
    .filter(Boolean)
    .map((filePath) => `- ${filePath}`)
    .join("\n");

  const markdown = `# Pilot Write 3 Report

Controlled real pilot write pass for the approved batch-3 books from pilot dry-run 3. This pass uses the shared structure detector, applies source-backed conservative overrides where dry-run review found real openings or story boundaries, and writes only approved batch-3 generated outputs and preview assets.

## Summary

| Book | Status | Structure | Structure status | Sections | Recommendation |
| --- | --- | --- | --- | ---: | --- |
${table}

## Written Books

${written.map((result) => `- ${result.slug}`).join("\n") || "- None"}

## Skipped Books

${skipped.map((result) => `- ${result.slug}: ${result.reasonIfSkipped}`).join("\n") || "- None"}

## Accepted For Review

${written.map((result) => `- ${result.slug}`).join("\n") || "- None"}

## Needs Warnings Before Scaling

${warnings || "- None"}

## Prior Generated-Output Warning Summary

${priorWarningMarkdown || "- None"}

## Boundary Decisions

${results
  .map(
    (result) =>
      `- ${result.slug}: start line ${result.startBoundaryUsed.line}; end line ${result.endBoundaryUsed.line}; removed front/source ranges ${result.removedFrontMatterSummary.lineRange} (${result.removedFrontMatterSummary.wordCountEstimate} words) and end/source ranges ${result.removedEndMatterSummary.lineRange} (${result.removedEndMatterSummary.wordCountEstimate} words).`,
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

${damaged || "- No prior generated-output damage remained blocking after this targeted write pass."}

## Generated Output Files Changed

${generatedFiles || "- None"}

## Preview Assets

${previewFiles || "- None"}

## Preview Source Sections

${written
  .map((result) => `- ${result.slug}: ${result.firstHourPreviewSourceSections.join(", ")}`)
  .join("\n") || "- None"}

## Confirmations

- app/client/assets/temp-books was read only and not modified.
- app/client/assets/books/cloudflare-export was not modified.
- app/client/assets/books/generated was modified only for the written approved pilot books and the generated library manifest.
- public/book-previews was modified only for the written approved pilot books and the preview manifest.
- The individual-review and no-heading suspicious books were not processed.
- npm run books:build was not run.

## Recommended Next Step

Run the post-write verification pass for the written batch-3 books before any Cloudflare export.
`;

  writeJson(path.join(reportRoot, "pilot-write-3.json"), jsonReport);
  writeText(path.join(reportRoot, "pilot-write-3.md"), markdown);
}

function main() {
  const dryRun = readJson<{ books: DryRunBook[] }>(dryRunReportPath);
  if (
    !fs.existsSync(pass1ReportPath) ||
    !fs.existsSync(pass2ReportPath) ||
    !fs.existsSync(structureAuditReportPath)
  ) {
    throw new Error("Missing pass-1, pass-2, or structure audit input report.");
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
      "pilot-dry-run-3",
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
    `Pilot write 3 completed: ${results.filter((result) => result.status === "written").length} written, ${results.filter((result) => result.status === "skipped").length} skipped.`,
  );
  for (const result of results) {
    console.log(
      `${result.status.toUpperCase()} ${result.slug}: ${result.sectionCount} sections, ${result.finalRecommendation}`,
    );
  }
}

main();
