# Pilot Dry Run 11: the-adventures-of-kintaro-the-golden-boy

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE ADVENTURES OF KINTARO, THE GOLDEN BOY.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Adventures of Kintaro, the Golden Boy
- Title evidence: source body heading line 49 - THE ADVENTURES OF KINTARO, THE GOLDEN BOY
- Expected author: Yei Theodora Ozaki
- Author evidence: Gutenberg Author line line 13 - Author: Yei Theodora Ozaki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: The Adventures of Kintaro, the Golden Boy
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Long, long ago there lived in Kyoto
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Long, long ago there lived in Kyoto a brave soldier named Kintoki. Now he fell in love with a beautiful lady and married her. Not long after this, through the malice of some of his friends, he fell into disgrace at Court and was dismissed. This misfortune so preyed upon his mind that he did not long survive his dism...
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

- None.

## Illustration/Page/Footnote Risks

- illustration captions/placeholders detected

## Supporting Snippets

- Title: THE ADVENTURES OF KINTARO, THE GOLDEN BOY
- Author: Author: Yei Theodora Ozaki
- Start: The Adventures of Kintaro, the Golden Boy Long, long ago there lived in Kyoto a brave soldier named Kintoki. Now he fell in love with a beautiful lady and married her. Not long after this, through the malice of some of his friends, he fell into disgrace at Court and was dismissed. This misfortune so preyed upon his mind that he did not long survive his dism...
- End: re stricken with fear. Lord Raiko ordered Kintaro to the rescue. He immediately started off, delighted at the prospect of trying his sword. Surprising the monster in its den, he made short work of cutting off its great head, which he carried back in triumph to his master. Kintaro now rose to be the greatest hero of...

## Heading Examples

- First readable prose: Long, long ago there lived in Kyoto
