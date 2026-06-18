# Pilot Dry Run 7: herland

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/Herland.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Herland
- Title evidence: Gutenberg Title line line 11 - Title: Herland
- Expected author: Charlotte Perkins Gilman
- Author evidence: Gutenberg Author line line 13 - Author: Charlotte Perkins Gilman
- Apparent work type: standalone book
- Detected structural convention: chapter-based arabic numbers
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Expected start boundary: start at cleaned-body line 6: CHAPTER 1.
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Chapter plus Arabic number boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 12 detected chapter-based arabic numbers sections unless a future write inspection demotes true front/back matter
- Likely section count: 12
- Expected preview start: This is written from memory, unfortunately. If I could have brought with
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

- Title: Title: Herland
- Author: Author: Charlotte Perkins Gilman
- Start: CHAPTER 1. This is written from memory, unfortunately. If I could have brought with
- End: ing to hurt--no stairs, no corners, no small loose objects to swallow, no fire--just a babies? paradise. They were taught, as rapidly as feasible, to use and control their own bodies, and never did I see such sure-footed, steady-handed, clear-headed little things. It was a joy to watch a row of toddlers learning to...

## Heading Examples

- L6: CHAPTER 1.
- L555: CHAPTER 2.
- L1037: CHAPTER 3.
- L1612: CHAPTER 4.
- L2143: CHAPTER 5.
- L2688: CHAPTER 6.
