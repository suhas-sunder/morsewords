# Pilot Dry Run 15: the-occasional-garden

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE OCCASIONAL GARDEN.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Occasional Garden
- Title evidence: source body heading line 63 - THE OCCASIONAL GARDEN
- Expected author: Saki
- Author evidence: Gutenberg Author line line 13 - Author: Saki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Occasional Garden
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: “Don’t talk to me about town gardens,” said Elinor Rapsley; “which means,
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: ?Don?t talk to me about town gardens,? said Elinor Rapsley; ?which means, of course, that I want you to listen to me for an hour or so while I talk about nothing else. ?What a nice-sized garden you?ve got,? people said to us when we first moved here. What I suppose they meant to say was what a nice-sized site for a...
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

- Title: THE OCCASIONAL GARDEN
- Author: Author: Saki
- Start: The Occasional Garden ?Don?t talk to me about town gardens,? said Elinor Rapsley; ?which means, of course, that I want you to listen to me for an hour or so while I talk about nothing else. ?What a nice-sized garden you?ve got,? people said to us when we first moved here. What I suppose they meant to say was what a nice-sized site for a...
- End: ...n’t you hear about it? They broke in and made hay of the whole thing in about ten minutes. I was so heart-broken at the havoc that I had the whole place cleared out; I shall have it laid out again on rather more elaborate lines.” “That,” she said to the Baroness afterwards “is what I call having an emergency brain.”

## Heading Examples

- Source tale heading: THE OCCASIONAL GARDEN
- First readable prose: ?Don?t talk to me about town gardens,? said Elinor Rapsley; ?which means,
