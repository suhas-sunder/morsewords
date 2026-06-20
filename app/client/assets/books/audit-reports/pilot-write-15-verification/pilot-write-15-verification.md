# Pilot write batch 15 verification

Generated: 2026-06-20T03:13:29.818Z

## Summary

- Verified: 20
- Pass: 20
- Warn accepted: 0
- Fail: 0
- Accepted for main: 20
- Correction needed before main: 0

## Shared Script Scope

- Classification: harmless shared implementation intentionally used by write batch 15
- Resolution: Retain the shared writer diff: batch 15 follows the existing write-13/write-14 wrapper pattern, selects only the dry-run 15 slugs through MORSEWORDS_PILOT_WRITE_BATCH=15, and adds raw-vs-generated body comparison/report fields used by this controlled pass.
- Unrelated changes found: no

## Batch-12 Prose Restoration

- Result: pass
- Compared: 20
- Remaining prose omissions: 0
- Remaining missing opening-quote defects: 0

## Books

### a-bread-and-butter-miss

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/a-bread-and-butter-miss/manifest.json, app/client/assets/books/generated/a-bread-and-butter-miss/cleaned_book.json, app/client/assets/books/generated/a-bread-and-butter-miss/processed_book.json, app/client/assets/books/generated/a-bread-and-butter-miss/rights_report.json, app/client/assets/books/generated/a-bread-and-butter-miss/processing_notes.md, app/client/assets/books/generated/a-bread-and-butter-miss/sections/chapter-001.json
- Preview inspected: public/book-previews/a-bread-and-butter-miss.preview.json
- Title verdict: Individual story title preserved as A Bread and Butter Miss; source heading was A BREAD AND BUTTER MISS.
- Author verdict: Author metadata is source-backed by the Project Gutenberg Author: Saki header.
- Raw-vs-generated body comparison: Sanitized raw story body matches generated section, cleaned_book, processed_book, and morse source text character-for-character.
- Start boundary verdict: Generated body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: Generated body preserves the true cleaned-source story ending.
- Sectioning verdict: Single-section output is source-based and legitimate for this undivided story.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license, contributor, transcriber, byline-only material, artifact text, prose, punctuation, quote mark, dialogue, or ending sentence was removed from the story body.
- Preview verdict: Preview is book-specific, starts at real readable content, and contains no SOS Help or generic fallback text.
- All-main-readable-default verdict: All main readable story content is included by default and source order begins with the first selected/default section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: A BREAD AND BUTTER MISS
- Author evidence: Author: Saki
- Start evidence: “Starling Chatter and Oakhill have both dropped back in the betting,” said Bertie van Tahn, throwing the morning paper across the breakfast table. “That leaves Nursery Tea practically favourite,” said Odo Finsberry. “... / “Starling Chatter and Oakhill have both dropped back in the betting,” said Bertie van Tahn, throwing the morning paper across the breakfast table. “That leaves Nursery Tea practically favourite,” said Odo Finsberry. “...
- End evidence: ...r the second time that day Lola retired to the seclusion of her room; she could not face the universal looks of reproach directed at her when Whitebait was announced winner at the comfortable price of fourteen to one. / ...r the second time that day Lola retired to the seclusion of her room; she could not face the universal looks of reproach directed at her when Whitebait was announced winner at the comfortable price of fourteen to one.
- Preview evidence: “Starling Chatter and Oakhill have both dropped back in the betting,” said Bertie van Tahn, throwing the morning paper across the breakfast table. “That leaves Nursery Tea practically favourite,” said Odo Finsberry. “...

### bertie-s-christmas-eve

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/bertie-s-christmas-eve/manifest.json, app/client/assets/books/generated/bertie-s-christmas-eve/cleaned_book.json, app/client/assets/books/generated/bertie-s-christmas-eve/processed_book.json, app/client/assets/books/generated/bertie-s-christmas-eve/rights_report.json, app/client/assets/books/generated/bertie-s-christmas-eve/processing_notes.md, app/client/assets/books/generated/bertie-s-christmas-eve/sections/chapter-001.json
- Preview inspected: public/book-previews/bertie-s-christmas-eve.preview.json
- Title verdict: Individual story title preserved as Bertie’s Christmas Eve; source heading was BERTIE’S CHRISTMAS EVE.
- Author verdict: Author metadata is source-backed by the Project Gutenberg Author: Saki header.
- Raw-vs-generated body comparison: Sanitized raw story body matches generated section, cleaned_book, processed_book, and morse source text character-for-character.
- Start boundary verdict: Generated body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: Generated body preserves the true cleaned-source story ending.
- Sectioning verdict: Single-section output is source-based and legitimate for this undivided story.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license, contributor, transcriber, byline-only material, artifact text, prose, punctuation, quote mark, dialogue, or ending sentence was removed from the story body.
- Preview verdict: Preview is book-specific, starts at real readable content, and contains no SOS Help or generic fallback text.
- All-main-readable-default verdict: All main readable story content is included by default and source order begins with the first selected/default section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: BERTIE’S CHRISTMAS EVE
- Author evidence: Author: Saki
- Start evidence: It was Christmas Eve, and the family circle of Luke Steffink, Esq., was aglow with the amiability and random mirth which the occasion demanded. A long and lavish dinner had been partaken of, waits had been round and s... / It was Christmas Eve, and the family circle of Luke Steffink, Esq., was aglow with the amiability and random mirth which the occasion demanded. A long and lavish dinner had been partaken of, waits had been round and s...
- End evidence: ... that followed in his steps came in for a good deal of the adverse comment that his exuberant display had evoked. It was the happiest Christmas Eve he had ever spent. To quote his own words, he had a rotten Christmas. / ... that followed in his steps came in for a good deal of the adverse comment that his exuberant display had evoked. It was the happiest Christmas Eve he had ever spent. To quote his own words, he had a rotten Christmas.
- Preview evidence: It was Christmas Eve, and the family circle of Luke Steffink, Esq., was aglow with the amiability and random mirth which the occasion demanded. A long and lavish dinner had been partaken of, waits had been round and s...

