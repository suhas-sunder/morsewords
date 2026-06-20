# Pilot write batch 20 verification

Generated: 2026-06-20T23:34:32.427Z

## Summary

- Verified: 20
- Pass: 20
- Warn accepted: 0
- Fail: 0
- Accepted for main: 20
- Correction needed before main: 0
- Raw/generated exact: 20/20

## Write-12 Shared Script Scope

- Classification: harmless shared implementation intentionally used by write batch 20
- Resolution: Retain the write-12 change. Batches 13-20 use five-line wrappers that set MORSEWORDS_PILOT_WRITE_BATCH and import the established write-12 runner; this diff adds batch-20 typing, selection, dispatch, backlog-note reporting, and narrow cleanup for the selected sources' FN marker/source-attribution cases.
- Unrelated changes found: no

## Batch-12 Prose Restoration

- Result: pass
- Compared: 20
- Remaining raw/generated mismatches: 0
- Remaining prose omissions: 0
- Remaining missing opening-quote defects: 0

## Special Focus

- Exact spelling: Groac’h, Jogi, Jimmy Goggles the God, Miss Winchelsea’s Heart, Mr. Brisher’s Treasure, Mr. Ledbetter’s Vacation, Mr. Skelmersdale in Fairyland, and The New Accelerator match source-audited titles exactly.
- Creator roles: 14/14 Lang tales preserve Andrew Lang's source-backed editor role in rights metadata; 6/6 Wells stories preserve H. G. Wells as source-backed author; no batch-20 title uses Unknown Author.
- Wrapped-line prose: 20/20 sanitized raw bodies match every generated body copy character-for-character (20/20 exact).
- Collection metadata/playback: 20/20 use the individual tale title and exclude parent collection/title/byline/source wrapper material from default playback.

## Books

### moti

- Status: pass
- Generated output inspected: app/client/assets/books/generated/moti/manifest.json, app/client/assets/books/generated/moti/cleaned_book.json, app/client/assets/books/generated/moti/processed_book.json, app/client/assets/books/generated/moti/rights_report.json, app/client/assets/books/generated/moti/processing_notes.md, app/client/assets/books/generated/moti/sections/chapter-001.json
- Preview inspected: public/book-previews/moti.preview.json
- Title: pass - Individual title preserved exactly as "Moti"; parent collection "The Lilac Fairy Book" is excluded from title and playback.
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
- Title evidence: ‘Moti’
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Once upon a time there was a youth called Moti, who was very big and strong, but the clumsiest creature you can imagine. So clumsy was he that he was always putting his great feet into the bowls of sweet milk or curds... / Once upon a time there was a youth called Moti, who was very big and strong, but the clumsiest creature you can imagine. So clumsy was he that he was always putting his great feet into the bowls of sweet milk or curds...
- Raw/generated end: ...ed long and contrived always to be looked up to as a fountain of wisdom, valour, and discretion by all except his relations, who could never understand what he had done to be considered so much wiser than anyone else. / ...ed long and contrived always to be looked up to as a fountain of wisdom, valour, and discretion by all except his relations, who could never understand what he had done to be considered so much wiser than anyone else.
- Preview start: Once upon a time there was a youth called Moti, who was very big and strong, but the clumsiest creature you can imagine. So clumsy was he that he was always putting his great feet into the bowls of sweet milk or curds...

### the-brown-bear-of-norway

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-brown-bear-of-norway/manifest.json, app/client/assets/books/generated/the-brown-bear-of-norway/cleaned_book.json, app/client/assets/books/generated/the-brown-bear-of-norway/processed_book.json, app/client/assets/books/generated/the-brown-bear-of-norway/rights_report.json, app/client/assets/books/generated/the-brown-bear-of-norway/processing_notes.md, app/client/assets/books/generated/the-brown-bear-of-norway/sections/chapter-001.json
- Preview inspected: public/book-previews/the-brown-bear-of-norway.preview.json
- Title: pass - Individual title preserved exactly as "The Brown Bear of Norway"; parent collection "The Lilac Fairy Book" is excluded from title and playback.
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
- Title evidence: The Brown Bear of Norway
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: There was once a king in Ireland, and he had three daughters, and very nice princesses they were. And one day, when they and their father were walking on the lawn, the king began to joke with them, and to ask them who... / There was once a king in Ireland, and he had three daughters, and very nice princesses they were. And one day, when they and their father were walking on the lawn, the king began to joke with them, and to ask them who...
- Raw/generated end: ...n they set out for their own palace. The kings of Ireland and of Munster and Ulster, and their wives, soon came to visit them, and may every one that deserves it be as happy as the Brown Bear of Norway and his family. / ...n they set out for their own palace. The kings of Ireland and of Munster and Ulster, and their wives, soon came to visit them, and may every one that deserves it be as happy as the Brown Bear of Norway and his family.
- Preview start: There was once a king in Ireland, and he had three daughters, and very nice princesses they were. And one day, when they and their father were walking on the lawn, the king began to joke with them, and to ask them who...

