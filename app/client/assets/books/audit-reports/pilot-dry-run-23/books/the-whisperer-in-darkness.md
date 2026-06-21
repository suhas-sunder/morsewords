# Pilot Dry Run 23: the-whisperer-in-darkness

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Whisperer in Darkness.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; public/restricted status remains write-review gated and no generated publish status exists yet
- Expected title: The Whisperer in Darkness
- Title evidence: source body heading line 30 - The Whisperer in Darkness
- Expected author: H. P. Lovecraft
- Author evidence: Faded Page Author metadata line - H. P. Lovecraft
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: Faded Page Author metadata line: H. P. Lovecraft
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: The Whisperer in Darkness
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg or source-site footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Bear in mind closely that I did not see any actual visual horror
- Expected end boundary: end before Project Gutenberg or source-site footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Bear in mind closely that I did not see any actual visual horror at the end. To say that a mental shock was the cause of what I inferred--that last straw which sent me racing out of the lonely Akeley farmhouse and through the wild domed hills of Vermont in a commandeered motor at night--is to ignore the plainest fac...
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

- Title: The Whisperer in Darkness
- Author: H. P. Lovecraft
- Metadata: H. P. Lovecraft
- Start: The Whisperer in Darkness Bear in mind closely that I did not see any actual visual horror at the end. To say that a mental shock was the cause of what I inferred--that last straw which sent me racing out of the lonely Akeley farmhouse and through the wild domed hills of Vermont in a commandeered motor at night--is to ignore the plainest fac...
- End: ...helf . . . poor devil . . . "prodigious surgical, biological, chemical, and mechanical skill" . . . . For the things in the chair, perfect to the last, subtle detail of microscopic resemblance--or identity--were the face and hands of Henry Wentworth Akeley. [The end of _The Whisperer in Darkness_ by H. P. Lovecraft]

## Heading Examples

- Source tale heading: The Whisperer in Darkness
- First readable prose: Bear in mind closely that I did not see any actual visual horror
