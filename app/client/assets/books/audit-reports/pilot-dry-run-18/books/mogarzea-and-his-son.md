# Pilot Dry Run 18: mogarzea-and-his-son

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/MOGARZEA AND HIS SON.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Mogarzea and His Son
- Title evidence: source body heading line 52 - MOGARZEA AND HIS SON
- Expected author: Andrew Lang
- Author evidence: Gutenberg Author line line 13 - Author: Andrew Lang
- Expected author/compiler/collector/translator/reteller role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Metadata evidence: Gutenberg Author line line 13: Author: Andrew Lang; visible editor byline line 42: Edited By Andrew Lang
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Mogarzea and His Son
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: There was once a little boy, whose father and mother, when they were
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: There was once a little boy, whose father and mother, when they were dying, left him to the care of a guardian. But the guardian whom they chose turned out to be a wicked man, and spent all the money, so the boy determined to go away and strike out a path for himself. So one day he set off, and walked and walked thr...
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

- Title: MOGARZEA AND HIS SON
- Author: Author: Andrew Lang
- Metadata: Author: Andrew Lang; Edited By Andrew Lang
- Start: Mogarzea and His Son There was once a little boy, whose father and mother, when they were dying, left him to the care of a guardian. But the guardian whom they chose turned out to be a wicked man, and spent all the money, so the boy determined to go away and strike out a path for himself. So one day he set off, and walked and walked thr...
- End: ...t last she saw that her entreaties were vain, and agreed to marry him, as he wished. And they went together to the palace, where Mogarzea was still waiting for him, and the marriage was celebrated by the emperor himself. But every May they returned to the Milk Lake, they and their children, and bathed in its waters.

## Heading Examples

- Source tale heading: MOGARZEA AND HIS SON
- First readable prose: There was once a little boy, whose father and mother, when they were
