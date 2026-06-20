# Pilot Dry Run 16: the-purple-of-the-balkan-kings

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE PURPLE OF THE BALKAN KINGS.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Purple of the Balkan Kings
- Title evidence: source body heading line 63 - THE PURPLE OF THE BALKAN KINGS
- Expected author: Saki
- Author evidence: Gutenberg Author line line 13 - Author: Saki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Purple of the Balkan Kings
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Luitpold Wolkenstein, financier and diplomat on a small, obtrusive,
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Luitpold Wolkenstein, financier and diplomat on a small, obtrusive, self-important scale, sat in his favoured cafe in the world-wise Habsburg capital, confronted with the _Neue Freie Presse_ and the cup of cream-topped coffee and attendant glass of water that a sleek-headed piccolo had just brought him. For years lo...
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

- Title: THE PURPLE OF THE BALKAN KINGS
- Author: Author: Saki
- Start: The Purple of the Balkan Kings Luitpold Wolkenstein, financier and diplomat on a small, obtrusive, self-important scale, sat in his favoured cafe in the world-wise Habsburg capital, confronted with the _Neue Freie Presse_ and the cup of cream-topped coffee and attendant glass of water that a sleek-headed piccolo had just brought him. For years lo...
- End: ...all struggling States who were being taught the lesson. Luitpold Wolkenstein did not wait for the quorum of domino players to arrive. They would all have read the article in the _Freie Presse_. And there are moments when an oracle finds its greatest salvation in withdrawing itself from the area of human questioning.

## Heading Examples

- Source tale heading: THE PURPLE OF THE BALKAN KINGS
- First readable prose: Luitpold Wolkenstein, financier and diplomat on a small, obtrusive,
