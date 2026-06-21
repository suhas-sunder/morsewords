# Pilot Dry Run 23: the-argonauts-of-the-air

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE ARGONAUTS OF THE AIR.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only Project Gutenberg source with reuse/source evidence present; no generated publish status exists yet
- Expected title: The Argonauts of the Air
- Title evidence: source body heading line 18 - THE ARGONAUTS OF THE AIR
- Expected author: H. G. Wells
- Author evidence: visible title-page author line line 7 - H. G. WELLS
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: visible title-page author line line 7: H. G. WELLS
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Argonauts of the Air
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg or source-site footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: One saw Monson’s Flying Machine from the windows of the trains passing
- Expected end boundary: end before Project Gutenberg or source-site footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: One saw Monson’s Flying Machine from the windows of the trains passing either along the South-Western main line or along the line between Wimbledon and Worcester Park,—to be more exact, one saw the huge scaffoldings which limited the flight of the apparatus. They rose over the tree-tops, a massive alley of interlaci...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback

## Segmentation Risks

- no structure red flags; preserve the detected source-based headings

## Author Metadata Risks

- author did not come from a Gutenberg Author line; verify byline directly

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: THE ARGONAUTS OF THE AIR
- Author: H. G. WELLS
- Metadata: H. G. WELLS
- Start: The Argonauts of the Air One saw Monson’s Flying Machine from the windows of the trains passing either along the South-Western main line or along the line between Wimbledon and Worcester Park,—to be more exact, one saw the huge scaffoldings which limited the flight of the apparatus. They rose over the tree-tops, a massive alley of interlaci...
- End: ...and of[46] gallant experimentalists who will sooner or later master this great problem of flying. And between Worcester Park and Malden there still stands that portentous avenue of iron-work, rusting now, and dangerous here and there, to witness to the first desperate struggle for man’s right of way through the air.

## Heading Examples

- Source tale heading: THE ARGONAUTS OF THE AIR
- First readable prose: One saw Monson’s Flying Machine from the windows of the trains passing
