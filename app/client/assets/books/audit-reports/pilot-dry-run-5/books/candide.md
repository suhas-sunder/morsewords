# Pilot Dry Run 5: candide

- Title: Candide
- Author: Voltaire
- Source file: `app/client/assets/temp-books/Candide.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: public
- Generated output exists: yes
- Preview asset exists: yes
- Cloudflare JSON path: `app/client/assets/books/cloudflare-export/books/candide.json`
- Detected structural convention: standalone roman numeral sections
- Current generated section count: 8
- Proposed section count if correction is needed: 30
- First default section currently: part-002 (part, 5090 words) Part 2
- Expected first readable section: INTRODUCTION BY PHILIP LITTELL BONI AND LIVERIGHT, INC. PUBLISHERS NEW YORK
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
- generated output likely collapsed real structure
- Real opening or ending content may be at risk around the audited boundary.
- Existing generated output needs boundary/default-section correction later.
- Dense numbered bracket references indicate footnote-heavy or parser-junk risk.

## Hard Fail Reasons

- part-001 appears to mix opening readable content with front/source material and is skipped by default
- clear structure exists in the source but current output is coarse fallback-style sections

## Supporting Snippets

- Raw start: active form. [Illustration: Voltaire.] CANDIDE BY VOLTAIRE INTRODUCTION BY PHILIP LITTELL BONI AND LIVERIGHT, INC. PUBLISHERS NEW YORK Copyright, 1918, by BONI & LIVERIGHT, INC. Printed in the United States of America INTRODUCTION Ever since 1759, when Volt...
- Raw end: this one in _Candide_, and one in the _Pauvre Diable_ beginning: L'abb? Trublet avait alors le rage D'?tre ? Paris un petit personage. [28] P. 120. Damiens, who attempted the life of Louis XV. in 1757, was born at Arras, capital of Artois (Atr?batie). [29] ...
- Generated first default: "It is more likely," said he, "mankind have a little corrupted nature, for they were not born wolves, and they have become wolves; God has given them neither cannon of four-and-twenty pounders, nor bayonets; and yet they have made cannon and bayonets to des...
- Generated last readable: t has been retained. \| \| \| \| The different spellings of Cun?gonde (which occurs only \| \| in the Introduction) and Robeck (which occurs in the \| \| Notes [p. 170]; spelt Robek in the text [p. 53]) have \| \| been retained for the same reason. \| \| \| +-----------...
- Preview start: "It is more likely," said he, "mankind have a little corrupted nature, for they were not born wolves, and they have become wolves; God has given them neither cannon of four-and-twenty pounders, nor bayonets; and yet they have made cannon and bayonets to des...

## Current Section List

| Section | Kind | Label | includeByDefault | Current default | Words | Characters | Listen min | Type | Warnings |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | --- | --- |
| part-001 | part | Part 1 | no | no | 4837 | 29743 | 167 | suspicious | source/license/catalog/transcriber material appears in this section; decorative/page-marker lines appear near the section start |
| part-002 | part | Part 2 | no | yes | 5090 | 28751 | 172 | body content | none |
| part-003 | part | Part 3 | no | yes | 5168 | 28803 | 172 | body content | none |
| part-004 | part | Part 4 | no | yes | 5243 | 29652 | 177 | body content | none |
| part-005 | part | Part 5 | no | yes | 5270 | 29506 | 177 | body content | none |
| part-006 | part | Part 6 | no | yes | 5415 | 29846 | 178 | body content | none |
| part-007 | part | Part 7 | no | yes | 4877 | 29104 | 169 | body content | none |
| part-008 | part | Part 8 | no | no | 0 | 33 | 1 | optional | decorative/page-marker lines appear near the section start |
