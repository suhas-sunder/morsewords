# Pilot Dry Run 17: elder-tree-mother

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/ELDER-TREE MOTHER.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Elder-Tree Mother
- Title evidence: source body heading line 137 - ELDER-TREE MOTHER
- Expected author: H. C. Andersen
- Author evidence: Gutenberg Author line line 13 - Author: H. C. Andersen
- Expected author/compiler/collector/translator/reteller role: author: H. C. Andersen; editor: J. H. Stickney
- Metadata evidence: Gutenberg Author line line 13: Author: H. C. Andersen; Gutenberg Editor line line 15: Editor: J. H. Stickney
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: Elder-Tree Mother
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: THERE was once a little boy who had taken cold by going out and getting
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: THERE was once a little boy who had taken cold by going out and getting his feet wet. No one could think how he had managed to do so, for the weather was quite dry. His mother undressed him and put him to bed, and then she brought in the teapot to make him a good cup of elder tea, which is so warming. At the same ti...
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

- J. H. Stickney is source-backed as editor and must not replace H. C. Andersen in the author field

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- illustration captions/placeholders detected

## Supporting Snippets

- Title: ELDER-TREE MOTHER
- Author: Author: H. C. Andersen
- Metadata: Author: H. C. Andersen; Editor: J. H. Stickney
- Start: Elder-Tree Mother THERE was once a little boy who had taken cold by going out and getting his feet wet. No one could think how he had managed to do so, for the weather was quite dry. His mother undressed him and put him to bed, and then she brought in the teapot to make him a good cup of elder tea, which is so warming. At the same ti...
- End: ...o warm countries"; and then she covered him up, that he should not take cold. "You have slept well while I have been disputing with the old man as to whether it was a real story or a fairy legend." "And where is the Elder-tree Mother?" asked the boy. "She is in the teapot," said the mother, "and there she may stay."

## Heading Examples

- Source tale heading: ELDER-TREE MOTHER
- First readable prose: THERE was once a little boy who had taken cold by going out and getting
