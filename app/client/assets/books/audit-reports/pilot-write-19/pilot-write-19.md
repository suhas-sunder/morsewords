# Pilot write batch 19

Controlled first-time processing pass for the exact raw-only books selected by pilot dry-run batch 19.

## Totals

- Selected: 20
- First-time processed: 20
- Skipped: 0
- Unresolved-source generated left untouched: 11

## Accepted Exclusion Count Clarification

- Dry-run accepted/corrected/verified exclusion count: 365
- Known duplicate/manual/boundary exclusions left unprocessed: the-wind-in-the-willows, the-two-magics-the-turn-of-the-screw-covering-end, japanese-fairy-tales, the-works-of-edgar-allan-poe, snow-white-and-rose-red
- Selected books intersecting accepted exclusions: none
- Note: This write pass uses only the exact selected list from pilot-dry-run-19.json. Known duplicate/manual/boundary exclusions and unresolved-source generated books remain untouched.

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

### the-child-who-came-from-an-egg

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE CHILD WHO CAME FROM AN EGG.txt
- Expected/generated title: The Child Who Came from an Egg / The Child Who Came from an Egg
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-child-who-came-from-an-egg/manifest.json, app/client/assets/books/generated/the-child-who-came-from-an-egg/cleaned_book.json, app/client/assets/books/generated/the-child-who-came-from-an-egg/processed_book.json, app/client/assets/books/generated/the-child-who-came-from-an-egg/rights_report.json, app/client/assets/books/generated/the-child-who-came-from-an-egg/processing_notes.md, app/client/assets/books/generated/the-child-who-came-from-an-egg/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-child-who-came-from-an-egg.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: Once upon a time there lived a queen whose heart was sore because she; write pass starts at first selected/default section
- End boundary: cleaned line 312 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 16966 / 16966
- First default section after: The Child Who Came from an Egg (3268 words)
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

- chapter-001: The Child Who Came from an Egg (3268 words)

Supporting snippets:

- Title: THE CHILD WHO CAME FROM AN EGG
- Author: Author: Andrew Lang
- Start: Once upon a time there lived a queen whose heart was sore because she had no children. She was sad enough when her husband was at home with her, but when he was away she would see nobody, but sat and wept all day long. Now it happened that a war broke out wit
- End: the hands of a wizard.’ Then she vanished, and was never seen again, nor the wonder-working basket either; but now that Dotterine’s troubles were over she could get on without them, and she and the young king lived happily together till the end of their days.

### the-finest-liar-in-the-world

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE FINEST LIAR IN THE WORLD.txt
- Expected/generated title: The Finest Liar in the World / The Finest Liar in the World
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-finest-liar-in-the-world/manifest.json, app/client/assets/books/generated/the-finest-liar-in-the-world/cleaned_book.json, app/client/assets/books/generated/the-finest-liar-in-the-world/processed_book.json, app/client/assets/books/generated/the-finest-liar-in-the-world/rights_report.json, app/client/assets/books/generated/the-finest-liar-in-the-world/processing_notes.md, app/client/assets/books/generated/the-finest-liar-in-the-world/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-finest-liar-in-the-world.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: At the edge of a wood there lived an old man who had only one son, and; write pass starts at first selected/default section
- End boundary: cleaned line 138 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 7532 / 7532
- First default section after: The Finest Liar in the World (1546 words)
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

- chapter-001: The Finest Liar in the World (1546 words)

Supporting snippets:

- Title: THE FINEST LIAR IN THE WORLD
- Author: Author: Andrew Lang
- Start: At the edge of a wood there lived an old man who had only one son, and one day he called the boy to him and said he wanted some corn ground, but the youth must be sure never to enter any mill where the miller was beardless. The boy took the corn and set out,
- End: red a loud scream, and let fall a parchment on which was written, “The cake is mine, and the beardless one goes empty-handed.”’ With these words the boy rose, took the cake, and went home, while the beardless one remained behind to swallow his disappointment.

