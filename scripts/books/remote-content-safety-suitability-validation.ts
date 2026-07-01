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
  stats: {
    wordCount: number;
    sectionCount: number;
    includedSectionCount?: number;
  };
  contentVersion: string;
  contentHash: string;
  bookPath: string;
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
  stats: {
    wordCount: number;
    sectionCount: number;
    includedSectionCount?: number;
  };
  contentVersion: string;
  contentHash: string;
  manifest: SuitabilityFields & {
    title: string;
    author: string[];
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
    generatedPayloadSanitized: boolean;
    startupPreviewSanitized: boolean;
    updatedExportSanitized: boolean;
  };
  updatedExport: {
    fileCount: number;
    bookPayloadCount: number;
    manifestFileCount: number;
    trackedFileCount: number;
    replacementType: string;
  };
};

type RiskReport = {
  executiveResult: string;
  booksReviewed: number;
  deterministicUnsafeFindingsRemaining: number;
  booksRequiringOwnerReview: unknown[];
  booksRecommendedForDeferralOrRemoval: unknown[];
  booksWithAgeAudienceConcernsAfterCleanup: unknown[];
};

type PolicyDecisionReport = {
  executiveResult: string;
  normalPolicyResult: string;
  strictClassroomYouthPolicyResult: string;
  recommendedProductPolicy: string;
};

type CheckResult = {
  status: "pass" | "blocked";
  notes: string[];
};

type PayloadCheck = {
  slug: string;
  status: "pass" | "blocked";
  remoteUrl: string;
  contentHashMatchesUpdatedExport: boolean;
  contentHashDiffersFromPriorExport: boolean | null;
  notes: string[];
};

type PageCheck = {
  route: string;
  status: "pass" | "blocked";
  payloadRequests: string[];
  notes: string[];
};

type ValidationReport = {
  schemaVersion: 1;
  reportName: "remote-content-safety-suitability-validation";
  generatedAt: string;
  branchName: string;
  mainCommitChecked: string;
  assetHostChecked: string;
  productionHostChecked: string;
  executiveResult: string;
  remoteManifestResult: CheckResult & {
    publicManifestUrl: string;
    uploadManifestUrl: string;
    publicManifestBooks: number;
    uploadManifestFiles: number;
  };
  remotePayloadCountResult: CheckResult & {
    expectedBookPayloads: number;
    reachableBookPayloads: number;
    missingExpectedSlugs: string[];
    extraRemoteSlugs: string[];
  };
  remoteSuitabilityMetadataResult: CheckResult & {
    counts: Record<SuitabilityLevel, number>;
    strictReviewCandidateCount: number;
  };
  remoteContentSafetyResult: CheckResult & {
    deterministicUnsafeFindingsRemaining: number;
    changedBooksChecked: number;
    safeReplacementOccurrences: number;
    staleChangedPayloadsRemaining: number;
  };
  cthulhuOwnerReportedCaseResult: CheckResult & {
    slug: string;
    remoteUrl: string;
  };
  changedBooksRemoteVerificationResult: CheckResult & {
    changedBooksChecked: number;
    changedPayloadsMatchingUpdatedExport: number;
    changedPayloadsStillMatchingPriorExport: number;
  };
  productionUiSuitabilityLabelFilterResult: CheckResult & {
    sampledRoutes: PageCheck[];
  };
  productionFullPayloadHydrationResult: CheckResult & {
    sampledRoutes: PageCheck[];
  };
  policyStatementVerification: CheckResult;
  filesIntentionallyNotTracked: string[];
  remainingBlockers: string[];
  nextStep: string;
};

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const UPDATED_EXPORT_ROOT = path.join(
  REPO_ROOT,
  "app/client/assets/books/cloudflare-updated-export",
);
const PRIOR_EXPORT_ROOT = path.join(REPO_ROOT, "app/client/assets/books/cloudflare-export");
const REPORT_ROOT = path.join(
  REPO_ROOT,
  "app/client/assets/books/audit-reports/remote-content-safety-suitability-validation",
);
const REPORT_JSON_PATH = path.join(
  REPORT_ROOT,
  "remote-content-safety-suitability-validation.json",
);
const REPORT_MD_PATH = path.join(
  REPORT_ROOT,
  "remote-content-safety-suitability-validation.md",
);
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

const ASSET_BASE_URL =
  (process.env.VITE_MORSE_BOOK_CONTENT_BASE_URL ||
    process.env.PUBLIC_MORSE_BOOK_CONTENT_BASE_URL ||
    "https://assets.morsewords.com").replace(/\/+$/, "");
