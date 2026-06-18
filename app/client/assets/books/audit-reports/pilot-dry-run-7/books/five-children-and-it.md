# Pilot Dry Run 7: five-children-and-it

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/Five Children and It.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Five Children and It
- Title evidence: Gutenberg Title line line 11 - Title: Five Children and It
- Expected author: E. Nesbit
- Author evidence: Gutenberg Author line line 13 - Author: E. Nesbit
- Apparent work type: standalone book
- Detected structural convention: chapter-based roman numerals
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Expected start boundary: start at cleaned-body line 197: CHAPTER I
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Chapter plus Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 10 detected chapter-based roman numerals sections unless a future write inspection demotes true front/back matter
- Likely section count: 10
- Expected preview start: The house was three miles from the station, but, before the dusty hired
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

- Title: Title: Five Children and It
- Author: Author: E. Nesbit
- Start: CHAPTER I The house was three miles from the station, but, before the dusty hired
- End: you like it, to be shut up in an iron cage with bars and padded walls, and nothing to do but stick straws in your hair all day, and listen to the howlings and ravings of the other maniacs? Make up your minds to it, all of you. It's no use telling mother." "But it's true," said Jane. "Of course it is, but it's not tr...

## Heading Examples

- L197: CHAPTER I
- L947: CHAPTER II
- L1644: CHAPTER III
- L2418: CHAPTER IV
- L3069: CHAPTER V
- L3472: CHAPTER VI
