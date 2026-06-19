# Pilot Dry Run 12: mark

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/MARK.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Mark
- Title evidence: source body heading line 63 - MARK
- Expected author: Saki
- Author evidence: Gutenberg Author line line 13 - Author: Saki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Mark
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Augustus Mellowkent was a novelist
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Augustus Mellowkent was a novelist with a future; that is to say, a limited but increasing number of people read his books, and there seemed good reason to suppose that if he steadily continued to turn out novels year by year a progressively increasing circle of readers would acquire the Mellowkent habit, and demand...
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

- Title: MARK
- Author: Author: Saki
- Start: Mark Augustus Mellowkent was a novelist with a future; that is to say, a limited but increasing number of people read his books, and there seemed good reason to suppose that if he steadily continued to turn out novels year by year a progressively increasing circle of readers would acquire the Mellowkent habit, and demand...
- End: a visit without a couple of Mark Mellowkents in his kit-bag. Perhaps sensation is more in your line. I wonder if I?ve got a copy of _The Python?s Kiss_.? Caiaphas did not wait to be tempted with selections from that thrilling work of fiction. With a muttered remark about having no time to waste on monkey-talk, he ga...

## Heading Examples

- First readable prose: Augustus Mellowkent was a novelist
