import type {
  BookMetadata,
  BookSectionKind,
  DetectedBookSection,
} from "../bookManifestTypes.ts";
import {
  countBookWords,
  estimateMorseCharacters,
  textPreview,
  trimBookText,
} from "../bookTextNormalization.ts";

export type StructureConfidenceLevel = "high" | "medium" | "low" | "blocked";
export type FallbackLegitimacy = "legitimate" | "suspicious" | "not required";

export type BookHeadingKind =
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

export type BookHeadingCandidate = {
  patternId: string;
  patternLabel: string;
  convention: string;
  kind: BookHeadingKind;
  lineNumber: number;
  offset: number;
  lineRatio: number;
  rawLine: string;
  normalized: string;
  ordinal: number | null;
  ordinalRaw: string | null;
  title: string | null;
  isTocLike: boolean;
  tocReasons: string[];
  isBodyLike: boolean;
  bodyReasons: string[];
  nextProsePreview: string | null;
};

export type BookSectionSizeNotes = {
  sectionCount: number;
  minimumWords: number;
  medianWords: number;
  maximumWords: number;
  averageWords: number;
  hugeSectionCount: number;
  tinySectionCount: number;
  notes: string[];
};

export type BookHeadingPatternSummary = {
  patternId: string;
  label: string;
  convention: string;
  kind: BookHeadingKind;
  candidateCount: number;
  tocLikeCount: number;
  bodyLikeCount: number;
  examples: string[];
  bodyExamples: string[];
  tocExamples: string[];
  score: number;
  confidence: StructureConfidenceLevel;
  selected: boolean;
  rejectionReason: string | null;
  sectionSizeNotes: BookSectionSizeNotes | null;
};

export type RejectedBookHeadingStrategy = {
  patternId: string;
  convention: string;
  candidateCount: number;
  bodyLikeCount: number;
  tocLikeCount: number;
  reason: string;
};

export type BookStructureAnalysis = {
  detectedStructuralConvention: string;
  confidenceScore: number;
  confidenceLevel: StructureConfidenceLevel;
  allCandidateHeadingPatternsFound: BookHeadingPatternSummary[];
  selectedHeadingStrategy: BookHeadingPatternSummary | null;
  rejectedHeadingStrategies: RejectedBookHeadingStrategy[];
  selectedBodyHeadings: BookHeadingCandidate[];
  estimatedSectionCount: number;
  fallbackRequired: boolean;
  fallbackReason: string | null;
  fallbackLegitimacy: FallbackLegitimacy;
  likelyTocHeadingsDetected: boolean;
  likelyBodyHeadingsDetected: boolean;
  examplesOfDetectedBodyHeadings: string[];
  examplesOfRejectedTocLikeHeadings: string[];
  sectionSizeSanityNotes: BookSectionSizeNotes | null;
  redFlags: string[];
  strategiesSearched: string[];
};

type TextLine = {
  lineNumber: number;
  offset: number;
  text: string;
  trimmed: string;
};

type PatternDefinition = {
  id: string;
  label: string;
  convention: string;
  kind: BookHeadingKind;
  expression: RegExp;
  ordinalGroup?: number;
  titleGroup?: number;
};

type SectionBoundary = {
  offset: number;
  kind: BookSectionKind;
  label: string;
  title: string | null;
  confidence: StructureConfidenceLevel;
  source: "structure" | "structure-opening" | "fallback";
};

const HIGH_WORD_COUNT = 12_000;
const HUGE_SECTION_WORDS = 18_000;
const TINY_SECTION_WORDS = 80;
const MAX_FALLBACK_SECTION_CHARS = 30_000;

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
const TOC_HEADING_PATTERN = /^(?:contents|table of contents|chapters?|illustrations)$/i;
const PAGE_LEADER_PATTERN = /(?:\.{2,}|_{2,}|\s{3,})\s*(?:[ivxlcdm]+|\d{1,4})\s*$/i;
const PROSE_PUNCTUATION_PATTERN = /[.!?;:,]/;
const LOWERCASE_PATTERN = /[a-z]/;
const UPPERCASE_LETTER_PATTERN = /[A-Z]/;

