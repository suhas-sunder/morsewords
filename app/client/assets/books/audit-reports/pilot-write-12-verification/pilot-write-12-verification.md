# Pilot write batch 12 verification

Post-write QA pass for the 20 processed batch-12 books.

## Totals

- Processed books verified: 20
- Pass: 20
- Warn accepted: 0
- Fail: 0
- Accepted for main: 20
- Corrections applied during verification: 0

## Playwright and queued fullscreen UX note

- Classification: flaky/unstable assertion
- Prior failing test: Morse book page foundation > renders an approved external-authority Gutenberg book as a public page
- Prior assertion: expect(getByTestId("book-video-preview-fullscreen-overlay")).toHaveAttribute("data-fullscreen-controls-visible", "false")
- Prior expected/actual: false / true
- Selector: getByTestId("book-video-preview-fullscreen-overlay")
- Timing: after entering fullscreen; overlay had data-fullscreen-active="true" and data-fullscreen-mode="browser"
- Surface: general approved external-authority Gutenberg book public page UI, specifically Treasure Island, not a batch-12 generated book page
- Write branch rerun: 2026-06-19 write batch 12 validation reported 36/36 passed; verification rerun on morsewords-book-processing-pilot-write-12-jun-2026 also passed 36/36 with --reporter=line
- Main rerun: Not rerun during batch-12 verification because the write pass already reported 36/36 passed and fullscreen UX work is explicitly deferred.
- Write branch non-fullscreen subset: Not needed during batch-12 verification; no fullscreen failure appeared in the write pass result.
- UI code changed: no
- The write pass reported the Playwright book-page suite at 36/36 passed.
- The verification pass reran the same book-page suite and it passed 36/36.
- Earlier Treasure Island fullscreen-controls failures remain documented as flaky/pre-existing.
- No fullscreen, hover, bulb, dark-mode, live-preview, or broader UI/test code is changed in this verification pass.
- Known fullscreen/rage-click UX work remains queued for a later post-books UX pass.

## Audit side-effect handling

- Known unrelated title/start/default auto-corrections: 12
- Unrelated audit churn committed: no
- Handling: books:title-start-default-audit is known to reapply 12 unrelated older generated-book corrections; validation side effects are restored unless they are explicit batch-12 corrections.

## Active quality-gate reports read

