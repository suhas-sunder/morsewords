# Pilot Dry Run 14: the-blue-light

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE BLUE LIGHT.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Blue Light
- Title evidence: source body heading line 43 - THE BLUE LIGHT
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Blue Light
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: There was once upon a time a soldier who for many years had served the
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: There was once upon a time a soldier who for many years had served the king faithfully, but when the war came to an end could serve no longer because of the many wounds which he had received. The king said to him: ?You may return to your home, I need you no longer, and you will not receive any more money, for he onl...
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

- Title: THE BLUE LIGHT
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: The Blue Light There was once upon a time a soldier who for many years had served the king faithfully, but when the war came to an end could serve no longer because of the many wounds which he had received. The king said to him: ?You may return to your home, I need you no longer, and you will not receive any more money, for he onl...
- End: ...hem like lightning, darting this way and that way, and whosoever was so much as touched by his cudgel fell to earth, and did not venture to stir again. The king was terrified; he threw himself on the soldier’s mercy, and merely to be allowed to live at all, gave him his kingdom for his own, and his daughter to wife.

## Heading Examples

- Source tale heading: THE BLUE LIGHT
- First readable prose: There was once upon a time a soldier who for many years had served the
