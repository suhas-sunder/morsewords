import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

type CommandResult = {
  ok: boolean;
  status: number | null;
  stdout: string;
  stderr: string;
  error?: string;
};

type SitemapSnapshot = {
  total: number;
  book: number;
  audiobook: number;
  print: number;
  nonBook: number;
};

type HeaderSnapshot = Record<string, string>;

type FetchSnapshot = {
  url: string;
  finalUrl?: string;
  ok: boolean;
  status: number | null;
  statusText?: string;
  headers: HeaderSnapshot;
  bodyLength: number;
  error?: string;
};

type PrintRouteSnapshot = FetchSnapshot & {
  pathname: string;
  showsSuitabilityNote: boolean;
  showsBookTextUnavailable: boolean;
};

type DiagnosisStatus =
  | "passed"
  | "production-stale-against-latest-main"
  | "local-repo-missing-expected-fixes"
  | "production-latest-sitemap-stale-app-routes"
  | "production-latest-app-routes-stale-sitemap"
  | "asset-host-problem"
  | "unknown-deploy-config-issue";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const productionHost = "https://www.morsewords.com";
const assetHost = "https://assets.morsewords.com";
const expectedMainHead = "91d26bcccca43d1e0fbbe5c5bb318355d68e704e";
const expectedSitemap: SitemapSnapshot = {
  total: 1682,
  book: 519,
  audiobook: 519,
  print: 519,
  nonBook: 125,
};
const expectedStaleSitemap = {
  total: 1651,
  print: 488,
};
const printRoutePaths = [
  "/morse-code-books/walden/print",
  "/morse-code-books/the-call-of-cthulhu/print",
  "/morse-code-books/the-adventures-of-roderick-random/print",
];
const supportEmail = "support@morsewords.com";
const reportDir = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "production-deploy-staleness-diagnosis",
);
const reportJsonPath = path.join(reportDir, "production-deploy-staleness-diagnosis.json");
const reportMdPath = path.join(reportDir, "production-deploy-staleness-diagnosis.md");

function command(commandName: string, args: string[], options: { allowMissing?: boolean } = {}): CommandResult {
  const result = spawnSync(commandName, args, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: false,
  });

  if (result.error) {
    if (options.allowMissing && result.error.message.includes("ENOENT")) {
      return {
        ok: false,
        status: null,
        stdout: "",
        stderr: "",
        error: `${commandName} is not available`,
      };
    }
    return {
      ok: false,
      status: result.status,
      stdout: result.stdout?.trim() ?? "",
      stderr: result.stderr?.trim() ?? "",
      error: result.error.message,
    };
  }

  return {
    ok: result.status === 0,
    status: result.status,
    stdout: result.stdout?.trim() ?? "",
    stderr: result.stderr?.trim() ?? "",
  };
}

function git(args: string[], options: { allowFailure?: boolean } = {}) {
  const result = command("git", args);
  if (!result.ok && !options.allowFailure) {
    throw new Error(`git ${args.join(" ")} failed: ${result.stderr || result.error || "unknown error"}`);
  }
  return result;
}

function readFile(relativePath: string) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function readJsonFile<T>(relativePath: string): T {
  return JSON.parse(readFile(relativePath)) as T;
}

function fileExists(relativePath: string) {
  return fs.existsSync(path.join(repoRoot, relativePath));
}

function normalizePathname(pathname: string) {
  return pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname || "/";
}

function parseSitemapXml(xml: string) {
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const paths: string[] = [];
  const malformed: string[] = [];

  for (const urlText of urls) {
    try {
      paths.push(normalizePathname(new URL(urlText).pathname));
    } catch {
      malformed.push(urlText);
    }
  }

  return { urls, paths, malformed };
}

function snapshotFromPaths(paths: string[]): SitemapSnapshot {
  const bookPattern = /^\/morse-code-books\/[^/]+$/;
  const audiobookPattern = /^\/morse-code-audiobooks\/[^/]+$/;
  const printPattern = /^\/morse-code-books\/[^/]+\/print$/;
  let book = 0;
  let audiobook = 0;
  let print = 0;
  let nonBook = 0;

  for (const pathname of paths) {
    if (bookPattern.test(pathname)) book += 1;
    else if (audiobookPattern.test(pathname)) audiobook += 1;
    else if (printPattern.test(pathname)) print += 1;
    else nonBook += 1;
  }

  return { total: paths.length, book, audiobook, print, nonBook };
}

