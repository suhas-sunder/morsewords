# Pilot write batch 7 verification

Post-write QA pass for the 25 batch-7 first-time processed books.

## Totals

- Selected: 25
- Pass: 22
- Warn accepted: 3
- Fail: 0
- Accepted for main: 25
- Corrections applied during verification: 1

## Active quality-gate reports read

```json
{
  "startup": {
    "generatedBookCount": 155,
    "validStartupPreviewCount": 155,
    "previewAssetsUpdated": []
  },
  "titleStartDefault": {
    "generatedBooksAudited": 155,
    "acceptedGeneratedBooksAudited": 117,
    "correctionsApplied": 12,
    "acceptedBooksCorrected": 12,
    "acceptanceRevokedPendingCorrection": 0
  },
  "metadataSegmentation": {
    "generatedBooksAudited": 155,
    "acceptedBooksAudited": 117,
    "booksWithUnknownAuthor": 1,
    "unknownAuthorWithClearSourceAuthor": 0,
    "unknownAuthorRemainingJustified": 1,
    "authorCorrectionsApplied": 0,
    "titleCorrectionsApplied": 0,
    "defaultStartOrSegmentationCorrectionsApplied": 0,
    "acceptanceRevokedPendingCorrection": 0
  },
  "manualUiDefectFollowup": {
    "checked": 8,
    "acceptable": 8,
    "corrected": 0,
    "acceptanceRevokedPendingCorrection": 0,
    "needsManualReview": 0
  }
}
```

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

### a-japanese-blossom

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 34 files
- Preview asset inspected: public/book-previews/a-japanese-blossom.preview.json
- Title: pass: generated title is A Japanese Blossom
- Author: pass: generated author is Onoto Watanna
- Structure: standalone roman numeral sections
- Start boundary: pass: first default is Chapter 1 and starts from readable source content
- End boundary: pass: generated output ends at Chapter 29 before license/source tail material
- Sectioning: pass: 29 sections preserve standalone roman numeral sections
- Cleanup: pass: no source/license/transcriber/TOC/illustration/page-marker artifacts found in default playback
- Preview: pass: preview starts from chapter-001 and matches generated hash
- All-main-readable default: pass: all detected main readable sections are selected by default and default source order starts at first default section
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: A Japanese Blossom
- Author evidence: Author: Onoto Watanna
- Raw start: I THE children sat in a little semi-circle about their grandmother, listening intently as she read to them the last letter from their father in America. Ever since they could remember, his business as a tea merchant had tak
- Generated first section: I THE children sat in a little semi-circle about their grandmother, listening intently as she read to them the last letter from their father in America. Ever since they could remember, his business as a tea merchant had taken him away from Japan on long vis...
- Generated first default: I THE children sat in a little semi-circle about their grandmother, listening intently as she read to them the last letter from their father in America. Ever since they could remember, his business as a tea merchant had taken him away from Japan on long vis...
- Preview start: I THE children sat in a little semi-circle about their grandmother, listening intently as she read to them the last letter from their father in America. Ever since they could remember, his business as a tea merchant had taken him away from Japan on long vis...
- Raw end: you.” They drew in about him, their small, eager faces entranced at once. He smiled about the circle, touched a little head here and there, and then began his tale: “Once upon a time—” ------------------------------------------------------------------------
- Generated end: u just now promised you’d be my house-keeper.” “In Japan,” said Plum Blossom. Taro had finished whittling the bamboo arrow he had been industriously fashioning. “Pleese, my father, tell now thad story of yourself.” “Yes?” “Oh do.” All of the children chorus...

### at-the-earth-s-core

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 20 files
- Preview asset inspected: public/book-previews/at-the-earth-s-core.preview.json
- Title: pass: generated title is At the Earth's Core
- Author: pass: generated author is Edgar Rice Burroughs
- Structure: standalone roman numeral sections
- Start boundary: pass: first default is Chapter 1 and starts from readable source content
- End boundary: pass: generated output ends at Chapter 15 before license/source tail material
- Sectioning: pass: 15 sections preserve standalone roman numeral sections
- Cleanup: pass: no source/license/transcriber/TOC/illustration/page-marker artifacts found in default playback
- Preview: pass: preview starts from chapter-001 and matches generated hash
- All-main-readable default: pass: all detected main readable sections are selected by default and default source order starts at first default section
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: At the Earth's Core
- Author evidence: Author: Edgar Rice Burroughs
- Raw start: I TOWARD THE ETERNAL FIRES I was born in Connecticut about thirty years ago. My name is David Innes. My father was a wealthy mine owner. When I was nineteen he died. All his property was to be mine when I had attained my majority--provided that I had de
- Generated first section: I TOWARD THE ETERNAL FIRES I was born in Connecticut about thirty years ago. My name is David Innes. My father was a wealthy mine owner. When I was nineteen he died. All his property was to be mine when I had attained my majority--provided that I had devote...
- Generated first default: I TOWARD THE ETERNAL FIRES I was born in Connecticut about thirty years ago. My name is David Innes. My father was a wealthy mine owner. When I was nineteen he died. All his property was to be mine when I had attained my majority--provided that I had devote...
- Preview start: I TOWARD THE ETERNAL FIRES I was born in Connecticut about thirty years ago. My name is David Innes. My father was a wealthy mine owner. When I was nineteen he died. All his property was to be mine when I had attained my majority--provided that I had devote...
- Raw end: gh into the bottom of one of her great island seas, or among some savage race far, far from the land of his heart's desire? Does the answer lie somewhere upon the bosom of the broad Sahara, at the end of two tiny wires, hidden beneath a lost cairn? I wonder.
- Generated end: ing to Pellucidar--but always was I unsuccessful. And always do these awful questions harass me when I think of David Innes and his strange adventures. Did the Arabs murder him, after all, just on the eve of his departure? Or, did he again turn the nose of...

### can-you-forgive-her

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 85 files
- Preview asset inspected: public/book-previews/can-you-forgive-her.preview.json
- Title: pass: generated title is Can You Forgive Her?
- Author: pass: generated author is Anthony Trollope
- Structure: chapter-based roman numerals with volume divisions
- Start boundary: pass: first default is Chapter 1 and starts from readable source content
- End boundary: pass: generated output ends at Chapter 80 before license/source tail material
- Sectioning: pass: 80 sections preserve chapter-based roman numerals with volume divisions
- Cleanup: pass: no source/license/transcriber/TOC/illustration/page-marker artifacts found in default playback
- Preview: pass: preview starts from chapter-001 and matches generated hash
- All-main-readable default: pass: all detected main readable sections are selected by default and default source order starts at first default section
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Can You Forgive Her?
- Author evidence: Author: Anthony Trollope
- Raw start: CHAPTER I. Mr. Vavasor and His Daughter. Whether or no, she, whom you are to forgive, if you can, did or did not belong to the Upper Ten Thousand of this our English world, I am not prepared to say with any strength of affirmation. By blood she was connecte
- Generated first section: CHAPTER I. Mr. Vavasor and His Daughter. Whether or no, she, whom you are to forgive, if you can, did or did not belong to the Upper Ten Thousand of this our English world, I am not prepared to say with any strength of affirmation. By blood she was connecte...
- Generated first default: CHAPTER I. Mr. Vavasor and His Daughter. Whether or no, she, whom you are to forgive, if you can, did or did not belong to the Upper Ten Thousand of this our English world, I am not prepared to say with any strength of affirmation. By blood she was connecte...
- Preview start: CHAPTER I. Mr. Vavasor and His Daughter. Whether or no, she, whom you are to forgive, if you can, did or did not belong to the Upper Ten Thousand of this our English world, I am not prepared to say with any strength of affirmation. By blood she was connecte...
- Raw end: ffairs she had received more than she had deserved. All her friends, except her husband, thought so. But as they have all forgiven her, including even Lady Midlothian herself, I hope that they who have followed her story to its close will not be less generous.
- Generated end: en saying." "Oh, John, I am so happy. It is so much more than I have deserved. I hope,--that is, I sometimes think--" "Think what, dearest?" "I hope nothing that I have ever said has driven you to it." "I'd do more than that, dear, to make you happy," he sa...

