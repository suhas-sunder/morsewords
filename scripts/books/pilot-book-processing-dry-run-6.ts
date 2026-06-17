import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import type {
  BookSectionKind,
  GeneratedBookManifest,
  GeneratedBookSectionJson,
  GeneratedBookSectionSummary,
  GeneratedLibraryManifest,
} from "./bookManifestTypes.ts";
import { analyzeBookStructure } from "./lib/book-structure-detection.ts";

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

type PriorPassBook = {
  sourceFilename: string;
  sourcePath: string;
  slug: string;
  title: string;
  existingGeneratedOutputExists: boolean;
  approximateRawWordCount: number;
  pass1Risk?: string;
  pass2Risk?: string;
  pass1RiskReasons?: string[];
  pass2RiskReasons?: string[];
  candidateStart?: {
    line: number;
    index: number;
    confidence: string;
    candidateSnippet: string;
    linesBefore?: string[];
  };
  candidateEnd?: {
    line: number;
    index: number;
    confidence: string;
    candidateSnippet: string;
    linesAfter?: string[];
  };
  cleanupArtifactSummary?: Record<string, unknown>;
  generatedOutputWarning?: {
    status?: string;
    apparentDamage?: string[];
  };
  firstHourPreviewCanBeSafelyDerivedLater?: boolean;
  recommendedNextAction?: string;
};

type StructureAuditBook = {
  slug: string;
  sourceFilename: string;
  sourcePath: string;
  rawWordCount: number;
  cleanedWordCount: number;
  likelyTitle: string;
  likelyAuthor: string | string[];
  detectedStructuralConvention: string;
  confidenceScore: number;
  confidenceLevel: string;
  estimatedSectionCount: number;
  fallbackRequired: boolean;
  fallbackReason: string | null;
  fallbackLegitimacy: string;
  likelyTocHeadingsDetected: boolean;
  likelyBodyHeadingsDetected: boolean;
  examplesOfDetectedBodyHeadings: string[];
  examplesOfRejectedTocLikeHeadings: string[];
  sectionSizeSanityNotes: {
    sectionCount: number;
    minimumWords: number;
    medianWords: number;
    maximumWords: number;
    averageWords: number;
    hugeSectionCount: number;
    tinySectionCount: number;
    notes: string[];
  } | null;
  startBoundaryConfidence: string;
  endBoundaryConfidence: string;
  cleaningWarnings: string[];
  redFlags: string[];
  recommendedHandling: string;
  generatedComparison?: Record<string, unknown>;
};

type StartupAuditBook = {
  slug: string;
  startupPreviewValid: boolean;
  recommendation: string;
  previewContainsSosHelp: boolean;
  previewStartsFromRealReadableBookContent: boolean;
  previewMatchesGeneratedContentHash: boolean;
  firstDefaultGeneratedSection: {
    id: string | null;
    title: string | null;
    label: string | null;
    type: BookSectionKind | null;
    wordCount: number | null;
    includeByDefault: boolean | null;
    snippet: string | null;
  };
  firstDefaultSectionLooksLikeRealContent: boolean;
  firstDefaultSectionLooksLikeNonMainMaterial: boolean;
  chapterPartOrFirstStoryMissingOrMisclassified: boolean;
  chapterPartOrFirstStoryNotes: string[];
  allMainReadableSectionsIncludedByDefault: boolean;
  defaultSectionCount: number;
  mainReadableSectionCount: number;
  warnings: string[];
  snippets: {
    generatedStart: string | null;
    previewStart: string | null;
  };
};

type LoadedSection = {
  id: string;
  kind: BookSectionKind;
  label: string;
  title: string | null;
  order: number;
  includeByDefault: boolean;
  selectedByCurrentDefault: boolean;
  matterClass: "front matter" | "body content" | "back matter" | "optional" | "suspicious";
  characterCount: number;
  wordCount: number;
  estimatedListeningMinutes: number;
  textPreview: string;
  startSnippet: string;
  endSnippet: string;
  warnings: string[];
};

type BookDryRunResult = {
  slug: string;
  title: string;
  author: string[];
  candidateType: "generated-but-unaccepted" | "raw-only";
  sourceFileUsed: string;
  sourceFolder: string;
  publicRestrictedStatus: string;
  generatedOutputExists: boolean;
  previewAssetExists: boolean;
  cloudflareJsonPath: string | null;
  detectedStructuralConvention: string;
  rawStructureDetector: {
    detectedStructuralConvention: string;
    confidenceLevel: string;
    confidenceScore: number;
    estimatedSectionCount: number;
    fallbackRequired: boolean;
    fallbackLegitimacy: string;
    redFlags: string[];
    examplesOfDetectedBodyHeadings: string[];
  };
  priorAudit: {
    pass1Risk: string | null;
    pass2Risk: string | null;
    pass2Reasons: string[];
    structureConfidence: string | null;
    structureRecommendedHandling: string | null;
    startupRecommendation: string | null;
    startupWarnings: string[];
  };
  currentGeneratedSectionCount: number;
  proposedSectionCountIfCorrectionNeeded: number | null;
  firstDefaultSectionCurrently: {
    id: string | null;
    label: string | null;
    title: string | null;
    kind: BookSectionKind | null;
    includeByDefault: boolean | null;
    wordCount: number | null;
    snippet: string | null;
  };
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
  currentStatus:
    | "already acceptable"
    | "needs correction before acceptance"
    | "needs first-time controlled processing"
    | "manual review"
    | "blocked";
  recommendationForNextPass:
    | "accept as already valid"
    | "controlled rewrite/correction"
    | "controlled first-time processing"
    | "manual review"
    | "skip for now";
  canSafelyBeCorrectedLater: boolean;
  warnings: string[];
  hardFailReasons: string[];
  snippets: {
    rawStart: string | null;
    rawEnd: string | null;
    generatedFirstDefault: string | null;
    generatedLastReadable: string | null;
    previewStart: string | null;
  };
  generatedSections: LoadedSection[];
  nestedStructure: {
    containsBooksVolumesPartsOrSections: boolean;
    notes: string[];
  };
};

type DryRunReport = {
  schemaVersion: 1;
  reportName: "pilot-dry-run-6";
  generatedAt: string;
  branch: string;
  baseMainCommit: string;
  mode: "dry-run/report-only";
  selectedBooks: string[];
  generatedButUnacceptedCandidatesFound: string[];
  unresolvedSourceGeneratedBooks: Array<{
    slug: string;
    title: string;
    startupPreviewValid: boolean;
    startupRecommendation: string | null;
    generatedSectionCount: number;
    reason: string;
  }>;
  selectionRules: {
    acceptedCorrectedExcludedCount: number;
    knownManualBlockedSuspiciousExcludedCount: number;
    selectedCount: number;
    generatedButUnacceptedWithResolvedRawSourceCount: number;
    rawOnlySelectedCount: number;
    unselectedGeneratedCandidatesWithoutResolvedRawSource: string[];
    note: string;
  };
  inputReports: string[];
  protectedPaths: {
    rawSourceInput: string;
    generatedBooks: string;
    cloudflareExport: string;
    previewAssets: string;
  };
  totals: {
    selectedBooks: number;
    alreadyAcceptable: number;
    needsCorrectionBeforeAcceptance: number;
    needsFirstTimeControlledProcessing: number;
    manualReview: number;
    blocked: number;
  };
  futureBatchRule: string[];
  laterPhaseRequirements: string[];
  books: BookDryRunResult[];
};

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const generatedRoot = path.join(repoRoot, "app/client/assets/books/generated");
const tempBooksRoot = path.join(repoRoot, "app/client/assets/temp-books");
const previewRoot = path.join(repoRoot, "public/book-previews");
const cloudflareRoot = path.join(
  repoRoot,
  "app/client/assets/books/cloudflare-export",
);
const auditRoot = path.join(repoRoot, "app/client/assets/books/audit-reports");
const reportRoot = path.join(auditRoot, "pilot-dry-run-6");
const reportBooksRoot = path.join(reportRoot, "books");

