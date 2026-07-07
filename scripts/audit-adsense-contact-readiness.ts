import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  REDIRECT_ALIAS_PATHS,
  ROUTES,
  SITE_ORIGIN,
} from "../app/client/data/routes.ts";
import { MORSEWORDS_SUPPORT_EMAIL } from "../app/client/data/siteTrust.ts";

type RouteKind = "static" | "dynamic" | "redirect";

type RouteSource = {
  routePath: string;
  filePath: string;
  kind: RouteKind;
};

type SitemapSnapshot = {
  total: number;
  nonBook: number;
  book: number;
  audiobook: number;
  print: number;
};

type PageCheck = {
  key: string;
  routePath: string;
  filePath: string;
  routeRegistered: boolean;
  fileExists: boolean;
  inSitemap: boolean;
  hasMetadata: boolean;
  hasCanonical: boolean;
  hasNoindex: boolean;
  hasExpectedHeading: boolean;
  hasSubstantialContent: boolean;
};

type LinkIssue = {
  sourceFile: string;
  target: string;
  reason: string;
};

type AuditResult = {
  executiveResult: string;
  contactEmail: string;
  contactEmailsFound: string[];
  sitemap: SitemapSnapshot;
  generatedBookCount: number;
  requiredPages: PageCheck[];
  footerLinks: Record<string, boolean>;
  navLinks: Record<string, boolean>;
  contactPath: {
    contactRouteHasEmail: boolean;
    contactRouteHasMailto: boolean;
    sourcesRouteHasEmail: boolean;
    aboutRouteHasOwnershipSignal: boolean;
    aboutRouteNamesMaintainer: boolean;
  };
  correctionTakedownPath: {
    sourcesHasCorrectionLanguage: boolean;
    sourcesHasTakedownLanguage: boolean;
    sourcesHasSourceConcernLanguage: boolean;
    contactHasReportTopics: boolean;
    contactHasAccessibilityConcernPath: boolean;
  };
  policyIndexability: {
    canonicalPolicyPagesInSitemap: string[];
    canonicalPolicyPagesNoindex: string[];
    intentionalNoindexPolicyPagesExcluded: string[];
    noindexPolicyPagesInSitemap: string[];
  };
  adsenseSensitive: {
    ownershipSignal: boolean;
    accessiblePrivacyPolicy: boolean;
    accessibleTermsPolicy: boolean;
    accessibleCookiesPolicy: boolean;
    visibleSourceCorrectionTakedownProcess: boolean;
    noUnsupportedSafetyClaims: boolean;
    noPlaceholderSupportPages: boolean;
    noBrokenSupportLinks: boolean;
    noThinSupportPages: boolean;
  };
  placeholderScan: Array<{ filePath: string; pattern: string }>;
  unsupportedSafetyClaims: Array<{ filePath: string; pattern: string }>;
  brokenSupportLinks: LinkIssue[];
  redirectOnlyUrlsInSitemap: string[];
  noindexUrlsInSitemap: string[];
  sitemapHostMismatches: string[];
  malformedSitemapUrls: string[];
  bookSuitabilityPolicy: {
    sourcesPolicyVisible: boolean;
    bookHubNoticeVisible: boolean;
    audiobookHubNoticeVisible: boolean;
    bookDetailSuitabilityVisible: boolean;
    printSuitabilityVisible: boolean;
  };
  fixesMade: string[];
  blockers: string[];
};

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appRoutesPath = path.join(repoRoot, "app", "routes.ts");
const sitemapPath = path.join(repoRoot, "public", "sitemap.xml");
const generatedManifestPath = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "generated",
  "library-manifest.json",
);
const reportDir = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "adsense-contact-readiness",
);
const reportJsonPath = path.join(reportDir, "adsense-contact-readiness.json");
const reportMdPath = path.join(reportDir, "adsense-contact-readiness.md");

const EXPECTED_NON_BOOK_COUNT = 129;

const BOOK_PATTERN = /^\/morse-code-books\/([^/]+)$/;
const AUDIOBOOK_PATTERN = /^\/morse-code-audiobooks\/([^/]+)$/;
const PRINT_PATTERN = /^\/morse-code-books\/([^/]+)\/print$/;

const NOINDEX_SUPPORT_ROUTES = new Set<string>([
  ROUTES.misc,
  ROUTES.miscCookies,
  ROUTES.miscPrivacy,
  ROUTES.miscSocials,
  ROUTES.miscTerms,
  ROUTES.sitemap,
]);

