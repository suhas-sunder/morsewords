import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  CANONICAL_ROUTE_PATHS,
  REDIRECT_ALIAS_PATHS,
  ROUTES,
} from "../app/client/data/routes.ts";

type RouteSource = {
  routePath: string;
  filePath: string;
};

type AuditResult = {
  sitemapTotal: number;
  plannedNonBookSitemapCount: number;
  implementedPlannedNonBookCount: number;
  bookUrlCount: number;
  audiobookUrlCount: number;
  printableBookUrlCount: number;
  generatedBookCount: number;
  seoSummaryCount: number;
  startupPreviewCount: number;
  missingRoutes: string[];
  placeholderOnlyRoutes: Array<{ routePath: string; filePath: string; reason: string }>;
  missingMetadataRoutes: Array<{ routePath: string; filePath: string; reason: string }>;
  missingCanonicalRoutes: Array<{ routePath: string; filePath: string; reason: string }>;
  aliasesInSitemap: string[];
  noindexSupportRoutes: string[];
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

const BAD_PLACEHOLDER_PATTERNS = [
  /\bcoming soon\b/i,
  /\bunder construction\b/i,
  /\bnot implemented\b/i,
  /\blorem ipsum\b/i,
  /\bplaceholder-only\b/i,
];

function normalizePathname(pathname: string) {
  const normalized = pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
  return normalized || "/";
}

function parseSitemapPaths() {
  const xml = fs.readFileSync(sitemapPath, "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
    normalizePathname(new URL(match[1]).pathname),
  );
}

function parseRouteSources() {
  const source = fs.readFileSync(routesPath, "utf8");
  const routeSources = new Map<string, RouteSource>();

  routeSources.set("/", {
    routePath: "/",
    filePath: path.join(repoRoot, "app", "routes", "home.tsx"),
  });

  const literalRoutePattern = /route\(\s*"([^"]+)"\s*,\s*"([^"]+)"/gs;
  for (const match of source.matchAll(literalRoutePattern)) {
    const routePath = normalizePathname(`/${match[1]}`);
    const filePath = path.join(repoRoot, "app", match[2]);
    routeSources.set(routePath, { routePath, filePath });
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
    const filePath = path.join(repoRoot, "app", match[2]);
    routeSources.set(routePath, { routePath, filePath });
  }

  routeSources.set(ROUTES.miscCookies, {
    routePath: ROUTES.miscCookies,
    filePath: path.join(repoRoot, "app", "routes", "misc", "misc.cookies-policy.tsx"),
  });
  routeSources.set(ROUTES.miscPrivacy, {
    routePath: ROUTES.miscPrivacy,
    filePath: path.join(repoRoot, "app", "routes", "misc", "misc.privacy-policy.tsx"),
  });
  routeSources.set(ROUTES.miscSocials, {
    routePath: ROUTES.miscSocials,
    filePath: path.join(repoRoot, "app", "routes", "misc", "misc.socials.tsx"),
  });
  routeSources.set(ROUTES.miscTerms, {
    routePath: ROUTES.miscTerms,
    filePath: path.join(repoRoot, "app", "routes", "misc", "misc.terms-of-service.tsx"),
  });

  return routeSources;
}

function isBookRoute(pathname: string) {
  return pathname.startsWith("/morse-code-books/");
}

function isAudiobookRoute(pathname: string) {
  return pathname.startsWith("/morse-code-audiobooks/");
}

function isPrintableBookRoute(pathname: string) {
  return /^\/morse-code-books\/[^/]+\/print$/.test(pathname);
}

function countSeoSummaries() {
  const registry = JSON.parse(fs.readFileSync(seoSummaryPath, "utf8")) as {
    summaries?: unknown[];
  };
  return registry.summaries?.length ?? 0;
}

function countGeneratedBooks() {
  const manifest = JSON.parse(fs.readFileSync(generatedManifestPath, "utf8")) as {
    books?: unknown[];
  };
  return manifest.books?.length ?? 0;
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
    /tagName:\s*["']link["'][\s\S]{0,140}rel:\s*["']canonical["']/.test(source)
  );
}

function routeHasContentSurface(source: string) {
  return (
    /return\s*\(?\s*</.test(source) ||
    /<h1\b/.test(source) ||
    /\bPageHero\b/.test(source) ||
    /\bToolHero\b/.test(source) ||
    /\bUtilityPageHeader\b/.test(source) ||
    /\bMorseLetterPage\b/.test(source) ||
    /\bMorseLeafPage\b/.test(source) ||
    /\bMorseNumberPage\b/.test(source) ||
    /\bMorseGuidePage\b/.test(source)
  );
}

function runAudit(): AuditResult {
  const sitemapPaths = parseSitemapPaths();
  const routeSources = parseRouteSources();
  const plannedNonBookSitemapPaths = sitemapPaths.filter(
    (pathname) => !isBookRoute(pathname) && !isAudiobookRoute(pathname),
  );

  const missingRoutes: string[] = [];
  const placeholderOnlyRoutes: AuditResult["placeholderOnlyRoutes"] = [];
  const missingMetadataRoutes: AuditResult["missingMetadataRoutes"] = [];
  const missingCanonicalRoutes: AuditResult["missingCanonicalRoutes"] = [];

  for (const routePath of plannedNonBookSitemapPaths) {
    const routeSource = routeSources.get(routePath);
    if (!routeSource) {
      missingRoutes.push(routePath);
      continue;
    }
    if (!fs.existsSync(routeSource.filePath)) {
      missingRoutes.push(routePath);
      continue;
    }

    const source = fs.readFileSync(routeSource.filePath, "utf8");
    const placeholderPattern = BAD_PLACEHOLDER_PATTERNS.find((pattern) =>
      pattern.test(source),
    );
    if (placeholderPattern) {
      placeholderOnlyRoutes.push({
        routePath,
        filePath: path.relative(repoRoot, routeSource.filePath),
        reason: `matched ${placeholderPattern.source}`,
      });
    }
    if (!routeHasMetadata(source)) {
      missingMetadataRoutes.push({
        routePath,
        filePath: path.relative(repoRoot, routeSource.filePath),
        reason: "no route metadata export detected",
      });
    }
    if (!routeHasCanonical(source)) {
      missingCanonicalRoutes.push({
        routePath,
        filePath: path.relative(repoRoot, routeSource.filePath),
        reason: "no route canonical link detected",
      });
    }
    if (!routeHasContentSurface(source)) {
      placeholderOnlyRoutes.push({
        routePath,
        filePath: path.relative(repoRoot, routeSource.filePath),
        reason: "no visible page/header component detected in route module",
      });
    }
  }

  const aliasesInSitemap = REDIRECT_ALIAS_PATHS.filter((aliasPath) =>
    sitemapPaths.includes(aliasPath),
  );

  const noindexSupportRoutes = [
    ROUTES.misc,
    ROUTES.miscCookies,
    ROUTES.miscPrivacy,
    ROUTES.miscSocials,
    ROUTES.miscTerms,
    ROUTES.sitemap,
  ].filter((routePath) =>
    (CANONICAL_ROUTE_PATHS as readonly string[]).includes(routePath),
  );

  return {
    sitemapTotal: sitemapPaths.length,
    plannedNonBookSitemapCount: plannedNonBookSitemapPaths.length,
    implementedPlannedNonBookCount:
      plannedNonBookSitemapPaths.length - missingRoutes.length,
    bookUrlCount: sitemapPaths.filter((pathname) => isBookRoute(pathname) && !isPrintableBookRoute(pathname)).length,
    audiobookUrlCount: sitemapPaths.filter(isAudiobookRoute).length,
    printableBookUrlCount: sitemapPaths.filter(isPrintableBookRoute).length,
    generatedBookCount: countGeneratedBooks(),
    seoSummaryCount: countSeoSummaries(),
    startupPreviewCount: countStartupPreviews(),
    missingRoutes,
    placeholderOnlyRoutes,
    missingMetadataRoutes,
    missingCanonicalRoutes,
    aliasesInSitemap,
    noindexSupportRoutes,
  };
}

const result = runAudit();
const blockers = [
  ...result.missingRoutes.map((routePath) => `missing route: ${routePath}`),
  ...result.placeholderOnlyRoutes.map(
    (entry) => `placeholder/thin route: ${entry.routePath} (${entry.reason})`,
  ),
  ...result.missingMetadataRoutes.map(
    (entry) => `missing metadata: ${entry.routePath} (${entry.reason})`,
  ),
  ...result.missingCanonicalRoutes.map(
    (entry) => `missing canonical: ${entry.routePath} (${entry.reason})`,
  ),
  ...result.aliasesInSitemap.map((routePath) => `redirect alias in sitemap: ${routePath}`),
];

console.log("Planned non-book page audit");
console.log(`Sitemap URLs: ${result.sitemapTotal}`);
console.log(`Planned non-book sitemap URLs: ${result.plannedNonBookSitemapCount}`);
console.log(`Implemented planned non-book URLs: ${result.implementedPlannedNonBookCount}`);
console.log(`Book URLs: ${result.bookUrlCount}`);
console.log(`Audiobook URLs: ${result.audiobookUrlCount}`);
console.log(`Printable book URLs: ${result.printableBookUrlCount}`);
console.log(`Generated books: ${result.generatedBookCount}`);
console.log(`SEO summaries: ${result.seoSummaryCount}`);
console.log(`Startup previews: ${result.startupPreviewCount}`);
console.log(`Noindex support routes tracked outside XML: ${result.noindexSupportRoutes.join(", ")}`);

if (blockers.length > 0) {
  console.error("\nBlockers:");
  for (const blocker of blockers) console.error(`- ${blocker}`);
  process.exitCode = 1;
} else {
  console.log("Result: pass");
}