### the-escape-of-the-mouse

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-escape-of-the-mouse/manifest.json, app/client/assets/books/generated/the-escape-of-the-mouse/cleaned_book.json, app/client/assets/books/generated/the-escape-of-the-mouse/processed_book.json, app/client/assets/books/generated/the-escape-of-the-mouse/rights_report.json, app/client/assets/books/generated/the-escape-of-the-mouse/processing_notes.md, app/client/assets/books/generated/the-escape-of-the-mouse/sections/chapter-001.json
- Preview inspected: public/book-previews/the-escape-of-the-mouse.preview.json
- Title: pass - Individual title preserved exactly as "The Escape of the Mouse"; parent collection "The Lilac Fairy Book" is excluded from title and playback.
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
- Title evidence: The Escape of the Mouse
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Manawyddan the prince and his friend Pryderi were wanderers, for the brother of Manawyddan had been slain, and his throne taken from him. Very sorrowful was Manawyddan, but Pryderi was stout of heart, and bade him be ... / Manawyddan the prince and his friend Pryderi were wanderers, for the brother of Manawyddan had been slain, and his throne taken from him. Very sorrowful was Manawyddan, but Pryderi was stout of heart, and bade him be ...
- Raw/generated end: ... spell didst thou lay upon Pryderi and Rhiannon?’ ‘Pryderi has had the knockers of the gate of my palace hung about him, and Rhiannon has carried the collars of my asses around her neck,’ said the bishop with a smile. / ... spell didst thou lay upon Pryderi and Rhiannon?’ ‘Pryderi has had the knockers of the gate of my palace hung about him, and Rhiannon has carried the collars of my asses around her neck,’ said the bishop with a smile.
- Preview start: Manawyddan the prince and his friend Pryderi were wanderers, for the brother of Manawyddan had been slain, and his throne taken from him. Very sorrowful was Manawyddan, but Pryderi was stout of heart, and bade him be ...

### the-fairy-nurse

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-fairy-nurse/manifest.json, app/client/assets/books/generated/the-fairy-nurse/cleaned_book.json, app/client/assets/books/generated/the-fairy-nurse/processed_book.json, app/client/assets/books/generated/the-fairy-nurse/rights_report.json, app/client/assets/books/generated/the-fairy-nurse/processing_notes.md, app/client/assets/books/generated/the-fairy-nurse/sections/chapter-001.json
- Preview inspected: public/book-previews/the-fairy-nurse.preview.json
- Title: pass - Individual title preserved exactly as "The Fairy Nurse"; parent collection "The Lilac Fairy Book" is excluded from title and playback.
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
- Title evidence: The Fairy Nurse
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: There was once a little farmer and his wife living near Coolgarrow. They had three children, and my story happened while the youngest was a baby. The wife was a good wife enough, but her mind was all on her family and... / There was once a little farmer and his wife living near Coolgarrow. They had three children, and my story happened while the youngest was a baby. The wife was a good wife enough, but her mind was all on her family and...
- Raw/generated end: ...s no better than a withered dock-leaf.’ ‘Maybe, then,’ says he, ‘it will be different now,’ and he struck the eye next him with a switch. Friends, she never saw a glimmer after with that one till the day of her death. / ...s no better than a withered dock-leaf.’ ‘Maybe, then,’ says he, ‘it will be different now,’ and he struck the eye next him with a switch. Friends, she never saw a glimmer after with that one till the day of her death.
- Preview start: There was once a little farmer and his wife living near Coolgarrow. They had three children, and my story happened while the youngest was a baby. The wife was a good wife enough, but her mind was all on her family and...

### the-four-gifts

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-four-gifts/manifest.json, app/client/assets/books/generated/the-four-gifts/cleaned_book.json, app/client/assets/books/generated/the-four-gifts/processed_book.json, app/client/assets/books/generated/the-four-gifts/rights_report.json, app/client/assets/books/generated/the-four-gifts/processing_notes.md, app/client/assets/books/generated/the-four-gifts/sections/chapter-001.json
- Preview inspected: public/book-previews/the-four-gifts.preview.json
- Title: pass - Individual title preserved exactly as "The Four Gifts"; parent collection "The Lilac Fairy Book" is excluded from title and playback.
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
- Title evidence: The Four Gifts
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: In the old land of Brittany, once called Cornwall, there lived a woman named Barbaik Bourhis, who spent all her days in looking after her farm with the help of her niece Tephany. Early and late the two might be seen i... / In the old land of Brittany, once called Cornwall, there lived a woman named Barbaik Bourhis, who spent all her days in looking after her farm with the help of her niece Tephany. Early and late the two might be seen i...
- Raw/generated end: ...r after all it was not yourself you thought of but him.’ Never again did Tephany see the old woman, but she forgave Denis for selling her tears, and in time he grew to be a good husband, who did his own share of work. / ...r after all it was not yourself you thought of but him.’ Never again did Tephany see the old woman, but she forgave Denis for selling her tears, and in time he grew to be a good husband, who did his own share of work.
- Preview start: In the old land of Brittany, once called Cornwall, there lived a woman named Barbaik Bourhis, who spent all her days in looking after her farm with the help of her niece Tephany. Early and late the two might be seen i...

