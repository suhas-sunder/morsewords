# Pilot Dry Run 19: the-story-of-a-gazelle

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE STORY OF A GAZELLE.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Story of a Gazelle
- Title evidence: source body heading line 52 - THE STORY OF A GAZELLE
- Expected author: Andrew Lang
- Author evidence: Gutenberg Author line line 13 - Author: Andrew Lang
- Expected author/compiler/collector/translator/reteller role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Metadata evidence: Gutenberg Author line line 13: Author: Andrew Lang; visible editor byline line 42: Edited By Andrew Lang
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Story of a Gazelle
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Once upon a time there lived a man who wasted all his money, and grew
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Once upon a time there lived a man who wasted all his money, and grew so poor that his only food was a few grains of corn, which he scratched like a fowl from out of a dust-heap. One day he was scratching as usual among a dust-heap in the street, hoping to find something for breakfast, when his eye fell upon a small...
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
- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: THE STORY OF A GAZELLE
- Author: Author: Andrew Lang
- Metadata: Author: Andrew Lang; Edited By Andrew Lang
- Start: The Story of a Gazelle Once upon a time there lived a man who wasted all his money, and grew so poor that his only food was a few grains of corn, which he scratched like a fowl from out of a dust-heap. One day he was scratching as usual among a dust-heap in the street, hoping to find something for breakfast, when his eye fell upon a small...
- End: ...days of mourning were at an end, the wife was sleeping at her husband’s side, and in her sleep she dreamed that she was once more in her father’s house, and when she woke up it was no dream. And the man dreamed that he was on the dust-heap, scratching. And when he woke, behold! that also was no dream, but the truth.

## Heading Examples

- Source tale heading: THE STORY OF A GAZELLE
- First readable prose: Once upon a time there lived a man who wasted all his money, and grew
