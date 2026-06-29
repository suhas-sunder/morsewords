import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  GeneratedBookManifest,
  GeneratedBookSectionJson,
  GeneratedLibraryManifest,
} from "./bookManifestTypes.ts";

type PreviewManifest = {
  version: 1;
  books: Array<{
    slug: string;
    path: string;
    contentVersion: string;
    contentHash: string;
    defaultSectionId: string;
    previewBytes: number;
    previewCharacterCount: number;
  }>;
  missing: Array<{ slug: string; reason: string }> | string[];
};

type PreviewAsset = {
  slug: string;
  contentVersion: string;
  contentHash: string;
  defaultSectionId: string;
  defaultSectionLabel: string;
  previewText: string;
  wordCount: number;
  characterCount: number;
};

type SeoSummaryRegistry = {
  summaries: Array<{
    slug: string;
    title: string;
    author: string[];
    summary: string;
  }>;
};

type DecisionCheckpoint = {
  remainingRawCategoryCounts?: Record<string, number>;
  perCandidateDecisionTable?: Array<{
    rawFile: string;
    currentCategory: string;
    currentDecision: string;
    remainBlockedOrDeferredBeforeCloudflareExport: boolean;
  }>;
};

type BookIssue = {
  slug: string;
  title: string;
  severity: "blocker" | "warning";
  area: "section-content" | "metadata-source" | "preview" | "consistency";
  message: string;
};

type AuditReport = {
  schemaVersion: 1;
  reportName: "book-section-metadata-source-audit";
  generatedAt: string;
  branch: string;
  sourceOfTruth: string[];
  counts: {
    generatedBooks: number;
    seoSummaries: number;
    startupPreviews: number;
    missingSummaries: number;
    bookUrls: number;
    audiobookUrls: number;
    previewsMissingAssets: number;
    previewsForMissingBooks: number;
    sourceUrlsPresent: number;
    sourceUrlsAbsentNoGeneratedEvidence: number;
    sourceUrlsMissingDespiteKnownGeneratedId: number;
    badLabelOccurrences: number;
    deferredBlockedSlugLeakCount: number;
  };
  result: {
    sectionContent: "pass" | "fail";
    metadataSource: "pass" | "fail";
    publicZeroSections: "pass" | "fail";
    badLabels: "pass" | "fail";
    sourceUrlCoverage: "pass" | "warn" | "fail";
    wordCountStatus: "pass" | "fail";
    starterPreviewFirstRender: "pass" | "fail";
    deferredBlockedSlugExclusion: "pass" | "fail";
    cloudflareExportReadiness:
      | "Ready for Cloudflare export preparation branch"
      | "Not ready for Cloudflare export";
  };
  blockers: BookIssue[];
  warnings: BookIssue[];
  sourceUrlAbsentNoGeneratedEvidence: string[];
  fixesMade: Array<{
    slug: string;
    fields: string[];
    evidence: string;
  }>;
  deferredBlockedSlugChecks: Array<{
    rawFile: string;
    inferredSlug: string;
    decision: string;
    absentFromManifest: boolean;
    absentFromSitemap: boolean;
  }>;
  remainingRawCategoryCounts: Record<string, number>;
  postExportValidationRequirements: string[];
  laterContentQualityCheckpoints: string[];
  deferredFinalStages: string[];
};

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const siteUrl = "https://www.morsewords.com";

const relativePaths = {
  libraryManifest: "app/client/assets/books/generated/library-manifest.json",
  seoSummaries: "app/client/assets/books/seo-summaries/book-seo-summaries.json",
  previewManifest: "public/book-previews/manifest.json",
  sitemap: "public/sitemap.xml",
  decisionCheckpoint:
    "app/client/assets/books/audit-reports/book-library-decision-checkpoint/book-library-decision-checkpoint.json",
  bookIndexRoute: "app/routes/morse-code-books.tsx",
  audiobookIndexRoute: "app/routes/morse-code-audiobooks.tsx",
  bookPage: "app/client/components/morse-code-books/MorseBookPage.tsx",
  bookDirectory:
    "app/client/components/morse-code-books/MorseBookLinkDirectory.tsx",
} as const;

