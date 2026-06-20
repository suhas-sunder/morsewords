# Pilot Dry Run 15: fate

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/FATE.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Fate
- Title evidence: source body heading line 63 - FATE
- Expected author: Saki
- Author evidence: Gutenberg Author line line 13 - Author: Saki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Fate
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Rex Dillot was nearly twenty-four, almost good-looking and quite
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Rex Dillot was nearly twenty-four, almost good-looking and quite penniless. His mother was supposed to make him some sort of an allowance out of what her creditors allowed her, and Rex occasionally strayed into the ranks of those who earn fitful salaries as secretaries or companions to people who are unable to cope...
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

- Title: FATE
- Author: Author: Saki
- Start: Fate Rex Dillot was nearly twenty-four, almost good-looking and quite penniless. His mother was supposed to make him some sort of an allowance out of what her creditors allowed her, and Rex occasionally strayed into the ranks of those who earn fitful salaries as secretaries or companions to people who are unable to cope...
- End: ... The billiard table had suffered most, and had to be laid up for repairs; perhaps it was not the best place to have chosen for the scene of salvage operations; but then, as Clovis remarked, when one is rushing about with a blazing woman in one’s arms one can’t stop to think out exactly where one is going to put her.

## Heading Examples

- Source tale heading: FATE
- First readable prose: Rex Dillot was nearly twenty-four, almost good-looking and quite
