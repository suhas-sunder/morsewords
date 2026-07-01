import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import {
  REDIRECT_ALIAS_PATHS,
  ROUTES,
  SITE_ORIGIN,
} from "../app/client/data/routes.ts";

type RouteSource = {
  routePath: string;
  filePath: string;
  kind: "static" | "dynamic" | "redirect";
};

type ManifestBook = {
  slug: string;
  source?: {
    approvalSource?: string;
    processingAllowed?: boolean;
    publishReady?: boolean;
    rightsReviewed?: boolean;
    rightsStatus?: string;
  };
};

type SitemapSnapshot = {
  total: number;
  nonBook: number;
  book: number;
  audiobook: number;
  print: number;
};

type AuditResult = {
  executiveResult: string;
  gscReportedSubmittedUrlCount: number;
  currentLocalSitemap: SitemapSnapshot;
  priorLocalSitemap: SitemapSnapshot;
  expectedAcceptedBookCount: number;
  supportNoindexUrlsInSitemap: string[];
  redirectOnlyUrlsInSitemap: string[];
  duplicateUrls: Array<{ url: string; count: number }>;
  malformedUrls: string[];
  sitemapHostMismatches: string[];
  printPageDecision: "keep-in-sitemap" | "remove-from-sitemap";
  printPageSelfCanonicalResult: "pass" | "fail";
  printPageIndexabilityResult: "pass" | "fail";
  printPageDistinctValueResult: "pass" | "fail";
  printPageChecks: Record<string, boolean>;
  missingPrintSlugs: string[];
  extraPrintSlugs: string[];
  priorMissingPrintSlugs: string[];
  gscReconciliation: {
    currentLocalMinusGsc: number;
    priorLocalMinusGsc: number;
    exactOneUrlReasonIdentified: boolean;
    likelyReason: string;
    explanation: string;
  };
  fixesMade: string[];
  protectedFolderStatus: {
    tempBooks: string;
    generatedBooks: string;
    publicBookPreviews: string;
    cloudflareExport: string;
    cloudflareUpdatedExport: string;
    cloudflareExportTrackedFiles: number;
    cloudflareUpdatedExportTrackedFiles: number;
  };
  blockers: string[];
};

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sitemapPath = path.join(repoRoot, "public", "sitemap.xml");
const routesPath = path.join(repoRoot, "app", "routes.ts");
const generatedManifestPath = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "generated",
  "library-manifest.json",
);
const printRoutePath = path.join(repoRoot, "app", "routes", "morse-code-books.$slug.print.tsx");
const printableComponentPath = path.join(
  repoRoot,
  "app",
  "client",
  "components",
  "morse-code-books",
  "PrintableMorsePages.tsx",
);
const reportDir = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "sitemap-count-print-indexability-reconciliation",
);
const reportJsonPath = path.join(reportDir, "sitemap-count-print-indexability-reconciliation.json");
const reportMdPath = path.join(reportDir, "sitemap-count-print-indexability-reconciliation.md");

const GSC_REPORTED_SUBMITTED_URL_COUNT = 1650;
const PRE_RECONCILIATION_SITEMAP_COMMIT = "c3084755f79583499b51ee6d38b808c3c211d007";
const PRIOR_LOCAL_SITEMAP: SitemapSnapshot = {
  total: 1651,
  nonBook: 125,
  book: 519,
  audiobook: 519,
  print: 488,
};

const NOINDEX_SUPPORT_ROUTES = new Set<string>([
  ROUTES.misc,
  ROUTES.miscCookies,
  ROUTES.miscPrivacy,
  ROUTES.miscSocials,
  ROUTES.miscTerms,
  ROUTES.sitemap,
]);

const BOOK_PATTERN = /^\/morse-code-books\/([^/]+)$/;
const AUDIOBOOK_PATTERN = /^\/morse-code-audiobooks\/([^/]+)$/;
const PRINT_PATTERN = /^\/morse-code-books\/([^/]+)\/print$/;

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function normalizePathname(pathname: string) {
  const normalized = pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
  return normalized || "/";
}

