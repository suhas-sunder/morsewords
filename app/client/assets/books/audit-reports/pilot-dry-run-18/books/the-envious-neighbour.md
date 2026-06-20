# Pilot Dry Run 18: the-envious-neighbour

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE ENVIOUS NEIGHBOUR.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Envious Neighbour
- Title evidence: source body heading line 52 - THE ENVIOUS NEIGHBOUR
- Expected author: Andrew Lang
- Author evidence: Gutenberg Author line line 13 - Author: Andrew Lang
- Expected author/compiler/collector/translator/reteller role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Metadata evidence: Gutenberg Author line line 13: Author: Andrew Lang; visible editor byline line 42: Edited By Andrew Lang
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Envious Neighbour
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Long, long ago an old couple lived in a village, and, as they had no
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Long, long ago an old couple lived in a village, and, as they had no children to love and care for, they gave all their affection to a little dog. He was a pretty little creature, and instead of growing spoilt and disagreeable at not getting everything he wanted, as even children will do sometimes, the dog was grate...
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

- future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: THE ENVIOUS NEIGHBOUR
- Author: Author: Andrew Lang
- Metadata: Author: Andrew Lang; Edited By Andrew Lang
- Start: The Envious Neighbour Long, long ago an old couple lived in a village, and, as they had no children to love and care for, they gave all their affection to a little dog. He was a pretty little creature, and instead of growing spoilt and disagreeable at not getting everything he wanted, as even children will do sometimes, the dog was grate...
- End: ...zed and bound and thrown into prison, where he was kept for many months. By the time he was set free everybody in his native village had found out his wickedness, and they would not let him live there any longer; and as he would not leave off his evil ways he soon went from bad to worse, and came to a miserable end.

## Heading Examples

- Source tale heading: THE ENVIOUS NEIGHBOUR
- First readable prose: Long, long ago an old couple lived in a village, and, as they had no
