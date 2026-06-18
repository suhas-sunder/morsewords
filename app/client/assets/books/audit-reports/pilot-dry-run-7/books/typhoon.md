# Pilot Dry Run 7: typhoon

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/Typhoon.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Typhoon
- Title evidence: Gutenberg Title line line 11 - Title: Typhoon
- Expected author: Joseph Conrad
- Author evidence: Gutenberg Author line line 13 - Author: Joseph Conrad
- Apparent work type: standalone book
- Detected structural convention: standalone roman numeral sections
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Expected start boundary: start at cleaned-body line 151: I
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Standalone Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 6 detected standalone roman numeral sections sections unless a future write inspection demotes true front/back matter
- Likely section count: 6
- Expected preview start: Captain MacWhirr, of the steamer Nan-Shan, had a physiognomy that, in
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
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

- Title: Title: Typhoon
- Author: Author: Joseph Conrad
- Start: I Captain MacWhirr, of the steamer Nan-Shan, had a physiognomy that, in
- End: erate indeed to go thieving in such weather, but what could these beggars know of us? So, without thinking of it twice, I got the hands away in a jiffy. Our work was done--that the old man had set his heart on. We cleared out without staying to inquire how they felt. I am convinced that if they had not been so unmer...

## Heading Examples

- L151: I
- L648: II
- L1275: III
- L1627: IV
- L2336: V
- L2915: VI
