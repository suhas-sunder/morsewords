# Pilot Book Processing Dry Run 3

Generated: 2026-06-15T21:30:36.890Z

This is a review-only dry run for the third carefully selected pilot batch. It uses the pass-1, pass-2, structure-audit-1, pilot dry-run 1, pilot write 1, pilot write 1 verification, pilot dry-run 2, and pilot write 2 verification reports as inputs. It does not write final generated books, public preview assets, raw source books, or Cloudflare exports.

## Pilot Books Processed

- frankenstein
- the-three-musketeers
- a-tale-of-two-cities
- around-the-world-in-eighty-days
- cranford
- little-fuzzy
- macbeth
- persuasion
- pygmalion
- sense-and-sensibility
- the-adventures-of-tom-sawyer
- the-door-in-the-wall
- the-hound-of-the-baskervilles
- the-king-in-yellow
- the-life-and-adventures-of-robinson-crusoe
- the-maltese-falcon
- the-tempest
- the-turn-of-the-screw
- the-war-of-the-worlds
- the-wendigo
- wuthering-heights
- anne-of-avonlea
- five-weeks-in-a-balloon
- moby-dick
- tales-of-war

## Per-Book Recommendation Table

| Slug | Pass-2 risk | Structure | Structure status | Sections | Kept words | Dry-run recommendation | Preview feasible | Why selected |
| --- | --- | --- | --- | ---: | ---: | --- | --- | --- |
| frankenstein | medium | chapter-based arabic numbers | pass | 24 | 69645 | process later with warnings | yes | High-confidence chapter-Arabic structure with clear boundaries and a feasible first-hour preview; useful canonical novel baseline. |
| the-three-musketeers | medium | chapter-based roman numerals | pass | 67 | 232555 | process later with warnings | yes | High-confidence chapter-Roman structure with many regular chapters, selected to test longer adventure fiction without severe boundary ambiguity. |
| a-tale-of-two-cities | medium | chapter-based roman numerals | pass | 46 | 137574 | process later with warnings | yes | High-confidence chapter-Roman structure with book-level divisions, selected to test nested book/chapter handling in a familiar novel. |
| around-the-world-in-eighty-days | medium | chapter-based roman numerals | pass | 37 | 63348 | process later with warnings | yes | High-confidence chapter-Roman structure with regular chapters and low cleanup risk. |
| cranford | medium | chapter-based roman numerals | pass | 16 | 71994 | process later with warnings | yes | High-confidence chapter-Roman structure with manageable length and clear start/end markers. |
| little-fuzzy | medium | standalone roman numeral sections | pass | 17 | 59136 | process later with warnings | yes | High-confidence standalone Roman-numbered sections, selected to test section numbering that is not explicitly chapter-labeled. |
| macbeth | medium | play acts | pass | 7 | 19029 | process later with warnings | yes | High-confidence play structure, selected as a cautious act/scene case after audit data indicated safe enough boundaries. |
| persuasion | medium | chapter-based roman numerals | pass | 24 | 83877 | process later with warnings | yes | High-confidence chapter-Roman structure with clean boundaries and a feasible preview source. |
| pygmalion | medium | play acts | pass | 6 | 34762 | process later with warnings | yes | High-confidence play structure with explicit acts, selected to test dramatic text parsing without expanding to chaotic plays. |
| sense-and-sensibility | medium | chapter-based roman numerals | pass | 50 | 120436 | process later with warnings | yes | High-confidence chapter-Roman structure with regular boundaries and a useful existing-output comparison. |
| the-adventures-of-tom-sawyer | medium | chapter-based roman numerals | pass | 35 | 72807 | process later with warnings | yes | High-confidence chapter-Roman structure with regular chapters and low severe-artifact risk. |
| the-door-in-the-wall | medium | standalone roman numeral sections | warn | 4 | 6824 | process later with warnings | yes | High-confidence standalone Roman sections in a short collection-like source, selected to test titled/numbered short-work handling. |
| the-hound-of-the-baskervilles | medium | chapter-based arabic numbers | pass | 15 | 59642 | process later with warnings | yes | High-confidence chapter-Arabic structure with clear chapter titles and feasible preview source. |
| the-king-in-yellow | medium | standalone roman numeral sections | pass | 29 | 71271 | process later with warnings | yes | High-confidence standalone Roman sections, selected to test story/section boundaries in a collection-shaped work. |
| the-life-and-adventures-of-robinson-crusoe | medium | chapter-based roman numerals | pass | 20 | 121380 | process later with warnings | yes | High-confidence chapter-Roman structure with prefatory material to review conservatively without severe boundary ambiguity. |
| the-maltese-falcon | medium | standalone arabic-numbered sections | pass | 21 | 69724 | process later with warnings | yes | High-confidence standalone Arabic-numbered sections with clear body divisions and no blocked-source signal. |
| the-tempest | medium | play acts | pass | 5 | 23639 | process later with warnings | yes | High-confidence play structure, selected as a second controlled act/scene case with clear source formatting. |
| the-turn-of-the-screw | medium | standalone roman numeral sections | pass | 25 | 42081 | process later with warnings | yes | High-confidence standalone Roman sections with clear narrative divisions and manageable cleanup risk. |
| the-war-of-the-worlds | medium | standalone roman numeral sections with book divisions | pass | 27 | 60517 | process later with warnings | yes | High-confidence Roman-numbered sections with book divisions, selected to exercise nested structural reporting. |
| the-wendigo | medium | standalone roman numeral sections | pass | 9 | 18644 | process later with warnings | yes | High-confidence standalone Roman sections in a shorter work with feasible preview boundaries. |
| wuthering-heights | medium | chapter-based roman numerals | pass | 34 | 118835 | process later with warnings | yes | High-confidence chapter-Roman structure with regular sections and useful comparison against any existing generated output. |
| anne-of-avonlea | medium | standalone roman numeral sections | pass | 31 | 91915 | process later with warnings | yes | High-confidence standalone Roman sections with clear readable boundaries and a feasible preview candidate. |
| five-weeks-in-a-balloon | medium | chapter-based word ordinals | pass | 40 | 93679 | process later with warnings | yes | High-confidence chapter word-ordinal structure, selected to test a less common but regular heading convention. |
| moby-dick | medium | chapter-based arabic numbers with book divisions | pass | 135 | 212512 | process later with warnings | yes | Medium-confidence chapter-Arabic structure with major divisions, selected for dry-run-only review of a large but structured book. |
| tales-of-war | medium | isolated titled sections | pass | 32 | 25971 | process later with warnings | yes | Medium-confidence isolated titled sections, selected to test story-level sectioning where audit data did not show severe ambiguity. |

