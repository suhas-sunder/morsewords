# Pilot write batch 10 verification

Post-write QA pass for the 20 processed batch-10 books.

## Totals

- Processed books verified: 20
- Pass: 20
- Warn accepted: 0
- Fail: 0
- Accepted for main: 20
- Corrections applied during verification: 0

## Playwright fullscreen-controls triage

- Classification: flaky/unstable assertion
- Prior failing test: Morse book page foundation > renders an approved external-authority Gutenberg book as a public page
- Prior assertion: expect(getByTestId("book-video-preview-fullscreen-overlay")).toHaveAttribute("data-fullscreen-controls-visible", "false")
- Prior expected/actual: false / true
- Selector: getByTestId("book-video-preview-fullscreen-overlay")
- Timing: after entering fullscreen; overlay had data-fullscreen-active="true" and data-fullscreen-mode="browser"
- Surface: general approved external-authority Gutenberg book public page UI, not a batch-10 generated book page
- Write branch rerun: 2026-06-19 verification rerun on morsewords-book-processing-pilot-write-10-jun-2026: 36 passed with --reporter=line
- Main rerun: 2026-06-19 comparison rerun on latest main after git fetch/pull and typecheck: 36 passed with --reporter=line
- UI code changed: no
- The same full Playwright command passed on the write branch during this verification pass.
- The same full Playwright command also passed on latest main, so the prior failure is not reproducible as a deterministic pre-existing main failure.
- No fullscreen, hover, bulb, dark-mode, or live-preview UI code was modified in this verification branch.

## Audit side-effect handling

- Known unrelated title/start/default auto-corrections: 12
- Unrelated audit churn committed: no
- Handling: books:title-start-default-audit is known to reapply 12 unrelated older generated-book corrections; validation side effects are restored unless they are explicit batch-10 corrections.

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
    "generatedBookCount": 212,
    "validStartupPreviewCount": 212,
    "previewAssetsUpdated": [],
    "invalidOrMissing": []
  },
  "titleStartDefault": {
    "generatedBooksAudited": 212,
    "acceptedGeneratedBooksAudited": 117,
    "correctionsApplied": 12,
    "acceptedBooksCorrected": 12,
    "acceptanceRevokedPendingCorrection": 0
  },
  "metadataSegmentation": {
    "generatedBooksAudited": 212,
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

### the-time-machine

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 22 files
- Preview asset inspected: public/book-previews/the-time-machine.preview.json
- Generated title verdict: pass: generated title is The Time Machine
- Generated author verdict: pass: generated author is H. G. Wells
- Selected structural convention: 16 roman-numbered source sections plus the real Epilogue; contents and title/byline excluded
- Start boundary verdict: pass: first default is Chapter 1 and starts from real readable content
- End boundary verdict: pass: generated output ends at Epilogue with source/license/end-matter tails removed
- Sectioning verdict: pass: 17 sections preserve 16 roman-numbered source sections plus the real Epilogue; contents and title/byline excluded
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The Time Machine
- Author evidence: Author: H. G. Wells
- Raw start: I. Introduction The Time Traveller (for so it will be convenient to speak of him) was expounding a recondite matter to us. His pale grey eyes shone and twinkled, and his usually pale face was flushed and animated. The fire burnt brightly, and the soft radi
- Generated first section: I. Introduction The Time Traveller (for so it will be convenient to speak of him) was expounding a recondite matter to us. His pale grey eyes shone and twinkled, and his usually pale face was flushed and animated. The fire burnt brightly, and the soft radia...
- Generated first default: I. Introduction The Time Traveller (for so it will be convenient to speak of him) was expounding a recondite matter to us. His pale grey eyes shone and twinkled, and his usually pale face was flushed and animated. The fire burnt brightly, and the soft radia...
- Preview start: I. Introduction The Time Traveller (for so it will be convenient to speak of him) was expounding a recondite matter to us. His pale grey eyes shone and twinkled, and his usually pale face was flushed and animated. The fire burnt brightly, and the soft radia...
- Raw end: s by the memory of his story. And I have by me, for my comfort, two strange white flowers—shrivelled now, and brown and flat and brittle—to witness that even when mind and strength had gone, gratitude and a mutual tenderness still lived on in the heart of man.
- Generated end: know—for the question had been discussed among us long before the Time Machine was made—thought but cheerlessly of the Advancement of Mankind, and saw in the growing pile of civilisation only a foolish heaping that must inevitably fall back upon and destroy...

### kidnapped

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 35 files
- Preview asset inspected: public/book-previews/kidnapped.preview.json
- Generated title verdict: pass: generated title is Kidnapped
- Generated author verdict: pass: generated author is Robert Louis Stevenson
- Selected structural convention: chapter-based roman numerals with explicit CHAPTER heading safeguards
- Start boundary verdict: pass: first default is Chapter 1 - I Set Off Upon My Journey To The House Of Shaws and starts from real readable content
- End boundary verdict: pass: generated output ends at Chapter 30 - Good-Bye with source/license/end-matter tails removed
- Sectioning verdict: pass: 30 sections preserve chapter-based roman numerals with explicit CHAPTER heading safeguards
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Kidnapped
- Author evidence: Author: Robert Louis Stevenson
- Raw start: CHAPTER I I SET OFF UPON MY JOURNEY TO THE HOUSE OF SHAWS I will begin the story of my adventures with a certain morning early in the month of June, the year of grace 1751, when I took the key for the last time out of the door of my father s house. The sun
- Generated first section: CHAPTER I I SET OFF UPON MY JOURNEY TO THE HOUSE OF SHAWS I will begin the story of my adventures with a certain morning early in the month of June, the year of grace 1751, when I took the key for the last time out of the door of my father’s house. The sun...
- Generated first default: CHAPTER I I SET OFF UPON MY JOURNEY TO THE HOUSE OF SHAWS I will begin the story of my adventures with a certain morning early in the month of June, the year of grace 1751, when I took the key for the last time out of the door of my father’s house. The sun...
- Preview start: CHAPTER I I SET OFF UPON MY JOURNEY TO THE HOUSE OF SHAWS I will begin the story of my adventures with a certain morning early in the month of June, the year of grace 1751, when I took the key for the last time out of the door of my father’s house. The sun...
- Raw end: u would think I would not choose but be delighted with these braws and novelties) there was a cold gnawing in my inside like a remorse for something wrong. The hand of Providence brought me in my drifting to the very doors of the British Linen Company’s bank.
- Generated end: teen storeys, the narrow arched entries that continually vomited passengers, the wares of the merchants in their windows, the hubbub and endless stir, the foul smells and the fine clothes, and a hundred other particulars too small to mention, struck me into...

