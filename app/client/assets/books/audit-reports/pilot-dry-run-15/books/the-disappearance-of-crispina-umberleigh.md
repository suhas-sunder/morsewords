# Pilot Dry Run 15: the-disappearance-of-crispina-umberleigh

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE DISAPPEARANCE OF CRISPINA UMBERLEIGH.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Disappearance of Crispina Umberleigh
- Title evidence: source body heading line 63 - THE DISAPPEARANCE OF CRISPINA UMBERLEIGH
- Expected author: Saki
- Author evidence: Gutenberg Author line line 13 - Author: Saki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Disappearance of Crispina Umberleigh
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: In a first-class carriage of a train speeding Balkanward across the flat,
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: In a first-class carriage of a train speeding Balkanward across the flat, green Hungarian plain two Britons sat in friendly, fitful converse. They had first foregathered in the cold grey dawn at the frontier line, where the presiding eagle takes on an extra head and Teuton lands pass from Hohenzollern to Habsburg ke...
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

- Title: THE DISAPPEARANCE OF CRISPINA UMBERLEIGH
- Author: Author: Saki
- Start: The Disappearance of Crispina Umberleigh In a first-class carriage of a train speeding Balkanward across the flat, green Hungarian plain two Britons sat in friendly, fitful converse. They had first foregathered in the cold grey dawn at the frontier line, where the presiding eagle takes on an extra head and Teuton lands pass from Hohenzollern to Habsburg ke...
- End: ...ring. Her husband, however, never accomplished anything great in the political world after her return; the strain of trying to account satisfactorily for an unspecified expenditure of sixteen thousand pounds spread over eight years sufficiently occupied his mental energies. Here is Belgrad and another custom house.”

## Heading Examples

- Source tale heading: THE DISAPPEARANCE OF CRISPINA UMBERLEIGH
- First readable prose: In a first-class carriage of a train speeding Balkanward across the flat,