const REQUIRED_PAGES = [
  {
    key: "privacy",
    routePath: ROUTES.privacy,
    expectedHeading: "Privacy Policy",
  },
  {
    key: "terms",
    routePath: ROUTES.terms,
    expectedHeading: "Terms of Use",
  },
  {
    key: "cookies",
    routePath: ROUTES.cookies,
    expectedHeading: "Cookie Policy",
  },
  {
    key: "sources",
    routePath: ROUTES.sources,
    expectedHeading: "Sources and public domain notes",
  },
  {
    key: "about",
    routePath: ROUTES.about,
    expectedHeading: "About MorseWords",
  },
  {
    key: "contact",
    routePath: ROUTES.contact,
    expectedHeading: "Contact MorseWords",
  },
] as const;

const LEGACY_NOINDEX_POLICY_ROUTES = [
  ROUTES.miscPrivacy,
  ROUTES.miscTerms,
  ROUTES.miscCookies,
] as const;

const TRUST_LINKS = {
  about: "ROUTES.about",
  contact: "ROUTES.contact",
  sources: "ROUTES.sources",
  privacy: "ROUTES.privacy",
  terms: "ROUTES.terms",
  cookies: "ROUTES.cookies",
} as const;

const SUPPORT_LINK_SCAN_FILES = [
  path.join(repoRoot, "app", "client", "components", "navigation", "Footer.tsx"),
  path.join(repoRoot, "app", "client", "components", "navigation", "NavBar.tsx"),
  path.join(repoRoot, "app", "routes", "about.tsx"),
  path.join(repoRoot, "app", "routes", "contact.tsx"),
  path.join(repoRoot, "app", "routes", "sources.tsx"),
  path.join(repoRoot, "app", "routes", "privacy.tsx"),
  path.join(repoRoot, "app", "routes", "terms.tsx"),
  path.join(repoRoot, "app", "routes", "cookies.tsx"),
  path.join(repoRoot, "app", "routes", "misc", "misc.tsx"),
  path.join(repoRoot, "app", "routes", "misc", "misc.privacy-policy.tsx"),
  path.join(repoRoot, "app", "routes", "misc", "misc.terms-of-service.tsx"),
  path.join(repoRoot, "app", "routes", "misc", "misc.cookies-policy.tsx"),
];

const SAFETY_SCAN_FILES = [
  path.join(repoRoot, "app", "routes", "sources.tsx"),
  path.join(repoRoot, "app", "routes", "morse-code-books.tsx"),
  path.join(repoRoot, "app", "routes", "morse-code-audiobooks.tsx"),
  path.join(
    repoRoot,
    "app",
    "client",
    "components",
    "morse-code-books",
    "MorseBookPage.tsx",
  ),
  path.join(
    repoRoot,
    "app",
    "client",
    "components",
    "morse-code-books",
    "PrintableMorsePages.tsx",
  ),
];

const PLACEHOLDER_PATTERNS = [
  /\bcoming soon\b/i,
  /\bunder construction\b/i,
  /\blorem ipsum\b/i,
  /\bto be determined\b/i,
  /\bTBD\b/,
  /\bTODO\b/,
  /\bFIXME\b/,
  /\bexample@example\.com\b/i,
  /\bcontact@example\.com\b/i,
  /\bsupport@example\.com\b/i,
];

const UNSUPPORTED_SAFETY_CLAIM_PATTERNS = [
  /\b(?:all-audience|all audience)\s+(?:safe|approved|friendly)\b/i,
  /\b(?:safe|approved|friendly)\s+for\s+all\s+(?:ages|audiences)\b/i,
  /\b(?:classroom|youth|child|kid)[-\s]?safe\s+by\s+default\b/i,
  /\bguaranteed\s+(?:safe|appropriate)\s+for\s+(?:children|classrooms|all audiences)\b/i,
];

function rel(filePath: string) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, "/");
}

function readText(filePath: string) {
  return fs.readFileSync(filePath, "utf8");
}

function readJson<T>(filePath: string): T {
  return JSON.parse(readText(filePath)) as T;
}

function normalizePathname(pathname: string) {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  return normalized || "/";
}

function parseSitemapEntries() {
  const xml = readText(sitemapPath);
  const malformedSitemapUrls: string[] = [];
  const entries: Array<{ loc: string; origin: string; pathname: string }> = [];

  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const loc = match[1];
    try {
      const url = new URL(loc);
      entries.push({
        loc,
        origin: url.origin,
        pathname: normalizePathname(url.pathname),
      });
    } catch {
      malformedSitemapUrls.push(loc);
    }
  }

  return { entries, malformedSitemapUrls };
}

