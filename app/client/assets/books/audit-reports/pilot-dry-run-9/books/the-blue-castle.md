# Pilot Dry Run 9: the-blue-castle

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Blue Castle.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Blue Castle: a novel
- Title evidence: Gutenberg Title line line 11 - Title: The Blue Castle: a novel
- Expected author: L. M. Montgomery
- Author evidence: Gutenberg Author line line 13 - Author: L. M. Montgomery
- Apparent work type: standalone book
- Detected structural convention: chapter-based roman numerals
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at cleaned-body line 66: CHAPTER I
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Chapter plus Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 45 planned chapter-based roman numerals sections unless a future write inspection demotes true front/back matter
- Likely section count: 45
- Expected preview start: If it had not rained on a certain May morning Valancy Stirling?s whole life would have been entirely different. She would have gone, with the rest of her clan, to Aunt Wellington?s engagement picnic and Dr. Trent would have gone to Montreal. But it did rain and you shall hear what happened to her because of it. Vala...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- contents or list material must not enter default playback
- Project Gutenberg/source/license material must be removed

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback

## Segmentation Risks

- structure audit recommends processing with warnings; write pass must verify boundaries directly from raw source
- later ordinal headings are present; verify Chapter/Part/Book 1 remains included and selected first

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Title: The Blue Castle: a novel
- Author: Author: L. M. Montgomery
- Start: Chapter 1 If it had not rained on a certain May morning Valancy Stirling?s whole life would have been entirely different. She would have gone, with the rest of her clan, to Aunt Wellington?s engagement picnic and Dr. Trent would have gone to Montreal. But it did rain and you shall hear what happened to her because of it. Vala...
- End: giana was it given. Valancy was in tears. ?Don?t cry, Moonlight. We?ll be back next summer. And now we?re off for a real honeymoon.? Valancy smiled through her tears. She was so happy that her happiness terrified her. But, despite the delights before her??the glory that was Greece and the grandeur that was Rome??lur...

## Heading Examples

- L66: CHAPTER I
- L413: CHAPTER II
- L526: CHAPTER III
- L718: CHAPTER IV
- L803: CHAPTER V
- L961: CHAPTER VI
