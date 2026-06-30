# Book Content Safety and Completeness Sweep

## 1. Executive result

Book content safety and completeness sweep passed

Remote production content-safety validation is pending owner upload of `app/client/assets/books/cloudflare-updated-export` to Cloudflare/R2.

## 2. Books inspected

- Books inspected: 519
- Generated payloads inspected: 519
- Startup previews inspected: 519
- Existing local export payloads inspected: 519

## 3. Content-safety categories inspected

- racial and ethnic slurs
- dehumanizing identity labels
- antisemitic or anti-Roma slurs
- anti-Indigenous slurs
- homophobic slurs
- misogynistic slurs
- ableist slurs
- explicit sexual terms inappropriate for this public typing/Morse site
- extreme profanity where unsuitable for public practice content
- context-sensitive terms flagged rather than blindly changed

## 4. Human-readable masking policy

Reports use category labels and masked patterns only; exact offensive terms are kept out of markdown output.

## 5. Safe replacements applied

- Replacement occurrences applied: 425
- Books with generated payload changes: 91
- Public preview files changed: 91
- SEO summaries changed: 0

| Category | Masked pattern | Occurrences | Books |
| --- | --- | --- | --- |
| anti-Indigenous slurs | anti-Indigenous slur for woman singular | 11 | 6 |
| anti-Indigenous slurs | anti-Indigenous slur for women plural | 3 | 2 |
| anti-Indigenous slurs | anti-Indigenous slur plural | 5 | 4 |
| anti-Indigenous slurs | anti-Indigenous slur singular | 77 | 6 |
| antisemitic slurs | antisemitic slur singular | 1 | 1 |
| misogynistic slurs | misogynistic slur plural | 7 | 5 |
| misogynistic slurs | misogynistic slur singular | 30 | 18 |
| racial and ethnic slurs | severe anti-Black slur before person noun | 1 | 1 |
| racial and ethnic slurs | severe anti-Black slur plural | 20 | 10 |
| racial and ethnic slurs | severe anti-Black slur singular | 32 | 16 |
| racial and ethnic slurs | severe anti-Black slur used adjectivally | 15 | 9 |
| racial and ethnic slurs / historical identity labels | N**** historical label before person noun | 7 | 5 |
| racial and ethnic slurs / historical identity labels | N**** historical label plural | 75 | 29 |
| racial and ethnic slurs / historical identity labels | N**** historical label singular | 84 | 31 |
| racial and ethnic slurs / historical identity labels | N**** historical label used adjectivally | 57 | 30 |

## 6. Ambiguous passages reviewed or deferred

| Category | Masked pattern | Occurrences | Books |
| --- | --- | --- | --- |
| anti-Roma slurs / context-sensitive labels | G**** / R*** context-sensitive label | 427 | 54 |
| homophobic slurs / context-sensitive historical words | F***/D*** context-sensitive label | 660 | 41 |
| ableist slurs / context-sensitive historical words | ableist/context-sensitive labels | 1091 | 135 |
| explicit sexual terms inappropriate for practice surfaces | explicit sexual term | 4 | 1 |
| dehumanizing identity labels | dehumanizing identity label | 1875 | 147 |

## 7. The Call of Cthulhu owner-reported case result

- Result: owner-reported masked racial identity label was sanitized in generated text and previews
- Generated payload sanitized: true
- Startup preview sanitized: true
- Updated export sanitized: true

## 8. Public preview/snippet sanitization result

Startup previews sanitized: true

## 9. Print route/public surface sanitization result

Print routes use generated sections, so section-level cleanup applies to print content without separate print payload changes.

## 10. Completeness/chapter extraction audit result

Result: pass; warnings are heuristic review signals only

| Slug | Sections | Words | Result |
| --- | --- | --- | --- |
| five-little-friends | 2 | 11574 | pass |
| middlemarch | 88 | 318237 | pass |
| the-adventures-of-roderick-random | 69 | 188895 | pass |
| the-bottle-imp | 1 | 12211 | pass |
| the-call-of-cthulhu | 3 | 11811 | pass |
| the-jungle-book | 14 | 51118 | pass |
| the-leavenworth-case | 39 | 110828 | pass |
| walden | 18 | 107130 | pass |

