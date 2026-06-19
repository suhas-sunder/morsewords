# Pilot write batch 13 verification

Generated: 2026-06-19T21:15:50.296Z

## Summary

- Verified: 20
- Pass: 20
- Warn accepted: 0
- Fail: 0
- Accepted for main: 20
- Corrections applied: 2

## Write-12 script scope investigation

- Classification: required shared write-12/write-13 implementation retained in an unexpectedly named prior-batch runner
- Resolution: Retained because the diff is directly used by write 13 and is not unrelated churn; documented here rather than duplicating the full processor into another batch-specific file.
- Unrelated write-12 changes found: no

## Corrections

- frederick-and-catherine: Restored the readable source line beginning 'plates and dishes'; placeholder cleanup now requires a word boundary after Plate.
- snowdrop: Restored the readable sentence beginning 'By and by'; byline cleanup no longer treats that phrase as an author line.

## Books

### ashputtel

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/ashputtel/manifest.json, app/client/assets/books/generated/ashputtel/cleaned_book.json, app/client/assets/books/generated/ashputtel/processed_book.json, app/client/assets/books/generated/ashputtel/rights_report.json, app/client/assets/books/generated/ashputtel/processing_notes.md, app/client/assets/books/generated/ashputtel/sections/chapter-001.json
- Preview inspected: public/book-previews/ashputtel.preview.json
- Title verdict: Individual tale title preserved as Ashputtel.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Readable prose matches the cleaned source exactly after whitespace normalization; wrapper and artifact material is absent.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: ASHPUTTEL
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: The wife of a rich man fell sick; and when she felt that her end drew nigh, she called her only daughter to her bed-side, and said, ‘Always be a good girl, and I will look down from heaven and watch over you.’ Soon af... / The wife of a rich man fell sick; and when she felt that her end drew nigh, she called her only daughter to her bed-side, and said, ‘Always be a good girl, and I will look down from heaven and watch over you.’ Soon af...
- Raw/generated end: ...s made for you! Prince! prince! take home thy bride, For she is the true one that sits by thy side!’ And when the dove had done its song, it came flying, and perched upon her right shoulder, and so went home with her. / ...s made for you! Prince! prince! take home thy bride, For she is the true one that sits by thy side!’ And when the dove had done its song, it came flying, and perched upon her right shoulder, and so went home with her.
- Preview start: The wife of a rich man fell sick; and when she felt that her end drew nigh, she called her only daughter to her bed-side, and said, ‘Always be a good girl, and I will look down from heaven and watch over you.’ Soon af...

### cat-and-mouse-in-partnership

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/cat-and-mouse-in-partnership/manifest.json, app/client/assets/books/generated/cat-and-mouse-in-partnership/cleaned_book.json, app/client/assets/books/generated/cat-and-mouse-in-partnership/processed_book.json, app/client/assets/books/generated/cat-and-mouse-in-partnership/rights_report.json, app/client/assets/books/generated/cat-and-mouse-in-partnership/processing_notes.md, app/client/assets/books/generated/cat-and-mouse-in-partnership/sections/chapter-001.json
- Preview inspected: public/book-previews/cat-and-mouse-in-partnership.preview.json
- Title verdict: Individual tale title preserved as Cat and Mouse in Partnership.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Readable prose matches the cleaned source exactly after whitespace normalization; wrapper and artifact material is absent.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: CAT AND MOUSE IN PARTNERSHIP
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: A certain cat had made the acquaintance of a mouse, and had said so much to her about the great love and friendship she felt for her, that at length the mouse agreed that they should live and keep house together. ‘But... / A certain cat had made the acquaintance of a mouse, and had said so much to her about the great love and friendship she felt for her, that at length the mouse agreed that they should live and keep house together. ‘But...
- Raw/generated end: ...e word more, and I will eat you too.’ ‘All-gone’ was already on the poor mouse’s lips; scarcely had she spoken it before the cat sprang on her, seized her, and swallowed her down. Verily, that is the way of the world. / ...e word more, and I will eat you too.’ ‘All-gone’ was already on the poor mouse’s lips; scarcely had she spoken it before the cat sprang on her, seized her, and swallowed her down. Verily, that is the way of the world.
- Preview start: A certain cat had made the acquaintance of a mouse, and had said so much to her about the great love and friendship she felt for her, that at length the mouse agreed that they should live and keep house together. ‘But...

