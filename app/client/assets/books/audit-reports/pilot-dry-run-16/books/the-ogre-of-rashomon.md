# Pilot Dry Run 16: the-ogre-of-rashomon

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE OGRE OF RASHOMON.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Ogre of Rashomon
- Title evidence: source body heading line 49 - THE OGRE OF RASHOMON
- Expected author: Yei Theodora Ozaki
- Author evidence: Gutenberg Author line line 13 - Author: Yei Theodora Ozaki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Ogre of Rashomon
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Long, long ago in Kyoto, the people of the city were terrified by
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Long, long ago in Kyoto, the people of the city were terrified by accounts of a dreadful ogre, who, it was said, haunted the Gate of Rashomon at twilight and seized whoever passed by. The missing victims were never seen again, so it was whispered that the ogre was a horrible cannibal, who not only killed the unhappy...
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

- Title: THE OGRE OF RASHOMON
- Author: Author: Yei Theodora Ozaki
- Start: The Ogre of Rashomon Long, long ago in Kyoto, the people of the city were terrified by accounts of a dreadful ogre, who, it was said, haunted the Gate of Rashomon at twilight and seized whoever passed by. The missing victims were never seen again, so it was whispered that the ogre was a horrible cannibal, who not only killed the unhappy...
- End: ...o. He waited in patience for another opportunity to dispatch the ogre. But the latter was afraid of Watanabe’s great strength and daring, and never troubled Kyoto again. So once more the people of the city were able to go out without fear even at night time, and the brave deeds of Watanabe have never been forgotten!

## Heading Examples

- Source tale heading: THE OGRE OF RASHOMON
- First readable prose: Long, long ago in Kyoto, the people of the city were terrified by
