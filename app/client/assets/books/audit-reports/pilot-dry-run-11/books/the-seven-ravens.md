# Pilot Dry Run 11: the-seven-ravens

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE SEVEN RAVENS.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Seven Ravens
- Title evidence: source body heading line 44 - THE SEVEN RAVENS
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: The Seven Ravens
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: There was once a man who had seven sons
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: There was once a man who had seven sons, and last of all one daughter. Although the little girl was very pretty, she was so weak and small that they thought she could not live; but they said she should at once be christened. So the father sent one of his sons in haste to the spring to get some water, but the other s...
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

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: THE SEVEN RAVENS
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: The Seven Ravens There was once a man who had seven sons, and last of all one daughter. Although the little girl was very pretty, she was so weak and small that they thought she could not live; but they said she should at once be christened. So the father sent one of his sons in haste to the spring to get some water, but the other s...
- End: le glass?? ?Caw! Caw! well I ween Mortal lips have this way been.? When the seventh came to the bottom of his glass, and found there the ring, he looked at it, and knew that it was his father?s and mother?s, and said, ?O that our little sister would but come! then we should be free.? When the little girl heard this...

## Heading Examples

- First readable prose: There was once a man who had seven sons
