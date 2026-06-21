# Pilot Dry Run 21: the-crystal-egg

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE CRYSTAL EGG.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Crystal Egg
- Title evidence: source body heading line 33 - THE CRYSTAL EGG
- Expected author: Herbert George Wells
- Author evidence: Gutenberg Author line line 12 - Author: Herbert George Wells
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: Gutenberg Author line line 12: Author: Herbert George Wells
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Crystal Egg
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: There was, until a year ago, a little and very grimy-looking shop near Seven Dials
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: There was, until a year ago, a little and very grimy-looking shop near Seven Dials, over which, in weather-worn yellow lettering, the name of "C. Cave, Naturalist and Dealer in Antiquities," was inscribed. The contents of its window were curiously variegated. They comprised some elephant tusks and an imperfect set o...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- contents or list material must not enter default playback
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default

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

- Title: THE CRYSTAL EGG
- Author: Author: Herbert George Wells
- Metadata: Author: Herbert George Wells
- Start: The Crystal Egg There was, until a year ago, a little and very grimy-looking shop near Seven Dials, over which, in weather-worn yellow lettering, the name of "C. Cave, Naturalist and Dealer in Antiquities," was inscribed. The contents of its window were curiously variegated. They comprised some elephant tusks and an imperfect set o...
- End: ...e both believe further that the terrestrial crystal must have been—possibly at some remote[33] date—sent hither from that planet, in order to give the Martians a near view of our affairs. Possibly the fellows to the crystals in the other masts are also on our globe. No theory of hallucination suffices for the facts.

## Heading Examples

- Source tale heading: THE CRYSTAL EGG
- First readable prose: There was, until a year ago, a little and very grimy-looking shop near Seven Dials
