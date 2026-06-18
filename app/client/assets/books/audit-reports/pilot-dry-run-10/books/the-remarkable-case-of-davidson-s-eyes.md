# Pilot Dry Run 10: the-remarkable-case-of-davidson-s-eyes

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE REMARKABLE CASE OF DAVIDSON'S EYES.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Remarkable Case of Davidson's Eyes
- Title evidence: Gutenberg Title line line 11 - Title: The Stolen Bacillus and Other Incidents
- Expected author: H. G. Wells
- Author evidence: Gutenberg Author line line 13 - Author: H. G. Wells
- Apparent work type: individual story
- Detected structural convention: standalone roman numeral sections with verified section I override
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: I.
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at I.: What's the matter with you?
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use the 5 roman numeral story sections beginning with I; exclude parent collection title/source wrapper; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 5 planned standalone roman numeral sections with verified section I override sections unless a future write inspection demotes true front/back matter
- Likely section count: 5
- Expected preview start: What's the matter with you?" He turned round in my direction and looked about for me. He looked over me and at me and on either side of me, without the slightest sign of seeing me. "Waves," he said; "and a remarkably neat schooner. I'd swear that was Bellows' voice. _Hullo_!" He shouted suddenly at the top of his vo...
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
- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Title: The Stolen Bacillus and Other Incidents
- Author: Author: H. G. Wells
- Start: I. What's the matter with you?" He turned round in my direction and looked about for me. He looked over me and at me and on either side of me, without the slightest sign of seeing me. "Waves," he said; "and a remarkably neat schooner. I'd swear that was Bellows' voice. _Hullo_!" He shouted suddenly at the top of his vo...
- End: support of his views; but, so far, he has simply succeeded in blinding a few dogs. I believe that is the net result of his work, though I have not seen him for some weeks. Latterly I have been so busy with my work in connection with the Saint Pancras installation that I have had little opportunity of calling to see...

## Heading Examples

- I.
- II.
- III.
