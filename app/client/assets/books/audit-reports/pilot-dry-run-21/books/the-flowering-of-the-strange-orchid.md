# Pilot Dry Run 21: the-flowering-of-the-strange-orchid

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE FLOWERING OF THE STRANGE ORCHID.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Flowering of the Strange Orchid
- Title evidence: source body heading line 65 - THE FLOWERING OF THE STRANGE ORCHID
- Expected author: H. G. Wells
- Author evidence: Gutenberg Author line line 13 - Author: H. G. Wells
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: Gutenberg Author line line 13: Author: H. G. Wells
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Flowering of the Strange Orchid
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: The buying of orchids always has in it a certain speculative flavour.
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: The buying of orchids always has in it a certain speculative flavour. You have before you the brown shrivelled lump of tissue, and for the rest you must trust your judgment, or the auctioneer, or your good-luck, as your taste may incline. The plant may be moribund or dead, or it may be just a respectable purchase, f...
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

- Title: THE FLOWERING OF THE STRANGE ORCHID
- Author: Author: H. G. Wells
- Metadata: Author: H. G. Wells
- Start: The Flowering of the Strange Orchid The buying of orchids always has in it a certain speculative flavour. You have before you the brown shrivelled lump of tissue, and for the rest you must trust your judgment, or the auctioneer, or your good-luck, as your taste may incline. The plant may be moribund or dead, or it may be just a respectable purchase, f...
- End: ..., and hesitated. The next morning the strange orchid still lay there, black now and putrescent. The door banged intermittently in the morning breeze, and all the array of Wedderburn's orchids was shrivelled and prostrate. But Wedderburn himself was bright and garrulous upstairs in the glory of his strange adventure.

## Heading Examples

- Source tale heading: THE FLOWERING OF THE STRANGE ORCHID
- First readable prose: The buying of orchids always has in it a certain speculative flavour.
