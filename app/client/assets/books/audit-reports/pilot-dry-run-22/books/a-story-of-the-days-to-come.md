# Pilot Dry Run 22: a-story-of-the-days-to-come

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/A Story of the Days to Come.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only Project Gutenberg source with reuse/source evidence present; no generated publish status exists yet
- Expected title: A Story of the Days to Come
- Title evidence: source body heading line 34 - A STORY OF THE DAYS TO COME
- Expected author: Herbert George Wells
- Author evidence: Gutenberg Author line line 12 - Author: Herbert George Wells
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: Gutenberg Author line line 12: Author: Herbert George Wells
- Apparent work type: standalone book
- Detected structural convention: five roman-numbered titled story parts
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: I—THE CURE FOR LOVE
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg or source-site footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at I—THE CURE FOR LOVE: The excellent Mr. Morris was an Englishman
- Expected end boundary: end before Project Gutenberg or source-site footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use the five source headings from I—THE CURE FOR LOVE through V—BINDON INTERVENES; reject isolated dialogue fragments selected by the generic detector; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 5 planned five roman-numbered titled story parts sections unless a future write inspection demotes true front/back matter
- Likely section count: 5
- Expected preview start: The excellent Mr. Morris was an Englishman, and he lived in the days of Queen Victoria the Good. He was a prosperous and very sensible man; he read the Times and went to church, and as he grew towards middle age an expression of quiet contented contempt for all who were not as himself settled on his face. He was one...
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

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: A STORY OF THE DAYS TO COME
- Author: Author: Herbert George Wells
- Metadata: Author: Herbert George Wells
- Start: I—THE CURE FOR LOVE The excellent Mr. Morris was an Englishman, and he lived in the days of Queen Victoria the Good. He was a prosperous and very sensible man; he read the Times and went to church, and as he grew towards middle age an expression of quiet contented contempt for all who were not as himself settled on his face. He was one...
- End: ...r. After a time she laid a gentle hand on his beside her. He fondled it softly, still looking out upon the spacious gold-woven[324] view. So they sat as the sun went down. Until presently Elizabeth shivered. Denton recalled himself abruptly from these spacious issues of his leisure, and went in to fetch her a shawl.

## Heading Examples

- I—THE CURE FOR LOVE
- II—THE VACANT COUNTRY
- III—THE WAYS OF THE CITY
- IV—UNDERNEATH
- V—BINDON INTERVENES
