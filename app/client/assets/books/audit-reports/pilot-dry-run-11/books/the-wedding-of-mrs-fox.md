# Pilot Dry Run 11: the-wedding-of-mrs-fox

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE WEDDING OF MRS FOX.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Wedding of Mrs Fox
- Title evidence: source body heading line 43 - THE WEDDING OF MRS FOX
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: The Wedding of Mrs Fox
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: There was once upon a time an old fox
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: There was once upon a time an old fox with nine tails, who believed that his wife was not faithful to him, and wished to put her to the test. He stretched himself out under the bench, did not move a limb, and behaved as if he were stone dead. Mrs Fox went up to her room, shut herself in, and her maid, Miss Cat, sat...
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

- Title: THE WEDDING OF MRS FOX
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: The Wedding of Mrs Fox There was once upon a time an old fox with nine tails, who believed that his wife was not faithful to him, and wished to put her to the test. He stretched himself out under the bench, did not move a limb, and behaved as if he were stone dead. Mrs Fox went up to her room, shut herself in, and her maid, Miss Cat, sat...
- End: tockings on, and has a little pointed mouth?? ?Yes,? said the cat, ?he has.? ?Then let him come upstairs,? said Mrs Fox, and ordered the servant to prepare the wedding feast. ?Sweep me the room as clean as you can, Up with the window, fling out my old man! For many a fine fat mouse he brought, Yet of his wife he nev...

## Heading Examples

- First readable prose: There was once upon a time an old fox
