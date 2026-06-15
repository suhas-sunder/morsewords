# at-the-earth-s-core

- Source: `app/client/assets/temp-books/At the Earth's Core.txt`
- Title: At the Earth's Core
- Author: Edgar Rice Burroughs
- Raw words: 52980
- Detected convention: standalone roman numeral sections
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 15 | 15 | 0 | yes |  |
| all-caps-title | 30 | 15 | 15 | no | weaker than selected strategy roman-only |
| isolated-title-case | 6 | 4 | 0 | no | weaker than selected strategy roman-only |
| special-front-back | 3 | 0 | 3 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L89: I
- L452: II
- L816: III
- L1110: IV
- L1474: V
- L1792: VI
- L2023: VII
- L2239: VIII

## Rejected TOC-like Examples

- L12: I TOWARD THE ETERNAL FIRES
- L13: II A STRANGE WORLD
- L14: III A CHANGE OF MASTERS
- L15: IV DIAN THE BEAUTIFUL
- L16: V SLAVES
- L17: VI THE BEGINNING OF HORROR
- L18: VII FREEDOM
- L19: VIII THE MAHAR TEMPLE
- L9: CONTENTS
- L11: PROLOGUE

## Section Size Sanity

- Sections: 15
- Min/median/max words: 1634/2968/7085
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