### cat-skin

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/cat-skin/manifest.json, app/client/assets/books/generated/cat-skin/cleaned_book.json, app/client/assets/books/generated/cat-skin/processed_book.json, app/client/assets/books/generated/cat-skin/rights_report.json, app/client/assets/books/generated/cat-skin/processing_notes.md, app/client/assets/books/generated/cat-skin/sections/chapter-001.json
- Preview inspected: public/book-previews/cat-skin.preview.json
- Title verdict: Individual tale title preserved as Cat-Skin.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Readable prose matches the cleaned source exactly after whitespace normalization; wrapper and artifact material is absent.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: CAT-SKIN
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: There was once a king, whose queen had hair of the purest gold, and was so beautiful that her match was not to be met with on the whole face of the earth. But this beautiful queen fell ill, and when she felt that her ... / There was once a king, whose queen had hair of the purest gold, and was so beautiful that her match was not to be met with on the whole face of the earth. But this beautiful queen fell ill, and when she felt that her ...
- Raw/generated end: ...he king said, ‘You are my beloved bride, and we will never more be parted from each other.’ And the wedding feast was held, and a merry day it was, as ever was heard of or seen in that country, or indeed in any other. / ...he king said, ‘You are my beloved bride, and we will never more be parted from each other.’ And the wedding feast was held, and a merry day it was, as ever was heard of or seen in that country, or indeed in any other.
- Preview start: There was once a king, whose queen had hair of the purest gold, and was so beautiful that her match was not to be met with on the whole face of the earth. But this beautiful queen fell ill, and when she felt that her ...

### clever-elsie

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/clever-elsie/manifest.json, app/client/assets/books/generated/clever-elsie/cleaned_book.json, app/client/assets/books/generated/clever-elsie/processed_book.json, app/client/assets/books/generated/clever-elsie/rights_report.json, app/client/assets/books/generated/clever-elsie/processing_notes.md, app/client/assets/books/generated/clever-elsie/sections/chapter-001.json
- Preview inspected: public/book-previews/clever-elsie.preview.json
- Title verdict: Individual tale title preserved as Clever Elsie.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Readable prose matches the cleaned source exactly after whitespace normalization; wrapper and artifact material is absent.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: CLEVER ELSIE
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: There was once a man who had a daughter who was called Clever Elsie. And when she had grown up her father said: ‘We will get her married.’ ‘Yes,’ said the mother, ‘if only someone would come who would have her.’ At le... / There was once a man who had a daughter who was called Clever Elsie. And when she had grown up her father said: ‘We will get her married.’ ‘Yes,’ said the mother, ‘if only someone would come who would have her.’ At le...
- Raw/generated end: ...s! Then it is not I,’ and went to another door; but when the people heard the jingling of the bells they would not open it, and she could get in nowhere. Then she ran out of the village, and no one has seen her since. / ...s! Then it is not I,’ and went to another door; but when the people heard the jingling of the bells they would not open it, and she could get in nowhere. Then she ran out of the village, and no one has seen her since.
- Preview start: There was once a man who had a daughter who was called Clever Elsie. And when she had grown up her father said: ‘We will get her married.’ ‘Yes,’ said the mother, ‘if only someone would come who would have her.’ At le...

### clever-gretel

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/clever-gretel/manifest.json, app/client/assets/books/generated/clever-gretel/cleaned_book.json, app/client/assets/books/generated/clever-gretel/processed_book.json, app/client/assets/books/generated/clever-gretel/rights_report.json, app/client/assets/books/generated/clever-gretel/processing_notes.md, app/client/assets/books/generated/clever-gretel/sections/chapter-001.json
- Preview inspected: public/book-previews/clever-gretel.preview.json
- Title verdict: Individual tale title preserved as Clever Gretel.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Readable prose matches the cleaned source exactly after whitespace normalization; wrapper and artifact material is absent.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: CLEVER GRETEL
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: There was once a cook named Gretel, who wore shoes with red heels, and when she walked out with them on, she turned herself this way and that, was quite happy and thought: ‘You certainly are a pretty girl!’ And when s... / There was once a cook named Gretel, who wore shoes with red heels, and when she walked out with them on, she turned herself this way and that, was quite happy and thought: ‘You certainly are a pretty girl!’ And when s...
- Raw/generated end: ...ould leave him just one chicken, and not take both. The guest, however, thought no otherwise than that he was to give up one of his ears, and ran as if fire were burning under him, in order to take them both with him. / ...ould leave him just one chicken, and not take both. The guest, however, thought no otherwise than that he was to give up one of his ears, and ran as if fire were burning under him, in order to take them both with him.
- Preview start: There was once a cook named Gretel, who wore shoes with red heels, and when she walked out with them on, she turned herself this way and that, was quite happy and thought: ‘You certainly are a pretty girl!’ And when s...

