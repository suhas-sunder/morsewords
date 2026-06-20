# Pilot write batch 18

Controlled first-time processing pass for the exact raw-only books selected by pilot dry-run batch 18.

## Totals

- Selected: 20
- First-time processed: 20
- Skipped: 0
- Unresolved-source generated left untouched: 11

## Accepted Exclusion Count Clarification

- Dry-run accepted/corrected/verified exclusion count: 345
- Known duplicate/manual/boundary exclusions left unprocessed: the-wind-in-the-willows, the-two-magics-the-turn-of-the-screw-covering-end, japanese-fairy-tales, the-works-of-edgar-allan-poe, snow-white-and-rose-red
- Selected books intersecting accepted exclusions: none
- Note: This write pass uses only the exact selected list from pilot-dry-run-18.json. Known duplicate/manual/boundary exclusions and unresolved-source generated books remain untouched.

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

### virgilius-the-sorcerer

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/VIRGILIUS THE SORCERER.txt
- Expected/generated title: Virgilius the Sorcerer / Virgilius the Sorcerer
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/virgilius-the-sorcerer/manifest.json, app/client/assets/books/generated/virgilius-the-sorcerer/cleaned_book.json, app/client/assets/books/generated/virgilius-the-sorcerer/processed_book.json, app/client/assets/books/generated/virgilius-the-sorcerer/rights_report.json, app/client/assets/books/generated/virgilius-the-sorcerer/processing_notes.md, app/client/assets/books/generated/virgilius-the-sorcerer/sections/chapter-001.json
- Preview asset changed: public/book-previews/virgilius-the-sorcerer.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: Long, long ago there was born to a Roman knight and his wife Maja a; write pass starts at first selected/default section
- End boundary: cleaned line 323 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 17167 / 17167
- First default section after: Virgilius the Sorcerer (3196 words)
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

- chapter-001: Virgilius the Sorcerer (3196 words)

Supporting snippets:

- Title: VIRGILIUS THE SORCERER
- Author: Author: Andrew Lang
- Start: Long, long ago there was born to a Roman knight and his wife Maja a little boy called Virgilius. While he was still quite little, his father died, and the kinsmen, instead of being a help and protection to the child and his mother, robbed them of their lands a
- End: hained an apple, which hangs there to this day. And when the egg shakes the city quakes, and when the egg shall be broken the city shall be destroyed. And the city Virgilius filled full of wonders, such as never were seen before, and he called its name Naples.

### the-fairy-of-the-dawn

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE FAIRY OF THE DAWN.txt
- Expected/generated title: The Fairy of the Dawn / The Fairy of the Dawn
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-fairy-of-the-dawn/manifest.json, app/client/assets/books/generated/the-fairy-of-the-dawn/cleaned_book.json, app/client/assets/books/generated/the-fairy-of-the-dawn/processed_book.json, app/client/assets/books/generated/the-fairy-of-the-dawn/rights_report.json, app/client/assets/books/generated/the-fairy-of-the-dawn/processing_notes.md, app/client/assets/books/generated/the-fairy-of-the-dawn/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-fairy-of-the-dawn.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: Once upon a time what should happen DID happen; and if it had not; write pass starts at first selected/default section
- End boundary: cleaned line 1015 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 45135 / 45135
- First default section after: The Fairy of the Dawn (8735 words)
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

- chapter-001: The Fairy of the Dawn (8735 words)

Supporting snippets:

- Title: THE FAIRY OF THE DAWN
- Author: Author: Andrew Lang
- Start: Once upon a time what should happen DID happen; and if it had not happened this tale would never have been told. There was once an emperor, very great and mighty, and he ruled over an empire so large that no one knew where it began and where it ended. But if
- End: t is a good thing you have us with you, to protect you from harm.’ The horse neighed, and Petru knew what it meant, and did not go with his brothers. No, he went home to his father, and cured his blindness; and as for his brothers, they never returned again.

