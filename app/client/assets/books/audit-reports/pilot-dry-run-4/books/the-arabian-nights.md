# Pilot Dry Run 4: the-arabian-nights

- Title: The Arabian Nights: Their Best-known Tales
- Author: unknown
- Source file: `app/client/assets/temp-books/the-arabian-nights.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: public
- Generated output exists: yes
- Preview asset exists: yes
- Cloudflare JSON path: `app/client/assets/books/cloudflare-export/books/the-arabian-nights.json`
- Detected structural convention: story or titled-section headings
- Current generated section count: 23
- Proposed section count if correction is needed: 34
- First default section currently: part-002 (part, 5419 words) Part 2
- Expected first readable section: PREFACE _Little excuse is needed, perhaps, for any fresh selection from the famous "Tales of a Thousand and One Nights," provided it be representative enough, and worthy enough, to enlist a new army of youthful readers. Of the two hundred and sixty-four bew...
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
- long book has huge sections despite detected headings
- TOC/body confusion is likely
- Existing generated output needs boundary/default-section correction later.

## Hard Fail Reasons

- part-001 appears to mix opening readable content with front/source material and is skipped by default
- clear structure exists in the source but current output is coarse fallback-style sections

## Supporting Snippets

- Raw start: t, 1909, by CHARLES SCRIBNER'S SONS Published October, 1909 PREFACE _Little excuse is needed, perhaps, for any fresh selection from the famous "Tales of a Thousand and One Nights," provided it be representative enough, and worthy enough, to enlist a new arm...
- Raw end: tuff, a hundred of white cloth, the finest of Cairo, Suez, and Alexandria; a vessel of agate broader than deep, an inch thick, and half a foot wide, the bottom of which represented in bas-relief a man with one knee on the ground, who held a bow and an arrow...
- Generated first default: One day when the two princes were hunting, and the princess had remained at home, a religious old woman came to the gate, and desired leave to go in to say her prayers, it being then the hour. The servants asked the princess's permission, who ordered them t...
- Generated last readable: f with the thoughts of the profit I get by them. You not only deserve a quiet life, but are worthy of all the riches you enjoy, because you make of them such a good and generous use. May you therefore continue to live in happiness till the day of your death...
- Preview start: One day when the two princes were hunting, and the princess had remained at home, a religious old woman came to the gate, and desired leave to go in to say her prayers, it being then the hour. The servants asked the princess's permission, who ordered them t...

## Current Section List

| Section | Kind | Label | includeByDefault | Current default | Words | Characters | Listen min | Type | Warnings |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | --- | --- |
| part-001 | part | Part 1 | no | no | 5072 | 29705 | 170 | suspicious | source/license/catalog/transcriber material appears in this section |
| part-002 | part | Part 2 | no | yes | 5419 | 29442 | 176 | body content | none |
| part-003 | part | Part 3 | no | yes | 5425 | 29700 | 177 | body content | none |
| part-004 | part | Part 4 | no | yes | 5387 | 29334 | 175 | body content | none |
| part-005 | part | Part 5 | no | yes | 5391 | 29482 | 176 | body content | none |
| part-006 | part | Part 6 | no | yes | 5283 | 27648 | 164 | body content | none |
| part-007 | part | Part 7 | no | yes | 5534 | 29784 | 178 | body content | none |
| part-008 | part | Part 8 | no | yes | 5633 | 29996 | 179 | body content | none |
| part-009 | part | Part 9 | no | yes | 5241 | 29285 | 175 | body content | none |
| part-010 | part | Part 10 | no | yes | 5303 | 29773 | 178 | body content | none |
| part-011 | part | Part 11 | no | yes | 5353 | 29416 | 175 | body content | none |
| part-012 | part | Part 12 | no | yes | 5411 | 29469 | 176 | body content | none |
| part-013 | part | Part 13 | no | yes | 5501 | 29402 | 175 | body content | none |
| part-014 | part | Part 14 | no | yes | 5459 | 29630 | 176 | body content | none |
| part-015 | part | Part 15 | no | yes | 5541 | 29877 | 178 | body content | none |
| part-016 | part | Part 16 | no | yes | 5533 | 29937 | 179 | body content | none |
| part-017 | part | Part 17 | no | yes | 5401 | 29649 | 177 | body content | none |
| part-018 | part | Part 18 | no | yes | 5334 | 29646 | 177 | body content | none |
| part-019 | part | Part 19 | no | yes | 5373 | 29154 | 174 | body content | none |
| part-020 | part | Part 20 | no | yes | 5567 | 29721 | 176 | body content | none |
| part-021 | part | Part 21 | no | yes | 5550 | 29649 | 176 | body content | none |
| part-022 | part | Part 22 | no | yes | 994 | 5206 | 32 | body content | none |
| part-023 | part | Part 23 | no | yes | 203 | 1103 | 7 | body content | none |
