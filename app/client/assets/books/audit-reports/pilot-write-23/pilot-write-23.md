# Pilot write batch 23

Controlled first-time processing pass for the exact raw-only books selected by pilot dry-run batch 23.

## Totals

- Selected: 10
- First-time processed: 10
- Skipped: 0
- Unresolved-source generated left untouched: 11

## Accepted Exclusion Count Clarification

- Dry-run accepted/corrected/verified exclusion count: 445
- Known duplicate/manual/boundary exclusions left unprocessed: the-wind-in-the-willows, the-two-magics-the-turn-of-the-screw-covering-end, japanese-fairy-tales, the-works-of-edgar-allan-poe, snow-white-and-rose-red
- Selected books intersecting accepted exclusions: none
- Note: This write pass uses only the exact selected list from pilot-dry-run-23.json. Known duplicate/manual/boundary exclusions and unresolved-source generated books remain untouched.

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

### in-the-modern-vein

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/IN THE MODERN VEIN.txt
- Expected/generated title: In the Modern Vein / In the Modern Vein
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: visible title-page author line - H. G. WELLS
- Metadata evidence: visible title-page author line - H. G. WELLS
- Generated files changed: app/client/assets/books/generated/in-the-modern-vein/manifest.json, app/client/assets/books/generated/in-the-modern-vein/cleaned_book.json, app/client/assets/books/generated/in-the-modern-vein/processed_book.json, app/client/assets/books/generated/in-the-modern-vein/rights_report.json, app/client/assets/books/generated/in-the-modern-vein/processing_notes.md, app/client/assets/books/generated/in-the-modern-vein/sections/chapter-001.json
- Preview asset changed: public/book-previews/in-the-modern-vein.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 17 - start at first readable prose after source/title/byline wrapper: Of course the cultivated reader has heard of Aubrey Vair.; write pass starts at first selected/default section
- End boundary: cleaned line 223 - end before Project Gutenberg or source-site footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 20310 / 20310
- First default section after: In the Modern Vein (3595 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from visible title-page author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg start marker; body text was not destructively stripped.; Missing Project Gutenberg end marker; footer text was not destructively stripped.; TOC/body confusion is likely; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: author did not come from a Gutenberg Author line; verify byline directly; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: In the Modern Vein (3595 words)

Supporting snippets:

- Title: IN THE MODERN VEIN
- Author: H. G. WELLS
- Start: Of course the cultivated reader has heard of Aubrey Vair. He has published on three several occasions volumes of delicate verses,—some, indeed, border on indelicacy,—and his column Of Things Literary in the Climax is well known. His Byronic visage and an int
- End: ”—he remarked, after a pause during which he was struggling with recollection. “Yes. These potatoes have exactly the tints of the dead leaves of the hazel.” “What a fanciful poet it is!” said Mrs. Aubrey Vair. “Taste them. They are very nice potatoes indeed.”

### the-argonauts-of-the-air

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE ARGONAUTS OF THE AIR.txt
- Expected/generated title: The Argonauts of the Air / The Argonauts of the Air
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: visible title-page author line - H. G. WELLS
- Metadata evidence: visible title-page author line - H. G. WELLS
- Generated files changed: app/client/assets/books/generated/the-argonauts-of-the-air/manifest.json, app/client/assets/books/generated/the-argonauts-of-the-air/cleaned_book.json, app/client/assets/books/generated/the-argonauts-of-the-air/processed_book.json, app/client/assets/books/generated/the-argonauts-of-the-air/rights_report.json, app/client/assets/books/generated/the-argonauts-of-the-air/processing_notes.md, app/client/assets/books/generated/the-argonauts-of-the-air/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-argonauts-of-the-air.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 16 - start at first readable prose after source/title/byline wrapper: One saw Monson’s Flying Machine from the windows of the trains passing; write pass starts at first selected/default section
- End boundary: cleaned line 164 - end before Project Gutenberg or source-site footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 26023 / 26023
- First default section after: The Argonauts of the Air (4504 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from visible title-page author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg start marker; body text was not destructively stripped.; Missing Project Gutenberg end marker; footer text was not destructively stripped.; TOC/body confusion is likely; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: author did not come from a Gutenberg Author line; verify byline directly; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Argonauts of the Air (4504 words)

Supporting snippets:

- Title: THE ARGONAUTS OF THE AIR
- Author: H. G. WELLS
- Start: One saw Monson s Flying Machine from the windows of the trains passing either along the South-Western main line or along the line between Wimbledon and Worcester Park,—to be more exact, one saw the huge scaffoldings which limited the flight of the apparatus. T
- End: ter master this great problem of flying. And between Worcester Park and Malden there still stands that portentous avenue of iron-work, rusting now, and dangerous here and there, to witness to the first desperate struggle for man’s right of way through the air.

### the-dreams-in-the-witch-house

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Dreams in the Witch-House.txt
- Expected/generated title: The Dreams in the Witch-House / The Dreams in the Witch-House
- Expected/generated author: H. P. Lovecraft / H. P. Lovecraft
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Faded Page Author metadata line - _Author:_ Howard Phillips Lovecraft (1890-1937)
- Metadata evidence: Faded Page Author metadata line - _Author:_ Howard Phillips Lovecraft (1890-1937)
- Generated files changed: app/client/assets/books/generated/the-dreams-in-the-witch-house/manifest.json, app/client/assets/books/generated/the-dreams-in-the-witch-house/cleaned_book.json, app/client/assets/books/generated/the-dreams-in-the-witch-house/processed_book.json, app/client/assets/books/generated/the-dreams-in-the-witch-house/rights_report.json, app/client/assets/books/generated/the-dreams-in-the-witch-house/processing_notes.md, app/client/assets/books/generated/the-dreams-in-the-witch-house/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-dreams-in-the-witch-house.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 36 - start at first readable prose after source/title/byline wrapper: Whether the dreams brought on the fever or the; write pass starts at first selected/default section
- End boundary: cleaned line 1475 - end before Project Gutenberg or source-site footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 67045 / 67045
- First default section after: The Dreams in the Witch-House (11527 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Faded Page Author metadata line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg start marker; body text was not destructively stripped.; Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: author did not come from a Gutenberg Author line; verify byline directly; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Dreams in the Witch-House (11527 words)

Supporting snippets:

- Title: The Dreams in the Witch-House
- Author: _Author:_ Howard Phillips Lovecraft (1890-1937)
- Start: Whether the dreams brought on the fever or the fever brought on the dreams Walter Gilman did not know. Behind everything crouched the brooding, festering horror of the ancient town, and of the moldy, unhallowed garret gable where he wrote and studied and wrest
- End: goat? He saw that Elwood had dropped asleep, and tried to call out and waken him. Something, however, closed his throat. He was not his own master. Had he signed the black man’s book after all? Then his fevered, abnormal hearing caught the distant, wind-borne

### the-jilting-of-jane

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE JILTING OF JANE.txt
- Expected/generated title: The Jilting of Jane / The Jilting of Jane
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: visible title-page author line - H. G. WELLS
- Metadata evidence: visible title-page author line - H. G. WELLS
- Generated files changed: app/client/assets/books/generated/the-jilting-of-jane/manifest.json, app/client/assets/books/generated/the-jilting-of-jane/cleaned_book.json, app/client/assets/books/generated/the-jilting-of-jane/processed_book.json, app/client/assets/books/generated/the-jilting-of-jane/rights_report.json, app/client/assets/books/generated/the-jilting-of-jane/processing_notes.md, app/client/assets/books/generated/the-jilting-of-jane/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-jilting-of-jane.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 16 - start at first readable prose after source/title/byline wrapper: As I sit writing in my study, I can hear our Jane bumping; write pass starts at first selected/default section
- End boundary: cleaned line 142 - end before Project Gutenberg or source-site footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 14323 / 14323
- First default section after: The Jilting of Jane (2697 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from visible title-page author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg start marker; body text was not destructively stripped.; Missing Project Gutenberg end marker; footer text was not destructively stripped.; TOC/body confusion is likely; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: author did not come from a Gutenberg Author line; verify byline directly; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Jilting of Jane (2697 words)

Supporting snippets:

- Title: THE JILTING OF JANE
- Author: H. G. WELLS
- Start: As I sit writing in my study, I can hear our Jane bumping her way downstairs with a brush and dustpan. She used in the old days to sing hymn tunes, or the British national song for the time being, to these instruments, but latterly she has been silent and even
- End: hing passed the other day with the butcher-boy—but that scarcely belongs to this story. However, Jane is young still, and time and change are at work with her. We all have our sorrows, but I do not believe very much in the existence of sorrows that never heal.

### the-lost-inheritance

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE LOST INHERITANCE.txt
- Expected/generated title: The Lost Inheritance / The Lost Inheritance
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: visible title-page author line - H. G. WELLS
- Metadata evidence: visible title-page author line - H. G. WELLS
- Generated files changed: app/client/assets/books/generated/the-lost-inheritance/manifest.json, app/client/assets/books/generated/the-lost-inheritance/cleaned_book.json, app/client/assets/books/generated/the-lost-inheritance/processed_book.json, app/client/assets/books/generated/the-lost-inheritance/rights_report.json, app/client/assets/books/generated/the-lost-inheritance/processing_notes.md, app/client/assets/books/generated/the-lost-inheritance/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-lost-inheritance.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 16 - start at first readable prose after source/title/byline wrapper: “My uncle,” said the man with the glass eye; write pass starts at first selected/default section
- End boundary: cleaned line 76 - end before Project Gutenberg or source-site footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 14398 / 14398
- First default section after: The Lost Inheritance (2800 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from visible title-page author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg start marker; body text was not destructively stripped.; Missing Project Gutenberg end marker; footer text was not destructively stripped.; TOC/body confusion is likely; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: author did not come from a Gutenberg Author line; verify byline directly; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Lost Inheritance (2800 words)

Supporting snippets:

- Title: THE LOST INHERITANCE
- Author: H. G. WELLS
- Start: My uncle, said the man with the glass eye, was what you might call a hemi-semi-demi millionaire. He was worth about a hundred and twenty thousand. Quite. And he left me all his money. I glanced at the shiny sleeve of his coat, and my eye travelled up to t
- End: again,—“It shows you, too, how we poor human beings fail to understand one another.” But there was no misunderstanding the eloquent thirst of his eye. He accepted with ill-feigned surprise. He said, in the usual subtle formula, that he didn’t mind if he did.

### the-purple-pileus

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE PURPLE PILEUS.txt
- Expected/generated title: The Purple Pileus / The Purple Pileus
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: visible title-page author line - H. G. WELLS
- Metadata evidence: visible title-page author line - H. G. WELLS
- Generated files changed: app/client/assets/books/generated/the-purple-pileus/manifest.json, app/client/assets/books/generated/the-purple-pileus/cleaned_book.json, app/client/assets/books/generated/the-purple-pileus/processed_book.json, app/client/assets/books/generated/the-purple-pileus/rights_report.json, app/client/assets/books/generated/the-purple-pileus/processing_notes.md, app/client/assets/books/generated/the-purple-pileus/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-purple-pileus.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 16 - start at first readable prose after source/title/byline wrapper: Mr. Coombes was sick of life.; write pass starts at first selected/default section
- End boundary: cleaned line 157 - end before Project Gutenberg or source-site footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 24963 / 24963
- First default section after: The Purple Pileus (4586 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from visible title-page author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg start marker; body text was not destructively stripped.; Missing Project Gutenberg end marker; footer text was not destructively stripped.; TOC/body confusion is likely; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: author did not come from a Gutenberg Author line; verify byline directly; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Purple Pileus (4586 words)

Supporting snippets:

- Title: THE PURPLE PILEUS
- Author: H. G. WELLS
- Start: Mr. Coombes was sick of life. He walked away from his unhappy home, and, sick not only of his own existence, but of everybody else s, turned aside down Gaswork Lane to avoid the town, and, crossing the wooden bridge that goes over the canal to Starling s Cotta
- End: Mr. Coombes looked. “I dessay they’re sent for some wise purpose,” said Mr. Coombes. And that was as much thanks as the purple pileus ever got for maddening this absurd little man to the pitch of decisive action, and so altering the whole course of his life.

### the-shadow-out-of-time

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Shadow Out of Time.txt
- Expected/generated title: The Shadow Out of Time / The Shadow Out of Time
- Expected/generated author: H. P. Lovecraft / H. P. Lovecraft
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Faded Page Author metadata line - _Author:_ H. P. (Howard Phillips) Lovecraft, (1890-1937)
- Metadata evidence: Faded Page Author metadata line - _Author:_ H. P. (Howard Phillips) Lovecraft, (1890-1937)
- Generated files changed: app/client/assets/books/generated/the-shadow-out-of-time/manifest.json, app/client/assets/books/generated/the-shadow-out-of-time/cleaned_book.json, app/client/assets/books/generated/the-shadow-out-of-time/processed_book.json, app/client/assets/books/generated/the-shadow-out-of-time/rights_report.json, app/client/assets/books/generated/the-shadow-out-of-time/processing_notes.md, app/client/assets/books/generated/the-shadow-out-of-time/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-shadow-out-of-time.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 39 - start at first readable prose after source/title/byline wrapper: After twenty-two years of nightmare and terror; write pass starts at first selected/default section
- End boundary: cleaned line 2915 - end before Project Gutenberg or source-site footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 148840 / 148840
- First default section after: The Shadow Out of Time (25412 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Faded Page Author metadata line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg start marker; body text was not destructively stripped.; Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: author did not come from a Gutenberg Author line; verify byline directly; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Shadow Out of Time (25412 words)

Supporting snippets:

- Title: THE SHADOW OUT OF TIME
- Author: _Author:_ H. P. (Howard Phillips) Lovecraft, (1890-1937)
- Start: After twenty-two years of nightmare and terror, saved only by a desperate conviction of the mythical source of certain impressions, I am unwilling to vouch for the truth of that which I think I found in Western Australia on the night of July 17-18, 1935. There
- End: se pages were not indeed any nameless hieroglyphs of Earth’s youth. They were, instead, the letters of our familiar alphabet, spelling out the words of the English language, in my own handwriting. [The end of <i>The Shadow Out of Time</i> by H. P. Lovecraft]

### the-strange-high-house-in-the-mist

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Strange High House in the Mist.txt
- Expected/generated title: The Strange High House in the Mist / The Strange High House in the Mist
- Expected/generated author: H. P. Lovecraft / H. P. Lovecraft
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Faded Page Author metadata line - _Author:_ Howard Phillips Lovecraft (1890-1937)
- Metadata evidence: Faded Page Author metadata line - _Author:_ Howard Phillips Lovecraft (1890-1937)
- Generated files changed: app/client/assets/books/generated/the-strange-high-house-in-the-mist/manifest.json, app/client/assets/books/generated/the-strange-high-house-in-the-mist/cleaned_book.json, app/client/assets/books/generated/the-strange-high-house-in-the-mist/processed_book.json, app/client/assets/books/generated/the-strange-high-house-in-the-mist/rights_report.json, app/client/assets/books/generated/the-strange-high-house-in-the-mist/processing_notes.md, app/client/assets/books/generated/the-strange-high-house-in-the-mist/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-strange-high-house-in-the-mist.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 41 - start at first readable prose after source/title/byline wrapper: In the morning mist comes up from the sea by the cliffs beyond; write pass starts at first selected/default section
- End boundary: cleaned line 383 - end before Project Gutenberg or source-site footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 21079 / 21079
- First default section after: The Strange High House in the Mist (3789 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Faded Page Author metadata line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg start marker; body text was not destructively stripped.; Missing Project Gutenberg end marker; footer text was not destructively stripped.; TOC/body confusion is likely; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: author did not come from a Gutenberg Author line; verify byline directly; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: illustration captions/placeholders detected

All sections:

- chapter-001: The Strange High House in the Mist (3789 words)

Supporting snippets:

- Title: The Strange High House in the Mist
- Author: _Author:_ Howard Phillips Lovecraft (1890-1937)
- Start: In the morning mist comes up from the sea by the cliffs beyond Kingsport. White and feathery it comes from the deep to its brothers the clouds, full of dreams of dank pastures and caves of leviathan. And later, in still summer rains on the steep roofs of poets
- End: anging sentinel of rock, sees oceanward only a mystic whiteness, as if the cliff's rim were the rim of all earth, and the solemn bells of the buoys tolled free in the æther of faëry. [The end of The Strange High House in the Mist by Howard Phillips Lovecraft]

### the-valley-of-spiders

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE VALLEY OF SPIDERS.txt
- Expected/generated title: The Valley of Spiders / The Valley of Spiders
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Metadata evidence: Gutenberg Author line - Author: H. G. Wells
- Generated files changed: app/client/assets/books/generated/the-valley-of-spiders/manifest.json, app/client/assets/books/generated/the-valley-of-spiders/cleaned_book.json, app/client/assets/books/generated/the-valley-of-spiders/processed_book.json, app/client/assets/books/generated/the-valley-of-spiders/rights_report.json, app/client/assets/books/generated/the-valley-of-spiders/processing_notes.md, app/client/assets/books/generated/the-valley-of-spiders/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-valley-of-spiders.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: The gaunt man with the scarred lip was the first to speak.; write pass starts at first selected/default section
- End boundary: cleaned line 201 - end before Project Gutenberg or source-site footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 21384 / 21384
- First default section after: The Valley of Spiders (3898 words)
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

- chapter-001: The Valley of Spiders (3898 words)

Supporting snippets:

- Title: THE VALLEY OF SPIDERS
- Author: Author: H. G. Wells
- Start: The gaunt man with the scarred lip was the first to speak. Nowhere, he said, with a sigh of disappointment in his voice. But after all, they had a full day's start. They don't know we are after them, said the little man on the white horse. SHE would k
- End: was minded to dismount and trample them with his boots, but this impulse he overcame. Ever and again he turned in his saddle, and looked back at the smoke. “Spiders,” he muttered over and over again. “Spiders! Well, well.... The next time I must spin a web.”

### the-whisperer-in-darkness

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Whisperer in Darkness.txt
- Expected/generated title: The Whisperer in Darkness / The Whisperer in Darkness
- Expected/generated author: H. P. Lovecraft / H. P. Lovecraft
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Faded Page Author metadata line - H. P. Lovecraft
- Metadata evidence: Faded Page Author metadata line - H. P. Lovecraft
- Generated files changed: app/client/assets/books/generated/the-whisperer-in-darkness/manifest.json, app/client/assets/books/generated/the-whisperer-in-darkness/cleaned_book.json, app/client/assets/books/generated/the-whisperer-in-darkness/processed_book.json, app/client/assets/books/generated/the-whisperer-in-darkness/rights_report.json, app/client/assets/books/generated/the-whisperer-in-darkness/processing_notes.md, app/client/assets/books/generated/the-whisperer-in-darkness/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-whisperer-in-darkness.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 36 - start at first readable prose after source/title/byline wrapper: Bear in mind closely that I did not see any actual visual horror; write pass starts at first selected/default section
- End boundary: cleaned line 2672 - end before Project Gutenberg or source-site footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 155006 / 155006
- First default section after: The Whisperer in Darkness (26501 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Faded Page Author metadata line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg start marker; body text was not destructively stripped.; Missing Project Gutenberg end marker; footer text was not destructively stripped.; body headings were found but rejected by the selected strategy; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: author did not come from a Gutenberg Author line; verify byline directly; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: illustration captions/placeholders detected

All sections:

- chapter-001: The Whisperer in Darkness (26501 words)

Supporting snippets:

- Title: The Whisperer in Darkness
- Author: H. P. Lovecraft
- Start: Bear in mind closely that I did not see any actual visual horror at the end. To say that a mental shock was the cause of what I inferred--that last straw which sent me racing out of the lonely Akeley farmhouse and through the wild domed hills of Vermont in a c
- End: , chemical, and mechanical skill" . . . . For the things in the chair, perfect to the last, subtle detail of microscopic resemblance--or identity--were the face and hands of Henry Wentworth Akeley. [The end of _The Whisperer in Darkness_ by H. P. Lovecraft]

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

Dry-run 23 still had 46 skipped/unsafe raw-only candidates before write.
These are not treated as lost or missed.
After safe batching slows/exhausts, create a dedicated remaining raw inventory/triage report classifying every unprocessed raw file.

## Later-phase requirements

- after all books are processed, run an independent second-pass audit using a different strategy
- after books and second-pass audit, add original non-spoiler 300-500+ word SEO summaries for each accepted book page
- after summaries, perform full site SEO/meta review using GSC data and route-level intent
- after books/SEO, run a focused rage-click UX pass for /audio, /practice, homepage, and related utility pages
- investigate the SSR heap OOM separately if it keeps appearing during plain npm run build
- final cleanup should remove temporary audit scripts/reports and code bloat only after everything is stable
