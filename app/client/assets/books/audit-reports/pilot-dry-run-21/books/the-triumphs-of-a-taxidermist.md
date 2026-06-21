# Pilot Dry Run 21: the-triumphs-of-a-taxidermist

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE TRIUMPHS OF A TAXIDERMIST.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Triumphs of a Taxidermist
- Title evidence: source body heading line 65 - THE TRIUMPHS OF A TAXIDERMIST
- Expected author: H. G. Wells
- Author evidence: Gutenberg Author line line 13 - Author: H. G. Wells
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: Gutenberg Author line line 13: Author: H. G. Wells
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Triumphs of a Taxidermist
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Here are some of the secrets of taxidermy. They were told me by the
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Here are some of the secrets of taxidermy. They were told me by the taxidermist in a mood of elation. He told me them in the time between the first glass of whisky and the fourth, when a man is no longer cautious and yet not drunk. We sat in his den together; his library it was, his sitting and his eating-room--sepa...
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

- Title: THE TRIUMPHS OF A TAXIDERMIST
- Author: Author: H. G. Wells
- Metadata: Author: H. G. Wells
- Start: The Triumphs of a Taxidermist Here are some of the secrets of taxidermy. They were told me by the taxidermist in a mood of elation. He told me them in the time between the first glass of whisky and the fourth, when a man is no longer cautious and yet not drunk. We sat in his den together; his library it was, his sitting and his eating-room--sepa...
- End: ...st, but so far as great auks' eggs, and the bogus stuffed birds are concerned, I find that he has the confirmation of distinguished ornithological writers. And the note about the New Zealand bird certainly appeared in a morning paper of unblemished reputation, for the Taxidermist keeps a copy and has shown it to me.

## Heading Examples

- Source tale heading: THE TRIUMPHS OF A TAXIDERMIST
- First readable prose: Here are some of the secrets of taxidermy. They were told me by the
