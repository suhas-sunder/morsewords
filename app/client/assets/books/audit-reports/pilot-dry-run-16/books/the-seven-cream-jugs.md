# Pilot Dry Run 16: the-seven-cream-jugs

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE SEVEN CREAM JUGS.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Seven Cream Jugs
- Title evidence: source body heading line 62 - THE SEVEN CREAM JUGS
- Expected author: Saki
- Author evidence: Gutenberg Author line line 13 - Author: Saki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Seven Cream Jugs
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: “I suppose we shall never see Wilfred Pigeoncote here now that he has
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: ?I suppose we shall never see Wilfred Pigeoncote here now that he has become heir to the baronetcy and to a lot of money,? observed Mrs. Peter Pigeoncote regretfully to her husband. ?Well, we can hardly expect to,? he replied, ?seeing that we always choked him off from coming to see us when he was a prospective nobo...
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

- Title: THE SEVEN CREAM JUGS
- Author: Author: Saki
- Start: The Seven Cream Jugs ?I suppose we shall never see Wilfred Pigeoncote here now that he has become heir to the baronetcy and to a lot of money,? observed Mrs. Peter Pigeoncote regretfully to her husband. ?Well, we can hardly expect to,? he replied, ?seeing that we always choked him off from coming to see us when he was a prospective nobo...
- End: ...sarily extend to family affairs. Peter Pigeoncote was never able to understand why Mrs. Consuelo van Bullyon, who stayed with them in the spring, always carried two very obvious jewel-cases with her to the bath-room, explaining them to any one she chanced to meet in the corridor as her manicure and face-massage set.

## Heading Examples

- Source tale heading: THE SEVEN CREAM JUGS
- First readable prose: ?I suppose we shall never see Wilfred Pigeoncote here now that he has