function snapshotFromPaths(paths: string[]): SitemapSnapshot {
  let nonBook = 0;
  let book = 0;
  let audiobook = 0;
  let print = 0;

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

function parseRouteSources() {
  const source = readText(appRoutesPath);
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
    if (!routeValue) throw new Error(`Missing ROUTES.${key}.`);
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
  return (
    /robots\s*:\s*["']noindex/i.test(source) ||
    /name:\s*["']robots["'][\s\S]{0,160}content:\s*["']noindex/i.test(source)
  );
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
    /tagName:\s*["']link["'][\s\S]{0,180}rel:\s*["']canonical["']/.test(source) ||
    /canonicalUrl\(/.test(source)
  );
}

function hasSubstantialSupportContent(source: string) {
  const sectionishCount = (
    source.match(/<(?:section|SectionCard|UtilityContentPanel)\b/g) ?? []
  ).length;
  return source.length >= 2200 && sectionishCount >= 2;
}

function checkRequiredPages({
  routeSources,
  sitemapPaths,
}: {
  routeSources: Map<string, RouteSource>;
  sitemapPaths: string[];
}) {
  return REQUIRED_PAGES.map((page): PageCheck => {
    const routeSource = routeSources.get(page.routePath);
    const filePath = routeSource?.filePath ?? "";
    const fileExists = Boolean(filePath && fs.existsSync(filePath));
    const source = fileExists ? readText(filePath) : "";

    return {
      key: page.key,
      routePath: page.routePath,
      filePath: filePath ? rel(filePath) : "",
      routeRegistered: Boolean(routeSource),
      fileExists,
      inSitemap: sitemapPaths.includes(page.routePath),
      hasMetadata: routeHasMetadata(source),
      hasCanonical: routeHasCanonical(source),
      hasNoindex: routeHasNoindex(source),
      hasExpectedHeading: source.includes(page.expectedHeading),
      hasSubstantialContent: hasSubstantialSupportContent(source),
    };
  });
}

function findEmailsInSiteSource() {
  const roots = [
    path.join(repoRoot, "app", "routes"),
    path.join(repoRoot, "app", "client"),
  ];
  const emails = new Set<string>();

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const childPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "assets") continue;
        walk(childPath);
        continue;
      }
      if (!/\.(?:ts|tsx|js|jsx)$/.test(entry.name)) continue;
      const source = readText(childPath);
      for (const match of source.matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)) {
        emails.add(match[0].toLowerCase());
      }
    }
  }

  for (const root of roots) walk(root);
  return [...emails].sort((left, right) => left.localeCompare(right));
}

function scanPatterns(files: string[], patterns: RegExp[]) {
  const findings: Array<{ filePath: string; pattern: string }> = [];
  for (const filePath of files) {
    if (!fs.existsSync(filePath)) continue;
    const source = readText(filePath);
    for (const pattern of patterns) {
      if (pattern.test(source)) {
        findings.push({ filePath: rel(filePath), pattern: pattern.source });
      }
    }
  }
  return findings;
}

function normalizeInternalTarget(rawTarget: string) {
  if (!rawTarget.startsWith("/") || rawTarget.startsWith("//")) return null;
  const [withoutHash] = rawTarget.split("#");
  const [withoutQuery] = withoutHash.split("?");
  return normalizePathname(withoutQuery || "/");
}

function isKnownInternalPath(routeSources: Map<string, RouteSource>, targetPath: string) {
  if (targetPath === "/") return true;
  if (routeSources.has(targetPath)) return true;
  if (targetPath.startsWith("/assets/")) return true;
  if (targetPath.startsWith("/og/")) return true;
  if (targetPath.startsWith("/book-previews/")) return true;
  if (/\.(?:png|jpe?g|webp|gif|svg|ico|css|js|json|xml|txt|pdf|woff2?)$/i.test(targetPath)) {
    return true;
  }
  for (const source of routeSources.values()) {
    if (source.kind === "dynamic" && routePatternMatches(source.routePath, targetPath)) {
      return true;
    }
  }
  return false;
}

function collectBrokenSupportLinks(routeSources: Map<string, RouteSource>) {
  const issues: LinkIssue[] = [];
  const staticLinkPatterns = [
    /\b(?:href|to)\s*=\s*["']([^"']+)["']/g,
    /\b(?:href|to)\s*:\s*["']([^"']+)["']/g,
  ];

  for (const filePath of SUPPORT_LINK_SCAN_FILES) {
    if (!fs.existsSync(filePath)) {
      issues.push({
        sourceFile: rel(filePath),
        target: "",
        reason: "support/nav source file missing",
      });
      continue;
    }

    const source = readText(filePath);
    for (const pattern of staticLinkPatterns) {
      for (const match of source.matchAll(pattern)) {
        const rawTarget = match[1];
        const normalized = normalizeInternalTarget(rawTarget);
        if (!normalized) continue;
        if (!isKnownInternalPath(routeSources, normalized)) {
          issues.push({
            sourceFile: rel(filePath),
            target: rawTarget,
            reason: "target does not map to a known route or static asset",
          });
        }
      }
    }
  }

  return issues;
}