### the-brownie-of-the-lake

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Brownie of the Lake.txt
- Expected/generated title: The Brownie of the Lake / The Brownie of the Lake
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-brownie-of-the-lake/manifest.json, app/client/assets/books/generated/the-brownie-of-the-lake/cleaned_book.json, app/client/assets/books/generated/the-brownie-of-the-lake/processed_book.json, app/client/assets/books/generated/the-brownie-of-the-lake/rights_report.json, app/client/assets/books/generated/the-brownie-of-the-lake/processing_notes.md, app/client/assets/books/generated/the-brownie-of-the-lake/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-brownie-of-the-lake.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: Once upon a time there lived in France a man whose name was Jalm Riou.; write pass starts at first selected/default section
- End boundary: cleaned line 252 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 13261 / 13261
- First default section after: The Brownie of the Lake (2556 words)
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

- chapter-001: The Brownie of the Lake (2556 words)

Supporting snippets:

- Title: The Brownie of the Lake
- Author: Author: Andrew Lang
- Start: Once upon a time there lived in France a man whose name was Jalm Riou. You might have walked a whole day without meeting anyone happier or more contented, for he had a large farm, plenty of money, and above all, a daughter called Barbaik, the most graceful dan
- End: Now we hurry from your hall-- Bad luck light upon you all. That evening they left the country for ever, and Jegu, without their help, grew poorer and poorer, and at last died of misery, while Barbaik was glad to find work in the market of Morlaix.

### the-girl-who-pretended-to-be-a-boy

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE GIRL WHO PRETENDED TO BE A BOY.txt
- Expected/generated title: The Girl Who Pretended to Be a Boy / The Girl Who Pretended to Be a Boy
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-girl-who-pretended-to-be-a-boy/manifest.json, app/client/assets/books/generated/the-girl-who-pretended-to-be-a-boy/cleaned_book.json, app/client/assets/books/generated/the-girl-who-pretended-to-be-a-boy/processed_book.json, app/client/assets/books/generated/the-girl-who-pretended-to-be-a-boy/rights_report.json, app/client/assets/books/generated/the-girl-who-pretended-to-be-a-boy/processing_notes.md, app/client/assets/books/generated/the-girl-who-pretended-to-be-a-boy/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-girl-who-pretended-to-be-a-boy.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: Once upon a time there lived an emperor who was a great conqueror, and; write pass starts at first selected/default section
- End boundary: cleaned line 758 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 38875 / 38875
- First default section after: The Girl Who Pretended to Be a Boy (7390 words)
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

- chapter-001: The Girl Who Pretended to Be a Boy (7390 words)

Supporting snippets:

- Title: THE GIRL WHO PRETENDED TO BE A BOY
- Author: Author: Andrew Lang
- Start: Once upon a time there lived an emperor who was a great conqueror, and reigned over more countries than anyone in the world. And whenever he subdued a fresh kingdom, he only granted peace on condition that the king should deliver him one of his sons for ten ye
- End: you who brought me the holy water. And you, and none other, shall be my husband.’ ‘Yes, I will marry you,’ said the young man, with a voice almost as soft as when he was a princess. ‘But know that in OUR house, it will be the cock who sings and not the hen!’

### the-lady-of-the-fountain

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Lady of the Fountain.txt
- Expected/generated title: The Lady of the Fountain / The Lady of the Fountain
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-lady-of-the-fountain/manifest.json, app/client/assets/books/generated/the-lady-of-the-fountain/cleaned_book.json, app/client/assets/books/generated/the-lady-of-the-fountain/processed_book.json, app/client/assets/books/generated/the-lady-of-the-fountain/rights_report.json, app/client/assets/books/generated/the-lady-of-the-fountain/processing_notes.md, app/client/assets/books/generated/the-lady-of-the-fountain/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-lady-of-the-fountain.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: In the centre of the great hall in the castle of Caerleon upon Usk, king; write pass starts at first selected/default section
- End boundary: cleaned line 578 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 28644 / 28644
- First default section after: The Lady of the Fountain (5612 words)
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