### oliver-twist

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 58 files
- Preview asset inspected: public/book-previews/oliver-twist.preview.json
- Generated title verdict: pass: generated title is Oliver Twist
- Generated author verdict: pass: generated author is Charles Dickens
- Selected structural convention: chapter-based roman numerals with explicit CHAPTER heading safeguards
- Start boundary verdict: pass: first default is Chapter 1 - Treats Of The Place Where Oliver Twist Was Born And Of The and starts from real readable content
- End boundary verdict: pass: generated output ends at Chapter 53 - And Last with source/license/end-matter tails removed
- Sectioning verdict: pass: 53 sections preserve chapter-based roman numerals with explicit CHAPTER heading safeguards
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Oliver Twist
- Author evidence: Author: Charles Dickens
- Raw start: CHAPTER I. TREATS OF THE PLACE WHERE OLIVER TWIST WAS BORN AND OF THE CIRCUMSTANCES ATTENDING HIS BIRTH Among other public buildings in a certain town, which for many reasons it will be prudent to refrain from mentioning, and to which I will assign no ficti
- Generated first section: CHAPTER I. TREATS OF THE PLACE WHERE OLIVER TWIST WAS BORN AND OF THE CIRCUMSTANCES ATTENDING HIS BIRTH Among other public buildings in a certain town, which for many reasons it will be prudent to refrain from mentioning, and to which I will assign no ficti...
- Generated first default: CHAPTER I. TREATS OF THE PLACE WHERE OLIVER TWIST WAS BORN AND OF THE CIRCUMSTANCES ATTENDING HIS BIRTH Among other public buildings in a certain town, which for many reasons it will be prudent to refrain from mentioning, and to which I will assign no ficti...
- Preview start: CHAPTER I. TREATS OF THE PLACE WHERE OLIVER TWIST WAS BORN AND OF THE CIRCUMSTANCES ATTENDING HIS BIRTH Among other public buildings in a certain town, which for many reasons it will be prudent to refrain from mentioning, and to which I will assign no ficti...
- Raw end: to visit spots hallowed by the love—the love beyond the grave—of those whom they knew in life, I believe that the shade of Agnes sometimes hovers round that solemn nook. I believe it none the less because that nook is in a Church, and she was weak and erring.
- Generated end: eart, and gratitude to that Being whose code is Mercy, and whose great attribute is Benevolence to all things that breathe, happiness can never be attained. Within the altar of the old village church there stands a white marble tablet, which bears as yet bu...

### the-benson-murder-case

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 30 files
- Preview asset inspected: public/book-previews/the-benson-murder-case.preview.json
- Generated title verdict: pass: generated title is The Benson Murder Case
- Generated author verdict: pass: generated author is S. S. Van Dine
- Selected structural convention: chapter-based roman numerals with explicit CHAPTER heading safeguards
- Start boundary verdict: pass: first default is Chapter 1 and starts from real readable content
- End boundary verdict: pass: generated output ends at Chapter 25 with source/license/end-matter tails removed
- Sectioning verdict: pass: 25 sections preserve chapter-based roman numerals with explicit CHAPTER heading safeguards
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The Benson murder case
- Author evidence: Author: S. S. Van Dine
- Raw start: CHAPTER I. Philo Vance at Home (Friday, June 14; 8.30 a.m.) It happened that, on the morning of the momentous June the fourteenth when the discovery of the murdered body of Alvin H. Benson created a sensation which, to this day, has not entirely died away
- Generated first section: CHAPTER I. Philo Vance at Home (Friday, June 14; 8.30 a.m.) It happened that, on the morning of the momentous June the fourteenth when the discovery of the murdered body of Alvin H. Benson created a sensation which, to this day, has not entirely died away,...
- Generated first default: CHAPTER I. Philo Vance at Home (Friday, June 14; 8.30 a.m.) It happened that, on the morning of the momentous June the fourteenth when the discovery of the murdered body of Alvin H. Benson created a sensation which, to this day, has not entirely died away,...
- Preview start: CHAPTER I. Philo Vance at Home (Friday, June 14; 8.30 a.m.) It happened that, on the morning of the momentous June the fourteenth when the discovery of the murdered body of Alvin H. Benson created a sensation which, to this day, has not entirely died away,...
- Raw end: don’t y’ know,” Vance rejoined. “I rather fancy, though, that it’s when your legal evidence is leading you irresistibly to your victim that you’ll need me most, what?” And the remark, though intended merely as a good-natured sally, proved strangely prophetic.
- Generated end: Vance. “You illuminati of the law would have little to do if you went about your business intelligently.” “Theoretically,” replied Markham at length, “your theories are clear enough; but I’m afraid I’ve dealt too long with material facts to forsake them for...

