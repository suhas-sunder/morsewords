# Pilot write batch 16 verification

Generated: 2026-06-20T06:30:47.804Z

## Summary

- Verified: 20
- Pass: 20
- Warn accepted: 0
- Fail: 0
- Accepted for main: 20
- Correction needed before main: 0

## Shared Script Scope

- Classification: harmless shared implementation intentionally used by write batch 16
- Resolution: Retain the write-12 change. The existing shared writer is explicitly batch-selected by MORSEWORDS_PILOT_WRITE_BATCH; write-16 is a five-line scoped wrapper, and the write-12 diff adds only dry-run 16 typing, selection, and dispatch support.
- Unrelated changes found: no

## Batch-12 Prose Restoration

- Result: pass
- Compared: 20
- Remaining raw/generated mismatches: 0
- Remaining prose omissions: 0
- Remaining missing opening-quote defects: 0

## Books

### the-purple-of-the-balkan-kings

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-purple-of-the-balkan-kings/manifest.json, app/client/assets/books/generated/the-purple-of-the-balkan-kings/cleaned_book.json, app/client/assets/books/generated/the-purple-of-the-balkan-kings/processed_book.json, app/client/assets/books/generated/the-purple-of-the-balkan-kings/rights_report.json, app/client/assets/books/generated/the-purple-of-the-balkan-kings/processing_notes.md, app/client/assets/books/generated/the-purple-of-the-balkan-kings/sections/chapter-001.json
- Preview inspected: public/book-previews/the-purple-of-the-balkan-kings.preview.json
- Title verdict: Individual title preserved exactly as “The Purple of the Balkan Kings”; parent collection “The Toys of Peace, and Other Papers” is excluded.
- Author/compiler/collector/translator/reteller verdict: Saki matches the raw Project Gutenberg Author line and existing generated metadata convention.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, names, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE PURPLE OF THE BALKAN KINGS
- Metadata evidence: Author: Saki; role author
- Start evidence: Luitpold Wolkenstein, financier and diplomat on a small, obtrusive, self-important scale, sat in his favoured cafe in the world-wise Habsburg capital, confronted with the _Neue Freie Presse_ and the cup of cream-toppe... / Luitpold Wolkenstein, financier and diplomat on a small, obtrusive, self-important scale, sat in his favoured cafe in the world-wise Habsburg capital, confronted with the _Neue Freie Presse_ and the cup of cream-toppe...
- End evidence: ...orum of domino players to arrive. They would all have read the article in the _Freie Presse_. And there are moments when an oracle finds its greatest salvation in withdrawing itself from the area of human questioning. / ...orum of domino players to arrive. They would all have read the article in the _Freie Presse_. And there are moments when an oracle finds its greatest salvation in withdrawing itself from the area of human questioning.
- Preview evidence: Luitpold Wolkenstein, financier and diplomat on a small, obtrusive, self-important scale, sat in his favoured cafe in the world-wise Habsburg capital, confronted with the _Neue Freie Presse_ and the cup of cream-toppe...

### the-seven-cream-jugs

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-seven-cream-jugs/manifest.json, app/client/assets/books/generated/the-seven-cream-jugs/cleaned_book.json, app/client/assets/books/generated/the-seven-cream-jugs/processed_book.json, app/client/assets/books/generated/the-seven-cream-jugs/rights_report.json, app/client/assets/books/generated/the-seven-cream-jugs/processing_notes.md, app/client/assets/books/generated/the-seven-cream-jugs/sections/chapter-001.json
- Preview inspected: public/book-previews/the-seven-cream-jugs.preview.json
- Title verdict: Individual title preserved exactly as “The Seven Cream Jugs”; parent collection “The Toys of Peace, and Other Papers” is excluded.
- Author/compiler/collector/translator/reteller verdict: Saki matches the raw Project Gutenberg Author line and existing generated metadata convention.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, names, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE SEVEN CREAM JUGS
- Metadata evidence: Author: Saki; role author
- Start evidence: “I suppose we shall never see Wilfred Pigeoncote here now that he has become heir to the baronetcy and to a lot of money,” observed Mrs. Peter Pigeoncote regretfully to her husband. “Well, we can hardly expect to,” he... / “I suppose we shall never see Wilfred Pigeoncote here now that he has become heir to the baronetcy and to a lot of money,” observed Mrs. Peter Pigeoncote regretfully to her husband. “Well, we can hardly expect to,” he...
- End evidence: ... Bullyon, who stayed with them in the spring, always carried two very obvious jewel-cases with her to the bath-room, explaining them to any one she chanced to meet in the corridor as her manicure and face-massage set. / ... Bullyon, who stayed with them in the spring, always carried two very obvious jewel-cases with her to the bath-room, explaining them to any one she chanced to meet in the corridor as her manicure and face-massage set.
- Preview evidence: “I suppose we shall never see Wilfred Pigeoncote here now that he has become heir to the baronetcy and to a lot of money,” observed Mrs. Peter Pigeoncote regretfully to her husband. “Well, we can hardly expect to,” he...