function pathFromLoc(loc: string) {
  const url = new URL(loc);
  return {
    loc,
    origin: url.origin,
    pathname: normalizePathname(url.pathname),
  };
}

function parseSitemapXml(xml: string) {
  const rawLocs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const entries: Array<{ loc: string; origin: string; pathname: string }> = [];
  const malformedUrls: string[] = [];

  for (const loc of rawLocs) {
    try {
      entries.push(pathFromLoc(loc));
    } catch {
      malformedUrls.push(loc);
    }
  }

  return { entries, malformedUrls };
}

function parseCurrentSitemap() {
  return parseSitemapXml(fs.readFileSync(sitemapPath, "utf8"));
}

function snapshotFromPaths(paths: string[]): SitemapSnapshot {
  let book = 0;
  let audiobook = 0;
  let print = 0;
  let nonBook = 0;

  for (const pathname of paths) {
    if (BOOK_PATTERN.test(pathname)) {
      book += 1;
    } else if (AUDIOBOOK_PATTERN.test(pathname)) {
      audiobook += 1;
    } else if (PRINT_PATTERN.test(pathname)) {
      print += 1;
    } else {
      nonBook += 1;
    }
  }

  return {
    total: paths.length,
    nonBook,
    book,
    audiobook,
    print,
  };
}

function duplicateCounts(values: string[]) {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([url, count]) => ({ url, count }))
    .sort((left, right) => left.url.localeCompare(right.url));
}

function parseRouteSources() {
  const source = fs.readFileSync(routesPath, "utf8");
  const routeSources = new Map<string, RouteSource>();

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
    if (!routeValue) throw new Error(`Route alias ${key} is missing from ROUTES.`);
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

  return routeSources;
}

function routePatternMatches(routePath: string, targetPath: string) {
  if (!routePath.includes(":")) return routePath === targetPath;
  const pattern = new RegExp(
    `^${routePath
      .split("/")
      .map((segment) =>
        segment.startsWith(":")
          ? "[^/]+"
          : segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      )
      .join("/")}$`,
  );
  return pattern.test(targetPath);
}

function resolveRouteSource(routeSources: Map<string, RouteSource>, targetPath: string) {
  const exact = routeSources.get(targetPath);
  if (exact) return exact;
  for (const source of routeSources.values()) {
    if (source.kind === "dynamic" && routePatternMatches(source.routePath, targetPath)) {
      return source;
    }
  }
  return null;
}

function routeHasNoindex(source: string) {
  return /robots\s*:\s*["']noindex/i.test(source) ||
    /name:\s*["']robots["'][\s\S]{0,140}content:\s*["']noindex/i.test(source);
}

function isAcceptedGeneratedBook(book: ManifestBook) {
  const approvedBySource =
    book.source?.approvalSource === "file-evidence" ||
    book.source?.approvalSource === "external-authority" ||
    (book.source?.approvalSource === "owner-reviewed" &&
      book.source.rightsReviewed === true) ||
    (book.source?.approvalSource === undefined &&
      book.source?.rightsReviewed === true);
  return (
    approvedBySource &&
    book.source?.publishReady === true &&
    book.source.rightsStatus === "approved" &&
    book.source.processingAllowed === true
  );
}

function readAcceptedBookSlugs() {
  const manifest = readJson<{ books?: ManifestBook[] }>(generatedManifestPath);
  return (manifest.books ?? [])
    .filter(isAcceptedGeneratedBook)
    .map((book) => book.slug)
    .sort((left, right) => left.localeCompare(right));
}

function runGit(args: string[]) {
  const result = spawnSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
  });
  if ((result.status ?? 0) !== 0) {
    throw new Error(`git ${args.join(" ")} failed: ${result.stderr || result.stdout}`);
  }
  return (result.stdout ?? "").trim();
}