### the-goat-s-ears-of-the-emperor-trojan

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-goat-s-ears-of-the-emperor-trojan/manifest.json, app/client/assets/books/generated/the-goat-s-ears-of-the-emperor-trojan/cleaned_book.json, app/client/assets/books/generated/the-goat-s-ears-of-the-emperor-trojan/processed_book.json, app/client/assets/books/generated/the-goat-s-ears-of-the-emperor-trojan/rights_report.json, app/client/assets/books/generated/the-goat-s-ears-of-the-emperor-trojan/processing_notes.md, app/client/assets/books/generated/the-goat-s-ears-of-the-emperor-trojan/sections/chapter-001.json
- Preview inspected: public/book-previews/the-goat-s-ears-of-the-emperor-trojan.preview.json
- Title: pass - Individual title preserved exactly as "The Goat’s Ears of the Emperor Trojan"; parent collection "The Violet Fairy Book" is excluded from title and playback.
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
- Title evidence: THE GOAT’S EARS OF THE EMPEROR TROJAN
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Once upon a time there lived an emperor whose name was Trojan, and he had ears like a goat. Every morning, when he was shaved, he asked if the man saw anything odd about him, and as each fresh barber always replied th... / Once upon a time there lived an emperor whose name was Trojan, and he had ears like a goat. Every morning, when he was shaved, he asked if the man saw anything odd about him, and as each fresh barber always replied th...
- Raw/generated end: ...thing came but the words, ‘The Emperor Trojan has goat’s ears.’ Then the emperor knew that even the earth gave up its secrets, and he granted the young man his life, but he never allowed him to be his barber any more. / ...thing came but the words, ‘The Emperor Trojan has goat’s ears.’ Then the emperor knew that even the earth gave up its secrets, and he granted the young man his life, but he never allowed him to be his barber any more.
- Preview start: Once upon a time there lived an emperor whose name was Trojan, and he had ears like a goat. Every morning, when he was shaved, he asked if the man saw anything odd about him, and as each fresh barber always replied th...

### the-groac-h-of-the-isle-of-lok

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-groac-h-of-the-isle-of-lok/manifest.json, app/client/assets/books/generated/the-groac-h-of-the-isle-of-lok/cleaned_book.json, app/client/assets/books/generated/the-groac-h-of-the-isle-of-lok/processed_book.json, app/client/assets/books/generated/the-groac-h-of-the-isle-of-lok/rights_report.json, app/client/assets/books/generated/the-groac-h-of-the-isle-of-lok/processing_notes.md, app/client/assets/books/generated/the-groac-h-of-the-isle-of-lok/sections/chapter-001.json
- Preview inspected: public/book-previews/the-groac-h-of-the-isle-of-lok.preview.json
- Title: pass - Individual title preserved exactly as "The Groac’h of the Isle of Lok"; parent collection "The Lilac Fairy Book" is excluded from title and playback.
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
- Title evidence: The Groac’h of the Isle of Lok
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: In old times, when all kinds of wonderful things happened in Brittany, there lived in the village of Lanillis, a young man named Houarn Pogamm and a girl called Bellah Postik. They were cousins, and as their mothers w... / In old times, when all kinds of wonderful things happened in Brittany, there lived in the village of Lanillis, a young man named Houarn Pogamm and a girl called Bellah Postik. They were cousins, and as their mothers w...
- Raw/generated end: ...tten that they had so long wished for, they were able to buy lands for miles round for themselves, and gave each man who had been delivered from the Groac’h a small farm, where he lived happily to the end of his days. / ...tten that they had so long wished for, they were able to buy lands for miles round for themselves, and gave each man who had been delivered from the Groac’h a small farm, where he lived happily to the end of his days.
- Preview start: In old times, when all kinds of wonderful things happened in Brittany, there lived in the village of Lanillis, a young man named Houarn Pogamm and a girl called Bellah Postik. They were cousins, and as their mothers w...

### the-heart-of-a-monkey

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-heart-of-a-monkey/manifest.json, app/client/assets/books/generated/the-heart-of-a-monkey/cleaned_book.json, app/client/assets/books/generated/the-heart-of-a-monkey/processed_book.json, app/client/assets/books/generated/the-heart-of-a-monkey/rights_report.json, app/client/assets/books/generated/the-heart-of-a-monkey/processing_notes.md, app/client/assets/books/generated/the-heart-of-a-monkey/sections/chapter-001.json
- Preview inspected: public/book-previews/the-heart-of-a-monkey.preview.json
- Title: pass - Individual title preserved exactly as "The Heart of a Monkey"; parent collection "The Lilac Fairy Book" is excluded from title and playback.
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
- Title evidence: The Heart of a Monkey
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: A long time ago a little town made up of a collection of low huts stood in a tiny green valley at the foot of a cliff. Of course the people had taken great care to build their houses out of reach of the highest tide w... / A long time ago a little town made up of a collection of low huts stood in a tiny green valley at the foot of a cliff. Of course the people had taken great care to build their houses out of reach of the highest tide w...
- Raw/generated end: ...n the sky, it is time for you to begin your homeward journey. You will have a nice cool voyage, and I hope you will find the sultan better. Farewell!’ And the monkey disappeared among the green branches, and was gone. / ...n the sky, it is time for you to begin your homeward journey. You will have a nice cool voyage, and I hope you will find the sultan better. Farewell!’ And the monkey disappeared among the green branches, and was gone.
- Preview start: A long time ago a little town made up of a collection of low huts stood in a tiny green valley at the foot of a cliff. Of course the people had taken great care to build their houses out of reach of the highest tide w...

