# Pilot Dry Run 5: the-snow-queen

- Title: Andersen's Fairy Tales
- Author: H. C. Andersen
- Source file: `app/client/assets/temp-books/THE SNOW QUEEN.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: public
- Generated output exists: yes
- Preview asset exists: yes
- Cloudflare JSON path: `app/client/assets/books/cloudflare-export/books/the-snow-queen.json`
- Detected structural convention: story or titled-section headings
- Current generated section count: 4
- Proposed section count if correction is needed: 18
- First default section currently: part-001 (part, 5513 words) Part 1
- Expected first readable section: PREFACE The Hans Andersen Fairy Tales will be read in schools and homes as long as there are children who love to read. As a story-teller for children the author has no rival in power to enlist the imagination and carry it
- Current status: needs correction before acceptance
- Recommendation for next pass: controlled rewrite/correction

## Verdicts

- Start boundary: review: first default is readable, but it does not tightly match pass-2 start snippet
- End boundary: review: last readable section does not tightly match pass-2 end snippet
- Sectioning: needs correction: source headings are clearer than the current generated split
- Cleanup: acceptable: no cleanup artifacts detected in readable/default sections
- Preview: valid book-specific startup preview
- All-main-readable default: acceptable: all detected main readable sections are included in current default playback

## Warnings

- first default section does not tightly align with pass-2 candidate start
- last readable section does not tightly align with pass-2 candidate end
- generated output likely collapsed real structure
- Start or end boundary still has low confidence after context inspection.

## Hard Fail Reasons

- clear structure exists in the source but current output is coarse fallback-style sections

## Supporting Snippets

- Raw start: GINN AND COMPANY ? PROPRIETORS ? BOSTON ? U.S.A. PREFACE The Hans Andersen Fairy Tales will be read in schools and homes as long as there are children who love to read. As a story-teller for children the author has no rival in power to enlist the imaginatio...
- Raw end: utiful flowers. Very soon they recognized the large town where they lived, and the tall steeples of the churches in which the sweet bells were ringing a merry peal, as they entered it and found their way to their grandmother's door. They went upstairs into ...
- Generated first default: ANDERSEN'S FAIRY TALES By Hans Christian Andersen THE SNOW QUEEN FIRST STORY. Which Treats of a Mirror and of the Splinters Now then, let us begin. When we are at the end of the story, we shall know more than we know now: but to begin. Once upon a time ther...
- Generated last readable: n's chairs, and Kay and Gerda sat down on them, holding each other by the hand; they both had forgotten the cold empty splendor of the Snow Queen, as though it had been a dream. The grandmother sat in the bright sunshine, and read aloud from the Bible: ?Unl...
- Preview start: ANDERSEN'S FAIRY TALES By Hans Christian Andersen THE SNOW QUEEN FIRST STORY. Which Treats of a Mirror and of the Splinters Now then, let us begin. When we are at the end of the story, we shall know more than we know now: but to begin. Once upon a time ther...

## Current Section List

| Section | Kind | Label | includeByDefault | Current default | Words | Characters | Listen min | Type | Warnings |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | --- | --- |
| part-001 | part | Part 1 | no | yes | 5513 | 29238 | 174 | body content | none |
| part-002 | part | Part 2 | no | yes | 5633 | 29931 | 179 | body content | none |
| part-003 | part | Part 3 | no | yes | 813 | 4454 | 27 | body content | none |
| part-004 | part | Part 4 | no | no | 22 | 140 | 1 | optional | section is very short |
