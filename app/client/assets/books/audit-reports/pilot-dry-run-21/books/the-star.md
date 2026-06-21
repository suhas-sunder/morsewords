# Pilot Dry Run 21: the-star

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE STAR.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Star
- Title evidence: source body heading line 18 - THE STAR
- Expected author: H. G. Wells
- Author evidence: Gutenberg Author line line 4 - Author: H. G. Wells
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: Gutenberg Author line line 4: Author: H. G. Wells
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Star
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: It was on the first day of the New Year that the announcement was made
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: It was on the first day of the New Year that the announcement was made, almost simultaneously from three observatories, that the motion of the planet Neptune, the outermost of all the planets that wheel about the sun, had become very erratic. Ogilvy had already called attention to a suspected retardation in its velo...
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

- Title: THE STAR
- Author: Author: H. G. Wells
- Metadata: Author: H. G. Wells
- Start: The Star It was on the first day of the New Year that the announcement was made, almost simultaneously from three observatories, that the motion of the planet Neptune, the outermost of all the planets that wheel about the sun, had become very erratic. Ogilvy had already called attention to a suspected retardation in its velo...
- End: ... the familiar continental markings and the masses of the seas remain intact, and indeed the only difference seems to be a shrinkage of the white discoloration (supposed to be frozen water) round either pole.” Which only shows how small the vastest of human catastrophes may seem, at a distance of a few million miles.

## Heading Examples

- Source tale heading: THE STAR
- First readable prose: It was on the first day of the New Year that the announcement was made
