# Pilot Dry Run 11: the-goblin-of-adachigahara

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE GOBLIN OF ADACHIGAHARA.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Goblin of Adachigahara
- Title evidence: source body heading line 49 - THE GOBLIN OF ADACHIGAHARA
- Expected author: Yei Theodora Ozaki
- Author evidence: Gutenberg Author line line 13 - Author: Yei Theodora Ozaki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: The Goblin of Adachigahara
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Long, long ago there was a large plain called Adachigahara
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Long, long ago there was a large plain called Adachigahara, in the province of Mutsu in Japan. This place was said to be haunted by a cannibal goblin who took the form of an old woman. From time to time many travelers disappeared and were never heard of more, and the old women round the charcoal braziers in the even...
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

- Title: THE GOBLIN OF ADACHIGAHARA
- Author: Author: Yei Theodora Ozaki
- Start: The Goblin of Adachigahara Long, long ago there was a large plain called Adachigahara, in the province of Mutsu in Japan. This place was said to be haunted by a cannibal goblin who took the form of an old woman. From time to time many travelers disappeared and were never heard of more, and the old women round the charcoal braziers in the even...
- End: th the darkness of night the goblin vanished and he was safe. The priest now knew that he had met the Goblin of Adachigahara, the story of whom he had often heard but never believed to be true. He felt that he owed his wonderful escape to the protection of Buddha to whom he had prayed for help, so he took out his ro...

## Heading Examples

- First readable prose: Long, long ago there was a large plain called Adachigahara
