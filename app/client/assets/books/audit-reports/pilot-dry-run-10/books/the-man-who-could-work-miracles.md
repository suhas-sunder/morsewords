# Pilot Dry Run 10: the-man-who-could-work-miracles

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Man Who Could Work Miracles.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Man Who Could Work Miracles
- Title evidence: Gutenberg Title line line 10 - Title: Tales of Space and Time
- Expected author: Herbert George Wells
- Author evidence: Gutenberg Author line line 12 - Author: Herbert George Wells
- Apparent work type: individual story
- Detected structural convention: isolated titled sections
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: "Well?"
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at cleaned-body line 70: "Well?"
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Isolated title-case heading boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 5 planned isolated titled sections sections unless a future write inspection demotes true front/back matter
- Likely section count: 5
- Expected preview start: He could think of no way but the truth. "I was working a miracle." He tried to speak in an off-hand way, but try as he would he couldn't. "Working a??! 'Ere, don't you talk rot. Working a miracle, indeed! Miracle! Well, that's downright funny! Why, you's the chap[338] that don't believe in miracles.... Fact is, this...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback
- first default section is meaningful but should be verified manually in write pass

## Segmentation Risks

- structure audit recommends processing with warnings; write pass must verify boundaries directly from raw source

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Title: Tales of Space and Time
- Author: Author: Herbert George Wells
- Start: "Well?" He could think of no way but the truth. "I was working a miracle." He tried to speak in an off-hand way, but try as he would he couldn't. "Working a??! 'Ere, don't you talk rot. Working a miracle, indeed! Miracle! Well, that's downright funny! Why, you's the chap[338] that don't believe in miracles.... Fact is, this...
- End: nothing of all that is told here to this day. And among other things, of course, he still did not believe in miracles. "I tell you that miracles, properly speaking, can't possibly happen," he said, "whatever you like to hold. And I'm prepared to prove it up to the hilt." "That's what you think," said Toddy Beamish,...

## Heading Examples

- L70: "Well?"
- L146: "My dear Mr. Fotheringay! Of course! No?I didn't think."
- L180: "Joshua," said Mr. Maydig. "Why not? Stop it."
- L188: "H'm!" said Mr. Fotheringay. "Well." He sighed. "I'll try. Here?"
- L198: "Where's Maydig?
