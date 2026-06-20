# Pilot Dry Run 17: the-wolf-and-the-seven-little-kids

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE WOLF AND THE SEVEN LITTLE KIDS.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Wolf and the Seven Little Kids
- Title evidence: source body heading line 43 - THE WOLF AND THE SEVEN LITTLE KIDS
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Expected author/compiler/collector/translator/reteller role: authors: Jacob Grimm and Wilhelm Grimm (raw source labels them as authors)
- Metadata evidence: Gutenberg Author line line 13: Author: Jacob Grimm; Wilhelm Grimm; visible collection byline line 35: By Jacob Grimm and Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Wolf and the Seven Little Kids
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: There was once upon a time an old goat who had seven little kids, and
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: There was once upon a time an old goat who had seven little kids, and loved them with all the love of a mother for her children. One day she wanted to go into the forest and fetch some food. So she called all seven to her and said: ‘Dear children, I have to go into the forest, be on your guard against the wolf; if h...
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

- Title: THE WOLF AND THE SEVEN LITTLE KIDS
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Metadata: Author: Jacob Grimm; Wilhelm Grimm; By Jacob Grimm and Wilhelm Grimm
- Start: The Wolf and the Seven Little Kids There was once upon a time an old goat who had seven little kids, and loved them with all the love of a mother for her children. One day she wanted to go into the forest and fetch some food. So she called all seven to her and said: ‘Dear children, I have to go into the forest, be on your guard against the wolf; if h...
- End: ...like big stones.’ And when he got to the well and stooped over the water to drink, the heavy stones made him fall in, and he drowned miserably. When the seven kids saw that, they came running to the spot and cried aloud: ‘The wolf is dead! The wolf is dead!’ and danced for joy round about the well with their mother.

## Heading Examples

- Source tale heading: THE WOLF AND THE SEVEN LITTLE KIDS
- First readable prose: There was once upon a time an old goat who had seven little kids, and