### the-sheep

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-sheep/manifest.json, app/client/assets/books/generated/the-sheep/cleaned_book.json, app/client/assets/books/generated/the-sheep/processed_book.json, app/client/assets/books/generated/the-sheep/rights_report.json, app/client/assets/books/generated/the-sheep/processing_notes.md, app/client/assets/books/generated/the-sheep/sections/chapter-001.json
- Preview inspected: public/book-previews/the-sheep.preview.json
- Title verdict: Individual title preserved exactly as “The Sheep”; parent collection “The Toys of Peace, and Other Papers” is excluded.
- Author/compiler/collector/translator/reteller verdict: Saki matches the raw Project Gutenberg Author line and existing generated metadata convention.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, names, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE SHEEP
- Metadata evidence: Author: Saki; role author
- Start evidence: The enemy had declared “no trumps.” Rupert played out his ace and king of clubs and cleared the adversary of that suit; then the Sheep, whom the Fates had inflicted on him for a partner, took the third round with the ... / The enemy had declared “no trumps.” Rupert played out his ace and king of clubs and cleared the adversary of that suit; then the Sheep, whom the Fates had inflicted on him for a partner, took the third round with the ...
- End evidence: ...e year with Rupert, and a small Robbie stands in some danger of being idolised by a devoted uncle. But for twelve months of the year Rupert’s most inseparable and valued companion is a sturdy tawny and white yard-dog. / ...e year with Rupert, and a small Robbie stands in some danger of being idolised by a devoted uncle. But for twelve months of the year Rupert’s most inseparable and valued companion is a sturdy tawny and white yard-dog.
- Preview evidence: The enemy had declared “no trumps.” Rupert played out his ace and king of clubs and cleared the adversary of that suit; then the Sheep, whom the Fates had inflicted on him for a partner, took the third round with the ...

### the-threat

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-threat/manifest.json, app/client/assets/books/generated/the-threat/cleaned_book.json, app/client/assets/books/generated/the-threat/processed_book.json, app/client/assets/books/generated/the-threat/rights_report.json, app/client/assets/books/generated/the-threat/processing_notes.md, app/client/assets/books/generated/the-threat/sections/chapter-001.json
- Preview inspected: public/book-previews/the-threat.preview.json
- Title verdict: Individual title preserved exactly as “The Threat”; parent collection “The Toys of Peace, and Other Papers” is excluded.
- Author/compiler/collector/translator/reteller verdict: Saki matches the raw Project Gutenberg Author line and existing generated metadata convention.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, names, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE THREAT
- Metadata evidence: Author: Saki; role author
- Start evidence: Sir Lulworth Quayne sat in the lounge of his favourite restaurant, the Gallus Bankiva, discussing the weaknesses of the world with his nephew, who had lately returned from a much-enlivened exile in the wilds of Mexico... / Sir Lulworth Quayne sat in the lounge of his favourite restaurant, the Gallus Bankiva, discussing the weaknesses of the world with his nephew, who had lately returned from a much-enlivened exile in the wilds of Mexico...
- End evidence: ...easures of the century.” “A measure conferring the vote on women?” asked the nephew. “Oh dear, no. An Act which made it a penal offence to erect commemorative statuary anywhere within three miles of a public highway.” / ...easures of the century.” “A measure conferring the vote on women?” asked the nephew. “Oh dear, no. An Act which made it a penal offence to erect commemorative statuary anywhere within three miles of a public highway.”
- Preview evidence: Sir Lulworth Quayne sat in the lounge of his favourite restaurant, the Gallus Bankiva, discussing the weaknesses of the world with his nephew, who had lately returned from a much-enlivened exile in the wilds of Mexico...

### the-toys-of-peace

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-toys-of-peace/manifest.json, app/client/assets/books/generated/the-toys-of-peace/cleaned_book.json, app/client/assets/books/generated/the-toys-of-peace/processed_book.json, app/client/assets/books/generated/the-toys-of-peace/rights_report.json, app/client/assets/books/generated/the-toys-of-peace/processing_notes.md, app/client/assets/books/generated/the-toys-of-peace/sections/chapter-001.json
- Preview inspected: public/book-previews/the-toys-of-peace.preview.json
- Title verdict: Individual title preserved exactly as “The Toys of Peace”; parent collection “The Toys of Peace, and Other Papers” is excluded.
- Author/compiler/collector/translator/reteller verdict: Saki matches the raw Project Gutenberg Author line and existing generated metadata convention.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, names, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE TOYS OF PEACE
- Metadata evidence: Author: Saki; role author
- Start evidence: “Harvey,” said Eleanor Bope, handing her brother a cutting from a London morning paper of the 19th of March, “just read this about children’s toys, please; it exactly carries out some of our ideas about influence and ... / “Harvey,” said Eleanor Bope, handing her brother a cutting from a London morning paper of the 19th of March, “just read this about children’s toys, please; it exactly carries out some of our ideas about influence and ...
- End evidence: ...‘I have lost a Marshal,’ says Louis, ‘but I do not go back empty-handed.’” Harvey stole away from the room, and sought out his sister. “Eleanor,” he said, “the experiment—” “Yes?” “Has failed. We have begun too late.” / ...‘I have lost a Marshal,’ says Louis, ‘but I do not go back empty-handed.’” Harvey stole away from the room, and sought out his sister. “Eleanor,” he said, “the experiment—” “Yes?” “Has failed. We have begun too late.”
- Preview evidence: “Harvey,” said Eleanor Bope, handing her brother a cutting from a London morning paper of the 19th of March, “just read this about children’s toys, please; it exactly carries out some of our ideas about influence and ...

