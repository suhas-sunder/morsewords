# Pilot Dry Run 7: king-arthur-and-the-knights-of-the-round-table

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/King Arthur and the Knights of the Round Table.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: King Arthur and the Knights of the Round Table
- Title evidence: Gutenberg Title line line 11 - Title: King Arthur and the Knights of the Round Table
- Expected author: Sir Thomas Malory
- Author evidence: Gutenberg Author line line 13 - Author: Sir Thomas Malory
- Apparent work type: standalone book
- Detected structural convention: standalone roman numeral sections
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Expected start boundary: start at cleaned-body line 363: I
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Standalone Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 15 detected standalone roman numeral sections sections unless a future write inspection demotes true front/back matter
- Likely section count: 15
- Expected preview start: King Vortigern the usurper sat upon his throne in London, when,
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

- Title: Title: King Arthur and the Knights of the Round Table
- Author: Author: Sir Thomas Malory
- Start: I King Vortigern the usurper sat upon his throne in London, when,
- End: put from the land, and when Sir Bedivere saw it departing, he cried with a bitter cry, "Alas! my lord King Arthur, what shall become of me now ye have gone from me?" "Comfort ye," said King Arthur, "and be strong, for I may no more help ye. I go to the Vale of Avilion to heal me of my grievous wound, and if ye see m...

## Heading Examples

- L363: I
- L693: II
- L1217: III
- L1681: IV
- L2087: V
- L2544: VI
