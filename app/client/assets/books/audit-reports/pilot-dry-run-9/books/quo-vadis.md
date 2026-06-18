# Pilot Dry Run 9: quo-vadis

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/Quo Vadis.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Quo Vadis: A Narrative of the Time of Nero
- Title evidence: Gutenberg Title line line 11 - Title: Quo Vadis: A Narrative of the Time of Nero
- Expected author: Henryk Sienkiewicz
- Author evidence: Gutenberg Author line line 13 - Author: Henryk Sienkiewicz
- Apparent work type: standalone book
- Detected structural convention: chapter-based roman numerals
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at cleaned-body line 54: Chapter I
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Chapter plus Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 73 planned chapter-based roman numerals sections unless a future write inspection demotes true front/back matter
- Likely section count: 73
- Expected preview start: PETRONIUS woke only about midday, and as usual greatly wearied. The evening before he had been at one of Nero?s feasts, which was prolonged till late at night. For some time his health had been failing. He said himself that he woke up benumbed, as it were, and without power of collecting his thoughts. But the mornin...
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

- later ordinal headings are present; verify Chapter/Part/Book 1 remains included and selected first

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Title: Quo Vadis: A Narrative of the Time of Nero
- Author: Author: Henryk Sienkiewicz
- Start: Chapter 1 PETRONIUS woke only about midday, and as usual greatly wearied. The evening before he had been at one of Nero?s feasts, which was prolonged till late at night. For some time his health had been failing. He said himself that he woke up benumbed, as it were, and without power of collecting his thoughts. But the mornin...
- End: t that the hour of death was near. Terror and reproaches of conscience seized him. He declared that he saw darkness in front of him in the form of a black cloud. From that cloud came forth faces in which he saw his mother, his wife, and his brother. His teeth were chattering from fright; still his soul of a comedian...

## Heading Examples

- L54: Chapter I
- L571: Chapter II
- L1273: Chapter III
- L1372: Chapter IV
- L1644: Chapter V
- L1789: Chapter VI
