# Pilot write batch 9

Controlled first-time processing pass for the exact raw-only books selected by pilot dry-run batch 9.

## Totals

- Selected: 20
- First-time processed: 18
- Skipped: 2
- Unresolved-source generated left untouched: 11

## Accepted Exclusion Count Clarification

- Dry-run accepted/corrected/verified exclusion count: 162
- Includes duplicate skip: yes (the-wind-in-the-willows)
- Accepted/corrected/verified count excluding duplicate skip: 161
- Selected books intersecting accepted exclusions: none
- Note: The dry-run count of 162 includes the carried-forward duplicate skip for the-wind-in-the-willows; the expected accepted/corrected/verified processed-book count remains 161 excluding that skip. This write pass uses only the exact selected list from pilot-dry-run-9.json.

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

### a-study-in-scarlet

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/A Study in Scarlet.txt
- Expected/generated title: A Study in Scarlet / A Study in Scarlet
- Expected/generated author: Arthur Conan Doyle / Arthur Conan Doyle
- Author evidence: Gutenberg Author line - Author: Arthur Conan Doyle
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: chapter-based roman numerals with part divisions
- Start boundary: cleaned line 32 - start at cleaned-body line 39: CHAPTER I.; write pass starts at first selected/default section
- End boundary: cleaned line 4695 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Chapter 1 (2818 words)
- Section count: 14
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: contents or list material must not enter default playback; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: Chapter 1 - Part I. (2818 words)
- chapter-002: Chapter 2 (3565 words)
- chapter-003: Chapter 3 (3858 words)
- chapter-004: Chapter 4 (2608 words)
- chapter-005: Chapter 5 (2554 words)

Last 5 sections:

- chapter-010: Chapter 3 (1876 words)
- chapter-011: Chapter 4 (3397 words)
- chapter-012: Chapter 5 (3559 words)
- chapter-013: Chapter 6 (4554 words)
- chapter-014: Chapter 7 (2128 words)

Supporting snippets:

- Title: Title: A Study in Scarlet
- Author: Author: Arthur Conan Doyle
- Start: PART I. (_Being a reprint from the Reminiscences of_ JOHN H. WATSON, M.D., _Late of the Army Medical Department._) CHAPTER I. MR. SHERLOCK HOLMES. In the year 1878 I took my degree of Doctor of Medicine of the University of London, and proceeded to Netle
- End: “I have all the facts in my journal, and the public shall know them. In the meantime you must make yourself contented by the consciousness of success, like the Roman miser— “‘Populus me sibilat, at mihi plaudo Ipse domi simul ac nummos contemplor in arca.’”

