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
    pilotSlugCount: number;
    summaryRecordCount: number;
    passCount: number;
    failCount: number;
  };
  pilotSlugs: string[];
  substitutions: SeoSummaryData["substitutions"];
  results: PilotSummaryAuditItem[];
  validation: {
    metadataMatch: "pass" | "fail";
    wordCount: "pass" | "fail";
    spoilerRisk: "pass" | "fail";
    sourceBoilerplate: "pass" | "fail";
    internalProcessLeak: "pass" | "fail";
    duplicateSummary: "pass" | "fail";
    sourceTextCopy: "pass" | "fail";
    result: "pass" | "fail";
  };
  protectedPaths: {
    rawSources: string;
    generatedBooks: string;
    previews: string;
    cloudflareExports: string;
    modifiedByThisAudit: false;
  };
  recommendedNextStep: string;
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
  "book-seo-summary-pilot",
);
const reportJsonPath = path.join(reportRoot, "book-seo-summary-pilot.json");
const reportMdPath = path.join(reportRoot, "book-seo-summary-pilot.md");

const summaryFilesChanged = [
  "app/client/assets/books/seo-summaries/book-seo-summaries.json",
  "app/client/data/morseBookSeoSummaries.ts",
  "app/client/components/morse-code-books/MorseBookPage.tsx",
  "app/routes/morse-code-books.$slug.tsx",
  "app/routes/morse-code-audiobooks.$slug.tsx",
  "app/routes/morse-code-books.tsx",
  "app/routes/morse-code-audiobooks.tsx",
  "scripts/books/book-seo-summary-audit.ts",
  "package.json",
  "app/client/assets/books/audit-reports/book-seo-summary-pilot/book-seo-summary-pilot.json",
  "app/client/assets/books/audit-reports/book-seo-summary-pilot/book-seo-summary-pilot.md",
];

const sourceBoilerplatePattern =
  /\b(Project Gutenberg|Produced by|Transcriber|EBook|license|START OF|END OF|distributed proofreading|pgdp\.net|release date)\b/i;
const placeholderPattern =
  /\b(SOS Help!?|placeholder|generic fallback|lorem ipsum|summary coming soon|to be added)\b/i;
const spoilerLabelPattern =
  /\b(in the end|at the end|the story ends with|ends with|the final twist|the ending reveals|finally reveals)\b/i;
const rawSourceLeakPattern =
  /\b(app[\\/]+client[\\/]+assets[\\/]+temp-books|temp-books|raw source|\.txt\b|\.epub\b|\.pdf\b)\b/i;
const internalProcessLeakPattern =
  /\b(pilot\b.{0,50}\b(?:summary|batch|set|check|example|item|choice|substitute|coverage|rollout|scaling)|(?:summary|batch|set)\b.{0,30}\bpilot|future summary (?:batch(?:es)?|expansion)|summary (?:batch(?:es)?|expansion|schema|handling|rollout|records?)|generated (?:library|section|page|title)|defect-fix phase|route validation|audit review|metadata check|schema check|slug substitution|controlled batch|accepted (?:Poe )?substitute|unavailable [^.]{0,80}(?:slot|suggestion)|broader summary rollout|scaling (?:beyond|across|the full set))\b/i;

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
  if (!record) errors.push("Pilot summary record was not found.");

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

  const rawSourcePathLeakRisk = rawSourceLeakPattern.test(`${description}\n${summary}`)
    ? "fail"
    : "pass";
  if (rawSourcePathLeakRisk === "fail") {
    errors.push("Summary appears to leak a raw source path or raw-source filename.");
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
    errors.push("Summary text duplicates another pilot summary.");
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
    internalProcessLeakRisk,
    duplicateSummaryRisk,
    rawSourcePathLeakRisk,
    sourceTextCopyRisk,
    sourceTextComparisonNote,
    status,
    errors,
  };
}

