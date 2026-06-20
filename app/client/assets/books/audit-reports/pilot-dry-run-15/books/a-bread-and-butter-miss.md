# Pilot Dry Run 15: a-bread-and-butter-miss

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/A BREAD AND BUTTER MISS.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: A Bread and Butter Miss
- Title evidence: source body heading line 63 - A BREAD AND BUTTER MISS
- Expected author: Saki
- Author evidence: Gutenberg Author line line 13 - Author: Saki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: A Bread and Butter Miss
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: “Starling Chatter and Oakhill have both dropped back in the betting,”
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: ?Starling Chatter and Oakhill have both dropped back in the betting,? said Bertie van Tahn, throwing the morning paper across the breakfast table. ?That leaves Nursery Tea practically favourite,? said Odo Finsberry. ?Nursery Tea and Pipeclay are at the top of the betting at present,? said Bertie, ?but that French ho...
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

- Title: A BREAD AND BUTTER MISS
- Author: Author: Saki
- Start: A Bread and Butter Miss ?Starling Chatter and Oakhill have both dropped back in the betting,? said Bertie van Tahn, throwing the morning paper across the breakfast table. ?That leaves Nursery Tea practically favourite,? said Odo Finsberry. ?Nursery Tea and Pipeclay are at the top of the betting at present,? said Bertie, ?but that French ho...
- End: ...lative groan broke from the assembly as the meaning of his words gradually dawned on his hearers. For the second time that day Lola retired to the seclusion of her room; she could not face the universal looks of reproach directed at her when Whitebait was announced winner at the comfortable price of fourteen to one.

## Heading Examples

- Source tale heading: A BREAD AND BUTTER MISS
- First readable prose: ?Starling Chatter and Oakhill have both dropped back in the betting,?
