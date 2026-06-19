# Pilot Dry Run 12: the-penance

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE PENANCE.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Penance
- Title evidence: source body heading line 63 - THE PENANCE
- Expected author: Saki
- Author evidence: Gutenberg Author line line 13 - Author: Saki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: The Penance
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Octavian Ruttle
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Octavian Ruttle was one of those lively cheerful individuals on whom amiability had set its unmistakable stamp, and, like most of his kind, his soul?s peace depended in large measure on the unstinted approval of his fellows. In hunting to death a small tabby cat he had done a thing of which he scarcely approved hims...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- contents or list material must not enter default playback
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

- Title: THE PENANCE
- Author: Author: Saki
- Start: The Penance Octavian Ruttle was one of those lively cheerful individuals on whom amiability had set its unmistakable stamp, and, like most of his kind, his soul?s peace depended in large measure on the unstinted approval of his fellows. In hunting to death a small tabby cat he had done a thing of which he scarcely approved hims...
- End: umber seemed to have passed. A box of matches lay at his feet and was resorted to on the fairly frequent occasions when the candle succumbed to the night breezes. The house loomed inscrutable in the middle distance, but as Octavian conscientiously repeated the formula of his penance he felt certain that three pairs...

## Heading Examples

- First readable prose: Octavian Ruttle
