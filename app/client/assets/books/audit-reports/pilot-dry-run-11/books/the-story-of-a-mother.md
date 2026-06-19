# Pilot Dry Run 11: the-story-of-a-mother

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Story of a Mother.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Story of a Mother
- Title evidence: source body heading line 43 - THE STORY OF A MOTHER
- Expected author: H. C. Andersen
- Author evidence: Gutenberg Author line line 13 - Author: H. C. Andersen
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Story of a Mother
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: A mother sat there with her little child
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: A mother sat there with her little child. She was so downcast, so afraid that it should die! It was so pale, the small eyes had closed themselves, and it drew its breath so softly, now and then, with a deep respiration, as if it sighed; and the mother looked still more sorrowfully on the little creature. Then a knoc...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default

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

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: THE STORY OF A MOTHER
- Author: Author: H. C. Andersen
- Start: The Story of a Mother A mother sat there with her little child. She was so downcast, so afraid that it should die! It was so pale, the small eyes had closed themselves, and it drew its breath so softly, now and then, with a deep respiration, as if it sighed; and the mother looked still more sorrowfully on the little creature. Then a knoc...
- End: y! Rather take it away! Take it into God's kingdom! Forget my tears, forget my prayers, and all that I have done!? ?I do not understand thee!? said Death. ?Wilt thou have thy child again, or shall I go with it there, where thou dost not know!? Then the mother wrung her hands, fell on her knees, and prayed to our Lor...

## Heading Examples

- First readable prose: A mother sat there with her little child
