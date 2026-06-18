# Pilot Dry Run 9: the-cats-of-ulthar

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Cats of Ulthar.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Cats of Ulthar
- Title evidence: Gutenberg Title line line 16 - Title: The Cats of Ulthar
- Expected author: Howard Phillips Lovecraft (1890-1937)
- Author evidence: Gutenberg Author line line 18 - Author: Howard Phillips Lovecraft (1890-1937)
- Apparent work type: standalone book
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: The Cats of Ulthar
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: It is said that in Ulthar
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: It is said that in Ulthar, which lies beyond the river Skai, no man may kill a cat; and this I can verily believe as I gaze upon him who sitteth purring before the fire. For the cat is cryptic, and close to strange things which men cannot see. He is the soul of antique Aegyptus, and bearer of tales from forgotten ci...
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

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Title: The Cats of Ulthar
- Author: Author: Howard Phillips Lovecraft (1890-1937)
- Start: The Cats of Ulthar It is said that in Ulthar, which lies beyond the river Skai, no man may kill a cat; and this I can verily believe as I gaze upon him who sitteth purring before the fire. For the cat is cryptic, and close to strange things which men cannot see. He is the soul of antique Aegyptus, and bearer of tales from forgotten ci...
- End: meat as reward. They talked of the old cotter and his wife, of the caravan of dark wanderers, of small Menes and his black kitten, of the prayer of Menes and of the sky during that prayer, of the doings of the cats on the night the caravan left, and of what was later found in the cottage under the dark trees in the...

## Heading Examples

- First readable prose: It is said that in Ulthar
