# Pilot write batch 22 verification

Generated: 2026-06-21T06:57:11.917Z

## Summary

- Verified: 20
- Pass: 20
- Warn accepted: 0
- Fail: 0
- Accepted for main: 20
- Correction needed before main: 0
- Raw/generated exact: 20/20

## Shared Write Script Scope

- Classification: harmless shared implementation intentionally used by write batch 22
- Classification number: 1
- Resolution: Retain the write-12 change for this branch. The batch-22 wrapper sets MORSEWORDS_PILOT_WRITE_BATCH and imports the established shared writer; the shared diff adds batch-22 dispatch, selected slug list, backlog note, exact section count expectations, and the source-based five-part boundary plan needed for A Story of the Days to Come.
- Unrelated changes found: no

## Batch-12 Prose Restoration

- Result: pass
- Compared: 20
- Remaining raw/generated mismatches: 0
- Remaining prose omissions: 0
- Remaining missing opening-quote defects: 0

## Playwright Classification

- Clean main: 36/36 passed
- Initial write-22: 35/36 failed on exitFullscreenButton.click pointer-intercept timeout at line 1081
- Repeat write-22: 36/36 passed
- Current validation: pass: standalone Playwright 36/36
- Classification: intermittent fullscreen test/UI issue not consistently reproduced, with no evidence it was caused by write batch 22
- Fullscreen UI modified here: no

## Special Focus

- Exact title/name spellings: Celephaïs, Nyarlathotep, Sarnath, The Unnamable, The White Ship, The Moon-Bog, and all exact-title risk cases preserve the source-backed generated spelling/casing policy.
- Wells metadata: A Slip Under the Microscope preserves H. G. Wells from the visible byline; A Story of the Days to Come preserves Herbert George Wells from the Gutenberg Author line. Both Wells bodies preserve openings/endings after normalization.
- Lovecraft metadata and source wrappers: 17/17 Lovecraft stories preserve H. P. Lovecraft source-backed metadata and exclude Lovecraft site headers, parent collection material, copyright notes, and navigation text from default playback.
- The Shifty Lad metadata: The Shifty Lad preserves the individual tale title and source-backed Andrew Lang author/editor evidence; it does not inherit The Lilac Fairy Book as the generated story title.
- Cleanup/prose preservation: 20/20 sanitized raw bodies match every generated body copy character-for-character (20/20 exact); no cleanup rule removed unusual Lovecraft diction, Wells terms, dialogue, punctuation, or ending sentences.

## Books

### a-slip-under-the-microscope

- Status: pass
- Generated output inspected: app/client/assets/books/generated/a-slip-under-the-microscope/manifest.json, app/client/assets/books/generated/a-slip-under-the-microscope/cleaned_book.json, app/client/assets/books/generated/a-slip-under-the-microscope/processed_book.json, app/client/assets/books/generated/a-slip-under-the-microscope/rights_report.json, app/client/assets/books/generated/a-slip-under-the-microscope/processing_notes.md, app/client/assets/books/generated/a-slip-under-the-microscope/sections/chapter-001.json
- Preview inspected: public/book-previews/a-slip-under-the-microscope.preview.json
- Title: pass - Individual story/tale title preserved as "A Slip Under the Microscope" and parent collection title "none" is not default playback.
- Creator metadata: pass - Wells author metadata is source-backed; generated authors are H. G. Wells; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based (1 section) and not arbitrary.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from the first default readable section, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: A SLIP UNDER THE MICROSCOPE
- Metadata evidence: H. G. WELLS; author as identified by the source
- Raw/generated start: Outside the laboratory windows was a watery-grey fog, and within a close warmth and the yellow light of the green-shaded gas lamps that stood two to each table down its narrow length. On each table stood a couple of g... / Outside the laboratory windows was a watery-grey fog, and within a close warmth and the yellow light of the green-shaded gas lamps that stood two to each table down its narrow length. On each table stood a couple of g...
- Raw/generated end: ...own place. “It’s true, all the same,” said the girl in spectacles, peering and smiling at Wedderburn. But Wedderburn did not answer her. She was indeed one of those people who seem destined to make unanswered remarks. / ...own place. “It’s true, all the same,” said the girl in spectacles, peering and smiling at Wedderburn. But Wedderburn did not answer her. She was indeed one of those people who seem destined to make unanswered remarks.
- Preview start: Outside the laboratory windows was a watery-grey fog, and within a close warmth and the yellow light of the green-shaded gas lamps that stood two to each table down its narrow length. On each table stood a couple of g...

### a-story-of-the-days-to-come

