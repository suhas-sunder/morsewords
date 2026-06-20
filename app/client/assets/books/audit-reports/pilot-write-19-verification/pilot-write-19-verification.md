# Pilot write batch 19 verification

Generated: 2026-06-20T20:20:05.307Z

## Summary

- Verified: 20
- Pass: 20
- Warn accepted: 0
- Fail: 0
- Accepted for main: 20
- Correction needed before main: 0
- Raw/generated exact: 20/20

## Write-12 Shared Script Scope

- Classification: harmless shared implementation intentionally used by write batch 19
- Resolution: Retain the write-12 change. Batches 13-19 use five-line wrappers that set MORSEWORDS_PILOT_WRITE_BATCH and import the established write-12 runner; this diff adds batch-19 typing, selection, dispatch, and backlog-note reporting.
- Unrelated changes found: no

## Batch-12 Prose Restoration

- Result: pass
- Compared: 20
- Remaining raw/generated mismatches: 0
- Remaining prose omissions: 0
- Remaining missing opening-quote defects: 0

## Special Focus

- Exact spelling: Halfman, Hassebu, Nunda, Pea-Hens, Jelly-Fish, and Eyes Opened match source-audited titles exactly.
- Andrew Lang role: 20/20 rights reports preserve Andrew Lang as editor from visible source evidence; no batch-19 title uses Unknown Author.
- Wrapped-line prose: 20/20 sanitized raw bodies match every generated body copy character-for-character (20/20 exact).
- Collection metadata/playback: 20/20 use the individual tale title and exclude parent collection/title/byline/source wrapper material from default playback.

## Books

### the-child-who-came-from-an-egg

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-child-who-came-from-an-egg/manifest.json, app/client/assets/books/generated/the-child-who-came-from-an-egg/cleaned_book.json, app/client/assets/books/generated/the-child-who-came-from-an-egg/processed_book.json, app/client/assets/books/generated/the-child-who-came-from-an-egg/rights_report.json, app/client/assets/books/generated/the-child-who-came-from-an-egg/processing_notes.md, app/client/assets/books/generated/the-child-who-came-from-an-egg/sections/chapter-001.json
- Preview inspected: public/book-previews/the-child-who-came-from-an-egg.preview.json
- Title: pass - Individual title preserved exactly as "The Child Who Came from an Egg"; parent collection "The Violet Fairy Book" is excluded from title and playback.
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
- Title evidence: THE CHILD WHO CAME FROM AN EGG
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Once upon a time there lived a queen whose heart was sore because she had no children. She was sad enough when her husband was at home with her, but when he was away she would see nobody, but sat and wept all day long... / Once upon a time there lived a queen whose heart was sore because she had no children. She was sad enough when her husband was at home with her, but when he was away she would see nobody, but sat and wept all day long...
- Raw/generated end: ... and was never seen again, nor the wonder-working basket either; but now that Dotterine’s troubles were over she could get on without them, and she and the young king lived happily together till the end of their days. / ... and was never seen again, nor the wonder-working basket either; but now that Dotterine’s troubles were over she could get on without them, and she and the young king lived happily together till the end of their days.
- Preview start: Once upon a time there lived a queen whose heart was sore because she had no children. She was sad enough when her husband was at home with her, but when he was away she would see nobody, but sat and wept all day long...

### the-finest-liar-in-the-world

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-finest-liar-in-the-world/manifest.json, app/client/assets/books/generated/the-finest-liar-in-the-world/cleaned_book.json, app/client/assets/books/generated/the-finest-liar-in-the-world/processed_book.json, app/client/assets/books/generated/the-finest-liar-in-the-world/rights_report.json, app/client/assets/books/generated/the-finest-liar-in-the-world/processing_notes.md, app/client/assets/books/generated/the-finest-liar-in-the-world/sections/chapter-001.json
- Preview inspected: public/book-previews/the-finest-liar-in-the-world.preview.json
- Title: pass - Individual title preserved exactly as "The Finest Liar in the World"; parent collection "The Violet Fairy Book" is excluded from title and playback.
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
- Title evidence: THE FINEST LIAR IN THE WORLD
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: At the edge of a wood there lived an old man who had only one son, and one day he called the boy to him and said he wanted some corn ground, but the youth must be sure never to enter any mill where the miller was bear... / At the edge of a wood there lived an old man who had only one son, and one day he called the boy to him and said he wanted some corn ground, but the youth must be sure never to enter any mill where the miller was bear...
- Raw/generated end: ...t on which was written, “The cake is mine, and the beardless one goes empty-handed.”’ With these words the boy rose, took the cake, and went home, while the beardless one remained behind to swallow his disappointment. / ...t on which was written, “The cake is mine, and the beardless one goes empty-handed.”’ With these words the boy rose, took the cake, and went home, while the beardless one remained behind to swallow his disappointment.
- Preview start: At the edge of a wood there lived an old man who had only one son, and one day he called the boy to him and said he wanted some corn ground, but the youth must be sure never to enter any mill where the miller was bear...

