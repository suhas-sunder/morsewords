# Pilot Dry Run 16: the-sheep

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE SHEEP.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Sheep
- Title evidence: source body heading line 63 - THE SHEEP
- Expected author: Saki
- Author evidence: Gutenberg Author line line 13 - Author: Saki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Sheep
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: The enemy had declared “no trumps.”  Rupert played out his ace and king
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: The enemy had declared ?no trumps.? Rupert played out his ace and king of clubs and cleared the adversary of that suit; then the Sheep, whom the Fates had inflicted on him for a partner, took the third round with the queen of clubs, and, having no other club to lead back, opened another suit. The enemy won the remai...
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

- Title: THE SHEEP
- Author: Author: Saki
- Start: The Sheep The enemy had declared ?no trumps.? Rupert played out his ace and king of clubs and cleared the adversary of that suit; then the Sheep, whom the Fates had inflicted on him for a partner, took the third round with the queen of clubs, and, having no other club to lead back, opened another suit. The enemy won the remai...
- End: ...initely disappeared under the ice-rift. Kathleen Athling and her husband stay the greater part of the year with Rupert, and a small Robbie stands in some danger of being idolised by a devoted uncle. But for twelve months of the year Rupert’s most inseparable and valued companion is a sturdy tawny and white yard-dog.

## Heading Examples

- Source tale heading: THE SHEEP
- First readable prose: The enemy had declared ?no trumps.? Rupert played out his ace and king
