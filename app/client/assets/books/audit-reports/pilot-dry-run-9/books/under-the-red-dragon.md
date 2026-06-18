# Pilot Dry Run 9: under-the-red-dragon

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/Under the Red Dragon.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Under the Red Dragon: A Novel
- Title evidence: Gutenberg Title line line 11 - Title: Under the Red Dragon: A Novel
- Expected author: James Grant
- Author evidence: Gutenberg Author line line 13 - Author: James Grant
- Apparent work type: standalone book
- Detected structural convention: chapter-based roman numerals
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1: --THE INVITATION
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at cleaned-body line 95: CHAPTER I.--THE INVITATION.
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Chapter plus Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 61 planned chapter-based roman numerals sections unless a future write inspection demotes true front/back matter
- Likely section count: 61
- Expected preview start: "And _she_ is to be there--nay, is there already; so one more chance is given me to meet her. But for what?--to part again silently, and more helplessly bewitched than ever, perhaps. Ah, never will she learn to love me as I love her!" thought I, as I turned over my old friend's letter, not venturing, however, to giv...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- contents or list material must not enter default playback
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default
- footnotes or page markers may need cleanup before default playback

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback

## Segmentation Risks

- later ordinal headings are present; verify Chapter/Part/Book 1 remains included and selected first

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- footnotes or page markers detected

## Supporting Snippets

- Title: Title: Under the Red Dragon: A Novel
- Author: Author: James Grant
- Start: Chapter 1: --THE INVITATION "And _she_ is to be there--nay, is there already; so one more chance is given me to meet her. But for what?--to part again silently, and more helplessly bewitched than ever, perhaps. Ah, never will she learn to love me as I love her!" thought I, as I turned over my old friend's letter, not venturing, however, to giv...
- End: was left in the rear, tied to a powder caisson; but he broke loose, came to the front at full gallop, and was recaptured under fire; the soldiers afterwards attached to his collar a copper medal, made from a pan found among the captured cooking utensils of General Coronini. His death was formally announced by the ar...

## Heading Examples

- L95: CHAPTER I.--THE INVITATION.
- L336: CHAPTER II.--THE MOTH AND THE CANDLE.
- L559: CHAPTER III--By EXPRESS.
- L787: CHAPTER IV.--WINNY AND DORA LLOYD.
- L1065: CHAPTER V.--CRAIGADERYN COURT.
- L1330: CHAPTER VI.--THREE GRACES.