### the-frog

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-frog/manifest.json, app/client/assets/books/generated/the-frog/cleaned_book.json, app/client/assets/books/generated/the-frog/processed_book.json, app/client/assets/books/generated/the-frog/rights_report.json, app/client/assets/books/generated/the-frog/processing_notes.md, app/client/assets/books/generated/the-frog/sections/chapter-001.json
- Preview inspected: public/book-previews/the-frog.preview.json
- Title: pass - Individual title preserved exactly as "The Frog"; parent collection "The Violet Fairy Book" is excluded from title and playback.
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
- Title evidence: THE FROG
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Once upon a time there was a woman who had three sons. Though they were peasants they were well off, for the soil on which they lived was fruitful, and yielded rich crops. One day they all three told their mother they... / Once upon a time there was a woman who had three sons. Though they were peasants they were well off, for the soil on which they lived was fruitful, and yielded rich crops. One day they all three told their mother they...
- Raw/generated end: .... Great was the delight of the mother at her youngest son’s good fortune. A beautiful house was built for them; she was the favourite daughter-in-law; everything went well with them, and they lived happily ever after. / .... Great was the delight of the mother at her youngest son’s good fortune. A beautiful house was built for them; she was the favourite daughter-in-law; everything went well with them, and they lived happily ever after.
- Preview start: Once upon a time there was a woman who had three sons. Though they were peasants they were well off, for the soil on which they lived was fruitful, and yielded rich crops. One day they all three told their mother they...

### the-grateful-prince

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-grateful-prince/manifest.json, app/client/assets/books/generated/the-grateful-prince/cleaned_book.json, app/client/assets/books/generated/the-grateful-prince/processed_book.json, app/client/assets/books/generated/the-grateful-prince/rights_report.json, app/client/assets/books/generated/the-grateful-prince/processing_notes.md, app/client/assets/books/generated/the-grateful-prince/sections/chapter-001.json
- Preview inspected: public/book-previews/the-grateful-prince.preview.json
- Title: pass - Individual title preserved exactly as "The Grateful Prince"; parent collection "The Violet Fairy Book" is excluded from title and playback.
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
- Title evidence: THE GRATEFUL PRINCE
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Once upon a time the king of the Goldland lost himself in a forest, and try as he would he could not find the way out. As he was wandering down one path which had looked at first more hopeful than the rest he saw a ma... / Once upon a time the king of the Goldland lost himself in a forest, and try as he would he could not find the way out. As he was wandering down one path which had looked at first more hopeful than the rest he saw a ma...
- Raw/generated end: ... all the strange things that had befallen him, and how the maiden had borne him safe through all. And the councillors cried with one voice, ‘Let her be your wife, and our liege lady.’ And that is the end of the story. / ... all the strange things that had befallen him, and how the maiden had borne him safe through all. And the councillors cried with one voice, ‘Let her be your wife, and our liege lady.’ And that is the end of the story.
- Preview start: Once upon a time the king of the Goldland lost himself in a forest, and try as he would he could not find the way out. As he was wandering down one path which had looked at first more hopeful than the rest he saw a ma...

### the-headless-dwarfs

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-headless-dwarfs/manifest.json, app/client/assets/books/generated/the-headless-dwarfs/cleaned_book.json, app/client/assets/books/generated/the-headless-dwarfs/processed_book.json, app/client/assets/books/generated/the-headless-dwarfs/rights_report.json, app/client/assets/books/generated/the-headless-dwarfs/processing_notes.md, app/client/assets/books/generated/the-headless-dwarfs/sections/chapter-001.json
- Preview inspected: public/book-previews/the-headless-dwarfs.preview.json
- Title: pass - Individual title preserved exactly as "The Headless Dwarfs"; parent collection "The Violet Fairy Book" is excluded from title and playback.
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
- Title evidence: THE HEADLESS DWARFS
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: There was once a minister who spent his whole time in trying to find a servant who would undertake to ring the church bells at midnight, in addition to all his other duties. Of course it was not everyone who cared to ... / There was once a minister who spent his whole time in trying to find a servant who would undertake to ring the church bells at midnight, in addition to all his other duties. Of course it was not everyone who cared to ...
- Raw/generated end: ... any wages, the minister made no objections, but allowed him to do as he wished. So Hans went his way, bought himself a large house, and married a young wife, and lived happily and prosperously to the end of his days. / ... any wages, the minister made no objections, but allowed him to do as he wished. So Hans went his way, bought himself a large house, and married a young wife, and lived happily and prosperously to the end of his days.
- Preview start: There was once a minister who spent his whole time in trying to find a servant who would undertake to ring the church bells at midnight, in addition to all his other duties. Of course it was not everyone who cared to ...

