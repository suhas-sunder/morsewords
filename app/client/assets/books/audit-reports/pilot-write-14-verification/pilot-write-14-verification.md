# Pilot write batch 14 verification

Generated: 2026-06-19T22:24:20.267Z

## Summary

- Verified: 23
- Pass: 23
- Warn accepted: 0
- Fail: 0
- Accepted for main: 23
- Corrections applied: 0

## Shared script scope investigation

- Classification: intentional shared dry-run/write implementation with a material batch-12 cleanup follow-up documented below
- Resolution: Retain the shared implementation because it is directly used by batch 14 and fixes destructive cleanup. Do not rewrite prior scripts or modify unrelated generated books in this pass; carry the five batch-12 omissions into a separate controlled follow-up.
- Unrelated changes found: no
- Batch-12 material cleanup differences found: 5
- Batch-13 material cleanup differences found: 0
- Batch-12 follow-up: Required separately: five current batch-12 tale bodies omit lines that the corrected shared cleanup would now preserve; this batch-14 verification reports but does not modify those unrelated books.
- Batch-13 follow-up: Not required; no batch-13 tale-body line changes treatment under the narrowed cleanup rules.
- Prior-batch cleanup finding: batch 12, ole-luk-oie-the-dream-god, standalone byline cleanup, current output contains line: no; source: by he caught hold of one side of the sugar heart and held it fast, and
- Prior-batch cleanup finding: batch 12, the-story-of-the-old-man-who-made-withered-trees-to-flower, standalone byline cleanup, current output contains line: no; source: by erect with pride and looking fondly at his master as if to say, “You
- Prior-batch cleanup finding: batch 12, the-conceited-apple-branch, standalone byline cleanup, current output contains line: no; source: by Heaven with another kind of loveliness, and although they differ in
- Prior-batch cleanup finding: batch 12, little-ida-s-flowers, standalone media-line cleanup, current output contains line: no; source: music with them. Wild hyacinths and little white snowdrops jingled merry
- Prior-batch cleanup finding: batch 12, the-steadfast-tin-soldier, standalone byline cleanup, current output contains line: no; source: by grief, no one could say. He looked at the little lady, she looked at

## Corrections

- None.

## Books

### briar-rose

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/briar-rose/manifest.json, app/client/assets/books/generated/briar-rose/cleaned_book.json, app/client/assets/books/generated/briar-rose/processed_book.json, app/client/assets/books/generated/briar-rose/rights_report.json, app/client/assets/books/generated/briar-rose/processing_notes.md, app/client/assets/books/generated/briar-rose/sections/chapter-001.json
- Preview inspected: public/book-previews/briar-rose.preview.json
- Title verdict: Individual tale title preserved as Briar Rose.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Raw-vs-generated body verdict: Exact character-for-character match: no prose sentence, dialogue, punctuation, formatting, or ending text was removed from the audited tale body.
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Cleanup did not alter the tale body; collection/title/byline/source wrapper material was excluded at the start boundary and no artifact material remains.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: BRIAR ROSE
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: A king and queen once upon a time reigned in a country a great way off, where there were in those days fairies. Now this king and queen had plenty of money, and plenty of fine clothes to wear, and plenty of good thing... / A king and queen once upon a time reigned in a country a great way off, where there were in those days fairies. Now this king and queen had plenty of money, and plenty of fine clothes to wear, and plenty of good thing...
- Raw/generated end: ...the maid went on plucking the fowl; and the cook gave the boy the box on his ear. And then the prince and Briar Rose were married, and the wedding feast was given; and they lived happily together all their lives long. / ...the maid went on plucking the fowl; and the cook gave the boy the box on his ear. And then the prince and Briar Rose were married, and the wedding feast was given; and they lived happily together all their lives long.
- Preview start: A king and queen once upon a time reigned in a country a great way off, where there were in those days fairies. Now this king and queen had plenty of money, and plenty of fine clothes to wear, and plenty of good thing...

### the-blue-light

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-blue-light/manifest.json, app/client/assets/books/generated/the-blue-light/cleaned_book.json, app/client/assets/books/generated/the-blue-light/processed_book.json, app/client/assets/books/generated/the-blue-light/rights_report.json, app/client/assets/books/generated/the-blue-light/processing_notes.md, app/client/assets/books/generated/the-blue-light/sections/chapter-001.json
- Preview inspected: public/book-previews/the-blue-light.preview.json
- Title verdict: Individual tale title preserved as The Blue Light.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Raw-vs-generated body verdict: Exact character-for-character match: no prose sentence, dialogue, punctuation, formatting, or ending text was removed from the audited tale body.
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Cleanup did not alter the tale body; collection/title/byline/source wrapper material was excluded at the start boundary and no artifact material remains.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: THE BLUE LIGHT
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: There was once upon a time a soldier who for many years had served the king faithfully, but when the war came to an end could serve no longer because of the many wounds which he had received. The king said to him: ‘Yo... / There was once upon a time a soldier who for many years had served the king faithfully, but when the war came to an end could serve no longer because of the many wounds which he had received. The king said to him: ‘Yo...
- Raw/generated end: ...l fell to earth, and did not venture to stir again. The king was terrified; he threw himself on the soldier’s mercy, and merely to be allowed to live at all, gave him his kingdom for his own, and his daughter to wife. / ...l fell to earth, and did not venture to stir again. The king was terrified; he threw himself on the soldier’s mercy, and merely to be allowed to live at all, gave him his kingdom for his own, and his daughter to wife.
- Preview start: There was once upon a time a soldier who for many years had served the king faithfully, but when the war came to an end could serve no longer because of the many wounds which he had received. The king said to him: ‘Yo...

