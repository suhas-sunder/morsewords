# Pilot Dry Run 13: old-sultan

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/OLD SULTAN.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Old Sultan
- Title evidence: source body heading line 43 - OLD SULTAN
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Old Sultan
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: A shepherd had a faithful dog, called Sultan, who was grown very old,
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: A shepherd had a faithful dog, called Sultan, who was grown very old, and had lost all his teeth. And one day when the shepherd and his wife were standing together before the house the shepherd said, ?I will shoot old Sultan tomorrow morning, for he is of no use now.? But his wife said, ?Pray let the poor faithful c...
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

- Title: OLD SULTAN
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: Old Sultan A shepherd had a faithful dog, called Sultan, who was grown very old, and had lost all his teeth. And one day when the shepherd and his wife were standing together before the house the shepherd said, ?I will shoot old Sultan tomorrow morning, for he is of no use now.? But his wife said, ?Pray let the poor faithful c...
- End: bush; and when he shook one of them a little, the cat, seeing something move, and thinking it was a mouse, sprang upon it, and bit and scratched it, so that the boar jumped up and grunted, and ran away, roaring out, ?Look up in the tree, there sits the one who is to blame.? So they looked up, and espied the wolf sit...

## Heading Examples

- First readable prose: A shepherd had a faithful dog, called Sultan, who was grown very old,
