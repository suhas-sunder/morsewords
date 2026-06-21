# Pilot write batch 21 verification

Generated: 2026-06-21T01:27:59.698Z

## Summary

- Verified: 20
- Pass: 20
- Warn accepted: 0
- Fail: 0
- Accepted for main: 20
- Correction needed before main: 0
- Raw/generated exact: 20/20

## Write-12 Shared Script Scope

- Classification: harmless shared implementation intentionally used by write batch 21
- Resolution: Retain the write-12 change. Batches 13-21 use five-line wrappers that set MORSEWORDS_PILOT_WRITE_BATCH and import the established write-12 runner; this diff adds batch-21 typing, selection, dispatch, backlog-note reporting, and source-presence guards for the dry-run title and author evidence.
- Unrelated changes found: no

## Batch-12 Prose Restoration

- Result: pass
- Compared: 20
- Remaining raw/generated mismatches: 0
- Remaining prose omissions: 0
- Remaining missing opening-quote defects: 0

## Special Focus

- Exact spelling: Aepyornis, Avu, Genus Novo, Hammerpond Park, Harringay, Taxidermist, and The Country of the Blind match source-audited titles exactly.
- Creator roles: 19/19 sources naming H. G. Wells preserve that exact author metadata; The Crystal Egg preserves its source-backed Herbert George Wells metadata; no batch-21 title uses Unknown Author.
- Wrapped-line prose: 20/20 sanitized raw bodies match every generated body copy character-for-character (20/20 exact).
- Collection metadata/playback: 20/20 use the individual tale title and exclude parent collection/title/byline/source wrapper material from default playback.

## Books

### a-deal-in-ostriches

- Status: pass
- Generated output inspected: app/client/assets/books/generated/a-deal-in-ostriches/manifest.json, app/client/assets/books/generated/a-deal-in-ostriches/cleaned_book.json, app/client/assets/books/generated/a-deal-in-ostriches/processed_book.json, app/client/assets/books/generated/a-deal-in-ostriches/rights_report.json, app/client/assets/books/generated/a-deal-in-ostriches/processing_notes.md, app/client/assets/books/generated/a-deal-in-ostriches/sections/chapter-001.json
- Preview inspected: public/book-previews/a-deal-in-ostriches.preview.json
- Title: pass - Individual title preserved exactly as "A Deal in Ostriches"; parent collection "The Stolen Bacillus and Other Incidents" is excluded from title and playback.
- Author metadata: pass - H. G. Wells is source-backed as author, no Unknown Author appears, and no parent collection metadata replaces the individual story metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: A DEAL IN OSTRICHES
- Metadata evidence: Author: H. G. Wells; author as identified by the source
- Raw/generated start: Talking of the prices of birds, I've seen an ostrich that cost three hundred pounds," said the Taxidermist, recalling his youth of travel. "Three hundred pounds!" He looked at me over his spectacles. "I've seen anothe... / Talking of the prices of birds, I've seen an ostrich that cost three hundred pounds," said the Taxidermist, recalling his youth of travel. "Three hundred pounds!" He looked at me over his spectacles. "I've seen anothe...
- Raw/generated end: .... Only, you see, there's no doubt the diamond was real. And Padishah was an eminent Hindoo. I've seen his name in the papers--often. But whether the bird swallowed the diamond certainly is another matter, as you say." / .... Only, you see, there's no doubt the diamond was real. And Padishah was an eminent Hindoo. I've seen his name in the papers--often. But whether the bird swallowed the diamond certainly is another matter, as you say."
- Preview start: Talking of the prices of birds, I've seen an ostrich that cost three hundred pounds," said the Taxidermist, recalling his youth of travel. "Three hundred pounds!" He looked at me over his spectacles. "I've seen anothe...

### a-moonlight-fable

- Status: pass
- Generated output inspected: app/client/assets/books/generated/a-moonlight-fable/manifest.json, app/client/assets/books/generated/a-moonlight-fable/cleaned_book.json, app/client/assets/books/generated/a-moonlight-fable/processed_book.json, app/client/assets/books/generated/a-moonlight-fable/rights_report.json, app/client/assets/books/generated/a-moonlight-fable/processing_notes.md, app/client/assets/books/generated/a-moonlight-fable/sections/chapter-001.json
- Preview inspected: public/book-previews/a-moonlight-fable.preview.json
- Title: pass - Individual title preserved exactly as "A Moonlight Fable"; parent collection "The Door in the Wall And Other Stories" is excluded from title and playback.
- Author metadata: pass - H. G. Wells is source-backed as author, no Unknown Author appears, and no parent collection metadata replaces the individual story metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: A MOONLIGHT FABLE
- Metadata evidence: Author: H. G. Wells; author as identified by the source
- Raw/generated start: There was once a little man whose mother made him a beautiful suit of clothes. It was green and gold and woven so that I cannot describe how delicate and fine it was, and there was a tie of orange fluffiness that tied... / There was once a little man whose mother made him a beautiful suit of clothes. It was green and gold and woven so that I cannot describe how delicate and fine it was, and there was a tie of orange fluffiness that tied...
- Raw/generated end: ...ed from the pond. But his face was a face of such happiness that, had you seen it, you would have understood indeed how that he had died happy, never knowing the cool and streaming silver for the duckweed in the pond. / ...ed from the pond. But his face was a face of such happiness that, had you seen it, you would have understood indeed how that he had died happy, never knowing the cool and streaming silver for the duckweed in the pond.
- Preview start: There was once a little man whose mother made him a beautiful suit of clothes. It was green and gold and woven so that I cannot describe how delicate and fine it was, and there was a tie of orange fluffiness that tied...