- Status: pass
- Generated output inspected: app/client/assets/books/generated/a-story-of-the-days-to-come/manifest.json, app/client/assets/books/generated/a-story-of-the-days-to-come/cleaned_book.json, app/client/assets/books/generated/a-story-of-the-days-to-come/processed_book.json, app/client/assets/books/generated/a-story-of-the-days-to-come/rights_report.json, app/client/assets/books/generated/a-story-of-the-days-to-come/processing_notes.md, app/client/assets/books/generated/a-story-of-the-days-to-come/sections/chapter-001.json, app/client/assets/books/generated/a-story-of-the-days-to-come/sections/chapter-002.json, app/client/assets/books/generated/a-story-of-the-days-to-come/sections/chapter-003.json, app/client/assets/books/generated/a-story-of-the-days-to-come/sections/chapter-004.json, app/client/assets/books/generated/a-story-of-the-days-to-come/sections/chapter-005.json
- Preview inspected: public/book-previews/a-story-of-the-days-to-come.preview.json
- Title: pass - Individual story/tale title preserved as "A Story of the Days to Come" and parent collection title "Tales of Space and Time" is not default playback.
- Creator metadata: pass - Wells author metadata is source-backed; generated authors are Herbert George Wells; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based (5 sections) and not arbitrary.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from the first default readable section, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: A STORY OF THE DAYS TO COME
- Metadata evidence: Author: Herbert George Wells; author as identified by the source
- Raw/generated start: I—THE CURE FOR LOVE The excellent Mr. Morris was an Englishman, and he lived in the days of Queen Victoria the Good. He was a prosperous and very sensible man; he read the Times and went to church, and as he grew towa... / I—THE CURE FOR LOVE The excellent Mr. Morris was an Englishman, and he lived in the days of Queen Victoria the Good. He was a prosperous and very sensible man; he read the Times and went to church, and as he grew towa...
- Raw/generated end: ...ut upon the spacious gold-woven view. So they sat as the sun went down. Until presently Elizabeth shivered. Denton recalled himself abruptly from these spacious issues of his leisure, and went in to fetch her a shawl. / ...ut upon the spacious gold-woven view. So they sat as the sun went down. Until presently Elizabeth shivered. Denton recalled himself abruptly from these spacious issues of his leisure, and went in to fetch her a shawl.
- Preview start: I—THE CURE FOR LOVE The excellent Mr. Morris was an Englishman, and he lived in the days of Queen Victoria the Good. He was a prosperous and very sensible man; he read the Times and went to church, and as he grew towa...

### beyond-the-wall-of-sleep

- Status: pass
- Generated output inspected: app/client/assets/books/generated/beyond-the-wall-of-sleep/manifest.json, app/client/assets/books/generated/beyond-the-wall-of-sleep/cleaned_book.json, app/client/assets/books/generated/beyond-the-wall-of-sleep/processed_book.json, app/client/assets/books/generated/beyond-the-wall-of-sleep/rights_report.json, app/client/assets/books/generated/beyond-the-wall-of-sleep/processing_notes.md, app/client/assets/books/generated/beyond-the-wall-of-sleep/sections/chapter-001.json
- Preview inspected: public/book-previews/beyond-the-wall-of-sleep.preview.json
- Title: pass - Individual story/tale title preserved as "Beyond the Wall of Sleep" and parent collection title "none" is not default playback.
- Creator metadata: pass - H. P. Lovecraft author metadata is source-backed; generated authors are H. P. Lovecraft; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based (1 section) and not arbitrary.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from the first default readable section, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: Beyond the Wall of Sleep
- Metadata evidence: By H. P. Lovecraft; author as identified by the source
- Raw/generated start: “I have an exposition of sleep come upon me.” —Shakespeare. I have frequently wondered if the majority of mankind ever pause to reflect upon the occasionally titanic significance of dreams, and of the obscure world to... / “I have an exposition of sleep come upon me.” —Shakespeare. I have frequently wondered if the majority of mankind ever pause to reflect upon the occasionally titanic significance of dreams, and of the obscure world to...
- Raw/generated end: ...oint before. Within twenty-four hours the stranger had become so bright that it outshone Capella. In a week or two it had visibly faded, and in the course of a few months it was hardly discernible with the naked eye.” / ...oint before. Within twenty-four hours the stranger had become so bright that it outshone Capella. In a week or two it had visibly faded, and in the course of a few months it was hardly discernible with the naked eye.”
- Preview start: “I have an exposition of sleep come upon me.” —Shakespeare. I have frequently wondered if the majority of mankind ever pause to reflect upon the occasionally titanic significance of dreams, and of the obscure world to...

### celephais

- Status: pass
- Generated output inspected: app/client/assets/books/generated/celephais/manifest.json, app/client/assets/books/generated/celephais/cleaned_book.json, app/client/assets/books/generated/celephais/processed_book.json, app/client/assets/books/generated/celephais/rights_report.json, app/client/assets/books/generated/celephais/processing_notes.md, app/client/assets/books/generated/celephais/sections/chapter-001.json
- Preview inspected: public/book-previews/celephais.preview.json
- Title: pass - Individual story/tale title preserved as "Celephaïs" and parent collection title "none" is not default playback.
- Creator metadata: pass - H. P. Lovecraft author metadata is source-backed; generated authors are H. P. Lovecraft; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based (1 section) and not arbitrary.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from the first default readable section, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: Celephaïs
- Metadata evidence: By H. P. Lovecraft; author as identified by the source
- Raw/generated start: In a dream Kuranes saw the city in the valley, and the sea-coast beyond, and the snowy peak overlooking the sea, and the gaily painted galleys that sail out of the harbour toward the distant regions where the sea meet... / In a dream Kuranes saw the city in the valley, and the sea-coast beyond, and the snowy peak overlooking the sea, and the gaily painted galleys that sail out of the harbour toward the distant regions where the sea meet...
- Raw/generated end: ...deserted village at dawn; played mockingly, and cast it upon the rocks by ivy-covered Trevor Towers, where a notably fat and especially offensive millionaire brewer enjoys the purchased atmosphere of extinct nobility. / ...deserted village at dawn; played mockingly, and cast it upon the rocks by ivy-covered Trevor Towers, where a notably fat and especially offensive millionaire brewer enjoys the purchased atmosphere of extinct nobility.
- Preview start: In a dream Kuranes saw the city in the valley, and the sea-coast beyond, and the snowy peak overlooking the sea, and the gaily painted galleys that sail out of the harbour toward the distant regions where the sea meet...

