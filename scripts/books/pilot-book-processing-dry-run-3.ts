import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  BookMetadata,
  BookSectionKind,
  DetectedBookSection,
} from "./bookManifestTypes.ts";
import {
  countBookWords,
  estimateMorseCharacters,
  textPreview,
  trimBookText,
} from "./bookTextNormalization.ts";
import {
  analyzeBookStructure,
  buildDetectedSectionsFromStructure,
  type BookHeadingPatternSummary,
  type BookStructureAnalysis,
  type RejectedBookHeadingStrategy,
} from "./lib/book-structure-detection.ts";

type RiskLevel = "low" | "medium" | "high" | "blocked";
type DryRunRecommendation =
  | "safe to process later"
  | "process later with warnings"
  | "needs individual review"
  | "blocked";
type StructureDetectionStatus = "pass" | "warn" | "fail";

type DryRunStructureDetection = {
  detectedStructuralConvention: string;
  selectedHeadingStrategy: BookHeadingPatternSummary | null;
  candidateHeadingPatternsFound: BookHeadingPatternSummary[];
  rejectedHeadingStrategies: RejectedBookHeadingStrategy[];
  tocEntriesDetected: boolean;
  bodyHeadingsDetected: boolean;
  sectionCountFromSelectedStrategy: number;
  fallbackUsed: boolean;
  fallbackLegitimacy: "legitimate" | "suspicious" | "not required";
  fallbackReason: string | null;
  status: StructureDetectionStatus;
  warnings: string[];
  bodyChapterHeadingCount: number;
  bodyHeadingExamples: string[];
  tocHeadingExamples: string[];
  priorTwoSectionCollapseFixed: boolean;
};

type BoundaryContext = {
  line: number | null;
  index: number | null;
  confidence: "high" | "medium" | "low" | "blocked";
  candidateSnippet: string;
  linesBefore: string[];
  linesAfter: string[];
};

type Pass2Book = {
  sourceFilename: string;
  sourcePath: string;
  slug: string;
  title: string;
  existingGeneratedOutputExists: boolean;
  approximateRawWordCount: number;
  pass2Risk: RiskLevel;
  pass2RiskReasons: string[];
  candidateStart: BoundaryContext;
  candidateEnd: BoundaryContext;
  protectedRealContentFlags: string[];
  cleanupArtifactSummary: {
    tableOfContentsRanges: number;
    tableOfContentsAppearsIsolated: boolean;
    tableOfContentsBleedsIntoCandidate: boolean;
    transcriberEditorNoteRanges: number;
    footnoteReferenceRanges: number;
    illustrationImagePlaceholders: number;
    numberedBracketReferences: number;
    uniqueNumberedBracketReferences: number;
    decorativePageMarkers: number;
    decorativeMarkersNearBoundary: boolean;
    dashNormalizationCandidates: number;
    severeUnicodeOrOcrArtifacts: number;
    nonstandardStructureSignals: string[];
  };
  generatedOutputWarning: {
    issueTypes: string[];
    confidence: string;
    evidence: string[];
    recommendedFixLater: string;
  } | null;
  firstHourPreviewCanBeSafelyDerivedLater: boolean;
};

type Pass2Report = {
  books: Pass2Book[];
};

type TextLine = {
  lineNumber: number;
  offset: number;
  text: string;
};

type GeneratedSectionManifest = {
  id: string;
  kind: string;
  label: string;
  title: string | null;
  includeByDefault: boolean;
  sectionJsonPath: string;
  characterCount?: number;
  wordCount?: number;
  textPreview?: string;
};

type GeneratedManifest = {
  slug: string;
  title: string;
  author?: string[];
  stats?: {
    cleanedCharacterCount?: number;
    wordCount?: number;
    sectionCount?: number;
    includedSectionCount?: number;
  };
  sections?: GeneratedSectionManifest[];
  warnings?: string[];
};

type SectionSummary = {
  id: string;
  kind: BookSectionKind;
  label: string;
  title: string | null;
  includeByDefault: boolean;
  wordCount: number;
  characterCount: number;
  estimatedListeningMinutes: number;
  textPreview: string;
};

type CandidateJson = {
  slug: string;
  selectionReason: string;
  title: string;
  author: string[];
  sourcePath: string;
  pass2RiskLevel: RiskLevel;
  dryRunRecommendation: DryRunRecommendation;
  boundaries: {
    startLine: number | null;
    startIndex: number | null;
    startSnippet: string;
    endLine: number | null;
    endIndex: number | null;
    endSnippet: string;
  };
  wordCounts: {
    raw: number;
    kept: number;
    removedFrontMatter: number;
    removedEndMatter: number;
  };
  sections: SectionSummary[];
  structureDetection: DryRunStructureDetection;
  cleanupSimulation: CleanupSimulation;
  firstHourPreviewCandidate: FirstHourPreviewCandidate;
  comparisonAgainstExistingGeneratedOutput: ExistingGeneratedComparison;
  manualReviewChecklist: string[];
};

