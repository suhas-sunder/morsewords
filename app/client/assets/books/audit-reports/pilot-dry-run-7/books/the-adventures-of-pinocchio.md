# Pilot Dry Run 7: the-adventures-of-pinocchio

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Adventures of Pinocchio.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Adventures of Pinocchio
- Title evidence: Gutenberg Title line line 11 - Title: The Adventures of Pinocchio
- Expected author: Carlo Collodi
- Author evidence: Gutenberg Author line line 13 - Author: Carlo Collodi
- Apparent work type: standalone book
- Detected structural convention: chapter-based arabic numbers
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Expected start boundary: start at cleaned-body line 14: CHAPTER 1
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Chapter plus Arabic number boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 36 detected chapter-based arabic numbers sections unless a future write inspection demotes true front/back matter
- Likely section count: 36
- Expected preview start: How it happened that Mastro Cherry, carpenter, found a piece of wood
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

- Title: Title: The Adventures of Pinocchio
- Author: Author: Carlo Collodi
- Start: CHAPTER 1 How it happened that Mastro Cherry, carpenter, found a piece of wood
- End: t! Remember the old proverb which says: ?Stolen money never bears fruit.? Addio, false friends.? ?Have mercy on us!? ?On us.? ?Addio, false friends. Remember the old proverb which says: ?Bad wheat always makes poor bread!?? ?Do not abandon us.? ?Abandon us,? repeated the Cat. ?Addio, false friends. Remember the old...

## Heading Examples

- L14: CHAPTER 1
- L102: CHAPTER 2
- L236: CHAPTER 3
- L380: CHAPTER 4
- L477: CHAPTER 5
- L550: CHAPTER 6