### a-moth-genus-novo

- Status: pass
- Generated output inspected: app/client/assets/books/generated/a-moth-genus-novo/manifest.json, app/client/assets/books/generated/a-moth-genus-novo/cleaned_book.json, app/client/assets/books/generated/a-moth-genus-novo/processed_book.json, app/client/assets/books/generated/a-moth-genus-novo/rights_report.json, app/client/assets/books/generated/a-moth-genus-novo/processing_notes.md, app/client/assets/books/generated/a-moth-genus-novo/sections/chapter-001.json
- Preview inspected: public/book-previews/a-moth-genus-novo.preview.json
- Title: pass - Individual title preserved exactly as "A Moth--Genus Novo"; parent collection "The Stolen Bacillus and Other Incidents" is excluded from title and playback.
- Author metadata: pass - H. G. Wells is source-backed as author, no Unknown Author appears, and no parent collection metadata replaces the individual story metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: A MOTH--GENUS NOVO
- Metadata evidence: Author: H. G. Wells; author as identified by the source
- Raw/generated start: Probably you have heard of Hapley--not W.T. Hapley, the son, but the celebrated Hapley, the Hapley of _Periplaneta Hapliia_, Hapley the entomologist. If so you know at least of the great feud between Hapley and Profes... / Probably you have heard of Hapley--not W.T. Hapley, the son, but the celebrated Hapley, the Hapley of _Periplaneta Hapliia_, Hapley the entomologist. If so you know at least of the great feud between Hapley and Profes...
- Raw/generated end: ...e can see. The asylum doctor calls it hallucination; but Hapley, when he is in his easier mood, and can talk, says it is the ghost of Pawkins, and consequently a unique specimen and well worth the trouble of catching. / ...e can see. The asylum doctor calls it hallucination; but Hapley, when he is in his easier mood, and can talk, says it is the ghost of Pawkins, and consequently a unique specimen and well worth the trouble of catching.
- Preview start: Probably you have heard of Hapley--not W.T. Hapley, the son, but the celebrated Hapley, the Hapley of _Periplaneta Hapliia_, Hapley the entomologist. If so you know at least of the great feud between Hapley and Profes...

### aepyornis-island

- Status: pass
- Generated output inspected: app/client/assets/books/generated/aepyornis-island/manifest.json, app/client/assets/books/generated/aepyornis-island/cleaned_book.json, app/client/assets/books/generated/aepyornis-island/processed_book.json, app/client/assets/books/generated/aepyornis-island/rights_report.json, app/client/assets/books/generated/aepyornis-island/processing_notes.md, app/client/assets/books/generated/aepyornis-island/sections/chapter-001.json
- Preview inspected: public/book-previews/aepyornis-island.preview.json
- Title: pass - Individual title preserved exactly as "Aepyornis Island"; parent collection "The Stolen Bacillus and Other Incidents" is excluded from title and playback.
- Author metadata: pass - H. G. Wells is source-backed as author, no Unknown Author appears, and no parent collection metadata replaces the individual story metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: AEPYORNIS ISLAND
- Metadata evidence: Author: H. G. Wells; author as identified by the source
- Raw/generated start: The man with the scarred face leant over the table and looked at my bundle. "Orchids?" he asked. "A few," I said. "Cypripediums," he said. "Chiefly," said I. "Anything new? I thought not. _I_ did these islands twenty-... / The man with the scarred face leant over the table and looked at my bundle. "Orchids?" he asked. "A few," I said. "Cypripediums," he said. "Chiefly," said I. "Anything new? I thought not. _I_ did these islands twenty-...
- Raw/generated end: ...elling me as much," said the man with the scar. "If they get any more Aepyornises, he reckons some scientific swell will go and burst a bloodvessel. But it was a queer thing to happen to a man; wasn't it--altogether?" / ...elling me as much," said the man with the scar. "If they get any more Aepyornises, he reckons some scientific swell will go and burst a bloodvessel. But it was a queer thing to happen to a man; wasn't it--altogether?"
- Preview start: The man with the scarred face leant over the table and looked at my bundle. "Orchids?" he asked. "A few," I said. "Cypripediums," he said. "Chiefly," said I. "Anything new? I thought not. _I_ did these islands twenty-...

### in-the-avu-observatory

- Status: pass
- Generated output inspected: app/client/assets/books/generated/in-the-avu-observatory/manifest.json, app/client/assets/books/generated/in-the-avu-observatory/cleaned_book.json, app/client/assets/books/generated/in-the-avu-observatory/processed_book.json, app/client/assets/books/generated/in-the-avu-observatory/rights_report.json, app/client/assets/books/generated/in-the-avu-observatory/processing_notes.md, app/client/assets/books/generated/in-the-avu-observatory/sections/chapter-001.json
- Preview inspected: public/book-previews/in-the-avu-observatory.preview.json
- Title: pass - Individual title preserved exactly as "In the Avu Observatory"; parent collection "The Stolen Bacillus and Other Incidents" is excluded from title and playback.
- Author metadata: pass - H. G. Wells is source-backed as author, no Unknown Author appears, and no parent collection metadata replaces the individual story metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: IN THE AVU OBSERVATORY
- Metadata evidence: Author: H. G. Wells; author as identified by the source
- Raw/generated start: The observatory at Avu, in Borneo, stands on the spur of the mountain. To the north rises the old crater, black at night against the unfathomable blue of the sky. From the little circular building, with its mushroom d... / The observatory at Avu, in Borneo, stands on the spur of the mountain. To the north rises the old crater, black at night against the unfathomable blue of the sky. From the little circular building, with its mushroom d...
- Raw/generated end: ...e dreamt of in our philosophies. On the whole, if the Borneo fauna is going to disgorge any more of its novelties upon me, I should prefer that it did so when I was not occupied in the observatory at night and alone." / ...e dreamt of in our philosophies. On the whole, if the Borneo fauna is going to disgorge any more of its novelties upon me, I should prefer that it did so when I was not occupied in the observatory at night and alone."
- Preview start: The observatory at Avu, in Borneo, stands on the spur of the mountain. To the north rises the old crater, black at night against the unfathomable blue of the sky. From the little circular building, with its mushroom d...