### the-wolves-of-cernogratz

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-wolves-of-cernogratz/manifest.json, app/client/assets/books/generated/the-wolves-of-cernogratz/cleaned_book.json, app/client/assets/books/generated/the-wolves-of-cernogratz/processed_book.json, app/client/assets/books/generated/the-wolves-of-cernogratz/rights_report.json, app/client/assets/books/generated/the-wolves-of-cernogratz/processing_notes.md, app/client/assets/books/generated/the-wolves-of-cernogratz/sections/chapter-001.json
- Preview inspected: public/book-previews/the-wolves-of-cernogratz.preview.json
- Title verdict: Individual title preserved exactly as “The Wolves of Cernogratz”; parent collection “The Toys of Peace, and Other Papers” is excluded.
- Author/compiler/collector/translator/reteller verdict: Saki matches the raw Project Gutenberg Author line and existing generated metadata convention.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, names, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE WOLVES OF CERNOGRATZ
- Metadata evidence: Author: Saki; role author
- Start evidence: “Are there any old legends attached to the castle?” asked Conrad of his sister. Conrad was a prosperous Hamburg merchant, but he was the one poetically-dispositioned member of an eminently practical family. The Barone... / “Are there any old legends attached to the castle?” asked Conrad of his sister. Conrad was a prosperous Hamburg merchant, but he was the one poetically-dispositioned member of an eminently practical family. The Barone...
- End evidence: ...ns unnecessary for the old Fraulein. But the notice in the newspapers looked very well— “On December 29th, at Schloss Cernogratz, Amalie von Cernogratz, for many years the valued friend of Baron and Baroness Gruebel.” / ...ns unnecessary for the old Fraulein. But the notice in the newspapers looked very well— “On December 29th, at Schloss Cernogratz, Amalie von Cernogratz, for many years the valued friend of Baron and Baroness Gruebel.”
- Preview evidence: “Are there any old legends attached to the castle?” asked Conrad of his sister. Conrad was a prosperous Hamburg merchant, but he was the one poetically-dispositioned member of an eminently practical family. The Barone...

### how-an-old-man-lost-his-wen

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/how-an-old-man-lost-his-wen/manifest.json, app/client/assets/books/generated/how-an-old-man-lost-his-wen/cleaned_book.json, app/client/assets/books/generated/how-an-old-man-lost-his-wen/processed_book.json, app/client/assets/books/generated/how-an-old-man-lost-his-wen/rights_report.json, app/client/assets/books/generated/how-an-old-man-lost-his-wen/processing_notes.md, app/client/assets/books/generated/how-an-old-man-lost-his-wen/sections/chapter-001.json
- Preview inspected: public/book-previews/how-an-old-man-lost-his-wen.preview.json
- Title verdict: Individual title preserved exactly as “How an Old Man Lost His Wen”; parent collection “Japanese Fairy Tales” is excluded.
- Author/compiler/collector/translator/reteller verdict: Yei Theodora Ozaki is source-backed as compiler; the legacy author array follows the existing Japanese-tale metadata convention without claiming an unknown author.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, names, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: HOW AN OLD MAN LOST HIS WEN
- Metadata evidence: Author: Yei Theodora Ozaki; role compiler
- Start evidence: Many, many years ago there lived a good old man who had a wen like a tennis-ball growing out of his right cheek. This lump was a great disfigurement to the old man, and so annoyed him that for many years he spent all ... / Many, many years ago there lived a good old man who had a wen like a tennis-ball growing out of his right cheek. This lump was a great disfigurement to the old man, and so annoyed him that for many years he spent all ...
- End evidence: ...on the left. The demons had all disappeared, and there was nothing for him to do but to return home. He was a pitiful sight, for his face, with the two large lumps, one on each side, looked just like a Japanese gourd. / ...on the left. The demons had all disappeared, and there was nothing for him to do but to return home. He was a pitiful sight, for his face, with the two large lumps, one on each side, looked just like a Japanese gourd.
- Preview evidence: Many, many years ago there lived a good old man who had a wen like a tennis-ball growing out of his right cheek. This lump was a great disfigurement to the old man, and so annoyed him that for many years he spent all ...

### momotaro-or-the-story-of-the-son-of-a-peach

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/momotaro-or-the-story-of-the-son-of-a-peach/manifest.json, app/client/assets/books/generated/momotaro-or-the-story-of-the-son-of-a-peach/cleaned_book.json, app/client/assets/books/generated/momotaro-or-the-story-of-the-son-of-a-peach/processed_book.json, app/client/assets/books/generated/momotaro-or-the-story-of-the-son-of-a-peach/rights_report.json, app/client/assets/books/generated/momotaro-or-the-story-of-the-son-of-a-peach/processing_notes.md, app/client/assets/books/generated/momotaro-or-the-story-of-the-son-of-a-peach/sections/chapter-001.json
- Preview inspected: public/book-previews/momotaro-or-the-story-of-the-son-of-a-peach.preview.json
- Title verdict: Individual title preserved exactly as “Momotaro, or the Story of the Son of a Peach”; parent collection “Japanese Fairy Tales” is excluded.
- Author/compiler/collector/translator/reteller verdict: Yei Theodora Ozaki is source-backed as compiler; the legacy author array follows the existing Japanese-tale metadata convention without claiming an unknown author.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, names, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: MOMOTARO, OR THE STORY OF THE SON OF A PEACH
- Metadata evidence: Author: Yei Theodora Ozaki; role compiler
- Start evidence: Long, long ago there lived, an old man and an old woman; they were peasants, and had to work hard to earn their daily rice. The old man used to go and cut grass for the farmers around, and while he was gone the old wo... / Long, long ago there lived, an old man and an old woman; they were peasants, and had to work hard to earn their daily rice. The old man used to go and cut grass for the farmers around, and while he was gone the old wo...
- End evidence: ...ils who had been a terror of the land for a long time. The old couple’s joy was greater than ever, and the treasure Momotaro had brought home with him enabled them to live in peace and plenty to the end of their days. / ...ils who had been a terror of the land for a long time. The old couple’s joy was greater than ever, and the treasure Momotaro had brought home with him enabled them to live in peace and plenty to the end of their days.
- Preview evidence: Long, long ago there lived, an old man and an old woman; they were peasants, and had to work hard to earn their daily rice. The old man used to go and cut grass for the farmers around, and while he was gone the old wo...