### the-frog

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE FROG.txt
- Expected/generated title: The Frog / The Frog
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-frog/manifest.json, app/client/assets/books/generated/the-frog/cleaned_book.json, app/client/assets/books/generated/the-frog/processed_book.json, app/client/assets/books/generated/the-frog/rights_report.json, app/client/assets/books/generated/the-frog/processing_notes.md, app/client/assets/books/generated/the-frog/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-frog.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: Once upon a time there was a woman who had three sons. Though they; write pass starts at first selected/default section
- End boundary: cleaned line 149 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 7168 / 7168
- First default section after: The Frog (1374 words)
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

- chapter-001: The Frog (1374 words)

Supporting snippets:

- Title: THE FROG
- Author: Author: Andrew Lang
- Start: Once upon a time there was a woman who had three sons. Though they were peasants they were well off, for the soil on which they lived was fruitful, and yielded rich crops. One day they all three told their mother they meant to get married. To which their mothe
- End: his lovely bride drove to his mother’s home. Great was the delight of the mother at her youngest son’s good fortune. A beautiful house was built for them; she was the favourite daughter-in-law; everything went well with them, and they lived happily ever after.

### the-grateful-prince

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE GRATEFUL PRINCE.txt
- Expected/generated title: The Grateful Prince / The Grateful Prince
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-grateful-prince/manifest.json, app/client/assets/books/generated/the-grateful-prince/cleaned_book.json, app/client/assets/books/generated/the-grateful-prince/processed_book.json, app/client/assets/books/generated/the-grateful-prince/rights_report.json, app/client/assets/books/generated/the-grateful-prince/processing_notes.md, app/client/assets/books/generated/the-grateful-prince/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-grateful-prince.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: Once upon a time the king of the Goldland lost himself in a forest, and; write pass starts at first selected/default section
- End boundary: cleaned line 653 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 32400 / 32400
- First default section after: The Grateful Prince (6294 words)
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

- chapter-001: The Grateful Prince (6294 words)

Supporting snippets:

- Title: THE GRATEFUL PRINCE
- Author: Author: Andrew Lang
- Start: Once upon a time the king of the Goldland lost himself in a forest, and try as he would he could not find the way out. As he was wandering down one path which had looked at first more hopeful than the rest he saw a man coming towards him. What are you doing
- End: nd, calling his councillors, he told them all the strange things that had befallen him, and how the maiden had borne him safe through all. And the councillors cried with one voice, ‘Let her be your wife, and our liege lady.’ And that is the end of the story.

### the-headless-dwarfs

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE HEADLESS DWARFS.txt
- Expected/generated title: The Headless Dwarfs / The Headless Dwarfs
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-headless-dwarfs/manifest.json, app/client/assets/books/generated/the-headless-dwarfs/cleaned_book.json, app/client/assets/books/generated/the-headless-dwarfs/processed_book.json, app/client/assets/books/generated/the-headless-dwarfs/rights_report.json, app/client/assets/books/generated/the-headless-dwarfs/processing_notes.md, app/client/assets/books/generated/the-headless-dwarfs/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-headless-dwarfs.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: There was once a minister who spent his whole time in trying to find; write pass starts at first selected/default section
- End boundary: cleaned line 286 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 14766 / 14766
- First default section after: The Headless Dwarfs (2840 words)
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

- chapter-001: The Headless Dwarfs (2840 words)

Supporting snippets:

- Title: THE HEADLESS DWARFS
- Author: Author: Andrew Lang
- Start: There was once a minister who spent his whole time in trying to find a servant who would undertake to ring the church bells at midnight, in addition to all his other duties. Of course it was not everyone who cared to get up in the middle of the night, when he
- End: d of service. As, however, he did not claim any wages, the minister made no objections, but allowed him to do as he wished. So Hans went his way, bought himself a large house, and married a young wife, and lived happily and prosperously to the end of his days.

