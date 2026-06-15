import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { cleanGutenbergText } from "./clean-gutenberg.ts";
import {
  countBookWords,
  normalizeBookText,
  textPreview,
  trimBookText,
} from "./bookTextNormalization.ts";

type ConfidenceLevel = "high" | "medium" | "low" | "blocked";
type RecommendedHandling =
  | "safe for normal processing"
  | "process with warnings"
  | "needs manual sectioning review"
  | "blocked";

type TextLine = {
  lineNumber: number;
  offset: number;
  text: string;
  trimmed: string;
};

type HeadingKind =
  | "chapter"
  | "book"
  | "part"
  | "volume"
  | "section"
  | "act"
  | "scene"
  | "stave"
  | "canto"
  | "letter"
  | "date-entry"
  | "poem"
  | "story-title"
  | "titled-section"
  | "front-back-matter";

type HeadingCandidate = {
  patternId: string;
  patternLabel: string;
  convention: string;
  kind: HeadingKind;
  lineNumber: number;
  offset: number;
  lineRatio: number;
  rawLine: string;
  normalized: string;
  ordinal: number | null;
  ordinalRaw: string | null;
  isTocLike: boolean;
  tocReasons: string[];
  isBodyLike: boolean;
  bodyReasons: string[];
  nextProsePreview: string | null;
};

type HeadingPatternSummary = {
  patternId: string;
  label: string;
  convention: string;
  kind: HeadingKind;
  candidateCount: number;
  tocLikeCount: number;
  bodyLikeCount: number;
  examples: string[];
  bodyExamples: string[];
  tocExamples: string[];
  score: number;
  confidence: ConfidenceLevel;
  selected: boolean;
  rejectionReason: string | null;
  sectionSizeNotes: SectionSizeNotes | null;
};

type SectionSizeNotes = {
  sectionCount: number;
  minimumWords: number;
  medianWords: number;
  maximumWords: number;
  averageWords: number;
  hugeSectionCount: number;
  tinySectionCount: number;
  notes: string[];
};

type GeneratedComparison = {
  exists: boolean;
  manifestPath: string | null;
  sectionCount: number;
  includedSectionCount: number;
  warnings: string[];
  firstPreview: string | null;
  lastPreview: string | null;
};

type BookStructureAudit = {
  slug: string;
  sourceFilename: string;
  sourcePath: string;
  rawWordCount: number;
  cleanedWordCount: number;
  likelyTitle: string;
  likelyAuthor: string | null;
  detectedStructuralConvention: string;
  confidenceScore: number;
  confidenceLevel: ConfidenceLevel;
  allCandidateHeadingPatternsFound: HeadingPatternSummary[];
  selectedHeadingStrategy: HeadingPatternSummary | null;
  rejectedHeadingStrategies: Array<{
    patternId: string;
    convention: string;
    candidateCount: number;
    bodyLikeCount: number;
    tocLikeCount: number;
    reason: string;
  }>;
  estimatedSectionCount: number;
  fallbackRequired: boolean;
  fallbackReason: string | null;
  fallbackLegitimacy: "legitimate" | "suspicious" | "not required";
  likelyTocHeadingsDetected: boolean;
  likelyBodyHeadingsDetected: boolean;
  examplesOfDetectedBodyHeadings: string[];
  examplesOfRejectedTocLikeHeadings: string[];
  sectionSizeSanityNotes: SectionSizeNotes | null;
  startBoundaryConfidence: ConfidenceLevel;
  endBoundaryConfidence: ConfidenceLevel;
  cleaningWarnings: string[];
  redFlags: string[];
  recommendedHandling: RecommendedHandling;
  generatedComparison: GeneratedComparison;
  perBookMarkdownPath: string;
};

type NonTextFile = {
  sourceFilename: string;
  sourcePath: string;
  extension: string;
};

type GlobalReport = {
  schemaVersion: 1;
  reportName: "book-structure-audit-1";
  generatedAt: string;
  paths: {
    tempBooks: string;
    generatedBooks: string;
    cloudflareExport: string;
    auditRoot: string;
  };
  totals: {
    sourceFilesScanned: number;
    textBooksScanned: number;
    nonTextBlockedFiles: number;
  };
  countsByDetectedStructuralConvention: Array<{ convention: string; count: number; examples: string[] }>;
  countsByConfidenceLevel: Record<ConfidenceLevel, number>;
  booksWithNoDetectedChaptersSectionsOrStoryHeadings: string[];
  booksWithSuspiciousFallbackOnlyStructure: string[];
  booksWithOnlyOneOrTwoDetectedSectionsButHighWordCount: string[];
  booksWhereTocBodyConfusionIsLikely: string[];
  booksWhereBodyHeadingsWereFoundButRejected: string[];
  booksNeedingManualSectioningReview: string[];
  booksSafeForNormalProcessing: string[];
  booksToProcessWithWarnings: string[];
  blockedBooks: string[];
  topParserWeaknessesFound: string[];
  recommendedDetectorFixesBeforeMoreWritePasses: string[];
  room13Regression: {
    found: boolean;
    correctlyIdentifiedAsChapterBased: boolean;
    chapterHeadingCount: number;
    examples: string[];
    appearsBodyNotToc: boolean;
    whyPriorTwoSectionDryRunWasWrong: string;
    recommendedAfterDetectorFix: RecommendedHandling | "unknown";
  };
  confirmations: {
    tempBooksModified: false;
    generatedOutputsModified: false;
    cloudflareExportModified: false;
    reportOnlyAudit: true;
  };
  nonTextFiles: NonTextFile[];
  books: BookStructureAudit[];
};

type GeneratedManifest = {
  stats?: {
    sectionCount?: number;
    includedSectionCount?: number;
  };
  sections?: Array<{
    label?: string;
    title?: string | null;
    wordCount?: number;
    textPreview?: string;
  }>;
  warnings?: string[];
};

type PatternDefinition = {
  id: string;
  label: string;
  convention: string;
  kind: HeadingKind;
  expression: RegExp;
  ordinalGroup?: number;
  titleGroup?: number;
};

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const TEMP_BOOKS_ROOT = path.join(REPO_ROOT, "app/client/assets/temp-books");
const GENERATED_ROOT = path.join(REPO_ROOT, "app/client/assets/books/generated");
const CLOUDFLARE_EXPORT_ROOT = path.join(
  REPO_ROOT,
  "app/client/assets/books/cloudflare-export",
);
const AUDIT_ROOT = path.join(
  REPO_ROOT,
  "app/client/assets/books/audit-reports/book-structure-audit-1",
);
const BOOK_REPORTS_ROOT = path.join(AUDIT_ROOT, "books");
const MAIN_JSON_PATH = path.join(AUDIT_ROOT, "book-structure-audit-1.json");
const MAIN_MARKDOWN_PATH = path.join(AUDIT_ROOT, "book-structure-audit-1.md");

const HIGH_WORD_COUNT = 12_000;
const HUGE_SECTION_WORDS = 18_000;
const TINY_SECTION_WORDS = 80;

const ORDINAL_WORDS: Record<string, number> = {
  ONE: 1,
  FIRST: 1,
  TWO: 2,
  SECOND: 2,
  THREE: 3,
  THIRD: 3,
  FOUR: 4,
  FOURTH: 4,
  FIVE: 5,
  FIFTH: 5,
  SIX: 6,
  SIXTH: 6,
  SEVEN: 7,
  SEVENTH: 7,
  EIGHT: 8,
  EIGHTH: 8,
  NINE: 9,
  NINTH: 9,
  TEN: 10,
  TENTH: 10,
  ELEVEN: 11,
  ELEVENTH: 11,
  TWELVE: 12,
  TWELFTH: 12,
  THIRTEEN: 13,
  THIRTEENTH: 13,
  FOURTEEN: 14,
  FOURTEENTH: 14,
  FIFTEEN: 15,
  FIFTEENTH: 15,
  SIXTEEN: 16,
  SIXTEENTH: 16,
  SEVENTEEN: 17,
  SEVENTEENTH: 17,
  EIGHTEEN: 18,
  EIGHTEENTH: 18,
  NINETEEN: 19,
  NINETEENTH: 19,
  TWENTY: 20,
  TWENTIETH: 20,
  THIRTY: 30,
  THIRTIETH: 30,
};

