# Pilot Book Quality Dry Run 6

Generated: 2026-06-17T18:04:58.868Z

This is a dry-run/report-only pass. It inventories remaining generated-but-unaccepted books first, then audits selected raw-only sources for first-time controlled processing because no remaining generated candidate has a resolvable raw source. It does not write generated books, preview assets, raw source books, or Cloudflare exports.

Batch 6 first inventoried remaining generated-but-unaccepted books, then selected raw-only candidates because every remaining generated candidate lacked a clear raw source match.

## Inputs

- `app/client/assets/books/audit-reports/book-processing-audit-pass-1.json`
- `app/client/assets/books/audit-reports/book-processing-audit-pass-2.json`
- `app/client/assets/books/audit-reports/book-structure-audit-1/book-structure-audit-1.json`
- `app/client/assets/books/audit-reports/book-startup-preview-audit-1/book-startup-preview-audit-1.json`
- `app/client/assets/books/audit-reports/pilot-write-5-verification/pilot-write-5-verification.json`

## Selected Books

- a-midsummer-night-s-dream
- a-room-with-a-view
- agamemnon-of-aeschylus
- an-ideal-husband
- catriona
- for-the-duration-of-the-war
- romeo-and-juliet
- spoon-river-anthology
- the-adventures-of-ferdinand-count-fathom
- the-adventures-of-roderick-random
- the-expedition-of-humphry-clinker
- the-importance-of-being-earnest-a-trivial-comedy-for-serious-people
- the-man-who-was-thursday-a-nightmare
- the-money-box
- the-mystery-of-edwin-drood
- the-shunned-house
- the-story-of-the-inexperienced-ghost
- the-winning-of-olwen
- twenty-thousand-leagues-under-the-sea
- with-fire-and-sword

## Generated-But-Unaccepted Candidates Found

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

## Unresolved-Source Generated Books

- a-princess-of-mars: A princess of Mars; 30 generated sections; startup preview valid; No matching source file was resolved from pass reports, structure audit, processing notes, slug filename, or title filename.
- doctor-dolittle: The Story of Doctor Dolittle; 6 generated sections; startup preview valid; No matching source file was resolved from pass reports, structure audit, processing notes, slug filename, or title filename.
- heidi: Heidi; 11 generated sections; startup preview valid; No matching source file was resolved from pass reports, structure audit, processing notes, slug filename, or title filename.
- jabberwocky: Jabberwocky; 2 generated sections; startup preview valid; No matching source file was resolved from pass reports, structure audit, processing notes, slug filename, or title filename.
- nights-with-uncle-remus: Nights With Uncle Remus; 21 generated sections; startup preview valid; No matching source file was resolved from pass reports, structure audit, processing notes, slug filename, or title filename.
- peter-pan: Peter Pan [Peter and Wendy]; 20 generated sections; startup preview valid; No matching source file was resolved from pass reports, structure audit, processing notes, slug filename, or title filename.
- tarzan-of-the-apes: Tarzan of the Apes; 30 generated sections; startup preview valid; No matching source file was resolved from pass reports, structure audit, processing notes, slug filename, or title filename.
- the-great-gatsby: The Great Gatsby; 11 generated sections; startup preview valid; No matching source file was resolved from pass reports, structure audit, processing notes, slug filename, or title filename.
- the-picture-of-dorian-gray: The Picture of Dorian Gray; 23 generated sections; startup preview valid; No matching source file was resolved from pass reports, structure audit, processing notes, slug filename, or title filename.
- the-thirty-nine-steps: The Thirty-Nine Steps; 12 generated sections; startup preview valid; No matching source file was resolved from pass reports, structure audit, processing notes, slug filename, or title filename.
- wood-folk-at-school: Wood folk at school; 10 generated sections; startup preview valid; No matching source file was resolved from pass reports, structure audit, processing notes, slug filename, or title filename.

## Totals

- Selected books: 20
- Already acceptable: 0
- Needs correction before acceptance: 0
- Needs first-time controlled processing: 20
- Manual review: 0
- Blocked: 0

