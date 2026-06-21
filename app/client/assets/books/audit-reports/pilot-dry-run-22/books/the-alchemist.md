# Pilot Dry Run 22: the-alchemist

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Alchemist.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; modern source-site wrapper is marked All Rights Reserved and must be excluded from any future generated body; no generated publish status exists yet
- Expected title: The Alchemist
- Title evidence: source body heading line 4 - The Alchemist
- Expected author: H. P. Lovecraft
- Author evidence: visible byline line 5 - By H. P. Lovecraft
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: visible byline line 5: By H. P. Lovecraft
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: The Alchemist
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg or source-site footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: High up, crowning the grassy summit of a swelling mound
- Expected end boundary: end before Project Gutenberg or source-site footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: High up, crowning the grassy summit of a swelling mound whose sides are wooded near the base with the gnarled trees of the primeval forest, stands the old chateau of my ancestors. For centuries its lofty battlements have frowned down upon the wild and rugged countryside about, serving as a home and stronghold for th...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- contents or list material must not enter default playback
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

- Title: The Alchemist
- Author: By H. P. Lovecraft
- Metadata: By H. P. Lovecraft
- Start: The Alchemist High up, crowning the grassy summit of a swelling mound whose sides are wooded near the base with the gnarled trees of the primeval forest, stands the old chateau of my ancestors. For centuries its lofty battlements have frowned down upon the wild and rugged countryside about, serving as a home and stronghold for th...
- End: ...he will which has through six long centuries fulfilled the dreadful curse upon your house? Have I not told you of the great elixir of eternal life? Know you not how the secret of Alchemy was solved? I tell you, it is I! I! I! that have lived for six hundred years to maintain my revenge, FOR I AM CHARLES LE SORCIER!”

## Heading Examples

- Source tale heading: The Alchemist
- First readable prose: High up, crowning the grassy summit of a swelling mound
