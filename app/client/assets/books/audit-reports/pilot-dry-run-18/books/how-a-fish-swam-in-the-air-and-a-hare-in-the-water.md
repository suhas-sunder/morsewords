# Pilot Dry Run 18: how-a-fish-swam-in-the-air-and-a-hare-in-the-water

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/HOW A FISH SWAM IN THE AIR AND A HARE IN THE WATER.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: How a Fish Swam in the Air and a Hare in the Water
- Title evidence: source body heading line 52 - HOW A FISH SWAM IN THE AIR AND A HARE IN THE WATER
- Expected author: Andrew Lang
- Author evidence: Gutenberg Author line line 13 - Author: Andrew Lang
- Expected author/compiler/collector/translator/reteller role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Metadata evidence: Gutenberg Author line line 13: Author: Andrew Lang; visible editor byline line 42: Edited By Andrew Lang
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: How a Fish Swam in the Air and a Hare in the Water
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Once upon a time an old man and his wife lived together in a little
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Once upon a time an old man and his wife lived together in a little village. They might have been happy if only the old woman had had the sense to hold her tongue at proper times. But anything which might happen indoors, or any bit of news which her husband might bring in when he had been anywhere, had to be told at...
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

- future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: HOW A FISH SWAM IN THE AIR AND A HARE IN THE WATER
- Author: Author: Andrew Lang
- Metadata: Author: Andrew Lang; Edited By Andrew Lang
- Start: How a Fish Swam in the Air and a Hare in the Water Once upon a time an old man and his wife lived together in a little village. They might have been happy if only the old woman had had the sense to hold her tongue at proper times. But anything which might happen indoors, or any bit of news which her husband might bring in when he had been anywhere, had to be told at...
- End: ...retary could make nothing of it all, and drove back to the town. The old woman was so laughed at that she had to hold her tongue and obey her husband ever after, and the man bought wares with part of the treasure and moved into the town, where he opened a shop, and prospered, and spent the rest of his days in peace.

## Heading Examples

- Source tale heading: HOW A FISH SWAM IN THE AIR AND A HARE IN THE WATER
- First readable prose: Once upon a time an old man and his wife lived together in a little
