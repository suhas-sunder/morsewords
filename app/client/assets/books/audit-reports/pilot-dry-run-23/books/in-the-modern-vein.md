# Pilot Dry Run 23: in-the-modern-vein

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/IN THE MODERN VEIN.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only Project Gutenberg source with reuse/source evidence present; no generated publish status exists yet
- Expected title: In the Modern Vein
- Title evidence: source body heading line 18 - IN THE MODERN VEIN
- Expected author: H. G. Wells
- Author evidence: visible title-page author line line 7 - H. G. WELLS
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: visible title-page author line line 7: H. G. WELLS
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: In the Modern Vein
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg or source-site footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Of course the cultivated reader has heard of Aubrey Vair.
- Expected end boundary: end before Project Gutenberg or source-site footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Of course the cultivated reader has heard of Aubrey Vair. He has published on three several occasions volumes of delicate verses,—some, indeed, border on indelicacy,—and his column “Of Things Literary” in the Climax is well known. His Byronic visage and an interview have appeared in the Perfect Lady. It was Aubrey V...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback

## Segmentation Risks

- no structure red flags; preserve the detected source-based headings

## Author Metadata Risks

- author did not come from a Gutenberg Author line; verify byline directly

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: IN THE MODERN VEIN
- Author: H. G. WELLS
- Metadata: H. G. WELLS
- Start: In the Modern Vein Of course the cultivated reader has heard of Aubrey Vair. He has published on three several occasions volumes of delicate verses,—some, indeed, border on indelicacy,—and his column “Of Things Literary” in the Climax is well known. His Byronic visage and an interview have appeared in the Perfect Lady. It was Aubrey V...
- End: ...editations to the level of fried potatoes. “These potatoes”—he remarked, after a pause during which he was struggling with recollection. “Yes. These potatoes have exactly the tints of the dead leaves of the hazel.” “What a fanciful poet it is!” said Mrs. Aubrey Vair. “Taste them. They are very nice potatoes indeed.”

## Heading Examples

- Source tale heading: IN THE MODERN VEIN
- First readable prose: Of course the cultivated reader has heard of Aubrey Vair.
