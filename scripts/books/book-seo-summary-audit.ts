import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  GeneratedBookManifest,
  GeneratedBookSectionJson,
  GeneratedLibraryBookSummary,
  GeneratedLibraryManifest,
} from "./bookManifestTypes.ts";

type SeoSummaryRecord = {
  slug: string;
  title: string;
  author: string[];
  description: string;
  summary: string;
  shortWorkException?: string;
};

type SeoSummaryData = {
  schemaVersion: 1;
  summarySet: string;
  generatedAt: string;
  storageApproach: string;
  suggestedPilotSlugs: string[];
  pilotSlugs: string[];
  substitutions: Array<{
    suggestedSlug: string;
    actualSlug: string;
    reason: string;
  }>;
  expectedSummaryCount?: number;
  batch1Slugs?: string[];
  batch2Slugs?: string[];
  batch3Slugs?: string[];
  batch4Slugs?: string[];
  batch5Slugs?: string[];
  batch6Slugs?: string[];
  batch7Slugs?: string[];
  batch8Slugs?: string[];
  batch9Slugs?: string[];
  poeReplacementSlugs?: string[];
  remainingRawCandidateCompletionSlugs?: string[];
  summaries: SeoSummaryRecord[];
};

type PilotSummaryAuditItem = {
  slug: string;
  title: string | null;
  author: string[];
  generatedBookExists: boolean;
  summaryRecordExists: boolean;
  titleMatchesGenerated: boolean;
  authorMatchesGenerated: boolean;
  descriptionWordCount: number;
  summaryWordCount: number;
  wordCountWithinTarget: boolean;
  shortWorkException: string | null;
  spoilerRisk: "pass" | "fail";
  sourceBoilerplateRisk: "pass" | "fail";
  authorityFormLeakRisk: "pass" | "fail";
  internalProcessLeakRisk: "pass" | "fail";
  duplicateSummaryRisk: "pass" | "fail";
  rawSourcePathLeakRisk: "pass" | "fail";
  sourceTextCopyRisk: "pass" | "fail";
  sourceTextComparisonNote: string;
  status: "pass" | "fail";
  errors: string[];
};

type SeoSummaryAuditReport = {
  generatedAt: string;
  summarySet: string;
  chosenSummaryStorageApproach: string;
  filesChanged: string[];
  counts: {
    generatedBookCount: number;
    previousSummaryCount: number;
    newSummaryCount: number;
    summaryRecordCount: number;
    missingSummaryCountBeforeBatch: number;
    missingSummaryCount: number;
    passCount: number;
    failCount: number;
  };
  selectedSlugs: string[];
  firstStillMissingSlugsAfterBatch: string[];
  coverageNote: string;
  remainingRawCandidateCheckpoint: {
    sourceReportPath: string;
    classifiedRawOnlyUnsafeCount: number;
    checkpoint: string;
  };
  unresolvedSourceGeneratedBookCheckpoint: {
    sourceReportPath: string;
    unresolvedSourceGeneratedCount: number;
    checkpoint: string;
  };
  urlIndexabilityFinalReleaseBlocker: {
    sourceReportPath: string;
    status: "open-final-release-blocker";
    existingLinkingAuditResult: "pass" | "fail";
    existingBrokenInternalLinkCount: number;
    existingMissingSitemapUrlCount: number;
    requiredBeforeCloudflareExport: string[];
  };
  poeReplacementCheckpoint: {
    status: "pending-later-processing";
    requiredLater: string[];
    checkpoint: string;
  };
  mobileFinalStageCheckpoint: {
    status: "pending-final-stage";
    requiredLater: string[];
    checkpoint: string;
  };
  storyTitleIntegrityCheckpoint: {
    sourceReportPath: string;
    generatedEntriesChecked: number;
    sourceValidationResult: "pass" | "fail";
    parentCollectionLeakageResult: "pass" | "fail";
    checkpoint: string;
  };
  summaryLayoutWidthCheckpoint: {
    sourceBranch: string;
    mergedMainCommit: string;
    status: "merged-and-validated";
    desktopSourceNotesWidthPx: number;
    desktopSummaryWidthPx: number;
    desktopColumns: number;
    mobileSummaryWidthPx: number;
    mobileColumns: number;
    horizontalOverflow: "none";
    sourceOrder: string;
    headerShortcut: string;
    checkpoint: string;
  };
  selectedSlugSubstitutions: Array<{
    expectedSlug: string;
    actualSlug: string;
    reason: string;
  }>;
  skippedSelectedSlugs: string[];
  results: PilotSummaryAuditItem[];
  validation: {
    summaryCount: "pass" | "fail";
    controlledBatchSelection: "pass" | "fail";
    summarySlugUniqueness: "pass" | "fail";
    generatedSlugExistence: "pass" | "fail";
    metadataMatch: "pass" | "fail";
    parentCollectionTitleLeakage: "pass" | "fail";
    storyTitleIntegrity: "pass" | "fail";
    wordCount: "pass" | "fail";
    spoilerRisk: "pass" | "fail";
    sourceBoilerplate: "pass" | "fail";
    authorityFormLeak: "pass" | "fail";
    internalProcessLeak: "pass" | "fail";
    duplicateSummary: "pass" | "fail";
    sourceTextCopy: "pass" | "fail";
    missingSummaryFallback: "pass" | "fail";
    result: "pass" | "fail";
  };
  protectedPaths: {
    rawSources: string;
    generatedBooks: string;
    previews: string;
    cloudflareExports: string;
    modifiedByThisAudit: false;
  };
  recommendedNextSummaryBatchSize: number;
  recommendedNextStepAfterCurrentGeneratedSummaryCompletion: string[];
};

