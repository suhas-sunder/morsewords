# Pilot Dry Run 12: the-loving-pair

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE LOVING PAIR.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Loving Pair
- Title evidence: source body heading line 136 - THE LOVING PAIR
- Expected author: H. C. Andersen
- Author evidence: Gutenberg Author line line 13 - Author: H. C. Andersen
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: The Loving Pair
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: A WHIPPING Top and a Ball lay close together
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: A WHIPPING Top and a Ball lay close together in a drawer among other playthings. One day the Top said to the Ball, "Since we are living so much together, why should we not be lovers?" But the Ball, being made of morocco leather, thought herself a very high-bred lady, and would hear nothing of such a proposal. On the...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default
- illustration captions/placeholders must be removed from default playback

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

- illustration captions/placeholders detected

## Supporting Snippets

- Title: THE LOVING PAIR
- Author: Author: H. C. Andersen
- Start: The Loving Pair A WHIPPING Top and a Ball lay close together in a drawer among other playthings. One day the Top said to the Ball, "Since we are living so much together, why should we not be lovers?" But the Ball, being made of morocco leather, thought herself a very high-bred lady, and would hear nothing of such a proposal. On the...
- End: eard, the more sure he became that this was indeed she. Then came the housemaid to empty the dustbin. "Hullo!" she cried; "why, here's the gilt Top." And so the Top was brought again to the playroom, to be used and honored as before, while nothing was again heard of the Ball. And the Top never spoke again of his old...

## Heading Examples

- First readable prose: A WHIPPING Top and a Ball lay close together
