# Pilot Write 2 Verification

Post-write QA pass for the 14 batch-2 books. This report compares the raw source text, generated output, preview asset, pilot dry-run 2 report, and pilot write 2 report. It does not process additional books and does not modify raw source or Cloudflare export assets.

## Summary

| Book | Status | Structure | Start | End | Sectioning | Cleanup | Preview | Accepted for main | Needs correction |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| anne-of-green-gables | pass | chapter-based roman numerals | pass | pass | pass | pass | pass | yes | no |
| pointed-roofs | pass | standalone arabic-numbered sections | pass | pass | pass | pass | pass | yes | no |
| the-lost-world | pass | chapter-based roman numerals | pass | pass | pass | pass | pass | yes | no |
| the-red-thumb-mark | pass | chapter-based roman numerals | pass | pass | pass | pass | pass | yes | no |
| violet-fairy-book | pass | contents-backed story sections | pass | pass | pass | pass | pass | yes | no |
| jack-and-jill | pass | chapter-based roman numerals | pass | pass | pass | pass | pass | yes | no |
| the-wonderful-wizard-of-oz | pass | chapter-based roman numerals | pass | pass | pass | pass | pass | yes | no |
| the-legend-of-sleepy-hollow | warn | story or titled-section headings | warn | pass | warn | pass | pass | yes | no |
| four-day-planet | pass | standalone arabic-numbered sections | pass | pass | pass | pass | pass | yes | no |
| room-13 | pass | chapter-based roman numerals | pass | pass | pass | pass | pass | yes | no |
| the-octopus-a-story-of-california | warn | chapter-based roman numerals with book divisions | pass | pass | warn | pass | pass | yes | no |
| the-prince-and-the-pauper | pass | chapter-based roman numerals | pass | pass | pass | pass | pass | yes | no |
| triplanetary | pass | chapter-based roman numerals | pass | pass | pass | pass | pass | yes | no |
| the-call-of-the-wild | pass | chapter-based roman numerals | pass | pass | pass | pass | pass | yes | no |

## Special Focus

- pointed-roofs: acceptable - Pointed Roofs sectioning is acceptable for main.
- the-legend-of-sleepy-hollow: acceptable with warning - The 2-section structure is a real story/postscript split, not arbitrary fallback chunking.
- the-octopus-a-story-of-california: acceptable with warning - The Octopus preserves Book I/Book II and all 15 Roman chapters, with large but real chapter sections.
- room-13: fully corrected - Room 13 has 33 default body chapters from Chapter I through Chapter XXXIII.
- violet-fairy-book: acceptable - Violet Fairy Book story sections are acceptable.

## Corrections

- triplanetary: removed four bracketed illustration placeholders from generated playable text and rebuilt the generated/preview hashes.
- violet-fairy-book: rebuilt the collection from contents-backed story headings into 35 complete default story sections plus one non-default preface/contents section.

## anne-of-green-gables

- Status: pass
- Generated output inspected: 43 files
- Preview asset inspected: public/book-previews/anne-of-green-gables.preview.json
- Selected structural convention: chapter-based roman numerals
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: Sectioning follows the selected structural convention.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: none
- First default section: chapter-001 (Chapter 1: Mrs. Rachel Lynde Is Surprised, 2864 words)
- Last default section: chapter-038 (Chapter 38: The Bend in the Road, 2932 words)
- Raw start snippet: CHAPTER I. Mrs. Rachel Lynde Is Surprised MRS. Rachel Lynde lived just where the Avonlea main road dipped down into a little hollow, fringed with alders and ladies’ eardrops and traversed by a brook that had its source away back in the woods of the old Cuthbert place; it was reputed to be an intricate, headlong brook in its earlier course through those wood...
- Generated start snippet: CHAPTER I. Mrs. Rachel Lynde Is Surprised MRS. Rachel Lynde lived just where the Avonlea main road dipped down into a little hollow, fringed with alders and ladies' eardrops and traversed by a brook that had its source away back in the woods of the old Cuthbert place; it was reputed to be an intricate, headlong brook in its earlier course through those wood...
- Preview start snippet: CHAPTER I. Mrs. Rachel Lynde Is Surprised MRS. Rachel Lynde lived just where the Avonlea main road dipped down into a little hollow, fringed with alders and ladies' eardrops and traversed by a brook that had its source away back in the woods of the old Cuthbert place; it was reputed to be an intricate, headlong brook in its earlier course through those wood...
- Raw end snippet: Anne’s horizons had closed in since the night she had sat there after coming home from Queen’s; but if the path set before her feet was to be narrow she knew that flowers of quiet happiness would bloom along it. The joy of sincere work and worthy aspiration and congenial friendship were to be hers; nothing could rob her of her birthright of fancy or her ide...
- Generated end snippet: d enemies. But we have decided that it will be much more sensible to be good friends in the future. Were we really there half an hour? It seemed just a few minutes. But, you see, we have five years' lost conversations to catch up with, Marilla." Anne sat long at her window that night companioned by a glad content. The wind purred softly in the cherry boughs...

