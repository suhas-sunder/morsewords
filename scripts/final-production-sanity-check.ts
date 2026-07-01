import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { chromium, type Browser, type Page } from "playwright";

declare const document: any;

type SuitabilityLevel = "low" | "moderate" | "elevated";

type SuitabilityFields = {
  contentSuitability: SuitabilityLevel;
  strictReviewCandidate: boolean;
  contentNote: string;
};

type PublicManifestBook = SuitabilityFields & {
  slug: string;
  title: string;
  author: string[];
  contentVersion: string;
  contentHash: string;
  bookPath: string;
  stats: {
    wordCount: number;
    sectionCount: number;
    includedSectionCount?: number;
  };
};

type PublicManifest = {
  schemaVersion: 1;
  contentVersion: string;
  contentHash: string;
  books: PublicManifestBook[];
};

type UploadManifest = {
  schemaVersion: 1;
  contentVersion: string;
  contentHash: string;
  approvedBookCount: number;
  requiredFiles: string[];
  bookFiles: string[];
  files: string[];
  destinationObjectPaths: string[];
};

type ExportBook = SuitabilityFields & {
  schemaVersion: 1;
  slug: string;
  title: string;
  author: string[];
  contentVersion: string;
  contentHash: string;
  stats: {
    wordCount: number;
    sectionCount: number;
    includedSectionCount?: number;
  };
  manifest: SuitabilityFields & {
    slug?: string;
    title: string;
    author: string[];
    contentVersion?: string;
    contentHash?: string;
    stats: {
      wordCount: number;
      sectionCount: number;
      includedSectionCount?: number;
    };
  };
  sections: Array<{
    sectionId?: string;
    id?: string;
    title?: string | null;
    label?: string;
    displayText?: string;
    morseSourceText?: string;
    content?: string;
    text?: string;
  }>;
};

type SweepReport = {
  executiveResult: string;
  contentSafety: {
    findingsAfterCleanup: Array<{ occurrences: number }>;
    safeReplacementsApplied: {
      occurrenceCount: number;
      bookCount: number;
      generatedBookSlugs: string[];
      generatedPayloadsChanged: number;
      publicPreviewsChanged: number;
      seoSummariesChanged: number;
    };
  };
  ownerReportedCase: {
    slug: string;
    result: string;
    updatedExportSanitized: boolean;
  };
};

type RiskReport = {
  executiveResult: string;
  booksReviewed: number;
  deterministicUnsafeFindingsRemaining: number;
  deterministicSweepChangedBooks: number;
};

type PolicyDecisionReport = {
  executiveResult?: string;
  normalPolicyResult?: string;
  strictClassroomYouthPolicyResult?: string;
  recommendedProductPolicy?: string;
};

type CheckStatus = "pass" | "blocked";

type CheckResult = {
  status: CheckStatus;
  notes: string[];
};

type RouteCheck = {
  route: string;
  status: CheckStatus;
  httpStatus: number | null;
  notes: string[];
};

type PrintRouteCheck = RouteCheck & {
  suitabilityVisible: boolean;
};

type PayloadRequestCheck = RouteCheck & {
  slug: string;
  payloadRequests: string[];
};

type ListingFilterCheck = RouteCheck & {
  suitabilityLabelsVisible: boolean;
  lowerRiskFilterVisible: boolean;
  lowerRiskFilterWorks: boolean;
};

type RemotePayloadCheck = {
  slug: string;
  status: CheckStatus;
  remoteUrl: string;
  contentHashMatchesUpdatedExport: boolean;
  contentHashDiffersFromPriorExport: boolean | null;
  notes: string[];
};

type ProductionChecks = {
  routeChecks: RouteCheck[];
  printRouteChecks: PrintRouteCheck[];
  listingFilterChecks: ListingFilterCheck[];
  payloadRequestChecks: PayloadRequestCheck[];
  contactPolicyChecks: RouteCheck[];
  unsupportedPolicyClaimChecks: RouteCheck[];
  productionHostResult: CheckResult;
  productionRouteResult: CheckResult;
  printRouteResult: CheckResult;
  listingFilterResult: CheckResult;
  payloadRequestResult: CheckResult;
  contactPolicyResult: CheckResult;
  policyStatementVerification: CheckResult;
};

type RemoteAssetChecks = {
  remotePublicManifest: PublicManifest | null;
  remoteUploadManifest: UploadManifest | null;
  manifestResult: CheckResult & {
    publicManifestUrl: string;
    uploadManifestUrl: string;
    publicManifestBooks: number;
    uploadManifestFiles: number;
  };
  payloadResult: CheckResult & {
    expectedBookPayloads: number;
    reachableBookPayloads: number;
  };
  suitabilityResult: CheckResult & {
    counts: Record<SuitabilityLevel, number>;
    strictReviewCandidateCount: number;
  };
  contentSafetyResult: CheckResult & {
    deterministicUnsafeFindingsRemaining: number | null;
    changedBooksChecked: number;
    changedPayloadsMatchingUpdatedExport: number;
    changedPayloadsStillMatchingPriorExport: number | null;
    safeReplacementOccurrences: number | null;
  };
  cthulhuResult: CheckResult & {
    slug: string;
    remoteUrl: string;
  };
  changedBooksResult: CheckResult & {
    changedBooksChecked: number;
    changedPayloadsMatchingUpdatedExport: number;
    changedPayloadsStillMatchingPriorExport: number | null;
  };
};

type SitemapResult = CheckResult & {
  sitemapUrl: string;
  urlCount: number;
  bookUrlCount: number;
  audiobookUrlCount: number;
  printUrlCount: number;
};

type FinalReport = {
  schemaVersion: 1;
  reportName: "final-production-sanity-check";
  generatedAt: string;
  branchName: string;
  headCommitChecked: string;
  mainCommitChecked: string;
  productionHostChecked: string;
  assetHostChecked: string;
  executiveResult: string;
  productionHostResult: CheckResult;
  assetHostResult: CheckResult;
  productionRouteChecks: ProductionChecks;
  remoteAssetPayloadChecks: RemoteAssetChecks;
  sitemapProductionResult: SitemapResult;
  contentSafetySuitabilityProductionResult: CheckResult & {
    suitabilityCounts: Record<SuitabilityLevel, number>;
    strictReviewCandidateCount: number;
    deterministicUnsafeFindingsRemaining: number | null;
  };
  adsenseContactProductionResult: CheckResult;
  policyStatementVerification: CheckResult;
  protectedExportTrackingResult: CheckResult & {
    cloudflareExportTrackedFiles: number;
    cloudflareUpdatedExportTrackedFiles: number;
  };
  remainingBlockers: string[];
  releaseReadiness: string;
  recommendedNextStep: string;
};

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..");
const UPDATED_EXPORT_ROOT = path.join(
  REPO_ROOT,
  "app/client/assets/books/cloudflare-updated-export",
);
const PRIOR_EXPORT_ROOT = path.join(REPO_ROOT, "app/client/assets/books/cloudflare-export");
const REPORT_ROOT = path.join(
  REPO_ROOT,
  "app/client/assets/books/audit-reports/final-production-sanity-check",
);
const REPORT_JSON_PATH = path.join(REPORT_ROOT, "final-production-sanity-check.json");
const REPORT_MD_PATH = path.join(REPORT_ROOT, "final-production-sanity-check.md");
const SWEEP_REPORT_PATH = path.join(
  REPO_ROOT,
  "app/client/assets/books/audit-reports/book-content-safety-and-completeness-sweep/book-content-safety-and-completeness-sweep.json",
);
const RISK_REPORT_PATH = path.join(
  REPO_ROOT,
  "app/client/assets/books/audit-reports/book-content-safety-and-completeness-sweep/book-content-risk-profile-audit.json",
);
const POLICY_REPORT_PATH = path.join(
  REPO_ROOT,
  "app/client/assets/books/audit-reports/book-content-safety-and-completeness-sweep/book-content-suitability-policy-decision.json",
);