const PRODUCTION_BASE_URL = "https://www.morsewords.com";
const EXPECTED_MAIN_COMMIT = "caff234d8e0a472bb1c33f6b3f750e9ed1117d1a";
const EXPECTED_BOOK_COUNT = 519;
const EXPECTED_MANIFEST_COUNT = 2;
const EXPECTED_SUITABILITY_COUNTS: Record<SuitabilityLevel, number> = {
  low: 98,
  moderate: 311,
  elevated: 110,
};
const EXPECTED_STRICT_REVIEW_CANDIDATES = 429;
const OWNER_REPORTED_SLUG = "the-call-of-cthulhu";
const LOWER_RISK_BOOK_SLUG = "a-catastrophe";
const MODERATE_LOWER_RISK_BOOK_SLUG = "the-threat";
const ELEVATED_BOOK_SLUG = "a-christmas-carol";

const PRODUCTION_BOOK_ROUTES = [
  { route: "/morse-code-books/the-call-of-cthulhu", slug: "the-call-of-cthulhu" },
  { route: "/morse-code-books/walden", slug: "walden" },
  {
    route: "/morse-code-books/the-adventures-of-roderick-random",
    slug: "the-adventures-of-roderick-random",
  },
  { route: "/morse-code-books/middlemarch", slug: "middlemarch" },
  { route: "/morse-code-audiobooks/walden", slug: "walden" },
] as const;

const PRODUCTION_POLICY_ROUTES = [
  "/morse-code-books",
  "/morse-code-audiobooks",
  "/morse-code-books/the-call-of-cthulhu",
  "/morse-code-books/walden",
  "/morse-code-books/the-adventures-of-roderick-random",
  "/morse-code-books/middlemarch",
  "/morse-code-audiobooks/walden",
  "/morse-code-books/walden/print",
] as const;

const UNSUPPORTED_POLICY_CLAIMS = [
  /\ball[- ]audience[- ]safe\b/i,
  /\bsafe for all audiences\b/i,
  /\bclassroom[-/ ]safe[- ]by[- ]default\b/i,
  /\byouth[-/ ]safe[- ]by[- ]default\b/i,
  /\bclassroom or youth[-/ ]safe[- ]by[- ]default\b/i,
] as const;

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return (await response.json()) as T;
}

function currentGitValue(args: string[]) {
  return execFileSync("git", args, { cwd: REPO_ROOT, encoding: "utf8" }).trim();
}

function pass(notes: string[]): CheckResult {
  return { status: "pass", notes };
}

