# Pilot Dry Run 9: the-black-star-passes

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Black Star Passes.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Black Star Passes
- Title evidence: Gutenberg Title line line 11 - Title: The Black Star Passes
- Expected author: Jr. John W. Campbell
- Author evidence: Gutenberg Author line line 13 - Author: Jr. John W. Campbell
- Apparent work type: standalone book
- Detected structural convention: standalone roman numeral sections with book divisions
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at cleaned-body line 493: I.
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Standalone Roman numeral boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 16 planned standalone roman numeral sections with book divisions sections unless a future write inspection demotes true front/back matter
- Likely section count: 16
- Expected preview start: On the thirty-ninth floor of a large New York apartment two young men were lounging about after a strenuous game of tennis. The blue tendrils of smoke from their pipes rose slowly, to be drawn away by the efficient ventilating system. The taller of the two seemed to be doing most of the talking. In the positions the...
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

- Title: Title: The Black Star Passes
- Author: Author: Jr. John W. Campbell
- Start: Chapter 1 On the thirty-ninth floor of a large New York apartment two young men were lounging about after a strenuous game of tennis. The blue tendrils of smoke from their pipes rose slowly, to be drawn away by the efficient ventilating system. The taller of the two seemed to be doing most of the talking. In the positions the...
- End: come into sight." Swiftly Arcot sprang forward and caught his arm. "Lord--don't do that, Wade--there's too much stuff here that we don't know anything about. Too much chance of your smashing us with him. I'm going to try to get around to the other side of this machine and see what I can do, while you fellows keep hi...

## Heading Examples

- L493: I.
- L786: II
- L1312: III
- L1784: IV
- L2537: II
- L2738: III