## pointed-roofs

- Status: pass
- Generated output inspected: 109 files
- Preview asset inspected: public/book-previews/pointed-roofs.preview.json
- Selected structural convention: standalone arabic-numbered sections
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: Pointed Roofs sectioning is acceptable for main. The opening introduction is retained as a non-default title-page section. The 103 default body sections follow the source's chapter plus standalone Arabic-numbered subdivisions. Short sections align with real source subdivision markers rather than TOC/list artifacts.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: body headings were found but rejected by the selected strategy
- First default section: chapter-001 (Section 1: Chapter I, 753 words)
- Last default section: chapter-103 (Section 13, 821 words)
- Raw start snippet: INTRODUCTION I have read "Pointed Roofs" three times. The first time it came to me with its original wardrobe, a different dress for every mood; and in some places the handwriting of the manuscript clothed the thought with the ragged urgency of haste; and in others it wore an aspect incredibly delicate and neat, as if the writer
- Generated start snippet: INTRODUCTION I have read "Pointed Roofs" three times. The first time it came to me with its original wardrobe, a different dress for every mood; and in some places the handwriting of the manuscript clothed the thought with the ragged urgency of haste; and in others it wore an aspect incredibly delicate and neat, as if the writer had caressed each word befor...
- Preview start snippet: CHAPTER I 1 Miriam left the gaslit hall and went slowly upstairs. The March twilight lay upon the landings, but the staircase was almost dark. The top landing was quite dark and silent. There was no one about. It would be quiet in her room. She could sit by the fire and be quiet and think things over until Eve and Harriett came back with the parcels. She wo...
- Raw end snippet: The platform had disappeared. _The Mayflower Press, Plymouth, England._ William Brendon & Son, Ltd.
- Generated end snippet: ell was ringing again. Fräulein standing on the top step pressed both her hands and murmured words of farewell. "Leb' wohl, mein Kind, Gott segne dich." "Good-bye, Fräulein," she said stiffly, shaking hands. The door was shut with a slam--the light seemed to go down. Miriam glanced at it--half the dull green muslin shade had slipped over the gas-globe. The...

## the-lost-world

- Status: pass
- Generated output inspected: 22 files
- Preview asset inspected: public/book-previews/the-lost-world.preview.json
- Selected structural convention: chapter-based roman numerals
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: Sectioning follows the selected structural convention.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: none
- First default section: chapter-001 (Chapter 1, 2109 words)
- Last default section: chapter-016 (Chapter 16, 6328 words)
- Raw start snippet: Foreword Mr. E. D. Malone desires to state that both the injunction for restraint and the libel action have been withdrawn unreservedly by Professor G. E. Challenger, who, being satisfied that no criticism or comment in this book is meant in an offensive spirit, has guaranteed that he will place no
- Generated start snippet: Foreword Mr. E. D. Malone desires to state that both the injunction for restraint and the libel action have been withdrawn unreservedly by Professor G. E. Challenger, who, being satisfied that no criticism or comment in this book is meant in an offensive spirit, has guaranteed that he will place no impediment to its publication and circulation. Contents CHA...
- Preview start snippet: CHAPTER I "There Are Heroisms All Round Us" Mr. Hungerton, her father, really was the most tactless person upon earth,--a fluffy, feathery, untidy cockatoo of a man, perfectly good-natured, but absolutely centered upon his own silly self. If anything could have driven me from Gladys, it would have been the thought of such a father-in-law. I am convinced tha...
- Raw end snippet: "I'll use my own," said Lord John Roxton, "in fitting a well-formed expedition and having another look at the dear old plateau. As to you, young fellah, you, of course, will spend yours in gettin' married." "Not just yet," said I, with a rueful smile. "I think, if you will have me, that I would rather go with you." Lord Roxton said nothing, but a brown hand...
- Generated end snippet: and spilled out of it a beautiful glittering diamond, one of the finest stones that I have ever seen. "There's the result," said he. "He prices the lot at a minimum of two hundred thousand pounds. Of course it is fair shares between us. I won't hear of anythin' else. Well, Challenger, what will you do with your fifty thousand?" "If you really persist in you...