### the-lute-player

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE LUTE PLAYER.txt
- Expected/generated title: The Lute Player / The Lute Player
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-lute-player/manifest.json, app/client/assets/books/generated/the-lute-player/cleaned_book.json, app/client/assets/books/generated/the-lute-player/processed_book.json, app/client/assets/books/generated/the-lute-player/rights_report.json, app/client/assets/books/generated/the-lute-player/processing_notes.md, app/client/assets/books/generated/the-lute-player/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-lute-player.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: Once upon a time there was a king and queen who lived happily and; write pass starts at first selected/default section
- End boundary: cleaned line 195 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 7771 / 7771
- First default section after: The Lute Player (1478 words)
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

- chapter-001: The Lute Player (1478 words)

Supporting snippets:

- Title: THE LUTE PLAYER
- Author: Author: Andrew Lang
- Start: Once upon a time there was a king and queen who lived happily and comfortably together. They were very fond of each other and had nothing to worry them, but at last the king grew restless. He longed to go out into the world, to try his strength in battle again
- End: tell how happy the king was? In the joy of his heart he gave a great feast to the whole world, and the whole world came and rejoiced with him for a whole week. I was there too, and ate and drank many good things. I sha’n’t forget that feast as long as I live.

### the-maiden-with-the-wooden-helmet

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE MAIDEN WITH THE WOODEN HELMET.txt
- Expected/generated title: The Maiden with the Wooden Helmet / The Maiden with the Wooden Helmet
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-maiden-with-the-wooden-helmet/manifest.json, app/client/assets/books/generated/the-maiden-with-the-wooden-helmet/cleaned_book.json, app/client/assets/books/generated/the-maiden-with-the-wooden-helmet/processed_book.json, app/client/assets/books/generated/the-maiden-with-the-wooden-helmet/rights_report.json, app/client/assets/books/generated/the-maiden-with-the-wooden-helmet/processing_notes.md, app/client/assets/books/generated/the-maiden-with-the-wooden-helmet/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-maiden-with-the-wooden-helmet.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: In a little village in the country of Japan there lived long, long ago a; write pass starts at first selected/default section
- End boundary: cleaned line 126 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 7507 / 7507
- First default section after: The Maiden with the Wooden Helmet (1454 words)
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

- chapter-001: The Maiden with the Wooden Helmet (1454 words)

Supporting snippets:

- Title: THE MAIDEN WITH THE WOODEN HELMET
- Author: Author: Andrew Lang
- Start: In a little village in the country of Japan there lived long, long ago a man and his wife. For many years they were happy and prosperous, but bad times came, and at last nothing was left them but their daughter, who was as beautiful as the morning. The neighbo
- End: hing they had ever seen or heard of. The night was passed in singing and dancing, and then the bride and bridegroom went to their own house, where they lived till they died, and had many children, who were famous throughout Japan for their goodness and beauty.

### the-monkey-and-the-jelly-fish

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE MONKEY AND THE JELLY-FISH.txt
- Expected/generated title: The Monkey and the Jelly-Fish / The Monkey and the Jelly-Fish
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-monkey-and-the-jelly-fish/manifest.json, app/client/assets/books/generated/the-monkey-and-the-jelly-fish/cleaned_book.json, app/client/assets/books/generated/the-monkey-and-the-jelly-fish/processed_book.json, app/client/assets/books/generated/the-monkey-and-the-jelly-fish/rights_report.json, app/client/assets/books/generated/the-monkey-and-the-jelly-fish/processing_notes.md, app/client/assets/books/generated/the-monkey-and-the-jelly-fish/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-monkey-and-the-jelly-fish.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: Children must often have wondered why jelly-fishes have no shells, like; write pass starts at first selected/default section
- End boundary: cleaned line 113 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 6656 / 6656
- First default section after: The Monkey and the Jelly-Fish (1296 words)
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

- chapter-001: The Monkey and the Jelly-Fish (1296 words)

Supporting snippets:

- Title: THE MONKEY AND THE JELLY-FISH
- Author: Author: Andrew Lang
- Start: Children must often have wondered why jelly-fishes have no shells, like so many of the creatures that are washed up every day on the beach. In old times this was not so; the jelly-fish had as hard a shell as any of them, but he lost it through his own fault, a
- End: ow he had suffered the monkey to escape. But, as sometimes happens, the turtle was allowed to go scot-free, and had his shell given back to him, and all the punishment fell on the poor jelly-fish, who was condemned by the queen to go shieldless for ever after.

