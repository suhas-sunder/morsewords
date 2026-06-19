# Pilot Dry Run 14: the-fox-and-the-horse

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE FOX AND THE HORSE.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Fox and the Horse
- Title evidence: source body heading line 43 - THE FOX AND THE HORSE
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Fox and the Horse
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: A farmer had a horse that had been an excellent faithful servant to
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: A farmer had a horse that had been an excellent faithful servant to him: but he was now grown too old to work; so the farmer would give him nothing more to eat, and said, ?I want you no longer, so take yourself off out of my stable; I shall not take you back again until you are stronger than a lion.? Then he opened...
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

- Title: THE FOX AND THE HORSE
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: The Fox and the Horse A farmer had a horse that had been an excellent faithful servant to him: but he was now grown too old to work; so the farmer would give him nothing more to eat, and said, ?I want you no longer, so take yourself off out of my stable; I shall not take you back again until you are stronger than a lion.? Then he opened...
- End: ... way quietly over the fields to his master’s house. ‘Here he is, master,’ said he, ‘I have got the better of him’: and when the farmer saw his old servant, his heart relented, and he said. ‘Thou shalt stay in thy stable and be well taken care of.’ And so the poor old horse had plenty to eat, and lived--till he died.

## Heading Examples

- Source tale heading: THE FOX AND THE HORSE
- First readable prose: A farmer had a horse that had been an excellent faithful servant to
