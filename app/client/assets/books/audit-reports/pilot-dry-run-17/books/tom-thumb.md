# Pilot Dry Run 17: tom-thumb

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/TOM THUMB.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Tom Thumb
- Title evidence: source body heading line 43 - TOM THUMB
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Expected author/compiler/collector/translator/reteller role: authors: Jacob Grimm and Wilhelm Grimm (raw source labels them as authors)
- Metadata evidence: Gutenberg Author line line 13: Author: Jacob Grimm; Wilhelm Grimm; visible collection byline line 35: By Jacob Grimm and Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Tom Thumb
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: A poor woodman sat in his cottage one night, smoking his pipe by the
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: A poor woodman sat in his cottage one night, smoking his pipe by the fireside, while his wife sat by his side spinning. ‘How lonely it is, wife,’ said he, as he puffed out a long curl of smoke, ‘for you and me to sit here by ourselves, without any children to play about and amuse us while other people seem so happy...
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

- Title: TOM THUMB
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Metadata: Author: Jacob Grimm; Wilhelm Grimm; By Jacob Grimm and Wilhelm Grimm
- Start: Tom Thumb A poor woodman sat in his cottage one night, smoking his pipe by the fireside, while his wife sat by his side spinning. ‘How lonely it is, wife,’ said he, as he puffed out a long curl of smoke, ‘for you and me to sit here by ourselves, without any children to play about and amuse us while other people seem so happy...
- End: ...is old ones had been quite spoiled on his journey. So Master Thumb stayed at home with his father and mother, in peace; for though he had been so great a traveller, and had done and seen so many fine things, and was fond enough of telling the whole story, he always agreed that, after all, there’s no place like HOME!

## Heading Examples

- Source tale heading: TOM THUMB
- First readable prose: A poor woodman sat in his cottage one night, smoking his pipe by the