### hypnos

- Status: pass
- Generated output inspected: app/client/assets/books/generated/hypnos/manifest.json, app/client/assets/books/generated/hypnos/cleaned_book.json, app/client/assets/books/generated/hypnos/processed_book.json, app/client/assets/books/generated/hypnos/rights_report.json, app/client/assets/books/generated/hypnos/processing_notes.md, app/client/assets/books/generated/hypnos/sections/chapter-001.json
- Preview inspected: public/book-previews/hypnos.preview.json
- Title: pass - Individual story/tale title preserved as "Hypnos" and parent collection title "none" is not default playback.
- Creator metadata: pass - H. P. Lovecraft author metadata is source-backed; generated authors are H. P. Lovecraft; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based (1 section) and not arbitrary.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from the first default readable section, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: Hypnos
- Metadata evidence: By H. P. Lovecraft; author as identified by the source
- Raw/generated start: “Apropos of sleep, that sinister adventure of all our nights, we may say that men go to bed daily with an audacity that would be incomprehensible if we did not know that it is the result of ignorance of the danger.” —... / “Apropos of sleep, that sinister adventure of all our nights, we may say that men go to bed daily with an audacity that would be incomprehensible if we did not know that it is the result of ignorance of the danger.” —...
- Raw/generated end: ...w, and dense locks waving and poppy-crowned. They say that that haunting memory-face is modelled from my own, as it was at twenty-five, but upon the marble base is carven a single name in the letters of Attica—’ΥΠΝΟΣ. / ...w, and dense locks waving and poppy-crowned. They say that that haunting memory-face is modelled from my own, as it was at twenty-five, but upon the marble base is carven a single name in the letters of Attica—’ΥΠΝΟΣ.
- Preview start: “Apropos of sleep, that sinister adventure of all our nights, we may say that men go to bed daily with an audacity that would be incomprehensible if we did not know that it is the result of ignorance of the danger.” —...

### ibid

- Status: pass
- Generated output inspected: app/client/assets/books/generated/ibid/manifest.json, app/client/assets/books/generated/ibid/cleaned_book.json, app/client/assets/books/generated/ibid/processed_book.json, app/client/assets/books/generated/ibid/rights_report.json, app/client/assets/books/generated/ibid/processing_notes.md, app/client/assets/books/generated/ibid/sections/chapter-001.json
- Preview inspected: public/book-previews/ibid.preview.json
- Title: pass - Individual story/tale title preserved as "Ibid" and parent collection title "none" is not default playback.
- Creator metadata: pass - H. P. Lovecraft author metadata is source-backed; generated authors are H. P. Lovecraft; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based (1 section) and not arbitrary.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from the first default readable section, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: Ibid
- Metadata evidence: By H. P. Lovecraft; author as identified by the source
- Raw/generated start: The erroneous idea that Ibid is the author of the Lives is so frequently met with, even among those pretending to a degree of culture, that it is worth correcting. It should be a matter of general knowledge that Cf. i... / The erroneous idea that Ibid is the author of the Lives is so frequently met with, even among those pretending to a degree of culture, that it is worth correcting. It should be a matter of general knowledge that Cf. i...
- Raw/generated end: ...llowing Procopius, Goth. x.y.z. 4 Following Jornandes, Codex Murat. xxj. 4144. 5 After Pagi, 50–50. 6 Not till the appearance of von Schweinkopf’s work in 1797 were St. Ibid and the rhetorician properly re-identified. / ...llowing Procopius, Goth. x.y.z. 4 Following Jornandes, Codex Murat. xxj. 4144. 5 After Pagi, 50–50. 6 Not till the appearance of von Schweinkopf’s work in 1797 were St. Ibid and the rhetorician properly re-identified.
- Preview start: The erroneous idea that Ibid is the author of the Lives is so frequently met with, even among those pretending to a degree of culture, that it is worth correcting. It should be a matter of general knowledge that Cf. i...

### in-the-vault

- Status: pass
- Generated output inspected: app/client/assets/books/generated/in-the-vault/manifest.json, app/client/assets/books/generated/in-the-vault/cleaned_book.json, app/client/assets/books/generated/in-the-vault/processed_book.json, app/client/assets/books/generated/in-the-vault/rights_report.json, app/client/assets/books/generated/in-the-vault/processing_notes.md, app/client/assets/books/generated/in-the-vault/sections/chapter-001.json
- Preview inspected: public/book-previews/in-the-vault.preview.json
- Title: pass - Individual story/tale title preserved as "In the Vault" and parent collection title "none" is not default playback.
- Creator metadata: pass - H. P. Lovecraft author metadata is source-backed; generated authors are H. P. Lovecraft; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based (1 section) and not arbitrary.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from the first default readable section, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: In the Vault
- Metadata evidence: By H. P. Lovecraft; author as identified by the source
- Raw/generated start: There is nothing more absurd, as I view it, than that conventional association of the homely and the wholesome which seems to pervade the psychology of the multitude. Mention a bucolic Yankee setting, a bungling and t... / There is nothing more absurd, as I view it, than that conventional association of the homely and the wholesome which seems to pervade the psychology of the multitude. Mention a bucolic Yankee setting, a bungling and t...
- Raw/generated end: ...ne thing too much here. An eye for an eye! Great heavens, Birch, but you got what you deserved. The skull turned my stomach, but the other was worse—those ankles cut neatly off to fit Matt Fenner’s cast-aside coffin!” / ...ne thing too much here. An eye for an eye! Great heavens, Birch, but you got what you deserved. The skull turned my stomach, but the other was worse—those ankles cut neatly off to fit Matt Fenner’s cast-aside coffin!”
- Preview start: There is nothing more absurd, as I view it, than that conventional association of the homely and the wholesome which seems to pervade the psychology of the multitude. Mention a bucolic Yankee setting, a bungling and t...

