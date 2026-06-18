# Pilot Dry Run 10: the-time-machine

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Time Machine.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Time Machine
- Title evidence: Gutenberg Title line line 11 - Title: The Time Machine
- Expected author: H. G. Wells
- Author evidence: Gutenberg Author line line 13 - Author: H. G. Wells
- Apparent work type: standalone book
- Detected structural convention: standalone roman numeral sections with verified Chapter I override
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: I. Introduction
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at I. Introduction: The Time Traveller (for so it will be convenient
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use the 15 roman numeral sections beginning with I. Introduction; exclude the leading contents list and Gutenberg wrapper; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 15 planned standalone roman numeral sections with verified Chapter I override sections unless a future write inspection demotes true front/back matter
- Likely section count: 15
- Expected preview start: The Time Traveller (for so it will be convenient to speak of him) was expounding a recondite matter to us. His pale grey eyes shone and twinkled, and his usually pale face was flushed and animated. The fire burnt brightly, and the soft radiance of the incandescent lights in the lilies of silver caught the bubbles th...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- contents or list material must not enter default playback
- Project Gutenberg/source/license material must be removed

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback

## Segmentation Risks

- structure audit recommends processing with warnings; write pass must verify boundaries directly from raw source
- later ordinal headings are present; verify Chapter/Part/Book 1 remains included and selected first
- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Title: The Time Machine
- Author: Author: H. G. Wells
- Start: I. Introduction The Time Traveller (for so it will be convenient to speak of him) was expounding a recondite matter to us. His pale grey eyes shone and twinkled, and his usually pale face was flushed and animated. The fire burnt brightly, and the soft radiance of the incandescent lights in the lilies of silver caught the bubbles th...
- End: wearisome problems solved? Into the manhood of the race: for I, for my own part, cannot think that these latter days of weak experiment, fragmentary theory, and mutual discord are indeed man?s culminating time! I say, for my own part. He, I know?for the question had been discussed among us long before the Time Machi...

## Heading Examples

- I. Introduction
- II. The Machine
- III. The Time Traveller Returns