type CleanupSimulation = {
  cleanedWordCountEstimate: number;
  actions: Array<{ action: string; count: number; recommendation: string; samples: string[] }>;
  warnings: string[];
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

type FirstHourPreviewCandidate = {
  feasible: boolean;
  confidence: "high" | "medium" | "low";
  sectionsUsed: string[];
  approximateWordCount: number;
  startsAtRealReadableContent: boolean;
  snippet: string;
  notes: string[];
};

type BookDryRun = {
  slug: string;
  selectionReason: string;
  sourceFilename: string;
  sourcePath: string;
  pass2RiskLevel: RiskLevel;
  existingGeneratedOutputExists: boolean;
  candidateTitle: string;
  candidateAuthor: string[];
  rawWordCount: number;
  keptWordCountEstimate: number;
  removedFrontMatterWordCountEstimate: number;
  removedEndMatterWordCountEstimate: number;
  candidateStartLine: number | null;
  candidateStartIndex: number | null;
  candidateStartHeadingOrSnippet: string;
  linesBeforeCandidateStart: string[];
  candidateEndLine: number | null;
  candidateEndIndex: number | null;
  candidateEndHeadingOrSnippet: string;
  linesAfterCandidateEnd: string[];
  proposedSections: SectionSummary[];
  firstFiveProposedSections: SectionSummary[];
  lastFiveProposedSections: SectionSummary[];
  suspiciouslyShortSections: SectionSummary[];
  suspiciouslyLongSections: SectionSummary[];
  structureDetection: DryRunStructureDetection;
  artifactsDetectedAndCleanupAction: CleanupSimulation;
  footnoteReferenceHandlingRecommendation: string;
  illustrationImagePlaceholderHandlingRecommendation: string;
  dashNormalizationRecommendation: string;
  firstHourPreviewCandidate: FirstHourPreviewCandidate;
  comparisonAgainstExistingGeneratedOutput: ExistingGeneratedComparison;
  manualReviewChecklist: string[];
  boundaryAdjustments: string[];
  finalDryRunRecommendation: DryRunRecommendation;
  recommendationReasons: string[];
  candidateJsonPath: string;
  perBookMarkdownPath: string;
};

type DryRunReport = {
  schemaVersion: 1;
  reportName: "pilot-dry-run-3";
  generatedAt: string;
  inputReports: {
    pass1Json: string;
    pass2Json: string;
    structureAudit1Json: string;
    pilotDryRun1Json: string;
    pilotWrite1Json: string;
    pilotWrite1VerificationJson: string;
    pilotDryRun2Json: string;
    pilotWrite2VerificationJson: string;
  };
  paths: {
    tempBooks: string;
    generatedBooks: string;
    cloudflareExport: string;
    dryRunRoot: string;
  };
  pilotBatch: string[];
  totals: {
    pilotBooksRequested: number;
    pilotBooksProcessed: number;
    safeToProcessLater: number;
    processLaterWithWarnings: number;
    needsIndividualReview: number;
    blocked: number;
  };
  commonCleanupIssues: Array<{ category: string; count: number; examples: string[] }>;
  commonBoundaryRisks: Array<{ category: string; count: number; examples: string[] }>;
  existingGeneratedOutputsAppearDamaged: Array<{
    slug: string;
    apparentDamage: string[];
  }>;
  processorSafetyAssessment: {
    seemsSafeEnoughForRealPilotWritePass: boolean;
    reason: string;
    recommendedNextStep: string;
  };
  confirmations: {
    tempBooksModified: false;
    generatedOutputsModified: false;
    cloudflareExportModified: false;
    candidateOutputsAreReviewOnly: true;
  };
  books: BookDryRun[];
};

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const TEMP_BOOKS_ROOT = path.join(REPO_ROOT, "app/client/assets/temp-books");
const GENERATED_ROOT = path.join(REPO_ROOT, "app/client/assets/books/generated");
const CLOUDFLARE_EXPORT_ROOT = path.join(
  REPO_ROOT,
  "app/client/assets/books/cloudflare-export",
);
const AUDIT_REPORT_ROOT = path.join(
  REPO_ROOT,
  "app/client/assets/books/audit-reports",
);
const DRY_RUN_ROOT = path.join(AUDIT_REPORT_ROOT, "pilot-dry-run-3");
const DRY_RUN_BOOKS_ROOT = path.join(DRY_RUN_ROOT, "books");
const DRY_RUN_CANDIDATES_ROOT = path.join(DRY_RUN_ROOT, "candidates");
const PASS_1_JSON_PATH = path.join(
  AUDIT_REPORT_ROOT,
  "book-processing-audit-pass-1.json",
);
const PASS_2_JSON_PATH = path.join(
  AUDIT_REPORT_ROOT,
  "book-processing-audit-pass-2.json",
);
const STRUCTURE_AUDIT_1_JSON_PATH = path.join(
  AUDIT_REPORT_ROOT,
  "book-structure-audit-1/book-structure-audit-1.json",
);
const PILOT_DRY_RUN_1_JSON_PATH = path.join(
  AUDIT_REPORT_ROOT,
  "pilot-dry-run-1/pilot-dry-run-1.json",
);
const PILOT_WRITE_1_JSON_PATH = path.join(
  AUDIT_REPORT_ROOT,
  "pilot-write-1/pilot-write-1.json",
);
const PILOT_WRITE_1_VERIFICATION_JSON_PATH = path.join(
  AUDIT_REPORT_ROOT,
  "pilot-write-1-verification/pilot-write-1-verification.json",
);
const PILOT_DRY_RUN_2_JSON_PATH = path.join(
  AUDIT_REPORT_ROOT,
  "pilot-dry-run-2/pilot-dry-run-2.json",
);
const PILOT_WRITE_2_VERIFICATION_JSON_PATH = path.join(
  AUDIT_REPORT_ROOT,
  "pilot-write-2-verification/pilot-write-2-verification.json",
);
const MAIN_JSON_PATH = path.join(DRY_RUN_ROOT, "pilot-dry-run-3.json");
const MAIN_MARKDOWN_PATH = path.join(DRY_RUN_ROOT, "pilot-dry-run-3.md");

const PILOT_BATCH = [
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

const PILOT_SELECTION_REASONS: Record<(typeof PILOT_BATCH)[number], string> = {
  frankenstein:
    "High-confidence chapter-Arabic structure with clear boundaries and a feasible first-hour preview; useful canonical novel baseline.",
  "the-three-musketeers":
    "High-confidence chapter-Roman structure with many regular chapters, selected to test longer adventure fiction without severe boundary ambiguity.",
  "a-tale-of-two-cities":
    "High-confidence chapter-Roman structure with book-level divisions, selected to test nested book/chapter handling in a familiar novel.",
  "around-the-world-in-eighty-days":
    "High-confidence chapter-Roman structure with regular chapters and low cleanup risk.",
  cranford:
    "High-confidence chapter-Roman structure with manageable length and clear start/end markers.",
  "little-fuzzy":
    "High-confidence standalone Roman-numbered sections, selected to test section numbering that is not explicitly chapter-labeled.",
  macbeth:
    "High-confidence play structure, selected as a cautious act/scene case after audit data indicated safe enough boundaries.",
  persuasion:
    "High-confidence chapter-Roman structure with clean boundaries and a feasible preview source.",
  pygmalion:
    "High-confidence play structure with explicit acts, selected to test dramatic text parsing without expanding to chaotic plays.",
  "sense-and-sensibility":
    "High-confidence chapter-Roman structure with regular boundaries and a useful existing-output comparison.",
  "the-adventures-of-tom-sawyer":
    "High-confidence chapter-Roman structure with regular chapters and low severe-artifact risk.",
  "the-door-in-the-wall":
    "High-confidence standalone Roman sections in a short collection-like source, selected to test titled/numbered short-work handling.",
  "the-hound-of-the-baskervilles":
    "High-confidence chapter-Arabic structure with clear chapter titles and feasible preview source.",
  "the-king-in-yellow":
    "High-confidence standalone Roman sections, selected to test story/section boundaries in a collection-shaped work.",
  "the-life-and-adventures-of-robinson-crusoe":
    "High-confidence chapter-Roman structure with prefatory material to review conservatively without severe boundary ambiguity.",
  "the-maltese-falcon":
    "High-confidence standalone Arabic-numbered sections with clear body divisions and no blocked-source signal.",
  "the-tempest":
    "High-confidence play structure, selected as a second controlled act/scene case with clear source formatting.",
  "the-turn-of-the-screw":
    "High-confidence standalone Roman sections with clear narrative divisions and manageable cleanup risk.",
  "the-war-of-the-worlds":
    "High-confidence Roman-numbered sections with book divisions, selected to exercise nested structural reporting.",
  "the-wendigo":
    "High-confidence standalone Roman sections in a shorter work with feasible preview boundaries.",
  "wuthering-heights":
    "High-confidence chapter-Roman structure with regular sections and useful comparison against any existing generated output.",
  "anne-of-avonlea":
    "High-confidence standalone Roman sections with clear readable boundaries and a feasible preview candidate.",
  "five-weeks-in-a-balloon":
    "High-confidence chapter word-ordinal structure, selected to test a less common but regular heading convention.",
  "moby-dick":
    "Medium-confidence chapter-Arabic structure with major divisions, selected for dry-run-only review of a large but structured book.",
  "tales-of-war":
    "Medium-confidence isolated titled sections, selected to test story-level sectioning where audit data did not show severe ambiguity.",
};

const EXCLUDED_FROM_BATCH_3 = [
  "almayer-s-folly-a-story-of-an-eastern-river",
  "the-house-without-a-key",
  "the-lerouge-case",
  "a-dream-of-armageddon",
  "a-journey-to-the-centre-of-the-earth",
  "a-journal-of-the-plague-year",
  "dracula",
  "anne-of-green-gables",
  "pointed-roofs",
  "the-lost-world",
  "the-red-thumb-mark",
  "violet-fairy-book",
  "jack-and-jill",
  "the-wonderful-wizard-of-oz",
  "the-legend-of-sleepy-hollow",
  "four-day-planet",
  "room-13",
  "the-octopus-a-story-of-california",
  "the-prince-and-the-pauper",
  "triplanetary",
  "the-call-of-the-wild",
  "a-christmas-carol",
  "dr-jekyll-and-mr-hyde",
  "a-catastrophe",
  "new-text-document",
  "screenshot-2026-06-13-014010",
  "in-the-abyss",
  "pollock-and-the-porroh-man",
  "the-colour-out-of-space",
  "the-plattner-story",
] as const;

const IMAGE_PLACEHOLDER_PATTERN =
  /\[(?:Illustration|Illustrations|Plate|Image|Map|Music|Facsimile|Portrait)[^\]]*\]/gi;
const NUMBERED_REFERENCE_PATTERN = /\[(\d{1,3})\]/g;
const PAGE_MARKER_LINE_PATTERN =
  /^\s*(?:\[?Page\s+\d+\]?|\[Pg\.?\s*\d+\]|\[\d+\]|-\s*\d+\s*-)\s*$/i;
const DECORATIVE_LINE_PATTERN =
  /^\s*[-_=*~.#:;'"`^+|\\/<>{}[\]().,!\u2013\u2014 ]{4,}\s*$/;
const SOURCE_NOISE_PATTERN =
  /[Pp]roject [Gg]utenberg|PROJECT GUTENBERG|Gutenberg(?:-|\u2122)|[Gg]utenberg [Ll]icense|[Dd]istributed [Pp]roofreading|^\s*(?:Produced by|Release date:|Language:|Credits:)|www\.gutenberg|Creating the works from print editions|PGLAF/;
const REAL_OPENING_PATTERN =
  /^(?:preface|introduction|prologue|foreword|dedication|epigraph|author'?s note|translator'?s note|chapter|book|part|volume|stave|canto|act)\b/i;
const GUTENBERG_END_MARKER =
  /^\s*\*{0,3}\s*END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK\b.*\*{0,3}\s*$/i;
const GUTENBERG_START_MARKER =
  /^\s*\*{0,3}\s*START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK\b.*\*{0,3}\s*$/i;
const TARGET_PREVIEW_WORDS = 900;
const SHORT_SECTION_WORDS = 80;
const LONG_SECTION_WORDS = 18_000;

function toPosixPath(input: string): string {
  return input.split(path.sep).join("/");
}

function relativeToRepo(filePath: string): string {
  return toPosixPath(path.relative(REPO_ROOT, filePath));
}

function resolveRepoPath(repoRelativePath: string): string {
  return path.resolve(REPO_ROOT, repoRelativePath);
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function readJsonIfExists<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return null;
  return readJson<T>(filePath);
}

function normalizeBoundaryText(input: string): string {
  return input
    .replace(/^\uFEFF/, "")
    .replace(/\r\n|\r/g, "\n")
    .replace(/[ \t]+\n/g, "\n");
}

function buildLines(text: string): TextLine[] {
  const rawLines = text.split("\n");
  const lines: TextLine[] = [];
  let offset = 0;
  rawLines.forEach((line, index) => {
    lines.push({ lineNumber: index + 1, offset, text: line });
    offset += line.length + 1;
  });
  return lines;
}

function lineStartIndex(lines: TextLine[], lineNumber: number | null): number | null {
  if (lineNumber === null) return null;
  const line = lines[lineNumber - 1];
  return line?.offset ?? null;
}

function lineEndIndex(lines: TextLine[], lineNumber: number | null): number | null {
  if (lineNumber === null) return null;
  const line = lines[lineNumber - 1];
  if (!line) return null;
  return line.offset + line.text.length;
}

function lineRangeText(lines: TextLine[], startLineIndex: number, endLineIndex: number): string {
  return lines
    .slice(Math.max(0, startLineIndex), Math.min(lines.length, endLineIndex + 1))
    .map((line) => line.text)
    .join("\n");
}

function lastNonEmptyLineBefore(lines: TextLine[], beforeLineIndex: number): number | null {
  for (let index = Math.min(lines.length - 1, beforeLineIndex); index >= 0; index -= 1) {
    if ((lines[index]?.text ?? "").trim()) return index + 1;
  }
  return null;
}

function firstGutenbergEndMarkerLine(lines: TextLine[], startLineNumber: number): number | null {
  for (let index = Math.max(0, startLineNumber - 1); index < lines.length; index += 1) {
    if (GUTENBERG_END_MARKER.test(lines[index]?.text ?? "")) return index + 1;
  }
  return null;
}

function firstReadableLineAfterSourceNoise(lines: TextLine[], startLineNumber: number): number {
  const startIndex = Math.max(0, startLineNumber - 1);
  const startLine = lines[startIndex]?.text ?? "";
  if (!SOURCE_NOISE_PATTERN.test(startLine) && !GUTENBERG_START_MARKER.test(startLine)) {
    return startLineNumber;
  }
  for (let index = startIndex + 1; index < Math.min(lines.length, startIndex + 120); index += 1) {
    const line = (lines[index]?.text ?? "").trim();
    if (!line) continue;
    if (SOURCE_NOISE_PATTERN.test(line) || GUTENBERG_START_MARKER.test(line)) continue;
    if (REAL_OPENING_PATTERN.test(line) || /[a-z]/.test(line)) return index + 1;
  }
  return startLineNumber;
}

function formattedContext(
  lines: TextLine[],
  startLineIndex: number,
  endLineIndex: number,
): string[] {
  if (endLineIndex < startLineIndex) return [];
  return lines
    .slice(Math.max(0, startLineIndex), Math.min(lines.length, endLineIndex + 1))
    .map((line) => {
      const preview = textPreview(line.text, 180);
      return preview ? `L${line.lineNumber}: ${preview}` : `L${line.lineNumber}: [blank]`;
    });
}

function extractAuthor(rawText: string, generatedManifest: GeneratedManifest | null): string[] {
  if (Array.isArray(generatedManifest?.author) && generatedManifest.author.length > 0) {
    return generatedManifest.author;
  }
  const authorMatch = rawText.match(/^Author:\s*(.+)$/im);
  if (authorMatch?.[1]) return [authorMatch[1].trim()];
  const bylineMatch = rawText.slice(0, 3000).match(/^\s*by\s+(.+)$/im);
  if (bylineMatch?.[1]) return [bylineMatch[1].trim()];
  return [];
}

function syntheticMetadata(book: Pass2Book, author: string[]): BookMetadata {
  return {
    schemaVersion: 1,
    slug: book.slug,
    metadataStatus: "draft",
    manualReviewRequired: true,
    title: book.title,
    author,
    language: "en",
    source: {
      provider: "Project Gutenberg",
      gutenbergId: null,
      sourceUrl: null,
      rawTextFile: book.sourcePath,
      releaseDate: null,
      rightsBasis: "public-domain-us",
      rightsReviewed: false,
      rightsNotes: "Dry-run metadata only; not used by the app.",
    },
    cover: {
      src: null,
      placeholder: true,
      alt: `${book.title} placeholder cover`,
    },
    description: "",
    subjects: [],
    originalPublicationYear: null,
    defaults: {
      includeKinds: [
        "dedication",
        "epigraph",
        "preface",
        "introduction",
        "prologue",
        "epilogue",
        "part",
        "book",
        "chapter",
        "scene",
        "poem",
        "letter",
        "appendix",
        "unknown",
      ],
      excludeKinds: [
        "title-page",
        "notes",
        "glossary",
        "index",
        "transcriber-note",
        "source-license",
        "advertisement",
      ],
      preferredPreset: "balanced",
    },
    sectionOverrides: [],
    cleanupRules: [],
  };
}

function readGeneratedManifest(slug: string): {
  manifest: GeneratedManifest | null;
  root: string | null;
  manifestPath: string | null;
} {
  const root = path.join(GENERATED_ROOT, slug);
  const manifestPath = path.join(root, "manifest.json");
  const manifest = readJsonIfExists<GeneratedManifest>(manifestPath);
  return manifest
    ? { manifest, root, manifestPath }
    : { manifest: null, root: null, manifestPath: null };
}

function countRegex(input: string, pattern: RegExp, maxSamples = 5): { count: number; samples: string[] } {
  const samples: string[] = [];
  let count = 0;
  pattern.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(input))) {
    count += 1;
    if (samples.length < maxSamples) samples.push(textPreview(match[0], 140));
  }
  return { count, samples };
}

