# Pilot Dry Run 8: the-scarlet-letter

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Scarlet Letter.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Scarlet Letter
- Title evidence: Gutenberg Title line line 11 - Title: The Scarlet Letter
- Expected author: Nathaniel Hawthorne
- Author evidence: Gutenberg Author line line 13 - Author: Nathaniel Hawthorne
- Apparent work type: standalone book
- Detected structural convention: standalone roman numeral sections
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Expected start boundary: start at cleaned-body line 1568: I.
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Standalone Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 24 planned standalone roman numeral sections sections unless a future write inspection demotes true front/back matter
- Likely section count: 24
- Expected preview start: THE PRISON-DOOR. [Illustration] A throng of bearded men, in sad-colored garments, and gray, steeple-crowned hats, intermixed with women, some wearing hoods and others bareheaded, was assembled in front of a wooden edifice, the door of which was heavily timbered with oak, and studded with iron spikes. The founders of...
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- contents or list material must not enter default playback
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default
- illustration captions/placeholders must be removed from default playback
- footnotes or page markers may need cleanup before default playback

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- illustration captions/placeholders detected
- footnotes or page markers detected

## Supporting Snippets

- Title: Title: The Scarlet Letter
- Author: Author: Nathaniel Hawthorne
- Start: I. THE PRISON-DOOR. [Illustration] A throng of bearded men, in sad-colored garments, and gray, steeple-crowned hats, intermixed with women, some wearing hoods and others bareheaded, was assembled in front of a wooden edifice, the door of which was heavily timbered with oak, and studded with iron spikes. The founders of...
- End: ge 132?inserted a missing closing quote after ?a child of her age? page 137?spelling normalized: changed ?careworn? to ?care-worn? page 147?typo fixed: changed ?physican? to ?physician? page 171?typo fixed: changed ?vocies? to ?voices? page 262?removed an extra closing quote after ?scarlet letter too!? page 291?spel...

## Heading Examples

- L1568: I.
- L1627: II.
- L1967: III.
- L2298: IV.
- L2553: V.
- L2879: VI.
