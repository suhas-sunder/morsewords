# Pilot Dry Run 12: quail-seed

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/QUAIL SEED.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Quail Seed
- Title evidence: source body heading line 63 - QUAIL SEED
- Expected author: Saki
- Author evidence: Gutenberg Author line line 13 - Author: Saki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Quail Seed
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: “The outlook is not encouraging for us smaller businesses
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: ?The outlook is not encouraging for us smaller businesses,? said Mr. Scarrick to the artist and his sister, who had taken rooms over his suburban grocery store. ?These big concerns are offering all sorts of attractions to the shopping public which we couldn?t afford to imitate, even on a small scale?reading-rooms an...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default

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

- Title: QUAIL SEED
- Author: Author: Saki
- Start: Quail Seed ?The outlook is not encouraging for us smaller businesses,? said Mr. Scarrick to the artist and his sister, who had taken rooms over his suburban grocery store. ?These big concerns are offering all sorts of attractions to the shopping public which we couldn?t afford to imitate, even on a small scale?reading-rooms an...
- End: isfied his requirements. He, too, took his departure, and the shop was slowly emptied of its parcel and gossip laden customers. It was Emily Yorling?s ?day?, and most of the shoppers made their way to her drawing-room. To go direct from a shopping expedition to a tea party was what was known locally as ?living in a...

## Heading Examples

- First readable prose: ?The outlook is not encouraging for us smaller businesses
