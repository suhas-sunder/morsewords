# Pilot Dry Run 4: pride-and-prejudice

- Title: Pride and Prejudice
- Author: Jane Austen
- Source file: `app/client/assets/temp-books/Pride and Prejudice.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: public
- Generated output exists: yes
- Preview asset exists: yes
- Cloudflare JSON path: `app/client/assets/books/cloudflare-export/books/pride-and-prejudice.json`
- Detected structural convention: chapter-based roman numerals
- Current generated section count: 62
- Proposed section count if correction is needed: 61
- First default section currently: chapter-001 (chapter, 889 words) Chapter 1 - ]
- Expected first readable section: PREFACE. [Illustration] _Walt Whitman has somewhere a fine and just distinction between ?loving
- Current status: needs correction before acceptance
- Recommendation for next pass: controlled rewrite/correction

## Verdicts

- Start boundary: review: first default is readable, but it does not tightly match pass-2 start snippet
- End boundary: review: last readable section does not tightly match pass-2 end snippet
- Sectioning: acceptable: current section sizes and split look plausible
- Cleanup: needs correction: cleanup material appears in readable/default sections
- Preview: valid book-specific startup preview
- All-main-readable default: acceptable: all detected main readable sections are included in current default playback

## Warnings

- first default section does not tightly align with pass-2 candidate start
- last readable section does not tightly align with pass-2 candidate end
- Real opening or ending content may be at risk around the audited boundary.
- Many illustration/image placeholders need cleanup review.

## Hard Fail Reasons

- source/TOC/license material leaks into readable/default sections: chapter-002, chapter-003, chapter-004, chapter-005, chapter-006, chapter-007, chapter-008, chapter-009, chapter-010, chapter-011, chapter-012, chapter-...

## Supporting Snippets

- Raw start: _Hugh Thomson_ ] PREFACE. [Illustration] _Walt Whitman has somewhere a fine and just distinction between ?loving by allowance? and ?loving with personal love.? This distinction applies to books as well as to men and women; and in the case of the not very nu...
- Raw end: return, it belongs to me to find occasions for teasing and quarrelling with you as often as may be; and I shall begin directly, by asking you what made you so unwilling to come to the point at last? What made you so shy of me, when you first called, and aft...
- Generated first default: Chapter I.] It is a truth universally acknowledged, that a single man in possession of a good fortune must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fix...
- Generated last readable: ers they were always on the most intimate terms. Darcy, as well as Elizabeth, really loved them; and they were both ever sensible of the warmest gratitude towards the persons who, by bringing her into Derbyshire, had been the means of uniting them. [Illustr...
- Preview start: Chapter I.] It is a truth universally acknowledged, that a single man in possession of a good fortune must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fix...

## Current Section List

| Section | Kind | Label | includeByDefault | Current default | Words | Characters | Listen min | Type | Warnings |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | --- | --- |
| title-page-001 | title-page | Opening section | no | no | 5002 | 34230 | 174 | front matter | decorative/page-marker lines appear near the section start |
| chapter-001 | chapter | Chapter 1 | yes | yes | 889 | 4756 | 29 | body content | none |
| chapter-002 | chapter | Chapter 2 | yes | yes | 817 | 4421 | 27 | body content | image/illustration placeholder appears in a readable section |
| chapter-003 | chapter | Chapter 3 | yes | yes | 1728 | 9771 | 59 | body content | image/illustration placeholder appears in a readable section |
| chapter-004 | chapter | Chapter 4 | yes | yes | 1074 | 6018 | 36 | body content | image/illustration placeholder appears in a readable section |
| chapter-005 | chapter | Chapter 5 | yes | yes | 981 | 5420 | 33 | body content | image/illustration placeholder appears in a readable section |
| chapter-006 | chapter | Chapter 6 | yes | yes | 2381 | 13225 | 79 | body content | image/illustration placeholder appears in a readable section |
| chapter-007 | chapter | Chapter 7 | yes | yes | 2024 | 11414 | 68 | body content | image/illustration placeholder appears in a readable section |
| chapter-008 | chapter | Chapter 8 | yes | yes | 1952 | 11137 | 67 | body content | image/illustration placeholder appears in a readable section |
| chapter-009 | chapter | Chapter 9 | yes | yes | 1746 | 9818 | 59 | body content | image/illustration placeholder appears in a readable section |
| chapter-010 | chapter | Chapter 10 | yes | yes | 2241 | 12701 | 76 | body content | image/illustration placeholder appears in a readable section |
| chapter-011 | chapter | Chapter 11 | yes | yes | 1613 | 8996 | 54 | body content | image/illustration placeholder appears in a readable section |
| chapter-012 | chapter | Chapter 12 | yes | yes | 684 | 3978 | 24 | body content | image/illustration placeholder appears in a readable section |
| chapter-013 | chapter | Chapter 13 | yes | yes | 1706 | 9529 | 56 | body content | image/illustration placeholder appears in a readable section |
| chapter-014 | chapter | Chapter 14 | yes | yes | 1137 | 6565 | 40 | body content | image/illustration placeholder appears in a readable section |
| chapter-015 | chapter | Chapter 15 | yes | yes | 1718 | 9839 | 59 | body content | image/illustration placeholder appears in a readable section |
| chapter-016 | chapter | Chapter 16 | yes | yes | 3413 | 19265 | 116 | body content | image/illustration placeholder appears in a readable section |
| chapter-017 | chapter | Chapter 17 | yes | yes | 1293 | 7327 | 44 | body content | image/illustration placeholder appears in a readable section |
| chapter-018 | chapter | Chapter 18 | yes | yes | 5236 | 29396 | 176 | body content | image/illustration placeholder appears in a readable section |
| chapter-019 | chapter | Chapter 19 | yes | yes | 1926 | 10719 | 65 | body content | image/illustration placeholder appears in a readable section |
| chapter-020 | chapter | Chapter 20 | yes | yes | 1660 | 9293 | 56 | body content | image/illustration placeholder appears in a readable section |
| chapter-021 | chapter | Chapter 21 | yes | yes | 2027 | 11420 | 68 | body content | image/illustration placeholder appears in a readable section |
| chapter-022 | chapter | Chapter 22 | yes | yes | 1771 | 10231 | 62 | body content | image/illustration placeholder appears in a readable section |
| chapter-023 | chapter | Chapter 23 | yes | yes | 1634 | 9435 | 57 | body content | image/illustration placeholder appears in a readable section |
| chapter-024 | chapter | Chapter 24 | yes | yes | 1956 | 10882 | 65 | body content | image/illustration placeholder appears in a readable section |
| chapter-025 | chapter | Chapter 25 | yes | yes | 1552 | 8783 | 53 | body content | image/illustration placeholder appears in a readable section |
| chapter-026 | chapter | Chapter 26 | yes | yes | 2353 | 13050 | 77 | body content | image/illustration placeholder appears in a readable section |
| chapter-027 | chapter | Chapter 27 | yes | yes | 1273 | 7297 | 44 | body content | image/illustration placeholder appears in a readable section |
| chapter-028 | chapter | Chapter 28 | yes | yes | 1487 | 8479 | 51 | body content | image/illustration placeholder appears in a readable section |
| chapter-029 | chapter | Chapter 29 | yes | yes | 2413 | 13737 | 82 | body content | image/illustration placeholder appears in a readable section |
| chapter-030 | chapter | Chapter 30 | yes | yes | 1257 | 7271 | 44 | body content | image/illustration placeholder appears in a readable section |
| chapter-031 | chapter | Chapter 31 | yes | yes | 1576 | 8799 | 53 | body content | image/illustration placeholder appears in a readable section |
| chapter-032 | chapter | Chapter 32 | yes | yes | 1522 | 8620 | 52 | body content | image/illustration placeholder appears in a readable section |
| chapter-033 | chapter | Chapter 33 | yes | yes | 1877 | 10439 | 63 | body content | image/illustration placeholder appears in a readable section |
| chapter-034 | chapter | Chapter 34 | yes | yes | 2118 | 12090 | 73 | body content | image/illustration placeholder appears in a readable section |
| chapter-035 | chapter | Chapter 35 | yes | yes | 3024 | 17031 | 102 | body content | image/illustration placeholder appears in a readable section |
| chapter-036 | chapter | Chapter 36 | yes | yes | 2041 | 11963 | 72 | body content | image/illustration placeholder appears in a readable section |
| chapter-037 | chapter | Chapter 37 | yes | yes | 1394 | 7935 | 48 | body content | image/illustration placeholder appears in a readable section |
| chapter-038 | chapter | Chapter 38 | yes | yes | 1060 | 6105 | 37 | body content | image/illustration placeholder appears in a readable section |
| chapter-039 | chapter | Chapter 39 | yes | yes | 1650 | 8844 | 53 | body content | image/illustration placeholder appears in a readable section |
| chapter-040 | chapter | Chapter 40 | yes | yes | 1716 | 9403 | 57 | body content | image/illustration placeholder appears in a readable section |
| chapter-041 | chapter | Chapter 41 | yes | yes | 2307 | 13177 | 79 | body content | image/illustration placeholder appears in a readable section |
| chapter-042 | chapter | Chapter 42 | yes | yes | 1846 | 10722 | 64 | body content | image/illustration placeholder appears in a readable section |
| chapter-043 | chapter | Chapter 43 | yes | yes | 4888 | 27572 | 165 | body content | image/illustration placeholder appears in a readable section |
| chapter-044 | chapter | Chapter 44 | yes | yes | 2363 | 13549 | 81 | body content | image/illustration placeholder appears in a readable section |
| chapter-045 | chapter | Chapter 45 | yes | yes | 1750 | 10151 | 61 | body content | image/illustration placeholder appears in a readable section |
| chapter-046 | chapter | Chapter 46 | yes | yes | 3053 | 17100 | 102 | body content | image/illustration placeholder appears in a readable section |
| chapter-047 | chapter | Chapter 47 | yes | yes | 4108 | 22518 | 134 | body content | image/illustration placeholder appears in a readable section |
| chapter-048 | chapter | Chapter 48 | yes | yes | 2282 | 12888 | 76 | body content | image/illustration placeholder appears in a readable section |
| chapter-049 | chapter | Chapter 49 | yes | yes | 2284 | 12656 | 75 | body content | image/illustration placeholder appears in a readable section |
| chapter-050 | chapter | Chapter 50 | yes | yes | 2229 | 12603 | 76 | body content | image/illustration placeholder appears in a readable section |
| chapter-051 | chapter | Chapter 51 | yes | yes | 2094 | 11324 | 68 | body content | image/illustration placeholder appears in a readable section |
| chapter-052 | chapter | Chapter 52 | yes | yes | 3049 | 17394 | 100 | body content | image/illustration placeholder appears in a readable section |
| chapter-053 | chapter | Chapter 53 | yes | yes | 2973 | 16195 | 97 | body content | image/illustration placeholder appears in a readable section |
| chapter-054 | chapter | Chapter 54 | yes | yes | 1624 | 8995 | 54 | body content | image/illustration placeholder appears in a readable section |
| chapter-055 | chapter | Chapter 55 | yes | yes | 2342 | 13047 | 78 | body content | image/illustration placeholder appears in a readable section |
| chapter-056 | chapter | Chapter 56 | yes | yes | 2766 | 15527 | 94 | body content | image/illustration placeholder appears in a readable section |
| chapter-057 | chapter | Chapter 57 | yes | yes | 1677 | 9528 | 57 | body content | image/illustration placeholder appears in a readable section |
| chapter-058 | chapter | Chapter 58 | yes | yes | 2452 | 13800 | 83 | body content | image/illustration placeholder appears in a readable section |
| chapter-059 | chapter | Chapter 59 | yes | yes | 2505 | 13678 | 83 | body content | image/illustration placeholder appears in a readable section |
| chapter-060 | chapter | Chapter 60 | yes | yes | 1602 | 8786 | 53 | body content | image/illustration placeholder appears in a readable section |
| chapter-061 | chapter | Chapter 61 | yes | yes | 1262 | 7432 | 44 | body content | image/illustration placeholder appears in a readable section |
