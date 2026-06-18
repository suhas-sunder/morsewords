# Pilot Dry Run 9: deep-sea-plunderings

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/Deep-Sea Plunderings.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Deep-Sea Plunderings
- Title evidence: Gutenberg Title line line 11 - Title: Deep-Sea Plunderings
- Expected author: Frank Thomas Bullen
- Author evidence: Gutenberg Author line line 13 - Author: Frank Thomas Bullen
- Apparent work type: essay/nonfiction
- Detected structural convention: story or titled-section headings after contents/illustration lists
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: THROUGH FIRE AND WATER
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at THROUGH FIRE AND WATER: What a clumsy, barrel-bellied old hooker she is
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use the 24 contents-listed story headings beginning with THROUGH FIRE AND WATER; exclude prefatory note, contents, illustration list, and publisher ads; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 24 planned story or titled-section headings after contents/illustration lists sections unless a future write inspection demotes true front/back matter
- Likely section count: 24
- Expected preview start: What a clumsy, barrel-bellied old hooker she is, Field!? Thus, closing his telescope with a bang, the elegant chief officer of the Mirzapore, steel four-masted clipper ship of 5000 tons burden, presently devouring the degrees of longitude that lay between her and Melbourne on the arc of a composite great circle, at...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- contents or list material must not enter default playback
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default
- illustration captions/placeholders must be removed from default playback

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback

## Segmentation Risks

- structure audit recommends processing with warnings; write pass must verify boundaries directly from raw source
- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- illustration captions/placeholders detected

## Supporting Snippets

- Title: Title: Deep-Sea Plunderings
- Author: Author: Frank Thomas Bullen
- Start: THROUGH FIRE AND WATER What a clumsy, barrel-bellied old hooker she is, Field!? Thus, closing his telescope with a bang, the elegant chief officer of the Mirzapore, steel four-masted clipper ship of 5000 tons burden, presently devouring the degrees of longitude that lay between her and Melbourne on the arc of a composite great circle, at...
- End: esses all these qualities.... Almost bare of synthetical decoration, his paragraphs are stirring because they are real. We read at times--as we have read the great masters of romance--breathlessly.?--_The Critic._ =The Translation of a Savage.= $1.25. ?A book which no one will be satisfied to put down until the end...

## Heading Examples

- THROUGH FIRE AND WATER
- THE OLD HOUSE ON THE HILL
- YOU SING
- THE DEBT OF THE WHALE
- THE SKIPPER'S WIFE
- A SCIENTIFIC CRUISE