### the-cone

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-cone/manifest.json, app/client/assets/books/generated/the-cone/cleaned_book.json, app/client/assets/books/generated/the-cone/processed_book.json, app/client/assets/books/generated/the-cone/rights_report.json, app/client/assets/books/generated/the-cone/processing_notes.md, app/client/assets/books/generated/the-cone/sections/chapter-001.json
- Preview inspected: public/book-previews/the-cone.preview.json
- Title: pass - Individual title preserved exactly as "The Cone"; parent collection "The Door in the Wall And Other Stories" is excluded from title and playback.
- Author metadata: pass - H. G. Wells is source-backed as author, no Unknown Author appears, and no parent collection metadata replaces the individual story metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: THE CONE
- Metadata evidence: Author: H. G. Wells; author as identified by the source
- Raw/generated start: The night was hot and overcast, the sky red, rimmed with the lingering sunset of mid-summer. They sat at the open window, trying to fancy the air was fresher there. The trees and shrubs of the garden stood stiff and d... / The night was hot and overcast, the sky red, rimmed with the lingering sunset of mid-summer. They sat at the open window, trying to fancy the air was fresher there. The trees and shrubs of the garden stood stiff and d...
- Raw/generated end: ...ed back, and stood trembling, clinging to the rail with both hands. His lips moved, but no words came to them. Down below was the sound of voices and running steps. The clangour of rolling in the shed ceased abruptly. / ...ed back, and stood trembling, clinging to the rail with both hands. His lips moved, but no words came to them. Down below was the sound of voices and running steps. The clangour of rolling in the shed ceased abruptly.
- Preview start: The night was hot and overcast, the sky red, rimmed with the lingering sunset of mid-summer. They sat at the open window, trying to fancy the air was fresher there. The trees and shrubs of the garden stood stiff and d...

### the-country-of-the-blind

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-country-of-the-blind/manifest.json, app/client/assets/books/generated/the-country-of-the-blind/cleaned_book.json, app/client/assets/books/generated/the-country-of-the-blind/processed_book.json, app/client/assets/books/generated/the-country-of-the-blind/rights_report.json, app/client/assets/books/generated/the-country-of-the-blind/processing_notes.md, app/client/assets/books/generated/the-country-of-the-blind/sections/chapter-001.json
- Preview inspected: public/book-previews/the-country-of-the-blind.preview.json
- Title: pass - Individual title preserved exactly as "The Country of the Blind"; parent collection "The Door in the Wall And Other Stories" is excluded from title and playback.
- Author metadata: pass - H. G. Wells is source-backed as author, no Unknown Author appears, and no parent collection metadata replaces the individual story metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: THE COUNTRY OF THE BLIND
- Metadata evidence: Author: H. G. Wells; author as identified by the source
- Raw/generated start: Three hundred miles and more from Chimborazo, one hundred from the snows of Cotopaxi, in the wildest wastes of Ecuador’s Andes, there lies that mysterious mountain valley, cut off from all the world of men, the Countr... / Three hundred miles and more from Chimborazo, one hundred from the snows of Cotopaxi, in the wildest wastes of Ecuador’s Andes, there lies that mysterious mountain valley, cut off from all the world of men, the Countr...
- Raw/generated end: ... he were content now merely to have escaped from the valley of the Blind, in which he had thought to be King. And the glow of the sunset passed, and the night came, and still he lay there, under the cold, clear stars. / ... he were content now merely to have escaped from the valley of the Blind, in which he had thought to be King. And the glow of the sunset passed, and the night came, and still he lay there, under the cold, clear stars.
- Preview start: Three hundred miles and more from Chimborazo, one hundred from the snows of Cotopaxi, in the wildest wastes of Ecuador’s Andes, there lies that mysterious mountain valley, cut off from all the world of men, the Countr...

