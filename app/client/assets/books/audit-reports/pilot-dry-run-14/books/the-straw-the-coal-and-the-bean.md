# Pilot Dry Run 14: the-straw-the-coal-and-the-bean

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE STRAW, THE COAL, AND THE BEAN.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Straw, the Coal, and the Bean
- Title evidence: source body heading line 43 - THE STRAW, THE COAL, AND THE BEAN
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Straw, the Coal, and the Bean
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: In a village dwelt a poor old woman, who had gathered together a dish
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: In a village dwelt a poor old woman, who had gathered together a dish of beans and wanted to cook them. So she made a fire on her hearth, and that it might burn the quicker, she lighted it with a handful of straw. When she was emptying the beans into the pan, one dropped without her observing it, and lay on the grou...
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

- Title: THE STRAW, THE COAL, AND THE BEAN
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: The Straw, the Coal, and the Bean In a village dwelt a poor old woman, who had gathered together a dish of beans and wanted to cook them. So she made a fire on her hearth, and that it might burn the quicker, she lighted it with a handful of straw. When she was emptying the beans into the pan, one dropped without her observing it, and lay on the grou...
- End: ...ise, if, by good fortune, a tailor who was travelling in search of work, had not sat down to rest by the brook. As he had a compassionate heart he pulled out his needle and thread, and sewed her together. The bean thanked him most prettily, but as the tailor used black thread, all beans since then have a black seam.

## Heading Examples

- Source tale heading: THE STRAW, THE COAL, AND THE BEAN
- First readable prose: In a village dwelt a poor old woman, who had gathered together a dish
