# Pilot Dry Run 8: the-silver-key

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The silver key.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The silver key
- Title evidence: Gutenberg Title line line 11 - Title: The silver key
- Expected author: H. P. Lovecraft
- Author evidence: Gutenberg Author line line 13 - Author: H. P. Lovecraft
- Apparent work type: story collection
- Detected structural convention: story or titled-section headings; dry-run treats non-body wrapper headings as cleanup artifacts
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The SILVER KEY
- Expected start boundary: start at cleaned-body line 1: The SILVER KEY
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding title/byline/source-site/transcriber/footer wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned story or titled-section headings; dry-run treats non-body wrapper headings as cleanup artifacts sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: When Randolph Carter was thirty he lost the key to the gate of dreams. Prior to that time he had made up for the prosiness of life by nightly excursions to strange and ancient cities beyond space, and lovely, unbelievable garden lands across ethereal seas; but as middle age hardened upon him he felt these liberties...
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default
- illustration captions/placeholders must be removed from default playback

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback
- first default section is meaningful but should be verified manually in write pass

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- ensure the generated title stays the collection title and individual story titles become sections

## Illustration/Page/Footnote Risks

- illustration captions/placeholders detected

## Supporting Snippets

- Title: Title: The silver key
- Author: Author: H. P. Lovecraft
- Start: The SILVER KEY When Randolph Carter was thirty he lost the key to the gate of dreams. Prior to that time he had made up for the prosiness of life by nightly excursions to strange and ancient cities beyond space, and lovely, unbelievable garden lands across ethereal seas; but as middle age hardened upon him he felt these liberties...
- End: d to haunt. It is rumored in Ulthar, beyond the River Skai, that a new king reigns on the opal throne of Ilek-Vad, that fabulous town of turrets atop the hollow cliffs of glass overlooking the twilight sea wherein the bearded and finny Gnorri build their singular labyrinths, and I believe I know how to interpret thi...

## Heading Examples

- L1: The SILVER KEY
