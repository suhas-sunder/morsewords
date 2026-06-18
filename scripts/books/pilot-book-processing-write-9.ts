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
import { cleanGutenbergText } from "./clean-gutenberg.ts";
import {
  countBookWords,
  estimateMorseCharacters,
  normalizeBookText,
  splitParagraphs,
  summarizeUnsupportedCharacters,
  textPreview,
  trimBookText,
} from "./bookTextNormalization.ts";
import {
  analyzeBookStructure,
  buildDetectedSectionsFromStructure,
} from "./lib/book-structure-detection.ts";

type DryRunStatus =
  | "already acceptable"
  | "needs correction before acceptance"
  | "needs first-time controlled processing"
  | "manual review"
  | "blocked";

type Evidence = {
  source: string;
  text: string;
  lineNumber: number | null;
};

type DryRunBook = {
  slug: string;
  candidateType: "raw-only";
  sourceFileUsed: string;
  expectedGeneratedTitle: string;
  expectedAuthor: string[];
  authorEvidence: Evidence;
  detectedStructuralConvention: string;
  meaningfulHeadingsExist: boolean;
  expectedFirstDefaultSection: string;
  expectedStartBoundary: string;
  expectedEndBoundary: string;
  expectedSectioningStrategy: string;
  likelySectionCount: number;
  cleanupRisks: string[];
  titleDefaultStartRisks: string[];
  authorMetadataRisks: string[];
  collectionTitleLeakageRisks: string[];
  illustrationPageMarkerFootnoteRisks: string[];
  currentStatus: DryRunStatus;
  recommendationForNextPass: string;
  snippets: {
    title: string;
    author: string;
    start: string;
    end: string;
  };
};

type UnresolvedSourceBook = {
  slug: string;
  title: string;
  candidateType: "unresolved-source generated, report-only";
  generatedSectionCount: number;
  reason: string;
};

type DryRunReport = {
  schemaVersion: 1;
  reportName: "pilot-dry-run-9";
  selectedBooks: string[];
  selectedCount: number;
  counts: {
    controlledFirstTimeProcessing: number;
    manualReview: number;
    blocked: number;
    skippedUnsafe: number;
  };
  acceptedExclusion: {
    count: number;
    reportInputs: string[];
    ambiguities: string[];
  };
  unresolvedSourceGeneratedBooksLeftUntouched: UnresolvedSourceBook[];
  futureBatchRules: string[];
  laterPhaseRequirements: string[];
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

type CleanupSummary = {
  imagePlaceholderLinesRemoved: number;
  inlinePageMarkersRemoved: number;
  numberedReferencesRemoved: number;
  trailingNonReadableBlocksRemoved: number;
  standaloneEndMarkersRemoved: number;
};

type SectionSnapshot = {
  id: string | null;
  label: string | null;
  title: string | null;
  kind: BookSectionKind | null;
  includeByDefault: boolean | null;
  wordCount: number | null;
  snippet: string | null;
};

type SectionReportSummary = {
  id: string;
  label: string;
  title: string | null;
  kind: BookSectionKind;
  wordCount: number;
};

type BoundaryReport = {
  cleanedLine: number | null;
  reason: string;
  snippet: string | null;
};

type BookReport = {
  slug: string;
  dryRunStatus: DryRunStatus;
  finalAction: "first-time processed" | "skipped";
  sourceFileUsed: string;
  expectedTitle: string;
  generatedTitle: string | null;
  expectedAuthor: string[];
  generatedAuthor: string[] | null;
  authorEvidence: Evidence;
  generatedFilesChanged: string[];
  previewAssetChanged: string | null;
  duplicateNearDuplicateSlugCheckResult: string;
  startBoundaryUsed: BoundaryReport;
  endBoundaryUsed: BoundaryReport;
  structuralConvention: string;
  firstDefaultSectionAfterProcessing: SectionSnapshot;
  sectionCount: number;
  first5SectionsWithWordCounts: SectionReportSummary[];
  last5SectionsWithWordCounts: SectionReportSummary[];
  cleanupActionsApplied: CleanupSummary | null;
  titleDefaultStartRiskVerdict: string;
  authorMetadataVerdict: string;
  segmentationVerdict: string;
  previewVerdict: string;
  startupPreviewValid: boolean;
  allMainReadableDefaultVerdict: string;
  remainingWarnings: string[];
  supportingSnippets: {
    title: string;
    author: string;
    start: string | null;
    end: string | null;
  };
  finalRecommendation: "accepted for review" | "needs manual review" | "skipped";
};

type PreviewEntry = {
  slug: string;
  contentVersion: string;
  contentHash: string;
  defaultSectionId: string;
  previewBytes: number;
  previewCharacterCount: number;
  estimatedRuntimeSeconds: number;
  truncated: boolean;
};

type SourceLine = {
  lineNumber: number;
  offset: number;
  text: string;
  trimmed: string;
};

type ManualBoundary = {
  offset: number;
  kind: BookSectionKind;
  label: string;
  title: string | null;
};

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const tempBooksRoot = path.join(repoRoot, "app/client/assets/temp-books");
const generatedRoot = path.join(repoRoot, "app/client/assets/books/generated");
const previewRoot = path.join(repoRoot, "public/book-previews");
const dryRunRoot = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/pilot-dry-run-9",
);
const writeReportRoot = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/pilot-write-9",
);
const dryRunReportPath = path.join(dryRunRoot, "pilot-dry-run-9.json");
const libraryManifestPath = path.join(generatedRoot, "library-manifest.json");
const previewManifestPath = path.join(previewRoot, "manifest.json");

const SELECTED_BATCH = [
  "a-study-in-scarlet",
  "dagon",
  "deep-sea-plunderings",
  "five-little-peppers-at-school",
  "pickman-s-model",
  "quo-vadis",
  "the-amateur-cracksman",
  "the-black-star-passes",
  "the-blue-castle",
  "the-brothers-karamazov",
  "the-buccaneer",
  "the-cats-of-ulthar",
  "the-festival",
  "the-history-of-sir-richard-calmady-a-romance",
  "the-nameless-city",
  "the-three-taps-a-detective-story-without-a-moral",
  "the-turmoil",
  "the-two-magics-the-turn-of-the-screw-covering-end",
  "the-works-of-edgar-allan-poe",
  "under-the-red-dragon",
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

const EXPECTED_FINAL_SECTION_COUNTS: Record<string, number> = {
  "a-study-in-scarlet": 14,
  dagon: 1,
  "deep-sea-plunderings": 24,
  "five-little-peppers-at-school": 25,
  "pickman-s-model": 1,
  "quo-vadis": 73,
  "the-amateur-cracksman": 8,
  "the-black-star-passes": 18,
  "the-blue-castle": 45,
  "the-brothers-karamazov": 96,
  "the-buccaneer": 46,
  "the-cats-of-ulthar": 1,
  "the-festival": 1,
  "the-history-of-sir-richard-calmady-a-romance": 60,
  "the-nameless-city": 1,
  "the-three-taps-a-detective-story-without-a-moral": 25,
  "the-turmoil": 33,
  "under-the-red-dragon": 61,
};

const MANUAL_SKIP_REASONS: Record<string, string> = {
  "the-two-magics-the-turn-of-the-screw-covering-end":
    "Skipped after write-pass duplicate check: the raw file is the collection The Two Magics and contains a full The Turn of the Screw, while generated the-turn-of-the-screw already exists; no distinct-version policy exists for duplicating that work under a collection slug.",
  "the-works-of-edgar-allan-poe":
    "Skipped after write-pass boundary check: the raw Volume 2 begins with THE PURLOINED LETTER, but the dry-run proposed starting at the next story, which would drop real opening collection content.",
};

const FUTURE_BATCH_RULE = [
  "valid generated readable content",
  "correct generated title",
  "correct author metadata or documented unresolved-author policy",
  "no duplicate generated work under a slightly different slug unless intentionally documented",
  "first default section from real readable content",
  "all main readable sections included by default",
  "meaningful source-based segmentation",
  "valid book-specific startup preview",
  "no SOS Help!",
  "no generic preview fallback",
  "no title/TOC/source/license/contributor/transcriber/byline material as default playback",
  "selected/default source order begins from the first selected/default section",
];

const LATER_PHASE_REQUIREMENTS = [
  "after all books are processed, run an independent second-pass audit using a different strategy",
  "after books and second-pass audit, add original non-spoiler 300-500+ word SEO summaries for each accepted book page",
  "after summaries, perform full site SEO/meta review using GSC data and route-level intent",
  "final cleanup should remove temporary audit scripts/reports and code bloat only after everything is stable",
];

const METADATA_OVERRIDES: Record<
  string,
  {
    title?: string;
    author?: string[];
    authorEvidence?: Evidence;
    warning: string;
  }
> = {
  dagon: {
    author: ["H. P. Lovecraft"],
    authorEvidence: {
      source: "source wrapper byline and accepted Lovecraft metadata convention",
      text: "H. P. Lovecraft",
      lineNumber: 35,
    },
    warning:
      "metadata normalization: Faded Page header gives Howard Phillips Lovecraft (1890-1937), while source byline and earlier accepted Lovecraft books use H. P. Lovecraft.",
  },
  "pickman-s-model": {
    author: ["H. P. Lovecraft"],
    authorEvidence: {
      source: "Faded Page Author line with date removed",
      text: "Author: H. P. Lovecraft (1890-1937)",
      lineNumber: 18,
    },
    warning:
      "metadata normalization: removed lifespan parenthetical to match earlier accepted Lovecraft manifests.",
  },
  "the-black-star-passes": {
    author: ["John W. Campbell, Jr."],
    authorEvidence: {
      source: "title page and copyright line",
      text: "JOHN W. CAMPBELL; Copyright, 1953, by John W. Campbell, Jr.",
      lineNumber: 93,
    },
    warning:
      "metadata correction: Gutenberg header misorders the author as 'Jr. John W. Campbell'; title page/copyright evidence supports 'John W. Campbell, Jr.'.",
  },
  "the-cats-of-ulthar": {
    author: ["H. P. Lovecraft"],
    authorEvidence: {
      source: "Faded Page Author line with date removed",
      text: "Author: Howard Phillips Lovecraft (1890-1937)",
      lineNumber: 18,
    },
    warning:
      "metadata normalization: Faded Page header gives Howard Phillips Lovecraft (1890-1937); earlier accepted Lovecraft manifests use H. P. Lovecraft.",
  },
  "the-festival": {
    title: "The Festival",
    author: ["H. P. Lovecraft"],
    authorEvidence: {
      source: "Faded Page Author line",
      text: "Author: H. P. Lovecraft",
      lineNumber: 18,
    },
    warning:
      "title normalization: source header casing is 'The festival', while story heading/byline supports 'The Festival'.",
  },
  "the-nameless-city": {
    author: ["H. P. Lovecraft"],
    authorEvidence: {
      source: "Faded Page Author line with date removed",
      text: "Author: Howard Phillips Lovecraft (1890-1937)",
      lineNumber: 18,
    },
    warning:
      "metadata normalization: Faded Page header gives Howard Phillips Lovecraft (1890-1937); earlier accepted Lovecraft manifests use H. P. Lovecraft.",
  },
  "the-three-taps-a-detective-story-without-a-moral": {
    title: "The Three Taps",
    warning:
      "title normalization: source header includes the subtitle; visible source title supports the shorter public title The Three Taps.",
  },
};

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(filePath: string, value: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value);
}