### the-nine-pea-hens-and-the-golden-apples

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE NINE PEA-HENS AND THE GOLDEN APPLES.txt
- Expected/generated title: The Nine Pea-Hens and the Golden Apples / The Nine Pea-Hens and the Golden Apples
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-nine-pea-hens-and-the-golden-apples/manifest.json, app/client/assets/books/generated/the-nine-pea-hens-and-the-golden-apples/cleaned_book.json, app/client/assets/books/generated/the-nine-pea-hens-and-the-golden-apples/processed_book.json, app/client/assets/books/generated/the-nine-pea-hens-and-the-golden-apples/rights_report.json, app/client/assets/books/generated/the-nine-pea-hens-and-the-golden-apples/processing_notes.md, app/client/assets/books/generated/the-nine-pea-hens-and-the-golden-apples/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-nine-pea-hens-and-the-golden-apples.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: Once upon a time there stood before the palace of an emperor a golden; write pass starts at first selected/default section
- End boundary: cleaned line 386 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 18937 / 18937
- First default section after: The Nine Pea-Hens and the Golden Apples (3718 words)
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

- chapter-001: The Nine Pea-Hens and the Golden Apples (3718 words)

Supporting snippets:

- Title: THE NINE PEA-HENS AND THE GOLDEN APPLES
- Author: Author: Andrew Lang
- Start: Once upon a time there stood before the palace of an emperor a golden apple tree, which blossomed and bore fruit each night. But every morning the fruit was gone, and the boughs were bare of blossom, without anyone being able to discover who was the thief. At
- End: on the ground, and come and join us.’ And the dragon’s horse plunged and reared, and the dragon fell on a rock, which broke him in pieces. Then the empress mounted his horse, and rode back with her husband to her kingdom, over which they ruled for many years.

### the-nunda-eater-of-people

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE NUNDA, EATER OF PEOPLE.txt
- Expected/generated title: The Nunda, Eater of People / The Nunda, Eater of People
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-nunda-eater-of-people/manifest.json, app/client/assets/books/generated/the-nunda-eater-of-people/cleaned_book.json, app/client/assets/books/generated/the-nunda-eater-of-people/processed_book.json, app/client/assets/books/generated/the-nunda-eater-of-people/rights_report.json, app/client/assets/books/generated/the-nunda-eater-of-people/processing_notes.md, app/client/assets/books/generated/the-nunda-eater-of-people/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-nunda-eater-of-people.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: Once upon a time there lived a sultan who loved his garden dearly,; write pass starts at first selected/default section
- End boundary: cleaned line 455 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 20298 / 20298
- First default section after: The Nunda, Eater of People (4060 words)
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

- chapter-001: The Nunda, Eater of People (4060 words)

Supporting snippets:

- Title: THE NUNDA, EATER OF PEOPLE
- Author: Author: Andrew Lang
- Start: Once upon a time there lived a sultan who loved his garden dearly, and planted it with trees and flowers and fruits from all parts of the world. He went to see them three times every day: first at seven o clock, when he got up, then at three, and lastly at hal
- End: ging the Nunda with him, he felt that the man did not dwell on the earth whose joy was greater than his. And the people bowed down to the boy and gave him presents, and loved him, because he had delivered them from the bondage of fear, and had slain the Nunda.

### the-prince-who-wanted-to-see-the-world

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE PRINCE WHO WANTED TO SEE THE WORLD.txt
- Expected/generated title: The Prince Who Wanted to See the World / The Prince Who Wanted to See the World
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-prince-who-wanted-to-see-the-world/manifest.json, app/client/assets/books/generated/the-prince-who-wanted-to-see-the-world/cleaned_book.json, app/client/assets/books/generated/the-prince-who-wanted-to-see-the-world/processed_book.json, app/client/assets/books/generated/the-prince-who-wanted-to-see-the-world/rights_report.json, app/client/assets/books/generated/the-prince-who-wanted-to-see-the-world/processing_notes.md, app/client/assets/books/generated/the-prince-who-wanted-to-see-the-world/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-prince-who-wanted-to-see-the-world.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: There was once a king who had only one son, and this young man tormented; write pass starts at first selected/default section
- End boundary: cleaned line 224 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 11830 / 11830
- First default section after: The Prince Who Wanted to See the World (2340 words)
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

