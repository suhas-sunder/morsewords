# Pilot Dry Run 11: cool-air

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/Cool air.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Cool Air
- Title evidence: source body heading line 36 - Cool Air
- Expected author: H. P. Lovecraft
- Author evidence: Gutenberg Author line line 13 - Author: H. P. Lovecraft
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Cool Air
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: You ask me to explain why I am afraid of a draft of cool air
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: You ask me to explain why I am afraid of a draft of cool air; why I shiver more than others upon entering a cold room, and seem nauseated and repelled when the chill of evening creeps through the heat of a mild autumn day. There are those who say I respond to cold as others do to a bad odor, and I am the last to den...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
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

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Cool Air
- Author: Author: H. P. Lovecraft
- Start: Cool Air You ask me to explain why I am afraid of a draft of cool air; why I shiver more than others upon entering a cold room, and seem nauseated and repelled when the chill of evening creeps through the heat of a mild autumn day. There are those who say I respond to cold as others do to a bad odor, and I am the last to den...
- End: t hellish place to babble their incoherent stories at the nearest police station. The nauseous words seemed well-nigh incredible in that yellow sunlight, with the clatter of cars and motor trucks ascending clamorously from crowded Fourteenth Street, yet I confess that I believed them then. Whether I believe them now...

## Heading Examples

- First readable prose: You ask me to explain why I am afraid of a draft of cool air