- chapter-001: The Lady of the Fountain (5612 words)

Supporting snippets:

- Title: The Lady of the Fountain
- Author: Author: Andrew Lang
- Start: In the centre of the great hall in the castle of Caerleon upon Usk, king Arthur sat on a seat of green rushes, over which was thrown a covering of flame-coloured silk, and a cushion of red satin lay under his elbow. With him were his knights Owen and Kynon and
- End: e stones, and sprang upon the youths and slew them. And so Luned was delivered at the last. Then the maiden rode back with Owen to the lands of the lady of the fountain. And he took the lady with him to Arthur’s court, where they lived happily till they died.

### a-tale-of-the-tontlawald

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/A TALE OF THE TONTLAWALD.txt
- Expected/generated title: A Tale of the Tontlawald / A Tale of the Tontlawald
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/a-tale-of-the-tontlawald/manifest.json, app/client/assets/books/generated/a-tale-of-the-tontlawald/cleaned_book.json, app/client/assets/books/generated/a-tale-of-the-tontlawald/processed_book.json, app/client/assets/books/generated/a-tale-of-the-tontlawald/rights_report.json, app/client/assets/books/generated/a-tale-of-the-tontlawald/processing_notes.md, app/client/assets/books/generated/a-tale-of-the-tontlawald/sections/chapter-001.json
- Preview asset changed: public/book-previews/a-tale-of-the-tontlawald.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: Long, long ago there stood in the midst of a country covered with lakes; write pass starts at first selected/default section
- End boundary: cleaned line 408 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 22396 / 22396
- First default section after: A Tale of the Tontlawald (4343 words)
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

- chapter-001: A Tale of the Tontlawald (4343 words)

Supporting snippets:

- Title: A TALE OF THE TONTLAWALD
- Author: Author: Andrew Lang
- Start: Long, long ago there stood in the midst of a country covered with lakes a vast stretch of moorland called the Tontlawald, on which no man ever dared set foot. From time to time a few bold spirits had been drawn by curiosity to its borders, and on their return
- End: pon her hair fifty carts arrived laden with beautiful things which the lady of the Tontlawald had sent to Elsa. And after the king’s death Elsa became queen, and when she was old she told this story. But that was the last that was ever heard of the Tontlawald.

### how-a-fish-swam-in-the-air-and-a-hare-in-the-water

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/HOW A FISH SWAM IN THE AIR AND A HARE IN THE WATER.txt
- Expected/generated title: How a Fish Swam in the Air and a Hare in the Water / How a Fish Swam in the Air and a Hare in the Water
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/how-a-fish-swam-in-the-air-and-a-hare-in-the-water/manifest.json, app/client/assets/books/generated/how-a-fish-swam-in-the-air-and-a-hare-in-the-water/cleaned_book.json, app/client/assets/books/generated/how-a-fish-swam-in-the-air-and-a-hare-in-the-water/processed_book.json, app/client/assets/books/generated/how-a-fish-swam-in-the-air-and-a-hare-in-the-water/rights_report.json, app/client/assets/books/generated/how-a-fish-swam-in-the-air-and-a-hare-in-the-water/processing_notes.md, app/client/assets/books/generated/how-a-fish-swam-in-the-air-and-a-hare-in-the-water/sections/chapter-001.json
- Preview asset changed: public/book-previews/how-a-fish-swam-in-the-air-and-a-hare-in-the-water.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: Once upon a time an old man and his wife lived together in a little; write pass starts at first selected/default section
- End boundary: cleaned line 192 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 7224 / 7224
- First default section after: How a Fish Swam in the Air and a Hare in the Water (1416 words)
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

- chapter-001: How a Fish Swam in the Air and a Hare in the Water (1416 words)

