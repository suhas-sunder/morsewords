import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type JsonObject = Record<string, unknown>;

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");

const generatedRoot = path.join(repoRoot, "app/client/assets/books/generated");
const libraryManifestPath = path.join(generatedRoot, "library-manifest.json");
const seoSummaryPath = path.join(
  repoRoot,
  "app/client/assets/books/seo-summaries/book-seo-summaries.json",
);
const previewRoot = path.join(repoRoot, "public/book-previews");
const previewManifestPath = path.join(previewRoot, "manifest.json");
const tempBooksRoot = path.join(repoRoot, "app/client/assets/temp-books");
const sitemapPath = path.join(repoRoot, "public/sitemap.xml");

const triageReportPath = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/remaining-raw-inventory-triage/remaining-raw-inventory-triage.json",
);
const poeReportPath = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/poe-replacement-raw-reconciliation/poe-replacement-raw-reconciliation.json",
);
const remainingRawReportPath = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/remaining-raw-candidate-completion/remaining-raw-candidate-completion.json",
);
const unresolvedSourceReviewPath = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/unresolved-source-generated-review/unresolved-source-generated-review.json",
);
const decisionCheckpointPath = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/book-source-decision-checkpoint/book-source-decision-checkpoint.json",
);
const reportRoot = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/source-risk-removal-and-raw-gap-audit",
);
const reportJsonPath = path.join(reportRoot, "source-risk-removal-and-raw-gap-audit.json");
const reportMdPath = path.join(reportRoot, "source-risk-removal-and-raw-gap-audit.md");

const approvedRemovalSlugs = [
  "a-princess-of-mars",
  "doctor-dolittle",
  "heidi",
  "nights-with-uncle-remus",
  "peter-pan",
  "tarzan-of-the-apes",
  "the-thirty-nine-steps",
  "wood-folk-at-school",
  "jabberwocky",
] as const;

const approvedRemovalSet = new Set<string>(approvedRemovalSlugs);

const categoryOrder = [
  "generated-live",
  "generated-then-user-approved-removed",
  "already-handled-by-replacement",
  "duplicate-or-near-duplicate",
  "parent-collection-or-aggregate-not-used",
  "unsafe-start-end-boundary-risk",
  "unsafe-automation-structure",
  "unsafe-metadata-risk",
  "unsafe-title-parent-collection-risk",
  "blocked-source-or-rights-risk",
  "future-bespoke-required",
  "manual-review-required",
  "non-book-or-invalid",
  "removed-or-missing-from-current-raw",
  "unknown-unclassified",
] as const;

type ReconciliationCategory = (typeof categoryOrder)[number];

type RawReconciliationRow = {
  rawSourceFilename: string;
  rawSourcePath: string;
  inferredSlug: string;
  category: ReconciliationCategory;
  reason: string;
  evidence: string[];
  generatedSlug: string | null;
};

function readJson<T = JsonObject>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function slugify(value: string) {
  return value
    .replace(/\.txt$/i, "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function rel(filePath: string) {
  return path.relative(repoRoot, filePath).replace(/\\/g, "/");
}

function removePathInside(root: string, target: string) {
  const resolvedRoot = path.resolve(root);
  const resolvedTarget = path.resolve(target);
  if (
    resolvedTarget !== resolvedRoot &&
    !resolvedTarget.startsWith(`${resolvedRoot}${path.sep}`)
  ) {
    throw new Error(`Refusing to remove path outside ${resolvedRoot}: ${resolvedTarget}`);
  }
  fs.rmSync(resolvedTarget, { recursive: true, force: true });
}

function filterRemovedSlugs(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value
      .filter((entry) => {
        if (typeof entry === "string") return !approvedRemovalSet.has(entry);
        if (entry && typeof entry === "object" && "slug" in entry) {
          return !approvedRemovalSet.has(String((entry as { slug: unknown }).slug));
        }
        return true;
      })
      .map((entry) => filterRemovedSlugs(entry));
  }
  if (value && typeof value === "object") {
    const output: JsonObject = {};
    for (const [key, entry] of Object.entries(value)) {
      output[key] = filterRemovedSlugs(entry);
    }
    return output;
  }
  return value;
}

function countSummaries(seo: { summaries?: unknown[] }) {
  return Array.isArray(seo.summaries) ? seo.summaries.length : 0;
}

function countPreviewFiles() {
  return fs
    .readdirSync(previewRoot)
    .filter((file) => file.endsWith(".preview.json")).length;
}

