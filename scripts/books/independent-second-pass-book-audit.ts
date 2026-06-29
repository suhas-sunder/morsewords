import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  BookSectionKind,
  GeneratedBookManifest,
  GeneratedBookSectionJson,
  GeneratedLibraryManifest,
} from "./bookManifestTypes.ts";

type PreviewManifestEntry = {
  slug: string;
  path: string;
  contentVersion: string;
  contentHash: string;
  defaultSectionId: string;
  previewBytes: number;
  previewCharacterCount: number;
  estimatedRuntimeSeconds: number;
  truncated: boolean;
};

type PreviewManifest = {
  version: 1;
  assetBasePath: string;
  targetRuntimeSeconds: number;
  books: PreviewManifestEntry[];
  missing?: Array<{ slug: string; reason: string }>;
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
  textPreview?: string;
  wordCount: number;
  characterCount: number;
};

type TriageRawItem = {
  slug: string;
  rawSourceFilename: string;
  rawSourcePath: string;
  rawSourceExists: boolean;
  primaryCategory: string;
};

type TriageReport = {
  counts?: {
    totalRawFilesInspected?: number;
    totalGeneratedBooks?: number;
    totalValidPreviews?: number;
    dryRun24SkippedUnsafeRawOnlyCount?: number;
    unresolvedSourceGeneratedCount?: number;
    duplicateNearDuplicateCount?: number;
    boundaryDefectCount?: number;
  };
  dryRun24Confirmation?: {
    zeroSafeDeterministicCandidatesRemain?: boolean;
    skippedUnsafeRawOnlyCandidates?: number;
  };
  recommendedNextPhase?: {
    recommendation?: string;
    rationale?: string;
  };
  liveRawItems?: TriageRawItem[];
  unresolvedSourceGeneratedItems?: Array<{ slug: string; primaryCategory: string }>;
  knownItemsPreserved?: unknown;
};

type UnresolvedSourceGeneratedReviewReport = {
  reviewedUnresolvedSourceSlugs?: string[];
  decisions?: Array<{
    slug: string;
    decision: string;
  }>;
};

type RightsReport = {
  author?: string;
  credits?: string;
  translator?: string;
  editor?: string;
  introduction_author?: string;
  gutenberg_ebook_number?: string;
  source_url?: string | null;
  canada_us_v1_status?: string;
  approval_source?: string;
};

type RawSourceComparisonStatus =
  | "exact/sampled-pass"
  | "sampled-warn"
  | "unavailable"
  | "not attempted";

type AuditStatus = "pass" | "warn-accepted" | "fail-needs-fix" | "manual-review";

type ContributorMetadata = {
  author: string[];
  compiler: string[];
  collector: string[];
  translator: string[];
  editor: string[];
  introductionAuthor: string[];
  rightsReportCredits: string | null;
};

type LeakageAssessment = {
  sourceHeaderLicenseContributorTranscriberLeakage: boolean;
  tableOfContentsLeakage: boolean;
  titlePageOrBylineMaterial: boolean;
  evidence: string[];
};

type BookAuditResult = {
  slug: string;
  generatedTitle: string;
  contributorMetadata: ContributorMetadata;
  generatedDirectoryExists: boolean;
  expectedGeneratedFilesExist: {
    manifest: boolean;
    processedBook: boolean;
    cleanedBook: boolean;
    rightsReport: boolean;
    allSectionFiles: boolean;
    missingSectionFiles: string[];
  };
  manifestEntryExists: boolean;
  previewFileExists: boolean;
  previewManifestEntryExists: boolean;
  previewStartsWithBookSpecificReadableContent: boolean;
  previewContainsSosHelp: boolean;
  previewUsesGenericFallback: boolean;
  previewContentHashMatchesGeneratedManifest: boolean;
  firstDefaultSectionTitle: string | null;
  firstDefaultSectionOpeningText: string | null;
  firstDefaultSectionLikelyRealReadableContent: boolean;
  defaultPlaybackLeakage: LeakageAssessment;
  sectionCount: number;
  defaultSectionCount: number;
  totalWordCount: number;
  suspiciouslySmallSections: string[];
  suspiciouslyLargeSections: string[];
  emptyOrMalformedSections: string[];
  firstSelectedDefaultDoesNotMatchGeneratedSourceOrder: boolean;
  sourceOrderNotes: string[];
  duplicateNearDuplicateFlags: {
    duplicateTitleSlugs: string[];
    nearDuplicateSlugSlugs: string[];
    duplicateGutenbergIdSlugs: string[];
  };
  metadataConfidence: "high" | "medium" | "low";
  metadataWarnings: string[];
  rawSourceAvailability: {
    available: boolean;
    path: string | null;
    triageCategory: string | null;
  };
  rawSourceComparisonStatus: RawSourceComparisonStatus;
  rawSourceComparisonNote: string;
  evidenceSnippets: {
    previewStart: string | null;
    generatedDefaultStart: string | null;
    rawComparisonStartPhrase: string | null;
    rawComparisonEndPhrase: string | null;
  };
  specialGroups: string[];
  warnings: string[];
  failures: string[];
  finalAuditStatus: AuditStatus;
  recommendedNextAction: string;
};

type AuditReport = {
  schemaVersion: 1;
  reportName: "independent-second-pass-book-audit";
  generatedAt: string;
  branch: string;
  mode: "report-only/independent-second-pass";
  sourcePaths: {
    generatedBooks: string;
    previewAssets: string;
    rawSourceInput: string;
    cloudflareExport: string;
  };
  counts: {
    generatedBookDirectories: number;
    generatedBooksInLibraryManifest: number;
    previewAssetFiles: number;
    previewManifestEntries: number;
    pass: number;
    warnAccepted: number;
    failNeedsFix: number;
    manualReview: number;
  };
  manifestConsistency: {
    result: "pass" | "fail";
    issues: string[];
    extraGeneratedDirectoriesWithoutManifest: string[];
    generatedDirectoriesMissingFromLibraryManifest: string[];
    libraryManifestEntriesMissingGeneratedDirectory: string[];
    previewFilesMissingFromPreviewManifest: string[];
    previewManifestEntriesMissingPreviewFile: string[];
  };
  knownRemainingRawInventoryState: {
    totalRawFilesInspected: number | null;
    zeroSafeDeterministicCandidatesRemain: boolean;
    skippedUnsafeRawOnlyCandidates: number | null;
    unresolvedSourceGeneratedCount: number | null;
    duplicateNearDuplicateCount: number | null;
    boundaryDefectCount: number | null;
    triageRecommendedNextPhase: string | null;
  };
  batch12RestorationSummary: {
    compared: number | null;
    remainingMismatches: number | null;
    status: string;
  };
  unresolvedSourceGeneratedBookSummary: {
    count: number;
    books: Array<{
      slug: string;
      generatedTitle: string | null;
      generatedAuthor: string[];
      previewValid: boolean;
      defaultStartReadable: boolean;
      sourceRemainsUnresolved: boolean;
      recommendation: string;
    }>;
  };
  duplicateNearDuplicateFindings: Array<{
    type: "duplicate-title" | "near-duplicate-slug" | "duplicate-gutenberg-id";
    key: string;
    slugs: string[];
  }>;
  sourceHeaderLicenseTocLeakageFindings: Array<{
    slug: string;
    evidence: string[];
    status: AuditStatus;
  }>;
  previewFindings: Array<{
    slug: string;
    issue: string;
    status: AuditStatus;
  }>;
  metadataFindings: Array<{
    slug: string;
    issue: string;
    status: AuditStatus;
  }>;
  startEndDefaultSectionFindings: Array<{
    slug: string;
    issue: string;
    status: AuditStatus;
  }>;
  rawVsGeneratedComparisonSummary: {
    exactSampledPass: number;
    sampledWarn: number;
    unavailable: number;
    notAttempted: number;
    sampledWarnings: Array<{ slug: string; note: string }>;
  };
  specialGroupSummaries: {
    knownDuplicateBoundaryRawSkips: Array<{
      slug: string;
      exactGeneratedSlugExists: boolean;
      note: string;
    }>;
    recentBatches21To23: {
      requestedCount: number;
      foundCount: number;
      missingSlugs: string[];
      statuses: Record<AuditStatus, number>;
    };
    lovecraftTitles: {
      count: number;
      authorMetadataWarnings: string[];
      statuses: Record<AuditStatus, number>;
    };
    wellsTitles: {
      count: number;
      authorMetadataWarnings: string[];
      statuses: Record<AuditStatus, number>;
    };
  };
  recommendedNextPhase:
    | "Proceed to SEO summary generation"
    | "Fix specific generated book defects before SEO summaries"
    | "Resolve specific manual/source issues before SEO summaries"
    | "Proceed with SEO summaries while tracking non-blocking source-resolution debt";
  laterPhaseRequirementsRestatedOnly: string[];
  protectedPathConfirmation: string;
  books: BookAuditResult[];
};

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const generatedRoot = path.join(repoRoot, "app/client/assets/books/generated");
const previewRoot = path.join(repoRoot, "public/book-previews");
const tempBooksRoot = path.join(repoRoot, "app/client/assets/temp-books");
const cloudflareExportRoot = path.join(
  repoRoot,
  "app/client/assets/books/cloudflare-export",
);
const reportRoot = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/independent-second-pass-book-audit",
);
const reportJsonPath = path.join(reportRoot, "independent-second-pass-book-audit.json");
const reportMdPath = path.join(reportRoot, "independent-second-pass-book-audit.md");
const libraryManifestPath = path.join(generatedRoot, "library-manifest.json");
const previewManifestPath = path.join(previewRoot, "manifest.json");
const triageReportPath = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/remaining-raw-inventory-triage/remaining-raw-inventory-triage.json",
);
const unresolvedSourceReviewReportPath = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/unresolved-source-generated-review/unresolved-source-generated-review.json",
);
const batch12ReportPath = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/batch-12-prose-restoration/batch-12-prose-restoration.json",
);