### the-hoodie-crow

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-hoodie-crow/manifest.json, app/client/assets/books/generated/the-hoodie-crow/cleaned_book.json, app/client/assets/books/generated/the-hoodie-crow/processed_book.json, app/client/assets/books/generated/the-hoodie-crow/rights_report.json, app/client/assets/books/generated/the-hoodie-crow/processing_notes.md, app/client/assets/books/generated/the-hoodie-crow/sections/chapter-001.json
- Preview inspected: public/book-previews/the-hoodie-crow.preview.json
- Title: pass - Individual title preserved exactly as "The Hoodie-Crow"; parent collection "The Lilac Fairy Book" is excluded from title and playback.
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
- Title evidence: The Hoodie-Crow
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Once there lived a farmer who had three daughters, and good useful girls they were, up with the sun, and doing all the work of the house. One morning they all ran down to the river to wash their clothes, when a hoodie... / Once there lived a farmer who had three daughters, and good useful girls they were, up with the sun, and doing all the work of the house. One morning they all ran down to the river to wash their clothes, when a hoodie...
- Raw/generated end: ... and they went back the way she had come, and stopped at the three houses in order to take their little sons to their own home. But the story never says who had stolen them, nor what the coarse comb had to do with it. / ... and they went back the way she had come, and stopped at the three houses in order to take their little sons to their own home. But the story never says who had stolen them, nor what the coarse comb had to do with it.
- Preview start: Once there lived a farmer who had three daughters, and good useful girls they were, up with the sun, and doing all the work of the house. One morning they all ran down to the river to wash their clothes, when a hoodie...

### the-jogi-s-punishment

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-jogi-s-punishment/manifest.json, app/client/assets/books/generated/the-jogi-s-punishment/cleaned_book.json, app/client/assets/books/generated/the-jogi-s-punishment/processed_book.json, app/client/assets/books/generated/the-jogi-s-punishment/rights_report.json, app/client/assets/books/generated/the-jogi-s-punishment/processing_notes.md, app/client/assets/books/generated/the-jogi-s-punishment/sections/chapter-001.json
- Preview inspected: public/book-previews/the-jogi-s-punishment.preview.json
- Title: pass - Individual title preserved exactly as "The Jogi’s Punishment"; parent collection "The Lilac Fairy Book" is excluded from title and playback.
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
- Title evidence: The Jogi’s Punishment
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Once upon a time there came to the ancient city of Rahmatabad a jogi of holy appearance, who took up his abode under a tree outside the city, where he would sit for days at a time fasting from food and drink, motionle... / Once upon a time there came to the ancient city of Rahmatabad a jogi of holy appearance, who took up his abode under a tree outside the city, where he would sit for days at a time fasting from food and drink, motionle...
- Raw/generated end: ...pieces on the threshold of his dwelling! Very soon the story spread, as stories will, and reached the ears of the princess and her husband, and when she knew that her enemy was dead she made her peace with her father. / ...pieces on the threshold of his dwelling! Very soon the story spread, as stories will, and reached the ears of the princess and her husband, and when she knew that her enemy was dead she made her peace with her father.
- Preview start: Once upon a time there came to the ancient city of Rahmatabad a jogi of holy appearance, who took up his abode under a tree outside the city, where he would sit for days at a time fasting from food and drink, motionle...

### the-king-of-the-waterfalls

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-king-of-the-waterfalls/manifest.json, app/client/assets/books/generated/the-king-of-the-waterfalls/cleaned_book.json, app/client/assets/books/generated/the-king-of-the-waterfalls/processed_book.json, app/client/assets/books/generated/the-king-of-the-waterfalls/rights_report.json, app/client/assets/books/generated/the-king-of-the-waterfalls/processing_notes.md, app/client/assets/books/generated/the-king-of-the-waterfalls/sections/chapter-001.json
- Preview inspected: public/book-previews/the-king-of-the-waterfalls.preview.json
- Title: pass - Individual title preserved exactly as "The King of the Waterfalls"; parent collection "The Lilac Fairy Book" is excluded from title and playback.
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
- Title evidence: The King of the Waterfalls
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: When the young king of Easaidh Ruadh came into his kingdom, the first thing he thought of was how he could amuse himself best. The sports that all his life had pleased him best suddenly seemed to have grown dull, and ... / When the young king of Easaidh Ruadh came into his kingdom, the first thing he thought of was how he could amuse himself best. The sports that all his life had pleased him best suddenly seemed to have grown dull, and ...
- Raw/generated end: ...ey knew that the giant was dead, because they had found his soul. Next day they mounted the two horses and rode home again, visiting their friends the brown otter and the hoary hawk and the slim yellow dog by the way. / ...ey knew that the giant was dead, because they had found his soul. Next day they mounted the two horses and rode home again, visiting their friends the brown otter and the hoary hawk and the slim yellow dog by the way.
- Preview start: When the young king of Easaidh Ruadh came into his kingdom, the first thing he thought of was how he could amuse himself best. The sports that all his life had pleased him best suddenly seemed to have grown dull, and ...