### the-lute-player

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-lute-player/manifest.json, app/client/assets/books/generated/the-lute-player/cleaned_book.json, app/client/assets/books/generated/the-lute-player/processed_book.json, app/client/assets/books/generated/the-lute-player/rights_report.json, app/client/assets/books/generated/the-lute-player/processing_notes.md, app/client/assets/books/generated/the-lute-player/sections/chapter-001.json
- Preview inspected: public/book-previews/the-lute-player.preview.json
- Title: pass - Individual title preserved exactly as "The Lute Player"; parent collection "The Violet Fairy Book" is excluded from title and playback.
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
- Title evidence: THE LUTE PLAYER
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Once upon a time there was a king and queen who lived happily and comfortably together. They were very fond of each other and had nothing to worry them, but at last the king grew restless. He longed to go out into the... / Once upon a time there was a king and queen who lived happily and comfortably together. They were very fond of each other and had nothing to worry them, but at last the king grew restless. He longed to go out into the...
- Raw/generated end: ... his heart he gave a great feast to the whole world, and the whole world came and rejoiced with him for a whole week. I was there too, and ate and drank many good things. I sha’n’t forget that feast as long as I live. / ... his heart he gave a great feast to the whole world, and the whole world came and rejoiced with him for a whole week. I was there too, and ate and drank many good things. I sha’n’t forget that feast as long as I live.
- Preview start: Once upon a time there was a king and queen who lived happily and comfortably together. They were very fond of each other and had nothing to worry them, but at last the king grew restless. He longed to go out into the...

### the-maiden-with-the-wooden-helmet

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-maiden-with-the-wooden-helmet/manifest.json, app/client/assets/books/generated/the-maiden-with-the-wooden-helmet/cleaned_book.json, app/client/assets/books/generated/the-maiden-with-the-wooden-helmet/processed_book.json, app/client/assets/books/generated/the-maiden-with-the-wooden-helmet/rights_report.json, app/client/assets/books/generated/the-maiden-with-the-wooden-helmet/processing_notes.md, app/client/assets/books/generated/the-maiden-with-the-wooden-helmet/sections/chapter-001.json
- Preview inspected: public/book-previews/the-maiden-with-the-wooden-helmet.preview.json
- Title: pass - Individual title preserved exactly as "The Maiden with the Wooden Helmet"; parent collection "The Violet Fairy Book" is excluded from title and playback.
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
- Title evidence: THE MAIDEN WITH THE WOODEN HELMET
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: In a little village in the country of Japan there lived long, long ago a man and his wife. For many years they were happy and prosperous, but bad times came, and at last nothing was left them but their daughter, who w... / In a little village in the country of Japan there lived long, long ago a man and his wife. For many years they were happy and prosperous, but bad times came, and at last nothing was left them but their daughter, who w...
- Raw/generated end: ...ght was passed in singing and dancing, and then the bride and bridegroom went to their own house, where they lived till they died, and had many children, who were famous throughout Japan for their goodness and beauty. / ...ght was passed in singing and dancing, and then the bride and bridegroom went to their own house, where they lived till they died, and had many children, who were famous throughout Japan for their goodness and beauty.
- Preview start: In a little village in the country of Japan there lived long, long ago a man and his wife. For many years they were happy and prosperous, but bad times came, and at last nothing was left them but their daughter, who w...

### the-monkey-and-the-jelly-fish

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-monkey-and-the-jelly-fish/manifest.json, app/client/assets/books/generated/the-monkey-and-the-jelly-fish/cleaned_book.json, app/client/assets/books/generated/the-monkey-and-the-jelly-fish/processed_book.json, app/client/assets/books/generated/the-monkey-and-the-jelly-fish/rights_report.json, app/client/assets/books/generated/the-monkey-and-the-jelly-fish/processing_notes.md, app/client/assets/books/generated/the-monkey-and-the-jelly-fish/sections/chapter-001.json
- Preview inspected: public/book-previews/the-monkey-and-the-jelly-fish.preview.json
- Title: pass - Individual title preserved exactly as "The Monkey and the Jelly-Fish"; parent collection "The Violet Fairy Book" is excluded from title and playback.
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
- Title evidence: THE MONKEY AND THE JELLY-FISH
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Children must often have wondered why jelly-fishes have no shells, like so many of the creatures that are washed up every day on the beach. In old times this was not so; the jelly-fish had as hard a shell as any of th... / Children must often have wondered why jelly-fishes have no shells, like so many of the creatures that are washed up every day on the beach. In old times this was not so; the jelly-fish had as hard a shell as any of th...
- Raw/generated end: ...t, as sometimes happens, the turtle was allowed to go scot-free, and had his shell given back to him, and all the punishment fell on the poor jelly-fish, who was condemned by the queen to go shieldless for ever after. / ...t, as sometimes happens, the turtle was allowed to go scot-free, and had his shell given back to him, and all the punishment fell on the poor jelly-fish, who was condemned by the queen to go shieldless for ever after.
- Preview start: Children must often have wondered why jelly-fishes have no shells, like so many of the creatures that are washed up every day on the beach. In old times this was not so; the jelly-fish had as hard a shell as any of th...

