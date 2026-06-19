# Pilot write batch 10

Controlled first-time processing pass for the exact raw-only books selected by pilot dry-run batch 10.

## Totals

- Selected: 20
- First-time processed: 20
- Skipped: 0
- Unresolved-source generated left untouched: 11

## Accepted Exclusion Count Clarification

- Dry-run accepted/corrected/verified exclusion count: 182
- Known duplicate/manual/boundary exclusions left unprocessed: the-wind-in-the-willows, the-two-magics-the-turn-of-the-screw-covering-end, the-works-of-edgar-allan-poe
- Selected books intersecting accepted exclusions: none
- Note: This write pass uses only the exact selected list from pilot-dry-run-10.json. Known duplicate/manual/boundary exclusions and unresolved-source generated books remain untouched.

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

### the-time-machine

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Time Machine.txt
- Expected/generated title: The Time Machine / The Time Machine
- Expected/generated author: H. G. Wells / H. G. Wells
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: 16 roman-numbered source sections plus the real Epilogue; contents and title/byline excluded
- Start boundary: cleaned line 29 - start at I. Introduction: The Time Traveller (for so it will be convenient; write pass starts at first selected/default section
- End boundary: cleaned line 3136 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Chapter 1 (1696 words)
- Section count: 17
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001, chapter-002
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Write pass preserved real sections XVI After the Story and Epilogue after raw inspection showed the dry-run count of 15 would drop readable ending content.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: contents or list material must not enter default playback; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: Chapter 1 (1696 words)
- chapter-002: Chapter 2 - The Machine (1356 words)
- chapter-003: Chapter 3 - The Time Traveller Returns (2036 words)
- chapter-004: Chapter 4 - Time Travelling (2108 words)
- chapter-005: Chapter 5 - In the Golden Age (1652 words)

Last 5 sections:

- chapter-013: Chapter 13 - The Trap of the White Sphinx (1079 words)
- chapter-014: Chapter 14 - The Further Vision (1917 words)
- chapter-015: Chapter 15 - The Time Traveller's Return (488 words)
- chapter-016: Chapter 16 - After the Story (1409 words)
- chapter-017: Epilogue (286 words)

Supporting snippets:

- Title: Title: The Time Machine
- Author: Author: H. G. Wells
- Start: I. Introduction The Time Traveller (for so it will be convenient to speak of him) was expounding a recondite matter to us. His pale grey eyes shone and twinkled, and his usually pale face was flushed and animated. The fire burnt brightly, and the soft radi
- End: s by the memory of his story. And I have by me, for my comfort, two strange white flowers—shrivelled now, and brown and flat and brittle—to witness that even when mind and strength had gone, gratitude and a mutual tenderness still lived on in the heart of man.

### kidnapped

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/Kidnapped.txt
- Expected/generated title: Kidnapped / Kidnapped
- Expected/generated author: Robert Louis Stevenson / Robert Louis Stevenson
- Author evidence: Gutenberg Author line - Author: Robert Louis Stevenson
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: chapter-based roman numerals with explicit CHAPTER heading safeguards
- Start boundary: cleaned line 222 - start at CHAPTER I: I SET OFF UPON MY JOURNEY TO THE HOUSE OF SHAWS: I will begin the story of my adventures; write pass starts at first selected/default section
- End boundary: cleaned line 8395 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Chapter 1 (1750 words)
- Section count: 30
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001, chapter-002
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Write pass used explicit CHAPTER roman-numeral source headings after raw inspection showed the generic detector dropped a real ending chapter.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: contents or list material must not enter default playback; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: Chapter 1 - I Set Off Upon My Journey To The House Of Shaws (1750 words)
- chapter-002: Chapter 2 (1954 words)
- chapter-003: Chapter 3 - I Make Acquaintance Of My Uncle (2726 words)
- chapter-004: Chapter 4 - I Run A Great Danger In The House Of Shaws (3013 words)
- chapter-005: Chapter 5 (2450 words)

Last 5 sections:

- chapter-026: Chapter 26 - End Of The Flight: We Pass The Forth (4035 words)
- chapter-027: Chapter 27 - I Come To Mr. Rankeillor (2853 words)
- chapter-028: Chapter 28 - I Go In Quest Of My Inheritance (2764 words)
- chapter-029: Chapter 29 - I Come Into My Kingdom (2430 words)
- chapter-030: Chapter 30 - Good-Bye (1404 words)

Supporting snippets:

- Title: Title: Kidnapped
- Author: Author: Robert Louis Stevenson
- Start: CHAPTER I I SET OFF UPON MY JOURNEY TO THE HOUSE OF SHAWS I will begin the story of my adventures with a certain morning early in the month of June, the year of grace 1751, when I took the key for the last time out of the door of my father s house. The sun
- End: u would think I would not choose but be delighted with these braws and novelties) there was a cold gnawing in my inside like a remorse for something wrong. The hand of Providence brought me in my drifting to the very doors of the British Linen Company’s bank.