### the-crystal-egg

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-crystal-egg/manifest.json, app/client/assets/books/generated/the-crystal-egg/cleaned_book.json, app/client/assets/books/generated/the-crystal-egg/processed_book.json, app/client/assets/books/generated/the-crystal-egg/rights_report.json, app/client/assets/books/generated/the-crystal-egg/processing_notes.md, app/client/assets/books/generated/the-crystal-egg/sections/chapter-001.json
- Preview inspected: public/book-previews/the-crystal-egg.preview.json
- Title: pass - Individual title preserved exactly as "The Crystal Egg"; parent collection "Tales of Space and Time" is excluded from title and playback.
- Author metadata: pass - Herbert George Wells is source-backed as author, no Unknown Author appears, and no parent collection metadata replaces the individual story metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: THE CRYSTAL EGG
- Metadata evidence: Author: Herbert George Wells; author as identified by the source
- Raw/generated start: There was, until a year ago, a little and very grimy-looking shop near Seven Dials, over which, in weather-worn yellow lettering, the name of "C. Cave, Naturalist and Dealer in Antiquities," was inscribed. The content... / There was, until a year ago, a little and very grimy-looking shop near Seven Dials, over which, in weather-worn yellow lettering, the name of "C. Cave, Naturalist and Dealer in Antiquities," was inscribed. The content...
- Raw/generated end: ...sent hither from that planet, in order to give the Martians a near view of our affairs. Possibly the fellows to the crystals in the other masts are also on our globe. No theory of hallucination suffices for the facts. / ...sent hither from that planet, in order to give the Martians a near view of our affairs. Possibly the fellows to the crystals in the other masts are also on our globe. No theory of hallucination suffices for the facts.
- Preview start: There was, until a year ago, a little and very grimy-looking shop near Seven Dials, over which, in weather-worn yellow lettering, the name of "C. Cave, Naturalist and Dealer in Antiquities," was inscribed. The content...

### the-diamond-maker

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-diamond-maker/manifest.json, app/client/assets/books/generated/the-diamond-maker/cleaned_book.json, app/client/assets/books/generated/the-diamond-maker/processed_book.json, app/client/assets/books/generated/the-diamond-maker/rights_report.json, app/client/assets/books/generated/the-diamond-maker/processing_notes.md, app/client/assets/books/generated/the-diamond-maker/sections/chapter-001.json
- Preview inspected: public/book-previews/the-diamond-maker.preview.json
- Title: pass - Individual title preserved exactly as "The Diamond Maker"; parent collection "The Stolen Bacillus and Other Incidents" is excluded from title and playback.
- Author metadata: pass - H. G. Wells is source-backed as author, no Unknown Author appears, and no parent collection metadata replaces the individual story metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: THE DIAMOND MAKER
- Metadata evidence: Author: H. G. Wells; author as identified by the source
- Raw/generated start: Some business had detained me in Chancery Lane until nine in the evening, and thereafter, having some inkling of a headache, I was disinclined either for entertainment or further work. So much of the sky as the high c... / Some business had detained me in Chancery Lane until nine in the evening, and thereafter, having some inkling of a headache, I was disinclined either for entertainment or further work. So much of the sky as the high c...
- Raw/generated end: ...ociety, and, passing athwart my heavens in the serene altitude sacred to the wealthy and the well-advertised, reproach me silently for my want of enterprise. I sometimes think I might at least have risked five pounds. / ...ociety, and, passing athwart my heavens in the serene altitude sacred to the wealthy and the well-advertised, reproach me silently for my want of enterprise. I sometimes think I might at least have risked five pounds.
- Preview start: Some business had detained me in Chancery Lane until nine in the evening, and thereafter, having some inkling of a headache, I was disinclined either for entertainment or further work. So much of the sky as the high c...

### the-flowering-of-the-strange-orchid

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-flowering-of-the-strange-orchid/manifest.json, app/client/assets/books/generated/the-flowering-of-the-strange-orchid/cleaned_book.json, app/client/assets/books/generated/the-flowering-of-the-strange-orchid/processed_book.json, app/client/assets/books/generated/the-flowering-of-the-strange-orchid/rights_report.json, app/client/assets/books/generated/the-flowering-of-the-strange-orchid/processing_notes.md, app/client/assets/books/generated/the-flowering-of-the-strange-orchid/sections/chapter-001.json
- Preview inspected: public/book-previews/the-flowering-of-the-strange-orchid.preview.json
- Title: pass - Individual title preserved exactly as "The Flowering of the Strange Orchid"; parent collection "The Stolen Bacillus and Other Incidents" is excluded from title and playback.
- Author metadata: pass - H. G. Wells is source-backed as author, no Unknown Author appears, and no parent collection metadata replaces the individual story metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: THE FLOWERING OF THE STRANGE ORCHID
- Metadata evidence: Author: H. G. Wells; author as identified by the source
- Raw/generated start: The buying of orchids always has in it a certain speculative flavour. You have before you the brown shrivelled lump of tissue, and for the rest you must trust your judgment, or the auctioneer, or your good-luck, as yo... / The buying of orchids always has in it a certain speculative flavour. You have before you the brown shrivelled lump of tissue, and for the rest you must trust your judgment, or the auctioneer, or your good-luck, as yo...
- Raw/generated end: ...door banged intermittently in the morning breeze, and all the array of Wedderburn's orchids was shrivelled and prostrate. But Wedderburn himself was bright and garrulous upstairs in the glory of his strange adventure. / ...door banged intermittently in the morning breeze, and all the array of Wedderburn's orchids was shrivelled and prostrate. But Wedderburn himself was bright and garrulous upstairs in the glory of his strange adventure.
- Preview start: The buying of orchids always has in it a certain speculative flavour. You have before you the brown shrivelled lump of tissue, and for the rest you must trust your judgment, or the auctioneer, or your good-luck, as yo...

