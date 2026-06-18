# Pilot Dry Run 9: five-little-peppers-at-school

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/Five Little Peppers at School.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Five Little Peppers at School
- Title evidence: Gutenberg Title line line 11 - Title: Five Little Peppers at School
- Expected author: Margaret Sidney
- Author evidence: Gutenberg Author line line 13 - Author: Margaret Sidney
- Apparent work type: story collection
- Detected structural convention: bare roman chapter-title headings
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: I HARD TIMES FOR JOEL
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at I HARD TIMES FOR JOEL: Come on, Pepper.
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use the 25 contents-listed roman chapter headings beginning with I HARD TIMES FOR JOEL; exclude title page, book list, contents, and illustrations; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 25 planned bare roman chapter-title headings sections unless a future write inspection demotes true front/back matter
- Likely section count: 25
- Expected preview start: Come on, Pepper." One of the boys rushed down the dormitory hall, giving a bang on Joel's door as he passed. "All right," said Joel a bit crossly, "I'm coming." "Last bell," came back on the wind. Joel threw his tennis racket on the bed, and scowled. Just then a flaxen head peeped in, and two big eyes stared at him....
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- contents or list material must not enter default playback
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

- ensure the generated title stays the collection title and individual story titles become sections

## Illustration/Page/Footnote Risks

- illustration captions/placeholders detected

## Supporting Snippets

- Title: Title: Five Little Peppers at School
- Author: Author: Margaret Sidney
- Start: I HARD TIMES FOR JOEL Come on, Pepper." One of the boys rushed down the dormitory hall, giving a bang on Joel's door as he passed. "All right," said Joel a bit crossly, "I'm coming." "Last bell," came back on the wind. Joel threw his tennis racket on the bed, and scowled. Just then a flaxen head peeped in, and two big eyes stared at him....
- End: lope to Mr. King. "It's for Mrs. Fisher," said the old gentleman. So the yellow envelope went down the table-length, the color going out of Polly's cheek; and she didn't dare to look at Mamsie's eyes. "Oh--the boys!" gasped Polly. "Jasper, do you suppose?"--What, she didn't finish; for Mother Fisher just then cried...

## Heading Examples

- I HARD TIMES FOR JOEL
- II THE TENNIS MATCH
- III A NARROW ESCAPE
- IV OF VARIOUS THINGS
- V AT SILVIA HORNE'S
- VI THE ACCIDENT