### the-elves-and-the-shoemaker

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-elves-and-the-shoemaker/manifest.json, app/client/assets/books/generated/the-elves-and-the-shoemaker/cleaned_book.json, app/client/assets/books/generated/the-elves-and-the-shoemaker/processed_book.json, app/client/assets/books/generated/the-elves-and-the-shoemaker/rights_report.json, app/client/assets/books/generated/the-elves-and-the-shoemaker/processing_notes.md, app/client/assets/books/generated/the-elves-and-the-shoemaker/sections/chapter-001.json
- Preview inspected: public/book-previews/the-elves-and-the-shoemaker.preview.json
- Title verdict: Individual tale title preserved as The Elves and the Shoemaker.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Raw-vs-generated body verdict: Exact character-for-character match: no prose sentence, dialogue, punctuation, formatting, or ending text was removed from the audited tale body.
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Cleanup did not alter the tale body; collection/title/byline/source wrapper material was excluded at the start boundary and no artifact material remains.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: THE ELVES AND THE SHOEMAKER
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: There was once a shoemaker, who worked very hard and was very honest: but still he could not earn enough to live upon; and at last all he had in the world was gone, save just leather enough to make one pair of shoes. ... / There was once a shoemaker, who worked very hard and was very honest: but still he could not earn enough to live upon; and at last all he had in the world was gone, save just leather enough to make one pair of shoes. ...
- Raw/generated end: ...prang about, as merry as could be; till at last they danced out at the door, and away over the green. The good couple saw them no more; but everything went well with them from that time forward, as long as they lived. / ...prang about, as merry as could be; till at last they danced out at the door, and away over the green. The good couple saw them no more; but everything went well with them from that time forward, as long as they lived.
- Preview start: There was once a shoemaker, who worked very hard and was very honest: but still he could not earn enough to live upon; and at last all he had in the world was gone, save just leather enough to make one pair of shoes. ...

### the-four-clever-brothers

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-four-clever-brothers/manifest.json, app/client/assets/books/generated/the-four-clever-brothers/cleaned_book.json, app/client/assets/books/generated/the-four-clever-brothers/processed_book.json, app/client/assets/books/generated/the-four-clever-brothers/rights_report.json, app/client/assets/books/generated/the-four-clever-brothers/processing_notes.md, app/client/assets/books/generated/the-four-clever-brothers/sections/chapter-001.json
- Preview inspected: public/book-previews/the-four-clever-brothers.preview.json
- Title verdict: Individual tale title preserved as The Four Clever Brothers.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Raw-vs-generated body verdict: Exact character-for-character match: no prose sentence, dialogue, punctuation, formatting, or ending text was removed from the audited tale body.
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Cleanup did not alter the tale body; collection/title/byline/source wrapper material was excluded at the start boundary and no artifact material remains.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: THE FOUR CLEVER BROTHERS
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: ‘Dear children,’ said a poor man to his four sons, ‘I have nothing to give you; you must go out into the wide world and try your luck. Begin by learning some craft or another, and see how you can get on.’ So the four ... / ‘Dear children,’ said a poor man to his four sons, ‘I have nothing to give you; you must go out into the wide world and try your luck. Begin by learning some craft or another, and see how you can get on.’ So the four ...
- Raw/generated end: ... had said; and they lived very happily the rest of their days, and took good care of their father; and somebody took better care of the young lady, than to let either the dragon or one of the craftsmen have her again. / ... had said; and they lived very happily the rest of their days, and took good care of their father; and somebody took better care of the young lady, than to let either the dragon or one of the craftsmen have her again.
- Preview start: ‘Dear children,’ said a poor man to his four sons, ‘I have nothing to give you; you must go out into the wide world and try your luck. Begin by learning some craft or another, and see how you can get on.’ So the four ...

### the-fox-and-the-cat

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-fox-and-the-cat/manifest.json, app/client/assets/books/generated/the-fox-and-the-cat/cleaned_book.json, app/client/assets/books/generated/the-fox-and-the-cat/processed_book.json, app/client/assets/books/generated/the-fox-and-the-cat/rights_report.json, app/client/assets/books/generated/the-fox-and-the-cat/processing_notes.md, app/client/assets/books/generated/the-fox-and-the-cat/sections/chapter-001.json
- Preview inspected: public/book-previews/the-fox-and-the-cat.preview.json
- Title verdict: Individual tale title preserved as The Fox and the Cat.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Raw-vs-generated body verdict: Exact character-for-character match: no prose sentence, dialogue, punctuation, formatting, or ending text was removed from the audited tale body.
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Cleanup did not alter the tale body; collection/title/byline/source wrapper material was excluded at the start boundary and no artifact material remains.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: THE FOX AND THE CAT
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: It happened that the cat met the fox in a forest, and as she thought to herself: ‘He is clever and full of experience, and much esteemed in the world,’ she spoke to him in a friendly way. ‘Good day, dear Mr Fox, how a... / It happened that the cat met the fox in a forest, and as she thought to herself: ‘He is clever and full of experience, and much esteemed in the world,’ she spoke to him in a friendly way. ‘Good day, dear Mr Fox, how a...
- Raw/generated end: ..., but the dogs had already seized him, and were holding him fast. ‘Ah, Mr Fox,’ cried the cat. ‘You with your hundred arts are left in the lurch! Had you been able to climb like me, you would not have lost your life.’ / ..., but the dogs had already seized him, and were holding him fast. ‘Ah, Mr Fox,’ cried the cat. ‘You with your hundred arts are left in the lurch! Had you been able to climb like me, you would not have lost your life.’
- Preview start: It happened that the cat met the fox in a forest, and as she thought to herself: ‘He is clever and full of experience, and much esteemed in the world,’ she spoke to him in a friendly way. ‘Good day, dear Mr Fox, how a...

