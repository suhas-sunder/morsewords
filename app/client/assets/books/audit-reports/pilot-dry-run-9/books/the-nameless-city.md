# Pilot Dry Run 9: the-nameless-city

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Nameless City.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Nameless City
- Title evidence: Gutenberg Title line line 16 - Title: The Nameless City
- Expected author: Howard Phillips Lovecraft (1890-1937)
- Author evidence: Gutenberg Author line line 18 - Author: Howard Phillips Lovecraft (1890-1937)
- Apparent work type: standalone book
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: The Nameless City
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: When I drew nigh the nameless city
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: When I drew nigh the nameless city I knew it was accursed. I was traveling in a parched and terrible valley under the moon, and afar I saw it protruding uncannily above the sands as parts of a corpse might protrude from an ill-made grave. Fear spoke from the age-worn stones of this hoary survivor of the deluge, this...
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

- Title: Title: The Nameless City
- Author: Author: Howard Phillips Lovecraft (1890-1937)
- Start: The Nameless City When I drew nigh the nameless city I knew it was accursed. I was traveling in a parched and terrible valley under the moon, and afar I saw it protruding uncannily above the sands as parts of a corpse might protrude from an ill-made grave. Fear spoke from the age-worn stones of this hoary survivor of the deluge, this...
- End: idor--a nightmare horde of rushing devils; hate-distorted, grotesquely panoplied, half-transparent devils of a race no man might mistake--the crawling reptiles of the nameless city. And as the wind died away I was plunged into the ghoul-peopled darkness of earth's bowels; for behind the last of the creatures the gre...

## Heading Examples

- First readable prose: When I drew nigh the nameless city