### nyarlathotep

- Status: pass
- Generated output inspected: app/client/assets/books/generated/nyarlathotep/manifest.json, app/client/assets/books/generated/nyarlathotep/cleaned_book.json, app/client/assets/books/generated/nyarlathotep/processed_book.json, app/client/assets/books/generated/nyarlathotep/rights_report.json, app/client/assets/books/generated/nyarlathotep/processing_notes.md, app/client/assets/books/generated/nyarlathotep/sections/chapter-001.json
- Preview inspected: public/book-previews/nyarlathotep.preview.json
- Title: pass - Individual story/tale title preserved as "Nyarlathotep" and parent collection title "none" is not default playback.
- Creator metadata: pass - H. P. Lovecraft author metadata is source-backed; generated authors are H. P. Lovecraft; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based (1 section) and not arbitrary.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from the first default readable section, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: Nyarlathotep
- Metadata evidence: By H. P. Lovecraft; author as identified by the source
- Raw/generated start: Nyarlathotep . . . the crawling chaos . . . I am the last . . . I will tell the audient void. . . . I do not recall distinctly when it began, but it was months ago. The general tension was horrible. To a season of pol... / Nyarlathotep . . . the crawling chaos . . . I am the last . . . I will tell the audient void. . . . I do not recall distinctly when it began, but it was months ago. The general tension was horrible. To a season of pol...
- Raw/generated end: ...ghted chambers beyond Time; the detestable pounding and piping whereunto dance slowly, awkwardly, and absurdly the gigantic, tenebrous ultimate gods—the blind, voiceless, mindless gargoyles whose soul is Nyarlathotep. / ...ghted chambers beyond Time; the detestable pounding and piping whereunto dance slowly, awkwardly, and absurdly the gigantic, tenebrous ultimate gods—the blind, voiceless, mindless gargoyles whose soul is Nyarlathotep.
- Preview start: Nyarlathotep . . . the crawling chaos . . . I am the last . . . I will tell the audient void. . . . I do not recall distinctly when it began, but it was months ago. The general tension was horrible. To a season of pol...

### polaris

- Status: pass
- Generated output inspected: app/client/assets/books/generated/polaris/manifest.json, app/client/assets/books/generated/polaris/cleaned_book.json, app/client/assets/books/generated/polaris/processed_book.json, app/client/assets/books/generated/polaris/rights_report.json, app/client/assets/books/generated/polaris/processing_notes.md, app/client/assets/books/generated/polaris/sections/chapter-001.json
- Preview inspected: public/book-previews/polaris.preview.json
- Title: pass - Individual story/tale title preserved as "Polaris" and parent collection title "none" is not default playback.
- Creator metadata: pass - H. P. Lovecraft author metadata is source-backed; generated authors are H. P. Lovecraft; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based (1 section) and not arbitrary.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from the first default readable section, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: Polaris
- Metadata evidence: By H. P. Lovecraft; author as identified by the source
- Raw/generated start: Into the north window of my chamber glows the Pole Star with uncanny light. All through the long hellish hours of blackness it shines there. And in the autumn of the year, when the winds from the north curse and whine... / Into the north window of my chamber glows the Pole Star with uncanny light. All through the long hellish hours of blackness it shines there. And in the autumn of the year, when the winds from the north curse and whine...
- Raw/generated end: ...ole Star, evil and monstrous, leers down from the black vault, winking hideously like an insane watching eye which strives to convey some strange message, yet recalls nothing save that it once had a message to convey. / ...ole Star, evil and monstrous, leers down from the black vault, winking hideously like an insane watching eye which strives to convey some strange message, yet recalls nothing save that it once had a message to convey.
- Preview start: Into the north window of my chamber glows the Pole Star with uncanny light. All through the long hellish hours of blackness it shines there. And in the autumn of the year, when the winds from the north curse and whine...

### the-alchemist

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-alchemist/manifest.json, app/client/assets/books/generated/the-alchemist/cleaned_book.json, app/client/assets/books/generated/the-alchemist/processed_book.json, app/client/assets/books/generated/the-alchemist/rights_report.json, app/client/assets/books/generated/the-alchemist/processing_notes.md, app/client/assets/books/generated/the-alchemist/sections/chapter-001.json
- Preview inspected: public/book-previews/the-alchemist.preview.json
- Title: pass - Individual story/tale title preserved as "The Alchemist" and parent collection title "none" is not default playback.
- Creator metadata: pass - H. P. Lovecraft author metadata is source-backed; generated authors are H. P. Lovecraft; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based (1 section) and not arbitrary.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from the first default readable section, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: The Alchemist
- Metadata evidence: By H. P. Lovecraft; author as identified by the source
- Raw/generated start: High up, crowning the grassy summit of a swelling mound whose sides are wooded near the base with the gnarled trees of the primeval forest, stands the old chateau of my ancestors. For centuries its lofty battlements h... / High up, crowning the grassy summit of a swelling mound whose sides are wooded near the base with the gnarled trees of the primeval forest, stands the old chateau of my ancestors. For centuries its lofty battlements h...
- Raw/generated end: ...t told you of the great elixir of eternal life? Know you not how the secret of Alchemy was solved? I tell you, it is I! I! I! that have lived for six hundred years to maintain my revenge, FOR I AM CHARLES LE SORCIER!” / ...t told you of the great elixir of eternal life? Know you not how the secret of Alchemy was solved? I tell you, it is I! I! I! that have lived for six hundred years to maintain my revenge, FOR I AM CHARLES LE SORCIER!”
- Preview start: High up, crowning the grassy summit of a swelling mound whose sides are wooded near the base with the gnarled trees of the primeval forest, stands the old chateau of my ancestors. For centuries its lofty battlements h...

