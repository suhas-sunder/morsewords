# Pilot Dry Run 12: shock-tactics

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/SHOCK TACTICS.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Shock Tactics
- Title evidence: source body heading line 61 - SHOCK TACTICS
- Expected author: Saki
- Author evidence: Gutenberg Author line line 13 - Author: Saki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Shock Tactics
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: On a late spring afternoon Ella McCarthy
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: On a late spring afternoon Ella McCarthy sat on a green-painted chair in Kensington Gardens, staring listlessly at an uninteresting stretch of park landscape, that blossomed suddenly into tropical radiance as an expected figure appeared in the middle distance. ?Hullo, Bertie!? she exclaimed sedately, when the figure...
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

- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: SHOCK TACTICS
- Author: Author: Saki
- Start: Shock Tactics On a late spring afternoon Ella McCarthy sat on a green-painted chair in Kensington Gardens, staring listlessly at an uninteresting stretch of park landscape, that blossomed suddenly into tropical radiance as an expected figure appeared in the middle distance. ?Hullo, Bertie!? she exclaimed sedately, when the figure...
- End: ose letters?? whimpered Mrs. Heasant. ?I should have known what to think of them,? said Bertie; ?if you choose to excite yourself over other people?s correspondence it?s your own fault. Anyhow, I?m going for a doctor.? It was Bertie?s great opportunity, and he knew it. His mother was conscious of the fact that she w...

## Heading Examples

- First readable prose: On a late spring afternoon Ella McCarthy