### doctor-knowall

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/doctor-knowall/manifest.json, app/client/assets/books/generated/doctor-knowall/cleaned_book.json, app/client/assets/books/generated/doctor-knowall/processed_book.json, app/client/assets/books/generated/doctor-knowall/rights_report.json, app/client/assets/books/generated/doctor-knowall/processing_notes.md, app/client/assets/books/generated/doctor-knowall/sections/chapter-001.json
- Preview inspected: public/book-previews/doctor-knowall.preview.json
- Title verdict: Individual tale title preserved as Doctor Knowall.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Readable prose matches the cleaned source exactly after whitespace normalization; wrapper and artifact material is absent.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: DOCTOR KNOWALL
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: There was once upon a time a poor peasant called Crabb, who drove with two oxen a load of wood to the town, and sold it to a doctor for two talers. When the money was being counted out to him, it so happened that the ... / There was once upon a time a poor peasant called Crabb, who drove with two oxen a load of wood to the town, and sold it to a doctor for two talers. When the money was being counted out to him, it so happened that the ...
- Raw/generated end: ...prang out, crying: ‘That man knows everything!’ Then Doctor Knowall showed the lord where the money was, but did not say who had stolen it, and received from both sides much money in reward, and became a renowned man. / ...prang out, crying: ‘That man knows everything!’ Then Doctor Knowall showed the lord where the money was, but did not say who had stolen it, and received from both sides much money in reward, and became a renowned man.
- Preview start: There was once upon a time a poor peasant called Crabb, who drove with two oxen a load of wood to the town, and sold it to a doctor for two talers. When the money was being counted out to him, it so happened that the ...

### frederick-and-catherine

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/frederick-and-catherine/manifest.json, app/client/assets/books/generated/frederick-and-catherine/cleaned_book.json, app/client/assets/books/generated/frederick-and-catherine/processed_book.json, app/client/assets/books/generated/frederick-and-catherine/rights_report.json, app/client/assets/books/generated/frederick-and-catherine/processing_notes.md, app/client/assets/books/generated/frederick-and-catherine/sections/chapter-001.json
- Preview inspected: public/book-previews/frederick-and-catherine.preview.json
- Title verdict: Individual tale title preserved as Frederick and Catherine.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Readable prose matches the cleaned source exactly after whitespace normalization; wrapper and artifact material is absent.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: Restored the readable source line beginning 'plates and dishes'; placeholder cleanup now requires a word boundary after Plate.
- Title evidence: FREDERICK AND CATHERINE
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: There was once a man called Frederick: he had a wife whose name was Catherine, and they had not long been married. One day Frederick said. ‘Kate! I am going to work in the fields; when I come back I shall be hungry so... / There was once a man called Frederick: he had a wife whose name was Catherine, and they had not long been married. One day Frederick said. ‘Kate! I am going to work in the fields; when I come back I shall be hungry so...
- Raw/generated end: ...hieves, that they cried out ‘Murder!’ and not knowing what was coming, ran away as fast as they could, and left all the gold. So when Frederick and Catherine came down, there they found all their money safe and sound. / ...hieves, that they cried out ‘Murder!’ and not knowing what was coming, ran away as fast as they could, and left all the gold. So when Frederick and Catherine came down, there they found all their money safe and sound.
- Preview start: There was once a man called Frederick: he had a wife whose name was Catherine, and they had not long been married. One day Frederick said. ‘Kate! I am going to work in the fields; when I come back I shall be hungry so...