### the-fox-and-the-horse

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-fox-and-the-horse/manifest.json, app/client/assets/books/generated/the-fox-and-the-horse/cleaned_book.json, app/client/assets/books/generated/the-fox-and-the-horse/processed_book.json, app/client/assets/books/generated/the-fox-and-the-horse/rights_report.json, app/client/assets/books/generated/the-fox-and-the-horse/processing_notes.md, app/client/assets/books/generated/the-fox-and-the-horse/sections/chapter-001.json
- Preview inspected: public/book-previews/the-fox-and-the-horse.preview.json
- Title verdict: Individual tale title preserved as The Fox and the Horse.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Raw-vs-generated body verdict: Exact character-for-character match: no prose sentence, dialogue, punctuation, formatting, or ending text was removed from the audited tale body.
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Cleanup did not alter the tale body; collection/title/byline/source wrapper material was excluded at the start boundary and no artifact material remains.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: THE FOX AND THE HORSE
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: A farmer had a horse that had been an excellent faithful servant to him: but he was now grown too old to work; so the farmer would give him nothing more to eat, and said, ‘I want you no longer, so take yourself off ou... / A farmer had a horse that had been an excellent faithful servant to him: but he was now grown too old to work; so the farmer would give him nothing more to eat, and said, ‘I want you no longer, so take yourself off ou...
- Raw/generated end: ...etter of him’: and when the farmer saw his old servant, his heart relented, and he said. ‘Thou shalt stay in thy stable and be well taken care of.’ And so the poor old horse had plenty to eat, and lived--till he died. / ...etter of him’: and when the farmer saw his old servant, his heart relented, and he said. ‘Thou shalt stay in thy stable and be well taken care of.’ And so the poor old horse had plenty to eat, and lived--till he died.
- Preview start: A farmer had a horse that had been an excellent faithful servant to him: but he was now grown too old to work; so the farmer would give him nothing more to eat, and said, ‘I want you no longer, so take yourself off ou...

### the-frog-prince

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-frog-prince/manifest.json, app/client/assets/books/generated/the-frog-prince/cleaned_book.json, app/client/assets/books/generated/the-frog-prince/processed_book.json, app/client/assets/books/generated/the-frog-prince/rights_report.json, app/client/assets/books/generated/the-frog-prince/processing_notes.md, app/client/assets/books/generated/the-frog-prince/sections/chapter-001.json
- Preview inspected: public/book-previews/the-frog-prince.preview.json
- Title verdict: Individual tale title preserved as The Frog-Prince.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Raw-vs-generated body verdict: Exact character-for-character match: no prose sentence, dialogue, punctuation, formatting, or ending text was removed from the audited tale body.
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Cleanup did not alter the tale body; collection/title/byline/source wrapper material was excluded at the start boundary and no artifact material remains.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: THE FROG-PRINCE
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: One fine evening a young princess put on her bonnet and clogs, and went out to take a walk by herself in a wood; and when she came to a cool spring of water, that rose in the midst of it, she sat herself down to rest ... / One fine evening a young princess put on her bonnet and clogs, and went out to take a walk by herself in a wood; and when she came to a cool spring of water, that rose in the midst of it, she sat herself down to rest ...
- Raw/generated end: ... then took leave of the king, and got into the coach with eight horses, and all set out, full of joy and merriment, for the prince’s kingdom, which they reached safely; and there they lived happily a great many years. / ... then took leave of the king, and got into the coach with eight horses, and all set out, full of joy and merriment, for the prince’s kingdom, which they reached safely; and there they lived happily a great many years.
- Preview start: One fine evening a young princess put on her bonnet and clogs, and went out to take a walk by herself in a wood; and when she came to a cool spring of water, that rose in the midst of it, she sat herself down to rest ...

### the-golden-bird

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-golden-bird/manifest.json, app/client/assets/books/generated/the-golden-bird/cleaned_book.json, app/client/assets/books/generated/the-golden-bird/processed_book.json, app/client/assets/books/generated/the-golden-bird/rights_report.json, app/client/assets/books/generated/the-golden-bird/processing_notes.md, app/client/assets/books/generated/the-golden-bird/sections/chapter-001.json
- Preview inspected: public/book-previews/the-golden-bird.preview.json
- Title verdict: Individual tale title preserved as The Golden Bird.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Raw-vs-generated body verdict: Exact character-for-character match: no prose sentence, dialogue, punctuation, formatting, or ending text was removed from the audited tale body.
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Cleanup did not alter the tale body; collection/title/byline/source wrapper material was excluded at the start boundary and no artifact material remains.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: THE GOLDEN BIRD
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: A certain king had a beautiful garden, and in the garden stood a tree which bore golden apples. These apples were always counted, and about the time when they began to grow ripe it was found that every night one of th... / A certain king had a beautiful garden, and in the garden stood a tree which bore golden apples. These apples were always counted, and about the time when they began to grow ripe it was found that every night one of th...
- Raw/generated end: ... his eyes to kill him, and cut off his head and feet. And at last he did so, and in a moment the fox was changed into a man, and turned out to be the brother of the princess, who had been lost a great many many years. / ... his eyes to kill him, and cut off his head and feet. And at last he did so, and in a moment the fox was changed into a man, and turned out to be the brother of the princess, who had been lost a great many many years.
- Preview start: A certain king had a beautiful garden, and in the garden stood a tree which bore golden apples. These apples were always counted, and about the time when they began to grow ripe it was found that every night one of th...