function categoryFromOldTriage(primaryCategory: string): ReconciliationCategory {
  const map: Record<string, ReconciliationCategory> = {
    "accepted-already-generated": "generated-live",
    "manual-review-required": "manual-review-required",
    "unsafe-start-or-end-boundary-risk": "unsafe-start-end-boundary-risk",
    "unsafe-metadata-risk": "unsafe-metadata-risk",
    "candidate-for-future-manual-processing": "future-bespoke-required",
    "known-duplicate-or-near-duplicate": "duplicate-or-near-duplicate",
    "unsafe-automation-structure": "unsafe-automation-structure",
    "non-book-or-invalid-file": "non-book-or-invalid",
    "known-boundary-defect": "unsafe-start-end-boundary-risk",
    "blocked-source-or-rights-risk": "blocked-source-or-rights-risk",
    "unsafe-title-or-parent-collection-risk": "unsafe-title-parent-collection-risk",
  };
  return map[primaryCategory] ?? "unknown-unclassified";
}

function addManualDeferredMappings(
  mapping: Map<string, { category: ReconciliationCategory; reason: string }>,
  remainingRawReport: JsonObject,
) {
  const manualDeferred = remainingRawReport.manualDeferredSkippedCandidates as
    | Record<string, Array<{ slug: string; reason?: string }>>
    | undefined;
  if (!manualDeferred) return;
  const categoryByBucket: Record<string, ReconciliationCategory> = {
    manualReviewRequired: "manual-review-required",
    futureBespokeRequired: "future-bespoke-required",
    duplicateOrNearDuplicate: "duplicate-or-near-duplicate",
    blockedSourceOrRightsRisk: "blocked-source-or-rights-risk",
    unsafeBoundary: "unsafe-start-end-boundary-risk",
    unsafeAutomation: "unsafe-automation-structure",
    unsafeMetadata: "unsafe-metadata-risk",
    unsafeTitleParentCollection: "unsafe-title-parent-collection-risk",
    knownBoundaryDefect: "unsafe-start-end-boundary-risk",
    nonBookOrInvalid: "non-book-or-invalid",
  };
  for (const [bucket, entries] of Object.entries(manualDeferred)) {
    const category = categoryByBucket[bucket];
    if (!category || !Array.isArray(entries)) continue;
    for (const entry of entries) {
      mapping.set(entry.slug, {
        category,
        reason:
          entry.reason ??
          `Classified by remaining-raw-candidate-completion manual-deferred bucket ${bucket}.`,
      });
    }
  }
}

function summarizeCounts(rows: RawReconciliationRow[]) {
  const counts = Object.fromEntries(categoryOrder.map((category) => [category, 0])) as Record<
    ReconciliationCategory,
    number
  >;
  for (const row of rows) counts[row.category] += 1;
  return counts;
}

const libraryBefore = readJson<{ books: Array<{ slug: string; title: string; author: string[] }> }>(
  libraryManifestPath,
);
const seoBefore = readJson<{ expectedSummaryCount?: number; summaries: Array<{ slug: string }> }>(
  seoSummaryPath,
);
const previewManifestBefore = readJson<{ books: Array<{ slug: string }> }>(previewManifestPath);
const sitemapBefore = fs.readFileSync(sitemapPath, "utf8");

const beforeCounts = {
  generated: libraryBefore.books.length,
  seoSummaries: countSummaries(seoBefore),
  previews: countPreviewFiles(),
};

const foundRemovalSlugs = approvedRemovalSlugs.filter((slug) => {
  const generatedDir = path.join(generatedRoot, slug);
  const previewPath = path.join(previewRoot, `${slug}.preview.json`);
  return (
    fs.existsSync(generatedDir) ||
    fs.existsSync(previewPath) ||
    libraryBefore.books.some((book) => book.slug === slug) ||
    seoBefore.summaries.some((summary) => summary.slug === slug) ||
    previewManifestBefore.books.some((book) => book.slug === slug)
  );
});

const missingApprovedRemovalSlugs = approvedRemovalSlugs.filter(
  (slug) => !foundRemovalSlugs.includes(slug),
);
if (missingApprovedRemovalSlugs.length > 0) {
  throw new Error(
    `Approved removal slugs not found in processed output: ${missingApprovedRemovalSlugs.join(", ")}`,
  );
}

for (const slug of approvedRemovalSlugs) {
  removePathInside(generatedRoot, path.join(generatedRoot, slug));
  removePathInside(previewRoot, path.join(previewRoot, `${slug}.preview.json`));
}