### the-one-handed-girl

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-one-handed-girl/manifest.json, app/client/assets/books/generated/the-one-handed-girl/cleaned_book.json, app/client/assets/books/generated/the-one-handed-girl/processed_book.json, app/client/assets/books/generated/the-one-handed-girl/rights_report.json, app/client/assets/books/generated/the-one-handed-girl/processing_notes.md, app/client/assets/books/generated/the-one-handed-girl/sections/chapter-001.json
- Preview inspected: public/book-previews/the-one-handed-girl.preview.json
- Title: pass - Individual title preserved exactly as "The One-Handed Girl"; parent collection "The Lilac Fairy Book" is excluded from title and playback.
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
- Title evidence: The One-Handed Girl
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: An old couple once lived in a hut under a grove of palm trees, and they had one son and one daughter. They were all very happy together for many years, and then the father became very ill, and felt he was going to die... / An old couple once lived in a hut under a grove of palm trees, and they had one son and one daughter. They were all very happy together for many years, and then the father became very ill, and felt he was going to die...
- Raw/generated end: ...! our son is growing quite a big boy.’ ‘And what shall be done to your brother?’ asked the king, who was glad to think that someone had acted in this matter worse than himself. ‘Put him out of the town,’ answered she. / ...! our son is growing quite a big boy.’ ‘And what shall be done to your brother?’ asked the king, who was glad to think that someone had acted in this matter worse than himself. ‘Put him out of the town,’ answered she.
- Preview start: An old couple once lived in a hut under a grove of palm trees, and they had one son and one daughter. They were all very happy together for many years, and then the father became very ill, and felt he was going to die...

### the-raspberry-worm

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-raspberry-worm/manifest.json, app/client/assets/books/generated/the-raspberry-worm/cleaned_book.json, app/client/assets/books/generated/the-raspberry-worm/processed_book.json, app/client/assets/books/generated/the-raspberry-worm/rights_report.json, app/client/assets/books/generated/the-raspberry-worm/processing_notes.md, app/client/assets/books/generated/the-raspberry-worm/sections/chapter-001.json
- Preview inspected: public/book-previews/the-raspberry-worm.preview.json
- Title: pass - Individual title preserved exactly as "The Raspberry Worm"; parent collection "The Lilac Fairy Book" is excluded from title and playback.
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
- Title evidence: The Raspberry Worm
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: ‘Phew!’ cried Lisa. ‘Ugh!’ cried Aina. ‘What now?’ cried the big sister. ‘A worm!’ cried Lisa. ‘On the raspberry!’ cried Aina. ‘Kill it!’ cried Otto. ‘What a fuss over a poor little worm!’ said the big sister scornful... / ‘Phew!’ cried Lisa. ‘Ugh!’ cried Aina. ‘What now?’ cried the big sister. ‘A worm!’ cried Lisa. ‘On the raspberry!’ cried Aina. ‘Kill it!’ cried Otto. ‘What a fuss over a poor little worm!’ said the big sister scornful...
- Raw/generated end: ...ard crushed into powder in the heather. Then Bernez went home, and showed his wealth to Marzinne, who this time did not refuse him as a brother-in-law, and he and Rozennik were married, and lived happy for ever after. / ...ard crushed into powder in the heather. Then Bernez went home, and showed his wealth to Marzinne, who this time did not refuse him as a brother-in-law, and he and Rozennik were married, and lived happy for ever after.
- Preview start: ‘Phew!’ cried Lisa. ‘Ugh!’ cried Aina. ‘What now?’ cried the big sister. ‘A worm!’ cried Lisa. ‘On the raspberry!’ cried Aina. ‘Kill it!’ cried Otto. ‘What a fuss over a poor little worm!’ said the big sister scornful...

### the-rich-brother-and-the-poor-brother

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-rich-brother-and-the-poor-brother/manifest.json, app/client/assets/books/generated/the-rich-brother-and-the-poor-brother/cleaned_book.json, app/client/assets/books/generated/the-rich-brother-and-the-poor-brother/processed_book.json, app/client/assets/books/generated/the-rich-brother-and-the-poor-brother/rights_report.json, app/client/assets/books/generated/the-rich-brother-and-the-poor-brother/processing_notes.md, app/client/assets/books/generated/the-rich-brother-and-the-poor-brother/sections/chapter-001.json
- Preview inspected: public/book-previews/the-rich-brother-and-the-poor-brother.preview.json
- Title: pass - Individual title preserved exactly as "The Rich Brother and the Poor Brother"; parent collection "The Lilac Fairy Book" is excluded from title and playback.
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
- Title evidence: The Rich Brother and the Poor Brother
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: There was once a rich old man who had two sons, and as his wife was dead, the elder lived with him, and helped him to look after his property. For a long time all went well; the young man got up very early in the morn... / There was once a rich old man who had two sons, and as his wife was dead, the elder lived with him, and helped him to look after his property. For a long time all went well; the young man got up very early in the morn...
- Raw/generated end: ... and slowly shook their heads. ‘We will pay the fine,’ said they, and the judge nodded. So the poor man rode the mule home, and brought back to his family enough money to keep them in comfort to the end of their days. / ... and slowly shook their heads. ‘We will pay the fine,’ said they, and the judge nodded. So the poor man rode the mule home, and brought back to his family enough money to keep them in comfort to the end of their days.
- Preview start: There was once a rich old man who had two sons, and as his wife was dead, the elder lived with him, and helped him to look after his property. For a long time all went well; the young man got up very early in the morn...