Supporting snippets:

- Title: HOW A FISH SWAM IN THE AIR AND A HARE IN THE WATER
- Author: Author: Andrew Lang
- Start: Once upon a time an old man and his wife lived together in a little village. They might have been happy if only the old woman had had the sense to hold her tongue at proper times. But anything which might happen indoors, or any bit of news which her husband mi
- End: e town. The old woman was so laughed at that she had to hold her tongue and obey her husband ever after, and the man bought wares with part of the treasure and moved into the town, where he opened a shop, and prospered, and spent the rest of his days in peace.

### jesper-who-herded-the-hares

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/JESPER WHO HERDED THE HARES.txt
- Expected/generated title: Jesper Who Herded the Hares / Jesper Who Herded the Hares
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/jesper-who-herded-the-hares/manifest.json, app/client/assets/books/generated/jesper-who-herded-the-hares/cleaned_book.json, app/client/assets/books/generated/jesper-who-herded-the-hares/processed_book.json, app/client/assets/books/generated/jesper-who-herded-the-hares/rights_report.json, app/client/assets/books/generated/jesper-who-herded-the-hares/processing_notes.md, app/client/assets/books/generated/jesper-who-herded-the-hares/sections/chapter-001.json
- Preview asset changed: public/book-previews/jesper-who-herded-the-hares.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: There was once a king who ruled over a kingdom somewhere between sunrise; write pass starts at first selected/default section
- End boundary: cleaned line 386 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 18906 / 18906
- First default section after: Jesper Who Herded the Hares (3669 words)
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

- chapter-001: Jesper Who Herded the Hares (3669 words)

Supporting snippets:

- Title: JESPER WHO HERDED THE HARES
- Author: Author: Andrew Lang
- Start: There was once a king who ruled over a kingdom somewhere between sunrise and sunset. It was as small as kingdoms usually were in old times, and when the king went up to the roof of his palace and took a look round he could see to the ends of it in every direct
- End: she had quite fallen in love with him, because he was so handsome and so clever. When the old king got time to think over it, he was quite convinced that his kingdom would be safe in Jesper’s hands if he looked after the people as well as he herded the hares.

### mogarzea-and-his-son

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/MOGARZEA AND HIS SON.txt
- Expected/generated title: Mogarzea and His Son / Mogarzea and His Son
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/mogarzea-and-his-son/manifest.json, app/client/assets/books/generated/mogarzea-and-his-son/cleaned_book.json, app/client/assets/books/generated/mogarzea-and-his-son/processed_book.json, app/client/assets/books/generated/mogarzea-and-his-son/rights_report.json, app/client/assets/books/generated/mogarzea-and-his-son/processing_notes.md, app/client/assets/books/generated/mogarzea-and-his-son/sections/chapter-001.json
- Preview asset changed: public/book-previews/mogarzea-and-his-son.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: There was once a little boy, whose father and mother, when they were; write pass starts at first selected/default section
- End boundary: cleaned line 199 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 9542 / 9542
- First default section after: Mogarzea and His Son (1875 words)
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

- chapter-001: Mogarzea and His Son (1875 words)

Supporting snippets:

- Title: MOGARZEA AND HIS SON
- Author: Author: Andrew Lang
- Start: There was once a little boy, whose father and mother, when they were dying, left him to the care of a guardian. But the guardian whom they chose turned out to be a wicked man, and spent all the money, so the boy determined to go away and strike out a path for
- End: to marry him, as he wished. And they went together to the palace, where Mogarzea was still waiting for him, and the marriage was celebrated by the emperor himself. But every May they returned to the Milk Lake, they and their children, and bathed in its waters.

