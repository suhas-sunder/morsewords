# Pilot Dry Run 7: the-green-mummy

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Green Mummy.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Green Mummy
- Title evidence: Gutenberg Title line line 11 - Title: The Green Mummy
- Expected author: Fergus Hume
- Author evidence: Gutenberg Author line line 13 - Author: Fergus Hume
- Apparent work type: standalone book
- Detected structural convention: chapter-based roman numerals
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1: THE LOVERS
- Expected start boundary: start at cleaned-body line 70: CHAPTER I. THE LOVERS
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Chapter plus Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 27 detected chapter-based roman numerals sections unless a future write inspection demotes true front/back matter
- Likely section count: 27
- Expected preview start: ?I am very angry,? pouted the maid.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- contents or list material must not enter default playback
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

- Title: Title: The Green Mummy
- Author: Author: Fergus Hume
- Start: CHAPTER I. THE LOVERS ?I am very angry,? pouted the maid.
- End: revolver. Meanwhile Hervey got away from Date, as the constables came pounding down the jetty and on to the beach. ?Chuck the mummy and nigger overboard and make for the ship,? he yelled, swimming with long strokes towards the boat. This order was quite to the sailors' minds, as they had not reckoned on such a fight...

## Heading Examples

- L70: CHAPTER I. THE LOVERS
- L553: CHAPTER II. PROFESSOR BRADDOCK
- L922: CHAPTER III. A MYSTERIOUS TOMB
- L1222: CHAPTER IV. THE UNEXPECTED
- L1586: CHAPTER V. MYSTERY
- L1879: CHAPTER VI. THE INQUEST
