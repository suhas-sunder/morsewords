# Pilot Dry Run 16: momotaro-or-the-story-of-the-son-of-a-peach

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/MOMOTARO, OR THE STORY OF THE SON OF A PEACH.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Momotaro, or the Story of the Son of a Peach
- Title evidence: source body heading line 49 - MOMOTARO, OR THE STORY OF THE SON OF A PEACH
- Expected author: Yei Theodora Ozaki
- Author evidence: Gutenberg Author line line 13 - Author: Yei Theodora Ozaki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Momotaro, or the Story of the Son of a Peach
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Long, long ago there lived, an old man and an old woman; they were
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Long, long ago there lived, an old man and an old woman; they were peasants, and had to work hard to earn their daily rice. The old man used to go and cut grass for the farmers around, and while he was gone the old woman, his wife, did the work of the house and worked in their own little rice field. One day the old...
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

- Title: MOMOTARO, OR THE STORY OF THE SON OF A PEACH
- Author: Author: Yei Theodora Ozaki
- Start: Momotaro, or the Story of the Son of a Peach Long, long ago there lived, an old man and an old woman; they were peasants, and had to work hard to earn their daily rice. The old man used to go and cut grass for the farmers around, and while he was gone the old woman, his wife, did the work of the house and worked in their own little rice field. One day the old...
- End: ...f Momotaro on his triumphant return, and rejoiced that the country was now freed from the robber devils who had been a terror of the land for a long time. The old couple’s joy was greater than ever, and the treasure Momotaro had brought home with him enabled them to live in peace and plenty to the end of their days.

## Heading Examples

- Source tale heading: MOMOTARO, OR THE STORY OF THE SON OF A PEACH
- First readable prose: Long, long ago there lived, an old man and an old woman; they were