| Slug | Severity | Reason |
| --- | --- | --- |
| alices-adventures-in-wonderland | warning | Long generated text ending may need human review for truncation. |
| anna-karenina | warning | Long generated text ending may need human review for truncation. |
| botchan | warning | Long generated text ending may need human review for truncation. |
| don-quixote | warning | Long generated text ending may need human review for truncation. |
| dracula | warning | Long generated text ending may need human review for truncation. |
| jane-eyre | warning | Long generated text ending may need human review for truncation. |
| little-women | warning | Long generated text ending may need human review for truncation. |
| rainbow-valley | warning | Long generated text ending may need human review for truncation. |
| sense-and-sensibility | warning | Long generated text ending may need human review for truncation. |
| the-jungle-book | warning | Long generated text ending may need human review for truncation. |
| the-picture-of-dorian-gray | warning | Long generated text ending may need human review for truncation. |
| the-sea-wolf | warning | Long generated text ending may need human review for truncation. |
| the-secret-garden | warning | Long generated text ending may need human review for truncation. |
| the-secret-garden-gutenberg-113 | warning | Long generated text ending may need human review for truncation. |
| the-water-babies | warning | Long generated text ending may need human review for truncation. |
| through-the-looking-glass | warning | Long generated text ending may need human review for truncation. |
| the-house-without-a-key | warning | Long generated text ending may need human review for truncation. |
| a-journey-to-the-centre-of-the-earth | warning | Long generated text ending may need human review for truncation. |
| the-red-thumb-mark | warning | Long generated text ending may need human review for truncation. |
| room-13 | warning | Long generated text ending may need human review for truncation. |
| macbeth | warning | Long generated text ending may need human review for truncation. |
| the-hound-of-the-baskervilles | warning | Long generated text ending may need human review for truncation. |
| the-maltese-falcon | warning | Long generated text ending may need human review for truncation. |
| a-midsummer-night-s-dream | warning | Long generated text ending may need human review for truncation. |
| agamemnon-of-aeschylus | warning | Long generated text ending may need human review for truncation. |
| an-ideal-husband | warning | Long generated text ending may need human review for truncation. |
| romeo-and-juliet | warning | Long generated text ending may need human review for truncation. |
| the-importance-of-being-earnest-a-trivial-comedy-for-serious-people | warning | Long generated text ending may need human review for truncation. |
| the-mystery-of-edwin-drood | warning | Long generated text ending may need human review for truncation. |
| a-japanese-blossom | warning | Long generated text ending may need human review for truncation. |
| five-children-and-it | warning | Long generated text ending may need human review for truncation. |
| herland | warning | Long generated text ending may need human review for truncation. |
| hero-myths-and-legends-of-the-british-race | warning | Long generated text ending may need human review for truncation. |
| howards-end | warning | Long generated text ending may need human review for truncation. |
| love-among-the-chickens | warning | Long generated text ending may need human review for truncation. |
| parnassus-on-wheels | warning | Long generated text ending may need human review for truncation. |
| pollyanna | warning | Long generated text ending may need human review for truncation. |
| the-adventures-of-pinocchio | warning | Long generated text ending may need human review for truncation. |
| typhoon | warning | Long generated text ending may need human review for truncation. |
| the-laughing-cavalier-the-story-of-the-ancestor-of-the-scarlet-pimpernel | warning | Long generated text ending may need human review for truncation. |
| the-dunwich-horror | warning | Long generated text ending may need human review for truncation. |
| the-scarlet-letter | warning | Long generated text ending may need human review for truncation. |
| a-study-in-scarlet | warning | Long generated text ending may need human review for truncation. |
| under-the-red-dragon | warning | Long generated text ending may need human review for truncation. |
| murder-in-the-maze | warning | Long generated text ending may need human review for truncation. |
| at-the-mountains-of-madness | warning | Long generated text ending may need human review for truncation. |
| the-innocence-of-father-brown | warning | Long generated text ending may need human review for truncation. |
| the-dreams-in-the-witch-house | warning | Long generated text ending may need human review for truncation. |
| the-shadow-out-of-time | warning | Long generated text ending may need human review for truncation. |
| the-whisperer-in-darkness | warning | Long generated text ending may need human review for truncation. |
| the-murders-in-the-rue-morgue | warning | Long generated text ending may need human review for truncation. |
| the-mysterious-affair-at-styles | warning | Long generated text ending may need human review for truncation. |
| the-leavenworth-case | warning | Long generated text ending may need human review for truncation. |
| middlemarch | warning | Long generated text ending may need human review for truncation. |

## 11. Books repaired for incomplete extraction

None.

## 12. Books deferred or blocked, if any

None.

## 13. Updated Cloudflare export folder result

- Folder: `app/client/assets/books/cloudflare-updated-export`
- Written: true
- File count: 521
- Book payloads: 519
- Manifest files: 2
- Tracked files: 0
- Ignored by git: true
- Export type: complete replacement, not a delta

## 14. Files intentionally not tracked

- `app/client/assets/books/cloudflare-export`
- `app/client/assets/books/cloudflare-updated-export`

## 15. Protected folder status

- Temp books modified by this script: false
- cloudflare-export tracked files: 0
- cloudflare-updated-export tracked files: 0

## 16. Remaining blockers

None for the local content-safety/completeness sweep. Remote production validation remains pending owner upload.

## 17. Required owner upload instructions

Upload app/client/assets/books/cloudflare-updated-export as a complete replacement for the current assets.morsewords.com book payload set. Because this folder contains the full 521-file export, sync/delete is acceptable after confirming the destination prefix is correct.