function localSitemapSnapshot() {
  const sitemapPath = path.join(repoRoot, "public", "sitemap.xml");
  if (!fs.existsSync(sitemapPath)) {
    return {
      exists: false,
      snapshot: null,
      malformed: ["public/sitemap.xml is missing"],
    };
  }
  const parsed = parseSitemapXml(fs.readFileSync(sitemapPath, "utf8"));
  return {
    exists: true,
    snapshot: snapshotFromPaths(parsed.paths),
    malformed: parsed.malformed,
  };
}

function sitemapMatchesExpected(snapshot: SitemapSnapshot | null) {
  return Boolean(
    snapshot &&
      snapshot.total === expectedSitemap.total &&
      snapshot.book === expectedSitemap.book &&
      snapshot.audiobook === expectedSitemap.audiobook &&
      snapshot.print === expectedSitemap.print &&
      snapshot.nonBook === expectedSitemap.nonBook,
  );
}

function statusLabel(snapshot: SitemapSnapshot | null) {
  if (!snapshot) return "missing";
  return `${snapshot.total} total, ${snapshot.print} print, ${snapshot.book} book, ${snapshot.audiobook} audiobook, ${snapshot.nonBook} non-book`;
}

function selectHeaders(headers: Headers): HeaderSnapshot {
  const usefulHeaders = [
    "age",
    "cache-control",
    "cf-cache-status",
    "date",
    "etag",
    "last-modified",
    "server",
    "x-cache",
    "x-nf-request-id",
    "x-served-by",
  ];
  const snapshot: HeaderSnapshot = {};
  for (const header of usefulHeaders) {
    const value = headers.get(header);
    if (value) snapshot[header] = value;
  }
  return snapshot;
}

async function fetchText(url: string, options: { method?: "GET" | "HEAD"; timeoutMs?: number } = {}) {
  const timeoutMs = options.timeoutMs ?? 20000;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: options.method ?? "GET",
      redirect: "follow",
      headers: {
        "user-agent": "MorseWords production deploy staleness diagnosis",
        "cache-control": "no-cache",
        pragma: "no-cache",
      },
      signal: controller.signal,
    });
    const body = options.method === "HEAD" ? "" : await response.text();
    return {
      response: {
        url,
        finalUrl: response.url,
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: selectHeaders(response.headers),
        bodyLength: body.length,
      } satisfies FetchSnapshot,
      body,
    };
  } catch (error) {
    return {
      response: {
        url,
        ok: false,
        status: null,
        headers: {},
        bodyLength: 0,
        error: error instanceof Error ? error.message : String(error),
      } satisfies FetchSnapshot,
      body: "",
    };
  } finally {
    clearTimeout(timeout);
  }
}

function getNestedArrayLength(value: unknown, keys: string[]) {
  if (!value || typeof value !== "object") return null;
  for (const key of keys) {
    const candidate = (value as Record<string, unknown>)[key];
    if (Array.isArray(candidate)) return candidate.length;
  }
  return null;
}

