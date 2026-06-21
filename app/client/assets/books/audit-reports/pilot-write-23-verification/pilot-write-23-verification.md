# Pilot write batch 23 verification

Generated: 2026-06-21T08:33:42.343Z

## Summary

- Verified: 10
- Pass: 10
- Warn accepted: 0
- Fail: 0
- Accepted for main: 10
- Correction needed before main: 0
- Raw/generated exact: 10/10

## Scope findings

- Shared write script: harmless shared implementation intentionally used by write batch 23
- Startup audit heuristic: valid scoped startup-audit heuristic fix needed because real prose used the word “published”

## Batch-12 prose restoration

- Result: pass
- Compared: 20
- Remaining raw/generated mismatches: 0

## Special focus

- Wells metadata/title handling: 6/6 Wells stories preserve exact dry-run story titles and source-backed H. G. Wells metadata; no Unknown Author fallback is present.
- Lovecraft metadata/title/source wrappers: 4/4 Lovecraft stories preserve exact generated title spelling, H. P. Lovecraft metadata, opening/ending text, and accepted source/rights treatment with no site header, navigation, copyright note, or parent collection material in default playback.
- Published heuristic safety: The startup-audit 'published' heuristic was checked against In the Modern Vein: the generated text begins with real Wells prose using 'published' narratively, while source/publication-note leakage patterns remain rejected.
- Prose preservation: 10/10 sanitized raw bodies match every generated body copy character-for-character; no cleanup rule removed punctuation, quote marks, dialogue, initials, scientific terms, archaic diction, unusual names, or ending sentences.

## Books

### in-the-modern-vein

- Status: pass
- Generated output inspected: app/client/assets/books/generated/in-the-modern-vein/manifest.json, app/client/assets/books/generated/in-the-modern-vein/cleaned_book.json, app/client/assets/books/generated/in-the-modern-vein/processed_book.json, app/client/assets/books/generated/in-the-modern-vein/rights_report.json, app/client/assets/books/generated/in-the-modern-vein/sections/chapter-001.json
- Preview inspected: public/book-previews/in-the-modern-vein.preview.json
- Title: pass - Individual story title preserved as "In the Modern Vein"; no parent/source title is default playback.
- Author: pass - H. G. Wells author metadata is source-backed; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based as one contiguous individual story section, not arbitrary Part chunks.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: IN THE MODERN VEIN
- Metadata evidence: H. G. WELLS
- Raw/generated start: Of course the cultivated reader has heard of Aubrey Vair. He has published on three several occasions volumes of delicate verses,—some, indeed, border on indelicacy,—and his column “Of Things Literary” in the Climax i... / Of course the cultivated reader has heard of Aubrey Vair. He has published on three several occasions volumes of delicate verses,—some, indeed, border on indelicacy,—and his column “Of Things Literary” in the Climax i...
- Raw/generated end: ...he was struggling with recollection. “Yes. These potatoes have exactly the tints of the dead leaves of the hazel.” “What a fanciful poet it is!” said Mrs. Aubrey Vair. “Taste them. They are very nice potatoes indeed.” / ...he was struggling with recollection. “Yes. These potatoes have exactly the tints of the dead leaves of the hazel.” “What a fanciful poet it is!” said Mrs. Aubrey Vair. “Taste them. They are very nice potatoes indeed.”
- Preview start: Of course the cultivated reader has heard of Aubrey Vair. He has published on three several occasions volumes of delicate verses,—some, indeed, border on indelicacy,—and his column “Of Things Literary” in the Climax i...

### the-argonauts-of-the-air

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-argonauts-of-the-air/manifest.json, app/client/assets/books/generated/the-argonauts-of-the-air/cleaned_book.json, app/client/assets/books/generated/the-argonauts-of-the-air/processed_book.json, app/client/assets/books/generated/the-argonauts-of-the-air/rights_report.json, app/client/assets/books/generated/the-argonauts-of-the-air/sections/chapter-001.json
- Preview inspected: public/book-previews/the-argonauts-of-the-air.preview.json
- Title: pass - Individual story title preserved as "The Argonauts of the Air"; no parent/source title is default playback.
- Author: pass - H. G. Wells author metadata is source-backed; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based as one contiguous individual story section, not arbitrary Part chunks.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: THE ARGONAUTS OF THE AIR
- Metadata evidence: H. G. WELLS
- Raw/generated start: One saw Monson’s Flying Machine from the windows of the trains passing either along the South-Western main line or along the line between Wimbledon and Worcester Park,—to be more exact, one saw the huge scaffoldings w... / One saw Monson’s Flying Machine from the windows of the trains passing either along the South-Western main line or along the line between Wimbledon and Worcester Park,—to be more exact, one saw the huge scaffoldings w...
- Raw/generated end: ...d between Worcester Park and Malden there still stands that portentous avenue of iron-work, rusting now, and dangerous here and there, to witness to the first desperate struggle for man’s right of way through the air. / ...d between Worcester Park and Malden there still stands that portentous avenue of iron-work, rusting now, and dangerous here and there, to witness to the first desperate struggle for man’s right of way through the air.
- Preview start: One saw Monson’s Flying Machine from the windows of the trains passing either along the South-Western main line or along the line between Wimbledon and Worcester Park,—to be more exact, one saw the huge scaffoldings w...

