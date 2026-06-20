# Pilot Dry Run 20: the-four-gifts

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Four Gifts.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Four Gifts
- Title evidence: source body heading line 46 - The Four Gifts
- Expected author: Andrew Lang
- Author evidence: Gutenberg Author line line 13 - Author: Andrew Lang
- Expected author/compiler/collector/translator/reteller role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Metadata evidence: Gutenberg Author line line 13: Author: Andrew Lang; visible editor byline line 32: Edited by Andrew Lang
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Four Gifts
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: In the old land of Brittany, once called Cornwall
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: In the old land of Brittany, once called Cornwall, there lived a woman named Barbaik Bourhis, who spent all her days in looking after her farm with the help of her niece Tephany. Early and late the two might be seen in the fields or in the dairy, milking cows, making butter, feeding fowls; working hard themselves an...
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

- future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: The Four Gifts
- Author: Author: Andrew Lang
- Metadata: Author: Andrew Lang; Edited by Andrew Lang
- Start: The Four Gifts In the old land of Brittany, once called Cornwall, there lived a woman named Barbaik Bourhis, who spent all her days in looking after her farm with the help of her niece Tephany. Early and late the two might be seen in the fields or in the dairy, milking cows, making butter, feeding fowls; working hard themselves an...
- End: ... lesson,’ answered the fairy, ‘and now you shall lead a peaceful life and marry the man you love. For after all it was not yourself you thought of but him.’ Never again did Tephany see the old woman, but she forgave Denis for selling her tears, and in time he grew to be a good husband, who did his own share of work.

## Heading Examples

- Source tale heading: The Four Gifts
- First readable prose: In the old land of Brittany, once called Cornwall