### despair-s-last-journey

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 34 files
- Preview asset inspected: public/book-previews/despair-s-last-journey.preview.json
- Title: pass: generated title is Despair's Last Journey
- Author: pass: generated author is David Christie Murray
- Structure: chapter-based roman numerals
- Start boundary: pass: first default is Chapter 1 and starts from readable source content
- End boundary: pass: generated output ends at Chapter 29 before license/source tail material
- Sectioning: pass: 29 sections preserve chapter-based roman numerals
- Cleanup: pass: no source/license/transcriber/TOC/illustration/page-marker artifacts found in default playback
- Preview: pass: preview starts from chapter-001 and matches generated hash
- All-main-readable default: pass: all detected main readable sections are selected by default and default source order starts at first default section
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Despair's Last Journey
- Author evidence: Author: David Christie Murray
- Raw start: CHAPTER I The first hint of memory showed a hearth, a fire, and a woman sitting in a chair with an outstretched finger. An invisible hand bunched his petticoats behind, and at his feet was a rug made of looped fragments of cloth of various colours. He lurched
- Generated first section: CHAPTER I The first hint of memory showed a hearth, a fire, and a woman sitting in a chair with an outstretched finger. An invisible hand bunched his petticoats behind, and at his feet was a rug made of looped fragments of cloth of various colours. He lurch...
- Generated first default: CHAPTER I The first hint of memory showed a hearth, a fire, and a woman sitting in a chair with an outstretched finger. An invisible hand bunched his petticoats behind, and at his feet was a rug made of looped fragments of cloth of various colours. He lurch...
- Preview start: CHAPTER I The first hint of memory showed a hearth, a fire, and a woman sitting in a chair with an outstretched finger. An invisible hand bunched his petticoats behind, and at his feet was a rug made of looped fragments of cloth of various colours. He lurch...
- Raw end: ‘Duty!’ said the voice. ‘Bid the fire-flowers blossom in the wasted spaces of your own soul.’ His tears gripped him at the throat with art almost intolerable anguish, and with such a passion as no man can experience twice in life he renounced his own despair.
- Generated end: airy-land. The time will come when there will be left no token of this desolation. Nature endures no lasting loss, and is the soul less vital?’ And he believed the things it was ordained that he should believe, and he bowed his head in prayer with tears of...

### five-children-and-it

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 15 files
- Preview asset inspected: public/book-previews/five-children-and-it.preview.json
- Title: pass: generated title is Five Children and It
- Author: pass: generated author is E. Nesbit
- Structure: chapter-based roman numerals
- Start boundary: pass: first default is Chapter 1 and starts from readable source content
- End boundary: pass: generated output ends at Chapter 10 before license/source tail material
- Sectioning: pass: 10 sections preserve chapter-based roman numerals
- Cleanup: pass: no source/license/transcriber/TOC/illustration/page-marker artifacts found in default playback
- Preview: pass: preview starts from chapter-001 and matches generated hash
- All-main-readable default: pass: all detected main readable sections are selected by default and default source order starts at first default section
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Five Children and It
- Author evidence: Author: E. Nesbit
- Raw start: CHAPTER I BEAUTIFUL AS THE DAY The house was three miles from the station, but, before the dusty hired hack had rattled along for five minutes, the children began to put their heads out of the carriage window and say, "Aren't we nearly there?" And every tim
- Generated first section: CHAPTER I BEAUTIFUL AS THE DAY The house was three miles from the station, but, before the dusty hired hack had rattled along for five minutes, the children began to put their heads out of the carriage window and say, "Aren't we nearly there?" And every tim...
- Generated first default: CHAPTER I BEAUTIFUL AS THE DAY The house was three miles from the station, but, before the dusty hired hack had rattled along for five minutes, the children began to put their heads out of the carriage window and say, "Aren't we nearly there?" And every tim...
- Preview start: CHAPTER I BEAUTIFUL AS THE DAY The house was three miles from the station, but, before the dusty hired hack had rattled along for five minutes, the children began to put their heads out of the carriage window and say, "Aren't we nearly there?" And every tim...
- Raw end: I never want to," said Robert earnestly. They did see it again, of course, but not in this story. And it was not in a sand-pit either, but in a very, very, very different place. It was in a---- But I must say no more. * * * * *
- Generated end: monds had not been lost at all. Lord Chittenden had taken them to be re-set and cleaned, and the maid who knew about it had gone for a holiday. So that was all right. "I wonder if we ever shall see the Psammead again," said Jane wistfully as they walked in...

### flatland-a-romance-of-many-dimensions

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 27 files
- Preview asset inspected: public/book-previews/flatland-a-romance-of-many-dimensions.preview.json
- Title: pass: generated title is Flatland: A Romance of Many Dimensions
- Author: pass: generated author is Edwin Abbott Abbott
- Structure: section-based divisions
- Start boundary: pass: first default is Section 1 - Part I: This World - Of the Nature of Flatland and starts from readable source content
- End boundary: pass: generated output ends at Section 22 - How I then tried to diffuse the Theory before license/source tail material
- Sectioning: pass: 22 sections preserve section-based divisions
- Cleanup: pass: no source/license/transcriber/TOC/illustration/page-marker artifacts found in default playback
- Preview: pass: preview starts from chapter-001 and matches generated hash
- All-main-readable default: pass: all detected main readable sections are selected by default and default source order starts at first default section
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Flatland: A Romance of Many Dimensions
- Author evidence: Author: Edwin Abbott Abbott
- Raw start: PART I: THIS WORLD "Be patient, for the world is broad and wide." Section 1. Of the Nature of Flatland I call our world Flatland, not because we call it so, but to make its nature clearer to you, my happy readers, who are privileged to live in Space. I
- Generated first section: PART I: THIS WORLD "Be patient, for the world is broad and wide." Section 1. Of the Nature of Flatland I call our world Flatland, not because we call it so, but to make its nature clearer to you, my happy readers, who are privileged to live in Space. Imagin...
- Generated first default: PART I: THIS WORLD "Be patient, for the world is broad and wide." Section 1. Of the Nature of Flatland I call our world Flatland, not because we call it so, but to make its nature clearer to you, my happy readers, who are privileged to live in Space. Imagin...
- Preview start: PART I: THIS WORLD "Be patient, for the world is broad and wide." Section 1. Of the Nature of Flatland I call our world Flatland, not because we call it so, but to make its nature clearer to you, my happy readers, who are privileged to live in Space. Imagin...
- Raw end: None; nay, when even this hard wall that bars me from my freedom, these very tablets on which I am writing, and all the substantial realities of Flatland itself, appear no better than the offspring of a diseased imagination, or the baseless fabric of a dream.
- Generated end: t shape of the once-seen, oft-regretted Cube; and in my nightly visions the mysterious precept, "Upward, not Northward", haunts me like a soul-devouring Sphinx. It is part of the martyrdom which I endure for the cause of the Truth that there are seasons of...

