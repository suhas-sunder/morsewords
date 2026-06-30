# Planned Non-Book Sitemap Pages

Created: 2026-06-30  
Branch: `morsewords-planned-non-book-sitemap-pages-jun-2026`

## 1. Executive Result

Planned non-book sitemap page pass complete.

The current XML sitemap contains 125 non-book URLs. All 125 already resolve to
implemented route modules with metadata, canonical link handling, and no
placeholder or coming-soon markers. No new public non-book pages were needed in
this pass.

## 2. Source Inputs Inspected

- `public/sitemap.xml`
- `app/routes.ts`
- `app/client/data/routes.ts`
- `app/routes/sitemap.tsx`
- `app/routes`
- `scripts/books/book-sitemap-nav-internal-linking-audit.ts`
- `tests/qa-robustness-review/route-registry.spec.ts`
- `tests/qa-robustness-review/final-seo-schema-sitemap-audit.spec.ts`

## 3. Planned Non-Book URL Inventory

- Total XML sitemap URLs: 1,651
- Planned non-book XML sitemap URLs: 125
- Implemented planned non-book URLs: 125
- Missing planned non-book routes: 0
- Redirect aliases in XML sitemap: 0
- Placeholder or coming-soon routes: 0
- Missing metadata routes: 0
- Missing canonical routes: 0

Inventory by group:

- Core tools: 13
- Letter reference pages: 26
- Number reference pages: 10
- Phrase and symbol reference pages: 34
- Language reference pages: 4
- Site information pages: 6
- Book index and translator pages: 4
- Learning and reference pages: 28

## 4. Implemented Pages

No new pages were implemented. The audit found no current non-book XML sitemap
URL returning 404 or lacking a route.

## 5. Deferred Pages And Reasons

These existing support routes remain outside the XML sitemap intentionally:

- `/misc`: noindex support hub, not an indexable search landing page.
- `/misc/privacy-policy`: noindex legacy/support duplicate; canonical public page is `/privacy`.
- `/misc/terms-of-service`: noindex legacy/support duplicate; canonical public page is `/terms`.
- `/misc/cookies-policy`: noindex legacy/support duplicate; canonical public page is `/cookies`.
- `/misc/socials`: noindex support links page.
- `/sitemap`: HTML sitemap is intentionally `noindex,follow`.

## 6. Pages Not Changed And Reasons

The 125 non-book XML sitemap URLs were not changed because each already has a
route, metadata, canonical handling, and no obvious placeholder marker.

The 519-book subsystem was not changed. Generated payloads, SEO summaries,
startup previews, and Cloudflare export tracking stayed protected.

## 7. Sitemap/Linking Result

Pass.

- Book URLs: 519
- Audiobook URLs: 519
- Printable book URLs in XML sitemap: 488

Printable book URLs are tracked separately from the protected 519 book and 519
audiobook URL counts.

## 8. Metadata/Canonical Result

Pass. All 125 planned non-book XML sitemap routes have detected route metadata
and canonical link handling.

## 9. Placeholder/Thin-Content Scan Result

Pass. The audit found no route files for planned non-book XML sitemap URLs with
`coming soon`, `under construction`, `not implemented`, `lorem ipsum`, or
`placeholder-only` markers.

## 10. Route/UI Check Result

No new page UI was required because no missing non-book sitemap pages were found.
Existing route smoke, SEO/schema, and validation coverage remain the route/UI
backstop for unchanged pages.

## 11. Book Subsystem Regression Check

- Generated books: 519
- SEO summaries: 519/519
- Startup previews: 519
- Book URLs: 519
- Audiobook URLs: 519
- Cloudflare export: ignored and untracked

## 12. Remaining Planned Non-Book Page Work

None from the current XML sitemap inventory.

## 13. Later Content-Quality Checkpoints

Preserved for later, not started here:

- Sources page trust-copy update
- About page E-E-A-T sentence
- Repeated helper-copy reduction

## 14. Deferred Final Stages

Preserved for later, not started here:

- Full URL/indexability/canonical audit
- GSC/meta review
- Mobile optimization

Recommended next branch: `morsewords-full-url-indexability-canonical-audit-jun-2026`.
