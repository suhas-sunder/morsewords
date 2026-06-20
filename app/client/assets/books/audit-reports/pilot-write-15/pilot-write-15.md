# Pilot write batch 15

Controlled first-time processing pass for the exact raw-only books selected by pilot dry-run batch 15.

## Totals

- Selected: 20
- First-time processed: 20
- Skipped: 0
- Unresolved-source generated left untouched: 11

## Accepted Exclusion Count Clarification

- Dry-run accepted/corrected/verified exclusion count: 285
- Known duplicate/manual/boundary exclusions left unprocessed: the-wind-in-the-willows, the-two-magics-the-turn-of-the-screw-covering-end, the-works-of-edgar-allan-poe
- Selected books intersecting accepted exclusions: none
- Note: This write pass uses only the exact selected list from pilot-dry-run-15.json. Known duplicate/manual/boundary exclusions and unresolved-source generated books remain untouched.

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

### a-bread-and-butter-miss

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/A BREAD AND BUTTER MISS.txt
- Expected/generated title: A Bread and Butter Miss / A Bread and Butter Miss
- Expected/generated author: Saki / Saki
- Author evidence: Gutenberg Author line - Author: Saki
- Generated files changed: app/client/assets/books/generated/a-bread-and-butter-miss/manifest.json, app/client/assets/books/generated/a-bread-and-butter-miss/cleaned_book.json, app/client/assets/books/generated/a-bread-and-butter-miss/processed_book.json, app/client/assets/books/generated/a-bread-and-butter-miss/rights_report.json, app/client/assets/books/generated/a-bread-and-butter-miss/processing_notes.md, app/client/assets/books/generated/a-bread-and-butter-miss/sections/chapter-001.json
- Preview asset changed: public/book-previews/a-bread-and-butter-miss.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 29 - start at first readable prose after source/title/byline wrapper: “Starling Chatter and Oakhill have both dropped back in the betting,”; write pass starts at first selected/default section
- End boundary: cleaned line 239 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 9654 / 9654
- First default section after: A Bread and Butter Miss (1742 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: A Bread and Butter Miss (1742 words)

Supporting snippets:

- Title: A BREAD AND BUTTER MISS
- Author: Author: Saki
- Start: Starling Chatter and Oakhill have both dropped back in the betting, said Bertie van Tahn, throwing the morning paper across the breakfast table. That leaves Nursery Tea practically favourite, said Odo Finsberry. Nursery Tea and Pipeclay are at the top o
- End: words gradually dawned on his hearers. For the second time that day Lola retired to the seclusion of her room; she could not face the universal looks of reproach directed at her when Whitebait was announced winner at the comfortable price of fourteen to one.

### bertie-s-christmas-eve

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/BERTIE’S CHRISTMAS EVE.txt
- Expected/generated title: Bertie’s Christmas Eve / Bertie’s Christmas Eve
- Expected/generated author: Saki / Saki
- Author evidence: Gutenberg Author line - Author: Saki
- Generated files changed: app/client/assets/books/generated/bertie-s-christmas-eve/manifest.json, app/client/assets/books/generated/bertie-s-christmas-eve/cleaned_book.json, app/client/assets/books/generated/bertie-s-christmas-eve/processed_book.json, app/client/assets/books/generated/bertie-s-christmas-eve/rights_report.json, app/client/assets/books/generated/bertie-s-christmas-eve/processing_notes.md, app/client/assets/books/generated/bertie-s-christmas-eve/sections/chapter-001.json
- Preview asset changed: public/book-previews/bertie-s-christmas-eve.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 29 - start at first readable prose after source/title/byline wrapper: It was Christmas Eve, and the family circle of Luke Steffink, Esq., was; write pass starts at first selected/default section
- End boundary: cleaned line 247 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 11750 / 11750
- First default section after: Bertie’s Christmas Eve (2031 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets; Write pass preserved the raw source apostrophe from the BERTIE’S CHRISTMAS EVE heading.

All sections:

- chapter-001: Bertie’s Christmas Eve (2031 words)

Supporting snippets:

- Title: BERTIE?S CHRISTMAS EVE
- Author: Author: Saki
- Start: It was Christmas Eve, and the family circle of Luke Steffink, Esq., was aglow with the amiability and random mirth which the occasion demanded. A long and lavish dinner had been partaken of, waits had been round and sung carols; the house-party had regaled its
- End: . The hurried procession of the released that followed in his steps came in for a good deal of the adverse comment that his exuberant display had evoked. It was the happiest Christmas Eve he had ever spent. To quote his own words, he had a rotten Christmas.

### excepting-mrs-pentherby

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/EXCEPTING MRS. PENTHERBY.txt
- Expected/generated title: Excepting Mrs. Pentherby / Excepting Mrs. Pentherby
- Expected/generated author: Saki / Saki
- Author evidence: Gutenberg Author line - Author: Saki
- Generated files changed: app/client/assets/books/generated/excepting-mrs-pentherby/manifest.json, app/client/assets/books/generated/excepting-mrs-pentherby/cleaned_book.json, app/client/assets/books/generated/excepting-mrs-pentherby/processed_book.json, app/client/assets/books/generated/excepting-mrs-pentherby/rights_report.json, app/client/assets/books/generated/excepting-mrs-pentherby/processing_notes.md, app/client/assets/books/generated/excepting-mrs-pentherby/sections/chapter-001.json
- Preview asset changed: public/book-previews/excepting-mrs-pentherby.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 29 - start at first readable prose after source/title/byline wrapper: It was Reggie Bruttle’s own idea for converting what had threatened to be; write pass starts at first selected/default section
- End boundary: cleaned line 213 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 10948 / 10948
- First default section after: Excepting Mrs. Pentherby (1933 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: Excepting Mrs. Pentherby (1933 words)

Supporting snippets:

- Title: EXCEPTING MRS. PENTHERBY
- Author: Author: Saki
- Start: It was Reggie Bruttle s own idea for converting what had threatened to be an albino elephant into a beast of burden that should help him along the stony road of his finances. The Limes, which had come to him by inheritance without any accompanying provision
- End: hink you are the most odious person in the whole world,” said Reggie’s sister-in-law. Which was not strictly true; more than anybody, more than ever she disliked Mrs. Pentherby. It was impossible to calculate how many quarrels that woman had done her out of.

### fate

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/FATE.txt
- Expected/generated title: Fate / Fate
- Expected/generated author: Saki / Saki
- Author evidence: Gutenberg Author line - Author: Saki
- Generated files changed: app/client/assets/books/generated/fate/manifest.json, app/client/assets/books/generated/fate/cleaned_book.json, app/client/assets/books/generated/fate/processed_book.json, app/client/assets/books/generated/fate/rights_report.json, app/client/assets/books/generated/fate/processing_notes.md, app/client/assets/books/generated/fate/sections/chapter-001.json
- Preview asset changed: public/book-previews/fate.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 29 - start at first readable prose after source/title/byline wrapper: Rex Dillot was nearly twenty-four, almost good-looking and quite; write pass starts at first selected/default section
- End boundary: cleaned line 206 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 9949 / 9949
- First default section after: Fate (1788 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: Fate (1788 words)

Supporting snippets:

- Title: FATE
- Author: Author: Saki
- Start: Rex Dillot was nearly twenty-four, almost good-looking and quite penniless. His mother was supposed to make him some sort of an allowance out of what her creditors allowed her, and Rex occasionally strayed into the ranks of those who earn fitful salaries as s
- End: up for repairs; perhaps it was not the best place to have chosen for the scene of salvage operations; but then, as Clovis remarked, when one is rushing about with a blazing woman in one’s arms one can’t stop to think out exactly where one is going to put her.

### forewarned

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/FOREWARNED.txt
- Expected/generated title: Forewarned / Forewarned
- Expected/generated author: Saki / Saki
- Author evidence: Gutenberg Author line - Author: Saki
- Generated files changed: app/client/assets/books/generated/forewarned/manifest.json, app/client/assets/books/generated/forewarned/cleaned_book.json, app/client/assets/books/generated/forewarned/processed_book.json, app/client/assets/books/generated/forewarned/rights_report.json, app/client/assets/books/generated/forewarned/processing_notes.md, app/client/assets/books/generated/forewarned/sections/chapter-001.json
- Preview asset changed: public/book-previews/forewarned.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 29 - start at first readable prose after source/title/byline wrapper: Alethia Debchance sat in a corner of an otherwise empty railway carriage,; write pass starts at first selected/default section
- End boundary: cleaned line 259 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 14179 / 14179
- First default section after: Forewarned (2477 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: contents or list material must not enter default playback; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: Forewarned (2477 words)

Supporting snippets:

- Title: FOREWARNED
- Author: Author: Saki
- Start: Alethia Debchance sat in a corner of an otherwise empty railway carriage, more or less at ease as regarded body, but in some trepidation as to mind. She had embarked on a social adventure of no little magnitude as compared with the accustomed seclusion and st
- End: iny are played unceasingly. She had come unscathed through it, but what might have happened if she had gone unsuspectingly to visit Sir John Chobham and warn him of his danger? What indeed! She had been saved by the fearless outspokenness of the local Press.

### hyacinth

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/HYACINTH.txt
- Expected/generated title: Hyacinth / Hyacinth
- Expected/generated author: Saki / Saki
- Author evidence: Gutenberg Author line - Author: Saki
- Generated files changed: app/client/assets/books/generated/hyacinth/manifest.json, app/client/assets/books/generated/hyacinth/cleaned_book.json, app/client/assets/books/generated/hyacinth/processed_book.json, app/client/assets/books/generated/hyacinth/rights_report.json, app/client/assets/books/generated/hyacinth/processing_notes.md, app/client/assets/books/generated/hyacinth/sections/chapter-001.json
- Preview asset changed: public/book-previews/hyacinth.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 29 - start at first readable prose after source/title/byline wrapper: “The new fashion of introducing the candidate’s children into an election; write pass starts at first selected/default section
- End boundary: cleaned line 272 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 12930 / 12930
- First default section after: Hyacinth (2318 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: Hyacinth (2318 words)

Supporting snippets:

- Title: HYACINTH
- Author: Author: Saki
- Start: The new fashion of introducing the candidate s children into an election contest is a pretty one, said Mrs. Panstreppon; it takes away something from the acerbity of party warfare, and it makes an interesting experience for children to look back on in after
- End: ther. “There I think you are going to extremes,” said Mrs. Panstreppon; “if there should be a general election in Mexico I think you might safely let him go there, but I doubt whether our English politics are suited to the rough and tumble of an angel-child.”

### louis

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/LOUIS.txt
- Expected/generated title: Louis / Louis
- Expected/generated author: Saki / Saki
- Author evidence: Gutenberg Author line - Author: Saki
- Generated files changed: app/client/assets/books/generated/louis/manifest.json, app/client/assets/books/generated/louis/cleaned_book.json, app/client/assets/books/generated/louis/processed_book.json, app/client/assets/books/generated/louis/rights_report.json, app/client/assets/books/generated/louis/processing_notes.md, app/client/assets/books/generated/louis/sections/chapter-001.json
- Preview asset changed: public/book-previews/louis.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 29 - start at first readable prose after source/title/byline wrapper: “It would be jolly to spend Easter in Vienna this year,” said; write pass starts at first selected/default section
- End boundary: cleaned line 204 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 10064 / 10064
- First default section after: Louis (1870 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: Louis (1870 words)

Supporting snippets:

- Title: LOUIS
- Author: Author: Saki
- Start: It would be jolly to spend Easter in Vienna this year, said Strudwarden, and look up some of my old friends there. It s about the jolliest place I know of to be at for Easter— I thought we had made up our minds to spend Easter at Brighton, interrupted
- End: f the buckles. For Heaven’s sake, Lena, weep, if you really feel it so much; anything would be better than standing there staring as if you thought I had lost my reason.” Lena Strudwarden did not weep, but her attempt at laughing was an unmistakable failure.

### louise

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/Louise.txt
- Expected/generated title: Louise / Louise
- Expected/generated author: Saki / Saki
- Author evidence: Gutenberg Author line - Author: Saki
- Generated files changed: app/client/assets/books/generated/louise/manifest.json, app/client/assets/books/generated/louise/cleaned_book.json, app/client/assets/books/generated/louise/processed_book.json, app/client/assets/books/generated/louise/rights_report.json, app/client/assets/books/generated/louise/processing_notes.md, app/client/assets/books/generated/louise/sections/chapter-001.json
- Preview asset changed: public/book-previews/louise.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 29 - start at first readable prose after source/title/byline wrapper: “The tea will be quite cold, you’d better ring for some more,” said the; write pass starts at first selected/default section
- End boundary: cleaned line 183 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 8247 / 8247
- First default section after: Louise (1549 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: Louise (1549 words)

Supporting snippets:

- Title: LOUISE
- Author: Author: Saki
- Start: The tea will be quite cold, you d better ring for some more, said the Dowager Lady Beanford. Susan Lady Beanford was a vigorous old woman who had coquetted with imaginary ill-health for the greater part of a lifetime; Clovis Sangrail irreverently declared t
- End: e wouldn’t leave off till some one told her to. Anyhow, you can ring up Mornay’s, Robert, and ask whether I left two theatre tickets there. Except for your silk, Susan, those seem to be the only things I’ve forgotten this afternoon. Quite wonderful for me.”

### morlvera

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/MORLVERA.txt
- Expected/generated title: Morlvera / Morlvera
- Expected/generated author: Saki / Saki
- Author evidence: Gutenberg Author line - Author: Saki
- Generated files changed: app/client/assets/books/generated/morlvera/manifest.json, app/client/assets/books/generated/morlvera/cleaned_book.json, app/client/assets/books/generated/morlvera/processed_book.json, app/client/assets/books/generated/morlvera/rights_report.json, app/client/assets/books/generated/morlvera/processing_notes.md, app/client/assets/books/generated/morlvera/sections/chapter-001.json
- Preview asset changed: public/book-previews/morlvera.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 29 - start at first readable prose after source/title/byline wrapper: The Olympic Toy Emporium occupied a conspicuous frontage in an important; write pass starts at first selected/default section
- End boundary: cleaned line 201 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 9112 / 9112
- First default section after: Morlvera (1621 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: Morlvera (1621 words)

Supporting snippets:

- Title: MORLVERA
- Author: Author: Saki
- Start: The Olympic Toy Emporium occupied a conspicuous frontage in an important West End street. It was happily named Toy Emporium, because one would never have dreamed of according it the familiar and yet pulse-quickening name of toyshop. There was an air of cold
- End: re engaged in the pursuit of minnows by the waterside in St. James’s Park, Emmeline said in a solemn undertone to Bert— “I’ve bin finking. Do you know oo ’e was? ’E was ’er little boy wot she’d sent away to live wiv poor folks. ’E come back and done that.”

### tea

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/Tea.txt
- Expected/generated title: Tea / Tea
- Expected/generated author: Saki / Saki
- Author evidence: Gutenberg Author line - Author: Saki
- Generated files changed: app/client/assets/books/generated/tea/manifest.json, app/client/assets/books/generated/tea/cleaned_book.json, app/client/assets/books/generated/tea/processed_book.json, app/client/assets/books/generated/tea/rights_report.json, app/client/assets/books/generated/tea/processing_notes.md, app/client/assets/books/generated/tea/sections/chapter-001.json
- Preview asset changed: public/book-previews/tea.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 29 - start at first readable prose after source/title/byline wrapper: James Cushat-Prinkly was a young man who had always had a settled; write pass starts at first selected/default section
- End boundary: cleaned line 177 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 9217 / 9217
- First default section after: Tea (1613 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: Tea (1613 words)

Supporting snippets:

- Title: TEA
- Author: Author: Saki
- Start: James Cushat-Prinkly was a young man who had always had a settled conviction that one of these days he would marry; up to the age of thirty-four he had done nothing to justify that conviction. He liked and admired a great many women collectively and dispassio
- End: uare. Rhoda was seated at a low table, behind a service of dainty porcelain and gleaming silver. There was a pleasant tinkling note in her voice as she handed him a cup. “You like it weaker than that, don’t you? Shall I put some more hot water to it? No?”

### the-bull

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE BULL.txt
- Expected/generated title: The Bull / The Bull
- Expected/generated author: Saki / Saki
- Author evidence: Gutenberg Author line - Author: Saki
- Generated files changed: app/client/assets/books/generated/the-bull/manifest.json, app/client/assets/books/generated/the-bull/cleaned_book.json, app/client/assets/books/generated/the-bull/processed_book.json, app/client/assets/books/generated/the-bull/rights_report.json, app/client/assets/books/generated/the-bull/processing_notes.md, app/client/assets/books/generated/the-bull/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-bull.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 29 - start at first readable prose after source/title/byline wrapper: Tom Yorkfield had always regarded his half-brother, Laurence, with a lazy; write pass starts at first selected/default section
- End boundary: cleaned line 179 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 9515 / 9515
- First default section after: The Bull (1705 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Bull (1705 words)

Supporting snippets:

- Title: THE BULL
- Author: Author: Saki
- Start: Tom Yorkfield had always regarded his half-brother, Laurence, with a lazy instinct of dislike, toned down, as years went on, to a tolerant feeling of indifference. There was nothing very tangible to dislike him for; he was just a blood-relation, with whom Tom
- End: ribs before he had fallen on the other side. That was Clover Fairy’s noteworthy achievement, which could never be taken away from him. Laurence continues to be popular as an animal artist, but his subjects are always kittens or fawns or lambkins—never bulls.

### the-cupboard-of-the-yesterdays

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE CUPBOARD OF THE YESTERDAYS.txt
- Expected/generated title: The Cupboard of the Yesterdays / The Cupboard of the Yesterdays
- Expected/generated author: Saki / Saki
- Author evidence: Gutenberg Author line - Author: Saki
- Generated files changed: app/client/assets/books/generated/the-cupboard-of-the-yesterdays/manifest.json, app/client/assets/books/generated/the-cupboard-of-the-yesterdays/cleaned_book.json, app/client/assets/books/generated/the-cupboard-of-the-yesterdays/processed_book.json, app/client/assets/books/generated/the-cupboard-of-the-yesterdays/rights_report.json, app/client/assets/books/generated/the-cupboard-of-the-yesterdays/processing_notes.md, app/client/assets/books/generated/the-cupboard-of-the-yesterdays/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-cupboard-of-the-yesterdays.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 29 - start at first readable prose after source/title/byline wrapper: “War is a cruelly destructive thing,” said the Wanderer, dropping his; write pass starts at first selected/default section
- End boundary: cleaned line 156 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 7939 / 7939
- First default section after: The Cupboard of the Yesterdays (1384 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Cupboard of the Yesterdays (1384 words)

Supporting snippets:

- Title: THE CUPBOARD OF THE YESTERDAYS
- Author: Author: Saki
- Start: War is a cruelly destructive thing, said the Wanderer, dropping his newspaper to the floor and staring reflectively into space. Ah, yes, indeed, said the Merchant, responding readily to what seemed like a safe platitude; when one thinks of the loss of li
- End: exhill of the East. “War is a wickedly destructive thing.” “Still, you must admit—” began the Merchant. But the Wanderer was not in the mood to admit anything. He rose impatiently and walked to where the tape-machine was busy with the news from Adrianople.

### the-disappearance-of-crispina-umberleigh

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE DISAPPEARANCE OF CRISPINA UMBERLEIGH.txt
- Expected/generated title: The Disappearance of Crispina Umberleigh / The Disappearance of Crispina Umberleigh
- Expected/generated author: Saki / Saki
- Author evidence: Gutenberg Author line - Author: Saki
- Generated files changed: app/client/assets/books/generated/the-disappearance-of-crispina-umberleigh/manifest.json, app/client/assets/books/generated/the-disappearance-of-crispina-umberleigh/cleaned_book.json, app/client/assets/books/generated/the-disappearance-of-crispina-umberleigh/processed_book.json, app/client/assets/books/generated/the-disappearance-of-crispina-umberleigh/rights_report.json, app/client/assets/books/generated/the-disappearance-of-crispina-umberleigh/processing_notes.md, app/client/assets/books/generated/the-disappearance-of-crispina-umberleigh/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-disappearance-of-crispina-umberleigh.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 29 - start at first readable prose after source/title/byline wrapper: In a first-class carriage of a train speeding Balkanward across the flat,; write pass starts at first selected/default section
- End boundary: cleaned line 205 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 10449 / 10449
- First default section after: The Disappearance of Crispina Umberleigh (1790 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Disappearance of Crispina Umberleigh (1790 words)

Supporting snippets:

- Title: THE DISAPPEARANCE OF CRISPINA UMBERLEIGH
- Author: Author: Saki
- Start: In a first-class carriage of a train speeding Balkanward across the flat, green Hungarian plain two Britons sat in friendly, fitful converse. They had first foregathered in the cold grey dawn at the frontier line, where the presiding eagle takes on an extra h
- End: eat in the political world after her return; the strain of trying to account satisfactorily for an unspecified expenditure of sixteen thousand pounds spread over eight years sufficiently occupied his mental energies. Here is Belgrad and another custom house.”

### the-guests

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE GUESTS.txt
- Expected/generated title: The Guests / The Guests
- Expected/generated author: Saki / Saki
- Author evidence: Gutenberg Author line - Author: Saki
- Generated files changed: app/client/assets/books/generated/the-guests/manifest.json, app/client/assets/books/generated/the-guests/cleaned_book.json, app/client/assets/books/generated/the-guests/processed_book.json, app/client/assets/books/generated/the-guests/rights_report.json, app/client/assets/books/generated/the-guests/processing_notes.md, app/client/assets/books/generated/the-guests/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-guests.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 29 - start at first readable prose after source/title/byline wrapper: “The landscape seen from our windows is certainly charming,” said; write pass starts at first selected/default section
- End boundary: cleaned line 176 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 8492 / 8492
- First default section after: The Guests (1498 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Guests (1498 words)

Supporting snippets:

- Title: THE GUESTS
- Author: Author: Saki
- Start: The landscape seen from our windows is certainly charming, said Annabel; those cherry orchards and green meadows, and the river winding along the valley, and the church tower peeping out among the elms, they all make a most effective picture. There s somet
- End: ted, it would probably merely have left the bedroom to come into the already over-crowded drawing-room. Altogether it was rather a relief when they both left. Now, perhaps, you can understand my appreciation of a sleepy countryside where things don’t happen.”

### the-hedgehog

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE HEDGEHOG.txt
- Expected/generated title: The Hedgehog / The Hedgehog
- Expected/generated author: Saki / Saki
- Author evidence: Gutenberg Author line - Author: Saki
- Generated files changed: app/client/assets/books/generated/the-hedgehog/manifest.json, app/client/assets/books/generated/the-hedgehog/cleaned_book.json, app/client/assets/books/generated/the-hedgehog/processed_book.json, app/client/assets/books/generated/the-hedgehog/rights_report.json, app/client/assets/books/generated/the-hedgehog/processing_notes.md, app/client/assets/books/generated/the-hedgehog/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-hedgehog.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 29 - start at first readable prose after source/title/byline wrapper: A “Mixed Double” of young people were contesting a game of lawn tennis at; write pass starts at first selected/default section
- End boundary: cleaned line 242 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 10818 / 10818
- First default section after: The Hedgehog (1907 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Hedgehog (1907 words)

Supporting snippets:

- Title: THE HEDGEHOG
- Author: Author: Saki
- Start: A Mixed Double of young people were contesting a game of lawn tennis at the Rectory garden party; for the past five-and-twenty years at least mixed doubles of young people had done exactly the same thing on exactly the same spot at about the same time of yea
- End: up Popple and think it’s old Harry Nicholson’s ghost; we always stop them from writing to the papers about it, though. That would be carrying matters too far.” Mrs. Hatch-Mallard renewed the lease in due course, but Ada Bleek has never renewed her friendship.

### the-image-of-the-lost-soul

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE IMAGE OF THE LOST SOUL.txt
- Expected/generated title: The Image of the Lost Soul / The Image of the Lost Soul
- Expected/generated author: Saki / Saki
- Author evidence: Gutenberg Author line - Author: Saki
- Generated files changed: app/client/assets/books/generated/the-image-of-the-lost-soul/manifest.json, app/client/assets/books/generated/the-image-of-the-lost-soul/cleaned_book.json, app/client/assets/books/generated/the-image-of-the-lost-soul/processed_book.json, app/client/assets/books/generated/the-image-of-the-lost-soul/rights_report.json, app/client/assets/books/generated/the-image-of-the-lost-soul/processing_notes.md, app/client/assets/books/generated/the-image-of-the-lost-soul/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-image-of-the-lost-soul.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 29 - start at first readable prose after source/title/byline wrapper: There were a number of carved stone figures placed at intervals along the; write pass starts at first selected/default section
- End boundary: cleaned line 107 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 4964 / 4964
- First default section after: The Image of the Lost Soul (883 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Image of the Lost Soul (883 words)

Supporting snippets:

- Title: THE IMAGE OF THE LOST SOUL
- Author: Author: Saki
- Start: There were a number of carved stone figures placed at intervals along the parapets of the old Cathedral; some of them represented angels, others kings and bishops, and nearly all were in attitudes of pious exaltation and composure. But one figure, low down on
- End: e the verger’s lodge. “It is just as well,” cooed the fat pigeons, after they had peered at the matter for some minutes; “now we shall have a nice angel put up there. Certainly they will put an angel there.” “After joy . . . sorrow,” rang out the great bell.

### the-interlopers

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE INTERLOPERS.txt
- Expected/generated title: The Interlopers / The Interlopers
- Expected/generated author: Saki / Saki
- Author evidence: Gutenberg Author line - Author: Saki
- Generated files changed: app/client/assets/books/generated/the-interlopers/manifest.json, app/client/assets/books/generated/the-interlopers/cleaned_book.json, app/client/assets/books/generated/the-interlopers/processed_book.json, app/client/assets/books/generated/the-interlopers/rights_report.json, app/client/assets/books/generated/the-interlopers/processing_notes.md, app/client/assets/books/generated/the-interlopers/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-interlopers.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 29 - start at first readable prose after source/title/byline wrapper: In a forest of mixed growth somewhere on the eastern spurs of the; write pass starts at first selected/default section
- End boundary: cleaned line 240 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 11854 / 11854
- First default section after: The Interlopers (2156 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Interlopers (2156 words)

Supporting snippets:

- Title: THE INTERLOPERS
- Author: Author: Saki
- Start: In a forest of mixed growth somewhere on the eastern spurs of the Karpathians, a man stood one winter night watching and listening, as though he waited for some beast of the woods to come within the range of his vision, and, later, of his rifle. But the game
- End: ted impatiently as Ulrich did not answer. “No,” said Ulrich with a laugh, the idiotic chattering laugh of a man unstrung with hideous fear. “Who are they?” asked Georg quickly, straining his eyes to see what the other would gladly not have seen. “_Wolves_.”

### the-mappined-life

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE MAPPINED LIFE.txt
- Expected/generated title: The Mappined Life / The Mappined Life
- Expected/generated author: Saki / Saki
- Author evidence: Gutenberg Author line - Author: Saki
- Generated files changed: app/client/assets/books/generated/the-mappined-life/manifest.json, app/client/assets/books/generated/the-mappined-life/cleaned_book.json, app/client/assets/books/generated/the-mappined-life/processed_book.json, app/client/assets/books/generated/the-mappined-life/rights_report.json, app/client/assets/books/generated/the-mappined-life/processing_notes.md, app/client/assets/books/generated/the-mappined-life/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-mappined-life.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 29 - start at first readable prose after source/title/byline wrapper: “These Mappin Terraces at the Zoological Gardens are a great improvement; write pass starts at first selected/default section
- End boundary: cleaned line 175 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 9048 / 9048
- First default section after: The Mappined Life (1614 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Mappined Life (1614 words)

Supporting snippets:

- Title: THE MAPPINED LIFE
- Author: Author: Saki
- Start: These Mappin Terraces at the Zoological Gardens are a great improvement on the old style of wild-beast cage, said Mrs. James Gurtleberry, putting down an illustrated paper; they give one the illusion of seeing the animals in their natural surroundings. I w
- End: inning to take on a very serious look. It’s my opinion that we haven’t seen the worst of things yet.” In this he was probably right, but there was nothing in the immediate or prospective condition of Albania to warrant Mrs. Gurtleberry in bursting into tears.

### the-occasional-garden

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE OCCASIONAL GARDEN.txt
- Expected/generated title: The Occasional Garden / The Occasional Garden
- Expected/generated author: Saki / Saki
- Author evidence: Gutenberg Author line - Author: Saki
- Generated files changed: app/client/assets/books/generated/the-occasional-garden/manifest.json, app/client/assets/books/generated/the-occasional-garden/cleaned_book.json, app/client/assets/books/generated/the-occasional-garden/processed_book.json, app/client/assets/books/generated/the-occasional-garden/rights_report.json, app/client/assets/books/generated/the-occasional-garden/processing_notes.md, app/client/assets/books/generated/the-occasional-garden/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-occasional-garden.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 29 - start at first readable prose after source/title/byline wrapper: “Don’t talk to me about town gardens,” said Elinor Rapsley; “which means,; write pass starts at first selected/default section
- End boundary: cleaned line 166 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 8715 / 8715
- First default section after: The Occasional Garden (1526 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Occasional Garden (1526 words)

Supporting snippets:

- Title: THE OCCASIONAL GARDEN
- Author: Author: Saki
- Start: Don t talk to me about town gardens, said Elinor Rapsley; which means, of course, that I want you to listen to me for an hour or so while I talk about nothing else. What a nice-sized garden you ve got, people said to us when we first moved here. What I
- End: ole thing in about ten minutes. I was so heart-broken at the havoc that I had the whole place cleared out; I shall have it laid out again on rather more elaborate lines.” “That,” she said to the Baroness afterwards “is what I call having an emergency brain.”

### the-phantom-luncheon

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE PHANTOM LUNCHEON.txt
- Expected/generated title: The Phantom Luncheon / The Phantom Luncheon
- Expected/generated author: Saki / Saki
- Author evidence: Gutenberg Author line - Author: Saki
- Generated files changed: app/client/assets/books/generated/the-phantom-luncheon/manifest.json, app/client/assets/books/generated/the-phantom-luncheon/cleaned_book.json, app/client/assets/books/generated/the-phantom-luncheon/processed_book.json, app/client/assets/books/generated/the-phantom-luncheon/rights_report.json, app/client/assets/books/generated/the-phantom-luncheon/processing_notes.md, app/client/assets/books/generated/the-phantom-luncheon/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-phantom-luncheon.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 29 - start at first readable prose after source/title/byline wrapper: “The Smithly-Dubbs are in Town,” said Sir James.  “I wish you would show; write pass starts at first selected/default section
- End boundary: cleaned line 204 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 8606 / 8606
- First default section after: The Phantom Luncheon (1515 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Phantom Luncheon (1515 words)

Supporting snippets:

- Title: THE PHANTOM LUNCHEON
- Author: Author: Saki
- Start: The Smithly-Dubbs are in Town, said Sir James. I wish you would show them some attention. Ask them to lunch with you at the Ritz or somewhere. From the little I ve seen of the Smithly-Dubbs I don t thing I want to cultivate their acquaintance, said La
- End: erative Ellen Niggle into the net of their hospitality was a catastrophe that they could not contemplate with any degree of calmness. The Smithly-Dubbs never quite recovered from their unnerving experience. They have given up politics and taken to doing good.

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
