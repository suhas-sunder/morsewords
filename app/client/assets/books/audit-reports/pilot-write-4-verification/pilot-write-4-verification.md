# Pilot Write 4 Verification

Generated at: 2026-06-17T05:18:53.792Z

## Summary

- Branch: morsewords-book-processing-pilot-write-4-jun-2026
- Commit verified: d4896d51098c07bf5ef53e2d20fb5a1b98c2bc2f
- Selected books verified: 25
- Pass: 20
- Warn accepted: 5
- Fail: 0
- Corrections made during verification: 2
- Correction needed before main: 0

## Focused Correction Note

### rinkitink-in-oz

- Failed before: fail
- Corrected now: yes
- Artifact removed: 99 bracketed illustration/image placeholder blocks and 23 standalone illustrated chapter-title caption lines.
- Correction: Removed standalone illustration placeholders and illustration-only chapter-title captions from default playback.
- Startup preview after correction: valid book-specific startup preview
- Final verification status after rerun: pass
- Generated files changed: app/client/assets/books/generated/rinkitink-in-oz/manifest.json, app/client/assets/books/generated/rinkitink-in-oz/cleaned_book.json, app/client/assets/books/generated/rinkitink-in-oz/processed_book.json, app/client/assets/books/generated/rinkitink-in-oz/sections/chapter-001.json, app/client/assets/books/generated/rinkitink-in-oz/sections/chapter-002.json, app/client/assets/books/generated/rinkitink-in-oz/sections/chapter-003.json, app/client/assets/books/generated/rinkitink-in-oz/sections/chapter-004.json, app/client/assets/books/generated/rinkitink-in-oz/sections/chapter-005.json, app/client/assets/books/generated/rinkitink-in-oz/sections/chapter-006.json, app/client/assets/books/generated/rinkitink-in-oz/sections/chapter-007.json, app/client/assets/books/generated/rinkitink-in-oz/sections/chapter-008.json, app/client/assets/books/generated/rinkitink-in-oz/sections/chapter-009.json, app/client/assets/books/generated/rinkitink-in-oz/sections/chapter-010.json, app/client/assets/books/generated/rinkitink-in-oz/sections/chapter-011.json, app/client/assets/books/generated/rinkitink-in-oz/sections/chapter-012.json, app/client/assets/books/generated/rinkitink-in-oz/sections/chapter-013.json, app/client/assets/books/generated/rinkitink-in-oz/sections/chapter-014.json, app/client/assets/books/generated/rinkitink-in-oz/sections/chapter-015.json, app/client/assets/books/generated/rinkitink-in-oz/sections/chapter-016.json, app/client/assets/books/generated/rinkitink-in-oz/sections/chapter-017.json, app/client/assets/books/generated/rinkitink-in-oz/sections/chapter-018.json, app/client/assets/books/generated/rinkitink-in-oz/sections/chapter-019.json, app/client/assets/books/generated/rinkitink-in-oz/sections/chapter-020.json, app/client/assets/books/generated/rinkitink-in-oz/sections/chapter-021.json, app/client/assets/books/generated/rinkitink-in-oz/sections/chapter-022.json, app/client/assets/books/generated/rinkitink-in-oz/sections/chapter-023.json, app/client/assets/books/generated/rinkitink-in-oz/sections/chapter-024.json, app/client/assets/books/generated/library-manifest.json
- Preview files changed: public/book-previews/rinkitink-in-oz.preview.json, public/book-previews/manifest.json

### the-secret-garden

- Failed before: fail
- Corrected now: yes
- Artifact removed: 3 bracketed illustration captions from chapters 13, 19, and 26.
- Correction: Removed bracketed illustration captions from default playback while preserving surrounding prose and dialogue.
- Startup preview after correction: valid book-specific startup preview
- Final verification status after rerun: pass
- Generated files changed: app/client/assets/books/generated/the-secret-garden/manifest.json, app/client/assets/books/generated/the-secret-garden/cleaned_book.json, app/client/assets/books/generated/the-secret-garden/processed_book.json, app/client/assets/books/generated/the-secret-garden/sections/chapter-013.json, app/client/assets/books/generated/the-secret-garden/sections/chapter-019.json, app/client/assets/books/generated/the-secret-garden/sections/chapter-026.json, app/client/assets/books/generated/library-manifest.json
- Preview files changed: public/book-previews/the-secret-garden.preview.json, public/book-previews/manifest.json

