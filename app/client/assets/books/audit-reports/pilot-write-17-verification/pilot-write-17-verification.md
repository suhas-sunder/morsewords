# Pilot write batch 17 verification

Generated: 2026-06-20T07:31:36.464Z

## Summary

- Verified: 20
- Pass: 20
- Warn accepted: 0
- Fail: 0
- Accepted for main: 20
- Correction needed before main: 0
- Raw/generated exact: 20/20

## Shared Script Scope

- Classification: harmless shared implementation intentionally used by write batch 17
- Resolution: Retain the write-12 change. Batches 13-17 use five-line wrappers that set MORSEWORDS_PILOT_WRITE_BATCH and import the established write-12 runner; this diff adds only batch-17 typing, selection/dispatch, and source-backed creator-role evidence fields used by write 17.
- Unrelated changes found: no

## Metadata Unknown-Author Review

- Result: pass
- Remaining case: the-arabian-nights
- Batch 17 introduced it: no
- Justification: Raw source has editor metadata but no source-identified author; this needs manual metadata policy before replacing author with editor.

## Batch-12 Prose Restoration

- Result: pass
- Compared: 20
- Remaining raw/generated mismatches: 0
- Remaining prose omissions: 0
- Remaining missing opening-quote defects: 0

## Special Focus

- Grimm group: 7/7 use individual tale titles, source-backed Grimm metadata, true prose starts/endings, and no parent collection or TOC playback.
- Andersen/literary group: 4/4 preserve H. C. Andersen as author and J. H. Stickney as editor evidence. Sunshine Stories is one source-based framed tale with no meaningful internal headings to split.
- Mixed children's/fairy-tale group: 9/9 preserve exact title spelling/casing, Andrew Lang's editor role evidence, true first/last readable lines, and wrapped prose character-for-character.

## Books

### the-twelve-dancing-princesses

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-twelve-dancing-princesses/manifest.json, app/client/assets/books/generated/the-twelve-dancing-princesses/cleaned_book.json, app/client/assets/books/generated/the-twelve-dancing-princesses/processed_book.json, app/client/assets/books/generated/the-twelve-dancing-princesses/rights_report.json, app/client/assets/books/generated/the-twelve-dancing-princesses/processing_notes.md, app/client/assets/books/generated/the-twelve-dancing-princesses/sections/chapter-001.json
- Preview inspected: public/book-previews/the-twelve-dancing-princesses.preview.json
- Title verdict: Individual title preserved exactly as "The Twelve Dancing Princesses"; parent collection "Grimms' Fairy Tales" is excluded from the title and playback.
- Author/compiler/collector/translator/reteller verdict: Jacob Grimm and Wilhelm Grimm match the raw Author/byline evidence and the existing semicolon-joined Grimm convention.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, wrapped lines, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected/default source order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE TWELVE DANCING PRINCESSES
- Metadata evidence: Author: Jacob Grimm; Wilhelm Grimm; By Jacob Grimm and Wilhelm Grimm; authors: Jacob Grimm and Wilhelm Grimm (raw source labels them as authors)
- Start evidence: There was a king who had twelve beautiful daughters. They slept in twelve beds all in one room; and when they went to bed, the doors were shut and locked up; but every morning their shoes were found to be quite worn t... / There was a king who had twelve beautiful daughters. They slept in twelve beds all in one room; and when they went to bed, the doors were shut and locked up; but every morning their shoes were found to be quite worn t...
- End evidence: ... asked the soldier which of them he would choose for his wife; and he answered, ‘I am not very young, so I will have the eldest.’--And they were married that very day, and the soldier was chosen to be the king’s heir. / ... asked the soldier which of them he would choose for his wife; and he answered, ‘I am not very young, so I will have the eldest.’--And they were married that very day, and the soldier was chosen to be the king’s heir.
- Preview evidence: There was a king who had twelve beautiful daughters. They slept in twelve beds all in one room; and when they went to bed, the doors were shut and locked up; but every morning their shoes were found to be quite worn t...

### the-twelve-huntsmen

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-twelve-huntsmen/manifest.json, app/client/assets/books/generated/the-twelve-huntsmen/cleaned_book.json, app/client/assets/books/generated/the-twelve-huntsmen/processed_book.json, app/client/assets/books/generated/the-twelve-huntsmen/rights_report.json, app/client/assets/books/generated/the-twelve-huntsmen/processing_notes.md, app/client/assets/books/generated/the-twelve-huntsmen/sections/chapter-001.json
- Preview inspected: public/book-previews/the-twelve-huntsmen.preview.json
- Title verdict: Individual title preserved exactly as "The Twelve Huntsmen"; parent collection "Grimms' Fairy Tales" is excluded from the title and playback.
- Author/compiler/collector/translator/reteller verdict: Jacob Grimm and Wilhelm Grimm match the raw Author/byline evidence and the existing semicolon-joined Grimm convention.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, wrapped lines, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected/default source order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE TWELVE HUNTSMEN
- Metadata evidence: Author: Jacob Grimm; Wilhelm Grimm; By Jacob Grimm and Wilhelm Grimm; authors: Jacob Grimm and Wilhelm Grimm (raw source labels them as authors)
- Start evidence: There was once a king’s son who had a bride whom he loved very much. And when he was sitting beside her and very happy, news came that his father lay sick unto death, and desired to see him once again before his end. ... / There was once a king’s son who had a bride whom he loved very much. And when he was sitting beside her and very happy, news came that his father lay sick unto death, and desired to see him once again before his end. ...
- End evidence: ...or he had a wife already, and someone who had just found an old key did not require a new one. Thereupon the wedding was celebrated, and the lion was again taken into favour, because, after all, he had told the truth. / ...or he had a wife already, and someone who had just found an old key did not require a new one. Thereupon the wedding was celebrated, and the lion was again taken into favour, because, after all, he had told the truth.
- Preview evidence: There was once a king’s son who had a bride whom he loved very much. And when he was sitting beside her and very happy, news came that his father lay sick unto death, and desired to see him once again before his end. ...

