# Pilot Dry Run 21: the-temptation-of-harringay

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE TEMPTATION OF HARRINGAY.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Temptation of Harringay
- Title evidence: source body heading line 65 - THE TEMPTATION OF HARRINGAY
- Expected author: H. G. Wells
- Author evidence: Gutenberg Author line line 13 - Author: H. G. Wells
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: Gutenberg Author line line 13: Author: H. G. Wells
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Temptation of Harringay
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: It is quite impossible to say whether this thing really happened.
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: It is quite impossible to say whether this thing really happened. It depends entirely on the word of R.M. Harringay, who is an artist. Following his version of the affair, the narrative deposes that Harringay went into his studio about ten o'clock to see what he could make of the head that he had been working at the...
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

- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: THE TEMPTATION OF HARRINGAY
- Author: Author: H. G. Wells
- Metadata: Author: H. G. Wells
- Start: The Temptation of Harringay It is quite impossible to say whether this thing really happened. It depends entirely on the word of R.M. Harringay, who is an artist. Following his version of the affair, the narrative deposes that Harringay went into his studio about ten o'clock to see what he could make of the head that he had been working at the...
- End: ...he had not photographed the Devil before he painted him out. This is Harringay's story--not mine. He supports it by a small canvas (24 by 20) enamelled a pale green, and by violent asseverations. It is also true that he never has produced a masterpiece, and in the opinion of his intimate friends probably never will.

## Heading Examples

- Source tale heading: THE TEMPTATION OF HARRINGAY
- First readable prose: It is quite impossible to say whether this thing really happened.
