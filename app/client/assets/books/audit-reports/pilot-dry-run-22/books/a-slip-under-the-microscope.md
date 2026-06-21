# Pilot Dry Run 22: a-slip-under-the-microscope

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/A SLIP UNDER THE MICROSCOPE.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only Project Gutenberg source with reuse/source evidence present; no generated publish status exists yet
- Expected title: A Slip Under the Microscope
- Title evidence: source body heading line 14 - A SLIP UNDER THE MICROSCOPE
- Expected author: H. G. Wells
- Author evidence: visible title-page author line line 7 - H. G. WELLS
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: visible title-page author line line 7: H. G. WELLS
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: A Slip Under the Microscope
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg or source-site footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Outside the laboratory windows was a watery-grey fog
- Expected end boundary: end before Project Gutenberg or source-site footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Outside the laboratory windows was a watery-grey fog, and within a close warmth and the yellow light of the green-shaded gas lamps that stood two to each table down its narrow length. On each table stood a couple of glass jars containing the mangled vestiges of the crayfish, mussels, frogs, and guineapigs, upon whic...
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

- author did not come from a Gutenberg Author line; verify byline directly

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: A SLIP UNDER THE MICROSCOPE
- Author: H. G. WELLS
- Metadata: H. G. WELLS
- Start: A Slip Under the Microscope Outside the laboratory windows was a watery-grey fog, and within a close warmth and the yellow light of the green-shaded gas lamps that stood two to each table down its narrow length. On each table stood a couple of glass jars containing the mangled vestiges of the crayfish, mussels, frogs, and guineapigs, upon whic...
- End: ...ely believe it then,” and abruptly she turned her back on the girl in spectacles, and walked to her own place. “It’s true, all the same,” said the girl in spectacles, peering and smiling at Wedderburn. But Wedderburn did not answer her. She was indeed one of those people who seem destined to make unanswered remarks.

## Heading Examples

- Source tale heading: A SLIP UNDER THE MICROSCOPE
- First readable prose: Outside the laboratory windows was a watery-grey fog
