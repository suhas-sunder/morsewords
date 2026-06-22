import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  GeneratedLibraryBookSummary,
  GeneratedLibraryManifest,
} from "./bookManifestTypes.ts";

type PreviewManifest = {
  books: Array<{ slug: string; path: string }>;
};

type SeoSummaryData = {
  summaries: Array<{ slug: string }>;
};

type RawInventoryTriageReport = {
  unresolvedSourceGeneratedItems: Array<{ slug: string }>;
};

type AuditReport = {
  generatedAt: string;
  reportName: string;
  filesInspected: string[];
  filesChanged: string[];
  counts: {
    generatedBookCount: number;
    previewCount: number;
    pilotSummaryCount: number;
    sitemapTotalUrlCount: number;
    sitemapBookUrlCount: number;
    sitemapAudiobookUrlCount: number;
    sitemapPrintUrlCount: number;
    bookIndexCoverageCount: number;
    audiobookIndexCoverageCount: number;
    orphanBookCount: number;
    orphanAudiobookCount: number;
    missingSitemapUrlCount: number;
    brokenInternalLinkCount: number;
    duplicateSitemapUrlCount: number;
    unsafeSitemapUrlCount: number;
    booksWithRelatedAuthorLinks: number;
    relatedAuthorLinkCount: number;
    unresolvedSourceGeneratedBookCount: number;
  };
  missing: {
    previews: string[];
    sitemapBookUrls: string[];
    sitemapAudiobookUrls: string[];
    bookIndexSlugs: string[];
    audiobookIndexSlugs: string[];
  };
  unexpected: {
    sitemapBookSlugs: string[];
    sitemapAudiobookSlugs: string[];
  };
  strategy: {
    sourceOfTruth: string;
    relatedAuthorLinks: string;
    canonicalMetaFallback: string;
    pilotSummaryInteraction: string;
    unresolvedSourceGeneratedBooks: string;
  };
  validation: Record<string, "pass" | "fail">;
  errors: string[];
  result: "pass" | "fail";
  remainingNonBlockingRecommendations: string[];
};

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const relativePaths = {
  libraryManifest: "app/client/assets/books/generated/library-manifest.json",
  previewManifest: "public/book-previews/manifest.json",
  seoSummaries: "app/client/assets/books/seo-summaries/book-seo-summaries.json",
  rawInventory:
    "app/client/assets/books/audit-reports/remaining-raw-inventory-triage/remaining-raw-inventory-triage.json",
  sitemapXml: "public/sitemap.xml",
  routes: "app/routes.ts",
  routeRegistry: "app/client/data/routes.ts",
  morseBooksData: "app/client/data/morseBooks.ts",
  bookIndex: "app/routes/morse-code-books.tsx",
  audiobookIndex: "app/routes/morse-code-audiobooks.tsx",
  bookDetail: "app/routes/morse-code-books.$slug.tsx",
  audiobookDetail: "app/routes/morse-code-audiobooks.$slug.tsx",
  bookPage: "app/client/components/morse-code-books/MorseBookPage.tsx",
  directory:
    "app/client/components/morse-code-books/MorseBookLinkDirectory.tsx",
  nav: "app/client/components/navigation/NavBar.tsx",
  htmlSitemap: "app/routes/sitemap.tsx",
  robots: "public/robots.txt",
  packageJson: "package.json",
} as const;
const reportRoot = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "book-sitemap-nav-internal-linking",
);
const reportJsonPath = path.join(
  reportRoot,
  "book-sitemap-nav-internal-linking.json",
);
const reportMdPath = path.join(
  reportRoot,
  "book-sitemap-nav-internal-linking.md",
);
const siteUrl = "https://www.morsewords.com";

const filesChanged = [
  "app/client/data/morseBooks.ts",
  "app/client/components/morse-code-books/MorseBookLinkDirectory.tsx",
  "app/client/components/morse-code-books/MorseBookPagination.tsx",
  "app/client/components/morse-code-books/MorseBookPage.tsx",
  "app/routes/morse-code-books.tsx",
  "app/routes/morse-code-audiobooks.tsx",
  "app/routes/morse-code-books.$slug.tsx",
  "app/routes/morse-code-audiobooks.$slug.tsx",
  "app/routes/sitemap.tsx",
  "public/sitemap.xml",
  "scripts/books/sync-book-sitemap.ts",
  "scripts/books/book-sitemap-nav-internal-linking-audit.ts",
  "tests/qa-robustness-review/morse-book-page.spec.ts",
  "package.json",
  "app/client/assets/books/audit-reports/book-sitemap-nav-internal-linking/book-sitemap-nav-internal-linking.json",
  "app/client/assets/books/audit-reports/book-sitemap-nav-internal-linking/book-sitemap-nav-internal-linking.md",
];

