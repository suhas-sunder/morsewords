# Batch-12 prose restoration

Exactly five authorized accepted books were corrected from their audited raw source. All five corrected readable bodies now match the narrowly sanitized raw tale bodies character-for-character.

## Authorized restoration targets

| Slug | Status | Raw/generated result | Preview impact |
| --- | --- | --- | --- |
| `ole-luk-oie-the-dream-god` | corrected pass | pass: exact character-for-character match after intentional artifact cleanup | preview rebuilt for the corrected content hash; opening/default text remains real, book-specific readable content |
| `the-story-of-the-old-man-who-made-withered-trees-to-flower` | corrected pass | pass: exact character-for-character match after intentional artifact cleanup | preview rebuilt for the corrected content hash; opening/default text remains real, book-specific readable content |
| `the-conceited-apple-branch` | corrected pass | pass: exact character-for-character match after intentional artifact cleanup | preview rebuilt for the corrected content hash; opening/default text remains real, book-specific readable content |
| `little-ida-s-flowers` | corrected pass | pass: exact character-for-character match after intentional artifact cleanup | preview rebuilt for the corrected content hash; opening/default text remains real, book-specific readable content |
| `the-steadfast-tin-soldier` | corrected pass | pass: exact character-for-character match after intentional artifact cleanup | preview rebuilt for the corrected content hash; opening/default text remains real, book-specific readable content |

Each target's preview was rebuilt because its content hash changed. The assets remain book-specific, begin at the first real readable content, and contain no generic fallback or source boilerplate.

## Other 15 batch-12 books

| Slug | Comparison | Omission found | Corrected here |
| --- | --- | --- | --- |
| `clever-hans` | exact character-for-character match after intentional artifact cleanup | no | no |
| `the-fisherman-and-his-wife` | mismatch: real wrapped prose line omitted: “by the seaside. The fisherman used to go out all day long a-fishing; and” | yes | no |
| `the-story-of-urashima-taro-the-fisher-lad` | exact character-for-character match after intentional artifact cleanup | no | no |
| `the-story-of-the-man-who-did-not-wish-to-die` | exact character-for-character match after intentional artifact cleanup | no | no |
| `the-happy-hunter-and-the-skillful-fisher` | exact character-for-character match after intentional artifact cleanup | no | no |
| `the-darning-needle` | exact character-for-character match after intentional artifact cleanup | no | no |
| `the-greenies` | mismatch: real wrapped prose line omitted: “by this pretty name. It is only human beings who do not. They give us” | yes | no |
| `the-loving-pair` | exact character-for-character match after intentional artifact cleanup | no | no |
| `the-roses-and-the-sparrows` | exact character-for-character match after intentional artifact cleanup | no | no |
| `shock-tactics` | mismatch: two real wrapped prose lines omitted, beginning “by this one splendid haul” and “By the time Bertie arrived” | yes | no |
| `canossa` | mismatch: real wrapped prose line omitted: “musicians’ strike on, I suppose you know.” | yes | no |
| `the-oversight` | mismatch: opening curly quotation mark omitted at the selected start boundary | yes | no |
| `the-penance` | exact character-for-character match after intentional artifact cleanup | no | no |
| `mark` | exact character-for-character match after intentional artifact cleanup | no | no |
| `quail-seed` | mismatch: opening curly quotation mark omitted at the selected start boundary | yes | no |

The independent all-20 comparison disproved the earlier assumption that only the five authorized targets were affected. Four out-of-scope books have additional real wrapped-line omissions, and two have an opening quotation-mark boundary loss. They are documented in the JSON report and were not modified because this branch is explicitly limited to the five named targets. Removed illustration placeholders, standalone star dividers, and numeric footnote markers were classified as intentional cleanup rather than omitted prose.

## Scope and protections

- Raw sources were read only and were not modified.
- Cloudflare exports were not modified.
- The 11 unresolved-source generated books were not touched.
- The three known duplicate/boundary skipped cases were not reintroduced.
- No unrelated generated book was modified.
- Dry-run batch 15 was not started.
- The current shared cleanup implementation uses the narrow media/byline rules introduced during write 14; this repair does not broadly refactor cleanup.