### the-goose-girl

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-goose-girl/manifest.json, app/client/assets/books/generated/the-goose-girl/cleaned_book.json, app/client/assets/books/generated/the-goose-girl/processed_book.json, app/client/assets/books/generated/the-goose-girl/rights_report.json, app/client/assets/books/generated/the-goose-girl/processing_notes.md, app/client/assets/books/generated/the-goose-girl/sections/chapter-001.json
- Preview inspected: public/book-previews/the-goose-girl.preview.json
- Title verdict: Individual tale title preserved as The Goose-Girl.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Raw-vs-generated body verdict: Exact character-for-character match: no prose sentence, dialogue, punctuation, formatting, or ending text was removed from the audited tale body.
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Cleanup did not alter the tale body; collection/title/byline/source wrapper material was excluded at the start boundary and no artifact material remains.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: THE GOOSE-GIRL
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: The king of a great land died, and left his queen to take care of their only child. This child was a daughter, who was very beautiful; and her mother loved her dearly, and was very kind to her. And there was a good fa... / The king of a great land died, and left his queen to take care of their only child. This child was a daughter, who was very beautiful; and her mother loved her dearly, and was very kind to her. And there was a good fa...
- Raw/generated end: ...ee.’ And the young king was then married to his true wife, and they reigned over the kingdom in peace and happiness all their lives; and the good fairy came to see them, and restored the faithful Falada to life again. / ...ee.’ And the young king was then married to his true wife, and they reigned over the kingdom in peace and happiness all their lives; and the good fairy came to see them, and restored the faithful Falada to life again.
- Preview start: The king of a great land died, and left his queen to take care of their only child. This child was a daughter, who was very beautiful; and her mother loved her dearly, and was very kind to her. And there was a good fa...

### the-king-of-the-golden-mountain

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-king-of-the-golden-mountain/manifest.json, app/client/assets/books/generated/the-king-of-the-golden-mountain/cleaned_book.json, app/client/assets/books/generated/the-king-of-the-golden-mountain/processed_book.json, app/client/assets/books/generated/the-king-of-the-golden-mountain/rights_report.json, app/client/assets/books/generated/the-king-of-the-golden-mountain/processing_notes.md, app/client/assets/books/generated/the-king-of-the-golden-mountain/sections/chapter-001.json
- Preview inspected: public/book-previews/the-king-of-the-golden-mountain.preview.json
- Title verdict: Individual tale title preserved as The King of the Golden Mountain.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Raw-vs-generated body verdict: Exact character-for-character match: no prose sentence, dialogue, punctuation, formatting, or ending text was removed from the audited tale body.
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Cleanup did not alter the tale body; collection/title/byline/source wrapper material was excluded at the start boundary and no artifact material remains.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: THE KING OF THE GOLDEN MOUNTAIN
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: There was once a merchant who had only one child, a son, that was very young, and barely able to run alone. He had two richly laden ships then making a voyage upon the seas, in which he had embarked all his wealth, in... / There was once a merchant who had only one child, a son, that was very young, and barely able to run alone. He had two richly laden ships then making a voyage upon the seas, in which he had embarked all his wealth, in...
- Raw/generated end: ...eace or not. Then they turned upon him and tried to seize him; but he drew his sword. ‘Heads Off!’ cried he; and with the word the traitors’ heads fell before him, and Heinel was once more king of the Golden Mountain. / ...eace or not. Then they turned upon him and tried to seize him; but he drew his sword. ‘Heads Off!’ cried he; and with the word the traitors’ heads fell before him, and Heinel was once more king of the Golden Mountain.
- Preview start: There was once a merchant who had only one child, a son, that was very young, and barely able to run alone. He had two richly laden ships then making a voyage upon the seas, in which he had embarked all his wealth, in...

### the-little-peasant

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-little-peasant/manifest.json, app/client/assets/books/generated/the-little-peasant/cleaned_book.json, app/client/assets/books/generated/the-little-peasant/processed_book.json, app/client/assets/books/generated/the-little-peasant/rights_report.json, app/client/assets/books/generated/the-little-peasant/processing_notes.md, app/client/assets/books/generated/the-little-peasant/sections/chapter-001.json
- Preview inspected: public/book-previews/the-little-peasant.preview.json
- Title verdict: Individual tale title preserved as The Little Peasant.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Raw-vs-generated body verdict: Exact character-for-character match: no prose sentence, dialogue, punctuation, formatting, or ending text was removed from the audited tale body.
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Cleanup did not alter the tale body; collection/title/byline/source wrapper material was excluded at the start boundary and no artifact material remains.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: THE LITTLE PEASANT
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: There was a certain village wherein no one lived but really rich peasants, and just one poor one, whom they called the little peasant. He had not even so much as a cow, and still less money to buy one, and yet he and ... / There was a certain village wherein no one lived but really rich peasants, and just one poor one, whom they called the little peasant. He had not even so much as a cow, and still less money to buy one, and yet he and ...
- Raw/generated end: ... jumped in; splash! went the water; it sounded as if he were calling them, and the whole crowd plunged in after him as one man. Then the entire village was dead, and the small peasant, as sole heir, became a rich man. / ... jumped in; splash! went the water; it sounded as if he were calling them, and the whole crowd plunged in after him as one man. Then the entire village was dead, and the small peasant, as sole heir, became a rich man.
- Preview start: There was a certain village wherein no one lived but really rich peasants, and just one poor one, whom they called the little peasant. He had not even so much as a cow, and still less money to buy one, and yet he and ...