function readGeneratedBookCount() {
  const manifest = readJson<{ books?: unknown[] }>(generatedManifestPath);
  return manifest.books?.length ?? 0;
}

function collectSitemapIndexabilityIssues({
  routeSources,
  sitemapPaths,
}: {
  routeSources: Map<string, RouteSource>;
  sitemapPaths: string[];
}) {
  const redirectOnlyUrlsInSitemap: string[] = [];
  const noindexUrlsInSitemap: string[] = [];

  for (const pathname of sitemapPaths) {
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
      noindexUrlsInSitemap.push(pathname);
      continue;
    }
    if (routeSource?.kind === "static" && fs.existsSync(routeSource.filePath)) {
      const source = readText(routeSource.filePath);
      if (routeHasNoindex(source)) noindexUrlsInSitemap.push(pathname);
    }
  }

  return {
    redirectOnlyUrlsInSitemap: [...new Set(redirectOnlyUrlsInSitemap)].sort(),
    noindexUrlsInSitemap: [...new Set(noindexUrlsInSitemap)].sort(),
  };
}

function buildBooleanMap(source: string, links: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(links).map(([key, token]) => [key, source.includes(token)]),
  ) as Record<string, boolean>;
}

function collectPolicyIndexability({
  routeSources,
  sitemapPaths,
}: {
  routeSources: Map<string, RouteSource>;
  sitemapPaths: string[];
}) {
  const canonicalPolicyPaths = [ROUTES.privacy, ROUTES.terms, ROUTES.cookies];
  const canonicalPolicyPagesInSitemap = canonicalPolicyPaths.filter((routePath) =>
    sitemapPaths.includes(routePath),
  );
  const canonicalPolicyPagesNoindex = canonicalPolicyPaths.filter((routePath) => {
    const routeSource = routeSources.get(routePath);
    return Boolean(
      routeSource &&
        fs.existsSync(routeSource.filePath) &&
        routeHasNoindex(readText(routeSource.filePath)),
    );
  });
  const intentionalNoindexPolicyPagesExcluded = LEGACY_NOINDEX_POLICY_ROUTES.filter(
    (routePath) => {
      const routeSource = routeSources.get(routePath);
      return Boolean(
        routeSource &&
          fs.existsSync(routeSource.filePath) &&
          routeHasNoindex(readText(routeSource.filePath)) &&
          !sitemapPaths.includes(routePath),
      );
    },
  );
  const noindexPolicyPagesInSitemap = LEGACY_NOINDEX_POLICY_ROUTES.filter(
    (routePath) => sitemapPaths.includes(routePath),
  );

  return {
    canonicalPolicyPagesInSitemap,
    canonicalPolicyPagesNoindex,
    intentionalNoindexPolicyPagesExcluded,
    noindexPolicyPagesInSitemap,
  };
}

function collectBookSuitabilityPolicy() {
  const sources = readText(path.join(repoRoot, "app", "routes", "sources.tsx"));
  const bookHub = readText(path.join(repoRoot, "app", "routes", "morse-code-books.tsx"));
  const audiobookHub = readText(
    path.join(repoRoot, "app", "routes", "morse-code-audiobooks.tsx"),
  );
  const bookPage = readText(
    path.join(
      repoRoot,
      "app",
      "client",
      "components",
      "morse-code-books",
      "MorseBookPage.tsx",
    ),
  );
  const printPage = readText(
    path.join(
      repoRoot,
      "app",
      "client",
      "components",
      "morse-code-books",
      "PrintableMorsePages.tsx",
    ),
  );

  return {
    sourcesPolicyVisible:
      /period language/i.test(sources) &&
      /mature themes/i.test(sources) &&
      /reader discretion/i.test(sources),
    bookHubNoticeVisible:
      /not a\s+youth-safe list by default/i.test(bookHub) &&
      /lower-risk filter/i.test(bookHub),
    audiobookHubNoticeVisible:
      /not a\s+youth-safe list by default/i.test(audiobookHub) &&
      /lower-risk filter/i.test(audiobookHub),
    bookDetailSuitabilityVisible:
      /data-testid="morse-book-content-suitability"/.test(bookPage) &&
      /ContentSuitabilityNotice/.test(bookPage),
    printSuitabilityVisible:
      /data-testid="printable-book-content-suitability"/.test(printPage) &&
      /morseBookSuitabilityLabel/.test(printPage),
  };
}

