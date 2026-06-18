# Pilot Dry Run 7: howards-end

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/Howards End.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Howards End
- Title evidence: Gutenberg Title line line 11 - Title: Howards End
- Expected author: E. M. Forster
- Author evidence: Gutenberg Author line line 13 - Author: E. M. Forster
- Apparent work type: standalone book
- Detected structural convention: chapter-based roman numerals
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Expected start boundary: start at cleaned-body line 6: CHAPTER I
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Chapter plus Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 40 detected chapter-based roman numerals sections unless a future write inspection demotes true front/back matter
- Likely section count: 40
- Expected preview start: One may as well begin with Helen?s letters to her sister.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Title: Howards End
- Author: Author: E. M. Forster
- Start: CHAPTER I One may as well begin with Helen?s letters to her sister.
- End: ation. It seemed the last touch of his callousness. Being very much wrought up by this time--and Mrs. Bast was upstairs. I had not seen her, and had talked for a long time to Leonard--I had snubbed him for no reason, and that should have warned me I was in danger. So when the notes came I wanted us to go to you for...

## Heading Examples

- L6: CHAPTER I
- L132: CHAPTER II
- L391: CHAPTER III
- L797: CHAPTER IV
- L1072: CHAPTER V
- L1612: CHAPTER VI