function collectLineMatches(
  lines: string[],
  pattern: RegExp,
  maxSamples = 5,
): { count: number; samples: string[] } {
  let count = 0;
  const samples: string[] = [];
  lines.forEach((line, index) => {
    pattern.lastIndex = 0;
    if (!pattern.test(line)) return;
    count += 1;
    if (samples.length < maxSamples) samples.push(`candidate L${index + 1}: ${textPreview(line, 140)}`);
  });
  return { count, samples };
}

function simulateCleanup(keptText: string): CleanupSimulation {
  let candidateText = keptText;
  const warnings: string[] = [];
  const actions: CleanupSimulation["actions"] = [];
  const candidateLines = candidateText.split("\n");
  const imagePlaceholders = countRegex(candidateText, IMAGE_PLACEHOLDER_PATTERN, 8);
  const numberedReferences = countRegex(candidateText, NUMBERED_REFERENCE_PATTERN, 8);
  const pageMarkers = collectLineMatches(candidateLines, PAGE_MARKER_LINE_PATTERN, 8);
  const decorativeLines = collectLineMatches(candidateLines, DECORATIVE_LINE_PATTERN, 8);
  const nonbreakingSpaces = countRegex(candidateText, /\u00A0/g, 5);
  const ligatures = countRegex(candidateText, /[\uFB00-\uFB06]/g, 5);
  const smartQuotes = countRegex(candidateText, /[\u2018\u2019\u201C\u201D]/g, 5);
  const dashes = countRegex(candidateText, /[\u2013\u2014]/g, 8);
  const sourceNoiseLines = collectLineMatches(candidateLines, SOURCE_NOISE_PATTERN, 8);

  if (imagePlaceholders.count > 0) {
    candidateText = candidateText.replace(IMAGE_PLACEHOLDER_PATTERN, "");
    actions.push({
      action: "remove-image-placeholders",
      count: imagePlaceholders.count,
      recommendation: "Remove bracketed image placeholders from playback text; preserve nearby narrative captions only if meaningful.",
      samples: imagePlaceholders.samples,
    });
  }
  if (numberedReferences.count > 0) {
    candidateText = candidateText.replace(NUMBERED_REFERENCE_PATTERN, "");
    actions.push({
      action: "remove-numbered-reference-markers",
      count: numberedReferences.count,
      recommendation: "Remove inline numeric reference markers from playback text; keep footnote prose only after manual review.",
      samples: numberedReferences.samples,
    });
  }
  if (pageMarkers.count > 0 || decorativeLines.count > 0) {
    const before = candidateText.split("\n");
    candidateText = before
      .filter((line) => !PAGE_MARKER_LINE_PATTERN.test(line) && !DECORATIVE_LINE_PATTERN.test(line))
      .join("\n");
    actions.push({
      action: "remove-page-and-decorative-lines",
      count: pageMarkers.count + decorativeLines.count,
      recommendation: "Remove standalone page markers and decorative separators; do not remove prose punctuation.",
      samples: [...pageMarkers.samples, ...decorativeLines.samples].slice(0, 8),
    });
  }
  if (nonbreakingSpaces.count > 0) {
    candidateText = candidateText.replace(/\u00A0/g, " ");
    actions.push({
      action: "normalize-nonbreaking-spaces",
      count: nonbreakingSpaces.count,
      recommendation: "Replace nonbreaking spaces with normal spaces for consistent playback tokenization.",
      samples: nonbreakingSpaces.samples,
    });
  }
  if (ligatures.count > 0) {
    candidateText = candidateText
      .replace(/\uFB00/g, "ff")
      .replace(/\uFB01/g, "fi")
      .replace(/\uFB02/g, "fl")
      .replace(/\uFB03/g, "ffi")
      .replace(/\uFB04/g, "ffl")
      .replace(/\uFB05|\uFB06/g, "st");
    actions.push({
      action: "expand-ligatures",
      count: ligatures.count,
      recommendation: "Expand typographic ligatures to plain letters.",
      samples: ligatures.samples,
    });
  }
  if (smartQuotes.count > 0) {
    candidateText = candidateText
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"');
    actions.push({
      action: "normalize-smart-quotes",
      count: smartQuotes.count,
      recommendation: "Normalize smart quotes to ASCII quotes only in candidate playback text.",
      samples: smartQuotes.samples,
    });
  }
  if (dashes.count > 0) {
    candidateText = candidateText.replace(/[\u2013\u2014]/g, " - ");
    actions.push({
      action: "normalize-em-en-dashes",
      count: dashes.count,
      recommendation: "Normalize em/en dashes to spaced hyphen for Morse/audio playback, preserving sentence flow.",
      samples: dashes.samples,
    });
  }
  if (sourceNoiseLines.count > 0) {
    warnings.push("Candidate readable window still contains source/license-like lines; review boundaries before write processing.");
    actions.push({
      action: "review-source-noise-lines",
      count: sourceNoiseLines.count,
      recommendation: "Do not auto-remove these without boundary review; they may indicate an unsafe start/end.",
      samples: sourceNoiseLines.samples,
    });
  }

  return {
    cleanedWordCountEstimate: countBookWords(candidateText),
    actions,
    warnings,
  };
}

