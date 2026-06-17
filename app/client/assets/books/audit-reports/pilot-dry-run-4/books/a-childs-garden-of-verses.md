# Pilot Dry Run 4: a-childs-garden-of-verses

- Title: A Child's Garden of Verses
- Author: Robert Louis Stevenson
- Source file: `app/client/assets/temp-books/a-childs-garden-of-verses.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: public
- Generated output exists: yes
- Preview asset exists: yes
- Cloudflare JSON path: `app/client/assets/books/cloudflare-export/books/a-childs-garden-of-verses.json`
- Detected structural convention: isolated titled sections
- Current generated section count: 3
- Proposed section count if correction is needed: 132
- First default section currently: part-002 (part, 4712 words) Part 2
- Expected first readable section: CHARLES SCRIBNER'S SONS, _New York_ Copyright, 1905, By CHARLES SCRIBNER'S SONS
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
- Many illustration/image placeholders need cleanup review.

## Hard Fail Reasons

- part-001 appears to mix opening readable content with front/source material and is skipped by default
- clear structure exists in the source but current output is coarse fallback-style sections

## Supporting Snippets

- Raw start: NSON _Illustrated by Jessie Willcox Smith_ CHARLES SCRIBNER'S SONS, _New York_ Copyright, 1905, By CHARLES SCRIBNER'S SONS Printed in the United States of America All rights reserved. No part of this book may be reproduced in any form without the permission...
- Raw end: RY OF SIEGFRIED by JAMES BALDWIN _Illustrated by Peter Hurd_ DRUMS by JAMES BOYD _Illustrated by N. C. Wyeth_ A LITTLE PRINCESS by FRANCES HODGSON BURNETT _Illustrated by Ethel Franklin Betts_ THE DEERSLAYER by JAMES FENIMORE COOPER _Illustrated by N. C. Wy...
- Generated first default: Faster than fairies, faster than witches, Bridges and houses, hedges and ditches; And charging along like troops in a battle All through the meadows the horses and cattle: All of the sights of the hill and the plain Fly as thick as driving rain; And ever ag...
- Generated last readable: Jessie Willcox Smith_ A CHILD'S GARDEN OF VERSES by ROBERT LOUIS STEVENSON _Illustrated by Jessie Willcox Smith_ THE BLACK ARROW by ROBERT LOUIS STEVENSON _Illustrated by N. C. Wyeth_ DAVID BALFOUR by ROBERT LOUIS STEVENSON _Illustrated by N. C. Wyeth_ KIDN...
- Preview start: Faster than fairies, faster than witches, Bridges and houses, hedges and ditches; And charging along like troops in a battle All through the meadows the horses and cattle: All of the sights of the hill and the plain Fly as thick as driving rain; And ever ag...

## Current Section List

| Section | Kind | Label | includeByDefault | Current default | Words | Characters | Listen min | Type | Warnings |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | --- | --- |
| part-001 | part | Part 1 | no | no | 4164 | 29450 | 132 | suspicious | source/license/catalog/transcriber material appears in this section |
| part-002 | part | Part 2 | no | yes | 4712 | 29184 | 154 | body content | none |
| part-003 | part | Part 3 | no | no | 14 | 91 | 1 | optional | section is very short |