### jimmy-goggles-the-god

- Status: pass
- Generated output inspected: app/client/assets/books/generated/jimmy-goggles-the-god/manifest.json, app/client/assets/books/generated/jimmy-goggles-the-god/cleaned_book.json, app/client/assets/books/generated/jimmy-goggles-the-god/processed_book.json, app/client/assets/books/generated/jimmy-goggles-the-god/rights_report.json, app/client/assets/books/generated/jimmy-goggles-the-god/processing_notes.md, app/client/assets/books/generated/jimmy-goggles-the-god/sections/chapter-001.json
- Preview inspected: public/book-previews/jimmy-goggles-the-god.preview.json
- Title: pass - Individual title preserved exactly as "Jimmy Goggles the God"; parent collection "Twelve Stories and a Dream" is excluded from title and playback.
- Creator/editor metadata: pass - H. G. Wells is source-backed as author, no Unknown Author appears, and no parent collection metadata replaces the individual story metadata.
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
- Title evidence: JIMMY GOGGLES THE GOD
- Metadata evidence: Author: H. G. Wells; author as identified by the source
- Raw/generated start: “It isn't every one who's been a god,” said the sunburnt man. “But it's happened to me. Among other things.” I intimated my sense of his condescension. “It don't leave much for ambition, does it?” said the sunburnt ma... / “It isn't every one who's been a god,” said the sunburnt man. “But it's happened to me. Among other things.” I intimated my sense of his condescension. “It don't leave much for ambition, does it?” said the sunburnt ma...
- Raw/generated end: ...ing. My face was my fortune, as the saying is. And just a squeak of eight thousand pounds of gold—fifth share. But the natives cut up rusty, thank goodness, because they thought it was him had driven their luck away.” / ...ing. My face was my fortune, as the saying is. And just a squeak of eight thousand pounds of gold—fifth share. But the natives cut up rusty, thank goodness, because they thought it was him had driven their luck away.”
- Preview start: “It isn't every one who's been a god,” said the sunburnt man. “But it's happened to me. Among other things.” I intimated my sense of his condescension. “It don't leave much for ambition, does it?” said the sunburnt ma...

### miss-winchelsea-s-heart

- Status: pass
- Generated output inspected: app/client/assets/books/generated/miss-winchelsea-s-heart/manifest.json, app/client/assets/books/generated/miss-winchelsea-s-heart/cleaned_book.json, app/client/assets/books/generated/miss-winchelsea-s-heart/processed_book.json, app/client/assets/books/generated/miss-winchelsea-s-heart/rights_report.json, app/client/assets/books/generated/miss-winchelsea-s-heart/processing_notes.md, app/client/assets/books/generated/miss-winchelsea-s-heart/sections/chapter-001.json
- Preview inspected: public/book-previews/miss-winchelsea-s-heart.preview.json
- Title: pass - Individual title preserved exactly as "Miss Winchelsea’s Heart"; parent collection "Twelve Stories and a Dream" is excluded from title and playback.
- Creator/editor metadata: pass - H. G. Wells is source-backed as author, no Unknown Author appears, and no parent collection metadata replaces the individual story metadata.
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
- Title evidence: MISS WINCHELSEA'S HEART
- Metadata evidence: Author: H. G. Wells; author as identified by the source
- Raw/generated start: Miss Winchelsea was going to Rome. The matter had filled her mind for a month or more, and had overflowed so abundantly into her conversation that quite a number of people who were not going to Rome, and who were not ... / Miss Winchelsea was going to Rome. The matter had filled her mind for a month or more, and had overflowed so abundantly into her conversation that quite a number of people who were not going to Rome, and who were not ...
- Raw/generated end: ...end. Under various excuses she avoided visiting them again. After a time the visitor's room was occupied by their two little boys, and Fanny's invitations ceased. The intimacy of her letters had long since faded away. / ...end. Under various excuses she avoided visiting them again. After a time the visitor's room was occupied by their two little boys, and Fanny's invitations ceased. The intimacy of her letters had long since faded away.
- Preview start: Miss Winchelsea was going to Rome. The matter had filled her mind for a month or more, and had overflowed so abundantly into her conversation that quite a number of people who were not going to Rome, and who were not ...

### mr-brisher-s-treasure

