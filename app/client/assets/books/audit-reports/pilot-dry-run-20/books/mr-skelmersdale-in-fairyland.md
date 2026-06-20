# Pilot Dry Run 20: mr-skelmersdale-in-fairyland

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/MR. SKELMERSDALE IN FAIRYLAND.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Mr. Skelmersdale in Fairyland
- Title evidence: source body heading line 34 - MR. SKELMERSDALE IN FAIRYLAND
- Expected author: H. G. Wells
- Author evidence: Gutenberg Author line line 12 - Author: H. G. Wells
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: Gutenberg Author line line 12: Author: H. G. Wells
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Mr. Skelmersdale in Fairyland
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: “There's a man in that shop,” said the Doctor
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: “There's a man in that shop,” said the Doctor, “who has been in Fairyland.” “Nonsense!” I said, and stared back at the shop. It was the usual village shop, post-office, telegraph wire on its brow, zinc pans and brushes outside, boots, shirtings, and potted meats in the window. “Tell me about it,” I said, after a pau...
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

- structure audit recommends processing with warnings; write pass must verify boundaries directly from raw source
- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: MR. SKELMERSDALE IN FAIRYLAND
- Author: Author: H. G. Wells
- Metadata: Author: H. G. Wells
- Start: Mr. Skelmersdale in Fairyland “There's a man in that shop,” said the Doctor, “who has been in Fairyland.” “Nonsense!” I said, and stared back at the shop. It was the usual village shop, post-office, telegraph wire on its brow, zinc pans and brushes outside, boots, shirtings, and potted meats in the window. “Tell me about it,” I said, after a pau...
- End: ...suddenly. “Well,” he said, “I must be going.” There was something in his eyes and manner that was too difficult for him to express in words. “One gets talking,” he said at last at the door, and smiled wanly, and so vanished from my eyes. And that is the tale of Mr. Skelmersdale in Fairyland just as he told it to me.

## Heading Examples

- Source tale heading: MR. SKELMERSDALE IN FAIRYLAND
- First readable prose: “There's a man in that shop,” said the Doctor