export function analyzeBookStructure(
  inputText: string,
  options: { rawWordCount?: number } = {},
): BookStructureAnalysis {
  const text = trimBookText(inputText);
  const rawWordCount = options.rawWordCount ?? countBookWords(text);
  const lines = buildLines(text);
  const candidates = annotateCandidates(
    lines,
    collectRawCandidates(lines, Math.max(1, text.length)),
  );
  const patternSummaries = summarizePatterns(text, candidates, rawWordCount);
  const selected = chooseSelectedStrategy(patternSummaries);
  const selectedWithFlag = patternSummaries.map((summary) => ({
    ...summary,
    selected: selected?.patternId === summary.patternId,
    rejectionReason:
      selected?.patternId === summary.patternId ? null : rejectionReason(summary, selected),
  }));
  const selectedSummary = selectedWithFlag.find((summary) => summary.selected) ?? null;
  const selectedBodyHeadings = selectedSummary
    ? candidates
        .filter(
          (candidate) =>
            candidate.patternId === selectedSummary.patternId && candidate.isBodyLike,
        )
        .sort((left, right) => left.offset - right.offset)
    : [];
  const fallbackRequired = selectedSummary === null;
  const fallbackReason = fallbackRequired
    ? candidates.length > 0
      ? "candidate headings were present, but none had enough body-heading evidence"
      : "no plausible chapter, section, story, play, date, letter, or titled-section headings were detected"
    : null;
  const fallbackLegitimacy =
    fallbackRequired && rawWordCount < 6_000 && candidates.length <= 2
      ? "legitimate"
      : fallbackRequired
        ? "suspicious"
        : "not required";
  const likelyToc = selectedWithFlag.some((summary) => summary.tocLikeCount > 0);
  const likelyBody = selectedWithFlag.some((summary) => summary.bodyLikeCount > 0);
  const sectionNotes = selectedSummary?.sectionSizeNotes ?? null;
  const redFlags: string[] = [];

  if (rawWordCount < 25) redFlags.push("blocked: source has almost no readable text");
  if (!selectedSummary) {
    redFlags.push(
      "no reliable chapters, sections, story headings, or structural headings detected",
    );
  }
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
    (!selectedSummary ||
      selectedSummary.confidence === "low" ||
      selectedSummary.tocLikeCount > selectedSummary.bodyLikeCount)
  ) {
    redFlags.push("TOC/body confusion is likely");
  }
  if (
    selectedSummary &&
    selectedWithFlag.some((summary) => isMeaningfulCompetingStrategy(summary, selectedSummary))
  ) {
    redFlags.push("body headings were found but rejected by the selected strategy");
  }

  return {
    detectedStructuralConvention: detectedConvention(selectedSummary, selectedWithFlag),
    confidenceScore: Number((selectedSummary?.score ?? 0).toFixed(3)),
    confidenceLevel: selectedSummary?.confidence ?? (rawWordCount < 25 ? "blocked" : "low"),
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
    selectedBodyHeadings,
    estimatedSectionCount: selectedSummary?.bodyLikeCount ?? 0,
    fallbackRequired,
    fallbackReason,
    fallbackLegitimacy,
    likelyTocHeadingsDetected: likelyToc,
    likelyBodyHeadingsDetected: likelyBody,
    examplesOfDetectedBodyHeadings: prioritizedExamples(
      selectedSummary,
      selectedWithFlag,
      "bodyExamples",
    ),
    examplesOfRejectedTocLikeHeadings: prioritizedExamples(
      selectedSummary,
      selectedWithFlag,
      "tocExamples",
    ),
    sectionSizeSanityNotes: sectionNotes,
    redFlags,
    strategiesSearched: PATTERNS.map((pattern) => pattern.id).concat([
      "all-caps-title",
      "isolated-title-case",
    ]),
  };
}

