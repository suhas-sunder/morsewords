# Pilot Dry Run 12: canossa

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/CANOSSA.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Canossa
- Title evidence: source body heading line 63 - CANOSSA
- Expected author: Saki
- Author evidence: Gutenberg Author line line 13 - Author: Saki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: Canossa
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Demosthenes Platterbaff
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Demosthenes Platterbaff, the eminent Unrest Inducer, stood on his trial for a serious offence, and the eyes of the political world were focussed on the jury. The offence, it should be stated, was serious for the Government rather than for the prisoner. He had blown up the Albert Hall on the eve of the great Liberal...
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

- Title: CANOSSA
- Author: Author: Saki
- Start: Canossa Demosthenes Platterbaff, the eminent Unrest Inducer, stood on his trial for a serious offence, and the eyes of the political world were focussed on the jury. The offence, it should be stated, was serious for the Government rather than for the prisoner. He had blown up the Albert Hall on the eve of the great Liberal...
- End: o it? the prisoner strode forth to freedom. The word of the song had reference, it was understood, to the incarcerating Government and not to the destroyer of the Albert Hall. The seat was lost, after all, by a narrow majority. The local Trade Unionists took offence at the fact of Cabinet Ministers having personally...

## Heading Examples

- First readable prose: Demosthenes Platterbaff
