# Pilot Book Processing Dry Run 8

Generated: 2026-06-18T19:18:32.398Z

This is a dry-run/report-only pass. It does not write generated books, create preview assets, modify raw sources, modify Cloudflare exports, or run all-book processing.

## Inputs

- `app/client/assets/books/audit-reports/book-processing-audit-pass-1.json`
- `app/client/assets/books/audit-reports/book-processing-audit-pass-2.json`
- `app/client/assets/books/audit-reports/book-structure-audit-1/book-structure-audit-1.json`
- `app/client/assets/books/audit-reports/book-startup-preview-audit-1/book-startup-preview-audit-1.json`
- `app/client/assets/books/audit-reports/title-start-default-content-audit-1/title-start-default-content-audit-1.json`
- `app/client/assets/books/audit-reports/metadata-segmentation-correctness-audit-1/metadata-segmentation-correctness-audit-1.json`
- `app/client/assets/books/audit-reports/manual-ui-defect-followup-1/manual-ui-defect-followup-1.json`
- `app/client/assets/books/audit-reports/pilot-write-7-verification/pilot-write-7-verification.json`
- `scripts/books/lib/book-structure-detection.ts`

## Selected Books

- the-wind-in-the-willows
- unicorns
- six-girls-a-home-story
- the-dunwich-horror
- the-regent-s-daughter
- the-scarlet-letter
- the-tower-treasure
- the-wailing-octopus-a-rick-brant-science-adventure-story
- winnie-the-pooh
- the-lady-of-the-lake
- the-lurking-fear
- metamorphosis
- the-monkey-s-paw
- the-hound
- the-masque-of-the-red-death
- the-red-room
- from-beyond
- the-other-gods
- the-statement-of-randolph-carter
- the-silver-key

## Counts

- Selected books: 20
- Raw-only selected: 20
- Unresolved-source generated report-only: 11
- Needs first-time controlled processing: 20
- Manual review: 0
- Blocked: 0
- Skipped/unsafe raw-only candidates: 341
- Accepted/corrected/verified exclusion count: 142

## Unresolved-Source Generated Books Left Untouched

- a-princess-of-mars: A princess of Mars; 30 generated sections; Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- doctor-dolittle: The Story of Doctor Dolittle; 6 generated sections; Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- heidi: Heidi; 11 generated sections; Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- jabberwocky: Jabberwocky; 2 generated sections; Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- nights-with-uncle-remus: Nights With Uncle Remus; 21 generated sections; Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- peter-pan: Peter Pan [Peter and Wendy]; 20 generated sections; Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- tarzan-of-the-apes: Tarzan of the Apes; 30 generated sections; Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- the-great-gatsby: The Great Gatsby; 11 generated sections; Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- the-picture-of-dorian-gray: The Picture of Dorian Gray; 23 generated sections; Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- the-thirty-nine-steps: The Thirty-Nine Steps; 12 generated sections; Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- wood-folk-at-school: Wood folk at school; 10 generated sections; Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.

## Recommendation Table