- chapter-001: The Prince Who Wanted to See the World (2340 words)

Supporting snippets:

- Title: THE PRINCE WHO WANTED TO SEE THE WORLD
- Author: Author: Andrew Lang
- Start: There was once a king who had only one son, and this young man tormented his father from morning till night to allow him to travel in far countries. For a long time the king refused to give him leave; but at last, wearied out, he granted permission, and ordere
- End: lar round his neck, and held a feather on which was written the name of the dove. And at last his memory came back to him, and he declared he would marry the princess and nobody else. So the next day the wedding took place, and they lived happy till they died.

### the-princess-who-was-hidden-underground

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE PRINCESS WHO WAS HIDDEN UNDERGROUND.txt
- Expected/generated title: The Princess Who Was Hidden Underground / The Princess Who Was Hidden Underground
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-princess-who-was-hidden-underground/manifest.json, app/client/assets/books/generated/the-princess-who-was-hidden-underground/cleaned_book.json, app/client/assets/books/generated/the-princess-who-was-hidden-underground/processed_book.json, app/client/assets/books/generated/the-princess-who-was-hidden-underground/rights_report.json, app/client/assets/books/generated/the-princess-who-was-hidden-underground/processing_notes.md, app/client/assets/books/generated/the-princess-who-was-hidden-underground/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-princess-who-was-hidden-underground.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: Once there was a king who had great riches, which, when he died, he; write pass starts at first selected/default section
- End boundary: cleaned line 115 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 5308 / 5308
- First default section after: The Princess Who Was Hidden Underground (1022 words)
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

- chapter-001: The Princess Who Was Hidden Underground (1022 words)

Supporting snippets:

- Title: THE PRINCESS WHO WAS HIDDEN UNDERGROUND
- Author: Author: Andrew Lang
- Start: Once there was a king who had great riches, which, when he died, he divided among his three sons. The two eldest of these lived in rioting and feasting, and thus wasted and squandered their father s wealth till nothing remained, and they found themselves in wa
- End: cording to their understanding, began to clean her wings with her bill, and the lad said: ‘She who cleans her wings is the princess.’ Now the king could do nothing more but give her to the young man to wife, and they lived together in great joy and happiness.

### the-story-of-a-gazelle

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE STORY OF A GAZELLE.txt
- Expected/generated title: The Story of a Gazelle / The Story of a Gazelle
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-story-of-a-gazelle/manifest.json, app/client/assets/books/generated/the-story-of-a-gazelle/cleaned_book.json, app/client/assets/books/generated/the-story-of-a-gazelle/processed_book.json, app/client/assets/books/generated/the-story-of-a-gazelle/rights_report.json, app/client/assets/books/generated/the-story-of-a-gazelle/processing_notes.md, app/client/assets/books/generated/the-story-of-a-gazelle/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-story-of-a-gazelle.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: Once upon a time there lived a man who wasted all his money, and grew; write pass starts at first selected/default section
- End boundary: cleaned line 635 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 29273 / 29273
- First default section after: The Story of a Gazelle (5790 words)
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

- chapter-001: The Story of a Gazelle (5790 words)

Supporting snippets:

- Title: THE STORY OF A GAZELLE
- Author: Author: Andrew Lang
- Start: Once upon a time there lived a man who wasted all his money, and grew so poor that his only food was a few grains of corn, which he scratched like a fowl from out of a dust-heap. One day he was scratching as usual among a dust-heap in the street, hoping to fi
- End: her husband’s side, and in her sleep she dreamed that she was once more in her father’s house, and when she woke up it was no dream. And the man dreamed that he was on the dust-heap, scratching. And when he woke, behold! that also was no dream, but the truth.

