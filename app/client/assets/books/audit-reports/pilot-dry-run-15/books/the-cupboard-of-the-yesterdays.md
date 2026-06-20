# Pilot Dry Run 15: the-cupboard-of-the-yesterdays

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE CUPBOARD OF THE YESTERDAYS.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Cupboard of the Yesterdays
- Title evidence: source body heading line 62 - THE CUPBOARD OF THE YESTERDAYS
- Expected author: Saki
- Author evidence: Gutenberg Author line line 13 - Author: Saki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Cupboard of the Yesterdays
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: “War is a cruelly destructive thing,” said the Wanderer, dropping his
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: ?War is a cruelly destructive thing,? said the Wanderer, dropping his newspaper to the floor and staring reflectively into space. ?Ah, yes, indeed,? said the Merchant, responding readily to what seemed like a safe platitude; ?when one thinks of the loss of life and limb, the desolated homesteads, the ruined?? ?I was...
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

- Title: THE CUPBOARD OF THE YESTERDAYS
- Author: Author: Saki
- Start: The Cupboard of the Yesterdays ?War is a cruelly destructive thing,? said the Wanderer, dropping his newspaper to the floor and staring reflectively into space. ?Ah, yes, indeed,? said the Merchant, responding readily to what seemed like a safe platitude; ?when one thinks of the loss of life and limb, the desolated homesteads, the ruined?? ?I was...
- End: ...he piquancy of the incident was not within striking distance of his comprehension. “I should have been shocked at hearing such a thing about any one I had known,” he said. “The present war,” continued his companion, without stopping to discuss two hopelessly divergent points of view, “may be the beginning of the end

## Heading Examples

- Source tale heading: THE CUPBOARD OF THE YESTERDAYS
- First readable prose: ?War is a cruelly destructive thing,? said the Wanderer, dropping his