const PRODUCTION_BASE_URL = "https://www.morsewords.com";
const ASSET_BASE_URL = "https://assets.morsewords.com";
const SUPPORT_EMAIL = "support@morsewords.com";
const EXPECTED_SITEMAP_URL_COUNT = 1682;
const EXPECTED_BOOK_COUNT = 519;
const EXPECTED_UPLOAD_MANIFEST_FILE_COUNT = 521;
const EXPECTED_CHANGED_SAFETY_SWEEP_BOOKS = 91;
const EXPECTED_STRICT_REVIEW_CANDIDATES = 429;
const EXPECTED_SUITABILITY_COUNTS: Record<SuitabilityLevel, number> = {
  low: 98,
  moderate: 311,
  elevated: 110,
};
const OWNER_REPORTED_SLUG = "the-call-of-cthulhu";
const LOWER_RISK_BOOK_SLUG = "a-catastrophe";
const MODERATE_LOWER_RISK_BOOK_SLUG = "the-threat";
const ELEVATED_BOOK_SLUG = "a-christmas-carol";

const REQUIRED_ROUTES = [
  "/",
  "/morse-code-books",
  "/morse-code-audiobooks",
  "/morse-code-books/walden",
  "/morse-code-audiobooks/walden",
  "/contact",
  "/sources",
  "/privacy",
  "/terms",
  "/cookies",
] as const;

const PRINT_ROUTES = [
  { route: "/morse-code-books/walden/print", slug: "walden" },
  { route: "/morse-code-books/the-call-of-cthulhu/print", slug: "the-call-of-cthulhu" },
  {
    route: "/morse-code-books/the-adventures-of-roderick-random/print",
    slug: "the-adventures-of-roderick-random",
  },
] as const;

const PAYLOAD_ROUTES = [
  { route: "/morse-code-books/walden", slug: "walden" },
  { route: "/morse-code-audiobooks/walden", slug: "walden" },
] as const;

const POLICY_SCAN_ROUTES = [
  ...REQUIRED_ROUTES,
  ...PRINT_ROUTES.map((entry) => entry.route),
] as const;

const UNSUPPORTED_POLICY_CLAIMS = [
  /\ball[- ]audience[- ]safe\b/i,
  /\bsafe for all audiences\b/i,
  /\bsafe for all ages\b/i,
  /\bclassroom[-/ ]safe[- ]by[- ]default\b/i,
  /\byouth[-/ ]safe[- ]by[- ]default\b/i,
  /\bclassroom or youth[-/ ]safe[- ]by[- ]default\b/i,
] as const;

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function runGit(args: string[]) {
  return execFileSync("git", args, { cwd: REPO_ROOT, encoding: "utf8" }).trim();
}

function pass(notes: string[]): CheckResult {
  return { status: "pass", notes };
}

function blocked(notes: string[]): CheckResult {
  return { status: "blocked", notes };
}

function statusFromNotes(notes: string[]): CheckResult {
  return notes.length ? blocked(notes) : pass(["Passed."]);
}

async function fetchText(url: string) {
  const response = await fetch(url, { signal: AbortSignal.timeout(45_000) });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return response.text();
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { signal: AbortSignal.timeout(45_000) });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return (await response.json()) as T;
}

function isSuitabilityLevel(value: unknown): value is SuitabilityLevel {
  return value === "low" || value === "moderate" || value === "elevated";
}

function hasSuitabilityFields(value: Partial<SuitabilityFields>) {
  return (
    isSuitabilityLevel(value.contentSuitability) &&
    typeof value.strictReviewCandidate === "boolean" &&
    typeof value.contentNote === "string" &&
    value.contentNote.trim().length > 0
  );
}

function countSuitability(books: PublicManifestBook[]) {
  const counts: Record<SuitabilityLevel, number> = { low: 0, moderate: 0, elevated: 0 };
  for (const book of books) {
    if (isSuitabilityLevel(book.contentSuitability)) counts[book.contentSuitability] += 1;
  }
  return counts;
}

function suitabilityLabel(value: SuitabilityFields) {
  if (value.contentSuitability === "elevated") return "Elevated suitability review";
  if (value.strictReviewCandidate) return "Review for younger readers";
  if (value.contentSuitability === "moderate") return "Historical content note";
  return "Lower-risk profile";
}

function includesSuitabilityLabel(text: string, expectedLabel: string) {
  return text.toLocaleLowerCase().includes(expectedLabel.toLocaleLowerCase());
}

function contentText(book: ExportBook) {
  return book.sections
    .map(
      (section) =>
        section.morseSourceText ??
        section.displayText ??
        section.content ??
        section.text ??
        "",
    )
    .filter((text) => text.trim().length > 0)
    .join("\n\n");
}

function manifestBookBySlug(manifest: PublicManifest | null, slug: string) {
  return manifest?.books.find((book) => book.slug === slug) ?? null;
}

function trackedFileCount(target: string) {
  const output = runGit(["ls-files", target]);
  return output ? output.split(/\r?\n/).filter(Boolean).length : 0;
}

async function mapLimit<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>,
) {
  const results = new Array<R>(items.length);
  let nextIndex = 0;
  async function runWorker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await worker(items[currentIndex], currentIndex);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => runWorker()),
  );
  return results;
}

function summarizeBlockers(results: CheckResult[]) {
  return [
    ...new Set(
      results
        .filter((result) => result.status === "blocked")
        .flatMap((result) => result.notes),
    ),
  ];
}

function notesFromBlocked(results: CheckResult[]) {
  return results
    .filter((result) => result.status === "blocked")
    .flatMap((result) => result.notes);
}

