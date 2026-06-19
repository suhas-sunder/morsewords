# Pilot Dry Run 13: cat-skin

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/CAT-SKIN.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Cat-Skin
- Title evidence: source body heading line 43 - CAT-SKIN
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Cat-Skin
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: There was once a king, whose queen had hair of the purest gold, and was
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: There was once a king, whose queen had hair of the purest gold, and was so beautiful that her match was not to be met with on the whole face of the earth. But this beautiful queen fell ill, and when she felt that her end drew near she called the king to her and said, ?Promise me that you will never marry again, unle...
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

- Title: CAT-SKIN
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: Cat-Skin There was once a king, whose queen had hair of the purest gold, and was so beautiful that her match was not to be met with on the whole face of the earth. But this beautiful queen fell ill, and when she felt that her end drew near she called the king to her and said, ?Promise me that you will never marry again, unle...
- End: arry dress sparkled underneath it. Then he got hold of the fur and tore it off, and her golden hair and beautiful form were seen, and she could no longer hide herself: so she washed the soot and ashes from her face, and showed herself to be the most beautiful princess upon the face of the earth. But the king said, ?...

## Heading Examples

- First readable prose: There was once a king, whose queen had hair of the purest gold, and was
