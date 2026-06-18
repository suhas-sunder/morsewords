# Pilot Dry Run 10: murder-in-the-maze

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/Murder in the Maze.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Murder in the maze
- Title evidence: Gutenberg Title line line 11 - Title: Murder in the maze
- Expected author: J. J. Connington
- Author evidence: Gutenberg Author line line 13 - Author: J. J. Connington
- Apparent work type: standalone book
- Detected structural convention: chapter-based roman numerals with verified Chapter I override
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: CHAPTER I: The Hackleton Case
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at CHAPTER I: The Hackleton Case: Neville Shandon stood at the window
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use the 18 contents-listed chapters beginning with CHAPTER I; exclude contents and Gutenberg wrapper; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 18 planned chapter-based roman numerals with verified Chapter I override sections unless a future write inspection demotes true front/back matter
- Likely section count: 18
- Expected preview start: Neville Shandon stood at the window of his brother?s study gazing contentedly out over the Whistlefield grounds. This was a good place to recuperate in, he reflected, especially when one could only snatch a couple of days at a time from the grinding pressure of a barrister?s practice. His eye travelled slowly over t...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- contents or list material must not enter default playback
- Project Gutenberg/source/license material must be removed

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

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Title: Murder in the maze
- Author: Author: J. J. Connington
- Start: CHAPTER I: The Hackleton Case Neville Shandon stood at the window of his brother?s study gazing contentedly out over the Whistlefield grounds. This was a good place to recuperate in, he reflected, especially when one could only snatch a couple of days at a time from the grinding pressure of a barrister?s practice. His eye travelled slowly over t...
- End: Almost appalled by the vividness of the portrait which his mind had conjured up, Wendover stared across the grass at the wall of greenery which concealed from his gaze the actual form of the murderer. Then, as he gazed, there came once more the report of the automatic pistol?a single shot. And once more the waiting...

## Heading Examples

- CHAPTER I. The Hackleton Case
- CHAPTER II. The Affair in the Maze
