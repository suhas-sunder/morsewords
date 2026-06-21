# Pilot Dry Run 22: the-beast-in-the-cave

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Beast in the Cave.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; modern source-site wrapper is marked All Rights Reserved and must be excluded from any future generated body; no generated publish status exists yet
- Expected title: The Beast in the Cave
- Title evidence: source body heading line 4 - The Beast in the Cave
- Expected author: H. P. Lovecraft
- Author evidence: visible byline line 5 - By H. P. Lovecraft
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: visible byline line 5: By H. P. Lovecraft
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: The Beast in the Cave
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg or source-site footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: The horrible conclusion which had been gradually obtruding itself
- Expected end boundary: end before Project Gutenberg or source-site footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: The horrible conclusion which had been gradually obtruding itself upon my confused and reluctant mind was now an awful certainty. I was lost, completely, hopelessly lost in the vast and labyrinthine recesses of the Mammoth Cave. Turn as I might, in no direction could my straining vision seize on any object capable o...
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

- author did not come from a Gutenberg Author line; verify byline directly

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: The Beast in the Cave
- Author: By H. P. Lovecraft
- Metadata: By H. P. Lovecraft
- Start: The Beast in the Cave The horrible conclusion which had been gradually obtruding itself upon my confused and reluctant mind was now an awful certainty. I was lost, completely, hopelessly lost in the vast and labyrinthine recesses of the Mammoth Cave. Turn as I might, in no direction could my straining vision seize on any object capable o...
- End: ...oor ahead. Then fear left, and wonder, awe, compassion, and reverence succeeded in its place, for the sounds uttered by the stricken figure that lay stretched out on the limestone had told us the awesome truth. The creature I had killed, the strange beast of the unfathomed cave was, or had at one time been, a MAN!!!

## Heading Examples

- Source tale heading: The Beast in the Cave
- First readable prose: The horrible conclusion which had been gradually obtruding itself