### the-water-of-life

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-water-of-life/manifest.json, app/client/assets/books/generated/the-water-of-life/cleaned_book.json, app/client/assets/books/generated/the-water-of-life/processed_book.json, app/client/assets/books/generated/the-water-of-life/rights_report.json, app/client/assets/books/generated/the-water-of-life/processing_notes.md, app/client/assets/books/generated/the-water-of-life/sections/chapter-001.json
- Preview inspected: public/book-previews/the-water-of-life.preview.json
- Title verdict: Individual title preserved exactly as "The Water of Life"; parent collection "Grimms' Fairy Tales" is excluded from the title and playback.
- Author/compiler/collector/translator/reteller verdict: Jacob Grimm and Wilhelm Grimm match the raw Author/byline evidence and the existing semicolon-joined Grimm convention.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, wrapped lines, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected/default source order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE WATER OF LIFE
- Metadata evidence: Author: Jacob Grimm; Wilhelm Grimm; By Jacob Grimm and Wilhelm Grimm; authors: Jacob Grimm and Wilhelm Grimm (raw source labels them as authors)
- Start evidence: Long before you or I were born, there reigned, in a country a great way off, a king who had three sons. This king once fell very ill--so ill that nobody thought he could live. His sons were very much grieved at their ... / Long before you or I were born, there reigned, in a country a great way off, a king who had three sons. This king once fell very ill--so ill that nobody thought he could live. His sons were very much grieved at their ...
- End evidence: ...e friendly dwarf, with the sugarloaf hat, and a new scarlet cloak. And the wedding was held, and the merry bells run. And all the good people they danced and they sung, And feasted and frolick’d I can’t tell how long. / ...e friendly dwarf, with the sugarloaf hat, and a new scarlet cloak. And the wedding was held, and the merry bells run. And all the good people they danced and they sung, And feasted and frolick’d I can’t tell how long.
- Preview evidence: Long before you or I were born, there reigned, in a country a great way off, a king who had three sons. This king once fell very ill--so ill that nobody thought he could live. His sons were very much grieved at their ...

### the-white-snake

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-white-snake/manifest.json, app/client/assets/books/generated/the-white-snake/cleaned_book.json, app/client/assets/books/generated/the-white-snake/processed_book.json, app/client/assets/books/generated/the-white-snake/rights_report.json, app/client/assets/books/generated/the-white-snake/processing_notes.md, app/client/assets/books/generated/the-white-snake/sections/chapter-001.json
- Preview inspected: public/book-previews/the-white-snake.preview.json
- Title verdict: Individual title preserved exactly as "The White Snake"; parent collection "Grimms' Fairy Tales" is excluded from the title and playback.
- Author/compiler/collector/translator/reteller verdict: Jacob Grimm and Wilhelm Grimm match the raw Author/byline evidence and the existing semicolon-joined Grimm convention.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, wrapped lines, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected/default source order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE WHITE SNAKE
- Metadata evidence: Author: Jacob Grimm; Wilhelm Grimm; By Jacob Grimm and Wilhelm Grimm; authors: Jacob Grimm and Wilhelm Grimm (raw source labels them as authors)
- Start evidence: A long time ago there lived a king who was famed for his wisdom through all the land. Nothing was hidden from him, and it seemed as if news of the most secret things was brought to him through the air. But he had a st... / A long time ago there lived a king who was famed for his wisdom through all the land. Nothing was hidden from him, and it seemed as if news of the most secret things was brought to him through the air. But he had a st...
- End evidence: ...utiful daughter, who had now no more excuses left to make. They cut the Apple of Life in two and ate it together; and then her heart became full of love for him, and they lived in undisturbed happiness to a great age. / ...utiful daughter, who had now no more excuses left to make. They cut the Apple of Life in two and ate it together; and then her heart became full of love for him, and they lived in undisturbed happiness to a great age.
- Preview evidence: A long time ago there lived a king who was famed for his wisdom through all the land. Nothing was hidden from him, and it seemed as if news of the most secret things was brought to him through the air. But he had a st...