export function buildDetectedSectionsFromStructure(
  inputText: string,
  analysis: BookStructureAnalysis,
  metadata: BookMetadata,
): { sections: DetectedBookSection[]; warnings: string[] } {
  const text = trimBookText(inputText);
  const warnings = [...analysis.redFlags];
  const counters = new Map<BookSectionKind, number>();

  if (analysis.fallbackRequired) {
    warnings.push(
      `Structure fallback used: ${analysis.fallbackReason ?? "no selected heading strategy"}.`,
    );
    if (analysis.fallbackLegitimacy === "suspicious") {
      warnings.push("Fallback is suspicious and must be manually reviewed before writing.");
    }
    return {
      sections: chunkFallbackSections(text, metadata, counters),
      warnings,
    };
  }

  const boundaries = buildStructureBoundaries(text, analysis);
  const sections: DetectedBookSection[] = [];
  boundaries.forEach((boundary, index) => {
    const endOffset = boundaries[index + 1]?.offset ?? text.length;
    const section = buildSection(
      text,
      boundary,
      endOffset,
      sections.length + 1,
      counters,
      metadata,
    );
    if (section) sections.push(section);
  });

  return { sections, warnings };
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

function headingSignature(candidate: BookHeadingCandidate): string {
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

function collectRawCandidates(lines: TextLine[], textLength: number): BookHeadingCandidate[] {
  const candidates: BookHeadingCandidate[] = [];
  lines.forEach((line, index) => {
    const normalized = line.trimmed;
    if (!normalized || normalized.length > 150 || isSourceNoise(normalized)) return;

    for (const pattern of PATTERNS) {
      pattern.expression.lastIndex = 0;
      const match = pattern.expression.exec(normalized);
      if (!match) continue;
      const ordinalRaw = pattern.ordinalGroup ? (match[pattern.ordinalGroup] ?? null) : null;
      const title = pattern.titleGroup ? (match[pattern.titleGroup]?.trim() || null) : null;
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
        title,
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
        title: normalized,
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
          title: normalized,
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

function annotateCandidates(
  lines: TextLine[],
  candidates: BookHeadingCandidate[],
): BookHeadingCandidate[] {
  const tocRanges = explicitTocRanges(lines);
  const bySignature = new Map<string, BookHeadingCandidate[]>();
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
  candidates: BookHeadingCandidate[],
): BookSectionSizeNotes | null {
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

function sequentialScore(candidates: BookHeadingCandidate[]): number {
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

function confidenceFromScore(score: number): StructureConfidenceLevel {
  if (score >= 0.78) return "high";
  if (score >= 0.55) return "medium";
  if (score >= 0.28) return "low";
  return "blocked";
}

function scorePattern(
  text: string,
  patternId: string,
  candidates: BookHeadingCandidate[],
  allCandidatesForBook: BookHeadingCandidate[],
  rawWordCount: number,
): BookHeadingPatternSummary {
  const first = candidates[0];
  if (!first) throw new Error(`Cannot score empty candidate group: ${patternId}`);
  const bodyCandidates = candidates
    .filter((candidate) => candidate.isBodyLike)
    .sort((left, right) => left.offset - right.offset);
  const tocCandidates = candidates.filter((candidate) => candidate.isTocLike);
  const sizeNotes = sectionSizeNotes(text, bodyCandidates);
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
  candidates: BookHeadingCandidate[],
  rawWordCount: number,
): BookHeadingPatternSummary[] {
  const byPattern = new Map<string, BookHeadingCandidate[]>();
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

function chooseSelectedStrategy(
  summaries: BookHeadingPatternSummary[],
): BookHeadingPatternSummary | null {
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

function rejectionReason(
  summary: BookHeadingPatternSummary,
  selected: BookHeadingPatternSummary | null,
): string {
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

function detectedConvention(
  selected: BookHeadingPatternSummary | null,
  summaries: BookHeadingPatternSummary[],
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
  summary: BookHeadingPatternSummary,
  selected: BookHeadingPatternSummary,
): boolean {
  if (summary.selected) return false;
  if (["all-caps-title", "isolated-title-case", "special-front-back"].includes(summary.patternId)) {
    return false;
  }
  if (summary.kind === selected.kind) return false;
  return summary.bodyLikeCount >= 3 && summary.score >= selected.score * 0.85;
}

function examplesFromSummaries(
  summaries: BookHeadingPatternSummary[],
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
  selected: BookHeadingPatternSummary | null,
  summaries: BookHeadingPatternSummary[],
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

function buildStructureBoundaries(
  text: string,
  analysis: BookStructureAnalysis,
): SectionBoundary[] {
  const selectedPatternId = analysis.selectedHeadingStrategy?.patternId;
  const boundaries = new Map<number, SectionBoundary>();

  const addCandidate = (candidate: BookHeadingCandidate) => {
    const boundary = boundaryForCandidate(candidate);
    boundaries.set(boundary.offset, boundary);
  };

  for (const candidate of analysis.selectedBodyHeadings) addCandidate(candidate);

  if (selectedPatternId) {
    const supportKinds = new Set<BookHeadingKind>([
      "front-back-matter",
      "book",
      "part",
      "volume",
    ]);
    const supportPatternIds = new Set(
      analysis.allCandidateHeadingPatternsFound
        .filter((summary) => supportKinds.has(summary.kind) && summary.bodyLikeCount > 0)
        .map((summary) => summary.patternId),
    );
    for (const summary of analysis.allCandidateHeadingPatternsFound) {
      if (!supportPatternIds.has(summary.patternId) || summary.patternId === selectedPatternId) {
        continue;
      }
      for (const example of summary.bodyExamples) {
        const lineNumber = Number(example.match(/^L(\d+):/)?.[1] ?? 0);
        const candidate = findCandidateByLineAndPattern(
          analysis,
          lineNumber,
          summary.patternId,
        );
        if (candidate) addCandidate(candidate);
      }
    }
  }

  const sorted = [...boundaries.values()].sort((left, right) => left.offset - right.offset);
  const firstOffset = sorted[0]?.offset ?? 0;
  if (firstOffset > 0 && countBookWords(text.slice(0, firstOffset)) > 25) {
    sorted.unshift({
      offset: 0,
      kind: "title-page",
      label: "Opening section",
      title: null,
      confidence: "medium",
      source: "structure-opening",
    });
  }
  return sorted;
}

function findCandidateByLineAndPattern(
  analysis: BookStructureAnalysis,
  lineNumber: number,
  patternId: string,
): BookHeadingCandidate | null {
  if (!lineNumber) return null;
  if (analysis.selectedHeadingStrategy?.patternId === patternId) {
    return (
      analysis.selectedBodyHeadings.find((candidate) => candidate.lineNumber === lineNumber) ?? null
    );
  }
  return null;
}

function boundaryForCandidate(candidate: BookHeadingCandidate): SectionBoundary {
  return {
    offset: candidate.offset,
    kind: sectionKindForCandidate(candidate),
    label: labelForCandidate(candidate),
    title: candidate.title,
    confidence: candidate.patternId === "isolated-title-case" ? "medium" : "high",
    source: "structure",
  };
}

function sectionKindForCandidate(candidate: BookHeadingCandidate): BookSectionKind {
  if (candidate.kind === "book" || candidate.kind === "volume") return "book";
  if (candidate.kind === "part" || candidate.kind === "act") return "part";
  if (candidate.kind === "scene") return "scene";
  if (candidate.kind === "stave" || candidate.kind === "canto" || candidate.kind === "poem") return "poem";
  if (candidate.kind === "letter" || candidate.kind === "date-entry") return "letter";
  if (candidate.kind === "front-back-matter") return specialHeadingKind(candidate.normalized);
  return "chapter";
}

function specialHeadingKind(normalized: string): BookSectionKind {
  if (/^preface$/i.test(normalized)) return "preface";
  if (/^(?:introduction|foreword)$/i.test(normalized)) return "introduction";
  if (/^prologue$/i.test(normalized)) return "prologue";
  if (/^epilogue$/i.test(normalized)) return "epilogue";
  if (/^appendix\b/i.test(normalized)) return "appendix";
  if (/^notes?$/i.test(normalized)) return "notes";
  if (/^transcriber/i.test(normalized)) return "transcriber-note";
  if (/^(?:contents|table of contents)$/i.test(normalized)) return "title-page";
  return "unknown";
}

function labelForCandidate(candidate: BookHeadingCandidate): string {
  const ordinal = candidate.ordinal;
  const kindName = candidate.kind === "volume" ? "Volume" : titleCase(candidate.kind.replace(/-.*/, ""));
  if (candidate.kind === "front-back-matter") return titleCase(candidate.normalized);
  if (candidate.kind === "story-title" || candidate.kind === "titled-section") {
    return titleCase(candidate.normalized);
  }
  if (candidate.kind === "section") {
    return ordinal ? `Section ${ordinal}` : titleCase(candidate.normalized);
  }
  if (candidate.kind === "date-entry") return candidate.normalized;
  if (ordinal) return `${kindName} ${ordinal}`;
  return titleCase(candidate.normalized);
}

function titleCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function includeByDefault(kind: BookSectionKind, metadata: BookMetadata): boolean {
  if (metadata.defaults.excludeKinds.includes(kind)) return false;
  if (metadata.defaults.includeKinds.length === 0) return true;
  return metadata.defaults.includeKinds.includes(kind);
}

function sectionIdFor(kind: BookSectionKind, counters: Map<BookSectionKind, number>): string {
  const next = (counters.get(kind) ?? 0) + 1;
  counters.set(kind, next);
  return `${kind}-${String(next).padStart(3, "0")}`;
}

function buildSection(
  text: string,
  boundary: SectionBoundary,
  endOffset: number,
  order: number,
  counters: Map<BookSectionKind, number>,
  metadata: BookMetadata,
): DetectedBookSection | null {
  const rawText = text.slice(boundary.offset, endOffset);
  const sectionText = trimBookText(rawText);
  if (!sectionText) return null;

  return {
    id: sectionIdFor(boundary.kind, counters),
    kind: boundary.kind,
    label: boundary.label,
    title: boundary.title,
    order,
    includeByDefault: includeByDefault(boundary.kind, metadata),
    sourceStartOffset: boundary.offset,
    sourceEndOffset: endOffset,
    characterCount: sectionText.length,
    wordCount: countBookWords(sectionText),
    morseCharacterEstimate: estimateMorseCharacters(sectionText),
    textPreview: textPreview(sectionText),
    text: sectionText,
  };
}

function chunkFallbackSections(
  text: string,
  metadata: BookMetadata,
  counters: Map<BookSectionKind, number>,
): DetectedBookSection[] {
  const sections: DetectedBookSection[] = [];
  let start = 0;
  let order = 1;

  while (start < text.length) {
    const desiredEnd = Math.min(text.length, start + MAX_FALLBACK_SECTION_CHARS);
    const paragraphBreak = text.lastIndexOf("\n\n", desiredEnd);
    const end =
      paragraphBreak > start + 1_000 && paragraphBreak < text.length
        ? paragraphBreak
        : desiredEnd;

    const section = buildSection(
      text,
      {
        offset: start,
        kind: "part",
        label: `Part ${order}`,
        title: null,
        confidence: "low",
        source: "fallback",
      },
      end,
      order,
      counters,
      metadata,
    );
    if (section) {
      sections.push({ ...section, id: `part-${String(order).padStart(3, "0")}` });
    }

    start = end;
    while (text[start] === "\n") start += 1;
    order += 1;
  }

  return sections;
}
