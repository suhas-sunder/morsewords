# Pilot Dry Run 18: virgilius-the-sorcerer

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/VIRGILIUS THE SORCERER.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Virgilius the Sorcerer
- Title evidence: source body heading line 52 - VIRGILIUS THE SORCERER
- Expected author: Andrew Lang
- Author evidence: Gutenberg Author line line 13 - Author: Andrew Lang
- Expected author/compiler/collector/translator/reteller role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Metadata evidence: Gutenberg Author line line 13: Author: Andrew Lang; visible editor byline line 42: Edited By Andrew Lang
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: Virgilius the Sorcerer
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Long, long ago there was born to a Roman knight and his wife Maja a
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Long, long ago there was born to a Roman knight and his wife Maja a little boy called Virgilius. While he was still quite little, his father died, and the kinsmen, instead of being a help and protection to the child and his mother, robbed them of their lands and money, and the widow, fearing that they might take the...
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

- Title: VIRGILIUS THE SORCERER
- Author: Author: Andrew Lang
- Metadata: Author: Andrew Lang; Edited By Andrew Lang
- Start: Virgilius the Sorcerer Long, long ago there was born to a Roman knight and his wife Maja a little boy called Virgilius. While he was still quite little, his father died, and the kinsmen, instead of being a help and protection to the child and his mother, robbed them of their lands and money, and the widow, fearing that they might take the...
- End: ...he bottle he placed an egg, and from the egg there hung chained an apple, which hangs there to this day. And when the egg shakes the city quakes, and when the egg shall be broken the city shall be destroyed. And the city Virgilius filled full of wonders, such as never were seen before, and he called its name Naples.

## Heading Examples

- Source tale heading: VIRGILIUS THE SORCERER
- First readable prose: Long, long ago there was born to a Roman knight and his wife Maja a