### the-flying-man

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-flying-man/manifest.json, app/client/assets/books/generated/the-flying-man/cleaned_book.json, app/client/assets/books/generated/the-flying-man/processed_book.json, app/client/assets/books/generated/the-flying-man/rights_report.json, app/client/assets/books/generated/the-flying-man/processing_notes.md, app/client/assets/books/generated/the-flying-man/sections/chapter-001.json
- Preview inspected: public/book-previews/the-flying-man.preview.json
- Title: pass - Individual title preserved exactly as "The Flying Man"; parent collection "The Stolen Bacillus and Other Incidents" is excluded from title and playback.
- Author metadata: pass - H. G. Wells is source-backed as author, no Unknown Author appears, and no parent collection metadata replaces the individual story metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: THE FLYING MAN
- Metadata evidence: Author: H. G. Wells; author as identified by the source
- Raw/generated start: The Ethnologist looked at the _bhimraj_ feather thoughtfully. "They seemed loth to part with it," he said. "It is sacred to the Chiefs," said the lieutenant; "just as yellow silk, you know, is sacred to the Chinese Em... / The Ethnologist looked at the _bhimraj_ feather thoughtfully. "They seemed loth to part with it," he said. "It is sacred to the Chiefs," said the lieutenant; "just as yellow silk, you know, is sacred to the Chinese Em...
- Raw/generated end: ... jumped over." "The rest were all right?" asked the Ethnologist. "Yes," said the lieutenant; "the rest were all right, barring a certain thirst, you know." And at the memory he helped himself to soda and whisky again. / ... jumped over." "The rest were all right?" asked the Ethnologist. "Yes," said the lieutenant; "the rest were all right, barring a certain thirst, you know." And at the memory he helped himself to soda and whisky again.
- Preview start: The Ethnologist looked at the _bhimraj_ feather thoughtfully. "They seemed loth to part with it," he said. "It is sacred to the Chiefs," said the lieutenant; "just as yellow silk, you know, is sacred to the Chinese Em...

### the-hammerpond-park-burglary

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-hammerpond-park-burglary/manifest.json, app/client/assets/books/generated/the-hammerpond-park-burglary/cleaned_book.json, app/client/assets/books/generated/the-hammerpond-park-burglary/processed_book.json, app/client/assets/books/generated/the-hammerpond-park-burglary/rights_report.json, app/client/assets/books/generated/the-hammerpond-park-burglary/processing_notes.md, app/client/assets/books/generated/the-hammerpond-park-burglary/sections/chapter-001.json
- Preview inspected: public/book-previews/the-hammerpond-park-burglary.preview.json
- Title: pass - Individual title preserved exactly as "The Hammerpond Park Burglary"; parent collection "The Stolen Bacillus and Other Incidents" is excluded from title and playback.
- Author metadata: pass - H. G. Wells is source-backed as author, no Unknown Author appears, and no parent collection metadata replaces the individual story metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: THE HAMMERPOND PARK BURGLARY
- Metadata evidence: Author: H. G. Wells; author as identified by the source
- Raw/generated start: It is a moot point whether burglary is to be considered as a sport, a trade, or an art. For a trade, the technique is scarcely rigid enough, and its claims to be considered an art are vitiated by the mercenary element... / It is a moot point whether burglary is to be considered as a sport, a trade, or an art. For a trade, the technique is scarcely rigid enough, and its claims to be considered an art are vitiated by the mercenary element...
- Raw/generated end: ...nvas with a green inscription, in the Hammerpond Park, and it found Hammerpond House in commotion. But if the dawn found Mr Teddy Watkins and the Aveling diamonds, it did not communicate the information to the police. / ...nvas with a green inscription, in the Hammerpond Park, and it found Hammerpond House in commotion. But if the dawn found Mr Teddy Watkins and the Aveling diamonds, it did not communicate the information to the police.
- Preview start: It is a moot point whether burglary is to be considered as a sport, a trade, or an art. For a trade, the technique is scarcely rigid enough, and its claims to be considered an art are vitiated by the mercenary element...

### the-lord-of-the-dynamos

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-lord-of-the-dynamos/manifest.json, app/client/assets/books/generated/the-lord-of-the-dynamos/cleaned_book.json, app/client/assets/books/generated/the-lord-of-the-dynamos/processed_book.json, app/client/assets/books/generated/the-lord-of-the-dynamos/rights_report.json, app/client/assets/books/generated/the-lord-of-the-dynamos/processing_notes.md, app/client/assets/books/generated/the-lord-of-the-dynamos/sections/chapter-001.json
- Preview inspected: public/book-previews/the-lord-of-the-dynamos.preview.json
- Title: pass - Individual title preserved exactly as "The Lord of the Dynamos"; parent collection "The Stolen Bacillus and Other Incidents" is excluded from title and playback.
- Author metadata: pass - H. G. Wells is source-backed as author, no Unknown Author appears, and no parent collection metadata replaces the individual story metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: THE LORD OF THE DYNAMOS
- Metadata evidence: Author: H. G. Wells; author as identified by the source
- Raw/generated start: The chief attendant of the three dynamos that buzzed and rattled at Camberwell, and kept the electric railway going, came out of Yorkshire, and his name was James Holroyd. He was a practical electrician, but fond of w... / The chief attendant of the three dynamos that buzzed and rattled at Camberwell, and kept the electric railway going, came out of Yorkshire, and his name was James Holroyd. He was a practical electrician, but fond of w...
- Raw/generated end: ...loud and clear, and the armature beat the air. So ended prematurely the Worship of the Dynamo Deity, perhaps the most short-lived of all religions. Yet withal it could at least boast a Martyrdom and a Human Sacrifice. / ...loud and clear, and the armature beat the air. So ended prematurely the Worship of the Dynamo Deity, perhaps the most short-lived of all religions. Yet withal it could at least boast a Martyrdom and a Human Sacrifice.
- Preview start: The chief attendant of the three dynamos that buzzed and rattled at Camberwell, and kept the electric railway going, came out of Yorkshire, and his name was James Holroyd. He was a practical electrician, but fond of w...