### schippeitaro

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/SCHIPPEITARO.txt
- Expected/generated title: Schippeitaro / Schippeitaro
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/schippeitaro/manifest.json, app/client/assets/books/generated/schippeitaro/cleaned_book.json, app/client/assets/books/generated/schippeitaro/processed_book.json, app/client/assets/books/generated/schippeitaro/rights_report.json, app/client/assets/books/generated/schippeitaro/processing_notes.md, app/client/assets/books/generated/schippeitaro/sections/chapter-001.json
- Preview asset changed: public/book-previews/schippeitaro.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: It was the custom in old times that as soon as a Japanese boy reached; write pass starts at first selected/default section
- End boundary: cleaned line 105 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 5970 / 5970
- First default section after: Schippeitaro (1135 words)
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

- chapter-001: Schippeitaro (1135 words)

Supporting snippets:

- Title: SCHIPPEITARO
- Author: Author: Andrew Lang
- Start: It was the custom in old times that as soon as a Japanese boy reached manhood he should leave his home and roam through the land in search of adventures. Sometimes he would meet with a young man bent on the same business as himself, and then they would fight i
- End: between them killed several more before they thought of escaping. At sunrise the brave dog was taken back to his master, and from that time the mountain girls were safe, and every year a feast was held in memory of the young warrior and the dog Schippeitaro.

### stan-bolovan

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/STAN BOLOVAN.txt
- Expected/generated title: Stan Bolovan / Stan Bolovan
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/stan-bolovan/manifest.json, app/client/assets/books/generated/stan-bolovan/cleaned_book.json, app/client/assets/books/generated/stan-bolovan/processed_book.json, app/client/assets/books/generated/stan-bolovan/rights_report.json, app/client/assets/books/generated/stan-bolovan/processing_notes.md, app/client/assets/books/generated/stan-bolovan/sections/chapter-001.json
- Preview asset changed: public/book-previews/stan-bolovan.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: Once upon a time what happened did happen, and if it had not happened; write pass starts at first selected/default section
- End boundary: cleaned line 425 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 18812 / 18812
- First default section after: Stan Bolovan (3686 words)
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

- chapter-001: Stan Bolovan (3686 words)

Supporting snippets:

- Title: STAN BOLOVAN
- Author: Author: Andrew Lang
- Start: Once upon a time what happened did happen, and if it had not happened this story would never have been told. On the outskirts of a village just where the oxen were turned out to pasture, and the pigs roamed about burrowing with their noses among the roots of
- End: agon’s flesh.’ At this dreadful sight the dragon waited no longer: he flung down his sacks where he stood and took flight as fast as he could, so terrified at the fate that awaited him that from that day he has never dared to show his face in the world again.

### the-battle-of-the-birds

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Battle of the Birds.txt
- Expected/generated title: The Battle of the Birds / The Battle of the Birds
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-battle-of-the-birds/manifest.json, app/client/assets/books/generated/the-battle-of-the-birds/cleaned_book.json, app/client/assets/books/generated/the-battle-of-the-birds/processed_book.json, app/client/assets/books/generated/the-battle-of-the-birds/rights_report.json, app/client/assets/books/generated/the-battle-of-the-birds/processing_notes.md, app/client/assets/books/generated/the-battle-of-the-birds/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-battle-of-the-birds.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: There was to be a great battle between all the creatures of the earth; write pass starts at first selected/default section
- End boundary: cleaned line 481 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 22148 / 22148
- First default section after: The Battle of the Birds (4392 words)
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

- chapter-001: The Battle of the Birds (4392 words)

Supporting snippets:

- Title: The Battle of the Birds
- Author: Author: Andrew Lang
- Start: There was to be a great battle between all the creatures of the earth and the birds of the air. News of it went abroad, and the son of the king of Tethertown said that when the battle was fought he would be there to see it, and would bring back word who was to
- End: had come to remind him of what he had forgotten, and his lost memory came back, and he knew his wife, and kissed her. But as the preparations had been made, it seemed a pity to waste them, so they were married a second time, and sat down to the wedding feast.

