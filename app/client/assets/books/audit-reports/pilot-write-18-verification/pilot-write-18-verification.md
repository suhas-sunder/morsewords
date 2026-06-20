# Pilot write batch 18 verification

Generated: 2026-06-20T18:34:33.099Z

## Summary

- Verified: 20
- Pass: 20
- Warn accepted: 0
- Fail: 0
- Accepted for main: 20
- Correction needed before main: 0
- Raw/generated exact: 20/20

## Write-12 Shared Script Scope

- Classification: harmless shared implementation intentionally used by write batch 18
- Resolution: Retain the write-12 change. Batches 13-18 use five-line wrappers that set MORSEWORDS_PILOT_WRITE_BATCH and import the established write-12 runner; this diff adds batch-18 typing/selection/dispatch, source-backed editor preservation, and the batch-18 known-skip list.
- Unrelated changes found: no

## Batch-12 Prose Restoration

- Result: pass
- Compared: 20
- Remaining raw/generated mismatches: 0
- Remaining prose omissions: 0
- Remaining missing opening-quote defects: 0

## Special Focus

- Exact spelling: Tontlawald, Mogarzea, Schippeitaro, Stan Bolovan, and Djulung match source-audited titles exactly.
- Andrew Lang role: 20/20 rights reports preserve Andrew Lang as editor from visible source evidence; no batch-18 title uses Unknown Author.
- Wrapped-line prose: 20/20 sanitized raw bodies match every generated body copy character-for-character (20/20 exact).
- Collection metadata/playback: 20/20 use the individual tale title and exclude parent collection/title/byline/source wrapper material from default playback.

## Books

### virgilius-the-sorcerer

- Status: pass
- Generated output inspected: app/client/assets/books/generated/virgilius-the-sorcerer/manifest.json, app/client/assets/books/generated/virgilius-the-sorcerer/cleaned_book.json, app/client/assets/books/generated/virgilius-the-sorcerer/processed_book.json, app/client/assets/books/generated/virgilius-the-sorcerer/rights_report.json, app/client/assets/books/generated/virgilius-the-sorcerer/processing_notes.md, app/client/assets/books/generated/virgilius-the-sorcerer/sections/chapter-001.json
- Preview inspected: public/book-previews/virgilius-the-sorcerer.preview.json
- Title: pass - Individual title preserved exactly as "Virgilius the Sorcerer"; parent collection "The Violet Fairy Book" is excluded from title and playback.
- Creator/editor metadata: pass - Andrew Lang is source-backed as editor; rights metadata preserves that role, the legacy creator array contains no Unknown Author, and collection metadata does not replace tale metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: VIRGILIUS THE SORCERER
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Long, long ago there was born to a Roman knight and his wife Maja a little boy called Virgilius. While he was still quite little, his father died, and the kinsmen, instead of being a help and protection to the child a... / Long, long ago there was born to a Roman knight and his wife Maja a little boy called Virgilius. While he was still quite little, his father died, and the kinsmen, instead of being a help and protection to the child a...
- Raw/generated end: ...day. And when the egg shakes the city quakes, and when the egg shall be broken the city shall be destroyed. And the city Virgilius filled full of wonders, such as never were seen before, and he called its name Naples. / ...day. And when the egg shakes the city quakes, and when the egg shall be broken the city shall be destroyed. And the city Virgilius filled full of wonders, such as never were seen before, and he called its name Naples.
- Preview start: Long, long ago there was born to a Roman knight and his wife Maja a little boy called Virgilius. While he was still quite little, his father died, and the kinsmen, instead of being a help and protection to the child a...

### the-fairy-of-the-dawn

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-fairy-of-the-dawn/manifest.json, app/client/assets/books/generated/the-fairy-of-the-dawn/cleaned_book.json, app/client/assets/books/generated/the-fairy-of-the-dawn/processed_book.json, app/client/assets/books/generated/the-fairy-of-the-dawn/rights_report.json, app/client/assets/books/generated/the-fairy-of-the-dawn/processing_notes.md, app/client/assets/books/generated/the-fairy-of-the-dawn/sections/chapter-001.json
- Preview inspected: public/book-previews/the-fairy-of-the-dawn.preview.json
- Title: pass - Individual title preserved exactly as "The Fairy of the Dawn"; parent collection "The Violet Fairy Book" is excluded from title and playback.
- Creator/editor metadata: pass - Andrew Lang is source-backed as editor; rights metadata preserves that role, the legacy creator array contains no Unknown Author, and collection metadata does not replace tale metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: THE FAIRY OF THE DAWN
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Once upon a time what should happen DID happen; and if it had not happened this tale would never have been told. There was once an emperor, very great and mighty, and he ruled over an empire so large that no one knew ... / Once upon a time what should happen DID happen; and if it had not happened this tale would never have been told. There was once an emperor, very great and mighty, and he ruled over an empire so large that no one knew ...
- Raw/generated end: ...o protect you from harm.’ The horse neighed, and Petru knew what it meant, and did not go with his brothers. No, he went home to his father, and cured his blindness; and as for his brothers, they never returned again. / ...o protect you from harm.’ The horse neighed, and Petru knew what it meant, and did not go with his brothers. No, he went home to his father, and cured his blindness; and as for his brothers, they never returned again.
- Preview start: Once upon a time what should happen DID happen; and if it had not happened this tale would never have been told. There was once an emperor, very great and mighty, and he ruled over an empire so large that no one knew ...