### the-inspector-french-s-greatest-case

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 25 files
- Preview asset inspected: public/book-previews/the-inspector-french-s-greatest-case.preview.json
- Generated title verdict: pass: generated title is The Inspector French's Greatest Case
- Generated author verdict: pass: generated author is Freeman Wills Crofts
- Selected structural convention: chapter-based roman numerals
- Start boundary verdict: pass: first default is Chapter 1 and starts from real readable content
- End boundary verdict: pass: generated output ends at Chapter 20 with source/license/end-matter tails removed
- Sectioning verdict: pass: 20 sections preserve chapter-based roman numerals
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Inspector French's greatest case
- Author evidence: Author: Freeman Wills Crofts
- Raw start: CHAPTER I MURDER! THE back streets surrounding Hatton Garden, in the City of London, do not form at the best of times a cheerful or inspiring prospect. Narrow and mean, and flanked with ugly, sor
- Generated first section: CHAPTER I MURDER! THE back streets surrounding Hatton Garden, in the City of London, do not form at the best of times a cheerful or inspiring prospect. Narrow and mean, and flanked with ugly, sordid-looking buildings grimy from exposure to the smoke and fog...
- Generated first default: CHAPTER I MURDER! THE back streets surrounding Hatton Garden, in the City of London, do not form at the best of times a cheerful or inspiring prospect. Narrow and mean, and flanked with ugly, sordid-looking buildings grimy from exposure to the smoke and fog...
- Preview start: CHAPTER I MURDER! THE back streets surrounding Hatton Garden, in the City of London, do not form at the best of times a cheerful or inspiring prospect. Narrow and mean, and flanked with ugly, sordid-looking buildings grimy from exposure to the smoke and fog...
- Raw end: e of the wedding with Charles Harrington, and to seek happiness with him on his brother’s ranch in Southern California. The firm of Duke & Peabody weathered the storm, and the surviving partners did not forget the Gething sisters when balancing their accounts.
- Generated end: poor girl’s mind was nearly unhinged thinking of what she should do in the event of the police making an arrest, but fortunately for her she was not called upon to make the decision. It remains merely to say that some weeks later Reginald Ainsley Duke paid...

### murder-in-the-maze

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 23 files
- Preview asset inspected: public/book-previews/murder-in-the-maze.preview.json
- Generated title verdict: pass: generated title is Murder in the Maze
- Generated author verdict: pass: generated author is J. J. Connington
- Selected structural convention: chapter-based roman numerals with explicit CHAPTER heading safeguards
- Start boundary verdict: pass: first default is Chapter 1 and starts from real readable content
- End boundary verdict: pass: generated output ends at Chapter 18 with source/license/end-matter tails removed
- Sectioning verdict: pass: 18 sections preserve chapter-based roman numerals with explicit CHAPTER heading safeguards
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Murder in the maze
- Author evidence: Author: J. J. Connington
- Raw start: CHAPTER I. The Hackleton Case Neville Shandon stood at the window of his brother s study gazing contentedly out over the Whistlefield grounds. This was a good place to recuperate in, he reflected, especially when one could only snatch a couple of days at a t
- Generated first section: CHAPTER I. The Hackleton Case Neville Shandon stood at the window of his brother’s study gazing contentedly out over the Whistlefield grounds. This was a good place to recuperate in, he reflected, especially when one could only snatch a couple of days at a...
- Generated first default: CHAPTER I. The Hackleton Case Neville Shandon stood at the window of his brother’s study gazing contentedly out over the Whistlefield grounds. This was a good place to recuperate in, he reflected, especially when one could only snatch a couple of days at a...
- Preview start: CHAPTER I. The Hackleton Case Neville Shandon stood at the window of his brother’s study gazing contentedly out over the Whistlefield grounds. This was a good place to recuperate in, he reflected, especially when one could only snatch a couple of days at a...
- Raw end: ck yourself; and I didn’t feel inclined to interfere with you. I thought it fairly clear that if you had gone on the murder tack you’d have avoided a stuff which could be traced to you directly. So I asked about any other local source, and you put me on to the
- Generated end: m, so I dropped the suggestion in presence of some of the possible criminals.” “H’m! Now I begin to see some light,” Wendover commented. “The next point was the nature of the poison,” Sir Clinton went on. “The local doctor suggested you, Ardsley, as an expe...