### my-lord-bag-of-rice

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/my-lord-bag-of-rice/manifest.json, app/client/assets/books/generated/my-lord-bag-of-rice/cleaned_book.json, app/client/assets/books/generated/my-lord-bag-of-rice/processed_book.json, app/client/assets/books/generated/my-lord-bag-of-rice/rights_report.json, app/client/assets/books/generated/my-lord-bag-of-rice/processing_notes.md, app/client/assets/books/generated/my-lord-bag-of-rice/sections/chapter-001.json
- Preview inspected: public/book-previews/my-lord-bag-of-rice.preview.json
- Title verdict: Individual title preserved exactly as “My Lord Bag of Rice”; parent collection “Japanese Fairy Tales” is excluded.
- Author/compiler/collector/translator/reteller verdict: Yei Theodora Ozaki is source-backed as compiler; the legacy author array follows the existing Japanese-tale metadata convention without claiming an unknown author.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, names, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: MY LORD BAG OF RICE
- Metadata evidence: Author: Yei Theodora Ozaki; role compiler
- Start evidence: Long, long ago there lived, in Japan a brave warrior known to all as Tawara Toda, or “My Lord Bag of Rice.” His true name was Fujiwara Hidesato, and there is a very interesting story of how he came to change his name.... / Long, long ago there lived, in Japan a brave warrior known to all as Tawara Toda, or “My Lord Bag of Rice.” His true name was Fujiwara Hidesato, and there is a very interesting story of how he came to change his name....
- End evidence: ...epan. The fame of Hidesato’s fortune spread far and wide, and as there was no need for him to spend money on rice or silk or firing, he became very rich and prosperous, and was henceforth known as My Lord Bag of Rice. / ...epan. The fame of Hidesato’s fortune spread far and wide, and as there was no need for him to spend money on rice or silk or firing, he became very rich and prosperous, and was henceforth known as My Lord Bag of Rice.
- Preview evidence: Long, long ago there lived, in Japan a brave warrior known to all as Tawara Toda, or “My Lord Bag of Rice.” His true name was Fujiwara Hidesato, and there is a very interesting story of how he came to change his name....

### the-mirror-of-matsuyama

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-mirror-of-matsuyama/manifest.json, app/client/assets/books/generated/the-mirror-of-matsuyama/cleaned_book.json, app/client/assets/books/generated/the-mirror-of-matsuyama/processed_book.json, app/client/assets/books/generated/the-mirror-of-matsuyama/rights_report.json, app/client/assets/books/generated/the-mirror-of-matsuyama/processing_notes.md, app/client/assets/books/generated/the-mirror-of-matsuyama/sections/chapter-001.json
- Preview inspected: public/book-previews/the-mirror-of-matsuyama.preview.json
- Title verdict: Individual title preserved exactly as “The Mirror of Matsuyama”; parent collection “Japanese Fairy Tales” is excluded.
- Author/compiler/collector/translator/reteller verdict: Yei Theodora Ozaki is source-backed as compiler; the legacy author array follows the existing Japanese-tale metadata convention without claiming an unknown author.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, names, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE MIRROR OF MATSUYAMA
- Metadata evidence: Author: Yei Theodora Ozaki; role compiler
- Start evidence: Long years ago in old Japan there lived in the Province of Echigo, a very remote part of Japan even in these days, a man and his wife. When this story begins they had been married for some years and were blessed with ... / Long years ago in old Japan there lived in the Province of Echigo, a very remote part of Japan even in these days, a man and his wife. When this story begins they had been married for some years and were blessed with ...
- End evidence: ...trouble ever darkened the home again, and the young girl gradually forgot that year of unhappiness in the tender love and care that her step-mother now bestowed on her. Her patience and goodness were rewarded at last. / ...trouble ever darkened the home again, and the young girl gradually forgot that year of unhappiness in the tender love and care that her step-mother now bestowed on her. Her patience and goodness were rewarded at last.
- Preview evidence: Long years ago in old Japan there lived in the Province of Echigo, a very remote part of Japan even in these days, a man and his wife. When this story begins they had been married for some years and were blessed with ...

