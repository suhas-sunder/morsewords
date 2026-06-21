# Pilot Dry Run 23: the-dreams-in-the-witch-house

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Dreams in the Witch-House.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; public/restricted status remains write-review gated and no generated publish status exists yet
- Expected title: The Dreams in the Witch-House
- Title evidence: source body heading line 30 - The Dreams in the Witch-House
- Expected author: H. P. Lovecraft
- Author evidence: Faded Page Author metadata line line 18 - _Author:_ Howard Phillips Lovecraft (1890-1937)
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: Faded Page Author metadata line line 18: _Author:_ Howard Phillips Lovecraft (1890-1937)
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: The Dreams in the Witch-House
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg or source-site footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Whether the dreams brought on the fever or the
- Expected end boundary: end before Project Gutenberg or source-site footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Whether the dreams brought on the fever or the fever brought on the dreams Walter Gilman did not know. Behind everything crouched the brooding, festering horror of the ancient town, and of the moldy, unhallowed garret gable where he wrote and studied and wrestled with figures and formulæ when he was not tossing on t...
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

- author did not come from a Gutenberg Author line; verify byline directly

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: The Dreams in the Witch-House
- Author: _Author:_ Howard Phillips Lovecraft (1890-1937)
- Metadata: _Author:_ Howard Phillips Lovecraft (1890-1937)
- Start: The Dreams in the Witch-House Whether the dreams brought on the fever or the fever brought on the dreams Walter Gilman did not know. Behind everything crouched the brooding, festering horror of the ancient town, and of the moldy, unhallowed garret gable where he wrote and studied and wrestled with figures and formulæ when he was not tossing on t...
- End: ...rody of a human skull. The workmen crossed themselves in fright when they came upon this blasphemy, but later burned candles of gratitude in St. Stanislaus’ Church because of the shrill, ghostly tittering they felt they would never hear again. [The end of _The Dreams in the Witch-House_ by Howard Phillips Lovecraft]

## Heading Examples

- Source tale heading: The Dreams in the Witch-House
- First readable prose: Whether the dreams brought on the fever or the
