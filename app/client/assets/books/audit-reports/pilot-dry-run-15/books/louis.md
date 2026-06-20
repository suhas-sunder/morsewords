# Pilot Dry Run 15: louis

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/LOUIS.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Louis
- Title evidence: source body heading line 63 - LOUIS
- Expected author: Saki
- Author evidence: Gutenberg Author line line 13 - Author: Saki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Louis
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: “It would be jolly to spend Easter in Vienna this year,” said
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: ?It would be jolly to spend Easter in Vienna this year,? said Strudwarden, ?and look up some of my old friends there. It?s about the jolliest place I know of to be at for Easter?? ?I thought we had made up our minds to spend Easter at Brighton,? interrupted Lena Strudwarden, with an air of aggrieved surprise. ?You m...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback

## Segmentation Risks

- structure audit recommends processing with warnings; write pass must verify boundaries directly from raw source
- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: LOUIS
- Author: Author: Saki
- Start: Louis ?It would be jolly to spend Easter in Vienna this year,? said Strudwarden, ?and look up some of my old friends there. It?s about the jolliest place I know of to be at for Easter?? ?I thought we had made up our minds to spend Easter at Brighton,? interrupted Lena Strudwarden, with an air of aggrieved surprise. ?You m...
- End: ...to be stuffed; that will be my Easter gift to you instead of the buckles. For Heaven’s sake, Lena, weep, if you really feel it so much; anything would be better than standing there staring as if you thought I had lost my reason.” Lena Strudwarden did not weep, but her attempt at laughing was an unmistakable failure.

## Heading Examples

- Source tale heading: LOUIS
- First readable prose: ?It would be jolly to spend Easter in Vienna this year,? said
