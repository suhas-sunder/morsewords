# Pilot write batch 17

Controlled first-time processing pass for the exact raw-only books selected by pilot dry-run batch 17.

## Totals

- Selected: 20
- First-time processed: 20
- Skipped: 0
- Unresolved-source generated left untouched: 11

## Accepted Exclusion Count Clarification

- Dry-run accepted/corrected/verified exclusion count: 325
- Known duplicate/manual/boundary exclusions left unprocessed: the-wind-in-the-willows, the-two-magics-the-turn-of-the-screw-covering-end, the-works-of-edgar-allan-poe
- Selected books intersecting accepted exclusions: none
- Note: This write pass uses only the exact selected list from pilot-dry-run-17.json. Known duplicate/manual/boundary exclusions and unresolved-source generated books remain untouched.

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

### the-twelve-dancing-princesses

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE TWELVE DANCING PRINCESSES.txt
- Expected/generated title: The Twelve Dancing Princesses / The Twelve Dancing Princesses
- Expected/generated author: Jacob Grimm; Wilhelm Grimm / Jacob Grimm; Wilhelm Grimm
- Expected/generated creator role: authors: Jacob Grimm and Wilhelm Grimm (raw source labels them as authors) / represented in generated author metadata; authors: Jacob Grimm and Wilhelm Grimm (raw source labels them as authors)
- Author evidence: Gutenberg Author line - Author: Jacob Grimm; Wilhelm Grimm
- Metadata evidence: Gutenberg Author line - Author: Jacob Grimm; Wilhelm Grimm; visible collection byline - By Jacob Grimm and Wilhelm Grimm
- Generated files changed: app/client/assets/books/generated/the-twelve-dancing-princesses/manifest.json, app/client/assets/books/generated/the-twelve-dancing-princesses/cleaned_book.json, app/client/assets/books/generated/the-twelve-dancing-princesses/processed_book.json, app/client/assets/books/generated/the-twelve-dancing-princesses/rights_report.json, app/client/assets/books/generated/the-twelve-dancing-princesses/processing_notes.md, app/client/assets/books/generated/the-twelve-dancing-princesses/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-twelve-dancing-princesses.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: There was a king who had twelve beautiful daughters. They slept in; write pass starts at first selected/default section
- End boundary: cleaned line 138 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 8332 / 8332
- First default section after: The Twelve Dancing Princesses (1608 words)
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

- chapter-001: The Twelve Dancing Princesses (1608 words)

Supporting snippets:

- Title: THE TWELVE DANCING PRINCESSES
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: There was a king who had twelve beautiful daughters. They slept in twelve beds all in one room; and when they went to bed, the doors were shut and locked up; but every morning their shoes were found to be quite worn through as if they had been danced in all ni
- End: ppened, they confessed it all. And the king asked the soldier which of them he would choose for his wife; and he answered, ‘I am not very young, so I will have the eldest.’--And they were married that very day, and the soldier was chosen to be the king’s heir.

### the-twelve-huntsmen

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE TWELVE HUNTSMEN.txt
- Expected/generated title: The Twelve Huntsmen / The Twelve Huntsmen
- Expected/generated author: Jacob Grimm; Wilhelm Grimm / Jacob Grimm; Wilhelm Grimm
- Expected/generated creator role: authors: Jacob Grimm and Wilhelm Grimm (raw source labels them as authors) / represented in generated author metadata; authors: Jacob Grimm and Wilhelm Grimm (raw source labels them as authors)
- Author evidence: Gutenberg Author line - Author: Jacob Grimm; Wilhelm Grimm
- Metadata evidence: Gutenberg Author line - Author: Jacob Grimm; Wilhelm Grimm; visible collection byline - By Jacob Grimm and Wilhelm Grimm
- Generated files changed: app/client/assets/books/generated/the-twelve-huntsmen/manifest.json, app/client/assets/books/generated/the-twelve-huntsmen/cleaned_book.json, app/client/assets/books/generated/the-twelve-huntsmen/processed_book.json, app/client/assets/books/generated/the-twelve-huntsmen/rights_report.json, app/client/assets/books/generated/the-twelve-huntsmen/processing_notes.md, app/client/assets/books/generated/the-twelve-huntsmen/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-twelve-huntsmen.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: There was once a king’s son who had a bride whom he loved very much.; write pass starts at first selected/default section
- End boundary: cleaned line 94 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 5638 / 5638
- First default section after: The Twelve Huntsmen (1070 words)
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

- chapter-001: The Twelve Huntsmen (1070 words)