### the-star

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-star/manifest.json, app/client/assets/books/generated/the-star/cleaned_book.json, app/client/assets/books/generated/the-star/processed_book.json, app/client/assets/books/generated/the-star/rights_report.json, app/client/assets/books/generated/the-star/processing_notes.md, app/client/assets/books/generated/the-star/sections/chapter-001.json
- Preview inspected: public/book-previews/the-star.preview.json
- Title: pass - Individual title preserved exactly as "The Star"; parent collection "The Door in the Wall And Other Stories" is excluded from title and playback.
- Author metadata: pass - H. G. Wells is source-backed as author, no Unknown Author appears, and no parent collection metadata replaces the individual story metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: THE STAR
- Metadata evidence: Author: H. G. Wells; author as identified by the source
- Raw/generated start: It was on the first day of the New Year that the announcement was made, almost simultaneously from three observatories, that the motion of the planet Neptune, the outermost of all the planets that wheel about the sun,... / It was on the first day of the New Year that the announcement was made, almost simultaneously from three observatories, that the motion of the planet Neptune, the outermost of all the planets that wheel about the sun,...
- Raw/generated end: ...ference seems to be a shrinkage of the white discoloration (supposed to be frozen water) round either pole.” Which only shows how small the vastest of human catastrophes may seem, at a distance of a few million miles. / ...ference seems to be a shrinkage of the white discoloration (supposed to be frozen water) round either pole.” Which only shows how small the vastest of human catastrophes may seem, at a distance of a few million miles.
- Preview start: It was on the first day of the New Year that the announcement was made, almost simultaneously from three observatories, that the motion of the planet Neptune, the outermost of all the planets that wheel about the sun,...

### the-stolen-bacillus

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-stolen-bacillus/manifest.json, app/client/assets/books/generated/the-stolen-bacillus/cleaned_book.json, app/client/assets/books/generated/the-stolen-bacillus/processed_book.json, app/client/assets/books/generated/the-stolen-bacillus/rights_report.json, app/client/assets/books/generated/the-stolen-bacillus/processing_notes.md, app/client/assets/books/generated/the-stolen-bacillus/sections/chapter-001.json
- Preview inspected: public/book-previews/the-stolen-bacillus.preview.json
- Title: pass - Individual title preserved exactly as "The Stolen Bacillus"; parent collection "The Stolen Bacillus and Other Incidents" is excluded from title and playback.
- Author metadata: pass - H. G. Wells is source-backed as author, no Unknown Author appears, and no parent collection metadata replaces the individual story metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: THE STOLEN BACILLUS
- Metadata evidence: Author: H. G. Wells; author as identified by the source
- Raw/generated start: "This again," said the Bacteriologist, slipping a glass slide under the microscope, "is a preparation of the celebrated Bacillus of cholera--the cholera germ." The pale-faced man peered down the microscope. He was evi... / "This again," said the Bacteriologist, slipping a glass slide under the microscope, "is a preparation of the celebrated Bacillus of cholera--the cholera germ." The pale-faced man peered down the microscope. He was evi...
- Raw/generated end: ...pense of preparing some more. "Put on my coat on this hot day! Why? Because we might meet Mrs Jabber. My dear, Mrs Jabber is not a draught. But why should I wear a coat on a hot day because of Mrs--. Oh! _very_ well." / ...pense of preparing some more. "Put on my coat on this hot day! Why? Because we might meet Mrs Jabber. My dear, Mrs Jabber is not a draught. But why should I wear a coat on a hot day because of Mrs--. Oh! _very_ well."
- Preview start: "This again," said the Bacteriologist, slipping a glass slide under the microscope, "is a preparation of the celebrated Bacillus of cholera--the cholera germ." The pale-faced man peered down the microscope. He was evi...

### the-stolen-body

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-stolen-body/manifest.json, app/client/assets/books/generated/the-stolen-body/cleaned_book.json, app/client/assets/books/generated/the-stolen-body/processed_book.json, app/client/assets/books/generated/the-stolen-body/rights_report.json, app/client/assets/books/generated/the-stolen-body/processing_notes.md, app/client/assets/books/generated/the-stolen-body/sections/chapter-001.json
- Preview inspected: public/book-previews/the-stolen-body.preview.json
- Title: pass - Individual title preserved exactly as "The Stolen Body"; parent collection "Twelve Stories and a Dream" is excluded from title and playback.
- Author metadata: pass - H. G. Wells is source-backed as author, no Unknown Author appears, and no parent collection metadata replaces the individual story metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: THE STOLEN BODY
- Metadata evidence: Author: H. G. Wells; author as identified by the source
- Raw/generated start: Mr. Bessel was the senior partner in the firm of Bessel, Hart, and Brown, of St. Paul's Churchyard, and for many years he was well known among those interested in psychical research as a liberal-minded and conscientio... / Mr. Bessel was the senior partner in the firm of Bessel, Hart, and Brown, of St. Paul's Churchyard, and for many years he was well known among those interested in psychical research as a liberal-minded and conscientio...
- Raw/generated end: ...unds, and of the dim damp place in which he lay; in spite of the tears—wrung from him by his physical distress—his heart was full of gladness to know that he was nevertheless back once more in the kindly world of men. / ...unds, and of the dim damp place in which he lay; in spite of the tears—wrung from him by his physical distress—his heart was full of gladness to know that he was nevertheless back once more in the kindly world of men.
- Preview start: Mr. Bessel was the senior partner in the firm of Bessel, Hart, and Brown, of St. Paul's Churchyard, and for many years he was well known among those interested in psychical research as a liberal-minded and conscientio...