### the-believing-husbands

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Believing Husbands.txt
- Expected/generated title: The Believing Husbands / The Believing Husbands
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-believing-husbands/manifest.json, app/client/assets/books/generated/the-believing-husbands/cleaned_book.json, app/client/assets/books/generated/the-believing-husbands/processed_book.json, app/client/assets/books/generated/the-believing-husbands/rights_report.json, app/client/assets/books/generated/the-believing-husbands/processing_notes.md, app/client/assets/books/generated/the-believing-husbands/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-believing-husbands.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: Once upon a time there dwelt in the land of Erin a young man who was; write pass starts at first selected/default section
- End boundary: cleaned line 159 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 5650 / 5650
- First default section after: The Believing Husbands (1113 words)
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

- chapter-001: The Believing Husbands (1113 words)

Supporting snippets:

- Title: The Believing Husbands
- Author: Author: Andrew Lang
- Start: Once upon a time there dwelt in the land of Erin a young man who was seeking a wife, and of all the maidens round about none pleased him as well as the only daughter of a farmer. The girl was willing and the father was willing, and very soon they were married
- End: said the man in the coffin. But at the sound of his voice the two men were so terrified that they ran straight home, and the man in the coffin got up and followed them, and it was his wife that gained the gold ring, as he had been sillier than the other two.

### the-bones-of-djulung

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Bones of Djulung.txt
- Expected/generated title: The Bones of Djulung / The Bones of Djulung
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-bones-of-djulung/manifest.json, app/client/assets/books/generated/the-bones-of-djulung/cleaned_book.json, app/client/assets/books/generated/the-bones-of-djulung/processed_book.json, app/client/assets/books/generated/the-bones-of-djulung/rights_report.json, app/client/assets/books/generated/the-bones-of-djulung/processing_notes.md, app/client/assets/books/generated/the-bones-of-djulung/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-bones-of-djulung.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: In a beautiful island that lies in the southern seas, where chains of; write pass starts at first selected/default section
- End boundary: cleaned line 148 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 7926 / 7926
- First default section after: The Bones of Djulung (1554 words)
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

- chapter-001: The Bones of Djulung (1554 words)

Supporting snippets:

- Title: The Bones of Djulung
- Author: Author: Andrew Lang
- Start: In a beautiful island that lies in the southern seas, where chains of gay orchids bind the trees together, and the days and nights are equally long and nearly equally hot, there once lived a family of seven sisters. Their father and mother were dead, and they
- End: leaves and flowers and gave them to the king. ‘The maiden who can work such wonders is fitted to be the wife of the greatest chief,’ he said, and so he married her, and took her with him across the sea to his own home, where they lived happily for ever after.

### the-boys-with-the-golden-stars

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE BOYS WITH THE GOLDEN STARS.txt
- Expected/generated title: The Boys with the Golden Stars / The Boys with the Golden Stars
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-boys-with-the-golden-stars/manifest.json, app/client/assets/books/generated/the-boys-with-the-golden-stars/cleaned_book.json, app/client/assets/books/generated/the-boys-with-the-golden-stars/processed_book.json, app/client/assets/books/generated/the-boys-with-the-golden-stars/rights_report.json, app/client/assets/books/generated/the-boys-with-the-golden-stars/processing_notes.md, app/client/assets/books/generated/the-boys-with-the-golden-stars/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-boys-with-the-golden-stars.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: Once upon a time what happened did happen: and if it had not happened,; write pass starts at first selected/default section
- End boundary: cleaned line 330 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 14810 / 14810
- First default section after: The Boys with the Golden Stars (2810 words)
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

- chapter-001: The Boys with the Golden Stars (2810 words)

Supporting snippets:

