# Pilot Dry Run 13: lily-and-the-lion

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/LILY AND THE LION.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Lily and the Lion
- Title evidence: source body heading line 43 - LILY AND THE LION
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Lily and the Lion
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: A merchant, who had three daughters, was once setting out upon a
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: A merchant, who had three daughters, was once setting out upon a journey; but before he went he asked each daughter what gift he should bring back for her. The eldest wished for pearls; the second for jewels; but the third, who was called Lily, said, ?Dear father, bring me a rose.? Now it was no easy task to find a...
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

- Title: LILY AND THE LION
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: Lily and the Lion A merchant, who had three daughters, was once setting out upon a journey; but before he went he asked each daughter what gift he should bring back for her. The eldest wished for pearls; the second for jewels; but the third, who was called Lily, said, ?Dear father, bring me a rose.? Now it was no easy task to find a...
- End: u; but Heaven hath sent you to me in a lucky hour.? And they stole away out of the palace by night unawares, and seated themselves on the griffin, who flew back with them over the Red Sea. When they were half-way across Lily let the nut fall into the water, and immediately a large nut-tree arose from the sea, whereo...

## Heading Examples

- First readable prose: A merchant, who had three daughters, was once setting out upon a
