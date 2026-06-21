# Pilot Dry Run 21: the-stolen-bacillus

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE STOLEN BACILLUS.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Stolen Bacillus
- Title evidence: source body heading line 65 - THE STOLEN BACILLUS
- Expected author: H. G. Wells
- Author evidence: Gutenberg Author line line 13 - Author: H. G. Wells
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: Gutenberg Author line line 13: Author: H. G. Wells
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Stolen Bacillus
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: "This again," said the Bacteriologist, slipping a glass slide under
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: "This again," said the Bacteriologist, slipping a glass slide under the microscope, "is a preparation of the celebrated Bacillus of cholera--the cholera germ." The pale-faced man peered down the microscope. He was evidently not accustomed to that kind of thing, and held a limp white hand over his disengaged eye. "I...
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

- Title: THE STOLEN BACILLUS
- Author: Author: H. G. Wells
- Metadata: Author: H. G. Wells
- Start: The Stolen Bacillus "This again," said the Bacteriologist, slipping a glass slide under the microscope, "is a preparation of the celebrated Bacillus of cholera--the cholera germ." The pale-faced man peered down the microscope. He was evidently not accustomed to that kind of thing, and held a limp white hand over his disengaged eye. "I...
- End: ...es--in patches, and the sparrow--bright blue. But the bother is, I shall have all the trouble and expense of preparing some more. "Put on my coat on this hot day! Why? Because we might meet Mrs Jabber. My dear, Mrs Jabber is not a draught. But why should I wear a coat on a hot day because of Mrs--. Oh! _very_ well."

## Heading Examples

- Source tale heading: THE STOLEN BACILLUS
- First readable prose: "This again," said the Bacteriologist, slipping a glass slide under
