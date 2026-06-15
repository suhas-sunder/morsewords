# the-king-in-yellow

- Source: `app/client/assets/temp-books/The King in Yellow.txt`
- Title: The King in Yellow
- Author: Robert W. Chambers
- Raw words: 75998
- Detected convention: standalone roman numeral sections
- Confidence: high (0.925)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 29 | 23 | 6 | yes |  |
| all-caps-title | 50 | 34 | 16 | no | weaker than selected strategy roman-only |
| isolated-title-case | 108 | 105 | 3 | no | weaker than selected strategy roman-only |
| arabic-numbered-title | 3 | 3 | 0 | no | weaker than selected strategy roman-only |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L2006: IV
- L2489: I
- L2724: II
- L3166: III
- L3324: I
- L3593: II
- L4172: I
- L4294: II

## Rejected TOC-like Examples

- L66: I
- L401: II
- L903: III
- L1452: I
- L1640: II
- L1767: III

## Section Size Sanity

- Sections: 23
- Min/median/max words: 978/1982/4736
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