### excepting-mrs-pentherby

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/excepting-mrs-pentherby/manifest.json, app/client/assets/books/generated/excepting-mrs-pentherby/cleaned_book.json, app/client/assets/books/generated/excepting-mrs-pentherby/processed_book.json, app/client/assets/books/generated/excepting-mrs-pentherby/rights_report.json, app/client/assets/books/generated/excepting-mrs-pentherby/processing_notes.md, app/client/assets/books/generated/excepting-mrs-pentherby/sections/chapter-001.json
- Preview inspected: public/book-previews/excepting-mrs-pentherby.preview.json
- Title verdict: Individual story title preserved as Excepting Mrs. Pentherby; source heading was EXCEPTING MRS. PENTHERBY.
- Author verdict: Author metadata is source-backed by the Project Gutenberg Author: Saki header.
- Raw-vs-generated body comparison: Sanitized raw story body matches generated section, cleaned_book, processed_book, and morse source text character-for-character.
- Start boundary verdict: Generated body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: Generated body preserves the true cleaned-source story ending.
- Sectioning verdict: Single-section output is source-based and legitimate for this undivided story.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license, contributor, transcriber, byline-only material, artifact text, prose, punctuation, quote mark, dialogue, or ending sentence was removed from the story body.
- Preview verdict: Preview is book-specific, starts at real readable content, and contains no SOS Help or generic fallback text.
- All-main-readable-default verdict: All main readable story content is included by default and source order begins with the first selected/default section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: EXCEPTING MRS. PENTHERBY
- Author evidence: Author: Saki
- Start evidence: It was Reggie Bruttle’s own idea for converting what had threatened to be an albino elephant into a beast of burden that should help him along the stony road of his finances. “The Limes,” which had come to him by inhe... / It was Reggie Bruttle’s own idea for converting what had threatened to be an albino elephant into a beast of burden that should help him along the stony road of his finances. “The Limes,” which had come to him by inhe...
- End evidence: ...e whole world,” said Reggie’s sister-in-law. Which was not strictly true; more than anybody, more than ever she disliked Mrs. Pentherby. It was impossible to calculate how many quarrels that woman had done her out of. / ...e whole world,” said Reggie’s sister-in-law. Which was not strictly true; more than anybody, more than ever she disliked Mrs. Pentherby. It was impossible to calculate how many quarrels that woman had done her out of.
- Preview evidence: It was Reggie Bruttle’s own idea for converting what had threatened to be an albino elephant into a beast of burden that should help him along the stony road of his finances. “The Limes,” which had come to him by inhe...

### fate

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/fate/manifest.json, app/client/assets/books/generated/fate/cleaned_book.json, app/client/assets/books/generated/fate/processed_book.json, app/client/assets/books/generated/fate/rights_report.json, app/client/assets/books/generated/fate/processing_notes.md, app/client/assets/books/generated/fate/sections/chapter-001.json
- Preview inspected: public/book-previews/fate.preview.json
- Title verdict: Individual story title preserved as Fate; source heading was FATE.
- Author verdict: Author metadata is source-backed by the Project Gutenberg Author: Saki header.
- Raw-vs-generated body comparison: Sanitized raw story body matches generated section, cleaned_book, processed_book, and morse source text character-for-character.
- Start boundary verdict: Generated body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: Generated body preserves the true cleaned-source story ending.
- Sectioning verdict: Single-section output is source-based and legitimate for this undivided story.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license, contributor, transcriber, byline-only material, artifact text, prose, punctuation, quote mark, dialogue, or ending sentence was removed from the story body.
- Preview verdict: Preview is book-specific, starts at real readable content, and contains no SOS Help or generic fallback text.
- All-main-readable-default verdict: All main readable story content is included by default and source order begins with the first selected/default section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: FATE
- Author evidence: Author: Saki
- Start evidence: Rex Dillot was nearly twenty-four, almost good-looking and quite penniless. His mother was supposed to make him some sort of an allowance out of what her creditors allowed her, and Rex occasionally strayed into the ra... / Rex Dillot was nearly twenty-four, almost good-looking and quite penniless. His mother was supposed to make him some sort of an allowance out of what her creditors allowed her, and Rex occasionally strayed into the ra...
- End evidence: ...t place to have chosen for the scene of salvage operations; but then, as Clovis remarked, when one is rushing about with a blazing woman in one’s arms one can’t stop to think out exactly where one is going to put her. / ...t place to have chosen for the scene of salvage operations; but then, as Clovis remarked, when one is rushing about with a blazing woman in one’s arms one can’t stop to think out exactly where one is going to put her.
- Preview evidence: Rex Dillot was nearly twenty-four, almost good-looking and quite penniless. His mother was supposed to make him some sort of an allowance out of what her creditors allowed her, and Rex occasionally strayed into the ra...

### forewarned

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/forewarned/manifest.json, app/client/assets/books/generated/forewarned/cleaned_book.json, app/client/assets/books/generated/forewarned/processed_book.json, app/client/assets/books/generated/forewarned/rights_report.json, app/client/assets/books/generated/forewarned/processing_notes.md, app/client/assets/books/generated/forewarned/sections/chapter-001.json
- Preview inspected: public/book-previews/forewarned.preview.json
- Title verdict: Individual story title preserved as Forewarned; source heading was FOREWARNED.
- Author verdict: Author metadata is source-backed by the Project Gutenberg Author: Saki header.
- Raw-vs-generated body comparison: Sanitized raw story body matches generated section, cleaned_book, processed_book, and morse source text character-for-character.
- Start boundary verdict: Generated body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: Generated body preserves the true cleaned-source story ending.
- Sectioning verdict: Single-section output is source-based and legitimate for this undivided story.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license, contributor, transcriber, byline-only material, artifact text, prose, punctuation, quote mark, dialogue, or ending sentence was removed from the story body.
- Preview verdict: Preview is book-specific, starts at real readable content, and contains no SOS Help or generic fallback text.
- All-main-readable-default verdict: All main readable story content is included by default and source order begins with the first selected/default section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: FOREWARNED
- Author evidence: Author: Saki
- Start evidence: Alethia Debchance sat in a corner of an otherwise empty railway carriage, more or less at ease as regarded body, but in some trepidation as to mind. She had embarked on a social adventure of no little magnitude as com... / Alethia Debchance sat in a corner of an otherwise empty railway carriage, more or less at ease as regarded body, but in some trepidation as to mind. She had embarked on a social adventure of no little magnitude as com...
- End evidence: ...unscathed through it, but what might have happened if she had gone unsuspectingly to visit Sir John Chobham and warn him of his danger? What indeed! She had been saved by the fearless outspokenness of the local Press. / ...unscathed through it, but what might have happened if she had gone unsuspectingly to visit Sir John Chobham and warn him of his danger? What indeed! She had been saved by the fearless outspokenness of the local Press.
- Preview evidence: Alethia Debchance sat in a corner of an otherwise empty railway carriage, more or less at ease as regarded body, but in some trepidation as to mind. She had embarked on a social adventure of no little magnitude as com...