### the-beast-in-the-cave

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-beast-in-the-cave/manifest.json, app/client/assets/books/generated/the-beast-in-the-cave/cleaned_book.json, app/client/assets/books/generated/the-beast-in-the-cave/processed_book.json, app/client/assets/books/generated/the-beast-in-the-cave/rights_report.json, app/client/assets/books/generated/the-beast-in-the-cave/processing_notes.md, app/client/assets/books/generated/the-beast-in-the-cave/sections/chapter-001.json
- Preview inspected: public/book-previews/the-beast-in-the-cave.preview.json
- Title: pass - Individual story/tale title preserved as "The Beast in the Cave" and parent collection title "none" is not default playback.
- Creator metadata: pass - H. P. Lovecraft author metadata is source-backed; generated authors are H. P. Lovecraft; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based (1 section) and not arbitrary.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from the first default readable section, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: The Beast in the Cave
- Metadata evidence: By H. P. Lovecraft; author as identified by the source
- Raw/generated start: The horrible conclusion which had been gradually obtruding itself upon my confused and reluctant mind was now an awful certainty. I was lost, completely, hopelessly lost in the vast and labyrinthine recesses of the Ma... / The horrible conclusion which had been gradually obtruding itself upon my confused and reluctant mind was now an awful certainty. I was lost, completely, hopelessly lost in the vast and labyrinthine recesses of the Ma...
- Raw/generated end: ...e sounds uttered by the stricken figure that lay stretched out on the limestone had told us the awesome truth. The creature I had killed, the strange beast of the unfathomed cave was, or had at one time been, a MAN!!! / ...e sounds uttered by the stricken figure that lay stretched out on the limestone had told us the awesome truth. The creature I had killed, the strange beast of the unfathomed cave was, or had at one time been, a MAN!!!
- Preview start: The horrible conclusion which had been gradually obtruding itself upon my confused and reluctant mind was now an awful certainty. I was lost, completely, hopelessly lost in the vast and labyrinthine recesses of the Ma...

### the-doom-that-came-to-sarnath

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-doom-that-came-to-sarnath/manifest.json, app/client/assets/books/generated/the-doom-that-came-to-sarnath/cleaned_book.json, app/client/assets/books/generated/the-doom-that-came-to-sarnath/processed_book.json, app/client/assets/books/generated/the-doom-that-came-to-sarnath/rights_report.json, app/client/assets/books/generated/the-doom-that-came-to-sarnath/processing_notes.md, app/client/assets/books/generated/the-doom-that-came-to-sarnath/sections/chapter-001.json
- Preview inspected: public/book-previews/the-doom-that-came-to-sarnath.preview.json
- Title: pass - Individual story/tale title preserved as "The Doom That Came to Sarnath" and parent collection title "none" is not default playback.
- Creator metadata: pass - H. P. Lovecraft author metadata is source-backed; generated authors are H. P. Lovecraft; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based (1 section) and not arbitrary.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from the first default readable section, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: The Doom That Came to Sarnath
- Metadata evidence: By H. P. Lovecraft; author as identified by the source
- Raw/generated start: There is in the land of Mnar a vast still lake that is fed by no stream and out of which no stream flows. Ten thousand years ago there stood by its shore the mighty city of Sarnath, but Sarnath stands there no more. I... / There is in the land of Mnar a vast still lake that is fed by no stream and out of which no stream flows. Ten thousand years ago there stood by its shore the mighty city of Sarnath, but Sarnath stands there no more. I...
- Raw/generated end: ...oated with seaweed and chiselled in the likeness of Bokrug, the great water-lizard. That idol, enshrined in the high temple at Ilarnek, was subsequently worshipped beneath the gibbous moon throughout the land of Mnar. / ...oated with seaweed and chiselled in the likeness of Bokrug, the great water-lizard. That idol, enshrined in the high temple at Ilarnek, was subsequently worshipped beneath the gibbous moon throughout the land of Mnar.
- Preview start: There is in the land of Mnar a vast still lake that is fed by no stream and out of which no stream flows. Ten thousand years ago there stood by its shore the mighty city of Sarnath, but Sarnath stands there no more. I...

