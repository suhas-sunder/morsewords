# Pilot Dry Run 11: the-red-shoes

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Red Shoes.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Red Shoes
- Title evidence: source body heading line 43 - THE RED SHOES
- Expected author: H. C. Andersen
- Author evidence: Gutenberg Author line line 13 - Author: H. C. Andersen
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Red Shoes
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: There was once a little girl who was very pretty and delicate
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: There was once a little girl who was very pretty and delicate, but in summer she was forced to run about with bare feet, she was so poor, and in winter wear very large wooden shoes, which made her little insteps quite red, and that looked so dangerous! In the middle of the village lived old Dame Shoemaker; she sat a...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default

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

- Title: THE RED SHOES
- Author: Author: H. C. Andersen
- Start: The Red Shoes There was once a little girl who was very pretty and delicate, but in summer she was forced to run about with bare feet, she was so poor, and in winter wear very large wooden shoes, which made her little insteps quite red, and that looked so dangerous! In the middle of the village lived old Dame Shoemaker; she sat a...
- End: church. She sat in the pew with the clergyman's family, and when they had ended the psalm and looked up, they nodded and said, ?It is right that thou art come!? ?It was through mercy!? she said. And the organ pealed, and the children's voices in the choir sounded so sweet and soft! The clear sunshine streamed so war...

## Heading Examples

- First readable prose: There was once a little girl who was very pretty and delicate
