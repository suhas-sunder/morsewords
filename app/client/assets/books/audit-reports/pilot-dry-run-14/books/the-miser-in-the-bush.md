# Pilot Dry Run 14: the-miser-in-the-bush

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE MISER IN THE BUSH.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Miser in the Bush
- Title evidence: source body heading line 43 - THE MISER IN THE BUSH
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Miser in the Bush
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: A farmer had a faithful and diligent servant, who had worked hard for
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: A farmer had a faithful and diligent servant, who had worked hard for him three years, without having been paid any wages. At last it came into the man?s head that he would not go on thus without pay any longer; so he went to his master, and said, ?I have worked hard for you a long time, I will trust to you to give...
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

- Title: THE MISER IN THE BUSH
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: The Miser in the Bush A farmer had a faithful and diligent servant, who had worked hard for him three years, without having been paid any wages. At last it came into the man?s head that he would not go on thus without pay any longer; so he went to his master, and said, ?I have worked hard for you a long time, I will trust to you to give...
- End: ...Tell us now, you vagabond, where you got that gold, or I shall play on for your amusement only,’ ‘I stole it,’ said the miser in the presence of all the people; ‘I acknowledge that I stole it, and that you earned it fairly.’ Then the countryman stopped his fiddle, and left the miser to take his place at the gallows.

## Heading Examples

- Source tale heading: THE MISER IN THE BUSH
- First readable prose: A farmer had a faithful and diligent servant, who had worked hard for
