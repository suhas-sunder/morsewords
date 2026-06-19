# Pilot Dry Run 14: the-old-man-and-his-grandson

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE OLD MAN AND HIS GRANDSON.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Old Man and His Grandson
- Title evidence: source body heading line 43 - THE OLD MAN AND HIS GRANDSON
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Old Man and His Grandson
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: There was once a very old man, whose eyes had become dim, his ears dull
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: There was once a very old man, whose eyes had become dim, his ears dull of hearing, his knees trembled, and when he sat at table he could hardly hold the spoon, and spilt the broth upon the table-cloth or let it run out of his mouth. His son and his son?s wife were disgusted at this, so the old grandfather at last h...
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

- Title: THE OLD MAN AND HIS GRANDSON
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: The Old Man and His Grandson There was once a very old man, whose eyes had become dim, his ears dull of hearing, his knees trembled, and when he sat at table he could hardly hold the spoon, and spilt the broth upon the table-cloth or let it run out of his mouth. His son and his son?s wife were disgusted at this, so the old grandfather at last h...
- End: ...h,’ answered the child, ‘for father and mother to eat out of when I am big.’ The man and his wife looked at each other for a while, and presently began to cry. Then they took the old grandfather to the table, and henceforth always let him eat with them, and likewise said nothing if he did spill a little of anything.

## Heading Examples

- Source tale heading: THE OLD MAN AND HIS GRANDSON
- First readable prose: There was once a very old man, whose eyes had become dim, his ears dull
