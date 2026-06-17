# Pilot Dry Run 5: the-old-house

- Title: Andersen's Fairy Tales
- Author: H. C. Andersen
- Source file: `app/client/assets/temp-books/The Old House.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: public
- Generated output exists: yes
- Preview asset exists: yes
- Cloudflare JSON path: `app/client/assets/books/cloudflare-export/books/the-old-house.json`
- Detected structural convention: story or titled-section headings
- Current generated section count: 5
- Proposed section count if correction is needed: 10
- First default section currently: part-001 (part, 5695 words) Part 1
- Expected first readable section: In the street, up there, was an old, a very old house--it was almost three hundred years old, for that might be known by reading the great beam on which the date of the year was carved: together with tulips and hop-binds there were whole verses spelled as i...
- Current status: needs correction before acceptance
- Recommendation for next pass: controlled rewrite/correction

## Verdicts

- Start boundary: correct: first default aligns with pass-2 readable start
- End boundary: review: last readable section does not tightly match pass-2 end snippet
- Sectioning: needs correction: source headings are clearer than the current generated split
- Cleanup: acceptable: no cleanup artifacts detected in readable/default sections
- Preview: valid book-specific startup preview
- All-main-readable default: acceptable: all detected main readable sections are included in current default playback

## Warnings

- last readable section does not tightly align with pass-2 candidate end
- Real opening or ending content may be at risk around the audited boundary.

## Hard Fail Reasons

- clear structure exists in the source but current output is coarse fallback-style sections

## Supporting Snippets

- Raw start: s Christian Andersen THE OLD HOUSE In the street, up there, was an old, a very old house--it was almost three hundred years old, for that might be known by reading the great beam on which the date of the year was carved: together with tulips and hop-binds t...
- Raw end: the evenings. All the children thought a great deal of her; but when they spoke of dress, and grandeur, and beauty, she shook her head. The following Sunday, when the family was going to church, they asked her whether she would not go with them; but she gla...
- Generated first default: ANDERSEN'S FAIRY TALES By Hans Christian Andersen THE OLD HOUSE In the street, up there, was an old, a very old house--it was almost three hundred years old, for that might be known by reading the great beam on which the date of the year was carved: togethe...
- Generated last readable: And the organ pealed, and the children's voices in the choir sounded so sweet and soft! The clear sunshine streamed so warmly through the window into the pew where Karen sat! Her heart was so full of sunshine, peace, and joy, that it broke. Her soul flew on...
- Preview start: ANDERSEN'S FAIRY TALES By Hans Christian Andersen THE OLD HOUSE In the street, up there, was an old, a very old house--it was almost three hundred years old, for that might be known by reading the great beam on which the date of the year was carved: togethe...

## Current Section List

| Section | Kind | Label | includeByDefault | Current default | Words | Characters | Listen min | Type | Warnings |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | --- | --- |
| part-001 | part | Part 1 | no | yes | 5695 | 29822 | 178 | body content | none |
| part-002 | part | Part 2 | no | yes | 5743 | 29990 | 180 | body content | none |
| part-003 | part | Part 3 | no | yes | 5578 | 29590 | 177 | body content | none |
| part-004 | part | Part 4 | no | yes | 1173 | 6161 | 37 | body content | none |
| part-005 | part | Part 5 | no | yes | 61 | 322 | 2 | body content | section is very short |