| Slug | Type | Expected title | Expected author | Structure | Sections | Status |
| --- | --- | --- | --- | --- | ---: | --- |
| the-wind-in-the-willows | standalone book | The Wind in the Willows | Kenneth Grahame | standalone roman numeral sections | 12 | needs first-time controlled processing |
| unicorns | essay/nonfiction | Unicorns | James Huneker | chapter-based roman numerals | 28 | needs first-time controlled processing |
| six-girls-a-home-story | standalone book | Six Girls: A Home Story | Fannie Belle Irving | chapter-based roman numerals | 25 | needs first-time controlled processing |
| the-dunwich-horror | standalone book | The Dunwich horror | H. P. Lovecraft | standalone arabic-numbered sections | 10 | needs first-time controlled processing |
| the-regent-s-daughter | standalone book | The regent's daughter | Alexandre Dumas | chapter-based roman numerals with volume divisions | 38 | needs first-time controlled processing |
| the-scarlet-letter | standalone book | The Scarlet Letter | Nathaniel Hawthorne | standalone roman numeral sections | 24 | needs first-time controlled processing |
| the-tower-treasure | standalone book | The tower treasure | Franklin W. Dixon | chapter-based roman numerals | 24 | needs first-time controlled processing |
| the-wailing-octopus-a-rick-brant-science-adventure-story | standalone book | The Wailing Octopus: A Rick Brant Science-Adventure Story | Harold L. Goodwin | chapter-based roman numerals | 20 | needs first-time controlled processing |
| winnie-the-pooh | standalone book | Winnie-the-Pooh | A. A. Milne | chapter-based roman numerals | 10 | needs first-time controlled processing |
| the-lady-of-the-lake | poem/anthology | The Lady of the Lake | Walter Scott | canto-based verse sections | 10 | needs first-time controlled processing |
| the-lurking-fear | standalone book | The lurking fear | H. P. Lovecraft | isolated titled sections; dry-run filters one false sentence-fragment heading | 4 | needs first-time controlled processing |
| metamorphosis | standalone book | Metamorphosis | Franz Kafka | standalone roman numeral sections | 3 | needs first-time controlled processing |
| the-monkey-s-paw | standalone book | The Monkey's Paw | W. W. Jacobs | standalone roman numeral sections | 3 | needs first-time controlled processing |
| the-hound | standalone book | The Hound | H. P. Lovecraft | standalone roman numeral sections | 2 | needs first-time controlled processing |
| the-masque-of-the-red-death | standalone book | The Masque of the Red Death | Edgar Allan Poe | isolated titled sections; dry-run treats non-body wrapper headings as cleanup artifacts | 1 | needs first-time controlled processing |
| the-red-room | individual story | The Red Room | H. G. Wells | story or titled-section headings | 1 | needs first-time controlled processing |
| from-beyond | standalone book | From Beyond | H. P. Lovecraft | isolated titled sections; dry-run treats non-body wrapper headings as cleanup artifacts | 1 | needs first-time controlled processing |
| the-other-gods | standalone book | The Other Gods | H. P. Lovecraft | isolated titled sections; dry-run treats non-body wrapper headings as cleanup artifacts | 1 | needs first-time controlled processing |
| the-statement-of-randolph-carter | standalone book | The Statement of Randolph Carter | H. P. Lovecraft | isolated titled sections; dry-run treats non-body wrapper headings as cleanup artifacts | 1 | needs first-time controlled processing |
| the-silver-key | story collection | The silver key | H. P. Lovecraft | story or titled-section headings; dry-run treats non-body wrapper headings as cleanup artifacts | 1 | needs first-time controlled processing |

## Accepted Status Ambiguities

- None.

## Future Batch Rules

- Do not mark a book safe when meaningful headings exist but proposed output would become vague Part 1 / Part 2 chunks.
- Do not mark a book safe when the expected generated title would be inherited from a parent collection instead of the actual book or story identity.
- Do not mark a book safe when the author would be Unknown Author even though the source clearly identifies an author.
- Do not mark a book safe when the first default content would not be the real readable opening.
- Do not mark a book safe when Chapter 1, Part 1, first story, or prologue would be missing or excluded incorrectly.
- Do not allow title page, parent collection title, byline, contents, source notes, illustration captions, contributor notes, transcriber notes, or license material into default playback.
- Do not allow previews to start after the true beginning.
- Do not allow selected/default source order to begin anywhere other than the first selected/default section.
- Do not ignore meaningful story, play, poem, letter, chapter, part, or section structure.
- Do not rely only on literal words like chapter, volume, or part; use repeated heading patterns, body/TOC matches, paragraph shape, spacing, and section length distribution.
- Do not accept a future write unless generated readable content is valid, the title is correct, the author metadata is correct or has a documented unresolved-author policy, all main readable sections are selected by default, and the startup preview is book-specific.
- Do not accept SOS Help!, generic preview fallback, or title/TOC/source/license/contributor/transcriber/byline material as default playback.

## Later-Phase Requirements

- After all books are processed, run an independent second-pass audit using a different strategy.
- After books and the second-pass audit, add original non-spoiler 300-500+ word SEO summaries for each accepted book page.
- After summaries, perform full site SEO/meta review using GSC data and route-level intent.
- Final cleanup should remove temporary audit scripts/reports and code bloat only after everything is stable.

## Protected Folder Confirmation

- `app/client/assets/temp-books` was read but not modified.
- `app/client/assets/books/generated` was read for exclusion checks but not modified.
- `app/client/assets/books/cloudflare-export` was not modified.
- `public/book-previews` was not modified.
