# Pilot Dry Run 7: the-sea-lady

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Sea Lady.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Sea Lady
- Title evidence: Gutenberg Title line line 10 - Title: The Sea Lady
- Expected author: Herbert George Wells
- Author evidence: Gutenberg Author line line 12 - Author: Herbert George Wells
- Apparent work type: standalone book
- Detected structural convention: standalone roman numeral sections
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Expected start boundary: start at cleaned-body line 98: I
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Standalone Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 31 detected standalone roman numeral sections sections unless a future write inspection demotes true front/back matter
- Likely section count: 31
- Expected preview start: Such previous landings of mermaids as have left a record, have all a flavour of doubt. Even the very circumstantial account of that Bruges Sea Lady, who was so clever at fancy wor...
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

- Title: Title: The Sea Lady
- Author: Author: Herbert George Wells
- Start: I Such previous landings of mermaids as have left a record, have all a flavour of doubt. Even the very circumstantial account of that Bruges Sea Lady, who was so clever at fancy wor...
- End: by a momentary gleam of phosphorescence; and far out the lights of ships were shining bright and yellow. Across its shimmer a black fishing smack was gliding out of mystery into mystery. Dungeness shone from the west a pin-point of red light, and in the east the tireless glare of that great beacon on Gris-nez wheele...

## Heading Examples

- L98: I
- L195: II
- L242: I
- L281: II
- L290: III
- L355: IV