### hyacinth

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/hyacinth/manifest.json, app/client/assets/books/generated/hyacinth/cleaned_book.json, app/client/assets/books/generated/hyacinth/processed_book.json, app/client/assets/books/generated/hyacinth/rights_report.json, app/client/assets/books/generated/hyacinth/processing_notes.md, app/client/assets/books/generated/hyacinth/sections/chapter-001.json
- Preview inspected: public/book-previews/hyacinth.preview.json
- Title verdict: Individual story title preserved as Hyacinth; source heading was HYACINTH.
- Author verdict: Author metadata is source-backed by the Project Gutenberg Author: Saki header.
- Raw-vs-generated body comparison: Sanitized raw story body matches generated section, cleaned_book, processed_book, and morse source text character-for-character.
- Start boundary verdict: Generated body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: Generated body preserves the true cleaned-source story ending.
- Sectioning verdict: Single-section output is source-based and legitimate for this undivided story.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license, contributor, transcriber, byline-only material, artifact text, prose, punctuation, quote mark, dialogue, or ending sentence was removed from the story body.
- Preview verdict: Preview is book-specific, starts at real readable content, and contains no SOS Help or generic fallback text.
- All-main-readable-default verdict: All main readable story content is included by default and source order begins with the first selected/default section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: HYACINTH
- Author evidence: Author: Saki
- Start evidence: “The new fashion of introducing the candidate’s children into an election contest is a pretty one,” said Mrs. Panstreppon; “it takes away something from the acerbity of party warfare, and it makes an interesting exper... / “The new fashion of introducing the candidate’s children into an election contest is a pretty one,” said Mrs. Panstreppon; “it takes away something from the acerbity of party warfare, and it makes an interesting exper...
- End evidence: ...emes,” said Mrs. Panstreppon; “if there should be a general election in Mexico I think you might safely let him go there, but I doubt whether our English politics are suited to the rough and tumble of an angel-child.” / ...emes,” said Mrs. Panstreppon; “if there should be a general election in Mexico I think you might safely let him go there, but I doubt whether our English politics are suited to the rough and tumble of an angel-child.”
- Preview evidence: “The new fashion of introducing the candidate’s children into an election contest is a pretty one,” said Mrs. Panstreppon; “it takes away something from the acerbity of party warfare, and it makes an interesting exper...

### louis

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/louis/manifest.json, app/client/assets/books/generated/louis/cleaned_book.json, app/client/assets/books/generated/louis/processed_book.json, app/client/assets/books/generated/louis/rights_report.json, app/client/assets/books/generated/louis/processing_notes.md, app/client/assets/books/generated/louis/sections/chapter-001.json
- Preview inspected: public/book-previews/louis.preview.json
- Title verdict: Individual story title preserved as Louis; source heading was LOUIS.
- Author verdict: Author metadata is source-backed by the Project Gutenberg Author: Saki header.
- Raw-vs-generated body comparison: Sanitized raw story body matches generated section, cleaned_book, processed_book, and morse source text character-for-character.
- Start boundary verdict: Generated body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: Generated body preserves the true cleaned-source story ending.
- Sectioning verdict: Single-section output is source-based and legitimate for this undivided story.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license, contributor, transcriber, byline-only material, artifact text, prose, punctuation, quote mark, dialogue, or ending sentence was removed from the story body.
- Preview verdict: Preview is book-specific, starts at real readable content, and contains no SOS Help or generic fallback text.
- All-main-readable-default verdict: All main readable story content is included by default and source order begins with the first selected/default section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: LOUIS
- Author evidence: Author: Saki
- Start evidence: “It would be jolly to spend Easter in Vienna this year,” said Strudwarden, “and look up some of my old friends there. It’s about the jolliest place I know of to be at for Easter—” “I thought we had made up our minds t... / “It would be jolly to spend Easter in Vienna this year,” said Strudwarden, “and look up some of my old friends there. It’s about the jolliest place I know of to be at for Easter—” “I thought we had made up our minds t...
- End evidence: ...eep, if you really feel it so much; anything would be better than standing there staring as if you thought I had lost my reason.” Lena Strudwarden did not weep, but her attempt at laughing was an unmistakable failure. / ...eep, if you really feel it so much; anything would be better than standing there staring as if you thought I had lost my reason.” Lena Strudwarden did not weep, but her attempt at laughing was an unmistakable failure.
- Preview evidence: “It would be jolly to spend Easter in Vienna this year,” said Strudwarden, “and look up some of my old friends there. It’s about the jolliest place I know of to be at for Easter—” “I thought we had made up our minds t...

### louise

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/louise/manifest.json, app/client/assets/books/generated/louise/cleaned_book.json, app/client/assets/books/generated/louise/processed_book.json, app/client/assets/books/generated/louise/rights_report.json, app/client/assets/books/generated/louise/processing_notes.md, app/client/assets/books/generated/louise/sections/chapter-001.json
- Preview inspected: public/book-previews/louise.preview.json
- Title verdict: Individual story title preserved as Louise; source heading was LOUISE.
- Author verdict: Author metadata is source-backed by the Project Gutenberg Author: Saki header.
- Raw-vs-generated body comparison: Sanitized raw story body matches generated section, cleaned_book, processed_book, and morse source text character-for-character.
- Start boundary verdict: Generated body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: Generated body preserves the true cleaned-source story ending.
- Sectioning verdict: Single-section output is source-based and legitimate for this undivided story.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license, contributor, transcriber, byline-only material, artifact text, prose, punctuation, quote mark, dialogue, or ending sentence was removed from the story body.
- Preview verdict: Preview is book-specific, starts at real readable content, and contains no SOS Help or generic fallback text.
- All-main-readable-default verdict: All main readable story content is included by default and source order begins with the first selected/default section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: LOUISE
- Author evidence: Author: Saki
- Start evidence: “The tea will be quite cold, you’d better ring for some more,” said the Dowager Lady Beanford. Susan Lady Beanford was a vigorous old woman who had coquetted with imaginary ill-health for the greater part of a lifetim... / “The tea will be quite cold, you’d better ring for some more,” said the Dowager Lady Beanford. Susan Lady Beanford was a vigorous old woman who had coquetted with imaginary ill-health for the greater part of a lifetim...
- End evidence: ...her to. Anyhow, you can ring up Mornay’s, Robert, and ask whether I left two theatre tickets there. Except for your silk, Susan, those seem to be the only things I’ve forgotten this afternoon. Quite wonderful for me.” / ...her to. Anyhow, you can ring up Mornay’s, Robert, and ask whether I left two theatre tickets there. Except for your silk, Susan, those seem to be the only things I’ve forgotten this afternoon. Quite wonderful for me.”
- Preview evidence: “The tea will be quite cold, you’d better ring for some more,” said the Dowager Lady Beanford. Susan Lady Beanford was a vigorous old woman who had coquetted with imaginary ill-health for the greater part of a lifetim...