function sectionSummary(section: DetectedBookSection): SectionSummary {
  return {
    id: section.id,
    kind: section.kind,
    label: section.label,
    title: section.title,
    includeByDefault: section.includeByDefault,
    wordCount: section.wordCount,
    characterCount: section.characterCount,
    estimatedListeningMinutes: Math.max(1, Math.round(section.morseCharacterEstimate / 900)),
    textPreview: section.textPreview,
  };
}

function bodyChapterHeadingCount(structure: BookStructureAnalysis): number {
  return structure.allCandidateHeadingPatternsFound
    .filter((summary) => summary.kind === "chapter" && /^chapter-/.test(summary.patternId))
    .reduce((maximum, summary) => Math.max(maximum, summary.bodyLikeCount), 0);
}

function reliableTocExamples(structure: BookStructureAnalysis): string[] {
  const summaries = [
    structure.selectedHeadingStrategy,
    ...structure.allCandidateHeadingPatternsFound,
  ].filter((summary): summary is BookHeadingPatternSummary => Boolean(summary));
  for (const summary of summaries) {
    if (
      summary.tocExamples.length > 0 &&
      summary.bodyLikeCount > 0 &&
      !["all-caps-title", "isolated-title-case"].includes(summary.patternId)
    ) {
      return summary.tocExamples;
    }
  }
  return [];
}

function summarizeStructureDetection(
  structure: BookStructureAnalysis,
  sections: DetectedBookSection[],
  keptWordCount: number,
  sourceStructure: BookStructureAnalysis | null = null,
): DryRunStructureDetection {
  const warnings = [...structure.redFlags];
  if (structure.fallbackRequired) {
    warnings.push(
      `Fallback used: ${structure.fallbackReason ?? "no selected heading strategy"}.`,
    );
  }
  if (
    structure.likelyBodyHeadingsDetected &&
    sections.length <= 2 &&
    keptWordCount >= 30_000
  ) {
    warnings.push(
      `Only ${sections.length} section(s) were produced for ${keptWordCount} kept words despite body-heading evidence.`,
    );
  }
  if (
    structure.selectedHeadingStrategy &&
    structure.estimatedSectionCount > 0 &&
    sections.length < Math.floor(structure.estimatedSectionCount * 0.75)
  ) {
    warnings.push(
      `Built section count ${sections.length} is far below selected body heading count ${structure.estimatedSectionCount}.`,
    );
  }

  const status: StructureDetectionStatus =
    structure.confidenceLevel === "blocked" ||
    (structure.fallbackRequired && structure.fallbackLegitimacy === "suspicious")
      ? "fail"
      : warnings.length > 0 || structure.confidenceLevel !== "high"
        ? "warn"
        : "pass";
  const chapterCount = bodyChapterHeadingCount(structure);
  const tocExamples =
    reliableTocExamples(structure).length > 0
      ? reliableTocExamples(structure)
      : sourceStructure
        ? reliableTocExamples(sourceStructure)
        : [];

  return {
    detectedStructuralConvention: structure.detectedStructuralConvention,
    selectedHeadingStrategy: structure.selectedHeadingStrategy,
    candidateHeadingPatternsFound: structure.allCandidateHeadingPatternsFound,
    rejectedHeadingStrategies: structure.rejectedHeadingStrategies,
    tocEntriesDetected: tocExamples.length > 0,
    bodyHeadingsDetected: structure.likelyBodyHeadingsDetected,
    sectionCountFromSelectedStrategy: structure.estimatedSectionCount,
    fallbackUsed: structure.fallbackRequired,
    fallbackLegitimacy: structure.fallbackLegitimacy,
    fallbackReason: structure.fallbackReason,
    status,
    warnings: [...new Set(warnings)],
    bodyChapterHeadingCount: chapterCount,
    bodyHeadingExamples: structure.examplesOfDetectedBodyHeadings,
    tocHeadingExamples: tocExamples,
    priorTwoSectionCollapseFixed:
      chapterCount >= 10 && sections.length > 2 && !structure.fallbackRequired,
  };
}

function buildSections(keptText: string, book: Pass2Book, author: string[]): {
  sections: DetectedBookSection[];
  warnings: string[];
  structure: BookStructureAnalysis;
} {
  const metadata = syntheticMetadata(book, author);
  const structure = analyzeBookStructure(keptText, {
    rawWordCount: countBookWords(keptText),
  });
  return {
    ...buildDetectedSectionsFromStructure(keptText, structure, metadata),
    structure,
  };
}

function buildPreviewCandidate(
  sections: DetectedBookSection[],
  book: Pass2Book,
): FirstHourPreviewCandidate {
  const readable = sections.filter((section) => section.includeByDefault);
  const selected: DetectedBookSection[] = [];
  let wordCount = 0;
  for (const section of readable) {
    selected.push(section);
    wordCount += section.wordCount;
    if (wordCount >= TARGET_PREVIEW_WORDS) break;
  }
  const previewText = selected.map((section) => section.text).join("\n\n");
  const startsAtRealReadableContent =
    Boolean(selected[0]) &&
    !SOURCE_NOISE_PATTERN.test(selected[0]?.text.slice(0, 800) ?? "") &&
    !/^(?:contents|table of contents)$/i.test(selected[0]?.label ?? "");
  const confidence =
    book.pass2Risk === "low" && startsAtRealReadableContent
      ? "high"
      : book.pass2Risk === "medium" && startsAtRealReadableContent
        ? "medium"
        : "low";
  return {
    feasible: selected.length > 0 && startsAtRealReadableContent,
    confidence,
    sectionsUsed: selected.map((section) => `${section.id} ${section.label}`),
    approximateWordCount: wordCount,
    startsAtRealReadableContent,
    snippet: textPreview(previewText, 360),
    notes: [
      `Targets about ${TARGET_PREVIEW_WORDS} words as a first-hour source approximation for later generation.`,
      book.firstHourPreviewCanBeSafelyDerivedLater
        ? "Pass 2 marked first-hour preview derivation as feasible."
        : "Pass 2 did not mark first-hour preview derivation as safely derived; review before generation.",
    ],
  };
}

function compareGenerated(
  book: Pass2Book,
  generated: { manifest: GeneratedManifest | null; manifestPath: string | null },
): ExistingGeneratedComparison {
  if (!generated.manifest || !generated.manifestPath) {
    return {
      exists: false,
      manifestPath: null,
      sectionCount: 0,
      includedSectionCount: 0,
      firstSectionPreview: null,
      lastSectionPreview: null,
      suspiciousShortSections: [],
      suspiciousLongSections: [],
      apparentDamage: [],
    };
  }

  const sections = generated.manifest.sections ?? [];
  const suspiciousShortSections = sections
    .filter((section) => (section.wordCount ?? 0) > 0 && (section.wordCount ?? 0) < SHORT_SECTION_WORDS)
    .slice(0, 10)
    .map((section) => ({
      id: section.id,
      label: section.label,
      wordCount: section.wordCount ?? 0,
    }));
  const suspiciousLongSections = sections
    .filter((section) => (section.wordCount ?? 0) > LONG_SECTION_WORDS)
    .slice(0, 10)
    .map((section) => ({
      id: section.id,
      label: section.label,
      wordCount: section.wordCount ?? 0,
    }));
  const apparentDamage: string[] = [];
  if (book.generatedOutputWarning) {
    apparentDamage.push(...book.generatedOutputWarning.issueTypes);
  }
  if ((generated.manifest.stats?.includedSectionCount ?? 0) === 0 && sections.length > 0) {
    apparentDamage.push("no default included sections");
  }
  if (suspiciousShortSections.length > 0) apparentDamage.push("suspiciously short generated sections");
  if (suspiciousLongSections.length > 0) apparentDamage.push("suspiciously long generated sections");
  if ((generated.manifest.stats?.cleanedCharacterCount ?? 0) < 1000) {
    apparentDamage.push("generated output unexpectedly short");
  }

  return {
    exists: true,
    manifestPath: relativeToRepo(generated.manifestPath),
    sectionCount: sections.length,
    includedSectionCount: sections.filter((section) => section.includeByDefault).length,
    firstSectionPreview: sections[0]?.textPreview ?? null,
    lastSectionPreview: sections.at(-1)?.textPreview ?? null,
    suspiciousShortSections,
    suspiciousLongSections,
    apparentDamage: [...new Set(apparentDamage)],
  };
}