### the-moon-bog

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-moon-bog/manifest.json, app/client/assets/books/generated/the-moon-bog/cleaned_book.json, app/client/assets/books/generated/the-moon-bog/processed_book.json, app/client/assets/books/generated/the-moon-bog/rights_report.json, app/client/assets/books/generated/the-moon-bog/processing_notes.md, app/client/assets/books/generated/the-moon-bog/sections/chapter-001.json
- Preview inspected: public/book-previews/the-moon-bog.preview.json
- Title: pass - Individual story/tale title preserved as "The Moon-Bog" and parent collection title "none" is not default playback.
- Creator metadata: pass - H. P. Lovecraft author metadata is source-backed; generated authors are H. P. Lovecraft; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based (1 section) and not arbitrary.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from the first default readable section, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: The Moon-Bog
- Metadata evidence: By H. P. Lovecraft; author as identified by the source
- Raw/generated start: Somewhere, to what remote and fearsome region I know not, Denys Barry has gone. I was with him the last night he lived among men, and heard his screams when the thing came to him; but all the peasants and police in Co... / Somewhere, to what remote and fearsome region I know not, Denys Barry has gone. I was with him the last night he lived among men, and heard his screams when the thing came to him; but all the peasants and police in Co...
- Raw/generated end: ... contorted shadow struggling as if drawn by unseen daemons. Crazed as I was, I saw in that awful shadow a monstrous resemblance—a nauseous, unbelievable caricature—a blasphemous effigy of him who had been Denys Barry. / ... contorted shadow struggling as if drawn by unseen daemons. Crazed as I was, I saw in that awful shadow a monstrous resemblance—a nauseous, unbelievable caricature—a blasphemous effigy of him who had been Denys Barry.
- Preview start: Somewhere, to what remote and fearsome region I know not, Denys Barry has gone. I was with him the last night he lived among men, and heard his screams when the thing came to him; but all the peasants and police in Co...

### the-outsider

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-outsider/manifest.json, app/client/assets/books/generated/the-outsider/cleaned_book.json, app/client/assets/books/generated/the-outsider/processed_book.json, app/client/assets/books/generated/the-outsider/rights_report.json, app/client/assets/books/generated/the-outsider/processing_notes.md, app/client/assets/books/generated/the-outsider/sections/chapter-001.json
- Preview inspected: public/book-previews/the-outsider.preview.json
- Title: pass - Individual story/tale title preserved as "The Outsider" and parent collection title "none" is not default playback.
- Creator metadata: pass - H. P. Lovecraft author metadata is source-backed; generated authors are H. P. Lovecraft; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based (1 section) and not arbitrary.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from the first default readable section, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: The Outsider
- Metadata evidence: By H. P. Lovecraft; author as identified by the source
- Raw/generated start: That night the Baron dreamt of many a woe; And all his warrior-guests, with shade and form Of witch, and demon, and large coffin-worm, Were long be-nightmared. —Keats. Unhappy is he to whom the memories of childhood b... / That night the Baron dreamt of many a woe; And all his warrior-guests, with shade and form Of witch, and demon, and large coffin-worm, Were long be-nightmared. —Keats. Unhappy is he to whom the memories of childhood b...
- Raw/generated end: ...those who are still men. This I have known ever since I stretched out my fingers to the abomination within that great gilded frame; stretched out my fingers and touched a cold and unyielding surface of polished glass. / ...those who are still men. This I have known ever since I stretched out my fingers to the abomination within that great gilded frame; stretched out my fingers and touched a cold and unyielding surface of polished glass.
- Preview start: That night the Baron dreamt of many a woe; And all his warrior-guests, with shade and form Of witch, and demon, and large coffin-worm, Were long be-nightmared. —Keats. Unhappy is he to whom the memories of childhood b...

### the-shifty-lad

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-shifty-lad/manifest.json, app/client/assets/books/generated/the-shifty-lad/cleaned_book.json, app/client/assets/books/generated/the-shifty-lad/processed_book.json, app/client/assets/books/generated/the-shifty-lad/rights_report.json, app/client/assets/books/generated/the-shifty-lad/processing_notes.md, app/client/assets/books/generated/the-shifty-lad/sections/chapter-001.json
- Preview inspected: public/book-previews/the-shifty-lad.preview.json
- Title: pass - Individual story/tale title preserved as "The Shifty Lad" and parent collection title "The Lilac Fairy Book" is not default playback.
- Creator metadata: pass - author/editor metadata is source-backed; generated authors are Andrew Lang; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based (1 section) and not arbitrary.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from the first default readable section, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: The Shifty Lad
- Metadata evidence: Author: Andrew Lang; Edited by Andrew Lang; editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)
- Raw/generated start: In the land of Erin there dwelt long ago a widow who had an only son. He was a clever boy, so she saved up enough money to send him to school, and, as soon as he was old enough, to apprentice him to any trade that he ... / In the land of Erin there dwelt long ago a widow who had an only son. He was a clever boy, so she saved up enough money to send him to school, and, as soon as he was old enough, to apprentice him to any trade that he ...
- Raw/generated end: ...ace was burning. The princess turned round with a start, and let go her handkerchief, and the Shifty Lad fell, and struck his head on a stone, and died in an instant. So his mother’s prophecy had come true, after all. / ...ace was burning. The princess turned round with a start, and let go her handkerchief, and the Shifty Lad fell, and struck his head on a stone, and died in an instant. So his mother’s prophecy had come true, after all.
- Preview start: In the land of Erin there dwelt long ago a widow who had an only son. He was a clever boy, so she saved up enough money to send him to school, and, as soon as he was old enough, to apprentice him to any trade that he ...