### the-willow-wren-and-the-bear

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-willow-wren-and-the-bear/manifest.json, app/client/assets/books/generated/the-willow-wren-and-the-bear/cleaned_book.json, app/client/assets/books/generated/the-willow-wren-and-the-bear/processed_book.json, app/client/assets/books/generated/the-willow-wren-and-the-bear/rights_report.json, app/client/assets/books/generated/the-willow-wren-and-the-bear/processing_notes.md, app/client/assets/books/generated/the-willow-wren-and-the-bear/sections/chapter-001.json
- Preview inspected: public/book-previews/the-willow-wren-and-the-bear.preview.json
- Title verdict: Individual title preserved exactly as "The Willow-Wren and the Bear"; parent collection "Grimms' Fairy Tales" is excluded from the title and playback.
- Author/compiler/collector/translator/reteller verdict: Jacob Grimm and Wilhelm Grimm match the raw Author/byline evidence and the existing semicolon-joined Grimm convention.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, wrapped lines, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected/default source order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE WILLOW-WREN AND THE BEAR
- Metadata evidence: Author: Jacob Grimm; Wilhelm Grimm; By Jacob Grimm and Wilhelm Grimm; authors: Jacob Grimm and Wilhelm Grimm (raw source labels them as authors)
- Start evidence: Once in summer-time the bear and the wolf were walking in the forest, and the bear heard a bird singing so beautifully that he said: ‘Brother wolf, what bird is it that sings so well?’ ‘That is the King of birds,’ sai... / Once in summer-time the bear and the wolf were walking in the forest, and the bear heard a bird singing so beautifully that he said: ‘Brother wolf, what bird is it that sings so well?’ ‘That is the King of birds,’ sai...
- End evidence: ...broken.’ So the bear crept thither in the greatest fear, and begged their pardon. And now at last the young wrens were satisfied, and sat down together and ate and drank, and made merry till quite late into the night. / ...broken.’ So the bear crept thither in the greatest fear, and begged their pardon. And now at last the young wrens were satisfied, and sat down together and ate and drank, and made merry till quite late into the night.
- Preview evidence: Once in summer-time the bear and the wolf were walking in the forest, and the bear heard a bird singing so beautifully that he said: ‘Brother wolf, what bird is it that sings so well?’ ‘That is the King of birds,’ sai...

### the-wolf-and-the-seven-little-kids

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-wolf-and-the-seven-little-kids/manifest.json, app/client/assets/books/generated/the-wolf-and-the-seven-little-kids/cleaned_book.json, app/client/assets/books/generated/the-wolf-and-the-seven-little-kids/processed_book.json, app/client/assets/books/generated/the-wolf-and-the-seven-little-kids/rights_report.json, app/client/assets/books/generated/the-wolf-and-the-seven-little-kids/processing_notes.md, app/client/assets/books/generated/the-wolf-and-the-seven-little-kids/sections/chapter-001.json
- Preview inspected: public/book-previews/the-wolf-and-the-seven-little-kids.preview.json
- Title verdict: Individual title preserved exactly as "The Wolf and the Seven Little Kids"; parent collection "Grimms' Fairy Tales" is excluded from the title and playback.
- Author/compiler/collector/translator/reteller verdict: Jacob Grimm and Wilhelm Grimm match the raw Author/byline evidence and the existing semicolon-joined Grimm convention.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, wrapped lines, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected/default source order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE WOLF AND THE SEVEN LITTLE KIDS
- Metadata evidence: Author: Jacob Grimm; Wilhelm Grimm; By Jacob Grimm and Wilhelm Grimm; authors: Jacob Grimm and Wilhelm Grimm (raw source labels them as authors)
- Start evidence: There was once upon a time an old goat who had seven little kids, and loved them with all the love of a mother for her children. One day she wanted to go into the forest and fetch some food. So she called all seven to... / There was once upon a time an old goat who had seven little kids, and loved them with all the love of a mother for her children. One day she wanted to go into the forest and fetch some food. So she called all seven to...
- End evidence: ...made him fall in, and he drowned miserably. When the seven kids saw that, they came running to the spot and cried aloud: ‘The wolf is dead! The wolf is dead!’ and danced for joy round about the well with their mother. / ...made him fall in, and he drowned miserably. When the seven kids saw that, they came running to the spot and cried aloud: ‘The wolf is dead! The wolf is dead!’ and danced for joy round about the well with their mother.
- Preview evidence: There was once upon a time an old goat who had seven little kids, and loved them with all the love of a mother for her children. One day she wanted to go into the forest and fetch some food. So she called all seven to...

### tom-thumb

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/tom-thumb/manifest.json, app/client/assets/books/generated/tom-thumb/cleaned_book.json, app/client/assets/books/generated/tom-thumb/processed_book.json, app/client/assets/books/generated/tom-thumb/rights_report.json, app/client/assets/books/generated/tom-thumb/processing_notes.md, app/client/assets/books/generated/tom-thumb/sections/chapter-001.json
- Preview inspected: public/book-previews/tom-thumb.preview.json
- Title verdict: Individual title preserved exactly as "Tom Thumb"; parent collection "Grimms' Fairy Tales" is excluded from the title and playback.
- Author/compiler/collector/translator/reteller verdict: Jacob Grimm and Wilhelm Grimm match the raw Author/byline evidence and the existing semicolon-joined Grimm convention.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, wrapped lines, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected/default source order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: TOM THUMB
- Metadata evidence: Author: Jacob Grimm; Wilhelm Grimm; By Jacob Grimm and Wilhelm Grimm; authors: Jacob Grimm and Wilhelm Grimm (raw source labels them as authors)
- Start evidence: A poor woodman sat in his cottage one night, smoking his pipe by the fireside, while his wife sat by his side spinning. ‘How lonely it is, wife,’ said he, as he puffed out a long curl of smoke, ‘for you and me to sit ... / A poor woodman sat in his cottage one night, smoking his pipe by the fireside, while his wife sat by his side spinning. ‘How lonely it is, wife,’ said he, as he puffed out a long curl of smoke, ‘for you and me to sit ...
- End evidence: ...d mother, in peace; for though he had been so great a traveller, and had done and seen so many fine things, and was fond enough of telling the whole story, he always agreed that, after all, there’s no place like HOME! / ...d mother, in peace; for though he had been so great a traveller, and had done and seen so many fine things, and was fond enough of telling the whole story, he always agreed that, after all, there’s no place like HOME!
- Preview evidence: A poor woodman sat in his cottage one night, smoking his pipe by the fireside, while his wife sat by his side spinning. ‘How lonely it is, wife,’ said he, as he puffed out a long curl of smoke, ‘for you and me to sit ...

