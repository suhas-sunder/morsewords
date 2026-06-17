# Pilot Dry Run 4: grimm-s-fairy-tales

- Title: Grimm's Fairy Tales
- Author: Jacob Grimm Wilhelm Grimm
- Source file: `app/client/assets/temp-books/Grimm's Fairy Tales.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: public
- Generated output exists: yes
- Preview asset exists: yes
- Cloudflare JSON path: `app/client/assets/books/cloudflare-export/books/grimm-s-fairy-tales.json`
- Detected structural convention: story or titled-section headings
- Current generated section count: 18
- Proposed section count if correction is needed: 77
- First default section currently: part-002 (part, 5824 words) Part 2
- Expected first readable section: The text is based on translations from the Grimms? Kinder und Hausm?rchen by Edgar Taylor and Marian Edwardes.
- Current status: needs correction before acceptance
- Recommendation for next pass: controlled rewrite/correction

## Verdicts

- Start boundary: review: first default is readable, but it does not tightly match pass-2 start snippet
- End boundary: review: last readable section does not tightly match pass-2 end snippet
- Sectioning: needs correction: source headings are clearer than the current generated split
- Cleanup: needs correction: cleanup material appears in readable/default sections
- Preview: valid book-specific startup preview
- All-main-readable default: acceptable: all detected main readable sections are included in current default playback

## Warnings

- first default section does not tightly align with pass-2 candidate start
- last readable section does not tightly align with pass-2 candidate end
- generated output likely collapsed real structure
- Real opening or ending content may be at risk around the audited boundary.
- Existing generated output needs boundary/default-section correction later.

## Hard Fail Reasons

- source/TOC/license material leaks into readable/default sections: part-017
- part-001 appears to mix opening readable content with front/source material and is skipped by default
- clear structure exists in the source but current output is coarse fallback-style sections

## Supporting Snippets

- Raw start: Wilhelm Grimm PREPARER?S NOTE The text is based on translations from the Grimms? Kinder und Hausm?rchen by Edgar Taylor and Marian Edwardes. CONTENTS: THE GOLDEN BIRD HANS IN LUCK JORINDA AND JORINDEL THE TRAVELLING MUSICIANS OLD SULTAN THE STRAW, THE COAL,...
- Raw end: arth, and let the children amuse themselves with him as much as they liked; and they got so used to him that the doors were never fastened until their black friend had arrived. When spring had come and all outside was green, the bear said one morning to Sno...
- Generated first default: The King?s Son was beside himself with grief and in his despair he leapt down from the tower. He escaped with his life, but the thorns into which he fell, pierced his eyes. Then he wandered quite blind about the forest, ate nothing but roots and berries, an...
- Generated last readable: ime, and when the children passed by it, they sang: ?_Kling, klang, gloria. Who sits within this tower? A King?s Daughter, she sits within, A sight of her I cannot win, The wall it will not break, The stone cannot be pierced. Little Hans, with your coat so ...
- Preview start: The King?s Son was beside himself with grief and in his despair he leapt down from the tower. He escaped with his life, but the thorns into which he fell, pierced his eyes. Then he wandered quite blind about the forest, ate nothing but roots and berries, an...

## Current Section List

| Section | Kind | Label | includeByDefault | Current default | Words | Characters | Listen min | Type | Warnings |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | --- | --- |
| part-001 | part | Part 1 | no | no | 4934 | 29897 | 158 | front matter | image/illustration placeholder appears in a readable section |
| part-002 | part | Part 2 | no | yes | 5824 | 29811 | 177 | body content | none |
| part-003 | part | Part 3 | no | yes | 5694 | 29955 | 178 | body content | none |
| part-004 | part | Part 4 | no | yes | 5589 | 29793 | 175 | body content | none |
| part-005 | part | Part 5 | no | yes | 5783 | 29934 | 178 | body content | none |
| part-006 | part | Part 6 | no | yes | 5775 | 29855 | 178 | body content | none |
| part-007 | part | Part 7 | no | yes | 5672 | 29906 | 178 | body content | none |
| part-008 | part | Part 8 | no | yes | 5698 | 29945 | 178 | body content | none |
| part-009 | part | Part 9 | no | yes | 5798 | 29910 | 178 | body content | none |
| part-010 | part | Part 10 | no | yes | 5731 | 29821 | 177 | body content | none |
| part-011 | part | Part 11 | no | yes | 5735 | 29919 | 177 | body content | none |
| part-012 | part | Part 12 | no | yes | 5708 | 29847 | 177 | body content | none |
| part-013 | part | Part 13 | no | yes | 5639 | 29828 | 178 | body content | none |
| part-014 | part | Part 14 | no | yes | 5592 | 29902 | 177 | body content | none |
| part-015 | part | Part 15 | no | yes | 5619 | 29681 | 177 | body content | none |
| part-016 | part | Part 16 | no | yes | 5639 | 29940 | 177 | body content | none |
| part-017 | part | Part 17 | no | yes | 780 | 4287 | 25 | body content | source/license/catalog/transcriber material appears in this section |
| part-018 | part | Part 18 | no | yes | 14 | 97 | 1 | optional | section is very short |