function runAudit(): AuditResult {
  const routeSources = parseRouteSources();
  const { entries, malformedSitemapUrls } = parseSitemapEntries();
  const sitemapPaths = entries.map((entry) => entry.pathname);
  const sitemap = snapshotFromPaths(sitemapPaths);
  const generatedBookCount = readGeneratedBookCount();
  const expectedSitemapTotal = EXPECTED_NON_BOOK_COUNT + generatedBookCount * 3;
  const requiredPages = checkRequiredPages({ routeSources, sitemapPaths });
  const footerSource = readText(
    path.join(repoRoot, "app", "client", "components", "navigation", "Footer.tsx"),
  );
  const navSource = readText(
    path.join(repoRoot, "app", "client", "components", "navigation", "NavBar.tsx"),
  );
  const contactSource = readText(path.join(repoRoot, "app", "routes", "contact.tsx"));
  const sourcesSource = readText(path.join(repoRoot, "app", "routes", "sources.tsx"));
  const aboutSource = readText(path.join(repoRoot, "app", "routes", "about.tsx"));
  const contactEmailsFound = findEmailsInSiteSource();
  const placeholderScan = scanPatterns(SUPPORT_LINK_SCAN_FILES, PLACEHOLDER_PATTERNS);
  const unsupportedSafetyClaims = scanPatterns(
    [...SUPPORT_LINK_SCAN_FILES, ...SAFETY_SCAN_FILES],
    UNSUPPORTED_SAFETY_CLAIM_PATTERNS,
  );
  const brokenSupportLinks = collectBrokenSupportLinks(routeSources);
  const { redirectOnlyUrlsInSitemap, noindexUrlsInSitemap } =
    collectSitemapIndexabilityIssues({ routeSources, sitemapPaths });
  const sitemapHostMismatches = entries
    .filter((entry) => entry.origin !== SITE_ORIGIN)
    .map((entry) => entry.loc);
  const policyIndexability = collectPolicyIndexability({ routeSources, sitemapPaths });
  const bookSuitabilityPolicy = collectBookSuitabilityPolicy();

  const footerLinks = buildBooleanMap(footerSource, TRUST_LINKS);
  const navLinks = buildBooleanMap(navSource, TRUST_LINKS);
  const contactPath = {
    contactRouteHasEmail: contactSource.includes("MORSEWORDS_SUPPORT_EMAIL"),
    contactRouteHasMailto: contactSource.includes("MORSEWORDS_SUPPORT_EMAIL_HREF"),
    sourcesRouteHasEmail: sourcesSource.includes("MORSEWORDS_SUPPORT_EMAIL"),
    aboutRouteHasOwnershipSignal:
      aboutSource.includes("Built and maintained by Suhas Sunder") &&
      aboutSource.includes("@type\": \"Person"),
    aboutRouteNamesMaintainer: aboutSource.includes("Suhas Sunder"),
  };
  const correctionTakedownPath = {
    sourcesHasCorrectionLanguage: /correction/i.test(sourcesSource),
    sourcesHasTakedownLanguage: /takedown/i.test(sourcesSource),
    sourcesHasSourceConcernLanguage:
      /source concerns/i.test(sourcesSource) || /source status should be reviewed/i.test(sourcesSource),
    contactHasReportTopics:
      /Bug reports/i.test(contactSource) &&
      /Copyright, public-domain, or source concerns/i.test(contactSource),
    contactHasAccessibilityConcernPath: /Accessibility issues/i.test(contactSource),
  };

  const accessiblePrivacyPolicy = requiredPages.some(
    (page) =>
      page.key === "privacy" &&
      page.routeRegistered &&
      page.fileExists &&
      page.inSitemap &&
      !page.hasNoindex,
  );
  const accessibleTermsPolicy = requiredPages.some(
    (page) =>
      page.key === "terms" &&
      page.routeRegistered &&
      page.fileExists &&
      page.inSitemap &&
      !page.hasNoindex,
  );
  const accessibleCookiesPolicy = requiredPages.some(
    (page) =>
      page.key === "cookies" &&
      page.routeRegistered &&
      page.fileExists &&
      page.inSitemap &&
      !page.hasNoindex,
  );
  const noThinSupportPages = requiredPages.every((page) => page.hasSubstantialContent);
  const visibleSourceCorrectionTakedownProcess =
    correctionTakedownPath.sourcesHasCorrectionLanguage &&
    correctionTakedownPath.sourcesHasTakedownLanguage &&
    correctionTakedownPath.sourcesHasSourceConcernLanguage &&
    (contactPath.sourcesRouteHasEmail || contactPath.contactRouteHasEmail);

  const adsenseSensitive = {
    ownershipSignal: contactPath.aboutRouteHasOwnershipSignal,
    accessiblePrivacyPolicy,
    accessibleTermsPolicy,
    accessibleCookiesPolicy,
    visibleSourceCorrectionTakedownProcess,
    noUnsupportedSafetyClaims: unsupportedSafetyClaims.length === 0,
    noPlaceholderSupportPages: placeholderScan.length === 0,
    noBrokenSupportLinks: brokenSupportLinks.length === 0,
    noThinSupportPages,
  };

  const blockers: string[] = [];
  for (const page of requiredPages) {
    if (!page.routeRegistered) blockers.push(`${page.key} route is not registered`);
    if (!page.fileExists) blockers.push(`${page.key} route file is missing`);
    if (!page.inSitemap) blockers.push(`${page.key} route is missing from XML sitemap`);
    if (!page.hasMetadata) blockers.push(`${page.key} route metadata is missing`);
    if (!page.hasCanonical) blockers.push(`${page.key} route canonical is missing`);
    if (page.hasNoindex) blockers.push(`${page.key} canonical route is noindex`);
    if (!page.hasExpectedHeading) blockers.push(`${page.key} expected heading copy is missing`);
    if (!page.hasSubstantialContent) blockers.push(`${page.key} support page looks thin`);
  }
  for (const [key, present] of Object.entries(footerLinks)) {
    if (!present) blockers.push(`footer is missing ${key} support link`);
  }
  for (const [key, present] of Object.entries(navLinks)) {
    if (!present) blockers.push(`navigation is missing ${key} support link`);
  }
  if (!contactPath.contactRouteHasEmail) blockers.push("contact route does not expose support email");
  if (!contactPath.contactRouteHasMailto) blockers.push("contact route does not expose mailto support link");
  if (!contactPath.sourcesRouteHasEmail) blockers.push("sources route does not expose support email");
  if (!contactPath.aboutRouteHasOwnershipSignal) blockers.push("about route does not expose ownership signal");
  if (!visibleSourceCorrectionTakedownProcess) {
    blockers.push("correction/takedown/source concern path is incomplete");
  }
  if (contactEmailsFound.some((email) => email !== MORSEWORDS_SUPPORT_EMAIL)) {
    blockers.push(`unexpected contact email(s): ${contactEmailsFound.join(", ")}`);
  }
  if (placeholderScan.length > 0) blockers.push("placeholder copy found on support/policy pages");
  if (brokenSupportLinks.length > 0) blockers.push("broken support/nav links found");
  if (unsupportedSafetyClaims.length > 0) {
    blockers.push("unsupported all-audience/classroom-safe claim found");
  }
  if (sitemap.total !== expectedSitemapTotal) {
    blockers.push(`sitemap count ${sitemap.total} does not match ${expectedSitemapTotal}`);
  }
  if (sitemap.nonBook !== EXPECTED_NON_BOOK_COUNT) {
    blockers.push(`non-book URL count ${sitemap.nonBook} does not match ${EXPECTED_NON_BOOK_COUNT}`);
  }
  if (sitemap.book !== generatedBookCount) {
    blockers.push(`book URL count ${sitemap.book} does not match generated book count ${generatedBookCount}`);
  }
  if (sitemap.audiobook !== generatedBookCount) {
    blockers.push(`audiobook URL count ${sitemap.audiobook} does not match generated book count ${generatedBookCount}`);
  }
  if (sitemap.print !== generatedBookCount) {
    blockers.push(`print URL count ${sitemap.print} does not match generated book count ${generatedBookCount}`);
  }
  if (redirectOnlyUrlsInSitemap.length > 0) blockers.push("redirect-only URL found in XML sitemap");
  if (noindexUrlsInSitemap.length > 0) blockers.push("noindex URL found in XML sitemap");
  if (sitemapHostMismatches.length > 0) blockers.push("sitemap host mismatch found");
  if (malformedSitemapUrls.length > 0) blockers.push("malformed sitemap URL found");
  if (policyIndexability.canonicalPolicyPagesNoindex.length > 0) {
    blockers.push("canonical policy page is noindex");
  }
  if (policyIndexability.noindexPolicyPagesInSitemap.length > 0) {
    blockers.push("legacy noindex policy page is present in XML sitemap");
  }
  if (
    policyIndexability.intentionalNoindexPolicyPagesExcluded.length !==
    LEGACY_NOINDEX_POLICY_ROUTES.length
  ) {
    blockers.push("legacy noindex policy-page exclusion is not fully documented");
  }
  for (const [key, value] of Object.entries(bookSuitabilityPolicy)) {
    if (!value) blockers.push(`book suitability policy check failed: ${key}`);
  }

  const passed = blockers.length === 0;

  return {
    executiveResult: passed
      ? "AdSense/contact readiness passed"
      : `AdSense/contact readiness blocked because ${blockers.join("; ")}`,
    contactEmail: MORSEWORDS_SUPPORT_EMAIL,
    contactEmailsFound,
    sitemap,
    generatedBookCount,
    requiredPages,
    footerLinks,
    navLinks,
    contactPath,
    correctionTakedownPath,
    policyIndexability,
    adsenseSensitive,
    placeholderScan,
    unsupportedSafetyClaims,
    brokenSupportLinks,
    redirectOnlyUrlsInSitemap,
    noindexUrlsInSitemap,
    sitemapHostMismatches,
    malformedSitemapUrls,
    bookSuitabilityPolicy,
    fixesMade: [
      "Standardized legacy noindex /misc policy pages from the legacy admin contact address to the shared support email.",
      "Added a deterministic AdSense/contact readiness audit and report artifact.",
      "Preserved sitemap counts, book counts, print inclusion policy, generated books, previews, and Cloudflare export tracking.",
    ],
    blockers,
  };
}

