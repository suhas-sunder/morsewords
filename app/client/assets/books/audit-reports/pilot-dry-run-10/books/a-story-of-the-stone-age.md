# Pilot Dry Run 10: a-story-of-the-stone-age

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/A Story of the Stone Age.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: A Story of the Stone Age
- Title evidence: Gutenberg Title line line 10 - Title: Tales of Space and Time
- Expected author: Herbert George Wells
- Author evidence: Gutenberg Author line line 12 - Author: Herbert George Wells
- Apparent work type: individual story
- Detected structural convention: story or titled-section headings
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: A STORY OF THE STONE AGE
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at cleaned-body line 7: A STORY OF THE STONE AGE
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use All-caps story or titled-section heading boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 6 planned story or titled-section headings sections unless a future write inspection demotes true front/back matter
- Likely section count: 6
- Expected preview start: I?UGH-LOMI AND UYA This story is of a time beyond the memory of man, before the beginning of history, a time when one might have walked dryshod from France (as we call it now) to England, and when a broad and sluggish Thames flowed through its marshes to meet its father Rhine, flowing through a wide and level countr...
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

- Title: Title: Tales of Space and Time
- Author: Author: Herbert George Wells
- Start: A STORY OF THE STONE AGE I?UGH-LOMI AND UYA This story is of a time beyond the memory of man, before the beginning of history, a time when one might have walked dryshod from France (as we call it now) to England, and when a broad and sluggish Thames flowed through its marshes to meet its father Rhine, flowing through a wide and level countr...
- End: ld not come, though Si struggled to come to Eudena. Afterwards, when Ugh-lomi had eaten, he sat dozing, and at last he slept, and slowly the others came out of the hiding-places and drew near. And when[162] Ugh-lomi woke, save that there were no men to be seen, it seemed as though he had never left the tribe. Now, t...

## Heading Examples

- L7: A STORY OF THE STONE AGE
- L8: I?UGH-LOMI AND UYA
- L136: II?THE CAVE BEAR
- L279: III?THE FIRST HORSEMAN
- L390: IV?UYA THE LION
- L509: V?THE FIGHT IN THE LION'S THICKET