### morlvera

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/morlvera/manifest.json, app/client/assets/books/generated/morlvera/cleaned_book.json, app/client/assets/books/generated/morlvera/processed_book.json, app/client/assets/books/generated/morlvera/rights_report.json, app/client/assets/books/generated/morlvera/processing_notes.md, app/client/assets/books/generated/morlvera/sections/chapter-001.json
- Preview inspected: public/book-previews/morlvera.preview.json
- Title verdict: Individual story title preserved as Morlvera; source heading was MORLVERA.
- Author verdict: Author metadata is source-backed by the Project Gutenberg Author: Saki header.
- Raw-vs-generated body comparison: Sanitized raw story body matches generated section, cleaned_book, processed_book, and morse source text character-for-character.
- Start boundary verdict: Generated body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: Generated body preserves the true cleaned-source story ending.
- Sectioning verdict: Single-section output is source-based and legitimate for this undivided story.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license, contributor, transcriber, byline-only material, artifact text, prose, punctuation, quote mark, dialogue, or ending sentence was removed from the story body.
- Preview verdict: Preview is book-specific, starts at real readable content, and contains no SOS Help or generic fallback text.
- All-main-readable-default verdict: All main readable story content is included by default and source order begins with the first selected/default section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: MORLVERA
- Author evidence: Author: Saki
- Start evidence: The Olympic Toy Emporium occupied a conspicuous frontage in an important West End street. It was happily named Toy Emporium, because one would never have dreamed of according it the familiar and yet pulse-quickening n... / The Olympic Toy Emporium occupied a conspicuous frontage in an important West End street. It was happily named Toy Emporium, because one would never have dreamed of according it the familiar and yet pulse-quickening n...
- End evidence: ... the waterside in St. James’s Park, Emmeline said in a solemn undertone to Bert— “I’ve bin finking. Do you know oo ’e was? ’E was ’er little boy wot she’d sent away to live wiv poor folks. ’E come back and done that.” / ... the waterside in St. James’s Park, Emmeline said in a solemn undertone to Bert— “I’ve bin finking. Do you know oo ’e was? ’E was ’er little boy wot she’d sent away to live wiv poor folks. ’E come back and done that.”
- Preview evidence: The Olympic Toy Emporium occupied a conspicuous frontage in an important West End street. It was happily named Toy Emporium, because one would never have dreamed of according it the familiar and yet pulse-quickening n...

### tea

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/tea/manifest.json, app/client/assets/books/generated/tea/cleaned_book.json, app/client/assets/books/generated/tea/processed_book.json, app/client/assets/books/generated/tea/rights_report.json, app/client/assets/books/generated/tea/processing_notes.md, app/client/assets/books/generated/tea/sections/chapter-001.json
- Preview inspected: public/book-previews/tea.preview.json
- Title verdict: Individual story title preserved as Tea; source heading was TEA.
- Author verdict: Author metadata is source-backed by the Project Gutenberg Author: Saki header.
- Raw-vs-generated body comparison: Sanitized raw story body matches generated section, cleaned_book, processed_book, and morse source text character-for-character.
- Start boundary verdict: Generated body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: Generated body preserves the true cleaned-source story ending.
- Sectioning verdict: Single-section output is source-based and legitimate for this undivided story.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license, contributor, transcriber, byline-only material, artifact text, prose, punctuation, quote mark, dialogue, or ending sentence was removed from the story body.
- Preview verdict: Preview is book-specific, starts at real readable content, and contains no SOS Help or generic fallback text.
- All-main-readable-default verdict: All main readable story content is included by default and source order begins with the first selected/default section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: TEA
- Author evidence: Author: Saki
- Start evidence: James Cushat-Prinkly was a young man who had always had a settled conviction that one of these days he would marry; up to the age of thirty-four he had done nothing to justify that conviction. He liked and admired a g... / James Cushat-Prinkly was a young man who had always had a settled conviction that one of these days he would marry; up to the age of thirty-four he had done nothing to justify that conviction. He liked and admired a g...
- End evidence: ... behind a service of dainty porcelain and gleaming silver. There was a pleasant tinkling note in her voice as she handed him a cup. “You like it weaker than that, don’t you? Shall I put some more hot water to it? No?” / ... behind a service of dainty porcelain and gleaming silver. There was a pleasant tinkling note in her voice as she handed him a cup. “You like it weaker than that, don’t you? Shall I put some more hot water to it? No?”
- Preview evidence: James Cushat-Prinkly was a young man who had always had a settled conviction that one of these days he would marry; up to the age of thirty-four he had done nothing to justify that conviction. He liked and admired a g...

