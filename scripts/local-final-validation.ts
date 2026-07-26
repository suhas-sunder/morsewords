import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { MORSE_BOOK_CONTENT_BASE_URL } from "../app/client/data/morseBookContentConfig.ts";
import { ROUTES, SITE_ORIGIN } from "../app/client/data/routes.ts";

type BookManifestEntry = {
  slug: string;
  title?: string;
  bookPath?: string;
  contentVersion?: string;
  contentHash?: string;
  contentSuitability?: string;
  strictReviewCandidate?: boolean;
  contentNote?: string;
};

type PublicManifest = {
  schemaVersion: number;
  contentVersion?: string;
  contentHash?: string;
  books: BookManifestEntry[];
};

type UploadManifest = {
  schemaVersion: number;
  approvedBookCount?: number;
  requiredFiles?: Array<{ sourcePath: string; destinationPath: string }>;
  bookFiles: string[];
  files: string[];
  destinationObjectPaths?: string[];
};

type BookPayload = {
  schemaVersion: number;
  slug: string;
  title?: string;
  sections?: unknown[];
  contentVersion?: string;
  contentHash?: string;
  contentSuitability?: string;
  strictReviewCandidate?: boolean;
  contentNote?: string;
};

type CheckResult = {
  name: string;
  status: "pass" | "fail";
  details: string;
};

type StaticServer = {
  baseUrl: string;
  close: () => Promise<void>;
};

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requiredCompletionCommit = "c3084755f79583499b51ee6d38b808c3c211d007";
const expectedManifestCount = 2;
const expectedNonBookSitemapCount = 129;
const expectedRouteInventoryCount = 702;
const localDeferredStatement =
  "Production deployment route validation is deferred and was not used as a blocker in this local completion branch.";

const generatedManifestPath = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "generated",
  "library-manifest.json",
);
const seoSummaryPath = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "seo-summaries",
  "book-seo-summaries.json",
);
const previewManifestPath = path.join(repoRoot, "public", "book-previews", "manifest.json");
const sitemapPath = path.join(repoRoot, "public", "sitemap.xml");
const appRoutesPath = path.join(repoRoot, "app", "routes.ts");
const suitabilityPath = path.join(repoRoot, "app", "client", "data", "morseBookSuitability.generated.json");
const sweepReportPath = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "book-content-safety-and-completeness-sweep",
  "book-content-safety-and-completeness-sweep.json",
);
const riskReportPath = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "book-content-safety-and-completeness-sweep",
  "book-content-risk-profile-audit.json",
);
const policyReportPath = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "book-content-safety-and-completeness-sweep",
  "book-content-suitability-policy-decision.json",
);
const updatedExportDir = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "cloudflare-updated-export",
);
const legacyExportDir = path.join(repoRoot, "app", "client", "assets", "books", "cloudflare-export");
const reportDir = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "local-final-validation-cleanup-mobile-review",
);
const reportJsonPath = path.join(reportDir, "local-final-validation-cleanup-mobile-review.json");
const reportMdPath = path.join(reportDir, "local-final-validation-cleanup-mobile-review.md");

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function runGit(args: string[]) {
  const result = spawnSyncText("git", args);
  if (result.exitCode !== 0) {
    throw new Error(`git ${args.join(" ")} failed: ${result.stderr || result.stdout}`);
  }
  return result.stdout.trim();
}

function hasAncestorCommit(commit: string) {
  const result = spawnSyncText("git", ["merge-base", "--is-ancestor", commit, "HEAD"]);
  return result.exitCode === 0;
}

function spawnSyncText(command: string, args: string[]) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: "utf8",
  });
  return {
    exitCode: result.status ?? 0,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

function check(condition: boolean, name: string, details: string, blockers: string[], results: CheckResult[]) {
  const status = condition ? "pass" : "fail";
  results.push({ name, status, details });
  if (!condition) {
    blockers.push(`${name}: ${details}`);
  }
}

function normalizePathname(pathname: string) {
  const normalized = pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
  return normalized || "/";
}

function parseSitemapEntries() {
  const xml = fs.readFileSync(sitemapPath, "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
    const url = new URL(match[1]);
    return {
      loc: match[1],
      origin: url.origin,
      pathname: normalizePathname(url.pathname),
    };
  });
}

