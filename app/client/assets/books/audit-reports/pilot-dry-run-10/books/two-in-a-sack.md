# Pilot Dry Run 10: two-in-a-sack

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/TWO IN A SACK.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Two in a Sack
- Title evidence: Gutenberg Title line line 11 - Title: The Violet Fairy Book
- Expected author: Andrew Lang
- Author evidence: Gutenberg Author line line 13 - Author: Andrew Lang
- Apparent work type: individual story
- Detected structural convention: single fairy-tale story after parent collection wrapper
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: TWO IN A SACK
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at TWO IN A SACK: What a life that poor man led with his wife
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous fairy-tale story beginning at TWO IN A SACK; exclude parent Violet Fairy Book title/byline/source wrapper; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single fairy-tale story after parent collection wrapper sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: What a life that poor man led with his wife, to be sure! Not a day passed without her scolding him and calling him names, and indeed sometimes she would take the broom from behind the stove and beat him with it. He had no peace or comfort at all, and really hardly knew how to bear it. One day, when his wife had been...
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

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Title: The Violet Fairy Book
- Author: Author: Andrew Lang
- Start: TWO IN A SACK What a life that poor man led with his wife, to be sure! Not a day passed without her scolding him and calling him names, and indeed sometimes she would take the broom from behind the stove and beat him with it. He had no peace or comfort at all, and really hardly knew how to bear it. One day, when his wife had been...
- End: ?Blows will hurt, remember, crone, We mean you well, we mean you well; In future leave the stick alone, For how it hurts, you now can tell, One--two--? At last her husband took pity on her, and cried: ?Two into the sack.? He had hardly said the words before they were back in the sack again. From this time the man an...

## Heading Examples

- TWO IN A SACK