Supporting snippets:

- Title: THE TWELVE HUNTSMEN
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: There was once a king s son who had a bride whom he loved very much. And when he was sitting beside her and very happy, news came that his father lay sick unto death, and desired to see him once again before his end. Then he said to his beloved: I must now go
- End: treated her to return to her own kingdom, for he had a wife already, and someone who had just found an old key did not require a new one. Thereupon the wedding was celebrated, and the lion was again taken into favour, because, after all, he had told the truth.

### the-water-of-life

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE WATER OF LIFE.txt
- Expected/generated title: The Water of Life / The Water of Life
- Expected/generated author: Jacob Grimm; Wilhelm Grimm / Jacob Grimm; Wilhelm Grimm
- Expected/generated creator role: authors: Jacob Grimm and Wilhelm Grimm (raw source labels them as authors) / represented in generated author metadata; authors: Jacob Grimm and Wilhelm Grimm (raw source labels them as authors)
- Author evidence: Gutenberg Author line - Author: Jacob Grimm; Wilhelm Grimm
- Metadata evidence: Gutenberg Author line - Author: Jacob Grimm; Wilhelm Grimm; visible collection byline - By Jacob Grimm and Wilhelm Grimm
- Generated files changed: app/client/assets/books/generated/the-water-of-life/manifest.json, app/client/assets/books/generated/the-water-of-life/cleaned_book.json, app/client/assets/books/generated/the-water-of-life/processed_book.json, app/client/assets/books/generated/the-water-of-life/rights_report.json, app/client/assets/books/generated/the-water-of-life/processing_notes.md, app/client/assets/books/generated/the-water-of-life/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-water-of-life.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: Long before you or I were born, there reigned, in a country a great way; write pass starts at first selected/default section
- End boundary: cleaned line 229 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 14190 / 14190
- First default section after: The Water of Life (2835 words)
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

- chapter-001: The Water of Life (2835 words)

Supporting snippets:

- Title: THE WATER OF LIFE
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: Long before you or I were born, there reigned, in a country a great way off, a king who had three sons. This king once fell very ill--so ill that nobody thought he could live. His sons were very much grieved at their father s sickness; and as they were walking
- End: summons; and among the rest came the friendly dwarf, with the sugarloaf hat, and a new scarlet cloak. And the wedding was held, and the merry bells run. And all the good people they danced and they sung, And feasted and frolick’d I can’t tell how long.

### the-white-snake

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE WHITE SNAKE.txt
- Expected/generated title: The White Snake / The White Snake
- Expected/generated author: Jacob Grimm; Wilhelm Grimm / Jacob Grimm; Wilhelm Grimm
- Expected/generated creator role: authors: Jacob Grimm and Wilhelm Grimm (raw source labels them as authors) / represented in generated author metadata; authors: Jacob Grimm and Wilhelm Grimm (raw source labels them as authors)
- Author evidence: Gutenberg Author line - Author: Jacob Grimm; Wilhelm Grimm
- Metadata evidence: Gutenberg Author line - Author: Jacob Grimm; Wilhelm Grimm; visible collection byline - By Jacob Grimm and Wilhelm Grimm
- Generated files changed: app/client/assets/books/generated/the-white-snake/manifest.json, app/client/assets/books/generated/the-white-snake/cleaned_book.json, app/client/assets/books/generated/the-white-snake/processed_book.json, app/client/assets/books/generated/the-white-snake/rights_report.json, app/client/assets/books/generated/the-white-snake/processing_notes.md, app/client/assets/books/generated/the-white-snake/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-white-snake.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: A long time ago there lived a king who was famed for his wisdom through; write pass starts at first selected/default section
- End boundary: cleaned line 141 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 8361 / 8361
- First default section after: The White Snake (1611 words)
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

- chapter-001: The White Snake (1611 words)

Supporting snippets:

- Title: THE WHITE SNAKE
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: A long time ago there lived a king who was famed for his wisdom through all the land. Nothing was hidden from him, and it seemed as if news of the most secret things was brought to him through the air. But he had a strange custom; every day after dinner, when
- End: and took the Golden Apple to the king’s beautiful daughter, who had now no more excuses left to make. They cut the Apple of Life in two and ate it together; and then her heart became full of love for him, and they lived in undisturbed happiness to a great age.

