# Pilot write batch 9 verification

Post-write QA pass for the 18 processed batch-9 books plus the two skip decisions.

## Totals

- Processed books verified: 18
- Pass: 18
- Warn accepted: 0
- Fail: 0
- Accepted for main: 18
- Corrections applied during verification: 0

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
    "generatedBookCount": 192,
    "validStartupPreviewCount": 192,
    "previewAssetsUpdated": [],
    "invalidOrMissing": []
  },
  "titleStartDefault": {
    "generatedBooksAudited": 192,
    "acceptedGeneratedBooksAudited": 117,
    "correctionsApplied": 12,
    "acceptedBooksCorrected": 12,
    "acceptanceRevokedPendingCorrection": 0
  },
  "metadataSegmentation": {
    "generatedBooksAudited": 192,
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

## Skipped books

### the-two-magics-the-turn-of-the-screw-covering-end

- Skipped: yes
- No generated output created: yes
- No preview asset created: yes
- Duplicate/boundary risk confirmed: yes
- Existing generated target: the-turn-of-the-screw
- Existing generated target unchanged: yes
- Accepted for skip: yes
- Accepted as newly processed: no
- Skip reason: Skipped after write-pass duplicate check: the raw file is the collection The Two Magics and contains a full The Turn of the Screw, while generated the-turn-of-the-screw already exists; no distinct-version policy exists for duplicating that work under a collection slug.

### the-works-of-edgar-allan-poe

- Skipped: yes
- No generated output created: yes
- No preview asset created: yes
- Duplicate/boundary risk confirmed: yes
- Existing generated target: n/a
- Existing generated target unchanged: n/a
- Accepted for skip: yes
- Accepted as newly processed: no
- Skip reason: Skipped after write-pass boundary check: the raw Volume 2 begins with THE PURLOINED LETTER, but the dry-run proposed starting at the next story, which would drop real opening collection content.

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

### a-study-in-scarlet

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 19 files
- Preview asset inspected: public/book-previews/a-study-in-scarlet.preview.json
- Generated title verdict: pass: generated title is A Study in Scarlet
- Generated author verdict: pass: generated author is Arthur Conan Doyle
- Selected structural convention: chapter-based roman numerals with part divisions
- Start boundary verdict: pass: first default is Chapter 1 - Part I. and starts from real readable content
- End boundary verdict: pass: generated output ends at Chapter 7 with source/license/end-matter tails removed
- Sectioning verdict: pass: 14 sections preserve chapter-based roman numerals with part divisions
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: A Study in Scarlet
- Author evidence: Author: Arthur Conan Doyle
- Raw start: Chapter 1 MR. SHERLOCK HOLMES. In the year 1878 I took my degree of Doctor of Medicine of the University of London, and proceeded to Netley to go through the course prescribed for surgeons in the army. Having completed my studies there, I was duly attached...
- Generated first section: PART I. (_Being a reprint from the Reminiscences of_ JOHN H. WATSON, M.D., _Late of the Army Medical Department._) CHAPTER I. MR. SHERLOCK HOLMES. In the year 1878 I took my degree of Doctor of Medicine of the University of London, and proceeded to Netley t...
- Generated first default: PART I. (_Being a reprint from the Reminiscences of_ JOHN H. WATSON, M.D., _Late of the Army Medical Department._) CHAPTER I. MR. SHERLOCK HOLMES. In the year 1878 I took my degree of Doctor of Medicine of the University of London, and proceeded to Netley t...
- Preview start: PART I. (_Being a reprint from the Reminiscences of_ JOHN H. WATSON, M.D., _Late of the Army Medical Department._) CHAPTER I. MR. SHERLOCK HOLMES. In the year 1878 I took my degree of Doctor of Medicine of the University of London, and proceeded to Netley t...
- Raw end: out. If he died like a dog among the mountains, what was to become of his revenge then? And yet such a death was sure to overtake him if he persisted. He felt that that was to play his enemy?s game, so he reluctantly returned to the old Nevada mines, there...
- Generated end: shown some talent in the detective line, and who, with such instructors, may hope in time to attain to some degree of their skill. It is expected that a testimonial of some sort will be presented to the two officers as a fitting recognition of their service...

### dagon

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/dagon.preview.json
- Generated title verdict: pass: generated title is Dagon
- Generated author verdict: pass: generated author is H. P. Lovecraft
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is Dagon and starts from real readable content
- End boundary verdict: pass: generated output ends at Dagon with source/license/end-matter tails removed
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

- Title evidence: Title: Dagon
- Author evidence: H. P. Lovecraft
- Raw start: Dagon I am writing this under an appreciable mental strain, since by tonight I shall be no more. Penniless, and at the end of my supply of the drug which alone makes life endurable, I can bear the torture no longer; and shall cast myself from this garret wi...
- Generated first section: I am writing this under an appreciable mental strain, since by tonight I shall be no more. Penniless, and at the end of my supply of the drug which alone makes life endurable, I can bear the torture no longer; and shall cast myself from this garret window i...
- Generated first default: I am writing this under an appreciable mental strain, since by tonight I shall be no more. Penniless, and at the end of my supply of the drug which alone makes life endurable, I can bear the torture no longer; and shall cast myself from this garret window i...
- Preview start: I am writing this under an appreciable mental strain, since by tonight I shall be no more. Penniless, and at the end of my supply of the drug which alone makes life endurable, I can bear the torture no longer; and shall cast myself from this garret window i...
- Raw end: ne idols and carving their own detestable likenesses on submarine obelisks of water-soaked granite. I dream of a day when they may rise above the billows to drag down in their reeking talons the remnants of puny, war-exhausted mankind--of a day when the lan...
- Generated end: shuddering at the nameless things that may at this very moment be crawling and floundering on its slimy bed, worshipping their ancient stone idols and carving their own detestable likenesses on submarine obelisks of water-soaked granite. I dream of a day wh...

### deep-sea-plunderings

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 29 files
- Preview asset inspected: public/book-previews/deep-sea-plunderings.preview.json
- Generated title verdict: pass: generated title is Deep-Sea Plunderings
- Generated author verdict: pass: generated author is Frank Thomas Bullen
- Selected structural convention: 24 contents-listed story headings after title, prefatory note, contents, and illustration list
- Start boundary verdict: pass: first default is THROUGH FIRE AND WATER and starts from real readable content
- End boundary verdict: pass: generated output ends at LOST AND FOUND with source/license/end-matter tails removed
- Sectioning verdict: pass: 24 sections preserve 24 contents-listed story headings after title, prefatory note, contents, and illustration list
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Deep-Sea Plunderings
- Author evidence: Author: Frank Thomas Bullen
- Raw start: THROUGH FIRE AND WATER What a clumsy, barrel-bellied old hooker she is, Field!? Thus, closing his telescope with a bang, the elegant chief officer of the Mirzapore, steel four-masted clipper ship of 5000 tons burden, presently devouring the degrees of longi...
- Generated first section: THROUGH FIRE AND WATER “What a clumsy, barrel-bellied old hooker she is, Field!” Thus, closing his telescope with a bang, the elegant chief officer of the Mirzapore, steel four-masted clipper ship of 5000 tons burden, presently devouring the degrees of long...
- Generated first default: THROUGH FIRE AND WATER “What a clumsy, barrel-bellied old hooker she is, Field!” Thus, closing his telescope with a bang, the elegant chief officer of the Mirzapore, steel four-masted clipper ship of 5000 tons burden, presently devouring the degrees of long...
- Preview start: THROUGH FIRE AND WATER “What a clumsy, barrel-bellied old hooker she is, Field!” Thus, closing his telescope with a bang, the elegant chief officer of the Mirzapore, steel four-masted clipper ship of 5000 tons burden, presently devouring the degrees of long...
- Raw end: esses all these qualities.... Almost bare of synthetical decoration, his paragraphs are stirring because they are real. We read at times--as we have read the great masters of romance--breathlessly.?--_The Critic._ =The Translation of a Savage.= $1.25. ?A bo...
- Generated end: ._ “His is a picturesque personality, and he stands the supreme test by being as popular with his officers and men as he is with the public generally. His life has been one of action and adventure since he was a boy, and the record of it which he has prepar...

### five-little-peppers-at-school

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 30 files
- Preview asset inspected: public/book-previews/five-little-peppers-at-school.preview.json
- Generated title verdict: pass: generated title is Five Little Peppers at School
- Generated author verdict: pass: generated author is Margaret Sidney
- Selected structural convention: 25 contents-listed roman chapter-title headings after title page, book list, contents, and illustrations
- Start boundary verdict: pass: first default is Chapter 1 - Hard Times for Joel and starts from real readable content
- End boundary verdict: pass: generated output ends at Chapter 25 - "The Very Prettiest Affair" with source/license/end-matter tails removed
- Sectioning verdict: pass: 25 sections preserve 25 contents-listed roman chapter-title headings after title page, book list, contents, and illustrations
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Five Little Peppers at School
- Author evidence: Author: Margaret Sidney
- Raw start: I HARD TIMES FOR JOEL Come on, Pepper." One of the boys rushed down the dormitory hall, giving a bang on Joel's door as he passed. "All right," said Joel a bit crossly, "I'm coming." "Last bell," came back on the wind. Joel threw his tennis racket on the be...
- Generated first section: I HARD TIMES FOR JOEL "Come on, Pepper." One of the boys rushed down the dormitory hall, giving a bang on Joel's door as he passed. "All right," said Joel a bit crossly, "I'm coming." "Last bell," came back on the wind. Joel threw his tennis racket on the b...
- Generated first default: I HARD TIMES FOR JOEL "Come on, Pepper." One of the boys rushed down the dormitory hall, giving a bang on Joel's door as he passed. "All right," said Joel a bit crossly, "I'm coming." "Last bell," came back on the wind. Joel threw his tennis racket on the b...
- Preview start: I HARD TIMES FOR JOEL "Come on, Pepper." One of the boys rushed down the dormitory hall, giving a bang on Joel's door as he passed. "All right," said Joel a bit crossly, "I'm coming." "Last bell," came back on the wind. Joel threw his tennis racket on the b...
- Raw end: lope to Mr. King. "It's for Mrs. Fisher," said the old gentleman. So the yellow envelope went down the table-length, the color going out of Polly's cheek; and she didn't dare to look at Mamsie's eyes. "Oh--the boys!" gasped Polly. "Jasper, do you suppose?"-...
- Generated end: rose. "Everything has been beautiful to-day; and now I just know something perfectly lovely is coming to finish off with." "A telegram, sir." Johnson held out a long yellow envelope to Mr. King. "It's for Mrs. Fisher," said the old gentleman. So the yellow...

### pickman-s-model

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/pickman-s-model.preview.json
- Generated title verdict: pass: generated title is Pickman's Model
- Generated author verdict: pass: generated author is H. P. Lovecraft
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is Pickman's Model and starts from real readable content
- End boundary verdict: pass: generated output ends at Pickman's Model with source/license/end-matter tails removed
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

- Title evidence: Title: Pickman's Model
- Author evidence: Author: H. P. Lovecraft (1890-1937)
- Raw start: Pickman's Model You needn't think I'm crazy, Eliot--plenty of others have queerer prejudices than this. Why don't you laugh at Oliver's grandfather, who won't ride in a motor? If I don't like that damned subway, it's my own business; and we got here more qu...
- Generated first section: You needn't think I'm crazy, Eliot--plenty of others have queerer prejudices than this. Why don't you laugh at Oliver's grandfather, who won't ride in a motor? If I don't like that damned subway, it's my own business; and we got here more quickly anyhow in...
- Generated first default: You needn't think I'm crazy, Eliot--plenty of others have queerer prejudices than this. Why don't you laugh at Oliver's grandfather, who won't ride in a motor? If I don't like that damned subway, it's my own business; and we got here more quickly anyhow in...
- Preview start: You needn't think I'm crazy, Eliot--plenty of others have queerer prejudices than this. Why don't you laugh at Oliver's grandfather, who won't ride in a motor? If I don't like that damned subway, it's my own business; and we got here more quickly anyhow in...
- Raw end: r that monster. That last scare had come while I was reaching to uncurl it, and it seems I had vacantly crumpled it into my pocket. But here's the coffee--take it black, Eliot, if you're wise. Well--that paper wasn't a photograph of any background, after al...
- Generated end: paper tacked to that frightful canvas in the cellar; the thing I thought was a photograph of some scene he meant to use as a background for that monster. That last scare had come while I was reaching to uncurl it, and it seems I had vacantly crumpled it int...

### quo-vadis

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 78 files
- Preview asset inspected: public/book-previews/quo-vadis.preview.json
- Generated title verdict: pass: generated title is Quo Vadis: A Narrative of the Time of Nero
- Generated author verdict: pass: generated author is Henryk Sienkiewicz
- Selected structural convention: chapter-based roman numerals
- Start boundary verdict: pass: first default is Chapter 1 and starts from real readable content
- End boundary verdict: pass: generated output ends at Chapter 73 with source/license/end-matter tails removed
- Sectioning verdict: pass: 73 sections preserve chapter-based roman numerals
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Quo Vadis: A Narrative of the Time of Nero
- Author evidence: Author: Henryk Sienkiewicz
- Raw start: Chapter 1 PETRONIUS woke only about midday, and as usual greatly wearied. The evening before he had been at one of Nero?s feasts, which was prolonged till late at night. For some time his health had been failing. He said himself that he woke up benumbed, as...
- Generated first section: Chapter I PETRONIUS woke only about midday, and as usual greatly wearied. The evening before he had been at one of Nero’s feasts, which was prolonged till late at night. For some time his health had been failing. He said himself that he woke up benumbed, as...
- Generated first default: Chapter I PETRONIUS woke only about midday, and as usual greatly wearied. The evening before he had been at one of Nero’s feasts, which was prolonged till late at night. For some time his health had been failing. He said himself that he woke up benumbed, as...
- Preview start: Chapter I PETRONIUS woke only about midday, and as usual greatly wearied. The evening before he had been at one of Nero’s feasts, which was prolonged till late at night. For some time his health had been failing. He said himself that he woke up benumbed, as...
- Raw end: t that the hour of death was near. Terror and reproaches of conscience seized him. He declared that he saw darkness in front of him in the form of a black cloud. From that cloud came forth faces in which he saw his mother, his wife, and his brother. His tee...
- Generated end: hee life!” cried the centurion, entering. “Too late!” said Nero, with a hoarse voice; then he added,-- “Here is faithfulness!” In a twinkle death seized his head. Blood from his heavy neck gushed in a dark stream on the flowers of the garden. His legs kicke...

### the-amateur-cracksman

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 13 files
- Preview asset inspected: public/book-previews/the-amateur-cracksman.preview.json
- Generated title verdict: pass: generated title is The Amateur Cracksman
- Generated author verdict: pass: generated author is E. W. Hornung
- Selected structural convention: 8 contents-listed Raffles story headings after title, dedication, and contents
- Start boundary verdict: pass: first default is THE IDES OF MARCH and starts from real readable content
- End boundary verdict: pass: generated output ends at THE GIFT OF THE EMPEROR with source/license/end-matter tails removed
- Sectioning verdict: pass: 8 sections preserve 8 contents-listed Raffles story headings after title, dedication, and contents
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The Amateur Cracksman
- Author evidence: Author: E. W. Hornung
- Raw start: THE IDES OF MARCH It was half-past twelve when I returned to the Albany as a last desperate resort. The scene of my disaster was much as I had left it. The baccarat-counters still strewed the table, with the empty glasses and the loaded ash-trays. A window...
- Generated first section: THE IDES OF MARCH I It was half-past twelve when I returned to the Albany as a last desperate resort. The scene of my disaster was much as I had left it. The baccarat-counters still strewed the table, with the empty glasses and the loaded ash-trays. A windo...
- Generated first default: THE IDES OF MARCH I It was half-past twelve when I returned to the Albany as a last desperate resort. The scene of my disaster was much as I had left it. The baccarat-counters still strewed the table, with the empty glasses and the loaded ash-trays. A windo...
- Preview start: THE IDES OF MARCH I It was half-past twelve when I returned to the Albany as a last desperate resort. The scene of my disaster was much as I had left it. The baccarat-counters still strewed the table, with the empty glasses and the loaded ash-trays. A windo...
- Raw end: ad brought, and laid it gently over his mouth. Two or three stertorous breaths, and the man was a log. I removed the handkerchief; I extracted the keys from his pocket. In less than five minutes I put them back, after winding the picture about my body benea...
- Generated end: rade's head. Suddenly the sun sank behind the Island of Elba, the lane of dancing sunlight was instantaneously quenched and swallowed in the trackless waste, and in the middle distance, already miles astern, either my sight deceived me or a black speck bobb...

### the-black-star-passes

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 23 files
- Preview asset inspected: public/book-previews/the-black-star-passes.preview.json
- Generated title verdict: pass: generated title is The Black Star Passes
- Generated author verdict: pass: generated author is John W. Campbell, Jr.
- Selected structural convention: standalone roman numeral sections with book divisions
- Start boundary verdict: pass: first default is Chapter 1 and starts from real readable content
- End boundary verdict: pass: generated output ends at Chapter 6 with source/license/end-matter tails removed
- Sectioning verdict: pass: 18 sections preserve standalone roman numeral sections with book divisions
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The Black Star Passes
- Author evidence: JOHN W. CAMPBELL; Copyright, 1953, by John W. Campbell, Jr.
- Raw start: Chapter 1 On the thirty-ninth floor of a large New York apartment two young men were lounging about after a strenuous game of tennis. The blue tendrils of smoke from their pipes rose slowly, to be drawn away by the efficient ventilating system. The taller o...
- Generated first section: I. On the thirty-ninth floor of a large New York apartment two young men were lounging about after a strenuous game of tennis. The blue tendrils of smoke from their pipes rose slowly, to be drawn away by the efficient ventilating system. The taller of the t...
- Generated first default: I. On the thirty-ninth floor of a large New York apartment two young men were lounging about after a strenuous game of tennis. The blue tendrils of smoke from their pipes rose slowly, to be drawn away by the efficient ventilating system. The taller of the t...
- Preview start: I. On the thirty-ninth floor of a large New York apartment two young men were lounging about after a strenuous game of tennis. The blue tendrils of smoke from their pipes rose slowly, to be drawn away by the efficient ventilating system. The taller of the t...
- Raw end: come into sight." Swiftly Arcot sprang forward and caught his arm. "Lord--don't do that, Wade--there's too much stuff here that we don't know anything about. Too much chance of your smashing us with him. I'm going to try to get around to the other side of t...
- Generated end: Farley F-313 (40c) A BRAND NEW WORLD by Ray Cummings F-318 (40c) THE SPOT OF LIFE by Austin Hall M-119 (45c) JOURNEY TO THE CENTER OF THE EARTH by Jules Verne F-319 (40c) CRASHING SUNS by Edmond Hamilton F-321 (40c) MAZA OF THE MOON by Otis Adelbert Kline F...

### the-blue-castle

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 50 files
- Preview asset inspected: public/book-previews/the-blue-castle.preview.json
- Generated title verdict: pass: generated title is The Blue Castle: a novel
- Generated author verdict: pass: generated author is L. M. Montgomery
- Selected structural convention: chapter-based roman numerals
- Start boundary verdict: pass: first default is Chapter 1 and starts from real readable content
- End boundary verdict: pass: generated output ends at Chapter 45 with source/license/end-matter tails removed
- Sectioning verdict: pass: 45 sections preserve chapter-based roman numerals
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The Blue Castle: a novel
- Author evidence: Author: L. M. Montgomery
- Raw start: Chapter 1 If it had not rained on a certain May morning Valancy Stirling?s whole life would have been entirely different. She would have gone, with the rest of her clan, to Aunt Wellington?s engagement picnic and Dr. Trent would have gone to Montreal. But i...
- Generated first section: CHAPTER I If it had not rained on a certain May morning Valancy Stirling’s whole life would have been entirely different. She would have gone, with the rest of her clan, to Aunt Wellington’s engagement picnic and Dr. Trent would have gone to Montreal. But i...
- Generated first default: CHAPTER I If it had not rained on a certain May morning Valancy Stirling’s whole life would have been entirely different. She would have gone, with the rest of her clan, to Aunt Wellington’s engagement picnic and Dr. Trent would have gone to Montreal. But i...
- Preview start: CHAPTER I If it had not rained on a certain May morning Valancy Stirling’s whole life would have been entirely different. She would have gone, with the rest of her clan, to Aunt Wellington’s engagement picnic and Dr. Trent would have gone to Montreal. But i...
- Raw end: giana was it given. Valancy was in tears. ?Don?t cry, Moonlight. We?ll be back next summer. And now we?re off for a real honeymoon.? Valancy smiled through her tears. She was so happy that her happiness terrified her. But, despite the delights before her??t...
- Generated end: s going to take care of them until Barney and Valancy came back. Aunt Wellington and Cousin Sarah and Aunt Alberta had also entreated the privilege of looking after them, but to Cousin Georgiana was it given. Valancy was in tears. “Don’t cry, Moonlight. We’...

### the-brothers-karamazov

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 101 files
- Preview asset inspected: public/book-previews/the-brothers-karamazov.preview.json
- Generated title verdict: pass: generated title is The Brothers Karamazov
- Generated author verdict: pass: generated author is Fyodor Dostoyevsky
- Selected structural convention: chapter-based roman numerals with book divisions and part divisions
- Start boundary verdict: pass: first default is Chapter 1 - Book I. The History Of A Family and starts from real readable content
- End boundary verdict: pass: generated output ends at Chapter 3 with source/license/end-matter tails removed
- Sectioning verdict: pass: 96 sections preserve chapter-based roman numerals with book divisions and part divisions
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The Brothers Karamazov
- Author evidence: Author: Fyodor Dostoyevsky
- Raw start: Chapter 1 Fyodor Pavlovitch Karamazov Alexey Fyodorovitch Karamazov was the third son of Fyodor Pavlovitch Karamazov, a land owner well known in our district in his own day, and still remembered among us owing to his gloomy and tragic death, which happened...
- Generated first section: Book I. The History Of A Family Chapter I. Fyodor Pavlovitch Karamazov Alexey Fyodorovitch Karamazov was the third son of Fyodor Pavlovitch Karamazov, a land owner well known in our district in his own day, and still remembered among us owing to his gloomy...
- Generated first default: Book I. The History Of A Family Chapter I. Fyodor Pavlovitch Karamazov Alexey Fyodorovitch Karamazov was the third son of Fyodor Pavlovitch Karamazov, a land owner well known in our district in his own day, and still remembered among us owing to his gloomy...
- Preview start: Book I. The History Of A Family Chapter I. Fyodor Pavlovitch Karamazov Alexey Fyodorovitch Karamazov was the third son of Fyodor Pavlovitch Karamazov, a land owner well known in our district in his own day, and still remembered among us owing to his gloomy...
- Raw end: ned!? Alyosha answered, half laughing, half enthusiastic. ?Ah, how splendid it will be!? broke from Kolya. ?Well, now we will finish talking and go to his funeral dinner. Don?t be put out at our eating pancakes?it?s a very old custom and there?s something n...
- Generated end: r Karamazov!” FOOTNOTES In Russian, “silen.” A proverbial expression in Russia. Grushenka. i.e. setter dog. Probably the public event was the Decabrist plot against the Tsar, of December 1825, in which the most distinguished men in Russia were concerned.—TR...

### the-buccaneer

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 51 files
- Preview asset inspected: public/book-previews/the-buccaneer.preview.json
- Generated title verdict: pass: generated title is The Buccaneer: A Tale
- Generated author verdict: pass: generated author is Mrs. S. C. Hall
- Selected structural convention: three-volume chapter-based roman numerals with explicit CHAPTER IV safeguard
- Start boundary verdict: pass: first default is Chapter 1 and starts from real readable content
- End boundary verdict: pass: generated output ends at Chapter 15 with source/license/end-matter tails removed
- Sectioning verdict: pass: 46 sections preserve three-volume chapter-based roman numerals with explicit CHAPTER IV safeguard
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The Buccaneer: A Tale
- Author evidence: Author: Mrs. S. C. Hall
- Raw start: Chapter 1 With roomy decks, her guns of mighty strength, Whose low-laid mouths each mounting billow laves, Deep in her draught, and warlike in her length, She seems a sea wasp flying on the waves. DRYDEN. It was between the hours of ten and twelve on a fine...
- Generated first section: CHAPTER I. With roomy decks, her guns of mighty strength, Whose low-laid mouths each mounting billow laves, Deep in her draught, and warlike in her length, She seems a sea wasp flying on the waves. DRYDEN. It was between the hours of ten and twelve on a fin...
- Generated first default: CHAPTER I. With roomy decks, her guns of mighty strength, Whose low-laid mouths each mounting billow laves, Deep in her draught, and warlike in her length, She seems a sea wasp flying on the waves. DRYDEN. It was between the hours of ten and twelve on a fin...
- Preview start: CHAPTER I. With roomy decks, her guns of mighty strength, Whose low-laid mouths each mounting billow laves, Deep in her draught, and warlike in her length, She seems a sea wasp flying on the waves. DRYDEN. It was between the hours of ten and twelve on a fin...
- Raw end: urn me into a fable, wife!" exclaimed Robin, playfully interrupting her:--"I am, in my own proper person, an AEsop as it is. There has been enough of all this for to-night: we will but pledge another cup to the health of Sir Walter, the Lady Constance, and...
- Generated end: d purified and cleansed by that which devoureth our impurities, but maketh great that which deserveth greatness. As to Robin----" "Don't turn me into a fable, wife!" exclaimed Robin, playfully interrupting her:--"I am, in my own proper person, an AEsop as i...

### the-cats-of-ulthar

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-cats-of-ulthar.preview.json
- Generated title verdict: pass: generated title is The Cats of Ulthar
- Generated author verdict: pass: generated author is H. P. Lovecraft
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Cats of Ulthar and starts from real readable content
- End boundary verdict: pass: generated output ends at The Cats of Ulthar with source/license/end-matter tails removed
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

- Title evidence: Title: The Cats of Ulthar
- Author evidence: Author: Howard Phillips Lovecraft (1890-1937)
- Raw start: The Cats of Ulthar It is said that in Ulthar, which lies beyond the river Skai, no man may kill a cat; and this I can verily believe as I gaze upon him who sitteth purring before the fire. For the cat is cryptic, and close to strange things which men cannot...
- Generated first section: It is said that in Ulthar, which lies beyond the river Skai, no man may kill a cat; and this I can verily believe as I gaze upon him who sitteth purring before the fire. For the cat is cryptic, and close to strange things which men cannot see. He is the sou...
- Generated first default: It is said that in Ulthar, which lies beyond the river Skai, no man may kill a cat; and this I can verily believe as I gaze upon him who sitteth purring before the fire. For the cat is cryptic, and close to strange things which men cannot see. He is the sou...
- Preview start: It is said that in Ulthar, which lies beyond the river Skai, no man may kill a cat; and this I can verily believe as I gaze upon him who sitteth purring before the fire. For the cat is cryptic, and close to strange things which men cannot see. He is the sou...
- Raw end: meat as reward. They talked of the old cotter and his wife, of the caravan of dark wanderers, of small Menes and his black kitten, of the prayer of Menes and of the sky during that prayer, of the doings of the cats on the night the caravan left, and of what...
- Generated end: ang and Thul were overwhelmed with questions. Even little Atal, the innkeeper's son, was closely questioned and given a sweetmeat as reward. They talked of the old cotter and his wife, of the caravan of dark wanderers, of small Menes and his black kitten, o...

### the-festival

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-festival.preview.json
- Generated title verdict: pass: generated title is The Festival
- Generated author verdict: pass: generated author is H. P. Lovecraft
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Festival and starts from real readable content
- End boundary verdict: pass: generated output ends at The Festival with source/license/end-matter tails removed
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

- Title evidence: Title: The festival
- Author evidence: Author: H. P. Lovecraft
- Raw start: The Festival I was far from home, and the spell of the eastern sea was upon me. In the twilight I heard it pounding on the rocks, and I knew it lay just over the hill where the twisting willows writhed against the clearing sky and the first stars of evening...
- Generated first section: I was far from home, and the spell of the eastern sea was upon me. In the twilight I heard it pounding on the rocks, and I knew it lay just over the hill where the twisting willows writhed against the clearing sky and the first stars of evening. And because...
- Generated first default: I was far from home, and the spell of the eastern sea was upon me. In the twilight I heard it pounding on the rocks, and I knew it lay just over the hill where the twisting willows writhed against the clearing sky and the first stars of evening. And because...
- Preview start: I was far from home, and the spell of the eastern sea was upon me. In the twilight I heard it pounding on the rocks, and I knew it lay just over the hill where the twisting willows writhed against the clearing sky and the first stars of evening. And because...
- Raw end: ose wizards are all in ashes. For it is of old rumor that the soul of the devil-bought hastes not from his charnel clay, but fats and instructs _the very worm that gnaws_; till out of corruption horrid life springs, and the dull scavengers of earth wax craf...
- Generated end: es that see; for their marvels are strange and terrific. Cursed the ground where dead thoughts live new and oddly bodied, and evil the mind that is held by no head. Wisely did Ibn Schacabac say that happy is the tomb where no wizard hath lain, and happy the...

### the-history-of-sir-richard-calmady-a-romance

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 65 files
- Preview asset inspected: public/book-previews/the-history-of-sir-richard-calmady-a-romance.preview.json
- Generated title verdict: pass: generated title is The History of Sir Richard Calmady: A Romance
- Generated author verdict: pass: generated author is Lucas Malet
- Selected structural convention: chapter-based roman numerals with book divisions
- Start boundary verdict: pass: first default is Chapter 1 - Book I and starts from real readable content
- End boundary verdict: pass: generated output ends at Chapter 11 with source/license/end-matter tails removed
- Sectioning verdict: pass: 60 sections preserve chapter-based roman numerals with book divisions
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The History of Sir Richard Calmady: A Romance
- Author evidence: Author: Lucas Malet
- Raw start: Chapter 1 ACQUAINTING THE READER WITH A FAIR DOMAIN AND THE MAKER THEREOF In that fortunate hour of English history, when the cruel sights and haunting insecurities of the Middle Ages had passed away, and while, as yet, the fanatic zeal of Puritanism had no...
- Generated first section: BOOK I THE CLOWN CHAPTER I ACQUAINTING THE READER WITH A FAIR DOMAIN AND THE MAKER THEREOF In that fortunate hour of English history, when the cruel sights and haunting insecurities of the Middle Ages had passed away, and while, as yet, the fanatic zeal of...
- Generated first default: BOOK I THE CLOWN CHAPTER I ACQUAINTING THE READER WITH A FAIR DOMAIN AND THE MAKER THEREOF In that fortunate hour of English history, when the cruel sights and haunting insecurities of the Middle Ages had passed away, and while, as yet, the fanatic zeal of...
- Preview start: BOOK I THE CLOWN CHAPTER I ACQUAINTING THE READER WITH A FAIR DOMAIN AND THE MAKER THEREOF In that fortunate hour of English history, when the cruel sights and haunting insecurities of the Middle Ages had passed away, and while, as yet, the fanatic zeal of...
- Raw end: -you made long ago before you knew her?" "Never," he replied. "Without it I could not have served her as I have been able to serve her. I am wholly thankful for it. It made much possible which must have otherwise been impossible." "And have you never told h...
- Generated end: to me. But he's getting a trifle too fond of horses. I can't break poor, old Chifney's heart; but when his days are numbered, those of the stables--as far as training racers goes--are numbered likewise, I think. I'll keep on the stud farm. But I grow doubtf...

### the-nameless-city

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-nameless-city.preview.json
- Generated title verdict: pass: generated title is The Nameless City
- Generated author verdict: pass: generated author is H. P. Lovecraft
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Nameless City and starts from real readable content
- End boundary verdict: pass: generated output ends at The Nameless City with source/license/end-matter tails removed
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

- Title evidence: Title: The Nameless City
- Author evidence: Author: Howard Phillips Lovecraft (1890-1937)
- Raw start: The Nameless City When I drew nigh the nameless city I knew it was accursed. I was traveling in a parched and terrible valley under the moon, and afar I saw it protruding uncannily above the sands as parts of a corpse might protrude from an ill-made grave....
- Generated first section: When I drew nigh the nameless city I knew it was accursed. I was traveling in a parched and terrible valley under the moon, and afar I saw it protruding uncannily above the sands as parts of a corpse might protrude from an ill-made grave. Fear spoke from th...
- Generated first default: When I drew nigh the nameless city I knew it was accursed. I was traveling in a parched and terrible valley under the moon, and afar I saw it protruding uncannily above the sands as parts of a corpse might protrude from an ill-made grave. Fear spoke from th...
- Preview start: When I drew nigh the nameless city I knew it was accursed. I was traveling in a parched and terrible valley under the moon, and afar I saw it protruding uncannily above the sands as parts of a corpse might protrude from an ill-made grave. Fear spoke from th...
- Raw end: idor--a nightmare horde of rushing devils; hate-distorted, grotesquely panoplied, half-transparent devils of a race no man might mistake--the crawling reptiles of the nameless city. And as the wind died away I was plunged into the ghoul-peopled darkness of...
- Generated end: ued fiends. Turning, I saw outlined against the luminous æther of the abyss what could not be seen against the dusk of the corridor--a nightmare horde of rushing devils; hate-distorted, grotesquely panoplied, half-transparent devils of a race no man might m...

### the-three-taps-a-detective-story-without-a-moral

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 30 files
- Preview asset inspected: public/book-previews/the-three-taps-a-detective-story-without-a-moral.preview.json
- Generated title verdict: pass: generated title is The Three Taps
- Generated author verdict: pass: generated author is Ronald Arbuthnott Knox
- Selected structural convention: chapter-based roman numerals
- Start boundary verdict: pass: first default is Chapter 1 and starts from real readable content
- End boundary verdict: pass: generated output ends at Chapter 25 with source/license/end-matter tails removed
- Sectioning verdict: pass: 25 sections preserve chapter-based roman numerals
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The three taps
- Author evidence: Author: Ronald Arbuthnott Knox
- Raw start: Chapter 1 The Euthanasia Policy The principles of insurance, they tell us, were not hidden from our Anglo-Saxon forefathers. How anybody had the enterprise in those rough-and-tumble days to guarantee a client against ?fire, water, robbery or other calamity?...
- Generated first section: Chapter I The Euthanasia Policy The principles of insurance, they tell us, were not hidden from our Anglo-Saxon forefathers. How anybody had the enterprise in those rough-and-tumble days to guarantee a client against “fire, water, robbery or other calamity”...
- Generated first default: Chapter I The Euthanasia Policy The principles of insurance, they tell us, were not hidden from our Anglo-Saxon forefathers. How anybody had the enterprise in those rough-and-tumble days to guarantee a client against “fire, water, robbery or other calamity”...
- Preview start: Chapter I The Euthanasia Policy The principles of insurance, they tell us, were not hidden from our Anglo-Saxon forefathers. How anybody had the enterprise in those rough-and-tumble days to guarantee a client against “fire, water, robbery or other calamity”...
- Raw end: his, not a forgery. You will see why I mention that later on. This is how the letter runs: ??My dear Lord Bishop: ??Pursuant to our conversation of Thursday evening last, it will be within your Lordship?s memory that upon that occasion I asserted the right...
- Generated end: I think you’ve come out of the test very well. Besides, you can’t refuse the legacy; it’s in trust for the diocese. I hope Pullford will see a lot of Catholic activity now.” “The church collections will be beginning to fall off almost at once,” said Eames,...

### the-turmoil

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 38 files
- Preview asset inspected: public/book-previews/the-turmoil.preview.json
- Generated title verdict: pass: generated title is The Turmoil: A Novel
- Generated author verdict: pass: generated author is Booth Tarkington
- Selected structural convention: chapter-based roman numerals
- Start boundary verdict: pass: first default is Chapter 1 and starts from real readable content
- End boundary verdict: pass: generated output ends at Chapter 33 with source/license/end-matter tails removed
- Sectioning verdict: pass: 33 sections preserve chapter-based roman numerals
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The Turmoil: A Novel
- Author evidence: Author: Booth Tarkington
- Raw start: Chapter 1 There is a midland city in the heart of fair, open country, a dirty and wonderful city nesting dingily in the fog of its own smoke. The stranger must feel the dirt before he feels the wonder, for the dirt will be upon him instantly. It will be upo...
- Generated first section: CHAPTER I There is a midland city in the heart of fair, open country, a dirty and wonderful city nesting dingily in the fog of its own smoke. The stranger must feel the dirt before he feels the wonder, for the dirt will be upon him instantly. It will be upo...
- Generated first default: CHAPTER I There is a midland city in the heart of fair, open country, a dirty and wonderful city nesting dingily in the fog of its own smoke. The stranger must feel the dirt before he feels the wonder, for the dirt will be upon him instantly. It will be upo...
- Preview start: CHAPTER I There is a midland city in the heart of fair, open country, a dirty and wonderful city nesting dingily in the fog of its own smoke. The stranger must feel the dirt before he feels the wonder, for the dirt will be upon him instantly. It will be upo...
- Raw end: no answer. ?Mary?? he called, huskily. ?If you mean THAT--you'd let me see you--wouldn't you?? And now the voice was so low he could not be sure it spoke at all, but if it did, the words were, ?Yes, Bibbs--dear.? But the voice was not in the instrument--it...
- Generated end: 't the reason.” The voice was very low. “Mary,” he said, even more tremulously than before, “I can't--you COULDN'T mean it was because--you can't mean it was because you--care?” There was no answer. “Mary?” he called, huskily. “If you mean THAT--you'd let m...

### under-the-red-dragon

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 66 files
- Preview asset inspected: public/book-previews/under-the-red-dragon.preview.json
- Generated title verdict: pass: generated title is Under the Red Dragon: A Novel
- Generated author verdict: pass: generated author is James Grant
- Selected structural convention: chapter-based roman numerals
- Start boundary verdict: pass: first default is Chapter 1 - --THE INVITATION and starts from real readable content
- End boundary verdict: pass: generated output ends at Chapter 61 - --"FOR VALOUR." with source/license/end-matter tails removed
- Sectioning verdict: pass: 61 sections preserve chapter-based roman numerals
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Under the Red Dragon: A Novel
- Author evidence: Author: James Grant
- Raw start: Chapter 1: --THE INVITATION "And _she_ is to be there--nay, is there already; so one more chance is given me to meet her. But for what?--to part again silently, and more helplessly bewitched than ever, perhaps. Ah, never will she learn to love me as I love...
- Generated first section: CHAPTER I.--THE INVITATION. "And _she_ is to be there--nay, is there already; so one more chance is given me to meet her. But for what?--to part again silently, and more helplessly bewitched than ever, perhaps. Ah, never will she learn to love me as I love...
- Generated first default: CHAPTER I.--THE INVITATION. "And _she_ is to be there--nay, is there already; so one more chance is given me to meet her. But for what?--to part again silently, and more helplessly bewitched than ever, perhaps. Ah, never will she learn to love me as I love...
- Preview start: CHAPTER I.--THE INVITATION. "And _she_ is to be there--nay, is there already; so one more chance is given me to meet her. But for what?--to part again silently, and more helplessly bewitched than ever, perhaps. Ah, never will she learn to love me as I love...
- Raw end: was left in the rear, tied to a powder caisson; but he broke loose, came to the front at full gallop, and was recaptured under fire; the soldiers afterwards attached to his collar a copper medal, made from a pan found among the captured cooking utensils of...
- Generated end: broke out in 1866 till the peace in 1870. He always marched with the men of the first gun. At Köninghof, Herr Schneider was left in the rear, tied to a powder caisson; but he broke loose, came to the front at full gallop, and was recaptured under fire; the...

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