### the-house-of-arden-a-story-for-children

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 19 files
- Preview asset inspected: public/book-previews/the-house-of-arden-a-story-for-children.preview.json
- Generated title verdict: pass: generated title is The House of Arden: A Story for Children
- Generated author verdict: pass: generated author is E. Nesbit
- Selected structural convention: 14 body chapter headings after title, dedication, contents, and illustration list
- Start boundary verdict: pass: first default is Chapter 1 - Arden's Lord and starts from real readable content
- End boundary verdict: pass: generated output ends at Chapter 14 - The Finding of the Treasure with source/license/end-matter tails removed
- Sectioning verdict: pass: 14 sections preserve 14 body chapter headings after title, dedication, contents, and illustration list
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The House of Arden: A Story for Children
- Author evidence: Author: E. Nesbit
- Raw start: CHAPTER I ARDEN'S LORD It had been a great house once, with farms and fields, money and jewels--with tenants and squires and men-at-arms. The head of the house had ridden out three days' journey to
- Generated first section: CHAPTER I ARDEN'S LORD It had been a great house once, with farms and fields, money and jewels--with tenants and squires and men-at-arms. The head of the house had ridden out three days' journey to meet King Henry at the boundary of his estate, and the King...
- Generated first default: CHAPTER I ARDEN'S LORD It had been a great house once, with farms and fields, money and jewels--with tenants and squires and men-at-arms. The head of the house had ridden out three days' journey to meet King Henry at the boundary of his estate, and the King...
- Preview start: CHAPTER I ARDEN'S LORD It had been a great house once, with farms and fields, money and jewels--with tenants and squires and men-at-arms. The head of the house had ridden out three days' journey to meet King Henry at the boundary of his estate, and the King...
- Raw end: love and longing caught at her, and she knew that, Mouldiwarp or no Mouldiwarp, the treasure was hers, and in one flash she was across the room and in her father's arms, sobbing and laughing and saying again and again-- "Oh, my daddy! Oh, my daddy, my daddy!"
- Generated end: eorge. His dear face was just the same and the smile on it was her own smile--the merry, tender, twinkling smile that was for her and for no one else in the world. It was just a moment that she stood at the door. But it was one of these moments that are as...

### the-shadow-over-innsmouth

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 10 files
- Preview asset inspected: public/book-previews/the-shadow-over-innsmouth.preview.json
- Generated title verdict: pass: generated title is The Shadow over Innsmouth
- Generated author verdict: pass: generated author is H. P. Lovecraft
- Selected structural convention: five source story sections: first prose section plus II-V roman headings
- Start boundary verdict: pass: first default is Section 1 and starts from real readable content
- End boundary verdict: pass: generated output ends at Section 5 with source/license/end-matter tails removed
- Sectioning verdict: pass: 5 sections preserve five source story sections: first prose section plus II-V roman headings
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The shadow over Innsmouth
- Author evidence: Author: H. P. Lovecraft
- Raw start: During the winter of 1927-28 Federal government officials made a strange and secret investigation of certain conditions in the ancient Massachusetts seaport of Innsmouth. The public first learned of it in February, when a vast series of raids and arrests occur
- Generated first section: During the winter of 1927-28 Federal government officials made a strange and secret investigation of certain conditions in the ancient Massachusetts seaport of Innsmouth. The public first learned of it in February, when a vast series of raids and arrests oc...
- Generated first default: During the winter of 1927-28 Federal government officials made a strange and secret investigation of certain conditions in the ancient Massachusetts seaport of Innsmouth. The public first learned of it in February, when a vast series of raids and arrests oc...
- Preview start: During the winter of 1927-28 Federal government officials made a strange and secret investigation of certain conditions in the ancient Massachusetts seaport of Innsmouth. The public first learned of it in February, when a vast series of raids and arrests oc...
- Raw end: ether we shall go to marvel-shadowed Innsmouth. We shall swim out to that brooding reef in the sea and dive down through black abysses to cyclopean and many-columned Y'ha-nthlei, and in that lair of the Deep Ones we shall dwell amidst wonder and glory forever.
- Generated end: instead of terror. I do not believe I need to wait for the full change as most have waited. If I did, my father would probably shut me up in a sanitarium as my poor little cousin is shut up. Stupendous and unheard-of splendors await me below, and I shall se...

### the-thing-on-the-door-step

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 12 files
- Preview asset inspected: public/book-previews/the-thing-on-the-door-step.preview.json
- Generated title verdict: pass: generated title is The Thing on the Door-Step
- Generated author verdict: pass: generated author is H. P. Lovecraft
- Selected structural convention: seven source story sections: first prose section plus 2-7 arabic headings
- Start boundary verdict: pass: first default is Section 1 and starts from real readable content
- End boundary verdict: pass: generated output ends at Section 7 with source/license/end-matter tails removed
- Sectioning verdict: pass: 7 sections preserve seven source story sections: first prose section plus 2-7 arabic headings
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The thing on the door-step
- Author evidence: Author: H. P. Lovecraft
- Raw start: It is true that I have sent six bullets through the head of my best friend, and yet I hope to show by this statement that I am not his murderer. At first I shall be called a madman--madder than the man I shot in his cell at the Arkham Sanitarium. Later some of
- Generated first section: It is true that I have sent six bullets through the head of my best friend, and yet I hope to show by this statement that I am not his murderer. At first I shall be called a madman--madder than the man I shot in his cell at the Arkham Sanitarium. Later some...
- Generated first default: It is true that I have sent six bullets through the head of my best friend, and yet I hope to show by this statement that I am not his murderer. At first I shall be called a madman--madder than the man I shot in his cell at the Arkham Sanitarium. Later some...
- Preview start: It is true that I have sent six bullets through the head of my best friend, and yet I hope to show by this statement that I am not his murderer. At first I shall be called a madman--madder than the man I shot in his cell at the Arkham Sanitarium. Later some...
- Raw end: in the night. The men put handkerchiefs to their noses. What they finally found inside Edward's oddly-assorted clothes was mostly liquescent horror. There were bones, too--and a crushed-in skull. Some dental work positively identified the skull as Asenath's.
- Generated end: had fainted at the end of the third paragraph. I fainted again when I saw and smelled what cluttered up the threshold where the warm air had struck it. The messenger would not move or have consciousness any more. The butler, tougher-fibered than I, did not...