function reportValidation(results: PilotSummaryAuditItem[]) {
  const hasMetadataFailures = results.some(
    (item) => !item.titleMatchesGenerated || !item.authorMatchesGenerated,
  );
  const hasWordCountFailures = results.some((item) => !item.wordCountWithinTarget);
  const hasSpoilerFailures = results.some((item) => item.spoilerRisk === "fail");
  const hasBoilerplateFailures = results.some(
    (item) => item.sourceBoilerplateRisk === "fail" || item.rawSourcePathLeakRisk === "fail",
  );
  const hasDuplicateFailures = results.some(
    (item) => item.duplicateSummaryRisk === "fail",
  );
  const hasInternalProcessLeaks = results.some(
    (item) => item.internalProcessLeakRisk === "fail",
  );
  const hasCopyFailures = results.some((item) => item.sourceTextCopyRisk === "fail");
  const hasFailures =
    hasMetadataFailures ||
    hasWordCountFailures ||
    hasSpoilerFailures ||
    hasBoilerplateFailures ||
    hasInternalProcessLeaks ||
    hasDuplicateFailures ||
    hasCopyFailures ||
    results.some((item) => item.status === "fail");

  return {
    metadataMatch: hasMetadataFailures ? "fail" : "pass",
    wordCount: hasWordCountFailures ? "fail" : "pass",
    spoilerRisk: hasSpoilerFailures ? "fail" : "pass",
    sourceBoilerplate: hasBoilerplateFailures ? "fail" : "pass",
    internalProcessLeak: hasInternalProcessLeaks ? "fail" : "pass",
    duplicateSummary: hasDuplicateFailures ? "fail" : "pass",
    sourceTextCopy: hasCopyFailures ? "fail" : "pass",
    result: hasFailures ? "fail" : "pass",
  } satisfies SeoSummaryAuditReport["validation"];
}

function markdownReport(report: SeoSummaryAuditReport) {
  const itemRows = report.results
    .map(
      (item) =>
        `| ${item.slug} | ${item.summaryWordCount} | ${item.titleMatchesGenerated ? "pass" : "fail"} | ${item.spoilerRisk} | ${item.sourceBoilerplateRisk} | ${item.internalProcessLeakRisk} | ${item.duplicateSummaryRisk} | ${item.status} |`,
    )
    .join("\n");
  const substitutions = report.substitutions
    .map(
      (substitution) =>
        `- ${substitution.suggestedSlug} -> ${substitution.actualSlug}: ${substitution.reason}`,
    )
    .join("\n");
  const failures = report.results
    .filter((item) => item.errors.length > 0)
    .map((item) => `- ${item.slug}: ${item.errors.join("; ")}`)
    .join("\n");

  return `# Book SEO Summary Pilot

Generated: ${report.generatedAt}

## Executive summary

The pilot adds ${report.counts.summaryRecordCount} original, non-spoiler book summary records for ${report.counts.pilotSlugCount} accepted generated books. The chosen storage approach is a separate SEO summary JSON asset imported by the book routes and audit tooling, so generated book text, preview assets, raw sources, and Cloudflare export payloads are not modified.

Validation result: ${report.validation.result}

## Storage approach

${report.chosenSummaryStorageApproach}

## Files changed

${report.filesChanged.map((file) => `- ${file}`).join("\n")}

## Pilot slugs

${report.pilotSlugs.map((slug) => `- ${slug}`).join("\n")}

## Substitutions

${substitutions || "- None"}

## Summary validation

| Slug | Summary words | Metadata | Spoiler risk | Source boilerplate | Internal process leak | Duplicate summary | Status |
| --- | ---: | --- | --- | --- | --- | --- | --- |
${itemRows}

## Validation categories

- Metadata match: ${report.validation.metadataMatch}
- Word count: ${report.validation.wordCount}
- Spoiler-risk result: ${report.validation.spoilerRisk}
- Source-boilerplate result: ${report.validation.sourceBoilerplate}
- Internal-process-leak result: ${report.validation.internalProcessLeak}
- Duplicate-summary result: ${report.validation.duplicateSummary}
- Source-text copy result: ${report.validation.sourceTextCopy}

## Failures

${failures || "- None"}

## Protected paths

- Raw sources: ${report.protectedPaths.rawSources}
- Generated books: ${report.protectedPaths.generatedBooks}
- Preview assets: ${report.protectedPaths.previews}
- Cloudflare exports: ${report.protectedPaths.cloudflareExports}
- Modified by this audit: no

## Recommended next step

${report.recommendedNextStep}
`;
}

