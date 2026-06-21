# Pilot Book Processing Dry Run 23

Generated: 2026-06-21T07:30:15.429Z

This is a dry-run/report-only pass. It does not write generated books, create preview assets, modify raw sources, modify Cloudflare exports, or run all-book processing.

## Implementation Scope Note

Dry-run 23 intentionally uses `scripts/books/pilot-book-processing-dry-run-13.ts` as the shared implementation engine. The batch-23 entry point only sets `MORSEWORDS_PILOT_DRY_RUN_BATCH=23` and imports that engine; batch 13 remains the default when the environment flag is absent. The shared-file diff is therefore required dry-run-23 implementation, not an unrelated modification.
- Classification: harmless shared implementation intentionally used by dry-run 23
- Resolution: Retain the shared-engine change: dry-run 23 adds only its report inputs, selection evidence, safety skips, metadata-role reporting, and environment dispatch while preserving batch 13 as the default.
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
- `app/client/assets/books/audit-reports/pilot-write-19-verification/pilot-write-19-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-20-verification/pilot-write-20-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-21-verification/pilot-write-21-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-22-verification/pilot-write-22-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-13-verification/pilot-write-13-verification.json`
- `scripts/books/lib/book-structure-detection.ts`

## Selected Books

- in-the-modern-vein
- the-argonauts-of-the-air
- the-dreams-in-the-witch-house
- the-jilting-of-jane
- the-lost-inheritance
- the-purple-pileus
- the-shadow-out-of-time
- the-strange-high-house-in-the-mist
- the-valley-of-spiders
- the-whisperer-in-darkness

## Counts

- Selected books: 10
- Fewer than 20 safe candidates remain: yes
- Raw-only selected: 10
- Unresolved-source generated report-only: 11
- Needs first-time controlled processing: 10
- Manual review: 0
- Blocked: 0
- Skipped/unsafe raw-only candidates: 46
- Accepted/corrected/verified exclusion count: 445

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
| in-the-modern-vein | individual story | In the Modern Vein | H. G. Wells | author as identified by the source | single contiguous story section | 1 | needs first-time controlled processing |
| the-argonauts-of-the-air | individual story | The Argonauts of the Air | H. G. Wells | author as identified by the source | single contiguous story section | 1 | needs first-time controlled processing |
| the-dreams-in-the-witch-house | individual story | The Dreams in the Witch-House | H. P. Lovecraft | author as identified by the source | single contiguous story section | 1 | needs first-time controlled processing |
| the-jilting-of-jane | individual story | The Jilting of Jane | H. G. Wells | author as identified by the source | single contiguous story section | 1 | needs first-time controlled processing |
| the-lost-inheritance | individual story | The Lost Inheritance | H. G. Wells | author as identified by the source | single contiguous story section | 1 | needs first-time controlled processing |
| the-purple-pileus | individual story | The Purple Pileus | H. G. Wells | author as identified by the source | single contiguous story section | 1 | needs first-time controlled processing |
| the-shadow-out-of-time | individual story | The Shadow Out of Time | H. P. Lovecraft | author as identified by the source | single contiguous story section | 1 | needs first-time controlled processing |
| the-strange-high-house-in-the-mist | individual story | The Strange High House in the Mist | H. P. Lovecraft | author as identified by the source | single contiguous story section | 1 | needs first-time controlled processing |
| the-valley-of-spiders | individual story | The Valley of Spiders | H. G. Wells | author as identified by the source | single contiguous story section | 1 | needs first-time controlled processing |
| the-whisperer-in-darkness | individual story | The Whisperer in Darkness | H. P. Lovecraft | author as identified by the source | single contiguous story section | 1 | needs first-time controlled processing |

## Accepted Status Ambiguities

- None.

## Backlog Note

46 remaining skipped/unsafe raw-only candidates are retained for a final remaining inventory/triage pass after safe batching slows or is exhausted; none are lost or silently accepted.

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
- Investigate the SSR heap OOM separately.
- Investigate the in-app Browser sandbox issue separately.
- Investigate intermittent fullscreen Playwright/UI behavior separately.
- Final cleanup should remove temporary audit scripts/reports and code bloat only after everything is stable.

## Protected Folder Confirmation

- `app/client/assets/temp-books` was read but not modified.
- `app/client/assets/books/generated` was read for exclusion checks but not modified.
- `app/client/assets/books/cloudflare-export` was not modified.
- `public/book-previews` was not modified.