function statusPath(filePath: string): string {
  return path.relative(repoRoot, filePath).replace(/\\/g, "/");
}

function assertInside(root: string, candidate: string) {
  const relative = path.relative(root, candidate);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`${candidate} is outside ${root}`);
  }
}

function sha256Json(value: unknown): string {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(value))
    .digest("hex");
}

function estimateTypingMinutes(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 35));
}

function estimateListeningMinutes(morseCharacterEstimate: number): number {
  return Math.max(1, Math.ceil(morseCharacterEstimate / 900));
}

function lineRecords(text: string): SourceLine[] {
  const lines: SourceLine[] = [];
  let offset = 0;
  for (const [index, line] of normalizeBookText(text).split("\n").entries()) {
    lines.push({
      lineNumber: index + 1,
      offset,
      text: line,
      trimmed: line.replace(/\s+/g, " ").trim(),
    });
    offset += line.length + 1;
  }
  return lines;
}

function lineAtOffset(lines: SourceLine[], offset: number): SourceLine | null {
  let current: SourceLine | null = null;
  for (const line of lines) {
    if (line.offset > offset) break;
    current = line;
  }
  return current;
}

function snippetAtOffset(text: string, offset: number, length = 260): string {
  return text
    .slice(offset, Math.min(text.length, offset + length))
    .replace(/[\u2018\u2019\u201c\u201d`]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function romanToInt(input: string): number | null {
  const roman = input.toUpperCase();
  if (!/^[IVXLCDM]+$/.test(roman)) return null;
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
  for (let index = roman.length - 1; index >= 0; index -= 1) {
    const value = values[roman[index] ?? ""] ?? 0;
    total += value < previous ? -value : value;
    previous = value;
  }
  return total > 0 ? total : null;
}

function titleCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function sectionIdFor(kind: BookSectionKind, counters: Map<BookSectionKind, number>): string {
  const next = (counters.get(kind) ?? 0) + 1;
  counters.set(kind, next);
  return `${kind}-${String(next).padStart(3, "0")}`;
}

function emptyCleanupSummary(): CleanupSummary {
  return {
    imagePlaceholderLinesRemoved: 0,
    inlinePageMarkersRemoved: 0,
    numberedReferencesRemoved: 0,
    trailingNonReadableBlocksRemoved: 0,
    standaloneEndMarkersRemoved: 0,
  };
}

function countMatches(input: string, pattern: RegExp): number {
  return input.match(pattern)?.length ?? 0;
}

function cutTrailingBlock(
  input: string,
  pattern: RegExp,
  cleanup: CleanupSummary,
): string {
  const match = input.match(pattern);
  if (!match || match.index === undefined) return input;
  if (match.index < input.length * 0.45) return input;
  cleanup.trailingNonReadableBlocksRemoved += 1;
  return input.slice(0, match.index);
}

function cutExplicitEndMatter(
  input: string,
  pattern: RegExp,
  cleanup: CleanupSummary,
): string {
  const match = input.match(pattern);
  if (!match || match.index === undefined) return input;
  cleanup.trailingNonReadableBlocksRemoved += 1;
  return input.slice(0, match.index);
}

function sanitizeSectionText(input: string, cleanup: CleanupSummary): string {
  let text = normalizeBookText(input);
  const bracketedMediaBlockPattern =
    /\[\s*(?:Illustration|Image|Plate|Decorative image|Music)\b[\s\S]*?\]/gi;
  cleanup.imagePlaceholderLinesRemoved += countMatches(text, bracketedMediaBlockPattern);
  text = text.replace(bracketedMediaBlockPattern, "");
  cleanup.imagePlaceholderLinesRemoved += countMatches(
    text,
    /^\s*\[?(?:Illustration|Image|Plate|Decorative image|Music)[^\n]*\]?\s*$/gim,
  );
  text = text.replace(
    /^\s*\[?(?:Illustration|Image|Plate|Decorative image|Music)[^\n]*\]?\s*$/gim,
    "",
  );
  cleanup.inlinePageMarkersRemoved += countMatches(text, /\[(?:Pg\.?\s*)?\d+\]/gi);
  text = text.replace(/\[(?:Pg\.?\s*)?\d+\]/gi, "");
  cleanup.numberedReferencesRemoved += countMatches(text, /\[(?:[A-Z])?\d+\]/g);
  text = text.replace(/\[(?:[A-Z])?\d+\]/g, "");
  cleanup.standaloneEndMarkersRemoved += countMatches(text, /^\s*THE END\s*$/gim);
  text = text.replace(/^\s*THE END\s*$/gim, "");

  text = cutTrailingBlock(
    text,
    /\s+Return to ["“][^"”]+["”]\s+This page last revised\s+\d{1,2}\s+\w+\s+\d{4}\.?\s*$/i,
    cleanup,
  );
  text = cutTrailingBlock(
    text,
    /\s+\*\s+\*\s+\*\s+\*\s+\*\s*MYSTERY STORIES FOR BOYS[\s\S]*$/i,
    cleanup,
  );
  text = cutTrailingBlock(
    text,
    /\s+The RICK BRANT SCIENCE-ADVENTURE Stories[\s\S]*$/i,
    cleanup,
  );
  text = cutTrailingBlock(
    text,
    /\s+Cambridge:\s+Electrotyped and Printed by[\s\S]*$/i,
    cleanup,
  );
  text = cutTrailingBlock(
    text,
    /\s+END OF ["“]THE REGENT['’]S DAUGHTER\.?["”]?\s*$/i,
    cleanup,
  );
  text = cutTrailingBlock(text, /\s+\+-{8,}\+\s*$/i, cleanup);
  text = cutTrailingBlock(text, /\s+\*\s+\*\s+\*\s+\*\s+\*\s*$/i, cleanup);

  text = cutTrailingBlock(
    text,
    /\n\s*\[The other stories included in this volume[\s\S]*$/i,
    cleanup,
  );
  text = cutTrailingBlock(
    text,
    /\n\s*(?:[●*o-]\s*)?TRANSCRIBER(?:['’]S|S)? NOTES?[\s\S]*$/i,
    cleanup,
  );
  text = cutTrailingBlock(
    text,
    /\n\s*[\[|]?\s*TRANSCRIBER(?:['’]S|S)? NOTES?:?[\s\S]*$/i,
    cleanup,
  );
  text = cutTrailingBlock(text, /\n\s*GLOSSARY AND INDEX\s*[\s\S]*$/i, cleanup);
  text = cutTrailingBlock(text, /\n\s*CATALOGUE OF [\s\S]*$/i, cleanup);
  text = cutTrailingBlock(text, /\n\s*ADVERTISEMENTS[\s\S]*$/i, cleanup);
  text = cutTrailingBlock(text, /\n\s*OPINIONS OF THE PRESS[\s\S]*$/i, cleanup);
  text = cutTrailingBlock(text, /\n\s*BOOKS BY [A-Z][A-Z .'-]+[\s\S]*$/i, cleanup);
  text = cutExplicitEndMatter(
    text,
    /\n\s*ABBREVIATIONS USED IN THE NOTES\.\s*[\s\S]*$/i,
    cleanup,
  );
  text = cutExplicitEndMatter(text, /\n\s*NOTES\.\s*[\s\S]*$/i, cleanup);
  text = cutExplicitEndMatter(text, /\n\s*Addendum\.\s*[\s\S]*$/i, cleanup);
  text = cutTrailingBlock(
    text,
    /\n\s*Printed in [^\n]+[\s\S]*?(?:Printers?|Bookbinders?)[\s\S]*$/i,
    cleanup,
  );
  text = cutTrailingBlock(text, /\n\s*THE END of FLATLAND[\s\S]*$/i, cleanup);
  text = cutTrailingBlock(text, /\n\s*[A-Z][A-Z .,&-]+PRINTERS\b[\s\S]*$/i, cleanup);
  text = cutTrailingBlock(text, /\n\s*End of Project Gutenberg[\s\S]*$/i, cleanup);
  text = cutTrailingBlock(
    text,
    /\n\s*\*{3}\s*END OF (?:THE|THIS) PROJECT GUTENBERG[\s\S]*$/i,
    cleanup,
  );
  text = cutTrailingBlock(
    text,
    /\n\s*(?:[•*\-\s]*)?(?:Contact Us|Site Map|Search|Donate)\b[\s\S]*?(?:Copyright|All Rights Reserved)[\s\S]*$/i,
    cleanup,
  );
  text = cutTrailingBlock(
    text,
    /\n\s*(?:[•*\-\s]*)?Copyright\s+©?[\s\S]*$/i,
    cleanup,
  );

  text = cutTrailingBlock(
    text,
    /\s+Return to ["\u201c][^"\u201d]+["\u201d]\s+This page last revised\s+\d{1,2}\s+\w+\s+\d{4}\.?\s*$/i,
    cleanup,
  );
  text = cutTrailingBlock(
    text,
    /\s+\*\s+\*\s+\*\s+\*\s+\*\s*MYSTERY STORIES FOR BOYS[\s\S]*$/i,
    cleanup,
  );
  text = cutTrailingBlock(
    text,
    /\s+The RICK BRANT SCIENCE-ADVENTURE Stories[\s\S]*$/i,
    cleanup,
  );
  text = cutTrailingBlock(
    text,
    /\s+Cambridge:\s+Electrotyped and Printed by[\s\S]*$/i,
    cleanup,
  );
  text = cutTrailingBlock(
    text,
    /\s+END OF ["\u201c]THE REGENT['\u2019]S DAUGHTER\.?["\u201d]?\s*$/i,
    cleanup,
  );
  text = cutTrailingBlock(text, /\s+\+-{8,}\+\s*$/i, cleanup);
  text = cutTrailingBlock(text, /\s+\*\s+\*\s+\*\s+\*\s+\*\s*$/i, cleanup);

  return trimBookText(text.replace(/\n{4,}/g, "\n\n\n"));
}

function rebuildSection(
  section: DetectedBookSection,
  text: string,
  order: number,
): DetectedBookSection | null {
  const cleaned = trimBookText(text);
  if (!cleaned) return null;
  return {
    ...section,
    order,
    text: cleaned,
    characterCount: cleaned.length,
    wordCount: countBookWords(cleaned),
    morseCharacterEstimate: estimateMorseCharacters(cleaned),
    textPreview: textPreview(cleaned),
  };
}

function sanitizeSections(
  sections: DetectedBookSection[],
  cleanup: CleanupSummary,
): DetectedBookSection[] {
  const sanitized: DetectedBookSection[] = [];
  for (const section of sections) {
    const next = rebuildSection(
      section,
      sanitizeSectionText(section.text, cleanup),
      sanitized.length + 1,
    );
    if (next) sanitized.push(next);
  }
  return sanitized;
}

function makeMetadata(
  dryRun: DryRunBook,
  rawText: string,
  metadata: ReturnType<typeof metadataFor>,
): BookMetadata {
  const gutenbergId = extractGutenbergId(rawText);
  return {
    schemaVersion: 1,
    slug: dryRun.slug,
    metadataStatus: "reviewed",
    manualReviewRequired: false,
    title: metadata.title,
    author: metadata.author,
    language: "en",
    source: {
      provider: "Project Gutenberg",
      gutenbergId,
      sourceUrl: sourceUrlFor(gutenbergId),
      rawTextFile: dryRun.sourceFileUsed,
      releaseDate: extractHeaderValue(rawText, "Release date")?.replace(/\s*\[.*$/, "").trim() ?? null,
      rawTextUrl: null,
      rightsBasis: "public-domain-us",
      rightsReviewed: true,
      rightsNotes:
        "Pilot write pass 9 processed this audited Project Gutenberg source for review-gated MorseWords book output.",
    },
    cover: {
      src: null,
      placeholder: true,
      alt: `Placeholder cover for ${metadata.title}`,
    },
    description: "",
    subjects: [],
    originalPublicationYear: null,
    defaults: {
      includeKinds: [],
      excludeKinds: [
        "title-page",
        "dedication",
        "epigraph",
        "preface",
        "introduction",
        "appendix",
        "notes",
        "glossary",
        "index",
        "transcriber-note",
        "source-license",
        "advertisement",
      ],
      preferredPreset: "main-narrative",
    },
    sectionOverrides: [],
    cleanupRules: [],
  };
}

function sectionsFromBoundaries(
  text: string,
  boundaries: ManualBoundary[],
  cleanup: CleanupSummary,
): DetectedBookSection[] {
  const counters = new Map<BookSectionKind, number>();
  const sections: DetectedBookSection[] = [];
  const sorted = [...boundaries].sort((left, right) => left.offset - right.offset);
  for (const [index, boundary] of sorted.entries()) {
    const endOffset = sorted[index + 1]?.offset ?? text.length;
    const sectionText = sanitizeSectionText(text.slice(boundary.offset, endOffset), cleanup);
    if (!sectionText) continue;
    sections.push({
      id: sectionIdFor(boundary.kind, counters),
      kind: boundary.kind,
      label: boundary.label,
      title: boundary.title,
      order: sections.length + 1,
      includeByDefault: true,
      sourceStartOffset: boundary.offset,
      sourceEndOffset: endOffset,
      characterCount: sectionText.length,
      wordCount: countBookWords(sectionText),
      morseCharacterEstimate: estimateMorseCharacters(sectionText),
      textPreview: textPreview(sectionText),
      text: sectionText,
    });
  }
  return sections;
}

function nextHeadingTitle(lines: SourceLine[], startIndex: number): string | null {
  for (let index = startIndex + 1; index < Math.min(lines.length, startIndex + 5); index += 1) {
    const line = lines[index];
    if (!line || !line.trimmed) continue;
    if (line.trimmed.length > 90) return null;
    if (/^[A-Z0-9 "'.,:;!?()-]+$/.test(line.trimmed)) return titleCase(line.trimmed);
    return null;
  }
  return null;
}

function manualWardenBoundaries(cleanedText: string): ManualBoundary[] {
  return lineRecords(cleanedText)
    .map((line, index, lines): ManualBoundary | null => {
      const match = line.trimmed.match(/^Chapter\s+([IVXLCDM]+)$/);
      if (!match) return null;
      const ordinal = romanToInt(match[1] ?? "");
      if (!ordinal) return null;
      return {
        offset: line.offset,
        kind: "chapter",
        label: `Chapter ${ordinal}`,
        title: nextHeadingTitle(lines, index),
      };
    })
    .filter((boundary): boundary is ManualBoundary => boundary !== null);
}

function manualVirginianBoundaries(cleanedText: string): ManualBoundary[] {
  return lineRecords(cleanedText)
    .map((line): ManualBoundary | null => {
      const match = line.trimmed.match(/^([IVXLCDM]+)\.\s+(.+)$/);
      if (!match) return null;
      const ordinal = romanToInt(match[1] ?? "");
      if (!ordinal) return null;
      return {
        offset: line.offset,
        kind: "chapter",
        label: `Chapter ${ordinal}`,
        title: match[2]?.trim() ?? null,
      };
    })
    .filter((boundary): boundary is ManualBoundary => boundary !== null);
}

function manualChapterRomanBoundaries(cleanedText: string): ManualBoundary[] {
  return lineRecords(cleanedText)
    .map((line, index, lines): ManualBoundary | null => {
      const match = line.trimmed.match(/^CHAPTER\s+([IVXLCDM]+)\.?$/);
      if (!match) return null;
      const ordinal = romanToInt(match[1] ?? "");
      if (!ordinal) return null;
      return {
        offset: line.offset,
        kind: "chapter",
        label: `Chapter ${ordinal}`,
        title: nextHeadingTitle(lines, index),
      };
    })
    .filter((boundary): boundary is ManualBoundary => boundary !== null);
}

const SINGLE_STORY_SLUGS = new Set([
  "dagon",
  "pickman-s-model",
  "the-cats-of-ulthar",
  "the-festival",
  "the-nameless-city",
]);

const SINGLE_STORY_START_PHRASES: Record<string, string> = {
  dagon: "I am writing this under an appreciable mental strain",
  "pickman-s-model": "You needn't think I'm crazy",
  "the-cats-of-ulthar": "It is said that in Ulthar",
  "the-festival": "I was far from home",
  "the-nameless-city": "When I drew nigh the nameless city",
};

type BoundarySpec = {
  sourceLabel: string;
  label: string;
  title: string | null;
};

type BoundaryPlan = {
  startPhrase: string;
  specs: BoundarySpec[];
  structuralConvention: string;
  warning: string;
};

const SECTION_BOUNDARY_PLANS: Record<string, BoundaryPlan> = {
  "deep-sea-plunderings": {
    startPhrase: "What a clumsy, barrel-bellied old hooker she is",
    structuralConvention:
      "24 contents-listed story headings after title, prefatory note, contents, and illustration list",
    warning:
      "Write pass used the 24 contents-listed story headings beginning with THROUGH FIRE AND WATER; title page, prefatory note, contents, illustration list, and publisher ads are excluded from default playback.",
    specs: [
      "THROUGH FIRE AND WATER",
      "THE OLD HOUSE ON THE HILL",
      "YOU SING",
      "THE DEBT OF THE WHALE",
      "THE SKIPPER'S WIFE",
      "A SCIENTIFIC CRUISE",
      "A GENIAL SKIPPER",
      "MAC'S EXPERIMENT",
      "ON THE VERTEX",
      "A MONARCH'S FALL",
      "THE CHUMS",
      "ALPHONSO M'GINTY",
      "THE LAST STAND OF THE DECAPODS",
      "THE SIAMESE LOCK",
      "THE COOK OF THE CORNUCOPIA",
      "A LESSON IN CHRISTMAS-KEEPING",
      "THE TERROR OF DARKNESS",
      "THE WATCHMEN OF THE WORLD",
      "THE COOK OF THE WANDERER",
      "THE GREAT CHRISTMAS OF GOZO",
      "DEEP-SEA FISH",
      "A MEDITERRANEAN MORNING",
      "ABNER'S TRAGEDY",
      "LOST AND FOUND",
    ].map((sourceLabel) => ({ sourceLabel, label: sourceLabel, title: null })),
  },
  "five-little-peppers-at-school": {
    startPhrase: "Come on, Pepper.",
    structuralConvention:
      "25 contents-listed roman chapter-title headings after title page, book list, contents, and illustrations",
    warning:
      "Write pass used the 25 contents-listed roman chapter-title headings beginning with I HARD TIMES FOR JOEL; title page, book list, contents, and illustration captions are excluded from default playback.",
    specs: [
      ["I HARD TIMES FOR JOEL", "Chapter 1", "Hard Times for Joel"],
      ["II THE TENNIS MATCH", "Chapter 2", "The Tennis Match"],
      ["III A NARROW ESCAPE", "Chapter 3", "A Narrow Escape"],
      ["IV OF VARIOUS THINGS", "Chapter 4", "Of Various Things"],
      ["V AT SILVIA HORNE'S", "Chapter 5", "At Silvia Horne's"],
      ["VI THE ACCIDENT", "Chapter 6", "The Accident"],
      ["VII THE SALISBURY GIRLS", "Chapter 7", "The Salisbury Girls"],
      ['VIII "WE\'RE TO HAVE OUR PICNIC!"', "Chapter 8", '"We\'re to Have Our Picnic!"'],
      ["IX ALL ABOUT THE POOR BRAKEMAN", "Chapter 9", "All About the Poor Brakeman"],
      ["X JOEL AND HIS DOG", "Chapter 10", "Joel and His Dog"],
      ["XI THE UNITED CLUBS", "Chapter 11", "The United Clubs"],
      ["XII SOME EVERY-DAY FUN", "Chapter 12", "Some Every-day Fun"],
      ["XIII THE PICNIC", "Chapter 13", "The Picnic"],
      ["XIV MISS SALISBURY'S STORY", "Chapter 14", "Miss Salisbury's Story"],
      ["XV THE BROKEN VASE", "Chapter 15", "The Broken Vase"],
      ["XVI NEW PLANS", "Chapter 16", "New Plans"],
      ["XVII PHRONSIE", "Chapter 17", "Phronsie"],
      ["XVIII TOM'S STORY", "Chapter 18", "Tom's Story"],
      ["XIX THE GRAND ENTERTAINMENT", "Chapter 19", "The Grand Entertainment"],
      ["XX THE CORCORAN FAMILY", "Chapter 20", "The Corcoran Family"],
      ["XXI AT THE PLAY", "Chapter 21", "At the Play"],
      ["XXII PICKERING DODGE", "Chapter 22", "Pickering Dodge"],
      ["XXIII THE CLEMCY GARDEN PARTY", "Chapter 23", "The Clemcy Garden Party"],
      ["XXIV THE PIECE OF NEWS", "Chapter 24", "The Piece of News"],
      ['XXV "THE VERY PRETTIEST AFFAIR"', "Chapter 25", '"The Very Prettiest Affair"'],
    ].map(([sourceLabel, label, title]) => ({ sourceLabel, label, title })),
  },
  "the-amateur-cracksman": {
    startPhrase: "It was half-past twelve",
    structuralConvention:
      "8 contents-listed Raffles story headings after title, dedication, and contents",
    warning:
      "Write pass used the 8 contents-listed Raffles story headings beginning with THE IDES OF MARCH; title page, dedication, and contents are excluded from default playback.",
    specs: [
      "THE IDES OF MARCH",
      "A COSTUME PIECE",
      "GENTLEMEN AND PLAYERS",
      "LE PREMIER PAS",
      "WILFUL MURDER",
      "NINE POINTS OF THE LAW",
      "THE RETURN MATCH",
      "THE GIFT OF THE EMPEROR",
    ].map((sourceLabel) => ({ sourceLabel, label: sourceLabel, title: null })),
  },
};

function normalizedLoose(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\u2018\u2019\u201c\u201d`]+/g, " ")
    .replace(/[_*"'“”‘’.,:;()[\]\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isNonReadableOpeningLine(
  dryRun: DryRunBook,
  line: SourceLine,
  inTranscriberNote: boolean,
) {
  const trimmed = line.trimmed;
  if (!trimmed) return true;
  if (inTranscriberNote) return true;
  const normalized = normalizedLoose(trimmed);
  if (normalized === normalizedLoose(dryRun.expectedGeneratedTitle)) return true;
  if (/^by\s+[a-z]/i.test(trimmed)) return true;
  if (/^author of\b/i.test(trimmed)) return true;
  if (/^\[?\s*(source|transcriber|illustration|frontispiece)\b/i.test(trimmed)) return true;
  if (/^(title|author|release date|language|credits):/i.test(trimmed)) return true;
  if (/^[•\s]*(home|his life|his writings|his creations|his study|popular culture|about this site)\b/i.test(trimmed)) {
    return true;
  }
  if (/\b(contact us|site map|search|donate|copyright|all rights reserved)\b/i.test(trimmed)) {
    return true;
  }
  return false;
}

function manualSingleStoryBoundary(
  dryRun: DryRunBook,
  cleanedText: string,
): ManualBoundary[] {
  let inTranscriberNote = false;
  for (const line of lineRecords(cleanedText)) {
    if (/^\[\s*Transcriber's Note:/i.test(line.trimmed)) {
      inTranscriberNote = !/\]/.test(line.trimmed);
      continue;
    }
    if (inTranscriberNote) {
      if (/\]/.test(line.trimmed)) inTranscriberNote = false;
      continue;
    }
    if (isNonReadableOpeningLine(dryRun, line, inTranscriberNote)) continue;
    return [
      {
        offset: line.offset,
        kind: "chapter",
        label: dryRun.expectedGeneratedTitle,
        title: null,
      },
    ];
  }
  return [];
}

function manualSingleStoryPhraseBoundary(
  dryRun: DryRunBook,
  cleanedText: string,
  startPhrase: string,
): ManualBoundary[] {
  const offset = cleanedText.indexOf(startPhrase);
  if (offset < 0) return [];
  return [
    {
      offset,
      kind: "chapter",
      label: metadataFor(dryRun).title,
      title: null,
    },
  ];
}

function lineMatchesBoundarySpec(line: SourceLine, spec: BoundarySpec) {
  return normalizedLoose(line.trimmed) === normalizedLoose(spec.sourceLabel);
}

function manualBoundariesFromPlan(
  cleanedText: string,
  plan: BoundaryPlan,
): ManualBoundary[] {
  const startOffset = cleanedText.indexOf(plan.startPhrase);
  if (startOffset < 0) return [];
  const lines = lineRecords(cleanedText);
  const boundaries: ManualBoundary[] = [];
  let cursorOffset = -1;

  for (const [index, spec] of plan.specs.entries()) {
    const line =
      index === 0
        ? [...lines]
            .reverse()
            .find(
              (candidate) =>
                candidate.offset <= startOffset &&
                startOffset - candidate.offset < 2500 &&
                lineMatchesBoundarySpec(candidate, spec),
            )
        : lines.find(
            (candidate) =>
              candidate.offset > cursorOffset && lineMatchesBoundarySpec(candidate, spec),
          );
    if (!line) continue;
    boundaries.push({
      offset: line.offset,
      kind: "chapter",
      label: spec.label,
      title: spec.title,
    });
    cursorOffset = line.offset;
  }

  return boundaries;
}

function manualNumberedStoryBoundaries(cleanedText: string): ManualBoundary[] {
  return lineRecords(cleanedText)
    .map((line): ManualBoundary | null => {
      const match = line.trimmed.match(/^_?(\d+)\.\s+(.+?)_?$/);
      if (!match) return null;
      const ordinal = Number(match[1]);
      if (!Number.isInteger(ordinal) || ordinal < 1) return null;
      return {
        offset: line.offset,
        kind: "chapter",
        label: `Section ${ordinal}`,
        title: match[2]?.replace(/^_+|_+$/g, "").trim() ?? null,
      };
    })
    .filter((boundary): boundary is ManualBoundary => boundary !== null);
}

function cantoOrdinal(input: string): number | null {
  const map: Record<string, number> = {
    FIRST: 1,
    SECOND: 2,
    THIRD: 3,
    FOURTH: 4,
    FIFTH: 5,
    SIXTH: 6,
  };
  return map[input.toUpperCase()] ?? null;
}

function manualCantoBoundaries(cleanedText: string): ManualBoundary[] {
  return lineRecords(cleanedText)
    .map((line, index, lines): ManualBoundary | null => {
      const match = line.trimmed.match(/^CANTO\s+(FIRST|SECOND|THIRD|FOURTH|FIFTH|SIXTH)\.$/);
      if (!match) return null;
      const ordinal = cantoOrdinal(match[1] ?? "");
      if (!ordinal) return null;
      return {
        offset: line.offset,
        kind: "poem",
        label: `Canto ${ordinal}`,
        title: nextHeadingTitle(lines, index),
      };
    })
    .filter((boundary): boundary is ManualBoundary => boundary !== null);
}

function buildSectionsForBook(
  dryRun: DryRunBook,
  rawText: string,
  cleanup: CleanupSummary,
): { sections: DetectedBookSection[]; warnings: string[]; structuralConvention: string; cleanedText: string } {
  const cleaned = cleanGutenbergText(rawText);
  const cleanedText = cleaned.cleanedText;
  const warnings = [...cleaned.report.warnings];
  const analysis = analyzeBookStructure(cleanedText, {
    rawWordCount: countBookWords(cleanedText),
  });
  warnings.push(...analysis.redFlags);

  const singleStoryStartPhrase = SINGLE_STORY_START_PHRASES[dryRun.slug];
  if (singleStoryStartPhrase) {
    return {
      sections: sectionsFromBoundaries(
        cleanedText,
        manualSingleStoryPhraseBoundary(dryRun, cleanedText, singleStoryStartPhrase),
        cleanup,
      ),
      warnings: [
        ...warnings,
        "Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.",
      ],
      structuralConvention:
        "one contiguous story section starting at dry-run verified first readable prose phrase",
      cleanedText,
    };
  }

  const boundaryPlan = SECTION_BOUNDARY_PLANS[dryRun.slug];
  if (boundaryPlan) {
    return {
      sections: sectionsFromBoundaries(
        cleanedText,
        manualBoundariesFromPlan(cleanedText, boundaryPlan),
        cleanup,
      ),
      warnings: [...warnings, boundaryPlan.warning],
      structuralConvention: boundaryPlan.structuralConvention,
      cleanedText,
    };
  }

  if (analysis.fallbackRequired) {
    return {
      sections: [],
      warnings: [
        ...warnings,
        `No reliable heading strategy was available: ${analysis.fallbackReason ?? "unknown reason"}.`,
      ],
      structuralConvention: analysis.detectedStructuralConvention,
      cleanedText,
    };
  }

  if (dryRun.slug === "the-warden") {
    return {
      sections: sectionsFromBoundaries(cleanedText, manualWardenBoundaries(cleanedText), cleanup),
      warnings: [
        ...warnings,
        "Write pass used explicit Chapter I-XXI boundaries so Chapter XX is not dropped by the generic detector.",
      ],
      structuralConvention: "chapter-based roman numerals with explicit Chapter XX safeguard",
      cleanedText,
    };
  }

  if (dryRun.slug === "the-virginian-a-horseman-of-the-plains") {
    return {
      sections: sectionsFromBoundaries(cleanedText, manualVirginianBoundaries(cleanedText), cleanup),
      warnings: [
        ...warnings,
        "Write pass used case-sensitive Roman titled boundaries to avoid lowercase prose being treated as headings.",
      ],
      structuralConvention: "roman-numbered titled sections with lowercase-prose false-positive safeguard",
      cleanedText,
    };
  }

  if (dryRun.slug === "unicorns") {
    return {
      sections: sectionsFromBoundaries(cleanedText, manualChapterRomanBoundaries(cleanedText), cleanup),
      warnings: [
        ...warnings,
        "Write pass used explicit CHAPTER I-XXX boundaries because the generic detector skipped some chapter numerals.",
      ],
      structuralConvention: "chapter-based roman numerals with explicit CHAPTER I-XXX safeguard",
      cleanedText,
    };
  }

  if (dryRun.slug === "the-buccaneer") {
    return {
      sections: sectionsFromBoundaries(cleanedText, manualChapterRomanBoundaries(cleanedText), cleanup),
      warnings: [
        ...warnings,
        "Write pass used all 46 explicit CHAPTER I-XVI / I-XV roman headings across the three volumes because the generic detector skipped a real Chapter IV.",
      ],
      structuralConvention:
        "three-volume chapter-based roman numerals with explicit CHAPTER IV safeguard",
      cleanedText,
    };
  }

  if (dryRun.slug === "the-lady-of-the-lake") {
    return {
      sections: sectionsFromBoundaries(cleanedText, manualCantoBoundaries(cleanedText), cleanup),
      warnings: [
        ...warnings,
        "Write pass used the six uppercase CANTO boundaries and excluded later editorial notes from default playback.",
      ],
      structuralConvention: "six canto-based verse sections; editorial notes excluded from default playback",
      cleanedText,
    };
  }

  if (dryRun.slug === "the-lurking-fear") {
    return {
      sections: sectionsFromBoundaries(cleanedText, manualNumberedStoryBoundaries(cleanedText), cleanup),
      warnings: [
        ...warnings,
        "Write pass used four explicit numbered story-section headings and ignored a sentence-fragment false positive.",
      ],
      structuralConvention: "four numbered story sections with sentence-fragment false-positive safeguard",
      cleanedText,
    };
  }

  if (SINGLE_STORY_SLUGS.has(dryRun.slug)) {
    return {
      sections: sectionsFromBoundaries(cleanedText, manualSingleStoryBoundary(dryRun, cleanedText), cleanup),
      warnings: [
        ...warnings,
        "Write pass created one contiguous story section after excluding title, byline, transcriber/source, and source-site wrapper lines.",
      ],
      structuralConvention:
        "one contiguous story section after excluding title/byline/source-site/transcriber/footer wrapper lines",
      cleanedText,
    };
  }

  const metadata = makeMetadata(dryRun, rawText, metadataFor(dryRun));
  const built = buildDetectedSectionsFromStructure(cleanedText, analysis, metadata);
  warnings.push(...built.warnings);
  const firstBodyHeading = analysis.selectedBodyHeadings[0];
  if (!firstBodyHeading) {
    return {
      sections: [],
      warnings: [...warnings, "Selected heading strategy produced no body heading."],
      structuralConvention: analysis.detectedStructuralConvention,
      cleanedText,
    };
  }
  const bodySections = built.sections.filter(
    (section) =>
      section.kind !== "title-page" &&
      section.sourceEndOffset > firstBodyHeading.offset &&
      section.includeByDefault,
  );
  return {
    sections: sanitizeSections(bodySections, cleanup),
    warnings,
    structuralConvention: analysis.detectedStructuralConvention,
    cleanedText,
  };
}

function extractHeaderValue(rawText: string, label: string): string | null {
  const pattern = new RegExp(`^${label}:\\s*(.+)$`, "im");
  return rawText.match(pattern)?.[1]?.trim() ?? null;
}

function extractGutenbergId(rawText: string): string | null {
  const release = extractHeaderValue(rawText, "Release date") ?? "";
  const idMatch = release.match(/eBook\s*#?(\d+)/i) ?? rawText.match(/ebooks\/(\d+)/i);
  return idMatch?.[1] ?? null;
}

function sourceUrlFor(gutenbergId: string | null) {
  return gutenbergId ? `https://www.gutenberg.org/ebooks/${gutenbergId}` : null;
}

function metadataFor(dryRun: DryRunBook) {
  const override = METADATA_OVERRIDES[dryRun.slug];
  return {
    title: override?.title ?? dryRun.expectedGeneratedTitle,
    author: override?.author ?? dryRun.expectedAuthor,
    authorEvidence: override?.authorEvidence ?? dryRun.authorEvidence,
    warning: override?.warning ?? null,
  };
}

function includeKindsFor(sections: DetectedBookSection[]): BookSectionKind[] {
  const kinds = [
    ...new Set(sections.filter((section) => section.includeByDefault).map((section) => section.kind)),
  ];
  return kinds.length > 0 ? kinds : ["chapter"];
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
  dryRun: DryRunBook,
  rawText: string,
  sections: DetectedBookSection[],
  contentHash: string,
  cleanupSummary: CleanupSummary,
  warnings: string[],
  metadata: ReturnType<typeof metadataFor>,
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
    title: metadata.title,
    author: metadata.author.length > 0 ? metadata.author : ["Unknown"],
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
        "Pilot write pass 9 processed this source from the audited Project Gutenberg text. Review generated output before any Cloudflare export.",
    },
    cover: {
      src: null,
      placeholder: true,
      alt: `Placeholder cover for ${metadata.title}`,
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
      "Generated by controlled pilot write pass 9; review before scaling to larger batches or Cloudflare export.",
      ...(cleanupSummary.imagePlaceholderLinesRemoved > 0
        ? ["Illustration/image placeholder lines removed from playable text."]
        : []),
      ...(cleanupSummary.inlinePageMarkersRemoved > 0
        ? ["Inline page markers removed from playable text."]
        : []),
      ...(cleanupSummary.trailingNonReadableBlocksRemoved > 0
        ? ["Trailing source, transcriber, catalog, or volume-note blocks removed from playable text."]
        : []),
      ...warnings,
    ],
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
      "Controlled pilot write pass 9 used audited Project Gutenberg public-domain source text after dry-run review. Generated output remains review-gated before any Cloudflare export.",
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

function sectionSummary(sections: DetectedBookSection[]): SectionReportSummary[] {
  return sections.map((section) => ({
    id: section.id,
    label: section.label,
    title: section.title,
    kind: section.kind,
    wordCount: section.wordCount,
  }));
}

function sourceLooksUnsafe(text: string): boolean {
  return /Project Gutenberg|Gutenberg License|START OF (?:THE|THIS) PROJECT GUTENBERG|END OF (?:THE|THIS) PROJECT GUTENBERG|www\.gutenberg|Distributed Proofreading|Transcriber's Notes?|Contact Us|Site Map|All Rights Reserved|Copyright ©/i.test(
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

function defaultTextHasCleanupArtifacts(text: string): boolean {
  return /\[(?:Illustration|Image|Plate|Pg\.?\s*\d+|\d+)\]/i.test(text);
}

function normalizedDuplicateKey(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/^the\s+/, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function duplicateNearDuplicateCheck(dryRun: DryRunBook): {
  blocking: boolean;
  message: string;
} {
  const library = readJson<GeneratedLibraryManifest>(libraryManifestPath);
  const expectedTitle = normalizedDuplicateKey(dryRun.expectedGeneratedTitle);
  const expectedAuthors = new Set(dryRun.expectedAuthor.map(normalizedDuplicateKey));
  const duplicate = library.books.find((book) => {
    if (book.slug === dryRun.slug) return true;
    if (normalizedDuplicateKey(book.title) !== expectedTitle) return false;
    return book.author.some((author) => expectedAuthors.has(normalizedDuplicateKey(author)));
  });

  if (!duplicate) {
    return {
      blocking: false,
      message: "passed: no existing generated slug matched the normalized title/author identity",
    };
  }

  if (duplicate.slug === dryRun.slug) {
    return {
      blocking: false,
      message: `passed: ${duplicate.slug} is the selected batch-9 slug and may be regenerated by this targeted command`,
    };
  }

  return {
    blocking: true,
    message: `blocked: existing generated slug ${duplicate.slug} already has title "${duplicate.title}" and author ${duplicate.author.join(", ")}; dry-run 9 did not document a distinct-version reason for creating ${dryRun.slug}`,
  };
}

function boundaryReport(
  cleanedText: string,
  lines: SourceLine[],
  section: DetectedBookSection | null,
  reason: string,
): BoundaryReport {
  if (!section) {
    return {
      cleanedLine: null,
      reason,
      snippet: null,
    };
  }
  const line = lineAtOffset(lines, section.sourceStartOffset);
  return {
    cleanedLine: line?.lineNumber ?? null,
    reason,
    snippet: snippetAtOffset(cleanedText, section.sourceStartOffset),
  };
}

function endBoundaryReport(
  cleanedText: string,
  lines: SourceLine[],
  section: DetectedBookSection | null,
  reason: string,
): BoundaryReport {
  if (!section) {
    return {
      cleanedLine: null,
      reason,
      snippet: null,
    };
  }
  const offset = Math.max(section.sourceStartOffset, section.sourceEndOffset - 260);
  const line = lineAtOffset(lines, offset);
  const cleanedSectionEnd = section.text
    .slice(Math.max(0, section.text.length - 260))
    .replace(/\s+/g, " ")
    .trim();
  return {
    cleanedLine: line?.lineNumber ?? null,
    reason,
    snippet: cleanedSectionEnd,
  };
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

  const expectedSectionFiles = new Set(
    sectionJson.map((section) => `${section.sectionId}.json`),
  );
  for (const existing of fs.readdirSync(sectionsDir)) {
    if (!existing.endsWith(".json") || expectedSectionFiles.has(existing)) continue;
    fs.rmSync(path.join(sectionsDir, existing), { force: true });
  }

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

function updatePreviewManifest(entries: PreviewEntry[]) {
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

Processed by pilot write pass 9.

- Source: ${report.sourceFileUsed}
- Start boundary: cleaned line ${report.startBoundaryUsed.cleanedLine ?? "n/a"} (${report.startBoundaryUsed.reason})
- End boundary: cleaned line ${report.endBoundaryUsed.cleanedLine ?? "n/a"} (${report.endBoundaryUsed.reason})
- Structural convention: ${report.structuralConvention}
- Sections after processing: ${report.sectionCount}
- Final recommendation: ${report.finalRecommendation}

This output is intentionally review-gated before larger batch processing or Cloudflare export.
`;
}

function makeSkippedReport(
  dryRun: DryRunBook,
  reason: string,
  duplicateNearDuplicateSlugCheckResult =
    "not checked because processing stopped before duplicate review",
): BookReport {
  return {
    slug: dryRun.slug,
    dryRunStatus: dryRun.currentStatus,
    finalAction: "skipped",
    sourceFileUsed: dryRun.sourceFileUsed,
    expectedTitle: dryRun.expectedGeneratedTitle,
    generatedTitle: null,
    expectedAuthor: dryRun.expectedAuthor,
    generatedAuthor: null,
    authorEvidence: dryRun.authorEvidence,
    generatedFilesChanged: [],
    previewAssetChanged: null,
    duplicateNearDuplicateSlugCheckResult,
    startBoundaryUsed: {
      cleanedLine: null,
      reason: dryRun.expectedStartBoundary,
      snippet: null,
    },
    endBoundaryUsed: {
      cleanedLine: null,
      reason: dryRun.expectedEndBoundary,
      snippet: null,
    },
    structuralConvention: dryRun.detectedStructuralConvention,
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
    titleDefaultStartRiskVerdict: "not generated",
    authorMetadataVerdict: "not generated",
    segmentationVerdict: "not generated",
    previewVerdict: "not generated",
    startupPreviewValid: false,
    allMainReadableDefaultVerdict: "not generated",
    remainingWarnings: [reason],
    supportingSnippets: {
      title: dryRun.snippets.title,
      author: dryRun.snippets.author,
      start: dryRun.snippets.start,
      end: dryRun.snippets.end,
    },
    finalRecommendation: "skipped",
  };
}

function processSelectedBook(dryRun: DryRunBook): {
  report: BookReport;
  manifest: GeneratedBookManifest | null;
  previewEntry: PreviewEntry | null;
} {
  const metadata = metadataFor(dryRun);
  const sourcePath = path.resolve(repoRoot, dryRun.sourceFileUsed);
  assertInside(tempBooksRoot, sourcePath);
  const perBookMarkdownPath = path.join(dryRunRoot, "books", `${dryRun.slug}.md`);
  if (!fs.existsSync(perBookMarkdownPath)) {
    throw new Error(`${dryRun.slug}: per-book dry-run report missing.`);
  }
  fs.readFileSync(perBookMarkdownPath, "utf8");
  const manualSkipReason = MANUAL_SKIP_REASONS[dryRun.slug];
  if (manualSkipReason) {
    return {
      report: makeSkippedReport(dryRun, manualSkipReason, manualSkipReason),
      manifest: null,
      previewEntry: null,
    };
  }
  const duplicateCheck = duplicateNearDuplicateCheck(dryRun);

  if (dryRun.currentStatus !== "needs first-time controlled processing" || dryRun.candidateType !== "raw-only") {
    return {
      report: makeSkippedReport(
        dryRun,
        "Dry-run entry is not a raw-only first-time processing candidate.",
        duplicateCheck.message,
      ),
      manifest: null,
      previewEntry: null,
    };
  }
  if (duplicateCheck.blocking) {
    return {
      report: makeSkippedReport(dryRun, duplicateCheck.message, duplicateCheck.message),
      manifest: null,
      previewEntry: null,
    };
  }
  if (
    metadata.author.length === 0 ||
    metadata.author.some((author) => /^unknown author$/i.test(author))
  ) {
    return {
      report: makeSkippedReport(
        dryRun,
        "Expected author was missing or unknown despite dry-run author evidence.",
        duplicateCheck.message,
      ),
      manifest: null,
      previewEntry: null,
    };
  }

  const rawText = fs.readFileSync(sourcePath, "utf8");
  const cleanupSummary = emptyCleanupSummary();
  const built = buildSectionsForBook(dryRun, rawText, cleanupSummary);
  const cleanedLines = lineRecords(built.cleanedText);
  const sections = built.sections;
  const expectedFinalCount =
    EXPECTED_FINAL_SECTION_COUNTS[dryRun.slug] ?? dryRun.likelySectionCount;
  const warnings = [
    ...built.warnings,
    ...dryRun.cleanupRisks.map((risk) => `dry-run cleanup risk: ${risk}`),
    ...dryRun.titleDefaultStartRisks.map((risk) => `dry-run title/default-start risk: ${risk}`),
    ...dryRun.authorMetadataRisks.map((risk) => `dry-run author metadata risk: ${risk}`),
    ...dryRun.collectionTitleLeakageRisks.map((risk) => `dry-run collection-title risk: ${risk}`),
    ...dryRun.illustrationPageMarkerFootnoteRisks.map((risk) => `dry-run artifact risk: ${risk}`),
  ];
  if (metadata.warning) warnings.push(metadata.warning);

  if (sections.length !== expectedFinalCount) {
    return {
      report: makeSkippedReport(
        dryRun,
        `Detected ${sections.length} safe sections; expected ${expectedFinalCount} for this write pass.`,
        duplicateCheck.message,
      ),
      manifest: null,
      previewEntry: null,
    };
  }

  const defaultSections = sections.filter((section) => section.includeByDefault);
  const firstDefault = defaultSections[0];
  if (!firstDefault || previewLooksUnsafe(firstDefault.text)) {
    return {
      report: makeSkippedReport(
        dryRun,
        "First default section did not pass readable-content safety checks.",
        duplicateCheck.message,
      ),
      manifest: null,
      previewEntry: null,
    };
  }
  if (defaultSections.some((section) => sourceLooksUnsafe(section.text))) {
    return {
      report: makeSkippedReport(
        dryRun,
        "Default playable sections still include Gutenberg/source/transcriber material.",
        duplicateCheck.message,
      ),
      manifest: null,
      previewEntry: null,
    };
  }
  if (defaultSections.some((section) => defaultTextHasCleanupArtifacts(section.text))) {
    return {
      report: makeSkippedReport(
        dryRun,
        "Default playable sections still include illustration, page-marker, or bracketed-number artifacts.",
        duplicateCheck.message,
      ),
      manifest: null,
      previewEntry: null,
    };
  }

  if (dryRun.slug === "the-warden") {
    warnings.push("Dry-run likely section count was 20; write inspection found and preserved real Chapter XX, for 21 total.");
  }
  if (dryRun.slug === "the-virginian-a-horseman-of-the-plains") {
    warnings.push("Dry-run likely section count was 38; write inspection removed two lowercase prose false positives, for 36 total.");
  }

  const contentHash = buildContentHash(dryRun.slug, metadata.title, metadata.author, sections);
  const manifest = buildManifest(dryRun, rawText, sections, contentHash, cleanupSummary, warnings, metadata);
  const sectionJson = sections.map((section) => makeSectionJson(manifest.slug, section));
  const cleanedBook = buildCleanedBook(manifest, sections);
  const processedBook = buildProcessedBook(manifest, sections);
  const rightsReport = buildRightsReport(manifest, rawText);
  const preview = makePreviewAsset(manifest, sections);
  if (previewLooksUnsafe(preview.asset.previewText)) {
    return {
      report: makeSkippedReport(
        dryRun,
        "Generated preview did not pass readable-content safety checks.",
        duplicateCheck.message,
      ),
      manifest: null,
      previewEntry: null,
    };
  }

  const report: BookReport = {
    slug: dryRun.slug,
    dryRunStatus: dryRun.currentStatus,
    finalAction: "first-time processed",
    sourceFileUsed: dryRun.sourceFileUsed,
    expectedTitle: metadata.title,
    generatedTitle: manifest.title,
    expectedAuthor: metadata.author,
    generatedAuthor: manifest.author,
    authorEvidence: metadata.authorEvidence,
    generatedFilesChanged: [],
    previewAssetChanged: null,
    duplicateNearDuplicateSlugCheckResult: duplicateCheck.message,
    startBoundaryUsed: boundaryReport(
      built.cleanedText,
      cleanedLines,
      sections[0] ?? null,
      `${dryRun.expectedStartBoundary}; write pass starts at first selected/default section`,
    ),
    endBoundaryUsed: endBoundaryReport(
      built.cleanedText,
      cleanedLines,
      sections[sections.length - 1] ?? null,
      `${dryRun.expectedEndBoundary}; write pass keeps the final readable section and trims trailing source noise`,
    ),
    structuralConvention: built.structuralConvention,
    firstDefaultSectionAfterProcessing: firstDefaultSnapshot(sections),
    sectionCount: sections.length,
    first5SectionsWithWordCounts: sectionSummary(sections).slice(0, 5),
    last5SectionsWithWordCounts: sectionSummary(sections).slice(-5),
    cleanupActionsApplied: cleanupSummary,
    titleDefaultStartRiskVerdict:
      manifest.title === metadata.title && !sourceLooksUnsafe(firstDefault.text)
        ? "passed: generated title and first default section match audited source identity"
        : "requires review",
    authorMetadataVerdict:
      JSON.stringify(manifest.author) === JSON.stringify(metadata.author)
        ? `passed: author metadata comes from ${metadata.authorEvidence.source}`
        : "requires review",
    segmentationVerdict:
      "passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used",
    previewVerdict: `valid book-specific preview from ${preview.sourceSections.join(", ")}`,
    startupPreviewValid: true,
    allMainReadableDefaultVerdict:
      defaultSections.length === sections.length
        ? "all generated readable sections included by default"
        : "default section selection requires review",
    remainingWarnings: warnings,
    supportingSnippets: {
      title: dryRun.snippets.title,
      author: metadata.authorEvidence.text,
      start: dryRun.snippets.start,
      end: dryRun.snippets.end,
    },
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

function writeMarkdownReport(report: {
  generatedAt: string;
  totals: Record<string, number>;
  selectedBooks: string[];
  acceptedExclusionClarification: {
    dryRunAcceptedExclusionCount: number;
    includesDuplicateSkip: boolean;
    duplicateSkipSlug: string;
    acceptedCorrectedVerifiedCountExcludingDuplicateSkip: number;
    selectedIntersectAcceptedExclusion: string[];
    note: string;
  };
  unresolvedSourceGeneratedBooks: UnresolvedSourceBook[];
  books: BookReport[];
}) {
  const lines = [
    "# Pilot write batch 9",
    "",
    "Controlled first-time processing pass for the exact raw-only books selected by pilot dry-run batch 9.",
    "",
    "## Totals",
    "",
    `- Selected: ${report.totals.selected}`,
    `- First-time processed: ${report.totals.firstTimeProcessed}`,
    `- Skipped: ${report.totals.skipped}`,
    `- Unresolved-source generated left untouched: ${report.totals.unresolvedSourceGeneratedBooksLeftUntouched}`,
    "",
    "## Accepted Exclusion Count Clarification",
    "",
    `- Dry-run accepted/corrected/verified exclusion count: ${report.acceptedExclusionClarification.dryRunAcceptedExclusionCount}`,
    `- Includes duplicate skip: ${report.acceptedExclusionClarification.includesDuplicateSkip ? "yes" : "no"} (${report.acceptedExclusionClarification.duplicateSkipSlug})`,
    `- Accepted/corrected/verified count excluding duplicate skip: ${report.acceptedExclusionClarification.acceptedCorrectedVerifiedCountExcludingDuplicateSkip}`,
    `- Selected books intersecting accepted exclusions: ${report.acceptedExclusionClarification.selectedIntersectAcceptedExclusion.length > 0 ? report.acceptedExclusionClarification.selectedIntersectAcceptedExclusion.join(", ") : "none"}`,
    `- Note: ${report.acceptedExclusionClarification.note}`,
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
      `- Expected/generated title: ${book.expectedTitle} / ${book.generatedTitle ?? "n/a"}`,
      `- Expected/generated author: ${book.expectedAuthor.join(", ")} / ${book.generatedAuthor?.join(", ") ?? "n/a"}`,
      `- Author evidence: ${book.authorEvidence.source} - ${book.authorEvidence.text}`,
      `- Duplicate/near-duplicate slug check: ${book.duplicateNearDuplicateSlugCheckResult}`,
      `- Structure: ${book.structuralConvention}`,
      `- Start boundary: cleaned line ${book.startBoundaryUsed.cleanedLine ?? "n/a"} - ${book.startBoundaryUsed.reason}`,
      `- End boundary: cleaned line ${book.endBoundaryUsed.cleanedLine ?? "n/a"} - ${book.endBoundaryUsed.reason}`,
      `- First default section after: ${book.firstDefaultSectionAfterProcessing.label ?? "n/a"} (${book.firstDefaultSectionAfterProcessing.wordCount ?? "n/a"} words)`,
      `- Section count: ${book.sectionCount}`,
      `- Title/default-start verdict: ${book.titleDefaultStartRiskVerdict}`,
      `- Author metadata verdict: ${book.authorMetadataVerdict}`,
      `- Segmentation verdict: ${book.segmentationVerdict}`,
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
      `- Title: ${book.supportingSnippets.title}`,
      `- Author: ${book.supportingSnippets.author}`,
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
  writeText(path.join(writeReportRoot, "pilot-write-9.md"), `${lines.join("\n").trimEnd()}\n`);
}

function main() {
  const dryRun = readJson<DryRunReport>(dryRunReportPath);
  if (dryRun.reportName !== "pilot-dry-run-9") {
    throw new Error(`Unexpected dry-run report ${dryRun.reportName}.`);
  }
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
  if (JSON.stringify(dryRun.selectedBooks) !== JSON.stringify([...SELECTED_BATCH])) {
    throw new Error(`Dry-run selectedBooks field mismatch: ${dryRun.selectedBooks.join(", ")}`);
  }
  for (const slug of UNRESOLVED_SOURCE_GENERATED_BOOKS) {
    if (!dryRun.unresolvedSourceGeneratedBooksLeftUntouched.some((book) => book.slug === slug)) {
      throw new Error(`Dry-run unresolved-source list is missing ${slug}.`);
    }
  }

  const reports: BookReport[] = [];
  const manifests: GeneratedBookManifest[] = [];
  const previewEntries: PreviewEntry[] = [];

  for (const slug of SELECTED_BATCH) {
    const dryRunBook = dryRun.books.find((book) => book.slug === slug);
    if (!dryRunBook) throw new Error(`${slug}: dry-run book missing.`);
    const result = processSelectedBook(dryRunBook);
    reports.push(result.report);
    if (result.manifest) manifests.push(result.manifest);
    if (result.previewEntry) previewEntries.push(result.previewEntry);
  }

  if (manifests.length > 0) updateLibraryManifest(manifests);
  if (previewEntries.length > 0) updatePreviewManifest(previewEntries);

  const processed = reports.filter((book) => book.finalAction === "first-time processed");
  const skipped = reports.filter((book) => book.finalAction === "skipped");
  const generatedAt = new Date().toISOString();
  const acceptedExclusionClarification = {
    dryRunAcceptedExclusionCount: dryRun.acceptedExclusion.count,
    includesDuplicateSkip: true,
    duplicateSkipSlug: "the-wind-in-the-willows",
    acceptedCorrectedVerifiedCountExcludingDuplicateSkip: dryRun.acceptedExclusion.count - 1,
    selectedIntersectAcceptedExclusion: [] as string[],
    note:
      "The dry-run count of 162 includes the carried-forward duplicate skip for the-wind-in-the-willows; the expected accepted/corrected/verified processed-book count remains 161 excluding that skip. This write pass uses only the exact selected list from pilot-dry-run-9.json.",
  };
  const jsonReport = {
    schemaVersion: 1,
    reportName: "pilot-write-9",
    generatedAt,
    branch: "morsewords-book-processing-pilot-write-9-jun-2026",
    mode: "controlled first-time processing",
    sourceDryRunReport: statusPath(dryRunReportPath),
    selectedBooks: [...SELECTED_BATCH],
    totals: {
      selected: SELECTED_BATCH.length,
      firstTimeProcessed: processed.length,
      skipped: skipped.length,
      manualReview: reports.filter((book) => book.finalRecommendation === "needs manual review").length,
      blocked: 0,
      unresolvedSourceGeneratedBooksLeftUntouched: dryRun.unresolvedSourceGeneratedBooksLeftUntouched.length,
    },
    acceptedExclusionClarification,
    unresolvedSourceGeneratedBooksLeftUntouched: dryRun.unresolvedSourceGeneratedBooksLeftUntouched,
    futureBatchRule: FUTURE_BATCH_RULE,
    laterPhaseRequirements: LATER_PHASE_REQUIREMENTS,
    books: reports,
  };

  writeJson(path.join(writeReportRoot, "pilot-write-9.json"), jsonReport);
  writeMarkdownReport({
    generatedAt,
    totals: jsonReport.totals,
    selectedBooks: [...SELECTED_BATCH],
    acceptedExclusionClarification,
    unresolvedSourceGeneratedBooks: dryRun.unresolvedSourceGeneratedBooksLeftUntouched,
    books: reports,
  });

  console.log(
    `Pilot write 9 complete: ${processed.length} first-time processed, ${skipped.length} skipped, ${dryRun.unresolvedSourceGeneratedBooksLeftUntouched.length} unresolved-source generated books untouched.`,
  );
}

main();
