# Pilot Dry Run 20: the-heart-of-a-monkey

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Heart of a Monkey.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Heart of a Monkey
- Title evidence: source body heading line 46 - The Heart of a Monkey
- Expected author: Andrew Lang
- Author evidence: Gutenberg Author line line 13 - Author: Andrew Lang
- Expected author/compiler/collector/translator/reteller role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Metadata evidence: Gutenberg Author line line 13: Author: Andrew Lang; visible editor byline line 32: Edited by Andrew Lang
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Heart of a Monkey
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: A long time ago a little town made up of a collection
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: A long time ago a little town made up of a collection of low huts stood in a tiny green valley at the foot of a cliff. Of course the people had taken great care to build their houses out of reach of the highest tide which might be driven on shore by a west wind, but on the very edge of the town there had sprung up a...
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

- Title: The Heart of a Monkey
- Author: Author: Andrew Lang
- Metadata: Author: Andrew Lang; Edited by Andrew Lang
- Start: The Heart of a Monkey A long time ago a little town made up of a collection of low huts stood in a tiny green valley at the foot of a cliff. Of course the people had taken great care to build their houses out of reach of the highest tide which might be driven on shore by a west wind, but on the very edge of the town there had sprung up a...
- End: ...ey to the shark, when the story was ended. ‘You are wrong; I am not. And as the sun is getting low in the sky, it is time for you to begin your homeward journey. You will have a nice cool voyage, and I hope you will find the sultan better. Farewell!’ And the monkey disappeared among the green branches, and was gone.

## Heading Examples

- Source tale heading: The Heart of a Monkey
- First readable prose: A long time ago a little town made up of a collection