### the-temple

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-temple/manifest.json, app/client/assets/books/generated/the-temple/cleaned_book.json, app/client/assets/books/generated/the-temple/processed_book.json, app/client/assets/books/generated/the-temple/rights_report.json, app/client/assets/books/generated/the-temple/processing_notes.md, app/client/assets/books/generated/the-temple/sections/chapter-001.json
- Preview inspected: public/book-previews/the-temple.preview.json
- Title: pass - Individual story/tale title preserved as "The Temple" and parent collection title "none" is not default playback.
- Creator metadata: pass - H. P. Lovecraft author metadata is source-backed; generated authors are H. P. Lovecraft; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based (1 section) and not arbitrary.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from the first default readable section, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: The Temple
- Metadata evidence: By H. P. Lovecraft; author as identified by the source
- Raw/generated start: (Manuscript found on the coast of Yucatan.) On August 20, 1917, I, Karl Heinrich, Graf von Altberg-Ehrenstein, Lieutenant-Commander in the Imperial German Navy and in charge of the submarine U-29, deposit this bottle ... / (Manuscript found on the coast of Yucatan.) On August 20, 1917, I, Karl Heinrich, Graf von Altberg-Ehrenstein, Lieutenant-Commander in the Imperial German Navy and in charge of the submarine U-29, deposit this bottle ...
- Raw/generated end: ...which I hear as I write comes only from my own weakening brain. So I will carefully don my diving suit and walk boldly up the steps into that primal shrine; that silent secret of unfathomed waters and uncounted years. / ...which I hear as I write comes only from my own weakening brain. So I will carefully don my diving suit and walk boldly up the steps into that primal shrine; that silent secret of unfathomed waters and uncounted years.
- Preview start: (Manuscript found on the coast of Yucatan.) On August 20, 1917, I, Karl Heinrich, Graf von Altberg-Ehrenstein, Lieutenant-Commander in the Imperial German Navy and in charge of the submarine U-29, deposit this bottle ...

### the-tomb

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-tomb/manifest.json, app/client/assets/books/generated/the-tomb/cleaned_book.json, app/client/assets/books/generated/the-tomb/processed_book.json, app/client/assets/books/generated/the-tomb/rights_report.json, app/client/assets/books/generated/the-tomb/processing_notes.md, app/client/assets/books/generated/the-tomb/sections/chapter-001.json
- Preview inspected: public/book-previews/the-tomb.preview.json
- Title: pass - Individual story/tale title preserved as "The Tomb" and parent collection title "none" is not default playback.
- Creator metadata: pass - H. P. Lovecraft author metadata is source-backed; generated authors are H. P. Lovecraft; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based (1 section) and not arbitrary.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from the first default readable section, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: The Tomb
- Metadata evidence: By H. P. Lovecraft; author as identified by the source
- Raw/generated start: “Sedibus ut saltem placidis in morte quiescam.” —Virgil. In relating the circumstances which have led to my confinement within this refuge for the demented, I am aware that my present position will create a natural do... / “Sedibus ut saltem placidis in morte quiescam.” —Virgil. In relating the circumstances which have led to my confinement within this refuge for the demented, I am aware that my present position will create a natural do...
- Raw/generated end: ... a lantern into the murky depths. On a slab in an alcove he found an old but empty coffin whose tarnished plate bears the single word “Jervas”. In that coffin and in that vault they have promised me I shall be buried. / ... a lantern into the murky depths. On a slab in an alcove he found an old but empty coffin whose tarnished plate bears the single word “Jervas”. In that coffin and in that vault they have promised me I shall be buried.
- Preview start: “Sedibus ut saltem placidis in morte quiescam.” —Virgil. In relating the circumstances which have led to my confinement within this refuge for the demented, I am aware that my present position will create a natural do...

### the-tree

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-tree/manifest.json, app/client/assets/books/generated/the-tree/cleaned_book.json, app/client/assets/books/generated/the-tree/processed_book.json, app/client/assets/books/generated/the-tree/rights_report.json, app/client/assets/books/generated/the-tree/processing_notes.md, app/client/assets/books/generated/the-tree/sections/chapter-001.json
- Preview inspected: public/book-previews/the-tree.preview.json
- Title: pass - Individual story/tale title preserved as "The Tree" and parent collection title "none" is not default playback.
- Creator metadata: pass - H. P. Lovecraft author metadata is source-backed; generated authors are H. P. Lovecraft; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based (1 section) and not arbitrary.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from the first default readable section, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: The Tree
- Metadata evidence: By H. P. Lovecraft; author as identified by the source
- Raw/generated start: “Fata viam invenient.” On a verdant slope of Mount Maenalus, in Arcadia, there stands an olive grove about the ruins of a villa. Close by is a tomb, once beautiful with the sublimest sculptures, but now fallen into as... / “Fata viam invenient.” On a verdant slope of Mount Maenalus, in Arcadia, there stands an olive grove about the ruins of a villa. Close by is a tomb, once beautiful with the sublimest sculptures, but now fallen into as...
- Raw/generated end: ...l stands, as does the tree growing out of the tomb of Kalos, and the old bee-keeper told me that sometimes the boughs whisper to one another in the night-wind, saying over and over again, “Οἶδα! Οἶδα!—I know! I know!” / ...l stands, as does the tree growing out of the tomb of Kalos, and the old bee-keeper told me that sometimes the boughs whisper to one another in the night-wind, saying over and over again, “Οἶδα! Οἶδα!—I know! I know!”
- Preview start: “Fata viam invenient.” On a verdant slope of Mount Maenalus, in Arcadia, there stands an olive grove about the ruins of a villa. Close by is a tomb, once beautiful with the sublimest sculptures, but now fallen into as...