async function fetchJsonManifest(url: string) {
  const fetched = await fetchText(url);
  if (!fetched.response.ok) {
    return {
      ...fetched.response,
      parsed: false,
      bookCount: null,
      uploadCount: null,
    };
  }

  try {
    const parsed = JSON.parse(fetched.body) as unknown;
    const bookCount = Array.isArray(parsed)
      ? parsed.length
      : getNestedArrayLength(parsed, ["books", "bookPayloads", "payloads", "entries", "items"]);
    const uploadCount = getNestedArrayLength(parsed, ["files", "uploads", "objects", "assets"]);
    return {
      ...fetched.response,
      parsed: true,
      bookCount,
      uploadCount,
    };
  } catch (error) {
    return {
      ...fetched.response,
      parsed: false,
      bookCount: null,
      uploadCount: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function hasAncestor(commit: string) {
  return git(["merge-base", "--is-ancestor", commit, "HEAD"], { allowFailure: true }).ok;
}

function inspectLocalFixes() {
  const printRouteSource = readFile("app/routes/morse-code-books.$slug.print.tsx");
  const printableSource = readFile("app/client/components/morse-code-books/PrintableMorsePages.tsx");
  const siteTrustSource = readFile("app/client/data/siteTrust.ts");
  const contactSource = readFile("app/routes/contact.tsx");
  const sourcesSource = readFile("app/routes/sources.tsx");
  const sitemap = localSitemapSnapshot();
  const packageJson = readJsonFile<{ scripts?: Record<string, string> }>("package.json");

  const printRouteLightweightSsrFix =
    printRouteSource.includes("getDiscoverableMorseBookSummary") &&
    printRouteSource.includes("isMorseBookPublishReady") &&
    !printRouteSource.includes("getMorseBookManifest") &&
    !printRouteSource.includes("getMorseBookPublicContent") &&
    printableSource.includes('data-testid="printable-book-content-suitability"') &&
    !printableSource.includes("Book text unavailable");

  const supportReadiness =
    siteTrustSource.includes(`"${supportEmail}"`) &&
    siteTrustSource.includes("mailto:${MORSEWORDS_SUPPORT_EMAIL}") &&
    contactSource.includes("MORSEWORDS_SUPPORT_EMAIL") &&
    contactSource.includes("MORSEWORDS_SUPPORT_EMAIL_HREF") &&
    sourcesSource.includes("MORSEWORDS_SUPPORT_EMAIL") &&
    sourcesSource.includes("MORSEWORDS_SUPPORT_EMAIL_HREF") &&
    /correction/i.test(sourcesSource) &&
    /takedown/i.test(sourcesSource) &&
    /concern/i.test(sourcesSource);

  return {
    printRouteLightweightSsrFix,
    printRouteFixCommitPresent: hasAncestor("66bb75e6"),
    sitemapCountCorrection: sitemapMatchesExpected(sitemap.snapshot),
    sitemapCorrectionCommitPresent: hasAncestor("3b077e20"),
    supportEmailReadiness: supportReadiness,
    supportEmailCommitPresent: hasAncestor("91d26bcc"),
    localSitemap: sitemap,
    packageScripts: {
      productionDeployStalenessDiagnosis:
        packageJson.scripts?.["site:production-deploy-staleness-diagnosis"] ?? null,
      finalProductionSanityCheck: packageJson.scripts?.["site:final-production-sanity-check"] ?? null,
    },
  };
}

function inspectNetlifyConfig() {
  const netlifyToml = fileExists("netlify.toml") ? readFile("netlify.toml") : "";
  const buildCommand = netlifyToml.match(/^\s*command\s*=\s*"([^"]+)"/m)?.[1] ?? null;
  const publishDirectory = netlifyToml.match(/^\s*publish\s*=\s*"([^"]+)"/m)?.[1] ?? null;
  const contextProduction = /\[context\.production\]/.test(netlifyToml);
  const productionBranchHint =
    netlifyToml.match(/^\s*branch\s*=\s*"([^"]+)"/m)?.[1] ?? null;
  const includedFiles = netlifyToml.match(/^\s*included_files\s*=\s*(.+)$/m)?.[1] ?? null;
  const githubWorkflowDir = path.join(repoRoot, ".github", "workflows");
  const githubWorkflowFiles = fs.existsSync(githubWorkflowDir)
    ? fs.readdirSync(githubWorkflowDir).filter((file) => /\.(ya?ml)$/i.test(file))
    : [];
  const npmrcPresent = fileExists(".npmrc");
  const reactRouterNetlifyFunction = fileExists(".netlify/v1/functions/react-router-server.mjs")
    ? readFile(".netlify/v1/functions/react-router-server.mjs")
    : "";
  const buildClientSitemapPath = path.join(repoRoot, "build", "client", "sitemap.xml");
  const buildClientSitemap = fs.existsSync(buildClientSitemapPath)
    ? snapshotFromPaths(parseSitemapXml(fs.readFileSync(buildClientSitemapPath, "utf8")).paths)
    : null;

  return {
    buildCommand,
    publishDirectory,
    functionsIncludedFiles: includedFiles,
    contextProductionConfiguredLocally: contextProduction,
    productionBranchHint,
    publicSitemapExists: fileExists("public/sitemap.xml"),
    buildClientSitemap,
    publicSitemapExpectedToBePublished:
      publishDirectory === "build/client" && fileExists("public/sitemap.xml"),
    githubWorkflowFiles,
    npmrcPresent,
    reactRouterNetlifyFunctionPresent: Boolean(reactRouterNetlifyFunction),
    reactRouterNetlifyFunctionPreferStatic:
      reactRouterNetlifyFunction.includes("preferStatic: true"),
  };
}

