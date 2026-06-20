# Pilot Dry Run 16: the-turnip

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE TURNIP.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Turnip
- Title evidence: source body heading line 43 - THE TURNIP
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Turnip
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: There were two brothers who were both soldiers; the one was rich and
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: There were two brothers who were both soldiers; the one was rich and the other poor. The poor man thought he would try to better himself; so, pulling off his red coat, he became a gardener, and dug his ground well, and sowed turnips. When the seed came up, there was one plant bigger than all the rest; and it kept ge...
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

- Title: THE TURNIP
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: The Turnip There were two brothers who were both soldiers; the one was rich and the other poor. The poor man thought he would try to better himself; so, pulling off his red coat, he became a gardener, and dug his ground well, and sowed turnips. When the seed came up, there was one plant bigger than all the rest; and it kept ge...
- End: ...er wisdom dangling in the air. ‘How is it with thee, friend?’ said he, ‘dost thou not feel that wisdom comes unto thee? Rest there in peace, till thou art a wiser man than thou wert.’ So saying, he trotted off on the student’s nag, and left the poor fellow to gather wisdom till somebody should come and let him down.

## Heading Examples

- Source tale heading: THE TURNIP
- First readable prose: There were two brothers who were both soldiers; the one was rich and