### the-ogre-of-rashomon

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-ogre-of-rashomon/manifest.json, app/client/assets/books/generated/the-ogre-of-rashomon/cleaned_book.json, app/client/assets/books/generated/the-ogre-of-rashomon/processed_book.json, app/client/assets/books/generated/the-ogre-of-rashomon/rights_report.json, app/client/assets/books/generated/the-ogre-of-rashomon/processing_notes.md, app/client/assets/books/generated/the-ogre-of-rashomon/sections/chapter-001.json
- Preview inspected: public/book-previews/the-ogre-of-rashomon.preview.json
- Title verdict: Individual title preserved exactly as “The Ogre of Rashomon”; parent collection “Japanese Fairy Tales” is excluded.
- Author/compiler/collector/translator/reteller verdict: Yei Theodora Ozaki is source-backed as compiler; the legacy author array follows the existing Japanese-tale metadata convention without claiming an unknown author.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, names, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE OGRE OF RASHOMON
- Metadata evidence: Author: Yei Theodora Ozaki; role compiler
- Start evidence: Long, long ago in Kyoto, the people of the city were terrified by accounts of a dreadful ogre, who, it was said, haunted the Gate of Rashomon at twilight and seized whoever passed by. The missing victims were never se... / Long, long ago in Kyoto, the people of the city were terrified by accounts of a dreadful ogre, who, it was said, haunted the Gate of Rashomon at twilight and seized whoever passed by. The missing victims were never se...
- End evidence: ...Watanabe’s great strength and daring, and never troubled Kyoto again. So once more the people of the city were able to go out without fear even at night time, and the brave deeds of Watanabe have never been forgotten! / ...Watanabe’s great strength and daring, and never troubled Kyoto again. So once more the people of the city were able to go out without fear even at night time, and the brave deeds of Watanabe have never been forgotten!
- Preview evidence: Long, long ago in Kyoto, the people of the city were terrified by accounts of a dreadful ogre, who, it was said, haunted the Gate of Rashomon at twilight and seized whoever passed by. The missing victims were never se...

### the-quarrel-of-the-monkey-and-the-crab

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-quarrel-of-the-monkey-and-the-crab/manifest.json, app/client/assets/books/generated/the-quarrel-of-the-monkey-and-the-crab/cleaned_book.json, app/client/assets/books/generated/the-quarrel-of-the-monkey-and-the-crab/processed_book.json, app/client/assets/books/generated/the-quarrel-of-the-monkey-and-the-crab/rights_report.json, app/client/assets/books/generated/the-quarrel-of-the-monkey-and-the-crab/processing_notes.md, app/client/assets/books/generated/the-quarrel-of-the-monkey-and-the-crab/sections/chapter-001.json
- Preview inspected: public/book-previews/the-quarrel-of-the-monkey-and-the-crab.preview.json
- Title verdict: Individual title preserved exactly as “The Quarrel of the Monkey and the Crab”; parent collection “Japanese Fairy Tales” is excluded.
- Author/compiler/collector/translator/reteller verdict: Yei Theodora Ozaki is source-backed as compiler; the legacy author array follows the existing Japanese-tale metadata convention without claiming an unknown author.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, names, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE QUARREL OF THE MONKEY AND THE CRAB
- Metadata evidence: Author: Yei Theodora Ozaki; role compiler
- Start evidence: Long, long ago, one bright autumn day in Japan, it happened, that a pink-faced monkey and a yellow crab were playing together along the bank of a river. As they were running about, the crab found a rice-dumpling and t... / Long, long ago, one bright autumn day in Japan, it happened, that a pink-faced monkey and a yellow crab were playing together along the bank of a river. As they were running about, the crab found a rice-dumpling and t...
- End evidence: ...onkey’s head with his pitcher claws. Thus the wicked monkey met his well-merited punishment, and the young crab avenged his father’s death. This is the end of the story of the monkey, the crab, and the persimmon-seed. / ...onkey’s head with his pitcher claws. Thus the wicked monkey met his well-merited punishment, and the young crab avenged his father’s death. This is the end of the story of the monkey, the crab, and the persimmon-seed.
- Preview evidence: Long, long ago, one bright autumn day in Japan, it happened, that a pink-faced monkey and a yellow crab were playing together along the bank of a river. As they were running about, the crab found a rice-dumpling and t...

### the-sagacious-monkey-and-the-boar

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-sagacious-monkey-and-the-boar/manifest.json, app/client/assets/books/generated/the-sagacious-monkey-and-the-boar/cleaned_book.json, app/client/assets/books/generated/the-sagacious-monkey-and-the-boar/processed_book.json, app/client/assets/books/generated/the-sagacious-monkey-and-the-boar/rights_report.json, app/client/assets/books/generated/the-sagacious-monkey-and-the-boar/processing_notes.md, app/client/assets/books/generated/the-sagacious-monkey-and-the-boar/sections/chapter-001.json
- Preview inspected: public/book-previews/the-sagacious-monkey-and-the-boar.preview.json
- Title verdict: Individual title preserved exactly as “The Sagacious Monkey and the Boar”; parent collection “Japanese Fairy Tales” is excluded.
- Author/compiler/collector/translator/reteller verdict: Yei Theodora Ozaki is source-backed as compiler; the legacy author array follows the existing Japanese-tale metadata convention without claiming an unknown author.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, names, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE SAGACIOUS MONKEY AND THE BOAR
- Metadata evidence: Author: Yei Theodora Ozaki; role compiler
- Start evidence: Long, long ago, there lived in the province of Shinshin in Japan, a traveling monkey-man, who earned his living by taking round a monkey and showing off the animal’s tricks. One evening the man came home in a very bad... / Long, long ago, there lived in the province of Shinshin in Japan, a traveling monkey-man, who earned his living by taking round a monkey and showing off the animal’s tricks. One evening the man came home in a very bad...
- End evidence: ...y too.” When the butcher arrived he was sent away with an order for some boar’s meat for the evening dinner, and the monkey was petted and lived the rest of his days in peace, nor did his master ever strike him again. / ...y too.” When the butcher arrived he was sent away with an order for some boar’s meat for the evening dinner, and the monkey was petted and lived the rest of his days in peace, nor did his master ever strike him again.
- Preview evidence: Long, long ago, there lived in the province of Shinshin in Japan, a traveling monkey-man, who earned his living by taking round a monkey and showing off the animal’s tricks. One evening the man came home in a very bad...