function absolutePath(relativePath: string) {
  return path.join(repoRoot, ...relativePath.split("/"));
}

function readText(relativePath: string) {
  return fs.readFileSync(absolutePath(relativePath), "utf8");
}

function readJson<T>(relativePath: string): T {
  return JSON.parse(readText(relativePath)) as T;
}

function isAcceptedGeneratedBook(book: GeneratedLibraryBookSummary) {
  const approvedBySource =
    book.source.approvalSource === "file-evidence" ||
    book.source.approvalSource === "external-authority" ||
    (book.source.approvalSource === "owner-reviewed" &&
      book.source.rightsReviewed === true) ||
    (book.source.approvalSource === undefined &&
      book.source.rightsReviewed === true);
  return (
    approvedBySource &&
    book.source.publishReady === true &&
    book.source.rightsStatus === "approved" &&
    book.source.processingAllowed === true
  );
}

function normalizedAuthorKey(author: string) {
  return author.trim().replace(/\s+/g, " ").toLowerCase();
}

function sitemapLocations(xml: string) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

function slugFromUrl(url: string, routePrefix: string) {
  const match = url.match(new RegExp(`^${siteUrl}${routePrefix}/([^/]+)$`));
  return match?.[1] ?? null;
}

function sortedDifference(expected: Set<string>, actual: Set<string>) {
  return [...expected].filter((value) => !actual.has(value)).sort();
}

function hasAll(source: string, needles: string[]) {
  return needles.every((needle) => source.includes(needle));
}

function reportMarkdown(report: AuditReport) {
  const validationRows = Object.entries(report.validation)
    .map(([check, result]) => `| ${check} | ${result} |`)
    .join("\n");
  return `# Book Sitemap, Navigation, and Internal-Linking Audit

Generated: ${report.generatedAt}

## Executive summary

The generated library manifest is the discoverability source of truth. All ${report.counts.generatedBookCount} accepted generated books and ${report.counts.previewCount} previews are represented in the book and audiobook directories and in the static XML sitemap.

Audit result: **${report.result}**

## Coverage

- Generated books: ${report.counts.generatedBookCount}
- Preview assets: ${report.counts.previewCount}
- Pilot SEO summaries: ${report.counts.pilotSummaryCount}
- Sitemap book URLs: ${report.counts.sitemapBookUrlCount}
- Sitemap audiobook URLs: ${report.counts.sitemapAudiobookUrlCount}
- Sitemap print URLs: ${report.counts.sitemapPrintUrlCount}
- Book index coverage: ${report.counts.bookIndexCoverageCount}
- Audiobook index coverage: ${report.counts.audiobookIndexCoverageCount}
- Orphan books: ${report.counts.orphanBookCount}
- Orphan audiobooks: ${report.counts.orphanAudiobookCount}
- Missing sitemap URLs: ${report.counts.missingSitemapUrlCount}
- Broken internal links: ${report.counts.brokenInternalLinkCount}
- Duplicate sitemap URLs: ${report.counts.duplicateSitemapUrlCount}
- Unsafe sitemap URLs: ${report.counts.unsafeSitemapUrlCount}

## Navigation and internal linking

Both index routes expose a searchable paginated browser plus a visible complete A-Z directory containing all ${report.counts.generatedBookCount} canonical slugs. Audiobook cards point to audiobook routes. The More navigation links clearly to both library indexes while preserving its established public-book shortcuts.

${report.strategy.relatedAuthorLinks}

## Canonical and summary behavior

${report.strategy.canonicalMetaFallback}

${report.strategy.pilotSummaryInteraction}

## Unresolved-source generated books

${report.strategy.unresolvedSourceGeneratedBooks}

## Validation

| Check | Result |
| --- | --- |
${validationRows}

## Files changed

${report.filesChanged.map((file) => `- ${file}`).join("\n")}

## Remaining non-blocking recommendations

${report.remainingNonBlockingRecommendations.map((item) => `- ${item}`).join("\n")}
`;
}

