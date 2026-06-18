# Pilot Dry Run 10: kidnapped

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/Kidnapped.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Kidnapped
- Title evidence: Gutenberg Title line line 11 - Title: Kidnapped
- Expected author: Robert Louis Stevenson
- Author evidence: Gutenberg Author line line 13 - Author: Robert Louis Stevenson
- Apparent work type: standalone book
- Detected structural convention: chapter-based roman numerals with verified Chapter I override
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: CHAPTER I: I SET OFF UPON MY JOURNEY TO THE HOUSE OF SHAWS
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at CHAPTER I: I SET OFF UPON MY JOURNEY TO THE HOUSE OF SHAWS: I will begin the story of my adventures
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use the 30 numbered chapters beginning with CHAPTER I; exclude title page, credits, and contents/source wrapper; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 30 planned chapter-based roman numerals with verified Chapter I override sections unless a future write inspection demotes true front/back matter
- Likely section count: 30
- Expected preview start: I will begin the story of my adventures with a certain morning early in the month of June, the year of grace 1751, when I took the key for the last time out of the door of my father?s house. The sun began to shine upon the summit of the hills as I went down the road; and by the time I had come as far as the manse, t...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- contents or list material must not enter default playback
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback

## Segmentation Risks

- structure audit recommends processing with warnings; write pass must verify boundaries directly from raw source
- later ordinal headings are present; verify Chapter/Part/Book 1 remains included and selected first
- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Title: Kidnapped
- Author: Author: Robert Louis Stevenson
- Start: CHAPTER I: I SET OFF UPON MY JOURNEY TO THE HOUSE OF SHAWS I will begin the story of my adventures with a certain morning early in the month of June, the year of grace 1751, when I took the key for the last time out of the door of my father?s house. The sun began to shine upon the summit of the hills as I went down the road; and by the time I had come as far as the manse, t...
- End: itchen, and sat down and sulked; and it was not till I stepped after him, and gave him my hand, and thanked him by title as the chief spring of my success, that he began to smile a bit, and was at last prevailed upon to join our party. By that time we had the fire lighted, and a bottle of wine uncorked; a good suppe...

## Heading Examples

- CHAPTER I: I SET OFF UPON MY JOURNEY TO THE HOUSE OF SHAWS
- CHAPTER II: I COME TO MY JOURNEY'S END
- CHAPTER III: I MAKE ACQUAINTANCE OF MY UNCLE