### the-shinansha-or-the-south-pointing-carriage

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-shinansha-or-the-south-pointing-carriage/manifest.json, app/client/assets/books/generated/the-shinansha-or-the-south-pointing-carriage/cleaned_book.json, app/client/assets/books/generated/the-shinansha-or-the-south-pointing-carriage/processed_book.json, app/client/assets/books/generated/the-shinansha-or-the-south-pointing-carriage/rights_report.json, app/client/assets/books/generated/the-shinansha-or-the-south-pointing-carriage/processing_notes.md, app/client/assets/books/generated/the-shinansha-or-the-south-pointing-carriage/sections/chapter-001.json
- Preview inspected: public/book-previews/the-shinansha-or-the-south-pointing-carriage.preview.json
- Title verdict: Individual title preserved exactly as “The “Shinansha,” or the South Pointing Carriage”; parent collection “Japanese Fairy Tales” is excluded.
- Author/compiler/collector/translator/reteller verdict: Yei Theodora Ozaki is source-backed as compiler; the legacy author array follows the existing Japanese-tale metadata convention without claiming an unknown author.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, names, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE ?SHINANSHA,? OR THE SOUTH POINTING CARRIAGE
- Metadata evidence: Author: Yei Theodora Ozaki; role compiler
- Start evidence: The compass, with its needle always pointing to the North, is quite a common thing, and no one thinks that it is remarkable now, though when it was first invented it must have been a wonder. Now long ago in China, the... / The compass, with its needle always pointing to the North, is quite a common thing, and no one thinks that it is remarkable now, though when it was first invented it must have been a wonder. Now long ago in China, the...
- End evidence: ...w and an arrow dropped to the earth in the courtyard of the Palace. They were recognized as having belonged to the Emperor Kotei. The courtiers took them up carefully and preserved them as sacred relics in the Palace. / ...w and an arrow dropped to the earth in the courtyard of the Palace. They were recognized as having belonged to the Emperor Kotei. The courtiers took them up carefully and preserved them as sacred relics in the Palace.
- Preview evidence: The compass, with its needle always pointing to the North, is quite a common thing, and no one thinks that it is remarkable now, though when it was first invented it must have been a wonder. Now long ago in China, the...

### the-stones-of-five-colors-and-the-empress-jokwa

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-stones-of-five-colors-and-the-empress-jokwa/manifest.json, app/client/assets/books/generated/the-stones-of-five-colors-and-the-empress-jokwa/cleaned_book.json, app/client/assets/books/generated/the-stones-of-five-colors-and-the-empress-jokwa/processed_book.json, app/client/assets/books/generated/the-stones-of-five-colors-and-the-empress-jokwa/rights_report.json, app/client/assets/books/generated/the-stones-of-five-colors-and-the-empress-jokwa/processing_notes.md, app/client/assets/books/generated/the-stones-of-five-colors-and-the-empress-jokwa/sections/chapter-001.json
- Preview inspected: public/book-previews/the-stones-of-five-colors-and-the-empress-jokwa.preview.json
- Title verdict: Individual title preserved exactly as “The Stones of Five Colors and the Empress Jokwa”; parent collection “Japanese Fairy Tales” is excluded.
- Author/compiler/collector/translator/reteller verdict: Yei Theodora Ozaki is source-backed as compiler; the legacy author array follows the existing Japanese-tale metadata convention without claiming an unknown author.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, names, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE STONES OF FIVE COLORS AND THE EMPRESS JOKWA
- Metadata evidence: Author: Yei Theodora Ozaki; role compiler
- Start evidence: Long, long ago there lived a great Chinese Empress who succeeded her brother the Emperor Fuki. It was the age of giants, and the Empress Jokwa, for that was her name, was twenty-five feet high, nearly as tall as her b... / Long, long ago there lived a great Chinese Empress who succeeded her brother the Emperor Fuki. It was the age of giants, and the Empress Jokwa, for that was her name, was twenty-five feet high, nearly as tall as her b...
- End evidence: ...ination of the heavenly roads, the Sun and Moon again gave light to the earth. All the people rejoiced greatly, and peace and prosperity were secured in China for a long time under the reign of the wise Empress Jokwa. / ...ination of the heavenly roads, the Sun and Moon again gave light to the earth. All the people rejoiced greatly, and peace and prosperity were secured in China for a long time under the reign of the wise Empress Jokwa.
- Preview evidence: Long, long ago there lived a great Chinese Empress who succeeded her brother the Emperor Fuki. It was the age of giants, and the Empress Jokwa, for that was her name, was twenty-five feet high, nearly as tall as her b...

