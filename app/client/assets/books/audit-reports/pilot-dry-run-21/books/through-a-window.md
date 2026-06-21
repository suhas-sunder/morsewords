# Pilot Dry Run 21: through-a-window

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THROUGH A WINDOW.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Through a Window
- Title evidence: source body heading line 65 - THROUGH A WINDOW
- Expected author: H. G. Wells
- Author evidence: Gutenberg Author line line 13 - Author: H. G. Wells
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: Gutenberg Author line line 13: Author: H. G. Wells
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Through a Window
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: After his legs were set, they carried Bailey into the study and put
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: After his legs were set, they carried Bailey into the study and put him on a couch before the open window. There he lay, a live--even a feverish man down to the loins, and below that a double-barrelled mummy swathed in white wrappings. He tried to read, even tried to write a little, but most of the time he looked ou...
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

- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: THROUGH A WINDOW
- Author: Author: H. G. Wells
- Metadata: Author: H. G. Wells
- Start: Through a Window After his legs were set, they carried Bailey into the study and put him on a couch before the open window. There he lay, a live--even a feverish man down to the loins, and below that a double-barrelled mummy swathed in white wrappings. He tried to read, even tried to write a little, but most of the time he looked ou...
- End: ...ttle with all his strength on to the Malay's face. The krees fell heavily upon the floor. "Easy with those legs," said Bailey, as young Fitzgibbon and one of the boating party lifted the body off him. Young Fitzgibbon was very white in the face. "I didn't mean to kill him," he said. "It's just as well," said Bailey.

## Heading Examples

- Source tale heading: THROUGH A WINDOW
- First readable prose: After his legs were set, they carried Bailey into the study and put