### the-dreams-in-the-witch-house

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-dreams-in-the-witch-house/manifest.json, app/client/assets/books/generated/the-dreams-in-the-witch-house/cleaned_book.json, app/client/assets/books/generated/the-dreams-in-the-witch-house/processed_book.json, app/client/assets/books/generated/the-dreams-in-the-witch-house/rights_report.json, app/client/assets/books/generated/the-dreams-in-the-witch-house/sections/chapter-001.json
- Preview inspected: public/book-previews/the-dreams-in-the-witch-house.preview.json
- Title: pass - Individual story title preserved as "The Dreams in the Witch-House"; no parent/source title is default playback.
- Author: pass - H. P. Lovecraft author metadata is source-backed; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based as one contiguous individual story section, not arbitrary Part chunks.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: The Dreams in the Witch-House
- Metadata evidence: _Author:_ Howard Phillips Lovecraft (1890-1937)
- Raw/generated start: Whether the dreams brought on the fever or the fever brought on the dreams Walter Gilman did not know. Behind everything crouched the brooding, festering horror of the ancient town, and of the moldy, unhallowed garret... / Whether the dreams brought on the fever or the fever brought on the dreams Walter Gilman did not know. Behind everything crouched the brooding, festering horror of the ancient town, and of the moldy, unhallowed garret...
- Raw/generated end: ...p, and tried to call out and waken him. Something, however, closed his throat. He was not his own master. Had he signed the black man’s book after all? Then his fevered, abnormal hearing caught the distant, wind-borne / ...p, and tried to call out and waken him. Something, however, closed his throat. He was not his own master. Had he signed the black man’s book after all? Then his fevered, abnormal hearing caught the distant, wind-borne
- Preview start: Whether the dreams brought on the fever or the fever brought on the dreams Walter Gilman did not know. Behind everything crouched the brooding, festering horror of the ancient town, and of the moldy, unhallowed garret...

### the-jilting-of-jane

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-jilting-of-jane/manifest.json, app/client/assets/books/generated/the-jilting-of-jane/cleaned_book.json, app/client/assets/books/generated/the-jilting-of-jane/processed_book.json, app/client/assets/books/generated/the-jilting-of-jane/rights_report.json, app/client/assets/books/generated/the-jilting-of-jane/sections/chapter-001.json
- Preview inspected: public/book-previews/the-jilting-of-jane.preview.json
- Title: pass - Individual story title preserved as "The Jilting of Jane"; no parent/source title is default playback.
- Author: pass - H. G. Wells author metadata is source-backed; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based as one contiguous individual story section, not arbitrary Part chunks.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: THE JILTING OF JANE
- Metadata evidence: H. G. WELLS
- Raw/generated start: As I sit writing in my study, I can hear our Jane bumping her way downstairs with a brush and dustpan. She used in the old days to sing hymn tunes, or the British national song for the time being, to these instruments... / As I sit writing in my study, I can hear our Jane bumping her way downstairs with a brush and dustpan. She used in the old days to sing hymn tunes, or the British national song for the time being, to these instruments...
- Raw/generated end: ...boy—but that scarcely belongs to this story. However, Jane is young still, and time and change are at work with her. We all have our sorrows, but I do not believe very much in the existence of sorrows that never heal. / ...boy—but that scarcely belongs to this story. However, Jane is young still, and time and change are at work with her. We all have our sorrows, but I do not believe very much in the existence of sorrows that never heal.
- Preview start: As I sit writing in my study, I can hear our Jane bumping her way downstairs with a brush and dustpan. She used in the old days to sing hymn tunes, or the British national song for the time being, to these instruments...