### fundevogel

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/fundevogel/manifest.json, app/client/assets/books/generated/fundevogel/cleaned_book.json, app/client/assets/books/generated/fundevogel/processed_book.json, app/client/assets/books/generated/fundevogel/rights_report.json, app/client/assets/books/generated/fundevogel/processing_notes.md, app/client/assets/books/generated/fundevogel/sections/chapter-001.json
- Preview inspected: public/book-previews/fundevogel.preview.json
- Title verdict: Individual tale title preserved as Fundevogel.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Readable prose matches the cleaned source exactly after whitespace normalization; wrapper and artifact material is absent.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: FUNDEVOGEL
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: There was once a forester who went into the forest to hunt, and as he entered it he heard a sound of screaming as if a little child were there. He followed the sound, and at last came to a high tree, and at the top of... / There was once a forester who went into the forest to hunt, and as he entered it he heard a sound of screaming as if a little child were there. He followed the sound, and at last came to a high tree, and at the top of...
- Raw/generated end: ... her, seized her head in its beak and drew her into the water, and there the old witch had to drown. Then the children went home together, and were heartily delighted, and if they have not died, they are living still. / ... her, seized her head in its beak and drew her into the water, and there the old witch had to drown. Then the children went home together, and were heartily delighted, and if they have not died, they are living still.
- Preview start: There was once a forester who went into the forest to hunt, and as he entered it he heard a sound of screaming as if a little child were there. He followed the sound, and at last came to a high tree, and at the top of...

### hans-in-luck

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/hans-in-luck/manifest.json, app/client/assets/books/generated/hans-in-luck/cleaned_book.json, app/client/assets/books/generated/hans-in-luck/processed_book.json, app/client/assets/books/generated/hans-in-luck/rights_report.json, app/client/assets/books/generated/hans-in-luck/processing_notes.md, app/client/assets/books/generated/hans-in-luck/sections/chapter-001.json
- Preview inspected: public/book-previews/hans-in-luck.preview.json
- Title verdict: Individual tale title preserved as Hans in Luck.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Readable prose matches the cleaned source exactly after whitespace normalization; wrapper and artifact material is absent.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: HANS IN LUCK
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: Some men are born to good luck: all they do or try to do comes right--all that falls to them is so much gain--all their geese are swans--all their cards are trumps--toss them which way you will, they will always, like... / Some men are born to good luck: all they do or try to do comes right--all that falls to them is so much gain--all their geese are swans--all their cards are trumps--toss them which way you will, they will always, like...
- Raw/generated end: ... am I!’ cried he; ‘nobody was ever so lucky as I.’ Then up he got with a light heart, free from all his troubles, and walked on till he reached his mother’s house, and told her how very easy the road to good luck was. / ... am I!’ cried he; ‘nobody was ever so lucky as I.’ Then up he got with a light heart, free from all his troubles, and walked on till he reached his mother’s house, and told her how very easy the road to good luck was.
- Preview start: Some men are born to good luck: all they do or try to do comes right--all that falls to them is so much gain--all their geese are swans--all their cards are trumps--toss them which way you will, they will always, like...

### hansel-and-gretel

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/hansel-and-gretel/manifest.json, app/client/assets/books/generated/hansel-and-gretel/cleaned_book.json, app/client/assets/books/generated/hansel-and-gretel/processed_book.json, app/client/assets/books/generated/hansel-and-gretel/rights_report.json, app/client/assets/books/generated/hansel-and-gretel/processing_notes.md, app/client/assets/books/generated/hansel-and-gretel/sections/chapter-001.json
- Preview inspected: public/book-previews/hansel-and-gretel.preview.json
- Title verdict: Individual tale title preserved as Hansel and Gretel.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Readable prose matches the cleaned source exactly after whitespace normalization; wrapper and artifact material is absent.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: HANSEL AND GRETEL
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: Hard by a great forest dwelt a poor wood-cutter with his wife and his two children. The boy was called Hansel and the girl Gretel. He had little to bite and to break, and once when great dearth fell on the land, he co... / Hard by a great forest dwelt a poor wood-cutter with his wife and his two children. The boy was called Hansel and the girl Gretel. He had little to bite and to break, and once when great dearth fell on the land, he co...
- Raw/generated end: ...ther out of his pocket to add to them. Then all anxiety was at an end, and they lived together in perfect happiness. My tale is done, there runs a mouse; whosoever catches it, may make himself a big fur cap out of it. / ...ther out of his pocket to add to them. Then all anxiety was at an end, and they lived together in perfect happiness. My tale is done, there runs a mouse; whosoever catches it, may make himself a big fur cap out of it.
- Preview start: Hard by a great forest dwelt a poor wood-cutter with his wife and his two children. The boy was called Hansel and the girl Gretel. He had little to bite and to break, and once when great dearth fell on the land, he co...