### the-story-of-halfman

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE STORY OF HALFMAN.txt
- Expected/generated title: The Story of Halfman / The Story of Halfman
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-story-of-halfman/manifest.json, app/client/assets/books/generated/the-story-of-halfman/cleaned_book.json, app/client/assets/books/generated/the-story-of-halfman/processed_book.json, app/client/assets/books/generated/the-story-of-halfman/rights_report.json, app/client/assets/books/generated/the-story-of-halfman/processing_notes.md, app/client/assets/books/generated/the-story-of-halfman/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-story-of-halfman.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: In a certain town there lived a judge who was married but had no; write pass starts at first selected/default section
- End boundary: cleaned line 439 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 18552 / 18552
- First default section after: The Story of Halfman (3637 words)
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

- chapter-001: The Story of Halfman (3637 words)

Supporting snippets:

- Title: THE STORY OF HALFMAN
- Author: Author: Andrew Lang
- Start: In a certain town there lived a judge who was married but had no children. One day he was standing lost in thought before his house, when an old man passed by. What is the matter, sir, said he, you look troubled? Oh, leave me alone, my good man! But w
- End: y mother greeting and tell her not to be anxious any more, for she can keep all her children.’ And Halfman mounted his horse and rode home, and told his wife all he had seen, and the message sent by Mohammed--Mohammed the son of Halfman, the son of the judge.

### the-story-of-hassebu

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE STORY OF HASSEBU.txt
- Expected/generated title: The Story of Hassebu / The Story of Hassebu
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-story-of-hassebu/manifest.json, app/client/assets/books/generated/the-story-of-hassebu/cleaned_book.json, app/client/assets/books/generated/the-story-of-hassebu/processed_book.json, app/client/assets/books/generated/the-story-of-hassebu/rights_report.json, app/client/assets/books/generated/the-story-of-hassebu/processing_notes.md, app/client/assets/books/generated/the-story-of-hassebu/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-story-of-hassebu.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: Once upon a time there lived a poor woman who had only one child, and; write pass starts at first selected/default section
- End boundary: cleaned line 191 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 9170 / 9170
- First default section after: The Story of Hassebu (1853 words)
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

- chapter-001: The Story of Hassebu (1853 words)

Supporting snippets:

- Title: THE STORY OF HASSEBU
- Author: Author: Andrew Lang
- Start: Once upon a time there lived a poor woman who had only one child, and he was a little boy called Hassebu. When he ceased to be a baby, and his mother thought it was time for him to learn to read, she sent him to school. And, after he had done with school, he w
- End: your soul will rest.’ And they went their way into the town, and all happened as the King of the Snakes had said. And the Sultan loved Hassebu, who became a great physician, and cured many sick people. But he was always sorry for the poor King of the Snakes.

### the-story-of-three-wonderful-beggars

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE STORY OF THREE WONDERFUL BEGGARS.txt
- Expected/generated title: The Story of Three Wonderful Beggars / The Story of Three Wonderful Beggars
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-story-of-three-wonderful-beggars/manifest.json, app/client/assets/books/generated/the-story-of-three-wonderful-beggars/cleaned_book.json, app/client/assets/books/generated/the-story-of-three-wonderful-beggars/processed_book.json, app/client/assets/books/generated/the-story-of-three-wonderful-beggars/rights_report.json, app/client/assets/books/generated/the-story-of-three-wonderful-beggars/processing_notes.md, app/client/assets/books/generated/the-story-of-three-wonderful-beggars/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-story-of-three-wonderful-beggars.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: There once lived a merchant whose name was Mark, and whom people called; write pass starts at first selected/default section
- End boundary: cleaned line 327 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 14244 / 14244
- First default section after: The Story of Three Wonderful Beggars (2774 words)
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

- chapter-001: The Story of Three Wonderful Beggars (2774 words)

Supporting snippets:

- Title: THE STORY OF THREE WONDERFUL BEGGARS
- Author: Author: Andrew Lang
- Start: There once lived a merchant whose name was Mark, and whom people called Mark the Rich. He was a very hard-hearted man, for he could not bear poor people, and if he caught sight of a beggar anywhere near his house, he would order the servants to drive him awa
- End: . He helped the poor and fed and clothed the hungry and naked and all Mark’s riches became his. For many years Mark has been ferrying people across the river. His face is wrinkled, his hair and beard are snow white, and his eyes are dim; but still he rows on.

### the-three-princes-and-their-beasts

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE THREE PRINCES AND THEIR BEASTS.txt
- Expected/generated title: The Three Princes and Their Beasts / The Three Princes and Their Beasts
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-three-princes-and-their-beasts/manifest.json, app/client/assets/books/generated/the-three-princes-and-their-beasts/cleaned_book.json, app/client/assets/books/generated/the-three-princes-and-their-beasts/processed_book.json, app/client/assets/books/generated/the-three-princes-and-their-beasts/rights_report.json, app/client/assets/books/generated/the-three-princes-and-their-beasts/processing_notes.md, app/client/assets/books/generated/the-three-princes-and-their-beasts/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-three-princes-and-their-beasts.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: Once on a time there were three princes, who had a step-sister. One day; write pass starts at first selected/default section
- End boundary: cleaned line 279 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 14155 / 14155
- First default section after: The Three Princes and Their Beasts (2779 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: creator metadata comes from Gutenberg Author line and editor metadata is preserved as Andrew Lang in rights_report.json
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Prose-preservation verdict: passed: generated readable body matches the sanitized raw story body character-for-character and no generated copy diverges
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: contents or list material must not enter default playback; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run author metadata risk: future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Three Princes and Their Beasts (2779 words)

Supporting snippets:

- Title: THE THREE PRINCES AND THEIR BEASTS
- Author: Author: Andrew Lang
- Start: Once on a time there were three princes, who had a step-sister. One day they all set out hunting together. When they had gone some way through a thick wood they came on a great grey wolf with three cubs. Just as they were going to shoot, the wolf spoke and sai
- End: before their brother, and their beasts stood round them. Then the three princes set off together to the town. And the king did not know which was his son-in-law, but the princess knew which was her husband, and there were great rejoicings throughout the land.

### the-two-frogs

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE TWO FROGS.txt
- Expected/generated title: The Two Frogs / The Two Frogs
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-two-frogs/manifest.json, app/client/assets/books/generated/the-two-frogs/cleaned_book.json, app/client/assets/books/generated/the-two-frogs/processed_book.json, app/client/assets/books/generated/the-two-frogs/rights_report.json, app/client/assets/books/generated/the-two-frogs/processing_notes.md, app/client/assets/books/generated/the-two-frogs/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-two-frogs.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: Once upon a time in the country of Japan there lived two frogs, one of; write pass starts at first selected/default section
- End boundary: cleaned line 55 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 3014 / 3014
- First default section after: The Two Frogs (592 words)
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

- chapter-001: The Two Frogs (592 words)

Supporting snippets:

- Title: THE TWO FROGS
- Author: Author: Andrew Lang
- Start: Once upon a time in the country of Japan there lived two frogs, one of whom made his home in a ditch near the town of Osaka, on the sea coast, while the other dwelt in a clear little stream which ran through the city of Kioto. At such a great distance apart, t
- End: and they both fell down on the grass. Then they took a polite farewell of each other, and set off for home again, and to the end of their lives they believed that Osaka and Kioto, which are as different to look at as two towns can be, were as like as two peas.

### the-underground-workers

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE UNDERGROUND WORKERS.txt
- Expected/generated title: The Underground Workers / The Underground Workers
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-underground-workers/manifest.json, app/client/assets/books/generated/the-underground-workers/cleaned_book.json, app/client/assets/books/generated/the-underground-workers/processed_book.json, app/client/assets/books/generated/the-underground-workers/rights_report.json, app/client/assets/books/generated/the-underground-workers/processing_notes.md, app/client/assets/books/generated/the-underground-workers/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-underground-workers.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: On a bitter night somewhere between Christmas and the New Year, a man; write pass starts at first selected/default section
- End boundary: cleaned line 217 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 11922 / 11922
- First default section after: The Underground Workers (2297 words)
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

- chapter-001: The Underground Workers (2297 words)

Supporting snippets:

- Title: THE UNDERGROUND WORKERS
- Author: Author: Andrew Lang
- Start: On a bitter night somewhere between Christmas and the New Year, a man set out to walk to the neighbouring village. It was not many miles off, but the snow was so thick that there were no roads, or walls, or hedges left to guide him, and very soon he lost his w
- End: , and after he had paid for it there was plenty of money left over. When he was settled, he married a pretty girl who lived near by, and had some children, to whom on his death-bed he told the story of the lord of the underworld, and how he had made Hans rich.

### the-young-man-who-would-have-his-eyes-opened

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE YOUNG MAN WHO WOULD HAVE HIS EYES OPENED.txt
- Expected/generated title: The Young Man Who Would Have His Eyes Opened / The Young Man Who Would Have His Eyes Opened
- Expected/generated author: Andrew Lang / Andrew Lang
- Expected/generated creator role: editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by) / editor: Andrew Lang in rights_report.json; creator name retained in generated author field
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Metadata evidence: Gutenberg Author line - Author: Andrew Lang; visible editor byline - Edited By Andrew Lang
- Generated files changed: app/client/assets/books/generated/the-young-man-who-would-have-his-eyes-opened/manifest.json, app/client/assets/books/generated/the-young-man-who-would-have-his-eyes-opened/cleaned_book.json, app/client/assets/books/generated/the-young-man-who-would-have-his-eyes-opened/processed_book.json, app/client/assets/books/generated/the-young-man-who-would-have-his-eyes-opened/rights_report.json, app/client/assets/books/generated/the-young-man-who-would-have-his-eyes-opened/processing_notes.md, app/client/assets/books/generated/the-young-man-who-would-have-his-eyes-opened/sections/chapter-001.json
- Preview asset changed: public/book-previews/the-young-man-who-would-have-his-eyes-opened.preview.json
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at first readable prose after source/title/byline wrapper: Once upon a time there lived a youth who was never happy unless he was; write pass starts at first selected/default section
- End boundary: cleaned line 111 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- Raw-vs-generated body comparison: pass: generated readable body matches the sanitized raw story body character-for-character across section, cleaned, and processed copies
- Raw/generated body characters: 6811 / 6811
- First default section after: The Young Man Who Would Have His Eyes Opened (1300 words)
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