### the-nine-pea-hens-and-the-golden-apples

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-nine-pea-hens-and-the-golden-apples/manifest.json, app/client/assets/books/generated/the-nine-pea-hens-and-the-golden-apples/cleaned_book.json, app/client/assets/books/generated/the-nine-pea-hens-and-the-golden-apples/processed_book.json, app/client/assets/books/generated/the-nine-pea-hens-and-the-golden-apples/rights_report.json, app/client/assets/books/generated/the-nine-pea-hens-and-the-golden-apples/processing_notes.md, app/client/assets/books/generated/the-nine-pea-hens-and-the-golden-apples/sections/chapter-001.json
- Preview inspected: public/book-previews/the-nine-pea-hens-and-the-golden-apples.preview.json
- Title: pass - Individual title preserved exactly as "The Nine Pea-Hens and the Golden Apples"; parent collection "The Violet Fairy Book" is excluded from title and playback.
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
- Title evidence: THE NINE PEA-HENS AND THE GOLDEN APPLES
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Once upon a time there stood before the palace of an emperor a golden apple tree, which blossomed and bore fruit each night. But every morning the fruit was gone, and the boughs were bare of blossom, without anyone be... / Once upon a time there stood before the palace of an emperor a golden apple tree, which blossomed and bore fruit each night. But every morning the fruit was gone, and the boughs were bare of blossom, without anyone be...
- Raw/generated end: ...the dragon’s horse plunged and reared, and the dragon fell on a rock, which broke him in pieces. Then the empress mounted his horse, and rode back with her husband to her kingdom, over which they ruled for many years. / ...the dragon’s horse plunged and reared, and the dragon fell on a rock, which broke him in pieces. Then the empress mounted his horse, and rode back with her husband to her kingdom, over which they ruled for many years.
- Preview start: Once upon a time there stood before the palace of an emperor a golden apple tree, which blossomed and bore fruit each night. But every morning the fruit was gone, and the boughs were bare of blossom, without anyone be...

### the-nunda-eater-of-people

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-nunda-eater-of-people/manifest.json, app/client/assets/books/generated/the-nunda-eater-of-people/cleaned_book.json, app/client/assets/books/generated/the-nunda-eater-of-people/processed_book.json, app/client/assets/books/generated/the-nunda-eater-of-people/rights_report.json, app/client/assets/books/generated/the-nunda-eater-of-people/processing_notes.md, app/client/assets/books/generated/the-nunda-eater-of-people/sections/chapter-001.json
- Preview inspected: public/book-previews/the-nunda-eater-of-people.preview.json
- Title: pass - Individual title preserved exactly as "The Nunda, Eater of People"; parent collection "The Violet Fairy Book" is excluded from title and playback.
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
- Title evidence: THE NUNDA, EATER OF PEOPLE
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Once upon a time there lived a sultan who loved his garden dearly, and planted it with trees and flowers and fruits from all parts of the world. He went to see them three times every day: first at seven o’clock, when ... / Once upon a time there lived a sultan who loved his garden dearly, and planted it with trees and flowers and fruits from all parts of the world. He went to see them three times every day: first at seven o’clock, when ...
- Raw/generated end: ...an did not dwell on the earth whose joy was greater than his. And the people bowed down to the boy and gave him presents, and loved him, because he had delivered them from the bondage of fear, and had slain the Nunda. / ...an did not dwell on the earth whose joy was greater than his. And the people bowed down to the boy and gave him presents, and loved him, because he had delivered them from the bondage of fear, and had slain the Nunda.
- Preview start: Once upon a time there lived a sultan who loved his garden dearly, and planted it with trees and flowers and fruits from all parts of the world. He went to see them three times every day: first at seven o’clock, when ...

