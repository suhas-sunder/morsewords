# Pilot write batch 11 verification

Post-write QA pass for the 20 processed batch-11 books.

## Totals

- Processed books verified: 20
- Pass: 20
- Warn accepted: 0
- Fail: 0
- Accepted for main: 20
- Corrections applied during verification: 0

## Playwright fullscreen-controls triage

- Classification: pre-existing main failure
- Prior failing test: Morse book page foundation > renders an approved external-authority Gutenberg book as a public page
- Prior assertion: expect(getByTestId("book-video-preview-fullscreen-overlay")).toHaveAttribute("data-fullscreen-controls-visible", "false")
- Prior expected/actual: false / true
- Selector: getByTestId("book-video-preview-fullscreen-overlay")
- Timing: after entering fullscreen; overlay had data-fullscreen-active="true" and data-fullscreen-mode="browser"
- Surface: general approved external-authority Gutenberg book public page UI, specifically Treasure Island, not a batch-11 generated book page
- Write branch rerun: 2026-06-19 verification rerun on morsewords-book-processing-pilot-write-11-jun-2026: 35 passed, 1 failed with --reporter=line; sole failure was the Treasure Island fullscreen-controls assertion
- Main rerun: 2026-06-19 comparison rerun on latest main after git fetch/pull and typecheck: 35 passed, 1 failed with --reporter=line; same Treasure Island fullscreen-controls assertion failed
- Write branch non-fullscreen subset: 2026-06-19 follow-up on morsewords-book-processing-pilot-write-11-jun-2026 with the Treasure Island fullscreen-controls test excluded: 35 passed with --reporter=line
- UI code changed: no
- The same full Playwright command failed on the write branch and on latest main with identical selector, assertion, expected value, and actual value.
- The narrowed non-fullscreen/book-page subset passed on the write branch after excluding that one known fullscreen assertion.
- The failing test is the Treasure Island public page, not a newly generated batch-11 book.
- The failure occurs after the test opens fullscreen and waits for controls to auto-hide; data-fullscreen-controls-visible remains true instead of false.
- No fullscreen, hover, bulb, dark-mode, or live-preview UI code was modified in this verification branch.
- Classified as a pre-existing non-book UX/test failure on main, not a batch-11 regression.

## Audit side-effect handling