function finalRecommendation(
  book: Pass2Book,
  comparison: ExistingGeneratedComparison,
  proposedSections: SectionSummary[],
  structureDetection: DryRunStructureDetection,
  cleanupSimulation: CleanupSimulation,
  previewCandidate: FirstHourPreviewCandidate,
  suspiciouslyLongSections: SectionSummary[],
): {
  recommendation: DryRunRecommendation;
  reasons: string[];
} {
  const reasons: string[] = [];
  if (book.pass2Risk === "blocked") {
    return {
      recommendation: "blocked",
      reasons: ["Pass 2 marked this source as blocked."],
    };
  }
  if (structureDetection.status === "fail") {
    return {
      recommendation: "needs individual review",
      reasons: [
        "Structure detection failed or used suspicious fallback.",
        ...structureDetection.warnings,
      ],
    };
  }
  if (book.pass2Risk === "high") {
    reasons.push(...book.pass2RiskReasons);
    if (comparison.apparentDamage.length > 0) {
      reasons.push(`Existing generated output warning: ${comparison.apparentDamage.join(", ")}.`);
    }
    return {
      recommendation: "needs individual review",
      reasons,
    };
  }
  const totalSectionWords = proposedSections.reduce((sum, section) => sum + section.wordCount, 0);
  if (proposedSections.length === 0) {
    return {
      recommendation: "needs individual review",
      reasons: ["No proposed sections were produced, so this book should not be written automatically."],
    };
  }
  if (proposedSections.length <= 2 && totalSectionWords > 30_000) {
    return {
      recommendation: "needs individual review",
      reasons: [
        `Section detection collapsed ${totalSectionWords} words into only ${proposedSections.length} sections; manual section logic is needed before writing.`,
      ],
    };
  }
  if (suspiciouslyLongSections.length > 0 && proposedSections.length <= 3) {
    return {
      recommendation: "needs individual review",
      reasons: [
        `A suspiciously long section was produced in a sparse section list: ${suspiciouslyLongSections
          .map((section) => `${section.id} (${section.wordCount} words)`)
          .join(", ")}.`,
      ],
    };
  }
  if (cleanupSimulation.warnings.length > 0) {
    return {
      recommendation: "needs individual review",
      reasons: cleanupSimulation.warnings,
    };
  }
  if (!previewCandidate.feasible) {
    return {
      recommendation: "needs individual review",
      reasons: ["The first-hour preview candidate does not start at confidently readable content."],
    };
  }
  if (structureDetection.status === "warn") {
    reasons.push(...structureDetection.warnings.map((warning) => `Structure warning: ${warning}`));
  }
  if (book.pass2Risk === "medium" || comparison.apparentDamage.length > 0) {
    reasons.push(...book.pass2RiskReasons);
    if (comparison.apparentDamage.length > 0) {
      reasons.push(`Existing generated output warning: ${comparison.apparentDamage.join(", ")}.`);
    }
    return {
      recommendation: "process later with warnings",
      reasons,
    };
  }
  if (structureDetection.status === "warn") {
    return {
      recommendation: "process later with warnings",
      reasons: reasons.length
        ? reasons
        : ["Structure detection is usable but should be reviewed before writing."],
    };
  }
  return {
    recommendation: "safe to process later",
    reasons: ["Pass 2 verified high-confidence boundaries and this dry run found no blocking issue."],
  };
}

function manualChecklist(
  book: Pass2Book,
  sections: SectionSummary[],
  comparison: ExistingGeneratedComparison,
  structureDetection: DryRunStructureDetection,
): string[] {
  const checklist = [
    "Confirm the first kept line is real readable content, not source metadata or a TOC entry.",
    "Confirm the final kept line is real book content and the Gutenberg/license footer is excluded.",
    "Confirm default-readable sections exclude TOC, transcriber notes, source/license text, and publisher catalog material.",
    "Check suspiciously short or long proposed sections before a real write pass.",
    "Verify cleanup removes playback-hostile artifacts without deleting dialogue, punctuation, paragraph structure, or headings.",
    "Confirm the first-hour preview candidate starts with real readable content.",
  ];
  if (book.pass2Risk === "high") {
    checklist.push("Resolve pass-2 high-risk boundary/content flags before automated processing.");
  }
  if (comparison.apparentDamage.length > 0) {
    checklist.push("Compare candidate output against existing generated output because pass 2 flagged generated-output damage.");
  }
  if (sections.length === 0) {
    checklist.push("No proposed sections were produced; do not process until section detection is fixed.");
  }
  if (structureDetection.status !== "pass") {
    checklist.push("Review the structure-detection warnings and confirm TOC entries were not selected as body sections.");
  }
  return checklist;
}

