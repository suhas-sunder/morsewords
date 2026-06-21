# Pilot Dry Run 22: in-the-vault

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/In the Vault.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; modern source-site wrapper is marked All Rights Reserved and must be excluded from any future generated body; no generated publish status exists yet
- Expected title: In the Vault
- Title evidence: source body heading line 4 - In the Vault
- Expected author: H. P. Lovecraft
- Author evidence: visible byline line 5 - By H. P. Lovecraft
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: visible byline line 5: By H. P. Lovecraft
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: In the Vault
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg or source-site footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: There is nothing more absurd, as I view it, than that conventional association
- Expected end boundary: end before Project Gutenberg or source-site footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: There is nothing more absurd, as I view it, than that conventional association of the homely and the wholesome which seems to pervade the psychology of the multitude. Mention a bucolic Yankee setting, a bungling and thick-fibred village undertaker, and a careless mishap in a tomb, and no average reader can be brough...
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

- author did not come from a Gutenberg Author line; verify byline directly

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: In the Vault
- Author: By H. P. Lovecraft
- Metadata: By H. P. Lovecraft
- Start: In the Vault There is nothing more absurd, as I view it, than that conventional association of the homely and the wholesome which seems to pervade the psychology of the multitude. Mention a bucolic Yankee setting, a bungling and thick-fibred village undertaker, and a careless mishap in a tomb, and no average reader can be brough...
- End: .... His head was broken in, and everything was tumbled about. I’ve seen sights before, but there was one thing too much here. An eye for an eye! Great heavens, Birch, but you got what you deserved. The skull turned my stomach, but the other was worse—those ankles cut neatly off to fit Matt Fenner’s cast-aside coffin!”

## Heading Examples

- Source tale heading: In the Vault
- First readable prose: There is nothing more absurd, as I view it, than that conventional association
