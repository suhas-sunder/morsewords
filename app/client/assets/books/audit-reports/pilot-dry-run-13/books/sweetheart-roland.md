# Pilot Dry Run 13: sweetheart-roland

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/SWEETHEART ROLAND.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Sweetheart Roland
- Title evidence: source body heading line 42 - SWEETHEART ROLAND
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Sweetheart Roland
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: There was once upon a time a woman who was a real witch and had two
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: There was once upon a time a woman who was a real witch and had two daughters, one ugly and wicked, and this one she loved because she was her own daughter, and one beautiful and good, and this one she hated, because she was her stepdaughter. The stepdaughter once had a pretty apron, which the other fancied so much...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed

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

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: SWEETHEART ROLAND
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: Sweetheart Roland There was once upon a time a woman who was a real witch and had two daughters, one ugly and wicked, and this one she loved because she was her own daughter, and one beautiful and good, and this one she hated, because she was her stepdaughter. The stepdaughter once had a pretty apron, which the other fancied so much...
- End: er girls came and took her. When it came to her turn to sing, she stepped back, until at last she was the only one left, and then she could not refuse. But when she began her song, and it reached Roland?s ears, he sprang up and cried: ?I know the voice, that is the true bride, I will have no other!? Everything he ha...

## Heading Examples

- First readable prose: There was once upon a time a woman who was a real witch and had two
