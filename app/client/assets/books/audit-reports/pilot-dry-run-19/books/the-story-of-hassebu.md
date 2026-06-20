# Pilot Dry Run 19: the-story-of-hassebu

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE STORY OF HASSEBU.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Story of Hassebu
- Title evidence: source body heading line 52 - THE STORY OF HASSEBU
- Expected author: Andrew Lang
- Author evidence: Gutenberg Author line line 13 - Author: Andrew Lang
- Expected author/compiler/collector/translator/reteller role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Metadata evidence: Gutenberg Author line line 13: Author: Andrew Lang; visible editor byline line 42: Edited By Andrew Lang
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Story of Hassebu
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Once upon a time there lived a poor woman who had only one child, and
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Once upon a time there lived a poor woman who had only one child, and he was a little boy called Hassebu. When he ceased to be a baby, and his mother thought it was time for him to learn to read, she sent him to school. And, after he had done with school, he was put into a shop to learn how to make clothes, and did...
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

- Title: THE STORY OF HASSEBU
- Author: Author: Andrew Lang
- Metadata: Author: Andrew Lang; Edited By Andrew Lang
- Start: The Story of Hassebu Once upon a time there lived a poor woman who had only one child, and he was a little boy called Hassebu. When he ceased to be a baby, and his mother thought it was time for him to learn to read, she sent him to school. And, after he had done with school, he was put into a shop to learn how to make clothes, and did...
- End: ...d, and this is for you,” and he will drink it and die! and your soul will rest.’ And they went their way into the town, and all happened as the King of the Snakes had said. And the Sultan loved Hassebu, who became a great physician, and cured many sick people. But he was always sorry for the poor King of the Snakes.

## Heading Examples

- Source tale heading: THE STORY OF HASSEBU
- First readable prose: Once upon a time there lived a poor woman who had only one child, and
