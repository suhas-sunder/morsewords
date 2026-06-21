# Pilot Dry Run 23: the-strange-high-house-in-the-mist

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Strange High House in the Mist.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; public/restricted status remains write-review gated and no generated publish status exists yet
- Expected title: The Strange High House in the Mist
- Title evidence: source body heading line 33 - The Strange High House in the Mist
- Expected author: H. P. Lovecraft
- Author evidence: Faded Page Author metadata line line 18 - _Author:_ Howard Phillips Lovecraft (1890-1937)
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: Faded Page Author metadata line line 18: _Author:_ Howard Phillips Lovecraft (1890-1937)
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Strange High House in the Mist
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg or source-site footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: In the morning mist comes up from the sea by the cliffs beyond
- Expected end boundary: end before Project Gutenberg or source-site footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: In the morning mist comes up from the sea by the cliffs beyond Kingsport. White and feathery it comes from the deep to its brothers the clouds, full of dreams of dank pastures and caves of leviathan. And later, in still summer rains on the steep roofs of poets, the clouds scatter bits of those dreams, that men shall...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default
- illustration captions/placeholders must be removed from default playback

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback

## Segmentation Risks

- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- author did not come from a Gutenberg Author line; verify byline directly

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- illustration captions/placeholders detected

## Supporting Snippets

- Title: The Strange High House in the Mist
- Author: _Author:_ Howard Phillips Lovecraft (1890-1937)
- Metadata: _Author:_ Howard Phillips Lovecraft (1890-1937)
- Start: The Strange High House in the Mist In the morning mist comes up from the sea by the cliffs beyond Kingsport. White and feathery it comes from the deep to its brothers the clouds, full of dreams of dank pastures and caves of leviathan. And later, in still summer rains on the steep roofs of poets, the clouds scatter bits of those dreams, that men shall...
- End: ... nestling uneasy on its lesser cliffs below that awesome hanging sentinel of rock, sees oceanward only a mystic whiteness, as if the cliff's rim were the rim of all earth, and the solemn bells of the buoys tolled free in the æther of faëry. [The end of The Strange High House in the Mist by Howard Phillips Lovecraft]

## Heading Examples

- Source tale heading: The Strange High House in the Mist
- First readable prose: In the morning mist comes up from the sea by the cliffs beyond
