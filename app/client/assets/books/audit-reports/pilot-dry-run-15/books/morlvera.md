# Pilot Dry Run 15: morlvera

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/MORLVERA.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Morlvera
- Title evidence: source body heading line 63 - MORLVERA
- Expected author: Saki
- Author evidence: Gutenberg Author line line 13 - Author: Saki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Morlvera
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: The Olympic Toy Emporium occupied a conspicuous frontage in an important
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: The Olympic Toy Emporium occupied a conspicuous frontage in an important West End street. It was happily named Toy Emporium, because one would never have dreamed of according it the familiar and yet pulse-quickening name of toyshop. There was an air of cold splendour and elaborate failure about the wares that were s...
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

- Title: MORLVERA
- Author: Author: Saki
- Start: Morlvera The Olympic Toy Emporium occupied a conspicuous frontage in an important West End street. It was happily named Toy Emporium, because one would never have dreamed of according it the familiar and yet pulse-quickening name of toyshop. There was an air of cold splendour and elaborate failure about the wares that were s...
- End: ...h rapidly enacted tragedy. Later that afternoon, when they were engaged in the pursuit of minnows by the waterside in St. James’s Park, Emmeline said in a solemn undertone to Bert— “I’ve bin finking. Do you know oo ’e was? ’E was ’er little boy wot she’d sent away to live wiv poor folks. ’E come back and done that.”

## Heading Examples

- Source tale heading: MORLVERA
- First readable prose: The Olympic Toy Emporium occupied a conspicuous frontage in an important
