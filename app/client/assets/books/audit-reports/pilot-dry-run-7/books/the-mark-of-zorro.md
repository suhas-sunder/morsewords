# Pilot Dry Run 7: the-mark-of-zorro

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The mark of Zorro.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The mark of Zorro
- Title evidence: Gutenberg Title line line 11 - Title: The mark of Zorro
- Expected author: Johnston McCulley
- Author evidence: Gutenberg Author line line 13 - Author: Johnston McCulley
- Apparent work type: standalone book
- Detected structural convention: chapter-based roman numerals
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Expected start boundary: start at cleaned-body line 109: CHAPTER I
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Chapter plus Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 39 detected chapter-based roman numerals sections unless a future write inspection demotes true front/back matter
- Likely section count: 39
- Expected preview start: Again the sheet of rain beat against the roof of red Spanish tile, and
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- contents or list material must not enter default playback
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default
- illustration captions/placeholders must be removed from default playback

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- illustration captions/placeholders detected

## Supporting Snippets

- Title: Title: The mark of Zorro
- Author: Author: Johnston McCulley
- Start: CHAPTER I Again the sheet of rain beat against the roof of red Spanish tile, and
- End: fancied that I loved Se?or Zorro, but it comes to me now that I love the both of them," she said. "Is it not shameless? But I would rather have you Se?or Zorro than the old Don Diego I knew." "We shall endeavor to establish a golden mean," he replied, laughing again. "I shall drop the old languid ways and change gra...

## Heading Examples

- L109: CHAPTER I
- L299: CHAPTER II
- L534: CHAPTER III
- L697: CHAPTER IV
- L981: CHAPTER V
- L1147: CHAPTER VI
