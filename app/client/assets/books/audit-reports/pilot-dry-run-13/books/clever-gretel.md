# Pilot Dry Run 13: clever-gretel

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/CLEVER GRETEL.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Clever Gretel
- Title evidence: source body heading line 43 - CLEVER GRETEL
- Expected author: Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line line 13 - Author: Jacob Grimm; Wilhelm Grimm
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Clever Gretel
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: There was once a cook named Gretel, who wore shoes with red heels, and
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: There was once a cook named Gretel, who wore shoes with red heels, and when she walked out with them on, she turned herself this way and that, was quite happy and thought: ?You certainly are a pretty girl!? And when she came home she drank, in her gladness of heart, a draught of wine, and as wine excites a desire to...
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

- Title: CLEVER GRETEL
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: Clever Gretel There was once a cook named Gretel, who wore shoes with red heels, and when she walked out with them on, she turned herself this way and that, was quite happy and thought: ?You certainly are a pretty girl!? And when she came home she drank, in her gladness of heart, a draught of wine, and as wine excites a desire to...
- End: trick!? said her master, and lamented the fine chickens. ?If he had but left me one, so that something remained for me to eat.? He called to him to stop, but the guest pretended not to hear. Then he ran after him with the knife still in his hand, crying: ?Just one, just one,? meaning that the guest should leave him...

## Heading Examples

- First readable prose: There was once a cook named Gretel, who wore shoes with red heels, and