## Recommendation Table

| Slug | Candidate type | Status | Next pass | Structure | Current sections | Proposed sections | Start boundary | Cleanup |
| --- | --- | --- | --- | --- | ---: | ---: | --- | --- |
| a-midsummer-night-s-dream | raw-only | needs first-time controlled processing | controlled first-time processing | play acts | 0 | 5 | ready for first-time processing: high-confidence readable start | first-time processing must exclude TOC/source/license/transcriber, image placeholder, footnote, and decorative cleanup artifacts |
| a-room-with-a-view | raw-only | needs first-time controlled processing | controlled first-time processing | chapter-based roman numerals with part divisions | 0 | 21 | ready for first-time processing: high-confidence readable start | first-time processing must exclude TOC/source/license/transcriber, image placeholder, footnote, and decorative cleanup artifacts |
| agamemnon-of-aeschylus | raw-only | needs first-time controlled processing | controlled first-time processing | story or titled-section headings | 0 | 229 | ready for first-time processing: high-confidence readable start | first-time processing must exclude TOC/source/license/transcriber, image placeholder, footnote, and decorative cleanup artifacts |
| an-ideal-husband | raw-only | needs first-time controlled processing | controlled first-time processing | isolated titled sections | 0 | 198 | ready for first-time processing: high-confidence readable start | first-time processing must exclude TOC/source/license/transcriber, image placeholder, footnote, and decorative cleanup artifacts |
| catriona | raw-only | needs first-time controlled processing | controlled first-time processing | chapter-based roman numerals with part divisions | 0 | 30 | ready for first-time processing: high-confidence readable start | first-time processing must exclude TOC/source/license/transcriber, image placeholder, footnote, and decorative cleanup artifacts |
| for-the-duration-of-the-war | raw-only | needs first-time controlled processing | controlled first-time processing | isolated titled sections | 0 | 8 | ready for first-time processing: high-confidence readable start | first-time processing must exclude TOC/source/license/transcriber, image placeholder, footnote, and decorative cleanup artifacts |
| romeo-and-juliet | raw-only | needs first-time controlled processing | controlled first-time processing | play acts | 0 | 5 | ready for first-time processing: high-confidence readable start | first-time processing must exclude TOC/source/license/transcriber, image placeholder, footnote, and decorative cleanup artifacts |
| spoon-river-anthology | raw-only | needs first-time controlled processing | controlled first-time processing | isolated titled sections | 0 | 329 | ready for first-time processing: high-confidence readable start | first-time processing must exclude TOC/source/license/transcriber, image placeholder, footnote, and decorative cleanup artifacts |
| the-adventures-of-ferdinand-count-fathom | raw-only | needs first-time controlled processing | controlled first-time processing | story or titled-section headings | 0 | 163 | ready for first-time processing: high-confidence readable start | first-time processing must exclude TOC/source/license/transcriber, image placeholder, footnote, and decorative cleanup artifacts |
| the-adventures-of-roderick-random | raw-only | needs first-time controlled processing | controlled first-time processing | chapter-based roman numerals | 0 | 69 | ready for first-time processing: high-confidence readable start | first-time processing must exclude TOC/source/license/transcriber, image placeholder, footnote, and decorative cleanup artifacts |
| the-expedition-of-humphry-clinker | raw-only | needs first-time controlled processing | controlled first-time processing | story or titled-section headings | 0 | 77 | ready for first-time processing: high-confidence readable start | first-time processing must exclude TOC/source/license/transcriber, image placeholder, footnote, and decorative cleanup artifacts |
| the-importance-of-being-earnest-a-trivial-comedy-for-serious-people | raw-only | needs first-time controlled processing | controlled first-time processing | story or titled-section headings | 0 | 854 | ready for first-time processing: high-confidence readable start | first-time processing must exclude TOC/source/license/transcriber, image placeholder, footnote, and decorative cleanup artifacts |
| the-man-who-was-thursday-a-nightmare | raw-only | needs first-time controlled processing | controlled first-time processing | chapter-based roman numerals | 0 | 15 | ready for first-time processing: high-confidence readable start | first-time processing must exclude TOC/source/license/transcriber, image placeholder, footnote, and decorative cleanup artifacts |
| the-money-box | raw-only | needs first-time controlled processing | controlled first-time processing | story or titled-section headings | 0 | 4 | ready for first-time processing: medium-confidence readable start | first-time processing must exclude TOC/source/license/transcriber, image placeholder, footnote, and decorative cleanup artifacts |
| the-mystery-of-edwin-drood | raw-only | needs first-time controlled processing | controlled first-time processing | chapter-based roman numerals | 0 | 23 | ready for first-time processing: high-confidence readable start | first-time processing must exclude TOC/source/license/transcriber, image placeholder, footnote, and decorative cleanup artifacts |
| the-shunned-house | raw-only | needs first-time controlled processing | controlled first-time processing | standalone arabic-numbered sections | 0 | 9 | ready for first-time processing: high-confidence readable start | first-time processing must exclude TOC/source/license/transcriber, image placeholder, footnote, and decorative cleanup artifacts |
| the-story-of-the-inexperienced-ghost | raw-only | needs first-time controlled processing | controlled first-time processing | isolated titled sections | 0 | 5 | ready for first-time processing: medium-confidence readable start | first-time processing must exclude TOC/source/license/transcriber, image placeholder, footnote, and decorative cleanup artifacts |
| the-winning-of-olwen | raw-only | needs first-time controlled processing | controlled first-time processing | isolated titled sections | 0 | 3 | ready for first-time processing: medium-confidence readable start | first-time processing must exclude TOC/source/license/transcriber, image placeholder, footnote, and decorative cleanup artifacts |
| twenty-thousand-leagues-under-the-sea | raw-only | needs first-time controlled processing | controlled first-time processing | chapter-based roman numerals with part divisions | 0 | 46 | ready for first-time processing: high-confidence readable start | first-time processing must exclude TOC/source/license/transcriber, image placeholder, footnote, and decorative cleanup artifacts |
| with-fire-and-sword | raw-only | needs first-time controlled processing | controlled first-time processing | chapter-based roman numerals | 0 | 63 | ready for first-time processing: high-confidence readable start | first-time processing must exclude TOC/source/license/transcriber, image placeholder, footnote, and decorative cleanup artifacts |