### iron-hans

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/iron-hans/manifest.json, app/client/assets/books/generated/iron-hans/cleaned_book.json, app/client/assets/books/generated/iron-hans/processed_book.json, app/client/assets/books/generated/iron-hans/rights_report.json, app/client/assets/books/generated/iron-hans/processing_notes.md, app/client/assets/books/generated/iron-hans/sections/chapter-001.json
- Preview inspected: public/book-previews/iron-hans.preview.json
- Title verdict: Individual tale title preserved as Iron Hans.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Readable prose matches the cleaned source exactly after whitespace normalization; wrapper and artifact material is absent.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: IRON HANS
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: There was once upon a time a king who had a great forest near his palace, full of all kinds of wild animals. One day he sent out a huntsman to shoot him a roe, but he did not come back. ‘Perhaps some accident has befa... / There was once upon a time a king who had a great forest near his palace, full of all kinds of wild animals. One day he sent out a huntsman to shoot him a roe, but he did not come back. ‘Perhaps some accident has befa...
- Raw/generated end: ...g came in with a great retinue. He went up to the youth, embraced him and said: ‘I am Iron Hans, and was by enchantment a wild man, but you have set me free; all the treasures which I possess, shall be your property.’ / ...g came in with a great retinue. He went up to the youth, embraced him and said: ‘I am Iron Hans, and was by enchantment a wild man, but you have set me free; all the treasures which I possess, shall be your property.’
- Preview start: There was once upon a time a king who had a great forest near his palace, full of all kinds of wild animals. One day he sent out a huntsman to shoot him a roe, but he did not come back. ‘Perhaps some accident has befa...

### king-grisly-beard

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/king-grisly-beard/manifest.json, app/client/assets/books/generated/king-grisly-beard/cleaned_book.json, app/client/assets/books/generated/king-grisly-beard/processed_book.json, app/client/assets/books/generated/king-grisly-beard/rights_report.json, app/client/assets/books/generated/king-grisly-beard/processing_notes.md, app/client/assets/books/generated/king-grisly-beard/sections/chapter-001.json
- Preview inspected: public/book-previews/king-grisly-beard.preview.json
- Title verdict: Individual tale title preserved as King Grisly-Beard.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Readable prose matches the cleaned source exactly after whitespace normalization; wrapper and artifact material is absent.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: KING GRISLY-BEARD
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: A great king of a land far away in the East had a daughter who was very beautiful, but so proud, and haughty, and conceited, that none of the princes who came to ask her in marriage was good enough for her, and she on... / A great king of a land far away in the East had a daughter who was very beautiful, but so proud, and haughty, and conceited, that none of the princes who came to ask her in marriage was good enough for her, and she on...
- Raw/generated end: ... court were there already, and welcomed her home on her marriage. Joy was in every face and every heart. The feast was grand; they danced and sang; all were merry; and I only wish that you and I had been of the party. / ... court were there already, and welcomed her home on her marriage. Joy was in every face and every heart. The feast was grand; they danced and sang; all were merry; and I only wish that you and I had been of the party.
- Preview start: A great king of a land far away in the East had a daughter who was very beautiful, but so proud, and haughty, and conceited, that none of the princes who came to ask her in marriage was good enough for her, and she on...

### lily-and-the-lion

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/lily-and-the-lion/manifest.json, app/client/assets/books/generated/lily-and-the-lion/cleaned_book.json, app/client/assets/books/generated/lily-and-the-lion/processed_book.json, app/client/assets/books/generated/lily-and-the-lion/rights_report.json, app/client/assets/books/generated/lily-and-the-lion/processing_notes.md, app/client/assets/books/generated/lily-and-the-lion/sections/chapter-001.json
- Preview inspected: public/book-previews/lily-and-the-lion.preview.json
- Title verdict: Individual tale title preserved as Lily and the Lion.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Readable prose matches the cleaned source exactly after whitespace normalization; wrapper and artifact material is absent.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: LILY AND THE LION
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: A merchant, who had three daughters, was once setting out upon a journey; but before he went he asked each daughter what gift he should bring back for her. The eldest wished for pearls; the second for jewels; but the ... / A merchant, who had three daughters, was once setting out upon a journey; but before he went he asked each daughter what gift he should bring back for her. The eldest wished for pearls; the second for jewels; but the ...
- Raw/generated end: ...n the griffin rested for a while, and then carried them safely home. There they found their child, now grown up to be comely and fair; and after all their troubles they lived happily together to the end of their days. / ...n the griffin rested for a while, and then carried them safely home. There they found their child, now grown up to be comely and fair; and after all their troubles they lived happily together to the end of their days.
- Preview start: A merchant, who had three daughters, was once setting out upon a journey; but before he went he asked each daughter what gift he should bring back for her. The eldest wished for pearls; the second for jewels; but the ...

