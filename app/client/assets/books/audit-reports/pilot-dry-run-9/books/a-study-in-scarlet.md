# Pilot Dry Run 9: a-study-in-scarlet

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/A Study in Scarlet.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: A Study in Scarlet
- Title evidence: Gutenberg Title line line 11 - Title: A Study in Scarlet
- Expected author: Arthur Conan Doyle
- Author evidence: Gutenberg Author line line 13 - Author: Arthur Conan Doyle
- Apparent work type: standalone book
- Detected structural convention: chapter-based roman numerals with part divisions
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at cleaned-body line 39: CHAPTER I.
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Chapter plus Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 13 planned chapter-based roman numerals with part divisions sections unless a future write inspection demotes true front/back matter
- Likely section count: 13
- Expected preview start: MR. SHERLOCK HOLMES. In the year 1878 I took my degree of Doctor of Medicine of the University of London, and proceeded to Netley to go through the course prescribed for surgeons in the army. Having completed my studies there, I was duly attached to the Fifth Northumberland Fusiliers as Assistant Surgeon. The regime...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- contents or list material must not enter default playback
- Project Gutenberg/source/license material must be removed

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

- Title: Title: A Study in Scarlet
- Author: Author: Arthur Conan Doyle
- Start: Chapter 1 MR. SHERLOCK HOLMES. In the year 1878 I took my degree of Doctor of Medicine of the University of London, and proceeded to Netley to go through the course prescribed for surgeons in the army. Having completed my studies there, I was duly attached to the Fifth Northumberland Fusiliers as Assistant Surgeon. The regime...
- End: out. If he died like a dog among the mountains, what was to become of his revenge then? And yet such a death was sure to overtake him if he persisted. He felt that that was to play his enemy?s game, so he reluctantly returned to the old Nevada mines, there to recruit his health and to amass money enough to allow him...

## Heading Examples

- L39: CHAPTER I.
- L366: CHAPTER II.
- L744: CHAPTER III.
- L1205: CHAPTER IV.
- L1487: CHAPTER V.
- L1766: CHAPTER VI.
