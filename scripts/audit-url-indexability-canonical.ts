import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  CANONICAL_ROUTE_PATHS,
  REDIRECT_ALIAS_PATHS,
  ROUTES,
  SITE_ORIGIN,
} from "../app/client/data/routes.ts";

type RouteSource = {
  routePath: string;
  filePath: string;
  kind: "static" | "dynamic" | "redirect";
};

type LinkIssue = {
  sourceFile: string;
  target: string;
  reason: string;
};

type AuditResult = {
  totalRouteCountInspected: number;
  sitemapUrlCount: number;
  indexablePageCount: number;
  noindexSupportRouteCount: number;
  redirectRouteCount: number;
  dynamicBookRouteCount: number;
  dynamicAudiobookRouteCount: number;
  internalOnlyRouteCount: number;
  missingRouteCount: number;
  canonicalMismatchCount: number;
  noindexInSitemapCount: number;
  duplicateCanonicalCount: number;
  brokenInternalLinkCount: number;
  redirectInternalLinkCount: number;
  trailingSlashInternalLinkCount: number;
  bookUrlCount: number;
  audiobookUrlCount: number;
  printableBookUrlCount: number;
  generatedBookCount: number;
  seoSummaryCount: number;
  startupPreviewCount: number;
  deferredBlockedSlugExposureCount: number;
  metadataMissingCount: number;
  sitemapHostMismatchCount: number;
  robotsSitemapResult: "pass" | "fail";
  trailingSlashRedirectResult: "pass" | "fail";
  issues: {
    missingRoutes: string[];
    canonicalMismatches: string[];
    noindexInSitemap: string[];
    duplicateCanonicals: string[];
    brokenInternalLinks: LinkIssue[];
    redirectInternalLinks: LinkIssue[];
    trailingSlashInternalLinks: LinkIssue[];
    deferredBlockedSlugExposures: string[];
    missingMetadata: string[];
    sitemapHostMismatches: string[];
  };
};

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appRoutesPath = path.join(repoRoot, "app", "routes.ts");
const sitemapPath = path.join(repoRoot, "public", "sitemap.xml");
const robotsPath = path.join(repoRoot, "public", "robots.txt");
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
const previewDir = path.join(repoRoot, "public", "book-previews");
const decisionCheckpointPath = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "book-library-decision-checkpoint",
  "book-library-decision-checkpoint.json",
);

const NOINDEX_SUPPORT_ROUTES = new Set<string>([
  ROUTES.misc,
  ROUTES.miscCookies,
  ROUTES.miscPrivacy,
  ROUTES.miscSocials,
  ROUTES.miscTerms,
  ROUTES.sitemap,
]);

const INTERNAL_ONLY_ROUTES = new Set<string>([
  "/llms.txt",
  "/llms-full.txt",
  "/morse-book-content/books/:slug",
]);

const STATIC_PUBLIC_FILES = new Set<string>([
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.ico",
  "/site.webmanifest",
  "/manifest.webmanifest",
]);

const GENERATED_BOOK_PATTERN = /^\/morse-code-books\/([^/]+)$/;
const PRINTABLE_BOOK_PATTERN = /^\/morse-code-books\/([^/]+)\/print$/;
const AUDIOBOOK_PATTERN = /^\/morse-code-audiobooks\/([^/]+)$/;

