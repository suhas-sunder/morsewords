# Pilot Dry Run 18: a-tale-of-the-tontlawald

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/A TALE OF THE TONTLAWALD.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: A Tale of the Tontlawald
- Title evidence: source body heading line 52 - A TALE OF THE TONTLAWALD
- Expected author: Andrew Lang
- Author evidence: Gutenberg Author line line 13 - Author: Andrew Lang
- Expected author/compiler/collector/translator/reteller role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Metadata evidence: Gutenberg Author line line 13: Author: Andrew Lang; visible editor byline line 42: Edited By Andrew Lang
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: A Tale of the Tontlawald
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Long, long ago there stood in the midst of a country covered with lakes
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Long, long ago there stood in the midst of a country covered with lakes a vast stretch of moorland called the Tontlawald, on which no man ever dared set foot. From time to time a few bold spirits had been drawn by curiosity to its borders, and on their return had reported that they had caught a glimpse of a ruined h...
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

- Title: A TALE OF THE TONTLAWALD
- Author: Author: Andrew Lang
- Metadata: Author: Andrew Lang; Edited By Andrew Lang
- Start: A Tale of the Tontlawald Long, long ago there stood in the midst of a country covered with lakes a vast stretch of moorland called the Tontlawald, on which no man ever dared set foot. From time to time a few bold spirits had been drawn by curiosity to its borders, and on their return had reported that they had caught a glimpse of a ruined h...
- End: ... wedding took place, and as Elsa was arranging the veil upon her hair fifty carts arrived laden with beautiful things which the lady of the Tontlawald had sent to Elsa. And after the king’s death Elsa became queen, and when she was old she told this story. But that was the last that was ever heard of the Tontlawald.

## Heading Examples

- Source tale heading: A TALE OF THE TONTLAWALD
- First readable prose: Long, long ago there stood in the midst of a country covered with lakes