- Known unrelated title/start/default auto-corrections: 12
- Unrelated audit churn committed: no
- Handling: books:title-start-default-audit is known to reapply 12 unrelated older generated-book corrections; validation side effects are restored unless they are explicit batch-11 corrections.

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
    "generatedBookCount": 232,
    "validStartupPreviewCount": 232,
    "previewAssetsUpdated": [],
    "invalidOrMissing": []
  },
  "titleStartDefault": {
    "generatedBooksAudited": 232,
    "acceptedGeneratedBooksAudited": 117,
    "correctionsApplied": 12,
    "acceptedBooksCorrected": 12,
    "acceptanceRevokedPendingCorrection": 0
  },
  "metadataSegmentation": {
    "generatedBooksAudited": 232,
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

### cool-air

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/cool-air.preview.json
- Generated title verdict: pass: generated title is Cool Air
- Generated author verdict: pass: generated author is H. P. Lovecraft
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is Cool Air and starts from real readable content
- End boundary verdict: pass: generated output ends at Cool Air with source/license/end-matter tails removed
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

- Title evidence: Cool Air
- Author evidence: Author: H. P. Lovecraft
- Raw start: You ask me to explain why I am afraid of a draft of cool air; why I shiver more than others upon entering a cold room, and seem nauseated and repelled when the chill of evening creeps through the heat of a mild autumn day. There are those who say I respond to
- Generated first section: You ask me to explain why I am afraid of a draft of cool air; why I shiver more than others upon entering a cold room, and seem nauseated and repelled when the chill of evening creeps through the heat of a mild autumn day. There are those who say I respond...
- Generated first default: You ask me to explain why I am afraid of a draft of cool air; why I shiver more than others upon entering a cold room, and seem nauseated and repelled when the chill of evening creeps through the heat of a mild autumn day. There are those who say I respond...
- Preview start: You ask me to explain why I am afraid of a draft of cool air; why I shiver more than others upon entering a cold room, and seem nauseated and repelled when the chill of evening creeps through the heat of a mild autumn day. There are those who say I respond...
- Raw end: ldn't stand what he had to do; he had to get me in a strange, dark place, when he minded my letter and nursed me back. And the organs never would work again. It had to be done my way--artificial preservation--_for you see I died that time eighteen years ago_."
- Generated end: t of unusually cool air. "The end," ran that noisome scrawl, "is here. No more ice--the man looked and ran away. Warmer every minute, and the tissues can't last. I fancy you know--what I said about the will and the nerves and the preserved body after the or...

### the-dream-of-little-tuk

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-dream-of-little-tuk.preview.json
- Generated title verdict: pass: generated title is The Dream of Little Tuk
- Generated author verdict: pass: generated author is H. C. Andersen
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Dream of Little Tuk and starts from real readable content
- End boundary verdict: pass: generated output ends at The Dream of Little Tuk with source/license/end-matter tails removed
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

- Title evidence: THE DREAM OF LITTLE TUK
- Author evidence: Author: H. C. Andersen
- Raw start: Ah! yes, that was little Tuk: in reality his name was not Tuk, but that was what he called himself before he could speak plain: he meant it for Charles, and it is all well enough if one does but know it. He had now to take care of his little sister Augusta, wh
- Generated first section: Ah! yes, that was little Tuk: in reality his name was not Tuk, but that was what he called himself before he could speak plain: he meant it for Charles, and it is all well enough if one does but know it. He had now to take care of his little sister Augusta,...
- Generated first default: Ah! yes, that was little Tuk: in reality his name was not Tuk, but that was what he called himself before he could speak plain: he meant it for Charles, and it is all well enough if one does but know it. He had now to take care of his little sister Augusta,...
- Preview start: Ah! yes, that was little Tuk: in reality his name was not Tuk, but that was what he called himself before he could speak plain: he meant it for Charles, and it is all well enough if one does but know it. He had now to take care of his little sister Augusta,...
- Raw end: popped her head in at the door, nodded to him friendly, and said, “Thanks, many thanks, my good child, for your help! May the good ever-loving God fulfil your loveliest dream!” Little Tukey did not at all know what he had dreamed, but the loving God knew it.
- Generated end: ill speak well and wisely, little Tukey; and when at last you sink into your grave, you shall sleep as quietly--” “As if I lay in Soroe,” said Tuk, awaking. It was bright day, and he was now quite unable to call to mind his dream; that, however, was not at...

### the-false-collar

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-false-collar.preview.json
- Generated title verdict: pass: generated title is The False Collar
- Generated author verdict: pass: generated author is H. C. Andersen
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The False Collar and starts from real readable content
- End boundary verdict: pass: generated output ends at The False Collar with source/license/end-matter tails removed
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

- Title evidence: THE FALSE COLLAR
- Author evidence: Author: H. C. Andersen
- Raw start: There was once a fine gentleman, all of whose moveables were a boot-jack and a hair-comb: but he had the finest false collars in the world; and it is about one of these collars that we are now to hear a story. It was so old, that it began to think of marriage
- Generated first section: There was once a fine gentleman, all of whose moveables were a boot-jack and a hair-comb: but he had the finest false collars in the world; and it is about one of these collars that we are now to hear a story. It was so old, that it began to think of marria...
- Generated first default: There was once a fine gentleman, all of whose moveables were a boot-jack and a hair-comb: but he had the finest false collars in the world; and it is about one of these collars that we are now to hear a story. It was so old, that it began to think of marria...
- Preview start: There was once a fine gentleman, all of whose moveables were a boot-jack and a hair-comb: but he had the finest false collars in the world; and it is about one of these collars that we are now to hear a story. It was so old, that it began to think of marria...
- Raw end: n never know if we may not, in the course of time, also come into the rag chest, and be made into white paper, and then have our whole life's history printed on it, even the most secret, and be obliged to run about and tell it ourselves, just like this collar.
- Generated end: e--that went into the water-tub. I have much on my conscience, I want to become white paper!” And it became so, all the rags were turned into white paper; but the collar came to be just this very piece of white paper we here see, and on which the story is p...

### the-naughty-boy

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-naughty-boy.preview.json
- Generated title verdict: pass: generated title is The Naughty Boy
- Generated author verdict: pass: generated author is H. C. Andersen
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Naughty Boy and starts from real readable content
- End boundary verdict: pass: generated output ends at The Naughty Boy with source/license/end-matter tails removed
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

- Title evidence: THE NAUGHTY BOY
- Author evidence: Author: H. C. Andersen
- Raw start: Along time ago, there lived an old poet, a thoroughly kind old poet. As he was sitting one evening in his room, a dreadful storm arose without, and the rain streamed down from heaven; but the old poet sat warm and comfortable in his chimney-corner, where the f
- Generated first section: Along time ago, there lived an old poet, a thoroughly kind old poet. As he was sitting one evening in his room, a dreadful storm arose without, and the rain streamed down from heaven; but the old poet sat warm and comfortable in his chimney-corner, where th...
- Generated first default: Along time ago, there lived an old poet, a thoroughly kind old poet. As he was sitting one evening in his room, a dreadful storm arose without, and the rain streamed down from heaven; but the old poet sat warm and comfortable in his chimney-corner, where th...
- Preview start: Along time ago, there lived an old poet, a thoroughly kind old poet. As he was sitting one evening in his room, a dreadful storm arose without, and the rain streamed down from heaven; but the old poet sat warm and comfortable in his chimney-corner, where th...
- Raw end: fter everybody. Only think, he shot an arrow once at your old grandmother! But that is a long time ago, and it is all past now; however, a thing of that sort she never forgets. Fie, naughty Cupid! But now you know him, and you know, too, how ill-behaved he is!
- Generated end: he sits in the great chandelier and burns in bright flames, so that people think it is really a flame, but they soon discover it is something else. He roves about in the garden of the palace and upon the ramparts: yes, once he even shot your father and moth...

### the-red-shoes

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-red-shoes.preview.json
- Generated title verdict: pass: generated title is The Red Shoes
- Generated author verdict: pass: generated author is H. C. Andersen
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Red Shoes and starts from real readable content
- End boundary verdict: pass: generated output ends at The Red Shoes with source/license/end-matter tails removed
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

- Title evidence: THE RED SHOES
- Author evidence: Author: H. C. Andersen
- Raw start: There was once a little girl who was very pretty and delicate, but in summer she was forced to run about with bare feet, she was so poor, and in winter wear very large wooden shoes, which made her little insteps quite red, and that looked so dangerous! In the
- Generated first section: There was once a little girl who was very pretty and delicate, but in summer she was forced to run about with bare feet, she was so poor, and in winter wear very large wooden shoes, which made her little insteps quite red, and that looked so dangerous! In t...
- Generated first default: There was once a little girl who was very pretty and delicate, but in summer she was forced to run about with bare feet, she was so poor, and in winter wear very large wooden shoes, which made her little insteps quite red, and that looked so dangerous! In t...
- Preview start: There was once a little girl who was very pretty and delicate, but in summer she was forced to run about with bare feet, she was so poor, and in winter wear very large wooden shoes, which made her little insteps quite red, and that looked so dangerous! In t...
- Raw end: ounded so sweet and soft! The clear sunshine streamed so warmly through the window into the pew where Karen sat! Her heart was so full of sunshine, peace, and joy, that it broke. Her soul flew on the sunshine to God, and there no one asked after the RED SHOES.
- Generated end: s. The congregation sat in cushioned seats, and sang out of their Prayer-Books. For the church itself had come to the poor girl in her narrow chamber, or else she had come into the church. She sat in the pew with the clergyman's family, and when they had en...

### the-shadow

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-shadow.preview.json
- Generated title verdict: pass: generated title is The Shadow
- Generated author verdict: pass: generated author is H. C. Andersen
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Shadow and starts from real readable content
- End boundary verdict: pass: generated output ends at The Shadow with source/license/end-matter tails removed
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

- Title evidence: THE SHADOW
- Author evidence: Author: H. C. Andersen
- Raw start: It is in the hot lands that the sun burns, sure enough! there the people become quite a mahogany brown, ay, and in the HOTTEST lands they are burnt to Negroes. But now it was only to the HOT lands that a learned man had come from the cold; there he thought tha
- Generated first section: It is in the hot lands that the sun burns, sure enough! there the people become quite a mahogany brown, ay, and in the HOTTEST lands they are burnt to Negroes. But now it was only to the HOT lands that a learned man had come from the cold; there he thought...
- Generated first default: It is in the hot lands that the sun burns, sure enough! there the people become quite a mahogany brown, ay, and in the HOTTEST lands they are burnt to Negroes. But now it was only to the HOT lands that a learned man had come from the cold; there he thought...
- Preview start: It is in the hot lands that the sun burns, sure enough! there the people become quite a mahogany brown, ay, and in the HOTTEST lands they are burnt to Negroes. But now it was only to the HOT lands that a learned man had come from the cold; there he thought...
- Raw end: nnons went off with a bum! bum! and the soldiers presented arms. That was a marriage! The princess and the shadow went out on the balcony to show themselves, and get another hurrah! The learned man heard nothing of all this--for they had deprived him of life.
- Generated end: is very unfortunate; it would be a real work of charity to deliver him from the little life he has, and, when I think properly over the matter, I am of opinion that it will be necessary to do away with him in all stillness!” “It is certainly hard,” said the...

### the-story-of-a-mother

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-story-of-a-mother.preview.json
- Generated title verdict: pass: generated title is The Story of a Mother
- Generated author verdict: pass: generated author is H. C. Andersen
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Story of a Mother and starts from real readable content
- End boundary verdict: pass: generated output ends at The Story of a Mother with source/license/end-matter tails removed
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

- Title evidence: THE STORY OF A MOTHER
- Author evidence: Author: H. C. Andersen
- Raw start: A mother sat there with her little child. She was so downcast, so afraid that it should die! It was so pale, the small eyes had closed themselves, and it drew its breath so softly, now and then, with a deep respiration, as if it sighed; and the mother looked s
- Generated first section: A mother sat there with her little child. She was so downcast, so afraid that it should die! It was so pale, the small eyes had closed themselves, and it drew its breath so softly, now and then, with a deep respiration, as if it sighed; and the mother looke...
- Generated first default: A mother sat there with her little child. She was so downcast, so afraid that it should die! It was so pale, the small eyes had closed themselves, and it drew its breath so softly, now and then, with a deep respiration, as if it sighed; and the mother looke...
- Preview start: A mother sat there with her little child. She was so downcast, so afraid that it should die! It was so pale, the small eyes had closed themselves, and it drew its breath so softly, now and then, with a deep respiration, as if it sighed; and the mother looke...
- Raw end: r wrung her hands, fell on her knees, and prayed to our Lord: “Oh, hear me not when I pray against Thy will, which is the best! hear me not! hear me not!” And she bowed her head down in her lap, and Death took her child and went with it into the unknown land.
- Generated end: fate thou saw'st--thy own child's future life!” Then the mother screamed with terror, “Which of them was my child? Tell it me! Save the innocent! Save my child from all that misery! Rather take it away! Take it into God's kingdom! Forget my tears, forget my...

### the-ugly-duckling

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-ugly-duckling.preview.json
- Generated title verdict: pass: generated title is The Ugly Duckling
- Generated author verdict: pass: generated author is H. C. Andersen
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Ugly Duckling and starts from real readable content
- End boundary verdict: pass: generated output ends at The Ugly Duckling with source/license/end-matter tails removed
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

- Title evidence: THE UGLY DUCKLING
- Author evidence: Author: H. C. Andersen
- Raw start: IT was so beautiful in the country. It was the summer time. The wheat fields were golden, the oats were green, and the hay stood in great stacks in the green meadows. The stork paraded about among them on his long red legs, chattering away in Egyptian, the lan
- Generated first section: IT was so beautiful in the country. It was the summer time. The wheat fields were golden, the oats were green, and the hay stood in great stacks in the green meadows. The stork paraded about among them on his long red legs, chattering away in Egyptian, the...
- Generated first default: IT was so beautiful in the country. It was the summer time. The wheat fields were golden, the oats were green, and the hay stood in great stacks in the green meadows. The stork paraded about among them on his long red legs, chattering away in Egyptian, the...
- Preview start: IT was so beautiful in the country. It was the summer time. The wheat fields were golden, the oats were green, and the hay stood in great stacks in the green meadows. The stork paraded about among them on his long red legs, chattering away in Egyptian, the...
- Raw end: ts boughs into the water before him, and the sun shone warm and bright. Then he rustled his feathers, curved his slender neck, and cried joyfully, from the depths of his heart, "I never dreamed of such happiness as this while I was the despised ugly duckling."
- Generated end: e into the water and said, "The new one is the most beautiful of all, he is so young and pretty." And the old swans bowed their heads before him. Then he felt quite ashamed and hid his head under his wing, for he did not know what to do, he was so happy--ye...

### the-adventures-of-chanticleer-and-partlet

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 8 files
- Preview asset inspected: public/book-previews/the-adventures-of-chanticleer-and-partlet.preview.json
- Generated title verdict: pass: generated title is The Adventures of Chanticleer and Partlet
- Generated author verdict: pass: generated author is Jacob Grimm; Wilhelm Grimm
- Selected structural convention: three source-numbered tale sections after parent Grimm collection title and byline
- Start boundary verdict: pass: first default is 1. How They Went to the Mountains to Eat Nuts and starts from real readable content
- End boundary verdict: pass: generated output ends at 3. How Partlet Died and Was Buried, and How Chanticleer Died of Grief with source/license/end-matter tails removed
- Sectioning verdict: pass: 3 sections preserve three source-numbered tale sections after parent Grimm collection title and byline
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: THE ADVENTURES OF CHANTICLEER AND PARTLET
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw start: The nuts are quite ripe now, said Chanticleer to his wife Partlet, suppose we go together to the mountains, and eat as many as we can, before the squirrel takes them all away. With all my heart, said Partlet, let us go and make a holiday of it together
- Generated first section: ‘The nuts are quite ripe now,’ said Chanticleer to his wife Partlet, ‘suppose we go together to the mountains, and eat as many as we can, before the squirrel takes them all away.’ ‘With all my heart,’ said Partlet, ‘let us go and make a holiday of it togeth...
- Generated first default: ‘The nuts are quite ripe now,’ said Chanticleer to his wife Partlet, ‘suppose we go together to the mountains, and eat as many as we can, before the squirrel takes them all away.’ ‘With all my heart,’ said Partlet, ‘let us go and make a holiday of it togeth...
- Preview start: ‘The nuts are quite ripe now,’ said Chanticleer to his wife Partlet, ‘suppose we go together to the mountains, and eat as many as we can, before the squirrel takes them all away.’ ‘With all my heart,’ said Partlet, ‘let us go and make a holiday of it togeth...
- Raw end: eam and drowned. Thus Chanticleer was left alone with his dead Partlet; and having dug a grave for her, he laid her in it, and made a little hillock over her. Then he sat down by the grave, and wept and mourned, till at last he died too; and so all were dead.
- Generated end: , that the log of wood fell in and was carried away by the stream. Then a stone, who saw what had happened, came up and kindly offered to help poor Chanticleer by laying himself across the stream; and this time he got safely to the other side with the hears...

### jorinda-and-jorindel

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/jorinda-and-jorindel.preview.json
- Generated title verdict: pass: generated title is Jorinda and Jorindel
- Generated author verdict: pass: generated author is Jacob Grimm; Wilhelm Grimm
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is Jorinda and Jorindel and starts from real readable content
- End boundary verdict: pass: generated output ends at Jorinda and Jorindel with source/license/end-matter tails removed
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

- Title evidence: JORINDA AND JORINDEL
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw start: There was once an old castle, that stood in the middle of a deep gloomy wood, and in the castle lived an old fairy. Now this fairy could take any shape she pleased. All the day long she flew about in the form of an owl, or crept about the country like a cat; b
- Generated first section: There was once an old castle, that stood in the middle of a deep gloomy wood, and in the castle lived an old fairy. Now this fairy could take any shape she pleased. All the day long she flew about in the form of an owl, or crept about the country like a cat...
- Generated first default: There was once an old castle, that stood in the middle of a deep gloomy wood, and in the castle lived an old fairy. Now this fairy could take any shape she pleased. All the day long she flew about in the form of an owl, or crept about the country like a cat...
- Preview start: There was once an old castle, that stood in the middle of a deep gloomy wood, and in the castle lived an old fairy. Now this fairy could take any shape she pleased. All the day long she flew about in the form of an owl, or crept about the country like a cat...
- Raw end: took their old forms again; and he took Jorinda home, where they were married, and lived happily together many years: and so did a good many other lads, whose maidens had been forced to sing in the old fairy’s cages by themselves, much longer than they liked.
- Generated end: ch was his Jorinda? While he was thinking what to do, he saw the fairy had taken down one of the cages, and was making the best of her way off through the door. He ran or flew after her, touched the cage with the flower, and Jorinda stood before him, and th...

### mother-holle

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/mother-holle.preview.json
- Generated title verdict: pass: generated title is Mother Holle
- Generated author verdict: pass: generated author is Jacob Grimm; Wilhelm Grimm
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is Mother Holle and starts from real readable content
- End boundary verdict: pass: generated output ends at Mother Holle with source/license/end-matter tails removed
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

- Title evidence: MOTHER HOLLE
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw start: Once upon a time there was a widow who had two daughters; one of them was beautiful and industrious, the other ugly and lazy. The mother, however, loved the ugly and lazy one best, because she was her own daughter, and so the other, who was only her stepdaught
- Generated first section: Once upon a time there was a widow who had two daughters; one of them was beautiful and industrious, the other ugly and lazy. The mother, however, loved the ugly and lazy one best, because she was her own daughter, and so the other, who was only her stepdau...
- Generated first default: Once upon a time there was a widow who had two daughters; one of them was beautiful and industrious, the other ugly and lazy. The mother, however, loved the ugly and lazy one best, because she was her own daughter, and so the other, who was only her stepdau...
- Preview start: Once upon a time there was a widow who had two daughters; one of them was beautiful and industrious, the other ugly and lazy. The mother, however, loved the ugly and lazy one best, because she was her own daughter, and so the other, who was only her stepdau...
- Raw end: azy girl had to go home covered with pitch, and the cock on the well called out as she saw her: ‘Cock-a-doodle-doo! Your dirty daughter’s come back to you.’ But, try what she would, she could not get the pitch off and it stuck to her as long as she lived.
- Generated end: . So Mother Holle very soon got tired of her, and told her she might go. The lazy girl was delighted at this, and thought to herself, ‘The gold will soon be mine.’ Mother Holle led her, as she had led her sister, to the broad gateway; but as she was passing...

### rapunzel

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/rapunzel.preview.json
- Generated title verdict: pass: generated title is Rapunzel
- Generated author verdict: pass: generated author is Jacob Grimm; Wilhelm Grimm
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is Rapunzel and starts from real readable content
- End boundary verdict: pass: generated output ends at Rapunzel with source/license/end-matter tails removed
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

- Title evidence: RAPUNZEL
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw start: There were once a man and a woman who had long in vain wished for a child. At length the woman hoped that God was about to grant her desire. These people had a little window at the back of their house from which a splendid garden could be seen, which was full
- Generated first section: There were once a man and a woman who had long in vain wished for a child. At length the woman hoped that God was about to grant her desire. These people had a little window at the back of their house from which a splendid garden could be seen, which was fu...
- Generated first default: There were once a man and a woman who had long in vain wished for a child. At length the woman hoped that God was about to grant her desire. These people had a little window at the back of their house from which a splendid garden could be seen, which was fu...
- Preview start: There were once a man and a woman who had long in vain wished for a child. At length the woman hoped that God was about to grant her desire. These people had a little window at the back of their house from which a splendid garden could be seen, which was fu...
- Raw end: knew him and fell on his neck and wept. Two of her tears wetted his eyes and they grew clear again, and he could see with them as before. He led her to his kingdom where he was joyfully received, and they lived for a long time afterwards, happy and contented.
- Generated end: en he wandered quite blind about the forest, ate nothing but roots and berries, and did naught but lament and weep over the loss of his dearest wife. Thus he roamed about in misery for some years, and at length came to the desert where Rapunzel, with the tw...

### the-juniper-tree

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-juniper-tree.preview.json
- Generated title verdict: pass: generated title is The Juniper-Tree
- Generated author verdict: pass: generated author is Jacob Grimm; Wilhelm Grimm
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Juniper-Tree and starts from real readable content
- End boundary verdict: pass: generated output ends at The Juniper-Tree with source/license/end-matter tails removed
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

- Title evidence: THE JUNIPER-TREE
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw start: Long, long ago, some two thousand years or so, there lived a rich man with a good and beautiful wife. They loved each other dearly, but sorrowed much that they had no children. So greatly did they desire to have one, that the wife prayed for it day and night,
- Generated first section: Long, long ago, some two thousand years or so, there lived a rich man with a good and beautiful wife. They loved each other dearly, but sorrowed much that they had no children. So greatly did they desire to have one, that the wife prayed for it day and nigh...
- Generated first default: Long, long ago, some two thousand years or so, there lived a rich man with a good and beautiful wife. They loved each other dearly, but sorrowed much that they had no children. So greatly did they desire to have one, that the wife prayed for it day and nigh...
- Preview start: Long, long ago, some two thousand years or so, there lived a rich man with a good and beautiful wife. They loved each other dearly, but sorrowed much that they had no children. So greatly did they desire to have one, that the wife prayed for it day and nigh...
- Raw end: ly saw mist and flame and fire rising from the spot, and when these had passed, there stood the little brother, and he took the father and little Marleen by the hand; then they all three rejoiced, and went inside together and sat down to their dinners and ate.
- Generated end: nd he has given me a pair of red shoes.’ The wife sprang up, with her hair standing out from her head like flames of fire. ‘Then I will go out too,’ she said, ‘and see if it will lighten my misery, for I feel as if the world were coming to an end.’ But as s...

### the-seven-ravens

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-seven-ravens.preview.json
- Generated title verdict: pass: generated title is The Seven Ravens
- Generated author verdict: pass: generated author is Jacob Grimm; Wilhelm Grimm
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Seven Ravens and starts from real readable content
- End boundary verdict: pass: generated output ends at The Seven Ravens with source/license/end-matter tails removed
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

- Title evidence: THE SEVEN RAVENS
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw start: There was once a man who had seven sons, and last of all one daughter. Although the little girl was very pretty, she was so weak and small that they thought she could not live; but they said she should at once be christened. So the father sent one of his sons
- Generated first section: There was once a man who had seven sons, and last of all one daughter. Although the little girl was very pretty, she was so weak and small that they thought she could not live; but they said she should at once be christened. So the father sent one of his so...
- Generated first default: There was once a man who had seven sons, and last of all one daughter. Although the little girl was very pretty, she was so weak and small that they thought she could not live; but they said she should at once be christened. So the father sent one of his so...
- Preview start: There was once a man who had seven sons, and last of all one daughter. Although the little girl was very pretty, she was so weak and small that they thought she could not live; but they said she should at once be christened. So the father sent one of his so...
- Raw end: ome! then we should be free.’ When the little girl heard this (for she stood behind the door all the time and listened), she ran forward, and in an instant all the ravens took their right form again; and all hugged and kissed each other, and went merrily home.
- Generated end: nted to eat and drink, and looked for their little plates and glasses. Then said one after the other, ‘Who has eaten from my little plate? And who has been drinking out of my little glass?’ ‘Caw! Caw! well I ween Mortal lips have this way been.’ When the se...

### the-wedding-of-mrs-fox

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-wedding-of-mrs-fox.preview.json
- Generated title verdict: pass: generated title is The Wedding of Mrs Fox
- Generated author verdict: pass: generated author is Jacob Grimm; Wilhelm Grimm
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Wedding of Mrs Fox and starts from real readable content
- End boundary verdict: pass: generated output ends at The Wedding of Mrs Fox with source/license/end-matter tails removed
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

- Title evidence: THE WEDDING OF MRS FOX
- Author evidence: Author: Jacob Grimm; Wilhelm Grimm
- Raw start: There was once upon a time an old fox with nine tails, who believed that his wife was not faithful to him, and wished to put her to the test. He stretched himself out under the bench, did not move a limb, and behaved as if he were stone dead. Mrs Fox went up t
- Generated first section: There was once upon a time an old fox with nine tails, who believed that his wife was not faithful to him, and wished to put her to the test. He stretched himself out under the bench, did not move a limb, and behaved as if he were stone dead. Mrs Fox went u...
- Generated first default: There was once upon a time an old fox with nine tails, who believed that his wife was not faithful to him, and wished to put her to the test. He stretched himself out under the bench, did not move a limb, and behaved as if he were stone dead. Mrs Fox went u...
- Preview start: There was once upon a time an old fox with nine tails, who believed that his wife was not faithful to him, and wished to put her to the test. He stretched himself out under the bench, did not move a limb, and behaved as if he were stone dead. Mrs Fox went u...
- Raw end: For many a fine fat mouse he brought, Yet of his wife he never thought, But ate up every one he caught.’ Then the wedding was solemnized with young Mr Fox, and there was much rejoicing and dancing; and if they have not left off, they are dancing still.
- Generated end: es which old Mr Fox had possessed, was always lacking, and the cat had continually to send the suitors away. At length came a young fox. Then Mrs Fox said: ‘Has the gentleman red stockings on, and has a little pointed mouth?’ ‘Yes,’ said the cat, ‘he has.’...

### the-adventures-of-kintaro-the-golden-boy

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-adventures-of-kintaro-the-golden-boy.preview.json
- Generated title verdict: pass: generated title is The Adventures of Kintaro, the Golden Boy
- Generated author verdict: pass: generated author is Yei Theodora Ozaki
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Adventures of Kintaro, the Golden Boy and starts from real readable content
- End boundary verdict: pass: generated output ends at The Adventures of Kintaro, the Golden Boy with source/license/end-matter tails removed
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

- Title evidence: THE ADVENTURES OF KINTARO, THE GOLDEN BOY
- Author evidence: Author: Yei Theodora Ozaki
- Raw start: Long, long ago there lived in Kyoto a brave soldier named Kintoki. Now he fell in love with a beautiful lady and married her. Not long after this, through the malice of some of his friends, he fell into disgrace at Court and was dismissed. This misfortune so p
- Generated first section: Long, long ago there lived in Kyoto a brave soldier named Kintoki. Now he fell in love with a beautiful lady and married her. Not long after this, through the malice of some of his friends, he fell into disgrace at Court and was dismissed. This misfortune s...
- Generated first default: Long, long ago there lived in Kyoto a brave soldier named Kintoki. Now he fell in love with a beautiful lady and married her. Not long after this, through the malice of some of his friends, he fell into disgrace at Court and was dismissed. This misfortune s...
- Preview start: Long, long ago there lived in Kyoto a brave soldier named Kintoki. Now he fell in love with a beautiful lady and married her. Not long after this, through the malice of some of his friends, he fell into disgrace at Court and was dismissed. This misfortune s...
- Raw end: ro of his country, and great was the power and honor and wealth that came to him. He now kept his promise and built a comfortable home for his old mother, who lived happily with him in the Capital to the end of her days. Is not this the story of a great hero?
- Generated end: n after this event, news was brought to the city that a cannibal monster had taken up his abode not far away and that people were stricken with fear. Lord Raiko ordered Kintaro to the rescue. He immediately started off, delighted at the prospect of trying h...

### the-bamboo-cutter-and-the-moon-child

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-bamboo-cutter-and-the-moon-child.preview.json
- Generated title verdict: pass: generated title is The Bamboo-Cutter and the Moon-Child
- Generated author verdict: pass: generated author is Yei Theodora Ozaki
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Bamboo-Cutter and the Moon-Child and starts from real readable content
- End boundary verdict: pass: generated output ends at The Bamboo-Cutter and the Moon-Child with source/license/end-matter tails removed
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

- Title evidence: THE BAMBOO-CUTTER AND THE MOON-CHILD
- Author evidence: Author: Yei Theodora Ozaki
- Raw start: Long, long ago, there lived an old bamboo wood-cutter. He was very poor and sad also, for no child had Heaven sent to cheer his old age, and in his heart there was no hope of rest from work till he died and was laid in the quiet grave. Every morning he went fo
- Generated first section: Long, long ago, there lived an old bamboo wood-cutter. He was very poor and sad also, for no child had Heaven sent to cheer his old age, and in his heart there was no hope of rest from work till he died and was laid in the quiet grave. Every morning he went...
- Generated first default: Long, long ago, there lived an old bamboo wood-cutter. He was very poor and sad also, for no child had Heaven sent to cheer his old age, and in his heart there was no hope of rest from work till he died and was laid in the quiet grave. Every morning he went...
- Preview start: Long, long ago, there lived an old bamboo wood-cutter. He was very poor and sad also, for no child had Heaven sent to cheer his old age, and in his heart there was no hope of rest from work till he died and was laid in the quiet grave. Every morning he went...
- Raw end: so he sent it with the letter to the top of the most sacred mountain in the land. Mount Fuji, and there the Royal emissaries burnt it on the summit at sunrise. So to this day people say there is smoke to be seen rising from the top of Mount Fuji to the clouds.
- Generated end: them to the Emperor. Then the chariot began to roll heavenwards towards the moon, and as they all gazed with tearful eyes at the receding Princess, the dawn broke, and in the rosy light of day the moon-chariot and all in it were lost amongst the fleecy clou...

### the-goblin-of-adachigahara

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-goblin-of-adachigahara.preview.json
- Generated title verdict: pass: generated title is The Goblin of Adachigahara
- Generated author verdict: pass: generated author is Yei Theodora Ozaki
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Goblin of Adachigahara and starts from real readable content
- End boundary verdict: pass: generated output ends at The Goblin of Adachigahara with source/license/end-matter tails removed
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

- Title evidence: THE GOBLIN OF ADACHIGAHARA
- Author evidence: Author: Yei Theodora Ozaki
- Raw start: Long, long ago there was a large plain called Adachigahara, in the province of Mutsu in Japan. This place was said to be haunted by a cannibal goblin who took the form of an old woman. From time to time many travelers disappeared and were never heard of more,
- Generated first section: Long, long ago there was a large plain called Adachigahara, in the province of Mutsu in Japan. This place was said to be haunted by a cannibal goblin who took the form of an old woman. From time to time many travelers disappeared and were never heard of mor...
- Generated first default: Long, long ago there was a large plain called Adachigahara, in the province of Mutsu in Japan. This place was said to be haunted by a cannibal goblin who took the form of an old woman. From time to time many travelers disappeared and were never heard of mor...
- Preview start: Long, long ago there was a large plain called Adachigahara, in the province of Mutsu in Japan. This place was said to be haunted by a cannibal goblin who took the form of an old woman. From time to time many travelers disappeared and were never heard of mor...
- Raw end: dha to whom he had prayed for help, so he took out his rosary and bowing his head as the sun rose he said his prayers and made his thanksgiving earnestly. He then set forward for another part of the country, only too glad to leave the haunted plain behind him.
- Generated end: as. In her hand she carried a large blood-stained knife, and she still shrieked after him, “Stop! stop!” At last, when the priest felt he could run no more, the dawn broke, and with the darkness of night the goblin vanished and he was safe. The priest now k...

### the-jelly-fish-and-the-monkey

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-jelly-fish-and-the-monkey.preview.json
- Generated title verdict: pass: generated title is The Jelly Fish and the Monkey
- Generated author verdict: pass: generated author is Yei Theodora Ozaki
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Jelly Fish and the Monkey and starts from real readable content
- End boundary verdict: pass: generated output ends at The Jelly Fish and the Monkey with source/license/end-matter tails removed
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

- Title evidence: THE JELLY FISH AND THE MONKEY
- Author evidence: Author: Yei Theodora Ozaki
- Raw start: Long, long ago, in old Japan, the Kingdom of the Sea was governed by a wonderful King. He was called Rin Jin, or the Dragon King of the Sea. His power was immense, for he was the ruler of all sea creatures both great and small, and in his keeping were the Jewe
- Generated first section: Long, long ago, in old Japan, the Kingdom of the Sea was governed by a wonderful King. He was called Rin Jin, or the Dragon King of the Sea. His power was immense, for he was the ruler of all sea creatures both great and small, and in his keeping were the J...
- Generated first default: Long, long ago, in old Japan, the Kingdom of the Sea was governed by a wonderful King. He was called Rin Jin, or the Dragon King of the Sea. His power was immense, for he was the ruler of all sea creatures both great and small, and in his keeping were the J...
- Preview start: Long, long ago, in old Japan, the Kingdom of the Sea was governed by a wonderful King. He was called Rin Jin, or the Dragon King of the Sea. His power was immense, for he was the ruler of all sea creatures both great and small, and in his keeping were the J...
- Raw end: d bones something like a tortoise, but, ever since the Dragon King’s sentence was carried out on the ancestor of the jelly fishes, his descendants have all been soft and boneless just as you see them to-day thrown up by the waves high upon the shores of Japan.
- Generated end: ed. The servants of the Palace forthwith each brought out a stick and surrounded the jelly fish, and after pulling out his bones they beat him to a flat pulp, and then took him out beyond the Palace gates and threw him into the water. Here he was left to su...

### the-tongue-cut-sparrow

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-tongue-cut-sparrow.preview.json
- Generated title verdict: pass: generated title is The Tongue-Cut Sparrow
- Generated author verdict: pass: generated author is Yei Theodora Ozaki
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Tongue-Cut Sparrow and starts from real readable content
- End boundary verdict: pass: generated output ends at The Tongue-Cut Sparrow with source/license/end-matter tails removed
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

- Title evidence: THE TONGUE-CUT SPARROW
- Author evidence: Author: Yei Theodora Ozaki
- Raw start: Long, long ago in Japan there lived an old man and his wife. The old man was a good, kind-hearted, hard-working old fellow, but his wife was a regular cross-patch, who spoiled the happiness of her home by her scolding tongue. She was always grumbling about som
- Generated first section: Long, long ago in Japan there lived an old man and his wife. The old man was a good, kind-hearted, hard-working old fellow, but his wife was a regular cross-patch, who spoiled the happiness of her home by her scolding tongue. She was always grumbling about...
- Generated first default: Long, long ago in Japan there lived an old man and his wife. The old man was a good, kind-hearted, hard-working old fellow, but his wife was a regular cross-patch, who spoiled the happiness of her home by her scolding tongue. She was always grumbling about...
- Preview start: Long, long ago in Japan there lived an old man and his wife. The old man was a good, kind-hearted, hard-working old fellow, but his wife was a regular cross-patch, who spoiled the happiness of her home by her scolding tongue. She was always grumbling about...
- Raw end: degrees became a good old woman, so that her husband hardly knew her to be the same person, and they spent their last days together happily, free from want or care, spending carefully the treasure the old man had received from his pet, the tongue-cut sparrow.
- Generated end: her husband with tears all that had happened to her, and how she had been nearly killed by the demons in the box. Then she began to blame the sparrow, but the old man stopped her at once, saying: “Don’t blame the sparrow, it is your wickedness which has at...

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
