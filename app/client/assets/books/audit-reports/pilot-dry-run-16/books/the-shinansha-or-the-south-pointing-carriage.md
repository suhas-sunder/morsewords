# Pilot Dry Run 16: the-shinansha-or-the-south-pointing-carriage

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE “SHINANSHA,” OR THE SOUTH POINTING CARRIAGE.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The “Shinansha,” or the South Pointing Carriage
- Title evidence: source body heading line 49 - THE ?SHINANSHA,? OR THE SOUTH POINTING CARRIAGE
- Expected author: Yei Theodora Ozaki
- Author evidence: Gutenberg Author line line 13 - Author: Yei Theodora Ozaki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The “Shinansha,” or the South Pointing Carriage
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: The compass, with its needle always pointing to the North, is quite a
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: The compass, with its needle always pointing to the North, is quite a common thing, and no one thinks that it is remarkable now, though when it was first invented it must have been a wonder. Now long ago in China, there was a still more wonderful invention called the shinansha. This was a kind of chariot with the fi...
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

- Title: THE ?SHINANSHA,? OR THE SOUTH POINTING CARRIAGE
- Author: Author: Yei Theodora Ozaki
- Start: The “Shinansha,” or the South Pointing Carriage The compass, with its needle always pointing to the North, is quite a common thing, and no one thinks that it is remarkable now, though when it was first invented it must have been a wonder. Now long ago in China, there was a still more wonderful invention called the shinansha. This was a kind of chariot with the fi...
- End: ...s of the Palace, who had been left behind disappointed, could see them no more. After some time a bow and an arrow dropped to the earth in the courtyard of the Palace. They were recognized as having belonged to the Emperor Kotei. The courtiers took them up carefully and preserved them as sacred relics in the Palace.

## Heading Examples

- Source tale heading: THE ?SHINANSHA,? OR THE SOUTH POINTING CARRIAGE
- First readable prose: The compass, with its needle always pointing to the North, is quite a