### elder-tree-mother

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/elder-tree-mother/manifest.json, app/client/assets/books/generated/elder-tree-mother/cleaned_book.json, app/client/assets/books/generated/elder-tree-mother/processed_book.json, app/client/assets/books/generated/elder-tree-mother/rights_report.json, app/client/assets/books/generated/elder-tree-mother/processing_notes.md, app/client/assets/books/generated/elder-tree-mother/sections/chapter-001.json
- Preview inspected: public/book-previews/elder-tree-mother.preview.json
- Title verdict: Individual title preserved exactly as "Elder-Tree Mother"; parent collection "Hans Andersen's Fairy Tales. First Series" is excluded from the title and playback.
- Author/compiler/collector/translator/reteller verdict: H. C. Andersen remains the source-backed author; J. H. Stickney is retained as editor evidence and does not replace Andersen in the author field.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, wrapped lines, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected/default source order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: ELDER-TREE MOTHER
- Metadata evidence: Author: H. C. Andersen; Editor: J. H. Stickney; author: H. C. Andersen; editor: J. H. Stickney
- Start evidence: THERE was once a little boy who had taken cold by going out and getting his feet wet. No one could think how he had managed to do so, for the weather was quite dry. His mother undressed him and put him to bed, and the... / THERE was once a little boy who had taken cold by going out and getting his feet wet. No one could think how he had managed to do so, for the weather was quite dry. His mother undressed him and put him to bed, and the...
- End evidence: ...hile I have been disputing with the old man as to whether it was a real story or a fairy legend." "And where is the Elder-tree Mother?" asked the boy. "She is in the teapot," said the mother, "and there she may stay." / ...hile I have been disputing with the old man as to whether it was a real story or a fairy legend." "And where is the Elder-tree Mother?" asked the boy. "She is in the teapot," said the mother, "and there she may stay."
- Preview evidence: THERE was once a little boy who had taken cold by going out and getting his feet wet. No one could think how he had managed to do so, for the weather was quite dry. His mother undressed him and put him to bed, and the...

### little-thumbelina

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/little-thumbelina/manifest.json, app/client/assets/books/generated/little-thumbelina/cleaned_book.json, app/client/assets/books/generated/little-thumbelina/processed_book.json, app/client/assets/books/generated/little-thumbelina/rights_report.json, app/client/assets/books/generated/little-thumbelina/processing_notes.md, app/client/assets/books/generated/little-thumbelina/sections/chapter-001.json
- Preview inspected: public/book-previews/little-thumbelina.preview.json
- Title verdict: Individual title preserved exactly as "Little Thumbelina"; parent collection "Hans Andersen's Fairy Tales. First Series" is excluded from the title and playback.
- Author/compiler/collector/translator/reteller verdict: H. C. Andersen remains the source-backed author; J. H. Stickney is retained as editor evidence and does not replace Andersen in the author field.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, wrapped lines, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected/default source order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: LITTLE THUMBELINA
- Metadata evidence: Author: H. C. Andersen; Editor: J. H. Stickney; author: H. C. Andersen; editor: J. H. Stickney
- Start evidence: THERE was once a woman who wished very much to have a little child. She went to a fairy and said: "I should so very much like to have a little child. Can you tell me where I can find one?" "Oh, that can be easily mana... / THERE was once a woman who wished very much to have a little child. She went to a fairy and said: "I should so very much like to have a little child. Can you tell me where I can find one?" "Oh, that can be easily mana...
- End evidence: ...s he left the warm countries, to fly back into Denmark. There he had a nest over the window of a house in which dwelt the writer of fairy tales. The swallow sang "Tweet, tweet," and from his song came the whole story. / ...s he left the warm countries, to fly back into Denmark. There he had a nest over the window of a house in which dwelt the writer of fairy tales. The swallow sang "Tweet, tweet," and from his song came the whole story.
- Preview evidence: THERE was once a woman who wished very much to have a little child. She went to a fairy and said: "I should so very much like to have a little child. Can you tell me where I can find one?" "Oh, that can be easily mana...

### sunshine-stories

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/sunshine-stories/manifest.json, app/client/assets/books/generated/sunshine-stories/cleaned_book.json, app/client/assets/books/generated/sunshine-stories/processed_book.json, app/client/assets/books/generated/sunshine-stories/rights_report.json, app/client/assets/books/generated/sunshine-stories/processing_notes.md, app/client/assets/books/generated/sunshine-stories/sections/chapter-001.json
- Preview inspected: public/book-previews/sunshine-stories.preview.json
- Title verdict: Individual title preserved exactly as "Sunshine Stories"; parent collection "Hans Andersen's Fairy Tales. First Series" is excluded from the title and playback.
- Author/compiler/collector/translator/reteller verdict: H. C. Andersen remains the source-backed author; J. H. Stickney is retained as editor evidence and does not replace Andersen in the author field.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: The framed tale has no meaningful internal source headings; one contiguous source-based section preserves its structure without arbitrary flattening.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, wrapped lines, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected/default source order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: SUNSHINE STORIES
- Metadata evidence: Author: H. C. Andersen; Editor: J. H. Stickney; author: H. C. Andersen; editor: J. H. Stickney
- Start evidence: "I AM going to tell a story," said the Wind. "I beg your pardon," said the Rain, "but now it is my turn. Have you not been howling round the corner this long time, as hard as ever you could?" "Is this the gratitude yo... / "I AM going to tell a story," said the Wind. "I beg your pardon," said the Rain, "but now it is my turn. Have you not been howling round the corner this long time, as hard as ever you could?" "Is this the gratitude yo...
- End evidence: ... had better stop now," said the Wind. "I am dreadfully bored. The Sunshine has talked long enough." "I think so, too," said the Rain. And what do we others who have heard the story say? We say, "Now the story's done." / ... had better stop now," said the Wind. "I am dreadfully bored. The Sunshine has talked long enough." "I think so, too," said the Rain. And what do we others who have heard the story say? We say, "Now the story's done."
- Preview evidence: "I AM going to tell a story," said the Wind. "I beg your pardon," said the Rain, "but now it is my turn. Have you not been howling round the corner this long time, as hard as ever you could?" "Is this the gratitude yo...