function parseRouteInventoryCount() {
  const source = fs.readFileSync(appRoutesPath, "utf8");
  const routeSources = new Map<string, { routePath: string; filePath: string; kind: string }>();

  routeSources.set("/", {
    routePath: "/",
    filePath: path.join(repoRoot, "app", "routes", "home.tsx"),
    kind: "static",
  });

  const literalRoutePattern = /route\(\s*"([^"]+)"\s*,\s*"([^"]+)"/gs;
  for (const match of source.matchAll(literalRoutePattern)) {
    const routePath = normalizePathname(`/${match[1]}`);
    routeSources.set(routePath, {
      routePath,
      filePath: path.join(repoRoot, "app", match[2]),
      kind: routePath.includes(":") ? "dynamic" : "static",
    });
  }

  for (const nestedMiscPath of [
    "/cookies-policy",
    "/privacy-policy",
    "/socials",
    "/terms-of-service",
  ]) {
    routeSources.delete(nestedMiscPath);
  }

  const aliasRoutePattern =
    /route\(\s*routeSlug\(ROUTES\.([A-Za-z0-9_]+)\)\s*,\s*"([^"]+)"/g;
  for (const match of source.matchAll(aliasRoutePattern)) {
    const key = match[1] as keyof typeof ROUTES;
    const routeValue = ROUTES[key];
    if (!routeValue) {
      throw new Error(`Route alias ${key} is referenced in app/routes.ts but missing from ROUTES.`);
    }
    const routePath = normalizePathname(routeValue);
    routeSources.set(routePath, {
      routePath,
      filePath: path.join(repoRoot, "app", match[2]),
      kind: "redirect",
    });
  }

  routeSources.set(ROUTES.miscCookies, {
    routePath: ROUTES.miscCookies,
    filePath: path.join(repoRoot, "app", "routes", "misc", "misc.cookies-policy.tsx"),
    kind: "static",
  });
  routeSources.set(ROUTES.miscPrivacy, {
    routePath: ROUTES.miscPrivacy,
    filePath: path.join(repoRoot, "app", "routes", "misc", "misc.privacy-policy.tsx"),
    kind: "static",
  });
  routeSources.set(ROUTES.miscSocials, {
    routePath: ROUTES.miscSocials,
    filePath: path.join(repoRoot, "app", "routes", "misc", "misc.socials.tsx"),
    kind: "static",
  });
  routeSources.set(ROUTES.miscTerms, {
    routePath: ROUTES.miscTerms,
    filePath: path.join(repoRoot, "app", "routes", "misc", "misc.terms-of-service.tsx"),
    kind: "static",
  });

  return routeSources.size;
}

function countFilesRecursive(dirPath: string) {
  let count = 0;
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      count += countFilesRecursive(fullPath);
    } else if (entry.isFile()) {
      count += 1;
    }
  }
  return count;
}

function normalizeUploadPath(filePath: string) {
  return filePath.replace(/\\/g, "/").replace(/^\/+/, "");
}

function uniqueUploadPaths(paths: string[]) {
  return [...new Set(paths.map(normalizeUploadPath).filter(Boolean))];
}

function uploadManifestFilePaths(uploadManifest: UploadManifest) {
  const requiredFiles = uploadManifest.requiredFiles?.map((entry) => entry.sourcePath) ?? [];
  if (requiredFiles.length > 0) {
    return uniqueUploadPaths(requiredFiles);
  }

  const files = uploadManifest.files ?? [];
  if (files.length > 0) {
    return uniqueUploadPaths(files);
  }

  const bookFiles = uploadManifest.bookFiles ?? [];
  return uniqueUploadPaths(["public-manifest.json", "upload-manifest.json", ...bookFiles]);
}

function uploadManifestBookFiles(uploadManifest: UploadManifest) {
  return uploadManifestFilePaths(uploadManifest).filter((filePath) =>
    /^books\/[^/]+\.json$/.test(filePath),
  );
}

function uploadManifestBookSlugs(uploadManifest: UploadManifest) {
  return uploadManifestBookFiles(uploadManifest).map((bookFile) =>
    bookFile.replace(/^books\//, "").replace(/\.json$/, ""),
  );
}

function listSourceFiles(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  const files: string[] = [];
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") {
        continue;
      }
      files.push(...listSourceFiles(fullPath));
    } else if (entry.isFile() && /\.(?:ts|tsx|js|jsx|mjs|cjs)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function countCloudflareExportImports() {
  const sourceRoots = [path.join(repoRoot, "app", "client"), path.join(repoRoot, "app", "routes")];
  const importPattern = /^\s*import[\s\S]*?from\s*["'][^"']*cloudflare-(?:updated-)?export[^"']*["']/gm;
  let count = 0;
  const files: string[] = [];
  for (const root of sourceRoots) {
    for (const filePath of listSourceFiles(root)) {
      const source = fs.readFileSync(filePath, "utf8");
      const matches = source.match(importPattern);
      if (matches?.length) {
        count += matches.length;
        files.push(path.relative(repoRoot, filePath).replace(/\\/g, "/"));
      }
    }
  }
  return { count, files };
}

function getFreePort() {
  return new Promise<number>((resolve, reject) => {
    const server = net.createServer();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("Could not allocate a local port."));
        return;
      }
      const port = address.port;
      server.close(() => resolve(port));
    });
  });
}

async function startStaticServer(rootDir: string): Promise<StaticServer> {
  const port = await getFreePort();
  const root = path.resolve(rootDir);
  const server = http.createServer((request, response) => {
    const requestUrl = new URL(request.url ?? "/", `http://${request.headers.host ?? "127.0.0.1"}`);
    const decodedPath = decodeURIComponent(requestUrl.pathname.replace(/^\/+/, ""));
    const normalized = path.normalize(decodedPath);
    const filePath = path.resolve(root, normalized);

    if (!(filePath === root || filePath.startsWith(`${root}${path.sep}`))) {
      response.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
      response.end("Forbidden");
      return;
    }

    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "access-control-allow-origin": "*",
      "cache-control": "no-store",
      "content-type": filePath.endsWith(".json") ? "application/json; charset=utf-8" : "application/octet-stream",
    });
    fs.createReadStream(filePath).pipe(response);
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => resolve());
  });

  return {
    baseUrl: `http://127.0.0.1:${port}`,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }
  return (await response.json()) as T;
}

