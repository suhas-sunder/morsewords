# Pilot Dry Run 21: a-moth-genus-novo

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/A MOTH--GENUS NOVO.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: A Moth--Genus Novo
- Title evidence: source body heading line 64 - A MOTH--GENUS NOVO
- Expected author: H. G. Wells
- Author evidence: Gutenberg Author line line 13 - Author: H. G. Wells
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: Gutenberg Author line line 13: Author: H. G. Wells
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: A Moth--Genus Novo
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Probably you have heard of Hapley--not W.T. Hapley, the son
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Probably you have heard of Hapley--not W.T. Hapley, the son, but the celebrated Hapley, the Hapley of _Periplaneta Hapliia_, Hapley the entomologist. If so you know at least of the great feud between Hapley and Professor Pawkins. Though certain of its consequences may be new to you. For those who have not, a word or...
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

- Title: A MOTH--GENUS NOVO
- Author: Author: H. G. Wells
- Metadata: Author: H. G. Wells
- Start: A Moth--Genus Novo Probably you have heard of Hapley--not W.T. Hapley, the son, but the celebrated Hapley, the Hapley of _Periplaneta Hapliia_, Hapley the entomologist. If so you know at least of the great feud between Hapley and Professor Pawkins. Though certain of its consequences may be new to you. For those who have not, a word or...
- End: ...now Hapley is spending the remainder of his days in a padded room, worried by a moth that no one else can see. The asylum doctor calls it hallucination; but Hapley, when he is in his easier mood, and can talk, says it is the ghost of Pawkins, and consequently a unique specimen and well worth the trouble of catching.

## Heading Examples

- Source tale heading: A MOTH--GENUS NOVO
- First readable prose: Probably you have heard of Hapley--not W.T. Hapley, the son
