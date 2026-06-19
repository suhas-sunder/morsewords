# Pilot Dry Run 13: doctor-knowall

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/DOCTOR KNOWALL.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Doctor Knowall
- Title evidence: source body heading line 43 - DOCTOR KNOWALL
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Doctor Knowall
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: There was once upon a time a poor peasant called Crabb, who drove with
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: There was once upon a time a poor peasant called Crabb, who drove with two oxen a load of wood to the town, and sold it to a doctor for two talers. When the money was being counted out to him, it so happened that the doctor was sitting at table, and when the peasant saw how well he ate and drank, his heart desired w...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed
- illustration captions/placeholders must be removed from default playback

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

- illustration captions/placeholders detected

## Supporting Snippets

- Title: DOCTOR KNOWALL
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: Doctor Knowall There was once upon a time a poor peasant called Crabb, who drove with two oxen a load of wood to the town, and sold it to a doctor for two talers. When the money was being counted out to him, it so happened that the doctor was sitting at table, and when the peasant saw how well he ate and drank, his heart desired w...
- End: e. But the doctor sat still and opened his A B C book, turned the pages backwards and forwards, and looked for the cock. As he could not find it immediately he said: ?I know you are there, so you had better come out!? Then the fellow in the stove thought that the doctor meant him, and full of terror, sprang out, cry...

## Heading Examples

- First readable prose: There was once upon a time a poor peasant called Crabb, who drove with
