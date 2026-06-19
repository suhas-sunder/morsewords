# Pilot Dry Run 12: little-ida-s-flowers

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/LITTLE IDA'S FLOWERS.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Little Ida's Flowers
- Title evidence: source body heading line 137 - LITTLE IDA'S FLOWERS
- Expected author: H. C. Andersen
- Author evidence: Gutenberg Author line line 13 - Author: H. C. Andersen
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: Little Ida's Flowers
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: "MY POOR flowers are quite faded
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: "MY POOR flowers are quite faded!" said little Ida. "Only yesterday evening they were so pretty, and now all the leaves are drooping. Why do they do that?" she asked of the student, who sat on the sofa. He was a great favorite with her, because he used to tell her the prettiest of stories and cut out the most amusin...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default
- illustration captions/placeholders must be removed from default playback

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

- illustration captions/placeholders detected

## Supporting Snippets

- Title: LITTLE IDA'S FLOWERS
- Author: Author: H. C. Andersen
- Start: Little Ida's Flowers "MY POOR flowers are quite faded!" said little Ida. "Only yesterday evening they were so pretty, and now all the leaves are drooping. Why do they do that?" she asked of the student, who sat on the sofa. He was a great favorite with her, because he used to tell her the prettiest of stories and cut out the most amusin...
- End: each a new crossbow, which they brought with them to show to Ida. She told them of the poor flowers that were dead and were to be buried in the garden. So the two boys walked in front, with their bows slung across their shoulders, and little Ida followed, carrying the dead flowers in their pretty coffin. A little gr...

## Heading Examples

- First readable prose: "MY POOR flowers are quite faded
