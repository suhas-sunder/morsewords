# Pilot Dry Run 10: astounding-stories-of-super-science

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/Astounding Stories of Super-Science.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Astounding Stories of Super-Science, October, 1930
- Title evidence: Gutenberg Title line line 11 - Title: Astounding Stories of Super-Science, October, 1930
- Expected author: Various
- Author evidence: Gutenberg Author line line 13 - Author: Various
- Apparent work type: story collection
- Detected structural convention: chapter-based roman numerals
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at cleaned-body line 1412: CHAPTER I
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Chapter plus Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 20 planned chapter-based roman numerals sections unless a future write inspection demotes true front/back matter
- Likely section count: 20
- Expected preview start: _Out of the Hangman's Hands_ "You speak," said Von Kettler, jeering, "as if you really believed that you had the power of life and death over me." The Superintendent of the penitentiary frowned, yet there was something of perplexity in the look he gave the prisoner. "Von Kettler, I think it is time that you dropped...
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

- later ordinal headings are present; verify Chapter/Part/Book 1 remains included and selected first

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- ensure the generated title stays the collection title and individual story titles become sections

## Illustration/Page/Footnote Risks

- illustration captions/placeholders detected

## Supporting Snippets

- Title: Title: Astounding Stories of Super-Science, October, 1930
- Author: Author: Various
- Start: Chapter 1 _Out of the Hangman's Hands_ "You speak," said Von Kettler, jeering, "as if you really believed that you had the power of life and death over me." The Superintendent of the penitentiary frowned, yet there was something of perplexity in the look he gave the prisoner. "Von Kettler, I think it is time that you dropped...
- End: t stores the large magazines have the more advantageous positions. 2. The edges of your pages are uneven. You look in the index and find an interesting story is on, for example, page 56. You skim the pages to find it, and from page 43 you find yourself suddenly at page 79. Make the paper more even, please. 3. Don't...

## Heading Examples

- L1412: CHAPTER I
- L1695: CHAPTER II
- L2018: CHAPTER III
- L2293: CHAPTER IV
- L2626: CHAPTER V
- L2922: CHAPTER VI
