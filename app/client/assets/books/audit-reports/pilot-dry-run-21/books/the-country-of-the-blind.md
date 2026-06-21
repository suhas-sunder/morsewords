# Pilot Dry Run 21: the-country-of-the-blind

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE COUNTRY OF THE BLIND.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Country of the Blind
- Title evidence: source body heading line 18 - THE COUNTRY OF THE BLIND
- Expected author: H. G. Wells
- Author evidence: Gutenberg Author line line 4 - Author: H. G. Wells
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: Gutenberg Author line line 4: Author: H. G. Wells
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Country of the Blind
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Three hundred miles and more from Chimborazo, one hundred from the snows
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Three hundred miles and more from Chimborazo, one hundred from the snows of Cotopaxi, in the wildest wastes of Ecuador’s Andes, there lies that mysterious mountain valley, cut off from all the world of men, the Country of the Blind. Long years ago that valley lay so far open to the world that men might come at last...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- contents or list material must not enter default playback
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default

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

- Title: THE COUNTRY OF THE BLIND
- Author: Author: H. G. Wells
- Metadata: Author: H. G. Wells
- Start: The Country of the Blind Three hundred miles and more from Chimborazo, one hundred from the snows of Cotopaxi, in the wildest wastes of Ecuador’s Andes, there lies that mysterious mountain valley, cut off from all the world of men, the Country of the Blind. Long years ago that valley lay so far open to the world that men might come at last...
- End: ... vastness of the sky. But he heeded these things no longer, but lay quite still there, smiling as if he were content now merely to have escaped from the valley of the Blind, in which he had thought to be King. And the glow of the sunset passed, and the night came, and still he lay there, under the cold, clear stars.

## Heading Examples

- Source tale heading: THE COUNTRY OF THE BLIND
- First readable prose: Three hundred miles and more from Chimborazo, one hundred from the snows
