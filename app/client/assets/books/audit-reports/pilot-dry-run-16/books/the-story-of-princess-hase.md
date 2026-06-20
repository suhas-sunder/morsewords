# Pilot Dry Run 16: the-story-of-princess-hase

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE STORY OF PRINCESS HASE.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Story of Princess Hase
- Title evidence: source body heading line 49 - THE STORY OF PRINCESS HASE
- Expected author: Yei Theodora Ozaki
- Author evidence: Gutenberg Author line line 13 - Author: Yei Theodora Ozaki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Story of Princess Hase
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Many, many years ago there lived in Nara, the ancient Capital of Japan,
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Many, many years ago there lived in Nara, the ancient Capital of Japan, a wise State minister, by name Prince Toyonari Fujiwara. His wife was a noble, good, and beautiful woman called Princess Murasaki (Violet). They had been married by their respective families according to Japanese custom when very young, and had...
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
- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- illustration captions/placeholders detected

## Supporting Snippets

- Title: THE STORY OF PRINCESS HASE
- Author: Author: Yei Theodora Ozaki
- Start: The Story of Princess Hase Many, many years ago there lived in Nara, the ancient Capital of Japan, a wise State minister, by name Prince Toyonari Fujiwara. His wife was a noble, good, and beautiful woman called Princess Murasaki (Violet). They had been married by their respective families according to Japanese custom when very young, and had...
- End: ...from active life. To this day there is preserved a piece of needle-work in one of the Buddhist temples of Kioto. It is a beautiful piece of tapestry, with the figure of Buddha embroidered in the silky threads drawn from the stem of the lotus. This is said to have been the work of the hands of the good Princess Hase.

## Heading Examples

- Source tale heading: THE STORY OF PRINCESS HASE
- First readable prose: Many, many years ago there lived in Nara, the ancient Capital of Japan,
