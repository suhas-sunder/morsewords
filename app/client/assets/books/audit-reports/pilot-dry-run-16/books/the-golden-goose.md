# Pilot Dry Run 16: the-golden-goose

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE GOLDEN GOOSE.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Golden Goose
- Title evidence: source body heading line 43 - THE GOLDEN GOOSE
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Golden Goose
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: There was a man who had three sons, the youngest of whom was called
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: There was a man who had three sons, the youngest of whom was called Dummling,[*] and was despised, mocked, and sneered at on every occasion. [*] Simpleton It happened that the eldest wanted to go into the forest to hew wood, and before he went his mother gave him a beautiful sweet cake and a bottle of wine in order...
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

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: THE GOLDEN GOOSE
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: The Golden Goose There was a man who had three sons, the youngest of whom was called Dummling,[*] and was despised, mocked, and sneered at on every occasion. [*] Simpleton It happened that the eldest wanted to go into the forest to hew wood, and before he went his mother gave him a beautiful sweet cake and a bottle of wine in order...
- End: ...use you once were kind to me.’ Then he gave him the ship which could sail on land and water, and when the king saw that, he could no longer prevent him from having his daughter. The wedding was celebrated, and after the king’s death, Dummling inherited his kingdom and lived for a long time contentedly with his wife.

## Heading Examples

- Source tale heading: THE GOLDEN GOOSE
- First readable prose: There was a man who had three sons, the youngest of whom was called