### the-temptation-of-harringay

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-temptation-of-harringay/manifest.json, app/client/assets/books/generated/the-temptation-of-harringay/cleaned_book.json, app/client/assets/books/generated/the-temptation-of-harringay/processed_book.json, app/client/assets/books/generated/the-temptation-of-harringay/rights_report.json, app/client/assets/books/generated/the-temptation-of-harringay/processing_notes.md, app/client/assets/books/generated/the-temptation-of-harringay/sections/chapter-001.json
- Preview inspected: public/book-previews/the-temptation-of-harringay.preview.json
- Title: pass - Individual title preserved exactly as "The Temptation of Harringay"; parent collection "The Stolen Bacillus and Other Incidents" is excluded from title and playback.
- Author metadata: pass - H. G. Wells is source-backed as author, no Unknown Author appears, and no parent collection metadata replaces the individual story metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: THE TEMPTATION OF HARRINGAY
- Metadata evidence: Author: H. G. Wells; author as identified by the source
- Raw/generated start: It is quite impossible to say whether this thing really happened. It depends entirely on the word of R.M. Harringay, who is an artist. Following his version of the affair, the narrative deposes that Harringay went int... / It is quite impossible to say whether this thing really happened. It depends entirely on the word of R.M. Harringay, who is an artist. Following his version of the affair, the narrative deposes that Harringay went int...
- Raw/generated end: ... supports it by a small canvas (24 by 20) enamelled a pale green, and by violent asseverations. It is also true that he never has produced a masterpiece, and in the opinion of his intimate friends probably never will. / ... supports it by a small canvas (24 by 20) enamelled a pale green, and by violent asseverations. It is also true that he never has produced a masterpiece, and in the opinion of his intimate friends probably never will.
- Preview start: It is quite impossible to say whether this thing really happened. It depends entirely on the word of R.M. Harringay, who is an artist. Following his version of the affair, the narrative deposes that Harringay went int...

### the-treasure-in-the-forest

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-treasure-in-the-forest/manifest.json, app/client/assets/books/generated/the-treasure-in-the-forest/cleaned_book.json, app/client/assets/books/generated/the-treasure-in-the-forest/processed_book.json, app/client/assets/books/generated/the-treasure-in-the-forest/rights_report.json, app/client/assets/books/generated/the-treasure-in-the-forest/processing_notes.md, app/client/assets/books/generated/the-treasure-in-the-forest/sections/chapter-001.json
- Preview inspected: public/book-previews/the-treasure-in-the-forest.preview.json
- Title: pass - Individual title preserved exactly as "The Treasure in the Forest"; parent collection "The Stolen Bacillus and Other Incidents" is excluded from title and playback.
- Author metadata: pass - H. G. Wells is source-backed as author, no Unknown Author appears, and no parent collection metadata replaces the individual story metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: THE TREASURE IN THE FOREST
- Metadata evidence: Author: H. G. Wells; author as identified by the source
- Raw/generated start: The canoe was now approaching the land. The bay opened out, and a gap in the white surf of the reef marked where the little river ran out to the sea; the thicker and deeper green of the virgin forest showed its course... / The canoe was now approaching the land. The bay opened out, and a gap in the white surf of the reef marked where the little river ran out to the sea; the thicker and deeper green of the virgin forest showed its course...
- Raw/generated end: ...is mind again. The dull pain spread towards his throat and grew slowly in intensity. Far above him a faint breeze stirred the greenery, and the white petals of some unknown flower came floating down through the gloom. / ...is mind again. The dull pain spread towards his throat and grew slowly in intensity. Far above him a faint breeze stirred the greenery, and the white petals of some unknown flower came floating down through the gloom.
- Preview start: The canoe was now approaching the land. The bay opened out, and a gap in the white surf of the reef marked where the little river ran out to the sea; the thicker and deeper green of the virgin forest showed its course...

### the-triumphs-of-a-taxidermist

- Status: pass
- Generated output inspected: app/client/assets/books/generated/the-triumphs-of-a-taxidermist/manifest.json, app/client/assets/books/generated/the-triumphs-of-a-taxidermist/cleaned_book.json, app/client/assets/books/generated/the-triumphs-of-a-taxidermist/processed_book.json, app/client/assets/books/generated/the-triumphs-of-a-taxidermist/rights_report.json, app/client/assets/books/generated/the-triumphs-of-a-taxidermist/processing_notes.md, app/client/assets/books/generated/the-triumphs-of-a-taxidermist/sections/chapter-001.json
- Preview inspected: public/book-previews/the-triumphs-of-a-taxidermist.preview.json
- Title: pass - Individual title preserved exactly as "The Triumphs of a Taxidermist"; parent collection "The Stolen Bacillus and Other Incidents" is excluded from title and playback.
- Author metadata: pass - H. G. Wells is source-backed as author, no Unknown Author appears, and no parent collection metadata replaces the individual story metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: THE TRIUMPHS OF A TAXIDERMIST
- Metadata evidence: Author: H. G. Wells; author as identified by the source
- Raw/generated start: Here are some of the secrets of taxidermy. They were told me by the taxidermist in a mood of elation. He told me them in the time between the first glass of whisky and the fourth, when a man is no longer cautious and ... / Here are some of the secrets of taxidermy. They were told me by the taxidermist in a mood of elation. He told me them in the time between the first glass of whisky and the fourth, when a man is no longer cautious and ...
- Raw/generated end: ...e confirmation of distinguished ornithological writers. And the note about the New Zealand bird certainly appeared in a morning paper of unblemished reputation, for the Taxidermist keeps a copy and has shown it to me. / ...e confirmation of distinguished ornithological writers. And the note about the New Zealand bird certainly appeared in a morning paper of unblemished reputation, for the Taxidermist keeps a copy and has shown it to me.
- Preview start: Here are some of the secrets of taxidermy. They were told me by the taxidermist in a mood of elation. He told me them in the time between the first glass of whisky and the fourth, when a man is no longer cautious and ...

