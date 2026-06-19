# Pilot Dry Run 11: the-shadow

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Shadow.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Shadow
- Title evidence: source body heading line 45 - THE SHADOW
- Expected author: H. C. Andersen
- Author evidence: Gutenberg Author line line 13 - Author: H. C. Andersen
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Shadow
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: It is in the hot lands that the sun burns
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: It is in the hot lands that the sun burns, sure enough! there the people become quite a mahogany brown, ay, and in the HOTTEST lands they are burnt to Negroes. But now it was only to the HOT lands that a learned man had come from the cold; there he thought that he could run about just as when at home, but he soon fo...
- Duplicate/near-duplicate slug check: Review required if selected: possible generated slug overlap with the-shadow-over-innsmouth.
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

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: THE SHADOW
- Author: Author: H. C. Andersen
- Start: The Shadow It is in the hot lands that the sun burns, sure enough! there the people become quite a mahogany brown, ay, and in the HOTTEST lands they are burnt to Negroes. But now it was only to the HOT lands that a learned man had come from the cold; there he thought that he could run about just as when at home, but he soon fo...
- End: ssary to do away with him in all stillness!? ?It is certainly hard,? said the shadow, ?for he was a faithful servant!? and then he gave a sort of sigh. ?You are a noble character!? said the princess. The whole city was illuminated in the evening, and the cannons went off with a bum! bum! and the soldiers presented a...

## Heading Examples

- First readable prose: It is in the hot lands that the sun burns