## the-red-thumb-mark

- Status: pass
- Generated output inspected: 23 files
- Preview asset inspected: public/book-previews/the-red-thumb-mark.preview.json
- Selected structural convention: chapter-based roman numerals
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: Sectioning follows the selected structural convention.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: none
- First default section: chapter-001 (Chapter 1: MY LEARNED BROTHER, 1940 words)
- Last default section: chapter-017 (Chapter 17: AT LAST, 2115 words)
- Raw start snippet: PREFACE In writing the following story, the author has had in view no purpose other than that of affording entertainment to such readers as are interested in problems of crime and their solutions; and the story itself differs in no respect from others of its class, excepting in that an effort has been made to keep within the probabilities of ordinary life,...
- Generated start snippet: PREFACE In writing the following story, the author has had in view no purpose other than that of affording entertainment to such readers as are interested in problems of crime and their solutions; and the story itself differs in no respect from others of its class, excepting in that an effort has been made to keep within the probabilities of ordinary life,...
- Preview start snippet: CHAPTER I MY LEARNED BROTHER "Conflagratam An° 1677. Fabricatam An° 1698. Richardo Powell Armiger Thesaurar." The words, set in four panels, which formed a frieze beneath the pediment of a fine brick portico, summarised the history of one of the tall houses at the upper end of King's Bench Walk and as I, somewhat absently, read over the inscription, my atte...
- Raw end snippet: do." "Yes, I know," I said; "and that knowledge is all my heart's desire." She laid her hand in mine for a moment with a gentle pressure and then drew it away; and so we passed through into the cloisters. THE END
- Generated end snippet: ve me, dear, for my unutterable folly?" I asked presently, as she glanced up at me again. "I am not sure," she answered. "It was dreadfully silly of you." "But remember, Juliet, that I loved you with my whole heart--as I love you now and shall love you always." "I can forgive you anything when you say that," she answered softly. Here the voice of the distan...

## violet-fairy-book

- Status: pass
- Generated output inspected: 41 files
- Preview asset inspected: public/book-previews/violet-fairy-book.preview.json
- Selected structural convention: contents-backed story sections
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: Violet Fairy Book story sections are acceptable. Generated sections: 36; default story sections: 35. Contributor, contents, and standalone source-attribution lines are excluded from default playback. Story labels follow the contents-backed body headings from the raw source.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: Post-write correction: rebuilt story collection into 35 contents-backed story sections and one non-default preface/contents section.; Post-write correction: removed 32 standalone story source attribution lines from default playback.; Post-write verification corrected Violet Fairy Book into 35 complete story sections plus one non-default preface/contents section.; Removed 32 standalone story source attribution lines from default playback sections.
- First default section: chapter-001 (A Tale of the Tontlawald: A Tale of the Tontlawald, 4324 words)
- Last default section: chapter-035 (Mogarzea and His Son: Mogarzea and His Son, 1874 words)
- Raw start snippet: PREFACE The Editor takes this opportunity to repeat what he has often said before, that he is not the author of the stories in the Fairy Books; that he did not invent them ‘out of his own head.’ He is accustomed to being asked, by ladies, ‘Have you written anything else except the Fairy Books?’ He is then obliged to explain that he has NOT written the Fairy...
- Generated start snippet: PREFACE The Editor takes this opportunity to repeat what he has often said before, that he is not the author of the stories in the Fairy Books; that he did not invent them 'out of his own head.' He is accustomed to being asked, by ladies, 'Have you written anything else except the Fairy Books?' He is then obliged to explain that he has NOT written the Fairy...
- Preview start snippet: A TALE OF THE TONTLAWALD Long, long ago there stood in the midst of a country covered with lakes a vast stretch of moorland called the Tontlawald, on which no man ever dared set foot. From time to time a few bold spirits had been drawn by curiosity to its borders, and on their return had reported that they had caught a glimpse of a ruined house in a grove o...
- Raw end snippet: all her prayers. At last she saw that her entreaties were vain, and agreed to marry him, as he wished. And they went together to the palace, where Mogarzea was still waiting for him, and the marriage was celebrated by the emperor himself. But every May they returned to the Milk Lake, they and their children, and bathed in its waters. (Olumanische Marchen.)
- Generated end snippet: ed when he saw a beautiful fairy standing before him, with hair and robes that shone like gold. He gazed at her in wonder, when suddenly she began to dance. Her movements were so graceful that he forgot to play, and as soon as the notes of his flute ceased she vanished from his sight. The next day the same thing happened, but on the third he took courage, a...

