import fs from "node:fs";
import path from "node:path";
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

type PageMetaRecord = {
  path: string;
  kind: "static-route" | "content-data" | "book" | "audiobook" | "print";
  title: string | null;
  description: string | null;
  h1: string | null;
  metadataSource: string;
};

type DuplicateGroup = {
  value: string;
  paths: string[];
  reason?: string;
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
const morseContentPath = path.join(repoRoot, "app", "client", "data", "morseContent.ts");

const REPEATED_COPY_PHRASES = [
  "Quick answers for spacing",
  "Move into drills",
  "Jump between translator",
  "Use the translator",
  "Practice with words",
  "Copy and paste",
] as const;

const GENERIC_META_PATTERNS = [
  /\blearn more about\b/i,
  /\bthis page explains\b/i,
  /\bcoming soon\b/i,
  /\bunder construction\b/i,
  /\bplaceholder\b/i,
  /\bgeneric\b/i,
];

const PLACEHOLDER_PATTERNS = [
  /\bcoming soon\b/i,
  /\bunder construction\b/i,
  /\bnot implemented\b/i,
  /\blorem ipsum\b/i,
];

const DUPLICATE_BOOK_TITLE_REASON =
  "Retained source-variant book titles are distinguished in route title tags.";

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

function parseSitemapPaths() {
  const xml = fs.readFileSync(sitemapPath, "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
    normalizePathname(new URL(match[1]).pathname),
  );
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

function isBookPath(pathname: string) {
  return GENERATED_BOOK_PATTERN.test(pathname) || PRINTABLE_BOOK_PATTERN.test(pathname);
}

function isAudiobookPath(pathname: string) {
  return AUDIOBOOK_PATTERN.test(pathname);
}

function normalizeText(value: string) {
  return value.replace(/\\n/g, " ").replace(/\s+/g, " ").trim();
}

function extractStringConstants(source: string) {
  const constants = new Map<string, string>();
  const pattern = /const\s+([A-Z][A-Z0-9_]*)\s*=\s*(["'`])([\s\S]*?)\2\s*;/g;
  for (const match of source.matchAll(pattern)) {
    constants.set(match[1], normalizeText(match[3]));
  }
  return constants;
}

function extractSeoMetaExpression(source: string, propertyName: "title" | "description") {
  const seoMetaMatch = source.match(/seoMeta\(\s*\{([\s\S]*?)\}\s*\)/);
  if (!seoMetaMatch) return null;

  const block = seoMetaMatch[1];
  const literal = block.match(
    new RegExp(`${propertyName}:\\s*(["'\`])([\\s\\S]*?)\\1\\s*,`),
  );
  if (literal) return { kind: "literal", value: normalizeText(literal[2]) };

  const contentProp = propertyName === "title" ? "metaTitle" : "metaDescription";
  if (new RegExp(`${propertyName}:\\s*CONTENT\\.${contentProp}\\b`).test(block)) {
    return { kind: "content-object", value: null };
  }

  const identifier = block.match(new RegExp(`${propertyName}:\\s*([A-Z][A-Z0-9_]*)\\b`));
  if (identifier) return { kind: "identifier", value: identifier[1] };

  return null;
}

function extractH1Source(source: string) {
  const heroComponentNames =
    "PageHero|ToolHero|UtilityPageHeader|TranslatorSectionsBasic|MorseAudioTranslator|PracticePage|TypingPage|HowToUseSuiteGuide|WordSeparatorTool|PrintableMorsePages|SentencePracticePage|MorseCodeByLanguageHub|MorseLanguageDetailPage|MorseNumbersPage";
  const pageHeroTitle = source.match(
    new RegExp(`\\b(?:${heroComponentNames})\\b[\\s\\S]{0,500}\\btitle=["']([^"']+)["']`),
  );
  if (pageHeroTitle) return normalizeText(pageHeroTitle[1]);

  if (new RegExp(`\\b(?:${heroComponentNames})\\b`).test(source)) {
    return "component title";
  }

  const h1Text = source.match(/<h1\b[^>]*>([^<]+)<\/h1>/);
  if (h1Text) return normalizeText(h1Text[1]);

  if (/\bCONTENT\.h1\b|\bCONTENT\.displayTitle\b/.test(source)) {
    return "content object";
  }

  return null;
}

function extractRouteMeta(routePath: string, filePath: string): PageMetaRecord {
  const source = fs.readFileSync(filePath, "utf8");
  const constants = extractStringConstants(source);
  const titleExpression = extractSeoMetaExpression(source, "title");
  const descriptionExpression = extractSeoMetaExpression(source, "description");

  function resolveExpression(expression: ReturnType<typeof extractSeoMetaExpression>) {
    if (!expression) return null;
    if (expression.kind === "literal") return expression.value;
    if (expression.kind === "content-object") return null;
    if (expression.kind === "identifier" && expression.value) {
      return constants.get(expression.value) ?? null;
    }
    return null;
  }

  const metadataSource =
    titleExpression?.kind === "content-object" || descriptionExpression?.kind === "content-object"
      ? "content object"
      : "route source";

  return {
    path: routePath,
    kind: "static-route",
    title: resolveExpression(titleExpression),
    description: resolveExpression(descriptionExpression),
    h1: extractH1Source(source),
    metadataSource,
  };
}

function extractContentDataMetaRecords() {
  const source = fs.readFileSync(morseContentPath, "utf8");
  const records: PageMetaRecord[] = [];
  const pathPattern = /path:\s*(["'])([^"']+)\1[\s\S]{0,900}?metaTitle:\s*(["'])([\s\S]*?)\3\s*,[\s\S]{0,500}?metaDescription:\s*(["'])([\s\S]*?)\5\s*,/g;
  for (const match of source.matchAll(pathPattern)) {
    records.push({
      path: match[2],
      kind: "content-data",
      title: normalizeText(match[4]),
      description: normalizeText(match[6]),
      h1: null,
      metadataSource: "app/client/data/morseContent.ts",
    });
  }
  return records;
}

type GeneratedBook = {
  slug: string;
  title: string;
  author?: string[];
  source?: { gutenbergId?: string | null };
  stats?: { sectionCount?: number; wordCount?: number };
};

function countGeneratedBooks() {
  const manifest = readJson<{ books?: GeneratedBook[] }>(generatedManifestPath);
  return manifest.books ?? [];
}

function readSeoDescriptions() {
  const registry = readJson<{
    summaries?: Array<{ slug: string; description?: string }>;
  }>(seoSummaryPath);
  return new Map((registry.summaries ?? []).map((summary) => [summary.slug, summary.description ?? ""]));
}

function duplicateTitleSet(books: GeneratedBook[]) {
  const counts = new Map<string, number>();
  for (const book of books) {
    const key = book.title.trim().toLowerCase();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return new Set([...counts].filter(([, count]) => count > 1).map(([title]) => title));
}

function duplicateTitleVariant(book: GeneratedBook, duplicates: Set<string>) {
  if (!duplicates.has(book.title.trim().toLowerCase())) return "";
  return book.slug.includes("-gutenberg-")
    ? " (Gutenberg source)"
    : " (MorseWords source)";
}

function buildBookMetaRecords(books: GeneratedBook[], seoDescriptions: Map<string, string>) {
  const duplicates = duplicateTitleSet(books);
  const records: PageMetaRecord[] = [];
  for (const book of books) {
    const variant = duplicateTitleVariant(book, duplicates);
    const bookDescription =
      seoDescriptions.get(book.slug) ||
      `Read ${book.title} as cleaned book text, preview Morse code, download MP3, or open the live Morse player.`;
    records.push({
      path: `/morse-code-books/${book.slug}`,
      kind: "book",
      title: `${book.title}${variant} in Morse Code | MorseWords`,
      description: bookDescription,
      h1: book.title,
      metadataSource: "generated book manifest + SEO summary registry",
    });
    records.push({
      path: `/morse-code-audiobooks/${book.slug}`,
      kind: "audiobook",
      title: `${book.title}${variant} Live Morse Player | MorseWords`,
      description: `Listen to ${book.title}${variant.replace(/[()]/g, "").trim() ? ` ${variant.replace(/[()]/g, "").trim()}` : ""} as a live Morse audiobook with chapter selection, playback controls, and MP3 download.`,
      h1: book.title,
      metadataSource: "generated book manifest",
    });
    records.push({
      path: `/morse-code-books/${book.slug}/print`,
      kind: "print",
      title: `${book.title}${variant} Printable Morse Book | MorseWords`,
      description: `Print readable Morse practice pages for ${book.title}${variant.replace(/[()]/g, "").trim() ? ` ${variant.replace(/[()]/g, "").trim()}` : ""} with source notes, section-friendly text, and classroom or solo practice formatting.`,
      h1: book.title,
      metadataSource: "generated book manifest",
    });
  }
  return records;
}

function findGscInputFiles() {
  const results: string[] = [];
  const skipDirs = new Set([
    ".git",
    ".netlify",
    "build",
    "coverage",
    "node_modules",
    "cloudflare-export",
    "generated",
  ]);
  const pattern = /(?:gsc|search[-_ ]?console)/i;
  const supportedExportExtension = /\.(?:csv|tsv|xlsx?|json)$/i;

  function walk(dir: string, depth: number) {
    if (depth > 5) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (skipDirs.has(entry.name)) continue;
        walk(path.join(dir, entry.name), depth + 1);
        continue;
      }
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(repoRoot, fullPath);
      if (
        pattern.test(entry.name) &&
        supportedExportExtension.test(entry.name) &&
        !relativePath.startsWith("scripts") &&
        !relativePath.startsWith("tests")
      ) {
        results.push(relativePath);
      }
    }
  }

  walk(repoRoot, 0);
  return results.sort();
}

function countStartupPreviews() {
  return fs.readdirSync(previewDir).filter((name) => name.endsWith(".preview.json")).length;
}

function groupDuplicates(records: PageMetaRecord[], field: "title" | "description") {
  const byValue = new Map<string, string[]>();
  for (const record of records) {
    const value = record[field];
    if (!value) continue;
    const key = value.toLowerCase();
    byValue.set(key, [...(byValue.get(key) ?? []), record.path]);
  }
  return [...byValue]
    .filter(([, paths]) => paths.length > 1)
    .map(([value, paths]) => ({ value, paths }));
}

function countRepeatedCopyPhrases() {
  const roots = [
    path.join(repoRoot, "app", "routes"),
    path.join(repoRoot, "app", "client"),
  ];
  const counts = new Map<string, { count: number; files: Set<string> }>();
  for (const phrase of REPEATED_COPY_PHRASES) {
    counts.set(phrase, { count: 0, files: new Set() });
  }

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "assets") continue;
        walk(fullPath);
        continue;
      }
      if (!/\.(?:ts|tsx)$/.test(entry.name)) continue;
      const source = fs.readFileSync(fullPath, "utf8");
      for (const phrase of REPEATED_COPY_PHRASES) {
        const matches = source.match(new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"));
        if (!matches) continue;
        const bucket = counts.get(phrase);
        if (!bucket) continue;
        bucket.count += matches.length;
        bucket.files.add(path.relative(repoRoot, fullPath));
      }
    }
  }

  for (const root of roots) walk(root);
  return [...counts].map(([phrase, result]) => ({
    phrase,
    count: result.count,
    files: [...result.files].sort(),
  }));
}

function weakMetaRecords(records: PageMetaRecord[]) {
  return records.filter((record) => {
    const description = record.description;
    if (!description) return false;
    const length = description.length;
    if (length < 70 || length > 210) return true;
    return GENERIC_META_PATTERNS.some((pattern) => pattern.test(description));
  });
}

function titleLengthIssues(records: PageMetaRecord[]) {
  return records.filter((record) => {
    if (!record.title) return false;
    return record.title.length < 18 || record.title.length > 82;
  });
}

function placeholderCopyIssues(routeSources: Map<string, RouteSource>, indexablePaths: string[]) {
  const issues: Array<{ path: string; file: string; pattern: string }> = [];
  for (const routePath of indexablePaths) {
    if (isBookPath(routePath) || isAudiobookPath(routePath)) continue;
    const routeSource = routeSources.get(routePath);
    if (!routeSource || !fs.existsSync(routeSource.filePath)) continue;
    const source = fs.readFileSync(routeSource.filePath, "utf8");
    for (const pattern of PLACEHOLDER_PATTERNS) {
      if (pattern.test(source)) {
        issues.push({
          path: routePath,
          file: path.relative(repoRoot, routeSource.filePath),
          pattern: pattern.source,
        });
      }
    }
  }
  return issues;
}

function allowedDuplicateTitleGroups(groups: DuplicateGroup[]) {
  return groups.map((group) => {
    const allBookVariants = group.paths.every((pathname) =>
      /^\/morse-code-(?:audio)?books\//.test(pathname) ||
      /^\/morse-code-books\/[^/]+\/print$/.test(pathname),
    );
    return {
      ...group,
      reason: allBookVariants ? DUPLICATE_BOOK_TITLE_REASON : undefined,
    };
  });
}

function runAudit() {
  const sitemapPaths = parseSitemapPaths();
  const routeSources = parseRouteSources();
  const books = countGeneratedBooks();
  const seoDescriptions = readSeoDescriptions();
  const contentDataRecords = extractContentDataMetaRecords();
  const indexableNonBookPaths = sitemapPaths.filter((pathname) =>
    !isBookPath(pathname) &&
    !isAudiobookPath(pathname) &&
    !(REDIRECT_ALIAS_PATHS as readonly string[]).includes(pathname),
  );
  const staticRouteRecords = indexableNonBookPaths
    .map((routePath) => {
      const routeSource = routeSources.get(routePath);
      if (!routeSource || routeSource.kind === "redirect" || !fs.existsSync(routeSource.filePath)) {
        return null;
      }
      return extractRouteMeta(routePath, routeSource.filePath);
    })
    .filter((record): record is PageMetaRecord => Boolean(record));

  const records = [
    ...staticRouteRecords,
    ...contentDataRecords,
    ...buildBookMetaRecords(books, seoDescriptions),
  ];

  const missingTitle = records.filter((record) => !record.title && record.metadataSource !== "content object");
  const missingDescription = records.filter(
    (record) => !record.description && record.metadataSource !== "content object",
  );
  const missingH1 = staticRouteRecords.filter((record) => !record.h1);
  const rawDuplicateTitles = groupDuplicates(records, "title");
  const duplicateTitlesWithReasons = allowedDuplicateTitleGroups(rawDuplicateTitles);
  const blockingDuplicateTitles = duplicateTitlesWithReasons.filter((group) => !group.reason);
  const duplicateDescriptions = groupDuplicates(records, "description");
  const weakMeta = weakMetaRecords(records);
  const titleIssues = titleLengthIssues(records);
  const placeholderIssues = placeholderCopyIssues(routeSources, indexableNonBookPaths);
  const repeatedCopy = countRepeatedCopyPhrases();
  const repeatedCopyBlockers = repeatedCopy.filter((item) => item.count > 20);
  const gscInputFiles = findGscInputFiles();

  const bookUrlCount = sitemapPaths.filter((pathname) => GENERATED_BOOK_PATTERN.test(pathname)).length;
  const audiobookUrlCount = sitemapPaths.filter((pathname) => AUDIOBOOK_PATTERN.test(pathname)).length;
  const printableBookUrlCount = sitemapPaths.filter((pathname) => PRINTABLE_BOOK_PATTERN.test(pathname)).length;
  const seoSummaryCount = seoDescriptions.size;
  const startupPreviewCount = countStartupPreviews();

  const blockers = [
    ...missingTitle.map((record) => `missing title: ${record.path}`),
    ...missingDescription.map((record) => `missing meta description: ${record.path}`),
    ...missingH1.map((record) => `missing H1 marker: ${record.path}`),
    ...blockingDuplicateTitles.map((group) => `duplicate title: ${group.value} (${group.paths.join(", ")})`),
    ...duplicateDescriptions.map((group) => `duplicate meta description: ${group.value} (${group.paths.join(", ")})`),
    ...weakMeta.map((record) => `weak/generic meta description: ${record.path}`),
    ...placeholderIssues.map((issue) => `placeholder copy: ${issue.path} (${issue.pattern})`),
    ...repeatedCopyBlockers.map((item) => `repeated helper copy: "${item.phrase}" appears ${item.count} times`),
    ...(bookUrlCount === 519 ? [] : [`book URL count is ${bookUrlCount}, expected 519`]),
    ...(audiobookUrlCount === 519 ? [] : [`audiobook URL count is ${audiobookUrlCount}, expected 519`]),
    ...(books.length === 519 ? [] : [`generated book count is ${books.length}, expected 519`]),
    ...(seoSummaryCount === 519 ? [] : [`SEO summary count is ${seoSummaryCount}, expected 519`]),
    ...(startupPreviewCount === 519 ? [] : [`startup preview count is ${startupPreviewCount}, expected 519`]),
  ];

  return {
    gscInputFiles,
    pagesInspected: sitemapPaths.length,
    staticRouteRecords: staticRouteRecords.length,
    contentDataRecords: contentDataRecords.length,
    metadataRecords: records.length,
    titleRecords: records.filter((record) => record.title).length,
    descriptionRecords: records.filter((record) => record.description).length,
    missingTitleCount: missingTitle.length,
    missingDescriptionCount: missingDescription.length,
    missingH1Count: missingH1.length,
    duplicateTitleCount: blockingDuplicateTitles.length,
    allowedDuplicateTitleGroups: duplicateTitlesWithReasons.filter((group) => group.reason),
    duplicateMetaDescriptionCount: duplicateDescriptions.length,
    weakGenericMetaCount: weakMeta.length,
    titleLengthIssueCount: titleIssues.length,
    placeholderIssueCount: placeholderIssues.length,
    repeatedCopy,
    repeatedCopyBlockerCount: repeatedCopyBlockers.length,
    bookUrlCount,
    audiobookUrlCount,
    printableBookUrlCount,
    generatedBookCount: books.length,
    seoSummaryCount,
    startupPreviewCount,
    blockers,
  };
}

const result = runAudit();

console.log("GSC/meta/content-quality audit");
console.log(
  result.gscInputFiles.length > 0
    ? `GSC/Search Console inputs: ${result.gscInputFiles.join(", ")}`
    : "GSC/Search Console inputs: none found",
);
console.log(`Sitemap pages inspected: ${result.pagesInspected}`);
console.log(`Static route metadata records: ${result.staticRouteRecords}`);
console.log(`Content-data metadata records: ${result.contentDataRecords}`);
console.log(`Total metadata records: ${result.metadataRecords}`);
console.log(`Titles inspected: ${result.titleRecords}`);
console.log(`Meta descriptions inspected: ${result.descriptionRecords}`);
console.log(`Missing titles: ${result.missingTitleCount}`);
console.log(`Missing descriptions: ${result.missingDescriptionCount}`);
console.log(`Missing H1 markers: ${result.missingH1Count}`);
console.log(`Duplicate title blockers: ${result.duplicateTitleCount}`);
console.log(`Allowed duplicate title groups: ${result.allowedDuplicateTitleGroups.length}`);
console.log(`Duplicate meta descriptions: ${result.duplicateMetaDescriptionCount}`);
console.log(`Weak/generic meta descriptions: ${result.weakGenericMetaCount}`);
console.log(`Title length issues: ${result.titleLengthIssueCount}`);
console.log(`Placeholder copy issues: ${result.placeholderIssueCount}`);
console.log("Repeated helper-copy phrase counts:");
for (const item of result.repeatedCopy) {
  console.log(`- ${item.phrase}: ${item.count}`);
}
console.log(`Book URLs: ${result.bookUrlCount}`);
console.log(`Audiobook URLs: ${result.audiobookUrlCount}`);
console.log(`Printable book URLs: ${result.printableBookUrlCount}`);
console.log(`Generated books: ${result.generatedBookCount}`);
console.log(`SEO summaries: ${result.seoSummaryCount}`);
console.log(`Startup previews: ${result.startupPreviewCount}`);

if (result.blockers.length > 0) {
  console.error("\nBlockers:");
  for (const blocker of result.blockers.slice(0, 80)) console.error(`- ${blocker}`);
  if (result.blockers.length > 80) {
    console.error(`- ...and ${result.blockers.length - 80} more blockers`);
  }
  process.exitCode = 1;
} else {
  console.log("Result: pass");
}