function bookMarkdown(book: BookDryRun): string {
  const sectionRows = book.proposedSections
    .slice(0, 80)
    .map(
      (section) =>
        `| ${section.id} | ${section.kind} | ${escapeMarkdown(section.label)} | ${escapeMarkdown(section.title ?? "")} | ${section.wordCount} | ${section.includeByDefault ? "yes" : "no"} |`,
    )
    .join("\n");
  const cleanupRows =
    book.artifactsDetectedAndCleanupAction.actions.length === 0
      ? "| None | 0 | No simulated cleanup needed. | |"
      : book.artifactsDetectedAndCleanupAction.actions
          .map(
            (action) =>
              `| ${action.action} | ${action.count} | ${escapeMarkdown(action.recommendation)} | ${escapeMarkdown(action.samples.join("<br>"))} |`,
          )
          .join("\n");
  const generatedDamage =
    book.comparisonAgainstExistingGeneratedOutput.apparentDamage.length === 0
      ? "No generated-output damage flagged in this dry run."
      : book.comparisonAgainstExistingGeneratedOutput.apparentDamage.join("; ");
  const structurePatternRows =
    book.structureDetection.candidateHeadingPatternsFound.length === 0
      ? "| None | 0 | 0 | 0 |  |"
      : book.structureDetection.candidateHeadingPatternsFound
          .map(
            (summary) =>
              `| ${escapeMarkdown(summary.patternId)} | ${summary.candidateCount} | ${summary.bodyLikeCount} | ${summary.tocLikeCount} | ${summary.selected ? "yes" : "no"} | ${escapeMarkdown(summary.rejectionReason ?? "")} |`,
          )
          .join("\n");
  const rejectedStrategyRows =
    book.structureDetection.rejectedHeadingStrategies.length === 0
      ? "| None | 0 | 0 | 0 | |"
      : book.structureDetection.rejectedHeadingStrategies
          .slice(0, 40)
          .map(
            (strategy) =>
              `| ${escapeMarkdown(strategy.patternId)} | ${strategy.candidateCount} | ${strategy.bodyLikeCount} | ${strategy.tocLikeCount} | ${escapeMarkdown(strategy.reason)} |`,
          )
          .join("\n");
  const room13RegressionSection =
    book.slug === "room-13"
      ? [
          "## Room 13 Regression",
          "",
          `- Body chapter heading count: ${book.structureDetection.bodyChapterHeadingCount}`,
          `- Final section count: ${book.proposedSections.length}`,
          `- TOC/body distinction: ${book.structureDetection.tocEntriesDetected ? "TOC-like entries were detected separately from body headings." : "No TOC-like entries were selected."}`,
          `- Prior 2-section collapse fixed: ${book.structureDetection.priorTwoSectionCollapseFixed ? "yes" : "no"}`,
          "",
          "### Body Chapter Examples",
          "",
          book.structureDetection.bodyHeadingExamples.length
            ? book.structureDetection.bodyHeadingExamples.map((example) => `- ${example}`).join("\n")
            : "- None.",
          "",
          "### TOC-Like Examples",
          "",
          book.structureDetection.tocHeadingExamples.length
            ? book.structureDetection.tocHeadingExamples.map((example) => `- ${example}`).join("\n")
            : "- None.",
          "",
        ]
      : [];

  return [
    `# Pilot Dry Run: ${book.slug}`,
    "",
    `- Source file: \`${book.sourceFilename}\``,
    `- Why selected: ${book.selectionReason}`,
    `- Pass-2 risk level: ${book.pass2RiskLevel}`,
    `- Existing generated output: ${book.existingGeneratedOutputExists ? "yes" : "no"}`,
    `- Candidate title: ${book.candidateTitle}`,
    `- Candidate author: ${book.candidateAuthor.length ? book.candidateAuthor.join(", ") : "Unknown"}`,
    `- Final dry-run recommendation: ${book.finalDryRunRecommendation}`,
    "",
    "## Boundary Decision",
    "",
    book.boundaryAdjustments.length
      ? book.boundaryAdjustments.map((adjustment) => `- Dry-run adjustment: ${adjustment}`).join("\n")
      : "- Dry-run adjustment: none.",
    "",
    `- Raw word count: ${book.rawWordCount}`,
    `- Kept word count estimate: ${book.keptWordCountEstimate}`,
    `- Removed front matter word count estimate: ${book.removedFrontMatterWordCountEstimate}`,
    `- Removed end matter word count estimate: ${book.removedEndMatterWordCountEstimate}`,
    `- Candidate start: line ${book.candidateStartLine ?? "unknown"}, index ${book.candidateStartIndex ?? "unknown"}`,
    `- Start snippet: ${book.candidateStartHeadingOrSnippet}`,
    "",
    "### 10-20 Lines Before Start",
    "",
    book.linesBeforeCandidateStart.length
      ? book.linesBeforeCandidateStart.map((line) => `- ${line}`).join("\n")
      : "- None.",
    "",
    `- Candidate end: line ${book.candidateEndLine ?? "unknown"}, index ${book.candidateEndIndex ?? "unknown"}`,
    `- End snippet: ${book.candidateEndHeadingOrSnippet}`,
    "",
    "### 10-20 Lines After End",
    "",
    book.linesAfterCandidateEnd.length
      ? book.linesAfterCandidateEnd.map((line) => `- ${line}`).join("\n")
      : "- None.",
    "",
    "## Structure Detection",
    "",
    `- Detected structural convention: ${book.structureDetection.detectedStructuralConvention}`,
    `- Selected heading strategy: ${book.structureDetection.selectedHeadingStrategy?.patternId ?? "none"}`,
    `- TOC entries detected: ${book.structureDetection.tocEntriesDetected ? "yes" : "no"}`,
    `- Body headings detected: ${book.structureDetection.bodyHeadingsDetected ? "yes" : "no"}`,
    `- Section count from selected strategy: ${book.structureDetection.sectionCountFromSelectedStrategy}`,
    `- Fallback used: ${book.structureDetection.fallbackUsed ? "yes" : "no"}`,
    `- Fallback legitimacy: ${book.structureDetection.fallbackLegitimacy}`,
    `- Fallback reason: ${book.structureDetection.fallbackReason ?? "not required"}`,
    `- Structure detection status: ${book.structureDetection.status}`,
    "",
    "### Candidate Heading Patterns",
    "",
    "| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |",
    "| --- | ---: | ---: | ---: | --- | --- |",
    structurePatternRows,
    "",
    "### Rejected Heading Strategies",
    "",
    "| Pattern | Candidates | Body-like | TOC-like | Reason |",
    "| --- | ---: | ---: | ---: | --- |",
    rejectedStrategyRows,
    "",
    "### Structure Warnings",
    "",
    book.structureDetection.warnings.length
      ? book.structureDetection.warnings.map((warning) => `- ${warning}`).join("\n")
      : "- None.",
    "",
    ...room13RegressionSection,
    "## Proposed Sections",
    "",
    `- Total proposed sections: ${book.proposedSections.length}`,
    "",
    "| ID | Kind | Label | Title | Words | Default |",
    "| --- | --- | --- | --- | ---: | --- |",
    sectionRows || "| None | | | | 0 | |",
    "",
    "## Suspicious Sections",
    "",
    `- Suspiciously short sections: ${book.suspiciouslyShortSections.map((section) => `${section.id} (${section.wordCount})`).join(", ") || "None"}`,
    `- Suspiciously long sections: ${book.suspiciouslyLongSections.map((section) => `${section.id} (${section.wordCount})`).join(", ") || "None"}`,
    "",
    "## Cleanup Simulation",
    "",
    "| Action | Count | Recommendation | Samples |",
    "| --- | ---: | --- | --- |",
    cleanupRows,
    "",
    `- Footnotes/references: ${book.footnoteReferenceHandlingRecommendation}`,
    `- Illustration/image placeholders: ${book.illustrationImagePlaceholderHandlingRecommendation}`,
    `- Dash normalization: ${book.dashNormalizationRecommendation}`,
    "",
    "## First-Hour Preview Candidate",
    "",
    `- Feasible: ${book.firstHourPreviewCandidate.feasible ? "yes" : "no"}`,
    `- Confidence: ${book.firstHourPreviewCandidate.confidence}`,
    `- Sections used: ${book.firstHourPreviewCandidate.sectionsUsed.join(", ") || "None"}`,
    `- Approximate word count: ${book.firstHourPreviewCandidate.approximateWordCount}`,
    `- Starts at real readable content: ${book.firstHourPreviewCandidate.startsAtRealReadableContent ? "yes" : "no"}`,
    `- Snippet: ${book.firstHourPreviewCandidate.snippet}`,
    "",
    "## Existing Generated Output Comparison",
    "",
    `- Manifest: ${book.comparisonAgainstExistingGeneratedOutput.manifestPath ?? "None"}`,
    `- Section count: ${book.comparisonAgainstExistingGeneratedOutput.sectionCount}`,
    `- Default-included section count: ${book.comparisonAgainstExistingGeneratedOutput.includedSectionCount}`,
    `- First generated preview: ${book.comparisonAgainstExistingGeneratedOutput.firstSectionPreview ?? "None"}`,
    `- Last generated preview: ${book.comparisonAgainstExistingGeneratedOutput.lastSectionPreview ?? "None"}`,
    `- Apparent generated damage: ${generatedDamage}`,
    "",
    "## Manual Review Checklist",
    "",
    book.manualReviewChecklist.map((item) => `- ${item}`).join("\n"),
    "",
    "## Recommendation Reasons",
    "",
    book.recommendationReasons.length
      ? book.recommendationReasons.map((reason) => `- ${reason}`).join("\n")
      : "- None.",
    "",
  ].join("\n");
}

function escapeMarkdown(input: string): string {
  return input.replace(/\|/g, "\\|").replace(/\n/g, "<br>");
}