### the-prince-who-wanted-to-see-the-world

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-prince-who-wanted-to-see-the-world/manifest.json, app/client/assets/books/generated/the-prince-who-wanted-to-see-the-world/cleaned_book.json, app/client/assets/books/generated/the-prince-who-wanted-to-see-the-world/processed_book.json, app/client/assets/books/generated/the-prince-who-wanted-to-see-the-world/rights_report.json, app/client/assets/books/generated/the-prince-who-wanted-to-see-the-world/processing_notes.md, app/client/assets/books/generated/the-prince-who-wanted-to-see-the-world/sections/chapter-001.json
- Preview inspected: public/book-previews/the-prince-who-wanted-to-see-the-world.preview.json
- Title: pass - Individual title preserved exactly as "The Prince Who Wanted to See the World"; parent collection "The Violet Fairy Book" is excluded from title and playback.
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
- Title evidence: THE PRINCE WHO WANTED TO SEE THE WORLD
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: There was once a king who had only one son, and this young man tormented his father from morning till night to allow him to travel in far countries. For a long time the king refused to give him leave; but at last, wea... / There was once a king who had only one son, and this young man tormented his father from morning till night to allow him to travel in far countries. For a long time the king refused to give him leave; but at last, wea...
- Raw/generated end: ...hich was written the name of the dove. And at last his memory came back to him, and he declared he would marry the princess and nobody else. So the next day the wedding took place, and they lived happy till they died. / ...hich was written the name of the dove. And at last his memory came back to him, and he declared he would marry the princess and nobody else. So the next day the wedding took place, and they lived happy till they died.
- Preview start: There was once a king who had only one son, and this young man tormented his father from morning till night to allow him to travel in far countries. For a long time the king refused to give him leave; but at last, wea...

### the-princess-who-was-hidden-underground

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-princess-who-was-hidden-underground/manifest.json, app/client/assets/books/generated/the-princess-who-was-hidden-underground/cleaned_book.json, app/client/assets/books/generated/the-princess-who-was-hidden-underground/processed_book.json, app/client/assets/books/generated/the-princess-who-was-hidden-underground/rights_report.json, app/client/assets/books/generated/the-princess-who-was-hidden-underground/processing_notes.md, app/client/assets/books/generated/the-princess-who-was-hidden-underground/sections/chapter-001.json
- Preview inspected: public/book-previews/the-princess-who-was-hidden-underground.preview.json
- Title: pass - Individual title preserved exactly as "The Princess Who Was Hidden Underground"; parent collection "The Violet Fairy Book" is excluded from title and playback.
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
- Title evidence: THE PRINCESS WHO WAS HIDDEN UNDERGROUND
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Once there was a king who had great riches, which, when he died, he divided among his three sons. The two eldest of these lived in rioting and feasting, and thus wasted and squandered their father’s wealth till nothin... / Once there was a king who had great riches, which, when he died, he divided among his three sons. The two eldest of these lived in rioting and feasting, and thus wasted and squandered their father’s wealth till nothin...
- Raw/generated end: ...lean her wings with her bill, and the lad said: ‘She who cleans her wings is the princess.’ Now the king could do nothing more but give her to the young man to wife, and they lived together in great joy and happiness. / ...lean her wings with her bill, and the lad said: ‘She who cleans her wings is the princess.’ Now the king could do nothing more but give her to the young man to wife, and they lived together in great joy and happiness.
- Preview start: Once there was a king who had great riches, which, when he died, he divided among his three sons. The two eldest of these lived in rioting and feasting, and thus wasted and squandered their father’s wealth till nothin...

### the-story-of-a-gazelle

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-story-of-a-gazelle/manifest.json, app/client/assets/books/generated/the-story-of-a-gazelle/cleaned_book.json, app/client/assets/books/generated/the-story-of-a-gazelle/processed_book.json, app/client/assets/books/generated/the-story-of-a-gazelle/rights_report.json, app/client/assets/books/generated/the-story-of-a-gazelle/processing_notes.md, app/client/assets/books/generated/the-story-of-a-gazelle/sections/chapter-001.json
- Preview inspected: public/book-previews/the-story-of-a-gazelle.preview.json
- Title: pass - Individual title preserved exactly as "The Story of a Gazelle"; parent collection "The Violet Fairy Book" is excluded from title and playback.
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
- Title evidence: THE STORY OF A GAZELLE
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Once upon a time there lived a man who wasted all his money, and grew so poor that his only food was a few grains of corn, which he scratched like a fowl from out of a dust-heap. One day he was scratching as usual amo... / Once upon a time there lived a man who wasted all his money, and grew so poor that his only food was a few grains of corn, which he scratched like a fowl from out of a dust-heap. One day he was scratching as usual amo...
- Raw/generated end: ...reamed that she was once more in her father’s house, and when she woke up it was no dream. And the man dreamed that he was on the dust-heap, scratching. And when he woke, behold! that also was no dream, but the truth. / ...reamed that she was once more in her father’s house, and when she woke up it was no dream. And the man dreamed that he was on the dust-heap, scratching. And when he woke, behold! that also was no dream, but the truth.
- Preview start: Once upon a time there lived a man who wasted all his money, and grew so poor that his only food was a few grains of corn, which he scratched like a fowl from out of a dust-heap. One day he was scratching as usual amo...