### oliver-twist

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/Oliver Twist.txt
- Expected/generated title: Oliver Twist / Oliver Twist
- Expected/generated author: Charles Dickens / Charles Dickens
- Author evidence: Gutenberg Author line - Author: Charles Dickens
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: chapter-based roman numerals with explicit CHAPTER heading safeguards
- Start boundary: cleaned line 112 - start at CHAPTER I: TREATS OF THE PLACE WHERE OLIVER TWIST WAS BORN: Among other public buildings in a certain town; write pass starts at first selected/default section
- End boundary: cleaned line 18697 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Chapter 1 (1125 words)
- Section count: 53
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001, chapter-002
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Write pass used explicit CHAPTER roman-numeral source headings after raw inspection showed the generic detector dropped a real ending chapter.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: contents or list material must not enter default playback; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: Chapter 1 - Treats Of The Place Where Oliver Twist Was Born And Of The (1125 words)
- chapter-002: Chapter 2 (3962 words)
- chapter-003: Chapter 3 - Relates How Oliver Twist Was Very Near Getting A Place Which Would Not (3136 words)
- chapter-004: Chapter 4 - Oliver, Being Offered Another Place, Makes His First Entry Into Public (2604 words)
- chapter-005: Chapter 5 - Oliver Mingles With New Associates. Going To A Funeral For The First (4102 words)

Last 5 sections:

- chapter-049: Chapter 49 - Monks And Mr. Brownlow At Length Meet. Their Conversation, And The (3591 words)
- chapter-050: Chapter 50 - The Pursuit And Escape (4294 words)
- chapter-051: Chapter 51 - Affording An Explanation Of More Mysteries Than One, And Comprehending (4870 words)
- chapter-052: Chapter 52 (3332 words)
- chapter-053: Chapter 53 - And Last (1566 words)

Supporting snippets:

- Title: Title: Oliver Twist
- Author: Author: Charles Dickens
- Start: CHAPTER I. TREATS OF THE PLACE WHERE OLIVER TWIST WAS BORN AND OF THE CIRCUMSTANCES ATTENDING HIS BIRTH Among other public buildings in a certain town, which for many reasons it will be prudent to refrain from mentioning, and to which I will assign no ficti
- End: to visit spots hallowed by the love—the love beyond the grave—of those whom they knew in life, I believe that the shade of Agnes sometimes hovers round that solemn nook. I believe it none the less because that nook is in a Church, and she was weak and erring.

### the-benson-murder-case

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Benson Murder Case.txt
- Expected/generated title: The Benson Murder Case / The Benson Murder Case
- Expected/generated author: S. S. Van Dine / S. S. Van Dine
- Author evidence: Gutenberg Author line - Author: S. S. Van Dine
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: chapter-based roman numerals with explicit CHAPTER heading safeguards
- Start boundary: cleaned line 182 - start at CHAPTER I: Philo Vance at Home: It happened that, on the morning; write pass starts at first selected/default section
- End boundary: cleaned line 11117 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Chapter 1 (3627 words)
- Section count: 25
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Write pass used explicit CHAPTER roman-numeral source headings after raw inspection showed the generic detector dropped a real ending chapter.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: contents or list material must not enter default playback; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: illustration captions/placeholders detected; Write pass adjusted display-title capitalization from the Project Gutenberg Title line after confirming the same source identity.

First 5 sections:

- chapter-001: Chapter 1 (3627 words)
- chapter-002: Chapter 2 (4011 words)
- chapter-003: Chapter 3 (3339 words)
- chapter-004: Chapter 4 (3507 words)
- chapter-005: Chapter 5 (3011 words)

Last 5 sections:

- chapter-021: Chapter 21 (3216 words)
- chapter-022: Chapter 22 (4224 words)
- chapter-023: Chapter 23 (3826 words)
- chapter-024: Chapter 24 (3992 words)
- chapter-025: Chapter 25 (3294 words)

Supporting snippets:

- Title: Title: The Benson murder case
- Author: Author: S. S. Van Dine
- Start: CHAPTER I. Philo Vance at Home (Friday, June 14; 8.30 a.m.) It happened that, on the morning of the momentous June the fourteenth when the discovery of the murdered body of Alvin H. Benson created a sensation which, to this day, has not entirely died away
- End: don’t y’ know,” Vance rejoined. “I rather fancy, though, that it’s when your legal evidence is leading you irresistibly to your victim that you’ll need me most, what?” And the remark, though intended merely as a good-natured sally, proved strangely prophetic.

### the-inspector-french-s-greatest-case

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Inspector French’s Greatest Case.txt
- Expected/generated title: The Inspector French's Greatest Case / The Inspector French's Greatest Case
- Expected/generated author: Freeman Wills Crofts / Freeman Wills Crofts
- Author evidence: Gutenberg Author line - Author: Freeman Wills Crofts
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: chapter-based roman numerals
- Start boundary: cleaned line 56 - start at cleaned-body line 56: CHAPTER I; write pass starts at first selected/default section
- End boundary: cleaned line 9015 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Chapter 1 (4211 words)
- Section count: 20
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: contents or list material must not enter default playback; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: illustration captions/placeholders detected

First 5 sections:

- chapter-001: Chapter 1 (4211 words)
- chapter-002: Chapter 2 (3364 words)
- chapter-003: Chapter 3 (4643 words)
- chapter-004: Chapter 4 (4513 words)
- chapter-005: Chapter 5 (893 words)

Last 5 sections:

- chapter-016: Chapter 16 (4380 words)
- chapter-017: Chapter 17 (4196 words)
- chapter-018: Chapter 18 (4339 words)
- chapter-019: Chapter 19 (4640 words)
- chapter-020: Chapter 20 (2971 words)

Supporting snippets:

- Title: Title: Inspector French's greatest case
- Author: Author: Freeman Wills Crofts
- Start: CHAPTER I MURDER! THE back streets surrounding Hatton Garden, in the City of London, do not form at the best of times a cheerful or inspiring prospect. Narrow and mean, and flanked with ugly, sor
- End: e of the wedding with Charles Harrington, and to seek happiness with him on his brother’s ranch in Southern California. The firm of Duke & Peabody weathered the storm, and the surviving partners did not forget the Gething sisters when balancing their accounts.

### murder-in-the-maze

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/Murder in the Maze.txt
- Expected/generated title: Murder in the Maze / Murder in the Maze
- Expected/generated author: J. J. Connington / J. J. Connington
- Author evidence: Gutenberg Author line - Author: J. J. Connington
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: chapter-based roman numerals with explicit CHAPTER heading safeguards
- Start boundary: cleaned line 28 - start at CHAPTER I: The Hackleton Case: Neville Shandon stood at the window; write pass starts at first selected/default section
- End boundary: cleaned line 9363 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Chapter 1 (6086 words)
- Section count: 18
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass used explicit CHAPTER roman-numeral source headings after raw inspection showed the generic detector dropped a real ending chapter.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: contents or list material must not enter default playback; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets; Write pass adjusted display-title capitalization from the Project Gutenberg Title line after confirming the same source identity.

First 5 sections:

- chapter-001: Chapter 1 (6086 words)
- chapter-002: Chapter 2 (5302 words)
- chapter-003: Chapter 3 (3001 words)
- chapter-004: Chapter 4 (3532 words)
- chapter-005: Chapter 5 (5168 words)

Last 5 sections:

- chapter-014: Chapter 14 (2255 words)
- chapter-015: Chapter 15 (2789 words)
- chapter-016: Chapter 16 (4390 words)
- chapter-017: Chapter 17 (5017 words)
- chapter-018: Chapter 18 (3231 words)

Supporting snippets:

- Title: Title: Murder in the maze
- Author: Author: J. J. Connington
- Start: CHAPTER I. The Hackleton Case Neville Shandon stood at the window of his brother s study gazing contentedly out over the Whistlefield grounds. This was a good place to recuperate in, he reflected, especially when one could only snatch a couple of days at a t
- End: ck yourself; and I didn’t feel inclined to interfere with you. I thought it fairly clear that if you had gone on the murder tack you’d have avoided a stuff which could be traced to you directly. So I asked about any other local source, and you put me on to the

### the-house-of-arden-a-story-for-children

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The House of Arden - A Story for Children.txt
- Expected/generated title: The House of Arden: A Story for Children / The House of Arden: A Story for Children
- Expected/generated author: E. Nesbit / E. Nesbit
- Author evidence: Gutenberg Author line - Author: E. Nesbit
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: 14 body chapter headings after title, dedication, contents, and illustration list
- Start boundary: cleaned line 151 - start at CHAPTER I: ARDEN'S LORD: It had been a great house once; write pass starts at first selected/default section
- End boundary: cleaned line 8883 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Chapter 1 (7011 words)
- Section count: 14
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Write pass used the body CHAPTER I-XIV headings and ignored matching chapter labels from the front contents list.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: contents or list material must not enter default playback; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: illustration captions/placeholders detected

