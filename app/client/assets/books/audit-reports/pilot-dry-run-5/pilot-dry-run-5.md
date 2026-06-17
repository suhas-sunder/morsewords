# Pilot Book Quality Dry Run 5

Generated: 2026-06-17T05:56:22.876Z

This is a dry-run/report-only pass for generated books that have valid startup previews but have not been deeply accepted through the stricter pilot process. It does not write generated books, preview assets, raw source books, or Cloudflare exports.

## Inputs

- `app/client/assets/books/audit-reports/book-processing-audit-pass-1.json`
- `app/client/assets/books/audit-reports/book-processing-audit-pass-2.json`
- `app/client/assets/books/audit-reports/book-structure-audit-1/book-structure-audit-1.json`
- `app/client/assets/books/audit-reports/book-startup-preview-audit-1/book-startup-preview-audit-1.json`
- `app/client/assets/books/audit-reports/pilot-write-4-verification/pilot-write-4-verification.json`

## Selected Books

- anna-karenina
- anne-of-green-gables-gutenberg-45
- candide
- crime-and-punishment
- gulliver-s-travels
- the-bell
- the-call-of-cthulhu
- the-elderbush
- the-emerald-city-of-oz
- the-emperor-s-new-clothes
- the-fir-tree
- the-leap-frog
- the-old-house
- the-real-princess
- the-secret-garden-gutenberg-113
- the-shoes-of-fortune
- the-snow-queen
- the-swineherd
- treasure-island
- wind-in-the-willows

## Unselected Generated Candidates Without Resolved Raw Source

- a-princess-of-mars
- doctor-dolittle
- heidi
- jabberwocky
- nights-with-uncle-remus
- peter-pan
- tarzan-of-the-apes
- the-great-gatsby
- the-picture-of-dorian-gray
- the-thirty-nine-steps
- wood-folk-at-school

## Totals

- Selected books: 20
- Already acceptable: 11
- Needs correction before acceptance: 9
- Manual review: 0
- Blocked: 0

## Recommendation Table

