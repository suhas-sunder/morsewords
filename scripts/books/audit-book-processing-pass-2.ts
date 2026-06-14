import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type RiskLevel = "low" | "medium" | "high" | "blocked";
type BoundaryConfidence = "high" | "medium" | "low" | "blocked";
type GeneratedIssueType =
  | "starts too early"
  | "starts too late"
  | "real opening content missing"
  | "generated intro contains real chapter content"
  | "ends too early"
  | "footer/license included"
  | "generated output corrupted or too short";

type TextLine = {
  lineNumber: number;
  offset: number;
  text: string;
};

type CountWithSamples = {
  count: number;
  samples: string[];
};

type RangeSummary = {
  type: string;
  startLine: number;
  endLine: number;
  startIndex: number;
  endIndex: number;
  wordCount: number;
  snippet: string;
  reason: string;
};

type GeneratedComparison = {
  existingGeneratedOutputExists: boolean;
  generatedSlug: string | null;
  sectionCount: number;
  includedSectionCount: number;
  appearsToStartTooEarly: boolean;
  appearsToStartTooLate: boolean;
  appearsToEndTooEarly: boolean;
  appearsToIncludeFooterOrLicenseJunk: boolean;
  reasons: string[];
};

type Pass1Book = {
  sourceFilename: string;
  sourcePath: string;
  guessedSlug: string;
  guessedTitle: string;
  isTextSource: boolean;
  existingGeneratedOutputExists: boolean;
  approximateRawWordCount: number;
  candidateRealBookStartLine: number | null;
  candidateRealBookStartIndex: number | null;
  candidateRealBookStartHeadingOrSnippet: string;
  candidateRealBookEndLine: number | null;
  candidateRealBookEndIndex: number | null;
  candidateRealBookEndHeadingOrSnippet: string;
  startBoundaryConfidence: BoundaryConfidence;
  endBoundaryConfidence: BoundaryConfidence;
  detectedFrontMatterRanges: RangeSummary[];
  detectedTableOfContentsRanges: RangeSummary[];
  detectedLicenseFooterSourceRanges: RangeSummary[];
  detectedTranscriberEditorNotes: RangeSummary[];
  detectedFootnoteReferenceSections: RangeSummary[];
  detectedIllustrationImagePlaceholders: CountWithSamples;
  detectedRepeatedBracketReferences: {
    totalCount: number;
    uniqueReferences: number[];
    samples: string[];
  };
  detectedDecorativeSeparatorsOrPageMarkers: CountWithSamples;
  detectedWeirdOcrCopyPasteArtifacts: Record<string, CountWithSamples>;
  detectedChapterNumberingWarnings: string[];
  generatedComparison: GeneratedComparison;
  firstHourPreviewCanBeSafelyDerivedLater: boolean;
  riskClassification: RiskLevel;
  riskReasons: string[];
  recommendedNextAction: string;
};

type Pass1Report = {
  schemaVersion: 1;
  auditName: "book-processing-audit-pass-1";
  generatedAt: string;
  totals: {
    sourceBooksFound: number;
    textSourcesFound: number;
    nonTextSourcesFound: number;
    generatedBookManifestsFound: number;
  };
  riskCounts: Record<RiskLevel, number>;
  books: Pass1Book[];
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
  stats?: {
    originalCharacterCount?: number;
    cleanedCharacterCount?: number;
    wordCount?: number;
    sectionCount?: number;
    includedSectionCount?: number;
  };
  sections?: GeneratedSectionManifest[];
};

type BoundaryContext = {
  line: number | null;
  index: number | null;
  confidence: BoundaryConfidence;
  candidateSnippet: string;
  linesBefore: string[];
  linesAfter: string[];
};

type GeneratedWarningInspection = {
  slug: string;
  title: string;
  sourceFile: string;
  sourcePath: string;
  generatedManifestPath: string | null;
  pass1Reasons: string[];
  issueTypes: GeneratedIssueType[];
  confidence: BoundaryConfidence;
  evidence: string[];
  recommendedFixLater: string;
  includeInPilotBatch: boolean;
};

type Pass2Book = {
  sourceFilename: string;
  sourcePath: string;
  slug: string;
  title: string;
  existingGeneratedOutputExists: boolean;
  approximateRawWordCount: number;
  pass1Risk: RiskLevel;
  pass2Risk: RiskLevel;
  riskChange: "unchanged" | "lowered" | "raised";
  riskChangeReason: string;
  pass1RiskReasons: string[];
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
  generatedOutputWarning: GeneratedWarningInspection | null;
  highRiskDrivers: string[];
  firstHourPreviewCanBeSafelyDerivedLater: boolean;
  recommendedNextAction: string;
};

type PilotBook = {
  slug: string;
  title: string;
  sourceFilename: string;
  sourcePath: string;
  riskLevel: RiskLevel;
  whySelected: string;
  expectedBoundaryChallenge: string;
  expectedCleanupChallenge: string;
  manualReviewAfterProcessing: string;
};