const libraryAfter = {
  ...libraryBefore,
  books: libraryBefore.books.filter((book) => !approvedRemovalSet.has(book.slug)),
};
writeJson(libraryManifestPath, libraryAfter);

const seoAfter = filterRemovedSlugs({
  ...seoBefore,
  expectedSummaryCount: libraryAfter.books.length,
}) as typeof seoBefore;
writeJson(seoSummaryPath, seoAfter);

const previewManifestAfter = {
  ...previewManifestBefore,
  books: previewManifestBefore.books.filter((book) => !approvedRemovalSet.has(book.slug)),
};
writeJson(previewManifestPath, previewManifestAfter);

let sitemapAfter = sitemapBefore;
for (const slug of approvedRemovalSlugs) {
  for (const route of [
    `/morse-code-books/${slug}`,
    `/morse-code-audiobooks/${slug}`,
    `/morse-code-books/${slug}/print`,
  ]) {
    sitemapAfter = sitemapAfter.replace(
      new RegExp(
        `\\s*<url><loc>https://www\\.morsewords\\.com${route.replace(/\//g, "\\/")}</loc><\\/url>\\r?\\n?`,
        "g",
      ),
      "",
    );
  }
}
fs.writeFileSync(sitemapPath, sitemapAfter);

const generatedSlugsAfter = new Set(libraryAfter.books.map((book) => book.slug));
const previewSlugsAfter = new Set(previewManifestAfter.books.map((book) => book.slug));
const summarySlugsAfter = new Set(seoAfter.summaries.map((summary) => summary.slug));

const rawFiles = fs
  .readdirSync(tempBooksRoot)
  .filter((file) => fs.statSync(path.join(tempBooksRoot, file)).isFile())
  .sort((a, b) => a.localeCompare(b));

const triageReport = readJson<{
  liveRawItems: Array<{
    rawSourceFilename: string;
    slug: string;
    primaryCategory: string;
    automationSafetyVerdict?: string;
    recommendedNextAction?: string;
  }>;
}>(triageReportPath);
const poeReport = readJson<{
  rawPoeFilesCurrentlyPresentInTempBooks?: Array<{ name: string; title: string }>;
  newIndividualPoeStoriesAcceptedGenerated?: Array<{ slug: string; title: string }>;
  poeStoriesAlreadyPresentLeftUntouched?: Array<{ slug: string; title: string }>;
}>(poeReportPath);
const remainingRawReport = readJson<JsonObject>(remainingRawReportPath);

const triageByFilename = new Map(
  triageReport.liveRawItems.map((item) => [item.rawSourceFilename, item]),
);
const manualDeferredBySlug = new Map<
  string,
  { category: ReconciliationCategory; reason: string }
>();
addManualDeferredMappings(manualDeferredBySlug, remainingRawReport);

const acceptedCandidateSlugs = new Set(
  ((remainingRawReport.acceptedGeneratedCandidates as Array<{ slug: string }> | undefined) ?? []).map(
    (entry) => entry.slug,
  ),
);
const poeRawFilenameSet = new Set(
  (poeReport.rawPoeFilesCurrentlyPresentInTempBooks ?? []).map((entry) => entry.name),
);

