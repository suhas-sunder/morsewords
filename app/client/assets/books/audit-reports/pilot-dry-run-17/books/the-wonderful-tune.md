# Pilot Dry Run 17: the-wonderful-tune

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Wonderful Tune.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Wonderful Tune
- Title evidence: source body heading line 46 - The Wonderful Tune.
- Expected author: Andrew Lang
- Author evidence: Gutenberg Author line line 13 - Author: Andrew Lang
- Expected author/compiler/collector/translator/reteller role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Metadata evidence: Gutenberg Author line line 13: Author: Andrew Lang; visible editor byline line 32: Edited by Andrew Lang
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: The Wonderful Tune
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Maurice Connor was the king
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Maurice Connor was the king, and that’s no small word, of all the pipers in Munster. He could play jig and reel without end, and Ollistrum’s March, and the Eagle’s Whistle, and the Hen’s Concert, and odd tunes of every sort and kind. But he knew one far more surprising than the rest, which had in it the power to set...
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
- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: The Wonderful Tune.
- Author: Author: Andrew Lang
- Metadata: Author: Andrew Lang; Edited by Andrew Lang
- Start: The Wonderful Tune Maurice Connor was the king, and that’s no small word, of all the pipers in Munster. He could play jig and reel without end, and Ollistrum’s March, and the Eagle’s Whistle, and the Hen’s Concert, and odd tunes of every sort and kind. But he knew one far more surprising than the rest, which had in it the power to set...
- End: ..., the sound of music coming up from the water; and some, who have had good ears, could plainly distinguish Maurice Connor’s voice singing these words to his pipes-- Beautiful shore, with thy spreading strand, Thy crystal water, and diamond sand; Never would I have parted from thee, But for the sake of my fair ladie.

## Heading Examples

- Source tale heading: The Wonderful Tune.
- First readable prose: Maurice Connor was the king