First 5 sections:

- chapter-001: Chapter 1 - Arden's Lord (7011 words)
- chapter-002: Chapter 2 - The Mouldiwarp (6588 words)
- chapter-003: Chapter 3 - In Boney's Times (4617 words)
- chapter-004: Chapter 4 - The Landing of the French (3399 words)
- chapter-005: Chapter 5 - The Highwayman and the ---- (5040 words)

Last 5 sections:

- chapter-010: Chapter 10 - White Wings and a Brownie (5141 words)
- chapter-011: Chapter 11 - Developments (6408 words)
- chapter-012: Chapter 12 - Films and Clouds (3977 words)
- chapter-013: Chapter 13 - May-Blossom and Pearls (3825 words)
- chapter-014: Chapter 14 - The Finding of the Treasure (5398 words)

Supporting snippets:

- Title: Title: The House of Arden: A Story for Children
- Author: Author: E. Nesbit
- Start: CHAPTER I ARDEN'S LORD It had been a great house once, with farms and fields, money and jewels--with tenants and squires and men-at-arms. The head of the house had ridden out three days' journey to
- End: love and longing caught at her, and she knew that, Mouldiwarp or no Mouldiwarp, the treasure was hers, and in one flash she was across the room and in her father's arms, sobbing and laughing and saying again and again-- "Oh, my daddy! Oh, my daddy, my daddy!"

### the-shadow-over-innsmouth

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The shadow over Innsmouth.txt
- Expected/generated title: The Shadow over Innsmouth / The Shadow over Innsmouth
- Expected/generated author: H. P. Lovecraft / H. P. Lovecraft
- Author evidence: Gutenberg Author line - Author: H. P. Lovecraft
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: five source story sections: first prose section plus II-V roman headings
- Start boundary: cleaned line 18 - start at I: During the winter of 1927-28 Federal government officials; write pass starts at first selected/default section
- End boundary: cleaned line 1707 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Section 1 (2555 words)
- Section count: 5
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Write pass starts section I at the first prose paragraph because the cleaned source has no standalone I marker, then preserves II-V.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: illustration captions/placeholders detected; Write pass adjusted display-title capitalization from the Project Gutenberg Title line after confirming the same source identity.

First 5 sections:

- chapter-001: Section 1 (2555 words)
- chapter-002: Section 2 (2463 words)
- chapter-003: Section 3 (4186 words)
- chapter-004: Section 4 (5484 words)
- chapter-005: Section 5 (2359 words)

Last 5 sections:

- chapter-001: Section 1 (2555 words)
- chapter-002: Section 2 (2463 words)
- chapter-003: Section 3 (4186 words)
- chapter-004: Section 4 (5484 words)
- chapter-005: Section 5 (2359 words)

Supporting snippets:

- Title: Title: The shadow over Innsmouth
- Author: Author: H. P. Lovecraft
- Start: During the winter of 1927-28 Federal government officials made a strange and secret investigation of certain conditions in the ancient Massachusetts seaport of Innsmouth. The public first learned of it in February, when a vast series of raids and arrests occur
- End: ether we shall go to marvel-shadowed Innsmouth. We shall swim out to that brooding reef in the sea and dive down through black abysses to cyclopean and many-columned Y'ha-nthlei, and in that lair of the Deep Ones we shall dwell amidst wonder and glory forever.

### the-thing-on-the-door-step

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The thing on the door-step.txt
- Expected/generated title: The Thing on the Door-Step / The Thing on the Door-Step
- Expected/generated author: H. P. Lovecraft / H. P. Lovecraft
- Author evidence: Gutenberg Author line - Author: H. P. Lovecraft
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: seven source story sections: first prose section plus 2-7 arabic headings
- Start boundary: cleaned line 16 - start at 1: It is true that I have sent six bullets; write pass starts at first selected/default section
- End boundary: cleaned line 1075 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Section 1 (1342 words)
- Section count: 7
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001, chapter-002
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Write pass starts section 1 at the first prose paragraph because the cleaned source has no standalone 1 marker, then preserves 2-7.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets; Write pass adjusted display-title capitalization from the Project Gutenberg Title line after confirming the same source identity.

First 5 sections:

- chapter-001: Section 1 (1342 words)
- chapter-002: Section 2 (1344 words)
- chapter-003: Section 3 (1229 words)
- chapter-004: Section 4 (2220 words)
- chapter-005: Section 5 (2174 words)

Last 5 sections:

- chapter-003: Section 3 (1229 words)
- chapter-004: Section 4 (2220 words)
- chapter-005: Section 5 (2174 words)
- chapter-006: Section 6 (768 words)
- chapter-007: Section 7 (1620 words)

Supporting snippets:

- Title: Title: The thing on the door-step
- Author: Author: H. P. Lovecraft
- Start: It is true that I have sent six bullets through the head of my best friend, and yet I hope to show by this statement that I am not his murderer. At first I shall be called a madman--madder than the man I shot in his cell at the Arkham Sanitarium. Later some of
- End: in the night. The men put handkerchiefs to their noses. What they finally found inside Edward's oddly-assorted clothes was mostly liquescent horror. There were bones, too--and a crushed-in skull. Some dental work positively identified the skull as Asenath's.

### at-the-mountains-of-madness

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/At the mountains of madness.txt
- Expected/generated title: At the Mountains of Madness / At the Mountains of Madness
- Expected/generated author: H. P. Lovecraft / H. P. Lovecraft
- Author evidence: Gutenberg Author line - Author: H. P. Lovecraft
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: 12 source story sections: first prose section plus II-XII roman headings
- Start boundary: cleaned line 11 - start at I.: I am forced into speech because men of science; write pass starts at first selected/default section
- End boundary: cleaned line 4609 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Section 1 (3484 words)
- Section count: 12
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Write pass starts section I at the first prose paragraph because the cleaned source has no standalone I marker, then preserves II-XII.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets; Write pass adjusted display-title capitalization from the Project Gutenberg Title line after confirming the same source identity.

First 5 sections:

- chapter-001: Section 1 (3484 words)
- chapter-002: Section 2 (5967 words)
- chapter-003: Section 3 (3700 words)
- chapter-004: Section 4 (2929 words)
- chapter-005: Section 5 (4389 words)

Last 5 sections:

- chapter-008: Section 8 (2888 words)
- chapter-009: Section 9 (3630 words)
- chapter-010: Section 10 (2485 words)
- chapter-011: Section 11 (3178 words)
- chapter-012: Section 12 (1476 words)

Supporting snippets:

- Title: Title: At the mountains of madness
- Author: Author: H. P. Lovecraft
- Start: I am forced into speech because men of science have refused to follow my advice without knowing why. It is altogether against my will that I tell my reasons for opposing this contemplated invasion of the antarctic--with its vast fossil hunt and its wholesale b
- End: after his memory had had a chance to draw on his bygone reading. He could never have seen so much in one instantaneous glance. At the time, his shrieks were confined to the repetition of a single, mad word of all too obvious source: "_Tekeli-li! Tekeli-li!_"

### the-remarkable-case-of-davidson-s-eyes

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE REMARKABLE CASE OF DAVIDSON'S EYES.txt
- Expected/generated title: The Remarkable Case of Davidson's Eyes / The Remarkable Case of Davidson's Eyes
- Expected/generated author: H. G. Wells / H. G. Wells
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: five source story sections: first prose section plus II-V roman headings
- Start boundary: cleaned line 32 - start at I.: What's the matter with you?; write pass starts at first selected/default section
- End boundary: cleaned line 435 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Section 1 (998 words)
- Section count: 5
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001, chapter-002, chapter-003
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass uses the individual story title and starts at first prose, excluding parent collection title, dedication, and acknowledgements.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: Section 1 (998 words)
- chapter-002: Section 2 (570 words)
- chapter-003: Section 3 (1089 words)
- chapter-004: Section 4 (548 words)
- chapter-005: Section 5 (631 words)

Last 5 sections:

- chapter-001: Section 1 (998 words)
- chapter-002: Section 2 (570 words)
- chapter-003: Section 3 (1089 words)
- chapter-004: Section 4 (548 words)
- chapter-005: Section 5 (631 words)

Supporting snippets:

- Title: Title: The Stolen Bacillus and Other Incidents
- Author: Author: H. G. Wells
- Start: The transitory mental aberration of Sidney Davidson, remarkable enough in itself, is still more remarkable if Wade's explanation is to be credited. It sets one dreaming of the oddest possibilities of intercommunication in the future, of spending an intercalary
- End: tion that I have had little opportunity of calling to see him. But the whole of his theory seems fantastic to me. The facts concerning Davidson stand on an altogether different footing, and I can testify personally to the accuracy of every detail I have given.