function normalizePathname(pathname: string) {
  const normalized = pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
  return normalized || "/";
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
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

function parseRouteSources() {
  const source = fs.readFileSync(appRoutesPath, "utf8");
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

  return routeSources;
}

function countSeoSummaries() {
  const registry = readJson<{ summaries?: unknown[] }>(seoSummaryPath);
  return registry.summaries?.length ?? 0;
}

function readGeneratedSlugs() {
  const manifest = readJson<{ books?: Array<{ slug: string }> }>(generatedManifestPath);
  return new Set((manifest.books ?? []).map((book) => book.slug));
}

function countStartupPreviews() {
  return fs.readdirSync(previewDir).filter((name) => name.endsWith(".preview.json")).length;
}

function routeHasMetadata(source: string) {
  return (
    /\bmeta\s*\(/.test(source) ||
    /\bmeta\s*:/.test(source) ||
    /\bseoMeta\s*\(/.test(source) ||
    /export\s+const\s+meta\b/.test(source) ||
    /export\s+function\s+meta\b/.test(source)
  );
}

function routeHasCanonical(source: string) {
  return (
    /rel:\s*["']canonical["']/.test(source) ||
    /rel=["']canonical["']/.test(source) ||
    /tagName:\s*["']link["'][\s\S]{0,160}rel:\s*["']canonical["']/.test(source) ||
    /canonicalUrl\(/.test(source) ||
    /absoluteUrl\(/.test(source)
  );
}

function routeHasNoindex(source: string) {
  return /robots\s*:\s*["']noindex/i.test(source) ||
    /name:\s*["']robots["'][\s\S]{0,120}content:\s*["']noindex/i.test(source);
}

function routePatternMatches(routePath: string, targetPath: string) {
  if (!routePath.includes(":")) return routePath === targetPath;
  const pattern = new RegExp(
    `^${routePath
      .split("/")
      .map((segment) => (segment.startsWith(":") ? "[^/]+" : segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
      .join("/")}$`,
  );
  return pattern.test(targetPath);
}

function resolveRouteSource(
  routeSources: Map<string, RouteSource>,
  targetPath: string,
) {
  const exact = routeSources.get(targetPath);
  if (exact) return exact;
  for (const source of routeSources.values()) {
    if (source.kind === "dynamic" && routePatternMatches(source.routePath, targetPath)) {
      return source;
    }
  }
  return null;
}

function isStaticAssetPath(targetPath: string) {
  if (STATIC_PUBLIC_FILES.has(targetPath)) return true;
  if (targetPath.startsWith("/assets/")) return true;
  if (targetPath.startsWith("/og/")) return true;
  if (targetPath.startsWith("/book-previews/")) return true;
  if (/\.(?:png|jpe?g|webp|gif|svg|ico|css|js|json|xml|txt|pdf|woff2?)$/i.test(targetPath)) {
    return true;
  }
  return false;
}

function isValidPublicPath({
  targetPath,
  routeSources,
  generatedSlugs,
}: {
  targetPath: string;
  routeSources: Map<string, RouteSource>;
  generatedSlugs: Set<string>;
}) {
  if (targetPath === "/") return true;
  if (isStaticAssetPath(targetPath)) return true;
  if (routeSources.has(targetPath)) return true;

  const bookMatch = targetPath.match(GENERATED_BOOK_PATTERN);
  if (bookMatch) return generatedSlugs.has(bookMatch[1]);

  const printMatch = targetPath.match(PRINTABLE_BOOK_PATTERN);
  if (printMatch) return generatedSlugs.has(printMatch[1]);

  const audiobookMatch = targetPath.match(AUDIOBOOK_PATTERN);
  if (audiobookMatch) return generatedSlugs.has(audiobookMatch[1]);

  return false;
}

function collectSourceFiles(root: string) {
  const output: string[] = [];
  const ignoredDirs = new Set([
    "assets",
    "node_modules",
    ".git",
    "build",
    ".netlify",
  ]);

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (ignoredDirs.has(entry.name)) continue;
        walk(path.join(dir, entry.name));
        continue;
      }
      if (!/\.(?:ts|tsx|js|jsx)$/.test(entry.name)) continue;
      output.push(path.join(dir, entry.name));
    }
  }

  walk(root);
  return output;
}

function normalizeInternalTarget(rawTarget: string) {
  if (!rawTarget.startsWith("/") || rawTarget.startsWith("//")) return null;
  const [withoutHash] = rawTarget.split("#");
  const [withoutQuery] = withoutHash.split("?");
  return normalizePathname(withoutQuery || "/");
}

function collectInternalLinkIssues({
  routeSources,
  generatedSlugs,
}: {
  routeSources: Map<string, RouteSource>;
  generatedSlugs: Set<string>;
}) {
  const brokenInternalLinks: LinkIssue[] = [];
  const redirectInternalLinks: LinkIssue[] = [];
  const trailingSlashInternalLinks: LinkIssue[] = [];
  const sourceFiles = [
    ...collectSourceFiles(path.join(repoRoot, "app", "routes")),
    ...collectSourceFiles(path.join(repoRoot, "app", "client")),
  ];

  const staticLinkPatterns = [
    /\b(?:href|to)\s*=\s*["']([^"']+)["']/g,
    /\b(?:href|to)\s*:\s*["']([^"']+)["']/g,
  ];

  for (const filePath of sourceFiles) {
    const source = fs.readFileSync(filePath, "utf8");
    const relativeFile = path.relative(repoRoot, filePath);
    for (const pattern of staticLinkPatterns) {
      for (const match of source.matchAll(pattern)) {
        const rawTarget = match[1];
        const normalized = normalizeInternalTarget(rawTarget);
        if (!normalized) continue;

        if (normalized !== "/" && /\/(?:[#?]|$)/.test(rawTarget)) {
          trailingSlashInternalLinks.push({
            sourceFile: relativeFile,
            target: rawTarget,
            reason: "internal link includes a trailing slash",
          });
        }

        if ((REDIRECT_ALIAS_PATHS as readonly string[]).includes(normalized)) {
          redirectInternalLinks.push({
            sourceFile: relativeFile,
            target: rawTarget,
            reason: "internal link points at redirect-only alias",
          });
        }

        if (
          !isValidPublicPath({
            targetPath: normalized,
            routeSources,
            generatedSlugs,
          })
        ) {
          brokenInternalLinks.push({
            sourceFile: relativeFile,
            target: rawTarget,
            reason: "target does not map to a known route, generated book, or static asset",
          });
        }
      }
    }
  }

  return {
    brokenInternalLinks,
    redirectInternalLinks,
    trailingSlashInternalLinks,
  };
}

function collectInferredDeferredSlugs(value: unknown, slugs = new Set<string>()) {
  if (!value || typeof value !== "object") return slugs;
  if (Array.isArray(value)) {
    for (const item of value) collectInferredDeferredSlugs(item, slugs);
    return slugs;
  }

  const record = value as Record<string, unknown>;
  const inferredSlug = record.inferredSlug;
  if (typeof inferredSlug === "string" && inferredSlug) slugs.add(inferredSlug);
  const expectedSlug = record.expectedSlug;
  if (typeof expectedSlug === "string" && expectedSlug) slugs.add(expectedSlug);

  for (const nested of Object.values(record)) {
    collectInferredDeferredSlugs(nested, slugs);
  }
  return slugs;
}

function readDeferredBlockedSlugs() {
  if (!fs.existsSync(decisionCheckpointPath)) return new Set<string>();
  const checkpoint = readJson<unknown>(decisionCheckpointPath);
  return collectInferredDeferredSlugs(checkpoint);
}

function audit() {
  const sitemapEntries = parseSitemapEntries();
  const sitemapPaths = sitemapEntries.map((entry) => entry.pathname);
  const routeSources = parseRouteSources();
  const generatedSlugs = readGeneratedSlugs();
  const deferredBlockedSlugs = readDeferredBlockedSlugs();
  const generatedBookCount = generatedSlugs.size;

  const missingRoutes: string[] = [];
  const canonicalMismatches: string[] = [];
  const noindexInSitemap: string[] = [];
  const missingMetadata: string[] = [];
  const sitemapHostMismatches: string[] = [];

  for (const entry of sitemapEntries) {
    if (entry.origin !== SITE_ORIGIN) sitemapHostMismatches.push(entry.loc);

    const routeSource = resolveRouteSource(routeSources, entry.pathname);
    if (!routeSource) {
      missingRoutes.push(entry.pathname);
      continue;
    }

    const bookMatch = entry.pathname.match(GENERATED_BOOK_PATTERN);
    const printMatch = entry.pathname.match(PRINTABLE_BOOK_PATTERN);
    const audiobookMatch = entry.pathname.match(AUDIOBOOK_PATTERN);
    if (bookMatch && !generatedSlugs.has(bookMatch[1])) missingRoutes.push(entry.pathname);
    if (printMatch && !generatedSlugs.has(printMatch[1])) missingRoutes.push(entry.pathname);
    if (audiobookMatch && !generatedSlugs.has(audiobookMatch[1])) missingRoutes.push(entry.pathname);

    if (routeSource.kind === "redirect") {
      canonicalMismatches.push(`${entry.pathname} is redirect-only but appears in XML sitemap`);
    }

    const source = fs.readFileSync(routeSource.filePath, "utf8");
    if (!routeHasMetadata(source)) missingMetadata.push(entry.pathname);
    if (!routeHasCanonical(source)) canonicalMismatches.push(entry.pathname);

    if (!bookMatch && !printMatch && !audiobookMatch && routeHasNoindex(source)) {
      noindexInSitemap.push(entry.pathname);
    }
  }

  const canonicalMap = new Map<string, string[]>();
  for (const pathname of sitemapPaths) {
    const canonical = `${SITE_ORIGIN}${pathname === "/" ? "" : pathname}`;
    canonicalMap.set(canonical, [...(canonicalMap.get(canonical) ?? []), pathname]);
  }
  const duplicateCanonicals = [...canonicalMap.entries()]
    .filter(([, paths]) => paths.length > 1)
    .map(([canonical, paths]) => `${canonical}: ${paths.join(", ")}`);

  const aliasesInSitemap = REDIRECT_ALIAS_PATHS.filter((aliasPath) =>
    sitemapPaths.includes(aliasPath),
  );
  canonicalMismatches.push(...aliasesInSitemap.map((alias) => `${alias} is a redirect alias in XML sitemap`));

  const deferredBlockedSlugExposures: string[] = [];
  for (const slug of deferredBlockedSlugs) {
    const exposedPaths = [
      `/morse-code-books/${slug}`,
      `/morse-code-audiobooks/${slug}`,
      `/morse-code-books/${slug}/print`,
    ].filter((pathname) => sitemapPaths.includes(pathname) || generatedSlugs.has(slug));
    if (exposedPaths.length > 0) deferredBlockedSlugExposures.push(`${slug}: ${exposedPaths.join(", ")}`);
  }

  const {
    brokenInternalLinks,
    redirectInternalLinks,
    trailingSlashInternalLinks,
  } = collectInternalLinkIssues({ routeSources, generatedSlugs });

  const robots = fs.existsSync(robotsPath) ? fs.readFileSync(robotsPath, "utf8") : "";
  const robotsSitemapResult = robots.includes(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`)
    ? "pass"
    : "fail";
  const root = fs.readFileSync(path.join(repoRoot, "app", "root.tsx"), "utf8");
  const trailingSlashRedirectResult =
    root.includes("needsStrip") &&
    root.includes("return redirect(url.pathname + url.search")
      ? "pass"
      : "fail";

  const bookUrlCount = sitemapPaths.filter((pathname) => GENERATED_BOOK_PATTERN.test(pathname)).length;
  const audiobookUrlCount = sitemapPaths.filter((pathname) => AUDIOBOOK_PATTERN.test(pathname)).length;
  const printableBookUrlCount = sitemapPaths.filter((pathname) => PRINTABLE_BOOK_PATTERN.test(pathname)).length;
  const noindexSupportRouteCount = [...NOINDEX_SUPPORT_ROUTES].length;
  const redirectRouteCount = REDIRECT_ALIAS_PATHS.length;
  const internalOnlyRouteCount = [...INTERNAL_ONLY_ROUTES].length;
  const dynamicBookRouteCount = 2;
  const dynamicAudiobookRouteCount = 1;

  const result: AuditResult = {
    totalRouteCountInspected: routeSources.size,
    sitemapUrlCount: sitemapEntries.length,
    indexablePageCount: sitemapEntries.length,
    noindexSupportRouteCount,
    redirectRouteCount,
    dynamicBookRouteCount,
    dynamicAudiobookRouteCount,
    internalOnlyRouteCount,
    missingRouteCount: missingRoutes.length,
    canonicalMismatchCount: canonicalMismatches.length,
    noindexInSitemapCount: noindexInSitemap.length,
    duplicateCanonicalCount: duplicateCanonicals.length,
    brokenInternalLinkCount: brokenInternalLinks.length,
    redirectInternalLinkCount: redirectInternalLinks.length,
    trailingSlashInternalLinkCount: trailingSlashInternalLinks.length,
    bookUrlCount,
    audiobookUrlCount,
    printableBookUrlCount,
    generatedBookCount,
    seoSummaryCount: countSeoSummaries(),
    startupPreviewCount: countStartupPreviews(),
    deferredBlockedSlugExposureCount: deferredBlockedSlugExposures.length,
    metadataMissingCount: missingMetadata.length,
    sitemapHostMismatchCount: sitemapHostMismatches.length,
    robotsSitemapResult,
    trailingSlashRedirectResult,
    issues: {
      missingRoutes,
      canonicalMismatches,
      noindexInSitemap,
      duplicateCanonicals,
      brokenInternalLinks,
      redirectInternalLinks,
      trailingSlashInternalLinks,
      deferredBlockedSlugExposures,
      missingMetadata,
      sitemapHostMismatches,
    },
  };

  return result;
}

const result = audit();
const blockers = [
  ...result.issues.missingRoutes.map((issue) => `missing route: ${issue}`),
  ...result.issues.canonicalMismatches.map((issue) => `canonical mismatch: ${issue}`),
  ...result.issues.noindexInSitemap.map((issue) => `noindex in sitemap: ${issue}`),
  ...result.issues.duplicateCanonicals.map((issue) => `duplicate canonical: ${issue}`),
  ...result.issues.brokenInternalLinks.map(
    (issue) => `broken internal link: ${issue.sourceFile} -> ${issue.target} (${issue.reason})`,
  ),
  ...result.issues.redirectInternalLinks.map(
    (issue) => `redirect internal link: ${issue.sourceFile} -> ${issue.target} (${issue.reason})`,
  ),
  ...result.issues.trailingSlashInternalLinks.map(
    (issue) => `trailing slash internal link: ${issue.sourceFile} -> ${issue.target} (${issue.reason})`,
  ),
  ...result.issues.deferredBlockedSlugExposures.map(
    (issue) => `deferred/blocked slug exposed: ${issue}`,
  ),
  ...result.issues.missingMetadata.map((issue) => `missing metadata: ${issue}`),
  ...result.issues.sitemapHostMismatches.map((issue) => `sitemap host mismatch: ${issue}`),
  ...(result.robotsSitemapResult === "pass" ? [] : ["robots.txt missing preferred sitemap URL"]),
  ...(result.trailingSlashRedirectResult === "pass" ? [] : ["trailing slash redirect policy not detected"]),
];

console.log("Full URL/indexability/canonical audit");
console.log(`Routes inspected: ${result.totalRouteCountInspected}`);
console.log(`XML sitemap URLs: ${result.sitemapUrlCount}`);
console.log(`Indexable page URLs: ${result.indexablePageCount}`);
console.log(`Noindex/support routes: ${result.noindexSupportRouteCount}`);
console.log(`Redirect-only routes: ${result.redirectRouteCount}`);
console.log(`Internal-only/content routes: ${result.internalOnlyRouteCount}`);
console.log(`Book URLs: ${result.bookUrlCount}`);
console.log(`Audiobook URLs: ${result.audiobookUrlCount}`);
console.log(`Printable book URLs: ${result.printableBookUrlCount}`);
console.log(`Generated books: ${result.generatedBookCount}`);
console.log(`SEO summaries: ${result.seoSummaryCount}`);
console.log(`Startup previews: ${result.startupPreviewCount}`);
console.log(`Missing routes: ${result.missingRouteCount}`);
console.log(`Canonical mismatches: ${result.canonicalMismatchCount}`);
console.log(`Noindex URLs in sitemap: ${result.noindexInSitemapCount}`);
console.log(`Duplicate canonical URLs: ${result.duplicateCanonicalCount}`);
console.log(`Broken internal links: ${result.brokenInternalLinkCount}`);
console.log(`Redirect-only internal links: ${result.redirectInternalLinkCount}`);
console.log(`Trailing-slash internal links: ${result.trailingSlashInternalLinkCount}`);
console.log(`Deferred/blocked slug exposures: ${result.deferredBlockedSlugExposureCount}`);
console.log(`Missing metadata entries: ${result.metadataMissingCount}`);
console.log(`Sitemap host mismatches: ${result.sitemapHostMismatchCount}`);
console.log(`Robots sitemap result: ${result.robotsSitemapResult}`);
console.log(`Trailing slash redirect result: ${result.trailingSlashRedirectResult}`);

if (blockers.length > 0) {
  console.error("\nBlockers:");
  for (const blocker of blockers.slice(0, 80)) console.error(`- ${blocker}`);
  if (blockers.length > 80) {
    console.error(`- ...and ${blockers.length - 80} more blockers`);
  }
  process.exitCode = 1;
} else {
  console.log("Result: pass");
}
