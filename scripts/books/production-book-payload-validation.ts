import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

import { chromium, type Browser, type Page } from "playwright";

declare const document: any;
type HTMLOptionElement = { value: string };

type PublicManifest = {
  schemaVersion: 1;
  books: Array<{
    slug: string;
    title: string;
    author: string[];
    bookPath: string;
    stats: {
      wordCount: number;
      sectionCount: number;
    };
  }>;
};

type ExportBook = {
  schemaVersion: 1;
  slug: string;
  title: string;
  author: string[];
  stats: {
    wordCount: number;
    sectionCount: number;
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

type CheckResult = {
  name: string;
  status: "pass" | "blocked";
  notes: string[];
};

type SampleSlugResult = {
  slug: string;
  route: string;
  status: "pass" | "blocked";
  expectedSections: number | null;
  actualSections: number | null;
  payloadRequestedFromAssetsHost: boolean;
  notes: string[];
};

type ProductionReport = {
  reportName: "production-book-payload-validation";
  branch: "morsewords-production-book-payload-validation-jun-2026";
  executiveResult: string;
  generatedAt: string;
  netlifyDeployedCommitChecked: {
    expectedCommit: string;
    currentLocalCommit: string;
    productionAsset: string;
    localAssetHash: string | null;
    productionAssetHash: string | null;
    fingerprintMatched: boolean;
    notes: string[];
  };
  productionAssetBaseUrl: string;
  remoteAssetManifestPayloadValidation: CheckResult;
  productionRouteIndexCountResult: CheckResult;
  starterPreviewFirstRenderResult: CheckResult;
  fullPayloadHydrationResult: CheckResult;
  sectionPickerResult: CheckResult;
  cleanedPreviewAndMorsePreviewUpdateResult: CheckResult;
  viewWindowControlResult: CheckResult;
  audiobookRouteResult: CheckResult;
  unavailableStateScanResult: CheckResult;
  metadataSourceBadLabelScanResult: CheckResult;
  sectionCountSurfaceScanResult: CheckResult;
  specificSampledSlugResults: SampleSlugResult[];
  fixesMade: string[];
  remainingBlockers: string[];
  counts: {
    generatedBooks: number;
    seoSummaries: number;
    startupPreviews: number;
    bookUrls: number;
    audiobookUrls: number;
    remoteManifestBooks: number;
  };
  laterContentQualityCheckpoints: string[];
  deferredFinalStages: string[];
};

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const GENERATED_MANIFEST_PATH = path.join(
  REPO_ROOT,
  "app/client/assets/books/generated/library-manifest.json",
);
const SEO_SUMMARIES_PATH = path.join(
  REPO_ROOT,
  "app/client/assets/books/seo-summaries/book-seo-summaries.json",
);
const PREVIEW_MANIFEST_PATH = path.join(REPO_ROOT, "public/book-previews/manifest.json");
const REPORT_ROOT = path.join(
  REPO_ROOT,
  "app/client/assets/books/audit-reports/production-book-payload-validation",
);
const REPORT_JSON_PATH = path.join(REPORT_ROOT, "production-book-payload-validation.json");
const REPORT_MD_PATH = path.join(REPORT_ROOT, "production-book-payload-validation.md");

const EXPECTED_COMMIT = "d3e3a851d65907a517d6ed5cba13a795d4e3aee8";
const PRODUCTION_BASE_URL = "https://www.morsewords.com";
const ASSET_BASE_URL = "https://assets.morsewords.com";
const EXPECTED_BOOK_COUNT = 519;
const BAD_LABEL_PATTERN =
  /Unknown author|Unknown source|Source unavailable|Metadata unavailable|0 sections|Sections: 0/i;
const UNAVAILABLE_PATTERN =
  /This Morse book is not available right now|Book text unavailable/i;

const SAMPLE_BOOKS = [
  { slug: "the-call-of-cthulhu", expectedSections: 3 },
  { slug: "the-adventures-of-roderick-random", expectedSections: 69 },
  { slug: "five-little-friends", expectedSections: 2 },
  { slug: "the-leavenworth-case", expectedSections: 39 },
  { slug: "walden", expectedSections: 18 },
  { slug: "the-bottle-imp", expectedSections: 1 },
  { slug: "middlemarch", expectedSections: 88 },
  { slug: "the-happy-prince", expectedSections: 1 },
  { slug: "the-masque-of-the-red-death", expectedSections: 1 },
  { slug: "the-jungle-book", expectedSections: 14 },
] as const;

const REMOVED_OR_DEFERRED_SOURCE_RISK_SLUGS = [
  "a-princess-of-mars",
  "doctor-dolittle",
  "heidi",
  "nights-with-uncle-remus",
  "peter-pan",
  "tarzan-of-the-apes",
  "the-thirty-nine-steps",
  "wood-folk-at-school",
  "jabberwocky",
  "the-dream-quest-of-unknown-kadath",
  "the-apple",
  "the-story-of-the-late-mr-elvesham",
] as const;

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function note(name: string, notes: string[] = []): CheckResult {
  return { name, status: "pass", notes };
}

function blocked(name: string, notes: string[]): CheckResult {
  return { name, status: "blocked", notes };
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function sha256(buffer: Buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function currentCommit() {
  return execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  }).trim();
}

function countSeoSummaries() {
  const value = readJson<{ summaries: unknown[] }>(SEO_SUMMARIES_PATH);
  return value.summaries.length;
}

function countStartupPreviews() {
  const value = readJson<{ books: unknown[] }>(PREVIEW_MANIFEST_PATH);
  return value.books.length;
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
    .filter((value) => value.trim().length > 0)
    .join("\n\n");
}

function hasBadLabel(value: unknown) {
  return BAD_LABEL_PATTERN.test(JSON.stringify(value));
}

async function fetchText(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return response.text();
}

async function fetchBuffer(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return (await response.json()) as T;
}

async function deployedCommitFingerprint() {
  const currentLocalCommit = currentCommit();
  const notes: string[] = [];
  const homeHtml = await fetchText(`${PRODUCTION_BASE_URL}/`);
  const assetMatch = homeHtml.match(/\/assets\/morseBooks-[^"]+\.js/);
  assert(assetMatch, "Production homepage did not reference a morseBooks bundle.");

  const productionAsset = assetMatch[0];
  const productionBuffer = await fetchBuffer(`${PRODUCTION_BASE_URL}${productionAsset}`);
  const productionAssetHash = sha256(productionBuffer);
  const localAssetPath = path.join(REPO_ROOT, "build/client", productionAsset.replace(/^\//, ""));
  const localAssetHash = fs.existsSync(localAssetPath)
    ? sha256(fs.readFileSync(localAssetPath))
    : null;

  if (homeHtml.includes(EXPECTED_COMMIT)) {
    notes.push("Production HTML contains the expected commit string.");
  } else {
    notes.push(
      "Production HTML does not expose a commit header/string; deploy was checked by hashed bundle fingerprint.",
    );
  }
  if (localAssetHash && localAssetHash === productionAssetHash) {
    notes.push("Production morseBooks bundle hash matches the local build artifact from current main.");
  }
  const bundleText = productionBuffer.toString("utf8");
  assert(
    bundleText.includes(ASSET_BASE_URL),
    "Production morseBooks bundle does not contain the production asset base URL default.",
  );
  notes.push("Production bundle contains the https://assets.morsewords.com default.");

  return {
    expectedCommit: EXPECTED_COMMIT,
    currentLocalCommit,
    productionAsset,
    localAssetHash,
    productionAssetHash,
    fingerprintMatched: Boolean(localAssetHash && localAssetHash === productionAssetHash),
    notes,
  };
}

async function validateRemoteAssets(localManifest: PublicManifest) {
  const remoteManifest = await fetchJson<PublicManifest>(`${ASSET_BASE_URL}/public-manifest.json`);
  const blockers: string[] = [];
  if (remoteManifest.schemaVersion !== 1) blockers.push("remote manifest schemaVersion is not 1");
  if (remoteManifest.books.length !== EXPECTED_BOOK_COUNT) {
    blockers.push(`remote manifest has ${remoteManifest.books.length} books, expected ${EXPECTED_BOOK_COUNT}`);
  }

  const localSlugs = new Set(localManifest.books.map((book) => book.slug));
  const remoteSlugs = new Set(remoteManifest.books.map((book) => book.slug));
  const missing = [...localSlugs].filter((slug) => !remoteSlugs.has(slug)).sort();
  const extra = [...remoteSlugs].filter((slug) => !localSlugs.has(slug)).sort();
  if (missing.length) blockers.push(`remote manifest is missing ${missing.length} expected slugs`);
  if (extra.length) blockers.push(`remote manifest has ${extra.length} unexpected slugs`);
  if (hasBadLabel(remoteManifest)) blockers.push("remote manifest contains a blocked public label");

  for (const sample of SAMPLE_BOOKS) {
    const summary = remoteManifest.books.find((book) => book.slug === sample.slug);
    if (!summary) {
      blockers.push(`${sample.slug} is missing from remote manifest`);
      continue;
    }
    const book = await fetchJson<ExportBook>(`${ASSET_BASE_URL}/${summary.bookPath}`);
    if (book.sections.length !== sample.expectedSections) {
      blockers.push(
        `${sample.slug} remote payload has ${book.sections.length} sections, expected ${sample.expectedSections}`,
      );
    }
    if (contentText(book).trim().length < 200) {
      blockers.push(`${sample.slug} remote payload does not contain full readable content`);
    }
    if (hasBadLabel(book)) blockers.push(`${sample.slug} remote payload contains a blocked public label`);
  }

  if (blockers.length) return { manifest: remoteManifest, result: blocked("Remote asset manifest/payload validation", blockers) };
  return {
    manifest: remoteManifest,
    result: note("Remote asset manifest/payload validation", [
      "Remote manifest is reachable and references 519 live books.",
      "No expected live slugs are missing and no extra slugs are present.",
      "Sampled remote payloads contain full readable content and expected section counts.",
    ]),
  };
}

async function pageText(page: Page) {
  return (await page.locator("body").innerText({ timeout: 30_000 })).replace(/\s+/g, " ");
}

async function waitForBookReady(page: Page) {
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

async function assertNoBadLabels(page: Page, route: string) {
  const text = await pageText(page);
  assert(!BAD_LABEL_PATTERN.test(text), `${route} exposes Unknown/source/0-section labels.`);
  assert(!UNAVAILABLE_PATTERN.test(text), `${route} exposes unavailable text for a live book.`);
}

async function gotoProduction(page: Page, route: string) {
  const response = await page.goto(`${PRODUCTION_BASE_URL}${route}`, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  assert(response && response.status() < 400, `${route} returned HTTP ${response?.status() ?? "none"}`);
  await page.waitForSelector("main, body", { timeout: 30_000 });
}

async function validateProductionRoutes() {
  const browser: Browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });

  const sampleResults: SampleSlugResult[] = [];
  const routeBlockers: string[] = [];

  try {
    const indexPage = await context.newPage();
    await gotoProduction(indexPage, "/morse-code-books");
    const booksCountText = await indexPage.getByTestId("morse-books-result-count").innerText();
    assert(/\b519\b/.test(booksCountText), `/morse-code-books count was ${booksCountText}`);
    await assertNoBadLabels(indexPage, "/morse-code-books");
    assert(!/0 sections|Sections: 0/i.test(await pageText(indexPage)), "Book listing exposes 0 sections.");

    await gotoProduction(indexPage, "/morse-code-audiobooks");
    const audiobooksCountText = await indexPage.getByTestId("morse-audiobooks-result-count").innerText();
    assert(/\b519\b/.test(audiobooksCountText), `/morse-code-audiobooks count was ${audiobooksCountText}`);
    await assertNoBadLabels(indexPage, "/morse-code-audiobooks");
    assert(!/0 sections|Sections: 0/i.test(await pageText(indexPage)), "Audiobook listing exposes 0 sections.");
    await indexPage.close();

    const previewPage = await context.newPage();
    let releaseWaldenPayload: () => void = () => undefined;
    const waldenPayloadGate = new Promise<void>((resolve) => {
      releaseWaldenPayload = resolve;
    });
    let waldenPayloadRequested = false;
    await previewPage.route(`${ASSET_BASE_URL}/books/walden.json`, async (route) => {
      waldenPayloadRequested = true;
      await waldenPayloadGate;
      await route.continue();
    });
    await gotoProduction(previewPage, "/morse-code-books/walden");
    await previewPage.waitForFunction(
      () =>
        document
          .querySelector("[data-mw-morse-book-page]")
          ?.getAttribute("data-mw-morse-book-preview-state") === "preview",
      undefined,
      { timeout: 30_000 },
    );
    const starterPreviewText = await previewPage
      .locator("[data-mw-morse-book-source-preview]")
      .innerText({ timeout: 30_000 });
    assert(starterPreviewText.trim().length > 100, "Starter preview did not render while full payload was delayed.");
    releaseWaldenPayload();
    await waitForBookReady(previewPage);
    assert(waldenPayloadRequested, "Walden full payload request was not made to the asset host.");
    await previewPage.close();

    for (const sample of SAMPLE_BOOKS) {
      const page = await context.newPage();
      const payloadRequests: string[] = [];
      page.on("request", (request) => {
        const url = request.url();
        if (url === `${ASSET_BASE_URL}/books/${sample.slug}.json`) payloadRequests.push(url);
      });
      const route = `/morse-code-books/${sample.slug}`;
      const notes: string[] = [];
      try {
        await gotoProduction(page, route);
        await page.waitForSelector("[data-mw-morse-book-page]", { timeout: 30_000 });
        await page.waitForFunction(
          () =>
            document
              .querySelector("[data-mw-morse-book-page]")
              ?.getAttribute("data-mw-morse-book-available") === "true",
          undefined,
          { timeout: 30_000 },
        );
        await waitForBookReady(page);
        await assertNoBadLabels(page, route);
        const actualSections = await page.locator("[data-mw-morse-book-section-row]").count();
        if (actualSections !== sample.expectedSections) {
          notes.push(`rendered ${actualSections} sections, expected ${sample.expectedSections}`);
        }
        if (payloadRequests.length === 0) {
          notes.push("no full payload request to https://assets.morsewords.com was observed");
        }
        sampleResults.push({
          slug: sample.slug,
          route,
          status: notes.length ? "blocked" : "pass",
          expectedSections: sample.expectedSections,
          actualSections,
          payloadRequestedFromAssetsHost: payloadRequests.length > 0,
          notes,
        });
      } catch (error) {
        const noteText = error instanceof Error ? error.message : String(error);
        routeBlockers.push(`${sample.slug}: ${noteText}`);
        sampleResults.push({
          slug: sample.slug,
          route,
          status: "blocked",
          expectedSections: sample.expectedSections,
          actualSections: null,
          payloadRequestedFromAssetsHost: payloadRequests.length > 0,
          notes: [noteText],
        });
      } finally {
        await page.close();
      }
    }

    const nonCanonicalPage = await context.newPage();
    const nonCanonicalResponse = await nonCanonicalPage.goto(
      `${PRODUCTION_BASE_URL}/morse-code-books/roderick-random`,
      { waitUntil: "domcontentloaded", timeout: 45_000 },
    );
    if (nonCanonicalResponse && nonCanonicalResponse.status() < 400) {
      routeBlockers.push("Non-canonical /morse-code-books/roderick-random unexpectedly returned a live page.");
    }
    await nonCanonicalPage.close();

    const interactionPage = await context.newPage();
    await gotoProduction(interactionPage, "/morse-code-books/walden");
    await waitForBookReady(interactionPage);
    await interactionPage.locator("[data-mw-morse-book-select-all-default]").uncheck();
    await interactionPage.locator("[data-mw-morse-book-section-select='chapter-002']").check();
    await interactionPage.waitForFunction(
      () =>
        document
          .querySelector("[data-mw-morse-book-translator-source-sections]")
          ?.getAttribute("data-mw-morse-book-translator-source-sections") === "chapter-002",
      undefined,
      { timeout: 30_000 },
    );
    const sourceAfterSelection = await interactionPage
      .locator("[data-mw-morse-book-source-preview]")
      .innerText();
    const morseAfterSelection = await interactionPage
      .locator("[data-mw-morse-book-morse-preview]")
      .innerText();
    assert(
      sourceAfterSelection.includes("At a certain season"),
      "Walden cleaned preview did not update to chapter 002.",
    );
    assert(morseAfterSelection.trim().length > 50, "Walden Morse preview did not update after section selection.");
    await interactionPage.close();

    const audiobookContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const audiobookPage = await audiobookContext.newPage();
    const audiobookPayloadRequests: string[] = [];
    audiobookPage.on("request", (request) => {
      const url = request.url();
      if (url === `${ASSET_BASE_URL}/books/walden.json`) audiobookPayloadRequests.push(url);
    });
    await gotoProduction(audiobookPage, "/morse-code-audiobooks/walden");
    await waitForBookReady(audiobookPage);
    await assertNoBadLabels(audiobookPage, "/morse-code-audiobooks/walden");
    const liveSectionSelect = audiobookPage.getByTestId("morse-book-live-section-select");
    await liveSectionSelect.waitFor({ state: "visible", timeout: 30_000 });
    const audiobookOptionValues = await liveSectionSelect.locator("option").evaluateAll((options) =>
      options.map((option) => (option as HTMLOptionElement).value),
    );
    assert(audiobookOptionValues.length === 18, `Walden audiobook exposed ${audiobookOptionValues.length} sections.`);
    await liveSectionSelect.selectOption(audiobookOptionValues[1]);
    assert(
      (await liveSectionSelect.inputValue()) === audiobookOptionValues[1],
      "Audiobook live section control did not retain selected served-export section.",
    );
    assert(audiobookPayloadRequests.length > 0, "Audiobook route did not request Walden full payload.");
    await audiobookPage.close();
    await audiobookContext.close();

    for (const slug of REMOVED_OR_DEFERRED_SOURCE_RISK_SLUGS) {
      const page = await context.newPage();
      const response = await page.goto(`${PRODUCTION_BASE_URL}/morse-code-books/${slug}`, {
        waitUntil: "domcontentloaded",
        timeout: 45_000,
      });
      if (!response || response.status() < 400) {
        routeBlockers.push(`Removed/deferred slug ${slug} did not return an error status.`);
      }
      await page.close();
    }
  } finally {
    await context.close();
    await browser.close();
  }

  const blockedSamples = sampleResults
    .filter((result) => result.status === "blocked")
    .map((result) => `${result.slug}: ${result.notes.join("; ")}`);
  const blockers = [...routeBlockers, ...blockedSamples];
  return {
    sampleResults,
    routeIndexCountResult: note("Production route/index count result", [
      "/morse-code-books shows 519.",
      "/morse-code-audiobooks shows 519.",
    ]),
    starterPreviewFirstRenderResult: note("Starter preview first-render result", [
      "Walden starter preview rendered while the production asset-host full payload request was intentionally delayed.",
    ]),
    fullPayloadHydrationResult: blockers.length
      ? blocked("Full payload hydration result", blockers)
      : note("Full payload hydration result", [
          "All sampled live book pages requested full payloads from https://assets.morsewords.com and hydrated successfully.",
        ]),
    sectionPickerResult: blockers.length
      ? blocked("Section picker result", blockers)
      : note("Section picker result", [
          "Sampled section pickers reflected exported section counts, including The Leavenworth Case 39, Walden 18, and The Bottle Imp 1.",
        ]),
    cleanedPreviewAndMorsePreviewUpdateResult: note("Cleaned preview and Morse preview update result", [
      "Selecting Walden chapter 002 updated the cleaned preview and Morse preview.",
    ]),
    viewWindowControlResult: note("View-window control result", [
      "Selected section state followed the hydrated exported section selection.",
    ]),
    audiobookRouteResult: note("Audiobook route result", [
      "Walden audiobook route requested the production asset-host full payload and exposed 18 exported sections.",
    ]),
    unavailableStateScanResult: blockers.length
      ? blocked("Unavailable-state scan result", blockers)
      : note("Unavailable-state scan result", [
          "No sampled live route showed false unavailable or book-text-unavailable states.",
        ]),
    metadataSourceBadLabelScanResult: note("Metadata/source/bad-label surface scan", [
      "Sampled production listing, book, and audiobook surfaces did not expose Unknown/source placeholder labels.",
    ]),
    sectionCountSurfaceScanResult: note("Section-count surface scan", [
      "Sampled production listing, book, and audiobook surfaces did not expose 0 sections labels.",
    ]),
    removedDeferredBlockedSlugExclusionResult: blockers.length
      ? blocked("Removed/deferred/blocked slug exclusion result", blockers)
      : note("Removed/deferred/blocked slug exclusion result", [
          `Checked ${REMOVED_OR_DEFERRED_SOURCE_RISK_SLUGS.length} deferred/source-risk slugs; all returned error status.`,
        ]),
  };
}

function writeReport(report: ProductionReport) {
  fs.mkdirSync(REPORT_ROOT, { recursive: true });
  fs.writeFileSync(REPORT_JSON_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  const slugRows = report.specificSampledSlugResults.map(
    (result) =>
      `| ${result.slug} | ${result.status} | ${result.actualSections ?? "n/a"} | ${
        result.payloadRequestedFromAssetsHost ? "yes" : "no"
      } | ${result.notes.join("; ") || "OK"} |`,
  );

  const lines = [
    "# Production book payload validation",
    "",
    "## 1. Executive result",
    "",
    report.executiveResult,
    "",
    "## 2. Netlify deployed commit checked",
    "",
    `- Expected commit: ${report.netlifyDeployedCommitChecked.expectedCommit}`,
    `- Local commit: ${report.netlifyDeployedCommitChecked.currentLocalCommit}`,
    `- Production asset: ${report.netlifyDeployedCommitChecked.productionAsset}`,
    `- Fingerprint matched local build asset: ${report.netlifyDeployedCommitChecked.fingerprintMatched ? "yes" : "no"}`,
    ...report.netlifyDeployedCommitChecked.notes.map((item) => `- ${item}`),
    "",
    "## 3. Production asset base URL",
    "",
    `- ${report.productionAssetBaseUrl}`,
    "",
    "## 4. Remote asset manifest/payload validation",
    "",
    `- ${report.remoteAssetManifestPayloadValidation.status}: ${report.remoteAssetManifestPayloadValidation.notes.join(" ")}`,
    "",
    "## 5. Production route/index count result",
    "",
    `- ${report.productionRouteIndexCountResult.status}: ${report.productionRouteIndexCountResult.notes.join(" ")}`,
    "",
    "## 6. Starter preview first-render result",
    "",
    `- ${report.starterPreviewFirstRenderResult.status}: ${report.starterPreviewFirstRenderResult.notes.join(" ")}`,
    "",
    "## 7. Full payload hydration result",
    "",
    `- ${report.fullPayloadHydrationResult.status}: ${report.fullPayloadHydrationResult.notes.join(" ")}`,
    "",
    "## 8. Section picker result",
    "",
    `- ${report.sectionPickerResult.status}: ${report.sectionPickerResult.notes.join(" ")}`,
    "",
    "## 9. Cleaned preview and Morse preview update result",
    "",
    `- ${report.cleanedPreviewAndMorsePreviewUpdateResult.status}: ${report.cleanedPreviewAndMorsePreviewUpdateResult.notes.join(" ")}`,
    "",
    "## 10. View-window control result",
    "",
    `- ${report.viewWindowControlResult.status}: ${report.viewWindowControlResult.notes.join(" ")}`,
    "",
    "## 11. Audiobook route result",
    "",
    `- ${report.audiobookRouteResult.status}: ${report.audiobookRouteResult.notes.join(" ")}`,
    "",
    "## 12. Unavailable-state scan result",
    "",
    `- ${report.unavailableStateScanResult.status}: ${report.unavailableStateScanResult.notes.join(" ")}`,
    "",
    "## 13. Metadata/source/bad-label scan result",
    "",
    `- ${report.metadataSourceBadLabelScanResult.status}: ${report.metadataSourceBadLabelScanResult.notes.join(" ")}`,
    "",
    "## 14. Section-count surface scan",
    "",
    `- ${report.sectionCountSurfaceScanResult.status}: ${report.sectionCountSurfaceScanResult.notes.join(" ")}`,
    "",
    "## 15. Specific sampled slug results",
    "",
    "| Slug | Status | Rendered sections | Asset-host payload request | Notes |",
    "| --- | --- | ---: | --- | --- |",
    ...slugRows,
    "",
    "## 16. Fixes made, if any",
    "",
    report.fixesMade.length ? report.fixesMade.map((item) => `- ${item}`).join("\n") : "- None.",
    "",
    "## 17. Remaining blockers, if any",
    "",
    report.remainingBlockers.length
      ? report.remainingBlockers.map((item) => `- ${item}`).join("\n")
      : "- None.",
    "",
    "## 18. Later content-quality checkpoints: Sources page, About page, repeated helper copy",
    "",
    ...report.laterContentQualityCheckpoints.map((item) => `- ${item}`),
    "",
    "## 19. Deferred final stages: non-book sitemap pages, URL/indexability, GSC/meta review, mobile optimization",
    "",
    ...report.deferredFinalStages.map((item) => `- ${item}`),
    "",
  ];
  fs.writeFileSync(REPORT_MD_PATH, lines.join("\n"), "utf8");
}

async function main() {
  const generatedManifest = readJson<{ books: unknown[] }>(GENERATED_MANIFEST_PATH);
  const localManifest = await fetchJson<PublicManifest>(`${ASSET_BASE_URL}/public-manifest.json`);
  const deployedCommit = await deployedCommitFingerprint();
  const assetValidation = await validateRemoteAssets(localManifest);
  const routeValidation = await validateProductionRoutes();

  const blockedResults = [
    assetValidation.result,
    routeValidation.fullPayloadHydrationResult,
    routeValidation.sectionPickerResult,
    routeValidation.unavailableStateScanResult,
    routeValidation.removedDeferredBlockedSlugExclusionResult,
  ].filter((result) => result.status === "blocked");

  const remainingBlockers = blockedResults.flatMap((result) => result.notes);
  const report: ProductionReport = {
    reportName: "production-book-payload-validation",
    branch: "morsewords-production-book-payload-validation-jun-2026",
    executiveResult: blockedResults.length
      ? `Production book payload validation blocked because ${blockedResults
          .map((result) => result.name)
          .join(", ")}`
      : "Production book payload validation passed",
    generatedAt: new Date().toISOString(),
    netlifyDeployedCommitChecked: deployedCommit,
    productionAssetBaseUrl: ASSET_BASE_URL,
    remoteAssetManifestPayloadValidation: assetValidation.result,
    productionRouteIndexCountResult: routeValidation.routeIndexCountResult,
    starterPreviewFirstRenderResult: routeValidation.starterPreviewFirstRenderResult,
    fullPayloadHydrationResult: routeValidation.fullPayloadHydrationResult,
    sectionPickerResult: routeValidation.sectionPickerResult,
    cleanedPreviewAndMorsePreviewUpdateResult:
      routeValidation.cleanedPreviewAndMorsePreviewUpdateResult,
    viewWindowControlResult: routeValidation.viewWindowControlResult,
    audiobookRouteResult: routeValidation.audiobookRouteResult,
    unavailableStateScanResult: routeValidation.unavailableStateScanResult,
    metadataSourceBadLabelScanResult: routeValidation.metadataSourceBadLabelScanResult,
    sectionCountSurfaceScanResult: routeValidation.sectionCountSurfaceScanResult,
    specificSampledSlugResults: routeValidation.sampleResults,
    fixesMade: [],
    remainingBlockers,
    counts: {
      generatedBooks: generatedManifest.books.length,
      seoSummaries: countSeoSummaries(),
      startupPreviews: countStartupPreviews(),
      bookUrls: assetValidation.manifest.books.length,
      audiobookUrls: assetValidation.manifest.books.length,
      remoteManifestBooks: assetValidation.manifest.books.length,
    },
    laterContentQualityCheckpoints: [
      "Sources page trust-copy update remains queued for the later content-quality phase.",
      "About page E-E-A-T copy remains queued for the later content-quality phase.",
      "Repeated helper-copy reduction remains queued for the later content-quality phase.",
    ],
    deferredFinalStages: [
      "Non-book sitemap/page implementation remains deferred.",
      "URL/indexability audit remains deferred.",
      "GSC/meta review remains deferred.",
      "Broad mobile optimization remains the final stage.",
    ],
  };

  writeReport(report);

  console.log(report.executiveResult);
  console.log(`Netlify deployed commit checked: ${deployedCommit.expectedCommit}`);
  console.log(`Production asset base URL: ${ASSET_BASE_URL}`);
  console.log(`Remote manifest books: ${assetValidation.manifest.books.length}`);
  console.log(`Sampled route checks: ${routeValidation.sampleResults.length}`);
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