const ORDINAL_SOURCE =
  "(?:[ivxlcdm]+|\\d{1,4}|one|first|two|second|three|third|four|fourth|five|fifth|six|sixth|seven|seventh|eight|eighth|nine|ninth|ten|tenth|eleven|eleventh|twelve|twelfth|thirteen|thirteenth|fourteen|fourteenth|fifteen|fifteenth|sixteen|sixteenth|seventeen|seventeenth|eighteen|eighteenth|nineteen|nineteenth|twenty|twentieth|thirty|thirtieth)";
const WORD_ORDINAL_SOURCE =
  "(?:one|first|two|second|three|third|four|fourth|five|fifth|six|sixth|seven|seventh|eight|eighth|nine|ninth|ten|tenth|eleven|eleventh|twelve|twelfth|thirteen|thirteenth|fourteen|fourteenth|fifteen|fifteenth|sixteen|sixteenth|seventeen|seventeenth|eighteen|eighteenth|nineteen|nineteenth|twenty|twentieth|thirty|thirtieth)";

const PATTERNS: PatternDefinition[] = [
  {
    id: "chapter-roman",
    label: "Chapter plus Roman numeral",
    convention: "chapter-based roman numerals",
    kind: "chapter",
    expression: /^chapter\s+([ivxlcdm]+)\b(?:\s*(?::|--|-|\.|\))\s*(.*?))?\.?$/i,
    ordinalGroup: 1,
    titleGroup: 2,
  },
  {
    id: "chapter-arabic",
    label: "Chapter plus Arabic number",
    convention: "chapter-based arabic numbers",
    kind: "chapter",
    expression: /^chapter\s+(\d{1,4})\b(?:\s*(?::|--|-|\.|\))\s*(.*?))?\.?$/i,
    ordinalGroup: 1,
    titleGroup: 2,
  },
  {
    id: "chapter-word",
    label: "Chapter plus word ordinal",
    convention: "chapter-based word ordinals",
    kind: "chapter",
    expression: new RegExp(
      `^chapter\\s+(${WORD_ORDINAL_SOURCE})\\b(?:\\s*(?::|--|-|\\.|\\))\\s*(.*?))?\\.?$`,
      "i",
    ),
    ordinalGroup: 1,
    titleGroup: 2,
  },
  {
    id: "roman-numbered-title",
    label: "Roman numbered titled heading",
    convention: "roman-numbered titled sections",
    kind: "chapter",
    expression: /^([ivxlcdm]+)[.)]\s+(.{2,100})$/i,
    ordinalGroup: 1,
    titleGroup: 2,
  },
  {
    id: "arabic-numbered-title",
    label: "Arabic numbered titled heading",
    convention: "arabic-numbered titled sections",
    kind: "section",
    expression: /^(\d{1,4})[.)]\s+(.{2,100})$/,
    ordinalGroup: 1,
    titleGroup: 2,
  },
  {
    id: "roman-only",
    label: "Standalone Roman numeral",
    convention: "standalone roman numeral sections",
    kind: "chapter",
    expression: /^([ivxlcdm]+)[.)]?$/i,
    ordinalGroup: 1,
  },
  {
    id: "arabic-only",
    label: "Standalone Arabic number",
    convention: "standalone arabic-numbered sections",
    kind: "section",
    expression: /^(\d{1,4})[.)]?$/,
    ordinalGroup: 1,
  },
  {
    id: "book-division",
    label: "Book division",
    convention: "book divisions",
    kind: "book",
    expression: new RegExp(
      `^book\\s+(${ORDINAL_SOURCE})(?:\\s*(?::|--|-|\\.)\\s*(.*?))?\\.?$`,
      "i",
    ),
    ordinalGroup: 1,
    titleGroup: 2,
  },
  {
    id: "part-division",
    label: "Part division",
    convention: "part divisions",
    kind: "part",
    expression: new RegExp(
      `^part\\s+(${ORDINAL_SOURCE})(?:\\s*(?::|--|-|\\.)\\s*(.*?))?\\.?$`,
      "i",
    ),
    ordinalGroup: 1,
    titleGroup: 2,
  },
  {
    id: "volume-division",
    label: "Volume division",
    convention: "volume divisions",
    kind: "volume",
    expression: new RegExp(
      `^vol(?:ume)?\\.?\\s+(${ORDINAL_SOURCE})(?:\\s*(?::|--|-|\\.)\\s*(.*?))?\\.?$`,
      "i",
    ),
    ordinalGroup: 1,
    titleGroup: 2,
  },
  {
    id: "section-prefixed",
    label: "Section heading",
    convention: "section-based divisions",
    kind: "section",
    expression: new RegExp(
      `^section\\s+(${ORDINAL_SOURCE})(?:\\s*(?::|--|-|\\.)\\s*(.*?))?\\.?$`,
      "i",
    ),
    ordinalGroup: 1,
    titleGroup: 2,
  },
  {
    id: "act-prefixed",
    label: "Act heading",
    convention: "play acts",
    kind: "act",
    expression: new RegExp(`^act\\s+(${ORDINAL_SOURCE})(?:\\.|\\s.*)?$`, "i"),
    ordinalGroup: 1,
  },
  {
    id: "scene-prefixed",
    label: "Scene heading",
    convention: "play scenes",
    kind: "scene",
    expression: new RegExp(`^scene\\s+(${ORDINAL_SOURCE})(?:\\.|\\s.*)?$`, "i"),
    ordinalGroup: 1,
  },
  {
    id: "stave-prefixed",
    label: "Stave heading",
    convention: "stave-based sections",
    kind: "stave",
    expression: new RegExp(
      `^stave\\s+(${ORDINAL_SOURCE})(?:\\s*(?::|--|-|\\.)\\s*(.*?))?\\.?$`,
      "i",
    ),
    ordinalGroup: 1,
    titleGroup: 2,
  },
  {
    id: "canto-prefixed",
    label: "Canto heading",
    convention: "canto-based verse sections",
    kind: "canto",
    expression: new RegExp(
      `^canto\\s+(${ORDINAL_SOURCE})(?:\\s*(?::|--|-|\\.)\\s*(.*?))?\\.?$`,
      "i",
    ),
    ordinalGroup: 1,
    titleGroup: 2,
  },
  {
    id: "letter-prefixed",
    label: "Letter heading",
    convention: "letter-based sections",
    kind: "letter",
    expression: new RegExp(
      `^letter\\s+(${ORDINAL_SOURCE})(?:\\s*(?::|--|-|\\.)\\s*(.*?))?\\.?$`,
      "i",
    ),
    ordinalGroup: 1,
    titleGroup: 2,
  },
  {
    id: "date-entry",
    label: "Date or journal entry heading",
    convention: "dated journal or diary entries",
    kind: "date-entry",
    expression:
      /^(?:(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\.?\s+\d{1,2}(?:,\s*\d{2,4})?|\d{1,2}\s+(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)(?:\.|,)?(?:\s+\d{2,4})?)$/i,
  },
  {
    id: "special-front-back",
    label: "Preface, introduction, notes, or appendix",
    convention: "front/back matter headings",
    kind: "front-back-matter",
    expression:
      /^(?:preface|introduction|foreword|prologue|epilogue|appendix|notes?|transcriber(?:'s)? notes?|author(?:'s)? note|translator(?:'s)? note|contents|table of contents)$/i,
  },
];

const SOURCE_NOISE_PATTERN =
  /project gutenberg|gutenberg-tm|gutenberg license|full license|terms of use|www\.gutenberg|ebook|e-book|produced by|distributed proofreading|release date|language:|credits:|start of (?:the|this) project gutenberg|end of (?:the|this) project gutenberg|copyright laws|pglaf/i;
const PAGE_OR_DECORATIVE_PATTERN =
  /^\s*(?:\[?Page\s+\d+\]?|\[Pg\.?\s*\d+\]|\[\d+\]|-\s*\d+\s*-|[-_=*~.#:;'"`^+|\\/<>{}[\]().,!\u2013\u2014 ]{4,})\s*$/i;
const TOC_HEADING_PATTERN = /^(?:contents|table of contents|chapters?)$/i;
const PAGE_LEADER_PATTERN = /(?:\.{2,}|_{2,}|\s{3,})\s*(?:[ivxlcdm]+|\d{1,4})\s*$/i;
const PROSE_PUNCTUATION_PATTERN = /[.!?;:,]/;
const LOWERCASE_PATTERN = /[a-z]/;
const UPPERCASE_LETTER_PATTERN = /[A-Z]/;

function toPosixPath(input: string): string {
  return input.split(path.sep).join("/");
}

function relativeToRepo(filePath: string): string {
  return toPosixPath(path.relative(REPO_ROOT, filePath));
}

function findFiles(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  const files: string[] = [];
  const walk = (directory: string) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(entryPath);
        continue;
      }
      if (entry.isFile()) files.push(entryPath);
    }
  };
  walk(root);
  return files.sort((left, right) => left.localeCompare(right));
}

function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function titleFromFilename(filePath: string): string {
  return path.basename(filePath, path.extname(filePath)).replace(/[-_]+/g, " ");
}

function buildLines(text: string): TextLine[] {
  const lines: TextLine[] = [];
  let offset = 0;
  for (const [index, line] of text.split("\n").entries()) {
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

function parseRomanNumeral(input: string): number | null {
  const roman = input.toUpperCase();
  if (!/^[IVXLCDM]+$/.test(roman)) return null;
  if (
    !/^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(roman)
  ) {
    return null;
  }
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
    if (value < previous) total -= value;
    else total += value;
    previous = value;
  }
  return total > 0 ? total : null;
}

function parseOrdinal(input: string | undefined): number | null {
  if (!input) return null;
  const clean = input.replace(/[.):-]/g, "").trim().toUpperCase();
  if (/^\d+$/.test(clean)) return Number.parseInt(clean, 10);
  if (ORDINAL_WORDS[clean]) return ORDINAL_WORDS[clean];
  return parseRomanNumeral(clean);
}

function cleanTocTitle(input: string): string {
  return input
    .replace(/\.{2,}\s*(?:[ivxlcdm]+|\d{1,4})\s*$/i, "")
    .replace(/\s{3,}(?:[ivxlcdm]+|\d{1,4})\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function headingSignature(candidate: HeadingCandidate): string {
  const base = cleanTocTitle(candidate.normalized)
    .replace(/^chapter\s+/i, "chapter ")
    .replace(/[^\w]+/g, " ")
    .trim();
  return `${candidate.patternId}:${base}`;
}

function isSourceNoise(line: string): boolean {
  const trimmed = line.trim();
  return (
    trimmed.length === 0 ||
    SOURCE_NOISE_PATTERN.test(trimmed) ||
    PAGE_OR_DECORATIVE_PATTERN.test(trimmed)
  );
}

function countWordsLoose(input: string): number {
  return input.match(/[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)?/g)?.length ?? 0;
}

function isLikelyProseLine(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.length < 45) return false;
  if (isSourceNoise(trimmed)) return false;
  if (!LOWERCASE_PATTERN.test(trimmed)) return false;
  if (!PROSE_PUNCTUATION_PATTERN.test(trimmed)) return false;
  return countWordsLoose(trimmed) >= 8;
}

function isDialogueOrVerseBodyLine(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.length < 10 || isSourceNoise(trimmed)) return false;
  if (/^(?:enter|exit|exeunt|scene)\b/i.test(trimmed)) return true;
  if (/^[A-Z][A-Z .'-]{1,24}\.\s+/.test(trimmed)) return true;
  return countWordsLoose(trimmed) >= 4 && PROSE_PUNCTUATION_PATTERN.test(trimmed);
}

function nextReadablePreview(
  lines: TextLine[],
  index: number,
): { preview: string | null; bodyLike: boolean; reasons: string[] } {
  const reasons: string[] = [];
  for (let cursor = index + 1; cursor < Math.min(lines.length, index + 16); cursor += 1) {
    const line = lines[cursor];
    if (!line || !line.trimmed) continue;
    if (isSourceNoise(line.trimmed)) continue;
    if (looksLikeAnyFormalHeading(line.trimmed)) {
      reasons.push(`next heading-like line at ${line.lineNumber}`);
      continue;
    }
    if (isLikelyProseLine(line.trimmed)) {
      reasons.push(`followed by prose at line ${line.lineNumber}`);
      return { preview: textPreview(line.trimmed, 180), bodyLike: true, reasons };
    }
    if (isDialogueOrVerseBodyLine(line.trimmed)) {
      reasons.push(`followed by dialogue/verse-like body at line ${line.lineNumber}`);
      return { preview: textPreview(line.trimmed, 180), bodyLike: true, reasons };
    }
  }
  return { preview: null, bodyLike: false, reasons };
}

function nearbyShortListDensity(lines: TextLine[], index: number): number {
  const window = lines.slice(Math.max(0, index - 6), Math.min(lines.length, index + 7));
  return window.filter((line) => {
    if (!line.trimmed) return false;
    if (isLikelyProseLine(line.trimmed)) return false;
    return line.trimmed.length <= 110;
  }).length;
}

function explicitTocRanges(lines: TextLine[]): Array<{ start: number; end: number }> {
  const ranges: Array<{ start: number; end: number }> = [];
  const maxStartLine = Math.max(80, Math.floor(lines.length * 0.22));

  for (let index = 0; index < Math.min(lines.length, maxStartLine); index += 1) {
    if (!TOC_HEADING_PATTERN.test(lines[index]?.trimmed ?? "")) continue;
    let end = Math.min(lines.length - 1, index + 220);
    for (let cursor = index + 6; cursor < Math.min(lines.length, index + 220); cursor += 1) {
      const current = lines[cursor];
      const next = lines[cursor + 1];
      if (!current || !next) continue;
      if (isLikelyProseLine(current.trimmed) && isLikelyProseLine(next.trimmed)) {
        end = cursor - 1;
        break;
      }
      if (looksLikeAnyFormalHeading(current.trimmed) && cursor > index + 20) {
        const after = nextReadablePreview(lines, cursor);
        if (after.bodyLike) {
          end = cursor - 1;
          break;
        }
      }
    }
    ranges.push({ start: index + 1, end: end + 1 });
  }
  return ranges;
}

function isInRanges(lineNumber: number, ranges: Array<{ start: number; end: number }>): boolean {
  return ranges.some((range) => lineNumber >= range.start && lineNumber <= range.end);
}

function uppercaseRatio(input: string): number {
  const letters = input.match(/[A-Za-z]/g) ?? [];
  if (letters.length === 0) return 0;
  const upper = letters.filter((letter) => letter === letter.toUpperCase()).length;
  return upper / letters.length;
}

function isAllCapsTitleCandidate(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.length < 4 || trimmed.length > 110) return false;
  if (isSourceNoise(trimmed)) return false;
  if (looksLikeAnyFormalHeading(trimmed)) return false;
  if (/^(?:the end|end|finis|contents|table of contents)$/i.test(trimmed)) return false;
  if (!UPPERCASE_LETTER_PATTERN.test(trimmed)) return false;
  if (countWordsLoose(trimmed) > 14) return false;
  return uppercaseRatio(trimmed) >= 0.78;
}

function isTitleCaseHeadingCandidate(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.length < 4 || trimmed.length > 90) return false;
  if (isSourceNoise(trimmed)) return false;
  if (looksLikeAnyFormalHeading(trimmed)) return false;
  if (/^(?:the end|end|finis|contents|table of contents)$/i.test(trimmed)) return false;
  if (countWordsLoose(trimmed) > 12) return false;
  if (/[.!]$/.test(trimmed) && !/[?!]$/.test(trimmed)) return false;
  const words = trimmed.match(/[A-Za-z][A-Za-z'-]*/g) ?? [];
  if (words.length === 0) return false;
  const capitalized = words.filter((word) => /^[A-Z]/.test(word)).length;
  return capitalized / words.length >= 0.55;
}

function looksLikeAnyFormalHeading(line: string): boolean {
  const normalized = line.replace(/\s+/g, " ").trim();
  if (!normalized || normalized.length > 140) return false;
  return PATTERNS.some((pattern) => {
    pattern.expression.lastIndex = 0;
    return pattern.expression.test(normalized);
  });
}

function collectRawCandidates(lines: TextLine[], textLength: number): HeadingCandidate[] {
  const candidates: HeadingCandidate[] = [];
  lines.forEach((line, index) => {
    const normalized = line.trimmed;
    if (!normalized || normalized.length > 150 || isSourceNoise(normalized)) return;

    for (const pattern of PATTERNS) {
      pattern.expression.lastIndex = 0;
      const match = pattern.expression.exec(normalized);
      if (!match) continue;
      const ordinalRaw = pattern.ordinalGroup ? (match[pattern.ordinalGroup] ?? null) : null;
      candidates.push({
        patternId: pattern.id,
        patternLabel: pattern.label,
        convention: pattern.convention,
        kind: pattern.kind,
        lineNumber: line.lineNumber,
        offset: line.offset,
        lineRatio: textLength > 0 ? line.offset / textLength : 0,
        rawLine: line.text,
        normalized,
        ordinal: parseOrdinal(ordinalRaw ?? undefined),
        ordinalRaw,
        isTocLike: false,
        tocReasons: [],
        isBodyLike: false,
        bodyReasons: [],
        nextProsePreview: null,
      });
    }

    if (isAllCapsTitleCandidate(normalized)) {
      candidates.push({
        patternId: "all-caps-title",
        patternLabel: "All-caps story or titled-section heading",
        convention: "story or titled-section headings",
        kind: "story-title",
        lineNumber: line.lineNumber,
        offset: line.offset,
        lineRatio: textLength > 0 ? line.offset / textLength : 0,
        rawLine: line.text,
        normalized,
        ordinal: null,
        ordinalRaw: null,
        isTocLike: false,
        tocReasons: [],
        isBodyLike: false,
        bodyReasons: [],
        nextProsePreview: null,
      });
    } else if (isTitleCaseHeadingCandidate(normalized)) {
      const previous = lines[index - 1]?.trimmed ?? "";
      const next = lines[index + 1]?.trimmed ?? "";
      if (!previous || !next || next.length < 100) {
        candidates.push({
          patternId: "isolated-title-case",
          patternLabel: "Isolated title-case heading",
          convention: "isolated titled sections",
          kind: "titled-section",
          lineNumber: line.lineNumber,
          offset: line.offset,
          lineRatio: textLength > 0 ? line.offset / textLength : 0,
          rawLine: line.text,
          normalized,
          ordinal: null,
          ordinalRaw: null,
          isTocLike: false,
          tocReasons: [],
          isBodyLike: false,
          bodyReasons: [],
          nextProsePreview: null,
        });
      }
    }
  });

  return candidates;
}

function annotateCandidates(lines: TextLine[], candidates: HeadingCandidate[]): HeadingCandidate[] {
  const tocRanges = explicitTocRanges(lines);
  const bySignature = new Map<string, HeadingCandidate[]>();
  for (const candidate of candidates) {
    const signature = headingSignature(candidate);
    const list = bySignature.get(signature) ?? [];
    list.push(candidate);
    bySignature.set(signature, list);
  }

  return candidates.map((candidate) => {
    const index = candidate.lineNumber - 1;
    const tocReasons: string[] = [];
    const bodyReasons: string[] = [];
    const duplicateLater = (bySignature.get(headingSignature(candidate)) ?? []).some(
      (other) => other.lineNumber > candidate.lineNumber + 30,
    );

    if (isInRanges(candidate.lineNumber, tocRanges)) tocReasons.push("inside explicit contents range");
    if (PAGE_LEADER_PATTERN.test(candidate.normalized)) tocReasons.push("line ends like a TOC page leader");
    if (candidate.lineRatio < 0.23 && duplicateLater) {
      tocReasons.push("matching heading appears later in the body");
    }
    if (candidate.lineRatio < 0.2 && nearbyShortListDensity(lines, index) >= 7) {
      tocReasons.push("surrounded by compact short-list entries near the front");
    }

    const next = nextReadablePreview(lines, index);
    if (next.bodyLike) bodyReasons.push(...next.reasons);
    if (!tocReasons.length && candidate.lineRatio >= 0.08) {
      bodyReasons.push("outside early front-matter zone");
    }
    if (candidate.lineRatio < 0.08 && next.bodyLike && !PAGE_LEADER_PATTERN.test(candidate.normalized)) {
      bodyReasons.push("early heading is followed by readable body text");
    }
    if (/^(?:contents|table of contents)$/i.test(candidate.normalized)) {
      bodyReasons.length = 0;
      tocReasons.push("contents marker");
    }

    return {
      ...candidate,
      isTocLike: tocReasons.length > 0,
      tocReasons,
      isBodyLike: bodyReasons.length > 0 && tocReasons.length === 0,
      bodyReasons,
      nextProsePreview: next.preview,
    };
  });
}

function sectionSizeNotes(
  text: string,
  candidates: HeadingCandidate[],
): SectionSizeNotes | null {
  if (candidates.length === 0) return null;
  const sorted = [...candidates].sort((left, right) => left.offset - right.offset);
  const wordCounts = sorted.map((candidate, index) => {
    const endOffset = sorted[index + 1]?.offset ?? text.length;
    return countBookWords(text.slice(candidate.offset, endOffset));
  });
  const sortedWords = [...wordCounts].sort((left, right) => left - right);
  const total = wordCounts.reduce((sum, value) => sum + value, 0);
  const median = sortedWords[Math.floor(sortedWords.length / 2)] ?? 0;
  const minimum = sortedWords[0] ?? 0;
  const maximum = sortedWords[sortedWords.length - 1] ?? 0;
  const huge = wordCounts.filter((count) => count > HUGE_SECTION_WORDS).length;
  const tiny = wordCounts.filter((count) => count > 0 && count < TINY_SECTION_WORDS).length;
  const notes: string[] = [];
  if (huge > 0) notes.push(`${huge} section(s) exceed ${HUGE_SECTION_WORDS} words`);
  if (tiny > Math.max(2, Math.floor(wordCounts.length * 0.35))) {
    notes.push("many very small sections; headings may include TOC, captions, or fragments");
  }
  if (maximum > 0 && median > 0 && maximum > median * 8) {
    notes.push("largest section is much bigger than the median section");
  }
  if (notes.length === 0) notes.push("section sizes look plausible for the selected strategy");
  return {
    sectionCount: candidates.length,
    minimumWords: minimum,
    medianWords: median,
    maximumWords: maximum,
    averageWords: Math.round(total / wordCounts.length),
    hugeSectionCount: huge,
    tinySectionCount: tiny,
    notes,
  };
}

function sequentialScore(candidates: HeadingCandidate[]): number {
  const ordinals = candidates
    .map((candidate) => candidate.ordinal)
    .filter((ordinal): ordinal is number => ordinal !== null);
  if (ordinals.length < 2) return 0.45;
  let sequentialPairs = 0;
  for (let index = 1; index < ordinals.length; index += 1) {
    if (ordinals[index] === (ordinals[index - 1] ?? 0) + 1) sequentialPairs += 1;
  }
  const startsNearBeginning = ordinals[0] === 1 || ordinals[0] === 0;
  return (sequentialPairs / Math.max(1, ordinals.length - 1)) * (startsNearBeginning ? 1 : 0.8);
}

function confidenceFromScore(score: number): ConfidenceLevel {
  if (score >= 0.78) return "high";
  if (score >= 0.55) return "medium";
  if (score >= 0.28) return "low";
  return "blocked";
}

function scorePattern(
  text: string,
  patternId: string,
  candidates: HeadingCandidate[],
  allCandidatesForBook: HeadingCandidate[],
  rawWordCount: number,
): HeadingPatternSummary {
  const first = candidates[0];
  if (!first) {
    throw new Error(`Cannot score empty candidate group: ${patternId}`);
  }
  const bodyCandidates = candidates
    .filter((candidate) => candidate.isBodyLike)
    .sort((left, right) => left.offset - right.offset);
  const tocCandidates = candidates.filter((candidate) => candidate.isTocLike);
  const selectedForSizing = bodyCandidates.length > 0 ? bodyCandidates : [];
  const sizeNotes = sectionSizeNotes(text, selectedForSizing);
  const span =
    bodyCandidates.length >= 2
      ? ((bodyCandidates[bodyCandidates.length - 1]?.offset ?? 0) -
          (bodyCandidates[0]?.offset ?? 0)) /
        Math.max(1, text.length)
      : 0;
  const sequence = sequentialScore(bodyCandidates);
  let score = 0;
  if (bodyCandidates.length >= 2) score += 0.26;
  if (bodyCandidates.length >= 4) score += 0.15;
  if (bodyCandidates.length >= 8) score += 0.08;
  if (span >= 0.25) score += 0.13;
  if (span >= 0.55) score += 0.08;
  score += sequence * 0.18;
  if (tocCandidates.length > 0 && bodyCandidates.length > 0) score += 0.05;
  if (sizeNotes && sizeNotes.hugeSectionCount === 0 && sizeNotes.tinySectionCount <= bodyCandidates.length / 2) {
    score += 0.07;
  }
  if (bodyCandidates.length === 1 && rawWordCount < 8_000) score += 0.24;
  if (bodyCandidates.length <= 1 && rawWordCount >= HIGH_WORD_COUNT) score -= 0.12;
  if (tocCandidates.length > bodyCandidates.length && bodyCandidates.length < 3) score -= 0.18;
  if (first.patternId === "special-front-back") score -= 0.16;
  if (
    first.patternId === "isolated-title-case" &&
    allCandidatesForBook.some(
      (candidate) =>
        candidate.patternId !== "isolated-title-case" &&
        candidate.isBodyLike &&
        ["chapter", "book", "part", "act", "scene", "stave", "canto"].includes(candidate.kind),
    )
  ) {
    score -= 0.2;
  }
  score = Math.max(0, Math.min(1, score));

  return {
    patternId,
    label: first.patternLabel,
    convention: first.convention,
    kind: first.kind,
    candidateCount: candidates.length,
    tocLikeCount: tocCandidates.length,
    bodyLikeCount: bodyCandidates.length,
    examples: candidates.slice(0, 6).map((candidate) => `L${candidate.lineNumber}: ${candidate.normalized}`),
    bodyExamples: bodyCandidates
      .slice(0, 8)
      .map((candidate) => `L${candidate.lineNumber}: ${candidate.normalized}`),
    tocExamples: tocCandidates
      .slice(0, 8)
      .map((candidate) => `L${candidate.lineNumber}: ${candidate.normalized}`),
    score,
    confidence: confidenceFromScore(score),
    selected: false,
    rejectionReason: null,
    sectionSizeNotes: sizeNotes,
  };
}

function summarizePatterns(
  text: string,
  candidates: HeadingCandidate[],
  rawWordCount: number,
): HeadingPatternSummary[] {
  const byPattern = new Map<string, HeadingCandidate[]>();
  for (const candidate of candidates) {
    const list = byPattern.get(candidate.patternId) ?? [];
    list.push(candidate);
    byPattern.set(candidate.patternId, list);
  }
  return [...byPattern.entries()]
    .map(([patternId, group]) => scorePattern(text, patternId, group, candidates, rawWordCount))
    .sort(
      (left, right) =>
        right.score - left.score ||
        right.bodyLikeCount - left.bodyLikeCount ||
        right.candidateCount - left.candidateCount ||
        left.patternId.localeCompare(right.patternId),
    );
}

function chooseSelectedStrategy(summaries: HeadingPatternSummary[]): HeadingPatternSummary | null {
  const viable = summaries.filter(
    (summary) =>
      summary.bodyLikeCount > 0 &&
      summary.patternId !== "special-front-back" &&
      summary.confidence !== "blocked",
  );
  if (viable.length === 0) return null;
  const selected = viable[0];
  if (!selected || selected.score < 0.28) return null;
  return selected;
}

function rejectionReason(summary: HeadingPatternSummary, selected: HeadingPatternSummary | null): string {
  if (!selected) {
    if (summary.bodyLikeCount === 0 && summary.tocLikeCount > 0) {
      return "only TOC-like/front-list headings were found for this pattern";
    }
    if (summary.bodyLikeCount === 0) return "no body headings were supported by following readable text";
    return "score was too low for a reliable structure";
  }
  if (summary.patternId === selected.patternId) return "";
  if (summary.bodyLikeCount === 0 && summary.tocLikeCount > 0) {
    return "rejected as TOC-like or front-matter-only evidence";
  }
  if (summary.bodyLikeCount === 0) return "no convincing body headings for this pattern";
  if (summary.score < selected.score) return `weaker than selected strategy ${selected.patternId}`;
  return "not selected because another strategy better spans the readable body";
}

function generatedManifestPath(slug: string): string | null {
  const direct = path.join(GENERATED_ROOT, slug, "manifest.json");
  if (fs.existsSync(direct)) return direct;
  return null;
}

function readGeneratedComparison(
  slug: string,
  selected: HeadingPatternSummary | null,
): GeneratedComparison {
  const manifestPath = generatedManifestPath(slug);
  if (!manifestPath) {
    return {
      exists: false,
      manifestPath: null,
      sectionCount: 0,
      includedSectionCount: 0,
      warnings: [],
      firstPreview: null,
      lastPreview: null,
    };
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as GeneratedManifest;
  const sections = manifest.sections ?? [];
  const warnings = [...(manifest.warnings ?? [])];
  const sectionCount = manifest.stats?.sectionCount ?? sections.length;
  const includedSectionCount =
    manifest.stats?.includedSectionCount ??
    sections.filter((section) => section.wordCount !== 0).length;
  const firstPreview = sections[0]?.textPreview ?? null;
  const lastPreview = sections[sections.length - 1]?.textPreview ?? null;
  if (selected && selected.bodyLikeCount >= 5 && sectionCount > 0 && sectionCount <= 2) {
    warnings.push(
      `existing generated output has ${sectionCount} section(s), but raw audit finds ${selected.bodyLikeCount} likely body headings`,
    );
  }
  if (selected && sectionCount > 0 && sectionCount < Math.floor(selected.bodyLikeCount * 0.5)) {
    warnings.push(
      `existing generated output section count is far below likely raw body heading count (${sectionCount} vs ${selected.bodyLikeCount})`,
    );
  }
  if (firstPreview && /project gutenberg|contents|table of contents|produced by/i.test(firstPreview)) {
    warnings.push("existing generated first preview may include source, title-page, or TOC junk");
  }
  if (lastPreview && /project gutenberg|gutenberg license|end of (?:the )?project gutenberg/i.test(lastPreview)) {
    warnings.push("existing generated last preview may include footer or license junk");
  }
  return {
    exists: true,
    manifestPath: relativeToRepo(manifestPath),
    sectionCount,
    includedSectionCount,
    warnings,
    firstPreview,
    lastPreview,
  };
}

function confidenceFromCleaningConfidence(confidence: "high" | "medium" | "low"): ConfidenceLevel {
  return confidence;
}

function extractTitleAndAuthor(rawText: string, filePath: string): { title: string; author: string | null } {
  const header = rawText.slice(0, 6000);
  const title = header.match(/^Title:\s*(.+)$/im)?.[1]?.trim();
  const author = header.match(/^Author:\s*(.+)$/im)?.[1]?.trim() ?? null;
  return {
    title: title && title.length > 0 ? title : titleFromFilename(filePath),
    author,
  };
}

function handlingFor(redFlags: string[], confidence: ConfidenceLevel, fallbackRequired: boolean, rawWordCount: number): RecommendedHandling {
  if (redFlags.some((flag) => /^blocked:/i.test(flag))) return "blocked";
  if (fallbackRequired && rawWordCount >= HIGH_WORD_COUNT) return "needs manual sectioning review";
  if (redFlags.some((flag) => /generated output likely collapsed|toc\/body confusion|body headings were found but rejected/i.test(flag))) {
    return "needs manual sectioning review";
  }
  if (confidence === "high" && redFlags.length === 0) return "safe for normal processing";
  if (confidence === "medium" && redFlags.length <= 2) return "process with warnings";
  if (fallbackRequired && rawWordCount < 6_000) return "process with warnings";
  if (confidence === "low" && redFlags.length <= 2) return "process with warnings";
  return "needs manual sectioning review";
}

function detectedConvention(
  selected: HeadingPatternSummary | null,
  summaries: HeadingPatternSummary[],
): string {
  if (!selected) return "no reliable internal headings";
  const majorDivisions = summaries
    .filter(
      (summary) =>
        ["book", "part", "volume"].includes(summary.kind) &&
        summary.bodyLikeCount > 0 &&
        summary.patternId !== selected.patternId,
    )
    .map((summary) => summary.convention);
  if (majorDivisions.length > 0 && selected.kind === "chapter") {
    return `${selected.convention} with ${majorDivisions.join(" and ")}`;
  }
  return selected.convention;
}

function isMeaningfulCompetingStrategy(
  summary: HeadingPatternSummary,
  selected: HeadingPatternSummary,
): boolean {
  if (summary.selected) return false;
  if (["all-caps-title", "isolated-title-case", "special-front-back"].includes(summary.patternId)) {
    return false;
  }
  if (summary.kind === selected.kind) return false;
  return summary.bodyLikeCount >= 3 && summary.score >= selected.score * 0.85;
}

function examplesFromSummaries(
  summaries: HeadingPatternSummary[],
  key: "bodyExamples" | "tocExamples",
): string[] {
  const examples: string[] = [];
  for (const summary of summaries) {
    for (const example of summary[key]) {
      if (examples.length >= 10) return examples;
      examples.push(example);
    }
  }
  return examples;
}

function prioritizedExamples(
  selected: HeadingPatternSummary | null,
  summaries: HeadingPatternSummary[],
  key: "bodyExamples" | "tocExamples",
): string[] {
  if (selected && selected[key].length > 0) return selected[key].slice(0, 10);
  const examples: string[] = [];
  for (const example of examplesFromSummaries(summaries, key)) {
    if (examples.length >= 10) return examples;
    if (!examples.includes(example)) examples.push(example);
  }
  return examples;
}

function auditTextBook(filePath: string): BookStructureAudit {
  const rawText = normalizeBookText(fs.readFileSync(filePath, "utf8"));
  const rawWordCount = countBookWords(rawText);
  const slug = slugify(titleFromFilename(filePath));
  const sourcePath = relativeToRepo(filePath);
  const { title, author } = extractTitleAndAuthor(rawText, filePath);
  const cleaned = cleanGutenbergText(rawText);
  const cleanedText = trimBookText(cleaned.cleanedText || rawText);
  const cleanedWordCount = countBookWords(cleanedText);
  const lines = buildLines(cleanedText);
  const candidates = annotateCandidates(
    lines,
    collectRawCandidates(lines, Math.max(1, cleanedText.length)),
  );
  const patternSummaries = summarizePatterns(cleanedText, candidates, rawWordCount);
  const selected = chooseSelectedStrategy(patternSummaries);
  const selectedWithFlag = patternSummaries.map((summary) => ({
    ...summary,
    selected: selected?.patternId === summary.patternId,
    rejectionReason: selected?.patternId === summary.patternId ? null : rejectionReason(summary, selected),
  }));
  const selectedSummary = selectedWithFlag.find((summary) => summary.selected) ?? null;
  const generatedComparison = readGeneratedComparison(slug, selectedSummary);
  const fallbackRequired = selectedSummary === null;
  const fallbackReason = fallbackRequired
    ? candidates.length > 0
      ? "candidate headings were present, but none had enough body-heading evidence"
      : "no plausible chapter, section, story, play, date, or titled-section headings were detected"
    : null;
  const fallbackLegitimacy =
    fallbackRequired && rawWordCount < 6_000 && candidates.length <= 2
      ? "legitimate"
      : fallbackRequired
        ? "suspicious"
        : "not required";
  const likelyToc = patternSummaries.some((summary) => summary.tocLikeCount > 0);
  const likelyBody = patternSummaries.some((summary) => summary.bodyLikeCount > 0);
  const sectionNotes = selectedSummary?.sectionSizeNotes ?? null;
  const redFlags: string[] = [];

  if (rawWordCount < 25) redFlags.push("blocked: source has almost no readable text");
  if (!selectedSummary) redFlags.push("no reliable chapters, sections, story headings, or structural headings detected");
  if (fallbackRequired && candidates.length >= 5) {
    redFlags.push("fallback would be used even though many candidate headings exist");
  }
  if (fallbackRequired && fallbackLegitimacy === "suspicious") {
    redFlags.push("suspicious fallback-only structure");
  }
  if (selectedSummary && selectedSummary.bodyLikeCount <= 2 && rawWordCount >= HIGH_WORD_COUNT) {
    redFlags.push("only 1-2 detected sections for a high-word-count book");
  }
  if (sectionNotes && sectionNotes.hugeSectionCount > 0) {
    redFlags.push("long book has huge sections despite detected headings");
  }
  if (
    likelyToc &&
    (!selectedSummary || selectedSummary.confidence === "low" || selectedSummary.tocLikeCount > selectedSummary.bodyLikeCount)
  ) {
    redFlags.push("TOC/body confusion is likely");
  }
  if (
    selectedSummary &&
    selectedWithFlag.some((summary) => isMeaningfulCompetingStrategy(summary, selectedSummary))
  ) {
    redFlags.push("body headings were found but rejected by the selected strategy");
  }
  if (cleaned.report.confidence === "low") redFlags.push("start/end boundary confidence is low");
  if (generatedComparison.warnings.some((warning) => /far below|has \d+ section/i.test(warning))) {
    redFlags.push("generated output likely collapsed real structure");
  }
  if (generatedComparison.warnings.some((warning) => /junk|footer|license/i.test(warning))) {
    redFlags.push("generated output may include source/license/TOC/footer junk");
  }

  const confidenceScore = selectedSummary?.score ?? 0;
  const confidenceLevel = selectedSummary?.confidence ?? (rawWordCount < 25 ? "blocked" : "low");
  let recommendedHandling = handlingFor(redFlags, confidenceLevel, fallbackRequired, rawWordCount);
  if (
    recommendedHandling === "safe for normal processing" &&
    selectedSummary &&
    selectedSummary.tocLikeCount > 0
  ) {
    recommendedHandling = "process with warnings";
  }
  const perBookMarkdownPath = path.join(BOOK_REPORTS_ROOT, `${slug || "untitled-source"}.md`);

  return {
    slug: slug || "untitled-source",
    sourceFilename: path.basename(filePath),
    sourcePath,
    rawWordCount,
    cleanedWordCount,
    likelyTitle: title,
    likelyAuthor: author,
    detectedStructuralConvention: detectedConvention(selectedSummary, selectedWithFlag),
    confidenceScore: Number(confidenceScore.toFixed(3)),
    confidenceLevel,
    allCandidateHeadingPatternsFound: selectedWithFlag,
    selectedHeadingStrategy: selectedSummary,
    rejectedHeadingStrategies: selectedWithFlag
      .filter((summary) => !summary.selected)
      .map((summary) => ({
        patternId: summary.patternId,
        convention: summary.convention,
        candidateCount: summary.candidateCount,
        bodyLikeCount: summary.bodyLikeCount,
        tocLikeCount: summary.tocLikeCount,
        reason: summary.rejectionReason ?? "not selected",
      })),
    estimatedSectionCount: selectedSummary?.bodyLikeCount ?? 0,
    fallbackRequired,
    fallbackReason,
    fallbackLegitimacy,
    likelyTocHeadingsDetected: likelyToc,
    likelyBodyHeadingsDetected: likelyBody,
    examplesOfDetectedBodyHeadings: prioritizedExamples(selectedSummary, selectedWithFlag, "bodyExamples"),
    examplesOfRejectedTocLikeHeadings: prioritizedExamples(selectedSummary, selectedWithFlag, "tocExamples"),
    sectionSizeSanityNotes: sectionNotes,
    startBoundaryConfidence: confidenceFromCleaningConfidence(cleaned.report.confidence),
    endBoundaryConfidence: confidenceFromCleaningConfidence(cleaned.report.confidence),
    cleaningWarnings: cleaned.report.warnings,
    redFlags,
    recommendedHandling,
    generatedComparison,
    perBookMarkdownPath: relativeToRepo(perBookMarkdownPath),
  };
}

function escapeMarkdown(input: string): string {
  return input.replace(/\|/g, "\\|").replace(/\n/g, "<br>");
}

function markdownList(items: string[], empty = "- None."): string {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : empty;
}

function compactBookList(books: BookStructureAudit[], limit = 120): string[] {
  const shown = books.slice(0, limit).map((book) => `${book.slug} - ${book.detectedStructuralConvention}`);
  if (books.length > limit) shown.push(`...and ${books.length - limit} more in the JSON report`);
  return shown;
}

function perBookMarkdown(book: BookStructureAudit): string {
  const patternRows =
    book.allCandidateHeadingPatternsFound.length === 0
      ? "| None | 0 | 0 | 0 |  |"
      : book.allCandidateHeadingPatternsFound
          .map(
            (summary) =>
              `| ${escapeMarkdown(summary.patternId)} | ${summary.candidateCount} | ${summary.bodyLikeCount} | ${summary.tocLikeCount} | ${summary.selected ? "yes" : "no"} | ${escapeMarkdown(summary.rejectionReason ?? "")} |`,
          )
          .join("\n");

  return [
    `# ${book.slug}`,
    "",
    `- Source: \`${book.sourcePath}\``,
    `- Title: ${book.likelyTitle}`,
    `- Author: ${book.likelyAuthor ?? "unknown"}`,
    `- Raw words: ${book.rawWordCount}`,
    `- Detected convention: ${book.detectedStructuralConvention}`,
    `- Confidence: ${book.confidenceLevel} (${book.confidenceScore})`,
    `- Recommended handling: ${book.recommendedHandling}`,
    `- Fallback required: ${book.fallbackRequired ? "yes" : "no"}`,
    book.fallbackReason ? `- Fallback reason: ${book.fallbackReason}` : "- Fallback reason: not required",
    `- Fallback legitimacy: ${book.fallbackLegitimacy}`,
    "",
    "## Candidate Patterns",
    "",
    "| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |",
    "| --- | ---: | ---: | ---: | --- | --- |",
    patternRows,
    "",
    "## Body Heading Examples",
    "",
    markdownList(book.examplesOfDetectedBodyHeadings),
    "",
    "## Rejected TOC-like Examples",
    "",
    markdownList(book.examplesOfRejectedTocLikeHeadings),
    "",
    "## Section Size Sanity",
    "",
    book.sectionSizeSanityNotes
      ? [
          `- Sections: ${book.sectionSizeSanityNotes.sectionCount}`,
          `- Min/median/max words: ${book.sectionSizeSanityNotes.minimumWords}/${book.sectionSizeSanityNotes.medianWords}/${book.sectionSizeSanityNotes.maximumWords}`,
          `- Notes: ${book.sectionSizeSanityNotes.notes.join("; ")}`,
        ].join("\n")
      : "- No selected section strategy.",
    "",
    "## Boundary Confidence",
    "",
    `- Start: ${book.startBoundaryConfidence}`,
    `- End: ${book.endBoundaryConfidence}`,
    book.cleaningWarnings.length ? markdownList(book.cleaningWarnings) : "- No cleaning warnings.",
    "",
    "## Generated Comparison",
    "",
    book.generatedComparison.exists
      ? [
          `- Manifest: \`${book.generatedComparison.manifestPath ?? ""}\``,
          `- Sections: ${book.generatedComparison.sectionCount}`,
          `- Included sections: ${book.generatedComparison.includedSectionCount}`,
          book.generatedComparison.warnings.length
            ? markdownList(book.generatedComparison.warnings)
            : "- No generated comparison warnings.",
        ].join("\n")
      : "- No existing generated manifest found for this slug.",
    "",
    "## Red Flags",
    "",
    markdownList(book.redFlags),
    "",
  ].join("\n");
}

function addGroupedCount(
  groups: Map<string, { convention: string; count: number; examples: string[] }>,
  convention: string,
  slug: string,
): void {
  const group = groups.get(convention) ?? { convention, count: 0, examples: [] };
  group.count += 1;
  if (group.examples.length < 10) group.examples.push(slug);
  groups.set(convention, group);
}

function buildRoom13Regression(books: BookStructureAudit[]): GlobalReport["room13Regression"] {
  const room = books.find((book) => book.slug === "room-13");
  if (!room) {
    return {
      found: false,
      correctlyIdentifiedAsChapterBased: false,
      chapterHeadingCount: 0,
      examples: [],
      appearsBodyNotToc: false,
      whyPriorTwoSectionDryRunWasWrong: "Room 13 was not present in this source scan.",
      recommendedAfterDetectorFix: "unknown",
    };
  }
  const chapterSummary = room.allCandidateHeadingPatternsFound.find(
    (summary) => summary.patternId === "chapter-roman" || summary.patternId === "chapter-arabic",
  );
  const chapterHeadingCount = chapterSummary?.bodyLikeCount ?? 0;
  const correctlyIdentified = /chapter-based/i.test(room.detectedStructuralConvention) && chapterHeadingCount >= 10;
  return {
    found: true,
    correctlyIdentifiedAsChapterBased: correctlyIdentified,
    chapterHeadingCount,
    examples: chapterSummary?.bodyExamples.slice(0, 8) ?? [],
    appearsBodyNotToc: Boolean(chapterSummary && chapterSummary.bodyLikeCount >= chapterSummary.tocLikeCount),
    whyPriorTwoSectionDryRunWasWrong: correctlyIdentified
      ? `The raw body contains ${chapterHeadingCount} repeated chapter headings that are followed by readable body text, so a 2-section fallback dry run collapsed real chapter structure.`
      : "This audit still did not find enough body chapter headings; the detector needs more work before Room 13 can be processed.",
    recommendedAfterDetectorFix: correctlyIdentified ? "process with warnings" : room.recommendedHandling,
  };
}

function buildTopWeaknesses(books: BookStructureAudit[]): string[] {
  const nonChapter = books.filter(
    (book) =>
      book.selectedHeadingStrategy &&
      !/chapter-based/i.test(book.selectedHeadingStrategy.convention),
  ).length;
  const noHeadings = books.filter((book) => book.fallbackRequired).length;
  const tocConfusion = books.filter((book) =>
    book.redFlags.some((flag) => /TOC\/body confusion/i.test(flag)),
  ).length;
  const collapsedGenerated = books.filter((book) =>
    book.redFlags.some((flag) => /generated output likely collapsed/i.test(flag)),
  ).length;
  const rejectedBody = books.filter((book) =>
    book.redFlags.some((flag) => /body headings were found but rejected/i.test(flag)),
  ).length;
  return [
    `A chapter-only detector is not enough: ${nonChapter} source(s) are better described by non-chapter conventions such as stories, acts, staves, cantos, parts, dated entries, or titled sections.`,
    `${noHeadings} source(s) have no reliable internal headings and need explicit one-section/fallback policy instead of silent chunking.`,
    `${tocConfusion} source(s) show likely TOC/body confusion and need position, repetition, and following-prose checks.`,
    `${rejectedBody} source(s) have body-like heading candidates outside the selected strategy; detector decisions should be explainable and reviewable.`,
    `${collapsedGenerated} existing generated output comparison(s) appear to have collapsed real structure or included wrong boundary material.`,
  ];
}

function recommendedFixes(): string[] {
  return [
    "Replace the hard chapter-only gate with a scored heading strategy that can select chapters, story titles, parts/books/volumes, acts/scenes, staves/cantos, letters, dated entries, or an intentional one-section fallback.",
    "Keep TOC candidates as evidence, but reject only the compact front-list occurrence when the same headings repeat later with body paragraphs.",
    "Do not reject body headings solely because they have leading whitespace or trailing punctuation; score them with nearby prose and sequence evidence.",
    "Surface fallback as a warning/manual-review state when candidate headings exist or a long source would become only 1-2 parts.",
    "Use section-size sanity checks before writing generated books, especially huge sections, tiny fragment-heavy sections, and generated-vs-raw section-count mismatches.",
    "Add a regression fixture for Room 13 that expects the Chapter I through Chapter XXXIII body sequence to be detected before any write pass.",
  ];
}

function buildReport(textBooks: BookStructureAudit[], nonTextFiles: NonTextFile[]): GlobalReport {
  const conventionGroups = new Map<string, { convention: string; count: number; examples: string[] }>();
  const confidenceCounts: Record<ConfidenceLevel, number> = {
    high: 0,
    medium: 0,
    low: 0,
    blocked: 0,
  };

  for (const book of textBooks) {
    addGroupedCount(conventionGroups, book.detectedStructuralConvention, book.slug);
    confidenceCounts[book.confidenceLevel] += 1;
  }

  const noHeadings = textBooks.filter((book) => book.fallbackRequired);
  const suspiciousFallback = textBooks.filter(
    (book) => book.fallbackRequired && book.fallbackLegitimacy === "suspicious",
  );
  const oneOrTwoHighWord = textBooks.filter(
    (book) => book.estimatedSectionCount > 0 && book.estimatedSectionCount <= 2 && book.rawWordCount >= HIGH_WORD_COUNT,
  );
  const tocConfusion = textBooks.filter((book) =>
    book.redFlags.some((flag) => /TOC\/body confusion/i.test(flag)),
  );
  const bodyRejected = textBooks.filter((book) =>
    book.redFlags.some((flag) => /body headings were found but rejected/i.test(flag)),
  );
  const manual = textBooks.filter((book) => book.recommendedHandling === "needs manual sectioning review");
  const safe = textBooks.filter((book) => book.recommendedHandling === "safe for normal processing");
  const warnings = textBooks.filter((book) => book.recommendedHandling === "process with warnings");
  const blocked = textBooks.filter((book) => book.recommendedHandling === "blocked");

  return {
    schemaVersion: 1,
    reportName: "book-structure-audit-1",
    generatedAt: new Date().toISOString(),
    paths: {
      tempBooks: relativeToRepo(TEMP_BOOKS_ROOT),
      generatedBooks: relativeToRepo(GENERATED_ROOT),
      cloudflareExport: relativeToRepo(CLOUDFLARE_EXPORT_ROOT),
      auditRoot: relativeToRepo(AUDIT_ROOT),
    },
    totals: {
      sourceFilesScanned: textBooks.length + nonTextFiles.length,
      textBooksScanned: textBooks.length,
      nonTextBlockedFiles: nonTextFiles.length,
    },
    countsByDetectedStructuralConvention: [...conventionGroups.values()].sort(
      (left, right) => right.count - left.count || left.convention.localeCompare(right.convention),
    ),
    countsByConfidenceLevel: confidenceCounts,
    booksWithNoDetectedChaptersSectionsOrStoryHeadings: noHeadings.map((book) => book.slug),
    booksWithSuspiciousFallbackOnlyStructure: suspiciousFallback.map((book) => book.slug),
    booksWithOnlyOneOrTwoDetectedSectionsButHighWordCount: oneOrTwoHighWord.map((book) => book.slug),
    booksWhereTocBodyConfusionIsLikely: tocConfusion.map((book) => book.slug),
    booksWhereBodyHeadingsWereFoundButRejected: bodyRejected.map((book) => book.slug),
    booksNeedingManualSectioningReview: manual.map((book) => book.slug),
    booksSafeForNormalProcessing: safe.map((book) => book.slug),
    booksToProcessWithWarnings: warnings.map((book) => book.slug),
    blockedBooks: blocked.map((book) => book.slug),
    topParserWeaknessesFound: buildTopWeaknesses(textBooks),
    recommendedDetectorFixesBeforeMoreWritePasses: recommendedFixes(),
    room13Regression: buildRoom13Regression(textBooks),
    confirmations: {
      tempBooksModified: false,
      generatedOutputsModified: false,
      cloudflareExportModified: false,
      reportOnlyAudit: true,
    },
    nonTextFiles,
    books: textBooks,
  };
}

function mainMarkdown(report: GlobalReport): string {
  const conventionRows = report.countsByDetectedStructuralConvention
    .map(
      (entry) =>
        `| ${escapeMarkdown(entry.convention)} | ${entry.count} | ${entry.examples.map(escapeMarkdown).join("<br>")} |`,
    )
    .join("\n");
  const confidenceRows = (["high", "medium", "low", "blocked"] as const)
    .map((level) => `| ${level} | ${report.countsByConfidenceLevel[level]} |`)
    .join("\n");
  const listBooksBySlugs = (slugs: string[], limit = 120) => {
    const shown = slugs.slice(0, limit);
    const lines = shown.map((slug) => `- ${slug}`);
    if (slugs.length > limit) lines.push(`- ...and ${slugs.length - limit} more in the JSON report.`);
    return lines.length ? lines.join("\n") : "- None.";
  };
  const nonText = report.nonTextFiles.length
    ? report.nonTextFiles
        .map((file) => `- ${file.sourcePath} (${file.extension || "no extension"})`)
        .join("\n")
    : "- None.";

  return [
    "# Book Structure Audit 1",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "This is a report-only global structure analysis. It reads source text files, optionally reads existing generated manifests for comparison, and writes only this audit report tree.",
    "",
    "## Totals",
    "",
    `- Total source files scanned: ${report.totals.sourceFilesScanned}`,
    `- Total text books scanned: ${report.totals.textBooksScanned}`,
    `- Non-text/blocked files: ${report.totals.nonTextBlockedFiles}`,
    "",
    "## Non-Text / Blocked Files",
    "",
    nonText,
    "",
    "## Counts By Detected Structural Convention",
    "",
    "| Convention | Books | Examples |",
    "| --- | ---: | --- |",
    conventionRows || "| None | 0 | |",
    "",
    "## Counts By Confidence Level",
    "",
    "| Confidence | Books |",
    "| --- | ---: |",
    confidenceRows,
    "",
    "## Books With No Detected Chapters, Sections, Or Story Headings",
    "",
    listBooksBySlugs(report.booksWithNoDetectedChaptersSectionsOrStoryHeadings),
    "",
    "## Suspicious Fallback-Only Structure",
    "",
    listBooksBySlugs(report.booksWithSuspiciousFallbackOnlyStructure),
    "",
    "## Only 1-2 Detected Sections With High Word Count",
    "",
    listBooksBySlugs(report.booksWithOnlyOneOrTwoDetectedSectionsButHighWordCount),
    "",
    "## TOC / Body Confusion Likely",
    "",
    listBooksBySlugs(report.booksWhereTocBodyConfusionIsLikely),
    "",
    "## Body Headings Found But Rejected",
    "",
    listBooksBySlugs(report.booksWhereBodyHeadingsWereFoundButRejected),
    "",
    "## Needs Manual Sectioning Review",
    "",
    listBooksBySlugs(report.booksNeedingManualSectioningReview),
    "",
    "## Safe For Normal Processing",
    "",
    markdownList(compactBookList(report.books.filter((book) => book.recommendedHandling === "safe for normal processing"))),
    "",
    "## Process With Warnings",
    "",
    markdownList(compactBookList(report.books.filter((book) => book.recommendedHandling === "process with warnings"))),
    "",
    "## Blocked Books",
    "",
    listBooksBySlugs(report.blockedBooks),
    "",
    "## Top Parser Weaknesses Found",
    "",
    markdownList(report.topParserWeaknessesFound),
    "",
    "## Recommended Detector Fixes Before More Write Passes",
    "",
    markdownList(report.recommendedDetectorFixesBeforeMoreWritePasses),
    "",
    "## Room 13 Regression",
    "",
    `- Found: ${report.room13Regression.found ? "yes" : "no"}`,
    `- Correctly identified as chapter-based: ${report.room13Regression.correctlyIdentifiedAsChapterBased ? "yes" : "no"}`,
    `- Chapter headings found: ${report.room13Regression.chapterHeadingCount}`,
    `- Body headings rather than TOC: ${report.room13Regression.appearsBodyNotToc ? "yes" : "no"}`,
    `- Why the prior 2-section dry run was wrong: ${report.room13Regression.whyPriorTwoSectionDryRunWasWrong}`,
    `- Recommended after detector fix: ${report.room13Regression.recommendedAfterDetectorFix}`,
    "",
    "Examples:",
    "",
    markdownList(report.room13Regression.examples),
    "",
    "## Protected Folder Confirmation",
    "",
    "- `app/client/assets/temp-books` was read but not modified.",
    "- `app/client/assets/books/generated` was read for comparison but not modified.",
    "- `app/client/assets/books/cloudflare-export` was not modified.",
    "- No final generated books were written.",
    "",
    "## Machine-Readable Details",
    "",
    "See `book-structure-audit-1.json` and compact per-book reports under `books/`.",
    "",
  ].join("\n");
}

function main(): void {
  const sourceFiles = findFiles(TEMP_BOOKS_ROOT);
  const textFiles = sourceFiles.filter((filePath) => path.extname(filePath).toLowerCase() === ".txt");
  const nonTextFiles = sourceFiles
    .filter((filePath) => path.extname(filePath).toLowerCase() !== ".txt")
    .map((filePath) => ({
      sourceFilename: path.basename(filePath),
      sourcePath: relativeToRepo(filePath),
      extension: path.extname(filePath).toLowerCase(),
    }));

  fs.mkdirSync(BOOK_REPORTS_ROOT, { recursive: true });

  const books = textFiles.map(auditTextBook).sort((left, right) => left.slug.localeCompare(right.slug));
  for (const book of books) {
    fs.writeFileSync(path.join(REPO_ROOT, book.perBookMarkdownPath), perBookMarkdown(book), "utf8");
  }

  const report = buildReport(books, nonTextFiles);
  fs.writeFileSync(MAIN_JSON_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  fs.writeFileSync(MAIN_MARKDOWN_PATH, mainMarkdown(report), "utf8");

  console.log("Book structure audit 1 complete.");
  console.log(`Source files scanned: ${report.totals.sourceFilesScanned}`);
  console.log(`Text books scanned: ${report.totals.textBooksScanned}`);
  console.log(`Non-text files: ${report.totals.nonTextBlockedFiles}`);
  console.log(
    `Confidence counts: high ${report.countsByConfidenceLevel.high}, medium ${report.countsByConfidenceLevel.medium}, low ${report.countsByConfidenceLevel.low}, blocked ${report.countsByConfidenceLevel.blocked}`,
  );
  console.log(
    `Room 13 chapter headings: ${report.room13Regression.chapterHeadingCount} (${report.room13Regression.correctlyIdentifiedAsChapterBased ? "chapter-based" : "not confirmed"})`,
  );
  console.log(`Wrote ${relativeToRepo(MAIN_JSON_PATH)}`);
  console.log(`Wrote ${relativeToRepo(MAIN_MARKDOWN_PATH)}`);
}

main();
