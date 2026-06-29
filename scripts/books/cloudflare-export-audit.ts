import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  GeneratedBookManifest,
  GeneratedBookSectionJson,
  GeneratedLibraryManifest,
} from "./bookManifestTypes.ts";

type PreviewManifest = {
  version: number;
  books: Array<{
    slug: string;
    previewBytes: number;
    previewCharacterCount: number;
    truncated: boolean;
  }>;
};

type SeoSummaryRegistry = {
  summaries?: Array<{ slug: string }>;
  books?: Record<string, unknown>;
};

type ExportBook = {
  schemaVersion: 1;
  slug: string;
  title: string;
  author: string[];
  language: string;
  description: string;
  subjects: string[];
  source: GeneratedBookManifest["source"];
  stats: GeneratedBookManifest["stats"];
  contentVersion: string;
  contentHash: string;
  manifest: GeneratedBookManifest;
  sections: GeneratedBookSectionJson[];
};

type ExportPublicManifest = {
  schemaVersion: 1;
  contentVersion: string;
  contentHash: string;
  books: Array<{
    slug: string;
    title: string;
    author: string[];
    source: Partial<GeneratedBookManifest["source"]>;
    stats: GeneratedBookManifest["stats"];
    contentVersion: string;
    contentHash: string;
    bookPath: string;
  }>;
};

type UploadManifest = {
  schemaVersion: 1;
  approvedBookCount: number;
  sourceFolder: string;
  bookFiles: string[];
  files: string[];
  destinationObjectPaths: string[];
};

type RepresentativeCheck = {
  slug: string;
  role: string;
  title: string;
  sectionCount: number;
  wordCount: number;
  contentCharacters: number;
  result: "pass" | "fail";
  notes: string[];
};

type AuditReport = {
  schemaVersion: 1;
  reportName: "cloudflare-export-prep";
  generatedAt: string;
  branch: string;
  executiveResult: string;
  sourceOfTruthCounts: {
    generatedBooks: number;
    seoSummaries: number;
    startupPreviews: number;
    missingSummaries: number;
    bookUrls: number;
    audiobookUrls: number;
  };
  exportCommandAdded: string;
  exportCommandUsed: string;
  exportOutputLocation: string;
  exportFilePayloadCounts: {
    totalFiles: number;
    bookPayloads: number;
    manifestFiles: number;
  };
  generatedVsExportSlugComparison: {
    missingFromExport: string[];
    extraInExport: string[];
    duplicateExportSlugs: string[];
    duplicateExportPaths: string[];
  };
  removedDeferredBlockedSlugExclusion: {
    result: "pass" | "fail";
    blockedOrSourceRiskSlugsExported: string[];
    note: string;
  };
  metadataConsistency: {
    result: "pass" | "fail";
    failures: string[];
  };
  sectionContent: {
    result: "pass" | "fail";
    failures: string[];
  };
  badLabelScan: {
    result: "pass" | "fail";
    failures: string[];
  };
  wordCount: {
    result: "pass" | "fail";
    failures: string[];
  };
  representativePayloadChecks: RepresentativeCheck[];
  staleExportCleanup: {
    result: "pass" | "fail";
    stalePayloadCountBeforeThisBranch: number;
    refreshedPayloadCount: number;
    note: string;
  };
  cloudflareUploadInstructions: {
    localExportDirectory: string;
    fileCountToUpload: number;
    bookPayloadCountToUpload: number;
    overwriteExistingKeys: boolean;
    deleteStaleRemoteKeys: boolean;
    syncDeleteRequired: boolean;
    validationCommandBeforeUpload: string;
    uploadCommand: string;
    uploadCommandRun: false;
  };
  postUploadValidationRequirements: string[];
  postExportBookRouteChapterNavViewWindowValidationRequirements: string[];
  laterContentQualityCheckpoints: string[];
  deferredFinalStages: string[];
  blockers: string[];
  readinessDecision: "Ready for Cloudflare upload" | string;
};

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const GENERATED_ROOT = path.join(REPO_ROOT, "app/client/assets/books/generated");
const SEO_SUMMARIES_PATH = path.join(
  REPO_ROOT,
  "app/client/assets/books/seo-summaries/book-seo-summaries.json",
);
const PREVIEW_MANIFEST_PATH = path.join(REPO_ROOT, "public/book-previews/manifest.json");
const EXPORT_ROOT = path.join(REPO_ROOT, "app/client/assets/books/cloudflare-export");
const CHECKPOINT_PATH = path.join(
  REPO_ROOT,
  "app/client/assets/books/audit-reports/book-library-decision-checkpoint/book-library-decision-checkpoint.json",
);
const REPORT_ROOT = path.join(
  REPO_ROOT,
  "app/client/assets/books/audit-reports/cloudflare-export-prep",
);
const REPORT_JSON_PATH = path.join(REPORT_ROOT, "cloudflare-export-prep.json");
const REPORT_MD_PATH = path.join(REPORT_ROOT, "cloudflare-export-prep.md");
const EXPECTED_COUNT = 519;
const STALE_PAYLOAD_COUNT_BEFORE_BRANCH = 74;
const OUTPUT_NEWLINE = process.platform === "win32" ? "\r\n" : "\n";
const BAD_LABELS = [
  "Unknown author",
  "Unknown source",
  "Source unavailable",
  "Metadata unavailable",
  "0 sections",
  "Sections: 0",
];

