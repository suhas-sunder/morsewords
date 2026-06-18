# Pilot Dry Run 10: filmer

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/FILMER.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Filmer
- Title evidence: Gutenberg Title line line 10 - Title: Twelve Stories and a Dream
- Expected author: H. G. Wells
- Author evidence: Gutenberg Author line line 12 - Author: H. G. Wells
- Apparent work type: individual story
- Detected structural convention: story or titled-section headings
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: FILMER
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at cleaned-body line 3: FILMER
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use All-caps story or titled-section heading boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 2 planned story or titled-section headings sections unless a future write inspection demotes true front/back matter
- Likely section count: 2
- Expected preview start: In truth the mastery of flying was the work of thousands of men?this man a suggestion and that an experiment, until at last only one vigorous intellectual effort was needed to finish the work. But the inexorable injustice of the popular mind has decided that of all these thousands, one man, and that a man who never...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback
- first default section is meaningful but should be verified manually in write pass

## Segmentation Risks

- structure audit recommends processing with warnings; write pass must verify boundaries directly from raw source

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Title: Twelve Stories and a Dream
- Author: Author: H. G. Wells
- Start: FILMER In truth the mastery of flying was the work of thousands of men?this man a suggestion and that an experiment, until at last only one vigorous intellectual effort was needed to finish the work. But the inexorable injustice of the popular mind has decided that of all these thousands, one man, and that a man who never...
- End: ver the Epsom and Wimbledon divisions; and Banghurst, restored once more to hope and energy, and regardless of public security and the Board of Trade, was pursuing his gyrations and trying to attract his attention, on a motor car and in his pyjamas?he had caught sight of the ascent when pulling up the blind of his b...

## Heading Examples

- L3: FILMER
- L143: ?.22 LONG.?