### at-the-mountains-of-madness

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 17 files
- Preview asset inspected: public/book-previews/at-the-mountains-of-madness.preview.json
- Generated title verdict: pass: generated title is At the Mountains of Madness
- Generated author verdict: pass: generated author is H. P. Lovecraft
- Selected structural convention: 12 source story sections: first prose section plus II-XII roman headings
- Start boundary verdict: pass: first default is Section 1 and starts from real readable content
- End boundary verdict: pass: generated output ends at Section 12 with source/license/end-matter tails removed
- Sectioning verdict: pass: 12 sections preserve 12 source story sections: first prose section plus II-XII roman headings
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: At the mountains of madness
- Author evidence: Author: H. P. Lovecraft
- Raw start: I am forced into speech because men of science have refused to follow my advice without knowing why. It is altogether against my will that I tell my reasons for opposing this contemplated invasion of the antarctic--with its vast fossil hunt and its wholesale b
- Generated first section: I am forced into speech because men of science have refused to follow my advice without knowing why. It is altogether against my will that I tell my reasons for opposing this contemplated invasion of the antarctic--with its vast fossil hunt and its wholesal...
- Generated first default: I am forced into speech because men of science have refused to follow my advice without knowing why. It is altogether against my will that I tell my reasons for opposing this contemplated invasion of the antarctic--with its vast fossil hunt and its wholesal...
- Preview start: I am forced into speech because men of science have refused to follow my advice without knowing why. It is altogether against my will that I tell my reasons for opposing this contemplated invasion of the antarctic--with its vast fossil hunt and its wholesal...
- Raw end: after his memory had had a chance to draw on his bygone reading. He could never have seen so much in one instantaneous glance. At the time, his shrieks were confined to the repetition of a single, mad word of all too obvious source: "_Tekeli-li! Tekeli-li!_"
- Generated end: e higher sky, as we crossed the range, was surely vaporous and disturbed enough; and although I did not see the zenith I can well imagine that its swirls of ice dust may have taken strange forms. Imagination, knowing how vividly distant scenes can sometimes...

### the-remarkable-case-of-davidson-s-eyes

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 10 files
- Preview asset inspected: public/book-previews/the-remarkable-case-of-davidson-s-eyes.preview.json
- Generated title verdict: pass: generated title is The Remarkable Case of Davidson's Eyes
- Generated author verdict: pass: generated author is H. G. Wells
- Selected structural convention: five source story sections: first prose section plus II-V roman headings
- Start boundary verdict: pass: first default is Section 1 and starts from real readable content
- End boundary verdict: pass: generated output ends at Section 5 with source/license/end-matter tails removed
- Sectioning verdict: pass: 5 sections preserve five source story sections: first prose section plus II-V roman headings
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The Stolen Bacillus and Other Incidents
- Author evidence: Author: H. G. Wells
- Raw start: The transitory mental aberration of Sidney Davidson, remarkable enough in itself, is still more remarkable if Wade's explanation is to be credited. It sets one dreaming of the oddest possibilities of intercommunication in the future, of spending an intercalary
- Generated first section: The transitory mental aberration of Sidney Davidson, remarkable enough in itself, is still more remarkable if Wade's explanation is to be credited. It sets one dreaming of the oddest possibilities of intercommunication in the future, of spending an intercal...
- Generated first default: The transitory mental aberration of Sidney Davidson, remarkable enough in itself, is still more remarkable if Wade's explanation is to be credited. It sets one dreaming of the oddest possibilities of intercommunication in the future, of spending an intercal...
- Preview start: The transitory mental aberration of Sidney Davidson, remarkable enough in itself, is still more remarkable if Wade's explanation is to be credited. It sets one dreaming of the oddest possibilities of intercommunication in the future, of spending an intercal...
- Raw end: tion that I have had little opportunity of calling to see him. But the whole of his theory seems fantastic to me. The facts concerning Davidson stand on an altogether different footing, and I can testify personally to the accuracy of every detail I have given.
- Generated end: ng. He thinks, as a consequence of this, that it may be possible to live visually in one part of the world, while one lives bodily in another. He has even made some experiments in support of his views; but, so far, he has simply succeeded in blinding a few...

### the-haunter-of-the-dark

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-haunter-of-the-dark.preview.json
- Generated title verdict: pass: generated title is The Haunter of the Dark
- Generated author verdict: pass: generated author is H. P. Lovecraft
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Haunter of the Dark and starts from real readable content
- End boundary verdict: pass: generated output ends at The Haunter of the Dark with source/license/end-matter tails removed
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

- Title evidence: Title: The haunter of the dark
- Author evidence: Author: H. P. Lovecraft
- Raw start: I have seen the dark universe yawning Where the black planets roll without aim-- Where they roll in their horror unheeded, Without knowledge or luster or name. --_Nemesis._ Cautious investigators will hesitate
- Generated first section: I have seen the dark universe yawning Where the black planets roll without aim-- Where they roll in their horror unheeded, Without knowledge or luster or name. --_Nemesis._ Cautious investigators will hesitate to challenge the common belief that Robert Blak...
- Generated first default: I have seen the dark universe yawning Where the black planets roll without aim-- Where they roll in their horror unheeded, Without knowledge or luster or name. --_Nemesis._ Cautious investigators will hesitate to challenge the common belief that Robert Blak...
- Preview start: I have seen the dark universe yawning Where the black planets roll without aim-- Where they roll in their horror unheeded, Without knowledge or luster or name. --_Nemesis._ Cautious investigators will hesitate to challenge the common belief that Robert Blak...
- Raw end: the dark. There is a monstrous odor ... senses transfigured ... boarding at that tower window cracking and giving way.... Iä ... ngai ... ygg.... "I see it--coming here--hell-wind--titan blur--black wings--Yog-Sothoth save me--the three-lobed burning eye...."
- Generated end: . those people on the hill ... guard ... candles and charms ... their priests.... "Sense of distance gone--far is near and near is far. No light--no glass--see that steeple--that tower--window--can hear--Roderick Usher--am mad or going mad--the thing is sti...

