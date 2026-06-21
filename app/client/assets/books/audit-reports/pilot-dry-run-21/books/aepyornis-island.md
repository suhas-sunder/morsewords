# Pilot Dry Run 21: aepyornis-island

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/AEPYORNIS ISLAND.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Aepyornis Island
- Title evidence: source body heading line 65 - AEPYORNIS ISLAND
- Expected author: H. G. Wells
- Author evidence: Gutenberg Author line line 13 - Author: H. G. Wells
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: Gutenberg Author line line 13: Author: H. G. Wells
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Aepyornis Island
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: The man with the scarred face leant over the table and looked at my
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: The man with the scarred face leant over the table and looked at my bundle. "Orchids?" he asked. "A few," I said. "Cypripediums," he said. "Chiefly," said I. "Anything new? I thought not. _I_ did these islands twenty-five--twenty-seven years ago. If you find anything new here--well it's brand new. I didn't leave muc...
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

- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: AEPYORNIS ISLAND
- Author: Author: H. G. Wells
- Metadata: Author: H. G. Wells
- Start: Aepyornis Island The man with the scarred face leant over the table and looked at my bundle. "Orchids?" he asked. "A few," I said. "Cypripediums," he said. "Chiefly," said I. "Anything new? I thought not. _I_ did these islands twenty-five--twenty-seven years ago. If you find anything new here--well it's brand new. I didn't leave muc...
- End: ... found after old Havers died, in his collection, and then a _vastissimus_ turned up." "Winslow was telling me as much," said the man with the scar. "If they get any more Aepyornises, he reckons some scientific swell will go and burst a bloodvessel. But it was a queer thing to happen to a man; wasn't it--altogether?"

## Heading Examples

- Source tale heading: AEPYORNIS ISLAND
- First readable prose: The man with the scarred face leant over the table and looked at my
