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
  skippedSelectedSlugs: string[];
  results: PilotSummaryAuditItem[];
  validation: {
    summaryCount: "pass" | "fail";
    controlledBatchSelection: "pass" | "fail";
    summarySlugUniqueness: "pass" | "fail";
    generatedSlugExistence: "pass" | "fail";
    metadataMatch: "pass" | "fail";
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
  "book-seo-summary-batch-4",
);
const reportJsonPath = path.join(reportRoot, "book-seo-summary-batch-4.json");
const reportMdPath = path.join(reportRoot, "book-seo-summary-batch-4.md");
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

const summaryFilesChanged = [
  "app/client/assets/books/seo-summaries/book-seo-summaries.json",
  "scripts/books/book-seo-summary-audit.ts",
  "app/client/assets/books/audit-reports/book-seo-summary-batch-4/book-seo-summary-batch-4.json",
  "app/client/assets/books/audit-reports/book-seo-summary-batch-4/book-seo-summary-batch-4.md",
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
    summaryWordCount >= 300 || (summaryWordCount >= 180 && hasShortWorkException);
  if (!wordCountWithinTarget) {
    errors.push(
      `Summary word count ${summaryWordCount} is below target without an approved short-work exception.`,
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
  const batchMatch = summaryData.summarySet.match(/book-seo-summary-batch-(\d+)/);
  if (!batchMatch) return [];
  const batchNumber = Number(batchMatch[1]);
  if (batchNumber === 1) return summaryData.batch1Slugs ?? [];
  if (batchNumber === 2) return summaryData.batch2Slugs ?? [];
  if (batchNumber === 3) return summaryData.batch3Slugs ?? [];
  if (batchNumber === 4) return summaryData.batch4Slugs ?? [];
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

  return `# Book SEO Summary Batch 4

Generated: ${report.generatedAt}

## Executive summary

- Previous summaries: ${report.counts.previousSummaryCount}
- New summaries: ${report.counts.newSummaryCount}
- Total summaries: ${report.counts.summaryRecordCount}
- Missing summaries before batch: ${report.counts.missingSummaryCountBeforeBatch}
- Missing summaries after batch: ${report.counts.missingSummaryCount}
- Validation result: ${report.validation.result}

The 50 new records use the existing separate static summary asset. Generated book text, preview assets, raw sources, and Cloudflare export payloads were not modified.

${report.coverageNote}

## Remaining book checkpoint

Current generated library summary coverage is being tracked separately from remaining raw-candidate debt.

- Remaining raw-candidate debt from inventory triage is not closed: ${report.remainingRawCandidateCheckpoint.classifiedRawOnlyUnsafeCount} skipped/unsafe/manual/raw candidates remain classified.
- Unresolved-source generated-book debt is still documented: ${report.unresolvedSourceGeneratedBookCheckpoint.unresolvedSourceGeneratedCount} generated books remain source-unresolved but non-blocking.
- Before final Cloudflare export, the remaining raw inventory must be revisited so any manually acceptable books can be processed and then added to summaries, sitemap/nav/internal links, audits, and export.

## Selected slugs

${report.selectedSlugs.map((slug) => `- ${slug}`).join("\n")}

## First 25 still-missing slugs after batch

${report.firstStillMissingSlugsAfterBatch.map((slug) => `- ${slug}`).join("\n")}

## Substitutions or skipped selections

${report.skippedSelectedSlugs.length > 0 ? report.skippedSelectedSlugs.map((slug) => `- ${slug}`).join("\n") : "- None"}

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

## Recommended next batch size

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
    .slice(0, 50)
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
  const bookRoute = fs.readFileSync(
    path.join(repoRoot, "app/routes/morse-code-books.$slug.tsx"),
    "utf8",
  );
  const audiobookRoute = fs.readFileSync(
    path.join(repoRoot, "app/routes/morse-code-audiobooks.$slug.tsx"),
    "utf8",
  );
  const missingSummaryFallback =
    dataModule.includes("bookSeoSummaryBySlug.get(slug) ?? null") &&
    bookRoute.includes("seoSummary?.description ??") &&
    audiobookRoute.includes("seoSummary?.description ??");
  const checks = {
    summaryCount:
      summaryData.summaries.length === expectedSummaryCount &&
      summaryData.pilotSlugs.length === 20 &&
      selectedSlugs.length === 50,
    controlledBatchSelection,
    summarySlugUniqueness: summarySlugSet.size === summarySlugs.length,
    generatedSlugExistence,
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
      "No accepted generated book is permanently excluded from summary coverage; remaining books are carried forward by deterministic manifest order.",
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
        "app/client/assets/books/audit-reports/remaining-raw-inventory-triage/remaining-raw-inventory-triage.json",
      unresolvedSourceGeneratedCount:
        remainingRawTriage.counts?.unresolvedSourceGeneratedCount ?? 11,
      checkpoint:
        "Unresolved-source generated books remain documented and non-blocking for current summary coverage, but source resolution is still tracked before final export decisions.",
    },
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
    recommendedNextSummaryBatchSize: validation.result === "pass" ? 50 : 0,
  };

  fs.mkdirSync(reportRoot, { recursive: true });
  fs.writeFileSync(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(reportMdPath, markdownReport(report));

  console.log(`book SEO summary audit: ${passCount} pass, ${failCount} fail`);
  console.log(`summaries: ${summaryData.summaries.length}/${expectedSummaryCount}`);
  console.log(`controlled batch selection: ${validation.controlledBatchSelection}`);
  console.log(`metadata match: ${validation.metadataMatch}`);
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