### the-brownie-of-the-lake

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-brownie-of-the-lake/manifest.json, app/client/assets/books/generated/the-brownie-of-the-lake/cleaned_book.json, app/client/assets/books/generated/the-brownie-of-the-lake/processed_book.json, app/client/assets/books/generated/the-brownie-of-the-lake/rights_report.json, app/client/assets/books/generated/the-brownie-of-the-lake/processing_notes.md, app/client/assets/books/generated/the-brownie-of-the-lake/sections/chapter-001.json
- Preview inspected: public/book-previews/the-brownie-of-the-lake.preview.json
- Title: pass - Individual title preserved exactly as "The Brownie of the Lake"; parent collection "The Lilac Fairy Book" is excluded from title and playback.
- Creator/editor metadata: pass - Andrew Lang is source-backed as editor; rights metadata preserves that role, the legacy creator array contains no Unknown Author, and collection metadata does not replace tale metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: The Brownie of the Lake
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Once upon a time there lived in France a man whose name was Jalm Riou. You might have walked a whole day without meeting anyone happier or more contented, for he had a large farm, plenty of money, and above all, a dau... / Once upon a time there lived in France a man whose name was Jalm Riou. You might have walked a whole day without meeting anyone happier or more contented, for he had a large farm, plenty of money, and above all, a dau...
- Raw/generated end: ...Bad luck light upon you all. That evening they left the country for ever, and Jegu, without their help, grew poorer and poorer, and at last died of misery, while Barbaik was glad to find work in the market of Morlaix. / ...Bad luck light upon you all. That evening they left the country for ever, and Jegu, without their help, grew poorer and poorer, and at last died of misery, while Barbaik was glad to find work in the market of Morlaix.
- Preview start: Once upon a time there lived in France a man whose name was Jalm Riou. You might have walked a whole day without meeting anyone happier or more contented, for he had a large farm, plenty of money, and above all, a dau...

### the-girl-who-pretended-to-be-a-boy

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-girl-who-pretended-to-be-a-boy/manifest.json, app/client/assets/books/generated/the-girl-who-pretended-to-be-a-boy/cleaned_book.json, app/client/assets/books/generated/the-girl-who-pretended-to-be-a-boy/processed_book.json, app/client/assets/books/generated/the-girl-who-pretended-to-be-a-boy/rights_report.json, app/client/assets/books/generated/the-girl-who-pretended-to-be-a-boy/processing_notes.md, app/client/assets/books/generated/the-girl-who-pretended-to-be-a-boy/sections/chapter-001.json
- Preview inspected: public/book-previews/the-girl-who-pretended-to-be-a-boy.preview.json
- Title: pass - Individual title preserved exactly as "The Girl Who Pretended to Be a Boy"; parent collection "The Violet Fairy Book" is excluded from title and playback.
- Creator/editor metadata: pass - Andrew Lang is source-backed as editor; rights metadata preserves that role, the legacy creator array contains no Unknown Author, and collection metadata does not replace tale metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: THE GIRL WHO PRETENDED TO BE A BOY
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Once upon a time there lived an emperor who was a great conqueror, and reigned over more countries than anyone in the world. And whenever he subdued a fresh kingdom, he only granted peace on condition that the king sh... / Once upon a time there lived an emperor who was a great conqueror, and reigned over more countries than anyone in the world. And whenever he subdued a fresh kingdom, he only granted peace on condition that the king sh...
- Raw/generated end: ...u, and none other, shall be my husband.’ ‘Yes, I will marry you,’ said the young man, with a voice almost as soft as when he was a princess. ‘But know that in OUR house, it will be the cock who sings and not the hen!’ / ...u, and none other, shall be my husband.’ ‘Yes, I will marry you,’ said the young man, with a voice almost as soft as when he was a princess. ‘But know that in OUR house, it will be the cock who sings and not the hen!’
- Preview start: Once upon a time there lived an emperor who was a great conqueror, and reigned over more countries than anyone in the world. And whenever he subdued a fresh kingdom, he only granted peace on condition that the king sh...

