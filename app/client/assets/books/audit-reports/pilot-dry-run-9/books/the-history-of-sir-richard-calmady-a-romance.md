# Pilot Dry Run 9: the-history-of-sir-richard-calmady-a-romance

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The History of Sir Richard Calmady - A Romance.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The History of Sir Richard Calmady: A Romance
- Title evidence: Gutenberg Title line line 11 - Title: The History of Sir Richard Calmady: A Romance
- Expected author: Lucas Malet
- Author evidence: Gutenberg Author line line 13 - Author: Lucas Malet
- Apparent work type: standalone book
- Detected structural convention: chapter-based roman numerals with book divisions
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at cleaned-body line 230: CHAPTER I
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Chapter plus Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 55 planned chapter-based roman numerals with book divisions sections unless a future write inspection demotes true front/back matter
- Likely section count: 55
- Expected preview start: ACQUAINTING THE READER WITH A FAIR DOMAIN AND THE MAKER THEREOF In that fortunate hour of English history, when the cruel sights and haunting insecurities of the Middle Ages had passed away, and while, as yet, the fanatic zeal of Puritanism had not cast its blighting shadow over all merry and pleasant things, it see...
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

- later ordinal headings are present; verify Chapter/Part/Book 1 remains included and selected first
- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Title: The History of Sir Richard Calmady: A Romance
- Author: Author: Lucas Malet
- Start: Chapter 1 ACQUAINTING THE READER WITH A FAIR DOMAIN AND THE MAKER THEREOF In that fortunate hour of English history, when the cruel sights and haunting insecurities of the Middle Ages had passed away, and while, as yet, the fanatic zeal of Puritanism had not cast its blighting shadow over all merry and pleasant things, it see...
- End: -you made long ago before you knew her?" "Never," he replied. "Without it I could not have served her as I have been able to serve her. I am wholly thankful for it. It made much possible which must have otherwise been impossible." "And have you never told her that you loved her--even yet?" "No," he replied, "because...

## Heading Examples

- L230: CHAPTER I
- L437: CHAPTER II
- L941: CHAPTER III
- L1148: CHAPTER IV
- L1501: CHAPTER V
- L1916: CHAPTER VI