### the-miser-in-the-bush

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-miser-in-the-bush/manifest.json, app/client/assets/books/generated/the-miser-in-the-bush/cleaned_book.json, app/client/assets/books/generated/the-miser-in-the-bush/processed_book.json, app/client/assets/books/generated/the-miser-in-the-bush/rights_report.json, app/client/assets/books/generated/the-miser-in-the-bush/processing_notes.md, app/client/assets/books/generated/the-miser-in-the-bush/sections/chapter-001.json
- Preview inspected: public/book-previews/the-miser-in-the-bush.preview.json
- Title verdict: Individual tale title preserved as The Miser in the Bush.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Raw-vs-generated body verdict: Exact character-for-character match: no prose sentence, dialogue, punctuation, formatting, or ending text was removed from the audited tale body.
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Cleanup did not alter the tale body; collection/title/byline/source wrapper material was excluded at the start boundary and no artifact material remains.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: THE MISER IN THE BUSH
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: A farmer had a faithful and diligent servant, who had worked hard for him three years, without having been paid any wages. At last it came into the man’s head that he would not go on thus without pay any longer; so he... / A farmer had a faithful and diligent servant, who had worked hard for him three years, without having been paid any wages. At last it came into the man’s head that he would not go on thus without pay any longer; so he...
- Raw/generated end: ...stole it,’ said the miser in the presence of all the people; ‘I acknowledge that I stole it, and that you earned it fairly.’ Then the countryman stopped his fiddle, and left the miser to take his place at the gallows. / ...stole it,’ said the miser in the presence of all the people; ‘I acknowledge that I stole it, and that you earned it fairly.’ Then the countryman stopped his fiddle, and left the miser to take his place at the gallows.
- Preview start: A farmer had a faithful and diligent servant, who had worked hard for him three years, without having been paid any wages. At last it came into the man’s head that he would not go on thus without pay any longer; so he...

### the-mouse-the-bird-and-the-sausage

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-mouse-the-bird-and-the-sausage/manifest.json, app/client/assets/books/generated/the-mouse-the-bird-and-the-sausage/cleaned_book.json, app/client/assets/books/generated/the-mouse-the-bird-and-the-sausage/processed_book.json, app/client/assets/books/generated/the-mouse-the-bird-and-the-sausage/rights_report.json, app/client/assets/books/generated/the-mouse-the-bird-and-the-sausage/processing_notes.md, app/client/assets/books/generated/the-mouse-the-bird-and-the-sausage/sections/chapter-001.json
- Preview inspected: public/book-previews/the-mouse-the-bird-and-the-sausage.preview.json
- Title verdict: Individual tale title preserved as The Mouse, the Bird, and the Sausage.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Raw-vs-generated body verdict: Exact character-for-character match: no prose sentence, dialogue, punctuation, formatting, or ending text was removed from the audited tale body.
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Cleanup did not alter the tale body; collection/title/byline/source wrapper material was excluded at the start boundary and no artifact material remains.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: THE MOUSE, THE BIRD, AND THE SAUSAGE
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: Once upon a time, a mouse, a bird, and a sausage, entered into partnership and set up house together. For a long time all went well; they lived in great comfort, and prospered so far as to be able to add considerably ... / Once upon a time, a mouse, a bird, and a sausage, entered into partnership and set up house together. For a long time all went well; they lived in great comfort, and prospered so far as to be able to add considerably ...
- Raw/generated end: ...d that had been carelessly thrown down, caught fire and began to blaze. The bird hastened to fetch some water, but his pail fell into the well, and he after it, and as he was unable to recover himself, he was drowned. / ...d that had been carelessly thrown down, caught fire and began to blaze. The bird hastened to fetch some water, but his pail fell into the well, and he after it, and as he was unable to recover himself, he was drowned.
- Preview start: Once upon a time, a mouse, a bird, and a sausage, entered into partnership and set up house together. For a long time all went well; they lived in great comfort, and prospered so far as to be able to add considerably ...

### the-old-man-and-his-grandson

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-old-man-and-his-grandson/manifest.json, app/client/assets/books/generated/the-old-man-and-his-grandson/cleaned_book.json, app/client/assets/books/generated/the-old-man-and-his-grandson/processed_book.json, app/client/assets/books/generated/the-old-man-and-his-grandson/rights_report.json, app/client/assets/books/generated/the-old-man-and-his-grandson/processing_notes.md, app/client/assets/books/generated/the-old-man-and-his-grandson/sections/chapter-001.json
- Preview inspected: public/book-previews/the-old-man-and-his-grandson.preview.json
- Title verdict: Individual tale title preserved as The Old Man and His Grandson.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Raw-vs-generated body verdict: Exact character-for-character match: no prose sentence, dialogue, punctuation, formatting, or ending text was removed from the audited tale body.
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Cleanup did not alter the tale body; collection/title/byline/source wrapper material was excluded at the start boundary and no artifact material remains.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: THE OLD MAN AND HIS GRANDSON
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: There was once a very old man, whose eyes had become dim, his ears dull of hearing, his knees trembled, and when he sat at table he could hardly hold the spoon, and spilt the broth upon the table-cloth or let it run o... / There was once a very old man, whose eyes had become dim, his ears dull of hearing, his knees trembled, and when he sat at table he could hardly hold the spoon, and spilt the broth upon the table-cloth or let it run o...
- Raw/generated end: ...oked at each other for a while, and presently began to cry. Then they took the old grandfather to the table, and henceforth always let him eat with them, and likewise said nothing if he did spill a little of anything. / ...oked at each other for a while, and presently began to cry. Then they took the old grandfather to the table, and henceforth always let him eat with them, and likewise said nothing if he did spill a little of anything.
- Preview start: There was once a very old man, whose eyes had become dim, his ears dull of hearing, his knees trembled, and when he sat at table he could hardly hold the spoon, and spilt the broth upon the table-cloth or let it run o...

