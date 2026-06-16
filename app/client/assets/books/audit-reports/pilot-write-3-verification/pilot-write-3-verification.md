# Pilot Write 3 Verification

Post-write QA pass for the 25 batch-3 books. This report compares the raw source text, generated output, preview asset, pilot dry-run 3 report, and pilot write 3 report. It does not process additional books and does not modify raw source or Cloudflare export assets.

## Summary

| Book | Status | Structure | Start | End | Sectioning | Cleanup | Preview | Accepted for main | Needs correction |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| frankenstein | pass | chapter-based arabic numbers; custom source-backed sectioning | pass | pass | pass | pass | pass | yes | no |
| the-three-musketeers | pass | chapter-based roman numerals | pass | pass | pass | pass | pass | yes | no |
| a-tale-of-two-cities | warn | chapter-based roman numerals | warn | pass | pass | pass | pass | yes | no |
| around-the-world-in-eighty-days | pass | chapter-based roman numerals | pass | pass | pass | pass | pass | yes | no |
| cranford | pass | chapter-based roman numerals | pass | pass | pass | pass | pass | yes | no |
| little-fuzzy | pass | standalone roman numeral sections | pass | pass | pass | pass | pass | yes | no |
| macbeth | pass | play acts | pass | pass | pass | pass | pass | yes | no |
| persuasion | warn | chapter-based roman numerals | pass | warn | pass | pass | pass | yes | no |
| pygmalion | pass | play acts | pass | pass | pass | pass | pass | yes | no |
| sense-and-sensibility | pass | chapter-based roman numerals | pass | pass | pass | pass | pass | yes | no |
| the-adventures-of-tom-sawyer | pass | chapter-based roman numerals | pass | pass | pass | pass | pass | yes | no |
| the-door-in-the-wall | pass | standalone roman numeral sections | pass | pass | pass | pass | pass | yes | no |
| the-hound-of-the-baskervilles | pass | chapter-based arabic numbers | pass | pass | pass | pass | pass | yes | no |
| the-king-in-yellow | warn | standalone roman numeral sections; custom source-backed sectioning | warn | pass | pass | pass | pass | yes | no |
| the-life-and-adventures-of-robinson-crusoe | pass | chapter-based roman numerals | pass | pass | pass | pass | pass | yes | no |
| the-maltese-falcon | pass | standalone arabic-numbered sections; custom source-backed sectioning | pass | pass | pass | pass | pass | yes | no |
| the-tempest | warn | story or titled-section headings; custom source-backed sectioning | warn | warn | pass | pass | pass | yes | no |
| the-turn-of-the-screw | pass | standalone roman numeral sections; custom source-backed sectioning | pass | pass | pass | pass | pass | yes | no |
| the-war-of-the-worlds | pass | standalone roman numeral sections with book divisions | pass | pass | pass | pass | pass | yes | no |
| the-wendigo | pass | standalone roman numeral sections | pass | pass | pass | pass | pass | yes | no |
| wuthering-heights | pass | chapter-based roman numerals | pass | pass | pass | pass | pass | yes | no |
| anne-of-avonlea | pass | standalone roman numeral sections; custom source-backed sectioning | pass | pass | pass | pass | pass | yes | no |
| five-weeks-in-a-balloon | pass | chapter-based word ordinals; custom source-backed sectioning | pass | pass | pass | pass | pass | yes | no |
| moby-dick | pass | chapter-based arabic numbers with book divisions | pass | pass | pass | pass | pass | yes | no |
| tales-of-war | warn | isolated titled sections | pass | pass | warn | pass | pass | yes | no |

## Special Focus

- frankenstein: corrected - Frankenstein prior generated-output issue is corrected.
- the-three-musketeers: corrected - The Three Musketeers prior generated-output issue is corrected.
- around-the-world-in-eighty-days: corrected - Around the World in Eighty Days prior generated-output issue is corrected.
- sense-and-sensibility: corrected - Sense and Sensibility prior generated-output issue is corrected.
- macbeth: acceptable - macbeth play structure is acceptable.
- pygmalion: acceptable - pygmalion play structure is acceptable.
- the-tempest: acceptable - the-tempest play structure is acceptable.
- the-door-in-the-wall: acceptable - The Door in the Wall sectioning is acceptable for the source.
- the-king-in-yellow: acceptable - The King in Yellow story sections are acceptable.
- tales-of-war: acceptable - Tales of War story sections are acceptable, with many naturally short war sketches.
- moby-dick: acceptable - moby-dick long-book sectioning is acceptable.
- wuthering-heights: acceptable - wuthering-heights long-book sectioning is acceptable.
- the-life-and-adventures-of-robinson-crusoe: acceptable - the-life-and-adventures-of-robinson-crusoe long-book sectioning is acceptable.
- the-maltese-falcon: acceptable - The Maltese Falcon sectioning follows the actual source structure.

## Book Page State Fix

- Status: pass
- Inspected file: app/client/components/morse-code-books/MorseBookPage.tsx
- Verdict: MorseBookPage selected-source state fix is present; Playwright book-page QA covers full-load/default/saved/reset behavior.
- Checks: pass - translator source uses selectedScopeSections directly; pass - scopeReady waits for all selected full sections to load; pass - full-book section loader requests selected scope sections; pass - reset still uses computed defaultSectionIds

## Corrections

- the-tempest: removed 399 trailing Shakespeare line-number reference artifacts and 9 editorial Notes blocks from default act sections, removed the non-default editorial footnote block from cast/front matter, and rebuilt generated hashes plus the preview asset.
- the-war-of-the-worlds: corrected generated metadata so all 27 real chapter sections are default readable, then rebuilt generated hashes and the preview asset.

## frankenstein

- Status: pass
- Generated output inspected: 33 files
- Preview asset inspected: public/book-previews/frankenstein.preview.json
- Selected structural convention: chapter-based arabic numbers; custom source-backed sectioning
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: Frankenstein prior generated-output issue is corrected. Letters 1-4 are default readable sections before Chapter 1. Chapters 1-24 are preserved as generated chapter sections.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: Batch-3 custom source-backed sectioning applied to preserve real openings or story boundaries.
- First default section: letter-001 (Letter 1: _To Mrs. Saville, England._, 1200 words)
- Last default section: chapter-024 (Chapter 24, 8247 words)
- Raw start snippet: Letter 1 _To Mrs. Saville, England._ St. Petersburgh, Dec. 11th, 17—. You will rejoice to hear that no disaster has accompanied the
- Generated start snippet: Letter 1 _To Mrs. Saville, England._ St. Petersburgh, Dec. 11th, 17-. You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking....
- Preview start snippet: Letter 1 _To Mrs. Saville, England._ St. Petersburgh, Dec. 11th, 17-. You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking....
- Raw end snippet: miseries will be extinct. I shall ascend my funeral pile triumphantly and exult in the agony of the torturing flames. The light of that conflagration will fade away; my ashes will be swept into the sea by the winds. My spirit will sleep in peace, or if it thinks, it will not surely think thus. Farewell.” He sprang from the cabin-window as he said this, upon...
- Generated end snippet: idst seek my extinction, that I might not cause greater wretchedness; and if yet, in some mode unknown to me, thou hadst not ceased to think and feel, thou wouldst not desire against me a vengeance greater than that which I feel. Blasted as thou wert, my agony was still superior to thine, for the bitter sting of remorse will not cease to rankle in my wounds...

