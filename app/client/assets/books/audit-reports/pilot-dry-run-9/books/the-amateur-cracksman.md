# Pilot Dry Run 9: the-amateur-cracksman

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Amateur Cracksman.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Amateur Cracksman
- Title evidence: Gutenberg Title line line 11 - Title: The Amateur Cracksman
- Expected author: E. W. Hornung
- Author evidence: Gutenberg Author line line 13 - Author: E. W. Hornung
- Apparent work type: story collection
- Detected structural convention: story or titled-section headings after contents
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: THE IDES OF MARCH
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at THE IDES OF MARCH: It was half-past twelve
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use the 8 contents-listed Raffles story headings beginning with THE IDES OF MARCH; exclude title page, dedication, and contents; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 8 planned story or titled-section headings after contents sections unless a future write inspection demotes true front/back matter
- Likely section count: 8
- Expected preview start: It was half-past twelve when I returned to the Albany as a last desperate resort. The scene of my disaster was much as I had left it. The baccarat-counters still strewed the table, with the empty glasses and the loaded ash-trays. A window had been opened to let the smoke out, and was letting in the fog instead. Raff...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- contents or list material must not enter default playback
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

- ensure the generated title stays the collection title and individual story titles become sections

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Title: The Amateur Cracksman
- Author: Author: E. W. Hornung
- Start: THE IDES OF MARCH It was half-past twelve when I returned to the Albany as a last desperate resort. The scene of my disaster was much as I had left it. The baccarat-counters still strewed the table, with the empty glasses and the loaded ash-trays. A window had been opened to let the smoke out, and was letting in the fog instead. Raff...
- End: ad brought, and laid it gently over his mouth. Two or three stertorous breaths, and the man was a log. I removed the handkerchief; I extracted the keys from his pocket. In less than five minutes I put them back, after winding the picture about my body beneath my Inverness cape. I took some whiskey and soda-water bef...

## Heading Examples

- THE IDES OF MARCH
- A COSTUME PIECE
- GENTLEMEN AND PLAYERS
- LE PREMIER PAS
- WILFUL MURDER
- NINE POINTS OF THE LAW
