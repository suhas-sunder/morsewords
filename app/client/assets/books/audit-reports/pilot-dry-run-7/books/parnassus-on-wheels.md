# Pilot Dry Run 7: parnassus-on-wheels

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/Parnassus on Wheels.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Parnassus on Wheels
- Title evidence: Gutenberg Title line line 11 - Title: Parnassus on Wheels
- Expected author: Christopher Morley
- Author evidence: Gutenberg Author line line 13 - Author: Christopher Morley
- Apparent work type: standalone book
- Detected structural convention: chapter-based word ordinals
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: Chapter 1
- Expected start boundary: start at cleaned-body line 57: CHAPTER ONE
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Chapter plus word ordinal boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 6 detected chapter-based word ordinals sections unless a future write inspection demotes true front/back matter
- Likely section count: 6
- Expected preview start: I wonder if there isn't a lot of bunkum in higher education? I never
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback
- first default section is meaningful but should be verified manually in write pass

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Title: Parnassus on Wheels
- Author: Author: Christopher Morley
- Start: CHAPTER ONE I wonder if there isn't a lot of bunkum in higher education? I never
- End: tairs for breakfast. The long table was nearly empty, but one or two men sitting at the other end eyed me curiously. Through the window I could see my name in large, red letters, growing on the side of the van, as the Professor diligently wielded his brush. And when I had finished my coffee and beans and bacon I not...

## Heading Examples

- L57: CHAPTER ONE
- L236: CHAPTER TWO
- L463: CHAPTER THREE
- L664: CHAPTER FOUR
- L1041: CHAPTER FIVE
- L1403: CHAPTER SIX
