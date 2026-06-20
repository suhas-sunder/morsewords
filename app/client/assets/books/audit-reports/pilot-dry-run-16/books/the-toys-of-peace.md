# Pilot Dry Run 16: the-toys-of-peace

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE TOYS OF PEACE.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Toys of Peace
- Title evidence: source body heading line 37 - THE TOYS OF PEACE
- Expected author: Saki
- Author evidence: Gutenberg Author line line 13 - Author: Saki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Toys of Peace
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: “Harvey,” said Eleanor Bope, handing her brother a cutting from a London
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: ?Harvey,? said Eleanor Bope, handing her brother a cutting from a London morning paper of the 19th of March, ?just read this about children?s toys, please; it exactly carries out some of our ideas about influence and upbringing.? ?In the view of the National Peace Council,? ran the extract, ?there are grave objectio...
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

- Title: THE TOYS OF PEACE
- Author: Author: Saki
- Start: The Toys of Peace ?Harvey,? said Eleanor Bope, handing her brother a cutting from a London morning paper of the 19th of March, ?just read this about children?s toys, please; it exactly carries out some of our ideas about influence and upbringing.? ?In the view of the National Peace Council,? ran the extract, ?there are grave objectio...
- End: ... ink over the devoted building—“and the surviving five hundred are dragged off to the French ships. ‘I have lost a Marshal,’ says Louis, ‘but I do not go back empty-handed.’” Harvey stole away from the room, and sought out his sister. “Eleanor,” he said, “the experiment—” “Yes?” “Has failed. We have begun too late.”

## Heading Examples

- Source tale heading: THE TOYS OF PEACE
- First readable prose: ?Harvey,? said Eleanor Bope, handing her brother a cutting from a London
