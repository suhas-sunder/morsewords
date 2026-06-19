# Pilot Dry Run 11: the-juniper-tree

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE JUNIPER-TREE.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Juniper-Tree
- Title evidence: source body heading line 41 - THE JUNIPER-TREE
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: The Juniper-Tree
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Long, long ago, some two thousand years or so
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Long, long ago, some two thousand years or so, there lived a rich man with a good and beautiful wife. They loved each other dearly, but sorrowed much that they had no children. So greatly did they desire to have one, that the wife prayed for it day and night, but still they remained childless. In front of the house...
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

- Title: THE JUNIPER-TREE
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: The Juniper-Tree Long, long ago, some two thousand years or so, there lived a rich man with a good and beautiful wife. They loved each other dearly, but sorrowed much that they had no children. So greatly did they desire to have one, that the wife prayed for it day and night, but still they remained childless. In front of the house...
- End: lighten my misery, for I feel as if the world were coming to an end.? But as she crossed the threshold, crash! the bird threw the millstone down on her head, and she was crushed to death. The father and little Marleen heard the sound and ran out, but they only saw mist and flame and fire rising from the spot, and wh...

## Heading Examples

- First readable prose: Long, long ago, some two thousand years or so