function dryRunBook(book: Pass2Book): BookDryRun {
  const sourcePath = resolveRepoPath(book.sourcePath);
  const sourceText = normalizeBoundaryText(fs.readFileSync(sourcePath, "utf8"));
  const sourceStructure = analyzeBookStructure(sourceText, {
    rawWordCount: countBookWords(sourceText),
  });
  const lines = buildLines(sourceText);
  const generated = readGeneratedManifest(book.slug);
  const author = extractAuthor(sourceText, generated.manifest);
  const boundaryAdjustments: string[] = [];
  const pass2StartLine = book.candidateStart.line ?? 1;
  const refinedStartLine = firstReadableLineAfterSourceNoise(lines, pass2StartLine);
  if (refinedStartLine !== pass2StartLine) {
    boundaryAdjustments.push(
      `Moved candidate start from line ${pass2StartLine} to ${refinedStartLine} to skip source/URL/start-marker noise.`,
    );
  }
  const pass2EndLine = book.candidateEnd.line ?? lines.length;
  const gutenbergEndLine = firstGutenbergEndMarkerLine(lines, refinedStartLine);
  const refinedEndLine =
    gutenbergEndLine !== null && gutenbergEndLine <= pass2EndLine
      ? (lastNonEmptyLineBefore(lines, gutenbergEndLine - 2) ?? pass2EndLine)
      : pass2EndLine;
  if (refinedEndLine !== pass2EndLine && gutenbergEndLine !== null) {
    boundaryAdjustments.push(
      `Moved candidate end from line ${pass2EndLine} to ${refinedEndLine} so the Project Gutenberg end marker at line ${gutenbergEndLine} becomes end matter.`,
    );
  }
  const startIndex = lineStartIndex(lines, refinedStartLine) ?? 0;
  const endIndex = lineEndIndex(lines, refinedEndLine) ?? sourceText.length;
  const safeStartIndex = Math.max(0, Math.min(sourceText.length, startIndex));
  const safeEndIndex = Math.max(safeStartIndex, Math.min(sourceText.length, endIndex));
  const frontMatterText = sourceText.slice(0, safeStartIndex);
  const keptText = trimBookText(sourceText.slice(safeStartIndex, safeEndIndex));
  const endMatterText = sourceText.slice(safeEndIndex);
  const cleanupSimulation = simulateCleanup(keptText);
  const sectionResult = buildSections(keptText, book, author);
  const structureDetection = summarizeStructureDetection(
    sectionResult.structure,
    sectionResult.sections,
    countBookWords(keptText),
    sourceStructure,
  );
  const proposedSections = sectionResult.sections.map(sectionSummary);
  const suspiciouslyShortSections = proposedSections.filter(
    (section) => section.wordCount > 0 && section.wordCount < SHORT_SECTION_WORDS,
  );
  const suspiciouslyLongSections = proposedSections.filter(
    (section) => section.wordCount > LONG_SECTION_WORDS,
  );
  const comparison = compareGenerated(book, generated);
  const previewCandidate = buildPreviewCandidate(sectionResult.sections, book);
  const recommendation = finalRecommendation(
    book,
    comparison,
    proposedSections,
    structureDetection,
    cleanupSimulation,
    previewCandidate,
    suspiciouslyLongSections,
  );
  const manualReviewChecklist = manualChecklist(
    book,
    proposedSections,
    comparison,
    structureDetection,
  );
  const slugMarkdownPath = path.join(DRY_RUN_BOOKS_ROOT, `${book.slug}.md`);
  const candidateJsonPath = path.join(
    DRY_RUN_CANDIDATES_ROOT,
    `${book.slug}.candidate.json`,
  );
  const startLineIndex = Math.max(0, refinedStartLine - 1);
  const endLineIndex = Math.max(0, refinedEndLine - 1);

  const result: BookDryRun = {
    slug: book.slug,
    selectionReason: PILOT_SELECTION_REASONS[book.slug as (typeof PILOT_BATCH)[number]],
    sourceFilename: book.sourceFilename,
    sourcePath: book.sourcePath,
    pass2RiskLevel: book.pass2Risk,
    existingGeneratedOutputExists: book.existingGeneratedOutputExists,
    candidateTitle: book.title,
    candidateAuthor: author,
    rawWordCount: countBookWords(sourceText),
    keptWordCountEstimate: countBookWords(keptText),
    removedFrontMatterWordCountEstimate: countBookWords(frontMatterText),
    removedEndMatterWordCountEstimate: countBookWords(endMatterText),
    candidateStartLine: refinedStartLine,
    candidateStartIndex: safeStartIndex,
    candidateStartHeadingOrSnippet: textPreview(
      lineRangeText(lines, startLineIndex, Math.min(lines.length - 1, startLineIndex + 5)),
      500,
    ),
    linesBeforeCandidateStart: formattedContext(lines, startLineIndex - 20, startLineIndex - 1),
    candidateEndLine: refinedEndLine,
    candidateEndIndex: safeEndIndex,
    candidateEndHeadingOrSnippet: textPreview(
      lineRangeText(lines, Math.max(0, endLineIndex - 5), endLineIndex),
      500,
    ),
    linesAfterCandidateEnd: formattedContext(lines, endLineIndex + 1, endLineIndex + 20),
    proposedSections,
    firstFiveProposedSections: proposedSections.slice(0, 5),
    lastFiveProposedSections: proposedSections.slice(-5),
    suspiciouslyShortSections,
    suspiciouslyLongSections,
    structureDetection,
    artifactsDetectedAndCleanupAction: cleanupSimulation,
    footnoteReferenceHandlingRecommendation:
      book.cleanupArtifactSummary.numberedBracketReferences > 0 ||
      book.cleanupArtifactSummary.footnoteReferenceRanges > 0
        ? "Review footnote/reference markers before processing; remove orphan inline markers from playback, and include note prose only if needed for comprehension."
        : "No footnote/reference handling issue detected in the dry run.",
    illustrationImagePlaceholderHandlingRecommendation:
      book.cleanupArtifactSummary.illustrationImagePlaceholders > 0
        ? "Remove placeholder markers such as [Illustration] from playback text; preserve meaningful captions only after review."
        : "No illustration/image placeholder issue detected in the dry run.",
    dashNormalizationRecommendation:
      book.cleanupArtifactSummary.dashNormalizationCandidates > 0
        ? "Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only."
        : "No dash normalization needed beyond normal punctuation handling.",
    firstHourPreviewCandidate: previewCandidate,
    comparisonAgainstExistingGeneratedOutput: comparison,
    manualReviewChecklist,
    boundaryAdjustments,
    finalDryRunRecommendation: recommendation.recommendation,
    recommendationReasons: recommendation.reasons,
    candidateJsonPath: relativeToRepo(candidateJsonPath),
    perBookMarkdownPath: relativeToRepo(slugMarkdownPath),
  };

  const candidateJson: CandidateJson = {
    slug: result.slug,
    selectionReason: result.selectionReason,
    title: result.candidateTitle,
    author: result.candidateAuthor,
    sourcePath: result.sourcePath,
    pass2RiskLevel: result.pass2RiskLevel,
    dryRunRecommendation: result.finalDryRunRecommendation,
    boundaries: {
      startLine: result.candidateStartLine,
      startIndex: result.candidateStartIndex,
      startSnippet: result.candidateStartHeadingOrSnippet,
      endLine: result.candidateEndLine,
      endIndex: result.candidateEndIndex,
      endSnippet: result.candidateEndHeadingOrSnippet,
    },
    wordCounts: {
      raw: result.rawWordCount,
      kept: result.keptWordCountEstimate,
      removedFrontMatter: result.removedFrontMatterWordCountEstimate,
      removedEndMatter: result.removedEndMatterWordCountEstimate,
    },
    sections: result.proposedSections,
    structureDetection: result.structureDetection,
    cleanupSimulation: result.artifactsDetectedAndCleanupAction,
    firstHourPreviewCandidate: result.firstHourPreviewCandidate,
    comparisonAgainstExistingGeneratedOutput: result.comparisonAgainstExistingGeneratedOutput,
    manualReviewChecklist: result.manualReviewChecklist,
  };

  fs.writeFileSync(candidateJsonPath, `${JSON.stringify(candidateJson, null, 2)}\n`, "utf8");
  fs.writeFileSync(slugMarkdownPath, bookMarkdown(result), "utf8");

  return result;
}

function addCategory(
  categories: Map<string, { count: number; examples: string[] }>,
  category: string,
  slug: string,
): void {
  const entry = categories.get(category) ?? { count: 0, examples: [] };
  entry.count += 1;
  if (entry.examples.length < 8) entry.examples.push(slug);
  categories.set(category, entry);
}

function summarizeCleanup(books: BookDryRun[]): DryRunReport["commonCleanupIssues"] {
  const categories = new Map<string, { count: number; examples: string[] }>();
  for (const book of books) {
    for (const action of book.artifactsDetectedAndCleanupAction.actions) {
      addCategory(categories, action.action, book.slug);
    }
    if (book.suspiciouslyShortSections.length > 0) {
      addCategory(categories, "suspiciously-short-sections", book.slug);
    }
    if (book.suspiciouslyLongSections.length > 0) {
      addCategory(categories, "suspiciously-long-sections", book.slug);
    }
  }
  return [...categories.entries()]
    .map(([category, value]) => ({ category, ...value }))
    .sort((left, right) => right.count - left.count || left.category.localeCompare(right.category));
}

function summarizeBoundaryRisks(books: BookDryRun[]): DryRunReport["commonBoundaryRisks"] {
  const categories = new Map<string, { count: number; examples: string[] }>();
  for (const book of books) {
    if (book.pass2RiskLevel === "high") addCategory(categories, "pass-2-high-risk", book.slug);
    if (book.recommendationReasons.some((reason) => /boundary|opening|ending|start|end/i.test(reason))) {
      addCategory(categories, "boundary-or-real-content-risk", book.slug);
    }
    if (book.comparisonAgainstExistingGeneratedOutput.apparentDamage.length > 0) {
      addCategory(categories, "existing-generated-output-warning", book.slug);
    }
    if (book.firstHourPreviewCandidate.confidence === "low") {
      addCategory(categories, "low-confidence-preview-source", book.slug);
    }
    if (book.structureDetection.status !== "pass") {
      addCategory(categories, `structure-${book.structureDetection.status}`, book.slug);
    }
  }
  return [...categories.entries()]
    .map(([category, value]) => ({ category, ...value }))
    .sort((left, right) => right.count - left.count || left.category.localeCompare(right.category));
}

function mainMarkdown(report: DryRunReport): string {
  const recommendationRows = report.books
    .map(
      (book) =>
        `| ${book.slug} | ${book.pass2RiskLevel} | ${escapeMarkdown(book.structureDetection.detectedStructuralConvention)} | ${book.structureDetection.status} | ${book.proposedSections.length} | ${book.keptWordCountEstimate} | ${book.finalDryRunRecommendation} | ${book.firstHourPreviewCandidate.feasible ? "yes" : "no"} | ${escapeMarkdown(book.selectionReason)} |`,
    )
    .join("\n");
  const listByRecommendation = (recommendation: DryRunRecommendation) => {
    const matches = report.books.filter((book) => book.finalDryRunRecommendation === recommendation);
    return matches.length ? matches.map((book) => `- ${book.slug}`).join("\n") : "- None.";
  };
  const cleanupRows =
    report.commonCleanupIssues.length === 0
      ? "| None | 0 | |"
      : report.commonCleanupIssues
          .map((entry) => `| ${entry.category} | ${entry.count} | ${entry.examples.join("<br>")} |`)
          .join("\n");
  const boundaryRows =
    report.commonBoundaryRisks.length === 0
      ? "| None | 0 | |"
      : report.commonBoundaryRisks
          .map((entry) => `| ${entry.category} | ${entry.count} | ${entry.examples.join("<br>")} |`)
          .join("\n");
  const damagedRows =
    report.existingGeneratedOutputsAppearDamaged.length === 0
      ? "- No existing generated outputs were flagged as damaged in this pilot dry run."
      : report.existingGeneratedOutputsAppearDamaged
          .map((entry) => `- ${entry.slug}: ${entry.apparentDamage.join("; ")}`)
          .join("\n");

  return [
    "# Pilot Book Processing Dry Run 3",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "This is a review-only dry run for the third carefully selected pilot batch. It uses the pass-1, pass-2, structure-audit-1, pilot dry-run 1, pilot write 1, pilot write 1 verification, pilot dry-run 2, and pilot write 2 verification reports as inputs. It does not write final generated books, public preview assets, raw source books, or Cloudflare exports.",
    "",
    "## Pilot Books Processed",
    "",
    report.pilotBatch.map((slug) => `- ${slug}`).join("\n"),
    "",
    "## Per-Book Recommendation Table",
    "",
    "| Slug | Pass-2 risk | Structure | Structure status | Sections | Kept words | Dry-run recommendation | Preview feasible | Why selected |",
    "| --- | --- | --- | --- | ---: | ---: | --- | --- | --- |",
    recommendationRows,
    "",
    "## Safe To Process Later",
    "",
    listByRecommendation("safe to process later"),
    "",
    "## Process Later With Warnings",
    "",
    listByRecommendation("process later with warnings"),
    "",
    "## Needs Individual Review",
    "",
    listByRecommendation("needs individual review"),
    "",
    "## Blocked",
    "",
    listByRecommendation("blocked"),
    "",
    "## Most Common Cleanup Issues",
    "",
    "| Issue | Books | Examples |",
    "| --- | ---: | --- |",
    cleanupRows,
    "",
    "## Most Common Boundary Risks",
    "",
    "| Risk | Books | Examples |",
    "| --- | ---: | --- |",
    boundaryRows,
    "",
    "## Existing Generated Output Damage",
    "",
    damagedRows,
    "",
    "## Processor Safety Assessment",
    "",
    `- Seems safe enough for a real pilot write pass: ${report.processorSafetyAssessment.seemsSafeEnoughForRealPilotWritePass ? "yes" : "no"}`,
    `- Reason: ${report.processorSafetyAssessment.reason}`,
    `- Recommended next step: ${report.processorSafetyAssessment.recommendedNextStep}`,
    "",
    "## Exact Recommendation For Next Write Pass",
    "",
    report.books
      .filter((book) => book.finalDryRunRecommendation === "safe to process later")
      .map((book) => `- Write without special warning gate: ${book.slug}`)
      .concat(
        report.books
          .filter((book) => book.finalDryRunRecommendation === "process later with warnings")
          .map((book) => `- Write with warning review: ${book.slug}`),
      )
      .concat(
        report.books
          .filter((book) => book.finalDryRunRecommendation === "needs individual review")
          .map((book) => `- Do not write until individual review: ${book.slug}`),
      )
      .concat(
        report.books
          .filter((book) => book.finalDryRunRecommendation === "blocked")
          .map((book) => `- Blocked: ${book.slug}`),
      )
      .join("\n") || "- No books recommended for a write pass.",
    "",
    "## Protected Folder Confirmation",
    "",
    "- `app/client/assets/temp-books` was read but not modified.",
    "- `app/client/assets/books/generated` was read for comparison but not modified.",
    "- `app/client/assets/books/cloudflare-export` was not modified.",
    "- Candidate outputs are review-only and live only under `app/client/assets/books/audit-reports/pilot-dry-run-3`.",
    "",
  ].join("\n");
}