## Results

| Book | Write action | Verification | Accepted for main | Notes |
| --- | --- | --- | --- | --- |
| a-childs-garden-of-verses | corrected | pass | yes | none |
| alices-adventures-in-wonderland | accepted without rewrite | pass | yes | none |
| black-beauty | corrected | pass | yes | none |
| botchan | accepted without rewrite | pass | yes | none |
| five-little-peppers-and-how-they-grew | corrected | pass | yes | none |
| grimm-s-fairy-tales | corrected | pass | yes | none |
| jane-eyre | accepted without rewrite | pass | yes | none |
| little-women | corrected | pass | yes | none |
| new-treasure-seekers | corrected | pass | yes | none |
| pride-and-prejudice | corrected | warn accepted | yes | Generated ending needs review against raw source.; The final generated default-section tail was not found verbatim in the raw source after normalization. |
| rainbow-valley | accepted without rewrite | pass | yes | none |
| rinkitink-in-oz | accepted without rewrite | pass | yes | none |
| the-arabian-nights | corrected | warn accepted | yes | long book has huge sections despite detected headings; At least one corrected story remains large because the source has no clear internal headings; it was not split into fake fragments.; Sectioning matches the source structure with review notes.; Large real source sections retained without fake splitting: chapter-005 (31435 words). |
| the-art-of-war | accepted without rewrite | pass | yes | none |
| the-book-of-dragons | corrected | pass | yes | none |
| the-divine-comedy | corrected | pass | yes | none |
| the-elements-of-style | corrected | warn accepted | yes | body headings were found but rejected by the selected strategy |
| the-federalist-papers | corrected | warn accepted | yes | body headings were found but rejected by the selected strategy; Generated ending needs review against raw source.; The final generated default-section tail was not found verbatim in the raw source after normalization. |
| the-jungle-book | corrected | pass | yes | none |
| the-princess-and-the-goblin | accepted without rewrite | pass | yes | none |
| the-railway-children | accepted without rewrite | pass | yes | none |
| the-sea-wolf | accepted without rewrite | pass | yes | none |
| the-secret-garden | accepted without rewrite | pass | yes | none |
| the-water-babies | corrected | warn accepted | yes | long book has huge sections despite detected headings |
| through-the-looking-glass | accepted without rewrite | pass | yes | none |

## Corrected Books

### a-childs-garden-of-verses

- Previous defect fixed: yes
- First default before: part-002 Part 2
- First default after: poem-001 Bed In Summer
- Section count before/after: 3 -> 66
- Preview after: BED IN SUMMER In winter I get up at night And dress by yellow candle-light. In summer, quite the other way, I have to go to bed by day. I have to go to bed and see The birds still hopping on the tree, Or hear the grown-up people's feet Still going past me in...
- Final verdict: accepted for main
- Start: First default section starts from real readable generated content.
- End: Generated default playback preserves the readable ending without footer leakage.
- Sectioning: Sectioning matches the selected source structure without fallback collapse.

### black-beauty

- Previous defect fixed: yes
- First default before: part-002 Part 2
- First default after: chapter-001 Chapter 1
- Section count before/after: 12 -> 49
- Preview after: 01 My Early Home The first place that I can well remember was a large pleasant meadow with a pond of clear water in it. Some shady trees leaned over it, and rushes and water-lilies grew at the deep end. Over the hedge on one side we looked into a plowed field...
- Final verdict: accepted for main
- Start: First default section starts from real readable generated content.
- End: Generated default playback preserves the readable ending without footer leakage.
- Sectioning: Sectioning matches the selected source structure without fallback collapse.

### five-little-peppers-and-how-they-grew

- Previous defect fixed: yes
- First default before: part-002 Part 2
- First default after: chapter-001 A Home View
- Section count before/after: 14 -> 25
- Preview after: A HOME VIEW The little old kitchen had quieted down from the bustle and confusion of mid-day; and now, with its afternoon manners on, presented a holiday aspect, that as the principal room in the brown house, it was eminently proper it should have. It was jus...
- Final verdict: accepted for main
- Start: First default section starts from real readable generated content.
- End: Generated default playback preserves the readable ending without footer leakage.
- Sectioning: Sectioning matches the selected source structure without fallback collapse.

### grimm-s-fairy-tales

