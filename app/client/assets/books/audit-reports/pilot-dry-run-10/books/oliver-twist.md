# Pilot Dry Run 10: oliver-twist

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/Oliver Twist.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Oliver Twist
- Title evidence: Gutenberg Title line line 11 - Title: Oliver Twist
- Expected author: Charles Dickens
- Author evidence: Gutenberg Author line line 13 - Author: Charles Dickens
- Apparent work type: standalone book
- Detected structural convention: chapter-based roman numerals with verified Chapter I override
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: CHAPTER I: TREATS OF THE PLACE WHERE OLIVER TWIST WAS BORN
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at CHAPTER I: TREATS OF THE PLACE WHERE OLIVER TWIST WAS BORN: Among other public buildings in a certain town
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use the 53 numbered chapters beginning with CHAPTER I; exclude title page and Gutenberg wrapper; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 53 planned chapter-based roman numerals with verified Chapter I override sections unless a future write inspection demotes true front/back matter
- Likely section count: 53
- Expected preview start: Among other public buildings in a certain town, which for many reasons it will be prudent to refrain from mentioning, and to which I will assign no fictitious name, there is one anciently common to most towns, great or small: to wit, a workhouse; and in this workhouse was born; on a day and date which I need not tro...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- contents or list material must not enter default playback
- Project Gutenberg/source/license material must be removed

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback

## Segmentation Risks

- structure audit recommends processing with warnings; write pass must verify boundaries directly from raw source
- later ordinal headings are present; verify Chapter/Part/Book 1 remains included and selected first
- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Title: Oliver Twist
- Author: Author: Charles Dickens
- Start: CHAPTER I: TREATS OF THE PLACE WHERE OLIVER TWIST WAS BORN Among other public buildings in a certain town, which for many reasons it will be prudent to refrain from mentioning, and to which I will assign no fictitious name, there is one anciently common to most towns, great or small: to wit, a workhouse; and in this workhouse was born; on a day and date which I need not tro...
- End: a stone bench opposite the door, which served for seat and bedstead; and casting his blood-shot eyes upon the ground, tried to collect his thoughts. After awhile, he began to remember a few disjointed fragments of what the judge had said: though it had seemed to him, at the time, that he could not hear a word. These...

## Heading Examples

- CHAPTER I. TREATS OF THE PLACE WHERE OLIVER TWIST WAS BORN
- CHAPTER II. TREATS OF OLIVER TWIST'S GROWTH
- CHAPTER III. RELATES HOW OLIVER TWIST WAS VERY NEAR GETTING A PLACE