### the-story-of-prince-yamato-take

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-story-of-prince-yamato-take/manifest.json, app/client/assets/books/generated/the-story-of-prince-yamato-take/cleaned_book.json, app/client/assets/books/generated/the-story-of-prince-yamato-take/processed_book.json, app/client/assets/books/generated/the-story-of-prince-yamato-take/rights_report.json, app/client/assets/books/generated/the-story-of-prince-yamato-take/processing_notes.md, app/client/assets/books/generated/the-story-of-prince-yamato-take/sections/chapter-001.json
- Preview inspected: public/book-previews/the-story-of-prince-yamato-take.preview.json
- Title verdict: Individual title preserved exactly as “The Story of Prince Yamato Take”; parent collection “Japanese Fairy Tales” is excluded.
- Author/compiler/collector/translator/reteller verdict: Yei Theodora Ozaki is source-backed as compiler; the legacy author array follows the existing Japanese-tale metadata convention without claiming an unknown author.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, names, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE STORY OF PRINCE YAMATO TAKE
- Metadata evidence: Author: Yei Theodora Ozaki; role compiler
- Start evidence: The insignia of the great Japanese Empire is composed of three treasures which have been considered sacred, and guarded with jealous care from time immemorial. These are the Yatano-no-Kagami or the Mirror of Yata, the... / The insignia of the great Japanese Empire is composed of three treasures which have been considered sacred, and guarded with jealous care from time immemorial. These are the Yatano-no-Kagami or the Mirror of Yata, the...
- End evidence: ...most magnificent robes she returned thanks to their ancestress the Sun Goddess Amaterasu, to whose protection they both ascribed the Prince’s wonderful preservation. Here ends the story of Prince Yamato Take of Japan. / ...most magnificent robes she returned thanks to their ancestress the Sun Goddess Amaterasu, to whose protection they both ascribed the Prince’s wonderful preservation. Here ends the story of Prince Yamato Take of Japan.
- Preview evidence: The insignia of the great Japanese Empire is composed of three treasures which have been considered sacred, and guarded with jealous care from time immemorial. These are the Yatano-no-Kagami or the Mirror of Yata, the...

### the-story-of-princess-hase

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-story-of-princess-hase/manifest.json, app/client/assets/books/generated/the-story-of-princess-hase/cleaned_book.json, app/client/assets/books/generated/the-story-of-princess-hase/processed_book.json, app/client/assets/books/generated/the-story-of-princess-hase/rights_report.json, app/client/assets/books/generated/the-story-of-princess-hase/processing_notes.md, app/client/assets/books/generated/the-story-of-princess-hase/sections/chapter-001.json
- Preview inspected: public/book-previews/the-story-of-princess-hase.preview.json
- Title verdict: Individual title preserved exactly as “The Story of Princess Hase”; parent collection “Japanese Fairy Tales” is excluded.
- Author/compiler/collector/translator/reteller verdict: Yei Theodora Ozaki is source-backed as compiler; the legacy author array follows the existing Japanese-tale metadata convention without claiming an unknown author.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, names, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE STORY OF PRINCESS HASE
- Metadata evidence: Author: Yei Theodora Ozaki; role compiler
- Start evidence: Many, many years ago there lived in Nara, the ancient Capital of Japan, a wise State minister, by name Prince Toyonari Fujiwara. His wife was a noble, good, and beautiful woman called Princess Murasaki (Violet). They ... / Many, many years ago there lived in Nara, the ancient Capital of Japan, a wise State minister, by name Prince Toyonari Fujiwara. His wife was a noble, good, and beautiful woman called Princess Murasaki (Violet). They ...
- End evidence: ...es of Kioto. It is a beautiful piece of tapestry, with the figure of Buddha embroidered in the silky threads drawn from the stem of the lotus. This is said to have been the work of the hands of the good Princess Hase. / ...es of Kioto. It is a beautiful piece of tapestry, with the figure of Buddha embroidered in the silky threads drawn from the stem of the lotus. This is said to have been the work of the hands of the good Princess Hase.
- Preview evidence: Many, many years ago there lived in Nara, the ancient Capital of Japan, a wise State minister, by name Prince Toyonari Fujiwara. His wife was a noble, good, and beautiful woman called Princess Murasaki (Violet). They ...

### the-white-hare-and-the-crocodiles

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-white-hare-and-the-crocodiles/manifest.json, app/client/assets/books/generated/the-white-hare-and-the-crocodiles/cleaned_book.json, app/client/assets/books/generated/the-white-hare-and-the-crocodiles/processed_book.json, app/client/assets/books/generated/the-white-hare-and-the-crocodiles/rights_report.json, app/client/assets/books/generated/the-white-hare-and-the-crocodiles/processing_notes.md, app/client/assets/books/generated/the-white-hare-and-the-crocodiles/sections/chapter-001.json
- Preview inspected: public/book-previews/the-white-hare-and-the-crocodiles.preview.json
- Title verdict: Individual title preserved exactly as “The White Hare and the Crocodiles”; parent collection “Japanese Fairy Tales” is excluded.
- Author/compiler/collector/translator/reteller verdict: Yei Theodora Ozaki is source-backed as compiler; the legacy author array follows the existing Japanese-tale metadata convention without claiming an unknown author.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, names, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE WHITE HARE AND THE CROCODILES
- Metadata evidence: Author: Yei Theodora Ozaki; role compiler
- Start evidence: Long, long ago, when all the animals could talk, there lived in the province of Inaba in Japan, a little white hare. His home was on the island of Oki, and just across the sea was the mainland of Inaba. Now the hare w... / Long, long ago, when all the animals could talk, there lived in the province of Inaba in Japan, a little white hare. His home was on the island of Oki, and just across the sea was the mainland of Inaba. Now the hare w...
- End evidence: ... is the end of the story. Okuni-nushi-no-Mikoto is worshiped by the people in some parts of Japan, as a god, and the hare has become famous as “The White Hare of Inaba.” But what became of the crocodiles nobody knows. / ... is the end of the story. Okuni-nushi-no-Mikoto is worshiped by the people in some parts of Japan, as a god, and the hare has become famous as “The White Hare of Inaba.” But what became of the crocodiles nobody knows.
- Preview evidence: Long, long ago, when all the animals could talk, there lived in the province of Inaba in Japan, a little white hare. His home was on the island of Oki, and just across the sea was the mainland of Inaba. Now the hare w...

