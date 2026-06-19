# Pilot Dry Run 12: clever-hans

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/CLEVER HANS.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Clever Hans
- Title evidence: source body heading line 43 - CLEVER HANS
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Clever Hans
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: The mother of Hans said
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: The mother of Hans said: ?Whither away, Hans?? Hans answered: ?To Gretel.? ?Behave well, Hans.? ?Oh, I?ll behave well. Goodbye, mother.? ?Goodbye, Hans.? Hans comes to Gretel. ?Good day, Gretel.? ?Good day, Hans. What do you bring that is good?? ?I bring nothing, I want to have something given me.? Gretel presents H...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed

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

- Title: CLEVER HANS
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: Clever Hans The mother of Hans said: ?Whither away, Hans?? Hans answered: ?To Gretel.? ?Behave well, Hans.? ?Oh, I?ll behave well. Goodbye, mother.? ?Goodbye, Hans.? Hans comes to Gretel. ?Good day, Gretel.? ?Good day, Hans. What do you bring that is good?? ?I bring nothing, I want to have something given me.? Gretel presents H...
- End: did you take her?? ?I took her nothing.? ?What did Gretel give you?? ?She gave me nothing, she came with me.? ?Where have you left Gretel?? ?I led her by the rope, tied her to the rack, and scattered some grass for her.? ?That was ill done, Hans, you should have cast friendly eyes on her.? ?Never mind, will do bette...

## Heading Examples

- First readable prose: The mother of Hans said
