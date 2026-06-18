# Pilot Dry Run 8: the-regent-s-daughter

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The regent's daughter.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The regent's daughter
- Title evidence: Gutenberg Title line line 11 - Title: The regent's daughter
- Expected author: Alexandre Dumas
- Author evidence: Gutenberg Author line line 13 - Author: Alexandre Dumas
- Apparent work type: standalone book
- Detected structural convention: chapter-based roman numerals with volume divisions
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Expected start boundary: start at cleaned-body line 146: CHAPTER I.
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Chapter plus Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 38 planned chapter-based roman numerals with volume divisions sections unless a future write inspection demotes true front/back matter
- Likely section count: 38
- Expected preview start: AN ABBESS OF THE EIGHTEENTH CENTURY. On the 8th February, 1719, a carriage, bearing the fleur-de-lis of France, with the motto of Orleans, preceded by two outriders and a page, entered the porch of the Abbey of Chelles, precisely as the clock struck ten, and, the door having been quickly opened, its two occupants st...
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

- Title: Title: The regent's daughter
- Author: Author: Alexandre Dumas
- Start: CHAPTER I. AN ABBESS OF THE EIGHTEENTH CENTURY. On the 8th February, 1719, a carriage, bearing the fleur-de-lis of France, with the motto of Orleans, preceded by two outriders and a page, entered the porch of the Abbey of Chelles, precisely as the clock struck ten, and, the door having been quickly opened, its two occupants st...
- End: ng for the carriage a little beyond Rambouillet. He was wrapped in a large cloak which left nothing visible but his eyes. Near him was another man also enveloped in a cloak. When the carriage passed, he heaved a deep sigh, and two silent tears fell from his eyes. "Adieu!" he murmured, "adieu all my joy, adieu my hap...

## Heading Examples

- L146: CHAPTER I.
- L520: CHAPTER II.
- L775: CHAPTER III.
- L1163: CHAPTER IV.
- L1339: CHAPTER V.
- L1678: CHAPTER VI.