### the-leaping-match

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-leaping-match/manifest.json, app/client/assets/books/generated/the-leaping-match/cleaned_book.json, app/client/assets/books/generated/the-leaping-match/processed_book.json, app/client/assets/books/generated/the-leaping-match/rights_report.json, app/client/assets/books/generated/the-leaping-match/processing_notes.md, app/client/assets/books/generated/the-leaping-match/sections/chapter-001.json
- Preview inspected: public/book-previews/the-leaping-match.preview.json
- Title verdict: Individual title preserved exactly as "The Leaping Match"; parent collection "Hans Andersen's Fairy Tales. First Series" is excluded from the title and playback.
- Author/compiler/collector/translator/reteller verdict: H. C. Andersen remains the source-backed author; J. H. Stickney is retained as editor evidence and does not replace Andersen in the author field.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, wrapped lines, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected/default source order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE LEAPING MATCH
- Metadata evidence: Author: H. C. Andersen; Editor: J. H. Stickney; author: H. C. Andersen; editor: J. H. Stickney
- Start evidence: THE Flea, the Grasshopper, and the Frog once wanted to see which of them could jump the highest. They made a festival, and invited the whole world and every one else besides who liked to come and see the grand sight. ... / THE Flea, the Grasshopper, and the Frog once wanted to see which of them could jump the highest. They made a festival, and invited the whole world and every one else besides who liked to come and see the grand sight. ...
- End evidence: ...nd then he began to sing in his own peculiar way--and it is from his song that we have taken this little piece of history, which may very possibly be all untrue, although it does stand printed here in black and white. / ...nd then he began to sing in his own peculiar way--and it is from his song that we have taken this little piece of history, which may very possibly be all untrue, although it does stand printed here in black and white.
- Preview evidence: THE Flea, the Grasshopper, and the Frog once wanted to see which of them could jump the highest. They made a festival, and invited the whole world and every one else besides who liked to come and see the grand sight. ...

### a-fish-story

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/a-fish-story/manifest.json, app/client/assets/books/generated/a-fish-story/cleaned_book.json, app/client/assets/books/generated/a-fish-story/processed_book.json, app/client/assets/books/generated/a-fish-story/rights_report.json, app/client/assets/books/generated/a-fish-story/processing_notes.md, app/client/assets/books/generated/a-fish-story/sections/chapter-001.json
- Preview inspected: public/book-previews/a-fish-story.preview.json
- Title verdict: Individual title preserved exactly as "A Fish Story"; parent collection "The Lilac Fairy Book" is excluded from the title and playback.
- Author/compiler/collector/translator/reteller verdict: Andrew Lang is source-backed as editor; the legacy author array follows the existing tale metadata convention while the write report records the editor role explicitly.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, wrapped lines, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected/default source order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: A Fish Story
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Start evidence: Perhaps you think that fishes were always fishes, and never lived anywhere except in the water, but if you went to Australia and talked to the black people in the sandy desert in the centre of the country, you would l... / Perhaps you think that fishes were always fishes, and never lived anywhere except in the water, but if you went to Australia and talked to the black people in the sandy desert in the centre of the country, you would l...
- End evidence: ...pt burning for ever. So now you know why, if you dive deep down below the cold surface of the water on a frosty day, you will find it comfortable and pleasant underneath, and be quite sorry that you cannot stay there. / ...pt burning for ever. So now you know why, if you dive deep down below the cold surface of the water on a frosty day, you will find it comfortable and pleasant underneath, and be quite sorry that you cannot stay there.
- Preview evidence: Perhaps you think that fishes were always fishes, and never lived anywhere except in the water, but if you went to Australia and talked to the black people in the sandy desert in the centre of the country, you would l...

### a-french-puck

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/a-french-puck/manifest.json, app/client/assets/books/generated/a-french-puck/cleaned_book.json, app/client/assets/books/generated/a-french-puck/processed_book.json, app/client/assets/books/generated/a-french-puck/rights_report.json, app/client/assets/books/generated/a-french-puck/processing_notes.md, app/client/assets/books/generated/a-french-puck/sections/chapter-001.json
- Preview inspected: public/book-previews/a-french-puck.preview.json
- Title verdict: Individual title preserved exactly as "A French Puck"; parent collection "The Lilac Fairy Book" is excluded from the title and playback.
- Author/compiler/collector/translator/reteller verdict: Andrew Lang is source-backed as editor; the legacy author array follows the existing tale metadata convention while the write report records the editor role explicitly.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, wrapped lines, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected/default source order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: A French Puck
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Start evidence: Among the mountain pastures and valleys that lie in the centre of France there dwelt a mischievous kind of spirit, whose delight it was to play tricks on everybody, and particularly on the shepherds and the cowboys. T... / Among the mountain pastures and valleys that lie in the centre of France there dwelt a mischievous kind of spirit, whose delight it was to play tricks on everybody, and particularly on the shepherds and the cowboys. T...
- End evidence: ...ined, if she could, to find out the cause of the disaster. ‘The thread must have been rotten,’ she said to herself. ‘I will see if I can break it.’ But search as she would she could find none. The thread had vanished! / ...ined, if she could, to find out the cause of the disaster. ‘The thread must have been rotten,’ she said to herself. ‘I will see if I can break it.’ But search as she would she could find none. The thread had vanished!
- Preview evidence: Among the mountain pastures and valleys that lie in the centre of France there dwelt a mischievous kind of spirit, whose delight it was to play tricks on everybody, and particularly on the shepherds and the cowboys. T...

