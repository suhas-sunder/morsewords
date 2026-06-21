# Pilot Dry Run 23: the-purple-pileus

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE PURPLE PILEUS.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only Project Gutenberg source with reuse/source evidence present; no generated publish status exists yet
- Expected title: The Purple Pileus
- Title evidence: source body heading line 18 - THE PURPLE PILEUS
- Expected author: H. G. Wells
- Author evidence: visible title-page author line line 7 - H. G. WELLS
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: visible title-page author line line 7: H. G. WELLS
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Purple Pileus
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg or source-site footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Mr. Coombes was sick of life.
- Expected end boundary: end before Project Gutenberg or source-site footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Mr. Coombes was sick of life. He walked away from his unhappy home, and, sick not only of his own existence, but of everybody else’s, turned aside down Gaswork Lane to avoid the town, and, crossing the wooden bridge that goes over the canal to Starling’s Cottages, was presently alone in the damp pinewoods and out of...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback

## Segmentation Risks

- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- author did not come from a Gutenberg Author line; verify byline directly

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: THE PURPLE PILEUS
- Author: H. G. WELLS
- Metadata: H. G. WELLS
- Start: The Purple Pileus Mr. Coombes was sick of life. He walked away from his unhappy home, and, sick not only of his own existence, but of everybody else’s, turned aside down Gaswork Lane to avoid the town, and, crossing the wooden bridge that goes over the canal to Starling’s Cottages, was presently alone in the damp pinewoods and out of...
- End: ...m presently. “I can’t see what use they are in the world.” Mr. Coombes looked. “I dessay they’re sent for some wise purpose,” said Mr. Coombes. And that was as much thanks as the purple pileus ever got for maddening this absurd little man to the pitch of decisive action, and so altering the whole course of his life.

## Heading Examples

- Source tale heading: THE PURPLE PILEUS
- First readable prose: Mr. Coombes was sick of life.