### the-story-of-halfman

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-story-of-halfman/manifest.json, app/client/assets/books/generated/the-story-of-halfman/cleaned_book.json, app/client/assets/books/generated/the-story-of-halfman/processed_book.json, app/client/assets/books/generated/the-story-of-halfman/rights_report.json, app/client/assets/books/generated/the-story-of-halfman/processing_notes.md, app/client/assets/books/generated/the-story-of-halfman/sections/chapter-001.json
- Preview inspected: public/book-previews/the-story-of-halfman.preview.json
- Title: pass - Individual title preserved exactly as "The Story of Halfman"; parent collection "The Violet Fairy Book" is excluded from title and playback.
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
- Title evidence: THE STORY OF HALFMAN
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: In a certain town there lived a judge who was married but had no children. One day he was standing lost in thought before his house, when an old man passed by. ‘What is the matter, sir, said he, ‘you look troubled?’ ‘... / In a certain town there lived a judge who was married but had no children. One day he was standing lost in thought before his house, when an old man passed by. ‘What is the matter, sir, said he, ‘you look troubled?’ ‘...
- Raw/generated end: ...nxious any more, for she can keep all her children.’ And Halfman mounted his horse and rode home, and told his wife all he had seen, and the message sent by Mohammed--Mohammed the son of Halfman, the son of the judge. / ...nxious any more, for she can keep all her children.’ And Halfman mounted his horse and rode home, and told his wife all he had seen, and the message sent by Mohammed--Mohammed the son of Halfman, the son of the judge.
- Preview start: In a certain town there lived a judge who was married but had no children. One day he was standing lost in thought before his house, when an old man passed by. ‘What is the matter, sir, said he, ‘you look troubled?’ ‘...

### the-story-of-hassebu

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-story-of-hassebu/manifest.json, app/client/assets/books/generated/the-story-of-hassebu/cleaned_book.json, app/client/assets/books/generated/the-story-of-hassebu/processed_book.json, app/client/assets/books/generated/the-story-of-hassebu/rights_report.json, app/client/assets/books/generated/the-story-of-hassebu/processing_notes.md, app/client/assets/books/generated/the-story-of-hassebu/sections/chapter-001.json
- Preview inspected: public/book-previews/the-story-of-hassebu.preview.json
- Title: pass - Individual title preserved exactly as "The Story of Hassebu"; parent collection "The Violet Fairy Book" is excluded from title and playback.
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
- Title evidence: THE STORY OF HASSEBU
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Once upon a time there lived a poor woman who had only one child, and he was a little boy called Hassebu. When he ceased to be a baby, and his mother thought it was time for him to learn to read, she sent him to schoo... / Once upon a time there lived a poor woman who had only one child, and he was a little boy called Hassebu. When he ceased to be a baby, and his mother thought it was time for him to learn to read, she sent him to schoo...
- Raw/generated end: ... way into the town, and all happened as the King of the Snakes had said. And the Sultan loved Hassebu, who became a great physician, and cured many sick people. But he was always sorry for the poor King of the Snakes. / ... way into the town, and all happened as the King of the Snakes had said. And the Sultan loved Hassebu, who became a great physician, and cured many sick people. But he was always sorry for the poor King of the Snakes.
- Preview start: Once upon a time there lived a poor woman who had only one child, and he was a little boy called Hassebu. When he ceased to be a baby, and his mother thought it was time for him to learn to read, she sent him to schoo...

### the-story-of-three-wonderful-beggars

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-story-of-three-wonderful-beggars/manifest.json, app/client/assets/books/generated/the-story-of-three-wonderful-beggars/cleaned_book.json, app/client/assets/books/generated/the-story-of-three-wonderful-beggars/processed_book.json, app/client/assets/books/generated/the-story-of-three-wonderful-beggars/rights_report.json, app/client/assets/books/generated/the-story-of-three-wonderful-beggars/processing_notes.md, app/client/assets/books/generated/the-story-of-three-wonderful-beggars/sections/chapter-001.json
- Preview inspected: public/book-previews/the-story-of-three-wonderful-beggars.preview.json
- Title: pass - Individual title preserved exactly as "The Story of Three Wonderful Beggars"; parent collection "The Violet Fairy Book" is excluded from title and playback.
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
- Title evidence: THE STORY OF THREE WONDERFUL BEGGARS
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: There once lived a merchant whose name was Mark, and whom people called ‘Mark the Rich.’ He was a very hard-hearted man, for he could not bear poor people, and if he caught sight of a beggar anywhere near his house, h... / There once lived a merchant whose name was Mark, and whom people called ‘Mark the Rich.’ He was a very hard-hearted man, for he could not bear poor people, and if he caught sight of a beggar anywhere near his house, h...
- Raw/generated end: ...he hungry and naked and all Mark’s riches became his. For many years Mark has been ferrying people across the river. His face is wrinkled, his hair and beard are snow white, and his eyes are dim; but still he rows on. / ...he hungry and naked and all Mark’s riches became his. For many years Mark has been ferrying people across the river. His face is wrinkled, his hair and beard are snow white, and his eyes are dim; but still he rows on.
- Preview start: There once lived a merchant whose name was Mark, and whom people called ‘Mark the Rich.’ He was a very hard-hearted man, for he could not bear poor people, and if he caught sight of a beggar anywhere near his house, h...