### herland

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 17 files
- Preview asset inspected: public/book-previews/herland.preview.json
- Title: pass: generated title is Herland
- Author: pass: generated author is Charlotte Perkins Gilman
- Structure: chapter-based arabic numbers
- Start boundary: pass: first default is Chapter 1 and starts from readable source content
- End boundary: pass: generated output ends at Chapter 12 before license/source tail material
- Sectioning: pass: 12 sections preserve chapter-based arabic numbers
- Cleanup: pass: no source/license/transcriber/TOC/illustration/page-marker artifacts found in default playback
- Preview: pass: preview starts from chapter-001 and matches generated hash
- All-main-readable default: pass: all detected main readable sections are selected by default and default source order starts at first default section
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Herland
- Author evidence: Author: Charlotte Perkins Gilman
- Raw start: CHAPTER 1. A Not Unnatural Enterprise This is written from memory, unfortunately. If I could have brought with me the material I so carefully prepared, this would be a very different story. Whole books full of notes, carefully copied records, firsthand descr
- Generated first section: CHAPTER 1. A Not Unnatural Enterprise This is written from memory, unfortunately. If I could have brought with me the material I so carefully prepared, this would be a very different story. Whole books full of notes, carefully copied records, firsthand desc...
- Generated first default: CHAPTER 1. A Not Unnatural Enterprise This is written from memory, unfortunately. If I could have brought with me the material I so carefully prepared, this would be a very different story. Whole books full of notes, carefully copied records, firsthand desc...
- Preview start: CHAPTER 1. A Not Unnatural Enterprise This is written from memory, unfortunately. If I could have brought with me the material I so carefully prepared, this would be a very different story. Whole books full of notes, carefully copied records, firsthand desc...
- Raw end: othing. She must not be in any way distressed, while the whole nation waited on her Great Work. Finally Jeff and I were called in. Somel and Zava were there, and Ellador, with many others that we knew. They had a great globe, quite fairly mapped out from the
- Generated end: we had told them about. Never a shocked expression of the face or exclamation of revolt had warned us; they had been extracting the evidence without our knowing it all this time, and now were studying with the most devout earnestness the matter they had pre...

### hero-myths-and-legends-of-the-british-race

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 21 files
- Preview asset inspected: public/book-previews/hero-myths-and-legends-of-the-british-race.preview.json
- Title: pass: generated title is Hero-Myths & Legends of the British Race
- Author: pass: generated author is M. I. Ebbutt
- Structure: chapter-based roman numerals
- Start boundary: pass: first default is Chapter 1 - BEOWULF and starts from readable source content
- End boundary: pass: generated output ends at Chapter 16 - HEREWARD THE WAKE before license/source tail material
- Sectioning: pass: 16 sections preserve chapter-based roman numerals
- Cleanup: pass: no source/license/transcriber/TOC/illustration/page-marker artifacts found in default playback
- Preview: pass: preview starts from chapter-001 and matches generated hash
- All-main-readable default: pass: all detected main readable sections are selected by default and default source order starts at first default section
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Hero-Myths & Legends of the British Race
- Author evidence: Author: M. I. Ebbutt
- Raw start: CHAPTER I: BEOWULF Introduction The figure which meets us as we enter on the study of Heroes of the British Race is one which appeals to us in a very special way, since he is the one hero in whose legend we may see the ideals of our English forefathers befo
- Generated first section: CHAPTER I: BEOWULF Introduction The figure which meets us as we enter on the study of Heroes of the British Race is one which appeals to us in a very special way, since he is the one hero in whose legend we may see the ideals of our English forefathers befo...
- Generated first default: CHAPTER I: BEOWULF Introduction The figure which meets us as we enter on the study of Heroes of the British Race is one which appeals to us in a very special way, since he is the one hero in whose legend we may see the ideals of our English forefathers befo...
- Preview start: CHAPTER I: BEOWULF Introduction The figure which meets us as we enter on the study of Heroes of the British Race is one which appeals to us in a very special way, since he is the one hero in whose legend we may see the ideals of our English forefathers befo...
- Raw end: es in marriage Havelok and Goldborough, 85; Abbot of St. Mary's Abbey, in, 321 YORKSHIRE. Barnesdale, forest in, once dwelling-place of Robin Hood, 314, 315 YULETIDE. King Arthur's knights keep, 267 Z ZACCHÆUS. Grandfather of Judas, 57
- Generated end: London to see king, 241; the king pardons, 243; shoots apple from son's head, 245, 246; receives royal favours from king and queen, 246 WILLIAM WENDUT. Second son of Grim; accompanies Havelok to Denmark, 87 WINCHESTER. Godrich takes Goldborough from, to Dov...

### howards-end

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 45 files
- Preview asset inspected: public/book-previews/howards-end.preview.json
- Title: pass: generated title is Howards End
- Author: pass: generated author is E. M. Forster
- Structure: chapter-based roman numerals
- Start boundary: pass: first default is Chapter 1 and starts from readable source content
- End boundary: pass: generated output ends at Chapter 40 before license/source tail material
- Sectioning: pass: 40 sections preserve chapter-based roman numerals
- Cleanup: pass: no source/license/transcriber/TOC/illustration/page-marker artifacts found in default playback
- Preview: pass: preview starts from chapter-001 and matches generated hash
- All-main-readable default: pass: all detected main readable sections are selected by default and default source order starts at first default section
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Howards End
- Author evidence: Author: E. M. Forster
- Raw start: CHAPTER I One may as well begin with Helen’s letters to her sister. “Howards End, “Tuesday. “Dearest Meg, “It isn’t going to be what we expected. It is old and little, and altogether delightful--red brick. We can scarcely pack in as it is, and the dear
- Generated first section: CHAPTER I One may as well begin with Helen’s letters to her sister. “Howards End, “Tuesday. “Dearest Meg, “It isn’t going to be what we expected. It is old and little, and altogether delightful--red brick. We can scarcely pack in as it is, and the dear know...
- Generated first default: CHAPTER I One may as well begin with Helen’s letters to her sister. “Howards End, “Tuesday. “Dearest Meg, “It isn’t going to be what we expected. It is old and little, and altogether delightful--red brick. We can scarcely pack in as it is, and the dear know...
- Preview start: CHAPTER I One may as well begin with Helen’s letters to her sister. “Howards End, “Tuesday. “Dearest Meg, “It isn’t going to be what we expected. It is old and little, and altogether delightful--red brick. We can scarcely pack in as it is, and the dear know...
- Raw end: ourists who pretend each hotel is their home.” “I can’t pretend very long,” said Helen. “Sitting under this tree one forgets, but I know that to-morrow I shall see the moon rise out of Germany. Not all your goodness can alter the facts of the case. Unless you
- Generated end: ed into the hedge that divided it from the farm. An old gap, which Mr. Wilcox had filled up, had reappeared, and her track through the dew followed the path that he had turfed over, when he improved the garden and made it possible for games. “This is not qu...

