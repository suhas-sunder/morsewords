# Pilot Dry Run 11: the-naughty-boy

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Naughty Boy.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Naughty Boy
- Title evidence: source body heading line 44 - THE NAUGHTY BOY
- Expected author: H. C. Andersen
- Author evidence: Gutenberg Author line line 13 - Author: H. C. Andersen
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Naughty Boy
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Along time ago, there lived an old poet
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Along time ago, there lived an old poet, a thoroughly kind old poet. As he was sitting one evening in his room, a dreadful storm arose without, and the rain streamed down from heaven; but the old poet sat warm and comfortable in his chimney-corner, where the fire blazed and the roasting apple hissed. ?Those who have...
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

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: THE NAUGHTY BOY
- Author: Author: H. C. Andersen
- Start: The Naughty Boy Along time ago, there lived an old poet, a thoroughly kind old poet. As he was sitting one evening in his room, a dreadful storm arose without, and the rain streamed down from heaven; but the old poet sat warm and comfortable in his chimney-corner, where the fire blazed and the roasting apple hissed. ?Those who have...
- End: the palace and upon the ramparts: yes, once he even shot your father and mother right in the heart. Ask them only and you will hear what they'll tell you. Oh, he is a naughty boy, that Cupid; you must never have anything to do with him. He is forever running after everybody. Only think, he shot an arrow once at your...

## Heading Examples

- First readable prose: Along time ago, there lived an old poet