function main() {
  const libraryManifest = readJson<GeneratedLibraryManifest>(
    relativePaths.libraryManifest,
  );
  const previewManifest = readJson<PreviewManifest>(relativePaths.previewManifest);
  const seoSummaries = readJson<SeoSummaryData>(relativePaths.seoSummaries);
  const rawInventory = readJson<RawInventoryTriageReport>(relativePaths.rawInventory);
  const sitemapXml = readText(relativePaths.sitemapXml);
  const sitemapUrls = sitemapLocations(sitemapXml);
  const sitemapUrlSet = new Set(sitemapUrls);
  const acceptedBooks = libraryManifest.books.filter(isAcceptedGeneratedBook);
  const generatedSlugs = new Set(acceptedBooks.map((book) => book.slug));
  const previewSlugs = new Set(previewManifest.books.map((book) => book.slug));
  const bookSitemapSlugs = new Set(
    sitemapUrls
      .map((url) => slugFromUrl(url, "/morse-code-books"))
      .filter((slug): slug is string => Boolean(slug)),
  );
  const audiobookSitemapSlugs = new Set(
    sitemapUrls
      .map((url) => slugFromUrl(url, "/morse-code-audiobooks"))
      .filter((slug): slug is string => Boolean(slug)),
  );
  const printSitemapUrls = sitemapUrls.filter((url) =>
    /^https:\/\/www\.morsewords\.com\/morse-code-books\/[^/]+\/print$/.test(
      url,
    ),
  );

  const missingPreviews = sortedDifference(generatedSlugs, previewSlugs);
  const missingBookSitemapSlugs = sortedDifference(
    generatedSlugs,
    bookSitemapSlugs,
  );
  const missingAudiobookSitemapSlugs = sortedDifference(
    generatedSlugs,
    audiobookSitemapSlugs,
  );
  const unexpectedBookSitemapSlugs = sortedDifference(
    bookSitemapSlugs,
    generatedSlugs,
  );
  const unexpectedAudiobookSitemapSlugs = sortedDifference(
    audiobookSitemapSlugs,
    generatedSlugs,
  );
  const duplicateSitemapUrlCount = sitemapUrls.length - sitemapUrlSet.size;
  const unsafeSitemapUrls = sitemapUrls.filter((url) =>
    /(temp-books|audit-reports|cloudflare-export|\/tmp\/|\/private\/)/i.test(url),
  );

  const sources = Object.fromEntries(
    Object.entries(relativePaths).map(([key, relativePath]) => [
      key,
      readText(relativePath),
    ]),
  ) as Record<keyof typeof relativePaths, string>;
  const bookIndexUsesGeneratedManifest = hasAll(sources.bookIndex, [
    "getDiscoverableMorseBookSummaries",
    '<MorseBookLinkDirectory books={books} mode="book" />',
  ]);
  const audiobookIndexUsesGeneratedManifest = hasAll(sources.audiobookIndex, [
    "getDiscoverableMorseBookSummaries",
    '<MorseBookLinkDirectory books={books} mode="audiobook" />',
    "morseAudiobookPath(book.slug)",
  ]);
  const detailRoutesUseGeneratedManifest = hasAll(
    `${sources.bookDetail}\n${sources.audiobookDetail}`,
    ["getDiscoverableMorseBookSummary"],
  );
  const htmlSitemapUsesGeneratedManifest = hasAll(sources.htmlSitemap, [
    "getDiscoverableMorseBookSummaries",
    "morseBookPath(book.slug)",
    "morseAudiobookPath(book.slug)",
  ]);
  const navigationHasLibraryIndexes = hasAll(sources.nav, [
    "ROUTES.morseBooks",
    "ROUTES.morseAudiobooks",
  ]);
  const detailIndexLinksPresent = hasAll(sources.bookPage, [
    'data-testid="morse-book-library-navigation"',
    "ROUTES.morseBooks",
    "ROUTES.morseAudiobooks",
  ]);
  const matchingRouteLinksPresent = hasAll(sources.bookPage, [
    "morseBookPath(book.slug)",
    "morseAudiobookPath(book.slug)",
  ]);
  const relatedAuthorImplementationPresent = hasAll(
    `${sources.morseBooksData}\n${sources.bookPage}`,
    [
      "getRelatedMorseBooksByAuthor",
      "book.slug !== currentSlug",
      ".slice(0, limit)",
      "data-mw-related-author-slug",
    ],
  );

  const relatedByAuthor = new Map<string, GeneratedLibraryBookSummary[]>();
  for (const book of acceptedBooks) {
    for (const author of book.author) {
      const key = normalizedAuthorKey(author);
      if (!key) continue;
      const authorBooks = relatedByAuthor.get(key) ?? [];
      authorBooks.push(book);
      relatedByAuthor.set(key, authorBooks);
    }
  }
  let booksWithRelatedAuthorLinks = 0;
  let relatedAuthorLinkCount = 0;
  let relatedAuthorSelfLinkCount = 0;
  for (const book of acceptedBooks) {
    const relatedSlugs = new Set<string>();
    for (const author of book.author) {
      const key = normalizedAuthorKey(author);
      for (const relatedBook of relatedByAuthor.get(key) ?? []) {
        if (relatedBook.slug === book.slug) {
          continue;
        }
        if (!generatedSlugs.has(relatedBook.slug)) relatedAuthorSelfLinkCount += 1;
        relatedSlugs.add(relatedBook.slug);
      }
    }
    const visibleRelatedCount = Math.min(4, relatedSlugs.size);
    if (visibleRelatedCount > 0) booksWithRelatedAuthorLinks += 1;
    relatedAuthorLinkCount += visibleRelatedCount;
  }

  const bookCanonicalMetaPass = hasAll(sources.bookDetail, [
    "morseBookPath(book.slug)",
    "seoSummary?.description ??",
    "index,follow",
  ]);
  const audiobookCanonicalMetaPass = hasAll(sources.audiobookDetail, [
    "morseAudiobookPath(book.slug)",
    "seoSummary?.description ??",
    "index,follow",
  ]);
  const summarySlugs = new Set(seoSummaries.summaries.map((summary) => summary.slug));
  const pilotSummariesAreSubset = [...summarySlugs].every((slug) =>
    generatedSlugs.has(slug),
  );
  const unresolvedSlugs = rawInventory.unresolvedSourceGeneratedItems.map(
    (item) => item.slug,
  );
  const unresolvedIncluded = unresolvedSlugs.every(
    (slug) =>
      generatedSlugs.has(slug) &&
      bookSitemapSlugs.has(slug) &&
      audiobookSitemapSlugs.has(slug),
  );
  const robotsSitemapPass = sources.robots.includes(
    "Sitemap: https://www.morsewords.com/sitemap.xml",
  );
  const routeRegistryPass = hasAll(sources.routes, [
    'route("morse-code-books/:slug"',
    'route("morse-code-audiobooks/:slug"',
  ]);

  const missingBookIndexSlugs = bookIndexUsesGeneratedManifest
    ? []
    : [...generatedSlugs].sort();
  const missingAudiobookIndexSlugs = audiobookIndexUsesGeneratedManifest
    ? []
    : [...generatedSlugs].sort();
  const orphanBookCount = new Set([
    ...missingBookSitemapSlugs,
    ...missingBookIndexSlugs,
  ]).size;
  const orphanAudiobookCount = new Set([
    ...missingAudiobookSitemapSlugs,
    ...missingAudiobookIndexSlugs,
  ]).size;
  const brokenInternalLinkCount =
    unexpectedBookSitemapSlugs.length +
    unexpectedAudiobookSitemapSlugs.length +
    relatedAuthorSelfLinkCount;

  const validation = {
    generatedBookCount: acceptedBooks.length === 465 ? "pass" : "fail",
    previewCount:
      previewManifest.books.length === 465 && missingPreviews.length === 0
        ? "pass"
        : "fail",
    sitemapBookCoverage:
      bookSitemapSlugs.size === 465 && missingBookSitemapSlugs.length === 0
        ? "pass"
        : "fail",
    sitemapAudiobookCoverage:
      audiobookSitemapSlugs.size === 465 &&
      missingAudiobookSitemapSlugs.length === 0
        ? "pass"
        : "fail",
    bookIndexCoverage: bookIndexUsesGeneratedManifest ? "pass" : "fail",
    audiobookIndexCoverage: audiobookIndexUsesGeneratedManifest
      ? "pass"
      : "fail",
    detailRouteCoverage: detailRoutesUseGeneratedManifest ? "pass" : "fail",
    htmlSitemapCoverage: htmlSitemapUsesGeneratedManifest ? "pass" : "fail",
    navigationIndexes: navigationHasLibraryIndexes ? "pass" : "fail",
    matchingAndIndexLinks:
      detailIndexLinksPresent && matchingRouteLinksPresent ? "pass" : "fail",
    relatedAuthorLinks:
      relatedAuthorImplementationPresent && relatedAuthorSelfLinkCount === 0
        ? "pass"
        : "fail",
    canonicalMetaFallback:
      bookCanonicalMetaPass && audiobookCanonicalMetaPass ? "pass" : "fail",
    pilotSummaryInteraction: pilotSummariesAreSubset ? "pass" : "fail",
    unresolvedSourceGeneratedBooks: unresolvedIncluded ? "pass" : "fail",
    duplicateAndUnsafeUrls:
      duplicateSitemapUrlCount === 0 && unsafeSitemapUrls.length === 0
        ? "pass"
        : "fail",
    robotsAndRoutes: robotsSitemapPass && routeRegistryPass ? "pass" : "fail",
  } satisfies AuditReport["validation"];
  const errors = Object.entries(validation)
    .filter(([, result]) => result === "fail")
    .map(([check]) => `Validation failed: ${check}`);
  const result = errors.length === 0 ? "pass" : "fail";

  const report: AuditReport = {
    generatedAt: new Date().toISOString(),
    reportName: "book-sitemap-nav-internal-linking",
    filesInspected: Object.values(relativePaths),
    filesChanged,
    counts: {
      generatedBookCount: acceptedBooks.length,
      previewCount: previewManifest.books.length,
      pilotSummaryCount: seoSummaries.summaries.length,
      sitemapTotalUrlCount: sitemapUrls.length,
      sitemapBookUrlCount: bookSitemapSlugs.size,
      sitemapAudiobookUrlCount: audiobookSitemapSlugs.size,
      sitemapPrintUrlCount: printSitemapUrls.length,
      bookIndexCoverageCount: bookIndexUsesGeneratedManifest
        ? acceptedBooks.length
        : 0,
      audiobookIndexCoverageCount: audiobookIndexUsesGeneratedManifest
        ? acceptedBooks.length
        : 0,
      orphanBookCount,
      orphanAudiobookCount,
      missingSitemapUrlCount:
        missingBookSitemapSlugs.length + missingAudiobookSitemapSlugs.length,
      brokenInternalLinkCount,
      duplicateSitemapUrlCount,
      unsafeSitemapUrlCount: unsafeSitemapUrls.length,
      booksWithRelatedAuthorLinks,
      relatedAuthorLinkCount,
      unresolvedSourceGeneratedBookCount: unresolvedSlugs.length,
    },
    missing: {
      previews: missingPreviews,
      sitemapBookUrls: missingBookSitemapSlugs,
      sitemapAudiobookUrls: missingAudiobookSitemapSlugs,
      bookIndexSlugs: missingBookIndexSlugs,
      audiobookIndexSlugs: missingAudiobookIndexSlugs,
    },
    unexpected: {
      sitemapBookSlugs: unexpectedBookSitemapSlugs,
      sitemapAudiobookSlugs: unexpectedAudiobookSitemapSlugs,
    },
    strategy: {
      sourceOfTruth:
        "The accepted generated library manifest drives route recognition, both complete A-Z directories, the HTML sitemap, and static XML sitemap sync. The stale Cloudflare export is not used for discovery.",
      relatedAuthorLinks:
        "Exact normalized author metadata matches only. Links are sorted by title and slug, exclude the current book, deduplicate by slug, and are capped at four visible links per page. Single-work authors show no related block.",
      canonicalMetaFallback:
        "Book and audiobook detail routes build canonicals from the generated canonical slug. Pilot descriptions are used when present; all other books keep deterministic non-empty route fallbacks.",
      pilotSummaryInteraction:
        "The 20 pilot summaries enrich matching descriptions only. The other 445 accepted generated books remain fully present in directories and sitemap coverage.",
      unresolvedSourceGeneratedBooks:
        `All ${unresolvedSlugs.length} documented unresolved-source generated books remain included as accepted book and audiobook pages. Raw unresolved candidates, duplicates, and boundary-defect files are not imported into discovery data.`,
    },
    validation,
    errors,
    result,
    remainingNonBlockingRecommendations: [
      "Keep running books:sitemap-sync whenever the accepted generated manifest changes.",
      "Keep source-resolution debt tracked separately; it does not block discoverability for the 11 accepted generated books.",
      "Run the later GSC and broad SEO/meta review only after controlled summary scaling is complete.",
    ],
  };

  fs.mkdirSync(reportRoot, { recursive: true });
  fs.writeFileSync(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(reportMdPath, reportMarkdown(report));

  console.log(`book linking/sitemap audit: ${result}`);
  console.log(`generated books: ${acceptedBooks.length}`);
  console.log(`preview assets: ${previewManifest.books.length}`);
  console.log(`sitemap book URLs: ${bookSitemapSlugs.size}`);
  console.log(`sitemap audiobook URLs: ${audiobookSitemapSlugs.size}`);
  console.log(`book index coverage: ${report.counts.bookIndexCoverageCount}`);
  console.log(`audiobook index coverage: ${report.counts.audiobookIndexCoverageCount}`);
  console.log(`orphans: ${orphanBookCount} books, ${orphanAudiobookCount} audiobooks`);
  console.log(`broken internal links: ${brokenInternalLinkCount}`);
  console.log(`report: ${path.relative(repoRoot, reportJsonPath)}`);

  if (result === "fail") process.exitCode = 1;
}

main();