function blocked(notes: string[]): CheckResult {
  return { status: "blocked", notes };
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

function suitabilityLabel(value: SuitabilityFields) {
  if (value.contentSuitability === "elevated") return "Elevated suitability review";
  if (value.strictReviewCandidate) return "Review for younger readers";
  if (value.contentSuitability === "moderate") return "Historical content note";
  return "Lower-risk profile";
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

function countSuitability(books: PublicManifestBook[]) {
  const counts: Record<SuitabilityLevel, number> = { low: 0, moderate: 0, elevated: 0 };
  for (const book of books) {
    if (isSuitabilityLevel(book.contentSuitability)) counts[book.contentSuitability] += 1;
  }
  return counts;
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

function manifestBookBySlug(manifest: PublicManifest, slug: string) {
  return manifest.books.find((book) => book.slug === slug);
}

async function validateRemoteAssets() {
  const localPublicManifest = readJson<PublicManifest>(
    path.join(UPDATED_EXPORT_ROOT, "public-manifest.json"),
  );
  const localUploadManifest = readJson<UploadManifest>(
    path.join(UPDATED_EXPORT_ROOT, "upload-manifest.json"),
  );
  const priorManifestPath = path.join(PRIOR_EXPORT_ROOT, "public-manifest.json");
  const priorManifest = fs.existsSync(priorManifestPath)
    ? readJson<PublicManifest>(priorManifestPath)
    : null;
  const priorBySlug = new Map((priorManifest?.books ?? []).map((book) => [book.slug, book]));

  const publicManifestUrl = `${ASSET_BASE_URL}/public-manifest.json`;
  const uploadManifestUrl = `${ASSET_BASE_URL}/upload-manifest.json`;
  const remotePublicManifest = await fetchJson<PublicManifest>(publicManifestUrl);
  const remoteUploadManifest = await fetchJson<UploadManifest>(uploadManifestUrl);

  const manifestNotes: string[] = [];
  if (remotePublicManifest.schemaVersion !== 1) {
    manifestNotes.push("Remote public manifest schemaVersion is not 1.");
  }
  if (remoteUploadManifest.schemaVersion !== 1) {
    manifestNotes.push("Remote upload manifest schemaVersion is not 1.");
  }
  if (remotePublicManifest.contentHash !== localPublicManifest.contentHash) {
    manifestNotes.push("Remote public manifest contentHash does not match the uploaded export.");
  }
  if (remoteUploadManifest.contentHash !== localUploadManifest.contentHash) {
    manifestNotes.push("Remote upload manifest contentHash does not match the uploaded export.");
  }
  if (remoteUploadManifest.files.length !== 521) {
    manifestNotes.push(`Remote upload manifest lists ${remoteUploadManifest.files.length} files, expected 521.`);
  }
  if (remotePublicManifest.books.length !== EXPECTED_BOOK_COUNT) {
    manifestNotes.push(
      `Remote public manifest lists ${remotePublicManifest.books.length} books, expected ${EXPECTED_BOOK_COUNT}.`,
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

  const manifestResult = {
    ...(manifestNotes.length
      ? blocked(manifestNotes)
      : pass([
          "Remote public-manifest.json and upload-manifest.json are reachable.",
          "Both remote manifests match the uploaded export content hash.",
        ])),
    publicManifestUrl,
    uploadManifestUrl,
    publicManifestBooks: remotePublicManifest.books.length,
    uploadManifestFiles: remoteUploadManifest.files.length,
  };

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

  const payloadChecks: PayloadCheck[] = [];
  const payloadNotes: string[] = [];
  const changedPayloadNotes: string[] = [];
  const payloadSuitabilityNotes: string[] = [];

  for (const localSummary of localPublicManifest.books) {
    const remoteSummary = manifestBookBySlug(remotePublicManifest, localSummary.slug);
    if (!remoteSummary) continue;

    const remoteUrl = `${ASSET_BASE_URL}/${localSummary.bookPath}`;
    const remoteBook = await fetchJson<ExportBook>(remoteUrl);
    const localBook = readJson<ExportBook>(path.join(UPDATED_EXPORT_ROOT, localSummary.bookPath));
    const priorSummary = priorBySlug.get(localSummary.slug);
    const notes: string[] = [];

    if (remoteBook.schemaVersion !== 1) notes.push("remote payload schemaVersion is not 1");
    if (remoteBook.slug !== localBook.slug) notes.push("remote payload slug does not match uploaded export");
    if (remoteBook.contentHash !== localBook.contentHash) {
      notes.push("remote payload contentHash does not match uploaded export");
    }
    if (remoteBook.contentVersion !== localBook.contentVersion) {
      notes.push("remote payload contentVersion does not match uploaded export");
    }
    if (remoteSummary.contentHash !== localSummary.contentHash) {
      notes.push("remote manifest summary contentHash does not match uploaded export");
    }
    if (remoteBook.sections.length !== localBook.sections.length) {
      notes.push("remote payload section length does not match uploaded export");
    }
    if (remoteBook.stats.sectionCount !== localBook.stats.sectionCount) {
      notes.push("remote payload section count does not match uploaded export");
    }
    if (remoteBook.stats.wordCount !== localBook.stats.wordCount) {
      notes.push("remote payload word count does not match uploaded export");
    }
    if (contentText(remoteBook).trim().length < 200) {
      notes.push("remote payload does not contain full readable content");
    }
    if (!hasSuitabilityFields(remoteBook) || !hasSuitabilityFields(remoteBook.manifest)) {
      notes.push("remote payload is missing suitability fields");
      payloadSuitabilityNotes.push(`${localSummary.slug}: missing payload suitability fields`);
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
      payloadSuitabilityNotes.push(`${localSummary.slug}: payload suitability metadata mismatch`);
    }

    const contentHashMatchesUpdatedExport = remoteBook.contentHash === localBook.contentHash;
    const contentHashDiffersFromPriorExport = priorSummary
      ? remoteBook.contentHash !== priorSummary.contentHash
      : null;
    payloadChecks.push({
      slug: localSummary.slug,
      status: notes.length ? "blocked" : "pass",
      remoteUrl,
      contentHashMatchesUpdatedExport,
      contentHashDiffersFromPriorExport,
      notes,
    });
    if (notes.length) payloadNotes.push(`${localSummary.slug}: ${notes.join("; ")}`);
  }

  const sweepReport = readJson<SweepReport>(SWEEP_REPORT_PATH);
  const riskReport = readJson<RiskReport>(RISK_REPORT_PATH);
  const changedSlugs = sweepReport.contentSafety.safeReplacementsApplied.generatedBookSlugs;
  const changedChecks = payloadChecks.filter((check) => changedSlugs.includes(check.slug));
  for (const check of changedChecks) {
    if (!check.contentHashMatchesUpdatedExport) {
      changedPayloadNotes.push(`${check.slug}: remote changed payload does not match uploaded export`);
    }
    if (check.contentHashDiffersFromPriorExport === false) {
      changedPayloadNotes.push(`${check.slug}: remote changed payload still matches the prior export hash`);
    }
  }

  const afterCleanupFindings = sweepReport.contentSafety.findingsAfterCleanup.reduce(
    (total, finding) => total + finding.occurrences,
    0,
  );
  const staleChangedPayloadsRemaining = changedChecks.filter(
    (check) => check.contentHashDiffersFromPriorExport === false,
  ).length;

  if (payloadSuitabilityNotes.length) suitabilityNotes.push(...payloadSuitabilityNotes.slice(0, 10));
  if (payloadSuitabilityNotes.length > 10) {
    suitabilityNotes.push(`Additional payload suitability metadata mismatches: ${payloadSuitabilityNotes.length - 10}.`);
  }

  const cthulhuCheck = payloadChecks.find((check) => check.slug === OWNER_REPORTED_SLUG);
  const cthulhuNotes: string[] = [];
  if (!cthulhuCheck) {
    cthulhuNotes.push("The owner-reported slug is missing from remote payload checks.");
  } else if (!cthulhuCheck.contentHashMatchesUpdatedExport) {
    cthulhuNotes.push("The owner-reported slug does not match the sanitized uploaded export.");
  }
  if (!sweepReport.ownerReportedCase.updatedExportSanitized) {
    cthulhuNotes.push("The local safety sweep did not mark the uploaded export sanitized for the owner-reported case.");
  }

  const payloadCountResult = {
    ...(payloadNotes.length
      ? blocked(payloadNotes.slice(0, 25))
      : pass(["All 519 remote book payloads are reachable and match the uploaded export metadata."])),
    expectedBookPayloads: EXPECTED_BOOK_COUNT,
    reachableBookPayloads: payloadChecks.length,
    missingExpectedSlugs,
    extraRemoteSlugs,
  };

  const remoteSuitabilityMetadataResult = {
    ...(suitabilityNotes.length
      ? blocked(suitabilityNotes)
      : pass([
          "Remote manifests and payloads include suitability metadata.",
          "Suitability counts match expected low/moderate/elevated totals.",
          "Strict-review candidate metadata is present and matches expected count.",
        ])),
    counts: suitabilityCounts,
    strictReviewCandidateCount,
  };

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

  const remoteContentSafetyResult = {
    ...(contentSafetyNotes.length
      ? blocked(contentSafetyNotes)
      : pass([
          "Deterministic unsafe findings remaining are 0 by sanitized-export parity.",
          "All safety-sweep changed payloads match the uploaded sanitized export and do not match the prior export hash.",
        ])),
    deterministicUnsafeFindingsRemaining: riskReport.deterministicUnsafeFindingsRemaining,
    changedBooksChecked: changedChecks.length,
    safeReplacementOccurrences: sweepReport.contentSafety.safeReplacementsApplied.occurrenceCount,
    staleChangedPayloadsRemaining,
  };

  const cthulhuOwnerReportedCaseResult = {
    ...(cthulhuNotes.length
      ? blocked(cthulhuNotes)
      : pass([
          "The Call of Cthulhu remote payload matches the sanitized uploaded export.",
          sweepReport.ownerReportedCase.result,
        ])),
    slug: OWNER_REPORTED_SLUG,
    remoteUrl: `${ASSET_BASE_URL}/books/${OWNER_REPORTED_SLUG}.json`,
  };

  const changedBooksRemoteVerificationResult = {
    ...(changedPayloadNotes.length
      ? blocked(changedPayloadNotes.slice(0, 25))
      : pass([
          "All changed books from the safety sweep resolve to the uploaded sanitized export remotely.",
          "No changed-book payload still matches the prior export hash.",
        ])),
    changedBooksChecked: changedChecks.length,
    changedPayloadsMatchingUpdatedExport: changedChecks.filter(
      (check) => check.contentHashMatchesUpdatedExport,
    ).length,
    changedPayloadsStillMatchingPriorExport: staleChangedPayloadsRemaining,
  };

  return {
    localPublicManifest,
    remotePublicManifest,
    manifestResult,
    payloadCountResult,
    remoteSuitabilityMetadataResult,
    remoteContentSafetyResult,
    cthulhuOwnerReportedCaseResult,
    changedBooksRemoteVerificationResult,
    sweepReport,
    riskReport,
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
  if (!response || response.status() >= 400) {
    throw new Error(`${route} returned HTTP ${response?.status() ?? "no response"}`);
  }
  await page.waitForSelector("main, body", { timeout: 30_000 });
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

async function assertNoUnsupportedPolicyClaims(page: Page, route: string) {
  const text = await pageText(page);
  for (const pattern of UNSUPPORTED_POLICY_CLAIMS) {
    if (pattern.test(text)) {
      throw new Error(`${route} matched unsupported all-audience/classroom-safe policy claim pattern.`);
    }
  }
}

async function assertNoUnavailableText(page: Page, route: string) {
  const text = await pageText(page);
  if (/Book text unavailable|This Morse book is not available right now/i.test(text)) {
    throw new Error(`${route} showed unavailable-book text.`);
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

  await gotoProduction(page, route);
  await page.getByTestId(filterTestId).waitFor({ state: "visible", timeout: 30_000 });
  if ((await page.getByTestId(suitabilityTestId).count()) === 0) {
    throw new Error(`${route} did not render suitability labels on listing cards.`);
  }

  await search.fill("A Christmas Carol");
  await page.getByTestId(filterTestId).check();
  if ((await cardBySlug(ELEVATED_BOOK_SLUG).count()) !== 0) {
    throw new Error(`${route} lower-risk filter did not hide an elevated book.`);
  }

  await search.fill("A Catastrophe");
  await cardBySlug(LOWER_RISK_BOOK_SLUG).waitFor({ state: "visible", timeout: 30_000 });

  await search.fill("The Threat");
  await cardBySlug(MODERATE_LOWER_RISK_BOOK_SLUG).waitFor({ state: "visible", timeout: 30_000 });
}

async function validateProductionUi(manifest: PublicManifest) {
  const browser: Browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const uiNotes: string[] = [];
  const hydrationNotes: string[] = [];
  const policyNotes: string[] = [];
  const uiPageChecks: PageCheck[] = [];
  const hydrationPageChecks: PageCheck[] = [];

  try {
    for (const route of ["/morse-code-books", "/morse-code-audiobooks"] as const) {
      const page = await context.newPage();
      const notes: string[] = [];
      try {
        await validateListingFilter(page, route);
        await assertNoUnsupportedPolicyClaims(page, route);
        await assertNoUnavailableText(page, route);
      } catch (error) {
        const note = error instanceof Error ? error.message : String(error);
        notes.push(note);
        uiNotes.push(note);
      } finally {
        uiPageChecks.push({ route, status: notes.length ? "blocked" : "pass", payloadRequests: [], notes });
        await page.close();
      }
    }

    for (const sample of PRODUCTION_BOOK_ROUTES) {
      const routeContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
      const page = await routeContext.newPage();
      const payloadRequests: string[] = [];
      const uiRouteNotes: string[] = [];
      const hydrationRouteNotes: string[] = [];
      page.on("request", (request) => {
        const url = request.url();
        if (url === `${ASSET_BASE_URL}/books/${sample.slug}.json`) payloadRequests.push(url);
      });
      try {
        await gotoProduction(page, sample.route);
        await waitForBookReady(page);
        await assertNoUnavailableText(page, sample.route);
        await assertNoUnsupportedPolicyClaims(page, sample.route);
        const expected = manifestBookBySlug(manifest, sample.slug);
        if (!expected) throw new Error(`${sample.slug} is missing from remote manifest.`);
        const expectedLabel = suitabilityLabel(expected);
        await page.waitForFunction(
          ({ label, note }) => {
            const text =
              document.querySelector('[data-testid="morse-book-content-suitability"]')?.textContent ??
              "";
            return text.includes(label) && text.includes(note);
          },
          { label: expectedLabel, note: expected.contentNote },
          { timeout: 30_000 },
        );
        const suitabilityText =
          (await page
            .getByTestId("morse-book-content-suitability")
            .textContent({ timeout: 30_000 })) ?? "";
        if (!suitabilityText.includes(expectedLabel) || !suitabilityText.includes(expected.contentNote)) {
          uiRouteNotes.push(`${sample.route} did not show the expected suitability note.`);
        }
        if (payloadRequests.length === 0) {
          hydrationRouteNotes.push(
            `${sample.route} did not request the full payload from ${ASSET_BASE_URL}.`,
          );
        }
      } catch (error) {
        const note = error instanceof Error ? error.message : String(error);
        uiRouteNotes.push(note);
        hydrationRouteNotes.push(note);
      } finally {
        const uiPageCheck = {
          route: sample.route,
          status: uiRouteNotes.length ? "blocked" : "pass",
          payloadRequests,
          notes: uiRouteNotes,
        } satisfies PageCheck;
        const hydrationPageCheck = {
          route: sample.route,
          status: hydrationRouteNotes.length ? "blocked" : "pass",
          payloadRequests,
          notes: hydrationRouteNotes,
        } satisfies PageCheck;
        if (uiRouteNotes.length) uiNotes.push(...uiRouteNotes);
        if (hydrationRouteNotes.length) hydrationNotes.push(...hydrationRouteNotes);
        uiPageChecks.push(uiPageCheck);
        hydrationPageChecks.push(hydrationPageCheck);
        await page.close();
        await routeContext.close();
      }
    }

    const printablePage = await context.newPage();
    const printableNotes: string[] = [];
    try {
      await gotoProduction(printablePage, "/morse-code-books/walden/print");
      await assertNoUnavailableText(printablePage, "/morse-code-books/walden/print");
      await assertNoUnsupportedPolicyClaims(printablePage, "/morse-code-books/walden/print");
      const expected = manifestBookBySlug(manifest, "walden");
      if (!expected) throw new Error("walden is missing from remote manifest.");
      const printableSuitability = await printablePage
        .getByTestId("printable-book-content-suitability")
        .innerText({ timeout: 30_000 });
      if (
        !printableSuitability.includes(suitabilityLabel(expected)) ||
        !printableSuitability.includes(expected.contentNote)
      ) {
        throw new Error("Printable Walden page did not show the expected suitability note.");
      }
    } catch (error) {
      const note = error instanceof Error ? error.message : String(error);
      printableNotes.push(note);
      uiNotes.push(note);
    } finally {
      uiPageChecks.push({
        route: "/morse-code-books/walden/print",
        status: printableNotes.length ? "blocked" : "pass",
        payloadRequests: [],
        notes: printableNotes,
      });
      await printablePage.close();
    }

    for (const route of PRODUCTION_POLICY_ROUTES) {
      const page = await context.newPage();
      try {
        await gotoProduction(page, route);
        await assertNoUnsupportedPolicyClaims(page, route);
      } catch (error) {
        policyNotes.push(error instanceof Error ? error.message : String(error));
      } finally {
        await page.close();
      }
    }
  } finally {
    await context.close();
    await browser.close();
  }

  const productionUiSuitabilityLabelFilterResult = {
    ...(uiNotes.length
      ? blocked(uiNotes)
      : pass([
          "Production book and audiobook listings show suitability labels.",
          "The lower-risk filter exists, hides an elevated book, and keeps lower-risk low/moderate books visible.",
          "Sampled detail, audiobook, and printable pages show suitability notes.",
        ])),
    sampledRoutes: uiPageChecks,
  };

  const productionFullPayloadHydrationResult = {
    ...(hydrationNotes.length
      ? blocked(hydrationNotes)
      : pass([
          "Sampled production detail and audiobook pages requested full payloads from https://assets.morsewords.com.",
          "Full payload hydration completed and no sampled live page showed unavailable-book text.",
        ])),
    sampledRoutes: hydrationPageChecks,
  };

  const policyStatementVerification = policyNotes.length
    ? blocked(policyNotes)
    : pass([
        "No sampled production page claimed all-audience safety.",
        "No sampled production page claimed classroom/youth-safe-by-default status.",
      ]);

  return {
    productionUiSuitabilityLabelFilterResult,
    productionFullPayloadHydrationResult,
    policyStatementVerification,
  };
}

function writeReport(report: ValidationReport) {
  fs.mkdirSync(REPORT_ROOT, { recursive: true });
  fs.writeFileSync(REPORT_JSON_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  const section = (title: string, lines: string[]) => [`## ${title}`, "", ...lines, ""];
  const formatCheck = (check: CheckResult) => [
    `- Status: ${check.status}`,
    ...check.notes.map((note) => `- ${note}`),
  ];

  const lines = [
    "# Remote content-safety and suitability validation",
    "",
    ...section("1. Executive result", [report.executiveResult]),
    ...section("2. Main commit checked", [`- ${report.mainCommitChecked}`]),
    ...section("3. Asset host checked", [`- ${report.assetHostChecked}`]),
    ...section("4. Remote manifest result", [
      ...formatCheck(report.remoteManifestResult),
      `- Public manifest URL: ${report.remoteManifestResult.publicManifestUrl}`,
      `- Upload manifest URL: ${report.remoteManifestResult.uploadManifestUrl}`,
      `- Remote manifest books: ${report.remoteManifestResult.publicManifestBooks}`,
      `- Remote upload-manifest files: ${report.remoteManifestResult.uploadManifestFiles}`,
    ]),
    ...section("5. Remote payload count result", [
      ...formatCheck(report.remotePayloadCountResult),
      `- Expected book payloads: ${report.remotePayloadCountResult.expectedBookPayloads}`,
      `- Reachable book payloads: ${report.remotePayloadCountResult.reachableBookPayloads}`,
      `- Missing expected slugs: ${report.remotePayloadCountResult.missingExpectedSlugs.length}`,
      `- Extra remote slugs: ${report.remotePayloadCountResult.extraRemoteSlugs.length}`,
    ]),
    ...section("6. Remote suitability metadata result", [
      ...formatCheck(report.remoteSuitabilityMetadataResult),
      `- Low: ${report.remoteSuitabilityMetadataResult.counts.low}`,
      `- Moderate: ${report.remoteSuitabilityMetadataResult.counts.moderate}`,
      `- Elevated: ${report.remoteSuitabilityMetadataResult.counts.elevated}`,
      `- Strict-review candidates: ${report.remoteSuitabilityMetadataResult.strictReviewCandidateCount}`,
    ]),
    ...section("7. Remote content-safety result", [
      ...formatCheck(report.remoteContentSafetyResult),
      `- Deterministic unsafe findings remaining: ${report.remoteContentSafetyResult.deterministicUnsafeFindingsRemaining}`,
      `- Changed books checked: ${report.remoteContentSafetyResult.changedBooksChecked}`,
      `- Safe replacement occurrences: ${report.remoteContentSafetyResult.safeReplacementOccurrences}`,
      `- Stale changed payloads remaining: ${report.remoteContentSafetyResult.staleChangedPayloadsRemaining}`,
    ]),
    ...section("8. The Call of Cthulhu owner-reported case result", [
      ...formatCheck(report.cthulhuOwnerReportedCaseResult),
      `- Slug: ${report.cthulhuOwnerReportedCaseResult.slug}`,
      `- Remote URL: ${report.cthulhuOwnerReportedCaseResult.remoteUrl}`,
    ]),
    ...section("9. Changed-books remote verification result", [
      ...formatCheck(report.changedBooksRemoteVerificationResult),
      `- Changed books checked: ${report.changedBooksRemoteVerificationResult.changedBooksChecked}`,
      `- Matching updated export: ${report.changedBooksRemoteVerificationResult.changedPayloadsMatchingUpdatedExport}`,
      `- Still matching prior export: ${report.changedBooksRemoteVerificationResult.changedPayloadsStillMatchingPriorExport}`,
    ]),
    ...section("10. Production UI suitability label/filter result", [
      ...formatCheck(report.productionUiSuitabilityLabelFilterResult),
      `- Sampled routes: ${report.productionUiSuitabilityLabelFilterResult.sampledRoutes.length}`,
    ]),
    ...section("11. Production full-payload hydration result", [
      ...formatCheck(report.productionFullPayloadHydrationResult),
      `- Sampled routes: ${report.productionFullPayloadHydrationResult.sampledRoutes.length}`,
    ]),
    ...section("12. Policy statement verification", formatCheck(report.policyStatementVerification)),
    ...section(
      "13. Files intentionally not tracked",
      report.filesIntentionallyNotTracked.map((item) => `- ${item}`),
    ),
    ...section(
      "14. Remaining blockers",
      report.remainingBlockers.length
        ? report.remainingBlockers.map((item) => `- ${item}`)
        : ["- None."],
    ),
    ...section("15. Next step", [`- ${report.nextStep}`]),
  ];
  fs.writeFileSync(REPORT_MD_PATH, lines.join("\n"), "utf8");
}

async function main() {
  const branchName = currentGitValue(["branch", "--show-current"]);
  const mainCommitChecked = currentGitValue(["rev-parse", "main"]);
  const policyDecision = readJson<PolicyDecisionReport>(POLICY_REPORT_PATH);

  const remote = await validateRemoteAssets();
  const productionUi = await validateProductionUi(remote.remotePublicManifest);

  const remainingBlockers = summarizeBlockers([
    remote.manifestResult,
    remote.payloadCountResult,
    remote.remoteSuitabilityMetadataResult,
    remote.remoteContentSafetyResult,
    remote.cthulhuOwnerReportedCaseResult,
    remote.changedBooksRemoteVerificationResult,
    productionUi.productionUiSuitabilityLabelFilterResult,
    productionUi.productionFullPayloadHydrationResult,
    productionUi.policyStatementVerification,
  ]);

  if (mainCommitChecked !== EXPECTED_MAIN_COMMIT) {
    remainingBlockers.push(
      `Main commit checked was ${mainCommitChecked}, expected ${EXPECTED_MAIN_COMMIT}.`,
    );
  }
  const livePrintRouteBlocked = remainingBlockers.some(
    (blocker) =>
      blocker.includes("/morse-code-books/walden/print") &&
      /HTTP 500|connection was closed|returned HTTP/i.test(blocker),
  );

  const report: ValidationReport = {
    schemaVersion: 1,
    reportName: "remote-content-safety-suitability-validation",
    generatedAt: new Date().toISOString(),
    branchName,
    mainCommitChecked,
    assetHostChecked: ASSET_BASE_URL,
    productionHostChecked: PRODUCTION_BASE_URL,
    executiveResult: remainingBlockers.length
      ? `Remote content-safety and suitability validation blocked because ${remainingBlockers[0]}`
      : "Remote content-safety and suitability validation passed",
    remoteManifestResult: remote.manifestResult,
    remotePayloadCountResult: remote.payloadCountResult,
    remoteSuitabilityMetadataResult: remote.remoteSuitabilityMetadataResult,
    remoteContentSafetyResult: remote.remoteContentSafetyResult,
    cthulhuOwnerReportedCaseResult: remote.cthulhuOwnerReportedCaseResult,
    changedBooksRemoteVerificationResult: remote.changedBooksRemoteVerificationResult,
    productionUiSuitabilityLabelFilterResult:
      productionUi.productionUiSuitabilityLabelFilterResult,
    productionFullPayloadHydrationResult: productionUi.productionFullPayloadHydrationResult,
    policyStatementVerification: {
      ...productionUi.policyStatementVerification,
      notes: [
        ...productionUi.policyStatementVerification.notes,
        policyDecision.recommendedProductPolicy,
        "All-audience safety is not supported by this validation.",
        "Classroom/youth-safe-by-default status is not supported by this validation.",
      ],
    },
    filesIntentionallyNotTracked: [
      "app/client/assets/books/cloudflare-export",
      "app/client/assets/books/cloudflare-updated-export",
      "app/client/assets/temp-books",
      "public/book-previews",
      "app/client/assets/books/generated",
    ],
    remainingBlockers,
    nextStep: livePrintRouteBlocked
      ? "Remote asset validation passed. Production print-route validation was blocked by a live 500 on /morse-code-books/walden/print. A targeted print-route fix and local regression coverage were added. Production revalidation is required after this branch is merged and deployed."
      : "If this passes, move to morsewords-final-deploy-validation-and-cleanup-jun-2026.",
  };

  writeReport(report);

  console.log(report.executiveResult);
  console.log(`Branch: ${branchName}`);
  console.log(`Main commit checked: ${mainCommitChecked}`);
  console.log(`Asset host checked: ${ASSET_BASE_URL}`);
  console.log(`Remote manifest books: ${report.remoteManifestResult.publicManifestBooks}`);
  console.log(`Reachable remote payloads: ${report.remotePayloadCountResult.reachableBookPayloads}`);
  console.log(
    `Suitability counts: low=${report.remoteSuitabilityMetadataResult.counts.low}, moderate=${report.remoteSuitabilityMetadataResult.counts.moderate}, elevated=${report.remoteSuitabilityMetadataResult.counts.elevated}`,
  );
  console.log(
    `Changed books verified remotely: ${report.changedBooksRemoteVerificationResult.changedPayloadsMatchingUpdatedExport}/${report.changedBooksRemoteVerificationResult.changedBooksChecked}`,
  );
  console.log(`Production UI sampled routes: ${report.productionUiSuitabilityLabelFilterResult.sampledRoutes.length}`);
  console.log(`Production hydration sampled routes: ${report.productionFullPayloadHydrationResult.sampledRoutes.length}`);
  console.log(`Blockers: ${report.remainingBlockers.length}`);
  console.log(`Report: ${path.relative(REPO_ROOT, REPORT_JSON_PATH)}`);

  if (report.remainingBlockers.length) {
    for (const blocker of report.remainingBlockers) console.error(`- ${blocker}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