### the-willow-wren-and-the-bear

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE WILLOW-WREN AND THE BEAR.txt
- Expected/generated title: The Willow-Wren and the Bear / The Willow-Wren and the Bear
- Expected/generated author: Jacob Grimm; Wilhelm Grimm / Jacob Grimm; Wilhelm Grimm
- Expected/generated creator role: authors: Jacob Grimm and Wilhelm Grimm (raw source labels them as authors) / represented in generated author metadata; authors: Jacob Grimm and Wilhelm Grimm (raw source labels them as authors)
- Author evidence: Gutenberg Author line - Author: Jacob Grimm; Wilhelm Grimm
- Metadata evidence: Gutenberg Author line - Author: Jacob Grimm; Wilhelm Grimm; visible collection byline - By Jacob Grimm and Wilhelm Grimm
- Generated files changed: app/client/assets/books/generated/the-willow-wren-and-the-bear/manifest.json, app/client/assets/books/generated/the-willow-wren-and-the-bear/cleaned_book.json, app/client/assets/books/generated/the-willow-wren-and-the-bear/processed_book.json, app/client/assets/books/generated/the-willow-wren-and-the-bear/rights_report.json, app/client/assets/books/generated/the-willow-wren-and-the-bear/processing_notes.md, app/client/assets/books/generated/the-willow-wren-and-the-bear/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-willow-wren-and-the-bear.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: Once in summer-time the bear and the wolf were walking in the forest,; write pass starts at first selected/default section
- End boundary: cleaned line 77 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 4794 / 4794
- First default section after: The Willow-Wren and the Bear (918 words)
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

- chapter-001: The Willow-Wren and the Bear (918 words)

Supporting snippets:

- Title: THE WILLOW-WREN AND THE BEAR
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: Once in summer-time the bear and the wolf were walking in the forest, and the bear heard a bird singing so beautifully that he said: Brother wolf, what bird is it that sings so well? That is the King of birds, said the wolf, before whom we must bow down.
- End: n, or else every rib of your body shall be broken.’ So the bear crept thither in the greatest fear, and begged their pardon. And now at last the young wrens were satisfied, and sat down together and ate and drank, and made merry till quite late into the night.

### the-wolf-and-the-seven-little-kids

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE WOLF AND THE SEVEN LITTLE KIDS.txt
- Expected/generated title: The Wolf and the Seven Little Kids / The Wolf and the Seven Little Kids
- Expected/generated author: Jacob Grimm; Wilhelm Grimm / Jacob Grimm; Wilhelm Grimm
- Expected/generated creator role: authors: Jacob Grimm and Wilhelm Grimm (raw source labels them as authors) / represented in generated author metadata; authors: Jacob Grimm and Wilhelm Grimm (raw source labels them as authors)
- Author evidence: Gutenberg Author line - Author: Jacob Grimm; Wilhelm Grimm
- Metadata evidence: Gutenberg Author line - Author: Jacob Grimm; Wilhelm Grimm; visible collection byline - By Jacob Grimm and Wilhelm Grimm
- Generated files changed: app/client/assets/books/generated/the-wolf-and-the-seven-little-kids/manifest.json, app/client/assets/books/generated/the-wolf-and-the-seven-little-kids/cleaned_book.json, app/client/assets/books/generated/the-wolf-and-the-seven-little-kids/processed_book.json, app/client/assets/books/generated/the-wolf-and-the-seven-little-kids/rights_report.json, app/client/assets/books/generated/the-wolf-and-the-seven-little-kids/processing_notes.md, app/client/assets/books/generated/the-wolf-and-the-seven-little-kids/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-wolf-and-the-seven-little-kids.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: There was once upon a time an old goat who had seven little kids, and; write pass starts at first selected/default section
- End boundary: cleaned line 97 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 5717 / 5717
- First default section after: The Wolf and the Seven Little Kids (1102 words)
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

- chapter-001: The Wolf and the Seven Little Kids (1102 words)

Supporting snippets:

- Title: THE WOLF AND THE SEVEN LITTLE KIDS
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: There was once upon a time an old goat who had seven little kids, and loved them with all the love of a mother for her children. One day she wanted to go into the forest and fetch some food. So she called all seven to her and said: Dear children, I have to go
- End: over the water to drink, the heavy stones made him fall in, and he drowned miserably. When the seven kids saw that, they came running to the spot and cried aloud: ‘The wolf is dead! The wolf is dead!’ and danced for joy round about the well with their mother.

