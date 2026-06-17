# Pilot Write 5 Report

Controlled write/correction pass for pilot dry-run batch 5. The dry-run branch was merged to main first, and this write pass only corrected books classified as `needs correction before acceptance` in `pilot-dry-run-5.json`.

## Summary

| Book | Dry-run status | Final action | Sections before | Sections after | Startup preview | Recommendation |
| --- | --- | --- | ---: | ---: | --- | --- |
| anna-karenina | already acceptable | accepted without rewrite | 241 | 241 | valid | accepted for review |
| anne-of-green-gables-gutenberg-45 | already acceptable | accepted without rewrite | 39 | 39 | valid | accepted for review |
| candide | needs correction before acceptance | corrected | 8 | 30 | valid | accepted for review |
| crime-and-punishment | needs correction before acceptance | corrected | 47 | 40 | valid | accepted for review |
| gulliver-s-travels | needs correction before acceptance | corrected | 49 | 39 | valid | accepted for review |
| the-bell | already acceptable | accepted without rewrite | 2 | 2 | valid | accepted for review |
| the-call-of-cthulhu | needs correction before acceptance | corrected | 4 | 3 | valid | accepted for review |
| the-elderbush | already acceptable | accepted without rewrite | 2 | 2 | valid | accepted for review |
| the-emerald-city-of-oz | needs correction before acceptance | corrected | 11 | 30 | valid | accepted for review |
| the-emperor-s-new-clothes | already acceptable | accepted without rewrite | 2 | 2 | valid | accepted for review |
| the-fir-tree | already acceptable | accepted without rewrite | 2 | 2 | valid | accepted for review |
| the-leap-frog | already acceptable | accepted without rewrite | 2 | 2 | valid | accepted for review |
| the-old-house | needs correction before acceptance | corrected | 5 | 9 | valid | accepted for review |
| the-real-princess | already acceptable | accepted without rewrite | 2 | 2 | valid | accepted for review |
| the-secret-garden-gutenberg-113 | already acceptable | accepted without rewrite | 30 | 30 | valid | accepted for review |
| the-shoes-of-fortune | already acceptable | accepted without rewrite | 4 | 4 | valid | accepted for review |
| the-snow-queen | needs correction before acceptance | corrected | 4 | 7 | valid | accepted for review |
| the-swineherd | needs correction before acceptance | corrected | 2 | 1 | valid | accepted for review |
| treasure-island | needs correction before acceptance | corrected | 14 | 34 | valid | accepted for review |
| wind-in-the-willows | already acceptable | accepted without rewrite | 14 | 14 | valid | accepted for review |

## Accepted Without Rewrite

- anna-karenina: accepted from dry-run; no write needed; no files changed.
- anne-of-green-gables-gutenberg-45: accepted from dry-run; no write needed; no files changed.
- the-bell: accepted from dry-run; no write needed; no files changed.
- the-elderbush: accepted from dry-run; no write needed; no files changed.
- the-emperor-s-new-clothes: accepted from dry-run; no write needed; no files changed.
- the-fir-tree: accepted from dry-run; no write needed; no files changed.
- the-leap-frog: accepted from dry-run; no write needed; no files changed.
- the-real-princess: accepted from dry-run; no write needed; no files changed.
- the-secret-garden-gutenberg-113: accepted from dry-run; no write needed; no files changed.
- the-shoes-of-fortune: accepted from dry-run; no write needed; no files changed.
- wind-in-the-willows: accepted from dry-run; no write needed; no files changed.

## Corrected Books

- candide: 8 -> 30 sections; preview public/book-previews/candide.preview.json
- crime-and-punishment: 47 -> 40 sections; preview public/book-previews/crime-and-punishment.preview.json
- gulliver-s-travels: 49 -> 39 sections; preview public/book-previews/gulliver-s-travels.preview.json
- the-call-of-cthulhu: 4 -> 3 sections; preview public/book-previews/the-call-of-cthulhu.preview.json
- the-emerald-city-of-oz: 11 -> 30 sections; preview public/book-previews/the-emerald-city-of-oz.preview.json
- the-old-house: 5 -> 9 sections; preview public/book-previews/the-old-house.preview.json
- the-snow-queen: 4 -> 7 sections; preview public/book-previews/the-snow-queen.preview.json
- the-swineherd: 2 -> 1 sections; preview public/book-previews/the-swineherd.preview.json
- treasure-island: 14 -> 34 sections; preview public/book-previews/treasure-island.preview.json