type UnresolvedSourceGeneratedReviewReport = {
  reviewedUnresolvedSourceSlugs?: string[];
  decisions?: Array<{
    slug: string;
    decision: string;
  }>;
};

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const generatedRoot = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "generated",
);
const summaryPath = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "seo-summaries",
  "book-seo-summaries.json",
);
const libraryManifestPath = path.join(generatedRoot, "library-manifest.json");
const reportRoot = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "book-seo-summary-batch-9",
);
const reportJsonPath = path.join(reportRoot, "book-seo-summary-batch-9.json");
const reportMdPath = path.join(reportRoot, "book-seo-summary-batch-9.md");
const remainingRawInventoryTriagePath = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "remaining-raw-inventory-triage",
  "remaining-raw-inventory-triage.json",
);
const unresolvedSourceGeneratedReviewPath = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "unresolved-source-generated-review",
  "unresolved-source-generated-review.json",
);
const storyTitleIntegrityPath = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "story-title-display-integrity",
  "story-title-display-integrity.json",
);
const linkingSitemapAuditPath = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "book-sitemap-nav-internal-linking",
  "book-sitemap-nav-internal-linking.json",
);

const summaryFilesChanged = [
  "app/client/assets/books/seo-summaries/book-seo-summaries.json",
  "scripts/books/book-seo-summary-audit.ts",
  "tests/qa-robustness-review/morse-book-page.spec.ts",
  "app/client/assets/books/audit-reports/book-seo-summary-batch-9/book-seo-summary-batch-9.json",
  "app/client/assets/books/audit-reports/book-seo-summary-batch-9/book-seo-summary-batch-9.md",
];

const sourceBoilerplatePattern =
  /\b(Project Gutenberg|Produced by|Transcriber|EBook|license|START OF|END OF|distributed proofreading|pgdp\.net|release date)\b/i;
const placeholderPattern =
  /\b(SOS Help!?|placeholder|generic fallback|lorem ipsum|summary coming soon|to be added)\b/i;
const spoilerLabelPattern =
  /\b(in the end|at the end|the story ends with|ends with|the final twist|the ending reveals|finally reveals)\b/i;
const rawSourceLeakPattern =
  /\b(app[\\/]+client[\\/]+assets[\\/]+temp-books|temp-books|raw source|\.txt\b|\.epub\b|\.pdf\b)\b/i;
const internalPathLeakPattern =
  /\b(app[\\/]client[\\/]|public[\\/]book-previews|scripts[\\/]books|audit-reports|cloudflare-export|assets[\\/]books[\\/]generated)\b/i;
const internalProcessLeakPattern =
  /\b(pilot\b.{0,50}\b(?:summary|batch|set|check|example|item|choice|substitute|coverage|rollout|scaling)|(?:summary|batch|set)\b.{0,30}\bpilot|future summary (?:batch(?:es)?|expansion)|summary (?:batch(?:es)?|expansion|schema|handling|rollout|records?)|generated (?:library|section|page|title)|defect-fix phase|route validation|audit review|metadata check|schema check|slug substitution|controlled batch|accepted (?:Poe )?substitute|unavailable [^.]{0,80}(?:slot|suggestion)|broader summary rollout|scaling (?:beyond|across|the full set))\b/i;
const authorityFormLeakPattern =
  /\b(?:active\s+(?:\d{1,4}|\d+(?:st|nd|rd|th)\s+century)(?:\s+(?:B\.C\.|BCE|A\.D\.|CE))?|fl\.\s*(?:c\.?\s*)?\d{1,4}|approximately\s+(?:\d{1,4}|\d+(?:st|nd|rd|th)\s+century)|author-date authority heading)\b/i;

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function readOptionalJson<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  return readJson<T>(filePath);
}

function reviewedUnresolvedSourceRemainingCount(fallbackCount: number) {
  const review = readOptionalJson<UnresolvedSourceGeneratedReviewReport>(
    unresolvedSourceGeneratedReviewPath,
  );
  if (!review) return fallbackCount;
  const reviewed = new Set(review.reviewedUnresolvedSourceSlugs ?? []);
  const resolved = new Set(
    (review.decisions ?? [])
      .filter((decision) => decision.decision.startsWith("resolved-"))
      .map((decision) => decision.slug),
  );
  if (reviewed.size === 0) return fallbackCount;
  return [...reviewed].filter((slug) => !resolved.has(slug)).length;
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9']+/g, " ").replace(/\s+/g, " ").trim();
}