- Previous defect fixed: yes
- First default before: part-002 Part 2
- First default after: chapter-001 The Golden Bird
- Section count before/after: 18 -> 66
- Preview after: THE GOLDEN BIRD A certain king had a beautiful garden, and in the garden stood a tree which bore golden apples. These apples were always counted, and about the time when they began to grow ripe it was found that every night one of them was gone. The king beca...
- Final verdict: accepted for main
- Start: First default section starts from real readable generated content.
- End: Generated default playback preserves the readable ending without footer leakage.
- Sectioning: Sectioning matches the selected source structure without fallback collapse.

### little-women

- Previous defect fixed: yes
- First default before: part-002 Part 2
- First default after: chapter-001 Chapter 1
- Section count before/after: 37 -> 47
- Preview after: I. PLAYING PILGRIMS. "Christmas won't be Christmas without any presents," grumbled Jo, lying on the rug. "It's so dreadful to be poor!" sighed Meg, looking down at her old dress. "I don't think it's fair for some girls to have plenty of pretty things, and oth...
- Final verdict: accepted for main
- Start: First default section starts from real readable generated content.
- End: Generated default playback preserves the readable ending without footer leakage.
- Sectioning: Sectioning matches the selected source structure without fallback collapse.

### new-treasure-seekers

- Previous defect fixed: yes
- First default before: part-002 Part 2
- First default after: chapter-001 The Road To Rome; or, the Silly Stowaway
- Section count before/after: 14 -> 13
- Preview after: _THE ROAD TO ROME; OR, THE SILLY STOWAWAY_ WE Bastables have only two uncles, and neither of them, are our own natural-born relatives. One is a great-uncle, and the other is the uncle from his birth of Albert, who used to live next door to us in the Lewisham...
- Final verdict: accepted for main
- Start: First default section starts from real readable generated content.
- End: Generated default playback preserves the readable ending without footer leakage.
- Sectioning: Sectioning matches the selected source structure without fallback collapse.

### pride-and-prejudice

- Previous defect fixed: yes
- First default before: chapter-001 Chapter 1
- First default after: chapter-001 Chapter 1
- Section count before/after: 62 -> 61
- Preview after: Chapter I. It is a truth universally acknowledged, that a single man in possession of a good fortune must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed...
- Final verdict: accepted for main with review notes
- Start: First default section starts from real readable generated content.
- End: Generated ending needs review against raw source.
- Sectioning: Sectioning matches the selected source structure without fallback collapse.

### the-arabian-nights

- Previous defect fixed: yes
- First default before: part-002 Part 2
- First default after: chapter-001 The Talking Bird, the Singing Tree, and the Golden Water
- Section count before/after: 23 -> 17
- Preview after: THE TALKING BIRD, THE SINGING TREE, AND THE GOLDEN WATER There was an emperor of Persia named Kosrouschah, who, when he first came to his crown, in order to obtain a knowledge of affairs, took great pleasure in night excursions, attended by a trusty minister....
- Final verdict: accepted for main with review notes
- Start: First default section starts from real readable generated content.
- End: Generated default playback preserves the readable ending without footer leakage.
- Sectioning: Sectioning matches the source structure with review notes.

### the-book-of-dragons

- Previous defect fixed: yes
- First default before: part-002 Part 2
- First default after: chapter-001 Story 1
- Section count before/after: 9 -> 8
- Preview after: I. The Book of Beasts He happened to be building a Palace when the news came, and he left all the bricks kicking about the floor for Nurse to clear up--but then the news was rather remarkable news. You see, there was a knock at the front door and voices talki...
- Final verdict: accepted for main
- Start: First default section starts from real readable generated content.
- End: Generated default playback preserves the readable ending without footer leakage.
- Sectioning: Sectioning matches the selected source structure without fallback collapse.

### the-divine-comedy

- Previous defect fixed: yes
- First default before: part-001 Part 1
- First default after: poem-001 Inferno Canto 1
- Section count before/after: 22 -> 100
- Preview after: CANTO I In the midway of this our mortal life, I found me in a gloomy wood, astray Gone from the path direct: and e'en to tell It were no easy task, how savage wild That forest, how robust and rough its growth, Which to remember only, my dismay Renews, in bit...
- Final verdict: accepted for main
- Start: First default section starts from real readable generated content.
- End: Generated default playback preserves the readable ending without footer leakage.
- Sectioning: Sectioning matches the selected source structure without fallback collapse.

### the-elements-of-style

