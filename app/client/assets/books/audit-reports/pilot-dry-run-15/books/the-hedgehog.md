# Pilot Dry Run 15: the-hedgehog

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE HEDGEHOG.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Hedgehog
- Title evidence: source body heading line 63 - THE HEDGEHOG
- Expected author: Saki
- Author evidence: Gutenberg Author line line 13 - Author: Saki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Hedgehog
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: A “Mixed Double” of young people were contesting a game of lawn tennis at
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: A ?Mixed Double? of young people were contesting a game of lawn tennis at the Rectory garden party; for the past five-and-twenty years at least mixed doubles of young people had done exactly the same thing on exactly the same spot at about the same time of year. The young people changed and made way for others in th...
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

- Title: THE HEDGEHOG
- Author: Author: Saki
- Start: The Hedgehog A ?Mixed Double? of young people were contesting a game of lawn tennis at the Rectory garden party; for the past five-and-twenty years at least mixed doubles of young people had done exactly the same thing on exactly the same spot at about the same time of year. The young people changed and made way for others in th...
- End: ...ut of the window. Taken in heaps of people; they all read up Popple and think it’s old Harry Nicholson’s ghost; we always stop them from writing to the papers about it, though. That would be carrying matters too far.” Mrs. Hatch-Mallard renewed the lease in due course, but Ada Bleek has never renewed her friendship.

## Heading Examples

- Source tale heading: THE HEDGEHOG
- First readable prose: A ?Mixed Double? of young people were contesting a game of lawn tennis at