async function validateRemoteAssets(): Promise<RemoteAssetChecks> {
  const publicManifestUrl = `${ASSET_BASE_URL}/public-manifest.json`;
  const uploadManifestUrl = `${ASSET_BASE_URL}/upload-manifest.json`;
  const emptyCounts: Record<SuitabilityLevel, number> = { low: 0, moderate: 0, elevated: 0 };
  const fatal = (message: string): RemoteAssetChecks => ({
    remotePublicManifest: null,
    remoteUploadManifest: null,
    manifestResult: {
      ...blocked([message]),
      publicManifestUrl,
      uploadManifestUrl,
      publicManifestBooks: 0,
      uploadManifestFiles: 0,
    },
    payloadResult: {
      ...blocked([message]),
      expectedBookPayloads: EXPECTED_BOOK_COUNT,
      reachableBookPayloads: 0,
    },
    suitabilityResult: {
      ...blocked([message]),
      counts: emptyCounts,
      strictReviewCandidateCount: 0,
    },
    contentSafetyResult: {
      ...blocked([message]),
      deterministicUnsafeFindingsRemaining: null,
      changedBooksChecked: 0,
      changedPayloadsMatchingUpdatedExport: 0,
      changedPayloadsStillMatchingPriorExport: null,
      safeReplacementOccurrences: null,
    },
    cthulhuResult: {
      ...blocked([message]),
      slug: OWNER_REPORTED_SLUG,
      remoteUrl: `${ASSET_BASE_URL}/books/${OWNER_REPORTED_SLUG}.json`,
    },
    changedBooksResult: {
      ...blocked([message]),
      changedBooksChecked: 0,
      changedPayloadsMatchingUpdatedExport: 0,
      changedPayloadsStillMatchingPriorExport: null,
    },
  });

  let localPublicManifest: PublicManifest;
  let localUploadManifest: UploadManifest;
  let sweepReport: SweepReport;
  let riskReport: RiskReport;
  try {
    localPublicManifest = readJson<PublicManifest>(
      path.join(UPDATED_EXPORT_ROOT, "public-manifest.json"),
    );
    localUploadManifest = readJson<UploadManifest>(
      path.join(UPDATED_EXPORT_ROOT, "upload-manifest.json"),
    );
    sweepReport = readJson<SweepReport>(SWEEP_REPORT_PATH);
    riskReport = readJson<RiskReport>(RISK_REPORT_PATH);
  } catch (error) {
    return fatal(
      `Unable to read local sanitized export/report evidence: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  let remotePublicManifest: PublicManifest;
  let remoteUploadManifest: UploadManifest;
  try {
    remotePublicManifest = await fetchJson<PublicManifest>(publicManifestUrl);
    remoteUploadManifest = await fetchJson<UploadManifest>(uploadManifestUrl);
  } catch (error) {
    return fatal(
      `Unable to reach remote asset manifests: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  const manifestNotes: string[] = [];
  if (remotePublicManifest.schemaVersion !== 1) {
    manifestNotes.push("Remote public manifest schemaVersion is not 1.");
  }
  if (remoteUploadManifest.schemaVersion !== 1) {
    manifestNotes.push("Remote upload manifest schemaVersion is not 1.");
  }
  if (remotePublicManifest.contentHash !== localPublicManifest.contentHash) {
    manifestNotes.push("Remote public manifest contentHash does not match the sanitized upload.");
  }
  if (remoteUploadManifest.contentHash !== localUploadManifest.contentHash) {
    manifestNotes.push("Remote upload manifest contentHash does not match the sanitized upload.");
  }
  if (remotePublicManifest.books.length !== EXPECTED_BOOK_COUNT) {
    manifestNotes.push(
      `Remote public manifest lists ${remotePublicManifest.books.length} books, expected ${EXPECTED_BOOK_COUNT}.`,
    );
  }
  if ((remoteUploadManifest.files ?? []).length !== EXPECTED_UPLOAD_MANIFEST_FILE_COUNT) {
    manifestNotes.push(
      `Remote upload manifest lists ${(remoteUploadManifest.files ?? []).length} files, expected ${EXPECTED_UPLOAD_MANIFEST_FILE_COUNT}.`,
    );
  }

  const localSlugs = new Set(localPublicManifest.books.map((book) => book.slug));
  const remoteSlugs = new Set(remotePublicManifest.books.map((book) => book.slug));
  const missingExpectedSlugs = [...localSlugs].filter((slug) => !remoteSlugs.has(slug)).sort();
  const extraRemoteSlugs = [...remoteSlugs].filter((slug) => !localSlugs.has(slug)).sort();
  if (missingExpectedSlugs.length) {
    manifestNotes.push(`Remote manifest is missing ${missingExpectedSlugs.length} expected slugs.`);
  }
  if (extraRemoteSlugs.length) {
    manifestNotes.push(`Remote manifest includes ${extraRemoteSlugs.length} unexpected slugs.`);
  }

  const suitabilityCounts = countSuitability(remotePublicManifest.books);
  const strictReviewCandidateCount = remotePublicManifest.books.filter(
    (book) => book.strictReviewCandidate === true,
  ).length;
  const suitabilityNotes: string[] = [];
  const missingSuitability = remotePublicManifest.books
    .filter((book) => !hasSuitabilityFields(book))
    .map((book) => book.slug);
  if (missingSuitability.length) {
    suitabilityNotes.push(`Remote manifest has ${missingSuitability.length} books missing suitability fields.`);
  }
  for (const level of Object.keys(EXPECTED_SUITABILITY_COUNTS) as SuitabilityLevel[]) {
    if (suitabilityCounts[level] !== EXPECTED_SUITABILITY_COUNTS[level]) {
      suitabilityNotes.push(
        `Remote suitability count for ${level} is ${suitabilityCounts[level]}, expected ${EXPECTED_SUITABILITY_COUNTS[level]}.`,
      );
    }
  }
  if (strictReviewCandidateCount !== EXPECTED_STRICT_REVIEW_CANDIDATES) {
    suitabilityNotes.push(
      `Remote strict-review candidate count is ${strictReviewCandidateCount}, expected ${EXPECTED_STRICT_REVIEW_CANDIDATES}.`,
    );
  }

  const priorManifestPath = path.join(PRIOR_EXPORT_ROOT, "public-manifest.json");
  const priorManifest = fs.existsSync(priorManifestPath)
    ? readJson<PublicManifest>(priorManifestPath)
    : null;
  const priorBySlug = new Map((priorManifest?.books ?? []).map((book) => [book.slug, book]));

  const payloadChecks = await mapLimit(localPublicManifest.books, 12, async (localSummary) => {
    const remoteSummary = manifestBookBySlug(remotePublicManifest, localSummary.slug);
    const remoteUrl = `${ASSET_BASE_URL}/${localSummary.bookPath}`;
    const notes: string[] = [];
    if (!remoteSummary) {
      notes.push("remote manifest is missing this slug");
      return {
        slug: localSummary.slug,
        status: "blocked",
        remoteUrl,
        contentHashMatchesUpdatedExport: false,
        contentHashDiffersFromPriorExport: null,
        notes,
      } satisfies RemotePayloadCheck;
    }

    try {
      const remoteBook = await fetchJson<ExportBook>(remoteUrl);
      const localBook = readJson<ExportBook>(path.join(UPDATED_EXPORT_ROOT, localSummary.bookPath));
      const priorSummary = priorBySlug.get(localSummary.slug);

      if (remoteBook.schemaVersion !== 1) notes.push("remote payload schemaVersion is not 1");
      if (remoteBook.slug !== localBook.slug) notes.push("remote payload slug does not match sanitized upload");
      if (remoteBook.contentHash !== localBook.contentHash) {
        notes.push("remote payload contentHash does not match sanitized upload");
      }
      if (remoteBook.contentVersion !== localBook.contentVersion) {
        notes.push("remote payload contentVersion does not match sanitized upload");
      }
      if (remoteSummary.contentHash !== localSummary.contentHash) {
        notes.push("remote manifest summary contentHash does not match sanitized upload");
      }
      if (remoteBook.sections.length !== localBook.sections.length) {
        notes.push("remote payload section length does not match sanitized upload");
      }
      if (remoteBook.stats.sectionCount !== localBook.stats.sectionCount) {
        notes.push("remote payload section count does not match sanitized upload");
      }
      if (remoteBook.stats.wordCount !== localBook.stats.wordCount) {
        notes.push("remote payload word count does not match sanitized upload");
      }
      if (contentText(remoteBook).trim().length < 200) {
        notes.push("remote payload does not contain full readable content");
      }
      if (!hasSuitabilityFields(remoteBook) || !hasSuitabilityFields(remoteBook.manifest)) {
        notes.push("remote payload is missing suitability fields");
      }
      if (
        remoteBook.contentSuitability !== localSummary.contentSuitability ||
        remoteBook.strictReviewCandidate !== localSummary.strictReviewCandidate ||
        remoteBook.contentNote !== localSummary.contentNote ||
        remoteBook.manifest.contentSuitability !== localSummary.contentSuitability ||
        remoteBook.manifest.strictReviewCandidate !== localSummary.strictReviewCandidate ||
        remoteBook.manifest.contentNote !== localSummary.contentNote
      ) {
        notes.push("remote payload suitability metadata does not match manifest");
      }

      return {
        slug: localSummary.slug,
        status: notes.length ? "blocked" : "pass",
        remoteUrl,
        contentHashMatchesUpdatedExport: remoteBook.contentHash === localBook.contentHash,
        contentHashDiffersFromPriorExport: priorSummary
          ? remoteBook.contentHash !== priorSummary.contentHash
          : null,
        notes,
      } satisfies RemotePayloadCheck;
    } catch (error) {
      notes.push(error instanceof Error ? error.message : String(error));
      return {
        slug: localSummary.slug,
        status: "blocked",
        remoteUrl,
        contentHashMatchesUpdatedExport: false,
        contentHashDiffersFromPriorExport: null,
        notes,
      } satisfies RemotePayloadCheck;
    }
  });

  const payloadNotes = payloadChecks
    .filter((check) => check.status === "blocked")
    .map((check) => `${check.slug}: ${check.notes.join("; ")}`);
  const reachableBookPayloads = payloadChecks.filter(
    (check) => !check.notes.some((note) => /returned HTTP|fetch failed|ENOTFOUND|ETIMEDOUT/i.test(note)),
  ).length;

  const changedSlugs = sweepReport.contentSafety.safeReplacementsApplied.generatedBookSlugs;
  const changedChecks = payloadChecks.filter((check) => changedSlugs.includes(check.slug));
  const changedPayloadNotes: string[] = [];
  for (const check of changedChecks) {
    if (!check.contentHashMatchesUpdatedExport) {
      changedPayloadNotes.push(`${check.slug}: remote changed payload does not match sanitized upload`);
    }
    if (check.contentHashDiffersFromPriorExport === false) {
      changedPayloadNotes.push(`${check.slug}: remote changed payload still matches the prior export hash`);
    }
  }
  if (changedSlugs.length !== EXPECTED_CHANGED_SAFETY_SWEEP_BOOKS) {
    changedPayloadNotes.push(
      `Safety sweep changed ${changedSlugs.length} books, expected ${EXPECTED_CHANGED_SAFETY_SWEEP_BOOKS}.`,
    );
  }

  const afterCleanupFindings = sweepReport.contentSafety.findingsAfterCleanup.reduce(
    (total, finding) => total + finding.occurrences,
    0,
  );
  const contentSafetyNotes: string[] = [];
  if (afterCleanupFindings !== 0) {
    contentSafetyNotes.push(`Local deterministic cleanup report has ${afterCleanupFindings} remaining findings.`);
  }
  if (riskReport.deterministicUnsafeFindingsRemaining !== 0) {
    contentSafetyNotes.push(
      `Content risk profile reports ${riskReport.deterministicUnsafeFindingsRemaining} deterministic unsafe findings remaining.`,
    );
  }
  if (changedPayloadNotes.length) contentSafetyNotes.push(...changedPayloadNotes.slice(0, 25));

  const staleChangedPayloadsRemaining = priorManifest
    ? changedChecks.filter((check) => check.contentHashDiffersFromPriorExport === false).length
    : null;
  const changedPayloadsMatchingUpdatedExport = changedChecks.filter(
    (check) => check.contentHashMatchesUpdatedExport,
  ).length;

  const cthulhuCheck = payloadChecks.find((check) => check.slug === OWNER_REPORTED_SLUG);
  const cthulhuNotes: string[] = [];
  if (!cthulhuCheck) {
    cthulhuNotes.push("The Call of Cthulhu is missing from remote payload checks.");
  } else if (!cthulhuCheck.contentHashMatchesUpdatedExport) {
    cthulhuNotes.push("The Call of Cthulhu remote payload does not match the sanitized upload.");
  }
  if (!sweepReport.ownerReportedCase.updatedExportSanitized) {
    cthulhuNotes.push("The safety sweep did not mark The Call of Cthulhu updated export sanitized.");
  }

  return {
    remotePublicManifest,
    remoteUploadManifest,
    manifestResult: {
      ...(manifestNotes.length
        ? blocked(manifestNotes)
        : pass([
            "Remote public-manifest.json and upload-manifest.json are reachable.",
            "Remote manifests match the sanitized upload content hash.",
          ])),
      publicManifestUrl,
      uploadManifestUrl,
      publicManifestBooks: remotePublicManifest.books.length,
      uploadManifestFiles: (remoteUploadManifest.files ?? []).length,
    },
    payloadResult: {
      ...(payloadNotes.length
        ? blocked(payloadNotes.slice(0, 25))
        : pass(["All 519 remote book payloads are reachable and match sanitized upload metadata."])),
      expectedBookPayloads: EXPECTED_BOOK_COUNT,
      reachableBookPayloads,
    },
    suitabilityResult: {
      ...(suitabilityNotes.length
        ? blocked(suitabilityNotes)
        : pass([
            "Remote manifests and payloads include suitability metadata.",
            "Suitability counts match expected low/moderate/elevated totals.",
            "Strict-review candidate metadata matches expected count.",
          ])),
      counts: suitabilityCounts,
      strictReviewCandidateCount,
    },
    contentSafetyResult: {
      ...(contentSafetyNotes.length
        ? blocked(contentSafetyNotes)
        : pass([
            "Deterministic unsafe findings remaining are 0.",
            "Safety-sweep changed payloads match the sanitized updated export.",
          ])),
      deterministicUnsafeFindingsRemaining: riskReport.deterministicUnsafeFindingsRemaining,
      changedBooksChecked: changedChecks.length,
      changedPayloadsMatchingUpdatedExport,
      changedPayloadsStillMatchingPriorExport: staleChangedPayloadsRemaining,
      safeReplacementOccurrences: sweepReport.contentSafety.safeReplacementsApplied.occurrenceCount,
    },
    cthulhuResult: {
      ...(cthulhuNotes.length
        ? blocked(cthulhuNotes)
        : pass([
            "The Call of Cthulhu remote payload matches the sanitized upload.",
            sweepReport.ownerReportedCase.result,
          ])),
      slug: OWNER_REPORTED_SLUG,
      remoteUrl: `${ASSET_BASE_URL}/books/${OWNER_REPORTED_SLUG}.json`,
    },
    changedBooksResult: {
      ...(changedPayloadNotes.length
        ? blocked(changedPayloadNotes.slice(0, 25))
        : pass(["91/91 changed safety-sweep books match the sanitized updated export."])),
      changedBooksChecked: changedChecks.length,
      changedPayloadsMatchingUpdatedExport,
      changedPayloadsStillMatchingPriorExport: staleChangedPayloadsRemaining,
    },
  };
}

async function pageText(page: Page) {
  return (await page.locator("body").innerText({ timeout: 30_000 })).replace(/\s+/g, " ");
}

async function gotoProduction(page: Page, route: string) {
  const response = await page.goto(`${PRODUCTION_BASE_URL}${route}`, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  await page.waitForSelector("main, body", { timeout: 30_000 });
  return response?.status() ?? null;
}

async function waitForBookReady(page: Page) {
  await page.waitForSelector("[data-mw-morse-book-page]", { timeout: 30_000 });
  await page.waitForFunction(
    () =>
      document
        .querySelector("[data-mw-morse-book-page]")
        ?.getAttribute("data-mw-morse-book-available") === "true",
    undefined,
    { timeout: 30_000 },
  );
  await page.waitForFunction(
    () =>
      document
        .querySelector("[data-mw-morse-book-page]")
        ?.getAttribute("data-mw-morse-book-full-loading") === "false",
    undefined,
    { timeout: 90_000 },
  );
  await page.waitForFunction(
    () =>
      document
        .querySelector("[data-mw-morse-book-page]")
        ?.getAttribute("data-mw-morse-book-preview-state") === "ready",
    undefined,
    { timeout: 90_000 },
  );
}

async function assertNoUnavailableText(page: Page, route: string) {
  const text = await pageText(page);
  if (/Book text unavailable|This Morse book is not available right now/i.test(text)) {
    throw new Error(`${route} showed unavailable-book text.`);
  }
}

async function assertNoUnsupportedPolicyClaims(page: Page, route: string) {
  const text = await pageText(page);
  for (const pattern of UNSUPPORTED_POLICY_CLAIMS) {
    if (pattern.test(text)) {
      throw new Error(`${route} matched unsupported all-audience/classroom-safe policy claim pattern.`);
    }
  }
}

async function validateListingFilter(
  page: Page,
  route: "/morse-code-books" | "/morse-code-audiobooks",
) {
  const isBookListing = route === "/morse-code-books";
  const browserTestId = isBookListing ? "morse-books-browser" : "morse-audiobooks-browser";
  const cardTestId = isBookListing ? "morse-book-card" : "morse-audiobook-card";
  const cardSlugAttribute = isBookListing
    ? "data-mw-morse-book-card-slug"
    : "data-mw-morse-audiobook-card-slug";
  const suitabilityTestId = isBookListing
    ? "morse-book-card-content-suitability"
    : "morse-audiobook-card-content-suitability";
  const filterTestId = isBookListing
    ? "morse-books-lower-risk-filter"
    : "morse-audiobooks-lower-risk-filter";
  const cardBySlug = (slug: string) =>
    page.locator(`[data-testid="${cardTestId}"][${cardSlugAttribute}="${slug}"]`);
  const search = page.getByTestId(browserTestId).locator('input[type="search"]');

  const httpStatus = await gotoProduction(page, route);
  const notes: string[] = [];
  let suitabilityLabelsVisible = false;
  let lowerRiskFilterVisible = false;
  let lowerRiskFilterWorks = false;

  try {
    if (httpStatus !== 200) notes.push(`${route} returned HTTP ${httpStatus ?? "no response"}.`);
    await page.getByTestId(filterTestId).waitFor({ state: "visible", timeout: 30_000 });
    lowerRiskFilterVisible = true;
    suitabilityLabelsVisible = (await page.getByTestId(suitabilityTestId).count()) > 0;
    if (!suitabilityLabelsVisible) {
      notes.push(`${route} did not render suitability labels on listing cards.`);
    }

    await search.fill("A Christmas Carol");
    await page.getByTestId(filterTestId).check();
    if ((await cardBySlug(ELEVATED_BOOK_SLUG).count()) !== 0) {
      notes.push(`${route} lower-risk filter did not hide an elevated book.`);
    }

    await search.fill("A Catastrophe");
    await cardBySlug(LOWER_RISK_BOOK_SLUG).waitFor({ state: "visible", timeout: 30_000 });

    await search.fill("The Threat");
    await cardBySlug(MODERATE_LOWER_RISK_BOOK_SLUG).waitFor({ state: "visible", timeout: 30_000 });
    lowerRiskFilterWorks = true;
  } catch (error) {
    notes.push(error instanceof Error ? error.message : String(error));
  }

  return {
    route,
    status: notes.length ? "blocked" : "pass",
    httpStatus,
    notes,
    suitabilityLabelsVisible,
    lowerRiskFilterVisible,
    lowerRiskFilterWorks,
  } satisfies ListingFilterCheck;
}

async function validateProductionPages(manifest: PublicManifest | null): Promise<ProductionChecks> {
  const browser: Browser = await chromium.launch();
  const routeChecks: RouteCheck[] = [];
  const printRouteChecks: PrintRouteCheck[] = [];
  const listingFilterChecks: ListingFilterCheck[] = [];
  const payloadRequestChecks: PayloadRequestCheck[] = [];
  const contactPolicyChecks: RouteCheck[] = [];
  const unsupportedPolicyClaimChecks: RouteCheck[] = [];

  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    try {
      for (const route of REQUIRED_ROUTES) {
        const page = await context.newPage();
        const notes: string[] = [];
        let httpStatus: number | null = null;
        try {
          httpStatus = await gotoProduction(page, route);
          if (httpStatus !== 200) notes.push(`${route} returned HTTP ${httpStatus ?? "no response"}.`);
          await assertNoUnavailableText(page, route);
        } catch (error) {
          notes.push(error instanceof Error ? error.message : String(error));
        } finally {
          routeChecks.push({ route, status: notes.length ? "blocked" : "pass", httpStatus, notes });
          await page.close();
        }
      }

      for (const route of ["/morse-code-books", "/morse-code-audiobooks"] as const) {
        const page = await context.newPage();
        try {
          listingFilterChecks.push(await validateListingFilter(page, route));
        } finally {
          await page.close();
        }
      }

      for (const entry of PRINT_ROUTES) {
        const page = await context.newPage();
        const notes: string[] = [];
        let httpStatus: number | null = null;
        let suitabilityVisible = false;
        try {
          httpStatus = await gotoProduction(page, entry.route);
          if (httpStatus !== 200) {
            notes.push(`${entry.route} returned HTTP ${httpStatus ?? "no response"}.`);
          } else {
            await assertNoUnavailableText(page, entry.route);
            const expected = manifestBookBySlug(manifest, entry.slug);
            if (!expected) {
              notes.push(`${entry.slug} is missing from the remote manifest.`);
            } else {
              const text = await page
                .getByTestId("printable-book-content-suitability")
                .innerText({ timeout: 30_000 });
              suitabilityVisible =
                includesSuitabilityLabel(text, suitabilityLabel(expected)) &&
                text.includes(expected.contentNote);
              if (!suitabilityVisible) {
                notes.push(`${entry.route} did not show the expected suitability note.`);
              }
            }
          }
        } catch (error) {
          notes.push(error instanceof Error ? error.message : String(error));
        } finally {
          printRouteChecks.push({
            route: entry.route,
            status: notes.length ? "blocked" : "pass",
            httpStatus,
            notes,
            suitabilityVisible,
          });
          await page.close();
        }
      }

      for (const entry of PAYLOAD_ROUTES) {
        const payloadContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
        const page = await payloadContext.newPage();
        const payloadRequests: string[] = [];
        const notes: string[] = [];
        let httpStatus: number | null = null;
        page.on("request", (request) => {
          const url = request.url();
          if (url === `${ASSET_BASE_URL}/books/${entry.slug}.json`) payloadRequests.push(url);
        });
        try {
          httpStatus = await gotoProduction(page, entry.route);
          if (httpStatus !== 200) notes.push(`${entry.route} returned HTTP ${httpStatus ?? "no response"}.`);
          await waitForBookReady(page);
          await assertNoUnavailableText(page, entry.route);
          if (payloadRequests.length === 0) {
            notes.push(`${entry.route} did not request the full payload from ${ASSET_BASE_URL}.`);
          }
        } catch (error) {
          notes.push(error instanceof Error ? error.message : String(error));
        } finally {
          payloadRequestChecks.push({
            route: entry.route,
            status: notes.length ? "blocked" : "pass",
            httpStatus,
            notes,
            slug: entry.slug,
            payloadRequests,
          });
          await page.close();
          await payloadContext.close();
        }
      }

      for (const route of ["/contact", "/sources"] as const) {
        const page = await context.newPage();
        const notes: string[] = [];
        let httpStatus: number | null = null;
        try {
          httpStatus = await gotoProduction(page, route);
          if (httpStatus !== 200) notes.push(`${route} returned HTTP ${httpStatus ?? "no response"}.`);
          const text = await pageText(page);
          if (!text.includes(SUPPORT_EMAIL)) {
            notes.push(`${route} does not show ${SUPPORT_EMAIL}.`);
          }
          if (route === "/contact") {
            const mailtoCount = await page.locator(`a[href="mailto:${SUPPORT_EMAIL}"]`).count();
            if (mailtoCount === 0) notes.push("/contact does not expose the support mailto link.");
          }
          if (route === "/sources") {
            if (!/correction/i.test(text)) notes.push("/sources does not expose correction language.");
            if (!/takedown/i.test(text)) notes.push("/sources does not expose takedown language.");
            if (!/report|concern|content concern/i.test(text)) {
              notes.push("/sources does not expose report/concern language.");
            }
          }
        } catch (error) {
          notes.push(error instanceof Error ? error.message : String(error));
        } finally {
          contactPolicyChecks.push({
            route,
            status: notes.length ? "blocked" : "pass",
            httpStatus,
            notes,
          });
          await page.close();
        }
      }

      for (const route of POLICY_SCAN_ROUTES) {
        const page = await context.newPage();
        const notes: string[] = [];
        let httpStatus: number | null = null;
        try {
          httpStatus = await gotoProduction(page, route);
          if (httpStatus !== 200) notes.push(`${route} returned HTTP ${httpStatus ?? "no response"}.`);
          await assertNoUnsupportedPolicyClaims(page, route);
        } catch (error) {
          notes.push(error instanceof Error ? error.message : String(error));
        } finally {
          unsupportedPolicyClaimChecks.push({
            route,
            status: notes.length ? "blocked" : "pass",
            httpStatus,
            notes,
          });
          await page.close();
        }
      }
    } finally {
      await context.close();
    }
  } finally {
    await browser.close();
  }

  const routeNotes = routeChecks.flatMap((check) => check.notes);
  const printNotes = printRouteChecks.flatMap((check) => check.notes);
  const listingNotes = listingFilterChecks.flatMap((check) => check.notes);
  const payloadNotes = payloadRequestChecks.flatMap((check) => check.notes);
  const contactNotes = contactPolicyChecks.flatMap((check) => check.notes);
  const policyNotes = unsupportedPolicyClaimChecks.flatMap((check) => check.notes);
  const productionHostNotes = [
    ...new Set([
      ...routeNotes,
      ...printNotes,
      ...listingNotes,
      ...payloadNotes,
      ...contactNotes,
      ...policyNotes,
    ]),
  ];

  return {
    routeChecks,
    printRouteChecks,
    listingFilterChecks,
    payloadRequestChecks,
    contactPolicyChecks,
    unsupportedPolicyClaimChecks,
    productionHostResult: productionHostNotes.length
      ? blocked(productionHostNotes.slice(0, 25))
      : pass(["Production host responded to required route, listing, contact, policy, and print checks."]),
    productionRouteResult: routeNotes.length
      ? blocked(routeNotes)
      : pass(["Home, book hubs, Walden book/audiobook, contact, sources, privacy, terms, and cookies load."]),
    printRouteResult: printNotes.length
      ? blocked(printNotes)
      : pass(["Walden, The Call of Cthulhu, and Roderick Random print routes return 200 and show suitability notes."]),
    listingFilterResult: listingNotes.length
      ? blocked(listingNotes)
      : pass(["Book and audiobook listings show suitability labels and the lower-risk filter works."]),
    payloadRequestResult: payloadNotes.length
      ? blocked(payloadNotes)
      : pass(["Sampled book and audiobook pages request full payloads from https://assets.morsewords.com."]),
    contactPolicyResult: contactNotes.length
      ? blocked(contactNotes)
      : pass(["/contact and /sources expose support@morsewords.com plus correction/takedown/report paths."]),
    policyStatementVerification: policyNotes.length
      ? blocked(policyNotes)
      : pass([
          "No sampled production page claimed all-audience safety.",
          "No sampled production page claimed classroom/youth-safe-by-default status.",
        ]),
  };
}

function parseLocs(xml: string) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

async function validateSitemap(): Promise<SitemapResult> {
  const sitemapUrl = `${PRODUCTION_BASE_URL}/sitemap.xml`;
  try {
    const sitemap = await fetchText(sitemapUrl);
    const locs = parseLocs(sitemap);
    const paths = locs.map((loc) => new URL(loc).pathname);
    const bookUrlCount = paths.filter((entry) => /^\/morse-code-books\/[^/]+$/.test(entry)).length;
    const audiobookUrlCount = paths.filter((entry) => /^\/morse-code-audiobooks\/[^/]+$/.test(entry)).length;
    const printUrlCount = paths.filter((entry) => /^\/morse-code-books\/[^/]+\/print$/.test(entry)).length;
    const notes: string[] = [];
    if (locs.length !== EXPECTED_SITEMAP_URL_COUNT) {
      notes.push(`Production sitemap has ${locs.length} URLs, expected ${EXPECTED_SITEMAP_URL_COUNT}.`);
    }
    if (bookUrlCount !== EXPECTED_BOOK_COUNT) {
      notes.push(`Production sitemap has ${bookUrlCount} book URLs, expected ${EXPECTED_BOOK_COUNT}.`);
    }
    if (audiobookUrlCount !== EXPECTED_BOOK_COUNT) {
      notes.push(`Production sitemap has ${audiobookUrlCount} audiobook URLs, expected ${EXPECTED_BOOK_COUNT}.`);
    }
    if (printUrlCount !== EXPECTED_BOOK_COUNT) {
      notes.push(`Production sitemap has ${printUrlCount} print URLs, expected ${EXPECTED_BOOK_COUNT}.`);
    }
    return {
      ...(notes.length ? blocked(notes) : pass(["Production sitemap is reachable and has the expected URL count."])),
      sitemapUrl,
      urlCount: locs.length,
      bookUrlCount,
      audiobookUrlCount,
      printUrlCount,
    };
  } catch (error) {
    return {
      ...blocked([`Unable to fetch production sitemap: ${error instanceof Error ? error.message : String(error)}`]),
      sitemapUrl,
      urlCount: 0,
      bookUrlCount: 0,
      audiobookUrlCount: 0,
      printUrlCount: 0,
    };
  }
}

function validateProtectedExportTracking() {
  const cloudflareExportTrackedFiles = trackedFileCount("app/client/assets/books/cloudflare-export");
  const cloudflareUpdatedExportTrackedFiles = trackedFileCount("app/client/assets/books/cloudflare-updated-export");
  const notes: string[] = [];
  if (cloudflareExportTrackedFiles !== 0) {
    notes.push(`cloudflare-export has ${cloudflareExportTrackedFiles} tracked files.`);
  }
  if (cloudflareUpdatedExportTrackedFiles !== 0) {
    notes.push(`cloudflare-updated-export has ${cloudflareUpdatedExportTrackedFiles} tracked files.`);
  }
  return {
    ...(notes.length
      ? blocked(notes)
      : pass(["Cloudflare export folders remain ignored/untracked by git."])),
    cloudflareExportTrackedFiles,
    cloudflareUpdatedExportTrackedFiles,
  };
}

function buildMarkdown(report: FinalReport) {
  const section = (title: string, lines: string[]) => [`## ${title}`, "", ...lines, ""];
  const formatCheck = (check: CheckResult) => [
    `- Status: ${check.status}`,
    ...check.notes.map((note) => `- ${note}`),
  ];
  const routeLine = (check: RouteCheck) =>
    `- ${check.route}: ${check.status} (HTTP ${check.httpStatus ?? "n/a"})${check.notes.length ? ` - ${check.notes.join("; ")}` : ""}`;

  return [
    "# Final Production Sanity Check",
    "",
    ...section("1. Executive result", [report.executiveResult]),
    ...section("2. Main commit checked", [
      `- Main commit: ${report.mainCommitChecked}`,
      `- Branch HEAD checked: ${report.headCommitChecked}`,
    ]),
    ...section("3. Production host checked", [
      `- ${report.productionHostChecked}`,
      ...formatCheck(report.productionHostResult),
    ]),
    ...section("4. Asset host checked", [
      `- ${report.assetHostChecked}`,
      ...formatCheck(report.assetHostResult),
    ]),
    ...section("5. Production route checks", [
      ...formatCheck(report.productionRouteChecks.productionRouteResult),
      ...report.productionRouteChecks.routeChecks.map(routeLine),
    ]),
    ...section("6. Print route checks", [
      ...formatCheck(report.productionRouteChecks.printRouteResult),
      ...report.productionRouteChecks.printRouteChecks.map(
        (check) =>
          `- ${check.route}: ${check.status} (HTTP ${check.httpStatus ?? "n/a"}; suitability visible: ${check.suitabilityVisible ? "yes" : "no"})${check.notes.length ? ` - ${check.notes.join("; ")}` : ""}`,
      ),
    ]),
    ...section("7. Remote asset payload checks", [
      ...formatCheck(report.remoteAssetPayloadChecks.manifestResult),
      `- Public manifest books: ${report.remoteAssetPayloadChecks.manifestResult.publicManifestBooks}`,
      `- Upload manifest files: ${report.remoteAssetPayloadChecks.manifestResult.uploadManifestFiles}`,
      ...formatCheck(report.remoteAssetPayloadChecks.payloadResult),
      `- Reachable book payloads: ${report.remoteAssetPayloadChecks.payloadResult.reachableBookPayloads}/${report.remoteAssetPayloadChecks.payloadResult.expectedBookPayloads}`,
      ...formatCheck(report.remoteAssetPayloadChecks.cthulhuResult),
      ...formatCheck(report.remoteAssetPayloadChecks.changedBooksResult),
      `- Changed books matching sanitized export: ${report.remoteAssetPayloadChecks.changedBooksResult.changedPayloadsMatchingUpdatedExport}/${report.remoteAssetPayloadChecks.changedBooksResult.changedBooksChecked}`,
    ]),
    ...section("8. Content-safety/suitability production result", [
      ...formatCheck(report.contentSafetySuitabilityProductionResult),
      `- Suitability counts: low=${report.contentSafetySuitabilityProductionResult.suitabilityCounts.low}, moderate=${report.contentSafetySuitabilityProductionResult.suitabilityCounts.moderate}, elevated=${report.contentSafetySuitabilityProductionResult.suitabilityCounts.elevated}`,
      `- Strict-review candidates: ${report.contentSafetySuitabilityProductionResult.strictReviewCandidateCount}`,
      `- Deterministic unsafe findings remaining: ${report.contentSafetySuitabilityProductionResult.deterministicUnsafeFindingsRemaining ?? "n/a"}`,
    ]),
    ...section("9. AdSense/contact production result", [
      ...formatCheck(report.adsenseContactProductionResult),
      ...report.productionRouteChecks.contactPolicyChecks.map(routeLine),
    ]),
    ...section("10. Sitemap production result", [
      ...formatCheck(report.sitemapProductionResult),
      `- Sitemap URL: ${report.sitemapProductionResult.sitemapUrl}`,
      `- Total URLs: ${report.sitemapProductionResult.urlCount}`,
      `- Book/audiobook/print URLs: ${report.sitemapProductionResult.bookUrlCount}/${report.sitemapProductionResult.audiobookUrlCount}/${report.sitemapProductionResult.printUrlCount}`,
    ]),
    ...section("11. Policy statement verification", formatCheck(report.policyStatementVerification)),
    ...section(
      "12. Remaining blockers",
      report.remainingBlockers.length
        ? report.remainingBlockers.map((blocker) => `- ${blocker}`)
        : ["- None."],
    ),
    ...section("13. Release readiness", [
      report.releaseReadiness,
      `Recommended next step: ${report.recommendedNextStep}`,
    ]),
  ].join("\n");
}

function writeReport(report: FinalReport) {
  fs.mkdirSync(REPORT_ROOT, { recursive: true });
  fs.writeFileSync(REPORT_JSON_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  fs.writeFileSync(REPORT_MD_PATH, buildMarkdown(report), "utf8");
}

async function main() {
  const branchName = runGit(["branch", "--show-current"]);
  const headCommitChecked = runGit(["rev-parse", "HEAD"]);
  const mainCommitChecked = runGit(["rev-parse", "main"]);
  const remoteAssets = await validateRemoteAssets();
  const productionPages = await validateProductionPages(remoteAssets.remotePublicManifest);
  const sitemap = await validateSitemap();
  const protectedExportTracking = validateProtectedExportTracking();
  const policyDecision = fs.existsSync(POLICY_REPORT_PATH)
    ? readJson<PolicyDecisionReport>(POLICY_REPORT_PATH)
    : null;

  const contentSafetySuitabilityProductionResult = {
    ...(remoteAssets.suitabilityResult.status === "blocked" ||
    remoteAssets.contentSafetyResult.status === "blocked" ||
    productionPages.listingFilterResult.status === "blocked" ||
    productionPages.printRouteResult.status === "blocked"
      ? blocked(
          notesFromBlocked([
            remoteAssets.suitabilityResult,
            remoteAssets.contentSafetyResult,
            productionPages.listingFilterResult,
            productionPages.printRouteResult,
          ]),
        )
      : pass([
          "Remote suitability metadata and production UI suitability surfaces passed.",
          "Book content suitability policy remains visible where book content is involved.",
        ])),
    suitabilityCounts: remoteAssets.suitabilityResult.counts,
    strictReviewCandidateCount: remoteAssets.suitabilityResult.strictReviewCandidateCount,
    deterministicUnsafeFindingsRemaining:
      remoteAssets.contentSafetyResult.deterministicUnsafeFindingsRemaining,
  };

  const adsenseContactProductionResult = productionPages.contactPolicyResult;
  const assetHostResult =
    remoteAssets.manifestResult.status === "blocked" ||
    remoteAssets.payloadResult.status === "blocked"
      ? blocked(notesFromBlocked([remoteAssets.manifestResult, remoteAssets.payloadResult]))
      : pass(["Asset host manifests and payloads are reachable and match expected release evidence."]);

  const policyNotes = [...productionPages.policyStatementVerification.notes];
  if (productionPages.policyStatementVerification.status === "pass") {
    if (policyDecision?.recommendedProductPolicy) {
      policyNotes.push(policyDecision.recommendedProductPolicy);
    }
    policyNotes.push("All-audience safety is not claimed by this validation.");
    policyNotes.push("Classroom/youth-safe-by-default status is not claimed by this validation.");
  }
  const policyStatementVerification = {
    status: productionPages.policyStatementVerification.status,
    notes: policyNotes,
  } satisfies CheckResult;

  const remainingBlockers = summarizeBlockers([
    productionPages.productionHostResult,
    assetHostResult,
    productionPages.productionRouteResult,
    productionPages.printRouteResult,
    productionPages.listingFilterResult,
    productionPages.payloadRequestResult,
    adsenseContactProductionResult,
    sitemap,
    remoteAssets.manifestResult,
    remoteAssets.payloadResult,
    remoteAssets.suitabilityResult,
    remoteAssets.contentSafetyResult,
    remoteAssets.cthulhuResult,
    remoteAssets.changedBooksResult,
    contentSafetySuitabilityProductionResult,
    policyStatementVerification,
    protectedExportTracking,
  ]);
  const remoteAssetPayloadChecksForReport: RemoteAssetChecks = {
    ...remoteAssets,
    remotePublicManifest: null,
    remoteUploadManifest: null,
  };

  const report: FinalReport = {
    schemaVersion: 1,
    reportName: "final-production-sanity-check",
    generatedAt: new Date().toISOString(),
    branchName,
    headCommitChecked,
    mainCommitChecked,
    productionHostChecked: PRODUCTION_BASE_URL,
    assetHostChecked: ASSET_BASE_URL,
    executiveResult: remainingBlockers.length
      ? `Final production sanity check blocked because ${remainingBlockers[0]}`
      : "Final production sanity check passed",
    productionHostResult: productionPages.productionHostResult,
    assetHostResult,
    productionRouteChecks: productionPages,
    remoteAssetPayloadChecks: remoteAssetPayloadChecksForReport,
    sitemapProductionResult: sitemap,
    contentSafetySuitabilityProductionResult,
    adsenseContactProductionResult,
    policyStatementVerification,
    protectedExportTrackingResult: protectedExportTracking,
    remainingBlockers,
    releaseReadiness: remainingBlockers.length
      ? "Release is not complete until the blockers above are cleared on production."
      : "Production sanity passed. Release is ready for final merge.",
    recommendedNextStep: remainingBlockers.length
      ? "Resolve or wait for the exact production blockers, then rerun site:final-production-sanity-check."
      : "Merge final production sanity branch to main. Release cycle complete.",
  };

  writeReport(report);

  console.log(report.executiveResult);
  console.log(`Branch: ${branchName}`);
  console.log(`Main commit checked: ${mainCommitChecked}`);
  console.log(`Production host checked: ${PRODUCTION_BASE_URL}`);
  console.log(`Asset host checked: ${ASSET_BASE_URL}`);
  console.log(`Sitemap URLs: ${sitemap.urlCount}`);
  console.log(`Remote payloads reachable: ${remoteAssets.payloadResult.reachableBookPayloads}/${EXPECTED_BOOK_COUNT}`);
  console.log(
    `Suitability counts: low=${remoteAssets.suitabilityResult.counts.low}, moderate=${remoteAssets.suitabilityResult.counts.moderate}, elevated=${remoteAssets.suitabilityResult.counts.elevated}`,
  );
  console.log(
    `Changed safety-sweep books: ${remoteAssets.changedBooksResult.changedPayloadsMatchingUpdatedExport}/${remoteAssets.changedBooksResult.changedBooksChecked}`,
  );
  console.log(`Blockers: ${remainingBlockers.length}`);
  console.log(`Report: ${path.relative(REPO_ROOT, REPORT_JSON_PATH)}`);

  if (remainingBlockers.length) {
    for (const blocker of remainingBlockers) console.error(`- ${blocker}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
