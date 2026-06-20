# Pilot Dry Run 15: the-image-of-the-lost-soul

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE IMAGE OF THE LOST SOUL.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Image of the Lost Soul
- Title evidence: source body heading line 63 - THE IMAGE OF THE LOST SOUL
- Expected author: Saki
- Author evidence: Gutenberg Author line line 13 - Author: Saki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Image of the Lost Soul
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: There were a number of carved stone figures placed at intervals along the
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: There were a number of carved stone figures placed at intervals along the parapets of the old Cathedral; some of them represented angels, others kings and bishops, and nearly all were in attitudes of pious exaltation and composure. But one figure, low down on the cold north side of the building, had neither crown, m...
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

- Title: THE IMAGE OF THE LOST SOUL
- Author: Author: Saki
- Start: The Image of the Lost Soul There were a number of carved stone figures placed at intervals along the parapets of the old Cathedral; some of them represented angels, others kings and bishops, and nearly all were in attitudes of pious exaltation and composure. But one figure, low down on the cold north side of the building, had neither crown, m...
- End: ...ornice and lay now in a broken mass on the dust-heap outside the verger’s lodge. “It is just as well,” cooed the fat pigeons, after they had peered at the matter for some minutes; “now we shall have a nice angel put up there. Certainly they will put an angel there.” “After joy . . . sorrow,” rang out the great bell.

## Heading Examples

- Source tale heading: THE IMAGE OF THE LOST SOUL
- First readable prose: There were a number of carved stone figures placed at intervals along the
