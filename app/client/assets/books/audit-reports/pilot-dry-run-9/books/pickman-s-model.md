# Pilot Dry Run 9: pickman-s-model

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/Pickman's Model.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Pickman's Model
- Title evidence: Gutenberg Title line line 16 - Title: Pickman's Model
- Expected author: H. P. Lovecraft (1890-1937)
- Author evidence: Gutenberg Author line line 18 - Author: H. P. Lovecraft (1890-1937)
- Apparent work type: standalone book
- Detected structural convention: single contiguous story section
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Pickman's Model
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: You needn't think I'm crazy
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: You needn't think I'm crazy, Eliot--plenty of others have queerer prejudices than this. Why don't you laugh at Oliver's grandfather, who won't ride in a motor? If I don't like that damned subway, it's my own business; and we got here more quickly anyhow in the taxi. We'd have had to walk up the hill from Park Street...
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

- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- illustration captions/placeholders detected

## Supporting Snippets

- Title: Title: Pickman's Model
- Author: Author: H. P. Lovecraft (1890-1937)
- Start: Pickman's Model You needn't think I'm crazy, Eliot--plenty of others have queerer prejudices than this. Why don't you laugh at Oliver's grandfather, who won't ride in a motor? If I don't like that damned subway, it's my own business; and we got here more quickly anyhow in the taxi. We'd have had to walk up the hill from Park Street...
- End: r that monster. That last scare had come while I was reaching to uncurl it, and it seems I had vacantly crumpled it into my pocket. But here's the coffee--take it black, Eliot, if you're wise. Well--that paper wasn't a photograph of any background, after all. What it showed was simply the monstrous being he was pain...

## Heading Examples

- First readable prose: You needn't think I'm crazy
