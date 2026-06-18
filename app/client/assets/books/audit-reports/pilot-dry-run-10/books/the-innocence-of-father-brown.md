# Pilot Dry Run 10: the-innocence-of-father-brown

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The innocence of Father Brown.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The innocence of Father Brown
- Title evidence: Gutenberg Title line line 11 - Title: The innocence of Father Brown
- Expected author: G. K. Chesterton
- Author evidence: Gutenberg Author line line 13 - Author: G. K. Chesterton
- Apparent work type: story collection
- Detected structural convention: isolated titled sections
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: The Secret Garden
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at cleaned-body line 800: The Secret Garden
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Isolated title-case heading boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 29 planned isolated titled sections sections unless a future write inspection demotes true front/back matter
- Likely section count: 29
- Expected preview start: Aristide Valentin, Chief of the Paris Police, was late for his dinner, and some of his guests began to arrive before him. These were, however, reassured by his confidential servant, Ivan, the old man with a scar, and a face almost as grey as his moustaches, who always sat at a table in the entrance hall--a hall hung...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- contents or list material must not enter default playback
- Project Gutenberg/source/license material must be removed

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback
- first default section is meaningful but should be verified manually in write pass

## Segmentation Risks

- structure audit recommends processing with warnings; write pass must verify boundaries directly from raw source

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- ensure the generated title stays the collection title and individual story titles become sections

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Title: The innocence of Father Brown
- Author: Author: G. K. Chesterton
- Start: The Secret Garden Aristide Valentin, Chief of the Paris Police, was late for his dinner, and some of his guests began to arrive before him. These were, however, reassured by his confidential servant, Ivan, the old man with a scar, and a face almost as grey as his moustaches, who always sat at a table in the entrance hall--a hall hung...
- End: r paused a little for breath before he went on. Then he continued in the same business-like tone: ?Only a month or two ago a certain Brazilian official died in England, having quarrelled with Olivier and left his country. He was a well-known figure both here and on the Continent, a Spaniard named Espado; I knew him...

## Heading Examples

- L800: The Secret Garden
- L1124: ?Thank you,? said Valentin. ?Come in, Ivan.?
- L1229: ?Gone. Scooted. Evaporated,? replied Ivan in humorous French. ?His hat
- L1324: ?Great Heaven!? cried O?Brien. ?Is Brayne a monomaniac??
- L1365: ?Good morning, Commandant O?Brien,? said Valentin, with quiet
- L1625: The Queer Feet
