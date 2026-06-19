# Pilot Dry Run 11: the-adventures-of-chanticleer-and-partlet

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE ADVENTURES OF CHANTICLEER AND PARTLET.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Adventures of Chanticleer and Partlet
- Title evidence: source body heading line 43 - THE ADVENTURES OF CHANTICLEER AND PARTLET
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: arabic-numbered titled story sections after parent collection wrapper
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: 1. HOW THEY WENT TO THE MOUNTAINS TO EAT NUTS
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at 1. HOW THEY WENT TO THE MOUNTAINS TO EAT NUTS: The nuts are quite ripe now
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use the three numbered story sections beginning with 1. HOW THEY WENT TO THE MOUNTAINS TO EAT NUTS; exclude parent Grimm title/byline/source wrapper; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 3 planned arabic-numbered titled story sections after parent collection wrapper sections unless a future write inspection demotes true front/back matter
- Likely section count: 3
- Expected preview start: The nuts are quite ripe now,? said Chanticleer to his wife Partlet, ?suppose we go together to the mountains, and eat as many as we can, before the squirrel takes them all away.? ?With all my heart,? said Partlet, ?let us go and make a holiday of it together.? So they went to the mountains; and as it was a lovely da...
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
- later ordinal headings are present; verify Chapter/Part/Book 1 remains included and selected first
- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: THE ADVENTURES OF CHANTICLEER AND PARTLET
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: 1. HOW THEY WENT TO THE MOUNTAINS TO EAT NUTS The nuts are quite ripe now,? said Chanticleer to his wife Partlet, ?suppose we go together to the mountains, and eat as many as we can, before the squirrel takes them all away.? ?With all my heart,? said Partlet, ?let us go and make a holiday of it together.? So they went to the mountains; and as it was a lovely da...
- End: ross the stream; and this time he got safely to the other side with the hearse, and managed to get Partlet out of it; but the fox and the other mourners, who were sitting behind, were too heavy, and fell back into the water and were all carried away by the stream and drowned. Thus Chanticleer was left alone with his...

## Heading Examples

- 1. HOW THEY WENT TO THE MOUNTAINS TO EAT NUTS
- 2. HOW CHANTICLEER AND PARTLET WENT TO VISIT MR KORBES
- 3. HOW PARTLET DIED AND WAS BURIED, AND HOW CHANTICLEER DIED OF GRIEF
