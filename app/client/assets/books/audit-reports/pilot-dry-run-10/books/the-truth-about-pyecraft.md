# Pilot Dry Run 10: the-truth-about-pyecraft

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE TRUTH ABOUT PYECRAFT.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Truth About Pyecraft
- Title evidence: Gutenberg Title line line 10 - Title: Twelve Stories and a Dream
- Expected author: H. G. Wells
- Author evidence: Gutenberg Author line line 12 - Author: H. G. Wells
- Apparent work type: individual story
- Detected structural convention: isolated titled sections
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: “From Pattison?”
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at cleaned-body line 49: “From Pattison?”
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Isolated title-case heading boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 5 planned isolated titled sections sections unless a future write inspection demotes true front/back matter
- Likely section count: 5
- Expected preview start: ?Indirectly,? he said, which I believe was lying, ?yes.? ?Pattison,? I said, ?took that stuff at his own risk.? He pursed his mouth and bowed. ?My great-grandmother's recipes,? I said, ?are queer things to handle. My father was near making me promise?? ?He didn't?? ?No. But he warned me. He himself used one?once.? ?...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback
- first default section is meaningful but should be verified manually in write pass

## Segmentation Risks

- structure audit recommends processing with warnings; write pass must verify boundaries directly from raw source

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Title: Twelve Stories and a Dream
- Author: Author: H. G. Wells
- Start: “From Pattison?” ?Indirectly,? he said, which I believe was lying, ?yes.? ?Pattison,? I said, ?took that stuff at his own risk.? He pursed his mouth and bowed. ?My great-grandmother's recipes,? I said, ?are queer things to handle. My father was near making me promise?? ?He didn't?? ?No. But he warned me. He himself used one?once.? ?...
- End: e will waylay me. He will come billowing up to me.... He will tell me over again all about it, how it feels, how it doesn't feel, how he sometimes hopes it is passing off a little. And always somewhere in that fat, abundant discourse he will say, ?The secret's keeping, eh? If any one knew of it?I should be so ashame...

## Heading Examples

- L49: ?From Pattison??
- L127: ?For Heaven's sake come.?Pyecraft.?
- L211: ?How??
- L237: ?Yes??
- L241: ?My dear Pyecraft!?
