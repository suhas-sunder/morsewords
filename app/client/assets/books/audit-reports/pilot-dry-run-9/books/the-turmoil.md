# Pilot Dry Run 9: the-turmoil

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Turmoil.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Turmoil: A Novel
- Title evidence: Gutenberg Title line line 11 - Title: The Turmoil: A Novel
- Expected author: Booth Tarkington
- Author evidence: Gutenberg Author line line 13 - Author: Booth Tarkington
- Apparent work type: standalone book
- Detected structural convention: chapter-based roman numerals
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at cleaned-body line 13: CHAPTER I
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Chapter plus Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 33 planned chapter-based roman numerals sections unless a future write inspection demotes true front/back matter
- Likely section count: 33
- Expected preview start: There is a midland city in the heart of fair, open country, a dirty and wonderful city nesting dingily in the fog of its own smoke. The stranger must feel the dirt before he feels the wonder, for the dirt will be upon him instantly. It will be upon him and within him, since he must breathe it, and he may care for no...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback

## Segmentation Risks

- later ordinal headings are present; verify Chapter/Part/Book 1 remains included and selected first

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Title: The Turmoil: A Novel
- Author: Author: Booth Tarkington
- Start: Chapter 1 There is a midland city in the heart of fair, open country, a dirty and wonderful city nesting dingily in the fog of its own smoke. The stranger must feel the dirt before he feels the wonder, for the dirt will be upon him instantly. It will be upon him and within him, since he must breathe it, and he may care for no...
- End: no answer. ?Mary?? he called, huskily. ?If you mean THAT--you'd let me see you--wouldn't you?? And now the voice was so low he could not be sure it spoke at all, but if it did, the words were, ?Yes, Bibbs--dear.? But the voice was not in the instrument--it was so gentle and so light, so almost nothing, it seemed to...

## Heading Examples

- L13: CHAPTER I
- L135: CHAPTER II
- L316: CHAPTER III
- L648: CHAPTER IV
- L1000: CHAPTER V
- L1263: CHAPTER VI
