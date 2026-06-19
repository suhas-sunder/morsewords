# Pilot Dry Run 11: jorinda-and-jorindel

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/JORINDA AND JORINDEL.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Jorinda and Jorindel
- Title evidence: source body heading line 43 - JORINDA AND JORINDEL
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: Jorinda and Jorindel
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: There was once an old castle
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: There was once an old castle, that stood in the middle of a deep gloomy wood, and in the castle lived an old fairy. Now this fairy could take any shape she pleased. All the day long she flew about in the form of an owl, or crept about the country like a cat; but at night she always became an old woman again. When an...
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

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: JORINDA AND JORINDEL
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: Jorinda and Jorindel There was once an old castle, that stood in the middle of a deep gloomy wood, and in the castle lived an old fairy. Now this fairy could take any shape she pleased. All the day long she flew about in the form of an owl, or crept about the country like a cat; but at night she always became an old woman again. When an...
- End: r her, touched the cage with the flower, and Jorinda stood before him, and threw her arms round his neck looking as beautiful as ever, as beautiful as when they walked together in the wood. Then he touched all the other birds with the flower, so that they all took their old forms again; and he took Jorinda home, whe...

## Heading Examples

- First readable prose: There was once an old castle