### the-unnamable

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-unnamable/manifest.json, app/client/assets/books/generated/the-unnamable/cleaned_book.json, app/client/assets/books/generated/the-unnamable/processed_book.json, app/client/assets/books/generated/the-unnamable/rights_report.json, app/client/assets/books/generated/the-unnamable/processing_notes.md, app/client/assets/books/generated/the-unnamable/sections/chapter-001.json
- Preview inspected: public/book-previews/the-unnamable.preview.json
- Title: pass - Individual story/tale title preserved as "The Unnamable" and parent collection title "none" is not default playback.
- Creator metadata: pass - H. P. Lovecraft author metadata is source-backed; generated authors are H. P. Lovecraft; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based (1 section) and not arbitrary.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from the first default readable section, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: The Unnamable
- Metadata evidence: By H. P. Lovecraft; author as identified by the source
- Raw/generated start: We were sitting on a dilapidated seventeenth-century tomb in the late afternoon of an autumn day at the old burying-ground in Arkham, and speculating about the unnamable. Looking toward the giant willow in the centre ... / We were sitting on a dilapidated seventeenth-century tomb in the late afternoon of an autumn day at the old burying-ground in Arkham, and speculating about the unnamable. Looking toward the giant willow in the centre ...
- Raw/generated end: ...t was everywhere—a gelatin—a slime—yet it had shapes, a thousand shapes of horror beyond all memory. There were eyes—and a blemish. It was the pit—the maelstrom—the ultimate abomination. Carter, it was the unnamable!” / ...t was everywhere—a gelatin—a slime—yet it had shapes, a thousand shapes of horror beyond all memory. There were eyes—and a blemish. It was the pit—the maelstrom—the ultimate abomination. Carter, it was the unnamable!”
- Preview start: We were sitting on a dilapidated seventeenth-century tomb in the late afternoon of an autumn day at the old burying-ground in Arkham, and speculating about the unnamable. Looking toward the giant willow in the centre ...

### the-white-ship

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-white-ship/manifest.json, app/client/assets/books/generated/the-white-ship/cleaned_book.json, app/client/assets/books/generated/the-white-ship/processed_book.json, app/client/assets/books/generated/the-white-ship/rights_report.json, app/client/assets/books/generated/the-white-ship/processing_notes.md, app/client/assets/books/generated/the-white-ship/sections/chapter-001.json
- Preview inspected: public/book-previews/the-white-ship.preview.json
- Title: pass - Individual story/tale title preserved as "The White Ship" and parent collection title "none" is not default playback.
- Creator metadata: pass - H. P. Lovecraft author metadata is source-backed; generated authors are H. P. Lovecraft; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based (1 section) and not arbitrary.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from the first default readable section, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: The White Ship
- Metadata evidence: By H. P. Lovecraft; author as identified by the source
- Raw/generated start: I am Basil Elton, keeper of the North Point light that my father and grandfather kept before me. Far from the shore stands the grey lighthouse, above sunken slimy rocks that are seen when the tide is low, but unseen w... / I am Basil Elton, keeper of the North Point light that my father and grandfather kept before me. Far from the shore stands the grey lighthouse, above sunken slimy rocks that are seen when the tide is low, but unseen w...
- Raw/generated end: ...the wave-tips or of the mountain snow. And thereafter the ocean told me its secrets no more; and though many times since has the moon shone full and high in the heavens, the White Ship from the South came never again. / ...the wave-tips or of the mountain snow. And thereafter the ocean told me its secrets no more; and though many times since has the moon shone full and high in the heavens, the White Ship from the South came never again.
- Preview start: I am Basil Elton, keeper of the North Point light that my father and grandfather kept before me. Far from the shore stands the grey lighthouse, above sunken slimy rocks that are seen when the tide is low, but unseen w...

## Protections and Audit Side Effects

- Raw sources modified: no
- Cloudflare exports modified: no
- Unresolved-source generated books untouched: yes
- Duplicate/boundary skips not reintroduced: yes
- Unrelated generated/preview changes: none
- Audit side-effect handling: Known title/start audit 12-book churn, audit report churn, pilot-write-22 rerun timestamp churn, and unrelated processing-note churn were restored before commit.

## Validation

- typecheck: pass
- pilotWrite22: pass: 20 first-time processed, 0 skipped, 11 unresolved-source generated books untouched
- batch12ProseRestore: pass: 20/20 raw-generated exact; authorized 11; additional 6
- startupPreviewAudit: pass: 455 generated book startup previews, 455 valid, 0 preview updates
- titleStartDefaultAudit: pass: 455 audited, 12 known corrections applied then restored, 0 accepted revocations
- metadataSegmentationAudit: pass: 455 audited, 0 author corrections, 1 documented unknown-author case, 0 accepted revocations
- manualUiDefectFollowup: pass: 8 checked, 8 acceptable, 0 corrected, 0 revoked, 0 manual review
- targetedVerifier: pass: 20 pass, 0 warn accepted, 0 fail; raw/generated 20/20 exact
- standalonePlaywright: pass: standalone Playwright 36/36
- smokeTests: pass: smoke tests 23/23
- gitDiffCheck: pass: git diff --check clean, CRLF warnings only

## Backlog Note from pilot-write-22

- Dry-run 22 still had 56 skipped/unsafe raw-only candidates before write.
- These are not treated as lost or missed.
- After safe batching slows/exhausts, create a dedicated remaining raw inventory/triage report classifying every unprocessed raw file.