function buildReport(books: BookDryRun[]): DryRunReport {
  const counts = {
    safeToProcessLater: books.filter((book) => book.finalDryRunRecommendation === "safe to process later").length,
    processLaterWithWarnings: books.filter(
      (book) => book.finalDryRunRecommendation === "process later with warnings",
    ).length,
    needsIndividualReview: books.filter((book) => book.finalDryRunRecommendation === "needs individual review").length,
    blocked: books.filter((book) => book.finalDryRunRecommendation === "blocked").length,
  };
  const existingGeneratedOutputsAppearDamaged = books
    .filter((book) => book.comparisonAgainstExistingGeneratedOutput.apparentDamage.length > 0)
    .map((book) => ({
      slug: book.slug,
      apparentDamage: book.comparisonAgainstExistingGeneratedOutput.apparentDamage,
    }));
  const structureFailures = books.filter((book) => book.structureDetection.status === "fail").length;
  const seemsSafe =
    counts.safeToProcessLater + counts.processLaterWithWarnings >= 8 &&
    counts.blocked === 0 &&
    counts.needsIndividualReview <= 4 &&
    structureFailures === 0;

  return {
    schemaVersion: 1,
    reportName: "pilot-dry-run-3",
    generatedAt: new Date().toISOString(),
    inputReports: {
      pass1Json: relativeToRepo(PASS_1_JSON_PATH),
      pass2Json: relativeToRepo(PASS_2_JSON_PATH),
      structureAudit1Json: relativeToRepo(STRUCTURE_AUDIT_1_JSON_PATH),
      pilotDryRun1Json: relativeToRepo(PILOT_DRY_RUN_1_JSON_PATH),
      pilotWrite1Json: relativeToRepo(PILOT_WRITE_1_JSON_PATH),
      pilotWrite1VerificationJson: relativeToRepo(PILOT_WRITE_1_VERIFICATION_JSON_PATH),
      pilotDryRun2Json: relativeToRepo(PILOT_DRY_RUN_2_JSON_PATH),
      pilotWrite2VerificationJson: relativeToRepo(PILOT_WRITE_2_VERIFICATION_JSON_PATH),
    },
    paths: {
      tempBooks: relativeToRepo(TEMP_BOOKS_ROOT),
      generatedBooks: relativeToRepo(GENERATED_ROOT),
      cloudflareExport: relativeToRepo(CLOUDFLARE_EXPORT_ROOT),
      dryRunRoot: relativeToRepo(DRY_RUN_ROOT),
    },
    pilotBatch: [...PILOT_BATCH],
    totals: {
      pilotBooksRequested: PILOT_BATCH.length,
      pilotBooksProcessed: books.length,
      ...counts,
    },
    commonCleanupIssues: summarizeCleanup(books),
    commonBoundaryRisks: summarizeBoundaryRisks(books),
    existingGeneratedOutputsAppearDamaged,
    processorSafetyAssessment: {
      seemsSafeEnoughForRealPilotWritePass: seemsSafe,
      reason: seemsSafe
        ? "The dry run produced reviewable outputs for the selected third-batch books with no blocked sources and enough safe/warning candidates for a controlled write pass."
        : structureFailures > 0
          ? "At least one batch-3 book still has a failed structure-detection result, so a real write pass should wait until those are reviewed or excluded."
          : "Several batch-3 books still require individual review, so a real write pass should wait until those are reviewed or excluded.",
      recommendedNextStep: seemsSafe
        ? "Run a real pilot write pass only for the safe/warning subset from dry-run 3, excluding any individual-review or blocked books."
        : "Review the individual-review per-book reports, then run a smaller real write pass for safe and warning-only books.",
    },
    confirmations: {
      tempBooksModified: false,
      generatedOutputsModified: false,
      cloudflareExportModified: false,
      candidateOutputsAreReviewOnly: true,
    },
    books,
  };
}

function main(): void {
  if (!fs.existsSync(PASS_1_JSON_PATH)) {
    throw new Error(`Pass-1 report is required: ${PASS_1_JSON_PATH}`);
  }
  if (!fs.existsSync(PASS_2_JSON_PATH)) {
    throw new Error(`Pass-2 report is required: ${PASS_2_JSON_PATH}`);
  }
  for (const requiredInput of [
    STRUCTURE_AUDIT_1_JSON_PATH,
    PILOT_DRY_RUN_1_JSON_PATH,
    PILOT_WRITE_1_JSON_PATH,
    PILOT_WRITE_1_VERIFICATION_JSON_PATH,
    PILOT_DRY_RUN_2_JSON_PATH,
    PILOT_WRITE_2_VERIFICATION_JSON_PATH,
  ]) {
    if (!fs.existsSync(requiredInput)) {
      throw new Error(`Prior pilot report is required: ${requiredInput}`);
    }
  }

  const pass2 = readJson<Pass2Report>(PASS_2_JSON_PATH);
  const bySlug = new Map(pass2.books.map((book) => [book.slug, book]));
  if (PILOT_BATCH.length < 20 || PILOT_BATCH.length > 25) {
    throw new Error(`Pilot dry-run 3 must inspect 20-25 books; found ${PILOT_BATCH.length}.`);
  }
  const excluded = new Set<string>(EXCLUDED_FROM_BATCH_3);
  const forbiddenSelections = PILOT_BATCH.filter((slug) => excluded.has(slug));
  if (forbiddenSelections.length > 0) {
    throw new Error(`Pilot dry-run 3 includes excluded slugs: ${forbiddenSelections.join(", ")}`);
  }

  fs.mkdirSync(DRY_RUN_ROOT, { recursive: true });
  fs.mkdirSync(DRY_RUN_BOOKS_ROOT, { recursive: true });
  fs.mkdirSync(DRY_RUN_CANDIDATES_ROOT, { recursive: true });

  const books = PILOT_BATCH.map((slug) => {
    const book = bySlug.get(slug);
    if (!book) throw new Error(`Pilot slug was not found in pass-2 report: ${slug}`);
    return dryRunBook(book);
  });
  const report = buildReport(books);
  fs.writeFileSync(MAIN_JSON_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  fs.writeFileSync(MAIN_MARKDOWN_PATH, mainMarkdown(report), "utf8");

  console.log("Pilot dry run 3 complete.");
  console.log(`Pilot books processed: ${report.totals.pilotBooksProcessed}`);
  console.log(
    `Recommendations: safe ${report.totals.safeToProcessLater}, warnings ${report.totals.processLaterWithWarnings}, individual review ${report.totals.needsIndividualReview}, blocked ${report.totals.blocked}`,
  );
  console.log(`Wrote ${relativeToRepo(MAIN_JSON_PATH)}`);
  console.log(`Wrote ${relativeToRepo(MAIN_MARKDOWN_PATH)}`);
}

main();
