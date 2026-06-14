import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type RiskLevel = "low" | "medium" | "high" | "blocked";
type BoundaryConfidence = "high" | "medium" | "low" | "blocked";

type TextLine = {
  lineNumber: number;
  offset: number;
  text: string;
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

type CountWithSamples = {
  count: number;
  samples: string[];
};

type SourceMetadata = {
  slug?: string;
  title?: string;
  author?: string[];
  source?: {
    rawTextFile?: string;
    gutenbergId?: string | null;
    sourceUrl?: string | null;
  };
};

type GeneratedManifest = {
  slug: string;
  title: string;
  stats?: {
    cleanedCharacterCount?: number;
    wordCount?: number;
    sectionCount?: number;
    includedSectionCount?: number;
  };
  sections?: Array<{
    id: string;
    kind: string;
    label: string;
    title: string | null;
    includeByDefault: boolean;
    sectionJsonPath: string;
    characterCount?: number;
    wordCount?: number;
    textPreview?: string;
  }>;
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

type BookAudit = {
  sourceFilename: string;
  sourcePath: string;
  guessedSlug: string;
  guessedTitle: string;
  metadataSlug: string | null;
  metadataTitle: string | null;
  gutenbergId: string | null;
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

type AuditReport = {
  schemaVersion: 1;
  auditName: "book-processing-audit-pass-1";
  generatedAt: string;
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
  };
  riskCounts: Record<RiskLevel, number>;
  topRedFlagCategories: Array<{ category: string; count: number; examples: string[] }>;
  blockedBooks: Array<{ slug: string; title: string; sourcePath: string; reasons: string[] }>;
  highRiskBooks: Array<{ slug: string; title: string; sourcePath: string; reasons: string[] }>;
  lowRiskCandidates: Array<{ slug: string; title: string; sourcePath: string }>;
  recommendedPilotBatch: Array<{
    slug: string;
    title: string;
    riskClassification: RiskLevel;
    sourcePath: string;
    reason: string;
  }>;
  generatedDamageWarnings: Array<{
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
  books: BookAudit[];
};

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const TEMP_BOOKS_ROOT = path.join(REPO_ROOT, "app/client/assets/temp-books");
const METADATA_ROOT = path.join(REPO_ROOT, "app/client/assets/text/meta");
const GENERATED_ROOT = path.join(REPO_ROOT, "app/client/assets/books/generated");
const CLOUDFLARE_EXPORT_ROOT = path.join(
  REPO_ROOT,
  "app/client/assets/books/cloudflare-export",
);
const AUDIT_REPORT_ROOT = path.join(
  REPO_ROOT,
  "app/client/assets/books/audit-reports",
);
const JSON_REPORT_PATH = path.join(
  AUDIT_REPORT_ROOT,
  "book-processing-audit-pass-1.json",
);
const MARKDOWN_REPORT_PATH = path.join(
  AUDIT_REPORT_ROOT,
  "book-processing-audit-pass-1.md",
);

const STRONG_START_HEADING =
  /^\s*(?:(chapter|book|part|volume|vol\.|act|scene|canto|stave)\s+([0-9]+|[ivxlcdm]+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b|(?:preface|prologue|introduction|foreword|dedication|author'?s note|translator'?s note|editor'?s note)\b|[IVXLCDM]{1,8}\.\s+\S)/i;
const START_MARKER =
  /^\s*\*{0,3}\s*START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK\b.*\*{0,3}\s*$/i;
const END_MARKER =
  /^\s*\*{0,3}\s*END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK\b.*\*{0,3}\s*$/i;
const OLD_END_MARKER = /^\s*End of (?:the|this )?Project Gutenberg/i;
const TOC_HEADING = /^\s*(?:contents|table of contents|contents\.)\s*$/i;
const TRANSCRIBER_HEADING =
  /^\s*(?:transcriber'?s notes?|transcription notes?|notes? by the transcriber|editor'?s notes?)\s*:?\s*$/i;
const FOOTNOTE_HEADING =
  /^\s*(?:footnotes?|endnotes?|notes?|references|bibliography)\s*:?\s*$/i;
const BOILERPLATE_LINE =
  /project gutenberg|ebook|e-text|produced by|distributed proofreading|release date|language:|title:|author:|credits:|posting date|updated:|character set encoding|this file should be named|online distributed proofreading/i;
const SOURCE_LICENSE_LINE =
  /project gutenberg|gutenberg license|full license|terms of use|copyright laws|the foundation|www\.gutenberg|ebook|produced by|distributed proofreading/i;
const JUNKY_START_TEXT =
  /project gutenberg|produced by|distributed proofreading|table of contents|contents\b|\[illustration\]|gutenberg license|transcriber/i;
const JUNKY_END_TEXT =
  /project gutenberg|gutenberg license|end of (?:the )?project gutenberg|transcriber'?s note|distributed proofreading|produced by/i;

function toPosixPath(input: string): string {
  return input.split(path.sep).join("/");
}

function relativeToRepo(filePath: string): string {
  return toPosixPath(path.relative(REPO_ROOT, filePath));
}

function pathKey(filePath: string): string {
  const resolved = path.resolve(filePath);
  return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readJsonIfExists<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
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
    .replace(/-{2,}/g, "-") || "book";
}

function normalizeText(input: string): string {
  return input.replace(/^\uFEFF/, "").replace(/\r\n|\r/g, "\n");
}

function countWords(input: string): number {
  return input.match(/[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)?/g)?.length ?? 0;
}

function textPreview(input: string, length = 180): string {
  const compact = input.replace(/\s+/g, " ").trim();
  if (compact.length <= length) return compact;
  return `${compact.slice(0, length - 1).trimEnd()}...`;
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

function offsetForLine(lines: TextLine[], lineIndex: number): number {
  return lines[Math.max(0, Math.min(lines.length - 1, lineIndex))]?.offset ?? 0;
}

function lineRangeText(lines: TextLine[], startLineIndex: number, endLineIndex: number): string {
  return lines
    .slice(Math.max(0, startLineIndex), Math.min(lines.length, endLineIndex + 1))
    .map((line) => line.text)
    .join("\n");
}

function makeRange(
  lines: TextLine[],
  type: string,
  startLineIndex: number,
  endLineIndex: number,
  reason: string,
): RangeSummary {
  const safeStart = Math.max(0, Math.min(lines.length - 1, startLineIndex));
  const safeEnd = Math.max(safeStart, Math.min(lines.length - 1, endLineIndex));
  const text = lineRangeText(lines, safeStart, safeEnd);
  const endLine = lines[safeEnd];
  return {
    type,
    startLine: lines[safeStart]?.lineNumber ?? 1,
    endLine: endLine?.lineNumber ?? 1,
    startIndex: lines[safeStart]?.offset ?? 0,
    endIndex: (endLine?.offset ?? 0) + (endLine?.text.length ?? 0),
    wordCount: countWords(text),
    snippet: textPreview(text),
    reason,
  };
}

function firstLineMatching(
  lines: TextLine[],
  pattern: RegExp,
  fromLineIndex = 0,
): number | null {
  for (let index = Math.max(0, fromLineIndex); index < lines.length; index += 1) {
    if (pattern.test(lines[index]?.text ?? "")) return index;
  }
  return null;
}

function lastNonEmptyLineBefore(lines: TextLine[], beforeLineIndex: number): number | null {
  for (let index = Math.min(lines.length - 1, beforeLineIndex); index >= 0; index -= 1) {
    if ((lines[index]?.text ?? "").trim()) return index;
  }
  return null;
}

function lineInRanges(lineIndex: number, ranges: RangeSummary[]): boolean {
  const lineNumber = lineIndex + 1;
  return ranges.some(
    (range) => lineNumber >= range.startLine && lineNumber <= range.endLine,
  );
}

function headingSignature(line: string): string | null {
  const cleaned = line.trim().replace(/\s+/g, " ");
  const match = cleaned.match(
    /^(chapter|book|part|volume|vol\.|act|scene|canto|stave)\s+([0-9]+|[ivxlcdm]+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b/i,
  );
  if (!match) return null;
  return `${match[1]?.toLowerCase()}:${match[2]?.toLowerCase()}`;
}

function detectTocRanges(
  lines: TextLine[],
  bodyStartLine: number,
  bodyEndLine: number,
): RangeSummary[] {
  const ranges: RangeSummary[] = [];
  const searchEnd = Math.min(bodyEndLine, bodyStartLine + 1200);

  for (let index = bodyStartLine; index <= searchEnd; index += 1) {
    if (!TOC_HEADING.test(lines[index]?.text ?? "")) continue;

    const seen = new Map<string, number>();
    let endLine = Math.min(bodyEndLine, index + 180);
    for (
      let cursor = index + 1;
      cursor <= Math.min(bodyEndLine, index + 900);
      cursor += 1
    ) {
      const signature = headingSignature(lines[cursor]?.text ?? "");
      if (!signature) continue;
      const previous = seen.get(signature);
      if (previous !== undefined && cursor - previous > 3) {
        endLine = Math.max(index, cursor - 1);
        break;
      }
      seen.set(signature, cursor);
    }

    ranges.push(
      makeRange(
        lines,
        "table-of-contents",
        index,
        endLine,
        "Detected a Contents/Table of Contents heading near the start of the book.",
      ),
    );
  }

  return ranges;
}

function detectHeadingRanges(
  lines: TextLine[],
  pattern: RegExp,
  type: string,
  reason: string,
): RangeSummary[] {
  const ranges: RangeSummary[] = [];
  for (let index = 0; index < lines.length; index += 1) {
    if (!pattern.test(lines[index]?.text ?? "")) continue;
    ranges.push(makeRange(lines, type, index, Math.min(lines.length - 1, index + 20), reason));
  }
  return ranges;
}

function findCandidateStart(
  lines: TextLine[],
  bodyStartLine: number,
  bodyEndLine: number,
  tocRanges: RangeSummary[],
  hasGutenbergStart: boolean,
): { lineIndex: number | null; confidence: BoundaryConfidence; reason: string } {
  if (bodyStartLine >= bodyEndLine) {
    return { lineIndex: null, confidence: "blocked", reason: "No readable body window." };
  }

  const searchEnd = Math.min(bodyEndLine, bodyStartLine + 3000);
  for (let index = bodyStartLine; index <= searchEnd; index += 1) {
    const raw = lines[index]?.text ?? "";
    const line = raw.trim();
    if (!line || lineInRanges(index, tocRanges) || BOILERPLATE_LINE.test(line)) {
      continue;
    }
    if (STRONG_START_HEADING.test(line)) {
      return {
        lineIndex: index,
        confidence: hasGutenbergStart ? "high" : "medium",
        reason: "Detected a strong narrative/front-matter heading after boilerplate and TOC ranges.",
      };
    }
  }

  for (let index = bodyStartLine; index <= searchEnd; index += 1) {
    const line = (lines[index]?.text ?? "").trim();
    if (
      !line ||
      line.length < 35 ||
      lineInRanges(index, tocRanges) ||
      BOILERPLATE_LINE.test(line) ||
      /^[A-Z0-9 .,'":;!?()-]{1,80}$/.test(line)
    ) {
      continue;
    }
    return {
      lineIndex: index,
      confidence: hasGutenbergStart ? "medium" : "low",
      reason: "Used first substantial non-boilerplate prose line as fallback start.",
    };
  }

  return {
    lineIndex: lastNonEmptyLineBefore(lines, searchEnd),
    confidence: "low",
    reason: "Could not find a clear start heading or substantial prose line.",
  };
}

function findCandidateEnd(
  lines: TextLine[],
  candidateStartLine: number | null,
  bodyEndLine: number,
  hasGutenbergEnd: boolean,
  transcriberRanges: RangeSummary[],
): { lineIndex: number | null; confidence: BoundaryConfidence; reason: string } {
  if (candidateStartLine === null) {
    return { lineIndex: null, confidence: "blocked", reason: "No candidate start." };
  }

  const trailingTranscriber = transcriberRanges
    .filter((range) => range.startLine > Math.floor(lines.length * 0.55))
    .sort((left, right) => left.startLine - right.startLine)[0];

  if (trailingTranscriber && trailingTranscriber.startLine - 2 > candidateStartLine) {
    return {
      lineIndex: trailingTranscriber.startLine - 2,
      confidence: hasGutenbergEnd ? "high" : "medium",
      reason: "Stopped before a trailing transcriber/editor note range.",
    };
  }

  const endLine = lastNonEmptyLineBefore(lines, bodyEndLine);
  if (endLine === null || endLine <= candidateStartLine) {
    return { lineIndex: null, confidence: "blocked", reason: "No coherent end after start." };
  }

  const lastWindow = lineRangeText(lines, Math.max(candidateStartLine, endLine - 40), endLine);
  const hasEndPhrase = /\b(?:the end|finis)\b/i.test(lastWindow);
  return {
    lineIndex: endLine,
    confidence: hasGutenbergEnd ? "high" : hasEndPhrase ? "medium" : "low",
    reason: hasGutenbergEnd
      ? "Used text immediately before Project Gutenberg end marker."
      : hasEndPhrase
        ? "No Gutenberg end marker, but a conventional ending phrase appears near the end."
        : "No Gutenberg end marker; used final non-empty line as fallback.",
  };
}

function collectLineSamples(lines: TextLine[], pattern: RegExp, maxSamples = 5): CountWithSamples {
  const samples: string[] = [];
  let count = 0;
  for (const line of lines) {
    if (!pattern.test(line.text)) continue;
    count += 1;
    if (samples.length < maxSamples) {
      samples.push(`L${line.lineNumber}: ${textPreview(line.text, 120)}`);
    }
  }
  return { count, samples };
}

function collectRegexMatches(text: string, pattern: RegExp, maxSamples = 5): CountWithSamples {
  const samples: string[] = [];
  let count = 0;
  let match: RegExpExecArray | null;
  pattern.lastIndex = 0;
  while ((match = pattern.exec(text))) {
    count += 1;
    if (samples.length < maxSamples) samples.push(textPreview(match[0], 120));
  }
  return { count, samples };
}

function collectBracketReferences(text: string): {
  totalCount: number;
  uniqueReferences: number[];
  samples: string[];
} {
  const unique = new Set<number>();
  const samples: string[] = [];
  let totalCount = 0;
  const pattern = /\[(\d{1,3})\]/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    const value = Number(match[1]);
    if (value < 1 || value > 100) continue;
    totalCount += 1;
    unique.add(value);
    if (samples.length < 8) {
      samples.push(textPreview(text.slice(Math.max(0, match.index - 45), match.index + 80), 140));
    }
  }
  return {
    totalCount,
    uniqueReferences: [...unique].sort((left, right) => left - right),
    samples,
  };
}

function detectChapterWarnings(lines: TextLine[], tocRanges: RangeSummary[]): string[] {
  const warnings: string[] = [];
  const values: Array<{ line: number; value: number }> = [];
  for (let index = 0; index < lines.length; index += 1) {
    if (lineInRanges(index, tocRanges)) continue;
    const match = (lines[index]?.text ?? "").trim().match(/^chapter\s+([0-9]+|[ivxlcdm]+)\b/i);
    if (!match) continue;
    const value = parseOrdinal(match[1] ?? "");
    if (value !== null) values.push({ line: index + 1, value });
  }
  if (values.length === 0) return warnings;
  if (values[0]?.value !== 1 && values.some((entry) => entry.value === 1)) {
    warnings.push(`Chapter ${values[0]?.value} appears before Chapter 1 outside the detected TOC.`);
  }
  for (let index = 1; index < values.length; index += 1) {
    const previous = values[index - 1];
    const current = values[index];
    if (!previous || !current) continue;
    if (current.value < previous.value && current.value !== 1) {
      warnings.push(
        `Possible chapter order issue: Chapter ${current.value} at line ${current.line} follows Chapter ${previous.value}.`,
      );
      break;
    }
  }
  return warnings;
}

function parseOrdinal(input: string): number | null {
  if (/^\d+$/.test(input)) return Number(input);
  const romanValues: Record<string, number> = {
    i: 1,
    v: 5,
    x: 10,
    l: 50,
    c: 100,
    d: 500,
    m: 1000,
  };
  let total = 0;
  let previous = 0;
  for (const character of input.toLowerCase().split("").reverse()) {
    const value = romanValues[character];
    if (!value) return null;
    if (value < previous) total -= value;
    else total += value;
    previous = value;
  }
  return total || null;
}

function extractHeaderTitle(text: string, fallbackTitle: string): string {
  const titleMatch = text.match(/^Title:\s*(.+)$/im);
  if (titleMatch?.[1]) return titleMatch[1].trim();
  return fallbackTitle;
}

function extractGutenbergId(text: string, metadata: SourceMetadata | null): string | null {
  if (metadata?.source?.gutenbergId) return String(metadata.source.gutenbergId);
  return (
    text.match(/\[(?:eBook|EBook)\s+#(\d+)\]/)?.[1] ??
    text.match(/Project Gutenberg (?:eBook|EBook).*?#(\d+)/i)?.[1] ??
    text.match(/\/ebooks\/(\d+)/i)?.[1] ??
    null
  );
}

function loadMetadataByRawPath(): Map<string, SourceMetadata> {
  const metadataByRawPath = new Map<string, SourceMetadata>();
  for (const filePath of findFiles(METADATA_ROOT).filter((candidate) =>
    candidate.toLowerCase().endsWith(".json"),
  )) {
    const metadata = readJsonIfExists<SourceMetadata>(filePath);
    if (!metadata?.source?.rawTextFile) continue;
    const rawPath = path.resolve(path.dirname(filePath), metadata.source.rawTextFile);
    metadataByRawPath.set(pathKey(rawPath), metadata);
  }
  return metadataByRawPath;
}

function readGeneratedManifest(slug: string): {
  manifest: GeneratedManifest | null;
  root: string | null;
} {
  const root = path.join(GENERATED_ROOT, slug);
  const manifestPath = path.join(root, "manifest.json");
  const manifest = readJsonIfExists<GeneratedManifest>(manifestPath);
  return manifest ? { manifest, root } : { manifest: null, root: null };
}

function readGeneratedSectionText(root: string, sectionPath: string): string {
  const parsed = readJsonIfExists<{ displayText?: string; morseSourceText?: string; textPreview?: string }>(
    path.join(root, sectionPath),
  );
  return parsed?.displayText ?? parsed?.morseSourceText ?? parsed?.textPreview ?? "";
}

function compareGeneratedOutput(
  manifest: GeneratedManifest | null,
  generatedRoot: string | null,
  candidateStartSnippet: string,
  candidateEndLine: number | null,
  rawCandidateCharacterCount: number,
): GeneratedComparison {
  if (!manifest || !generatedRoot) {
    return {
      existingGeneratedOutputExists: false,
      generatedSlug: null,
      sectionCount: 0,
      includedSectionCount: 0,
      appearsToStartTooEarly: false,
      appearsToStartTooLate: false,
      appearsToEndTooEarly: false,
      appearsToIncludeFooterOrLicenseJunk: false,
      reasons: [],
    };
  }

  const sections = manifest.sections ?? [];
  const firstIncluded = sections.find((section) => section.includeByDefault) ?? sections[0];
  const lastSection = sections.at(-1);
  const firstText = firstIncluded
    ? `${firstIncluded.textPreview ?? ""} ${readGeneratedSectionText(generatedRoot, firstIncluded.sectionJsonPath).slice(0, 2000)}`
    : "";
  const lastText = lastSection
    ? `${lastSection.textPreview ?? ""} ${readGeneratedSectionText(generatedRoot, lastSection.sectionJsonPath).slice(-2500)}`
    : "";
  const reasons: string[] = [];
  const appearsToStartTooEarly = JUNKY_START_TEXT.test(firstText);
  if (appearsToStartTooEarly) {
    reasons.push("First included/generated section appears to contain title-page, TOC, illustration, or source boilerplate text.");
  }

  const excludedBeforeIncluded = firstIncluded
    ? sections.filter((section) => section !== firstIncluded && !section.includeByDefault)
    : [];
  const excludedRealFrontMatter = excludedBeforeIncluded.some((section) =>
    /preface|prologue|introduction|foreword|dedication|author|translator/i.test(
      `${section.label} ${section.title ?? ""} ${section.textPreview ?? ""}`,
    ),
  );
  const appearsToStartTooLate =
    Boolean(firstIncluded) &&
    excludedRealFrontMatter &&
    !firstText.toLowerCase().includes(candidateStartSnippet.slice(0, 40).toLowerCase());
  if (appearsToStartTooLate) {
    reasons.push("Generated defaults may skip legitimate preface/introduction/prologue-style opening material.");
  }

  const cleanedCharacters = manifest.stats?.cleanedCharacterCount ?? 0;
  const appearsToEndTooEarly =
    candidateEndLine !== null &&
    rawCandidateCharacterCount > 0 &&
    cleanedCharacters > 0 &&
    cleanedCharacters < rawCandidateCharacterCount * 0.62;
  if (appearsToEndTooEarly) {
    reasons.push("Generated cleaned text is far shorter than the audited candidate body window.");
  }

  const appearsToIncludeFooterOrLicenseJunk = JUNKY_END_TEXT.test(lastText);
  if (appearsToIncludeFooterOrLicenseJunk) {
    reasons.push("Generated final section appears to include Project Gutenberg/footer/license/transcriber junk.");
  }

  return {
    existingGeneratedOutputExists: true,
    generatedSlug: manifest.slug,
    sectionCount: sections.length,
    includedSectionCount: sections.filter((section) => section.includeByDefault).length,
    appearsToStartTooEarly,
    appearsToStartTooLate,
    appearsToEndTooEarly,
    appearsToIncludeFooterOrLicenseJunk,
    reasons,
  };
}

function riskAction(risk: RiskLevel): string {
  if (risk === "blocked") {
    return "Do not process until the source or boundary issue has been manually reviewed.";
  }
  if (risk === "high") {
    return "Review individually or in a near-individual batch before processing.";
  }
  if (risk === "medium") {
    return "Process later in a small 5-10 book batch with explicit boundary and artifact checks.";
  }
  return "Candidate for a later larger low-risk batch after the pilot batch succeeds.";
}

function classifyRisk(details: {
  isTextSource: boolean;
  rawWordCount: number;
  startConfidence: BoundaryConfidence;
  endConfidence: BoundaryConfidence;
  imageCount: number;
  bracketUniqueCount: number;
  bracketTotalCount: number;
  decorativeCount: number;
  pageMarkerCount: number;
  weirdCount: number;
  footnoteRangeCount: number;
  transcriberRangeCount: number;
  tocRangeCount: number;
  chapterWarnings: string[];
  generatedComparison: GeneratedComparison;
  candidateStartLine: number | null;
  candidateEndLine: number | null;
}): { risk: RiskLevel; reasons: string[] } {
  const reasons: string[] = [];
  if (!details.isTextSource) reasons.push("Source is not a text file.");
  if (details.rawWordCount < 100) reasons.push("Source has fewer than 100 words.");
  if (details.startConfidence === "blocked" || details.endConfidence === "blocked") {
    reasons.push("Start or end boundary could not be identified.");
  }
  if (
    details.candidateStartLine !== null &&
    details.candidateEndLine !== null &&
    details.candidateStartLine >= details.candidateEndLine
  ) {
    reasons.push("Candidate start is not before candidate end.");
  }
  if (reasons.length > 0) return { risk: "blocked", reasons };

  if (details.startConfidence === "low") reasons.push("Low-confidence start boundary.");
  if (details.endConfidence === "low") reasons.push("Low-confidence end boundary.");
  if (details.imageCount > 20) reasons.push("Many illustration/image placeholders.");
  if (details.bracketUniqueCount > 30 || details.bracketTotalCount > 80) {
    reasons.push("Dense numbered bracket references or footnote markers.");
  }
  if (details.footnoteRangeCount > 1) reasons.push("Multiple footnote/reference sections.");
  if (details.transcriberRangeCount > 1) reasons.push("Multiple transcriber/editor note ranges.");
  if (details.decorativeCount + details.pageMarkerCount > 80) {
    reasons.push("Many decorative separators or page markers.");
  }
  if (details.weirdCount > 120) reasons.push("Many OCR/copy-paste/unicode artifacts.");
  if (details.chapterWarnings.length > 0) reasons.push("Possible malformed chapter numbering.");
  if (details.generatedComparison.reasons.length > 0) {
    reasons.push("Existing generated output has possible boundary or footer damage.");
  }
  if (details.tocRangeCount > 1) reasons.push("Multiple detected table-of-contents ranges.");
  if (reasons.length > 0) return { risk: "high", reasons };

  if (details.startConfidence === "medium") reasons.push("Medium-confidence start boundary.");
  if (details.endConfidence === "medium") reasons.push("Medium-confidence end boundary.");
  if (details.imageCount > 0) reasons.push("Illustration/image placeholders present.");
  if (details.bracketUniqueCount > 5 || details.bracketTotalCount > 15) {
    reasons.push("Moderate numbered bracket references.");
  }
  if (details.footnoteRangeCount > 0) reasons.push("Footnote/reference section detected.");
  if (details.transcriberRangeCount > 0) reasons.push("Transcriber/editor note detected.");
  if (details.tocRangeCount > 0) reasons.push("Table of contents detected near front.");
  if (details.decorativeCount + details.pageMarkerCount > 15) {
    reasons.push("Moderate decorative separators or page markers.");
  }
  if (details.weirdCount > 0) reasons.push("Unicode/OCR/copy-paste artifacts present.");
  if (reasons.length > 0) return { risk: "medium", reasons };

  return { risk: "low", reasons: ["Clear markers and low artifact counts."] };
}

function auditTextBook(
  filePath: string,
  metadata: SourceMetadata | null,
  generatedManifest: GeneratedManifest | null,
  generatedRoot: string | null,
): BookAudit {
  const rawText = fs.readFileSync(filePath, "utf8");
  const text = normalizeText(rawText);
  const lines = buildLines(text);
  const guessedSlug = metadata?.slug ?? slugify(path.basename(filePath, path.extname(filePath)));
  const guessedTitle = metadata?.title ?? extractHeaderTitle(text, path.basename(filePath, path.extname(filePath)));
  const rawWordCount = countWords(text);
  const startMarkerLine = firstLineMatching(lines, START_MARKER);
  const endMarkerLine =
    firstLineMatching(lines, END_MARKER, startMarkerLine ?? 0) ??
    firstLineMatching(lines, OLD_END_MARKER, startMarkerLine ?? 0);
  const bodyStartLine = startMarkerLine === null ? 0 : Math.min(lines.length - 1, startMarkerLine + 1);
  const bodyEndLine = endMarkerLine === null ? lines.length - 1 : Math.max(0, endMarkerLine - 1);
  const tocRanges = detectTocRanges(lines, bodyStartLine, bodyEndLine);
  const transcriberRanges = detectHeadingRanges(
    lines,
    TRANSCRIBER_HEADING,
    "transcriber-editor-note",
    "Detected transcriber/editor note heading.",
  );
  const footnoteRanges = detectHeadingRanges(
    lines,
    FOOTNOTE_HEADING,
    "footnote-reference-section",
    "Detected footnote/reference-style heading.",
  );
  const candidateStart = findCandidateStart(
    lines,
    bodyStartLine,
    bodyEndLine,
    tocRanges,
    startMarkerLine !== null,
  );
  const candidateEnd = findCandidateEnd(
    lines,
    candidateStart.lineIndex,
    bodyEndLine,
    endMarkerLine !== null,
    transcriberRanges,
  );

  const frontMatterRanges: RangeSummary[] = [];
  if (startMarkerLine !== null) {
    frontMatterRanges.push(
      makeRange(
        lines,
        "project-gutenberg-header",
        0,
        startMarkerLine,
        "Text before and including the Project Gutenberg start marker.",
      ),
    );
  }
  if (candidateStart.lineIndex !== null && candidateStart.lineIndex > bodyStartLine) {
    frontMatterRanges.push(
      makeRange(
        lines,
        "candidate-front-matter",
        bodyStartLine,
        candidateStart.lineIndex - 1,
        "Text before the audited candidate real book start.",
      ),
    );
  }

  const licenseRanges: RangeSummary[] = [];
  if (endMarkerLine !== null) {
    licenseRanges.push(
      makeRange(
        lines,
        "project-gutenberg-footer-license",
        endMarkerLine,
        lines.length - 1,
        "Text from the Project Gutenberg end marker through the file end.",
      ),
    );
  }
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]?.text ?? "";
    if (!SOURCE_LICENSE_LINE.test(line)) continue;
    if (licenseRanges.some((range) => index + 1 >= range.startLine && index + 1 <= range.endLine)) {
      continue;
    }
    licenseRanges.push(
      makeRange(lines, "source-license-line", index, index, "Detected source/license/production line."),
    );
  }

  const imagePlaceholders = collectRegexMatches(
    text,
    /\[(?:Illustration|Illustrations|Plate|Image|Map|Music|Facsimile|Portrait)[^\]]*\]/gi,
    8,
  );
  const bracketReferences = collectBracketReferences(text);
  const decorativeLines = collectLineSamples(
    lines,
    /^\s*[-_=*~.#:;'"`^+|\\\/<>{}[\]().,!\u2014\u2013 ]{4,}\s*$/,
    8,
  );
  const pageMarkers = collectLineSamples(
    lines,
    /^\s*(?:\[?Page\s+\d+\]?|\[Pg\.?\s*\d+\]|\[\d+\]|-\s*\d+\s*-)\s*$/i,
    8,
  );
  const weirdArtifacts: Record<string, CountWithSamples> = {
    replacementCharacters: collectRegexMatches(text, /\uFFFD/g),
    mojibake: collectRegexMatches(text, /(?:â[€™€œ€“]|Ã.|Â.)/g),
    nonbreakingSpaces: collectRegexMatches(text, /\u00A0/g),
    ligatures: collectRegexMatches(text, /[\uFB00-\uFB06]/g),
    emOrEnDashes: collectRegexMatches(text, /[\u2013\u2014]/g),
    controlCharacters: collectRegexMatches(text, /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g),
  };
  const chapterWarnings = detectChapterWarnings(lines, tocRanges);
  const startSnippet =
    candidateStart.lineIndex === null
      ? ""
      : textPreview(lineRangeText(lines, candidateStart.lineIndex, Math.min(lines.length - 1, candidateStart.lineIndex + 3)));
  const endSnippet =
    candidateEnd.lineIndex === null
      ? ""
      : textPreview(lineRangeText(lines, Math.max(0, candidateEnd.lineIndex - 3), candidateEnd.lineIndex));
  const rawCandidateCharacterCount =
    candidateStart.lineIndex !== null && candidateEnd.lineIndex !== null
      ? Math.max(0, offsetForLine(lines, candidateEnd.lineIndex) - offsetForLine(lines, candidateStart.lineIndex))
      : 0;
  const generatedComparison = compareGeneratedOutput(
    generatedManifest,
    generatedRoot,
    startSnippet,
    candidateEnd.lineIndex,
    rawCandidateCharacterCount,
  );
  const severeWeirdCount = Object.entries(weirdArtifacts).reduce(
    (total, [key, entry]) => total + (key === "emOrEnDashes" ? 0 : entry.count),
    0,
  );
  const { risk, reasons } = classifyRisk({
    isTextSource: true,
    rawWordCount,
    startConfidence: candidateStart.confidence,
    endConfidence: candidateEnd.confidence,
    imageCount: imagePlaceholders.count,
    bracketUniqueCount: bracketReferences.uniqueReferences.length,
    bracketTotalCount: bracketReferences.totalCount,
    decorativeCount: decorativeLines.count,
    pageMarkerCount: pageMarkers.count,
    weirdCount: severeWeirdCount,
    footnoteRangeCount: footnoteRanges.length,
    transcriberRangeCount: transcriberRanges.length,
    tocRangeCount: tocRanges.length,
    chapterWarnings,
    generatedComparison,
    candidateStartLine: candidateStart.lineIndex,
    candidateEndLine: candidateEnd.lineIndex,
  });

  return {
    sourceFilename: path.basename(filePath),
    sourcePath: relativeToRepo(filePath),
    guessedSlug,
    guessedTitle,
    metadataSlug: metadata?.slug ?? null,
    metadataTitle: metadata?.title ?? null,
    gutenbergId: extractGutenbergId(text, metadata),
    isTextSource: true,
    existingGeneratedOutputExists: generatedComparison.existingGeneratedOutputExists,
    approximateRawWordCount: rawWordCount,
    candidateRealBookStartLine:
      candidateStart.lineIndex === null ? null : candidateStart.lineIndex + 1,
    candidateRealBookStartIndex:
      candidateStart.lineIndex === null ? null : offsetForLine(lines, candidateStart.lineIndex),
    candidateRealBookStartHeadingOrSnippet: startSnippet,
    candidateRealBookEndLine:
      candidateEnd.lineIndex === null ? null : candidateEnd.lineIndex + 1,
    candidateRealBookEndIndex:
      candidateEnd.lineIndex === null ? null : offsetForLine(lines, candidateEnd.lineIndex),
    candidateRealBookEndHeadingOrSnippet: endSnippet,
    startBoundaryConfidence: candidateStart.confidence,
    endBoundaryConfidence: candidateEnd.confidence,
    detectedFrontMatterRanges: frontMatterRanges.slice(0, 6),
    detectedTableOfContentsRanges: tocRanges.slice(0, 6),
    detectedLicenseFooterSourceRanges: licenseRanges.slice(0, 20),
    detectedTranscriberEditorNotes: transcriberRanges.slice(0, 10),
    detectedFootnoteReferenceSections: footnoteRanges.slice(0, 10),
    detectedIllustrationImagePlaceholders: imagePlaceholders,
    detectedRepeatedBracketReferences: bracketReferences,
    detectedDecorativeSeparatorsOrPageMarkers: {
      count: decorativeLines.count + pageMarkers.count,
      samples: [...decorativeLines.samples, ...pageMarkers.samples].slice(0, 12),
    },
    detectedWeirdOcrCopyPasteArtifacts: weirdArtifacts,
    detectedChapterNumberingWarnings: chapterWarnings,
    generatedComparison,
    firstHourPreviewCanBeSafelyDerivedLater:
      risk === "low" ||
      (risk === "medium" &&
        candidateStart.confidence !== "low" &&
        candidateEnd.confidence !== "low" &&
        imagePlaceholders.count < 10 &&
        bracketReferences.totalCount < 40),
    riskClassification: risk,
    riskReasons: reasons,
    recommendedNextAction: riskAction(risk),
  };
}

function auditNonTextFile(filePath: string): BookAudit {
  const slug = slugify(path.basename(filePath, path.extname(filePath)));
  return {
    sourceFilename: path.basename(filePath),
    sourcePath: relativeToRepo(filePath),
    guessedSlug: slug,
    guessedTitle: path.basename(filePath, path.extname(filePath)),
    metadataSlug: null,
    metadataTitle: null,
    gutenbergId: null,
    isTextSource: false,
    existingGeneratedOutputExists: false,
    approximateRawWordCount: 0,
    candidateRealBookStartLine: null,
    candidateRealBookStartIndex: null,
    candidateRealBookStartHeadingOrSnippet: "",
    candidateRealBookEndLine: null,
    candidateRealBookEndIndex: null,
    candidateRealBookEndHeadingOrSnippet: "",
    startBoundaryConfidence: "blocked",
    endBoundaryConfidence: "blocked",
    detectedFrontMatterRanges: [],
    detectedTableOfContentsRanges: [],
    detectedLicenseFooterSourceRanges: [],
    detectedTranscriberEditorNotes: [],
    detectedFootnoteReferenceSections: [],
    detectedIllustrationImagePlaceholders: { count: 0, samples: [] },
    detectedRepeatedBracketReferences: { totalCount: 0, uniqueReferences: [], samples: [] },
    detectedDecorativeSeparatorsOrPageMarkers: { count: 0, samples: [] },
    detectedWeirdOcrCopyPasteArtifacts: {},
    detectedChapterNumberingWarnings: [],
    generatedComparison: {
      existingGeneratedOutputExists: false,
      generatedSlug: null,
      sectionCount: 0,
      includedSectionCount: 0,
      appearsToStartTooEarly: false,
      appearsToStartTooLate: false,
      appearsToEndTooEarly: false,
      appearsToIncludeFooterOrLicenseJunk: false,
      reasons: ["Source file is not text and cannot be audited as a book."],
    },
    firstHourPreviewCanBeSafelyDerivedLater: false,
    riskClassification: "blocked",
    riskReasons: ["Source is not a text file."],
    recommendedNextAction: riskAction("blocked"),
  };
}

function generatedManifestCount(): number {
  return fs
    .readdirSync(GENERATED_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => fs.existsSync(path.join(GENERATED_ROOT, entry.name, "manifest.json")))
    .length;
}

function recordRedFlags(books: BookAudit[]): Array<{ category: string; count: number; examples: string[] }> {
  const categories = new Map<string, { count: number; examples: string[] }>();
  const add = (category: string, book: BookAudit) => {
    const current = categories.get(category) ?? { count: 0, examples: [] };
    current.count += 1;
    if (current.examples.length < 6) current.examples.push(`${book.guessedSlug}: ${book.guessedTitle}`);
    categories.set(category, current);
  };

  for (const book of books) {
    if (!book.isTextSource) add("non-text-source", book);
    if (book.startBoundaryConfidence === "low" || book.startBoundaryConfidence === "blocked") {
      add("uncertain-start-boundary", book);
    }
    if (book.endBoundaryConfidence === "low" || book.endBoundaryConfidence === "blocked") {
      add("uncertain-end-boundary", book);
    }
    if (book.detectedTableOfContentsRanges.length > 0) add("table-of-contents", book);
    if (book.detectedTranscriberEditorNotes.length > 0) add("transcriber-editor-notes", book);
    if (book.detectedFootnoteReferenceSections.length > 0) add("footnote-reference-sections", book);
    if (book.detectedIllustrationImagePlaceholders.count > 0) add("illustration-image-placeholders", book);
    if (book.detectedRepeatedBracketReferences.totalCount > 0) add("numbered-bracket-references", book);
    if (book.detectedDecorativeSeparatorsOrPageMarkers.count > 0) add("decorative-page-markers", book);
    if (book.detectedWeirdOcrCopyPasteArtifacts.emOrEnDashes?.count) {
      add("dash-normalization-candidates", book);
    }
    if (
      Object.entries(book.detectedWeirdOcrCopyPasteArtifacts).some(
        ([key, artifact]) => key !== "emOrEnDashes" && artifact.count > 0,
      )
    ) {
      add("unicode-ocr-copy-paste-artifacts", book);
    }
    if (book.generatedComparison.reasons.length > 0) add("generated-output-warning", book);
    if (book.detectedChapterNumberingWarnings.length > 0) add("chapter-numbering-warning", book);
  }

  return [...categories.entries()]
    .map(([category, value]) => ({ category, ...value }))
    .sort((left, right) => right.count - left.count || left.category.localeCompare(right.category));
}

function choosePilotBatch(books: BookAudit[]): AuditReport["recommendedPilotBatch"] {
  const byRisk = (risk: RiskLevel) =>
    books
      .filter((book) => book.riskClassification === risk)
      .sort((left, right) => left.guessedSlug.localeCompare(right.guessedSlug));
  const selected: BookAudit[] = [
    ...byRisk("low").slice(0, 3),
    ...byRisk("medium").slice(0, 3),
    ...byRisk("high").slice(0, 2),
  ];
  return selected.slice(0, 8).map((book) => ({
    slug: book.guessedSlug,
    title: book.guessedTitle,
    riskClassification: book.riskClassification,
    sourcePath: book.sourcePath,
    reason: book.riskReasons[0] ?? "Pilot candidate.",
  }));
}

function buildMarkdown(report: AuditReport): string {
  const riskRows = (["low", "medium", "high", "blocked"] as const)
    .map((risk) => `| ${risk} | ${report.riskCounts[risk]} |`)
    .join("\n");
  const redFlagRows = report.topRedFlagCategories
    .slice(0, 15)
    .map(
      (entry) =>
        `| ${entry.category} | ${entry.count} | ${entry.examples.map((example) => example.replace(/\|/g, "\\|")).join("<br>")} |`,
    )
    .join("\n");
  const listBooks = (
    books: Array<{ slug: string; title: string; sourcePath: string; reasons?: string[] }>,
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
        const reasons = book.reasons?.length ? ` Reasons: ${book.reasons.join("; ")}` : "";
        return `- ${book.slug} - ${book.title} (${book.sourcePath}).${reasons}`;
      })
      .join("\n")}${suffix}`;
  };

  return [
    "# Book Processing Audit Pass 1",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "This is a read-only audit of the current raw/source book set. It does not rewrite processed books, raw source books, generated outputs, or Cloudflare exports.",
    "",
    "## Totals",
    "",
    `- Total source books/files found: ${report.totals.sourceBooksFound}`,
    `- Text sources found: ${report.totals.textSourcesFound}`,
    `- Non-text sources found: ${report.totals.nonTextSourcesFound}`,
    `- Existing generated book manifests found: ${report.totals.generatedBookManifestsFound}`,
    "",
    "## Risk Counts",
    "",
    "| Risk | Count |",
    "| --- | ---: |",
    riskRows,
    "",
    "## Top Red-Flag Categories",
    "",
    "| Category | Count | Examples |",
    "| --- | ---: | --- |",
    redFlagRows || "| None | 0 | |",
    "",
    "## Blocked Books",
    "",
    listBooks(report.blockedBooks),
    "",
    "## High-Risk Books",
    "",
    listBooks(report.highRiskBooks),
    "",
    "## Low-Risk Candidates For Later Larger Batches",
    "",
    listBooks(report.lowRiskCandidates, 40),
    "",
    "## Recommended Pilot Batch",
    "",
    report.recommendedPilotBatch.length === 0
      ? "- No pilot candidates selected."
      : report.recommendedPilotBatch
          .map(
            (book) =>
              `- ${book.slug} - ${book.title} (${book.riskClassification}). ${book.reason}`,
          )
          .join("\n"),
    "",
    "## Existing Generated Output Warnings",
    "",
    report.generatedDamageWarnings.length === 0
      ? "- No existing generated books were flagged by this audit comparison."
      : listBooks(report.generatedDamageWarnings),
    "",
    "## Protected Folder Confirmation",
    "",
    "- `app/client/assets/temp-books` was read but not modified.",
    "- `app/client/assets/books/generated` was read for comparison but not modified.",
    "- `app/client/assets/books/cloudflare-export` was not modified.",
    "",
    "## Next Processing Strategy",
    "",
    "- Low-risk books can later be processed in larger batches, maybe 20-50 at a time, after a pilot batch succeeds.",
    "- Medium-risk books should stay in smaller batches, maybe 5-10 at a time, with explicit boundary and artifact checks.",
    "- High-risk books should be processed individually or in near-individual batches after manual review.",
    "- Blocked books should not be processed until the source, boundary, or corruption issue is manually reviewed.",
    "- Multiple audit passes should continue until major red flags are removed, intentionally handled, or quarantined.",
    "",
    "## Machine-Readable Details",
    "",
    "See `book-processing-audit-pass-1.json` for per-book boundary guesses, snippets, detected ranges, artifact counts, generated-output comparison, risk classification, and recommended next action.",
    "",
  ].join("\n");
}

function buildReport(): AuditReport {
  const metadataByRawPath = loadMetadataByRawPath();
  const sourceFiles = findFiles(TEMP_BOOKS_ROOT);
  const books = sourceFiles.map((filePath) => {
    const extension = path.extname(filePath).toLowerCase();
    if (extension !== ".txt") return auditNonTextFile(filePath);
    const metadata = metadataByRawPath.get(pathKey(filePath)) ?? null;
    const guessedSlug = metadata?.slug ?? slugify(path.basename(filePath, path.extname(filePath)));
    const generated = readGeneratedManifest(guessedSlug);
    return auditTextBook(filePath, metadata, generated.manifest, generated.root);
  });
  const riskCounts: Record<RiskLevel, number> = {
    low: 0,
    medium: 0,
    high: 0,
    blocked: 0,
  };
  for (const book of books) riskCounts[book.riskClassification] += 1;
  const generatedDamageWarnings = books
    .filter((book) => book.generatedComparison.reasons.length > 0)
    .map((book) => ({
      slug: book.guessedSlug,
      title: book.guessedTitle,
      sourcePath: book.sourcePath,
      reasons: book.generatedComparison.reasons,
    }));

  return {
    schemaVersion: 1,
    auditName: "book-processing-audit-pass-1",
    generatedAt: new Date().toISOString(),
    paths: {
      tempBooks: relativeToRepo(TEMP_BOOKS_ROOT),
      generatedBooks: relativeToRepo(GENERATED_ROOT),
      cloudflareExport: relativeToRepo(CLOUDFLARE_EXPORT_ROOT),
      auditReports: relativeToRepo(AUDIT_REPORT_ROOT),
    },
    totals: {
      sourceBooksFound: sourceFiles.length,
      textSourcesFound: books.filter((book) => book.isTextSource).length,
      nonTextSourcesFound: books.filter((book) => !book.isTextSource).length,
      generatedBookManifestsFound: generatedManifestCount(),
    },
    riskCounts,
    topRedFlagCategories: recordRedFlags(books),
    blockedBooks: books
      .filter((book) => book.riskClassification === "blocked")
      .map((book) => ({
        slug: book.guessedSlug,
        title: book.guessedTitle,
        sourcePath: book.sourcePath,
        reasons: book.riskReasons,
      })),
    highRiskBooks: books
      .filter((book) => book.riskClassification === "high")
      .map((book) => ({
        slug: book.guessedSlug,
        title: book.guessedTitle,
        sourcePath: book.sourcePath,
        reasons: book.riskReasons,
      })),
    lowRiskCandidates: books
      .filter((book) => book.riskClassification === "low")
      .map((book) => ({
        slug: book.guessedSlug,
        title: book.guessedTitle,
        sourcePath: book.sourcePath,
      })),
    recommendedPilotBatch: choosePilotBatch(books),
    generatedDamageWarnings,
    confirmations: {
      tempBooksModified: false,
      generatedOutputsModified: false,
      cloudflareExportModified: false,
    },
    books,
  };
}

function main() {
  const report = buildReport();
  fs.mkdirSync(AUDIT_REPORT_ROOT, { recursive: true });
  fs.writeFileSync(JSON_REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(MARKDOWN_REPORT_PATH, buildMarkdown(report));
  console.log(`Book processing audit pass 1 complete.`);
  console.log(`Source books/files found: ${report.totals.sourceBooksFound}`);
  console.log(
    `Risk counts: low=${report.riskCounts.low}, medium=${report.riskCounts.medium}, high=${report.riskCounts.high}, blocked=${report.riskCounts.blocked}`,
  );
  console.log(`JSON report: ${relativeToRepo(JSON_REPORT_PATH)}`);
  console.log(`Markdown report: ${relativeToRepo(MARKDOWN_REPORT_PATH)}`);
}

main();
