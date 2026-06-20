# Pilot Dry Run 15: excepting-mrs-pentherby

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/EXCEPTING MRS. PENTHERBY.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Excepting Mrs. Pentherby
- Title evidence: source body heading line 63 - EXCEPTING MRS. PENTHERBY
- Expected author: Saki
- Author evidence: Gutenberg Author line line 13 - Author: Saki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Excepting Mrs. Pentherby
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: It was Reggie Bruttle’s own idea for converting what had threatened to be
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: It was Reggie Bruttle?s own idea for converting what had threatened to be an albino elephant into a beast of burden that should help him along the stony road of his finances. ?The Limes,? which had come to him by inheritance without any accompanying provision for its upkeep, was one of those pretentious, unaccommoda...
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

- Title: EXCEPTING MRS. PENTHERBY
- Author: Author: Saki
- Start: Excepting Mrs. Pentherby It was Reggie Bruttle?s own idea for converting what had threatened to be an albino elephant into a beast of burden that should help him along the stony road of his finances. ?The Limes,? which had come to him by inheritance without any accompanying provision for its upkeep, was one of those pretentious, unaccommoda...
- End: ...hole houseful of women—and all in the cause of peace.” “I think you are the most odious person in the whole world,” said Reggie’s sister-in-law. Which was not strictly true; more than anybody, more than ever she disliked Mrs. Pentherby. It was impossible to calculate how many quarrels that woman had done her out of.

## Heading Examples

- Source tale heading: EXCEPTING MRS. PENTHERBY
- First readable prose: It was Reggie Bruttle?s own idea for converting what had threatened to be