### king-arthur-and-the-knights-of-the-round-table

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 20 files
- Preview asset inspected: public/book-previews/king-arthur-and-the-knights-of-the-round-table.preview.json
- Title: pass: generated title is King Arthur and the Knights of the Round Table
- Author: pass: generated author is Sir Thomas Malory
- Structure: standalone roman numeral sections
- Start boundary: pass: first default is Chapter 1 and starts from readable source content
- End boundary: pass: generated output ends at Chapter 15 before license/source tail material
- Sectioning: pass: 15 sections preserve standalone roman numeral sections
- Cleanup: pass: no source/license/transcriber/TOC/illustration/page-marker artifacts found in default playback
- Preview: pass: preview starts from chapter-001 and matches generated hash
- All-main-readable default: pass: all detected main readable sections are selected by default and default source order starts at first default section
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: King Arthur and the Knights of the Round Table
- Author evidence: Author: Sir Thomas Malory
- Raw start: I MERLIN FORETELLS THE BIRTH OF ARTHUR King Vortigern the usurper sat upon his throne in London, when, suddenly, upon a certain day, ran in a breathless messenger, and cried aloud-- "Arise, Lord King, for the enemy is come; even Ambrosius and Uther, upon w
- Generated first section: I MERLIN FORETELLS THE BIRTH OF ARTHUR King Vortigern the usurper sat upon his throne in London, when, suddenly, upon a certain day, ran in a breathless messenger, and cried aloud-- "Arise, Lord King, for the enemy is come; even Ambrosius and Uther, upon wh...
- Generated first default: I MERLIN FORETELLS THE BIRTH OF ARTHUR King Vortigern the usurper sat upon his throne in London, when, suddenly, upon a certain day, ran in a breathless messenger, and cried aloud-- "Arise, Lord King, for the enemy is come; even Ambrosius and Uther, upon wh...
- Preview start: I MERLIN FORETELLS THE BIRTH OF ARTHUR King Vortigern the usurper sat upon his throne in London, when, suddenly, upon a certain day, ran in a breathless messenger, and cried aloud-- "Arise, Lord King, for the enemy is come; even Ambrosius and Uther, upon wh...
- Raw end: the Vale of Avilion to heal me of my grievous wound, and if ye see me no more, pray for my soul." Then the three queens kneeled down around the king and sorely wept and wailed, and the barge went forth to sea, and departed slowly out of Sir Bedivere's sight.
- Generated end: hree queens received him, and he laid his head upon the lap of one of them, who cried, "Alas! dear brother, why have ye tarried so long, for your wound hath taken cold?" With that the barge put from the land, and when Sir Bedivere saw it departing, he cried...

### lord-jim

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 50 files
- Preview asset inspected: public/book-previews/lord-jim.preview.json
- Title: pass: generated title is Lord Jim
- Author: pass: generated author is Joseph Conrad
- Structure: chapter-based arabic numbers
- Start boundary: pass: first default is Chapter 1 and starts from readable source content
- End boundary: pass: generated output ends at Chapter 45 before license/source tail material
- Sectioning: pass: 45 sections preserve chapter-based arabic numbers
- Cleanup: pass: no source/license/transcriber/TOC/illustration/page-marker artifacts found in default playback
- Preview: pass: preview starts from chapter-001 and matches generated hash
- All-main-readable default: pass: all detected main readable sections are selected by default and default source order starts at first default section
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Lord Jim
- Author evidence: Author: Joseph Conrad
- Raw start: CHAPTER 1 He was an inch, perhaps two, under six feet, powerfully built, and he advanced straight at you with a slight stoop of the shoulders, head forward, and a fixed from-under stare which made you think of a charging bull. His voice was deep, loud, and h
- Generated first section: CHAPTER 1 He was an inch, perhaps two, under six feet, powerfully built, and he advanced straight at you with a slight stoop of the shoulders, head forward, and a fixed from-under stare which made you think of a charging bull. His voice was deep, loud, and...
- Generated first default: CHAPTER 1 He was an inch, perhaps two, under six feet, powerfully built, and he advanced straight at you with a slight stoop of the shoulders, head forward, and a fixed from-under stare which made you think of a charging bull. His voice was deep, loud, and...
- Preview start: CHAPTER 1 He was an inch, perhaps two, under six feet, powerfully built, and he advanced straight at you with a slight stoop of the shoulders, head forward, and a fixed from-under stare which made you think of a charging bull. His voice was deep, loud, and...
- Raw end: ort of soundless, inert life in Stein’s house. Stein has aged greatly of late. He feels it himself, and says often that he is “preparing to leave all this; preparing to leave . . .” while he waves his hand sadly at his butterflies.’ September 1899--July 1900.
- Generated end: ng after all? Now he is no more, there are days when the reality of his existence comes to me with an immense, with an overwhelming force; and yet upon my honour there are moments, too when he passes from my eyes like a disembodied spirit astray amongst the...

### love-among-the-chickens

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 28 files
- Preview asset inspected: public/book-previews/love-among-the-chickens.preview.json
- Title: pass: generated title is Love Among the Chickens
- Author: pass: generated author is P. G. Wodehouse
- Structure: standalone roman numeral sections
- Start boundary: pass: first default is Chapter 1 and starts from readable source content
- End boundary: pass: generated output ends at Chapter 23 before license/source tail material
- Sectioning: pass: 23 sections preserve standalone roman numeral sections
- Cleanup: pass: no source/license/transcriber/TOC/illustration/page-marker artifacts found in default playback
- Preview: pass: preview starts from chapter-001 and matches generated hash
- All-main-readable default: pass: all detected main readable sections are selected by default and default source order starts at first default section
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Love Among the Chickens
- Author evidence: Author: P. G. Wodehouse
- Raw start: I Mr. Jeremy Garnet stood with his back to the empty grate--for the time was summer--watching with a jaundiced eye the removal of his breakfast things. "Mrs. Medley," he said. "Sir?" "Would it bore you if I became auto-biographical?" "Sir?" "Never mind.
- Generated first section: I Mr. Jeremy Garnet stood with his back to the empty grate--for the time was summer--watching with a jaundiced eye the removal of his breakfast things. "Mrs. Medley," he said. "Sir?" "Would it bore you if I became auto-biographical?" "Sir?" "Never mind. I m...
- Generated first default: I Mr. Jeremy Garnet stood with his back to the empty grate--for the time was summer--watching with a jaundiced eye the removal of his breakfast things. "Mrs. Medley," he said. "Sir?" "Would it bore you if I became auto-biographical?" "Sir?" "Never mind. I m...
- Preview start: I Mr. Jeremy Garnet stood with his back to the empty grate--for the time was summer--watching with a jaundiced eye the removal of his breakfast things. "Mrs. Medley," he said. "Sir?" "Would it bore you if I became auto-biographical?" "Sir?" "Never mind. I m...
- Raw end: wn there. I'll write you the address. Good-by. Bless you. Good-by, Mrs. Garnet. THE BRIDE AND BRIDEGROOM (_simultaneously, with a smile apiece_). Good-by. [_They catch the train and live happily ever afterwards._] * * * * *
- Generated end: e got a new idea. The best ever, 'pon my word it is. I'm going to start a duck farm and run it without water. What? You'll miss your train? Oh, no, you won't. There's plenty of time. My theory is, you see, that ducks get thin by taking exercise and swimming...

### parnassus-on-wheels

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 11 files
- Preview asset inspected: public/book-previews/parnassus-on-wheels.preview.json
- Title: pass: generated title is Parnassus on Wheels
- Author: pass: generated author is Christopher Morley
- Structure: chapter-based word ordinals
- Start boundary: pass: first default is Chapter 1 and starts from readable source content
- End boundary: pass: generated output ends at Chapter 6 before license/source tail material
- Sectioning: pass: 6 sections preserve chapter-based word ordinals
- Cleanup: pass: no source/license/transcriber/TOC/illustration/page-marker artifacts found in default playback
- Preview: pass: preview starts from chapter-001 and matches generated hash
- All-main-readable default: pass: all detected main readable sections are selected by default and default source order starts at first default section
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Parnassus on Wheels
- Author evidence: Author: Christopher Morley
- Raw start: CHAPTER ONE I wonder if there isn't a lot of bunkum in higher education? I never found that people who were learned in logarithms and other kinds of poetry were any quicker in washing dishes or darning socks. I've done a good deal of reading when I could, an
- Generated first section: CHAPTER ONE I wonder if there isn't a lot of bunkum in higher education? I never found that people who were learned in logarithms and other kinds of poetry were any quicker in washing dishes or darning socks. I've done a good deal of reading when I could, a...
- Generated first default: CHAPTER ONE I wonder if there isn't a lot of bunkum in higher education? I never found that people who were learned in logarithms and other kinds of poetry were any quicker in washing dishes or darning socks. I've done a good deal of reading when I could, a...
- Preview start: CHAPTER ONE I wonder if there isn't a lot of bunkum in higher education? I never found that people who were learned in logarithms and other kinds of poetry were any quicker in washing dishes or darning socks. I've done a good deal of reading when I could, a...
- Raw end: d when I had finished my coffee and beans and bacon I noticed with some amusement that the Professor had painted out the line about Shakespeare, Charles Lamb, and so on, and had substituted new lettering. The sign now read: H. MCGILL'S
- Generated end: idently intending to substitute mine. That was something I had not thought of. However, I might as well make the best of it. I dressed promptly, repacked my bag, and hurried downstairs for breakfast. The long table was nearly empty, but one or two men sitti...