```json
{
  "pathsRead": [
    "app/client/assets/books/audit-reports/book-startup-preview-audit-1/book-startup-preview-audit-1.json",
    "app/client/assets/books/audit-reports/title-start-default-content-audit-1/title-start-default-content-audit-1.json",
    "app/client/assets/books/audit-reports/metadata-segmentation-correctness-audit-1/metadata-segmentation-correctness-audit-1.json",
    "app/client/assets/books/audit-reports/manual-ui-defect-followup-1/manual-ui-defect-followup-1.json"
  ],
  "startup": {
    "generatedBookCount": 252,
    "validStartupPreviewCount": 252,
    "previewAssetsUpdated": [],
    "invalidOrMissing": []
  },
  "titleStartDefault": {
    "generatedBooksAudited": 252,
    "acceptedGeneratedBooksAudited": 117,
    "correctionsApplied": 12,
    "acceptedBooksCorrected": 12,
    "acceptanceRevokedPendingCorrection": 0
  },
  "metadataSegmentation": {
    "generatedBooksAudited": 252,
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

## Known duplicate/boundary exclusions not reintroduced

### the-wind-in-the-willows

- Reintroduced in write report: no
- Generated status: clean
- Preview status: clean
- Untouched: yes

### the-two-magics-the-turn-of-the-screw-covering-end

- Reintroduced in write report: no
- Generated status: clean
- Preview status: clean
- Untouched: yes

### the-works-of-edgar-allan-poe

- Reintroduced in write report: no
- Generated status: clean
- Preview status: clean
- Untouched: yes

## Unresolved-source generated books left untouched

```json
[
  {
    "slug": "a-princess-of-mars",
    "title": "A princess of Mars",
    "candidateType": "unresolved-source generated, report-only",
    "generatedSectionCount": 30,
    "reason": "Left untouched because no exact raw source was safely resolved from temp-books for this dry-run."
  },
  {
    "slug": "doctor-dolittle",
    "title": "The Story of Doctor Dolittle",
    "candidateType": "unresolved-source generated, report-only",
    "generatedSectionCount": 6,
    "reason": "Left untouched because no exact raw source was safely resolved from temp-books for this dry-run."
  },
  {
    "slug": "heidi",
    "title": "Heidi",
    "candidateType": "unresolved-source generated, report-only",
    "generatedSectionCount": 11,
    "reason": "Left untouched because no exact raw source was safely resolved from temp-books for this dry-run."
  },
  {
    "slug": "jabberwocky",
    "title": "Jabberwocky",
    "candidateType": "unresolved-source generated, report-only",
    "generatedSectionCount": 2,
    "reason": "Left untouched because no exact raw source was safely resolved from temp-books for this dry-run."
  },
  {
    "slug": "nights-with-uncle-remus",
    "title": "Nights With Uncle Remus",
    "candidateType": "unresolved-source generated, report-only",
    "generatedSectionCount": 21,
    "reason": "Left untouched because no exact raw source was safely resolved from temp-books for this dry-run."
  },
  {
    "slug": "peter-pan",
    "title": "Peter Pan [Peter and Wendy]",
    "candidateType": "unresolved-source generated, report-only",
    "generatedSectionCount": 20,
    "reason": "Left untouched because no exact raw source was safely resolved from temp-books for this dry-run."
  },
  {
    "slug": "tarzan-of-the-apes",
    "title": "Tarzan of the Apes",
    "candidateType": "unresolved-source generated, report-only",
    "generatedSectionCount": 30,
    "reason": "Left untouched because no exact raw source was safely resolved from temp-books for this dry-run."
  },
  {
    "slug": "the-great-gatsby",
    "title": "The Great Gatsby",
    "candidateType": "unresolved-source generated, report-only",
    "generatedSectionCount": 11,
    "reason": "Left untouched because no exact raw source was safely resolved from temp-books for this dry-run."
  },
  {
    "slug": "the-picture-of-dorian-gray",
    "title": "The Picture of Dorian Gray",
    "candidateType": "unresolved-source generated, report-only",
    "generatedSectionCount": 23,
    "reason": "Left untouched because no exact raw source was safely resolved from temp-books for this dry-run."
  },
  {
    "slug": "the-thirty-nine-steps",
    "title": "The Thirty-Nine Steps",
    "candidateType": "unresolved-source generated, report-only",
    "generatedSectionCount": 12,
    "reason": "Left untouched because no exact raw source was safely resolved from temp-books for this dry-run."
  },
  {
    "slug": "wood-folk-at-school",
    "title": "Wood folk at school",
    "candidateType": "unresolved-source generated, report-only",
    "generatedSectionCount": 10,
    "reason": "Left untouched because no exact raw source was safely resolved from temp-books for this dry-run."
  }
]
```

Git status for unresolved-source generated books/previews: clean.

## Books

### ole-luk-oie-the-dream-god

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/ole-luk-oie-the-dream-god.preview.json
- Generated title verdict: pass: generated title is Ole-Luk-Oie, the Dream-God
- Generated author/compiler/collector/translator verdict: pass: generated author is H. C. Andersen
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is Ole-Luk-Oie, the Dream-God and starts from real readable content
- End boundary verdict: pass: generated output ends at Ole-Luk-Oie, the Dream-God with source/license/end-matter tails removed
- Sectioning verdict: pass: 1 sections preserve one contiguous story section starting at dry-run verified first readable prose phrase
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: OLE-LUK-OIE THE DREAM GOD
- Author evidence: Author: H. C. Andersen
- Raw start: THERE is nobody in the whole world who knows so many stories as Ole-Luk-Oie, or who can relate them so nicely. In the evening while the children are seated at the tea table or in their little chairs, very softly he comes up the stairs, for he walks in his soc
- Generated first section: THERE is nobody in the whole world who knows so many stories as Ole-Luk-Oie, or who can relate them so nicely. In the evening while the children are seated at the tea table or in their little chairs, very softly he comes up the stairs, for he walks in his s...
- Generated first default: THERE is nobody in the whole world who knows so many stories as Ole-Luk-Oie, or who can relate them so nicely. In the evening while the children are seated at the tea table or in their little chairs, very softly he comes up the stairs, for he walks in his s...
- Preview start: THERE is nobody in the whole world who knows so many stories as Ole-Luk-Oie, or who can relate them so nicely. In the evening while the children are seated at the tea table or in their little chairs, very softly he comes up the stairs, for he walks in his s...
- Raw end: ery instructive," murmured the great-grandfather's portrait. "It is useful sometimes to express an opinion." So he was quite satisfied. These are some of the doings and sayings of Ole-Luk-Oie. I hope he may visit you himself this evening and relate some more.
- Generated end: he beautiful story, while those who had "Middling" or "Fairly good" in their books were obliged to sit behind. They cried and wanted to jump down from the horse, but they could not get free, for they seemed fastened to the seat. "Why, Death is a most splend...

### clever-hans

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/clever-hans.preview.json
- Generated title verdict: pass: generated title is Clever Hans
- Generated author/compiler/collector/translator verdict: pass: generated author is Jacob Grimm; Wilhelm Grimm
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is Clever Hans and starts from real readable content
- End boundary verdict: pass: generated output ends at Clever Hans with source/license/end-matter tails removed
- Sectioning verdict: pass: 1 sections preserve one contiguous story section starting at dry-run verified first readable prose phrase
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: CLEVER HANS
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw start: The mother of Hans said: Whither away, Hans? Hans answered: To Gretel. Behave well, Hans. Oh, I ll behave well. Goodbye, mother. Goodbye, Hans. Hans comes to Gretel. Good day, Gretel. Good day, Hans. What do you bring that is good? I bring nothi
- Generated first section: The mother of Hans said: ‘Whither away, Hans?’ Hans answered: ‘To Gretel.’ ‘Behave well, Hans.’ ‘Oh, I’ll behave well. Goodbye, mother.’ ‘Goodbye, Hans.’ Hans comes to Gretel. ‘Good day, Gretel.’ ‘Good day, Hans. What do you bring that is good?’ ‘I bring no...
- Generated first default: The mother of Hans said: ‘Whither away, Hans?’ Hans answered: ‘To Gretel.’ ‘Behave well, Hans.’ ‘Oh, I’ll behave well. Goodbye, mother.’ ‘Goodbye, Hans.’ Hans comes to Gretel. ‘Good day, Gretel.’ ‘Good day, Hans. What do you bring that is good?’ ‘I bring no...
- Preview start: The mother of Hans said: ‘Whither away, Hans?’ Hans answered: ‘To Gretel.’ ‘Behave well, Hans.’ ‘Oh, I’ll behave well. Goodbye, mother.’ ‘Goodbye, Hans.’ Hans comes to Gretel. ‘Good day, Gretel.’ ‘Good day, Hans. What do you bring that is good?’ ‘I bring no...
- Raw end: ave cast friendly eyes on her.’ ‘Never mind, will do better.’ Hans went into the stable, cut out all the calves’ and sheep’s eyes, and threw them in Gretel’s face. Then Gretel became angry, tore herself loose and ran away, and was no longer the bride of Hans.
- Generated end: ties her to a rope, leads her to the rack, and binds her fast. Then Hans goes to his mother. ‘Good evening, mother.’ ‘Good evening, Hans. Where have you been?’ ‘With Gretel.’ ‘What did you take her?’ ‘I took her nothing.’ ‘What did Gretel give you?’ ‘She ga...

### the-fisherman-and-his-wife

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-fisherman-and-his-wife.preview.json
- Generated title verdict: pass: generated title is The Fisherman and His Wife
- Generated author/compiler/collector/translator verdict: pass: generated author is Jacob Grimm; Wilhelm Grimm
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Fisherman and His Wife and starts from real readable content
- End boundary verdict: pass: generated output ends at The Fisherman and His Wife with source/license/end-matter tails removed
- Sectioning verdict: pass: 1 sections preserve one contiguous story section starting at dry-run verified first readable prose phrase
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: THE FISHERMAN AND HIS WIFE
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw start: There was once a fisherman who lived with his wife in a pigsty, close by the seaside. The fisherman used to go out all day long a-fishing; and one day, as he sat on the shore with his rod, looking at the sparkling waves and watching his line, all on a sudden h
- Generated first section: There was once a fisherman who lived with his wife in a pigsty, close one day, as he sat on the shore with his rod, looking at the sparkling waves and watching his line, all on a sudden his float was dragged away deep into the water: and in drawing it up he...
- Generated first default: There was once a fisherman who lived with his wife in a pigsty, close one day, as he sat on the shore with his rod, looking at the sparkling waves and watching his line, all on a sudden his float was dragged away deep into the water: and in drawing it up he...
- Preview start: There was once a fisherman who lived with his wife in a pigsty, close one day, as he sat on the shore with his rod, looking at the sparkling waves and watching his line, all on a sudden his float was dragged away deep into the water: and in drawing it up he...
- Raw end: l Will have her own will, And hath sent me to beg a boon of thee!’ ‘What does she want now?’ said the fish. ‘Ah!’ said he, ‘she wants to be lord of the sun and moon.’ ‘Go home,’ said the fish, ‘to your pigsty again.’ And there they live to this very day.
- Generated end: the shore a dreadful storm arose, so that the trees and the very rocks shook. And all the heavens became black with stormy clouds, and the lightnings played, and the thunders rolled; and you might have seen in the sea great black waves, swelling up like mou...

### the-story-of-the-old-man-who-made-withered-trees-to-flower

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-story-of-the-old-man-who-made-withered-trees-to-flower.preview.json
- Generated title verdict: pass: generated title is The Story of the Old Man Who Made Withered Trees to Flower
- Generated author/compiler/collector/translator verdict: pass: generated author is Yei Theodora Ozaki
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Story of the Old Man Who Made Withered Trees to Flower and starts from real readable content
- End boundary verdict: pass: generated output ends at The Story of the Old Man Who Made Withered Trees to Flower with source/license/end-matter tails removed
- Sectioning verdict: pass: 1 sections preserve one contiguous story section starting at dry-run verified first readable prose phrase
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: THE STORY OF THE OLD MAN WHO MADE WITHERED TREES TO FLOWER
- Author evidence: Author: Yei Theodora Ozaki
- Raw start: Long, long ago there lived an old man and his wife who supported themselves by cultivating a small plot of land. Their life had been a very happy and peaceful one save for one great sorrow, and this was they had no child. Their only pet was a dog named Shiro,
- Generated first section: Long, long ago there lived an old man and his wife who supported themselves by cultivating a small plot of land. Their life had been a very happy and peaceful one save for one great sorrow, and this was they had no child. Their only pet was a dog named Shir...
- Generated first default: Long, long ago there lived an old man and his wife who supported themselves by cultivating a small plot of land. Their life had been a very happy and peaceful one save for one great sorrow, and this was they had no child. Their only pet was a dog named Shir...
- Preview start: Long, long ago there lived an old man and his wife who supported themselves by cultivating a small plot of land. Their life had been a very happy and peaceful one save for one great sorrow, and this was they had no child. Their only pet was a dog named Shir...
- Raw end: , however, with the treasure of gold coins which Shiro had found for him, and with all the gold and the silver which the Daimio had showered on him, became a rich and prosperous man in his old age, and lived a long and happy life, beloved and respected by all.
- Generated end: n took handfuls and again sprinkled them over the withered tree. But all to no effect. After trying several times, the ashes were blown into the Daimio’s eyes. This made him very angry, and he ordered his retainers to arrest the false Hana-Saka-Jijii at onc...

### the-story-of-urashima-taro-the-fisher-lad

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-story-of-urashima-taro-the-fisher-lad.preview.json
- Generated title verdict: pass: generated title is The Story of Urashima Taro, the Fisher Lad
- Generated author/compiler/collector/translator verdict: pass: generated author is Yei Theodora Ozaki
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Story of Urashima Taro, the Fisher Lad and starts from real readable content
- End boundary verdict: pass: generated output ends at The Story of Urashima Taro, the Fisher Lad with source/license/end-matter tails removed
- Sectioning verdict: pass: 1 sections preserve one contiguous story section starting at dry-run verified first readable prose phrase
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: THE STORY OF URASHIMA TARO, THE FISHER LAD
- Author evidence: Author: Yei Theodora Ozaki
- Raw start: Long, long ago in the province of Tango there lived on the shore of Japan in the little fishing village of Mizu-no-ye a young fisherman named Urashima Taro. His father had been a fisherman before him, and his skill had more than doubly descended to his son, fo
- Generated first section: Long, long ago in the province of Tango there lived on the shore of Japan in the little fishing village of Mizu-no-ye a young fisherman named Urashima Taro. His father had been a fisherman before him, and his skill had more than doubly descended to his son,...
- Generated first default: Long, long ago in the province of Tango there lived on the shore of Japan in the little fishing village of Mizu-no-ye a young fisherman named Urashima Taro. His father had been a fisherman before him, and his skill had more than doubly descended to his son,...
- Preview start: Long, long ago in the province of Tango there lived on the shore of Japan in the little fishing village of Mizu-no-ye a young fisherman named Urashima Taro. His father had been a fisherman before him, and his skill had more than doubly descended to his son,...
- Raw end: because of his disobedience he could never return to the Sea King’s realm or the lovely Princess beyond the sea. Little children, never be disobedient to those who are wiser than you for disobedience was the beginning of all the miseries and sorrows of life.
- Generated end: ful little purple cloud rose out of the box in three soft wisps. For an instant it covered his face and wavered over him as if loath to go, and then it floated away like vapor over the sea. Urashima, who had been till that moment like a strong and handsome...

### the-story-of-the-man-who-did-not-wish-to-die

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-story-of-the-man-who-did-not-wish-to-die.preview.json
- Generated title verdict: pass: generated title is The Story of the Man Who Did Not Wish to Die
- Generated author/compiler/collector/translator verdict: pass: generated author is Yei Theodora Ozaki
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Story of the Man Who Did Not Wish to Die and starts from real readable content
- End boundary verdict: pass: generated output ends at The Story of the Man Who Did Not Wish to Die with source/license/end-matter tails removed
- Sectioning verdict: pass: 1 sections preserve one contiguous story section starting at dry-run verified first readable prose phrase
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: THE STORY OF THE MAN WHO DID NOT WISH TO DIE
- Author evidence: Author: Yei Theodora Ozaki
- Raw start: Long, long ago there lived a man called Sentaro. His surname meant Millionaire, but although he was not so rich as all that, he was still very far removed from being poor. He had inherited a small fortune from his father and lived on this, spending his time
- Generated first section: Long, long ago there lived a man called Sentaro. His surname meant “Millionaire,” but although he was not so rich as all that, he was still very far removed from being poor. He had inherited a small fortune from his father and lived on this, spending his ti...
- Generated first default: Long, long ago there lived a man called Sentaro. His surname meant “Millionaire,” but although he was not so rich as all that, he was still very far removed from being poor. He had inherited a small fortune from his father and lived on this, spending his ti...
- Preview start: Long, long ago there lived a man called Sentaro. His surname meant “Millionaire,” but although he was not so rich as all that, he was still very far removed from being poor. He had inherited a small fortune from his father and lived on this, spending his ti...
- Raw end: d Sentaro took the lesson to heart. With the book in his hand he returned to his old home, and giving up all his old vain wishes, tried to live a good and useful life and to observe the lessons taught him in the book, and he and his house prospered henceforth.
- Generated end: ill you live to a good old age and be happy, but give up the vain desire to escape death, for no man can do that, and by this time you have surely found out that even when selfish desires are granted they do not bring happiness.” “In this book I give you th...

### the-happy-hunter-and-the-skillful-fisher

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-happy-hunter-and-the-skillful-fisher.preview.json
- Generated title verdict: pass: generated title is The Happy Hunter and the Skillful Fisher
- Generated author/compiler/collector/translator verdict: pass: generated author is Yei Theodora Ozaki
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Happy Hunter and the Skillful Fisher and starts from real readable content
- End boundary verdict: pass: generated output ends at The Happy Hunter and the Skillful Fisher with source/license/end-matter tails removed
- Sectioning verdict: pass: 1 sections preserve one contiguous story section starting at dry-run verified first readable prose phrase
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: THE HAPPY HUNTER AND THE SKILLFUL FISHER
- Author evidence: Author: Yei Theodora Ozaki
- Raw start: Long, long ago Japan was governed by Hohodemi, the fourth Mikoto (or Augustness) in descent from the illustrious Amaterasu, the Sun Goddess. He was not only as handsome as his ancestress was beautiful, but he was also very strong and brave, and was famous for
- Generated first section: Long, long ago Japan was governed by Hohodemi, the fourth Mikoto (or Augustness) in descent from the illustrious Amaterasu, the Sun Goddess. He was not only as handsome as his ancestress was beautiful, but he was also very strong and brave, and was famous f...
- Generated first default: Long, long ago Japan was governed by Hohodemi, the fourth Mikoto (or Augustness) in descent from the illustrious Amaterasu, the Sun Goddess. He was not only as handsome as his ancestress was beautiful, but he was also very strong and brave, and was famous f...
- Preview start: Long, long ago Japan was governed by Hohodemi, the fourth Mikoto (or Augustness) in descent from the illustrious Amaterasu, the Sun Goddess. He was not only as handsome as his ancestress was beautiful, but he was also very strong and brave, and was famous f...
- Raw end: ong, long time. Above all the treasures in his house he prized the wonderful Jewels of the Flow and Ebb of the Tide which had been given him by Ryn Jin, the Dragon King of the Sea. This is the congratulatory ending of the Happy Hunter and the Skillful Fisher.
- Generated end: superior and bow before him as Lord of all Japan. Then the Happy Hunter said that he would forgive his brother if he would throw into the receding tide all his evil ways. The Skillful Fisher promised and there was peace between the two brothers. From this t...

### the-conceited-apple-branch

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-conceited-apple-branch.preview.json
- Generated title verdict: pass: generated title is The Conceited Apple Branch
- Generated author/compiler/collector/translator verdict: pass: generated author is H. C. Andersen
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Conceited Apple Branch and starts from real readable content
- End boundary verdict: pass: generated output ends at The Conceited Apple Branch with source/license/end-matter tails removed
- Sectioning verdict: pass: 1 sections preserve one contiguous story section starting at dry-run verified first readable prose phrase
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: THE CONCEITED APPLE BRANCH
- Author evidence: Author: H. C. Andersen
- Raw start: IT WAS the month of May. The wind still blew cold, but from bush and tree, field and flower, came the welcome sound, "Spring is come." Wild flowers in profusion covered the hedges. Under the little apple tree Spring seemed busy, and he told his tale from one
- Generated first section: IT WAS the month of May. The wind still blew cold, but from bush and tree, field and flower, came the welcome sound, "Spring is come." Wild flowers in profusion covered the hedges. Under the little apple tree Spring seemed busy, and he told his tale from on...
- Generated first default: IT WAS the month of May. The wind still blew cold, but from bush and tree, field and flower, came the welcome sound, "Spring is come." Wild flowers in profusion covered the hedges. Under the little apple tree Spring seemed busy, and he told his tale from on...
- Preview start: IT WAS the month of May. The wind still blew cold, but from bush and tree, field and flower, came the welcome sound, "Spring is come." Wild flowers in profusion covered the hedges. Under the little apple tree Spring seemed busy, and he told his tale from on...
- Raw end: ry one admires the beauty of the apple bough, but this humble flower has been endowed appearance both are children of the realms of beauty." Then the sunbeam kissed both the lowly flower and the blooming apple branch, upon whose leaves appeared a rosy blush.
- Generated end: and carried home so safely covered, so that not one of the delicate feathery arrows of which its mistlike shape was so lightly formed should flutter away. She now drew it forth quite uninjured and wondered at its beautiful form, its airy lightness and singu...

### the-darning-needle

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-darning-needle.preview.json
- Generated title verdict: pass: generated title is The Darning-Needle
- Generated author/compiler/collector/translator verdict: pass: generated author is H. C. Andersen
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Darning-Needle and starts from real readable content
- End boundary verdict: pass: generated output ends at The Darning-Needle with source/license/end-matter tails removed
- Sectioning verdict: pass: 1 sections preserve one contiguous story section starting at dry-run verified first readable prose phrase
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: THE DARNING-NEEDLE
- Author evidence: Author: H. C. Andersen
- Raw start: THERE was once a Darning-needle who thought herself so fine that she came at last to believe that she was fit for embroidery. "Mind now that you hold me fast," she said to the Fingers that took her up. "Pray don't lose me. If I should fall on the ground I sho
- Generated first section: THERE was once a Darning-needle who thought herself so fine that she came at last to believe that she was fit for embroidery. "Mind now that you hold me fast," she said to the Fingers that took her up. "Pray don't lose me. If I should fall on the ground I s...
- Generated first default: THERE was once a Darning-needle who thought herself so fine that she came at last to believe that she was fit for embroidery. "Mind now that you hold me fast," she said to the Fingers that took her up. "Pray don't lose me. If I should fall on the ground I s...
- Preview start: THERE was once a Darning-needle who thought herself so fine that she came at last to believe that she was fit for embroidery. "Mind now that you hold me fast," she said to the Fingers that took her up. "Pray don't lose me. If I should fall on the ground I s...
- Raw end: . "Mercy, what a crushing weight!" said the Darning-needle. "I'm growing seasick, after all. I'm going to break!" But she was not sick, and she did not break, though the wagon wheels rolled over her. She lay at full length in the road, and there let her lie.
- Generated end: n I shall break." But the fear was needless; she was not seasick, neither did she break. "Nothing is so good to prevent seasickness as to have a steel stomach and to bear in mind that one is something a little more than an ordinary person. My seasickness is...

### the-greenies

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-greenies.preview.json
- Generated title verdict: pass: generated title is The Greenies
- Generated author/compiler/collector/translator verdict: pass: generated author is H. C. Andersen
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Greenies and starts from real readable content
- End boundary verdict: pass: generated output ends at The Greenies with source/license/end-matter tails removed
- Sectioning verdict: pass: 1 sections preserve one contiguous story section starting at dry-run verified first readable prose phrase
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: THE GREENIES
- Author evidence: Author: H. C. Andersen
- Raw start: A ROSE TREE stood in the window. But a little while ago it had been green and fresh, and now it looked sickly--it was in poor health, no doubt. A whole regiment was quartered on it and was eating it up; yet, notwithstanding this seeming greediness, the regimen
- Generated first section: A ROSE TREE stood in the window. But a little while ago it had been green and fresh, and now it looked sickly--it was in poor health, no doubt. A whole regiment was quartered on it and was eating it up; yet, notwithstanding this seeming greediness, the regi...
- Generated first default: A ROSE TREE stood in the window. But a little while ago it had been green and fresh, and now it looked sickly--it was in poor health, no doubt. A whole regiment was quartered on it and was eating it up; yet, notwithstanding this seeming greediness, the regi...
- Preview start: A ROSE TREE stood in the window. But a little while ago it had been green and fresh, and now it looked sickly--it was in poor health, no doubt. A whole regiment was quartered on it and was eating it up; yet, notwithstanding this seeming greediness, the regi...
- Raw end: han I can about (I will not say the name) the little green things of the rosebush. "Plant lice!" said Dame Fairytale. One must call things by their right names. And if one may not do so always, one must at least have the privilege of doing so in a fairy tale.
- Generated end: o wash them in, for I too had come with soap and water and murderous intentions. But now I will use it for soap bubbles. Look, how beautiful! Perhaps there lies in each a fairy tale, and the bubble grows large and radiant and looks as if there were a pearl...

### the-loving-pair

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-loving-pair.preview.json
- Generated title verdict: pass: generated title is The Loving Pair
- Generated author/compiler/collector/translator verdict: pass: generated author is H. C. Andersen
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Loving Pair and starts from real readable content
- End boundary verdict: pass: generated output ends at The Loving Pair with source/license/end-matter tails removed
- Sectioning verdict: pass: 1 sections preserve one contiguous story section starting at dry-run verified first readable prose phrase
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: THE LOVING PAIR
- Author evidence: Author: H. C. Andersen
- Raw start: A WHIPPING Top and a Ball lay close together in a drawer among other playthings. One day the Top said to the Ball, "Since we are living so much together, why should we not be lovers?" But the Ball, being made of morocco leather, thought herself a very high-br
- Generated first section: A WHIPPING Top and a Ball lay close together in a drawer among other playthings. One day the Top said to the Ball, "Since we are living so much together, why should we not be lovers?" But the Ball, being made of morocco leather, thought herself a very high-...
- Generated first default: A WHIPPING Top and a Ball lay close together in a drawer among other playthings. One day the Top said to the Ball, "Since we are living so much together, why should we not be lovers?" But the Ball, being made of morocco leather, thought herself a very high-...
- Preview start: A WHIPPING Top and a Ball lay close together in a drawer among other playthings. One day the Top said to the Ball, "Since we are living so much together, why should we not be lovers?" But the Ball, being made of morocco leather, thought herself a very high-...
- Raw end: eard of the Ball. And the Top never spoke again of his old love--the feeling must have passed away. And it is not strange, when the object of it has lain five years in a gutter, and been drenched through and through, and when one meets her again in a dustbin.
- Generated end: through and through. You may think what a wearisome situation it has been for a young lady like me." The Top made no reply. The more he thought of his old love, and the more he heard, the more sure he became that this was indeed she. Then came the housemaid...

### little-ida-s-flowers

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/little-ida-s-flowers.preview.json
- Generated title verdict: pass: generated title is Little Ida's Flowers
- Generated author/compiler/collector/translator verdict: pass: generated author is H. C. Andersen
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is Little Ida's Flowers and starts from real readable content
- End boundary verdict: pass: generated output ends at Little Ida's Flowers with source/license/end-matter tails removed
- Sectioning verdict: pass: 1 sections preserve one contiguous story section starting at dry-run verified first readable prose phrase
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: LITTLE IDA'S FLOWERS
- Author evidence: Author: H. C. Andersen
- Raw start: MY POOR flowers are quite faded!" said little Ida. "Only yesterday evening they were so pretty, and now all the leaves are drooping. Why do they do that?" she asked of the student, who sat on the sofa. He was a great favorite with her, because he used to tell
- Generated first section: MY POOR flowers are quite faded!" said little Ida. "Only yesterday evening they were so pretty, and now all the leaves are drooping. Why do they do that?" she asked of the student, who sat on the sofa. He was a great favorite with her, because he used to te...
- Generated first default: MY POOR flowers are quite faded!" said little Ida. "Only yesterday evening they were so pretty, and now all the leaves are drooping. Why do they do that?" she asked of the student, who sat on the sofa. He was a great favorite with her, because he used to te...
- Preview start: MY POOR flowers are quite faded!" said little Ida. "Only yesterday evening they were so pretty, and now all the leaves are drooping. Why do they do that?" she asked of the student, who sat on the sofa. He was a great favorite with her, because he used to te...
- Raw end: rying the dead flowers in their pretty coffin. A little grave was dug for them in the garden. Ida first kissed the flowers and then laid them in the earth, and Adolphe and Gustave shot with their crossbows over the grave, for they had neither guns nor cannons.
- Generated end: you in the garden, in order that next summer you may grow again and be still more beautiful." The two cousins were two merry boys, Gustave and Adolphe. Their father had given them each a new crossbow, which they brought with them to show to Ida. She told th...

### the-roses-and-the-sparrows

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-roses-and-the-sparrows.preview.json
- Generated title verdict: pass: generated title is The Roses and the Sparrows
- Generated author/compiler/collector/translator verdict: pass: generated author is H. C. Andersen
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Roses and the Sparrows and starts from real readable content
- End boundary verdict: pass: generated output ends at The Roses and the Sparrows with source/license/end-matter tails removed
- Sectioning verdict: pass: 1 sections preserve one contiguous story section starting at dry-run verified first readable prose phrase
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: THE ROSES AND THE SPARROWS
- Author evidence: Author: H. C. Andersen
- Raw start: IT really appeared as if something very important were going on by the duck pond, but this was not the case. A few minutes before, all the ducks had been resting on the water or standing on their heads--for that they can do--and then they all swam in a bustle
- Generated first section: IT really appeared as if something very important were going on by the duck pond, but this was not the case. A few minutes before, all the ducks had been resting on the water or standing on their heads--for that they can do--and then they all swam in a bust...
- Generated first default: IT really appeared as if something very important were going on by the duck pond, but this was not the case. A few minutes before, all the ducks had been resting on the water or standing on their heads--for that they can do--and then they all swam in a bust...
- Preview start: IT really appeared as if something very important were going on by the duck pond, but this was not the case. A few minutes before, all the ducks had been resting on the water or standing on their heads--for that they can do--and then they all swam in a bust...
- Raw end: ! there's a withered leaf. I can see it quite plainly." And they pecked at the leaf till it fell, but the rosebush continued fresher and greener than ever. The roses bloomed in the sunshine on Thorwaldsen's grave and thus became linked with his immortal name.
- Generated end: e brown neighbors and were rejoiced to see them again. "It is very delightful," said the roses, "to live here and to blossom, to meet old friends, and to see cheerful faces every day. It is as if each day were a holiday." "Tweet," said the sparrows to each...

### the-steadfast-tin-soldier

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-steadfast-tin-soldier.preview.json
- Generated title verdict: pass: generated title is The Steadfast Tin Soldier
- Generated author/compiler/collector/translator verdict: pass: generated author is H. C. Andersen
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Steadfast Tin Soldier and starts from real readable content
- End boundary verdict: pass: generated output ends at The Steadfast Tin Soldier with source/license/end-matter tails removed
- Sectioning verdict: pass: 1 sections preserve one contiguous story section starting at dry-run verified first readable prose phrase
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: THE STEADFAST TIN SOLDIER
- Author evidence: Author: H. C. Andersen
- Raw start: THERE were once five and twenty tin soldiers. They were brothers, for they had all been made out of the same old tin spoon. They all shouldered their bayonets, held themselves upright, and looked straight before them. Their uniforms were very smart-looking--re
- Generated first section: THERE were once five and twenty tin soldiers. They were brothers, for they had all been made out of the same old tin spoon. They all shouldered their bayonets, held themselves upright, and looked straight before them. Their uniforms were very smart-looking-...
- Generated first default: THERE were once five and twenty tin soldiers. They were brothers, for they had all been made out of the same old tin spoon. They all shouldered their bayonets, held themselves upright, and looked straight before them. Their uniforms were very smart-looking-...
- Preview start: THERE were once five and twenty tin soldiers. They were brothers, for they had all been made out of the same old tin spoon. They all shouldered their bayonets, held themselves upright, and looked straight before them. Their uniforms were very smart-looking-...
- Raw end: ldier, flashed up in a flame, and was gone! The Tin Soldier melted into a lump; and in the ashes the maid found him next day, in the shape of a little tin heart, while of the Dancer nothing remained save the tinsel rose, and that was burned as black as a coal.
- Generated end: he felt was terrible, but whether it proceeded from the fire or from the love in his heart, he did not know. He saw that the colors were quite gone from his uniform, but whether that had happened on the journey or had been caused him, and he felt himself me...

### shock-tactics

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/shock-tactics.preview.json
- Generated title verdict: pass: generated title is Shock Tactics
- Generated author/compiler/collector/translator verdict: pass: generated author is Saki
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is Shock Tactics and starts from real readable content
- End boundary verdict: pass: generated output ends at Shock Tactics with source/license/end-matter tails removed
- Sectioning verdict: pass: 1 sections preserve one contiguous story section starting at dry-run verified first readable prose phrase
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: SHOCK TACTICS
- Author evidence: Author: Saki
- Raw start: On a late spring afternoon Ella McCarthy sat on a green-painted chair in Kensington Gardens, staring listlessly at an uninteresting stretch of park landscape, that blossomed suddenly into tropical radiance as an expected figure appeared in the middle distance.
- Generated first section: On a late spring afternoon Ella McCarthy sat on a green-painted chair in Kensington Gardens, staring listlessly at an uninteresting stretch of park landscape, that blossomed suddenly into tropical radiance as an expected figure appeared in the middle distan...
- Generated first default: On a late spring afternoon Ella McCarthy sat on a green-painted chair in Kensington Gardens, staring listlessly at an uninteresting stretch of park landscape, that blossomed suddenly into tropical radiance as an expected figure appeared in the middle distan...
- Preview start: On a late spring afternoon Ella McCarthy sat on a green-painted chair in Kensington Gardens, staring listlessly at an uninteresting stretch of park landscape, that blossomed suddenly into tropical radiance as an expected figure appeared in the middle distan...
- Raw end: he knew it. His mother was conscious of the fact that she would look rather ridiculous if the story got about. She was willing to pay hush-money. “I’ll never open your letters again,” she promised. And Clovis has no more devoted slave than Bertie Heasant.
- Generated end: ve believed all that rubbish about murder and suicide and jewels. You’ve been making enough noise to bring the house down for the last hour or two.” “But what was I to think of those letters?” whimpered Mrs. Heasant. “I should have known what to think of th...

### canossa

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/canossa.preview.json
- Generated title verdict: pass: generated title is Canossa
- Generated author/compiler/collector/translator verdict: pass: generated author is Saki
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is Canossa and starts from real readable content
- End boundary verdict: pass: generated output ends at Canossa with source/license/end-matter tails removed
- Sectioning verdict: pass: 1 sections preserve one contiguous story section starting at dry-run verified first readable prose phrase
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: CANOSSA
- Author evidence: Author: Saki
- Raw start: Demosthenes Platterbaff, the eminent Unrest Inducer, stood on his trial for a serious offence, and the eyes of the political world were focussed on the jury. The offence, it should be stated, was serious for the Government rather than for the prisoner. He ha
- Generated first section: Demosthenes Platterbaff, the eminent Unrest Inducer, stood on his trial for a serious offence, and the eyes of the political world were focussed on the jury. The offence, it should be stated, was serious for the Government rather than for the prisoner. He h...
- Generated first default: Demosthenes Platterbaff, the eminent Unrest Inducer, stood on his trial for a serious offence, and the eyes of the political world were focussed on the jury. The offence, it should be stated, was serious for the Government rather than for the prisoner. He h...
- Preview start: Demosthenes Platterbaff, the eminent Unrest Inducer, stood on his trial for a serious offence, and the eyes of the political world were focussed on the jury. The offence, it should be stated, was serious for the Government rather than for the prisoner. He h...
- Raw end: offence at the fact of Cabinet Ministers having personally acted as strike-breakers, and even the release of Platterbaff failed to pacify them. The seat was lost, but Ministers had scored a moral victory. They had shown that they knew when and how to yield.
- Generated end: ection. It was a tune they had all heard hundreds of times, so there was no difficulty in turning out a passable imitation of it. To the improvised strains of “I didn’t want to do it” the prisoner strode forth to freedom. The word of the song had reference,...

### the-oversight

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-oversight.preview.json
- Generated title verdict: pass: generated title is The Oversight
- Generated author/compiler/collector/translator verdict: pass: generated author is Saki
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Oversight and starts from real readable content
- End boundary verdict: pass: generated output ends at The Oversight with source/license/end-matter tails removed
- Sectioning verdict: pass: 1 sections preserve one contiguous story section starting at dry-run verified first readable prose phrase
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: THE OVERSIGHT
- Author evidence: Author: Saki
- Raw start: It s like a Chinese puzzle, said Lady Prowche resentfully, staring at a scribbled list of names that spread over two or three loose sheets of notepaper on her writing-table. Most of the names had a pencil mark running through them. What is like a Chinese p
- Generated first section: It’s like a Chinese puzzle,” said Lady Prowche resentfully, staring at a scribbled list of names that spread over two or three loose sheets of notepaper on her writing-table. Most of the names had a pencil mark running through them. “What is like a Chinese...
- Generated first default: It’s like a Chinese puzzle,” said Lady Prowche resentfully, staring at a scribbled list of names that spread over two or three loose sheets of notepaper on her writing-table. Most of the names had a pencil mark running through them. “What is like a Chinese...
- Preview start: It’s like a Chinese puzzle,” said Lady Prowche resentfully, staring at a scribbled list of names that spread over two or three loose sheets of notepaper on her writing-table. Most of the names had a pencil mark running through them. “What is like a Chinese...
- Raw end: t one could violently disagree about—religion, politics, vivisection, the Derby decision, the Falconer Report; what else was there left to quarrel about?” “My dear, we were fools not to have thought of it. One of them was Pro-Greek and the other Pro-Bulgar.”
- Generated end: . Sir Richard said so, and he has been in countries where hyænas live, so he ought to know. They actually came to blows!” “Blows?” “Blows and curses. It really might have been a scene from one of Hogarth’s pictures. I never felt so humiliated in my life. Wh...

### the-penance

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-penance.preview.json
- Generated title verdict: pass: generated title is The Penance
- Generated author/compiler/collector/translator verdict: pass: generated author is Saki
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Penance and starts from real readable content
- End boundary verdict: pass: generated output ends at The Penance with source/license/end-matter tails removed
- Sectioning verdict: pass: 1 sections preserve one contiguous story section starting at dry-run verified first readable prose phrase
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: THE PENANCE
- Author evidence: Author: Saki
- Raw start: Octavian Ruttle was one of those lively cheerful individuals on whom amiability had set its unmistakable stamp, and, like most of his kind, his soul s peace depended in large measure on the unstinted approval of his fellows. In hunting to death a small tabby
- Generated first section: Octavian Ruttle was one of those lively cheerful individuals on whom amiability had set its unmistakable stamp, and, like most of his kind, his soul’s peace depended in large measure on the unstinted approval of his fellows. In hunting to death a small tabb...
- Generated first default: Octavian Ruttle was one of those lively cheerful individuals on whom amiability had set its unmistakable stamp, and, like most of his kind, his soul’s peace depended in large measure on the unstinted approval of his fellows. In hunting to death a small tabb...
- Preview start: Octavian Ruttle was one of those lively cheerful individuals on whom amiability had set its unmistakable stamp, and, like most of his kind, his soul’s peace depended in large measure on the unstinted approval of his fellows. In hunting to death a small tabb...
- Raw end: he formula of his penance he felt certain that three pairs of solemn eyes were watching his moth-shared vigil. And the next morning his eyes were gladdened by a sheet of copy-book paper lying beside the blank wall, on which was written the message “Un-Beast.”
- Generated end: e part. Clad in a zephyr shirt, which on this occasion thoroughly merited its name, he held in one hand a lighted candle and in the other a watch, into which the soul of a dead plumber seemed to have passed. A box of matches lay at his feet and was resorted...

### mark

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/mark.preview.json
- Generated title verdict: pass: generated title is Mark
- Generated author/compiler/collector/translator verdict: pass: generated author is Saki
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is Mark and starts from real readable content
- End boundary verdict: pass: generated output ends at Mark with source/license/end-matter tails removed
- Sectioning verdict: pass: 1 sections preserve one contiguous story section starting at dry-run verified first readable prose phrase
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: MARK
- Author evidence: Author: Saki
- Raw start: Augustus Mellowkent was a novelist with a future; that is to say, a limited but increasing number of people read his books, and there seemed good reason to suppose that if he steadily continued to turn out novels year by year a progressively increasing circle
- Generated first section: Augustus Mellowkent was a novelist with a future; that is to say, a limited but increasing number of people read his books, and there seemed good reason to suppose that if he steadily continued to turn out novels year by year a progressively increasing circ...
- Generated first default: Augustus Mellowkent was a novelist with a future; that is to say, a limited but increasing number of people read his books, and there seemed good reason to suppose that if he steadily continued to turn out novels year by year a progressively increasing circ...
- Preview start: Augustus Mellowkent was a novelist with a future; that is to say, a limited but increasing number of people read his books, and there seemed good reason to suppose that if he steadily continued to turn out novels year by year a progressively increasing circ...
- Raw end: ed remark about having no time to waste on monkey-talk, he gathered up his slighted volume and departed. He made no audible reply to Mellowkent’s cheerful “Good morning,” but the latter fancied that a look of respectful hatred flickered in the cold grey eyes.
- Generated end: or two of my novels in their luggage as a stand-by. A friend of mine said only the other day that he would as soon think of going into the tropics without quinine as of going on a visit without a couple of Mark Mellowkents in his kit-bag. Perhaps sensation...

### quail-seed

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/quail-seed.preview.json
- Generated title verdict: pass: generated title is Quail Seed
- Generated author/compiler/collector/translator verdict: pass: generated author is Saki
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is Quail Seed and starts from real readable content
- End boundary verdict: pass: generated output ends at Quail Seed with source/license/end-matter tails removed
- Sectioning verdict: pass: 1 sections preserve one contiguous story section starting at dry-run verified first readable prose phrase
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: QUAIL SEED
- Author evidence: Author: Saki
- Raw start: The outlook is not encouraging for us smaller businesses, said Mr. Scarrick to the artist and his sister, who had taken rooms over his suburban grocery store. These big concerns are offering all sorts of attractions to the shopping public which we couldn t
- Generated first section: The outlook is not encouraging for us smaller businesses,” said Mr. Scarrick to the artist and his sister, who had taken rooms over his suburban grocery store. “These big concerns are offering all sorts of attractions to the shopping public which we couldn’...
- Generated first default: The outlook is not encouraging for us smaller businesses,” said Mr. Scarrick to the artist and his sister, who had taken rooms over his suburban grocery store. “These big concerns are offering all sorts of attractions to the shopping public which we couldn’...
- Preview start: The outlook is not encouraging for us smaller businesses,” said Mr. Scarrick to the artist and his sister, who had taken rooms over his suburban grocery store. “These big concerns are offering all sorts of attractions to the shopping public which we couldn’...
- Raw end: iently,” said the grocer. “We enjoyed the fun of it,” said the artist modestly, “and as for the model, it was a welcome variation on posing for hours for ‘The Lost Hylas’.” “At any rate,” said the grocer, “I insist on paying for the hire of the black beard.”
- Generated end: his book. Now and then he walked out into the street, looked anxiously in all directions, and hurried back to keep up his pretence of shopping. From one of these sorties he did not return; he had dashed away into the dusk, and neither he nor the dark-faced...

## Future-batch rule

- valid generated readable content
- correct generated title
- correct author metadata or documented unresolved-author policy
- no duplicate generated work under a slightly different slug unless intentionally documented
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
- after books/SEO, run a focused rage-click UX pass for /audio, /practice, homepage, and related utility pages
- final cleanup should remove temporary audit scripts/reports and code bloat only after everything is stable
