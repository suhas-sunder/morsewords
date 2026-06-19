# Pilot Dry Run 12: the-story-of-urashima-taro-the-fisher-lad

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE STORY OF URASHIMA TARO, THE FISHER LAD.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Story of Urashima Taro, the Fisher Lad
- Title evidence: source body heading line 47 - THE STORY OF URASHIMA TARO, THE FISHER LAD
- Expected author: Yei Theodora Ozaki
- Author evidence: Gutenberg Author line line 13 - Author: Yei Theodora Ozaki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: The Story of Urashima Taro, the Fisher Lad
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Long, long ago in the province of Tango
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Long, long ago in the province of Tango there lived on the shore of Japan in the little fishing village of Mizu-no-ye a young fisherman named Urashima Taro. His father had been a fisherman before him, and his skill had more than doubly descended to his son, for Urashima was the most skillful fisher in all that count...
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

- Title: THE STORY OF URASHIMA TARO, THE FISHER LAD
- Author: Author: Yei Theodora Ozaki
- Start: The Story of Urashima Taro, the Fisher Lad Long, long ago in the province of Tango there lived on the shore of Japan in the little fishing village of Mizu-no-ye a young fisherman named Urashima Taro. His father had been a fisherman before him, and his skill had more than doubly descended to his son, for Urashima was the most skillful fisher in all that count...
- End: the sea. Urashima, who had been till that moment like a strong and handsome youth of twenty-four, suddenly became very, very old. His back doubled up with age, his hair turned snowy white, his face wrinkled and he fell down dead on the beach. Poor Urashima! because of his disobedience he could never return to the Se...

## Heading Examples

- First readable prose: Long, long ago in the province of Tango
