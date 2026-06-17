# Pilot Dry Run 4: the-book-of-dragons

- Title: The Book of Dragons
- Author: E. Nesbit
- Source file: `app/client/assets/temp-books/the-book-of-dragons.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: public
- Generated output exists: yes
- Preview asset exists: yes
- Cloudflare JSON path: `app/client/assets/books/cloudflare-export/books/the-book-of-dragons.json`
- Detected structural convention: roman-numbered titled sections
- Current generated section count: 9
- Proposed section count if correction is needed: 8
- First default section currently: part-002 (part, 5657 words) Part 2
- Expected first readable section: II. Uncle James, or The Purple Stranger The Princess and the gardener's boy were playing in the backyard. "What will you do when you grow up, Princess?" asked the gardener's boy.
- Current status: needs correction before acceptance
- Recommendation for next pass: controlled rewrite/correction

## Verdicts

- Start boundary: review: first default is readable, but it does not tightly match pass-2 start snippet
- End boundary: review: last readable section does not tightly match pass-2 end snippet
- Sectioning: needs correction: source headings are clearer than the current generated split
- Cleanup: needs correction: suspicious source/catalog material remains outside defaults
- Preview: valid book-specific startup preview
- All-main-readable default: acceptable: all detected main readable sections are included in current default playback

## Warnings

- first default section does not tightly align with pass-2 candidate start
- last readable section does not tightly align with pass-2 candidate end
- suspicious non-default sections remain: part-001
- Existing generated output needs boundary/default-section correction later.
- Many illustration/image placeholders need cleanup review.

## Hard Fail Reasons

- part-001 appears to mix opening readable content with front/source material and is skipped by default
- clear structure exists in the source but current output is coarse fallback-style sections

## Supporting Snippets

- Raw start: ns too. Then the Rocking Horse begged to be allowed to go and live on the Hippogriff's page of the book. "I should like," he said, "to live somewhere where Dragons can't get at me." So the beautiful, white-winged Hippogriff showed him the way in, and there ...
- Raw end: ch sounded like tremendous laughter in the echo of the cave. "Dear me," said the dragon. "I _thought_ the town stuck in my throat rather. I must take it out, and look through it more carefully." And with that she coughed--and choked--and there was the town,...
- Generated first default: As for the Princess Mary Ann, she was a very good little girl, and everyone loved her. She was always kind and polite, even to her Uncle James and to other people whom she did not like very much; and though she was not very clever, for a Princess, she alway...
- Generated last readable: on who believed him was his granny. But then she was very old and very kind, and had always said he was the best of boys. Only one good thing came of all this long story. Edmund has never been quite the same boy since. He does not argue quite so much, and h...
- Preview start: As for the Princess Mary Ann, she was a very good little girl, and everyone loved her. She was always kind and polite, even to her Uncle James and to other people whom she did not like very much; and though she was not very clever, for a Princess, she alway...

## Current Section List

| Section | Kind | Label | includeByDefault | Current default | Words | Characters | Listen min | Type | Warnings |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | --- | --- |
| part-001 | part | Part 1 | no | no | 5265 | 29447 | 168 | suspicious | source/license/catalog/transcriber material appears in this section; image/illustration placeholder appears in a readable section |
| part-002 | part | Part 2 | no | yes | 5657 | 29994 | 180 | body content | none |
| part-003 | part | Part 3 | no | yes | 5599 | 29937 | 179 | body content | none |
| part-004 | part | Part 4 | no | yes | 5578 | 29960 | 179 | body content | none |
| part-005 | part | Part 5 | no | yes | 5715 | 29619 | 177 | body content | none |
| part-006 | part | Part 6 | no | yes | 5610 | 29678 | 178 | body content | none |
| part-007 | part | Part 7 | no | yes | 5611 | 29847 | 178 | body content | none |
| part-008 | part | Part 8 | no | yes | 3558 | 18921 | 113 | body content | none |
| part-009 | part | Part 9 | no | no | 0 | 33 | 1 | optional | decorative/page-marker lines appear near the section start |
