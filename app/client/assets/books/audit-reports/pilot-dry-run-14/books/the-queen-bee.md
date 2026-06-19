# Pilot Dry Run 14: the-queen-bee

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE QUEEN BEE.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Queen Bee
- Title evidence: source body heading line 43 - THE QUEEN BEE
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Queen Bee
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Two kings’ sons once upon a time went into the world to seek their
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Two kings? sons once upon a time went into the world to seek their fortunes; but they soon fell into a wasteful foolish way of living, so that they could not return home again. Then their brother, who was a little insignificant dwarf, went out to seek for his brothers: but when he had found them they only laughed at...
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

- Title: THE QUEEN BEE
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: The Queen Bee Two kings? sons once upon a time went into the world to seek their fortunes; but they soon fell into a wasteful foolish way of living, so that they could not return home again. Then their brother, who was a little insignificant dwarf, went out to seek for his brothers: but when he had found them they only laughed at...
- End: ...the honey: and so the dwarf knew which was the youngest. Thus the spell was broken, and all who had been turned into stones awoke, and took their proper forms. And the dwarf married the youngest and the best of the princesses, and was king after her father’s death; but his two brothers married the other two sisters.

## Heading Examples

- Source tale heading: THE QUEEN BEE
- First readable prose: Two kings? sons once upon a time went into the world to seek their
