# Pilot Dry Run 14: briar-rose

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/BRIAR ROSE.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Briar Rose
- Title evidence: source body heading line 43 - BRIAR ROSE
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Briar Rose
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: A king and queen once upon a time reigned in a country a great way off,
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: A king and queen once upon a time reigned in a country a great way off, where there were in those days fairies. Now this king and queen had plenty of money, and plenty of fine clothes to wear, and plenty of good things to eat and drink, and a coach to ride out in every day: but though they had been married many year...
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

- Title: BRIAR ROSE
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: Briar Rose A king and queen once upon a time reigned in a country a great way off, where there were in those days fairies. Now this king and queen had plenty of money, and plenty of fine clothes to wear, and plenty of good things to eat and drink, and a coach to ride out in every day: but though they had been married many year...
- End: ...ent the spit, with the goose for the king’s dinner upon it; the butler finished his draught of ale; the maid went on plucking the fowl; and the cook gave the boy the box on his ear. And then the prince and Briar Rose were married, and the wedding feast was given; and they lived happily together all their lives long.

## Heading Examples

- Source tale heading: BRIAR ROSE
- First readable prose: A king and queen once upon a time reigned in a country a great way off,
