# Pilot Dry Run 9: the-brothers-karamazov

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Brothers Karamazov.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Brothers Karamazov
- Title evidence: Gutenberg Title line line 11 - Title: The Brothers Karamazov
- Expected author: Fyodor Dostoyevsky
- Author evidence: Gutenberg Author line line 13 - Author: Fyodor Dostoyevsky
- Apparent work type: standalone book
- Detected structural convention: chapter-based roman numerals with book divisions and part divisions
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at cleaned-body line 143: Chapter I.
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Chapter plus Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 84 planned chapter-based roman numerals with book divisions and part divisions sections unless a future write inspection demotes true front/back matter
- Likely section count: 84
- Expected preview start: Fyodor Pavlovitch Karamazov Alexey Fyodorovitch Karamazov was the third son of Fyodor Pavlovitch Karamazov, a land owner well known in our district in his own day, and still remembered among us owing to his gloomy and tragic death, which happened thirteen years ago, and which I shall describe in its proper place. Fo...
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

- later ordinal headings are present; verify Chapter/Part/Book 1 remains included and selected first
- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Title: The Brothers Karamazov
- Author: Author: Fyodor Dostoyevsky
- Start: Chapter 1 Fyodor Pavlovitch Karamazov Alexey Fyodorovitch Karamazov was the third son of Fyodor Pavlovitch Karamazov, a land owner well known in our district in his own day, and still remembered among us owing to his gloomy and tragic death, which happened thirteen years ago, and which I shall describe in its proper place. Fo...
- End: ned!? Alyosha answered, half laughing, half enthusiastic. ?Ah, how splendid it will be!? broke from Kolya. ?Well, now we will finish talking and go to his funeral dinner. Don?t be put out at our eating pancakes?it?s a very old custom and there?s something nice in that!? laughed Alyosha. ?Well, let us go! And now we...

## Heading Examples

- L143: Chapter I.
- L265: Chapter II.
- L380: Chapter III.
- L613: Chapter IV.
- L919: Chapter V.
- L1462: Chapter II.
