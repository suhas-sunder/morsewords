# Pilot Dry Run 13: the-dog-and-the-sparrow

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE DOG AND THE SPARROW.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Dog and the Sparrow
- Title evidence: source body heading line 43 - THE DOG AND THE SPARROW
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Dog and the Sparrow
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: A shepherd’s dog had a master who took no care of him, but often let him
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: A shepherd?s dog had a master who took no care of him, but often let him suffer the greatest hunger. At last he could bear it no longer; so he took to his heels, and off he ran in a very sad and sorrowful mood. On the road he met a sparrow that said to him, ?Why are you so sad, my friend?? ?Because,? said the dog, ?...
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

- Title: THE DOG AND THE SPARROW
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: The Dog and the Sparrow A shepherd?s dog had a master who took no care of him, but often let him suffer the greatest hunger. At last he could bear it no longer; so he took to his heels, and off he ran in a very sad and sorrowful mood. On the road he met a sparrow that said to him, ?Why are you so sad, my friend?? ?Because,? said the dog, ?...
- End: t, and threw it at the sparrow; but it missed her, and only broke the window. The sparrow now hopped in, perched upon the window-seat, and cried, ?Carter! it shall cost thee thy life!? Then he became mad and blind with rage, and struck the window-seat with such force that he cleft it in two: and as the sparrow flew...

## Heading Examples

- First readable prose: A shepherd?s dog had a master who took no care of him, but often let him
