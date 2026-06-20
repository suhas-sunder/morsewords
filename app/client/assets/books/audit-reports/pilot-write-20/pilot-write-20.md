# Pilot write batch 20

Controlled first-time processing pass for the exact raw-only books selected by pilot dry-run batch 20.

## Totals

- Selected: 20
- First-time processed: 20
- Skipped: 0
- Unresolved-source generated left untouched: 11

## Accepted Exclusion Count Clarification

- Dry-run accepted/corrected/verified exclusion count: 385
- Known duplicate/manual/boundary exclusions left unprocessed: the-wind-in-the-willows, the-two-magics-the-turn-of-the-screw-covering-end, japanese-fairy-tales, the-works-of-edgar-allan-poe, snow-white-and-rose-red
- Selected books intersecting accepted exclusions: none
- Note: This write pass uses only the exact selected list from pilot-dry-run-20.json. Known duplicate/manual/boundary exclusions and unresolved-source generated books remain untouched.

## Unresolved-source generated books left untouched

- a-princess-of-mars: Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- doctor-dolittle: Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- heidi: Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- jabberwocky: Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- nights-with-uncle-remus: Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- peter-pan: Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- tarzan-of-the-apes: Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- the-great-gatsby: Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- the-picture-of-dorian-gray: Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- the-thirty-nine-steps: Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- wood-folk-at-school: Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.

## Books

