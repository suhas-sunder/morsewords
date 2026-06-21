# Second-Pass Defect Fixes

Generated: 2026-06-21T15:26:55.9110827-04:00

## Executive summary

Fixed the one blocking independent second-pass audit defect for `dr-jekyll-and-mr-hyde`. No SEO summary work, book ingestion, raw source edits, or Cloudflare export changes were started.

## Defect

- Defect ID: `second-pass-dr-jekyll-preview-default-section-mismatch`
- Slug: `dr-jekyll-and-mr-hyde`
- Audit finding: preview manifest `defaultSectionId` was `part-001`, while the preview asset used `part-002`.

## Files inspected

- `public/book-previews/manifest.json`
- `public/book-previews/dr-jekyll-and-mr-hyde.preview.json`
- `app/client/assets/books/generated/dr-jekyll-and-mr-hyde/manifest.json`
- `app/client/assets/books/generated/dr-jekyll-and-mr-hyde/sections/part-001.json`
- `app/client/assets/books/generated/dr-jekyll-and-mr-hyde/sections/part-002.json`
- `app/client/assets/books/audit-reports/book-startup-preview-audit-1/book-startup-preview-audit-1.json`
- `app/client/assets/books/audit-reports/title-start-default-content-audit-1/title-start-default-content-audit-1.json`
- `app/client/assets/books/audit-reports/independent-second-pass-book-audit/independent-second-pass-book-audit.json`

## Root cause

The preview asset had already been generated from `part-002`, which starts with real readable story content. The preview manifest entry still carried stale metadata from `part-001`.

`part-001` starts with title/byline/contents material before the story body, so it is not the startup-safe preview/default section.

## Chosen fix

Updated only the `dr-jekyll-and-mr-hyde` entry in `public/book-previews/manifest.json` so the manifest agrees with the existing preview asset.

Before:

- Preview manifest `defaultSectionId`: `part-001`
- Preview asset `defaultSectionId`: `part-002`
- Preview manifest bytes/runtime fields: `11637`, `10552`, `3800`

After:

- Preview manifest `defaultSectionId`: `part-002`
- Preview asset `defaultSectionId`: `part-002`
- Preview manifest bytes/runtime fields: `11719`, `10574`, `3807`

## Why `part-002` is correct

- `part-002` exists in generated output.
- The preview asset starts from `part-002`.
- The startup preview audit reports `part-002` as the first default generated section and marks the preview valid.
- The section starts with readable story content: "A fortnight later..."
- There is no `SOS Help!`, generic fallback, source/header/license, TOC, or byline leakage in the preview start.

## Validation

Final validation results:

- Generated books: 465
- Preview assets: 465
- Pass: 399
- Warn-accepted: 66
- Fail-needs-fix: 0
- Manual-review: 0
- `npm run typecheck`: pass
- `npm run books:batch-12-prose-restore`: 20/20 pass
- `npm run books:startup-preview-audit`: 465 valid, 0 preview updates
- `npm run books:title-start-default-audit`: pass; known unrelated 12-book churn restored
- `npm run books:metadata-segmentation-audit`: pass; 1 unknown-author case remains documented
- `npm run books:manual-ui-defect-followup`: 8 acceptable, 0 manual review
- `npm run books:independent-second-pass-audit`: 0 fail-needs-fix
- Targeted Playwright book-page suite: 35 passed, 1 known/pre-existing fullscreen-controls visibility assertion failure
- `npm run test --if-present`: 23 passed
- `git diff --check`: pass

## Scope confirmation

- Other audit warnings touched: no
- Raw sources modified: no
- Cloudflare exports modified: no
- Unrelated generated books modified: no
- Unrelated previews modified: no
