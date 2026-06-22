# Book Sitemap, Navigation, and Internal-Linking Audit

Generated: 2026-06-22T02:46:31.197Z

## Executive summary

The generated library manifest is the discoverability source of truth. All 465 accepted generated books and 465 previews are represented in the book and audiobook directories and in the static XML sitemap.

Audit result: **pass**

## Coverage

- Generated books: 465
- Preview assets: 465
- Pilot SEO summaries: 20
- Sitemap book URLs: 465
- Sitemap audiobook URLs: 465
- Sitemap print URLs: 465
- Book index coverage: 465
- Audiobook index coverage: 465
- Orphan books: 0
- Orphan audiobooks: 0
- Missing sitemap URLs: 0
- Broken internal links: 0
- Duplicate sitemap URLs: 0
- Unsafe sitemap URLs: 0

## Navigation and internal linking

Both index routes expose a searchable paginated browser plus a visible complete A-Z directory containing all 465 canonical slugs. Audiobook cards point to audiobook routes. The More navigation links clearly to both library indexes while preserving its established public-book shortcuts.

Exact normalized author metadata matches only. Links are sorted by title and slug, exclude the current book, deduplicate by slug, and are capped at four visible links per page. Single-work authors show no related block.

## Canonical and summary behavior

Book and audiobook detail routes build canonicals from the generated canonical slug. Pilot descriptions are used when present; all other books keep deterministic non-empty route fallbacks.

The 20 pilot summaries enrich matching descriptions only. The other 445 accepted generated books remain fully present in directories and sitemap coverage.

## Unresolved-source generated books

All 11 documented unresolved-source generated books remain included as accepted book and audiobook pages. Raw unresolved candidates, duplicates, and boundary-defect files are not imported into discovery data.

## Validation

| Check | Result |
| --- | --- |
| generatedBookCount | pass |
| previewCount | pass |
| sitemapBookCoverage | pass |
| sitemapAudiobookCoverage | pass |
| bookIndexCoverage | pass |
| audiobookIndexCoverage | pass |
| detailRouteCoverage | pass |
| htmlSitemapCoverage | pass |
| navigationIndexes | pass |
| matchingAndIndexLinks | pass |
| relatedAuthorLinks | pass |
| canonicalMetaFallback | pass |
| pilotSummaryInteraction | pass |
| unresolvedSourceGeneratedBooks | pass |
| duplicateAndUnsafeUrls | pass |
| robotsAndRoutes | pass |

## Files changed

- app/client/data/morseBooks.ts
- app/client/components/morse-code-books/MorseBookLinkDirectory.tsx
- app/client/components/morse-code-books/MorseBookPagination.tsx
- app/client/components/morse-code-books/MorseBookPage.tsx
- app/routes/morse-code-books.tsx
- app/routes/morse-code-audiobooks.tsx
- app/routes/morse-code-books.$slug.tsx
- app/routes/morse-code-audiobooks.$slug.tsx
- app/routes/sitemap.tsx
- public/sitemap.xml
- scripts/books/sync-book-sitemap.ts
- scripts/books/book-sitemap-nav-internal-linking-audit.ts
- tests/qa-robustness-review/morse-book-page.spec.ts
- package.json
- app/client/assets/books/audit-reports/book-sitemap-nav-internal-linking/book-sitemap-nav-internal-linking.json
- app/client/assets/books/audit-reports/book-sitemap-nav-internal-linking/book-sitemap-nav-internal-linking.md

## Remaining non-blocking recommendations

- Keep running books:sitemap-sync whenever the accepted generated manifest changes.
- Keep source-resolution debt tracked separately; it does not block discoverability for the 11 accepted generated books.
- Run the later GSC and broad SEO/meta review only after controlled summary scaling is complete.