function yn(value: boolean) {
  return value ? "pass" : "fail";
}

function listOrNone(values: string[]) {
  return values.length > 0 ? values.map((value) => `- ${value}`).join("\n") : "None.";
}

function buildMarkdown(result: AuditResult) {
  const pages = result.requiredPages
    .map(
      (page) =>
        `- ${page.key}: route=${yn(page.routeRegistered)}, file=${yn(page.fileExists)}, sitemap=${yn(page.inSitemap)}, canonical=${yn(page.hasCanonical)}, metadata=${yn(page.hasMetadata)}, noindex=${page.hasNoindex ? "fail" : "pass"}, content=${yn(page.hasSubstantialContent)}`,
    )
    .join("\n");
  const footerLinks = Object.entries(result.footerLinks)
    .map(([key, present]) => `- ${key}: ${yn(present)}`)
    .join("\n");
  const navLinks = Object.entries(result.navLinks)
    .map(([key, present]) => `- ${key}: ${yn(present)}`)
    .join("\n");
  const adsense = Object.entries(result.adsenseSensitive)
    .map(([key, present]) => `- ${key}: ${yn(present)}`)
    .join("\n");
  const suitability = Object.entries(result.bookSuitabilityPolicy)
    .map(([key, present]) => `- ${key}: ${yn(present)}`)
    .join("\n");

  return [
    "# AdSense Contact Readiness",
    "",
    "## 1. Executive result",
    "",
    result.executiveResult,
    "",
    "## 2. Contact email/contact path result",
    "",
    `Current standardized contact email: ${result.contactEmail}.`,
    "",
    `Site-source emails found: ${result.contactEmailsFound.join(", ") || "none"}.`,
    "",
    `Contact page email: ${yn(result.contactPath.contactRouteHasEmail)}.`,
    "",
    `Contact page mailto: ${yn(result.contactPath.contactRouteHasMailto)}.`,
    "",
    `Sources page email: ${yn(result.contactPath.sourcesRouteHasEmail)}.`,
    "",
    "## 3. Correction/takedown/report concern path result",
    "",
    `Sources correction language: ${yn(result.correctionTakedownPath.sourcesHasCorrectionLanguage)}.`,
    "",
    `Sources takedown language: ${yn(result.correctionTakedownPath.sourcesHasTakedownLanguage)}.`,
    "",
    `Sources source-concern language: ${yn(result.correctionTakedownPath.sourcesHasSourceConcernLanguage)}.`,
    "",
    `Contact report topics: ${yn(result.correctionTakedownPath.contactHasReportTopics)}.`,
    "",
    `Contact accessibility concern path: ${yn(result.correctionTakedownPath.contactHasAccessibilityConcernPath)}.`,
    "",
    "## 4. Privacy/terms/cookies route result",
    "",
    pages,
    "",
    "## 5. Footer/nav support link result",
    "",
    "Footer:",
    "",
    footerLinks,
    "",
    "Navigation:",
    "",
    navLinks,
    "",
    "## 6. About/Sources trust signal result",
    "",
    `About ownership signal: ${yn(result.contactPath.aboutRouteHasOwnershipSignal)}.`,
    "",
    `About names maintainer: ${yn(result.contactPath.aboutRouteNamesMaintainer)}.`,
    "",
    `Sources public-domain/source policy path: ${yn(result.correctionTakedownPath.sourcesHasSourceConcernLanguage)}.`,
    "",
    "## 7. AdSense-sensitive readiness result",
    "",
    adsense,
    "",
    "## 8. Placeholder/thin support page scan",
    "",
    `Placeholder findings: ${result.placeholderScan.length}.`,
    "",
    result.placeholderScan.length
      ? result.placeholderScan.map((item) => `- ${item.filePath}: ${item.pattern}`).join("\n")
      : "None.",
    "",
    `Thin support pages: ${
      result.requiredPages.filter((page) => !page.hasSubstantialContent).length
    }.`,
    "",
    "## 9. Broken support/nav link scan",
    "",
    `Broken support/nav links: ${result.brokenSupportLinks.length}.`,
    "",
    result.brokenSupportLinks.length
      ? result.brokenSupportLinks
          .map((issue) => `- ${issue.sourceFile} -> ${issue.target}: ${issue.reason}`)
          .join("\n")
      : "None.",
    "",
    "## 10. Sitemap/indexability preservation",
    "",
    `Sitemap URLs: ${result.sitemap.total}.`,
    "",
    `Non-book URLs: ${result.sitemap.nonBook}.`,
    "",
    `Book URLs: ${result.sitemap.book}.`,
    "",
    `Audiobook URLs: ${result.sitemap.audiobook}.`,
    "",
    `Print URLs: ${result.sitemap.print}.`,
    "",
    `Generated book count: ${result.generatedBookCount}.`,
    "",
    `Redirect-only URLs in sitemap: ${result.redirectOnlyUrlsInSitemap.length}.`,
    "",
    `Noindex URLs in sitemap: ${result.noindexUrlsInSitemap.length}.`,
    "",
    `Canonical policy pages in sitemap: ${result.policyIndexability.canonicalPolicyPagesInSitemap.join(", ")}.`,
    "",
    `Legacy noindex policy pages intentionally excluded from XML sitemap: ${result.policyIndexability.intentionalNoindexPolicyPagesExcluded.join(", ")}.`,
    "",
    "## 11. Book content-suitability policy preservation",
    "",
    suitability,
    "",
    `Unsupported all-audience/classroom-safe claim findings: ${result.unsupportedSafetyClaims.length}.`,
    "",
    result.unsupportedSafetyClaims.length
      ? result.unsupportedSafetyClaims
          .map((item) => `- ${item.filePath}: ${item.pattern}`)
          .join("\n")
      : "None.",
    "",
    "## 12. Fixes made",
    "",
    result.fixesMade.map((fix) => `- ${fix}`).join("\n"),
    "",
    "## 13. Remaining blockers",
    "",
    listOrNone(result.blockers),
    "",
    "## 14. Recommended next step",
    "",
    result.blockers.length > 0
      ? "Fix the listed blockers, rerun `npm run pages:adsense-contact-readiness-audit`, then rerun the branch validation suite."
      : "Proceed to `morsewords-final-production-sanity-check-jun-2026`.",
    "",
  ].join("\n");
}