## the-three-musketeers

- Status: pass
- Generated output inspected: 73 files
- Preview asset inspected: public/book-previews/the-three-musketeers.preview.json
- Selected structural convention: chapter-based roman numerals
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: The Three Musketeers prior generated-output issue is corrected. Author's Preface is retained as non-default opening material. Chapters I-LXVII are preserved as 67 default readable chapter sections. Chapter headings exist and no giant fallback blob is used.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: none
- First default section: chapter-001 (Chapter 1: THE THREE PRESENTS OF D'ARTAGNAN THE ELDER, 5756 words)
- Last default section: chapter-067 (Chapter 67: CONCLUSION, 3330 words)
- Raw start snippet: AUTHOR’S PREFACE In which it is proved that, notwithstanding their names’ ending in _os_ and _is_, the heroes of the story which we are about to have the honor to relate to our readers have nothing mythological about them. A short time ago, while making researches in the Royal Library for my History of Louis XIV., I stumbled by chance upon the Memoirs of M....
- Generated start snippet: AUTHOR'S PREFACE In which it is proved that, notwithstanding their names' ending in _os_ and _is_, the heroes of the story which we are about to have the honor to relate to our readers have nothing mythological about them. A short time ago, while making researches in the Royal Library for my History of Louis XIV., I stumbled by chance upon the Memoirs of M....
- Preview start snippet: Chapter I. THE THREE PRESENTS OF D'ARTAGNAN THE ELDER On the first Monday of the month of April, 1625, the market town of Meung, in which the author of _Romance of the Rose_ was born, appeared to be in as perfect a state of revolution as if the Huguenots had just made a second La Rochelle of it. Many citizens, seeing the women flying toward the High Street,...
- Raw end snippet: M. Bonacieux lived on very quietly, wholly ignorant of what had become of his wife, and caring very little about it. One day he had the imprudence to recall himself to the memory of the cardinal. The cardinal had him informed that he would provide for him so that he should never want for anything in future. In fact, M. Bonacieux, having left his house at se...
- Generated end snippet: e. "It is much better both for you and for me to stop where we are," answered the wounded man. "_Corbleu!_ I am more your friend than you think-for after our very first encounter, I could by saying a word to the cardinal have had your throat cut!" They this time embraced heartily, and without retaining any malice. Planchet obtained from Rochefort the rank o...

## a-tale-of-two-cities

- Status: warn
- Generated output inspected: 50 files
- Preview asset inspected: public/book-previews/a-tale-of-two-cities.preview.json
- Selected structural convention: chapter-based roman numerals
- Start boundary verdict: Generated start needs manual review. Generated text does not begin with the normalized raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: Sectioning follows the selected structural convention.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: Generated start needs manual review.; Generated text does not begin with the normalized raw boundary.
- First default section: chapter-001 (Chapter 1: The Period, 1009 words)
- Last default section: chapter-045 (Chapter 15: The Footsteps Die Out For Ever, 2250 words)
- Raw start snippet: Book the First--Recalled to Life CHAPTER I. The Period
- Generated start snippet: CHAPTER I. The Period It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair, we had everything before us, we had nothing before...
- Preview start snippet: CHAPTER I. The Period It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair, we had everything before us, we had nothing before...
- Raw end snippet: winning it so well, that my name is made illustrious there by the light of his. I see the blots I threw upon it, faded away. I see him, fore-most of just judges and honoured men, bringing a boy of my name, with a forehead that I know and golden hair, to this place--then fair to look upon, with not a trace of this day’s disfigurement--and I hear him tell the...
- Generated end snippet: heir descendants, generations hence. I see her, an old woman, weeping for me on the anniversary of this day. I see her and her husband, their course done, lying side by side in their last earthly bed, and I know that each was not more honoured and held sacred in the other's soul, than I was in the souls of both. "I see that child who lay upon her bosom and...

## around-the-world-in-eighty-days

- Status: pass
- Generated output inspected: 42 files
- Preview asset inspected: public/book-previews/around-the-world-in-eighty-days.preview.json
- Selected structural convention: chapter-based roman numerals
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: Around the World in Eighty Days prior generated-output issue is corrected. All 37 real chapters are default readable sections. Prior title-page and short-section damage is absent from the generated section list.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: none
- First default section: chapter-001 (Chapter 1, 1473 words)
- Last default section: chapter-037 (Chapter 37, 963 words)
- Raw start snippet: CHAPTER I. IN WHICH PHILEAS FOGG AND PASSEPARTOUT ACCEPT EACH OTHER, THE ONE AS MASTER, THE OTHER AS MAN Mr. Phileas Fogg lived, in 1872, at No. 7, Saville Row, Burlington Gardens, the house in which Sheridan died in 1814. He was one of the most noticeable members of the Reform Club, though he seemed always to avoid attracting attention; an enigmatical pers...
- Generated start snippet: CHAPTER I. IN WHICH PHILEAS FOGG AND PASSEPARTOUT ACCEPT EACH OTHER, THE ONE AS MASTER, THE OTHER AS MAN Mr. Phileas Fogg lived, in 1872, at No. 7, Saville Row, Burlington Gardens, the house in which Sheridan died in 1814. He was one of the most noticeable members of the Reform Club, though he seemed always to avoid attracting attention; an enigmatical pers...
- Preview start snippet: CHAPTER I. IN WHICH PHILEAS FOGG AND PASSEPARTOUT ACCEPT EACH OTHER, THE ONE AS MASTER, THE OTHER AS MAN Mr. Phileas Fogg lived, in 1872, at No. 7, Saville Row, Burlington Gardens, the house in which Sheridan died in 1814. He was one of the most noticeable members of the Reform Club, though he seemed always to avoid attracting attention; an enigmatical pers...
- Raw end snippet: sledges, elephants. The eccentric gentleman had throughout displayed all his marvellous qualities of coolness and exactitude. But what then? What had he really gained by all this trouble? What had he brought back from this long and weary journey? Nothing, say you? Perhaps so; nothing but a charming woman, who, strange as it may appear, made him the happiest...
- Generated end snippet: matter, Passepartout?" "What is it, sir? Why, I've just this instant found out-" "What?" "That we might have made the tour of the world in only seventy-eight days." "No doubt," returned Mr. Fogg, "by not crossing India. But if I had not crossed India, I should not have saved Aouda; she would not have been my wife, and-" Mr. Fogg quietly shut the door. Phile...

## cranford

- Status: pass
- Generated output inspected: 21 files
- Preview asset inspected: public/book-previews/cranford.preview.json
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
- First default section: chapter-001 (Chapter 1: OUR SOCIETY, 3950 words)
- Last default section: chapter-016 (Chapter 16: PEACE TO CRANFORD, 2958 words)
- Raw start snippet: CHAPTER I. OUR SOCIETY IN the first place, Cranford is in possession of the Amazons; all the holders of houses above a certain rent are women. If a married couple come to settle in the town, somehow the gentleman disappears; he is either fairly frightened to death by being the only man in the Cranford evening parties, or he is accounted for by being with hi...
- Generated start snippet: CHAPTER I. OUR SOCIETY IN the first place, Cranford is in possession of the Amazons; all the holders of houses above a certain rent are women. If a married couple come to settle in the town, somehow the gentleman disappears; he is either fairly frightened to death by being the only man in the Cranford evening parties, or he is accounted for by being with hi...
- Preview start snippet: CHAPTER I. OUR SOCIETY IN the first place, Cranford is in possession of the Amazons; all the holders of houses above a certain rent are women. If a married couple come to settle in the town, somehow the gentleman disappears; he is either fairly frightened to death by being the only man in the Cranford evening parties, or he is accounted for by being with hi...
- Raw end snippet: Somehow or another he did; and fairly got them into conversation together. Major and Mrs Gordon helped at the good work with their perfect ignorance of any existing coolness between any of the inhabitants of Cranford. Ever since that day there has been the old friendly sociability in Cranford society; which I am thankful for, because of my dear Miss Matty’s...
- Generated end snippet: her well awake. I bribed her here by asking her to let me have her name as patroness for my poor conjuror this evening; and I don't want to give her time enough to get up her rancour against the Hogginses, who are just coming in. I want everybody to be friends, for it harasses Matty so much to hear of these quarrels. I shall go at it again by-and-by, so you...

## little-fuzzy

- Status: pass
- Generated output inspected: 22 files
- Preview asset inspected: public/book-previews/little-fuzzy.preview.json
- Selected structural convention: standalone roman numeral sections
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: Sectioning follows the selected structural convention.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: none
- First default section: chapter-001 (Chapter 1, 3816 words)
- Last default section: chapter-017 (Chapter 17, 1350 words)
- Raw start snippet: I Jack Holloway found himself squinting, the orange sun full in his eyes. He raised a hand to push his hat forward, then lowered it to the controls to alter the pulse rate of the contragravity-field generators and lift the manipulator another hundred feet. For a moment he sat, puffing on the short pipe that had yellowed the corners of his white mustache, an...
- Generated start snippet: I Jack Holloway found himself squinting, the orange sun full in his eyes. He raised a hand to push his hat forward, then lowered it to the controls to alter the pulse rate of the contragravity-field generators and lift the manipulator another hundred feet. For a moment he sat, puffing on the short pipe that had yellowed the corners of his white mustache, an...
- Preview start snippet: I Jack Holloway found himself squinting, the orange sun full in his eyes. He raised a hand to push his hat forward, then lowered it to the controls to alter the pulse rate of the contragravity-field generators and lift the manipulator another hundred feet. For a moment he sat, puffing on the short pipe that had yellowed the corners of his white mustache, an...
- Raw end snippet: their ears and hear what they were saying, and Pappy Jack was learning some of their words, and teaching them some of his. And soon all the people would find Big Ones to live with, who would take care of them and have fun with them and love them, and give them the Wonderful Food. And with the Big Ones taking care of them, maybe more of their babies would li...
- Generated end snippet: all sure of that. And the other Big Ones had taken him away, and they had never seen him again. He had talked about that with the others--with Flora and Fauna, and Dr. Crippen, and Complex, and Superego, and Dillinger and Lizzie Borden. Now that they were all going to live with the Big Ones, they would have to use those funny names. Someday they would find...

## macbeth

- Status: pass
- Generated output inspected: 11 files
- Preview asset inspected: public/book-previews/macbeth.preview.json
- Selected structural convention: play acts
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: macbeth play structure is acceptable. Cast/front matter is retained as a non-default opening section. Five default act sections preserve act/scene dialogue structure.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: none
- First default section: part-001 (Act 1, 4038 words)
- Last default section: part-005 (Act 5, 3218 words)
- Raw start snippet: Dramatis Personæ DUNCAN, King of Scotland. MALCOLM, his Son. DONALBAIN, his Son. MACBETH, General in the King’s Army. BANQUO, General in the King’s Army. MACDUFF, Nobleman of Scotland. LENNOX, Nobleman of Scotland.
- Generated start snippet: Dramatis Personæ DUNCAN, King of Scotland. MALCOLM, his Son. DONALBAIN, his Son. MACBETH, General in the King's Army. BANQUO, General in the King's Army. MACDUFF, Nobleman of Scotland. LENNOX, Nobleman of Scotland. ROSS, Nobleman of Scotland. MENTEITH, Nobleman of Scotland. ANGUS, Nobleman of Scotland. CAITHNESS, Nobleman of Scotland. FLEANCE, Son to Banquo...
- Preview start snippet: ACT I SCENE I. An open Place. Thunder and Lightning. Enter three Witches. FIRST WITCH. When shall we three meet again? In thunder, lightning, or in rain? SECOND WITCH. When the hurlyburly's done, When the battle's lost and won. THIRD WITCH. That will be ere the set of sun. FIRST WITCH. Where the place? SECOND WITCH. Upon the heath. THIRD WITCH. There to mee...
- Raw end snippet: Of this dead butcher, and his fiend-like queen, Who, as ’tis thought, by self and violent hands Took off her life;—this, and what needful else That calls upon us, by the grace of Grace, We will perform in measure, time, and place. So thanks to all at once, and to each one, Whom we invite to see us crown’d at Scone. [_Flourish. Exeunt._]
- Generated end snippet: here stands Th' usurper's cursed head: the time is free. I see thee compass'd with thy kingdom's pearl, That speak my salutation in their minds; Whose voices I desire aloud with mine,- Hail, King of Scotland! ALL. Hail, King of Scotland! [_Flourish._] MALCOLM. We shall not spend a large expense of time Before we reckon with your several loves, And make us e...

## persuasion

- Status: warn
- Generated output inspected: 29 files
- Preview asset inspected: public/book-previews/persuasion.preview.json
- Selected structural convention: chapter-based roman numerals
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated ending differs from the normalized raw boundary. This can be expected only when decorative markers or placeholders were removed.
- Sectioning verdict: Sectioning follows the selected structural convention.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: Standalone FINIS marker removed from playable text.; Generated ending differs from the normalized raw boundary.; This can be expected only when decorative markers or placeholders were removed.
- First default section: chapter-001 (Chapter 1, 2614 words)
- Last default section: chapter-024 (Chapter 24, 1581 words)
- Raw start snippet: CHAPTER I. Sir Walter Elliot, of Kellynch Hall, in Somersetshire, was a man who, for his own amusement, never took up any book but the Baronetage; there he found occupation for an idle hour, and consolation in a distressed one; there his faculties were roused into admiration and respect, by contemplating the limited remnant of the earliest patents; there an...
- Generated start snippet: CHAPTER I. Sir Walter Elliot, of Kellynch Hall, in Somersetshire, was a man who, for his own amusement, never took up any book but the Baronetage; there he found occupation for an idle hour, and consolation in a distressed one; there his faculties were roused into admiration and respect, by contemplating the limited remnant of the earliest patents; there an...
- Preview start snippet: CHAPTER I. Sir Walter Elliot, of Kellynch Hall, in Somersetshire, was a man who, for his own amusement, never took up any book but the Baronetage; there he found occupation for an idle hour, and consolation in a distressed one; there his faculties were roused into admiration and respect, by contemplating the limited remnant of the earliest patents; there an...
- Raw end snippet: itself, and she had the full worth of it in Captain Wentworth’s affection. His profession was all that could ever make her friends wish that tenderness less, the dread of a future war all that could dim her sunshine. She gloried in being a sailor’s wife, but she must pay the tax of quick alarm for belonging to that profession which is, if possible, more dis...
- Generated end snippet: to render, to his wife. Mrs Smith's enjoyments were not spoiled by this improvement of income, with some improvement of health, and the acquisition of such friends to be often with, for her cheerfulness and mental alacrity did not fail her; and while these prime supplies of good remained, she might have bid defiance even to greater accessions of worldly pro...

## pygmalion

- Status: pass
- Generated output inspected: 11 files
- Preview asset inspected: public/book-previews/pygmalion.preview.json
- Selected structural convention: play acts
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: pygmalion play structure is acceptable. Cast/front matter is retained as a non-default opening section. Five default act sections preserve act/scene dialogue structure.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: none
- First default section: part-001 (Act 1, 3537 words)
- Last default section: part-005 (Act 5, 12306 words)
- Raw start snippet: PREFACE TO PYGMALION. A Professor of Phonetics. As will be seen later on, Pygmalion needs, not a preface, but a sequel, which I have supplied in its due place. The English have no respect for their language, and will not teach their children to speak it. They spell it so abominably that no man can teach himself what it sounds like. It is impossible for an E...
- Generated start snippet: PREFACE TO PYGMALION. A Professor of Phonetics. As will be seen later on, Pygmalion needs, not a preface, but a sequel, which I have supplied in its due place. The English have no respect for their language, and will not teach their children to speak it. They spell it so abominably that no man can teach himself what it sounds like. It is impossible for an E...
- Preview start snippet: ACT I Covent Garden at 11.15 p.m. Torrents of heavy summer rain. Cab whistles blowing frantically in all directions. Pedestrians running for shelter into the market and under the portico of St. Paul's Church, where there are already several people, among them a lady and her daughter in evening dress. They are all peering out gloomily at the rain, except one...
- Raw end snippet: could get him alone, on a desert island, away from all ties and with nobody else in the world to consider, and just drag him off his pedestal and see him making love like any common man. We all have private imaginations of that sort. But when it comes to business, to the life that she really leads as distinguished from the life of dreams and fancies, she li...
- Generated end snippet: ndent on her for all sorts of little services, and that he should miss her if she went away (it would never have occurred to Freddy or the Colonel to say anything of the sort) deepens her inner certainty that she is "no more to him than them slippers", yet she has a sense, too, that his indifference is deeper than the infatuation of commoner souls. She is i...

## sense-and-sensibility

- Status: pass
- Generated output inspected: 55 files
- Preview asset inspected: public/book-previews/sense-and-sensibility.preview.json
- Selected structural convention: chapter-based roman numerals
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: Sense and Sensibility prior generated-output issue is corrected. All 50 real chapters are default readable sections. Prior short-section damage is absent from the generated section list.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: none
- First default section: chapter-001 (Chapter 1, 1558 words)
- Last default section: chapter-050 (Chapter 50, 2468 words)
- Raw start snippet: CHAPTER I. The family of Dashwood had long been settled in Sussex. Their estate was large, and their residence was at Norland Park, in the centre of their property, where, for many generations, they had lived in so respectable a manner as to engage the general good opinion of their surrounding acquaintance. The late owner of this estate was a single man, wh...
- Generated start snippet: CHAPTER I. The family of Dashwood had long been settled in Sussex. Their estate was large, and their residence was at Norland Park, in the centre of their property, where, for many generations, they had lived in so respectable a manner as to engage the general good opinion of their surrounding acquaintance. The late owner of this estate was a single man, wh...
- Preview start snippet: CHAPTER I. The family of Dashwood had long been settled in Sussex. Their estate was large, and their residence was at Norland Park, in the centre of their property, where, for many generations, they had lived in so respectable a manner as to engage the general good opinion of their surrounding acquaintance. The late owner of this estate was a single man, wh...
- Raw end snippet: Between Barton and Delaford, there was that constant communication which strong family affection would naturally dictate; and among the merits and the happiness of Elinor and Marianne, let it not be ranked as the least considerable, that though sisters, and living almost within sight of each other, they could live without disagreement between themselves, or...
- Generated end snippet: ility in surviving her loss, he always retained that decided regard which interested him in every thing that befell her, and made her his secret standard of perfection in woman; and many a rising beauty would be slighted by him in after-days as bearing no comparison with Mrs. Brandon. Mrs. Dashwood was prudent enough to remain at the cottage, without attemp...

## the-adventures-of-tom-sawyer

- Status: pass
- Generated output inspected: 41 files
- Preview asset inspected: public/book-previews/the-adventures-of-tom-sawyer.preview.json
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
- First default section: chapter-001 (Chapter 1, 2394 words)
- Last default section: chapter-035 (Chapter 35, 1886 words)
- Raw start snippet: PREFACE Most of the adventures recorded in this book really occurred; one or two were experiences of my own, the rest those of boys who were schoolmates of mine. Huck Finn is drawn from life; Tom Sawyer also, but not from an individual—he is a combination of the characteristics of three boys whom I knew, and therefore belongs to the composite order of archi...
- Generated start snippet: PREFACE Most of the adventures recorded in this book really occurred; one or two were experiences of my own, the rest those of boys who were schoolmates of mine. Huck Finn is drawn from life; Tom Sawyer also, but not from an individual-he is a combination of the characteristics of three boys whom I knew, and therefore belongs to the composite order of archi...
- Preview start snippet: CHAPTER I "Tom!" No answer. "TOM!" No answer. "What's gone with that boy, I wonder? You TOM!" No answer. The old lady pulled her spectacles down and looked over them about the room; then she put them up and looked out under them. She seldom or never looked _through_ them for so small a thing as a boy; they were her state pair, the pride of her heart, and we...
- Raw end snippet: history of a _man_. When one writes a novel about grown people, he knows exactly where to stop—that is, with a marriage; but when he writes of juveniles, he must stop where he best can. Most of the characters that perform in this book still live, and are prosperous and happy. Some day it may seem worth while to take up the story of the younger ones again an...
- Generated end snippet: " "Yes, so it is. And you've got to swear on a coffin, and sign it with blood." "Now, that's something _like_! Why, it's a million times bullier than pirating. I'll stick to the widder till I rot, Tom; and if I git to be a reg'lar ripper of a robber, and everybody talking 'bout it, I reckon she'll be proud she snaked me in out of the wet." CONCLUSION So end...

## the-door-in-the-wall

- Status: pass
- Generated output inspected: 9 files
- Preview asset inspected: public/book-previews/the-door-in-the-wall.preview.json
- Selected structural convention: standalone roman numeral sections
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: The Door in the Wall sectioning is acceptable for the source. The source file is the standalone story split into four Roman-numbered body subdivisions, not a multi-story collection.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: none
- First default section: chapter-001 (Chapter 1, 3336 words)
- Last default section: chapter-004 (Chapter 4, 418 words)
- Raw start snippet: I One confidential evening, not three months ago, Lionel Wallace told me this story of the Door in the Wall. And at the time I thought that so far as he was concerned it was a true story. He told it me with such a direct simplicity of conviction that I could not do otherwise than believe in him. But in the morning, in my own flat, I woke to a different atmo...
- Generated start snippet: I One confidential evening, not three months ago, Lionel Wallace told me this story of the Door in the Wall. And at the time I thought that so far as he was concerned it was a true story. He told it me with such a direct simplicity of conviction that I could not do otherwise than believe in him. But in the morning, in my own flat, I woke to a different atmo...
- Preview start snippet: I One confidential evening, not three months ago, Lionel Wallace told me this story of the Door in the Wall. And at the time I thought that so far as he was concerned it was a true story. He told it me with such a direct simplicity of conviction that I could not do otherwise than believe in him. But in the morning, in my own flat, I woke to a different atmo...
- Raw end snippet: They found his body very early yesterday morning in a deep excavation near East Kensington Station. It is one of two shafts that have been made in connection with an extension of the railway southward. It is protected from the intrusion of the public by a hoarding upon the high road, in which a small doorway has been cut for the convenience of some of the w...
- Generated end snippet: re, after all, ever any green door in the wall at all? I do not know. I have told his story as he told it to me. There are times when I believe that Wallace was no more than the victim of the coincidence between a rare but not unprecedented type of hallucination and a careless trap, but that indeed is not my profoundest belief. You may think me superstitiou...

## the-hound-of-the-baskervilles

- Status: pass
- Generated output inspected: 21 files
- Preview asset inspected: public/book-previews/the-hound-of-the-baskervilles.preview.json
- Selected structural convention: chapter-based arabic numbers
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: Sectioning follows the selected structural convention.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: none
- First default section: chapter-001 (Chapter 1: Mr. Sherlock Holmes, 2262 words)
- Last default section: chapter-015 (Chapter 15, 4089 words)
- Raw start snippet: My dear Robinson, It was to your account of a West-Country legend that this tale owes its inception. For this and for your help in the details all thanks. Yours most truly,
- Generated start snippet: My dear Robinson, It was to your account of a West-Country legend that this tale owes its inception. For this and for your help in the details all thanks. Yours most truly, A. Conan Doyle. Hindhead, Haslemere. Chapter 1. Mr. Sherlock Holmes Mr. Sherlock Holmes, who was usually very late in the mornings, save upon those not infrequent occasions when he was u...
- Preview start snippet: Chapter 1. Mr. Sherlock Holmes Mr. Sherlock Holmes, who was usually very late in the mornings, save upon those not infrequent occasions when he was up all night, was seated at the breakfast table. I stood upon the hearth-rug and picked up the stick which our visitor had left behind him the night before. It was a fine, thick piece of wood, bulbous-headed, of...
- Raw end snippet: some way out of the difficulty. And now, my dear Watson, we have had some weeks of severe work, and for one evening, I think, we may turn our thoughts into more pleasant channels. I have a box for _Les Huguenots_. Have you heard the De Reszkes? Might I trouble you then to be ready in half an hour, and we can stop at Marcini’s for a little dinner on the way?...
- Generated end snippet: question to answer. Mrs. Stapleton has heard her husband discuss the problem on several occasions. There were three possible courses. He might claim the property from South America, establish his identity before the British authorities there and so obtain the fortune without ever coming to England at all, or he might adopt an elaborate disguise during the s...

## the-king-in-yellow

- Status: warn
- Generated output inspected: 16 files
- Preview asset inspected: public/book-previews/the-king-in-yellow.preview.json
- Selected structural convention: standalone roman numeral sections; custom source-backed sectioning
- Start boundary verdict: Generated start needs manual review. Generated text does not begin with the normalized raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: The King in Yellow story sections are acceptable. Opening epigraph is retained as non-default; 10 story sections are default readable.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: Batch-3 custom source-backed sectioning applied to preserve real openings or story boundaries.; Generated start needs manual review.; Generated text does not begin with the normalized raw boundary.
- First default section: chapter-001 (The Repairer Of Reputations, 12213 words)
- Last default section: chapter-010 (Rue Barree, 8002 words)
- Raw start snippet: THE KING IN YELLOW IS DEDICATED TO MY BROTHER CONTENTS
- Generated start snippet: THE KING IN YELLOW IS DEDICATED TO MY BROTHER "Along the shore the cloud waves break, The twin suns sink behind the lake, The shadows lengthen In Carcosa. Strange is the night where black stars rise, And strange moons circle through the skies But stranger still is Lost Carcosa. Songs that the Hyades shall sing, Where flap the tatters of the King, Must die u...
- Preview start snippet: THE REPAIRER OF REPUTATIONS I "Ne raillons pas les fous; leur folie dure plus longtemps que la nôtre.... Voila toute la différence." Toward the end of the year 1920 the Government of the United States had practically completed the programme, adopted during the last months of President Winthrop's administration. The country was apparently tranquil. Everybody...
- Raw end snippet: with his face. One was standing in a glass of water on the table and mechanically the girl drew it out, pressed it with her lips and laid it on the table beside him. He took it without a word and crossing the room, opened the door. The landing was dark and silent, but the girl lifted the lamp and gliding past him slipped down the polished stairs to the hall...
- Generated end snippet: d every nerve to the breaking. And now it was over, for the voice within had spoken. He listened, dully interested but already knowing the end,-indeed it little mattered;-the end would always be the same for him;-he understood now-always the same for him, and he listened, dully interested, to a voice which grew within him. After a while he stood up, and she...

## the-life-and-adventures-of-robinson-crusoe

- Status: pass
- Generated output inspected: 25 files
- Preview asset inspected: public/book-previews/the-life-and-adventures-of-robinson-crusoe.preview.json
- Selected structural convention: chapter-based roman numerals
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: the-life-and-adventures-of-robinson-crusoe long-book sectioning is acceptable. Chapter headings exist and no giant fallback blob is used.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: none
- First default section: chapter-001 (Chapter 1: START IN LIFE, 5240 words)
- Last default section: chapter-020 (Chapter 20: FIGHT BETWEEN FRIDAY AND A BEAR, 5079 words)
- Raw start snippet: CHAPTER I. START IN LIFE I was born in the year 1632, in the city of York, of a good family, though not of that country, my father being a foreigner of Bremen, who settled first at Hull. He got a good estate by merchandise, and leaving off his trade, lived afterwards at York, from whence he had married my mother, whose relations were named Robinson, a very...
- Generated start snippet: CHAPTER I. START IN LIFE I was born in the year 1632, in the city of York, of a good family, though not of that country, my father being a foreigner of Bremen, who settled first at Hull. He got a good estate by merchandise, and leaving off his trade, lived afterwards at York, from whence he had married my mother, whose relations were named Robinson, a very...
- Preview start snippet: CHAPTER I. START IN LIFE I was born in the year 1632, in the city of York, of a good family, though not of that country, my father being a foreigner of Bremen, who settled first at Hull. He got a good estate by merchandise, and leaving off his trade, lived afterwards at York, from whence he had married my mother, whose relations were named Robinson, a very...
- Raw end snippet: with that whole number twice, and were at first defeated, and one of them killed; but at last, a storm destroying their enemies’ canoes, they famished or destroyed almost all the rest, and renewed and recovered the possession of their plantation, and still lived upon the island. All these things, with some very surprising incidents in some new adventures of...
- Generated end snippet: from England, with a good cargo of necessaries, if they would apply themselves to planting-which I afterwards could not perform. The fellows proved very honest and diligent after they were mastered and had their properties set apart for them. I sent them, also, from the Brazils, five cows, three of them being big with calf, some sheep, and some hogs, which...

## the-maltese-falcon

- Status: pass
- Generated output inspected: 26 files
- Preview asset inspected: public/book-previews/the-maltese-falcon.preview.json
- Selected structural convention: standalone arabic-numbered sections; custom source-backed sectioning
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: The Maltese Falcon sectioning follows the actual source structure. Dedication is retained as non-default. The 20 numbered source sections are default readable and keep source titles.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: Batch-3 custom source-backed sectioning applied to preserve real openings or story boundaries.
- First default section: chapter-001 (Section 1: Spade & Archer, 2357 words)
- Last default section: chapter-020 (Section 20: If They Hang You, 4265 words)
- Raw start snippet: TO _JOSE_ 1 SPADE & ARCHER
- Generated start snippet: TO _JOSE_ 1 SPADE & ARCHER SAMUEL SPADE'S jaw was long and bony, his chin a jutting v under the more flexible v of his mouth. His nostrils curved back to make another, smaller, v. His yellow-grey eyes were horizontal. The v _motif_ was picked up again by thickish brows rising outward from twin creases above a hooked nose, and his pale brown hair grew down-f...
- Preview start snippet: 1 SPADE & ARCHER SAMUEL SPADE'S jaw was long and bony, his chin a jutting v under the more flexible v of his mouth. His nostrils curved back to make another, smaller, v. His yellow-grey eyes were horizontal. The v _motif_ was picked up again by thickish brows rising outward from twin creases above a hooked nose, and his pale brown hair grew down-from high f...
- Raw end snippet: into the outer office, shutting the door behind her. When she came in again she shut it behind her. She said in a small flat voice: “Iva is here.” Spade, looking down at his desk, nodded almost imperceptibly. “Yes,” he said, and shivered. “Well, send her in.” THE END
- Generated end snippet: She stood beside him, staring down at him. He raised his head, grinned, and said mockingly: "So much for your woman's intuition." Her voice was queer as the expression on her face. "You did that, Sam, to her?" He nodded. "Your Sam's a detective." He looked sharply at her. He put his arm around her waist, his hand on her hip. "She did kill Miles, angel," he...

## the-tempest

- Status: warn
- Generated output inspected: 11 files
- Preview asset inspected: public/book-previews/the-tempest.preview.json
- Selected structural convention: story or titled-section headings; custom source-backed sectioning
- Start boundary verdict: Generated start needs manual review. Generated text does not begin with the normalized raw boundary.
- End boundary verdict: Generated ending differs from the normalized raw boundary. This can be expected only when decorative markers or placeholders were removed.
- Sectioning verdict: the-tempest play structure is acceptable. Cast/front matter is retained as a non-default opening section. Five default act sections preserve act/scene dialogue structure.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: Batch-3 custom source-backed sectioning applied to preserve real openings or story boundaries.; body headings were found but rejected by the selected strategy; Structure strategy changed after detector repair from act-prefixed to all-caps-title.; Generated start needs manual review.; Generated text does not begin with the normalized raw boundary.; Generated ending differs from the normalized raw boundary.; This can be expected only when decorative markers or placeholders were removed.
- First default section: part-001 (Act 1, 4872 words)
- Last default section: part-005 (Act 5, 2920 words)
- Raw start snippet: THE TEMPEST. DRAMATIS PERSONÆ[1]. ALONSO, King of Naples.
- Generated start snippet: THE TEMPEST. DRAMATIS PERSONÆ. ALONSO, King of Naples. SEBASTIAN, his brother. PROSPERO, the right Duke of Milan. ANTONIO, his brother, the usurping Duke of Milan. FERDINAND, son to the King of Naples. GONZALO, an honest old Counsellor. ADRIAN, Lord FRANCISCO, „ CALIBAN, a savage and deformed Slave. TRINCULO, a Jester. STEPHANO, a drunken Butler. Master of...
- Preview start snippet: ACT I. SCENE I. _On a ship at sea: a tempestuous noise of thunder and lightning heard._ _Enter _a Ship-Master_ and _a Boatswain_._ _Mast._ Boatswain! _Boats._ Here, master: what cheer? _Mast._ Good, speak to the mariners: fall to't, yarely, or we run ourselves aground: bestir, bestir. [_Exit._ _Enter _Mariners_._ _Boats._ Heigh, my hearts! cheerly, cheerly,...
- Raw end snippet: Must fill, or else my project fails, Which was to please. Now I want Spirits to enforce, art to enchant; And my ending is despair, 15 Unless I be relieved by prayer, Which pierces so, that it assaults Mercy itself, and frees all faults. As you from crimes would pardon’d be, Let your indulgence set me free. 20
- Generated end snippet: the ear strangely. _Pros._ I'll deliver all; And promise you calm seas, auspicious gales, And sail so expeditious, that shall catch Your royal fleet far off. [_Aside to Ari._] My Ariel, chick, That is thy charge: then to the elements Be free, and fare thou well! Please you, draw near. [_Exeunt._ EPILOGUE. SPOKEN BY PROSPERO. Now my charms are all o'erthrown...

## the-turn-of-the-screw

- Status: pass
- Generated output inspected: 30 files
- Preview asset inspected: public/book-previews/the-turn-of-the-screw.preview.json
- Selected structural convention: standalone roman numeral sections; custom source-backed sectioning
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: Sectioning follows the selected structural convention.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: Batch-3 custom source-backed sectioning applied to preserve real openings or story boundaries.
- First default section: chapter-001 (Prologue, 2778 words)
- Last default section: chapter-025 (Chapter 24, 1919 words)
- Raw start snippet: THE TURN OF THE SCREW The story had held us, round the fire, sufficiently breathless, but except the obvious remark that it was gruesome, as, on Christmas Eve in an old house, a strange tale should essentially be, I remember no comment uttered till somebody happened to say that it was the only case he had met in which such a visitation had fallen on a child...
- Generated start snippet: THE TURN OF THE SCREW The story had held us, round the fire, sufficiently breathless, but except the obvious remark that it was gruesome, as, on Christmas Eve in an old house, a strange tale should essentially be, I remember no comment uttered till somebody happened to say that it was the only case he had met in which such a visitation had fallen on a child...
- Preview start snippet: THE TURN OF THE SCREW The story had held us, round the fire, sufficiently breathless, but except the obvious remark that it was gruesome, as, on Christmas Eve in an old house, a strange tale should essentially be, I remember no comment uttered till somebody happened to say that it was the only case he had met in which such a visitation had fallen on a child...
- Raw end snippet: But he had already jerked straight round, stared, glared again, and seen but the quiet day. With the stroke of the loss I was so proud of he uttered the cry of a creature hurled over an abyss, and the grasp with which I recovered him might have been that of catching him in his fall. I caught him, yes, I held him—it may be imagined with what a passion; but a...
- Generated end snippet: e all my proof that I flashed into ice to challenge him. "Whom do you mean by 'he'?" "Peter Quint-you devil!" His face gave again, round the room, its convulsed supplication. "_Where?_" They are in my ears still, his supreme surrender of the name and his tribute to my devotion. "What does he matter now, my own?-what will he _ever_ matter? _I_ have you," I l...

## the-war-of-the-worlds

- Status: pass
- Generated output inspected: 32 files
- Preview asset inspected: public/book-previews/the-war-of-the-worlds.preview.json
- Selected structural convention: standalone roman numeral sections with book divisions
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: Sectioning follows the selected structural convention.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: none
- First default section: chapter-001 (Chapter 1: Book One, 2232 words)
- Last default section: chapter-027 (Chapter 10: THE EPILOGUE., 1377 words)
- Raw start snippet: BOOK ONE THE COMING OF THE MARTIANS I. THE EVE OF THE WAR.
- Generated start snippet: BOOK ONE THE COMING OF THE MARTIANS I. THE EVE OF THE WAR. No one would have believed in the last years of the nineteenth century that this world was being watched keenly and closely by intelligences greater than man's and yet as mortal as his own; that as men busied themselves about their various concerns they were scrutinised and studied, perhaps almost a...
- Preview start snippet: BOOK ONE THE COMING OF THE MARTIANS I. THE EVE OF THE WAR. No one would have believed in the last years of the nineteenth century that this world was being watched keenly and closely by intelligences greater than man's and yet as mortal as his own; that as men busied themselves about their various concerns they were scrutinised and studied, perhaps almost a...
- Raw end snippet: mist, vanishing at last into the vague lower sky, to see the people walking to and fro among the flower beds on the hill, to see the sight-seers about the Martian machine that stands there still, to hear the tumult of playing children, and to recall the time when I saw it all bright and clear-cut, hard and silent, under the dawn of that last great day. . ....
- Generated end snippet: kness of the night. I go to London and see the busy multitudes in Fleet Street and the Strand, and it comes across my mind that they are but the ghosts of the past, haunting the streets that I have seen silent and wretched, going to and fro, phantasms in a dead city, the mockery of life in a galvanised body. And strange, too, it is to stand on Primrose Hill...

## the-wendigo

- Status: pass
- Generated output inspected: 14 files
- Preview asset inspected: public/book-previews/the-wendigo.preview.json
- Selected structural convention: standalone roman numeral sections
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: Sectioning follows the selected structural convention.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: none
- First default section: chapter-001 (Chapter 1, 2574 words)
- Last default section: chapter-009 (Chapter 9, 965 words)
- Raw start snippet: I A considerable number of hunting parties were out that year without finding so much as a fresh trail; for the moose were uncommonly shy, and the various Nimrods returned to the bosoms of their respective families with the best excuses the facts of their imaginations could suggest. Dr. Cathcart, among others, came back without a trophy; but he brought inst...
- Generated start snippet: I A considerable number of hunting parties were out that year without finding so much as a fresh trail; for the moose were uncommonly shy, and the various Nimrods returned to the bosoms of their respective families with the best excuses the facts of their imaginations could suggest. Dr. Cathcart, among others, came back without a trophy; but he brought inst...
- Preview start snippet: I A considerable number of hunting parties were out that year without finding so much as a fresh trail; for the moose were uncommonly shy, and the various Nimrods returned to the bosoms of their respective families with the best excuses the facts of their imaginations could suggest. Dr. Cathcart, among others, came back without a trophy; but he brought inst...
- Raw end snippet: in the evening--an hour, that is, before the search party returned--when he saw this shadow of the guide picking its way weakly into camp. In advance of him, he declares, came the faint whiff of a certain singular odour. That same instant old Punk started for home. He covered the entire journey of three days as only Indian blood could have covered it. The t...
- Generated end snippet: d exposure, of where he had been, or of how he covered the great distance from one camp to the other, including an immense detour of the lake on foot since he had no canoe--all this remains unknown. His memory had vanished completely. And before the end of the winter whose beginning witnessed this strange occurrence, Défago, bereft of mind, memory and soul,...

## wuthering-heights

- Status: pass
- Generated output inspected: 39 files
- Preview asset inspected: public/book-previews/wuthering-heights.preview.json
- Selected structural convention: chapter-based roman numerals
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: wuthering-heights long-book sectioning is acceptable. Chapter headings exist and no giant fallback blob is used.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: none
- First default section: chapter-001 (Chapter 1, 1919 words)
- Last default section: chapter-034 (Chapter 34, 4383 words)
- Raw start snippet: CHAPTER I 1801—I have just returned from a visit to my landlord—the solitary neighbour that I shall be troubled with. This is certainly a beautiful country! In all England, I do not believe that I could have fixed on a situation so completely removed from the stir of society. A perfect misanthropist’s Heaven—and Mr. Heathcliff and I are such a suitable pair...
- Generated start snippet: CHAPTER I 1801-I have just returned from a visit to my landlord-the solitary neighbour that I shall be troubled with. This is certainly a beautiful country! In all England, I do not believe that I could have fixed on a situation so completely removed from the stir of society. A perfect misanthropist's Heaven-and Mr. Heathcliff and I are such a suitable pair...
- Preview start snippet: CHAPTER I 1801-I have just returned from a visit to my landlord-the solitary neighbour that I shall be troubled with. This is certainly a beautiful country! In all England, I do not believe that I could have fixed on a situation so completely removed from the stir of society. A perfect misanthropist's Heaven-and Mr. Heathcliff and I are such a suitable pair...
- Raw end snippet: I sought, and soon discovered, the three headstones on the slope next the moor: the middle one grey, and half buried in heath; Edgar Linton’s only harmonized by the turf and moss creeping up its foot; Heathcliff’s still bare. I lingered round them, under that benign sky: watched the moths fluttering among the heath and harebells, listened to the soft wind b...
- Generated end snippet: ed Joseph in his opinion of his fellow-servant's gay indiscretions, had he not fortunately recognised me for a respectable character by the sweet ring of a sovereign at his feet. My walk home was lengthened by a diversion in the direction of the kirk. When beneath its walls, I perceived decay had made progress, even in seven months: many a window showed bla...

## anne-of-avonlea

- Status: pass
- Generated output inspected: 36 files
- Preview asset inspected: public/book-previews/anne-of-avonlea.preview.json
- Selected structural convention: standalone roman numeral sections; custom source-backed sectioning
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: Sectioning follows the selected structural convention.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: Batch-3 custom source-backed sectioning applied to preserve real openings or story boundaries.
- First default section: chapter-001 (Chapter 1: An Irate Neighbor, 3428 words)
- Last default section: chapter-030 (Chapter 30: A Wedding at the Stone House, 2626 words)
- Raw start snippet: To my former teacher HATTIE GORDON SMITH in grateful remembrance of her sympathy and encouragement.
- Generated start snippet: To my former teacher HATTIE GORDON SMITH in grateful remembrance of her sympathy and encouragement. Flowers spring to blossom where she walks The careful ways of duty, Our hard, stiff lines of life with her Are flowing curves of beauty. -WHITTIER I An Irate Neighbor A tall, slim girl, "half-past sixteen," with serious gray eyes and hair which her friends ca...
- Preview start snippet: I An Irate Neighbor A tall, slim girl, "half-past sixteen," with serious gray eyes and hair which her friends called auburn, had sat down on the broad red sandstone doorstep of a Prince Edward Island farmhouse one ripe afternoon in August, firmly resolved to construe so many lines of Virgil. But an August afternoon, with blue hazes scarfing the harvest slop...
- Raw end snippet: history of the next four years in the light of Anne’s remembered blush. Four years of earnest, happy work . . . and then the guerdon of a useful knowledge gained and a sweet heart won. Behind them in the garden the little stone house brooded among the shadows. It was lonely but not forsaken. It had not yet done with dreams and laughter and the joy of life;...
- Generated end snippet: . . love unfolded naturally out of a beautiful friendship, as a golden-hearted rose slipping from its green sheath. Then the veil dropped again; but the Anne who walked up the dark lane was not quite the same Anne who had driven gaily down it the evening before. The page of girlhood had been turned, as by an unseen finger, and the page of womanhood was befo...

## five-weeks-in-a-balloon

- Status: pass
- Generated output inspected: 50 files
- Preview asset inspected: public/book-previews/five-weeks-in-a-balloon.preview.json
- Selected structural convention: chapter-based word ordinals; custom source-backed sectioning
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: Sectioning follows the selected structural convention.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: Batch-3 custom source-backed sectioning applied to preserve real openings or story boundaries.
- First default section: chapter-001 (Chapter 1: The End of a much-applauded Speech.-The Presentation of Dr. Samuel, 2258 words)
- Last default section: chapter-044 (Chapter 44: Conclusion.-The Certificate.-The French Settlements.-The Post of, 872 words)
- Raw start snippet: PUBLISHERS’ NOTE. “Five Weeks in a Balloon” is, in a measure, a satire on modern books of African travel. So far as the geography, the inhabitants, the animals, and the features of the countries the travellers pass over are described, it is entirely accurate. It gives, in some particulars, a survey of nearly the whole field of African discovery, and in this...
- Generated start snippet: PUBLISHERS' NOTE. "Five Weeks in a Balloon" is, in a measure, a satire on modern books of African travel. So far as the geography, the inhabitants, the animals, and the features of the countries the travellers pass over are described, it is entirely accurate. It gives, in some particulars, a survey of nearly the whole field of African discovery, and in this...
- Preview start snippet: CHAPTER FIRST. The End of a much-applauded Speech.-The Presentation of Dr. Samuel Ferguson.-Excelsior.-Full-length Portrait of the Doctor.-A Fatalist convinced.-A Dinner at the Travellers' Club.-Several Toasts for the Occasion. There was a large audience assembled on the 14th of January, 1862, at the session of the Royal Geographical Society, No. 3 Waterloo...
- Raw end snippet: The first result of Dr. Ferguson’s expedition was to establish, in the most precise manner, the facts and geographical surveys reported by Messrs. Barth, Burton, Speke, and others. Thanks to the still more recent expeditions of Messrs. Speke and Grant, De Heuglin and Muntzinger, who have been ascending to the sources of the Nile, and penetrating to the cent...
- Generated end snippet: their praises of the bold explorers, and the _Daily Telegraph_ struck off an edition of three hundred and seventy-seven thousand copies on the day when it published a sketch of the trip. Doctor Ferguson, at a public meeting of the Royal Geographical Society, gave a recital of his journey through the air, and obtained for himself and his companions the golde...

## moby-dick

- Status: pass
- Generated output inspected: 141 files
- Preview asset inspected: public/book-previews/moby-dick.preview.json
- Selected structural convention: chapter-based arabic numbers with book divisions
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: moby-dick long-book sectioning is acceptable. Chapter headings exist and no giant fallback blob is used.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: none
- First default section: chapter-001 (Chapter 1: Loomings, 2203 words)
- Last default section: chapter-135 (Chapter 135: The Chase.-Third Day, 4771 words)
- Raw start snippet: ETYMOLOGY. (Supplied by a Late Consumptive Usher to a Grammar School.) The pale Usher—threadbare in coat, heart, body, and brain; I see him now. He was ever dusting his old lexicons and grammars, with a queer handkerchief, mockingly embellished with all the gay flags of all the known nations of the world. He loved to dust his old grammars; it
- Generated start snippet: ETYMOLOGY. (Supplied by a Late Consumptive Usher to a Grammar School.) The pale Usher-threadbare in coat, heart, body, and brain; I see him now. He was ever dusting his old lexicons and grammars, with a queer handkerchief, mockingly embellished with all the gay flags of all the known nations of the world. He loved to dust his old grammars; it somehow mildly...
- Preview start snippet: CHAPTER 1. Loomings. Call me Ishmael. Some years ago-never mind how long precisely-having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim...
- Raw end snippet: reason of its cunning spring, and, owing to its great buoyancy, rising with great force, the coffin life-buoy shot lengthwise from the sea, fell over, and floated by my side. Buoyed up by that coffin, for almost one whole day and night, I floated on a soft and dirgelike main. The unharming sharks, they glided by as if with padlocks on their mouths; the sava...
- Generated end snippet: en the halfspent suction of the sunk ship reached me, I was then, but slowly, drawn towards the closing vortex. When I reached it, it had subsided to a creamy pool. Round and round, then, and ever contracting towards the button-like black bubble at the axis of that slowly wheeling circle, like another Ixion I did revolve. Till, gaining that vital centre, th...

## tales-of-war

- Status: warn
- Generated output inspected: 36 files
- Preview asset inspected: public/book-previews/tales-of-war.preview.json
- Selected structural convention: isolated titled sections
- Start boundary verdict: Generated output starts at the selected readable raw boundary.
- End boundary verdict: Generated output preserves the selected readable ending.
- Sectioning verdict: Tales of War story sections are acceptable, with many naturally short war sketches. All 31 isolated story/essay titles are preserved as default readable sections.
- Cleanup verdict: Cleanup excludes source/license/footer junk and obvious playback artifacts.
- Preview verdict: Preview starts from generated default-readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: Tales of War story sections are acceptable, with many naturally short war sketches.; All 31 isolated story/essay titles are preserved as default readable sections.
- First default section: chapter-001 (The Prayer Of The Men Of Daleswood: The Prayer of the Men of Daleswood, 2346 words)
- Last default section: chapter-031 (Old England: Old England, 746 words)
- Raw start snippet: The Prayer of the Men of Daleswood He said: “There were only twenty houses in Daleswood. A place you would scarcely have heard of. A village up top of the hills. “When the war came there was no more than thirty men there between sixteen and forty-five. They all went.
- Generated start snippet: The Prayer of the Men of Daleswood He said: "There were only twenty houses in Daleswood. A place you would scarcely have heard of. A village up top of the hills. "When the war came there was no more than thirty men there between sixteen and forty-five. They all went. "They all kept together; same battalion, same platoon. They was like that in Daleswood. Use...
- Preview start snippet: The Prayer of the Men of Daleswood He said: "There were only twenty houses in Daleswood. A place you would scarcely have heard of. A village up top of the hills. "When the war came there was no more than thirty men there between sixteen and forty-five. They all went. "They all kept together; same battalion, same platoon. They was like that in Daleswood. Use...
- Raw end snippet: of England’s cause and of how those men had upheld it, at sea and in crumbling cities. He thought of the battle whose echoes reached sometimes to that field, whispering to furrows and thorn trees that had never heard them before. He thought of the accursed tyrant’s cruel might, and of the lads that had faced it. He saw the romantic splendour of England’s ca...
- Generated end snippet: They had a railway now down in the valley. The sunlight glittering near the end of winter shone on a train that was marked with great white squares and red crosses on them. John Plowman stopped his horses and looked at the train. "An ambulance train," he said, "coming up from the coast." He thought of the lads he knew and wondered if any were there. He piti...


## Confirmations

- Only the 25 batch-3 slugs were inspected.
- No additional books were processed.
- app/client/assets/temp-books was inspected only and not modified.
- app/client/assets/books/cloudflare-export was not modified.
- No unrelated generated books were touched.
- npm run books:build was not run.