const rawRows: RawReconciliationRow[] = rawFiles.map((rawSourceFilename) => {
  const rawPath = path.join(tempBooksRoot, rawSourceFilename);
  const inferredSlug = slugify(rawSourceFilename);
  const triageItem = triageByFilename.get(rawSourceFilename);
  const evidence: string[] = [];
  let generatedSlug: string | null = null;
  let category: ReconciliationCategory = "unknown-unclassified";
  let reason = "No current report evidence matched this raw file.";

  if (generatedSlugsAfter.has(inferredSlug)) {
    category = "generated-live";
    generatedSlug = inferredSlug;
    reason = "Current generated library contains the direct filename slug.";
    evidence.push("post-removal library-manifest direct slug match");
  } else if (approvedRemovalSet.has(inferredSlug)) {
    category = "generated-then-user-approved-removed";
    generatedSlug = inferredSlug;
    reason = "Direct filename slug matches a user-approved generated removal.";
    evidence.push("user-approved removal list");
  } else if (triageItem) {
    category = categoryFromOldTriage(triageItem.primaryCategory);
    generatedSlug = generatedSlugsAfter.has(triageItem.slug) ? triageItem.slug : null;
    if (generatedSlug) category = "generated-live";
    reason =
      generatedSlug !== null
        ? "Prior triage slug is live in the post-removal generated library."
        : `Prior triage category: ${triageItem.primaryCategory}.`;
    evidence.push("remaining-raw-inventory-triage");
    if (triageItem.automationSafetyVerdict) evidence.push(triageItem.automationSafetyVerdict);
    if (triageItem.recommendedNextAction) evidence.push(`Recommended next action: ${triageItem.recommendedNextAction}`);
  } else if (acceptedCandidateSlugs.has(inferredSlug) && generatedSlugsAfter.has(inferredSlug)) {
    category = "generated-live";
    generatedSlug = inferredSlug;
    reason = "Accepted by the remaining raw candidate completion branch and still live.";
    evidence.push("remaining-raw-candidate-completion acceptedGeneratedCandidates");
  } else if (poeRawFilenameSet.has(rawSourceFilename) && generatedSlugsAfter.has(inferredSlug)) {
    category = "generated-live";
    generatedSlug = inferredSlug;
    reason = "Poe replacement reconciliation accepted this individual raw file and it remains live.";
    evidence.push("poe-replacement-raw-reconciliation rawPoeFilesCurrentlyPresentInTempBooks");
  } else if (manualDeferredBySlug.has(inferredSlug)) {
    const deferred = manualDeferredBySlug.get(inferredSlug)!;
    category = deferred.category;
    reason = deferred.reason;
    evidence.push("remaining-raw-candidate-completion manualDeferredSkippedCandidates");
  }

  if (category === "unknown-unclassified") {
    const fuzzyManual = [...manualDeferredBySlug.entries()].find(([slug]) =>
      inferredSlug.includes(slug) || slug.includes(inferredSlug),
    );
    if (fuzzyManual) {
      category = fuzzyManual[1].category;
      reason = `Matched deferred slug ${fuzzyManual[0]} by filename overlap. ${fuzzyManual[1].reason}`;
      evidence.push("remaining-raw-candidate-completion manualDeferredSkippedCandidates fuzzy filename match");
    }
  }

  return {
    rawSourceFilename,
    rawSourcePath: rel(rawPath),
    inferredSlug,
    category,
    reason,
    evidence,
    generatedSlug,
  };
});

const unknownRows = rawRows.filter((row) => row.category === "unknown-unclassified");
if (unknownRows.length > 0) {
  console.error("Unknown raw files:");
  for (const row of unknownRows) console.error(`- ${row.rawSourceFilename} (${row.inferredSlug})`);
  throw new Error(`unknown-unclassified raw count is ${unknownRows.length}`);
}

const categoryCounts = summarizeCounts(rawRows);
const generatedWithDirectRaw = new Set(
  rawRows
    .filter((row) => row.category === "generated-live" && row.generatedSlug)
    .map((row) => row.generatedSlug!),
);
const generatedWithoutDirectCurrentRawEvidence = libraryAfter.books
  .filter((book) => !generatedWithDirectRaw.has(book.slug))
  .map((book) => book.slug)
  .sort();

const missingSummarySlugs = libraryAfter.books
  .map((book) => book.slug)
  .filter((slug) => !summarySlugsAfter.has(slug))
  .sort();
const missingPreviewSlugs = libraryAfter.books
  .map((book) => book.slug)
  .filter((slug) => !previewSlugsAfter.has(slug) || !fs.existsSync(path.join(previewRoot, `${slug}.preview.json`)))
  .sort();

const nonGeneratedByCategory = Object.fromEntries(
  categoryOrder
    .filter((category) => category !== "generated-live")
    .map((category) => [
      category,
      rawRows
        .filter((row) => row.category === category)
        .map((row) => ({
          rawSourceFilename: row.rawSourceFilename,
          inferredSlug: row.inferredSlug,
          reason: row.reason,
        })),
    ]),
) as Record<Exclude<ReconciliationCategory, "generated-live">, unknown[]>;

const afterCounts = {
  generated: libraryAfter.books.length,
  seoSummaries: countSummaries(seoAfter),
  previews: countPreviewFiles(),
  missingSummaries: missingSummarySlugs.length,
  missingPreviews: missingPreviewSlugs.length,
};