### a-lost-paradise

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/a-lost-paradise/manifest.json, app/client/assets/books/generated/a-lost-paradise/cleaned_book.json, app/client/assets/books/generated/a-lost-paradise/processed_book.json, app/client/assets/books/generated/a-lost-paradise/rights_report.json, app/client/assets/books/generated/a-lost-paradise/processing_notes.md, app/client/assets/books/generated/a-lost-paradise/sections/chapter-001.json
- Preview inspected: public/book-previews/a-lost-paradise.preview.json
- Title verdict: Individual title preserved exactly as "A Lost Paradise"; parent collection "The Lilac Fairy Book" is excluded from the title and playback.
- Author/compiler/collector/translator/reteller verdict: Andrew Lang is source-backed as editor; the legacy author array follows the existing tale metadata convention while the write report records the editor role explicitly.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, wrapped lines, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected/default source order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: A Lost Paradise
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Start evidence: In the middle of a great forest there lived a long time ago a charcoal-burner and his wife. They were both young and handsome and strong, and when they got married, they thought work would never fail them. But bad tim... / In the middle of a great forest there lived a long time ago a charcoal-burner and his wife. They were both young and handsome and strong, and when they got married, they thought work would never fail them. But bad tim...
- End evidence: ...has the key.’ ‘Weren’t they silly?’ cried the grandchildren of the charcoal-burners when they heard the story. ‘How we wish that we had had the chance! WE should never have wanted to know what was in the soup-tureen!’ / ...has the key.’ ‘Weren’t they silly?’ cried the grandchildren of the charcoal-burners when they heard the story. ‘How we wish that we had had the chance! WE should never have wanted to know what was in the soup-tureen!’
- Preview evidence: In the middle of a great forest there lived a long time ago a charcoal-burner and his wife. They were both young and handsome and strong, and when they got married, they thought work would never fail them. But bad tim...

### how-brave-walter-hunted-wolves

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/how-brave-walter-hunted-wolves/manifest.json, app/client/assets/books/generated/how-brave-walter-hunted-wolves/cleaned_book.json, app/client/assets/books/generated/how-brave-walter-hunted-wolves/processed_book.json, app/client/assets/books/generated/how-brave-walter-hunted-wolves/rights_report.json, app/client/assets/books/generated/how-brave-walter-hunted-wolves/processing_notes.md, app/client/assets/books/generated/how-brave-walter-hunted-wolves/sections/chapter-001.json
- Preview inspected: public/book-previews/how-brave-walter-hunted-wolves.preview.json
- Title verdict: Individual title preserved exactly as "How Brave Walter Hunted Wolves"; parent collection "The Lilac Fairy Book" is excluded from the title and playback.
- Author/compiler/collector/translator/reteller verdict: Andrew Lang is source-backed as editor; the legacy author array follows the existing tale metadata convention while the write report records the editor role explicitly.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, wrapped lines, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected/default source order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: How Brave Walter Hunted Wolves
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Start evidence: A little back from the high road there stands a house which is called ‘Hemgard.’ Perhaps you remember the two beautiful mountain ash trees by the reddish-brown palings, and the high gate, and the garden with the beaut... / A little back from the high road there stands a house which is called ‘Hemgard.’ Perhaps you remember the two beautiful mountain ash trees by the reddish-brown palings, and the high gate, and the garden with the beaut...
- End evidence: ...meet a bear. You see I like so much better to fight with bears.’ ‘Indeed!’ laughed Jonas. ‘Are you at it again? ‘Dear Walter, remember that it is only cowards who boast; a really brave man never talks of his bravery.’ / ...meet a bear. You see I like so much better to fight with bears.’ ‘Indeed!’ laughed Jonas. ‘Are you at it again? ‘Dear Walter, remember that it is only cowards who boast; a really brave man never talks of his bravery.’
- Preview evidence: A little back from the high road there stands a house which is called ‘Hemgard.’ Perhaps you remember the two beautiful mountain ash trees by the reddish-brown palings, and the high gate, and the garden with the beaut...

