# Pilot Dry Run 16: my-lord-bag-of-rice

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/MY LORD BAG OF RICE.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: My Lord Bag of Rice
- Title evidence: source body heading line 49 - MY LORD BAG OF RICE
- Expected author: Yei Theodora Ozaki
- Author evidence: Gutenberg Author line line 13 - Author: Yei Theodora Ozaki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: My Lord Bag of Rice
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Long, long ago there lived, in Japan a brave warrior known to all as
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Long, long ago there lived, in Japan a brave warrior known to all as Tawara Toda, or ?My Lord Bag of Rice.? His true name was Fujiwara Hidesato, and there is a very interesting story of how he came to change his name. One day he sallied forth in search of adventures, for he had the nature of a warrior and could not...
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

- Title: MY LORD BAG OF RICE
- Author: Author: Yei Theodora Ozaki
- Start: My Lord Bag of Rice Long, long ago there lived, in Japan a brave warrior known to all as Tawara Toda, or ?My Lord Bag of Rice.? His true name was Fujiwara Hidesato, and there is a very interesting story of how he came to change his name. One day he sallied forth in search of adventures, for he had the nature of a warrior and could not...
- End: ...t into it, it cooked deliciously whatever was wanted without any firing—truly a very economical saucepan. The fame of Hidesato’s fortune spread far and wide, and as there was no need for him to spend money on rice or silk or firing, he became very rich and prosperous, and was henceforth known as My Lord Bag of Rice.

## Heading Examples

- Source tale heading: MY LORD BAG OF RICE
- First readable prose: Long, long ago there lived, in Japan a brave warrior known to all as
