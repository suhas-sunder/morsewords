# Pilot Dry Run 8: from-beyond

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/From Beyond.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: From Beyond
- Title evidence: source filename / structure audit - From Beyond
- Expected author: H. P. Lovecraft
- Author evidence: visible byline line 5 - By H. P. Lovecraft
- Apparent work type: standalone book
- Detected structural convention: isolated titled sections; dry-run treats non-body wrapper headings as cleanup artifacts
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: From Beyond
- Expected start boundary: start at cleaned-body line 3: From Beyond
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding title/byline/source-site/transcriber/footer wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned isolated titled sections; dry-run treats non-body wrapper headings as cleanup artifacts sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Horrible beyond conception was the change which had taken place in my best friend, Crawford Tillinghast. I had not seen him since that day, two months and a half before, when he had told me toward what goal his physical and metaphysical researches were leading; when he had answered my awed and almost frightened remo...
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback
- first default section is meaningful but should be verified manually in write pass

## Author Metadata Risks

- author did not come from a Gutenberg Author line; verify byline directly

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: From Beyond
- Author: By H. P. Lovecraft
- Start: From Beyond Horrible beyond conception was the change which had taken place in my best friend, Crawford Tillinghast. I had not seen him since that day, two months and a half before, when he had told me toward what goal his physical and metaphysical researches were leading; when he had answered my awed and almost frightened remo...
- End: air and the sky about and above me. I never feel alone or comfortable, and a hideous sense of pursuit sometimes comes chillingly on me when I am weary. What prevents me from believing the doctor is this one simple fact?that the police never found the bodies of those servants whom they say Crawford Tillinghast murder...

## Heading Examples

- L3: From Beyond
