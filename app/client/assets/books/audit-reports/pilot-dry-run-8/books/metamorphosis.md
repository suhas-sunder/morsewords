# Pilot Dry Run 8: metamorphosis

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/Metamorphosis.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Metamorphosis
- Title evidence: Gutenberg Title line line 15 - Title: Metamorphosis
- Expected author: Franz Kafka
- Author evidence: Gutenberg Author line line 17 - Author: Franz Kafka
- Apparent work type: standalone book
- Detected structural convention: standalone roman numeral sections
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Expected start boundary: start at cleaned-body line 1: I
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Standalone Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 3 planned standalone roman numeral sections sections unless a future write inspection demotes true front/back matter
- Likely section count: 3
- Expected preview start: One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections. The bedding was hardly able to cover it...
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
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

- Title: Title: Metamorphosis
- Author: Author: Franz Kafka
- Start: I One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections. The bedding was hardly able to cover it...
- End: indeed completely dried up and flat, they had not seen it until then, but now he was not lifted up on his little legs, nor did he do anything to make them look away. ?Grete, come with us in here for a little while?, said Mrs. Samsa with a pained smile, and Grete followed her parents into the bedroom but not without...

## Heading Examples

- L1: I
- L595: II
- L1220: III
