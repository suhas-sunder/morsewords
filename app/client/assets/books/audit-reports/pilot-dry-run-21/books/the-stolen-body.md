# Pilot Dry Run 21: the-stolen-body

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE STOLEN BODY.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Stolen Body
- Title evidence: source body heading line 34 - THE STOLEN BODY
- Expected author: H. G. Wells
- Author evidence: Gutenberg Author line line 12 - Author: H. G. Wells
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: Gutenberg Author line line 12: Author: H. G. Wells
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Stolen Body
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Mr. Bessel was the senior partner in the firm of Bessel, Hart, and Brown
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Mr. Bessel was the senior partner in the firm of Bessel, Hart, and Brown, of St. Paul's Churchyard, and for many years he was well known among those interested in psychical research as a liberal-minded and conscientious investigator. He was an unmarried man, and instead of living in the suburbs, after the fashion of...
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

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: THE STOLEN BODY
- Author: Author: H. G. Wells
- Metadata: Author: H. G. Wells
- Start: The Stolen Body Mr. Bessel was the senior partner in the firm of Bessel, Hart, and Brown, of St. Paul's Churchyard, and for many years he was well known among those interested in psychical research as a liberal-minded and conscientious investigator. He was an unmarried man, and instead of living in the suburbs, after the fashion of...
- End: ...the space of about three hours before he was found. And in spite of the pain and suffering of his wounds, and of the dim damp place in which he lay; in spite of the tears—wrung from him by his physical distress—his heart was full of gladness to know that he was nevertheless back once more in the kindly world of men.

## Heading Examples

- Source tale heading: THE STOLEN BODY
- First readable prose: Mr. Bessel was the senior partner in the firm of Bessel, Hart, and Brown