### the-three-princes-and-their-beasts

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-three-princes-and-their-beasts/manifest.json, app/client/assets/books/generated/the-three-princes-and-their-beasts/cleaned_book.json, app/client/assets/books/generated/the-three-princes-and-their-beasts/processed_book.json, app/client/assets/books/generated/the-three-princes-and-their-beasts/rights_report.json, app/client/assets/books/generated/the-three-princes-and-their-beasts/processing_notes.md, app/client/assets/books/generated/the-three-princes-and-their-beasts/sections/chapter-001.json
- Preview inspected: public/book-previews/the-three-princes-and-their-beasts.preview.json
- Title: pass - Individual title preserved exactly as "The Three Princes and Their Beasts"; parent collection "The Violet Fairy Book" is excluded from title and playback.
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
- Title evidence: THE THREE PRINCES AND THEIR BEASTS
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Once on a time there were three princes, who had a step-sister. One day they all set out hunting together. When they had gone some way through a thick wood they came on a great grey wolf with three cubs. Just as they ... / Once on a time there were three princes, who had a step-sister. One day they all set out hunting together. When they had gone some way through a thick wood they came on a great grey wolf with three cubs. Just as they ...
- Raw/generated end: ...od round them. Then the three princes set off together to the town. And the king did not know which was his son-in-law, but the princess knew which was her husband, and there were great rejoicings throughout the land. / ...od round them. Then the three princes set off together to the town. And the king did not know which was his son-in-law, but the princess knew which was her husband, and there were great rejoicings throughout the land.
- Preview start: Once on a time there were three princes, who had a step-sister. One day they all set out hunting together. When they had gone some way through a thick wood they came on a great grey wolf with three cubs. Just as they ...

### the-two-frogs

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-two-frogs/manifest.json, app/client/assets/books/generated/the-two-frogs/cleaned_book.json, app/client/assets/books/generated/the-two-frogs/processed_book.json, app/client/assets/books/generated/the-two-frogs/rights_report.json, app/client/assets/books/generated/the-two-frogs/processing_notes.md, app/client/assets/books/generated/the-two-frogs/sections/chapter-001.json
- Preview inspected: public/book-previews/the-two-frogs.preview.json
- Title: pass - Individual title preserved exactly as "The Two Frogs"; parent collection "The Violet Fairy Book" is excluded from title and playback.
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
- Title evidence: THE TWO FROGS
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Once upon a time in the country of Japan there lived two frogs, one of whom made his home in a ditch near the town of Osaka, on the sea coast, while the other dwelt in a clear little stream which ran through the city ... / Once upon a time in the country of Japan there lived two frogs, one of whom made his home in a ditch near the town of Osaka, on the sea coast, while the other dwelt in a clear little stream which ran through the city ...
- Raw/generated end: ...they took a polite farewell of each other, and set off for home again, and to the end of their lives they believed that Osaka and Kioto, which are as different to look at as two towns can be, were as like as two peas. / ...they took a polite farewell of each other, and set off for home again, and to the end of their lives they believed that Osaka and Kioto, which are as different to look at as two towns can be, were as like as two peas.
- Preview start: Once upon a time in the country of Japan there lived two frogs, one of whom made his home in a ditch near the town of Osaka, on the sea coast, while the other dwelt in a clear little stream which ran through the city ...

