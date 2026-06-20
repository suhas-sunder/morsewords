# Pilot Dry Run 17: the-leaping-match

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE LEAPING MATCH.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Leaping Match
- Title evidence: source body heading line 136 - THE LEAPING MATCH
- Expected author: H. C. Andersen
- Author evidence: Gutenberg Author line line 13 - Author: H. C. Andersen
- Expected author/compiler/collector/translator/reteller role: author: H. C. Andersen; editor: J. H. Stickney
- Metadata evidence: Gutenberg Author line line 13: Author: H. C. Andersen; Gutenberg Editor line line 15: Editor: J. H. Stickney
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: The Leaping Match
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: THE Flea, the Grasshopper, and the Frog once wanted to see which of them
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: THE Flea, the Grasshopper, and the Frog once wanted to see which of them could jump the highest. They made a festival, and invited the whole world and every one else besides who liked to come and see the grand sight. Three famous jumpers they were, as all should say, when they met together in the room. "I will give...
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

- J. H. Stickney is source-backed as editor and must not replace H. C. Andersen in the author field

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- illustration captions/placeholders detected

## Supporting Snippets

- Title: THE LEAPING MATCH
- Author: Author: H. C. Andersen
- Metadata: Author: H. C. Andersen; Editor: J. H. Stickney
- Start: The Leaping Match THE Flea, the Grasshopper, and the Frog once wanted to see which of them could jump the highest. They made a festival, and invited the whole world and every one else besides who liked to come and see the grand sight. Three famous jumpers they were, as all should say, when they met together in the room. "I will give...
- End: ...said, "Yes, dullness and heaviness win the day; a fine exterior is what people care for nowadays." And then he began to sing in his own peculiar way--and it is from his song that we have taken this little piece of history, which may very possibly be all untrue, although it does stand printed here in black and white.

## Heading Examples

- Source tale heading: THE LEAPING MATCH
- First readable prose: THE Flea, the Grasshopper, and the Frog once wanted to see which of them