- Title: THE BOYS WITH THE GOLDEN STARS
- Author: Author: Andrew Lang
- Start: Once upon a time what happened did happen: and if it had not happened, you would never have heard this story. Well, once upon a time there lived an emperor who had half a world all to himself to rule over, and in this world dwelt an old herd and his wife and
- End: her husband at the top of the table. The stepmother’s daughter became the meanest sewing maid in the palace, the stepmother was tied to a wild horse, and every one knew and has never forgotten that whoever has a mind turned to wickedness is sure to end badly.

### the-castle-of-kerglas

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Castle of Kerglas.txt
- Expected/generated title: The Castle of Kerglas / The Castle of Kerglas
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-castle-of-kerglas/manifest.json, app/client/assets/books/generated/the-castle-of-kerglas/cleaned_book.json, app/client/assets/books/generated/the-castle-of-kerglas/processed_book.json, app/client/assets/books/generated/the-castle-of-kerglas/rights_report.json, app/client/assets/books/generated/the-castle-of-kerglas/processing_notes.md, app/client/assets/books/generated/the-castle-of-kerglas/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-castle-of-kerglas.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: Peronnik was a poor idiot who belonged to nobody, and he would have died; write pass starts at first selected/default section
- End boundary: cleaned line 482 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 24276 / 24276
- First default section after: The Castle of Kerglas (4650 words)
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

- chapter-001: The Castle of Kerglas (4650 words)

Supporting snippets:

- Title: The Castle of Kerglas
- Author: Author: Andrew Lang
- Start: Peronnik was a poor idiot who belonged to nobody, and he would have died of starvation if it had not been for the kindness of the village people, who gave him food whenever he chose to ask for it. And as for a bed, when night came, and he grew sleepy, he looke
- End: and fulfilled his promise of delivering his country. As to the bowl and the lance, no one knows what became of them, but some say that Bryak the sorcerer managed to steal them again, and that any one who wishes to possess them must seek them as Peronnik did.

### the-enchanted-deer

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Enchanted Deer.txt
- Expected/generated title: The Enchanted Deer / The Enchanted Deer
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-enchanted-deer/manifest.json, app/client/assets/books/generated/the-enchanted-deer/cleaned_book.json, app/client/assets/books/generated/the-enchanted-deer/processed_book.json, app/client/assets/books/generated/the-enchanted-deer/rights_report.json, app/client/assets/books/generated/the-enchanted-deer/processing_notes.md, app/client/assets/books/generated/the-enchanted-deer/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-enchanted-deer.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: A young man was out walking one day in Erin, leading a stout cart-horse; write pass starts at first selected/default section
- End boundary: cleaned line 310 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 15681 / 15681
- First default section after: The Enchanted Deer (3130 words)
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

- chapter-001: The Enchanted Deer (3130 words)

Supporting snippets:

- Title: The Enchanted Deer
- Author: Author: Andrew Lang
- Start: A young man was out walking one day in Erin, leading a stout cart-horse by the bridle. He was thinking of his mother and how poor they were since his father, who was a fisherman, had been drowned at sea, and wondering what he should do to earn a living for bot
- End: ut his trust in me, and had his head cut off three times. Because he has done this, I will marry him rather than one of you, who have come hither to wed me, for many kings here sought to free me from the spells, but none could do it save Ian the fisher’s son.’

### the-enchanted-knife

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE ENCHANTED KNIFE.txt
- Expected/generated title: The Enchanted Knife / The Enchanted Knife
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-enchanted-knife/manifest.json, app/client/assets/books/generated/the-enchanted-knife/cleaned_book.json, app/client/assets/books/generated/the-enchanted-knife/processed_book.json, app/client/assets/books/generated/the-enchanted-knife/rights_report.json, app/client/assets/books/generated/the-enchanted-knife/processing_notes.md, app/client/assets/books/generated/the-enchanted-knife/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-enchanted-knife.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: Once upon a time there lived a young man who vowed that he would never; write pass starts at first selected/default section
- End boundary: cleaned line 80 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 4452 / 4452
- First default section after: The Enchanted Knife (866 words)
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