### the-innocence-of-father-brown

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 17 files
- Preview asset inspected: public/book-previews/the-innocence-of-father-brown.preview.json
- Generated title verdict: pass: generated title is The Innocence of Father Brown
- Generated author verdict: pass: generated author is G. K. Chesterton
- Selected structural convention: 12 Father Brown story headings from the body text, beginning with The Blue Cross
- Start boundary verdict: pass: first default is The Blue Cross and starts from real readable content
- End boundary verdict: pass: generated output ends at The Three Tools of Death with source/license/end-matter tails removed
- Sectioning verdict: pass: 12 sections preserve 12 Father Brown story headings from the body text, beginning with The Blue Cross
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The innocence of Father Brown
- Author evidence: Author: G. K. Chesterton
- Raw start: The Blue Cross Between the silver ribbon of morning and the green glittering ribbon of sea, the boat touched Harwich and let loose a swarm of folk like flies, among whom the man we must follow was by no means conspicuous--nor wished to be. There was nothing n
- Generated first section: The Blue Cross Between the silver ribbon of morning and the green glittering ribbon of sea, the boat touched Harwich and let loose a swarm of folk like flies, among whom the man we must follow was by no means conspicuous--nor wished to be. There was nothing...
- Generated first default: The Blue Cross Between the silver ribbon of morning and the green glittering ribbon of sea, the boat touched Harwich and let loose a swarm of folk like flies, among whom the man we must follow was by no means conspicuous--nor wished to be. There was nothing...
- Preview start: The Blue Cross Between the silver ribbon of morning and the green glittering ribbon of sea, the boat touched Harwich and let loose a swarm of folk like flies, among whom the man we must follow was by no means conspicuous--nor wished to be. There was nothing...
- Raw end: ” As he went out on to the gusty grass an acquaintance from Highgate stopped him and said: “The Coroner has arrived. The inquiry is just going to begin.” “I’ve got to get back to the Deaf School,” said Father Brown. “I’m sorry I can’t stop for the inquiry.”
- Generated end: ?” “Mustn’t know what?” asked Merton. “Why, that she killed her father, you fool!” roared the other. “He’d have been alive now but for her. It might craze her to know that.” “No, I don’t think it would,” remarked Father Brown, as he picked up his hat. “I ra...

### astounding-stories-of-super-science

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 11 files
- Preview asset inspected: public/book-previews/astounding-stories-of-super-science.preview.json
- Generated title verdict: pass: generated title is Astounding Stories of Super-Science, October, 1930
- Generated author verdict: pass: generated author is Various
- Selected structural convention: six issue-level story/article headings from the body text; cover matter, TOC, ads, illustrations, and sidenotes excluded
- Start boundary verdict: pass: first default is Stolen Brains and starts from real readable content
- End boundary verdict: pass: generated output ends at The Reader's Corner with source/license/end-matter tails removed
- Sectioning verdict: pass: 6 sections preserve six issue-level story/article headings from the body text; cover matter, TOC, ads, illustrations, and sidenotes excluded
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Astounding Stories of Super-Science, October, 1930
- Author evidence: Author: Various
- Raw start: Stolen Brains _By Captain S. P. Meek_ [Illustration: _Two long arms shot silently down and grasped the motionless figure._] [Sidenote: Dr. Bird, scientific sleuth extraordinary, goes after a sinister stealer of brains.] "I hope, Carnes," said Dr. Bird, "t
- Generated first section: Stolen Brains "I hope, Carnes," said Dr. Bird, "that we get good fishing." "Good fishing? Will you please tell me what you are talking about?" "I am talking about fishing, old dear. Have you seen the evening paper?" "No. What's that got to do with it?" Dr....
- Generated first default: Stolen Brains "I hope, Carnes," said Dr. Bird, "that we get good fishing." "Good fishing? Will you please tell me what you are talking about?" "I am talking about fishing, old dear. Have you seen the evening paper?" "No. What's that got to do with it?" Dr....
- Preview start: Stolen Brains "I hope, Carnes," said Dr. Bird, "that we get good fishing." "Good fishing? Will you please tell me what you are talking about?" "I am talking about fishing, old dear. Have you seen the evening paper?" "No. What's that got to do with it?" Dr....
- Raw end: o, this is a department primarily for _Readers_, and we want you to make full use of it. Likes, dislikes, criticisms, explanations, roses, brickbats, suggestions--everything's welcome here: so "come over in 'The Readers' Corner'" and discuss it with all of us!
- Generated end: e Fiction.--Robert Baldwin, 1427 Judson Ave., Evanston, Illinois. _"The Readers' Corner"_ All Readers are extended a sincere and cordial invitation to "come over to 'The Readers' Corner'" and join in our monthly discussion of stories, authors, scientific pr...

