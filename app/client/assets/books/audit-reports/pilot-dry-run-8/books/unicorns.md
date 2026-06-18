# Pilot Dry Run 8: unicorns

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/Unicorns.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Unicorns
- Title evidence: Gutenberg Title line line 11 - Title: Unicorns
- Expected author: James Huneker
- Author evidence: Gutenberg Author line line 13 - Author: James Huneker
- Apparent work type: essay/nonfiction
- Detected structural convention: chapter-based roman numerals
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Expected start boundary: start at cleaned-body line 178: CHAPTER I
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Chapter plus Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 28 planned chapter-based roman numerals sections unless a future write inspection demotes true front/back matter
- Likely section count: 28
- Expected preview start: IN PRAISE OF UNICORNS "The Lion and the Unicorn were fighting for the crown: The Lion beat the Unicorn all round the town." ... In the golden book of wit and wisdom, Through the Looking-Glass, the Unicorn rather disdainfully remarks that he had believed children to be fabulous monsters. Alice smilingly retorts: "Do...
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

- Title: Title: Unicorns
- Author: Author: James Huneker
- Start: CHAPTER I IN PRAISE OF UNICORNS "The Lion and the Unicorn were fighting for the crown: The Lion beat the Unicorn all round the town." ... In the golden book of wit and wisdom, Through the Looking-Glass, the Unicorn rather disdainfully remarks that he had believed children to be fabulous monsters. Alice smilingly retorts: "Do...
- End: RANK JEWETT MATHER, Jr., in _New York Nation_ and _Evening Post_. * * * * * EGOISTS _WITH PORTRAIT AND FACSIMILE REPRODUCTIONS_ 12mo. $1.50 net "Closely and yet lightly written, full of facts, yet as amusing as a bit of discursive talk, penetrating, candid, and very shrewd." --ROYAL CORTISSOZ, in the _New York Tribu...

## Heading Examples

- L178: CHAPTER I
- L560: CHAPTER III
- L914: CHAPTER IV
- L1388: CHAPTER V
- L2064: CHAPTER VII
- L2385: CHAPTER VIII