const result = runAudit();
fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(reportJsonPath, `${JSON.stringify(result, null, 2)}\n`);
fs.writeFileSync(reportMdPath, buildMarkdown(result));

console.log("AdSense/contact readiness audit");
console.log(result.executiveResult);
console.log(`Contact email: ${result.contactEmail}`);
console.log(`Site-source emails found: ${result.contactEmailsFound.join(", ") || "none"}`);
console.log(`Privacy/terms/cookies routeable: ${result.requiredPages
  .filter((page) => ["privacy", "terms", "cookies"].includes(page.key))
  .every((page) => page.routeRegistered && page.fileExists) ? "pass" : "fail"}`);
console.log(`Correction/takedown path: ${
  result.correctionTakedownPath.sourcesHasCorrectionLanguage &&
  result.correctionTakedownPath.sourcesHasTakedownLanguage &&
  result.correctionTakedownPath.sourcesHasSourceConcernLanguage
    ? "pass"
    : "fail"
}`);
console.log(`Footer support links: ${Object.values(result.footerLinks).every(Boolean) ? "pass" : "fail"}`);
console.log(`Navigation support links: ${Object.values(result.navLinks).every(Boolean) ? "pass" : "fail"}`);
console.log(`Sitemap URLs: ${result.sitemap.total}`);
console.log(`Book/audiobook/print URLs: ${result.sitemap.book}/${result.sitemap.audiobook}/${result.sitemap.print}`);
console.log(`Placeholder findings: ${result.placeholderScan.length}`);
console.log(`Broken support/nav links: ${result.brokenSupportLinks.length}`);
console.log(`Unsupported safety claims: ${result.unsupportedSafetyClaims.length}`);
console.log(`Report JSON: ${rel(reportJsonPath)}`);
console.log(`Report Markdown: ${rel(reportMdPath)}`);

if (result.blockers.length > 0) {
  console.error("\nBlockers:");
  for (const blocker of result.blockers) console.error(`- ${blocker}`);
  process.exitCode = 1;
} else {
  console.log("Result: pass");
}