### pollyanna

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 37 files
- Preview asset inspected: public/book-previews/pollyanna.preview.json
- Title: pass: generated title is Pollyanna
- Author: pass: generated author is Eleanor H. Porter
- Structure: chapter-based roman numerals
- Start boundary: pass: first default is Chapter 1 - MISS POLLY and starts from readable source content
- End boundary: pass: generated output ends at Chapter 32 - WHICH IS A LETTER FROM POLLYANNA before license/source tail material
- Sectioning: pass: 32 sections preserve chapter-based roman numerals
- Cleanup: pass: no source/license/transcriber/TOC/illustration/page-marker artifacts found in default playback
- Preview: pass: preview starts from chapter-001 and matches generated hash
- All-main-readable default: pass: all detected main readable sections are selected by default and default source order starts at first default section
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Pollyanna
- Author evidence: Author: Eleanor H. Porter
- Raw start: CHAPTER I. MISS POLLY Miss Polly Harrington entered her kitchen a little hurriedly this June morning. Miss Polly did not usually make hurried movements; she specially prided herself on her repose of manner. But to-day she was hurrying--actually hurrying. Nan
- Generated first section: CHAPTER I. MISS POLLY Miss Polly Harrington entered her kitchen a little hurriedly this June morning. Miss Polly did not usually make hurried movements; she specially prided herself on her repose of manner. But to-day she was hurrying--actually hurrying. Na...
- Generated first default: CHAPTER I. MISS POLLY Miss Polly Harrington entered her kitchen a little hurriedly this June morning. Miss Polly did not usually make hurried movements; she specially prided herself on her repose of manner. But to-day she was hurrying--actually hurrying. Na...
- Preview start: CHAPTER I. MISS POLLY Miss Polly Harrington entered her kitchen a little hurriedly this June morning. Miss Polly did not usually make hurried movements; she specially prided herself on her repose of manner. But to-day she was hurrying--actually hurrying. Na...
- Raw end: I'm glad for everything. Why, I'm glad now I lost my legs for a while, for you never, never know how perfectly lovely legs are till you haven't got them--that go, I mean. I'm going to walk eight steps to-morrow. “With heaps of love to everybody, “POLLYANNA.”
- Generated end: ! Now I don't mind being here almost ten months, and I didn't miss the wedding, anyhow. Wasn't that just like you, Aunt Polly, to come on here and get married right beside my bed, so I could see you. You always do think of the gladdest things! “Pretty soon,...

### shen-of-the-sea-a-book-for-children

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 21 files
- Preview asset inspected: public/book-previews/shen-of-the-sea-a-book-for-children.preview.json
- Title: pass: generated title is Shen of the Sea: A Book for Children
- Author: pass: generated author is Arthur Bowie Chrisman
- Structure: story or titled-section headings
- Start boundary: pass: first default is Shen Of The Sea - SHEN OF THE SEA and starts from readable source content
- End boundary: pass: generated output ends at As Hai Low Kept House - AS HAI LOW KEPT HOUSE before license/source tail material
- Sectioning: pass: 16 sections preserve story or titled-section headings
- Cleanup: pass: no source/license/transcriber/TOC/illustration/page-marker artifacts found in default playback
- Preview: pass: preview starts from chapter-001 and matches generated hash
- All-main-readable default: pass: all detected main readable sections are selected by default and default source order starts at first default section
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Shen of the Sea: A Book for Children
- Author evidence: Author: Arthur Bowie Chrisman
- Raw start: SHEN OF THE SEA Kua Hai City stands on a plain in northern China. The plain is called Wa Tien, and it is very smooth and fertile, giving many large melons. . . . Life there is good. The plain is likewise extremely low. Any reliabl
- Generated first section: SHEN OF THE SEA Kua Hai City stands on a plain in northern China. The plain is called Wa Tien, and it is very smooth and fertile, giving many large melons. . . . Life there is good. The plain is likewise extremely low. Any reliable geography will tell you t...
- Generated first default: SHEN OF THE SEA Kua Hai City stands on a plain in northern China. The plain is called Wa Tien, and it is very smooth and fertile, giving many large melons. . . . Life there is good. The plain is likewise extremely low. Any reliable geography will tell you t...
- Preview start: SHEN OF THE SEA Kua Hai City stands on a plain in northern China. The plain is called Wa Tien, and it is very smooth and fertile, giving many large melons. . . . Life there is good. The plain is likewise extremely low. Any reliable geography will tell you t...
- Raw end: on astonished Hai Low’s head. The mace of authority was placed in his hand. And “Hail,” and “Hail,” and “Hail.” Thus did Hai Low, in chase of an unknown traveler, become King upon a throne. His days of housekeeping were ended. And so is the book . . . ended.
- Generated end: curious rabble he thought a rebel army. So thinking, he called for his horse. . . . And what became of him no one can say. He vanished, for good and all. The royal generals, instead of ordering a fight, promptly knelt before Hai Low and bumped their heads i...

### the-adventures-of-pinocchio

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 41 files
- Preview asset inspected: public/book-previews/the-adventures-of-pinocchio.preview.json
- Title: pass: generated title is The Adventures of Pinocchio
- Author: pass: generated author is Carlo Collodi
- Structure: chapter-based arabic numbers
- Start boundary: pass: first default is Chapter 1 and starts from readable source content
- End boundary: pass: generated output ends at Chapter 36 before license/source tail material
- Sectioning: pass: 36 sections preserve chapter-based arabic numbers
- Cleanup: pass: no source/license/transcriber/TOC/illustration/page-marker artifacts found in default playback
- Preview: pass: preview starts from chapter-001 and matches generated hash
- All-main-readable default: pass: all detected main readable sections are selected by default and default source order starts at first default section
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The Adventures of Pinocchio
- Author evidence: Author: Carlo Collodi
- Raw start: CHAPTER 1 How it happened that Mastro Cherry, carpenter, found a piece of wood that wept and laughed like a child. Centuries ago there lived-- “A king!” my little readers will say immediately. No, children, you are mistaken. Once upon a time there was a p
- Generated first section: CHAPTER 1 How it happened that Mastro Cherry, carpenter, found a piece of wood that wept and laughed like a child. Centuries ago there lived-- “A king!” my little readers will say immediately. No, children, you are mistaken. Once upon a time there was a pie...
- Generated first default: CHAPTER 1 How it happened that Mastro Cherry, carpenter, found a piece of wood that wept and laughed like a child. Centuries ago there lived-- “A king!” my little readers will say immediately. No, children, you are mistaken. Once upon a time there was a pie...
- Preview start: CHAPTER 1 How it happened that Mastro Cherry, carpenter, found a piece of wood that wept and laughed like a child. Centuries ago there lived-- “A king!” my little readers will say immediately. No, children, you are mistaken. Once upon a time there was a pie...
- Raw end: ing against a chair, head turned to one side, arms hanging limp, and legs twisted under him. After a long, long look, Pinocchio said to himself with great content: “How ridiculous I was as a Marionette! And how happy I am, now that I have become a real boy!”
- Generated end: ed Pinocchio, as he ran and jumped on his Father’s neck. “This sudden change in our house is all your doing, my dear Pinocchio,” answered Geppetto. “What have I to do with it?” “Just this. When bad boys become good and kind, they have the power of making th...