async function inspectProduction() {
  const [home, sitemap, contact, sources, assetManifest, uploadManifest, ...printFetches] =
    await Promise.all([
      fetchText(`${productionHost}/`),
      fetchText(`${productionHost}/sitemap.xml`),
      fetchText(`${productionHost}/contact`),
      fetchText(`${productionHost}/sources`),
      fetchJsonManifest(`${assetHost}/public-manifest.json`),
      fetchJsonManifest(`${assetHost}/upload-manifest.json`),
      ...printRoutePaths.map(async (pathname) => {
        const fetched = await fetchText(`${productionHost}${pathname}`);
        return {
          ...fetched.response,
          pathname,
          showsSuitabilityNote:
            fetched.body.includes("printable-book-content-suitability") ||
            /suitability/i.test(fetched.body),
          showsBookTextUnavailable: fetched.body.includes("Book text unavailable"),
        } satisfies PrintRouteSnapshot;
      }),
    ]);

  const parsedSitemap = sitemap.response.ok ? parseSitemapXml(sitemap.body) : null;
  const liveSitemapSnapshot = parsedSitemap ? snapshotFromPaths(parsedSitemap.paths) : null;

  return {
    home: home.response,
    sitemap: {
      ...sitemap.response,
      snapshot: liveSitemapSnapshot,
      malformed: parsedSitemap?.malformed ?? [],
    },
    contact: {
      ...contact.response,
      exposesSupportEmail: contact.body.includes(supportEmail),
      exposesMailto: contact.body.includes(`mailto:${supportEmail}`),
    },
    sources: {
      ...sources.response,
      exposesSupportEmail: sources.body.includes(supportEmail),
      exposesCorrectionPath: /correction/i.test(sources.body),
      exposesTakedownPath: /takedown/i.test(sources.body),
      exposesReportConcernPath: /report|concern/i.test(sources.body),
    },
    printRoutes: printFetches,
    assetHost: {
      publicManifest: assetManifest,
      uploadManifest,
      reachable:
        assetManifest.ok &&
        assetManifest.parsed &&
        uploadManifest.ok &&
        uploadManifest.parsed,
    },
    headerSamples: {
      home: home.response.headers,
      sitemap: sitemap.response.headers,
      firstPrintRoute: printFetches[0]?.headers ?? {},
    },
  };
}

