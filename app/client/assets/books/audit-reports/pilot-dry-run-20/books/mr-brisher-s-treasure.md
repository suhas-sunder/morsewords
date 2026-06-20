# Pilot Dry Run 20: mr-brisher-s-treasure

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/MR. BRISHER'S TREASURE.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Mr. Brisher’s Treasure
- Title evidence: source body heading line 34 - MR. BRISHER'S TREASURE
- Expected author: H. G. Wells
- Author evidence: Gutenberg Author line line 12 - Author: H. G. Wells
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: Gutenberg Author line line 12: Author: H. G. Wells
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Mr. Brisher’s Treasure
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: “You can't be TOO careful WHO you marry,” said Mr. Brisher
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: “You can't be TOO careful WHO you marry,” said Mr. Brisher, and pulled thoughtfully with a fat-wristed hand at the lank moustache that hides his want of chin. “That's why—” I ventured. “Yes,” said Mr. Brisher, with a solemn light in his bleary, blue-grey eyes, moving his head expressively and breathing alcohol INTIM...
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

- structure audit recommends processing with warnings; write pass must verify boundaries directly from raw source

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: MR. BRISHER'S TREASURE
- Author: Author: H. G. Wells
- Metadata: Author: H. G. Wells
- Start: Mr. Brisher’s Treasure “You can't be TOO careful WHO you marry,” said Mr. Brisher, and pulled thoughtfully with a fat-wristed hand at the lank moustache that hides his want of chin. “That's why—” I ventured. “Yes,” said Mr. Brisher, with a solemn light in his bleary, blue-grey eyes, moving his head expressively and breathing alcohol INTIM...
- End: ...eit coins,” he said. “Counterfeit coins!” “You don't mean to say—?” “Yes-It. Bad. Quite a long case they made of it. But they got 'im, though he dodged tremenjous. Traced 'is 'aving passed, oh!—nearly a dozen bad 'arf-crowns.” “And you didn't—?” “No fear. And it didn't do 'IM much good to say it was treasure trove.”

## Heading Examples

- Source tale heading: MR. BRISHER'S TREASURE
- First readable prose: “You can't be TOO careful WHO you marry,” said Mr. Brisher