### the-haunter-of-the-dark

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The haunter of the dark.txt
- Expected/generated title: The Haunter of the Dark / The Haunter of the Dark
- Expected/generated author: H. P. Lovecraft / H. P. Lovecraft
- Author evidence: Gutenberg Author line - Author: H. P. Lovecraft
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 17 - start at cleaned-body line 1: The Haunter of the Dark; write pass starts at first selected/default section
- End boundary: cleaned line 960 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Haunter of the Dark (9223 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run title/default-start risk: first default section is meaningful but should be verified manually in write pass; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets; Write pass adjusted display-title capitalization from the Project Gutenberg Title line after confirming the same source identity.

First 5 sections:

- chapter-001: The Haunter of the Dark (9223 words)

Last 5 sections:

- chapter-001: The Haunter of the Dark (9223 words)

Supporting snippets:

- Title: Title: The haunter of the dark
- Author: Author: H. P. Lovecraft
- Start: I have seen the dark universe yawning Where the black planets roll without aim-- Where they roll in their horror unheeded, Without knowledge or luster or name. --_Nemesis._ Cautious investigators will hesitate
- End: the dark. There is a monstrous odor ... senses transfigured ... boarding at that tower window cracking and giving way.... Iä ... ngai ... ygg.... "I see it--coming here--hell-wind--titan blur--black wings--Yog-Sothoth save me--the three-lobed burning eye...."

### the-innocence-of-father-brown

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The innocence of Father Brown.txt
- Expected/generated title: The Innocence of Father Brown / The Innocence of Father Brown
- Expected/generated author: G. K. Chesterton / G. K. Chesterton
- Author evidence: Gutenberg Author line - Author: G. K. Chesterton
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: 12 Father Brown story headings from the body text, beginning with The Blue Cross
- Start boundary: cleaned line 22 - start at cleaned-body line 800: The Secret Garden; write pass starts at first selected/default section
- End boundary: cleaned line 8370 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Blue Cross (7555 words)
- Section count: 12
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Write pass corrected the dry-run start boundary: raw inspection showed The Blue Cross is the first story and must not be dropped.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: contents or list material must not enter default playback; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run title/default-start risk: first default section is meaningful but should be verified manually in write pass; dry-run collection-title risk: ensure the generated title stays the collection title and individual story titles become sections; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets; Write pass adjusted display-title capitalization from the Project Gutenberg Title line after confirming the same source identity.

First 5 sections:

- chapter-001: The Blue Cross (7555 words)
- chapter-002: The Secret Garden (7621 words)
- chapter-003: The Queer Feet (7655 words)
- chapter-004: The Flying Stars (5404 words)
- chapter-005: The Invisible Man (6555 words)

Last 5 sections:

- chapter-008: The Sins of Prince Saradine (7426 words)
- chapter-009: The Hammer of God (6449 words)
- chapter-010: The Eye of Apollo (6222 words)
- chapter-011: The Sign of the Broken Sword (6947 words)
- chapter-012: The Three Tools of Death (5113 words)

Supporting snippets:

- Title: Title: The innocence of Father Brown
- Author: Author: G. K. Chesterton
- Start: The Blue Cross Between the silver ribbon of morning and the green glittering ribbon of sea, the boat touched Harwich and let loose a swarm of folk like flies, among whom the man we must follow was by no means conspicuous--nor wished to be. There was nothing n
- End: ” As he went out on to the gusty grass an acquaintance from Highgate stopped him and said: “The Coroner has arrived. The inquiry is just going to begin.” “I’ve got to get back to the Deaf School,” said Father Brown. “I’m sorry I can’t stop for the inquiry.”

### astounding-stories-of-super-science

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/Astounding Stories of Super-Science.txt
- Expected/generated title: Astounding Stories of Super-Science, October, 1930 / Astounding Stories of Super-Science, October, 1930
- Expected/generated author: Various / Various
- Author evidence: Gutenberg Author line - Author: Various
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: six issue-level story/article headings from the body text; cover matter, TOC, ads, illustrations, and sidenotes excluded
- Start boundary: cleaned line 96 - start at cleaned-body line 1412: CHAPTER I; write pass starts at first selected/default section
- End boundary: cleaned line 10456 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Stolen Brains (10472 words)
- Section count: 6
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Write pass preserved issue-level story/article headings instead of starting inside only The Invisible Death's Chapter I.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: contents or list material must not enter default playback; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the collection title and individual story titles become sections; dry-run artifact risk: illustration captions/placeholders detected

First 5 sections:

- chapter-001: Stolen Brains (10472 words)
- chapter-002: The Invisible Death (30170 words)
- chapter-003: Prisoners on the Electron (11053 words)
- chapter-004: Jetta of the Lowlands (13593 words)
- chapter-005: An Extra Man (6851 words)

Last 5 sections:

- chapter-002: The Invisible Death (30170 words)
- chapter-003: Prisoners on the Electron (11053 words)
- chapter-004: Jetta of the Lowlands (13593 words)
- chapter-005: An Extra Man (6851 words)
- chapter-006: The Reader's Corner (5881 words)

Supporting snippets:

- Title: Title: Astounding Stories of Super-Science, October, 1930
- Author: Author: Various
- Start: Stolen Brains _By Captain S. P. Meek_ [Illustration: _Two long arms shot silently down and grasped the motionless figure._] [Sidenote: Dr. Bird, scientific sleuth extraordinary, goes after a sinister stealer of brains.] "I hope, Carnes," said Dr. Bird, "t
- End: o, this is a department primarily for _Readers_, and we want you to make full use of it. Likes, dislikes, criticisms, explanations, roses, brickbats, suggestions--everything's welcome here: so "come over in 'The Readers' Corner'" and discuss it with all of us!

### a-story-of-the-stone-age

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/A Story of the Stone Age.txt
- Expected/generated title: A Story of the Stone Age / A Story of the Stone Age
- Expected/generated author: Herbert George Wells / Herbert George Wells
- Author evidence: Gutenberg Author line - Author: Herbert George Wells
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: five source roman story sections from the individual Wells story
- Start boundary: cleaned line 8 - start at cleaned-body line 7: A STORY OF THE STONE AGE; write pass starts at first selected/default section
- End boundary: cleaned line 596 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Section 1 (6072 words)
- Section count: 5
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass starts at section I and excludes the parent collection URL/production wrapper.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run title/default-start risk: first default section is meaningful but should be verified manually in write pass; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: Section 1 - Ugh-Lomi and Uya (6072 words)
- chapter-002: Section 2 - The Cave Bear (4524 words)
- chapter-003: Section 3 - The First Horseman (4020 words)
- chapter-004: Section 4 - Uya the Lion (3777 words)
- chapter-005: Section 5 - The Fight in the Lion's Thicket (3952 words)

Last 5 sections:

- chapter-001: Section 1 - Ugh-Lomi and Uya (6072 words)
- chapter-002: Section 2 - The Cave Bear (4524 words)
- chapter-003: Section 3 - The First Horseman (4020 words)
- chapter-004: Section 4 - Uya the Lion (3777 words)
- chapter-005: Section 5 - The Fight in the Lion's Thicket (3952 words)

Supporting snippets:

- Title: Title: Tales of Space and Time
- Author: Author: Herbert George Wells
- Start: I—UGH-LOMI AND UYA This story is of a time beyond the memory of man, before the beginning of history, a time when one might have walked dryshod from France (as we call it now) to England, and when a broad and sluggish Thames flowed through its marshes to meet
- End: ese three to come to the squatting-place in peace, with the food they had with them. Ugh-lomi ate the trout. Thereafter for many moons Ugh-lomi was master and had his will in peace. And on the fulness of time he was killed and eaten even as Uya had been slain.

### the-magic-shop

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE MAGIC SHOP.txt
- Expected/generated title: The Magic Shop / The Magic Shop
- Expected/generated author: H. G. Wells / H. G. Wells
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 5 - start at cleaned-body line 4: THE MAGIC SHOP; write pass starts at first selected/default section
- End boundary: cleaned line 233 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Magic Shop (3986 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run title/default-start risk: first default section is meaningful but should be verified manually in write pass; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: The Magic Shop (3986 words)

Last 5 sections:

- chapter-001: The Magic Shop (3986 words)

Supporting snippets:

- Title: Title: Twelve Stories and a Dream
- Author: Author: H. G. Wells
- Start: I had seen the Magic Shop from afar several times; I had passed it once or twice, a shop window of alluring little objects, magic balls, magic hens, wonderful cones, ventriloquist dolls, the material of the basket trick, packs of cards that LOOKED all right, a
- End: s, looking for that shop. I am inclined to think, indeed, that in that matter honour is satisfied, and that, since Gip's name and address are known to them, I may very well leave it to these people, whoever they may be, to send in their bill in their own time.

### the-man-who-could-work-miracles

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Man Who Could Work Miracles.txt
- Expected/generated title: The Man Who Could Work Miracles / The Man Who Could Work Miracles
- Expected/generated author: Herbert George Wells / Herbert George Wells
- Author evidence: Gutenberg Author line - Author: Herbert George Wells
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at cleaned-body line 70: "Well?"; write pass starts at first selected/default section
- End boundary: cleaned line 234 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Man Who Could Work Miracles (6516 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run title/default-start risk: first default section is meaningful but should be verified manually in write pass; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: The Man Who Could Work Miracles (6516 words)

Last 5 sections:

- chapter-001: The Man Who Could Work Miracles (6516 words)

Supporting snippets:

- Title: Title: Tales of Space and Time
- Author: Author: Herbert George Wells
- Start: It is doubtful whether the gift was innate. For my own part, I think it came to him suddenly. Indeed, until he was thirty he was a sceptic, and did not believe in miraculous powers. And here, since it is the most convenient place, I must mention that he was a
- End: o the hilt." "That's what you think," said Toddy Beamish, and "Prove it if you can." "Looky here, Mr. Beamish," said Mr. Fotheringay. "Let us clearly understand what a miracle is. It's something contrariwise to the course of nature done by power of Will...."

### the-truth-about-pyecraft

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE TRUTH ABOUT PYECRAFT.txt
- Expected/generated title: The Truth About Pyecraft / The Truth About Pyecraft
- Expected/generated author: H. G. Wells / H. G. Wells
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 5 - start at cleaned-body line 49: “From Pattison?”; write pass starts at first selected/default section
- End boundary: cleaned line 287 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Truth About Pyecraft (3720 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run title/default-start risk: first default section is meaningful but should be verified manually in write pass; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: The Truth About Pyecraft (3720 words)

Last 5 sections:

- chapter-001: The Truth About Pyecraft (3720 words)

Supporting snippets:

- Title: Title: Twelve Stories and a Dream
- Author: Author: H. G. Wells
- Start: He sits not a dozen yards away. If I glance over my shoulder I can see him. And if I catch his eye—and usually I catch his eye—it meets me with an expression. It is mainly an imploring look—and yet with suspicion in it. Confound his suspicion! If I wanted to
- End: s keeping, eh? If any one knew of it—I should be so ashamed.... Makes a fellow look such a fool, you know. Crawling about on a ceiling and all that....” And now to elude Pyecraft, occupying, as he does, an admirable strategic position between me and the door.

### filmer

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/FILMER.txt
- Expected/generated title: Filmer / Filmer
- Expected/generated author: H. G. Wells / H. G. Wells
- Author evidence: Gutenberg Author line - Author: H. G. Wells
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 5 - start at cleaned-body line 3: FILMER; write pass starts at first selected/default section
- End boundary: cleaned line 159 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Filmer (6628 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run title/default-start risk: first default section is meaningful but should be verified manually in write pass; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: Filmer (6628 words)

Last 5 sections:

- chapter-001: Filmer (6628 words)

Supporting snippets:

- Title: Title: Twelve Stories and a Dream
- Author: Author: H. G. Wells
- Start: In truth the mastery of flying was the work of thousands of men—this man a suggestion and that an experiment, until at last only one vigorous intellectual effort was needed to finish the work. But the inexorable injustice of the popular mind has decided that o
- End: ht sight of the ascent when pulling up the blind of his bedroom window—equipped, among other things, with a film camera that was subsequently discovered to be jammed. And Filmer was lying on the billiard table in the green pavilion with a sheet about his body.

### two-in-a-sack

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/TWO IN A SACK.txt
- Expected/generated title: Two in a Sack / Two in a Sack
- Expected/generated author: Andrew Lang / Andrew Lang
- Author evidence: Gutenberg Author line - Author: Andrew Lang
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 10 - start at TWO IN A SACK: What a life that poor man led with his wife; write pass starts at first selected/default section
- End boundary: cleaned line 238 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Two in a Sack (1512 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: Two in a Sack (1512 words)

Last 5 sections:

- chapter-001: Two in a Sack (1512 words)

Supporting snippets:

- Title: Title: The Violet Fairy Book
- Author: Author: Andrew Lang
- Start: What a life that poor man led with his wife, to be sure! Not a day passed without her scolding him and calling him names, and indeed sometimes she would take the broom from behind the stove and beat him with it. He had no peace or comfort at all, and really ha
- End: er husband took pity on her, and cried: ‘Two into the sack.’ He had hardly said the words before they were back in the sack again. From this time the man and his wife lived so happily together that it was a pleasure to see them, and so the story has an end.

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