### tom-thumb

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/TOM THUMB.txt
- Expected/generated title: Tom Thumb / Tom Thumb
- Expected/generated author: Jacob Grimm; Wilhelm Grimm / Jacob Grimm; Wilhelm Grimm
- Expected/generated creator role: authors: Jacob Grimm and Wilhelm Grimm (raw source labels them as authors) / represented in generated author metadata; authors: Jacob Grimm and Wilhelm Grimm (raw source labels them as authors)
- Author evidence: Gutenberg Author line - Author: Jacob Grimm; Wilhelm Grimm
- Metadata evidence: Gutenberg Author line - Author: Jacob Grimm; Wilhelm Grimm; visible collection byline - By Jacob Grimm and Wilhelm Grimm
- Generated files changed: app/client/assets/books/generated/tom-thumb/manifest.json, app/client/assets/books/generated/tom-thumb/cleaned_book.json, app/client/assets/books/generated/tom-thumb/processed_book.json, app/client/assets/books/generated/tom-thumb/rights_report.json, app/client/assets/books/generated/tom-thumb/processing_notes.md, app/client/assets/books/generated/tom-thumb/sections/chapter-001.json
- Preview asset changed: public/book-previews/tom-thumb.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: A poor woodman sat in his cottage one night, smoking his pipe by the; write pass starts at first selected/default section
- End boundary: cleaned line 215 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 12676 / 12676
- First default section after: Tom Thumb (2540 words)
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

- chapter-001: Tom Thumb (2540 words)

Supporting snippets:

- Title: TOM THUMB
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: A poor woodman sat in his cottage one night, smoking his pipe by the fireside, while his wife sat by his side spinning. How lonely it is, wife, said he, as he puffed out a long curl of smoke, for you and me to sit here by ourselves, without any children to
- End: ter Thumb stayed at home with his father and mother, in peace; for though he had been so great a traveller, and had done and seen so many fine things, and was fond enough of telling the whole story, he always agreed that, after all, there’s no place like HOME!