### the-golden-goose

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-golden-goose/manifest.json, app/client/assets/books/generated/the-golden-goose/cleaned_book.json, app/client/assets/books/generated/the-golden-goose/processed_book.json, app/client/assets/books/generated/the-golden-goose/rights_report.json, app/client/assets/books/generated/the-golden-goose/processing_notes.md, app/client/assets/books/generated/the-golden-goose/sections/chapter-001.json
- Preview inspected: public/book-previews/the-golden-goose.preview.json
- Title verdict: Individual title preserved exactly as “The Golden Goose”; parent collection “Grimms' Fairy Tales” is excluded.
- Author/compiler/collector/translator/reteller verdict: Jacob Grimm and Wilhelm Grimm match the raw Author/byline evidence and the existing semicolon-joined Grimm convention.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, names, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE GOLDEN GOOSE
- Metadata evidence: Author: Jacob Grimm; Wilhelm Grimm; role authors
- Start evidence: There was a man who had three sons, the youngest of whom was called Dummling,[*] and was despised, mocked, and sneered at on every occasion. [*] Simpleton It happened that the eldest wanted to go into the forest to he... / There was a man who had three sons, the youngest of whom was called Dummling,[*] and was despised, mocked, and sneered at on every occasion. [*] Simpleton It happened that the eldest wanted to go into the forest to he...
- End evidence: ...n the king saw that, he could no longer prevent him from having his daughter. The wedding was celebrated, and after the king’s death, Dummling inherited his kingdom and lived for a long time contentedly with his wife. / ...n the king saw that, he could no longer prevent him from having his daughter. The wedding was celebrated, and after the king’s death, Dummling inherited his kingdom and lived for a long time contentedly with his wife.
- Preview evidence: There was a man who had three sons, the youngest of whom was called Dummling,[*] and was despised, mocked, and sneered at on every occasion. [*] Simpleton It happened that the eldest wanted to go into the forest to he...

### the-turnip

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-turnip/manifest.json, app/client/assets/books/generated/the-turnip/cleaned_book.json, app/client/assets/books/generated/the-turnip/processed_book.json, app/client/assets/books/generated/the-turnip/rights_report.json, app/client/assets/books/generated/the-turnip/processing_notes.md, app/client/assets/books/generated/the-turnip/sections/chapter-001.json
- Preview inspected: public/book-previews/the-turnip.preview.json
- Title verdict: Individual title preserved exactly as “The Turnip”; parent collection “Grimms' Fairy Tales” is excluded.
- Author/compiler/collector/translator/reteller verdict: Jacob Grimm and Wilhelm Grimm match the raw Author/byline evidence and the existing semicolon-joined Grimm convention.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, names, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE TURNIP
- Metadata evidence: Author: Jacob Grimm; Wilhelm Grimm; role authors
- Start evidence: There were two brothers who were both soldiers; the one was rich and the other poor. The poor man thought he would try to better himself; so, pulling off his red coat, he became a gardener, and dug his ground well, an... / There were two brothers who were both soldiers; the one was rich and the other poor. The poor man thought he would try to better himself; so, pulling off his red coat, he became a gardener, and dug his ground well, an...
- End evidence: ...om comes unto thee? Rest there in peace, till thou art a wiser man than thou wert.’ So saying, he trotted off on the student’s nag, and left the poor fellow to gather wisdom till somebody should come and let him down. / ...om comes unto thee? Rest there in peace, till thou art a wiser man than thou wert.’ So saying, he trotted off on the student’s nag, and left the poor fellow to gather wisdom till somebody should come and let him down.
- Preview evidence: There were two brothers who were both soldiers; the one was rich and the other poor. The poor man thought he would try to better himself; so, pulling off his red coat, he became a gardener, and dug his ground well, an...

## Protected Scope

- Unresolved-source generated books untouched: a-princess-of-mars, doctor-dolittle, heidi, jabberwocky, nights-with-uncle-remus, peter-pan, tarzan-of-the-apes, the-great-gatsby, the-picture-of-dorian-gray, the-thirty-nine-steps, wood-folk-at-school
- Duplicate/boundary skips not reintroduced: the-wind-in-the-willows, the-two-magics-the-turn-of-the-screw-covering-end, the-works-of-edgar-allan-poe
- Raw sources modified: no
- Cloudflare exports modified: no
- Unrelated generated/preview changes: none

## Validation

- typecheck: pass
- pilotWrite16: pass: 20 first-time processed, 0 skipped, 11 unresolved-source books untouched
- batch12ProseRestore: pass: 20/20 exact raw/generated matches
- startupPreviewAudit: pass: 335 valid, 0 preview updates
- titleStartDefaultAudit: pass: 335 audited, 12 known unrelated corrections produced and restored, 0 accepted books revoked
- metadataSegmentationAudit: pass: 335 audited, 0 author corrections, 1 documented unknown-author case, 0 accepted books revoked
- manualUiDefectFollowup: pass: 8 checked, 8 acceptable, 0 corrected or revoked
- targetedVerifier: pass: 20 pass, 0 warn accepted, 0 fail
- playwright: pass: 36/36 desktop-chromium assertions; no wrapper timeout
- gitDiffCheck: pass
- Playwright wrapper timeout after 36/36 JSON result: no
- Audit side-effect handling: Required audits rewrote reports and unrelated prior-batch generated/preview assets; all audit churn was restored. Only the verifier, package command, and batch-16 verification reports remain.