## jack-and-jill

- Status: pass
- Generated output inspected: 29 files
- Preview asset inspected: public/book-previews/jack-and-jill.preview.json
- Selected structural convention: chapter-based roman numerals
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: Sectioning follows the selected structural convention.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: none
- First default section: chapter-001 (Chapter 1: The Catastrophe, 2910 words)
- Last default section: chapter-024 (Chapter 24: Down the River, 4439 words)
- Raw start snippet: Chapter I. The Catastrophe “Clear the lulla!” was the general cry on a bright December afternoon, when all the boys and girls of Harmony Village were out enjoying the first good snow of the season. Up and down three long coasts they went as fast as legs and sleds could carry them. One smooth path led into the meadow, and here the little folk congregated; on...
- Generated start snippet: Chapter I. The Catastrophe "Clear the lulla!" was the general cry on a bright December afternoon, when all the boys and girls of Harmony Village were out enjoying the first good snow of the season. Up and down three long coasts they went as fast as legs and sleds could carry them. One smooth path led into the meadow, and here the little folk congregated; on...
- Preview start snippet: Chapter I. The Catastrophe "Clear the lulla!" was the general cry on a bright December afternoon, when all the boys and girls of Harmony Village were out enjoying the first good snow of the season. Up and down three long coasts they went as fast as legs and sleds could carry them. One smooth path led into the meadow, and here the little folk congregated; on...
- Raw end snippet: them to resolve that the coming year should be braver and brighter than the last. There are many such boys and girls, full of high hopes, lovely possibilities, and earnest plans, pausing a moment before they push their little boats from the safe shore. Let those who launch them see to it that they have good health to man the oars, good education for ballast...
- Generated end snippet: , which was not fairer than his ambitious dreams. Here we will say good-by to these girls and boys of ours as they sit together in the sunshine talking over a year that was to be for ever memorable to them, not because of any very remarkable events, but because they were just beginning to look about them as they stepped out of childhood into youth, and some...

## the-wonderful-wizard-of-oz

- Status: pass
- Generated output inspected: 29 files
- Preview asset inspected: public/book-previews/the-wonderful-wizard-of-oz.preview.json
- Selected structural convention: chapter-based roman numerals
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: Sectioning follows the selected structural convention.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: none
- First default section: chapter-001 (Chapter 1: The Cyclone, 1145 words)
- Last default section: chapter-024 (Chapter 24: Home Again, 78 words)
- Raw start snippet: Chapter I The Cyclone Dorothy lived in the midst of the great Kansas prairies, with Uncle Henry, who was a farmer, and Aunt Em, who was the farmer’s wife. Their house was small, for the lumber to build it had to be carried by wagon many miles. There were four walls, a floor and a roof, which made one room; and this room contained a rusty looking cookstove,...
- Generated start snippet: Chapter I The Cyclone Dorothy lived in the midst of the great Kansas prairies, with Uncle Henry, who was a farmer, and Aunt Em, who was the farmer's wife. Their house was small, for the lumber to build it had to be carried by wagon many miles. There were four walls, a floor and a roof, which made one room; and this room contained a rusty looking cookstove,...
- Preview start snippet: Chapter I The Cyclone Dorothy lived in the midst of the great Kansas prairies, with Uncle Henry, who was a farmer, and Aunt Em, who was the farmer's wife. Their house was small, for the lumber to build it had to be carried by wagon many miles. There were four walls, a floor and a roof, which made one room; and this room contained a rusty looking cookstove,...
- Raw end snippet: Aunt Em had just come out of the house to water the cabbages when she looked up and saw Dorothy running toward her. “My darling child!” she cried, folding the little girl in her arms and covering her face with kisses. “Where in the world did you come from?” “From the Land of Oz,” said Dorothy gravely. “And here is Toto, too. And oh, Aunt Em! I’m so glad to...
- Generated end snippet: e grass several times before she knew where she was. At length, however, she sat up and looked about her. "Good gracious!" she cried. For she was sitting on the broad Kansas prairie, and just before her was the new farmhouse Uncle Henry built after the cyclone had carried away the old one. Uncle Henry was milking the cows in the barnyard, and Toto had jumpe...