### the-pink

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-pink/manifest.json, app/client/assets/books/generated/the-pink/cleaned_book.json, app/client/assets/books/generated/the-pink/processed_book.json, app/client/assets/books/generated/the-pink/rights_report.json, app/client/assets/books/generated/the-pink/processing_notes.md, app/client/assets/books/generated/the-pink/sections/chapter-001.json
- Preview inspected: public/book-previews/the-pink.preview.json
- Title verdict: Individual tale title preserved as The Pink.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Raw-vs-generated body verdict: Exact character-for-character match: no prose sentence, dialogue, punctuation, formatting, or ending text was removed from the audited tale body.
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Cleanup did not alter the tale body; collection/title/byline/source wrapper material was excluded at the start boundary and no artifact material remains.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: THE PINK
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: There was once upon a time a queen to whom God had given no children. Every morning she went into the garden and prayed to God in heaven to bestow on her a son or a daughter. Then an angel from heaven came to her and ... / There was once upon a time a queen to whom God had given no children. Every morning she went into the garden and prayed to God in heaven to bestow on her a son or a daughter. Then an angel from heaven came to her and ...
- Raw/generated end: ...pieces, but grief consumed the king’s own heart, and he soon died. His son married the beautiful maiden whom he had brought with him as a flower in his pocket, and whether they are still alive or not, is known to God. / ...pieces, but grief consumed the king’s own heart, and he soon died. His son married the beautiful maiden whom he had brought with him as a flower in his pocket, and whether they are still alive or not, is known to God.
- Preview start: There was once upon a time a queen to whom God had given no children. Every morning she went into the garden and prayed to God in heaven to bestow on her a son or a daughter. Then an angel from heaven came to her and ...

### the-queen-bee

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-queen-bee/manifest.json, app/client/assets/books/generated/the-queen-bee/cleaned_book.json, app/client/assets/books/generated/the-queen-bee/processed_book.json, app/client/assets/books/generated/the-queen-bee/rights_report.json, app/client/assets/books/generated/the-queen-bee/processing_notes.md, app/client/assets/books/generated/the-queen-bee/sections/chapter-001.json
- Preview inspected: public/book-previews/the-queen-bee.preview.json
- Title verdict: Individual tale title preserved as The Queen Bee.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Raw-vs-generated body verdict: Exact character-for-character match: no prose sentence, dialogue, punctuation, formatting, or ending text was removed from the audited tale body.
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Cleanup did not alter the tale body; collection/title/byline/source wrapper material was excluded at the start boundary and no artifact material remains.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: THE QUEEN BEE
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: Two kings’ sons once upon a time went into the world to seek their fortunes; but they soon fell into a wasteful foolish way of living, so that they could not return home again. Then their brother, who was a little ins... / Two kings’ sons once upon a time went into the world to seek their fortunes; but they soon fell into a wasteful foolish way of living, so that they could not return home again. Then their brother, who was a little ins...
- Raw/generated end: ...been turned into stones awoke, and took their proper forms. And the dwarf married the youngest and the best of the princesses, and was king after her father’s death; but his two brothers married the other two sisters. / ...been turned into stones awoke, and took their proper forms. And the dwarf married the youngest and the best of the princesses, and was king after her father’s death; but his two brothers married the other two sisters.
- Preview start: Two kings’ sons once upon a time went into the world to seek their fortunes; but they soon fell into a wasteful foolish way of living, so that they could not return home again. Then their brother, who was a little ins...

### the-raven

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-raven/manifest.json, app/client/assets/books/generated/the-raven/cleaned_book.json, app/client/assets/books/generated/the-raven/processed_book.json, app/client/assets/books/generated/the-raven/rights_report.json, app/client/assets/books/generated/the-raven/processing_notes.md, app/client/assets/books/generated/the-raven/sections/chapter-001.json
- Preview inspected: public/book-previews/the-raven.preview.json
- Title verdict: Individual tale title preserved as The Raven.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Raw-vs-generated body verdict: Exact character-for-character match: no prose sentence, dialogue, punctuation, formatting, or ending text was removed from the audited tale body.
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Cleanup did not alter the tale body; collection/title/byline/source wrapper material was excluded at the start boundary and no artifact material remains.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: THE RAVEN
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: There was once a queen who had a little daughter, still too young to run alone. One day the child was very troublesome, and the mother could not quiet it, do what she would. She grew impatient, and seeing the ravens f... / There was once a queen who had a little daughter, still too young to run alone. One day the child was very troublesome, and the mother could not quiet it, do what she would. She grew impatient, and seeing the ravens f...
- Raw/generated end: ... came to the castle gate she saw him, and cried aloud for joy. Then he dismounted and took her in his arms; and she kissed him, and said, ‘Now you have indeed set me free, and tomorrow we will celebrate our marriage.’ / ... came to the castle gate she saw him, and cried aloud for joy. Then he dismounted and took her in his arms; and she kissed him, and said, ‘Now you have indeed set me free, and tomorrow we will celebrate our marriage.’
- Preview start: There was once a queen who had a little daughter, still too young to run alone. One day the child was very troublesome, and the mother could not quiet it, do what she would. She grew impatient, and seeing the ravens f...

### the-robber-bridegroom

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-robber-bridegroom/manifest.json, app/client/assets/books/generated/the-robber-bridegroom/cleaned_book.json, app/client/assets/books/generated/the-robber-bridegroom/processed_book.json, app/client/assets/books/generated/the-robber-bridegroom/rights_report.json, app/client/assets/books/generated/the-robber-bridegroom/processing_notes.md, app/client/assets/books/generated/the-robber-bridegroom/sections/chapter-001.json
- Preview inspected: public/book-previews/the-robber-bridegroom.preview.json
- Title verdict: Individual tale title preserved as The Robber Bridegroom.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Raw-vs-generated body verdict: Exact character-for-character match: no prose sentence, dialogue, punctuation, formatting, or ending text was removed from the audited tale body.
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Cleanup did not alter the tale body; collection/title/byline/source wrapper material was excluded at the start boundary and no artifact material remains.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: THE ROBBER BRIDEGROOM
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: There was once a miller who had one beautiful daughter, and as she was grown up, he was anxious that she should be well married and provided for. He said to himself, ‘I will give her to the first suitable man who come... / There was once a miller who had one beautiful daughter, and as she was grown up, he was anxious that she should be well married and provided for. He said to himself, ‘I will give her to the first suitable man who come...
- Raw/generated end: ...s recital had grown deadly pale, up and tried to escape, but the guests seized him and held him fast. They delivered him up to justice, and he and all his murderous band were condemned to death for their wicked deeds. / ...s recital had grown deadly pale, up and tried to escape, but the guests seized him and held him fast. They delivered him up to justice, and he and all his murderous band were condemned to death for their wicked deeds.
- Preview start: There was once a miller who had one beautiful daughter, and as she was grown up, he was anxious that she should be well married and provided for. He said to himself, ‘I will give her to the first suitable man who come...