### the-lost-inheritance

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-lost-inheritance/manifest.json, app/client/assets/books/generated/the-lost-inheritance/cleaned_book.json, app/client/assets/books/generated/the-lost-inheritance/processed_book.json, app/client/assets/books/generated/the-lost-inheritance/rights_report.json, app/client/assets/books/generated/the-lost-inheritance/sections/chapter-001.json
- Preview inspected: public/book-previews/the-lost-inheritance.preview.json
- Title: pass - Individual story title preserved as "The Lost Inheritance"; no parent/source title is default playback.
- Author: pass - H. G. Wells author metadata is source-backed; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based as one contiguous individual story section, not arbitrary Part chunks.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: THE LOST INHERITANCE
- Metadata evidence: H. G. WELLS
- Raw/generated start: “My uncle,” said the man with the glass eye, “was what you might call a hemi-semi-demi millionaire. He was worth about a hundred and twenty thousand. Quite. And he left me all his money.” I glanced at the shiny sleeve... / “My uncle,” said the man with the glass eye, “was what you might call a hemi-semi-demi millionaire. He was worth about a hundred and twenty thousand. Quite. And he left me all his money.” I glanced at the shiny sleeve...
- Raw/generated end: ...man beings fail to understand one another.” But there was no misunderstanding the eloquent thirst of his eye. He accepted with ill-feigned surprise. He said, in the usual subtle formula, that he didn’t mind if he did. / ...man beings fail to understand one another.” But there was no misunderstanding the eloquent thirst of his eye. He accepted with ill-feigned surprise. He said, in the usual subtle formula, that he didn’t mind if he did.
- Preview start: “My uncle,” said the man with the glass eye, “was what you might call a hemi-semi-demi millionaire. He was worth about a hundred and twenty thousand. Quite. And he left me all his money.” I glanced at the shiny sleeve...

### the-purple-pileus

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-purple-pileus/manifest.json, app/client/assets/books/generated/the-purple-pileus/cleaned_book.json, app/client/assets/books/generated/the-purple-pileus/processed_book.json, app/client/assets/books/generated/the-purple-pileus/rights_report.json, app/client/assets/books/generated/the-purple-pileus/sections/chapter-001.json
- Preview inspected: public/book-previews/the-purple-pileus.preview.json
- Title: pass - Individual story title preserved as "The Purple Pileus"; no parent/source title is default playback.
- Author: pass - H. G. Wells author metadata is source-backed; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based as one contiguous individual story section, not arbitrary Part chunks.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: THE PURPLE PILEUS
- Metadata evidence: H. G. WELLS
- Raw/generated start: Mr. Coombes was sick of life. He walked away from his unhappy home, and, sick not only of his own existence, but of everybody else’s, turned aside down Gaswork Lane to avoid the town, and, crossing the wooden bridge t... / Mr. Coombes was sick of life. He walked away from his unhappy home, and, sick not only of his own existence, but of everybody else’s, turned aside down Gaswork Lane to avoid the town, and, crossing the wooden bridge t...
- Raw/generated end: ...t for some wise purpose,” said Mr. Coombes. And that was as much thanks as the purple pileus ever got for maddening this absurd little man to the pitch of decisive action, and so altering the whole course of his life. / ...t for some wise purpose,” said Mr. Coombes. And that was as much thanks as the purple pileus ever got for maddening this absurd little man to the pitch of decisive action, and so altering the whole course of his life.
- Preview start: Mr. Coombes was sick of life. He walked away from his unhappy home, and, sick not only of his own existence, but of everybody else’s, turned aside down Gaswork Lane to avoid the town, and, crossing the wooden bridge t...

