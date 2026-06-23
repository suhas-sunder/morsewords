# Story title display integrity audit

## Result

- Generated entries checked: 465
- Suspicious generated duplicate groups before: 0
- Suspicious protected public-payload duplicate groups before adapter normalization: 1
- Suspicious duplicate groups after: 0
- Generated parent-collection leakage candidates before: 2
- Protected public-payload parent-collection leakage candidates before: 10
- User-facing leakage candidates after canonical display normalization: 0
- SEO summary title metadata: 270/270 matching
- Validation result: pass

## Root cause and fix

The generated library manifest is the canonical user-facing title source. Ten older protected public payloads still contain `Andersen's Fairy Tales` as their manifest title, and the whole-book hydration path previously allowed that payload title to replace the canonical route title. The adapter now preserves the generated library title when public content is normalized. Two additional single-story generated records inherited their source collection title during pilot write pass 6; their generated metadata, preview hashes, and SEO title metadata are corrected, and the historical write plan now supplies the story title explicitly.

Cloudflare export files were audited but not changed. Summary bodies were preserved; their collection references remain provenance/context rather than title metadata.

## Generated metadata corrections

| Slug | Before | After | Source collection |
| --- | --- | --- | --- |
| for-the-duration-of-the-war | The Toys of Peace, and Other Papers | For the Duration of the War | The Toys of Peace, and Other Papers |
| the-story-of-the-inexperienced-ghost | Twelve Stories and a Dream | The Story of the Inexperienced Ghost | Twelve Stories and a Dream |

## Duplicate user-facing titles after fix

| Title | Slugs | Classification | Reason |
| --- | --- | --- | --- |
| Anne of Green Gables | anne-of-green-gables, anne-of-green-gables-gutenberg-45 | legitimate | Documented retained source/slug variant; duplicateResolutionSource records the deterministic source match. |
| The Count of Monte Cristo | the-count-of-monte-cristo, the-count-of-monte-cristo-gutenberg-1184 | legitimate | Documented retained source/slug variants; both records are explicitly marked manual-review. |
| The Secret Garden | the-secret-garden, the-secret-garden-gutenberg-113 | legitimate | Two documented Project Gutenberg editions (ebooks 17396 and 113), not anthology story extractions. |

## Required slug verification

| Slug | Expected | Actual | Status |
| --- | --- | --- | --- |
| the-dream-of-little-tuk | The Dream of Little Tuk | The Dream of Little Tuk | pass |
| the-false-collar | The False Collar | The False Collar | pass |
| the-naughty-boy | The Naughty Boy | The Naughty Boy | pass |
| the-red-shoes | The Red Shoes | The Red Shoes | pass |
| the-shadow | The Shadow | The Shadow | pass |
| the-story-of-a-mother | The Story of a Mother | The Story of a Mother | pass |
| the-ugly-duckling | The Ugly Duckling | The Ugly Duckling | pass |
| ole-luk-oie-the-dream-god | Ole-Luk-Oie, the Dream-God | Ole-Luk-Oie, the Dream-God | pass |
| little-ida-s-flowers | Little Ida's Flowers | Little Ida's Flowers | pass |
| the-steadfast-tin-soldier | The Steadfast Tin Soldier | The Steadfast Tin Soldier | pass |
| hansel-and-gretel | Hansel and Gretel | Hansel and Gretel | pass |
| little-red-riding-hood | Little Red Riding Hood | Little Red Riding Hood | pass |
| rumpelstiltskin | Rumpelstiltskin | Rumpelstiltskin | pass |
| the-frog-prince | The Frog-Prince | The Frog-Prince | pass |
| the-goose-girl | The Goose-Girl | The Goose-Girl | pass |
| the-golden-bird | The Golden Bird | The Golden Bird | pass |
| the-bamboo-cutter-and-the-moon-child | The Bamboo-Cutter and the Moon-Child | The Bamboo-Cutter and the Moon-Child | pass |
| the-goblin-of-adachigahara | The Goblin of Adachigahara | The Goblin of Adachigahara | pass |
| the-jelly-fish-and-the-monkey | The Jelly Fish and the Monkey | The Jelly Fish and the Monkey | pass |
| the-tongue-cut-sparrow | The Tongue-Cut Sparrow | The Tongue-Cut Sparrow | pass |

## Remaining documented cases

- 10 protected Cloudflare export payload titles remain stale by instruction; the display adapter now prevents them from replacing canonical titles, and the next separately authorized export should regenerate them.
- black-beauty: rights_report.json retains a documented non-display source-title variant (The rights evidence uses the short source title 'Black Beauty'; the user-facing generated title carries the source subtitle.)
- peter-pan: rights_report.json retains a documented non-display source-title variant (The rights evidence uses the short source title 'Peter Pan'; the user-facing generated title retains the catalog bracket title.)

## Protected paths

- Raw sources: unchanged (`app/client/assets/temp-books`)
- Cloudflare export: unchanged (`app/client/assets/books/cloudflare-export`)
- Story text: unchanged
- Generated metadata changed: true
- Route/display adapter changed: true
- SEO summary title metadata changed: true

## Recommendation

Summary batch 6 can resume after this branch is reviewed/merged; do not start it in this branch.
