# Pilot Dry Run 20: the-raspberry-worm

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Raspberry Worm.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Raspberry Worm
- Title evidence: source body heading line 47 - The Raspberry Worm
- Expected author: Andrew Lang
- Author evidence: Gutenberg Author line line 13 - Author: Andrew Lang
- Expected author/compiler/collector/translator/reteller role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Metadata evidence: Gutenberg Author line line 13: Author: Andrew Lang; visible editor byline line 32: Edited by Andrew Lang
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: The Raspberry Worm
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: ‘Phew!’ cried Lisa
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: ‘Phew!’ cried Lisa. ‘Ugh!’ cried Aina. ‘What now?’ cried the big sister. ‘A worm!’ cried Lisa. ‘On the raspberry!’ cried Aina. ‘Kill it!’ cried Otto. ‘What a fuss over a poor little worm!’ said the big sister scornfully. ‘Yes, when we had cleaned the raspberries so carefully,’ said Lisa. ‘It crept out from that very...
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

- Title: The Raspberry Worm
- Author: Author: Andrew Lang
- Metadata: Author: Andrew Lang; Edited by Andrew Lang
- Start: The Raspberry Worm ‘Phew!’ cried Lisa. ‘Ugh!’ cried Aina. ‘What now?’ cried the big sister. ‘A worm!’ cried Lisa. ‘On the raspberry!’ cried Aina. ‘Kill it!’ cried Otto. ‘What a fuss over a poor little worm!’ said the big sister scornfully. ‘Yes, when we had cleaned the raspberries so carefully,’ said Lisa. ‘It crept out from that very...
- End: ...no longer subject to the spells that bound the rest, and passed straight on its way, leaving the wizard crushed into powder in the heather. Then Bernez went home, and showed his wealth to Marzinne, who this time did not refuse him as a brother-in-law, and he and Rozennik were married, and lived happy for ever after.

## Heading Examples

- Source tale heading: The Raspberry Worm
- First readable prose: ‘Phew!’ cried Lisa