### little-lasse

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/little-lasse/manifest.json, app/client/assets/books/generated/little-lasse/cleaned_book.json, app/client/assets/books/generated/little-lasse/processed_book.json, app/client/assets/books/generated/little-lasse/rights_report.json, app/client/assets/books/generated/little-lasse/processing_notes.md, app/client/assets/books/generated/little-lasse/sections/chapter-001.json
- Preview inspected: public/book-previews/little-lasse.preview.json
- Title verdict: Individual title preserved exactly as "Little Lasse"; parent collection "The Lilac Fairy Book" is excluded from the title and playback.
- Author/compiler/collector/translator/reteller verdict: Andrew Lang is source-backed as editor; the legacy author array follows the existing tale metadata convention while the write report records the editor role explicitly.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, wrapped lines, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected/default source order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: Little Lasse
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Start evidence: There was once a little boy whose name was Lars, and because he was so little he was called Little Lasse; he was a brave little man, for he sailed round the world in a pea-shell boat. It was summer time, when the pea ... / There was once a little boy whose name was Lars, and because he was so little he was called Little Lasse; he was a brave little man, for he sailed round the world in a pea-shell boat. It was summer time, when the pea ...
- End evidence: ...oloured men and the wild creatures in the sea and in the woods, so that you may earn many things, but come gladly home again. Yes, who knows? Perhaps you also have sailed round the wide world once in a pea-shell boat. / ...oloured men and the wild creatures in the sea and in the woods, so that you may earn many things, but come gladly home again. Yes, who knows? Perhaps you also have sailed round the wide world once in a pea-shell boat.
- Preview evidence: There was once a little boy whose name was Lars, and because he was so little he was called Little Lasse; he was a brave little man, for he sailed round the world in a pea-shell boat. It was summer time, when the pea ...

### the-sea-king-s-gift

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-sea-king-s-gift/manifest.json, app/client/assets/books/generated/the-sea-king-s-gift/cleaned_book.json, app/client/assets/books/generated/the-sea-king-s-gift/processed_book.json, app/client/assets/books/generated/the-sea-king-s-gift/rights_report.json, app/client/assets/books/generated/the-sea-king-s-gift/processing_notes.md, app/client/assets/books/generated/the-sea-king-s-gift/sections/chapter-001.json
- Preview inspected: public/book-previews/the-sea-king-s-gift.preview.json
- Title verdict: Individual title preserved exactly as "The Sea King’s Gift"; parent collection "The Lilac Fairy Book" is excluded from the title and playback.
- Author/compiler/collector/translator/reteller verdict: Andrew Lang is source-backed as editor; the legacy author array follows the existing tale metadata convention while the write report records the editor role explicitly.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, wrapped lines, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected/default source order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: The Sea King’s Gift
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Start evidence: There was once a fisherman who was called Salmon, and his Christian name was Matte. He lived by the shore of the big sea; where else could he live? He had a wife called Maie; could you find a better name for her? In w... / There was once a fisherman who was called Salmon, and his Christian name was Matte. He lived by the shore of the big sea; where else could he live? He had a wife called Maie; could you find a better name for her? In w...
- End evidence: ...r sleep you walked into the water.’ ‘But there is the fiddle,’ said Maie. ‘A fine fiddle! It is only an old stick. No, no, old woman, another time we will be more careful. Good luck never attends fishing on a Sunday.’ / ...r sleep you walked into the water.’ ‘But there is the fiddle,’ said Maie. ‘A fine fiddle! It is only an old stick. No, no, old woman, another time we will be more careful. Good luck never attends fishing on a Sunday.’
- Preview evidence: There was once a fisherman who was called Salmon, and his Christian name was Matte. He lived by the shore of the big sea; where else could he live? He had a wife called Maie; could you find a better name for her? In w...

### the-story-of-a-very-bad-boy

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-story-of-a-very-bad-boy/manifest.json, app/client/assets/books/generated/the-story-of-a-very-bad-boy/cleaned_book.json, app/client/assets/books/generated/the-story-of-a-very-bad-boy/processed_book.json, app/client/assets/books/generated/the-story-of-a-very-bad-boy/rights_report.json, app/client/assets/books/generated/the-story-of-a-very-bad-boy/processing_notes.md, app/client/assets/books/generated/the-story-of-a-very-bad-boy/sections/chapter-001.json
- Preview inspected: public/book-previews/the-story-of-a-very-bad-boy.preview.json
- Title verdict: Individual title preserved exactly as "The Story of a Very Bad Boy"; parent collection "The Lilac Fairy Book" is excluded from the title and playback.
- Author/compiler/collector/translator/reteller verdict: Andrew Lang is source-backed as editor; the legacy author array follows the existing tale metadata convention while the write report records the editor role explicitly.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, wrapped lines, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected/default source order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: The Story of a Very Bad Boy
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Start evidence: Once upon a time there lived in a little village in the very middle of France a widow and her only son, a boy about fifteen, whose name was Antoine, though no one ever called him anything but Toueno-Boueno. They were ... / Once upon a time there lived in a little village in the very middle of France a widow and her only son, a boy about fifteen, whose name was Antoine, though no one ever called him anything but Toueno-Boueno. They were ...
- End evidence: ...k which juts into the river. I will throw you in from there, and you will fall nearly on to the horses’ backs.’ So he threw them in, and as they were never seen again, no one ever knew into which fair they had fallen. / ...k which juts into the river. I will throw you in from there, and you will fall nearly on to the horses’ backs.’ So he threw them in, and as they were never seen again, no one ever knew into which fair they had fallen.
- Preview evidence: Once upon a time there lived in a little village in the very middle of France a widow and her only son, a boy about fifteen, whose name was Antoine, though no one ever called him anything but Toueno-Boueno. They were ...

