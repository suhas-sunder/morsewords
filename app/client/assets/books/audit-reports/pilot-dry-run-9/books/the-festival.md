# Pilot Dry Run 9: the-festival

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The festival.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Festival
- Title evidence: Gutenberg Title line line 11 - Title: The festival
- Expected author: H. P. Lovecraft
- Author evidence: Gutenberg Author line line 13 - Author: H. P. Lovecraft
- Apparent work type: standalone book
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: The Festival
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: I was far from home
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: I was far from home, and the spell of the eastern sea was upon me. In the twilight I heard it pounding on the rocks, and I knew it lay just over the hill where the twisting willows writhed against the clearing sky and the first stars of evening. And because my fathers had called me to the old town beyond, I pushed o...
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

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Title: The festival
- Author: Author: H. P. Lovecraft
- Start: The Festival I was far from home, and the spell of the eastern sea was upon me. In the twilight I heard it pounding on the rocks, and I knew it lay just over the hill where the twisting willows writhed against the clearing sky and the first stars of evening. And because my fathers had called me to the old town beyond, I pushed o...
- End: ose wizards are all in ashes. For it is of old rumor that the soul of the devil-bought hastes not from his charnel clay, but fats and instructs _the very worm that gnaws_; till out of corruption horrid life springs, and the dull scavengers of earth wax crafty to vex it and swell monstrous to plague it. Great holes s...

## Heading Examples

- First readable prose: I was far from home