## the-legend-of-sleepy-hollow

- Status: warn
- Generated output inspected: 7 files
- Preview asset inspected: public/book-previews/the-legend-of-sleepy-hollow.preview.json
- Selected structural convention: story or titled-section headings
- Start boundary verdict: Readable story prose starts correctly, but one source framing line before the epigraph is omitted. Raw story title/byline are metadata, but the frame line "FOUND AMONG THE PAPERS..." is outside the generated playback boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: The 2-section structure is a real story/postscript split, not arbitrary fallback chunking. The first label comes from the epigraph attribution "CASTLE OF INDOLENCE." rather than the story title. The source framing line "FOUND AMONG THE PAPERS..." is omitted from playback.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: Readable story prose starts correctly, but one source framing line before the epigraph is omitted.; Raw story title/byline are metadata, but the frame line "FOUND AMONG THE PAPERS..." is outside the generated playback boundary.; The 2-section structure is a real story/postscript split, not arbitrary fallback chunking.; The first label comes from the epigraph attribution "CASTLE OF INDOLENCE." rather than the story title.; The source framing line "FOUND AMONG THE PAPERS..." is omitted from playback.
- First default section: chapter-001 (Castle Of Indolence.: CASTLE OF INDOLENCE., 11789 words)
- Last default section: chapter-002 (Found In The Handwriting Of Mr. Knickerbocker.: FOUND IN THE HANDWRITING OF MR. KNICKERBOCKER., 439 words)
- Raw start snippet: A pleasing land of drowsy head it was, Of dreams that wave before the half-shut eye; And of gay castles in the clouds that pass, Forever flushing round a summer sky. CASTLE OF INDOLENCE. In the bosom of one of those spacious coves which indent the eastern shore of the Hudson, at that broad expansion of the river denominated
- Generated start snippet: A pleasing land of drowsy head it was, Of dreams that wave before the half-shut eye; And of gay castles in the clouds that pass, Forever flushing round a summer sky. CASTLE OF INDOLENCE. In the bosom of one of those spacious coves which indent the eastern shore of the Hudson, at that broad expansion of the river denominated by the ancient Dutch navigators t...
- Preview start snippet: A pleasing land of drowsy head it was, Of dreams that wave before the half-shut eye; And of gay castles in the clouds that pass, Forever flushing round a summer sky. CASTLE OF INDOLENCE. In the bosom of one of those spacious coves which indent the eastern shore of the Hudson, at that broad expansion of the river denominated by the ancient Dutch navigators t...
- Raw end snippet: syllogism, while, methought, the one in pepper-and-salt eyed him with something of a triumphant leer. At length he observed that all this was very well, but still he thought the story a little on the extravagant--there were one or two points on which he had his doubts. “Faith, sir,” replied the story-teller, “as to that matter, I don’t believe one-half of i...
- Generated end snippet: ir of infinite deference, and, lowering the glass slowly to the table, observed that the story was intended most logically to prove-- "That there is no situation in life but has its advantages and pleasures--provided we will but take a joke as we find it: "That, therefore, he that runs races with goblin troopers is likely to have rough riding of it. "Ergo,...

## four-day-planet