### the-three-crowns

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-three-crowns/manifest.json, app/client/assets/books/generated/the-three-crowns/cleaned_book.json, app/client/assets/books/generated/the-three-crowns/processed_book.json, app/client/assets/books/generated/the-three-crowns/rights_report.json, app/client/assets/books/generated/the-three-crowns/processing_notes.md, app/client/assets/books/generated/the-three-crowns/sections/chapter-001.json
- Preview inspected: public/book-previews/the-three-crowns.preview.json
- Title verdict: Individual title preserved exactly as "The Three Crowns"; parent collection "The Lilac Fairy Book" is excluded from the title and playback.
- Author/compiler/collector/translator/reteller verdict: Andrew Lang is source-backed as editor; the legacy author array follows the existing tale metadata convention while the write report records the editor role explicitly.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, wrapped lines, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected/default source order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: The Three Crowns
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Start evidence: There was once a king who had three daughters. The two eldest were very proud and quarrelsome, but the youngest was as good as they were bad. Well, three princes came to court them, and two of them were exactly like t... / There was once a king who had three daughters. The two eldest were very proud and quarrelsome, but the youngest was as good as they were bad. Well, three princes came to court them, and two of them were exactly like t...
- End evidence: ...elebrated on the one day. Soon after, the two elder couples went to their own courts, but the youngest pair stayed with the old king, and they were as happy as the happiest married couple you ever heard of in a story. / ...elebrated on the one day. Soon after, the two elder couples went to their own courts, but the youngest pair stayed with the old king, and they were as happy as the happiest married couple you ever heard of in a story.
- Preview evidence: There was once a king who had three daughters. The two eldest were very proud and quarrelsome, but the youngest was as good as they were bad. Well, three princes came to court them, and two of them were exactly like t...

### the-wonderful-tune

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-wonderful-tune/manifest.json, app/client/assets/books/generated/the-wonderful-tune/cleaned_book.json, app/client/assets/books/generated/the-wonderful-tune/processed_book.json, app/client/assets/books/generated/the-wonderful-tune/rights_report.json, app/client/assets/books/generated/the-wonderful-tune/processing_notes.md, app/client/assets/books/generated/the-wonderful-tune/sections/chapter-001.json
- Preview inspected: public/book-previews/the-wonderful-tune.preview.json
- Title verdict: Individual title preserved exactly as "The Wonderful Tune"; parent collection "The Lilac Fairy Book" is excluded from the title and playback.
- Author/compiler/collector/translator/reteller verdict: Andrew Lang is source-backed as editor; the legacy author array follows the existing tale metadata convention while the write report records the editor role explicitly.
- Raw-vs-generated body comparison verdict: Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary verdict: Body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning verdict: One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, wrapped lines, and ending remain exact.
- Preview verdict: Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback.
- All-main-readable-default verdict: All readable story content is included by default and selected/default source order starts at the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: The Wonderful Tune.
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Start evidence: Maurice Connor was the king, and that’s no small word, of all the pipers in Munster. He could play jig and reel without end, and Ollistrum’s March, and the Eagle’s Whistle, and the Hen’s Concert, and odd tunes of ever... / Maurice Connor was the king, and that’s no small word, of all the pipers in Munster. He could play jig and reel without end, and Ollistrum’s March, and the Eagle’s Whistle, and the Hen’s Concert, and odd tunes of ever...
- End evidence: ...nguish Maurice Connor’s voice singing these words to his pipes-- Beautiful shore, with thy spreading strand, Thy crystal water, and diamond sand; Never would I have parted from thee, But for the sake of my fair ladie. / ...nguish Maurice Connor’s voice singing these words to his pipes-- Beautiful shore, with thy spreading strand, Thy crystal water, and diamond sand; Never would I have parted from thee, But for the sake of my fair ladie.
- Preview evidence: Maurice Connor was the king, and that’s no small word, of all the pipers in Munster. He could play jig and reel without end, and Ollistrum’s March, and the Eagle’s Whistle, and the Hen’s Concert, and odd tunes of ever...

## Protected Scope

- Unresolved-source generated books untouched: a-princess-of-mars, doctor-dolittle, heidi, jabberwocky, nights-with-uncle-remus, peter-pan, tarzan-of-the-apes, the-great-gatsby, the-picture-of-dorian-gray, the-thirty-nine-steps, wood-folk-at-school
- Duplicate/boundary skips not reintroduced: the-wind-in-the-willows, the-two-magics-the-turn-of-the-screw-covering-end, japanese-fairy-tales, the-works-of-edgar-allan-poe, snow-white-and-rose-red
- Raw sources modified: no
- Cloudflare exports modified: no
- Unrelated generated/preview changes: none

## Validation

- typecheck: pass
- pilotWrite17: pass: 20 first-time processed, 0 skipped; rerun report churn restored
- batch12ProseRestore: pass: 20/20 exact, 0 prose omissions, 0 missing opening quotes; regenerated historical outputs restored
- startupPreviewAudit: pass: 355/355 valid, 0 preview updates; audit report churn restored
- titleStartDefaultAudit: pass: 355 audited, 12 known unrelated validator corrections restored, 0 accepted books revoked
- metadataSegmentationAudit: pass: 355 audited, 0 author corrections, 1 justified unrelated unknown-author case, 0 revocations; audit report churn restored
- manualUiDefectFollowup: pass: 8/8 acceptable, 0 corrected, 0 revoked, 0 manual review; audit report churn restored
- targetedVerifier: pass: 20/20 books, raw/generated 20/20 exact
- browserQa: pass: unpublished batch-17 page identity/content/selection interaction; no app runtime errors; expected HMR-disabled Vite websocket noise only
- playwright: pass: 36/36 desktop-chromium (3.5m)
- appBuild: pass with NODE_OPTIONS=--max-old-space-size=8192; default 4 GB heap exhausted during SSR retry
- smokeTests: pass: 23/23 smoke tests (1.2m)
- gitDiffCheck: pass
- Playwright known fullscreen-only failure: no
- Audit side-effect handling: pass: write-17 report regeneration, batch-12 historical output regeneration, title/start unrelated corrections, and timestamp-only audit reports were inspected and restored; no unrelated churn remains