### the-invisible-man-a-grotesque-romance

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 33 files
- Preview asset inspected: public/book-previews/the-invisible-man-a-grotesque-romance.preview.json
- Title: pass: generated title is The Invisible Man: A Grotesque Romance
- Author: pass: generated author is H. G. Wells
- Structure: chapter-based roman numerals
- Start boundary: pass: first default is Chapter 1 and starts from readable source content
- End boundary: pass: generated output ends at Chapter 28 before license/source tail material
- Sectioning: pass: 28 sections preserve chapter-based roman numerals
- Cleanup: pass: no source/license/transcriber/TOC/illustration/page-marker artifacts found in default playback
- Preview: pass: preview starts from chapter-001 and matches generated hash
- All-main-readable default: pass: all detected main readable sections are selected by default and default source order starts at first default section
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The Invisible Man: A Grotesque Romance
- Author evidence: Author: H. G. Wells
- Raw start: CHAPTER I. THE STRANGE MAN’S ARRIVAL The stranger came early in February, one wintry day, through a biting wind and a driving snow, the last snowfall of the year, over the down, walking from Bramblehurst railway station, and carrying a little black portmante
- Generated first section: CHAPTER I. THE STRANGE MAN’S ARRIVAL The stranger came early in February, one wintry day, through a biting wind and a driving snow, the last snowfall of the year, over the down, walking from Bramblehurst railway station, and carrying a little black portmant...
- Generated first default: CHAPTER I. THE STRANGE MAN’S ARRIVAL The stranger came early in February, one wintry day, through a biting wind and a driving snow, the last snowfall of the year, over the down, walking from Bramblehurst railway station, and carrying a little black portmant...
- Preview start: CHAPTER I. THE STRANGE MAN’S ARRIVAL The stranger came early in February, one wintry day, through a biting wind and a driving snow, the last snowfall of the year, over the down, walking from Bramblehurst railway station, and carrying a little black portmant...
- Raw end: l dream of his life. And though Kemp has fished unceasingly, no human being save the landlord knows those books are there, with the subtle secret of invisibility and a dozen other strange secrets written therein. And none other will know of them until he dies.
- Generated end: s move painfully. “Hex, little two up in the air, cross and a fiddle-de-dee. Lord! what a one he was for intellect!” Presently he relaxes and leans back, and blinks through his smoke across the room at things invisible to other eyes. “Full of secrets,” he s...

### the-virginian-a-horseman-of-the-plains

- Write action: first-time processed
- Verification status: warn accepted
- Generated output inspected: 41 files
- Preview asset inspected: public/book-previews/the-virginian-a-horseman-of-the-plains.preview.json
- Title: pass: generated title is The Virginian: A Horseman of the Plains
- Author: pass: generated author is Owen Wister
- Structure: roman-numbered titled sections with lowercase-prose false-positive safeguard
- Start boundary: pass: first default is Chapter 1 - ENTER THE MAN and starts from readable source content
- End boundary: pass: generated output ends at Chapter 36 - AT DUNBARTON before license/source tail material
- Sectioning: pass: 36 sections preserve roman-numbered titled sections with lowercase-prose false-positive safeguard
- Cleanup: pass: no source/license/transcriber/TOC/illustration/page-marker artifacts found in default playback
- Preview: pass: preview starts from chapter-001 and matches generated hash
- All-main-readable default: pass: all detected main readable sections are selected by default and default source order starts at first default section
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied: none
- Remaining warnings: Accepted with warning: dry-run over-counted two lowercase prose false positives; write output preserves 36 roman-numbered chapter headings.

Supporting snippets:

- Title evidence: Title: The Virginian: A Horseman of the Plains
- Author evidence: Author: Owen Wister
- Raw start: I. ENTER THE MAN Some notable sight was drawing the passengers, both men and women, to the window; and therefore I rose and crossed the car to see what it was. I saw near the track an enclosure, and round it some laughing men, and inside it some whirling dus
- Generated first section: I. ENTER THE MAN Some notable sight was drawing the passengers, both men and women, to the window; and therefore I rose and crossed the car to see what it was. I saw near the track an enclosure, and round it some laughing men, and inside it some whirling du...
- Generated first default: I. ENTER THE MAN Some notable sight was drawing the passengers, both men and women, to the window; and therefore I rose and crossed the car to see what it was. I saw near the track an enclosure, and round it some laughing men, and inside it some whirling du...
- Preview start: I. ENTER THE MAN Some notable sight was drawing the passengers, both men and women, to the window; and therefore I rose and crossed the car to see what it was. I saw near the track an enclosure, and round it some laughing men, and inside it some whirling du...
- Raw end: days, when she and he had ridden together, and sometimes she declared that his work would kill him. But it does not seem to have done so. Their eldest boy rides the horse Monte; and, strictly between ourselves, I think his father is going to live a long while.
- Generated end: n office, and coming to own some of the newspapers, the thieves brought ruin on themselves as well. For in a broken country there is nothing left to steal. But the railroad came, and built a branch to that land of the Virginian’s where the coal was. By that...

### the-green-mummy

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 32 files
- Preview asset inspected: public/book-previews/the-green-mummy.preview.json
- Title: pass: generated title is The Green Mummy
- Author: pass: generated author is Fergus Hume
- Structure: chapter-based roman numerals
- Start boundary: pass: first default is Chapter 1 - THE LOVERS and starts from readable source content
- End boundary: pass: generated output ends at Chapter 27 - BY THE RIVER before license/source tail material
- Sectioning: pass: 27 sections preserve chapter-based roman numerals
- Cleanup: pass: no source/license/transcriber/TOC/illustration/page-marker artifacts found in default playback
- Preview: pass: preview starts from chapter-001 and matches generated hash
- All-main-readable default: pass: all detected main readable sections are selected by default and default source order starts at first default section
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The Green Mummy
- Author evidence: Author: Fergus Hume
- Raw start: CHAPTER I. THE LOVERS “I am very angry,” pouted the maid. “In heaven's name, why?” questioned the bachelor. “You have, so to speak, bought me.” “Impossible: your price is prohibitive.” “Indeed, when a thousand pounds--” “You are worth fifty and a hundre
- Generated first section: CHAPTER I. THE LOVERS “I am very angry,” pouted the maid. “In heaven's name, why?” questioned the bachelor. “You have, so to speak, bought me.” “Impossible: your price is prohibitive.” “Indeed, when a thousand pounds--” “You are worth fifty and a hundred ti...
- Generated first default: CHAPTER I. THE LOVERS “I am very angry,” pouted the maid. “In heaven's name, why?” questioned the bachelor. “You have, so to speak, bought me.” “Impossible: your price is prohibitive.” “Indeed, when a thousand pounds--” “You are worth fifty and a hundred ti...
- Preview start: CHAPTER I. THE LOVERS “I am very angry,” pouted the maid. “In heaven's name, why?” questioned the bachelor. “You have, so to speak, bought me.” “Impossible: your price is prohibitive.” “Indeed, when a thousand pounds--” “You are worth fifty and a hundred ti...
- Raw end: to another word now. The green mummy has passed out of our lives and has taken its bad luck with it.” “Amen, so be it,” said Lucy Hope, and the happy couple went home, leaving all their sorrows behind them, while the smoke of the steamer faded on the horizon.
- Generated end: hink any more about these dismal things. Dream of the time when I shall be the president of the Royal Academy, and you my lady.” “I am your lady now. But,” added Lucy, perhaps from an association of ideas of color and the Academy, “I shall hate green for th...