### the-bull

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-bull/manifest.json, app/client/assets/books/generated/the-bull/cleaned_book.json, app/client/assets/books/generated/the-bull/processed_book.json, app/client/assets/books/generated/the-bull/rights_report.json, app/client/assets/books/generated/the-bull/processing_notes.md, app/client/assets/books/generated/the-bull/sections/chapter-001.json
- Preview inspected: public/book-previews/the-bull.preview.json
- Title verdict: Individual story title preserved as The Bull; source heading was THE BULL.
- Author verdict: Author metadata is source-backed by the Project Gutenberg Author: Saki header.
- Raw-vs-generated body comparison: Sanitized raw story body matches generated section, cleaned_book, processed_book, and morse source text character-for-character.
- Start boundary verdict: Generated body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: Generated body preserves the true cleaned-source story ending.
- Sectioning verdict: Single-section output is source-based and legitimate for this undivided story.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license, contributor, transcriber, byline-only material, artifact text, prose, punctuation, quote mark, dialogue, or ending sentence was removed from the story body.
- Preview verdict: Preview is book-specific, starts at real readable content, and contains no SOS Help or generic fallback text.
- All-main-readable-default verdict: All main readable story content is included by default and source order begins with the first selected/default section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE BULL
- Author evidence: Author: Saki
- Start evidence: Tom Yorkfield had always regarded his half-brother, Laurence, with a lazy instinct of dislike, toned down, as years went on, to a tolerant feeling of indifference. There was nothing very tangible to dislike him for; h... / Tom Yorkfield had always regarded his half-brother, Laurence, with a lazy instinct of dislike, toned down, as years went on, to a tolerant feeling of indifference. There was nothing very tangible to dislike him for; h...
- End evidence: ...de. That was Clover Fairy’s noteworthy achievement, which could never be taken away from him. Laurence continues to be popular as an animal artist, but his subjects are always kittens or fawns or lambkins—never bulls. / ...de. That was Clover Fairy’s noteworthy achievement, which could never be taken away from him. Laurence continues to be popular as an animal artist, but his subjects are always kittens or fawns or lambkins—never bulls.
- Preview evidence: Tom Yorkfield had always regarded his half-brother, Laurence, with a lazy instinct of dislike, toned down, as years went on, to a tolerant feeling of indifference. There was nothing very tangible to dislike him for; h...

### the-cupboard-of-the-yesterdays

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-cupboard-of-the-yesterdays/manifest.json, app/client/assets/books/generated/the-cupboard-of-the-yesterdays/cleaned_book.json, app/client/assets/books/generated/the-cupboard-of-the-yesterdays/processed_book.json, app/client/assets/books/generated/the-cupboard-of-the-yesterdays/rights_report.json, app/client/assets/books/generated/the-cupboard-of-the-yesterdays/processing_notes.md, app/client/assets/books/generated/the-cupboard-of-the-yesterdays/sections/chapter-001.json
- Preview inspected: public/book-previews/the-cupboard-of-the-yesterdays.preview.json
- Title verdict: Individual story title preserved as The Cupboard of the Yesterdays; source heading was THE CUPBOARD OF THE YESTERDAYS.
- Author verdict: Author metadata is source-backed by the Project Gutenberg Author: Saki header.
- Raw-vs-generated body comparison: Sanitized raw story body matches generated section, cleaned_book, processed_book, and morse source text character-for-character.
- Start boundary verdict: Generated body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: Generated body preserves the true cleaned-source story ending.
- Sectioning verdict: Single-section output is source-based and legitimate for this undivided story.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license, contributor, transcriber, byline-only material, artifact text, prose, punctuation, quote mark, dialogue, or ending sentence was removed from the story body.
- Preview verdict: Preview is book-specific, starts at real readable content, and contains no SOS Help or generic fallback text.
- All-main-readable-default verdict: All main readable story content is included by default and source order begins with the first selected/default section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE CUPBOARD OF THE YESTERDAYS
- Author evidence: Author: Saki
- Start evidence: “War is a cruelly destructive thing,” said the Wanderer, dropping his newspaper to the floor and staring reflectively into space. “Ah, yes, indeed,” said the Merchant, responding readily to what seemed like a safe pla... / “War is a cruelly destructive thing,” said the Wanderer, dropping his newspaper to the floor and staring reflectively into space. “Ah, yes, indeed,” said the Merchant, responding readily to what seemed like a safe pla...
- End evidence: ...destructive thing.” “Still, you must admit—” began the Merchant. But the Wanderer was not in the mood to admit anything. He rose impatiently and walked to where the tape-machine was busy with the news from Adrianople. / ...destructive thing.” “Still, you must admit—” began the Merchant. But the Wanderer was not in the mood to admit anything. He rose impatiently and walked to where the tape-machine was busy with the news from Adrianople.
- Preview evidence: “War is a cruelly destructive thing,” said the Wanderer, dropping his newspaper to the floor and staring reflectively into space. “Ah, yes, indeed,” said the Merchant, responding readily to what seemed like a safe pla...

### the-disappearance-of-crispina-umberleigh

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-disappearance-of-crispina-umberleigh/manifest.json, app/client/assets/books/generated/the-disappearance-of-crispina-umberleigh/cleaned_book.json, app/client/assets/books/generated/the-disappearance-of-crispina-umberleigh/processed_book.json, app/client/assets/books/generated/the-disappearance-of-crispina-umberleigh/rights_report.json, app/client/assets/books/generated/the-disappearance-of-crispina-umberleigh/processing_notes.md, app/client/assets/books/generated/the-disappearance-of-crispina-umberleigh/sections/chapter-001.json
- Preview inspected: public/book-previews/the-disappearance-of-crispina-umberleigh.preview.json
- Title verdict: Individual story title preserved as The Disappearance of Crispina Umberleigh; source heading was THE DISAPPEARANCE OF CRISPINA UMBERLEIGH.
- Author verdict: Author metadata is source-backed by the Project Gutenberg Author: Saki header.
- Raw-vs-generated body comparison: Sanitized raw story body matches generated section, cleaned_book, processed_book, and morse source text character-for-character.
- Start boundary verdict: Generated body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: Generated body preserves the true cleaned-source story ending.
- Sectioning verdict: Single-section output is source-based and legitimate for this undivided story.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license, contributor, transcriber, byline-only material, artifact text, prose, punctuation, quote mark, dialogue, or ending sentence was removed from the story body.
- Preview verdict: Preview is book-specific, starts at real readable content, and contains no SOS Help or generic fallback text.
- All-main-readable-default verdict: All main readable story content is included by default and source order begins with the first selected/default section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE DISAPPEARANCE OF CRISPINA UMBERLEIGH
- Author evidence: Author: Saki
- Start evidence: In a first-class carriage of a train speeding Balkanward across the flat, green Hungarian plain two Britons sat in friendly, fitful converse. They had first foregathered in the cold grey dawn at the frontier line, whe... / In a first-class carriage of a train speeding Balkanward across the flat, green Hungarian plain two Britons sat in friendly, fitful converse. They had first foregathered in the cold grey dawn at the frontier line, whe...
- End evidence: ...n; the strain of trying to account satisfactorily for an unspecified expenditure of sixteen thousand pounds spread over eight years sufficiently occupied his mental energies. Here is Belgrad and another custom house.” / ...n; the strain of trying to account satisfactorily for an unspecified expenditure of sixteen thousand pounds spread over eight years sufficiently occupied his mental energies. Here is Belgrad and another custom house.”
- Preview evidence: In a first-class carriage of a train speeding Balkanward across the flat, green Hungarian plain two Britons sat in friendly, fitful converse. They had first foregathered in the cold grey dawn at the frontier line, whe...

