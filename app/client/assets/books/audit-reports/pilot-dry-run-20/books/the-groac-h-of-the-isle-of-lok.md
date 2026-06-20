# Pilot Dry Run 20: the-groac-h-of-the-isle-of-lok

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Groac’h of the Isle of Lok.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Groac’h of the Isle of Lok
- Title evidence: source body heading line 46 - The Groac’h of the Isle of Lok
- Expected author: Andrew Lang
- Author evidence: Gutenberg Author line line 13 - Author: Andrew Lang
- Expected author/compiler/collector/translator/reteller role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Metadata evidence: Gutenberg Author line line 13: Author: Andrew Lang; visible editor byline line 32: Edited by Andrew Lang
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Groac’h of the Isle of Lok
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: In old times, when all kinds of wonderful things happened in Brittany
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: In old times, when all kinds of wonderful things happened in Brittany, there lived in the village of Lanillis, a young man named Houarn Pogamm and a girl called Bellah Postik. They were cousins, and as their mothers were great friends, and constantly in and out of each other’s houses, they had often been laid in the...
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

- future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: The Groac’h of the Isle of Lok
- Author: Author: Andrew Lang
- Metadata: Author: Andrew Lang; Edited by Andrew Lang
- Start: The Groac’h of the Isle of Lok In old times, when all kinds of wonderful things happened in Brittany, there lived in the village of Lanillis, a young man named Houarn Pogamm and a girl called Bellah Postik. They were cousins, and as their mothers were great friends, and constantly in and out of each other’s houses, they had often been laid in the...
- End: ... were married the next day, but instead of setting up housekeeping with the little cow and pig to fatten that they had so long wished for, they were able to buy lands for miles round for themselves, and gave each man who had been delivered from the Groac’h a small farm, where he lived happily to the end of his days.

## Heading Examples

- Source tale heading: The Groac’h of the Isle of Lok
- First readable prose: In old times, when all kinds of wonderful things happened in Brittany