### through-a-window

- Status: pass
- Generated output inspected: app/client/assets/books/generated/through-a-window/manifest.json, app/client/assets/books/generated/through-a-window/cleaned_book.json, app/client/assets/books/generated/through-a-window/processed_book.json, app/client/assets/books/generated/through-a-window/rights_report.json, app/client/assets/books/generated/through-a-window/processing_notes.md, app/client/assets/books/generated/through-a-window/sections/chapter-001.json
- Preview inspected: public/book-previews/through-a-window.preview.json
- Title: pass - Individual title preserved exactly as "Through a Window"; parent collection "The Stolen Bacillus and Other Incidents" is excluded from title and playback.
- Author metadata: pass - H. G. Wells is source-backed as author, no Unknown Author appears, and no parent collection metadata replaces the individual story metadata.
- Raw vs generated: pass - Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character.
- Start boundary: pass - Body starts at the dry-run verified first readable prose phrase.
- End boundary: pass - True readable ending and final sentence are preserved exactly after sanitization.
- Sectioning: pass - One source-based section is appropriate for this undivided tale and is default-selected.
- Cleanup/prose preservation: pass - No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact.
- Preview: pass - Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback.
- All main readable default: pass - All readable story content is included by default and selected/default source order begins with the first section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Title evidence: THROUGH A WINDOW
- Metadata evidence: Author: H. G. Wells; author as identified by the source
- Raw/generated start: After his legs were set, they carried Bailey into the study and put him on a couch before the open window. There he lay, a live--even a feverish man down to the loins, and below that a double-barrelled mummy swathed i... / After his legs were set, they carried Bailey into the study and put him on a couch before the open window. There he lay, a live--even a feverish man down to the loins, and below that a double-barrelled mummy swathed i...
- Raw/generated end: ... those legs," said Bailey, as young Fitzgibbon and one of the boating party lifted the body off him. Young Fitzgibbon was very white in the face. "I didn't mean to kill him," he said. "It's just as well," said Bailey. / ... those legs," said Bailey, as young Fitzgibbon and one of the boating party lifted the body off him. Young Fitzgibbon was very white in the face. "I didn't mean to kill him," he said. "It's just as well," said Bailey.
- Preview start: After his legs were set, they carried Bailey into the study and put him on a couch before the open window. There he lay, a live--even a feverish man down to the loins, and below that a double-barrelled mummy swathed i...

## Protections and Audit Side Effects

- Raw sources modified: no
- Cloudflare exports modified: no
- Unresolved-source generated books untouched: yes
- Duplicate/boundary skips not reintroduced: yes
- Unrelated generated/preview changes: none
- Audit side-effect handling: pass: restored pilot-write rerun report churn, audit-report timestamps, and title-audit changes to 23 unrelated generated/preview books; no audit-only production changes retained

## Browser and Playwright

- In-app Browser invocation failed because required sandbox-policy metadata was absent; standalone Playwright fallback was explicitly required by this task.
- Standalone Playwright: 35/36 passed; only the known fullscreen-controls visibility assertion failed at morse-book-page.spec.ts:1071
- Known fullscreen-only failure: yes

## Validation

- typecheck: pass
- pilotWrite21: pass: 20 first-time processed, 0 skipped, 11 unresolved-source books untouched
- batch12ProseRestore: pass: 20/20 exact, 0 remaining mismatches/omissions/opening-quote defects
- startupPreviewAudit: pass: 435/435 valid, 0 preview updates
- titleStartDefaultAudit: pass: 435 audited, 12 known unrelated corrections reported, 0 accepted books revoked; churn restored
- metadataSegmentationAudit: pass (exit 0); generated audit report churn restored
- manualUiDefectFollowup: pass: 8 checked, 8 acceptable, 0 corrected/revoked/manual review
- targetedVerifier: pass: 20/20 books, raw/generated 20/20 exact
- appBuild: pass with NODE_OPTIONS=--max-old-space-size=8192; default heap completed client build but exhausted memory during SSR
- standalonePlaywright: 35/36 passed; only the known fullscreen-controls visibility assertion failed at morse-book-page.spec.ts:1071
- smokeTests: pass: 23/23 smoke tests
- gitDiffCheck: pass

## Backlog Note from pilot-write-21

- Dry-run 21 still had 76 skipped/unsafe raw-only candidates before write.
- These are not treated as lost or missed.
- After safe batching slows/exhausts, create a dedicated remaining raw inventory/triage report classifying every unprocessed raw file.