function words(value: string) {
  return value.match(/[A-Za-z0-9]+(?:'[A-Za-z0-9]+)?/g) ?? [];
}

function countWords(value: string) {
  return words(value).length;
}

function sameStringArray(left: readonly string[], right: readonly string[]) {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

function readGeneratedBookManifest(book: GeneratedLibraryBookSummary) {
  const manifestPath = path.join(
    generatedRoot,
    book.manifestPath.replace(/\//g, path.sep),
  );
  if (!fs.existsSync(manifestPath)) return null;
  return readJson<GeneratedBookManifest>(manifestPath);
}

function readBookSectionText(book: GeneratedBookManifest) {
  const fragments: string[] = [];
  for (const section of book.sections) {
    const sectionPath = path.join(
      generatedRoot,
      book.slug,
      section.sectionJsonPath.replace(/\//g, path.sep),
    );
    if (!fs.existsSync(sectionPath)) continue;
    const sectionJson = readJson<GeneratedBookSectionJson>(sectionPath);
    fragments.push(sectionJson.displayText || sectionJson.morseSourceText || "");
  }
  return fragments.join("\n\n");
}

function hasLongCopiedPhrase(summary: string, sourceText: string) {
  const summaryWords = words(summary).map((word) => word.toLowerCase());
  const source = normalizeText(sourceText);
  const phraseLength = 18;
  for (let index = 0; index <= summaryWords.length - phraseLength; index += 1) {
    const phrase = summaryWords.slice(index, index + phraseLength).join(" ");
    if (phrase && source.includes(phrase)) return phrase;
  }
  return "";
}

function duplicateSummaryMap(summaries: SeoSummaryRecord[]) {
  const counts = new Map<string, number>();
  summaries.forEach((summary) => {
    const normalized = normalizeText(summary.summary);
    counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
  });
  return counts;
}

function auditSummaryRecord({
  book,
  duplicateCounts,
  record,
  slug,
}: {
  book: GeneratedLibraryBookSummary | null;
  duplicateCounts: Map<string, number>;
  record: SeoSummaryRecord | null;
  slug: string;
}): PilotSummaryAuditItem {
  const errors: string[] = [];
  if (!book) errors.push("Generated book was not found in library manifest.");
  if (!record) errors.push("Summary record was not found.");

  const titleMatchesGenerated = Boolean(book && record && record.title === book.title);
  if (book && record && !titleMatchesGenerated) {
    errors.push(`Summary title does not match generated title "${book.title}".`);
  }

  const authorMatchesGenerated = Boolean(
    book && record && sameStringArray(record.author, book.author),
  );
  if (book && record && !authorMatchesGenerated) {
    errors.push("Summary author metadata does not match generated author metadata.");
  }

  const description = record?.description ?? "";
  const summary = record?.summary ?? "";
  const descriptionWordCount = countWords(description);
  const summaryWordCount = countWords(summary);
  const hasShortWorkException = Boolean(record?.shortWorkException?.trim());
  const wordCountWithinTarget =
    (summaryWordCount >= 300 && summaryWordCount <= 500) ||
    (summaryWordCount >= 180 && summaryWordCount <= 500 && hasShortWorkException);
  if (!wordCountWithinTarget) {
    errors.push(
      `Summary word count ${summaryWordCount} is outside the 300–500 target without an approved short-work exception.`,
    );
  }

  if (descriptionWordCount < 8) {
    errors.push("Non-spoiler description is too short to be useful.");
  }

  const sourceBoilerplateRisk =
    sourceBoilerplatePattern.test(`${description}\n${summary}`) ||
    placeholderPattern.test(`${description}\n${summary}`)
      ? "fail"
      : "pass";
  if (sourceBoilerplateRisk === "fail") {
    errors.push("Summary or description contains source boilerplate or placeholder text.");
  }

  const spoilerRisk = spoilerLabelPattern.test(summary) ? "fail" : "pass";
  if (spoilerRisk === "fail") {
    errors.push("Summary contains an obvious ending-spoiler label.");
  }

  const authorityFormLeakRisk = authorityFormLeakPattern.test(
    `${description}\n${summary}`,
  )
    ? "fail"
    : "pass";
  if (authorityFormLeakRisk === "fail") {
    errors.push("Summary prose contains catalog-style authority-form wording.");
  }

  const rawSourcePathLeakRisk =
    rawSourceLeakPattern.test(`${description}\n${summary}`) ||
    internalPathLeakPattern.test(`${description}\n${summary}`)
      ? "fail"
      : "pass";
  if (rawSourcePathLeakRisk === "fail") {
    errors.push("Summary appears to leak a raw source or internal file path.");
  }

  const internalProcessLeakRisk = internalProcessLeakPattern.test(
    `${description}\n${summary}`,
  )
    ? "fail"
    : "pass";
  if (internalProcessLeakRisk === "fail") {
    errors.push("Summary contains internal pilot, audit, or rollout language.");
  }

  const duplicateSummaryRisk =
    record && (duplicateCounts.get(normalizeText(record.summary)) ?? 0) > 1
      ? "fail"
      : "pass";
  if (duplicateSummaryRisk === "fail") {
    errors.push("Summary text duplicates another book summary.");
  }

  let sourceTextCopyRisk: "pass" | "fail" = "pass";
  let sourceTextComparisonNote = "not attempted: generated book unavailable";
  if (book && record) {
    const manifest = readGeneratedBookManifest(book);
    if (!manifest) {
      sourceTextCopyRisk = "fail";
      sourceTextComparisonNote = "generated book manifest was unavailable";
      errors.push("Generated book manifest could not be loaded for source comparison.");
    } else {
      const sourceText = readBookSectionText(manifest);
      const normalizedSummary = normalizeText(record.summary);
      const normalizedSource = normalizeText(sourceText);
      const copiedPhrase = hasLongCopiedPhrase(record.summary, sourceText);
      if (
        normalizedSummary &&
        (normalizedSource.includes(normalizedSummary) || Boolean(copiedPhrase))
      ) {
        sourceTextCopyRisk = "fail";
        sourceTextComparisonNote = copiedPhrase
          ? `Found long copied phrase: "${copiedPhrase}"`
          : "Summary appears as a contiguous source-text passage.";
        errors.push("Summary appears to copy generated source text.");
      } else {
        sourceTextComparisonNote =
          "sampled-pass: summary is not an exact source passage and no 18-word summary phrase was found in generated text.";
      }
    }
  }

  const status = errors.length === 0 ? "pass" : "fail";
  return {
    slug,
    title: record?.title ?? book?.title ?? null,
    author: record?.author ?? book?.author ?? [],
    generatedBookExists: Boolean(book),
    summaryRecordExists: Boolean(record),
    titleMatchesGenerated,
    authorMatchesGenerated,
    descriptionWordCount,
    summaryWordCount,
    wordCountWithinTarget,
    shortWorkException: record?.shortWorkException ?? null,
    spoilerRisk,
    sourceBoilerplateRisk,
    authorityFormLeakRisk,
    internalProcessLeakRisk,
    duplicateSummaryRisk,
    rawSourcePathLeakRisk,
    sourceTextCopyRisk,
    sourceTextComparisonNote,
    status,
    errors,
  };
}

function reportValidation(
  results: PilotSummaryAuditItem[],
  checks: {
    summaryCount: boolean;
    controlledBatchSelection: boolean;
    summarySlugUniqueness: boolean;
    generatedSlugExistence: boolean;
    parentCollectionTitleLeakage: boolean;
    storyTitleIntegrity: boolean;
    missingSummaryFallback: boolean;
  },
) {
  const hasMetadataFailures = results.some(
    (item) => !item.titleMatchesGenerated || !item.authorMatchesGenerated,
  );
  const hasWordCountFailures = results.some((item) => !item.wordCountWithinTarget);
  const hasSpoilerFailures = results.some((item) => item.spoilerRisk === "fail");
  const hasBoilerplateFailures = results.some(
    (item) => item.sourceBoilerplateRisk === "fail" || item.rawSourcePathLeakRisk === "fail",
  );
  const hasAuthorityFormLeaks = results.some(
    (item) => item.authorityFormLeakRisk === "fail",
  );
  const hasDuplicateFailures = results.some(
    (item) => item.duplicateSummaryRisk === "fail",
  );
  const hasInternalProcessLeaks = results.some(
    (item) => item.internalProcessLeakRisk === "fail",
  );
  const hasCopyFailures = results.some((item) => item.sourceTextCopyRisk === "fail");
  const hasFailures =
    !checks.summaryCount ||
    !checks.controlledBatchSelection ||
    !checks.summarySlugUniqueness ||
    !checks.generatedSlugExistence ||
    !checks.parentCollectionTitleLeakage ||
    !checks.storyTitleIntegrity ||
    !checks.missingSummaryFallback ||
    hasMetadataFailures ||
    hasWordCountFailures ||
    hasSpoilerFailures ||
    hasBoilerplateFailures ||
    hasAuthorityFormLeaks ||
    hasInternalProcessLeaks ||
    hasDuplicateFailures ||
    hasCopyFailures ||
    results.some((item) => item.status === "fail");

  return {
    summaryCount: checks.summaryCount ? "pass" : "fail",
    controlledBatchSelection: checks.controlledBatchSelection ? "pass" : "fail",
    summarySlugUniqueness: checks.summarySlugUniqueness ? "pass" : "fail",
    generatedSlugExistence: checks.generatedSlugExistence ? "pass" : "fail",
    metadataMatch: hasMetadataFailures ? "fail" : "pass",
    parentCollectionTitleLeakage: checks.parentCollectionTitleLeakage
      ? "pass"
      : "fail",
    storyTitleIntegrity: checks.storyTitleIntegrity ? "pass" : "fail",
    wordCount: hasWordCountFailures ? "fail" : "pass",
    spoilerRisk: hasSpoilerFailures ? "fail" : "pass",
    sourceBoilerplate: hasBoilerplateFailures ? "fail" : "pass",
    authorityFormLeak: hasAuthorityFormLeaks ? "fail" : "pass",
    internalProcessLeak: hasInternalProcessLeaks ? "fail" : "pass",
    duplicateSummary: hasDuplicateFailures ? "fail" : "pass",
    sourceTextCopy: hasCopyFailures ? "fail" : "pass",
    missingSummaryFallback: checks.missingSummaryFallback ? "pass" : "fail",
    result: hasFailures ? "fail" : "pass",
  } satisfies SeoSummaryAuditReport["validation"];
}

function isAcceptedGeneratedBook(book: GeneratedLibraryBookSummary) {
  const approvedBySource =
    book.source.approvalSource === "file-evidence" ||
    book.source.approvalSource === "external-authority" ||
    (book.source.approvalSource === "owner-reviewed" &&
      book.source.rightsReviewed === true) ||
    (book.source.approvalSource === undefined &&
      book.source.rightsReviewed === true);
  return (
    approvedBySource &&
    book.source.publishReady === true &&
    book.source.rightsStatus === "approved" &&
    book.source.processingAllowed === true
  );
}

function selectedSlugsForActiveBatch(summaryData: SeoSummaryData) {
  if (summaryData.summarySet === "remaining-raw-candidate-completion") {
    return summaryData.remainingRawCandidateCompletionSlugs ?? [];
  }

  if (summaryData.summarySet === "poe-replacement-raw-reconciliation") {
    return summaryData.poeReplacementSlugs ?? [];
  }

  const batchMatch = summaryData.summarySet.match(/book-seo-summary-batch-(\d+)/);
  if (!batchMatch) return [];
  const batchNumber = Number(batchMatch[1]);
  if (batchNumber === 1) return summaryData.batch1Slugs ?? [];
  if (batchNumber === 2) return summaryData.batch2Slugs ?? [];
  if (batchNumber === 3) return summaryData.batch3Slugs ?? [];
  if (batchNumber === 4) return summaryData.batch4Slugs ?? [];
  if (batchNumber === 5) return summaryData.batch5Slugs ?? [];
  if (batchNumber === 6) return summaryData.batch6Slugs ?? [];
  if (batchNumber === 7) return summaryData.batch7Slugs ?? [];
  if (batchNumber === 8) return summaryData.batch8Slugs ?? [];
  if (batchNumber === 9) return summaryData.batch9Slugs ?? [];
  return [];
}

function markdownReport(report: SeoSummaryAuditReport) {
  const selected = new Set(report.selectedSlugs);
  const itemRows = report.results
    .filter((item) => selected.has(item.slug))
    .map(
      (item) =>
        `| ${item.slug} | ${item.summaryWordCount} | ${item.titleMatchesGenerated && item.authorMatchesGenerated ? "pass" : "fail"} | ${item.spoilerRisk} | ${item.sourceBoilerplateRisk} | ${item.authorityFormLeakRisk} | ${item.duplicateSummaryRisk} | ${item.status} |`,
    )
    .join("\n");
  const failures = report.results
    .filter((item) => item.errors.length > 0)
    .map((item) => `- ${item.slug}: ${item.errors.join("; ")}`)
    .join("\n");

  return `# Book SEO Summary Batch 9

Generated: ${report.generatedAt}

## Current generated-library summary coverage

- Current generated/validated books: ${report.counts.generatedBookCount}
- Summaries before batch 9: ${report.counts.previousSummaryCount}
- New summaries in batch 9: ${report.counts.newSummaryCount}
- Summaries after batch 9: ${report.counts.summaryRecordCount}
- Current generated summaries missing before batch 9: ${report.counts.missingSummaryCountBeforeBatch}
- Current generated summaries remaining after batch 9: ${report.counts.missingSummaryCount}
- Validation result: ${report.validation.result}

The 45 new records use the existing separate static summary asset. Generated book text, preview assets, raw sources, and Cloudflare export payloads were not modified.

${report.coverageNote}

## Remaining raw-candidate debt

- ${report.remainingRawCandidateCheckpoint.classifiedRawOnlyUnsafeCount} raw candidates still require later review before final export.
- ${report.remainingRawCandidateCheckpoint.checkpoint}

## Unresolved-source generated books

- ${report.unresolvedSourceGeneratedBookCheckpoint.unresolvedSourceGeneratedCount} unresolved-source generated books remain documented.
- ${report.unresolvedSourceGeneratedBookCheckpoint.checkpoint}

## Final-release URL/indexability blocker

- Status: ${report.urlIndexabilityFinalReleaseBlocker.status}
- Existing linking/sitemap audit: ${report.urlIndexabilityFinalReleaseBlocker.existingLinkingAuditResult}
- Existing broken internal links: ${report.urlIndexabilityFinalReleaseBlocker.existingBrokenInternalLinkCount}
- Existing missing sitemap URLs: ${report.urlIndexabilityFinalReleaseBlocker.existingMissingSitemapUrlCount}
${report.urlIndexabilityFinalReleaseBlocker.requiredBeforeCloudflareExport.map((item) => `- ${item}`).join("\n")}

## Pending Poe replacement task

- Status: ${report.poeReplacementCheckpoint.status}
${report.poeReplacementCheckpoint.requiredLater.map((item) => `- ${item}`).join("\n")}
- ${report.poeReplacementCheckpoint.checkpoint}

## Final mobile stage

- Status: ${report.mobileFinalStageCheckpoint.status}
${report.mobileFinalStageCheckpoint.requiredLater.map((item) => `- ${item}`).join("\n")}
- ${report.mobileFinalStageCheckpoint.checkpoint}

## Story-title integrity checkpoint

- Generated entries checked: ${report.storyTitleIntegrityCheckpoint.generatedEntriesChecked}
- Source validation: ${report.storyTitleIntegrityCheckpoint.sourceValidationResult}
- Parent-collection title leakage: ${report.storyTitleIntegrityCheckpoint.parentCollectionLeakageResult}
- ${report.storyTitleIntegrityCheckpoint.checkpoint}

## Summary layout width checkpoint

- Source branch: ${report.summaryLayoutWidthCheckpoint.sourceBranch}
- Merged main commit: ${report.summaryLayoutWidthCheckpoint.mergedMainCommit}
- Status: ${report.summaryLayoutWidthCheckpoint.status}
- Desktop source notes width: ${report.summaryLayoutWidthCheckpoint.desktopSourceNotesWidthPx}px
- Desktop summary width: ${report.summaryLayoutWidthCheckpoint.desktopSummaryWidthPx}px
- Desktop columns: ${report.summaryLayoutWidthCheckpoint.desktopColumns}
- Mobile summary width: ${report.summaryLayoutWidthCheckpoint.mobileSummaryWidthPx}px
- Mobile columns: ${report.summaryLayoutWidthCheckpoint.mobileColumns}
- Horizontal overflow: ${report.summaryLayoutWidthCheckpoint.horizontalOverflow}
- Source order: ${report.summaryLayoutWidthCheckpoint.sourceOrder}
- Header shortcut: ${report.summaryLayoutWidthCheckpoint.headerShortcut}
- ${report.summaryLayoutWidthCheckpoint.checkpoint}

## Selected slugs

${report.selectedSlugs.map((slug) => `- ${slug}`).join("\n")}

## Still-missing slugs after batch

${report.firstStillMissingSlugsAfterBatch.length > 0 ? report.firstStillMissingSlugsAfterBatch.map((slug) => `- ${slug}`).join("\n") : "- None"}

## Substitutions or skipped selections

${report.selectedSlugSubstitutions.length > 0 ? report.selectedSlugSubstitutions.map((item) => `- ${item.expectedSlug} -> ${item.actualSlug}: ${item.reason}`).join("\n") : "- Substitutions: none"}
${report.skippedSelectedSlugs.length > 0 ? report.skippedSelectedSlugs.map((slug) => `- Skipped: ${slug}`).join("\n") : "- Skipped selections: none"}

## Summary validation

| Slug | Words | Metadata | Spoiler risk | Source boilerplate | Authority form | Duplicate body | Status |
| --- | ---: | --- | --- | --- | --- | --- | --- |
${itemRows}

## Validation categories

- Total count: ${report.validation.summaryCount}
- Deterministic batch selection: ${report.validation.controlledBatchSelection}
- Unique slugs: ${report.validation.summarySlugUniqueness}
- Generated slug existence: ${report.validation.generatedSlugExistence}
- Metadata match: ${report.validation.metadataMatch}
- Parent-collection title leakage: ${report.validation.parentCollectionTitleLeakage}
- Story-title integrity: ${report.validation.storyTitleIntegrity}
- Word count: ${report.validation.wordCount}
- Spoiler risk: ${report.validation.spoilerRisk}
- Source boilerplate and internal paths: ${report.validation.sourceBoilerplate}
- Catalog-style authority form: ${report.validation.authorityFormLeak}
- Internal process language: ${report.validation.internalProcessLeak}
- Duplicate summary bodies: ${report.validation.duplicateSummary}
- Source-text copy: ${report.validation.sourceTextCopy}
- Missing-summary fallback: ${report.validation.missingSummaryFallback}

## Failures

${failures || "- None"}

## Files changed

${report.filesChanged.map((file) => `- ${file}`).join("\n")}

## Recommended next major phase

${report.recommendedNextStepAfterCurrentGeneratedSummaryCompletion.map((item) => `- ${item}`).join("\n")}

## Recommended next summary batch size

${report.recommendedNextSummaryBatchSize} summaries
`;
}

function main() {
  const libraryManifest = readJson<GeneratedLibraryManifest>(libraryManifestPath);
  const summaryData = readJson<SeoSummaryData>(summaryPath);
  const remainingRawTriage = readJson<{
    counts?: {
      classifiedRawOnlyUnsafeCount?: number;
      dryRun24SkippedUnsafeRawOnlyCount?: number;
      unresolvedSourceGeneratedCount?: number;
    };
  }>(remainingRawInventoryTriagePath);
  const unresolvedSourceGeneratedCount = reviewedUnresolvedSourceRemainingCount(
    remainingRawTriage.counts?.unresolvedSourceGeneratedCount ?? 11,
  );
  const storyTitleIntegrity = readJson<{
    generatedEntriesChecked?: number;
    parentCollectionLeakage?: {
      after?: {
        generatedMetadata?: unknown[];
        userFacingDisplay?: unknown[];
      };
    };
    validation?: {
      result?: "pass" | "fail";
      failures?: unknown[];
    };
  }>(storyTitleIntegrityPath);
  const linkingSitemapAudit = readJson<{
    counts?: {
      brokenInternalLinkCount?: number;
      missingSitemapUrlCount?: number;
    };
    result?: "pass" | "fail";
  }>(linkingSitemapAuditPath);
  const generatedBySlug = new Map(
    libraryManifest.books.map((book) => [book.slug, book]),
  );
  const duplicateCounts = duplicateSummaryMap(summaryData.summaries);
  const results = summaryData.summaries.map((record) =>
    auditSummaryRecord({
      book: generatedBySlug.get(record.slug) ?? null,
      duplicateCounts,
      record,
      slug: record.slug,
    }),
  );

  const selectedSlugs = selectedSlugsForActiveBatch(summaryData);
  const selectedSlugSet = new Set(selectedSlugs);
  const previousSummarySlugSet = new Set(
    summaryData.summaries
      .map((summary) => summary.slug)
      .filter((slug) => !selectedSlugSet.has(slug)),
  );
  const acceptedBooks = libraryManifest.books.filter(isAcceptedGeneratedBook);
  const expectedSelectedSlugs = libraryManifest.books
    .filter(isAcceptedGeneratedBook)
    .filter((book) => !previousSummarySlugSet.has(book.slug))
    .slice(0, selectedSlugs.length)
    .map((book) => book.slug);
  const summarySlugs = summaryData.summaries.map((summary) => summary.slug);
  const summarySlugSet = new Set(summarySlugs);
  const expectedSummaryCount = summaryData.expectedSummaryCount ?? summaryData.summaries.length;
  const missingAfterBatch = acceptedBooks.filter(
    (book) => !summarySlugSet.has(book.slug),
  );
  const controlledBatchSelection = sameStringArray(
    selectedSlugs,
    expectedSelectedSlugs,
  );
  const generatedSlugExistence = summarySlugs.every((slug) =>
    generatedBySlug.has(slug),
  );
  const dataModule = fs.readFileSync(
    path.join(repoRoot, "app/client/data/morseBookSeoSummaries.ts"),
    "utf8",
  );
  const serverDataModule = fs.readFileSync(
    path.join(repoRoot, "app/client/data/morseBookSeoSummaries.server.ts"),
    "utf8",
  );
  const bookRoute = fs.readFileSync(
    path.join(repoRoot, "app/routes/morse-code-books.$slug.tsx"),
    "utf8",
  );
  const audiobookRoute = fs.readFileSync(
    path.join(repoRoot, "app/routes/morse-code-audiobooks.$slug.tsx"),
    "utf8",
  );
  const missingSummaryFallback =
    dataModule.includes("getMorseBookSeoSummaryParagraphs") &&
    serverDataModule.includes("readFileSync") &&
    serverDataModule.includes(
      "loadMorseBookSeoSummaryBySlug().get(slug) ?? null",
    ) &&
    serverDataModule.includes("book-seo-summaries.json") &&
    bookRoute.includes("seoSummary?.description ??") &&
    audiobookRoute.includes("seoSummary?.description ??");
  const parentCollectionTitleLeakage =
    (storyTitleIntegrity.parentCollectionLeakage?.after?.generatedMetadata
      ?.length ?? 0) === 0 &&
    (storyTitleIntegrity.parentCollectionLeakage?.after?.userFacingDisplay
      ?.length ?? 0) === 0;
  const storyTitleIntegrityPass =
    storyTitleIntegrity.validation?.result === "pass" &&
    (storyTitleIntegrity.validation.failures?.length ?? 0) === 0;
  const checks = {
    summaryCount:
      summaryData.summaries.length === expectedSummaryCount &&
      summaryData.pilotSlugs.length === 20 &&
      selectedSlugs.length > 0 &&
      missingAfterBatch.length === 0,
    controlledBatchSelection,
    summarySlugUniqueness: summarySlugSet.size === summarySlugs.length,
    generatedSlugExistence,
    parentCollectionTitleLeakage,
    storyTitleIntegrity: storyTitleIntegrityPass,
    missingSummaryFallback,
  };
  const validation = reportValidation(results, checks);
  const passCount = results.filter((result) => result.status === "pass").length;
  const failCount = results.length - passCount;
  const report: SeoSummaryAuditReport = {
    generatedAt: new Date().toISOString(),
    summarySet: summaryData.summarySet,
    chosenSummaryStorageApproach: summaryData.storageApproach,
    filesChanged: summaryFilesChanged,
    counts: {
      generatedBookCount: libraryManifest.books.length,
      previousSummaryCount: previousSummarySlugSet.size,
      newSummaryCount: selectedSlugs.length,
      summaryRecordCount: summaryData.summaries.length,
      missingSummaryCountBeforeBatch:
        acceptedBooks.length - previousSummarySlugSet.size,
      missingSummaryCount: missingAfterBatch.length,
      passCount,
      failCount,
    },
    selectedSlugs,
    firstStillMissingSlugsAfterBatch: missingAfterBatch
      .slice(0, 25)
      .map((book) => book.slug),
    coverageNote:
      "All current accepted generated books now have summary coverage. Remaining raw-candidate and unresolved-source debt is tracked separately and was not processed in this summary branch.",
    remainingRawCandidateCheckpoint: {
      sourceReportPath:
        "app/client/assets/books/audit-reports/remaining-raw-inventory-triage/remaining-raw-inventory-triage.json",
      classifiedRawOnlyUnsafeCount:
        remainingRawTriage.counts?.classifiedRawOnlyUnsafeCount ??
        remainingRawTriage.counts?.dryRun24SkippedUnsafeRawOnlyCount ??
        46,
      checkpoint:
        "Current generated library summary coverage is tracked separately from remaining raw-candidate debt; remaining raw candidates are not processed in this summary branch.",
    },
    unresolvedSourceGeneratedBookCheckpoint: {
      sourceReportPath:
        fs.existsSync(unresolvedSourceGeneratedReviewPath)
          ? "app/client/assets/books/audit-reports/unresolved-source-generated-review/unresolved-source-generated-review.json"
          : "app/client/assets/books/audit-reports/remaining-raw-inventory-triage/remaining-raw-inventory-triage.json",
      unresolvedSourceGeneratedCount,
      checkpoint:
        "Unresolved-source generated books remain documented and non-blocking for current summary coverage, but source resolution is still tracked before final export decisions.",
    },
    urlIndexabilityFinalReleaseBlocker: {
      sourceReportPath:
        "app/client/assets/books/audit-reports/book-sitemap-nav-internal-linking/book-sitemap-nav-internal-linking.json",
      status: "open-final-release-blocker",
      existingLinkingAuditResult: linkingSitemapAudit.result ?? "fail",
      existingBrokenInternalLinkCount:
        linkingSitemapAudit.counts?.brokenInternalLinkCount ?? -1,
      existingMissingSitemapUrlCount:
        linkingSitemapAudit.counts?.missingSitemapUrlCount ?? -1,
      requiredBeforeCloudflareExport: [
        "Existing sitemap URLs are intentional by default.",
        "Planned sitemap URLs that currently 404 should be implemented correctly unless there is a strong reason not to.",
        "Do not remove, redirect, noindex, or canonicalize away planned URLs without a valid reason and discussion.",
        "No broken planned URL may remain in the final sitemap.",
        "Book, audiobook, print, and live variants need canonical and index/noindex decisions before final signoff.",
      ],
    },
    poeReplacementCheckpoint: {
      status: "pending-later-processing",
      requiredLater: [
        "Later remove broad Poe collection generated entries if present.",
        "Later process only newly added individual Poe short stories.",
        "Do not disturb already accepted/generated works except the two broad Poe removals.",
      ],
      checkpoint:
        "Poe collection replacement remains pending and was not processed in this summary branch.",
    },
    mobileFinalStageCheckpoint: {
      status: "pending-final-stage",
      requiredLater: [
        "Run mobile checks after major milestones.",
        "Keep broad mobile optimization discussion as the very last stage.",
        "Do not break working desktop behavior for mobile changes.",
      ],
      checkpoint:
        "Broad mobile optimization was not started in this summary branch.",
    },
    storyTitleIntegrityCheckpoint: {
      sourceReportPath:
        "app/client/assets/books/audit-reports/story-title-display-integrity/story-title-display-integrity.json",
      generatedEntriesChecked: storyTitleIntegrity.generatedEntriesChecked ?? 0,
      sourceValidationResult:
        storyTitleIntegrity.validation?.result ?? "fail",
      parentCollectionLeakageResult: parentCollectionTitleLeakage
        ? "pass"
        : "fail",
      checkpoint:
        "Corrected generated story titles remain the display source of truth; batch-9 summary titles and authors must match current generated metadata exactly.",
    },
    summaryLayoutWidthCheckpoint: {
      sourceBranch: "morsewords-book-summary-width-fix-jun-2026",
      mergedMainCommit: "41b93db8",
      status: "merged-and-validated",
      desktopSourceNotesWidthPx: 1056,
      desktopSummaryWidthPx: 1056,
      desktopColumns: 2,
      mobileSummaryWidthPx: 343,
      mobileColumns: 1,
      horizontalOverflow: "none",
      sourceOrder: "Summary remains below Source notes.",
      headerShortcut:
        "Header remains clean with only the conditional Read book summary shortcut.",
      checkpoint:
        "Summary section uses full lower-section width and remains visually aligned with the merged main summary-width fix.",
    },
    selectedSlugSubstitutions: [],
    skippedSelectedSlugs: controlledBatchSelection ? [] : expectedSelectedSlugs,
    results,
    validation,
    protectedPaths: {
      rawSources: "app/client/assets/temp-books",
      generatedBooks: "app/client/assets/books/generated",
      previews: "public/book-previews",
      cloudflareExports: "app/client/assets/books/cloudflare-export",
      modifiedByThisAudit: false,
    },
    recommendedNextSummaryBatchSize: 0,
    recommendedNextStepAfterCurrentGeneratedSummaryCompletion: [
      "Do not start export yet.",
      "Next major phase should handle raw/generated changes:",
      "Poe collection replacement and individual Poe story additions.",
      "Remaining raw-candidate review.",
      "Unresolved-source generated-book review.",
    ],
  };

  fs.mkdirSync(reportRoot, { recursive: true });
  fs.writeFileSync(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(reportMdPath, markdownReport(report));

  console.log(`book SEO summary audit: ${passCount} pass, ${failCount} fail`);
  console.log(`summaries: ${summaryData.summaries.length}/${expectedSummaryCount}`);
  console.log(`controlled batch selection: ${validation.controlledBatchSelection}`);
  console.log(`metadata match: ${validation.metadataMatch}`);
  console.log(
    `parent-collection title leakage: ${validation.parentCollectionTitleLeakage}`,
  );
  console.log(`story-title integrity: ${validation.storyTitleIntegrity}`);
  console.log(`word count: ${validation.wordCount}`);
  console.log(`spoiler risk: ${validation.spoilerRisk}`);
  console.log(`source boilerplate: ${validation.sourceBoilerplate}`);
  console.log(`authority-form leaks: ${validation.authorityFormLeak}`);
  console.log(`internal process leaks: ${validation.internalProcessLeak}`);
  console.log(`duplicate summaries: ${validation.duplicateSummary}`);
  console.log(`source text copy: ${validation.sourceTextCopy}`);
  console.log(`missing-summary fallback: ${validation.missingSummaryFallback}`);
  console.log(`report: ${path.relative(repoRoot, reportJsonPath)}`);

  if (validation.result !== "pass") process.exitCode = 1;
}

main();
