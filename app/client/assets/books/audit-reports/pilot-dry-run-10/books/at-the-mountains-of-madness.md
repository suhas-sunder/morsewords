# Pilot Dry Run 10: at-the-mountains-of-madness

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/At the mountains of madness.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: At the mountains of madness
- Title evidence: Gutenberg Title line line 11 - Title: At the mountains of madness
- Expected author: H. P. Lovecraft
- Author evidence: Gutenberg Author line line 13 - Author: H. P. Lovecraft
- Apparent work type: individual story
- Detected structural convention: standalone roman numeral sections with verified section I override
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: I.
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at I.: I am forced into speech because men of science
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use the 12 roman numeral story sections beginning with I; exclude title/byline/publication/source wrapper; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 12 planned standalone roman numeral sections with verified section I override sections unless a future write inspection demotes true front/back matter
- Likely section count: 12
- Expected preview start: I am forced into speech because men of science have refused to follow my advice without knowing why. It is altogether against my will that I tell my reasons for opposing this contemplated invasion of the antarctic--with its vast fossil hunt and its wholesale boring and melting of the ancient ice caps. And I am the m...
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

- Title: Title: At the mountains of madness
- Author: Author: H. P. Lovecraft
- Start: I. I am forced into speech because men of science have refused to follow my advice without knowing why. It is altogether against my will that I tell my reasons for opposing this contemplated invasion of the antarctic--with its vast fossil hunt and its wholesale boring and melting of the ancient ice caps. And I am the m...
- End: ividly distant scenes can sometimes be reflected, refracted, and magnified by such layers of restless cloud, might easily have supplied the rest--and, of course, Danforth did not hint any of these specific horrors till after his memory had had a chance to draw on his bygone reading. He could never have seen so much...

## Heading Examples

- I.
- II.
- III.
