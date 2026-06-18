# Pilot Dry Run 10: the-house-of-arden-a-story-for-children

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The House of Arden - A Story for Children.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The House of Arden: A Story for Children
- Title evidence: Gutenberg Title line line 11 - Title: The House of Arden: A Story for Children
- Expected author: E. Nesbit
- Author evidence: Gutenberg Author line line 13 - Author: E. Nesbit
- Apparent work type: standalone book
- Detected structural convention: chapter-based roman numerals with verified Chapter I override
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: CHAPTER I: ARDEN'S LORD
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at CHAPTER I: ARDEN'S LORD: It had been a great house once
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use the 14 chapter headings beginning with CHAPTER I; exclude illustrated title/contents material and Gutenberg wrapper; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 14 planned chapter-based roman numerals with verified Chapter I override sections unless a future write inspection demotes true front/back matter
- Likely section count: 14
- Expected preview start: It had been a great house once, with farms and fields, money and jewels--with tenants and squires and men-at-arms. The head of the house had ridden out three days' journey to meet King Henry at the boundary of his estate, and the King had ridden back with him to lie in the tall State bed in the castle guest-chamber....
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- contents or list material must not enter default playback
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default
- illustration captions/placeholders must be removed from default playback

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback

## Segmentation Risks

- structure audit recommends processing with warnings; write pass must verify boundaries directly from raw source
- later ordinal headings are present; verify Chapter/Part/Book 1 remains included and selected first
- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- illustration captions/placeholders detected

## Supporting Snippets

- Title: Title: The House of Arden: A Story for Children
- Author: Author: E. Nesbit
- Start: CHAPTER I: ARDEN'S LORD It had been a great house once, with farms and fields, money and jewels--with tenants and squires and men-at-arms. The head of the house had ridden out three days' journey to meet King Henry at the boundary of his estate, and the King had ridden back with him to lie in the tall State bed in the castle guest-chamber....
- End: s one of these moments that are as short as a watch-tick, and as long as a year. She stood there and asked herself, "Have I dreamed it all? Isn't there really any Mouldiwarp or any treasure?" And then a great wave of love and longing caught at her, and she knew that, Mouldiwarp or no Mouldiwarp, the treasure was her...

## Heading Examples

- CHAPTER I: ARDEN'S LORD
- CHAPTER II: THE MOULDIWARP
