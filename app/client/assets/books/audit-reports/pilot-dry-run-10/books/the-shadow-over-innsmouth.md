# Pilot Dry Run 10: the-shadow-over-innsmouth

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The shadow over Innsmouth.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The shadow over Innsmouth
- Title evidence: Gutenberg Title line line 11 - Title: The shadow over Innsmouth
- Expected author: H. P. Lovecraft
- Author evidence: Gutenberg Author line line 13 - Author: H. P. Lovecraft
- Apparent work type: individual story
- Detected structural convention: standalone roman numeral sections with verified section I override
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: I
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at I: During the winter of 1927-28 Federal government officials
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use the 5 roman numeral story sections beginning with I; exclude title/byline/publication/source wrapper; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 5 planned standalone roman numeral sections with verified section I override sections unless a future write inspection demotes true front/back matter
- Likely section count: 5
- Expected preview start: During the winter of 1927-28 Federal government officials made a strange and secret investigation of certain conditions in the ancient Massachusetts seaport of Innsmouth. The public first learned of it in February, when a vast series of raids and arrests occurred, followed by the deliberate burning and dynamiting--u...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default
- illustration captions/placeholders must be removed from default playback

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

- illustration captions/placeholders detected

## Supporting Snippets

- Title: Title: The shadow over Innsmouth
- Author: Author: H. P. Lovecraft
- Start: I During the winter of 1927-28 Federal government officials made a strange and secret investigation of certain conditions in the ancient Massachusetts seaport of Innsmouth. The public first learned of it in February, when a vast series of raids and arrests occurred, followed by the deliberate burning and dynamiting--u...
- End: e railway cut. Of course my resolution to keep my eyes shut had failed. It was foredoomed to failure--for who could crouch blindly while a legion of croaking, baying entities of unknown source flopped noisomely past, scarcely more than a hundred yards away? For I knew that a long section of them must be plainly in s...

## Heading Examples

- I
- II
- III