function classifyDiagnosis({
  localFixes,
  production,
}: {
  localFixes: ReturnType<typeof inspectLocalFixes>;
  production: Awaited<ReturnType<typeof inspectProduction>>;
}) {
  const blockers: string[] = [];
  const localMissing: string[] = [];

  if (!localFixes.printRouteLightweightSsrFix) {
    localMissing.push("local HEAD does not show the lightweight print-route SSR fix");
  }
  if (!localFixes.sitemapCountCorrection) {
    localMissing.push("local public/sitemap.xml is not corrected to 1,682 URLs and 519 print URLs");
  }
  if (!localFixes.supportEmailReadiness) {
    localMissing.push(`local HEAD does not show ${supportEmail} contact/source readiness`);
  }

  const liveSitemapLatest = sitemapMatchesExpected(production.sitemap.snapshot);
  const livePrintLatest = production.printRoutes.every(
    (route) => route.status === 200 && route.showsSuitabilityNote && !route.showsBookTextUnavailable,
  );
  const liveAssetHostOk = production.assetHost.reachable;
  const liveContactFresh =
    production.contact.status === 200 &&
    production.contact.exposesSupportEmail &&
    production.contact.exposesMailto &&
    production.sources.status === 200 &&
    production.sources.exposesSupportEmail &&
    production.sources.exposesCorrectionPath &&
    production.sources.exposesTakedownPath &&
    production.sources.exposesReportConcernPath;

  if (localMissing.length > 0) {
    blockers.push(...localMissing);
    return {
      status: "local-repo-missing-expected-fixes" as DiagnosisStatus,
      blockers,
      liveSitemapLatest,
      livePrintLatest,
      liveAssetHostOk,
      liveContactFresh,
    };
  }

  if (!liveAssetHostOk) {
    blockers.push("assets.morsewords.com public/upload manifests are not both reachable and parseable");
    return {
      status: "asset-host-problem" as DiagnosisStatus,
      blockers,
      liveSitemapLatest,
      livePrintLatest,
      liveAssetHostOk,
      liveContactFresh,
    };
  }

  if (!liveSitemapLatest && !livePrintLatest) {
    const liveSnapshot = production.sitemap.snapshot;
    if (liveSnapshot) {
      blockers.push(
        `production sitemap has ${liveSnapshot.total} URLs and ${liveSnapshot.print} print URLs; expected ${expectedSitemap.total} URLs and ${expectedSitemap.print} print URLs`,
      );
    } else {
      blockers.push("production sitemap could not be fetched or parsed");
    }
    for (const route of production.printRoutes.filter((item) => item.status !== 200)) {
      blockers.push(`${route.pathname} returns HTTP ${route.status ?? "fetch error"}`);
    }
    return {
      status: "production-stale-against-latest-main" as DiagnosisStatus,
      blockers,
      liveSitemapLatest,
      livePrintLatest,
      liveAssetHostOk,
      liveContactFresh,
    };
  }

  if (liveSitemapLatest && !livePrintLatest) {
    for (const route of production.printRoutes.filter(
      (item) => item.status !== 200 || !item.showsSuitabilityNote || item.showsBookTextUnavailable,
    )) {
      blockers.push(
        `${route.pathname} is not serving the expected latest print page behavior (HTTP ${route.status ?? "fetch error"})`,
      );
    }
    return {
      status: "production-latest-sitemap-stale-app-routes" as DiagnosisStatus,
      blockers,
      liveSitemapLatest,
      livePrintLatest,
      liveAssetHostOk,
      liveContactFresh,
    };
  }

  if (!liveSitemapLatest && livePrintLatest) {
    const liveSnapshot = production.sitemap.snapshot;
    blockers.push(
      liveSnapshot
        ? `production sitemap has ${liveSnapshot.total} URLs and ${liveSnapshot.print} print URLs while app routes look fresh`
        : "production sitemap could not be fetched or parsed while app routes look fresh",
    );
    return {
      status: "production-latest-app-routes-stale-sitemap" as DiagnosisStatus,
      blockers,
      liveSitemapLatest,
      livePrintLatest,
      liveAssetHostOk,
      liveContactFresh,
    };
  }

  if (!liveContactFresh) {
    blockers.push("production contact/source pages do not expose the expected support and concern paths");
    return {
      status: "unknown-deploy-config-issue" as DiagnosisStatus,
      blockers,
      liveSitemapLatest,
      livePrintLatest,
      liveAssetHostOk,
      liveContactFresh,
    };
  }

  return {
    status: "passed" as DiagnosisStatus,
    blockers,
    liveSitemapLatest,
    livePrintLatest,
    liveAssetHostOk,
    liveContactFresh,
  };
}

function executiveResult(status: DiagnosisStatus, blockers: string[]) {
  if (status === "passed") return "Production deploy staleness diagnosis passed";
  const blocker = blockers[0] ?? "production freshness could not be verified";
  return `Production deploy staleness diagnosis blocked because ${blocker}`;
}

function likelyCause(status: DiagnosisStatus, originMainHead: string, netlifyCliAvailable: boolean) {
  if (status === "passed") {
    return "Production now matches the latest expected main behavior for the checked deploy freshness markers.";
  }
  if (status === "local-repo-missing-expected-fixes") {
    return "The local branch is missing at least one expected latest-main marker, so production staleness cannot be blamed on deployment yet.";
  }
  if (status === "asset-host-problem") {
    return "The asset host checks failed independently of the app deploy, so the asset host must be repaired or verified first.";
  }
  if (status === "production-latest-sitemap-stale-app-routes") {
    return "Production appears to have the latest sitemap but an older server-rendered app route bundle.";
  }
  if (status === "production-latest-app-routes-stale-sitemap") {
    return "Production appears to have the latest app route bundle but an older static sitemap artifact.";
  }
  if (status === "production-stale-against-latest-main") {
    return [
      `Production is still serving deploy behavior older than origin/main ${originMainHead || expectedMainHead}.`,
      "Local code and public/sitemap.xml contain the expected fixes.",
      netlifyCliAvailable
        ? "Netlify CLI is available locally, so deploy records can be checked read-only."
        : "Netlify CLI is unavailable locally, so the Netlify dashboard must be used to confirm whether a production deploy from origin/main has completed.",
    ].join(" ");
  }
  return "Production freshness markers are inconsistent; inspect Netlify production deploy records, CDN cache state, and the published artifact.";
}