type Pass2Report = {
  schemaVersion: 1;
  auditName: "book-processing-audit-pass-2";
  generatedAt: string;
  inputReports: {
    pass1Json: string;
    pass1Markdown: string;
  };
  paths: {
    tempBooks: string;
    generatedBooks: string;
    cloudflareExport: string;
    auditReports: string;
  };
  totals: {
    sourceBooksFound: number;
    textSourcesFound: number;
    nonTextSourcesFound: number;
    generatedBookManifestsFound: number;
    generatedOutputWarningsInspected: number;
  };
  pass1RiskCounts: Record<RiskLevel, number>;
  pass2RiskCounts: Record<RiskLevel, number>;
  riskChanges: Array<{
    from: RiskLevel;
    to: RiskLevel;
    count: number;
    examples: string[];
  }>;
  blockedBooks: Array<{ slug: string; title: string; sourcePath: string; reasons: string[] }>;
  highRiskBooksNeedingManualReview: Array<{
    slug: string;
    title: string;
    sourcePath: string;
    drivers: string[];
    reasons: string[];
  }>;
  generatedOutputWarningInspections: GeneratedWarningInspection[];
  generatedOutputWarningSummary: Array<{
    issueType: GeneratedIssueType;
    count: number;
    examples: string[];
  }>;
  topCleanupArtifacts: Array<{ category: string; count: number; examples: string[] }>;
  recommendedPilotBatch: PilotBook[];
  lowRiskBooksSafeForLaterLargerBatches: Array<{
    slug: string;
    title: string;
    sourcePath: string;
  }>;
  booksThatShouldNotBeProcessedYet: Array<{
    slug: string;
    title: string;
    sourcePath: string;
    reasons: string[];
  }>;
  confirmations: {
    tempBooksModified: false;
    generatedOutputsModified: false;
    cloudflareExportModified: false;
  };
  books: Pass2Book[];
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
const PASS_1_JSON_PATH = path.join(
  AUDIT_REPORT_ROOT,
  "book-processing-audit-pass-1.json",
);
const PASS_1_MARKDOWN_PATH = path.join(
  AUDIT_REPORT_ROOT,
  "book-processing-audit-pass-1.md",
);
const PASS_2_JSON_PATH = path.join(
  AUDIT_REPORT_ROOT,
  "book-processing-audit-pass-2.json",
);
const PASS_2_MARKDOWN_PATH = path.join(
  AUDIT_REPORT_ROOT,
  "book-processing-audit-pass-2.md",
);

const RISK_ORDER: Record<RiskLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
  blocked: 4,
};
const REAL_OPENING_MARKER =
  /^\s*(?:preface|introduction|prologue|foreword|dedication|epigraph|author'?s note|translator'?s note|editor'?s note|chapter|book|part|volume|stave|canto)\b/i;
const REAL_ENDING_MARKER =
  /^\s*(?:epilogue|afterword|appendix|postscript|conclusion|chapter|book|part|volume|endnotes?|notes?)\b/i;
const SOURCE_OR_LICENSE_LINE =
  /project gutenberg|gutenberg-tm|gutenberg license|full license|terms of use|copyright laws|the foundation|www\.gutenberg|pglaf|ebook|e-book|electronic works?|produced by|distributed proofreading|release date|language:|credits:|start of (?:the|this) project gutenberg|end of (?:the|this) project gutenberg|creating the works from print editions|no royalty payments|volunteers and employees|donations|limited right of replacement|refund|comply with the terms|specific permission/i;
const TITLE_OR_SOURCE_NOISE =
  /^(?:title:|author:|language:|release date|credits:|contents|table of contents|copyright|all rights reserved|published by|publisher|press|illustrated by|transcriber'?s note|produced by)\b/i;
const JUNKY_START_TEXT =
  /project gutenberg|produced by|distributed proofreading|table of contents|contents\b|\[(?:illustration|image|plate|map)[^\]]*\]|gutenberg license|transcriber|release date|language:|credits:/i;
const JUNKY_END_TEXT =
  /project gutenberg|gutenberg-tm|gutenberg license|end of (?:the )?project gutenberg|transcriber'?s note|distributed proofreading|produced by|end of this project gutenberg|creating the works from print editions|no royalty payments|volunteers and employees|pglaf/i;
const PLAY_OR_SCRIPT_MARKER =
  /^\s*(?:dramatis personae|persons represented|act\s+(?:[ivxlcdm]+|\d+)|scene\s+(?:[ivxlcdm]+|\d+)|enter\s+[A-Z][A-Z ,.'-]+|exeunt)\b/i;
const VERSE_OR_MAJOR_DIVISION_MARKER =
  /^\s*(?:canto|book|part|volume)\s+(?:[ivxlcdm]+|\d+|one|two|three|four|five|six|seven|eight|nine|ten)\b/i;
const DECORATIVE_OR_PAGE_MARKER =
  /^\s*(?:[-_=*~.#:;'"`^+|\\/<>{}[\]().,!\u2013\u2014 ]{4,}|\[?Page\s+\d+\]?|\[Pg\.?\s*\d+\]|\[\d+\]|-\s*\d+\s*-)\s*$/i;

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

function normalizeText(input: string): string {
  return input.replace(/^\uFEFF/, "").replace(/\r\n|\r/g, "\n");
}

function countWords(input: string): number {
  return input.match(/[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)?/g)?.length ?? 0;
}

function textPreview(input: string, length = 220): string {
  const compact = input.replace(/\s+/g, " ").trim();
  if (compact.length <= length) return compact;
  return `${compact.slice(0, length - 1).trimEnd()}...`;
}

function escapeMarkdownCell(input: string): string {
  return input.replace(/\|/g, "\\|").replace(/\n/g, "<br>");
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

function lineRangeText(lines: TextLine[], startLineIndex: number, endLineIndex: number): string {
  return lines
    .slice(Math.max(0, startLineIndex), Math.min(lines.length, endLineIndex + 1))
    .map((line) => line.text)
    .join("\n");
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

function generatedManifestCount(): number {
  return findFiles(GENERATED_ROOT).filter(
    (filePath) => path.basename(filePath) === "manifest.json",
  ).length;
}

function formatLine(line: TextLine): string {
  return `L${line.lineNumber}: ${textPreview(line.text, 180)}`;
}

function contextLines(
  lines: TextLine[],
  startLineIndex: number,
  endLineIndex: number,
): string[] {
  if (lines.length === 0 || endLineIndex < startLineIndex) return [];
  return lines
    .slice(Math.max(0, startLineIndex), Math.min(lines.length, endLineIndex + 1))
    .map(formatLine);
}

function boundaryContext(
  lines: TextLine[],
  lineNumber: number | null,
  index: number | null,
  confidence: BoundaryConfidence,
  direction: "start" | "end",
): BoundaryContext {
  if (lineNumber === null || lines.length === 0) {
    return {
      line: lineNumber,
      index,
      confidence,
      candidateSnippet: "",
      linesBefore: [],
      linesAfter: [],
    };
  }

  const lineIndex = Math.max(0, Math.min(lines.length - 1, lineNumber - 1));
  const snippetStart = direction === "start" ? lineIndex : Math.max(0, lineIndex - 5);
  const snippetEnd = direction === "start" ? Math.min(lines.length - 1, lineIndex + 5) : lineIndex;
  return {
    line: lineNumber,
    index,
    confidence,
    candidateSnippet: textPreview(lineRangeText(lines, snippetStart, snippetEnd), 700),
    linesBefore: contextLines(lines, lineIndex - 20, lineIndex - 1),
    linesAfter: contextLines(lines, lineIndex + 1, lineIndex + 20),
  };
}

function isNoiseLine(line: string): boolean {
  const trimmed = line.trim();
  return (
    trimmed.length === 0 ||
    SOURCE_OR_LICENSE_LINE.test(trimmed) ||
    TITLE_OR_SOURCE_NOISE.test(trimmed) ||
    DECORATIVE_OR_PAGE_MARKER.test(trimmed)
  );
}

function isLikelySubstantialProse(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.length < 70) return false;
  if (!/[a-z]/.test(trimmed)) return false;
  if (SOURCE_OR_LICENSE_LINE.test(trimmed) || TITLE_OR_SOURCE_NOISE.test(trimmed)) return false;
  if (/^[A-Z0-9 .,'":;!?()_-]{20,}$/.test(trimmed)) return false;
  return /[.!?;:,]/.test(trimmed);
}

function lineNumberFromSample(sample: string): number | null {
  const match = sample.match(/^L(\d+):/);
  return match ? Number(match[1]) : null;
}

function samplesNearLine(samples: string[], lineNumber: number | null, distance = 20): boolean {
  if (lineNumber === null) return false;
  return samples.some((sample) => {
    const sampleLine = lineNumberFromSample(sample);
    return sampleLine !== null && Math.abs(sampleLine - lineNumber) <= distance;
  });
}

function pass1RangeOverlapsLine(ranges: RangeSummary[], lineNumber: number | null): boolean {
  if (lineNumber === null) return false;
  return ranges.some((range) => lineNumber >= range.startLine && lineNumber <= range.endLine);
}

function lineInPass1Ranges(ranges: RangeSummary[], lineNumber: number): boolean {
  return ranges.some((range) => lineNumber >= range.startLine && lineNumber <= range.endLine);
}

function pass1TocAppearsIsolated(book: Pass1Book): boolean {
  if (book.detectedTableOfContentsRanges.length === 0) return false;
  const startLine = book.candidateRealBookStartLine;
  return book.detectedTableOfContentsRanges.every(
    (range) => startLine !== null && range.endLine < startLine,
  );
}

function detectOpeningContentRisk(
  lines: TextLine[],
  startLine: number | null,
  ignoredRanges: RangeSummary[],
): string[] {
  if (startLine === null || lines.length === 0) return ["No candidate start line to verify."];
  const startIndex = Math.max(0, startLine - 1);
  const before = lines.slice(Math.max(0, startIndex - 20), startIndex);
  const signals = before
    .filter((line) => !lineInPass1Ranges(ignoredRanges, line.lineNumber))
    .filter((line) => !isNoiseLine(line.text))
    .filter((line) => REAL_OPENING_MARKER.test(line.text) || isLikelySubstantialProse(line.text))
    .slice(0, 4)
    .map(formatLine);

  const candidateWindow = lineRangeText(lines, startIndex, Math.min(lines.length - 1, startIndex + 5));
  if (JUNKY_START_TEXT.test(candidateWindow)) {
    signals.unshift("Candidate start window still contains source, TOC, illustration, or title-page noise.");
  }
  if (passageLooksLikeTitlePage(candidateWindow)) {
    signals.unshift("Candidate start window looks like title-page or publisher material rather than readable body text.");
  }
  return signals;
}

function detectEndingContentRisk(lines: TextLine[], endLine: number | null): string[] {
  if (endLine === null || lines.length === 0) return ["No candidate end line to verify."];
  const endIndex = Math.max(0, Math.min(lines.length - 1, endLine - 1));
  const after = lines.slice(endIndex + 1, Math.min(lines.length, endIndex + 21));
  const signals = after
    .filter((line) => !isNoiseLine(line.text))
    .filter((line) => REAL_ENDING_MARKER.test(line.text) || isLikelySubstantialProse(line.text))
    .slice(0, 4)
    .map(formatLine);

  const candidateWindow = lineRangeText(lines, Math.max(0, endIndex - 5), endIndex);
  if (JUNKY_END_TEXT.test(candidateWindow)) {
    signals.unshift("Candidate end window appears to include source/footer/license material.");
  }
  return signals;
}

function passageLooksLikeTitlePage(input: string): boolean {
  const compact = input.replace(/\s+/g, " ").trim();
  return (
    /(?:charles scribner|boni and liveright|l\. frank baum author|by\s+[A-Z][A-Za-z .'-]{3,40}\s*$|illustrated by|published by|copyright)/i.test(
      compact,
    ) ||
    /^[A-Z0-9 .'":;!?_-]{40,}$/.test(compact.slice(0, 180))
  );
}

function countPattern(lines: TextLine[], pattern: RegExp): CountWithSamples {
  let count = 0;
  const samples: string[] = [];
  for (const line of lines) {
    pattern.lastIndex = 0;
    if (!pattern.test(line.text)) continue;
    count += 1;
    if (samples.length < 8) samples.push(formatLine(line));
  }
  return { count, samples };
}

function collectNonstandardStructureSignals(lines: TextLine[]): string[] {
  const playMarkers = countPattern(lines, PLAY_OR_SCRIPT_MARKER);
  const verseMarkers = countPattern(lines, VERSE_OR_MAJOR_DIVISION_MARKER);
  const signals: string[] = [];
  if (playMarkers.count >= 3) {
    signals.push(`play-or-script-format (${playMarkers.count} markers)`);
  }
  if (verseMarkers.count >= 12) {
    signals.push(`many-major-division-or-verse-markers (${verseMarkers.count} markers)`);
  }
  return signals;
}

function severeUnicodeCount(book: Pass1Book): number {
  return Object.entries(book.detectedWeirdOcrCopyPasteArtifacts).reduce(
    (total, [key, value]) => total + (key === "emOrEnDashes" ? 0 : value.count),
    0,
  );
}

function dashCount(book: Pass1Book): number {
  return book.detectedWeirdOcrCopyPasteArtifacts.emOrEnDashes?.count ?? 0;
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

function readGeneratedSectionText(root: string, sectionPath: string): string {
  const parsed = readJsonIfExists<{
    displayText?: string;
    morseSourceText?: string;
    textPreview?: string;
  }>(path.join(root, sectionPath));
  return parsed?.displayText ?? parsed?.morseSourceText ?? parsed?.textPreview ?? "";
}

function generatedSectionText(root: string, section: GeneratedSectionManifest | undefined): string {
  if (!section) return "";
  const fullText = readGeneratedSectionText(root, section.sectionJsonPath);
  return `${section.label} ${section.title ?? ""} ${section.textPreview ?? ""}\n${fullText}`;
}

function inspectGeneratedWarning(
  book: Pass1Book,
  rawCandidateCharacterCount: number,
): GeneratedWarningInspection | null {
  if (book.generatedComparison.reasons.length === 0) return null;

  const generated = readGeneratedManifest(book.guessedSlug);
  const issueTypes = new Set<GeneratedIssueType>();
  const evidence: string[] = [];

  if (!generated.manifest || !generated.root || !generated.manifestPath) {
    issueTypes.add("generated output corrupted or too short");
    evidence.push("Pass 1 reported a generated-output warning, but no generated manifest was found by slug.");
    return {
      slug: book.guessedSlug,
      title: book.guessedTitle,
      sourceFile: book.sourceFilename,
      sourcePath: book.sourcePath,
      generatedManifestPath: null,
      pass1Reasons: book.generatedComparison.reasons,
      issueTypes: [...issueTypes],
      confidence: "high",
      evidence,
      recommendedFixLater: "Manually locate or regenerate the missing manifest before processing this source.",
      includeInPilotBatch: false,
    };
  }

  const manifest = generated.manifest;
  const sections = manifest.sections ?? [];
  const firstSection = sections[0];
  const firstIncluded = sections.find((section) => section.includeByDefault);
  const firstPlayable = firstIncluded ?? firstSection;
  const lastSection = sections.at(-1);
  const firstText = generatedSectionText(generated.root, firstPlayable).slice(0, 2800);
  const firstRawSectionText = generatedSectionText(generated.root, firstSection).slice(0, 2800);
  const lastText = generatedSectionText(generated.root, lastSection).slice(-2800);
  const includedCount = sections.filter((section) => section.includeByDefault).length;
  const cleanedCharacters = manifest.stats?.cleanedCharacterCount ?? 0;

  if (JUNKY_START_TEXT.test(firstText) || passageLooksLikeTitlePage(firstText)) {
    issueTypes.add("starts too early");
    evidence.push(`First generated/playable section begins with: ${textPreview(firstText, 260)}`);
  }

  const earlyExcludedSections = firstIncluded
    ? sections.slice(0, Math.max(0, sections.indexOf(firstIncluded))).filter((section) => !section.includeByDefault)
    : [];
  const excludedRealOpening = earlyExcludedSections.find((section) =>
    /preface|prologue|introduction|foreword|dedication|chapter|stave|part|book/i.test(
      `${section.label} ${section.title ?? ""} ${section.textPreview ?? ""}`,
    ),
  );
  if (book.generatedComparison.appearsToStartTooLate || excludedRealOpening) {
    issueTypes.add("real opening content missing");
    issueTypes.add("starts too late");
    evidence.push(
      excludedRealOpening
        ? `A plausible opening section is not included by default: ${excludedRealOpening.label} ${excludedRealOpening.title ?? ""} ${textPreview(excludedRealOpening.textPreview ?? "", 180)}`
        : "Pass 1 detected legitimate opening material skipped by generated defaults.",
    );
  }

  if (
    firstSection &&
    !firstSection.includeByDefault &&
    /preface|prologue|introduction|chapter|stave|part|book/i.test(firstRawSectionText)
  ) {
    issueTypes.add("generated intro contains real chapter content");
    evidence.push(
      `The first generated section is excluded by default but appears readable: ${textPreview(firstRawSectionText, 240)}`,
    );
  }

  if (
    book.generatedComparison.appearsToEndTooEarly ||
    (rawCandidateCharacterCount > 0 &&
      cleanedCharacters > 0 &&
      cleanedCharacters < rawCandidateCharacterCount * 0.62)
  ) {
    issueTypes.add("ends too early");
    evidence.push(
      `Generated cleaned character count (${cleanedCharacters}) is much smaller than the audited candidate body window (${rawCandidateCharacterCount}).`,
    );
  }

  if (JUNKY_END_TEXT.test(lastText)) {
    issueTypes.add("footer/license included");
    evidence.push(`Final generated section contains footer/license indicators: ${textPreview(lastText, 240)}`);
  }

  if (sections.length === 0 || cleanedCharacters < 1000 || manifest.stats?.wordCount === 0) {
    issueTypes.add("generated output corrupted or too short");
    evidence.push("Generated manifest has no usable sections or an unexpectedly tiny cleaned text length.");
  }
  if (includedCount === 0 && sections.length > 0) {
    evidence.push("Generated manifest currently has zero default-included sections.");
  }
  if (issueTypes.size === 0) {
    issueTypes.add("generated output corrupted or too short");
    evidence.push("Pass 1 warning could not be reproduced cleanly, so this remains a generated-output review item.");
  }

  const issueList = [...issueTypes];
  const confidence: BoundaryConfidence =
    issueList.includes("footer/license included") ||
    issueList.includes("ends too early") ||
    issueList.includes("generated output corrupted or too short") ||
    issueList.length >= 2
      ? "high"
      : "medium";

  return {
    slug: book.guessedSlug,
    title: book.guessedTitle,
    sourceFile: book.sourceFilename,
    sourcePath: book.sourcePath,
    generatedManifestPath: relativeToRepo(generated.manifestPath),
    pass1Reasons: book.generatedComparison.reasons,
    issueTypes: issueList,
    confidence,
    evidence: evidence.slice(0, 5),
    recommendedFixLater: generatedFixRecommendation(issueList, includedCount),
    includeInPilotBatch: false,
  };
}

function generatedFixRecommendation(issueTypes: GeneratedIssueType[], includedCount: number): string {
  const recommendations: string[] = [];
  if (issueTypes.includes("starts too early")) {
    recommendations.push("tighten title-page, TOC, and source-boilerplate exclusion before readable sections");
  }
  if (
    issueTypes.includes("starts too late") ||
    issueTypes.includes("real opening content missing") ||
    issueTypes.includes("generated intro contains real chapter content")
  ) {
    recommendations.push("protect legitimate preface/introduction/prologue/opening chapter content");
  }
  if (issueTypes.includes("ends too early")) {
    recommendations.push("compare the processed tail against the audited end boundary before export");
  }
  if (issueTypes.includes("footer/license included")) {
    recommendations.push("strip Project Gutenberg/footer/license material from final readable sections");
  }
  if (includedCount === 0) {
    recommendations.push("restore sensible default included sections for audio/video export");
  }
  if (recommendations.length === 0) {
    recommendations.push("manually review generated section boundaries before rewriting");
  }
  return `Later fix: ${recommendations.join("; ")}.`;
}

function refineRisk(
  book: Pass1Book,
  lines: TextLine[],
  generatedWarning: GeneratedWarningInspection | null,
): {
  risk: RiskLevel;
  reasons: string[];
  protectedRealContentFlags: string[];
  highRiskDrivers: string[];
  firstHourPreviewCanBeSafelyDerivedLater: boolean;
} {
  const protectedRealContentFlags = [
    ...detectOpeningContentRisk(
      lines,
      book.candidateRealBookStartLine,
      book.detectedTableOfContentsRanges,
    ),
    ...detectEndingContentRisk(lines, book.candidateRealBookEndLine),
  ];
  const highRiskDrivers: string[] = [];
  const highReasons: string[] = [];
  const mediumReasons: string[] = [];
  const tocIsolated = pass1TocAppearsIsolated(book);
  const tocBleeds = pass1RangeOverlapsLine(
    book.detectedTableOfContentsRanges,
    book.candidateRealBookStartLine,
  );
  const structureSignals = collectNonstandardStructureSignals(lines);
  const decorativeNearBoundary =
    samplesNearLine(
      book.detectedDecorativeSeparatorsOrPageMarkers.samples,
      book.candidateRealBookStartLine,
    ) ||
    samplesNearLine(
      book.detectedDecorativeSeparatorsOrPageMarkers.samples,
      book.candidateRealBookEndLine,
    );
  const severeArtifacts = severeUnicodeCount(book);
  const bracketTotal = book.detectedRepeatedBracketReferences.totalCount;
  const bracketUnique = book.detectedRepeatedBracketReferences.uniqueReferences.length;
  const imageCount = book.detectedIllustrationImagePlaceholders.count;

  if (!book.isTextSource) {
    return {
      risk: "blocked",
      reasons: ["Source is not a text file and cannot be verified as a book."],
      protectedRealContentFlags,
      highRiskDrivers: ["source-blocked"],
      firstHourPreviewCanBeSafelyDerivedLater: false,
    };
  }
  if (book.approximateRawWordCount < 100) {
    return {
      risk: "blocked",
      reasons: ["Source has fewer than 100 words and no coherent book body."],
      protectedRealContentFlags,
      highRiskDrivers: ["source-blocked"],
      firstHourPreviewCanBeSafelyDerivedLater: false,
    };
  }
  if (
    book.candidateRealBookStartLine === null ||
    book.candidateRealBookEndLine === null ||
    book.candidateRealBookStartLine >= book.candidateRealBookEndLine
  ) {
    return {
      risk: "blocked",
      reasons: ["Pass 2 could not verify a coherent start/end body window."],
      protectedRealContentFlags,
      highRiskDrivers: ["boundary-uncertainty"],
      firstHourPreviewCanBeSafelyDerivedLater: false,
    };
  }

  if (protectedRealContentFlags.length > 0) {
    highRiskDrivers.push("real-content-boundary-risk");
    highReasons.push("Real opening or ending content may be at risk around the audited boundary.");
  }
  if (book.startBoundaryConfidence === "low" || book.endBoundaryConfidence === "low") {
    highRiskDrivers.push("boundary-uncertainty");
    highReasons.push("Start or end boundary still has low confidence after context inspection.");
  }
  if (tocBleeds) {
    highRiskDrivers.push("structural-complexity");
    highReasons.push("Detected table-of-contents range overlaps the candidate readable start.");
  }
  if (generatedWarning && generatedWarning.confidence !== "low") {
    highRiskDrivers.push("generated-output-warning");
    highReasons.push("Existing generated output needs boundary/default-section correction later.");
  }
  if (imageCount > 20) {
    highRiskDrivers.push("artifact-cleanup");
    highReasons.push("Many illustration/image placeholders need cleanup review.");
  }
  if (bracketUnique > 30 || bracketTotal > 80) {
    highRiskDrivers.push("artifact-cleanup");
    highReasons.push("Dense numbered bracket references indicate footnote-heavy or parser-junk risk.");
  }
  if (book.detectedFootnoteReferenceSections.length > 1) {
    highRiskDrivers.push("structural-complexity");
    highReasons.push("Multiple footnote/reference sections need manual section handling.");
  }
  if (book.detectedChapterNumberingWarnings.length > 0) {
    highRiskDrivers.push("structural-complexity");
    highReasons.push("Possible malformed or out-of-order chapter numbering.");
  }
  if (severeArtifacts > 120) {
    highRiskDrivers.push("artifact-cleanup");
    highReasons.push("Many severe unicode/OCR/copy-paste artifacts need cleanup rules.");
  }
  if (book.detectedDecorativeSeparatorsOrPageMarkers.count > 120 && decorativeNearBoundary) {
    highRiskDrivers.push("artifact-cleanup");
    highReasons.push("Many decorative/page markers appear close enough to boundaries to affect splitting.");
  }

  if (highReasons.length > 0) {
    return {
      risk: "high",
      reasons: [...new Set(highReasons)],
      protectedRealContentFlags,
      highRiskDrivers: [...new Set(highRiskDrivers)],
      firstHourPreviewCanBeSafelyDerivedLater: false,
    };
  }

  if (book.startBoundaryConfidence === "medium") {
    mediumReasons.push("Medium-confidence start boundary remains manageable but needs review.");
  }
  if (book.endBoundaryConfidence === "medium") {
    mediumReasons.push("Medium-confidence end boundary remains manageable but needs review.");
  }
  if (book.detectedTableOfContentsRanges.length > 0) {
    mediumReasons.push(
      tocIsolated
        ? "Table of contents appears isolated before readable content."
        : "Table of contents detected near readable content.",
    );
  }
  if (book.detectedTranscriberEditorNotes.length > 0) {
    mediumReasons.push("Transcriber/editor notes are present and should stay out of readable defaults.");
  }
  if (book.detectedFootnoteReferenceSections.length > 0) {
    mediumReasons.push("Footnote/reference section detected.");
  }
  if (imageCount > 0) {
    mediumReasons.push("Illustration/image placeholders should be cleaned or suppressed later.");
  }
  if (bracketUnique > 5 || bracketTotal > 15) {
    mediumReasons.push("Moderate numbered bracket references need cleanup review.");
  }
  if (book.detectedDecorativeSeparatorsOrPageMarkers.count > 15) {
    mediumReasons.push("Decorative/page markers are cleanup candidates but not boundary blockers.");
  }
  if (severeArtifacts > 0) {
    mediumReasons.push("Unicode/OCR/copy-paste artifacts are present.");
  }
  if (structureSignals.length > 0) {
    mediumReasons.push("Non-prose structure signals need section parsing review.");
  }

  if (mediumReasons.length > 0) {
    return {
      risk: "medium",
      reasons: [...new Set(mediumReasons)],
      protectedRealContentFlags,
      highRiskDrivers,
      firstHourPreviewCanBeSafelyDerivedLater:
        book.startBoundaryConfidence !== "low" &&
        book.endBoundaryConfidence !== "low" &&
        imageCount < 10 &&
        bracketTotal < 40,
    };
  }

  return {
    risk: "low",
    reasons: ["Pass 2 verified high-confidence boundaries with no structural or cleanup blockers."],
    protectedRealContentFlags,
    highRiskDrivers,
    firstHourPreviewCanBeSafelyDerivedLater: true,
  };
}

function riskChange(pass1: RiskLevel, pass2: RiskLevel): "unchanged" | "lowered" | "raised" {
  if (RISK_ORDER[pass2] === RISK_ORDER[pass1]) return "unchanged";
  return RISK_ORDER[pass2] < RISK_ORDER[pass1] ? "lowered" : "raised";
}

function riskAction(risk: RiskLevel): string {
  if (risk === "blocked") {
    return "Do not process until the source or boundary issue has been manually reviewed.";
  }
  if (risk === "high") {
    return "Review individually or in a near-individual batch before any rewrite.";
  }
  if (risk === "medium") {
    return "Process later in a small 5-10 book batch with explicit boundary and artifact checks.";
  }
  return "Candidate for a later larger low-risk batch after the pilot succeeds.";
}

function auditBook(book: Pass1Book): Pass2Book {
  const sourcePath = resolveRepoPath(book.sourcePath);
  const rawText =
    book.isTextSource && fs.existsSync(sourcePath)
      ? normalizeText(fs.readFileSync(sourcePath, "utf8"))
      : "";
  const lines = rawText ? buildLines(rawText) : [];
  const candidateStartIndex =
    book.candidateRealBookStartLine === null
      ? 0
      : Math.max(0, book.candidateRealBookStartLine - 1);
  const candidateEndIndex =
    book.candidateRealBookEndLine === null
      ? lines.length - 1
      : Math.max(0, Math.min(lines.length - 1, book.candidateRealBookEndLine - 1));
  const rawCandidateCharacterCount =
    lines.length > 0 && candidateEndIndex > candidateStartIndex
      ? Math.max(
          0,
          (lines[candidateEndIndex]?.offset ?? 0) -
            (lines[candidateStartIndex]?.offset ?? 0),
        )
      : 0;
  const generatedWarning = inspectGeneratedWarning(book, rawCandidateCharacterCount);
  const refined = refineRisk(book, lines, generatedWarning);
  const change = riskChange(book.riskClassification, refined.risk);
  const structureSignals = collectNonstandardStructureSignals(lines);
  const tocIsolated = pass1TocAppearsIsolated(book);
  const tocBleeds = pass1RangeOverlapsLine(
    book.detectedTableOfContentsRanges,
    book.candidateRealBookStartLine,
  );
  const decorativeNearBoundary =
    samplesNearLine(
      book.detectedDecorativeSeparatorsOrPageMarkers.samples,
      book.candidateRealBookStartLine,
    ) ||
    samplesNearLine(
      book.detectedDecorativeSeparatorsOrPageMarkers.samples,
      book.candidateRealBookEndLine,
    );

  return {
    sourceFilename: book.sourceFilename,
    sourcePath: book.sourcePath,
    slug: book.guessedSlug,
    title: book.guessedTitle,
    existingGeneratedOutputExists: book.existingGeneratedOutputExists,
    approximateRawWordCount: rawText ? countWords(rawText) : book.approximateRawWordCount,
    pass1Risk: book.riskClassification,
    pass2Risk: refined.risk,
    riskChange: change,
    riskChangeReason:
      change === "unchanged"
        ? "Pass 2 confirmed the pass-1 risk level with boundary-context evidence."
        : `Pass 2 ${change} risk after checking boundary context, cleanup artifacts, structure, and generated-output evidence.`,
    pass1RiskReasons: book.riskReasons,
    pass2RiskReasons: refined.reasons,
    candidateStart: boundaryContext(
      lines,
      book.candidateRealBookStartLine,
      book.candidateRealBookStartIndex,
      book.startBoundaryConfidence,
      "start",
    ),
    candidateEnd: boundaryContext(
      lines,
      book.candidateRealBookEndLine,
      book.candidateRealBookEndIndex,
      book.endBoundaryConfidence,
      "end",
    ),
    protectedRealContentFlags: refined.protectedRealContentFlags,
    cleanupArtifactSummary: {
      tableOfContentsRanges: book.detectedTableOfContentsRanges.length,
      tableOfContentsAppearsIsolated: tocIsolated,
      tableOfContentsBleedsIntoCandidate: tocBleeds,
      transcriberEditorNoteRanges: book.detectedTranscriberEditorNotes.length,
      footnoteReferenceRanges: book.detectedFootnoteReferenceSections.length,
      illustrationImagePlaceholders: book.detectedIllustrationImagePlaceholders.count,
      numberedBracketReferences: book.detectedRepeatedBracketReferences.totalCount,
      uniqueNumberedBracketReferences: book.detectedRepeatedBracketReferences.uniqueReferences.length,
      decorativePageMarkers: book.detectedDecorativeSeparatorsOrPageMarkers.count,
      decorativeMarkersNearBoundary: decorativeNearBoundary,
      dashNormalizationCandidates: dashCount(book),
      severeUnicodeOrOcrArtifacts: severeUnicodeCount(book),
      nonstandardStructureSignals: structureSignals,
    },
    generatedOutputWarning: generatedWarning,
    highRiskDrivers: refined.highRiskDrivers,
    firstHourPreviewCanBeSafelyDerivedLater: refined.firstHourPreviewCanBeSafelyDerivedLater,
    recommendedNextAction: riskAction(refined.risk),
  };
}

function countRisks(books: Array<{ pass2Risk?: RiskLevel; riskClassification?: RiskLevel }>): Record<RiskLevel, number> {
  const counts: Record<RiskLevel, number> = { low: 0, medium: 0, high: 0, blocked: 0 };
  for (const book of books) {
    const risk = book.pass2Risk ?? book.riskClassification;
    if (risk) counts[risk] += 1;
  }
  return counts;
}

function summarizeRiskChanges(books: Pass2Book[]): Pass2Report["riskChanges"] {
  const changes = new Map<string, { from: RiskLevel; to: RiskLevel; examples: string[]; count: number }>();
  for (const book of books) {
    if (book.pass1Risk === book.pass2Risk) continue;
    const key = `${book.pass1Risk}->${book.pass2Risk}`;
    const entry =
      changes.get(key) ??
      { from: book.pass1Risk, to: book.pass2Risk, examples: [], count: 0 };
    entry.count += 1;
    if (entry.examples.length < 8) entry.examples.push(book.slug);
    changes.set(key, entry);
  }
  return [...changes.values()].sort(
    (left, right) =>
      RISK_ORDER[left.from] - RISK_ORDER[right.from] ||
      RISK_ORDER[left.to] - RISK_ORDER[right.to],
  );
}

function addCategory(
  categories: Map<string, { count: number; examples: string[] }>,
  category: string,
  book: Pass2Book,
): void {
  const entry = categories.get(category) ?? { count: 0, examples: [] };
  entry.count += 1;
  if (entry.examples.length < 8) entry.examples.push(book.slug);
  categories.set(category, entry);
}

function summarizeCleanupArtifacts(books: Pass2Book[]): Pass2Report["topCleanupArtifacts"] {
  const categories = new Map<string, { count: number; examples: string[] }>();
  for (const book of books) {
    const artifacts = book.cleanupArtifactSummary;
    if (book.protectedRealContentFlags.length > 0) {
      addCategory(categories, "possible-real-content-boundary-risk", book);
    }
    if (artifacts.tableOfContentsRanges > 0) {
      addCategory(
        categories,
        artifacts.tableOfContentsBleedsIntoCandidate
          ? "toc-bleeds-into-candidate"
          : "isolated-table-of-contents",
        book,
      );
    }
    if (artifacts.illustrationImagePlaceholders > 0) {
      addCategory(categories, "illustration-image-placeholders", book);
    }
    if (artifacts.numberedBracketReferences > 0) {
      addCategory(categories, "numbered-bracket-references", book);
    }
    if (artifacts.decorativePageMarkers > 0) {
      addCategory(
        categories,
        artifacts.decorativeMarkersNearBoundary
          ? "decorative-markers-near-boundaries"
          : "decorative-page-markers",
        book,
      );
    }
    if (artifacts.dashNormalizationCandidates > 0) {
      addCategory(categories, "dash-normalization-candidates", book);
    }
    if (artifacts.severeUnicodeOrOcrArtifacts > 0) {
      addCategory(categories, "unicode-ocr-copy-paste-artifacts", book);
    }
    if (artifacts.nonstandardStructureSignals.length > 0) {
      addCategory(categories, "nonstandard-structure-signals", book);
    }
    if (book.generatedOutputWarning) {
      addCategory(categories, "generated-output-warning", book);
    }
  }
  return [...categories.entries()]
    .map(([category, value]) => ({ category, ...value }))
    .sort((left, right) => right.count - left.count || left.category.localeCompare(right.category));
}

function summarizeGeneratedWarnings(
  inspections: GeneratedWarningInspection[],
): Pass2Report["generatedOutputWarningSummary"] {
  const categories = new Map<GeneratedIssueType, { count: number; examples: string[] }>();
  for (const inspection of inspections) {
    for (const issueType of inspection.issueTypes) {
      const entry = categories.get(issueType) ?? { count: 0, examples: [] };
      entry.count += 1;
      if (entry.examples.length < 8) entry.examples.push(inspection.slug);
      categories.set(issueType, entry);
    }
  }
  return [...categories.entries()]
    .map(([issueType, value]) => ({ issueType, ...value }))
    .sort((left, right) => right.count - left.count || left.issueType.localeCompare(right.issueType));
}

function pilotBoundaryChallenge(book: Pass2Book): string {
  const warning = book.generatedOutputWarning;
  if (warning) return `Generated-output warning: ${warning.issueTypes.join(", ")}.`;
  if (book.candidateStart.confidence !== "high" || book.candidateEnd.confidence !== "high") {
    return `Verify ${book.candidateStart.confidence} start and ${book.candidateEnd.confidence} end boundaries.`;
  }
  if (book.cleanupArtifactSummary.tableOfContentsRanges > 0) {
    return "Confirm isolated TOC stays excluded from readable defaults.";
  }
  return "Confirm clean Gutenberg header/footer exclusion and first/last readable lines.";
}

function pilotCleanupChallenge(book: Pass2Book): string {
  const artifacts = book.cleanupArtifactSummary;
  const parts: string[] = [];
  if (artifacts.illustrationImagePlaceholders > 0) parts.push("image placeholders");
  if (artifacts.numberedBracketReferences > 0) parts.push("numbered references");
  if (artifacts.decorativePageMarkers > 0) parts.push("decorative/page markers");
  if (artifacts.dashNormalizationCandidates > 0) parts.push("dash normalization");
  if (artifacts.nonstandardStructureSignals.length > 0) parts.push("nonstandard structure");
  return parts.length ? `Review ${parts.join(", ")}.` : "No major cleanup challenge expected.";
}

function choosePilotBatch(books: Pass2Book[]): PilotBook[] {
  const selected: Pass2Book[] = [];
  const bySlug = new Map(books.map((book) => [book.slug, book]));
  const addSlug = (slug: string) => {
    const book = bySlug.get(slug);
    if (!book || book.pass2Risk === "blocked" || selected.includes(book)) return;
    selected.push(book);
  };

  [
    "almayer-s-folly-a-story-of-an-eastern-river",
    "the-house-without-a-key",
    "the-lerouge-case",
    "a-dream-of-armageddon",
    "a-journey-to-the-centre-of-the-earth",
    "a-journal-of-the-plague-year",
    "dracula",
    "a-christmas-carol",
    "dr-jekyll-and-mr-hyde",
    "a-catastrophe",
  ].forEach(addSlug);

  const warningCandidate = books.find(
    (book) => book.generatedOutputWarning && book.pass2Risk !== "blocked" && !selected.includes(book),
  );
  if (warningCandidate && !selected.some((book) => book.generatedOutputWarning)) {
    selected.push(warningCandidate);
  }

  const fillFromRisk = (risk: RiskLevel, limit: number) => {
    for (const book of books
      .filter((candidate) => candidate.pass2Risk === risk && !selected.includes(candidate))
      .sort((left, right) => left.slug.localeCompare(right.slug))) {
      if (selected.length >= limit) return;
      selected.push(book);
    }
  };
  fillFromRisk("low", 4);
  fillFromRisk("medium", 8);
  fillFromRisk("high", 10);

  return selected.slice(0, 10).map((book) => {
    const warning = book.generatedOutputWarning;
    if (warning) warning.includeInPilotBatch = true;
    return {
      slug: book.slug,
      title: book.title,
      sourceFilename: book.sourceFilename,
      sourcePath: book.sourcePath,
      riskLevel: book.pass2Risk,
      whySelected: warning
        ? "Exercises generated-output warning correction in the pilot without rewriting it during audit."
        : book.pass2Risk === "low"
          ? "Clear boundaries make it a control case for the first processor pilot."
          : book.pass2Risk === "medium"
            ? "Manageable artifacts make it useful for testing careful batch rules."
            : "Useful stress case for boundary review before broad processing.",
      expectedBoundaryChallenge: pilotBoundaryChallenge(book),
      expectedCleanupChallenge: pilotCleanupChallenge(book),
      manualReviewAfterProcessing:
        "Verify first readable line, final readable line, default section selection, source URL/metadata, and absence of source/license/TOC junk.",
    };
  });
}

function buildMarkdown(report: Pass2Report): string {
  const riskRows = (["low", "medium", "high", "blocked"] as const)
    .map((risk) => `| ${risk} | ${report.pass1RiskCounts[risk]} | ${report.pass2RiskCounts[risk]} |`)
    .join("\n");
  const changeRows =
    report.riskChanges.length === 0
      ? "| No changes | 0 |  |"
      : report.riskChanges
          .map(
            (change) =>
              `| ${change.from} -> ${change.to} | ${change.count} | ${change.examples.join(", ")} |`,
          )
          .join("\n");
  const cleanupRows = report.topCleanupArtifacts
    .slice(0, 15)
    .map(
      (entry) =>
        `| ${entry.category} | ${entry.count} | ${entry.examples.map(escapeMarkdownCell).join("<br>")} |`,
    )
    .join("\n");
  const generatedRows = report.generatedOutputWarningSummary
    .map(
      (entry) =>
        `| ${entry.issueType} | ${entry.count} | ${entry.examples.map(escapeMarkdownCell).join("<br>")} |`,
    )
    .join("\n");
  const listBooks = (
    books: Array<{ slug: string; title: string; sourcePath: string; reasons?: string[]; drivers?: string[] }>,
    limit?: number,
  ) => {
    const shown = typeof limit === "number" ? books.slice(0, limit) : books;
    if (shown.length === 0) return "- None.";
    const suffix =
      typeof limit === "number" && books.length > limit
        ? `\n- ...and ${books.length - limit} more in the JSON report.`
        : "";
    return `${shown
      .map((book) => {
        const details = [...(book.drivers ?? []), ...(book.reasons ?? [])].slice(0, 4);
        return `- ${book.slug} - ${book.title} (${book.sourcePath})${
          details.length ? `. ${details.join("; ")}` : "."
        }`;
      })
      .join("\n")}${suffix}`;
  };
  const pilotRows = report.recommendedPilotBatch
    .map(
      (book) =>
        `| ${book.slug} | ${escapeMarkdownCell(book.title)} | ${book.riskLevel} | ${escapeMarkdownCell(book.expectedBoundaryChallenge)} | ${escapeMarkdownCell(book.expectedCleanupChallenge)} |`,
    )
    .join("\n");

  return [
    "# Book Processing Audit Pass 2",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "This is a read-only deeper verification pass. It inspects the current source text, pass-1 findings, and existing generated manifests/sections where warnings exist. It does not rewrite raw books, generated outputs, or Cloudflare exports.",
    "",
    "## Totals",
    "",
    `- Total source books/files found: ${report.totals.sourceBooksFound}`,
    `- Text sources found: ${report.totals.textSourcesFound}`,
    `- Non-text sources found: ${report.totals.nonTextSourcesFound}`,
    `- Existing generated book manifests found: ${report.totals.generatedBookManifestsFound}`,
    `- Existing generated-output warnings inspected: ${report.totals.generatedOutputWarningsInspected}`,
    "",
    "## Risk Counts",
    "",
    "| Risk | Pass 1 | Pass 2 |",
    "| --- | ---: | ---: |",
    riskRows,
    "",
    "## Risk Changes From Pass 1",
    "",
    "| Change | Count | Examples |",
    "| --- | ---: | --- |",
    changeRows,
    "",
    "## Blocked Files",
    "",
    listBooks(report.blockedBooks),
    "",
    "## High-Risk Files Needing Manual Review",
    "",
    listBooks(report.highRiskBooksNeedingManualReview, 80),
    "",
    "## Existing Generated-Output Warning Summary",
    "",
    "| Suspected issue type | Count | Examples |",
    "| --- | ---: | --- |",
    generatedRows || "| None | 0 | |",
    "",
    "The full JSON report includes one inspection object for each generated-output warning, with manifest path, evidence, confidence, later fix recommendation, and pilot-batch inclusion.",
    "",
    "## Top Cleanup Artifacts",
    "",
    "| Category | Books | Examples |",
    "| --- | ---: | --- |",
    cleanupRows || "| None | 0 | |",
    "",
    "## Recommended Pilot Batch",
    "",
    "| Slug | Title | Risk | Boundary challenge | Cleanup challenge |",
    "| --- | --- | --- | --- | --- |",
    pilotRows || "| None |  |  |  |  |",
    "",
    "Do not process this pilot in this audit pass. Use it later as a reviewable first processing batch.",
    "",
    "## Books Safe For Later Larger Low-Risk Batches",
    "",
    listBooks(report.lowRiskBooksSafeForLaterLargerBatches, 60),
    "",
    "## Books That Should Not Be Processed Yet",
    "",
    listBooks(report.booksThatShouldNotBeProcessedYet, 80),
    "",
    "## Protected Folder Confirmation",
    "",
    "- `app/client/assets/temp-books` was read but not modified.",
    "- `app/client/assets/books/generated` was read for comparison but not modified.",
    "- `app/client/assets/books/cloudflare-export` was not modified.",
    "",
    "## Next Processing Strategy",
    "",
    "- Start with the exact pilot batch above and produce a per-book processing report before any larger batch.",
    "- Low-risk books can later be processed in larger batches, around 20-50, after the pilot succeeds.",
    "- Medium-risk books should remain in smaller batches, around 5-10, with explicit boundary and cleanup checks.",
    "- High-risk books should be individual or near-individual until their structural issues are intentionally handled.",
    "- Blocked books should not be processed until manually reviewed or replaced with valid source text.",
    "- Continue audit passes until major red flags are fixed, quarantined, or intentionally accepted with documented rules.",
    "",
    "## Machine-Readable Details",
    "",
    "See `book-processing-audit-pass-2.json` for per-book start/end context, real-content risk flags, artifact verification, generated-output warning inspections, and pilot rationale.",
    "",
  ].join("\n");
}

function buildReport(): Pass2Report {
  const pass1 = readJson<Pass1Report>(PASS_1_JSON_PATH);
  const sourceFiles = findFiles(TEMP_BOOKS_ROOT);
  const pass2Books = pass1.books.map(auditBook);
  const generatedInspections = pass2Books
    .map((book) => book.generatedOutputWarning)
    .filter((inspection): inspection is GeneratedWarningInspection => inspection !== null);
  const pilotBatch = choosePilotBatch(pass2Books);
  const pass2RiskCounts = countRisks(pass2Books);
  const blockedBooks = pass2Books
    .filter((book) => book.pass2Risk === "blocked")
    .map((book) => ({
      slug: book.slug,
      title: book.title,
      sourcePath: book.sourcePath,
      reasons: book.pass2RiskReasons,
    }));
  const highRiskBooks = pass2Books
    .filter((book) => book.pass2Risk === "high")
    .map((book) => ({
      slug: book.slug,
      title: book.title,
      sourcePath: book.sourcePath,
      drivers: book.highRiskDrivers,
      reasons: book.pass2RiskReasons,
    }));
  const lowRiskBooks = pass2Books
    .filter((book) => book.pass2Risk === "low")
    .sort((left, right) => left.slug.localeCompare(right.slug))
    .map((book) => ({ slug: book.slug, title: book.title, sourcePath: book.sourcePath }));
  const doNotProcessYet = pass2Books
    .filter((book) => book.pass2Risk === "blocked" || book.pass2Risk === "high")
    .sort(
      (left, right) =>
        RISK_ORDER[right.pass2Risk] - RISK_ORDER[left.pass2Risk] ||
        left.slug.localeCompare(right.slug),
    )
    .map((book) => ({
      slug: book.slug,
      title: book.title,
      sourcePath: book.sourcePath,
      reasons: book.pass2RiskReasons,
    }));

  return {
    schemaVersion: 1,
    auditName: "book-processing-audit-pass-2",
    generatedAt: new Date().toISOString(),
    inputReports: {
      pass1Json: relativeToRepo(PASS_1_JSON_PATH),
      pass1Markdown: relativeToRepo(PASS_1_MARKDOWN_PATH),
    },
    paths: {
      tempBooks: relativeToRepo(TEMP_BOOKS_ROOT),
      generatedBooks: relativeToRepo(GENERATED_ROOT),
      cloudflareExport: relativeToRepo(CLOUDFLARE_EXPORT_ROOT),
      auditReports: relativeToRepo(AUDIT_REPORT_ROOT),
    },
    totals: {
      sourceBooksFound: sourceFiles.length,
      textSourcesFound: sourceFiles.filter((filePath) => path.extname(filePath).toLowerCase() === ".txt")
        .length,
      nonTextSourcesFound: sourceFiles.filter((filePath) => path.extname(filePath).toLowerCase() !== ".txt")
        .length,
      generatedBookManifestsFound: generatedManifestCount(),
      generatedOutputWarningsInspected: generatedInspections.length,
    },
    pass1RiskCounts: pass1.riskCounts,
    pass2RiskCounts,
    riskChanges: summarizeRiskChanges(pass2Books),
    blockedBooks,
    highRiskBooksNeedingManualReview: highRiskBooks,
    generatedOutputWarningInspections: generatedInspections,
    generatedOutputWarningSummary: summarizeGeneratedWarnings(generatedInspections),
    topCleanupArtifacts: summarizeCleanupArtifacts(pass2Books),
    recommendedPilotBatch: pilotBatch,
    lowRiskBooksSafeForLaterLargerBatches: lowRiskBooks,
    booksThatShouldNotBeProcessedYet: doNotProcessYet,
    confirmations: {
      tempBooksModified: false,
      generatedOutputsModified: false,
      cloudflareExportModified: false,
    },
    books: pass2Books,
  };
}

function main(): void {
  if (!fs.existsSync(PASS_1_JSON_PATH)) {
    throw new Error(`Pass-1 JSON report is required: ${PASS_1_JSON_PATH}`);
  }
  fs.mkdirSync(AUDIT_REPORT_ROOT, { recursive: true });
  const report = buildReport();
  fs.writeFileSync(PASS_2_JSON_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  fs.writeFileSync(PASS_2_MARKDOWN_PATH, buildMarkdown(report), "utf8");
  console.log(`Book processing audit pass 2 complete.`);
  console.log(`Source files found: ${report.totals.sourceBooksFound}`);
  console.log(`Generated-output warnings inspected: ${report.totals.generatedOutputWarningsInspected}`);
  console.log(
    `Pass-2 risk counts: low ${report.pass2RiskCounts.low}, medium ${report.pass2RiskCounts.medium}, high ${report.pass2RiskCounts.high}, blocked ${report.pass2RiskCounts.blocked}`,
  );
  console.log(`Wrote ${relativeToRepo(PASS_2_JSON_PATH)}`);
  console.log(`Wrote ${relativeToRepo(PASS_2_MARKDOWN_PATH)}`);
}

main();
