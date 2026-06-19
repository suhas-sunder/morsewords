# Batch-12 prose restoration

Eleven batch-12 books have now been corrected from their audited raw source: the original five from the first restoration pass and six additional documented defects. All twenty batch-12 readable bodies now match their narrowly sanitized raw tale bodies character-for-character.

- Total corrected batch-12 books: 11
- Original first-pass corrections: 5
- Additional corrections in this pass: 6
- Remaining batch-12 prose omissions: 0
- Remaining missing opening-quote defects: 0

## Corrected books

| Slug | Restoration pass | Defect type | Restored excerpt | Preview impact |
| --- | --- | --- | --- | --- |
| `ole-luk-oie-the-dream-god` | original first pass | wrapped-line prose omission | by he caught hold of one side of the sugar heart and held it fast, and | preview already reflected the corrected content hash; opening/default text remains real, book-specific readable content |
| `the-story-of-the-old-man-who-made-withered-trees-to-flower` | original first pass | wrapped-line prose omission | by erect with pride and looking fondly at his master as if to say, “You | preview already reflected the corrected content hash; opening/default text remains real, book-specific readable content |
| `the-conceited-apple-branch` | original first pass | two wrapped-line prose omissions | By and by an old woman came into the field and, with a blunt knife<br>by Heaven with another kind of loveliness, and although they differ in | preview already reflected the corrected content hash; opening/default text remains real, book-specific readable content |
| `little-ida-s-flowers` | original first pass | missing opening quotation mark and wrapped-line prose omission | "MY POOR flowers are quite faded!"<br>music with them. Wild hyacinths and little white snowdrops jingled merry | preview already reflected the corrected content hash; opening/default text remains real, book-specific readable content |
| `the-steadfast-tin-soldier` | original first pass | wrapped-line prose omission | by grief, no one could say. He looked at the little lady, she looked at | preview already reflected the corrected content hash; opening/default text remains real, book-specific readable content |
| `the-fisherman-and-his-wife` | additional follow-up | wrapped-line prose omission | by the seaside. The fisherman used to go out all day long a-fishing; and | preview rebuilt for the corrected content hash; opening/default text remains real, book-specific readable content |
| `the-greenies` | additional follow-up | wrapped-line prose omission | by this pretty name. It is only human beings who do not. They give us | preview rebuilt for the corrected content hash; opening/default text remains real, book-specific readable content |
| `shock-tactics` | additional follow-up | two wrapped-line prose omissions | by this one splendid haul.<br>By the time Bertie arrived his mother had discussed every possible and | preview rebuilt for the corrected content hash; opening/default text remains real, book-specific readable content |
| `canossa` | additional follow-up | wrapped-line prose omission | musicians’ strike on, I suppose you know.” | preview rebuilt for the corrected content hash; opening/default text remains real, book-specific readable content |
| `the-oversight` | additional follow-up | opening curly quotation mark omitted at the selected start boundary | “It’s like a Chinese puzzle | preview rebuilt for the corrected content hash; opening/default text remains real, book-specific readable content |
| `quail-seed` | additional follow-up | opening curly quotation mark omitted at the selected start boundary | “The outlook is not encouraging for us smaller businesses | preview rebuilt for the corrected content hash; opening/default text remains real, book-specific readable content |

The excerpts above are intentionally short and source-backed. They do not include title, table-of-contents, source, license, transcriber, contributor, byline, or parent-collection material.

## All 20 batch-12 comparisons

| Slug | Raw/generated body comparison | Corrected on this branch |
| --- | --- | --- |
| `ole-luk-oie-the-dream-god` | pass: exact character-for-character match after intentional artifact cleanup | yes |
| `clever-hans` | pass: exact character-for-character match after intentional artifact cleanup | no |
| `the-fisherman-and-his-wife` | pass: exact character-for-character match after intentional artifact cleanup | yes |
| `the-story-of-the-old-man-who-made-withered-trees-to-flower` | pass: exact character-for-character match after intentional artifact cleanup | yes |
| `the-story-of-urashima-taro-the-fisher-lad` | pass: exact character-for-character match after intentional artifact cleanup | no |
| `the-story-of-the-man-who-did-not-wish-to-die` | pass: exact character-for-character match after intentional artifact cleanup | no |
| `the-happy-hunter-and-the-skillful-fisher` | pass: exact character-for-character match after intentional artifact cleanup | no |
| `the-conceited-apple-branch` | pass: exact character-for-character match after intentional artifact cleanup | yes |
| `the-darning-needle` | pass: exact character-for-character match after intentional artifact cleanup | no |
| `the-greenies` | pass: exact character-for-character match after intentional artifact cleanup | yes |
| `the-loving-pair` | pass: exact character-for-character match after intentional artifact cleanup | no |
| `little-ida-s-flowers` | pass: exact character-for-character match after intentional artifact cleanup | yes |
| `the-roses-and-the-sparrows` | pass: exact character-for-character match after intentional artifact cleanup | no |
| `the-steadfast-tin-soldier` | pass: exact character-for-character match after intentional artifact cleanup | yes |
| `shock-tactics` | pass: exact character-for-character match after intentional artifact cleanup | yes |
| `canossa` | pass: exact character-for-character match after intentional artifact cleanup | yes |
| `the-oversight` | pass: exact character-for-character match after intentional artifact cleanup | yes |
| `the-penance` | pass: exact character-for-character match after intentional artifact cleanup | no |
| `mark` | pass: exact character-for-character match after intentional artifact cleanup | no |
| `quail-seed` | pass: exact character-for-character match after intentional artifact cleanup | yes |

The all-20 comparison is a hard verifier check. Any remaining wrapped-line omission, missing opening punctuation, or other sanitized raw/generated body mismatch fails `npm run books:batch-12-prose-restore`.

## Scope and protections

- Raw sources were read only and were not modified.
- Cloudflare exports were not modified.
- The 11 unresolved-source generated books were not touched.
- The three known duplicate/boundary skipped cases were not reintroduced.
- No unrelated generated book was modified.
- Dry-run batch 15 was not started.
- The current shared cleanup implementation uses the narrow media/byline rules introduced during write 14; this repair does not broadly refactor cleanup.