### the-lady-of-the-fountain

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-lady-of-the-fountain/manifest.json, app/client/assets/books/generated/the-lady-of-the-fountain/cleaned_book.json, app/client/assets/books/generated/the-lady-of-the-fountain/processed_book.json, app/client/assets/books/generated/the-lady-of-the-fountain/rights_report.json, app/client/assets/books/generated/the-lady-of-the-fountain/processing_notes.md, app/client/assets/books/generated/the-lady-of-the-fountain/sections/chapter-001.json
- Preview inspected: public/book-previews/the-lady-of-the-fountain.preview.json
- Title: pass - Individual title preserved exactly as "The Lady of the Fountain"; parent collection "The Lilac Fairy Book" is excluded from title and playback.
- Creator/editor metadata: pass - Andrew Lang is source-backed as editor; rights metadata preserves that role, the legacy creator array contains no Unknown Author, and collection metadata does not replace tale metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: The Lady of the Fountain
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: In the centre of the great hall in the castle of Caerleon upon Usk, king Arthur sat on a seat of green rushes, over which was thrown a covering of flame-coloured silk, and a cushion of red satin lay under his elbow. W... / In the centre of the great hall in the castle of Caerleon upon Usk, king Arthur sat on a seat of green rushes, over which was thrown a covering of flame-coloured silk, and a cushion of red satin lay under his elbow. W...
- Raw/generated end: ...lew them. And so Luned was delivered at the last. Then the maiden rode back with Owen to the lands of the lady of the fountain. And he took the lady with him to Arthur’s court, where they lived happily till they died. / ...lew them. And so Luned was delivered at the last. Then the maiden rode back with Owen to the lands of the lady of the fountain. And he took the lady with him to Arthur’s court, where they lived happily till they died.
- Preview start: In the centre of the great hall in the castle of Caerleon upon Usk, king Arthur sat on a seat of green rushes, over which was thrown a covering of flame-coloured silk, and a cushion of red satin lay under his elbow. W...

### a-tale-of-the-tontlawald

- Status: pass
- Generated output inspected: app/client/assets/books/generated/a-tale-of-the-tontlawald/manifest.json, app/client/assets/books/generated/a-tale-of-the-tontlawald/cleaned_book.json, app/client/assets/books/generated/a-tale-of-the-tontlawald/processed_book.json, app/client/assets/books/generated/a-tale-of-the-tontlawald/rights_report.json, app/client/assets/books/generated/a-tale-of-the-tontlawald/processing_notes.md, app/client/assets/books/generated/a-tale-of-the-tontlawald/sections/chapter-001.json
- Preview inspected: public/book-previews/a-tale-of-the-tontlawald.preview.json
- Title: pass - Individual title preserved exactly as "A Tale of the Tontlawald"; parent collection "The Violet Fairy Book" is excluded from title and playback.
- Creator/editor metadata: pass - Andrew Lang is source-backed as editor; rights metadata preserves that role, the legacy creator array contains no Unknown Author, and collection metadata does not replace tale metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: A TALE OF THE TONTLAWALD
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Long, long ago there stood in the midst of a country covered with lakes a vast stretch of moorland called the Tontlawald, on which no man ever dared set foot. From time to time a few bold spirits had been drawn by cur... / Long, long ago there stood in the midst of a country covered with lakes a vast stretch of moorland called the Tontlawald, on which no man ever dared set foot. From time to time a few bold spirits had been drawn by cur...
- Raw/generated end: ... beautiful things which the lady of the Tontlawald had sent to Elsa. And after the king’s death Elsa became queen, and when she was old she told this story. But that was the last that was ever heard of the Tontlawald. / ... beautiful things which the lady of the Tontlawald had sent to Elsa. And after the king’s death Elsa became queen, and when she was old she told this story. But that was the last that was ever heard of the Tontlawald.
- Preview start: Long, long ago there stood in the midst of a country covered with lakes a vast stretch of moorland called the Tontlawald, on which no man ever dared set foot. From time to time a few bold spirits had been drawn by cur...

### how-a-fish-swam-in-the-air-and-a-hare-in-the-water

- Status: pass
- Generated output inspected: app/client/assets/books/generated/how-a-fish-swam-in-the-air-and-a-hare-in-the-water/manifest.json, app/client/assets/books/generated/how-a-fish-swam-in-the-air-and-a-hare-in-the-water/cleaned_book.json, app/client/assets/books/generated/how-a-fish-swam-in-the-air-and-a-hare-in-the-water/processed_book.json, app/client/assets/books/generated/how-a-fish-swam-in-the-air-and-a-hare-in-the-water/rights_report.json, app/client/assets/books/generated/how-a-fish-swam-in-the-air-and-a-hare-in-the-water/processing_notes.md, app/client/assets/books/generated/how-a-fish-swam-in-the-air-and-a-hare-in-the-water/sections/chapter-001.json
- Preview inspected: public/book-previews/how-a-fish-swam-in-the-air-and-a-hare-in-the-water.preview.json
- Title: pass - Individual title preserved exactly as "How a Fish Swam in the Air and a Hare in the Water"; parent collection "The Violet Fairy Book" is excluded from title and playback.
- Creator/editor metadata: pass - Andrew Lang is source-backed as editor; rights metadata preserves that role, the legacy creator array contains no Unknown Author, and collection metadata does not replace tale metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: HOW A FISH SWAM IN THE AIR AND A HARE IN THE WATER
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Once upon a time an old man and his wife lived together in a little village. They might have been happy if only the old woman had had the sense to hold her tongue at proper times. But anything which might happen indoo... / Once upon a time an old man and his wife lived together in a little village. They might have been happy if only the old woman had had the sense to hold her tongue at proper times. But anything which might happen indoo...
- Raw/generated end: ...t she had to hold her tongue and obey her husband ever after, and the man bought wares with part of the treasure and moved into the town, where he opened a shop, and prospered, and spent the rest of his days in peace. / ...t she had to hold her tongue and obey her husband ever after, and the man bought wares with part of the treasure and moved into the town, where he opened a shop, and prospered, and spent the rest of his days in peace.
- Preview start: Once upon a time an old man and his wife lived together in a little village. They might have been happy if only the old woman had had the sense to hold her tongue at proper times. But anything which might happen indoo...

