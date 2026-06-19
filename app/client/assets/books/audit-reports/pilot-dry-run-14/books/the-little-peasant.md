# Pilot Dry Run 14: the-little-peasant

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE LITTLE PEASANT.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Little Peasant
- Title evidence: source body heading line 43 - THE LITTLE PEASANT
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Little Peasant
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: There was a certain village wherein no one lived but really rich
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: There was a certain village wherein no one lived but really rich peasants, and just one poor one, whom they called the little peasant. He had not even so much as a cow, and still less money to buy one, and yet he and his wife did so wish to have one. One day he said to her: ?Listen, I have a good idea, there is our...
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

- Title: THE LITTLE PEASANT
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: The Little Peasant There was a certain village wherein no one lived but really rich peasants, and just one poor one, whom they called the little peasant. He had not even so much as a cow, and still less money to buy one, and yet he and his wife did so wish to have one. One day he said to her: ?Listen, I have a good idea, there is our...
- End: ...and said: ‘I will go down first, and look about me, and if things promise well I’ll call you.’ So he jumped in; splash! went the water; it sounded as if he were calling them, and the whole crowd plunged in after him as one man. Then the entire village was dead, and the small peasant, as sole heir, became a rich man.

## Heading Examples

- Source tale heading: THE LITTLE PEASANT
- First readable prose: There was a certain village wherein no one lived but really rich