function toPosixPath(input: string): string {
  return input.split(path.sep).join("/");
}

function relativeToRepo(filePath: string): string {
  return toPosixPath(path.relative(REPO_ROOT, filePath));
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeJson(filePath: string, value: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const json = JSON.stringify(value, null, 2).replace(/\n/g, OUTPUT_NEWLINE);
  fs.writeFileSync(filePath, `${json}${OUTPUT_NEWLINE}`, "utf8");
}

function writeText(filePath: string, value: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const text = value.endsWith("\n") ? value : `${value}\n`;
  fs.writeFileSync(filePath, text.replace(/\n/g, OUTPUT_NEWLINE), "utf8");
}

function listFiles(root: string): string[] {
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(entryPath);
      } else {
        files.push(entryPath);
      }
    }
  };
  if (fs.existsSync(root)) walk(root);
  return files.sort((a, b) => a.localeCompare(b));
}

function duplicateValues(values: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates].sort((a, b) => a.localeCompare(b));
}

function sameStringArray(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function isPublishReady(manifest: GeneratedBookManifest): boolean {
  return (
    manifest.source.publishReady === true &&
    manifest.source.rightsStatus === "approved" &&
    manifest.source.processingAllowed === true
  );
}

function loadGeneratedBooks() {
  const libraryManifest = readJson<GeneratedLibraryManifest>(
    path.join(GENERATED_ROOT, "library-manifest.json"),
  );
  return libraryManifest.books
    .map((summary) => {
      const manifest = readJson<GeneratedBookManifest>(
        path.join(GENERATED_ROOT, summary.manifestPath),
      );
      const sections = manifest.sections
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((section) =>
          readJson<GeneratedBookSectionJson>(
            path.join(GENERATED_ROOT, manifest.slug, section.sectionJsonPath),
          ),
        );
      return { summary, manifest, sections };
    })
    .filter(({ manifest }) => isPublishReady(manifest));
}

function loadBlockedOrSourceRiskSlugs(): string[] {
  if (!fs.existsSync(CHECKPOINT_PATH)) return [];
  const checkpoint = readJson<{
    remainingRawCandidatesByCategory?: Record<string, Array<{ inferredSlug?: string }>>;
  }>(CHECKPOINT_PATH);
  const categories = checkpoint.remainingRawCandidatesByCategory ?? {};
  const blockedCategories = [
    "blocked-source-or-rights-risk",
    "generated-then-user-approved-removed",
  ];
  return blockedCategories
    .flatMap((category) => categories[category] ?? [])
    .map((entry) => entry.inferredSlug)
    .filter((slug): slug is string => typeof slug === "string" && slug.length > 0)
    .sort((a, b) => a.localeCompare(b));
}

function contentCharacters(sections: GeneratedBookSectionJson[]): number {
  return sections.reduce(
    (total, section) =>
      total +
      (section.displayText?.trim().length || section.morseSourceText?.trim().length || 0),
    0,
  );
}

function contentWordCount(sections: GeneratedBookSectionJson[]): number {
  return sections.reduce((total, section) => total + (section.wordCount || 0), 0);
}

function compactList(items: string[], limit = 12): string {
  if (items.length === 0) return "None";
  if (items.length <= limit) return items.join(", ");
  return `${items.slice(0, limit).join(", ")}, and ${items.length - limit} more`;
}

function markdown(report: AuditReport): string {
  const representativeRows = report.representativePayloadChecks.map(
    (check) =>
      `| ${check.role} | ${check.slug} | ${check.result} | ${check.sectionCount} | ${check.wordCount} | ${check.notes.join("; ")} |`,
  );
  const blockers = report.blockers.length
    ? report.blockers.map((blocker) => `- ${blocker}`)
    : ["- None"];

  return [
    "# Cloudflare Export Prep",
    "",
    "## 1. Executive result",
    "",
    `**${report.readinessDecision}**`,
    "",
    report.executiveResult,
    "",
    "## 2. Source-of-truth counts",
    "",
    `- Generated books: ${report.sourceOfTruthCounts.generatedBooks}`,
    `- SEO summaries: ${report.sourceOfTruthCounts.seoSummaries}`,
    `- Startup previews: ${report.sourceOfTruthCounts.startupPreviews}`,
    `- Missing summaries: ${report.sourceOfTruthCounts.missingSummaries}`,
    `- Book URLs: ${report.sourceOfTruthCounts.bookUrls}`,
    `- Audiobook URLs: ${report.sourceOfTruthCounts.audiobookUrls}`,
    "",
    "## 3. Export command added/used",
    "",
    `- Added: \`${report.exportCommandAdded}\``,
    `- Used: \`${report.exportCommandUsed}\``,
    "",
    "## 4. Export output location",
    "",
    `\`${report.exportOutputLocation}\``,
    "",
    "## 5. Export file/payload counts",
    "",
    `- Total export files: ${report.exportFilePayloadCounts.totalFiles}`,
    `- Book payloads: ${report.exportFilePayloadCounts.bookPayloads}`,
    `- Manifest files: ${report.exportFilePayloadCounts.manifestFiles}`,
    "",
    "## 6. Generated-vs-export slug comparison",
    "",
    `- Missing from export: ${compactList(report.generatedVsExportSlugComparison.missingFromExport)}`,
    `- Extra in export: ${compactList(report.generatedVsExportSlugComparison.extraInExport)}`,
    `- Duplicate export slugs: ${compactList(report.generatedVsExportSlugComparison.duplicateExportSlugs)}`,
    `- Duplicate export paths: ${compactList(report.generatedVsExportSlugComparison.duplicateExportPaths)}`,
    "",
    "## 7. Removed/deferred/blocked slug exclusion result",
    "",
    `- Result: ${report.removedDeferredBlockedSlugExclusion.result}`,
    `- Exported blocked/source-risk slugs: ${compactList(report.removedDeferredBlockedSlugExclusion.blockedOrSourceRiskSlugsExported)}`,
    `- Note: ${report.removedDeferredBlockedSlugExclusion.note}`,
    "",
    "## 8. Metadata consistency result",
    "",
    `- Result: ${report.metadataConsistency.result}`,
    `- Failures: ${compactList(report.metadataConsistency.failures)}`,
    "",
    "## 9. Section/content result",
    "",
    `- Result: ${report.sectionContent.result}`,
    `- Failures: ${compactList(report.sectionContent.failures)}`,
    "",
    "## 10. Bad-label scan result",
    "",
    `- Result: ${report.badLabelScan.result}`,
    `- Failures: ${compactList(report.badLabelScan.failures)}`,
    "",
    "## 11. Word-count result",
    "",
    `- Result: ${report.wordCount.result}`,
    `- Failures: ${compactList(report.wordCount.failures)}`,
    "",
    "## 12. Representative payload checks",
    "",
    "| Role | Slug | Result | Sections | Words | Notes |",
    "| --- | --- | --- | ---: | ---: | --- |",
    ...representativeRows,
    "",
    "## 13. Stale export cleanup result",
    "",
    `- Result: ${report.staleExportCleanup.result}`,
    `- Previous stale payload count observed before refresh: ${report.staleExportCleanup.stalePayloadCountBeforeThisBranch}`,
    `- Refreshed payload count: ${report.staleExportCleanup.refreshedPayloadCount}`,
    `- Note: ${report.staleExportCleanup.note}`,
    "",
    "## 14. Cloudflare upload instructions",
    "",
    `- Local export directory: \`${report.cloudflareUploadInstructions.localExportDirectory}\``,
    `- Files to upload: ${report.cloudflareUploadInstructions.fileCountToUpload}`,
    `- Book payloads to upload: ${report.cloudflareUploadInstructions.bookPayloadCountToUpload}`,
    `- Overwrite existing keys: ${report.cloudflareUploadInstructions.overwriteExistingKeys ? "yes" : "no"}`,
    `- Delete stale remote keys: ${report.cloudflareUploadInstructions.deleteStaleRemoteKeys ? "yes" : "no"}`,
    `- Required behavior: ${report.cloudflareUploadInstructions.syncDeleteRequired ? "sync/delete, not append-only" : "append-only"}`,
    `- Local validation before upload: \`${report.cloudflareUploadInstructions.validationCommandBeforeUpload}\``,
    `- Upload command run in this branch: ${report.cloudflareUploadInstructions.uploadCommandRun ? "yes" : "no"}`,
    "",
    "## 15. Post-upload validation requirements",
    "",
    ...report.postUploadValidationRequirements.map((item) => `- ${item}`),
    "",
    "## 16. Post-export book route/chapter/nav/view-window validation requirements",
    "",
    ...report.postExportBookRouteChapterNavViewWindowValidationRequirements.map(
      (item) => `- ${item}`,
    ),
    "",
    "## 17. Later content-quality checkpoints: Sources page, About page, repeated helper copy",
    "",
    ...report.laterContentQualityCheckpoints.map((item) => `- ${item}`),
    "",
    "## 18. Deferred final stages: non-book sitemap pages, URL/indexability, GSC/meta review, mobile optimization",
    "",
    ...report.deferredFinalStages.map((item) => `- ${item}`),
    "",
    "## Blockers",
    "",
    ...blockers,
    "",
  ].join("\n");
}

function pickLiveSlug(
  generatedBySlug: Map<string, ReturnType<typeof loadGeneratedBooks>[number]>,
  preferred: string[],
): string {
  const slug = preferred.find((candidate) => generatedBySlug.has(candidate));
  if (!slug) throw new Error(`No live representative slug found from: ${preferred.join(", ")}`);
  return slug;
}

function seoSummarySlugs(registry: SeoSummaryRegistry): Set<string> {
  if (Array.isArray(registry.summaries)) {
    return new Set(
      registry.summaries
        .map((summary) => summary.slug)
        .filter((slug): slug is string => typeof slug === "string" && slug.length > 0),
    );
  }
  if (registry.books && typeof registry.books === "object") {
    return new Set(Object.keys(registry.books));
  }
  return new Set();
}

function runAudit(): AuditReport {
  const generatedBooks = loadGeneratedBooks();
  const generatedBySlug = new Map(generatedBooks.map((book) => [book.manifest.slug, book]));
  const generatedSlugs = [...generatedBySlug.keys()].sort((a, b) => a.localeCompare(b));
  const publicManifest = readJson<ExportPublicManifest>(
    path.join(EXPORT_ROOT, "public-manifest.json"),
  );
  const uploadManifest = readJson<UploadManifest>(
    path.join(EXPORT_ROOT, "upload-manifest.json"),
  );
  const exportFiles = listFiles(EXPORT_ROOT);
  const exportBookFiles = exportFiles.filter(
    (filePath) =>
      path.dirname(filePath).endsWith(path.normalize("cloudflare-export/books")) &&
      path.extname(filePath) === ".json",
  );
  const exportedBooks = exportBookFiles.map((filePath) => readJson<ExportBook>(filePath));
  const exportedBySlug = new Map(exportedBooks.map((book) => [book.slug, book]));
  const exportedSlugs = exportedBooks.map((book) => book.slug).sort((a, b) => a.localeCompare(b));
  const exportBookPaths = exportBookFiles.map((filePath) =>
    relativeToRepo(filePath).replace("app/client/assets/books/cloudflare-export/", ""),
  );
  const missingFromExport = generatedSlugs.filter((slug) => !exportedBySlug.has(slug));
  const extraInExport = exportedSlugs.filter((slug) => !generatedBySlug.has(slug));
  const duplicateExportSlugs = duplicateValues(exportedBooks.map((book) => book.slug));
  const duplicateExportPaths = duplicateValues(exportBookPaths);
  const metadataFailures: string[] = [];
  const sectionFailures: string[] = [];
  const badLabelFailures: string[] = [];
  const wordCountFailures: string[] = [];
  const previewManifest = readJson<PreviewManifest>(PREVIEW_MANIFEST_PATH);
  const previewsBySlug = new Map(previewManifest.books.map((book) => [book.slug, book]));

  if (publicManifest.books.length !== exportedBooks.length) {
    metadataFailures.push(
      `public-manifest books count ${publicManifest.books.length} does not match exported payload count ${exportedBooks.length}.`,
    );
  }
  if (uploadManifest.approvedBookCount !== exportedBooks.length) {
    metadataFailures.push(
      `upload-manifest approvedBookCount ${uploadManifest.approvedBookCount} does not match exported payload count ${exportedBooks.length}.`,
    );
  }
  if (uploadManifest.bookFiles.length !== exportedBooks.length) {
    metadataFailures.push(
      `upload-manifest bookFiles count ${uploadManifest.bookFiles.length} does not match exported payload count ${exportedBooks.length}.`,
    );
  }

  for (const manifestBook of publicManifest.books) {
    if (!exportedBySlug.has(manifestBook.slug)) {
      metadataFailures.push(`public-manifest references missing export slug ${manifestBook.slug}.`);
    }
    if (manifestBook.bookPath !== `books/${manifestBook.slug}.json`) {
      metadataFailures.push(`${manifestBook.slug}: public-manifest bookPath is ${manifestBook.bookPath}.`);
    }
  }

  for (const book of exportedBooks) {
    const generated = generatedBySlug.get(book.slug);
    if (!generated) continue;
    const generatedManifest = generated.manifest;
    const generatedContentCharacters = contentCharacters(generated.sections);
    const exportContentCharacters = contentCharacters(book.sections);
    const preview = previewsBySlug.get(book.slug);

    if (book.title !== generatedManifest.title) {
      metadataFailures.push(`${book.slug}: exported title does not match generated manifest.`);
    }
    if (!sameStringArray(book.author, generatedManifest.author)) {
      metadataFailures.push(`${book.slug}: exported author does not match generated manifest.`);
    }
    if (book.source.provider !== generatedManifest.source.provider) {
      metadataFailures.push(`${book.slug}: exported source provider does not match generated manifest.`);
    }
    if (book.source.sourceUrl !== generatedManifest.source.sourceUrl) {
      metadataFailures.push(`${book.slug}: exported source URL does not match generated manifest.`);
    }
    if (book.source.gutenbergId !== generatedManifest.source.gutenbergId) {
      metadataFailures.push(`${book.slug}: exported Gutenberg ID does not match generated manifest.`);
    }
    if (book.stats.sectionCount !== generatedManifest.stats.sectionCount) {
      sectionFailures.push(`${book.slug}: exported stats sectionCount does not match generated manifest.`);
    }
    if (book.sections.length !== generated.sections.length) {
      sectionFailures.push(`${book.slug}: exported section JSON count does not match generated section structure.`);
    }
    if (book.sections.length === 0 || book.stats.sectionCount <= 0) {
      sectionFailures.push(`${book.slug}: exported book has zero sections.`);
    }
    if (exportContentCharacters <= 0) {
      sectionFailures.push(`${book.slug}: exported book has no readable section content.`);
    }
    if (exportContentCharacters !== generatedContentCharacters) {
      sectionFailures.push(`${book.slug}: exported content character count does not match generated sections.`);
    }
    if (preview?.truncated && exportContentCharacters <= preview.previewCharacterCount) {
      sectionFailures.push(`${book.slug}: exported content does not exceed truncated starter preview content.`);
    }
    if (book.stats.wordCount <= 0) {
      wordCountFailures.push(`${book.slug}: exported stats wordCount is not positive.`);
    }
    if (book.stats.wordCount !== generatedManifest.stats.wordCount) {
      wordCountFailures.push(`${book.slug}: exported stats wordCount does not match generated manifest.`);
    }
    const sectionWordCount = contentWordCount(book.sections);
    if (Math.abs(sectionWordCount - generatedManifest.stats.wordCount) > 10) {
      wordCountFailures.push(`${book.slug}: section word count ${sectionWordCount} differs from generated manifest ${generatedManifest.stats.wordCount} by more than the deterministic tolerance.`);
    }

    const labelFields = [
      book.title,
      ...book.author,
      book.source.provider,
      book.source.sourceUrl ?? "",
      ...book.sections.flatMap((section) => [
        section.label,
        section.title ?? "",
      ]),
    ];
    for (const badLabel of BAD_LABELS) {
      if (labelFields.some((field) => field.includes(badLabel))) {
        badLabelFailures.push(`${book.slug}: exported public metadata contains ${badLabel}.`);
      }
    }
  }

  const blockedOrSourceRiskSlugs = loadBlockedOrSourceRiskSlugs();
  const blockedOrSourceRiskSlugsExported = blockedOrSourceRiskSlugs.filter((slug) =>
    exportedBySlug.has(slug),
  );
  const representativeSlugs = [
    {
      role: "Long work",
      slug: pickLiveSlug(generatedBySlug, ["middlemarch", "walden"]),
      expectedSections: null,
    },
    {
      role: "Short story",
      slug: pickLiveSlug(generatedBySlug, ["the-bottle-imp", "a-scandal-in-bohemia"]),
      expectedSections: null,
    },
    {
      role: "Poe story",
      slug: pickLiveSlug(generatedBySlug, [
        "the-masque-of-the-red-death",
        "the-tell-tale-heart",
        "the-cask-of-amontillado",
      ]),
      expectedSections: null,
    },
    {
      role: "Wilde story",
      slug: pickLiveSlug(generatedBySlug, [
        "the-happy-prince",
        "the-selfish-giant",
        "the-nightingale-and-the-rose",
      ]),
      expectedSections: null,
    },
    {
      role: "The Leavenworth Case section-count check",
      slug: "the-leavenworth-case",
      expectedSections: 39,
    },
    {
      role: "Walden section-count check",
      slug: "walden",
      expectedSections: 18,
    },
  ];
  const representativePayloadChecks = representativeSlugs.map(
    ({ role, slug, expectedSections }): RepresentativeCheck => {
      const exported = exportedBySlug.get(slug);
      const generated = generatedBySlug.get(slug);
      const notes: string[] = [];
      if (!exported || !generated) {
        return {
          role,
          slug,
          title: "",
          sectionCount: 0,
          wordCount: 0,
          contentCharacters: 0,
          result: "fail",
          notes: ["Live generated/exported payload not found."],
        };
      }
      if (expectedSections !== null && exported.sections.length !== expectedSections) {
        notes.push(`Expected ${expectedSections} sections but found ${exported.sections.length}.`);
      }
      const chars = contentCharacters(exported.sections);
      if (chars <= 0) notes.push("No readable exported content.");
      if (exported.stats.wordCount <= 0) notes.push("Non-positive word count.");
      if (exported.sections.length !== generated.sections.length) {
        notes.push("Exported section count does not match generated source.");
      }
      if (notes.length === 0) notes.push("Full generated section payload is present.");
      return {
        role,
        slug,
        title: exported.title,
        sectionCount: exported.sections.length,
        wordCount: exported.stats.wordCount,
        contentCharacters: chars,
        result: notes.length === 1 && notes[0] === "Full generated section payload is present." ? "pass" : "fail",
        notes,
      };
    },
  );

  const seoSummaries = readJson<SeoSummaryRegistry>(SEO_SUMMARIES_PATH);
  const seoSlugs = seoSummarySlugs(seoSummaries);
  const missingSummarySlugs = generatedSlugs.filter((slug) => !seoSlugs.has(slug));
  const blockers = [
    missingFromExport.length ? `${missingFromExport.length} generated slug(s) missing from export.` : "",
    extraInExport.length ? `${extraInExport.length} extra exported slug(s) not in generated live books.` : "",
    duplicateExportSlugs.length ? `${duplicateExportSlugs.length} duplicate exported slug(s).` : "",
    duplicateExportPaths.length ? `${duplicateExportPaths.length} duplicate export path(s).` : "",
    metadataFailures.length ? `${metadataFailures.length} metadata consistency failure(s).` : "",
    sectionFailures.length ? `${sectionFailures.length} section/content failure(s).` : "",
    badLabelFailures.length ? `${badLabelFailures.length} bad-label failure(s).` : "",
    wordCountFailures.length ? `${wordCountFailures.length} word-count failure(s).` : "",
    blockedOrSourceRiskSlugsExported.length ? `${blockedOrSourceRiskSlugsExported.length} blocked/source-risk slug(s) exported.` : "",
    representativePayloadChecks.some((check) => check.result === "fail") ? "Representative payload checks failed." : "",
    generatedSlugs.length !== EXPECTED_COUNT ? `Generated live count is ${generatedSlugs.length}, expected ${EXPECTED_COUNT}.` : "",
    exportedBooks.length !== EXPECTED_COUNT ? `Exported live count is ${exportedBooks.length}, expected ${EXPECTED_COUNT}.` : "",
    publicManifest.books.length !== EXPECTED_COUNT ? `Public manifest count is ${publicManifest.books.length}, expected ${EXPECTED_COUNT}.` : "",
    uploadManifest.approvedBookCount !== EXPECTED_COUNT ? `Upload manifest count is ${uploadManifest.approvedBookCount}, expected ${EXPECTED_COUNT}.` : "",
    missingSummarySlugs.length ? `${missingSummarySlugs.length} generated slug(s) missing SEO summaries.` : "",
    previewManifest.books.length !== EXPECTED_COUNT ? `Startup preview count is ${previewManifest.books.length}, expected ${EXPECTED_COUNT}.` : "",
  ].filter(Boolean);
  const ready = blockers.length === 0;

  return {
    schemaVersion: 1,
    reportName: "cloudflare-export-prep",
    generatedAt: "2026-06-29",
    branch: "morsewords-cloudflare-export-prep-jun-2026",
    executiveResult: ready
      ? "The refreshed local Cloudflare export matches the finalized generated library and is ready for a sync/delete style Cloudflare upload."
      : `The refreshed local Cloudflare export is not ready because ${blockers.length} blocker(s) remain.`,
    sourceOfTruthCounts: {
      generatedBooks: generatedSlugs.length,
      seoSummaries: seoSlugs.size,
      startupPreviews: previewManifest.books.length,
      missingSummaries: missingSummarySlugs.length,
      bookUrls: generatedSlugs.length,
      audiobookUrls: generatedSlugs.length,
    },
    exportCommandAdded: "npm run books:cloudflare-export",
    exportCommandUsed: "npm run books:cloudflare-export",
    exportOutputLocation: "app/client/assets/books/cloudflare-export",
    exportFilePayloadCounts: {
      totalFiles: exportFiles.length,
      bookPayloads: exportedBooks.length,
      manifestFiles: exportFiles.length - exportedBooks.length,
    },
    generatedVsExportSlugComparison: {
      missingFromExport,
      extraInExport,
      duplicateExportSlugs,
      duplicateExportPaths,
    },
    removedDeferredBlockedSlugExclusion: {
      result: blockedOrSourceRiskSlugsExported.length === 0 ? "pass" : "fail",
      blockedOrSourceRiskSlugsExported,
      note: "Exported slugs are required to match the live generated manifest exactly; blocked/source-risk raw candidates from the decision checkpoint must not appear as extra live exports.",
    },
    metadataConsistency: {
      result: metadataFailures.length === 0 ? "pass" : "fail",
      failures: metadataFailures,
    },
    sectionContent: {
      result: sectionFailures.length === 0 ? "pass" : "fail",
      failures: sectionFailures,
    },
    badLabelScan: {
      result: badLabelFailures.length === 0 ? "pass" : "fail",
      failures: badLabelFailures,
    },
    wordCount: {
      result: wordCountFailures.length === 0 ? "pass" : "fail",
      failures: wordCountFailures,
    },
    representativePayloadChecks,
    staleExportCleanup: {
      result:
        exportedBooks.length === EXPECTED_COUNT &&
        extraInExport.length === 0 &&
        missingFromExport.length === 0
          ? "pass"
          : "fail",
      stalePayloadCountBeforeThisBranch: STALE_PAYLOAD_COUNT_BEFORE_BRANCH,
      refreshedPayloadCount: exportedBooks.length,
      note: "The export command resets app/client/assets/books/cloudflare-export before writing, so the local export behaves like sync/delete rather than append-only.",
    },
    cloudflareUploadInstructions: {
      localExportDirectory: "app/client/assets/books/cloudflare-export",
      fileCountToUpload: exportFiles.length,
      bookPayloadCountToUpload: exportedBooks.length,
      overwriteExistingKeys: true,
      deleteStaleRemoteKeys: true,
      syncDeleteRequired: true,
      validationCommandBeforeUpload:
        "npm run books:cloudflare-export && npm run books:cloudflare-export-audit",
      uploadCommand:
        "No safe local upload command was run in this branch; use the project's Cloudflare/R2 sync tooling with delete enabled after credentials and target are confirmed.",
      uploadCommandRun: false,
    },
    postUploadValidationRequirements: [
      "Fetch the remote public-manifest.json and verify it lists exactly 519 books.",
      "Fetch representative remote book payloads for middlemarch or walden, the-bottle-imp, a Poe story, a Wilde story, the-leavenworth-case, and walden.",
      "Verify old removed/deferred/source-risk book keys return 404 or are absent after sync/delete.",
      "Rerun the app route checks against the configured Cloudflare book content base URL.",
    ],
    postExportBookRouteChapterNavViewWindowValidationRequirements: [
      "Confirm reader view uses final Cloudflare payloads rather than starter-preview-only text.",
      "Confirm section picker, cleaned preview, Morse preview, and audiobook behavior use the uploaded full payloads.",
      "Confirm no intended live book route returns 404 and no deferred/blocked route appears as live.",
      "Perform the final chapter/nav/view-window review only after the refreshed payloads are uploaded or served through the production-like Cloudflare path.",
    ],
    laterContentQualityCheckpoints: [
      "Sources page trust-copy update: stronger source-selection, review, source-link, correction, and takedown handling.",
      "About page E-E-A-T sentence: connect Electrical and Computer Engineering background to Morse code, signal systems, communication systems, encoding, timing, audio, or transmission.",
      "Repeated helper-copy reduction before final content quality review.",
    ],
    deferredFinalStages: [
      "Non-book sitemap page implementation remains later.",
      "URL/indexability audit remains later.",
      "GSC/meta review remains later.",
      "Broad mobile optimization remains the final stage.",
    ],
    blockers,
    readinessDecision: ready
      ? "Ready for Cloudflare upload"
      : `Not ready for Cloudflare upload because ${blockers.length} blocker(s) remain`,
  };
}

const report = runAudit();
writeJson(REPORT_JSON_PATH, report);
writeText(REPORT_MD_PATH, markdown(report));

console.log("Cloudflare export audit complete.");
console.log(`Generated books: ${report.sourceOfTruthCounts.generatedBooks}`);
console.log(`Exported book payloads: ${report.exportFilePayloadCounts.bookPayloads}`);
console.log(`Export files: ${report.exportFilePayloadCounts.totalFiles}`);
console.log(`Blockers: ${report.blockers.length}`);
console.log(report.readinessDecision);

if (report.blockers.length > 0) {
  process.exitCode = 1;
}
