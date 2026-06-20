# Pilot Dry Run 17: the-willow-wren-and-the-bear

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE WILLOW-WREN AND THE BEAR.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Willow-Wren and the Bear
- Title evidence: source body heading line 43 - THE WILLOW-WREN AND THE BEAR
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Expected author/compiler/collector/translator/reteller role: authors: Jacob Grimm and Wilhelm Grimm (raw source labels them as authors)
- Metadata evidence: Gutenberg Author line line 13: Author: Jacob Grimm; Wilhelm Grimm; visible collection byline line 35: By Jacob Grimm and Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Willow-Wren and the Bear
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Once in summer-time the bear and the wolf were walking in the forest,
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Once in summer-time the bear and the wolf were walking in the forest, and the bear heard a bird singing so beautifully that he said: ‘Brother wolf, what bird is it that sings so well?’ ‘That is the King of birds,’ said the wolf, ‘before whom we must bow down.’ In reality the bird was the willow-wren. ‘IF that’s the...
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

- Title: THE WILLOW-WREN AND THE BEAR
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Metadata: Author: Jacob Grimm; Wilhelm Grimm; By Jacob Grimm and Wilhelm Grimm
- Start: The Willow-Wren and the Bear Once in summer-time the bear and the wolf were walking in the forest, and the bear heard a bird singing so beautifully that he said: ‘Brother wolf, what bird is it that sings so well?’ ‘That is the King of birds,’ said the wolf, ‘before whom we must bow down.’ In reality the bird was the willow-wren. ‘IF that’s the...
- End: ...e to come to the nest to my children, and beg their pardon, or else every rib of your body shall be broken.’ So the bear crept thither in the greatest fear, and begged their pardon. And now at last the young wrens were satisfied, and sat down together and ate and drank, and made merry till quite late into the night.

## Heading Examples

- Source tale heading: THE WILLOW-WREN AND THE BEAR
- First readable prose: Once in summer-time the bear and the wolf were walking in the forest,
