# Pilot Dry Run 21: the-cone

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE CONE.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Cone
- Title evidence: source body heading line 17 - THE CONE
- Expected author: H. G. Wells
- Author evidence: Gutenberg Author line line 4 - Author: H. G. Wells
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: Gutenberg Author line line 4: Author: H. G. Wells
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Cone
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: The night was hot and overcast, the sky red, rimmed with the lingering sunset
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: The night was hot and overcast, the sky red, rimmed with the lingering sunset of mid-summer. They sat at the open window, trying to fancy the air was fresher there. The trees and shrubs of the garden stood stiff and dark; beyond in the roadway a gas-lamp burnt, bright orange against the hazy blue of the evening. Far...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- contents or list material must not enter default playback
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

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: THE CONE
- Author: Author: H. G. Wells
- Metadata: Author: H. G. Wells
- Start: The Cone The night was hot and overcast, the sky red, rimmed with the lingering sunset of mid-summer. They sat at the open window, trying to fancy the air was fresher there. The trees and shrubs of the garden stood stiff and dark; beyond in the roadway a gas-lamp burnt, bright orange against the hazy blue of the evening. Far...
- End: ...t, and flame came rushing up towards him. As it passed, he saw the cone clear again. Then he staggered back, and stood trembling, clinging to the rail with both hands. His lips moved, but no words came to them. Down below was the sound of voices and running steps. The clangour of rolling in the shed ceased abruptly.

## Heading Examples

- Source tale heading: THE CONE
- First readable prose: The night was hot and overcast, the sky red, rimmed with the lingering sunset