### the-mark-of-zorro

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 44 files
- Preview asset inspected: public/book-previews/the-mark-of-zorro.preview.json
- Title: pass: generated title is The mark of Zorro
- Author: pass: generated author is Johnston McCulley
- Structure: chapter-based roman numerals
- Start boundary: pass: first default is Chapter 1 and starts from readable source content
- End boundary: pass: generated output ends at Chapter 39 before license/source tail material
- Sectioning: pass: 39 sections preserve chapter-based roman numerals
- Cleanup: pass: no source/license/transcriber/TOC/illustration/page-marker artifacts found in default playback
- Preview: pass: preview starts from chapter-001 and matches generated hash
- All-main-readable default: pass: all detected main readable sections are selected by default and default source order starts at first default section
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The mark of Zorro
- Author evidence: Author: Johnston McCulley
- Raw start: CHAPTER I PEDRO, THE BOASTER Again the sheet of rain beat against the roof of red Spanish tile, and the wind shrieked like a soul in torment, and smoke puffed from the big fireplace as the sparks were showered over the hard dirt floor. "'Tis a night for ev
- Generated first section: CHAPTER I PEDRO, THE BOASTER Again the sheet of rain beat against the roof of red Spanish tile, and the wind shrieked like a soul in torment, and smoke puffed from the big fireplace as the sparks were showered over the hard dirt floor. "'Tis a night for evi...
- Generated first default: CHAPTER I PEDRO, THE BOASTER Again the sheet of rain beat against the roof of red Spanish tile, and the wind shrieked like a soul in torment, and smoke puffed from the big fireplace as the sparks were showered over the hard dirt floor. "'Tis a night for evi...
- Preview start: CHAPTER I PEDRO, THE BOASTER Again the sheet of rain beat against the roof of red Spanish tile, and the wind shrieked like a soul in torment, and smoke puffed from the big fireplace as the sparks were showered over the hard dirt floor. "'Tis a night for evi...
- Raw end: d, laughing again. "I shall drop the old languid ways and change gradually into the man you would have me. People will say that marriage made a man of me!" He stooped and kissed her there before them all. "Meal mush and goat's milk!" swore Sergeant Gonzales.
- Generated end: ried man should take some care of his life." "And what man do I wed?" the Señorita Lolita asked, blushing because she spoke the words where all could hear. "What man do you love?" "I had fancied that I loved Señor Zorro, but it comes to me now that I love t...

### typhoon

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 11 files
- Preview asset inspected: public/book-previews/typhoon.preview.json
- Title: pass: generated title is Typhoon
- Author: pass: generated author is Joseph Conrad
- Structure: standalone roman numeral sections
- Start boundary: pass: first default is Chapter 1 and starts from readable source content
- End boundary: pass: generated output ends at Chapter 6 before license/source tail material
- Sectioning: pass: 6 sections preserve standalone roman numeral sections
- Cleanup: pass: no source/license/transcriber/TOC/illustration/page-marker artifacts found in default playback
- Preview: pass: preview starts from chapter-001 and matches generated hash
- All-main-readable default: pass: all detected main readable sections are selected by default and default source order starts at first default section
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Typhoon
- Author evidence: Author: Joseph Conrad
- Raw start: I Captain MacWhirr, of the steamer Nan-Shan, had a physiognomy that, in the order of material appearances, was the exact counterpart of his mind: it presented no marked characteristics of firmness or stupidity; it had no pronounced characteristics whatever; i
- Generated first section: I Captain MacWhirr, of the steamer Nan-Shan, had a physiognomy that, in the order of material appearances, was the exact counterpart of his mind: it presented no marked characteristics of firmness or stupidity; it had no pronounced characteristics whatever;...
- Generated first default: I Captain MacWhirr, of the steamer Nan-Shan, had a physiognomy that, in the order of material appearances, was the exact counterpart of his mind: it presented no marked characteristics of firmness or stupidity; it had no pronounced characteristics whatever;...
- Preview start: I Captain MacWhirr, of the steamer Nan-Shan, had a physiognomy that, in the order of material appearances, was the exact counterpart of his mind: it presented no marked characteristics of firmness or stupidity; it had no pronounced characteristics whatever;...
- Raw end: pampered mail-boat swell? The old chief says that this was plainly the only thing that could be done. The skipper remarked to me the other day, 'There are things you find nothing about in books.' I think that he got out of it very well for such a stupid man.”
- Generated end: 2 hatch. There were three dollars left over, and these went to the three most damaged coolies, one to each. We turned-to afterwards, and shovelled out on deck heaps of wet rags, all sorts of fragments of things without shape, and that you couldn't give a na...

### robert-orange

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 35 files
- Preview asset inspected: public/book-previews/robert-orange.preview.json
- Title: pass: generated title is Robert Orange
- Author: pass: generated author is John Oliver Hobbes
- Structure: chapter-based roman numerals
- Start boundary: pass: first default is Chapter 1 and starts from readable source content
- End boundary: pass: generated output ends at Chapter 30 before license/source tail material
- Sectioning: pass: 30 sections preserve chapter-based roman numerals
- Cleanup: pass: no source/license/transcriber/TOC/illustration/page-marker artifacts found in default playback
- Preview: pass: preview starts from chapter-001 and matches generated hash
- All-main-readable default: pass: all detected main readable sections are selected by default and default source order starts at first default section
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Robert Orange
- Author evidence: Author: John Oliver Hobbes
- Raw start: CHAPTER I One afternoon during the first weeks of October, 1869, while wind, dust, and rain were struggling each for supremacy in the streets, a small yellow brougham, swung in the old-fashioned style on cumbersome springs and attached to a pair of fine grey
- Generated first section: CHAPTER I One afternoon during the first weeks of October, 1869, while wind, dust, and rain were struggling each for supremacy in the streets, a small yellow brougham, swung in the old-fashioned style on cumbersome springs and attached to a pair of fine gre...
- Generated first default: CHAPTER I One afternoon during the first weeks of October, 1869, while wind, dust, and rain were struggling each for supremacy in the streets, a small yellow brougham, swung in the old-fashioned style on cumbersome springs and attached to a pair of fine gre...
- Preview start: CHAPTER I One afternoon during the first weeks of October, 1869, while wind, dust, and rain were struggling each for supremacy in the streets, a small yellow brougham, swung in the old-fashioned style on cumbersome springs and attached to a pair of fine gre...
- Raw end: ity on the times of which it treats.... The book is enriched with rare and interesting illustrations, and with some valuable historical documents."--_Daily Telegraph._ BY FRANK HORRIDGE LIVES OF GREAT ITALIANS _Illustrated. Large crown 8vo., cloth_, 7s. 6d.
- Generated end: dee Advertiser._ "A credit to the publisher."--_Independent._ THE LIFE AND TIMES OF NICCOLO MACHIAVELLI _New and Cheaper Edition. Fully Illustrated. Large crown 8vo., cloth_, 7s. 6d. "Indispensable to the serious student of Machiavelli, his teaching and his...

### the-warden

- Write action: first-time processed
- Verification status: warn accepted
- Generated output inspected: 26 files
- Preview asset inspected: public/book-previews/the-warden.preview.json
- Title: pass: generated title is The Warden
- Author: pass: generated author is Anthony Trollope
- Structure: chapter-based roman numerals with explicit Chapter XX safeguard
- Start boundary: pass: first default is Chapter 1 - Hiram'S Hospital and starts from readable source content
- End boundary: pass: generated output ends at Chapter 21 - Conclusion before license/source tail material
- Sectioning: pass: 21 sections preserve chapter-based roman numerals with explicit Chapter XX safeguard
- Cleanup: pass: no source/license/transcriber/TOC/illustration/page-marker artifacts found in default playback
- Preview: pass: preview starts from chapter-001 and matches generated hash
- All-main-readable default: pass: all detected main readable sections are selected by default and default source order starts at first default section
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied: none
- Remaining warnings: Accepted with warning: dry-run under-counted Chapter XX; write output uses explicit Chapter I-XXI boundaries and preserves 21 chapters.