### the-shadow-out-of-time

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-shadow-out-of-time/manifest.json, app/client/assets/books/generated/the-shadow-out-of-time/cleaned_book.json, app/client/assets/books/generated/the-shadow-out-of-time/processed_book.json, app/client/assets/books/generated/the-shadow-out-of-time/rights_report.json, app/client/assets/books/generated/the-shadow-out-of-time/sections/chapter-001.json
- Preview inspected: public/book-previews/the-shadow-out-of-time.preview.json
- Title: pass - Individual story title preserved as "The Shadow Out of Time"; no parent/source title is default playback.
- Author: pass - H. P. Lovecraft author metadata is source-backed; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based as one contiguous individual story section, not arbitrary Part chunks.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: THE SHADOW OUT OF TIME
- Metadata evidence: _Author:_ H. P. (Howard Phillips) Lovecraft, (1890-1937)
- Raw/generated start: After twenty-two years of nightmare and terror, saved only by a desperate conviction of the mythical source of certain impressions, I am unwilling to vouch for the truth of that which I think I found in Western Austra... / After twenty-two years of nightmare and terror, saved only by a desperate conviction of the mythical source of certain impressions, I am unwilling to vouch for the truth of that which I think I found in Western Austra...
- Raw/generated end: ...roglyphs of Earth’s youth. They were, instead, the letters of our familiar alphabet, spelling out the words of the English language, in my own handwriting. [The end of <i>The Shadow Out of Time</i> by H. P. Lovecraft] / ...roglyphs of Earth’s youth. They were, instead, the letters of our familiar alphabet, spelling out the words of the English language, in my own handwriting. [The end of <i>The Shadow Out of Time</i> by H. P. Lovecraft]
- Preview start: After twenty-two years of nightmare and terror, saved only by a desperate conviction of the mythical source of certain impressions, I am unwilling to vouch for the truth of that which I think I found in Western Austra...

### the-strange-high-house-in-the-mist

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-strange-high-house-in-the-mist/manifest.json, app/client/assets/books/generated/the-strange-high-house-in-the-mist/cleaned_book.json, app/client/assets/books/generated/the-strange-high-house-in-the-mist/processed_book.json, app/client/assets/books/generated/the-strange-high-house-in-the-mist/rights_report.json, app/client/assets/books/generated/the-strange-high-house-in-the-mist/sections/chapter-001.json
- Preview inspected: public/book-previews/the-strange-high-house-in-the-mist.preview.json
- Title: pass - Individual story title preserved as "The Strange High House in the Mist"; no parent/source title is default playback.
- Author: pass - H. P. Lovecraft author metadata is source-backed; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based as one contiguous individual story section, not arbitrary Part chunks.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: The Strange High House in the Mist
- Metadata evidence: _Author:_ Howard Phillips Lovecraft (1890-1937)
- Raw/generated start: In the morning mist comes up from the sea by the cliffs beyond Kingsport. White and feathery it comes from the deep to its brothers the clouds, full of dreams of dank pastures and caves of leviathan. And later, in sti... / In the morning mist comes up from the sea by the cliffs beyond Kingsport. White and feathery it comes from the deep to its brothers the clouds, full of dreams of dank pastures and caves of leviathan. And later, in sti...
- Raw/generated end: ...ly a mystic whiteness, as if the cliff's rim were the rim of all earth, and the solemn bells of the buoys tolled free in the æther of faëry. [The end of The Strange High House in the Mist by Howard Phillips Lovecraft] / ...ly a mystic whiteness, as if the cliff's rim were the rim of all earth, and the solemn bells of the buoys tolled free in the æther of faëry. [The end of The Strange High House in the Mist by Howard Phillips Lovecraft]
- Preview start: In the morning mist comes up from the sea by the cliffs beyond Kingsport. White and feathery it comes from the deep to its brothers the clouds, full of dreams of dank pastures and caves of leviathan. And later, in sti...

### the-valley-of-spiders

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-valley-of-spiders/manifest.json, app/client/assets/books/generated/the-valley-of-spiders/cleaned_book.json, app/client/assets/books/generated/the-valley-of-spiders/processed_book.json, app/client/assets/books/generated/the-valley-of-spiders/rights_report.json, app/client/assets/books/generated/the-valley-of-spiders/sections/chapter-001.json
- Preview inspected: public/book-previews/the-valley-of-spiders.preview.json
- Title: pass - Individual story title preserved as "The Valley of Spiders"; no parent/source title is default playback.
- Author: pass - H. G. Wells author metadata is source-backed; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based as one contiguous individual story section, not arbitrary Part chunks.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: THE VALLEY OF SPIDERS
- Metadata evidence: Author: H. G. Wells
- Raw/generated start: The gaunt man with the scarred lip was the first to speak. “Nowhere,” he said, with a sigh of disappointment in his voice. “But after all, they had a full day's start.” “They don't know we are after them,” said the li... / The gaunt man with the scarred lip was the first to speak. “Nowhere,” he said, with a sigh of disappointment in his voice. “But after all, they had a full day's start.” “They don't know we are after them,” said the li...
- Raw/generated end: ...ith his boots, but this impulse he overcame. Ever and again he turned in his saddle, and looked back at the smoke. “Spiders,” he muttered over and over again. “Spiders! Well, well.... The next time I must spin a web.” / ...ith his boots, but this impulse he overcame. Ever and again he turned in his saddle, and looked back at the smoke. “Spiders,” he muttered over and over again. “Spiders! Well, well.... The next time I must spin a web.”
- Preview start: The gaunt man with the scarred lip was the first to speak. “Nowhere,” he said, with a sigh of disappointment in his voice. “But after all, they had a full day's start.” “They don't know we are after them,” said the li...