### little-red-riding-hood

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/little-red-riding-hood/manifest.json, app/client/assets/books/generated/little-red-riding-hood/cleaned_book.json, app/client/assets/books/generated/little-red-riding-hood/processed_book.json, app/client/assets/books/generated/little-red-riding-hood/rights_report.json, app/client/assets/books/generated/little-red-riding-hood/processing_notes.md, app/client/assets/books/generated/little-red-riding-hood/sections/chapter-001.json
- Preview inspected: public/book-previews/little-red-riding-hood.preview.json
- Title verdict: Individual tale title preserved as Little Red Riding Hood.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Readable prose matches the cleaned source exactly after whitespace normalization; wrapper and artifact material is absent.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: LITTLE RED RIDING HOOD
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: Once upon a time there was a dear little girl who was loved by everyone who looked at her, but most of all by her grandmother, and there was nothing that she would not have given to the child. Once she gave her a litt... / Once upon a time there was a dear little girl who was loved by everyone who looked at her, but most of all by her grandmother, and there was nothing that she would not have given to the child. Once she gave her a litt...
- Raw/generated end: ...at he could no longer keep his footing and began to slip, and slipped down from the roof straight into the great trough, and was drowned. But Red-Cap went joyously home, and no one ever did anything to harm her again. / ...at he could no longer keep his footing and began to slip, and slipped down from the roof straight into the great trough, and was drowned. But Red-Cap went joyously home, and no one ever did anything to harm her again.
- Preview start: Once upon a time there was a dear little girl who was loved by everyone who looked at her, but most of all by her grandmother, and there was nothing that she would not have given to the child. Once she gave her a litt...

### old-sultan

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/old-sultan/manifest.json, app/client/assets/books/generated/old-sultan/cleaned_book.json, app/client/assets/books/generated/old-sultan/processed_book.json, app/client/assets/books/generated/old-sultan/rights_report.json, app/client/assets/books/generated/old-sultan/processing_notes.md, app/client/assets/books/generated/old-sultan/sections/chapter-001.json
- Preview inspected: public/book-previews/old-sultan.preview.json
- Title verdict: Individual tale title preserved as Old Sultan.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Readable prose matches the cleaned source exactly after whitespace normalization; wrapper and artifact material is absent.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: OLD SULTAN
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: A shepherd had a faithful dog, called Sultan, who was grown very old, and had lost all his teeth. And one day when the shepherd and his wife were standing together before the house the shepherd said, ‘I will shoot old... / A shepherd had a faithful dog, called Sultan, who was grown very old, and had lost all his teeth. And one day when the shepherd and his wife were standing together before the house the shepherd said, ‘I will shoot old...
- Raw/generated end: ...d the wolf sitting amongst the branches; and they called him a cowardly rascal, and would not suffer him to come down till he was heartily ashamed of himself, and had promised to be good friends again with old Sultan. / ...d the wolf sitting amongst the branches; and they called him a cowardly rascal, and would not suffer him to come down till he was heartily ashamed of himself, and had promised to be good friends again with old Sultan.
- Preview start: A shepherd had a faithful dog, called Sultan, who was grown very old, and had lost all his teeth. And one day when the shepherd and his wife were standing together before the house the shepherd said, ‘I will shoot old...

### rumpelstiltskin

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/rumpelstiltskin/manifest.json, app/client/assets/books/generated/rumpelstiltskin/cleaned_book.json, app/client/assets/books/generated/rumpelstiltskin/processed_book.json, app/client/assets/books/generated/rumpelstiltskin/rights_report.json, app/client/assets/books/generated/rumpelstiltskin/processing_notes.md, app/client/assets/books/generated/rumpelstiltskin/sections/chapter-001.json
- Preview inspected: public/book-previews/rumpelstiltskin.preview.json
- Title verdict: Individual tale title preserved as Rumpelstiltskin.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Readable prose matches the cleaned source exactly after whitespace normalization; wrapper and artifact material is absent.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: RUMPELSTILTSKIN
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: By the side of a wood, in a country a long way off, ran a fine stream of water; and upon the stream there stood a mill. The miller’s house was close by, and the miller, you must know, had a very beautiful daughter. Sh... / By the side of a wood, in a country a long way off, ran a fine stream of water; and upon the stream there stood a mill. The miller’s house was close by, and the miller, you must know, had a very beautiful daughter. Sh...
- Raw/generated end: ...his way off, while the nurse laughed and the baby crowed; and all the court jeered at him for having had so much trouble for nothing, and said, ‘We wish you a very good morning, and a merry feast, Mr RUMPLESTILTSKIN!’ / ...his way off, while the nurse laughed and the baby crowed; and all the court jeered at him for having had so much trouble for nothing, and said, ‘We wish you a very good morning, and a merry feast, Mr RUMPLESTILTSKIN!’
- Preview start: By the side of a wood, in a country a long way off, ran a fine stream of water; and upon the stream there stood a mill. The miller’s house was close by, and the miller, you must know, had a very beautiful daughter. Sh...