## Safe To Process Later

- None.

## Process Later With Warnings

- frankenstein
- the-three-musketeers
- a-tale-of-two-cities
- around-the-world-in-eighty-days
- cranford
- little-fuzzy
- macbeth
- persuasion
- pygmalion
- sense-and-sensibility
- the-adventures-of-tom-sawyer
- the-door-in-the-wall
- the-hound-of-the-baskervilles
- the-king-in-yellow
- the-life-and-adventures-of-robinson-crusoe
- the-maltese-falcon
- the-tempest
- the-turn-of-the-screw
- the-war-of-the-worlds
- the-wendigo
- wuthering-heights
- anne-of-avonlea
- five-weeks-in-a-balloon
- moby-dick
- tales-of-war

## Needs Individual Review

- None.

## Blocked

- None.

## Most Common Cleanup Issues

| Issue | Books | Examples |
| --- | ---: | --- |
| normalize-smart-quotes | 23 | frankenstein<br>the-three-musketeers<br>a-tale-of-two-cities<br>around-the-world-in-eighty-days<br>cranford<br>macbeth<br>persuasion<br>pygmalion |
| normalize-em-en-dashes | 20 | frankenstein<br>the-three-musketeers<br>around-the-world-in-eighty-days<br>cranford<br>macbeth<br>persuasion<br>pygmalion<br>sense-and-sensibility |
| remove-page-and-decorative-lines | 13 | a-tale-of-two-cities<br>around-the-world-in-eighty-days<br>cranford<br>little-fuzzy<br>pygmalion<br>the-king-in-yellow<br>the-maltese-falcon<br>the-tempest |
| suspiciously-short-sections | 4 | macbeth<br>the-maltese-falcon<br>moby-dick<br>tales-of-war |
| remove-numbered-reference-markers | 2 | around-the-world-in-eighty-days<br>five-weeks-in-a-balloon |

## Most Common Boundary Risks

| Risk | Books | Examples |
| --- | ---: | --- |
| boundary-or-real-content-risk | 11 | a-tale-of-two-cities<br>little-fuzzy<br>the-door-in-the-wall<br>the-king-in-yellow<br>the-maltese-falcon<br>the-turn-of-the-screw<br>the-wendigo<br>wuthering-heights |
| existing-generated-output-warning | 4 | frankenstein<br>the-three-musketeers<br>around-the-world-in-eighty-days<br>sense-and-sensibility |
| structure-warn | 1 | the-door-in-the-wall |

## Existing Generated Output Damage

- frankenstein: suspiciously short generated sections
- the-three-musketeers: suspiciously short generated sections
- around-the-world-in-eighty-days: suspiciously short generated sections
- sense-and-sensibility: suspiciously short generated sections

## Processor Safety Assessment

- Seems safe enough for a real pilot write pass: yes
- Reason: The dry run produced reviewable outputs for the selected third-batch books with no blocked sources and enough safe/warning candidates for a controlled write pass.
- Recommended next step: Run a real pilot write pass only for the safe/warning subset from dry-run 3, excluding any individual-review or blocked books.

## Exact Recommendation For Next Write Pass

- Write with warning review: frankenstein
- Write with warning review: the-three-musketeers
- Write with warning review: a-tale-of-two-cities
- Write with warning review: around-the-world-in-eighty-days
- Write with warning review: cranford
- Write with warning review: little-fuzzy
- Write with warning review: macbeth
- Write with warning review: persuasion
- Write with warning review: pygmalion
- Write with warning review: sense-and-sensibility
- Write with warning review: the-adventures-of-tom-sawyer
- Write with warning review: the-door-in-the-wall
- Write with warning review: the-hound-of-the-baskervilles
- Write with warning review: the-king-in-yellow
- Write with warning review: the-life-and-adventures-of-robinson-crusoe
- Write with warning review: the-maltese-falcon
- Write with warning review: the-tempest
- Write with warning review: the-turn-of-the-screw
- Write with warning review: the-war-of-the-worlds
- Write with warning review: the-wendigo
- Write with warning review: wuthering-heights
- Write with warning review: anne-of-avonlea
- Write with warning review: five-weeks-in-a-balloon
- Write with warning review: moby-dick
- Write with warning review: tales-of-war

## Protected Folder Confirmation

- `app/client/assets/temp-books` was read but not modified.
- `app/client/assets/books/generated` was read for comparison but not modified.
- `app/client/assets/books/cloudflare-export` was not modified.
- Candidate outputs are review-only and live only under `app/client/assets/books/audit-reports/pilot-dry-run-3`.
