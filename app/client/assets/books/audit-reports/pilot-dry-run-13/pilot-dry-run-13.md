# Pilot Book Processing Dry Run 13

Generated: 2026-06-19T07:32:09.479Z

This is a dry-run/report-only pass. It does not write generated books, create preview assets, modify raw sources, modify Cloudflare exports, or run all-book processing.

## Inputs

- `app/client/assets/books/audit-reports/book-processing-audit-pass-1.json`
- `app/client/assets/books/audit-reports/book-processing-audit-pass-2.json`
- `app/client/assets/books/audit-reports/book-structure-audit-1/book-structure-audit-1.json`
- `app/client/assets/books/audit-reports/book-startup-preview-audit-1/book-startup-preview-audit-1.json`
- `app/client/assets/books/audit-reports/title-start-default-content-audit-1/title-start-default-content-audit-1.json`
- `app/client/assets/books/audit-reports/metadata-segmentation-correctness-audit-1/metadata-segmentation-correctness-audit-1.json`
- `app/client/assets/books/audit-reports/manual-ui-defect-followup-1/manual-ui-defect-followup-1.json`
- `app/client/assets/books/audit-reports/pilot-write-12-verification/pilot-write-12-verification.json`
- `scripts/books/lib/book-structure-detection.ts`

## Selected Books

- ashputtel
- cat-and-mouse-in-partnership
- cat-skin
- clever-elsie
- clever-gretel
- doctor-knowall
- frederick-and-catherine
- fundevogel
- hans-in-luck
- hansel-and-gretel
- iron-hans
- king-grisly-beard
- lily-and-the-lion
- little-red-riding-hood
- old-sultan
- rumpelstiltskin
- snowdrop
- sweetheart-roland
- the-dog-and-the-sparrow
- the-valiant-little-tailor

## Counts

- Selected books: 20
- Raw-only selected: 20
- Unresolved-source generated report-only: 11
- Needs first-time controlled processing: 20
- Manual review: 0
- Blocked: 0
- Skipped/unsafe raw-only candidates: 241
- Accepted/corrected/verified exclusion count: 242

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
| ashputtel | individual story | Ashputtel | Jacob Grimm; Wilhelm Grimm | single contiguous story section | 1 | needs first-time controlled processing |
| cat-and-mouse-in-partnership | individual story | Cat and Mouse in Partnership | Jacob Grimm; Wilhelm Grimm | single contiguous story section | 1 | needs first-time controlled processing |
| cat-skin | individual story | Cat-Skin | Jacob Grimm; Wilhelm Grimm | single contiguous story section | 1 | needs first-time controlled processing |
| clever-elsie | individual story | Clever Elsie | Jacob Grimm; Wilhelm Grimm | single contiguous story section | 1 | needs first-time controlled processing |
| clever-gretel | individual story | Clever Gretel | Jacob Grimm; Wilhelm Grimm | single contiguous story section | 1 | needs first-time controlled processing |
| doctor-knowall | individual story | Doctor Knowall | Jacob Grimm; Wilhelm Grimm | single contiguous story section | 1 | needs first-time controlled processing |
| frederick-and-catherine | individual story | Frederick and Catherine | Jacob Grimm; Wilhelm Grimm | single contiguous story section | 1 | needs first-time controlled processing |
| fundevogel | individual story | Fundevogel | Jacob Grimm; Wilhelm Grimm | single contiguous story section | 1 | needs first-time controlled processing |
| hans-in-luck | individual story | Hans in Luck | Jacob Grimm; Wilhelm Grimm | single contiguous story section | 1 | needs first-time controlled processing |
| hansel-and-gretel | individual story | Hansel and Gretel | Jacob Grimm; Wilhelm Grimm | single contiguous story section | 1 | needs first-time controlled processing |
| iron-hans | individual story | Iron Hans | Jacob Grimm; Wilhelm Grimm | single contiguous story section | 1 | needs first-time controlled processing |
| king-grisly-beard | individual story | King Grisly-Beard | Jacob Grimm; Wilhelm Grimm | single contiguous story section | 1 | needs first-time controlled processing |
| lily-and-the-lion | individual story | Lily and the Lion | Jacob Grimm; Wilhelm Grimm | single contiguous story section | 1 | needs first-time controlled processing |
| little-red-riding-hood | individual story | Little Red Riding Hood | Jacob Grimm; Wilhelm Grimm | single contiguous story section | 1 | needs first-time controlled processing |
| old-sultan | individual story | Old Sultan | Jacob Grimm; Wilhelm Grimm | single contiguous story section | 1 | needs first-time controlled processing |
| rumpelstiltskin | individual story | Rumpelstiltskin | Jacob Grimm; Wilhelm Grimm | single contiguous story section | 1 | needs first-time controlled processing |
| snowdrop | individual story | Snowdrop | Jacob Grimm; Wilhelm Grimm | single contiguous story section | 1 | needs first-time controlled processing |
| sweetheart-roland | individual story | Sweetheart Roland | Jacob Grimm; Wilhelm Grimm | single contiguous story section | 1 | needs first-time controlled processing |
| the-dog-and-the-sparrow | individual story | The Dog and the Sparrow | Jacob Grimm; Wilhelm Grimm | single contiguous story section | 1 | needs first-time controlled processing |
| the-valiant-little-tailor | individual story | The Valiant Little Tailor | Jacob Grimm; Wilhelm Grimm | single contiguous story section | 1 | needs first-time controlled processing |

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
- Investigate the SSR heap OOM separately if it keeps appearing during plain npm run build.
- Final cleanup should remove temporary audit scripts/reports and code bloat only after everything is stable.

## Protected Folder Confirmation

- `app/client/assets/temp-books` was read but not modified.
- `app/client/assets/books/generated` was read for exclusion checks but not modified.
- `app/client/assets/books/cloudflare-export` was not modified.
- `public/book-previews` was not modified.
