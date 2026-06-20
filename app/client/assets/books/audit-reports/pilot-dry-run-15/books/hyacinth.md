# Pilot Dry Run 15: hyacinth

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/HYACINTH.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Hyacinth
- Title evidence: source body heading line 63 - HYACINTH
- Expected author: Saki
- Author evidence: Gutenberg Author line line 13 - Author: Saki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Hyacinth
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: “The new fashion of introducing the candidate’s children into an election
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: ?The new fashion of introducing the candidate?s children into an election contest is a pretty one,? said Mrs. Panstreppon; ?it takes away something from the acerbity of party warfare, and it makes an interesting experience for children to look back on in after years. Still, if you will listen to my advice, Matilda,...
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

- Title: HYACINTH
- Author: Author: Saki
- Start: Hyacinth ?The new fashion of introducing the candidate?s children into an election contest is a pretty one,? said Mrs. Panstreppon; ?it takes away something from the acerbity of party warfare, and it makes an interesting experience for children to look back on in after years. Still, if you will listen to my advice, Matilda,...
- End: ... time I shall let him go to an election,” exclaimed his mother. “There I think you are going to extremes,” said Mrs. Panstreppon; “if there should be a general election in Mexico I think you might safely let him go there, but I doubt whether our English politics are suited to the rough and tumble of an angel-child.”

## Heading Examples

- Source tale heading: HYACINTH
- First readable prose: ?The new fashion of introducing the candidate?s children into an election