### dagon

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/Dagon.txt
- Expected/generated title: Dagon / Dagon
- Expected/generated author: H. P. Lovecraft / H. P. Lovecraft
- Author evidence: source wrapper byline and accepted Lovecraft metadata convention - H. P. Lovecraft
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 36 - start at first readable prose after source/title/byline wrapper: I am writing this under an appreciable mental strain; write pass starts at first selected/default section
- End boundary: cleaned line 235 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Dagon (2096 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from source wrapper byline and accepted Lovecraft metadata convention
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg start marker; body text was not destructively stripped.; Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets; metadata normalization: Faded Page header gives Howard Phillips Lovecraft (1890-1937), while source byline and earlier accepted Lovecraft books use H. P. Lovecraft.

First 5 sections:

- chapter-001: Dagon (2096 words)

Last 5 sections:

- chapter-001: Dagon (2096 words)

Supporting snippets:

- Title: Title: Dagon
- Author: H. P. Lovecraft
- Start: I am writing this under an appreciable mental strain, since by tonight I shall be no more. Penniless, and at the end of my supply of the drug which alone makes life endurable, I can bear the torture no longer; and shall cast myself from this garret window int
- End: l ascend amidst universal pandemonium. The end is near. I hear a noise at the door, as of some immense slippery body lumbering against it. It shall not find me. God, _that hand_! The window! The window! [The end of _Dagon_ by Howard Phillips Lovecraft]

### deep-sea-plunderings

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/Deep-Sea Plunderings.txt
- Expected/generated title: Deep-Sea Plunderings / Deep-Sea Plunderings
- Expected/generated author: Frank Thomas Bullen / Frank Thomas Bullen
- Author evidence: Gutenberg Author line - Author: Frank Thomas Bullen
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: 24 contents-listed story headings after title, prefatory note, contents, and illustration list
- Start boundary: cleaned line 168 - start at THROUGH FIRE AND WATER: What a clumsy, barrel-bellied old hooker she is; write pass starts at first selected/default section
- End boundary: cleaned line 9279 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: THROUGH FIRE AND WATER (3885 words)
- Section count: 24
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Write pass used the 24 contents-listed story headings beginning with THROUGH FIRE AND WATER; title page, prefatory note, contents, illustration list, and publisher ads are excluded from default playback.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: contents or list material must not enter default playback; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: illustration captions/placeholders detected

First 5 sections:

- chapter-001: THROUGH FIRE AND WATER (3885 words)
- chapter-002: THE OLD HOUSE ON THE HILL (9593 words)
- chapter-003: YOU SING (10894 words)
- chapter-004: THE DEBT OF THE WHALE (6671 words)
- chapter-005: THE SKIPPER'S WIFE (2664 words)

Last 5 sections:

- chapter-020: THE GREAT CHRISTMAS OF GOZO (2790 words)
- chapter-021: DEEP-SEA FISH (2615 words)
- chapter-022: A MEDITERRANEAN MORNING (1458 words)
- chapter-023: ABNER'S TRAGEDY (3025 words)
- chapter-024: LOST AND FOUND (4359 words)

Supporting snippets:

- Title: Title: Deep-Sea Plunderings
- Author: Author: Frank Thomas Bullen
- Start: THROUGH FIRE AND WATER What a clumsy, barrel-bellied old hooker she is, Field! Thus, closing his telescope with a bang, the elegant chief officer of the Mirzapore, steel four-masted clipper ship of 5000 tons burden, presently devouring the degrees of long
- End: d ‘do things’ himself. Any boy between fifteen and nineteen who reads this book and does not want to go to sea must be a sluggish youth.... The book is really an interesting record of an interesting man.”--_New York Press._ D. APPLETON AND COMPANY, NEW YORK.

### five-little-peppers-at-school

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/Five Little Peppers at School.txt
- Expected/generated title: Five Little Peppers at School / Five Little Peppers at School
- Expected/generated author: Margaret Sidney / Margaret Sidney
- Author evidence: Gutenberg Author line - Author: Margaret Sidney
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: 25 contents-listed roman chapter-title headings after title page, book list, contents, and illustrations
- Start boundary: cleaned line 212 - start at I HARD TIMES FOR JOEL: Come on, Pepper.; write pass starts at first selected/default section
- End boundary: cleaned line 10949 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Chapter 1 (2624 words)
- Section count: 25
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Write pass used the 25 contents-listed roman chapter-title headings beginning with I HARD TIMES FOR JOEL; title page, book list, contents, and illustration captions are excluded from default playback.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: contents or list material must not enter default playback; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the collection title and individual story titles become sections; dry-run artifact risk: illustration captions/placeholders detected

First 5 sections:

- chapter-001: Chapter 1 - Hard Times for Joel (2624 words)
- chapter-002: Chapter 2 - The Tennis Match (1997 words)
- chapter-003: Chapter 3 - A Narrow Escape (2543 words)
- chapter-004: Chapter 4 - Of Various Things (2103 words)
- chapter-005: Chapter 5 - At Silvia Horne's (2766 words)

Last 5 sections:

- chapter-021: Chapter 21 - At the Play (4230 words)
- chapter-022: Chapter 22 - Pickering Dodge (3874 words)
- chapter-023: Chapter 23 - The Clemcy Garden Party (5331 words)
- chapter-024: Chapter 24 - The Piece of News (3431 words)
- chapter-025: Chapter 25 - "The Very Prettiest Affair" (3481 words)

Supporting snippets:

- Title: Title: Five Little Peppers at School
- Author: Author: Margaret Sidney
- Start: I HARD TIMES FOR JOEL "Come on, Pepper." One of the boys rushed down the dormitory hall, giving a bang on Joel's door as he passed. "All right," said Joel a bit crossly, "I'm coming." "Last bell," came back on the wind. Joel threw his tennis racket on the
- End: What, she didn't finish; for Mother Fisher just then cried out, and passed the yellow sheet to the little doctor. "Read it aloud," was all she said. But how her black eyes shone! "David took first prize classics. I'm picking up a bit. JOEL PEPPER." THE END.

### pickman-s-model

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/Pickman's Model.txt
- Expected/generated title: Pickman's Model / Pickman's Model
- Expected/generated author: H. P. Lovecraft / H. P. Lovecraft
- Author evidence: Faded Page Author line with date removed - Author: H. P. Lovecraft (1890-1937)
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 46 - start at first readable prose after source/title/byline wrapper: You needn't think I'm crazy; write pass starts at first selected/default section
- End boundary: cleaned line 546 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Pickman's Model (5278 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Faded Page Author line with date removed
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg start marker; body text was not destructively stripped.; Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: illustration captions/placeholders detected; metadata normalization: removed lifespan parenthetical to match earlier accepted Lovecraft manifests.

First 5 sections:

- chapter-001: Pickman's Model (5278 words)

Last 5 sections:

- chapter-001: Pickman's Model (5278 words)

Supporting snippets:

- Title: Title: Pickman's Model
- Author: Author: H. P. Lovecraft (1890-1937)
- Start: You needn't think I'm crazy, Eliot--plenty of others have queerer prejudices than this. Why don't you laugh at Oliver's grandfather, who won't ride in a motor? If I don't like that damned subway, it's my own business; and we got here more quickly anyhow in t
- End: s being he was painting on that awful canvas. It was the model he was using--and its background was merely the wall of the cellar studio in minute detail. But by God, Eliot, _it was a photograph from life_. [The end of _Pickman's Model_ by H. P. Lovecraft]

### quo-vadis

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/Quo Vadis.txt
- Expected/generated title: Quo Vadis: A Narrative of the Time of Nero / Quo Vadis: A Narrative of the Time of Nero
- Expected/generated author: Henryk Sienkiewicz / Henryk Sienkiewicz
- Author evidence: Gutenberg Author line - Author: Henryk Sienkiewicz
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: chapter-based roman numerals
- Start boundary: cleaned line 54 - start at cleaned-body line 54: Chapter I; write pass starts at first selected/default section
- End boundary: cleaned line 22228 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Chapter 1 (4687 words)
- Section count: 73
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: Chapter 1 (4687 words)
- chapter-002: Chapter 2 (6824 words)
- chapter-003: Chapter 3 (891 words)
- chapter-004: Chapter 4 (2579 words)
- chapter-005: Chapter 5 (1421 words)

Last 5 sections:

- chapter-069: Chapter 69 (850 words)
- chapter-070: Chapter 70 (1979 words)
- chapter-071: Chapter 71 (495 words)
- chapter-072: Chapter 72 (2516 words)
- chapter-073: Chapter 73 (4612 words)

Supporting snippets:

- Title: Title: Quo Vadis: A Narrative of the Time of Nero
- Author: Author: Henryk Sienkiewicz
- Start: Chapter I PETRONIUS woke only about midday, and as usual greatly wearied. The evening before he had been at one of Nero s feasts, which was prolonged till late at night. For some time his health had been failing. He said himself that he woke up benumbed, as
- End: s a storm, as a fire, as war or death passes; but the basilica of Peter rules till now, from the Vatican heights, the city, and the world. Near the ancient Porta Capena stands to this day a little chapel with the inscription, somewhat worn: Quo Vadis, Domine?

### the-amateur-cracksman

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Amateur Cracksman.txt
- Expected/generated title: The Amateur Cracksman / The Amateur Cracksman
- Expected/generated author: E. W. Hornung / E. W. Hornung
- Author evidence: Gutenberg Author line - Author: E. W. Hornung
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: 8 contents-listed Raffles story headings after title, dedication, and contents
- Start boundary: cleaned line 29 - start at THE IDES OF MARCH: It was half-past twelve; write pass starts at first selected/default section
- End boundary: cleaned line 6110 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: THE IDES OF MARCH (7688 words)
- Section count: 8
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: body headings were found but rejected by the selected strategy; Write pass used the 8 contents-listed Raffles story headings beginning with THE IDES OF MARCH; title page, dedication, and contents are excluded from default playback.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: contents or list material must not enter default playback; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the collection title and individual story titles become sections; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: THE IDES OF MARCH (7688 words)
- chapter-002: A COSTUME PIECE (6266 words)
- chapter-003: GENTLEMEN AND PLAYERS (6726 words)
- chapter-004: LE PREMIER PAS (6063 words)
- chapter-005: WILFUL MURDER (5403 words)

Last 5 sections:

- chapter-004: LE PREMIER PAS (6063 words)
- chapter-005: WILFUL MURDER (5403 words)
- chapter-006: NINE POINTS OF THE LAW (6022 words)
- chapter-007: THE RETURN MATCH (5516 words)
- chapter-008: THE GIFT OF THE EMPEROR (8546 words)

Supporting snippets:

- Title: Title: The Amateur Cracksman
- Author: Author: E. W. Hornung
- Start: THE IDES OF MARCH I It was half-past twelve when I returned to the Albany as a last desperate resort. The scene of my disaster was much as I had left it. The baccarat-counters still strewed the table, with the empty glasses and the loaded ash-trays. A wind
- End: ave it up utterly. Yet anon it would rise again, a mere mote dancing in the dim gray distance, drifting towards a purple island, beneath a fading western sky, streaked with dead gold and cerise. And night fell before I knew whether it was a human head or not.

### the-black-star-passes

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Black Star Passes.txt
- Expected/generated title: The Black Star Passes / The Black Star Passes
- Expected/generated author: John W. Campbell, Jr. / John W. Campbell, Jr.
- Author evidence: title page and copyright line - JOHN W. CAMPBELL; Copyright, 1953, by John W. Campbell, Jr.
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: standalone roman numeral sections with book divisions
- Start boundary: cleaned line 493 - start at cleaned-body line 493: I.; write pass starts at first selected/default section
- End boundary: cleaned line 8043 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Chapter 1 (2870 words)
- Section count: 18
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from title page and copyright line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: contents or list material must not enter default playback; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: illustration captions/placeholders detected; metadata correction: Gutenberg header misorders the author as 'Jr. John W. Campbell'; title page/copyright evidence supports 'John W. Campbell, Jr.'.

First 5 sections:

- chapter-001: Chapter 1 (2870 words)
- chapter-002: Chapter 2 (5291 words)
- chapter-003: Chapter 3 (4618 words)
- chapter-004: Chapter 4 (5603 words)
- chapter-005: Chapter 1 - Book Two (1812 words)

Last 5 sections:

- chapter-014: Chapter 2 (3925 words)
- chapter-015: Chapter 3 (4722 words)
- chapter-016: Chapter 4 (2644 words)
- chapter-017: Chapter 5 (2772 words)
- chapter-018: Chapter 6 (4703 words)

Supporting snippets:

- Title: Title: The Black Star Passes
- Author: JOHN W. CAMPBELL; Copyright, 1953, by John W. Campbell, Jr.
- Start: I. On the thirty-ninth floor of a large New York apartment two young men were lounging about after a strenuous game of tennis. The blue tendrils of smoke from their pipes rose slowly, to be drawn away by the efficient ventilating system. The taller of the tw
- End: 343 (40c) THE EXILE OF TIME by Ray Cummings F-344 (40c) THE WELL OF THE WORLDS by Henry Kuttner Available from Ace Books, Inc. (Dept. M M), 1120 Avenue of the Americas, New York, N.Y. 10036. Send price indicated, plus 5c handling fee.

### the-blue-castle

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Blue Castle.txt
- Expected/generated title: The Blue Castle: a novel / The Blue Castle: a novel
- Expected/generated author: L. M. Montgomery / L. M. Montgomery
- Author evidence: Gutenberg Author line - Author: L. M. Montgomery
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: chapter-based roman numerals
- Start boundary: cleaned line 66 - start at cleaned-body line 66: CHAPTER I; write pass starts at first selected/default section
- End boundary: cleaned line 8057 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Chapter 1 (3438 words)
- Section count: 45
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: contents or list material must not enter default playback; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: Chapter 1 (3438 words)
- chapter-002: Chapter 2 (1106 words)
- chapter-003: Chapter 3 (1616 words)
- chapter-004: Chapter 4 (734 words)
- chapter-005: Chapter 5 (1352 words)

Last 5 sections:

- chapter-041: Chapter 41 (648 words)
- chapter-042: Chapter 42 (1378 words)
- chapter-043: Chapter 43 (488 words)
- chapter-044: Chapter 44 (333 words)
- chapter-045: Chapter 45 (200 words)

Supporting snippets:

- Title: Title: The Blue Castle: a novel
- Author: Author: L. M. Montgomery
- Start: CHAPTER I If it had not rained on a certain May morning Valancy Stirling s whole life would have been entirely different. She would have gone, with the rest of her clan, to Aunt Wellington s engagement picnic and Dr. Trent would have gone to Montreal. But it
- End: e her—‘the glory that was Greece and the grandeur that was Rome’—lure of the ageless Nile—glamour of the Riviera—mosque and palace and minaret—she knew perfectly well that no spot or place or home in the world could ever possess the sorcery of her Blue Castle.

### the-brothers-karamazov

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Brothers Karamazov.txt
- Expected/generated title: The Brothers Karamazov / The Brothers Karamazov
- Expected/generated author: Fyodor Dostoyevsky / Fyodor Dostoyevsky
- Author evidence: Gutenberg Author line - Author: Fyodor Dostoyevsky
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: chapter-based roman numerals with book divisions and part divisions
- Start boundary: cleaned line 140 - start at cleaned-body line 143: Chapter I.; write pass starts at first selected/default section
- End boundary: cleaned line 37014 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Chapter 1 (1370 words)
- Section count: 96
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001, chapter-002
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: body headings were found but rejected by the selected strategy; body headings were found but rejected by the selected strategy; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: contents or list material must not enter default playback; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: Chapter 1 - Book I. The History Of A Family (1370 words)
- chapter-002: Chapter 2 (1327 words)
- chapter-003: Chapter 3 (2619 words)
- chapter-004: Chapter 4 (3589 words)
- chapter-005: Chapter 5 (3663 words)

Last 5 sections:

- chapter-092: Chapter 13 (3479 words)
- chapter-093: Chapter 14 (2622 words)
- chapter-094: Chapter 1 (2259 words)
- chapter-095: Chapter 2 (3174 words)
- chapter-096: Chapter 3 (4229 words)

Supporting snippets:

- Title: Title: The Brothers Karamazov
- Author: Author: Fyodor Dostoyevsky
- Start: Book I. The History Of A Family Chapter I. Fyodor Pavlovitch Karamazov Alexey Fyodorovitch Karamazov was the third son of Fyodor Pavlovitch Karamazov, a land owner well known in our district in his own day, and still remembered among us owing to his gloomy
- End: . If the deceased was a priest as well as a monk the canticle “Our Helper and Defender” is sung instead. i.e. a chime of bells. Literally: “Did you get off with a long nose made at you?”—a proverbial expression in Russia for failure. Gogol is meant.

### the-buccaneer

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Buccaneer.txt
- Expected/generated title: The Buccaneer: A Tale / The Buccaneer: A Tale
- Expected/generated author: Mrs. S. C. Hall / Mrs. S. C. Hall
- Author evidence: Gutenberg Author line - Author: Mrs. S. C. Hall
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: three-volume chapter-based roman numerals with explicit CHAPTER IV safeguard
- Start boundary: cleaned line 114 - start at cleaned-body line 114: CHAPTER I.; write pass starts at first selected/default section
- End boundary: cleaned line 18308 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Chapter 1 (5584 words)
- Section count: 46
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Write pass used all 46 explicit CHAPTER I-XVI / I-XV roman headings across the three volumes because the generic detector skipped a real Chapter IV.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: illustration captions/placeholders detected

First 5 sections:

- chapter-001: Chapter 1 (5584 words)
- chapter-002: Chapter 2 (3420 words)
- chapter-003: Chapter 3 (3413 words)
- chapter-004: Chapter 4 (5916 words)
- chapter-005: Chapter 5 (4189 words)

Last 5 sections:

- chapter-042: Chapter 11 (2816 words)
- chapter-043: Chapter 12 (4395 words)
- chapter-044: Chapter 13 (6150 words)
- chapter-045: Chapter 14 (1744 words)
- chapter-046: Chapter 15 (8407 words)

Supporting snippets:

- Title: Title: The Buccaneer: A Tale
- Author: Author: Mrs. S. C. Hall
- Start: CHAPTER I. With roomy decks, her guns of mighty strength, Whose low-laid mouths each mounting billow laves, Deep in her draught, and warlike in her length, She seems a sea wasp flying on the waves. DRYDEN. It was between the hours of
- End: sleep well whose hearts are innocent as yours, Barbara! and I hope I may add without presumption, purified as mine. You see, Springall, the earth that nourishes the rose may in time partake of its fragrance." THE END. LONDON: Printed by A. SPOTTISWOODE.

### the-cats-of-ulthar

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Cats of Ulthar.txt
- Expected/generated title: The Cats of Ulthar / The Cats of Ulthar
- Expected/generated author: H. P. Lovecraft / H. P. Lovecraft
- Author evidence: Faded Page Author line with date removed - Author: Howard Phillips Lovecraft (1890-1937)
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 43 - start at first readable prose after source/title/byline wrapper: It is said that in Ulthar; write pass starts at first selected/default section
- End boundary: cleaned line 163 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Cats of Ulthar (1350 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Faded Page Author line with date removed
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg start marker; body text was not destructively stripped.; Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets; metadata normalization: Faded Page header gives Howard Phillips Lovecraft (1890-1937); earlier accepted Lovecraft manifests use H. P. Lovecraft.

First 5 sections:

- chapter-001: The Cats of Ulthar (1350 words)

Last 5 sections:

- chapter-001: The Cats of Ulthar (1350 words)

Supporting snippets:

- Title: Title: The Cats of Ulthar
- Author: Author: Howard Phillips Lovecraft (1890-1937)
- Start: It is said that in Ulthar, which lies beyond the river Skai, no man may kill a cat; and this I can verily believe as I gaze upon him who sitteth purring before the fire. For the cat is cryptic, and close to strange things which men cannot see. He is the soul
- End: the repellent yard. And in the end the burgesses passed that remarkable law which is told of by traders in Hatheg and discussed by travelers in Nir; namely, that in Ulthar no man may kill a cat. [The end of _The Cats of Ulthar_ by Howard Phillips Lovecraft]

### the-festival

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The festival.txt
- Expected/generated title: The Festival / The Festival
- Expected/generated author: H. P. Lovecraft / H. P. Lovecraft
- Author evidence: Faded Page Author line - Author: H. P. Lovecraft
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 12 - start at first readable prose after source/title/byline wrapper: I was far from home; write pass starts at first selected/default section
- End boundary: cleaned line 349 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Festival (3602 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Faded Page Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets; title normalization: source header casing is 'The festival', while story heading/byline supports 'The Festival'.

First 5 sections:

- chapter-001: The Festival (3602 words)

Last 5 sections:

- chapter-001: The Festival (3602 words)

Supporting snippets:

- Title: Title: The festival
- Author: Author: H. P. Lovecraft
- Start: I was far from home, and the spell of the eastern sea was upon me. In the twilight I heard it pounding on the rocks, and I knew it lay just over the hill where the twisting willows writhed against the clearing sky and the first stars of evening. And because my
- End: aws_; till out of corruption horrid life springs, and the dull scavengers of earth wax crafty to vex it and swell monstrous to plague it. Great holes secretly are digged where earth’s pores ought to suffice, and things have learnt to walk that ought to crawl.”

### the-history-of-sir-richard-calmady-a-romance

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The History of Sir Richard Calmady - A Romance.txt
- Expected/generated title: The History of Sir Richard Calmady: A Romance / The History of Sir Richard Calmady: A Romance
- Expected/generated author: Lucas Malet / Lucas Malet
- Author evidence: Gutenberg Author line - Author: Lucas Malet
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: chapter-based roman numerals with book divisions
- Start boundary: cleaned line 225 - start at cleaned-body line 230: CHAPTER I; write pass starts at first selected/default section
- End boundary: cleaned line 28278 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Chapter 1 (2187 words)
- Section count: 60
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: contents or list material must not enter default playback; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: Chapter 1 - Book I (2187 words)
- chapter-002: Chapter 2 (4902 words)
- chapter-003: Chapter 3 (2057 words)
- chapter-004: Chapter 4 (3600 words)
- chapter-005: Chapter 5 (4019 words)

Last 5 sections:

- chapter-056: Chapter 7 (6522 words)
- chapter-057: Chapter 8 (3991 words)
- chapter-058: Chapter 9 (6231 words)
- chapter-059: Chapter 10 (9777 words)
- chapter-060: Chapter 11 (3152 words)

Supporting snippets:

- Title: Title: The History of Sir Richard Calmady: A Romance
- Author: Author: Lucas Malet
- Start: BOOK I THE CLOWN CHAPTER I ACQUAINTING THE READER WITH A FAIR DOMAIN AND THE MAKER THEREOF In that fortunate hour of English history, when the cruel sights and haunting insecurities of the Middle Ages had passed away, and while, as yet, the fanatic zeal
- End: to bring me through. But now perhaps they're a little out of the picture." Richard drew her hand nearer and kissed it, leaning back in his chair, and looking up at her. "And I have you--" he said, "you most perfect of mothers.--And--ah! here comes Honoria!"

### the-nameless-city

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Nameless City.txt
- Expected/generated title: The Nameless City / The Nameless City
- Expected/generated author: H. P. Lovecraft / H. P. Lovecraft
- Author evidence: Faded Page Author line with date removed - Author: Howard Phillips Lovecraft (1890-1937)
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 39 - start at first readable prose after source/title/byline wrapper: When I drew nigh the nameless city; write pass starts at first selected/default section
- End boundary: cleaned line 514 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Nameless City (5032 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Faded Page Author line with date removed
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg start marker; body text was not destructively stripped.; Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets; metadata normalization: Faded Page header gives Howard Phillips Lovecraft (1890-1937); earlier accepted Lovecraft manifests use H. P. Lovecraft.

First 5 sections:

- chapter-001: The Nameless City (5032 words)

Last 5 sections:

- chapter-001: The Nameless City (5032 words)

Supporting snippets:

- Title: Title: The Nameless City
- Author: Author: Howard Phillips Lovecraft (1890-1937)
- Start: When I drew nigh the nameless city I knew it was accursed. I was traveling in a parched and terrible valley under the moon, and afar I saw it protruding uncannily above the sands as parts of a corpse might protrude from an ill-made grave. Fear spoke from the a
- End: e great brazen door clanged shut with a deafening peal of metallic music whose reverberations swelled out to the distant world to hail the rising sun as Memnon hails it from the banks of the Nile. [The end of _The Nameless City_ by Howard Phillips Lovecraft]

### the-three-taps-a-detective-story-without-a-moral

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The three taps - A detective story without a moral.txt
- Expected/generated title: The Three Taps / The Three Taps
- Expected/generated author: Ronald Arbuthnott Knox / Ronald Arbuthnott Knox
- Author evidence: Gutenberg Author line - Author: Ronald Arbuthnott Knox
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: chapter-based roman numerals
- Start boundary: cleaned line 42 - start at cleaned-body line 42: Chapter I; write pass starts at first selected/default section
- End boundary: cleaned line 7161 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Chapter 1 (3088 words)
- Section count: 25
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: contents or list material must not enter default playback; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets; title normalization: source header includes the subtitle; visible source title supports the shorter public title The Three Taps.

First 5 sections:

- chapter-001: Chapter 1 (3088 words)
- chapter-002: Chapter 2 (2654 words)
- chapter-003: Chapter 3 (2705 words)
- chapter-004: Chapter 4 (2572 words)
- chapter-005: Chapter 5 (2789 words)

Last 5 sections:

- chapter-021: Chapter 21 (2019 words)
- chapter-022: Chapter 22 (2148 words)
- chapter-023: Chapter 23 (2733 words)
- chapter-024: Chapter 24 (2581 words)
- chapter-025: Chapter 25 (4415 words)

Supporting snippets:

- Title: Title: The three taps
- Author: Author: Ronald Arbuthnott Knox
- Start: Chapter I The Euthanasia Policy The principles of insurance, they tell us, were not hidden from our Anglo-Saxon forefathers. How anybody had the enterprise in those rough-and-tumble days to guarantee a client against fire, water, robbery or other calamity
- End: aid Leyland, “I suppose the bet’s off.” “And Mr. Bredon,” added the Bishop, “will get no thanks from his company. I’m afraid, Mr. Bredon, you will have carried nothing away with you from your visit to these parts.” “Oh, I don’t know about that,” said Bredon.

### the-turmoil

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Turmoil.txt
- Expected/generated title: The Turmoil: A Novel / The Turmoil: A Novel
- Expected/generated author: Booth Tarkington / Booth Tarkington
- Author evidence: Gutenberg Author line - Author: Booth Tarkington
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: chapter-based roman numerals
- Start boundary: cleaned line 13 - start at cleaned-body line 13: CHAPTER I; write pass starts at first selected/default section
- End boundary: cleaned line 10093 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Chapter 1 (1224 words)
- Section count: 33
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001, chapter-002
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: Chapter 1 (1224 words)
- chapter-002: Chapter 2 (1871 words)
- chapter-003: Chapter 3 (2826 words)
- chapter-004: Chapter 4 (3091 words)
- chapter-005: Chapter 5 (2447 words)

Last 5 sections:

- chapter-029: Chapter 29 (2366 words)
- chapter-030: Chapter 30 (2632 words)
- chapter-031: Chapter 21 (2610 words)
- chapter-032: Chapter 32 (2450 words)
- chapter-033: Chapter 33 (2722 words)

Supporting snippets:

- Title: Title: The Turmoil: A Novel
- Author: Author: Booth Tarkington
- Start: CHAPTER I There is a midland city in the heart of fair, open country, a dirty and wonderful city nesting dingily in the fog of its own smoke. The stranger must feel the dirt before he feels the wonder, for the dirt will be upon him instantly. It will be upon
- End: ument--it was so gentle and so light, so almost nothing, it seemed to be made of air--and it came from the air. Slowly and incredulously he turned--and glory fell upon his shining eyes. The door of his father's room had opened. Mary stood upon the threshold.

### the-two-magics-the-turn-of-the-screw-covering-end

- Dry-run status: needs first-time controlled processing
- Final action: skipped
- Source: app/client/assets/temp-books/The Two Magics - The Turn of the Screw, Covering End.txt
- Expected/generated title: The Two Magics: The Turn of the Screw, Covering End / n/a
- Expected/generated author: Henry James / n/a
- Author evidence: Gutenberg Author line - Author: Henry James
- Duplicate/near-duplicate slug check: Skipped after write-pass duplicate check: the raw file is the collection The Two Magics and contains a full The Turn of the Screw, while generated the-turn-of-the-screw already exists; no distinct-version policy exists for duplicating that work under a collection slug.
- Structure: standalone roman numeral sections
- Start boundary: cleaned line n/a - start at cleaned-body line 351: I
- End boundary: cleaned line n/a - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- First default section after: n/a (n/a words)
- Section count: 0
- Title/default-start verdict: not generated
- Author metadata verdict: not generated
- Segmentation verdict: not generated
- Preview verdict: not generated
- Startup preview valid: no
- All-main-readable-default verdict: not generated
- Final recommendation: skipped
- Remaining warnings: Skipped after write-pass duplicate check: the raw file is the collection The Two Magics and contains a full The Turn of the Screw, while generated the-turn-of-the-screw already exists; no distinct-version policy exists for duplicating that work under a collection slug.

First 5 sections:


Last 5 sections:


Supporting snippets:

- Title: Title: The Two Magics: The Turn of the Screw, Covering End
- Author: Author: Henry James
- Start: n/a
- End: n/a

### the-works-of-edgar-allan-poe

- Dry-run status: needs first-time controlled processing
- Final action: skipped
- Source: app/client/assets/temp-books/The Works of Edgar Allan Poe.txt
- Expected/generated title: The Works of Edgar Allan Poe ? Volume 2 / n/a
- Expected/generated author: Edgar Allan Poe / n/a
- Author evidence: Gutenberg Author line - Author: Edgar Allan Poe
- Duplicate/near-duplicate slug check: Skipped after write-pass boundary check: the raw Volume 2 begins with THE PURLOINED LETTER, but the dry-run proposed starting at the next story, which would drop real opening collection content.
- Structure: story or titled-section headings
- Start boundary: cleaned line n/a - start at cleaned-body line 861: THE THOUSAND-AND-SECOND TALE OF SCHEHERAZADE
- End boundary: cleaned line n/a - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- First default section after: n/a (n/a words)
- Section count: 0
- Title/default-start verdict: not generated
- Author metadata verdict: not generated
- Segmentation verdict: not generated
- Preview verdict: not generated
- Startup preview valid: no
- All-main-readable-default verdict: not generated
- Final recommendation: skipped
- Remaining warnings: Skipped after write-pass boundary check: the raw Volume 2 begins with THE PURLOINED LETTER, but the dry-run proposed starting at the next story, which would drop real opening collection content.

First 5 sections:


Last 5 sections:


Supporting snippets:

- Title: Title: The Works of Edgar Allan Poe ? Volume 2
- Author: Author: Edgar Allan Poe
- Start: n/a
- End: n/a

### under-the-red-dragon

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/Under the Red Dragon.txt
- Expected/generated title: Under the Red Dragon: A Novel / Under the Red Dragon: A Novel
- Expected/generated author: James Grant / James Grant
- Author evidence: Gutenberg Author line - Author: James Grant
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: chapter-based roman numerals
- Start boundary: cleaned line 95 - start at cleaned-body line 95: CHAPTER I.--THE INVITATION.; write pass starts at first selected/default section
- End boundary: cleaned line 16802 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Chapter 1 (2162 words)
- Section count: 61
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: contents or list material must not enter default playback; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: footnotes or page markers may need cleanup before default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: footnotes or page markers detected

First 5 sections:

- chapter-001: Chapter 1 - --THE INVITATION (2162 words)
- chapter-002: Chapter 2 - --THE MOTH AND THE CANDLE (2396 words)
- chapter-003: Chapter 3 - By EXPRESS (2216 words)
- chapter-004: Chapter 4 - --WINNY AND DORA LLOYD (2420 words)
- chapter-005: Chapter 5 - --CRAIGADERYN COURT (2642 words)

Last 5 sections:

- chapter-057: Chapter 57 - --IN THE MONASTERY OF ST. GEORGE (2935 words)
- chapter-058: Chapter 58 - --HOME (1488 words)
- chapter-059: Chapter 59 - --"A DREAM WHICH WAS NOT ALL A DREAM." (1984 words)
- chapter-060: Chapter 60 - --A HONEYMOON (1784 words)
- chapter-061: Chapter 61 - --"FOR VALOUR." (2838 words)

Supporting snippets:

- Title: Title: Under the Red Dragon: A Novel
- Author: Author: James Grant
- Start: CHAPTER I.--THE INVITATION. "And _she_ is to be there--nay, is there already; so one more chance is given me to meet her. But for what?--to part again silently, and more helplessly bewitched than ever, perhaps. Ah, never will she learn to love me as I love h
- End: lery of the Guard in the Berlin _Vossische Zeitung_.] [Footnote 3: Fusileer regiments did not then wear epaulettes.] [Footnote 4: May God preserve us!] [Footnote 5: Good Lord deliver us.] THE END. ******************** BILLING, PRINTER. GUILDFORD, SURREY

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
- final cleanup should remove temporary audit scripts/reports and code bloat only after everything is stable
