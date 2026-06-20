# Pilot Dry Run 19: the-two-frogs

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE TWO FROGS.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Two Frogs
- Title evidence: source body heading line 52 - THE TWO FROGS
- Expected author: Andrew Lang
- Author evidence: Gutenberg Author line line 13 - Author: Andrew Lang
- Expected author/compiler/collector/translator/reteller role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Metadata evidence: Gutenberg Author line line 13: Author: Andrew Lang; visible editor byline line 42: Edited By Andrew Lang
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Two Frogs
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Once upon a time in the country of Japan there lived two frogs, one of
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Once upon a time in the country of Japan there lived two frogs, one of whom made his home in a ditch near the town of Osaka, on the sea coast, while the other dwelt in a clear little stream which ran through the city of Kioto. At such a great distance apart, they had never even heard of each other; but, funnily enou...
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

- Title: THE TWO FROGS
- Author: Author: Andrew Lang
- Metadata: Author: Andrew Lang; Edited By Andrew Lang
- Start: The Two Frogs Once upon a time in the country of Japan there lived two frogs, one of whom made his home in a ditch near the town of Osaka, on the sea coast, while the other dwelt in a clear little stream which ran through the city of Kioto. At such a great distance apart, they had never even heard of each other; but, funnily enou...
- End: ... he spoke he took his hands from his friend’s shoulders, and they both fell down on the grass. Then they took a polite farewell of each other, and set off for home again, and to the end of their lives they believed that Osaka and Kioto, which are as different to look at as two towns can be, were as like as two peas.

## Heading Examples

- Source tale heading: THE TWO FROGS
- First readable prose: Once upon a time in the country of Japan there lived two frogs, one of