- chapter-001: The Young Man Who Would Have His Eyes Opened (1300 words)

Supporting snippets:

- Title: THE YOUNG MAN WHO WOULD HAVE HIS EYES OPENED
- Author: Author: Andrew Lang
- Start: Once upon a time there lived a youth who was never happy unless he was prying into something that other people knew nothing about. After he had learned to understand the language of birds and beasts, he discovered accidentally that a great deal took place unde
- End: em night and day, and ceased to care about anything else in the world, and was sick to the end of his life with longing for that beautiful vision. And that was the way he learned that the wizard had spoken truly when he said, ‘Blindness is man’s highest good.’

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

Dry-run 19 still had 116 skipped/unsafe raw-only candidates before write.
These are not treated as lost or missed.
After safe batching slows/exhausts, create a dedicated remaining raw inventory/triage report classifying every unprocessed raw file.

## Later-phase requirements

- after all books are processed, run an independent second-pass audit using a different strategy
- after books and second-pass audit, add original non-spoiler 300-500+ word SEO summaries for each accepted book page
- after summaries, perform full site SEO/meta review using GSC data and route-level intent
- after books/SEO, run a focused rage-click UX pass for /audio, /practice, homepage, and related utility pages
- investigate the SSR heap OOM separately if it keeps appearing during plain npm run build
- final cleanup should remove temporary audit scripts/reports and code bloat only after everything is stable