### jesper-who-herded-the-hares

- Status: pass
- Generated output inspected: app/client/assets/books/generated/jesper-who-herded-the-hares/manifest.json, app/client/assets/books/generated/jesper-who-herded-the-hares/cleaned_book.json, app/client/assets/books/generated/jesper-who-herded-the-hares/processed_book.json, app/client/assets/books/generated/jesper-who-herded-the-hares/rights_report.json, app/client/assets/books/generated/jesper-who-herded-the-hares/processing_notes.md, app/client/assets/books/generated/jesper-who-herded-the-hares/sections/chapter-001.json
- Preview inspected: public/book-previews/jesper-who-herded-the-hares.preview.json
- Title: pass - Individual title preserved exactly as "Jesper Who Herded the Hares"; parent collection "The Violet Fairy Book" is excluded from title and playback.
- Creator/editor metadata: pass - Andrew Lang is source-backed as editor; rights metadata preserves that role, the legacy creator array contains no Unknown Author, and collection metadata does not replace tale metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: JESPER WHO HERDED THE HARES
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: There was once a king who ruled over a kingdom somewhere between sunrise and sunset. It was as small as kingdoms usually were in old times, and when the king went up to the roof of his palace and took a look round he ... / There was once a king who ruled over a kingdom somewhere between sunrise and sunset. It was as small as kingdoms usually were in old times, and when the king went up to the roof of his palace and took a look round he ...
- Raw/generated end: ...ause he was so handsome and so clever. When the old king got time to think over it, he was quite convinced that his kingdom would be safe in Jesper’s hands if he looked after the people as well as he herded the hares. / ...ause he was so handsome and so clever. When the old king got time to think over it, he was quite convinced that his kingdom would be safe in Jesper’s hands if he looked after the people as well as he herded the hares.
- Preview start: There was once a king who ruled over a kingdom somewhere between sunrise and sunset. It was as small as kingdoms usually were in old times, and when the king went up to the roof of his palace and took a look round he ...

### mogarzea-and-his-son

- Status: pass
- Generated output inspected: app/client/assets/books/generated/mogarzea-and-his-son/manifest.json, app/client/assets/books/generated/mogarzea-and-his-son/cleaned_book.json, app/client/assets/books/generated/mogarzea-and-his-son/processed_book.json, app/client/assets/books/generated/mogarzea-and-his-son/rights_report.json, app/client/assets/books/generated/mogarzea-and-his-son/processing_notes.md, app/client/assets/books/generated/mogarzea-and-his-son/sections/chapter-001.json
- Preview inspected: public/book-previews/mogarzea-and-his-son.preview.json
- Title: pass - Individual title preserved exactly as "Mogarzea and His Son"; parent collection "The Violet Fairy Book" is excluded from title and playback.
- Creator/editor metadata: pass - Andrew Lang is source-backed as editor; rights metadata preserves that role, the legacy creator array contains no Unknown Author, and collection metadata does not replace tale metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: MOGARZEA AND HIS SON
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: There was once a little boy, whose father and mother, when they were dying, left him to the care of a guardian. But the guardian whom they chose turned out to be a wicked man, and spent all the money, so the boy deter... / There was once a little boy, whose father and mother, when they were dying, left him to the care of a guardian. But the guardian whom they chose turned out to be a wicked man, and spent all the money, so the boy deter...
- Raw/generated end: ...ogether to the palace, where Mogarzea was still waiting for him, and the marriage was celebrated by the emperor himself. But every May they returned to the Milk Lake, they and their children, and bathed in its waters. / ...ogether to the palace, where Mogarzea was still waiting for him, and the marriage was celebrated by the emperor himself. But every May they returned to the Milk Lake, they and their children, and bathed in its waters.
- Preview start: There was once a little boy, whose father and mother, when they were dying, left him to the care of a guardian. But the guardian whom they chose turned out to be a wicked man, and spent all the money, so the boy deter...

### schippeitaro

- Status: pass
- Generated output inspected: app/client/assets/books/generated/schippeitaro/manifest.json, app/client/assets/books/generated/schippeitaro/cleaned_book.json, app/client/assets/books/generated/schippeitaro/processed_book.json, app/client/assets/books/generated/schippeitaro/rights_report.json, app/client/assets/books/generated/schippeitaro/processing_notes.md, app/client/assets/books/generated/schippeitaro/sections/chapter-001.json
- Preview inspected: public/book-previews/schippeitaro.preview.json
- Title: pass - Individual title preserved exactly as "Schippeitaro"; parent collection "The Violet Fairy Book" is excluded from title and playback.
- Creator/editor metadata: pass - Andrew Lang is source-backed as editor; rights metadata preserves that role, the legacy creator array contains no Unknown Author, and collection metadata does not replace tale metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: SCHIPPEITARO
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: It was the custom in old times that as soon as a Japanese boy reached manhood he should leave his home and roam through the land in search of adventures. Sometimes he would meet with a young man bent on the same busin... / It was the custom in old times that as soon as a Japanese boy reached manhood he should leave his home and roam through the land in search of adventures. Sometimes he would meet with a young man bent on the same busin...
- Raw/generated end: ...hey thought of escaping. At sunrise the brave dog was taken back to his master, and from that time the mountain girls were safe, and every year a feast was held in memory of the young warrior and the dog Schippeitaro. / ...hey thought of escaping. At sunrise the brave dog was taken back to his master, and from that time the mountain girls were safe, and every year a feast was held in memory of the young warrior and the dog Schippeitaro.
- Preview start: It was the custom in old times that as soon as a Japanese boy reached manhood he should leave his home and roam through the land in search of adventures. Sometimes he would meet with a young man bent on the same busin...

