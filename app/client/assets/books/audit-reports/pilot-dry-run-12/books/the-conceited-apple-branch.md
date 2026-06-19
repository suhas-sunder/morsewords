# Pilot Dry Run 12: the-conceited-apple-branch

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE CONCEITED APPLE BRANCH.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Conceited Apple Branch
- Title evidence: source body heading line 137 - THE CONCEITED APPLE BRANCH
- Expected author: H. C. Andersen
- Author evidence: Gutenberg Author line line 13 - Author: H. C. Andersen
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: The Conceited Apple Branch
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: IT WAS the month of May
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: IT WAS the month of May. The wind still blew cold, but from bush and tree, field and flower, came the welcome sound, "Spring is come." Wild flowers in profusion covered the hedges. Under the little apple tree Spring seemed busy, and he told his tale from one of the branches, which hung fresh and blooming and covered...
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

- Title: THE CONCEITED APPLE BRANCH
- Author: Author: H. C. Andersen
- Start: The Conceited Apple Branch IT WAS the month of May. The wind still blew cold, but from bush and tree, field and flower, came the welcome sound, "Spring is come." Wild flowers in profusion covered the hedges. Under the little apple tree Spring seemed busy, and he told his tale from one of the branches, which hung fresh and blooming and covered...
- End: r garlands of green stems and golden flowers. But the eldest among them gathered carefully the faded flowers, on the stem of which were grouped together the seeds, in the form of a white, feathery coronal. These loose, airy wool-flowers are very beautiful, and look like fine, snowy feathers or down. The children hel...

## Heading Examples

- First readable prose: IT WAS the month of May
