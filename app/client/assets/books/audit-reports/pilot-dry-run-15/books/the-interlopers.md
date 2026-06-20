# Pilot Dry Run 15: the-interlopers

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE INTERLOPERS.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Interlopers
- Title evidence: source body heading line 63 - THE INTERLOPERS
- Expected author: Saki
- Author evidence: Gutenberg Author line line 13 - Author: Saki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Interlopers
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: In a forest of mixed growth somewhere on the eastern spurs of the
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: In a forest of mixed growth somewhere on the eastern spurs of the Karpathians, a man stood one winter night watching and listening, as though he waited for some beast of the woods to come within the range of his vision, and, later, of his rifle. But the game for whose presence he kept so keen an outlook was none tha...
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

- Title: THE INTERLOPERS
- Author: Author: Saki
- Start: The Interlopers In a forest of mixed growth somewhere on the eastern spurs of the Karpathians, a man stood one winter night watching and listening, as though he waited for some beast of the woods to come within the range of his vision, and, later, of his rifle. But the game for whose presence he kept so keen an outlook was none tha...
- End: ...e they your men?” asked Georg. “Are they your men?” he repeated impatiently as Ulrich did not answer. “No,” said Ulrich with a laugh, the idiotic chattering laugh of a man unstrung with hideous fear. “Who are they?” asked Georg quickly, straining his eyes to see what the other would gladly not have seen. “_Wolves_.”

## Heading Examples

- Source tale heading: THE INTERLOPERS
- First readable prose: In a forest of mixed growth somewhere on the eastern spurs of the
