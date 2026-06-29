import fs from "node:fs";
import http from "node:http";
import net from "node:net";
import path from "node:path";
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chromium, type Browser, type Page } from "playwright";

declare const document: any;
declare const HTMLInputElement: any;
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

type PublicBook = {
  slug: string;
  title: string;
  author: string[];
  stats: {
    wordCount: number;
    sectionCount: number;
  };
  sections: Array<{
    sectionId: string;
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

type ValidationReport = {
  reportName: "post-export-book-route-validation";
  branch: "morsewords-post-export-book-route-validation-jun-2026";
  executiveResult: string;
  localServedExportBaseUrl: string;
  remoteCloudflareValidationStatus: CheckResult;
  localServedManifestPayloadValidation: CheckResult;
  routeIndexCountResult: CheckResult;
  removedDeferredBlockedSlugExclusionResult: CheckResult;
  starterPreviewFirstRenderResult: CheckResult;
  fullExportPayloadHydrationResult: CheckResult;
  readerChapterSectionPickerResult: CheckResult;
  cleanedPreviewAndMorsePreviewUpdateResult: CheckResult;
  viewWindowControlResult: CheckResult;
  audiobookRouteResult: CheckResult;
  metadataSourceBadLabelSurfaceScan: CheckResult;
  sectionCountSurfaceScan: CheckResult;
  fixesMade: string[];
  remainingBlockers: string[];
  counts: {
    generatedBooks: number;
    seoSummaries: number;
    startupPreviews: number;
    bookUrls: number;
    audiobookUrls: number;
    exportFiles: number;
    bookPayloads: number;
    manifestFiles: number;
  };
  sampledRoutes: string[];
  representativeSectionChecks: Array<{
    slug: string;
    expectedSections: number;
    actualSections: number;
    status: "pass" | "blocked";
  }>;
  laterContentQualityCheckpoints: string[];
  deferredFinalStages: string[];
};

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const EXPORT_ROOT = path.join(REPO_ROOT, "app/client/assets/books/cloudflare-export");
const PUBLIC_MANIFEST_PATH = path.join(EXPORT_ROOT, "public-manifest.json");
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
  "app/client/assets/books/audit-reports/post-export-book-route-validation",
);
const REPORT_JSON_PATH = path.join(REPORT_ROOT, "post-export-book-route-validation.json");
const REPORT_MD_PATH = path.join(REPORT_ROOT, "post-export-book-route-validation.md");

const EXPECTED_BOOK_COUNT = 519;
const EXPECTED_EXPORT_FILE_COUNT = 521;
const EXPECTED_MANIFEST_FILE_COUNT = 2;
const BAD_LABEL_PATTERN =
  /Unknown author|Unknown source|Source unavailable|Metadata unavailable|0 sections|Sections: 0/i;

const SAMPLE_BOOK_SLUGS = [
  "walden",
  "the-bottle-imp",
  "the-masque-of-the-red-death",
  "the-happy-prince",
  "the-leavenworth-case",
  "the-jungle-book",
] as const;

const SECTION_EXPECTATIONS = new Map([
  ["the-leavenworth-case", 39],
  ["walden", 18],
  ["the-bottle-imp", 1],
]);

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

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function note(name: string, notes: string[] = []): CheckResult {
  return { name, status: "pass", notes };
}

function blocked(name: string, notes: string[]): CheckResult {
  return { name, status: "blocked", notes };
}

function walkFiles(root: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(fullPath));
    if (entry.isFile()) files.push(fullPath);
  }
  return files;
}

function contentTypeFor(filePath: string) {
  if (filePath.endsWith(".json")) return "application/json; charset=utf-8";
  if (filePath.endsWith(".txt")) return "text/plain; charset=utf-8";
  return "application/octet-stream";
}

async function listen(server: http.Server, port = 0) {
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => {
      server.off("error", reject);
      resolve();
    });
  });
  const address = server.address();
  assert(address && typeof address === "object", "Server did not expose a TCP address.");
  return address.port;
}

