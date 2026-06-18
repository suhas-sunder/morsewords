# Pilot Dry Run 9: the-two-magics-the-turn-of-the-screw-covering-end

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Two Magics - The Turn of the Screw, Covering End.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Two Magics: The Turn of the Screw, Covering End
- Title evidence: Gutenberg Title line line 11 - Title: The Two Magics: The Turn of the Screw, Covering End
- Expected author: Henry James
- Author evidence: Gutenberg Author line line 13 - Author: Henry James
- Apparent work type: standalone book
- Detected structural convention: standalone roman numeral sections
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at cleaned-body line 351: I
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Standalone Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 31 planned standalone roman numeral sections sections unless a future write inspection demotes true front/back matter
- Likely section count: 31
- Expected preview start: I remember the whole beginning as a succession of flights and drops, a little see-saw of the right throbs and the wrong. After rising, in town, to meet his appeal, I had at all events a couple of very bad days--found myself doubtful again, felt indeed sure I had made a mistake. In this state of mind I spent the long...
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
- later ordinal headings are present; verify Chapter/Part/Book 1 remains included and selected first
- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Title: The Two Magics: The Turn of the Screw, Covering End
- Author: Author: Henry James
- Start: Chapter 1 I remember the whole beginning as a succession of flights and drops, a little see-saw of the right throbs and the wrong. After rising, in town, to meet his appeal, I had at all events a couple of very bad days--found myself doubtful again, felt indeed sure I had made a mistake. In this state of mind I spent the long...
- End: --her kind eyes seemed to drop it upon him,--was all she meant. ?To stay at your post--_that_ was the way I showed you.? He had come round to it now, as mechanically, in intenser thought, he smoothed down the thick hair he had rubbed up; but his face soon enough gave out, in wonder and pain, that his freedom was som...

## Heading Examples

- L351: I
- L510: II
- L697: III
- L894: IV
- L1071: V
- L1297: VI