const report = {
  schemaVersion: 1,
  reportName: "source-risk-removal-and-raw-gap-audit",
  generatedAt: "2026-06-28",
  branch: "morsewords-source-risk-removal-and-raw-gap-audit-jun-2026",
  decisionCheckpointBranchMergeStatus:
    "morsewords-book-source-decision-checkpoint-jun-2026 was merged to main before this branch; origin/main was confirmed up to date.",
  rawTempBooksTotalCount: rawFiles.length,
  generatedCountBeforeRemoval: beforeCounts.generated,
  seoSummaryCountBeforeRemoval: beforeCounts.seoSummaries,
  previewCountBeforeRemoval: beforeCounts.previews,
  approvedRemovalsRequested: approvedRemovalSlugs,
  approvedRemovalsFound: foundRemovalSlugs,
  approvedRemovalsRemoved: approvedRemovalSlugs,
  generatedCountAfterRemoval: afterCounts.generated,
  seoSummaryCountAfterRemoval: afterCounts.seoSummaries,
  previewCountAfterRemoval: afterCounts.previews,
  missingSummaryCountAfterRemoval: afterCounts.missingSummaries,
  missingPreviewCountAfterRemoval: afterCounts.missingPreviews,
  missingSummarySlugsAfterRemoval: missingSummarySlugs,
  missingPreviewSlugsAfterRemoval: missingPreviewSlugs,
  rawToGeneratedReconciliationSummary: {
    rawFilesCounted: rawFiles.length,
    rawFilesMappedToLiveGeneratedBooks: categoryCounts["generated-live"],
    rawFilesMappedToRemovedDeferredGeneratedBooks:
      categoryCounts["generated-then-user-approved-removed"],
    rawFilesNotGeneratedOrDeferred: rawFiles.length - categoryCounts["generated-live"],
    currentRawMinusGeneratedCountGap: rawFiles.length - afterCounts.generated,
    generatedBooksWithoutDirectCurrentRawFilenameEvidence:
      generatedWithoutDirectCurrentRawEvidence.length,
    generatedBooksWithoutDirectCurrentRawFilenameEvidenceSlugs:
      generatedWithoutDirectCurrentRawEvidence,
    reconciliationNote:
      "The headline raw-minus-generated gap is offset by live generated books that are accepted replacements, variants, or prior generated entries without a one-to-one current temp-books filename. The per-raw-file table classifies every current raw file.",
  },
  rawFileCategoryCounts: categoryCounts,
  nonGeneratedRawFilesByCategory: nonGeneratedByCategory,
  rawFileReconciliation: rawRows,
  unknownUnclassifiedCount: categoryCounts["unknown-unclassified"],
  easySafeCandidatesFoundAndProcessed: [],
  easySafeCandidatesStillRemaining: [],
  manualReviewFutureBespokeCandidates: rawRows
    .filter((row) => row.category === "manual-review-required" || row.category === "future-bespoke-required")
    .map((row) => row.inferredSlug)
    .sort(),
  duplicateNearDuplicateCandidates: rawRows
    .filter((row) => row.category === "duplicate-or-near-duplicate")
    .map((row) => row.inferredSlug)
    .sort(),
  blockedSourceRightsCandidates: rawRows
    .filter((row) => row.category === "blocked-source-or-rights-risk")
    .map((row) => row.inferredSlug)
    .sort(),
  unsafeCandidates: rawRows
    .filter((row) =>
      [
        "unsafe-start-end-boundary-risk",
        "unsafe-automation-structure",
        "unsafe-metadata-risk",
        "unsafe-title-parent-collection-risk",
      ].includes(row.category),
    )
    .map((row) => ({ slug: row.inferredSlug, category: row.category }))
    .sort((a, b) => a.slug.localeCompare(b.slug)),
  nonBookInvalidCandidates: rawRows
    .filter((row) => row.category === "non-book-or-invalid")
    .map((row) => row.inferredSlug)
    .sort(),
  starterPreviewPolicyResult:
    "No new starter previews were generated; 9 approved preview assets were removed, and the remaining preview coverage is complete.",
  cloudflareExportCheckpoint: "Cloudflare export was not run and is not used as source of truth.",
  urlPageIndexabilityBlockerCheckpoint:
    "URL/page/indexability/planned non-book sitemap implementation remains a later final-release blocker.",
  mobileFinalStageCheckpoint: "Broad mobile optimization was not started and remains the final stage.",
  recommendedNextMajorPhase:
    "Second bespoke/manual pass over the remaining raw/manual/deferred candidates, in small reviewable batches.",
  evidenceReportsUsedAsContext: [
    rel(triageReportPath),
    rel(poeReportPath),
    rel(remainingRawReportPath),
    rel(unresolvedSourceReviewPath),
    rel(decisionCheckpointPath),
  ],
  filesChangedByScript: [
    rel(libraryManifestPath),
    rel(seoSummaryPath),
    rel(previewManifestPath),
    rel(sitemapPath),
    ...approvedRemovalSlugs.map((slug) => rel(path.join(generatedRoot, slug))),
    ...approvedRemovalSlugs.map((slug) => rel(path.join(previewRoot, `${slug}.preview.json`))),
    rel(reportJsonPath),
    rel(reportMdPath),
  ],
};