function closeServer(server: http.Server) {
  return new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

async function startExportServer() {
  const requestedPaths: string[] = [];
  let delayedPath: string | null = null;
  let releaseDelayedPath: (() => void) | null = null;
  let delayedPathPromise: Promise<void> | null = null;

  const server = http.createServer(async (request, response) => {
    const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
    const normalizedPath = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, "");
    requestedPaths.push(`/${normalizedPath}`);

    if (delayedPath && `/${normalizedPath}` === delayedPath && delayedPathPromise) {
      await delayedPathPromise;
    }

    const resolvedPath = path.resolve(EXPORT_ROOT, normalizedPath || "public-manifest.json");
    if (!resolvedPath.startsWith(EXPORT_ROOT)) {
      response.writeHead(403).end("Forbidden");
      return;
    }
    if (!fs.existsSync(resolvedPath) || fs.statSync(resolvedPath).isDirectory()) {
      response.writeHead(404).end("Not found");
      return;
    }
    response.writeHead(200, {
      "access-control-allow-origin": "*",
      "cache-control": "no-store",
      "content-type": contentTypeFor(resolvedPath),
    });
    fs.createReadStream(resolvedPath).pipe(response);
  });

  const port = await listen(server);
  return {
    baseUrl: `http://127.0.0.1:${port}`,
    requestedPaths,
    delayPath(pathName: string) {
      delayedPath = pathName;
      delayedPathPromise = new Promise<void>((resolve) => {
        releaseDelayedPath = resolve;
      });
    },
    releasePath() {
      releaseDelayedPath?.();
      delayedPath = null;
      delayedPathPromise = null;
      releaseDelayedPath = null;
    },
    close: () => closeServer(server),
  };
}