### a-story-of-the-stone-age

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 10 files
- Preview asset inspected: public/book-previews/a-story-of-the-stone-age.preview.json
- Generated title verdict: pass: generated title is A Story of the Stone Age
- Generated author verdict: pass: generated author is Herbert George Wells
- Selected structural convention: five source roman story sections from the individual Wells story
- Start boundary verdict: pass: first default is Section 1 - Ugh-Lomi and Uya and starts from real readable content
- End boundary verdict: pass: generated output ends at Section 5 - The Fight in the Lion's Thicket with source/license/end-matter tails removed
- Sectioning verdict: pass: 5 sections preserve five source roman story sections from the individual Wells story
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Tales of Space and Time
- Author evidence: Author: Herbert George Wells
- Raw start: I—UGH-LOMI AND UYA This story is of a time beyond the memory of man, before the beginning of history, a time when one might have walked dryshod from France (as we call it now) to England, and when a broad and sluggish Thames flowed through its marshes to meet
- Generated first section: I—UGH-LOMI AND UYA This story is of a time beyond the memory of man, before the beginning of history, a time when one might have walked dryshod from France (as we call it now) to England, and when a broad and sluggish Thames flowed through its marshes to me...
- Generated first default: I—UGH-LOMI AND UYA This story is of a time beyond the memory of man, before the beginning of history, a time when one might have walked dryshod from France (as we call it now) to England, and when a broad and sluggish Thames flowed through its marshes to me...
- Preview start: I—UGH-LOMI AND UYA This story is of a time beyond the memory of man, before the beginning of history, a time when one might have walked dryshod from France (as we call it now) to England, and when a broad and sluggish Thames flowed through its marshes to me...
- Raw end: ese three to come to the squatting-place in peace, with the food they had with them. Ugh-lomi ate the trout. Thereafter for many moons Ugh-lomi was master and had his will in peace. And on the fulness of time he was killed and eaten even as Uya had been slain.
- Generated end: d squatted nearer, and Wau-Hau had two rabbits to hold up, and the red-haired man a wood-pigeon, and Ugh-lomi stood before the women and mocked them. The next day they sat again nearer—without stones or sticks, and with the same offerings, and Cat's-skin ha...

### the-magic-shop

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-magic-shop.preview.json
- Generated title verdict: pass: generated title is The Magic Shop
- Generated author verdict: pass: generated author is H. G. Wells
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Magic Shop and starts from real readable content
- End boundary verdict: pass: generated output ends at The Magic Shop with source/license/end-matter tails removed
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

- Title evidence: Title: Twelve Stories and a Dream
- Author evidence: Author: H. G. Wells
- Raw start: I had seen the Magic Shop from afar several times; I had passed it once or twice, a shop window of alluring little objects, magic balls, magic hens, wonderful cones, ventriloquist dolls, the material of the basket trick, packs of cards that LOOKED all right, a
- Generated first section: I had seen the Magic Shop from afar several times; I had passed it once or twice, a shop window of alluring little objects, magic balls, magic hens, wonderful cones, ventriloquist dolls, the material of the basket trick, packs of cards that LOOKED all right...
- Generated first default: I had seen the Magic Shop from afar several times; I had passed it once or twice, a shop window of alluring little objects, magic balls, magic hens, wonderful cones, ventriloquist dolls, the material of the basket trick, packs of cards that LOOKED all right...
- Preview start: I had seen the Magic Shop from afar several times; I had passed it once or twice, a shop window of alluring little objects, magic balls, magic hens, wonderful cones, ventriloquist dolls, the material of the basket trick, packs of cards that LOOKED all right...
- Raw end: s, looking for that shop. I am inclined to think, indeed, that in that matter honour is satisfied, and that, since Gip's name and address are known to them, I may very well leave it to these people, whoever they may be, to send in their bill in their own time.
- Generated end: houldn't like them if they didn't do that.” I displayed no unbecoming surprise, and since then I have taken occasion to drop in upon him once or twice, unannounced, when the soldiers were about, but so far I have never discovered them performing in anything...

### the-man-who-could-work-miracles

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-man-who-could-work-miracles.preview.json
- Generated title verdict: pass: generated title is The Man Who Could Work Miracles
- Generated author verdict: pass: generated author is Herbert George Wells
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Man Who Could Work Miracles and starts from real readable content
- End boundary verdict: pass: generated output ends at The Man Who Could Work Miracles with source/license/end-matter tails removed
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

- Title evidence: Title: Tales of Space and Time
- Author evidence: Author: Herbert George Wells
- Raw start: It is doubtful whether the gift was innate. For my own part, I think it came to him suddenly. Indeed, until he was thirty he was a sceptic, and did not believe in miraculous powers. And here, since it is the most convenient place, I must mention that he was a
- Generated first section: It is doubtful whether the gift was innate. For my own part, I think it came to him suddenly. Indeed, until he was thirty he was a sceptic, and did not believe in miraculous powers. And here, since it is the most convenient place, I must mention that he was...
- Generated first default: It is doubtful whether the gift was innate. For my own part, I think it came to him suddenly. Indeed, until he was thirty he was a sceptic, and did not believe in miraculous powers. And here, since it is the most convenient place, I must mention that he was...
- Preview start: It is doubtful whether the gift was innate. For my own part, I think it came to him suddenly. Indeed, until he was thirty he was a sceptic, and did not believe in miraculous powers. And here, since it is the most convenient place, I must mention that he was...
- Raw end: o the hilt." "That's what you think," said Toddy Beamish, and "Prove it if you can." "Looky here, Mr. Beamish," said Mr. Fotheringay. "Let us clearly understand what a miracle is. It's something contrariwise to the course of nature done by power of Will...."
- Generated end: as it had been, his mind and memory therefore were now just as they had been at the time when this story began. So that he knew absolutely nothing of all that is told here, knows nothing of all that is told here to this day. And among other things, of cours...