const fallbackUnresolvedSourceSlugs = [
  "the-great-gatsby",
  "the-picture-of-dorian-gray",
] as const;

const sourceRiskRemovedSlugs = [
  "a-princess-of-mars",
  "doctor-dolittle",
  "heidi",
  "jabberwocky",
  "nights-with-uncle-remus",
  "peter-pan",
  "tarzan-of-the-apes",
  "the-thirty-nine-steps",
  "wood-folk-at-school",
] as const;

const expectedGeneratedBookCount = 514;

function unresolvedSourceSlugsFromReview() {
  if (!fs.existsSync(unresolvedSourceReviewReportPath)) {
    return [...fallbackUnresolvedSourceSlugs];
  }
  const report = readJson<UnresolvedSourceGeneratedReviewReport>(unresolvedSourceReviewReportPath);
  const reviewed = new Set(report.reviewedUnresolvedSourceSlugs ?? fallbackUnresolvedSourceSlugs);
  const resolved = new Set(
    (report.decisions ?? [])
      .filter((decision) => decision.decision.startsWith("resolved-"))
      .map((decision) => decision.slug),
  );
  const removed = new Set<string>(sourceRiskRemovedSlugs);
  return [...reviewed].filter((slug) => !resolved.has(slug) && !removed.has(slug));
}

const knownDuplicateBoundaryRawSkipSlugs = [
  "the-wind-in-the-willows",
  "the-two-magics-the-turn-of-the-screw-covering-end",
  "japanese-fairy-tales",
  "the-works-of-edgar-allan-poe",
  "snow-white-and-rose-red",
] as const;

const recentBatch21To23Slugs = [
  "a-deal-in-ostriches",
  "a-moonlight-fable",
  "a-moth-genus-novo",
  "aepyornis-island",
  "in-the-avu-observatory",
  "the-cone",
  "the-country-of-the-blind",
  "the-crystal-egg",
  "the-diamond-maker",
  "the-flowering-of-the-strange-orchid",
  "the-flying-man",
  "the-hammerpond-park-burglary",
  "the-lord-of-the-dynamos",
  "the-star",
  "the-stolen-bacillus",
  "the-stolen-body",
  "the-temptation-of-harringay",
  "the-treasure-in-the-forest",
  "the-triumphs-of-a-taxidermist",
  "through-a-window",
  "a-slip-under-the-microscope",
  "a-story-of-the-days-to-come",
  "beyond-the-wall-of-sleep",
  "celephais",
  "hypnos",
  "ibid",
  "in-the-vault",
  "nyarlathotep",
  "polaris",
  "the-alchemist",
  "the-beast-in-the-cave",
  "the-doom-that-came-to-sarnath",
  "the-moon-bog",
  "the-outsider",
  "the-shifty-lad",
  "the-temple",
  "the-tomb",
  "the-tree",
  "the-unnamable",
  "the-white-ship",
  "in-the-modern-vein",
  "the-argonauts-of-the-air",
  "the-dreams-in-the-witch-house",
  "the-jilting-of-jane",
  "the-lost-inheritance",
  "the-purple-pileus",
  "the-shadow-out-of-time",
  "the-strange-high-house-in-the-mist",
  "the-valley-of-spiders",
  "the-whisperer-in-darkness",
] as const;

