# Pilot Dry Run 4: alices-adventures-in-wonderland

- Title: Alice's Adventures in Wonderland
- Author: Lewis Carroll
- Source file: `app/client/assets/temp-books/alices-adventures-in-wonderland.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: public
- Generated output exists: yes
- Preview asset exists: yes
- Cloudflare JSON path: `app/client/assets/books/cloudflare-export/books/alices-adventures-in-wonderland.json`
- Detected structural convention: chapter-based roman numerals
- Current generated section count: 14
- Proposed section count if correction is needed: none
- First default section currently: chapter-001 (chapter, 2177 words) Chapter 1
- Expected first readable section: CHAPTER I. Down the Rabbit-Hole Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into
- Current status: already acceptable
- Recommendation for next pass: accept as already valid

## Verdicts

- Start boundary: correct: first default aligns with pass-2 readable start
- End boundary: review: last readable section does not tightly match pass-2 end snippet
- Sectioning: acceptable: current section sizes and split look plausible
- Cleanup: acceptable: no cleanup artifacts detected in readable/default sections
- Preview: valid book-specific startup preview
- All-main-readable default: acceptable: all detected main readable sections are included in current default playback

## Warnings

- last readable section does not tightly align with pass-2 candidate end
- TOC/body confusion is likely
- Table of contents appears isolated before readable content.
- Illustration/image placeholders should be cleaned or suppressed later.
- Decorative/page markers are cleanup candidates but not boundary blockers.

## Hard Fail Reasons

- None.

## Supporting Snippets

- Raw start: le the Tarts? CHAPTER XII. Alice?s Evidence CHAPTER I. Down the Rabbit-Hole Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it ha...
- Raw end: air, and came flying down upon her: she gave a little scream, half of fright and half of anger, and tried to beat them off, and found herself lying on the bank, with her head in the lap of her sister, who was gently brushing away some dead leaves that had f...
- Generated first default: CHAPTER I. Down the Rabbit-Hole Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, ?and w...
- Generated last readable: e little sister of hers would, in the after-time, be herself a grown woman; and how she would keep, through all her riper years, the simple and loving heart of her childhood: and how she would gather about her other little children, and make _their_ eyes br...
- Preview start: CHAPTER I. Down the Rabbit-Hole Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, ?and w...

## Current Section List

| Section | Kind | Label | includeByDefault | Current default | Words | Characters | Listen min | Type | Warnings |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | --- | --- |
| title-page-001 | title-page | Opening section | no | no | 15 | 103 | 1 | front matter | section is very short |
| title-page-002 | title-page | Contents | no | no | 74 | 472 | 3 | front matter | section is very short |
| chapter-001 | chapter | Chapter 1 | yes | yes | 2177 | 11551 | 68 | body content | none |
| chapter-002 | chapter | Chapter 2 | yes | yes | 2181 | 10953 | 66 | body content | none |
| chapter-003 | chapter | Chapter 3 | yes | yes | 1733 | 9261 | 56 | body content | none |
| chapter-004 | chapter | Chapter 4 | yes | yes | 2728 | 13884 | 84 | body content | none |
| chapter-005 | chapter | Chapter 5 | yes | yes | 2242 | 12011 | 72 | body content | none |
| chapter-006 | chapter | Chapter 6 | yes | yes | 2657 | 13844 | 83 | body content | none |
| chapter-007 | chapter | Chapter 7 | yes | yes | 2369 | 12703 | 77 | body content | none |
| chapter-008 | chapter | Chapter 8 | yes | yes | 2552 | 13670 | 82 | body content | none |
| chapter-009 | chapter | Chapter 9 | yes | yes | 2358 | 12631 | 77 | body content | none |
| chapter-010 | chapter | Chapter 10 | yes | yes | 2100 | 11411 | 70 | body content | none |
| chapter-011 | chapter | Chapter 11 | yes | yes | 1932 | 10387 | 63 | body content | none |
| chapter-012 | chapter | Chapter 12 | yes | yes | 2177 | 11654 | 70 | body content | none |
