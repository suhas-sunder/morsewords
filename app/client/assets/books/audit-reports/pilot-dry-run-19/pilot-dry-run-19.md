# Pilot Book Processing Dry Run 19

Generated: 2026-06-20T18:52:38.184Z

This is a dry-run/report-only pass. It does not write generated books, create preview assets, modify raw sources, modify Cloudflare exports, or run all-book processing.

## Implementation Scope Note

Dry-run 19 intentionally uses `scripts/books/pilot-book-processing-dry-run-13.ts` as the shared implementation engine. The batch-19 entry point only sets `MORSEWORDS_PILOT_DRY_RUN_BATCH=19` and imports that engine; batch 13 remains the default when the environment flag is absent. The shared-file diff is therefore required dry-run-19 implementation, not an unrelated modification.
- Classification: harmless shared implementation intentionally used by dry-run 19
- Resolution: Retain the shared-engine change: dry-run 19 adds only its report inputs, selection evidence, safety skips, metadata-role reporting, and environment dispatch while preserving batch 13 as the default.
- Unrelated changes found: no

## Inputs

- `app/client/assets/books/audit-reports/book-processing-audit-pass-1.json`
- `app/client/assets/books/audit-reports/book-processing-audit-pass-2.json`
- `app/client/assets/books/audit-reports/book-structure-audit-1/book-structure-audit-1.json`
- `app/client/assets/books/audit-reports/book-startup-preview-audit-1/book-startup-preview-audit-1.json`
- `app/client/assets/books/audit-reports/title-start-default-content-audit-1/title-start-default-content-audit-1.json`
- `app/client/assets/books/audit-reports/metadata-segmentation-correctness-audit-1/metadata-segmentation-correctness-audit-1.json`
- `app/client/assets/books/audit-reports/manual-ui-defect-followup-1/manual-ui-defect-followup-1.json`
- `app/client/assets/books/audit-reports/pilot-write-12-verification/pilot-write-12-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-14-verification/pilot-write-14-verification.json`
- `app/client/assets/books/audit-reports/batch-12-prose-restoration/batch-12-prose-restoration.json`
- `app/client/assets/books/audit-reports/pilot-write-15-verification/pilot-write-15-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-16-verification/pilot-write-16-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-17-verification/pilot-write-17-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-18-verification/pilot-write-18-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-13-verification/pilot-write-13-verification.json`
- `scripts/books/lib/book-structure-detection.ts`

## Selected Books

- the-child-who-came-from-an-egg
- the-finest-liar-in-the-world
- the-frog
- the-grateful-prince
- the-headless-dwarfs
- the-lute-player
- the-maiden-with-the-wooden-helmet
- the-monkey-and-the-jelly-fish
- the-nine-pea-hens-and-the-golden-apples
- the-nunda-eater-of-people
- the-prince-who-wanted-to-see-the-world
- the-princess-who-was-hidden-underground
- the-story-of-a-gazelle
- the-story-of-halfman
- the-story-of-hassebu
- the-story-of-three-wonderful-beggars
- the-three-princes-and-their-beasts
- the-two-frogs
- the-underground-workers
- the-young-man-who-would-have-his-eyes-opened

## Counts

- Selected books: 20
- Raw-only selected: 20
- Unresolved-source generated report-only: 11
- Needs first-time controlled processing: 20
- Manual review: 0
- Blocked: 0
- Skipped/unsafe raw-only candidates: 116
- Accepted/corrected/verified exclusion count: 365

## Duplicate/Near-Duplicate Candidates Skipped

- the-wind-in-the-willows: Skipped as a known duplicate of existing generated wind-in-the-willows; write batch 8 accepted the skip and no distinct-version policy exists.
- the-two-magics-the-turn-of-the-screw-covering-end: Skipped as a known duplicate/boundary-risk case; write batch 9 found this raw file contains a full The Turn of the Screw while generated the-turn-of-the-screw already exists and no distinct-version policy exists.
- japanese-fairy-tales: Skipped as a parent-collection near-duplicate: its individual Ozaki tales are already represented by accepted generated story pages, and no distinct collection-page policy has been approved.

## Boundary-Defect Candidates Skipped

- the-works-of-edgar-allan-poe: Skipped as a known boundary-defect case; write batch 9 found raw Volume 2 begins with THE PURLOINED LETTER while the dry-run boundary would have dropped that opening collection content.
- snow-white-and-rose-red: Skipped for boundary review: the raw excerpt appends a collection-level editorial note after the tale's true ending, so generic cleaned-source end detection would include non-story material.

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