const strongSourceLeakPattern =
  /\b(project gutenberg|gutenberg license|the project gutenberg ebook|distributed proofreading|pgdp\.net|release date|most recently updated|this ebook is for the use|start of (?:the )?project gutenberg|end of (?:the )?project gutenberg|online distributed proofreading team|transcriber(?:'s)? note)\b/i;
const genericPreviewPattern =
  /\b(reference file does not include body text|book route is available|generic placeholder|placeholder preview|missing source content|startup preview fallback)\b/i;
const sosHelpPattern = /\bSOS\s+Help!?\b/i;
const titlePageBylinePattern =
  /\b(?:^|\n)(?:by|edited by|translated by|compiled by|collected by|illustrated by)\s+[A-Z][A-Za-z .'-]{2,80}\b/;
const titlePageMaterialPattern =
  /\b(title page|copyright|all rights reserved|published by|publisher|frontispiece|illustrations?)\b/i;
const tocPattern = /\b(table of contents|contents|list of illustrations)\b/i;

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeText(filePath: string, value: string) {
  assertInside(reportRoot, filePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value, "utf8");
}

function writeJson(filePath: string, value: unknown) {
  writeText(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function assertInside(root: string, candidate: string) {
  const resolvedRoot = path.resolve(root);
  const resolvedCandidate = path.resolve(candidate);
  if (
    resolvedCandidate !== resolvedRoot &&
    !resolvedCandidate.startsWith(`${resolvedRoot}${path.sep}`)
  ) {
    throw new Error(`Refusing path outside ${resolvedRoot}: ${resolvedCandidate}`);
  }
}

function assertSafeOutputPaths() {
  const expectedReportRoot = path.join(
    repoRoot,
    "app/client/assets/books/audit-reports/independent-second-pass-book-audit",
  );
  if (path.resolve(reportRoot) !== path.resolve(expectedReportRoot)) {
    throw new Error(`Unexpected report output root: ${reportRoot}`);
  }
}

function repoRelative(filePath: string) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, "/");
}

function compact(text: string | null | undefined, maxLength = 220) {
  const normalized = (text ?? "").replace(/\s+/g, " ").trim();
  if (!normalized) return null;
  return normalized.length <= maxLength
    ? normalized
    : `${normalized.slice(0, maxLength - 3)}...`;
}

function normalizeTitleKey(title: string) {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeSlugBase(slug: string) {
  return slug
    .replace(/-gutenberg-\d+$/i, "")
    .replace(/-project-gutenberg-\d+$/i, "")
    .replace(/-\d+$/i, "");
}

function normalizeWords(text: string | null | undefined) {
  return (text ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function wordCount(text: string | null | undefined) {
  const words = normalizeWords(text);
  return words ? words.split(" ").length : 0;
}

function phraseFromStart(text: string | null | undefined, count = 18) {
  const words = normalizeWords(text).split(" ").filter(Boolean);
  if (words.length < 8) return null;
  return words.slice(0, Math.min(count, words.length)).join(" ");
}

function phraseFromEnd(text: string | null | undefined, count = 18) {
  const words = normalizeWords(text).split(" ").filter(Boolean);
  if (words.length < 8) return null;
  return words.slice(Math.max(0, words.length - count)).join(" ");
}

function groupBy<T>(items: T[], keyFor: (item: T) => string | null) {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const key = keyFor(item);
    if (!key) continue;
    const group = groups.get(key) ?? [];
    group.push(item);
    groups.set(key, group);
  }
  return groups;
}

function sortedUnique(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function readOptionalJson<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  return readJson<T>(filePath);
}

function sectionText(section: GeneratedBookSectionJson | null | undefined) {
  return section?.displayText || section?.morseSourceText || section?.textPreview || "";
}

function looksLikeTocListing(text: string) {
  const normalized = text.replace(/\s+/g, " ").trim();
  const match = tocPattern.exec(normalized);
  if (!match) return false;
  const before = normalized.slice(0, match.index);
  if (
    /^contents$/i.test(match[0]) &&
    /\b(chapter|book|part|section)\b/i.test(before) &&
    !/\btable of contents\b/i.test(normalized.slice(0, match.index + 40))
  ) {
    return false;
  }
  const wordsBefore = wordCount(normalized.slice(0, match.index));
  const sampleAfter = normalized.slice(match.index, match.index + 260);
  return (
    wordsBefore <= 30 &&
    /\b(chapter|stave|part|book|story|letter|section|preface|introduction)\b/i.test(
      sampleAfter,
    )
  );
}

function assessReadableContent(text: string | null | undefined) {
  const normalized = (text ?? "").replace(/\s+/g, " ").trim();
  if (wordCount(normalized) < 25) return false;
  if (sosHelpPattern.test(normalized) || genericPreviewPattern.test(normalized)) return false;
  const opening = normalized.slice(0, 1_200);
  if (strongSourceLeakPattern.test(opening)) return false;
  if (/^(?:contents|table of contents|list of illustrations)\b/i.test(opening)) return false;
  return true;
}

function assessLeakage(texts: string[]): LeakageAssessment {
  const evidence: string[] = [];
  let sourceHeaderLicenseContributorTranscriberLeakage = false;
  let tableOfContentsLeakage = false;
  let titlePageOrBylineMaterial = false;

  for (const text of texts) {
    const opening = text.slice(0, 2_000);
    const sourceMatch = strongSourceLeakPattern.exec(opening);
    if (sourceMatch) {
      sourceHeaderLicenseContributorTranscriberLeakage = true;
      evidence.push(`source/header/license marker: ${compact(sourceMatch[0], 80)}`);
    }
    if (looksLikeTocListing(opening)) {
      tableOfContentsLeakage = true;
      evidence.push(`table-of-contents-like opening: ${compact(opening, 140)}`);
    }
    const earlyOpening = opening.slice(0, 360);
    if (titlePageMaterialPattern.test(earlyOpening) || titlePageBylinePattern.test(earlyOpening)) {
      titlePageOrBylineMaterial = true;
      const matched =
        titlePageMaterialPattern.exec(earlyOpening)?.[0] ??
        titlePageBylinePattern.exec(earlyOpening)?.[0];
      evidence.push(`title/byline/front-matter marker: ${compact(matched, 100)}`);
    }
  }

  return {
    sourceHeaderLicenseContributorTranscriberLeakage,
    tableOfContentsLeakage,
    titlePageOrBylineMaterial,
    evidence: sortedUnique(evidence),
  };
}

function contributorsFromRightsReport(
  manifest: GeneratedBookManifest,
  rightsReport: RightsReport | null,
): ContributorMetadata {
  return {
    author: manifest.author,
    compiler: [],
    collector: [],
    translator: splitContributorField(rightsReport?.translator),
    editor: splitContributorField(rightsReport?.editor),
    introductionAuthor: splitContributorField(rightsReport?.introduction_author),
    rightsReportCredits: compact(rightsReport?.credits, 180),
  };
}

function splitContributorField(value: string | null | undefined) {
  if (!value || value.trim() === "" || /^not found$/i.test(value.trim())) return [];
  return value
    .split(/;|\band\b|,/i)
    .map((part) => part.trim())
    .filter(Boolean);
}

function metadataConfidenceFor(manifest: GeneratedBookManifest, rightsReport: RightsReport | null) {
  const warnings: string[] = [];
  let confidence: "high" | "medium" | "low" = "high";

  if (manifest.author.length === 0) {
    warnings.push("Generated manifest has no author metadata.");
    confidence = "medium";
  }
  if (manifest.author.some((author) => /^(unknown|anonymous|various)$/i.test(author.trim()))) {
    warnings.push("Generated manifest uses broad or unknown author metadata.");
    confidence = "medium";
  }
  if (!manifest.source.rightsReviewed || manifest.source.rightsStatus !== "approved") {
    warnings.push("Generated source rights metadata is not fully approved.");
    confidence = "low";
  }
  if (rightsReport && rightsReport.canada_us_v1_status && rightsReport.canada_us_v1_status !== "approved") {
    warnings.push(`Rights report status is ${rightsReport.canada_us_v1_status}.`);
    confidence = "low";
  }

  return { confidence, warnings };
}

function compareGeneratedWithRaw(
  slug: string,
  rawItem: TriageRawItem | undefined,
  generatedTextForSampling: string,
) {
  if (!rawItem?.rawSourceExists) {
    return {
      status: "unavailable" as RawSourceComparisonStatus,
      note: "No matching live raw source path was available from the triage inventory.",
      startPhrase: null,
      endPhrase: null,
    };
  }

  const rawPath = path.join(repoRoot, rawItem.rawSourcePath);
  assertInside(tempBooksRoot, rawPath);
  if (!fs.existsSync(rawPath)) {
    return {
      status: "unavailable" as RawSourceComparisonStatus,
      note: "Triage listed a raw source, but the file is not present on disk.",
      startPhrase: null,
      endPhrase: null,
    };
  }

  const startPhrase = phraseFromStart(generatedTextForSampling);
  const endPhrase = phraseFromEnd(generatedTextForSampling);
  if (!startPhrase || !endPhrase) {
    return {
      status: "not attempted" as RawSourceComparisonStatus,
      note: "Generated text was too short for reliable start/end phrase sampling.",
      startPhrase,
      endPhrase,
    };
  }

  const rawNormalized = normalizeWords(fs.readFileSync(rawPath, "utf8"));
  const startFound = rawNormalized.includes(startPhrase);
  const endFound = rawNormalized.includes(endPhrase);
  if (startFound && endFound) {
    return {
      status: "exact/sampled-pass" as RawSourceComparisonStatus,
      note: "Start and end generated text samples were found in the raw source.",
      startPhrase,
      endPhrase,
    };
  }

  return {
    status: "sampled-warn" as RawSourceComparisonStatus,
    note: `Raw source sample check found start=${startFound ? "yes" : "no"}, end=${
      endFound ? "yes" : "no"
    }.`,
    startPhrase,
    endPhrase,
  };
}

function statusCounts(books: BookAuditResult[]) {
  return {
    pass: books.filter((book) => book.finalAuditStatus === "pass").length,
    warnAccepted: books.filter((book) => book.finalAuditStatus === "warn-accepted").length,
    failNeedsFix: books.filter((book) => book.finalAuditStatus === "fail-needs-fix").length,
    manualReview: books.filter((book) => book.finalAuditStatus === "manual-review").length,
  };
}

function makeStatusRecord(books: BookAuditResult[]): Record<AuditStatus, number> {
  return {
    pass: books.filter((book) => book.finalAuditStatus === "pass").length,
    "warn-accepted": books.filter((book) => book.finalAuditStatus === "warn-accepted").length,
    "fail-needs-fix": books.filter((book) => book.finalAuditStatus === "fail-needs-fix").length,
    "manual-review": books.filter((book) => book.finalAuditStatus === "manual-review").length,
  };
}

function recommendNextPhase(books: BookAuditResult[]) {
  const counts = statusCounts(books);
  if (counts.failNeedsFix > 0) return "Fix specific generated book defects before SEO summaries" as const;
  if (counts.manualReview > 0) {
    return "Resolve specific manual/source issues before SEO summaries" as const;
  }
  if (books.some((book) => book.specialGroups.includes("unresolved-source-generated-book"))) {
    return "Proceed with SEO summaries while tracking non-blocking source-resolution debt" as const;
  }
  return "Proceed to SEO summary generation" as const;
}

function buildMarkdown(report: AuditReport) {
  const status = report.counts;
  const duplicateLines = report.duplicateNearDuplicateFindings.length
    ? report.duplicateNearDuplicateFindings
        .map((finding) => `- ${finding.type}: ${finding.key} (${finding.slugs.join(", ")})`)
        .join("\n")
    : "- None found.";
  const leakageLines = report.sourceHeaderLicenseTocLeakageFindings.length
    ? report.sourceHeaderLicenseTocLeakageFindings
        .map((finding) => `- ${finding.slug}: ${finding.evidence.join("; ")}`)
        .join("\n")
    : "- No source/header/license/TOC leakage findings in generated defaults.";
  const previewLines = report.previewFindings.length
    ? report.previewFindings
        .map((finding) => `- ${finding.slug}: ${finding.issue} (${finding.status})`)
        .join("\n")
    : "- No preview fallback, SOS Help, missing-preview, or preview-manifest defects found.";
  const metadataLines = report.metadataFindings.length
    ? report.metadataFindings
        .map((finding) => `- ${finding.slug}: ${finding.issue} (${finding.status})`)
        .join("\n")
    : "- No blocking metadata findings.";
  const startLines = report.startEndDefaultSectionFindings.length
    ? report.startEndDefaultSectionFindings
        .map((finding) => `- ${finding.slug}: ${finding.issue} (${finding.status})`)
        .join("\n")
    : "- No blocking start/end/default-section findings.";
  const rawWarnLines = report.rawVsGeneratedComparisonSummary.sampledWarnings.length
    ? report.rawVsGeneratedComparisonSummary.sampledWarnings
        .slice(0, 40)
        .map((warning) => `- ${warning.slug}: ${warning.note}`)
        .join("\n")
    : "- No raw-vs-generated sampled warnings.";
  const unresolvedLines = report.unresolvedSourceGeneratedBookSummary.books
    .map(
      (book) =>
        `- ${book.slug}: ${book.generatedTitle ?? "unknown title"}; preview ${
          book.previewValid ? "valid" : "not valid"
        }; default start ${book.defaultStartReadable ? "readable" : "not readable"}; ${book.recommendation}`,
    )
    .join("\n");
  const skipLines = report.specialGroupSummaries.knownDuplicateBoundaryRawSkips
    .map(
      (item) =>
        `- ${item.slug}: exact generated slug ${item.exactGeneratedSlugExists ? "exists" : "absent"}; ${item.note}`,
    )
    .join("\n");
  const manifestIssues = report.manifestConsistency.issues.length
    ? report.manifestConsistency.issues.map((issue) => `- ${issue}`).join("\n")
    : "- Filesystem, generated manifest, preview manifest, and preview files are consistent.";
  const laterPhaseLines = report.laterPhaseRequirementsRestatedOnly
    .map((item) => `- ${item}`)
    .join("\n");

  return `# Independent Second-Pass Book Audit

Generated: ${report.generatedAt}

## Executive summary

This report independently reconstructed the generated book inventory, preview inventory, library manifest, and preview manifest from disk. It did not replay write-batch decisions and did not modify generated books, preview assets, raw sources, or Cloudflare exports.

- Generated book count: ${report.counts.generatedBookDirectories}
- Generated manifest entries: ${report.counts.generatedBooksInLibraryManifest}
- Preview count: ${report.counts.previewAssetFiles}
- Preview manifest entries: ${report.counts.previewManifestEntries}
- Manifest consistency result: ${report.manifestConsistency.result}
- Pass: ${status.pass}
- Warn-accepted: ${status.warnAccepted}
- Fail-needs-fix: ${status.failNeedsFix}
- Manual-review: ${status.manualReview}
- Recommended next phase: ${report.recommendedNextPhase}

## Manifest consistency

${manifestIssues}

## Unresolved-source generated books

Count: ${report.unresolvedSourceGeneratedBookSummary.count}

${unresolvedLines}

These books remain accepted as currently generated, but source resolution is still documented debt. They were not modified.

## Duplicate and near-duplicate findings

${duplicateLines}

## Source, header, license, and TOC leakage findings

${leakageLines}

## Preview findings

${previewLines}

## Metadata findings

${metadataLines}

## Start, end, and default-section findings

${startLines}

## Raw-vs-generated comparison summary

- exact/sampled-pass: ${report.rawVsGeneratedComparisonSummary.exactSampledPass}
- sampled-warn: ${report.rawVsGeneratedComparisonSummary.sampledWarn}
- unavailable: ${report.rawVsGeneratedComparisonSummary.unavailable}
- not attempted: ${report.rawVsGeneratedComparisonSummary.notAttempted}

${rawWarnLines}

## Batch-12 restoration summary

- Compared: ${report.batch12RestorationSummary.compared}
- Remaining raw/generated mismatches: ${report.batch12RestorationSummary.remainingMismatches}
- Status: ${report.batch12RestorationSummary.status}

## Recent batch 21-23 summary

- Requested slugs: ${report.specialGroupSummaries.recentBatches21To23.requestedCount}
- Found: ${report.specialGroupSummaries.recentBatches21To23.foundCount}
- Missing: ${
    report.specialGroupSummaries.recentBatches21To23.missingSlugs.length
      ? report.specialGroupSummaries.recentBatches21To23.missingSlugs.join(", ")
      : "none"
  }
- Statuses: ${JSON.stringify(report.specialGroupSummaries.recentBatches21To23.statuses)}

## Lovecraft titles

- Count: ${report.specialGroupSummaries.lovecraftTitles.count}
- Statuses: ${JSON.stringify(report.specialGroupSummaries.lovecraftTitles.statuses)}
- Author metadata warnings: ${
    report.specialGroupSummaries.lovecraftTitles.authorMetadataWarnings.length
      ? report.specialGroupSummaries.lovecraftTitles.authorMetadataWarnings.join("; ")
      : "none"
  }

## Wells titles

- Count: ${report.specialGroupSummaries.wellsTitles.count}
- Statuses: ${JSON.stringify(report.specialGroupSummaries.wellsTitles.statuses)}
- Author metadata warnings: ${
    report.specialGroupSummaries.wellsTitles.authorMetadataWarnings.length
      ? report.specialGroupSummaries.wellsTitles.authorMetadataWarnings.join("; ")
      : "none"
  }

## Known duplicate/boundary raw skips

${skipLines}

## Known remaining raw inventory state

- Raw files inspected in triage: ${report.knownRemainingRawInventoryState.totalRawFilesInspected}
- Zero safe deterministic candidates remain: ${report.knownRemainingRawInventoryState.zeroSafeDeterministicCandidatesRemain}
- Skipped unsafe raw-only candidates: ${report.knownRemainingRawInventoryState.skippedUnsafeRawOnlyCandidates}
- Unresolved-source generated books: ${report.knownRemainingRawInventoryState.unresolvedSourceGeneratedCount}
- Duplicate/near-duplicate raw skips: ${report.knownRemainingRawInventoryState.duplicateNearDuplicateCount}
- Boundary-defect raw skips: ${report.knownRemainingRawInventoryState.boundaryDefectCount}
- Triage recommendation: ${report.knownRemainingRawInventoryState.triageRecommendedNextPhase}

## Recommended next phase

${report.recommendedNextPhase}

## Later-phase requirements restated only

${laterPhaseLines}

## Protected path confirmation

${report.protectedPathConfirmation}
`;
}

function main() {
  assertSafeOutputPaths();

  const unresolvedSourceSlugs = unresolvedSourceSlugsFromReview();
  const libraryManifest = readJson<GeneratedLibraryManifest>(libraryManifestPath);
  const previewManifest = readJson<PreviewManifest>(previewManifestPath);
  const triageReport = readOptionalJson<TriageReport>(triageReportPath);
  const batch12Report = readOptionalJson<{
    scope?: {
      batch12BooksCompared?: number;
      remainingBatch12RawVsGeneratedMismatches?: number;
    };
  }>(batch12ReportPath);

  const generatedDirs = fs
    .readdirSync(generatedRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
  const generatedBookDirs = generatedDirs.filter((slug) =>
    fs.existsSync(path.join(generatedRoot, slug, "manifest.json")),
  );
  const extraGeneratedDirsWithoutManifest = generatedDirs.filter(
    (slug) => !fs.existsSync(path.join(generatedRoot, slug, "manifest.json")),
  );
  const previewFiles = fs
    .readdirSync(previewRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".preview.json"))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
  const previewFileSlugs = new Set(
    previewFiles.map((fileName) => fileName.replace(/\.preview\.json$/, "")),
  );
  const librarySlugs = new Set(libraryManifest.books.map((book) => book.slug));
  const previewManifestSlugs = new Set(previewManifest.books.map((book) => book.slug));
  const generatedBookDirSlugs = new Set(generatedBookDirs);
  const libraryBySlug = new Map(libraryManifest.books.map((book) => [book.slug, book]));
  const previewManifestBySlug = new Map(previewManifest.books.map((book) => [book.slug, book]));
  const rawItemBySlug = new Map(
    (triageReport?.liveRawItems ?? []).map((item) => [item.slug, item] as const),
  );

  const titleGroups = groupBy(libraryManifest.books, (book) => normalizeTitleKey(book.title));
  const slugBaseGroups = groupBy(libraryManifest.books, (book) => normalizeSlugBase(book.slug));

  const duplicateFindings: AuditReport["duplicateNearDuplicateFindings"] = [];
  for (const [key, group] of titleGroups) {
    if (group.length > 1) {
      duplicateFindings.push({
        type: "duplicate-title",
        key,
        slugs: group.map((book) => book.slug).sort(),
      });
    }
  }
  for (const [key, group] of slugBaseGroups) {
    if (group.length > 1) {
      duplicateFindings.push({
        type: "near-duplicate-slug",
        key,
        slugs: group.map((book) => book.slug).sort(),
      });
    }
  }

  const books: BookAuditResult[] = [];
  for (const libraryBook of [...libraryManifest.books].sort((a, b) =>
    a.slug.localeCompare(b.slug),
  )) {
    const slug = libraryBook.slug;
    const bookDir = path.join(generatedRoot, slug);
    const generatedDirectoryExists = fs.existsSync(bookDir);
    const manifestPath = path.join(generatedRoot, libraryBook.manifestPath);
    assertInside(generatedRoot, manifestPath);
    const manifest = readJson<GeneratedBookManifest>(manifestPath);
    const rightsReportPath = path.join(bookDir, manifest.source.rightsReportPath);
    const rightsReport = readOptionalJson<RightsReport>(rightsReportPath);
    const processedBookPath = manifest.source.processedBookPath
      ? path.join(bookDir, manifest.source.processedBookPath)
      : path.join(bookDir, "processed_book.json");
    const cleanedBookPath = manifest.source.cleanedBookPath
      ? path.join(bookDir, manifest.source.cleanedBookPath)
      : path.join(bookDir, "cleaned_book.json");

    const sectionById = new Map<string, GeneratedBookSectionJson>();
    const missingSectionFiles: string[] = [];
    const emptyOrMalformedSections: string[] = [];
    for (const section of manifest.sections) {
      const sectionPath = path.join(bookDir, section.sectionJsonPath);
      assertInside(bookDir, sectionPath);
      if (!fs.existsSync(sectionPath)) {
        missingSectionFiles.push(section.sectionJsonPath);
        continue;
      }
      const sectionJson = readJson<GeneratedBookSectionJson>(sectionPath);
      sectionById.set(section.id, sectionJson);
      if (
        sectionJson.sectionId !== section.id ||
        sectionJson.bookSlug !== slug ||
        wordCount(sectionText(sectionJson)) === 0
      ) {
        emptyOrMalformedSections.push(section.id);
      }
    }

    const previewEntry = previewManifestBySlug.get(slug) ?? null;
    const previewPath = previewEntry
      ? path.join(previewRoot, previewEntry.path.replace(/^\/?book-previews[\\/]/, ""))
      : path.join(previewRoot, `${slug}.preview.json`);
    assertInside(previewRoot, previewPath);
    const previewFileExists = fs.existsSync(previewPath);
    const previewAsset = readOptionalJson<PreviewAsset>(previewPath);
    const previewText = previewAsset?.previewText ?? "";
    const previewContainsSosHelp = sosHelpPattern.test(previewText);
    const previewUsesGenericFallback = genericPreviewPattern.test(previewText);

    const defaultSections = manifest.sections
      .filter((section) => section.includeByDefault)
      .sort((a, b) => a.order - b.order);
    const previewDefaultSectionId = previewAsset?.defaultSectionId ?? previewEntry?.defaultSectionId ?? null;
    const firstDefaultSectionId =
      previewDefaultSectionId ?? defaultSections[0]?.id ?? manifest.sections[0]?.id ?? null;
    const firstDefaultSummary = manifest.sections.find((section) => section.id === firstDefaultSectionId) ?? null;
    const firstDefaultJson = firstDefaultSummary ? sectionById.get(firstDefaultSummary.id) ?? null : null;
    const firstDefaultText = sectionText(firstDefaultJson);
    const firstDefaultSectionLikelyRealReadableContent = assessReadableContent(firstDefaultText);

    const defaultPlaybackSections = defaultSections.length
      ? defaultSections
      : firstDefaultSummary
        ? [firstDefaultSummary]
        : [];
    const defaultPlaybackTexts = defaultPlaybackSections.map((section) =>
      sectionText(sectionById.get(section.id)),
    );
    const defaultPlaybackLeakage = assessLeakage(defaultPlaybackTexts);

    const previewStartPhrase = phraseFromStart(previewText, 12);
    const previewSectionText = firstDefaultText || defaultPlaybackTexts.join("\n\n");
    const previewStartsWithBookSpecificReadableContent =
      Boolean(previewText) &&
      assessReadableContent(previewText) &&
      !previewContainsSosHelp &&
      !previewUsesGenericFallback &&
      (!previewStartPhrase || normalizeWords(previewSectionText).includes(previewStartPhrase));

    const suspiciouslySmallSections = manifest.sections
      .filter((section) => section.wordCount > 0 && section.wordCount < 20)
      .map((section) => section.id);
    const suspiciouslyLargeSections = manifest.sections
      .filter((section) => section.wordCount > 50_000 || section.characterCount > 300_000)
      .map((section) => section.id);

    const sourceOrderNotes: string[] = [];
    let firstSelectedDefaultDoesNotMatchGeneratedSourceOrder = false;
    if (defaultSections.length > 0 && previewDefaultSectionId && defaultSections[0].id !== previewDefaultSectionId) {
      firstSelectedDefaultDoesNotMatchGeneratedSourceOrder = true;
      sourceOrderNotes.push(
        `Preview default ${previewDefaultSectionId} differs from first includeByDefault section ${defaultSections[0].id}.`,
      );
    }
    if (firstDefaultSummary) {
      const skippedEarlierReadableSections = manifest.sections
        .filter((section) => section.order < firstDefaultSummary.order)
        .filter((section) => {
          const text = sectionText(sectionById.get(section.id));
          return assessReadableContent(text) && !strongSourceLeakPattern.test(text.slice(0, 1_200));
        })
        .map((section) => section.id);
      if (skippedEarlierReadableSections.length > 0) {
        firstSelectedDefaultDoesNotMatchGeneratedSourceOrder = true;
        sourceOrderNotes.push(
          `Earlier readable-looking generated section(s) precede the startup/default section: ${skippedEarlierReadableSections
            .slice(0, 5)
            .join(", ")}.`,
        );
      }
    }

    const duplicateTitleSlugs = (titleGroups.get(normalizeTitleKey(manifest.title)) ?? [])
      .map((book) => book.slug)
      .filter((otherSlug) => otherSlug !== slug)
      .sort();
    const nearDuplicateSlugSlugs = (slugBaseGroups.get(normalizeSlugBase(slug)) ?? [])
      .map((book) => book.slug)
      .filter((otherSlug) => otherSlug !== slug)
      .sort();
    const duplicateGutenbergIdSlugs: string[] = [];
    const { confidence: metadataConfidence, warnings: metadataWarnings } = metadataConfidenceFor(
      manifest,
      rightsReport,
    );

    const specialGroups: string[] = [];
    if ((unresolvedSourceSlugs as readonly string[]).includes(slug)) {
      specialGroups.push("unresolved-source-generated-book");
    }
    if ((recentBatch21To23Slugs as readonly string[]).includes(slug)) {
      specialGroups.push("recent-batch-21-23");
    }
    const authorText = manifest.author.join("; ");
    if (/lovecraft/i.test(authorText)) specialGroups.push("lovecraft");
    if (/\bH\.?\s*G\.?\s*Wells\b|Herbert George Wells/i.test(authorText)) specialGroups.push("wells");

    const rawItem = rawItemBySlug.get(slug);
    const generatedTextForSampling = manifest.sections
      .map((section) => sectionText(sectionById.get(section.id)))
      .filter(Boolean)
      .join("\n\n");
    const rawComparison = compareGeneratedWithRaw(slug, rawItem, generatedTextForSampling);

    const warnings: string[] = [];
    const failures: string[] = [];

    if (!generatedDirectoryExists) failures.push("Generated book directory is missing.");
    if (!fs.existsSync(manifestPath)) failures.push("Generated manifest file is missing.");
    if (!fs.existsSync(processedBookPath)) failures.push("processed_book.json is missing.");
    if (!fs.existsSync(cleanedBookPath)) failures.push("cleaned_book.json is missing.");
    if (!fs.existsSync(rightsReportPath)) failures.push("rights_report.json is missing.");
    if (missingSectionFiles.length > 0) failures.push("One or more generated section JSON files are missing.");
    if (!libraryBySlug.has(slug)) failures.push("Library manifest entry is missing.");
    if (!previewEntry) failures.push("Preview manifest entry is missing.");
    if (!previewFileExists) failures.push("Preview file is missing.");
    if (previewContainsSosHelp) failures.push("Preview contains SOS Help fallback text.");
    if (previewUsesGenericFallback) failures.push("Preview uses generic fallback text.");
    if (previewEntry && previewEntry.contentHash !== manifest.contentHash) {
      failures.push("Preview manifest content hash does not match generated manifest.");
    }
    if (previewAsset && previewAsset.contentHash !== manifest.contentHash) {
      failures.push("Preview asset content hash does not match generated manifest.");
    }
    if (!firstDefaultSectionLikelyRealReadableContent) {
      failures.push("First startup/default section does not look like real readable book content.");
    }
    if (defaultPlaybackLeakage.sourceHeaderLicenseContributorTranscriberLeakage) {
      failures.push("Source/header/license/contributor/transcriber material appears in default playback.");
    }
    if (!previewStartsWithBookSpecificReadableContent) {
      failures.push("Preview does not start with book-specific readable generated content.");
    }

    if ((unresolvedSourceSlugs as readonly string[]).includes(slug)) {
      warnings.push("Source remains unresolved; generated book remains accepted but source debt is tracked.");
    }
    if (previewEntry && previewAsset && previewEntry.defaultSectionId !== previewAsset.defaultSectionId) {
      failures.push(
        `Preview manifest defaultSectionId ${previewEntry.defaultSectionId} differs from preview asset defaultSectionId ${previewAsset.defaultSectionId}.`,
      );
    }
    if (duplicateTitleSlugs.length || nearDuplicateSlugSlugs.length || duplicateGutenbergIdSlugs.length) {
      warnings.push("Duplicate or near-duplicate generated identity requires continued documentation.");
    }
    if (metadataWarnings.length > 0) warnings.push(...metadataWarnings);
    if (defaultPlaybackLeakage.tableOfContentsLeakage) {
      warnings.push("Table-of-contents-like material appears in default playback.");
    }
    if (defaultPlaybackLeakage.titlePageOrBylineMaterial) {
      warnings.push("Title-page/byline/front-matter material appears near default playback opening.");
    }
    if (firstSelectedDefaultDoesNotMatchGeneratedSourceOrder) {
      warnings.push("First selected/default section does not directly match generated source order.");
    }
    if (rawComparison.status === "sampled-warn") warnings.push(rawComparison.note);
    if (suspiciouslyLargeSections.length > 0) {
      warnings.push("One or more unusually large sections should remain visible to later review.");
    }
    const emptyOrMalformedDefaultSections = emptyOrMalformedSections.filter((sectionId) =>
      defaultPlaybackSections.some((section) => section.id === sectionId),
    );
    if (emptyOrMalformedDefaultSections.length > 0) {
      failures.push("One or more default generated sections are empty or malformed.");
    } else if (emptyOrMalformedSections.length > 0) {
      warnings.push("One or more non-default generated sections are empty or ornamental separators.");
    }

    const finalAuditStatus: AuditStatus =
      failures.length > 0 ? "fail-needs-fix" : warnings.length > 0 ? "warn-accepted" : "pass";
    const recommendedNextAction =
      finalAuditStatus === "fail-needs-fix"
        ? "fix generated book or preview defect before SEO summaries"
        : specialGroups.includes("unresolved-source-generated-book")
          ? "keep accepted and track future manual source resolution"
            : duplicateTitleSlugs.length || nearDuplicateSlugSlugs.length || duplicateGutenbergIdSlugs.length
            ? "keep accepted with duplicate or edition documentation"
            : metadataWarnings.length > 0
              ? "track metadata note before or during SEO summaries"
              : warnings.length > 0
                ? "no generated fix now; carry warning into SEO-summary planning"
                : "no action";

    books.push({
      slug,
      generatedTitle: manifest.title,
      contributorMetadata: contributorsFromRightsReport(manifest, rightsReport),
      generatedDirectoryExists,
      expectedGeneratedFilesExist: {
        manifest: fs.existsSync(manifestPath),
        processedBook: fs.existsSync(processedBookPath),
        cleanedBook: fs.existsSync(cleanedBookPath),
        rightsReport: fs.existsSync(rightsReportPath),
        allSectionFiles: missingSectionFiles.length === 0,
        missingSectionFiles,
      },
      manifestEntryExists: libraryBySlug.has(slug),
      previewFileExists,
      previewManifestEntryExists: Boolean(previewEntry),
      previewStartsWithBookSpecificReadableContent,
      previewContainsSosHelp,
      previewUsesGenericFallback,
      previewContentHashMatchesGeneratedManifest:
        Boolean(previewEntry && previewEntry.contentHash === manifest.contentHash) &&
        Boolean(previewAsset && previewAsset.contentHash === manifest.contentHash),
      firstDefaultSectionTitle: firstDefaultSummary?.title ?? firstDefaultSummary?.label ?? null,
      firstDefaultSectionOpeningText: compact(firstDefaultText, 260),
      firstDefaultSectionLikelyRealReadableContent,
      defaultPlaybackLeakage,
      sectionCount: manifest.sections.length,
      defaultSectionCount: defaultSections.length,
      totalWordCount: manifest.stats.wordCount,
      suspiciouslySmallSections,
      suspiciouslyLargeSections,
      emptyOrMalformedSections,
      firstSelectedDefaultDoesNotMatchGeneratedSourceOrder,
      sourceOrderNotes,
      duplicateNearDuplicateFlags: {
        duplicateTitleSlugs,
        nearDuplicateSlugSlugs,
        duplicateGutenbergIdSlugs,
      },
      metadataConfidence,
      metadataWarnings,
      rawSourceAvailability: {
        available: Boolean(rawItem?.rawSourceExists),
        path: rawItem?.rawSourcePath ?? null,
        triageCategory: rawItem?.primaryCategory ?? null,
      },
      rawSourceComparisonStatus: rawComparison.status,
      rawSourceComparisonNote: rawComparison.note,
      evidenceSnippets: {
        previewStart: compact(previewText, 220),
        generatedDefaultStart: compact(firstDefaultText, 220),
        rawComparisonStartPhrase: rawComparison.startPhrase,
        rawComparisonEndPhrase: rawComparison.endPhrase,
      },
      specialGroups,
      warnings: sortedUnique(warnings),
      failures: sortedUnique(failures),
      finalAuditStatus,
      recommendedNextAction,
    });
  }

  const counts = statusCounts(books);
  const generatedDirectoriesMissingFromLibraryManifest = generatedBookDirs.filter(
    (slug) => !librarySlugs.has(slug),
  );
  const libraryManifestEntriesMissingGeneratedDirectory = libraryManifest.books
    .map((book) => book.slug)
    .filter((slug) => !generatedBookDirSlugs.has(slug));
  const previewFilesMissingFromPreviewManifest = Array.from(previewFileSlugs)
    .filter((slug) => !previewManifestSlugs.has(slug))
    .sort();
  const previewManifestEntriesMissingPreviewFile = previewManifest.books
    .map((book) => book.slug)
    .filter((slug) => !previewFileSlugs.has(slug));

  const manifestIssues = [
    generatedBookDirs.length !== expectedGeneratedBookCount
      ? `Expected ${expectedGeneratedBookCount} generated books, found ${generatedBookDirs.length}.`
      : null,
    libraryManifest.books.length !== expectedGeneratedBookCount
      ? `Expected ${expectedGeneratedBookCount} library manifest entries, found ${libraryManifest.books.length}.`
      : null,
    previewFiles.length !== expectedGeneratedBookCount
      ? `Expected ${expectedGeneratedBookCount} preview files, found ${previewFiles.length}.`
      : null,
    previewManifest.books.length !== expectedGeneratedBookCount
      ? `Expected ${expectedGeneratedBookCount} preview manifest entries, found ${previewManifest.books.length}.`
      : null,
    generatedDirectoriesMissingFromLibraryManifest.length
      ? `Generated directories missing from library manifest: ${generatedDirectoriesMissingFromLibraryManifest.join(", ")}.`
      : null,
    libraryManifestEntriesMissingGeneratedDirectory.length
      ? `Library manifest entries missing generated directories: ${libraryManifestEntriesMissingGeneratedDirectory.join(", ")}.`
      : null,
    previewFilesMissingFromPreviewManifest.length
      ? `Preview files missing from preview manifest: ${previewFilesMissingFromPreviewManifest.join(", ")}.`
      : null,
    previewManifestEntriesMissingPreviewFile.length
      ? `Preview manifest entries missing preview files: ${previewManifestEntriesMissingPreviewFile.join(", ")}.`
      : null,
  ].filter((issue): issue is string => Boolean(issue));

  const unresolvedSummary = (unresolvedSourceSlugs as readonly string[]).map((slug) => {
    const book = books.find((candidate) => candidate.slug === slug);
    return {
      slug,
      generatedTitle: book?.generatedTitle ?? null,
      generatedAuthor: book?.contributorMetadata.author ?? [],
      previewValid:
        Boolean(book?.previewFileExists) &&
        Boolean(book?.previewManifestEntryExists) &&
        Boolean(book?.previewStartsWithBookSpecificReadableContent),
      defaultStartReadable: Boolean(book?.firstDefaultSectionLikelyRealReadableContent),
      sourceRemainsUnresolved: true,
      recommendation: "Stay accepted pending future manual source resolution.",
    };
  });

  const sourceHeaderLicenseTocLeakageFindings = books
    .filter(
      (book) =>
        book.defaultPlaybackLeakage.sourceHeaderLicenseContributorTranscriberLeakage ||
        book.defaultPlaybackLeakage.tableOfContentsLeakage,
    )
    .map((book) => ({
      slug: book.slug,
      evidence: book.defaultPlaybackLeakage.evidence,
      status: book.finalAuditStatus,
    }));
  const previewFindings = books
    .flatMap((book) => {
      const findings: AuditReport["previewFindings"] = [];
      if (!book.previewFileExists) findings.push({ slug: book.slug, issue: "Preview file is missing.", status: book.finalAuditStatus });
      if (!book.previewManifestEntryExists) findings.push({ slug: book.slug, issue: "Preview manifest entry is missing.", status: book.finalAuditStatus });
      if (book.previewContainsSosHelp) findings.push({ slug: book.slug, issue: "Preview contains SOS Help.", status: book.finalAuditStatus });
      if (book.previewUsesGenericFallback) findings.push({ slug: book.slug, issue: "Preview uses generic fallback text.", status: book.finalAuditStatus });
      for (const failure of book.failures) {
        if (failure.startsWith("Preview manifest defaultSectionId")) {
          findings.push({ slug: book.slug, issue: failure, status: book.finalAuditStatus });
        }
      }
      if (!book.previewStartsWithBookSpecificReadableContent) {
        findings.push({
          slug: book.slug,
          issue: "Preview did not validate as book-specific readable generated content.",
          status: book.finalAuditStatus,
        });
      }
      if (!book.previewContentHashMatchesGeneratedManifest) {
        findings.push({
          slug: book.slug,
          issue: "Preview content hash does not match generated manifest.",
          status: book.finalAuditStatus,
        });
      }
      return findings;
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
  const metadataFindings = books
    .flatMap((book) =>
      book.metadataWarnings.map((issue) => ({
        slug: book.slug,
        issue,
        status: book.finalAuditStatus,
      })),
    )
    .sort((a, b) => a.slug.localeCompare(b.slug));
  const startEndDefaultSectionFindings = books
    .flatMap((book) => {
      const findings: AuditReport["startEndDefaultSectionFindings"] = [];
      if (!book.firstDefaultSectionLikelyRealReadableContent) {
        findings.push({
          slug: book.slug,
          issue: "First startup/default section does not look readable.",
          status: book.finalAuditStatus,
        });
      }
      if (book.firstSelectedDefaultDoesNotMatchGeneratedSourceOrder) {
        findings.push({
          slug: book.slug,
          issue: book.sourceOrderNotes.join(" "),
          status: book.finalAuditStatus,
        });
      }
      if (book.suspiciouslyLargeSections.length > 0) {
        findings.push({
          slug: book.slug,
          issue: `Suspiciously large section(s): ${book.suspiciouslyLargeSections.join(", ")}.`,
          status: book.finalAuditStatus,
        });
      }
      if (book.emptyOrMalformedSections.length > 0) {
        findings.push({
          slug: book.slug,
          issue: `Empty or malformed section(s): ${book.emptyOrMalformedSections.join(", ")}.`,
          status: book.finalAuditStatus,
        });
      }
      return findings;
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const rawComparisonCounts = {
    exactSampledPass: books.filter((book) => book.rawSourceComparisonStatus === "exact/sampled-pass").length,
    sampledWarn: books.filter((book) => book.rawSourceComparisonStatus === "sampled-warn").length,
    unavailable: books.filter((book) => book.rawSourceComparisonStatus === "unavailable").length,
    notAttempted: books.filter((book) => book.rawSourceComparisonStatus === "not attempted").length,
    sampledWarnings: books
      .filter((book) => book.rawSourceComparisonStatus === "sampled-warn")
      .map((book) => ({ slug: book.slug, note: book.rawSourceComparisonNote }))
      .sort((a, b) => a.slug.localeCompare(b.slug)),
  };

  const recentBooks = books.filter((book) =>
    (recentBatch21To23Slugs as readonly string[]).includes(book.slug),
  );
  const lovecraftBooks = books.filter((book) => book.specialGroups.includes("lovecraft"));
  const wellsBooks = books.filter((book) => book.specialGroups.includes("wells"));
  const report: AuditReport = {
    schemaVersion: 1,
    reportName: "independent-second-pass-book-audit",
    generatedAt: new Date().toISOString(),
    branch: "morsewords-independent-second-pass-book-audit-jun-2026",
    mode: "report-only/independent-second-pass",
    sourcePaths: {
      generatedBooks: repoRelative(generatedRoot),
      previewAssets: repoRelative(previewRoot),
      rawSourceInput: repoRelative(tempBooksRoot),
      cloudflareExport: repoRelative(cloudflareExportRoot),
    },
    counts: {
      generatedBookDirectories: generatedBookDirs.length,
      generatedBooksInLibraryManifest: libraryManifest.books.length,
      previewAssetFiles: previewFiles.length,
      previewManifestEntries: previewManifest.books.length,
      pass: counts.pass,
      warnAccepted: counts.warnAccepted,
      failNeedsFix: counts.failNeedsFix,
      manualReview: counts.manualReview,
    },
    manifestConsistency: {
      result: manifestIssues.length === 0 ? "pass" : "fail",
      issues: manifestIssues,
      extraGeneratedDirectoriesWithoutManifest: extraGeneratedDirsWithoutManifest,
      generatedDirectoriesMissingFromLibraryManifest,
      libraryManifestEntriesMissingGeneratedDirectory,
      previewFilesMissingFromPreviewManifest,
      previewManifestEntriesMissingPreviewFile,
    },
    knownRemainingRawInventoryState: {
      totalRawFilesInspected: triageReport?.counts?.totalRawFilesInspected ?? null,
      zeroSafeDeterministicCandidatesRemain:
        Boolean(triageReport?.dryRun24Confirmation?.zeroSafeDeterministicCandidatesRemain),
      skippedUnsafeRawOnlyCandidates:
        triageReport?.dryRun24Confirmation?.skippedUnsafeRawOnlyCandidates ??
        triageReport?.counts?.dryRun24SkippedUnsafeRawOnlyCount ??
        null,
      unresolvedSourceGeneratedCount: triageReport?.counts?.unresolvedSourceGeneratedCount ?? null,
      duplicateNearDuplicateCount: triageReport?.counts?.duplicateNearDuplicateCount ?? null,
      boundaryDefectCount: triageReport?.counts?.boundaryDefectCount ?? null,
      triageRecommendedNextPhase: triageReport?.recommendedNextPhase?.recommendation ?? null,
    },
    batch12RestorationSummary: {
      compared: batch12Report?.scope?.batch12BooksCompared ?? null,
      remainingMismatches: batch12Report?.scope?.remainingBatch12RawVsGeneratedMismatches ?? null,
      status:
        batch12Report?.scope?.batch12BooksCompared === 20 &&
        batch12Report.scope.remainingBatch12RawVsGeneratedMismatches === 0
          ? "20/20 pass; no remaining raw/generated mismatches"
          : "needs review",
    },
    unresolvedSourceGeneratedBookSummary: {
      count: unresolvedSummary.length,
      books: unresolvedSummary,
    },
    duplicateNearDuplicateFindings: duplicateFindings,
    sourceHeaderLicenseTocLeakageFindings,
    previewFindings,
    metadataFindings,
    startEndDefaultSectionFindings,
    rawVsGeneratedComparisonSummary: rawComparisonCounts,
    specialGroupSummaries: {
      knownDuplicateBoundaryRawSkips: (knownDuplicateBoundaryRawSkipSlugs as readonly string[]).map(
        (slug) => ({
          slug,
          exactGeneratedSlugExists: generatedBookDirSlugs.has(slug),
          note:
            slug === "the-wind-in-the-willows" && generatedBookDirSlugs.has("wind-in-the-willows")
              ? "Exact raw skip slug absent; documented generated canonical slug wind-in-the-willows exists."
              : generatedBookDirSlugs.has(slug)
                ? "Exact skip slug is unexpectedly generated and should be reviewed."
                : "Exact skip slug is not generated as a separate unintended book.",
        }),
      ),
      recentBatches21To23: {
        requestedCount: recentBatch21To23Slugs.length,
        foundCount: recentBooks.length,
        missingSlugs: (recentBatch21To23Slugs as readonly string[]).filter(
          (slug) => !librarySlugs.has(slug),
        ),
        statuses: makeStatusRecord(recentBooks),
      },
      lovecraftTitles: {
        count: lovecraftBooks.length,
        authorMetadataWarnings: lovecraftBooks
          .filter((book) => !book.contributorMetadata.author.join(" ").includes("Lovecraft"))
          .map((book) => `${book.slug}: ${book.contributorMetadata.author.join("; ") || "missing"}`),
        statuses: makeStatusRecord(lovecraftBooks),
      },
      wellsTitles: {
        count: wellsBooks.length,
        authorMetadataWarnings: wellsBooks
          .filter((book) => !/\bWells\b/.test(book.contributorMetadata.author.join(" ")))
          .map((book) => `${book.slug}: ${book.contributorMetadata.author.join("; ") || "missing"}`),
        statuses: makeStatusRecord(wellsBooks),
      },
    },
    recommendedNextPhase: recommendNextPhase(books),
    laterPhaseRequirementsRestatedOnly: [
      "Original non-spoiler 300-500+ word SEO summaries after second-pass audit.",
      "Full site SEO/meta review using GSC data and route intent after summaries.",
      "Focused rage-click UX pass for /audio, /practice, homepage, and related utility pages after books/SEO.",
      "SSR heap OOM investigation separately.",
      "In-app Browser sandbox issue investigation separately.",
      "Intermittent fullscreen Playwright/UI behavior investigation separately.",
      "Final cleanup only after the system is stable.",
    ],
    protectedPathConfirmation:
      "Report-only audit. No generated books, previews, raw sources, or Cloudflare exports were modified by this script.",
    books,
  };

  writeJson(reportJsonPath, report);
  writeText(reportMdPath, buildMarkdown(report));

  console.log("independent second-pass book audit complete");
  console.log(`generated books: ${report.counts.generatedBookDirectories}`);
  console.log(`preview assets: ${report.counts.previewAssetFiles}`);
  console.log(
    `status: ${report.counts.pass} pass, ${report.counts.warnAccepted} warn-accepted, ${report.counts.failNeedsFix} fail-needs-fix, ${report.counts.manualReview} manual-review`,
  );
  console.log(`recommended next phase: ${report.recommendedNextPhase}`);
  console.log(`report: ${repoRelative(reportJsonPath)}`);
}

main();
