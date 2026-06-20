# Pilot Dry Run 19: the-monkey-and-the-jelly-fish

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE MONKEY AND THE JELLY-FISH.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Monkey and the Jelly-Fish
- Title evidence: source body heading line 52 - THE MONKEY AND THE JELLY-FISH
- Expected author: Andrew Lang
- Author evidence: Gutenberg Author line line 13 - Author: Andrew Lang
- Expected author/compiler/collector/translator/reteller role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Metadata evidence: Gutenberg Author line line 13: Author: Andrew Lang; visible editor byline line 42: Edited By Andrew Lang
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Monkey and the Jelly-Fish
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Children must often have wondered why jelly-fishes have no shells, like
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Children must often have wondered why jelly-fishes have no shells, like so many of the creatures that are washed up every day on the beach. In old times this was not so; the jelly-fish had as hard a shell as any of them, but he lost it through his own fault, as may be seen in this story. The sea-queen Otohime, whom...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback

## Segmentation Risks

- structure audit recommends processing with warnings; write pass must verify boundaries directly from raw source
- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: THE MONKEY AND THE JELLY-FISH
- Author: Author: Andrew Lang
- Metadata: Author: Andrew Lang; Edited By Andrew Lang
- Start: The Monkey and the Jelly-Fish Children must often have wondered why jelly-fishes have no shells, like so many of the creatures that are washed up every day on the beach. In old times this was not so; the jelly-fish had as hard a shell as any of them, but he lost it through his own fault, as may be seen in this story. The sea-queen Otohime, whom...
- End: ...s advisers and tell them all that had befallen him, and how he had suffered the monkey to escape. But, as sometimes happens, the turtle was allowed to go scot-free, and had his shell given back to him, and all the punishment fell on the poor jelly-fish, who was condemned by the queen to go shieldless for ever after.

## Heading Examples

- Source tale heading: THE MONKEY AND THE JELLY-FISH
- First readable prose: Children must often have wondered why jelly-fishes have no shells, like