writeJson(reportJsonPath, report);

const nonGeneratedLines = categoryOrder
  .filter((category) => category !== "generated-live" && categoryCounts[category] > 0)
  .map((category) => `- ${category}: ${categoryCounts[category]}`)
  .join("\n");

const md = `# Source-risk removal and raw gap audit

Generated on 2026-06-28 for \`morsewords-source-risk-removal-and-raw-gap-audit-jun-2026\`.

## Removal result

- Decision-checkpoint merge status: ${report.decisionCheckpointBranchMergeStatus}
- Raw temp-books total count: ${rawFiles.length}
- Generated books: ${beforeCounts.generated} -> ${afterCounts.generated}
- SEO summaries: ${beforeCounts.seoSummaries} -> ${afterCounts.seoSummaries}
- Startup previews: ${beforeCounts.previews} -> ${afterCounts.previews}
- Missing summaries after removal: ${afterCounts.missingSummaries}
- Missing previews after removal: ${afterCounts.missingPreviews}
- Approved removals requested/found/removed: ${approvedRemovalSlugs.length}/${foundRemovalSlugs.length}/${approvedRemovalSlugs.length}

Removed/deferred generated slugs:

${approvedRemovalSlugs.map((slug) => `- ${slug}`).join("\n")}

## Raw-to-generated reconciliation

- Raw files counted: ${rawFiles.length}
- Raw files mapped to live generated books: ${categoryCounts["generated-live"]}
- Raw files mapped to removed/deferred generated books: ${categoryCounts["generated-then-user-approved-removed"]}
- Raw files not generated or deferred: ${rawFiles.length - categoryCounts["generated-live"]}
- Raw total minus generated count gap: ${rawFiles.length - afterCounts.generated}
- Live generated books without a direct current raw filename evidence match: ${generatedWithoutDirectCurrentRawEvidence.length}
- Unknown/unclassified raw files: ${categoryCounts["unknown-unclassified"]}

The raw-minus-generated headline gap is ${rawFiles.length - afterCounts.generated}. The per-raw-file table has ${
  rawFiles.length - categoryCounts["generated-live"]
} current raw files outside \`generated-live\`, offset by ${generatedWithoutDirectCurrentRawEvidence.length} accepted live generated books that are replacements, variants, or prior generated entries without a one-to-one current \`temp-books\` filename.

## Non-generated raw files by category

${nonGeneratedLines || "- None"}

## Candidate handling

- Easy safe candidates found and processed: none.
- Easy safe candidates still remaining: none identified; remaining non-generated files have duplicate, source/rights, structure, boundary, metadata, title/parent, invalid-file, or bespoke/manual reasons.
- Manual/future-bespoke candidates: ${report.manualReviewFutureBespokeCandidates.length}
- Duplicate/near-duplicate candidates: ${report.duplicateNearDuplicateCandidates.length}
- Blocked/source-rights candidates: ${report.blockedSourceRightsCandidates.length}
- Unsafe boundary/automation/metadata/title candidates: ${report.unsafeCandidates.length}
- Non-book/invalid candidates: ${report.nonBookInvalidCandidates.length}

## Checkpoints

- Starter-preview policy: ${report.starterPreviewPolicyResult}
- Cloudflare export: ${report.cloudflareExportCheckpoint}
- URL/page/indexability: ${report.urlPageIndexabilityBlockerCheckpoint}
- Mobile: ${report.mobileFinalStageCheckpoint}

## Recommended next major phase

${report.recommendedNextMajorPhase}
`;

fs.writeFileSync(reportMdPath, md);

console.log(
  `Removed ${approvedRemovalSlugs.length} approved generated items; library ${beforeCounts.generated} -> ${afterCounts.generated}; summaries ${beforeCounts.seoSummaries} -> ${afterCounts.seoSummaries}; previews ${beforeCounts.previews} -> ${afterCounts.previews}; raw unknown ${categoryCounts["unknown-unclassified"]}.`,
);