### snowdrop

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/snowdrop/manifest.json, app/client/assets/books/generated/snowdrop/cleaned_book.json, app/client/assets/books/generated/snowdrop/processed_book.json, app/client/assets/books/generated/snowdrop/rights_report.json, app/client/assets/books/generated/snowdrop/processing_notes.md, app/client/assets/books/generated/snowdrop/sections/chapter-001.json
- Preview inspected: public/book-previews/snowdrop.preview.json
- Title verdict: Individual tale title preserved as Snowdrop.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Readable prose matches the cleaned source exactly after whitespace normalization; wrapper and artifact material is absent.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: Restored the readable sentence beginning 'By and by'; byline cleanup no longer treats that phrase as an author line.
- Title evidence: SNOWDROP
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: It was the middle of winter, when the broad flakes of snow were falling around, that the queen of a country many thousand miles off sat working at her window. The frame of the window was made of fine black ebony, and ... / It was the middle of winter, when the broad flakes of snow were falling around, that the queen of a country many thousand miles off sat working at her window. The frame of the window was made of fine black ebony, and ...
- Raw/generated end: ...rop and the prince lived and reigned happily over that land many, many years; and sometimes they went up into the mountains, and paid a visit to the little dwarfs, who had been so kind to Snowdrop in her time of need. / ...rop and the prince lived and reigned happily over that land many, many years; and sometimes they went up into the mountains, and paid a visit to the little dwarfs, who had been so kind to Snowdrop in her time of need.
- Preview start: It was the middle of winter, when the broad flakes of snow were falling around, that the queen of a country many thousand miles off sat working at her window. The frame of the window was made of fine black ebony, and ...

### sweetheart-roland

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/sweetheart-roland/manifest.json, app/client/assets/books/generated/sweetheart-roland/cleaned_book.json, app/client/assets/books/generated/sweetheart-roland/processed_book.json, app/client/assets/books/generated/sweetheart-roland/rights_report.json, app/client/assets/books/generated/sweetheart-roland/processing_notes.md, app/client/assets/books/generated/sweetheart-roland/sections/chapter-001.json
- Preview inspected: public/book-previews/sweetheart-roland.preview.json
- Title verdict: Individual tale title preserved as Sweetheart Roland.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Readable prose matches the cleaned source exactly after whitespace normalization; wrapper and artifact material is absent.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: SWEETHEART ROLAND
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: There was once upon a time a woman who was a real witch and had two daughters, one ugly and wicked, and this one she loved because she was her own daughter, and one beautiful and good, and this one she hated, because ... / There was once upon a time a woman who was a real witch and had two daughters, one ugly and wicked, and this one she loved because she was her own daughter, and one beautiful and good, and this one she hated, because ...
- Raw/generated end: ...erything he had forgotten, and which had vanished from his mind, had suddenly come home again to his heart. Then the faithful maiden held her wedding with her sweetheart Roland, and grief came to an end and joy began. / ...erything he had forgotten, and which had vanished from his mind, had suddenly come home again to his heart. Then the faithful maiden held her wedding with her sweetheart Roland, and grief came to an end and joy began.
- Preview start: There was once upon a time a woman who was a real witch and had two daughters, one ugly and wicked, and this one she loved because she was her own daughter, and one beautiful and good, and this one she hated, because ...