### the-whisperer-in-darkness

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-whisperer-in-darkness/manifest.json, app/client/assets/books/generated/the-whisperer-in-darkness/cleaned_book.json, app/client/assets/books/generated/the-whisperer-in-darkness/processed_book.json, app/client/assets/books/generated/the-whisperer-in-darkness/rights_report.json, app/client/assets/books/generated/the-whisperer-in-darkness/sections/chapter-001.json
- Preview inspected: public/book-previews/the-whisperer-in-darkness.preview.json
- Title: pass - Individual story title preserved as "The Whisperer in Darkness"; no parent/source title is default playback.
- Author: pass - H. P. Lovecraft author metadata is source-backed; Unknown Author is absent.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Generated body starts at the true readable beginning verified in dry-run/write evidence.
- End boundary: pass - Generated body preserves the true readable ending and final sentence.
- Sectioning: pass - Sectioning is source-based as one contiguous individual story section, not arbitrary Part chunks.
- Cleanup/prose preservation: pass - No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact.
- Preview: pass - Preview is valid, book-specific, starts from real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All main readable sections are included by default and selected/default order begins from the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: The Whisperer in Darkness
- Metadata evidence: H. P. Lovecraft
- Raw/generated start: Bear in mind closely that I did not see any actual visual horror at the end. To say that a mental shock was the cause of what I inferred--that last straw which sent me racing out of the lonely Akeley farmhouse and thr... / Bear in mind closely that I did not see any actual visual horror at the end. To say that a mental shock was the cause of what I inferred--that last straw which sent me racing out of the lonely Akeley farmhouse and thr...
- Raw/generated end: .... For the things in the chair, perfect to the last, subtle detail of microscopic resemblance--or identity--were the face and hands of Henry Wentworth Akeley. [The end of _The Whisperer in Darkness_ by H. P. Lovecraft] / .... For the things in the chair, perfect to the last, subtle detail of microscopic resemblance--or identity--were the face and hands of Henry Wentworth Akeley. [The end of _The Whisperer in Darkness_ by H. P. Lovecraft]
- Preview start: Bear in mind closely that I did not see any actual visual horror at the end. To say that a mental shock was the cause of what I inferred--that last straw which sent me racing out of the lonely Akeley farmhouse and thr...

## Protections and audit side effects

- Raw sources modified: no
- Cloudflare exports modified: no
- Unresolved-source books untouched: yes
- Duplicate/boundary skips not reintroduced: yes
- Unrelated generated/preview changes: none
- Audit side-effect handling: validation churn from batch-12/startup/title/metadata/manual/write rerun was restored before commit; only verification report/script/package command remain

## Validation

- typecheck: passed
- pilotWrite23: passed: 10 first-time processed, 0 skipped, 11 unresolved-source generated books untouched
- batch12ProseRestore: passed: 20/20 raw/generated exact
- startupPreviewAudit: passed: 465 generated, 465 valid startup previews, 0 preview updates
- titleStartDefaultAudit: passed: 465 audited, 12 known unrelated corrections applied then restored, 0 accepted-book revocations
- metadataSegmentationAudit: passed: 465 audited, 0 author corrections, 1 documented unknown-author case, 0 accepted-book revocations
- manualUiDefectFollowup: passed: 8 checked, 8 acceptable, 0 corrected, 0 revoked
- targetedVerifier: passed: 10 pass, 0 warn accepted, 0 fail; raw/generated 10/10 exact
- standalonePlaywright: passed: 36/36
- smokeTests: passed: 23/23
- gitDiffCheck: passed

## Playwright and smoke

- Playwright: passed: 36/36
- Fullscreen UI modified here: no
- Smoke tests: passed: 23/23

## Backlog note from pilot-write-23

- Dry-run 23 still had 46 skipped/unsafe raw-only candidates before write.
- These are not treated as lost or missed.
- After safe batching slows/exhausts, create a dedicated remaining raw inventory/triage report classifying every unprocessed raw file.
