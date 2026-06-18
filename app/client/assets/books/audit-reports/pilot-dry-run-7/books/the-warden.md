# Pilot Dry Run 7: the-warden

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Warden.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Warden
- Title evidence: Gutenberg Title line line 11 - Title: The Warden
- Expected author: Anthony Trollope
- Author evidence: Gutenberg Author line line 13 - Author: Anthony Trollope
- Apparent work type: standalone book
- Detected structural convention: chapter-based roman numerals
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Expected start boundary: start at cleaned-body line 36: Chapter I
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Chapter plus Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 20 detected chapter-based roman numerals sections unless a future write inspection demotes true front/back matter
- Likely section count: 20
- Expected preview start: The Rev. Septimus Harding was, a few years since, a beneficed
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- contents or list material must not enter default playback
- Project Gutenberg/source/license material must be removed

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Title: The Warden
- Author: Author: Anthony Trollope
- Start: Chapter I The Rev. Septimus Harding was, a few years since, a beneficed
- End: ified to them that the income abandoned by Mr Harding would not come to them; and these accounts were confirmed by attorney Finney. They were then informed that Mr Harding's place would be at once filled by another. That the new warden could not be a kinder man they all knew; that he would be a less friendly one mos...

## Heading Examples

- L36: Chapter I
- L258: Chapter II
- L676: Chapter III
- L1426: Chapter V
- L1879: Chapter VI
- L2337: Chapter VII
