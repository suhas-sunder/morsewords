# Pilot Book Processing Dry Run 9

Generated: 2026-06-18T21:38:36.422Z

This is a dry-run/report-only pass. It does not write generated books, create preview assets, modify raw sources, modify Cloudflare exports, or run all-book processing.

## Inputs

- `app/client/assets/books/audit-reports/book-processing-audit-pass-1.json`
- `app/client/assets/books/audit-reports/book-processing-audit-pass-2.json`
- `app/client/assets/books/audit-reports/book-structure-audit-1/book-structure-audit-1.json`
- `app/client/assets/books/audit-reports/book-startup-preview-audit-1/book-startup-preview-audit-1.json`
- `app/client/assets/books/audit-reports/title-start-default-content-audit-1/title-start-default-content-audit-1.json`
- `app/client/assets/books/audit-reports/metadata-segmentation-correctness-audit-1/metadata-segmentation-correctness-audit-1.json`
- `app/client/assets/books/audit-reports/manual-ui-defect-followup-1/manual-ui-defect-followup-1.json`
- `app/client/assets/books/audit-reports/pilot-write-8-verification/pilot-write-8-verification.json`
- `scripts/books/lib/book-structure-detection.ts`

## Selected Books

- a-study-in-scarlet
- dagon
- deep-sea-plunderings
- five-little-peppers-at-school
- pickman-s-model
- quo-vadis
- the-amateur-cracksman
- the-black-star-passes
- the-blue-castle
- the-brothers-karamazov
- the-buccaneer
- the-cats-of-ulthar
- the-festival
- the-history-of-sir-richard-calmady-a-romance
- the-nameless-city
- the-three-taps-a-detective-story-without-a-moral
- the-turmoil
- the-two-magics-the-turn-of-the-screw-covering-end
- the-works-of-edgar-allan-poe
- under-the-red-dragon

## Counts

- Selected books: 20
- Raw-only selected: 20
- Unresolved-source generated report-only: 11
- Needs first-time controlled processing: 20
- Manual review: 0
- Blocked: 0
- Skipped/unsafe raw-only candidates: 321
- Accepted/corrected/verified exclusion count: 162

## Duplicate/Near-Duplicate Candidates Skipped

- the-wind-in-the-willows: Skipped as a known duplicate of existing generated wind-in-the-willows; write batch 8 accepted the skip and no distinct-version policy exists.

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
| a-study-in-scarlet | standalone book | A Study in Scarlet | Arthur Conan Doyle | chapter-based roman numerals with part divisions | 13 | needs first-time controlled processing |
| dagon | standalone book | Dagon | Howard Phillips Lovecraft (1890-1937) | single contiguous story section | 1 | needs first-time controlled processing |
| deep-sea-plunderings | essay/nonfiction | Deep-Sea Plunderings | Frank Thomas Bullen | story or titled-section headings after contents/illustration lists | 24 | needs first-time controlled processing |
| five-little-peppers-at-school | story collection | Five Little Peppers at School | Margaret Sidney | bare roman chapter-title headings | 25 | needs first-time controlled processing |
| pickman-s-model | standalone book | Pickman's Model | H. P. Lovecraft (1890-1937) | single contiguous story section | 1 | needs first-time controlled processing |
| quo-vadis | standalone book | Quo Vadis: A Narrative of the Time of Nero | Henryk Sienkiewicz | chapter-based roman numerals | 73 | needs first-time controlled processing |
| the-amateur-cracksman | story collection | The Amateur Cracksman | E. W. Hornung | story or titled-section headings after contents | 8 | needs first-time controlled processing |
| the-black-star-passes | standalone book | The Black Star Passes | Jr. John W. Campbell | standalone roman numeral sections with book divisions | 16 | needs first-time controlled processing |
| the-blue-castle | standalone book | The Blue Castle: a novel | L. M. Montgomery | chapter-based roman numerals | 45 | needs first-time controlled processing |
| the-brothers-karamazov | standalone book | The Brothers Karamazov | Fyodor Dostoyevsky | chapter-based roman numerals with book divisions and part divisions | 84 | needs first-time controlled processing |
| the-buccaneer | standalone book | The Buccaneer: A Tale | Mrs. S. C. Hall | chapter-based roman numerals | 43 | needs first-time controlled processing |
| the-cats-of-ulthar | standalone book | The Cats of Ulthar | Howard Phillips Lovecraft (1890-1937) | single contiguous story section | 1 | needs first-time controlled processing |
| the-festival | standalone book | The Festival | H. P. Lovecraft | single contiguous story section | 1 | needs first-time controlled processing |
| the-history-of-sir-richard-calmady-a-romance | standalone book | The History of Sir Richard Calmady: A Romance | Lucas Malet | chapter-based roman numerals with book divisions | 55 | needs first-time controlled processing |
| the-nameless-city | standalone book | The Nameless City | Howard Phillips Lovecraft (1890-1937) | single contiguous story section | 1 | needs first-time controlled processing |
| the-three-taps-a-detective-story-without-a-moral | standalone book | The Three Taps | Ronald Arbuthnott Knox | chapter-based roman numerals | 25 | needs first-time controlled processing |
| the-turmoil | standalone book | The Turmoil: A Novel | Booth Tarkington | chapter-based roman numerals | 33 | needs first-time controlled processing |
| the-two-magics-the-turn-of-the-screw-covering-end | standalone book | The Two Magics: The Turn of the Screw, Covering End | Henry James | standalone roman numeral sections | 31 | needs first-time controlled processing |
| the-works-of-edgar-allan-poe | story collection | The Works of Edgar Allan Poe ? Volume 2 | Edgar Allan Poe | story or titled-section headings | 24 | needs first-time controlled processing |
| under-the-red-dragon | standalone book | Under the Red Dragon: A Novel | James Grant | chapter-based roman numerals | 61 | needs first-time controlled processing |

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
- Final cleanup should remove temporary audit scripts/reports and code bloat only after everything is stable.

## Protected Folder Confirmation

- `app/client/assets/temp-books` was read but not modified.
- `app/client/assets/books/generated` was read for exclusion checks but not modified.
- `app/client/assets/books/cloudflare-export` was not modified.
- `public/book-previews` was not modified.
