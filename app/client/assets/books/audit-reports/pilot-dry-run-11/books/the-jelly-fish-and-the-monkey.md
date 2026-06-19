# Pilot Dry Run 11: the-jelly-fish-and-the-monkey

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE JELLY FISH AND THE MONKEY.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Jelly Fish and the Monkey
- Title evidence: source body heading line 47 - THE JELLY FISH AND THE MONKEY
- Expected author: Yei Theodora Ozaki
- Author evidence: Gutenberg Author line line 13 - Author: Yei Theodora Ozaki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: The Jelly Fish and the Monkey
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Long, long ago, in old Japan, the Kingdom of the Sea
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Long, long ago, in old Japan, the Kingdom of the Sea was governed by a wonderful King. He was called Rin Jin, or the Dragon King of the Sea. His power was immense, for he was the ruler of all sea creatures both great and small, and in his keeping were the Jewels of the Ebb and Flow of the Tide. The Jewel of the Ebbi...
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

- Title: THE JELLY FISH AND THE MONKEY
- Author: Author: Yei Theodora Ozaki
- Start: The Jelly Fish and the Monkey Long, long ago, in old Japan, the Kingdom of the Sea was governed by a wonderful King. He was called Rin Jin, or the Dragon King of the Sea. His power was immense, for he was the ruler of all sea creatures both great and small, and in his keeping were the Jewels of the Ebb and Flow of the Tide. The Jewel of the Ebbi...
- End: beyond the Palace gates and threw him into the water. Here he was left to suffer and repent his foolish chattering, and to grow accustomed to his new state of bonelessness. From this story it is evident that in former times the jelly fish once had a shell and bones something like a tortoise, but, ever since the Drag...

## Heading Examples

- First readable prose: Long, long ago, in old Japan, the Kingdom of the Sea
