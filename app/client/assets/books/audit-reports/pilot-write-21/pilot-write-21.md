# Pilot write batch 21

Controlled first-time processing pass for the exact raw-only books selected by pilot dry-run batch 21.

## Totals

- Selected: 20
- First-time processed: 20
- Skipped: 0
- Unresolved-source generated left untouched: 11

## Accepted Exclusion Count Clarification

- Dry-run accepted/corrected/verified exclusion count: 405
- Known duplicate/manual/boundary exclusions left unprocessed: the-wind-in-the-willows, the-two-magics-the-turn-of-the-screw-covering-end, japanese-fairy-tales, the-works-of-edgar-allan-poe, snow-white-and-rose-red
- Selected books intersecting accepted exclusions: none
- Note: This write pass uses only the exact selected list from pilot-dry-run-21.json. Known duplicate/manual/boundary exclusions and unresolved-source generated books remain untouched.

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

### a-deal-in-ostriches

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/A DEAL IN OSTRICHES.txt
- Expected/generated title: A Deal in Ostriches / A Deal in Ostriches
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Metadata evidence: Gutenberg Author line - Author: H. G. Wells
- Generated files changed: app/client/assets/books/generated/a-deal-in-ostriches/manifest.json, app/client/assets/books/generated/a-deal-in-ostriches/cleaned_book.json, app/client/assets/books/generated/a-deal-in-ostriches/processed_book.json, app/client/assets/books/generated/a-deal-in-ostriches/rights_report.json, app/client/assets/books/generated/a-deal-in-ostriches/processing_notes.md, app/client/assets/books/generated/a-deal-in-ostriches/sections/chapter-001.json
- Preview asset changed: public/book-previews/a-deal-in-ostriches.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 32 - start at first readable prose after source/title/byline wrapper: Talking of the prices of birds, I've seen an ostrich that cost three; write pass starts at first selected/default section
- End boundary: cleaned line 184 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 9735 / 9735
- First default section after: A Deal in Ostriches (1856 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; TOC/body confusion is likely; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: A Deal in Ostriches (1856 words)

Supporting snippets:

- Title: A DEAL IN OSTRICHES
- Author: Author: H. G. Wells
- Start: Talking of the prices of birds, I've seen an ostrich that cost three hundred pounds," said the Taxidermist, recalling his youth of travel. "Three hundred pounds!" He looked at me over his spectacles. "I've seen another that was refused at four." "No," he sai
- End: to think of it-- "Yes. _I've_ thought that. Only, you see, there's no doubt the diamond was real. And Padishah was an eminent Hindoo. I've seen his name in the papers--often. But whether the bird swallowed the diamond certainly is another matter, as you say."

### a-moonlight-fable

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/A MOONLIGHT FABLE.txt
- Expected/generated title: A Moonlight Fable / A Moonlight Fable
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Metadata evidence: Gutenberg Author line - Author: H. G. Wells
- Generated files changed: app/client/assets/books/generated/a-moonlight-fable/manifest.json, app/client/assets/books/generated/a-moonlight-fable/cleaned_book.json, app/client/assets/books/generated/a-moonlight-fable/processed_book.json, app/client/assets/books/generated/a-moonlight-fable/rights_report.json, app/client/assets/books/generated/a-moonlight-fable/processing_notes.md, app/client/assets/books/generated/a-moonlight-fable/sections/chapter-001.json
- Preview asset changed: public/book-previews/a-moonlight-fable.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 2 - start at first readable prose after source/title/byline wrapper: There was once a little man whose mother made him a beautiful suit of clothes.; write pass starts at first selected/default section
- End boundary: cleaned line 26 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 9308 / 9308
- First default section after: A Moonlight Fable (1739 words)
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

- chapter-001: A Moonlight Fable (1739 words)

Supporting snippets:

- Title: A MOONLIGHT FABLE
- Author: Author: H. G. Wells
- Start: There was once a little man whose mother made him a beautiful suit of clothes. It was green and gold and woven so that I cannot describe how delicate and fine it was, and there was a tie of orange fluffiness that tied up under his chin. And the buttons in thei
- End: bloody and foul and stained with the duckweed from the pond. But his face was a face of such happiness that, had you seen it, you would have understood indeed how that he had died happy, never knowing the cool and streaming silver for the duckweed in the pond.

### a-moth-genus-novo

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/A MOTH--GENUS NOVO.txt
- Expected/generated title: A Moth--Genus Novo / A Moth--Genus Novo
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Metadata evidence: Gutenberg Author line - Author: H. G. Wells
- Generated files changed: app/client/assets/books/generated/a-moth-genus-novo/manifest.json, app/client/assets/books/generated/a-moth-genus-novo/cleaned_book.json, app/client/assets/books/generated/a-moth-genus-novo/processed_book.json, app/client/assets/books/generated/a-moth-genus-novo/rights_report.json, app/client/assets/books/generated/a-moth-genus-novo/processing_notes.md, app/client/assets/books/generated/a-moth-genus-novo/sections/chapter-001.json
- Preview asset changed: public/book-previews/a-moth-genus-novo.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 32 - start at first readable prose after source/title/byline wrapper: Probably you have heard of Hapley--not W.T. Hapley, the son; write pass starts at first selected/default section
- End boundary: cleaned line 434 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 22393 / 22393
- First default section after: A Moth--Genus Novo (4008 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; TOC/body confusion is likely; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: A Moth--Genus Novo (4008 words)

Supporting snippets:

- Title: A MOTH--GENUS NOVO
- Author: Author: H. G. Wells
- Start: Probably you have heard of Hapley--not W.T. Hapley, the son, but the celebrated Hapley, the Hapley of _Periplaneta Hapliia_, Hapley the entomologist. If so you know at least of the great feud between Hapley and Professor Pawkins. Though certain of its conseque
- End: ded room, worried by a moth that no one else can see. The asylum doctor calls it hallucination; but Hapley, when he is in his easier mood, and can talk, says it is the ghost of Pawkins, and consequently a unique specimen and well worth the trouble of catching.

### aepyornis-island

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/AEPYORNIS ISLAND.txt
- Expected/generated title: Aepyornis Island / Aepyornis Island
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Metadata evidence: Gutenberg Author line - Author: H. G. Wells
- Generated files changed: app/client/assets/books/generated/aepyornis-island/manifest.json, app/client/assets/books/generated/aepyornis-island/cleaned_book.json, app/client/assets/books/generated/aepyornis-island/processed_book.json, app/client/assets/books/generated/aepyornis-island/rights_report.json, app/client/assets/books/generated/aepyornis-island/processing_notes.md, app/client/assets/books/generated/aepyornis-island/sections/chapter-001.json
- Preview asset changed: public/book-previews/aepyornis-island.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 32 - start at first readable prose after source/title/byline wrapper: The man with the scarred face leant over the table and looked at my; write pass starts at first selected/default section
- End boundary: cleaned line 478 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 25576 / 25576
- First default section after: Aepyornis Island (5004 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; TOC/body confusion is likely; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: Aepyornis Island (5004 words)

Supporting snippets:

- Title: AEPYORNIS ISLAND
- Author: Author: H. G. Wells
- Start: The man with the scarred face leant over the table and looked at my bundle. "Orchids?" he asked. "A few," I said. "Cypripediums," he said. "Chiefly," said I. "Anything new? I thought not. _I_ did these islands twenty-five--twenty-seven years ago. If you f
- End: a _vastissimus_ turned up." "Winslow was telling me as much," said the man with the scar. "If they get any more Aepyornises, he reckons some scientific swell will go and burst a bloodvessel. But it was a queer thing to happen to a man; wasn't it--altogether?"

### in-the-avu-observatory

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/IN THE AVU OBSERVATORY.txt
- Expected/generated title: In the Avu Observatory / In the Avu Observatory
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Metadata evidence: Gutenberg Author line - Author: H. G. Wells
- Generated files changed: app/client/assets/books/generated/in-the-avu-observatory/manifest.json, app/client/assets/books/generated/in-the-avu-observatory/cleaned_book.json, app/client/assets/books/generated/in-the-avu-observatory/processed_book.json, app/client/assets/books/generated/in-the-avu-observatory/rights_report.json, app/client/assets/books/generated/in-the-avu-observatory/processing_notes.md, app/client/assets/books/generated/in-the-avu-observatory/sections/chapter-001.json
- Preview asset changed: public/book-previews/in-the-avu-observatory.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 32 - start at first readable prose after source/title/byline wrapper: The observatory at Avu, in Borneo, stands on the spur of the mountain.; write pass starts at first selected/default section
- End boundary: cleaned line 299 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 15140 / 15140
- First default section after: In the Avu Observatory (2719 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; TOC/body confusion is likely; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: In the Avu Observatory (2719 words)

Supporting snippets:

- Title: IN THE AVU OBSERVATORY
- Author: Author: H. G. Wells
- Start: The observatory at Avu, in Borneo, stands on the spur of the mountain. To the north rises the old crater, black at night against the unfathomable blue of the sky. From the little circular building, with its mushroom dome, the slopes plunge steeply downward int
- End: ticularly in the forests of Borneo, than are dreamt of in our philosophies. On the whole, if the Borneo fauna is going to disgorge any more of its novelties upon me, I should prefer that it did so when I was not occupied in the observatory at night and alone."

### the-cone

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE CONE.txt
- Expected/generated title: The Cone / The Cone
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Metadata evidence: Gutenberg Author line - Author: H. G. Wells
- Generated files changed: app/client/assets/books/generated/the-cone/manifest.json, app/client/assets/books/generated/the-cone/cleaned_book.json, app/client/assets/books/generated/the-cone/processed_book.json, app/client/assets/books/generated/the-cone/rights_report.json, app/client/assets/books/generated/the-cone/processing_notes.md, app/client/assets/books/generated/the-cone/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-cone.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 2 - start at first readable prose after source/title/byline wrapper: The night was hot and overcast, the sky red, rimmed with the lingering sunset; write pass starts at first selected/default section
- End boundary: cleaned line 186 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 23855 / 23855
- First default section after: The Cone (4276 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: contents or list material must not enter default playback; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Cone (4276 words)

Supporting snippets:

- Title: THE CONE
- Author: Author: H. G. Wells
- Start: The night was hot and overcast, the sky red, rimmed with the lingering sunset of mid-summer. They sat at the open window, trying to fancy the air was fresher there. The trees and shrubs of the garden stood stiff and dark; beyond in the roadway a gas-lamp burnt
- End: saw the cone clear again. Then he staggered back, and stood trembling, clinging to the rail with both hands. His lips moved, but no words came to them. Down below was the sound of voices and running steps. The clangour of rolling in the shed ceased abruptly.

### the-country-of-the-blind

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE COUNTRY OF THE BLIND.txt
- Expected/generated title: The Country of the Blind / The Country of the Blind
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Metadata evidence: Gutenberg Author line - Author: H. G. Wells
- Generated files changed: app/client/assets/books/generated/the-country-of-the-blind/manifest.json, app/client/assets/books/generated/the-country-of-the-blind/cleaned_book.json, app/client/assets/books/generated/the-country-of-the-blind/processed_book.json, app/client/assets/books/generated/the-country-of-the-blind/rights_report.json, app/client/assets/books/generated/the-country-of-the-blind/processing_notes.md, app/client/assets/books/generated/the-country-of-the-blind/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-country-of-the-blind.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 2 - start at first readable prose after source/title/byline wrapper: Three hundred miles and more from Chimborazo, one hundred from the snows; write pass starts at first selected/default section
- End boundary: cleaned line 408 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 52466 / 52466
- First default section after: The Country of the Blind (9614 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: contents or list material must not enter default playback; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Country of the Blind (9614 words)

Supporting snippets:

- Title: THE COUNTRY OF THE BLIND
- Author: Author: H. G. Wells
- Start: Three hundred miles and more from Chimborazo, one hundred from the snows of Cotopaxi, in the wildest wastes of Ecuador s Andes, there lies that mysterious mountain valley, cut off from all the world of men, the Country of the Blind. Long years ago that valley
- End: r, but lay quite still there, smiling as if he were content now merely to have escaped from the valley of the Blind, in which he had thought to be King. And the glow of the sunset passed, and the night came, and still he lay there, under the cold, clear stars.

### the-crystal-egg

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE CRYSTAL EGG.txt
- Expected/generated title: The Crystal Egg / The Crystal Egg
- Expected/generated author: Herbert George Wells / Herbert George Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Gutenberg Author line - Author: Herbert George Wells
- Metadata evidence: Gutenberg Author line - Author: Herbert George Wells
- Generated files changed: app/client/assets/books/generated/the-crystal-egg/manifest.json, app/client/assets/books/generated/the-crystal-egg/cleaned_book.json, app/client/assets/books/generated/the-crystal-egg/processed_book.json, app/client/assets/books/generated/the-crystal-egg/rights_report.json, app/client/assets/books/generated/the-crystal-egg/processing_notes.md, app/client/assets/books/generated/the-crystal-egg/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-crystal-egg.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: There was, until a year ago, a little and very grimy-looking shop near Seven Dials; write pass starts at first selected/default section
- End boundary: cleaned line 115 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 39093 / 39093
- First default section after: The Crystal Egg (6860 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: contents or list material must not enter default playback; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Crystal Egg (6860 words)

Supporting snippets:

- Title: THE CRYSTAL EGG
- Author: Author: Herbert George Wells
- Start: There was, until a year ago, a little and very grimy-looking shop near Seven Dials, over which, in weather-worn yellow lettering, the name of "C. Cave, Naturalist and Dealer in Antiquities," was inscribed. The contents of its window were curiously variegated.
- End: ust have been—possibly at some remote date—sent hither from that planet, in order to give the Martians a near view of our affairs. Possibly the fellows to the crystals in the other masts are also on our globe. No theory of hallucination suffices for the facts.

### the-diamond-maker

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE DIAMOND MAKER.txt
- Expected/generated title: The Diamond Maker / The Diamond Maker
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Metadata evidence: Gutenberg Author line - Author: H. G. Wells
- Generated files changed: app/client/assets/books/generated/the-diamond-maker/manifest.json, app/client/assets/books/generated/the-diamond-maker/cleaned_book.json, app/client/assets/books/generated/the-diamond-maker/processed_book.json, app/client/assets/books/generated/the-diamond-maker/rights_report.json, app/client/assets/books/generated/the-diamond-maker/processing_notes.md, app/client/assets/books/generated/the-diamond-maker/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-diamond-maker.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 32 - start at first readable prose after source/title/byline wrapper: Some business had detained me in Chancery Lane until nine in the; write pass starts at first selected/default section
- End boundary: cleaned line 321 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 15666 / 15666
- First default section after: The Diamond Maker (2961 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; TOC/body confusion is likely; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Diamond Maker (2961 words)

Supporting snippets:

- Title: THE DIAMOND MAKER
- Author: Author: H. G. Wells
- Start: Some business had detained me in Chancery Lane until nine in the evening, and thereafter, having some inkling of a headache, I was disinclined either for entertainment or further work. So much of the sky as the high cliffs of that narrow cañon of traffic left
- End: t is just possible he may yet emerge upon society, and, passing athwart my heavens in the serene altitude sacred to the wealthy and the well-advertised, reproach me silently for my want of enterprise. I sometimes think I might at least have risked five pounds.

### the-flowering-of-the-strange-orchid

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE FLOWERING OF THE STRANGE ORCHID.txt
- Expected/generated title: The Flowering of the Strange Orchid / The Flowering of the Strange Orchid
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Metadata evidence: Gutenberg Author line - Author: H. G. Wells
- Generated files changed: app/client/assets/books/generated/the-flowering-of-the-strange-orchid/manifest.json, app/client/assets/books/generated/the-flowering-of-the-strange-orchid/cleaned_book.json, app/client/assets/books/generated/the-flowering-of-the-strange-orchid/processed_book.json, app/client/assets/books/generated/the-flowering-of-the-strange-orchid/rights_report.json, app/client/assets/books/generated/the-flowering-of-the-strange-orchid/processing_notes.md, app/client/assets/books/generated/the-flowering-of-the-strange-orchid/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-flowering-of-the-strange-orchid.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 32 - start at first readable prose after source/title/byline wrapper: The buying of orchids always has in it a certain speculative flavour.; write pass starts at first selected/default section
- End boundary: cleaned line 377 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 16696 / 16696
- First default section after: The Flowering of the Strange Orchid (2974 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; TOC/body confusion is likely; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Flowering of the Strange Orchid (2974 words)

Supporting snippets:

- Title: THE FLOWERING OF THE STRANGE ORCHID
- Author: Author: H. G. Wells
- Start: The buying of orchids always has in it a certain speculative flavour. You have before you the brown shrivelled lump of tissue, and for the rest you must trust your judgment, or the auctioneer, or your good-luck, as your taste may incline. The plant may be mori
- End: l lay there, black now and putrescent. The door banged intermittently in the morning breeze, and all the array of Wedderburn's orchids was shrivelled and prostrate. But Wedderburn himself was bright and garrulous upstairs in the glory of his strange adventure.

### the-flying-man

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE FLYING MAN.txt
- Expected/generated title: The Flying Man / The Flying Man
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Metadata evidence: Gutenberg Author line - Author: H. G. Wells
- Generated files changed: app/client/assets/books/generated/the-flying-man/manifest.json, app/client/assets/books/generated/the-flying-man/cleaned_book.json, app/client/assets/books/generated/the-flying-man/processed_book.json, app/client/assets/books/generated/the-flying-man/rights_report.json, app/client/assets/books/generated/the-flying-man/processing_notes.md, app/client/assets/books/generated/the-flying-man/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-flying-man.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 32 - start at first readable prose after source/title/byline wrapper: The Ethnologist looked at the _bhimraj_ feather thoughtfully.; write pass starts at first selected/default section
- End boundary: cleaned line 296 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 13914 / 13914
- First default section after: The Flying Man (2675 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; TOC/body confusion is likely; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Flying Man (2675 words)

Supporting snippets:

- Title: THE FLYING MAN
- Author: Author: H. G. Wells
- Start: The Ethnologist looked at the _bhimraj_ feather thoughtfully. "They seemed loth to part with it," he said. "It is sacred to the Chiefs," said the lieutenant; "just as yellow silk, you know, is sacred to the Chinese Emperor." The Ethnologist did not answer. H
- End: t, they found two more of the Sepoys had jumped over." "The rest were all right?" asked the Ethnologist. "Yes," said the lieutenant; "the rest were all right, barring a certain thirst, you know." And at the memory he helped himself to soda and whisky again.

### the-hammerpond-park-burglary

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE HAMMERPOND PARK BURGLARY.txt
- Expected/generated title: The Hammerpond Park Burglary / The Hammerpond Park Burglary
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Metadata evidence: Gutenberg Author line - Author: H. G. Wells
- Generated files changed: app/client/assets/books/generated/the-hammerpond-park-burglary/manifest.json, app/client/assets/books/generated/the-hammerpond-park-burglary/cleaned_book.json, app/client/assets/books/generated/the-hammerpond-park-burglary/processed_book.json, app/client/assets/books/generated/the-hammerpond-park-burglary/rights_report.json, app/client/assets/books/generated/the-hammerpond-park-burglary/processing_notes.md, app/client/assets/books/generated/the-hammerpond-park-burglary/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-hammerpond-park-burglary.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 32 - start at first readable prose after source/title/byline wrapper: It is a moot point whether burglary is to be considered as a sport, a; write pass starts at first selected/default section
- End boundary: cleaned line 334 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 15444 / 15444
- First default section after: The Hammerpond Park Burglary (2671 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; TOC/body confusion is likely; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Hammerpond Park Burglary (2671 words)

Supporting snippets:

- Title: THE HAMMERPOND PARK BURGLARY
- Author: Author: H. G. Wells
- Start: It is a moot point whether burglary is to be considered as a sport, a trade, or an art. For a trade, the technique is scarcely rigid enough, and its claims to be considered an art are vitiated by the mercenary element that qualifies its triumphs. On the whole
- End: he dawn found a deserted easel bearing a canvas with a green inscription, in the Hammerpond Park, and it found Hammerpond House in commotion. But if the dawn found Mr Teddy Watkins and the Aveling diamonds, it did not communicate the information to the police.

### the-lord-of-the-dynamos

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE LORD OF THE DYNAMOS.txt
- Expected/generated title: The Lord of the Dynamos / The Lord of the Dynamos
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Metadata evidence: Gutenberg Author line - Author: H. G. Wells
- Generated files changed: app/client/assets/books/generated/the-lord-of-the-dynamos/manifest.json, app/client/assets/books/generated/the-lord-of-the-dynamos/cleaned_book.json, app/client/assets/books/generated/the-lord-of-the-dynamos/processed_book.json, app/client/assets/books/generated/the-lord-of-the-dynamos/rights_report.json, app/client/assets/books/generated/the-lord-of-the-dynamos/processing_notes.md, app/client/assets/books/generated/the-lord-of-the-dynamos/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-lord-of-the-dynamos.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 32 - start at first readable prose after source/title/byline wrapper: The chief attendant of the three dynamos that buzzed and rattled; write pass starts at first selected/default section
- End boundary: cleaned line 369 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 19194 / 19194
- First default section after: The Lord of the Dynamos (3401 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; TOC/body confusion is likely; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Lord of the Dynamos (3401 words)

Supporting snippets:

- Title: THE LORD OF THE DYNAMOS
- Author: Author: H. G. Wells
- Start: The chief attendant of the three dynamos that buzzed and rattled at Camberwell, and kept the electric railway going, came out of Yorkshire, and his name was James Holroyd. He was a practical electrician, but fond of whisky, a heavy, red-haired brute with irreg
- End: s face. The core of the dynamo roared out loud and clear, and the armature beat the air. So ended prematurely the Worship of the Dynamo Deity, perhaps the most short-lived of all religions. Yet withal it could at least boast a Martyrdom and a Human Sacrifice.

### the-star

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE STAR.txt
- Expected/generated title: The Star / The Star
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Metadata evidence: Gutenberg Author line - Author: H. G. Wells
- Generated files changed: app/client/assets/books/generated/the-star/manifest.json, app/client/assets/books/generated/the-star/cleaned_book.json, app/client/assets/books/generated/the-star/processed_book.json, app/client/assets/books/generated/the-star/rights_report.json, app/client/assets/books/generated/the-star/processing_notes.md, app/client/assets/books/generated/the-star/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-star.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 2 - start at first readable prose after source/title/byline wrapper: It was on the first day of the New Year that the announcement was made; write pass starts at first selected/default section
- End boundary: cleaned line 78 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 25219 / 25219
- First default section after: The Star (4457 words)
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

- chapter-001: The Star (4457 words)

Supporting snippets:

- Title: THE STAR
- Author: Author: H. G. Wells
- Start: It was on the first day of the New Year that the announcement was made, almost simultaneously from three observatories, that the motion of the planet Neptune, the outermost of all the planets that wheel about the sun, had become very erratic. Ogilvy had alread
- End: seas remain intact, and indeed the only difference seems to be a shrinkage of the white discoloration (supposed to be frozen water) round either pole.” Which only shows how small the vastest of human catastrophes may seem, at a distance of a few million miles.

### the-stolen-bacillus

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE STOLEN BACILLUS.txt
- Expected/generated title: The Stolen Bacillus / The Stolen Bacillus
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Metadata evidence: Gutenberg Author line - Author: H. G. Wells
- Generated files changed: app/client/assets/books/generated/the-stolen-bacillus/manifest.json, app/client/assets/books/generated/the-stolen-bacillus/cleaned_book.json, app/client/assets/books/generated/the-stolen-bacillus/processed_book.json, app/client/assets/books/generated/the-stolen-bacillus/rights_report.json, app/client/assets/books/generated/the-stolen-bacillus/processing_notes.md, app/client/assets/books/generated/the-stolen-bacillus/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-stolen-bacillus.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 32 - start at first readable prose after source/title/byline wrapper: "This again," said the Bacteriologist, slipping a glass slide under; write pass starts at first selected/default section
- End boundary: cleaned line 305 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 13930 / 13930
- First default section after: The Stolen Bacillus (2461 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; TOC/body confusion is likely; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Stolen Bacillus (2461 words)

Supporting snippets:

- Title: THE STOLEN BACILLUS
- Author: Author: H. G. Wells
- Start: "This again," said the Bacteriologist, slipping a glass slide under the microscope, "is a preparation of the celebrated Bacillus of cholera--the cholera germ." The pale-faced man peered down the microscope. He was evidently not accustomed to that kind of thin
- End: er is, I shall have all the trouble and expense of preparing some more. "Put on my coat on this hot day! Why? Because we might meet Mrs Jabber. My dear, Mrs Jabber is not a draught. But why should I wear a coat on a hot day because of Mrs--. Oh! _very_ well."

### the-stolen-body

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE STOLEN BODY.txt
- Expected/generated title: The Stolen Body / The Stolen Body
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Metadata evidence: Gutenberg Author line - Author: H. G. Wells
- Generated files changed: app/client/assets/books/generated/the-stolen-body/manifest.json, app/client/assets/books/generated/the-stolen-body/cleaned_book.json, app/client/assets/books/generated/the-stolen-body/processed_book.json, app/client/assets/books/generated/the-stolen-body/rights_report.json, app/client/assets/books/generated/the-stolen-body/processing_notes.md, app/client/assets/books/generated/the-stolen-body/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-stolen-body.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 5 - start at first readable prose after source/title/byline wrapper: Mr. Bessel was the senior partner in the firm of Bessel, Hart, and Brown; write pass starts at first selected/default section
- End boundary: cleaned line 117 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 35493 / 35493
- First default section after: The Stolen Body (6349 words)
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

- chapter-001: The Stolen Body (6349 words)

Supporting snippets:

- Title: THE STOLEN BODY
- Author: Author: H. G. Wells
- Start: Mr. Bessel was the senior partner in the firm of Bessel, Hart, and Brown, of St. Paul's Churchyard, and for many years he was well known among those interested in psychical research as a liberal-minded and conscientious investigator. He was an unmarried man, a
- End: n spite of the pain and suffering of his wounds, and of the dim damp place in which he lay; in spite of the tears—wrung from him by his physical distress—his heart was full of gladness to know that he was nevertheless back once more in the kindly world of men.

### the-temptation-of-harringay

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE TEMPTATION OF HARRINGAY.txt
- Expected/generated title: The Temptation of Harringay / The Temptation of Harringay
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Metadata evidence: Gutenberg Author line - Author: H. G. Wells
- Generated files changed: app/client/assets/books/generated/the-temptation-of-harringay/manifest.json, app/client/assets/books/generated/the-temptation-of-harringay/cleaned_book.json, app/client/assets/books/generated/the-temptation-of-harringay/processed_book.json, app/client/assets/books/generated/the-temptation-of-harringay/rights_report.json, app/client/assets/books/generated/the-temptation-of-harringay/processing_notes.md, app/client/assets/books/generated/the-temptation-of-harringay/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-temptation-of-harringay.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 32 - start at first readable prose after source/title/byline wrapper: It is quite impossible to say whether this thing really happened.; write pass starts at first selected/default section
- End boundary: cleaned line 255 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 11049 / 11049
- First default section after: The Temptation of Harringay (1946 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; TOC/body confusion is likely; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Temptation of Harringay (1946 words)

Supporting snippets:

- Title: THE TEMPTATION OF HARRINGAY
- Author: Author: H. G. Wells
- Start: It is quite impossible to say whether this thing really happened. It depends entirely on the word of R.M. Harringay, who is an artist. Following his version of the affair, the narrative deposes that Harringay went into his studio about ten o'clock to see what
- End: t. This is Harringay's story--not mine. He supports it by a small canvas (24 by 20) enamelled a pale green, and by violent asseverations. It is also true that he never has produced a masterpiece, and in the opinion of his intimate friends probably never will.

### the-treasure-in-the-forest

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE TREASURE IN THE FOREST.txt
- Expected/generated title: The Treasure in the Forest / The Treasure in the Forest
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Metadata evidence: Gutenberg Author line - Author: H. G. Wells
- Generated files changed: app/client/assets/books/generated/the-treasure-in-the-forest/manifest.json, app/client/assets/books/generated/the-treasure-in-the-forest/cleaned_book.json, app/client/assets/books/generated/the-treasure-in-the-forest/processed_book.json, app/client/assets/books/generated/the-treasure-in-the-forest/rights_report.json, app/client/assets/books/generated/the-treasure-in-the-forest/processing_notes.md, app/client/assets/books/generated/the-treasure-in-the-forest/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-treasure-in-the-forest.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 32 - start at first readable prose after source/title/byline wrapper: The canoe was now approaching the land. The bay opened out, and a gap; write pass starts at first selected/default section
- End boundary: cleaned line 387 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 16366 / 16366
- First default section after: The Treasure in the Forest (2950 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; TOC/body confusion is likely; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Treasure in the Forest (2950 words)

Supporting snippets:

- Title: THE TREASURE IN THE FOREST
- Author: Author: H. G. Wells
- Start: The canoe was now approaching the land. The bay opened out, and a gap in the white surf of the reef marked where the little river ran out to the sea; the thicker and deeper green of the virgin forest showed its course down the distant hill slope. The forest he
- End: of his companion. Chang-hi's grin came in his mind again. The dull pain spread towards his throat and grew slowly in intensity. Far above him a faint breeze stirred the greenery, and the white petals of some unknown flower came floating down through the gloom.

### the-triumphs-of-a-taxidermist

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE TRIUMPHS OF A TAXIDERMIST.txt
- Expected/generated title: The Triumphs of a Taxidermist / The Triumphs of a Taxidermist
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Metadata evidence: Gutenberg Author line - Author: H. G. Wells
- Generated files changed: app/client/assets/books/generated/the-triumphs-of-a-taxidermist/manifest.json, app/client/assets/books/generated/the-triumphs-of-a-taxidermist/cleaned_book.json, app/client/assets/books/generated/the-triumphs-of-a-taxidermist/processed_book.json, app/client/assets/books/generated/the-triumphs-of-a-taxidermist/rights_report.json, app/client/assets/books/generated/the-triumphs-of-a-taxidermist/processing_notes.md, app/client/assets/books/generated/the-triumphs-of-a-taxidermist/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-triumphs-of-a-taxidermist.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 32 - start at first readable prose after source/title/byline wrapper: Here are some of the secrets of taxidermy. They were told me by the; write pass starts at first selected/default section
- End boundary: cleaned line 177 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 8056 / 8056
- First default section after: The Triumphs of a Taxidermist (1485 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; TOC/body confusion is likely; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Triumphs of a Taxidermist (1485 words)

Supporting snippets:

- Title: THE TRIUMPHS OF A TAXIDERMIST
- Author: Author: H. G. Wells
- Start: Here are some of the secrets of taxidermy. They were told me by the taxidermist in a mood of elation. He told me them in the time between the first glass of whisky and the fourth, when a man is no longer cautious and yet not drunk. We sat in his den together;
- End: birds are concerned, I find that he has the confirmation of distinguished ornithological writers. And the note about the New Zealand bird certainly appeared in a morning paper of unblemished reputation, for the Taxidermist keeps a copy and has shown it to me.

### through-a-window

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THROUGH A WINDOW.txt
- Expected/generated title: Through a Window / Through a Window
- Expected/generated author: H. G. Wells / H. G. Wells
- Expected/generated creator role: author as identified by the source / represented in generated author metadata; author as identified by the source
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Metadata evidence: Gutenberg Author line - Author: H. G. Wells
- Generated files changed: app/client/assets/books/generated/through-a-window/manifest.json, app/client/assets/books/generated/through-a-window/cleaned_book.json, app/client/assets/books/generated/through-a-window/processed_book.json, app/client/assets/books/generated/through-a-window/rights_report.json, app/client/assets/books/generated/through-a-window/processing_notes.md, app/client/assets/books/generated/through-a-window/sections/chapter-001.json
- Preview asset changed: public/book-previews/through-a-window.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 32 - start at first readable prose after source/title/byline wrapper: After his legs were set, they carried Bailey into the study and put; write pass starts at first selected/default section
- End boundary: cleaned line 368 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 17271 / 17271
- First default section after: Through a Window (3096 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; TOC/body confusion is likely; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: Through a Window (3096 words)

Supporting snippets:

- Title: THROUGH A WINDOW
- Author: Author: H. G. Wells
- Start: After his legs were set, they carried Bailey into the study and put him on a couch before the open window. There he lay, a live--even a feverish man down to the loins, and below that a double-barrelled mummy swathed in white wrappings. He tried to read, even t
- End: fell heavily upon the floor. "Easy with those legs," said Bailey, as young Fitzgibbon and one of the boating party lifted the body off him. Young Fitzgibbon was very white in the face. "I didn't mean to kill him," he said. "It's just as well," said Bailey.

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

Dry-run 21 still had 76 skipped/unsafe raw-only candidates before write.
These are not treated as lost or missed.
After safe batching slows/exhausts, create a dedicated remaining raw inventory/triage report classifying every unprocessed raw file.

## Later-phase requirements

- after all books are processed, run an independent second-pass audit using a different strategy
- after books and second-pass audit, add original non-spoiler 300-500+ word SEO summaries for each accepted book page
- after summaries, perform full site SEO/meta review using GSC data and route-level intent
- after books/SEO, run a focused rage-click UX pass for /audio, /practice, homepage, and related utility pages
- investigate the SSR heap OOM separately if it keeps appearing during plain npm run build
- final cleanup should remove temporary audit scripts/reports and code bloat only after everything is stable
