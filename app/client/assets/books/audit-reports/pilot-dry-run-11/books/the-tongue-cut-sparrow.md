# Pilot Dry Run 11: the-tongue-cut-sparrow

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE TONGUE-CUT SPARROW.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Tongue-Cut Sparrow
- Title evidence: source body heading line 47 - THE TONGUE-CUT SPARROW
- Expected author: Yei Theodora Ozaki
- Author evidence: Gutenberg Author line line 13 - Author: Yei Theodora Ozaki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: The Tongue-Cut Sparrow
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Long, long ago in Japan there lived an old man
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Long, long ago in Japan there lived an old man and his wife. The old man was a good, kind-hearted, hard-working old fellow, but his wife was a regular cross-patch, who spoiled the happiness of her home by her scolding tongue. She was always grumbling about something from morning to night. The old man had for a long...
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

- Title: THE TONGUE-CUT SPARROW
- Author: Author: Yei Theodora Ozaki
- Start: The Tongue-Cut Sparrow Long, long ago in Japan there lived an old man and his wife. The old man was a good, kind-hearted, hard-working old fellow, but his wife was a regular cross-patch, who spoiled the happiness of her home by her scolding tongue. She was always grumbling about something from morning to night. The old man had for a long...
- End: at once, saying: ?Don?t blame the sparrow, it is your wickedness which has at last met with its reward. I only hope this may be a lesson to you in the future!? The old woman said nothing more, and from that day she repented of her cross, unkind ways, and by degrees became a good old woman, so that her husband hardly...

## Heading Examples

- First readable prose: Long, long ago in Japan there lived an old man