Supporting snippets:

- Title evidence: Title: The Warden
- Author evidence: Author: Anthony Trollope
- Raw start: Chapter I HIRAM'S HOSPITAL The Rev. Septimus Harding was, a few years since, a beneficed clergyman residing in the cathedral town of ----; let us call it Barchester. Were we to name Wells or Salisbury, Exeter, Hereford, or Gloucester, it might be presumed
- Generated first section: Chapter I HIRAM'S HOSPITAL The Rev. Septimus Harding was, a few years since, a beneficed clergyman residing in the cathedral town of ----; let us call it Barchester. Were we to name Wells or Salisbury, Exeter, Hereford, or Gloucester, it might be presumed t...
- Generated first default: Chapter I HIRAM'S HOSPITAL The Rev. Septimus Harding was, a few years since, a beneficed clergyman residing in the cathedral town of ----; let us call it Barchester. Were we to name Wells or Salisbury, Exeter, Hereford, or Gloucester, it might be presumed t...
- Preview start: Chapter I HIRAM'S HOSPITAL The Rev. Septimus Harding was, a few years since, a beneficed clergyman residing in the cathedral town of ----; let us call it Barchester. Were we to name Wells or Salisbury, Exeter, Hereford, or Gloucester, it might be presumed t...
- Raw end: s long before the people of Barchester forgot to call Mr Harding by his long well-known name of Warden. It had become so customary to say Mr Warden, that it was not easily dropped. "No, no," he always says when so addressed, "not warden now, only precentor."
- Generated end: th is a myth; for though he is over eighty he is never ill, and will probably die some day, as a spark goes out, gradually and without a struggle. Mr Harding does dine with him very often, which means going to the palace at three and remaining till ten; and...

### the-sea-lady

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 36 files
- Preview asset inspected: public/book-previews/the-sea-lady.preview.json
- Title: pass: generated title is The Sea Lady
- Author: pass: generated author is Herbert George Wells
- Structure: standalone roman numeral sections
- Start boundary: pass: first default is Chapter 1 and starts from readable source content
- End boundary: pass: generated output ends at Chapter 3 before license/source tail material
- Sectioning: pass: 31 sections preserve standalone roman numeral sections
- Cleanup: pass: no source/license/transcriber/TOC/illustration/page-marker artifacts found in default playback
- Preview: pass: preview starts from chapter-001 and matches generated hash
- All-main-readable default: pass: all detected main readable sections are selected by default and default source order starts at first default section
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The Sea Lady
- Author evidence: Author: Herbert George Wells
- Raw start: I Such previous landings of mermaids as have left a record, have all a flavour of doubt. Even the very circumstantial account of that Bruges Sea Lady, who was so clever at fancy work, gives occasion to the sceptic. I must confess that I was absolutely incredul
- Generated first section: I Such previous landings of mermaids as have left a record, have all a flavour of doubt. Even the very circumstantial account of that Bruges Sea Lady, who was so clever at fancy work, gives occasion to the sceptic. I must confess that I was absolutely incre...
- Generated first default: I Such previous landings of mermaids as have left a record, have all a flavour of doubt. Even the very circumstantial account of that Bruges Sea Lady, who was so clever at fancy work, gives occasion to the sceptic. I must confess that I was absolutely incre...
- Preview start: I Such previous landings of mermaids as have left a record, have all a flavour of doubt. Even the very circumstantial account of that Bruges Sea Lady, who was so clever at fancy work, gives occasion to the sceptic. I must confess that I was absolutely incre...
- Raw end: he east the tireless glare of that great beacon on Gris-nez wheeled athwart the sky and vanished and came again. I picture the interrogation of his lantern going out for a little way, a stain of faint pink curiosity upon the mysterious vast serenity of night.
- Generated end: nd from his feet a path of quivering light must have started and run up to the extreme dark edge before him of the sky. Ever and again the darkness east and west of that glory would be lit by a momentary gleam of phosphorescence; and far out the lights of s...

### the-laughing-cavalier-the-story-of-the-ancestor-of-the-scarlet-pimpernel

- Write action: first-time processed
- Verification status: warn accepted
- Generated output inspected: 50 files
- Preview asset inspected: public/book-previews/the-laughing-cavalier-the-story-of-the-ancestor-of-the-scarlet-pimpernel.preview.json
- Title: pass: generated title is The Laughing Cavalier: The Story of the Ancestor of the Scarlet Pimpernel
- Author: pass: generated author is Baroness Orczy
- Structure: chapter-based roman numerals
- Start boundary: pass: first default is Chapter 1 and starts from readable source content
- End boundary: pass: generated output ends at Chapter 45 before license/source tail material
- Sectioning: pass: 45 sections preserve chapter-based roman numerals
- Cleanup: pass: no source/license/transcriber/TOC/illustration/page-marker artifacts found in default playback
- Preview: pass: preview starts from chapter-001 and matches generated hash
- All-main-readable default: pass: all detected main readable sections are selected by default and default source order starts at first default section
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied: Corrected generated author metadata from duplicated Gutenberg header to title-page byline: Baroness Orczy.
- Remaining warnings: Accepted with warning: verification corrected the duplicated Gutenberg author header to the title-page byline, Baroness Orczy.

Supporting snippets:

- Title evidence: Title: The Laughing Cavalier: The Story of the Ancestor of the Scarlet Pimpernel
- Author evidence: BARONESS ORCZY
- Raw start: CHAPTER I NEW YEAR'S EVE If the snow had come down again or the weather been colder, or wetter, or other than it was.... If one of the three men had been more thirsty, or the other more insistent.... If it had been any other day of the year, or any other
- Generated first section: CHAPTER I NEW YEAR'S EVE If the snow had come down again or the weather been colder, or wetter, or other than it was.... If one of the three men had been more thirsty, or the other more insistent.... If it had been any other day of the year, or any other ho...
- Generated first default: CHAPTER I NEW YEAR'S EVE If the snow had come down again or the weather been colder, or wetter, or other than it was.... If one of the three men had been more thirsty, or the other more insistent.... If it had been any other day of the year, or any other ho...
- Preview start: CHAPTER I NEW YEAR'S EVE If the snow had come down again or the weather been colder, or wetter, or other than it was.... If one of the three men had been more thirsty, or the other more insistent.... If it had been any other day of the year, or any other ho...
- Raw end: rs already!" "Go back, good St. Bavon," cried the Laughing Cavalier in an ecstasy of joy, "your heaven--you rogue--is not more perfect than this." By BARONESS ORCZY "UNTO CÆSAR" EL DORADO MEADOWSWEET THE NOBLE ROGUE THE HEART OF A WOMAN PETTICOAT RULE
- Generated end: im. "Mynheer," he said, and laughter which contained a world of happiness as well as of joy danced and sparkled in every line of his face, "just now I refused one half of your fortune! But 'tis your greatest treasure I claim from you now." "Nay! you rascal,...

## Future-batch rule

- valid generated readable content
- correct generated title
- correct author metadata or documented unresolved-author policy
- first default section from real readable content
- all main readable sections included by default
- meaningful source-based segmentation
- valid book-specific startup preview
- no SOS Help!
- no generic preview fallback
- no title/TOC/source/license/contributor/transcriber/byline material as default playback
- selected/default source order begins from the first selected/default section

## Later-phase requirements

- after all books are processed, run an independent second-pass audit using a different strategy
- after books and second-pass audit, add original non-spoiler 300-500+ word SEO summaries for each accepted book page
- after summaries, perform full site SEO/meta review using GSC data and route-level intent
- final cleanup should remove temporary audit scripts/reports and code bloat only after everything is stable