### moti

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/‘Moti’.txt
- Expected/generated title: Moti / Moti
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/moti/manifest.json, app/client/assets/books/generated/moti/cleaned_book.json, app/client/assets/books/generated/moti/processed_book.json, app/client/assets/books/generated/moti/rights_report.json, app/client/assets/books/generated/moti/processing_notes.md, app/client/assets/books/generated/moti/sections/chapter-001.json
- Preview asset changed: public/book-previews/moti.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: Once upon a time there was a youth called Moti; write pass starts at first selected/default section
- End boundary: cleaned line 282 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 15451 / 15451
- First default section after: Moti (2979 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line and editor metadata is preserved as Andrew Lang in rights_report.json
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: Moti (2979 words)

Supporting snippets:

- Title: ‘Moti’
- Author: Author: Andrew Lang
- Start: Once upon a time there was a youth called Moti, who was very big and strong, but the clumsiest creature you can imagine. So clumsy was he that he was always putting his great feet into the bowls of sweet milk or curds which his mother set out on the floor to c
- End: king of the fortune of clumsy Moti, who lived long and contrived always to be looked up to as a fountain of wisdom, valour, and discretion by all except his relations, who could never understand what he had done to be considered so much wiser than anyone else.

### the-brown-bear-of-norway

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Brown Bear of Norway.txt
- Expected/generated title: The Brown Bear of Norway / The Brown Bear of Norway
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-brown-bear-of-norway/manifest.json, app/client/assets/books/generated/the-brown-bear-of-norway/cleaned_book.json, app/client/assets/books/generated/the-brown-bear-of-norway/processed_book.json, app/client/assets/books/generated/the-brown-bear-of-norway/rights_report.json, app/client/assets/books/generated/the-brown-bear-of-norway/processing_notes.md, app/client/assets/books/generated/the-brown-bear-of-norway/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-brown-bear-of-norway.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: There was once a king in Ireland; write pass starts at first selected/default section
- End boundary: cleaned line 291 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 17248 / 17248
- First default section after: The Brown Bear of Norway (3408 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line and editor metadata is preserved as Andrew Lang in rights_report.json
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Brown Bear of Norway (3408 words)

Supporting snippets:

- Title: The Brown Bear of Norway
- Author: Author: Andrew Lang
- Start: There was once a king in Ireland, and he had three daughters, and very nice princesses they were. And one day, when they and their father were walking on the lawn, the king began to joke with them, and to ask them whom they would like to be married to. I ll h
- End: ncess had their children with them, and then they set out for their own palace. The kings of Ireland and of Munster and Ulster, and their wives, soon came to visit them, and may every one that deserves it be as happy as the Brown Bear of Norway and his family.

### the-escape-of-the-mouse

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Escape of the Mouse.txt
- Expected/generated title: The Escape of the Mouse / The Escape of the Mouse
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-escape-of-the-mouse/manifest.json, app/client/assets/books/generated/the-escape-of-the-mouse/cleaned_book.json, app/client/assets/books/generated/the-escape-of-the-mouse/processed_book.json, app/client/assets/books/generated/the-escape-of-the-mouse/rights_report.json, app/client/assets/books/generated/the-escape-of-the-mouse/processing_notes.md, app/client/assets/books/generated/the-escape-of-the-mouse/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-escape-of-the-mouse.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: Manawyddan the prince and his friend Pryderi were wanderers; write pass starts at first selected/default section
- End boundary: cleaned line 370 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 15917 / 15917
- First default section after: The Escape of the Mouse (3025 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line and editor metadata is preserved as Andrew Lang in rights_report.json
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Escape of the Mouse (3025 words)

Supporting snippets:

- Title: The Escape of the Mouse
- Author: Author: Andrew Lang
- Start: Manawyddan the prince and his friend Pryderi were wanderers, for the brother of Manawyddan had been slain, and his throne taken from him. Very sorrowful was Manawyddan, but Pryderi was stout of heart, and bade him be of good cheer, as he knew a way out of his
- End: more question he put to the bishop. ‘What spell didst thou lay upon Pryderi and Rhiannon?’ ‘Pryderi has had the knockers of the gate of my palace hung about him, and Rhiannon has carried the collars of my asses around her neck,’ said the bishop with a smile.

### the-fairy-nurse

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Fairy Nurse.txt
- Expected/generated title: The Fairy Nurse / The Fairy Nurse
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-fairy-nurse/manifest.json, app/client/assets/books/generated/the-fairy-nurse/cleaned_book.json, app/client/assets/books/generated/the-fairy-nurse/processed_book.json, app/client/assets/books/generated/the-fairy-nurse/rights_report.json, app/client/assets/books/generated/the-fairy-nurse/processing_notes.md, app/client/assets/books/generated/the-fairy-nurse/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-fairy-nurse.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: There was once a little farmer and his wife living near Coolgarrow; write pass starts at first selected/default section
- End boundary: cleaned line 130 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 7787 / 7787
- First default section after: The Fairy Nurse (1566 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line and editor metadata is preserved as Andrew Lang in rights_report.json
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Fairy Nurse (1566 words)

Supporting snippets:

- Title: The Fairy Nurse
- Author: Author: Andrew Lang
- Start: There was once a little farmer and his wife living near Coolgarrow. They had three children, and my story happened while the youngest was a baby. The wife was a good wife enough, but her mind was all on her family and her farm, and she hardly ever went to her
- End: r side. ‘Musha, indeed, sir, your coat looks no better than a withered dock-leaf.’ ‘Maybe, then,’ says he, ‘it will be different now,’ and he struck the eye next him with a switch. Friends, she never saw a glimmer after with that one till the day of her death.

### the-four-gifts

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Four Gifts.txt
- Expected/generated title: The Four Gifts / The Four Gifts
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-four-gifts/manifest.json, app/client/assets/books/generated/the-four-gifts/cleaned_book.json, app/client/assets/books/generated/the-four-gifts/processed_book.json, app/client/assets/books/generated/the-four-gifts/rights_report.json, app/client/assets/books/generated/the-four-gifts/processing_notes.md, app/client/assets/books/generated/the-four-gifts/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-four-gifts.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: In the old land of Brittany, once called Cornwall; write pass starts at first selected/default section
- End boundary: cleaned line 356 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 18174 / 18174
- First default section after: The Four Gifts (3499 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line and editor metadata is preserved as Andrew Lang in rights_report.json
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Four Gifts (3499 words)

Supporting snippets:

- Title: The Four Gifts
- Author: Author: Andrew Lang
- Start: In the old land of Brittany, once called Cornwall, there lived a woman named Barbaik Bourhis, who spent all her days in looking after her farm with the help of her niece Tephany. Early and late the two might be seen in the fields or in the dairy, milking cows,
- End: aceful life and marry the man you love. For after all it was not yourself you thought of but him.’ Never again did Tephany see the old woman, but she forgave Denis for selling her tears, and in time he grew to be a good husband, who did his own share of work.

### the-goat-s-ears-of-the-emperor-trojan

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE GOAT’S EARS OF THE EMPEROR TROJAN.txt
- Expected/generated title: The Goat’s Ears of the Emperor Trojan / The Goat’s Ears of the Emperor Trojan
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-goat-s-ears-of-the-emperor-trojan/manifest.json, app/client/assets/books/generated/the-goat-s-ears-of-the-emperor-trojan/cleaned_book.json, app/client/assets/books/generated/the-goat-s-ears-of-the-emperor-trojan/processed_book.json, app/client/assets/books/generated/the-goat-s-ears-of-the-emperor-trojan/rights_report.json, app/client/assets/books/generated/the-goat-s-ears-of-the-emperor-trojan/processing_notes.md, app/client/assets/books/generated/the-goat-s-ears-of-the-emperor-trojan/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-goat-s-ears-of-the-emperor-trojan.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: Once upon a time there lived an emperor whose name was Trojan; write pass starts at first selected/default section
- End boundary: cleaned line 83 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 4538 / 4538
- First default section after: The Goat’s Ears of the Emperor Trojan (872 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line and editor metadata is preserved as Andrew Lang in rights_report.json
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Goat’s Ears of the Emperor Trojan (872 words)

Supporting snippets:

- Title: THE GOAT’S EARS OF THE EMPEROR TROJAN
- Author: Author: Andrew Lang
- Start: Once upon a time there lived an emperor whose name was Trojan, and he had ears like a goat. Every morning, when he was shaved, he asked if the man saw anything odd about him, and as each fresh barber always replied that the emperor had goat s ears, he was at o
- End: s the best flute player about the court--nothing came but the words, ‘The Emperor Trojan has goat’s ears.’ Then the emperor knew that even the earth gave up its secrets, and he granted the young man his life, but he never allowed him to be his barber any more.

### the-groac-h-of-the-isle-of-lok

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Groac’h of the Isle of Lok.txt
- Expected/generated title: The Groac’h of the Isle of Lok / The Groac’h of the Isle of Lok
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-groac-h-of-the-isle-of-lok/manifest.json, app/client/assets/books/generated/the-groac-h-of-the-isle-of-lok/cleaned_book.json, app/client/assets/books/generated/the-groac-h-of-the-isle-of-lok/processed_book.json, app/client/assets/books/generated/the-groac-h-of-the-isle-of-lok/rights_report.json, app/client/assets/books/generated/the-groac-h-of-the-isle-of-lok/processing_notes.md, app/client/assets/books/generated/the-groac-h-of-the-isle-of-lok/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-groac-h-of-the-isle-of-lok.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: In old times, when all kinds of wonderful things happened in Brittany; write pass starts at first selected/default section
- End boundary: cleaned line 385 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 17654 / 17654
- First default section after: The Groac’h of the Isle of Lok (3430 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line and editor metadata is preserved as Andrew Lang in rights_report.json
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Groac’h of the Isle of Lok (3430 words)

Supporting snippets:

- Title: The Groac’h of the Isle of Lok
- Author: Author: Andrew Lang
- Start: In old times, when all kinds of wonderful things happened in Brittany, there lived in the village of Lanillis, a young man named Houarn Pogamm and a girl called Bellah Postik. They were cousins, and as their mothers were great friends, and constantly in and ou
- End: sekeeping with the little cow and pig to fatten that they had so long wished for, they were able to buy lands for miles round for themselves, and gave each man who had been delivered from the Groac’h a small farm, where he lived happily to the end of his days.

### the-heart-of-a-monkey

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Heart of a Monkey.txt
- Expected/generated title: The Heart of a Monkey / The Heart of a Monkey
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-heart-of-a-monkey/manifest.json, app/client/assets/books/generated/the-heart-of-a-monkey/cleaned_book.json, app/client/assets/books/generated/the-heart-of-a-monkey/processed_book.json, app/client/assets/books/generated/the-heart-of-a-monkey/rights_report.json, app/client/assets/books/generated/the-heart-of-a-monkey/processing_notes.md, app/client/assets/books/generated/the-heart-of-a-monkey/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-heart-of-a-monkey.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: A long time ago a little town made up of a collection; write pass starts at first selected/default section
- End boundary: cleaned line 345 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 15956 / 15956
- First default section after: The Heart of a Monkey (3117 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line and editor metadata is preserved as Andrew Lang in rights_report.json
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Heart of a Monkey (3117 words)

Supporting snippets:

- Title: The Heart of a Monkey
- Author: Author: Andrew Lang
- Start: A long time ago a little town made up of a collection of low huts stood in a tiny green valley at the foot of a cliff. Of course the people had taken great care to build their houses out of reach of the highest tide which might be driven on shore by a west win
- End: ; I am not. And as the sun is getting low in the sky, it is time for you to begin your homeward journey. You will have a nice cool voyage, and I hope you will find the sultan better. Farewell!’ And the monkey disappeared among the green branches, and was gone.

### the-hoodie-crow

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Hoodie-Crow.txt
- Expected/generated title: The Hoodie-Crow / The Hoodie-Crow
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-hoodie-crow/manifest.json, app/client/assets/books/generated/the-hoodie-crow/cleaned_book.json, app/client/assets/books/generated/the-hoodie-crow/processed_book.json, app/client/assets/books/generated/the-hoodie-crow/rights_report.json, app/client/assets/books/generated/the-hoodie-crow/processing_notes.md, app/client/assets/books/generated/the-hoodie-crow/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-hoodie-crow.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: Once there lived a farmer who had three daughters; write pass starts at first selected/default section
- End boundary: cleaned line 151 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 7707 / 7707
- First default section after: The Hoodie-Crow (1539 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line and editor metadata is preserved as Andrew Lang in rights_report.json
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Hoodie-Crow (1539 words)

Supporting snippets:

- Title: The Hoodie-Crow
- Author: Author: Andrew Lang
- Start: Once there lived a farmer who had three daughters, and good useful girls they were, up with the sun, and doing all the work of the house. One morning they all ran down to the river to wash their clothes, when a hoodie came round and sat on a tree close by. W
- End: to put on. Still, at last they were over, and they went back the way she had come, and stopped at the three houses in order to take their little sons to their own home. But the story never says who had stolen them, nor what the coarse comb had to do with it.

### the-jogi-s-punishment

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Jogi’s Punishment.txt
- Expected/generated title: The Jogi’s Punishment / The Jogi’s Punishment
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-jogi-s-punishment/manifest.json, app/client/assets/books/generated/the-jogi-s-punishment/cleaned_book.json, app/client/assets/books/generated/the-jogi-s-punishment/processed_book.json, app/client/assets/books/generated/the-jogi-s-punishment/rights_report.json, app/client/assets/books/generated/the-jogi-s-punishment/processing_notes.md, app/client/assets/books/generated/the-jogi-s-punishment/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-jogi-s-punishment.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: Once upon a time there came to the ancient city of Rahmatabad; write pass starts at first selected/default section
- End boundary: cleaned line 199 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 11292 / 11292
- First default section after: The Jogi’s Punishment (2177 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line and editor metadata is preserved as Andrew Lang in rights_report.json
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Jogi’s Punishment (2177 words)

Supporting snippets:

- Title: The Jogi’s Punishment
- Author: Author: Andrew Lang
- Start: Once upon a time there came to the ancient city of Rahmatabad a jogi[FN#1: A Hindu holy man.] of holy appearance, who took up his abode under a tree outside the city, where he would sit for days at a time fasting from food and drink, motionless except for the
- End: re they saw the jogi’s body lying torn to pieces on the threshold of his dwelling! Very soon the story spread, as stories will, and reached the ears of the princess and her husband, and when she knew that her enemy was dead she made her peace with her father.

### the-king-of-the-waterfalls

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The King of the Waterfalls.txt
- Expected/generated title: The King of the Waterfalls / The King of the Waterfalls
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-king-of-the-waterfalls/manifest.json, app/client/assets/books/generated/the-king-of-the-waterfalls/cleaned_book.json, app/client/assets/books/generated/the-king-of-the-waterfalls/processed_book.json, app/client/assets/books/generated/the-king-of-the-waterfalls/rights_report.json, app/client/assets/books/generated/the-king-of-the-waterfalls/processing_notes.md, app/client/assets/books/generated/the-king-of-the-waterfalls/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-king-of-the-waterfalls.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: When the young king of Easaidh Ruadh came into his kingdom; write pass starts at first selected/default section
- End boundary: cleaned line 457 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 20976 / 20976
- First default section after: The King of the Waterfalls (4145 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line and editor metadata is preserved as Andrew Lang in rights_report.json
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The King of the Waterfalls (4145 words)

Supporting snippets:

- Title: The King of the Waterfalls
- Author: Author: Andrew Lang
- Start: When the young king of Easaidh Ruadh came into his kingdom, the first thing he thought of was how he could amuse himself best. The sports that all his life had pleased him best suddenly seemed to have grown dull, and he wanted to do something he had never done
- End: adow suddenly shrank and was still, and they knew that the giant was dead, because they had found his soul. Next day they mounted the two horses and rode home again, visiting their friends the brown otter and the hoary hawk and the slim yellow dog by the way.

### the-one-handed-girl

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The One-Handed Girl.txt
- Expected/generated title: The One-Handed Girl / The One-Handed Girl
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-one-handed-girl/manifest.json, app/client/assets/books/generated/the-one-handed-girl/cleaned_book.json, app/client/assets/books/generated/the-one-handed-girl/processed_book.json, app/client/assets/books/generated/the-one-handed-girl/rights_report.json, app/client/assets/books/generated/the-one-handed-girl/processing_notes.md, app/client/assets/books/generated/the-one-handed-girl/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-one-handed-girl.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: An old couple once lived in a hut under a grove of palm trees; write pass starts at first selected/default section
- End boundary: cleaned line 587 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 27255 / 27255
- First default section after: The One-Handed Girl (5346 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line and editor metadata is preserved as Andrew Lang in rights_report.json
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The One-Handed Girl (5346 words)

Supporting snippets:

- Title: The One-Handed Girl
- Author: Author: Andrew Lang
- Start: An old couple once lived in a hut under a grove of palm trees, and they had one son and one daughter. They were all very happy together for many years, and then the father became very ill, and felt he was going to die. He called his children to the place where
- End: about it, and be happy once more, for see! our son is growing quite a big boy.’ ‘And what shall be done to your brother?’ asked the king, who was glad to think that someone had acted in this matter worse than himself. ‘Put him out of the town,’ answered she.

### the-raspberry-worm

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Raspberry Worm.txt
- Expected/generated title: The Raspberry Worm / The Raspberry Worm
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-raspberry-worm/manifest.json, app/client/assets/books/generated/the-raspberry-worm/cleaned_book.json, app/client/assets/books/generated/the-raspberry-worm/processed_book.json, app/client/assets/books/generated/the-raspberry-worm/rights_report.json, app/client/assets/books/generated/the-raspberry-worm/processing_notes.md, app/client/assets/books/generated/the-raspberry-worm/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-raspberry-worm.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: ‘Phew!’ cried Lisa; write pass starts at first selected/default section
- End boundary: cleaned line 529 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 24609 / 24609
- First default section after: The Raspberry Worm (4659 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line and editor metadata is preserved as Andrew Lang in rights_report.json
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Raspberry Worm (4659 words)

Supporting snippets:

- Title: The Raspberry Worm
- Author: Author: Andrew Lang
- Start: Phew! cried Lisa. Ugh! cried Aina. What now? cried the big sister. A worm! cried Lisa. On the raspberry! cried Aina. Kill it! cried Otto. What a fuss over a poor little worm! said the big sister scornfully. Yes, when we had cleaned the ra
- End: assed straight on its way, leaving the wizard crushed into powder in the heather. Then Bernez went home, and showed his wealth to Marzinne, who this time did not refuse him as a brother-in-law, and he and Rozennik were married, and lived happy for ever after.

### the-rich-brother-and-the-poor-brother

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Rich Brother and the Poor Brother.txt
- Expected/generated title: The Rich Brother and the Poor Brother / The Rich Brother and the Poor Brother
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-rich-brother-and-the-poor-brother/manifest.json, app/client/assets/books/generated/the-rich-brother-and-the-poor-brother/cleaned_book.json, app/client/assets/books/generated/the-rich-brother-and-the-poor-brother/processed_book.json, app/client/assets/books/generated/the-rich-brother-and-the-poor-brother/rights_report.json, app/client/assets/books/generated/the-rich-brother-and-the-poor-brother/processing_notes.md, app/client/assets/books/generated/the-rich-brother-and-the-poor-brother/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-rich-brother-and-the-poor-brother.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: There was once a rich old man who had two sons; write pass starts at first selected/default section
- End boundary: cleaned line 363 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 19971 / 19971
- First default section after: The Rich Brother and the Poor Brother (3920 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line and editor metadata is preserved as Andrew Lang in rights_report.json
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Rich Brother and the Poor Brother (3920 words)

Supporting snippets:

- Title: The Rich Brother and the Poor Brother
- Author: Author: Andrew Lang
- Start: There was once a rich old man who had two sons, and as his wife was dead, the elder lived with him, and helped him to look after his property. For a long time all went well; the young man got up very early in the morning, and worked hard all day, and at the en
- End: on.’ The young men looked at each other, and slowly shook their heads. ‘We will pay the fine,’ said they, and the judge nodded. So the poor man rode the mule home, and brought back to his family enough money to keep them in comfort to the end of their days.

### jimmy-goggles-the-god

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/JIMMY GOGGLES THE GOD.txt
- Expected/generated title: Jimmy Goggles the God / Jimmy Goggles the God
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Metadata evidence: Gutenberg Author line - Author: H. G. Wells
- Generated files changed: app/client/assets/books/generated/jimmy-goggles-the-god/manifest.json, app/client/assets/books/generated/jimmy-goggles-the-god/cleaned_book.json, app/client/assets/books/generated/jimmy-goggles-the-god/processed_book.json, app/client/assets/books/generated/jimmy-goggles-the-god/rights_report.json, app/client/assets/books/generated/jimmy-goggles-the-god/processing_notes.md, app/client/assets/books/generated/jimmy-goggles-the-god/sections/chapter-001.json
- Preview asset changed: public/book-previews/jimmy-goggles-the-god.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 5 - start at first readable prose after source/title/byline wrapper: “It isn't every one who's been a god,” said the sunburnt man; write pass starts at first selected/default section
- End boundary: cleaned line 99 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 27087 / 27087
- First default section after: Jimmy Goggles the God (5190 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: Jimmy Goggles the God (5190 words)

Supporting snippets:

- Title: JIMMY GOGGLES THE GOD
- Author: Author: H. G. Wells
- Start: It isn't every one who's been a god, said the sunburnt man. But it's happened to me. Among other things. I intimated my sense of his condescension. It don't leave much for ambition, does it? said the sunburnt man. I was one of those men who were save
- End: weapon, a spear. No clothes, no money. Nothing. My face was my fortune, as the saying is. And just a squeak of eight thousand pounds of gold—fifth share. But the natives cut up rusty, thank goodness, because they thought it was him had driven their luck away.”

### miss-winchelsea-s-heart

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/MISS WINCHELSEA'S HEART.txt
- Expected/generated title: Miss Winchelsea’s Heart / Miss Winchelsea’s Heart
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Metadata evidence: Gutenberg Author line - Author: H. G. Wells
- Generated files changed: app/client/assets/books/generated/miss-winchelsea-s-heart/manifest.json, app/client/assets/books/generated/miss-winchelsea-s-heart/cleaned_book.json, app/client/assets/books/generated/miss-winchelsea-s-heart/processed_book.json, app/client/assets/books/generated/miss-winchelsea-s-heart/rights_report.json, app/client/assets/books/generated/miss-winchelsea-s-heart/processing_notes.md, app/client/assets/books/generated/miss-winchelsea-s-heart/sections/chapter-001.json
- Preview asset changed: public/book-previews/miss-winchelsea-s-heart.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 5 - start at first readable prose after source/title/byline wrapper: Miss Winchelsea was going to Rome; write pass starts at first selected/default section
- End boundary: cleaned line 105 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 38907 / 38907
- First default section after: Miss Winchelsea’s Heart (6814 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: Miss Winchelsea’s Heart (6814 words)

Supporting snippets:

- Title: MISS WINCHELSEA'S HEART
- Author: Author: H. G. Wells
- Start: Miss Winchelsea was going to Rome. The matter had filled her mind for a month or more, and had overflowed so abundantly into her conversation that quite a number of people who were not going to Rome, and who were not likely to go to Rome, had made it a persona
- End: iss Winchelsea was glad when it came to an end. Under various excuses she avoided visiting them again. After a time the visitor's room was occupied by their two little boys, and Fanny's invitations ceased. The intimacy of her letters had long since faded away.

### mr-brisher-s-treasure

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/MR. BRISHER'S TREASURE.txt
- Expected/generated title: Mr. Brisher’s Treasure / Mr. Brisher’s Treasure
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Metadata evidence: Gutenberg Author line - Author: H. G. Wells
- Generated files changed: app/client/assets/books/generated/mr-brisher-s-treasure/manifest.json, app/client/assets/books/generated/mr-brisher-s-treasure/cleaned_book.json, app/client/assets/books/generated/mr-brisher-s-treasure/processed_book.json, app/client/assets/books/generated/mr-brisher-s-treasure/rights_report.json, app/client/assets/books/generated/mr-brisher-s-treasure/processing_notes.md, app/client/assets/books/generated/mr-brisher-s-treasure/sections/chapter-001.json
- Preview asset changed: public/book-previews/mr-brisher-s-treasure.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 5 - start at first readable prose after source/title/byline wrapper: “You can't be TOO careful WHO you marry,” said Mr. Brisher; write pass starts at first selected/default section
- End boundary: cleaned line 201 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 19559 / 19559
- First default section after: Mr. Brisher’s Treasure (3800 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: Mr. Brisher’s Treasure (3800 words)

Supporting snippets:

- Title: MR. BRISHER'S TREASURE
- Author: Author: H. G. Wells
- Start: You can't be TOO careful WHO you marry, said Mr. Brisher, and pulled thoughtfully with a fat-wristed hand at the lank moustache that hides his want of chin. That's why— I ventured. Yes, said Mr. Brisher, with a solemn light in his bleary, blue-grey eye
- End: say—?” “Yes-It. Bad. Quite a long case they made of it. But they got 'im, though he dodged tremenjous. Traced 'is 'aving passed, oh!—nearly a dozen bad 'arf-crowns.” “And you didn't—?” “No fear. And it didn't do 'IM much good to say it was treasure trove.”

### mr-ledbetter-s-vacation

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/MR. LEDBETTER'S VACATION.txt
- Expected/generated title: Mr. Ledbetter’s Vacation / Mr. Ledbetter’s Vacation
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Metadata evidence: Gutenberg Author line - Author: H. G. Wells
- Generated files changed: app/client/assets/books/generated/mr-ledbetter-s-vacation/manifest.json, app/client/assets/books/generated/mr-ledbetter-s-vacation/cleaned_book.json, app/client/assets/books/generated/mr-ledbetter-s-vacation/processed_book.json, app/client/assets/books/generated/mr-ledbetter-s-vacation/rights_report.json, app/client/assets/books/generated/mr-ledbetter-s-vacation/processing_notes.md, app/client/assets/books/generated/mr-ledbetter-s-vacation/sections/chapter-001.json
- Preview asset changed: public/book-previews/mr-ledbetter-s-vacation.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 6 - start at first readable prose after source/title/byline wrapper: My friend, Mr. Ledbetter, is a round-faced little man; write pass starts at first selected/default section
- End boundary: cleaned line 186 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 38720 / 38720
- First default section after: Mr. Ledbetter’s Vacation (6904 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: Mr. Ledbetter’s Vacation (6904 words)

Supporting snippets:

- Title: MR. LEDBETTER'S VACATION
- Author: Author: H. G. Wells
- Start: My friend, Mr. Ledbetter, is a round-faced little man, whose natural mildness of eye is gigantically exaggerated when you catch the beam through his glasses, and whose deep, deliberate voice irritates irritable people. A certain elaborate clearness of enunciat
- End: Although if gratitude...” And so forth. At the end he repeated his request for me to burn the letter. So the remarkable story of Mr. Ledbetter's Vacation ends. That breach with his aunt was not of long duration. The old lady had forgiven him before she died.

### mr-skelmersdale-in-fairyland

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/MR. SKELMERSDALE IN FAIRYLAND.txt
- Expected/generated title: Mr. Skelmersdale in Fairyland / Mr. Skelmersdale in Fairyland
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Metadata evidence: Gutenberg Author line - Author: H. G. Wells
- Generated files changed: app/client/assets/books/generated/mr-skelmersdale-in-fairyland/manifest.json, app/client/assets/books/generated/mr-skelmersdale-in-fairyland/cleaned_book.json, app/client/assets/books/generated/mr-skelmersdale-in-fairyland/processed_book.json, app/client/assets/books/generated/mr-skelmersdale-in-fairyland/rights_report.json, app/client/assets/books/generated/mr-skelmersdale-in-fairyland/processing_notes.md, app/client/assets/books/generated/mr-skelmersdale-in-fairyland/sections/chapter-001.json
- Preview asset changed: public/book-previews/mr-skelmersdale-in-fairyland.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 5 - start at first readable prose after source/title/byline wrapper: “There's a man in that shop,” said the Doctor; write pass starts at first selected/default section
- End boundary: cleaned line 165 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 28907 / 28907
- First default section after: Mr. Skelmersdale in Fairyland (5330 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: Mr. Skelmersdale in Fairyland (5330 words)

Supporting snippets:

- Title: MR. SKELMERSDALE IN FAIRYLAND
- Author: Author: H. G. Wells
- Start: There's a man in that shop, said the Doctor, who has been in Fairyland. Nonsense! I said, and stared back at the shop. It was the usual village shop, post-office, telegraph wire on its brow, zinc pans and brushes outside, boots, shirtings, and potted me
- End: omething in his eyes and manner that was too difficult for him to express in words. “One gets talking,” he said at last at the door, and smiled wanly, and so vanished from my eyes. And that is the tale of Mr. Skelmersdale in Fairyland just as he told it to me.

### the-new-accelerator

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE NEW ACCELERATOR.txt
- Expected/generated title: The New Accelerator / The New Accelerator
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Metadata evidence: Gutenberg Author line - Author: H. G. Wells
- Generated files changed: app/client/assets/books/generated/the-new-accelerator/manifest.json, app/client/assets/books/generated/the-new-accelerator/cleaned_book.json, app/client/assets/books/generated/the-new-accelerator/processed_book.json, app/client/assets/books/generated/the-new-accelerator/rights_report.json, app/client/assets/books/generated/the-new-accelerator/processing_notes.md, app/client/assets/books/generated/the-new-accelerator/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-new-accelerator.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 5 - start at first readable prose after source/title/byline wrapper: Certainly, if ever a man found a guinea when he was looking for a pin; write pass starts at first selected/default section
- End boundary: cleaned line 219 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 30116 / 30116
- First default section after: The New Accelerator (5453 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The New Accelerator (5453 words)

Supporting snippets:

- Title: THE NEW ACCELERATOR
- Author: Author: H. G. Wells
- Start: Certainly, if ever a man found a guinea when he was looking for a pin it is my good friend Professor Gibberne. I have heard before of investigators overshooting the mark, but never quite to the extent that he has done. He has really, this time at any rate, wit
- End: ver, discussed this aspect of the question very thoroughly, and we have decided that this is purely a matter of medical jurisprudence and altogether outside our province. We shall manufacture and sell the Accelerator, and, as for the consequences—we shall see.

## Future-batch rule

- valid generated readable content
- correct generated title
- correct author/compiler/collector/translator metadata or documented unresolved-author policy
- no duplicate generated work under a slightly different slug unless intentionally documented
- first default section from real readable content
- all main readable sections included by default
- meaningful source-based segmentation
- valid book-specific startup preview
- no SOS Help!
- no generic preview fallback
- no title/TOC/source/license/contributor/transcriber/byline/parent-collection material as default playback
- no real prose removed by cleanup
- selected/default source order begins from the first selected/default section

## Backlog note

Dry-run 20 still had 96 skipped/unsafe raw-only candidates before write.
These are not treated as lost or missed.
After safe batching slows/exhausts, create a dedicated remaining raw inventory/triage report classifying every unprocessed raw file.

## Later-phase requirements

- after all books are processed, run an independent second-pass audit using a different strategy
- after books and second-pass audit, add original non-spoiler 300-500+ word SEO summaries for each accepted book page
- after summaries, perform full site SEO/meta review using GSC data and route-level intent
- after books/SEO, run a focused rage-click UX pass for /audio, /practice, homepage, and related utility pages
- investigate the SSR heap OOM separately if it keeps appearing during plain npm run build
- final cleanup should remove temporary audit scripts/reports and code bloat only after everything is stable
