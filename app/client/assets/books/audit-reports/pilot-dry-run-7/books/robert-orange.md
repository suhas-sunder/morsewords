# Pilot Dry Run 7: robert-orange

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/Robert Orange.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Robert Orange
- Title evidence: Gutenberg Title line line 11 - Title: Robert Orange
- Expected author: John Oliver Hobbes
- Author evidence: Gutenberg Author line line 13 - Author: John Oliver Hobbes
- Apparent work type: standalone book
- Detected structural convention: chapter-based roman numerals
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Expected start boundary: start at cleaned-body line 22: CHAPTER I
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Chapter plus Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 30 detected chapter-based roman numerals sections unless a future write inspection demotes true front/back matter
- Likely section count: 30
- Expected preview start: One afternoon during the first weeks of October, 1869, while wind, dust,
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

- Title: Title: Robert Orange
- Author: Author: John Oliver Hobbes
- Start: CHAPTER I One afternoon during the first weeks of October, 1869, while wind, dust,
- End: casional roughness of style--elliptical, Carlyle mannerisms--the whole is admirably written."--_Westminster Gazette._ "Mr. Swift has the creative touch and a spark of genius."--_Manchester Guardian._ "Mr. Swift has held us interested from the first to the last page of his novel."--_World._ "The writer of 'Nancy Noon...

## Heading Examples

- L22: CHAPTER I
- L446: CHAPTER II
- L708: CHAPTER III
- L989: CHAPTER IV
- L1244: CHAPTER V
- L1665: CHAPTER VI