- Status: pass
- Generated output inspected: 26 files
- Preview asset inspected: public/book-previews/four-day-planet.preview.json
- Selected structural convention: standalone arabic-numbered sections
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: Sectioning follows the selected structural convention.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: none
- First default section: chapter-001 (Section 1: THE SHIP FROM TERRA, 3992 words)
- Last default section: chapter-020 (Section 20: FINALE, 4501 words)
- Raw start snippet: DEDICATION For Betty and Vall, with loving remembrance * * * * *
- Generated start snippet: DEDICATION For Betty and Vall, with loving remembrance CONTENTS 1. The Ship from Terra 2. Reporter Working 3. Bottom Level 4. Main City Level 5. Meeting Out of Order 6. Elementary, My Dear Kivelson 7. Aboard the _Javelin_ 8. Practice, 50-MM Gun 9. Monster Killing 10. Mayday, Mayday 11. Darkness and Cold 12. Castaways Working 13. The Beacon Light 14. The Res...
- Preview start snippet: 1 THE SHIP FROM TERRA I went through the gateway, towing my equipment in a contragravity hamper over my head. As usual, I was wondering what it would take, short of a revolution, to get the city of Port Sandor as clean and tidy and well lighted as the spaceport area. I knew Dad's editorials and my sarcastic news stories wouldn't do it. We'd been trying long...
- Raw end snippet: New Texas: its citizens figure that name about says it all. The Solar League ambassador to the Lone Star Planet has the unenviable task of convincing New Texans that a s'Srauff attack is imminent, and dangerous. Unfortunately it's common knowledge that the s'Srauff are evolved from canine ancestors--and not a Texan alive is about to be scared of a talking d...
- Generated end snippet: Y SAPIENS SPACE VIKING THE COSMIC COMPUTER all from Ace Science Fiction ACE SCIENCE FICTION Four-Day Planet Fenris isn't a hell planet, but it's nobody's bargain. With 2,000-hour days and an 8,000-hour year, it alternates blazing heat with killing cold. A planet like that tends to breed a special kind of person: tough enough to stay alive and smart enough t...

## room-13

- Status: pass
- Generated output inspected: 38 files
- Preview asset inspected: public/book-previews/room-13.preview.json
- Selected structural convention: chapter-based roman numerals
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: Room 13 has 33 default body chapters from Chapter I through Chapter XXXIII.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: none
- First default section: chapter-001 (Chapter 1, 2282 words)
- Last default section: chapter-033 (Chapter 33, 1283 words)
- Raw start snippet: CHAPTER I Over the grim stone archway was carved the words: PARCERE SUBJECTIS. In cold weather, and employing the argot of his companions, Johnny
- Generated start snippet: CHAPTER I Over the grim stone archway was carved the words: PARCERE SUBJECTIS. In cold weather, and employing the argot of his companions, Johnny Gray translated this as "Parky Subjects"--it certainly had no significance as "Spare the Vanquished," for he had been neither vanquished nor spared. Day by day, harnessed to the shafts, he and Lal Morgon had pulle...
- Preview start snippet: CHAPTER I Over the grim stone archway was carved the words: PARCERE SUBJECTIS. In cold weather, and employing the argot of his companions, Johnny Gray translated this as "Parky Subjects"--it certainly had no significance as "Spare the Vanquished," for he had been neither vanquished nor spared. Day by day, harnessed to the shafts, he and Lal Morgon had pulle...
- Raw end snippet: “to wipe the moisture _whch_ had condensed upon the lenses” to _which_. [Chapter XXXI] “_John_ listened at the door; he was coming alone” to _Johnny_. [End of text]
- Generated end snippet: , asked no questions." add comma after _Parker_. [Chapter X] ("Thank you I would rather remain here.") add comma after _you_. ("_You're_ double-crossed me, you dirty thief!) to _You've_. "peeled five, which he flung on on to the table." delete one _on_. [Chapter XI] ("If you had said five thousand _pound_," Mr. Reeder went on) to _pounds_. [Chapter XII] "wh...

## the-octopus-a-story-of-california

