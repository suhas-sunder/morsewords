# Sitemap Count And Print Indexability Reconciliation

## 1. Executive result

Sitemap count and print-page indexability reconciliation passed

## 2. GSC-reported submitted count

1650 submitted URLs.

## 3. Local sitemap count

Current local XML sitemap URLs: 1182.

Prior local audit count before this reconciliation: 1708.

## 4. URL category breakdown

Current: 130 non-book, 526 book, 526 audiobook, 0 print.

Prior: 130 non-book, 526 book, 526 audiobook, 526 print.

## 5. Non-book URL explanation

130 canonical non-book routes remain in the sitemap. No noindex support route is included.

## 6. Book/audiobook URL explanation

526 book detail URLs and 526 audiobook detail URLs match the 526 accepted, publish-ready books.

## 7. Print URL indexability decision

Print pages are noindex,follow and self-canonical. They stay crawlable and functional but are omitted from XML and HTML sitemap inventory.

## 8. Print page canonical result

pass

## 9. Print page robots result

pass

## 10. Print page distinct printable value result

pass

## 11. Redirect/noindex/duplicate/malformed URL result

Noindex/support URLs in sitemap: 0.

Redirect-only URLs in sitemap: 0.

Duplicate URL count: 0.

Malformed URL count: 0.

## 12. GSC vs local count explanation

The owner-reported GSC count is 1650. The prior local sitemap count was 1708, exactly 130 non-book + 526 book + 526 audiobook + 526 print. This change reduces the local sitemap to 1182, exactly 130 non-book + 526 book + 526 audiobook + 0 print. The XML has no noindex, redirect-only, duplicate, malformed, or host-mismatched URL. GSC will reflect the smaller submitted footprint only after the updated sitemap is deployed and recrawled.

## 13. Fixes made

- Set valid published print routes to noindex,follow while retaining their self-canonical and printable UI.
- Removed generated print URLs from the XML sitemap source and regenerated public/sitemap.xml.
- Removed the comprehensive print-route group from the HTML sitemap.
- Updated release-count validation for zero print URLs in sitemap inventory.

## 14. Remaining blockers

None.

## 15. Protected folder status

- temp-books: clean
- generated books: clean
- public/book-previews: clean
- cloudflare-export: ignored/untracked
- cloudflare-updated-export: ignored/untracked
- cloudflare-export tracked files: 0
- cloudflare-updated-export tracked files: 0

## 16. Recommended next step

Review the uncommitted indexing-footprint recovery diff before any commit or deployment.