### the-salad

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-salad/manifest.json, app/client/assets/books/generated/the-salad/cleaned_book.json, app/client/assets/books/generated/the-salad/processed_book.json, app/client/assets/books/generated/the-salad/rights_report.json, app/client/assets/books/generated/the-salad/processing_notes.md, app/client/assets/books/generated/the-salad/sections/chapter-001.json
- Preview inspected: public/book-previews/the-salad.preview.json
- Title verdict: Individual tale title preserved as The Salad.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Raw-vs-generated body verdict: Exact character-for-character match: no prose sentence, dialogue, punctuation, formatting, or ending text was removed from the audited tale body.
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Cleanup did not alter the tale body; collection/title/byline/source wrapper material was excluded at the start boundary and no artifact material remains.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: THE SALAD
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: As a merry young huntsman was once going briskly along through a wood, there came up a little old woman, and said to him, ‘Good day, good day; you seem merry enough, but I am hungry and thirsty; do pray give me someth... / As a merry young huntsman was once going briskly along through a wood, there came up a little old woman, and said to him, ‘Good day, good day; you seem merry enough, but I am hungry and thirsty; do pray give me someth...
- Raw/generated end: ...oset, and as for the bird’s heart, I will give it you too.’ But he said, ‘Keep it, it will be just the same thing, for I mean to make you my wife.’ So they were married, and lived together very happily till they died. / ...oset, and as for the bird’s heart, I will give it you too.’ But he said, ‘Keep it, it will be just the same thing, for I mean to make you my wife.’ So they were married, and lived together very happily till they died.
- Preview start: As a merry young huntsman was once going briskly along through a wood, there came up a little old woman, and said to him, ‘Good day, good day; you seem merry enough, but I am hungry and thirsty; do pray give me someth...

### the-story-of-the-youth-who-went-forth-to-learn-what-fear-was

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-story-of-the-youth-who-went-forth-to-learn-what-fear-was/manifest.json, app/client/assets/books/generated/the-story-of-the-youth-who-went-forth-to-learn-what-fear-was/cleaned_book.json, app/client/assets/books/generated/the-story-of-the-youth-who-went-forth-to-learn-what-fear-was/processed_book.json, app/client/assets/books/generated/the-story-of-the-youth-who-went-forth-to-learn-what-fear-was/rights_report.json, app/client/assets/books/generated/the-story-of-the-youth-who-went-forth-to-learn-what-fear-was/processing_notes.md, app/client/assets/books/generated/the-story-of-the-youth-who-went-forth-to-learn-what-fear-was/sections/chapter-001.json
- Preview inspected: public/book-previews/the-story-of-the-youth-who-went-forth-to-learn-what-fear-was.preview.json
- Title verdict: Individual tale title preserved as The Story of the Youth Who Went Forth to Learn What Fear Was.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Raw-vs-generated body verdict: Exact character-for-character match: no prose sentence, dialogue, punctuation, formatting, or ending text was removed from the audited tale body.
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Cleanup did not alter the tale body; collection/title/byline/source wrapper material was excluded at the start boundary and no artifact material remains.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: THE STORY OF THE YOUTH WHO WENT FORTH TO LEARN WHAT FEAR WAS
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: A certain father had two sons, the elder of who was smart and sensible, and could do everything, but the younger was stupid and could neither learn nor understand anything, and when people saw him they said: ‘There’s ... / A certain father had two sons, the elder of who was smart and sensible, and could do everything, but the younger was stupid and could neither learn nor understand anything, and when people saw him they said: ‘There’s ...
- Raw/generated end: ...ith the gudgeons in it over him, so that the little fishes would sprawl about him. Then he woke up and cried: ‘Oh, what makes me shudder so?--what makes me shudder so, dear wife? Ah! now I know what it is to shudder!’ / ...ith the gudgeons in it over him, so that the little fishes would sprawl about him. Then he woke up and cried: ‘Oh, what makes me shudder so?--what makes me shudder so, dear wife? Ah! now I know what it is to shudder!’
- Preview start: A certain father had two sons, the elder of who was smart and sensible, and could do everything, but the younger was stupid and could neither learn nor understand anything, and when people saw him they said: ‘There’s ...

