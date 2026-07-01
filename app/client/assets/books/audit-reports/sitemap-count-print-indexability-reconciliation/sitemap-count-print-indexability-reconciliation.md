# Sitemap Count And Print Indexability Reconciliation

## 1. Executive result

Sitemap count and print-page indexability reconciliation passed

## 2. GSC-reported submitted count

1650 submitted URLs.

## 3. Local sitemap count

Current local XML sitemap URLs: 1682.

Prior local audit count before this reconciliation: 1651.

## 4. URL category breakdown

Current: 125 non-book, 519 book, 519 audiobook, 519 print.

Prior: 125 non-book, 519 book, 519 audiobook, 488 print.

## 5. Non-book URL explanation

125 canonical non-book routes remain in the sitemap. No noindex support route is included.

## 6. Book/audiobook URL explanation

519 book detail URLs and 519 audiobook detail URLs match the 519 accepted, publish-ready books.

## 7. Print URL indexability decision

Print pages stay in the XML sitemap. They are self-canonical, indexable for accepted books, and provide distinct printable value.

## 8. Print page canonical result

pass

## 9. Print page distinct printable value result

pass

## 10. Redirect/noindex/duplicate/malformed URL result

Noindex/support URLs in sitemap: 0.

Redirect-only URLs in sitemap: 0.

Duplicate URL count: 0.

Malformed URL count: 0.

## 11. Exact 1,650 vs local count explanation

The owner-reported GSC count is 1650. The prior local sitemap count was 1651, exactly 125 non-book + 519 book + 519 audiobook + 488 print. That prior local state had no duplicate or malformed URLs, but it was missing 31 print URLs for accepted publish-ready books. This branch corrected the local sitemap to 1682, exactly 125 non-book + 519 book + 519 audiobook + 519 print. Because the local XML has no noindex, redirect-only, duplicate, malformed, or host-mismatched URL, the exact one-URL GSC delta is not identifiable from the local repository alone. GSC count stale or based on a different submitted sitemap snapshot; the local sitemap has no duplicate, malformed, noindex, or redirect-only URL that explains a one-URL drop.

## 12. Fixes made

- Rewrote public/sitemap.xml from the accepted generated-book manifest using books:sitemap-sync.
- Normalized generated sitemap URL lines that had adjacent <url> entries on one line.
- Added the missing print URLs for accepted publish-ready books, moving print coverage from 488 to 519.
- Updated local final-validation expected sitemap and print counts for the corrected sitemap.

## 13. Remaining blockers

None.

## 14. Protected folder status

- temp-books: clean
- generated books: clean
- public/book-previews: clean
- cloudflare-export: ignored/untracked
- cloudflare-updated-export: ignored/untracked
- cloudflare-export tracked files: 0
- cloudflare-updated-export tracked files: 0

## 15. Recommended next step

Proceed to `morsewords-adsense-contact-readiness-jun-2026` after this branch is reviewed and merged.