| Slug | Type | Expected title | Expected author | Creator role | Structure | Sections | Status |
| --- | --- | --- | --- | --- | --- | ---: | --- |
| the-child-who-came-from-an-egg | individual story | The Child Who Came from an Egg | Andrew Lang | editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) | single contiguous story section | 1 | needs first-time controlled processing |
| the-finest-liar-in-the-world | individual story | The Finest Liar in the World | Andrew Lang | editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) | single contiguous story section | 1 | needs first-time controlled processing |
| the-frog | individual story | The Frog | Andrew Lang | editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) | single contiguous story section | 1 | needs first-time controlled processing |
| the-grateful-prince | individual story | The Grateful Prince | Andrew Lang | editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) | single contiguous story section | 1 | needs first-time controlled processing |
| the-headless-dwarfs | individual story | The Headless Dwarfs | Andrew Lang | editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) | single contiguous story section | 1 | needs first-time controlled processing |
| the-lute-player | individual story | The Lute Player | Andrew Lang | editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) | single contiguous story section | 1 | needs first-time controlled processing |
| the-maiden-with-the-wooden-helmet | individual story | The Maiden with the Wooden Helmet | Andrew Lang | editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) | single contiguous story section | 1 | needs first-time controlled processing |
| the-monkey-and-the-jelly-fish | individual story | The Monkey and the Jelly-Fish | Andrew Lang | editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) | single contiguous story section | 1 | needs first-time controlled processing |
| the-nine-pea-hens-and-the-golden-apples | individual story | The Nine Pea-Hens and the Golden Apples | Andrew Lang | editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) | single contiguous story section | 1 | needs first-time controlled processing |
| the-nunda-eater-of-people | individual story | The Nunda, Eater of People | Andrew Lang | editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) | single contiguous story section | 1 | needs first-time controlled processing |
| the-prince-who-wanted-to-see-the-world | individual story | The Prince Who Wanted to See the World | Andrew Lang | editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) | single contiguous story section | 1 | needs first-time controlled processing |
| the-princess-who-was-hidden-underground | individual story | The Princess Who Was Hidden Underground | Andrew Lang | editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) | single contiguous story section | 1 | needs first-time controlled processing |
| the-story-of-a-gazelle | individual story | The Story of a Gazelle | Andrew Lang | editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) | single contiguous story section | 1 | needs first-time controlled processing |
| the-story-of-halfman | individual story | The Story of Halfman | Andrew Lang | editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) | single contiguous story section | 1 | needs first-time controlled processing |
| the-story-of-hassebu | individual story | The Story of Hassebu | Andrew Lang | editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) | single contiguous story section | 1 | needs first-time controlled processing |
| the-story-of-three-wonderful-beggars | individual story | The Story of Three Wonderful Beggars | Andrew Lang | editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) | single contiguous story section | 1 | needs first-time controlled processing |
| the-three-princes-and-their-beasts | individual story | The Three Princes and Their Beasts | Andrew Lang | editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) | single contiguous story section | 1 | needs first-time controlled processing |
| the-two-frogs | individual story | The Two Frogs | Andrew Lang | editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) | single contiguous story section | 1 | needs first-time controlled processing |
| the-underground-workers | individual story | The Underground Workers | Andrew Lang | editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) | single contiguous story section | 1 | needs first-time controlled processing |
| the-young-man-who-would-have-his-eyes-opened | individual story | The Young Man Who Would Have His Eyes Opened | Andrew Lang | editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) | single contiguous story section | 1 | needs first-time controlled processing |

## Accepted Status Ambiguities

- None.

## Backlog Note

116 remaining skipped/unsafe raw-only candidates are retained for a final remaining inventory/triage pass after safe batching slows or is exhausted; none are lost or silently accepted.

## Future Batch Rules

- Future book batches fail unless each processed book has valid generated readable content.
- Future book batches fail unless each processed book has the correct generated title.
- Future book batches fail unless each processed book has correct author/compiler/collector/translator metadata or a documented unresolved-author policy.
- Future book batches fail if duplicate generated work appears under a slightly different slug without intentional documentation.
- Future book batches fail unless the first default section begins with real readable content.
- Future book batches fail unless all main readable sections are included by default.
- Future book batches fail unless segmentation is meaningful and source-based.
- Future book batches fail unless startup preview is valid, book-specific, and starts from real readable generated content.
- Future book batches fail if preview contains SOS Help! or generic preview fallback text.
- Future book batches fail if title/TOC/source/license/contributor/transcriber/byline/parent-collection material enters default playback.
- Future book batches fail if cleanup removes real prose, punctuation, dialogue, or the readable ending.
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
- Do not accept a future write unless generated readable content is valid, the title is correct, the author/compiler/collector/translator metadata is correct or has a documented unresolved-author policy, all main readable sections are selected by default, and the startup preview is book-specific.
- Do not accept SOS Help!, generic preview fallback, or title/TOC/source/license/contributor/transcriber/byline/parent-collection material as default playback.

## Later-Phase Requirements

- After safe batching slows or is exhausted, create a remaining raw inventory/triage report classifying every unprocessed raw file.
- After all books are processed, run an independent second-pass audit using a different strategy.
- After books and the second-pass audit, add original non-spoiler 300-500+ word SEO summaries for each accepted book page.
- After summaries, perform full site SEO/meta review using GSC data and route-level intent.
- After books/SEO, run a focused rage-click UX pass for /audio, /practice, homepage, and related utility pages.
- Investigate the SSR heap OOM separately if it keeps appearing during plain npm run build.
- Investigate the in-app Browser sandbox issue separately.
- Final cleanup should remove temporary audit scripts/reports and code bloat only after everything is stable.

## Protected Folder Confirmation

- `app/client/assets/temp-books` was read but not modified.
- `app/client/assets/books/generated` was read for exclusion checks but not modified.
- `app/client/assets/books/cloudflare-export` was not modified.
- `public/book-previews` was not modified.