function main() {
  const libraryManifest = readJson<GeneratedLibraryManifest>(libraryManifestPath);
  const summaryData = readJson<SeoSummaryData>(summaryPath);
  const generatedBySlug = new Map(
    libraryManifest.books.map((book) => [book.slug, book]),
  );
  const summariesBySlug = new Map(
    summaryData.summaries.map((summary) => [summary.slug, summary]),
  );
  const duplicateCounts = duplicateSummaryMap(summaryData.summaries);
  const results = summaryData.pilotSlugs.map((slug) =>
    auditSummaryRecord({
      book: generatedBySlug.get(slug) ?? null,
      duplicateCounts,
      record: summariesBySlug.get(slug) ?? null,
      slug,
    }),
  );

  const extraSummarySlugs = summaryData.summaries
    .map((summary) => summary.slug)
    .filter((slug) => !summaryData.pilotSlugs.includes(slug));
  for (const slug of extraSummarySlugs) {
    results.push({
      slug,
      title: summariesBySlug.get(slug)?.title ?? null,
      author: summariesBySlug.get(slug)?.author ?? [],
      generatedBookExists: generatedBySlug.has(slug),
      summaryRecordExists: true,
      titleMatchesGenerated: false,
      authorMatchesGenerated: false,
      descriptionWordCount: countWords(summariesBySlug.get(slug)?.description ?? ""),
      summaryWordCount: countWords(summariesBySlug.get(slug)?.summary ?? ""),
      wordCountWithinTarget: false,
      shortWorkException: null,
      spoilerRisk: "pass",
      sourceBoilerplateRisk: "pass",
      internalProcessLeakRisk: "pass",
      duplicateSummaryRisk: "pass",
      rawSourcePathLeakRisk: "pass",
      sourceTextCopyRisk: "pass",
      sourceTextComparisonNote: "not attempted: summary is outside pilot set",
      status: "fail",
      errors: ["Summary record is outside the controlled 20-book pilot set."],
    });
  }

  const validation = reportValidation(results);
  const passCount = results.filter((result) => result.status === "pass").length;
  const failCount = results.length - passCount;
  const report: SeoSummaryAuditReport = {
    generatedAt: new Date().toISOString(),
    summarySet: summaryData.summarySet,
    chosenSummaryStorageApproach: summaryData.storageApproach,
    filesChanged: summaryFilesChanged,
    counts: {
      generatedBookCount: libraryManifest.books.length,
      pilotSlugCount: summaryData.pilotSlugs.length,
      summaryRecordCount: summaryData.summaries.length,
      passCount,
      failCount,
    },
    pilotSlugs: summaryData.pilotSlugs,
    substitutions: summaryData.substitutions,
    results,
    validation,
    protectedPaths: {
      rawSources: "app/client/assets/temp-books",
      generatedBooks: "app/client/assets/books/generated",
      previews: "public/book-previews",
      cloudflareExports: "app/client/assets/books/cloudflare-export",
      modifiedByThisAudit: false,
    },
    recommendedNextStep:
      validation.result === "pass"
        ? "Scale the summary process in reviewable batches, reusing this schema and audit command, before the full site SEO/meta review."
        : "Fix the failed pilot summary records before scaling beyond the first 20 summaries.",
  };

  fs.mkdirSync(reportRoot, { recursive: true });
  fs.writeFileSync(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(reportMdPath, markdownReport(report));

  console.log(
    `book SEO summary pilot audit: ${passCount} pass, ${failCount} fail`,
  );
  console.log(`pilot summaries: ${summaryData.summaries.length}/20`);
  console.log(`metadata match: ${validation.metadataMatch}`);
  console.log(`word count: ${validation.wordCount}`);
  console.log(`spoiler risk: ${validation.spoilerRisk}`);
  console.log(`source boilerplate: ${validation.sourceBoilerplate}`);
  console.log(`internal process leaks: ${validation.internalProcessLeak}`);
  console.log(`duplicate summaries: ${validation.duplicateSummary}`);
  console.log(`source text copy: ${validation.sourceTextCopy}`);
  console.log(`report: ${path.relative(repoRoot, reportJsonPath)}`);

  if (validation.result !== "pass") {
    process.exitCode = 1;
  }
}

main();
