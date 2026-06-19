# Pilot Dry Run 13: king-grisly-beard

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/KING GRISLY-BEARD.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: King Grisly-Beard
- Title evidence: source body heading line 43 - KING GRISLY-BEARD
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: King Grisly-Beard
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: A great king of a land far away in the East had a daughter who was very
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: A great king of a land far away in the East had a daughter who was very beautiful, but so proud, and haughty, and conceited, that none of the princes who came to ask her in marriage was good enough for her, and she only made sport of them. Once upon a time the king held a great feast, and asked thither all her suito...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed

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

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: KING GRISLY-BEARD
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: King Grisly-Beard A great king of a land far away in the East had a daughter who was very beautiful, but so proud, and haughty, and conceited, that none of the princes who came to ask her in marriage was good enough for her, and she only made sport of them. Once upon a time the king held a great feast, and asked thither all her suito...
- End: tall. I have done all this only to cure you of your silly pride, and to show you the folly of your ill-treatment of me. Now all is over: you have learnt wisdom, and it is time to hold our marriage feast.? Then the chamberlains came and brought her the most beautiful robes; and her father and his whole court were the...

## Heading Examples

- First readable prose: A great king of a land far away in the East had a daughter who was very