- Status: pass
- Generated output inspected: app/client/assets/books/generated/mr-brisher-s-treasure/manifest.json, app/client/assets/books/generated/mr-brisher-s-treasure/cleaned_book.json, app/client/assets/books/generated/mr-brisher-s-treasure/processed_book.json, app/client/assets/books/generated/mr-brisher-s-treasure/rights_report.json, app/client/assets/books/generated/mr-brisher-s-treasure/processing_notes.md, app/client/assets/books/generated/mr-brisher-s-treasure/sections/chapter-001.json
- Preview inspected: public/book-previews/mr-brisher-s-treasure.preview.json
- Title: pass - Individual title preserved exactly as "Mr. Brisher’s Treasure"; parent collection "Twelve Stories and a Dream" is excluded from title and playback.
- Creator/editor metadata: pass - H. G. Wells is source-backed as author, no Unknown Author appears, and no parent collection metadata replaces the individual story metadata.
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
- Title evidence: MR. BRISHER'S TREASURE
- Metadata evidence: Author: H. G. Wells; author as identified by the source
- Raw/generated start: “You can't be TOO careful WHO you marry,” said Mr. Brisher, and pulled thoughtfully with a fat-wristed hand at the lank moustache that hides his want of chin. “That's why—” I ventured. “Yes,” said Mr. Brisher, with a ... / “You can't be TOO careful WHO you marry,” said Mr. Brisher, and pulled thoughtfully with a fat-wristed hand at the lank moustache that hides his want of chin. “That's why—” I ventured. “Yes,” said Mr. Brisher, with a ...
- Raw/generated end: ...they made of it. But they got 'im, though he dodged tremenjous. Traced 'is 'aving passed, oh!—nearly a dozen bad 'arf-crowns.” “And you didn't—?” “No fear. And it didn't do 'IM much good to say it was treasure trove.” / ...they made of it. But they got 'im, though he dodged tremenjous. Traced 'is 'aving passed, oh!—nearly a dozen bad 'arf-crowns.” “And you didn't—?” “No fear. And it didn't do 'IM much good to say it was treasure trove.”
- Preview start: “You can't be TOO careful WHO you marry,” said Mr. Brisher, and pulled thoughtfully with a fat-wristed hand at the lank moustache that hides his want of chin. “That's why—” I ventured. “Yes,” said Mr. Brisher, with a ...

### mr-ledbetter-s-vacation

- Status: pass
- Generated output inspected: app/client/assets/books/generated/mr-ledbetter-s-vacation/manifest.json, app/client/assets/books/generated/mr-ledbetter-s-vacation/cleaned_book.json, app/client/assets/books/generated/mr-ledbetter-s-vacation/processed_book.json, app/client/assets/books/generated/mr-ledbetter-s-vacation/rights_report.json, app/client/assets/books/generated/mr-ledbetter-s-vacation/processing_notes.md, app/client/assets/books/generated/mr-ledbetter-s-vacation/sections/chapter-001.json
- Preview inspected: public/book-previews/mr-ledbetter-s-vacation.preview.json
- Title: pass - Individual title preserved exactly as "Mr. Ledbetter’s Vacation"; parent collection "Twelve Stories and a Dream" is excluded from title and playback.
- Creator/editor metadata: pass - H. G. Wells is source-backed as author, no Unknown Author appears, and no parent collection metadata replaces the individual story metadata.
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
- Title evidence: MR. LEDBETTER'S VACATION
- Metadata evidence: Author: H. G. Wells; author as identified by the source
- Raw/generated start: My friend, Mr. Ledbetter, is a round-faced little man, whose natural mildness of eye is gigantically exaggerated when you catch the beam through his glasses, and whose deep, deliberate voice irritates irritable people... / My friend, Mr. Ledbetter, is a round-faced little man, whose natural mildness of eye is gigantically exaggerated when you catch the beam through his glasses, and whose deep, deliberate voice irritates irritable people...
- Raw/generated end: ...t the end he repeated his request for me to burn the letter. So the remarkable story of Mr. Ledbetter's Vacation ends. That breach with his aunt was not of long duration. The old lady had forgiven him before she died. / ...t the end he repeated his request for me to burn the letter. So the remarkable story of Mr. Ledbetter's Vacation ends. That breach with his aunt was not of long duration. The old lady had forgiven him before she died.
- Preview start: My friend, Mr. Ledbetter, is a round-faced little man, whose natural mildness of eye is gigantically exaggerated when you catch the beam through his glasses, and whose deep, deliberate voice irritates irritable people...

### mr-skelmersdale-in-fairyland

