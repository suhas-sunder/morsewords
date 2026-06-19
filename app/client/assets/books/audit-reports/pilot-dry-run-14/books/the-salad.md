# Pilot Dry Run 14: the-salad

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE SALAD.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Salad
- Title evidence: source body heading line 43 - THE SALAD
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Salad
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: As a merry young huntsman was once going briskly along through a wood,
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: As a merry young huntsman was once going briskly along through a wood, there came up a little old woman, and said to him, ?Good day, good day; you seem merry enough, but I am hungry and thirsty; do pray give me something to eat.? The huntsman took pity on her, and put his hand in his pocket and gave her what he had....
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

- Title: THE SALAD
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: The Salad As a merry young huntsman was once going briskly along through a wood, there came up a little old woman, and said to him, ?Good day, good day; you seem merry enough, but I am hungry and thirsty; do pray give me something to eat.? The huntsman took pity on her, and put his hand in his pocket and gave her what he had....
- End: ... it, it was against my will, for I always loved you very much. Your wishing-cloak hangs up in the closet, and as for the bird’s heart, I will give it you too.’ But he said, ‘Keep it, it will be just the same thing, for I mean to make you my wife.’ So they were married, and lived together very happily till they died.

## Heading Examples

- Source tale heading: THE SALAD
- First readable prose: As a merry young huntsman was once going briskly along through a wood,
