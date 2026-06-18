# Pilot Dry Run 9: the-three-taps-a-detective-story-without-a-moral

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The three taps - A detective story without a moral.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Three Taps
- Title evidence: Gutenberg Title line line 11 - Title: The three taps
- Expected author: Ronald Arbuthnott Knox
- Author evidence: Gutenberg Author line line 14 - Author: Ronald Arbuthnott Knox
- Apparent work type: standalone book
- Detected structural convention: chapter-based roman numerals
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at cleaned-body line 42: Chapter I
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Chapter plus Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 25 planned chapter-based roman numerals sections unless a future write inspection demotes true front/back matter
- Likely section count: 25
- Expected preview start: The Euthanasia Policy The principles of insurance, they tell us, were not hidden from our Anglo-Saxon forefathers. How anybody had the enterprise in those rough-and-tumble days to guarantee a client against ?fire, water, robbery or other calamity? remains a problem for the historian; the more so as it appears that m...
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

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Title: The three taps
- Author: Author: Ronald Arbuthnott Knox
- Start: Chapter 1 The Euthanasia Policy The principles of insurance, they tell us, were not hidden from our Anglo-Saxon forefathers. How anybody had the enterprise in those rough-and-tumble days to guarantee a client against ?fire, water, robbery or other calamity? remains a problem for the historian; the more so as it appears that m...
- End: his, not a forgery. You will see why I mention that later on. This is how the letter runs: ??My dear Lord Bishop: ??Pursuant to our conversation of Thursday evening last, it will be within your Lordship?s memory that upon that occasion I asserted the right of a man, in given circumstances, to take his own life, part...

## Heading Examples

- L42: Chapter I
- L340: Chapter II
- L615: Chapter III
- L885: Chapter IV
- L1169: Chapter V
- L1451: Chapter VI
