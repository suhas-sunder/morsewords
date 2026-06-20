# Pilot Dry Run 20: the-one-handed-girl

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The One-Handed Girl.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The One-Handed Girl
- Title evidence: source body heading line 46 - The One-Handed Girl
- Expected author: Andrew Lang
- Author evidence: Gutenberg Author line line 13 - Author: Andrew Lang
- Expected author/compiler/collector/translator/reteller role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Metadata evidence: Gutenberg Author line line 13: Author: Andrew Lang; visible editor byline line 32: Edited by Andrew Lang
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The One-Handed Girl
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: An old couple once lived in a hut under a grove of palm trees
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: An old couple once lived in a hut under a grove of palm trees, and they had one son and one daughter. They were all very happy together for many years, and then the father became very ill, and felt he was going to die. He called his children to the place where he lay on the floor--for no one had any beds in that cou...
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

- Title: The One-Handed Girl
- Author: Author: Andrew Lang
- Metadata: Author: Andrew Lang; Edited by Andrew Lang
- Start: The One-Handed Girl An old couple once lived in a hut under a grove of palm trees, and they had one son and one daughter. They were all very happy together for many years, and then the father became very ill, and felt he was going to die. He called his children to the place where he lay on the floor--for no one had any beds in that cou...
- End: ...ake, nor have got my hand back again. So let us forget all about it, and be happy once more, for see! our son is growing quite a big boy.’ ‘And what shall be done to your brother?’ asked the king, who was glad to think that someone had acted in this matter worse than himself. ‘Put him out of the town,’ answered she.

## Heading Examples

- Source tale heading: The One-Handed Girl
- First readable prose: An old couple once lived in a hut under a grove of palm trees
