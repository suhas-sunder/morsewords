# Pilot Dry Run 20: jimmy-goggles-the-god

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/JIMMY GOGGLES THE GOD.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Jimmy Goggles the God
- Title evidence: source body heading line 34 - JIMMY GOGGLES THE GOD
- Expected author: H. G. Wells
- Author evidence: Gutenberg Author line line 12 - Author: H. G. Wells
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: Gutenberg Author line line 12: Author: H. G. Wells
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Jimmy Goggles the God
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: “It isn't every one who's been a god,” said the sunburnt man
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: “It isn't every one who's been a god,” said the sunburnt man. “But it's happened to me. Among other things.” I intimated my sense of his condescension. “It don't leave much for ambition, does it?” said the sunburnt man. “I was one of those men who were saved from the Ocean Pioneer. Gummy! how time flies! It's twenty...
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

- Title: JIMMY GOGGLES THE GOD
- Author: Author: H. G. Wells
- Metadata: Author: H. G. Wells
- Start: Jimmy Goggles the God “It isn't every one who's been a god,” said the sunburnt man. “But it's happened to me. Among other things.” I intimated my sense of his condescension. “It don't leave much for ambition, does it?” said the sunburnt man. “I was one of those men who were saved from the Ocean Pioneer. Gummy! how time flies! It's twenty...
- End: ... day, and thieving food from the villages by night. Only weapon, a spear. No clothes, no money. Nothing. My face was my fortune, as the saying is. And just a squeak of eight thousand pounds of gold—fifth share. But the natives cut up rusty, thank goodness, because they thought it was him had driven their luck away.”

## Heading Examples

- Source tale heading: JIMMY GOGGLES THE GOD
- First readable prose: “It isn't every one who's been a god,” said the sunburnt man
