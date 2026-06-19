# Pilot Dry Run 12: the-oversight

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE OVERSIGHT.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Oversight
- Title evidence: source body heading line 63 - THE OVERSIGHT
- Expected author: Saki
- Author evidence: Gutenberg Author line line 13 - Author: Saki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: The Oversight
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: “It’s like a Chinese puzzle
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: ?It?s like a Chinese puzzle,? said Lady Prowche resentfully, staring at a scribbled list of names that spread over two or three loose sheets of notepaper on her writing-table. Most of the names had a pencil mark running through them. ?What is like a Chinese puzzle?? asked Lena Luddleford briskly; she rather prided h...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback

## Segmentation Risks

- structure audit recommends processing with warnings; write pass must verify boundaries directly from raw source
- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: THE OVERSIGHT
- Author: Author: Saki
- Start: The Oversight ?It?s like a Chinese puzzle,? said Lady Prowche resentfully, staring at a scribbled list of names that spread over two or three loose sheets of notepaper on her writing-table. Most of the names had a pencil mark running through them. ?What is like a Chinese puzzle?? asked Lena Luddleford briskly; she rather prided h...
- End: a scene from one of Hogarth?s pictures. I never felt so humiliated in my life. What the servants must have thought!? ?But who were the offenders?? ?Oh, naturally the very two that we took all the trouble about.? ?I thought they agreed on every subject that one could violently disagree about?religion, politics, vivis...

## Heading Examples

- First readable prose: ?It?s like a Chinese puzzle