| Slug | Status | Next pass | Structure | Current sections | Proposed sections | Start boundary | Cleanup |
| --- | --- | --- | --- | ---: | ---: | --- | --- |
| anna-karenina | already acceptable | accept as already valid | chapter-based arabic numbers with part divisions | 241 | - | correct: first default aligns with pass-2 readable start | acceptable: no cleanup artifacts detected in readable/default sections |
| anne-of-green-gables-gutenberg-45 | already acceptable | accept as already valid | chapter-based roman numerals | 39 | - | correct: first default aligns with pass-2 readable start | acceptable: no cleanup artifacts detected in readable/default sections |
| candide | needs correction before acceptance | controlled rewrite/correction | standalone roman numeral sections | 8 | 30 | review: first default is readable, but it does not tightly match pass-2 start snippet | needs correction: suspicious source/catalog material remains outside defaults |
| crime-and-punishment | needs correction before acceptance | controlled rewrite/correction | chapter-based roman numerals with part divisions | 47 | 39 | review: first default is readable, but it does not tightly match pass-2 start snippet | acceptable: no cleanup artifacts detected in readable/default sections |
| gulliver-s-travels | needs correction before acceptance | controlled rewrite/correction | chapter-based roman numerals with part divisions | 49 | 39 | review: first default is readable, but it does not tightly match pass-2 start snippet | acceptable: no cleanup artifacts detected in readable/default sections |
| the-bell | already acceptable | accept as already valid | story or titled-section headings | 2 | - | correct: first default aligns with pass-2 readable start | acceptable: no cleanup artifacts detected in readable/default sections |
| the-call-of-cthulhu | needs correction before acceptance | controlled rewrite/correction | isolated titled sections | 4 | 16 | review: first default is readable, but it does not tightly match pass-2 start snippet | needs correction: suspicious source/catalog material remains outside defaults |
| the-elderbush | already acceptable | accept as already valid | isolated titled sections | 2 | - | correct: first default aligns with pass-2 readable start | acceptable: no cleanup artifacts detected in readable/default sections |
| the-emerald-city-of-oz | needs correction before acceptance | controlled rewrite/correction | arabic-numbered titled sections | 11 | 30 | review: first default is readable, but it does not tightly match pass-2 start snippet | acceptable: no cleanup artifacts detected in readable/default sections |
| the-emperor-s-new-clothes | already acceptable | accept as already valid | story or titled-section headings | 2 | - | correct: first default aligns with pass-2 readable start | acceptable: no cleanup artifacts detected in readable/default sections |
| the-fir-tree | already acceptable | accept as already valid | story or titled-section headings | 2 | - | correct: first default aligns with pass-2 readable start | acceptable: no cleanup artifacts detected in readable/default sections |
| the-leap-frog | already acceptable | accept as already valid | story or titled-section headings | 2 | - | correct: first default aligns with pass-2 readable start | acceptable: no cleanup artifacts detected in readable/default sections |
| the-old-house | needs correction before acceptance | controlled rewrite/correction | story or titled-section headings | 5 | 10 | correct: first default aligns with pass-2 readable start | acceptable: no cleanup artifacts detected in readable/default sections |
| the-real-princess | already acceptable | accept as already valid | story or titled-section headings | 2 | - | correct: first default aligns with pass-2 readable start | acceptable: no cleanup artifacts detected in readable/default sections |
| the-secret-garden-gutenberg-113 | already acceptable | accept as already valid | chapter-based roman numerals | 30 | - | correct: first default aligns with pass-2 readable start | acceptable: no cleanup artifacts detected in readable/default sections |
| the-shoes-of-fortune | already acceptable | accept as already valid | roman-numbered titled sections | 4 | - | correct: first default aligns with pass-2 readable start | acceptable: no cleanup artifacts detected in readable/default sections |
| the-snow-queen | needs correction before acceptance | controlled rewrite/correction | story or titled-section headings | 4 | 18 | review: first default is readable, but it does not tightly match pass-2 start snippet | acceptable: no cleanup artifacts detected in readable/default sections |
| the-swineherd | needs correction before acceptance | controlled rewrite/correction | isolated titled sections | 2 | 8 | correct: first default aligns with pass-2 readable start | acceptable: no cleanup artifacts detected in readable/default sections |
| treasure-island | needs correction before acceptance | controlled rewrite/correction | standalone roman numeral sections with part divisions | 14 | 34 | review: first default is readable, but it does not tightly match pass-2 start snippet | acceptable: no cleanup artifacts detected in readable/default sections |
| wind-in-the-willows | already acceptable | accept as already valid | standalone roman numeral sections | 14 | - | correct: first default aligns with pass-2 readable start | acceptable: no cleanup artifacts detected in readable/default sections |

## Already Acceptable

- anna-karenina
- anne-of-green-gables-gutenberg-45
- the-bell
- the-elderbush
- the-emperor-s-new-clothes
- the-fir-tree
- the-leap-frog
- the-real-princess
- the-secret-garden-gutenberg-113
- the-shoes-of-fortune
- wind-in-the-willows

## Needs Correction Before Acceptance

- candide
- crime-and-punishment
- gulliver-s-travels
- the-call-of-cthulhu
- the-emerald-city-of-oz
- the-old-house
- the-snow-queen
- the-swineherd
- treasure-island

## Manual Review

- None.

## Blocked

- None.

## Future Batch Rule

- Every future processed book must include valid generated readable content.
- The first default section must come from real readable content.
- All main readable sections must be included by default.
- Each book must have a valid book-specific startup preview.
- Startup previews must not contain `SOS Help!`.
- Startup previews must not use a generic preview fallback.
- Default playback must not begin with title, TOC, source, license, contributor, or transcriber material.

## Protected Folder Confirmation

- `app/client/assets/temp-books` was read but not modified.
- `app/client/assets/books/generated` was read for comparison but not modified.
- `app/client/assets/books/cloudflare-export` was read for path checks but not modified.
- `public/book-previews` was read for validation but not modified.