- Status: pass
- Generated output inspected: app/client/assets/books/generated/mr-skelmersdale-in-fairyland/manifest.json, app/client/assets/books/generated/mr-skelmersdale-in-fairyland/cleaned_book.json, app/client/assets/books/generated/mr-skelmersdale-in-fairyland/processed_book.json, app/client/assets/books/generated/mr-skelmersdale-in-fairyland/rights_report.json, app/client/assets/books/generated/mr-skelmersdale-in-fairyland/processing_notes.md, app/client/assets/books/generated/mr-skelmersdale-in-fairyland/sections/chapter-001.json
- Preview inspected: public/book-previews/mr-skelmersdale-in-fairyland.preview.json
- Title: pass - Individual title preserved exactly as "Mr. Skelmersdale in Fairyland"; parent collection "Twelve Stories and a Dream" is excluded from title and playback.
- Creator/editor metadata: pass - H. G. Wells is source-backed as author, no Unknown Author appears, and no parent collection metadata replaces the individual story metadata.
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
- Title evidence: MR. SKELMERSDALE IN FAIRYLAND
- Metadata evidence: Author: H. G. Wells; author as identified by the source
- Raw/generated start: “There's a man in that shop,” said the Doctor, “who has been in Fairyland.” “Nonsense!” I said, and stared back at the shop. It was the usual village shop, post-office, telegraph wire on its brow, zinc pans and brushe... / “There's a man in that shop,” said the Doctor, “who has been in Fairyland.” “Nonsense!” I said, and stared back at the shop. It was the usual village shop, post-office, telegraph wire on its brow, zinc pans and brushe...
- Raw/generated end: ...o difficult for him to express in words. “One gets talking,” he said at last at the door, and smiled wanly, and so vanished from my eyes. And that is the tale of Mr. Skelmersdale in Fairyland just as he told it to me. / ...o difficult for him to express in words. “One gets talking,” he said at last at the door, and smiled wanly, and so vanished from my eyes. And that is the tale of Mr. Skelmersdale in Fairyland just as he told it to me.
- Preview start: “There's a man in that shop,” said the Doctor, “who has been in Fairyland.” “Nonsense!” I said, and stared back at the shop. It was the usual village shop, post-office, telegraph wire on its brow, zinc pans and brushe...

### the-new-accelerator

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-new-accelerator/manifest.json, app/client/assets/books/generated/the-new-accelerator/cleaned_book.json, app/client/assets/books/generated/the-new-accelerator/processed_book.json, app/client/assets/books/generated/the-new-accelerator/rights_report.json, app/client/assets/books/generated/the-new-accelerator/processing_notes.md, app/client/assets/books/generated/the-new-accelerator/sections/chapter-001.json
- Preview inspected: public/book-previews/the-new-accelerator.preview.json
- Title: pass - Individual title preserved exactly as "The New Accelerator"; parent collection "Twelve Stories and a Dream" is excluded from title and playback.
- Creator/editor metadata: pass - H. G. Wells is source-backed as author, no Unknown Author appears, and no parent collection metadata replaces the individual story metadata.
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
- Title evidence: THE NEW ACCELERATOR
- Metadata evidence: Author: H. G. Wells; author as identified by the source
- Raw/generated start: Certainly, if ever a man found a guinea when he was looking for a pin it is my good friend Professor Gibberne. I have heard before of investigators overshooting the mark, but never quite to the extent that he has done... / Certainly, if ever a man found a guinea when he was looking for a pin it is my good friend Professor Gibberne. I have heard before of investigators overshooting the mark, but never quite to the extent that he has done...
- Raw/generated end: ...very thoroughly, and we have decided that this is purely a matter of medical jurisprudence and altogether outside our province. We shall manufacture and sell the Accelerator, and, as for the consequences—we shall see. / ...very thoroughly, and we have decided that this is purely a matter of medical jurisprudence and altogether outside our province. We shall manufacture and sell the Accelerator, and, as for the consequences—we shall see.
- Preview start: Certainly, if ever a man found a guinea when he was looking for a pin it is my good friend Professor Gibberne. I have heard before of investigators overshooting the mark, but never quite to the extent that he has done...

## Protections and Audit Side Effects

- Raw sources modified: no
- Cloudflare exports modified: no
- Unresolved-source generated books untouched: yes
- Duplicate/boundary skips not reintroduced: yes
- Unrelated generated/preview changes: none
- Audit side-effect handling: Known validation churn from write/title/start/metadata/manual/startup audits was restored before commit; verification report/script/package command remain.

## Browser and Playwright

- The in-app Browser sandbox issue was not part of this book branch. Standalone Playwright was used for QA.
- Standalone Playwright: 35/36 passed; only failure is known/pre-existing fullscreen-controls visibility assertion
- Known fullscreen-only failure: yes

## Validation

- typecheck: pass
- pilotWrite20: pass: 20 first-time processed, 0 skipped, 11 unresolved-source generated untouched
- batch12ProseRestore: pass: 20/20 exact
- startupPreviewAudit: pass: 415 generated startup previews, 415 valid, 0 preview updates
- titleStartDefaultAudit: pass: 415 audited, 12 known unrelated corrections restored, 0 accepted-book revocations
- metadataSegmentationAudit: pass: 415 audited, 0 author corrections, 1 documented unknown-author case, 0 accepted-book revocations
- manualUiDefectFollowup: pass: 8 checked, 8 acceptable, 0 corrected/revoked/manual review
- targetedVerifier: pass: 20 pass, 0 warn accepted, 0 fail, raw/generated 20/20 exact
- appBuild: not run; books:build prohibited for this task
- standalonePlaywright: 35/36 passed; only failure is known/pre-existing fullscreen-controls visibility assertion
- smokeTests: pass: 23/23 smoke tests
- gitDiffCheck: pass

## Backlog Note from pilot-write-20

- Dry-run 20 still had 96 skipped/unsafe raw-only candidates before write.
- These are not treated as lost or missed.
- After safe batching slows/exhausts, create a dedicated remaining raw inventory/triage report classifying every unprocessed raw file.