### stan-bolovan

- Status: pass
- Generated output inspected: app/client/assets/books/generated/stan-bolovan/manifest.json, app/client/assets/books/generated/stan-bolovan/cleaned_book.json, app/client/assets/books/generated/stan-bolovan/processed_book.json, app/client/assets/books/generated/stan-bolovan/rights_report.json, app/client/assets/books/generated/stan-bolovan/processing_notes.md, app/client/assets/books/generated/stan-bolovan/sections/chapter-001.json
- Preview inspected: public/book-previews/stan-bolovan.preview.json
- Title: pass - Individual title preserved exactly as "Stan Bolovan"; parent collection "The Violet Fairy Book" is excluded from title and playback.
- Creator/editor metadata: pass - Andrew Lang is source-backed as editor; rights metadata preserves that role, the legacy creator array contains no Unknown Author, and collection metadata does not replace tale metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: STAN BOLOVAN
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Once upon a time what happened did happen, and if it had not happened this story would never have been told. On the outskirts of a village just where the oxen were turned out to pasture, and the pigs roamed about burr... / Once upon a time what happened did happen, and if it had not happened this story would never have been told. On the outskirts of a village just where the oxen were turned out to pasture, and the pigs roamed about burr...
- Raw/generated end: ...dragon waited no longer: he flung down his sacks where he stood and took flight as fast as he could, so terrified at the fate that awaited him that from that day he has never dared to show his face in the world again. / ...dragon waited no longer: he flung down his sacks where he stood and took flight as fast as he could, so terrified at the fate that awaited him that from that day he has never dared to show his face in the world again.
- Preview start: Once upon a time what happened did happen, and if it had not happened this story would never have been told. On the outskirts of a village just where the oxen were turned out to pasture, and the pigs roamed about burr...

### the-battle-of-the-birds

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-battle-of-the-birds/manifest.json, app/client/assets/books/generated/the-battle-of-the-birds/cleaned_book.json, app/client/assets/books/generated/the-battle-of-the-birds/processed_book.json, app/client/assets/books/generated/the-battle-of-the-birds/rights_report.json, app/client/assets/books/generated/the-battle-of-the-birds/processing_notes.md, app/client/assets/books/generated/the-battle-of-the-birds/sections/chapter-001.json
- Preview inspected: public/book-previews/the-battle-of-the-birds.preview.json
- Title: pass - Individual title preserved exactly as "The Battle of the Birds"; parent collection "The Lilac Fairy Book" is excluded from title and playback.
- Creator/editor metadata: pass - Andrew Lang is source-backed as editor; rights metadata preserves that role, the legacy creator array contains no Unknown Author, and collection metadata does not replace tale metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: The Battle of the Birds
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: There was to be a great battle between all the creatures of the earth and the birds of the air. News of it went abroad, and the son of the king of Tethertown said that when the battle was fought he would be there to s... / There was to be a great battle between all the creatures of the earth and the birds of the air. News of it went abroad, and the son of the king of Tethertown said that when the battle was fought he would be there to s...
- Raw/generated end: ...otten, and his lost memory came back, and he knew his wife, and kissed her. But as the preparations had been made, it seemed a pity to waste them, so they were married a second time, and sat down to the wedding feast. / ...otten, and his lost memory came back, and he knew his wife, and kissed her. But as the preparations had been made, it seemed a pity to waste them, so they were married a second time, and sat down to the wedding feast.
- Preview start: There was to be a great battle between all the creatures of the earth and the birds of the air. News of it went abroad, and the son of the king of Tethertown said that when the battle was fought he would be there to s...

### the-believing-husbands

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-believing-husbands/manifest.json, app/client/assets/books/generated/the-believing-husbands/cleaned_book.json, app/client/assets/books/generated/the-believing-husbands/processed_book.json, app/client/assets/books/generated/the-believing-husbands/rights_report.json, app/client/assets/books/generated/the-believing-husbands/processing_notes.md, app/client/assets/books/generated/the-believing-husbands/sections/chapter-001.json
- Preview inspected: public/book-previews/the-believing-husbands.preview.json
- Title: pass - Individual title preserved exactly as "The Believing Husbands"; parent collection "The Lilac Fairy Book" is excluded from title and playback.
- Creator/editor metadata: pass - Andrew Lang is source-backed as editor; rights metadata preserves that role, the legacy creator array contains no Unknown Author, and collection metadata does not replace tale metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: The Believing Husbands
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Once upon a time there dwelt in the land of Erin a young man who was seeking a wife, and of all the maidens round about none pleased him as well as the only daughter of a farmer. The girl was willing and the father wa... / Once upon a time there dwelt in the land of Erin a young man who was seeking a wife, and of all the maidens round about none pleased him as well as the only daughter of a farmer. The girl was willing and the father wa...
- Raw/generated end: ...und of his voice the two men were so terrified that they ran straight home, and the man in the coffin got up and followed them, and it was his wife that gained the gold ring, as he had been sillier than the other two. / ...und of his voice the two men were so terrified that they ran straight home, and the man in the coffin got up and followed them, and it was his wife that gained the gold ring, as he had been sillier than the other two.
- Preview start: Once upon a time there dwelt in the land of Erin a young man who was seeking a wife, and of all the maidens round about none pleased him as well as the only daughter of a farmer. The girl was willing and the father wa...

