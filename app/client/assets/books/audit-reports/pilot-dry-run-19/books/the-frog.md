# Pilot Dry Run 19: the-frog

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE FROG.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Frog
- Title evidence: source body heading line 52 - THE FROG
- Expected author: Andrew Lang
- Author evidence: Gutenberg Author line line 13 - Author: Andrew Lang
- Expected author/compiler/collector/translator/reteller role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Metadata evidence: Gutenberg Author line line 13: Author: Andrew Lang; visible editor byline line 42: Edited By Andrew Lang
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Frog
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Once upon a time there was a woman who had three sons. Though they
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Once upon a time there was a woman who had three sons. Though they were peasants they were well off, for the soil on which they lived was fruitful, and yielded rich crops. One day they all three told their mother they meant to get married. To which their mother replied: ‘Do as you like, but see that you choose good...
- Duplicate/near-duplicate slug check: Distinct work confirmed from source: THE FROG opens with a woman and her three sons, unlike the accepted The Frog-Prince; the individual title and body evidence justify a separate slug.
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

- Title: THE FROG
- Author: Author: Andrew Lang
- Metadata: Author: Andrew Lang; Edited By Andrew Lang
- Start: The Frog Once upon a time there was a woman who had three sons. Though they were peasants they were well off, for the soil on which they lived was fruitful, and yielded rich crops. One day they all three told their mother they meant to get married. To which their mother replied: ‘Do as you like, but see that you choose good...
- End: ...g done this, the witches disappeared, and the youth with his lovely bride drove to his mother’s home. Great was the delight of the mother at her youngest son’s good fortune. A beautiful house was built for them; she was the favourite daughter-in-law; everything went well with them, and they lived happily ever after.

## Heading Examples

- Source tale heading: THE FROG
- First readable prose: Once upon a time there was a woman who had three sons. Though they