function formatBoolean(value: boolean) {
  return value ? "pass" : "fail";
}

function formatPrintRoutes(printRoutes: PrintRouteSnapshot[]) {
  return printRoutes
    .map((route) => {
      const suitability = route.showsSuitabilityNote ? "suitability note present" : "suitability note missing";
      const unavailable = route.showsBookTextUnavailable ? "Book text unavailable present" : "no unavailable copy";
      return `- ${route.pathname}: HTTP ${route.status ?? "fetch error"}; ${suitability}; ${unavailable}`;
    })
    .join("\n");
}

function formatHeaders(headers: HeaderSnapshot) {
  const entries = Object.entries(headers);
  if (entries.length === 0) return "No useful cache/deploy headers returned.";
  return entries.map(([key, value]) => `- ${key}: ${value}`).join("\n");
}

function writeReports(report: Record<string, unknown>, md: string) {
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(reportMdPath, md);
}

async function main() {
  const generatedAt = new Date().toISOString();
  const currentBranch = git(["branch", "--show-current"]).stdout;
  const localHead = git(["rev-parse", "HEAD"]).stdout;
  const originMainHead = git(["rev-parse", "origin/main"]).stdout;
  const remote = git(["remote", "-v"]).stdout;
  const localFixes = inspectLocalFixes();
  const netlifyConfig = inspectNetlifyConfig();
  const netlifyCli = command("netlify", ["--version"], { allowMissing: true });
  const production = await inspectProduction();
  const classification = classifyDiagnosis({ localFixes, production });
  const executive = executiveResult(classification.status, classification.blockers);
  const exactLikelyCause = likelyCause(
    classification.status,
    originMainHead,
    netlifyCli.ok,
  );
  const finalSanityCompatibilityMode = process.argv.includes("--final-production-sanity-compatible");

  const fixesMade =
    classification.status === "passed"
      ? ["Added deploy staleness diagnosis automation and report."]
      : [
          "Added deploy staleness diagnosis automation and report.",
          "No app code, sitemap policy, book content, generated book payload, public preview, or Cloudflare export change was made.",
        ];
  const requiredOwnerAction =
    classification.status === "passed"
      ? "No production staleness owner action remains for these checked markers."
      : "Trigger or wait for a Netlify production deploy from origin/main at 91d26bcccca43d1e0fbbe5c5bb318355d68e704e or newer, then rerun npm run site:final-production-sanity-check from the final production sanity branch.";
  const recommendedNextStep =
    classification.status === "passed"
      ? "Return to morsewords-final-production-sanity-check-jun-2026 and rerun the full final production sanity check."
      : "Verify the latest Netlify production deploy in the dashboard, then rerun the final production sanity check branch after production serves latest main behavior.";

  const staleExpected =
    production.sitemap.snapshot?.total === expectedStaleSitemap.total &&
    production.sitemap.snapshot?.print === expectedStaleSitemap.print;

  const report = {
    generatedAt,
    compatibilityMode: finalSanityCompatibilityMode
      ? "site:final-production-sanity-check compatibility mode"
      : "site:production-deploy-staleness-diagnosis",
    executiveResult: executive,
    status: classification.status,
    currentLocalGitBranch: currentBranch,
    currentLocalHead: localHead,
    originMainHead,
    expectedMainHead,
    remote,
    localMainHeadResult: {
      branch: currentBranch,
      head: localHead,
      headMatchesOriginMain: localHead === originMainHead,
      localHeadContainsExpectedMain: hasAncestor(expectedMainHead),
      printRouteLightweightSsrFix: localFixes.printRouteLightweightSsrFix,
      printRouteFixCommitPresent: localFixes.printRouteFixCommitPresent,
      sitemapCountCorrectionTo1682: localFixes.sitemapCountCorrection,
      sitemapCorrectionCommitPresent: localFixes.sitemapCorrectionCommitPresent,
      supportEmailReadinessChanges: localFixes.supportEmailReadiness,
      supportEmailCommitPresent: localFixes.supportEmailCommitPresent,
      packageScripts: localFixes.packageScripts,
    },
    expectedLatestMainProductionBehavior: {
      sitemapUrlCount: expectedSitemap.total,
      printUrlCount: expectedSitemap.print,
      bookUrlCount: expectedSitemap.book,
      audiobookUrlCount: expectedSitemap.audiobook,
      printRoutes: printRoutePaths.map((pathname) => ({
        pathname,
        expectedStatus: 200,
        expectedSuitabilityNotes: true,
      })),
      contactSupportEmail: supportEmail,
    },
    localSitemapResult: {
      exists: localFixes.localSitemap.exists,
      snapshot: localFixes.localSitemap.snapshot,
      malformed: localFixes.localSitemap.malformed,
      matchesExpected: sitemapMatchesExpected(localFixes.localSitemap.snapshot),
    },
    currentLiveProductionBehavior: {
      productionHost,
      home: production.home,
      sitemap: production.sitemap,
      printRoutes: production.printRoutes,
      contact: production.contact,
      sources: production.sources,
      staleCountMatchesPreviouslyObserved: staleExpected,
    },
    sitemapFreshnessResult: {
      liveSitemapLatest: classification.liveSitemapLatest,
      localSitemap: localFixes.localSitemap.snapshot,
      liveSitemap: production.sitemap.snapshot,
      expectedSitemap,
    },
    printRouteFreshnessResult: {
      livePrintLatest: classification.livePrintLatest,
      printRoutes: production.printRoutes,
    },
    contactPolicyFreshnessResult: {
      liveContactFresh: classification.liveContactFresh,
      contact: production.contact,
      sources: production.sources,
    },
    assetHostResult: {
      assetHost,
      liveAssetHostOk: classification.liveAssetHostOk,
      publicManifest: production.assetHost.publicManifest,
      uploadManifest: production.assetHost.uploadManifest,
    },
    netlifyConfigInspectionResult: {
      ...netlifyConfig,
      deploysFromMainLocallyProven: null,
      deploysFromMainLocallyProvenNote:
        "Production branch selection is a Netlify site setting and is not declared in this repo's netlify.toml.",
    },
    netlifyCliDashboardAvailability: {
      cliAvailable: netlifyCli.ok,
      cliVersion: netlifyCli.ok ? netlifyCli.stdout : null,
      cliUnavailableReason: netlifyCli.ok ? null : netlifyCli.error || netlifyCli.stderr || "unavailable",
      dashboardRequired: !netlifyCli.ok,
    },
    liveHttpHeadersUsefulForDeployState: production.headerSamples,
    exactLikelyCause,
    fixesMade,
    remainingBlockers: classification.blockers,
    requiredOwnerAction,
    recommendedNextStep,
  };

  const md = `# Production Deploy Staleness Diagnosis

Generated: ${generatedAt}

## 1. Executive result

${executive}

## 2. Local main/HEAD result

- Current branch: ${currentBranch}
- Local HEAD: ${localHead}
- Local HEAD matches origin/main: ${formatBoolean(localHead === originMainHead)}
- Local HEAD contains expected main ${expectedMainHead}: ${formatBoolean(hasAncestor(expectedMainHead))}
- Print-route lightweight SSR fix: ${formatBoolean(localFixes.printRouteLightweightSsrFix)}
- Sitemap 1,682 correction: ${formatBoolean(localFixes.sitemapCountCorrection)}
- ${supportEmail} readiness changes: ${formatBoolean(localFixes.supportEmailReadiness)}

## 3. Origin main result

- origin/main HEAD: ${originMainHead}
- Expected main HEAD for this diagnosis: ${expectedMainHead}

## 4. Expected latest-main production behavior

- Sitemap URL count: ${expectedSitemap.total}
- Book URL count: ${expectedSitemap.book}
- Audiobook URL count: ${expectedSitemap.audiobook}
- Print URL count: ${expectedSitemap.print}
- Sampled print routes return HTTP 200 and show suitability notes.
- /contact and /sources expose ${supportEmail} plus source concern paths.

## 5. Current live production behavior

- Home: HTTP ${production.home.status ?? "fetch error"}
- /contact: HTTP ${production.contact.status ?? "fetch error"}; support email ${formatBoolean(production.contact.exposesSupportEmail)}
- /sources: HTTP ${production.sources.status ?? "fetch error"}; support/correction/takedown/report concern path ${formatBoolean(classification.liveContactFresh)}

## 6. Sitemap freshness result

- Local sitemap: ${statusLabel(localFixes.localSitemap.snapshot)}
- Live sitemap: ${statusLabel(production.sitemap.snapshot)}
- Live sitemap latest: ${formatBoolean(classification.liveSitemapLatest)}

## 7. Print-route freshness result

${formatPrintRoutes(production.printRoutes)}

## 8. Contact/policy freshness result

- Contact support email: ${formatBoolean(production.contact.exposesSupportEmail)}
- Contact mailto: ${formatBoolean(production.contact.exposesMailto)}
- Sources support email: ${formatBoolean(production.sources.exposesSupportEmail)}
- Sources correction path: ${formatBoolean(production.sources.exposesCorrectionPath)}
- Sources takedown path: ${formatBoolean(production.sources.exposesTakedownPath)}
- Sources report/concern path: ${formatBoolean(production.sources.exposesReportConcernPath)}

## 9. Netlify/config inspection result

- Netlify build command: ${netlifyConfig.buildCommand ?? "not found"}
- Netlify publish directory: ${netlifyConfig.publishDirectory ?? "not found"}
- public/sitemap.xml exists locally: ${formatBoolean(netlifyConfig.publicSitemapExists)}
- build/client sitemap snapshot, if present: ${statusLabel(netlifyConfig.buildClientSitemap)}
- React Router Netlify function present: ${formatBoolean(netlifyConfig.reactRouterNetlifyFunctionPresent)}
- React Router Netlify function preferStatic: ${formatBoolean(netlifyConfig.reactRouterNetlifyFunctionPreferStatic)}
- GitHub workflow files found locally: ${netlifyConfig.githubWorkflowFiles.length}
- Production branch is not declared in netlify.toml; verify it in the Netlify dashboard.

## 10. Netlify CLI/dashboard availability

- Netlify CLI available: ${formatBoolean(netlifyCli.ok)}
- Netlify CLI detail: ${netlifyCli.ok ? netlifyCli.stdout : netlifyCli.error || netlifyCli.stderr || "unavailable"}
- Dashboard verification required: ${formatBoolean(!netlifyCli.ok)}

## 11. Exact likely cause

${exactLikelyCause}

## 12. Fixes made, if any

${fixesMade.map((item) => `- ${item}`).join("\n")}

## 13. Remaining blockers

${classification.blockers.length > 0 ? classification.blockers.map((item) => `- ${item}`).join("\n") : "- None"}

## 14. Required owner action

${requiredOwnerAction}

## 15. Recommended next step

${recommendedNextStep}

## Live HTTP headers useful for deploy/cache identification

### Home

${formatHeaders(production.headerSamples.home)}

### Sitemap

${formatHeaders(production.headerSamples.sitemap)}

### First sampled print route

${formatHeaders(production.headerSamples.firstPrintRoute)}
`;

  writeReports(report, md);

  console.log(executive);
  console.log(`Local HEAD: ${localHead}`);
  console.log(`origin/main: ${originMainHead}`);
  console.log(`Local sitemap: ${statusLabel(localFixes.localSitemap.snapshot)}`);
  console.log(`Live sitemap: ${statusLabel(production.sitemap.snapshot)}`);
  for (const route of production.printRoutes) {
    console.log(`${route.pathname}: HTTP ${route.status ?? "fetch error"}`);
  }
  console.log(`Netlify CLI available: ${netlifyCli.ok ? "yes" : "no"}`);
  console.log(`Likely cause: ${exactLikelyCause}`);

  if (classification.status !== "passed") {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exitCode = 1;
});