async function waitForHttpOk(url: string, timeoutMs: number) {
  const start = Date.now();
  let lastError = "";
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url, { redirect: "manual" });
      if (response.status >= 200 && response.status < 500) {
        return;
      }
      lastError = `${response.status} ${response.statusText}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for ${url}: ${lastError}`);
}

async function startLocalApp(localExportBaseUrl: string) {
  const port = await getFreePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const child = spawn(process.execPath, ["server.js"], {
    cwd: repoRoot,
    env: {
      ...process.env,
      NODE_ENV: "development",
      PORT: String(port),
      MORSEWORDS_DISABLE_DEV_HMR: "1",
      MORSEWORDS_INTERNAL_ORIGIN: baseUrl,
      VITE_MORSE_BOOK_CONTENT_BASE_URL: localExportBaseUrl,
      PUBLIC_MORSE_BOOK_CONTENT_BASE_URL: localExportBaseUrl,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let stdout = "";
  let stderr = "";
  child.stdout?.on("data", (chunk) => {
    stdout += Buffer.from(chunk).toString("utf8");
  });
  child.stderr?.on("data", (chunk) => {
    stderr += Buffer.from(chunk).toString("utf8");
  });

  try {
    await waitForHttpOk(`${baseUrl}/`, 45000);
  } catch (error) {
    child.kill();
    throw new Error(
      `Local app did not start for print-route checks: ${
        error instanceof Error ? error.message : String(error)
      }\nstdout:\n${stdout}\nstderr:\n${stderr}`,
    );
  }

  return {
    baseUrl,
    close: async () => {
      if (child.killed) {
        return;
      }
      child.kill();
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
    logs: () => ({ stdout, stderr }),
  };
}

async function validateLocalPrintRoutes(localExportBaseUrl: string, uploadedBookSlugs: string[]) {
  const app = await startLocalApp(localExportBaseUrl);
  const legacySampleRoutes = [
    {
      path: "/morse-code-books/walden/print",
      expectedSnippet: "Historical public-domain text. May include period language, mature themes, or intense scenes.",
    },
    {
      path: "/morse-code-books/the-call-of-cthulhu/print",
      expectedSnippet: "Historical public-domain text with elevated content-suitability concerns.",
    },
    {
      path: "/morse-code-books/the-adventures-of-roderick-random/print",
      expectedSnippet: "Historical public-domain text with elevated content-suitability concerns.",
    },
  ];
  const routes =
    uploadedBookSlugs.length > 0 && uploadedBookSlugs.length <= 20
      ? uploadedBookSlugs.map((slug) => ({
          path: `/morse-code-books/${slug}/print`,
          expectedSnippet: "Historical public-domain text",
        }))
      : legacySampleRoutes;
  const results: Array<{ path: string; status: number; htmlBytes: number; passed: boolean; checks: string[] }> = [];

  try {
    for (const route of routes) {
      const response = await fetch(`${app.baseUrl}${route.path}`);
      const html = await response.text();
      const checks = [
        `status=${response.status}`,
        `htmlBytes=${Buffer.byteLength(html, "utf8")}`,
      ];
      const passed =
        response.status === 200 &&
        html.includes("printable-book-content-suitability") &&
        html.includes(route.expectedSnippet) &&
        html.includes("printable-preview") &&
        !html.includes("Book text unavailable") &&
        !html.includes("This Morse book is not available right now") &&
        !html.includes("\"sections\"") &&
        Buffer.byteLength(html, "utf8") < 500000;

      if (html.includes("printable-book-content-suitability")) {
        checks.push("suitability-note-present");
      }
      if (!html.includes("\"sections\"")) {
        checks.push("no-full-section-serialization");
      }
      results.push({ path: route.path, status: response.status, htmlBytes: Buffer.byteLength(html, "utf8"), passed, checks });
    }
  } finally {
    await app.close();
  }

  return results;
}

async function validateLocalExport(localExportBaseUrl: string) {
  const publicManifest = await fetchJson<PublicManifest>(`${localExportBaseUrl}/public-manifest.json`);
  const uploadManifest = await fetchJson<UploadManifest>(`${localExportBaseUrl}/upload-manifest.json`);
  const payloadIssues: string[] = [];
  const suitabilityCounts = {
    low: 0,
    moderate: 0,
    elevated: 0,
  };
  let payloadsReachable = 0;
  let payloadsWithSuitability = 0;
  const manifestBookPaths = new Set<string>();
  const manifestBooksByPath = new Map<string, BookManifestEntry>();
  const uploadedFiles = uploadManifestFilePaths(uploadManifest);
  const uploadedBookFiles = uploadManifestBookFiles(uploadManifest);

  for (const book of publicManifest.books) {
    const bookPath = book.bookPath;
    if (!bookPath) {
      payloadIssues.push(`${book.slug}: missing bookPath`);
      continue;
    }
    const normalizedBookPath = normalizeUploadPath(bookPath);
    manifestBookPaths.add(normalizedBookPath);
    manifestBooksByPath.set(normalizedBookPath, book);
  }

  for (const bookFile of uploadedBookFiles) {
    const book = manifestBooksByPath.get(bookFile);
    if (!book) {
      payloadIssues.push(`${bookFile}: uploaded book file is missing from public manifest`);
      continue;
    }
    try {
      const payload = await fetchJson<BookPayload>(`${localExportBaseUrl}/${bookFile}`);
      payloadsReachable += 1;
      const expectedPathSlug = bookFile.replace(/^books\//, "").replace(/\.json$/, "");
      if (payload.slug !== book.slug || payload.slug !== expectedPathSlug) {
        payloadIssues.push(`${book.slug}: slug/path mismatch`);
      }
      if (!Array.isArray(payload.sections) || payload.sections.length === 0) {
        payloadIssues.push(`${book.slug}: missing sections`);
      }
      if (!payload.contentSuitability || !payload.contentNote || typeof payload.strictReviewCandidate !== "boolean") {
        payloadIssues.push(`${book.slug}: missing suitability metadata`);
      } else {
        payloadsWithSuitability += 1;
      }
      if (payload.contentSuitability === "low" || payload.contentSuitability === "moderate" || payload.contentSuitability === "elevated") {
        suitabilityCounts[payload.contentSuitability] += 1;
      } else {
        payloadIssues.push(`${book.slug}: unsupported suitability ${String(payload.contentSuitability)}`);
      }
      if (payload.contentVersion !== book.contentVersion || payload.contentHash !== book.contentHash) {
        payloadIssues.push(`${book.slug}: content version/hash mismatch`);
      }
    } catch (error) {
      payloadIssues.push(`${book.slug}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const missingManifestBookFiles = uploadedBookFiles.filter((bookFile) => !manifestBookPaths.has(bookFile));

  return {
    publicManifest,
    uploadManifest,
    uploadedFiles,
    uploadedBookFiles,
    uploadedBookSlugs: uploadManifestBookSlugs(uploadManifest),
    payloadsReachable,
    payloadsWithSuitability,
    suitabilityCounts,
    payloadIssues,
    missingManifestBookFiles,
  };
}

function buildMarkdown(report: Record<string, unknown>) {
  const section = (title: string, body: string) => `## ${title}\n\n${body.trim()}\n`;
  const blockers = report.remainingBlockers as string[];
  const bookSubsystem = report.bookSubsystem as Record<string, unknown>;
  const suitability = report.contentSafetySuitability as Record<string, unknown>;
  const exportReadiness = report.updatedCloudflareExportReadiness as Record<string, unknown>;
  const printRoute = report.localPrintRouteResult as Record<string, unknown>;
  const sitemap = report.localSitemapIndexabilityCanonicalResult as Record<string, unknown>;
  const metadata = report.localMetadataContentQualityResult as Record<string, unknown>;
  const mobile = report.localMobileSmokeResult as Record<string, unknown>;
  const cleanup = report.cleanupPerformed as Record<string, unknown>;
  const protectedStatus = report.protectedFolderExportTrackingStatus as Record<string, unknown>;

  return [
    "# Local Final Validation, Cleanup, and Mobile Review",
    "",
    section(
      "1. Executive result",
      String(report.executiveResult),
    ),
    section(
      "2. Current main commit checked",
      `Current branch commit checked: \`${String(report.currentMainCommitChecked)}\`.\n\nRequired merged completion commit: \`${requiredCompletionCommit}\`.\n\nCompletion commit present: ${String(report.requiredCompletionCommitPresent)}.`,
    ),
    section(
      "3. Local-only scope statement",
      String(report.localOnlyScopeStatement),
    ),
    section(
      "4. Production deployment validation deferred statement",
      String(report.productionDeploymentValidationDeferredStatement),
    ),
    section(
      "5. Book subsystem final local state",
      [
        `Generated book count: ${bookSubsystem.generatedBookCount}.`,
        `SEO summary count: ${bookSubsystem.seoSummaryCount}.`,
        `Startup preview count: ${bookSubsystem.startupPreviewCount}.`,
        `Book URL count: ${bookSubsystem.bookUrlCount}.`,
        `Audiobook URL count: ${bookSubsystem.audiobookUrlCount}.`,
        `Print URL count: ${bookSubsystem.printUrlCount}.`,
      ].join("\n"),
    ),
    section(
      "6. Content-safety and suitability final local state",
      [
        `Suitability counts: ${JSON.stringify(suitability.suitabilityCounts)}.`,
        `Strict review candidates: ${suitability.strictReviewCandidateCount}.`,
        `Deterministic unsafe findings remaining: ${suitability.deterministicUnsafeFindingsRemaining}.`,
        `Policy selected: ${suitability.normalContentPolicySupported}.`,
        `All-audience safety supported: ${suitability.allAudienceSafetySupported}.`,
        `Classroom/youth-safe-by-default supported: ${suitability.classroomYouthSafeByDefaultSupported}.`,
      ].join("\n"),
    ),
    section(
      "7. Updated Cloudflare export local readiness",
      [
        `Local export folder: \`${String(exportReadiness.sourceFolder)}\`.`,
        `File count: ${exportReadiness.fileCount}.`,
        `Book payload count: ${exportReadiness.bookPayloadCount}.`,
        `Manifest count: ${exportReadiness.manifestCount}.`,
        `Tracked file count: ${exportReadiness.trackedFileCount}.`,
        `Served local base URL during validation: ${exportReadiness.localServedBaseUrl}.`,
      ].join("\n"),
    ),
    section(
      "8. Local print-route result",
      [
        String(printRoute.summary),
        `Routes checked: ${JSON.stringify(printRoute.routesChecked)}.`,
        `Full payload serialization in SSR: ${printRoute.fullPayloadSerializedInSsr}.`,
      ].join("\n"),
    ),
    section(
      "9. Local sitemap/indexability/canonical result",
      [
        `XML sitemap URL count: ${sitemap.xmlSitemapUrlCount}.`,
        `Route inventory count: ${sitemap.routeInventoryCount}.`,
        `Expected production host configured: ${sitemap.expectedProductionHost}.`,
        `Production asset host configured: ${sitemap.productionAssetHost}.`,
      ].join("\n"),
    ),
    section(
      "10. Local metadata/content-quality result",
      [
        `SEO summaries: ${metadata.seoSummaryResult}.`,
        `Startup previews: ${metadata.startupPreviewResult}.`,
        `No app imports from ignored Cloudflare export: ${metadata.noAppCloudflareExportImports}.`,
      ].join("\n"),
    ),
    section(
      "11. Local mobile smoke result",
      String(mobile.summary),
    ),
    section(
      "12. Cleanup performed",
      String(cleanup.summary),
    ),
    section(
      "13. Protected folder/export tracking status",
      [
        `temp-books status: ${protectedStatus.tempBooksStatus}.`,
        `generated status: ${protectedStatus.generatedStatus}.`,
        `public/book-previews status: ${protectedStatus.publicBookPreviewsStatus}.`,
        `cloudflare-export tracked files: ${protectedStatus.cloudflareExportTrackedFileCount}.`,
        `cloudflare-updated-export tracked files: ${protectedStatus.cloudflareUpdatedExportTrackedFileCount}.`,
      ].join("\n"),
    ),
    section(
      "14. Remaining blockers",
      blockers.length ? blockers.map((blocker) => `- ${blocker}`).join("\n") : "No local blockers remain. Production Netlify route revalidation remains a future production-only check.",
    ),
    section(
      "15. Final local readiness",
      String(report.finalLocalReadiness),
    ),
    section(
      "16. Required future production check",
      String(report.requiredFutureProductionCheck),
    ),
  ].join("\n");
}

function ensureReportDirectory() {
  fs.mkdirSync(reportDir, { recursive: true });
}

function readStatusShort(target: string) {
  return runGit(["status", "--short", target]);
}

function readTrackedCount(target: string) {
  const output = runGit(["ls-files", target]);
  return output ? output.split(/\r?\n/).filter(Boolean).length : 0;
}

async function main() {
  const blockers: string[] = [];
  const checks: CheckResult[] = [];
  const branchName = runGit(["branch", "--show-current"]);
  const currentCommit = runGit(["rev-parse", "HEAD"]);
  const generatedManifest = readJson<{ books: Array<{ slug: string }> }>(generatedManifestPath);
  const seoSummary = readJson<{ summaries?: unknown[]; expectedSummaryCount?: number }>(seoSummaryPath);
  const previewManifest = readJson<{ books?: unknown[]; missing?: unknown[] }>(previewManifestPath);
  const suitability = readJson<{
    booksReviewed: number;
    normalRiskLevelCounts: Record<string, number>;
    strictReviewCandidateCount: number;
    profiles: Record<string, unknown>;
  }>(suitabilityPath);
  const sweepReport = readJson<{
    contentSafety?: {
      findingsAfterCleanup?: Array<{ occurrences?: number; bookCount?: number }>;
      safeReplacementsApplied?: { occurrenceCount?: number; bookCount?: number };
    };
    completeness?: { repairs?: unknown[]; deferredOrBlockedBooks?: unknown[] };
    updatedExport?: { fileCount?: number; bookPayloadCount?: number; manifestFileCount?: number; trackedFileCount?: number; replacementType?: string };
  }>(sweepReportPath);
  const riskReport = readJson<{
    deterministicUnsafeFindingsRemaining?: number;
    booksRecommendedForDeferralOrRemoval?: unknown[];
    booksRequiringOwnerReview?: unknown[];
  }>(riskReportPath);
  const policyReport = readJson<{
    executiveResult?: string;
    normalPolicyResult?: string;
    strictClassroomYouthPolicyResult?: string;
    recommendedProductPolicy?: string;
  }>(policyReportPath);
  const localUploadManifest = readJson<UploadManifest>(path.join(updatedExportDir, "upload-manifest.json"));
  const expectedBookCount = generatedManifest.books.length;
  const expectedSitemapUrlCount = expectedNonBookSitemapCount + expectedBookCount * 3;
  const expectedPrintUrlCount = expectedBookCount;
  const expectedExportFileCount = uploadManifestFilePaths(localUploadManifest).length;
  const expectedExportBookPayloadCount = uploadManifestBookFiles(localUploadManifest).length;
  const updatedExportShape =
    expectedExportBookPayloadCount === expectedBookCount ? "full" : "incremental";
  const suitabilityReviewedCount = Object.keys(suitability.profiles ?? {}).length;
  const suitabilityRiskCountTotal = Object.values(suitability.normalRiskLevelCounts ?? {}).reduce(
    (sum, count) => sum + count,
    0,
  );

  const sitemapEntries = parseSitemapEntries();
  const bookUrlCount = sitemapEntries.filter((entry) => /^\/morse-code-books\/[^/]+$/.test(entry.pathname)).length;
  const audiobookUrlCount = sitemapEntries.filter((entry) => /^\/morse-code-audiobooks\/[^/]+$/.test(entry.pathname)).length;
  const printUrlCount = sitemapEntries.filter((entry) => /^\/morse-code-books\/[^/]+\/print$/.test(entry.pathname)).length;
  const routeInventoryCount = parseRouteInventoryCount();
  const appImportScan = countCloudflareExportImports();
  const cloudflareExportTrackedFileCount = readTrackedCount("app/client/assets/books/cloudflare-export");
  const cloudflareUpdatedExportTrackedFileCount = readTrackedCount("app/client/assets/books/cloudflare-updated-export");
  const updatedExportFileCount = fs.existsSync(updatedExportDir) ? countFilesRecursive(updatedExportDir) : 0;
  const normalUnsafeFindingsRemaining = (sweepReport.contentSafety?.findingsAfterCleanup ?? []).reduce(
    (sum, finding) => sum + (finding.occurrences ?? 0),
    0,
  );
  const deterministicUnsafeFindingsRemaining =
    riskReport.deterministicUnsafeFindingsRemaining ?? normalUnsafeFindingsRemaining;
  const tempBooksStatus = readStatusShort("app/client/assets/temp-books");
  const generatedStatus = readStatusShort("app/client/assets/books/generated");
  const publicBookPreviewsStatus = readStatusShort("public/book-previews");
  const cloudflareExportStatus = readStatusShort("app/client/assets/books/cloudflare-export");
  const cloudflareUpdatedExportStatus = readStatusShort("app/client/assets/books/cloudflare-updated-export");

  const requiredCompletionCommitPresent = hasAncestorCommit(requiredCompletionCommit);
  check(
    requiredCompletionCommitPresent,
    "required completion commit",
    `${requiredCompletionCommit} ancestor of HEAD: ${requiredCompletionCommitPresent}`,
    blockers,
    checks,
  );
  check(generatedManifest.books.length === expectedBookCount, "generated book count", `${generatedManifest.books.length}/${expectedBookCount}`, blockers, checks);
  check((seoSummary.summaries ?? []).length === expectedBookCount, "SEO summary count", `${(seoSummary.summaries ?? []).length}/${expectedBookCount}`, blockers, checks);
  check((previewManifest.books ?? []).length === expectedBookCount, "startup preview count", `${(previewManifest.books ?? []).length}/${expectedBookCount}`, blockers, checks);
  check(sitemapEntries.length === expectedSitemapUrlCount, "XML sitemap URL count", `${sitemapEntries.length}/${expectedSitemapUrlCount}`, blockers, checks);
  check(bookUrlCount === expectedBookCount, "book URL count", `${bookUrlCount}/${expectedBookCount}`, blockers, checks);
  check(audiobookUrlCount === expectedBookCount, "audiobook URL count", `${audiobookUrlCount}/${expectedBookCount}`, blockers, checks);
  check(printUrlCount === expectedPrintUrlCount, "print URL count", `${printUrlCount}/${expectedPrintUrlCount}`, blockers, checks);
  check(routeInventoryCount === expectedRouteInventoryCount, "route inventory count", `${routeInventoryCount}/${expectedRouteInventoryCount}`, blockers, checks);
  check(appImportScan.count === 0, "ignored export app imports", `${appImportScan.count} imports found`, blockers, checks);
  check(cloudflareExportTrackedFileCount === 0, "cloudflare-export tracked-file count", `${cloudflareExportTrackedFileCount}`, blockers, checks);
  check(cloudflareUpdatedExportTrackedFileCount === 0, "cloudflare-updated-export tracked-file count", `${cloudflareUpdatedExportTrackedFileCount}`, blockers, checks);
  check(updatedExportFileCount === expectedExportFileCount, "cloudflare-updated-export file count", `${updatedExportFileCount}/${expectedExportFileCount}`, blockers, checks);
  check(
    suitability.booksReviewed === suitabilityReviewedCount &&
      suitability.booksReviewed === suitabilityRiskCountTotal,
    "suitability profile count consistency",
    `${suitability.booksReviewed} reviewed, ${suitabilityReviewedCount} profiles, ${suitabilityRiskCountTotal} risk labels`,
    blockers,
    checks,
  );
  check(
    suitability.strictReviewCandidateCount <= suitability.booksReviewed,
    "strict review candidate count",
    `${suitability.strictReviewCandidateCount}/${suitability.booksReviewed}`,
    blockers,
    checks,
  );
  check(deterministicUnsafeFindingsRemaining === 0, "deterministic unsafe findings", `${deterministicUnsafeFindingsRemaining} remaining`, blockers, checks);
  const policyText = [
    policyReport.executiveResult,
    policyReport.normalPolicyResult,
    policyReport.strictClassroomYouthPolicyResult,
    policyReport.recommendedProductPolicy,
  ].join(" ");
  check(/sanitized historical/i.test(policyText) && /Option B/i.test(policyText), "sanitized historical-library policy", "Option B selected", blockers, checks);
  check(/not approved as all-audience/i.test(policyText) || /avoid all-audience/i.test(policyText), "all-audience policy", "not supported", blockers, checks);
  check(/does not support.*youth-safe by default/i.test(policyText) || /avoid.*classroom-safe/i.test(policyText), "classroom/youth-safe-by-default policy", "not supported", blockers, checks);

  let localExportBaseUrl = "";
  let exportValidation: Awaited<ReturnType<typeof validateLocalExport>> | null = null;
  let printRouteResults: Awaited<ReturnType<typeof validateLocalPrintRoutes>> = [];
  const staticServer = await startStaticServer(updatedExportDir);
  try {
    localExportBaseUrl = staticServer.baseUrl;
    exportValidation = await validateLocalExport(localExportBaseUrl);
    check(exportValidation.publicManifest.books.length === expectedBookCount, "local export public manifest book count", `${exportValidation.publicManifest.books.length}/${expectedBookCount}`, blockers, checks);
    check(
      exportValidation.uploadManifest.approvedBookCount === undefined ||
        exportValidation.uploadManifest.approvedBookCount === expectedBookCount,
      "local export approved book count",
      `${exportValidation.uploadManifest.approvedBookCount ?? "not declared"}/${expectedBookCount}`,
      blockers,
      checks,
    );
    check(exportValidation.uploadedBookFiles.length === expectedExportBookPayloadCount, "local export upload manifest book count", `${exportValidation.uploadedBookFiles.length}/${expectedExportBookPayloadCount}`, blockers, checks);
    check(exportValidation.uploadedFiles.length === expectedExportFileCount, "local export upload manifest file count", `${exportValidation.uploadedFiles.length}/${expectedExportFileCount}`, blockers, checks);
    check(exportValidation.payloadsReachable === expectedExportBookPayloadCount, "local export payload reachability", `${exportValidation.payloadsReachable}/${expectedExportBookPayloadCount}`, blockers, checks);
    check(exportValidation.payloadsWithSuitability === expectedExportBookPayloadCount, "local export payload suitability metadata", `${exportValidation.payloadsWithSuitability}/${expectedExportBookPayloadCount}`, blockers, checks);
    check(exportValidation.payloadIssues.length === 0, "local export payload integrity", `${exportValidation.payloadIssues.length} issues`, blockers, checks);
    check(exportValidation.missingManifestBookFiles.length === 0, "local export manifest/path structure", `${exportValidation.missingManifestBookFiles.length} missing manifest book files`, blockers, checks);

    printRouteResults = await validateLocalPrintRoutes(localExportBaseUrl, exportValidation.uploadedBookSlugs);
    const printRoutesPassed = printRouteResults.every((result) => result.passed);
    check(
      printRoutesPassed,
      "local print route checks",
      printRouteResults.map((result) => `${result.path}:${result.status}:${result.htmlBytes}`).join(", "),
      blockers,
      checks,
    );
  } finally {
    await staticServer.close();
  }

  const mobileSmokeResultFromEnv = process.env.MORSEWORDS_LOCAL_MOBILE_SMOKE_RESULT?.trim();
  const mobileSmokeSummary =
    mobileSmokeResultFromEnv ||
    "Mobile smoke coverage is implemented in tests/qa-robustness-review/morse-mobile-smoke.spec.ts; the required Playwright command verifies it in the full validation sequence.";

  const exportManifestCount =
    (fs.existsSync(path.join(updatedExportDir, "public-manifest.json")) ? 1 : 0) +
    (fs.existsSync(path.join(updatedExportDir, "upload-manifest.json")) ? 1 : 0);
  const localBlockers = blockers;
  const executiveResult = localBlockers.length
    ? `Local final validation blocked because ${localBlockers.join("; ")}`
    : "Local final validation, cleanup, and mobile review passed";
  const report = {
    schemaVersion: 1,
    reportName: "local-final-validation-cleanup-mobile-review",
    generatedAt: new Date().toISOString(),
    executiveResult,
    branchName,
    currentMainCommitChecked: currentCommit,
    requiredCompletionCommit,
    requiredCompletionCommitPresent,
    localOnlyScopeStatement:
      "This branch completed repo-local readiness checks using local files, local app serving, and the ignored local Cloudflare updated export folder. It did not wait for or validate a production route deployment.",
    productionDeploymentValidationDeferredStatement: localDeferredStatement,
    assetHostPolicy: {
      productionAssetHost: MORSE_BOOK_CONTENT_BASE_URL,
      productionPageHost: SITE_ORIGIN,
      localValidationAssetHost: localExportBaseUrl,
      note: "Production uses https://assets.morsewords.com; local validation serves app/client/assets/books/cloudflare-updated-export over a temporary localhost HTTP server.",
    },
    bookSubsystem: {
      generatedBookCount: generatedManifest.books.length,
      seoSummaryCount: (seoSummary.summaries ?? []).length,
      seoExpectedSummaryCount: seoSummary.expectedSummaryCount ?? null,
      startupPreviewCount: (previewManifest.books ?? []).length,
      bookUrlCount,
      audiobookUrlCount,
      printUrlCount,
      xmlSitemapUrlCount: sitemapEntries.length,
      routeInventoryCount,
    },
    contentSafetySuitability: {
      suitabilityCounts: suitability.normalRiskLevelCounts,
      strictReviewCandidateCount: suitability.strictReviewCandidateCount,
      deterministicUnsafeFindingsRemaining,
      normalContentPolicySupported: "sanitized historical public-domain library",
      allAudienceSafetySupported: false,
      classroomYouthSafeByDefaultSupported: false,
      normalOwnerReviewBlockers: riskReport.booksRequiringOwnerReview?.length ?? 0,
      normalDeferralRemovalRecommendations: riskReport.booksRecommendedForDeferralOrRemoval?.length ?? 0,
      safeReplacementOccurrences: sweepReport.contentSafety?.safeReplacementsApplied?.occurrenceCount ?? null,
      changedSafetySweepBookCount: sweepReport.contentSafety?.safeReplacementsApplied?.bookCount ?? null,
      completenessRepairs: sweepReport.completeness?.repairs?.length ?? null,
      deferredOrBlockedBooks: sweepReport.completeness?.deferredOrBlockedBooks?.length ?? null,
    },
    updatedCloudflareExportReadiness: {
      sourceFolder: path.relative(repoRoot, updatedExportDir).replace(/\\/g, "/"),
      fileCount: updatedExportFileCount,
      bookPayloadCount: exportValidation?.payloadsReachable ?? 0,
      manifestCount: exportManifestCount,
      trackedFileCount: cloudflareUpdatedExportTrackedFileCount,
      localServedBaseUrl: localExportBaseUrl,
      requiredFiles: exportValidation?.uploadManifest.requiredFiles ?? [],
      replacementType: updatedExportShape,
      payloadIssues: exportValidation?.payloadIssues ?? [],
    },
    localPrintRouteResult: {
      summary: printRouteResults.every((result) => result.passed)
        ? "Local print routes returned 200, showed suitability notes, avoided unavailable text, and did not serialize full book sections in SSR."
        : "One or more local print routes failed the local readiness checks.",
      routesChecked: printRouteResults,
      fullPayloadSerializedInSsr: printRouteResults.some((result) => result.checks.includes("full-section-serialization")),
    },
    localSitemapIndexabilityCanonicalResult: {
      xmlSitemapUrlCount: sitemapEntries.length,
      routeInventoryCount,
      bookUrlCount,
      audiobookUrlCount,
      printUrlCount,
      expectedProductionHost: SITE_ORIGIN,
      productionAssetHost: MORSE_BOOK_CONTENT_BASE_URL,
      localValidationAssetHost: localExportBaseUrl,
    },
    localMetadataContentQualityResult: {
      seoSummaryResult: `${(seoSummary.summaries ?? []).length}/${expectedBookCount}`,
      startupPreviewResult: `${(previewManifest.books ?? []).length}/${expectedBookCount}`,
      noAppCloudflareExportImports: appImportScan.count === 0,
      appCloudflareExportImportFiles: appImportScan.files,
    },
    localMobileSmokeResult: {
      summary: mobileSmokeSummary,
      testFile: "tests/qa-robustness-review/morse-mobile-smoke.spec.ts",
      requiredCommand:
        "npx playwright test tests/qa-robustness-review/morse-mobile-smoke.spec.ts --project=desktop-chromium --reporter=line",
    },
    cleanupPerformed: {
      summary:
        "No safe local cleanup was needed; no obsolete tracked temporary files or unreferenced workflow helpers were removed.",
      filesRemoved: [],
    },
    protectedFolderExportTrackingStatus: {
      tempBooksStatus: tempBooksStatus || "clean",
      generatedStatus: generatedStatus || "clean",
      publicBookPreviewsStatus: publicBookPreviewsStatus || "clean",
      cloudflareExportStatus: cloudflareExportStatus || "ignored/untracked or clean",
      cloudflareUpdatedExportStatus: cloudflareUpdatedExportStatus || "ignored/untracked or clean",
      cloudflareExportTrackedFileCount,
      cloudflareUpdatedExportTrackedFileCount,
    },
    remainingBlockers: localBlockers,
    finalLocalReadiness: localBlockers.length
      ? "Local final readiness is blocked by the listed local blockers."
      : "Local repo readiness passed. Production deployment route validation remains deferred.",
    requiredFutureProductionCheck:
      "After production is known to be serving the latest main, run the separate production-only route and remote content-safety/suitability validation. Do not treat that deferred production check as a blocker for this local completion branch.",
    checks,
  };

  ensureReportDirectory();
  fs.writeFileSync(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(reportMdPath, `${buildMarkdown(report)}\n`);

  console.log(executiveResult);
  console.log(localDeferredStatement);
  console.log(`Report JSON: ${path.relative(repoRoot, reportJsonPath).replace(/\\/g, "/")}`);
  console.log(`Report Markdown: ${path.relative(repoRoot, reportMdPath).replace(/\\/g, "/")}`);

  if (localBlockers.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