### the-bones-of-djulung

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-bones-of-djulung/manifest.json, app/client/assets/books/generated/the-bones-of-djulung/cleaned_book.json, app/client/assets/books/generated/the-bones-of-djulung/processed_book.json, app/client/assets/books/generated/the-bones-of-djulung/rights_report.json, app/client/assets/books/generated/the-bones-of-djulung/processing_notes.md, app/client/assets/books/generated/the-bones-of-djulung/sections/chapter-001.json
- Preview inspected: public/book-previews/the-bones-of-djulung.preview.json
- Title: pass - Individual title preserved exactly as "The Bones of Djulung"; parent collection "The Lilac Fairy Book" is excluded from title and playback.
- Creator/editor metadata: pass - Andrew Lang is source-backed as editor; rights metadata preserves that role, the legacy creator array contains no Unknown Author, and collection metadata does not replace tale metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: The Bones of Djulung
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: In a beautiful island that lies in the southern seas, where chains of gay orchids bind the trees together, and the days and nights are equally long and nearly equally hot, there once lived a family of seven sisters. T... / In a beautiful island that lies in the southern seas, where chains of gay orchids bind the trees together, and the days and nights are equally long and nearly equally hot, there once lived a family of seven sisters. T...
- Raw/generated end: ...ng. ‘The maiden who can work such wonders is fitted to be the wife of the greatest chief,’ he said, and so he married her, and took her with him across the sea to his own home, where they lived happily for ever after. / ...ng. ‘The maiden who can work such wonders is fitted to be the wife of the greatest chief,’ he said, and so he married her, and took her with him across the sea to his own home, where they lived happily for ever after.
- Preview start: In a beautiful island that lies in the southern seas, where chains of gay orchids bind the trees together, and the days and nights are equally long and nearly equally hot, there once lived a family of seven sisters. T...

### the-boys-with-the-golden-stars

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-boys-with-the-golden-stars/manifest.json, app/client/assets/books/generated/the-boys-with-the-golden-stars/cleaned_book.json, app/client/assets/books/generated/the-boys-with-the-golden-stars/processed_book.json, app/client/assets/books/generated/the-boys-with-the-golden-stars/rights_report.json, app/client/assets/books/generated/the-boys-with-the-golden-stars/processing_notes.md, app/client/assets/books/generated/the-boys-with-the-golden-stars/sections/chapter-001.json
- Preview inspected: public/book-previews/the-boys-with-the-golden-stars.preview.json
- Title: pass - Individual title preserved exactly as "The Boys with the Golden Stars"; parent collection "The Violet Fairy Book" is excluded from title and playback.
- Creator/editor metadata: pass - Andrew Lang is source-backed as editor; rights metadata preserves that role, the legacy creator array contains no Unknown Author, and collection metadata does not replace tale metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: THE BOYS WITH THE GOLDEN STARS
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Once upon a time what happened did happen: and if it had not happened, you would never have heard this story. Well, once upon a time there lived an emperor who had half a world all to himself to rule over, and in this... / Once upon a time what happened did happen: and if it had not happened, you would never have heard this story. Well, once upon a time there lived an emperor who had half a world all to himself to rule over, and in this...
- Raw/generated end: ...tepmother’s daughter became the meanest sewing maid in the palace, the stepmother was tied to a wild horse, and every one knew and has never forgotten that whoever has a mind turned to wickedness is sure to end badly. / ...tepmother’s daughter became the meanest sewing maid in the palace, the stepmother was tied to a wild horse, and every one knew and has never forgotten that whoever has a mind turned to wickedness is sure to end badly.
- Preview start: Once upon a time what happened did happen: and if it had not happened, you would never have heard this story. Well, once upon a time there lived an emperor who had half a world all to himself to rule over, and in this...