### the-dog-and-the-sparrow

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-dog-and-the-sparrow/manifest.json, app/client/assets/books/generated/the-dog-and-the-sparrow/cleaned_book.json, app/client/assets/books/generated/the-dog-and-the-sparrow/processed_book.json, app/client/assets/books/generated/the-dog-and-the-sparrow/rights_report.json, app/client/assets/books/generated/the-dog-and-the-sparrow/processing_notes.md, app/client/assets/books/generated/the-dog-and-the-sparrow/sections/chapter-001.json
- Preview inspected: public/book-previews/the-dog-and-the-sparrow.preview.json
- Title verdict: Individual tale title preserved as The Dog and the Sparrow.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Readable prose matches the cleaned source exactly after whitespace normalization; wrapper and artifact material is absent.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: THE DOG AND THE SPARROW
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: A shepherd’s dog had a master who took no care of him, but often let him suffer the greatest hunger. At last he could bear it no longer; so he took to his heels, and off he ran in a very sad and sorrowful mood. On the... / A shepherd’s dog had a master who took no care of him, but often let him suffer the greatest hunger. At last he could bear it no longer; so he took to his heels, and off he ran in a very sad and sorrowful mood. On the...
- Raw/generated end: ...et, and cried, ‘Wife, strike at the bird and kill her in my hand.’ And the wife struck; but she missed her aim, and hit her husband on the head so that he fell down dead, and the sparrow flew quietly home to her nest. / ...et, and cried, ‘Wife, strike at the bird and kill her in my hand.’ And the wife struck; but she missed her aim, and hit her husband on the head so that he fell down dead, and the sparrow flew quietly home to her nest.
- Preview start: A shepherd’s dog had a master who took no care of him, but often let him suffer the greatest hunger. At last he could bear it no longer; so he took to his heels, and off he ran in a very sad and sorrowful mood. On the...

### the-valiant-little-tailor

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-valiant-little-tailor/manifest.json, app/client/assets/books/generated/the-valiant-little-tailor/cleaned_book.json, app/client/assets/books/generated/the-valiant-little-tailor/processed_book.json, app/client/assets/books/generated/the-valiant-little-tailor/rights_report.json, app/client/assets/books/generated/the-valiant-little-tailor/processing_notes.md, app/client/assets/books/generated/the-valiant-little-tailor/sections/chapter-001.json
- Preview inspected: public/book-previews/the-valiant-little-tailor.preview.json
- Title verdict: Individual tale title preserved as The Valiant Little Tailor.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Readable prose matches the cleaned source exactly after whitespace normalization; wrapper and artifact material is absent.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: THE VALIANT LITTLE TAILOR
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: One summer’s morning a little tailor was sitting on his table by the window; he was in good spirits, and sewed with all his might. Then came a peasant woman down the street crying: ‘Good jams, cheap! Good jams, cheap!... / One summer’s morning a little tailor was sitting on his table by the window; he was in good spirits, and sewed with all his might. Then came a peasant woman down the street crying: ‘Good jams, cheap! Good jams, cheap!...
- Raw/generated end: ... they were overcome by a great dread, and ran as if the wild huntsman were behind them, and none of them would venture anything further against him. So the little tailor was and remained a king to the end of his life. / ... they were overcome by a great dread, and ran as if the wild huntsman were behind them, and none of them would venture anything further against him. So the little tailor was and remained a king to the end of his life.
- Preview start: One summer’s morning a little tailor was sitting on his table by the window; he was in good spirits, and sewed with all his might. Then came a peasant woman down the street crying: ‘Good jams, cheap! Good jams, cheap!...

## Protected scope

- Unresolved-source generated books untouched: a-princess-of-mars, doctor-dolittle, heidi, jabberwocky, nights-with-uncle-remus, peter-pan, tarzan-of-the-apes, the-great-gatsby, the-picture-of-dorian-gray, the-thirty-nine-steps, wood-folk-at-school
- Duplicate/boundary skips not reintroduced: the-wind-in-the-willows, the-two-magics-the-turn-of-the-screw-covering-end, the-works-of-edgar-allan-poe
- Raw sources modified: no
- Cloudflare exports modified: no

## Validation notes

- Playwright: 36/36 passed during the write pass; the required verification rerun also passed 36/36 with --reporter=line
- UI/test code changed: no
- Audit side effects: The title/start/default audit reapplied the same 12 known unrelated corrections; all unrelated generated, preview, and audit-report churn was restored before commit.

## Future-batch rules

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
- selected/default source order begins from the first selected/default section

## Later-phase requirements

- after all books are processed, run an independent second-pass audit using a different strategy
- after books and second-pass audit, add original non-spoiler 300-500+ word SEO summaries for each accepted book page
- after summaries, perform full site SEO/meta review using GSC data and route-level intent
- after books/SEO, run a focused rage-click UX pass for /audio, /practice, homepage, and related utility pages
- investigate the SSR heap OOM separately if it keeps appearing during plain npm run build
- final cleanup should remove temporary audit scripts/reports and code bloat only after everything is stable
