# Pilot Dry Run 21: the-flying-man

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE FLYING MAN.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Flying Man
- Title evidence: source body heading line 65 - THE FLYING MAN
- Expected author: H. G. Wells
- Author evidence: Gutenberg Author line line 13 - Author: H. G. Wells
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: Gutenberg Author line line 13: Author: H. G. Wells
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Flying Man
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: The Ethnologist looked at the _bhimraj_ feather thoughtfully.
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: The Ethnologist looked at the _bhimraj_ feather thoughtfully. "They seemed loth to part with it," he said. "It is sacred to the Chiefs," said the lieutenant; "just as yellow silk, you know, is sacred to the Chinese Emperor." The Ethnologist did not answer. He hesitated. Then opening the topic abruptly, "What on eart...
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

- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: THE FLYING MAN
- Author: Author: H. G. Wells
- Metadata: Author: H. G. Wells
- Start: The Flying Man The Ethnologist looked at the _bhimraj_ feather thoughtfully. "They seemed loth to part with it," he said. "It is sacred to the Chiefs," said the lieutenant; "just as yellow silk, you know, is sacred to the Chinese Emperor." The Ethnologist did not answer. He hesitated. Then opening the topic abruptly, "What on eart...
- End: ...ld scarcely credit it, but when they got to the ridge at last, they found two more of the Sepoys had jumped over." "The rest were all right?" asked the Ethnologist. "Yes," said the lieutenant; "the rest were all right, barring a certain thirst, you know." And at the memory he helped himself to soda and whisky again.

## Heading Examples

- Source tale heading: THE FLYING MAN
- First readable prose: The Ethnologist looked at the _bhimraj_ feather thoughtfully.
