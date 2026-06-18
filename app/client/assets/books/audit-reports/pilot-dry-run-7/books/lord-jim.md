# Pilot Dry Run 7: lord-jim

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/Lord Jim.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Lord Jim
- Title evidence: Gutenberg Title line line 11 - Title: Lord Jim
- Expected author: Joseph Conrad
- Author evidence: Gutenberg Author line line 13 - Author: Joseph Conrad
- Apparent work type: standalone book
- Detected structural convention: chapter-based arabic numbers
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Expected start boundary: start at cleaned-body line 88: CHAPTER 1
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Chapter plus Arabic number boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 45 detected chapter-based arabic numbers sections unless a future write inspection demotes true front/back matter
- Likely section count: 45
- Expected preview start: He was an inch, perhaps two, under six feet, powerfully built, and he
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

- Title: Title: Lord Jim
- Author: Author: Joseph Conrad
- Start: CHAPTER 1 He was an inch, perhaps two, under six feet, powerfully built, and he
- End: ared head in the light of torches, looking him straight in the face, he clung heavily with his left arm round the neck of a bowed youth, and lifting deliberately his right, shot his son?s friend through the chest. ?The crowd, which had fallen apart behind Jim as soon as Doramin had raised his hand, rushed tumultuous...

## Heading Examples

- L88: CHAPTER 1
- L274: CHAPTER 2
- L468: CHAPTER 3
- L746: CHAPTER 4
- L912: CHAPTER 5
- L1492: CHAPTER 6
