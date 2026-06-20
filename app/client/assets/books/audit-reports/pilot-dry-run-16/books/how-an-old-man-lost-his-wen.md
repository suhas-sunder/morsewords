# Pilot Dry Run 16: how-an-old-man-lost-his-wen

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/HOW AN OLD MAN LOST HIS WEN.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: How an Old Man Lost His Wen
- Title evidence: source body heading line 49 - HOW AN OLD MAN LOST HIS WEN
- Expected author: Yei Theodora Ozaki
- Author evidence: Gutenberg Author line line 13 - Author: Yei Theodora Ozaki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: How an Old Man Lost His Wen
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Many, many years ago there lived a good old man who had a wen like a
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Many, many years ago there lived a good old man who had a wen like a tennis-ball growing out of his right cheek. This lump was a great disfigurement to the old man, and so annoyed him that for many years he spent all his time and money in trying to get rid of it. He tried everything he could think of. He consulted m...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
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

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- illustration captions/placeholders detected

## Supporting Snippets

- Title: HOW AN OLD MAN LOST HIS WEN
- Author: Author: Yei Theodora Ozaki
- Start: How an Old Man Lost His Wen Many, many years ago there lived a good old man who had a wen like a tennis-ball growing out of his right cheek. This lump was a great disfigurement to the old man, and so annoyed him that for many years he spent all his time and money in trying to get rid of it. He tried everything he could think of. He consulted m...
- End: ...ng a horrible nightmare. No, sure enough there was now a great wen on the right side of his face as on the left. The demons had all disappeared, and there was nothing for him to do but to return home. He was a pitiful sight, for his face, with the two large lumps, one on each side, looked just like a Japanese gourd.

## Heading Examples

- Source tale heading: HOW AN OLD MAN LOST HIS WEN
- First readable prose: Many, many years ago there lived a good old man who had a wen like a
