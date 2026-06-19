# Pilot Dry Run 12: ole-luk-oie-the-dream-god

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/OLE-LUK-OIE THE DREAM GOD.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Ole-Luk-Oie, the Dream-God
- Title evidence: source body heading line 137 - OLE-LUK-OIE THE DREAM GOD
- Expected author: H. C. Andersen
- Author evidence: Gutenberg Author line line 13 - Author: H. C. Andersen
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Ole-Luk-Oie, the Dream-God
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: THERE is nobody in the whole world who knows so many stories as
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: THERE is nobody in the whole world who knows so many stories as Ole-Luk-Oie, or who can relate them so nicely. In the evening while the children are seated at the tea table or in their little chairs, very softly he comes up the stairs, for he walks in his socks. He opens the doors without the slightest noise and thr...
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

- Title: OLE-LUK-OIE THE DREAM GOD
- Author: Author: H. C. Andersen
- Start: Ole-Luk-Oie, the Dream-God THERE is nobody in the whole world who knows so many stories as Ole-Luk-Oie, or who can relate them so nicely. In the evening while the children are seated at the tea table or in their little chairs, very softly he comes up the stairs, for he walks in his socks. He opens the doors without the slightest noise and thr...
- End: get free, for they seemed fastened to the seat. "Why, Death is a most splendid Luk-Oie," said Hjalmar. "I am not in the least afraid of him." "You need have no fear of him," said Ole-Luk-Oie; "but take care and keep a good conduct book." "Now I call that very instructive," murmured the great-grandfather's portrait....

## Heading Examples

- First readable prose: THERE is nobody in the whole world who knows so many stories as