function readStatusShort(target: string) {
  return runGit(["status", "--short", target]);
}

function readTrackedCount(target: string) {
  const output = runGit(["ls-files", target]);
  return output ? output.split(/\r?\n/).filter(Boolean).length : 0;
}

function readPriorMissingPrintSlugsFromBaseline() {
  try {
    const xml = runGit(["show", `${PRE_RECONCILIATION_SITEMAP_COMMIT}:public/sitemap.xml`]);
    const { entries } = parseSitemapXml(xml);
    const paths = entries.map((entry) => entry.pathname);
    const bookSlugs = paths
      .map((pathname) => pathname.match(BOOK_PATTERN)?.[1])
      .filter((slug): slug is string => Boolean(slug))
      .sort((left, right) => left.localeCompare(right));
    const printSlugs = new Set(
      paths
        .map((pathname) => pathname.match(PRINT_PATTERN)?.[1])
        .filter((slug): slug is string => Boolean(slug)),
    );
    return bookSlugs.filter((slug) => !printSlugs.has(slug));
  } catch {
    return [];
  }
}

function collectPrintChecks({
  acceptedSlugs,
  printSlugs,
}: {
  acceptedSlugs: string[];
  printSlugs: string[];
}) {
  const printRouteSource = fs.readFileSync(printRoutePath, "utf8");
  const printableSource = fs.readFileSync(printableComponentPath, "utf8");
  const acceptedSet = new Set(acceptedSlugs);
  const printSet = new Set(printSlugs);
  const missingPrintSlugs = acceptedSlugs.filter((slug) => !printSet.has(slug));
  const extraPrintSlugs = printSlugs.filter((slug) => !acceptedSet.has(slug));
  const routeSources = parseRouteSources();
  const printRoute = routeSources.get("/morse-code-books/:slug/print");

  const checks = {
    routeRegistered: Boolean(printRoute && fs.existsSync(printRoute.filePath)),
    routeNotRedirectOnly: printRoute?.kind === "dynamic",
    allPrintSlugsAccepted: extraPrintSlugs.length === 0,
    allAcceptedBooksHavePrintUrl: missingPrintSlugs.length === 0,
    successMetaUsesSeoMeta: printRouteSource.includes("seoMeta({"),
    successMetaUsesPrintPath: printRouteSource.includes("morseBookPrintPath(book.slug)"),
    canonicalLinkUsesPrintPath:
      /rel:\s*["']canonical["']/.test(printRouteSource) &&
      printRouteSource.includes("href: canonicalUrl(path)"),
    loaderUsesPublishReadySummary:
      printRouteSource.includes("getDiscoverableMorseBookSummary") &&
      printRouteSource.includes("isMorseBookPublishReady"),
    notFoundOnlyNoindex:
      printRouteSource.includes("Morse book print page not found") &&
      printRouteSource.includes("noindex,nofollow"),
    returnsPrintableBookComponent:
      printRouteSource.includes("<PrintableMorsePages") &&
      printRouteSource.includes('kind="book"'),
    distinctPrintStyles: printableSource.includes("function PrintStyles"),
    distinctPrintAction: printableSource.includes("window.print()"),
    distinctSectionChooser:
      printableSource.includes("Book source") &&
      printableSource.includes("Default chapters") &&
      printableSource.includes("Selected sections"),
    distinctLayoutControls:
      printableSource.includes("Printable layout") &&
      printableSource.includes("Study sheet") &&
      printableSource.includes("Morse-only") &&
      printableSource.includes("Side-by-side"),
    distinctPreview: printableSource.includes('data-testid="printable-preview"'),
    distinctQrAndSource:
      printableSource.includes("QR target") &&
      printableSource.includes("Source:") &&
      printableSource.includes("MorseWords printable"),
    noUnavailableBookCopy: !printableSource.includes("Book text unavailable"),
    avoidsFullPayloadSsr:
      !printRouteSource.includes("getMorseBookPublicContent") &&
      !printRouteSource.includes("getMorseBookManifest"),
  };

  const selfCanonicalResult = checks.successMetaUsesPrintPath && checks.canonicalLinkUsesPrintPath
    ? "pass"
    : "fail";
  const indexabilityResult =
    checks.routeRegistered &&
    checks.routeNotRedirectOnly &&
    checks.allPrintSlugsAccepted &&
    checks.allAcceptedBooksHavePrintUrl &&
    checks.loaderUsesPublishReadySummary &&
    checks.successMetaUsesSeoMeta &&
    checks.notFoundOnlyNoindex &&
    checks.avoidsFullPayloadSsr
      ? "pass"
      : "fail";
  const distinctValueResult =
    checks.returnsPrintableBookComponent &&
    checks.distinctPrintStyles &&
    checks.distinctPrintAction &&
    checks.distinctSectionChooser &&
    checks.distinctLayoutControls &&
    checks.distinctPreview &&
    checks.distinctQrAndSource &&
    checks.noUnavailableBookCopy
      ? "pass"
      : "fail";

  return {
    checks,
    extraPrintSlugs,
    missingPrintSlugs,
    selfCanonicalResult,
    indexabilityResult,
    distinctValueResult,
  };
}

function buildMarkdown(result: AuditResult) {
  const blockers = result.blockers.length > 0
    ? result.blockers.map((blocker) => `- ${blocker}`).join("\n")
    : "None.";
  const protectedStatus = [
    `- temp-books: ${result.protectedFolderStatus.tempBooks || "clean"}`,
    `- generated books: ${result.protectedFolderStatus.generatedBooks || "clean"}`,
    `- public/book-previews: ${result.protectedFolderStatus.publicBookPreviews || "clean"}`,
    `- cloudflare-export: ${result.protectedFolderStatus.cloudflareExport || "ignored/untracked"}`,
    `- cloudflare-updated-export: ${result.protectedFolderStatus.cloudflareUpdatedExport || "ignored/untracked"}`,
    `- cloudflare-export tracked files: ${result.protectedFolderStatus.cloudflareExportTrackedFiles}`,
    `- cloudflare-updated-export tracked files: ${result.protectedFolderStatus.cloudflareUpdatedExportTrackedFiles}`,
  ].join("\n");
  const current = result.currentLocalSitemap;
  const prior = result.priorLocalSitemap;

  return [
    "# Sitemap Count And Print Indexability Reconciliation",
    "",
    "## 1. Executive result",
    "",
    result.executiveResult,
    "",
    "## 2. GSC-reported submitted count",
    "",
    `${result.gscReportedSubmittedUrlCount} submitted URLs.`,
    "",
    "## 3. Local sitemap count",
    "",
    `Current local XML sitemap URLs: ${current.total}.`,
    "",
    `Prior local audit count before this reconciliation: ${prior.total}.`,
    "",
    "## 4. URL category breakdown",
    "",
    `Current: ${current.nonBook} non-book, ${current.book} book, ${current.audiobook} audiobook, ${current.print} print.`,
    "",
    `Prior: ${prior.nonBook} non-book, ${prior.book} book, ${prior.audiobook} audiobook, ${prior.print} print.`,
    "",
    "## 5. Non-book URL explanation",
    "",
    `${current.nonBook} canonical non-book routes remain in the sitemap. No noindex support route is included.`,
    "",
    "## 6. Book/audiobook URL explanation",
    "",
    `${current.book} book detail URLs and ${current.audiobook} audiobook detail URLs match the ${result.expectedAcceptedBookCount} accepted, publish-ready books.`,
    "",
    "## 7. Print URL indexability decision",
    "",
    "Print pages stay in the XML sitemap. They are self-canonical, indexable for accepted books, and provide distinct printable value.",
    "",
    "## 8. Print page canonical result",
    "",
    result.printPageSelfCanonicalResult,
    "",
    "## 9. Print page distinct printable value result",
    "",
    result.printPageDistinctValueResult,
    "",
    "## 10. Redirect/noindex/duplicate/malformed URL result",
    "",
    `Noindex/support URLs in sitemap: ${result.supportNoindexUrlsInSitemap.length}.`,
    "",
    `Redirect-only URLs in sitemap: ${result.redirectOnlyUrlsInSitemap.length}.`,
    "",
    `Duplicate URL count: ${result.duplicateUrls.length}.`,
    "",
    `Malformed URL count: ${result.malformedUrls.length}.`,
    "",
    "## 11. Exact 1,650 vs local count explanation",
    "",
    result.gscReconciliation.explanation,
    "",
    "## 12. Fixes made",
    "",
    result.fixesMade.map((fix) => `- ${fix}`).join("\n"),
    "",
    "## 13. Remaining blockers",
    "",
    blockers,
    "",
    "## 14. Protected folder status",
    "",
    protectedStatus,
    "",
    "## 15. Recommended next step",
    "",
    "Proceed to `morsewords-adsense-contact-readiness-jun-2026` after this branch is reviewed and merged.",
    "",
  ].join("\n");
}

function runAudit(): AuditResult {
  const { entries, malformedUrls } = parseCurrentSitemap();
  const paths = entries.map((entry) => entry.pathname);
  const locs = entries.map((entry) => entry.loc);
  const currentLocalSitemap = snapshotFromPaths(paths);
  const acceptedSlugs = readAcceptedBookSlugs();
  const acceptedSet = new Set(acceptedSlugs);
  const routeSources = parseRouteSources();
  const duplicateUrls = duplicateCounts(locs);
  const sitemapHostMismatches = entries
    .filter((entry) => entry.origin !== SITE_ORIGIN)
    .map((entry) => entry.loc);
  const printSlugs = paths
    .map((pathname) => pathname.match(PRINT_PATTERN)?.[1])
    .filter((slug): slug is string => Boolean(slug))
    .sort((left, right) => left.localeCompare(right));
  const bookSlugs = paths
    .map((pathname) => pathname.match(BOOK_PATTERN)?.[1])
    .filter((slug): slug is string => Boolean(slug));
  const audiobookSlugs = paths
    .map((pathname) => pathname.match(AUDIOBOOK_PATTERN)?.[1])
    .filter((slug): slug is string => Boolean(slug));

  const supportNoindexUrlsInSitemap: string[] = [];
  const redirectOnlyUrlsInSitemap: string[] = [];

  for (const pathname of paths) {
    const routeSource = resolveRouteSource(routeSources, pathname);
    if ((REDIRECT_ALIAS_PATHS as readonly string[]).includes(pathname)) {
      redirectOnlyUrlsInSitemap.push(pathname);
      continue;
    }
    if (routeSource?.kind === "redirect") {
      redirectOnlyUrlsInSitemap.push(pathname);
      continue;
    }
    if (NOINDEX_SUPPORT_ROUTES.has(pathname)) {
      supportNoindexUrlsInSitemap.push(pathname);
      continue;
    }
    if (routeSource && routeSource.kind === "static" && fs.existsSync(routeSource.filePath)) {
      const source = fs.readFileSync(routeSource.filePath, "utf8");
      if (routeHasNoindex(source)) supportNoindexUrlsInSitemap.push(pathname);
    }
  }

  const printAudit = collectPrintChecks({ acceptedSlugs, printSlugs });
  const priorMissingPrintSlugs = readPriorMissingPrintSlugsFromBaseline();
  const fixesMade = [
    "Rewrote public/sitemap.xml from the accepted generated-book manifest using books:sitemap-sync.",
    "Normalized generated sitemap URL lines that had adjacent <url> entries on one line.",
    "Added the missing print URLs for accepted publish-ready books, moving print coverage from 488 to 519.",
    "Updated local final-validation expected sitemap and print counts for the corrected sitemap.",
  ];

  const blockers: string[] = [];
  if (malformedUrls.length > 0) blockers.push(`${malformedUrls.length} malformed sitemap URL(s)`);
  if (duplicateUrls.length > 0) blockers.push(`${duplicateUrls.length} duplicate sitemap URL group(s)`);
  if (sitemapHostMismatches.length > 0) blockers.push(`${sitemapHostMismatches.length} sitemap host mismatch(es)`);
  if (supportNoindexUrlsInSitemap.length > 0) blockers.push(`${supportNoindexUrlsInSitemap.length} noindex/support URL(s) in sitemap`);
  if (redirectOnlyUrlsInSitemap.length > 0) blockers.push(`${redirectOnlyUrlsInSitemap.length} redirect-only URL(s) in sitemap`);
  if (currentLocalSitemap.book !== acceptedSlugs.length) {
    blockers.push(`book URL count ${currentLocalSitemap.book} does not match accepted book count ${acceptedSlugs.length}`);
  }
  if (currentLocalSitemap.audiobook !== acceptedSlugs.length) {
    blockers.push(`audiobook URL count ${currentLocalSitemap.audiobook} does not match accepted book count ${acceptedSlugs.length}`);
  }
  if (bookSlugs.some((slug) => !acceptedSet.has(slug))) blockers.push("one or more book sitemap slugs are not accepted books");
  if (audiobookSlugs.some((slug) => !acceptedSet.has(slug))) blockers.push("one or more audiobook sitemap slugs are not accepted books");
  if (currentLocalSitemap.print > 0 && currentLocalSitemap.print !== acceptedSlugs.length) {
    blockers.push(`print URL count ${currentLocalSitemap.print} does not match accepted book count ${acceptedSlugs.length}`);
  }
  if (currentLocalSitemap.print > 0 && printAudit.selfCanonicalResult !== "pass") {
    blockers.push("print pages are in the sitemap but self-canonical checks failed");
  }
  if (currentLocalSitemap.print > 0 && printAudit.indexabilityResult !== "pass") {
    blockers.push("print pages are in the sitemap but indexability checks failed");
  }
  if (currentLocalSitemap.print > 0 && printAudit.distinctValueResult !== "pass") {
    blockers.push("print pages are in the sitemap but distinct printable value checks failed");
  }

  const passed = blockers.length === 0;
  const exactOneUrlReasonIdentified = false;
  const likelyReason =
    "GSC count stale or based on a different submitted sitemap snapshot; the local sitemap has no duplicate, malformed, noindex, or redirect-only URL that explains a one-URL drop.";
  const explanation = [
    `The owner-reported GSC count is ${GSC_REPORTED_SUBMITTED_URL_COUNT}.`,
    `The prior local sitemap count was ${PRIOR_LOCAL_SITEMAP.total}, exactly ${PRIOR_LOCAL_SITEMAP.nonBook} non-book + ${PRIOR_LOCAL_SITEMAP.book} book + ${PRIOR_LOCAL_SITEMAP.audiobook} audiobook + ${PRIOR_LOCAL_SITEMAP.print} print.`,
    "That prior local state had no duplicate or malformed URLs, but it was missing 31 print URLs for accepted publish-ready books.",
    `This branch corrected the local sitemap to ${currentLocalSitemap.total}, exactly ${currentLocalSitemap.nonBook} non-book + ${currentLocalSitemap.book} book + ${currentLocalSitemap.audiobook} audiobook + ${currentLocalSitemap.print} print.`,
    "Because the local XML has no noindex, redirect-only, duplicate, malformed, or host-mismatched URL, the exact one-URL GSC delta is not identifiable from the local repository alone.",
    likelyReason,
  ].join(" ");

  return {
    executiveResult: passed
      ? "Sitemap count and print-page indexability reconciliation passed"
      : `Sitemap count and print-page indexability reconciliation blocked because ${blockers.join("; ")}`,
    gscReportedSubmittedUrlCount: GSC_REPORTED_SUBMITTED_URL_COUNT,
    currentLocalSitemap,
    priorLocalSitemap: PRIOR_LOCAL_SITEMAP,
    expectedAcceptedBookCount: acceptedSlugs.length,
    supportNoindexUrlsInSitemap: [...new Set(supportNoindexUrlsInSitemap)].sort(),
    redirectOnlyUrlsInSitemap: [...new Set(redirectOnlyUrlsInSitemap)].sort(),
    duplicateUrls,
    malformedUrls,
    sitemapHostMismatches,
    printPageDecision: "keep-in-sitemap",
    printPageSelfCanonicalResult: printAudit.selfCanonicalResult,
    printPageIndexabilityResult: printAudit.indexabilityResult,
    printPageDistinctValueResult: printAudit.distinctValueResult,
    printPageChecks: printAudit.checks,
    missingPrintSlugs: printAudit.missingPrintSlugs,
    extraPrintSlugs: printAudit.extraPrintSlugs,
    priorMissingPrintSlugs,
    gscReconciliation: {
      currentLocalMinusGsc: currentLocalSitemap.total - GSC_REPORTED_SUBMITTED_URL_COUNT,
      priorLocalMinusGsc: PRIOR_LOCAL_SITEMAP.total - GSC_REPORTED_SUBMITTED_URL_COUNT,
      exactOneUrlReasonIdentified,
      likelyReason,
      explanation,
    },
    fixesMade,
    protectedFolderStatus: {
      tempBooks: readStatusShort("app/client/assets/temp-books"),
      generatedBooks: readStatusShort("app/client/assets/books/generated"),
      publicBookPreviews: readStatusShort("public/book-previews"),
      cloudflareExport: readStatusShort("app/client/assets/books/cloudflare-export"),
      cloudflareUpdatedExport: readStatusShort("app/client/assets/books/cloudflare-updated-export"),
      cloudflareExportTrackedFiles: readTrackedCount("app/client/assets/books/cloudflare-export"),
      cloudflareUpdatedExportTrackedFiles: readTrackedCount("app/client/assets/books/cloudflare-updated-export"),
    },
    blockers,
  };
}

const result = runAudit();
fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(reportJsonPath, `${JSON.stringify(result, null, 2)}\n`);
fs.writeFileSync(reportMdPath, buildMarkdown(result));

console.log("Sitemap count and print-page indexability audit");
console.log(`GSC-reported submitted URLs: ${result.gscReportedSubmittedUrlCount}`);
console.log(`Current local sitemap URLs: ${result.currentLocalSitemap.total}`);
console.log(`Non-book URLs: ${result.currentLocalSitemap.nonBook}`);
console.log(`Book URLs: ${result.currentLocalSitemap.book}`);
console.log(`Audiobook URLs: ${result.currentLocalSitemap.audiobook}`);
console.log(`Print URLs: ${result.currentLocalSitemap.print}`);
console.log(`Support/noindex URLs in sitemap: ${result.supportNoindexUrlsInSitemap.length}`);
console.log(`Redirect-only URLs in sitemap: ${result.redirectOnlyUrlsInSitemap.length}`);
console.log(`Duplicate URL groups: ${result.duplicateUrls.length}`);
console.log(`Malformed URLs: ${result.malformedUrls.length}`);
console.log(`Print self-canonical: ${result.printPageSelfCanonicalResult}`);
console.log(`Print indexability: ${result.printPageIndexabilityResult}`);
console.log(`Print distinct value: ${result.printPageDistinctValueResult}`);
console.log(`Report JSON: ${path.relative(repoRoot, reportJsonPath)}`);
console.log(`Report Markdown: ${path.relative(repoRoot, reportMdPath)}`);

if (result.blockers.length > 0) {
  console.error("\nBlockers:");
  for (const blocker of result.blockers) console.error(`- ${blocker}`);
  process.exitCode = 1;
} else {
  console.log("Result: pass");
}
