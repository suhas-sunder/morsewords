# Pilot Dry Run 14: the-goose-girl

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE GOOSE-GIRL.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Goose-Girl
- Title evidence: source body heading line 43 - THE GOOSE-GIRL
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Goose-Girl
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: The king of a great land died, and left his queen to take care of their
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: The king of a great land died, and left his queen to take care of their only child. This child was a daughter, who was very beautiful; and her mother loved her dearly, and was very kind to her. And there was a good fairy too, who was fond of the princess, and helped her mother to watch over her. When she grew up, sh...
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

- Title: THE GOOSE-GIRL
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: The Goose-Girl The king of a great land died, and left his queen to take care of their only child. This child was a daughter, who was very beautiful; and her mother loved her dearly, and was very kind to her. And there was a good fairy too, who was fond of the princess, and helped her mother to watch over her. When she grew up, sh...
- End: ...dead.’ ‘Thou art she!’ said the old king; ‘and as thou has judged thyself, so shall it be done to thee.’ And the young king was then married to his true wife, and they reigned over the kingdom in peace and happiness all their lives; and the good fairy came to see them, and restored the faithful Falada to life again.

## Heading Examples

- Source tale heading: THE GOOSE-GIRL
- First readable prose: The king of a great land died, and left his queen to take care of their
