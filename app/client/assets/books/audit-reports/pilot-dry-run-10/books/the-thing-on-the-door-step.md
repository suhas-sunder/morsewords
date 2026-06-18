# Pilot Dry Run 10: the-thing-on-the-door-step

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The thing on the door-step.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The thing on the door-step
- Title evidence: Gutenberg Title line line 11 - Title: The thing on the door-step
- Expected author: H. P. Lovecraft
- Author evidence: Gutenberg Author line line 13 - Author: H. P. Lovecraft
- Apparent work type: individual story
- Detected structural convention: standalone arabic-numbered sections with verified section 1 override
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: 1
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at 1: It is true that I have sent six bullets
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use the 7 numbered story sections beginning with section 1; exclude title/byline/publication/source wrapper; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 7 planned standalone arabic-numbered sections with verified section 1 override sections unless a future write inspection demotes true front/back matter
- Likely section count: 7
- Expected preview start: It is true that I have sent six bullets through the head of my best friend, and yet I hope to show by this statement that I am not his murderer. At first I shall be called a madman--madder than the man I shot in his cell at the Arkham Sanitarium. Later some of my readers will weigh each statement, correlate it with...
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

- Title: Title: The thing on the door-step
- Author: Author: H. P. Lovecraft
- Start: 1 It is true that I have sent six bullets through the head of my best friend, and yet I hope to show by this statement that I am not his murderer. At first I shall be called a madman--madder than the man I shot in his cell at the Arkham Sanitarium. Later some of my readers will weigh each statement, correlate it with...
- End: ou what it will do. Keep clear of black magic, Dan--it's the devil's business. Good-bye--you've been a great friend. Tell the police whatever they'll believe--and I'm damnably sorry to drag all this on you. I'll be at peace before long--this thing won't hold together much more. Hope you can read this. _And kill that...

## Heading Examples

- 1
- 2
- 3
