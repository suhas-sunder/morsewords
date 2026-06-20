# Pilot Dry Run 20: miss-winchelsea-s-heart

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/MISS WINCHELSEA'S HEART.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Miss Winchelsea’s Heart
- Title evidence: source body heading line 34 - MISS WINCHELSEA'S HEART
- Expected author: H. G. Wells
- Author evidence: Gutenberg Author line line 12 - Author: H. G. Wells
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: Gutenberg Author line line 12: Author: H. G. Wells
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Miss Winchelsea’s Heart
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Miss Winchelsea was going to Rome
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Miss Winchelsea was going to Rome. The matter had filled her mind for a month or more, and had overflowed so abundantly into her conversation that quite a number of people who were not going to Rome, and who were not likely to go to Rome, had made it a personal grievance against her. Some indeed had attempted quite...
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

- Title: MISS WINCHELSEA'S HEART
- Author: Author: H. G. Wells
- Metadata: Author: H. G. Wells
- Start: Miss Winchelsea’s Heart Miss Winchelsea was going to Rome. The matter had filled her mind for a month or more, and had overflowed so abundantly into her conversation that quite a number of people who were not going to Rome, and who were not likely to go to Rome, had made it a personal grievance against her. Some indeed had attempted quite...
- End: ...ver in Florence. It was a sadly disappointing week, and Miss Winchelsea was glad when it came to an end. Under various excuses she avoided visiting them again. After a time the visitor's room was occupied by their two little boys, and Fanny's invitations ceased. The intimacy of her letters had long since faded away.

## Heading Examples

- Source tale heading: MISS WINCHELSEA'S HEART
- First readable prose: Miss Winchelsea was going to Rome
