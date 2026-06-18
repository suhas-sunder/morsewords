# Pilot Dry Run 8: the-wind-in-the-willows

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Wind in the Willows.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Wind in the Willows
- Title evidence: Gutenberg Title line line 11 - Title: The Wind in the Willows
- Expected author: Kenneth Grahame
- Author evidence: Gutenberg Author line line 13 - Author: Kenneth Grahame
- Apparent work type: standalone book
- Detected structural convention: standalone roman numeral sections
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Expected start boundary: start at cleaned-body line 94: I
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Standalone Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 12 planned standalone roman numeral sections sections unless a future write inspection demotes true front/back matter
- Likely section count: 12
- Expected preview start: THE RIVER BANK The Mole had been working very hard all the morning, spring-cleaning his little home. First with brooms, then with dusters; then on ladders and steps and chairs, with a brush and a pail of whitewash; till he had dust in his throat and eyes, and splashes of whitewash all over his black fur, and an achi...
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

- Title: Title: The Wind in the Willows
- Author: Author: Kenneth Grahame
- Start: I THE RIVER BANK The Mole had been working very hard all the morning, spring-cleaning his little home. First with brooms, then with dusters; then on ladders and steps and chairs, with a brush and a pail of whitewash; till he had dust in his throat and eyes, and splashes of whitewash all over his black fur, and an achi...
- End: uld be, running all ways at once, and falling over each other, and every one giving orders to everybody else and not listening; and the Sergeant kept sending off parties of stoats to distant parts of the grounds, and then sending other fellows to fetch 'em back again; and I heard them saying to each other, 'That's j...

## Heading Examples

- L94: I
- L581: II
- L1044: III
- L1519: IV
- L1996: V
- L2544: VI