- Status: warn
- Generated output inspected: 20 files
- Preview asset inspected: public/book-previews/the-octopus-a-story-of-california.preview.json
- Selected structural convention: chapter-based roman numerals with book divisions
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: The Octopus preserves Book I/Book II and all 15 Roman chapters, with large but real chapter sections. Book division text is retained at the opening chapter of each book. Several chapters exceed the generic large-section threshold; this appears to reflect source chapter length rather than fallback blobs. Chapter labels reset inside Book II, so the manifest list is reviewable but could be clearer with explicit book-aware labels later.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: long book has huge sections despite detected headings; The Octopus preserves Book I/Book II and all 15 Roman chapters, with large but real chapter sections.; Book division text is retained at the opening chapter of each book.; Several chapters exceed the generic large-section threshold; this appears to reflect source chapter length rather than fallback blobs.; Chapter labels reset inside Book II, so the manifest list is reviewable but could be clearer with explicit book-aware labels later.
- First default section: chapter-001 (Chapter 1: Book 1, 15242 words)
- Last default section: chapter-015 (Chapter 9, 11567 words)
- Raw start snippet: BOOK 1 CHAPTER I Just after passing Caraher's saloon, on the County Road that ran south
- Generated start snippet: BOOK 1 CHAPTER I Just after passing Caraher's saloon, on the County Road that ran south from Bonneville, and that divided the Broderson ranch from that of Los Muertos, Presley was suddenly aware of the faint and prolonged blowing of a steam whistle that he knew must come from the railroad shops near the depot at Bonneville. In starting out from the ranch ho...
- Preview start snippet: BOOK 1 CHAPTER I Just after passing Caraher's saloon, on the County Road that ran south from Bonneville, and that divided the Broderson ranch from that of Los Muertos, Presley was suddenly aware of the faint and prolonged blowing of a steam whistle that he knew must come from the railroad shops near the depot at Bonneville. In starting out from the ranch ho...
- Raw end snippet: scarecrows on the barren plains of India. Falseness dies; injustice and oppression in the end of everything fade and vanish away. Greed, cruelty, selfishness, and inhumanity are short-lived; the individual suffers, but the race goes on. Annixter dies, but in a far distant corner of the world a thousand lives are saved. The larger view always and through all...
- Generated end snippet: of fire. BUT THE WHEAT REMAINED. Untouched, unassailable, undefiled, that mighty world-force, that nourisher of nations, wrapped in Nirvanic calm, indifferent to the human swarm, gigantic, resistless, moved onward in its appointed grooves. Through the welter of blood at the irrigation ditch, through the sham charity and shallow philanthropy of famine relief...

## the-prince-and-the-pauper

- Status: pass
- Generated output inspected: 38 files
- Preview asset inspected: public/book-previews/the-prince-and-the-pauper.preview.json
- Selected structural convention: chapter-based roman numerals
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: Sectioning follows the selected structural convention.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: none
- First default section: chapter-001 (Chapter 1: The birth of the Prince and the Pauper, 269 words)
- Last default section: chapter-033 (Chapter 33: Edward as King, 5839 words)
- Raw start snippet: CHAPTER I. The birth of the Prince and the Pauper. In the ancient city of London, on a certain autumn day in the second quarter of the sixteenth century, a boy was born to a poor family of the name of Canty, who did not want him. On the same day another English child was born to a rich family of the name of Tudor, who did want him. All England wanted him to...
- Generated start snippet: CHAPTER I. The birth of the Prince and the Pauper. In the ancient city of London, on a certain autumn day in the second quarter of the sixteenth century, a boy was born to a poor family of the name of Canty, who did not want him. On the same day another English child was born to a rich family of the name of Tudor, who did want him. All England wanted him to...
- Preview start snippet: CHAPTER I. The birth of the Prince and the Pauper. In the ancient city of London, on a certain autumn day in the second quarter of the sixteenth century, a boy was born to a poor family of the name of Canty, who did not want him. On the same day another English child was born to a rich family of the name of Tudor, who did want him. All England wanted him to...
- Raw end snippet: Code, of two hundred and forty years ago, stands all by itself, with ages of bloody law on the further side of it, and a century and three-quarters of bloody English law on _this_ side of it. There has never been a time--under the Blue Laws or any other--when above _fourteen_ crimes were punishable by death in Connecticut. But in England, within the memory...
- Generated end snippet: ayment of 500 pounds.--Ibid. GENERAL NOTE. One hears much about the 'hideous Blue Laws of Connecticut,' and is accustomed to shudder piously when they are mentioned. There are people in America--and even in England!--who imagine that they were a very monument of malignity, pitilessness, and inhumanity; whereas in reality they were about the first _sweeping...

## triplanetary

