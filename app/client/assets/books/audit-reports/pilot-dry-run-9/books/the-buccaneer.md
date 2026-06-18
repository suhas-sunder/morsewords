# Pilot Dry Run 9: the-buccaneer

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Buccaneer.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Buccaneer: A Tale
- Title evidence: Gutenberg Title line line 11 - Title: The Buccaneer: A Tale
- Expected author: Mrs. S. C. Hall
- Author evidence: Gutenberg Author line line 13 - Author: Mrs. S. C. Hall
- Apparent work type: standalone book
- Detected structural convention: chapter-based roman numerals
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at cleaned-body line 114: CHAPTER I.
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Chapter plus Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 43 planned chapter-based roman numerals sections unless a future write inspection demotes true front/back matter
- Likely section count: 43
- Expected preview start: With roomy decks, her guns of mighty strength, Whose low-laid mouths each mounting billow laves, Deep in her draught, and warlike in her length, She seems a sea wasp flying on the waves. DRYDEN. It was between the hours of ten and twelve on a fine night of February, in the year sixteen hundred and fifty-six, that th...
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

- Title: Title: The Buccaneer: A Tale
- Author: Author: Mrs. S. C. Hall
- Start: Chapter 1 With roomy decks, her guns of mighty strength, Whose low-laid mouths each mounting billow laves, Deep in her draught, and warlike in her length, She seems a sea wasp flying on the waves. DRYDEN. It was between the hours of ten and twelve on a fine night of February, in the year sixteen hundred and fifty-six, that th...
- End: urn me into a fable, wife!" exclaimed Robin, playfully interrupting her:--"I am, in my own proper person, an AEsop as it is. There has been enough of all this for to-night: we will but pledge another cup to the health of Sir Walter, the Lady Constance, and their children--and then to bed; and may all sleep well whos...

## Heading Examples

- L114: CHAPTER I.
- L722: CHAPTER II.
- L1066: CHAPTER III.
- L2039: CHAPTER V.
- L2463: CHAPTER VI.
- L2888: CHAPTER VII.
