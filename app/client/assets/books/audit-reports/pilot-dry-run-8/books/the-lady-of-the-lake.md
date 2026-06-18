# Pilot Dry Run 8: the-lady-of-the-lake

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Lady of the Lake.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Lady of the Lake
- Title evidence: Gutenberg Title line line 11 - Title: The Lady of the Lake
- Expected author: Walter Scott
- Author evidence: Gutenberg Author line line 13 - Author: Walter Scott
- Apparent work type: poem/anthology
- Detected structural convention: canto-based verse sections
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Canto 1
- Expected start boundary: start at cleaned-body line 98: CANTO FIRST.
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Canto heading boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 10 planned canto-based verse sections sections unless a future write inspection demotes true front/back matter
- Likely section count: 10
- Expected preview start: The Chase. Harp of the North! that mouldering long hast hung On the witch-elm that shades Saint Fillan's spring And down the fitful breeze thy numbers flung, Till envious ivy did around thee cling, Muffling with verdant ringlet every string,-- O Minstrel Harp, still must thine accents sleep? Mid rustling leaves and...
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default
- footnotes or page markers may need cleanup before default playback

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback
- first default section is meaningful but should be verified manually in write pass

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- footnotes or page markers detected

## Supporting Snippets

- Title: Title: The Lady of the Lake
- Author: Author: Walter Scott
- Start: CANTO FIRST. The Chase. Harp of the North! that mouldering long hast hung On the witch-elm that shades Saint Fillan's spring And down the fitful breeze thy numbers flung, Till envious ivy did around thee cling, Muffling with verdant ringlet every string,-- O Minstrel Harp, still must thine accents sleep? Mid rustling leaves and...
- End: residing at Stirling, in Buchanan of Arnpryor's time, carriers were very frequently passing along the common road, being near Arnpryor's house, with necessaries for the use of the King's family; and he, having some extraordinary occasion, ordered one of these carriers to leave his load at his house, and he would pay...

## Heading Examples

- L98: CANTO FIRST.
- L2950: CANTO FOURTH.
- L3931: CANTO FIFTH.
- L4966: CANTO SIXTH.
- L7366: Canto Second.
- L8461: Canto Third.