### the-castle-of-kerglas

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-castle-of-kerglas/manifest.json, app/client/assets/books/generated/the-castle-of-kerglas/cleaned_book.json, app/client/assets/books/generated/the-castle-of-kerglas/processed_book.json, app/client/assets/books/generated/the-castle-of-kerglas/rights_report.json, app/client/assets/books/generated/the-castle-of-kerglas/processing_notes.md, app/client/assets/books/generated/the-castle-of-kerglas/sections/chapter-001.json
- Preview inspected: public/book-previews/the-castle-of-kerglas.preview.json
- Title: pass - Individual title preserved exactly as "The Castle of Kerglas"; parent collection "The Lilac Fairy Book" is excluded from title and playback.
- Creator/editor metadata: pass - Andrew Lang is source-backed as editor; rights metadata preserves that role, the legacy creator array contains no Unknown Author, and collection metadata does not replace tale metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: The Castle of Kerglas
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Peronnik was a poor idiot who belonged to nobody, and he would have died of starvation if it had not been for the kindness of the village people, who gave him food whenever he chose to ask for it. And as for a bed, wh... / Peronnik was a poor idiot who belonged to nobody, and he would have died of starvation if it had not been for the kindness of the village people, who gave him food whenever he chose to ask for it. And as for a bed, wh...
- Raw/generated end: ...is country. As to the bowl and the lance, no one knows what became of them, but some say that Bryak the sorcerer managed to steal them again, and that any one who wishes to possess them must seek them as Peronnik did. / ...is country. As to the bowl and the lance, no one knows what became of them, but some say that Bryak the sorcerer managed to steal them again, and that any one who wishes to possess them must seek them as Peronnik did.
- Preview start: Peronnik was a poor idiot who belonged to nobody, and he would have died of starvation if it had not been for the kindness of the village people, who gave him food whenever he chose to ask for it. And as for a bed, wh...

### the-enchanted-deer

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-enchanted-deer/manifest.json, app/client/assets/books/generated/the-enchanted-deer/cleaned_book.json, app/client/assets/books/generated/the-enchanted-deer/processed_book.json, app/client/assets/books/generated/the-enchanted-deer/rights_report.json, app/client/assets/books/generated/the-enchanted-deer/processing_notes.md, app/client/assets/books/generated/the-enchanted-deer/sections/chapter-001.json
- Preview inspected: public/book-previews/the-enchanted-deer.preview.json
- Title: pass - Individual title preserved exactly as "The Enchanted Deer"; parent collection "The Lilac Fairy Book" is excluded from title and playback.
- Creator/editor metadata: pass - Andrew Lang is source-backed as editor; rights metadata preserves that role, the legacy creator array contains no Unknown Author, and collection metadata does not replace tale metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: The Enchanted Deer
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: A young man was out walking one day in Erin, leading a stout cart-horse by the bridle. He was thinking of his mother and how poor they were since his father, who was a fisherman, had been drowned at sea, and wondering... / A young man was out walking one day in Erin, leading a stout cart-horse by the bridle. He was thinking of his mother and how poor they were since his father, who was a fisherman, had been drowned at sea, and wondering...
- Raw/generated end: ...f three times. Because he has done this, I will marry him rather than one of you, who have come hither to wed me, for many kings here sought to free me from the spells, but none could do it save Ian the fisher’s son.’ / ...f three times. Because he has done this, I will marry him rather than one of you, who have come hither to wed me, for many kings here sought to free me from the spells, but none could do it save Ian the fisher’s son.’
- Preview start: A young man was out walking one day in Erin, leading a stout cart-horse by the bridle. He was thinking of his mother and how poor they were since his father, who was a fisherman, had been drowned at sea, and wondering...

### the-enchanted-knife

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-enchanted-knife/manifest.json, app/client/assets/books/generated/the-enchanted-knife/cleaned_book.json, app/client/assets/books/generated/the-enchanted-knife/processed_book.json, app/client/assets/books/generated/the-enchanted-knife/rights_report.json, app/client/assets/books/generated/the-enchanted-knife/processing_notes.md, app/client/assets/books/generated/the-enchanted-knife/sections/chapter-001.json
- Preview inspected: public/book-previews/the-enchanted-knife.preview.json
- Title: pass - Individual title preserved exactly as "The Enchanted Knife"; parent collection "The Violet Fairy Book" is excluded from title and playback.
- Creator/editor metadata: pass - Andrew Lang is source-backed as editor; rights metadata preserves that role, the legacy creator array contains no Unknown Author, and collection metadata does not replace tale metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: THE ENCHANTED KNIFE
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Once upon a time there lived a young man who vowed that he would never marry any girl who had not royal blood in her veins. One day he plucked up all his courage and went to the palace to ask the emperor for his daugh... / Once upon a time there lived a young man who vowed that he would never marry any girl who had not royal blood in her veins. One day he plucked up all his courage and went to the palace to ask the emperor for his daugh...
- Raw/generated end: ...n-in-law what dowry he would require with his bride. To which the bridegroom made answer, ‘Noble emperor! all I desire is that I may have your daughter for my wife, and enjoy for ever the use of your enchanted knife.’ / ...n-in-law what dowry he would require with his bride. To which the bridegroom made answer, ‘Noble emperor! all I desire is that I may have your daughter for my wife, and enjoy for ever the use of your enchanted knife.’
- Preview start: Once upon a time there lived a young man who vowed that he would never marry any girl who had not royal blood in her veins. One day he plucked up all his courage and went to the palace to ask the emperor for his daugh...

