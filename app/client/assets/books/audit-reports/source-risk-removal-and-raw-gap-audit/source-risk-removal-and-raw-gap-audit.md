# Source-risk removal and raw gap audit

Generated on 2026-06-28 for `morsewords-source-risk-removal-and-raw-gap-audit-jun-2026`.

## Removal result

- Decision-checkpoint merge status: morsewords-book-source-decision-checkpoint-jun-2026 was merged to main before this branch; origin/main was confirmed up to date.
- Raw temp-books total count: 527
- Generated books: 497 -> 488
- SEO summaries: 497 -> 488
- Startup previews: 497 -> 488
- Missing summaries after removal: 0
- Missing previews after removal: 0
- Approved removals requested/found/removed: 9/9/9

Removed/deferred generated slugs:

- a-princess-of-mars
- doctor-dolittle
- heidi
- nights-with-uncle-remus
- peter-pan
- tarzan-of-the-apes
- the-thirty-nine-steps
- wood-folk-at-school
- jabberwocky

## Raw-to-generated reconciliation

- Raw files counted: 527
- Raw files mapped to live generated books: 482
- Raw files mapped to removed/deferred generated books: 0
- Raw files not generated or deferred: 45
- Raw total minus generated count gap: 39
- Live generated books without a direct current raw filename evidence match: 6
- Unknown/unclassified raw files: 0

The raw-minus-generated headline gap is 39. The per-raw-file table has 45 current raw files outside `generated-live`, offset by 6 accepted live generated books that are replacements, variants, or prior generated entries without a one-to-one current `temp-books` filename.

## Non-generated raw files by category

- duplicate-or-near-duplicate: 3
- unsafe-start-end-boundary-risk: 24
- unsafe-automation-structure: 8
- unsafe-metadata-risk: 1
- unsafe-title-parent-collection-risk: 2
- blocked-source-or-rights-risk: 3
- future-bespoke-required: 4

## Candidate handling

- Easy safe candidates found and processed: none.
- Easy safe candidates still remaining: none identified; remaining non-generated files have duplicate, source/rights, structure, boundary, metadata, title/parent, invalid-file, or bespoke/manual reasons.
- Manual/future-bespoke candidates: 4
- Duplicate/near-duplicate candidates: 3
- Blocked/source-rights candidates: 3
- Unsafe boundary/automation/metadata/title candidates: 35
- Non-book/invalid candidates: 0

## Route/UI checks

- Removed/deferred slugs absent from books listing: pass
- Removed/deferred slugs absent from audiobooks listing: pass
- Removed/deferred routes no longer render live generated books: pass; the full book-page Playwright suite asserts 404 for all 9 removed book and audiobook routes
- Valid preview-backed pages keep starter preview first-render behavior: pass
- Listing counts: 488 books and 488 audiobooks
- Mobile 390px horizontal overflow: pass via mobile readable preview test in full book-page Playwright suite

## Validation

- gitStatusBeforeBranchWork: clean on morsewords-source-risk-removal-and-raw-gap-audit-jun-2026
- typecheck: pass
- seoSummaryAudit: pass: 488/488 summaries
- batch12ProseRestore: pass: 20/20 exact matches; unrelated generated churn from title/start/default audit was restored before commit
- startupPreviewAudit: pass: 488 generated startup previews, 488 valid, 0 preview updates
- titleStartDefaultAudit: pass: 488 audited; known unrelated corrections were restored because they were not tied to approved removals
- metadataSegmentationAudit: pass: 488 audited, 0 author corrections, 1 unknown-author case remains documented
- manualUiDefectFollowup: pass: 8 checked, 8 acceptable
- independentSecondPassAudit: pass: 432 pass, 56 warn-accepted, 0 fail-needs-fix, 0 manual-review
- linkingSitemapAudit: pass: 488 book URLs, 488 audiobook URLs, 0 broken internal links
- testIfPresent: pass: 23/23 smoke tests
- buildNetlify: pass
- playwrightBookPage: pass: 39/39 desktop-chromium
- gitDiffCheck: pass; only Git line-ending warnings were printed

## Checkpoints

- Starter-preview policy: No new starter previews were generated; 9 approved preview assets were removed, and the remaining preview coverage is complete.
- Cloudflare export: Cloudflare export was not run and is not used as source of truth.
- URL/page/indexability: URL/page/indexability/planned non-book sitemap implementation remains a later final-release blocker.
- Mobile: Broad mobile optimization was not started and remains the final stage.

## Recommended next major phase

Second bespoke/manual pass over the remaining raw/manual/deferred candidates, in small reviewable batches.
