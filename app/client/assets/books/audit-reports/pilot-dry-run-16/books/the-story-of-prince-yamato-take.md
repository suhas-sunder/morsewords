# Pilot Dry Run 16: the-story-of-prince-yamato-take

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE STORY OF PRINCE YAMATO TAKE.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Story of Prince Yamato Take
- Title evidence: source body heading line 49 - THE STORY OF PRINCE YAMATO TAKE
- Expected author: Yei Theodora Ozaki
- Author evidence: Gutenberg Author line line 13 - Author: Yei Theodora Ozaki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Story of Prince Yamato Take
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: The insignia of the great Japanese Empire is composed of three
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: The insignia of the great Japanese Empire is composed of three treasures which have been considered sacred, and guarded with jealous care from time immemorial. These are the Yatano-no-Kagami or the Mirror of Yata, the Yasakami-no-Magatama or the Jewel of Yasakami, and the Murakumo-no-Tsurugi or the Sword of Murakumo...
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

- Title: THE STORY OF PRINCE YAMATO TAKE
- Author: Author: Yei Theodora Ozaki
- Start: The Story of Prince Yamato Take The insignia of the great Japanese Empire is composed of three treasures which have been considered sacred, and guarded with jealous care from time immemorial. These are the Yatano-no-Kagami or the Mirror of Yata, the Yasakami-no-Magatama or the Jewel of Yasakami, and the Murakumo-no-Tsurugi or the Sword of Murakumo...
- End: ...reserved through all—and she praised his courage and his warrior’s prowess, and then putting on her most magnificent robes she returned thanks to their ancestress the Sun Goddess Amaterasu, to whose protection they both ascribed the Prince’s wonderful preservation. Here ends the story of Prince Yamato Take of Japan.

## Heading Examples

- Source tale heading: THE STORY OF PRINCE YAMATO TAKE
- First readable prose: The insignia of the great Japanese Empire is composed of three