function getFreePort() {
  const server = net.createServer();
  return new Promise<number>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      assert(address && typeof address === "object", "Could not allocate a TCP port.");
      const port = address.port;
      server.close((error) => (error ? reject(error) : resolve(port)));
    });
  });
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForHttp(url: string, timeoutMs: number) {
  const started = Date.now();
  let lastError: unknown = null;
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
      lastError = new Error(`${url} returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await wait(500);
  }
  throw lastError instanceof Error ? lastError : new Error(`Timed out waiting for ${url}`);
}

async function runCommand(command: string, args: string[], env: NodeJS.ProcessEnv) {
  const child = spawn(command, args, {
    cwd: REPO_ROOT,
    env,
    shell: false,
  });
  let stdout = "";
  let stderr = "";
  child.stdout.on("data", (chunk) => {
    stdout += String(chunk);
  });
  child.stderr.on("data", (chunk) => {
    stderr += String(chunk);
  });
  const code = await new Promise<number | null>((resolve) => {
    child.on("close", resolve);
  });
  if (code !== 0) {
    throw new Error(
      `Command failed: ${command} ${args.join(" ")}\n${stdout}\n${stderr}`.trim(),
    );
  }
  return { stdout, stderr };
}

async function startAppServer(contentBaseUrl: string) {
  const port = await getFreePort();
  const child = spawn(process.execPath, ["server.js"], {
    cwd: REPO_ROOT,
    env: {
      ...process.env,
      NODE_ENV: "development",
      MORSEWORDS_DISABLE_DEV_HMR: "1",
      PORT: String(port),
      VITE_MORSE_BOOK_CONTENT_BASE_URL: contentBaseUrl,
    },
    shell: false,
  });
  let output = "";
  child.stdout.on("data", (chunk) => {
    output += String(chunk);
  });
  child.stderr.on("data", (chunk) => {
    output += String(chunk);
  });
  const baseUrl = `http://127.0.0.1:${port}`;
  await waitForHttp(baseUrl, 120_000).catch((error) => {
    child.kill();
    throw new Error(`${error instanceof Error ? error.message : String(error)}\n${output}`);
  });
  return {
    baseUrl,
    child,
    stop: () => stopProcess(child),
  };
}

async function stopProcess(child: ChildProcessWithoutNullStreams) {
  if (child.exitCode !== null || child.killed) return;
  child.kill();
  await Promise.race([
    new Promise<void>((resolve) => child.once("close", () => resolve())),
    wait(5_000).then(() => undefined),
  ]);
}

async function goto(page: Page, baseUrl: string, route: string) {
  const response = await page.goto(`${baseUrl}${route}`, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  assert(response?.ok(), `${route} returned ${response?.status() ?? "no response"}`);
  await page.waitForSelector("main, body", { timeout: 30_000 });
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
        ?.getAttribute("data-mw-morse-book-settings-restored") === "true",
    undefined,
    { timeout: 90_000 },
  );
  await page.waitForFunction(
    () => !document.querySelector("[data-mw-morse-book-loading-sections]"),
    undefined,
    { timeout: 90_000 },
  );
}

async function pageText(page: Page) {
  return (await page.locator("body").innerText({ timeout: 30_000 })).replace(/\s+/g, " ");
}

async function selectedSectionIds(page: Page) {
  return page.$$eval("[data-mw-morse-book-section-select]", (nodes) =>
    nodes
      .map((node) => node as any)
      .filter((node) => node.checked)
      .map((node) => node.getAttribute("data-mw-morse-book-section-select") ?? ""),
  );
}

async function sectionRowCount(page: Page) {
  return page.locator("[data-mw-morse-book-section-row]").count();
}

async function assertNoBadSurfaceLabels(page: Page, route: string) {
  const text = await pageText(page);
  assert(!BAD_LABEL_PATTERN.test(text), `${route} exposes a blocked label.`);
}

async function routeValidation(appBaseUrl: string, exportServer: Awaited<ReturnType<typeof startExportServer>>) {
  console.log("Route validation: launching browser.");
  const browser: Browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.route("**/*", (route) => {
    const url = new URL(route.request().url());
    const isLocal =
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "::1";
    if (!isLocal && (url.protocol === "http:" || url.protocol === "https:")) {
      return route.abort("blockedbyclient");
    }
    return route.continue();
  });

  const sampledRoutes: string[] = [];
  const representativeSectionChecks: ValidationReport["representativeSectionChecks"] = [];

  try {
    const indexPage = await context.newPage();
    console.log("Route validation: checking listing counts.");
    await goto(indexPage, appBaseUrl, "/morse-code-books");
    const booksCountText = await indexPage.getByTestId("morse-books-result-count").innerText();
    assert(/\b519\b/.test(booksCountText), `/morse-code-books count was ${booksCountText}`);
    await assertNoBadSurfaceLabels(indexPage, "/morse-code-books");
    assert(!/0 sections|Sections: 0/i.test(await pageText(indexPage)), "Book listing exposes 0 sections.");
    sampledRoutes.push("/morse-code-books");

    await goto(indexPage, appBaseUrl, "/morse-code-audiobooks");
    const audiobooksCountText = await indexPage
      .getByTestId("morse-audiobooks-result-count")
      .innerText();
    assert(/\b519\b/.test(audiobooksCountText), `/morse-code-audiobooks count was ${audiobooksCountText}`);
    await assertNoBadSurfaceLabels(indexPage, "/morse-code-audiobooks");
    assert(!/0 sections|Sections: 0/i.test(await pageText(indexPage)), "Audiobook listing exposes 0 sections.");
    sampledRoutes.push("/morse-code-audiobooks");
    await indexPage.close();

    const previewPage = await context.newPage();
    console.log("Route validation: checking starter preview before hydration.");
    exportServer.delayPath("/books/walden.json");
    await goto(previewPage, appBaseUrl, "/morse-code-books/walden");
    sampledRoutes.push("/morse-code-books/walden");
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
    assert(starterPreviewText.trim().length > 100, "Starter preview did not render before hydration.");
    exportServer.releasePath();
    await waitForBookReady(previewPage);
    assert(
      exportServer.requestedPaths.includes("/books/walden.json"),
      "Walden full export payload was not requested from the served export base URL.",
    );
    await assertNoBadSurfaceLabels(previewPage, "/morse-code-books/walden");
    await previewPage.close();

    for (const slug of SAMPLE_BOOK_SLUGS) {
      console.log(`Route validation: checking book route ${slug}.`);
      const page = await context.newPage();
      const route = `/morse-code-books/${slug}`;
      await goto(page, appBaseUrl, route);
      sampledRoutes.push(route);
      await waitForBookReady(page);
      await assertNoBadSurfaceLabels(page, route);
      assert(
        exportServer.requestedPaths.includes(`/books/${slug}.json`),
        `${slug} was not hydrated from the served export payload.`,
      );
      const expectedSections = SECTION_EXPECTATIONS.get(slug);
      if (expectedSections) {
        const actualSections = await sectionRowCount(page);
        representativeSectionChecks.push({
          slug,
          expectedSections,
          actualSections,
          status: actualSections === expectedSections ? "pass" : "blocked",
        });
        assert(
          actualSections === expectedSections,
          `${slug} rendered ${actualSections} sections, expected ${expectedSections}.`,
        );
      }
      await page.close();
    }

    const interactionPage = await context.newPage();
    console.log("Route validation: checking section picker preview updates.");
    await goto(interactionPage, appBaseUrl, "/morse-code-books/treasure-island");
    await waitForBookReady(interactionPage);
    const selectedBefore = await selectedSectionIds(interactionPage);
    assert(selectedBefore.length >= 2, "Treasure Island did not expose multiple selected sections.");
    const sourceSectionsBefore =
      (await interactionPage
        .locator("[data-mw-morse-book-translator-source-sections]")
        .getAttribute("data-mw-morse-book-translator-source-sections")) ?? "";
    console.log(`Route validation: Treasure Island selected before ${selectedBefore.slice(0, 4).join(",")} (${selectedBefore.length} total).`);
    console.log(`Route validation: Treasure Island source sections before ${sourceSectionsBefore.slice(0, 120)}.`);
    console.log(
      `Route validation: Treasure Island source preview before ${(await interactionPage
        .locator("[data-mw-morse-book-source-preview]")
        .innerText()).slice(0, 120).replace(/\s+/g, " ")}.`,
    );
    const sourceBefore = await interactionPage
      .locator("[data-mw-morse-book-source-preview]")
      .innerText();
    const morseBefore = await interactionPage
      .locator("[data-mw-morse-book-morse-preview]")
      .innerText();
    const firstSection = selectedBefore[0];
    await interactionPage.waitForFunction(
      (id) => {
        const value =
          document
            .querySelector("[data-mw-morse-book-translator-source-sections]")
            ?.getAttribute("data-mw-morse-book-translator-source-sections") ?? "";
        return value.split(",").includes(id as string);
      },
      firstSection,
      { timeout: 30_000 },
    );
    await interactionPage.locator(`[data-mw-morse-book-section-select='${firstSection}']`).uncheck();
    await interactionPage.waitForFunction(
      (id) => {
        const value =
          document
            .querySelector("[data-mw-morse-book-translator-source-sections]")
            ?.getAttribute("data-mw-morse-book-translator-source-sections") ?? "";
        return !value.split(",").includes(id as string);
      },
      firstSection,
      { timeout: 30_000 },
    );
    const sourceAfter = await interactionPage
      .locator("[data-mw-morse-book-source-preview]")
      .innerText();
    const morseAfter = await interactionPage
      .locator("[data-mw-morse-book-morse-preview]")
      .innerText();
    assert(sourceBefore !== sourceAfter, "Cleaned preview did not update after section change.");
    assert(morseBefore !== morseAfter, "Morse preview did not update after section change.");
    await interactionPage.close();

    const audiobookPage = await context.newPage();
    console.log("Route validation: checking audiobook route controls.");
    await goto(audiobookPage, appBaseUrl, "/morse-code-audiobooks/walden");
    sampledRoutes.push("/morse-code-audiobooks/walden");
    await waitForBookReady(audiobookPage);
    await assertNoBadSurfaceLabels(audiobookPage, "/morse-code-audiobooks/walden");
    const liveSectionSelect = audiobookPage.getByTestId("morse-book-live-section-select");
    await liveSectionSelect.waitFor({ state: "visible", timeout: 30_000 });
    const audiobookOptionValues = await liveSectionSelect.locator("option").evaluateAll((options) =>
      options.map((option) => (option as HTMLOptionElement).value),
    );
    assert(audiobookOptionValues.length === 18, `Walden audiobook exposed ${audiobookOptionValues.length} live sections.`);
    if (audiobookOptionValues.length > 1) {
      await liveSectionSelect.selectOption(audiobookOptionValues[1]);
      const selectedLiveSection = await liveSectionSelect.inputValue();
      assert(
        selectedLiveSection === audiobookOptionValues[1],
        "Audiobook live section control did not retain the selected served-export section.",
      );
    }
    await audiobookPage.close();

    for (const slug of REMOVED_OR_DEFERRED_SOURCE_RISK_SLUGS) {
      console.log(`Route validation: checking deferred slug ${slug}.`);
      const page = await context.newPage();
      const response = await page.goto(`${appBaseUrl}/morse-code-books/${slug}`, {
        waitUntil: "domcontentloaded",
        timeout: 45_000,
      });
      assert(
        response && response.status() >= 400,
        `Removed/deferred slug ${slug} did not return an error status.`,
      );
      await page.close();
    }

    return {
      sampledRoutes,
      representativeSectionChecks,
      routeIndexCountResult: note("Route/index count result", [
        "/morse-code-books shows 519.",
        "/morse-code-audiobooks shows 519.",
      ]),
      removedDeferredBlockedSlugExclusionResult: note(
        "Removed/deferred/blocked slug exclusion result",
        [`Checked ${REMOVED_OR_DEFERRED_SOURCE_RISK_SLUGS.length} deferred/source-risk slugs; all returned error status.`],
      ),
      starterPreviewFirstRenderResult: note("Starter preview first-render result", [
        "Walden rendered starter preview while the full served export payload was intentionally delayed.",
      ]),
      fullExportPayloadHydrationResult: note("Full export payload hydration result", [
        "Sampled routes requested full JSON payloads from the local served export base URL.",
      ]),
      readerChapterSectionPickerResult: note("Reader/chapter/section picker result", [
        "Section rows matched exported section counts for Walden, The Bottle Imp, and The Leavenworth Case.",
      ]),
      cleanedPreviewAndMorsePreviewUpdateResult: note(
        "Cleaned preview and Morse preview update result",
        ["Changing the selected Treasure Island section updated both cleaned text and Morse preview output."],
      ),
      viewWindowControlResult: note("View-window control result", [
        "Audiobook live section control exposed served-export sections and retained the selected section value.",
      ]),
      audiobookRouteResult: note("Audiobook route result", [
        "Walden audiobook route hydrated from served export payload and exposed 18 live sections.",
      ]),
      metadataSourceBadLabelSurfaceScan: note("Metadata/source/bad-label surface scan", [
        "Sampled listing, book, and audiobook surfaces did not expose blocked Unknown/source labels.",
      ]),
      sectionCountSurfaceScan: note("Section-count surface scan", [
        "Sampled listing, book, and audiobook surfaces did not expose 0 sections labels.",
      ]),
    };
  } finally {
    await context.close();
    await browser.close();
  }
}

function validateLocalExportFiles(manifest: PublicManifest) {
  const exportFiles = walkFiles(EXPORT_ROOT);
  const bookPayloads = fs.readdirSync(path.join(EXPORT_ROOT, "books")).filter((name) => name.endsWith(".json"));
  const rootManifests = ["public-manifest.json", "upload-manifest.json"].filter((name) =>
    fs.existsSync(path.join(EXPORT_ROOT, name)),
  );
  const notes: string[] = [];
  if (exportFiles.length !== EXPECTED_EXPORT_FILE_COUNT) {
    notes.push(`Export has ${exportFiles.length} files, expected ${EXPECTED_EXPORT_FILE_COUNT}.`);
  }
  if (bookPayloads.length !== EXPECTED_BOOK_COUNT) {
    notes.push(`Export has ${bookPayloads.length} book payloads, expected ${EXPECTED_BOOK_COUNT}.`);
  }
  if (rootManifests.length !== EXPECTED_MANIFEST_FILE_COUNT) {
    notes.push(`Export has ${rootManifests.length} root manifest files, expected ${EXPECTED_MANIFEST_FILE_COUNT}.`);
  }
  if (manifest.books.length !== EXPECTED_BOOK_COUNT) {
    notes.push(`Public manifest has ${manifest.books.length} books, expected ${EXPECTED_BOOK_COUNT}.`);
  }
  for (const [slug, expectedSections] of SECTION_EXPECTATIONS) {
    const summary = manifest.books.find((book) => book.slug === slug);
    if (!summary) {
      notes.push(`${slug} missing from public manifest.`);
      continue;
    }
    const book = readJson<PublicBook>(path.join(EXPORT_ROOT, summary.bookPath));
    if (book.sections.length !== expectedSections) {
      notes.push(`${slug} payload has ${book.sections.length} sections, expected ${expectedSections}.`);
    }
    const contentLength = book.sections
      .map((section) => section.morseSourceText ?? section.displayText ?? section.content ?? section.text ?? "")
      .join("\n\n")
      .trim().length;
    if (contentLength < 200) notes.push(`${slug} payload does not look like full readable content.`);
  }
  if (notes.length) return blocked("Local served manifest/payload validation result", notes);
  return note("Local served manifest/payload validation result", [
    "Local export exposes 521 files, 519 book payloads, and 2 root manifest files.",
    "Representative payloads contain full readable content.",
  ]);
}

function countSeoSummaries() {
  const seo = readJson<{ summaries: unknown[] }>(SEO_SUMMARIES_PATH);
  return seo.summaries.length;
}

function countStartupPreviews() {
  const manifest = readJson<{ books: unknown[] }>(PREVIEW_MANIFEST_PATH);
  return manifest.books.length;
}

function writeReport(report: ValidationReport) {
  fs.mkdirSync(REPORT_ROOT, { recursive: true });
  fs.writeFileSync(REPORT_JSON_PATH, `${JSON.stringify(report, null, 2)}\n`);

  const lines = [
    "# Post-export book route validation",
    "",
    "## 1. Executive result",
    "",
    report.executiveResult,
    "",
    "## 2. Local served export base URL used",
    "",
    `- ${report.localServedExportBaseUrl}`,
    "",
    "## 3. Remote Cloudflare validation status",
    "",
    `- ${report.remoteCloudflareValidationStatus.status}: ${report.remoteCloudflareValidationStatus.notes.join(" ")}`,
    "",
    "## 4. Local served manifest/payload validation result",
    "",
    `- ${report.localServedManifestPayloadValidation.status}: ${report.localServedManifestPayloadValidation.notes.join(" ")}`,
    "",
    "## 5. Route/index count result",
    "",
    `- ${report.routeIndexCountResult.status}: ${report.routeIndexCountResult.notes.join(" ")}`,
    "",
    "## 6. Removed/deferred/blocked slug exclusion result",
    "",
    `- ${report.removedDeferredBlockedSlugExclusionResult.status}: ${report.removedDeferredBlockedSlugExclusionResult.notes.join(" ")}`,
    "",
    "## 7. Starter preview first-render result",
    "",
    `- ${report.starterPreviewFirstRenderResult.status}: ${report.starterPreviewFirstRenderResult.notes.join(" ")}`,
    "",
    "## 8. Full export payload hydration result",
    "",
    `- ${report.fullExportPayloadHydrationResult.status}: ${report.fullExportPayloadHydrationResult.notes.join(" ")}`,
    "",
    "## 9. Reader/chapter/section picker result",
    "",
    `- ${report.readerChapterSectionPickerResult.status}: ${report.readerChapterSectionPickerResult.notes.join(" ")}`,
    "",
    "## 10. Cleaned preview and Morse preview update result",
    "",
    `- ${report.cleanedPreviewAndMorsePreviewUpdateResult.status}: ${report.cleanedPreviewAndMorsePreviewUpdateResult.notes.join(" ")}`,
    "",
    "## 11. View-window control result",
    "",
    `- ${report.viewWindowControlResult.status}: ${report.viewWindowControlResult.notes.join(" ")}`,
    "",
    "## 12. Audiobook route result",
    "",
    `- ${report.audiobookRouteResult.status}: ${report.audiobookRouteResult.notes.join(" ")}`,
    "",
    "## 13. Metadata/source/bad-label surface scan",
    "",
    `- ${report.metadataSourceBadLabelSurfaceScan.status}: ${report.metadataSourceBadLabelSurfaceScan.notes.join(" ")}`,
    "",
    "## 14. Section-count surface scan",
    "",
    `- ${report.sectionCountSurfaceScan.status}: ${report.sectionCountSurfaceScan.notes.join(" ")}`,
    "",
    "## 15. Fixes made, if any",
    "",
    report.fixesMade.length ? report.fixesMade.map((item) => `- ${item}`).join("\n") : "- None.",
    "",
    "## 16. Remaining blockers, if any",
    "",
    report.remainingBlockers.length
      ? report.remainingBlockers.map((item) => `- ${item}`).join("\n")
      : "- None for local served-export route validation. Real remote Cloudflare validation still requires the served base URL.",
    "",
    "## 17. Later content-quality checkpoints: Sources page, About page, repeated helper copy",
    "",
    ...report.laterContentQualityCheckpoints.map((item) => `- ${item}`),
    "",
    "## 18. Deferred final stages: non-book sitemap pages, URL/indexability, GSC/meta review, mobile optimization",
    "",
    ...report.deferredFinalStages.map((item) => `- ${item}`),
    "",
  ];
  fs.writeFileSync(REPORT_MD_PATH, `${lines.join("\n")}`);
}

async function main() {
  const publicManifest = readJson<PublicManifest>(PUBLIC_MANIFEST_PATH);
  const generatedManifest = readJson<{ books: unknown[] }>(GENERATED_MANIFEST_PATH);
  const localExportFilesResult = validateLocalExportFiles(publicManifest);

  const exportServer = await startExportServer();
  let appServer: Awaited<ReturnType<typeof startAppServer>> | null = null;
  try {
    await runCommand(
      process.execPath,
      ["--experimental-strip-types", "scripts/books/cloudflare-post-upload-validation.ts"],
      {
        ...process.env,
        VITE_MORSE_BOOK_CONTENT_BASE_URL: exportServer.baseUrl,
        PUBLIC_MORSE_BOOK_CONTENT_BASE_URL: "",
      },
    );

    appServer = await startAppServer(exportServer.baseUrl);
    const routeResults = await routeValidation(appServer.baseUrl, exportServer);

    const report: ValidationReport = {
      reportName: "post-export-book-route-validation",
      branch: "morsewords-post-export-book-route-validation-jun-2026",
      executiveResult:
        "Local post-export book route validation passed; remote Cloudflare validation still requires served base URL",
      localServedExportBaseUrl: exportServer.baseUrl,
      remoteCloudflareValidationStatus: blocked("Remote Cloudflare validation status", [
        "Blocked because no real served Cloudflare/R2 base URL is available in this branch.",
        "No remote URL was invented and no remote validation is claimed.",
      ]),
      localServedManifestPayloadValidation: localExportFilesResult,
      ...routeResults,
      fixesMade: [],
      remainingBlockers: [
        "Real remote Cloudflare validation remains blocked until VITE_MORSE_BOOK_CONTENT_BASE_URL or PUBLIC_MORSE_BOOK_CONTENT_BASE_URL is set to the actual served book content base URL.",
      ],
      counts: {
        generatedBooks: generatedManifest.books.length,
        seoSummaries: countSeoSummaries(),
        startupPreviews: countStartupPreviews(),
        bookUrls: publicManifest.books.length,
        audiobookUrls: publicManifest.books.length,
        exportFiles: walkFiles(EXPORT_ROOT).length,
        bookPayloads: fs.readdirSync(path.join(EXPORT_ROOT, "books")).filter((name) => name.endsWith(".json")).length,
        manifestFiles: EXPECTED_MANIFEST_FILE_COUNT,
      },
      laterContentQualityCheckpoints: [
        "Sources page trust-copy update remains a later content-quality task.",
        "About page E-E-A-T copy remains a later content-quality task.",
        "Repeated helper-copy reduction remains a later content-quality task.",
      ],
      deferredFinalStages: [
        "Non-book sitemap/page implementation remains deferred.",
        "URL/indexability audit remains deferred.",
        "GSC/meta review remains deferred.",
        "Broad mobile optimization remains the final stage.",
      ],
    };

    const blockedResults = Object.values(report).filter(
      (value): value is CheckResult =>
        Boolean(value) &&
        typeof value === "object" &&
        "status" in value &&
        (value as CheckResult).status === "blocked" &&
        (value as CheckResult).name !== "Remote Cloudflare validation status",
    );
    if (blockedResults.length) {
      report.executiveResult = `Post-export book route validation blocked because ${blockedResults
        .map((result) => result.name)
        .join(", ")}`;
    }

    writeReport(report);

    console.log(report.executiveResult);
    console.log(`Local served export base URL: ${exportServer.baseUrl}`);
    console.log("Remote Cloudflare validation status: blocked, no served base URL available.");
    console.log(`Generated books: ${report.counts.generatedBooks}`);
    console.log(`SEO summaries: ${report.counts.seoSummaries}`);
    console.log(`Startup previews: ${report.counts.startupPreviews}`);
    console.log(`Book URLs: ${report.counts.bookUrls}`);
    console.log(`Audiobook URLs: ${report.counts.audiobookUrls}`);
    console.log(`Sampled routes: ${report.sampledRoutes.length}`);
    console.log(`Report: ${path.relative(REPO_ROOT, REPORT_JSON_PATH)}`);
  } finally {
    await appServer?.stop();
    exportServer.releasePath();
    await exportServer.close();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
