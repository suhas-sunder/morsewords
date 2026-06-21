# Pilot Dry Run 22: the-shifty-lad

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Shifty Lad.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only Project Gutenberg source with reuse/source evidence present; no generated publish status exists yet
- Expected title: The Shifty Lad
- Title evidence: review-only source filename corroborated by the story text - The Shifty Lad
- Expected author: Andrew Lang
- Author evidence: Gutenberg Author line line 13 - Author: Andrew Lang
- Expected author/compiler/collector/translator/reteller role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Metadata evidence: Gutenberg Author line line 13: Author: Andrew Lang; visible editor byline line 32: Edited by Andrew Lang
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Shifty Lad
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg or source-site footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: In the land of Erin there dwelt long ago a widow
- Expected end boundary: end before Project Gutenberg or source-site footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: In the land of Erin there dwelt long ago a widow who had an only son. He was a clever boy, so she saved up enough money to send him to school, and, as soon as he was old enough, to apprentice him to any trade that he would choose. But when the time came, he said he would not be bound to any trade, and that he meant...
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

- Title: The Shifty Lad
- Author: Author: Andrew Lang
- Metadata: Author: Andrew Lang; Edited by Andrew Lang
- Start: The Shifty Lad In the land of Erin there dwelt long ago a widow who had an only son. He was a clever boy, so she saved up enough money to send him to school, and, as soon as he was old enough, to apprentice him to any trade that he would choose. But when the time came, he said he would not be bound to any trade, and that he meant...
- End: ...h of the princess. ‘Now pull me up again,’ called he; but as he spoke a great cry arose that the palace was burning. The princess turned round with a start, and let go her handkerchief, and the Shifty Lad fell, and struck his head on a stone, and died in an instant. So his mother’s prophecy had come true, after all.

## Heading Examples

- Source tale heading: The Shifty Lad
- First readable prose: In the land of Erin there dwelt long ago a widow