### the-envious-neighbour

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-envious-neighbour/manifest.json, app/client/assets/books/generated/the-envious-neighbour/cleaned_book.json, app/client/assets/books/generated/the-envious-neighbour/processed_book.json, app/client/assets/books/generated/the-envious-neighbour/rights_report.json, app/client/assets/books/generated/the-envious-neighbour/processing_notes.md, app/client/assets/books/generated/the-envious-neighbour/sections/chapter-001.json
- Preview inspected: public/book-previews/the-envious-neighbour.preview.json
- Title: pass - Individual title preserved exactly as "The Envious Neighbour"; parent collection "The Violet Fairy Book" is excluded from title and playback.
- Creator/editor metadata: pass - Andrew Lang is source-backed as editor; rights metadata preserves that role, the legacy creator array contains no Unknown Author, and collection metadata does not replace tale metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: THE ENVIOUS NEIGHBOUR
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Long, long ago an old couple lived in a village, and, as they had no children to love and care for, they gave all their affection to a little dog. He was a pretty little creature, and instead of growing spoilt and dis... / Long, long ago an old couple lived in a village, and, as they had no children to love and care for, they gave all their affection to a little dog. He was a pretty little creature, and instead of growing spoilt and dis...
- Raw/generated end: ... everybody in his native village had found out his wickedness, and they would not let him live there any longer; and as he would not leave off his evil ways he soon went from bad to worse, and came to a miserable end. / ... everybody in his native village had found out his wickedness, and they would not let him live there any longer; and as he would not leave off his evil ways he soon went from bad to worse, and came to a miserable end.
- Preview start: Long, long ago an old couple lived in a village, and, as they had no children to love and care for, they gave all their affection to a little dog. He was a pretty little creature, and instead of growing spoilt and dis...

### the-false-prince-and-the-true

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-false-prince-and-the-true/manifest.json, app/client/assets/books/generated/the-false-prince-and-the-true/cleaned_book.json, app/client/assets/books/generated/the-false-prince-and-the-true/processed_book.json, app/client/assets/books/generated/the-false-prince-and-the-true/rights_report.json, app/client/assets/books/generated/the-false-prince-and-the-true/processing_notes.md, app/client/assets/books/generated/the-false-prince-and-the-true/sections/chapter-001.json
- Preview inspected: public/book-previews/the-false-prince-and-the-true.preview.json
- Title: pass - Individual title preserved exactly as "The False Prince and the True"; parent collection "The Lilac Fairy Book" is excluded from title and playback.
- Creator/editor metadata: pass - Andrew Lang is source-backed as editor; rights metadata preserves that role, the legacy creator array contains no Unknown Author, and collection metadata does not replace tale metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: The False Prince and the True
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: The king had just awakened from his midday sleep, for it was summer, and everyone rose early and rested from twelve to three, as they do in hot countries. He had dressed himself in cool white clothes, and was passing ... / The king had just awakened from his midday sleep, for it was summer, and everyone rose early and rested from twelve to three, as they do in hot countries. He had dressed himself in cool white clothes, and was passing ...
- Raw/generated end: ...marry me. ‘That is my history, and now you must beg the king to send messengers at once to Granada, to inform my father of our marriage, and I think,’ she added with a smile, ‘that he will not refuse us his blessing.’ / ...marry me. ‘That is my history, and now you must beg the king to send messengers at once to Granada, to inform my father of our marriage, and I think,’ she added with a smile, ‘that he will not refuse us his blessing.’
- Preview start: The king had just awakened from his midday sleep, for it was summer, and everyone rose early and rested from twelve to three, as they do in hot countries. He had dressed himself in cool white clothes, and was passing ...

## Protections and Audit Side Effects

- Raw sources modified: no
- Cloudflare exports modified: no
- Unresolved-source generated books untouched: yes
- Duplicate/boundary skips not reintroduced: yes
- Unrelated generated/preview changes: none
- Audit side-effect handling: restored all validation-only timestamp/report churn and 12 unrelated title-audit generated rewrites; retained only verifier, package command, and verification reports

## Browser and Playwright

- The in-app Browser sandbox issue was not part of this book branch. Standalone Playwright was used for QA.
- Standalone Playwright: pass: 36/36 desktop-chromium
- Known fullscreen-only failure: no

## Validation

- typecheck: pass
- pilotWrite18: pass: 20 processed, 0 skipped; 11 unresolved untouched
- batch12ProseRestore: pass: 20/20 exact; zero remaining prose/quote defects
- startupPreviewAudit: pass: 375/375 valid; 0 preview updates
- titleStartDefaultAudit: pass: 375 audited; 0 accepted revoked; 12 unrelated rewrites restored
- metadataSegmentationAudit: pass: 375 audited; 0 author corrections; 1 unrelated documented unknown-author case
- manualUiDefectFollowup: pass: 8/8 acceptable; 0 corrected or revoked
- targetedVerifier: pass: 20/20; raw/generated 20/20 exact
- appBuild: known pre-existing SSR heap OOM after successful client build; separately backlogged
- standalonePlaywright: pass: 36/36 desktop-chromium
- smokeTests: pass: 23/23 smoke tests
- gitDiffCheck: pass

## Backlog Note from pilot-write-18

- after all books are processed, run an independent second-pass audit using a different strategy
- after books and second-pass audit, add original non-spoiler 300-500+ word SEO summaries for each accepted book page
- after summaries, perform full site SEO/meta review using GSC data and route-level intent
- after books/SEO, run a focused rage-click UX pass for /audio, /practice, homepage, and related utility pages
- investigate the SSR heap OOM separately if it keeps appearing during plain npm run build
- final cleanup should remove temporary audit scripts/reports and code bloat only after everything is stable
