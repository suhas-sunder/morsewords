# Pilot Dry Run 10: the-inspector-french-s-greatest-case

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Inspector French’s Greatest Case.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Inspector French's Greatest Case
- Title evidence: Gutenberg Title line line 11 - Title: Inspector French's greatest case
- Expected author: Freeman Wills Crofts
- Author evidence: Gutenberg Author line line 13 - Author: Freeman Wills Crofts
- Apparent work type: standalone book
- Detected structural convention: chapter-based roman numerals
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at cleaned-body line 56: CHAPTER I
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Chapter plus Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 20 planned chapter-based roman numerals sections unless a future write inspection demotes true front/back matter
- Likely section count: 20
- Expected preview start: MURDER! THE back streets surrounding Hatton Garden, in the City of London, do not form at the best of times a cheerful or inspiring prospect. Narrow and mean, and flanked with ugly, sordid-looking buildings grimy from exposure to the smoke and fogs of the town and drab from the want of fresh paint, they can hardly f...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- contents or list material must not enter default playback
- Project Gutenberg/source/license material must be removed
- illustration captions/placeholders must be removed from default playback

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback

## Segmentation Risks

- later ordinal headings are present; verify Chapter/Part/Book 1 remains included and selected first

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- illustration captions/placeholders detected

## Supporting Snippets

- Title: Title: Inspector French's greatest case
- Author: Author: Freeman Wills Crofts
- Start: Chapter 1 MURDER! THE back streets surrounding Hatton Garden, in the City of London, do not form at the best of times a cheerful or inspiring prospect. Narrow and mean, and flanked with ugly, sordid-looking buildings grimy from exposure to the smoke and fogs of the town and drab from the want of fresh paint, they can hardly f...
- End: e particulars. ?Right,? he said. ?Next, please.? ?The next is Miss Bond. She?s also pretty well on in years, but she couldn?t be your friend because she?s at least four inches taller.? ?Very good.? ?Then there is Mrs. Brent. She is a young girl. Her husband is on board, and they are evidently newly married. She?s to...

## Heading Examples

- L56: CHAPTER I
- L535: CHAPTER II
- L920: CHAPTER III
- L1383: CHAPTER IV
- L1912: CHAPTER V
- L2328: CHAPTER VI