## Already Acceptable

- None.

## Needs Correction Before Acceptance

- None.

## Needs First-Time Controlled Processing

- a-midsummer-night-s-dream
- a-room-with-a-view
- agamemnon-of-aeschylus
- an-ideal-husband
- catriona
- for-the-duration-of-the-war
- romeo-and-juliet
- spoon-river-anthology
- the-adventures-of-ferdinand-count-fathom
- the-adventures-of-roderick-random
- the-expedition-of-humphry-clinker
- the-importance-of-being-earnest-a-trivial-comedy-for-serious-people
- the-man-who-was-thursday-a-nightmare
- the-money-box
- the-mystery-of-edwin-drood
- the-shunned-house
- the-story-of-the-inexperienced-ghost
- the-winning-of-olwen
- twenty-thousand-leagues-under-the-sea
- with-fire-and-sword

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

## Later-Phase Requirements

- After all books are processed, run an independent second-pass audit using a different strategy.
- After books and the second-pass audit, add original non-spoiler 300-500+ word SEO summaries for each accepted book page.
- After summaries, perform full site SEO/meta review using GSC data and route-level intent.
- Final cleanup should remove temporary audit scripts/reports and code bloat only after everything is stable.

## Protected Folder Confirmation

- `app/client/assets/temp-books` was read but not modified.
- `app/client/assets/books/generated` was read for comparison but not modified.
- `app/client/assets/books/cloudflare-export` was read for path checks but not modified.
- `public/book-previews` was read for validation but not modified.
