# Pilot Dry Run 23: the-shadow-out-of-time

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Shadow Out of Time.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; public/restricted status remains write-review gated and no generated publish status exists yet
- Expected title: The Shadow Out of Time
- Title evidence: source body heading line 30 - THE SHADOW OUT OF TIME
- Expected author: H. P. Lovecraft
- Author evidence: Faded Page Author metadata line line 18 - _Author:_ H. P. (Howard Phillips) Lovecraft, (1890-1937)
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: Faded Page Author metadata line line 18: _Author:_ H. P. (Howard Phillips) Lovecraft, (1890-1937)
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: The Shadow Out of Time
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg or source-site footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: After twenty-two years of nightmare and terror
- Expected end boundary: end before Project Gutenberg or source-site footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: After twenty-two years of nightmare and terror, saved only by a desperate conviction of the mythical source of certain impressions, I am unwilling to vouch for the truth of that which I think I found in Western Australia on the night of July 17-18, 1935. There is reason to hope that my experience was wholly or partl...
- Duplicate/near-duplicate slug check: Review required if selected: possible generated slug overlap with the-shadow.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback

## Segmentation Risks

- later ordinal headings are present; verify Chapter/Part/Book 1 remains included and selected first
- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- author did not come from a Gutenberg Author line; verify byline directly

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: THE SHADOW OUT OF TIME
- Author: _Author:_ H. P. (Howard Phillips) Lovecraft, (1890-1937)
- Metadata: _Author:_ H. P. (Howard Phillips) Lovecraft, (1890-1937)
- Start: The Shadow Out of Time After twenty-two years of nightmare and terror, saved only by a desperate conviction of the mythical source of certain impressions, I am unwilling to vouch for the truth of that which I think I found in Western Australia on the night of July 17-18, 1935. There is reason to hope that my experience was wholly or partl...
- End: ...eerly pigmented letters on the brittle, æon-browned cellulose pages were not indeed any nameless hieroglyphs of Earth’s youth. They were, instead, the letters of our familiar alphabet, spelling out the words of the English language, in my own handwriting. [The end of <i>The Shadow Out of Time</i> by H. P. Lovecraft]

## Heading Examples

- Source tale heading: THE SHADOW OUT OF TIME
- First readable prose: After twenty-two years of nightmare and terror
