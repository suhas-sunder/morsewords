# Pilot Book Processing Dry Run 10

Generated: 2026-06-18T23:29:36.488Z

This is a dry-run/report-only pass. It does not write generated books, create preview assets, modify raw sources, modify Cloudflare exports, or run all-book processing.

## Inputs

- `app/client/assets/books/audit-reports/book-processing-audit-pass-1.json`
- `app/client/assets/books/audit-reports/book-processing-audit-pass-2.json`
- `app/client/assets/books/audit-reports/book-structure-audit-1/book-structure-audit-1.json`
- `app/client/assets/books/audit-reports/book-startup-preview-audit-1/book-startup-preview-audit-1.json`
- `app/client/assets/books/audit-reports/title-start-default-content-audit-1/title-start-default-content-audit-1.json`
- `app/client/assets/books/audit-reports/metadata-segmentation-correctness-audit-1/metadata-segmentation-correctness-audit-1.json`
- `app/client/assets/books/audit-reports/manual-ui-defect-followup-1/manual-ui-defect-followup-1.json`
- `app/client/assets/books/audit-reports/pilot-write-9-verification/pilot-write-9-verification.json`
- `scripts/books/lib/book-structure-detection.ts`

## Selected Books

- the-time-machine
- kidnapped
- oliver-twist
- the-benson-murder-case
- the-inspector-french-s-greatest-case
- murder-in-the-maze
- the-house-of-arden-a-story-for-children
- the-shadow-over-innsmouth
- the-thing-on-the-door-step
- at-the-mountains-of-madness
- the-remarkable-case-of-davidson-s-eyes
- the-haunter-of-the-dark
- the-innocence-of-father-brown
- astounding-stories-of-super-science
- a-story-of-the-stone-age
- the-magic-shop
- the-man-who-could-work-miracles
- the-truth-about-pyecraft
- filmer
- two-in-a-sack

## Counts

- Selected books: 20
- Raw-only selected: 20
- Unresolved-source generated report-only: 11
- Needs first-time controlled processing: 20
- Manual review: 0
- Blocked: 0
- Skipped/unsafe raw-only candidates: 301
- Accepted/corrected/verified exclusion count: 182

## Duplicate/Near-Duplicate Candidates Skipped

- the-wind-in-the-willows: Skipped as a known duplicate of existing generated wind-in-the-willows; write batch 8 accepted the skip and no distinct-version policy exists.
- the-two-magics-the-turn-of-the-screw-covering-end: Skipped as a known duplicate/boundary-risk case; write batch 9 found this raw file contains a full The Turn of the Screw while generated the-turn-of-the-screw already exists and no distinct-version policy exists.

## Boundary-Defect Candidates Skipped

- the-works-of-edgar-allan-poe: Skipped as a known boundary-defect case; write batch 9 found raw Volume 2 begins with THE PURLOINED LETTER while the dry-run boundary would have dropped that opening collection content.

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
| the-time-machine | standalone book | The Time Machine | H. G. Wells | standalone roman numeral sections with verified Chapter I override | 15 | needs first-time controlled processing |
| kidnapped | standalone book | Kidnapped | Robert Louis Stevenson | chapter-based roman numerals with verified Chapter I override | 30 | needs first-time controlled processing |
| oliver-twist | standalone book | Oliver Twist | Charles Dickens | chapter-based roman numerals with verified Chapter I override | 53 | needs first-time controlled processing |
| the-benson-murder-case | standalone book | The Benson murder case | S. S. Van Dine | chapter-based roman numerals with verified Chapter I override | 25 | needs first-time controlled processing |
| the-inspector-french-s-greatest-case | standalone book | The Inspector French's Greatest Case | Freeman Wills Crofts | chapter-based roman numerals | 20 | needs first-time controlled processing |
| murder-in-the-maze | standalone book | Murder in the maze | J. J. Connington | chapter-based roman numerals with verified Chapter I override | 18 | needs first-time controlled processing |
| the-house-of-arden-a-story-for-children | standalone book | The House of Arden: A Story for Children | E. Nesbit | chapter-based roman numerals with verified Chapter I override | 14 | needs first-time controlled processing |
| the-shadow-over-innsmouth | individual story | The shadow over Innsmouth | H. P. Lovecraft | standalone roman numeral sections with verified section I override | 5 | needs first-time controlled processing |
| the-thing-on-the-door-step | individual story | The thing on the door-step | H. P. Lovecraft | standalone arabic-numbered sections with verified section 1 override | 7 | needs first-time controlled processing |
| at-the-mountains-of-madness | individual story | At the mountains of madness | H. P. Lovecraft | standalone roman numeral sections with verified section I override | 12 | needs first-time controlled processing |
| the-remarkable-case-of-davidson-s-eyes | individual story | The Remarkable Case of Davidson's Eyes | H. G. Wells | standalone roman numeral sections with verified section I override | 5 | needs first-time controlled processing |
| the-haunter-of-the-dark | individual story | The haunter of the dark | H. P. Lovecraft | isolated titled sections | 7 | needs first-time controlled processing |
| the-innocence-of-father-brown | story collection | The innocence of Father Brown | G. K. Chesterton | isolated titled sections | 29 | needs first-time controlled processing |
| astounding-stories-of-super-science | story collection | Astounding Stories of Super-Science, October, 1930 | Various | chapter-based roman numerals | 20 | needs first-time controlled processing |
| a-story-of-the-stone-age | individual story | A Story of the Stone Age | Herbert George Wells | story or titled-section headings | 6 | needs first-time controlled processing |
| the-magic-shop | individual story | The Magic Shop | H. G. Wells | story or titled-section headings | 2 | needs first-time controlled processing |
| the-man-who-could-work-miracles | individual story | The Man Who Could Work Miracles | Herbert George Wells | isolated titled sections | 5 | needs first-time controlled processing |
| the-truth-about-pyecraft | individual story | The Truth About Pyecraft | H. G. Wells | isolated titled sections | 5 | needs first-time controlled processing |
| filmer | individual story | Filmer | H. G. Wells | story or titled-section headings | 2 | needs first-time controlled processing |
| two-in-a-sack | individual story | Two in a Sack | Andrew Lang | single fairy-tale story after parent collection wrapper | 1 | needs first-time controlled processing |

## Accepted Status Ambiguities

- None.

## Future Batch Rules

- Future book batches fail unless each processed book has valid generated readable content.
- Future book batches fail unless each processed book has the correct generated title.
- Future book batches fail unless each processed book has correct author metadata or a documented unresolved-author policy.
- Future book batches fail if duplicate generated work appears under a slightly different slug without intentional documentation.
- Future book batches fail unless the first default section begins with real readable content.
- Future book batches fail unless all main readable sections are included by default.
- Future book batches fail unless segmentation is meaningful and source-based.
- Future book batches fail unless startup preview is valid, book-specific, and starts from real readable generated content.
- Future book batches fail if preview contains SOS Help! or generic preview fallback text.
- Future book batches fail if title/TOC/source/license/contributor/transcriber/byline material enters default playback.
- Future book batches fail unless selected/default source order begins from the first selected/default section.
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
- After books/SEO, run a focused rage-click UX pass for /audio, /practice, homepage, and related utility pages.
- Final cleanup should remove temporary audit scripts/reports and code bloat only after everything is stable.

## Protected Folder Confirmation

- `app/client/assets/temp-books` was read but not modified.
- `app/client/assets/books/generated` was read for exclusion checks but not modified.
- `app/client/assets/books/cloudflare-export` was not modified.
- `public/book-previews` was not modified.
