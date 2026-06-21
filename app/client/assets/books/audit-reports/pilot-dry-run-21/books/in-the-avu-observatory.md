# Pilot Dry Run 21: in-the-avu-observatory

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/IN THE AVU OBSERVATORY.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: In the Avu Observatory
- Title evidence: source body heading line 65 - IN THE AVU OBSERVATORY
- Expected author: H. G. Wells
- Author evidence: Gutenberg Author line line 13 - Author: H. G. Wells
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: Gutenberg Author line line 13: Author: H. G. Wells
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: In the Avu Observatory
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: The observatory at Avu, in Borneo, stands on the spur of the mountain.
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: The observatory at Avu, in Borneo, stands on the spur of the mountain. To the north rises the old crater, black at night against the unfathomable blue of the sky. From the little circular building, with its mushroom dome, the slopes plunge steeply downward into the black mysteries of the tropical forest beneath. The...
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

- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: IN THE AVU OBSERVATORY
- Author: Author: H. G. Wells
- Metadata: Author: H. G. Wells
- Start: In the Avu Observatory The observatory at Avu, in Borneo, stands on the spur of the mountain. To the north rises the old crater, black at night against the unfathomable blue of the sky. From the little circular building, with its mushroom dome, the slopes plunge steeply downward into the black mysteries of the tropical forest beneath. The...
- End: ...house--and Thaddy groaned at the quotation--"and more particularly in the forests of Borneo, than are dreamt of in our philosophies. On the whole, if the Borneo fauna is going to disgorge any more of its novelties upon me, I should prefer that it did so when I was not occupied in the observatory at night and alone."

## Heading Examples

- Source tale heading: IN THE AVU OBSERVATORY
- First readable prose: The observatory at Avu, in Borneo, stands on the spur of the mountain.
