# Pilot Dry Run 10: the-benson-murder-case

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Benson Murder Case.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Benson murder case
- Title evidence: Gutenberg Title line line 11 - Title: The Benson murder case
- Expected author: S. S. Van Dine
- Author evidence: Gutenberg Author line line 13 - Author: S. S. Van Dine
- Apparent work type: standalone book
- Detected structural convention: chapter-based roman numerals with verified Chapter I override
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: CHAPTER I: Philo Vance at Home
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at CHAPTER I: Philo Vance at Home: It happened that, on the morning
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use the 25 contents-listed chapters beginning with CHAPTER I; exclude contents, illustrator/source metadata, and Gutenberg wrapper; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 25 planned chapter-based roman numerals with verified Chapter I override sections unless a future write inspection demotes true front/back matter
- Likely section count: 25
- Expected preview start: It happened that, on the morning of the momentous June the fourteenth when the discovery of the murdered body of Alvin H. Benson created a sensation which, to this day, has not entirely died away, I had breakfasted with Philo Vance in his apartment. It was not unusual for me to share Vance?s luncheons and dinners, b...
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

- Title: Title: The Benson murder case
- Author: Author: S. S. Van Dine
- Start: CHAPTER I: Philo Vance at Home It happened that, on the morning of the momentous June the fourteenth when the discovery of the murdered body of Alvin H. Benson created a sensation which, to this day, has not entirely died away, I had breakfasted with Philo Vance in his apartment. It was not unusual for me to share Vance?s luncheons and dinners, b...
- End: n lives without passions or emotions or enthusiasms, there?s bound to be an outlet some time. Some men explode, and some commit suicide,?the principle is the same: it?s a matter of psychological reaction. The Major isn?t the self-destructive type,?that?s why I say he?ll blow up.? Heath snorted. ?We may be short on p...

## Heading Examples

- CHAPTER I. Philo Vance at Home
- CHAPTER II. At the Scene of the Crime