### the-guests

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-guests/manifest.json, app/client/assets/books/generated/the-guests/cleaned_book.json, app/client/assets/books/generated/the-guests/processed_book.json, app/client/assets/books/generated/the-guests/rights_report.json, app/client/assets/books/generated/the-guests/processing_notes.md, app/client/assets/books/generated/the-guests/sections/chapter-001.json
- Preview inspected: public/book-previews/the-guests.preview.json
- Title verdict: Individual story title preserved as The Guests; source heading was THE GUESTS.
- Author verdict: Author metadata is source-backed by the Project Gutenberg Author: Saki header.
- Raw-vs-generated body comparison: Sanitized raw story body matches generated section, cleaned_book, processed_book, and morse source text character-for-character.
- Start boundary verdict: Generated body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: Generated body preserves the true cleaned-source story ending.
- Sectioning verdict: Single-section output is source-based and legitimate for this undivided story.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license, contributor, transcriber, byline-only material, artifact text, prose, punctuation, quote mark, dialogue, or ending sentence was removed from the story body.
- Preview verdict: Preview is book-specific, starts at real readable content, and contains no SOS Help or generic fallback text.
- All-main-readable-default verdict: All main readable story content is included by default and source order begins with the first selected/default section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE GUESTS
- Author evidence: Author: Saki
- Start evidence: “The landscape seen from our windows is certainly charming,” said Annabel; “those cherry orchards and green meadows, and the river winding along the valley, and the church tower peeping out among the elms, they all ma... / “The landscape seen from our windows is certainly charming,” said Annabel; “those cherry orchards and green meadows, and the river winding along the valley, and the church tower peeping out among the elms, they all ma...
- End evidence: ...e bedroom to come into the already over-crowded drawing-room. Altogether it was rather a relief when they both left. Now, perhaps, you can understand my appreciation of a sleepy countryside where things don’t happen.” / ...e bedroom to come into the already over-crowded drawing-room. Altogether it was rather a relief when they both left. Now, perhaps, you can understand my appreciation of a sleepy countryside where things don’t happen.”
- Preview evidence: “The landscape seen from our windows is certainly charming,” said Annabel; “those cherry orchards and green meadows, and the river winding along the valley, and the church tower peeping out among the elms, they all ma...

### the-hedgehog

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-hedgehog/manifest.json, app/client/assets/books/generated/the-hedgehog/cleaned_book.json, app/client/assets/books/generated/the-hedgehog/processed_book.json, app/client/assets/books/generated/the-hedgehog/rights_report.json, app/client/assets/books/generated/the-hedgehog/processing_notes.md, app/client/assets/books/generated/the-hedgehog/sections/chapter-001.json
- Preview inspected: public/book-previews/the-hedgehog.preview.json
- Title verdict: Individual story title preserved as The Hedgehog; source heading was THE HEDGEHOG.
- Author verdict: Author metadata is source-backed by the Project Gutenberg Author: Saki header.
- Raw-vs-generated body comparison: Sanitized raw story body matches generated section, cleaned_book, processed_book, and morse source text character-for-character.
- Start boundary verdict: Generated body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: Generated body preserves the true cleaned-source story ending.
- Sectioning verdict: Single-section output is source-based and legitimate for this undivided story.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license, contributor, transcriber, byline-only material, artifact text, prose, punctuation, quote mark, dialogue, or ending sentence was removed from the story body.
- Preview verdict: Preview is book-specific, starts at real readable content, and contains no SOS Help or generic fallback text.
- All-main-readable-default verdict: All main readable story content is included by default and source order begins with the first selected/default section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE HEDGEHOG
- Author evidence: Author: Saki
- Start evidence: A “Mixed Double” of young people were contesting a game of lawn tennis at the Rectory garden party; for the past five-and-twenty years at least mixed doubles of young people had done exactly the same thing on exactly ... / A “Mixed Double” of young people were contesting a game of lawn tennis at the Rectory garden party; for the past five-and-twenty years at least mixed doubles of young people had done exactly the same thing on exactly ...
- End evidence: ...on’s ghost; we always stop them from writing to the papers about it, though. That would be carrying matters too far.” Mrs. Hatch-Mallard renewed the lease in due course, but Ada Bleek has never renewed her friendship. / ...on’s ghost; we always stop them from writing to the papers about it, though. That would be carrying matters too far.” Mrs. Hatch-Mallard renewed the lease in due course, but Ada Bleek has never renewed her friendship.
- Preview evidence: A “Mixed Double” of young people were contesting a game of lawn tennis at the Rectory garden party; for the past five-and-twenty years at least mixed doubles of young people had done exactly the same thing on exactly ...