### elder-tree-mother

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/ELDER-TREE MOTHER.txt
- Expected/generated title: Elder-Tree Mother / Elder-Tree Mother
- Expected/generated author: H. C. Andersen / H. C. Andersen
- Expected/generated creator role: author: H. C. Andersen; editor: J. H. Stickney / represented in generated author metadata; author: H. C. Andersen; editor: J. H. Stickney
- Author evidence: Gutenberg Author line - Author: H. C. Andersen
- Metadata evidence: Gutenberg Author line - Author: H. C. Andersen; Gutenberg Editor line - Editor: J. H. Stickney
- Generated files changed: app/client/assets/books/generated/elder-tree-mother/manifest.json, app/client/assets/books/generated/elder-tree-mother/cleaned_book.json, app/client/assets/books/generated/elder-tree-mother/processed_book.json, app/client/assets/books/generated/elder-tree-mother/rights_report.json, app/client/assets/books/generated/elder-tree-mother/processing_notes.md, app/client/assets/books/generated/elder-tree-mother/sections/chapter-001.json
- Preview asset changed: public/book-previews/elder-tree-mother.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 86 - start at first readable prose after source/title/byline wrapper: THERE was once a little boy who had taken cold by going out and getting; write pass starts at first selected/default section
- End boundary: cleaned line 395 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 16473 / 16473
- First default section after: Elder-Tree Mother (3121 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: J. H. Stickney is source-backed as editor and must not replace H. C. Andersen in the author field; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: illustration captions/placeholders detected

All sections:

- chapter-001: Elder-Tree Mother (3121 words)

Supporting snippets:

- Title: ELDER-TREE MOTHER
- Author: Author: H. C. Andersen
- Start: THERE was once a little boy who had taken cold by going out and getting his feet wet. No one could think how he had managed to do so, for the weather was quite dry. His mother undressed him and put him to bed, and then she brought in the teapot to make him a g
- End: uld not take cold. "You have slept well while I have been disputing with the old man as to whether it was a real story or a fairy legend." "And where is the Elder-tree Mother?" asked the boy. "She is in the teapot," said the mother, "and there she may stay."

### little-thumbelina

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/LITTLE THUMBELINA.txt
- Expected/generated title: Little Thumbelina / Little Thumbelina
- Expected/generated author: H. C. Andersen / H. C. Andersen
- Expected/generated creator role: author: H. C. Andersen; editor: J. H. Stickney / represented in generated author metadata; author: H. C. Andersen; editor: J. H. Stickney
- Author evidence: Gutenberg Author line - Author: H. C. Andersen
- Metadata evidence: Gutenberg Author line - Author: H. C. Andersen; Gutenberg Editor line - Editor: J. H. Stickney
- Generated files changed: app/client/assets/books/generated/little-thumbelina/manifest.json, app/client/assets/books/generated/little-thumbelina/cleaned_book.json, app/client/assets/books/generated/little-thumbelina/processed_book.json, app/client/assets/books/generated/little-thumbelina/rights_report.json, app/client/assets/books/generated/little-thumbelina/processing_notes.md, app/client/assets/books/generated/little-thumbelina/sections/chapter-001.json
- Preview asset changed: public/book-previews/little-thumbelina.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 86 - start at first readable prose after source/title/byline wrapper: THERE was once a woman who wished very much to have a little child.; write pass starts at first selected/default section
- End boundary: cleaned line 505 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 22854 / 22854
- First default section after: Little Thumbelina (4351 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: J. H. Stickney is source-backed as editor and must not replace H. C. Andersen in the author field; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: illustration captions/placeholders detected

All sections:

- chapter-001: Little Thumbelina (4351 words)

Supporting snippets:

- Title: LITTLE THUMBELINA
- Author: Author: H. C. Andersen
- Start: THERE was once a woman who wished very much to have a little child. She went to a fairy and said: "I should so very much like to have a little child. Can you tell me where I can find one?" "Oh, that can be easily managed," said the fairy. "Here is a barleycor
- End: l," said the swallow, with a heavy heart, as he left the warm countries, to fly back into Denmark. There he had a nest over the window of a house in which dwelt the writer of fairy tales. The swallow sang "Tweet, tweet," and from his song came the whole story.

### sunshine-stories

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/SUNSHINE STORIES.txt
- Expected/generated title: Sunshine Stories / Sunshine Stories
- Expected/generated author: H. C. Andersen / H. C. Andersen
- Expected/generated creator role: author: H. C. Andersen; editor: J. H. Stickney / represented in generated author metadata; author: H. C. Andersen; editor: J. H. Stickney
- Author evidence: Gutenberg Author line - Author: H. C. Andersen
- Metadata evidence: Gutenberg Author line - Author: H. C. Andersen; Gutenberg Editor line - Editor: J. H. Stickney
- Generated files changed: app/client/assets/books/generated/sunshine-stories/manifest.json, app/client/assets/books/generated/sunshine-stories/cleaned_book.json, app/client/assets/books/generated/sunshine-stories/processed_book.json, app/client/assets/books/generated/sunshine-stories/rights_report.json, app/client/assets/books/generated/sunshine-stories/processing_notes.md, app/client/assets/books/generated/sunshine-stories/sections/chapter-001.json
- Preview asset changed: public/book-previews/sunshine-stories.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 86 - start at first readable prose after source/title/byline wrapper: "I AM going to tell a story," said the Wind.; write pass starts at first selected/default section
- End boundary: cleaned line 209 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 6263 / 6263
- First default section after: Sunshine Stories (1197 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: J. H. Stickney is source-backed as editor and must not replace H. C. Andersen in the author field; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: illustration captions/placeholders detected

All sections:

- chapter-001: Sunshine Stories (1197 words)

Supporting snippets:

- Title: SUNSHINE STORIES
- Author: Author: H. C. Andersen
- Start: "I AM going to tell a story," said the Wind. "I beg your pardon," said the Rain, "but now it is my turn. Have you not been howling round the corner this long time, as hard as ever you could?" "Is this the gratitude you owe me?" said the Wind; "I, who in hono
- End: ame a real Sunshine Story." "I think we had better stop now," said the Wind. "I am dreadfully bored. The Sunshine has talked long enough." "I think so, too," said the Rain. And what do we others who have heard the story say? We say, "Now the story's done."

### the-leaping-match

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE LEAPING MATCH.txt
- Expected/generated title: The Leaping Match / The Leaping Match
- Expected/generated author: H. C. Andersen / H. C. Andersen
- Expected/generated creator role: author: H. C. Andersen; editor: J. H. Stickney / represented in generated author metadata; author: H. C. Andersen; editor: J. H. Stickney
- Author evidence: Gutenberg Author line - Author: H. C. Andersen
- Metadata evidence: Gutenberg Author line - Author: H. C. Andersen; Gutenberg Editor line - Editor: J. H. Stickney
- Generated files changed: app/client/assets/books/generated/the-leaping-match/manifest.json, app/client/assets/books/generated/the-leaping-match/cleaned_book.json, app/client/assets/books/generated/the-leaping-match/processed_book.json, app/client/assets/books/generated/the-leaping-match/rights_report.json, app/client/assets/books/generated/the-leaping-match/processing_notes.md, app/client/assets/books/generated/the-leaping-match/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-leaping-match.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 86 - start at first readable prose after source/title/byline wrapper: THE Flea, the Grasshopper, and the Frog once wanted to see which of them; write pass starts at first selected/default section
- End boundary: cleaned line 161 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 3855 / 3855
- First default section after: The Leaping Match (734 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: J. H. Stickney is source-backed as editor and must not replace H. C. Andersen in the author field; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: illustration captions/placeholders detected

All sections:

- chapter-001: The Leaping Match (734 words)

Supporting snippets:

- Title: THE LEAPING MATCH
- Author: Author: H. C. Andersen
- Start: THE Flea, the Grasshopper, and the Frog once wanted to see which of them could jump the highest. They made a festival, and invited the whole world and every one else besides who liked to come and see the grand sight. Three famous jumpers they were, as all shou
- End: terior is what people care for nowadays." And then he began to sing in his own peculiar way--and it is from his song that we have taken this little piece of history, which may very possibly be all untrue, although it does stand printed here in black and white.

### a-fish-story

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/A Fish Story.txt
- Expected/generated title: A Fish Story / A Fish Story
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / represented in generated author metadata; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/a-fish-story/manifest.json, app/client/assets/books/generated/a-fish-story/cleaned_book.json, app/client/assets/books/generated/a-fish-story/processed_book.json, app/client/assets/books/generated/a-fish-story/rights_report.json, app/client/assets/books/generated/a-fish-story/processing_notes.md, app/client/assets/books/generated/a-fish-story/sections/chapter-001.json
- Preview asset changed: public/book-previews/a-fish-story.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: Perhaps you think that fishes were always fishes, and never lived; write pass starts at first selected/default section
- End boundary: cleaned line 71 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 4107 / 4107
- First default section after: A Fish Story (788 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: A Fish Story (788 words)

Supporting snippets:

- Title: A Fish Story
- Author: Author: Andrew Lang
- Start: Perhaps you think that fishes were always fishes, and never lived anywhere except in the water, but if you went to Australia and talked to the black people in the sandy desert in the centre of the country, you would learn something quite different. They would
- End: ever went out, like those upon land, but kept burning for ever. So now you know why, if you dive deep down below the cold surface of the water on a frosty day, you will find it comfortable and pleasant underneath, and be quite sorry that you cannot stay there.

### a-french-puck

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/A French Puck.txt
- Expected/generated title: A French Puck / A French Puck
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / represented in generated author metadata; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/a-french-puck/manifest.json, app/client/assets/books/generated/a-french-puck/cleaned_book.json, app/client/assets/books/generated/a-french-puck/processed_book.json, app/client/assets/books/generated/a-french-puck/rights_report.json, app/client/assets/books/generated/a-french-puck/processing_notes.md, app/client/assets/books/generated/a-french-puck/sections/chapter-001.json
- Preview asset changed: public/book-previews/a-french-puck.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: Among the mountain pastures and valleys; write pass starts at first selected/default section
- End boundary: cleaned line 114 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 5764 / 5764
- First default section after: A French Puck (1080 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: A French Puck (1080 words)

Supporting snippets:

- Title: A French Puck
- Author: Author: Andrew Lang
- Start: Among the mountain pastures and valleys that lie in the centre of France there dwelt a mischievous kind of spirit, whose delight it was to play tricks on everybody, and particularly on the shepherds and the cowboys. They never knew when they were safe from him
- End: tayed behind to examine the dress, determined, if she could, to find out the cause of the disaster. ‘The thread must have been rotten,’ she said to herself. ‘I will see if I can break it.’ But search as she would she could find none. The thread had vanished!

### a-lost-paradise

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/A Lost Paradise.txt
- Expected/generated title: A Lost Paradise / A Lost Paradise
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / represented in generated author metadata; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/a-lost-paradise/manifest.json, app/client/assets/books/generated/a-lost-paradise/cleaned_book.json, app/client/assets/books/generated/a-lost-paradise/processed_book.json, app/client/assets/books/generated/a-lost-paradise/rights_report.json, app/client/assets/books/generated/a-lost-paradise/processing_notes.md, app/client/assets/books/generated/a-lost-paradise/sections/chapter-001.json
- Preview asset changed: public/book-previews/a-lost-paradise.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: In the middle of a great forest there lived a long time ago a; write pass starts at first selected/default section
- End boundary: cleaned line 157 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 7405 / 7405
- First default section after: A Lost Paradise (1416 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: A Lost Paradise (1416 words)

Supporting snippets:

- Title: A Lost Paradise
- Author: Author: Andrew Lang
- Start: In the middle of a great forest there lived a long time ago a charcoal-burner and his wife. They were both young and handsome and strong, and when they got married, they thought work would never fail them. But bad times came, and they grew poorer and poorer, a
- End: k to your hut,’ said the king. ‘Your wife has the key.’ ‘Weren’t they silly?’ cried the grandchildren of the charcoal-burners when they heard the story. ‘How we wish that we had had the chance! WE should never have wanted to know what was in the soup-tureen!’

### how-brave-walter-hunted-wolves

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/How Brave Walter Hunted Wolves.txt
- Expected/generated title: How Brave Walter Hunted Wolves / How Brave Walter Hunted Wolves
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / represented in generated author metadata; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/how-brave-walter-hunted-wolves/manifest.json, app/client/assets/books/generated/how-brave-walter-hunted-wolves/cleaned_book.json, app/client/assets/books/generated/how-brave-walter-hunted-wolves/processed_book.json, app/client/assets/books/generated/how-brave-walter-hunted-wolves/rights_report.json, app/client/assets/books/generated/how-brave-walter-hunted-wolves/processing_notes.md, app/client/assets/books/generated/how-brave-walter-hunted-wolves/sections/chapter-001.json
- Preview asset changed: public/book-previews/how-brave-walter-hunted-wolves.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: A little back from the high road there stands a house; write pass starts at first selected/default section
- End boundary: cleaned line 258 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 12458 / 12458
- First default section after: How Brave Walter Hunted Wolves (2404 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: How Brave Walter Hunted Wolves (2404 words)

Supporting snippets:

- Title: How Brave Walter Hunted Wolves
- Author: Author: Andrew Lang
- Start: A little back from the high road there stands a house which is called Hemgard. Perhaps you remember the two beautiful mountain ash trees by the reddish-brown palings, and the high gate, and the garden with the beautiful barberry bushes which are always the f
- End: ‘I! You shall see, Jonas, when we next meet a bear. You see I like so much better to fight with bears.’ ‘Indeed!’ laughed Jonas. ‘Are you at it again? ‘Dear Walter, remember that it is only cowards who boast; a really brave man never talks of his bravery.’

### little-lasse

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/Little Lasse.txt
- Expected/generated title: Little Lasse / Little Lasse
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / represented in generated author metadata; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/little-lasse/manifest.json, app/client/assets/books/generated/little-lasse/cleaned_book.json, app/client/assets/books/generated/little-lasse/processed_book.json, app/client/assets/books/generated/little-lasse/rights_report.json, app/client/assets/books/generated/little-lasse/processing_notes.md, app/client/assets/books/generated/little-lasse/sections/chapter-001.json
- Preview asset changed: public/book-previews/little-lasse.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: There was once a little boy whose name was Lars; write pass starts at first selected/default section
- End boundary: cleaned line 291 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 14295 / 14295
- First default section after: Little Lasse (2659 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: Little Lasse (2659 words)

Supporting snippets:

- Title: Little Lasse
- Author: Author: Andrew Lang
- Start: There was once a little boy whose name was Lars, and because he was so little he was called Little Lasse; he was a brave little man, for he sailed round the world in a pea-shell boat. It was summer time, when the pea shells grew long and green in the garden.
- End: e lands and the burning deserts, the many coloured men and the wild creatures in the sea and in the woods, so that you may earn many things, but come gladly home again. Yes, who knows? Perhaps you also have sailed round the wide world once in a pea-shell boat.

### the-sea-king-s-gift

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Sea King’s Gift.txt
- Expected/generated title: The Sea King’s Gift / The Sea King’s Gift
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / represented in generated author metadata; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-sea-king-s-gift/manifest.json, app/client/assets/books/generated/the-sea-king-s-gift/cleaned_book.json, app/client/assets/books/generated/the-sea-king-s-gift/processed_book.json, app/client/assets/books/generated/the-sea-king-s-gift/rights_report.json, app/client/assets/books/generated/the-sea-king-s-gift/processing_notes.md, app/client/assets/books/generated/the-sea-king-s-gift/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-sea-king-s-gift.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: There was once a fisherman who was called Salmon; write pass starts at first selected/default section
- End boundary: cleaned line 447 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 19603 / 19603
- First default section after: The Sea King’s Gift (3703 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Sea King’s Gift (3703 words)

Supporting snippets:

- Title: The Sea King’s Gift
- Author: Author: Andrew Lang
- Start: There was once a fisherman who was called Salmon, and his Christian name was Matte. He lived by the shore of the big sea; where else could he live? He had a wife called Maie; could you find a better name for her? In winter they dwelt in a little cottage by the
- End: foolish fancies, mother, and then in your sleep you walked into the water.’ ‘But there is the fiddle,’ said Maie. ‘A fine fiddle! It is only an old stick. No, no, old woman, another time we will be more careful. Good luck never attends fishing on a Sunday.’

### the-story-of-a-very-bad-boy

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Story of a Very Bad Boy.txt
- Expected/generated title: The Story of a Very Bad Boy / The Story of a Very Bad Boy
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / represented in generated author metadata; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-story-of-a-very-bad-boy/manifest.json, app/client/assets/books/generated/the-story-of-a-very-bad-boy/cleaned_book.json, app/client/assets/books/generated/the-story-of-a-very-bad-boy/processed_book.json, app/client/assets/books/generated/the-story-of-a-very-bad-boy/rights_report.json, app/client/assets/books/generated/the-story-of-a-very-bad-boy/processing_notes.md, app/client/assets/books/generated/the-story-of-a-very-bad-boy/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-story-of-a-very-bad-boy.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: Once upon a time there lived in a little village; write pass starts at first selected/default section
- End boundary: cleaned line 227 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 11332 / 11332
- First default section after: The Story of a Very Bad Boy (2199 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Story of a Very Bad Boy (2199 words)

Supporting snippets:

- Title: The Story of a Very Bad Boy
- Author: Author: Andrew Lang
- Start: Once upon a time there lived in a little village in the very middle of France a widow and her only son, a boy about fifteen, whose name was Antoine, though no one ever called him anything but Toueno-Boueno. They were very poor indeed, and their hut shook about
- End: t three sacks and come with me to that rock which juts into the river. I will throw you in from there, and you will fall nearly on to the horses’ backs.’ So he threw them in, and as they were never seen again, no one ever knew into which fair they had fallen.

### the-three-crowns

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Three Crowns.txt
- Expected/generated title: The Three Crowns / The Three Crowns
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / represented in generated author metadata; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-three-crowns/manifest.json, app/client/assets/books/generated/the-three-crowns/cleaned_book.json, app/client/assets/books/generated/the-three-crowns/processed_book.json, app/client/assets/books/generated/the-three-crowns/rights_report.json, app/client/assets/books/generated/the-three-crowns/processing_notes.md, app/client/assets/books/generated/the-three-crowns/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-three-crowns.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: There was once a king who had three daughters.; write pass starts at first selected/default section
- End boundary: cleaned line 306 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 18894 / 18894
- First default section after: The Three Crowns (3732 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Three Crowns (3732 words)

Supporting snippets:

- Title: The Three Crowns
- Author: Author: Andrew Lang
- Start: There was once a king who had three daughters. The two eldest were very proud and quarrelsome, but the youngest was as good as they were bad. Well, three princes came to court them, and two of them were exactly like the eldest ladies, and one was just as lovab
- End: ay about the marriages, and they were all celebrated on the one day. Soon after, the two elder couples went to their own courts, but the youngest pair stayed with the old king, and they were as happy as the happiest married couple you ever heard of in a story.

### the-wonderful-tune

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Wonderful Tune.txt
- Expected/generated title: The Wonderful Tune / The Wonderful Tune
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / represented in generated author metadata; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited by Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-wonderful-tune/manifest.json, app/client/assets/books/generated/the-wonderful-tune/cleaned_book.json, app/client/assets/books/generated/the-wonderful-tune/processed_book.json, app/client/assets/books/generated/the-wonderful-tune/rights_report.json, app/client/assets/books/generated/the-wonderful-tune/processing_notes.md, app/client/assets/books/generated/the-wonderful-tune/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-wonderful-tune.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: Maurice Connor was the king; write pass starts at first selected/default section
- End boundary: cleaned line 258 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 12842 / 12842
- First default section after: The Wonderful Tune (2369 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Wonderful Tune (2369 words)

Supporting snippets:

- Title: The Wonderful Tune.
- Author: Author: Andrew Lang
- Start: Maurice Connor was the king, and that s no small word, of all the pipers in Munster. He could play jig and reel without end, and Ollistrum s March, and the Eagle s Whistle, and the Hen s Concert, and odd tunes of every sort and kind. But he knew one far more s
- End: tinguish Maurice Connor’s voice singing these words to his pipes-- Beautiful shore, with thy spreading strand, Thy crystal water, and diamond sand; Never would I have parted from thee, But for the sake of my fair ladie.

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