- Status: pass
- Generated output inspected: 18 files
- Preview asset inspected: public/book-previews/triplanetary.preview.json
- Selected structural convention: chapter-based roman numerals
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: Sectioning follows the selected structural convention.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: Post-write verification removed four illustration placeholders from playable Triplanetary text.
- First default section: chapter-001 (Chapter 1, 6202 words)
- Last default section: chapter-013 (Chapter 13, 4256 words)
- Raw start snippet: CHAPTER I Pirates of Space Apparently motionless to her passengers and crew, the Interplanetary liner _Hyperion_ bored serenely onward through space at normal acceleration. In the railed-off sanctum in one corner of the control room a bell tinkled, a smothered whirr was heard, and Captain Bradley
- Generated start snippet: CHAPTER I Pirates of Space Apparently motionless to her passengers and crew, the Interplanetary liner _Hyperion_ bored serenely onward through space at normal acceleration. In the railed-off sanctum in one corner of the control room a bell tinkled, a smothered whirr was heard, and Captain Bradley frowned as he studied the brief message upon the tape of the...
- Preview start snippet: CHAPTER I Pirates of Space Apparently motionless to her passengers and crew, the Interplanetary liner _Hyperion_ bored serenely onward through space at normal acceleration. In the railed-off sanctum in one corner of the control room a bell tinkled, a smothered whirr was heard, and Captain Bradley frowned as he studied the brief message upon the tape of the...
- Raw end snippet: Clio, now a hardened space-flea, immune even to the horrible nausea of inertialessness, wriggled lithely in the curve of Costigan's arm and laughed up at him. "You can talk all you want to, Conway, but I don't like them a bit. They give me the purple jitters! I suppose that they are really estimable folks; talented, cultured, and everything; but just the sa...
- Generated end snippet: and of vital importance. Therefore commerce was to be encouraged. The Nevians had knowledges and skills unknown to earthly science, but were entirely ignorant of many things, to us commonplace. Therefore interchange of students and of books was highly desirable. And so on. Thus was signed the Triplanetario-Nevian Treaty of Eternal Peace. Nerado and his two...

## the-call-of-the-wild

- Status: pass
- Generated output inspected: 12 files
- Preview asset inspected: public/book-previews/the-call-of-the-wild.preview.json
- Selected structural convention: chapter-based roman numerals
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: Sectioning follows the selected structural convention.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: none
- First default section: chapter-001 (Chapter 1: Into the Primitive, 3748 words)
- Last default section: chapter-007 (Chapter 7: The Sounding of the Call, 6241 words)
- Raw start snippet: Chapter I. Into the Primitive “Old longings nomadic leap, Chafing at custom’s chain; Again from its brumal sleep Wakens the ferine strain.”
- Generated start snippet: Chapter I. Into the Primitive "Old longings nomadic leap, Chafing at custom's chain; Again from its brumal sleep Wakens the ferine strain." Buck did not read the newspapers, or he would have known that trouble was brewing, not alone for himself, but for every tide-water dog, strong of muscle and with warm, long hair, from Puget Sound to San Diego. Because m...
- Preview start snippet: Chapter I. Into the Primitive "Old longings nomadic leap, Chafing at custom's chain; Again from its brumal sleep Wakens the ferine strain." Buck did not read the newspapers, or he would have known that trouble was brewing, not alone for himself, but for every tide-water dog, strong of muscle and with warm, long hair, from Puget Sound to San Diego. Because m...
- Raw end snippet: ground, with long grasses growing through it and vegetable mould overrunning it and hiding its yellow from the sun; and here he muses for a time, howling once, long and mournfully, ere he departs. But he is not always alone. When the long winter nights come on and the wolves follow their meat into the lower valleys, he may be seen running at the head of the...
- Generated end snippet: n the word goes over the fire of how the Evil Spirit came to select that valley for an abiding-place. In the summers there is one visitor, however, to that valley, of which the Yeehats do not know. It is a great, gloriously coated wolf, like, and yet unlike, all other wolves. He crosses alone from the smiling timber land and comes down into an open space am...


## Confirmations

- Only the 14 batch-2 slugs were inspected.
- No additional books were processed.
- app/client/assets/temp-books was inspected only and not modified.
- app/client/assets/books/cloudflare-export was not modified.
- No unrelated generated books were touched.
- npm run books:build was not run.