const reportRoot = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "book-section-metadata-source-audit",
);
const reportJsonPath = path.join(
  reportRoot,
  "book-section-metadata-source-audit.json",
);
const reportMdPath = path.join(
  reportRoot,
  "book-section-metadata-source-audit.md",
);

const badPublicLabelPattern =
  /\b(?:Unknown author|Unknown source|Source unavailable|Metadata unavailable|0 sections|Sections: 0)\b/i;
const placeholderContentPattern =
  /\b(?:reference file does not include body text|missing source content|generic placeholder|placeholder generated content|SOS Help)\b/i;

function absolutePath(relativePath: string) {
  return path.join(repoRoot, ...relativePath.split("/"));
}

function readText(relativePath: string) {
  return fs.readFileSync(absolutePath(relativePath), "utf8");
}

function readJson<T>(relativePath: string): T {
  return JSON.parse(readText(relativePath)) as T;
}

function readJsonPath<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeTextIfChanged(filePath: string, next: string) {
  const current = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf8")
    : null;
  if (current === next) return false;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, next);
  return true;
}

function writeJsonIfChanged(filePath: string, data: unknown) {
  return writeTextIfChanged(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function normalizedWords(text: string) {
  return text.trim().replace(/\s+/g, " ");
}

function isReadableText(text: string | null | undefined) {
  const normalized = normalizedWords(text ?? "");
  return normalized.length >= 40 && !placeholderContentPattern.test(normalized);
}

function slugifyRawFile(rawFile: string) {
  return rawFile
    .replace(/\.txt$/i, "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['"’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sitemapSlugs(xml: string, routePrefix: string) {
  const pattern = new RegExp(
    `<loc>${siteUrl}${routePrefix}/([^/<]+)</loc>`,
    "g",
  );
  return new Set([...xml.matchAll(pattern)].map((match) => match[1]));
}

function addIssue(
  collection: BookIssue[],
  slug: string,
  title: string,
  severity: BookIssue["severity"],
  area: BookIssue["area"],
  message: string,
) {
  collection.push({ slug, title, severity, area, message });
}

function sectionTextFor(
  generatedRoot: string,
  manifest: GeneratedBookManifest,
  section: GeneratedBookManifest["sections"][number],
) {
  const sectionPath = path.join(
    generatedRoot,
    manifest.slug,
    ...section.sectionJsonPath.split("/"),
  );
  if (!fs.existsSync(sectionPath)) return null;
  const sectionJson = readJsonPath<GeneratedBookSectionJson>(sectionPath);
  return sectionJson.displayText || sectionJson.morseSourceText || "";
}

function scanBadLabels(label: string, text: string) {
  const matches = [...text.matchAll(new RegExp(badPublicLabelPattern, "gi"))];
  return matches.map((match) => `${label}: ${match[0]}`);
}

function markdownList(values: string[]) {
  if (values.length === 0) return "- None";
  return values.map((value) => `- ${value}`).join("\n");
}

function reportMarkdown(report: AuditReport) {
  const executive =
    report.result.cloudflareExportReadiness ===
    "Ready for Cloudflare export preparation branch"
      ? "Ready for Cloudflare export preparation branch"
      : `Not ready for Cloudflare export because ${report.blockers.length} blocker(s) remain.`;
  const blockerRows =
    report.blockers.length === 0
      ? "| none | none | none |\n"
      : report.blockers
          .map(
            (issue) =>
              `| ${issue.slug} | ${issue.area} | ${issue.message.replace(/\|/g, "\\|")} |`,
          )
          .join("\n");
  const warningRows =
    report.warnings.length === 0
      ? "| none | none | none |\n"
      : report.warnings
          .slice(0, 80)
          .map(
            (issue) =>
              `| ${issue.slug} | ${issue.area} | ${issue.message.replace(/\|/g, "\\|")} |`,
          )
          .join("\n");
  const sourceUrlSample = report.sourceUrlAbsentNoGeneratedEvidence
    .slice(0, 60)
    .map((slug) => `- ${slug}`)
    .join("\n");

  return `# Book Section, Metadata, and Source Audit

Generated: ${report.generatedAt}

## 1. Executive result

${executive}.

Cloudflare export was not run. This audit used generated local manifests, generated section JSON, SEO summaries, starter previews, the sitemap, and the book-library decision checkpoint. It did not use Cloudflare export as source of truth.

## 2. Current library counts

- Generated books: ${report.counts.generatedBooks}
- SEO summaries: ${report.counts.seoSummaries}
- Startup previews: ${report.counts.startupPreviews}
- Missing summaries: ${report.counts.missingSummaries}
- Book URLs: ${report.counts.bookUrls}
- Audiobook URLs: ${report.counts.audiobookUrls}

## 3. Section/content audit result

Result: **${report.result.sectionContent}**

Every live generated book has at least one section in its manifest, a positive section count, and readable generated section text.

## 4. Metadata/source audit result

Result: **${report.result.metadataSource}**

The audit blocks empty titles, empty authors, lazy unknown labels, missing source names, missing known source URLs, non-positive word counts, zero sections, and non-approved live status.

## 5. Public-surface "0 sections" result

Result: **${report.result.publicZeroSections}**

Bad public label occurrences found in audited public data/source surfaces: ${report.counts.badLabelOccurrences}.

## 6. Bad-label scan result

Result: **${report.result.badLabels}**

The scan covers generated manifests, preview manifests, SEO summary registry metadata, and book/audiobook/listing component source used for public surfaces.

## 7. Source URL coverage result

Result: **${report.result.sourceUrlCoverage}**

- Source URLs present: ${report.counts.sourceUrlsPresent}
- Missing despite known generated Gutenberg ID: ${report.counts.sourceUrlsMissingDespiteKnownGeneratedId}
- Absent because current generated metadata has no source URL or Gutenberg ID: ${report.counts.sourceUrlsAbsentNoGeneratedEvidence}

Absent source URL entries without generated URL evidence:

${sourceUrlSample || "- None"}

## 8. Word-count/status result

Result: **${report.result.wordCountStatus}**

All live generated books have positive word counts and approved/publish-ready/processing-allowed generated status.

## 9. Starter-preview first-render readiness

Result: **${report.result.starterPreviewFirstRender}**

Every live generated book has a matching starter preview asset with readable preview text and matching content hash/version.

## 10. Deferred/blocked slug exclusion result

Result: **${report.result.deferredBlockedSlugExclusion}**

Deferred or blocked raw candidates from the decision checkpoint remain outside the live generated manifest and book/audiobook sitemap routes when their inferred slug is not already a different accepted generated work.

## 11. Fixes made, if any

${markdownList(
  report.fixesMade.map(
    (fix) => `${fix.slug}: ${fix.fields.join(", ")} (${fix.evidence})`,
  ),
)}

## 12. Remaining risks, if any

| Slug | Area | Message |
| --- | --- | --- |
${warningRows}

## Blockers

| Slug | Area | Message |
| --- | --- | --- |
${blockerRows}

## 13. Cloudflare export readiness decision

**${report.result.cloudflareExportReadiness}**

## 14. Post-export validation requirements

${markdownList(report.postExportValidationRequirements)}

## 15. Later content-quality checkpoints: Sources page, About page, repeated helper copy

${markdownList(report.laterContentQualityCheckpoints)}

## 16. Deferred final stages: URL/indexability, GSC/meta review, mobile optimization

${markdownList(report.deferredFinalStages)}
`;
}

const generatedRoot = absolutePath("app/client/assets/books/generated");
const previewRoot = absolutePath("public/book-previews");
const libraryManifest = readJson<GeneratedLibraryManifest>(
  relativePaths.libraryManifest,
);
const previewManifest = readJson<PreviewManifest>(relativePaths.previewManifest);
const seoSummaries = readJson<SeoSummaryRegistry>(relativePaths.seoSummaries);
const checkpoint = readJson<DecisionCheckpoint>(
  relativePaths.decisionCheckpoint,
);
const sitemapXml = readText(relativePaths.sitemap);

const bookSlugs = new Set(libraryManifest.books.map((book) => book.slug));
const previewBySlug = new Map(previewManifest.books.map((book) => [book.slug, book]));
const summaryBySlug = new Map(seoSummaries.summaries.map((summary) => [summary.slug, summary]));
const sitemapBookSlugs = sitemapSlugs(sitemapXml, "/morse-code-books");
const sitemapAudiobookSlugs = sitemapSlugs(sitemapXml, "/morse-code-audiobooks");
const blockers: BookIssue[] = [];
const warnings: BookIssue[] = [];
const sourceUrlAbsentNoGeneratedEvidence: string[] = [];

let sourceUrlsPresent = 0;
let sourceUrlsMissingDespiteKnownGeneratedId = 0;

for (const book of libraryManifest.books) {
  const manifestPath = path.join(generatedRoot, ...book.manifestPath.split("/"));
  if (!fs.existsSync(manifestPath)) {
    addIssue(
      blockers,
      book.slug,
      book.title,
      "blocker",
      "consistency",
      "Generated library manifest points to a missing per-book manifest.",
    );
    continue;
  }

  const manifest = readJsonPath<GeneratedBookManifest>(manifestPath);
  const previewEntry = previewBySlug.get(book.slug);
  const seoEntry = summaryBySlug.get(book.slug);

  if (manifest.slug !== book.slug) {
    addIssue(blockers, book.slug, book.title, "blocker", "consistency", "Per-book manifest slug does not match library manifest slug.");
  }
  if (manifest.title !== book.title) {
    addIssue(blockers, book.slug, book.title, "blocker", "metadata-source", "Manifest title does not match library title.");
  }
  if (JSON.stringify(manifest.author) !== JSON.stringify(book.author)) {
    addIssue(blockers, book.slug, book.title, "blocker", "metadata-source", "Manifest author does not match library author.");
  }
  if (manifest.source.provider !== book.source.provider) {
    addIssue(blockers, book.slug, book.title, "blocker", "metadata-source", "Source provider differs between library and per-book manifest.");
  }
  if ((manifest.source.sourceUrl ?? null) !== (book.source.sourceUrl ?? null)) {
    addIssue(blockers, book.slug, book.title, "blocker", "metadata-source", "Source URL differs between library and per-book manifest.");
  }
  if (manifest.stats.wordCount !== book.stats.wordCount) {
    addIssue(blockers, book.slug, book.title, "blocker", "metadata-source", "Word count differs between library and per-book manifest.");
  }
  if (manifest.stats.sectionCount !== book.stats.sectionCount) {
    addIssue(blockers, book.slug, book.title, "blocker", "section-content", "Section count differs between library and per-book manifest.");
  }
  if (!book.title.trim()) {
    addIssue(blockers, book.slug, book.title, "blocker", "metadata-source", "Title is empty.");
  }
  if (!book.author.length || book.author.some((author) => !author.trim())) {
    addIssue(blockers, book.slug, book.title, "blocker", "metadata-source", "Author is empty.");
  }
  if (book.author.some((author) => /unknown author/i.test(author))) {
    addIssue(blockers, book.slug, book.title, "blocker", "metadata-source", "Author uses lazy Unknown author label.");
  }
  if (!book.source.provider.trim() || /unknown source|source unavailable|metadata unavailable|^unknown$/i.test(book.source.provider.trim())) {
    addIssue(blockers, book.slug, book.title, "blocker", "metadata-source", "Source provider is missing or unknown.");
  }
  if (book.source.sourceUrl) {
    sourceUrlsPresent += 1;
  } else if (book.source.gutenbergId) {
    sourceUrlsMissingDespiteKnownGeneratedId += 1;
    addIssue(blockers, book.slug, book.title, "blocker", "metadata-source", "Source URL is missing despite a generated Gutenberg ID.");
  } else {
    sourceUrlAbsentNoGeneratedEvidence.push(book.slug);
    addIssue(warnings, book.slug, book.title, "warning", "metadata-source", "Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence.");
  }
  if (book.stats.wordCount <= 0) {
    addIssue(blockers, book.slug, book.title, "blocker", "metadata-source", "Word count is not positive.");
  }
  if (book.stats.sectionCount <= 0 || manifest.sections.length === 0) {
    addIssue(blockers, book.slug, book.title, "blocker", "section-content", "Book has zero usable sections.");
  }
  if (book.stats.sectionCount !== manifest.sections.length) {
    addIssue(blockers, book.slug, book.title, "blocker", "section-content", "Section count does not match manifest section structure.");
  }
  if (
    book.source.publishReady !== true ||
    book.source.processingAllowed !== true ||
    book.source.rightsStatus !== "approved"
  ) {
    addIssue(blockers, book.slug, book.title, "blocker", "metadata-source", "Live book status is not approved/publish-ready/processing-allowed.");
  }

  const readableSections = manifest.sections.filter((section) => {
    const text = sectionTextFor(generatedRoot, manifest, section);
    return isReadableText(text);
  });
  if (readableSections.length === 0) {
    addIssue(blockers, book.slug, book.title, "blocker", "section-content", "No generated section JSON has readable text.");
  }
  for (const section of manifest.sections) {
    if (badPublicLabelPattern.test(section.label) || badPublicLabelPattern.test(section.title ?? "")) {
      addIssue(blockers, book.slug, book.title, "blocker", "section-content", `Section label/title exposes bad public label: ${section.label}${section.title ? ` / ${section.title}` : ""}.`);
    }
  }

  if (!previewEntry) {
    addIssue(blockers, book.slug, book.title, "blocker", "preview", "Missing starter preview manifest entry.");
  } else {
    const previewPath = path.join(previewRoot, path.basename(previewEntry.path));
    if (!fs.existsSync(previewPath)) {
      addIssue(blockers, book.slug, book.title, "blocker", "preview", "Starter preview asset is missing.");
    } else {
      const preview = readJsonPath<PreviewAsset>(previewPath);
      if (preview.slug !== book.slug) {
        addIssue(blockers, book.slug, book.title, "blocker", "preview", "Preview slug does not match generated book slug.");
      }
      if (preview.contentVersion !== book.contentVersion || preview.contentHash !== book.contentHash) {
        addIssue(blockers, book.slug, book.title, "blocker", "preview", "Preview content version/hash does not match generated book.");
      }
      if (!manifest.sections.some((section) => section.id === preview.defaultSectionId)) {
        addIssue(blockers, book.slug, book.title, "blocker", "preview", "Preview default section is not present in generated manifest.");
      }
      if (!isReadableText(preview.previewText)) {
        addIssue(blockers, book.slug, book.title, "blocker", "preview", "Starter preview text is missing or placeholder-like.");
      }
      if (preview.wordCount <= 0 || preview.characterCount <= 0) {
        addIssue(blockers, book.slug, book.title, "blocker", "preview", "Starter preview has non-positive word or character count.");
      }
      if (badPublicLabelPattern.test(preview.defaultSectionLabel) || badPublicLabelPattern.test(preview.previewText)) {
        addIssue(blockers, book.slug, book.title, "blocker", "preview", "Starter preview exposes a bad public label.");
      }
    }
  }

  if (!seoEntry) {
    addIssue(blockers, book.slug, book.title, "blocker", "consistency", "Missing SEO summary.");
  } else {
    if (seoEntry.title !== book.title) {
      addIssue(blockers, book.slug, book.title, "blocker", "metadata-source", "SEO summary title does not match generated title.");
    }
    if (!seoEntry.summary.trim()) {
      addIssue(blockers, book.slug, book.title, "blocker", "consistency", "SEO summary text is empty.");
    }
  }
}

for (const preview of previewManifest.books) {
  if (!bookSlugs.has(preview.slug)) {
    addIssue(blockers, preview.slug, preview.slug, "blocker", "preview", "Starter preview points at a missing or deferred book.");
  }
}

const badLabelSources = [
  [relativePaths.libraryManifest, readText(relativePaths.libraryManifest)],
  [relativePaths.previewManifest, readText(relativePaths.previewManifest)],
  [relativePaths.seoSummaries, readText(relativePaths.seoSummaries)],
  [relativePaths.bookIndexRoute, readText(relativePaths.bookIndexRoute)],
  [relativePaths.audiobookIndexRoute, readText(relativePaths.audiobookIndexRoute)],
  [relativePaths.bookPage, readText(relativePaths.bookPage)],
  [relativePaths.bookDirectory, readText(relativePaths.bookDirectory)],
] as const;
const badLabelMatches = badLabelSources.flatMap(([label, text]) =>
  scanBadLabels(label, text),
);
for (const match of badLabelMatches) {
  addIssue(blockers, "public-surface", "Public surfaces", "blocker", "section-content", `Bad public label found: ${match}.`);
}

const deferredBlockedSlugChecks = (checkpoint.perCandidateDecisionTable ?? [])
  .filter((candidate) => candidate.remainBlockedOrDeferredBeforeCloudflareExport)
  .map((candidate) => {
    const inferredSlug = slugifyRawFile(candidate.rawFile);
    const absentFromManifest = !bookSlugs.has(inferredSlug);
    const absentFromSitemap =
      !sitemapBookSlugs.has(inferredSlug) && !sitemapAudiobookSlugs.has(inferredSlug);
    if (!absentFromManifest || !absentFromSitemap) {
      addIssue(
        blockers,
        inferredSlug,
        candidate.rawFile,
        "blocker",
        "consistency",
        "Deferred or blocked candidate inferred slug appears in live generated manifest or sitemap.",
      );
    }
    return {
      rawFile: candidate.rawFile,
      inferredSlug,
      decision: candidate.currentDecision,
      absentFromManifest,
      absentFromSitemap,
    };
  });

const missingSummaries = libraryManifest.books.filter(
  (book) => !summaryBySlug.has(book.slug),
);
const missingBookUrls = libraryManifest.books.filter(
  (book) => !sitemapBookSlugs.has(book.slug),
);
const missingAudiobookUrls = libraryManifest.books.filter(
  (book) => !sitemapAudiobookSlugs.has(book.slug),
);
for (const book of missingBookUrls) {
  addIssue(blockers, book.slug, book.title, "blocker", "consistency", "Missing book sitemap URL.");
}
for (const book of missingAudiobookUrls) {
  addIssue(blockers, book.slug, book.title, "blocker", "consistency", "Missing audiobook sitemap URL.");
}

const sectionContentFailed = blockers.some(
  (issue) => issue.area === "section-content",
);
const metadataSourceFailed = blockers.some(
  (issue) => issue.area === "metadata-source",
);
const previewFailed = blockers.some((issue) => issue.area === "preview");
const consistencyFailed = blockers.some((issue) => issue.area === "consistency");
const cloudflareReady = blockers.length === 0;

const report: AuditReport = {
  schemaVersion: 1,
  reportName: "book-section-metadata-source-audit",
  generatedAt: new Date().toISOString().slice(0, 10),
  branch: "morsewords-book-section-metadata-source-audit-jun-2026",
  sourceOfTruth: Object.values(relativePaths).filter(
    (value) => !value.includes("cloudflare-export"),
  ),
  counts: {
    generatedBooks: libraryManifest.books.length,
    seoSummaries: seoSummaries.summaries.length,
    startupPreviews: previewManifest.books.length,
    missingSummaries: missingSummaries.length,
    bookUrls: sitemapBookSlugs.size,
    audiobookUrls: sitemapAudiobookSlugs.size,
    previewsMissingAssets: blockers.filter((issue) => issue.message === "Starter preview asset is missing.").length,
    previewsForMissingBooks: previewManifest.books.filter((preview) => !bookSlugs.has(preview.slug)).length,
    sourceUrlsPresent,
    sourceUrlsAbsentNoGeneratedEvidence: sourceUrlAbsentNoGeneratedEvidence.length,
    sourceUrlsMissingDespiteKnownGeneratedId,
    badLabelOccurrences: badLabelMatches.length,
    deferredBlockedSlugLeakCount: deferredBlockedSlugChecks.filter(
      (check) => !check.absentFromManifest || !check.absentFromSitemap,
    ).length,
  },
  result: {
    sectionContent: sectionContentFailed ? "fail" : "pass",
    metadataSource: metadataSourceFailed ? "fail" : "pass",
    publicZeroSections: badLabelMatches.some((match) => /0 sections|Sections: 0/i.test(match)) ? "fail" : "pass",
    badLabels: badLabelMatches.length > 0 ? "fail" : "pass",
    sourceUrlCoverage:
      sourceUrlsMissingDespiteKnownGeneratedId > 0
        ? "fail"
        : sourceUrlAbsentNoGeneratedEvidence.length > 0
          ? "warn"
          : "pass",
    wordCountStatus: metadataSourceFailed ? "fail" : "pass",
    starterPreviewFirstRender: previewFailed ? "fail" : "pass",
    deferredBlockedSlugExclusion:
      deferredBlockedSlugChecks.some(
        (check) => !check.absentFromManifest || !check.absentFromSitemap,
      )
        ? "fail"
        : "pass",
    cloudflareExportReadiness: cloudflareReady
      ? "Ready for Cloudflare export preparation branch"
      : "Not ready for Cloudflare export",
  },
  blockers,
  warnings,
  sourceUrlAbsentNoGeneratedEvidence,
  fixesMade: [
    {
      slug: "the-arabian-nights",
      fields: ["author"],
      evidence:
        "Generated rights report and source evidence identify this as a traditional story collection edited by Kate Douglas Wiggin and Nora A. Smith; live author label is now the intentional label Various.",
    },
    {
      slug: "the-happy-family",
      fields: ["source.provider", "source.gutenbergId", "source.sourceUrl", "source.releaseDate"],
      evidence:
        "Local source header evidence for The Happy Family identifies Andersen's Fairy Tales, Project Gutenberg ebook 1597, released January 1, 1999.",
    },
  ],
  deferredBlockedSlugChecks,
  remainingRawCategoryCounts: checkpoint.remainingRawCategoryCounts ?? {},
  postExportValidationRequirements: [
    "Final Cloudflare payloads are current.",
    "Starter-preview-only content does not replace final full book content.",
    "Reader view, section picker, cleaned preview, Morse preview, and audiobook behavior use final exported payloads.",
    "No intended live book route returns 404.",
    "No deferred or blocked book appears as a live public book.",
  ],
  laterContentQualityCheckpoints: [
    "Sources page trust-copy update for source selection, review, source links, and correction/takedown handling.",
    "About page E-E-A-T sentence connecting Electrical and Computer Engineering background to Morse code, signal systems, communication systems, encoding, timing, audio, or transmission.",
    "Repeated helper-copy reduction across tool/helper pages before final quality review.",
  ],
  deferredFinalStages: [
    "URL/page/indexability implementation remains later.",
    "GSC/meta review remains later.",
    "Broad mobile optimization remains the final stage.",
  ],
};

writeJsonIfChanged(reportJsonPath, report);
writeTextIfChanged(reportMdPath, reportMarkdown(report));

console.log(
  [
    `Generated books: ${report.counts.generatedBooks}`,
    `SEO summaries: ${report.counts.seoSummaries}`,
    `Startup previews: ${report.counts.startupPreviews}`,
    `Missing summaries: ${report.counts.missingSummaries}`,
    `Book URLs: ${report.counts.bookUrls}`,
    `Audiobook URLs: ${report.counts.audiobookUrls}`,
    `Blockers: ${report.blockers.length}`,
    `Warnings: ${report.warnings.length}`,
    `Cloudflare readiness: ${report.result.cloudflareExportReadiness}`,
  ].join("\n"),
);

if (report.blockers.length > 0 || consistencyFailed) {
  process.exitCode = 1;
}
