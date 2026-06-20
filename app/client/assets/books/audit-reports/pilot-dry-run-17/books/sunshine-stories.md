# Pilot Dry Run 17: sunshine-stories

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/SUNSHINE STORIES.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Sunshine Stories
- Title evidence: source body heading line 137 - SUNSHINE STORIES
- Expected author: H. C. Andersen
- Author evidence: Gutenberg Author line line 13 - Author: H. C. Andersen
- Expected author/compiler/collector/translator/reteller role: author: H. C. Andersen; editor: J. H. Stickney
- Metadata evidence: Gutenberg Author line line 13: Author: H. C. Andersen; Gutenberg Editor line line 15: Editor: J. H. Stickney
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: Sunshine Stories
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: "I AM going to tell a story," said the Wind.
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: "I AM going to tell a story," said the Wind. "I beg your pardon," said the Rain, "but now it is my turn. Have you not been howling round the corner this long time, as hard as ever you could?" "Is this the gratitude you owe me?" said the Wind; "I, who in honor of you turn inside out--yes, even break--all the umbrella...
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

- J. H. Stickney is source-backed as editor and must not replace H. C. Andersen in the author field

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- illustration captions/placeholders detected

## Supporting Snippets

- Title: SUNSHINE STORIES
- Author: Author: H. C. Andersen
- Metadata: Author: H. C. Andersen; Editor: J. H. Stickney
- Start: Sunshine Stories "I AM going to tell a story," said the Wind. "I beg your pardon," said the Rain, "but now it is my turn. Have you not been howling round the corner this long time, as hard as ever you could?" "Is this the gratitude you owe me?" said the Wind; "I, who in honor of you turn inside out--yes, even break--all the umbrella...
- End: ...ul home, content even in their poverty. And so their life became a real Sunshine Story." "I think we had better stop now," said the Wind. "I am dreadfully bored. The Sunshine has talked long enough." "I think so, too," said the Rain. And what do we others who have heard the story say? We say, "Now the story's done."

## Heading Examples

- Source tale heading: SUNSHINE STORIES
- First readable prose: "I AM going to tell a story," said the Wind.