### the-straw-the-coal-and-the-bean

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-straw-the-coal-and-the-bean/manifest.json, app/client/assets/books/generated/the-straw-the-coal-and-the-bean/cleaned_book.json, app/client/assets/books/generated/the-straw-the-coal-and-the-bean/processed_book.json, app/client/assets/books/generated/the-straw-the-coal-and-the-bean/rights_report.json, app/client/assets/books/generated/the-straw-the-coal-and-the-bean/processing_notes.md, app/client/assets/books/generated/the-straw-the-coal-and-the-bean/sections/chapter-001.json
- Preview inspected: public/book-previews/the-straw-the-coal-and-the-bean.preview.json
- Title verdict: Individual tale title preserved as The Straw, the Coal, and the Bean.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Raw-vs-generated body verdict: Exact character-for-character match: no prose sentence, dialogue, punctuation, formatting, or ending text was removed from the audited tale body.
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Cleanup did not alter the tale body; collection/title/byline/source wrapper material was excluded at the start boundary and no artifact material remains.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: THE STRAW, THE COAL, AND THE BEAN
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: In a village dwelt a poor old woman, who had gathered together a dish of beans and wanted to cook them. So she made a fire on her hearth, and that it might burn the quicker, she lighted it with a handful of straw. Whe... / In a village dwelt a poor old woman, who had gathered together a dish of beans and wanted to cook them. So she made a fire on her hearth, and that it might burn the quicker, she lighted it with a handful of straw. Whe...
- Raw/generated end: ... the brook. As he had a compassionate heart he pulled out his needle and thread, and sewed her together. The bean thanked him most prettily, but as the tailor used black thread, all beans since then have a black seam. / ... the brook. As he had a compassionate heart he pulled out his needle and thread, and sewed her together. The bean thanked him most prettily, but as the tailor used black thread, all beans since then have a black seam.
- Preview start: In a village dwelt a poor old woman, who had gathered together a dish of beans and wanted to cook them. So she made a fire on her hearth, and that it might burn the quicker, she lighted it with a handful of straw. Whe...

### the-three-languages

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-three-languages/manifest.json, app/client/assets/books/generated/the-three-languages/cleaned_book.json, app/client/assets/books/generated/the-three-languages/processed_book.json, app/client/assets/books/generated/the-three-languages/rights_report.json, app/client/assets/books/generated/the-three-languages/processing_notes.md, app/client/assets/books/generated/the-three-languages/sections/chapter-001.json
- Preview inspected: public/book-previews/the-three-languages.preview.json
- Title verdict: Individual tale title preserved as The Three Languages.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Raw-vs-generated body verdict: Exact character-for-character match: no prose sentence, dialogue, punctuation, formatting, or ending text was removed from the audited tale body.
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Cleanup did not alter the tale body; collection/title/byline/source wrapper material was excluded at the start boundary and no artifact material remains.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: THE THREE LANGUAGES
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: An aged count once lived in Switzerland, who had an only son, but he was stupid, and could learn nothing. Then said the father: ‘Hark you, my son, try as I will I can get nothing into your head. You must go from hence... / An aged count once lived in Switzerland, who had an only son, but he was stupid, and could learn nothing. Then said the father: ‘Hark you, my son, try as I will I can get nothing into your head. You must go from hence...
- Raw/generated end: ...his way, which had so affected him, that he was to be his Holiness the Pope. Then he had to sing a mass, and did not know one word of it, but the two doves sat continually on his shoulders, and said it all in his ear. / ...his way, which had so affected him, that he was to be his Holiness the Pope. Then he had to sing a mass, and did not know one word of it, but the two doves sat continually on his shoulders, and said it all in his ear.
- Preview start: An aged count once lived in Switzerland, who had an only son, but he was stupid, and could learn nothing. Then said the father: ‘Hark you, my son, try as I will I can get nothing into your head. You must go from hence...

### the-travelling-musicians

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-travelling-musicians/manifest.json, app/client/assets/books/generated/the-travelling-musicians/cleaned_book.json, app/client/assets/books/generated/the-travelling-musicians/processed_book.json, app/client/assets/books/generated/the-travelling-musicians/rights_report.json, app/client/assets/books/generated/the-travelling-musicians/processing_notes.md, app/client/assets/books/generated/the-travelling-musicians/sections/chapter-001.json
- Preview inspected: public/book-previews/the-travelling-musicians.preview.json
- Title verdict: Individual tale title preserved as The Travelling Musicians.
- Author/compiler/collector/translator verdict: Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries.
- Structural convention: one contiguous individual-tale section; the source has no meaningful internal subdivisions
- Raw-vs-generated body verdict: Exact character-for-character match: no prose sentence, dialogue, punctuation, formatting, or ending text was removed from the audited tale body.
- Start verdict: True first prose and complete first paragraph are preserved.
- End verdict: Generated text continues through the exact cleaned-source ending.
- Sectioning verdict: Single-section output matches the undivided source tale and is included by default.
- Cleanup verdict: Cleanup did not alter the tale body; collection/title/byline/source wrapper material was excluded at the start boundary and no artifact material remains.
- Preview verdict: Book-specific preview begins at the actual tale opening and contains no fallback text.
- All-main-readable-default verdict: The complete tale is the first and only selected/default section.
- Startup preview valid: yes
- Remaining warnings: none
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Title evidence: THE TRAVELLING MUSICIANS
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw/generated start: An honest farmer had once an ass that had been a faithful servant to him a great many years, but was now growing old and every day more and more unfit for work. His master therefore was tired of keeping him and began ... / An honest farmer had once an ass that had been a faithful servant to him a great many years, but was now growing old and every day more and more unfit for work. His master therefore was tired of keeping him and began ...
- Raw/generated end: ...rascal up here!’ After this the robbers never dared to go back to the house; but the musicians were so pleased with their quarters that they took up their abode there; and there they are, I dare say, at this very day. / ...rascal up here!’ After this the robbers never dared to go back to the house; but the musicians were so pleased with their quarters that they took up their abode there; and there they are, I dare say, at this very day.
- Preview start: An honest farmer had once an ass that had been a faithful servant to him a great many years, but was now growing old and every day more and more unfit for work. His master therefore was tired of keeping him and began ...

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
- no real prose removed by cleanup

## Later-phase requirements

- after all books are processed, run an independent second-pass audit using a different strategy
- after books and second-pass audit, add original non-spoiler 300-500+ word SEO summaries for each accepted book page
- after summaries, perform full site SEO/meta review using GSC data and route-level intent
- after books/SEO, run a focused rage-click UX pass for /audio, /practice, homepage, and related utility pages
- investigate the SSR heap OOM separately if it keeps appearing during plain npm run build
- final cleanup should remove temporary audit scripts/reports and code bloat only after everything is stable