### the-image-of-the-lost-soul

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-image-of-the-lost-soul/manifest.json, app/client/assets/books/generated/the-image-of-the-lost-soul/cleaned_book.json, app/client/assets/books/generated/the-image-of-the-lost-soul/processed_book.json, app/client/assets/books/generated/the-image-of-the-lost-soul/rights_report.json, app/client/assets/books/generated/the-image-of-the-lost-soul/processing_notes.md, app/client/assets/books/generated/the-image-of-the-lost-soul/sections/chapter-001.json
- Preview inspected: public/book-previews/the-image-of-the-lost-soul.preview.json
- Title verdict: Individual story title preserved as The Image of the Lost Soul; source heading was THE IMAGE OF THE LOST SOUL.
- Author verdict: Author metadata is source-backed by the Project Gutenberg Author: Saki header.
- Raw-vs-generated body comparison: Sanitized raw story body matches generated section, cleaned_book, processed_book, and morse source text character-for-character.
- Start boundary verdict: Generated body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: Generated body preserves the true cleaned-source story ending.
- Sectioning verdict: Single-section output is source-based and legitimate for this undivided story.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license, contributor, transcriber, byline-only material, artifact text, prose, punctuation, quote mark, dialogue, or ending sentence was removed from the story body.
- Preview verdict: Preview is book-specific, starts at real readable content, and contains no SOS Help or generic fallback text.
- All-main-readable-default verdict: All main readable story content is included by default and source order begins with the first selected/default section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE IMAGE OF THE LOST SOUL
- Author evidence: Author: Saki
- Start evidence: There were a number of carved stone figures placed at intervals along the parapets of the old Cathedral; some of them represented angels, others kings and bishops, and nearly all were in attitudes of pious exaltation ... / There were a number of carved stone figures placed at intervals along the parapets of the old Cathedral; some of them represented angels, others kings and bishops, and nearly all were in attitudes of pious exaltation ...
- End evidence: ...,” cooed the fat pigeons, after they had peered at the matter for some minutes; “now we shall have a nice angel put up there. Certainly they will put an angel there.” “After joy . . . sorrow,” rang out the great bell. / ...,” cooed the fat pigeons, after they had peered at the matter for some minutes; “now we shall have a nice angel put up there. Certainly they will put an angel there.” “After joy . . . sorrow,” rang out the great bell.
- Preview evidence: There were a number of carved stone figures placed at intervals along the parapets of the old Cathedral; some of them represented angels, others kings and bishops, and nearly all were in attitudes of pious exaltation ...

### the-interlopers

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-interlopers/manifest.json, app/client/assets/books/generated/the-interlopers/cleaned_book.json, app/client/assets/books/generated/the-interlopers/processed_book.json, app/client/assets/books/generated/the-interlopers/rights_report.json, app/client/assets/books/generated/the-interlopers/processing_notes.md, app/client/assets/books/generated/the-interlopers/sections/chapter-001.json
- Preview inspected: public/book-previews/the-interlopers.preview.json
- Title verdict: Individual story title preserved as The Interlopers; source heading was THE INTERLOPERS.
- Author verdict: Author metadata is source-backed by the Project Gutenberg Author: Saki header.
- Raw-vs-generated body comparison: Sanitized raw story body matches generated section, cleaned_book, processed_book, and morse source text character-for-character.
- Start boundary verdict: Generated body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: Generated body preserves the true cleaned-source story ending.
- Sectioning verdict: Single-section output is source-based and legitimate for this undivided story.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license, contributor, transcriber, byline-only material, artifact text, prose, punctuation, quote mark, dialogue, or ending sentence was removed from the story body.
- Preview verdict: Preview is book-specific, starts at real readable content, and contains no SOS Help or generic fallback text.
- All-main-readable-default verdict: All main readable story content is included by default and source order begins with the first selected/default section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE INTERLOPERS
- Author evidence: Author: Saki
- Start evidence: In a forest of mixed growth somewhere on the eastern spurs of the Karpathians, a man stood one winter night watching and listening, as though he waited for some beast of the woods to come within the range of his visio... / In a forest of mixed growth somewhere on the eastern spurs of the Karpathians, a man stood one winter night watching and listening, as though he waited for some beast of the woods to come within the range of his visio...
- End evidence: .... “No,” said Ulrich with a laugh, the idiotic chattering laugh of a man unstrung with hideous fear. “Who are they?” asked Georg quickly, straining his eyes to see what the other would gladly not have seen. “_Wolves_.” / .... “No,” said Ulrich with a laugh, the idiotic chattering laugh of a man unstrung with hideous fear. “Who are they?” asked Georg quickly, straining his eyes to see what the other would gladly not have seen. “_Wolves_.”
- Preview evidence: In a forest of mixed growth somewhere on the eastern spurs of the Karpathians, a man stood one winter night watching and listening, as though he waited for some beast of the woods to come within the range of his visio...

### the-mappined-life

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-mappined-life/manifest.json, app/client/assets/books/generated/the-mappined-life/cleaned_book.json, app/client/assets/books/generated/the-mappined-life/processed_book.json, app/client/assets/books/generated/the-mappined-life/rights_report.json, app/client/assets/books/generated/the-mappined-life/processing_notes.md, app/client/assets/books/generated/the-mappined-life/sections/chapter-001.json
- Preview inspected: public/book-previews/the-mappined-life.preview.json
- Title verdict: Individual story title preserved as The Mappined Life; source heading was THE MAPPINED LIFE.
- Author verdict: Author metadata is source-backed by the Project Gutenberg Author: Saki header.
- Raw-vs-generated body comparison: Sanitized raw story body matches generated section, cleaned_book, processed_book, and morse source text character-for-character.
- Start boundary verdict: Generated body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: Generated body preserves the true cleaned-source story ending.
- Sectioning verdict: Single-section output is source-based and legitimate for this undivided story.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license, contributor, transcriber, byline-only material, artifact text, prose, punctuation, quote mark, dialogue, or ending sentence was removed from the story body.
- Preview verdict: Preview is book-specific, starts at real readable content, and contains no SOS Help or generic fallback text.
- All-main-readable-default verdict: All main readable story content is included by default and source order begins with the first selected/default section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE MAPPINED LIFE
- Author evidence: Author: Saki
- Start evidence: “These Mappin Terraces at the Zoological Gardens are a great improvement on the old style of wild-beast cage,” said Mrs. James Gurtleberry, putting down an illustrated paper; “they give one the illusion of seeing the ... / “These Mappin Terraces at the Zoological Gardens are a great improvement on the old style of wild-beast cage,” said Mrs. James Gurtleberry, putting down an illustrated paper; “they give one the illusion of seeing the ...
- End evidence: ...s my opinion that we haven’t seen the worst of things yet.” In this he was probably right, but there was nothing in the immediate or prospective condition of Albania to warrant Mrs. Gurtleberry in bursting into tears. / ...s my opinion that we haven’t seen the worst of things yet.” In this he was probably right, but there was nothing in the immediate or prospective condition of Albania to warrant Mrs. Gurtleberry in bursting into tears.
- Preview evidence: “These Mappin Terraces at the Zoological Gardens are a great improvement on the old style of wild-beast cage,” said Mrs. James Gurtleberry, putting down an illustrated paper; “they give one the illusion of seeing the ...