- Previous defect fixed: yes
- First default before: part-002 Part 2
- First default after: part-001 Section 1
- Section count before/after: 4 -> 25
- Preview after: I. INTRODUCTORY This book aims to give in brief space the principal requirements of plain English style. It aims to lighten the task of instructor and student by concentrating attention (in Chapters II and III) on a few essentials, the rules of usage and prin...
- Final verdict: accepted for main with review notes
- Start: First default section starts from real readable generated content.
- End: Generated default playback preserves the readable ending without footer leakage.
- Sectioning: Sectioning matches the selected source structure without fallback collapse.

### the-federalist-papers

- Previous defect fixed: yes
- First default before: part-002 Part 2
- First default after: chapter-001 Federalist No. 1
- Section count before/after: 42 -> 86
- Preview after: To the People of the State of New York: After an unequivocal experience of the inefficacy of the subsisting federal government, you are called upon to deliberate on a new Constitution for the United States of America. The subject speaks its own importance; co...
- Final verdict: accepted for main with review notes
- Start: First default section starts from real readable generated content.
- End: Generated ending needs review against raw source.
- Sectioning: Sectioning matches the selected source structure without fallback collapse.

### the-jungle-book

- Previous defect fixed: yes
- First default before: part-002 Part 2
- First default after: chapter-001 Mowgli's Brothers
- Section count before/after: 11 -> 14
- Preview after: Mowgli's Brothers Now Rann the Kite brings home the night That Mang the Bat sets free-- The herds are shut in byre and hut For loosed till dawn are we. This is the hour of pride and power, Talon and tush and claw. Oh, hear the call!--Good hunting all That kee...
- Final verdict: accepted for main
- Start: First default section starts from real readable generated content.
- End: Generated default playback preserves the readable ending without footer leakage.
- Sectioning: Sectioning matches the selected source structure without fallback collapse.

### the-water-babies

- Previous defect fixed: yes
- First default before: chapter-001 Chapter 1
- First default after: chapter-001 Chapter 1
- Section count before/after: 10 -> 9
- Preview after: CHAPTER I ONCE upon a time there was a little chimney-sweep, and his name was Tom. That is a short name, and you have heard it before, so you will not have much trouble in remembering it. He lived in a great town in the North country, where there were plenty...
- Final verdict: accepted for main with review notes
- Start: First default section starts from real readable generated content.
- End: Generated default playback preserves the readable ending without footer leakage.
- Sectioning: Sectioning matches the selected source structure without fallback collapse.

## Accepted Without Rewrite

- alices-adventures-in-wonderland: dry-run acceptance remains valid; first default chapter-001 Chapter 1; Preview is valid, book-specific, and starts from generated readable content.
- botchan: dry-run acceptance remains valid; first default chapter-001 Chapter 1; Preview is valid, book-specific, and starts from generated readable content.
- jane-eyre: dry-run acceptance remains valid; first default chapter-001 Chapter 1; Preview is valid, book-specific, and starts from generated readable content.
- rainbow-valley: dry-run acceptance remains valid; first default chapter-001 Chapter 1; Preview is valid, book-specific, and starts from generated readable content.
- rinkitink-in-oz: dry-run acceptance remains valid; first default chapter-001 Chapter 1; Preview is valid, book-specific, and starts from generated readable content.
- the-art-of-war: dry-run acceptance remains valid; first default chapter-001 Chapter 1; Preview is valid, book-specific, and starts from generated readable content.
- the-princess-and-the-goblin: dry-run acceptance remains valid; first default chapter-001 Chapter 1; Preview is valid, book-specific, and starts from generated readable content.
- the-railway-children: dry-run acceptance remains valid; first default chapter-001 Chapter 1; Preview is valid, book-specific, and starts from generated readable content.
- the-sea-wolf: dry-run acceptance remains valid; first default chapter-001 Chapter 1; Preview is valid, book-specific, and starts from generated readable content.
- the-secret-garden: dry-run acceptance remains valid; first default chapter-001 Chapter 1; Preview is valid, book-specific, and starts from generated readable content.
- through-the-looking-glass: dry-run acceptance remains valid; first default chapter-001 Chapter 1; Preview is valid, book-specific, and starts from generated readable content.

## Future Batch Rule

Future book batches fail unless every processed book has:
- valid generated readable content
- first default section from real readable content
- all main readable sections included by default
- valid book-specific startup preview
- no SOS Help!
- no generic preview fallback
- no title/TOC/source/license/contributor/transcriber material as default playback