## Skipped Books

- None

## Boundary And Cleanup Notes

- anna-karenina: start unchanged (Accepted from dry-run; no write needed.); end unchanged (Accepted from dry-run; no write needed.); cleanup not rewritten.
- anne-of-green-gables-gutenberg-45: start unchanged (Accepted from dry-run; no write needed.); end unchanged (Accepted from dry-run; no write needed.); cleanup not rewritten.
- candide: start 316 (Chapter I is the first main readable chapter after title pages, publisher material, introduction, contents, and illustration caption.); end 4147 (Chapter XXX closes before the footnotes and Project Gutenberg footer.); cleanup removed 0 image lines, 0 decorative lines, and 35 numbered references.
- crime-and-punishment: start 140 (Part I Chapter I is the first main readable chapter after title, translator/front matter, and part heading.); end 22097 (The epilogue closes before the Project Gutenberg footer.); cleanup removed 0 image lines, 5 decorative lines, and 0 numbered references.
- gulliver-s-travels: start 256 (Part I Chapter I is the first main travel narrative chapter after title, contents, publisher note, and prefatory letter.); end 9546 (Part IV Chapter XII closes before footnotes and the Project Gutenberg footer.); cleanup removed 0 image lines, 0 decorative lines, and 0 numbered references.
- the-bell: start unchanged (Accepted from dry-run; no write needed.); end unchanged (Accepted from dry-run; no write needed.); cleanup not rewritten.
- the-call-of-cthulhu: start 60 (The first numbered story section follows the Gutenberg header, title/author lines, transcriber's note, epigraph, illustration caption, and footnote.); end 1253 (The third story section ends immediately before the Project Gutenberg footer.); cleanup removed 0 image lines, 10 decorative lines, and 0 numbered references.
- the-elderbush: start unchanged (Accepted from dry-run; no write needed.); end unchanged (Accepted from dry-run; no write needed.); cleanup not rewritten.
- the-emerald-city-of-oz: start 119 (Chapter 1 is the first main readable chapter after title, contents, and Baum's prefatory note.); end 6969 (Chapter 30 closes before the Project Gutenberg footer.); cleanup removed 0 image lines, 0 decorative lines, and 0 numbered references.
- the-emperor-s-new-clothes: start unchanged (Accepted from dry-run; no write needed.); end unchanged (Accepted from dry-run; no write needed.); cleanup not rewritten.
- the-fir-tree: start unchanged (Accepted from dry-run; no write needed.); end unchanged (Accepted from dry-run; no write needed.); cleanup not rewritten.
- the-leap-frog: start unchanged (Accepted from dry-run; no write needed.); end unchanged (Accepted from dry-run; no write needed.); cleanup not rewritten.
- the-old-house: start 44 (The Old House is the first story heading after the Gutenberg header and collection title.); end 1932 (The final story in this source file ends before the Project Gutenberg footer.); cleanup removed 0 image lines, 0 decorative lines, and 0 numbered references.
- the-real-princess: start unchanged (Accepted from dry-run; no write needed.); end unchanged (Accepted from dry-run; no write needed.); cleanup not rewritten.
- the-secret-garden-gutenberg-113: start unchanged (Accepted from dry-run; no write needed.); end unchanged (Accepted from dry-run; no write needed.); cleanup not rewritten.
- the-shoes-of-fortune: start unchanged (Accepted from dry-run; no write needed.); end unchanged (Accepted from dry-run; no write needed.); cleanup not rewritten.
- the-snow-queen: start 140 (Story the First is the first main Snow Queen section after title, copyright, preface, and wrapper title.); end 1317 (The seventh story ends at the final summer paragraph before trailing blanks.); cleanup removed 5 image lines, 0 decorative lines, and 0 numbered references.
- the-swineherd: start 43 (The Swineherd is the first and only story heading after the Gutenberg header and collection title.); end 249 (The story closes before the Project Gutenberg footer/license block.); cleanup removed 0 image lines, 0 decorative lines, and 0 numbered references.
- treasure-island: start 143 (Chapter I is the first main readable chapter after title, dedication, poem, contents, and part heading.); end 7508 (Chapter XXXIV closes before the Project Gutenberg footer.); cleanup removed 0 image lines, 0 decorative lines, and 0 numbered references.
- wind-in-the-willows: start unchanged (Accepted from dry-run; no write needed.); end unchanged (Accepted from dry-run; no write needed.); cleanup not rewritten.

## Generated Output Files Changed

- app/client/assets/books/generated/candide/manifest.json
- app/client/assets/books/generated/candide/cleaned_book.json
- app/client/assets/books/generated/candide/processed_book.json
- app/client/assets/books/generated/candide/rights_report.json
- app/client/assets/books/generated/candide/processing_notes.md
- app/client/assets/books/generated/candide/sections/chapter-001.json
- app/client/assets/books/generated/candide/sections/chapter-002.json
- app/client/assets/books/generated/candide/sections/chapter-003.json
- app/client/assets/books/generated/candide/sections/chapter-004.json
- app/client/assets/books/generated/candide/sections/chapter-005.json
- app/client/assets/books/generated/candide/sections/chapter-006.json
- app/client/assets/books/generated/candide/sections/chapter-007.json
- app/client/assets/books/generated/candide/sections/chapter-008.json
- app/client/assets/books/generated/candide/sections/chapter-009.json
- app/client/assets/books/generated/candide/sections/chapter-010.json
- app/client/assets/books/generated/candide/sections/chapter-011.json
- app/client/assets/books/generated/candide/sections/chapter-012.json
- app/client/assets/books/generated/candide/sections/chapter-013.json
- app/client/assets/books/generated/candide/sections/chapter-014.json
- app/client/assets/books/generated/candide/sections/chapter-015.json
- app/client/assets/books/generated/candide/sections/chapter-016.json
- app/client/assets/books/generated/candide/sections/chapter-017.json
- app/client/assets/books/generated/candide/sections/chapter-018.json
- app/client/assets/books/generated/candide/sections/chapter-019.json
- app/client/assets/books/generated/candide/sections/chapter-020.json
- app/client/assets/books/generated/candide/sections/chapter-021.json
- app/client/assets/books/generated/candide/sections/chapter-022.json
- app/client/assets/books/generated/candide/sections/chapter-023.json
- app/client/assets/books/generated/candide/sections/chapter-024.json
- app/client/assets/books/generated/candide/sections/chapter-025.json
- app/client/assets/books/generated/candide/sections/chapter-026.json
- app/client/assets/books/generated/candide/sections/chapter-027.json
- app/client/assets/books/generated/candide/sections/chapter-028.json
- app/client/assets/books/generated/candide/sections/chapter-029.json
- app/client/assets/books/generated/candide/sections/chapter-030.json
- app/client/assets/books/generated/crime-and-punishment/manifest.json
- app/client/assets/books/generated/crime-and-punishment/cleaned_book.json
- app/client/assets/books/generated/crime-and-punishment/processed_book.json
- app/client/assets/books/generated/crime-and-punishment/rights_report.json
- app/client/assets/books/generated/crime-and-punishment/processing_notes.md
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-001.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-002.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-003.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-004.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-005.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-006.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-007.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-008.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-009.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-010.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-011.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-012.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-013.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-014.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-015.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-016.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-017.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-018.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-019.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-020.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-021.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-022.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-023.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-024.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-025.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-026.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-027.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-028.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-029.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-030.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-031.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-032.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-033.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-034.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-035.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-036.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-037.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-038.json
- app/client/assets/books/generated/crime-and-punishment/sections/chapter-039.json
- app/client/assets/books/generated/crime-and-punishment/sections/epilogue-001.json
- app/client/assets/books/generated/gulliver-s-travels/manifest.json
- app/client/assets/books/generated/gulliver-s-travels/cleaned_book.json
- app/client/assets/books/generated/gulliver-s-travels/processed_book.json
- app/client/assets/books/generated/gulliver-s-travels/rights_report.json
- app/client/assets/books/generated/gulliver-s-travels/processing_notes.md
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-001.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-002.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-003.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-004.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-005.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-006.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-007.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-008.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-009.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-010.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-011.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-012.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-013.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-014.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-015.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-016.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-017.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-018.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-019.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-020.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-021.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-022.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-023.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-024.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-025.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-026.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-027.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-028.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-029.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-030.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-031.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-032.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-033.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-034.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-035.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-036.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-037.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-038.json
- app/client/assets/books/generated/gulliver-s-travels/sections/chapter-039.json
- app/client/assets/books/generated/the-call-of-cthulhu/manifest.json
- app/client/assets/books/generated/the-call-of-cthulhu/cleaned_book.json
- app/client/assets/books/generated/the-call-of-cthulhu/processed_book.json
- app/client/assets/books/generated/the-call-of-cthulhu/rights_report.json
- app/client/assets/books/generated/the-call-of-cthulhu/processing_notes.md
- app/client/assets/books/generated/the-call-of-cthulhu/sections/chapter-001.json
- app/client/assets/books/generated/the-call-of-cthulhu/sections/chapter-002.json
- app/client/assets/books/generated/the-call-of-cthulhu/sections/chapter-003.json
- app/client/assets/books/generated/the-emerald-city-of-oz/manifest.json
- app/client/assets/books/generated/the-emerald-city-of-oz/cleaned_book.json
- app/client/assets/books/generated/the-emerald-city-of-oz/processed_book.json
- app/client/assets/books/generated/the-emerald-city-of-oz/rights_report.json
- app/client/assets/books/generated/the-emerald-city-of-oz/processing_notes.md
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-001.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-002.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-003.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-004.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-005.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-006.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-007.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-008.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-009.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-010.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-011.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-012.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-013.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-014.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-015.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-016.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-017.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-018.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-019.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-020.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-021.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-022.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-023.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-024.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-025.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-026.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-027.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-028.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-029.json
- app/client/assets/books/generated/the-emerald-city-of-oz/sections/chapter-030.json
- app/client/assets/books/generated/the-old-house/manifest.json
- app/client/assets/books/generated/the-old-house/cleaned_book.json
- app/client/assets/books/generated/the-old-house/processed_book.json
- app/client/assets/books/generated/the-old-house/rights_report.json
- app/client/assets/books/generated/the-old-house/processing_notes.md
- app/client/assets/books/generated/the-old-house/sections/chapter-001.json
- app/client/assets/books/generated/the-old-house/sections/chapter-002.json
- app/client/assets/books/generated/the-old-house/sections/chapter-003.json
- app/client/assets/books/generated/the-old-house/sections/chapter-004.json
- app/client/assets/books/generated/the-old-house/sections/chapter-005.json
- app/client/assets/books/generated/the-old-house/sections/chapter-006.json
- app/client/assets/books/generated/the-old-house/sections/chapter-007.json
- app/client/assets/books/generated/the-old-house/sections/chapter-008.json
- app/client/assets/books/generated/the-old-house/sections/chapter-009.json
- app/client/assets/books/generated/the-snow-queen/manifest.json
- app/client/assets/books/generated/the-snow-queen/cleaned_book.json
- app/client/assets/books/generated/the-snow-queen/processed_book.json
- app/client/assets/books/generated/the-snow-queen/rights_report.json
- app/client/assets/books/generated/the-snow-queen/processing_notes.md
- app/client/assets/books/generated/the-snow-queen/sections/chapter-001.json
- app/client/assets/books/generated/the-snow-queen/sections/chapter-002.json
- app/client/assets/books/generated/the-snow-queen/sections/chapter-003.json
- app/client/assets/books/generated/the-snow-queen/sections/chapter-004.json
- app/client/assets/books/generated/the-snow-queen/sections/chapter-005.json
- app/client/assets/books/generated/the-snow-queen/sections/chapter-006.json
- app/client/assets/books/generated/the-snow-queen/sections/chapter-007.json
- app/client/assets/books/generated/the-swineherd/manifest.json
- app/client/assets/books/generated/the-swineherd/cleaned_book.json
- app/client/assets/books/generated/the-swineherd/processed_book.json
- app/client/assets/books/generated/the-swineherd/rights_report.json
- app/client/assets/books/generated/the-swineherd/processing_notes.md
- app/client/assets/books/generated/the-swineherd/sections/chapter-001.json
- app/client/assets/books/generated/treasure-island/manifest.json
- app/client/assets/books/generated/treasure-island/cleaned_book.json
- app/client/assets/books/generated/treasure-island/processed_book.json
- app/client/assets/books/generated/treasure-island/rights_report.json
- app/client/assets/books/generated/treasure-island/processing_notes.md
- app/client/assets/books/generated/treasure-island/sections/chapter-001.json
- app/client/assets/books/generated/treasure-island/sections/chapter-002.json
- app/client/assets/books/generated/treasure-island/sections/chapter-003.json
- app/client/assets/books/generated/treasure-island/sections/chapter-004.json
- app/client/assets/books/generated/treasure-island/sections/chapter-005.json
- app/client/assets/books/generated/treasure-island/sections/chapter-006.json
- app/client/assets/books/generated/treasure-island/sections/chapter-007.json
- app/client/assets/books/generated/treasure-island/sections/chapter-008.json
- app/client/assets/books/generated/treasure-island/sections/chapter-009.json
- app/client/assets/books/generated/treasure-island/sections/chapter-010.json
- app/client/assets/books/generated/treasure-island/sections/chapter-011.json
- app/client/assets/books/generated/treasure-island/sections/chapter-012.json
- app/client/assets/books/generated/treasure-island/sections/chapter-013.json
- app/client/assets/books/generated/treasure-island/sections/chapter-014.json
- app/client/assets/books/generated/treasure-island/sections/chapter-015.json
- app/client/assets/books/generated/treasure-island/sections/chapter-016.json
- app/client/assets/books/generated/treasure-island/sections/chapter-017.json
- app/client/assets/books/generated/treasure-island/sections/chapter-018.json
- app/client/assets/books/generated/treasure-island/sections/chapter-019.json
- app/client/assets/books/generated/treasure-island/sections/chapter-020.json
- app/client/assets/books/generated/treasure-island/sections/chapter-021.json
- app/client/assets/books/generated/treasure-island/sections/chapter-022.json
- app/client/assets/books/generated/treasure-island/sections/chapter-023.json
- app/client/assets/books/generated/treasure-island/sections/chapter-024.json
- app/client/assets/books/generated/treasure-island/sections/chapter-025.json
- app/client/assets/books/generated/treasure-island/sections/chapter-026.json
- app/client/assets/books/generated/treasure-island/sections/chapter-027.json
- app/client/assets/books/generated/treasure-island/sections/chapter-028.json
- app/client/assets/books/generated/treasure-island/sections/chapter-029.json
- app/client/assets/books/generated/treasure-island/sections/chapter-030.json
- app/client/assets/books/generated/treasure-island/sections/chapter-031.json
- app/client/assets/books/generated/treasure-island/sections/chapter-032.json
- app/client/assets/books/generated/treasure-island/sections/chapter-033.json
- app/client/assets/books/generated/treasure-island/sections/chapter-034.json
- app/client/assets/books/generated/library-manifest.json

## Preview Assets Changed

- public/book-previews/candide.preview.json
- public/book-previews/crime-and-punishment.preview.json
- public/book-previews/gulliver-s-travels.preview.json
- public/book-previews/the-call-of-cthulhu.preview.json
- public/book-previews/the-emerald-city-of-oz.preview.json
- public/book-previews/the-old-house.preview.json
- public/book-previews/the-snow-queen.preview.json
- public/book-previews/the-swineherd.preview.json
- public/book-previews/treasure-island.preview.json
- public/book-previews/manifest.json

## Future Batch Rule

Future book batches fail unless each processed book has:

- valid generated readable content
- first default section from real readable content
- all main readable sections included by default
- valid book-specific startup preview
- no SOS Help!
- no generic preview fallback
- no title/TOC/source/license/contributor/transcriber material as default playback

## Confirmations

- app/client/assets/temp-books was read only and not modified.
- app/client/assets/books/cloudflare-export was not modified.
- No all-book processing or `npm run books:build` was run by this script.
- The 11 already-acceptable dry-run books were inspected and not rewritten.
- Generated output and preview assets were changed only for corrected batch-5 books plus required manifests and write reports.