- chapter-001: The Enchanted Knife (866 words)

Supporting snippets:

- Title: THE ENCHANTED KNIFE
- Author: Author: Andrew Lang
- Start: Once upon a time there lived a young man who vowed that he would never marry any girl who had not royal blood in her veins. One day he plucked up all his courage and went to the palace to ask the emperor for his daughter. The emperor was not much pleased at th
- End: y was over. Then he asked his newly made son-in-law what dowry he would require with his bride. To which the bridegroom made answer, ‘Noble emperor! all I desire is that I may have your daughter for my wife, and enjoy for ever the use of your enchanted knife.’

### the-envious-neighbour

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE ENVIOUS NEIGHBOUR.txt
- Expected/generated title: The Envious Neighbour / The Envious Neighbour
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-envious-neighbour/manifest.json, app/client/assets/books/generated/the-envious-neighbour/cleaned_book.json, app/client/assets/books/generated/the-envious-neighbour/processed_book.json, app/client/assets/books/generated/the-envious-neighbour/rights_report.json, app/client/assets/books/generated/the-envious-neighbour/processing_notes.md, app/client/assets/books/generated/the-envious-neighbour/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-envious-neighbour.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: Long, long ago an old couple lived in a village, and, as they had no; write pass starts at first selected/default section
- End boundary: cleaned line 150 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 8703 / 8703
- First default section after: The Envious Neighbour (1711 words)
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

- chapter-001: The Envious Neighbour (1711 words)

Supporting snippets:

- Title: THE ENVIOUS NEIGHBOUR
- Author: Author: Andrew Lang
- Start: Long, long ago an old couple lived in a village, and, as they had no children to love and care for, they gave all their affection to a little dog. He was a pretty little creature, and instead of growing spoilt and disagreeable at not getting everything he want
- End: or many months. By the time he was set free everybody in his native village had found out his wickedness, and they would not let him live there any longer; and as he would not leave off his evil ways he soon went from bad to worse, and came to a miserable end.

### the-false-prince-and-the-true

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The False Prince and the True.txt
- Expected/generated title: The False Prince and the True / The False Prince and the True
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-false-prince-and-the-true/manifest.json, app/client/assets/books/generated/the-false-prince-and-the-true/cleaned_book.json, app/client/assets/books/generated/the-false-prince-and-the-true/processed_book.json, app/client/assets/books/generated/the-false-prince-and-the-true/rights_report.json, app/client/assets/books/generated/the-false-prince-and-the-true/processing_notes.md, app/client/assets/books/generated/the-false-prince-and-the-true/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-false-prince-and-the-true.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: The king had just awakened from his midday sleep, for it was summer, and; write pass starts at first selected/default section
- End boundary: cleaned line 265 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 14339 / 14339
- First default section after: The False Prince and the True (2789 words)
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

- chapter-001: The False Prince and the True (2789 words)

Supporting snippets:

- Title: The False Prince and the True
- Author: Author: Andrew Lang
- Start: The king had just awakened from his midday sleep, for it was summer, and everyone rose early and rested from twelve to three, as they do in hot countries. He had dressed himself in cool white clothes, and was passing through the hall on his way to the council
- End: offer to save you if you would consent to marry me. ‘That is my history, and now you must beg the king to send messengers at once to Granada, to inform my father of our marriage, and I think,’ she added with a smile, ‘that he will not refuse us his blessing.’

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

## Later-phase requirements

- after all books are processed, run an independent second-pass audit using a different strategy
- after books and second-pass audit, add original non-spoiler 300-500+ word SEO summaries for each accepted book page
- after summaries, perform full site SEO/meta review using GSC data and route-level intent
- after books/SEO, run a focused rage-click UX pass for /audio, /practice, homepage, and related utility pages
- investigate the SSR heap OOM separately if it keeps appearing during plain npm run build
- final cleanup should remove temporary audit scripts/reports and code bloat only after everything is stable
