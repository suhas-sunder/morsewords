# Pilot Dry Run 14: the-three-languages

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE THREE LANGUAGES.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Three Languages
- Title evidence: source body heading line 43 - THE THREE LANGUAGES
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Three Languages
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: An aged count once lived in Switzerland, who had an only son, but he
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: An aged count once lived in Switzerland, who had an only son, but he was stupid, and could learn nothing. Then said the father: ?Hark you, my son, try as I will I can get nothing into your head. You must go from hence, I will give you into the care of a celebrated master, who shall see what he can do with you.? The...
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

- Title: THE THREE LANGUAGES
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: The Three Languages An aged count once lived in Switzerland, who had an only son, but he was stupid, and could learn nothing. Then said the father: ?Hark you, my son, try as I will I can get nothing into your head. You must go from hence, I will give you into the care of a celebrated master, who shall see what he can do with you.? The...
- End: ...s. Then was he anointed and consecrated, and thus was fulfilled what he had heard from the frogs on his way, which had so affected him, that he was to be his Holiness the Pope. Then he had to sing a mass, and did not know one word of it, but the two doves sat continually on his shoulders, and said it all in his ear.

## Heading Examples

- Source tale heading: THE THREE LANGUAGES
- First readable prose: An aged count once lived in Switzerland, who had an only son, but he
