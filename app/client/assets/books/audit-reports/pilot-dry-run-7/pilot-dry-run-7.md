# Pilot Book Processing Dry Run 7

Generated: 2026-06-18T04:51:16.047Z

This is a dry-run/report-only pass. It does not write generated books, create preview assets, modify raw sources, modify Cloudflare exports, or run all-book processing.

## Inputs

- `app/client/assets/books/audit-reports/book-processing-audit-pass-1.json`
- `app/client/assets/books/audit-reports/book-processing-audit-pass-2.json`
- `app/client/assets/books/audit-reports/book-structure-audit-1/book-structure-audit-1.json`
- `app/client/assets/books/audit-reports/book-startup-preview-audit-1/book-startup-preview-audit-1.json`
- `app/client/assets/books/audit-reports/title-start-default-content-audit-1/title-start-default-content-audit-1.json`
- `app/client/assets/books/audit-reports/metadata-segmentation-correctness-audit-1/metadata-segmentation-correctness-audit-1.json`
- `app/client/assets/books/audit-reports/manual-ui-defect-followup-1/manual-ui-defect-followup-1.json`
- `scripts/books/lib/book-structure-detection.ts`

## Selected Books

- a-japanese-blossom
- at-the-earth-s-core
- can-you-forgive-her
- despair-s-last-journey
- five-children-and-it
- flatland-a-romance-of-many-dimensions
- herland
- hero-myths-and-legends-of-the-british-race
- howards-end
- king-arthur-and-the-knights-of-the-round-table
- lord-jim
- love-among-the-chickens
- parnassus-on-wheels
- pollyanna
- shen-of-the-sea-a-book-for-children
- the-adventures-of-pinocchio
- the-invisible-man-a-grotesque-romance
- the-virginian-a-horseman-of-the-plains
- the-green-mummy
- the-mark-of-zorro
- typhoon
- robert-orange
- the-warden
- the-sea-lady
- the-laughing-cavalier-the-story-of-the-ancestor-of-the-scarlet-pimpernel

## Counts

- Selected books: 25
- Raw-only selected: 25
- Unresolved-source generated report-only: 11
- Needs first-time controlled processing: 25
- Manual review: 0
- Blocked: 0
- Skipped/unsafe raw-only candidates: 361
- Accepted/corrected/verified exclusion count: 117

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
| a-japanese-blossom | standalone book | A Japanese Blossom | Onoto Watanna | standalone roman numeral sections | 29 | needs first-time controlled processing |
| at-the-earth-s-core | standalone book | At the Earth's Core | Edgar Rice Burroughs | standalone roman numeral sections | 15 | needs first-time controlled processing |
| can-you-forgive-her | standalone book | Can You Forgive Her? | Anthony Trollope | chapter-based roman numerals with volume divisions | 80 | needs first-time controlled processing |
| despair-s-last-journey | standalone book | Despair's Last Journey | David Christie Murray | chapter-based roman numerals | 29 | needs first-time controlled processing |
| five-children-and-it | standalone book | Five Children and It | E. Nesbit | chapter-based roman numerals | 10 | needs first-time controlled processing |
| flatland-a-romance-of-many-dimensions | standalone book | Flatland: A Romance of Many Dimensions | Edwin Abbott Abbott | section-based divisions | 22 | needs first-time controlled processing |
| herland | standalone book | Herland | Charlotte Perkins Gilman | chapter-based arabic numbers | 12 | needs first-time controlled processing |
| hero-myths-and-legends-of-the-british-race | essay/nonfiction | Hero-Myths & Legends of the British Race | M. I. Ebbutt | chapter-based roman numerals | 16 | needs first-time controlled processing |
| howards-end | standalone book | Howards End | E. M. Forster | chapter-based roman numerals | 40 | needs first-time controlled processing |
| king-arthur-and-the-knights-of-the-round-table | standalone book | King Arthur and the Knights of the Round Table | Sir Thomas Malory | standalone roman numeral sections | 15 | needs first-time controlled processing |
| lord-jim | standalone book | Lord Jim | Joseph Conrad | chapter-based arabic numbers | 45 | needs first-time controlled processing |
| love-among-the-chickens | standalone book | Love Among the Chickens | P. G. Wodehouse | standalone roman numeral sections | 23 | needs first-time controlled processing |
| parnassus-on-wheels | standalone book | Parnassus on Wheels | Christopher Morley | chapter-based word ordinals | 6 | needs first-time controlled processing |
| pollyanna | standalone book | Pollyanna | Eleanor H. Porter | chapter-based roman numerals | 32 | needs first-time controlled processing |
| shen-of-the-sea-a-book-for-children | story collection | Shen of the Sea: A Book for Children | Arthur Bowie Chrisman | story or titled-section headings | 16 | needs first-time controlled processing |
| the-adventures-of-pinocchio | standalone book | The Adventures of Pinocchio | Carlo Collodi | chapter-based arabic numbers | 36 | needs first-time controlled processing |
| the-invisible-man-a-grotesque-romance | standalone book | The Invisible Man: A Grotesque Romance | H. G. Wells | chapter-based roman numerals | 28 | needs first-time controlled processing |
| the-virginian-a-horseman-of-the-plains | standalone book | The Virginian: A Horseman of the Plains | Owen Wister | roman-numbered titled sections | 38 | needs first-time controlled processing |
| the-green-mummy | standalone book | The Green Mummy | Fergus Hume | chapter-based roman numerals | 27 | needs first-time controlled processing |
| the-mark-of-zorro | standalone book | The mark of Zorro | Johnston McCulley | chapter-based roman numerals | 39 | needs first-time controlled processing |
| typhoon | standalone book | Typhoon | Joseph Conrad | standalone roman numeral sections | 6 | needs first-time controlled processing |
| robert-orange | standalone book | Robert Orange | John Oliver Hobbes | chapter-based roman numerals | 30 | needs first-time controlled processing |
| the-warden | standalone book | The Warden | Anthony Trollope | chapter-based roman numerals | 20 | needs first-time controlled processing |
| the-sea-lady | standalone book | The Sea Lady | Herbert George Wells | standalone roman numeral sections | 31 | needs first-time controlled processing |
| the-laughing-cavalier-the-story-of-the-ancestor-of-the-scarlet-pimpernel | standalone book | The Laughing Cavalier: The Story of the Ancestor of the Scarlet Pimpernel | Baroness Emmuska Orczy Orczy | chapter-based roman numerals | 45 | needs first-time controlled processing |

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
- Do not allow selected-source text to begin anywhere other than the first selected/default section.
- Do not ignore meaningful story, play, poem, letter, chapter, part, or section structure.

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
