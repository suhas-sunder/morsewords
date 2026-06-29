# Bespoke raw candidate pass 6

Generated: 2026-06-29  
Branch: `morsewords-bespoke-raw-candidate-pass-6-jun-2026`

## Merge checkpoint

Pass 5 was fast-forward merged to `main` at `1c32cf8f9f934cb122623dbe2b35a321b43f3af8`, validated, and pushed before this branch was created.

Merged-main validation passed at 514 generated books, 514 SEO summaries, 514 startup previews, 0 independent second-pass failures, 514 book URLs, 514 audiobook URLs, Netlify build pass, and Playwright book-page suite 39/39 pass.

## Starting counts

- Previous generated count: 514
- Previous SEO summary count: 514
- Previous startup preview count: 514
- Missing summaries: 0
- Unknown/unclassified raw files: 0

## Candidate category reviewed

- `unsafe-start-end-boundary-risk`

This pass focused on three clear-metadata candidates that had been deferred because their local files lack standard END markers:

- `Emma.txt`
- `Great Expectations.txt`
- `North and South.txt`

## Decisions

No pass-6 books were generated. All three primary candidates were deferred because the local raw files appear incomplete, not merely missing standard END markers.

### Emma

- Raw file: `app/client/assets/temp-books/Emma.txt`
- Expected slug: `emma`
- Title: `Emma`
- Author: Jane Austen
- Source: Project Gutenberg, eBook #158
- Source URL: `https://www.gutenberg.org/ebooks/158`
- Already generated under another slug: no
- Safe start boundary: available after the Project Gutenberg START marker and table of contents
- Safe end boundary: not available
- Decision: defer

Evidence: the local file has 7,105 lines and about 67,962 raw words. It contains body chapter headings into Volume II, Chapter VII, then ends mid-sentence. A complete public edition should include all three volumes and 55 body chapters, so this file is not complete enough to publish.

### Great Expectations

- Raw file: `app/client/assets/temp-books/Great Expectations.txt`
- Expected slug: `great-expectations`
- Title: `Great Expectations`
- Author: Charles Dickens
- Source: Project Gutenberg, eBook #1400
- Source URL: `https://www.gutenberg.org/ebooks/1400`
- Already generated under another slug: no
- Safe start boundary: available after the Project Gutenberg START marker and front matter
- Safe end boundary: not available
- Decision: defer

Evidence: the local file has 13,283 lines and about 119,084 raw words. It reaches Chapter XXXIX and ends mid-scene. A complete public edition should continue through Chapter LIX, so this file is not complete enough to publish.

### North and South

- Raw file: `app/client/assets/temp-books/North and South.txt`
- Expected slug: `north-and-south`
- Title: `North and South`
- Author: Elizabeth Cleghorn Gaskell
- Source: Project Gutenberg, eBook #4276
- Source URL: `https://www.gutenberg.org/ebooks/4276`
- Already generated under another slug: no
- Safe start boundary: available after the Project Gutenberg START marker
- Safe end boundary: not available
- Decision: defer

Evidence: the local file has 2,166 lines and about 20,580 raw words. It contains only Chapters I-VI and ends mid-paragraph. This file is not complete enough to publish.

## Generated result

- Accepted/generated candidates: none
- Collection/story splits performed: none
- Generated count after branch: 514
- SEO summary count after branch: 514
- Startup preview count after branch: 514
- Missing summary count: 0
- Preview size range for new/changed books: not applicable
- Section/content result for new books: not applicable; no new books were generated
- Metadata completeness result for new books: not applicable; no new books were generated

## Raw reconciliation after branch

- `unsafe-start-end-boundary-risk`: 19
- `unsafe-automation-structure`: 3
- `future-bespoke-required`: 4
- `duplicate-or-near-duplicate`: 3
- `blocked-source-or-rights-risk`: 3
- `unsafe-title-parent-collection-risk`: 1
- `unsafe-metadata-risk`: 1
- `unknown-unclassified`: 0

## Checkpoints

- Starter-preview first render: no pass-6 previews were added; existing coverage remains 514/514
- Cloudflare export: not run
- Book-section/content audit: not started; still belongs before Cloudflare export
- Metadata/source consistency audit: not started beyond pass-6 candidate metadata verification
- Post-export chapter/nav/view-window review: not started; still belongs after Cloudflare export
- Sources page trust-copy: not started
- About/E-E-A-T copy: not started
- Repeated-helper-copy/content-quality: not started
- URL/page/indexability: not started
- Broad mobile optimization: not started

## Route/UI checks

Accepted-addition checks are not applicable because no pass-6 books were generated. Retained route behavior will be covered by the normal validation suite.

The retained 514-book behavior passed the existing audit and browser regression coverage:

- `/morse-code-books` and `/morse-code-audiobooks` remain at 514 generated entries each
- Existing preview-backed book and audiobook routes still render without the full loading shell
- Existing request-count behavior remains covered
- Existing no-`0 sections` listing/page assertions remain covered
- Middlemarch, the Leavenworth Case, Sherlock/Wilde/Poe retained stories, normal preview-backed pages, desktop summary width, and mobile 390px behavior remain covered by the existing book-page regression suite

## Validation

- `npm run typecheck`: pass
- `npm run books:seo-summary-audit`: pass, 514/514 summaries
- `npm run books:batch-12-prose-restore`: pass, 20/20 raw/generated exact matches
- `npm run books:startup-preview-audit`: pass, 514 valid startup previews
- `npm run books:title-start-default-audit`: pass; known unrelated generated/preview churn restored before commit
- `npm run books:metadata-segmentation-audit`: pass, 514 audited and 0 accepted books revoked
- `npm run books:manual-ui-defect-followup`: pass, 8 checked and 8 acceptable
- `npm run books:independent-second-pass-audit`: pass, 0 fail-needs-fix
- `npm run books:linking-sitemap-audit`: pass, 514 book URLs and 514 audiobook URLs
- `npm run test --if-present`: pass, 23 smoke tests
- `npm run build:netlify`: pass, known chunk-size warning only
- `npx playwright test tests/qa-robustness-review/morse-book-page.spec.ts --project=desktop-chromium --reporter=line`: pass, 39/39
- `git diff --check`: pass; line-ending warnings only before unrelated validation churn was restored

## Recommended next major phase

`bespoke/manual raw candidate pass 7`

Rationale: the three pass-6 primary candidates need complete replacement source files or explicit user direction before generation. Several other non-generated raw files still remain, but they require a separate small manual pass rather than being forced through this branch.