### the-occasional-garden

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-occasional-garden/manifest.json, app/client/assets/books/generated/the-occasional-garden/cleaned_book.json, app/client/assets/books/generated/the-occasional-garden/processed_book.json, app/client/assets/books/generated/the-occasional-garden/rights_report.json, app/client/assets/books/generated/the-occasional-garden/processing_notes.md, app/client/assets/books/generated/the-occasional-garden/sections/chapter-001.json
- Preview inspected: public/book-previews/the-occasional-garden.preview.json
- Title verdict: Individual story title preserved as The Occasional Garden; source heading was THE OCCASIONAL GARDEN.
- Author verdict: Author metadata is source-backed by the Project Gutenberg Author: Saki header.
- Raw-vs-generated body comparison: Sanitized raw story body matches generated section, cleaned_book, processed_book, and morse source text character-for-character.
- Start boundary verdict: Generated body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: Generated body preserves the true cleaned-source story ending.
- Sectioning verdict: Single-section output is source-based and legitimate for this undivided story.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license, contributor, transcriber, byline-only material, artifact text, prose, punctuation, quote mark, dialogue, or ending sentence was removed from the story body.
- Preview verdict: Preview is book-specific, starts at real readable content, and contains no SOS Help or generic fallback text.
- All-main-readable-default verdict: All main readable story content is included by default and source order begins with the first selected/default section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE OCCASIONAL GARDEN
- Author evidence: Author: Saki
- Start evidence: “Don’t talk to me about town gardens,” said Elinor Rapsley; “which means, of course, that I want you to listen to me for an hour or so while I talk about nothing else. ‘What a nice-sized garden you’ve got,’ people sai... / “Don’t talk to me about town gardens,” said Elinor Rapsley; “which means, of course, that I want you to listen to me for an hour or so while I talk about nothing else. ‘What a nice-sized garden you’ve got,’ people sai...
- End evidence: ...heart-broken at the havoc that I had the whole place cleared out; I shall have it laid out again on rather more elaborate lines.” “That,” she said to the Baroness afterwards “is what I call having an emergency brain.” / ...heart-broken at the havoc that I had the whole place cleared out; I shall have it laid out again on rather more elaborate lines.” “That,” she said to the Baroness afterwards “is what I call having an emergency brain.”
- Preview evidence: “Don’t talk to me about town gardens,” said Elinor Rapsley; “which means, of course, that I want you to listen to me for an hour or so while I talk about nothing else. ‘What a nice-sized garden you’ve got,’ people sai...

### the-phantom-luncheon

- Verification status: pass
- Generated output inspected: app/client/assets/books/generated/the-phantom-luncheon/manifest.json, app/client/assets/books/generated/the-phantom-luncheon/cleaned_book.json, app/client/assets/books/generated/the-phantom-luncheon/processed_book.json, app/client/assets/books/generated/the-phantom-luncheon/rights_report.json, app/client/assets/books/generated/the-phantom-luncheon/processing_notes.md, app/client/assets/books/generated/the-phantom-luncheon/sections/chapter-001.json
- Preview inspected: public/book-previews/the-phantom-luncheon.preview.json
- Title verdict: Individual story title preserved as The Phantom Luncheon; source heading was THE PHANTOM LUNCHEON.
- Author verdict: Author metadata is source-backed by the Project Gutenberg Author: Saki header.
- Raw-vs-generated body comparison: Sanitized raw story body matches generated section, cleaned_book, processed_book, and morse source text character-for-character.
- Start boundary verdict: Generated body starts at the dry-run verified first readable prose phrase.
- End boundary verdict: Generated body preserves the true cleaned-source story ending.
- Sectioning verdict: Single-section output is source-based and legitimate for this undivided story.
- Cleanup/prose-preservation verdict: No parent collection title, TOC, source/license, contributor, transcriber, byline-only material, artifact text, prose, punctuation, quote mark, dialogue, or ending sentence was removed from the story body.
- Preview verdict: Preview is book-specific, starts at real readable content, and contains no SOS Help or generic fallback text.
- All-main-readable-default verdict: All main readable story content is included by default and source order begins with the first selected/default section.
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Remaining warnings: none
- Title evidence: THE PHANTOM LUNCHEON
- Author evidence: Author: Saki
- Start evidence: “The Smithly-Dubbs are in Town,” said Sir James. “I wish you would show them some attention. Ask them to lunch with you at the Ritz or somewhere.” “From the little I’ve seen of the Smithly-Dubbs I don’t thing I want t... / “The Smithly-Dubbs are in Town,” said Sir James. “I wish you would show them some attention. Ask them to lunch with you at the Ritz or somewhere.” “From the little I’ve seen of the Smithly-Dubbs I don’t thing I want t...
- End evidence: ... hospitality was a catastrophe that they could not contemplate with any degree of calmness. The Smithly-Dubbs never quite recovered from their unnerving experience. They have given up politics and taken to doing good. / ... hospitality was a catastrophe that they could not contemplate with any degree of calmness. The Smithly-Dubbs never quite recovered from their unnerving experience. They have given up politics and taken to doing good.
- Preview evidence: “The Smithly-Dubbs are in Town,” said Sir James. “I wish you would show them some attention. Ask them to lunch with you at the Ritz or somewhere.” “From the little I’ve seen of the Smithly-Dubbs I don’t thing I want t...

## Protected Scope

- Unresolved-source generated books untouched: a-princess-of-mars, doctor-dolittle, heidi, jabberwocky, nights-with-uncle-remus, peter-pan, tarzan-of-the-apes, the-great-gatsby, the-picture-of-dorian-gray, the-thirty-nine-steps, wood-folk-at-school
- Duplicate/boundary skips not reintroduced: the-wind-in-the-willows, the-two-magics-the-turn-of-the-screw-covering-end, the-works-of-edgar-allan-poe
- Raw sources modified: no
- Cloudflare exports modified: no

## Validation Notes

- Playwright: 35/36 passed; one fullscreen-controls visibility assertion failed twice in tests/qa-robustness-review/morse-book-page.spec.ts and is classified as the known pre-existing fullscreen controls issue because this branch changes only book data/reports/scripts
- Audit side-effect handling: title/start/default audit produced the known unrelated 12-book validation churn; generated, preview, and audit-report churn was restored before commit
