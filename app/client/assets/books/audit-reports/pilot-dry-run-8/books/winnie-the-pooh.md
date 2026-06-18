# Pilot Dry Run 8: winnie-the-pooh

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/Winnie-the-Pooh.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Winnie-the-Pooh
- Title evidence: Gutenberg Title line line 11 - Title: Winnie-the-Pooh
- Expected author: A. A. Milne
- Author evidence: Gutenberg Author line line 13 - Author: A. A. Milne
- Apparent work type: standalone book
- Detected structural convention: chapter-based roman numerals
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Expected start boundary: start at cleaned-body line 176: CHAPTER I
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Chapter plus Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 10 planned chapter-based roman numerals sections unless a future write inspection demotes true front/back matter
- Likely section count: 10
- Expected preview start: IN WHICH WE ARE INTRODUCED TO WINNIE-THE-POOH AND SOME BEES, AND THE STORIES BEGIN Here is Edward Bear, coming downstairs now, bump, bump, bump, on the back of his head, behind Christopher Robin. It is, as far as he knows, the only way of coming downstairs, but sometimes he feels that there really is another way, if...
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- contents or list material must not enter default playback
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Title: Winnie-the-Pooh
- Author: Author: A. A. Milne
- Start: CHAPTER I IN WHICH WE ARE INTRODUCED TO WINNIE-THE-POOH AND SOME BEES, AND THE STORIES BEGIN Here is Edward Bear, coming downstairs now, bump, bump, bump, on the back of his head, behind Christopher Robin. It is, as far as he knows, the only way of coming downstairs, but sometimes he feels that there really is another way, if...
- End: ind him. At the door he turned and said "Coming to see me have my bath?" "I might," I said. "Was Pooh's pencil case any better than mine?" "It was just the same," I said. He nodded and went out ... and in a moment I heard Winnie-the-Pooh--_bump, bump, bump_--going up the stairs behind him. Printed in Canada by Warwi...

## Heading Examples

- L176: CHAPTER I
- L556: CHAPTER II
- L799: CHAPTER III
- L972: CHAPTER IV
- L1190: CHAPTER V
- L1532: CHAPTER VI