### the-truth-about-pyecraft

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-truth-about-pyecraft.preview.json
- Generated title verdict: pass: generated title is The Truth About Pyecraft
- Generated author verdict: pass: generated author is H. G. Wells
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is The Truth About Pyecraft and starts from real readable content
- End boundary verdict: pass: generated output ends at The Truth About Pyecraft with source/license/end-matter tails removed
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

- Title evidence: Title: Twelve Stories and a Dream
- Author evidence: Author: H. G. Wells
- Raw start: He sits not a dozen yards away. If I glance over my shoulder I can see him. And if I catch his eye—and usually I catch his eye—it meets me with an expression. It is mainly an imploring look—and yet with suspicion in it. Confound his suspicion! If I wanted to
- Generated first section: He sits not a dozen yards away. If I glance over my shoulder I can see him. And if I catch his eye—and usually I catch his eye—it meets me with an expression. It is mainly an imploring look—and yet with suspicion in it. Confound his suspicion! If I wanted t...
- Generated first default: He sits not a dozen yards away. If I glance over my shoulder I can see him. And if I catch his eye—and usually I catch his eye—it meets me with an expression. It is mainly an imploring look—and yet with suspicion in it. Confound his suspicion! If I wanted t...
- Preview start: He sits not a dozen yards away. If I glance over my shoulder I can see him. And if I catch his eye—and usually I catch his eye—it meets me with an expression. It is mainly an imploring look—and yet with suspicion in it. Confound his suspicion! If I wanted t...
- Raw end: s keeping, eh? If any one knew of it—I should be so ashamed.... Makes a fellow look such a fool, you know. Crawling about on a ceiling and all that....” And now to elude Pyecraft, occupying, as he does, an admirable strategic position between me and the door.
- Generated end: oring mass of assimilatory matter, mere clouds in clothing, niente, nefas, the most inconsiderable of men. There he sits watching until I have done this writing. Then, if he can, he will waylay me. He will come billowing up to me.... He will tell me over ag...

### filmer

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/filmer.preview.json
- Generated title verdict: pass: generated title is Filmer
- Generated author verdict: pass: generated author is H. G. Wells
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is Filmer and starts from real readable content
- End boundary verdict: pass: generated output ends at Filmer with source/license/end-matter tails removed
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

- Title evidence: Title: Twelve Stories and a Dream
- Author evidence: Author: H. G. Wells
- Raw start: In truth the mastery of flying was the work of thousands of men—this man a suggestion and that an experiment, until at last only one vigorous intellectual effort was needed to finish the work. But the inexorable injustice of the popular mind has decided that o
- Generated first section: In truth the mastery of flying was the work of thousands of men—this man a suggestion and that an experiment, until at last only one vigorous intellectual effort was needed to finish the work. But the inexorable injustice of the popular mind has decided tha...
- Generated first default: In truth the mastery of flying was the work of thousands of men—this man a suggestion and that an experiment, until at last only one vigorous intellectual effort was needed to finish the work. But the inexorable injustice of the popular mind has decided tha...
- Preview start: In truth the mastery of flying was the work of thousands of men—this man a suggestion and that an experiment, until at last only one vigorous intellectual effort was needed to finish the work. But the inexorable injustice of the popular mind has decided tha...
- Raw end: ht sight of the ascent when pulling up the blind of his bedroom window—equipped, among other things, with a film camera that was subsequently discovered to be jammed. And Filmer was lying on the billiard table in the green pavilion with a sheet about his body.
- Generated end: trials.” And to that end, while all the world was reading of the certain failure of the new flying machine, MacAndrew was soaring and curvetting with great amplitude and dignity over the Epsom and Wimbledon divisions; and Banghurst, restored once more to ho...

### two-in-a-sack

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/two-in-a-sack.preview.json
- Generated title verdict: pass: generated title is Two in a Sack
- Generated author verdict: pass: generated author is Andrew Lang
- Selected structural convention: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary verdict: pass: first default is Two in a Sack and starts from real readable content
- End boundary verdict: pass: generated output ends at Two in a Sack with source/license/end-matter tails removed
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

- Title evidence: Title: The Violet Fairy Book
- Author evidence: Author: Andrew Lang
- Raw start: What a life that poor man led with his wife, to be sure! Not a day passed without her scolding him and calling him names, and indeed sometimes she would take the broom from behind the stove and beat him with it. He had no peace or comfort at all, and really ha
- Generated first section: What a life that poor man led with his wife, to be sure! Not a day passed without her scolding him and calling him names, and indeed sometimes she would take the broom from behind the stove and beat him with it. He had no peace or comfort at all, and really...
- Generated first default: What a life that poor man led with his wife, to be sure! Not a day passed without her scolding him and calling him names, and indeed sometimes she would take the broom from behind the stove and beat him with it. He had no peace or comfort at all, and really...
- Preview start: What a life that poor man led with his wife, to be sure! Not a day passed without her scolding him and calling him names, and indeed sometimes she would take the broom from behind the stove and beat him with it. He had no peace or comfort at all, and really...
- Raw end: er husband took pity on her, and cried: ‘Two into the sack.’ He had hardly said the words before they were back in the sack again. From this time the man and his wife lived so happily together that it was a pleasure to see them, and so the story has an end.
- Generated end: e fit to break my bones.’ Her husband only strolled up and down and laughed, as he said: ‘Yes, they’ll beat you well, old lady.’ And the two thumped away and sang again: ‘Blows will hurt, remember, crone, We mean you well, we mean you well; In future leave...

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
