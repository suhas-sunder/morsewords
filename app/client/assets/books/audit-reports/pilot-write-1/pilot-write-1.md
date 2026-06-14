# Pilot Write 1 Report

Controlled real pilot write pass for the approved seven-book subset from pilot dry-run 1.

## Summary

| Book | Status | Pass-2 risk | Sections | Recommendation |
| --- | --- | --- | ---: | --- |
| almayer-s-folly-a-story-of-an-eastern-river | written | low | 12 | accepted for review |
| the-house-without-a-key | written | low | 23 | accepted for review |
| the-lerouge-case | written | low | 20 | accepted for review |
| a-dream-of-armageddon | written | medium | 2 | needs manual review before scaling |
| a-journey-to-the-centre-of-the-earth | written | medium | 44 | needs manual review before scaling |
| a-journal-of-the-plague-year | written | medium | 18 | needs manual review before scaling |
| dracula | written | medium | 28 | needs manual review before scaling |

## Written Books

- almayer-s-folly-a-story-of-an-eastern-river
- the-house-without-a-key
- the-lerouge-case
- a-dream-of-armageddon
- a-journey-to-the-centre-of-the-earth
- a-journal-of-the-plague-year
- dracula

## Skipped Books

- None

## Safe For Review

- almayer-s-folly-a-story-of-an-eastern-river
- the-house-without-a-key
- the-lerouge-case

## Needs Warnings Before Scaling

- a-dream-of-armageddon: No chapter headings were detected; generated fallback parts instead.
- a-journey-to-the-centre-of-the-earth: review before scaling
- a-journal-of-the-plague-year: No chapter headings were detected; generated fallback parts instead.
- dracula: review before scaling

## Boundary Decisions

- almayer-s-folly-a-story-of-an-eastern-river: start line 63 (Starts at CHAPTER I after title, printing history, and dedication.); end line 6320 (Ends immediately before the Project Gutenberg end marker.).
- the-house-without-a-key: start line 66 (Starts at CHAPTER I after title page and dedication.); end line 11071 (Ends immediately before the Project Gutenberg end marker.).
- the-lerouge-case: start line 35 (Starts at CHAPTER I after Gutenberg header, title, and author lines.); end line 14329 (Ends immediately before the Project Gutenberg end marker.).
- a-dream-of-armageddon: start line 34 (Starts at the story title and skips the Gutenberg URL/source note.); end line 540 (Source file ends with the story text and has no separate license footer.).
- a-journey-to-the-centre-of-the-earth: start line 153 (Starts at CHAPTER 1 after the table of contents and source notes.); end line 10970 (Ends immediately before the Project Gutenberg end marker.).
- a-journal-of-the-plague-year: start line 51 (Starts at the first narrative paragraph after title page, subtitle, byline, and illustration placeholder.); end line 9525 (Ends immediately before the Project Gutenberg end marker.).
- dracula: start line 116 (Starts at CHAPTER I after title-page, dedication, table of contents, and opening editorial note.); end line 15436 (Ends at the novel's own THE END and excludes the publisher catalog.).

## Cleanup Applied

- almayer-s-folly-a-story-of-an-eastern-river: removed 0 image placeholder lines, 0 numbered references, 4 decorative lines, 0 standalone FINIS markers; Unicode normalized: false; dashes normalized: false.
- the-house-without-a-key: removed 0 image placeholder lines, 0 numbered references, 0 decorative lines, 0 standalone FINIS markers; Unicode normalized: false; dashes normalized: false.
- the-lerouge-case: removed 0 image placeholder lines, 0 numbered references, 0 decorative lines, 0 standalone FINIS markers; Unicode normalized: true; dashes normalized: false.
- a-dream-of-armageddon: removed 0 image placeholder lines, 0 numbered references, 0 decorative lines, 0 standalone FINIS markers; Unicode normalized: true; dashes normalized: true.
- a-journey-to-the-centre-of-the-earth: removed 4 image placeholder lines, 10 numbered references, 30 decorative lines, 0 standalone FINIS markers; Unicode normalized: false; dashes normalized: false.
- a-journal-of-the-plague-year: removed 1 image placeholder lines, 10 numbered references, 12 decorative lines, 1 standalone FINIS markers; Unicode normalized: true; dashes normalized: true.
- dracula: removed 0 image placeholder lines, 0 numbered references, 128 decorative lines, 0 standalone FINIS markers; Unicode normalized: true; dashes normalized: false.

## Existing Generated Output Damage

- dracula: Prior Dracula output included title-page/contents material and mojibake in readable sections; pilot write 1 regenerates from UTF-8 source, starts at CHAPTER I, excludes the publisher catalog, and keeps the final note outside default playback.

## Preview Assets

- almayer-s-folly-a-story-of-an-eastern-river: public/book-previews/almayer-s-folly-a-story-of-an-eastern-river.preview.json; preview sections chapter-001.
- the-house-without-a-key: public/book-previews/the-house-without-a-key.preview.json; preview sections chapter-001.
- the-lerouge-case: public/book-previews/the-lerouge-case.preview.json; preview sections chapter-001.
- a-dream-of-armageddon: public/book-previews/a-dream-of-armageddon.preview.json; preview sections part-001.
- a-journey-to-the-centre-of-the-earth: public/book-previews/a-journey-to-the-centre-of-the-earth.preview.json; preview sections chapter-001.
- a-journal-of-the-plague-year: public/book-previews/a-journal-of-the-plague-year.preview.json; preview sections part-001.
- dracula: public/book-previews/dracula.preview.json; preview sections chapter-001.

## Confirmations

- app/client/assets/temp-books was read only and not modified.
- app/client/assets/books/cloudflare-export was not modified.
- app/client/assets/books/generated was modified only for the written approved pilot books and the generated library manifest.
- public/book-previews was modified only for the written approved pilot books and the preview manifest.
- The individual-review books were not processed.
- npm run books:build was not run.

## Recommended Next Step

Review the seven generated book pages, section lists, and preview assets. If accepted, proceed to a small reviewed batch of five books using the same guarded writer pattern before any Cloudflare export.
