# Pilot Dry Run 14: the-mouse-the-bird-and-the-sausage

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE MOUSE, THE BIRD, AND THE SAUSAGE.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Mouse, the Bird, and the Sausage
- Title evidence: source body heading line 43 - THE MOUSE, THE BIRD, AND THE SAUSAGE
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Mouse, the Bird, and the Sausage
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Once upon a time, a mouse, a bird, and a sausage, entered into
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Once upon a time, a mouse, a bird, and a sausage, entered into partnership and set up house together. For a long time all went well; they lived in great comfort, and prospered so far as to be able to add considerably to their stores. The bird?s duty was to fly daily into the wood and bring in fuel; the mouse fetched...
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

- Title: THE MOUSE, THE BIRD, AND THE SAUSAGE
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: The Mouse, the Bird, and the Sausage Once upon a time, a mouse, a bird, and a sausage, entered into partnership and set up house together. For a long time all went well; they lived in great comfort, and prospered so far as to be able to add considerably to their stores. The bird?s duty was to fly daily into the wood and bring in fuel; the mouse fetched...
- End: ...re and there about the floor, called and searched, but no cook was to be found. Then some of the wood that had been carelessly thrown down, caught fire and began to blaze. The bird hastened to fetch some water, but his pail fell into the well, and he after it, and as he was unable to recover himself, he was drowned.

## Heading Examples

- Source tale heading: THE MOUSE, THE BIRD, AND THE SAUSAGE
- First readable prose: Once upon a time, a mouse, a bird, and a sausage, entered into
