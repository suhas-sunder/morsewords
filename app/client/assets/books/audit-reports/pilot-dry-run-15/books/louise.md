# Pilot Dry Run 15: louise

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/Louise.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Louise
- Title evidence: source body heading line 62 - LOUISE
- Expected author: Saki
- Author evidence: Gutenberg Author line line 13 - Author: Saki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Louise
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: “The tea will be quite cold, you’d better ring for some more,” said the
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: ?The tea will be quite cold, you?d better ring for some more,? said the Dowager Lady Beanford. Susan Lady Beanford was a vigorous old woman who had coquetted with imaginary ill-health for the greater part of a lifetime; Clovis Sangrail irreverently declared that she had caught a chill at the Coronation of Queen Vict...
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

- Title: LOUISE
- Author: Author: Saki
- Start: Louise ?The tea will be quite cold, you?d better ring for some more,? said the Dowager Lady Beanford. Susan Lady Beanford was a vigorous old woman who had coquetted with imaginary ill-health for the greater part of a lifetime; Clovis Sangrail irreverently declared that she had caught a chill at the Coronation of Queen Vict...
- End: ...have been left alone with her neuralgia, but of course Louise wouldn’t leave off till some one told her to. Anyhow, you can ring up Mornay’s, Robert, and ask whether I left two theatre tickets there. Except for your silk, Susan, those seem to be the only things I’ve forgotten this afternoon. Quite wonderful for me.”

## Heading Examples

- Source tale heading: LOUISE
- First readable prose: ?The tea will be quite cold, you?d better ring for some more,? said the
