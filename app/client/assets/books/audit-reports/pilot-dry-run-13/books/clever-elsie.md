# Pilot Dry Run 13: clever-elsie

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/CLEVER ELSIE.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Clever Elsie
- Title evidence: source body heading line 43 - CLEVER ELSIE
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Clever Elsie
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: There was once a man who had a daughter who was called Clever Elsie. And
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: There was once a man who had a daughter who was called Clever Elsie. And when she had grown up her father said: ?We will get her married.? ?Yes,? said the mother, ?if only someone would come who would have her.? At length a man came from a distance and wooed her, who was called Hans; but he stipulated that Clever El...
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

- Title: CLEVER ELSIE
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: Clever Elsie There was once a man who had a daughter who was called Clever Elsie. And when she had grown up her father said: ?We will get her married.? ?Yes,? said the mother, ?if only someone would come who would have her.? At length a man came from a distance and wooed her, who was called Hans; but he stipulated that Clever El...
- End: thought: ?I will go home and ask if it be I, or if it be not I, they will be sure to know.? She ran to the door of her own house, but it was shut; then she knocked at the window and cried: ?Hans, is Elsie within?? ?Yes,? answered Hans, ?she is within.? Hereupon she was terrified, and said: ?Ah, heavens! Then it is n...

## Heading Examples

- First readable prose: There was once a man who had a daughter who was called Clever Elsie. And