### the-underground-workers

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-underground-workers/manifest.json, app/client/assets/books/generated/the-underground-workers/cleaned_book.json, app/client/assets/books/generated/the-underground-workers/processed_book.json, app/client/assets/books/generated/the-underground-workers/rights_report.json, app/client/assets/books/generated/the-underground-workers/processing_notes.md, app/client/assets/books/generated/the-underground-workers/sections/chapter-001.json
- Preview inspected: public/book-previews/the-underground-workers.preview.json
- Title: pass - Individual title preserved exactly as "The Underground Workers"; parent collection "The Violet Fairy Book" is excluded from title and playback.
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
- Title evidence: THE UNDERGROUND WORKERS
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: On a bitter night somewhere between Christmas and the New Year, a man set out to walk to the neighbouring village. It was not many miles off, but the snow was so thick that there were no roads, or walls, or hedges lef... / On a bitter night somewhere between Christmas and the New Year, a man set out to walk to the neighbouring village. It was not many miles off, but the snow was so thick that there were no roads, or walls, or hedges lef...
- Raw/generated end: ...enty of money left over. When he was settled, he married a pretty girl who lived near by, and had some children, to whom on his death-bed he told the story of the lord of the underworld, and how he had made Hans rich. / ...enty of money left over. When he was settled, he married a pretty girl who lived near by, and had some children, to whom on his death-bed he told the story of the lord of the underworld, and how he had made Hans rich.
- Preview start: On a bitter night somewhere between Christmas and the New Year, a man set out to walk to the neighbouring village. It was not many miles off, but the snow was so thick that there were no roads, or walls, or hedges lef...

### the-young-man-who-would-have-his-eyes-opened

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-young-man-who-would-have-his-eyes-opened/manifest.json, app/client/assets/books/generated/the-young-man-who-would-have-his-eyes-opened/cleaned_book.json, app/client/assets/books/generated/the-young-man-who-would-have-his-eyes-opened/processed_book.json, app/client/assets/books/generated/the-young-man-who-would-have-his-eyes-opened/rights_report.json, app/client/assets/books/generated/the-young-man-who-would-have-his-eyes-opened/processing_notes.md, app/client/assets/books/generated/the-young-man-who-would-have-his-eyes-opened/sections/chapter-001.json
- Preview inspected: public/book-previews/the-young-man-who-would-have-his-eyes-opened.preview.json
- Title: pass - Individual title preserved exactly as "The Young Man Who Would Have His Eyes Opened"; parent collection "The Violet Fairy Book" is excluded from title and playback.
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
- Title evidence: THE YOUNG MAN WHO WOULD HAVE HIS EYES OPENED
- Metadata evidence: Author: Andrew Lang; Edited By Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: Once upon a time there lived a youth who was never happy unless he was prying into something that other people knew nothing about. After he had learned to understand the language of birds and beasts, he discovered acc... / Once upon a time there lived a youth who was never happy unless he was prying into something that other people knew nothing about. After he had learned to understand the language of birds and beasts, he discovered acc...
- Raw/generated end: ...anything else in the world, and was sick to the end of his life with longing for that beautiful vision. And that was the way he learned that the wizard had spoken truly when he said, ‘Blindness is man’s highest good.’ / ...anything else in the world, and was sick to the end of his life with longing for that beautiful vision. And that was the way he learned that the wizard had spoken truly when he said, ‘Blindness is man’s highest good.’
- Preview start: Once upon a time there lived a youth who was never happy unless he was prying into something that other people knew nothing about. After he had learned to understand the language of birds and beasts, he discovered acc...

## Protections and Audit Side Effects

- Raw sources modified: no
- Cloudflare exports modified: no
- Unresolved-source generated books untouched: yes
- Duplicate/boundary skips not reintroduced: yes
- Unrelated generated/preview changes: none
- Audit side-effect handling: pass: validation-generated audit/generated/preview churn was inspected and restored before commit

## Browser and Playwright

- The in-app Browser sandbox issue was not part of this book branch. Standalone Playwright was used for QA.
- Standalone Playwright: pass: 36/36 desktop-chromium
- Known fullscreen-only failure: no

## Validation

- typecheck: pass
- pilotWrite19: pass: 20 processed, 0 skipped; 11 unresolved-source generated books untouched
- batch12ProseRestore: pass: 20/20 exact; zero remaining prose/quote defects
- startupPreviewAudit: pass: 395/395 valid; 0 preview updates
- titleStartDefaultAudit: pass: 395 audited; 0 accepted revoked; 12 unrelated corrections restored
- metadataSegmentationAudit: pass: 395 audited; 0 author corrections; 1 documented unknown-author case; 0 accepted revoked
- manualUiDefectFollowup: pass: 8/8 acceptable; 0 corrected, 0 revoked, 0 manual review
- targetedVerifier: pass: 20/20; raw/generated 20/20 exact
- appBuild: known pre-existing SSR heap OOM after successful client bundle; not caused by verification script
- standalonePlaywright: pass: 36/36 desktop-chromium
- smokeTests: pass: 23/23 smoke tests
- gitDiffCheck: pass

## Backlog Note from pilot-write-19

- Dry-run 19 still had 116 skipped/unsafe raw-only candidates before write.
- These are not treated as lost or missed.
- After safe batching slows/exhausts, create a dedicated remaining raw inventory/triage report classifying every unprocessed raw file.
