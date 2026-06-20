# Pilot Dry Run 17: a-lost-paradise

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/A Lost Paradise.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: A Lost Paradise
- Title evidence: source body heading line 46 - A Lost Paradise
- Expected author: Andrew Lang
- Author evidence: Gutenberg Author line line 13 - Author: Andrew Lang
- Expected author/compiler/collector/translator/reteller role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Metadata evidence: Gutenberg Author line line 13: Author: Andrew Lang; visible editor byline line 32: Edited by Andrew Lang
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: A Lost Paradise
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: In the middle of a great forest there lived a long time ago a
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: In the middle of a great forest there lived a long time ago a charcoal-burner and his wife. They were both young and handsome and strong, and when they got married, they thought work would never fail them. But bad times came, and they grew poorer and poorer, and the nights in which they went hungry to bed became mor...
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

- Title: A Lost Paradise
- Author: Author: Andrew Lang
- Metadata: Author: Andrew Lang; Edited by Andrew Lang
- Start: A Lost Paradise In the middle of a great forest there lived a long time ago a charcoal-burner and his wife. They were both young and handsome and strong, and when they got married, they thought work would never fail them. But bad times came, and they grew poorer and poorer, and the nights in which they went hungry to bed became mor...
- End: ...mouse has escaped.’ ‘A guard of soldiers will take you back to your hut,’ said the king. ‘Your wife has the key.’ ‘Weren’t they silly?’ cried the grandchildren of the charcoal-burners when they heard the story. ‘How we wish that we had had the chance! WE should never have wanted to know what was in the soup-tureen!’

## Heading Examples

- Source tale heading: A Lost Paradise
- First readable prose: In the middle of a great forest there lived a long time ago a
