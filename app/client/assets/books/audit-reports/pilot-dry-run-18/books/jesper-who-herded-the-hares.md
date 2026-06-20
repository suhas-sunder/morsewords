# Pilot Dry Run 18: jesper-who-herded-the-hares

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/JESPER WHO HERDED THE HARES.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Jesper Who Herded the Hares
- Title evidence: source body heading line 52 - JESPER WHO HERDED THE HARES
- Expected author: Andrew Lang
- Author evidence: Gutenberg Author line line 13 - Author: Andrew Lang
- Expected author/compiler/collector/translator/reteller role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Metadata evidence: Gutenberg Author line line 13: Author: Andrew Lang; visible editor byline line 42: Edited By Andrew Lang
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Jesper Who Herded the Hares
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: There was once a king who ruled over a kingdom somewhere between sunrise
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: There was once a king who ruled over a kingdom somewhere between sunrise and sunset. It was as small as kingdoms usually were in old times, and when the king went up to the roof of his palace and took a look round he could see to the ends of it in every direction. But as it was all his own, he was very proud of it,...
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

- Title: JESPER WHO HERDED THE HARES
- Author: Author: Andrew Lang
- Metadata: Author: Andrew Lang; Edited By Andrew Lang
- Start: Jesper Who Herded the Hares There was once a king who ruled over a kingdom somewhere between sunrise and sunset. It was as small as kingdoms usually were in old times, and when the king went up to the roof of his palace and took a look round he could see to the ends of it in every direction. But as it was all his own, he was very proud of it,...
- End: ... and the princess was very well pleased, for by this time she had quite fallen in love with him, because he was so handsome and so clever. When the old king got time to think over it, he was quite convinced that his kingdom would be safe in Jesper’s hands if he looked after the people as well as he herded the hares.

## Heading Examples

- Source tale heading: JESPER WHO HERDED THE HARES
- First readable prose: There was once a king who ruled over a kingdom somewhere between sunrise
