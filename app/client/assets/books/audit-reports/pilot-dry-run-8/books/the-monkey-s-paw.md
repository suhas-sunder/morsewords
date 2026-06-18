# Pilot Dry Run 8: the-monkey-s-paw

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Monkey's Paw.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Monkey's Paw
- Title evidence: Gutenberg Title line line 11 - Title: The Monkey's Paw
- Expected author: W. W. Jacobs
- Author evidence: Gutenberg Author line line 13 - Author: W. W. Jacobs
- Apparent work type: standalone book
- Detected structural convention: standalone roman numeral sections
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Expected start boundary: start at cleaned-body line 13: I.
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Standalone Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 3 planned standalone roman numeral sections sections unless a future write inspection demotes true front/back matter
- Likely section count: 3
- Expected preview start: Without, the night was cold and wet, but in the small parlour of Laburnam Villa the blinds were drawn and the fire burned brightly. Father and son were at chess, the former, who possessed ideas about the game involving radical changes, putting his king into such sharp and unnecessary perils that it even provoked com...
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
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

- Title: Title: The Monkey's Paw
- Author: Author: W. W. Jacobs
- Start: I. Without, the night was cold and wet, but in the small parlour of Laburnam Villa the blinds were drawn and the fire burned brightly. Father and son were at chess, the former, who possessed ideas about the game involving radical changes, putting his king into such sharp and unnecessary perils that it even provoked com...
- End: eaking of the bolt as it came slowly back, and at the same moment he found the monkey?s paw, and frantically breathed his third and last wish. The knocking ceased suddenly, although the echoes of it were still in the house. He heard the chair drawn back, and the door opened. A cold wind rushed up the staircase, and...

## Heading Examples

- L13: I.
- L250: II.
- L375: III.