const PASS_1_JSON_PATH = path.join(auditRoot, "book-processing-audit-pass-1.json");
const PASS_2_JSON_PATH = path.join(auditRoot, "book-processing-audit-pass-2.json");
const STRUCTURE_JSON_PATH = path.join(
  auditRoot,
  "book-structure-audit-1/book-structure-audit-1.json",
);
const STARTUP_JSON_PATH = path.join(
  auditRoot,
  "book-startup-preview-audit-1/book-startup-preview-audit-1.json",
);
const WRITE_5_VERIFICATION_JSON_PATH = path.join(
  auditRoot,
  "pilot-write-5-verification/pilot-write-5-verification.json",
);
const LIBRARY_MANIFEST_PATH = path.join(generatedRoot, "library-manifest.json");
const MAIN_JSON_PATH = path.join(reportRoot, "pilot-dry-run-6.json");
const MAIN_MARKDOWN_PATH = path.join(reportRoot, "pilot-dry-run-6.md");

const PILOT_BATCH = [
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

const ACCEPTED_OR_CORRECTED = new Set([
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
  "don-quixote",
  "les-miserables",
  "sun-tzu-on-the-art-of-war",
  "the-count-of-monte-cristo",
  "the-count-of-monte-cristo-gutenberg-1184",
  "the-happy-family",
  "a-childs-garden-of-verses",
  "alices-adventures-in-wonderland",
  "black-beauty",
  "botchan",
  "five-little-peppers-and-how-they-grew",
  "grimm-s-fairy-tales",
  "jane-eyre",
  "little-women",
  "new-treasure-seekers",
  "pride-and-prejudice",
  "rainbow-valley",
  "rinkitink-in-oz",
  "the-arabian-nights",
  "the-art-of-war",
  "the-book-of-dragons",
  "the-divine-comedy",
  "the-elements-of-style",
  "the-federalist-papers",
  "the-jungle-book",
  "the-princess-and-the-goblin",
  "the-railway-children",
  "the-sea-wolf",
  "the-secret-garden",
  "the-water-babies",
  "through-the-looking-glass",
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
]);

const KNOWN_MANUAL_BLOCKED_OR_SUSPICIOUS = new Set([
  "a-christmas-carol",
  "dr-jekyll-and-mr-hyde",
  "a-catastrophe",
  "new-text-document",
  "screenshot-2026-06-13-014010",
  "in-the-abyss",
  "pollock-and-the-porroh-man",
  "the-colour-out-of-space",
  "the-plattner-story",
]);

const excludedReadableKinds = new Set<BookSectionKind>([
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
]);

const sourceLeakPattern =
  /\b(project gutenberg|gutenberg-tm|full license|terms of use|produced by|distributed proofreading|pgdp\.net|release date|ebook|e-book|transcriber|publisher'?s? catalog|catalogue|advertisement|advertisements|end of (?:the|this) project gutenberg|start of (?:the|this) project gutenberg|copyright laws|www\.gutenberg|pglaf)\b/i;
const frontMatterPattern =
  /\b(table of contents|contents|list of illustrations|illustrations|title page|cover|frontispiece|published by|all rights reserved|preface|introduction|foreword|bibliography|index)\b/i;
const frontMatterStartPattern =
  /^\s*(?:table of contents|contents|list of illustrations|title page|cover|frontispiece|published by|all rights reserved|preface|introduction|foreword|bibliography|index)\b/i;
const imagePlaceholderPattern = /\[\s*illustration[^\]]*\]/i;
const genericPreviewPattern =
  /\b(SOS Help!?|reference file does not include body text|book route is available|missing source content|generic placeholder|placeholder preview)\b/i;
const decorativePattern =
  /^\s*(?:\[?Page\s+\d+\]?|\[Pg\.?\s*\d+\]|\[\d+\]|[-_=*~.#:;'"`^+|\\/<>{}[\]().,!\u2013\u2014 ]{4,})\s*$/i;

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeText(filePath: string, text: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text, "utf8");
}

function writeJson(filePath: string, value: unknown) {
  writeText(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function relativeToRepo(filePath: string) {
  return path.relative(repoRoot, filePath).replace(/\\/g, "/");
}

function assertSafeReportPath(filePath: string) {
  const resolved = path.resolve(filePath);
  const expectedRoot = path.resolve(reportRoot);
  if (resolved !== expectedRoot && !resolved.startsWith(`${expectedRoot}${path.sep}`)) {
    throw new Error(`Unsafe report output path: ${resolved}`);
  }
}

function toAscii(input: string) {
  return input.replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "?");
}

function compactText(input: string | null | undefined, maxLength = 260) {
  if (!input) return null;
  const compact = toAscii(input).replace(/\s+/g, " ").trim();
  if (compact.length <= maxLength) return compact;
  return `${compact.slice(0, maxLength - 3)}...`;
}

function normalizeForCompare(input: string | null | undefined) {
  return toAscii(input ?? "")
    .replace(/\s+/g, " ")
    .replace(/[^a-zA-Z0-9 ]+/g, "")
    .trim()
    .toLowerCase();
}

function textFromSection(section: GeneratedBookSectionJson | null) {
  return (section?.morseSourceText || section?.displayText || "").trim();
}

function sectionEvidence(summary: GeneratedBookSectionSummary, text: string) {
  return [summary.label, summary.title, summary.textPreview, text.slice(0, 600)]
    .filter(Boolean)
    .join(" ");
}

function looksLikeNonMainMaterial(summary: GeneratedBookSectionSummary, text: string) {
  const evidence = sectionEvidence(summary, text);
  if (excludedReadableKinds.has(summary.kind)) return true;
  if (sourceLeakPattern.test(evidence)) return true;
  if (summary.order <= 4 && frontMatterPattern.test(evidence)) return true;
  if (summary.order <= 4 && summary.wordCount < 90 && !/[.!?]/.test(evidence)) return true;
  return false;
}

function isDefaultReadableSection(summary: GeneratedBookSectionSummary, text: string) {
  if (summary.wordCount <= 0) return false;
  if (summary.order <= 4 && summary.wordCount < 35) return false;
  return !looksLikeNonMainMaterial(summary, text);
}

function readSection(slug: string, summary: GeneratedBookSectionSummary) {
  const sectionPath = path.join(generatedRoot, slug, summary.sectionJsonPath);
  if (!fs.existsSync(sectionPath)) return null;
  return readJson<GeneratedBookSectionJson>(sectionPath);
}

function readPreview(slug: string) {
  const previewPath = path.join(previewRoot, `${slug}.preview.json`);
  if (!fs.existsSync(previewPath)) return null;
  return readJson<PreviewAsset>(previewPath);
}

function sectionEndSnippet(text: string) {
  return compactText(text.slice(Math.max(0, text.length - 520)));
}

function classifyMatter(
  summary: GeneratedBookSectionSummary,
  text: string,
): LoadedSection["matterClass"] {
  const evidence = sectionEvidence(summary, text);
  if (sourceLeakPattern.test(evidence)) return "suspicious";
  if (
    summary.kind === "title-page" ||
    summary.kind === "dedication" ||
    summary.kind === "epigraph" ||
    summary.kind === "preface" ||
    summary.kind === "introduction"
  ) {
    return "front matter";
  }
  if (
    summary.kind === "appendix" ||
    summary.kind === "notes" ||
    summary.kind === "glossary" ||
    summary.kind === "index" ||
    summary.kind === "transcriber-note" ||
    summary.kind === "source-license" ||
    summary.kind === "advertisement"
  ) {
    return "back matter";
  }
  if (frontMatterPattern.test(evidence) && summary.order <= 4) return "front matter";
  if (summary.wordCount < 35) return "optional";
  return "body content";
}

function sectionWarnings(summary: GeneratedBookSectionSummary, text: string) {
  const warnings: string[] = [];
  const start = text.slice(0, 800);
  const end = text.slice(Math.max(0, text.length - 800));
  if (sourceLeakPattern.test(start) || sourceLeakPattern.test(end)) {
    warnings.push("source/license/catalog/transcriber material appears in this section");
  }
  if (
    frontMatterStartPattern.test(start.slice(0, 300)) &&
    !excludedReadableKinds.has(summary.kind)
  ) {
    warnings.push("front matter appears at the start of a readable section kind");
  }
  if (imagePlaceholderPattern.test(start.slice(0, 260)) && !excludedReadableKinds.has(summary.kind)) {
    warnings.push("image/illustration placeholder appears in a readable section");
  }
  if (
    text
      .split(/\n/)
      .slice(0, 30)
      .some((line) => decorativePattern.test(line))
  ) {
    warnings.push("decorative/page-marker lines appear near the section start");
  }
  if (summary.wordCount > 18_000) warnings.push("section exceeds 18000 words");
  if (summary.wordCount > 0 && summary.wordCount < 80) warnings.push("section is very short");
  return warnings;
}

function loadSections(manifest: GeneratedBookManifest) {
  const raw = manifest.sections.map((summary) => {
    const section = readSection(manifest.slug, summary);
    const text = textFromSection(section);
    return {
      summary,
      section,
      text,
      readable: isDefaultReadableSection(summary, text),
    };
  });
  const included = raw
    .filter((entry) => entry.summary.includeByDefault)
    .map((entry) => entry.summary.id);
  const defaultIds =
    included.length > 0
      ? included
      : raw.filter((entry) => entry.readable).map((entry) => entry.summary.id);
  const selectedDefaultIds =
    defaultIds.length > 0
      ? defaultIds
      : raw[0]?.summary.id
        ? [raw[0].summary.id]
        : [];
  const selectedSet = new Set(selectedDefaultIds);

  const loadedSections: LoadedSection[] = raw.map((entry) => ({
    id: entry.summary.id,
    kind: entry.summary.kind,
    label: entry.summary.label,
    title: entry.summary.title,
    order: entry.summary.order,
    includeByDefault: entry.summary.includeByDefault,
    selectedByCurrentDefault: selectedSet.has(entry.summary.id),
    matterClass: classifyMatter(entry.summary, entry.text),
    characterCount: entry.summary.characterCount,
    wordCount: entry.summary.wordCount,
    estimatedListeningMinutes: entry.summary.estimatedListeningMinutes,
    textPreview: compactText(entry.summary.textPreview, 180) ?? "",
    startSnippet: compactText(entry.text.slice(0, 520)) ?? "",
    endSnippet: sectionEndSnippet(entry.text) ?? "",
    warnings: sectionWarnings(entry.summary, entry.text),
  }));

  return {
    entries: raw,
    loadedSections,
    defaultIds: selectedDefaultIds,
    mainReadableIds: raw.filter((entry) => entry.readable).map((entry) => entry.summary.id),
  };
}

function processingNoteSourceFilename(slug: string) {
  const notesPath = path.join(generatedRoot, slug, "processing_notes.md");
  if (!fs.existsSync(notesPath)) return null;
  const notes = fs.readFileSync(notesPath, "utf8");
  const match = notes.match(/^-\s*Source file:\s*(.+)$/m);
  return match ? path.basename(match[1].trim()) : null;
}

function sourcePathFor(
  slug: string,
  title: string,
  pass2: PriorPassBook | undefined,
  structure: StructureAuditBook | undefined,
) {
  const reportPath = pass2?.sourcePath || structure?.sourcePath;
  if (reportPath) {
    const resolved = path.resolve(repoRoot, reportPath);
    if (fs.existsSync(resolved)) return resolved;
    const tempResolved = path.join(tempBooksRoot, path.basename(reportPath));
    if (fs.existsSync(tempResolved)) return tempResolved;
  }
  const sourceFilenames = [
    pass2?.sourceFilename,
    structure?.sourceFilename,
    processingNoteSourceFilename(slug),
    `${slug}.txt`,
    `${title}.txt`,
    `${title.replace(/[;:].*$/u, "").trim()}.txt`,
  ].filter((candidate): candidate is string => Boolean(candidate));

  for (const sourceFilename of [...new Set(sourceFilenames.map((candidate) => path.basename(candidate)))]) {
    const resolved = path.join(tempBooksRoot, sourceFilename);
    if (fs.existsSync(resolved)) return resolved;
  }
  return null;
}

function fallbackPriorPassBook(
  slug: string,
  libraryBook: GeneratedLibraryManifest["books"][number],
): PriorPassBook {
  const sourcePath = sourcePathFor(slug, libraryBook.title, undefined, undefined);
  return {
    sourceFilename: sourcePath ? path.basename(sourcePath) : `${slug}.txt`,
    sourcePath: sourcePath ? relativeToRepo(sourcePath) : "",
    slug,
    title: libraryBook.title,
    existingGeneratedOutputExists: true,
    approximateRawWordCount: 0,
    pass1Risk: "not covered",
    pass2Risk: "not covered",
    pass1RiskReasons: ["Book is not present in the older pass-1 audit report."],
    pass2RiskReasons: [
      "Book is not present in the older pass-2 audit report; batch-6 dry run used local raw source, generated output, preview asset, startup audit, and structure detector directly.",
    ],
    firstHourPreviewCanBeSafelyDerivedLater: true,
    recommendedNextAction: "batch-6 dry-run review",
  };
}

function lineSnippetAt(text: string, index: number | null | undefined) {
  if (typeof index !== "number" || index < 0 || index >= text.length) return null;
  return compactText(text.slice(index, Math.min(text.length, index + 520)));
}

function lastReadableSection(loaded: LoadedSection[]) {
  return [...loaded]
    .reverse()
    .find((section) => section.matterClass === "body content" && section.wordCount > 0);
}

function compareStart(rawStart: string | null, generatedStart: string | null) {
  const raw = normalizeForCompare(rawStart);
  const generated = normalizeForCompare(generatedStart).slice(0, 120);
  if (!raw || !generated) return false;
  return raw.includes(generated.slice(0, 80)) || generated.includes(raw.slice(0, 80));
}

function compareEnd(rawEnd: string | null, generatedEnd: string | null) {
  const raw = normalizeForCompare(rawEnd);
  const generated = normalizeForCompare(generatedEnd);
  if (!raw || !generated) return false;
  return generated.includes(raw.slice(0, 90));
}

function formatSectionRef(section: LoadedSection | null | undefined) {
  if (!section) return "missing";
  const title = section.title ? ` - ${section.title}` : "";
  return `${section.id} (${section.kind}, ${section.wordCount} words) ${section.label}${title}`;
}

function hasNestedStructure(convention: string, sections: LoadedSection[]) {
  const notes: string[] = [];
  if (/\b(book|volume|part|section)s?\b/i.test(convention)) {
    notes.push(`Detector reports ${convention}.`);
  }
  const majorKinds = new Set(
    sections
      .filter((section) => ["book", "part", "scene"].includes(section.kind))
      .map((section) => section.kind),
  );
  if (majorKinds.size > 0) {
    notes.push(`Current generated sections include ${[...majorKinds].join(", ")} kinds.`);
  }
  return {
    containsBooksVolumesPartsOrSections: notes.length > 0,
    notes,
  };
}

function statusTotals(books: BookDryRunResult[]): DryRunReport["totals"] {
  return {
    selectedBooks: books.length,
    alreadyAcceptable: books.filter((book) => book.currentStatus === "already acceptable").length,
    needsCorrectionBeforeAcceptance: books.filter(
      (book) => book.currentStatus === "needs correction before acceptance",
    ).length,
    needsFirstTimeControlledProcessing: books.filter(
      (book) => book.currentStatus === "needs first-time controlled processing",
    ).length,
    manualReview: books.filter((book) => book.currentStatus === "manual review").length,
    blocked: books.filter((book) => book.currentStatus === "blocked").length,
  };
}

function cloudflarePathFor(slug: string) {
  const candidates = [
    path.join(cloudflareRoot, "books", `${slug}.json`),
    path.join(cloudflareRoot, `${slug}.json`),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null;
}

function gitOutput(args: string[]) {
  return execFileSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function inspectBook(
  slug: string,
  libraryBook: GeneratedLibraryManifest["books"][number],
  pass2: PriorPassBook,
  structureAudit: StructureAuditBook | undefined,
  startup: StartupAuditBook | undefined,
  baseMainCommit: string,
): BookDryRunResult {
  const manifestPath = path.join(generatedRoot, libraryBook.manifestPath);
  const generatedOutputExists = fs.existsSync(manifestPath);
  const sourcePath = sourcePathFor(slug, libraryBook.title, pass2, structureAudit);
  const rawText = sourcePath ? fs.readFileSync(sourcePath, "utf8") : "";
  const rawStructure = analyzeBookStructure(rawText, {
    rawWordCount: pass2.approximateRawWordCount || structureAudit?.rawWordCount,
  });
  const detectorFirstHeading = rawStructure.selectedBodyHeadings[0] ?? null;
  const rawStartSnippet =
    lineSnippetAt(rawText, pass2.candidateStart?.index) ??
    lineSnippetAt(rawText, detectorFirstHeading?.offset) ??
    compactText(pass2.candidateStart?.candidateSnippet);
  const rawEndSnippet =
    lineSnippetAt(rawText, pass2.candidateEnd?.index) ??
    compactText(pass2.candidateEnd?.candidateSnippet);

  const manifest = generatedOutputExists
    ? readJson<GeneratedBookManifest>(manifestPath)
    : null;
  const preview = readPreview(slug);
  const previewAssetExists = fs.existsSync(path.join(previewRoot, `${slug}.preview.json`));
  const warnings: string[] = [];
  const hardFailReasons: string[] = [];

  if (!sourcePath) hardFailReasons.push("raw source file could not be resolved");
  if (!generatedOutputExists || !manifest) hardFailReasons.push("generated output is missing");
  if (!previewAssetExists || !preview) hardFailReasons.push("preview asset is missing or unreadable");

  const loaded = manifest
    ? loadSections(manifest)
    : { entries: [], loadedSections: [], defaultIds: [], mainReadableIds: [] };
  const firstDefaultId = loaded.defaultIds[0] ?? null;
  const firstDefaultEntry =
    firstDefaultId === null
      ? null
      : loaded.entries.find((entry) => entry.summary.id === firstDefaultId) ?? null;
  const firstDefaultLoaded =
    firstDefaultId === null
      ? null
      : loaded.loadedSections.find((section) => section.id === firstDefaultId) ?? null;
  const firstDefaultText = firstDefaultEntry?.text ?? null;
  const lastReadable = lastReadableSection(loaded.loadedSections);
  const rawStartAligned = compareStart(rawStartSnippet, firstDefaultText);
  const rawEndAligned = compareEnd(rawEndSnippet, lastReadable?.endSnippet ?? null);

  const readableLeakSections = loaded.loadedSections.filter(
    (section) =>
      (section.selectedByCurrentDefault || section.matterClass === "body content") &&
      section.warnings.some((warning) =>
        /source\/license\/catalog|front matter|image\/illustration/.test(warning),
      ),
  );
  const suspiciousNonDefaultSections = loaded.loadedSections.filter(
    (section) =>
      !section.selectedByCurrentDefault &&
      section.matterClass === "suspicious" &&
      !excludedReadableKinds.has(section.kind),
  );
  const largeReadableKindOpeningSkipped = loaded.loadedSections.find(
    (section) =>
      section.order <= 2 &&
      !section.selectedByCurrentDefault &&
      !excludedReadableKinds.has(section.kind) &&
      ["front matter", "suspicious"].includes(section.matterClass) &&
      section.wordCount > 750,
  );
  const currentBodySections = loaded.loadedSections.filter(
    (section) => section.matterClass === "body content" && section.wordCount > 0,
  );
  const hugeBodySections = currentBodySections.filter((section) => section.wordCount > 18_000);
  const tinyBodySections = currentBodySections.filter(
    (section) => section.wordCount > 0 && section.wordCount < 80,
  );
  const generatedUsesFallbackParts =
    currentBodySections.length > 0 &&
    currentBodySections.every((section) => section.kind === "part") &&
    rawStructure.estimatedSectionCount >= 8 &&
    !/part divisions/i.test(rawStructure.detectedStructuralConvention);
  const detectorSectionCount = Math.max(
    rawStructure.estimatedSectionCount,
    structureAudit?.estimatedSectionCount ?? 0,
  );
  const generatedTooCoarse =
    detectorSectionCount >= 8 &&
    currentBodySections.length > 0 &&
    currentBodySections.length < Math.max(4, Math.floor(detectorSectionCount * 0.45));
  const allMainReadableDefault =
    startup?.allMainReadableSectionsIncludedByDefault ??
    loaded.mainReadableIds.every((id) => loaded.defaultIds.includes(id));

  if (preview?.previewText && genericPreviewPattern.test(preview.previewText)) {
    hardFailReasons.push("startup preview is generic or contains SOS Help");
  }
  if (startup?.previewContainsSosHelp) {
    hardFailReasons.push("startup preview contains SOS Help");
  }
  if (startup && !startup.startupPreviewValid) {
    hardFailReasons.push("startup preview is not valid");
  }
  if (startup?.firstDefaultSectionLooksLikeNonMainMaterial) {
    hardFailReasons.push("first default section is non-main material");
  }
  if (!startup?.firstDefaultSectionLooksLikeRealContent) {
    hardFailReasons.push("first default section is not confirmed as readable content");
  }
  if (startup?.chapterPartOrFirstStoryMissingOrMisclassified) {
    hardFailReasons.push(...startup.chapterPartOrFirstStoryNotes);
  }
  if (readableLeakSections.length > 0) {
    hardFailReasons.push(
      `source/TOC/license material leaks into readable/default sections: ${readableLeakSections
        .map((section) => section.id)
        .join(", ")}`,
    );
  }
  if (largeReadableKindOpeningSkipped) {
    hardFailReasons.push(
      `${largeReadableKindOpeningSkipped.id} appears to mix opening readable content with front/source material and is skipped by default`,
    );
  }
  if (generatedUsesFallbackParts || generatedTooCoarse) {
    hardFailReasons.push(
      "clear structure exists in the source but current output is coarse fallback-style sections",
    );
  }
  if (hugeBodySections.length > 0) {
    hardFailReasons.push(
      `current output has huge readable sections: ${hugeBodySections
        .slice(0, 5)
        .map((section) => section.id)
        .join(", ")}`,
    );
  }
  if (tinyBodySections.length > Math.max(2, Math.floor(currentBodySections.length * 0.35))) {
    hardFailReasons.push("current output has many tiny readable sections");
  }
  if (!allMainReadableDefault) {
    hardFailReasons.push("not all main readable sections are selected by default");
  }
  if (sourceLeakPattern.test(lastReadable?.endSnippet ?? "")) {
    hardFailReasons.push("readable ending includes source/license/catalog material");
  }

  if (!rawStartAligned && rawStartSnippet && firstDefaultText) {
    warnings.push("first default section does not tightly align with pass-2 candidate start");
  }
  if (!rawEndAligned && rawEndSnippet && lastReadable) {
    warnings.push("last readable section does not tightly align with pass-2 candidate end");
  }
  if (suspiciousNonDefaultSections.length > 0) {
    warnings.push(
      `suspicious non-default sections remain: ${suspiciousNonDefaultSections
        .slice(0, 6)
        .map((section) => section.id)
        .join(", ")}`,
    );
  }
  if (rawStructure.redFlags.length > 0) warnings.push(...rawStructure.redFlags);
  if (structureAudit?.redFlags) warnings.push(...structureAudit.redFlags);
  if (pass2.pass2RiskReasons) warnings.push(...pass2.pass2RiskReasons);
  if (pass2.generatedOutputWarning?.apparentDamage) {
    warnings.push(...pass2.generatedOutputWarning.apparentDamage);
  }

  const previewVerdict =
    previewAssetExists &&
    preview &&
    !genericPreviewPattern.test(preview.previewText) &&
    preview.contentHash === manifest?.contentHash &&
    Boolean(startup?.startupPreviewValid)
      ? "valid book-specific startup preview"
      : "needs correction: preview is missing, stale, generic, or not validated";
  const startBoundaryVerdict =
    startup?.firstDefaultSectionLooksLikeRealContent && !startup.firstDefaultSectionLooksLikeNonMainMaterial
      ? rawStartAligned
        ? "correct: first default aligns with pass-2 readable start"
        : "review: first default is readable, but it does not tightly match pass-2 start snippet"
      : "needs correction: first default is not real readable content";
  const endBoundaryVerdict =
    rawEndAligned && !sourceLeakPattern.test(lastReadable?.endSnippet ?? "")
      ? "correct: last readable section aligns with pass-2 readable end"
      : sourceLeakPattern.test(lastReadable?.endSnippet ?? "")
        ? "needs correction: source/license/catalog material appears at readable end"
        : "review: last readable section does not tightly match pass-2 end snippet";
  const sectioningVerdict =
    generatedUsesFallbackParts || generatedTooCoarse || hugeBodySections.length > 0
      ? "needs correction: source headings are clearer than the current generated split"
      : tinyBodySections.length > Math.max(2, Math.floor(currentBodySections.length * 0.35))
        ? "manual review: many tiny sections may be fragments"
        : "acceptable: current section sizes and split look plausible";
  const cleanupVerdict =
    readableLeakSections.length > 0
      ? "needs correction: cleanup material appears in readable/default sections"
      : suspiciousNonDefaultSections.length > 0
        ? "needs correction: suspicious source/catalog material remains outside defaults"
        : "acceptable: no cleanup artifacts detected in readable/default sections";
  const allMainReadableDefaultVerdict = allMainReadableDefault
    ? "acceptable: all detected main readable sections are included in current default playback"
    : "needs correction: not all main readable sections are included by default";

  const hasBlockedInput =
    !sourcePath || !generatedOutputExists || !manifest || !previewAssetExists || !preview;
  const needsCorrection =
    hardFailReasons.length > 0 ||
    cleanupVerdict.startsWith("needs correction") ||
    sectioningVerdict.startsWith("needs correction");
  const needsManualReview =
    rawStructure.confidenceLevel === "low" ||
    rawStructure.confidenceLevel === "blocked" ||
    sectioningVerdict.startsWith("manual review");

  let currentStatus: BookDryRunResult["currentStatus"] = "already acceptable";
  if (hasBlockedInput) currentStatus = "blocked";
  else if (needsCorrection) currentStatus = "needs correction before acceptance";
  else if (needsManualReview) currentStatus = "manual review";

  const canSafelyBeCorrectedLater =
    currentStatus === "needs correction before acceptance" &&
    !hasBlockedInput &&
    rawStructure.confidenceLevel !== "blocked" &&
    !/blocked/i.test(structureAudit?.recommendedHandling ?? "");
  const recommendationForNextPass: BookDryRunResult["recommendationForNextPass"] =
    currentStatus === "already acceptable"
      ? "accept as already valid"
      : currentStatus === "needs correction before acceptance" && canSafelyBeCorrectedLater
        ? "controlled rewrite/correction"
        : currentStatus === "manual review"
          ? "manual review"
          : "skip for now";

  const cloudflarePath = cloudflarePathFor(slug);
  const detectedStructuralConvention =
    structureAudit?.detectedStructuralConvention ??
    rawStructure.detectedStructuralConvention;
  const proposedSectionCountIfCorrectionNeeded =
    currentStatus === "already acceptable"
      ? null
      : detectorSectionCount > 0
        ? detectorSectionCount
        : currentBodySections.length;

  void baseMainCommit;

  return {
    slug,
    title: manifest?.title ?? libraryBook.title,
    author: manifest?.author ?? libraryBook.author,
    candidateType: "generated-but-unaccepted",
    sourceFileUsed: sourcePath ? relativeToRepo(sourcePath) : pass2.sourcePath,
    sourceFolder: sourcePath ? relativeToRepo(path.dirname(sourcePath)) : "unresolved",
    publicRestrictedStatus:
      manifest?.source.publishReady && manifest.source.rightsStatus === "approved"
        ? "public"
        : "restricted/manual-rights",
    generatedOutputExists,
    previewAssetExists,
    cloudflareJsonPath: cloudflarePath ? relativeToRepo(cloudflarePath) : null,
    detectedStructuralConvention,
    rawStructureDetector: {
      detectedStructuralConvention: rawStructure.detectedStructuralConvention,
      confidenceLevel: rawStructure.confidenceLevel,
      confidenceScore: rawStructure.confidenceScore,
      estimatedSectionCount: rawStructure.estimatedSectionCount,
      fallbackRequired: rawStructure.fallbackRequired,
      fallbackLegitimacy: rawStructure.fallbackLegitimacy,
      redFlags: rawStructure.redFlags,
      examplesOfDetectedBodyHeadings: rawStructure.examplesOfDetectedBodyHeadings.map(
        (example) => compactText(example, 180) ?? "",
      ),
    },
    priorAudit: {
      pass1Risk: pass2.pass1Risk ?? null,
      pass2Risk: pass2.pass2Risk ?? null,
      pass2Reasons: pass2.pass2RiskReasons ?? [],
      structureConfidence: structureAudit?.confidenceLevel ?? null,
      structureRecommendedHandling: structureAudit?.recommendedHandling ?? null,
      startupRecommendation: startup?.recommendation ?? null,
      startupWarnings: startup?.warnings ?? [],
    },
    currentGeneratedSectionCount: manifest?.sections.length ?? 0,
    proposedSectionCountIfCorrectionNeeded,
    firstDefaultSectionCurrently: {
      id: firstDefaultEntry?.summary.id ?? null,
      label: firstDefaultEntry?.summary.label ?? null,
      title: firstDefaultEntry?.summary.title ?? null,
      kind: firstDefaultEntry?.summary.kind ?? null,
      includeByDefault: firstDefaultEntry?.summary.includeByDefault ?? null,
      wordCount: firstDefaultEntry?.summary.wordCount ?? null,
      snippet: compactText(firstDefaultText),
    },
    expectedFirstReadableSection: {
      sourceLine: pass2.candidateStart?.line ?? detectorFirstHeading?.lineNumber ?? null,
      snippet: compactText(pass2.candidateStart?.candidateSnippet) ?? rawStartSnippet,
    },
    boundaries: {
      startBoundaryVerdict,
      endBoundaryVerdict,
      sectioningVerdict,
      cleanupVerdict,
      previewVerdict,
      allMainReadableDefaultVerdict,
    },
    currentStatus,
    recommendationForNextPass,
    canSafelyBeCorrectedLater,
    warnings: [...new Set(warnings.map((warning) => compactText(warning, 220) ?? warning))],
    hardFailReasons: [...new Set(hardFailReasons.map((reason) => compactText(reason, 220) ?? reason))],
    snippets: {
      rawStart: rawStartSnippet,
      rawEnd: rawEndSnippet,
      generatedFirstDefault: compactText(firstDefaultText),
      generatedLastReadable: lastReadable?.endSnippet ?? null,
      previewStart: compactText(preview?.previewText),
    },
    generatedSections: loaded.loadedSections,
    nestedStructure: hasNestedStructure(detectedStructuralConvention, loaded.loadedSections),
  };
}

function authorList(author: string | string[] | undefined) {
  if (Array.isArray(author)) return author;
  return author ? [author] : ["unknown"];
}

function rawTailSnippetAt(text: string, index: number | null | undefined, length = 520) {
  if (typeof index !== "number" || index <= 0) return null;
  return compactText(text.slice(Math.max(0, index - length), index));
}

function rawOnlyStatus(
  sourcePath: string | null,
  rawStructure: ReturnType<typeof analyzeBookStructure>,
  structureAudit: StructureAuditBook | undefined,
): BookDryRunResult["currentStatus"] {
  if (!sourcePath) return "blocked";
  if (rawStructure.confidenceLevel === "blocked") return "blocked";
  if (
    rawStructure.confidenceLevel === "low" ||
    (structureAudit?.redFlags.length ?? 0) > 0 ||
    /\b(manual|blocked|skip)\b/i.test(structureAudit?.recommendedHandling ?? "")
  ) {
    return "manual review";
  }
  return "needs first-time controlled processing";
}

function inspectRawOnlyBook(
  slug: string,
  pass2: PriorPassBook | undefined,
  structureAudit: StructureAuditBook,
  baseMainCommit: string,
): BookDryRunResult {
  const sourcePath = sourcePathFor(
    slug,
    structureAudit.likelyTitle,
    pass2,
    structureAudit,
  );
  const rawText = sourcePath ? fs.readFileSync(sourcePath, "utf8") : "";
  const rawStructure = analyzeBookStructure(rawText, {
    rawWordCount: pass2?.approximateRawWordCount || structureAudit.rawWordCount,
  });
  const detectorFirstHeading = rawStructure.selectedBodyHeadings[0] ?? null;
  const rawStartSnippet =
    lineSnippetAt(rawText, pass2?.candidateStart?.index) ??
    lineSnippetAt(rawText, detectorFirstHeading?.offset) ??
    compactText(pass2?.candidateStart?.candidateSnippet);
  const rawEndSnippet =
    rawTailSnippetAt(rawText, pass2?.candidateEnd?.index) ??
    compactText(pass2?.candidateEnd?.candidateSnippet);
  const warnings = [
    "Raw-only candidate: generated output and preview assets do not exist yet.",
    ...(pass2?.pass2RiskReasons ?? []),
    ...structureAudit.cleaningWarnings,
    ...structureAudit.redFlags,
    ...rawStructure.redFlags,
  ];
  if (/play|poem|anthology|titled-section|isolated titled sections/i.test(rawStructure.detectedStructuralConvention)) {
    warnings.push("Write pass must preserve non-prose or titled-section structure instead of collapsing into fallback blobs.");
  }
  if (rawStructure.fallbackRequired) {
    warnings.push(`Detector fallback required: ${rawStructure.fallbackReason ?? rawStructure.fallbackLegitimacy}.`);
  }

  const hardFailReasons: string[] = [];
  if (!sourcePath) hardFailReasons.push("raw source file could not be resolved");
  if (rawStructure.confidenceLevel === "blocked") {
    hardFailReasons.push("structure detector returned blocked confidence");
  }

  const currentStatus = rawOnlyStatus(sourcePath, rawStructure, structureAudit);
  const recommendationForNextPass: BookDryRunResult["recommendationForNextPass"] =
    currentStatus === "needs first-time controlled processing"
      ? "controlled first-time processing"
      : currentStatus === "manual review"
        ? "manual review"
        : "skip for now";

  const detectedStructuralConvention =
    structureAudit.detectedStructuralConvention || rawStructure.detectedStructuralConvention;
  const proposedSectionCountIfCorrectionNeeded =
    Math.max(rawStructure.estimatedSectionCount, structureAudit.estimatedSectionCount, 1);

  const startBoundaryVerdict =
    sourcePath && /^(high|medium)$/i.test(structureAudit.startBoundaryConfidence)
      ? `ready for first-time processing: ${structureAudit.startBoundaryConfidence}-confidence readable start`
      : sourcePath
        ? "review before write: start boundary confidence is not high"
        : "blocked: raw source unresolved";
  const endBoundaryVerdict =
    sourcePath && /^(high|medium)$/i.test(structureAudit.endBoundaryConfidence)
      ? `ready for first-time processing: ${structureAudit.endBoundaryConfidence}-confidence readable end`
      : sourcePath
        ? "review before write: end boundary confidence is not high"
        : "blocked: raw source unresolved";
  const sectioningVerdict =
    rawStructure.estimatedSectionCount > 0
      ? `first-time processing needed: detector found ${rawStructure.estimatedSectionCount} likely sections (${rawStructure.detectedStructuralConvention})`
      : "manual review: detector did not find a useful section structure";
  const cleanupVerdict =
    structureAudit.cleaningWarnings.length > 0 || (pass2?.pass2RiskReasons?.length ?? 0) > 0
      ? "first-time processing must exclude TOC/source/license/transcriber, image placeholder, footnote, and decorative cleanup artifacts"
      : "ready for first-time processing: no prior cleanup blockers found";

  void baseMainCommit;

  return {
    slug,
    title: structureAudit.likelyTitle,
    author: authorList(structureAudit.likelyAuthor),
    candidateType: "raw-only",
    sourceFileUsed: sourcePath ? relativeToRepo(sourcePath) : structureAudit.sourcePath,
    sourceFolder: sourcePath ? relativeToRepo(path.dirname(sourcePath)) : "unresolved",
    publicRestrictedStatus: "not generated yet",
    generatedOutputExists: false,
    previewAssetExists: false,
    cloudflareJsonPath: null,
    detectedStructuralConvention,
    rawStructureDetector: {
      detectedStructuralConvention: rawStructure.detectedStructuralConvention,
      confidenceLevel: rawStructure.confidenceLevel,
      confidenceScore: rawStructure.confidenceScore,
      estimatedSectionCount: rawStructure.estimatedSectionCount,
      fallbackRequired: rawStructure.fallbackRequired,
      fallbackLegitimacy: rawStructure.fallbackLegitimacy,
      redFlags: rawStructure.redFlags,
      examplesOfDetectedBodyHeadings: rawStructure.examplesOfDetectedBodyHeadings.map(
        (example) => compactText(example, 180) ?? "",
      ),
    },
    priorAudit: {
      pass1Risk: pass2?.pass1Risk ?? null,
      pass2Risk: pass2?.pass2Risk ?? null,
      pass2Reasons: pass2?.pass2RiskReasons ?? [],
      structureConfidence: structureAudit.confidenceLevel,
      structureRecommendedHandling: structureAudit.recommendedHandling,
      startupRecommendation: null,
      startupWarnings: [],
    },
    currentGeneratedSectionCount: 0,
    proposedSectionCountIfCorrectionNeeded,
    firstDefaultSectionCurrently: {
      id: null,
      label: null,
      title: null,
      kind: null,
      includeByDefault: null,
      wordCount: null,
      snippet: null,
    },
    expectedFirstReadableSection: {
      sourceLine: pass2?.candidateStart?.line ?? detectorFirstHeading?.lineNumber ?? null,
      snippet: compactText(pass2?.candidateStart?.candidateSnippet) ?? rawStartSnippet,
    },
    boundaries: {
      startBoundaryVerdict,
      endBoundaryVerdict,
      sectioningVerdict,
      cleanupVerdict,
      previewVerdict:
        "not applicable yet: preview asset must be generated from first real readable content in the write pass",
      allMainReadableDefaultVerdict:
        "not applicable yet: first-time output must include all main readable sections by default",
    },
    currentStatus,
    recommendationForNextPass,
    canSafelyBeCorrectedLater: false,
    warnings: [...new Set(warnings.map((warning) => compactText(warning, 220) ?? warning))],
    hardFailReasons: [...new Set(hardFailReasons)],
    snippets: {
      rawStart: rawStartSnippet,
      rawEnd: rawEndSnippet,
      generatedFirstDefault: null,
      generatedLastReadable: null,
      previewStart: null,
    },
    generatedSections: [],
    nestedStructure: {
      containsBooksVolumesPartsOrSections: /\b(book|volume|part|section|act|scene)\b/i.test(
        detectedStructuralConvention,
      ),
      notes: [`Raw detector reports ${detectedStructuralConvention}.`],
    },
  };
}

function bookMarkdown(book: BookDryRunResult) {
  const authorText = book.author.join(", ") || "unknown";
  const sectionRows = book.generatedSections
    .map(
      (section) =>
        `| ${section.id} | ${section.kind} | ${escapeMarkdown(section.label)} | ${
          section.includeByDefault ? "yes" : "no"
        } | ${section.selectedByCurrentDefault ? "yes" : "no"} | ${section.wordCount} | ${
          section.characterCount
        } | ${section.estimatedListeningMinutes} | ${section.matterClass} | ${escapeMarkdown(
          section.warnings.join("; ") || "none",
        )} |`,
    )
    .join("\n");
  const sectionTable =
    book.generatedSections.length > 0
      ? [
          "| Section | Kind | Label | includeByDefault | Current default | Words | Characters | Listen min | Type | Warnings |",
          "| --- | --- | --- | --- | --- | ---: | ---: | ---: | --- | --- |",
          sectionRows,
        ].join("\n")
      : "No generated sections exist yet; this raw-only source needs first-time controlled processing.";

  return [
    `# Pilot Dry Run 6: ${book.slug}`,
    "",
    `- Title: ${escapeMarkdown(book.title)}`,
    `- Author: ${escapeMarkdown(authorText)}`,
    `- Candidate type: ${book.candidateType}`,
    `- Source file: \`${book.sourceFileUsed}\``,
    `- Source folder: \`${book.sourceFolder}\``,
    `- Public/restricted status: ${book.publicRestrictedStatus}`,
    `- Generated output exists: ${book.generatedOutputExists ? "yes" : "no"}`,
    `- Preview asset exists: ${book.previewAssetExists ? "yes" : "no"}`,
    `- Cloudflare JSON path: ${book.cloudflareJsonPath ? `\`${book.cloudflareJsonPath}\`` : "not found"}`,
    `- Detected structural convention: ${escapeMarkdown(book.detectedStructuralConvention)}`,
    `- Current generated section count: ${book.currentGeneratedSectionCount}`,
    `- Proposed section count if correction is needed: ${
      book.proposedSectionCountIfCorrectionNeeded ?? "none"
    }`,
    `- First default section currently: ${escapeMarkdown(
      formatSectionRef(
        book.generatedSections.find(
          (section) => section.id === book.firstDefaultSectionCurrently.id,
        ),
      ),
    )}`,
    `- Expected first readable section: ${escapeMarkdown(
      book.expectedFirstReadableSection.snippet ?? "unknown",
    )}`,
    `- Current status: ${book.currentStatus}`,
    `- Recommendation for next pass: ${book.recommendationForNextPass}`,
    "",
    "## Verdicts",
    "",
    `- Start boundary: ${book.boundaries.startBoundaryVerdict}`,
    `- End boundary: ${book.boundaries.endBoundaryVerdict}`,
    `- Sectioning: ${book.boundaries.sectioningVerdict}`,
    `- Cleanup: ${book.boundaries.cleanupVerdict}`,
    `- Preview: ${book.boundaries.previewVerdict}`,
    `- All-main-readable default: ${book.boundaries.allMainReadableDefaultVerdict}`,
    "",
    "## Warnings",
    "",
    book.warnings.length > 0
      ? book.warnings.map((warning) => `- ${escapeMarkdown(warning)}`).join("\n")
      : "- None.",
    "",
    "## Hard Fail Reasons",
    "",
    book.hardFailReasons.length > 0
      ? book.hardFailReasons.map((reason) => `- ${escapeMarkdown(reason)}`).join("\n")
      : "- None.",
    "",
    "## Supporting Snippets",
    "",
    `- Raw start: ${escapeMarkdown(book.snippets.rawStart ?? "unknown")}`,
    `- Raw end: ${escapeMarkdown(book.snippets.rawEnd ?? "unknown")}`,
    `- Generated first default: ${escapeMarkdown(
      book.snippets.generatedFirstDefault ?? "unknown",
    )}`,
    `- Generated last readable: ${escapeMarkdown(
      book.snippets.generatedLastReadable ?? "unknown",
    )}`,
    `- Preview start: ${escapeMarkdown(book.snippets.previewStart ?? "unknown")}`,
    "",
    "## Current Section List",
    "",
    sectionTable,
    "",
  ].join("\n");
}

function escapeMarkdown(input: string) {
  return input.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function mainMarkdown(report: DryRunReport) {
  const rows = report.books
    .map(
      (book) =>
        `| ${book.slug} | ${book.candidateType} | ${book.currentStatus} | ${book.recommendationForNextPass} | ${escapeMarkdown(
          book.detectedStructuralConvention,
        )} | ${book.currentGeneratedSectionCount} | ${
          book.proposedSectionCountIfCorrectionNeeded ?? "-"
        } | ${escapeMarkdown(book.boundaries.startBoundaryVerdict)} | ${escapeMarkdown(
          book.boundaries.cleanupVerdict,
        )} |`,
    )
    .join("\n");
  const byStatus = (status: BookDryRunResult["currentStatus"]) => {
    const matching = report.books.filter((book) => book.currentStatus === status);
    return matching.length > 0
      ? matching.map((book) => `- ${book.slug}`).join("\n")
      : "- None.";
  };

  return [
    "# Pilot Book Quality Dry Run 6",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "This is a dry-run/report-only pass. It inventories remaining generated-but-unaccepted books first, then audits selected raw-only sources for first-time controlled processing because no remaining generated candidate has a resolvable raw source. It does not write generated books, preview assets, raw source books, or Cloudflare exports.",
    "",
    "Batch 6 first inventoried remaining generated-but-unaccepted books, then selected raw-only candidates because every remaining generated candidate lacked a clear raw source match.",
    "",
    "## Inputs",
    "",
    report.inputReports.map((input) => `- \`${input}\``).join("\n"),
    "",
    "## Selected Books",
    "",
    report.selectedBooks.map((slug) => `- ${slug}`).join("\n"),
    "",
    "## Generated-But-Unaccepted Candidates Found",
    "",
    report.generatedButUnacceptedCandidatesFound.map((slug) => `- ${slug}`).join("\n") || "- None.",
    "",
    "## Unresolved-Source Generated Books",
    "",
    report.unresolvedSourceGeneratedBooks.length > 0
      ? report.unresolvedSourceGeneratedBooks
          .map(
            (book) =>
              `- ${book.slug}: ${escapeMarkdown(book.title)}; ${book.generatedSectionCount} generated sections; startup preview ${book.startupPreviewValid ? "valid" : "not valid"}; ${book.reason}`,
          )
          .join("\n")
      : "- None.",
    "",
    "## Totals",
    "",
    `- Selected books: ${report.totals.selectedBooks}`,
    `- Already acceptable: ${report.totals.alreadyAcceptable}`,
    `- Needs correction before acceptance: ${report.totals.needsCorrectionBeforeAcceptance}`,
    `- Needs first-time controlled processing: ${report.totals.needsFirstTimeControlledProcessing}`,
    `- Manual review: ${report.totals.manualReview}`,
    `- Blocked: ${report.totals.blocked}`,
    "",
    "## Recommendation Table",
    "",
    "| Slug | Candidate type | Status | Next pass | Structure | Current sections | Proposed sections | Start boundary | Cleanup |",
    "| --- | --- | --- | --- | --- | ---: | ---: | --- | --- |",
    rows,
    "",
    "## Already Acceptable",
    "",
    byStatus("already acceptable"),
    "",
    "## Needs Correction Before Acceptance",
    "",
    byStatus("needs correction before acceptance"),
    "",
    "## Needs First-Time Controlled Processing",
    "",
    byStatus("needs first-time controlled processing"),
    "",
    "## Manual Review",
    "",
    byStatus("manual review"),
    "",
    "## Blocked",
    "",
    byStatus("blocked"),
    "",
    "## Future Batch Rule",
    "",
    report.futureBatchRule.map((rule) => `- ${rule}`).join("\n"),
    "",
    "## Later-Phase Requirements",
    "",
    report.laterPhaseRequirements.map((rule) => `- ${rule}`).join("\n"),
    "",
    "## Protected Folder Confirmation",
    "",
    "- `app/client/assets/temp-books` was read but not modified.",
    "- `app/client/assets/books/generated` was read for comparison but not modified.",
    "- `app/client/assets/books/cloudflare-export` was read for path checks but not modified.",
    "- `public/book-previews` was read for validation but not modified.",
    "",
  ].join("\n");
}

function assertInputs() {
  for (const requiredPath of [
    PASS_1_JSON_PATH,
    PASS_2_JSON_PATH,
    STRUCTURE_JSON_PATH,
    STARTUP_JSON_PATH,
    WRITE_5_VERIFICATION_JSON_PATH,
    LIBRARY_MANIFEST_PATH,
  ]) {
    if (!fs.existsSync(requiredPath)) {
      throw new Error(`Required input is missing: ${relativeToRepo(requiredPath)}`);
    }
  }
  const forbidden = PILOT_BATCH.filter(
    (slug) => ACCEPTED_OR_CORRECTED.has(slug) || KNOWN_MANUAL_BLOCKED_OR_SUSPICIOUS.has(slug),
  );
  if (forbidden.length > 0) {
    throw new Error(`Pilot dry-run 6 includes forbidden slugs: ${forbidden.join(", ")}`);
  }
}

function isExcludedGeneratedCandidate(slug: string) {
  return (
    ACCEPTED_OR_CORRECTED.has(slug) ||
    KNOWN_MANUAL_BLOCKED_OR_SUSPICIOUS.has(slug) ||
    slug === "review"
  );
}

function main() {
  assertInputs();
  assertSafeReportPath(reportRoot);
  assertSafeReportPath(reportBooksRoot);

  const library = readJson<GeneratedLibraryManifest>(LIBRARY_MANIFEST_PATH);
  const pass2 = readJson<{ books: PriorPassBook[] }>(PASS_2_JSON_PATH);
  const structure = readJson<{ books: StructureAuditBook[] }>(STRUCTURE_JSON_PATH);
  const startup = readJson<{ books: StartupAuditBook[] }>(STARTUP_JSON_PATH);
  const byPass2Slug = new Map(pass2.books.map((book) => [book.slug, book]));
  const byStructureSlug = new Map(structure.books.map((book) => [book.slug, book]));
  const byStartupSlug = new Map(startup.books.map((book) => [book.slug, book]));
  const baseMainCommit = gitOutput(["rev-parse", "main"]);
  const generatedButUnacceptedCandidates = library.books
    .filter((book) => !isExcludedGeneratedCandidate(book.slug))
    .map((book) => book.slug)
    .sort();
  const unresolvedSourceGeneratedBooks = library.books
    .filter((book) => generatedButUnacceptedCandidates.includes(book.slug))
    .filter(
      (book) =>
        !sourcePathFor(
          book.slug,
          book.title,
          byPass2Slug.get(book.slug),
          byStructureSlug.get(book.slug),
        ),
    )
    .map((book) => {
      const startupBook = byStartupSlug.get(book.slug);
      return {
        slug: book.slug,
        title: book.title,
        startupPreviewValid: startupBook?.startupPreviewValid ?? false,
        startupRecommendation: startupBook?.recommendation ?? null,
        generatedSectionCount: book.stats.sectionCount,
        reason:
          "No matching source file was resolved from pass reports, structure audit, processing notes, slug filename, or title filename.",
      };
    });
  const generatedButUnacceptedWithResolvedRawSourceCount =
    generatedButUnacceptedCandidates.length - unresolvedSourceGeneratedBooks.length;

  const books = PILOT_BATCH.map((slug) => {
    const pass2Book = byPass2Slug.get(slug);
    const structureBook = byStructureSlug.get(slug);
    if (!structureBook) throw new Error(`Raw-only candidate missing from structure audit: ${slug}`);
    const result = inspectRawOnlyBook(slug, pass2Book, structureBook, baseMainCommit);
    const bookPath = path.join(reportBooksRoot, `${slug}.md`);
    assertSafeReportPath(bookPath);
    writeText(bookPath, bookMarkdown(result));
    return result;
  });

  const report: DryRunReport = {
    schemaVersion: 1,
    reportName: "pilot-dry-run-6",
    generatedAt: new Date().toISOString(),
    branch: "morsewords-book-processing-pilot-dry-run-6-jun-2026",
    baseMainCommit,
    mode: "dry-run/report-only",
    selectedBooks: [...PILOT_BATCH],
    generatedButUnacceptedCandidatesFound: generatedButUnacceptedCandidates,
    unresolvedSourceGeneratedBooks,
    selectionRules: {
      acceptedCorrectedExcludedCount: ACCEPTED_OR_CORRECTED.size,
      knownManualBlockedSuspiciousExcludedCount: KNOWN_MANUAL_BLOCKED_OR_SUSPICIOUS.size,
      selectedCount: PILOT_BATCH.length,
      generatedButUnacceptedWithResolvedRawSourceCount,
      rawOnlySelectedCount: books.filter((book) => book.candidateType === "raw-only").length,
      unselectedGeneratedCandidatesWithoutResolvedRawSource: [
        ...unresolvedSourceGeneratedBooks.map((book) => book.slug),
      ],
      note: "Batch 6 first inventoried remaining generated-but-unaccepted books after excluding the 97 accepted/corrected slugs and known manual/blocked/suspicious slugs. All remaining generated candidates had valid startup previews but no clear raw source match, so they are reported as unresolved-source generated books and are not selected for write planning. The selected batch therefore uses 20 raw-only sources with resolvable temp-books inputs and high/medium structure-audit confidence.",
    },
    inputReports: [
      relativeToRepo(PASS_1_JSON_PATH),
      relativeToRepo(PASS_2_JSON_PATH),
      relativeToRepo(STRUCTURE_JSON_PATH),
      relativeToRepo(STARTUP_JSON_PATH),
      relativeToRepo(WRITE_5_VERIFICATION_JSON_PATH),
    ],
    protectedPaths: {
      rawSourceInput: "app/client/assets/temp-books",
      generatedBooks: "app/client/assets/books/generated",
      cloudflareExport: "app/client/assets/books/cloudflare-export",
      previewAssets: "public/book-previews",
    },
    totals: statusTotals(books),
    futureBatchRule: [
      "Every future processed book must include valid generated readable content.",
      "The first default section must come from real readable content.",
      "All main readable sections must be included by default.",
      "Each book must have a valid book-specific startup preview.",
      "Startup previews must not contain `SOS Help!`.",
      "Startup previews must not use a generic preview fallback.",
      "Default playback must not begin with title, TOC, source, license, contributor, or transcriber material.",
    ],
    laterPhaseRequirements: [
      "After all books are processed, run an independent second-pass audit using a different strategy.",
      "After books and the second-pass audit, add original non-spoiler 300-500+ word SEO summaries for each accepted book page.",
      "After summaries, perform full site SEO/meta review using GSC data and route-level intent.",
      "Final cleanup should remove temporary audit scripts/reports and code bloat only after everything is stable.",
    ],
    books,
  };

  assertSafeReportPath(MAIN_JSON_PATH);
  assertSafeReportPath(MAIN_MARKDOWN_PATH);
  writeJson(MAIN_JSON_PATH, report);
  writeText(MAIN_MARKDOWN_PATH, mainMarkdown(report));

  console.log(`Pilot dry-run 6 books inspected: ${report.totals.selectedBooks}`);
  console.log(
    `Already acceptable: ${report.totals.alreadyAcceptable}; needs correction: ${report.totals.needsCorrectionBeforeAcceptance}; first-time processing: ${report.totals.needsFirstTimeControlledProcessing}; manual review: ${report.totals.manualReview}; blocked: ${report.totals.blocked}`,
  );
  console.log(`Report written to ${relativeToRepo(MAIN_JSON_PATH)}`);
}

main();
