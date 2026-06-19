# Pilot Dry Run 14: the-raven

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE RAVEN.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Raven
- Title evidence: source body heading line 43 - THE RAVEN
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Raven
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: There was once a queen who had a little daughter, still too young to run
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: There was once a queen who had a little daughter, still too young to run alone. One day the child was very troublesome, and the mother could not quiet it, do what she would. She grew impatient, and seeing the ravens flying round the castle, she opened the window, and said: ?I wish you were a raven and would fly away...
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

- Title: THE RAVEN
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: The Raven There was once a queen who had a little daughter, still too young to run alone. One day the child was very troublesome, and the mother could not quiet it, do what she would. She grew impatient, and seeing the ravens flying round the castle, she opened the window, and said: ?I wish you were a raven and would fly away...
- End: ...anwhile he had gone outside again and mounted his horse and thrown off the cloak. When therefore she came to the castle gate she saw him, and cried aloud for joy. Then he dismounted and took her in his arms; and she kissed him, and said, ‘Now you have indeed set me free, and tomorrow we will celebrate our marriage.’

## Heading Examples

- Source tale heading: THE RAVEN
- First readable prose: There was once a queen who had a little daughter, still too young to run
