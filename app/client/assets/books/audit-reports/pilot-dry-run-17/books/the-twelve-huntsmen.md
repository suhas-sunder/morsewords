# Pilot Dry Run 17: the-twelve-huntsmen

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE TWELVE HUNTSMEN.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Twelve Huntsmen
- Title evidence: source body heading line 43 - THE TWELVE HUNTSMEN
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Expected author/compiler/collector/translator/reteller role: authors: Jacob Grimm and Wilhelm Grimm (raw source labels them as authors)
- Metadata evidence: Gutenberg Author line line 13: Author: Jacob Grimm; Wilhelm Grimm; visible collection byline line 35: By Jacob Grimm and Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Twelve Huntsmen
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: There was once a king’s son who had a bride whom he loved very much.
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: There was once a king’s son who had a bride whom he loved very much. And when he was sitting beside her and very happy, news came that his father lay sick unto death, and desired to see him once again before his end. Then he said to his beloved: ‘I must now go and leave you, I give you a ring as a remembrance of me....
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

- Title: THE TWELVE HUNTSMEN
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Metadata: Author: Jacob Grimm; Wilhelm Grimm; By Jacob Grimm and Wilhelm Grimm
- Start: The Twelve Huntsmen There was once a king’s son who had a bride whom he loved very much. And when he was sitting beside her and very happy, news came that his father lay sick unto death, and desired to see him once again before his end. Then he said to his beloved: ‘I must now go and leave you, I give you a ring as a remembrance of me....
- End: ...ter that.’ He sent a messenger to the other bride, and entreated her to return to her own kingdom, for he had a wife already, and someone who had just found an old key did not require a new one. Thereupon the wedding was celebrated, and the lion was again taken into favour, because, after all, he had told the truth.

## Heading Examples

- Source tale heading: THE TWELVE HUNTSMEN
- First readable prose: There was once a king’s son who had a bride whom he loved very much.
